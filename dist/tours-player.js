const ut = `
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
`, dt = `
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
function U(t) {
  return JSON.stringify(t);
}
function ft(t) {
  return /^[a-zA-Z][\w-]*$/.test(t) && t.length <= 30 && !/\d{2,}/.test(t) && !/^(css-|sc-|jsx-|emotion-|_|is-|has-)/.test(t);
}
function q(t) {
  const e = [];
  let n = t;
  for (; n && n !== document.body && n.nodeType === 1; ) {
    const r = n.tagName.toLowerCase(), s = n.parentElement;
    if (!s) {
      e.unshift(r);
      break;
    }
    const i = Array.from(s.children).filter((a) => a.tagName === n.tagName);
    e.unshift(i.length > 1 ? `${r}:nth-of-type(${i.indexOf(n) + 1})` : r), n = s;
  }
  return `body > ${e.join(" > ")}`;
}
function pt(t) {
  let e = t.parentElement;
  for (; e && e !== document.body && !e.id; )
    e = e.parentElement;
  if (!e || !e.id) return null;
  const n = [];
  let r = t;
  for (; r && r !== e; ) {
    const s = r.tagName.toLowerCase(), i = r.parentElement;
    if (!i) return null;
    const a = Array.from(i.children).filter((l) => l.tagName === r.tagName);
    n.unshift(a.length > 1 ? `${s}:nth-of-type(${a.indexOf(r) + 1})` : s), r = i;
  }
  return `#${CSS.escape(e.id)} > ${n.join(" > ")}`;
}
const ht = ["data-testid", "data-test", "data-test-id", "data-cy", "data-qa", "data-id", "data-name"];
function gt(t) {
  const e = [], n = /* @__PURE__ */ new Set(), r = t.tagName.toLowerCase(), s = (u) => {
    if (!(!u || n.has(u)))
      try {
        document.querySelector(u) === t && (n.add(u), e.push(u));
      } catch {
      }
  };
  t.id && s(`#${CSS.escape(t.id)}`);
  for (const u of ht) {
    const d = t.getAttribute(u);
    d && s(`${r}[${u}=${U(d)}]`);
  }
  const i = t.getAttribute("name");
  i && s(`${r}[name=${U(i)}]`);
  const a = t.getAttribute("aria-label");
  a && s(`[aria-label=${U(a)}]`);
  const l = Array.from(t.classList).filter(ft);
  l.length && s(`${r}.${l.map((u) => CSS.escape(u)).join(".")}`);
  for (const u of l) s(`${r}.${CSS.escape(u)}`);
  s(pt(t)), s(q(t));
  const p = (t.textContent ?? "").replace(/\s+/g, " ").trim();
  if (p && p.length <= 50 && /^(a|button|summary|label|h[1-6])$/.test(r)) {
    const u = `text=${p}`;
    n.has(u) || (n.add(u), e.push(u));
  }
  return e.length === 0 && e.push(q(t)), e;
}
const mt = "a, button, summary, label, h1, h2, h3, h4, h5, h6";
function G(t, e) {
  return !(t instanceof Element) || !t.isConnected || e !== document && e instanceof Node && !e.contains(t) ? null : t;
}
function bt(t, e) {
  if (typeof t == "function") {
    let n;
    try {
      n = t();
    } catch {
      return null;
    }
    return G(n, e);
  }
  if (typeof t != "string") return G(t, e);
  if (t.startsWith("text=")) {
    const n = t.slice(5).trim();
    for (const r of Array.from(e.querySelectorAll(mt)))
      if ((r.textContent ?? "").replace(/\s+/g, " ").trim() === n) return r;
    return null;
  }
  try {
    return e.querySelector(t);
  } catch {
    return null;
  }
}
function O(t, e = document) {
  for (const n of t) {
    const r = bt(n, e);
    if (r) return r;
  }
  return null;
}
function Z(t, e = {}) {
  const n = e.root ?? document, r = O(t, n);
  return r ? Promise.resolve(r) : new Promise((s) => {
    let i = !1, a;
    const l = (d) => {
      i || (i = !0, p.disconnect(), a && clearTimeout(a), s(d));
    }, p = new MutationObserver(() => {
      const d = O(t, n);
      d && l(d);
    });
    p.observe(document.documentElement, {
      childList: !0,
      subtree: !0,
      attributes: !0
    });
    const u = e.timeout ?? 4e3;
    u > 0 && Number.isFinite(u) && (a = setTimeout(() => l(null), u));
  });
}
let L = null;
function z() {
  if (L !== null) return L;
  try {
    L = new URLSearchParams(window.location.search).has("use_logs");
  } catch {
    L = !1;
  }
  return L;
}
function H(t) {
  const e = `[tours:${t}]`;
  return {
    log: (...n) => {
      z() && console.log(e, ...n);
    },
    warn: (...n) => {
      z() && console.warn(e, ...n);
    },
    error: (...n) => {
      z() && console.error(e, ...n);
    }
  };
}
function Ft(t, e = {}) {
  const n = H("picker");
  let r = null, s = null, i = null, a = !1;
  function l(b) {
    if (b === r) return !0;
    for (const v of e.ignore ?? [])
      if (v && v.contains(b)) return !0;
    return !1;
  }
  function p() {
    if (r) return;
    r = document.createElement("div"), r.setAttribute("data-tours-picker", ""), s = r.attachShadow({ mode: "open" });
    const b = document.createElement("style");
    b.textContent = ut, s.appendChild(b), i = document.createElement("div"), i.className = "tours-picker-overlay", i.style.display = "none", s.appendChild(i);
    const v = document.createElement("div");
    v.className = "tours-picker-hint", v.textContent = "Hover and click an element • Esc to cancel", s.appendChild(v), document.body.appendChild(r);
  }
  function u(b, v) {
    const E = document.elementFromPoint(b, v);
    return !E || l(E) ? null : E;
  }
  function d(b) {
    if (!a || !i) return;
    const v = u(b.clientX, b.clientY);
    if (!v) {
      i.style.display = "none";
      return;
    }
    const E = v.getBoundingClientRect();
    i.style.display = "block", i.style.left = `${E.left}px`, i.style.top = `${E.top}px`, i.style.width = `${E.width}px`, i.style.height = `${E.height}px`;
  }
  function c(b) {
    if (!a) return;
    const v = u(b.clientX, b.clientY);
    if (b.preventDefault(), b.stopPropagation(), !v) return;
    const E = gt(v);
    n.log("picked", E), m(), t(E);
  }
  function h(b) {
    b.key === "Escape" && (b.preventDefault(), m());
  }
  function y() {
    a || (a = !0, n.log("start"), p(), document.addEventListener("mousemove", d, !0), document.addEventListener("click", c, !0), document.addEventListener("keydown", h, !0));
  }
  function m() {
    a && (a = !1, document.removeEventListener("mousemove", d, !0), document.removeEventListener("click", c, !0), document.removeEventListener("keydown", h, !0), r && r.parentNode && r.parentNode.removeChild(r), r = null, s = null, i = null);
  }
  return { start: y, stop: m };
}
const xt = 6, wt = 6, yt = 10, vt = 12;
function Et(t, e, n) {
  const r = {
    top: t.top,
    bottom: n.height - t.bottom,
    left: t.left,
    right: n.width - t.right
  }, s = {
    top: e.height,
    bottom: e.height,
    left: e.width,
    right: e.width
  }, i = ["bottom", "top", "right", "left"], a = i.find((l) => r[l] >= s[l] + 8);
  return a || i.reduce((l, p) => r[p] > r[l] ? p : l, i[0]);
}
function Ct(t) {
  const { target: e, card: n, offset: r, viewport: s } = t, i = t.side === "auto", a = i ? Et(e, n, s) : t.side, l = i ? "center" : t.align, p = t.alignOffset ?? 0, u = l === "start" ? p : l === "end" ? -p : 0;
  let d = 0, c = 0;
  return a === "top" || a === "bottom" ? (d = a === "top" ? e.top - n.height - r : e.bottom + r, c = l === "start" ? e.left : l === "end" ? e.right - n.width : e.left + e.width / 2 - n.width / 2, c += u) : (c = a === "left" ? e.left - n.width - r : e.right + r, d = l === "start" ? e.top : l === "end" ? e.bottom - n.height : e.top + e.height / 2 - n.height / 2, d += u), c = Math.max(8, Math.min(c, s.width - n.width - 8)), d = Math.max(8, Math.min(d, s.height - n.height - 8)), { top: d, left: c };
}
function K(t) {
  const e = document.createElement("button");
  return e.type = "button", e.className = `tours-card__btn${t.primary ? " tours-card__btn--primary" : ""}${t.disabled ? " tours-card__btn--disabled" : ""}`, e.textContent = t.label, !t.disabled && t.onClick && e.addEventListener("click", t.onClick), e;
}
function _t(t) {
  const e = document.createElement("div");
  if (e.className = `tours-card${t.ghost ? " tours-card--ghost" : ""}`, t.radius != null && (e.style.borderRadius = `${t.radius}px`), t.showClose) {
    const r = document.createElement("button");
    r.className = "tours-card__close", r.type = "button", r.textContent = "×", r.setAttribute("aria-label", "Close"), t.onClose && r.addEventListener("click", t.onClose), e.appendChild(r);
  }
  const n = document.createElement("div");
  if (n.className = "tours-card__content", t.contentHtml != null ? n.innerHTML = t.contentHtml : n.textContent = t.contentText ?? "", e.appendChild(n), t.back || t.next || t.progress) {
    const r = document.createElement("div");
    if (r.className = "tours-card__footer", t.back && r.appendChild(K(t.back)), t.progress) {
      const s = document.createElement("span");
      s.className = "tours-card__progress", s.textContent = t.progress, r.appendChild(s);
    }
    t.next && r.appendChild(K(t.next)), e.appendChild(r);
  }
  return e;
}
const kt = `
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
function St(t) {
  const e = t.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*\*/g, "\0").replace(/\*/g, "[^/]*").replace(/ /g, ".*").replace(/\?/g, ".");
  return new RegExp(`^${e}$`);
}
function A(t, e) {
  if (!t) return !0;
  if (t.regex)
    try {
      return new RegExp(t.regex).test(e);
    } catch {
      return !1;
    }
  if (t.glob)
    try {
      return St(t.glob).test(e);
    } catch {
      return !1;
    }
  return !0;
}
function $t(t) {
  if (!t || !t.glob) return null;
  const e = t.glob.replace(/\*+/g, "");
  return /^https?:\/\//i.test(e) || e.startsWith("#") || e.startsWith("/") ? e : null;
}
const M = "tours:locationchange";
let J = !1;
function Lt() {
  if (!J) {
    J = !0;
    for (const t of ["pushState", "replaceState"]) {
      const e = history[t];
      history[t] = function(...r) {
        const s = e.apply(this, r);
        return window.dispatchEvent(new Event(M)), s;
      };
    }
  }
}
function F(t) {
  return Lt(), window.addEventListener("popstate", t), window.addEventListener("hashchange", t), window.addEventListener(M, t), () => {
    window.removeEventListener("popstate", t), window.removeEventListener("hashchange", t), window.removeEventListener(M, t);
  };
}
const Y = "tours:progress";
function Ht() {
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
function Nt(t) {
  const e = t.get(Y);
  if (!e) return null;
  try {
    const n = JSON.parse(e);
    if (typeof n?.tourId == "string" && typeof n?.index == "number") return n;
  } catch {
  }
  return null;
}
function Tt(t, e) {
  t.set(Y, JSON.stringify(e));
}
function Q(t) {
  t.remove(Y);
}
const tt = "tours:seen:";
function et(t, e) {
  const n = t.get(tt + e), r = n ? parseInt(n, 10) : 0;
  return Number.isNaN(r) ? 0 : r;
}
function At(t, e) {
  t.set(tt + e, String(et(t, e) + 1));
}
const Rt = "[data-tours-editor]";
function nt() {
  return typeof document < "u" && document.querySelector(Rt) !== null;
}
function rt(t, e = {}) {
  const n = H("player"), r = e.state;
  let s = null, i = null, a = null, l = null, p = null, u = null, d = !1, c = 0, h = 0, y = null;
  const m = t.display?.padding ?? xt, b = t.display?.radius ?? wt, v = t.display?.cardRadius ?? yt, E = t.display?.offset ?? vt;
  function R(o) {
    return O(o.selectors);
  }
  function P(o) {
    return o.action?.type === "click";
  }
  function S(o) {
    return A(o.pageUrl, window.location.href);
  }
  function k() {
    r && Tt(r, { tourId: t.id, index: c });
  }
  function W() {
    if (s) return;
    s = document.createElement("div"), s.setAttribute("data-tours-player", ""), i = s.attachShadow({ mode: "open" });
    const o = document.createElement("style");
    o.textContent = dt + kt, i.appendChild(o), p = document.createElement("div"), p.className = "tours-backdrop", p.addEventListener("click", (f) => {
      const g = t.steps[c], x = g ? R(g) : null;
      if (x) {
        const w = x.getBoundingClientRect();
        if (f.clientX >= w.left - m && f.clientX <= w.right + m && f.clientY >= w.top - m && f.clientY <= w.bottom + m) return;
      }
      _();
    }), i.appendChild(p), a = document.createElement("div"), a.className = "tours-spotlight", a.style.borderRadius = `${b}px`, i.appendChild(a), document.body.appendChild(s);
  }
  function ot(o) {
    if (!p) return;
    if (!o) {
      p.style.clipPath = "";
      return;
    }
    const f = o.left - m, g = o.top - m, x = o.right + m, w = o.bottom + m;
    p.style.clipPath = `polygon(0 0, 0 100%, ${f}px 100%, ${f}px ${g}px, ${x}px ${g}px, ${x}px ${w}px, ${f}px ${w}px, ${f}px 100%, 100% 100%, 100% 0)`;
  }
  function B(o, f = !1) {
    a && (a.style.transitionDuration = f ? "0ms" : "", a.style.display = "block", a.style.left = `${o.left - m}px`, a.style.top = `${o.top - m}px`, a.style.width = `${o.width + m * 2}px`, a.style.height = `${o.height + m * 2}px`);
  }
  function V(o, f) {
    if (!l) return;
    const g = {
      top: o.top - m,
      left: o.left - m,
      right: o.right + m,
      bottom: o.bottom + m,
      width: o.width + m * 2,
      height: o.height + m * 2
    }, { top: x, left: w } = Ct({
      target: g,
      card: { width: l.offsetWidth, height: l.offsetHeight },
      side: f.placement ?? "bottom",
      align: f.align ?? "center",
      offset: E,
      alignOffset: t.display?.alignOffset ?? 0,
      viewport: { width: window.innerWidth, height: window.innerHeight }
    });
    l.style.left = `${w}px`, l.style.top = `${x}px`;
  }
  function it(o) {
    const f = Math.max(1, t.steps.length - h), g = Math.max(1, Math.min(c + 1 - h, f));
    l && l.remove();
    const x = c === t.steps.length - 1, w = t.steps[c - 1], $ = !!w && S(w), lt = !P(o) || x;
    l = _t({
      contentText: o.content.default,
      progress: `Step ${g} of ${f}`,
      showClose: !0,
      onClose: _,
      radius: v,
      back: $ ? { label: o.backLabel ?? "Back", onClick: I } : void 0,
      next: lt ? {
        label: o.nextLabel ?? (x ? "Done" : "Next"),
        primary: !0,
        onClick: D
      } : void 0
    }), i?.appendChild(l);
  }
  function C() {
    if (!d) return;
    const o = t.steps[c];
    if (!o) {
      _();
      return;
    }
    n.log("render step", c, o.id);
    const f = R(o);
    if (!f) {
      n.log(`step "${o.id}" target not found yet — waiting`, o.selectors), Z(o.selectors, { timeout: 4e3 }).then((x) => {
        !d || t.steps[c] !== o || (x ? C() : (n.warn(`step "${o.id}" skipped: no element for selectors`, o.selectors), h += 1, c < t.steps.length - 1 ? (c += 1, C()) : _()));
      });
      return;
    }
    W(), f.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" }), it(o);
    const g = f.getBoundingClientRect();
    B(g), V(g, o), ot(P(o) ? g : null), st(o);
  }
  function st(o) {
    if (u?.(), u = null, !P(o)) return;
    const f = c + 1, g = t.steps[f];
    !g || S(g) || (u = F(() => {
      !d || t.steps[c] !== o || A(g.pageUrl, window.location.href) && (u?.(), u = null, n.log("visitor navigated → advancing to", g.id), c = f, k(), C());
    }));
  }
  function X(o) {
    d && (o.key === "Escape" ? (o.preventDefault(), _()) : o.key === "ArrowRight" ? D() : o.key === "ArrowLeft" && I());
  }
  function N() {
    if (!d) return;
    const o = t.steps[c];
    if (!o) return;
    const f = R(o);
    if (!f) return;
    const g = f.getBoundingClientRect();
    B(g, !0), V(g, o);
  }
  function at(o = 0) {
    if (!d && t.steps.length !== 0) {
      if (!e.allowWhileEditing && nt()) {
        n.log(`start suppressed for "${t.id}" — the builder is mounted`);
        return;
      }
      d = !0, c = Math.max(0, Math.min(o, t.steps.length - 1)), h = 0, n.log("start", t.id, `at ${c}/${t.steps.length}`), W(), window.addEventListener("keydown", X, !0), window.addEventListener("resize", N, !0), window.addEventListener("scroll", N, !0), k(), C();
    }
  }
  function ct() {
    a && (a.style.display = "none"), l && (l.remove(), l = null);
  }
  function T() {
    ct(), !y && (y = F(() => {
      if (!d) {
        y?.(), y = null;
        return;
      }
      const o = t.steps[c];
      o && S(o) && (y?.(), y = null, C());
    }));
  }
  function j() {
    y && (y(), y = null), u && (u(), u = null), d && (d = !1, window.removeEventListener("keydown", X, !0), window.removeEventListener("resize", N, !0), window.removeEventListener("scroll", N, !0), s && s.parentNode && s.parentNode.removeChild(s), s = null, i = null, a = null, l = null, p = null);
  }
  function _() {
    n.log("stop"), j(), r && Q(r);
  }
  function D() {
    if (!d) return;
    const o = c + 1, f = t.steps[o];
    if (!f) {
      _();
      return;
    }
    if (S(f)) {
      c = o, k(), C();
      return;
    }
    c = o, k();
    const g = ($) => {
      j(), e.onNavigate ? e.onNavigate($, f.id) : window.location.assign($);
    }, x = t.steps[c - 1]?.action;
    if (x && x.type === "navigate" && x.url) {
      x.url.startsWith("#") ? (n.log("page transition (hash navigate) → resume at", c), T(), window.location.hash = x.url) : (n.log("page transition (navigate) → resume at", c), g(x.url));
      return;
    }
    const w = $t(f.pageUrl);
    if (w) {
      w.startsWith("#") ? (n.log("page transition (derived hash) → resume at", c), T(), window.location.hash = w) : (n.log("page transition (derived navigate) → resume at", c, w), g(w));
      return;
    }
    n.log("page transition (wait) → resume at", c), T();
  }
  function I() {
    if (!d) return;
    const o = t.steps[c - 1];
    if (o) {
      if (S(o)) {
        c -= 1, k(), C();
        return;
      }
      c -= 1, k(), n.log("page transition back → resume at", c), T(), window.history.back();
    }
  }
  return { start: at, stop: _, next: D, prev: I, isActive: () => d };
}
function Pt(t, e = {}) {
  const n = e.state;
  if (!n) return null;
  const r = Nt(n);
  if (!r || r.tourId !== t.id) return null;
  if (!t.steps[r.index])
    return Q(n), null;
  let s = -1;
  for (let a = r.index; a < t.steps.length; a++)
    if (A(t.steps[a].pageUrl, window.location.href)) {
      s = a;
      break;
    }
  if (s === -1) return null;
  const i = rt(t, e);
  return i.start(s), i;
}
const Dt = `
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
function It(t) {
  const e = t.corner ?? "bottom-right", n = t.offset ?? 24, r = document.createElement("div");
  r.setAttribute("data-tours-cta", "");
  const s = r.attachShadow({ mode: "open" }), i = document.createElement("style");
  i.textContent = Dt, s.appendChild(i);
  const a = document.createElement("div");
  a.className = "cta";
  const [l, p] = e.split("-");
  a.style[l] = `${n}px`, a.style[p] = `${n}px`;
  const u = () => {
    r.parentNode && r.parentNode.removeChild(r);
  }, d = document.createElement("button");
  d.className = "cta__close", d.type = "button", d.textContent = "×", d.setAttribute("aria-label", "Dismiss"), d.addEventListener("click", u);
  const c = document.createElement("p");
  c.className = "cta__text", c.textContent = t.text;
  const h = document.createElement("button");
  return h.className = "cta__btn", h.type = "button", h.textContent = t.button, h.addEventListener("click", () => {
    u(), t.onStart();
  }), a.append(d, c, h), s.appendChild(a), document.body.appendChild(r), u;
}
function Ut(t, e) {
  if (nt()) return () => {
  };
  const n = t.trigger ?? { type: "manual" };
  let r = !1;
  const s = () => {
    r || (r = !0, e());
  };
  switch (n.type) {
    case "load": {
      const i = setTimeout(s, 0);
      return () => clearTimeout(i);
    }
    case "timer": {
      const i = setTimeout(s, Math.max(0, n.delay));
      return () => clearTimeout(i);
    }
    case "selector": {
      let i = !1;
      return Z([n.selector], { timeout: 0 }).then((a) => {
        a && !i && s();
      }), () => {
        i = !0;
      };
    }
    case "cta": {
      let i = () => {
      };
      return i = It({
        text: n.text,
        button: n.button,
        corner: n.corner,
        offset: n.offset,
        onStart: s
      }), i;
    }
    case "manual":
    default:
      return () => {
      };
  }
}
function zt(t = window.innerWidth) {
  return t <= 640 ? "mobile" : t <= 1024 ? "tablet" : "desktop";
}
function Ot(t, e) {
  return !(t.url && !A(t.url, e.url) || t.role !== void 0 && t.role !== e.role || t.firstVisitOnly && !e.firstVisit || t.device && t.device !== e.device || t.unlessSeen && e.seenCount > 0 || t.maxShows !== void 0 && e.seenCount >= t.maxShows);
}
function Mt(t, e) {
  return !t || t.length === 0 ? !0 : t.some((n) => Ot(n.when, e));
}
function Yt(t, e = {}) {
  const n = H("mount"), r = e.state, s = () => typeof t == "function" ? t() : t;
  let i = null, a = [];
  function l() {
    for (const c of a) c();
    a = [];
  }
  function p(c) {
    return !e.canRun || e.canRun(c);
  }
  function u() {
    if (i?.isActive()) return;
    if (i = null, l(), r)
      for (const h of s()) {
        if (!p(h)) continue;
        const y = Pt(h, e);
        if (y) {
          n.log("resumed", h.id), i = y;
          return;
        }
      }
    const c = zt();
    for (const h of s()) {
      if (!p(h) || !h.trigger || h.trigger.type === "manual") continue;
      const y = r ? et(r, h.id) : 0;
      Mt(h.rules, {
        url: window.location.href,
        device: c,
        firstVisit: y === 0,
        seenCount: y
      }) && a.push(
        Ut(h, () => {
          r && At(r, h.id);
          const b = rt(h, e);
          i = b, b.start();
        })
      );
    }
  }
  u();
  const d = F(u);
  return () => {
    d(), l(), i?.stop(), i = null;
  };
}
export {
  kt as CARD_STYLES,
  Y as PROGRESS_KEY,
  Ut as armTrigger,
  Et as autoSide,
  gt as buildSelectors,
  Q as clearProgress,
  Ht as createLocalState,
  H as createLogger,
  Ft as createPicker,
  rt as createPlayer,
  $t as deriveUrl,
  zt as detectDevice,
  nt as isBuilderMounted,
  z as isLoggingEnabled,
  At as markSeen,
  Mt as matchRules,
  A as matchUrl,
  Yt as mountTours,
  Ct as placeCard,
  Nt as readProgress,
  _t as renderCard,
  O as resolveElement,
  Pt as resumeTour,
  et as seenCount,
  Z as waitForElement,
  Tt as writeProgress
};
