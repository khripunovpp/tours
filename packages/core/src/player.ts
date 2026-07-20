/**
 * Tour player: renders a step-by-step walkthrough over the live page — a
 * dimmed backdrop with a "spotlight" cut-out around the current target and a
 * tooltip card with the step text and navigation. All UI lives in its own
 * shadow DOM so the host page's styles cannot interfere.
 */
import type { Step, Tour } from '@tours/schema';
import {
  DEFAULT_PADDING,
  DEFAULT_RADIUS,
  DEFAULT_CARD_RADIUS,
  DEFAULT_OFFSET,
} from '@tours/schema';
import { PLAYER_STYLES } from './styles.js';
import { placeCard } from './position.js';
import { renderCard, CARD_STYLES } from './card.js';
import { resolveElement, waitForElement } from './selector.js';
import { matchUrl } from './url.js';
import {
  type StateBackend,
  readProgress,
  writeProgress,
  clearProgress,
} from './state.js';
import { createLogger } from './logger.js';

export interface PlayerHandle {
  /** Start the tour, optionally at a given step index (default 0). */
  start(startIndex?: number): void;
  stop(): void;
  next(): void;
  prev(): void;
}

export interface PlayerOptions {
  /**
   * Where to persist progress so a multi-page tour can continue after the
   * visitor navigates. Omit for single-page tours.
   */
  state?: StateBackend;
}

/**
 * Create a player for a tour. Returns handles to drive it: start/stop and
 * next/prev. The player owns its own shadow-DOM UI and cleans it up on stop().
 */
export function createPlayer(tour: Tour, options: PlayerOptions = {}): PlayerHandle {
  const log = createLogger('player');
  const state = options.state;
  let host: HTMLElement | null = null;
  let root: ShadowRoot | null = null;
  let spotlight: HTMLElement | null = null;
  let tooltip: HTMLElement | null = null;
  let active = false;
  let index = 0;
  // Tour-level visual settings shared with the editor.
  const pad = tour.display?.padding ?? DEFAULT_PADDING;
  const radius = tour.display?.radius ?? DEFAULT_RADIUS;
  const cardRadius = tour.display?.cardRadius ?? DEFAULT_CARD_RADIUS;
  const offset = tour.display?.offset ?? DEFAULT_OFFSET;

  /** Resolve a step's target via the re-finder (tries every candidate). */
  function findTarget(step: Step): Element | null {
    return resolveElement(step.selectors);
  }

  /** True if a step belongs to the current page (no pageUrl ⇒ any page). */
  function onThisPage(step: Step): boolean {
    return matchUrl(step.pageUrl, window.location.href);
  }

  /** Remember where to resume (or clear when the tour is over). */
  function persist(): void {
    if (state) writeProgress(state, { tourId: tour.id, index });
  }

  /** Lazily build the shadow-DOM host: backdrop, spotlight and tooltip. */
  function ensureUi(): void {
    if (host) return;
    host = document.createElement('div');
    host.setAttribute('data-tours-player', '');
    root = host.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = PLAYER_STYLES + CARD_STYLES;
    root.appendChild(style);

    const backdrop = document.createElement('div');
    backdrop.className = 'tours-backdrop';
    root.appendChild(backdrop);

    spotlight = document.createElement('div');
    spotlight.className = 'tours-spotlight';
    spotlight.style.borderRadius = `${radius}px`;
    root.appendChild(spotlight);

    document.body.appendChild(host);
  }

  /** Size and place the spotlight cut-out around the target (with padding). */
  function positionSpotlight(rect: DOMRect): void {
    if (!spotlight) return;
    spotlight.style.display = 'block';
    spotlight.style.left = `${rect.left - pad}px`;
    spotlight.style.top = `${rect.top - pad}px`;
    spotlight.style.width = `${rect.width + pad * 2}px`;
    spotlight.style.height = `${rect.height + pad * 2}px`;
  }

  /** Place the tooltip per the step's side/alignment/offset, clamped on screen. */
  function positionTooltip(rect: DOMRect, step: Step): void {
    if (!tooltip) return;
    // Measure from the outline (target inflated by the spotlight padding), so
    // 0 distance sits flush against the visible frame.
    const framed = {
      top: rect.top - pad,
      left: rect.left - pad,
      right: rect.right + pad,
      bottom: rect.bottom + pad,
      width: rect.width + pad * 2,
      height: rect.height + pad * 2,
    };
    const { top, left } = placeCard({
      target: framed,
      card: { width: tooltip.offsetWidth, height: tooltip.offsetHeight },
      side: step.placement ?? 'bottom',
      align: step.align ?? 'center',
      offset,
      alignOffset: tour.display?.alignOffset ?? 0,
      viewport: { width: window.innerWidth, height: window.innerHeight },
    });
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
  }

  /** (Re)build the tooltip card for the given step via the shared renderer. */
  function renderTooltip(step: Step): void {
    const total = tour.steps.length;
    if (tooltip) tooltip.remove();
    // i18n is deferred; for now show the default-language text.
    tooltip = renderCard({
      contentText: step.content.default,
      progress: `Step ${index + 1} of ${total}`,
      showClose: true,
      onClose: stop,
      radius: cardRadius,
      back: { label: step.backLabel ?? 'Back', disabled: index === 0, onClick: prev },
      next: {
        label: step.nextLabel ?? (index === total - 1 ? 'Done' : 'Next'),
        primary: true,
        onClick: next,
      },
    });
    root?.appendChild(tooltip);
  }

  /**
   * Render the current step: resolve its target, scroll it into view and place
   * the spotlight and tooltip. Steps whose target is missing are skipped.
   */
  function render(): void {
    if (!active) return;
    const step = tour.steps[index];
    if (!step) {
      stop();
      return;
    }

    log.log('render step', index, step.id);
    const target = findTarget(step);
    if (!target) {
      // The element may not be in the DOM yet (SPA / lazy). Wait for it, then
      // render; skip only if it never appears within the timeout.
      log.log(`step "${step.id}" target not found yet — waiting`, step.selectors);
      void waitForElement(step.selectors, { timeout: 4000 }).then((el) => {
        if (!active || tour.steps[index] !== step) return;
        if (el) {
          render();
        } else {
          log.warn(`step "${step.id}" skipped: no element for selectors`, step.selectors);
          if (index < tour.steps.length - 1) {
            index += 1;
            render();
          } else {
            stop();
          }
        }
      });
      return;
    }

    ensureUi();
    target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });

    // Render tooltip content first so its size is measurable for positioning.
    renderTooltip(step);
    const rect = target.getBoundingClientRect();
    positionSpotlight(rect);
    positionTooltip(rect, step);
  }

  /** Keyboard navigation: Esc closes, arrows move between steps. */
  function onKey(e: KeyboardEvent): void {
    if (!active) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      stop();
    } else if (e.key === 'ArrowRight') {
      next();
    } else if (e.key === 'ArrowLeft') {
      prev();
    }
  }

  /** Recompute positions after scroll/resize without rebuilding the tooltip. */
  function reposition(): void {
    if (!active) return;
    const step = tour.steps[index];
    if (!step) return;
    const target = findTarget(step);
    if (!target) return;
    const rect = target.getBoundingClientRect();
    positionSpotlight(rect);
    positionTooltip(rect, step);
  }

  function start(startIndex = 0): void {
    if (active) return;
    if (tour.steps.length === 0) return;
    active = true;
    index = Math.max(0, Math.min(startIndex, tour.steps.length - 1));
    log.log('start', tour.id, `at ${index}/${tour.steps.length}`);
    ensureUi();
    // Capture phase so navigation keys work even if the page listens too.
    window.addEventListener('keydown', onKey, true);
    window.addEventListener('resize', reposition, true);
    window.addEventListener('scroll', reposition, true);
    persist();
    render();
  }

  /** Remove the UI and listeners, but keep any saved progress. */
  function teardownUi(): void {
    if (!active) return;
    active = false;
    window.removeEventListener('keydown', onKey, true);
    window.removeEventListener('resize', reposition, true);
    window.removeEventListener('scroll', reposition, true);
    if (host && host.parentNode) {
      host.parentNode.removeChild(host);
    }
    host = null;
    root = null;
    spotlight = null;
    tooltip = null;
  }

  /** End the tour (finished or dismissed): tear down and forget progress. */
  function stop(): void {
    log.log('stop');
    teardownUi();
    if (state) clearProgress(state);
  }

  function next(): void {
    if (!active) return;
    const nextIndex = index + 1;
    const nextStep = tour.steps[nextIndex];
    if (!nextStep) {
      stop(); // reached the end
      return;
    }
    if (onThisPage(nextStep)) {
      index = nextIndex;
      persist();
      render();
      return;
    }
    // The next step lives on another page. Remember to resume there, hide the
    // tour here, and — if the current step declares a navigate action — go.
    index = nextIndex;
    persist();
    const action = tour.steps[index - 1]?.action;
    log.log('page transition → resume at', index);
    teardownUi();
    if (action && action.type === 'navigate' && action.url) {
      window.location.assign(action.url);
    }
    // Otherwise the visitor navigates themselves; resumeTour() picks it up.
  }

  function prev(): void {
    if (!active) return;
    const prevStep = tour.steps[index - 1];
    if (!prevStep || !onThisPage(prevStep)) return; // stay on this page
    index -= 1;
    persist();
    render();
  }

  return { start, stop, next, prev };
}

/**
 * Resume an in-progress tour after navigation. Reads saved progress; if it is
 * for this tour and the pending step belongs to the current page, starts the
 * player there. Returns the player, or null when there is nothing to resume
 * here yet. Call on every page load for multi-page tours.
 */
export function resumeTour(tour: Tour, options: PlayerOptions = {}): PlayerHandle | null {
  const state = options.state;
  if (!state) return null;
  const progress = readProgress(state);
  if (!progress || progress.tourId !== tour.id) return null;
  const step = tour.steps[progress.index];
  if (!step) {
    clearProgress(state);
    return null;
  }
  if (!matchUrl(step.pageUrl, window.location.href)) return null; // not our page yet
  const player = createPlayer(tour, { state });
  player.start(progress.index);
  return player;
}
