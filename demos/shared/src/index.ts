/**
 * Shared demo helpers used by every page's entry script: the opt-in logger,
 * player state, builder activation, the demo-panel buttons, and access to tours
 * built in the editor. Add `?use_logs` to any page to see core logs.
 */
import { createLogger, createLocalState, createPicker, createPlayer, resumeTour } from '@tours/core';
import {
  TourBuilder,
  createLocalStore,
  createDraftTour,
  createDraftStep,
  normalizeTours,
  toTour,
  type DraftTour,
  type Placement,
} from '@tours/editor';
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

function step(
  selector: string,
  content: string,
  placement: Placement,
  page: string,
  navigate?: string,
): DraftTour['steps'][number] {
  const s = createDraftStep();
  s.selectors = [selector];
  s.content = content;
  s.placement = placement;
  s.page = page;
  if (navigate) s.action = { type: 'navigate', url: navigate };
  return s;
}

/** Editable starter tour for an SPA demo (home → profile via the hash). */
export function spaDraft(id: string, framework: string): DraftTour {
  const draft = createDraftTour();
  draft.id = id;
  draft.name = `SPA tour (${framework})`;
  draft.status = 'published';
  draft.trigger = { type: 'manual' };
  draft.steps = [
    step('#spa-home-cta', 'Welcome! Click Next — the tour jumps to your profile with no page reload.', 'bottom', '**#/', '#/profile'),
    step('#spa-profile-field', `The tour continued here — ${framework}'s router changed the view, the tour followed.`, 'right', '**#/profile'),
  ];
  return draft;
}

/** Editable starter tour for the mock "Community" site (Home → Profile page). */
export function communityDraft(): DraftTour {
  const draft = createDraftTour();
  draft.id = 'community-onboarding';
  draft.name = 'Community onboarding';
  draft.status = 'published';
  draft.trigger = { type: 'manual' };
  draft.steps = [
    step('#btn-new-post', 'Click here to write your first post and share an idea.', 'bottom', '**/'),
    step('#field-name', 'Fill in the short sign-up form to become a member.', 'right', '**/'),
    step('#nav-profile', 'Now let’s set up your profile — click Next to continue.', 'bottom', '**/', 'profile.html'),
    step('#profile-name', 'Enter a display name so people recognise you.', 'right', '**/profile.html'),
    step('#btn-upload', 'Finally, upload a photo. All set — welcome!', 'bottom', '**/profile.html'),
  ];
  return draft;
}

/** Seed an editable demo tour into the builder's store (only if absent). */
export async function seedDemoTour(draft: DraftTour): Promise<void> {
  const store = createLocalStore();
  const existing = (await store.load()) ?? [];
  if (existing.some((t) => t.id === draft.id)) return;
  await store.save([...existing, draft]);
}

async function compiledById(id: string): Promise<Tour | null> {
  for (const t of await builtTours()) if (t.id === id) return t;
  return null;
}

/** Play the stored (editable) demo tour by id. */
export async function playDemoTour(id: string): Promise<void> {
  const tour = await compiledById(id);
  if (tour) createPlayer(tour, { state: playerState }).start();
  else log.warn('demo tour not found (build one in the editor?)', id);
}

/** Resume the stored demo tour if it is mid-flight on this page. */
export async function resumeDemoTour(id: string): Promise<void> {
  const tour = await compiledById(id);
  if (tour) resumeTour(tour, { state: playerState });
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
