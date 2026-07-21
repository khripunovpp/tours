/**
 * Shared demo helpers used by every page's entry script: the opt-in logger,
 * player state, builder activation, the demo-panel buttons, and access to tours
 * built in the editor. Add `?use_logs` to any page to see core logs.
 */
import { createLogger, createLocalState, createPicker } from '@tours/core';
import { TourBuilder, createLocalStore, normalizeTours, toTour } from '@tours/editor';
import type { Tour } from '@tours/schema';

export const log = createLogger('demo');

// Player progress lives in localStorage so multi-page tours survive navigation.
export const playerState = createLocalState();

// Auto-mount the builder when the URL carries ?tours-edit=1 (every page).
let builder = TourBuilder.fromUrl();

/** Compiled, published tours built in the editor (empty if none yet). */
export async function builtTours(): Promise<Tour[]> {
  const drafts = (await createLocalStore().load()) ?? [];
  const out: Tour[] = [];
  for (const d of normalizeTours(drafts)) {
    if (d.status !== 'published' || d.kind !== 'tour') continue;
    const r = toTour(d);
    if (r.ok) out.push(r.tour);
  }
  return out;
}

/**
 * The shared SPA demo tour: one step on the home route, then it navigates to
 * the profile route (hash) and continues there — no reload. Routers below use
 * hash history, so home is `#/` and profile is `#/profile`.
 */
export function makeSpaTour(id: string, framework: string): Tour {
  return {
    id,
    schemaVersion: 1,
    title: { default: `SPA tour (${framework})` },
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
        content: { default: `The tour continued here — ${framework}'s router changed the view, the tour followed.` },
        placement: 'right',
      },
    ],
  };
}

/** Wire the shared demo-panel buttons (open builder, pick element). */
export function wireDemoPanel(): void {
  document.querySelector<HTMLButtonElement>('#open-builder')?.addEventListener('click', () => {
    if (!builder) builder = new TourBuilder({ mode: 'edit' });
    builder.mount();
  });
  document.querySelector<HTMLButtonElement>('#pick-element')?.addEventListener('click', () => {
    createPicker((selectors) => {
      log.log('picked element', selectors);
      alert(`Picked selector:\n${selectors.join(', ')}`);
    }).start();
  });
}
