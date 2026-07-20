import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { svelte, vitePreprocess } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [react(), svelte({ preprocess: vitePreprocess() })],
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
      },
    },
  },
});
