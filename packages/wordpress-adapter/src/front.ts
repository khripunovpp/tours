/**
 * Front-end glue for the WordPress plugin, built to assets/tours-front.js
 * (global `SiteToursFront`). The plugin localizes the site's published tour
 * drafts (and whether the visitor is logged in) into the page; this compiles
 * them to schema Tours client-side (no tour logic in PHP), enforces the
 * audience, runs auto-start triggers, and continues multi-page tours.
 */
import { createPlayer, createLocalState, mountTours } from '@tours/core';
import { toTour, normalizeTours, type DraftTour } from '@tours/editor';
import type { Tour } from '@tours/schema';

// Player progress persists here so multi-page tours continue after navigation.
const state = createLocalState();

interface WpData {
  drafts?: unknown;
  authenticated?: boolean;
  /** Tags describing the current visitor, from Site_Tours_Viewer + filters. */
  tags?: string[];
  /** Every tag this site can attach, offered to the builder. */
  knownTags?: string[];
}

function data(): WpData {
  return (window as unknown as { SiteToursFront_data?: WpData }).SiteToursFront_data ?? {};
}

/** Published, shippable tours visible to this visitor. */
function published(): DraftTour[] {
  // Audience is no longer a field of its own — it is a tag like any other, and
  // the rules engine enforces it, so nothing needs filtering here.
  return normalizeTours(data().drafts).filter((d) => d.status === 'published' && d.kind === 'tour');
}

/** Ids and names of runnable tours (for building triggers). */
export function list(): Array<{ id: string; name: string }> {
  return published().map((d) => ({ id: d.id, name: d.name }));
}

/** Compile the published tours to schema Tours. */
function compiled(): Tour[] {
  const out: Tour[] = [];
  for (const d of published()) {
    const r = toTour(d);
    if (r.ok) out.push(r.tour);
  }
  return out;
}

/** The live mount, so shortcode buttons can start a tour through it. */
let mounted: ReturnType<typeof mountTours> | null = null;

/** Compile and play a published tour (the first one if no id is given). */
export function run(tourId?: string): void {
  const tours = compiled();
  const tour = tourId ? tours.find((t) => t.id === tourId) : tours[0];
  if (!tour) {
    console.warn('[tours] no published tour to run', tourId ?? '');
    return;
  }
  // Through the mount, so it knows a tour is running and does not start a
  // second one on the next navigation.
  if (mounted?.start(tour.id)) return;
  createPlayer(tour, { state }).start();
}

/** Wire up any `[data-site-tour]` triggers (shortcode buttons or custom markup). */
function bindTriggers(): void {
  for (const el of Array.from(document.querySelectorAll<HTMLElement>('[data-site-tour]'))) {
    if (el.dataset.siteToursBound) continue;
    el.dataset.siteToursBound = '1';
    el.addEventListener('click', () => run(el.dataset.siteTour || undefined));
  }
}

function init(): void {
  bindTriggers();
  // Continuing an in-flight tour, arming auto-start triggers and re-checking
  // both after navigation all live in mountTours. The list is passed as a
  // getter because the plugin can localize tours after this runs.
  mounted = mountTours(compiled, {
    state,
    // Supplied on every evaluation, so logging in or changing level takes
    // effect on the next navigation without a reload.
    // Everything the site knows about the visitor, as a flat set of labels.
    viewer: () => data().tags ?? [],
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
