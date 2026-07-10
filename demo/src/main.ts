/**
 * Demo playground entry point. Wires the two control-panel buttons to the core
 * API: one runs a sample tour over the mock page, the other enters pick mode
 * and reports the captured selector. Add `?use_logs` to the URL to see the
 * core's stage logs in the console.
 */
import { createPlayer, createPicker, createLogger } from '@tours/core';
import type { Tour } from '@tours/schema';

const log = createLogger('demo');

/** Sample three-step tour targeting elements on the mock community page. */
const tour: Tour = {
  id: 'community-onboarding',
  schemaVersion: 1,
  title: { default: 'Community onboarding' },
  steps: [
    {
      id: 'step-new-post',
      selectors: ['#btn-new-post'],
      content: {
        default: 'Click this button to write your first post and share an idea with the community.',
      },
      placement: 'bottom',
    },
    {
      id: 'step-signup',
      selectors: ['#field-name'],
      content: {
        default: 'Fill in the short sign-up form: enter your name and email to become a member.',
      },
      placement: 'right',
    },
    {
      id: 'step-submit',
      selectors: ['#btn-submit'],
      content: {
        default: 'All set! Click "Sign up" — and welcome to the community.',
      },
      placement: 'top',
    },
  ],
};

const runTourBtn = document.querySelector<HTMLButtonElement>('#run-tour');
const pickElementBtn = document.querySelector<HTMLButtonElement>('#pick-element');

// Run the sample tour.
runTourBtn?.addEventListener('click', () => {
  const player = createPlayer(tour);
  player.start();
});

// Enter pick mode and show the captured selector.
pickElementBtn?.addEventListener('click', () => {
  const picker = createPicker((selectors) => {
    const result = selectors.join(', ');
    log.log('picked element', selectors);
    alert(`Picked selector:\n${result}`);
  });
  picker.start();
});
