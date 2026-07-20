const B = `
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
`, q = `
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
function L(t) {
  return JSON.stringify(t);
}
function K(t) {
  return /^[a-zA-Z][\w-]*$/.test(t) && t.length <= 30 && !/\d{2,}/.test(t) && !/^(css-|sc-|jsx-|emotion-|_|is-|has-)/.test(t);
}
function U(t) {
  const e = [];
  let r = t;
  for (; r && r !== document.body && r.nodeType === 1; ) {
    const n = r.tagName.toLowerCase(), i = r.parentElement;
    if (!i) {
      e.unshift(n);
      break;
    }
    const a = Array.from(i.children).filter((c) => c.tagName === r.tagName);
    e.unshift(a.length > 1 ? `${n}:nth-of-type(${a.indexOf(r) + 1})` : n), r = i;
  }
  return `body > ${e.join(" > ")}`;
}
function X(t) {
  let e = t.parentElement;
  for (; e && e !== document.body && !e.id; )
    e = e.parentElement;
  if (!e || !e.id) return null;
  const r = [];
  let n = t;
  for (; n && n !== e; ) {
    const i = n.tagName.toLowerCase(), a = n.parentElement;
    if (!a) return null;
    const c = Array.from(a.children).filter((l) => l.tagName === n.tagName);
    r.unshift(c.length > 1 ? `${i}:nth-of-type(${c.indexOf(n) + 1})` : i), n = a;
  }
  return `#${CSS.escape(e.id)} > ${r.join(" > ")}`;
}
const J = ["data-testid", "data-test", "data-test-id", "data-cy", "data-qa", "data-id", "data-name"];
function W(t) {
  const e = [], r = /* @__PURE__ */ new Set(), n = t.tagName.toLowerCase(), i = (s) => {
    if (!(!s || r.has(s)))
      try {
        document.querySelector(s) === t && (r.add(s), e.push(s));
      } catch {
      }
  };
  t.id && i(`#${CSS.escape(t.id)}`);
  for (const s of J) {
    const u = t.getAttribute(s);
    u && i(`${n}[${s}=${L(u)}]`);
  }
  const a = t.getAttribute("name");
  a && i(`${n}[name=${L(a)}]`);
  const c = t.getAttribute("aria-label");
  c && i(`[aria-label=${L(c)}]`);
  const l = Array.from(t.classList).filter(K);
  l.length && i(`${n}.${l.map((s) => CSS.escape(s)).join(".")}`);
  for (const s of l) i(`${n}.${CSS.escape(s)}`);
  i(X(t)), i(U(t));
  const d = (t.textContent ?? "").replace(/\s+/g, " ").trim();
  if (d && d.length <= 50 && /^(a|button|summary|label|h[1-6])$/.test(n)) {
    const s = `text=${d}`;
    r.has(s) || (r.add(s), e.push(s));
  }
  return e.length === 0 && e.push(U(t)), e;
}
const G = "a, button, summary, label, h1, h2, h3, h4, h5, h6";
function V(t, e) {
  if (t.startsWith("text=")) {
    const r = t.slice(5).trim();
    for (const n of Array.from(e.querySelectorAll(G)))
      if ((n.textContent ?? "").replace(/\s+/g, " ").trim() === r) return n;
    return null;
  }
  try {
    return e.querySelector(t);
  } catch {
    return null;
  }
}
function T(t, e = document) {
  for (const r of t) {
    const n = V(r, e);
    if (n) return n;
  }
  return null;
}
function Z(t, e = {}) {
  const r = e.root ?? document, n = T(t, r);
  return n ? Promise.resolve(n) : new Promise((i) => {
    let a = !1;
    const c = (s) => {
      a || (a = !0, l.disconnect(), clearTimeout(d), i(s));
    }, l = new MutationObserver(() => {
      const s = T(t, r);
      s && c(s);
    });
    l.observe(document.documentElement, {
      childList: !0,
      subtree: !0,
      attributes: !0
    });
    const d = setTimeout(() => c(null), e.timeout ?? 4e3);
  });
}
let v = null;
function A() {
  if (v !== null) return v;
  try {
    v = new URLSearchParams(window.location.search).has("use_logs");
  } catch {
    v = !1;
  }
  return v;
}
function O(t) {
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
function ut(t, e = {}) {
  const r = O("picker");
  let n = null, i = null, a = null, c = !1;
  function l(f) {
    if (f === n) return !0;
    for (const p of e.ignore ?? [])
      if (p && p.contains(f)) return !0;
    return !1;
  }
  function d() {
    if (n) return;
    n = document.createElement("div"), n.setAttribute("data-tours-picker", ""), i = n.attachShadow({ mode: "open" });
    const f = document.createElement("style");
    f.textContent = B, i.appendChild(f), a = document.createElement("div"), a.className = "tours-picker-overlay", a.style.display = "none", i.appendChild(a);
    const p = document.createElement("div");
    p.className = "tours-picker-hint", p.textContent = "Hover and click an element • Esc to cancel", i.appendChild(p), document.body.appendChild(n);
  }
  function s(f, p) {
    const g = document.elementFromPoint(f, p);
    return !g || l(g) ? null : g;
  }
  function u(f) {
    if (!c || !a) return;
    const p = s(f.clientX, f.clientY);
    if (!p) {
      a.style.display = "none";
      return;
    }
    const g = p.getBoundingClientRect();
    a.style.display = "block", a.style.left = `${g.left}px`, a.style.top = `${g.top}px`, a.style.width = `${g.width}px`, a.style.height = `${g.height}px`;
  }
  function b(f) {
    if (!c) return;
    const p = s(f.clientX, f.clientY);
    if (f.preventDefault(), f.stopPropagation(), !p) return;
    const g = W(p);
    r.log("picked", g), x(), t(g);
  }
  function E(f) {
    f.key === "Escape" && (f.preventDefault(), x());
  }
  function C() {
    c || (c = !0, r.log("start"), d(), document.addEventListener("mousemove", u, !0), document.addEventListener("click", b, !0), document.addEventListener("keydown", E, !0));
  }
  function x() {
    c && (c = !1, document.removeEventListener("mousemove", u, !0), document.removeEventListener("click", b, !0), document.removeEventListener("keydown", E, !0), n && n.parentNode && n.parentNode.removeChild(n), n = null, i = null, a = null);
  }
  return { start: C, stop: x };
}
const Q = 6, tt = 6, et = 10, nt = 12;
function rt(t, e, r) {
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
  }, a = ["bottom", "top", "right", "left"], c = a.find((l) => n[l] >= i[l] + 8);
  return c || a.reduce((l, d) => n[d] > n[l] ? d : l, a[0]);
}
function ot(t) {
  const { target: e, card: r, offset: n, viewport: i } = t, a = t.side === "auto", c = a ? rt(e, r, i) : t.side, l = a ? "center" : t.align, d = t.alignOffset ?? 0, s = l === "start" ? d : l === "end" ? -d : 0;
  let u = 0, b = 0;
  return c === "top" || c === "bottom" ? (u = c === "top" ? e.top - r.height - n : e.bottom + n, b = l === "start" ? e.left : l === "end" ? e.right - r.width : e.left + e.width / 2 - r.width / 2, b += s) : (b = c === "left" ? e.left - r.width - n : e.right + n, u = l === "start" ? e.top : l === "end" ? e.bottom - r.height : e.top + e.height / 2 - r.height / 2, u += s), b = Math.max(8, Math.min(b, i.width - r.width - 8)), u = Math.max(8, Math.min(u, i.height - r.height - 8)), { top: u, left: b };
}
function I(t) {
  const e = document.createElement("button");
  return e.type = "button", e.className = `tours-card__btn${t.primary ? " tours-card__btn--primary" : ""}${t.disabled ? " tours-card__btn--disabled" : ""}`, e.textContent = t.label, !t.disabled && t.onClick && e.addEventListener("click", t.onClick), e;
}
function it(t) {
  const e = document.createElement("div");
  if (e.className = `tours-card${t.ghost ? " tours-card--ghost" : ""}`, t.radius != null && (e.style.borderRadius = `${t.radius}px`), t.showClose) {
    const n = document.createElement("button");
    n.className = "tours-card__close", n.type = "button", n.textContent = "×", n.setAttribute("aria-label", "Close"), t.onClose && n.addEventListener("click", t.onClose), e.appendChild(n);
  }
  const r = document.createElement("div");
  if (r.className = "tours-card__content", t.contentHtml != null ? r.innerHTML = t.contentHtml : r.textContent = t.contentText ?? "", e.appendChild(r), t.back || t.next || t.progress) {
    const n = document.createElement("div");
    if (n.className = "tours-card__footer", t.back && n.appendChild(I(t.back)), t.progress) {
      const i = document.createElement("span");
      i.className = "tours-card__progress", i.textContent = t.progress, n.appendChild(i);
    }
    t.next && n.appendChild(I(t.next)), e.appendChild(n);
  }
  return e;
}
const st = `
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
function at(t) {
  const e = t.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*\*/g, "\0").replace(/\*/g, "[^/]*").replace(/ /g, ".*").replace(/\?/g, ".");
  return new RegExp(`^${e}$`);
}
function F(t, e) {
  if (!t) return !0;
  if (t.regex)
    try {
      return new RegExp(t.regex).test(e);
    } catch {
      return !1;
    }
  if (t.glob)
    try {
      return at(t.glob).test(e);
    } catch {
      return !1;
    }
  return !0;
}
const N = "tours:progress";
function ft() {
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
function ct(t) {
  const e = t.get(N);
  if (!e) return null;
  try {
    const r = JSON.parse(e);
    if (typeof r?.tourId == "string" && typeof r?.index == "number") return r;
  } catch {
  }
  return null;
}
function lt(t, e) {
  t.set(N, JSON.stringify(e));
}
function M(t) {
  t.remove(N);
}
function dt(t, e = {}) {
  const r = O("player"), n = e.state;
  let i = null, a = null, c = null, l = null, d = !1, s = 0;
  const u = t.display?.padding ?? Q, b = t.display?.radius ?? tt, E = t.display?.cardRadius ?? et, C = t.display?.offset ?? nt;
  function x(o) {
    return T(o.selectors);
  }
  function f(o) {
    return F(o.pageUrl, window.location.href);
  }
  function p() {
    n && lt(n, { tourId: t.id, index: s });
  }
  function g() {
    if (i) return;
    i = document.createElement("div"), i.setAttribute("data-tours-player", ""), a = i.attachShadow({ mode: "open" });
    const o = document.createElement("style");
    o.textContent = q + st, a.appendChild(o);
    const h = document.createElement("div");
    h.className = "tours-backdrop", a.appendChild(h), c = document.createElement("div"), c.className = "tours-spotlight", c.style.borderRadius = `${b}px`, a.appendChild(c), document.body.appendChild(i);
  }
  function R(o) {
    c && (c.style.display = "block", c.style.left = `${o.left - u}px`, c.style.top = `${o.top - u}px`, c.style.width = `${o.width + u * 2}px`, c.style.height = `${o.height + u * 2}px`);
  }
  function P(o, h) {
    if (!l) return;
    const m = {
      top: o.top - u,
      left: o.left - u,
      right: o.right + u,
      bottom: o.bottom + u,
      width: o.width + u * 2,
      height: o.height + u * 2
    }, { top: S, left: j } = ot({
      target: m,
      card: { width: l.offsetWidth, height: l.offsetHeight },
      side: h.placement ?? "bottom",
      align: h.align ?? "center",
      offset: C,
      alignOffset: t.display?.alignOffset ?? 0,
      viewport: { width: window.innerWidth, height: window.innerHeight }
    });
    l.style.left = `${j}px`, l.style.top = `${S}px`;
  }
  function Y(o) {
    const h = t.steps.length;
    l && l.remove(), l = it({
      contentText: o.content.default,
      progress: `Step ${s + 1} of ${h}`,
      showClose: !0,
      onClose: y,
      radius: E,
      back: { label: o.backLabel ?? "Back", disabled: s === 0, onClick: $ },
      next: {
        label: o.nextLabel ?? (s === h - 1 ? "Done" : "Next"),
        primary: !0,
        onClick: _
      }
    }), a?.appendChild(l);
  }
  function w() {
    if (!d) return;
    const o = t.steps[s];
    if (!o) {
      y();
      return;
    }
    r.log("render step", s, o.id);
    const h = x(o);
    if (!h) {
      r.log(`step "${o.id}" target not found yet — waiting`, o.selectors), Z(o.selectors, { timeout: 4e3 }).then((S) => {
        !d || t.steps[s] !== o || (S ? w() : (r.warn(`step "${o.id}" skipped: no element for selectors`, o.selectors), s < t.steps.length - 1 ? (s += 1, w()) : y()));
      });
      return;
    }
    g(), h.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" }), Y(o);
    const m = h.getBoundingClientRect();
    R(m), P(m, o);
  }
  function D(o) {
    d && (o.key === "Escape" ? (o.preventDefault(), y()) : o.key === "ArrowRight" ? _() : o.key === "ArrowLeft" && $());
  }
  function k() {
    if (!d) return;
    const o = t.steps[s];
    if (!o) return;
    const h = x(o);
    if (!h) return;
    const m = h.getBoundingClientRect();
    R(m), P(m, o);
  }
  function H(o = 0) {
    d || t.steps.length !== 0 && (d = !0, s = Math.max(0, Math.min(o, t.steps.length - 1)), r.log("start", t.id, `at ${s}/${t.steps.length}`), g(), window.addEventListener("keydown", D, !0), window.addEventListener("resize", k, !0), window.addEventListener("scroll", k, !0), p(), w());
  }
  function z() {
    d && (d = !1, window.removeEventListener("keydown", D, !0), window.removeEventListener("resize", k, !0), window.removeEventListener("scroll", k, !0), i && i.parentNode && i.parentNode.removeChild(i), i = null, a = null, c = null, l = null);
  }
  function y() {
    r.log("stop"), z(), n && M(n);
  }
  function _() {
    if (!d) return;
    const o = s + 1, h = t.steps[o];
    if (!h) {
      y();
      return;
    }
    if (f(h)) {
      s = o, p(), w();
      return;
    }
    s = o, p();
    const m = t.steps[s - 1]?.action;
    r.log("page transition → resume at", s), z(), m && m.type === "navigate" && m.url && window.location.assign(m.url);
  }
  function $() {
    if (!d) return;
    const o = t.steps[s - 1];
    !o || !f(o) || (s -= 1, p(), w());
  }
  return { start: H, stop: y, next: _, prev: $ };
}
function pt(t, e = {}) {
  const r = e.state;
  if (!r) return null;
  const n = ct(r);
  if (!n || n.tourId !== t.id) return null;
  const i = t.steps[n.index];
  if (!i)
    return M(r), null;
  if (!F(i.pageUrl, window.location.href)) return null;
  const a = dt(t, { state: r });
  return a.start(n.index), a;
}
export {
  st as CARD_STYLES,
  N as PROGRESS_KEY,
  rt as autoSide,
  W as buildSelectors,
  M as clearProgress,
  ft as createLocalState,
  O as createLogger,
  ut as createPicker,
  dt as createPlayer,
  A as isLoggingEnabled,
  F as matchUrl,
  ot as placeCard,
  ct as readProgress,
  it as renderCard,
  T as resolveElement,
  pt as resumeTour,
  Z as waitForElement,
  lt as writeProgress
};
