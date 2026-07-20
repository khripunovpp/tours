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
`, W = `
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
function $(t) {
  return JSON.stringify(t);
}
function Z(t) {
  return /^[a-zA-Z][\w-]*$/.test(t) && t.length <= 30 && !/\d{2,}/.test(t) && !/^(css-|sc-|jsx-|emotion-|_|is-|has-)/.test(t);
}
function H(t) {
  const e = [];
  let r = t;
  for (; r && r !== document.body && r.nodeType === 1; ) {
    const n = r.tagName.toLowerCase(), o = r.parentElement;
    if (!o) {
      e.unshift(n);
      break;
    }
    const a = Array.from(o.children).filter((c) => c.tagName === r.tagName);
    e.unshift(a.length > 1 ? `${n}:nth-of-type(${a.indexOf(r) + 1})` : n), r = o;
  }
  return `body > ${e.join(" > ")}`;
}
function Q(t) {
  let e = t.parentElement;
  for (; e && e !== document.body && !e.id; )
    e = e.parentElement;
  if (!e || !e.id) return null;
  const r = [];
  let n = t;
  for (; n && n !== e; ) {
    const o = n.tagName.toLowerCase(), a = n.parentElement;
    if (!a) return null;
    const c = Array.from(a.children).filter((l) => l.tagName === n.tagName);
    r.unshift(c.length > 1 ? `${o}:nth-of-type(${c.indexOf(n) + 1})` : o), n = a;
  }
  return `#${CSS.escape(e.id)} > ${r.join(" > ")}`;
}
const tt = ["data-testid", "data-test", "data-test-id", "data-cy", "data-qa", "data-id", "data-name"];
function et(t) {
  const e = [], r = /* @__PURE__ */ new Set(), n = t.tagName.toLowerCase(), o = (i) => {
    if (!(!i || r.has(i)))
      try {
        document.querySelector(i) === t && (r.add(i), e.push(i));
      } catch {
      }
  };
  t.id && o(`#${CSS.escape(t.id)}`);
  for (const i of tt) {
    const d = t.getAttribute(i);
    d && o(`${n}[${i}=${$(d)}]`);
  }
  const a = t.getAttribute("name");
  a && o(`${n}[name=${$(a)}]`);
  const c = t.getAttribute("aria-label");
  c && o(`[aria-label=${$(c)}]`);
  const l = Array.from(t.classList).filter(Z);
  l.length && o(`${n}.${l.map((i) => CSS.escape(i)).join(".")}`);
  for (const i of l) o(`${n}.${CSS.escape(i)}`);
  o(Q(t)), o(H(t));
  const u = (t.textContent ?? "").replace(/\s+/g, " ").trim();
  if (u && u.length <= 50 && /^(a|button|summary|label|h[1-6])$/.test(n)) {
    const i = `text=${u}`;
    r.has(i) || (r.add(i), e.push(i));
  }
  return e.length === 0 && e.push(H(t)), e;
}
const nt = "a, button, summary, label, h1, h2, h3, h4, h5, h6";
function rt(t, e) {
  if (t.startsWith("text=")) {
    const r = t.slice(5).trim();
    for (const n of Array.from(e.querySelectorAll(nt)))
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
    const n = rt(r, e);
    if (n) return n;
  }
  return null;
}
function q(t, e = {}) {
  const r = e.root ?? document, n = R(t, r);
  return n ? Promise.resolve(n) : new Promise((o) => {
    let a = !1, c;
    const l = (d) => {
      a || (a = !0, u.disconnect(), c && clearTimeout(c), o(d));
    }, u = new MutationObserver(() => {
      const d = R(t, r);
      d && l(d);
    });
    u.observe(document.documentElement, {
      childList: !0,
      subtree: !0,
      attributes: !0
    });
    const i = e.timeout ?? 4e3;
    i > 0 && Number.isFinite(i) && (c = setTimeout(() => l(null), i));
  });
}
let E = null;
function T() {
  if (E !== null) return E;
  try {
    E = new URLSearchParams(window.location.search).has("use_logs");
  } catch {
    E = !1;
  }
  return E;
}
function X(t) {
  const e = `[tours:${t}]`;
  return {
    log: (...r) => {
      T() && console.log(e, ...r);
    },
    warn: (...r) => {
      T() && console.warn(e, ...r);
    },
    error: (...r) => {
      T() && console.error(e, ...r);
    }
  };
}
function xt(t, e = {}) {
  const r = X("picker");
  let n = null, o = null, a = null, c = !1;
  function l(p) {
    if (p === n) return !0;
    for (const h of e.ignore ?? [])
      if (h && h.contains(p)) return !0;
    return !1;
  }
  function u() {
    if (n) return;
    n = document.createElement("div"), n.setAttribute("data-tours-picker", ""), o = n.attachShadow({ mode: "open" });
    const p = document.createElement("style");
    p.textContent = V, o.appendChild(p), a = document.createElement("div"), a.className = "tours-picker-overlay", a.style.display = "none", o.appendChild(a);
    const h = document.createElement("div");
    h.className = "tours-picker-hint", h.textContent = "Hover and click an element • Esc to cancel", o.appendChild(h), document.body.appendChild(n);
  }
  function i(p, h) {
    const m = document.elementFromPoint(p, h);
    return !m || l(m) ? null : m;
  }
  function d(p) {
    if (!c || !a) return;
    const h = i(p.clientX, p.clientY);
    if (!h) {
      a.style.display = "none";
      return;
    }
    const m = h.getBoundingClientRect();
    a.style.display = "block", a.style.left = `${m.left}px`, a.style.top = `${m.top}px`, a.style.width = `${m.width}px`, a.style.height = `${m.height}px`;
  }
  function f(p) {
    if (!c) return;
    const h = i(p.clientX, p.clientY);
    if (p.preventDefault(), p.stopPropagation(), !h) return;
    const m = et(h);
    r.log("picked", m), v(), t(m);
  }
  function w(p) {
    p.key === "Escape" && (p.preventDefault(), v());
  }
  function k() {
    c || (c = !0, r.log("start"), u(), document.addEventListener("mousemove", d, !0), document.addEventListener("click", f, !0), document.addEventListener("keydown", w, !0));
  }
  function v() {
    c && (c = !1, document.removeEventListener("mousemove", d, !0), document.removeEventListener("click", f, !0), document.removeEventListener("keydown", w, !0), n && n.parentNode && n.parentNode.removeChild(n), n = null, o = null, a = null);
  }
  return { start: k, stop: v };
}
const ot = 6, it = 6, st = 10, at = 12;
function ct(t, e, r) {
  const n = {
    top: t.top,
    bottom: r.height - t.bottom,
    left: t.left,
    right: r.width - t.right
  }, o = {
    top: e.height,
    bottom: e.height,
    left: e.width,
    right: e.width
  }, a = ["bottom", "top", "right", "left"], c = a.find((l) => n[l] >= o[l] + 8);
  return c || a.reduce((l, u) => n[u] > n[l] ? u : l, a[0]);
}
function lt(t) {
  const { target: e, card: r, offset: n, viewport: o } = t, a = t.side === "auto", c = a ? ct(e, r, o) : t.side, l = a ? "center" : t.align, u = t.alignOffset ?? 0, i = l === "start" ? u : l === "end" ? -u : 0;
  let d = 0, f = 0;
  return c === "top" || c === "bottom" ? (d = c === "top" ? e.top - r.height - n : e.bottom + n, f = l === "start" ? e.left : l === "end" ? e.right - r.width : e.left + e.width / 2 - r.width / 2, f += i) : (f = c === "left" ? e.left - r.width - n : e.right + n, d = l === "start" ? e.top : l === "end" ? e.bottom - r.height : e.top + e.height / 2 - r.height / 2, d += i), f = Math.max(8, Math.min(f, o.width - r.width - 8)), d = Math.max(8, Math.min(d, o.height - r.height - 8)), { top: d, left: f };
}
function F(t) {
  const e = document.createElement("button");
  return e.type = "button", e.className = `tours-card__btn${t.primary ? " tours-card__btn--primary" : ""}${t.disabled ? " tours-card__btn--disabled" : ""}`, e.textContent = t.label, !t.disabled && t.onClick && e.addEventListener("click", t.onClick), e;
}
function dt(t) {
  const e = document.createElement("div");
  if (e.className = `tours-card${t.ghost ? " tours-card--ghost" : ""}`, t.radius != null && (e.style.borderRadius = `${t.radius}px`), t.showClose) {
    const n = document.createElement("button");
    n.className = "tours-card__close", n.type = "button", n.textContent = "×", n.setAttribute("aria-label", "Close"), t.onClose && n.addEventListener("click", t.onClose), e.appendChild(n);
  }
  const r = document.createElement("div");
  if (r.className = "tours-card__content", t.contentHtml != null ? r.innerHTML = t.contentHtml : r.textContent = t.contentText ?? "", e.appendChild(r), t.back || t.next || t.progress) {
    const n = document.createElement("div");
    if (n.className = "tours-card__footer", t.back && n.appendChild(F(t.back)), t.progress) {
      const o = document.createElement("span");
      o.className = "tours-card__progress", o.textContent = t.progress, n.appendChild(o);
    }
    t.next && n.appendChild(F(t.next)), e.appendChild(n);
  }
  return e;
}
const ut = `
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
function ft(t) {
  const e = t.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*\*/g, "\0").replace(/\*/g, "[^/]*").replace(/ /g, ".*").replace(/\?/g, ".");
  return new RegExp(`^${e}$`);
}
function Y(t, e) {
  if (!t) return !0;
  if (t.regex)
    try {
      return new RegExp(t.regex).test(e);
    } catch {
      return !1;
    }
  if (t.glob)
    try {
      return ft(t.glob).test(e);
    } catch {
      return !1;
    }
  return !0;
}
const N = "tours:locationchange";
let I = !1;
function pt() {
  if (!I) {
    I = !0;
    for (const t of ["pushState", "replaceState"]) {
      const e = history[t];
      history[t] = function(...n) {
        const o = e.apply(this, n);
        return window.dispatchEvent(new Event(N)), o;
      };
    }
  }
}
function ht(t) {
  return pt(), window.addEventListener("popstate", t), window.addEventListener("hashchange", t), window.addEventListener(N, t), () => {
    window.removeEventListener("popstate", t), window.removeEventListener("hashchange", t), window.removeEventListener(N, t);
  };
}
const A = "tours:progress";
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
function gt(t) {
  const e = t.get(A);
  if (!e) return null;
  try {
    const r = JSON.parse(e);
    if (typeof r?.tourId == "string" && typeof r?.index == "number") return r;
  } catch {
  }
  return null;
}
function mt(t, e) {
  t.set(A, JSON.stringify(e));
}
function j(t) {
  t.remove(A);
}
function bt(t, e = {}) {
  const r = X("player"), n = e.state;
  let o = null, a = null, c = null, l = null, u = !1, i = 0, d = null;
  const f = t.display?.padding ?? ot, w = t.display?.radius ?? it, k = t.display?.cardRadius ?? st, v = t.display?.offset ?? at;
  function p(s) {
    return R(s.selectors);
  }
  function h(s) {
    return Y(s.pageUrl, window.location.href);
  }
  function m() {
    n && mt(n, { tourId: t.id, index: i });
  }
  function M() {
    if (o) return;
    o = document.createElement("div"), o.setAttribute("data-tours-player", ""), a = o.attachShadow({ mode: "open" });
    const s = document.createElement("style");
    s.textContent = W + ut, a.appendChild(s);
    const g = document.createElement("div");
    g.className = "tours-backdrop", a.appendChild(g), c = document.createElement("div"), c.className = "tours-spotlight", c.style.borderRadius = `${w}px`, a.appendChild(c), document.body.appendChild(o);
  }
  function P(s) {
    c && (c.style.display = "block", c.style.left = `${s.left - f}px`, c.style.top = `${s.top - f}px`, c.style.width = `${s.width + f * 2}px`, c.style.height = `${s.height + f * 2}px`);
  }
  function U(s, g) {
    if (!l) return;
    const b = {
      top: s.top - f,
      left: s.left - f,
      right: s.right + f,
      bottom: s.bottom + f,
      width: s.width + f * 2,
      height: s.height + f * 2
    }, { top: S, left: J } = lt({
      target: b,
      card: { width: l.offsetWidth, height: l.offsetHeight },
      side: g.placement ?? "bottom",
      align: g.align ?? "center",
      offset: v,
      alignOffset: t.display?.alignOffset ?? 0,
      viewport: { width: window.innerWidth, height: window.innerHeight }
    });
    l.style.left = `${J}px`, l.style.top = `${S}px`;
  }
  function B(s) {
    const g = t.steps.length;
    l && l.remove(), l = dt({
      contentText: s.content.default,
      progress: `Step ${i + 1} of ${g}`,
      showClose: !0,
      onClose: y,
      radius: k,
      back: { label: s.backLabel ?? "Back", disabled: i === 0, onClick: L },
      next: {
        label: s.nextLabel ?? (i === g - 1 ? "Done" : "Next"),
        primary: !0,
        onClick: _
      }
    }), a?.appendChild(l);
  }
  function x() {
    if (!u) return;
    const s = t.steps[i];
    if (!s) {
      y();
      return;
    }
    r.log("render step", i, s.id);
    const g = p(s);
    if (!g) {
      r.log(`step "${s.id}" target not found yet — waiting`, s.selectors), q(s.selectors, { timeout: 4e3 }).then((S) => {
        !u || t.steps[i] !== s || (S ? x() : (r.warn(`step "${s.id}" skipped: no element for selectors`, s.selectors), i < t.steps.length - 1 ? (i += 1, x()) : y()));
      });
      return;
    }
    M(), g.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" }), B(s);
    const b = g.getBoundingClientRect();
    P(b), U(b, s);
  }
  function D(s) {
    u && (s.key === "Escape" ? (s.preventDefault(), y()) : s.key === "ArrowRight" ? _() : s.key === "ArrowLeft" && L());
  }
  function C() {
    if (!u) return;
    const s = t.steps[i];
    if (!s) return;
    const g = p(s);
    if (!g) return;
    const b = g.getBoundingClientRect();
    P(b), U(b, s);
  }
  function K(s = 0) {
    u || t.steps.length !== 0 && (u = !0, i = Math.max(0, Math.min(s, t.steps.length - 1)), r.log("start", t.id, `at ${i}/${t.steps.length}`), M(), window.addEventListener("keydown", D, !0), window.addEventListener("resize", C, !0), window.addEventListener("scroll", C, !0), m(), x());
  }
  function G() {
    c && (c.style.display = "none"), l && (l.remove(), l = null);
  }
  function O() {
    G(), !d && (d = ht(() => {
      if (!u) {
        d?.(), d = null;
        return;
      }
      const s = t.steps[i];
      s && h(s) && (d?.(), d = null, x());
    }));
  }
  function z() {
    d && (d(), d = null), u && (u = !1, window.removeEventListener("keydown", D, !0), window.removeEventListener("resize", C, !0), window.removeEventListener("scroll", C, !0), o && o.parentNode && o.parentNode.removeChild(o), o = null, a = null, c = null, l = null);
  }
  function y() {
    r.log("stop"), z(), n && j(n);
  }
  function _() {
    if (!u) return;
    const s = i + 1, g = t.steps[s];
    if (!g) {
      y();
      return;
    }
    if (h(g)) {
      i = s, m(), x();
      return;
    }
    i = s, m();
    const b = t.steps[i - 1]?.action;
    if (b && b.type === "navigate" && b.url) {
      r.log("page transition (navigate) → resume at", i), z(), window.location.assign(b.url);
      return;
    }
    r.log("page transition (wait) → resume at", i), O();
  }
  function L() {
    if (!u) return;
    const s = t.steps[i - 1];
    if (s) {
      if (h(s)) {
        i -= 1, m(), x();
        return;
      }
      i -= 1, m(), r.log("page transition back → resume at", i), O(), window.history.back();
    }
  }
  return { start: K, stop: y, next: _, prev: L };
}
function vt(t, e = {}) {
  const r = e.state;
  if (!r) return null;
  const n = gt(r);
  if (!n || n.tourId !== t.id) return null;
  const o = t.steps[n.index];
  if (!o)
    return j(r), null;
  if (!Y(o.pageUrl, window.location.href)) return null;
  const a = bt(t, { state: r });
  return a.start(n.index), a;
}
function Et(t, e) {
  const r = t.trigger ?? { type: "manual" };
  let n = !1;
  const o = () => {
    n || (n = !0, e());
  };
  switch (r.type) {
    case "load": {
      const a = setTimeout(o, 0);
      return () => clearTimeout(a);
    }
    case "timer": {
      const a = setTimeout(o, Math.max(0, r.delay));
      return () => clearTimeout(a);
    }
    case "selector": {
      let a = !1;
      return q([r.selector], { timeout: 0 }).then((c) => {
        c && !a && o();
      }), () => {
        a = !0;
      };
    }
    case "request":
      return wt(r.url, o);
    case "manual":
    default:
      return () => {
      };
  }
}
function wt(t, e) {
  const r = (u) => !t || u.includes(t);
  let n = !0;
  const o = window.fetch;
  window.fetch = function(...i) {
    const d = o.apply(this, i), f = i[0], w = typeof f == "string" ? f : f instanceof URL ? f.href : f.url ?? "";
    return d.then(
      () => {
        n && r(w) && e();
      },
      () => {
      }
    ), d;
  };
  const a = XMLHttpRequest.prototype.open, c = XMLHttpRequest.prototype.send, l = "__toursUrl";
  return XMLHttpRequest.prototype.open = function(i, d) {
    return this[l] = String(d), a.apply(this, arguments);
  }, XMLHttpRequest.prototype.send = function(...i) {
    return this.addEventListener("loadend", () => {
      const d = this[l] ?? "";
      n && r(d) && e();
    }), c.apply(this, i);
  }, () => {
    n = !1, window.fetch = o, XMLHttpRequest.prototype.open = a, XMLHttpRequest.prototype.send = c;
  };
}
export {
  ut as CARD_STYLES,
  A as PROGRESS_KEY,
  Et as armTrigger,
  ct as autoSide,
  et as buildSelectors,
  j as clearProgress,
  yt as createLocalState,
  X as createLogger,
  xt as createPicker,
  bt as createPlayer,
  T as isLoggingEnabled,
  Y as matchUrl,
  wt as onRequestComplete,
  lt as placeCard,
  gt as readProgress,
  dt as renderCard,
  R as resolveElement,
  vt as resumeTour,
  q as waitForElement,
  mt as writeProgress
};
