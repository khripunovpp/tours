const Ge = `
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
`, Ke = `
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
function Z(r) {
  return JSON.stringify(r);
}
function Qe(r) {
  return /^[a-zA-Z][\w-]*$/.test(r) && r.length <= 30 && !/\d{2,}/.test(r) && !/^(css-|sc-|jsx-|emotion-|_|is-|has-)/.test(r);
}
function me(r) {
  const e = [];
  let t = r;
  for (; t && t !== document.body && t.nodeType === 1; ) {
    const n = t.tagName.toLowerCase(), i = t.parentElement;
    if (!i) {
      e.unshift(n);
      break;
    }
    const o = Array.from(i.children).filter((s) => s.tagName === t.tagName);
    e.unshift(o.length > 1 ? `${n}:nth-of-type(${o.indexOf(t) + 1})` : n), t = i;
  }
  return `body > ${e.join(" > ")}`;
}
function Ze(r) {
  let e = r.parentElement;
  for (; e && e !== document.body && !e.id; )
    e = e.parentElement;
  if (!e || !e.id) return null;
  const t = [];
  let n = r;
  for (; n && n !== e; ) {
    const i = n.tagName.toLowerCase(), o = n.parentElement;
    if (!o) return null;
    const s = Array.from(o.children).filter((l) => l.tagName === n.tagName);
    t.unshift(s.length > 1 ? `${i}:nth-of-type(${s.indexOf(n) + 1})` : i), n = o;
  }
  return `#${CSS.escape(e.id)} > ${t.join(" > ")}`;
}
const et = ["data-testid", "data-test", "data-test-id", "data-cy", "data-qa", "data-id", "data-name"];
function tt(r) {
  const e = [], t = /* @__PURE__ */ new Set(), n = r.tagName.toLowerCase(), i = (c) => {
    if (!(!c || t.has(c)))
      try {
        document.querySelector(c) === r && (t.add(c), e.push(c));
      } catch {
      }
  };
  r.id && i(`#${CSS.escape(r.id)}`);
  for (const c of et) {
    const h = r.getAttribute(c);
    h && i(`${n}[${c}=${Z(h)}]`);
  }
  const o = r.getAttribute("name");
  o && i(`${n}[name=${Z(o)}]`);
  const s = r.getAttribute("aria-label");
  s && i(`[aria-label=${Z(s)}]`);
  const l = Array.from(r.classList).filter(Qe);
  l.length && i(`${n}.${l.map((c) => CSS.escape(c)).join(".")}`);
  for (const c of l) i(`${n}.${CSS.escape(c)}`);
  i(Ze(r)), i(me(r));
  const p = (r.textContent ?? "").replace(/\s+/g, " ").trim();
  if (p && p.length <= 50 && /^(a|button|summary|label|h[1-6])$/.test(n)) {
    const c = `text=${p}`;
    t.has(c) || (t.add(c), e.push(c));
  }
  return e.length === 0 && e.push(me(r)), e;
}
const nt = "a, button, summary, label, h1, h2, h3, h4, h5, h6";
function be(r, e) {
  return !(r instanceof Element) || !r.isConnected || e !== document && e instanceof Node && !e.contains(r) ? null : r;
}
function rt(r, e) {
  if (typeof r == "function") {
    let t;
    try {
      t = r();
    } catch {
      return null;
    }
    return be(t, e);
  }
  if (typeof r != "string") return be(r, e);
  if (r.startsWith("text=")) {
    const t = r.slice(5).trim();
    for (const n of Array.from(e.querySelectorAll(nt)))
      if ((n.textContent ?? "").replace(/\s+/g, " ").trim() === t) return n;
    return null;
  }
  try {
    return e.querySelector(r);
  } catch {
    return null;
  }
}
function D(r, e = document) {
  for (const t of r) {
    const n = rt(t, e);
    if (n) return n;
  }
  return null;
}
function it(r, e = {}) {
  const t = e.root ?? document, n = D(r, t);
  return n ? Promise.resolve(n) : new Promise((i) => {
    let o = !1, s;
    const l = (h) => {
      o || (o = !0, p.disconnect(), s && clearTimeout(s), i(h));
    }, p = new MutationObserver(() => {
      const h = D(r, t);
      h && l(h);
    });
    p.observe(document.documentElement, {
      childList: !0,
      subtree: !0,
      attributes: !0
    });
    const c = e.timeout ?? 4e3;
    c > 0 && Number.isFinite(c) && (s = setTimeout(() => l(null), c));
  });
}
let O = null;
function ee() {
  if (O !== null) return O;
  try {
    O = new URLSearchParams(window.location.search).has("use_logs");
  } catch {
    O = !1;
  }
  return O;
}
function le(r) {
  const e = `[tours:${r}]`;
  return {
    log: (...t) => {
      ee() && console.log(e, ...t);
    },
    warn: (...t) => {
      ee() && console.warn(e, ...t);
    },
    error: (...t) => {
      ee() && console.error(e, ...t);
    }
  };
}
function ot(r, e = {}) {
  const t = le("picker");
  let n = null, i = null, o = null, s = !1;
  function l(m) {
    if (m === n) return !0;
    for (const v of e.ignore ?? [])
      if (v && v.contains(m)) return !0;
    return !1;
  }
  function p() {
    if (n) return;
    n = document.createElement("div"), n.setAttribute("data-tours-picker", ""), i = n.attachShadow({ mode: "open" });
    const m = document.createElement("style");
    m.textContent = Ge, i.appendChild(m), o = document.createElement("div"), o.className = "tours-picker-overlay", o.style.display = "none", i.appendChild(o);
    const v = document.createElement("div");
    v.className = "tours-picker-hint", v.textContent = "Hover and click an element • Esc to cancel", i.appendChild(v), document.body.appendChild(n);
  }
  function c(m, v) {
    const E = document.elementFromPoint(m, v);
    return !E || l(E) ? null : E;
  }
  function h(m) {
    if (!s || !o) return;
    const v = c(m.clientX, m.clientY);
    if (!v) {
      o.style.display = "none";
      return;
    }
    const E = v.getBoundingClientRect();
    o.style.display = "block", o.style.left = `${E.left}px`, o.style.top = `${E.top}px`, o.style.width = `${E.width}px`, o.style.height = `${E.height}px`;
  }
  function g(m) {
    if (!s) return;
    const v = c(m.clientX, m.clientY);
    if (m.preventDefault(), m.stopPropagation(), !v) return;
    const E = tt(v);
    t.log("picked", E), y(), r(E);
  }
  function u(m) {
    m.key === "Escape" && (m.preventDefault(), y());
  }
  function k() {
    s || (s = !0, t.log("start"), p(), document.addEventListener("mousemove", h, !0), document.addEventListener("click", g, !0), document.addEventListener("keydown", u, !0));
  }
  function y() {
    s && (s = !1, document.removeEventListener("mousemove", h, !0), document.removeEventListener("click", g, !0), document.removeEventListener("keydown", u, !0), n && n.parentNode && n.parentNode.removeChild(n), n = null, i = null, o = null);
  }
  return { start: k, stop: y };
}
const B = 6, U = 6, j = 10, V = 12, st = 2;
function L(r) {
  return typeof r == "object" && r !== null && !Array.isArray(r);
}
function ve(r) {
  return L(r) && typeof r.default == "string";
}
const xe = ["top", "bottom", "left", "right", "auto"], ye = ["start", "center", "end"], we = ["mobile", "tablet", "desktop"], _e = ["click", "input", "navigate", "none"];
function Pe(r, e, t) {
  if (!L(r)) {
    t.push(`${e} must be an object`);
    return;
  }
  const n = typeof r.glob == "string" && r.glob.length > 0, i = typeof r.regex == "string" && r.regex.length > 0;
  if (!n && !i && t.push(`${e} must have a non-empty "glob" or "regex"`), i)
    try {
      new RegExp(r.regex);
    } catch {
      t.push(`${e}.regex is not a valid regular expression`);
    }
}
function ke(r, e, t) {
  if (!L(r)) {
    t.push(`${e} must be an object`);
    return;
  }
  r.url !== void 0 && Pe(r.url, `${e}.url`, t), r.tags !== void 0 && (!Array.isArray(r.tags) || !r.tags.every((n) => typeof n == "string" && n.length > 0)) && t.push(`${e}.tags must be an array of non-empty strings`), r.firstVisitOnly !== void 0 && typeof r.firstVisitOnly != "boolean" && t.push(`${e}.firstVisitOnly must be a boolean`), r.device !== void 0 && !we.includes(r.device) && t.push(`${e}.device must be one of ${we.join("|")}`), r.unlessSeen !== void 0 && typeof r.unlessSeen != "boolean" && t.push(`${e}.unlessSeen must be a boolean`), r.maxShows !== void 0 && (typeof r.maxShows != "number" || r.maxShows < 0) && t.push(`${e}.maxShows must be a non-negative number`);
}
function at(r, e, t) {
  if (!L(r)) {
    t.push(`${e} must be an object`);
    return;
  }
  _e.includes(r.type) || t.push(`${e}.type must be one of ${_e.join("|")}`), r.url !== void 0 && typeof r.url != "string" && t.push(`${e}.url must be a string`), r.value !== void 0 && typeof r.value != "string" && t.push(`${e}.value must be a string`);
}
function lt(r) {
  const e = [];
  if (!L(r))
    return { ok: !1, errors: ["tour must be an object"] };
  if ((typeof r.id != "string" || r.id.length === 0) && e.push("tour.id must be a non-empty string"), typeof r.schemaVersion != "number" && e.push("tour.schemaVersion must be a number"), ve(r.title) || e.push('tour.title must be a localized text with a string "default"'), Array.isArray(r.steps) ? r.steps.length === 0 ? e.push("tour.steps must contain at least one step") : r.steps.forEach((t, n) => {
    if (!L(t)) {
      e.push(`steps[${n}] must be an object`);
      return;
    }
    (typeof t.id != "string" || t.id.length === 0) && e.push(`steps[${n}].id must be a non-empty string`), (!Array.isArray(t.selectors) || t.selectors.length === 0 || !t.selectors.every((i) => typeof i == "string" && i.length > 0)) && e.push(`steps[${n}].selectors must be a non-empty array of non-empty strings`), ve(t.content) || e.push(`steps[${n}].content must be a localized text with a string "default"`), t.placement !== void 0 && !xe.includes(t.placement) && e.push(`steps[${n}].placement must be one of ${xe.join("|")}`), t.align !== void 0 && !ye.includes(t.align) && e.push(`steps[${n}].align must be one of ${ye.join("|")}`), t.backLabel !== void 0 && typeof t.backLabel != "string" && e.push(`steps[${n}].backLabel must be a string`), t.nextLabel !== void 0 && typeof t.nextLabel != "string" && e.push(`steps[${n}].nextLabel must be a string`), t.pageUrl !== void 0 && Pe(t.pageUrl, `steps[${n}].pageUrl`, e), t.condition !== void 0 && ke(t.condition, `steps[${n}].condition`, e), t.action !== void 0 && at(t.action, `steps[${n}].action`, e), t.overlay !== void 0 && typeof t.overlay != "boolean" && e.push(`steps[${n}].overlay must be a boolean`);
  }) : e.push("tour.steps must be an array"), r.trigger !== void 0) {
    const t = r.trigger, n = ["manual", "load", "selector", "timer", "cta"], i = ["bottom-right", "bottom-left", "top-right", "top-left"];
    !L(t) || typeof t.type != "string" || !n.includes(t.type) ? e.push(`tour.trigger.type must be one of ${n.join("|")}`) : t.type === "selector" && (typeof t.selector != "string" || t.selector.length === 0) ? e.push("tour.trigger.selector must be a non-empty string") : t.type === "timer" && (typeof t.delay != "number" || t.delay < 0) ? e.push("tour.trigger.delay must be a non-negative number") : t.type === "cta" && (typeof t.text != "string" && e.push("tour.trigger.text must be a string"), typeof t.button != "string" && e.push("tour.trigger.button must be a string"), i.includes(t.corner) || e.push(`tour.trigger.corner must be one of ${i.join("|")}`), t.offset !== void 0 && (typeof t.offset != "number" || t.offset < 0) && e.push("tour.trigger.offset must be a non-negative number"));
  }
  if (r.display !== void 0)
    if (!L(r.display))
      e.push("tour.display must be an object");
    else
      for (const t of ["padding", "radius", "cardRadius", "offset", "alignOffset"]) {
        const n = r.display[t];
        n !== void 0 && (typeof n != "number" || n < 0) && e.push(`tour.display.${t} must be a non-negative number`);
      }
  return r.rules !== void 0 && (Array.isArray(r.rules) ? r.rules.forEach((t, n) => {
    if (!L(t)) {
      e.push(`rules[${n}] must be an object`);
      return;
    }
    t.tourId !== void 0 && typeof t.tourId != "string" && e.push(`rules[${n}].tourId must be a string`), t.when === void 0 ? e.push(`rules[${n}].when is required`) : ke(t.when, `rules[${n}].when`, e);
  }) : e.push("tour.rules must be an array")), e.length > 0 ? { ok: !1, errors: e } : { ok: !0, tour: r };
}
function dt(r, e, t) {
  const n = {
    top: r.top,
    bottom: t.height - r.bottom,
    left: r.left,
    right: t.width - r.right
  }, i = {
    top: e.height,
    bottom: e.height,
    left: e.width,
    right: e.width
  }, o = ["bottom", "top", "right", "left"], s = o.find((l) => n[l] >= i[l] + 8);
  return s || o.reduce((l, p) => n[p] > n[l] ? p : l, o[0]);
}
function Ne(r) {
  const { target: e, card: t, offset: n, viewport: i } = r, o = r.side === "auto", s = o ? dt(e, t, i) : r.side, l = o ? "center" : r.align, p = r.alignOffset ?? 0, c = l === "start" ? p : l === "end" ? -p : 0;
  let h = 0, g = 0;
  return s === "top" || s === "bottom" ? (h = s === "top" ? e.top - t.height - n : e.bottom + n, g = l === "start" ? e.left : l === "end" ? e.right - t.width : e.left + e.width / 2 - t.width / 2, g += c) : (g = s === "left" ? e.left - t.width - n : e.right + n, h = l === "start" ? e.top : l === "end" ? e.bottom - t.height : e.top + e.height / 2 - t.height / 2, h += c), g = Math.max(8, Math.min(g, i.width - t.width - 8)), h = Math.max(8, Math.min(h, i.height - t.height - 8)), { top: h, left: g };
}
function ct(r) {
  const e = getComputedStyle(r), t = `${e.overflowX} ${e.overflowY}`;
  return /auto|scroll|overlay|hidden/.test(t);
}
function oe(r) {
  const e = r.getBoundingClientRect();
  let t = e.top, n = e.left, i = e.right, o = e.bottom;
  for (let s = r.parentElement; s && s !== document.body; s = s.parentElement) {
    if (!ct(s)) continue;
    const l = s.getBoundingClientRect();
    t = Math.max(t, l.top), n = Math.max(n, l.left), i = Math.min(i, l.right), o = Math.min(o, l.bottom);
  }
  return t = Math.max(t, 0), n = Math.max(n, 0), i = Math.min(i, window.innerWidth), o = Math.min(o, window.innerHeight), i <= n || o <= t ? null : { top: t, left: n, right: i, bottom: o, width: i - n, height: o - t };
}
function Ee(r) {
  const e = document.createElement("button");
  return e.type = "button", e.className = `tours-card__btn${r.primary ? " tours-card__btn--primary" : ""}${r.disabled ? " tours-card__btn--disabled" : ""}`, e.textContent = r.label, !r.disabled && r.onClick && e.addEventListener("click", r.onClick), e;
}
function Re(r) {
  const e = document.createElement("div");
  if (e.className = `tours-card${r.ghost ? " tours-card--ghost" : ""}${r.showClose ? " tours-card--closable" : ""}`, r.radius != null && (e.style.borderRadius = `${r.radius}px`), r.showClose) {
    const n = document.createElement("button");
    n.className = "tours-card__close", n.type = "button", n.textContent = "×", n.setAttribute("aria-label", "Close"), r.onClose && n.addEventListener("click", r.onClose), e.appendChild(n);
  }
  const t = document.createElement("div");
  if (t.className = "tours-card__content", r.contentHtml != null ? t.innerHTML = r.contentHtml : t.textContent = r.contentText ?? "", e.appendChild(t), r.back || r.next || r.progress) {
    const n = document.createElement("div");
    if (n.className = "tours-card__footer", r.back && n.appendChild(Ee(r.back)), r.progress) {
      const i = document.createElement("span");
      i.className = "tours-card__progress", i.textContent = r.progress, n.appendChild(i);
    }
    r.next && n.appendChild(Ee(r.next)), e.appendChild(n);
  }
  return e;
}
const Me = `
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
function pt(r) {
  const e = r.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*\*/g, "\0").replace(/\*/g, "[^/]*").replace(/ /g, ".*").replace(/\?/g, ".");
  return new RegExp(`^${e}$`);
}
function P(r, e) {
  if (!r) return !0;
  if (r.regex)
    try {
      return new RegExp(r.regex).test(e);
    } catch {
      return !1;
    }
  if (r.glob)
    try {
      return pt(r.glob).test(e);
    } catch {
      return !1;
    }
  return !0;
}
function Oe(r) {
  if (!r || !r.glob) return null;
  const e = r.glob.replace(/\*+/g, "");
  return /^https?:\/\//i.test(e) || e.startsWith("#") || e.startsWith("/") ? e : null;
}
function ut(r = window.innerWidth) {
  return r <= 640 ? "mobile" : r <= 1024 ? "tablet" : "desktop";
}
function ht(r, e) {
  if (r.url && !P(r.url, e.url)) return !1;
  if (r.tags && r.tags.length > 0) {
    const t = e.tags ?? [];
    for (const n of r.tags) if (!t.includes(n)) return !1;
  }
  return !(r.firstVisitOnly && !e.firstVisit || r.device && r.device !== e.device || r.unlessSeen && e.seenCount > 0 || r.maxShows !== void 0 && e.seenCount >= r.maxShows);
}
function ft(r, e) {
  return !r || ht(r, e);
}
const se = "tours:locationchange";
let Se = !1;
function gt() {
  if (!Se) {
    Se = !0;
    for (const r of ["pushState", "replaceState"]) {
      const e = history[r];
      history[r] = function(...n) {
        const i = e.apply(this, n);
        return window.dispatchEvent(new Event(se)), i;
      };
    }
  }
}
function Ce(r) {
  return gt(), window.addEventListener("popstate", r), window.addEventListener("hashchange", r), window.addEventListener(se, r), () => {
    window.removeEventListener("popstate", r), window.removeEventListener("hashchange", r), window.removeEventListener(se, r);
  };
}
const ze = "tours:progress";
function te(r, e) {
  r.set(ze, JSON.stringify(e));
}
function mt(r) {
  r.remove(ze);
}
const bt = "tours:seen:";
function vt(r, e) {
  const t = r.get(bt + e), n = t ? parseInt(t, 10) : 0;
  return Number.isNaN(n) ? 0 : n;
}
const xt = `
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
function yt(r, e) {
  return e ? e(r) : wt({
    text: r.text,
    button: r.button,
    corner: r.corner,
    offset: r.offset,
    onStart: r.onResume
  });
}
function wt(r) {
  const e = r.corner ?? "bottom-right", t = r.offset ?? 24, n = document.createElement("div");
  n.setAttribute("data-tours-cta", "");
  const i = n.attachShadow({ mode: "open" }), o = document.createElement("style");
  o.textContent = xt, i.appendChild(o);
  const s = document.createElement("div");
  s.className = "cta";
  const [l, p] = e.split("-");
  s.style[l] = `${t}px`, s.style[p] = `${t}px`;
  const c = () => {
    n.parentNode && n.parentNode.removeChild(n);
  }, h = document.createElement("button");
  h.className = "cta__close", h.type = "button", h.textContent = "×", h.setAttribute("aria-label", "Dismiss"), h.addEventListener("click", c);
  const g = document.createElement("p");
  g.className = "cta__text", g.textContent = r.text;
  const u = document.createElement("button");
  return u.className = "cta__btn", u.type = "button", u.textContent = r.button, u.addEventListener("click", () => {
    c(), r.onStart();
  }), s.append(h, g, u), i.appendChild(s), document.body.appendChild(n), c;
}
const _t = /* @__PURE__ */ new Set([
  "tourStarting",
  "stepChanging"
]);
function C(r, e, t) {
  const n = _t.has(e);
  let i = !0;
  const o = r?.[e];
  if (o)
    try {
      o(t) === !1 && n && (i = !1);
    } catch (s) {
      console.error(`[tours] handler for "${e}" threw`, s);
    }
  if (typeof document < "u" && typeof CustomEvent == "function")
    try {
      const s = new CustomEvent(`tours:${e}`, { detail: t, cancelable: n });
      document.dispatchEvent(s), n && s.defaultPrevented && (i = !1);
    } catch (s) {
      console.error(`[tours] could not dispatch "tours:${e}"`, s);
    }
  return i;
}
const kt = "[data-tours-editor]";
function Et() {
  return typeof document < "u" && document.querySelector(kt) !== null;
}
function St(r, e = {}) {
  const t = le("player"), n = e.state;
  let i = null, o = null, s = null, l = null, p = null, c = null, h = null, g = !1, u = 0, k = 0, y = null;
  const m = r.display?.padding ?? B, v = r.display?.radius ?? U, E = r.display?.cardRadius ?? j, Be = r.display?.offset ?? V;
  function W(d) {
    return D(d.selectors);
  }
  function z(d) {
    return d.action?.type === "click";
  }
  function Ue(d) {
    if (!d.condition) return !0;
    const f = n ? vt(n, r.id) : 0;
    return ft(d.condition, {
      url: window.location.href,
      tags: e.viewer?.(),
      device: ut(),
      firstVisit: f === 0,
      seenCount: f
    });
  }
  function R(d) {
    return P(d.pageUrl, window.location.href);
  }
  function A() {
    n && te(n, { tourId: r.id, index: u });
  }
  function ce() {
    if (i) return;
    i = document.createElement("div"), i.setAttribute("data-tours-player", ""), o = i.attachShadow({ mode: "open" });
    const d = document.createElement("style");
    d.textContent = Ke + Me, o.appendChild(d), p = document.createElement("div"), p.className = "tours-backdrop", p.addEventListener("click", (f) => {
      const b = r.steps[u], x = b ? W(b) : null;
      if (x) {
        const w = x.getBoundingClientRect();
        if (f.clientX >= w.left - m && f.clientX <= w.right + m && f.clientY >= w.top - m && f.clientY <= w.bottom + m) return;
      }
      T();
    }), o.appendChild(p), s = document.createElement("div"), s.className = "tours-spotlight", s.style.borderRadius = `${v}px`, o.appendChild(s), document.body.appendChild(i);
  }
  function J(d) {
    if (!p) return;
    if (!d) {
      p.style.clipPath = "";
      return;
    }
    const f = d.left - m, b = d.top - m, x = d.right + m, w = d.bottom + m;
    p.style.clipPath = `polygon(0 0, 0 100%, ${f}px 100%, ${f}px ${b}px, ${x}px ${b}px, ${x}px ${w}px, ${f}px ${w}px, ${f}px 100%, 100% 100%, 100% 0)`;
  }
  function q(d) {
    return d.overlay !== !1;
  }
  function je(d) {
    const f = q(d);
    p && (p.style.display = f ? "" : "none"), s?.classList.toggle("tours-spotlight--plain", !f);
  }
  function pe(d, f = !1) {
    s && (s.style.transitionDuration = f ? "0ms" : "", s.style.display = "block", s.style.left = `${d.left - m}px`, s.style.top = `${d.top - m}px`, s.style.width = `${d.width + m * 2}px`, s.style.height = `${d.height + m * 2}px`);
  }
  function ue(d, f) {
    if (!l) return;
    const b = {
      top: d.top - m,
      left: d.left - m,
      right: d.right + m,
      bottom: d.bottom + m,
      width: d.width + m * 2,
      height: d.height + m * 2
    }, { top: x, left: w } = Ne({
      target: b,
      card: { width: l.offsetWidth, height: l.offsetHeight },
      side: f.placement ?? "bottom",
      align: f.align ?? "center",
      offset: Be,
      alignOffset: r.display?.alignOffset ?? 0,
      viewport: { width: window.innerWidth, height: window.innerHeight }
    });
    l.style.left = `${w}px`, l.style.top = `${x}px`;
  }
  function Ve(d) {
    const f = Math.max(1, r.steps.length - k), b = Math.max(1, Math.min(u + 1 - k, f));
    l && l.remove();
    const x = u === r.steps.length - 1, w = r.steps[u - 1], M = !!w && R(w), Ye = !z(d) || x;
    l = Re({
      contentText: d.content.default,
      progress: `Step ${b} of ${f}`,
      showClose: !0,
      onClose: qe,
      radius: E,
      back: M ? { label: d.backLabel ?? "Back", onClick: Q } : void 0,
      next: Ye ? {
        label: d.nextLabel ?? (x ? "Done" : "Next"),
        primary: !0,
        onClick: K
      } : void 0
    }), o?.appendChild(l);
  }
  function $() {
    if (!g) return;
    const d = r.steps[u];
    if (!d) {
      T();
      return;
    }
    if (t.log("render step", u, d.id), !Ue(d)) {
      t.log(`step "${d.id}" skipped: condition not met`), C(e.on, "stepSkipped", { tour: r, index: u, step: d, reason: "condition" }), k += 1, u < r.steps.length - 1 ? (u += 1, $()) : T(k >= r.steps.length ? "dismissed" : "completed");
      return;
    }
    const f = W(d);
    if (!f) {
      t.log(`step "${d.id}" target not found yet — waiting`, d.selectors), it(d.selectors, { timeout: 4e3 }).then((x) => {
        !g || r.steps[u] !== d || (x ? $() : (t.warn(`step "${d.id}" skipped: no element for selectors`, d.selectors), C(e.on, "stepSkipped", { tour: r, index: u, step: d, reason: "no-element" }), k += 1, u < r.steps.length - 1 ? (u += 1, $()) : T()));
      });
      return;
    }
    ce(), f.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" }), Ve(d);
    const b = oe(f) ?? f.getBoundingClientRect();
    pe(b), ue(b, d), je(d), J(q(d) && z(d) ? b : null), He(d), C(e.on, "stepActivated", { tour: r, index: u, step: d, target: f });
  }
  function He(d) {
    if (c?.(), c = null, !z(d)) return;
    const f = u + 1, b = r.steps[f];
    !b || R(b) || (c = Ce(() => {
      !g || r.steps[u] !== d || P(b.pageUrl, window.location.href) && G(f) && (c?.(), c = null, t.log("visitor navigated → advancing to", b.id), u = f, A(), $());
    }));
  }
  function he(d) {
    g && (d.key === "Escape" ? (d.preventDefault(), T()) : d.key === "ArrowRight" ? K() : d.key === "ArrowLeft" && Q());
  }
  function F() {
    if (!g) return;
    const d = r.steps[u];
    if (!d) return;
    const f = W(d);
    if (!f) return;
    const b = oe(f);
    if (!b) {
      We();
      return;
    }
    pe(b, !0), ue(b, d), J(q(d) && z(d) ? b : null), l && (l.style.visibility = "");
  }
  function We() {
    s && (s.style.display = "none"), l && (l.style.visibility = "hidden"), J(null);
  }
  function fe(d = 0) {
    if (g || r.steps.length === 0) return;
    if (!e.allowWhileEditing && Et()) {
      t.log(`start suppressed for "${r.id}" — the builder is mounted`);
      return;
    }
    const f = Math.max(0, Math.min(d, r.steps.length - 1));
    if (!C(e.on, "tourStarting", { tour: r, index: f })) {
      t.log("start vetoed by handler");
      return;
    }
    Y(), g = !0, u = f, k = 0, t.log("start", r.id, `at ${u}/${r.steps.length}`), ce(), window.addEventListener("keydown", he, !0), window.addEventListener("resize", F, !0), window.addEventListener("scroll", F, !0), A(), C(e.on, "tourStarted", { tour: r, index: u }), $();
  }
  function Je() {
    s && (s.style.display = "none"), l && (l.remove(), l = null);
  }
  function I() {
    Je(), !y && (y = Ce(() => {
      if (!g) {
        y?.(), y = null;
        return;
      }
      const d = r.steps[u];
      d && R(d) && (y?.(), y = null, $());
    }));
  }
  function X() {
    y && (y(), y = null), c && (c(), c = null), g && (g = !1, window.removeEventListener("keydown", he, !0), window.removeEventListener("resize", F, !0), window.removeEventListener("scroll", F, !0), i && i.parentNode && i.parentNode.removeChild(i), i = null, o = null, s = null, l = null, p = null);
  }
  function T(d = "dismissed") {
    t.log("stop", d);
    const f = g, b = u;
    Y(), X(), n && mt(n), f && (d === "completed" ? C(e.on, "tourCompleted", { tour: r }) : C(e.on, "tourDismissed", { tour: r, index: b }));
  }
  function Y() {
    h?.(), h = null;
  }
  function qe() {
    r.dismiss?.mode === "minimize" ? ge() : T();
  }
  function ge() {
    g && (t.log("minimized", r.id, `at ${u}`), X(), n && te(n, { tourId: r.id, index: u, minimized: !0 }), C(e.on, "tourMinimized", { tour: r, index: u }), Xe());
  }
  function Xe() {
    Y();
    const d = r.dismiss?.resume;
    h = yt(
      {
        tourId: r.id,
        text: d?.text ?? "Carry on with the tour?",
        button: d?.button ?? "Resume",
        corner: d?.corner,
        offset: d?.offset,
        onResume: () => {
          h = null, n && te(n, { tourId: r.id, index: u }), C(e.on, "tourResumed", { tour: r, index: u }), fe(u);
        }
      },
      e.renderResume
    );
  }
  function G(d) {
    const f = r.steps[d];
    return f ? C(e.on, "stepChanging", { tour: r, from: u, to: d, step: f }) : !0;
  }
  function K() {
    if (!g) return;
    const d = u + 1, f = r.steps[d];
    if (!f) {
      T("completed");
      return;
    }
    if (!G(d)) {
      t.log("step change vetoed by handler");
      return;
    }
    if (R(f)) {
      u = d, A(), $();
      return;
    }
    u = d, A();
    const b = (M) => {
      X(), e.onNavigate ? e.onNavigate(M, f.id) : window.location.assign(M);
    }, x = r.steps[u - 1]?.action;
    if (x && x.type === "navigate" && x.url) {
      x.url.startsWith("#") ? (t.log("page transition (hash navigate) → resume at", u), I(), window.location.hash = x.url) : (t.log("page transition (navigate) → resume at", u), b(x.url));
      return;
    }
    const w = Oe(f.pageUrl);
    if (w) {
      w.startsWith("#") ? (t.log("page transition (derived hash) → resume at", u), I(), window.location.hash = w) : (t.log("page transition (derived navigate) → resume at", u, w), b(w));
      return;
    }
    t.log("page transition (wait) → resume at", u), I();
  }
  function Q() {
    if (!g) return;
    const d = r.steps[u - 1];
    if (d) {
      if (!G(u - 1)) {
        t.log("step change vetoed by handler");
        return;
      }
      if (R(d)) {
        u -= 1, A(), $();
        return;
      }
      u -= 1, A(), t.log("page transition back → resume at", u), I(), window.history.back();
    }
  }
  return { start: fe, stop: T, next: K, prev: Q, minimize: ge, isActive: () => g };
}
const Ct = `
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
.selpop__add + .selpop__add { margin-top: 6px; }
.selpop__page {
  display: block;
  width: 100%;
  text-align: left;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 11px;
  color: var(--e-fg);
  background: transparent;
  border: none;
  border-radius: 6px;
  padding: 5px 6px;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.selpop__page:hover { background: var(--e-surface); }

/* Visitor tags: a row of toggles, not a form. */
.tags { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 6px; }
.tags__chip {
  font: inherit;
  font-size: 11px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  color: var(--e-muted);
  background: var(--e-surface);
  border: 1px solid var(--e-border);
  border-radius: 999px;
  padding: 3px 10px;
  cursor: pointer;
}
.tags__chip:hover { color: var(--e-fg); border-color: var(--e-accent); }
.tags__chip--on {
  color: #fff;
  background: var(--e-accent);
  border-color: var(--e-accent);
}
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
`, ae = {
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
let Lt = 0;
function N(r) {
  const e = typeof crypto < "u" && "randomUUID" in crypto ? crypto.randomUUID() : `${Lt++}`;
  return `${r}-${e}`;
}
function H(r = "step") {
  return {
    id: N("step"),
    type: r,
    included: !0,
    selectors: [],
    content: "",
    page: "",
    placement: "auto",
    align: "center",
    backLabel: "Back",
    nextLabel: "Next",
    overlay: !0
  };
}
function ne(r = "tour") {
  return {
    id: N(r),
    kind: r,
    name: r === "template" ? "Untitled template" : "Untitled tour",
    status: "draft",
    trigger: { type: "manual" },
    conditions: { firstVisitOnly: !0, maxShows: 0, device: "any", tags: [] },
    dismissMode: "end",
    resumeText: "",
    resumeButton: "",
    steps: [H()],
    display: {
      padding: B,
      radius: U,
      cardRadius: j,
      offset: V,
      alignOffset: 0
    }
  };
}
function Le(r, e, t) {
  return {
    id: N(e),
    kind: e,
    name: t ?? r.name,
    status: "draft",
    trigger: { ...r.trigger },
    conditions: { ...r.conditions, tags: [...r.conditions.tags] },
    dismissMode: r.dismissMode ?? "end",
    resumeText: r.resumeText ?? "",
    resumeButton: r.resumeButton ?? "",
    steps: r.steps.map((n) => ({ ...n, id: N("step"), selectors: [...n.selectors] })),
    display: { ...r.display }
  };
}
function Fe(r) {
  if (r && typeof r == "object") {
    const e = r;
    if (e.type === "load") return { type: "load" };
    if (e.type === "selector" && typeof e.selector == "string") return { type: "selector", selector: e.selector };
    if (e.type === "timer" && typeof e.delay == "number") return { type: "timer", delay: e.delay };
    if (e.type === "cta" && typeof e.text == "string" && typeof e.button == "string") {
      const t = ["bottom-right", "bottom-left", "top-right", "top-left"];
      return {
        type: "cta",
        text: e.text,
        button: e.button,
        corner: t.includes(e.corner) ? e.corner : "bottom-right",
        offset: typeof e.offset == "number" ? e.offset : void 0
      };
    }
  }
  return { type: "manual" };
}
function de(r) {
  if (!Array.isArray(r)) return [];
  const e = [];
  for (const t of r) {
    if (!t || typeof t != "object") continue;
    const n = t;
    typeof n.id != "string" || !Array.isArray(n.steps) || e.push({
      id: n.id,
      kind: n.kind === "template" ? "template" : "tour",
      name: typeof n.name == "string" ? n.name : "Untitled tour",
      status: n.status === "published" ? "published" : "draft",
      trigger: Fe(n.trigger),
      dismissMode: n.dismissMode === "minimize" ? "minimize" : "end",
      resumeText: typeof n.resumeText == "string" ? n.resumeText : "",
      resumeButton: typeof n.resumeButton == "string" ? n.resumeButton : "",
      conditions: {
        firstVisitOnly: (n.conditions?.firstVisitOnly ?? !0) === !0,
        maxShows: S(n.conditions?.maxShows, 0),
        device: ["mobile", "tablet", "desktop"].includes(n.conditions?.device) ? n.conditions.device : "any",
        tags: Tt(n.conditions?.tags)
      },
      display: {
        padding: S(n.display?.padding, B),
        radius: S(n.display?.radius, U),
        cardRadius: S(n.display?.cardRadius, j),
        offset: S(n.display?.offset, V),
        alignOffset: S(n.display?.alignOffset, 0)
      },
      steps: n.steps.filter((i) => !!i && typeof i == "object").map((i) => ({
        ...H(i.type === "action" ? "action" : "step"),
        ...i
      }))
    });
  }
  return e;
}
function S(r, e) {
  return typeof r == "number" && r >= 0 ? r : e;
}
function Ie(r) {
  const e = r.steps.filter((i) => i.included && i.selectors.length > 0).map((i) => ({
    id: i.id,
    selectors: i.selectors,
    content: { default: i.content },
    placement: i.placement,
    align: i.align,
    backLabel: i.backLabel,
    nextLabel: i.nextLabel,
    ...i.page ? { pageUrl: { glob: i.page } } : {},
    ...i.action ? { action: i.action } : {},
    // Only emitted when it differs from the default, to keep stored tours lean.
    ...i.overlay === !1 ? { overlay: !1 } : {},
    ...i.condition && Object.keys(i.condition).length > 0 ? { condition: i.condition } : {}
  })), t = {};
  r.conditions.firstVisitOnly && (t.firstVisitOnly = !0), r.conditions.maxShows > 0 && (t.maxShows = r.conditions.maxShows), r.conditions.device !== "any" && (t.device = r.conditions.device), r.conditions.tags.length > 0 && (t.tags = [...r.conditions.tags]);
  const n = Object.keys(t).length > 0 ? [{ when: t }] : void 0;
  return {
    id: r.id,
    schemaVersion: st,
    title: { default: r.name },
    steps: e,
    trigger: r.trigger,
    ...n ? { rules: n } : {},
    // Only emitted when it differs from the default, so stored tours stay lean.
    ...r.dismissMode === "minimize" ? {
      dismiss: {
        mode: "minimize",
        ...r.resumeText || r.resumeButton ? {
          resume: {
            text: r.resumeText || "Carry on with the tour?",
            button: r.resumeButton || "Resume"
          }
        } : {}
      }
    } : {},
    display: {
      padding: r.display.padding,
      radius: r.display.radius,
      cardRadius: r.display.cardRadius,
      offset: r.display.offset,
      alignOffset: r.display.alignOffset
    }
  };
}
function $t(r) {
  return lt(Ie(r));
}
function Tt(r) {
  return Array.isArray(r) ? Array.from(new Set(r.filter((e) => typeof e == "string" && e.length > 0))) : [];
}
function At(r) {
  if (!r || typeof r != "object") return !1;
  const e = r;
  return "schemaVersion" in e || typeof e.title == "object" && e.title !== null;
}
function Pt(r) {
  const e = r.rules && r.rules[0]?.when || {}, t = e.device;
  return {
    id: typeof r.id == "string" && r.id ? r.id : N("tour"),
    kind: "tour",
    name: r.title?.default ?? "Imported tour",
    status: "draft",
    trigger: Fe(r.trigger),
    // Round-trips the dismiss policy, so importing then re-exporting a tour
    // does not quietly drop it.
    dismissMode: r.dismiss?.mode === "minimize" ? "minimize" : "end",
    resumeText: r.dismiss?.resume?.text ?? "",
    resumeButton: r.dismiss?.resume?.button ?? "",
    conditions: {
      firstVisitOnly: e.firstVisitOnly === !0,
      maxShows: S(e.maxShows, 0),
      device: t === "mobile" || t === "tablet" || t === "desktop" ? t : "any",
      tags: [...e.tags ?? []]
    },
    display: {
      padding: S(r.display?.padding, B),
      radius: S(r.display?.radius, U),
      cardRadius: S(r.display?.cardRadius, j),
      offset: S(r.display?.offset, V),
      alignOffset: S(r.display?.alignOffset, 0)
    },
    steps: (Array.isArray(r.steps) ? r.steps : []).map((n) => ({
      ...H("step"),
      id: typeof n.id == "string" && n.id ? n.id : N("step"),
      selectors: Array.isArray(n.selectors) ? n.selectors.filter((i) => typeof i == "string") : [],
      content: typeof n.content?.default == "string" ? n.content.default : "",
      page: n.pageUrl?.glob ?? "",
      placement: n.placement ?? "auto",
      align: n.align ?? "center",
      overlay: n.overlay !== !1,
      ...n.condition ? { condition: n.condition } : {},
      backLabel: n.backLabel ?? "Back",
      nextLabel: n.nextLabel ?? "Next",
      ...n.action ? { action: n.action } : {},
      // Only emitted when it differs from the default, to keep stored tours lean.
      ...n.overlay === !1 ? { overlay: !1 } : {},
      ...n.condition && Object.keys(n.condition).length > 0 ? { condition: n.condition } : {}
    }))
  };
}
function Nt(r) {
  const e = Array.isArray(r) ? r : [r], t = [];
  for (const n of e)
    if (At(n))
      t.push(Pt(n));
    else {
      const [i] = de([n]);
      i && t.push(i);
    }
  return t;
}
function Rt(r = "tours:drafts") {
  return {
    async load() {
      try {
        const e = localStorage.getItem(r);
        return e ? de(JSON.parse(e)) : null;
      } catch {
        return null;
      }
    },
    async save(e) {
      try {
        localStorage.setItem(r, JSON.stringify(e));
      } catch {
      }
    }
  };
}
function Ut(r) {
  const e = { "Content-Type": "application/json" };
  return r.nonce && (e["X-WP-Nonce"] = r.nonce), {
    async load() {
      const t = await fetch(r.url, { headers: e, credentials: "same-origin" });
      if (!t.ok) throw new Error(`WordPress load failed: ${t.status}`);
      return de(await t.json());
    },
    async save(t) {
      const n = await fetch(r.url, {
        method: "POST",
        headers: e,
        credentials: "same-origin",
        body: JSON.stringify(t)
      });
      if (!n.ok) throw new Error(`WordPress save failed: ${n.status}`);
    }
  };
}
const Mt = ["/sitemap.xml", "/sitemap_index.xml", "/wp-sitemap.xml", "/sitemap-index.xml"], Ot = 5, re = 2e3;
let $e = null;
function Te(r) {
  const e = [], t = /<loc>\s*([^<\s]+)\s*<\/loc>/gi;
  let n;
  for (; (n = t.exec(r)) !== null; ) e.push(n[1]);
  return e;
}
async function Ae(r) {
  try {
    const e = await fetch(r, { credentials: "same-origin" });
    if (!e.ok) return null;
    const t = await e.text();
    return t.includes("<loc>") ? t : null;
  } catch {
    return null;
  }
}
function zt() {
  return $e ?? ($e = (async () => {
    for (const r of Mt) {
      const e = await Ae(new URL(r, window.location.origin).href);
      if (!e) continue;
      const t = Te(e);
      if (!/<sitemapindex/i.test(e)) return t.slice(0, re);
      const i = [];
      for (const o of t.slice(0, Ot)) {
        const s = await Ae(o);
        if (s && i.push(...Te(s)), i.length >= re) break;
      }
      return i.slice(0, re);
    }
    return [];
  })()), $e;
}
function Ft(r, e, t = 8) {
  const n = e.trim().toLowerCase();
  return n ? r.filter((i) => i.toLowerCase().includes(n)).sort((i, o) => i.length - o.length).slice(0, t) : [...r].sort((i, o) => i.length - o.length).slice(0, t);
}
function It(r) {
  const e = r.trim().replace(/[*\s]+$/, "");
  return e ? `${e}*` : "";
}
const ie = "tours-resume";
function a(r, e = {}, t = []) {
  const n = document.createElement(r);
  for (const [i, o] of Object.entries(e)) n.setAttribute(i, o);
  for (const i of t) n.append(typeof i == "string" ? document.createTextNode(i) : i);
  return n;
}
function _(r, e, t = "") {
  const n = a("button", { class: `iconbtn ${t}`.trim(), title: e, type: "button" });
  return n.innerHTML = ae[r] ?? "", n;
}
function Dt(r) {
  switch (r) {
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
function Bt(r) {
  switch (r) {
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
class De {
  constructor(e = {}) {
    this.options = e, this.log = le("editor"), this.host = null, this.root = null, this.tours = [ne()], this.openTourId = this.tours[0].id, this.view = "edit", this.listFilter = "tour", this.menuOpen = !1, this.activeStepId = this.tours[0].steps[0]?.id ?? null, this.tab = "steps", this.displaySub = "tour", this.openSections = /* @__PURE__ */ new Set(), this.mode = "build", this.picker = null, this.picking = !1, this.pickAppend = !1, this.selectorEditorFor = null, this.pageEditorFor = null, this.pages = null, this.pageQuery = "", this.dragFrom = null, this.player = null, this.highlight = null, this.cardPreview = null, this.focusStepId = null, this.onViewportChange = () => this.updateOverlays(!0), this.saveTimer = null, this.navPosition = e.navPosition ?? "bottom", this.panelPosition = e.panelPosition ?? "right", this.topOffset = Math.max(0, e.topOffset ?? 0), this.local = e.store ?? Rt(e.storageKey), this.secondary = e.storage ?? null;
  }
  /**
   * Auto-mount when the page URL carries the flag (default `?tours-edit=1`), so
   * a site owner can enable the builder without touching code. Returns the
   * instance if mounted, otherwise null.
   */
  static fromUrl(e = {}) {
    const t = e.urlFlag ?? "tours-edit", n = new URLSearchParams(window.location.search).get(t);
    if (n === null || n === "0" || n === "false") return null;
    const i = new De(e);
    return i.mount(), i;
  }
  /** Render the UI onto the page. Idempotent. */
  mount() {
    if (this.host || this.options.mode === "off") return;
    this.host = a("div", { "data-tours-editor": "" }), this.host.style.setProperty("--e-top", `${this.topOffset}px`), this.root = this.host.attachShadow({ mode: "open" });
    const e = document.createElement("style");
    e.textContent = Ct + Me, this.root.appendChild(e), this.highlight = a("div", { class: "highlight" }), this.root.append(this.highlight), document.body.appendChild(this.host), window.addEventListener("scroll", this.onViewportChange, !0), window.addEventListener("resize", this.onViewportChange, !0), this.log.log("mounted"), this.render(), this.hydrate();
  }
  /** Load stored drafts (localStorage by default) and show them. */
  async hydrate() {
    const e = await this.local.load();
    e && e.length > 0 && (this.tours = e, this.openTourId = e[0].id, this.activeStepId = e[0].steps[0]?.id ?? null, this.log.log("hydrated", `${e.length} tour(s)`)), this.applyResume() || this.render();
  }
  /** Debounce a save so rapid edits (typing, dragging a slider) coalesce. */
  markDirty() {
    this.saveTimer !== null && clearTimeout(this.saveTimer), this.saveTimer = setTimeout(() => {
      this.saveTimer = null, this.persist();
    }, 400);
  }
  /** Always write localStorage; also try the secondary strategy best-effort. */
  async persist() {
    const e = this.tours;
    if (await this.local.save(e), this.secondary)
      try {
        await this.secondary.save(e);
      } catch (t) {
        this.log.warn("secondary store save failed (localStorage kept the draft)", t);
      }
  }
  /** Remove the UI and any active picker/player. */
  destroy() {
    this.stopPicking(), this.player?.stop(), this.player = null, this.saveTimer !== null && (clearTimeout(this.saveTimer), this.saveTimer = null, this.persist()), window.removeEventListener("scroll", this.onViewportChange, !0), window.removeEventListener("resize", this.onViewportChange, !0), this.host?.parentNode && this.host.parentNode.removeChild(this.host), this.host = null, this.root = null, this.highlight = null, this.cardPreview = null;
  }
  /** The current draft as a validated tour (or validation errors). */
  export() {
    return $t(this.tour);
  }
  // ---------- state mutations ----------
  /** The currently open tour (falls back to the first if the id is stale). */
  get tour() {
    return this.tours.find((e) => e.id === this.openTourId) ?? this.tours[0];
  }
  get activeStep() {
    return this.tour.steps.find((e) => e.id === this.activeStepId) ?? null;
  }
  /** Open a tour for editing and reset the active step to its first. */
  openTour(e) {
    this.openTourId = e, this.view = "edit", this.tab = "steps", this.activeStepId = this.tour.steps[0]?.id ?? null, this.render();
  }
  /** Create a fresh entity of the currently listed kind (tour or template). */
  createEntity() {
    const e = ne(this.listFilter);
    this.tours.push(e), this.openTour(e.id);
  }
  deleteEntity(e) {
    const t = this.tours.findIndex((n) => n.id === e);
    t !== -1 && (this.tours.splice(t, 1), this.tours.some((n) => n.kind === "tour") || this.tours.push(ne()), this.openTourId === e && (this.openTourId = this.tours[0].id), this.render());
  }
  /** Copy the open tour into a new template and jump to the Templates list. */
  saveAsTemplate() {
    const e = Le(this.tour, "template", `${this.tour.name} (template)`);
    this.tours.push(e), this.listFilter = "template", this.view = "list", this.menuOpen = !1, this.log.log("saved as template", e.id), this.render();
  }
  /** Create a new tour from a template and open it for editing. */
  createFromTemplate(e) {
    const t = this.tours.find((i) => i.id === e);
    if (!t) return;
    const n = Le(t, "tour", t.name.replace(/\s*\(template\)\s*$/, ""));
    this.tours.push(n), this.openTour(n.id);
  }
  setActive(e) {
    this.activeStepId !== e && (this.activeStepId = e, this.render());
  }
  addStepAfter(e, t = "step") {
    const n = H(t);
    n.page = this.currentPage(), this.tour.steps.splice(e + 1, 0, n), this.activeStepId = n.id, t === "step" && !this.picking ? this.togglePicking() : this.render(), this.revealStep(n.id);
  }
  /** Scroll the panel so a step's card is visible. Runs after render(). */
  revealStep(e) {
    const t = this.root?.querySelector(`.card[data-step-id="${CSS.escape(e)}"]`);
    if (!t) return;
    const n = t.closest(".panel__body");
    if (n && this.tour.steps[this.tour.steps.length - 1]?.id === e) {
      n.scrollTo({ top: n.scrollHeight, behavior: "smooth" });
      return;
    }
    t.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }
  /** A URL glob for the current page (matches its query/hash variations). */
  currentPage() {
    return `${window.location.origin}${window.location.pathname}*`;
  }
  removeStep(e) {
    const t = this.tour.steps.findIndex((n) => n.id === e);
    t !== -1 && (this.tour.steps.splice(t, 1), this.activeStepId === e && (this.activeStepId = this.tour.steps[Math.max(0, t - 1)]?.id ?? null), this.render());
  }
  // ---------- picker (selector search) ----------
  togglePicking(e = !1) {
    if (this.picking) {
      this.stopPicking();
      return;
    }
    const t = this.activeStep;
    t && (this.picking = !0, this.pickAppend = e, this.picker = ot(
      (n) => {
        if (this.pickAppend)
          for (const i of n) t.selectors.includes(i) || t.selectors.push(i);
        else
          t.selectors = n;
        t.page || (t.page = this.currentPage()), this.picking = !1, this.pickAppend = !1, this.picker = null, this.log.log("bound selector to step", t.id, n), this.render();
      },
      { ignore: [this.host] }
    ), this.picker.start(), this.render());
  }
  stopPicking() {
    this.picker?.stop(), this.picker = null, this.picking = !1, this.pickAppend = !1;
  }
  // ---------- preview ----------
  togglePreview() {
    if (this.mode === "preview") {
      this.player?.stop(), this.player = null, this.mode = "build", this.render();
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
  startPreview(e) {
    const t = this.export();
    if (!t.ok)
      return this.log.warn("cannot preview — draft is invalid", t.errors), e || window.alert(`Add a selector and text to at least one step first:

${t.errors.join(`
`)}`), !1;
    this.mode = "preview", this.render(), this.player = St(t.tour, {
      onNavigate: (i, o) => this.navigateForResume(i, o, "preview"),
      // The player refuses to start while the builder is mounted, so that a
      // host app's own tours do not stack under it. This preview *is* the
      // builder, so it opts out.
      allowWhileEditing: !0
    });
    const n = e ? t.tour.steps.findIndex((i) => i.id === e) : 0;
    return this.player.start(Math.max(0, n)), !0;
  }
  /**
   * Flush the draft, then navigate to `url` with a resume token so the builder
   * re-opens on `stepId` (and resumes preview when `mode` is 'preview') after
   * the page reloads. Used for cross-page Next in both build and preview.
   */
  async navigateForResume(e, t, n) {
    this.saveTimer !== null && (clearTimeout(this.saveTimer), this.saveTimer = null), await this.persist();
    const i = new URL(e, window.location.href);
    i.searchParams.set(ie, `${n}~${this.openTourId}~${t}`), this.log.log("navigating for resume", i.toString()), window.location.assign(i.toString());
  }
  /**
   * Consume a resume token from the URL (see RESUME_PARAM): reopen the tour on
   * the referenced step and, for preview, restart playback there. Strips the
   * param so a manual refresh will not re-trigger it. Returns true when it
   * handled a resume (and rendered), false to let the caller render normally.
   */
  applyResume() {
    const e = new URLSearchParams(window.location.search), t = e.get(ie);
    if (!t) return !1;
    e.delete(ie);
    const n = e.toString(), i = window.location.pathname + (n ? `?${n}` : "") + window.location.hash;
    window.history.replaceState(window.history.state, "", i);
    const [o, s, l] = t.split("~"), p = this.tours.find((c) => c.id === s);
    return p ? (this.openTourId = p.id, this.view = "edit", this.activeStepId = l, o === "preview" && this.startPreview(l) || (this.tab = "steps", this.render()), !0) : !1;
  }
  // ---------- rendering ----------
  render() {
    if (!this.root) return;
    const e = this.root.querySelector(".panel__body")?.scrollTop ?? 0;
    this.root.querySelectorAll(".panel, .nav").forEach((n) => n.remove()), this.mode === "build" && this.root.appendChild(this.renderPanel()), this.root.appendChild(this.renderNav());
    const t = this.root.querySelector(".panel__body");
    t && e && (t.scrollTop = e), this.focusStepId && (this.focusContent(this.focusStepId), this.focusStepId = null), this.updateOverlays(), this.markDirty();
  }
  /** Resolve a step's target on the page, trying each candidate selector. */
  resolveTarget(e) {
    return D(e.selectors);
  }
  /**
   * Draw the dashed outline around the active step's target, and (in the Card
   * sub-tab) a live tooltip-card preview beside it. Both use the same
   * tour-level values the player reads. Shown only in build mode when the
   * active step resolves; hidden while picking or in preview. No backdrop.
   */
  updateOverlays(e = !1) {
    const t = this.highlight;
    if (!t) return;
    const n = () => {
      t.style.display = "none", this.removeCardPreview();
    };
    if (this.view !== "edit" || this.mode !== "build" || this.picking) return n();
    const i = this.activeStep, o = i && i.selectors.length > 0 ? this.resolveTarget(i) : null;
    if (!i || !o) return n();
    const s = oe(o);
    if (!s) return n();
    const { padding: l, radius: p, cardRadius: c } = this.tour.display;
    t.className = `highlight ${this.tab === "styles" ? "highlight--settings" : ""}`.trim(), t.style.transitionDuration = e ? "0ms" : "", t.style.display = "block", t.style.left = `${s.left - l}px`, t.style.top = `${s.top - l}px`, t.style.width = `${s.width + l * 2}px`, t.style.height = `${s.height + l * 2}px`, t.style.borderRadius = `${p}px`, this.drawStepCard(i, s, c);
  }
  removeCardPreview() {
    this.cardPreview && (this.cardPreview.remove(), this.cardPreview = null);
  }
  /**
   * Render the active step's card near its target via the shared renderCard —
   * the exact markup the player uses. Shown when the step has content; in the
   * Card sub-tab a muted placeholder shows so the radius stays visible first.
   */
  drawStepCard(e, t, n) {
    const i = e.content.trim(), o = this.tab === "styles" && this.displaySub === "card";
    if (!i && !o) {
      this.removeCardPreview();
      return;
    }
    const s = this.tour.steps, l = s.indexOf(e), p = (y) => () => {
      const m = s[y];
      if (m) {
        if (m.page && !P({ glob: m.page }, window.location.href)) {
          const v = Oe({ glob: m.page });
          if (v) {
            this.navigateForResume(v, m.id, "build");
            return;
          }
        }
        this.setActive(m.id);
      }
    }, c = Re({
      ghost: !0,
      contentText: i || "Step tooltip preview",
      progress: `Step ${l + 1} of ${s.length}`,
      showClose: !0,
      onClose: () => {
        this.activeStepId = null, this.render();
      },
      radius: n,
      back: { label: e.backLabel, disabled: l <= 0, onClick: p(l - 1) },
      next: { label: e.nextLabel, primary: !0, disabled: l >= s.length - 1, onClick: p(l + 1) }
    });
    if (!i) {
      const y = c.querySelector(".tours-card__content");
      y && (y.style.opacity = "0.55");
    }
    this.removeCardPreview(), this.cardPreview = c, this.root?.appendChild(c);
    const h = this.tour.display.padding, g = {
      top: t.top - h,
      left: t.left - h,
      right: t.right + h,
      bottom: t.bottom + h,
      width: t.width + h * 2,
      height: t.height + h * 2
    }, { top: u, left: k } = Ne({
      target: g,
      card: { width: c.offsetWidth, height: c.offsetHeight },
      side: e.placement,
      align: e.align,
      offset: this.tour.display.offset,
      alignOffset: this.tour.display.alignOffset,
      viewport: { width: window.innerWidth, height: window.innerHeight }
    });
    c.style.left = `${k}px`, c.style.top = `${u}px`;
  }
  renderNav() {
    const e = a("div", { class: `nav nav--${this.navPosition}` }), t = _("build", "Build", this.mode === "build" ? "iconbtn--active" : "");
    t.addEventListener("click", () => {
      this.mode === "preview" && this.togglePreview();
    });
    const n = _("preview", "Preview", this.mode === "preview" ? "iconbtn--active" : "");
    n.addEventListener("click", () => this.togglePreview());
    const i = _("navFlip", "Move bar (top/bottom)");
    i.addEventListener("click", () => {
      this.navPosition = this.navPosition === "bottom" ? "top" : "bottom", this.render();
    });
    const o = _("close", "Close builder");
    return o.addEventListener("click", () => this.destroy()), e.append(t, n, a("div", { class: "nav__sep" }), i, o), e;
  }
  renderPanel() {
    const e = a("div", { class: `panel panel--${this.panelPosition}` });
    return this.view === "list" ? e.append(this.renderListHeader(), this.renderList()) : e.append(this.renderHeader(), this.renderToolbar(), this.renderTabs(), this.renderBody()), e;
  }
  renderListHeader() {
    const e = a("div", { class: "panel__header" }), t = a("div", { class: "listtabs" });
    for (const [s, l] of [["tour", "Tours"], ["template", "Templates"]]) {
      const p = a("button", {
        class: `listtab ${this.listFilter === s ? "listtab--active" : ""}`.trim(),
        type: "button"
      }, [l]);
      p.addEventListener("click", () => {
        this.listFilter = s, this.render();
      }), t.append(p);
    }
    const n = _("download", `Download all ${this.listFilter === "template" ? "templates" : "tours"} as JSON`);
    n.addEventListener("click", () => this.downloadAll());
    const i = _("upload", "Import tours from JSON");
    i.addEventListener("click", () => this.importJson());
    const o = a("button", { class: "newtour", type: "button", title: "New" }, ["+ New"]);
    return o.addEventListener("click", () => this.createEntity()), e.append(t, n, i, o), e;
  }
  renderList() {
    const e = a("div", { class: "panel__body" }), t = a("div", { class: "tourlist" }), n = this.tours.filter((i) => i.kind === this.listFilter);
    return n.length === 0 ? (e.append(
      a("div", { class: "assets-empty" }, [
        this.listFilter === "template" ? "No templates yet." : "No tours yet."
      ])
    ), e) : (n.forEach((i) => {
      const o = a("div", { class: "tourrow" });
      o.addEventListener("click", () => this.openTour(i.id));
      const s = a("div", { class: "tourrow__main" });
      if (s.append(
        a("div", { class: "tourrow__name" }, [i.name]),
        a("div", { class: "tourrow__meta" }, [
          `${i.steps.length} step${i.steps.length === 1 ? "" : "s"}`
        ])
      ), o.append(s), i.kind === "template") {
        const p = a("button", { class: "tourrow__use", type: "button", title: "Create a tour from this template" }, ["Use"]);
        p.addEventListener("click", (c) => {
          c.stopPropagation(), this.createFromTemplate(i.id);
        }), o.append(p);
      } else
        o.append(a("span", { class: `status status--${i.status}` }, [i.status]));
      const l = _("trash", "Delete");
      l.addEventListener("click", (p) => {
        p.stopPropagation(), this.deleteEntity(i.id);
      }), o.append(l), t.append(o);
    }), e.append(t), e);
  }
  renderHeader() {
    const e = a("div", { class: "panel__header" }), t = a("input", { class: "panel__title", value: this.tour.name });
    t.value = this.tour.name, t.addEventListener("change", () => {
      this.tour.name = t.value.trim() || "Untitled tour", this.markDirty();
    });
    const n = a("span", { class: `status status--${this.tour.status}` }, [this.tour.status]);
    n.addEventListener("click", () => {
      this.tour.status = this.tour.status === "draft" ? "published" : "draft", this.render();
    }), n.setAttribute("title", "Toggle status"), n.style.cursor = "pointer";
    const i = _("menu", "Menu", this.menuOpen ? "iconbtn--active" : "");
    return i.addEventListener("click", () => {
      this.menuOpen = !this.menuOpen, this.render();
    }), e.append(t, n, i), this.menuOpen && e.append(this.renderMenu()), e;
  }
  /** The ⋯ dropdown: save-as-template (tours only), JSON download and import. */
  renderMenu() {
    const e = a("div", { class: "menu" }), t = (n, i) => {
      const o = a("button", { class: "menu__item", type: "button" }, [n]);
      return o.addEventListener("click", () => {
        this.menuOpen = !1, i();
      }), o;
    };
    return this.tour.kind === "tour" && e.append(t("Save as template", () => this.saveAsTemplate())), e.append(t("Download JSON", () => this.downloadOpenTour())), e.append(t("Import JSON…", () => this.importJson())), e;
  }
  /** Download the given drafts as a schema Tour[] JSON file. */
  downloadJson(e, t) {
    const n = e.map((l) => Ie(l)), i = new Blob([JSON.stringify(n, null, 2)], { type: "application/json" }), o = URL.createObjectURL(i), s = document.createElement("a");
    s.href = o, s.download = t, s.click(), URL.revokeObjectURL(o), this.log.log("downloaded", t, `${n.length} tour(s)`);
  }
  /** Slugify a name into a safe file base (fallback to a generic name). */
  fileBase(e) {
    return e.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "tours";
  }
  /** Download just the currently open tour (as an array of one). */
  downloadOpenTour() {
    this.downloadJson([this.tour], `${this.fileBase(this.tour.name)}.json`);
  }
  /** Download every tour of the kind currently listed (Tours or Templates). */
  downloadAll() {
    const e = this.tours.filter((t) => t.kind === this.listFilter);
    e.length !== 0 && this.downloadJson(e, `${this.listFilter === "template" ? "templates" : "tours"}.json`);
  }
  /**
   * Prompt for a JSON file and merge its tours into the builder. A tour with an
   * id that already exists is replaced; new ids are appended. When an open tour
   * is being edited it stays open (if it survived the import).
   */
  importJson() {
    const e = document.createElement("input");
    e.type = "file", e.accept = "application/json,.json", e.addEventListener("change", () => {
      const t = e.files?.[0];
      t && t.text().then((n) => {
        let i;
        try {
          i = JSON.parse(n);
        } catch {
          window.alert("Could not read that file — it is not valid JSON.");
          return;
        }
        const o = Nt(i);
        if (o.length === 0) {
          window.alert("No tours found in that file.");
          return;
        }
        this.mergeDrafts(o);
      });
    }), e.click();
  }
  /** Merge imported drafts by id (replace existing, append new) and re-render. */
  mergeDrafts(e) {
    for (const t of e) {
      const n = this.tours.findIndex((i) => i.id === t.id);
      n === -1 ? this.tours.push(t) : this.tours[n] = t;
    }
    this.tours.some((t) => t.id === this.openTourId) || (this.openTourId = this.tours[0].id, this.activeStepId = this.tour.steps[0]?.id ?? null), this.log.log("imported", `${e.length} tour(s)`), this.render(), this.persist();
  }
  renderToolbar() {
    const e = a("div", { class: "panel__toolbar" }), t = _("back", "Back to tours");
    t.addEventListener("click", () => {
      this.stopPicking(), this.view = "list", this.render();
    });
    const n = _("panelSide", "Move panel (left/right)");
    n.addEventListener("click", () => {
      this.panelPosition = this.panelPosition === "right" ? "left" : "right", this.render();
    });
    const i = _(
      "cursor",
      this.picking ? "Cancel picking" : "Pick element for active step",
      this.picking ? "iconbtn--active" : ""
    );
    return i.addEventListener("click", () => this.togglePicking()), e.append(t, a("div", { class: "spacer" }), n, i), e;
  }
  renderTabs() {
    const e = a("div", { class: "tabs" });
    for (const [t, n] of [
      ["steps", "Steps"],
      ["styles", "Styles"],
      ["rules", "Rules"]
    ]) {
      const i = a("button", { class: `tab ${this.tab === t ? "tab--active" : ""}`, type: "button" }, [n]);
      i.addEventListener("click", () => {
        this.tab = t, t === "styles" && this.selectFirstResolvableStep(), this.render();
      }), e.append(i);
    }
    return e;
  }
  /** Activate the first step whose selector resolves to an on-page element. */
  selectFirstResolvableStep() {
    const e = this.tour.steps.find((t) => this.resolveTarget(t) !== null);
    e && (this.activeStepId = e.id);
  }
  /**
   * The Display tab: two sub-tabs of tour-level visual settings — Tour (the
   * target outline) and Card (the visitor tooltip) — tuned live.
   */
  renderDisplaySettings() {
    const e = a("div", { class: "settings" }), t = a("div", { class: "subtabs" });
    for (const [i, o] of [["tour", "Tour"], ["card", "Card"]]) {
      const s = a("button", { class: `subtab ${this.displaySub === i ? "subtab--active" : ""}`, type: "button" }, [o]);
      s.addEventListener("click", () => {
        this.displaySub = i, this.render();
      }), t.append(s);
    }
    if (e.append(t), !this.activeStep || !this.resolveTarget(this.activeStep))
      return e.append(
        a("div", { class: "assets-empty" }, [
          "Give a step a selector first — then its target frames here so you can tune the look."
        ])
      ), e;
    const n = this.tour.display;
    return this.displaySub === "tour" ? e.append(
      this.slider("Outline spacing", n.padding, 0, 40, (i) => n.padding = i),
      this.slider("Outline corner radius", n.radius, 0, 40, (i) => n.radius = i),
      a("div", { class: "settings__hint" }, [
        "The outline framing the target — applied in the builder and in the live tour spotlight."
      ])
    ) : e.append(
      this.slider("Card corner radius", n.cardRadius, 0, 32, (i) => n.cardRadius = i),
      this.slider("Distance from target", n.offset, 0, 48, (i) => n.offset = i),
      this.slider("Alignment inset", n.alignOffset, 0, 48, (i) => n.alignOffset = i),
      a("div", { class: "settings__hint" }, [
        "Distance is the gap to the element; alignment inset nudges the card in from the aligned edge (start/end placements)."
      ])
    ), e;
  }
  /** A labelled range slider that writes through `set` and re-draws overlays live. */
  slider(e, t, n, i, o) {
    let s = t;
    const l = a("span", { class: "settings__value", title: "Click to type a value" }, [`${s}px`]), p = a("input", {
      class: "settings__slider",
      type: "range",
      min: String(n),
      max: String(i),
      step: "1"
    });
    p.value = String(s);
    const c = (u) => {
      s = Math.max(n, Math.min(i, Math.round(u))), p.value = String(s), l.textContent = `${s}px`, o(s), this.updateOverlays(), this.markDirty();
    };
    p.addEventListener("input", () => c(Number(p.value))), l.addEventListener("click", () => this.editNumber(l, s, c));
    const h = a("div", { class: "settings__row" });
    h.append(p, l);
    const g = a("div", { class: "settings__field" });
    return g.append(a("label", { class: "settings__label" }, [e]), h), g;
  }
  /** Swap a value label for a digits-only input; commit on blur/Enter. */
  editNumber(e, t, n) {
    const i = a("input", {
      class: "settings__num",
      type: "text",
      inputmode: "numeric"
    });
    i.value = String(t), e.replaceWith(i), i.focus(), i.select(), i.addEventListener("input", () => {
      i.value = i.value.replace(/[^0-9]/g, "");
    });
    const o = () => {
      const s = i.value === "" ? t : Number(i.value);
      i.replaceWith(e), n(s);
    };
    i.addEventListener("blur", o), i.addEventListener("keydown", (s) => {
      s.key === "Enter" && i.blur(), s.key === "Escape" && (i.value = String(t), i.blur());
    });
  }
  renderBody() {
    const e = a("div", { class: "panel__body" });
    if (this.tab === "styles")
      return e.append(this.renderDisplaySettings()), e;
    if (this.tab === "rules")
      return e.append(this.renderRulesBody()), e;
    const t = this.selectorEditorFor ? this.tour.steps.find((o) => o.id === this.selectorEditorFor) : void 0;
    t ? e.append(this.renderSelectorEditor(t)) : this.selectorEditorFor && (this.selectorEditorFor = null);
    const n = this.pageEditorFor ? this.tour.steps.find((o) => o.id === this.pageEditorFor) : void 0;
    n ? e.append(this.renderPageEditor(n)) : this.pageEditorFor && (this.pageEditorFor = null);
    const i = a("div", { class: "steps" });
    return i.append(this.renderConnector(-1)), this.tour.steps.forEach((o, s) => {
      i.append(this.renderCard(o, s)), i.append(this.renderConnector(s));
    }), e.append(i), e;
  }
  /** Rules tab: start trigger, audience, and auto-start conditions. */
  renderRulesBody() {
    const e = a("div", { class: "settings" }), t = this.tour;
    if (e.append(
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
        (n) => {
          t.trigger = Bt(n), this.markDirty(), this.render();
        }
      )
    ), e.append(
      this.selectField(
        "Closing the tour",
        t.dismissMode,
        [
          ["end", "Ends it — progress is cleared"],
          ["minimize", "Sets it aside — offer to carry on"]
        ],
        (n) => {
          t.dismissMode = n === "minimize" ? "minimize" : "end", this.markDirty(), this.render();
        }
      )
    ), t.dismissMode === "minimize" && e.append(
      this.textField("Invitation text", t.resumeText, "Carry on with the tour?", (n) => {
        t.resumeText = n;
      }),
      this.textField("Button label", t.resumeButton, "Resume", (n) => {
        t.resumeButton = n;
      }),
      a("div", { class: "settings__hint" }, [
        "A set-aside tour never restarts on its own — the visitor has to accept the invitation."
      ])
    ), t.trigger.type === "selector")
      e.append(
        this.textField("Element selector (CSS)", t.trigger.selector, "#start, .cta", (n) => {
          t.trigger.type === "selector" && (t.trigger.selector = n);
        })
      );
    else if (t.trigger.type === "timer")
      e.append(
        this.textField("Delay (ms)", String(t.trigger.delay), "3000", (n) => {
          t.trigger.type === "timer" && (t.trigger.delay = Math.max(0, Number(n.replace(/[^0-9]/g, "")) || 0));
        })
      );
    else if (t.trigger.type === "cta") {
      const n = t.trigger;
      e.append(
        this.textField("Invitation text", n.text, "Need a hand getting started?", (i) => {
          t.trigger.type === "cta" && (t.trigger.text = i);
        }),
        this.textField("Button label", n.button, "Start tour", (i) => {
          t.trigger.type === "cta" && (t.trigger.button = i);
        }),
        this.selectField(
          "Corner",
          n.corner,
          [
            ["bottom-right", "Bottom right"],
            ["bottom-left", "Bottom left"],
            ["top-right", "Top right"],
            ["top-left", "Top left"]
          ],
          (i) => {
            t.trigger.type === "cta" && (t.trigger.corner = i), this.markDirty();
          }
        ),
        this.textField("Edge offset (px)", String(n.offset ?? 24), "24", (i) => {
          t.trigger.type === "cta" && (t.trigger.offset = Math.max(0, Number(i.replace(/[^0-9]/g, "")) || 0));
        })
      );
    }
    if (e.append(a("div", { class: "settings__hint" }, [Dt(t.trigger.type)])), t.trigger.type !== "manual") {
      const n = t.conditions;
      e.append(
        a("div", { class: "settings__divider" }),
        a("label", { class: "settings__label" }, ["Visitor tags"]),
        this.tagPicker(n.tags, () => this.markDirty()),
        a("div", { class: "settings__hint" }, [
          "The visitor must carry every selected tag. Logged-in, role, plan — the host decides what exists."
        ]),
        this.checkboxField("Show only on the first visit", n.firstVisitOnly, (i) => {
          n.firstVisitOnly = i;
        }),
        this.textField("Show at most N times (0 = no limit)", String(n.maxShows), "0", (i) => {
          n.maxShows = Math.max(0, Number(i.replace(/[^0-9]/g, "")) || 0);
        }),
        this.selectField(
          "Device",
          n.device,
          [
            ["any", "Any device"],
            ["desktop", "Desktop only"],
            ["tablet", "Tablet only"],
            ["mobile", "Mobile only"]
          ],
          (i) => {
            n.device = i, this.markDirty();
          }
        )
      );
    }
    return e;
  }
  /**
   * Tag picker: click to require a label, click again to drop it.
   *
   * Tags are what the host attaches to a visitor — `admin`, `authenticated`,
   * `firstVisit`, `level:gold`. Rendered as a row of toggles rather than text
   * inputs because the whole reason for tags over key/value pairs is that an
   * author should pick, not type: a mistyped label matches nobody and says
   * nothing about it.
   *
   * Anything already on the tour that the host does not advertise is still
   * shown, so importing a tour from elsewhere does not hide its rules.
   */
  tagPicker(e, t) {
    const n = a("div", { class: "tags" }), i = this.options.tags ?? [], o = Array.from(/* @__PURE__ */ new Set([...i, ...e]));
    if (o.length === 0)
      return n.append(
        a("p", { class: "selpop__empty" }, [
          "No tags available. The host declares them — see `tags` in the builder options, or the site_tours_viewer_tags filter."
        ])
      ), n;
    for (const s of o) {
      const l = e.includes(s), p = a("button", { class: `tags__chip ${l ? "tags__chip--on" : ""}`.trim(), type: "button" }, [s]);
      p.addEventListener("click", () => {
        const c = e.indexOf(s);
        c === -1 ? e.push(s) : e.splice(c, 1), t(), this.render();
      }), n.append(p);
    }
    return n;
  }
  /** A labelled checkbox row. */
  checkboxField(e, t, n) {
    const i = a("input", { type: "checkbox", class: "settings__check" });
    i.checked = t, i.addEventListener("change", () => {
      n(i.checked), this.markDirty(), this.render();
    });
    const o = a("label", { class: "settings__checkrow" });
    return o.append(i, document.createTextNode(e)), o;
  }
  /** A labelled <select>. */
  selectField(e, t, n, i) {
    const o = document.createElement("select");
    o.className = "tsel";
    for (const [l, p] of n) {
      const c = document.createElement("option");
      c.value = l, c.textContent = p, l === t && (c.selected = !0), o.append(c);
    }
    o.addEventListener("change", () => i(o.value));
    const s = a("div", { class: "settings__field" });
    return s.append(a("label", { class: "settings__label" }, [e]), o), s;
  }
  /** A labelled text input that writes through on change. */
  textField(e, t, n, i) {
    const o = a("input", { class: "pagecfg__input", placeholder: n });
    o.value = t, o.addEventListener("change", () => {
      i(o.value.trim()), this.markDirty();
    });
    const s = a("div", { class: "settings__field" });
    return s.append(a("label", { class: "settings__label" }, [e]), o), s;
  }
  renderConnector(e) {
    const t = a("div", { class: "connector" }), n = a("button", { class: "connector__add", title: "Add step", type: "button" }, ["+"]);
    return n.addEventListener("click", () => this.addStepAfter(e)), t.append(a("div", { class: "connector__line" }), n, a("div", { class: "connector__line" })), t;
  }
  /**
   * Selector list editor, shown over the panel.
   *
   * A step keeps a ranked list of candidates, but the UI only ever showed the
   * first one and offered no way to drop a bad entry or add a fallback — the
   * picker could only replace the lot. This is that missing editor.
   */
  /** Open the page editor, kicking off the sitemap fetch the first time. */
  openPageEditor(e) {
    this.setActive(e.id), this.pageEditorFor = this.pageEditorFor === e.id ? null : e.id, this.pageQuery = "", this.pageEditorFor && this.pages === null && zt().then((t) => {
      this.pages = t, this.pageEditorFor && this.render();
    }), this.render();
  }
  /**
   * Page matcher editor: type to search the site's own pages, or paste a URL.
   *
   * Authors know their pages by name, not by URL glob. The sitemap is the one
   * list of pages a site already publishes about itself, so suggestions come
   * from there — matched against the whole URL, so both the host and a path
   * fragment find the same page. Free text always wins, which is how a URL on
   * someone else's site gets in.
   */
  renderPageEditor(e) {
    const t = a("div", { class: "selpop" }), n = a("div", { class: "selpop__head" });
    n.append(a("span", { class: "selpop__title" }, ["Page"]));
    const i = _("close", "Close");
    i.addEventListener("click", () => {
      this.pageEditorFor = null, this.render();
    }), n.append(a("div", { class: "spacer" }), i);
    const o = a("input", {
      class: "pagecfg__input",
      placeholder: "Any page — or type to search, or paste a URL"
    });
    o.value = this.pageQuery || e.page;
    const s = (h) => {
      e.page = h.trim(), this.markDirty(), this.pageEditorFor = null, this.render();
    };
    o.addEventListener("input", () => {
      this.pageQuery = o.value, this.renderPageSuggestions(e, l);
    }), o.addEventListener("keydown", (h) => {
      h.key === "Enter" && s(o.value);
    });
    const l = a("div", { class: "selpop__list" });
    t.append(n, o, l), this.renderPageSuggestions(e, l);
    const p = a("button", { class: "selpop__add", type: "button" }, ["⌖ Use the current page"]);
    p.addEventListener("click", () => s(this.currentPage()));
    const c = a("button", { class: "selpop__add", type: "button" }, ["✳ Any page"]);
    return c.addEventListener("click", () => s("")), t.append(p, c), t;
  }
  /** (Re)fill the suggestion rows without rebuilding the whole popover. */
  renderPageSuggestions(e, t) {
    if (t.textContent = "", this.pages === null) {
      t.append(a("p", { class: "selpop__empty" }, ["Reading the site map…"]));
      return;
    }
    if (this.pages.length === 0) {
      t.append(
        a("p", { class: "selpop__empty" }, [
          "No sitemap found — type a URL or glob directly, and press Enter."
        ])
      );
      return;
    }
    const n = Ft(this.pages, this.pageQuery);
    if (n.length === 0) {
      t.append(a("p", { class: "selpop__empty" }, ["Nothing matches — press Enter to use it as typed."]));
      return;
    }
    for (const i of n) {
      const o = a("button", { class: "selpop__page", type: "button", title: i }, [
        i.replace(/^https?:\/\//, "")
      ]);
      o.addEventListener("click", () => {
        e.page = It(i), this.markDirty(), this.pageEditorFor = null, this.render();
      }), t.append(o);
    }
  }
  renderSelectorEditor(e) {
    const t = a("div", { class: "selpop" }), n = a("div", { class: "selpop__head" });
    n.append(a("span", { class: "selpop__title" }, ["Selectors"]));
    const i = _("close", "Close");
    i.addEventListener("click", () => {
      this.selectorEditorFor = null, this.render();
    }), n.append(a("div", { class: "spacer" }), i);
    const o = a("div", { class: "selpop__list" });
    e.selectors.length === 0 && o.append(a("p", { class: "selpop__empty" }, ["No selectors yet. Add one with the crosshair below."])), e.selectors.forEach((l, p) => {
      const c = a("div", { class: "selpop__row", draggable: "true" });
      c.addEventListener("dragstart", (g) => {
        this.dragFrom = p, c.classList.add("selpop__row--dragging"), g.dataTransfer?.setData("text/plain", String(p));
      }), c.addEventListener("dragend", () => {
        this.dragFrom = null, c.classList.remove("selpop__row--dragging");
      }), c.addEventListener("dragover", (g) => {
        g.preventDefault(), c.classList.add("selpop__row--over");
      }), c.addEventListener("dragleave", () => c.classList.remove("selpop__row--over")), c.addEventListener("drop", (g) => {
        g.preventDefault();
        const u = this.dragFrom;
        if (this.dragFrom = null, u === null || u === p) return;
        const [k] = e.selectors.splice(u, 1);
        e.selectors.splice(p, 0, k), this.markDirty(), this.render();
      }), c.append(a("span", { class: "selpop__grip", title: "Drag to reorder" }, ["⠿"])), c.append(a("span", { class: "selpop__rank" }, [String(p + 1)])), c.append(a("code", { class: "selpop__code", title: l }, [l]));
      const h = _("trash", "Remove this selector");
      h.addEventListener("click", () => {
        e.selectors.splice(p, 1), this.markDirty(), this.render();
      }), c.append(h), o.append(c);
    });
    const s = a("button", { class: `selpop__add ${this.picking ? "selpop__add--on" : ""}`.trim(), type: "button" }, [
      this.picking ? "◎ Picking — click an element, or press Esc" : "⌖ Add by picking an element"
    ]);
    return s.addEventListener("click", () => this.togglePicking(!0)), t.append(n, o, s), t;
  }
  renderCard(e, t) {
    const n = e.id === this.activeStepId, i = a("div", {
      class: `card ${n ? "card--active" : ""} ${e.included ? "" : "card--excluded"}`.trim(),
      // Lets revealStep() find this card after a re-render.
      "data-step-id": e.id
    });
    return i.addEventListener("mousedown", () => this.setActive(e.id)), e.page && !P({ glob: e.page }, window.location.href) && i.classList.add("card--offpage"), i.append(this.renderCardControl(e, t), this.renderCardContent(e), this.renderCardFooter(e)), n && (i.append(this.section("placement", "Card position", () => this.renderPlacementBody(e))), i.append(this.section("behaviour", "Behaviour", () => this.renderBehaviourBody(e))), i.append(this.section("condition", "Show this step when…", () => this.renderConditionBody(e))), i.append(this.section("page", "Page", () => this.renderPageBody(e)))), i;
  }
  /**
   * Per-step behaviour toggles.
   *
   * Exists because of the standing rule that anything the schema can express
   * must be reachable from the builder — `overlay` shipped with this section,
   * not after it.
   */
  renderBehaviourBody(e) {
    const t = a("div", { class: "settings" });
    return t.append(
      this.checkboxField("Dim the rest of the page", e.overlay !== !1, (n) => {
        e.overlay = n, this.render();
      }),
      a("div", { class: "settings__hint" }, [
        "Off leaves the page fully usable and only outlines the target — for a step the visitor should be free to poke at."
      ])
    ), t;
  }
  /**
   * Per-step gate. The tour may run, and this step still be skipped — for a
   * feature only some visitors have, or a control that only exists on desktop.
   *
   * A skipped step is passed over like one whose element never appeared, and
   * drops out of the progress count, so the visitor never sees a gap.
   */
  renderConditionBody(e) {
    const t = a("div", { class: "settings" }), n = e.condition ?? (e.condition = {}), i = () => {
      !n.device && (!n.tags || n.tags.length === 0) && delete e.condition, this.markDirty();
    };
    return t.append(
      this.selectField(
        "Device",
        n.device ?? "any",
        [
          ["any", "Any device"],
          ["mobile", "Mobile only"],
          ["tablet", "Tablet only"],
          ["desktop", "Desktop only"]
        ],
        (o) => {
          o === "any" ? delete n.device : n.device = o, i(), this.render();
        }
      ),
      a("label", { class: "settings__label" }, ["Visitor tags"]),
      this.tagPicker(n.tags ?? (n.tags = []), i),
      a("div", { class: "settings__hint" }, [
        "The visitor must carry every selected tag. A tag the host does not attach is simply absent, so the step is skipped."
      ])
    ), t;
  }
  /** Page sub-panel: which pages this step shows on (multi-page tours). */
  renderPageBody(e) {
    const t = a("div", { class: "settings" }), n = a("input", { class: "pagecfg__input", placeholder: "Any page" });
    n.value = e.page, n.addEventListener("change", () => {
      e.page = n.value.trim(), this.markDirty(), this.render();
    });
    const i = a("button", { class: "pagecfg__use", type: "button" }, ["Use current page"]);
    return i.addEventListener("click", () => {
      e.page = this.currentPage(), this.render();
    }), t.append(
      a("label", { class: "settings__label" }, ["Show on pages matching (URL glob)"]),
      n,
      i,
      a("div", { class: "settings__hint" }, [
        "Empty = any page. New steps get the current page automatically; navigate your site (with the builder on) to add steps on other pages."
      ])
    ), t;
  }
  /**
   * A collapsible card-settings section: a header with a left caret + title;
   * clicking toggles it. Collapsed by default; open state persists across
   * renders (keyed) so switching steps keeps the same sections expanded.
   */
  section(e, t, n) {
    const i = this.openSections.has(e), o = a("div", { class: `acc ${i ? "acc--open" : ""}`.trim() }), s = a("button", { class: "acc__head", type: "button" }), l = a("span", { class: "acc__caret" });
    return l.innerHTML = ae.chevron, s.append(l, a("span", { class: "acc__title" }, [t])), s.addEventListener("click", () => {
      i ? this.openSections.delete(e) : this.openSections.add(e), this.render();
    }), o.append(s), i && o.append(a("div", { class: "acc__body" }, [n()])), o;
  }
  /**
   * Placement picker body: an Auto toggle plus a 12-anchor grid (each side ×
   * start/center/end) around a mock target. Editing re-renders so the on-page
   * card and the active anchor update together.
   */
  renderPlacementBody(e) {
    const t = a("div", { class: "place" }), n = a("div", { class: "place__grid" });
    n.append(a("div", { class: "place__el" })), n.append(a("div", { class: "place__el" }));
    const i = [
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
    for (const s of i) {
      const l = e.placement === s.side && e.align === s.align, p = a("button", {
        class: `place__dot ${l ? "place__dot--active" : ""}`.trim(),
        type: "button",
        title: `${s.side} · ${s.align}`
      });
      p.style.left = `${s.x - 6}px`, p.style.top = `${s.y - 6}px`, p.addEventListener("click", () => {
        e.placement = s.side, e.align = s.align, this.render();
      }), n.append(p);
    }
    t.append(n);
    const o = a("button", {
      class: `place__auto ${e.placement === "auto" ? "place__auto--active" : ""}`.trim(),
      type: "button",
      title: "Pick the side with the most room automatically"
    }, ["Auto"]);
    return o.addEventListener("click", () => {
      e.placement = "auto", this.render();
    }), t.append(o), t;
  }
  renderCardControl(e, t) {
    const n = a("div", { class: "card__control" }), i = a("input", { class: "card__check", type: "checkbox", title: "Include in tour" });
    i.checked = e.included, i.addEventListener("change", () => {
      e.included = i.checked, this.render();
    });
    const o = a("span", { class: "card__index" }, [String(t + 1)]), s = a("span", { class: "card__type" });
    s.innerHTML = ae[e.type === "action" ? "bolt" : "step"], s.append(document.createTextNode(e.type === "action" ? "Action" : "Step"));
    const l = e.selectors[0], p = e.selectors.length, c = a(
      "button",
      {
        class: `card__sel ${l ? "" : "card__sel--empty"}`.trim(),
        type: "button",
        title: e.selectors.join(`
`) || "No selector yet — click to add one"
      },
      [l ?? "no selector"]
    );
    p > 1 && c.append(a("span", { class: "card__selcount" }, [`+${p - 1}`])), c.addEventListener("click", (g) => {
      g.stopPropagation(), this.setActive(e.id), this.selectorEditorFor = this.selectorEditorFor === e.id ? null : e.id, this.render();
    });
    const h = _("trash", "Delete step");
    if (h.addEventListener("click", () => this.removeStep(e.id)), n.append(i, o, s, a("div", { class: "spacer" })), e.page && !P({ glob: e.page }, window.location.href)) {
      const g = e.page.replace(/^https?:\/\/[^/]+/, "").replace(/\*$/, "") || "/", u = a("button", { class: "card__page", type: "button", title: e.page }, [`⧉ ${g}`]);
      u.addEventListener("click", (k) => {
        k.stopPropagation(), this.openPageEditor(e);
      }), n.append(u);
    }
    return n.append(c, h), n;
  }
  renderCardContent(e) {
    const t = a("div", {
      class: "card__content",
      contenteditable: "true",
      "data-placeholder": "Write the step text…",
      "data-step": e.id
    });
    return t.textContent = e.content, t.addEventListener("input", () => {
      e.content = t.textContent ?? "", this.updateOverlays(), this.markDirty();
    }), t.addEventListener("mousedown", () => {
      this.activeStepId !== e.id && (this.focusStepId = e.id);
    }), t;
  }
  renderCardFooter(e) {
    const t = a("div", { class: "card__footer" });
    return t.append(
      this.renderEditableButton(e, "backLabel"),
      this.renderEditableButton(e, "nextLabel")
    ), t;
  }
  /** A footer button that turns into a text input when clicked, to edit its label. */
  renderEditableButton(e, t) {
    const n = a("button", { class: "cardbtn", type: "button" }, [e[t]]);
    return n.addEventListener("click", (i) => {
      i.stopPropagation();
      const o = a("input", { class: "cardbtn cardbtn--edit", value: e[t] });
      o.value = e[t], n.replaceWith(o), o.focus(), o.select();
      const s = () => {
        e[t] = o.value.trim() || (t === "backLabel" ? "Back" : "Next"), o.replaceWith(this.renderEditableButton(e, t)), this.markDirty();
      };
      o.addEventListener("blur", s), o.addEventListener("keydown", (l) => {
        l.key === "Enter" && o.blur(), l.key === "Escape" && (o.value = e[t], o.blur());
      });
    }), n;
  }
  // ---------- misc ----------
  /** Focus a card's content area and place the caret at the end. */
  focusContent(e) {
    const t = this.root?.querySelector(`.card__content[data-step="${e}"]`);
    if (!t) return;
    t.focus();
    const n = document.createRange();
    n.selectNodeContents(t), n.collapse(!1);
    const i = window.getSelection();
    i?.removeAllRanges(), i?.addRange(n);
  }
}
export {
  De as TourBuilder,
  Le as cloneDraft,
  H as createDraftStep,
  ne as createDraftTour,
  Rt as createLocalStore,
  Ut as createWordPressStore,
  de as normalizeTours,
  $t as toTour
};
