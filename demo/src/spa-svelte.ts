/** SPA demo on Svelte 5 — mounts the App component into #root. */
import { mount } from 'svelte';
import App from './App.svelte';

mount(App, { target: document.getElementById('root')! });
