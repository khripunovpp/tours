const R = `
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
`, B = `
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
function P() {
  if (_ !== null) return _;
  try {
    _ = new URLSearchParams(window.location.search).has("use_logs");
  } catch {
    _ = !1;
  }
  return _;
}
function D(c) {
  const u = `[tours:${c}]`;
  return {
    log: (...n) => {
      P() && console.log(u, ...n);
    },
    warn: (...n) => {
      P() && console.warn(u, ...n);
    },
    error: (...n) => {
      P() && console.error(u, ...n);
    }
  };
}
function I(c) {
  if (c.id)
    return `#${CSS.escape(c.id)}`;
  const u = [];
  let n = c;
  for (; n && n !== document.body && n.nodeType === 1; ) {
    const o = n.tagName.toLowerCase(), i = n.parentElement;
    if (!i) {
      u.unshift(o);
      break;
    }
    const t = Array.from(i.children).filter(
      (s) => s.tagName === n.tagName
    );
    if (t.length > 1) {
      const s = t.indexOf(n) + 1;
      u.unshift(`${o}:nth-of-type(${s})`);
    } else
      u.unshift(o);
    n = i;
  }
  return `body > ${u.join(" > ")}`;
}
function U(c, u = {}) {
  const n = D("picker");
  let o = null, i = null, t = null, s = !1;
  function p(r) {
    if (r === o) return !0;
    for (const a of u.ignore ?? [])
      if (a && a.contains(r)) return !0;
    return !1;
  }
  function y() {
    if (o) return;
    o = document.createElement("div"), o.setAttribute("data-tours-picker", ""), i = o.attachShadow({ mode: "open" });
    const r = document.createElement("style");
    r.textContent = R, i.appendChild(r), t = document.createElement("div"), t.className = "tours-picker-overlay", t.style.display = "none", i.appendChild(t);
    const a = document.createElement("div");
    a.className = "tours-picker-hint", a.textContent = "Hover and click an element • Esc to cancel", i.appendChild(a), document.body.appendChild(o);
  }
  function E(r, a) {
    const h = document.elementFromPoint(r, a);
    return !h || p(h) ? null : h;
  }
  function C(r) {
    if (!s || !t) return;
    const a = E(r.clientX, r.clientY);
    if (!a) {
      t.style.display = "none";
      return;
    }
    const h = a.getBoundingClientRect();
    t.style.display = "block", t.style.left = `${h.left}px`, t.style.top = `${h.top}px`, t.style.width = `${h.width}px`, t.style.height = `${h.height}px`;
  }
  function L(r) {
    if (!s) return;
    const a = E(r.clientX, r.clientY);
    if (r.preventDefault(), r.stopPropagation(), !a) return;
    const h = I(a);
    n.log("picked", h), g(), c([h]);
  }
  function N(r) {
    r.key === "Escape" && (r.preventDefault(), g());
  }
  function z() {
    s || (s = !0, n.log("start"), y(), document.addEventListener("mousemove", C, !0), document.addEventListener("click", L, !0), document.addEventListener("keydown", N, !0));
  }
  function g() {
    s && (s = !1, document.removeEventListener("mousemove", C, !0), document.removeEventListener("click", L, !0), document.removeEventListener("keydown", N, !0), o && o.parentNode && o.parentNode.removeChild(o), o = null, i = null, t = null);
  }
  return { start: z, stop: g };
}
const M = 6, $ = 12;
function Y(c) {
  var T;
  const u = D("player");
  let n = null, o = null, i = null, t = null, s = !1, p = 0;
  const y = ((T = c.display) == null ? void 0 : T.padding) ?? M;
  function E(e) {
    for (const d of e.selectors)
      try {
        const l = document.querySelector(d);
        if (l) return l;
      } catch {
      }
    return null;
  }
  function C() {
    if (n) return;
    n = document.createElement("div"), n.setAttribute("data-tours-player", ""), o = n.attachShadow({ mode: "open" });
    const e = document.createElement("style");
    e.textContent = B, o.appendChild(e);
    const d = document.createElement("div");
    d.className = "tours-backdrop", o.appendChild(d), i = document.createElement("div"), i.className = "tours-spotlight", o.appendChild(i), t = document.createElement("div"), t.className = "tours-tooltip", o.appendChild(t), document.body.appendChild(n);
  }
  function L(e) {
    i && (i.style.display = "block", i.style.left = `${e.left - y}px`, i.style.top = `${e.top - y}px`, i.style.width = `${e.width + y * 2}px`, i.style.height = `${e.height + y * 2}px`);
  }
  function N(e, d) {
    if (!t) return;
    const l = t.offsetWidth, b = t.offsetHeight, w = window.innerWidth, k = window.innerHeight;
    let f, m;
    const x = d ?? "bottom";
    switch (x) {
      case "top":
        f = e.top - b - $, m = e.left + e.width / 2 - l / 2;
        break;
      case "left":
        f = e.top + e.height / 2 - b / 2, m = e.left - l - $;
        break;
      case "right":
        f = e.top + e.height / 2 - b / 2, m = e.right + $;
        break;
      case "bottom":
      default:
        f = e.bottom + $, m = e.left + e.width / 2 - l / 2;
        break;
    }
    x === "bottom" && f + b > k && (f = e.top - b - $), m = Math.max(8, Math.min(m, w - l - 8)), f = Math.max(8, Math.min(f, k - b - 8)), t.style.left = `${m}px`, t.style.top = `${f}px`;
  }
  function z(e) {
    if (!t) return;
    const d = c.steps.length;
    t.textContent = "";
    const l = document.createElement("button");
    l.className = "tours-close", l.type = "button", l.textContent = "×", l.setAttribute("aria-label", "Close"), l.addEventListener("click", v), t.appendChild(l);
    const b = document.createElement("p");
    b.className = "tours-tooltip__content", b.textContent = e.content.default, t.appendChild(b);
    const w = document.createElement("div");
    w.className = "tours-tooltip__footer";
    const k = document.createElement("span");
    k.className = "tours-tooltip__progress", k.textContent = `Step ${p + 1} of ${d}`, w.appendChild(k);
    const f = document.createElement("div");
    f.className = "tours-tooltip__buttons";
    const m = document.createElement("button");
    m.className = "tours-btn", m.type = "button", m.textContent = "Back", m.disabled = p === 0, m.addEventListener("click", A), f.appendChild(m);
    const x = document.createElement("button");
    x.className = "tours-btn tours-btn--primary", x.type = "button", x.textContent = p === d - 1 ? "Done" : "Next", x.addEventListener("click", S), f.appendChild(x), w.appendChild(f), t.appendChild(w);
  }
  function g() {
    if (!s) return;
    const e = c.steps[p];
    if (!e) {
      v();
      return;
    }
    u.log("render step", p, e.id);
    const d = E(e);
    if (!d) {
      u.warn(`step "${e.id}" skipped: no element for selectors`, e.selectors), p < c.steps.length - 1 ? (p += 1, g()) : v();
      return;
    }
    C(), d.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" }), z(e);
    const l = d.getBoundingClientRect();
    L(l), N(l, e.placement);
  }
  function r(e) {
    s && (e.key === "Escape" ? (e.preventDefault(), v()) : e.key === "ArrowRight" ? S() : e.key === "ArrowLeft" && A());
  }
  function a() {
    if (!s) return;
    const e = c.steps[p];
    if (!e) return;
    const d = E(e);
    if (!d) return;
    const l = d.getBoundingClientRect();
    L(l), N(l, e.placement);
  }
  function h() {
    s || c.steps.length !== 0 && (s = !0, p = 0, u.log("start", c.id, `${c.steps.length} steps`), C(), window.addEventListener("keydown", r, !0), window.addEventListener("resize", a, !0), window.addEventListener("scroll", a, !0), g());
  }
  function v() {
    s && (s = !1, u.log("stop"), window.removeEventListener("keydown", r, !0), window.removeEventListener("resize", a, !0), window.removeEventListener("scroll", a, !0), n && n.parentNode && n.parentNode.removeChild(n), n = null, o = null, i = null, t = null);
  }
  function S() {
    if (s) {
      if (p >= c.steps.length - 1) {
        v();
        return;
      }
      p += 1, g();
    }
  }
  function A() {
    s && (p <= 0 || (p -= 1, g()));
  }
  return { start: h, stop: v, next: S, prev: A };
}
export {
  D as createLogger,
  U as createPicker,
  Y as createPlayer,
  P as isLoggingEnabled
};
//# sourceMappingURL=tours-player.js.map
