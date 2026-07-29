const tt = `
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
`, et = `
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
function nt(t) {
  return /^[a-zA-Z][\w-]*$/.test(t) && t.length <= 30 && !/\d{2,}/.test(t) && !/^(css-|sc-|jsx-|emotion-|_|is-|has-)/.test(t);
}
function W(t) {
  const e = [];
  let n = t;
  for (; n && n !== document.body && n.nodeType === 1; ) {
    const r = n.tagName.toLowerCase(), i = n.parentElement;
    if (!i) {
      e.unshift(r);
      break;
    }
    const s = Array.from(i.children).filter((c) => c.tagName === n.tagName);
    e.unshift(s.length > 1 ? `${r}:nth-of-type(${s.indexOf(n) + 1})` : r), n = i;
  }
  return `body > ${e.join(" > ")}`;
}
function rt(t) {
  let e = t.parentElement;
  for (; e && e !== document.body && !e.id; )
    e = e.parentElement;
  if (!e || !e.id) return null;
  const n = [];
  let r = t;
  for (; r && r !== e; ) {
    const i = r.tagName.toLowerCase(), s = r.parentElement;
    if (!s) return null;
    const c = Array.from(s.children).filter((l) => l.tagName === r.tagName);
    n.unshift(c.length > 1 ? `${i}:nth-of-type(${c.indexOf(r) + 1})` : i), r = s;
  }
  return `#${CSS.escape(e.id)} > ${n.join(" > ")}`;
}
const ot = ["data-testid", "data-test", "data-test-id", "data-cy", "data-qa", "data-id", "data-name"];
function it(t) {
  const e = [], n = /* @__PURE__ */ new Set(), r = t.tagName.toLowerCase(), i = (o) => {
    if (!(!o || n.has(o)))
      try {
        document.querySelector(o) === t && (n.add(o), e.push(o));
      } catch {
      }
  };
  t.id && i(`#${CSS.escape(t.id)}`);
  for (const o of ot) {
    const d = t.getAttribute(o);
    d && i(`${r}[${o}=${R(d)}]`);
  }
  const s = t.getAttribute("name");
  s && i(`${r}[name=${R(s)}]`);
  const c = t.getAttribute("aria-label");
  c && i(`[aria-label=${R(c)}]`);
  const l = Array.from(t.classList).filter(nt);
  l.length && i(`${r}.${l.map((o) => CSS.escape(o)).join(".")}`);
  for (const o of l) i(`${r}.${CSS.escape(o)}`);
  i(rt(t)), i(W(t));
  const u = (t.textContent ?? "").replace(/\s+/g, " ").trim();
  if (u && u.length <= 50 && /^(a|button|summary|label|h[1-6])$/.test(r)) {
    const o = `text=${u}`;
    n.has(o) || (n.add(o), e.push(o));
  }
  return e.length === 0 && e.push(W(t)), e;
}
const st = "a, button, summary, label, h1, h2, h3, h4, h5, h6";
function X(t, e) {
  return !(t instanceof Element) || !t.isConnected || e !== document && e instanceof Node && !e.contains(t) ? null : t;
}
function at(t, e) {
  if (typeof t == "function") {
    let n;
    try {
      n = t();
    } catch {
      return null;
    }
    return X(n, e);
  }
  if (typeof t != "string") return X(t, e);
  if (t.startsWith("text=")) {
    const n = t.slice(5).trim();
    for (const r of Array.from(e.querySelectorAll(st)))
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
    const r = at(n, e);
    if (r) return r;
  }
  return null;
}
function V(t, e = {}) {
  const n = e.root ?? document, r = D(t, n);
  return r ? Promise.resolve(r) : new Promise((i) => {
    let s = !1, c;
    const l = (d) => {
      s || (s = !0, u.disconnect(), c && clearTimeout(c), i(d));
    }, u = new MutationObserver(() => {
      const d = D(t, n);
      d && l(d);
    });
    u.observe(document.documentElement, {
      childList: !0,
      subtree: !0,
      attributes: !0
    });
    const o = e.timeout ?? 4e3;
    o > 0 && Number.isFinite(o) && (c = setTimeout(() => l(null), o));
  });
}
let S = null;
function P() {
  if (S !== null) return S;
  try {
    S = new URLSearchParams(window.location.search).has("use_logs");
  } catch {
    S = !1;
  }
  return S;
}
function q(t) {
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
function Lt(t, e = {}) {
  const n = q("picker");
  let r = null, i = null, s = null, c = !1;
  function l(g) {
    if (g === r) return !0;
    for (const m of e.ignore ?? [])
      if (m && m.contains(g)) return !0;
    return !1;
  }
  function u() {
    if (r) return;
    r = document.createElement("div"), r.setAttribute("data-tours-picker", ""), i = r.attachShadow({ mode: "open" });
    const g = document.createElement("style");
    g.textContent = tt, i.appendChild(g), s = document.createElement("div"), s.className = "tours-picker-overlay", s.style.display = "none", i.appendChild(s);
    const m = document.createElement("div");
    m.className = "tours-picker-hint", m.textContent = "Hover and click an element • Esc to cancel", i.appendChild(m), document.body.appendChild(r);
  }
  function o(g, m) {
    const x = document.elementFromPoint(g, m);
    return !x || l(x) ? null : x;
  }
  function d(g) {
    if (!c || !s) return;
    const m = o(g.clientX, g.clientY);
    if (!m) {
      s.style.display = "none";
      return;
    }
    const x = m.getBoundingClientRect();
    s.style.display = "block", s.style.left = `${x.left}px`, s.style.top = `${x.top}px`, s.style.width = `${x.width}px`, s.style.height = `${x.height}px`;
  }
  function p(g) {
    if (!c) return;
    const m = o(g.clientX, g.clientY);
    if (g.preventDefault(), g.stopPropagation(), !m) return;
    const x = it(m);
    n.log("picked", x), _(), t(x);
  }
  function h(g) {
    g.key === "Escape" && (g.preventDefault(), _());
  }
  function N() {
    c || (c = !0, n.log("start"), u(), document.addEventListener("mousemove", d, !0), document.addEventListener("click", p, !0), document.addEventListener("keydown", h, !0));
  }
  function _() {
    c && (c = !1, document.removeEventListener("mousemove", d, !0), document.removeEventListener("click", p, !0), document.removeEventListener("keydown", h, !0), r && r.parentNode && r.parentNode.removeChild(r), r = null, i = null, s = null);
  }
  return { start: N, stop: _ };
}
const ct = 6, lt = 6, dt = 10, ut = 12;
function ft(t, e, n) {
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
  }, s = ["bottom", "top", "right", "left"], c = s.find((l) => r[l] >= i[l] + 8);
  return c || s.reduce((l, u) => r[u] > r[l] ? u : l, s[0]);
}
function pt(t) {
  const { target: e, card: n, offset: r, viewport: i } = t, s = t.side === "auto", c = s ? ft(e, n, i) : t.side, l = s ? "center" : t.align, u = t.alignOffset ?? 0, o = l === "start" ? u : l === "end" ? -u : 0;
  let d = 0, p = 0;
  return c === "top" || c === "bottom" ? (d = c === "top" ? e.top - n.height - r : e.bottom + r, p = l === "start" ? e.left : l === "end" ? e.right - n.width : e.left + e.width / 2 - n.width / 2, p += o) : (p = c === "left" ? e.left - n.width - r : e.right + r, d = l === "start" ? e.top : l === "end" ? e.bottom - n.height : e.top + e.height / 2 - n.height / 2, d += o), p = Math.max(8, Math.min(p, i.width - n.width - 8)), d = Math.max(8, Math.min(d, i.height - n.height - 8)), { top: d, left: p };
}
function B(t) {
  const e = document.createElement("button");
  return e.type = "button", e.className = `tours-card__btn${t.primary ? " tours-card__btn--primary" : ""}${t.disabled ? " tours-card__btn--disabled" : ""}`, e.textContent = t.label, !t.disabled && t.onClick && e.addEventListener("click", t.onClick), e;
}
function ht(t) {
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
const gt = `
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
function mt(t) {
  const e = t.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*\*/g, "\0").replace(/\*/g, "[^/]*").replace(/ /g, ".*").replace(/\?/g, ".");
  return new RegExp(`^${e}$`);
}
function U(t, e) {
  if (!t) return !0;
  if (t.regex)
    try {
      return new RegExp(t.regex).test(e);
    } catch {
      return !1;
    }
  if (t.glob)
    try {
      return mt(t.glob).test(e);
    } catch {
      return !1;
    }
  return !0;
}
function bt(t) {
  if (!t || !t.glob) return null;
  const e = t.glob.replace(/\*+/g, "");
  return /^https?:\/\//i.test(e) || e.startsWith("#") || e.startsWith("/") ? e : null;
}
const z = "tours:locationchange";
let j = !1;
function xt() {
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
function wt(t) {
  return xt(), window.addEventListener("popstate", t), window.addEventListener("hashchange", t), window.addEventListener(z, t), () => {
    window.removeEventListener("popstate", t), window.removeEventListener("hashchange", t), window.removeEventListener(z, t);
  };
}
const I = "tours:progress";
function Nt() {
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
function yt(t) {
  const e = t.get(I);
  if (!e) return null;
  try {
    const n = JSON.parse(e);
    if (typeof n?.tourId == "string" && typeof n?.index == "number") return n;
  } catch {
  }
  return null;
}
function vt(t, e) {
  t.set(I, JSON.stringify(e));
}
function K(t) {
  t.remove(I);
}
const G = "tours:seen:";
function Et(t, e) {
  const n = t.get(G + e), r = n ? parseInt(n, 10) : 0;
  return Number.isNaN(r) ? 0 : r;
}
function Tt(t, e) {
  t.set(G + e, String(Et(t, e) + 1));
}
function Ct(t, e = {}) {
  const n = q("player"), r = e.state;
  let i = null, s = null, c = null, l = null, u = !1, o = 0, d = 0, p = null;
  const h = t.display?.padding ?? ct, N = t.display?.radius ?? lt, _ = t.display?.cardRadius ?? dt, g = t.display?.offset ?? ut;
  function m(a) {
    return D(a.selectors);
  }
  function x(a) {
    return U(a.pageUrl, window.location.href);
  }
  function k() {
    r && vt(r, { tourId: t.id, index: o });
  }
  function M() {
    if (i) return;
    i = document.createElement("div"), i.setAttribute("data-tours-player", ""), s = i.attachShadow({ mode: "open" });
    const a = document.createElement("style");
    a.textContent = et + gt, s.appendChild(a);
    const f = document.createElement("div");
    f.className = "tours-backdrop", f.addEventListener("click", (b) => {
      const w = t.steps[o], y = w ? m(w) : null;
      if (y) {
        const E = y.getBoundingClientRect();
        if (b.clientX >= E.left - h && b.clientX <= E.right + h && b.clientY >= E.top - h && b.clientY <= E.bottom + h) return;
      }
      v();
    }), s.appendChild(f), c = document.createElement("div"), c.className = "tours-spotlight", c.style.borderRadius = `${N}px`, s.appendChild(c), document.body.appendChild(i);
  }
  function O(a, f = !1) {
    c && (c.style.transitionDuration = f ? "0ms" : "", c.style.display = "block", c.style.left = `${a.left - h}px`, c.style.top = `${a.top - h}px`, c.style.width = `${a.width + h * 2}px`, c.style.height = `${a.height + h * 2}px`);
  }
  function F(a, f) {
    if (!l) return;
    const b = {
      top: a.top - h,
      left: a.left - h,
      right: a.right + h,
      bottom: a.bottom + h,
      width: a.width + h * 2,
      height: a.height + h * 2
    }, { top: w, left: y } = pt({
      target: b,
      card: { width: l.offsetWidth, height: l.offsetHeight },
      side: f.placement ?? "bottom",
      align: f.align ?? "center",
      offset: g,
      alignOffset: t.display?.alignOffset ?? 0,
      viewport: { width: window.innerWidth, height: window.innerHeight }
    });
    l.style.left = `${y}px`, l.style.top = `${w}px`;
  }
  function J(a) {
    const f = Math.max(1, t.steps.length - d), b = Math.max(1, Math.min(o + 1 - d, f));
    l && l.remove(), l = ht({
      contentText: a.content.default,
      progress: `Step ${b} of ${f}`,
      showClose: !0,
      onClose: v,
      radius: _,
      back: { label: a.backLabel ?? "Back", disabled: o === 0, onClick: A },
      next: {
        label: a.nextLabel ?? (o === f - 1 ? "Done" : "Next"),
        primary: !0,
        onClick: T
      }
    }), s?.appendChild(l);
  }
  function C() {
    if (!u) return;
    const a = t.steps[o];
    if (!a) {
      v();
      return;
    }
    n.log("render step", o, a.id);
    const f = m(a);
    if (!f) {
      n.log(`step "${a.id}" target not found yet — waiting`, a.selectors), V(a.selectors, { timeout: 4e3 }).then((w) => {
        !u || t.steps[o] !== a || (w ? C() : (n.warn(`step "${a.id}" skipped: no element for selectors`, a.selectors), d += 1, o < t.steps.length - 1 ? (o += 1, C()) : v()));
      });
      return;
    }
    M(), f.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" }), J(a);
    const b = f.getBoundingClientRect();
    O(b), F(b, a);
  }
  function Y(a) {
    u && (a.key === "Escape" ? (a.preventDefault(), v()) : a.key === "ArrowRight" ? T() : a.key === "ArrowLeft" && A());
  }
  function $() {
    if (!u) return;
    const a = t.steps[o];
    if (!a) return;
    const f = m(a);
    if (!f) return;
    const b = f.getBoundingClientRect();
    O(b, !0), F(b, a);
  }
  function Z(a = 0) {
    u || t.steps.length !== 0 && (u = !0, o = Math.max(0, Math.min(a, t.steps.length - 1)), d = 0, n.log("start", t.id, `at ${o}/${t.steps.length}`), M(), window.addEventListener("keydown", Y, !0), window.addEventListener("resize", $, !0), window.addEventListener("scroll", $, !0), k(), C());
  }
  function Q() {
    c && (c.style.display = "none"), l && (l.remove(), l = null);
  }
  function L() {
    Q(), !p && (p = wt(() => {
      if (!u) {
        p?.(), p = null;
        return;
      }
      const a = t.steps[o];
      a && x(a) && (p?.(), p = null, C());
    }));
  }
  function H() {
    p && (p(), p = null), u && (u = !1, window.removeEventListener("keydown", Y, !0), window.removeEventListener("resize", $, !0), window.removeEventListener("scroll", $, !0), i && i.parentNode && i.parentNode.removeChild(i), i = null, s = null, c = null, l = null);
  }
  function v() {
    n.log("stop"), H(), r && K(r);
  }
  function T() {
    if (!u) return;
    const a = o + 1, f = t.steps[a];
    if (!f) {
      v();
      return;
    }
    if (x(f)) {
      o = a, k(), C();
      return;
    }
    o = a, k();
    const b = (E) => {
      H(), e.onNavigate ? e.onNavigate(E, f.id) : window.location.assign(E);
    }, w = t.steps[o - 1]?.action;
    if (w && w.type === "navigate" && w.url) {
      w.url.startsWith("#") ? (n.log("page transition (hash navigate) → resume at", o), L(), window.location.hash = w.url) : (n.log("page transition (navigate) → resume at", o), b(w.url));
      return;
    }
    const y = bt(f.pageUrl);
    if (y) {
      y.startsWith("#") ? (n.log("page transition (derived hash) → resume at", o), L(), window.location.hash = y) : (n.log("page transition (derived navigate) → resume at", o, y), b(y));
      return;
    }
    n.log("page transition (wait) → resume at", o), L();
  }
  function A() {
    if (!u) return;
    const a = t.steps[o - 1];
    if (a) {
      if (x(a)) {
        o -= 1, k(), C();
        return;
      }
      o -= 1, k(), n.log("page transition back → resume at", o), L(), window.history.back();
    }
  }
  return { start: Z, stop: v, next: T, prev: A };
}
function At(t, e = {}) {
  const n = e.state;
  if (!n) return null;
  const r = yt(n);
  if (!r || r.tourId !== t.id) return null;
  const i = t.steps[r.index];
  if (!i)
    return K(n), null;
  if (!U(i.pageUrl, window.location.href)) return null;
  const s = Ct(t, { state: n });
  return s.start(r.index), s;
}
const _t = `
:host { all: initial; }
.cta {
  position: fixed;
  z-index: 2147483200;
  box-sizing: border-box;
  max-width: 300px;
  padding: 16px 18px;
  font: 14px/1.5 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  color: #111827;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.18);
}
.cta__text { margin: 0 0 12px; padding-right: 18px; }
.cta__btn {
  font: inherit;
  font-weight: 600;
  color: #fff;
  background: #2563eb;
  border: none;
  border-radius: 9px;
  padding: 9px 16px;
  cursor: pointer;
}
.cta__btn:hover { background: #1d4ed8; }
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
function kt(t) {
  const e = t.corner ?? "bottom-right", n = t.offset ?? 24, r = document.createElement("div");
  r.setAttribute("data-tours-cta", "");
  const i = r.attachShadow({ mode: "open" }), s = document.createElement("style");
  s.textContent = _t, i.appendChild(s);
  const c = document.createElement("div");
  c.className = "cta";
  const [l, u] = e.split("-");
  c.style[l] = `${n}px`, c.style[u] = `${n}px`;
  const o = () => {
    r.parentNode && r.parentNode.removeChild(r);
  }, d = document.createElement("button");
  d.className = "cta__close", d.type = "button", d.textContent = "×", d.setAttribute("aria-label", "Dismiss"), d.addEventListener("click", o);
  const p = document.createElement("p");
  p.className = "cta__text", p.textContent = t.text;
  const h = document.createElement("button");
  return h.className = "cta__btn", h.type = "button", h.textContent = t.button, h.addEventListener("click", () => {
    o(), t.onStart();
  }), c.append(d, p, h), i.appendChild(c), document.body.appendChild(r), o;
}
function Rt(t, e) {
  const n = t.trigger ?? { type: "manual" };
  let r = !1;
  const i = () => {
    r || (r = !0, e());
  };
  switch (n.type) {
    case "load": {
      const s = setTimeout(i, 0);
      return () => clearTimeout(s);
    }
    case "timer": {
      const s = setTimeout(i, Math.max(0, n.delay));
      return () => clearTimeout(s);
    }
    case "selector": {
      let s = !1;
      return V([n.selector], { timeout: 0 }).then((c) => {
        c && !s && i();
      }), () => {
        s = !0;
      };
    }
    case "cta": {
      let s = () => {
      };
      return s = kt({
        text: n.text,
        button: n.button,
        corner: n.corner,
        offset: n.offset,
        onStart: i
      }), s;
    }
    case "manual":
    default:
      return () => {
      };
  }
}
function Pt(t = window.innerWidth) {
  return t <= 640 ? "mobile" : t <= 1024 ? "tablet" : "desktop";
}
function St(t, e) {
  return !(t.url && !U(t.url, e.url) || t.role !== void 0 && t.role !== e.role || t.firstVisitOnly && !e.firstVisit || t.device && t.device !== e.device || t.unlessSeen && e.seenCount > 0 || t.maxShows !== void 0 && e.seenCount >= t.maxShows);
}
function Dt(t, e) {
  return !t || t.length === 0 ? !0 : t.some((n) => St(n.when, e));
}
export {
  gt as CARD_STYLES,
  I as PROGRESS_KEY,
  Rt as armTrigger,
  ft as autoSide,
  it as buildSelectors,
  K as clearProgress,
  Nt as createLocalState,
  q as createLogger,
  Lt as createPicker,
  Ct as createPlayer,
  bt as deriveUrl,
  Pt as detectDevice,
  P as isLoggingEnabled,
  Tt as markSeen,
  Dt as matchRules,
  U as matchUrl,
  pt as placeCard,
  yt as readProgress,
  ht as renderCard,
  D as resolveElement,
  At as resumeTour,
  Et as seenCount,
  V as waitForElement,
  vt as writeProgress
};
