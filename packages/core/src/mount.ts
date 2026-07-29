/**
 * One-call integration: register your tours once and forget about them.
 *
 * Without this a host has to remember to call `resumeTour` on every page, and
 * a tour that crosses pages silently dies wherever that call is missing. The
 * page a step belongs to is already declared by its `pageUrl` — what was
 * missing was something on the new page to notice.
 *
 * `mountTours` is that something. It re-evaluates on every location change,
 * and covers both shapes of site with the same single call:
 *
 * - **Static multi-page.** Each navigation reloads the document, so the bundle
 *   re-executes and the initial pass runs again on the new page.
 * - **Client-side routing.** No reload happens, so the location watcher
 *   re-evaluates instead. `onLocationChange` patches pushState/replaceState,
 *   so a router that never touches the hash still works.
 *
 * The mixed case — a plain server-rendered site with a form whose steps are
 * tied to the URL — is just the first shape, and needs nothing extra.
 */
import { createPlayer, resumeTour, type PlayerHandle, type PlayerOptions, type RuntimeTour } from './player.js';
import { armTrigger } from './trigger.js';
import { matchRules, detectDevice } from './rules.js';
import { seenCount, markSeen, readProgress, writeProgress } from './state.js';
import { showResumeInvite } from './cta.js';
import { onLocationChange } from './history.js';
import { createLogger } from './logger.js';

export interface MountOptions extends PlayerOptions {
  /**
   * Gate a tour on host-specific conditions the schema cannot express —
   * audience, feature flags, permissions. Re-checked on every navigation, so
   * it may return different answers as the session changes.
   */
  canRun?: (tour: RuntimeTour) => boolean;
}

/**
 * Register tours and keep them running across navigation. Returns an unmount
 * function that stops any running tour and releases the watcher.
 *
 * Pass a function rather than an array when the set of tours is computed —
 * it is re-read on every navigation, so tours loaded later are picked up.
 *
 * ```ts
 * mountTours(tours, { state: createLocalState() });
 * ```
 */
export function mountTours(
  input: readonly RuntimeTour[] | (() => readonly RuntimeTour[]),
  options: MountOptions = {},
): () => void {
  const log = createLogger('mount');
  const state = options.state;
  const list = (): readonly RuntimeTour[] => (typeof input === 'function' ? input() : input);

  let current: PlayerHandle | null = null;
  let armed: Array<() => void> = [];
  let closeInvite: (() => void) | null = null;

  function disarm(): void {
    for (const cancel of armed) cancel();
    armed = [];
    closeInvite?.();
    closeInvite = null;
  }

  function eligible(tour: RuntimeTour): boolean {
    return !options.canRun || options.canRun(tour);
  }

  function activate(): void {
    // A running tour drives its own step-to-step advance, including across
    // client-side navigation. Re-arming underneath it would double up.
    if (current?.isActive()) return;
    current = null;
    disarm();

    // A tour the visitor set aside must not come back on its own — that would
    // make minimizing useless. Re-offer the invitation instead, on this page
    // and on every later one, since the flag outlives the document.
    const progress = state ? readProgress(state) : null;
    if (state && progress?.minimized) {
      const tour = list().find((t) => t.id === progress.tourId && eligible(t));
      if (tour) {
        const cfg = tour.dismiss?.resume;
        closeInvite = showResumeInvite(
          {
            tourId: tour.id,
            text: cfg?.text ?? 'Carry on with the tour?',
            button: cfg?.button ?? 'Resume',
            corner: cfg?.corner,
            offset: cfg?.offset,
            onResume: () => {
              closeInvite = null;
              writeProgress(state, { tourId: tour.id, index: progress.index });
              const player = createPlayer(tour, options);
              current = player;
              player.start(progress.index);
            },
          },
          options.renderResume,
        );
        return;
      }
    }

    // Continuing takes priority: a tour already in flight should never be
    // restarted from the top by its own auto-start trigger.
    if (state) {
      for (const tour of list()) {
        if (!eligible(tour)) continue;
        const player = resumeTour(tour, options);
        if (player) {
          log.log('resumed', tour.id);
          current = player;
          return;
        }
      }
    }

    // Nothing in flight — arm auto-start triggers whose rules hold here.
    const device = detectDevice();
    for (const tour of list()) {
      if (!eligible(tour)) continue;
      if (!tour.trigger || tour.trigger.type === 'manual') continue;
      const count = state ? seenCount(state, tour.id) : 0;
      const matches = matchRules(tour.rules, {
        url: window.location.href,
        device,
        firstVisit: count === 0,
        seenCount: count,
      });
      if (!matches) continue;
      armed.push(
        armTrigger(tour, () => {
          if (state) markSeen(state, tour.id);
          const player = createPlayer(tour, options);
          current = player;
          player.start();
        }),
      );
    }
  }

  activate();
  const off = onLocationChange(activate);

  return () => {
    off();
    disarm();
    current?.stop();
    current = null;
  };
}
