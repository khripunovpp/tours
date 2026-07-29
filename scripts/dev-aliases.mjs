/**
 * Resolve `@tours/*` to package **source** for everything inside this repo —
 * the demo site and the framework demos.
 *
 * The packages' `exports` deliberately point only at built `dist`, because that
 * is what an installed copy has. An `exports` condition pointing at `src` would
 * resolve fine here but break every consumer whose bundler honours it (Vite in
 * dev does), since published tarballs ship `dist` only.
 *
 * So the workspace opts into source explicitly, via these aliases. Editing a
 * package hot-reloads the demos with no rebuild.
 */
import { fileURLToPath } from 'node:url';

const src = (name) =>
  fileURLToPath(new URL(`../packages/${name}/src/index.ts`, import.meta.url));

export const toursAliases = {
  '@tours/core': src('core'),
  '@tours/editor': src('editor'),
  '@tours/schema': src('schema'),
};
