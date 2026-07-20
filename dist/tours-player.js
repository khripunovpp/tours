const O = `
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
`, U = `
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
function F(t) {
  return /^[a-zA-Z][\w-]*$/.test(t) && t.length <= 30 && !/\d{2,}/.test(t) && !/^(css-|sc-|jsx-|emotion-|_|is-|has-)/.test(t);
}
function T(t) {
  const e = [];
  let o = t;
  for (; o && o !== document.body && o.nodeType === 1; ) {
    const n = o.tagName.toLowerCase(), r = o.parentElement;
    if (!r) {
      e.unshift(n);
      break;
    }
    const i = Array.from(r.children).filter((l) => l.tagName === o.tagName);
    e.unshift(i.length > 1 ? `${n}:nth-of-type(${i.indexOf(o) + 1})` : n), o = r;
  }
  return `body > ${e.join(" > ")}`;
}
function M(t) {
  let e = t.parentElement;
  for (; e && e !== document.body && !e.id; )
    e = e.parentElement;
  if (!e || !e.id) return null;
  const o = [];
  let n = t;
  for (; n && n !== e; ) {
    const r = n.tagName.toLowerCase(), i = n.parentElement;
    if (!i) return null;
    const l = Array.from(i.children).filter((a) => a.tagName === n.tagName);
    o.unshift(l.length > 1 ? `${r}:nth-of-type(${l.indexOf(n) + 1})` : r), n = i;
  }
  return `#${CSS.escape(e.id)} > ${o.join(" > ")}`;
}
const H = ["data-testid", "data-test", "data-test-id", "data-cy", "data-qa", "data-id", "data-name"];
function I(t) {
  const e = [], o = /* @__PURE__ */ new Set(), n = t.tagName.toLowerCase(), r = (c) => {
    if (!(!c || o.has(c)))
      try {
        document.querySelector(c) === t && (o.add(c), e.push(c));
      } catch {
      }
  };
  t.id && r(`#${CSS.escape(t.id)}`);
  for (const c of H) {
    const m = t.getAttribute(c);
    m && r(`${n}[${c}=${L(m)}]`);
  }
  const i = t.getAttribute("name");
  i && r(`${n}[name=${L(i)}]`);
  const l = t.getAttribute("aria-label");
  l && r(`[aria-label=${L(l)}]`);
  const a = Array.from(t.classList).filter(F);
  a.length && r(`${n}.${a.map((c) => CSS.escape(c)).join(".")}`);
  for (const c of a) r(`${n}.${CSS.escape(c)}`);
  r(M(t)), r(T(t));
  const d = (t.textContent ?? "").replace(/\s+/g, " ").trim();
  if (d && d.length <= 50 && /^(a|button|summary|label|h[1-6])$/.test(n)) {
    const c = `text=${d}`;
    o.has(c) || (o.add(c), e.push(c));
  }
  return e.length === 0 && e.push(T(t)), e;
}
const Y = "a, button, summary, label, h1, h2, h3, h4, h5, h6";
function j(t, e) {
  if (t.startsWith("text=")) {
    const o = t.slice(5).trim();
    for (const n of Array.from(e.querySelectorAll(Y)))
      if ((n.textContent ?? "").replace(/\s+/g, " ").trim() === o) return n;
    return null;
  }
  try {
    return e.querySelector(t);
  } catch {
    return null;
  }
}
function A(t, e = document) {
  for (const o of t) {
    const n = j(o, e);
    if (n) return n;
  }
  return null;
}
function B(t, e = {}) {
  const o = e.root ?? document, n = A(t, o);
  return n ? Promise.resolve(n) : new Promise((r) => {
    let i = !1;
    const l = (c) => {
      i || (i = !0, a.disconnect(), clearTimeout(d), r(c));
    }, a = new MutationObserver(() => {
      const c = A(t, o);
      c && l(c);
    });
    a.observe(document.documentElement, {
      childList: !0,
      subtree: !0,
      attributes: !0
    });
    const d = setTimeout(() => l(null), e.timeout ?? 4e3);
  });
}
let v = null;
function S() {
  if (v !== null) return v;
  try {
    v = new URLSearchParams(window.location.search).has("use_logs");
  } catch {
    v = !1;
  }
  return v;
}
function D(t) {
  const e = `[tours:${t}]`;
  return {
    log: (...o) => {
      S() && console.log(e, ...o);
    },
    warn: (...o) => {
      S() && console.warn(e, ...o);
    },
    error: (...o) => {
      S() && console.error(e, ...o);
    }
  };
}
function Q(t, e = {}) {
  const o = D("picker");
  let n = null, r = null, i = null, l = !1;
  function a(u) {
    if (u === n) return !0;
    for (const p of e.ignore ?? [])
      if (p && p.contains(u)) return !0;
    return !1;
  }
  function d() {
    if (n) return;
    n = document.createElement("div"), n.setAttribute("data-tours-picker", ""), r = n.attachShadow({ mode: "open" });
    const u = document.createElement("style");
    u.textContent = O, r.appendChild(u), i = document.createElement("div"), i.className = "tours-picker-overlay", i.style.display = "none", r.appendChild(i);
    const p = document.createElement("div");
    p.className = "tours-picker-hint", p.textContent = "Hover and click an element • Esc to cancel", r.appendChild(p), document.body.appendChild(n);
  }
  function c(u, p) {
    const f = document.elementFromPoint(u, p);
    return !f || a(f) ? null : f;
  }
  function m(u) {
    if (!l || !i) return;
    const p = c(u.clientX, u.clientY);
    if (!p) {
      i.style.display = "none";
      return;
    }
    const f = p.getBoundingClientRect();
    i.style.display = "block", i.style.left = `${f.left}px`, i.style.top = `${f.top}px`, i.style.width = `${f.width}px`, i.style.height = `${f.height}px`;
  }
  function g(u) {
    if (!l) return;
    const p = c(u.clientX, u.clientY);
    if (u.preventDefault(), u.stopPropagation(), !p) return;
    const f = I(p);
    o.log("picked", f), x(), t(f);
  }
  function w(u) {
    u.key === "Escape" && (u.preventDefault(), x());
  }
  function k() {
    l || (l = !0, o.log("start"), d(), document.addEventListener("mousemove", m, !0), document.addEventListener("click", g, !0), document.addEventListener("keydown", w, !0));
  }
  function x() {
    l && (l = !1, document.removeEventListener("mousemove", m, !0), document.removeEventListener("click", g, !0), document.removeEventListener("keydown", w, !0), n && n.parentNode && n.parentNode.removeChild(n), n = null, r = null, i = null);
  }
  return { start: k, stop: x };
}
const q = 6, X = 6, K = 10, W = 12;
function G(t, e, o) {
  const n = {
    top: t.top,
    bottom: o.height - t.bottom,
    left: t.left,
    right: o.width - t.right
  }, r = {
    top: e.height,
    bottom: e.height,
    left: e.width,
    right: e.width
  }, i = ["bottom", "top", "right", "left"], l = i.find((a) => n[a] >= r[a] + 8);
  return l || i.reduce((a, d) => n[d] > n[a] ? d : a, i[0]);
}
function J(t) {
  const { target: e, card: o, offset: n, viewport: r } = t, i = t.side === "auto", l = i ? G(e, o, r) : t.side, a = i ? "center" : t.align, d = t.alignOffset ?? 0, c = a === "start" ? d : a === "end" ? -d : 0;
  let m = 0, g = 0;
  return l === "top" || l === "bottom" ? (m = l === "top" ? e.top - o.height - n : e.bottom + n, g = a === "start" ? e.left : a === "end" ? e.right - o.width : e.left + e.width / 2 - o.width / 2, g += c) : (g = l === "left" ? e.left - o.width - n : e.right + n, m = a === "start" ? e.top : a === "end" ? e.bottom - o.height : e.top + e.height / 2 - o.height / 2, m += c), g = Math.max(8, Math.min(g, r.width - o.width - 8)), m = Math.max(8, Math.min(m, r.height - o.height - 8)), { top: m, left: g };
}
function R(t) {
  const e = document.createElement("button");
  return e.type = "button", e.className = `tours-card__btn${t.primary ? " tours-card__btn--primary" : ""}${t.disabled ? " tours-card__btn--disabled" : ""}`, e.textContent = t.label, !t.disabled && t.onClick && e.addEventListener("click", t.onClick), e;
}
function V(t) {
  const e = document.createElement("div");
  if (e.className = `tours-card${t.ghost ? " tours-card--ghost" : ""}`, t.radius != null && (e.style.borderRadius = `${t.radius}px`), t.showClose) {
    const n = document.createElement("button");
    n.className = "tours-card__close", n.type = "button", n.textContent = "×", n.setAttribute("aria-label", "Close"), t.onClose && n.addEventListener("click", t.onClose), e.appendChild(n);
  }
  const o = document.createElement("div");
  if (o.className = "tours-card__content", t.contentHtml != null ? o.innerHTML = t.contentHtml : o.textContent = t.contentText ?? "", e.appendChild(o), t.back || t.next || t.progress) {
    const n = document.createElement("div");
    if (n.className = "tours-card__footer", t.back && n.appendChild(R(t.back)), t.progress) {
      const r = document.createElement("span");
      r.className = "tours-card__progress", r.textContent = t.progress, n.appendChild(r);
    }
    t.next && n.appendChild(R(t.next)), e.appendChild(n);
  }
  return e;
}
const Z = `
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
function tt(t) {
  const e = D("player");
  let o = null, n = null, r = null, i = null, l = !1, a = 0;
  const d = t.display?.padding ?? q, c = t.display?.radius ?? X, m = t.display?.cardRadius ?? K, g = t.display?.offset ?? W;
  function w(s) {
    return A(s.selectors);
  }
  function k() {
    if (o) return;
    o = document.createElement("div"), o.setAttribute("data-tours-player", ""), n = o.attachShadow({ mode: "open" });
    const s = document.createElement("style");
    s.textContent = U + Z, n.appendChild(s);
    const h = document.createElement("div");
    h.className = "tours-backdrop", n.appendChild(h), r = document.createElement("div"), r.className = "tours-spotlight", r.style.borderRadius = `${c}px`, n.appendChild(r), document.body.appendChild(o);
  }
  function x(s) {
    r && (r.style.display = "block", r.style.left = `${s.left - d}px`, r.style.top = `${s.top - d}px`, r.style.width = `${s.width + d * 2}px`, r.style.height = `${s.height + d * 2}px`);
  }
  function u(s, h) {
    if (!i) return;
    const b = {
      top: s.top - d,
      left: s.left - d,
      right: s.right + d,
      bottom: s.bottom + d,
      width: s.width + d * 2,
      height: s.height + d * 2
    }, { top: $, left: P } = J({
      target: b,
      card: { width: i.offsetWidth, height: i.offsetHeight },
      side: h.placement ?? "bottom",
      align: h.align ?? "center",
      offset: g,
      alignOffset: t.display?.alignOffset ?? 0,
      viewport: { width: window.innerWidth, height: window.innerHeight }
    });
    i.style.left = `${P}px`, i.style.top = `${$}px`;
  }
  function p(s) {
    const h = t.steps.length;
    i && i.remove(), i = V({
      contentText: s.content.default,
      progress: `Step ${a + 1} of ${h}`,
      showClose: !0,
      onClose: y,
      radius: m,
      back: { label: s.backLabel ?? "Back", disabled: a === 0, onClick: _ },
      next: {
        label: s.nextLabel ?? (a === h - 1 ? "Done" : "Next"),
        primary: !0,
        onClick: E
      }
    }), n?.appendChild(i);
  }
  function f() {
    if (!l) return;
    const s = t.steps[a];
    if (!s) {
      y();
      return;
    }
    e.log("render step", a, s.id);
    const h = w(s);
    if (!h) {
      e.log(`step "${s.id}" target not found yet — waiting`, s.selectors), B(s.selectors, { timeout: 4e3 }).then(($) => {
        !l || t.steps[a] !== s || ($ ? f() : (e.warn(`step "${s.id}" skipped: no element for selectors`, s.selectors), a < t.steps.length - 1 ? (a += 1, f()) : y()));
      });
      return;
    }
    k(), h.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" }), p(s);
    const b = h.getBoundingClientRect();
    x(b), u(b, s);
  }
  function N(s) {
    l && (s.key === "Escape" ? (s.preventDefault(), y()) : s.key === "ArrowRight" ? E() : s.key === "ArrowLeft" && _());
  }
  function C() {
    if (!l) return;
    const s = t.steps[a];
    if (!s) return;
    const h = w(s);
    if (!h) return;
    const b = h.getBoundingClientRect();
    x(b), u(b, s);
  }
  function z() {
    l || t.steps.length !== 0 && (l = !0, a = 0, e.log("start", t.id, `${t.steps.length} steps`), k(), window.addEventListener("keydown", N, !0), window.addEventListener("resize", C, !0), window.addEventListener("scroll", C, !0), f());
  }
  function y() {
    l && (l = !1, e.log("stop"), window.removeEventListener("keydown", N, !0), window.removeEventListener("resize", C, !0), window.removeEventListener("scroll", C, !0), o && o.parentNode && o.parentNode.removeChild(o), o = null, n = null, r = null, i = null);
  }
  function E() {
    if (l) {
      if (a >= t.steps.length - 1) {
        y();
        return;
      }
      a += 1, f();
    }
  }
  function _() {
    l && (a <= 0 || (a -= 1, f()));
  }
  return { start: z, stop: y, next: E, prev: _ };
}
export {
  Z as CARD_STYLES,
  G as autoSide,
  I as buildSelectors,
  D as createLogger,
  Q as createPicker,
  tt as createPlayer,
  S as isLoggingEnabled,
  J as placeCard,
  V as renderCard,
  A as resolveElement,
  B as waitForElement
};
