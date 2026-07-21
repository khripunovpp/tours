/** SPA demo on Svelte 5 — svelte-spa-router. Isolated package. */
import '@tours/demo-shared/demo.css';
import { mount } from 'svelte';
import App from './App.svelte';

mount(App, { target: document.getElementById('root')! });
