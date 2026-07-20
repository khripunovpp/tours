import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
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
      },
    },
  },
});
