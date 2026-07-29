import { defineConfig } from 'vite';
import { toursAliases } from '../../scripts/dev-aliases.mjs';

// Personal sandbox. Aliased to package *source*, so editing packages/*/src
// hot-reloads here with no rebuild — the whole point of it existing.
export default defineConfig({
  resolve: { alias: toursAliases },
  server: { port: 5300, open: true },
});
