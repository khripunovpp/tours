/**
 * Element picker: lets the author enter a "point-and-click" mode, hover to
 * highlight any element on the page, and click one to capture a CSS selector
 * for it. All picker UI lives in its own shadow DOM so the host page's CSS
 * cannot affect it (and vice versa).
 */
import { PICKER_STYLES } from './styles.js';
import { buildSelectors } from './selector.js';
import { createLogger } from './logger.js';

export interface PickerHandle {
  start(): void;
  stop(): void;
}

export interface PickerOptions {
  /**
   * Elements the picker must never highlight or capture (e.g. the editor's own
   * UI). Anything at or inside one of these is treated as empty space, so the
   * selector search does not react to the tool's own chrome.
   */
  ignore?: Array<Element | null | undefined>;
}

/**
 * Create a picker. Call start() to enter selection mode and stop() to leave it.
 * onPick fires once with the captured selector(s), after which the picker stops
 * itself automatically.
 */
export function createPicker(
  onPick: (selectors: string[]) => void,
  options: PickerOptions = {},
): PickerHandle {
  const log = createLogger('picker');
  let host: HTMLElement | null = null;
  let root: ShadowRoot | null = null;
  let overlay: HTMLElement | null = null;
  let active = false;

  /** True if the element is (or lives inside) our own UI or an ignored one. */
  function isIgnored(el: Element): boolean {
    if (el === host) return true;
    for (const ignored of options.ignore ?? []) {
      if (ignored && ignored.contains(el)) return true;
    }
    return false;
  }

  /** Lazily create the shadow-DOM host, highlight overlay and hint banner. */
  function ensureUi(): void {
    if (host) return;
    host = document.createElement('div');
    host.setAttribute('data-tours-picker', '');
    root = host.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = PICKER_STYLES;
    root.appendChild(style);

    overlay = document.createElement('div');
    overlay.className = 'tours-picker-overlay';
    overlay.style.display = 'none';
    root.appendChild(overlay);

    const hint = document.createElement('div');
    hint.className = 'tours-picker-hint';
    hint.textContent = 'Hover and click an element • Esc to cancel';
    root.appendChild(hint);

    document.body.appendChild(host);
  }

  /** Element under the cursor, skipping our own UI and any ignored elements. */
  function elementUnder(x: number, y: number): Element | null {
    const found = document.elementFromPoint(x, y);
    if (!found || isIgnored(found)) return null;
    return found;
  }

  /** Move the highlight overlay to track the element under the cursor. */
  function onMove(e: MouseEvent): void {
    if (!active || !overlay) return;
    const el = elementUnder(e.clientX, e.clientY);
    if (!el) {
      overlay.style.display = 'none';
      return;
    }
    const rect = el.getBoundingClientRect();
    overlay.style.display = 'block';
    overlay.style.left = `${rect.left}px`;
    overlay.style.top = `${rect.top}px`;
    overlay.style.width = `${rect.width}px`;
    overlay.style.height = `${rect.height}px`;
  }

  /** Capture the clicked element's selector; swallow the click from the page. */
  function onClick(e: MouseEvent): void {
    if (!active) return;
    const el = elementUnder(e.clientX, e.clientY);
    e.preventDefault();
    e.stopPropagation();
    if (!el) return;
    const selectors = buildSelectors(el);
    log.log('picked', selectors);
    stop();
    onPick(selectors);
  }

  /** Esc cancels selection. */
  function onKey(e: KeyboardEvent): void {
    if (e.key === 'Escape') {
      e.preventDefault();
      stop();
    }
  }

  function start(): void {
    if (active) return;
    active = true;
    log.log('start');
    ensureUi();
    // Capture phase so we intercept events before the host page handles them.
    document.addEventListener('mousemove', onMove, true);
    document.addEventListener('click', onClick, true);
    document.addEventListener('keydown', onKey, true);
  }

  function stop(): void {
    if (!active) return;
    active = false;
    document.removeEventListener('mousemove', onMove, true);
    document.removeEventListener('click', onClick, true);
    document.removeEventListener('keydown', onKey, true);
    if (host && host.parentNode) {
      host.parentNode.removeChild(host);
    }
    host = null;
    root = null;
    overlay = null;
  }

  return { start, stop };
}
