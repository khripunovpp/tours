/**
 * Front-end glue for the WordPress plugin, built to assets/tours-wp.js (global
 * `ToursWP`). The plugin localizes the site's published tour drafts into the
 * page; this compiles them to schema Tours (client-side, so no tour logic lives
 * in PHP) and runs the player. Templates and unpublished tours are excluded.
 */
import { createPlayer } from '@tours/core';
import { toTour, normalizeTours, type DraftTour } from '@tours/editor';

interface WpData {
  drafts?: unknown;
}

function data(): WpData {
  return (window as unknown as { SiteToursFront_data?: WpData }).SiteToursFront_data ?? {};
}

/** Published, shippable tours from the localized drafts. */
function published(): DraftTour[] {
  return normalizeTours(data().drafts).filter(
    (d) => d.status === 'published' && d.kind === 'tour',
  );
}

/** Ids and names of runnable tours (for building triggers). */
export function list(): Array<{ id: string; name: string }> {
  return published().map((d) => ({ id: d.id, name: d.name }));
}

/** Compile and play a published tour (the first one if no id is given). */
export function run(tourId?: string): void {
  const tours = published();
  const draft = tourId ? tours.find((d) => d.id === tourId) : tours[0];
  if (!draft) {
    console.warn('[tours] no published tour to run', tourId ?? '');
    return;
  }
  const result = toTour(draft);
  if (!result.ok) {
    console.warn('[tours] tour is invalid', result.errors);
    return;
  }
  createPlayer(result.tour).start();
}

/** Wire up any `[data-site-tour]` triggers the shortcode rendered. */
function bindTriggers(): void {
  for (const el of Array.from(document.querySelectorAll<HTMLElement>('[data-site-tour]'))) {
    if (el.dataset.siteToursBound) continue;
    el.dataset.siteToursBound = '1';
    el.addEventListener('click', () => run(el.dataset.siteTour || undefined));
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bindTriggers);
} else {
  bindTriggers();
}

