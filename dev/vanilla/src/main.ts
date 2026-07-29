/**
 * Personal sandbox — a place to poke at the library while changing it.
 *
 * Not a demo: `demo/` is the mock community site used to show the product off,
 * and `examples/` install published artifacts the way an outside consumer does.
 * This one is aliased straight to package source, so it reloads on every edit,
 * and it deliberately mounts the builder — which `demo/` never actually did,
 * despite advertising `?tours-edit=1`.
 */
import { createPlayer, createLocalState, clearProgress, type Tour } from '@tours/core';
import { TourBuilder } from '@tours/editor';

const state = createLocalState();

// Mounts only when the URL carries ?tours-edit=1, so the sandbox is usable
// with and without the builder in the way.
const builder = TourBuilder.fromUrl();

const logEl = document.querySelector<HTMLElement>('#log')!;
let lines: string[] = [];
function log(line: string): void {
  lines = [...lines.slice(-40), line];
  logEl.textContent = lines.join('\n');
  logEl.scrollTop = logEl.scrollHeight;
}
logEl.textContent = builder ? 'builder mounted — tours are suppressed' : 'ready';

/** Every lifecycle event, so behaviour is visible rather than guessed at. */
const on = {
  tourStarting: ({ index }: { index: number }) => log(`→ starting at ${index}`),
  tourStarted: ({ index }: { index: number }) => log(`▶ started at ${index}`),
  stepChanging: ({ from, to }: { from: number; to: number }) => log(`  ${from} → ${to}`),
  stepActivated: ({ step }: { step: { id: string } }) => log(`● ${step.id}`),
  stepSkipped: ({ step, reason }: { step: { id: string }; reason: string }) =>
    log(`↷ ${step.id} (${reason})`),
  tourMinimized: ({ index }: { index: number }) => log(`— minimized at ${index}`),
  tourResumed: ({ index }: { index: number }) => log(`↻ resumed at ${index}`),
  tourCompleted: () => log('✔ completed'),
  tourDismissed: ({ index }: { index: number }) => log(`✕ dismissed at ${index}`),
};

const base = { schemaVersion: 1 as const, title: { default: 'Sandbox' } };

const tours: Record<string, Tour> = {
  basic: {
    ...base,
    id: 'basic',
    steps: [
      { id: 'compose', selectors: ['#compose'], content: { default: 'Write a post.' }, placement: 'bottom' },
      { id: 'search', selectors: ['#search'], content: { default: 'Or search for one.' }, placement: 'bottom' },
      { id: 'buried', selectors: ['#buried'], content: { default: 'This one lives inside a scroll container.' }, placement: 'top' },
    ],
  },
  // R1: overlay:false leaves the page usable and only outlines the target.
  nodim: {
    ...base,
    id: 'nodim',
    steps: [
      { id: 'dimmed', selectors: ['#compose'], content: { default: 'Normal step — the page is dimmed.' }, placement: 'bottom' },
      { id: 'plain', selectors: ['#settings'], content: { default: 'overlay: false — dimming off, page fully usable. Try clicking around.' }, placement: 'bottom', overlay: false },
    ],
  },
  // The visitor operates the target; no Next button, clicks pass through.
  interactive: {
    ...base,
    id: 'interactive',
    steps: [
      { id: 'click-me', selectors: ['#settings'], content: { default: 'Click Settings yourself — no Next button here.' }, placement: 'bottom', action: { type: 'click' } },
      { id: 'after', selectors: ['#search'], content: { default: 'Done.' }, placement: 'bottom' },
    ],
  },
  // Closing sets it aside and offers a corner invitation instead of ending it.
  minimize: {
    ...base,
    id: 'minimize',
    dismiss: { mode: 'minimize', resume: { text: 'Left the tour half-way. Carry on?', button: 'Resume' } },
    steps: [
      { id: 'a', selectors: ['#compose'], content: { default: 'Close me with the × — the tour is set aside, not ended.' }, placement: 'bottom' },
      { id: 'b', selectors: ['#settings'], content: { default: 'Second step.' }, placement: 'bottom' },
    ],
  },
};

function run(name: keyof typeof tours): void {
  lines = [];
  createPlayer(tours[name]!, { state, on }).start();
}

document.querySelector('#run-basic')!.addEventListener('click', () => run('basic'));
document.querySelector('#run-nodim')!.addEventListener('click', () => run('nodim'));
document.querySelector('#run-interactive')!.addEventListener('click', () => run('interactive'));
document.querySelector('#run-minimize')!.addEventListener('click', () => run('minimize'));
document.querySelector('#reset')!.addEventListener('click', () => {
  clearProgress(state);
  log('progress cleared');
});
