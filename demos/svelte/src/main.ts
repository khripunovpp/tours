/** SPA demo on Svelte 5 — svelte-spa-router. Isolated package. */
import '@tours/demo-shared/demo.css';
import { mount } from 'svelte';
import { seedDemoTour, spaDraft } from '@tours/demo-shared';
import App from './App.svelte';

void seedDemoTour(spaDraft('demo-spa-svelte', 'Svelte'));
mount(App, { target: document.getElementById('root')! });
