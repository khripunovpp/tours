const yt = `
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
`, Et = `
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
function H(t) {
  return JSON.stringify(t);
}
function Ct(t) {
  return /^[a-zA-Z][\w-]*$/.test(t) && t.length <= 30 && !/\d{2,}/.test(t) && !/^(css-|sc-|jsx-|emotion-|_|is-|has-)/.test(t);
}
function et(t) {
  const e = [];
  let r = t;
  for (; r && r !== document.body && r.nodeType === 1; ) {
    const n = r.tagName.toLowerCase(), i = r.parentElement;
    if (!i) {
      e.unshift(n);
      break;
    }
    const s = Array.from(i.children).filter((a) => a.tagName === r.tagName);
    e.unshift(s.length > 1 ? `${n}:nth-of-type(${s.indexOf(r) + 1})` : n), r = i;
  }
  return `body > ${e.join(" > ")}`;
}
function kt(t) {
  let e = t.parentElement;
  for (; e && e !== document.body && !e.id; )
    e = e.parentElement;
  if (!e || !e.id) return null;
  const r = [];
  let n = t;
  for (; n && n !== e; ) {
    const i = n.tagName.toLowerCase(), s = n.parentElement;
    if (!s) return null;
    const a = Array.from(s.children).filter((u) => u.tagName === n.tagName);
    r.unshift(a.length > 1 ? `${i}:nth-of-type(${a.indexOf(n) + 1})` : i), n = s;
  }
  return `#${CSS.escape(e.id)} > ${r.join(" > ")}`;
}
const _t = ["data-testid", "data-test", "data-test-id", "data-cy", "data-qa", "data-id", "data-name"];
function St(t) {
  const e = [], r = /* @__PURE__ */ new Set(), n = t.tagName.toLowerCase(), i = (d) => {
    if (!(!d || r.has(d)))
      try {
        document.querySelector(d) === t && (r.add(d), e.push(d));
      } catch {
      }
  };
  t.id && i(`#${CSS.escape(t.id)}`);
  for (const d of _t) {
    const p = t.getAttribute(d);
    p && i(`${n}[${d}=${H(p)}]`);
  }
  const s = t.getAttribute("name");
  s && i(`${n}[name=${H(s)}]`);
  const a = t.getAttribute("aria-label");
  a && i(`[aria-label=${H(a)}]`);
  const u = Array.from(t.classList).filter(Ct);
  u.length && i(`${n}.${u.map((d) => CSS.escape(d)).join(".")}`);
  for (const d of u) i(`${n}.${CSS.escape(d)}`);
  i(kt(t)), i(et(t));
  const g = (t.textContent ?? "").replace(/\s+/g, " ").trim();
  if (g && g.length <= 50 && /^(a|button|summary|label|h[1-6])$/.test(n)) {
    const d = `text=${g}`;
    r.has(d) || (r.add(d), e.push(d));
  }
  return e.length === 0 && e.push(et(t)), e;
}
const $t = "a, button, summary, label, h1, h2, h3, h4, h5, h6";
function nt(t, e) {
  return !(t instanceof Element) || !t.isConnected || e !== document && e instanceof Node && !e.contains(t) ? null : t;
}
function Lt(t, e) {
  if (typeof t == "function") {
    let r;
    try {
      r = t();
    } catch {
      return null;
    }
    return nt(r, e);
  }
  if (typeof t != "string") return nt(t, e);
  if (t.startsWith("text=")) {
    const r = t.slice(5).trim();
    for (const n of Array.from(e.querySelectorAll($t)))
      if ((n.textContent ?? "").replace(/\s+/g, " ").trim() === r) return n;
    return null;
  }
  try {
    return e.querySelector(t);
  } catch {
    return null;
  }
}
function B(t, e = document) {
  for (const r of t) {
    const n = Lt(r, e);
    if (n) return n;
  }
  return null;
}
function it(t, e = {}) {
  const r = e.root ?? document, n = B(t, r);
  return n ? Promise.resolve(n) : new Promise((i) => {
    let s = !1, a;
    const u = (p) => {
      s || (s = !0, g.disconnect(), a && clearTimeout(a), i(p));
    }, g = new MutationObserver(() => {
      const p = B(t, r);
      p && u(p);
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
let N = null;
function Y() {
  if (N !== null) return N;
  try {
    N = new URLSearchParams(window.location.search).has("use_logs");
  } catch {
    N = !1;
  }
  return N;
}
function j(t) {
  const e = `[tours:${t}]`;
  return {
    log: (...r) => {
      Y() && console.log(e, ...r);
    },
    warn: (...r) => {
      Y() && console.warn(e, ...r);
    },
    error: (...r) => {
      Y() && console.error(e, ...r);
    }
  };
}
function Gt(t, e = {}) {
  const r = j("picker");
  let n = null, i = null, s = null, a = !1;
  function u(l) {
    if (l === n) return !0;
    for (const x of e.ignore ?? [])
      if (x && x.contains(l)) return !0;
    return !1;
  }
  function g() {
    if (n) return;
    n = document.createElement("div"), n.setAttribute("data-tours-picker", ""), i = n.attachShadow({ mode: "open" });
    const l = document.createElement("style");
    l.textContent = yt, i.appendChild(l), s = document.createElement("div"), s.className = "tours-picker-overlay", s.style.display = "none", i.appendChild(s);
    const x = document.createElement("div");
    x.className = "tours-picker-hint", x.textContent = "Hover and click an element • Esc to cancel", i.appendChild(x), document.body.appendChild(n);
  }
  function d(l, x) {
    const y = document.elementFromPoint(l, x);
    return !y || u(y) ? null : y;
  }
  function p(l) {
    if (!a || !s) return;
    const x = d(l.clientX, l.clientY);
    if (!x) {
      s.style.display = "none";
      return;
    }
    const y = x.getBoundingClientRect();
    s.style.display = "block", s.style.left = `${y.left}px`, s.style.top = `${y.top}px`, s.style.width = `${y.width}px`, s.style.height = `${y.height}px`;
  }
  function m(l) {
    if (!a) return;
    const x = d(l.clientX, l.clientY);
    if (l.preventDefault(), l.stopPropagation(), !x) return;
    const y = St(x);
    r.log("picked", y), h(), t(y);
  }
  function c(l) {
    l.key === "Escape" && (l.preventDefault(), h());
  }
  function C() {
    a || (a = !0, r.log("start"), g(), document.addEventListener("mousemove", p, !0), document.addEventListener("click", m, !0), document.addEventListener("keydown", c, !0));
  }
  function h() {
    a && (a = !1, document.removeEventListener("mousemove", p, !0), document.removeEventListener("click", m, !0), document.removeEventListener("keydown", c, !0), n && n.parentNode && n.parentNode.removeChild(n), n = null, i = null, s = null);
  }
  return { start: C, stop: h };
}
const Nt = 6, At = 6, Rt = 10, Tt = 12;
function It(t, e, r) {
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
  }, s = ["bottom", "top", "right", "left"], a = s.find((u) => n[u] >= i[u] + 8);
  return a || s.reduce((u, g) => n[g] > n[u] ? g : u, s[0]);
}
function zt(t) {
  const { target: e, card: r, offset: n, viewport: i } = t, s = t.side === "auto", a = s ? It(e, r, i) : t.side, u = s ? "center" : t.align, g = t.alignOffset ?? 0, d = u === "start" ? g : u === "end" ? -g : 0;
  let p = 0, m = 0;
  return a === "top" || a === "bottom" ? (p = a === "top" ? e.top - r.height - n : e.bottom + n, m = u === "start" ? e.left : u === "end" ? e.right - r.width : e.left + e.width / 2 - r.width / 2, m += d) : (m = a === "left" ? e.left - r.width - n : e.right + n, p = u === "start" ? e.top : u === "end" ? e.bottom - r.height : e.top + e.height / 2 - r.height / 2, p += d), m = Math.max(8, Math.min(m, i.width - r.width - 8)), p = Math.max(8, Math.min(p, i.height - r.height - 8)), { top: p, left: m };
}
function rt(t) {
  const e = document.createElement("button");
  return e.type = "button", e.className = `tours-card__btn${t.primary ? " tours-card__btn--primary" : ""}${t.disabled ? " tours-card__btn--disabled" : ""}`, e.textContent = t.label, !t.disabled && t.onClick && e.addEventListener("click", t.onClick), e;
}
function Pt(t) {
  const e = document.createElement("div");
  if (e.className = `tours-card${t.ghost ? " tours-card--ghost" : ""}`, t.radius != null && (e.style.borderRadius = `${t.radius}px`), t.showClose) {
    const n = document.createElement("button");
    n.className = "tours-card__close", n.type = "button", n.textContent = "×", n.setAttribute("aria-label", "Close"), t.onClose && n.addEventListener("click", t.onClose), e.appendChild(n);
  }
  const r = document.createElement("div");
  if (r.className = "tours-card__content", t.contentHtml != null ? r.innerHTML = t.contentHtml : r.textContent = t.contentText ?? "", e.appendChild(r), t.back || t.next || t.progress) {
    const n = document.createElement("div");
    if (n.className = "tours-card__footer", t.back && n.appendChild(rt(t.back)), t.progress) {
      const i = document.createElement("span");
      i.className = "tours-card__progress", i.textContent = t.progress, n.appendChild(i);
    }
    t.next && n.appendChild(rt(t.next)), e.appendChild(n);
  }
  return e;
}
const Dt = `
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
function Ut(t) {
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
      return Ut(t.glob).test(e);
    } catch {
      return !1;
    }
  return !0;
}
function Mt(t) {
  if (!t || !t.glob) return null;
  const e = t.glob.replace(/\*+/g, "");
  return /^https?:\/\//i.test(e) || e.startsWith("#") || e.startsWith("/") ? e : null;
}
const W = "tours:locationchange";
let ot = !1;
function Ot() {
  if (!ot) {
    ot = !0;
    for (const t of ["pushState", "replaceState"]) {
      const e = history[t];
      history[t] = function(...n) {
        const i = e.apply(this, n);
        return window.dispatchEvent(new Event(W)), i;
      };
    }
  }
}
function V(t) {
  return Ot(), window.addEventListener("popstate", t), window.addEventListener("hashchange", t), window.addEventListener(W, t), () => {
    window.removeEventListener("popstate", t), window.removeEventListener("hashchange", t), window.removeEventListener(W, t);
  };
}
const q = "tours:progress";
function Kt() {
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
function st(t) {
  const e = t.get(q);
  if (!e) return null;
  try {
    const r = JSON.parse(e);
    if (typeof r?.tourId == "string" && typeof r?.index == "number") return r;
  } catch {
  }
  return null;
}
function T(t, e) {
  t.set(q, JSON.stringify(e));
}
function at(t) {
  t.remove(q);
}
const ct = "tours:seen:";
function lt(t, e) {
  const r = t.get(ct + e), n = r ? parseInt(r, 10) : 0;
  return Number.isNaN(n) ? 0 : n;
}
function Ft(t, e) {
  t.set(ct + e, String(lt(t, e) + 1));
}
const Ht = `
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
function ut(t, e) {
  return e ? e(t) : dt({
    text: t.text,
    button: t.button,
    corner: t.corner,
    offset: t.offset,
    onStart: t.onResume
  });
}
function dt(t) {
  const e = t.corner ?? "bottom-right", r = t.offset ?? 24, n = document.createElement("div");
  n.setAttribute("data-tours-cta", "");
  const i = n.attachShadow({ mode: "open" }), s = document.createElement("style");
  s.textContent = Ht, i.appendChild(s);
  const a = document.createElement("div");
  a.className = "cta";
  const [u, g] = e.split("-");
  a.style[u] = `${r}px`, a.style[g] = `${r}px`;
  const d = () => {
    n.parentNode && n.parentNode.removeChild(n);
  }, p = document.createElement("button");
  p.className = "cta__close", p.type = "button", p.textContent = "×", p.setAttribute("aria-label", "Dismiss"), p.addEventListener("click", d);
  const m = document.createElement("p");
  m.className = "cta__text", m.textContent = t.text;
  const c = document.createElement("button");
  return c.className = "cta__btn", c.type = "button", c.textContent = t.button, c.addEventListener("click", () => {
    d(), t.onStart();
  }), a.append(p, m, c), i.appendChild(a), document.body.appendChild(n), d;
}
const Yt = /* @__PURE__ */ new Set([
  "tourStarting",
  "stepChanging"
]);
function E(t, e, r) {
  const n = Yt.has(e);
  let i = !0;
  const s = t?.[e];
  if (s)
    try {
      s(r) === !1 && n && (i = !1);
    } catch (a) {
      console.error(`[tours] handler for "${e}" threw`, a);
    }
  if (typeof document < "u" && typeof CustomEvent == "function")
    try {
      const a = new CustomEvent(`tours:${e}`, { detail: r, cancelable: n });
      document.dispatchEvent(a), n && a.defaultPrevented && (i = !1);
    } catch (a) {
      console.error(`[tours] could not dispatch "tours:${e}"`, a);
    }
  return i;
}
const Bt = "[data-tours-editor]";
function ft() {
  return typeof document < "u" && document.querySelector(Bt) !== null;
}
function X(t, e = {}) {
  const r = j("player"), n = e.state;
  let i = null, s = null, a = null, u = null, g = null, d = null, p = null, m = !1, c = 0, C = 0, h = null;
  const l = t.display?.padding ?? Nt, x = t.display?.radius ?? At, y = t.display?.cardRadius ?? Rt, pt = t.display?.offset ?? Tt;
  function z(o) {
    return B(o.selectors);
  }
  function P(o) {
    return o.action?.type === "click";
  }
  function $(o) {
    return I(o.pageUrl, window.location.href);
  }
  function S() {
    n && T(n, { tourId: t.id, index: c });
  }
  function G() {
    if (i) return;
    i = document.createElement("div"), i.setAttribute("data-tours-player", ""), s = i.attachShadow({ mode: "open" });
    const o = document.createElement("style");
    o.textContent = Et + Dt, s.appendChild(o), g = document.createElement("div"), g.className = "tours-backdrop", g.addEventListener("click", (f) => {
      const b = t.steps[c], w = b ? z(b) : null;
      if (w) {
        const v = w.getBoundingClientRect();
        if (f.clientX >= v.left - l && f.clientX <= v.right + l && f.clientY >= v.top - l && f.clientY <= v.bottom + l) return;
      }
      _();
    }), s.appendChild(g), a = document.createElement("div"), a.className = "tours-spotlight", a.style.borderRadius = `${x}px`, s.appendChild(a), document.body.appendChild(i);
  }
  function ht(o) {
    if (!g) return;
    if (!o) {
      g.style.clipPath = "";
      return;
    }
    const f = o.left - l, b = o.top - l, w = o.right + l, v = o.bottom + l;
    g.style.clipPath = `polygon(0 0, 0 100%, ${f}px 100%, ${f}px ${b}px, ${w}px ${b}px, ${w}px ${v}px, ${f}px ${v}px, ${f}px 100%, 100% 100%, 100% 0)`;
  }
  function K(o, f = !1) {
    a && (a.style.transitionDuration = f ? "0ms" : "", a.style.display = "block", a.style.left = `${o.left - l}px`, a.style.top = `${o.top - l}px`, a.style.width = `${o.width + l * 2}px`, a.style.height = `${o.height + l * 2}px`);
  }
  function J(o, f) {
    if (!u) return;
    const b = {
      top: o.top - l,
      left: o.left - l,
      right: o.right + l,
      bottom: o.bottom + l,
      width: o.width + l * 2,
      height: o.height + l * 2
    }, { top: w, left: v } = zt({
      target: b,
      card: { width: u.offsetWidth, height: u.offsetHeight },
      side: f.placement ?? "bottom",
      align: f.align ?? "center",
      offset: pt,
      alignOffset: t.display?.alignOffset ?? 0,
      viewport: { width: window.innerWidth, height: window.innerHeight }
    });
    u.style.left = `${v}px`, u.style.top = `${w}px`;
  }
  function mt(o) {
    const f = Math.max(1, t.steps.length - C), b = Math.max(1, Math.min(c + 1 - C, f));
    u && u.remove();
    const w = c === t.steps.length - 1, v = t.steps[c - 1], L = !!v && $(v), vt = !P(o) || w;
    u = Pt({
      contentText: o.content.default,
      progress: `Step ${b} of ${f}`,
      showClose: !0,
      onClose: xt,
      radius: y,
      back: L ? { label: o.backLabel ?? "Back", onClick: F } : void 0,
      next: vt ? {
        label: o.nextLabel ?? (w ? "Done" : "Next"),
        primary: !0,
        onClick: O
      } : void 0
    }), s?.appendChild(u);
  }
  function k() {
    if (!m) return;
    const o = t.steps[c];
    if (!o) {
      _();
      return;
    }
    r.log("render step", c, o.id);
    const f = z(o);
    if (!f) {
      r.log(`step "${o.id}" target not found yet — waiting`, o.selectors), it(o.selectors, { timeout: 4e3 }).then((w) => {
        !m || t.steps[c] !== o || (w ? k() : (r.warn(`step "${o.id}" skipped: no element for selectors`, o.selectors), E(e.on, "stepSkipped", { tour: t, index: c, step: o, reason: "no-element" }), C += 1, c < t.steps.length - 1 ? (c += 1, k()) : _()));
      });
      return;
    }
    G(), f.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" }), mt(o);
    const b = f.getBoundingClientRect();
    K(b), J(b, o), ht(P(o) ? b : null), gt(o), E(e.on, "stepActivated", { tour: t, index: c, step: o, target: f });
  }
  function gt(o) {
    if (d?.(), d = null, !P(o)) return;
    const f = c + 1, b = t.steps[f];
    !b || $(b) || (d = V(() => {
      !m || t.steps[c] !== o || I(b.pageUrl, window.location.href) && M(f) && (d?.(), d = null, r.log("visitor navigated → advancing to", b.id), c = f, S(), k());
    }));
  }
  function Z(o) {
    m && (o.key === "Escape" ? (o.preventDefault(), _()) : o.key === "ArrowRight" ? O() : o.key === "ArrowLeft" && F());
  }
  function A() {
    if (!m) return;
    const o = t.steps[c];
    if (!o) return;
    const f = z(o);
    if (!f) return;
    const b = f.getBoundingClientRect();
    K(b, !0), J(b, o);
  }
  function Q(o = 0) {
    if (m || t.steps.length === 0) return;
    if (!e.allowWhileEditing && ft()) {
      r.log(`start suppressed for "${t.id}" — the builder is mounted`);
      return;
    }
    const f = Math.max(0, Math.min(o, t.steps.length - 1));
    if (!E(e.on, "tourStarting", { tour: t, index: f })) {
      r.log("start vetoed by handler");
      return;
    }
    U(), m = !0, c = f, C = 0, r.log("start", t.id, `at ${c}/${t.steps.length}`), G(), window.addEventListener("keydown", Z, !0), window.addEventListener("resize", A, !0), window.addEventListener("scroll", A, !0), S(), E(e.on, "tourStarted", { tour: t, index: c }), k();
  }
  function bt() {
    a && (a.style.display = "none"), u && (u.remove(), u = null);
  }
  function R() {
    bt(), !h && (h = V(() => {
      if (!m) {
        h?.(), h = null;
        return;
      }
      const o = t.steps[c];
      o && $(o) && (h?.(), h = null, k());
    }));
  }
  function D() {
    h && (h(), h = null), d && (d(), d = null), m && (m = !1, window.removeEventListener("keydown", Z, !0), window.removeEventListener("resize", A, !0), window.removeEventListener("scroll", A, !0), i && i.parentNode && i.parentNode.removeChild(i), i = null, s = null, a = null, u = null, g = null);
  }
  function _(o = "dismissed") {
    r.log("stop", o);
    const f = m, b = c;
    U(), D(), n && at(n), f && (o === "completed" ? E(e.on, "tourCompleted", { tour: t }) : E(e.on, "tourDismissed", { tour: t, index: b }));
  }
  function U() {
    p?.(), p = null;
  }
  function xt() {
    t.dismiss?.mode === "minimize" ? tt() : _();
  }
  function tt() {
    m && (r.log("minimized", t.id, `at ${c}`), D(), n && T(n, { tourId: t.id, index: c, minimized: !0 }), E(e.on, "tourMinimized", { tour: t, index: c }), wt());
  }
  function wt() {
    U();
    const o = t.dismiss?.resume;
    p = ut(
      {
        tourId: t.id,
        text: o?.text ?? "Carry on with the tour?",
        button: o?.button ?? "Resume",
        corner: o?.corner,
        offset: o?.offset,
        onResume: () => {
          p = null, n && T(n, { tourId: t.id, index: c }), E(e.on, "tourResumed", { tour: t, index: c }), Q(c);
        }
      },
      e.renderResume
    );
  }
  function M(o) {
    const f = t.steps[o];
    return f ? E(e.on, "stepChanging", { tour: t, from: c, to: o, step: f }) : !0;
  }
  function O() {
    if (!m) return;
    const o = c + 1, f = t.steps[o];
    if (!f) {
      _("completed");
      return;
    }
    if (!M(o)) {
      r.log("step change vetoed by handler");
      return;
    }
    if ($(f)) {
      c = o, S(), k();
      return;
    }
    c = o, S();
    const b = (L) => {
      D(), e.onNavigate ? e.onNavigate(L, f.id) : window.location.assign(L);
    }, w = t.steps[c - 1]?.action;
    if (w && w.type === "navigate" && w.url) {
      w.url.startsWith("#") ? (r.log("page transition (hash navigate) → resume at", c), R(), window.location.hash = w.url) : (r.log("page transition (navigate) → resume at", c), b(w.url));
      return;
    }
    const v = Mt(f.pageUrl);
    if (v) {
      v.startsWith("#") ? (r.log("page transition (derived hash) → resume at", c), R(), window.location.hash = v) : (r.log("page transition (derived navigate) → resume at", c, v), b(v));
      return;
    }
    r.log("page transition (wait) → resume at", c), R();
  }
  function F() {
    if (!m) return;
    const o = t.steps[c - 1];
    if (o) {
      if (!M(c - 1)) {
        r.log("step change vetoed by handler");
        return;
      }
      if ($(o)) {
        c -= 1, S(), k();
        return;
      }
      c -= 1, S(), r.log("page transition back → resume at", c), R(), window.history.back();
    }
  }
  return { start: Q, stop: _, next: O, prev: F, minimize: tt, isActive: () => m };
}
function Wt(t, e = {}) {
  const r = e.state;
  if (!r) return null;
  const n = st(r);
  if (!n || n.tourId !== t.id) return null;
  if (!t.steps[n.index])
    return at(r), null;
  let i = -1;
  for (let a = n.index; a < t.steps.length; a++)
    if (I(t.steps[a].pageUrl, window.location.href)) {
      i = a;
      break;
    }
  if (i === -1) return null;
  const s = X(t, e);
  return s.start(i), s;
}
function Vt(t, e) {
  if (ft()) return () => {
  };
  const r = t.trigger ?? { type: "manual" };
  let n = !1;
  const i = () => {
    n || (n = !0, e());
  };
  switch (r.type) {
    case "load": {
      const s = setTimeout(i, 0);
      return () => clearTimeout(s);
    }
    case "timer": {
      const s = setTimeout(i, Math.max(0, r.delay));
      return () => clearTimeout(s);
    }
    case "selector": {
      let s = !1;
      return it([r.selector], { timeout: 0 }).then((a) => {
        a && !s && i();
      }), () => {
        s = !0;
      };
    }
    case "cta": {
      let s = () => {
      };
      return s = dt({
        text: r.text,
        button: r.button,
        corner: r.corner,
        offset: r.offset,
        onStart: i
      }), s;
    }
    case "manual":
    default:
      return () => {
      };
  }
}
function Xt(t = window.innerWidth) {
  return t <= 640 ? "mobile" : t <= 1024 ? "tablet" : "desktop";
}
function jt(t, e) {
  return !(t.url && !I(t.url, e.url) || t.role !== void 0 && t.role !== e.role || t.firstVisitOnly && !e.firstVisit || t.device && t.device !== e.device || t.unlessSeen && e.seenCount > 0 || t.maxShows !== void 0 && e.seenCount >= t.maxShows);
}
function qt(t, e) {
  return !t || t.length === 0 ? !0 : t.some((r) => jt(r.when, e));
}
function Jt(t, e = {}) {
  const r = j("mount"), n = e.state, i = () => typeof t == "function" ? t() : t;
  let s = null, a = [], u = null;
  function g() {
    for (const c of a) c();
    a = [], u?.(), u = null;
  }
  function d(c) {
    return !e.canRun || e.canRun(c);
  }
  function p() {
    if (s?.isActive()) return;
    s = null, g();
    const c = n ? st(n) : null;
    if (n && c?.minimized) {
      const h = i().find((l) => l.id === c.tourId && d(l));
      if (h) {
        const l = h.dismiss?.resume;
        u = ut(
          {
            tourId: h.id,
            text: l?.text ?? "Carry on with the tour?",
            button: l?.button ?? "Resume",
            corner: l?.corner,
            offset: l?.offset,
            onResume: () => {
              u = null, T(n, { tourId: h.id, index: c.index });
              const x = X(h, e);
              s = x, x.start(c.index);
            }
          },
          e.renderResume
        );
        return;
      }
    }
    if (n)
      for (const h of i()) {
        if (!d(h)) continue;
        const l = Wt(h, e);
        if (l) {
          r.log("resumed", h.id), s = l;
          return;
        }
      }
    const C = Xt();
    for (const h of i()) {
      if (!d(h) || !h.trigger || h.trigger.type === "manual") continue;
      const l = n ? lt(n, h.id) : 0;
      qt(h.rules, {
        url: window.location.href,
        device: C,
        firstVisit: l === 0,
        seenCount: l
      }) && a.push(
        Vt(h, () => {
          n && Ft(n, h.id);
          const y = X(h, e);
          s = y, y.start();
        })
      );
    }
  }
  p();
  const m = V(p);
  return () => {
    m(), g(), s?.stop(), s = null;
  };
}
export {
  Dt as CARD_STYLES,
  q as PROGRESS_KEY,
  Vt as armTrigger,
  It as autoSide,
  St as buildSelectors,
  at as clearProgress,
  Kt as createLocalState,
  j as createLogger,
  Gt as createPicker,
  X as createPlayer,
  Mt as deriveUrl,
  Xt as detectDevice,
  ft as isBuilderMounted,
  Y as isLoggingEnabled,
  Ft as markSeen,
  qt as matchRules,
  I as matchUrl,
  Jt as mountTours,
  zt as placeCard,
  st as readProgress,
  Pt as renderCard,
  B as resolveElement,
  Wt as resumeTour,
  lt as seenCount,
  it as waitForElement,
  T as writeProgress
};
