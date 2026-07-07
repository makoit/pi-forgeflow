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
const RALPH_PY = join(ROOT, 'skills', 'ralph', 'ralph.py');

describe('ralph.py', () => {
  test('file exists', () => {
    assert.ok(existsSync(RALPH_PY), 'skills/ralph/ralph.py not found');
  });

  test('passes Python syntax check', () => {
    try {
      execFileSync('python3', ['-m', 'py_compile', RALPH_PY], {
        stdio: 'pipe',
      });
    } catch (err) {
      assert.fail(`Python syntax error in ralph.py:\n${err.stderr?.toString() ?? err.message}`);
    }
  });

  test('--help exits cleanly', () => {
    try {
      execFileSync('python3', [RALPH_PY, '--help'], { stdio: 'pipe' });
    } catch (err) {
      // argparse --help exits with code 0; anything else is a failure
      if (err.status !== 0) {
        assert.fail(`ralph.py --help failed:\n${err.stderr?.toString() ?? err.message}`);
      }
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

      const stdout = execFileSync(
        'python3',
        [RALPH_PY, dir, '--cli', stub, '--no-print'],
        { stdio: 'pipe' }
      ).toString();

      assert.match(stdout, /Processing issue: .*001-todo\.md/);
      assert.match(stdout, /Skipping .*002-done\.md \(status: done\)/);
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
});
