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
}

function data(): WpData {
  return (window as unknown as { SiteToursFront_data?: WpData }).SiteToursFront_data ?? {};
}

/** Whether the current tour audience applies to this visitor. */
function audienceOk(audience: DraftTour['audience']): boolean {
  const authed = data().authenticated === true;
  if (audience === 'auth') return authed;
  if (audience === 'guest') return !authed;
  return true;
}

/** Published, shippable tours visible to this visitor. */
function published(): DraftTour[] {
  return normalizeTours(data().drafts).filter(
    (d) => d.status === 'published' && d.kind === 'tour' && audienceOk(d.audience),
  );
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

/** Compile and play a published tour (the first one if no id is given). */
export function run(tourId?: string): void {
  const tours = compiled();
  const tour = tourId ? tours.find((t) => t.id === tourId) : tours[0];
  if (!tour) {
    console.warn('[tours] no published tour to run', tourId ?? '');
    return;
  }
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
  mountTours(compiled, { state });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
