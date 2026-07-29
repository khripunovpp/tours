const Lt = `
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
`, Nt = `
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
function V(t) {
  return JSON.stringify(t);
}
function Rt(t) {
  return /^[a-zA-Z][\w-]*$/.test(t) && t.length <= 30 && !/\d{2,}/.test(t) && !/^(css-|sc-|jsx-|emotion-|_|is-|has-)/.test(t);
}
function st(t) {
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
function At(t) {
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
const Tt = ["data-testid", "data-test", "data-test-id", "data-cy", "data-qa", "data-id", "data-name"];
function It(t) {
  const e = [], r = /* @__PURE__ */ new Set(), n = t.tagName.toLowerCase(), s = (f) => {
    if (!(!f || r.has(f)))
      try {
        document.querySelector(f) === t && (r.add(f), e.push(f));
      } catch {
      }
  };
  t.id && s(`#${CSS.escape(t.id)}`);
  for (const f of Tt) {
    const p = t.getAttribute(f);
    p && s(`${n}[${f}=${V(p)}]`);
  }
  const i = t.getAttribute("name");
  i && s(`${n}[name=${V(i)}]`);
  const a = t.getAttribute("aria-label");
  a && s(`[aria-label=${V(a)}]`);
  const u = Array.from(t.classList).filter(Rt);
  u.length && s(`${n}.${u.map((f) => CSS.escape(f)).join(".")}`);
  for (const f of u) s(`${n}.${CSS.escape(f)}`);
  s(At(t)), s(st(t));
  const h = (t.textContent ?? "").replace(/\s+/g, " ").trim();
  if (h && h.length <= 50 && /^(a|button|summary|label|h[1-6])$/.test(n)) {
    const f = `text=${h}`;
    r.has(f) || (r.add(f), e.push(f));
  }
  return e.length === 0 && e.push(st(t)), e;
}
const Mt = "a, button, summary, label, h1, h2, h3, h4, h5, h6";
function at(t, e) {
  return !(t instanceof Element) || !t.isConnected || e !== document && e instanceof Node && !e.contains(t) ? null : t;
}
function zt(t, e) {
  if (typeof t == "function") {
    let r;
    try {
      r = t();
    } catch {
      return null;
    }
    return at(r, e);
  }
  if (typeof t != "string") return at(t, e);
  if (t.startsWith("text=")) {
    const r = t.slice(5).trim();
    for (const n of Array.from(e.querySelectorAll(Mt)))
      if ((n.textContent ?? "").replace(/\s+/g, " ").trim() === r) return n;
    return null;
  }
  try {
    return e.querySelector(t);
  } catch {
    return null;
  }
}
function j(t, e = document) {
  for (const r of t) {
    const n = zt(r, e);
    if (n) return n;
  }
  return null;
}
function dt(t, e = {}) {
  const r = e.root ?? document, n = j(t, r);
  return n ? Promise.resolve(n) : new Promise((s) => {
    let i = !1, a;
    const u = (p) => {
      i || (i = !0, h.disconnect(), a && clearTimeout(a), s(p));
    }, h = new MutationObserver(() => {
      const p = j(t, r);
      p && u(p);
    });
    h.observe(document.documentElement, {
      childList: !0,
      subtree: !0,
      attributes: !0
    });
    const f = e.timeout ?? 4e3;
    f > 0 && Number.isFinite(f) && (a = setTimeout(() => u(null), f));
  });
}
let N = null;
function X() {
  if (N !== null) return N;
  try {
    N = new URLSearchParams(window.location.search).has("use_logs");
  } catch {
    N = !1;
  }
  return N;
}
function K(t) {
  const e = `[tours:${t}]`;
  return {
    log: (...r) => {
      X() && console.log(e, ...r);
    },
    warn: (...r) => {
      X() && console.warn(e, ...r);
    },
    error: (...r) => {
      X() && console.error(e, ...r);
    }
  };
}
function ne(t, e = {}) {
  const r = K("picker");
  let n = null, s = null, i = null, a = !1;
  function u(c) {
    if (c === n) return !0;
    for (const g of e.ignore ?? [])
      if (g && g.contains(c)) return !0;
    return !1;
  }
  function h() {
    if (n) return;
    n = document.createElement("div"), n.setAttribute("data-tours-picker", ""), s = n.attachShadow({ mode: "open" });
    const c = document.createElement("style");
    c.textContent = Lt, s.appendChild(c), i = document.createElement("div"), i.className = "tours-picker-overlay", i.style.display = "none", s.appendChild(i);
    const g = document.createElement("div");
    g.className = "tours-picker-hint", g.textContent = "Hover and click an element • Esc to cancel", s.appendChild(g), document.body.appendChild(n);
  }
  function f(c, g) {
    const v = document.elementFromPoint(c, g);
    return !v || u(v) ? null : v;
  }
  function p(c) {
    if (!a || !i) return;
    const g = f(c.clientX, c.clientY);
    if (!g) {
      i.style.display = "none";
      return;
    }
    const v = g.getBoundingClientRect();
    i.style.display = "block", i.style.left = `${v.left}px`, i.style.top = `${v.top}px`, i.style.width = `${v.width}px`, i.style.height = `${v.height}px`;
  }
  function m(c) {
    if (!a) return;
    const g = f(c.clientX, c.clientY);
    if (c.preventDefault(), c.stopPropagation(), !g) return;
    const v = It(g);
    r.log("picked", v), w(), t(v);
  }
  function l(c) {
    c.key === "Escape" && (c.preventDefault(), w());
  }
  function E() {
    a || (a = !0, r.log("start"), h(), document.addEventListener("mousemove", p, !0), document.addEventListener("click", m, !0), document.addEventListener("keydown", l, !0));
  }
  function w() {
    a && (a = !1, document.removeEventListener("mousemove", p, !0), document.removeEventListener("click", m, !0), document.removeEventListener("keydown", l, !0), n && n.parentNode && n.parentNode.removeChild(n), n = null, s = null, i = null);
  }
  return { start: E, stop: w };
}
const Pt = 6, Dt = 6, Ot = 10, Ut = 12;
function Ft(t, e, r) {
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
  return a || i.reduce((u, h) => n[h] > n[u] ? h : u, i[0]);
}
function Ht(t) {
  const { target: e, card: r, offset: n, viewport: s } = t, i = t.side === "auto", a = i ? Ft(e, r, s) : t.side, u = i ? "center" : t.align, h = t.alignOffset ?? 0, f = u === "start" ? h : u === "end" ? -h : 0;
  let p = 0, m = 0;
  return a === "top" || a === "bottom" ? (p = a === "top" ? e.top - r.height - n : e.bottom + n, m = u === "start" ? e.left : u === "end" ? e.right - r.width : e.left + e.width / 2 - r.width / 2, m += f) : (m = a === "left" ? e.left - r.width - n : e.right + n, p = u === "start" ? e.top : u === "end" ? e.bottom - r.height : e.top + e.height / 2 - r.height / 2, p += f), m = Math.max(8, Math.min(m, s.width - r.width - 8)), p = Math.max(8, Math.min(p, s.height - r.height - 8)), { top: p, left: m };
}
function Yt(t) {
  const e = getComputedStyle(t), r = `${e.overflowX} ${e.overflowY}`;
  return /auto|scroll|overlay|hidden/.test(r);
}
function lt(t) {
  const e = t.getBoundingClientRect();
  let r = e.top, n = e.left, s = e.right, i = e.bottom;
  for (let a = t.parentElement; a && a !== document.body; a = a.parentElement) {
    if (!Yt(a)) continue;
    const u = a.getBoundingClientRect();
    r = Math.max(r, u.top), n = Math.max(n, u.left), s = Math.min(s, u.right), i = Math.min(i, u.bottom);
  }
  return r = Math.max(r, 0), n = Math.max(n, 0), s = Math.min(s, window.innerWidth), i = Math.min(i, window.innerHeight), s <= n || i <= r ? null : { top: r, left: n, right: s, bottom: i, width: s - n, height: i - r };
}
function ct(t) {
  const e = document.createElement("button");
  return e.type = "button", e.className = `tours-card__btn${t.primary ? " tours-card__btn--primary" : ""}${t.disabled ? " tours-card__btn--disabled" : ""}`, e.textContent = t.label, !t.disabled && t.onClick && e.addEventListener("click", t.onClick), e;
}
function Bt(t) {
  const e = document.createElement("div");
  if (e.className = `tours-card${t.ghost ? " tours-card--ghost" : ""}${t.showClose ? " tours-card--closable" : ""}`, t.radius != null && (e.style.borderRadius = `${t.radius}px`), t.showClose) {
    const n = document.createElement("button");
    n.className = "tours-card__close", n.type = "button", n.textContent = "×", n.setAttribute("aria-label", "Close"), t.onClose && n.addEventListener("click", t.onClose), e.appendChild(n);
  }
  const r = document.createElement("div");
  if (r.className = "tours-card__content", t.contentHtml != null ? r.innerHTML = t.contentHtml : r.textContent = t.contentText ?? "", e.appendChild(r), t.back || t.next || t.progress) {
    const n = document.createElement("div");
    if (n.className = "tours-card__footer", t.back && n.appendChild(ct(t.back)), t.progress) {
      const s = document.createElement("span");
      s.className = "tours-card__progress", s.textContent = t.progress, n.appendChild(s);
    }
    t.next && n.appendChild(ct(t.next)), e.appendChild(n);
  }
  return e;
}
const Wt = `
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
function Vt(t) {
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
      return Vt(t.glob).test(e);
    } catch {
      return !1;
    }
  return !0;
}
function Xt(t) {
  if (!t || !t.glob) return null;
  const e = t.glob.replace(/\*+/g, "");
  return /^https?:\/\//i.test(e) || e.startsWith("#") || e.startsWith("/") ? e : null;
}
function ft(t = window.innerWidth) {
  return t <= 640 ? "mobile" : t <= 1024 ? "tablet" : "desktop";
}
function pt(t, e) {
  if (t.url && !P(t.url, e.url)) return !1;
  if (t.traits) {
    for (const [r, n] of Object.entries(t.traits))
      if (e.traits?.[r] !== n) return !1;
  }
  return !(t.firstVisitOnly && !e.firstVisit || t.device && t.device !== e.device || t.unlessSeen && e.seenCount > 0 || t.maxShows !== void 0 && e.seenCount >= t.maxShows);
}
function jt(t, e) {
  return !t || pt(t, e);
}
function qt(t, e) {
  return !t || t.length === 0 ? !0 : t.some((r) => pt(r.when, e));
}
const q = "tours:locationchange";
let ut = !1;
function Gt() {
  if (!ut) {
    ut = !0;
    for (const t of ["pushState", "replaceState"]) {
      const e = history[t];
      history[t] = function(...n) {
        const s = e.apply(this, n);
        return window.dispatchEvent(new Event(q)), s;
      };
    }
  }
}
function G(t) {
  return Gt(), window.addEventListener("popstate", t), window.addEventListener("hashchange", t), window.addEventListener(q, t), () => {
    window.removeEventListener("popstate", t), window.removeEventListener("hashchange", t), window.removeEventListener(q, t);
  };
}
const J = "tours:progress";
function re() {
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
function ht(t) {
  const e = t.get(J);
  if (!e) return null;
  try {
    const r = JSON.parse(e);
    if (typeof r?.tourId == "string" && typeof r?.index == "number") return r;
  } catch {
  }
  return null;
}
function M(t, e) {
  t.set(J, JSON.stringify(e));
}
function Z(t) {
  t.remove(J);
}
const mt = "tours:seen:";
function Q(t, e) {
  const r = t.get(mt + e), n = r ? parseInt(r, 10) : 0;
  return Number.isNaN(n) ? 0 : n;
}
function Kt(t, e) {
  t.set(mt + e, String(Q(t, e) + 1));
}
const Jt = `
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
function gt(t, e) {
  return e ? e(t) : bt({
    text: t.text,
    button: t.button,
    corner: t.corner,
    offset: t.offset,
    onStart: t.onResume
  });
}
function bt(t) {
  const e = t.corner ?? "bottom-right", r = t.offset ?? 24, n = document.createElement("div");
  n.setAttribute("data-tours-cta", "");
  const s = n.attachShadow({ mode: "open" }), i = document.createElement("style");
  i.textContent = Jt, s.appendChild(i);
  const a = document.createElement("div");
  a.className = "cta";
  const [u, h] = e.split("-");
  a.style[u] = `${r}px`, a.style[h] = `${r}px`;
  const f = () => {
    n.parentNode && n.parentNode.removeChild(n);
  }, p = document.createElement("button");
  p.className = "cta__close", p.type = "button", p.textContent = "×", p.setAttribute("aria-label", "Dismiss"), p.addEventListener("click", f);
  const m = document.createElement("p");
  m.className = "cta__text", m.textContent = t.text;
  const l = document.createElement("button");
  return l.className = "cta__btn", l.type = "button", l.textContent = t.button, l.addEventListener("click", () => {
    f(), t.onStart();
  }), a.append(p, m, l), s.appendChild(a), document.body.appendChild(n), f;
}
const Zt = /* @__PURE__ */ new Set([
  "tourStarting",
  "stepChanging"
]);
function C(t, e, r) {
  const n = Zt.has(e);
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
const Qt = "[data-tours-editor]";
function xt() {
  return typeof document < "u" && document.querySelector(Qt) !== null;
}
function z(t, e = {}) {
  const r = K("player"), n = e.state;
  let s = null, i = null, a = null, u = null, h = null, f = null, p = null, m = !1, l = 0, E = 0, w = null;
  const c = t.display?.padding ?? Pt, g = t.display?.radius ?? Dt, v = t.display?.cardRadius ?? Ot, R = t.display?.offset ?? Ut;
  function D(o) {
    return j(o.selectors);
  }
  function A(o) {
    return o.action?.type === "click";
  }
  function wt(o) {
    if (!o.condition) return !0;
    const d = n ? Q(n, t.id) : 0;
    return jt(o.condition, {
      url: window.location.href,
      traits: e.viewer?.(),
      device: ft(),
      firstVisit: d === 0,
      seenCount: d
    });
  }
  function $(o) {
    return P(o.pageUrl, window.location.href);
  }
  function S() {
    n && M(n, { tourId: t.id, index: l });
  }
  function tt() {
    if (s) return;
    s = document.createElement("div"), s.setAttribute("data-tours-player", ""), i = s.attachShadow({ mode: "open" });
    const o = document.createElement("style");
    o.textContent = Nt + Wt, i.appendChild(o), h = document.createElement("div"), h.className = "tours-backdrop", h.addEventListener("click", (d) => {
      const b = t.steps[l], x = b ? D(b) : null;
      if (x) {
        const y = x.getBoundingClientRect();
        if (d.clientX >= y.left - c && d.clientX <= y.right + c && d.clientY >= y.top - c && d.clientY <= y.bottom + c) return;
      }
      _();
    }), i.appendChild(h), a = document.createElement("div"), a.className = "tours-spotlight", a.style.borderRadius = `${g}px`, i.appendChild(a), document.body.appendChild(s);
  }
  function O(o) {
    if (!h) return;
    if (!o) {
      h.style.clipPath = "";
      return;
    }
    const d = o.left - c, b = o.top - c, x = o.right + c, y = o.bottom + c;
    h.style.clipPath = `polygon(0 0, 0 100%, ${d}px 100%, ${d}px ${b}px, ${x}px ${b}px, ${x}px ${y}px, ${d}px ${y}px, ${d}px 100%, 100% 100%, 100% 0)`;
  }
  function U(o) {
    return o.overlay !== !1;
  }
  function yt(o) {
    const d = U(o);
    h && (h.style.display = d ? "" : "none"), a?.classList.toggle("tours-spotlight--plain", !d);
  }
  function et(o, d = !1) {
    a && (a.style.transitionDuration = d ? "0ms" : "", a.style.display = "block", a.style.left = `${o.left - c}px`, a.style.top = `${o.top - c}px`, a.style.width = `${o.width + c * 2}px`, a.style.height = `${o.height + c * 2}px`);
  }
  function nt(o, d) {
    if (!u) return;
    const b = {
      top: o.top - c,
      left: o.left - c,
      right: o.right + c,
      bottom: o.bottom + c,
      width: o.width + c * 2,
      height: o.height + c * 2
    }, { top: x, left: y } = Ht({
      target: b,
      card: { width: u.offsetWidth, height: u.offsetHeight },
      side: d.placement ?? "bottom",
      align: d.align ?? "center",
      offset: R,
      alignOffset: t.display?.alignOffset ?? 0,
      viewport: { width: window.innerWidth, height: window.innerHeight }
    });
    u.style.left = `${y}px`, u.style.top = `${x}px`;
  }
  function vt(o) {
    const d = Math.max(1, t.steps.length - E), b = Math.max(1, Math.min(l + 1 - E, d));
    u && u.remove();
    const x = l === t.steps.length - 1, y = t.steps[l - 1], L = !!y && $(y), $t = !A(o) || x;
    u = Bt({
      contentText: o.content.default,
      progress: `Step ${b} of ${d}`,
      showClose: !0,
      onClose: _t,
      radius: v,
      back: L ? { label: o.backLabel ?? "Back", onClick: W } : void 0,
      next: $t ? {
        label: o.nextLabel ?? (x ? "Done" : "Next"),
        primary: !0,
        onClick: B
      } : void 0
    }), i?.appendChild(u);
  }
  function k() {
    if (!m) return;
    const o = t.steps[l];
    if (!o) {
      _();
      return;
    }
    if (r.log("render step", l, o.id), !wt(o)) {
      r.log(`step "${o.id}" skipped: condition not met`), C(e.on, "stepSkipped", { tour: t, index: l, step: o, reason: "condition" }), E += 1, l < t.steps.length - 1 ? (l += 1, k()) : _(E >= t.steps.length ? "dismissed" : "completed");
      return;
    }
    const d = D(o);
    if (!d) {
      r.log(`step "${o.id}" target not found yet — waiting`, o.selectors), dt(o.selectors, { timeout: 4e3 }).then((x) => {
        !m || t.steps[l] !== o || (x ? k() : (r.warn(`step "${o.id}" skipped: no element for selectors`, o.selectors), C(e.on, "stepSkipped", { tour: t, index: l, step: o, reason: "no-element" }), E += 1, l < t.steps.length - 1 ? (l += 1, k()) : _()));
      });
      return;
    }
    tt(), d.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" }), vt(o);
    const b = lt(d) ?? d.getBoundingClientRect();
    et(b), nt(b, o), yt(o), O(U(o) && A(o) ? b : null), Et(o), C(e.on, "stepActivated", { tour: t, index: l, step: o, target: d });
  }
  function Et(o) {
    if (f?.(), f = null, !A(o)) return;
    const d = l + 1, b = t.steps[d];
    !b || $(b) || (f = G(() => {
      !m || t.steps[l] !== o || P(b.pageUrl, window.location.href) && Y(d) && (f?.(), f = null, r.log("visitor navigated → advancing to", b.id), l = d, S(), k());
    }));
  }
  function rt(o) {
    m && (o.key === "Escape" ? (o.preventDefault(), _()) : o.key === "ArrowRight" ? B() : o.key === "ArrowLeft" && W());
  }
  function T() {
    if (!m) return;
    const o = t.steps[l];
    if (!o) return;
    const d = D(o);
    if (!d) return;
    const b = lt(d);
    if (!b) {
      Ct();
      return;
    }
    et(b, !0), nt(b, o), O(U(o) && A(o) ? b : null), u && (u.style.visibility = "");
  }
  function Ct() {
    a && (a.style.display = "none"), u && (u.style.visibility = "hidden"), O(null);
  }
  function ot(o = 0) {
    if (m || t.steps.length === 0) return;
    if (!e.allowWhileEditing && xt()) {
      r.log(`start suppressed for "${t.id}" — the builder is mounted`);
      return;
    }
    const d = Math.max(0, Math.min(o, t.steps.length - 1));
    if (!C(e.on, "tourStarting", { tour: t, index: d })) {
      r.log("start vetoed by handler");
      return;
    }
    H(), m = !0, l = d, E = 0, r.log("start", t.id, `at ${l}/${t.steps.length}`), tt(), window.addEventListener("keydown", rt, !0), window.addEventListener("resize", T, !0), window.addEventListener("scroll", T, !0), S(), C(e.on, "tourStarted", { tour: t, index: l }), k();
  }
  function kt() {
    a && (a.style.display = "none"), u && (u.remove(), u = null);
  }
  function I() {
    kt(), !w && (w = G(() => {
      if (!m) {
        w?.(), w = null;
        return;
      }
      const o = t.steps[l];
      o && $(o) && (w?.(), w = null, k());
    }));
  }
  function F() {
    w && (w(), w = null), f && (f(), f = null), m && (m = !1, window.removeEventListener("keydown", rt, !0), window.removeEventListener("resize", T, !0), window.removeEventListener("scroll", T, !0), s && s.parentNode && s.parentNode.removeChild(s), s = null, i = null, a = null, u = null, h = null);
  }
  function _(o = "dismissed") {
    r.log("stop", o);
    const d = m, b = l;
    H(), F(), n && Z(n), d && (o === "completed" ? C(e.on, "tourCompleted", { tour: t }) : C(e.on, "tourDismissed", { tour: t, index: b }));
  }
  function H() {
    p?.(), p = null;
  }
  function _t() {
    t.dismiss?.mode === "minimize" ? it() : _();
  }
  function it() {
    m && (r.log("minimized", t.id, `at ${l}`), F(), n && M(n, { tourId: t.id, index: l, minimized: !0 }), C(e.on, "tourMinimized", { tour: t, index: l }), St());
  }
  function St() {
    H();
    const o = t.dismiss?.resume;
    p = gt(
      {
        tourId: t.id,
        text: o?.text ?? "Carry on with the tour?",
        button: o?.button ?? "Resume",
        corner: o?.corner,
        offset: o?.offset,
        onResume: () => {
          p = null, n && M(n, { tourId: t.id, index: l }), C(e.on, "tourResumed", { tour: t, index: l }), ot(l);
        }
      },
      e.renderResume
    );
  }
  function Y(o) {
    const d = t.steps[o];
    return d ? C(e.on, "stepChanging", { tour: t, from: l, to: o, step: d }) : !0;
  }
  function B() {
    if (!m) return;
    const o = l + 1, d = t.steps[o];
    if (!d) {
      _("completed");
      return;
    }
    if (!Y(o)) {
      r.log("step change vetoed by handler");
      return;
    }
    if ($(d)) {
      l = o, S(), k();
      return;
    }
    l = o, S();
    const b = (L) => {
      F(), e.onNavigate ? e.onNavigate(L, d.id) : window.location.assign(L);
    }, x = t.steps[l - 1]?.action;
    if (x && x.type === "navigate" && x.url) {
      x.url.startsWith("#") ? (r.log("page transition (hash navigate) → resume at", l), I(), window.location.hash = x.url) : (r.log("page transition (navigate) → resume at", l), b(x.url));
      return;
    }
    const y = Xt(d.pageUrl);
    if (y) {
      y.startsWith("#") ? (r.log("page transition (derived hash) → resume at", l), I(), window.location.hash = y) : (r.log("page transition (derived navigate) → resume at", l, y), b(y));
      return;
    }
    r.log("page transition (wait) → resume at", l), I();
  }
  function W() {
    if (!m) return;
    const o = t.steps[l - 1];
    if (o) {
      if (!Y(l - 1)) {
        r.log("step change vetoed by handler");
        return;
      }
      if ($(o)) {
        l -= 1, S(), k();
        return;
      }
      l -= 1, S(), r.log("page transition back → resume at", l), I(), window.history.back();
    }
  }
  return { start: ot, stop: _, next: B, prev: W, minimize: it, isActive: () => m };
}
function te(t, e = {}) {
  const r = e.state;
  if (!r) return null;
  const n = ht(r);
  if (!n || n.tourId !== t.id) return null;
  if (!t.steps[n.index])
    return Z(r), null;
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
function ee(t, e) {
  if (xt()) return () => {
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
      return dt([r.selector], { timeout: 0 }).then((a) => {
        a && !i && s();
      }), () => {
        i = !0;
      };
    }
    case "cta": {
      let i = () => {
      };
      return i = bt({
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
function oe(t, e = {}) {
  const r = K("mount"), n = e.state, s = () => typeof t == "function" ? t() : t;
  let i = null, a = [], u = null;
  function h() {
    for (const l of a) l();
    a = [], u?.(), u = null;
  }
  function f(l) {
    return !e.canRun || e.canRun(l);
  }
  function p() {
    if (i?.isActive()) return;
    i = null, h();
    const l = n ? ht(n) : null;
    if (n && l?.minimized) {
      const c = s().find((g) => g.id === l.tourId && f(g));
      if (c) {
        const g = c.dismiss?.resume;
        u = gt(
          {
            tourId: c.id,
            text: g?.text ?? "Carry on with the tour?",
            button: g?.button ?? "Resume",
            corner: g?.corner,
            offset: g?.offset,
            onResume: () => {
              u = null, M(n, { tourId: c.id, index: l.index });
              const v = z(c, e);
              i = v, v.start(l.index);
            }
          },
          e.renderResume
        );
        return;
      }
    }
    if (n && e.autoResume !== !1)
      for (const c of s()) {
        if (!f(c)) continue;
        const g = te(c, e);
        if (g) {
          r.log("resumed", c.id), i = g;
          return;
        }
      }
    const E = ft(), w = e.viewer?.();
    for (const c of s()) {
      if (!f(c) || !c.trigger || c.trigger.type === "manual") continue;
      const g = n ? Q(n, c.id) : 0;
      qt(c.rules, {
        url: window.location.href,
        traits: w,
        device: E,
        firstVisit: g === 0,
        seenCount: g
      }) && a.push(
        ee(c, () => {
          n && Kt(n, c.id);
          const R = z(c, e);
          i = R, R.start();
        })
      );
    }
  }
  p();
  const m = G(p);
  return {
    start(l) {
      const E = s().find((c) => c.id === l);
      if (!E || !f(E)) return !1;
      i?.stop(), h(), n && Z(n);
      const w = z(E, e);
      return i = w, w.start(), !0;
    },
    stop() {
      i?.stop(), i = null;
    },
    unmount() {
      m(), h(), i?.stop(), i = null;
    }
  };
}
export {
  Wt as CARD_STYLES,
  J as PROGRESS_KEY,
  ee as armTrigger,
  Ft as autoSide,
  It as buildSelectors,
  Z as clearProgress,
  re as createLocalState,
  K as createLogger,
  ne as createPicker,
  z as createPlayer,
  Xt as deriveUrl,
  ft as detectDevice,
  xt as isBuilderMounted,
  X as isLoggingEnabled,
  Kt as markSeen,
  qt as matchRules,
  P as matchUrl,
  jt as matchesCondition,
  oe as mountTours,
  Ht as placeCard,
  ht as readProgress,
  Bt as renderCard,
  j as resolveElement,
  te as resumeTour,
  Q as seenCount,
  lt as visibleRect,
  dt as waitForElement,
  M as writeProgress
};
