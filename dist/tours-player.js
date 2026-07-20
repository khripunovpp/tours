const M = `
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
`, Y = `
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
.tours-tooltip {
  position: fixed;
  z-index: 2147483001;
  box-sizing: border-box;
  max-width: 320px;
  min-width: 220px;
  padding: 16px;
  font: 14px/1.5 system-ui, sans-serif;
  color: #111827;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
}
.tours-tooltip__content {
  margin: 0 0 14px;
  white-space: pre-wrap;
}
.tours-tooltip__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.tours-tooltip__progress {
  font-size: 12px;
  color: #6b7280;
}
.tours-tooltip__buttons {
  display: flex;
  gap: 8px;
}
.tours-btn {
  box-sizing: border-box;
  padding: 6px 12px;
  font: inherit;
  font-size: 13px;
  line-height: 1;
  color: #111827;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  cursor: pointer;
}
.tours-btn:hover {
  background: #e5e7eb;
}
.tours-btn--primary {
  color: #fff;
  background: #2563eb;
  border-color: #2563eb;
}
.tours-btn--primary:hover {
  background: #1d4ed8;
}
.tours-btn:disabled {
  opacity: 0.5;
  cursor: default;
}
.tours-close {
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
.tours-close:hover {
  background: #f3f4f6;
  color: #111827;
}
`;
let E = null;
function z() {
  if (E !== null) return E;
  try {
    E = new URLSearchParams(window.location.search).has("use_logs");
  } catch {
    E = !1;
  }
  return E;
}
function B(r) {
  const n = `[tours:${r}]`;
  return {
    log: (...t) => {
      z() && console.log(n, ...t);
    },
    warn: (...t) => {
      z() && console.warn(n, ...t);
    },
    error: (...t) => {
      z() && console.error(n, ...t);
    }
  };
}
function H(r) {
  if (r.id)
    return `#${CSS.escape(r.id)}`;
  const n = [];
  let t = r;
  for (; t && t !== document.body && t.nodeType === 1; ) {
    const o = t.tagName.toLowerCase(), l = t.parentElement;
    if (!l) {
      n.unshift(o);
      break;
    }
    const e = Array.from(l.children).filter(
      (s) => s.tagName === t.tagName
    );
    if (e.length > 1) {
      const s = e.indexOf(t) + 1;
      n.unshift(`${o}:nth-of-type(${s})`);
    } else
      n.unshift(o);
    t = l;
  }
  return `body > ${n.join(" > ")}`;
}
function G(r, n = {}) {
  const t = B("picker");
  let o = null, l = null, e = null, s = !1;
  function d(a) {
    if (a === o) return !0;
    for (const p of n.ignore ?? [])
      if (p && p.contains(a)) return !0;
    return !1;
  }
  function h() {
    if (o) return;
    o = document.createElement("div"), o.setAttribute("data-tours-picker", ""), l = o.attachShadow({ mode: "open" });
    const a = document.createElement("style");
    a.textContent = M, l.appendChild(a), e = document.createElement("div"), e.className = "tours-picker-overlay", e.style.display = "none", l.appendChild(e);
    const p = document.createElement("div");
    p.className = "tours-picker-hint", p.textContent = "Hover and click an element • Esc to cancel", l.appendChild(p), document.body.appendChild(o);
  }
  function m(a, p) {
    const f = document.elementFromPoint(a, p);
    return !f || d(f) ? null : f;
  }
  function k(a) {
    if (!s || !e) return;
    const p = m(a.clientX, a.clientY);
    if (!p) {
      e.style.display = "none";
      return;
    }
    const f = p.getBoundingClientRect();
    e.style.display = "block", e.style.left = `${f.left}px`, e.style.top = `${f.top}px`, e.style.width = `${f.width}px`, e.style.height = `${f.height}px`;
  }
  function C(a) {
    if (!s) return;
    const p = m(a.clientX, a.clientY);
    if (a.preventDefault(), a.stopPropagation(), !p) return;
    const f = H(p);
    t.log("picked", f), g(), r([f]);
  }
  function y(a) {
    a.key === "Escape" && (a.preventDefault(), g());
  }
  function L() {
    s || (s = !0, t.log("start"), h(), document.addEventListener("mousemove", k, !0), document.addEventListener("click", C, !0), document.addEventListener("keydown", y, !0));
  }
  function g() {
    s && (s = !1, document.removeEventListener("mousemove", k, !0), document.removeEventListener("click", C, !0), document.removeEventListener("keydown", y, !0), o && o.parentNode && o.parentNode.removeChild(o), o = null, l = null, e = null);
  }
  return { start: L, stop: g };
}
const K = 6, X = 6, j = 10, O = 12;
function W(r, n, t) {
  const o = {
    top: r.top,
    bottom: t.height - r.bottom,
    left: r.left,
    right: t.width - r.right
  }, l = {
    top: n.height,
    bottom: n.height,
    left: n.width,
    right: n.width
  }, e = ["bottom", "top", "right", "left"], s = e.find((d) => o[d] >= l[d] + 8);
  return s || e.reduce((d, h) => o[h] > o[d] ? h : d, e[0]);
}
function q(r) {
  const { target: n, card: t, offset: o, viewport: l } = r, e = r.side === "auto", s = e ? W(n, t, l) : r.side, d = e ? "center" : r.align;
  let h = 0, m = 0;
  return s === "top" || s === "bottom" ? (h = s === "top" ? n.top - t.height - o : n.bottom + o, m = d === "start" ? n.left : d === "end" ? n.right - t.width : n.left + n.width / 2 - t.width / 2) : (m = s === "left" ? n.left - t.width - o : n.right + o, h = d === "start" ? n.top : d === "end" ? n.bottom - t.height : n.top + n.height / 2 - t.height / 2), m = Math.max(8, Math.min(m, l.width - t.width - 8)), h = Math.max(8, Math.min(h, l.height - t.height - 8)), { top: h, left: m };
}
function V(r) {
  var T, U, F, P;
  const n = B("player");
  let t = null, o = null, l = null, e = null, s = !1, d = 0;
  const h = ((T = r.display) == null ? void 0 : T.padding) ?? K, m = ((U = r.display) == null ? void 0 : U.radius) ?? X, k = ((F = r.display) == null ? void 0 : F.cardRadius) ?? j, C = ((P = r.display) == null ? void 0 : P.offset) ?? O;
  function y(i) {
    for (const c of i.selectors)
      try {
        const u = document.querySelector(c);
        if (u) return u;
      } catch {
      }
    return null;
  }
  function L() {
    if (t) return;
    t = document.createElement("div"), t.setAttribute("data-tours-player", ""), o = t.attachShadow({ mode: "open" });
    const i = document.createElement("style");
    i.textContent = Y, o.appendChild(i);
    const c = document.createElement("div");
    c.className = "tours-backdrop", o.appendChild(c), l = document.createElement("div"), l.className = "tours-spotlight", l.style.borderRadius = `${m}px`, o.appendChild(l), e = document.createElement("div"), e.className = "tours-tooltip", e.style.borderRadius = `${k}px`, o.appendChild(e), document.body.appendChild(t);
  }
  function g(i) {
    l && (l.style.display = "block", l.style.left = `${i.left - h}px`, l.style.top = `${i.top - h}px`, l.style.width = `${i.width + h * 2}px`, l.style.height = `${i.height + h * 2}px`);
  }
  function a(i, c) {
    if (!e) return;
    const { top: u, left: w } = q({
      target: i,
      card: { width: e.offsetWidth, height: e.offsetHeight },
      side: c.placement ?? "bottom",
      align: c.align ?? "center",
      offset: C,
      viewport: { width: window.innerWidth, height: window.innerHeight }
    });
    e.style.left = `${w}px`, e.style.top = `${u}px`;
  }
  function p(i) {
    if (!e) return;
    const c = r.steps.length;
    e.textContent = "";
    const u = document.createElement("button");
    u.className = "tours-close", u.type = "button", u.textContent = "×", u.setAttribute("aria-label", "Close"), u.addEventListener("click", b), e.appendChild(u);
    const w = document.createElement("p");
    w.className = "tours-tooltip__content", w.textContent = i.content.default, e.appendChild(w);
    const N = document.createElement("div");
    N.className = "tours-tooltip__footer";
    const R = document.createElement("span");
    R.className = "tours-tooltip__progress", R.textContent = `Step ${d + 1} of ${c}`, N.appendChild(R);
    const $ = document.createElement("div");
    $.className = "tours-tooltip__buttons";
    const x = document.createElement("button");
    x.className = "tours-btn", x.type = "button", x.textContent = "Back", x.disabled = d === 0, x.addEventListener("click", A), $.appendChild(x);
    const v = document.createElement("button");
    v.className = "tours-btn tours-btn--primary", v.type = "button", v.textContent = d === c - 1 ? "Done" : "Next", v.addEventListener("click", S), $.appendChild(v), N.appendChild($), e.appendChild(N);
  }
  function f() {
    if (!s) return;
    const i = r.steps[d];
    if (!i) {
      b();
      return;
    }
    n.log("render step", d, i.id);
    const c = y(i);
    if (!c) {
      n.warn(`step "${i.id}" skipped: no element for selectors`, i.selectors), d < r.steps.length - 1 ? (d += 1, f()) : b();
      return;
    }
    L(), c.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" }), p(i);
    const u = c.getBoundingClientRect();
    g(u), a(u, i);
  }
  function D(i) {
    s && (i.key === "Escape" ? (i.preventDefault(), b()) : i.key === "ArrowRight" ? S() : i.key === "ArrowLeft" && A());
  }
  function _() {
    if (!s) return;
    const i = r.steps[d];
    if (!i) return;
    const c = y(i);
    if (!c) return;
    const u = c.getBoundingClientRect();
    g(u), a(u, i);
  }
  function I() {
    s || r.steps.length !== 0 && (s = !0, d = 0, n.log("start", r.id, `${r.steps.length} steps`), L(), window.addEventListener("keydown", D, !0), window.addEventListener("resize", _, !0), window.addEventListener("scroll", _, !0), f());
  }
  function b() {
    s && (s = !1, n.log("stop"), window.removeEventListener("keydown", D, !0), window.removeEventListener("resize", _, !0), window.removeEventListener("scroll", _, !0), t && t.parentNode && t.parentNode.removeChild(t), t = null, o = null, l = null, e = null);
  }
  function S() {
    if (s) {
      if (d >= r.steps.length - 1) {
        b();
        return;
      }
      d += 1, f();
    }
  }
  function A() {
    s && (d <= 0 || (d -= 1, f()));
  }
  return { start: I, stop: b, next: S, prev: A };
}
export {
  W as autoSide,
  B as createLogger,
  G as createPicker,
  V as createPlayer,
  z as isLoggingEnabled,
  q as placeCard
};
//# sourceMappingURL=tours-player.js.map
