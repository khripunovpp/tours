/**
 * Entry for triggers.html — a showcase of the auto-start triggers: manual,
 * selector (waits for a lazily-inserted element), and timer.
 */
import { createPlayer, armTrigger } from '@tours/core';
import type { Tour } from '@tours/schema';
import { wireDemoPanel } from '@tours/demo-shared';

wireDemoPanel();

/** A one-step tour targeting a single element, with a given trigger. */
function oneStep(
  id: string,
  selector: string,
  content: string,
  trigger: Tour['trigger'],
  placement: 'top' | 'bottom' | 'left' | 'right' = 'bottom',
): Tour {
  return {
    id,
    schemaVersion: 2,
    title: { default: id },
    trigger,
    steps: [{ id: `${id}-s`, selectors: [selector], content: { default: content }, placement }],
  };
}

const manual = oneStep('demo-manual', '#trg-manual', 'Started manually — from a button, a [data-site-tour] element, or the API.', { type: 'manual' });
document.querySelector('#trg-manual')?.addEventListener('click', () => createPlayer(manual).start());

// Selector trigger: waits (MutationObserver) for #lazy-widget to appear.
const lazy = oneStep('demo-selector', '#lazy-widget', 'This tour waited for the lazy widget to appear, then started.', { type: 'selector', selector: '#lazy-widget' }, 'right');
armTrigger(lazy, () => createPlayer(lazy).start());
document.querySelector('#trg-load')?.addEventListener('click', () => {
  const slot = document.querySelector('#widget-slot');
  if (slot) setTimeout(() => { slot.innerHTML = '<div id="lazy-widget" class="widget">Loaded widget ✨</div>'; }, 1200);
});

// Timer trigger: fires a few seconds after arming.
const timer = oneStep('demo-timer', '#trg-heading', 'This tour auto-started after the 3-second timer.', { type: 'timer', delay: 3000 });
const timerBtn = document.querySelector<HTMLButtonElement>('#trg-timer');
timerBtn?.addEventListener('click', () => {
  armTrigger(timer, () => createPlayer(timer).start());
  timerBtn.textContent = 'Timer armed — 3s…';
  timerBtn.disabled = true;
});
