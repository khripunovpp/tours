/**
 * Lifecycle events.
 *
 * Delivered two ways at once, because the two audiences differ:
 *
 * - **Callbacks** via `PlayerOptions.on` — typed, and the only form that can
 *   *cancel* something.
 * - **DOM `CustomEvent`s** on `document`, named `tours:<event>` — for a page
 *   that loaded the UMD bundle from a CDN and has no build step to import
 *   types into. Cancelled with `preventDefault()`.
 *
 * Two events are cancellable: `tourStarting` and `stepChanging`. A callback
 * returning `false` (or a DOM listener calling `preventDefault()`) blocks the
 * transition. Everything else is a notification and its return value is
 * ignored.
 */
import type { RuntimeStep, RuntimeTour } from './player.js';

/** Why a step was passed over. */
export type SkipReason = 'no-element' | 'condition';

/** Why a tour stopped. */
export type StopReason = 'completed' | 'dismissed';

export interface TourEventMap {
  /** About to start. Cancel to prevent it. */
  tourStarting: { tour: RuntimeTour; index: number };
  tourStarted: { tour: RuntimeTour; index: number };
  /** About to move between steps. Cancel to stay put. */
  stepChanging: { tour: RuntimeTour; from: number; to: number; step: RuntimeStep };
  /** A step is on screen — its target resolved and the card is placed. */
  stepActivated: { tour: RuntimeTour; index: number; step: RuntimeStep; target: Element };
  stepSkipped: { tour: RuntimeTour; index: number; step: RuntimeStep; reason: SkipReason };
  tourMinimized: { tour: RuntimeTour; index: number };
  tourResumed: { tour: RuntimeTour; index: number };
  /** Ran to the end. */
  tourCompleted: { tour: RuntimeTour };
  /** Closed before the end — the ×, the backdrop, or `stop()`. */
  tourDismissed: { tour: RuntimeTour; index: number };
}

export type TourEventName = keyof TourEventMap;

/**
 * Handlers. Returning `false` from a cancellable event blocks it; any other
 * return value is ignored.
 */
export type TourEventHandlers = {
  [K in TourEventName]?: (payload: TourEventMap[K]) => void | boolean;
};

/** Events that a handler can veto. */
const CANCELLABLE: ReadonlySet<TourEventName> = new Set<TourEventName>([
  'tourStarting',
  'stepChanging',
]);

/**
 * Fire an event both ways. Returns false only when a cancellable event was
 * vetoed — callers of non-cancellable events can ignore the result.
 */
export function emit<K extends TourEventName>(
  handlers: TourEventHandlers | undefined,
  name: K,
  payload: TourEventMap[K],
): boolean {
  const cancellable = CANCELLABLE.has(name);
  let allowed = true;

  const handler = handlers?.[name] as ((p: TourEventMap[K]) => void | boolean) | undefined;
  if (handler) {
    // A throwing handler is the host's bug, not ours — it must not take the
    // tour down with it, and must not read as a veto either.
    try {
      if (handler(payload) === false && cancellable) allowed = false;
    } catch (error) {
      console.error(`[tours] handler for "${name}" threw`, error);
    }
  }

  // Partial-DOM environments exist — SSR shims, trimmed test harnesses — and a
  // notification must never be the thing that takes a tour down. Feature-detect
  // rather than assuming a browser, and swallow a failing dispatch.
  if (typeof document !== 'undefined' && typeof CustomEvent === 'function') {
    try {
      const event = new CustomEvent(`tours:${name}`, { detail: payload, cancelable: cancellable });
      document.dispatchEvent(event);
      if (cancellable && event.defaultPrevented) allowed = false;
    } catch (error) {
      console.error(`[tours] could not dispatch "tours:${name}"`, error);
    }
  }

  return allowed;
}
