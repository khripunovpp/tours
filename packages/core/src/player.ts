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
import { resolveElement, waitForElement, type SelectorLike } from './selector.js';
import { matchUrl, deriveUrl } from './url.js';
import { onLocationChange } from './history.js';
import {
  type StateBackend,
  readProgress,
  writeProgress,
  clearProgress,
} from './state.js';
import { createLogger } from './logger.js';
import { showResumeInvite, type ResumeInvite } from './cta.js';
import { emit, type TourEventHandlers, type StopReason } from './events.js';

/**
 * A step as the player accepts it: identical to the stored `Step`, except that
 * `selectors` may also carry live DOM nodes or ref getters.
 *
 * The distinction is deliberate. A node cannot be serialised, so the *stored*
 * format — `Step` in `@tours/schema`, what `validate`/`migrate` accept and what
 * the builder writes — stays strings only. Nodes exist purely at runtime, for a
 * host that already holds the element and would otherwise have to invent a
 * selector for it.
 *
 * `Step` is assignable to this, so a plain validated tour needs no change.
 */
export type RuntimeStep = Omit<Step, 'selectors'> & { selectors: readonly SelectorLike[] };

/** A tour as the player accepts it — see {@link RuntimeStep}. */
export type RuntimeTour = Omit<Tour, 'steps'> & { steps: readonly RuntimeStep[] };

export interface PlayerHandle {
  /** Start the tour, optionally at a given step index (default 0). */
  start(startIndex?: number): void;
  stop(): void;
  next(): void;
  prev(): void;
  /**
   * Put the tour aside without finishing it: tear down the overlay, keep
   * progress, and offer an invitation to pick it back up.
   */
  minimize(): void;
  /** True between a successful start() and stop(). */
  isActive(): boolean;
}

export interface PlayerOptions {
  /**
   * Where to persist progress so a multi-page tour can continue after the
   * visitor navigates. Omit for single-page tours.
   */
  state?: StateBackend;
  /**
   * Override full-page navigation between steps. Receives the destination URL
   * and the id of the step being navigated to. When provided, the player calls
   * this instead of `window.location.assign` for cross-page (non-hash) steps —
   * letting a host (e.g. the builder's preview) tag the URL so it can resume
   * after the reload. Hash (SPA) navigation is unaffected.
   */
  onNavigate?: (url: string, stepId: string) => void;
  /**
   * Start even while the tour builder is mounted on the page. Default false.
   *
   * The builder is itself an overlay with its own preview, so a player started
   * underneath it stacks two overlays on the same page — always a mistake,
   * except for the builder's own preview, which sets this.
   *
   * Guarding here rather than at each call site means a host does not have to
   * remember the check in every place it starts a tour: `?tours-edit=1` alone
   * is enough to suppress them all.
   */
  allowWhileEditing?: boolean;
  /**
   * Render the "carry on with the tour" invitation yourself, instead of the
   * built-in corner popover. Must return a function that removes what it built.
   *
   * For small changes prefer the `--tours-cta-*` custom properties, which the
   * default popover reads from the host page.
   */
  renderResume?: (invite: ResumeInvite) => () => void;
  /**
   * Lifecycle handlers. `tourStarting` and `stepChanging` are cancellable —
   * return `false` to block them. Every event is also dispatched on `document`
   * as `tours:<name>`, for pages with no build step.
   */
  on?: TourEventHandlers;
}

/** Attribute the builder puts on its shadow host — see @tours/editor. */
const EDITOR_HOST = '[data-tours-editor]';

/**
 * True while the tour builder is mounted.
 *
 * Detected through the DOM rather than by importing the editor: core must not
 * depend on it (the dependency runs the other way), and this keeps the player
 * usable without the editor in the bundle.
 */
export function isBuilderMounted(): boolean {
  return typeof document !== 'undefined' && document.querySelector(EDITOR_HOST) !== null;
}

/**
 * Create a player for a tour. Returns handles to drive it: start/stop and
 * next/prev. The player owns its own shadow-DOM UI and cleans it up on stop().
 */
export function createPlayer(tour: RuntimeTour, options: PlayerOptions = {}): PlayerHandle {
  const log = createLogger('player');
  const state = options.state;
  let host: HTMLElement | null = null;
  let root: ShadowRoot | null = null;
  let spotlight: HTMLElement | null = null;
  let tooltip: HTMLElement | null = null;
  let backdrop: HTMLElement | null = null;
  // Set while waiting for the visitor to complete an interactive step.
  let awaitNext: (() => void) | null = null;
  // Removes the "carry on?" invitation shown while minimized.
  let closeInvite: (() => void) | null = null;
  let active = false;
  let index = 0;
  // Steps skipped because their target never appeared — excluded from progress.
  let skipped = 0;
  // Set while waiting for the page to change to the next step's page (SPA).
  let unwatch: (() => void) | null = null;
  // Tour-level visual settings shared with the editor.
  const pad = tour.display?.padding ?? DEFAULT_PADDING;
  const radius = tour.display?.radius ?? DEFAULT_RADIUS;
  const cardRadius = tour.display?.cardRadius ?? DEFAULT_CARD_RADIUS;
  const offset = tour.display?.offset ?? DEFAULT_OFFSET;

  /** Resolve a step's target via the re-finder (tries every candidate). */
  function findTarget(step: RuntimeStep): Element | null {
    return resolveElement(step.selectors);
  }

  /**
   * True when the visitor is meant to operate the target themselves, rather
   * than press Next: the step declares `action: { type: 'click' }`.
   *
   * Such a step must let the click reach the page, and must advance on the
   * visitor's own navigation instead of on a Next press.
   */
  function isInteractive(step: RuntimeStep): boolean {
    return step.action?.type === 'click';
  }

  /** True if a step belongs to the current page (no pageUrl ⇒ any page). */
  function onThisPage(step: RuntimeStep): boolean {
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

    backdrop = document.createElement('div');
    backdrop.className = 'tours-backdrop';
    // Clicking the dimmed area (outside the spotlight) dismisses the tour.
    //
    // On an interactive step the target area is clipped out of this element
    // entirely (see cutHole), so a click there never reaches this handler and
    // lands on the page instead. The rect test below still guards the
    // non-interactive case, where the backdrop covers the target too.
    backdrop.addEventListener('click', (e) => {
      const step = tour.steps[index];
      const target = step ? findTarget(step) : null;
      if (target) {
        const r = target.getBoundingClientRect();
        const inside =
          e.clientX >= r.left - pad &&
          e.clientX <= r.right + pad &&
          e.clientY >= r.top - pad &&
          e.clientY <= r.bottom + pad;
        if (inside) return; // swallow, rather than dismissing by accident
      }
      stop();
    });
    root.appendChild(backdrop);

    spotlight = document.createElement('div');
    spotlight.className = 'tours-spotlight';
    spotlight.style.borderRadius = `${radius}px`;
    root.appendChild(spotlight);

    document.body.appendChild(host);
  }

  /**
   * Clip the target's rectangle out of the backdrop, so clicks there land on
   * the page instead of on the overlay. `clip-path` removes the region from
   * hit-testing, which `pointer-events` on the spotlight cannot do — the
   * spotlight is only the outline; the dimming is its huge box-shadow, and the
   * backdrop is what actually covers the page.
   *
   * Traced as a single "frame with a slit" polygon rather than
   * `polygon(evenodd, …)`: the fill-rule argument is not supported everywhere,
   * and this shape needs no fill rule at all.
   */
  function cutHole(rect: DOMRect | null): void {
    if (!backdrop) return;
    if (!rect) {
      backdrop.style.clipPath = '';
      return;
    }
    const l = rect.left - pad;
    const t = rect.top - pad;
    const r = rect.right + pad;
    const b = rect.bottom + pad;
    backdrop.style.clipPath =
      `polygon(0 0, 0 100%, ${l}px 100%, ${l}px ${t}px, ${r}px ${t}px,` +
      ` ${r}px ${b}px, ${l}px ${b}px, ${l}px 100%, 100% 100%, 100% 0)`;
  }

  /** Size and place the spotlight cut-out around the target (with padding). */
  function positionSpotlight(rect: DOMRect, fast = false): void {
    if (!spotlight) return;
    // Animate between steps; track the target instantly on scroll/resize.
    spotlight.style.transitionDuration = fast ? '0ms' : '';
    spotlight.style.display = 'block';
    spotlight.style.left = `${rect.left - pad}px`;
    spotlight.style.top = `${rect.top - pad}px`;
    spotlight.style.width = `${rect.width + pad * 2}px`;
    spotlight.style.height = `${rect.height + pad * 2}px`;
  }

  /** Place the tooltip per the step's side/alignment/offset, clamped on screen. */
  function positionTooltip(rect: DOMRect, step: RuntimeStep): void {
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
  function renderTooltip(step: RuntimeStep): void {
    // Exclude skipped (unfindable) steps from the progress counter.
    const total = Math.max(1, tour.steps.length - skipped);
    const position = Math.max(1, Math.min(index + 1 - skipped, total));
    if (tooltip) tooltip.remove();

    const isLast = index === tour.steps.length - 1;
    const prevStep = tour.steps[index - 1];
    // Back is offered only for a previous step on *this* page. There is no
    // first step to go back from, and going back across pages meant
    // `history.back()` — a guess that lands wherever the visitor happened to
    // come from, which need not be the tour's previous page at all. Better to
    // omit the button than to offer one that misfires.
    const canGoBack = !!prevStep && onThisPage(prevStep);
    // On an interactive step the visitor advances by acting on the page, so a
    // Next button would offer a second, contradictory way forward. The last
    // step is the exception: nothing follows it, so the button is the only way
    // to finish.
    const showNext = !isInteractive(step) || isLast;

    // i18n is deferred; for now show the default-language text.
    tooltip = renderCard({
      contentText: step.content.default,
      progress: `Step ${position} of ${total}`,
      showClose: true,
      onClose: dismiss,
      radius: cardRadius,
      back: canGoBack ? { label: step.backLabel ?? 'Back', onClick: prev } : undefined,
      next: showNext
        ? {
            label: step.nextLabel ?? (isLast ? 'Done' : 'Next'),
            primary: true,
            onClick: next,
          }
        : undefined,
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
          emit(options.on, 'stepSkipped', { tour, index, step, reason: 'no-element' });
          skipped += 1; // drop it from the progress total
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
    // Only interactive steps let the click through; elsewhere the backdrop
    // still covers the target, so a stray click cannot fire it by accident.
    cutHole(isInteractive(step) ? rect : null);
    watchForVisitorAdvance(step);
    emit(options.on, 'stepActivated', { tour, index, step, target });
  }

  /**
   * On an interactive step, advance when the visitor's own navigation lands on
   * the page the next step wants.
   *
   * The host app owns its routing — the URL may change by rules we know nothing
   * about — so rather than driving navigation we watch for the one signal that
   * says the step is done: the next step's `pageUrl` starts matching.
   * `onLocationChange` covers pushState/replaceState too, so this works for a
   * client-side router as well as a hash change.
   *
   * A full page load ends this watcher with the document; `resumeTour` picks
   * the tour back up on arrival.
   */
  function watchForVisitorAdvance(step: RuntimeStep): void {
    awaitNext?.();
    awaitNext = null;
    if (!isInteractive(step)) return;

    const nextIndex = index + 1;
    const nextStep = tour.steps[nextIndex];
    // Nothing to advance to, or the next step lives on this same page — in
    // which case a URL change is not the completion signal and Next still is.
    if (!nextStep || onThisPage(nextStep)) return;

    awaitNext = onLocationChange(() => {
      if (!active || tour.steps[index] !== step) return;
      if (!matchUrl(nextStep.pageUrl, window.location.href)) return;
      if (!mayChangeTo(nextIndex)) return;
      awaitNext?.();
      awaitNext = null;
      log.log('visitor navigated → advancing to', nextStep.id);
      index = nextIndex;
      persist();
      render();
    });
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
    positionSpotlight(rect, true); // instant while scrolling/resizing
    positionTooltip(rect, step);
  }

  function start(startIndex = 0): void {
    if (active) return;
    if (tour.steps.length === 0) return;
    if (!options.allowWhileEditing && isBuilderMounted()) {
      log.log(`start suppressed for "${tour.id}" — the builder is mounted`);
      return;
    }
    const at = Math.max(0, Math.min(startIndex, tour.steps.length - 1));
    if (!emit(options.on, 'tourStarting', { tour, index: at })) {
      log.log('start vetoed by handler');
      return;
    }
    dropInvite();
    active = true;
    index = at;
    skipped = 0;
    log.log('start', tour.id, `at ${index}/${tour.steps.length}`);
    ensureUi();
    // Capture phase so navigation keys work even if the page listens too.
    window.addEventListener('keydown', onKey, true);
    window.addEventListener('resize', reposition, true);
    window.addEventListener('scroll', reposition, true);
    persist();
    emit(options.on, 'tourStarted', { tour, index });
    render();
  }

  /** Hide the spotlight/card without ending the tour (page transition). */
  function hideVisuals(): void {
    if (spotlight) spotlight.style.display = 'none';
    if (tooltip) {
      tooltip.remove();
      tooltip = null;
    }
  }

  /**
   * Keep the tour alive but hidden, and continue it once the URL changes to the
   * page the next step belongs to — no reload needed (SPA / visitor-driven).
   */
  function waitForPageChange(): void {
    hideVisuals();
    if (unwatch) return;
    unwatch = onLocationChange(() => {
      if (!active) {
        unwatch?.();
        unwatch = null;
        return;
      }
      const step = tour.steps[index];
      if (step && onThisPage(step)) {
        unwatch?.();
        unwatch = null;
        render();
      }
    });
  }

  /** Remove the UI and listeners, but keep any saved progress. */
  function teardownUi(): void {
    if (unwatch) {
      unwatch();
      unwatch = null;
    }
    // The interactive-step watcher outlives the UI otherwise, and would keep
    // reacting to the host's navigations after the tour is gone.
    if (awaitNext) {
      awaitNext();
      awaitNext = null;
    }
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
    backdrop = null;
  }

  /** End the tour (finished or dismissed): tear down and forget progress. */
  function stop(reason: StopReason = 'dismissed'): void {
    log.log('stop', reason);
    const wasActive = active;
    const at = index;
    dropInvite();
    teardownUi();
    if (state) clearProgress(state);
    // Only report an ending for a tour that was actually running — stop() is
    // also called defensively from paths that may already have torn down.
    if (!wasActive) return;
    if (reason === 'completed') emit(options.on, 'tourCompleted', { tour });
    else emit(options.on, 'tourDismissed', { tour, index: at });
  }

  function dropInvite(): void {
    closeInvite?.();
    closeInvite = null;
  }

  /**
   * What the card's × does. Closing is always permitted — a visitor who has
   * lost interest must be able to clear the screen — but a tour may ask to be
   * merely set aside rather than ended.
   */
  function dismiss(): void {
    if (tour.dismiss?.mode === 'minimize') minimize();
    else stop();
  }

  function minimize(): void {
    if (!active) return;
    log.log('minimized', tour.id, `at ${index}`);
    teardownUi();
    // Keep the position, and mark it so nothing auto-resumes: picking the tour
    // back up has to stay the visitor's decision, or minimizing would just be
    // a slow way of doing nothing.
    if (state) writeProgress(state, { tourId: tour.id, index, minimized: true });
    emit(options.on, 'tourMinimized', { tour, index });
    offerResume();
  }

  /** Show the invitation to carry on, here and now. */
  function offerResume(): void {
    dropInvite();
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
          if (state) writeProgress(state, { tourId: tour.id, index });
          emit(options.on, 'tourResumed', { tour, index });
          start(index);
        },
      },
      options.renderResume,
    );
  }

  /**
   * Announce a step transition and let a handler veto it. Every move between
   * steps goes through here, so a host that blocks `stepChanging` cannot be
   * bypassed by a different code path.
   */
  function mayChangeTo(to: number): boolean {
    const step = tour.steps[to];
    if (!step) return true;
    return emit(options.on, 'stepChanging', { tour, from: index, to, step });
  }

  function next(): void {
    if (!active) return;
    const nextIndex = index + 1;
    const nextStep = tour.steps[nextIndex];
    if (!nextStep) {
      stop('completed'); // reached the end
      return;
    }
    if (!mayChangeTo(nextIndex)) {
      log.log('step change vetoed by handler');
      return;
    }
    if (onThisPage(nextStep)) {
      index = nextIndex;
      persist();
      render();
      return;
    }
    // The next step lives on another page. Remember where to resume.
    index = nextIndex;
    persist();
    // Perform a full-page navigation to `url`, letting a host override it.
    const navigate = (url: string): void => {
      teardownUi();
      if (options.onNavigate) options.onNavigate(url, nextStep.id);
      else window.location.assign(url);
    };
    const action = tour.steps[index - 1]?.action;
    if (action && action.type === 'navigate' && action.url) {
      if (action.url.startsWith('#')) {
        // Hash navigation is client-side (SPA): change the hash without a
        // reload and continue in place once the view updates.
        log.log('page transition (hash navigate) → resume at', index);
        waitForPageChange();
        window.location.hash = action.url;
      } else {
        // Full navigation → reload; resumeTour() continues on arrival.
        log.log('page transition (navigate) → resume at', index);
        navigate(action.url);
      }
      return;
    }
    // No explicit action: try to derive a concrete URL from the next step's
    // page matcher and navigate there ourselves, so an authored multi-page
    // tour advances on Next without the visitor having to navigate manually.
    const derived = deriveUrl(nextStep.pageUrl);
    if (derived) {
      if (derived.startsWith('#')) {
        log.log('page transition (derived hash) → resume at', index);
        waitForPageChange();
        window.location.hash = derived;
      } else {
        log.log('page transition (derived navigate) → resume at', index, derived);
        navigate(derived);
      }
      return;
    }
    // Nothing to navigate to: stay alive and continue when the URL matches
    // (visitor/SPA-driven).
    log.log('page transition (wait) → resume at', index);
    waitForPageChange();
  }

  function prev(): void {
    if (!active) return;
    const prevStep = tour.steps[index - 1];
    if (!prevStep) return;
    if (!mayChangeTo(index - 1)) {
      log.log('step change vetoed by handler');
      return;
    }
    if (onThisPage(prevStep)) {
      index -= 1;
      persist();
      render();
      return;
    }
    // The previous step is on another page — go back to it and resume there.
    index -= 1;
    persist();
    log.log('page transition back → resume at', index);
    waitForPageChange();
    window.history.back();
  }

  return { start, stop, next, prev, minimize, isActive: () => active };
}

/**
 * Resume an in-progress tour after navigation. Reads saved progress; if it is
 * for this tour and the pending step belongs to the current page, starts the
 * player there. Returns the player, or null when there is nothing to resume
 * here yet. Call on every page load for multi-page tours.
 */
export function resumeTour(tour: RuntimeTour, options: PlayerOptions = {}): PlayerHandle | null {
  const state = options.state;
  if (!state) return null;
  const progress = readProgress(state);
  if (!progress || progress.tourId !== tour.id) return null;
  if (!tour.steps[progress.index]) {
    clearProgress(state);
    return null;
  }

  // Scan forward for the first step this page satisfies, rather than only
  // checking the stored one.
  //
  // The stored index is the last step the player *rendered*. When the player
  // drives the navigation it bumps the index first, so the stored step is the
  // right one. But on an interactive step the visitor navigates themselves —
  // `next()` never runs, the index still points at the previous page, and
  // checking only that step would return null and silently kill the tour.
  //
  // Forward only: a visitor who navigates backwards should not have the tour
  // replay steps they already completed.
  let resumeAt = -1;
  for (let i = progress.index; i < tour.steps.length; i++) {
    if (matchUrl(tour.steps[i].pageUrl, window.location.href)) {
      resumeAt = i;
      break;
    }
  }
  if (resumeAt === -1) return null; // not a page this tour continues on

  // Forward the caller's options rather than only `state`, so onNavigate and
  // allowWhileEditing survive a resume.
  const player = createPlayer(tour, options);
  player.start(resumeAt);
  return player;
}
