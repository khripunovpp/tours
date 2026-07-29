import { defineConfig } from 'vite';
import { svelte, vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { toursAliases } from '../../scripts/dev-aliases.mjs';

export default defineConfig({
  resolve: { alias: toursAliases },
  plugins: [svelte({ preprocess: vitePreprocess() })],
  server: { port: 5403 },
});
