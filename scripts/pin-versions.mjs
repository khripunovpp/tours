/**
 * Rewrite every dependency range in the workspace to the exact version that is
 * currently installed — `^19.0.0` becomes `19.2.15`.
 *
 * Ranges mean two people running `pnpm install` a month apart can get different
 * trees, and a transitive patch release can break a build with no change on our
 * side. The lockfile already pins what *we* resolve; exact ranges make the
 * manifests say the same thing, so a consumer who installs a package, or a
 * contributor who regenerates the lockfile, lands on the versions we tested.
 *
 * `workspace:*` links are left alone — they are resolved by the workspace, not
 * by a registry, and pnpm rewrites them to real versions when packing.
 *
 * Run after a deliberate upgrade: `pnpm up --latest <pkg>` then `node
 * scripts/pin-versions.mjs`, and commit the lockfile alongside.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';

const FIELDS = ['dependencies', 'devDependencies', 'optionalDependencies'];

/**
 * Find a dependency's installed version by walking `node_modules` up from the
 * manifest, reading its package.json off disk.
 *
 * Deliberately not `require.resolve(`${name}/package.json`)`: many modern
 * packages declare an `exports` map that does not expose `./package.json`, and
 * the resolve then throws even though the package is installed.
 */
function installedVersion(fromDir, name) {
  let dir = resolve(fromDir);
  while (true) {
    const candidate = resolve(dir, 'node_modules', name, 'package.json');
    if (existsSync(candidate)) {
      return JSON.parse(readFileSync(candidate, 'utf8')).version;
    }
    const parent = dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}

const manifests = execFileSync('git', ['ls-files', '*package.json'], { encoding: 'utf8' })
  .split('\n')
  .filter(Boolean)
  .filter((f) => !f.startsWith('dist/'));

let pinned = 0;
let skipped = [];

for (const file of manifests) {
  const json = JSON.parse(readFileSync(file, 'utf8'));
  // Resolve from the manifest's own directory so pnpm's nested node_modules
  // give us the version that package actually sees.
  const fromDir = dirname(file) || '.';
  let touched = false;

  for (const field of FIELDS) {
    const deps = json[field];
    if (!deps) continue;
    for (const [name, range] of Object.entries(deps)) {
      // Workspace links, git URLs, file paths and already-exact pins stay put.
      if (!/^[\^~]/.test(range)) continue;
      const installed = installedVersion(fromDir, name);
      if (!installed) {
        skipped.push(`${file}: ${name} (not installed)`);
        continue;
      }
      deps[name] = installed;
      touched = true;
      pinned++;
    }
  }

  if (touched) {
    writeFileSync(file, JSON.stringify(json, null, 2) + '\n');
    console.log(`pinned  ${file}`);
  }
}

console.log(`\n✓ ${pinned} ranges pinned to exact versions`);
if (skipped.length) {
  console.log('\n! could not resolve (left as-is):');
  for (const s of skipped) console.log(`  ${s}`);
}
