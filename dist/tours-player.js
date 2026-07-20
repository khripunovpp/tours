const J = `
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
`, V = `
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
function W(t) {
  return /^[a-zA-Z][\w-]*$/.test(t) && t.length <= 30 && !/\d{2,}/.test(t) && !/^(css-|sc-|jsx-|emotion-|_|is-|has-)/.test(t);
}
function O(t) {
  const e = [];
  let r = t;
  for (; r && r !== document.body && r.nodeType === 1; ) {
    const n = r.tagName.toLowerCase(), i = r.parentElement;
    if (!i) {
      e.unshift(n);
      break;
    }
    const a = Array.from(i.children).filter((l) => l.tagName === r.tagName);
    e.unshift(a.length > 1 ? `${n}:nth-of-type(${a.indexOf(r) + 1})` : n), r = i;
  }
  return `body > ${e.join(" > ")}`;
}
function Z(t) {
  let e = t.parentElement;
  for (; e && e !== document.body && !e.id; )
    e = e.parentElement;
  if (!e || !e.id) return null;
  const r = [];
  let n = t;
  for (; n && n !== e; ) {
    const i = n.tagName.toLowerCase(), a = n.parentElement;
    if (!a) return null;
    const l = Array.from(a.children).filter((c) => c.tagName === n.tagName);
    r.unshift(l.length > 1 ? `${i}:nth-of-type(${l.indexOf(n) + 1})` : i), n = a;
  }
  return `#${CSS.escape(e.id)} > ${r.join(" > ")}`;
}
const Q = ["data-testid", "data-test", "data-test-id", "data-cy", "data-qa", "data-id", "data-name"];
function tt(t) {
  const e = [], r = /* @__PURE__ */ new Set(), n = t.tagName.toLowerCase(), i = (s) => {
    if (!(!s || r.has(s)))
      try {
        document.querySelector(s) === t && (r.add(s), e.push(s));
      } catch {
      }
  };
  t.id && i(`#${CSS.escape(t.id)}`);
  for (const s of Q) {
    const u = t.getAttribute(s);
    u && i(`${n}[${s}=${L(u)}]`);
  }
  const a = t.getAttribute("name");
  a && i(`${n}[name=${L(a)}]`);
  const l = t.getAttribute("aria-label");
  l && i(`[aria-label=${L(l)}]`);
  const c = Array.from(t.classList).filter(W);
  c.length && i(`${n}.${c.map((s) => CSS.escape(s)).join(".")}`);
  for (const s of c) i(`${n}.${CSS.escape(s)}`);
  i(Z(t)), i(O(t));
  const d = (t.textContent ?? "").replace(/\s+/g, " ").trim();
  if (d && d.length <= 50 && /^(a|button|summary|label|h[1-6])$/.test(n)) {
    const s = `text=${d}`;
    r.has(s) || (r.add(s), e.push(s));
  }
  return e.length === 0 && e.push(O(t)), e;
}
const et = "a, button, summary, label, h1, h2, h3, h4, h5, h6";
function nt(t, e) {
  if (t.startsWith("text=")) {
    const r = t.slice(5).trim();
    for (const n of Array.from(e.querySelectorAll(et)))
      if ((n.textContent ?? "").replace(/\s+/g, " ").trim() === r) return n;
    return null;
  }
  try {
    return e.querySelector(t);
  } catch {
    return null;
  }
}
function N(t, e = document) {
  for (const r of t) {
    const n = nt(r, e);
    if (n) return n;
  }
  return null;
}
function rt(t, e = {}) {
  const r = e.root ?? document, n = N(t, r);
  return n ? Promise.resolve(n) : new Promise((i) => {
    let a = !1;
    const l = (s) => {
      a || (a = !0, c.disconnect(), clearTimeout(d), i(s));
    }, c = new MutationObserver(() => {
      const s = N(t, r);
      s && l(s);
    });
    c.observe(document.documentElement, {
      childList: !0,
      subtree: !0,
      attributes: !0
    });
    const d = setTimeout(() => l(null), e.timeout ?? 4e3);
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
function H(t) {
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
function xt(t, e = {}) {
  const r = H("picker");
  let n = null, i = null, a = null, l = !1;
  function c(f) {
    if (f === n) return !0;
    for (const h of e.ignore ?? [])
      if (h && h.contains(f)) return !0;
    return !1;
  }
  function d() {
    if (n) return;
    n = document.createElement("div"), n.setAttribute("data-tours-picker", ""), i = n.attachShadow({ mode: "open" });
    const f = document.createElement("style");
    f.textContent = J, i.appendChild(f), a = document.createElement("div"), a.className = "tours-picker-overlay", a.style.display = "none", i.appendChild(a);
    const h = document.createElement("div");
    h.className = "tours-picker-hint", h.textContent = "Hover and click an element • Esc to cancel", i.appendChild(h), document.body.appendChild(n);
  }
  function s(f, h) {
    const m = document.elementFromPoint(f, h);
    return !m || c(m) ? null : m;
  }
  function u(f) {
    if (!l || !a) return;
    const h = s(f.clientX, f.clientY);
    if (!h) {
      a.style.display = "none";
      return;
    }
    const m = h.getBoundingClientRect();
    a.style.display = "block", a.style.left = `${m.left}px`, a.style.top = `${m.top}px`, a.style.width = `${m.width}px`, a.style.height = `${m.height}px`;
  }
  function p(f) {
    if (!l) return;
    const h = s(f.clientX, f.clientY);
    if (f.preventDefault(), f.stopPropagation(), !h) return;
    const m = tt(h);
    r.log("picked", m), y(), t(m);
  }
  function E(f) {
    f.key === "Escape" && (f.preventDefault(), y());
  }
  function k() {
    l || (l = !0, r.log("start"), d(), document.addEventListener("mousemove", u, !0), document.addEventListener("click", p, !0), document.addEventListener("keydown", E, !0));
  }
  function y() {
    l && (l = !1, document.removeEventListener("mousemove", u, !0), document.removeEventListener("click", p, !0), document.removeEventListener("keydown", E, !0), n && n.parentNode && n.parentNode.removeChild(n), n = null, i = null, a = null);
  }
  return { start: k, stop: y };
}
const ot = 6, it = 6, st = 10, at = 12;
function lt(t, e, r) {
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
  }, a = ["bottom", "top", "right", "left"], l = a.find((c) => n[c] >= i[c] + 8);
  return l || a.reduce((c, d) => n[d] > n[c] ? d : c, a[0]);
}
function ct(t) {
  const { target: e, card: r, offset: n, viewport: i } = t, a = t.side === "auto", l = a ? lt(e, r, i) : t.side, c = a ? "center" : t.align, d = t.alignOffset ?? 0, s = c === "start" ? d : c === "end" ? -d : 0;
  let u = 0, p = 0;
  return l === "top" || l === "bottom" ? (u = l === "top" ? e.top - r.height - n : e.bottom + n, p = c === "start" ? e.left : c === "end" ? e.right - r.width : e.left + e.width / 2 - r.width / 2, p += s) : (p = l === "left" ? e.left - r.width - n : e.right + n, u = c === "start" ? e.top : c === "end" ? e.bottom - r.height : e.top + e.height / 2 - r.height / 2, u += s), p = Math.max(8, Math.min(p, i.width - r.width - 8)), u = Math.max(8, Math.min(u, i.height - r.height - 8)), { top: u, left: p };
}
function F(t) {
  const e = document.createElement("button");
  return e.type = "button", e.className = `tours-card__btn${t.primary ? " tours-card__btn--primary" : ""}${t.disabled ? " tours-card__btn--disabled" : ""}`, e.textContent = t.label, !t.disabled && t.onClick && e.addEventListener("click", t.onClick), e;
}
function dt(t) {
  const e = document.createElement("div");
  if (e.className = `tours-card${t.ghost ? " tours-card--ghost" : ""}`, t.radius != null && (e.style.borderRadius = `${t.radius}px`), t.showClose) {
    const n = document.createElement("button");
    n.className = "tours-card__close", n.type = "button", n.textContent = "×", n.setAttribute("aria-label", "Close"), t.onClose && n.addEventListener("click", t.onClose), e.appendChild(n);
  }
  const r = document.createElement("div");
  if (r.className = "tours-card__content", t.contentHtml != null ? r.innerHTML = t.contentHtml : r.textContent = t.contentText ?? "", e.appendChild(r), t.back || t.next || t.progress) {
    const n = document.createElement("div");
    if (n.className = "tours-card__footer", t.back && n.appendChild(F(t.back)), t.progress) {
      const i = document.createElement("span");
      i.className = "tours-card__progress", i.textContent = t.progress, n.appendChild(i);
    }
    t.next && n.appendChild(F(t.next)), e.appendChild(n);
  }
  return e;
}
const ut = `
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
function ft(t) {
  const e = t.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*\*/g, "\0").replace(/\*/g, "[^/]*").replace(/ /g, ".*").replace(/\?/g, ".");
  return new RegExp(`^${e}$`);
}
function Y(t, e) {
  if (!t) return !0;
  if (t.regex)
    try {
      return new RegExp(t.regex).test(e);
    } catch {
      return !1;
    }
  if (t.glob)
    try {
      return ft(t.glob).test(e);
    } catch {
      return !1;
    }
  return !0;
}
const T = "tours:locationchange";
let M = !1;
function pt() {
  if (!M) {
    M = !0;
    for (const t of ["pushState", "replaceState"]) {
      const e = history[t];
      history[t] = function(...n) {
        const i = e.apply(this, n);
        return window.dispatchEvent(new Event(T)), i;
      };
    }
  }
}
function ht(t) {
  return pt(), window.addEventListener("popstate", t), window.addEventListener("hashchange", t), window.addEventListener(T, t), () => {
    window.removeEventListener("popstate", t), window.removeEventListener("hashchange", t), window.removeEventListener(T, t);
  };
}
const R = "tours:progress";
function wt() {
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
function gt(t) {
  const e = t.get(R);
  if (!e) return null;
  try {
    const r = JSON.parse(e);
    if (typeof r?.tourId == "string" && typeof r?.index == "number") return r;
  } catch {
  }
  return null;
}
function mt(t, e) {
  t.set(R, JSON.stringify(e));
}
function j(t) {
  t.remove(R);
}
function bt(t, e = {}) {
  const r = H("player"), n = e.state;
  let i = null, a = null, l = null, c = null, d = !1, s = 0, u = null;
  const p = t.display?.padding ?? ot, E = t.display?.radius ?? it, k = t.display?.cardRadius ?? st, y = t.display?.offset ?? at;
  function f(o) {
    return N(o.selectors);
  }
  function h(o) {
    return Y(o.pageUrl, window.location.href);
  }
  function m() {
    n && mt(n, { tourId: t.id, index: s });
  }
  function P() {
    if (i) return;
    i = document.createElement("div"), i.setAttribute("data-tours-player", ""), a = i.attachShadow({ mode: "open" });
    const o = document.createElement("style");
    o.textContent = V + ut, a.appendChild(o);
    const g = document.createElement("div");
    g.className = "tours-backdrop", a.appendChild(g), l = document.createElement("div"), l.className = "tours-spotlight", l.style.borderRadius = `${E}px`, a.appendChild(l), document.body.appendChild(i);
  }
  function D(o) {
    l && (l.style.display = "block", l.style.left = `${o.left - p}px`, l.style.top = `${o.top - p}px`, l.style.width = `${o.width + p * 2}px`, l.style.height = `${o.height + p * 2}px`);
  }
  function z(o, g) {
    if (!c) return;
    const b = {
      top: o.top - p,
      left: o.left - p,
      right: o.right + p,
      bottom: o.bottom + p,
      width: o.width + p * 2,
      height: o.height + p * 2
    }, { top: S, left: G } = ct({
      target: b,
      card: { width: c.offsetWidth, height: c.offsetHeight },
      side: g.placement ?? "bottom",
      align: g.align ?? "center",
      offset: y,
      alignOffset: t.display?.alignOffset ?? 0,
      viewport: { width: window.innerWidth, height: window.innerHeight }
    });
    c.style.left = `${G}px`, c.style.top = `${S}px`;
  }
  function B(o) {
    const g = t.steps.length;
    c && c.remove(), c = dt({
      contentText: o.content.default,
      progress: `Step ${s + 1} of ${g}`,
      showClose: !0,
      onClose: w,
      radius: k,
      back: { label: o.backLabel ?? "Back", disabled: s === 0, onClick: $ },
      next: {
        label: o.nextLabel ?? (s === g - 1 ? "Done" : "Next"),
        primary: !0,
        onClick: _
      }
    }), a?.appendChild(c);
  }
  function x() {
    if (!d) return;
    const o = t.steps[s];
    if (!o) {
      w();
      return;
    }
    r.log("render step", s, o.id);
    const g = f(o);
    if (!g) {
      r.log(`step "${o.id}" target not found yet — waiting`, o.selectors), rt(o.selectors, { timeout: 4e3 }).then((S) => {
        !d || t.steps[s] !== o || (S ? x() : (r.warn(`step "${o.id}" skipped: no element for selectors`, o.selectors), s < t.steps.length - 1 ? (s += 1, x()) : w()));
      });
      return;
    }
    P(), g.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" }), B(o);
    const b = g.getBoundingClientRect();
    D(b), z(b, o);
  }
  function U(o) {
    d && (o.key === "Escape" ? (o.preventDefault(), w()) : o.key === "ArrowRight" ? _() : o.key === "ArrowLeft" && $());
  }
  function C() {
    if (!d) return;
    const o = t.steps[s];
    if (!o) return;
    const g = f(o);
    if (!g) return;
    const b = g.getBoundingClientRect();
    D(b), z(b, o);
  }
  function q(o = 0) {
    d || t.steps.length !== 0 && (d = !0, s = Math.max(0, Math.min(o, t.steps.length - 1)), r.log("start", t.id, `at ${s}/${t.steps.length}`), P(), window.addEventListener("keydown", U, !0), window.addEventListener("resize", C, !0), window.addEventListener("scroll", C, !0), m(), x());
  }
  function K() {
    l && (l.style.display = "none"), c && (c.remove(), c = null);
  }
  function X() {
    K(), !u && (u = ht(() => {
      if (!d) {
        u?.(), u = null;
        return;
      }
      const o = t.steps[s];
      o && h(o) && (u?.(), u = null, x());
    }));
  }
  function I() {
    u && (u(), u = null), d && (d = !1, window.removeEventListener("keydown", U, !0), window.removeEventListener("resize", C, !0), window.removeEventListener("scroll", C, !0), i && i.parentNode && i.parentNode.removeChild(i), i = null, a = null, l = null, c = null);
  }
  function w() {
    r.log("stop"), I(), n && j(n);
  }
  function _() {
    if (!d) return;
    const o = s + 1, g = t.steps[o];
    if (!g) {
      w();
      return;
    }
    if (h(g)) {
      s = o, m(), x();
      return;
    }
    s = o, m();
    const b = t.steps[s - 1]?.action;
    if (b && b.type === "navigate" && b.url) {
      r.log("page transition (navigate) → resume at", s), I(), window.location.assign(b.url);
      return;
    }
    r.log("page transition (wait) → resume at", s), X();
  }
  function $() {
    if (!d) return;
    const o = t.steps[s - 1];
    !o || !h(o) || (s -= 1, m(), x());
  }
  return { start: q, stop: w, next: _, prev: $ };
}
function yt(t, e = {}) {
  const r = e.state;
  if (!r) return null;
  const n = gt(r);
  if (!n || n.tourId !== t.id) return null;
  const i = t.steps[n.index];
  if (!i)
    return j(r), null;
  if (!Y(i.pageUrl, window.location.href)) return null;
  const a = bt(t, { state: r });
  return a.start(n.index), a;
}
export {
  ut as CARD_STYLES,
  R as PROGRESS_KEY,
  lt as autoSide,
  tt as buildSelectors,
  j as clearProgress,
  wt as createLocalState,
  H as createLogger,
  xt as createPicker,
  bt as createPlayer,
  A as isLoggingEnabled,
  Y as matchUrl,
  ct as placeCard,
  gt as readProgress,
  dt as renderCard,
  N as resolveElement,
  yt as resumeTour,
  rt as waitForElement,
  mt as writeProgress
};
