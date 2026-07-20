const H = `
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
`;
let v = null;
function L() {
  if (v !== null) return v;
  try {
    v = new URLSearchParams(window.location.search).has("use_logs");
  } catch {
    v = !1;
  }
  return v;
}
function z(e) {
  const t = `[tours:${e}]`;
  return {
    log: (...n) => {
      L() && console.log(t, ...n);
    },
    warn: (...n) => {
      L() && console.warn(t, ...n);
    },
    error: (...n) => {
      L() && console.error(t, ...n);
    }
  };
}
function M(e) {
  if (e.id)
    return `#${CSS.escape(e.id)}`;
  const t = [];
  let n = e;
  for (; n && n !== document.body && n.nodeType === 1; ) {
    const o = n.tagName.toLowerCase(), s = n.parentElement;
    if (!s) {
      t.unshift(o);
      break;
    }
    const i = Array.from(s.children).filter(
      (a) => a.tagName === n.tagName
    );
    if (i.length > 1) {
      const a = i.indexOf(n) + 1;
      t.unshift(`${o}:nth-of-type(${a})`);
    } else
      t.unshift(o);
    n = s;
  }
  return `body > ${t.join(" > ")}`;
}
function G(e, t = {}) {
  const n = z("picker");
  let o = null, s = null, i = null, a = !1;
  function d(l) {
    if (l === o) return !0;
    for (const f of t.ignore ?? [])
      if (f && f.contains(l)) return !0;
    return !1;
  }
  function c() {
    if (o) return;
    o = document.createElement("div"), o.setAttribute("data-tours-picker", ""), s = o.attachShadow({ mode: "open" });
    const l = document.createElement("style");
    l.textContent = H, s.appendChild(l), i = document.createElement("div"), i.className = "tours-picker-overlay", i.style.display = "none", s.appendChild(i);
    const f = document.createElement("div");
    f.className = "tours-picker-hint", f.textContent = "Hover and click an element • Esc to cancel", s.appendChild(f), document.body.appendChild(o);
  }
  function b(l, f) {
    const p = document.elementFromPoint(l, f);
    return !p || d(p) ? null : p;
  }
  function h(l) {
    if (!a || !i) return;
    const f = b(l.clientX, l.clientY);
    if (!f) {
      i.style.display = "none";
      return;
    }
    const p = f.getBoundingClientRect();
    i.style.display = "block", i.style.left = `${p.left}px`, i.style.top = `${p.top}px`, i.style.width = `${p.width}px`, i.style.height = `${p.height}px`;
  }
  function g(l) {
    if (!a) return;
    const f = b(l.clientX, l.clientY);
    if (l.preventDefault(), l.stopPropagation(), !f) return;
    const p = M(f);
    n.log("picked", p), x(), e([p]);
  }
  function w(l) {
    l.key === "Escape" && (l.preventDefault(), x());
  }
  function k() {
    a || (a = !0, n.log("start"), c(), document.addEventListener("mousemove", h, !0), document.addEventListener("click", g, !0), document.addEventListener("keydown", w, !0));
  }
  function x() {
    a && (a = !1, document.removeEventListener("mousemove", h, !0), document.removeEventListener("click", g, !0), document.removeEventListener("keydown", w, !0), o && o.parentNode && o.parentNode.removeChild(o), o = null, s = null, i = null);
  }
  return { start: k, stop: x };
}
const Y = 6, B = 6, O = 10, K = 12;
function X(e, t, n) {
  const o = {
    top: e.top,
    bottom: n.height - e.bottom,
    left: e.left,
    right: n.width - e.right
  }, s = {
    top: t.height,
    bottom: t.height,
    left: t.width,
    right: t.width
  }, i = ["bottom", "top", "right", "left"], a = i.find((d) => o[d] >= s[d] + 8);
  return a || i.reduce((d, c) => o[c] > o[d] ? c : d, i[0]);
}
function j(e) {
  const { target: t, card: n, offset: o, viewport: s } = e, i = e.side === "auto", a = i ? X(t, n, s) : e.side, d = i ? "center" : e.align, c = e.alignOffset ?? 0, b = d === "start" ? c : d === "end" ? -c : 0;
  let h = 0, g = 0;
  return a === "top" || a === "bottom" ? (h = a === "top" ? t.top - n.height - o : t.bottom + o, g = d === "start" ? t.left : d === "end" ? t.right - n.width : t.left + t.width / 2 - n.width / 2, g += b) : (g = a === "left" ? t.left - n.width - o : t.right + o, h = d === "start" ? t.top : d === "end" ? t.bottom - n.height : t.top + t.height / 2 - n.height / 2, h += b), g = Math.max(8, Math.min(g, s.width - n.width - 8)), h = Math.max(8, Math.min(h, s.height - n.height - 8)), { top: h, left: g };
}
function D(e) {
  const t = document.createElement("button");
  return t.type = "button", t.className = `tours-card__btn${e.primary ? " tours-card__btn--primary" : ""}${e.disabled ? " tours-card__btn--disabled" : ""}`, t.textContent = e.label, !e.disabled && e.onClick && t.addEventListener("click", e.onClick), t;
}
function W(e) {
  const t = document.createElement("div");
  if (t.className = `tours-card${e.ghost ? " tours-card--ghost" : ""}`, e.radius != null && (t.style.borderRadius = `${e.radius}px`), e.showClose) {
    const o = document.createElement("button");
    o.className = "tours-card__close", o.type = "button", o.textContent = "×", o.setAttribute("aria-label", "Close"), e.onClose && o.addEventListener("click", e.onClose), t.appendChild(o);
  }
  const n = document.createElement("div");
  if (n.className = "tours-card__content", e.contentHtml != null ? n.innerHTML = e.contentHtml : n.textContent = e.contentText ?? "", t.appendChild(n), e.back || e.next || e.progress) {
    const o = document.createElement("div");
    if (o.className = "tours-card__footer", e.back && o.appendChild(D(e.back)), e.progress) {
      const s = document.createElement("span");
      s.className = "tours-card__progress", s.textContent = e.progress, o.appendChild(s);
    }
    e.next && o.appendChild(D(e.next)), t.appendChild(o);
  }
  return t;
}
const q = `
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
.tours-card--ghost .tours-card__btn { pointer-events: auto; }
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
function V(e) {
  var N, S, A, T;
  const t = z("player");
  let n = null, o = null, s = null, i = null, a = !1, d = 0;
  const c = ((N = e.display) == null ? void 0 : N.padding) ?? Y, b = ((S = e.display) == null ? void 0 : S.radius) ?? B, h = ((A = e.display) == null ? void 0 : A.cardRadius) ?? O, g = ((T = e.display) == null ? void 0 : T.offset) ?? K;
  function w(r) {
    for (const u of r.selectors)
      try {
        const m = document.querySelector(u);
        if (m) return m;
      } catch {
      }
    return null;
  }
  function k() {
    if (n) return;
    n = document.createElement("div"), n.setAttribute("data-tours-player", ""), o = n.attachShadow({ mode: "open" });
    const r = document.createElement("style");
    r.textContent = I + q, o.appendChild(r);
    const u = document.createElement("div");
    u.className = "tours-backdrop", o.appendChild(u), s = document.createElement("div"), s.className = "tours-spotlight", s.style.borderRadius = `${b}px`, o.appendChild(s), document.body.appendChild(n);
  }
  function x(r) {
    s && (s.style.display = "block", s.style.left = `${r.left - c}px`, s.style.top = `${r.top - c}px`, s.style.width = `${r.width + c * 2}px`, s.style.height = `${r.height + c * 2}px`);
  }
  function l(r, u) {
    var R;
    if (!i) return;
    const m = {
      top: r.top - c,
      left: r.left - c,
      right: r.right + c,
      bottom: r.bottom + c,
      width: r.width + c * 2,
      height: r.height + c * 2
    }, { top: F, left: P } = j({
      target: m,
      card: { width: i.offsetWidth, height: i.offsetHeight },
      side: u.placement ?? "bottom",
      align: u.align ?? "center",
      offset: g,
      alignOffset: ((R = e.display) == null ? void 0 : R.alignOffset) ?? 0,
      viewport: { width: window.innerWidth, height: window.innerHeight }
    });
    i.style.left = `${P}px`, i.style.top = `${F}px`;
  }
  function f(r) {
    const u = e.steps.length;
    i && i.remove(), i = W({
      contentText: r.content.default,
      progress: `Step ${d + 1} of ${u}`,
      showClose: !0,
      onClose: y,
      radius: h,
      back: { label: "Back", disabled: d === 0, onClick: E },
      next: { label: d === u - 1 ? "Done" : "Next", primary: !0, onClick: _ }
    }), o == null || o.appendChild(i);
  }
  function p() {
    if (!a) return;
    const r = e.steps[d];
    if (!r) {
      y();
      return;
    }
    t.log("render step", d, r.id);
    const u = w(r);
    if (!u) {
      t.warn(`step "${r.id}" skipped: no element for selectors`, r.selectors), d < e.steps.length - 1 ? (d += 1, p()) : y();
      return;
    }
    k(), u.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" }), f(r);
    const m = u.getBoundingClientRect();
    x(m), l(m, r);
  }
  function $(r) {
    a && (r.key === "Escape" ? (r.preventDefault(), y()) : r.key === "ArrowRight" ? _() : r.key === "ArrowLeft" && E());
  }
  function C() {
    if (!a) return;
    const r = e.steps[d];
    if (!r) return;
    const u = w(r);
    if (!u) return;
    const m = u.getBoundingClientRect();
    x(m), l(m, r);
  }
  function U() {
    a || e.steps.length !== 0 && (a = !0, d = 0, t.log("start", e.id, `${e.steps.length} steps`), k(), window.addEventListener("keydown", $, !0), window.addEventListener("resize", C, !0), window.addEventListener("scroll", C, !0), p());
  }
  function y() {
    a && (a = !1, t.log("stop"), window.removeEventListener("keydown", $, !0), window.removeEventListener("resize", C, !0), window.removeEventListener("scroll", C, !0), n && n.parentNode && n.parentNode.removeChild(n), n = null, o = null, s = null, i = null);
  }
  function _() {
    if (a) {
      if (d >= e.steps.length - 1) {
        y();
        return;
      }
      d += 1, p();
    }
  }
  function E() {
    a && (d <= 0 || (d -= 1, p()));
  }
  return { start: U, stop: y, next: _, prev: E };
}
export {
  q as CARD_STYLES,
  X as autoSide,
  z as createLogger,
  G as createPicker,
  V as createPlayer,
  L as isLoggingEnabled,
  j as placeCard,
  W as renderCard
};
//# sourceMappingURL=tours-player.js.map
