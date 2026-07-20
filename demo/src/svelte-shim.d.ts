// Let tsc resolve `.svelte` imports (svelte-check does the real checking).
declare module '*.svelte' {
  import type { Component } from 'svelte';
  const component: Component;
  export default component;
}
