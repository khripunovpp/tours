/**
 * Selector engine — the project's main technical risk. Instead of one brittle
 * selector per step, we build a ranked list of candidates (most stable first),
 * resolve a step by trying them in order (re-finder), and wait for elements
 * that are not in the DOM yet (SPA / lazy rendering).
 */

/** Quote a value for a CSS attribute selector. */
function cssString(value: string): string {
  return JSON.stringify(value);
}

/** Stable-looking class: no framework hashes, no long digit runs. */
function isStableClass(c: string): boolean {
  return (
    /^[a-zA-Z][\w-]*$/.test(c) &&
    c.length <= 30 &&
    !/\d{2,}/.test(c) &&
    !/^(css-|sc-|jsx-|emotion-|_|is-|has-)/.test(c)
  );
}

/** Full structural path from <body> using :nth-of-type to stay unambiguous. */
function structuralPath(el: Element): string {
  const parts: string[] = [];
  let current: Element | null = el;
  while (current && current !== document.body && current.nodeType === 1) {
    const tag = current.tagName.toLowerCase();
    const parent: Element | null = current.parentElement;
    if (!parent) {
      parts.unshift(tag);
      break;
    }
    const sameTag = Array.from(parent.children).filter((c) => c.tagName === current!.tagName);
    parts.unshift(sameTag.length > 1 ? `${tag}:nth-of-type(${sameTag.indexOf(current) + 1})` : tag);
    current = parent;
  }
  return `body > ${parts.join(' > ')}`;
}

/** Path scoped to the nearest ancestor carrying an id (shorter, more robust). */
function scopedPath(el: Element): string | null {
  let anchor: Element | null = el.parentElement;
  while (anchor && anchor !== document.body) {
    if (anchor.id) break;
    anchor = anchor.parentElement;
  }
  if (!anchor || !anchor.id) return null;

  const parts: string[] = [];
  let current: Element | null = el;
  while (current && current !== anchor) {
    const tag = current.tagName.toLowerCase();
    const parent: Element | null = current.parentElement;
    if (!parent) return null;
    const sameTag = Array.from(parent.children).filter((c) => c.tagName === current!.tagName);
    parts.unshift(sameTag.length > 1 ? `${tag}:nth-of-type(${sameTag.indexOf(current) + 1})` : tag);
    current = parent;
  }
  return `#${CSS.escape(anchor.id)} > ${parts.join(' > ')}`;
}

const DATA_ATTRS = ['data-testid', 'data-test', 'data-test-id', 'data-cy', 'data-qa', 'data-id', 'data-name'];

/**
 * Build a ranked list of candidate selectors for an element, best (most
 * stable / unique) first. Only candidates that actually resolve back to the
 * element are kept, so every entry is verified at capture time.
 */
export function buildSelectors(el: Element): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  const tag = el.tagName.toLowerCase();

  const add = (sel: string | null): void => {
    if (!sel || seen.has(sel)) return;
    try {
      if (document.querySelector(sel) === el) {
        seen.add(sel);
        out.push(sel);
      }
    } catch {
      // Invalid selector — skip.
    }
  };

  if (el.id) add(`#${CSS.escape(el.id)}`);

  for (const name of DATA_ATTRS) {
    const v = el.getAttribute(name);
    if (v) add(`${tag}[${name}=${cssString(v)}]`);
  }

  const name = el.getAttribute('name');
  if (name) add(`${tag}[name=${cssString(name)}]`);
  const aria = el.getAttribute('aria-label');
  if (aria) add(`[aria-label=${cssString(aria)}]`);

  const classes = Array.from(el.classList).filter(isStableClass);
  if (classes.length) add(`${tag}.${classes.map((c) => CSS.escape(c)).join('.')}`);
  for (const c of classes) add(`${tag}.${CSS.escape(c)}`);

  add(scopedPath(el));
  add(structuralPath(el));

  // Text match as a last resort (resolved specially, not via querySelector).
  const text = (el.textContent ?? '').replace(/\s+/g, ' ').trim();
  if (text && text.length <= 50 && /^(a|button|summary|label|h[1-6])$/.test(tag)) {
    const t = `text=${text}`;
    if (!seen.has(t)) {
      seen.add(t);
      out.push(t);
    }
  }

  // Never return empty — structural path always describes the element.
  if (out.length === 0) out.push(structuralPath(el));
  return out;
}

const TEXT_ROLES = 'a, button, summary, label, h1, h2, h3, h4, h5, h6';

/** Resolve a single candidate, honouring the `text=` pseudo-selector. */
function resolveOne(sel: string, root: ParentNode): Element | null {
  if (sel.startsWith('text=')) {
    const want = sel.slice(5).trim();
    for (const n of Array.from(root.querySelectorAll(TEXT_ROLES))) {
      if ((n.textContent ?? '').replace(/\s+/g, ' ').trim() === want) return n;
    }
    return null;
  }
  try {
    return root.querySelector(sel);
  } catch {
    return null;
  }
}

/** Re-finder: return the first candidate selector that resolves to an element. */
export function resolveElement(selectors: string[], root: ParentNode = document): Element | null {
  for (const sel of selectors) {
    const el = resolveOne(sel, root);
    if (el) return el;
  }
  return null;
}

export interface WaitOptions {
  /** Give up after this many ms (default 4000). Use 0 to wait indefinitely. */
  timeout?: number;
  root?: ParentNode;
}

/**
 * Resolve now, or wait for the element to appear (SPA / lazy). Observes the DOM
 * and resolves with the element, or null on timeout. Never rejects.
 */
export function waitForElement(selectors: string[], options: WaitOptions = {}): Promise<Element | null> {
  const root = options.root ?? document;
  const immediate = resolveElement(selectors, root);
  if (immediate) return Promise.resolve(immediate);

  return new Promise((resolve) => {
    let done = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const finish = (el: Element | null): void => {
      if (done) return;
      done = true;
      observer.disconnect();
      if (timer) clearTimeout(timer);
      resolve(el);
    };
    const observer = new MutationObserver(() => {
      const el = resolveElement(selectors, root);
      if (el) finish(el);
    });
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
    });
    // timeout 0 (or non-finite) waits indefinitely — used for triggers.
    const timeout = options.timeout ?? 4000;
    if (timeout > 0 && Number.isFinite(timeout)) {
      timer = setTimeout(() => finish(null), timeout);
    }
  });
}
