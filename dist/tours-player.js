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
let L = null;
function D() {
  if (L !== null) return L;
  try {
    L = new URLSearchParams(window.location.search).has("use_logs");
  } catch {
    L = !1;
  }
  return L;
}
function I(a) {
  const u = `[tours:${a}]`;
  return {
    log: (...n) => {
      D() && console.log(u, ...n);
    },
    warn: (...n) => {
      D() && console.warn(u, ...n);
    },
    error: (...n) => {
      D() && console.error(u, ...n);
    }
  };
}
function F(a) {
  if (a.id)
    return `#${CSS.escape(a.id)}`;
  const u = [];
  let n = a;
  for (; n && n !== document.body && n.nodeType === 1; ) {
    const o = n.tagName.toLowerCase(), r = n.parentElement;
    if (!r) {
      u.unshift(o);
      break;
    }
    const t = Array.from(r.children).filter(
      (i) => i.tagName === n.tagName
    );
    if (t.length > 1) {
      const i = t.indexOf(n) + 1;
      u.unshift(`${o}:nth-of-type(${i})`);
    } else
      u.unshift(o);
    n = r;
  }
  return `body > ${u.join(" > ")}`;
}
function X(a, u = {}) {
  const n = I("picker");
  let o = null, r = null, t = null, i = !1;
  function p(s) {
    if (s === o) return !0;
    for (const d of u.ignore ?? [])
      if (d && d.contains(s)) return !0;
    return !1;
  }
  function g() {
    if (o) return;
    o = document.createElement("div"), o.setAttribute("data-tours-picker", ""), r = o.attachShadow({ mode: "open" });
    const s = document.createElement("style");
    s.textContent = M, r.appendChild(s), t = document.createElement("div"), t.className = "tours-picker-overlay", t.style.display = "none", r.appendChild(t);
    const d = document.createElement("div");
    d.className = "tours-picker-hint", d.textContent = "Hover and click an element • Esc to cancel", r.appendChild(d), document.body.appendChild(o);
  }
  function N(s, d) {
    const f = document.elementFromPoint(s, d);
    return !f || p(f) ? null : f;
  }
  function $(s) {
    if (!i || !t) return;
    const d = N(s.clientX, s.clientY);
    if (!d) {
      t.style.display = "none";
      return;
    }
    const f = d.getBoundingClientRect();
    t.style.display = "block", t.style.left = `${f.left}px`, t.style.top = `${f.top}px`, t.style.width = `${f.width}px`, t.style.height = `${f.height}px`;
  }
  function E(s) {
    if (!i) return;
    const d = N(s.clientX, s.clientY);
    if (s.preventDefault(), s.stopPropagation(), !d) return;
    const f = F(d);
    n.log("picked", f), y(), a([f]);
  }
  function C(s) {
    s.key === "Escape" && (s.preventDefault(), y());
  }
  function A() {
    i || (i = !0, n.log("start"), g(), document.addEventListener("mousemove", $, !0), document.addEventListener("click", E, !0), document.addEventListener("keydown", C, !0));
  }
  function y() {
    i && (i = !1, document.removeEventListener("mousemove", $, !0), document.removeEventListener("click", E, !0), document.removeEventListener("keydown", C, !0), o && o.parentNode && o.parentNode.removeChild(o), o = null, r = null, t = null);
  }
  return { start: A, stop: y };
}
const H = 6, K = 6, O = 10, _ = 12;
function j(a) {
  var T, P, U;
  const u = I("player");
  let n = null, o = null, r = null, t = null, i = !1, p = 0;
  const g = ((T = a.display) == null ? void 0 : T.padding) ?? H, N = ((P = a.display) == null ? void 0 : P.radius) ?? K, $ = ((U = a.display) == null ? void 0 : U.cardRadius) ?? O;
  function E(e) {
    for (const c of e.selectors)
      try {
        const l = document.querySelector(c);
        if (l) return l;
      } catch {
      }
    return null;
  }
  function C() {
    if (n) return;
    n = document.createElement("div"), n.setAttribute("data-tours-player", ""), o = n.attachShadow({ mode: "open" });
    const e = document.createElement("style");
    e.textContent = Y, o.appendChild(e);
    const c = document.createElement("div");
    c.className = "tours-backdrop", o.appendChild(c), r = document.createElement("div"), r.className = "tours-spotlight", r.style.borderRadius = `${N}px`, o.appendChild(r), t = document.createElement("div"), t.className = "tours-tooltip", t.style.borderRadius = `${$}px`, o.appendChild(t), document.body.appendChild(n);
  }
  function A(e) {
    r && (r.style.display = "block", r.style.left = `${e.left - g}px`, r.style.top = `${e.top - g}px`, r.style.width = `${e.width + g * 2}px`, r.style.height = `${e.height + g * 2}px`);
  }
  function y(e, c) {
    if (!t) return;
    const l = t.offsetWidth, b = t.offsetHeight, w = window.innerWidth, k = window.innerHeight;
    let m, h;
    const x = c ?? "bottom";
    switch (x) {
      case "top":
        m = e.top - b - _, h = e.left + e.width / 2 - l / 2;
        break;
      case "left":
        m = e.top + e.height / 2 - b / 2, h = e.left - l - _;
        break;
      case "right":
        m = e.top + e.height / 2 - b / 2, h = e.right + _;
        break;
      case "bottom":
      default:
        m = e.bottom + _, h = e.left + e.width / 2 - l / 2;
        break;
    }
    x === "bottom" && m + b > k && (m = e.top - b - _), h = Math.max(8, Math.min(h, w - l - 8)), m = Math.max(8, Math.min(m, k - b - 8)), t.style.left = `${h}px`, t.style.top = `${m}px`;
  }
  function s(e) {
    if (!t) return;
    const c = a.steps.length;
    t.textContent = "";
    const l = document.createElement("button");
    l.className = "tours-close", l.type = "button", l.textContent = "×", l.setAttribute("aria-label", "Close"), l.addEventListener("click", v), t.appendChild(l);
    const b = document.createElement("p");
    b.className = "tours-tooltip__content", b.textContent = e.content.default, t.appendChild(b);
    const w = document.createElement("div");
    w.className = "tours-tooltip__footer";
    const k = document.createElement("span");
    k.className = "tours-tooltip__progress", k.textContent = `Step ${p + 1} of ${c}`, w.appendChild(k);
    const m = document.createElement("div");
    m.className = "tours-tooltip__buttons";
    const h = document.createElement("button");
    h.className = "tours-btn", h.type = "button", h.textContent = "Back", h.disabled = p === 0, h.addEventListener("click", z), m.appendChild(h);
    const x = document.createElement("button");
    x.className = "tours-btn tours-btn--primary", x.type = "button", x.textContent = p === c - 1 ? "Done" : "Next", x.addEventListener("click", R), m.appendChild(x), w.appendChild(m), t.appendChild(w);
  }
  function d() {
    if (!i) return;
    const e = a.steps[p];
    if (!e) {
      v();
      return;
    }
    u.log("render step", p, e.id);
    const c = E(e);
    if (!c) {
      u.warn(`step "${e.id}" skipped: no element for selectors`, e.selectors), p < a.steps.length - 1 ? (p += 1, d()) : v();
      return;
    }
    C(), c.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" }), s(e);
    const l = c.getBoundingClientRect();
    A(l), y(l, e.placement);
  }
  function f(e) {
    i && (e.key === "Escape" ? (e.preventDefault(), v()) : e.key === "ArrowRight" ? R() : e.key === "ArrowLeft" && z());
  }
  function S() {
    if (!i) return;
    const e = a.steps[p];
    if (!e) return;
    const c = E(e);
    if (!c) return;
    const l = c.getBoundingClientRect();
    A(l), y(l, e.placement);
  }
  function B() {
    i || a.steps.length !== 0 && (i = !0, p = 0, u.log("start", a.id, `${a.steps.length} steps`), C(), window.addEventListener("keydown", f, !0), window.addEventListener("resize", S, !0), window.addEventListener("scroll", S, !0), d());
  }
  function v() {
    i && (i = !1, u.log("stop"), window.removeEventListener("keydown", f, !0), window.removeEventListener("resize", S, !0), window.removeEventListener("scroll", S, !0), n && n.parentNode && n.parentNode.removeChild(n), n = null, o = null, r = null, t = null);
  }
  function R() {
    if (i) {
      if (p >= a.steps.length - 1) {
        v();
        return;
      }
      p += 1, d();
    }
  }
  function z() {
    i && (p <= 0 || (p -= 1, d()));
  }
  return { start: B, stop: v, next: R, prev: z };
}
export {
  I as createLogger,
  X as createPicker,
  j as createPlayer,
  D as isLoggingEnabled
};
//# sourceMappingURL=tours-player.js.map
