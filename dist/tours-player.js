const St = `
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
`, $t = `
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
function B(t) {
  return JSON.stringify(t);
}
function Lt(t) {
  return /^[a-zA-Z][\w-]*$/.test(t) && t.length <= 30 && !/\d{2,}/.test(t) && !/^(css-|sc-|jsx-|emotion-|_|is-|has-)/.test(t);
}
function it(t) {
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
function Nt(t) {
  let e = t.parentElement;
  for (; e && e !== document.body && !e.id; )
    e = e.parentElement;
  if (!e || !e.id) return null;
  const r = [];
  let n = t;
  for (; n && n !== e; ) {
    const s = n.tagName.toLowerCase(), i = n.parentElement;
    if (!i) return null;
    const a = Array.from(i.children).filter((d) => d.tagName === n.tagName);
    r.unshift(a.length > 1 ? `${s}:nth-of-type(${a.indexOf(n) + 1})` : s), n = i;
  }
  return `#${CSS.escape(e.id)} > ${r.join(" > ")}`;
}
const At = ["data-testid", "data-test", "data-test-id", "data-cy", "data-qa", "data-id", "data-name"];
function Rt(t) {
  const e = [], r = /* @__PURE__ */ new Set(), n = t.tagName.toLowerCase(), s = (f) => {
    if (!(!f || r.has(f)))
      try {
        document.querySelector(f) === t && (r.add(f), e.push(f));
      } catch {
      }
  };
  t.id && s(`#${CSS.escape(t.id)}`);
  for (const f of At) {
    const p = t.getAttribute(f);
    p && s(`${n}[${f}=${B(p)}]`);
  }
  const i = t.getAttribute("name");
  i && s(`${n}[name=${B(i)}]`);
  const a = t.getAttribute("aria-label");
  a && s(`[aria-label=${B(a)}]`);
  const d = Array.from(t.classList).filter(Lt);
  d.length && s(`${n}.${d.map((f) => CSS.escape(f)).join(".")}`);
  for (const f of d) s(`${n}.${CSS.escape(f)}`);
  s(Nt(t)), s(it(t));
  const h = (t.textContent ?? "").replace(/\s+/g, " ").trim();
  if (h && h.length <= 50 && /^(a|button|summary|label|h[1-6])$/.test(n)) {
    const f = `text=${h}`;
    r.has(f) || (r.add(f), e.push(f));
  }
  return e.length === 0 && e.push(it(t)), e;
}
const Tt = "a, button, summary, label, h1, h2, h3, h4, h5, h6";
function st(t, e) {
  return !(t instanceof Element) || !t.isConnected || e !== document && e instanceof Node && !e.contains(t) ? null : t;
}
function It(t, e) {
  if (typeof t == "function") {
    let r;
    try {
      r = t();
    } catch {
      return null;
    }
    return st(r, e);
  }
  if (typeof t != "string") return st(t, e);
  if (t.startsWith("text=")) {
    const r = t.slice(5).trim();
    for (const n of Array.from(e.querySelectorAll(Tt)))
      if ((n.textContent ?? "").replace(/\s+/g, " ").trim() === r) return n;
    return null;
  }
  try {
    return e.querySelector(t);
  } catch {
    return null;
  }
}
function V(t, e = document) {
  for (const r of t) {
    const n = It(r, e);
    if (n) return n;
  }
  return null;
}
function lt(t, e = {}) {
  const r = e.root ?? document, n = V(t, r);
  return n ? Promise.resolve(n) : new Promise((s) => {
    let i = !1, a;
    const d = (p) => {
      i || (i = !0, h.disconnect(), a && clearTimeout(a), s(p));
    }, h = new MutationObserver(() => {
      const p = V(t, r);
      p && d(p);
    });
    h.observe(document.documentElement, {
      childList: !0,
      subtree: !0,
      attributes: !0
    });
    const f = e.timeout ?? 4e3;
    f > 0 && Number.isFinite(f) && (a = setTimeout(() => d(null), f));
  });
}
let N = null;
function W() {
  if (N !== null) return N;
  try {
    N = new URLSearchParams(window.location.search).has("use_logs");
  } catch {
    N = !1;
  }
  return N;
}
function q(t) {
  const e = `[tours:${t}]`;
  return {
    log: (...r) => {
      W() && console.log(e, ...r);
    },
    warn: (...r) => {
      W() && console.warn(e, ...r);
    },
    error: (...r) => {
      W() && console.error(e, ...r);
    }
  };
}
function Qt(t, e = {}) {
  const r = q("picker");
  let n = null, s = null, i = null, a = !1;
  function d(l) {
    if (l === n) return !0;
    for (const m of e.ignore ?? [])
      if (m && m.contains(l)) return !0;
    return !1;
  }
  function h() {
    if (n) return;
    n = document.createElement("div"), n.setAttribute("data-tours-picker", ""), s = n.attachShadow({ mode: "open" });
    const l = document.createElement("style");
    l.textContent = St, s.appendChild(l), i = document.createElement("div"), i.className = "tours-picker-overlay", i.style.display = "none", s.appendChild(i);
    const m = document.createElement("div");
    m.className = "tours-picker-hint", m.textContent = "Hover and click an element • Esc to cancel", s.appendChild(m), document.body.appendChild(n);
  }
  function f(l, m) {
    const v = document.elementFromPoint(l, m);
    return !v || d(v) ? null : v;
  }
  function p(l) {
    if (!a || !i) return;
    const m = f(l.clientX, l.clientY);
    if (!m) {
      i.style.display = "none";
      return;
    }
    const v = m.getBoundingClientRect();
    i.style.display = "block", i.style.left = `${v.left}px`, i.style.top = `${v.top}px`, i.style.width = `${v.width}px`, i.style.height = `${v.height}px`;
  }
  function g(l) {
    if (!a) return;
    const m = f(l.clientX, l.clientY);
    if (l.preventDefault(), l.stopPropagation(), !m) return;
    const v = Rt(m);
    r.log("picked", v), w(), t(v);
  }
  function c(l) {
    l.key === "Escape" && (l.preventDefault(), w());
  }
  function E() {
    a || (a = !0, r.log("start"), h(), document.addEventListener("mousemove", p, !0), document.addEventListener("click", g, !0), document.addEventListener("keydown", c, !0));
  }
  function w() {
    a && (a = !1, document.removeEventListener("mousemove", p, !0), document.removeEventListener("click", g, !0), document.removeEventListener("keydown", c, !0), n && n.parentNode && n.parentNode.removeChild(n), n = null, s = null, i = null);
  }
  return { start: E, stop: w };
}
const zt = 6, Pt = 6, Dt = 10, Ot = 12;
function Ut(t, e, r) {
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
  }, i = ["bottom", "top", "right", "left"], a = i.find((d) => n[d] >= s[d] + 8);
  return a || i.reduce((d, h) => n[h] > n[d] ? h : d, i[0]);
}
function Mt(t) {
  const { target: e, card: r, offset: n, viewport: s } = t, i = t.side === "auto", a = i ? Ut(e, r, s) : t.side, d = i ? "center" : t.align, h = t.alignOffset ?? 0, f = d === "start" ? h : d === "end" ? -h : 0;
  let p = 0, g = 0;
  return a === "top" || a === "bottom" ? (p = a === "top" ? e.top - r.height - n : e.bottom + n, g = d === "start" ? e.left : d === "end" ? e.right - r.width : e.left + e.width / 2 - r.width / 2, g += f) : (g = a === "left" ? e.left - r.width - n : e.right + n, p = d === "start" ? e.top : d === "end" ? e.bottom - r.height : e.top + e.height / 2 - r.height / 2, p += f), g = Math.max(8, Math.min(g, s.width - r.width - 8)), p = Math.max(8, Math.min(p, s.height - r.height - 8)), { top: p, left: g };
}
function at(t) {
  const e = document.createElement("button");
  return e.type = "button", e.className = `tours-card__btn${t.primary ? " tours-card__btn--primary" : ""}${t.disabled ? " tours-card__btn--disabled" : ""}`, e.textContent = t.label, !t.disabled && t.onClick && e.addEventListener("click", t.onClick), e;
}
function Ft(t) {
  const e = document.createElement("div");
  if (e.className = `tours-card${t.ghost ? " tours-card--ghost" : ""}${t.showClose ? " tours-card--closable" : ""}`, t.radius != null && (e.style.borderRadius = `${t.radius}px`), t.showClose) {
    const n = document.createElement("button");
    n.className = "tours-card__close", n.type = "button", n.textContent = "×", n.setAttribute("aria-label", "Close"), t.onClose && n.addEventListener("click", t.onClose), e.appendChild(n);
  }
  const r = document.createElement("div");
  if (r.className = "tours-card__content", t.contentHtml != null ? r.innerHTML = t.contentHtml : r.textContent = t.contentText ?? "", e.appendChild(r), t.back || t.next || t.progress) {
    const n = document.createElement("div");
    if (n.className = "tours-card__footer", t.back && n.appendChild(at(t.back)), t.progress) {
      const s = document.createElement("span");
      s.className = "tours-card__progress", s.textContent = t.progress, n.appendChild(s);
    }
    t.next && n.appendChild(at(t.next)), e.appendChild(n);
  }
  return e;
}
const Ht = `
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
function Yt(t) {
  const e = t.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*\*/g, "\0").replace(/\*/g, "[^/]*").replace(/ /g, ".*").replace(/\?/g, ".");
  return new RegExp(`^${e}$`);
}
function P(t, e) {
  if (!t) return !0;
  if (t.regex)
    try {
      return new RegExp(t.regex).test(e);
    } catch {
      return !1;
    }
  if (t.glob)
    try {
      return Yt(t.glob).test(e);
    } catch {
      return !1;
    }
  return !0;
}
function Bt(t) {
  if (!t || !t.glob) return null;
  const e = t.glob.replace(/\*+/g, "");
  return /^https?:\/\//i.test(e) || e.startsWith("#") || e.startsWith("/") ? e : null;
}
function ut(t = window.innerWidth) {
  return t <= 640 ? "mobile" : t <= 1024 ? "tablet" : "desktop";
}
function dt(t, e) {
  if (t.url && !P(t.url, e.url)) return !1;
  if (t.traits) {
    for (const [r, n] of Object.entries(t.traits))
      if (e.traits?.[r] !== n) return !1;
  }
  return !(t.firstVisitOnly && !e.firstVisit || t.device && t.device !== e.device || t.unlessSeen && e.seenCount > 0 || t.maxShows !== void 0 && e.seenCount >= t.maxShows);
}
function Wt(t, e) {
  return !t || dt(t, e);
}
function Vt(t, e) {
  return !t || t.length === 0 ? !0 : t.some((r) => dt(r.when, e));
}
const X = "tours:locationchange";
let ct = !1;
function Xt() {
  if (!ct) {
    ct = !0;
    for (const t of ["pushState", "replaceState"]) {
      const e = history[t];
      history[t] = function(...n) {
        const s = e.apply(this, n);
        return window.dispatchEvent(new Event(X)), s;
      };
    }
  }
}
function j(t) {
  return Xt(), window.addEventListener("popstate", t), window.addEventListener("hashchange", t), window.addEventListener(X, t), () => {
    window.removeEventListener("popstate", t), window.removeEventListener("hashchange", t), window.removeEventListener(X, t);
  };
}
const G = "tours:progress";
function te() {
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
function ft(t) {
  const e = t.get(G);
  if (!e) return null;
  try {
    const r = JSON.parse(e);
    if (typeof r?.tourId == "string" && typeof r?.index == "number") return r;
  } catch {
  }
  return null;
}
function I(t, e) {
  t.set(G, JSON.stringify(e));
}
function K(t) {
  t.remove(G);
}
const pt = "tours:seen:";
function J(t, e) {
  const r = t.get(pt + e), n = r ? parseInt(r, 10) : 0;
  return Number.isNaN(n) ? 0 : n;
}
function jt(t, e) {
  t.set(pt + e, String(J(t, e) + 1));
}
const qt = `
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
function ht(t, e) {
  return e ? e(t) : gt({
    text: t.text,
    button: t.button,
    corner: t.corner,
    offset: t.offset,
    onStart: t.onResume
  });
}
function gt(t) {
  const e = t.corner ?? "bottom-right", r = t.offset ?? 24, n = document.createElement("div");
  n.setAttribute("data-tours-cta", "");
  const s = n.attachShadow({ mode: "open" }), i = document.createElement("style");
  i.textContent = qt, s.appendChild(i);
  const a = document.createElement("div");
  a.className = "cta";
  const [d, h] = e.split("-");
  a.style[d] = `${r}px`, a.style[h] = `${r}px`;
  const f = () => {
    n.parentNode && n.parentNode.removeChild(n);
  }, p = document.createElement("button");
  p.className = "cta__close", p.type = "button", p.textContent = "×", p.setAttribute("aria-label", "Dismiss"), p.addEventListener("click", f);
  const g = document.createElement("p");
  g.className = "cta__text", g.textContent = t.text;
  const c = document.createElement("button");
  return c.className = "cta__btn", c.type = "button", c.textContent = t.button, c.addEventListener("click", () => {
    f(), t.onStart();
  }), a.append(p, g, c), s.appendChild(a), document.body.appendChild(n), f;
}
const Gt = /* @__PURE__ */ new Set([
  "tourStarting",
  "stepChanging"
]);
function C(t, e, r) {
  const n = Gt.has(e);
  let s = !0;
  const i = t?.[e];
  if (i)
    try {
      i(r) === !1 && n && (s = !1);
    } catch (a) {
      console.error(`[tours] handler for "${e}" threw`, a);
    }
  if (typeof document < "u" && typeof CustomEvent == "function")
    try {
      const a = new CustomEvent(`tours:${e}`, { detail: r, cancelable: n });
      document.dispatchEvent(a), n && a.defaultPrevented && (s = !1);
    } catch (a) {
      console.error(`[tours] could not dispatch "tours:${e}"`, a);
    }
  return s;
}
const Kt = "[data-tours-editor]";
function mt() {
  return typeof document < "u" && document.querySelector(Kt) !== null;
}
function z(t, e = {}) {
  const r = q("player"), n = e.state;
  let s = null, i = null, a = null, d = null, h = null, f = null, p = null, g = !1, c = 0, E = 0, w = null;
  const l = t.display?.padding ?? zt, m = t.display?.radius ?? Pt, v = t.display?.cardRadius ?? Dt, A = t.display?.offset ?? Ot;
  function D(o) {
    return V(o.selectors);
  }
  function O(o) {
    return o.action?.type === "click";
  }
  function bt(o) {
    if (!o.condition) return !0;
    const u = n ? J(n, t.id) : 0;
    return Wt(o.condition, {
      url: window.location.href,
      traits: e.viewer?.(),
      device: ut(),
      firstVisit: u === 0,
      seenCount: u
    });
  }
  function $(o) {
    return P(o.pageUrl, window.location.href);
  }
  function S() {
    n && I(n, { tourId: t.id, index: c });
  }
  function Z() {
    if (s) return;
    s = document.createElement("div"), s.setAttribute("data-tours-player", ""), i = s.attachShadow({ mode: "open" });
    const o = document.createElement("style");
    o.textContent = $t + Ht, i.appendChild(o), h = document.createElement("div"), h.className = "tours-backdrop", h.addEventListener("click", (u) => {
      const b = t.steps[c], x = b ? D(b) : null;
      if (x) {
        const y = x.getBoundingClientRect();
        if (u.clientX >= y.left - l && u.clientX <= y.right + l && u.clientY >= y.top - l && u.clientY <= y.bottom + l) return;
      }
      _();
    }), i.appendChild(h), a = document.createElement("div"), a.className = "tours-spotlight", a.style.borderRadius = `${m}px`, i.appendChild(a), document.body.appendChild(s);
  }
  function xt(o) {
    if (!h) return;
    if (!o) {
      h.style.clipPath = "";
      return;
    }
    const u = o.left - l, b = o.top - l, x = o.right + l, y = o.bottom + l;
    h.style.clipPath = `polygon(0 0, 0 100%, ${u}px 100%, ${u}px ${b}px, ${x}px ${b}px, ${x}px ${y}px, ${u}px ${y}px, ${u}px 100%, 100% 100%, 100% 0)`;
  }
  function Q(o) {
    return o.overlay !== !1;
  }
  function wt(o) {
    const u = Q(o);
    h && (h.style.display = u ? "" : "none"), a?.classList.toggle("tours-spotlight--plain", !u);
  }
  function tt(o, u = !1) {
    a && (a.style.transitionDuration = u ? "0ms" : "", a.style.display = "block", a.style.left = `${o.left - l}px`, a.style.top = `${o.top - l}px`, a.style.width = `${o.width + l * 2}px`, a.style.height = `${o.height + l * 2}px`);
  }
  function et(o, u) {
    if (!d) return;
    const b = {
      top: o.top - l,
      left: o.left - l,
      right: o.right + l,
      bottom: o.bottom + l,
      width: o.width + l * 2,
      height: o.height + l * 2
    }, { top: x, left: y } = Mt({
      target: b,
      card: { width: d.offsetWidth, height: d.offsetHeight },
      side: u.placement ?? "bottom",
      align: u.align ?? "center",
      offset: A,
      alignOffset: t.display?.alignOffset ?? 0,
      viewport: { width: window.innerWidth, height: window.innerHeight }
    });
    d.style.left = `${y}px`, d.style.top = `${x}px`;
  }
  function yt(o) {
    const u = Math.max(1, t.steps.length - E), b = Math.max(1, Math.min(c + 1 - E, u));
    d && d.remove();
    const x = c === t.steps.length - 1, y = t.steps[c - 1], L = !!y && $(y), _t = !O(o) || x;
    d = Ft({
      contentText: o.content.default,
      progress: `Step ${b} of ${u}`,
      showClose: !0,
      onClose: Ct,
      radius: v,
      back: L ? { label: o.backLabel ?? "Back", onClick: Y } : void 0,
      next: _t ? {
        label: o.nextLabel ?? (x ? "Done" : "Next"),
        primary: !0,
        onClick: H
      } : void 0
    }), i?.appendChild(d);
  }
  function k() {
    if (!g) return;
    const o = t.steps[c];
    if (!o) {
      _();
      return;
    }
    if (r.log("render step", c, o.id), !bt(o)) {
      r.log(`step "${o.id}" skipped: condition not met`), C(e.on, "stepSkipped", { tour: t, index: c, step: o, reason: "condition" }), E += 1, c < t.steps.length - 1 ? (c += 1, k()) : _(E >= t.steps.length ? "dismissed" : "completed");
      return;
    }
    const u = D(o);
    if (!u) {
      r.log(`step "${o.id}" target not found yet — waiting`, o.selectors), lt(o.selectors, { timeout: 4e3 }).then((x) => {
        !g || t.steps[c] !== o || (x ? k() : (r.warn(`step "${o.id}" skipped: no element for selectors`, o.selectors), C(e.on, "stepSkipped", { tour: t, index: c, step: o, reason: "no-element" }), E += 1, c < t.steps.length - 1 ? (c += 1, k()) : _()));
      });
      return;
    }
    Z(), u.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" }), yt(o);
    const b = u.getBoundingClientRect();
    tt(b), et(b, o), wt(o), xt(Q(o) && O(o) ? b : null), vt(o), C(e.on, "stepActivated", { tour: t, index: c, step: o, target: u });
  }
  function vt(o) {
    if (f?.(), f = null, !O(o)) return;
    const u = c + 1, b = t.steps[u];
    !b || $(b) || (f = j(() => {
      !g || t.steps[c] !== o || P(b.pageUrl, window.location.href) && F(u) && (f?.(), f = null, r.log("visitor navigated → advancing to", b.id), c = u, S(), k());
    }));
  }
  function nt(o) {
    g && (o.key === "Escape" ? (o.preventDefault(), _()) : o.key === "ArrowRight" ? H() : o.key === "ArrowLeft" && Y());
  }
  function R() {
    if (!g) return;
    const o = t.steps[c];
    if (!o) return;
    const u = D(o);
    if (!u) return;
    const b = u.getBoundingClientRect();
    tt(b, !0), et(b, o);
  }
  function rt(o = 0) {
    if (g || t.steps.length === 0) return;
    if (!e.allowWhileEditing && mt()) {
      r.log(`start suppressed for "${t.id}" — the builder is mounted`);
      return;
    }
    const u = Math.max(0, Math.min(o, t.steps.length - 1));
    if (!C(e.on, "tourStarting", { tour: t, index: u })) {
      r.log("start vetoed by handler");
      return;
    }
    M(), g = !0, c = u, E = 0, r.log("start", t.id, `at ${c}/${t.steps.length}`), Z(), window.addEventListener("keydown", nt, !0), window.addEventListener("resize", R, !0), window.addEventListener("scroll", R, !0), S(), C(e.on, "tourStarted", { tour: t, index: c }), k();
  }
  function Et() {
    a && (a.style.display = "none"), d && (d.remove(), d = null);
  }
  function T() {
    Et(), !w && (w = j(() => {
      if (!g) {
        w?.(), w = null;
        return;
      }
      const o = t.steps[c];
      o && $(o) && (w?.(), w = null, k());
    }));
  }
  function U() {
    w && (w(), w = null), f && (f(), f = null), g && (g = !1, window.removeEventListener("keydown", nt, !0), window.removeEventListener("resize", R, !0), window.removeEventListener("scroll", R, !0), s && s.parentNode && s.parentNode.removeChild(s), s = null, i = null, a = null, d = null, h = null);
  }
  function _(o = "dismissed") {
    r.log("stop", o);
    const u = g, b = c;
    M(), U(), n && K(n), u && (o === "completed" ? C(e.on, "tourCompleted", { tour: t }) : C(e.on, "tourDismissed", { tour: t, index: b }));
  }
  function M() {
    p?.(), p = null;
  }
  function Ct() {
    t.dismiss?.mode === "minimize" ? ot() : _();
  }
  function ot() {
    g && (r.log("minimized", t.id, `at ${c}`), U(), n && I(n, { tourId: t.id, index: c, minimized: !0 }), C(e.on, "tourMinimized", { tour: t, index: c }), kt());
  }
  function kt() {
    M();
    const o = t.dismiss?.resume;
    p = ht(
      {
        tourId: t.id,
        text: o?.text ?? "Carry on with the tour?",
        button: o?.button ?? "Resume",
        corner: o?.corner,
        offset: o?.offset,
        onResume: () => {
          p = null, n && I(n, { tourId: t.id, index: c }), C(e.on, "tourResumed", { tour: t, index: c }), rt(c);
        }
      },
      e.renderResume
    );
  }
  function F(o) {
    const u = t.steps[o];
    return u ? C(e.on, "stepChanging", { tour: t, from: c, to: o, step: u }) : !0;
  }
  function H() {
    if (!g) return;
    const o = c + 1, u = t.steps[o];
    if (!u) {
      _("completed");
      return;
    }
    if (!F(o)) {
      r.log("step change vetoed by handler");
      return;
    }
    if ($(u)) {
      c = o, S(), k();
      return;
    }
    c = o, S();
    const b = (L) => {
      U(), e.onNavigate ? e.onNavigate(L, u.id) : window.location.assign(L);
    }, x = t.steps[c - 1]?.action;
    if (x && x.type === "navigate" && x.url) {
      x.url.startsWith("#") ? (r.log("page transition (hash navigate) → resume at", c), T(), window.location.hash = x.url) : (r.log("page transition (navigate) → resume at", c), b(x.url));
      return;
    }
    const y = Bt(u.pageUrl);
    if (y) {
      y.startsWith("#") ? (r.log("page transition (derived hash) → resume at", c), T(), window.location.hash = y) : (r.log("page transition (derived navigate) → resume at", c, y), b(y));
      return;
    }
    r.log("page transition (wait) → resume at", c), T();
  }
  function Y() {
    if (!g) return;
    const o = t.steps[c - 1];
    if (o) {
      if (!F(c - 1)) {
        r.log("step change vetoed by handler");
        return;
      }
      if ($(o)) {
        c -= 1, S(), k();
        return;
      }
      c -= 1, S(), r.log("page transition back → resume at", c), T(), window.history.back();
    }
  }
  return { start: rt, stop: _, next: H, prev: Y, minimize: ot, isActive: () => g };
}
function Jt(t, e = {}) {
  const r = e.state;
  if (!r) return null;
  const n = ft(r);
  if (!n || n.tourId !== t.id) return null;
  if (!t.steps[n.index])
    return K(r), null;
  let s = -1;
  for (let a = n.index; a < t.steps.length; a++)
    if (P(t.steps[a].pageUrl, window.location.href)) {
      s = a;
      break;
    }
  if (s === -1) return null;
  const i = z(t, e);
  return i.start(s), i;
}
function Zt(t, e) {
  if (mt()) return () => {
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
      return lt([r.selector], { timeout: 0 }).then((a) => {
        a && !i && s();
      }), () => {
        i = !0;
      };
    }
    case "cta": {
      let i = () => {
      };
      return i = gt({
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
function ee(t, e = {}) {
  const r = q("mount"), n = e.state, s = () => typeof t == "function" ? t() : t;
  let i = null, a = [], d = null;
  function h() {
    for (const c of a) c();
    a = [], d?.(), d = null;
  }
  function f(c) {
    return !e.canRun || e.canRun(c);
  }
  function p() {
    if (i?.isActive()) return;
    i = null, h();
    const c = n ? ft(n) : null;
    if (n && c?.minimized) {
      const l = s().find((m) => m.id === c.tourId && f(m));
      if (l) {
        const m = l.dismiss?.resume;
        d = ht(
          {
            tourId: l.id,
            text: m?.text ?? "Carry on with the tour?",
            button: m?.button ?? "Resume",
            corner: m?.corner,
            offset: m?.offset,
            onResume: () => {
              d = null, I(n, { tourId: l.id, index: c.index });
              const v = z(l, e);
              i = v, v.start(c.index);
            }
          },
          e.renderResume
        );
        return;
      }
    }
    if (n)
      for (const l of s()) {
        if (!f(l)) continue;
        const m = Jt(l, e);
        if (m) {
          r.log("resumed", l.id), i = m;
          return;
        }
      }
    const E = ut(), w = e.viewer?.();
    for (const l of s()) {
      if (!f(l) || !l.trigger || l.trigger.type === "manual") continue;
      const m = n ? J(n, l.id) : 0;
      Vt(l.rules, {
        url: window.location.href,
        traits: w,
        device: E,
        firstVisit: m === 0,
        seenCount: m
      }) && a.push(
        Zt(l, () => {
          n && jt(n, l.id);
          const A = z(l, e);
          i = A, A.start();
        })
      );
    }
  }
  p();
  const g = j(p);
  return {
    start(c) {
      const E = s().find((l) => l.id === c);
      if (!E || !f(E)) return !1;
      i?.stop(), h(), n && K(n);
      const w = z(E, e);
      return i = w, w.start(), !0;
    },
    stop() {
      i?.stop(), i = null;
    },
    unmount() {
      g(), h(), i?.stop(), i = null;
    }
  };
}
export {
  Ht as CARD_STYLES,
  G as PROGRESS_KEY,
  Zt as armTrigger,
  Ut as autoSide,
  Rt as buildSelectors,
  K as clearProgress,
  te as createLocalState,
  q as createLogger,
  Qt as createPicker,
  z as createPlayer,
  Bt as deriveUrl,
  ut as detectDevice,
  mt as isBuilderMounted,
  W as isLoggingEnabled,
  jt as markSeen,
  Vt as matchRules,
  P as matchUrl,
  Wt as matchesCondition,
  ee as mountTours,
  Mt as placeCard,
  ft as readProgress,
  Ft as renderCard,
  V as resolveElement,
  Jt as resumeTour,
  J as seenCount,
  lt as waitForElement,
  I as writeProgress
};
