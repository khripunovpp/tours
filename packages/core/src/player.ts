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
import { createLogger } from './logger.js';

export interface PlayerHandle {
  start(): void;
  stop(): void;
  next(): void;
  prev(): void;
}

/**
 * Create a player for a tour. Returns handles to drive it: start/stop and
 * next/prev. The player owns its own shadow-DOM UI and cleans it up on stop().
 */
export function createPlayer(tour: Tour): PlayerHandle {
  const log = createLogger('player');
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

  /** Resolve a step's target, trying each candidate selector in order. */
  function findTarget(step: Step): Element | null {
    for (const selector of step.selectors) {
      try {
        const el = document.querySelector(selector);
        if (el) return el;
      } catch {
        // Invalid selector — try the next candidate.
      }
    }
    return null;
  }

  /** Lazily build the shadow-DOM host: backdrop, spotlight and tooltip. */
  function ensureUi(): void {
    if (host) return;
    host = document.createElement('div');
    host.setAttribute('data-tours-player', '');
    root = host.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = PLAYER_STYLES;
    root.appendChild(style);

    const backdrop = document.createElement('div');
    backdrop.className = 'tours-backdrop';
    root.appendChild(backdrop);

    spotlight = document.createElement('div');
    spotlight.className = 'tours-spotlight';
    spotlight.style.borderRadius = `${radius}px`;
    root.appendChild(spotlight);

    tooltip = document.createElement('div');
    tooltip.className = 'tours-tooltip';
    tooltip.style.borderRadius = `${cardRadius}px`;
    root.appendChild(tooltip);

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

  /** (Re)build the tooltip contents for the given step. */
  function renderTooltip(step: Step): void {
    if (!tooltip) return;
    const total = tour.steps.length;

    tooltip.textContent = '';

    const close = document.createElement('button');
    close.className = 'tours-close';
    close.type = 'button';
    close.textContent = '×';
    close.setAttribute('aria-label', 'Close');
    close.addEventListener('click', stop);
    tooltip.appendChild(close);

    const content = document.createElement('p');
    content.className = 'tours-tooltip__content';
    // i18n is deferred; for now show the default-language text.
    content.textContent = step.content.default;
    tooltip.appendChild(content);

    const footer = document.createElement('div');
    footer.className = 'tours-tooltip__footer';

    const progress = document.createElement('span');
    progress.className = 'tours-tooltip__progress';
    progress.textContent = `Step ${index + 1} of ${total}`;
    footer.appendChild(progress);

    const buttons = document.createElement('div');
    buttons.className = 'tours-tooltip__buttons';

    const prevBtn = document.createElement('button');
    prevBtn.className = 'tours-btn';
    prevBtn.type = 'button';
    prevBtn.textContent = 'Back';
    prevBtn.disabled = index === 0;
    prevBtn.addEventListener('click', prev);
    buttons.appendChild(prevBtn);

    const nextBtn = document.createElement('button');
    nextBtn.className = 'tours-btn tours-btn--primary';
    nextBtn.type = 'button';
    nextBtn.textContent = index === total - 1 ? 'Done' : 'Next';
    nextBtn.addEventListener('click', next);
    buttons.appendChild(nextBtn);

    footer.appendChild(buttons);
    tooltip.appendChild(footer);
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
      log.warn(`step "${step.id}" skipped: no element for selectors`, step.selectors);
      // Advance in the same direction; default forward.
      if (index < tour.steps.length - 1) {
        index += 1;
        render();
      } else {
        stop();
      }
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

  function start(): void {
    if (active) return;
    if (tour.steps.length === 0) return;
    active = true;
    index = 0;
    log.log('start', tour.id, `${tour.steps.length} steps`);
    ensureUi();
    // Capture phase so navigation keys work even if the page listens too.
    window.addEventListener('keydown', onKey, true);
    window.addEventListener('resize', reposition, true);
    window.addEventListener('scroll', reposition, true);
    render();
  }

  function stop(): void {
    if (!active) return;
    active = false;
    log.log('stop');
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

  function next(): void {
    if (!active) return;
    if (index >= tour.steps.length - 1) {
      stop();
      return;
    }
    index += 1;
    render();
  }

  function prev(): void {
    if (!active) return;
    if (index <= 0) return;
    index -= 1;
    render();
  }

  return { start, stop, next, prev };
}
