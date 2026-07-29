/**
 * Print Subresource Integrity hashes for the CDN-facing UMD bundles.
 *
 *   node scripts/sri.mjs            # markdown table
 *   node scripts/sri.mjs --tags     # ready-to-paste <script> tags
 *   node scripts/sri.mjs --verify   # re-hash what jsDelivr actually serves
 *
 * SRI is only meaningful against an **immutable** URL. These print `@vX.Y.Z`
 * tag URLs on purpose — pointing `integrity` at a branch means the hash breaks
 * the moment the branch moves, which teaches people to delete the attribute.
 *
 * Regenerate after every `pnpm build:packages`; the hash covers exact bytes.
 */
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

const REPO = 'khripunovpp/tours';
const PACKAGES = [
  { name: 'schema', global: 'ToursSchema' },
  { name: 'core', global: 'ToursCore' },
  { name: 'editor', global: 'ToursEditor' },
];

const version = `v${JSON.parse(readFileSync('packages/core/package.json', 'utf8')).version}`;
const sri = (buf) => `sha384-${createHash('sha384').update(buf).digest('base64')}`;
const url = (name) =>
  `https://cdn.jsdelivr.net/gh/${REPO}@${version}/packages/${name}/dist/index.umd.js`;

const rows = PACKAGES.map(({ name, global }) => ({
  name,
  global,
  url: url(name),
  hash: sri(readFileSync(`packages/${name}/dist/index.umd.js`)),
}));

const mode = process.argv[2];

if (mode === '--verify') {
  // Confirms the CDN serves byte-identical content — if this ever fails, the
  // published integrity attributes are wrong and pages will refuse to load.
  let ok = true;
  for (const r of rows) {
    const served = sri(Buffer.from(await (await fetch(r.url)).arrayBuffer()));
    const match = served === r.hash;
    ok &&= match;
    console.log(`${match ? '✓' : '✗'} @tours/${r.name}  ${match ? 'matches' : `MISMATCH\n    local ${r.hash}\n    cdn   ${served}`}`);
  }
  process.exit(ok ? 0 : 1);
}

if (mode === '--tags') {
  for (const r of rows) {
    console.log(
      `<script src="${r.url}"\n        integrity="${r.hash}"\n        crossorigin="anonymous"></script>\n` +
      `<!-- window.${r.global} -->\n`,
    );
  }
} else {
  console.log(`| Package | Global | Integrity (${version}) |`);
  console.log('|---|---|---|');
  for (const r of rows) {
    console.log(`| \`@tours/${r.name}\` | \`${r.global}\` | \`${r.hash}\` |`);
  }
}
