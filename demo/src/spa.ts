/**
 * Entry for spa.html — a single-page app with hash routing. The tour spans two
 * views and continues without a reload (core hooks pushState/popstate/
 * hashchange). No framework: the point is that the mechanism is framework-
 * agnostic.
 */
import { createPlayer, resumeTour } from '@tours/core';
import type { Tour } from '@tours/schema';
import { playerState, wireDemoPanel } from './common.js';

wireDemoPanel();

const home = document.getElementById('view-home');
const profile = document.getElementById('view-profile');

function route(): void {
  const hash = window.location.hash || '#/home';
  if (home) home.hidden = hash !== '#/home';
  if (profile) profile.hidden = hash !== '#/profile';
  document.getElementById('spa-nav-home')?.classList.toggle('active', hash === '#/home');
  document.getElementById('spa-nav-profile')?.classList.toggle('active', hash === '#/profile');
}

if (!window.location.hash) window.location.hash = '#/home';
window.addEventListener('hashchange', route);
route();

const spaTour: Tour = {
  id: 'demo-spa',
  schemaVersion: 1,
  title: { default: 'SPA tour' },
  steps: [
    {
      id: 'spa-1',
      pageUrl: { regex: '#/home' },
      selectors: ['#spa-home-cta'],
      content: { default: 'Welcome! Click Next — the tour jumps to your profile without a page reload.' },
      placement: 'bottom',
      action: { type: 'navigate', url: '#/profile' },
    },
    {
      id: 'spa-2',
      pageUrl: { regex: '#/profile' },
      selectors: ['#spa-profile-field'],
      content: { default: 'The tour continued here in the same SPA, after the hash changed.' },
      placement: 'right',
    },
  ],
};

document.querySelector('#spa-home-cta')?.addEventListener('click', () => createPlayer(spaTour, { state: playerState }).start());
// Continue if the page was reloaded mid-tour.
resumeTour(spaTour, { state: playerState });
