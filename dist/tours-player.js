const Q = `
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
`, tt = `
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
.tours-backdrop {
  position: fixed;
  inset: 0;
  z-index: 2147482999;
  background: transparent;
}
`;
function R(t) {
  return JSON.stringify(t);
}
function et(t) {
  return /^[a-zA-Z][\w-]*$/.test(t) && t.length <= 30 && !/\d{2,}/.test(t) && !/^(css-|sc-|jsx-|emotion-|_|is-|has-)/.test(t);
}
function X(t) {
  const e = [];
  let n = t;
  for (; n && n !== document.body && n.nodeType === 1; ) {
    const r = n.tagName.toLowerCase(), i = n.parentElement;
    if (!i) {
      e.unshift(r);
      break;
    }
    const a = Array.from(i.children).filter((l) => l.tagName === n.tagName);
    e.unshift(a.length > 1 ? `${r}:nth-of-type(${a.indexOf(n) + 1})` : r), n = i;
  }
  return `body > ${e.join(" > ")}`;
}
function nt(t) {
  let e = t.parentElement;
  for (; e && e !== document.body && !e.id; )
    e = e.parentElement;
  if (!e || !e.id) return null;
  const n = [];
  let r = t;
  for (; r && r !== e; ) {
    const i = r.tagName.toLowerCase(), a = r.parentElement;
    if (!a) return null;
    const l = Array.from(a.children).filter((c) => c.tagName === r.tagName);
    n.unshift(l.length > 1 ? `${i}:nth-of-type(${l.indexOf(r) + 1})` : i), r = a;
  }
  return `#${CSS.escape(e.id)} > ${n.join(" > ")}`;
}
const rt = ["data-testid", "data-test", "data-test-id", "data-cy", "data-qa", "data-id", "data-name"];
function ot(t) {
  const e = [], n = /* @__PURE__ */ new Set(), r = t.tagName.toLowerCase(), i = (s) => {
    if (!(!s || n.has(s)))
      try {
        document.querySelector(s) === t && (n.add(s), e.push(s));
      } catch {
      }
  };
  t.id && i(`#${CSS.escape(t.id)}`);
  for (const s of rt) {
    const d = t.getAttribute(s);
    d && i(`${r}[${s}=${R(d)}]`);
  }
  const a = t.getAttribute("name");
  a && i(`${r}[name=${R(a)}]`);
  const l = t.getAttribute("aria-label");
  l && i(`[aria-label=${R(l)}]`);
  const c = Array.from(t.classList).filter(et);
  c.length && i(`${r}.${c.map((s) => CSS.escape(s)).join(".")}`);
  for (const s of c) i(`${r}.${CSS.escape(s)}`);
  i(nt(t)), i(X(t));
  const u = (t.textContent ?? "").replace(/\s+/g, " ").trim();
  if (u && u.length <= 50 && /^(a|button|summary|label|h[1-6])$/.test(r)) {
    const s = `text=${u}`;
    n.has(s) || (n.add(s), e.push(s));
  }
  return e.length === 0 && e.push(X(t)), e;
}
const it = "a, button, summary, label, h1, h2, h3, h4, h5, h6";
function st(t, e) {
  if (t.startsWith("text=")) {
    const n = t.slice(5).trim();
    for (const r of Array.from(e.querySelectorAll(it)))
      if ((r.textContent ?? "").replace(/\s+/g, " ").trim() === n) return r;
    return null;
  }
  try {
    return e.querySelector(t);
  } catch {
    return null;
  }
}
function D(t, e = document) {
  for (const n of t) {
    const r = st(n, e);
    if (r) return r;
  }
  return null;
}
function V(t, e = {}) {
  const n = e.root ?? document, r = D(t, n);
  return r ? Promise.resolve(r) : new Promise((i) => {
    let a = !1, l;
    const c = (d) => {
      a || (a = !0, u.disconnect(), l && clearTimeout(l), i(d));
    }, u = new MutationObserver(() => {
      const d = D(t, n);
      d && c(d);
    });
    u.observe(document.documentElement, {
      childList: !0,
      subtree: !0,
      attributes: !0
    });
    const s = e.timeout ?? 4e3;
    s > 0 && Number.isFinite(s) && (l = setTimeout(() => c(null), s));
  });
}
let k = null;
function P() {
  if (k !== null) return k;
  try {
    k = new URLSearchParams(window.location.search).has("use_logs");
  } catch {
    k = !1;
  }
  return k;
}
function W(t) {
  const e = `[tours:${t}]`;
  return {
    log: (...n) => {
      P() && console.log(e, ...n);
    },
    warn: (...n) => {
      P() && console.warn(e, ...n);
    },
    error: (...n) => {
      P() && console.error(e, ...n);
    }
  };
}
function kt(t, e = {}) {
  const n = W("picker");
  let r = null, i = null, a = null, l = !1;
  function c(h) {
    if (h === r) return !0;
    for (const m of e.ignore ?? [])
      if (m && m.contains(h)) return !0;
    return !1;
  }
  function u() {
    if (r) return;
    r = document.createElement("div"), r.setAttribute("data-tours-picker", ""), i = r.attachShadow({ mode: "open" });
    const h = document.createElement("style");
    h.textContent = Q, i.appendChild(h), a = document.createElement("div"), a.className = "tours-picker-overlay", a.style.display = "none", i.appendChild(a);
    const m = document.createElement("div");
    m.className = "tours-picker-hint", m.textContent = "Hover and click an element • Esc to cancel", i.appendChild(m), document.body.appendChild(r);
  }
  function s(h, m) {
    const w = document.elementFromPoint(h, m);
    return !w || c(w) ? null : w;
  }
  function d(h) {
    if (!l || !a) return;
    const m = s(h.clientX, h.clientY);
    if (!m) {
      a.style.display = "none";
      return;
    }
    const w = m.getBoundingClientRect();
    a.style.display = "block", a.style.left = `${w.left}px`, a.style.top = `${w.top}px`, a.style.width = `${w.width}px`, a.style.height = `${w.height}px`;
  }
  function g(h) {
    if (!l) return;
    const m = s(h.clientX, h.clientY);
    if (h.preventDefault(), h.stopPropagation(), !m) return;
    const w = ot(m);
    n.log("picked", w), E(), t(w);
  }
  function b(h) {
    h.key === "Escape" && (h.preventDefault(), E());
  }
  function L() {
    l || (l = !0, n.log("start"), u(), document.addEventListener("mousemove", d, !0), document.addEventListener("click", g, !0), document.addEventListener("keydown", b, !0));
  }
  function E() {
    l && (l = !1, document.removeEventListener("mousemove", d, !0), document.removeEventListener("click", g, !0), document.removeEventListener("keydown", b, !0), r && r.parentNode && r.parentNode.removeChild(r), r = null, i = null, a = null);
  }
  return { start: L, stop: E };
}
const at = 6, lt = 6, ct = 10, ut = 12;
function dt(t, e, n) {
  const r = {
    top: t.top,
    bottom: n.height - t.bottom,
    left: t.left,
    right: n.width - t.right
  }, i = {
    top: e.height,
    bottom: e.height,
    left: e.width,
    right: e.width
  }, a = ["bottom", "top", "right", "left"], l = a.find((c) => r[c] >= i[c] + 8);
  return l || a.reduce((c, u) => r[u] > r[c] ? u : c, a[0]);
}
function ft(t) {
  const { target: e, card: n, offset: r, viewport: i } = t, a = t.side === "auto", l = a ? dt(e, n, i) : t.side, c = a ? "center" : t.align, u = t.alignOffset ?? 0, s = c === "start" ? u : c === "end" ? -u : 0;
  let d = 0, g = 0;
  return l === "top" || l === "bottom" ? (d = l === "top" ? e.top - n.height - r : e.bottom + r, g = c === "start" ? e.left : c === "end" ? e.right - n.width : e.left + e.width / 2 - n.width / 2, g += s) : (g = l === "left" ? e.left - n.width - r : e.right + r, d = c === "start" ? e.top : c === "end" ? e.bottom - n.height : e.top + e.height / 2 - n.height / 2, d += s), g = Math.max(8, Math.min(g, i.width - n.width - 8)), d = Math.max(8, Math.min(d, i.height - n.height - 8)), { top: d, left: g };
}
function B(t) {
  const e = document.createElement("button");
  return e.type = "button", e.className = `tours-card__btn${t.primary ? " tours-card__btn--primary" : ""}${t.disabled ? " tours-card__btn--disabled" : ""}`, e.textContent = t.label, !t.disabled && t.onClick && e.addEventListener("click", t.onClick), e;
}
function pt(t) {
  const e = document.createElement("div");
  if (e.className = `tours-card${t.ghost ? " tours-card--ghost" : ""}`, t.radius != null && (e.style.borderRadius = `${t.radius}px`), t.showClose) {
    const r = document.createElement("button");
    r.className = "tours-card__close", r.type = "button", r.textContent = "×", r.setAttribute("aria-label", "Close"), t.onClose && r.addEventListener("click", t.onClose), e.appendChild(r);
  }
  const n = document.createElement("div");
  if (n.className = "tours-card__content", t.contentHtml != null ? n.innerHTML = t.contentHtml : n.textContent = t.contentText ?? "", e.appendChild(n), t.back || t.next || t.progress) {
    const r = document.createElement("div");
    if (r.className = "tours-card__footer", t.back && r.appendChild(B(t.back)), t.progress) {
      const i = document.createElement("span");
      i.className = "tours-card__progress", i.textContent = t.progress, r.appendChild(i);
    }
    t.next && r.appendChild(B(t.next)), e.appendChild(r);
  }
  return e;
}
const ht = `
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
function gt(t) {
  const e = t.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*\*/g, "\0").replace(/\*/g, "[^/]*").replace(/ /g, ".*").replace(/\?/g, ".");
  return new RegExp(`^${e}$`);
}
function I(t, e) {
  if (!t) return !0;
  if (t.regex)
    try {
      return new RegExp(t.regex).test(e);
    } catch {
      return !1;
    }
  if (t.glob)
    try {
      return gt(t.glob).test(e);
    } catch {
      return !1;
    }
  return !0;
}
const z = "tours:locationchange";
let j = !1;
function mt() {
  if (!j) {
    j = !0;
    for (const t of ["pushState", "replaceState"]) {
      const e = history[t];
      history[t] = function(...r) {
        const i = e.apply(this, r);
        return window.dispatchEvent(new Event(z)), i;
      };
    }
  }
}
function bt(t) {
  return mt(), window.addEventListener("popstate", t), window.addEventListener("hashchange", t), window.addEventListener(z, t), () => {
    window.removeEventListener("popstate", t), window.removeEventListener("hashchange", t), window.removeEventListener(z, t);
  };
}
const M = "tours:progress";
function _t() {
  return {
    get(t) {
      try {
        return localStorage.getItem(t);
      } catch {
        return null;
      }
    },
    set(t, e) {
      try {
        localStorage.setItem(t, e);
      } catch {
      }
    },
    remove(t) {
      try {
        localStorage.removeItem(t);
      } catch {
      }
    }
  };
}
function wt(t) {
  const e = t.get(M);
  if (!e) return null;
  try {
    const n = JSON.parse(e);
    if (typeof n?.tourId == "string" && typeof n?.index == "number") return n;
  } catch {
  }
  return null;
}
function xt(t, e) {
  t.set(M, JSON.stringify(e));
}
function q(t) {
  t.remove(M);
}
const K = "tours:seen:";
function yt(t, e) {
  const n = t.get(K + e), r = n ? parseInt(n, 10) : 0;
  return Number.isNaN(r) ? 0 : r;
}
function St(t, e) {
  t.set(K + e, String(yt(t, e) + 1));
}
function vt(t, e = {}) {
  const n = W("player"), r = e.state;
  let i = null, a = null, l = null, c = null, u = !1, s = 0, d = 0, g = null;
  const b = t.display?.padding ?? at, L = t.display?.radius ?? lt, E = t.display?.cardRadius ?? ct, h = t.display?.offset ?? ut;
  function m(o) {
    return D(o.selectors);
  }
  function w(o) {
    return I(o.pageUrl, window.location.href);
  }
  function C() {
    r && xt(r, { tourId: t.id, index: s });
  }
  function O() {
    if (i) return;
    i = document.createElement("div"), i.setAttribute("data-tours-player", ""), a = i.attachShadow({ mode: "open" });
    const o = document.createElement("style");
    o.textContent = tt + ht, a.appendChild(o);
    const f = document.createElement("div");
    f.className = "tours-backdrop", f.addEventListener("click", (p) => {
      const v = t.steps[s], S = v ? m(v) : null;
      if (S) {
        const $ = S.getBoundingClientRect();
        if (p.clientX >= $.left - b && p.clientX <= $.right + b && p.clientY >= $.top - b && p.clientY <= $.bottom + b) return;
      }
      x();
    }), a.appendChild(f), l = document.createElement("div"), l.className = "tours-spotlight", l.style.borderRadius = `${L}px`, a.appendChild(l), document.body.appendChild(i);
  }
  function U(o, f = !1) {
    l && (l.style.transitionDuration = f ? "0ms" : "", l.style.display = "block", l.style.left = `${o.left - b}px`, l.style.top = `${o.top - b}px`, l.style.width = `${o.width + b * 2}px`, l.style.height = `${o.height + b * 2}px`);
  }
  function F(o, f) {
    if (!c) return;
    const p = {
      top: o.top - b,
      left: o.left - b,
      right: o.right + b,
      bottom: o.bottom + b,
      width: o.width + b * 2,
      height: o.height + b * 2
    }, { top: v, left: S } = ft({
      target: p,
      card: { width: c.offsetWidth, height: c.offsetHeight },
      side: f.placement ?? "bottom",
      align: f.align ?? "center",
      offset: h,
      alignOffset: t.display?.alignOffset ?? 0,
      viewport: { width: window.innerWidth, height: window.innerHeight }
    });
    c.style.left = `${S}px`, c.style.top = `${v}px`;
  }
  function G(o) {
    const f = Math.max(1, t.steps.length - d), p = Math.max(1, Math.min(s + 1 - d, f));
    c && c.remove(), c = pt({
      contentText: o.content.default,
      progress: `Step ${p} of ${f}`,
      showClose: !0,
      onClose: x,
      radius: E,
      back: { label: o.backLabel ?? "Back", disabled: s === 0, onClick: A },
      next: {
        label: o.nextLabel ?? (s === f - 1 ? "Done" : "Next"),
        primary: !0,
        onClick: T
      }
    }), a?.appendChild(c);
  }
  function y() {
    if (!u) return;
    const o = t.steps[s];
    if (!o) {
      x();
      return;
    }
    n.log("render step", s, o.id);
    const f = m(o);
    if (!f) {
      n.log(`step "${o.id}" target not found yet — waiting`, o.selectors), V(o.selectors, { timeout: 4e3 }).then((v) => {
        !u || t.steps[s] !== o || (v ? y() : (n.warn(`step "${o.id}" skipped: no element for selectors`, o.selectors), d += 1, s < t.steps.length - 1 ? (s += 1, y()) : x()));
      });
      return;
    }
    O(), f.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" }), G(o);
    const p = f.getBoundingClientRect();
    U(p), F(p, o);
  }
  function Y(o) {
    u && (o.key === "Escape" ? (o.preventDefault(), x()) : o.key === "ArrowRight" ? T() : o.key === "ArrowLeft" && A());
  }
  function _() {
    if (!u) return;
    const o = t.steps[s];
    if (!o) return;
    const f = m(o);
    if (!f) return;
    const p = f.getBoundingClientRect();
    U(p, !0), F(p, o);
  }
  function J(o = 0) {
    u || t.steps.length !== 0 && (u = !0, s = Math.max(0, Math.min(o, t.steps.length - 1)), d = 0, n.log("start", t.id, `at ${s}/${t.steps.length}`), O(), window.addEventListener("keydown", Y, !0), window.addEventListener("resize", _, !0), window.addEventListener("scroll", _, !0), C(), y());
  }
  function Z() {
    l && (l.style.display = "none"), c && (c.remove(), c = null);
  }
  function N() {
    Z(), !g && (g = bt(() => {
      if (!u) {
        g?.(), g = null;
        return;
      }
      const o = t.steps[s];
      o && w(o) && (g?.(), g = null, y());
    }));
  }
  function H() {
    g && (g(), g = null), u && (u = !1, window.removeEventListener("keydown", Y, !0), window.removeEventListener("resize", _, !0), window.removeEventListener("scroll", _, !0), i && i.parentNode && i.parentNode.removeChild(i), i = null, a = null, l = null, c = null);
  }
  function x() {
    n.log("stop"), H(), r && q(r);
  }
  function T() {
    if (!u) return;
    const o = s + 1, f = t.steps[o];
    if (!f) {
      x();
      return;
    }
    if (w(f)) {
      s = o, C(), y();
      return;
    }
    s = o, C();
    const p = t.steps[s - 1]?.action;
    if (p && p.type === "navigate" && p.url) {
      p.url.startsWith("#") ? (n.log("page transition (hash navigate) → resume at", s), N(), window.location.hash = p.url) : (n.log("page transition (navigate) → resume at", s), H(), window.location.assign(p.url));
      return;
    }
    n.log("page transition (wait) → resume at", s), N();
  }
  function A() {
    if (!u) return;
    const o = t.steps[s - 1];
    if (o) {
      if (w(o)) {
        s -= 1, C(), y();
        return;
      }
      s -= 1, C(), n.log("page transition back → resume at", s), N(), window.history.back();
    }
  }
  return { start: J, stop: x, next: T, prev: A };
}
function $t(t, e = {}) {
  const n = e.state;
  if (!n) return null;
  const r = wt(n);
  if (!r || r.tourId !== t.id) return null;
  const i = t.steps[r.index];
  if (!i)
    return q(n), null;
  if (!I(i.pageUrl, window.location.href)) return null;
  const a = vt(t, { state: n });
  return a.start(r.index), a;
}
function Lt(t, e) {
  const n = t.trigger ?? { type: "manual" };
  let r = !1;
  const i = () => {
    r || (r = !0, e());
  };
  switch (n.type) {
    case "load": {
      const a = setTimeout(i, 0);
      return () => clearTimeout(a);
    }
    case "timer": {
      const a = setTimeout(i, Math.max(0, n.delay));
      return () => clearTimeout(a);
    }
    case "selector": {
      let a = !1;
      return V([n.selector], { timeout: 0 }).then((l) => {
        l && !a && i();
      }), () => {
        a = !0;
      };
    }
    case "manual":
    default:
      return () => {
      };
  }
}
function Nt(t = window.innerWidth) {
  return t <= 640 ? "mobile" : t <= 1024 ? "tablet" : "desktop";
}
function Et(t, e) {
  return !(t.url && !I(t.url, e.url) || t.role !== void 0 && t.role !== e.role || t.firstVisitOnly && !e.firstVisit || t.device && t.device !== e.device || t.unlessSeen && e.seenCount > 0 || t.maxShows !== void 0 && e.seenCount >= t.maxShows);
}
function Tt(t, e) {
  return !t || t.length === 0 ? !0 : t.some((n) => Et(n.when, e));
}
export {
  ht as CARD_STYLES,
  M as PROGRESS_KEY,
  Lt as armTrigger,
  dt as autoSide,
  ot as buildSelectors,
  q as clearProgress,
  _t as createLocalState,
  W as createLogger,
  kt as createPicker,
  vt as createPlayer,
  Nt as detectDevice,
  P as isLoggingEnabled,
  St as markSeen,
  Tt as matchRules,
  I as matchUrl,
  ft as placeCard,
  wt as readProgress,
  pt as renderCard,
  D as resolveElement,
  $t as resumeTour,
  yt as seenCount,
  V as waitForElement,
  xt as writeProgress
};
