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
import { seenCount, markSeen, readProgress, writeProgress, clearProgress } from './state.js';
import { showResumeInvite } from './cta.js';
import { onLocationChange } from './history.js';
import { createLogger } from './logger.js';

/**
 * Options for `mountTours`.
 *
 * **Extends `PlayerOptions`, and that is where most fields live** — `state`,
 * `viewer`, `on`, `onNavigate`, `renderResume`, `allowWhileEditing`. The object
 * is handed to `createPlayer` unchanged, so anything the player understands can
 * be passed here, and one `viewer` feeds both a tour's rules and its steps.
 *
 * Only the two fields below are specific to mounting.
 */
export interface MountOptions extends PlayerOptions {
  /**
   * Gate a tour on host-specific conditions the schema cannot express —
   * audience, feature flags, permissions. Re-checked on every navigation, so
   * it may return different answers as the session changes.
   */
  canRun?: (tour: RuntimeTour) => boolean;
  /**
   * Continue a tour that is mid-flight on this page. Default true.
   *
   * `false` hands the *timing* back to the host — resume once your data has
   * loaded, once a modal is closed, behind a route guard — while keeping
   * everything else this mount does: trigger arming, the navigation watcher,
   * and the invitation for a tour the visitor set aside.
   *
   * The host then calls `resumeTour(tour, { state })` itself. Note it still
   * owns only *when*: `resumeTour` keeps deciding *where*, by scanning forward
   * for the step this page satisfies. Reimplementing that is the bug this
   * library exists to prevent.
   */
  autoResume?: boolean;
}

export interface MountHandle {
  /**
   * Start a tour now, from the top — a "show me the tour" button.
   *
   * Goes through the mount rather than round a separate `createPlayer`, which
   * would leave this mount unaware of the running tour and let it start a second
   * one on the next navigation. Returns false if the id is unknown or the tour
   * is not eligible.
   */
  start(tourId: string): boolean;
  /** Stop whatever is running, without unmounting. */
  stop(): void;
  /** Stop everything and release the location watcher. */
  unmount(): void;
}

/**
 * Register tours and keep them running across navigation.
 *
 * Pass a function rather than an array when the set of tours is computed —
 * it is re-read on every navigation, so tours loaded later are picked up.
 *
 * ```ts
 * const tours = mountTours(list, { state: createLocalState() });
 * tours.start('welcome');   // e.g. from a "show me again" button
 * ```
 */
export function mountTours(
  input: readonly RuntimeTour[] | (() => readonly RuntimeTour[]),
  options: MountOptions = {},
): MountHandle {
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
    //
    // Skipped wholesale when the host has taken the timing — but the arming
    // below still runs, which is the point of opting out of only this part.
    if (state && options.autoResume !== false) {
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
    // Inherited from PlayerOptions, so the same facts gate both a tour's rules
    // and its individual steps. Without it, targeting matches nobody: the rules
    // engine has always understood traits, but nothing supplied them.
    const traits = options.viewer?.();
    for (const tour of list()) {
      if (!eligible(tour)) continue;
      if (!tour.trigger || tour.trigger.type === 'manual') continue;
      const count = state ? seenCount(state, tour.id) : 0;
      const matches = matchRules(tour.rules, {
        url: window.location.href,
        traits,
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

  return {
    start(tourId) {
      const tour = list().find((t) => t.id === tourId);
      if (!tour || !eligible(tour)) return false;
      current?.stop();
      disarm();
      // Clear any half-finished run of this tour, so "start" means the top
      // rather than "resume wherever you left off".
      if (state) clearProgress(state);
      const player = createPlayer(tour, options);
      current = player;
      player.start();
      return true;
    },
    stop() {
      current?.stop();
      current = null;
    },
    unmount() {
      off();
      disarm();
      current?.stop();
      current = null;
    },
  };
}
