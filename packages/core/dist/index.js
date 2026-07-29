const PICKER_STYLES = `
:host {
  all: initial;
}
.tours-picker-overlay {
  position: fixed;
  z-index: 2147483000;
  box-sizing: border-box;
  border: 2px solid #2563eb;
  background: rgba(37, 99, 235, 0.15);
  border-radius: 4px;
  pointer-events: none;
  transition: all 60ms ease-out;
}
.tours-picker-hint {
  position: fixed;
  left: 50%;
  bottom: 24px;
  transform: translateX(-50%);
  z-index: 2147483001;
  padding: 8px 14px;
  font: 13px/1.4 system-ui, sans-serif;
  color: #fff;
  background: #111827;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  pointer-events: none;
}
`;
const PLAYER_STYLES = `
:host {
  all: initial;
}
.tours-spotlight {
  position: fixed;
  z-index: 2147483000;
  box-sizing: border-box;
  border-radius: 6px;
  box-shadow: 0 0 0 9999px rgba(17, 24, 39, 0.6);
  pointer-events: none;
  transition: all 120ms ease-out;
}
/* Step with overlay: false — outline the target, dim nothing. The huge shadow
   above *is* the dimming, so it is replaced rather than merely hidden. */
.tours-spotlight--plain {
  box-shadow: 0 0 0 2px var(--tours-outline, rgba(37, 99, 235, 0.9));
}
.tours-backdrop {
  position: fixed;
  inset: 0;
  z-index: 2147482999;
  background: transparent;
}
`;
function cssString(value) {
  return JSON.stringify(value);
}
function isStableClass(c) {
  return /^[a-zA-Z][\w-]*$/.test(c) && c.length <= 30 && !/\d{2,}/.test(c) && !/^(css-|sc-|jsx-|emotion-|_|is-|has-)/.test(c);
}
function structuralPath(el) {
  const parts = [];
  let current = el;
  while (current && current !== document.body && current.nodeType === 1) {
    const tag = current.tagName.toLowerCase();
    const parent = current.parentElement;
    if (!parent) {
      parts.unshift(tag);
      break;
    }
    const sameTag = Array.from(parent.children).filter((c) => c.tagName === current.tagName);
    parts.unshift(sameTag.length > 1 ? `${tag}:nth-of-type(${sameTag.indexOf(current) + 1})` : tag);
    current = parent;
  }
  return `body > ${parts.join(" > ")}`;
}
function scopedPath(el) {
  let anchor = el.parentElement;
  while (anchor && anchor !== document.body) {
    if (anchor.id) break;
    anchor = anchor.parentElement;
  }
  if (!anchor || !anchor.id) return null;
  const parts = [];
  let current = el;
  while (current && current !== anchor) {
    const tag = current.tagName.toLowerCase();
    const parent = current.parentElement;
    if (!parent) return null;
    const sameTag = Array.from(parent.children).filter((c) => c.tagName === current.tagName);
    parts.unshift(sameTag.length > 1 ? `${tag}:nth-of-type(${sameTag.indexOf(current) + 1})` : tag);
    current = parent;
  }
  return `#${CSS.escape(anchor.id)} > ${parts.join(" > ")}`;
}
const DATA_ATTRS = ["data-testid", "data-test", "data-test-id", "data-cy", "data-qa", "data-id", "data-name"];
function buildSelectors(el) {
  const out = [];
  const seen = /* @__PURE__ */ new Set();
  const tag = el.tagName.toLowerCase();
  const add = (sel) => {
    if (!sel || seen.has(sel)) return;
    try {
      if (document.querySelector(sel) === el) {
        seen.add(sel);
        out.push(sel);
      }
    } catch {
    }
  };
  if (el.id) add(`#${CSS.escape(el.id)}`);
  for (const name2 of DATA_ATTRS) {
    const v = el.getAttribute(name2);
    if (v) add(`${tag}[${name2}=${cssString(v)}]`);
  }
  const name = el.getAttribute("name");
  if (name) add(`${tag}[name=${cssString(name)}]`);
  const aria = el.getAttribute("aria-label");
  if (aria) add(`[aria-label=${cssString(aria)}]`);
  const classes = Array.from(el.classList).filter(isStableClass);
  if (classes.length) add(`${tag}.${classes.map((c) => CSS.escape(c)).join(".")}`);
  for (const c of classes) add(`${tag}.${CSS.escape(c)}`);
  add(scopedPath(el));
  add(structuralPath(el));
  const text = (el.textContent ?? "").replace(/\s+/g, " ").trim();
  if (text && text.length <= 50 && /^(a|button|summary|label|h[1-6])$/.test(tag)) {
    const t = `text=${text}`;
    if (!seen.has(t)) {
      seen.add(t);
      out.push(t);
    }
  }
  if (out.length === 0) out.push(structuralPath(el));
  return out;
}
const TEXT_ROLES = "a, button, summary, label, h1, h2, h3, h4, h5, h6";
function fromNode(value, root) {
  if (!(value instanceof Element)) return null;
  if (!value.isConnected) return null;
  if (root !== document && root instanceof Node && !root.contains(value)) return null;
  return value;
}
function resolveOne(sel, root) {
  if (typeof sel === "function") {
    let value;
    try {
      value = sel();
    } catch {
      return null;
    }
    return fromNode(value, root);
  }
  if (typeof sel !== "string") return fromNode(sel, root);
  if (sel.startsWith("text=")) {
    const want = sel.slice(5).trim();
    for (const n of Array.from(root.querySelectorAll(TEXT_ROLES))) {
      if ((n.textContent ?? "").replace(/\s+/g, " ").trim() === want) return n;
    }
    return null;
  }
  try {
    return root.querySelector(sel);
  } catch {
    return null;
  }
}
function resolveElement(selectors, root = document) {
  for (const sel of selectors) {
    const el = resolveOne(sel, root);
    if (el) return el;
  }
  return null;
}
function waitForElement(selectors, options = {}) {
  const root = options.root ?? document;
  const immediate = resolveElement(selectors, root);
  if (immediate) return Promise.resolve(immediate);
  return new Promise((resolve) => {
    let done = false;
    let timer;
    const finish = (el) => {
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
      attributes: true
    });
    const timeout = options.timeout ?? 4e3;
    if (timeout > 0 && Number.isFinite(timeout)) {
      timer = setTimeout(() => finish(null), timeout);
    }
  });
}
let cachedEnabled = null;
function isLoggingEnabled() {
  if (cachedEnabled !== null) return cachedEnabled;
  try {
    cachedEnabled = new URLSearchParams(window.location.search).has("use_logs");
  } catch {
    cachedEnabled = false;
  }
  return cachedEnabled;
}
function createLogger(scope) {
  const prefix = `[tours:${scope}]`;
  return {
    log: (...args) => {
      if (isLoggingEnabled()) console.log(prefix, ...args);
    },
    warn: (...args) => {
      if (isLoggingEnabled()) console.warn(prefix, ...args);
    },
    error: (...args) => {
      if (isLoggingEnabled()) console.error(prefix, ...args);
    }
  };
}
function createPicker(onPick, options = {}) {
  const log = createLogger("picker");
  let host = null;
  let root = null;
  let overlay = null;
  let active = false;
  function isIgnored(el) {
    if (el === host) return true;
    for (const ignored of options.ignore ?? []) {
      if (ignored && ignored.contains(el)) return true;
    }
    return false;
  }
  function ensureUi() {
    if (host) return;
    host = document.createElement("div");
    host.setAttribute("data-tours-picker", "");
    root = host.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.textContent = PICKER_STYLES;
    root.appendChild(style);
    overlay = document.createElement("div");
    overlay.className = "tours-picker-overlay";
    overlay.style.display = "none";
    root.appendChild(overlay);
    const hint = document.createElement("div");
    hint.className = "tours-picker-hint";
    hint.textContent = "Hover and click an element • Esc to cancel";
    root.appendChild(hint);
    document.body.appendChild(host);
  }
  function elementUnder(x, y) {
    const found = document.elementFromPoint(x, y);
    if (!found || isIgnored(found)) return null;
    return found;
  }
  function onMove(e) {
    if (!active || !overlay) return;
    const el = elementUnder(e.clientX, e.clientY);
    if (!el) {
      overlay.style.display = "none";
      return;
    }
    const rect = el.getBoundingClientRect();
    overlay.style.display = "block";
    overlay.style.left = `${rect.left}px`;
    overlay.style.top = `${rect.top}px`;
    overlay.style.width = `${rect.width}px`;
    overlay.style.height = `${rect.height}px`;
  }
  function onClick(e) {
    if (!active) return;
    const el = elementUnder(e.clientX, e.clientY);
    e.preventDefault();
    e.stopPropagation();
    if (!el) return;
    const selectors = buildSelectors(el);
    log.log("picked", selectors);
    stop();
    onPick(selectors);
  }
  function onKey(e) {
    if (e.key === "Escape") {
      e.preventDefault();
      stop();
    }
  }
  function start() {
    if (active) return;
    active = true;
    log.log("start");
    ensureUi();
    document.addEventListener("mousemove", onMove, true);
    document.addEventListener("click", onClick, true);
    document.addEventListener("keydown", onKey, true);
  }
  function stop() {
    if (!active) return;
    active = false;
    document.removeEventListener("mousemove", onMove, true);
    document.removeEventListener("click", onClick, true);
    document.removeEventListener("keydown", onKey, true);
    if (host && host.parentNode) {
      host.parentNode.removeChild(host);
    }
    host = null;
    root = null;
    overlay = null;
  }
  return { start, stop };
}
const DEFAULT_PADDING = 6;
const DEFAULT_RADIUS = 6;
const DEFAULT_CARD_RADIUS = 10;
const DEFAULT_OFFSET = 12;
function autoSide(t, c, v) {
  const space = {
    top: t.top,
    bottom: v.height - t.bottom,
    left: t.left,
    right: v.width - t.right
  };
  const needed = {
    top: c.height,
    bottom: c.height,
    left: c.width,
    right: c.width
  };
  const order = ["bottom", "top", "right", "left"];
  const firstFit = order.find((s) => space[s] >= needed[s] + 8);
  if (firstFit) return firstFit;
  return order.reduce((best, s) => space[s] > space[best] ? s : best, order[0]);
}
function placeCard(input) {
  const { target: t, card: c, offset, viewport: v } = input;
  const auto = input.side === "auto";
  const side = auto ? autoSide(t, c, v) : input.side;
  const align = auto ? "center" : input.align;
  const ao = input.alignOffset ?? 0;
  const inset = align === "start" ? ao : align === "end" ? -ao : 0;
  let top = 0;
  let left = 0;
  if (side === "top" || side === "bottom") {
    top = side === "top" ? t.top - c.height - offset : t.bottom + offset;
    left = align === "start" ? t.left : align === "end" ? t.right - c.width : t.left + t.width / 2 - c.width / 2;
    left += inset;
  } else {
    left = side === "left" ? t.left - c.width - offset : t.right + offset;
    top = align === "start" ? t.top : align === "end" ? t.bottom - c.height : t.top + t.height / 2 - c.height / 2;
    top += inset;
  }
  left = Math.max(8, Math.min(left, v.width - c.width - 8));
  top = Math.max(8, Math.min(top, v.height - c.height - 8));
  return { top, left };
}
function scrolls(el) {
  const style = getComputedStyle(el);
  const value = `${style.overflowX} ${style.overflowY}`;
  return /auto|scroll|overlay|hidden/.test(value);
}
function visibleRect(el) {
  const r = el.getBoundingClientRect();
  let top = r.top;
  let left = r.left;
  let right = r.right;
  let bottom = r.bottom;
  for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
    if (!scrolls(p)) continue;
    const c = p.getBoundingClientRect();
    top = Math.max(top, c.top);
    left = Math.max(left, c.left);
    right = Math.min(right, c.right);
    bottom = Math.min(bottom, c.bottom);
  }
  top = Math.max(top, 0);
  left = Math.max(left, 0);
  right = Math.min(right, window.innerWidth);
  bottom = Math.min(bottom, window.innerHeight);
  if (right <= left || bottom <= top) return null;
  return { top, left, right, bottom, width: right - left, height: bottom - top };
}
function makeButton(spec) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = `tours-card__btn${spec.primary ? " tours-card__btn--primary" : ""}${spec.disabled ? " tours-card__btn--disabled" : ""}`;
  btn.textContent = spec.label;
  if (!spec.disabled && spec.onClick) btn.addEventListener("click", spec.onClick);
  return btn;
}
function renderCard(opts) {
  const card = document.createElement("div");
  card.className = `tours-card${opts.ghost ? " tours-card--ghost" : ""}${opts.showClose ? " tours-card--closable" : ""}`;
  if (opts.radius != null) card.style.borderRadius = `${opts.radius}px`;
  if (opts.showClose) {
    const close = document.createElement("button");
    close.className = "tours-card__close";
    close.type = "button";
    close.textContent = "×";
    close.setAttribute("aria-label", "Close");
    if (opts.onClose) close.addEventListener("click", opts.onClose);
    card.appendChild(close);
  }
  const content = document.createElement("div");
  content.className = "tours-card__content";
  if (opts.contentHtml != null) content.innerHTML = opts.contentHtml;
  else content.textContent = opts.contentText ?? "";
  card.appendChild(content);
  if (opts.back || opts.next || opts.progress) {
    const footer = document.createElement("div");
    footer.className = "tours-card__footer";
    if (opts.back) footer.appendChild(makeButton(opts.back));
    if (opts.progress) {
      const p = document.createElement("span");
      p.className = "tours-card__progress";
      p.textContent = opts.progress;
      footer.appendChild(p);
    }
    if (opts.next) footer.appendChild(makeButton(opts.next));
    card.appendChild(footer);
  }
  return card;
}
const CARD_STYLES = `
.tours-card {
  position: fixed;
  z-index: 2147483001;
  box-sizing: border-box;
  max-width: 320px;
  min-width: 220px;
  padding: 16px;
  font: 14px/1.5 system-ui, sans-serif;
  color: #111827;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
}
.tours-card--ghost { pointer-events: none; }
.tours-card--ghost .tours-card__btn,
.tours-card--ghost .tours-card__close { pointer-events: auto; }
.tours-card__content {
  white-space: pre-wrap;
  word-break: break-word;
}
/* Room for the × — only when there is one, so a card without it keeps the full
   width. 8px offset + 24px button, less the card's own 16px padding. */
.tours-card--closable .tours-card__content { padding-right: 20px; }
.tours-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 14px;
}
.tours-card__progress {
  flex: 1;
  text-align: center;
  font-size: 12px;
  color: #6b7280;
}
.tours-card__btn {
  box-sizing: border-box;
  padding: 6px 12px;
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  line-height: 1;
  color: #111827;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 7px;
  cursor: pointer;
}
.tours-card__btn:hover { background: #e5e7eb; }
.tours-card__btn--primary { color: #fff; background: #2563eb; border-color: #2563eb; }
.tours-card__btn--primary:hover { background: #1d4ed8; }
.tours-card__btn--disabled { opacity: 0.45; pointer-events: none; cursor: default; }
.tours-card__close {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  padding: 0;
  font: 16px/1 system-ui, sans-serif;
  color: #6b7280;
  background: transparent;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.tours-card__close:hover { background: #f3f4f6; color: #111827; }
`;
function globToRegExp(glob) {
  const escaped = glob.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*\*/g, "\0").replace(/\*/g, "[^/]*").replace(/ /g, ".*").replace(/\?/g, ".");
  return new RegExp(`^${escaped}$`);
}
function matchUrl(match, url) {
  if (!match) return true;
  if (match.regex) {
    try {
      return new RegExp(match.regex).test(url);
    } catch {
      return false;
    }
  }
  if (match.glob) {
    try {
      return globToRegExp(match.glob).test(url);
    } catch {
      return false;
    }
  }
  return true;
}
function deriveUrl(match) {
  if (!match || !match.glob) return null;
  const base = match.glob.replace(/\*+/g, "");
  if (/^https?:\/\//i.test(base) || base.startsWith("#") || base.startsWith("/")) return base;
  return null;
}
function detectDevice(width = window.innerWidth) {
  if (width <= 640) return "mobile";
  if (width <= 1024) return "tablet";
  return "desktop";
}
function matchCondition(cond, ctx) {
  if (cond.url && !matchUrl(cond.url, ctx.url)) return false;
  if (cond.traits) {
    for (const [key, want] of Object.entries(cond.traits)) {
      if (ctx.traits?.[key] !== want) return false;
    }
  }
  if (cond.firstVisitOnly && !ctx.firstVisit) return false;
  if (cond.device && cond.device !== ctx.device) return false;
  if (cond.unlessSeen && ctx.seenCount > 0) return false;
  if (cond.maxShows !== void 0 && ctx.seenCount >= cond.maxShows) return false;
  return true;
}
function matchesCondition(cond, ctx) {
  return !cond || matchCondition(cond, ctx);
}
function matchRules(rules, ctx) {
  if (!rules || rules.length === 0) return true;
  return rules.some((rule) => matchCondition(rule.when, ctx));
}
const CHANGE_EVENT = "tours:locationchange";
let patched = false;
function patchHistory() {
  if (patched) return;
  patched = true;
  for (const method of ["pushState", "replaceState"]) {
    const original = history[method];
    history[method] = function patchedMethod(...args) {
      const result = original.apply(this, args);
      window.dispatchEvent(new Event(CHANGE_EVENT));
      return result;
    };
  }
}
function onLocationChange(cb) {
  patchHistory();
  window.addEventListener("popstate", cb);
  window.addEventListener("hashchange", cb);
  window.addEventListener(CHANGE_EVENT, cb);
  return () => {
    window.removeEventListener("popstate", cb);
    window.removeEventListener("hashchange", cb);
    window.removeEventListener(CHANGE_EVENT, cb);
  };
}
const PROGRESS_KEY = "tours:progress";
function createLocalState() {
  return {
    get(key) {
      try {
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, value);
      } catch {
      }
    },
    remove(key) {
      try {
        localStorage.removeItem(key);
      } catch {
      }
    }
  };
}
function readProgress(state) {
  const raw = state.get(PROGRESS_KEY);
  if (!raw) return null;
  try {
    const p = JSON.parse(raw);
    if (typeof p?.tourId === "string" && typeof p?.index === "number") return p;
  } catch {
  }
  return null;
}
function writeProgress(state, progress) {
  state.set(PROGRESS_KEY, JSON.stringify(progress));
}
function clearProgress(state) {
  state.remove(PROGRESS_KEY);
}
const SEEN_PREFIX = "tours:seen:";
function seenCount(state, tourId) {
  const raw = state.get(SEEN_PREFIX + tourId);
  const n = raw ? parseInt(raw, 10) : 0;
  return Number.isNaN(n) ? 0 : n;
}
function markSeen(state, tourId) {
  state.set(SEEN_PREFIX + tourId, String(seenCount(state, tourId) + 1));
}
const CTA_STYLES = `
:host { all: initial; }
/* Host-page custom properties still cascade in, so a site can restyle the
   popover without a custom renderer. */
.cta {
  position: fixed;
  z-index: 2147483200;
  box-sizing: border-box;
  max-width: 300px;
  padding: 16px 18px;
  font: 14px/1.5 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  color: var(--tours-cta-fg, #111827);
  background: var(--tours-cta-bg, #fff);
  border: 1px solid var(--tours-cta-border, #e5e7eb);
  border-radius: var(--tours-cta-radius, 14px);
  box-shadow: var(--tours-cta-shadow, 0 12px 32px rgba(15, 23, 42, 0.18));
}
.cta__text { margin: 0 0 12px; padding-right: 18px; }
.cta__btn {
  font: inherit;
  font-weight: 600;
  color: var(--tours-cta-btn-fg, #fff);
  background: var(--tours-cta-btn-bg, #2563eb);
  border: none;
  border-radius: var(--tours-cta-btn-radius, 9px);
  padding: 9px 16px;
  cursor: pointer;
}
.cta__btn:hover { background: var(--tours-cta-btn-bg-hover, #1d4ed8); }
.cta__close {
  position: absolute;
  top: 8px;
  right: 10px;
  width: 22px;
  height: 22px;
  padding: 0;
  font: 16px/1 system-ui, sans-serif;
  color: #9aa4b8;
  background: transparent;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.cta__close:hover { color: #111827; background: #f3f4f6; }
`;
function showResumeInvite(invite, render) {
  if (render) return render(invite);
  return showCta({
    text: invite.text,
    button: invite.button,
    corner: invite.corner,
    offset: invite.offset,
    onStart: invite.onResume
  });
}
function showCta(options) {
  const corner = options.corner ?? "bottom-right";
  const offset = options.offset ?? 24;
  const host = document.createElement("div");
  host.setAttribute("data-tours-cta", "");
  const root = host.attachShadow({ mode: "open" });
  const style = document.createElement("style");
  style.textContent = CTA_STYLES;
  root.appendChild(style);
  const card = document.createElement("div");
  card.className = "cta";
  const [vertical, horizontal] = corner.split("-");
  card.style[vertical] = `${offset}px`;
  card.style[horizontal] = `${offset}px`;
  const remove = () => {
    if (host.parentNode) host.parentNode.removeChild(host);
  };
  const close = document.createElement("button");
  close.className = "cta__close";
  close.type = "button";
  close.textContent = "×";
  close.setAttribute("aria-label", "Dismiss");
  close.addEventListener("click", remove);
  const text = document.createElement("p");
  text.className = "cta__text";
  text.textContent = options.text;
  const button = document.createElement("button");
  button.className = "cta__btn";
  button.type = "button";
  button.textContent = options.button;
  button.addEventListener("click", () => {
    remove();
    options.onStart();
  });
  card.append(close, text, button);
  root.appendChild(card);
  document.body.appendChild(host);
  return remove;
}
const CANCELLABLE = /* @__PURE__ */ new Set([
  "tourStarting",
  "stepChanging"
]);
function emit(handlers, name, payload) {
  const cancellable = CANCELLABLE.has(name);
  let allowed = true;
  const handler = handlers?.[name];
  if (handler) {
    try {
      if (handler(payload) === false && cancellable) allowed = false;
    } catch (error) {
      console.error(`[tours] handler for "${name}" threw`, error);
    }
  }
  if (typeof document !== "undefined" && typeof CustomEvent === "function") {
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
const EDITOR_HOST = "[data-tours-editor]";
function isBuilderMounted() {
  return typeof document !== "undefined" && document.querySelector(EDITOR_HOST) !== null;
}
function createPlayer(tour, options = {}) {
  const log = createLogger("player");
  const state = options.state;
  let host = null;
  let root = null;
  let spotlight = null;
  let tooltip = null;
  let backdrop = null;
  let awaitNext = null;
  let closeInvite = null;
  let active = false;
  let index = 0;
  let skipped = 0;
  let unwatch = null;
  const pad = tour.display?.padding ?? DEFAULT_PADDING;
  const radius = tour.display?.radius ?? DEFAULT_RADIUS;
  const cardRadius = tour.display?.cardRadius ?? DEFAULT_CARD_RADIUS;
  const offset = tour.display?.offset ?? DEFAULT_OFFSET;
  function findTarget(step) {
    return resolveElement(step.selectors);
  }
  function isInteractive(step) {
    return step.action?.type === "click";
  }
  function stepAllowed(step) {
    if (!step.condition) return true;
    const seen = state ? seenCount(state, tour.id) : 0;
    return matchesCondition(step.condition, {
      url: window.location.href,
      traits: options.viewer?.(),
      device: detectDevice(),
      firstVisit: seen === 0,
      seenCount: seen
    });
  }
  function onThisPage(step) {
    return matchUrl(step.pageUrl, window.location.href);
  }
  function persist() {
    if (state) writeProgress(state, { tourId: tour.id, index });
  }
  function ensureUi() {
    if (host) return;
    host = document.createElement("div");
    host.setAttribute("data-tours-player", "");
    root = host.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.textContent = PLAYER_STYLES + CARD_STYLES;
    root.appendChild(style);
    backdrop = document.createElement("div");
    backdrop.className = "tours-backdrop";
    backdrop.addEventListener("click", (e) => {
      const step = tour.steps[index];
      const target = step ? findTarget(step) : null;
      if (target) {
        const r = target.getBoundingClientRect();
        const inside = e.clientX >= r.left - pad && e.clientX <= r.right + pad && e.clientY >= r.top - pad && e.clientY <= r.bottom + pad;
        if (inside) return;
      }
      stop();
    });
    root.appendChild(backdrop);
    spotlight = document.createElement("div");
    spotlight.className = "tours-spotlight";
    spotlight.style.borderRadius = `${radius}px`;
    root.appendChild(spotlight);
    document.body.appendChild(host);
  }
  function cutHole(rect) {
    if (!backdrop) return;
    if (!rect) {
      backdrop.style.clipPath = "";
      return;
    }
    const l = rect.left - pad;
    const t = rect.top - pad;
    const r = rect.right + pad;
    const b = rect.bottom + pad;
    backdrop.style.clipPath = `polygon(0 0, 0 100%, ${l}px 100%, ${l}px ${t}px, ${r}px ${t}px, ${r}px ${b}px, ${l}px ${b}px, ${l}px 100%, 100% 100%, 100% 0)`;
  }
  function dims(step) {
    return step.overlay !== false;
  }
  function applyOverlay(step) {
    const dim = dims(step);
    if (backdrop) backdrop.style.display = dim ? "" : "none";
    spotlight?.classList.toggle("tours-spotlight--plain", !dim);
  }
  function positionSpotlight(rect, fast = false) {
    if (!spotlight) return;
    spotlight.style.transitionDuration = fast ? "0ms" : "";
    spotlight.style.display = "block";
    spotlight.style.left = `${rect.left - pad}px`;
    spotlight.style.top = `${rect.top - pad}px`;
    spotlight.style.width = `${rect.width + pad * 2}px`;
    spotlight.style.height = `${rect.height + pad * 2}px`;
  }
  function positionTooltip(rect, step) {
    if (!tooltip) return;
    const framed = {
      top: rect.top - pad,
      left: rect.left - pad,
      right: rect.right + pad,
      bottom: rect.bottom + pad,
      width: rect.width + pad * 2,
      height: rect.height + pad * 2
    };
    const { top, left } = placeCard({
      target: framed,
      card: { width: tooltip.offsetWidth, height: tooltip.offsetHeight },
      side: step.placement ?? "bottom",
      align: step.align ?? "center",
      offset,
      alignOffset: tour.display?.alignOffset ?? 0,
      viewport: { width: window.innerWidth, height: window.innerHeight }
    });
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
  }
  function renderTooltip(step) {
    const total = Math.max(1, tour.steps.length - skipped);
    const position = Math.max(1, Math.min(index + 1 - skipped, total));
    if (tooltip) tooltip.remove();
    const isLast = index === tour.steps.length - 1;
    const prevStep = tour.steps[index - 1];
    const canGoBack = !!prevStep && onThisPage(prevStep);
    const showNext = !isInteractive(step) || isLast;
    tooltip = renderCard({
      contentText: step.content.default,
      progress: `Step ${position} of ${total}`,
      showClose: true,
      onClose: dismiss,
      radius: cardRadius,
      back: canGoBack ? { label: step.backLabel ?? "Back", onClick: prev } : void 0,
      next: showNext ? {
        label: step.nextLabel ?? (isLast ? "Done" : "Next"),
        primary: true,
        onClick: next
      } : void 0
    });
    root?.appendChild(tooltip);
  }
  function render() {
    if (!active) return;
    const step = tour.steps[index];
    if (!step) {
      stop();
      return;
    }
    log.log("render step", index, step.id);
    if (!stepAllowed(step)) {
      log.log(`step "${step.id}" skipped: condition not met`);
      emit(options.on, "stepSkipped", { tour, index, step, reason: "condition" });
      skipped += 1;
      if (index < tour.steps.length - 1) {
        index += 1;
        render();
      } else {
        stop(skipped >= tour.steps.length ? "dismissed" : "completed");
      }
      return;
    }
    const target = findTarget(step);
    if (!target) {
      log.log(`step "${step.id}" target not found yet — waiting`, step.selectors);
      void waitForElement(step.selectors, { timeout: 4e3 }).then((el) => {
        if (!active || tour.steps[index] !== step) return;
        if (el) {
          render();
        } else {
          log.warn(`step "${step.id}" skipped: no element for selectors`, step.selectors);
          emit(options.on, "stepSkipped", { tour, index, step, reason: "no-element" });
          skipped += 1;
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
    target.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
    renderTooltip(step);
    const rect = visibleRect(target) ?? target.getBoundingClientRect();
    positionSpotlight(rect);
    positionTooltip(rect, step);
    applyOverlay(step);
    cutHole(dims(step) && isInteractive(step) ? rect : null);
    watchForVisitorAdvance(step);
    emit(options.on, "stepActivated", { tour, index, step, target });
  }
  function watchForVisitorAdvance(step) {
    awaitNext?.();
    awaitNext = null;
    if (!isInteractive(step)) return;
    const nextIndex = index + 1;
    const nextStep = tour.steps[nextIndex];
    if (!nextStep || onThisPage(nextStep)) return;
    awaitNext = onLocationChange(() => {
      if (!active || tour.steps[index] !== step) return;
      if (!matchUrl(nextStep.pageUrl, window.location.href)) return;
      if (!mayChangeTo(nextIndex)) return;
      awaitNext?.();
      awaitNext = null;
      log.log("visitor navigated → advancing to", nextStep.id);
      index = nextIndex;
      persist();
      render();
    });
  }
  function onKey(e) {
    if (!active) return;
    if (e.key === "Escape") {
      e.preventDefault();
      stop();
    } else if (e.key === "ArrowRight") {
      next();
    } else if (e.key === "ArrowLeft") {
      prev();
    }
  }
  function reposition() {
    if (!active) return;
    const step = tour.steps[index];
    if (!step) return;
    const target = findTarget(step);
    if (!target) return;
    const rect = visibleRect(target);
    if (!rect) {
      hideFrame();
      return;
    }
    positionSpotlight(rect, true);
    positionTooltip(rect, step);
    cutHole(dims(step) && isInteractive(step) ? rect : null);
    if (tooltip) tooltip.style.visibility = "";
  }
  function hideFrame() {
    if (spotlight) spotlight.style.display = "none";
    if (tooltip) tooltip.style.visibility = "hidden";
    cutHole(null);
  }
  function start(startIndex = 0) {
    if (active) return;
    if (tour.steps.length === 0) return;
    if (!options.allowWhileEditing && isBuilderMounted()) {
      log.log(`start suppressed for "${tour.id}" — the builder is mounted`);
      return;
    }
    const at = Math.max(0, Math.min(startIndex, tour.steps.length - 1));
    if (!emit(options.on, "tourStarting", { tour, index: at })) {
      log.log("start vetoed by handler");
      return;
    }
    dropInvite();
    active = true;
    index = at;
    skipped = 0;
    log.log("start", tour.id, `at ${index}/${tour.steps.length}`);
    ensureUi();
    window.addEventListener("keydown", onKey, true);
    window.addEventListener("resize", reposition, true);
    window.addEventListener("scroll", reposition, true);
    persist();
    emit(options.on, "tourStarted", { tour, index });
    render();
  }
  function hideVisuals() {
    if (spotlight) spotlight.style.display = "none";
    if (tooltip) {
      tooltip.remove();
      tooltip = null;
    }
  }
  function waitForPageChange() {
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
  function teardownUi() {
    if (unwatch) {
      unwatch();
      unwatch = null;
    }
    if (awaitNext) {
      awaitNext();
      awaitNext = null;
    }
    if (!active) return;
    active = false;
    window.removeEventListener("keydown", onKey, true);
    window.removeEventListener("resize", reposition, true);
    window.removeEventListener("scroll", reposition, true);
    if (host && host.parentNode) {
      host.parentNode.removeChild(host);
    }
    host = null;
    root = null;
    spotlight = null;
    tooltip = null;
    backdrop = null;
  }
  function stop(reason = "dismissed") {
    log.log("stop", reason);
    const wasActive = active;
    const at = index;
    dropInvite();
    teardownUi();
    if (state) clearProgress(state);
    if (!wasActive) return;
    if (reason === "completed") emit(options.on, "tourCompleted", { tour });
    else emit(options.on, "tourDismissed", { tour, index: at });
  }
  function dropInvite() {
    closeInvite?.();
    closeInvite = null;
  }
  function dismiss() {
    if (tour.dismiss?.mode === "minimize") minimize();
    else stop();
  }
  function minimize() {
    if (!active) return;
    log.log("minimized", tour.id, `at ${index}`);
    teardownUi();
    if (state) writeProgress(state, { tourId: tour.id, index, minimized: true });
    emit(options.on, "tourMinimized", { tour, index });
    offerResume();
  }
  function offerResume() {
    dropInvite();
    const cfg = tour.dismiss?.resume;
    closeInvite = showResumeInvite(
      {
        tourId: tour.id,
        text: cfg?.text ?? "Carry on with the tour?",
        button: cfg?.button ?? "Resume",
        corner: cfg?.corner,
        offset: cfg?.offset,
        onResume: () => {
          closeInvite = null;
          if (state) writeProgress(state, { tourId: tour.id, index });
          emit(options.on, "tourResumed", { tour, index });
          start(index);
        }
      },
      options.renderResume
    );
  }
  function mayChangeTo(to) {
    const step = tour.steps[to];
    if (!step) return true;
    return emit(options.on, "stepChanging", { tour, from: index, to, step });
  }
  function next() {
    if (!active) return;
    const nextIndex = index + 1;
    const nextStep = tour.steps[nextIndex];
    if (!nextStep) {
      stop("completed");
      return;
    }
    if (!mayChangeTo(nextIndex)) {
      log.log("step change vetoed by handler");
      return;
    }
    if (onThisPage(nextStep)) {
      index = nextIndex;
      persist();
      render();
      return;
    }
    index = nextIndex;
    persist();
    const navigate = (url) => {
      teardownUi();
      if (options.onNavigate) options.onNavigate(url, nextStep.id);
      else window.location.assign(url);
    };
    const action = tour.steps[index - 1]?.action;
    if (action && action.type === "navigate" && action.url) {
      if (action.url.startsWith("#")) {
        log.log("page transition (hash navigate) → resume at", index);
        waitForPageChange();
        window.location.hash = action.url;
      } else {
        log.log("page transition (navigate) → resume at", index);
        navigate(action.url);
      }
      return;
    }
    const derived = deriveUrl(nextStep.pageUrl);
    if (derived) {
      if (derived.startsWith("#")) {
        log.log("page transition (derived hash) → resume at", index);
        waitForPageChange();
        window.location.hash = derived;
      } else {
        log.log("page transition (derived navigate) → resume at", index, derived);
        navigate(derived);
      }
      return;
    }
    log.log("page transition (wait) → resume at", index);
    waitForPageChange();
  }
  function prev() {
    if (!active) return;
    const prevStep = tour.steps[index - 1];
    if (!prevStep) return;
    if (!mayChangeTo(index - 1)) {
      log.log("step change vetoed by handler");
      return;
    }
    if (onThisPage(prevStep)) {
      index -= 1;
      persist();
      render();
      return;
    }
    index -= 1;
    persist();
    log.log("page transition back → resume at", index);
    waitForPageChange();
    window.history.back();
  }
  return { start, stop, next, prev, minimize, isActive: () => active };
}
function resumeTour(tour, options = {}) {
  const state = options.state;
  if (!state) return null;
  const progress = readProgress(state);
  if (!progress || progress.tourId !== tour.id) return null;
  if (!tour.steps[progress.index]) {
    clearProgress(state);
    return null;
  }
  let resumeAt = -1;
  for (let i = progress.index; i < tour.steps.length; i++) {
    if (matchUrl(tour.steps[i].pageUrl, window.location.href)) {
      resumeAt = i;
      break;
    }
  }
  if (resumeAt === -1) return null;
  const player = createPlayer(tour, options);
  player.start(resumeAt);
  return player;
}
function armTrigger(tour, fire) {
  if (isBuilderMounted()) return () => {
  };
  const trigger = tour.trigger ?? { type: "manual" };
  let fired = false;
  const once = () => {
    if (fired) return;
    fired = true;
    fire();
  };
  switch (trigger.type) {
    case "load": {
      const id = setTimeout(once, 0);
      return () => clearTimeout(id);
    }
    case "timer": {
      const id = setTimeout(once, Math.max(0, trigger.delay));
      return () => clearTimeout(id);
    }
    case "selector": {
      let cancelled = false;
      void waitForElement([trigger.selector], { timeout: 0 }).then((el) => {
        if (el && !cancelled) once();
      });
      return () => {
        cancelled = true;
      };
    }
    case "cta": {
      let dismiss = () => {
      };
      dismiss = showCta({
        text: trigger.text,
        button: trigger.button,
        corner: trigger.corner,
        offset: trigger.offset,
        onStart: once
      });
      return dismiss;
    }
    case "manual":
    default:
      return () => {
      };
  }
}
function mountTours(input, options = {}) {
  const log = createLogger("mount");
  const state = options.state;
  const list = () => typeof input === "function" ? input() : input;
  let current = null;
  let armed = [];
  let closeInvite = null;
  function disarm() {
    for (const cancel of armed) cancel();
    armed = [];
    closeInvite?.();
    closeInvite = null;
  }
  function eligible(tour) {
    return !options.canRun || options.canRun(tour);
  }
  function activate() {
    if (current?.isActive()) return;
    current = null;
    disarm();
    const progress = state ? readProgress(state) : null;
    if (state && progress?.minimized) {
      const tour = list().find((t) => t.id === progress.tourId && eligible(t));
      if (tour) {
        const cfg = tour.dismiss?.resume;
        closeInvite = showResumeInvite(
          {
            tourId: tour.id,
            text: cfg?.text ?? "Carry on with the tour?",
            button: cfg?.button ?? "Resume",
            corner: cfg?.corner,
            offset: cfg?.offset,
            onResume: () => {
              closeInvite = null;
              writeProgress(state, { tourId: tour.id, index: progress.index });
              const player = createPlayer(tour, options);
              current = player;
              player.start(progress.index);
            }
          },
          options.renderResume
        );
        return;
      }
    }
    if (state) {
      for (const tour of list()) {
        if (!eligible(tour)) continue;
        const player = resumeTour(tour, options);
        if (player) {
          log.log("resumed", tour.id);
          current = player;
          return;
        }
      }
    }
    const device = detectDevice();
    const traits = options.viewer?.();
    for (const tour of list()) {
      if (!eligible(tour)) continue;
      if (!tour.trigger || tour.trigger.type === "manual") continue;
      const count = state ? seenCount(state, tour.id) : 0;
      const matches = matchRules(tour.rules, {
        url: window.location.href,
        traits,
        device,
        firstVisit: count === 0,
        seenCount: count
      });
      if (!matches) continue;
      armed.push(
        armTrigger(tour, () => {
          if (state) markSeen(state, tour.id);
          const player = createPlayer(tour, options);
          current = player;
          player.start();
        })
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
    }
  };
}
export {
  CARD_STYLES,
  PROGRESS_KEY,
  armTrigger,
  autoSide,
  buildSelectors,
  clearProgress,
  createLocalState,
  createLogger,
  createPicker,
  createPlayer,
  deriveUrl,
  detectDevice,
  isBuilderMounted,
  isLoggingEnabled,
  markSeen,
  matchRules,
  matchUrl,
  matchesCondition,
  mountTours,
  placeCard,
  readProgress,
  renderCard,
  resolveElement,
  resumeTour,
  seenCount,
  visibleRect,
  waitForElement,
  writeProgress
};
//# sourceMappingURL=index.js.map
