import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import {
  existsSync,
  mkdtempSync,
  writeFileSync,
  chmodSync,
  readFileSync,
  readdirSync,
  rmSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const RALPH = join(ROOT, 'skills', 'ralph', 'ralph.mjs');

describe('ralph.mjs', () => {
  test('file exists', () => {
    assert.ok(existsSync(RALPH), 'skills/ralph/ralph.mjs not found');
  });

  test('passes syntax check', () => {
    try {
      execFileSync('node', ['--check', RALPH], { stdio: 'pipe' });
    } catch (err) {
      assert.fail(`Syntax error in ralph.mjs:\n${err.stderr?.toString() ?? err.message}`);
    }
  });

  test('--help exits cleanly and shows usage', () => {
    const stdout = execFileSync('node', [RALPH, '--help'], { stdio: 'pipe' }).toString();
    assert.match(stdout, /usage: ralph\.mjs/);
    assert.match(stdout, /--no-print/);
  });

  test('errors when directory is missing', () => {
    try {
      execFileSync('node', [RALPH], { stdio: 'pipe' });
      assert.fail('should exit non-zero without a directory');
    } catch (err) {
      assert.equal(err.status, 2);
      assert.match(err.stderr.toString(), /directory is required/);
    }
  });

  test('processes todo issues, skips done issues and its own agent.* output', () => {
    const dir = mkdtempSync(join(tmpdir(), 'ralph-test-'));
    try {
      writeFileSync(
        join(dir, '001-todo.md'),
        '---\ntitle: Todo issue\nstatus: todo\n---\nDo the thing.\n'
      );
      writeFileSync(
        join(dir, '002-done.md'),
        '---\ntitle: Done issue\nstatus: done\n---\nAlready done.\n'
      );
      writeFileSync(join(dir, 'agent.001-todo.md'), 'stale transcript from a previous run\n');

      const stub = join(dir, 'stub-cli.sh');
      writeFileSync(stub, '#!/usr/bin/env bash\necho "stub ran: $*"\n');
      chmodSync(stub, 0o755);

      let stdout;
      let exitCode = 0;
      try {
        stdout = execFileSync(
          'node',
          [RALPH, dir, '--cli', stub, '--no-print'],
          { stdio: 'pipe' }
        ).toString();
      } catch (err) {
        // ralph exits 1 when an issue was not marked done — the stub CLI
        // never updates the status, so that is the expected outcome here
        stdout = err.stdout?.toString() ?? '';
        exitCode = err.status;
      }

      assert.equal(exitCode, 1, 'ralph should exit 1 when issues remain incomplete');
      assert.match(stdout, /Processing issue: .*001-todo\.md/);
      assert.match(stdout, /Skipping .*002-done\.md \(status: done\)/);
      assert.match(stdout, /\[1\/1\]/, 'progress counter [i/N] should be shown');
      assert.match(stdout, /100%/, 'progress bar percent should be shown');
      assert.match(stdout, /Summary: 0 done, 1 incomplete, 0 failed/);
      assert.doesNotMatch(stdout, /Processing issue: .*agent\./, 'agent.* output must not be processed');

      const files = readdirSync(dir).filter((f) => f.startsWith('agent.agent.'));
      assert.deepEqual(files, [], 'ralph must not re-process its own agent.* output files');

      const transcript = readFileSync(join(dir, 'agent.001-todo.md'), 'utf-8');
      assert.match(transcript, /stub ran: /, 'agent output file should contain the CLI response');
      assert.ok(
        transcript.includes(join(dir, '001-todo.md')),
        'prompt should contain the full path to the issue file'
      );
      assert.ok(!existsSync(join(dir, 'agent.002-done.md')), 'done issues must not be processed');
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  test('exits 0 and reports done when the agent marks the issue done', () => {
    const dir = mkdtempSync(join(tmpdir(), 'ralph-test-'));
    try {
      const issue = join(dir, '001-todo.md');
      writeFileSync(issue, '---\ntitle: Todo issue\nstatus: todo\n---\nDo the thing.\n');

      // Stub agent that "implements" the issue by flipping its status to done
      const stub = join(dir, 'stub-cli.sh');
      writeFileSync(
        stub,
        `#!/usr/bin/env bash\nsed -i 's/status: todo/status: done/' '${issue}'\necho "implemented"\n`
      );
      chmodSync(stub, 0o755);

      const stdout = execFileSync(
        'node',
        [RALPH, dir, '--cli', stub, '--no-print'],
        { stdio: 'pipe' }
      ).toString();

      assert.match(stdout, /✓ Done: 001-todo\.md/);
      assert.match(stdout, /Summary: 1 done, 0 incomplete, 0 failed/);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  test('defaults CLI and model from RALPH_CLI / RALPH_MODEL env vars', () => {
    const dir = mkdtempSync(join(tmpdir(), 'ralph-test-'));
    try {
      const issue = join(dir, '001-todo.md');
      writeFileSync(issue, '---\ntitle: Todo issue\nstatus: todo\n---\nDo the thing.\n');

      // Stub echoes its args so we can assert what ralph invoked it with
      const stub = join(dir, 'stub-cli.sh');
      writeFileSync(
        stub,
        `#!/usr/bin/env bash\necho "args: $*"\nsed -i 's/status: todo/status: done/' '${issue}'\n`
      );
      chmodSync(stub, 0o755);

      // No --cli / --model flags: both must come from the environment
      const stdout = execFileSync('node', [RALPH, dir, '--no-print'], {
        stdio: 'pipe',
        env: { ...process.env, RALPH_CLI: stub, RALPH_MODEL: 'test-model:high' },
      }).toString();

      assert.match(stdout, /✓ Done: 001-todo\.md/);
      const transcript = readFileSync(join(dir, 'agent.001-todo.md'), 'utf-8');
      assert.match(
        transcript,
        /args: --model test-model:high /,
        'model from RALPH_MODEL should be passed to the CLI'
      );
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  test('splits a --cli value with flags and quotes like a shell would', () => {
    const dir = mkdtempSync(join(tmpdir(), 'ralph-test-'));
    try {
      const issue = join(dir, '001-todo.md');
      writeFileSync(issue, '---\ntitle: Todo issue\nstatus: todo\n---\nDo the thing.\n');

      const stub = join(dir, 'stub-cli.sh');
      writeFileSync(
        stub,
        `#!/usr/bin/env bash\necho "arg1=$1 arg2=$2"\nsed -i 's/status: todo/status: done/' '${issue}'\n`
      );
      chmodSync(stub, 0o755);

      const stdout = execFileSync(
        'node',
        [RALPH, dir, '--cli', `${stub} --provider "some provider"`, '--no-print'],
        { stdio: 'pipe' }
      ).toString();

      assert.match(stdout, /✓ Done: 001-todo\.md/);
      const transcript = readFileSync(join(dir, 'agent.001-todo.md'), 'utf-8');
      assert.match(
        transcript,
        /arg1=--provider arg2=some provider/,
        'quoted flag values in --cli should stay one argument'
      );
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  test('reports a failed agent run and preserves the partial transcript', () => {
    const dir = mkdtempSync(join(tmpdir(), 'ralph-test-'));
    try {
      writeFileSync(
        join(dir, '001-todo.md'),
        '---\ntitle: Todo issue\nstatus: todo\n---\nDo the thing.\n'
      );

      const stub = join(dir, 'stub-cli.sh');
      writeFileSync(stub, '#!/usr/bin/env bash\necho "partial work"\necho "boom" >&2\nexit 3\n');
      chmodSync(stub, 0o755);

      let stdout = '';
      let exitCode = 0;
      try {
        execFileSync('node', [RALPH, dir, '--cli', stub, '--no-print'], {
          stdio: 'pipe',
        });
      } catch (err) {
        stdout = err.stdout?.toString() ?? '';
        exitCode = err.status;
      }

      assert.equal(exitCode, 1);
      assert.match(stdout, /✗ Agent failed for 001-todo\.md \(exit 3/);
      assert.match(stdout, /stderr: boom/);
      assert.match(stdout, /Summary: 0 done, 0 incomplete, 1 failed/);
      assert.match(
        readFileSync(join(dir, 'agent.001-todo.md'), 'utf-8'),
        /partial work/,
        'transcript should be written even when the agent fails'
      );
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
