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
`, I = `
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
function P(l) {
  const o = `[tours:${l}]`;
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
function M(l) {
  if (l.id)
    return `#${CSS.escape(l.id)}`;
  const o = [];
  let t = l;
  for (; t && t !== document.body && t.nodeType === 1; ) {
    const r = t.tagName.toLowerCase(), i = t.parentElement;
    if (!i) {
      o.unshift(r);
      break;
    }
    const e = Array.from(i.children).filter(
      (s) => s.tagName === t.tagName
    );
    if (e.length > 1) {
      const s = e.indexOf(t) + 1;
      o.unshift(`${r}:nth-of-type(${s})`);
    } else
      o.unshift(r);
    t = i;
  }
  return `body > ${o.join(" > ")}`;
}
function O(l, o = {}) {
  const t = P("picker");
  let r = null, i = null, e = null, s = !1;
  function a(d) {
    if (d === r) return !0;
    for (const c of o.ignore ?? [])
      if (c && c.contains(d)) return !0;
    return !1;
  }
  function h() {
    if (r) return;
    r = document.createElement("div"), r.setAttribute("data-tours-picker", ""), i = r.attachShadow({ mode: "open" });
    const d = document.createElement("style");
    d.textContent = B, i.appendChild(d), e = document.createElement("div"), e.className = "tours-picker-overlay", e.style.display = "none", i.appendChild(e);
    const c = document.createElement("div");
    c.className = "tours-picker-hint", c.textContent = "Hover and click an element • Esc to cancel", i.appendChild(c), document.body.appendChild(r);
  }
  function k(d, c) {
    const f = document.elementFromPoint(d, c);
    return !f || a(f) ? null : f;
  }
  function C(d) {
    if (!s || !e) return;
    const c = k(d.clientX, d.clientY);
    if (!c) {
      e.style.display = "none";
      return;
    }
    const f = c.getBoundingClientRect();
    e.style.display = "block", e.style.left = `${f.left}px`, e.style.top = `${f.top}px`, e.style.width = `${f.width}px`, e.style.height = `${f.height}px`;
  }
  function x(d) {
    if (!s) return;
    const c = k(d.clientX, d.clientY);
    if (d.preventDefault(), d.stopPropagation(), !c) return;
    const f = M(c);
    t.log("picked", f), m(), l([f]);
  }
  function y(d) {
    d.key === "Escape" && (d.preventDefault(), m());
  }
  function L() {
    s || (s = !0, t.log("start"), h(), document.addEventListener("mousemove", C, !0), document.addEventListener("click", x, !0), document.addEventListener("keydown", y, !0));
  }
  function m() {
    s && (s = !1, document.removeEventListener("mousemove", C, !0), document.removeEventListener("click", x, !0), document.removeEventListener("keydown", y, !0), r && r.parentNode && r.parentNode.removeChild(r), r = null, i = null, e = null);
  }
  return { start: L, stop: m };
}
const Y = 6, H = 6, K = 10, X = 12;
function j(l) {
  const { target: o, card: t, side: r, align: i, offset: e, viewport: s } = l;
  let a = 0, h = 0;
  return r === "top" || r === "bottom" ? (a = r === "top" ? o.top - t.height - e : o.bottom + e, h = i === "start" ? o.left : i === "end" ? o.right - t.width : o.left + o.width / 2 - t.width / 2) : (h = r === "left" ? o.left - t.width - e : o.right + e, a = i === "start" ? o.top : i === "end" ? o.bottom - t.height : o.top + o.height / 2 - t.height / 2), h = Math.max(8, Math.min(h, s.width - t.width - 8)), a = Math.max(8, Math.min(a, s.height - t.height - 8)), { top: a, left: h };
}
function W(l) {
  var D, T, U;
  const o = P("player");
  let t = null, r = null, i = null, e = null, s = !1, a = 0;
  const h = ((D = l.display) == null ? void 0 : D.padding) ?? Y, k = ((T = l.display) == null ? void 0 : T.radius) ?? H, C = ((U = l.display) == null ? void 0 : U.cardRadius) ?? K;
  function x(n) {
    for (const u of n.selectors)
      try {
        const p = document.querySelector(u);
        if (p) return p;
      } catch {
      }
    return null;
  }
  function y() {
    if (t) return;
    t = document.createElement("div"), t.setAttribute("data-tours-player", ""), r = t.attachShadow({ mode: "open" });
    const n = document.createElement("style");
    n.textContent = I, r.appendChild(n);
    const u = document.createElement("div");
    u.className = "tours-backdrop", r.appendChild(u), i = document.createElement("div"), i.className = "tours-spotlight", i.style.borderRadius = `${k}px`, r.appendChild(i), e = document.createElement("div"), e.className = "tours-tooltip", e.style.borderRadius = `${C}px`, r.appendChild(e), document.body.appendChild(t);
  }
  function L(n) {
    i && (i.style.display = "block", i.style.left = `${n.left - h}px`, i.style.top = `${n.top - h}px`, i.style.width = `${n.width + h * 2}px`, i.style.height = `${n.height + h * 2}px`);
  }
  function m(n, u) {
    if (!e) return;
    const { top: p, left: v } = j({
      target: n,
      card: { width: e.offsetWidth, height: e.offsetHeight },
      side: u.placement ?? "bottom",
      align: u.align ?? "center",
      offset: u.offset ?? X,
      viewport: { width: window.innerWidth, height: window.innerHeight }
    });
    e.style.left = `${v}px`, e.style.top = `${p}px`;
  }
  function d(n) {
    if (!e) return;
    const u = l.steps.length;
    e.textContent = "";
    const p = document.createElement("button");
    p.className = "tours-close", p.type = "button", p.textContent = "×", p.setAttribute("aria-label", "Close"), p.addEventListener("click", g), e.appendChild(p);
    const v = document.createElement("p");
    v.className = "tours-tooltip__content", v.textContent = n.content.default, e.appendChild(v);
    const N = document.createElement("div");
    N.className = "tours-tooltip__footer";
    const R = document.createElement("span");
    R.className = "tours-tooltip__progress", R.textContent = `Step ${a + 1} of ${u}`, N.appendChild(R);
    const $ = document.createElement("div");
    $.className = "tours-tooltip__buttons";
    const b = document.createElement("button");
    b.className = "tours-btn", b.type = "button", b.textContent = "Back", b.disabled = a === 0, b.addEventListener("click", A), $.appendChild(b);
    const w = document.createElement("button");
    w.className = "tours-btn tours-btn--primary", w.type = "button", w.textContent = a === u - 1 ? "Done" : "Next", w.addEventListener("click", S), $.appendChild(w), N.appendChild($), e.appendChild(N);
  }
  function c() {
    if (!s) return;
    const n = l.steps[a];
    if (!n) {
      g();
      return;
    }
    o.log("render step", a, n.id);
    const u = x(n);
    if (!u) {
      o.warn(`step "${n.id}" skipped: no element for selectors`, n.selectors), a < l.steps.length - 1 ? (a += 1, c()) : g();
      return;
    }
    y(), u.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" }), d(n);
    const p = u.getBoundingClientRect();
    L(p), m(p, n);
  }
  function f(n) {
    s && (n.key === "Escape" ? (n.preventDefault(), g()) : n.key === "ArrowRight" ? S() : n.key === "ArrowLeft" && A());
  }
  function _() {
    if (!s) return;
    const n = l.steps[a];
    if (!n) return;
    const u = x(n);
    if (!u) return;
    const p = u.getBoundingClientRect();
    L(p), m(p, n);
  }
  function F() {
    s || l.steps.length !== 0 && (s = !0, a = 0, o.log("start", l.id, `${l.steps.length} steps`), y(), window.addEventListener("keydown", f, !0), window.addEventListener("resize", _, !0), window.addEventListener("scroll", _, !0), c());
  }
  function g() {
    s && (s = !1, o.log("stop"), window.removeEventListener("keydown", f, !0), window.removeEventListener("resize", _, !0), window.removeEventListener("scroll", _, !0), t && t.parentNode && t.parentNode.removeChild(t), t = null, r = null, i = null, e = null);
  }
  function S() {
    if (s) {
      if (a >= l.steps.length - 1) {
        g();
        return;
      }
      a += 1, c();
    }
  }
  function A() {
    s && (a <= 0 || (a -= 1, c()));
  }
  return { start: F, stop: g, next: S, prev: A };
}
export {
  P as createLogger,
  O as createPicker,
  W as createPlayer,
  z as isLoggingEnabled,
  j as placeCard
};
//# sourceMappingURL=tours-player.js.map
