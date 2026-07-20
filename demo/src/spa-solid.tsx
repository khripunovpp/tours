/** @jsxImportSource solid-js */
/**
 * SPA demo on Solid — manual hash routing with a signal. The tour crosses
 * views with no reload. (jsxImportSource pragma keeps this file on Solid's JSX
 * while the React demo uses React's.)
 */
import { render } from 'solid-js/web';
import { createSignal, onCleanup, onMount, Show } from 'solid-js';
import { createPlayer, resumeTour } from '@tours/core';
import type { Tour } from '@tours/schema';
import { playerState, wireDemoPanel } from './common.js';

const spaTour: Tour = {
  id: 'demo-spa-solid',
  schemaVersion: 1,
  title: { default: 'SPA tour (Solid)' },
  steps: [
    {
      id: 'spa-1',
      pageUrl: { regex: '#/home' },
      selectors: ['#spa-home-cta'],
      content: { default: 'Welcome! Click Next — the tour jumps to your profile with no page reload.' },
      placement: 'bottom',
      action: { type: 'navigate', url: '#/profile' },
    },
    {
      id: 'spa-2',
      pageUrl: { regex: '#/profile' },
      selectors: ['#spa-profile-field'],
      content: { default: 'The tour continued here — Solid swapped the view, the tour followed.' },
      placement: 'right',
    },
  ],
};

function App() {
  const [hash, setHash] = createSignal(window.location.hash || '#/home');
  const onHash = (): void => {
    setHash(window.location.hash || '#/home');
  };

  onMount(() => {
    if (!window.location.hash) window.location.hash = '#/home';
    window.addEventListener('hashchange', onHash);
    wireDemoPanel();
    resumeTour(spaTour, { state: playerState });
  });
  onCleanup(() => window.removeEventListener('hashchange', onHash));

  return (
    <>
      <header class="site-header">
        <a class="logo" href="index.html">Community</a>
        <nav class="site-nav">
          <a href="#/home" classList={{ active: hash() === '#/home' }}>Home</a>
          <a href="#/profile" classList={{ active: hash() === '#/profile' }}>Profile</a>
          <a href="spa.html">Vanilla</a>
        </nav>
      </header>
      <main>
        <Show
          when={hash() === '#/profile'}
          fallback={
            <section>
              <h1>Dashboard</h1>
              <p>A Solid SPA. The nav switches views without reloading.</p>
              <div class="card">
                <h2>Getting started</h2>
                <p>
                  <button id="spa-home-cta" class="btn-primary" onClick={() => createPlayer(spaTour, { state: playerState }).start()}>
                    Start SPA tour
                  </button>
                </p>
              </div>
            </section>
          }
        >
          <section>
            <h1>Profile</h1>
            <div class="card">
              <div class="form-field">
                <label for="spa-profile-field">Display name</label>
                <input id="spa-profile-field" type="text" placeholder="Your name" />
              </div>
              <button class="btn-primary" type="button">Save</button>
            </div>
          </section>
        </Show>
      </main>
    </>
  );
}

render(() => <App />, document.getElementById('root')!);
