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
const SCHEMA_VERSION = 1;
function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function isLocalizedText(value) {
  return isRecord(value) && typeof value.default === "string";
}
const PLACEMENTS = ["top", "bottom", "left", "right", "auto"];
const ALIGNS = ["start", "center", "end"];
const DEVICES = ["mobile", "tablet", "desktop"];
const ACTION_TYPES = ["click", "input", "navigate", "none"];
function validateUrlMatch(value, path, errors) {
  if (!isRecord(value)) {
    errors.push(`${path} must be an object`);
    return;
  }
  const hasGlob = typeof value.glob === "string" && value.glob.length > 0;
  const hasRegex = typeof value.regex === "string" && value.regex.length > 0;
  if (!hasGlob && !hasRegex) {
    errors.push(`${path} must have a non-empty "glob" or "regex"`);
  }
  if (hasRegex) {
    try {
      new RegExp(value.regex);
    } catch {
      errors.push(`${path}.regex is not a valid regular expression`);
    }
  }
}
function validateCondition(value, path, errors) {
  if (!isRecord(value)) {
    errors.push(`${path} must be an object`);
    return;
  }
  if (value.url !== void 0) validateUrlMatch(value.url, `${path}.url`, errors);
  if (value.traits !== void 0) {
    if (!isRecord(value.traits)) {
      errors.push(`${path}.traits must be an object`);
    } else {
      for (const [k, v] of Object.entries(value.traits)) {
        if (typeof v !== "string" && typeof v !== "number") {
          errors.push(`${path}.traits.${k} must be a string or number`);
        }
      }
    }
  }
  if (value.firstVisitOnly !== void 0 && typeof value.firstVisitOnly !== "boolean") {
    errors.push(`${path}.firstVisitOnly must be a boolean`);
  }
  if (value.device !== void 0 && !DEVICES.includes(value.device)) {
    errors.push(`${path}.device must be one of ${DEVICES.join("|")}`);
  }
  if (value.unlessSeen !== void 0 && typeof value.unlessSeen !== "boolean") {
    errors.push(`${path}.unlessSeen must be a boolean`);
  }
  if (value.maxShows !== void 0 && (typeof value.maxShows !== "number" || value.maxShows < 0)) {
    errors.push(`${path}.maxShows must be a non-negative number`);
  }
}
function validateAction(value, path, errors) {
  if (!isRecord(value)) {
    errors.push(`${path} must be an object`);
    return;
  }
  if (!ACTION_TYPES.includes(value.type)) {
    errors.push(`${path}.type must be one of ${ACTION_TYPES.join("|")}`);
  }
  if (value.url !== void 0 && typeof value.url !== "string") {
    errors.push(`${path}.url must be a string`);
  }
  if (value.value !== void 0 && typeof value.value !== "string") {
    errors.push(`${path}.value must be a string`);
  }
}
function validate(json) {
  const errors = [];
  if (!isRecord(json)) {
    return { ok: false, errors: ["tour must be an object"] };
  }
  if (typeof json.id !== "string" || json.id.length === 0) {
    errors.push("tour.id must be a non-empty string");
  }
  if (typeof json.schemaVersion !== "number") {
    errors.push("tour.schemaVersion must be a number");
  }
  if (!isLocalizedText(json.title)) {
    errors.push('tour.title must be a localized text with a string "default"');
  }
  if (!Array.isArray(json.steps)) {
    errors.push("tour.steps must be an array");
  } else if (json.steps.length === 0) {
    errors.push("tour.steps must contain at least one step");
  } else {
    json.steps.forEach((step, i) => {
      if (!isRecord(step)) {
        errors.push(`steps[${i}] must be an object`);
        return;
      }
      if (typeof step.id !== "string" || step.id.length === 0) {
        errors.push(`steps[${i}].id must be a non-empty string`);
      }
      if (!Array.isArray(step.selectors) || step.selectors.length === 0 || !step.selectors.every((s) => typeof s === "string" && s.length > 0)) {
        errors.push(`steps[${i}].selectors must be a non-empty array of non-empty strings`);
      }
      if (!isLocalizedText(step.content)) {
        errors.push(`steps[${i}].content must be a localized text with a string "default"`);
      }
      if (step.placement !== void 0 && !PLACEMENTS.includes(step.placement)) {
        errors.push(`steps[${i}].placement must be one of ${PLACEMENTS.join("|")}`);
      }
      if (step.align !== void 0 && !ALIGNS.includes(step.align)) {
        errors.push(`steps[${i}].align must be one of ${ALIGNS.join("|")}`);
      }
      if (step.backLabel !== void 0 && typeof step.backLabel !== "string") {
        errors.push(`steps[${i}].backLabel must be a string`);
      }
      if (step.nextLabel !== void 0 && typeof step.nextLabel !== "string") {
        errors.push(`steps[${i}].nextLabel must be a string`);
      }
      if (step.pageUrl !== void 0) {
        validateUrlMatch(step.pageUrl, `steps[${i}].pageUrl`, errors);
      }
      if (step.condition !== void 0) {
        validateCondition(step.condition, `steps[${i}].condition`, errors);
      }
      if (step.action !== void 0) {
        validateAction(step.action, `steps[${i}].action`, errors);
      }
      if (step.overlay !== void 0 && typeof step.overlay !== "boolean") {
        errors.push(`steps[${i}].overlay must be a boolean`);
      }
    });
  }
  if (json.trigger !== void 0) {
    const tr = json.trigger;
    const types = ["manual", "load", "selector", "timer", "cta"];
    const corners = ["bottom-right", "bottom-left", "top-right", "top-left"];
    if (!isRecord(tr) || typeof tr.type !== "string" || !types.includes(tr.type)) {
      errors.push(`tour.trigger.type must be one of ${types.join("|")}`);
    } else if (tr.type === "selector" && (typeof tr.selector !== "string" || tr.selector.length === 0)) {
      errors.push("tour.trigger.selector must be a non-empty string");
    } else if (tr.type === "timer" && (typeof tr.delay !== "number" || tr.delay < 0)) {
      errors.push("tour.trigger.delay must be a non-negative number");
    } else if (tr.type === "cta") {
      if (typeof tr.text !== "string") errors.push("tour.trigger.text must be a string");
      if (typeof tr.button !== "string") errors.push("tour.trigger.button must be a string");
      if (!corners.includes(tr.corner)) errors.push(`tour.trigger.corner must be one of ${corners.join("|")}`);
      if (tr.offset !== void 0 && (typeof tr.offset !== "number" || tr.offset < 0)) {
        errors.push("tour.trigger.offset must be a non-negative number");
      }
    }
  }
  if (json.audience !== void 0 && !["all", "auth", "guest"].includes(json.audience)) {
    errors.push("tour.audience must be one of all|auth|guest");
  }
  if (json.display !== void 0) {
    if (!isRecord(json.display)) {
      errors.push("tour.display must be an object");
    } else {
      for (const key of ["padding", "radius", "cardRadius", "offset", "alignOffset"]) {
        const v = json.display[key];
        if (v !== void 0 && (typeof v !== "number" || v < 0)) {
          errors.push(`tour.display.${key} must be a non-negative number`);
        }
      }
    }
  }
  if (json.rules !== void 0) {
    if (!Array.isArray(json.rules)) {
      errors.push("tour.rules must be an array");
    } else {
      json.rules.forEach((rule, i) => {
        if (!isRecord(rule)) {
          errors.push(`rules[${i}] must be an object`);
          return;
        }
        if (rule.tourId !== void 0 && typeof rule.tourId !== "string") {
          errors.push(`rules[${i}].tourId must be a string`);
        }
        if (rule.when === void 0) {
          errors.push(`rules[${i}].when is required`);
        } else {
          validateCondition(rule.when, `rules[${i}].when`, errors);
        }
      });
    }
  }
  if (errors.length > 0) {
    return { ok: false, errors };
  }
  return { ok: true, tour: json };
}
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
    const rect = target.getBoundingClientRect();
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
    const rect = target.getBoundingClientRect();
    positionSpotlight(rect, true);
    positionTooltip(rect, step);
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
const EDITOR_STYLES = `
:host {
  all: initial;
  --e-bg: #ffffff;
  --e-fg: #1f2733;
  --e-muted: #6b7280;
  --e-border: #e5e7eb;
  --e-surface: #f7f8fa;
  --e-accent: #2563eb;
  --e-accent-soft: #eff3ff;
  --e-radius: 12px;
  --e-shadow: 0 12px 32px rgba(15, 23, 42, 0.16);
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
}

button { font: inherit; cursor: pointer; }

/* ---------- Builder panel ---------- */
.panel {
  position: fixed;
  top: calc(16px + var(--e-top, 0px));
  bottom: 76px;
  width: 380px;
  z-index: 2147483200;
  display: flex;
  flex-direction: column;
  background: var(--e-bg);
  color: var(--e-fg);
  border: 1px solid var(--e-border);
  border-radius: var(--e-radius);
  box-shadow: var(--e-shadow);
  overflow: hidden;
}
.panel--right { right: 16px; }
.panel--left { left: 16px; }

.panel__header {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 14px 10px;
}
.panel__title {
  font-size: 15px;
  font-weight: 700;
  border: 1px solid transparent;
  border-radius: 6px;
  padding: 2px 6px;
  margin: 0 -6px;
  background: transparent;
  color: inherit;
  min-width: 0;
  flex: 1;
}
.panel__title:hover { background: var(--e-surface); }
.panel__title:focus { outline: none; border-color: var(--e-accent); background: #fff; }

.panel__title--static { pointer-events: none; }
.panel__title--static:hover { background: transparent; }

/* Tours / Templates switch in the list header */
.listtabs { display: flex; gap: 12px; flex: 1; }
.listtab {
  font-size: 15px;
  font-weight: 700;
  color: var(--e-muted);
  background: transparent;
  border: none;
  padding: 2px 0;
  cursor: pointer;
}
.listtab:hover { color: var(--e-fg); }
.listtab--active { color: var(--e-accent); }

.tourrow__use {
  font-size: 12px;
  font-weight: 600;
  color: #fff;
  background: var(--e-accent);
  border: none;
  border-radius: 7px;
  padding: 5px 12px;
  cursor: pointer;
}
.tourrow__use:hover { background: #1d4ed8; }

/* ⋯ dropdown menu */
.menu {
  position: absolute;
  top: 46px;
  right: 12px;
  z-index: 5;
  min-width: 160px;
  padding: 6px;
  background: var(--e-bg);
  border: 1px solid var(--e-border);
  border-radius: 10px;
  box-shadow: var(--e-shadow);
  display: flex;
  flex-direction: column;
}
.menu__item {
  text-align: left;
  font-size: 13px;
  color: var(--e-fg);
  background: transparent;
  border: none;
  border-radius: 6px;
  padding: 8px 10px;
  cursor: pointer;
}
.menu__item:hover { background: var(--e-surface); }

.newtour {
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  background: var(--e-accent);
  border: none;
  border-radius: 8px;
  padding: 6px 12px;
  white-space: nowrap;
}
.newtour:hover { background: #1d4ed8; }

/* ---------- Tour list ---------- */
.tourlist { display: flex; flex-direction: column; gap: 8px; }
.tourrow {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: var(--e-bg);
  border: 1px solid var(--e-border);
  border-radius: 10px;
  cursor: pointer;
}
.tourrow:hover { border-color: var(--e-accent); box-shadow: 0 0 0 3px var(--e-accent-soft); }
.tourrow__main { flex: 1; min-width: 0; }
.tourrow__name {
  font-size: 14px;
  font-weight: 600;
  color: var(--e-fg);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.tourrow__meta { font-size: 12px; color: var(--e-muted); margin-top: 2px; }

.status {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 3px 8px;
  border-radius: 999px;
  background: var(--e-surface);
  color: var(--e-muted);
  border: 1px solid var(--e-border);
}
.status--published { background: #ecfdf5; color: #047857; border-color: #a7f3d0; }

.iconbtn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  padding: 0;
  color: var(--e-muted);
  background: transparent;
  border: 1px solid transparent;
  border-radius: 8px;
}
.iconbtn:hover { background: var(--e-surface); color: var(--e-fg); }
.iconbtn--active { background: var(--e-accent); color: #fff; }
.iconbtn--active:hover { background: var(--e-accent); color: #fff; }
.iconbtn svg { width: 18px; height: 18px; display: block; }

.panel__toolbar {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0 12px 10px;
  border-bottom: 1px solid var(--e-border);
}
.panel__toolbar .spacer { flex: 1; }

.tabs {
  display: flex;
  gap: 4px;
  padding: 10px 12px 0;
}
.tab {
  font-size: 13px;
  font-weight: 600;
  color: var(--e-muted);
  background: transparent;
  border: none;
  border-radius: 8px;
  padding: 6px 10px;
}
.tab--active { color: var(--e-fg); background: var(--e-surface); }

.panel__body {
  flex: 1;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 14px 16px 20px;
  /* Reserve the scrollbar gutter always, so content width never shifts. */
  scrollbar-gutter: stable;
  /* Modern thin, auto-hiding scrollbar (Firefox). */
  scrollbar-width: thin;
  scrollbar-color: rgba(100, 116, 139, 0.35) transparent;
}
/* WebKit/Blink: slim, rounded, only-thumb, fades in on hover. */
.panel__body::-webkit-scrollbar { width: 10px; }
.panel__body::-webkit-scrollbar-track { background: transparent; }
.panel__body::-webkit-scrollbar-thumb {
  background-color: transparent;
  border: 3px solid transparent;
  border-radius: 999px;
  background-clip: padding-box;
}
.panel__body:hover::-webkit-scrollbar-thumb {
  background-color: rgba(100, 116, 139, 0.35);
}
.panel__body::-webkit-scrollbar-thumb:hover {
  background-color: rgba(100, 116, 139, 0.6);
}

/* ---------- Step list ---------- */
.steps { display: flex; flex-direction: column; align-items: stretch; }

.connector {
  align-self: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--e-border);
}
.connector__line { width: 1px; height: 12px; background: var(--e-border); }
.connector__add {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  color: var(--e-muted);
  background: var(--e-bg);
  border: 1px solid var(--e-border);
  border-radius: 999px;
  font-size: 15px;
  line-height: 1;
}
.connector__add:hover { color: var(--e-accent); border-color: var(--e-accent); }

/* ---------- Card ---------- */
.card {
  border: 1px solid var(--e-border);
  border-radius: 10px;
  background: var(--e-bg);
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
  overflow: hidden;
}
.card--active { border-color: var(--e-accent); box-shadow: 0 0 0 3px var(--e-accent-soft); }
.card--excluded { opacity: 0.55; }
.card--offpage .card__content { opacity: 0.6; }
.card__page {
  font-size: 11px;
  font-weight: 600;
  color: var(--e-muted);
  background: var(--e-surface);
  border: 1px solid var(--e-border);
  border-radius: 5px;
  padding: 1px 6px;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.pagecfg__input {
  width: 100%;
  box-sizing: border-box;
  font: inherit;
  font-size: 13px;
  padding: 7px 9px;
  border: 1px solid var(--e-border);
  border-radius: 8px;
  background: #fff;
  margin-bottom: 8px;
}
.pagecfg__input:focus { outline: none; border-color: var(--e-accent); }
.tsel {
  width: 100%;
  box-sizing: border-box;
  font: inherit;
  font-size: 13px;
  padding: 7px 9px;
  border: 1px solid var(--e-border);
  border-radius: 8px;
  background: #fff;
  color: var(--e-fg);
  cursor: pointer;
}
.tsel:focus { outline: none; border-color: var(--e-accent); }
.pagecfg__use {
  font-size: 12px;
  font-weight: 600;
  color: var(--e-accent);
  background: var(--e-accent-soft);
  border: 1px solid #c7d6ff;
  border-radius: 7px;
  padding: 5px 12px;
  cursor: pointer;
  margin-bottom: 10px;
}
.pagecfg__use:hover { background: #e3ebff; }

.card__control {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-bottom: 1px solid var(--e-border);
}
.card__check { width: 16px; height: 16px; accent-color: var(--e-accent); cursor: pointer; }
.card__type {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: var(--e-muted);
}
.card__index {
  width: 18px; height: 18px;
  display: inline-flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 700;
  color: var(--e-muted);
  background: var(--e-surface);
  border-radius: 5px;
}
.card__control .spacer { flex: 1; }
.card__sel {
  font-size: 11px;
  color: var(--e-muted);
  max-width: 130px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
}
.card__sel--empty { color: #d97706; }
.card__sel {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 5px;
  padding: 1px 5px;
  cursor: pointer;
}
.card__sel:hover { background: var(--e-surface); border-color: var(--e-border); }
.card__selcount {
  font-family: system-ui, sans-serif;
  font-size: 10px;
  font-weight: 700;
  color: var(--e-accent);
}
.card__page { cursor: pointer; }
.card__page:hover { border-color: var(--e-accent); color: var(--e-fg); }

/* Selector list editor, floated over the panel body. */
.selpop {
  position: sticky;
  top: 0;
  z-index: 4;
  margin: 0 0 12px;
  padding: 10px;
  background: var(--e-bg);
  border: 1px solid var(--e-accent);
  border-radius: 10px;
  box-shadow: var(--e-shadow);
}
.selpop__head { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.selpop__head .spacer { flex: 1; }
.selpop__title { font-size: 12px; font-weight: 700; color: var(--e-fg); }
.selpop__empty { margin: 0 0 8px; font-size: 12px; color: var(--e-muted); }
.selpop__list { display: flex; flex-direction: column; gap: 4px; margin-bottom: 8px; }
.selpop__row {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 3px 4px;
  border-radius: 6px;
}
.selpop__row:hover { background: var(--e-surface); }
.selpop__rank {
  flex: none;
  width: 16px; height: 16px;
  display: inline-flex; align-items: center; justify-content: center;
  font-size: 10px; font-weight: 700;
  color: var(--e-muted);
  background: var(--e-surface);
  border-radius: 4px;
}
.selpop__code {
  flex: 1;
  min-width: 0;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 11px;
  color: var(--e-fg);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.selpop__add {
  width: 100%;
  font: inherit;
  font-size: 12px;
  padding: 7px 10px;
  color: var(--e-fg);
  background: var(--e-surface);
  border: 1px dashed var(--e-border);
  border-radius: 8px;
  cursor: pointer;
}
.selpop__add:hover { border-color: var(--e-accent); }
.selpop__add--on { color: #fff; background: var(--e-accent); border-style: solid; border-color: var(--e-accent); }

.card__content {
  padding: 12px;
  font-size: 14px;
  line-height: 1.5;
  color: var(--e-fg);
  min-height: 22px;
  outline: none;
  white-space: pre-wrap;
  word-break: break-word;
}
.card__content:empty::before {
  content: attr(data-placeholder);
  color: var(--e-muted);
}
.card__content:focus { background: #fffef8; }

.card__footer {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 10px 10px;
}
.cardbtn {
  font-size: 12px;
  font-weight: 600;
  color: var(--e-fg);
  background: var(--e-surface);
  border: 1px solid var(--e-border);
  border-radius: 7px;
  padding: 5px 12px;
  min-width: 56px;
}
.cardbtn:hover { background: #eef0f3; }
.cardbtn--edit {
  background: #fff;
  border-color: var(--e-accent);
  text-align: center;
}

/* ---------- Bottom/top navigation ---------- */
.nav {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2147483210;
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 6px;
  background: var(--e-bg);
  border: 1px solid var(--e-border);
  border-radius: 999px;
  box-shadow: var(--e-shadow);
}
.nav--bottom { bottom: 18px; }
.nav--top { top: calc(18px + var(--e-top, 0px)); }
.nav__sep { width: 1px; height: 22px; background: var(--e-border); margin: 0 4px; }

/* ---------- Active-step target highlight (dashed, no backdrop) ---------- */
.highlight {
  position: fixed;
  z-index: 2147483100;
  box-sizing: border-box;
  border: 2px dashed var(--e-accent);
  border-radius: 6px;
  background: rgba(37, 99, 235, 0.06);
  pointer-events: none;
  transition: all 120ms ease-out;
  display: none;
}

.highlight--settings {
  border-color: #f59e0b;
  background: rgba(245, 158, 11, 0.10);
}

.assets-empty {
  color: var(--e-muted);
  font-size: 13px;
  text-align: center;
  padding: 32px 12px;
}

/* ---------- Card-settings accordion ---------- */
.acc { border-top: 1px solid var(--e-border); }
.acc__head {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 10px 12px;
  font-size: 13px;
  font-weight: 600;
  color: var(--e-fg);
  text-align: left;
  background: transparent;
  border: none;
  cursor: pointer;
}
.acc__head:hover { background: var(--e-surface); }
.acc__caret {
  display: inline-flex;
  color: var(--e-muted);
  transition: transform 120ms ease;
}
.acc__caret svg { width: 16px; height: 16px; }
.acc--open .acc__caret { transform: rotate(90deg); }
.acc__body { padding: 4px 14px 14px; }

/* ---------- Per-step placement picker ---------- */
.place {
  padding: 0;
}
.place__auto {
  display: block;
  margin: 10px auto 0;
  font-size: 12px;
  font-weight: 600;
  color: var(--e-muted);
  background: var(--e-bg);
  border: 1px solid var(--e-border);
  border-radius: 999px;
  padding: 3px 12px;
  cursor: pointer;
}
.place__auto:hover { color: var(--e-fg); }
.place__auto--active { color: #fff; background: var(--e-accent); border-color: var(--e-accent); }
.place__grid {
  position: relative;
  width: 132px;
  height: 96px;
  margin: 0 auto 6px;
  background: var(--e-bg);
  border: 1px solid var(--e-border);
  border-radius: 8px;
}
.place__el {
  position: absolute;
  left: 40px;
  top: 32px;
  width: 52px;
  height: 32px;
  background: var(--e-accent-soft);
  border: 1px solid #c7d6ff;
  border-radius: 5px;
}
.place__dot {
  position: absolute;
  width: 12px;
  height: 12px;
  padding: 0;
  border-radius: 999px;
  background: #cdd3de;
  border: 2px solid var(--e-bg);
  cursor: pointer;
}
.place__dot:hover { background: var(--e-muted); }
.place__dot--active {
  background: var(--e-accent);
  box-shadow: 0 0 0 3px var(--e-accent-soft);
}

/* ---------- Settings blocks (Styles / Rules / Page) ---------- */
.settings { padding: 0; }
.settings__divider { height: 1px; background: var(--e-border); margin: 14px 0; }
.settings__checkrow {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--e-fg);
  margin-bottom: 12px;
  cursor: pointer;
}
.settings__check { width: 16px; height: 16px; accent-color: var(--e-accent); cursor: pointer; }
.subtabs {
  display: inline-flex;
  gap: 2px;
  padding: 3px;
  margin-bottom: 14px;
  background: var(--e-surface);
  border-radius: 9px;
}
.subtab {
  font-size: 12px;
  font-weight: 600;
  color: var(--e-muted);
  background: transparent;
  border: none;
  border-radius: 6px;
  padding: 5px 12px;
}
.subtab--active { color: var(--e-fg); background: #fff; box-shadow: 0 1px 2px rgba(15,23,42,0.08); }
.settings__field { margin-bottom: 12px; }
.settings__label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: var(--e-fg);
  margin-bottom: 8px;
}
.settings__row { display: flex; align-items: center; gap: 12px; }
.settings__slider { flex: 1; accent-color: #f59e0b; }
.settings__value {
  min-width: 42px;
  text-align: right;
  font-size: 13px;
  font-weight: 600;
  color: var(--e-muted);
  font-variant-numeric: tabular-nums;
  cursor: text;
  border-radius: 4px;
  padding: 1px 3px;
}
.settings__value:hover { background: var(--e-surface); color: var(--e-fg); }
.settings__num {
  width: 48px;
  text-align: right;
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  color: var(--e-fg);
  background: #fff;
  border: 1px solid var(--e-accent);
  border-radius: 4px;
  padding: 1px 3px;
  font-variant-numeric: tabular-nums;
  outline: none;
}
.settings__hint {
  font-size: 12px;
  line-height: 1.5;
  color: var(--e-muted);
}
`;
const ICONS = {
  cursor: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m4 4 7 17 2.5-7L21 11.5 4 4Z"/></svg>',
  back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>',
  chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></svg>',
  panelSide: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M15 4v16"/></svg>',
  navFlip: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18"/><path d="m7 8 5-5 5 5"/><path d="m7 16 5 5 5-5"/></svg>',
  build: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>',
  preview: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>',
  bolt: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z"/></svg>',
  step: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 2"/></svg>',
  download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/></svg>',
  upload: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M17 8l-5-5-5 5"/><path d="M12 3v12"/></svg>'
};
let idCounter = 0;
function uid(prefix) {
  const rnd = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${idCounter++}`;
  return `${prefix}-${rnd}`;
}
function createDraftStep(type = "step") {
  return {
    id: uid("step"),
    type,
    included: true,
    selectors: [],
    content: "",
    page: "",
    placement: "auto",
    align: "center",
    backLabel: "Back",
    nextLabel: "Next",
    overlay: true
  };
}
function createDraftTour(kind = "tour") {
  return {
    id: uid(kind),
    kind,
    name: kind === "template" ? "Untitled template" : "Untitled tour",
    status: "draft",
    trigger: { type: "manual" },
    audience: "all",
    conditions: { firstVisitOnly: true, maxShows: 0, device: "any" },
    steps: [createDraftStep()],
    display: {
      padding: DEFAULT_PADDING,
      radius: DEFAULT_RADIUS,
      cardRadius: DEFAULT_CARD_RADIUS,
      offset: DEFAULT_OFFSET,
      alignOffset: 0
    }
  };
}
function cloneDraft(src, kind, name) {
  return {
    id: uid(kind),
    kind,
    name: name ?? src.name,
    status: "draft",
    trigger: { ...src.trigger },
    audience: src.audience,
    conditions: { ...src.conditions },
    steps: src.steps.map((s) => ({ ...s, id: uid("step"), selectors: [...s.selectors] })),
    display: { ...src.display }
  };
}
function normalizeTrigger(value) {
  if (value && typeof value === "object") {
    const t = value;
    if (t.type === "load") return { type: "load" };
    if (t.type === "selector" && typeof t.selector === "string") return { type: "selector", selector: t.selector };
    if (t.type === "timer" && typeof t.delay === "number") return { type: "timer", delay: t.delay };
    if (t.type === "cta" && typeof t.text === "string" && typeof t.button === "string") {
      const corners = ["bottom-right", "bottom-left", "top-right", "top-left"];
      return {
        type: "cta",
        text: t.text,
        button: t.button,
        corner: corners.includes(t.corner) ? t.corner : "bottom-right",
        offset: typeof t.offset === "number" ? t.offset : void 0
      };
    }
  }
  return { type: "manual" };
}
function normalizeTours(input) {
  if (!Array.isArray(input)) return [];
  const out = [];
  for (const raw of input) {
    if (!raw || typeof raw !== "object") continue;
    const t = raw;
    if (typeof t.id !== "string" || !Array.isArray(t.steps)) continue;
    out.push({
      id: t.id,
      kind: t.kind === "template" ? "template" : "tour",
      name: typeof t.name === "string" ? t.name : "Untitled tour",
      status: t.status === "published" ? "published" : "draft",
      trigger: normalizeTrigger(t.trigger),
      audience: t.audience === "auth" || t.audience === "guest" ? t.audience : "all",
      conditions: {
        firstVisitOnly: (t.conditions?.firstVisitOnly ?? true) === true,
        maxShows: numOr(t.conditions?.maxShows, 0),
        device: ["mobile", "tablet", "desktop"].includes(t.conditions?.device) ? t.conditions.device : "any"
      },
      display: {
        padding: numOr(t.display?.padding, DEFAULT_PADDING),
        radius: numOr(t.display?.radius, DEFAULT_RADIUS),
        cardRadius: numOr(t.display?.cardRadius, DEFAULT_CARD_RADIUS),
        offset: numOr(t.display?.offset, DEFAULT_OFFSET),
        alignOffset: numOr(t.display?.alignOffset, 0)
      },
      steps: t.steps.filter((s) => !!s && typeof s === "object").map((s) => ({
        ...createDraftStep(s.type === "action" ? "action" : "step"),
        ...s
      }))
    });
  }
  return out;
}
function numOr(value, fallback) {
  return typeof value === "number" && value >= 0 ? value : fallback;
}
function compileTour(draft) {
  const steps = draft.steps.filter((s) => s.included && s.selectors.length > 0).map((s) => ({
    id: s.id,
    selectors: s.selectors,
    content: { default: s.content },
    placement: s.placement,
    align: s.align,
    backLabel: s.backLabel,
    nextLabel: s.nextLabel,
    ...s.page ? { pageUrl: { glob: s.page } } : {},
    ...s.action ? { action: s.action } : {},
    // Only emitted when it differs from the default, to keep stored tours lean.
    ...s.overlay === false ? { overlay: false } : {}
  }));
  const when = {};
  if (draft.conditions.firstVisitOnly) when.firstVisitOnly = true;
  if (draft.conditions.maxShows > 0) when.maxShows = draft.conditions.maxShows;
  if (draft.conditions.device !== "any") when.device = draft.conditions.device;
  const rules = Object.keys(when).length > 0 ? [{ when }] : void 0;
  return {
    id: draft.id,
    schemaVersion: SCHEMA_VERSION,
    title: { default: draft.name },
    steps,
    trigger: draft.trigger,
    audience: draft.audience,
    ...rules ? { rules } : {},
    display: {
      padding: draft.display.padding,
      radius: draft.display.radius,
      cardRadius: draft.display.cardRadius,
      offset: draft.display.offset,
      alignOffset: draft.display.alignOffset
    }
  };
}
function toTour(draft) {
  return validate(compileTour(draft));
}
function looksLikeSchemaTour(value) {
  if (!value || typeof value !== "object") return false;
  const o = value;
  return "schemaVersion" in o || typeof o.title === "object" && o.title !== null;
}
function fromTour(tour) {
  const rule = tour.rules && tour.rules[0]?.when || {};
  const device = rule.device;
  return {
    id: typeof tour.id === "string" && tour.id ? tour.id : uid("tour"),
    kind: "tour",
    name: tour.title?.default ?? "Imported tour",
    status: "draft",
    trigger: normalizeTrigger(tour.trigger),
    audience: tour.audience === "auth" || tour.audience === "guest" ? tour.audience : "all",
    conditions: {
      firstVisitOnly: rule.firstVisitOnly === true,
      maxShows: numOr(rule.maxShows, 0),
      device: device === "mobile" || device === "tablet" || device === "desktop" ? device : "any"
    },
    display: {
      padding: numOr(tour.display?.padding, DEFAULT_PADDING),
      radius: numOr(tour.display?.radius, DEFAULT_RADIUS),
      cardRadius: numOr(tour.display?.cardRadius, DEFAULT_CARD_RADIUS),
      offset: numOr(tour.display?.offset, DEFAULT_OFFSET),
      alignOffset: numOr(tour.display?.alignOffset, 0)
    },
    steps: (Array.isArray(tour.steps) ? tour.steps : []).map((s) => ({
      ...createDraftStep("step"),
      id: typeof s.id === "string" && s.id ? s.id : uid("step"),
      selectors: Array.isArray(s.selectors) ? s.selectors.filter((x) => typeof x === "string") : [],
      content: typeof s.content?.default === "string" ? s.content.default : "",
      page: s.pageUrl?.glob ?? "",
      placement: s.placement ?? "auto",
      align: s.align ?? "center",
      overlay: s.overlay !== false,
      backLabel: s.backLabel ?? "Back",
      nextLabel: s.nextLabel ?? "Next",
      ...s.action ? { action: s.action } : {},
      // Only emitted when it differs from the default, to keep stored tours lean.
      ...s.overlay === false ? { overlay: false } : {}
    }))
  };
}
function importDrafts(input) {
  const arr = Array.isArray(input) ? input : [input];
  const out = [];
  for (const raw of arr) {
    if (looksLikeSchemaTour(raw)) {
      out.push(fromTour(raw));
    } else {
      const [draft] = normalizeTours([raw]);
      if (draft) out.push(draft);
    }
  }
  return out;
}
function createLocalStore(key = "tours:drafts") {
  return {
    async load() {
      try {
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        return normalizeTours(JSON.parse(raw));
      } catch {
        return null;
      }
    },
    async save(tours) {
      try {
        localStorage.setItem(key, JSON.stringify(tours));
      } catch {
      }
    }
  };
}
function createWordPressStore(config) {
  const headers = { "Content-Type": "application/json" };
  if (config.nonce) headers["X-WP-Nonce"] = config.nonce;
  return {
    async load() {
      const res = await fetch(config.url, { headers, credentials: "same-origin" });
      if (!res.ok) throw new Error(`WordPress load failed: ${res.status}`);
      return normalizeTours(await res.json());
    },
    async save(tours) {
      const res = await fetch(config.url, {
        method: "POST",
        headers,
        credentials: "same-origin",
        body: JSON.stringify(tours)
      });
      if (!res.ok) throw new Error(`WordPress save failed: ${res.status}`);
    }
  };
}
const RESUME_PARAM = "tours-resume";
function h(tag, attrs = {}, children = []) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  for (const c of children) el.append(typeof c === "string" ? document.createTextNode(c) : c);
  return el;
}
function iconButton(icon, title, cls = "") {
  const btn = h("button", { class: `iconbtn ${cls}`.trim(), title, type: "button" });
  btn.innerHTML = ICONS[icon] ?? "";
  return btn;
}
function triggerHint(type) {
  switch (type) {
    case "load":
      return "Starts automatically as soon as a matching page loads.";
    case "selector":
      return "Starts when an element matching the selector appears in the page (waits for it).";
    case "timer":
      return "Starts after the delay elapses on a matching page.";
    case "cta":
      return "Shows a small invitation in a corner; its button starts the tour.";
    case "manual":
    default:
      return 'Starts from the [site_tour] shortcode or any element with a data-site-tour="<id>" attribute.';
  }
}
function defaultTrigger(type) {
  switch (type) {
    case "load":
      return { type: "load" };
    case "selector":
      return { type: "selector", selector: "" };
    case "timer":
      return { type: "timer", delay: 3e3 };
    case "cta":
      return { type: "cta", text: "Need a hand getting started?", button: "Start tour", corner: "bottom-right", offset: 24 };
    default:
      return { type: "manual" };
  }
}
class TourBuilder {
  constructor(options = {}) {
    this.options = options;
    this.log = createLogger("editor");
    this.host = null;
    this.root = null;
    this.tours = [createDraftTour()];
    this.openTourId = this.tours[0].id;
    this.view = "edit";
    this.listFilter = "tour";
    this.menuOpen = false;
    this.activeStepId = this.tours[0].steps[0]?.id ?? null;
    this.tab = "steps";
    this.displaySub = "tour";
    this.openSections = /* @__PURE__ */ new Set();
    this.mode = "build";
    this.picker = null;
    this.picking = false;
    this.pickAppend = false;
    this.selectorEditorFor = null;
    this.dragFrom = null;
    this.player = null;
    this.highlight = null;
    this.cardPreview = null;
    this.focusStepId = null;
    this.onViewportChange = () => this.updateOverlays(true);
    this.saveTimer = null;
    this.navPosition = options.navPosition ?? "bottom";
    this.panelPosition = options.panelPosition ?? "right";
    this.topOffset = Math.max(0, options.topOffset ?? 0);
    this.local = options.store ?? createLocalStore(options.storageKey);
    this.secondary = options.storage ?? null;
  }
  /**
   * Auto-mount when the page URL carries the flag (default `?tours-edit=1`), so
   * a site owner can enable the builder without touching code. Returns the
   * instance if mounted, otherwise null.
   */
  static fromUrl(options = {}) {
    const flag = options.urlFlag ?? "tours-edit";
    const value = new URLSearchParams(window.location.search).get(flag);
    if (value === null || value === "0" || value === "false") return null;
    const builder = new TourBuilder(options);
    builder.mount();
    return builder;
  }
  /** Render the UI onto the page. Idempotent. */
  mount() {
    if (this.host) return;
    if (this.options.mode === "off") return;
    this.host = h("div", { "data-tours-editor": "" });
    this.host.style.setProperty("--e-top", `${this.topOffset}px`);
    this.root = this.host.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.textContent = EDITOR_STYLES + CARD_STYLES;
    this.root.appendChild(style);
    this.highlight = h("div", { class: "highlight" });
    this.root.append(this.highlight);
    document.body.appendChild(this.host);
    window.addEventListener("scroll", this.onViewportChange, true);
    window.addEventListener("resize", this.onViewportChange, true);
    this.log.log("mounted");
    this.render();
    void this.hydrate();
  }
  /** Load stored drafts (localStorage by default) and show them. */
  async hydrate() {
    const stored = await this.local.load();
    if (stored && stored.length > 0) {
      this.tours = stored;
      this.openTourId = stored[0].id;
      this.activeStepId = stored[0].steps[0]?.id ?? null;
      this.log.log("hydrated", `${stored.length} tour(s)`);
    }
    if (!this.applyResume()) this.render();
  }
  /** Debounce a save so rapid edits (typing, dragging a slider) coalesce. */
  markDirty() {
    if (this.saveTimer !== null) clearTimeout(this.saveTimer);
    this.saveTimer = setTimeout(() => {
      this.saveTimer = null;
      void this.persist();
    }, 400);
  }
  /** Always write localStorage; also try the secondary strategy best-effort. */
  async persist() {
    const snapshot = this.tours;
    await this.local.save(snapshot);
    if (this.secondary) {
      try {
        await this.secondary.save(snapshot);
      } catch (err) {
        this.log.warn("secondary store save failed (localStorage kept the draft)", err);
      }
    }
  }
  /** Remove the UI and any active picker/player. */
  destroy() {
    this.stopPicking();
    this.player?.stop();
    this.player = null;
    if (this.saveTimer !== null) {
      clearTimeout(this.saveTimer);
      this.saveTimer = null;
      void this.persist();
    }
    window.removeEventListener("scroll", this.onViewportChange, true);
    window.removeEventListener("resize", this.onViewportChange, true);
    if (this.host?.parentNode) this.host.parentNode.removeChild(this.host);
    this.host = null;
    this.root = null;
    this.highlight = null;
    this.cardPreview = null;
  }
  /** The current draft as a validated tour (or validation errors). */
  export() {
    return toTour(this.tour);
  }
  // ---------- state mutations ----------
  /** The currently open tour (falls back to the first if the id is stale). */
  get tour() {
    return this.tours.find((t) => t.id === this.openTourId) ?? this.tours[0];
  }
  get activeStep() {
    return this.tour.steps.find((s) => s.id === this.activeStepId) ?? null;
  }
  /** Open a tour for editing and reset the active step to its first. */
  openTour(id) {
    this.openTourId = id;
    this.view = "edit";
    this.tab = "steps";
    this.activeStepId = this.tour.steps[0]?.id ?? null;
    this.render();
  }
  /** Create a fresh entity of the currently listed kind (tour or template). */
  createEntity() {
    const entity = createDraftTour(this.listFilter);
    this.tours.push(entity);
    this.openTour(entity.id);
  }
  deleteEntity(id) {
    const i = this.tours.findIndex((t) => t.id === id);
    if (i === -1) return;
    this.tours.splice(i, 1);
    if (!this.tours.some((t) => t.kind === "tour")) this.tours.push(createDraftTour());
    if (this.openTourId === id) this.openTourId = this.tours[0].id;
    this.render();
  }
  /** Copy the open tour into a new template and jump to the Templates list. */
  saveAsTemplate() {
    const tpl = cloneDraft(this.tour, "template", `${this.tour.name} (template)`);
    this.tours.push(tpl);
    this.listFilter = "template";
    this.view = "list";
    this.menuOpen = false;
    this.log.log("saved as template", tpl.id);
    this.render();
  }
  /** Create a new tour from a template and open it for editing. */
  createFromTemplate(id) {
    const tpl = this.tours.find((t) => t.id === id);
    if (!tpl) return;
    const tour = cloneDraft(tpl, "tour", tpl.name.replace(/\s*\(template\)\s*$/, ""));
    this.tours.push(tour);
    this.openTour(tour.id);
  }
  setActive(id) {
    if (this.activeStepId === id) return;
    this.activeStepId = id;
    this.render();
  }
  addStepAfter(index, type = "step") {
    const step = createDraftStep(type);
    step.page = this.currentPage();
    this.tour.steps.splice(index + 1, 0, step);
    this.activeStepId = step.id;
    if (type === "step" && !this.picking) {
      this.togglePicking();
    } else {
      this.render();
    }
    this.revealStep(step.id);
  }
  /** Scroll the panel so a step's card is visible. Runs after render(). */
  revealStep(id) {
    const card = this.root?.querySelector(`.card[data-step-id="${CSS.escape(id)}"]`);
    if (!card) return;
    const body = card.closest(".panel__body");
    if (body && this.tour.steps[this.tour.steps.length - 1]?.id === id) {
      body.scrollTo({ top: body.scrollHeight, behavior: "smooth" });
      return;
    }
    card.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }
  /** A URL glob for the current page (matches its query/hash variations). */
  currentPage() {
    return `${window.location.origin}${window.location.pathname}*`;
  }
  removeStep(id) {
    const i = this.tour.steps.findIndex((s) => s.id === id);
    if (i === -1) return;
    this.tour.steps.splice(i, 1);
    if (this.activeStepId === id) {
      this.activeStepId = this.tour.steps[Math.max(0, i - 1)]?.id ?? null;
    }
    this.render();
  }
  // ---------- picker (selector search) ----------
  togglePicking(append = false) {
    if (this.picking) {
      this.stopPicking();
      return;
    }
    const step = this.activeStep;
    if (!step) return;
    this.picking = true;
    this.pickAppend = append;
    this.picker = createPicker(
      (selectors) => {
        if (this.pickAppend) {
          for (const s of selectors) if (!step.selectors.includes(s)) step.selectors.push(s);
        } else {
          step.selectors = selectors;
        }
        if (!step.page) step.page = this.currentPage();
        this.picking = false;
        this.pickAppend = false;
        this.picker = null;
        this.log.log("bound selector to step", step.id, selectors);
        this.render();
      },
      { ignore: [this.host] }
    );
    this.picker.start();
    this.render();
  }
  stopPicking() {
    this.picker?.stop();
    this.picker = null;
    this.picking = false;
    this.pickAppend = false;
  }
  // ---------- preview ----------
  togglePreview() {
    if (this.mode === "preview") {
      this.player?.stop();
      this.player = null;
      this.mode = "build";
      this.render();
      return;
    }
    this.startPreview();
  }
  /**
   * Enter preview mode, optionally starting at a given step id (used when
   * resuming after a cross-page navigation). The id is resolved against the
   * compiled tour, whose step set can differ from the draft. Returns false if
   * the draft is invalid.
   */
  startPreview(startStepId) {
    const result = this.export();
    if (!result.ok) {
      this.log.warn("cannot preview — draft is invalid", result.errors);
      if (!startStepId) {
        window.alert(`Add a selector and text to at least one step first:

${result.errors.join("\n")}`);
      }
      return false;
    }
    this.mode = "preview";
    this.render();
    this.player = createPlayer(result.tour, {
      onNavigate: (url, stepId) => this.navigateForResume(url, stepId, "preview"),
      // The player refuses to start while the builder is mounted, so that a
      // host app's own tours do not stack under it. This preview *is* the
      // builder, so it opts out.
      allowWhileEditing: true
    });
    const start = startStepId ? result.tour.steps.findIndex((s) => s.id === startStepId) : 0;
    this.player.start(Math.max(0, start));
    return true;
  }
  /**
   * Flush the draft, then navigate to `url` with a resume token so the builder
   * re-opens on `stepId` (and resumes preview when `mode` is 'preview') after
   * the page reloads. Used for cross-page Next in both build and preview.
   */
  async navigateForResume(url, stepId, mode) {
    if (this.saveTimer !== null) {
      clearTimeout(this.saveTimer);
      this.saveTimer = null;
    }
    await this.persist();
    const target = new URL(url, window.location.href);
    target.searchParams.set(RESUME_PARAM, `${mode}~${this.openTourId}~${stepId}`);
    this.log.log("navigating for resume", target.toString());
    window.location.assign(target.toString());
  }
  /**
   * Consume a resume token from the URL (see RESUME_PARAM): reopen the tour on
   * the referenced step and, for preview, restart playback there. Strips the
   * param so a manual refresh will not re-trigger it. Returns true when it
   * handled a resume (and rendered), false to let the caller render normally.
   */
  applyResume() {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get(RESUME_PARAM);
    if (!raw) return false;
    params.delete(RESUME_PARAM);
    const query = params.toString();
    const clean = window.location.pathname + (query ? `?${query}` : "") + window.location.hash;
    window.history.replaceState(window.history.state, "", clean);
    const [mode, tourId, stepId] = raw.split("~");
    const tour = this.tours.find((t) => t.id === tourId);
    if (!tour) return false;
    this.openTourId = tour.id;
    this.view = "edit";
    this.activeStepId = stepId;
    if (mode === "preview" && this.startPreview(stepId)) return true;
    this.tab = "steps";
    this.render();
    return true;
  }
  // ---------- rendering ----------
  render() {
    if (!this.root) return;
    const scrollTop = this.root.querySelector(".panel__body")?.scrollTop ?? 0;
    this.root.querySelectorAll(".panel, .nav").forEach((n) => n.remove());
    if (this.mode === "build") this.root.appendChild(this.renderPanel());
    this.root.appendChild(this.renderNav());
    const body = this.root.querySelector(".panel__body");
    if (body && scrollTop) body.scrollTop = scrollTop;
    if (this.focusStepId) {
      this.focusContent(this.focusStepId);
      this.focusStepId = null;
    }
    this.updateOverlays();
    this.markDirty();
  }
  /** Resolve a step's target on the page, trying each candidate selector. */
  resolveTarget(step) {
    return resolveElement(step.selectors);
  }
  /**
   * Draw the dashed outline around the active step's target, and (in the Card
   * sub-tab) a live tooltip-card preview beside it. Both use the same
   * tour-level values the player reads. Shown only in build mode when the
   * active step resolves; hidden while picking or in preview. No backdrop.
   */
  updateOverlays(fast = false) {
    const box = this.highlight;
    if (!box) return;
    const hideAll = () => {
      box.style.display = "none";
      this.removeCardPreview();
    };
    if (this.view !== "edit" || this.mode !== "build" || this.picking) return hideAll();
    const step = this.activeStep;
    const target = step && step.selectors.length > 0 ? this.resolveTarget(step) : null;
    if (!step || !target) return hideAll();
    const rect = target.getBoundingClientRect();
    const { padding, radius, cardRadius } = this.tour.display;
    box.className = `highlight ${this.tab === "styles" ? "highlight--settings" : ""}`.trim();
    box.style.transitionDuration = fast ? "0ms" : "";
    box.style.display = "block";
    box.style.left = `${rect.left - padding}px`;
    box.style.top = `${rect.top - padding}px`;
    box.style.width = `${rect.width + padding * 2}px`;
    box.style.height = `${rect.height + padding * 2}px`;
    box.style.borderRadius = `${radius}px`;
    this.drawStepCard(step, rect, cardRadius);
  }
  removeCardPreview() {
    if (this.cardPreview) {
      this.cardPreview.remove();
      this.cardPreview = null;
    }
  }
  /**
   * Render the active step's card near its target via the shared renderCard —
   * the exact markup the player uses. Shown when the step has content; in the
   * Card sub-tab a muted placeholder shows so the radius stays visible first.
   */
  drawStepCard(step, rect, cardRadius) {
    const content = step.content.trim();
    const tuningCard = this.tab === "styles" && this.displaySub === "card";
    if (!content && !tuningCard) {
      this.removeCardPreview();
      return;
    }
    const steps = this.tour.steps;
    const index = steps.indexOf(step);
    const goto = (to) => () => {
      const neighbour = steps[to];
      if (!neighbour) return;
      if (neighbour.page && !matchUrl({ glob: neighbour.page }, window.location.href)) {
        const url = deriveUrl({ glob: neighbour.page });
        if (url) {
          void this.navigateForResume(url, neighbour.id, "build");
          return;
        }
      }
      this.setActive(neighbour.id);
    };
    const card = renderCard({
      ghost: true,
      contentText: content || "Step tooltip preview",
      progress: `Step ${index + 1} of ${steps.length}`,
      showClose: true,
      onClose: () => {
        this.activeStepId = null;
        this.render();
      },
      radius: cardRadius,
      back: { label: step.backLabel, disabled: index <= 0, onClick: goto(index - 1) },
      next: { label: step.nextLabel, primary: true, disabled: index >= steps.length - 1, onClick: goto(index + 1) }
    });
    if (!content) {
      const body = card.querySelector(".tours-card__content");
      if (body) body.style.opacity = "0.55";
    }
    this.removeCardPreview();
    this.cardPreview = card;
    this.root?.appendChild(card);
    const pad = this.tour.display.padding;
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
      card: { width: card.offsetWidth, height: card.offsetHeight },
      side: step.placement,
      align: step.align,
      offset: this.tour.display.offset,
      alignOffset: this.tour.display.alignOffset,
      viewport: { width: window.innerWidth, height: window.innerHeight }
    });
    card.style.left = `${left}px`;
    card.style.top = `${top}px`;
  }
  renderNav() {
    const nav = h("div", { class: `nav nav--${this.navPosition}` });
    const build = iconButton("build", "Build", this.mode === "build" ? "iconbtn--active" : "");
    build.addEventListener("click", () => {
      if (this.mode === "preview") this.togglePreview();
    });
    const preview = iconButton("preview", "Preview", this.mode === "preview" ? "iconbtn--active" : "");
    preview.addEventListener("click", () => this.togglePreview());
    const flip = iconButton("navFlip", "Move bar (top/bottom)");
    flip.addEventListener("click", () => {
      this.navPosition = this.navPosition === "bottom" ? "top" : "bottom";
      this.render();
    });
    const close = iconButton("close", "Close builder");
    close.addEventListener("click", () => this.destroy());
    nav.append(build, preview, h("div", { class: "nav__sep" }), flip, close);
    return nav;
  }
  renderPanel() {
    const panel = h("div", { class: `panel panel--${this.panelPosition}` });
    if (this.view === "list") {
      panel.append(this.renderListHeader(), this.renderList());
    } else {
      panel.append(this.renderHeader(), this.renderToolbar(), this.renderTabs(), this.renderBody());
    }
    return panel;
  }
  renderListHeader() {
    const header = h("div", { class: "panel__header" });
    const tabs = h("div", { class: "listtabs" });
    for (const [kind, label] of [["tour", "Tours"], ["template", "Templates"]]) {
      const t = h("button", {
        class: `listtab ${this.listFilter === kind ? "listtab--active" : ""}`.trim(),
        type: "button"
      }, [label]);
      t.addEventListener("click", () => {
        this.listFilter = kind;
        this.render();
      });
      tabs.append(t);
    }
    const download = iconButton("download", `Download all ${this.listFilter === "template" ? "templates" : "tours"} as JSON`);
    download.addEventListener("click", () => this.downloadAll());
    const upload = iconButton("upload", "Import tours from JSON");
    upload.addEventListener("click", () => this.importJson());
    const add = h("button", { class: "newtour", type: "button", title: "New" }, ["+ New"]);
    add.addEventListener("click", () => this.createEntity());
    header.append(tabs, download, upload, add);
    return header;
  }
  renderList() {
    const body = h("div", { class: "panel__body" });
    const list = h("div", { class: "tourlist" });
    const items = this.tours.filter((t) => t.kind === this.listFilter);
    if (items.length === 0) {
      body.append(
        h("div", { class: "assets-empty" }, [
          this.listFilter === "template" ? "No templates yet." : "No tours yet."
        ])
      );
      return body;
    }
    items.forEach((t) => {
      const row = h("div", { class: "tourrow" });
      row.addEventListener("click", () => this.openTour(t.id));
      const main = h("div", { class: "tourrow__main" });
      main.append(
        h("div", { class: "tourrow__name" }, [t.name]),
        h("div", { class: "tourrow__meta" }, [
          `${t.steps.length} step${t.steps.length === 1 ? "" : "s"}`
        ])
      );
      row.append(main);
      if (t.kind === "template") {
        const use = h("button", { class: "tourrow__use", type: "button", title: "Create a tour from this template" }, ["Use"]);
        use.addEventListener("click", (e) => {
          e.stopPropagation();
          this.createFromTemplate(t.id);
        });
        row.append(use);
      } else {
        row.append(h("span", { class: `status status--${t.status}` }, [t.status]));
      }
      const del = iconButton("trash", "Delete");
      del.addEventListener("click", (e) => {
        e.stopPropagation();
        this.deleteEntity(t.id);
      });
      row.append(del);
      list.append(row);
    });
    body.append(list);
    return body;
  }
  renderHeader() {
    const header = h("div", { class: "panel__header" });
    const title = h("input", { class: "panel__title", value: this.tour.name });
    title.value = this.tour.name;
    title.addEventListener("change", () => {
      this.tour.name = title.value.trim() || "Untitled tour";
      this.markDirty();
    });
    const status = h("span", { class: `status status--${this.tour.status}` }, [this.tour.status]);
    status.addEventListener("click", () => {
      this.tour.status = this.tour.status === "draft" ? "published" : "draft";
      this.render();
    });
    status.setAttribute("title", "Toggle status");
    status.style.cursor = "pointer";
    const menu = iconButton("menu", "Menu", this.menuOpen ? "iconbtn--active" : "");
    menu.addEventListener("click", () => {
      this.menuOpen = !this.menuOpen;
      this.render();
    });
    header.append(title, status, menu);
    if (this.menuOpen) header.append(this.renderMenu());
    return header;
  }
  /** The ⋯ dropdown: save-as-template (tours only), JSON download and import. */
  renderMenu() {
    const menu = h("div", { class: "menu" });
    const item = (label, onClick) => {
      const b = h("button", { class: "menu__item", type: "button" }, [label]);
      b.addEventListener("click", () => {
        this.menuOpen = false;
        onClick();
      });
      return b;
    };
    if (this.tour.kind === "tour") {
      menu.append(item("Save as template", () => this.saveAsTemplate()));
    }
    menu.append(item("Download JSON", () => this.downloadOpenTour()));
    menu.append(item("Import JSON…", () => this.importJson()));
    return menu;
  }
  /** Download the given drafts as a schema Tour[] JSON file. */
  downloadJson(drafts, filename) {
    const tours = drafts.map((d) => compileTour(d));
    const blob = new Blob([JSON.stringify(tours, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    this.log.log("downloaded", filename, `${tours.length} tour(s)`);
  }
  /** Slugify a name into a safe file base (fallback to a generic name). */
  fileBase(name) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    return slug || "tours";
  }
  /** Download just the currently open tour (as an array of one). */
  downloadOpenTour() {
    this.downloadJson([this.tour], `${this.fileBase(this.tour.name)}.json`);
  }
  /** Download every tour of the kind currently listed (Tours or Templates). */
  downloadAll() {
    const drafts = this.tours.filter((t) => t.kind === this.listFilter);
    if (drafts.length === 0) return;
    this.downloadJson(drafts, `${this.listFilter === "template" ? "templates" : "tours"}.json`);
  }
  /**
   * Prompt for a JSON file and merge its tours into the builder. A tour with an
   * id that already exists is replaced; new ids are appended. When an open tour
   * is being edited it stays open (if it survived the import).
   */
  importJson() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json,.json";
    input.addEventListener("change", () => {
      const file = input.files?.[0];
      if (!file) return;
      void file.text().then((text) => {
        let parsed;
        try {
          parsed = JSON.parse(text);
        } catch {
          window.alert("Could not read that file — it is not valid JSON.");
          return;
        }
        const drafts = importDrafts(parsed);
        if (drafts.length === 0) {
          window.alert("No tours found in that file.");
          return;
        }
        this.mergeDrafts(drafts);
      });
    });
    input.click();
  }
  /** Merge imported drafts by id (replace existing, append new) and re-render. */
  mergeDrafts(drafts) {
    for (const d of drafts) {
      const i = this.tours.findIndex((t) => t.id === d.id);
      if (i === -1) this.tours.push(d);
      else this.tours[i] = d;
    }
    if (!this.tours.some((t) => t.id === this.openTourId)) {
      this.openTourId = this.tours[0].id;
      this.activeStepId = this.tour.steps[0]?.id ?? null;
    }
    this.log.log("imported", `${drafts.length} tour(s)`);
    this.render();
    void this.persist();
  }
  renderToolbar() {
    const bar = h("div", { class: "panel__toolbar" });
    const back = iconButton("back", "Back to tours");
    back.addEventListener("click", () => {
      this.stopPicking();
      this.view = "list";
      this.render();
    });
    const side = iconButton("panelSide", "Move panel (left/right)");
    side.addEventListener("click", () => {
      this.panelPosition = this.panelPosition === "right" ? "left" : "right";
      this.render();
    });
    const cursor = iconButton(
      "cursor",
      this.picking ? "Cancel picking" : "Pick element for active step",
      this.picking ? "iconbtn--active" : ""
    );
    cursor.addEventListener("click", () => this.togglePicking());
    bar.append(back, h("div", { class: "spacer" }), side, cursor);
    return bar;
  }
  renderTabs() {
    const tabs = h("div", { class: "tabs" });
    for (const [key, label] of [
      ["steps", "Steps"],
      ["styles", "Styles"],
      ["rules", "Rules"]
    ]) {
      const tab = h("button", { class: `tab ${this.tab === key ? "tab--active" : ""}`, type: "button" }, [label]);
      tab.addEventListener("click", () => {
        this.tab = key;
        if (key === "styles") this.selectFirstResolvableStep();
        this.render();
      });
      tabs.append(tab);
    }
    return tabs;
  }
  /** Activate the first step whose selector resolves to an on-page element. */
  selectFirstResolvableStep() {
    const found = this.tour.steps.find((s) => this.resolveTarget(s) !== null);
    if (found) this.activeStepId = found.id;
  }
  /**
   * The Display tab: two sub-tabs of tour-level visual settings — Tour (the
   * target outline) and Card (the visitor tooltip) — tuned live.
   */
  renderDisplaySettings() {
    const wrap = h("div", { class: "settings" });
    const subs = h("div", { class: "subtabs" });
    for (const [key, label] of [["tour", "Tour"], ["card", "Card"]]) {
      const b = h("button", { class: `subtab ${this.displaySub === key ? "subtab--active" : ""}`, type: "button" }, [label]);
      b.addEventListener("click", () => {
        this.displaySub = key;
        this.render();
      });
      subs.append(b);
    }
    wrap.append(subs);
    if (!this.activeStep || !this.resolveTarget(this.activeStep)) {
      wrap.append(
        h("div", { class: "assets-empty" }, [
          "Give a step a selector first — then its target frames here so you can tune the look."
        ])
      );
      return wrap;
    }
    const d = this.tour.display;
    if (this.displaySub === "tour") {
      wrap.append(
        this.slider("Outline spacing", d.padding, 0, 40, (v) => d.padding = v),
        this.slider("Outline corner radius", d.radius, 0, 40, (v) => d.radius = v),
        h("div", { class: "settings__hint" }, [
          "The outline framing the target — applied in the builder and in the live tour spotlight."
        ])
      );
    } else {
      wrap.append(
        this.slider("Card corner radius", d.cardRadius, 0, 32, (v) => d.cardRadius = v),
        this.slider("Distance from target", d.offset, 0, 48, (v) => d.offset = v),
        this.slider("Alignment inset", d.alignOffset, 0, 48, (v) => d.alignOffset = v),
        h("div", { class: "settings__hint" }, [
          "Distance is the gap to the element; alignment inset nudges the card in from the aligned edge (start/end placements)."
        ])
      );
    }
    return wrap;
  }
  /** A labelled range slider that writes through `set` and re-draws overlays live. */
  slider(label, current, min, max, set) {
    let cur = current;
    const value = h("span", { class: "settings__value", title: "Click to type a value" }, [`${cur}px`]);
    const input = h("input", {
      class: "settings__slider",
      type: "range",
      min: String(min),
      max: String(max),
      step: "1"
    });
    input.value = String(cur);
    const apply = (n) => {
      cur = Math.max(min, Math.min(max, Math.round(n)));
      input.value = String(cur);
      value.textContent = `${cur}px`;
      set(cur);
      this.updateOverlays();
      this.markDirty();
    };
    input.addEventListener("input", () => apply(Number(input.value)));
    value.addEventListener("click", () => this.editNumber(value, cur, apply));
    const row = h("div", { class: "settings__row" });
    row.append(input, value);
    const field = h("div", { class: "settings__field" });
    field.append(h("label", { class: "settings__label" }, [label]), row);
    return field;
  }
  /** Swap a value label for a digits-only input; commit on blur/Enter. */
  editNumber(valueEl, current, apply) {
    const input = h("input", {
      class: "settings__num",
      type: "text",
      inputmode: "numeric"
    });
    input.value = String(current);
    valueEl.replaceWith(input);
    input.focus();
    input.select();
    input.addEventListener("input", () => {
      input.value = input.value.replace(/[^0-9]/g, "");
    });
    const commit = () => {
      const n = input.value === "" ? current : Number(input.value);
      input.replaceWith(valueEl);
      apply(n);
    };
    input.addEventListener("blur", commit);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") input.blur();
      if (e.key === "Escape") {
        input.value = String(current);
        input.blur();
      }
    });
  }
  renderBody() {
    const body = h("div", { class: "panel__body" });
    if (this.tab === "styles") {
      body.append(this.renderDisplaySettings());
      return body;
    }
    if (this.tab === "rules") {
      body.append(this.renderRulesBody());
      return body;
    }
    const editing = this.selectorEditorFor ? this.tour.steps.find((s) => s.id === this.selectorEditorFor) : void 0;
    if (editing) body.append(this.renderSelectorEditor(editing));
    else if (this.selectorEditorFor) this.selectorEditorFor = null;
    const list = h("div", { class: "steps" });
    list.append(this.renderConnector(-1));
    this.tour.steps.forEach((step, i) => {
      list.append(this.renderCard(step, i));
      list.append(this.renderConnector(i));
    });
    body.append(list);
    return body;
  }
  /** Rules tab: start trigger, audience, and auto-start conditions. */
  renderRulesBody() {
    const wrap = h("div", { class: "settings" });
    const t = this.tour;
    wrap.append(
      this.selectField(
        "Audience",
        t.audience,
        [
          ["all", "Everyone"],
          ["auth", "Logged-in users only"],
          ["guest", "Logged-out visitors only"]
        ],
        (v) => {
          t.audience = v;
          this.markDirty();
        }
      ),
      this.selectField(
        "Start trigger",
        t.trigger.type,
        [
          ["manual", "Manual (shortcode / attribute)"],
          ["load", "On page load"],
          ["selector", "When an element appears"],
          ["timer", "After a delay"],
          ["cta", "Corner invitation (popover)"]
        ],
        (v) => {
          t.trigger = defaultTrigger(v);
          this.markDirty();
          this.render();
        }
      )
    );
    if (t.trigger.type === "selector") {
      wrap.append(
        this.textField("Element selector (CSS)", t.trigger.selector, "#start, .cta", (v) => {
          if (t.trigger.type === "selector") t.trigger.selector = v;
        })
      );
    } else if (t.trigger.type === "timer") {
      wrap.append(
        this.textField("Delay (ms)", String(t.trigger.delay), "3000", (v) => {
          if (t.trigger.type === "timer") t.trigger.delay = Math.max(0, Number(v.replace(/[^0-9]/g, "")) || 0);
        })
      );
    } else if (t.trigger.type === "cta") {
      const cta = t.trigger;
      wrap.append(
        this.textField("Invitation text", cta.text, "Need a hand getting started?", (v) => {
          if (t.trigger.type === "cta") t.trigger.text = v;
        }),
        this.textField("Button label", cta.button, "Start tour", (v) => {
          if (t.trigger.type === "cta") t.trigger.button = v;
        }),
        this.selectField(
          "Corner",
          cta.corner,
          [
            ["bottom-right", "Bottom right"],
            ["bottom-left", "Bottom left"],
            ["top-right", "Top right"],
            ["top-left", "Top left"]
          ],
          (v) => {
            if (t.trigger.type === "cta") t.trigger.corner = v;
            this.markDirty();
          }
        ),
        this.textField("Edge offset (px)", String(cta.offset ?? 24), "24", (v) => {
          if (t.trigger.type === "cta") t.trigger.offset = Math.max(0, Number(v.replace(/[^0-9]/g, "")) || 0);
        })
      );
    }
    wrap.append(h("div", { class: "settings__hint" }, [triggerHint(t.trigger.type)]));
    if (t.trigger.type !== "manual") {
      const c = t.conditions;
      wrap.append(
        h("div", { class: "settings__divider" }),
        this.checkboxField("Show only on the first visit", c.firstVisitOnly, (on) => {
          c.firstVisitOnly = on;
        }),
        this.textField("Show at most N times (0 = no limit)", String(c.maxShows), "0", (v) => {
          c.maxShows = Math.max(0, Number(v.replace(/[^0-9]/g, "")) || 0);
        }),
        this.selectField(
          "Device",
          c.device,
          [
            ["any", "Any device"],
            ["desktop", "Desktop only"],
            ["tablet", "Tablet only"],
            ["mobile", "Mobile only"]
          ],
          (v) => {
            c.device = v;
            this.markDirty();
          }
        )
      );
    }
    return wrap;
  }
  /** A labelled checkbox row. */
  checkboxField(label, checked, onChange) {
    const input = h("input", { type: "checkbox", class: "settings__check" });
    input.checked = checked;
    input.addEventListener("change", () => {
      onChange(input.checked);
      this.markDirty();
      this.render();
    });
    const row = h("label", { class: "settings__checkrow" });
    row.append(input, document.createTextNode(label));
    return row;
  }
  /** A labelled <select>. */
  selectField(label, value, options, onChange) {
    const select = document.createElement("select");
    select.className = "tsel";
    for (const [val, text] of options) {
      const opt = document.createElement("option");
      opt.value = val;
      opt.textContent = text;
      if (val === value) opt.selected = true;
      select.append(opt);
    }
    select.addEventListener("change", () => onChange(select.value));
    const field = h("div", { class: "settings__field" });
    field.append(h("label", { class: "settings__label" }, [label]), select);
    return field;
  }
  /** A labelled text input that writes through on change. */
  textField(label, value, placeholder, onChange) {
    const input = h("input", { class: "pagecfg__input", placeholder });
    input.value = value;
    input.addEventListener("change", () => {
      onChange(input.value.trim());
      this.markDirty();
    });
    const field = h("div", { class: "settings__field" });
    field.append(h("label", { class: "settings__label" }, [label]), input);
    return field;
  }
  renderConnector(afterIndex) {
    const c = h("div", { class: "connector" });
    const add = h("button", { class: "connector__add", title: "Add step", type: "button" }, ["+"]);
    add.addEventListener("click", () => this.addStepAfter(afterIndex));
    c.append(h("div", { class: "connector__line" }), add, h("div", { class: "connector__line" }));
    return c;
  }
  /**
   * Selector list editor, shown over the panel.
   *
   * A step keeps a ranked list of candidates, but the UI only ever showed the
   * first one and offered no way to drop a bad entry or add a fallback — the
   * picker could only replace the lot. This is that missing editor.
   */
  renderSelectorEditor(step) {
    const pop = h("div", { class: "selpop" });
    const head = h("div", { class: "selpop__head" });
    head.append(h("span", { class: "selpop__title" }, ["Selectors"]));
    const close = iconButton("close", "Close");
    close.addEventListener("click", () => {
      this.selectorEditorFor = null;
      this.render();
    });
    head.append(h("div", { class: "spacer" }), close);
    const list = h("div", { class: "selpop__list" });
    if (step.selectors.length === 0) {
      list.append(h("p", { class: "selpop__empty" }, ["No selectors yet. Add one with the crosshair below."]));
    }
    step.selectors.forEach((value, i) => {
      const row = h("div", { class: "selpop__row", draggable: "true" });
      row.addEventListener("dragstart", (e) => {
        this.dragFrom = i;
        row.classList.add("selpop__row--dragging");
        e.dataTransfer?.setData("text/plain", String(i));
      });
      row.addEventListener("dragend", () => {
        this.dragFrom = null;
        row.classList.remove("selpop__row--dragging");
      });
      row.addEventListener("dragover", (e) => {
        e.preventDefault();
        row.classList.add("selpop__row--over");
      });
      row.addEventListener("dragleave", () => row.classList.remove("selpop__row--over"));
      row.addEventListener("drop", (e) => {
        e.preventDefault();
        const from = this.dragFrom;
        this.dragFrom = null;
        if (from === null || from === i) return;
        const [moved] = step.selectors.splice(from, 1);
        step.selectors.splice(i, 0, moved);
        this.markDirty();
        this.render();
      });
      row.append(h("span", { class: "selpop__grip", title: "Drag to reorder" }, ["⠿"]));
      row.append(h("span", { class: "selpop__rank" }, [String(i + 1)]));
      row.append(h("code", { class: "selpop__code", title: value }, [value]));
      const del = iconButton("trash", "Remove this selector");
      del.addEventListener("click", () => {
        step.selectors.splice(i, 1);
        this.markDirty();
        this.render();
      });
      row.append(del);
      list.append(row);
    });
    const add = h("button", { class: `selpop__add ${this.picking ? "selpop__add--on" : ""}`.trim(), type: "button" }, [
      this.picking ? "◎ Picking — click an element, or press Esc" : "⌖ Add by picking an element"
    ]);
    add.addEventListener("click", () => this.togglePicking(true));
    pop.append(head, list, add);
    return pop;
  }
  renderCard(step, index) {
    const isActive = step.id === this.activeStepId;
    const card = h("div", {
      class: `card ${isActive ? "card--active" : ""} ${step.included ? "" : "card--excluded"}`.trim(),
      // Lets revealStep() find this card after a re-render.
      "data-step-id": step.id
    });
    card.addEventListener("mousedown", () => this.setActive(step.id));
    if (step.page && !matchUrl({ glob: step.page }, window.location.href)) {
      card.classList.add("card--offpage");
    }
    card.append(this.renderCardControl(step, index), this.renderCardContent(step), this.renderCardFooter(step));
    if (isActive) {
      card.append(this.section("placement", "Card position", () => this.renderPlacementBody(step)));
      card.append(this.section("behaviour", "Behaviour", () => this.renderBehaviourBody(step)));
      card.append(this.section("page", "Page", () => this.renderPageBody(step)));
    }
    return card;
  }
  /**
   * Per-step behaviour toggles.
   *
   * Exists because of the standing rule that anything the schema can express
   * must be reachable from the builder — `overlay` shipped with this section,
   * not after it.
   */
  renderBehaviourBody(step) {
    const wrap = h("div", { class: "settings" });
    wrap.append(
      this.checkboxField("Dim the rest of the page", step.overlay !== false, (on) => {
        step.overlay = on;
        this.render();
      }),
      h("div", { class: "settings__hint" }, [
        "Off leaves the page fully usable and only outlines the target — for a step the visitor should be free to poke at."
      ])
    );
    return wrap;
  }
  /** Page sub-panel: which pages this step shows on (multi-page tours). */
  renderPageBody(step) {
    const wrap = h("div", { class: "settings" });
    const input = h("input", { class: "pagecfg__input", placeholder: "Any page" });
    input.value = step.page;
    input.addEventListener("change", () => {
      step.page = input.value.trim();
      this.markDirty();
      this.render();
    });
    const use = h("button", { class: "pagecfg__use", type: "button" }, ["Use current page"]);
    use.addEventListener("click", () => {
      step.page = this.currentPage();
      this.render();
    });
    wrap.append(
      h("label", { class: "settings__label" }, ["Show on pages matching (URL glob)"]),
      input,
      use,
      h("div", { class: "settings__hint" }, [
        "Empty = any page. New steps get the current page automatically; navigate your site (with the builder on) to add steps on other pages."
      ])
    );
    return wrap;
  }
  /**
   * A collapsible card-settings section: a header with a left caret + title;
   * clicking toggles it. Collapsed by default; open state persists across
   * renders (keyed) so switching steps keeps the same sections expanded.
   */
  section(key, title, body) {
    const open = this.openSections.has(key);
    const sec = h("div", { class: `acc ${open ? "acc--open" : ""}`.trim() });
    const head = h("button", { class: "acc__head", type: "button" });
    const caret = h("span", { class: "acc__caret" });
    caret.innerHTML = ICONS.chevron;
    head.append(caret, h("span", { class: "acc__title" }, [title]));
    head.addEventListener("click", () => {
      if (open) this.openSections.delete(key);
      else this.openSections.add(key);
      this.render();
    });
    sec.append(head);
    if (open) sec.append(h("div", { class: "acc__body" }, [body()]));
    return sec;
  }
  /**
   * Placement picker body: an Auto toggle plus a 12-anchor grid (each side ×
   * start/center/end) around a mock target. Editing re-renders so the on-page
   * card and the active anchor update together.
   */
  renderPlacementBody(step) {
    const wrap = h("div", { class: "place" });
    const grid = h("div", { class: "place__grid" });
    grid.append(h("div", { class: "place__el" }));
    grid.append(h("div", { class: "place__el" }));
    const anchors = [
      { side: "top", align: "start", x: 40, y: 16 },
      { side: "top", align: "center", x: 66, y: 16 },
      { side: "top", align: "end", x: 92, y: 16 },
      { side: "bottom", align: "start", x: 40, y: 80 },
      { side: "bottom", align: "center", x: 66, y: 80 },
      { side: "bottom", align: "end", x: 92, y: 80 },
      { side: "left", align: "start", x: 24, y: 32 },
      { side: "left", align: "center", x: 24, y: 48 },
      { side: "left", align: "end", x: 24, y: 64 },
      { side: "right", align: "start", x: 108, y: 32 },
      { side: "right", align: "center", x: 108, y: 48 },
      { side: "right", align: "end", x: 108, y: 64 }
    ];
    for (const a of anchors) {
      const on = step.placement === a.side && step.align === a.align;
      const dot = h("button", {
        class: `place__dot ${on ? "place__dot--active" : ""}`.trim(),
        type: "button",
        title: `${a.side} · ${a.align}`
      });
      dot.style.left = `${a.x - 6}px`;
      dot.style.top = `${a.y - 6}px`;
      dot.addEventListener("click", () => {
        step.placement = a.side;
        step.align = a.align;
        this.render();
      });
      grid.append(dot);
    }
    wrap.append(grid);
    const auto = h("button", {
      class: `place__auto ${step.placement === "auto" ? "place__auto--active" : ""}`.trim(),
      type: "button",
      title: "Pick the side with the most room automatically"
    }, ["Auto"]);
    auto.addEventListener("click", () => {
      step.placement = "auto";
      this.render();
    });
    wrap.append(auto);
    return wrap;
  }
  renderCardControl(step, index) {
    const row = h("div", { class: "card__control" });
    const check = h("input", { class: "card__check", type: "checkbox", title: "Include in tour" });
    check.checked = step.included;
    check.addEventListener("change", () => {
      step.included = check.checked;
      this.render();
    });
    const idx = h("span", { class: "card__index" }, [String(index + 1)]);
    const type = h("span", { class: "card__type" });
    type.innerHTML = ICONS[step.type === "action" ? "bolt" : "step"];
    type.append(document.createTextNode(step.type === "action" ? "Action" : "Step"));
    const sel = step.selectors[0];
    const count = step.selectors.length;
    const selEl = h(
      "button",
      {
        class: `card__sel ${sel ? "" : "card__sel--empty"}`.trim(),
        type: "button",
        title: step.selectors.join("\n") || "No selector yet — click to add one"
      },
      [sel ?? "no selector"]
    );
    if (count > 1) selEl.append(h("span", { class: "card__selcount" }, [`+${count - 1}`]));
    selEl.addEventListener("click", (e) => {
      e.stopPropagation();
      this.setActive(step.id);
      this.selectorEditorFor = this.selectorEditorFor === step.id ? null : step.id;
      this.render();
    });
    const del = iconButton("trash", "Delete step");
    del.addEventListener("click", () => this.removeStep(step.id));
    row.append(check, idx, type, h("div", { class: "spacer" }));
    if (step.page && !matchUrl({ glob: step.page }, window.location.href)) {
      const path = step.page.replace(/^https?:\/\/[^/]+/, "").replace(/\*$/, "") || "/";
      const pageEl = h("button", { class: "card__page", type: "button", title: step.page }, [`⧉ ${path}`]);
      pageEl.addEventListener("click", (e) => {
        e.stopPropagation();
        this.setActive(step.id);
        this.openSections.add("page");
        this.render();
      });
      row.append(pageEl);
    }
    row.append(selEl, del);
    return row;
  }
  renderCardContent(step) {
    const content = h("div", {
      class: "card__content",
      contenteditable: "true",
      "data-placeholder": "Write the step text…",
      "data-step": step.id
    });
    content.textContent = step.content;
    content.addEventListener("input", () => {
      step.content = content.textContent ?? "";
      this.updateOverlays();
      this.markDirty();
    });
    content.addEventListener("mousedown", () => {
      if (this.activeStepId !== step.id) this.focusStepId = step.id;
    });
    return content;
  }
  renderCardFooter(step) {
    const footer = h("div", { class: "card__footer" });
    footer.append(
      this.renderEditableButton(step, "backLabel"),
      this.renderEditableButton(step, "nextLabel")
    );
    return footer;
  }
  /** A footer button that turns into a text input when clicked, to edit its label. */
  renderEditableButton(step, key) {
    const btn = h("button", { class: "cardbtn", type: "button" }, [step[key]]);
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const input = h("input", { class: "cardbtn cardbtn--edit", value: step[key] });
      input.value = step[key];
      btn.replaceWith(input);
      input.focus();
      input.select();
      const commit = () => {
        step[key] = input.value.trim() || (key === "backLabel" ? "Back" : "Next");
        input.replaceWith(this.renderEditableButton(step, key));
        this.markDirty();
      };
      input.addEventListener("blur", commit);
      input.addEventListener("keydown", (ev) => {
        if (ev.key === "Enter") input.blur();
        if (ev.key === "Escape") {
          input.value = step[key];
          input.blur();
        }
      });
    });
    return btn;
  }
  // ---------- misc ----------
  /** Focus a card's content area and place the caret at the end. */
  focusContent(stepId) {
    const el = this.root?.querySelector(`.card__content[data-step="${stepId}"]`);
    if (!el) return;
    el.focus();
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
  }
}
export {
  TourBuilder,
  cloneDraft,
  createDraftStep,
  createDraftTour,
  createLocalStore,
  createWordPressStore,
  normalizeTours,
  toTour
};
//# sourceMappingURL=index.js.map
