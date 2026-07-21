import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';

// Isolated build for the Angular SPA demo. analog compiles the whole .ts graph
// through Angular's compiler, which can't coexist with the other framework
// plugins in the shared config — so Angular gets its own config/port.
// Dev:   pnpm --filter @tours/demo dev:angular   (http://localhost:5174/spa-angular.html)
// Build: pnpm --filter @tours/demo build:angular
export default defineConfig({
  plugins: [angular()],
  server: { port: 5174, open: '/spa-angular.html' },
  build: {
    outDir: 'dist-angular',
    rollupOptions: {
      input: { spaAngular: resolve(import.meta.dirname, 'spa-angular.html') },
    },
  },
});
