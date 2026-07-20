const V = `
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
`, Z = `
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
function N(t) {
  return JSON.stringify(t);
}
function Q(t) {
  return /^[a-zA-Z][\w-]*$/.test(t) && t.length <= 30 && !/\d{2,}/.test(t) && !/^(css-|sc-|jsx-|emotion-|_|is-|has-)/.test(t);
}
function F(t) {
  const e = [];
  let r = t;
  for (; r && r !== document.body && r.nodeType === 1; ) {
    const n = r.tagName.toLowerCase(), i = r.parentElement;
    if (!i) {
      e.unshift(n);
      break;
    }
    const a = Array.from(i.children).filter((l) => l.tagName === r.tagName);
    e.unshift(a.length > 1 ? `${n}:nth-of-type(${a.indexOf(r) + 1})` : n), r = i;
  }
  return `body > ${e.join(" > ")}`;
}
function tt(t) {
  let e = t.parentElement;
  for (; e && e !== document.body && !e.id; )
    e = e.parentElement;
  if (!e || !e.id) return null;
  const r = [];
  let n = t;
  for (; n && n !== e; ) {
    const i = n.tagName.toLowerCase(), a = n.parentElement;
    if (!a) return null;
    const l = Array.from(a.children).filter((c) => c.tagName === n.tagName);
    r.unshift(l.length > 1 ? `${i}:nth-of-type(${l.indexOf(n) + 1})` : i), n = a;
  }
  return `#${CSS.escape(e.id)} > ${r.join(" > ")}`;
}
const et = ["data-testid", "data-test", "data-test-id", "data-cy", "data-qa", "data-id", "data-name"];
function nt(t) {
  const e = [], r = /* @__PURE__ */ new Set(), n = t.tagName.toLowerCase(), i = (s) => {
    if (!(!s || r.has(s)))
      try {
        document.querySelector(s) === t && (r.add(s), e.push(s));
      } catch {
      }
  };
  t.id && i(`#${CSS.escape(t.id)}`);
  for (const s of et) {
    const u = t.getAttribute(s);
    u && i(`${n}[${s}=${N(u)}]`);
  }
  const a = t.getAttribute("name");
  a && i(`${n}[name=${N(a)}]`);
  const l = t.getAttribute("aria-label");
  l && i(`[aria-label=${N(l)}]`);
  const c = Array.from(t.classList).filter(Q);
  c.length && i(`${n}.${c.map((s) => CSS.escape(s)).join(".")}`);
  for (const s of c) i(`${n}.${CSS.escape(s)}`);
  i(tt(t)), i(F(t));
  const d = (t.textContent ?? "").replace(/\s+/g, " ").trim();
  if (d && d.length <= 50 && /^(a|button|summary|label|h[1-6])$/.test(n)) {
    const s = `text=${d}`;
    r.has(s) || (r.add(s), e.push(s));
  }
  return e.length === 0 && e.push(F(t)), e;
}
const rt = "a, button, summary, label, h1, h2, h3, h4, h5, h6";
function ot(t, e) {
  if (t.startsWith("text=")) {
    const r = t.slice(5).trim();
    for (const n of Array.from(e.querySelectorAll(rt)))
      if ((n.textContent ?? "").replace(/\s+/g, " ").trim() === r) return n;
    return null;
  }
  try {
    return e.querySelector(t);
  } catch {
    return null;
  }
}
function R(t, e = document) {
  for (const r of t) {
    const n = ot(r, e);
    if (n) return n;
  }
  return null;
}
function j(t, e = {}) {
  const r = e.root ?? document, n = R(t, r);
  return n ? Promise.resolve(n) : new Promise((i) => {
    let a = !1, l;
    const c = (u) => {
      a || (a = !0, d.disconnect(), l && clearTimeout(l), i(u));
    }, d = new MutationObserver(() => {
      const u = R(t, r);
      u && c(u);
    });
    d.observe(document.documentElement, {
      childList: !0,
      subtree: !0,
      attributes: !0
    });
    const s = e.timeout ?? 4e3;
    s > 0 && Number.isFinite(s) && (l = setTimeout(() => c(null), s));
  });
}
let k = null;
function A() {
  if (k !== null) return k;
  try {
    k = new URLSearchParams(window.location.search).has("use_logs");
  } catch {
    k = !1;
  }
  return k;
}
function B(t) {
  const e = `[tours:${t}]`;
  return {
    log: (...r) => {
      A() && console.log(e, ...r);
    },
    warn: (...r) => {
      A() && console.warn(e, ...r);
    },
    error: (...r) => {
      A() && console.error(e, ...r);
    }
  };
}
function wt(t, e = {}) {
  const r = B("picker");
  let n = null, i = null, a = null, l = !1;
  function c(f) {
    if (f === n) return !0;
    for (const g of e.ignore ?? [])
      if (g && g.contains(f)) return !0;
    return !1;
  }
  function d() {
    if (n) return;
    n = document.createElement("div"), n.setAttribute("data-tours-picker", ""), i = n.attachShadow({ mode: "open" });
    const f = document.createElement("style");
    f.textContent = V, i.appendChild(f), a = document.createElement("div"), a.className = "tours-picker-overlay", a.style.display = "none", i.appendChild(a);
    const g = document.createElement("div");
    g.className = "tours-picker-hint", g.textContent = "Hover and click an element • Esc to cancel", i.appendChild(g), document.body.appendChild(n);
  }
  function s(f, g) {
    const b = document.elementFromPoint(f, g);
    return !b || c(b) ? null : b;
  }
  function u(f) {
    if (!l || !a) return;
    const g = s(f.clientX, f.clientY);
    if (!g) {
      a.style.display = "none";
      return;
    }
    const b = g.getBoundingClientRect();
    a.style.display = "block", a.style.left = `${b.left}px`, a.style.top = `${b.top}px`, a.style.width = `${b.width}px`, a.style.height = `${b.height}px`;
  }
  function p(f) {
    if (!l) return;
    const g = s(f.clientX, f.clientY);
    if (f.preventDefault(), f.stopPropagation(), !g) return;
    const b = nt(g);
    r.log("picked", b), v(), t(b);
  }
  function x(f) {
    f.key === "Escape" && (f.preventDefault(), v());
  }
  function _() {
    l || (l = !0, r.log("start"), d(), document.addEventListener("mousemove", u, !0), document.addEventListener("click", p, !0), document.addEventListener("keydown", x, !0));
  }
  function v() {
    l && (l = !1, document.removeEventListener("mousemove", u, !0), document.removeEventListener("click", p, !0), document.removeEventListener("keydown", x, !0), n && n.parentNode && n.parentNode.removeChild(n), n = null, i = null, a = null);
  }
  return { start: _, stop: v };
}
const it = 6, st = 6, at = 10, lt = 12;
function ct(t, e, r) {
  const n = {
    top: t.top,
    bottom: r.height - t.bottom,
    left: t.left,
    right: r.width - t.right
  }, i = {
    top: e.height,
    bottom: e.height,
    left: e.width,
    right: e.width
  }, a = ["bottom", "top", "right", "left"], l = a.find((c) => n[c] >= i[c] + 8);
  return l || a.reduce((c, d) => n[d] > n[c] ? d : c, a[0]);
}
function dt(t) {
  const { target: e, card: r, offset: n, viewport: i } = t, a = t.side === "auto", l = a ? ct(e, r, i) : t.side, c = a ? "center" : t.align, d = t.alignOffset ?? 0, s = c === "start" ? d : c === "end" ? -d : 0;
  let u = 0, p = 0;
  return l === "top" || l === "bottom" ? (u = l === "top" ? e.top - r.height - n : e.bottom + n, p = c === "start" ? e.left : c === "end" ? e.right - r.width : e.left + e.width / 2 - r.width / 2, p += s) : (p = l === "left" ? e.left - r.width - n : e.right + n, u = c === "start" ? e.top : c === "end" ? e.bottom - r.height : e.top + e.height / 2 - r.height / 2, u += s), p = Math.max(8, Math.min(p, i.width - r.width - 8)), u = Math.max(8, Math.min(u, i.height - r.height - 8)), { top: u, left: p };
}
function H(t) {
  const e = document.createElement("button");
  return e.type = "button", e.className = `tours-card__btn${t.primary ? " tours-card__btn--primary" : ""}${t.disabled ? " tours-card__btn--disabled" : ""}`, e.textContent = t.label, !t.disabled && t.onClick && e.addEventListener("click", t.onClick), e;
}
function ut(t) {
  const e = document.createElement("div");
  if (e.className = `tours-card${t.ghost ? " tours-card--ghost" : ""}`, t.radius != null && (e.style.borderRadius = `${t.radius}px`), t.showClose) {
    const n = document.createElement("button");
    n.className = "tours-card__close", n.type = "button", n.textContent = "×", n.setAttribute("aria-label", "Close"), t.onClose && n.addEventListener("click", t.onClose), e.appendChild(n);
  }
  const r = document.createElement("div");
  if (r.className = "tours-card__content", t.contentHtml != null ? r.innerHTML = t.contentHtml : r.textContent = t.contentText ?? "", e.appendChild(r), t.back || t.next || t.progress) {
    const n = document.createElement("div");
    if (n.className = "tours-card__footer", t.back && n.appendChild(H(t.back)), t.progress) {
      const i = document.createElement("span");
      i.className = "tours-card__progress", i.textContent = t.progress, n.appendChild(i);
    }
    t.next && n.appendChild(H(t.next)), e.appendChild(n);
  }
  return e;
}
const ft = `
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
function pt(t) {
  const e = t.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*\*/g, "\0").replace(/\*/g, "[^/]*").replace(/ /g, ".*").replace(/\?/g, ".");
  return new RegExp(`^${e}$`);
}
function q(t, e) {
  if (!t) return !0;
  if (t.regex)
    try {
      return new RegExp(t.regex).test(e);
    } catch {
      return !1;
    }
  if (t.glob)
    try {
      return pt(t.glob).test(e);
    } catch {
      return !1;
    }
  return !0;
}
const P = "tours:locationchange";
let Y = !1;
function ht() {
  if (!Y) {
    Y = !0;
    for (const t of ["pushState", "replaceState"]) {
      const e = history[t];
      history[t] = function(...n) {
        const i = e.apply(this, n);
        return window.dispatchEvent(new Event(P)), i;
      };
    }
  }
}
function gt(t) {
  return ht(), window.addEventListener("popstate", t), window.addEventListener("hashchange", t), window.addEventListener(P, t), () => {
    window.removeEventListener("popstate", t), window.removeEventListener("hashchange", t), window.removeEventListener(P, t);
  };
}
const D = "tours:progress";
function yt() {
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
function mt(t) {
  const e = t.get(D);
  if (!e) return null;
  try {
    const r = JSON.parse(e);
    if (typeof r?.tourId == "string" && typeof r?.index == "number") return r;
  } catch {
  }
  return null;
}
function bt(t, e) {
  t.set(D, JSON.stringify(e));
}
function K(t) {
  t.remove(D);
}
function xt(t, e = {}) {
  const r = B("player"), n = e.state;
  let i = null, a = null, l = null, c = null, d = !1, s = 0, u = 0, p = null;
  const x = t.display?.padding ?? it, _ = t.display?.radius ?? st, v = t.display?.cardRadius ?? at, f = t.display?.offset ?? lt;
  function g(o) {
    return R(o.selectors);
  }
  function b(o) {
    return q(o.pageUrl, window.location.href);
  }
  function E() {
    n && bt(n, { tourId: t.id, index: s });
  }
  function z() {
    if (i) return;
    i = document.createElement("div"), i.setAttribute("data-tours-player", ""), a = i.attachShadow({ mode: "open" });
    const o = document.createElement("style");
    o.textContent = Z + ft, a.appendChild(o);
    const h = document.createElement("div");
    h.className = "tours-backdrop", a.appendChild(h), l = document.createElement("div"), l.className = "tours-spotlight", l.style.borderRadius = `${_}px`, a.appendChild(l), document.body.appendChild(i);
  }
  function M(o) {
    l && (l.style.display = "block", l.style.left = `${o.left - x}px`, l.style.top = `${o.top - x}px`, l.style.width = `${o.width + x * 2}px`, l.style.height = `${o.height + x * 2}px`);
  }
  function U(o, h) {
    if (!c) return;
    const m = {
      top: o.top - x,
      left: o.left - x,
      right: o.right + x,
      bottom: o.bottom + x,
      width: o.width + x * 2,
      height: o.height + x * 2
    }, { top: T, left: J } = dt({
      target: m,
      card: { width: c.offsetWidth, height: c.offsetHeight },
      side: h.placement ?? "bottom",
      align: h.align ?? "center",
      offset: f,
      alignOffset: t.display?.alignOffset ?? 0,
      viewport: { width: window.innerWidth, height: window.innerHeight }
    });
    c.style.left = `${J}px`, c.style.top = `${T}px`;
  }
  function W(o) {
    const h = Math.max(1, t.steps.length - u), m = Math.max(1, Math.min(s + 1 - u, h));
    c && c.remove(), c = ut({
      contentText: o.content.default,
      progress: `Step ${m} of ${h}`,
      showClose: !0,
      onClose: y,
      radius: v,
      back: { label: o.backLabel ?? "Back", disabled: s === 0, onClick: L },
      next: {
        label: o.nextLabel ?? (s === h - 1 ? "Done" : "Next"),
        primary: !0,
        onClick: S
      }
    }), a?.appendChild(c);
  }
  function w() {
    if (!d) return;
    const o = t.steps[s];
    if (!o) {
      y();
      return;
    }
    r.log("render step", s, o.id);
    const h = g(o);
    if (!h) {
      r.log(`step "${o.id}" target not found yet — waiting`, o.selectors), j(o.selectors, { timeout: 4e3 }).then((T) => {
        !d || t.steps[s] !== o || (T ? w() : (r.warn(`step "${o.id}" skipped: no element for selectors`, o.selectors), u += 1, s < t.steps.length - 1 ? (s += 1, w()) : y()));
      });
      return;
    }
    z(), h.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" }), W(o);
    const m = h.getBoundingClientRect();
    M(m), U(m, o);
  }
  function I(o) {
    d && (o.key === "Escape" ? (o.preventDefault(), y()) : o.key === "ArrowRight" ? S() : o.key === "ArrowLeft" && L());
  }
  function C() {
    if (!d) return;
    const o = t.steps[s];
    if (!o) return;
    const h = g(o);
    if (!h) return;
    const m = h.getBoundingClientRect();
    M(m), U(m, o);
  }
  function X(o = 0) {
    d || t.steps.length !== 0 && (d = !0, s = Math.max(0, Math.min(o, t.steps.length - 1)), u = 0, r.log("start", t.id, `at ${s}/${t.steps.length}`), z(), window.addEventListener("keydown", I, !0), window.addEventListener("resize", C, !0), window.addEventListener("scroll", C, !0), E(), w());
  }
  function G() {
    l && (l.style.display = "none"), c && (c.remove(), c = null);
  }
  function $() {
    G(), !p && (p = gt(() => {
      if (!d) {
        p?.(), p = null;
        return;
      }
      const o = t.steps[s];
      o && b(o) && (p?.(), p = null, w());
    }));
  }
  function O() {
    p && (p(), p = null), d && (d = !1, window.removeEventListener("keydown", I, !0), window.removeEventListener("resize", C, !0), window.removeEventListener("scroll", C, !0), i && i.parentNode && i.parentNode.removeChild(i), i = null, a = null, l = null, c = null);
  }
  function y() {
    r.log("stop"), O(), n && K(n);
  }
  function S() {
    if (!d) return;
    const o = s + 1, h = t.steps[o];
    if (!h) {
      y();
      return;
    }
    if (b(h)) {
      s = o, E(), w();
      return;
    }
    s = o, E();
    const m = t.steps[s - 1]?.action;
    if (m && m.type === "navigate" && m.url) {
      m.url.startsWith("#") ? (r.log("page transition (hash navigate) → resume at", s), $(), window.location.hash = m.url) : (r.log("page transition (navigate) → resume at", s), O(), window.location.assign(m.url));
      return;
    }
    r.log("page transition (wait) → resume at", s), $();
  }
  function L() {
    if (!d) return;
    const o = t.steps[s - 1];
    if (o) {
      if (b(o)) {
        s -= 1, E(), w();
        return;
      }
      s -= 1, E(), r.log("page transition back → resume at", s), $(), window.history.back();
    }
  }
  return { start: X, stop: y, next: S, prev: L };
}
function vt(t, e = {}) {
  const r = e.state;
  if (!r) return null;
  const n = mt(r);
  if (!n || n.tourId !== t.id) return null;
  const i = t.steps[n.index];
  if (!i)
    return K(r), null;
  if (!q(i.pageUrl, window.location.href)) return null;
  const a = xt(t, { state: r });
  return a.start(n.index), a;
}
function Et(t, e) {
  const r = t.trigger ?? { type: "manual" };
  let n = !1;
  const i = () => {
    n || (n = !0, e());
  };
  switch (r.type) {
    case "load": {
      const a = setTimeout(i, 0);
      return () => clearTimeout(a);
    }
    case "timer": {
      const a = setTimeout(i, Math.max(0, r.delay));
      return () => clearTimeout(a);
    }
    case "selector": {
      let a = !1;
      return j([r.selector], { timeout: 0 }).then((l) => {
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
export {
  ft as CARD_STYLES,
  D as PROGRESS_KEY,
  Et as armTrigger,
  ct as autoSide,
  nt as buildSelectors,
  K as clearProgress,
  yt as createLocalState,
  B as createLogger,
  wt as createPicker,
  xt as createPlayer,
  A as isLoggingEnabled,
  q as matchUrl,
  dt as placeCard,
  mt as readProgress,
  ut as renderCard,
  R as resolveElement,
  vt as resumeTour,
  j as waitForElement,
  bt as writeProgress
};
