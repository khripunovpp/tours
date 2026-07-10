/**
 * Element picker: lets the author enter a "point-and-click" mode, hover to
 * highlight any element on the page, and click one to capture a CSS selector
 * for it. All picker UI lives in its own shadow DOM so the host page's CSS
 * cannot affect it (and vice versa).
 */
import { PICKER_STYLES } from './styles.js';
import { createLogger } from './logger.js';

export interface PickerHandle {
  start(): void;
  stop(): void;
}

/**
 * Build a stable CSS selector for an element.
 * - if the element has an id -> `#id`
 * - otherwise build a tag path with :nth-of-type from <body>
 *
 * Returned as the first (and, for now, only) candidate; the array shape leaves
 * room for fallback selectors later without changing the public contract.
 */
function buildSelector(el: Element): string {
  if (el.id) {
    return `#${CSS.escape(el.id)}`;
  }

  // Walk up to <body>, prepending each ancestor's tag. When siblings share the
  // tag, disambiguate with :nth-of-type so the path resolves to one element.
  const parts: string[] = [];
  let current: Element | null = el;

  while (current && current !== document.body && current.nodeType === 1) {
    const tag = current.tagName.toLowerCase();
    const parent: Element | null = current.parentElement;

    if (!parent) {
      parts.unshift(tag);
      break;
    }

    const sameTag = Array.from(parent.children).filter(
      (c) => c.tagName === current!.tagName,
    );
    if (sameTag.length > 1) {
      const index = sameTag.indexOf(current) + 1;
      parts.unshift(`${tag}:nth-of-type(${index})`);
    } else {
      parts.unshift(tag);
    }

    current = parent;
  }

  return `body > ${parts.join(' > ')}`;
}

/**
 * Create a picker. Call start() to enter selection mode and stop() to leave it.
 * onPick fires once with the captured selector(s), after which the picker stops
 * itself automatically.
 */
export function createPicker(onPick: (selectors: string[]) => void): PickerHandle {
  const log = createLogger('picker');
  let host: HTMLElement | null = null;
  let root: ShadowRoot | null = null;
  let overlay: HTMLElement | null = null;
  let active = false;

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

  /** Element under the cursor, ignoring our own picker UI. */
  function elementUnder(x: number, y: number): Element | null {
    const found = document.elementFromPoint(x, y);
    if (!found || found === host) return null;
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
    const selector = buildSelector(el);
    log.log('picked', selector);
    stop();
    onPick([selector]);
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
