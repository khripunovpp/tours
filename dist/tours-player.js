const Z = `
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
`, Q = `
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
function T(t) {
  return JSON.stringify(t);
}
function tt(t) {
  return /^[a-zA-Z][\w-]*$/.test(t) && t.length <= 30 && !/\d{2,}/.test(t) && !/^(css-|sc-|jsx-|emotion-|_|is-|has-)/.test(t);
}
function H(t) {
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
function et(t) {
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
const nt = ["data-testid", "data-test", "data-test-id", "data-cy", "data-qa", "data-id", "data-name"];
function rt(t) {
  const e = [], n = /* @__PURE__ */ new Set(), r = t.tagName.toLowerCase(), i = (s) => {
    if (!(!s || n.has(s)))
      try {
        document.querySelector(s) === t && (n.add(s), e.push(s));
      } catch {
      }
  };
  t.id && i(`#${CSS.escape(t.id)}`);
  for (const s of nt) {
    const d = t.getAttribute(s);
    d && i(`${r}[${s}=${T(d)}]`);
  }
  const a = t.getAttribute("name");
  a && i(`${r}[name=${T(a)}]`);
  const l = t.getAttribute("aria-label");
  l && i(`[aria-label=${T(l)}]`);
  const c = Array.from(t.classList).filter(tt);
  c.length && i(`${r}.${c.map((s) => CSS.escape(s)).join(".")}`);
  for (const s of c) i(`${r}.${CSS.escape(s)}`);
  i(et(t)), i(H(t));
  const u = (t.textContent ?? "").replace(/\s+/g, " ").trim();
  if (u && u.length <= 50 && /^(a|button|summary|label|h[1-6])$/.test(r)) {
    const s = `text=${u}`;
    n.has(s) || (n.add(s), e.push(s));
  }
  return e.length === 0 && e.push(H(t)), e;
}
const ot = "a, button, summary, label, h1, h2, h3, h4, h5, h6";
function it(t, e) {
  if (t.startsWith("text=")) {
    const n = t.slice(5).trim();
    for (const r of Array.from(e.querySelectorAll(ot)))
      if ((r.textContent ?? "").replace(/\s+/g, " ").trim() === n) return r;
    return null;
  }
  try {
    return e.querySelector(t);
  } catch {
    return null;
  }
}
function R(t, e = document) {
  for (const n of t) {
    const r = it(n, e);
    if (r) return r;
  }
  return null;
}
function B(t, e = {}) {
  const n = e.root ?? document, r = R(t, n);
  return r ? Promise.resolve(r) : new Promise((i) => {
    let a = !1, l;
    const c = (d) => {
      a || (a = !0, u.disconnect(), l && clearTimeout(l), i(d));
    }, u = new MutationObserver(() => {
      const d = R(t, n);
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
let C = null;
function A() {
  if (C !== null) return C;
  try {
    C = new URLSearchParams(window.location.search).has("use_logs");
  } catch {
    C = !1;
  }
  return C;
}
function V(t) {
  const e = `[tours:${t}]`;
  return {
    log: (...n) => {
      A() && console.log(e, ...n);
    },
    warn: (...n) => {
      A() && console.warn(e, ...n);
    },
    error: (...n) => {
      A() && console.error(e, ...n);
    }
  };
}
function Et(t, e = {}) {
  const n = V("picker");
  let r = null, i = null, a = null, l = !1;
  function c(p) {
    if (p === r) return !0;
    for (const g of e.ignore ?? [])
      if (g && g.contains(p)) return !0;
    return !1;
  }
  function u() {
    if (r) return;
    r = document.createElement("div"), r.setAttribute("data-tours-picker", ""), i = r.attachShadow({ mode: "open" });
    const p = document.createElement("style");
    p.textContent = Z, i.appendChild(p), a = document.createElement("div"), a.className = "tours-picker-overlay", a.style.display = "none", i.appendChild(a);
    const g = document.createElement("div");
    g.className = "tours-picker-hint", g.textContent = "Hover and click an element • Esc to cancel", i.appendChild(g), document.body.appendChild(r);
  }
  function s(p, g) {
    const b = document.elementFromPoint(p, g);
    return !b || c(b) ? null : b;
  }
  function d(p) {
    if (!l || !a) return;
    const g = s(p.clientX, p.clientY);
    if (!g) {
      a.style.display = "none";
      return;
    }
    const b = g.getBoundingClientRect();
    a.style.display = "block", a.style.left = `${b.left}px`, a.style.top = `${b.top}px`, a.style.width = `${b.width}px`, a.style.height = `${b.height}px`;
  }
  function h(p) {
    if (!l) return;
    const g = s(p.clientX, p.clientY);
    if (p.preventDefault(), p.stopPropagation(), !g) return;
    const b = rt(g);
    n.log("picked", b), v(), t(b);
  }
  function w(p) {
    p.key === "Escape" && (p.preventDefault(), v());
  }
  function _() {
    l || (l = !0, n.log("start"), u(), document.addEventListener("mousemove", d, !0), document.addEventListener("click", h, !0), document.addEventListener("keydown", w, !0));
  }
  function v() {
    l && (l = !1, document.removeEventListener("mousemove", d, !0), document.removeEventListener("click", h, !0), document.removeEventListener("keydown", w, !0), r && r.parentNode && r.parentNode.removeChild(r), r = null, i = null, a = null);
  }
  return { start: _, stop: v };
}
const st = 6, at = 6, lt = 10, ct = 12;
function ut(t, e, n) {
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
function dt(t) {
  const { target: e, card: n, offset: r, viewport: i } = t, a = t.side === "auto", l = a ? ut(e, n, i) : t.side, c = a ? "center" : t.align, u = t.alignOffset ?? 0, s = c === "start" ? u : c === "end" ? -u : 0;
  let d = 0, h = 0;
  return l === "top" || l === "bottom" ? (d = l === "top" ? e.top - n.height - r : e.bottom + r, h = c === "start" ? e.left : c === "end" ? e.right - n.width : e.left + e.width / 2 - n.width / 2, h += s) : (h = l === "left" ? e.left - n.width - r : e.right + r, d = c === "start" ? e.top : c === "end" ? e.bottom - n.height : e.top + e.height / 2 - n.height / 2, d += s), h = Math.max(8, Math.min(h, i.width - n.width - 8)), d = Math.max(8, Math.min(d, i.height - n.height - 8)), { top: d, left: h };
}
function Y(t) {
  const e = document.createElement("button");
  return e.type = "button", e.className = `tours-card__btn${t.primary ? " tours-card__btn--primary" : ""}${t.disabled ? " tours-card__btn--disabled" : ""}`, e.textContent = t.label, !t.disabled && t.onClick && e.addEventListener("click", t.onClick), e;
}
function ft(t) {
  const e = document.createElement("div");
  if (e.className = `tours-card${t.ghost ? " tours-card--ghost" : ""}`, t.radius != null && (e.style.borderRadius = `${t.radius}px`), t.showClose) {
    const r = document.createElement("button");
    r.className = "tours-card__close", r.type = "button", r.textContent = "×", r.setAttribute("aria-label", "Close"), t.onClose && r.addEventListener("click", t.onClose), e.appendChild(r);
  }
  const n = document.createElement("div");
  if (n.className = "tours-card__content", t.contentHtml != null ? n.innerHTML = t.contentHtml : n.textContent = t.contentText ?? "", e.appendChild(n), t.back || t.next || t.progress) {
    const r = document.createElement("div");
    if (r.className = "tours-card__footer", t.back && r.appendChild(Y(t.back)), t.progress) {
      const i = document.createElement("span");
      i.className = "tours-card__progress", i.textContent = t.progress, r.appendChild(i);
    }
    t.next && r.appendChild(Y(t.next)), e.appendChild(r);
  }
  return e;
}
const pt = `
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
function ht(t) {
  const e = t.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*\*/g, "\0").replace(/\*/g, "[^/]*").replace(/ /g, ".*").replace(/\?/g, ".");
  return new RegExp(`^${e}$`);
}
function D(t, e) {
  if (!t) return !0;
  if (t.regex)
    try {
      return new RegExp(t.regex).test(e);
    } catch {
      return !1;
    }
  if (t.glob)
    try {
      return ht(t.glob).test(e);
    } catch {
      return !1;
    }
  return !0;
}
const P = "tours:locationchange";
let j = !1;
function gt() {
  if (!j) {
    j = !0;
    for (const t of ["pushState", "replaceState"]) {
      const e = history[t];
      history[t] = function(...r) {
        const i = e.apply(this, r);
        return window.dispatchEvent(new Event(P)), i;
      };
    }
  }
}
function mt(t) {
  return gt(), window.addEventListener("popstate", t), window.addEventListener("hashchange", t), window.addEventListener(P, t), () => {
    window.removeEventListener("popstate", t), window.removeEventListener("hashchange", t), window.removeEventListener(P, t);
  };
}
const z = "tours:progress";
function Ct() {
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
function bt(t) {
  const e = t.get(z);
  if (!e) return null;
  try {
    const n = JSON.parse(e);
    if (typeof n?.tourId == "string" && typeof n?.index == "number") return n;
  } catch {
  }
  return null;
}
function wt(t, e) {
  t.set(z, JSON.stringify(e));
}
function W(t) {
  t.remove(z);
}
const X = "tours:seen:";
function xt(t, e) {
  const n = t.get(X + e), r = n ? parseInt(n, 10) : 0;
  return Number.isNaN(r) ? 0 : r;
}
function kt(t, e) {
  t.set(X + e, String(xt(t, e) + 1));
}
function yt(t, e = {}) {
  const n = V("player"), r = e.state;
  let i = null, a = null, l = null, c = null, u = !1, s = 0, d = 0, h = null;
  const w = t.display?.padding ?? st, _ = t.display?.radius ?? at, v = t.display?.cardRadius ?? lt, p = t.display?.offset ?? ct;
  function g(o) {
    return R(o.selectors);
  }
  function b(o) {
    return D(o.pageUrl, window.location.href);
  }
  function E() {
    r && wt(r, { tourId: t.id, index: s });
  }
  function I() {
    if (i) return;
    i = document.createElement("div"), i.setAttribute("data-tours-player", ""), a = i.attachShadow({ mode: "open" });
    const o = document.createElement("style");
    o.textContent = Q + pt, a.appendChild(o);
    const f = document.createElement("div");
    f.className = "tours-backdrop", a.appendChild(f), l = document.createElement("div"), l.className = "tours-spotlight", l.style.borderRadius = `${_}px`, a.appendChild(l), document.body.appendChild(i);
  }
  function M(o, f = !1) {
    l && (l.style.transitionDuration = f ? "0ms" : "", l.style.display = "block", l.style.left = `${o.left - w}px`, l.style.top = `${o.top - w}px`, l.style.width = `${o.width + w * 2}px`, l.style.height = `${o.height + w * 2}px`);
  }
  function O(o, f) {
    if (!c) return;
    const m = {
      top: o.top - w,
      left: o.left - w,
      right: o.right + w,
      bottom: o.bottom + w,
      width: o.width + w * 2,
      height: o.height + w * 2
    }, { top: N, left: J } = dt({
      target: m,
      card: { width: c.offsetWidth, height: c.offsetHeight },
      side: f.placement ?? "bottom",
      align: f.align ?? "center",
      offset: p,
      alignOffset: t.display?.alignOffset ?? 0,
      viewport: { width: window.innerWidth, height: window.innerHeight }
    });
    c.style.left = `${J}px`, c.style.top = `${N}px`;
  }
  function q(o) {
    const f = Math.max(1, t.steps.length - d), m = Math.max(1, Math.min(s + 1 - d, f));
    c && c.remove(), c = ft({
      contentText: o.content.default,
      progress: `Step ${m} of ${f}`,
      showClose: !0,
      onClose: y,
      radius: v,
      back: { label: o.backLabel ?? "Back", disabled: s === 0, onClick: L },
      next: {
        label: o.nextLabel ?? (s === f - 1 ? "Done" : "Next"),
        primary: !0,
        onClick: $
      }
    }), a?.appendChild(c);
  }
  function x() {
    if (!u) return;
    const o = t.steps[s];
    if (!o) {
      y();
      return;
    }
    n.log("render step", s, o.id);
    const f = g(o);
    if (!f) {
      n.log(`step "${o.id}" target not found yet — waiting`, o.selectors), B(o.selectors, { timeout: 4e3 }).then((N) => {
        !u || t.steps[s] !== o || (N ? x() : (n.warn(`step "${o.id}" skipped: no element for selectors`, o.selectors), d += 1, s < t.steps.length - 1 ? (s += 1, x()) : y()));
      });
      return;
    }
    I(), f.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" }), q(o);
    const m = f.getBoundingClientRect();
    M(m), O(m, o);
  }
  function U(o) {
    u && (o.key === "Escape" ? (o.preventDefault(), y()) : o.key === "ArrowRight" ? $() : o.key === "ArrowLeft" && L());
  }
  function k() {
    if (!u) return;
    const o = t.steps[s];
    if (!o) return;
    const f = g(o);
    if (!f) return;
    const m = f.getBoundingClientRect();
    M(m, !0), O(m, o);
  }
  function K(o = 0) {
    u || t.steps.length !== 0 && (u = !0, s = Math.max(0, Math.min(o, t.steps.length - 1)), d = 0, n.log("start", t.id, `at ${s}/${t.steps.length}`), I(), window.addEventListener("keydown", U, !0), window.addEventListener("resize", k, !0), window.addEventListener("scroll", k, !0), E(), x());
  }
  function G() {
    l && (l.style.display = "none"), c && (c.remove(), c = null);
  }
  function S() {
    G(), !h && (h = mt(() => {
      if (!u) {
        h?.(), h = null;
        return;
      }
      const o = t.steps[s];
      o && b(o) && (h?.(), h = null, x());
    }));
  }
  function F() {
    h && (h(), h = null), u && (u = !1, window.removeEventListener("keydown", U, !0), window.removeEventListener("resize", k, !0), window.removeEventListener("scroll", k, !0), i && i.parentNode && i.parentNode.removeChild(i), i = null, a = null, l = null, c = null);
  }
  function y() {
    n.log("stop"), F(), r && W(r);
  }
  function $() {
    if (!u) return;
    const o = s + 1, f = t.steps[o];
    if (!f) {
      y();
      return;
    }
    if (b(f)) {
      s = o, E(), x();
      return;
    }
    s = o, E();
    const m = t.steps[s - 1]?.action;
    if (m && m.type === "navigate" && m.url) {
      m.url.startsWith("#") ? (n.log("page transition (hash navigate) → resume at", s), S(), window.location.hash = m.url) : (n.log("page transition (navigate) → resume at", s), F(), window.location.assign(m.url));
      return;
    }
    n.log("page transition (wait) → resume at", s), S();
  }
  function L() {
    if (!u) return;
    const o = t.steps[s - 1];
    if (o) {
      if (b(o)) {
        s -= 1, E(), x();
        return;
      }
      s -= 1, E(), n.log("page transition back → resume at", s), S(), window.history.back();
    }
  }
  return { start: K, stop: y, next: $, prev: L };
}
function _t(t, e = {}) {
  const n = e.state;
  if (!n) return null;
  const r = bt(n);
  if (!r || r.tourId !== t.id) return null;
  const i = t.steps[r.index];
  if (!i)
    return W(n), null;
  if (!D(i.pageUrl, window.location.href)) return null;
  const a = yt(t, { state: n });
  return a.start(r.index), a;
}
function St(t, e) {
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
      return B([n.selector], { timeout: 0 }).then((l) => {
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
function $t(t = window.innerWidth) {
  return t <= 640 ? "mobile" : t <= 1024 ? "tablet" : "desktop";
}
function vt(t, e) {
  return !(t.url && !D(t.url, e.url) || t.role !== void 0 && t.role !== e.role || t.firstVisitOnly && !e.firstVisit || t.device && t.device !== e.device || t.unlessSeen && e.seenCount > 0 || t.maxShows !== void 0 && e.seenCount >= t.maxShows);
}
function Lt(t, e) {
  return !t || t.length === 0 ? !0 : t.some((n) => vt(n.when, e));
}
export {
  pt as CARD_STYLES,
  z as PROGRESS_KEY,
  St as armTrigger,
  ut as autoSide,
  rt as buildSelectors,
  W as clearProgress,
  Ct as createLocalState,
  V as createLogger,
  Et as createPicker,
  yt as createPlayer,
  $t as detectDevice,
  A as isLoggingEnabled,
  kt as markSeen,
  Lt as matchRules,
  D as matchUrl,
  dt as placeCard,
  bt as readProgress,
  ft as renderCard,
  R as resolveElement,
  _t as resumeTour,
  xt as seenCount,
  B as waitForElement,
  wt as writeProgress
};
