const wt = `
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
`, yt = `
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
function M(t) {
  return JSON.stringify(t);
}
function vt(t) {
  return /^[a-zA-Z][\w-]*$/.test(t) && t.length <= 30 && !/\d{2,}/.test(t) && !/^(css-|sc-|jsx-|emotion-|_|is-|has-)/.test(t);
}
function Q(t) {
  const e = [];
  let r = t;
  for (; r && r !== document.body && r.nodeType === 1; ) {
    const n = r.tagName.toLowerCase(), s = r.parentElement;
    if (!s) {
      e.unshift(n);
      break;
    }
    const i = Array.from(s.children).filter((a) => a.tagName === r.tagName);
    e.unshift(i.length > 1 ? `${n}:nth-of-type(${i.indexOf(r) + 1})` : n), r = s;
  }
  return `body > ${e.join(" > ")}`;
}
function Et(t) {
  let e = t.parentElement;
  for (; e && e !== document.body && !e.id; )
    e = e.parentElement;
  if (!e || !e.id) return null;
  const r = [];
  let n = t;
  for (; n && n !== e; ) {
    const s = n.tagName.toLowerCase(), i = n.parentElement;
    if (!i) return null;
    const a = Array.from(i.children).filter((u) => u.tagName === n.tagName);
    r.unshift(a.length > 1 ? `${s}:nth-of-type(${a.indexOf(n) + 1})` : s), n = i;
  }
  return `#${CSS.escape(e.id)} > ${r.join(" > ")}`;
}
const Ct = ["data-testid", "data-test", "data-test-id", "data-cy", "data-qa", "data-id", "data-name"];
function _t(t) {
  const e = [], r = /* @__PURE__ */ new Set(), n = t.tagName.toLowerCase(), s = (d) => {
    if (!(!d || r.has(d)))
      try {
        document.querySelector(d) === t && (r.add(d), e.push(d));
      } catch {
      }
  };
  t.id && s(`#${CSS.escape(t.id)}`);
  for (const d of Ct) {
    const f = t.getAttribute(d);
    f && s(`${n}[${d}=${M(f)}]`);
  }
  const i = t.getAttribute("name");
  i && s(`${n}[name=${M(i)}]`);
  const a = t.getAttribute("aria-label");
  a && s(`[aria-label=${M(a)}]`);
  const u = Array.from(t.classList).filter(vt);
  u.length && s(`${n}.${u.map((d) => CSS.escape(d)).join(".")}`);
  for (const d of u) s(`${n}.${CSS.escape(d)}`);
  s(Et(t)), s(Q(t));
  const g = (t.textContent ?? "").replace(/\s+/g, " ").trim();
  if (g && g.length <= 50 && /^(a|button|summary|label|h[1-6])$/.test(n)) {
    const d = `text=${g}`;
    r.has(d) || (r.add(d), e.push(d));
  }
  return e.length === 0 && e.push(Q(t)), e;
}
const kt = "a, button, summary, label, h1, h2, h3, h4, h5, h6";
function tt(t, e) {
  return !(t instanceof Element) || !t.isConnected || e !== document && e instanceof Node && !e.contains(t) ? null : t;
}
function St(t, e) {
  if (typeof t == "function") {
    let r;
    try {
      r = t();
    } catch {
      return null;
    }
    return tt(r, e);
  }
  if (typeof t != "string") return tt(t, e);
  if (t.startsWith("text=")) {
    const r = t.slice(5).trim();
    for (const n of Array.from(e.querySelectorAll(kt)))
      if ((n.textContent ?? "").replace(/\s+/g, " ").trim() === r) return n;
    return null;
  }
  try {
    return e.querySelector(t);
  } catch {
    return null;
  }
}
function H(t, e = document) {
  for (const r of t) {
    const n = St(r, e);
    if (n) return n;
  }
  return null;
}
function rt(t, e = {}) {
  const r = e.root ?? document, n = H(t, r);
  return n ? Promise.resolve(n) : new Promise((s) => {
    let i = !1, a;
    const u = (f) => {
      i || (i = !0, g.disconnect(), a && clearTimeout(a), s(f));
    }, g = new MutationObserver(() => {
      const f = H(t, r);
      f && u(f);
    });
    g.observe(document.documentElement, {
      childList: !0,
      subtree: !0,
      attributes: !0
    });
    const d = e.timeout ?? 4e3;
    d > 0 && Number.isFinite(d) && (a = setTimeout(() => u(null), d));
  });
}
let L = null;
function F() {
  if (L !== null) return L;
  try {
    L = new URLSearchParams(window.location.search).has("use_logs");
  } catch {
    L = !1;
  }
  return L;
}
function V(t) {
  const e = `[tours:${t}]`;
  return {
    log: (...r) => {
      F() && console.log(e, ...r);
    },
    warn: (...r) => {
      F() && console.warn(e, ...r);
    },
    error: (...r) => {
      F() && console.error(e, ...r);
    }
  };
}
function Xt(t, e = {}) {
  const r = V("picker");
  let n = null, s = null, i = null, a = !1;
  function u(l) {
    if (l === n) return !0;
    for (const x of e.ignore ?? [])
      if (x && x.contains(l)) return !0;
    return !1;
  }
  function g() {
    if (n) return;
    n = document.createElement("div"), n.setAttribute("data-tours-picker", ""), s = n.attachShadow({ mode: "open" });
    const l = document.createElement("style");
    l.textContent = wt, s.appendChild(l), i = document.createElement("div"), i.className = "tours-picker-overlay", i.style.display = "none", s.appendChild(i);
    const x = document.createElement("div");
    x.className = "tours-picker-hint", x.textContent = "Hover and click an element • Esc to cancel", s.appendChild(x), document.body.appendChild(n);
  }
  function d(l, x) {
    const v = document.elementFromPoint(l, x);
    return !v || u(v) ? null : v;
  }
  function f(l) {
    if (!a || !i) return;
    const x = d(l.clientX, l.clientY);
    if (!x) {
      i.style.display = "none";
      return;
    }
    const v = x.getBoundingClientRect();
    i.style.display = "block", i.style.left = `${v.left}px`, i.style.top = `${v.top}px`, i.style.width = `${v.width}px`, i.style.height = `${v.height}px`;
  }
  function m(l) {
    if (!a) return;
    const x = d(l.clientX, l.clientY);
    if (l.preventDefault(), l.stopPropagation(), !x) return;
    const v = _t(x);
    r.log("picked", v), p(), t(v);
  }
  function c(l) {
    l.key === "Escape" && (l.preventDefault(), p());
  }
  function E() {
    a || (a = !0, r.log("start"), g(), document.addEventListener("mousemove", f, !0), document.addEventListener("click", m, !0), document.addEventListener("keydown", c, !0));
  }
  function p() {
    a && (a = !1, document.removeEventListener("mousemove", f, !0), document.removeEventListener("click", m, !0), document.removeEventListener("keydown", c, !0), n && n.parentNode && n.parentNode.removeChild(n), n = null, s = null, i = null);
  }
  return { start: E, stop: p };
}
const $t = 6, Lt = 6, Nt = 10, Rt = 12;
function Tt(t, e, r) {
  const n = {
    top: t.top,
    bottom: r.height - t.bottom,
    left: t.left,
    right: r.width - t.right
  }, s = {
    top: e.height,
    bottom: e.height,
    left: e.width,
    right: e.width
  }, i = ["bottom", "top", "right", "left"], a = i.find((u) => n[u] >= s[u] + 8);
  return a || i.reduce((u, g) => n[g] > n[u] ? g : u, i[0]);
}
function At(t) {
  const { target: e, card: r, offset: n, viewport: s } = t, i = t.side === "auto", a = i ? Tt(e, r, s) : t.side, u = i ? "center" : t.align, g = t.alignOffset ?? 0, d = u === "start" ? g : u === "end" ? -g : 0;
  let f = 0, m = 0;
  return a === "top" || a === "bottom" ? (f = a === "top" ? e.top - r.height - n : e.bottom + n, m = u === "start" ? e.left : u === "end" ? e.right - r.width : e.left + e.width / 2 - r.width / 2, m += d) : (m = a === "left" ? e.left - r.width - n : e.right + n, f = u === "start" ? e.top : u === "end" ? e.bottom - r.height : e.top + e.height / 2 - r.height / 2, f += d), m = Math.max(8, Math.min(m, s.width - r.width - 8)), f = Math.max(8, Math.min(f, s.height - r.height - 8)), { top: f, left: m };
}
function et(t) {
  const e = document.createElement("button");
  return e.type = "button", e.className = `tours-card__btn${t.primary ? " tours-card__btn--primary" : ""}${t.disabled ? " tours-card__btn--disabled" : ""}`, e.textContent = t.label, !t.disabled && t.onClick && e.addEventListener("click", t.onClick), e;
}
function It(t) {
  const e = document.createElement("div");
  if (e.className = `tours-card${t.ghost ? " tours-card--ghost" : ""}`, t.radius != null && (e.style.borderRadius = `${t.radius}px`), t.showClose) {
    const n = document.createElement("button");
    n.className = "tours-card__close", n.type = "button", n.textContent = "×", n.setAttribute("aria-label", "Close"), t.onClose && n.addEventListener("click", t.onClose), e.appendChild(n);
  }
  const r = document.createElement("div");
  if (r.className = "tours-card__content", t.contentHtml != null ? r.innerHTML = t.contentHtml : r.textContent = t.contentText ?? "", e.appendChild(r), t.back || t.next || t.progress) {
    const n = document.createElement("div");
    if (n.className = "tours-card__footer", t.back && n.appendChild(et(t.back)), t.progress) {
      const s = document.createElement("span");
      s.className = "tours-card__progress", s.textContent = t.progress, n.appendChild(s);
    }
    t.next && n.appendChild(et(t.next)), e.appendChild(n);
  }
  return e;
}
const zt = `
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
function Pt(t) {
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
      return Pt(t.glob).test(e);
    } catch {
      return !1;
    }
  return !0;
}
function Dt(t) {
  if (!t || !t.glob) return null;
  const e = t.glob.replace(/\*+/g, "");
  return /^https?:\/\//i.test(e) || e.startsWith("#") || e.startsWith("/") ? e : null;
}
const Y = "tours:locationchange";
let nt = !1;
function Ut() {
  if (!nt) {
    nt = !0;
    for (const t of ["pushState", "replaceState"]) {
      const e = history[t];
      history[t] = function(...n) {
        const s = e.apply(this, n);
        return window.dispatchEvent(new Event(Y)), s;
      };
    }
  }
}
function W(t) {
  return Ut(), window.addEventListener("popstate", t), window.addEventListener("hashchange", t), window.addEventListener(Y, t), () => {
    window.removeEventListener("popstate", t), window.removeEventListener("hashchange", t), window.removeEventListener(Y, t);
  };
}
const X = "tours:progress";
function jt() {
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
function ot(t) {
  const e = t.get(X);
  if (!e) return null;
  try {
    const r = JSON.parse(e);
    if (typeof r?.tourId == "string" && typeof r?.index == "number") return r;
  } catch {
  }
  return null;
}
function T(t, e) {
  t.set(X, JSON.stringify(e));
}
function it(t) {
  t.remove(X);
}
const st = "tours:seen:";
function at(t, e) {
  const r = t.get(st + e), n = r ? parseInt(r, 10) : 0;
  return Number.isNaN(n) ? 0 : n;
}
function Ot(t, e) {
  t.set(st + e, String(at(t, e) + 1));
}
const Mt = `
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
function ct(t, e) {
  return e ? e(t) : lt({
    text: t.text,
    button: t.button,
    corner: t.corner,
    offset: t.offset,
    onStart: t.onResume
  });
}
function lt(t) {
  const e = t.corner ?? "bottom-right", r = t.offset ?? 24, n = document.createElement("div");
  n.setAttribute("data-tours-cta", "");
  const s = n.attachShadow({ mode: "open" }), i = document.createElement("style");
  i.textContent = Mt, s.appendChild(i);
  const a = document.createElement("div");
  a.className = "cta";
  const [u, g] = e.split("-");
  a.style[u] = `${r}px`, a.style[g] = `${r}px`;
  const d = () => {
    n.parentNode && n.parentNode.removeChild(n);
  }, f = document.createElement("button");
  f.className = "cta__close", f.type = "button", f.textContent = "×", f.setAttribute("aria-label", "Dismiss"), f.addEventListener("click", d);
  const m = document.createElement("p");
  m.className = "cta__text", m.textContent = t.text;
  const c = document.createElement("button");
  return c.className = "cta__btn", c.type = "button", c.textContent = t.button, c.addEventListener("click", () => {
    d(), t.onStart();
  }), a.append(f, m, c), s.appendChild(a), document.body.appendChild(n), d;
}
const Ft = "[data-tours-editor]";
function ut() {
  return typeof document < "u" && document.querySelector(Ft) !== null;
}
function B(t, e = {}) {
  const r = V("player"), n = e.state;
  let s = null, i = null, a = null, u = null, g = null, d = null, f = null, m = !1, c = 0, E = 0, p = null;
  const l = t.display?.padding ?? $t, x = t.display?.radius ?? Lt, v = t.display?.cardRadius ?? Nt, dt = t.display?.offset ?? Rt;
  function I(o) {
    return H(o.selectors);
  }
  function z(o) {
    return o.action?.type === "click";
  }
  function S(o) {
    return A(o.pageUrl, window.location.href);
  }
  function k() {
    n && T(n, { tourId: t.id, index: c });
  }
  function j() {
    if (s) return;
    s = document.createElement("div"), s.setAttribute("data-tours-player", ""), i = s.attachShadow({ mode: "open" });
    const o = document.createElement("style");
    o.textContent = yt + zt, i.appendChild(o), g = document.createElement("div"), g.className = "tours-backdrop", g.addEventListener("click", (h) => {
      const b = t.steps[c], w = b ? I(b) : null;
      if (w) {
        const y = w.getBoundingClientRect();
        if (h.clientX >= y.left - l && h.clientX <= y.right + l && h.clientY >= y.top - l && h.clientY <= y.bottom + l) return;
      }
      _();
    }), i.appendChild(g), a = document.createElement("div"), a.className = "tours-spotlight", a.style.borderRadius = `${x}px`, i.appendChild(a), document.body.appendChild(s);
  }
  function ft(o) {
    if (!g) return;
    if (!o) {
      g.style.clipPath = "";
      return;
    }
    const h = o.left - l, b = o.top - l, w = o.right + l, y = o.bottom + l;
    g.style.clipPath = `polygon(0 0, 0 100%, ${h}px 100%, ${h}px ${b}px, ${w}px ${b}px, ${w}px ${y}px, ${h}px ${y}px, ${h}px 100%, 100% 100%, 100% 0)`;
  }
  function q(o, h = !1) {
    a && (a.style.transitionDuration = h ? "0ms" : "", a.style.display = "block", a.style.left = `${o.left - l}px`, a.style.top = `${o.top - l}px`, a.style.width = `${o.width + l * 2}px`, a.style.height = `${o.height + l * 2}px`);
  }
  function G(o, h) {
    if (!u) return;
    const b = {
      top: o.top - l,
      left: o.left - l,
      right: o.right + l,
      bottom: o.bottom + l,
      width: o.width + l * 2,
      height: o.height + l * 2
    }, { top: w, left: y } = At({
      target: b,
      card: { width: u.offsetWidth, height: u.offsetHeight },
      side: h.placement ?? "bottom",
      align: h.align ?? "center",
      offset: dt,
      alignOffset: t.display?.alignOffset ?? 0,
      viewport: { width: window.innerWidth, height: window.innerHeight }
    });
    u.style.left = `${y}px`, u.style.top = `${w}px`;
  }
  function pt(o) {
    const h = Math.max(1, t.steps.length - E), b = Math.max(1, Math.min(c + 1 - E, h));
    u && u.remove();
    const w = c === t.steps.length - 1, y = t.steps[c - 1], $ = !!y && S(y), xt = !z(o) || w;
    u = It({
      contentText: o.content.default,
      progress: `Step ${b} of ${h}`,
      showClose: !0,
      onClose: gt,
      radius: v,
      back: $ ? { label: o.backLabel ?? "Back", onClick: O } : void 0,
      next: xt ? {
        label: o.nextLabel ?? (w ? "Done" : "Next"),
        primary: !0,
        onClick: U
      } : void 0
    }), i?.appendChild(u);
  }
  function C() {
    if (!m) return;
    const o = t.steps[c];
    if (!o) {
      _();
      return;
    }
    r.log("render step", c, o.id);
    const h = I(o);
    if (!h) {
      r.log(`step "${o.id}" target not found yet — waiting`, o.selectors), rt(o.selectors, { timeout: 4e3 }).then((w) => {
        !m || t.steps[c] !== o || (w ? C() : (r.warn(`step "${o.id}" skipped: no element for selectors`, o.selectors), E += 1, c < t.steps.length - 1 ? (c += 1, C()) : _()));
      });
      return;
    }
    j(), h.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" }), pt(o);
    const b = h.getBoundingClientRect();
    q(b), G(b, o), ft(z(o) ? b : null), ht(o);
  }
  function ht(o) {
    if (d?.(), d = null, !z(o)) return;
    const h = c + 1, b = t.steps[h];
    !b || S(b) || (d = W(() => {
      !m || t.steps[c] !== o || A(b.pageUrl, window.location.href) && (d?.(), d = null, r.log("visitor navigated → advancing to", b.id), c = h, k(), C());
    }));
  }
  function K(o) {
    m && (o.key === "Escape" ? (o.preventDefault(), _()) : o.key === "ArrowRight" ? U() : o.key === "ArrowLeft" && O());
  }
  function N() {
    if (!m) return;
    const o = t.steps[c];
    if (!o) return;
    const h = I(o);
    if (!h) return;
    const b = h.getBoundingClientRect();
    q(b, !0), G(b, o);
  }
  function J(o = 0) {
    if (!m && t.steps.length !== 0) {
      if (!e.allowWhileEditing && ut()) {
        r.log(`start suppressed for "${t.id}" — the builder is mounted`);
        return;
      }
      D(), m = !0, c = Math.max(0, Math.min(o, t.steps.length - 1)), E = 0, r.log("start", t.id, `at ${c}/${t.steps.length}`), j(), window.addEventListener("keydown", K, !0), window.addEventListener("resize", N, !0), window.addEventListener("scroll", N, !0), k(), C();
    }
  }
  function mt() {
    a && (a.style.display = "none"), u && (u.remove(), u = null);
  }
  function R() {
    mt(), !p && (p = W(() => {
      if (!m) {
        p?.(), p = null;
        return;
      }
      const o = t.steps[c];
      o && S(o) && (p?.(), p = null, C());
    }));
  }
  function P() {
    p && (p(), p = null), d && (d(), d = null), m && (m = !1, window.removeEventListener("keydown", K, !0), window.removeEventListener("resize", N, !0), window.removeEventListener("scroll", N, !0), s && s.parentNode && s.parentNode.removeChild(s), s = null, i = null, a = null, u = null, g = null);
  }
  function _() {
    r.log("stop"), D(), P(), n && it(n);
  }
  function D() {
    f?.(), f = null;
  }
  function gt() {
    t.dismiss?.mode === "minimize" ? Z() : _();
  }
  function Z() {
    m && (r.log("minimized", t.id, `at ${c}`), P(), n && T(n, { tourId: t.id, index: c, minimized: !0 }), bt());
  }
  function bt() {
    D();
    const o = t.dismiss?.resume;
    f = ct(
      {
        tourId: t.id,
        text: o?.text ?? "Carry on with the tour?",
        button: o?.button ?? "Resume",
        corner: o?.corner,
        offset: o?.offset,
        onResume: () => {
          f = null, n && T(n, { tourId: t.id, index: c }), J(c);
        }
      },
      e.renderResume
    );
  }
  function U() {
    if (!m) return;
    const o = c + 1, h = t.steps[o];
    if (!h) {
      _();
      return;
    }
    if (S(h)) {
      c = o, k(), C();
      return;
    }
    c = o, k();
    const b = ($) => {
      P(), e.onNavigate ? e.onNavigate($, h.id) : window.location.assign($);
    }, w = t.steps[c - 1]?.action;
    if (w && w.type === "navigate" && w.url) {
      w.url.startsWith("#") ? (r.log("page transition (hash navigate) → resume at", c), R(), window.location.hash = w.url) : (r.log("page transition (navigate) → resume at", c), b(w.url));
      return;
    }
    const y = Dt(h.pageUrl);
    if (y) {
      y.startsWith("#") ? (r.log("page transition (derived hash) → resume at", c), R(), window.location.hash = y) : (r.log("page transition (derived navigate) → resume at", c, y), b(y));
      return;
    }
    r.log("page transition (wait) → resume at", c), R();
  }
  function O() {
    if (!m) return;
    const o = t.steps[c - 1];
    if (o) {
      if (S(o)) {
        c -= 1, k(), C();
        return;
      }
      c -= 1, k(), r.log("page transition back → resume at", c), R(), window.history.back();
    }
  }
  return { start: J, stop: _, next: U, prev: O, minimize: Z, isActive: () => m };
}
function Ht(t, e = {}) {
  const r = e.state;
  if (!r) return null;
  const n = ot(r);
  if (!n || n.tourId !== t.id) return null;
  if (!t.steps[n.index])
    return it(r), null;
  let s = -1;
  for (let a = n.index; a < t.steps.length; a++)
    if (A(t.steps[a].pageUrl, window.location.href)) {
      s = a;
      break;
    }
  if (s === -1) return null;
  const i = B(t, e);
  return i.start(s), i;
}
function Yt(t, e) {
  if (ut()) return () => {
  };
  const r = t.trigger ?? { type: "manual" };
  let n = !1;
  const s = () => {
    n || (n = !0, e());
  };
  switch (r.type) {
    case "load": {
      const i = setTimeout(s, 0);
      return () => clearTimeout(i);
    }
    case "timer": {
      const i = setTimeout(s, Math.max(0, r.delay));
      return () => clearTimeout(i);
    }
    case "selector": {
      let i = !1;
      return rt([r.selector], { timeout: 0 }).then((a) => {
        a && !i && s();
      }), () => {
        i = !0;
      };
    }
    case "cta": {
      let i = () => {
      };
      return i = lt({
        text: r.text,
        button: r.button,
        corner: r.corner,
        offset: r.offset,
        onStart: s
      }), i;
    }
    case "manual":
    default:
      return () => {
      };
  }
}
function Wt(t = window.innerWidth) {
  return t <= 640 ? "mobile" : t <= 1024 ? "tablet" : "desktop";
}
function Bt(t, e) {
  return !(t.url && !A(t.url, e.url) || t.role !== void 0 && t.role !== e.role || t.firstVisitOnly && !e.firstVisit || t.device && t.device !== e.device || t.unlessSeen && e.seenCount > 0 || t.maxShows !== void 0 && e.seenCount >= t.maxShows);
}
function Vt(t, e) {
  return !t || t.length === 0 ? !0 : t.some((r) => Bt(r.when, e));
}
function qt(t, e = {}) {
  const r = V("mount"), n = e.state, s = () => typeof t == "function" ? t() : t;
  let i = null, a = [], u = null;
  function g() {
    for (const c of a) c();
    a = [], u?.(), u = null;
  }
  function d(c) {
    return !e.canRun || e.canRun(c);
  }
  function f() {
    if (i?.isActive()) return;
    i = null, g();
    const c = n ? ot(n) : null;
    if (n && c?.minimized) {
      const p = s().find((l) => l.id === c.tourId && d(l));
      if (p) {
        const l = p.dismiss?.resume;
        u = ct(
          {
            tourId: p.id,
            text: l?.text ?? "Carry on with the tour?",
            button: l?.button ?? "Resume",
            corner: l?.corner,
            offset: l?.offset,
            onResume: () => {
              u = null, T(n, { tourId: p.id, index: c.index });
              const x = B(p, e);
              i = x, x.start(c.index);
            }
          },
          e.renderResume
        );
        return;
      }
    }
    if (n)
      for (const p of s()) {
        if (!d(p)) continue;
        const l = Ht(p, e);
        if (l) {
          r.log("resumed", p.id), i = l;
          return;
        }
      }
    const E = Wt();
    for (const p of s()) {
      if (!d(p) || !p.trigger || p.trigger.type === "manual") continue;
      const l = n ? at(n, p.id) : 0;
      Vt(p.rules, {
        url: window.location.href,
        device: E,
        firstVisit: l === 0,
        seenCount: l
      }) && a.push(
        Yt(p, () => {
          n && Ot(n, p.id);
          const v = B(p, e);
          i = v, v.start();
        })
      );
    }
  }
  f();
  const m = W(f);
  return () => {
    m(), g(), i?.stop(), i = null;
  };
}
export {
  zt as CARD_STYLES,
  X as PROGRESS_KEY,
  Yt as armTrigger,
  Tt as autoSide,
  _t as buildSelectors,
  it as clearProgress,
  jt as createLocalState,
  V as createLogger,
  Xt as createPicker,
  B as createPlayer,
  Dt as deriveUrl,
  Wt as detectDevice,
  ut as isBuilderMounted,
  F as isLoggingEnabled,
  Ot as markSeen,
  Vt as matchRules,
  A as matchUrl,
  qt as mountTours,
  At as placeCard,
  ot as readProgress,
  It as renderCard,
  H as resolveElement,
  Ht as resumeTour,
  at as seenCount,
  rt as waitForElement,
  T as writeProgress
};
