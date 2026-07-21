import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import vue from '@vitejs/plugin-vue';
import solid from 'vite-plugin-solid';
import { svelte, vitePreprocess } from '@sveltejs/vite-plugin-svelte';

// NOTE: Angular's analog plugin is a whole-app .ts compiler and can't share a
// multi-framework Vite build (it blanks out every non-Angular .ts module).
// The Angular SPA demo lives in its own config: `pnpm --filter @tours/demo dev:angular`.
export default defineConfig({
  // React and Solid both use .tsx — scope each plugin to its own file so they
  // don't fight over the JSX transform.
  plugins: [
    react({ include: [/spa-react\.tsx$/] }),
    solid({ include: [/spa-solid\.tsx$/] }),
    svelte({ preprocess: vitePreprocess() }),
    vue(),
  ],
  server: {
    open: true,
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        profile: resolve(import.meta.dirname, 'profile.html'),
        triggers: resolve(import.meta.dirname, 'triggers.html'),
        spa: resolve(import.meta.dirname, 'spa.html'),
        spaReact: resolve(import.meta.dirname, 'spa-react.html'),
        spaVue: resolve(import.meta.dirname, 'spa-vue.html'),
        spaSvelte: resolve(import.meta.dirname, 'spa-svelte.html'),
        spaSolid: resolve(import.meta.dirname, 'spa-solid.html'),
      },
    },
  },
});
