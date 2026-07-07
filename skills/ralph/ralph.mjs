#!/usr/bin/env node
// Ralph loop — run an agent CLI over a directory of Markdown issue files.
// Requires only Node.js, which is already present wherever the pi CLI runs.

import { spawn } from 'node:child_process';
import { existsSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { basename, join, resolve } from 'node:path';
import { parseArgs } from 'node:util';
import process from 'node:process';

const DEFAULT_PROMPT =
  'Implement the issue described in the given issues-file. ' +
  'Rebuild the project and run newly implemented unit tests. ' +
  'Iterate until build and tests succeed. Modify the issue ' +
  "status to 'done' when the issue is resolved.";

const USAGE = `usage: ralph.mjs [-h] [-d DIRECTORY] [-c CLI] [-m MODEL] [-p PROMPT]
                 [--no-print] [-v] [directory]

Run a Ralph loop on issues in a given directory

positional arguments:
  directory             Directory containing issues as .md files

options:
  -h, --help            show this help message and exit
  -d, --directory DIRECTORY
                        Directory containing issues as .md files
  -c, --cli CLI         Agent CLI command to invoke for each issue. Can
                        include flags, e.g. 'pi --provider anthropic' or
                        'claude'. (default: $RALPH_CLI if set, else pi)
  -m, --model MODEL     Model to pass to the agent CLI via --model, e.g.
                        'anthropic/claude-sonnet-5' or 'gpt-5.4:medium'.
                        (default: $RALPH_MODEL if set, else omitted)
  -p, --prompt PROMPT   Custom prompt to use (default: ${DEFAULT_PROMPT})
  --no-print            Omit the --print flag from the agent CLI invocation.
                        Use for CLIs that do not support --print.
  -v, --verbose         Stream the agent's full output live instead of the
                        one-line status
`;

function parseCliArgs(argv) {
  let parsed;
  try {
    parsed = parseArgs({
      args: argv,
      allowPositionals: true,
      options: {
        directory: { type: 'string', short: 'd' },
        cli: { type: 'string', short: 'c', default: process.env.RALPH_CLI || 'pi' },
        model: { type: 'string', short: 'm', default: process.env.RALPH_MODEL },
        prompt: { type: 'string', short: 'p', default: DEFAULT_PROMPT },
        'no-print': { type: 'boolean', default: false },
        verbose: { type: 'boolean', short: 'v', default: false },
        help: { type: 'boolean', short: 'h', default: false },
      },
    });
  } catch (err) {
    process.stderr.write(`${USAGE}\nerror: ${err.message}\n`);
    process.exit(2);
  }

  if (parsed.values.help) {
    process.stdout.write(USAGE);
    process.exit(0);
  }

  const directory = parsed.positionals[0] ?? parsed.values.directory;
  if (!directory) {
    process.stderr.write(`${USAGE}\nerror: directory is required\n`);
    process.exit(2);
  }

  return {
    directory,
    cli: parsed.values.cli,
    model: parsed.values.model,
    prompt: parsed.values.prompt,
    noPrint: parsed.values['no-print'],
    verbose: parsed.values.verbose,
  };
}

// Split a command string into argv tokens, honoring quotes and backslashes
// (equivalent of Python's shlex.split for the --cli value).
function shellSplit(command) {
  const tokens = [];
  let current = '';
  let hasToken = false;
  let quote = null;
  for (let i = 0; i < command.length; i++) {
    const ch = command[i];
    if (quote === "'") {
      if (ch === "'") quote = null;
      else current += ch;
    } else if (quote === '"') {
      if (ch === '"') quote = null;
      else if (ch === '\\' && i + 1 < command.length && '"\\'.includes(command[i + 1])) {
        current += command[++i];
      } else current += ch;
    } else if (ch === "'" || ch === '"') {
      quote = ch;
      hasToken = true;
    } else if (ch === '\\' && i + 1 < command.length) {
      current += command[++i];
      hasToken = true;
    } else if (/\s/.test(ch)) {
      if (hasToken || current) tokens.push(current);
      current = '';
      hasToken = false;
    } else {
      current += ch;
    }
  }
  if (quote) throw new Error(`unbalanced quote in command: ${command}`);
  if (hasToken || current) tokens.push(current);
  return tokens;
}

function readFrontmatterField(file, field) {
  let lines;
  try {
    lines = readFileSync(file, 'utf-8').split('\n');
  } catch {
    return '';
  }
  if (!lines.length || lines[0].trim() !== '---') return '';
  for (const line of lines.slice(1)) {
    if (line.trim() === '---') break;
    if (line.startsWith(`${field}:`)) return line.slice(field.length + 1).trim();
  }
  return '';
}

const getStatus = (file) => readFrontmatterField(file, 'status');
const getTitle = (file) =>
  readFrontmatterField(file, 'title') || basename(file).replace(/\.md$/, '');

function formatElapsed(seconds) {
  const total = Math.floor(seconds);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  if (hours) return `${hours}h${String(minutes).padStart(2, '0')}m${String(secs).padStart(2, '0')}s`;
  if (minutes) return `${minutes}m${String(secs).padStart(2, '0')}s`;
  return `${secs}s`;
}

function progressBar(completed, total, width = 24) {
  if (total <= 0) return '';
  const fraction = completed / total;
  const filled = Math.floor(width * fraction);
  const bar = '█'.repeat(filled) + '░'.repeat(width - filled);
  const pct = String(Math.round(fraction * 100)).padStart(3, ' ');
  return `[${bar}] ${pct}% (${completed}/${total})`;
}

const SPINNER_FRAMES = '⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏';

// One process-wide SIGINT handler; runAgent points it at the active child.
let activeChild = null;
let clearActiveSpinner = null;
process.on('SIGINT', () => {
  if (clearActiveSpinner) clearActiveSpinner();
  if (activeChild) activeChild.kill('SIGTERM');
  process.stderr.write(
    '\nInterrupted — issues already marked done stay done; re-run ralph to continue.\n'
  );
  process.exit(130);
});

// Run the agent CLI, showing live feedback while it works.
// Resolves to { code, stdout, stderr, elapsed }.
function runAgent(cmd, cmdArgs, verbose, statusPrefix) {
  return new Promise((resolvePromise, rejectPromise) => {
    const isTty = Boolean(process.stdout.isTTY);
    const stdoutChunks = [];
    const stderrChunks = [];
    let lastLine = '';
    const start = process.hrtime.bigint();

    const child = spawn(cmd, cmdArgs, { stdio: ['ignore', 'pipe', 'pipe'] });

    child.stdout.setEncoding('utf-8');
    child.stderr.setEncoding('utf-8');
    child.stdout.on('data', (chunk) => {
      stdoutChunks.push(chunk);
      if (verbose) {
        process.stdout.write(chunk.replace(/^(?=.)/gm, '  │ '));
      } else {
        const lines = chunk.split('\n').map((l) => l.trim()).filter(Boolean);
        if (lines.length) lastLine = lines[lines.length - 1];
      }
    });
    child.stderr.on('data', (chunk) => stderrChunks.push(chunk));

    let spinnerTimer = null;
    let frame = 0;
    if (isTty && !verbose) {
      spinnerTimer = setInterval(() => {
        const elapsed = formatElapsed(Number(process.hrtime.bigint() - start) / 1e9);
        let last = lastLine || 'waiting for agent...';
        if (last.length > 60) last = `${last.slice(0, 57)}...`;
        const spinner = SPINNER_FRAMES[frame % SPINNER_FRAMES.length];
        process.stdout.write(`\r\x1b[2K  ${spinner} ${statusPrefix} ${elapsed} │ ${last}`);
        frame += 1;
      }, 250);
    }

    const cleanup = () => {
      if (spinnerTimer) clearInterval(spinnerTimer);
      if (isTty && !verbose) process.stdout.write('\r\x1b[2K');
      activeChild = null;
      clearActiveSpinner = null;
    };
    activeChild = child;
    clearActiveSpinner = cleanup;

    child.on('error', (err) => {
      cleanup();
      rejectPromise(err);
    });
    child.on('close', (code) => {
      cleanup();
      resolvePromise({
        code: code ?? 1,
        stdout: stdoutChunks.join(''),
        stderr: stderrChunks.join(''),
        elapsed: Number(process.hrtime.bigint() - start) / 1e9,
      });
    });
  });
}

async function ralph(args) {
  let cliParts;
  try {
    cliParts = shellSplit(args.cli);
  } catch (err) {
    process.stderr.write(`Error: invalid --cli value: ${err.message}\n`);
    process.exit(2);
  }
  const directory = args.directory;

  if (!existsSync(directory)) {
    process.stderr.write(`Error: directory '${directory}' does not exist.\n`);
    process.exit(1);
  }
  if (!statSync(directory).isDirectory()) {
    process.stderr.write(`Error: '${directory}' is not a directory.\n`);
    process.exit(1);
  }

  const issues = (await readdir(directory))
    .filter((name) => name.endsWith('.md') && !name.startsWith('agent.'))
    .sort()
    .map((name) => join(directory, name));

  const pending = [];
  for (const issue of issues) {
    if (getStatus(issue) === 'done') {
      console.log(`Skipping ${issue} (status: done)`);
    } else {
      pending.push(issue);
    }
  }

  const total = pending.length;
  if (total === 0) {
    console.log(
      `Nothing to do: no pending issues in ${directory} (${issues.length} total, all done).`
    );
    return;
  }

  console.log(
    `\nRalph loop: ${total} pending issue${total === 1 ? '' : 's'} ` +
      `in ${directory} (${issues.length - total} already done)`
  );
  console.log(`Agent CLI: ${args.cli}${args.model ? ` --model ${args.model}` : ''}`);

  const runStart = process.hrtime.bigint();
  let doneCount = 0;
  let incompleteCount = 0;
  let failedCount = 0;

  for (const [index0, issue] of pending.entries()) {
    const index = index0 + 1;
    const name = basename(issue);
    console.log(`\n${progressBar(index - 1, total)}`);
    console.log(`[${index}/${total}] Processing issue: ${issue}`);
    console.log(`        Title: ${getTitle(issue)}`);

    const issueContent = readFileSync(issue, 'utf-8');
    const fullPrompt = `${args.prompt}\n\nIssue file (${resolve(issue)}):\n\n${issueContent}`;

    const cmdArgs = cliParts.slice(1);
    if (!args.noPrint) cmdArgs.push('--print');
    if (args.model) cmdArgs.push('--model', args.model);
    cmdArgs.push(fullPrompt);

    let result;
    try {
      result = await runAgent(cliParts[0], cmdArgs, args.verbose, `[${index}/${total}] ${name} │`);
    } catch (err) {
      failedCount += 1;
      console.log(`  ✗ Agent failed for ${name} (could not start: ${err.message})`);
      continue;
    }

    // Preserve the transcript even on failure — it is the audit trail
    // for diagnosing what the agent did before it stopped.
    if (result.stdout) {
      writeFileSync(join(directory, `agent.${name}`), result.stdout);
    }

    if (result.code !== 0) {
      failedCount += 1;
      console.log(
        `  ✗ Agent failed for ${name} (exit ${result.code}, ${formatElapsed(result.elapsed)})`
      );
      const tail = result.stderr.trim().split('\n').filter(Boolean).slice(-5);
      for (const line of tail) console.log(`    stderr: ${line}`);
      continue;
    }

    const finalStatus = getStatus(issue);
    if (finalStatus === 'done') {
      doneCount += 1;
      console.log(`  ✓ Done: ${name} in ${formatElapsed(result.elapsed)}`);
    } else {
      incompleteCount += 1;
      console.log(
        `  ⚠ Agent finished in ${formatElapsed(result.elapsed)} but ${name} status is ` +
          `'${finalStatus || 'missing'}', not 'done' — re-run ralph to retry it`
      );
    }
  }

  const totalElapsed = Number(process.hrtime.bigint() - runStart) / 1e9;
  console.log(`\n${progressBar(total, total)}`);
  console.log(
    `Summary: ${doneCount} done, ${incompleteCount} incomplete, ` +
      `${failedCount} failed of ${total} pending (total ${formatElapsed(totalElapsed)})`
  );
  if (incompleteCount || failedCount) process.exit(1);
}

await ralph(parseCliArgs(process.argv.slice(2)));
