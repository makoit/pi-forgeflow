import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const SKILLS_DIR = join(ROOT, 'skills');

/**
 * Extract the frontmatter block (between the first pair of ---) and return
 * a map of top-level keys. Handles YAML block scalars (> and |) by only
 * capturing the key name, not the value.
 */
function parseFrontmatterKeys(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;

  const keys = new Set();
  for (const line of match[1].split(/\r?\n/)) {
    const colonIdx = line.indexOf(':');
    if (colonIdx > 0 && !/^\s/.test(line)) {
      keys.add(line.slice(0, colonIdx).trim());
    }
  }
  return keys;
}

function getFrontmatterValue(content, key) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;
  for (const line of match[1].split(/\r?\n/)) {
    if (line.startsWith(`${key}:`)) {
      return line.slice(key.length + 1).trim().replace(/^["']|["']$/g, '');
    }
  }
  return null;
}

const skillDirs = readdirSync(SKILLS_DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

describe('Skills', () => {
  test('at least one skill directory exists', () => {
    assert.ok(skillDirs.length > 0, 'No subdirectories found in skills/');
  });

  for (const skill of skillDirs) {
    describe(skill, () => {
      const skillMdPath = join(SKILLS_DIR, skill, 'SKILL.md');

      test('has SKILL.md', () => {
        assert.ok(existsSync(skillMdPath), `Missing skills/${skill}/SKILL.md`);
      });

      test('SKILL.md starts with a frontmatter block', () => {
        const content = readFileSync(skillMdPath, 'utf-8');
        assert.ok(content.startsWith('---'), 'SKILL.md must start with --- frontmatter');
        assert.ok(parseFrontmatterKeys(content) !== null, 'Frontmatter block not closed with ---');
      });

      test('frontmatter has "name" field', () => {
        const content = readFileSync(skillMdPath, 'utf-8');
        const keys = parseFrontmatterKeys(content);
        assert.ok(keys?.has('name'), 'Frontmatter is missing "name" field');
      });

      test('frontmatter has "description" field', () => {
        const content = readFileSync(skillMdPath, 'utf-8');
        const keys = parseFrontmatterKeys(content);
        assert.ok(keys?.has('description'), 'Frontmatter is missing "description" field');
      });

      test('frontmatter "name" matches directory name', () => {
        const content = readFileSync(skillMdPath, 'utf-8');
        const name = getFrontmatterValue(content, 'name');
        if (name) {
          assert.equal(name, skill, `name "${name}" does not match directory "${skill}"`);
        }
      });

      test('SKILL.md has content beyond frontmatter', () => {
        const content = readFileSync(skillMdPath, 'utf-8');
        const afterFrontmatter = content.replace(/^---[\s\S]*?---\r?\n/, '').trim();
        assert.ok(afterFrontmatter.length > 0, 'SKILL.md has no content beyond the frontmatter');
      });
    });
  }
});
