/**
 * Demo playground entry point. Wires the two control-panel buttons to the core
 * API: one runs a sample tour over the mock page, the other enters pick mode
 * and reports the captured selector. Add `?use_logs` to the URL to see the
 * core's stage logs in the console.
 */
import { createPlayer, createPicker, createLogger, createLocalState, resumeTour } from '@tours/core';
import { TourBuilder, createLocalStore, normalizeTours, toTour } from '@tours/editor';
import type { Tour } from '@tours/schema';

const log = createLogger('demo');

// Auto-mount the builder when the page URL carries ?tours-edit=1 — this is the
// "no code" activation path a site owner would use.
let builder = TourBuilder.fromUrl();

// Player progress lives in localStorage so a multi-page tour survives
// navigation between the demo's pages.
const playerState = createLocalState();

/** Compiled, published tours built in the editor (empty if none yet). */
async function builtTours(): Promise<Tour[]> {
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
 * Sample multi-page tour: three steps on the home page, then it navigates to
 * the Profile page and continues there. `pageUrl` binds each step to its page;
 * the third step's navigate action drives the page change.
 */
const HOME = { regex: '/(index\\.html)?($|\\?|#)' };
const PROFILE = { regex: '/profile\\.html' };
const tour: Tour = {
  id: 'community-onboarding',
  schemaVersion: 1,
  title: { default: 'Community onboarding' },
  steps: [
    {
      id: 'step-new-post',
      pageUrl: HOME,
      selectors: ['#btn-new-post'],
      content: { default: 'Click here to write your first post and share an idea.' },
      placement: 'bottom',
    },
    {
      id: 'step-signup',
      pageUrl: HOME,
      selectors: ['#field-name'],
      content: { default: 'Fill in the short sign-up form to become a member.' },
      placement: 'right',
    },
    {
      id: 'step-goto-profile',
      pageUrl: HOME,
      selectors: ['#nav-profile'],
      content: { default: 'Now let’s set up your profile — click Next to continue.' },
      placement: 'bottom',
      action: { type: 'navigate', url: 'profile.html' },
    },
    {
      id: 'step-name',
      pageUrl: PROFILE,
      selectors: ['#profile-name'],
      content: { default: 'Enter a display name so people recognise you.' },
      placement: 'right',
    },
    {
      id: 'step-avatar',
      pageUrl: PROFILE,
      selectors: ['#btn-upload'],
      content: { default: 'Finally, upload a photo. All set — welcome!' },
      placement: 'bottom',
    },
  ],
};

// On every page load, continue a multi-page tour that is mid-flight — the
// built-in sample first, then any tour built in the editor.
void builtTours().then((built) => {
  for (const t of [tour, ...built]) if (resumeTour(t, { state: playerState })) break;
});

const openBuilderBtn = document.querySelector<HTMLButtonElement>('#open-builder');
const runTourBtn = document.querySelector<HTMLButtonElement>('#run-tour');
const pickElementBtn = document.querySelector<HTMLButtonElement>('#pick-element');

// Launch the builder in code — the "in-code" activation path.
openBuilderBtn?.addEventListener('click', () => {
  if (!builder) builder = new TourBuilder({ mode: 'edit' });
  builder.mount();
});

// Run a tour: prefer the first tour built in the editor (multi-page aware,
// with persisted progress); fall back to the built-in sample.
runTourBtn?.addEventListener('click', async () => {
  const [built] = await builtTours();
  createPlayer(built ?? tour, { state: playerState }).start();
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
