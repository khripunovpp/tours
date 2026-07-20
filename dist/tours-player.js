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
function B(i) {
  const n = `[tours:${i}]`;
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
function H(i) {
  if (i.id)
    return `#${CSS.escape(i.id)}`;
  const n = [];
  let t = i;
  for (; t && t !== document.body && t.nodeType === 1; ) {
    const o = t.tagName.toLowerCase(), s = t.parentElement;
    if (!s) {
      n.unshift(o);
      break;
    }
    const e = Array.from(s.children).filter(
      (l) => l.tagName === t.tagName
    );
    if (e.length > 1) {
      const l = e.indexOf(t) + 1;
      n.unshift(`${o}:nth-of-type(${l})`);
    } else
      n.unshift(o);
    t = s;
  }
  return `body > ${n.join(" > ")}`;
}
function G(i, n = {}) {
  const t = B("picker");
  let o = null, s = null, e = null, l = !1;
  function d(a) {
    if (a === o) return !0;
    for (const f of n.ignore ?? [])
      if (f && f.contains(a)) return !0;
    return !1;
  }
  function c() {
    if (o) return;
    o = document.createElement("div"), o.setAttribute("data-tours-picker", ""), s = o.attachShadow({ mode: "open" });
    const a = document.createElement("style");
    a.textContent = M, s.appendChild(a), e = document.createElement("div"), e.className = "tours-picker-overlay", e.style.display = "none", s.appendChild(e);
    const f = document.createElement("div");
    f.className = "tours-picker-hint", f.textContent = "Hover and click an element • Esc to cancel", s.appendChild(f), document.body.appendChild(o);
  }
  function m(a, f) {
    const h = document.elementFromPoint(a, f);
    return !h || d(h) ? null : h;
  }
  function k(a) {
    if (!l || !e) return;
    const f = m(a.clientX, a.clientY);
    if (!f) {
      e.style.display = "none";
      return;
    }
    const h = f.getBoundingClientRect();
    e.style.display = "block", e.style.left = `${h.left}px`, e.style.top = `${h.top}px`, e.style.width = `${h.width}px`, e.style.height = `${h.height}px`;
  }
  function C(a) {
    if (!l) return;
    const f = m(a.clientX, a.clientY);
    if (a.preventDefault(), a.stopPropagation(), !f) return;
    const h = H(f);
    t.log("picked", h), g(), i([h]);
  }
  function y(a) {
    a.key === "Escape" && (a.preventDefault(), g());
  }
  function L() {
    l || (l = !0, t.log("start"), c(), document.addEventListener("mousemove", k, !0), document.addEventListener("click", C, !0), document.addEventListener("keydown", y, !0));
  }
  function g() {
    l && (l = !1, document.removeEventListener("mousemove", k, !0), document.removeEventListener("click", C, !0), document.removeEventListener("keydown", y, !0), o && o.parentNode && o.parentNode.removeChild(o), o = null, s = null, e = null);
  }
  return { start: L, stop: g };
}
const K = 6, X = 6, j = 10, O = 12;
function W(i, n, t) {
  const o = {
    top: i.top,
    bottom: t.height - i.bottom,
    left: i.left,
    right: t.width - i.right
  }, s = {
    top: n.height,
    bottom: n.height,
    left: n.width,
    right: n.width
  }, e = ["bottom", "top", "right", "left"], l = e.filter((c) => o[c] >= s[c] + 8), d = l.length ? l : e;
  return d.reduce((c, m) => o[m] > o[c] ? m : c, d[0]);
}
function q(i) {
  const { target: n, card: t, align: o, offset: s, viewport: e } = i, l = i.side === "auto" ? W(n, t, e) : i.side;
  let d = 0, c = 0;
  return l === "top" || l === "bottom" ? (d = l === "top" ? n.top - t.height - s : n.bottom + s, c = o === "start" ? n.left : o === "end" ? n.right - t.width : n.left + n.width / 2 - t.width / 2) : (c = l === "left" ? n.left - t.width - s : n.right + s, d = o === "start" ? n.top : o === "end" ? n.bottom - t.height : n.top + n.height / 2 - t.height / 2), c = Math.max(8, Math.min(c, e.width - t.width - 8)), d = Math.max(8, Math.min(d, e.height - t.height - 8)), { top: d, left: c };
}
function V(i) {
  var T, U, P, F;
  const n = B("player");
  let t = null, o = null, s = null, e = null, l = !1, d = 0;
  const c = ((T = i.display) == null ? void 0 : T.padding) ?? K, m = ((U = i.display) == null ? void 0 : U.radius) ?? X, k = ((P = i.display) == null ? void 0 : P.cardRadius) ?? j, C = ((F = i.display) == null ? void 0 : F.offset) ?? O;
  function y(r) {
    for (const p of r.selectors)
      try {
        const u = document.querySelector(p);
        if (u) return u;
      } catch {
      }
    return null;
  }
  function L() {
    if (t) return;
    t = document.createElement("div"), t.setAttribute("data-tours-player", ""), o = t.attachShadow({ mode: "open" });
    const r = document.createElement("style");
    r.textContent = Y, o.appendChild(r);
    const p = document.createElement("div");
    p.className = "tours-backdrop", o.appendChild(p), s = document.createElement("div"), s.className = "tours-spotlight", s.style.borderRadius = `${m}px`, o.appendChild(s), e = document.createElement("div"), e.className = "tours-tooltip", e.style.borderRadius = `${k}px`, o.appendChild(e), document.body.appendChild(t);
  }
  function g(r) {
    s && (s.style.display = "block", s.style.left = `${r.left - c}px`, s.style.top = `${r.top - c}px`, s.style.width = `${r.width + c * 2}px`, s.style.height = `${r.height + c * 2}px`);
  }
  function a(r, p) {
    if (!e) return;
    const { top: u, left: w } = q({
      target: r,
      card: { width: e.offsetWidth, height: e.offsetHeight },
      side: p.placement ?? "bottom",
      align: p.align ?? "center",
      offset: C,
      viewport: { width: window.innerWidth, height: window.innerHeight }
    });
    e.style.left = `${w}px`, e.style.top = `${u}px`;
  }
  function f(r) {
    if (!e) return;
    const p = i.steps.length;
    e.textContent = "";
    const u = document.createElement("button");
    u.className = "tours-close", u.type = "button", u.textContent = "×", u.setAttribute("aria-label", "Close"), u.addEventListener("click", b), e.appendChild(u);
    const w = document.createElement("p");
    w.className = "tours-tooltip__content", w.textContent = r.content.default, e.appendChild(w);
    const N = document.createElement("div");
    N.className = "tours-tooltip__footer";
    const R = document.createElement("span");
    R.className = "tours-tooltip__progress", R.textContent = `Step ${d + 1} of ${p}`, N.appendChild(R);
    const $ = document.createElement("div");
    $.className = "tours-tooltip__buttons";
    const x = document.createElement("button");
    x.className = "tours-btn", x.type = "button", x.textContent = "Back", x.disabled = d === 0, x.addEventListener("click", A), $.appendChild(x);
    const v = document.createElement("button");
    v.className = "tours-btn tours-btn--primary", v.type = "button", v.textContent = d === p - 1 ? "Done" : "Next", v.addEventListener("click", S), $.appendChild(v), N.appendChild($), e.appendChild(N);
  }
  function h() {
    if (!l) return;
    const r = i.steps[d];
    if (!r) {
      b();
      return;
    }
    n.log("render step", d, r.id);
    const p = y(r);
    if (!p) {
      n.warn(`step "${r.id}" skipped: no element for selectors`, r.selectors), d < i.steps.length - 1 ? (d += 1, h()) : b();
      return;
    }
    L(), p.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" }), f(r);
    const u = p.getBoundingClientRect();
    g(u), a(u, r);
  }
  function D(r) {
    l && (r.key === "Escape" ? (r.preventDefault(), b()) : r.key === "ArrowRight" ? S() : r.key === "ArrowLeft" && A());
  }
  function _() {
    if (!l) return;
    const r = i.steps[d];
    if (!r) return;
    const p = y(r);
    if (!p) return;
    const u = p.getBoundingClientRect();
    g(u), a(u, r);
  }
  function I() {
    l || i.steps.length !== 0 && (l = !0, d = 0, n.log("start", i.id, `${i.steps.length} steps`), L(), window.addEventListener("keydown", D, !0), window.addEventListener("resize", _, !0), window.addEventListener("scroll", _, !0), h());
  }
  function b() {
    l && (l = !1, n.log("stop"), window.removeEventListener("keydown", D, !0), window.removeEventListener("resize", _, !0), window.removeEventListener("scroll", _, !0), t && t.parentNode && t.parentNode.removeChild(t), t = null, o = null, s = null, e = null);
  }
  function S() {
    if (l) {
      if (d >= i.steps.length - 1) {
        b();
        return;
      }
      d += 1, h();
    }
  }
  function A() {
    l && (d <= 0 || (d -= 1, h()));
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
