import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf-8'));

describe('package.json', () => {
  test('has name', () => {
    assert.ok(pkg.name, 'Missing "name" field');
  });

  test('name contains @martinkovacs/pi-forgeflow', () => {
    assert.equal(pkg.name, '@martinkovacs/pi-forgeflow');
  });

  test('has description', () => {
    assert.ok(pkg.description?.trim(), 'Missing or empty "description" field');
  });

  test('keywords include "pi-package"', () => {
    assert.ok(
      Array.isArray(pkg.keywords) && pkg.keywords.includes('pi-package'),
      '"pi-package" must be in keywords'
    );
  });

  test('has license', () => {
    assert.ok(pkg.license, 'Missing "license" field');
  });

  test('has repository field', () => {
    assert.ok(pkg.repository?.url, 'Missing "repository.url" field');
  });

  test('files allowlist is defined', () => {
    assert.ok(Array.isArray(pkg.files) && pkg.files.length > 0, 'Missing "files" allowlist');
  });

  test('pi.skills lists only existing skill directories', () => {
    const skills = pkg.pi?.skills ?? [];
    assert.ok(skills.length > 0, 'pi.skills must list at least one skill');
    for (const skillPath of skills) {
      const fullPath = join(ROOT, skillPath);
      assert.ok(
        existsSync(fullPath),
        `pi.skills entry "${skillPath}" does not exist on disk`
      );
    }
  });

  test('all skill directories are listed in pi.skills', () => {
    const skillsDir = join(ROOT, 'skills');
    const dirs = readdirSync(skillsDir, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => `skills/${d.name}`);

    const listed = new Set(pkg.pi?.skills ?? []);
    for (const dir of dirs) {
      assert.ok(listed.has(dir), `Skill directory "${dir}" is not listed in pi.skills`);
    }
  });
});
