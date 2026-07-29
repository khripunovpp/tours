// Plain JavaScript, no framework, no bundler — the bare `@tours/core` specifier
// is resolved by the import map in index.html.
import { createPlayer } from '@tours/core';

const tour = {
  id: 'example',
  schemaVersion: 1,
  title: { default: 'Getting started' },
  steps: [
    {
      id: 'compose',
      // A ranked list: the player tries each in turn and waits for targets that
      // render late, instead of skipping the step.
      selectors: ['#compose', 'button.primary'],
      content: { default: 'Start here to write a new post.' },
      placement: 'bottom',
    },
    {
      id: 'settings',
      selectors: ['#settings'],
      content: { default: 'Everything else lives behind Settings.' },
      placement: 'bottom',
    },
    {
      id: 'done',
      selectors: ['#start'],
      content: { default: "That's the whole tour — replay it any time." },
      placement: 'top',
    },
  ],
};

document.querySelector('#start').addEventListener('click', () => {
  createPlayer(tour).start();
});
