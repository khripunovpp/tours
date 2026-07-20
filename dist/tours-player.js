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
`, O = `
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
let _ = null;
function z() {
  if (_ !== null) return _;
  try {
    _ = new URLSearchParams(window.location.search).has("use_logs");
  } catch {
    _ = !1;
  }
  return _;
}
function B(r) {
  const o = `[tours:${r}]`;
  return {
    log: (...t) => {
      z() && console.log(o, ...t);
    },
    warn: (...t) => {
      z() && console.warn(o, ...t);
    },
    error: (...t) => {
      z() && console.error(o, ...t);
    }
  };
}
function Y(r) {
  if (r.id)
    return `#${CSS.escape(r.id)}`;
  const o = [];
  let t = r;
  for (; t && t !== document.body && t.nodeType === 1; ) {
    const i = t.tagName.toLowerCase(), d = t.parentElement;
    if (!d) {
      o.unshift(i);
      break;
    }
    const e = Array.from(d.children).filter(
      (s) => s.tagName === t.tagName
    );
    if (e.length > 1) {
      const s = e.indexOf(t) + 1;
      o.unshift(`${i}:nth-of-type(${s})`);
    } else
      o.unshift(i);
    t = d;
  }
  return `body > ${o.join(" > ")}`;
}
function G(r, o = {}) {
  const t = B("picker");
  let i = null, d = null, e = null, s = !1;
  function l(a) {
    if (a === i) return !0;
    for (const f of o.ignore ?? [])
      if (f && f.contains(a)) return !0;
    return !1;
  }
  function c() {
    if (i) return;
    i = document.createElement("div"), i.setAttribute("data-tours-picker", ""), d = i.attachShadow({ mode: "open" });
    const a = document.createElement("style");
    a.textContent = M, d.appendChild(a), e = document.createElement("div"), e.className = "tours-picker-overlay", e.style.display = "none", d.appendChild(e);
    const f = document.createElement("div");
    f.className = "tours-picker-hint", f.textContent = "Hover and click an element • Esc to cancel", d.appendChild(f), document.body.appendChild(i);
  }
  function b(a, f) {
    const h = document.elementFromPoint(a, f);
    return !h || l(h) ? null : h;
  }
  function g(a) {
    if (!s || !e) return;
    const f = b(a.clientX, a.clientY);
    if (!f) {
      e.style.display = "none";
      return;
    }
    const h = f.getBoundingClientRect();
    e.style.display = "block", e.style.left = `${h.left}px`, e.style.top = `${h.top}px`, e.style.width = `${h.width}px`, e.style.height = `${h.height}px`;
  }
  function m(a) {
    if (!s) return;
    const f = b(a.clientX, a.clientY);
    if (a.preventDefault(), a.stopPropagation(), !f) return;
    const h = Y(f);
    t.log("picked", h), x(), r([h]);
  }
  function k(a) {
    a.key === "Escape" && (a.preventDefault(), x());
  }
  function N() {
    s || (s = !0, t.log("start"), c(), document.addEventListener("mousemove", g, !0), document.addEventListener("click", m, !0), document.addEventListener("keydown", k, !0));
  }
  function x() {
    s && (s = !1, document.removeEventListener("mousemove", g, !0), document.removeEventListener("click", m, !0), document.removeEventListener("keydown", k, !0), i && i.parentNode && i.parentNode.removeChild(i), i = null, d = null, e = null);
  }
  return { start: N, stop: x };
}
const H = 6, K = 6, X = 10, j = 12;
function W(r, o, t) {
  const i = {
    top: r.top,
    bottom: t.height - r.bottom,
    left: r.left,
    right: t.width - r.right
  }, d = {
    top: o.height,
    bottom: o.height,
    left: o.width,
    right: o.width
  }, e = ["bottom", "top", "right", "left"], s = e.find((l) => i[l] >= d[l] + 8);
  return s || e.reduce((l, c) => i[c] > i[l] ? c : l, e[0]);
}
function q(r) {
  const { target: o, card: t, offset: i, viewport: d } = r, e = r.side === "auto", s = e ? W(o, t, d) : r.side, l = e ? "center" : r.align, c = r.alignOffset ?? 0, b = l === "start" ? c : l === "end" ? -c : 0;
  let g = 0, m = 0;
  return s === "top" || s === "bottom" ? (g = s === "top" ? o.top - t.height - i : o.bottom + i, m = l === "start" ? o.left : l === "end" ? o.right - t.width : o.left + o.width / 2 - t.width / 2, m += b) : (m = s === "left" ? o.left - t.width - i : o.right + i, g = l === "start" ? o.top : l === "end" ? o.bottom - t.height : o.top + o.height / 2 - t.height / 2, g += b), m = Math.max(8, Math.min(m, d.width - t.width - 8)), g = Math.max(8, Math.min(g, d.height - t.height - 8)), { top: g, left: m };
}
function V(r) {
  var T, U, F, P;
  const o = B("player");
  let t = null, i = null, d = null, e = null, s = !1, l = 0;
  const c = ((T = r.display) == null ? void 0 : T.padding) ?? H, b = ((U = r.display) == null ? void 0 : U.radius) ?? K, g = ((F = r.display) == null ? void 0 : F.cardRadius) ?? X, m = ((P = r.display) == null ? void 0 : P.offset) ?? j;
  function k(n) {
    for (const p of n.selectors)
      try {
        const u = document.querySelector(p);
        if (u) return u;
      } catch {
      }
    return null;
  }
  function N() {
    if (t) return;
    t = document.createElement("div"), t.setAttribute("data-tours-player", ""), i = t.attachShadow({ mode: "open" });
    const n = document.createElement("style");
    n.textContent = O, i.appendChild(n);
    const p = document.createElement("div");
    p.className = "tours-backdrop", i.appendChild(p), d = document.createElement("div"), d.className = "tours-spotlight", d.style.borderRadius = `${b}px`, i.appendChild(d), e = document.createElement("div"), e.className = "tours-tooltip", e.style.borderRadius = `${g}px`, i.appendChild(e), document.body.appendChild(t);
  }
  function x(n) {
    d && (d.style.display = "block", d.style.left = `${n.left - c}px`, d.style.top = `${n.top - c}px`, d.style.width = `${n.width + c * 2}px`, d.style.height = `${n.height + c * 2}px`);
  }
  function a(n, p) {
    var v;
    if (!e) return;
    const u = {
      top: n.top - c,
      left: n.left - c,
      right: n.right + c,
      bottom: n.bottom + c,
      width: n.width + c * 2,
      height: n.height + c * 2
    }, { top: C, left: w } = q({
      target: u,
      card: { width: e.offsetWidth, height: e.offsetHeight },
      side: p.placement ?? "bottom",
      align: p.align ?? "center",
      offset: m,
      alignOffset: ((v = r.display) == null ? void 0 : v.alignOffset) ?? 0,
      viewport: { width: window.innerWidth, height: window.innerHeight }
    });
    e.style.left = `${w}px`, e.style.top = `${C}px`;
  }
  function f(n) {
    if (!e) return;
    const p = r.steps.length;
    e.textContent = "";
    const u = document.createElement("button");
    u.className = "tours-close", u.type = "button", u.textContent = "×", u.setAttribute("aria-label", "Close"), u.addEventListener("click", y), e.appendChild(u);
    const C = document.createElement("p");
    C.className = "tours-tooltip__content", C.textContent = n.content.default, e.appendChild(C);
    const w = document.createElement("div");
    w.className = "tours-tooltip__footer";
    const v = document.createElement("span");
    v.className = "tours-tooltip__progress", v.textContent = `Step ${l + 1} of ${p}`, w.appendChild(v);
    const S = document.createElement("div");
    S.className = "tours-tooltip__buttons";
    const E = document.createElement("button");
    E.className = "tours-btn", E.type = "button", E.textContent = "Back", E.disabled = l === 0, E.addEventListener("click", R), S.appendChild(E);
    const L = document.createElement("button");
    L.className = "tours-btn tours-btn--primary", L.type = "button", L.textContent = l === p - 1 ? "Done" : "Next", L.addEventListener("click", A), S.appendChild(L), w.appendChild(S), e.appendChild(w);
  }
  function h() {
    if (!s) return;
    const n = r.steps[l];
    if (!n) {
      y();
      return;
    }
    o.log("render step", l, n.id);
    const p = k(n);
    if (!p) {
      o.warn(`step "${n.id}" skipped: no element for selectors`, n.selectors), l < r.steps.length - 1 ? (l += 1, h()) : y();
      return;
    }
    N(), p.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" }), f(n);
    const u = p.getBoundingClientRect();
    x(u), a(u, n);
  }
  function D(n) {
    s && (n.key === "Escape" ? (n.preventDefault(), y()) : n.key === "ArrowRight" ? A() : n.key === "ArrowLeft" && R());
  }
  function $() {
    if (!s) return;
    const n = r.steps[l];
    if (!n) return;
    const p = k(n);
    if (!p) return;
    const u = p.getBoundingClientRect();
    x(u), a(u, n);
  }
  function I() {
    s || r.steps.length !== 0 && (s = !0, l = 0, o.log("start", r.id, `${r.steps.length} steps`), N(), window.addEventListener("keydown", D, !0), window.addEventListener("resize", $, !0), window.addEventListener("scroll", $, !0), h());
  }
  function y() {
    s && (s = !1, o.log("stop"), window.removeEventListener("keydown", D, !0), window.removeEventListener("resize", $, !0), window.removeEventListener("scroll", $, !0), t && t.parentNode && t.parentNode.removeChild(t), t = null, i = null, d = null, e = null);
  }
  function A() {
    if (s) {
      if (l >= r.steps.length - 1) {
        y();
        return;
      }
      l += 1, h();
    }
  }
  function R() {
    s && (l <= 0 || (l -= 1, h()));
  }
  return { start: I, stop: y, next: A, prev: R };
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
