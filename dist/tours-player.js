const at = `
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
`, lt = `
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
function I(t) {
  return JSON.stringify(t);
}
function ct(t) {
  return /^[a-zA-Z][\w-]*$/.test(t) && t.length <= 30 && !/\d{2,}/.test(t) && !/^(css-|sc-|jsx-|emotion-|_|is-|has-)/.test(t);
}
function V(t) {
  const e = [];
  let n = t;
  for (; n && n !== document.body && n.nodeType === 1; ) {
    const r = n.tagName.toLowerCase(), i = n.parentElement;
    if (!i) {
      e.unshift(r);
      break;
    }
    const s = Array.from(i.children).filter((a) => a.tagName === n.tagName);
    e.unshift(s.length > 1 ? `${r}:nth-of-type(${s.indexOf(n) + 1})` : r), n = i;
  }
  return `body > ${e.join(" > ")}`;
}
function ut(t) {
  let e = t.parentElement;
  for (; e && e !== document.body && !e.id; )
    e = e.parentElement;
  if (!e || !e.id) return null;
  const n = [];
  let r = t;
  for (; r && r !== e; ) {
    const i = r.tagName.toLowerCase(), s = r.parentElement;
    if (!s) return null;
    const a = Array.from(s.children).filter((c) => c.tagName === r.tagName);
    n.unshift(a.length > 1 ? `${i}:nth-of-type(${a.indexOf(r) + 1})` : i), r = s;
  }
  return `#${CSS.escape(e.id)} > ${n.join(" > ")}`;
}
const dt = ["data-testid", "data-test", "data-test-id", "data-cy", "data-qa", "data-id", "data-name"];
function ft(t) {
  const e = [], n = /* @__PURE__ */ new Set(), r = t.tagName.toLowerCase(), i = (u) => {
    if (!(!u || n.has(u)))
      try {
        document.querySelector(u) === t && (n.add(u), e.push(u));
      } catch {
      }
  };
  t.id && i(`#${CSS.escape(t.id)}`);
  for (const u of dt) {
    const d = t.getAttribute(u);
    d && i(`${r}[${u}=${I(d)}]`);
  }
  const s = t.getAttribute("name");
  s && i(`${r}[name=${I(s)}]`);
  const a = t.getAttribute("aria-label");
  a && i(`[aria-label=${I(a)}]`);
  const c = Array.from(t.classList).filter(ct);
  c.length && i(`${r}.${c.map((u) => CSS.escape(u)).join(".")}`);
  for (const u of c) i(`${r}.${CSS.escape(u)}`);
  i(ut(t)), i(V(t));
  const p = (t.textContent ?? "").replace(/\s+/g, " ").trim();
  if (p && p.length <= 50 && /^(a|button|summary|label|h[1-6])$/.test(r)) {
    const u = `text=${p}`;
    n.has(u) || (n.add(u), e.push(u));
  }
  return e.length === 0 && e.push(V(t)), e;
}
const pt = "a, button, summary, label, h1, h2, h3, h4, h5, h6";
function j(t, e) {
  return !(t instanceof Element) || !t.isConnected || e !== document && e instanceof Node && !e.contains(t) ? null : t;
}
function ht(t, e) {
  if (typeof t == "function") {
    let n;
    try {
      n = t();
    } catch {
      return null;
    }
    return j(n, e);
  }
  if (typeof t != "string") return j(t, e);
  if (t.startsWith("text=")) {
    const n = t.slice(5).trim();
    for (const r of Array.from(e.querySelectorAll(pt)))
      if ((r.textContent ?? "").replace(/\s+/g, " ").trim() === n) return r;
    return null;
  }
  try {
    return e.querySelector(t);
  } catch {
    return null;
  }
}
function z(t, e = document) {
  for (const n of t) {
    const r = ht(n, e);
    if (r) return r;
  }
  return null;
}
function J(t, e = {}) {
  const n = e.root ?? document, r = z(t, n);
  return r ? Promise.resolve(r) : new Promise((i) => {
    let s = !1, a;
    const c = (d) => {
      s || (s = !0, p.disconnect(), a && clearTimeout(a), i(d));
    }, p = new MutationObserver(() => {
      const d = z(t, n);
      d && c(d);
    });
    p.observe(document.documentElement, {
      childList: !0,
      subtree: !0,
      attributes: !0
    });
    const u = e.timeout ?? 4e3;
    u > 0 && Number.isFinite(u) && (a = setTimeout(() => c(null), u));
  });
}
let S = null;
function U() {
  if (S !== null) return S;
  try {
    S = new URLSearchParams(window.location.search).has("use_logs");
  } catch {
    S = !1;
  }
  return S;
}
function Z(t) {
  const e = `[tours:${t}]`;
  return {
    log: (...n) => {
      U() && console.log(e, ...n);
    },
    warn: (...n) => {
      U() && console.warn(e, ...n);
    },
    error: (...n) => {
      U() && console.error(e, ...n);
    }
  };
}
function Dt(t, e = {}) {
  const n = Z("picker");
  let r = null, i = null, s = null, a = !1;
  function c(m) {
    if (m === r) return !0;
    for (const b of e.ignore ?? [])
      if (b && b.contains(m)) return !0;
    return !1;
  }
  function p() {
    if (r) return;
    r = document.createElement("div"), r.setAttribute("data-tours-picker", ""), i = r.attachShadow({ mode: "open" });
    const m = document.createElement("style");
    m.textContent = at, i.appendChild(m), s = document.createElement("div"), s.className = "tours-picker-overlay", s.style.display = "none", i.appendChild(s);
    const b = document.createElement("div");
    b.className = "tours-picker-hint", b.textContent = "Hover and click an element • Esc to cancel", i.appendChild(b), document.body.appendChild(r);
  }
  function u(m, b) {
    const v = document.elementFromPoint(m, b);
    return !v || c(v) ? null : v;
  }
  function d(m) {
    if (!a || !s) return;
    const b = u(m.clientX, m.clientY);
    if (!b) {
      s.style.display = "none";
      return;
    }
    const v = b.getBoundingClientRect();
    s.style.display = "block", s.style.left = `${v.left}px`, s.style.top = `${v.top}px`, s.style.width = `${v.width}px`, s.style.height = `${v.height}px`;
  }
  function l(m) {
    if (!a) return;
    const b = u(m.clientX, m.clientY);
    if (m.preventDefault(), m.stopPropagation(), !b) return;
    const v = ft(b);
    n.log("picked", v), g(), t(v);
  }
  function y(m) {
    m.key === "Escape" && (m.preventDefault(), g());
  }
  function E() {
    a || (a = !0, n.log("start"), p(), document.addEventListener("mousemove", d, !0), document.addEventListener("click", l, !0), document.addEventListener("keydown", y, !0));
  }
  function g() {
    a && (a = !1, document.removeEventListener("mousemove", d, !0), document.removeEventListener("click", l, !0), document.removeEventListener("keydown", y, !0), r && r.parentNode && r.parentNode.removeChild(r), r = null, i = null, s = null);
  }
  return { start: E, stop: g };
}
const gt = 6, mt = 6, bt = 10, xt = 12;
function wt(t, e, n) {
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
  }, s = ["bottom", "top", "right", "left"], a = s.find((c) => r[c] >= i[c] + 8);
  return a || s.reduce((c, p) => r[p] > r[c] ? p : c, s[0]);
}
function yt(t) {
  const { target: e, card: n, offset: r, viewport: i } = t, s = t.side === "auto", a = s ? wt(e, n, i) : t.side, c = s ? "center" : t.align, p = t.alignOffset ?? 0, u = c === "start" ? p : c === "end" ? -p : 0;
  let d = 0, l = 0;
  return a === "top" || a === "bottom" ? (d = a === "top" ? e.top - n.height - r : e.bottom + r, l = c === "start" ? e.left : c === "end" ? e.right - n.width : e.left + e.width / 2 - n.width / 2, l += u) : (l = a === "left" ? e.left - n.width - r : e.right + r, d = c === "start" ? e.top : c === "end" ? e.bottom - n.height : e.top + e.height / 2 - n.height / 2, d += u), l = Math.max(8, Math.min(l, i.width - n.width - 8)), d = Math.max(8, Math.min(d, i.height - n.height - 8)), { top: d, left: l };
}
function q(t) {
  const e = document.createElement("button");
  return e.type = "button", e.className = `tours-card__btn${t.primary ? " tours-card__btn--primary" : ""}${t.disabled ? " tours-card__btn--disabled" : ""}`, e.textContent = t.label, !t.disabled && t.onClick && e.addEventListener("click", t.onClick), e;
}
function vt(t) {
  const e = document.createElement("div");
  if (e.className = `tours-card${t.ghost ? " tours-card--ghost" : ""}`, t.radius != null && (e.style.borderRadius = `${t.radius}px`), t.showClose) {
    const r = document.createElement("button");
    r.className = "tours-card__close", r.type = "button", r.textContent = "×", r.setAttribute("aria-label", "Close"), t.onClose && r.addEventListener("click", t.onClose), e.appendChild(r);
  }
  const n = document.createElement("div");
  if (n.className = "tours-card__content", t.contentHtml != null ? n.innerHTML = t.contentHtml : n.textContent = t.contentText ?? "", e.appendChild(n), t.back || t.next || t.progress) {
    const r = document.createElement("div");
    if (r.className = "tours-card__footer", t.back && r.appendChild(q(t.back)), t.progress) {
      const i = document.createElement("span");
      i.className = "tours-card__progress", i.textContent = t.progress, r.appendChild(i);
    }
    t.next && r.appendChild(q(t.next)), e.appendChild(r);
  }
  return e;
}
const Et = `
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
function Ct(t) {
  const e = t.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*\*/g, "\0").replace(/\*/g, "[^/]*").replace(/ /g, ".*").replace(/\?/g, ".");
  return new RegExp(`^${e}$`);
}
function T(t, e) {
  if (!t) return !0;
  if (t.regex)
    try {
      return new RegExp(t.regex).test(e);
    } catch {
      return !1;
    }
  if (t.glob)
    try {
      return Ct(t.glob).test(e);
    } catch {
      return !1;
    }
  return !0;
}
function _t(t) {
  if (!t || !t.glob) return null;
  const e = t.glob.replace(/\*+/g, "");
  return /^https?:\/\//i.test(e) || e.startsWith("#") || e.startsWith("/") ? e : null;
}
const O = "tours:locationchange";
let K = !1;
function kt() {
  if (!K) {
    K = !0;
    for (const t of ["pushState", "replaceState"]) {
      const e = history[t];
      history[t] = function(...r) {
        const i = e.apply(this, r);
        return window.dispatchEvent(new Event(O)), i;
      };
    }
  }
}
function G(t) {
  return kt(), window.addEventListener("popstate", t), window.addEventListener("hashchange", t), window.addEventListener(O, t), () => {
    window.removeEventListener("popstate", t), window.removeEventListener("hashchange", t), window.removeEventListener(O, t);
  };
}
const M = "tours:progress";
function It() {
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
function St(t) {
  const e = t.get(M);
  if (!e) return null;
  try {
    const n = JSON.parse(e);
    if (typeof n?.tourId == "string" && typeof n?.index == "number") return n;
  } catch {
  }
  return null;
}
function $t(t, e) {
  t.set(M, JSON.stringify(e));
}
function Q(t) {
  t.remove(M);
}
const tt = "tours:seen:";
function Lt(t, e) {
  const n = t.get(tt + e), r = n ? parseInt(n, 10) : 0;
  return Number.isNaN(r) ? 0 : r;
}
function Ut(t, e) {
  t.set(tt + e, String(Lt(t, e) + 1));
}
const Nt = "[data-tours-editor]";
function et() {
  return typeof document < "u" && document.querySelector(Nt) !== null;
}
function Tt(t, e = {}) {
  const n = Z("player"), r = e.state;
  let i = null, s = null, a = null, c = null, p = null, u = null, d = !1, l = 0, y = 0, E = null;
  const g = t.display?.padding ?? gt, m = t.display?.radius ?? mt, b = t.display?.cardRadius ?? bt, v = t.display?.offset ?? xt;
  function A(o) {
    return z(o.selectors);
  }
  function F(o) {
    return o.action?.type === "click";
  }
  function $(o) {
    return T(o.pageUrl, window.location.href);
  }
  function k() {
    r && $t(r, { tourId: t.id, index: l });
  }
  function H() {
    if (i) return;
    i = document.createElement("div"), i.setAttribute("data-tours-player", ""), s = i.attachShadow({ mode: "open" });
    const o = document.createElement("style");
    o.textContent = lt + Et, s.appendChild(o), p = document.createElement("div"), p.className = "tours-backdrop", p.addEventListener("click", (f) => {
      const h = t.steps[l], x = h ? A(h) : null;
      if (x) {
        const w = x.getBoundingClientRect();
        if (f.clientX >= w.left - g && f.clientX <= w.right + g && f.clientY >= w.top - g && f.clientY <= w.bottom + g) return;
      }
      _();
    }), s.appendChild(p), a = document.createElement("div"), a.className = "tours-spotlight", a.style.borderRadius = `${m}px`, s.appendChild(a), document.body.appendChild(i);
  }
  function nt(o) {
    if (!p) return;
    if (!o) {
      p.style.clipPath = "";
      return;
    }
    const f = o.left - g, h = o.top - g, x = o.right + g, w = o.bottom + g;
    p.style.clipPath = `polygon(0 0, 0 100%, ${f}px 100%, ${f}px ${h}px, ${x}px ${h}px, ${x}px ${w}px, ${f}px ${w}px, ${f}px 100%, 100% 100%, 100% 0)`;
  }
  function Y(o, f = !1) {
    a && (a.style.transitionDuration = f ? "0ms" : "", a.style.display = "block", a.style.left = `${o.left - g}px`, a.style.top = `${o.top - g}px`, a.style.width = `${o.width + g * 2}px`, a.style.height = `${o.height + g * 2}px`);
  }
  function W(o, f) {
    if (!c) return;
    const h = {
      top: o.top - g,
      left: o.left - g,
      right: o.right + g,
      bottom: o.bottom + g,
      width: o.width + g * 2,
      height: o.height + g * 2
    }, { top: x, left: w } = yt({
      target: h,
      card: { width: c.offsetWidth, height: c.offsetHeight },
      side: f.placement ?? "bottom",
      align: f.align ?? "center",
      offset: v,
      alignOffset: t.display?.alignOffset ?? 0,
      viewport: { width: window.innerWidth, height: window.innerHeight }
    });
    c.style.left = `${w}px`, c.style.top = `${x}px`;
  }
  function rt(o) {
    const f = Math.max(1, t.steps.length - y), h = Math.max(1, Math.min(l + 1 - y, f));
    c && c.remove(), c = vt({
      contentText: o.content.default,
      progress: `Step ${h} of ${f}`,
      showClose: !0,
      onClose: _,
      radius: b,
      back: { label: o.backLabel ?? "Back", disabled: l === 0, onClick: P },
      next: {
        label: o.nextLabel ?? (l === f - 1 ? "Done" : "Next"),
        primary: !0,
        onClick: R
      }
    }), s?.appendChild(c);
  }
  function C() {
    if (!d) return;
    const o = t.steps[l];
    if (!o) {
      _();
      return;
    }
    n.log("render step", l, o.id);
    const f = A(o);
    if (!f) {
      n.log(`step "${o.id}" target not found yet — waiting`, o.selectors), J(o.selectors, { timeout: 4e3 }).then((x) => {
        !d || t.steps[l] !== o || (x ? C() : (n.warn(`step "${o.id}" skipped: no element for selectors`, o.selectors), y += 1, l < t.steps.length - 1 ? (l += 1, C()) : _()));
      });
      return;
    }
    H(), f.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" }), rt(o);
    const h = f.getBoundingClientRect();
    Y(h), W(h, o), nt(F(o) ? h : null), ot(o);
  }
  function ot(o) {
    if (u?.(), u = null, !F(o)) return;
    const f = l + 1, h = t.steps[f];
    !h || $(h) || (u = G(() => {
      !d || t.steps[l] !== o || T(h.pageUrl, window.location.href) && (u?.(), u = null, n.log("visitor navigated → advancing to", h.id), l = f, k(), C());
    }));
  }
  function B(o) {
    d && (o.key === "Escape" ? (o.preventDefault(), _()) : o.key === "ArrowRight" ? R() : o.key === "ArrowLeft" && P());
  }
  function L() {
    if (!d) return;
    const o = t.steps[l];
    if (!o) return;
    const f = A(o);
    if (!f) return;
    const h = f.getBoundingClientRect();
    Y(h, !0), W(h, o);
  }
  function it(o = 0) {
    if (!d && t.steps.length !== 0) {
      if (!e.allowWhileEditing && et()) {
        n.log(`start suppressed for "${t.id}" — the builder is mounted`);
        return;
      }
      d = !0, l = Math.max(0, Math.min(o, t.steps.length - 1)), y = 0, n.log("start", t.id, `at ${l}/${t.steps.length}`), H(), window.addEventListener("keydown", B, !0), window.addEventListener("resize", L, !0), window.addEventListener("scroll", L, !0), k(), C();
    }
  }
  function st() {
    a && (a.style.display = "none"), c && (c.remove(), c = null);
  }
  function N() {
    st(), !E && (E = G(() => {
      if (!d) {
        E?.(), E = null;
        return;
      }
      const o = t.steps[l];
      o && $(o) && (E?.(), E = null, C());
    }));
  }
  function X() {
    E && (E(), E = null), u && (u(), u = null), d && (d = !1, window.removeEventListener("keydown", B, !0), window.removeEventListener("resize", L, !0), window.removeEventListener("scroll", L, !0), i && i.parentNode && i.parentNode.removeChild(i), i = null, s = null, a = null, c = null, p = null);
  }
  function _() {
    n.log("stop"), X(), r && Q(r);
  }
  function R() {
    if (!d) return;
    const o = l + 1, f = t.steps[o];
    if (!f) {
      _();
      return;
    }
    if ($(f)) {
      l = o, k(), C();
      return;
    }
    l = o, k();
    const h = (D) => {
      X(), e.onNavigate ? e.onNavigate(D, f.id) : window.location.assign(D);
    }, x = t.steps[l - 1]?.action;
    if (x && x.type === "navigate" && x.url) {
      x.url.startsWith("#") ? (n.log("page transition (hash navigate) → resume at", l), N(), window.location.hash = x.url) : (n.log("page transition (navigate) → resume at", l), h(x.url));
      return;
    }
    const w = _t(f.pageUrl);
    if (w) {
      w.startsWith("#") ? (n.log("page transition (derived hash) → resume at", l), N(), window.location.hash = w) : (n.log("page transition (derived navigate) → resume at", l, w), h(w));
      return;
    }
    n.log("page transition (wait) → resume at", l), N();
  }
  function P() {
    if (!d) return;
    const o = t.steps[l - 1];
    if (o) {
      if ($(o)) {
        l -= 1, k(), C();
        return;
      }
      l -= 1, k(), n.log("page transition back → resume at", l), N(), window.history.back();
    }
  }
  return { start: it, stop: _, next: R, prev: P };
}
function zt(t, e = {}) {
  const n = e.state;
  if (!n) return null;
  const r = St(n);
  if (!r || r.tourId !== t.id) return null;
  if (!t.steps[r.index])
    return Q(n), null;
  let i = -1;
  for (let a = r.index; a < t.steps.length; a++)
    if (T(t.steps[a].pageUrl, window.location.href)) {
      i = a;
      break;
    }
  if (i === -1) return null;
  const s = Tt(t, e);
  return s.start(i), s;
}
const At = `
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
function Rt(t) {
  const e = t.corner ?? "bottom-right", n = t.offset ?? 24, r = document.createElement("div");
  r.setAttribute("data-tours-cta", "");
  const i = r.attachShadow({ mode: "open" }), s = document.createElement("style");
  s.textContent = At, i.appendChild(s);
  const a = document.createElement("div");
  a.className = "cta";
  const [c, p] = e.split("-");
  a.style[c] = `${n}px`, a.style[p] = `${n}px`;
  const u = () => {
    r.parentNode && r.parentNode.removeChild(r);
  }, d = document.createElement("button");
  d.className = "cta__close", d.type = "button", d.textContent = "×", d.setAttribute("aria-label", "Dismiss"), d.addEventListener("click", u);
  const l = document.createElement("p");
  l.className = "cta__text", l.textContent = t.text;
  const y = document.createElement("button");
  return y.className = "cta__btn", y.type = "button", y.textContent = t.button, y.addEventListener("click", () => {
    u(), t.onStart();
  }), a.append(d, l, y), i.appendChild(a), document.body.appendChild(r), u;
}
function Ot(t, e) {
  if (et()) return () => {
  };
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
      return J([n.selector], { timeout: 0 }).then((a) => {
        a && !s && i();
      }), () => {
        s = !0;
      };
    }
    case "cta": {
      let s = () => {
      };
      return s = Rt({
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
function Mt(t = window.innerWidth) {
  return t <= 640 ? "mobile" : t <= 1024 ? "tablet" : "desktop";
}
function Pt(t, e) {
  return !(t.url && !T(t.url, e.url) || t.role !== void 0 && t.role !== e.role || t.firstVisitOnly && !e.firstVisit || t.device && t.device !== e.device || t.unlessSeen && e.seenCount > 0 || t.maxShows !== void 0 && e.seenCount >= t.maxShows);
}
function Ft(t, e) {
  return !t || t.length === 0 ? !0 : t.some((n) => Pt(n.when, e));
}
export {
  Et as CARD_STYLES,
  M as PROGRESS_KEY,
  Ot as armTrigger,
  wt as autoSide,
  ft as buildSelectors,
  Q as clearProgress,
  It as createLocalState,
  Z as createLogger,
  Dt as createPicker,
  Tt as createPlayer,
  _t as deriveUrl,
  Mt as detectDevice,
  et as isBuilderMounted,
  U as isLoggingEnabled,
  Ut as markSeen,
  Ft as matchRules,
  T as matchUrl,
  yt as placeCard,
  St as readProgress,
  vt as renderCard,
  z as resolveElement,
  zt as resumeTour,
  Lt as seenCount,
  J as waitForElement,
  $t as writeProgress
};
