/**
 * SPA demo on Vue 3 + vue-router (hash history), using render functions so no
 * template compiler / SFC plugin is needed. The tour crosses views with no
 * reload — core hooks the same hash/history events vue-router uses.
 */
import { createApp, defineComponent, h } from 'vue';
import { createRouter, createWebHashHistory, RouterView, RouterLink } from 'vue-router';
import { createPlayer, resumeTour } from '@tours/core';
import type { Tour } from '@tours/schema';
import { playerState, wireDemoPanel } from './common.js';

const spaTour: Tour = {
  id: 'demo-spa-vue',
  schemaVersion: 1,
  title: { default: 'SPA tour (Vue)' },
  steps: [
    {
      id: 'spa-1',
      pageUrl: { regex: '#/$' },
      selectors: ['#spa-home-cta'],
      content: { default: 'Welcome! Click Next — the tour jumps to your profile with no page reload.' },
      placement: 'bottom',
      action: { type: 'navigate', url: '#/profile' },
    },
    {
      id: 'spa-2',
      pageUrl: { regex: '#/profile' },
      selectors: ['#spa-profile-field'],
      content: { default: 'The tour continued here — vue-router changed the view, the tour followed.' },
      placement: 'right',
    },
  ],
};

const Home = defineComponent({
  render() {
    return h('section', [
      h('h1', 'Dashboard'),
      h('p', 'A Vue SPA (vue-router). The nav switches views without reloading.'),
      h('div', { class: 'card' }, [
        h('h2', 'Getting started'),
        h('p', [
          h(
            'button',
            {
              id: 'spa-home-cta',
              class: 'btn-primary',
              onClick: () => createPlayer(spaTour, { state: playerState }).start(),
            },
            'Start SPA tour',
          ),
        ]),
      ]),
    ]);
  },
});

const Profile = defineComponent({
  render() {
    return h('section', [
      h('h1', 'Profile'),
      h('div', { class: 'card' }, [
        h('div', { class: 'form-field' }, [
          h('label', { for: 'spa-profile-field' }, 'Display name'),
          h('input', { id: 'spa-profile-field', type: 'text', placeholder: 'Your name' }),
        ]),
        h('button', { class: 'btn-primary', type: 'button' }, 'Save'),
      ]),
    ]);
  },
});

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/profile', component: Profile },
  ],
});

const App = defineComponent({
  mounted() {
    wireDemoPanel();
    resumeTour(spaTour, { state: playerState });
  },
  render() {
    return h('div', [
      h('header', { class: 'site-header' }, [
        h(RouterLink, { class: 'logo', to: '/' }, () => 'Community'),
        h('nav', { class: 'site-nav' }, [
          h(RouterLink, { to: '/' }, () => 'Home'),
          h(RouterLink, { to: '/profile' }, () => 'Profile'),
          h('a', { href: 'spa.html' }, 'Vanilla'),
        ]),
      ]),
      h('main', [h(RouterView)]),
    ]);
  },
});

createApp(App).use(router).mount('#root');
