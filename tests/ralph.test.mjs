import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
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
});
