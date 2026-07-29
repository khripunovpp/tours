const kt = `
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
`, _t = `
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
function Y(t) {
  return JSON.stringify(t);
}
function St(t) {
  return /^[a-zA-Z][\w-]*$/.test(t) && t.length <= 30 && !/\d{2,}/.test(t) && !/^(css-|sc-|jsx-|emotion-|_|is-|has-)/.test(t);
}
function rt(t) {
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
function $t(t) {
  let e = t.parentElement;
  for (; e && e !== document.body && !e.id; )
    e = e.parentElement;
  if (!e || !e.id) return null;
  const r = [];
  let n = t;
  for (; n && n !== e; ) {
    const i = n.tagName.toLowerCase(), s = n.parentElement;
    if (!s) return null;
    const a = Array.from(s.children).filter((d) => d.tagName === n.tagName);
    r.unshift(a.length > 1 ? `${i}:nth-of-type(${a.indexOf(n) + 1})` : i), n = s;
  }
  return `#${CSS.escape(e.id)} > ${r.join(" > ")}`;
}
const Lt = ["data-testid", "data-test", "data-test-id", "data-cy", "data-qa", "data-id", "data-name"];
function Nt(t) {
  const e = [], r = /* @__PURE__ */ new Set(), n = t.tagName.toLowerCase(), i = (f) => {
    if (!(!f || r.has(f)))
      try {
        document.querySelector(f) === t && (r.add(f), e.push(f));
      } catch {
      }
  };
  t.id && i(`#${CSS.escape(t.id)}`);
  for (const f of Lt) {
    const p = t.getAttribute(f);
    p && i(`${n}[${f}=${Y(p)}]`);
  }
  const s = t.getAttribute("name");
  s && i(`${n}[name=${Y(s)}]`);
  const a = t.getAttribute("aria-label");
  a && i(`[aria-label=${Y(a)}]`);
  const d = Array.from(t.classList).filter(St);
  d.length && i(`${n}.${d.map((f) => CSS.escape(f)).join(".")}`);
  for (const f of d) i(`${n}.${CSS.escape(f)}`);
  i($t(t)), i(rt(t));
  const g = (t.textContent ?? "").replace(/\s+/g, " ").trim();
  if (g && g.length <= 50 && /^(a|button|summary|label|h[1-6])$/.test(n)) {
    const f = `text=${g}`;
    r.has(f) || (r.add(f), e.push(f));
  }
  return e.length === 0 && e.push(rt(t)), e;
}
const At = "a, button, summary, label, h1, h2, h3, h4, h5, h6";
function ot(t, e) {
  return !(t instanceof Element) || !t.isConnected || e !== document && e instanceof Node && !e.contains(t) ? null : t;
}
function Rt(t, e) {
  if (typeof t == "function") {
    let r;
    try {
      r = t();
    } catch {
      return null;
    }
    return ot(r, e);
  }
  if (typeof t != "string") return ot(t, e);
  if (t.startsWith("text=")) {
    const r = t.slice(5).trim();
    for (const n of Array.from(e.querySelectorAll(At)))
      if ((n.textContent ?? "").replace(/\s+/g, " ").trim() === r) return n;
    return null;
  }
  try {
    return e.querySelector(t);
  } catch {
    return null;
  }
}
function W(t, e = document) {
  for (const r of t) {
    const n = Rt(r, e);
    if (n) return n;
  }
  return null;
}
function at(t, e = {}) {
  const r = e.root ?? document, n = W(t, r);
  return n ? Promise.resolve(n) : new Promise((i) => {
    let s = !1, a;
    const d = (p) => {
      s || (s = !0, g.disconnect(), a && clearTimeout(a), i(p));
    }, g = new MutationObserver(() => {
      const p = W(t, r);
      p && d(p);
    });
    g.observe(document.documentElement, {
      childList: !0,
      subtree: !0,
      attributes: !0
    });
    const f = e.timeout ?? 4e3;
    f > 0 && Number.isFinite(f) && (a = setTimeout(() => d(null), f));
  });
}
let N = null;
function B() {
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
      B() && console.log(e, ...r);
    },
    warn: (...r) => {
      B() && console.warn(e, ...r);
    },
    error: (...r) => {
      B() && console.error(e, ...r);
    }
  };
}
function Jt(t, e = {}) {
  const r = q("picker");
  let n = null, i = null, s = null, a = !1;
  function d(l) {
    if (l === n) return !0;
    for (const m of e.ignore ?? [])
      if (m && m.contains(l)) return !0;
    return !1;
  }
  function g() {
    if (n) return;
    n = document.createElement("div"), n.setAttribute("data-tours-picker", ""), i = n.attachShadow({ mode: "open" });
    const l = document.createElement("style");
    l.textContent = kt, i.appendChild(l), s = document.createElement("div"), s.className = "tours-picker-overlay", s.style.display = "none", i.appendChild(s);
    const m = document.createElement("div");
    m.className = "tours-picker-hint", m.textContent = "Hover and click an element • Esc to cancel", i.appendChild(m), document.body.appendChild(n);
  }
  function f(l, m) {
    const v = document.elementFromPoint(l, m);
    return !v || d(v) ? null : v;
  }
  function p(l) {
    if (!a || !s) return;
    const m = f(l.clientX, l.clientY);
    if (!m) {
      s.style.display = "none";
      return;
    }
    const v = m.getBoundingClientRect();
    s.style.display = "block", s.style.left = `${v.left}px`, s.style.top = `${v.top}px`, s.style.width = `${v.width}px`, s.style.height = `${v.height}px`;
  }
  function h(l) {
    if (!a) return;
    const m = f(l.clientX, l.clientY);
    if (l.preventDefault(), l.stopPropagation(), !m) return;
    const v = Nt(m);
    r.log("picked", v), y(), t(v);
  }
  function c(l) {
    l.key === "Escape" && (l.preventDefault(), y());
  }
  function E() {
    a || (a = !0, r.log("start"), g(), document.addEventListener("mousemove", p, !0), document.addEventListener("click", h, !0), document.addEventListener("keydown", c, !0));
  }
  function y() {
    a && (a = !1, document.removeEventListener("mousemove", p, !0), document.removeEventListener("click", h, !0), document.removeEventListener("keydown", c, !0), n && n.parentNode && n.parentNode.removeChild(n), n = null, i = null, s = null);
  }
  return { start: E, stop: y };
}
const Tt = 6, It = 6, zt = 10, Pt = 12;
function Dt(t, e, r) {
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
  }, s = ["bottom", "top", "right", "left"], a = s.find((d) => n[d] >= i[d] + 8);
  return a || s.reduce((d, g) => n[g] > n[d] ? g : d, s[0]);
}
function Ut(t) {
  const { target: e, card: r, offset: n, viewport: i } = t, s = t.side === "auto", a = s ? Dt(e, r, i) : t.side, d = s ? "center" : t.align, g = t.alignOffset ?? 0, f = d === "start" ? g : d === "end" ? -g : 0;
  let p = 0, h = 0;
  return a === "top" || a === "bottom" ? (p = a === "top" ? e.top - r.height - n : e.bottom + n, h = d === "start" ? e.left : d === "end" ? e.right - r.width : e.left + e.width / 2 - r.width / 2, h += f) : (h = a === "left" ? e.left - r.width - n : e.right + n, p = d === "start" ? e.top : d === "end" ? e.bottom - r.height : e.top + e.height / 2 - r.height / 2, p += f), h = Math.max(8, Math.min(h, i.width - r.width - 8)), p = Math.max(8, Math.min(p, i.height - r.height - 8)), { top: p, left: h };
}
function it(t) {
  const e = document.createElement("button");
  return e.type = "button", e.className = `tours-card__btn${t.primary ? " tours-card__btn--primary" : ""}${t.disabled ? " tours-card__btn--disabled" : ""}`, e.textContent = t.label, !t.disabled && t.onClick && e.addEventListener("click", t.onClick), e;
}
function Ot(t) {
  const e = document.createElement("div");
  if (e.className = `tours-card${t.ghost ? " tours-card--ghost" : ""}`, t.radius != null && (e.style.borderRadius = `${t.radius}px`), t.showClose) {
    const n = document.createElement("button");
    n.className = "tours-card__close", n.type = "button", n.textContent = "×", n.setAttribute("aria-label", "Close"), t.onClose && n.addEventListener("click", t.onClose), e.appendChild(n);
  }
  const r = document.createElement("div");
  if (r.className = "tours-card__content", t.contentHtml != null ? r.innerHTML = t.contentHtml : r.textContent = t.contentText ?? "", e.appendChild(r), t.back || t.next || t.progress) {
    const n = document.createElement("div");
    if (n.className = "tours-card__footer", t.back && n.appendChild(it(t.back)), t.progress) {
      const i = document.createElement("span");
      i.className = "tours-card__progress", i.textContent = t.progress, n.appendChild(i);
    }
    t.next && n.appendChild(it(t.next)), e.appendChild(n);
  }
  return e;
}
const Mt = `
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
function Ft(t) {
  const e = t.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*\*/g, "\0").replace(/\*/g, "[^/]*").replace(/ /g, ".*").replace(/\?/g, ".");
  return new RegExp(`^${e}$`);
}
function z(t, e) {
  if (!t) return !0;
  if (t.regex)
    try {
      return new RegExp(t.regex).test(e);
    } catch {
      return !1;
    }
  if (t.glob)
    try {
      return Ft(t.glob).test(e);
    } catch {
      return !1;
    }
  return !0;
}
function Ht(t) {
  if (!t || !t.glob) return null;
  const e = t.glob.replace(/\*+/g, "");
  return /^https?:\/\//i.test(e) || e.startsWith("#") || e.startsWith("/") ? e : null;
}
function ct(t = window.innerWidth) {
  return t <= 640 ? "mobile" : t <= 1024 ? "tablet" : "desktop";
}
function lt(t, e) {
  if (t.url && !z(t.url, e.url)) return !1;
  if (t.traits) {
    for (const [r, n] of Object.entries(t.traits))
      if (e.traits?.[r] !== n) return !1;
  }
  return !(t.firstVisitOnly && !e.firstVisit || t.device && t.device !== e.device || t.unlessSeen && e.seenCount > 0 || t.maxShows !== void 0 && e.seenCount >= t.maxShows);
}
function Yt(t, e) {
  return !t || lt(t, e);
}
function Bt(t, e) {
  return !t || t.length === 0 ? !0 : t.some((r) => lt(r.when, e));
}
const V = "tours:locationchange";
let st = !1;
function Wt() {
  if (!st) {
    st = !0;
    for (const t of ["pushState", "replaceState"]) {
      const e = history[t];
      history[t] = function(...n) {
        const i = e.apply(this, n);
        return window.dispatchEvent(new Event(V)), i;
      };
    }
  }
}
function X(t) {
  return Wt(), window.addEventListener("popstate", t), window.addEventListener("hashchange", t), window.addEventListener(V, t), () => {
    window.removeEventListener("popstate", t), window.removeEventListener("hashchange", t), window.removeEventListener(V, t);
  };
}
const G = "tours:progress";
function Zt() {
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
function ut(t) {
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
function dt(t) {
  t.remove(G);
}
const ft = "tours:seen:";
function K(t, e) {
  const r = t.get(ft + e), n = r ? parseInt(r, 10) : 0;
  return Number.isNaN(n) ? 0 : n;
}
function Vt(t, e) {
  t.set(ft + e, String(K(t, e) + 1));
}
const Xt = `
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
function pt(t, e) {
  return e ? e(t) : ht({
    text: t.text,
    button: t.button,
    corner: t.corner,
    offset: t.offset,
    onStart: t.onResume
  });
}
function ht(t) {
  const e = t.corner ?? "bottom-right", r = t.offset ?? 24, n = document.createElement("div");
  n.setAttribute("data-tours-cta", "");
  const i = n.attachShadow({ mode: "open" }), s = document.createElement("style");
  s.textContent = Xt, i.appendChild(s);
  const a = document.createElement("div");
  a.className = "cta";
  const [d, g] = e.split("-");
  a.style[d] = `${r}px`, a.style[g] = `${r}px`;
  const f = () => {
    n.parentNode && n.parentNode.removeChild(n);
  }, p = document.createElement("button");
  p.className = "cta__close", p.type = "button", p.textContent = "×", p.setAttribute("aria-label", "Dismiss"), p.addEventListener("click", f);
  const h = document.createElement("p");
  h.className = "cta__text", h.textContent = t.text;
  const c = document.createElement("button");
  return c.className = "cta__btn", c.type = "button", c.textContent = t.button, c.addEventListener("click", () => {
    f(), t.onStart();
  }), a.append(p, h, c), i.appendChild(a), document.body.appendChild(n), f;
}
const jt = /* @__PURE__ */ new Set([
  "tourStarting",
  "stepChanging"
]);
function C(t, e, r) {
  const n = jt.has(e);
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
const qt = "[data-tours-editor]";
function mt() {
  return typeof document < "u" && document.querySelector(qt) !== null;
}
function j(t, e = {}) {
  const r = q("player"), n = e.state;
  let i = null, s = null, a = null, d = null, g = null, f = null, p = null, h = !1, c = 0, E = 0, y = null;
  const l = t.display?.padding ?? Tt, m = t.display?.radius ?? It, v = t.display?.cardRadius ?? zt, A = t.display?.offset ?? Pt;
  function P(o) {
    return W(o.selectors);
  }
  function D(o) {
    return o.action?.type === "click";
  }
  function gt(o) {
    if (!o.condition) return !0;
    const u = n ? K(n, t.id) : 0;
    return Yt(o.condition, {
      url: window.location.href,
      traits: e.viewer?.(),
      device: ct(),
      firstVisit: u === 0,
      seenCount: u
    });
  }
  function $(o) {
    return z(o.pageUrl, window.location.href);
  }
  function S() {
    n && I(n, { tourId: t.id, index: c });
  }
  function J() {
    if (i) return;
    i = document.createElement("div"), i.setAttribute("data-tours-player", ""), s = i.attachShadow({ mode: "open" });
    const o = document.createElement("style");
    o.textContent = _t + Mt, s.appendChild(o), g = document.createElement("div"), g.className = "tours-backdrop", g.addEventListener("click", (u) => {
      const b = t.steps[c], x = b ? P(b) : null;
      if (x) {
        const w = x.getBoundingClientRect();
        if (u.clientX >= w.left - l && u.clientX <= w.right + l && u.clientY >= w.top - l && u.clientY <= w.bottom + l) return;
      }
      _();
    }), s.appendChild(g), a = document.createElement("div"), a.className = "tours-spotlight", a.style.borderRadius = `${m}px`, s.appendChild(a), document.body.appendChild(i);
  }
  function bt(o) {
    if (!g) return;
    if (!o) {
      g.style.clipPath = "";
      return;
    }
    const u = o.left - l, b = o.top - l, x = o.right + l, w = o.bottom + l;
    g.style.clipPath = `polygon(0 0, 0 100%, ${u}px 100%, ${u}px ${b}px, ${x}px ${b}px, ${x}px ${w}px, ${u}px ${w}px, ${u}px 100%, 100% 100%, 100% 0)`;
  }
  function Z(o, u = !1) {
    a && (a.style.transitionDuration = u ? "0ms" : "", a.style.display = "block", a.style.left = `${o.left - l}px`, a.style.top = `${o.top - l}px`, a.style.width = `${o.width + l * 2}px`, a.style.height = `${o.height + l * 2}px`);
  }
  function Q(o, u) {
    if (!d) return;
    const b = {
      top: o.top - l,
      left: o.left - l,
      right: o.right + l,
      bottom: o.bottom + l,
      width: o.width + l * 2,
      height: o.height + l * 2
    }, { top: x, left: w } = Ut({
      target: b,
      card: { width: d.offsetWidth, height: d.offsetHeight },
      side: u.placement ?? "bottom",
      align: u.align ?? "center",
      offset: A,
      alignOffset: t.display?.alignOffset ?? 0,
      viewport: { width: window.innerWidth, height: window.innerHeight }
    });
    d.style.left = `${w}px`, d.style.top = `${x}px`;
  }
  function xt(o) {
    const u = Math.max(1, t.steps.length - E), b = Math.max(1, Math.min(c + 1 - E, u));
    d && d.remove();
    const x = c === t.steps.length - 1, w = t.steps[c - 1], L = !!w && $(w), Ct = !D(o) || x;
    d = Ot({
      contentText: o.content.default,
      progress: `Step ${b} of ${u}`,
      showClose: !0,
      onClose: yt,
      radius: v,
      back: L ? { label: o.backLabel ?? "Back", onClick: H } : void 0,
      next: Ct ? {
        label: o.nextLabel ?? (x ? "Done" : "Next"),
        primary: !0,
        onClick: F
      } : void 0
    }), s?.appendChild(d);
  }
  function k() {
    if (!h) return;
    const o = t.steps[c];
    if (!o) {
      _();
      return;
    }
    if (r.log("render step", c, o.id), !gt(o)) {
      r.log(`step "${o.id}" skipped: condition not met`), C(e.on, "stepSkipped", { tour: t, index: c, step: o, reason: "condition" }), E += 1, c < t.steps.length - 1 ? (c += 1, k()) : _(E >= t.steps.length ? "dismissed" : "completed");
      return;
    }
    const u = P(o);
    if (!u) {
      r.log(`step "${o.id}" target not found yet — waiting`, o.selectors), at(o.selectors, { timeout: 4e3 }).then((x) => {
        !h || t.steps[c] !== o || (x ? k() : (r.warn(`step "${o.id}" skipped: no element for selectors`, o.selectors), C(e.on, "stepSkipped", { tour: t, index: c, step: o, reason: "no-element" }), E += 1, c < t.steps.length - 1 ? (c += 1, k()) : _()));
      });
      return;
    }
    J(), u.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" }), xt(o);
    const b = u.getBoundingClientRect();
    Z(b), Q(b, o), bt(D(o) ? b : null), wt(o), C(e.on, "stepActivated", { tour: t, index: c, step: o, target: u });
  }
  function wt(o) {
    if (f?.(), f = null, !D(o)) return;
    const u = c + 1, b = t.steps[u];
    !b || $(b) || (f = X(() => {
      !h || t.steps[c] !== o || z(b.pageUrl, window.location.href) && M(u) && (f?.(), f = null, r.log("visitor navigated → advancing to", b.id), c = u, S(), k());
    }));
  }
  function tt(o) {
    h && (o.key === "Escape" ? (o.preventDefault(), _()) : o.key === "ArrowRight" ? F() : o.key === "ArrowLeft" && H());
  }
  function R() {
    if (!h) return;
    const o = t.steps[c];
    if (!o) return;
    const u = P(o);
    if (!u) return;
    const b = u.getBoundingClientRect();
    Z(b, !0), Q(b, o);
  }
  function et(o = 0) {
    if (h || t.steps.length === 0) return;
    if (!e.allowWhileEditing && mt()) {
      r.log(`start suppressed for "${t.id}" — the builder is mounted`);
      return;
    }
    const u = Math.max(0, Math.min(o, t.steps.length - 1));
    if (!C(e.on, "tourStarting", { tour: t, index: u })) {
      r.log("start vetoed by handler");
      return;
    }
    O(), h = !0, c = u, E = 0, r.log("start", t.id, `at ${c}/${t.steps.length}`), J(), window.addEventListener("keydown", tt, !0), window.addEventListener("resize", R, !0), window.addEventListener("scroll", R, !0), S(), C(e.on, "tourStarted", { tour: t, index: c }), k();
  }
  function vt() {
    a && (a.style.display = "none"), d && (d.remove(), d = null);
  }
  function T() {
    vt(), !y && (y = X(() => {
      if (!h) {
        y?.(), y = null;
        return;
      }
      const o = t.steps[c];
      o && $(o) && (y?.(), y = null, k());
    }));
  }
  function U() {
    y && (y(), y = null), f && (f(), f = null), h && (h = !1, window.removeEventListener("keydown", tt, !0), window.removeEventListener("resize", R, !0), window.removeEventListener("scroll", R, !0), i && i.parentNode && i.parentNode.removeChild(i), i = null, s = null, a = null, d = null, g = null);
  }
  function _(o = "dismissed") {
    r.log("stop", o);
    const u = h, b = c;
    O(), U(), n && dt(n), u && (o === "completed" ? C(e.on, "tourCompleted", { tour: t }) : C(e.on, "tourDismissed", { tour: t, index: b }));
  }
  function O() {
    p?.(), p = null;
  }
  function yt() {
    t.dismiss?.mode === "minimize" ? nt() : _();
  }
  function nt() {
    h && (r.log("minimized", t.id, `at ${c}`), U(), n && I(n, { tourId: t.id, index: c, minimized: !0 }), C(e.on, "tourMinimized", { tour: t, index: c }), Et());
  }
  function Et() {
    O();
    const o = t.dismiss?.resume;
    p = pt(
      {
        tourId: t.id,
        text: o?.text ?? "Carry on with the tour?",
        button: o?.button ?? "Resume",
        corner: o?.corner,
        offset: o?.offset,
        onResume: () => {
          p = null, n && I(n, { tourId: t.id, index: c }), C(e.on, "tourResumed", { tour: t, index: c }), et(c);
        }
      },
      e.renderResume
    );
  }
  function M(o) {
    const u = t.steps[o];
    return u ? C(e.on, "stepChanging", { tour: t, from: c, to: o, step: u }) : !0;
  }
  function F() {
    if (!h) return;
    const o = c + 1, u = t.steps[o];
    if (!u) {
      _("completed");
      return;
    }
    if (!M(o)) {
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
    const w = Ht(u.pageUrl);
    if (w) {
      w.startsWith("#") ? (r.log("page transition (derived hash) → resume at", c), T(), window.location.hash = w) : (r.log("page transition (derived navigate) → resume at", c, w), b(w));
      return;
    }
    r.log("page transition (wait) → resume at", c), T();
  }
  function H() {
    if (!h) return;
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
      c -= 1, S(), r.log("page transition back → resume at", c), T(), window.history.back();
    }
  }
  return { start: et, stop: _, next: F, prev: H, minimize: nt, isActive: () => h };
}
function Gt(t, e = {}) {
  const r = e.state;
  if (!r) return null;
  const n = ut(r);
  if (!n || n.tourId !== t.id) return null;
  if (!t.steps[n.index])
    return dt(r), null;
  let i = -1;
  for (let a = n.index; a < t.steps.length; a++)
    if (z(t.steps[a].pageUrl, window.location.href)) {
      i = a;
      break;
    }
  if (i === -1) return null;
  const s = j(t, e);
  return s.start(i), s;
}
function Kt(t, e) {
  if (mt()) return () => {
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
      return at([r.selector], { timeout: 0 }).then((a) => {
        a && !s && i();
      }), () => {
        s = !0;
      };
    }
    case "cta": {
      let s = () => {
      };
      return s = ht({
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
function Qt(t, e = {}) {
  const r = q("mount"), n = e.state, i = () => typeof t == "function" ? t() : t;
  let s = null, a = [], d = null;
  function g() {
    for (const c of a) c();
    a = [], d?.(), d = null;
  }
  function f(c) {
    return !e.canRun || e.canRun(c);
  }
  function p() {
    if (s?.isActive()) return;
    s = null, g();
    const c = n ? ut(n) : null;
    if (n && c?.minimized) {
      const l = i().find((m) => m.id === c.tourId && f(m));
      if (l) {
        const m = l.dismiss?.resume;
        d = pt(
          {
            tourId: l.id,
            text: m?.text ?? "Carry on with the tour?",
            button: m?.button ?? "Resume",
            corner: m?.corner,
            offset: m?.offset,
            onResume: () => {
              d = null, I(n, { tourId: l.id, index: c.index });
              const v = j(l, e);
              s = v, v.start(c.index);
            }
          },
          e.renderResume
        );
        return;
      }
    }
    if (n)
      for (const l of i()) {
        if (!f(l)) continue;
        const m = Gt(l, e);
        if (m) {
          r.log("resumed", l.id), s = m;
          return;
        }
      }
    const E = ct(), y = e.viewer?.();
    for (const l of i()) {
      if (!f(l) || !l.trigger || l.trigger.type === "manual") continue;
      const m = n ? K(n, l.id) : 0;
      Bt(l.rules, {
        url: window.location.href,
        traits: y,
        device: E,
        firstVisit: m === 0,
        seenCount: m
      }) && a.push(
        Kt(l, () => {
          n && Vt(n, l.id);
          const A = j(l, e);
          s = A, A.start();
        })
      );
    }
  }
  p();
  const h = X(p);
  return () => {
    h(), g(), s?.stop(), s = null;
  };
}
export {
  Mt as CARD_STYLES,
  G as PROGRESS_KEY,
  Kt as armTrigger,
  Dt as autoSide,
  Nt as buildSelectors,
  dt as clearProgress,
  Zt as createLocalState,
  q as createLogger,
  Jt as createPicker,
  j as createPlayer,
  Ht as deriveUrl,
  ct as detectDevice,
  mt as isBuilderMounted,
  B as isLoggingEnabled,
  Vt as markSeen,
  Bt as matchRules,
  z as matchUrl,
  Yt as matchesCondition,
  Qt as mountTours,
  Ut as placeCard,
  ut as readProgress,
  Ot as renderCard,
  W as resolveElement,
  Gt as resumeTour,
  K as seenCount,
  at as waitForElement,
  I as writeProgress
};
