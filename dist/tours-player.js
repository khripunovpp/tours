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
let L = null;
function z() {
  if (L !== null) return L;
  try {
    L = new URLSearchParams(window.location.search).has("use_logs");
  } catch {
    L = !1;
  }
  return L;
}
function B(o) {
  const n = `[tours:${o}]`;
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
function Y(o) {
  if (o.id)
    return `#${CSS.escape(o.id)}`;
  const n = [];
  let t = o;
  for (; t && t !== document.body && t.nodeType === 1; ) {
    const r = t.tagName.toLowerCase(), a = t.parentElement;
    if (!a) {
      n.unshift(r);
      break;
    }
    const e = Array.from(a.children).filter(
      (s) => s.tagName === t.tagName
    );
    if (e.length > 1) {
      const s = e.indexOf(t) + 1;
      n.unshift(`${r}:nth-of-type(${s})`);
    } else
      n.unshift(r);
    t = a;
  }
  return `body > ${n.join(" > ")}`;
}
function G(o, n = {}) {
  const t = B("picker");
  let r = null, a = null, e = null, s = !1;
  function l(d) {
    if (d === r) return !0;
    for (const u of n.ignore ?? [])
      if (u && u.contains(d)) return !0;
    return !1;
  }
  function h() {
    if (r) return;
    r = document.createElement("div"), r.setAttribute("data-tours-picker", ""), a = r.attachShadow({ mode: "open" });
    const d = document.createElement("style");
    d.textContent = M, a.appendChild(d), e = document.createElement("div"), e.className = "tours-picker-overlay", e.style.display = "none", a.appendChild(e);
    const u = document.createElement("div");
    u.className = "tours-picker-hint", u.textContent = "Hover and click an element • Esc to cancel", a.appendChild(u), document.body.appendChild(r);
  }
  function b(d, u) {
    const f = document.elementFromPoint(d, u);
    return !f || l(f) ? null : f;
  }
  function g(d) {
    if (!s || !e) return;
    const u = b(d.clientX, d.clientY);
    if (!u) {
      e.style.display = "none";
      return;
    }
    const f = u.getBoundingClientRect();
    e.style.display = "block", e.style.left = `${f.left}px`, e.style.top = `${f.top}px`, e.style.width = `${f.width}px`, e.style.height = `${f.height}px`;
  }
  function m(d) {
    if (!s) return;
    const u = b(d.clientX, d.clientY);
    if (d.preventDefault(), d.stopPropagation(), !u) return;
    const f = Y(u);
    t.log("picked", f), y(), o([f]);
  }
  function E(d) {
    d.key === "Escape" && (d.preventDefault(), y());
  }
  function _() {
    s || (s = !0, t.log("start"), h(), document.addEventListener("mousemove", g, !0), document.addEventListener("click", m, !0), document.addEventListener("keydown", E, !0));
  }
  function y() {
    s && (s = !1, document.removeEventListener("mousemove", g, !0), document.removeEventListener("click", m, !0), document.removeEventListener("keydown", E, !0), r && r.parentNode && r.parentNode.removeChild(r), r = null, a = null, e = null);
  }
  return { start: _, stop: y };
}
const H = 6, K = 6, X = 10, j = 12;
function W(o, n, t) {
  const r = {
    top: o.top,
    bottom: t.height - o.bottom,
    left: o.left,
    right: t.width - o.right
  }, a = {
    top: n.height,
    bottom: n.height,
    left: n.width,
    right: n.width
  }, e = ["bottom", "top", "right", "left"], s = e.find((l) => r[l] >= a[l] + 8);
  return s || e.reduce((l, h) => r[h] > r[l] ? h : l, e[0]);
}
function q(o) {
  const { target: n, card: t, offset: r, viewport: a } = o, e = o.side === "auto", s = e ? W(n, t, a) : o.side, l = e ? "center" : o.align, h = o.alignOffset ?? 0, b = l === "start" ? h : l === "end" ? -h : 0;
  let g = 0, m = 0;
  return s === "top" || s === "bottom" ? (g = s === "top" ? n.top - t.height - r : n.bottom + r, m = l === "start" ? n.left : l === "end" ? n.right - t.width : n.left + n.width / 2 - t.width / 2, m += b) : (m = s === "left" ? n.left - t.width - r : n.right + r, g = l === "start" ? n.top : l === "end" ? n.bottom - t.height : n.top + n.height / 2 - t.height / 2, g += b), m = Math.max(8, Math.min(m, a.width - t.width - 8)), g = Math.max(8, Math.min(g, a.height - t.height - 8)), { top: g, left: m };
}
function V(o) {
  var T, U, F, P;
  const n = B("player");
  let t = null, r = null, a = null, e = null, s = !1, l = 0;
  const h = ((T = o.display) == null ? void 0 : T.padding) ?? H, b = ((U = o.display) == null ? void 0 : U.radius) ?? K, g = ((F = o.display) == null ? void 0 : F.cardRadius) ?? X, m = ((P = o.display) == null ? void 0 : P.offset) ?? j;
  function E(i) {
    for (const c of i.selectors)
      try {
        const p = document.querySelector(c);
        if (p) return p;
      } catch {
      }
    return null;
  }
  function _() {
    if (t) return;
    t = document.createElement("div"), t.setAttribute("data-tours-player", ""), r = t.attachShadow({ mode: "open" });
    const i = document.createElement("style");
    i.textContent = O, r.appendChild(i);
    const c = document.createElement("div");
    c.className = "tours-backdrop", r.appendChild(c), a = document.createElement("div"), a.className = "tours-spotlight", a.style.borderRadius = `${b}px`, r.appendChild(a), e = document.createElement("div"), e.className = "tours-tooltip", e.style.borderRadius = `${g}px`, r.appendChild(e), document.body.appendChild(t);
  }
  function y(i) {
    a && (a.style.display = "block", a.style.left = `${i.left - h}px`, a.style.top = `${i.top - h}px`, a.style.width = `${i.width + h * 2}px`, a.style.height = `${i.height + h * 2}px`);
  }
  function d(i, c) {
    var x;
    if (!e) return;
    const { top: p, left: k } = q({
      target: i,
      card: { width: e.offsetWidth, height: e.offsetHeight },
      side: c.placement ?? "bottom",
      align: c.align ?? "center",
      offset: m,
      alignOffset: ((x = o.display) == null ? void 0 : x.alignOffset) ?? 0,
      viewport: { width: window.innerWidth, height: window.innerHeight }
    });
    e.style.left = `${k}px`, e.style.top = `${p}px`;
  }
  function u(i) {
    if (!e) return;
    const c = o.steps.length;
    e.textContent = "";
    const p = document.createElement("button");
    p.className = "tours-close", p.type = "button", p.textContent = "×", p.setAttribute("aria-label", "Close"), p.addEventListener("click", w), e.appendChild(p);
    const k = document.createElement("p");
    k.className = "tours-tooltip__content", k.textContent = i.content.default, e.appendChild(k);
    const x = document.createElement("div");
    x.className = "tours-tooltip__footer";
    const R = document.createElement("span");
    R.className = "tours-tooltip__progress", R.textContent = `Step ${l + 1} of ${c}`, x.appendChild(R);
    const $ = document.createElement("div");
    $.className = "tours-tooltip__buttons";
    const v = document.createElement("button");
    v.className = "tours-btn", v.type = "button", v.textContent = "Back", v.disabled = l === 0, v.addEventListener("click", A), $.appendChild(v);
    const C = document.createElement("button");
    C.className = "tours-btn tours-btn--primary", C.type = "button", C.textContent = l === c - 1 ? "Done" : "Next", C.addEventListener("click", S), $.appendChild(C), x.appendChild($), e.appendChild(x);
  }
  function f() {
    if (!s) return;
    const i = o.steps[l];
    if (!i) {
      w();
      return;
    }
    n.log("render step", l, i.id);
    const c = E(i);
    if (!c) {
      n.warn(`step "${i.id}" skipped: no element for selectors`, i.selectors), l < o.steps.length - 1 ? (l += 1, f()) : w();
      return;
    }
    _(), c.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" }), u(i);
    const p = c.getBoundingClientRect();
    y(p), d(p, i);
  }
  function D(i) {
    s && (i.key === "Escape" ? (i.preventDefault(), w()) : i.key === "ArrowRight" ? S() : i.key === "ArrowLeft" && A());
  }
  function N() {
    if (!s) return;
    const i = o.steps[l];
    if (!i) return;
    const c = E(i);
    if (!c) return;
    const p = c.getBoundingClientRect();
    y(p), d(p, i);
  }
  function I() {
    s || o.steps.length !== 0 && (s = !0, l = 0, n.log("start", o.id, `${o.steps.length} steps`), _(), window.addEventListener("keydown", D, !0), window.addEventListener("resize", N, !0), window.addEventListener("scroll", N, !0), f());
  }
  function w() {
    s && (s = !1, n.log("stop"), window.removeEventListener("keydown", D, !0), window.removeEventListener("resize", N, !0), window.removeEventListener("scroll", N, !0), t && t.parentNode && t.parentNode.removeChild(t), t = null, r = null, a = null, e = null);
  }
  function S() {
    if (s) {
      if (l >= o.steps.length - 1) {
        w();
        return;
      }
      l += 1, f();
    }
  }
  function A() {
    s && (l <= 0 || (l -= 1, f()));
  }
  return { start: I, stop: w, next: S, prev: A };
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
