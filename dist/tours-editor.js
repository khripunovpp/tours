const de = `
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
`, le = `
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
let T = null;
function B() {
  if (T !== null) return T;
  try {
    T = new URLSearchParams(window.location.search).has("use_logs");
  } catch {
    T = !1;
  }
  return T;
}
function O(n) {
  const e = `[tours:${n}]`;
  return {
    log: (...t) => {
      B() && console.log(e, ...t);
    },
    warn: (...t) => {
      B() && console.warn(e, ...t);
    },
    error: (...t) => {
      B() && console.error(e, ...t);
    }
  };
}
function ce(n) {
  if (n.id)
    return `#${CSS.escape(n.id)}`;
  const e = [];
  let t = n;
  for (; t && t !== document.body && t.nodeType === 1; ) {
    const r = t.tagName.toLowerCase(), o = t.parentElement;
    if (!o) {
      e.unshift(r);
      break;
    }
    const i = Array.from(o.children).filter(
      (d) => d.tagName === t.tagName
    );
    if (i.length > 1) {
      const d = i.indexOf(t) + 1;
      e.unshift(`${r}:nth-of-type(${d})`);
    } else
      e.unshift(r);
    t = o;
  }
  return `body > ${e.join(" > ")}`;
}
function pe(n, e = {}) {
  const t = O("picker");
  let r = null, o = null, i = null, d = !1;
  function s(u) {
    if (u === r) return !0;
    for (const f of e.ignore ?? [])
      if (f && f.contains(u)) return !0;
    return !1;
  }
  function l() {
    if (r) return;
    r = document.createElement("div"), r.setAttribute("data-tours-picker", ""), o = r.attachShadow({ mode: "open" });
    const u = document.createElement("style");
    u.textContent = de, o.appendChild(u), i = document.createElement("div"), i.className = "tours-picker-overlay", i.style.display = "none", o.appendChild(i);
    const f = document.createElement("div");
    f.className = "tours-picker-hint", f.textContent = "Hover and click an element • Esc to cancel", o.appendChild(f), document.body.appendChild(r);
  }
  function p(u, f) {
    const h = document.elementFromPoint(u, f);
    return !h || s(h) ? null : h;
  }
  function v(u) {
    if (!d || !i) return;
    const f = p(u.clientX, u.clientY);
    if (!f) {
      i.style.display = "none";
      return;
    }
    const h = f.getBoundingClientRect();
    i.style.display = "block", i.style.left = `${h.left}px`, i.style.top = `${h.top}px`, i.style.width = `${h.width}px`, i.style.height = `${h.height}px`;
  }
  function w(u) {
    if (!d) return;
    const f = p(u.clientX, u.clientY);
    if (u.preventDefault(), u.stopPropagation(), !f) return;
    const h = ce(f);
    t.log("picked", h), m(), n([h]);
  }
  function _(u) {
    u.key === "Escape" && (u.preventDefault(), m());
  }
  function k() {
    d || (d = !0, t.log("start"), l(), document.addEventListener("mousemove", v, !0), document.addEventListener("click", w, !0), document.addEventListener("keydown", _, !0));
  }
  function m() {
    d && (d = !1, document.removeEventListener("mousemove", v, !0), document.removeEventListener("click", w, !0), document.removeEventListener("keydown", _, !0), r && r.parentNode && r.parentNode.removeChild(r), r = null, o = null, i = null);
  }
  return { start: k, stop: m };
}
const U = 6, j = 6, V = 10, F = 12, ue = 1;
function y(n) {
  return typeof n == "object" && n !== null && !Array.isArray(n);
}
function X(n) {
  return y(n) && typeof n.default == "string";
}
const G = ["top", "bottom", "left", "right", "auto"], K = ["start", "center", "end"], Z = ["mobile", "tablet", "desktop"], Q = ["click", "input", "navigate", "none"];
function te(n, e, t) {
  if (!y(n)) {
    t.push(`${e} must be an object`);
    return;
  }
  const r = typeof n.glob == "string" && n.glob.length > 0, o = typeof n.regex == "string" && n.regex.length > 0;
  if (!r && !o && t.push(`${e} must have a non-empty "glob" or "regex"`), o)
    try {
      new RegExp(n.regex);
    } catch {
      t.push(`${e}.regex is not a valid regular expression`);
    }
}
function ee(n, e, t) {
  if (!y(n)) {
    t.push(`${e} must be an object`);
    return;
  }
  n.url !== void 0 && te(n.url, `${e}.url`, t), n.role !== void 0 && typeof n.role != "string" && t.push(`${e}.role must be a string`), n.firstVisitOnly !== void 0 && typeof n.firstVisitOnly != "boolean" && t.push(`${e}.firstVisitOnly must be a boolean`), n.device !== void 0 && !Z.includes(n.device) && t.push(`${e}.device must be one of ${Z.join("|")}`), n.unlessSeen !== void 0 && typeof n.unlessSeen != "boolean" && t.push(`${e}.unlessSeen must be a boolean`), n.maxShows !== void 0 && (typeof n.maxShows != "number" || n.maxShows < 0) && t.push(`${e}.maxShows must be a non-negative number`);
}
function he(n, e, t) {
  if (!y(n)) {
    t.push(`${e} must be an object`);
    return;
  }
  Q.includes(n.type) || t.push(`${e}.type must be one of ${Q.join("|")}`), n.url !== void 0 && typeof n.url != "string" && t.push(`${e}.url must be a string`), n.value !== void 0 && typeof n.value != "string" && t.push(`${e}.value must be a string`);
}
function fe(n) {
  const e = [];
  if (!y(n))
    return { ok: !1, errors: ["tour must be an object"] };
  if ((typeof n.id != "string" || n.id.length === 0) && e.push("tour.id must be a non-empty string"), typeof n.schemaVersion != "number" && e.push("tour.schemaVersion must be a number"), X(n.title) || e.push('tour.title must be a localized text with a string "default"'), Array.isArray(n.steps) ? n.steps.length === 0 ? e.push("tour.steps must contain at least one step") : n.steps.forEach((t, r) => {
    if (!y(t)) {
      e.push(`steps[${r}] must be an object`);
      return;
    }
    (typeof t.id != "string" || t.id.length === 0) && e.push(`steps[${r}].id must be a non-empty string`), (!Array.isArray(t.selectors) || t.selectors.length === 0 || !t.selectors.every((o) => typeof o == "string" && o.length > 0)) && e.push(`steps[${r}].selectors must be a non-empty array of non-empty strings`), X(t.content) || e.push(`steps[${r}].content must be a localized text with a string "default"`), t.placement !== void 0 && !G.includes(t.placement) && e.push(`steps[${r}].placement must be one of ${G.join("|")}`), t.align !== void 0 && !K.includes(t.align) && e.push(`steps[${r}].align must be one of ${K.join("|")}`), t.pageUrl !== void 0 && te(t.pageUrl, `steps[${r}].pageUrl`, e), t.condition !== void 0 && ee(t.condition, `steps[${r}].condition`, e), t.action !== void 0 && he(t.action, `steps[${r}].action`, e);
  }) : e.push("tour.steps must be an array"), n.display !== void 0)
    if (!y(n.display))
      e.push("tour.display must be an object");
    else
      for (const t of ["padding", "radius", "cardRadius", "offset"]) {
        const r = n.display[t];
        r !== void 0 && (typeof r != "number" || r < 0) && e.push(`tour.display.${t} must be a non-negative number`);
      }
  return n.rules !== void 0 && (Array.isArray(n.rules) ? n.rules.forEach((t, r) => {
    if (!y(t)) {
      e.push(`rules[${r}] must be an object`);
      return;
    }
    t.tourId !== void 0 && typeof t.tourId != "string" && e.push(`rules[${r}].tourId must be a string`), t.when === void 0 ? e.push(`rules[${r}].when is required`) : ee(t.when, `rules[${r}].when`, e);
  }) : e.push("tour.rules must be an array")), e.length > 0 ? { ok: !1, errors: e } : { ok: !0, tour: n };
}
function ge(n, e, t) {
  const r = {
    top: n.top,
    bottom: t.height - n.bottom,
    left: n.left,
    right: t.width - n.right
  }, o = {
    top: e.height,
    bottom: e.height,
    left: e.width,
    right: e.width
  }, i = ["bottom", "top", "right", "left"], d = i.find((s) => r[s] >= o[s] + 8);
  return d || i.reduce((s, l) => r[l] > r[s] ? l : s, i[0]);
}
function re(n) {
  const { target: e, card: t, offset: r, viewport: o } = n, i = n.side === "auto", d = i ? ge(e, t, o) : n.side, s = i ? "center" : n.align;
  let l = 0, p = 0;
  return d === "top" || d === "bottom" ? (l = d === "top" ? e.top - t.height - r : e.bottom + r, p = s === "start" ? e.left : s === "end" ? e.right - t.width : e.left + e.width / 2 - t.width / 2) : (p = d === "left" ? e.left - t.width - r : e.right + r, l = s === "start" ? e.top : s === "end" ? e.bottom - t.height : e.top + e.height / 2 - t.height / 2), p = Math.max(8, Math.min(p, o.width - t.width - 8)), l = Math.max(8, Math.min(l, o.height - t.height - 8)), { top: l, left: p };
}
function be(n) {
  var W, J, Y, q;
  const e = O("player");
  let t = null, r = null, o = null, i = null, d = !1, s = 0;
  const l = ((W = n.display) == null ? void 0 : W.padding) ?? U, p = ((J = n.display) == null ? void 0 : J.radius) ?? j, v = ((Y = n.display) == null ? void 0 : Y.cardRadius) ?? V, w = ((q = n.display) == null ? void 0 : q.offset) ?? F;
  function _(c) {
    for (const g of c.selectors)
      try {
        const b = document.querySelector(g);
        if (b) return b;
      } catch {
      }
    return null;
  }
  function k() {
    if (t) return;
    t = document.createElement("div"), t.setAttribute("data-tours-player", ""), r = t.attachShadow({ mode: "open" });
    const c = document.createElement("style");
    c.textContent = le, r.appendChild(c);
    const g = document.createElement("div");
    g.className = "tours-backdrop", r.appendChild(g), o = document.createElement("div"), o.className = "tours-spotlight", o.style.borderRadius = `${p}px`, r.appendChild(o), i = document.createElement("div"), i.className = "tours-tooltip", i.style.borderRadius = `${v}px`, r.appendChild(i), document.body.appendChild(t);
  }
  function m(c) {
    o && (o.style.display = "block", o.style.left = `${c.left - l}px`, o.style.top = `${c.top - l}px`, o.style.width = `${c.width + l * 2}px`, o.style.height = `${c.height + l * 2}px`);
  }
  function u(c, g) {
    if (!i) return;
    const { top: b, left: $ } = re({
      target: c,
      card: { width: i.offsetWidth, height: i.offsetHeight },
      side: g.placement ?? "bottom",
      align: g.align ?? "center",
      offset: w,
      viewport: { width: window.innerWidth, height: window.innerHeight }
    });
    i.style.left = `${$}px`, i.style.top = `${b}px`;
  }
  function f(c) {
    if (!i) return;
    const g = n.steps.length;
    i.textContent = "";
    const b = document.createElement("button");
    b.className = "tours-close", b.type = "button", b.textContent = "×", b.setAttribute("aria-label", "Close"), b.addEventListener("click", E), i.appendChild(b);
    const $ = document.createElement("p");
    $.className = "tours-tooltip__content", $.textContent = c.content.default, i.appendChild($);
    const P = document.createElement("div");
    P.className = "tours-tooltip__footer";
    const D = document.createElement("span");
    D.className = "tours-tooltip__progress", D.textContent = `Step ${s + 1} of ${g}`, P.appendChild(D);
    const I = document.createElement("div");
    I.className = "tours-tooltip__buttons";
    const S = document.createElement("button");
    S.className = "tours-btn", S.type = "button", S.textContent = "Back", S.disabled = s === 0, S.addEventListener("click", R), I.appendChild(S);
    const L = document.createElement("button");
    L.className = "tours-btn tours-btn--primary", L.type = "button", L.textContent = s === g - 1 ? "Done" : "Next", L.addEventListener("click", z), I.appendChild(L), P.appendChild(I), i.appendChild(P);
  }
  function h() {
    if (!d) return;
    const c = n.steps[s];
    if (!c) {
      E();
      return;
    }
    e.log("render step", s, c.id);
    const g = _(c);
    if (!g) {
      e.warn(`step "${c.id}" skipped: no element for selectors`, c.selectors), s < n.steps.length - 1 ? (s += 1, h()) : E();
      return;
    }
    k(), g.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" }), f(c);
    const b = g.getBoundingClientRect();
    m(b), u(b, c);
  }
  function C(c) {
    d && (c.key === "Escape" ? (c.preventDefault(), E()) : c.key === "ArrowRight" ? z() : c.key === "ArrowLeft" && R());
  }
  function A() {
    if (!d) return;
    const c = n.steps[s];
    if (!c) return;
    const g = _(c);
    if (!g) return;
    const b = g.getBoundingClientRect();
    m(b), u(b, c);
  }
  function ae() {
    d || n.steps.length !== 0 && (d = !0, s = 0, e.log("start", n.id, `${n.steps.length} steps`), k(), window.addEventListener("keydown", C, !0), window.addEventListener("resize", A, !0), window.addEventListener("scroll", A, !0), h());
  }
  function E() {
    d && (d = !1, e.log("stop"), window.removeEventListener("keydown", C, !0), window.removeEventListener("resize", A, !0), window.removeEventListener("scroll", A, !0), t && t.parentNode && t.parentNode.removeChild(t), t = null, r = null, o = null, i = null);
  }
  function z() {
    if (d) {
      if (s >= n.steps.length - 1) {
        E();
        return;
      }
      s += 1, h();
    }
  }
  function R() {
    d && (s <= 0 || (s -= 1, h()));
  }
  return { start: ae, stop: E, next: z, prev: R };
}
const ve = `
:host {
  all: initial;
  --e-bg: #ffffff;
  --e-fg: #1f2733;
  --e-muted: #6b7280;
  --e-border: #e5e7eb;
  --e-surface: #f7f8fa;
  --e-accent: #2563eb;
  --e-accent-soft: #eff3ff;
  --e-radius: 12px;
  --e-shadow: 0 12px 32px rgba(15, 23, 42, 0.16);
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
}

button { font: inherit; cursor: pointer; }

/* ---------- Builder panel ---------- */
.panel {
  position: fixed;
  top: 16px;
  bottom: 76px;
  width: 380px;
  z-index: 2147483200;
  display: flex;
  flex-direction: column;
  background: var(--e-bg);
  color: var(--e-fg);
  border: 1px solid var(--e-border);
  border-radius: var(--e-radius);
  box-shadow: var(--e-shadow);
  overflow: hidden;
}
.panel--right { right: 16px; }
.panel--left { left: 16px; }

.panel__header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 14px 10px;
}
.panel__title {
  font-size: 15px;
  font-weight: 700;
  border: 1px solid transparent;
  border-radius: 6px;
  padding: 2px 6px;
  margin: 0 -6px;
  background: transparent;
  color: inherit;
  min-width: 0;
  flex: 1;
}
.panel__title:hover { background: var(--e-surface); }
.panel__title:focus { outline: none; border-color: var(--e-accent); background: #fff; }

.panel__title--static { pointer-events: none; }
.panel__title--static:hover { background: transparent; }

.newtour {
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  background: var(--e-accent);
  border: none;
  border-radius: 8px;
  padding: 6px 12px;
  white-space: nowrap;
}
.newtour:hover { background: #1d4ed8; }

/* ---------- Tour list ---------- */
.tourlist { display: flex; flex-direction: column; gap: 8px; }
.tourrow {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: var(--e-bg);
  border: 1px solid var(--e-border);
  border-radius: 10px;
  cursor: pointer;
}
.tourrow:hover { border-color: var(--e-accent); box-shadow: 0 0 0 3px var(--e-accent-soft); }
.tourrow__main { flex: 1; min-width: 0; }
.tourrow__name {
  font-size: 14px;
  font-weight: 600;
  color: var(--e-fg);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.tourrow__meta { font-size: 12px; color: var(--e-muted); margin-top: 2px; }

.status {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 3px 8px;
  border-radius: 999px;
  background: var(--e-surface);
  color: var(--e-muted);
  border: 1px solid var(--e-border);
}
.status--published { background: #ecfdf5; color: #047857; border-color: #a7f3d0; }

.iconbtn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  padding: 0;
  color: var(--e-muted);
  background: transparent;
  border: 1px solid transparent;
  border-radius: 8px;
}
.iconbtn:hover { background: var(--e-surface); color: var(--e-fg); }
.iconbtn--active { background: var(--e-accent); color: #fff; }
.iconbtn--active:hover { background: var(--e-accent); color: #fff; }
.iconbtn svg { width: 18px; height: 18px; display: block; }

.panel__toolbar {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0 12px 10px;
  border-bottom: 1px solid var(--e-border);
}
.panel__toolbar .spacer { flex: 1; }

.tabs {
  display: flex;
  gap: 4px;
  padding: 10px 12px 0;
}
.tab {
  font-size: 13px;
  font-weight: 600;
  color: var(--e-muted);
  background: transparent;
  border: none;
  border-radius: 8px;
  padding: 6px 10px;
}
.tab--active { color: var(--e-fg); background: var(--e-surface); }

.panel__body {
  flex: 1;
  overflow-y: auto;
  padding: 14px 16px 20px;
}

/* ---------- Step list ---------- */
.steps { display: flex; flex-direction: column; align-items: stretch; }

.connector {
  align-self: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--e-border);
}
.connector__line { width: 1px; height: 12px; background: var(--e-border); }
.connector__add {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  color: var(--e-muted);
  background: var(--e-bg);
  border: 1px solid var(--e-border);
  border-radius: 999px;
  font-size: 15px;
  line-height: 1;
}
.connector__add:hover { color: var(--e-accent); border-color: var(--e-accent); }

/* ---------- Card ---------- */
.card {
  border: 1px solid var(--e-border);
  border-radius: 10px;
  background: var(--e-bg);
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
  overflow: hidden;
}
.card--active { border-color: var(--e-accent); box-shadow: 0 0 0 3px var(--e-accent-soft); }
.card--excluded { opacity: 0.55; }

.card__control {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-bottom: 1px solid var(--e-border);
}
.card__check { width: 16px; height: 16px; accent-color: var(--e-accent); cursor: pointer; }
.card__type {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: var(--e-muted);
}
.card__index {
  width: 18px; height: 18px;
  display: inline-flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 700;
  color: var(--e-muted);
  background: var(--e-surface);
  border-radius: 5px;
}
.card__control .spacer { flex: 1; }
.card__sel {
  font-size: 11px;
  color: var(--e-muted);
  max-width: 130px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
}
.card__sel--empty { color: #d97706; }

.card__content {
  padding: 12px;
  font-size: 14px;
  line-height: 1.5;
  color: var(--e-fg);
  min-height: 22px;
  outline: none;
  white-space: pre-wrap;
  word-break: break-word;
}
.card__content:empty::before {
  content: attr(data-placeholder);
  color: var(--e-muted);
}
.card__content:focus { background: #fffef8; }

.card__footer {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 10px 10px;
}
.cardbtn {
  font-size: 12px;
  font-weight: 600;
  color: var(--e-fg);
  background: var(--e-surface);
  border: 1px solid var(--e-border);
  border-radius: 7px;
  padding: 5px 12px;
  min-width: 56px;
}
.cardbtn:hover { background: #eef0f3; }
.cardbtn--edit {
  background: #fff;
  border-color: var(--e-accent);
  text-align: center;
}

/* ---------- Bottom/top navigation ---------- */
.nav {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2147483210;
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 6px;
  background: var(--e-bg);
  border: 1px solid var(--e-border);
  border-radius: 999px;
  box-shadow: var(--e-shadow);
}
.nav--bottom { bottom: 18px; }
.nav--top { top: 18px; }
.nav__sep { width: 1px; height: 22px; background: var(--e-border); margin: 0 4px; }

/* ---------- Active-step target highlight (dashed, no backdrop) ---------- */
.highlight {
  position: fixed;
  z-index: 2147483100;
  box-sizing: border-box;
  border: 2px dashed var(--e-accent);
  border-radius: 6px;
  background: rgba(37, 99, 235, 0.06);
  pointer-events: none;
  transition: all 120ms ease-out;
  display: none;
}

.highlight--settings {
  border-color: #f59e0b;
  background: rgba(245, 158, 11, 0.10);
}

.assets-empty {
  color: var(--e-muted);
  font-size: 13px;
  text-align: center;
  padding: 32px 12px;
}

/* ---------- Per-step placement picker ---------- */
.place {
  padding: 10px 12px 12px;
  border-top: 1px solid var(--e-border);
  background: var(--e-surface);
}
.place__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.place__label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--e-muted);
}
.place__auto {
  font-size: 12px;
  font-weight: 600;
  color: var(--e-muted);
  background: var(--e-bg);
  border: 1px solid var(--e-border);
  border-radius: 999px;
  padding: 3px 12px;
  cursor: pointer;
}
.place__auto:hover { color: var(--e-fg); }
.place__auto--active { color: #fff; background: var(--e-accent); border-color: var(--e-accent); }
.place__grid {
  position: relative;
  width: 132px;
  height: 96px;
  margin: 0 auto 6px;
  background: var(--e-bg);
  border: 1px solid var(--e-border);
  border-radius: 8px;
}
.place__el {
  position: absolute;
  left: 40px;
  top: 32px;
  width: 52px;
  height: 32px;
  background: var(--e-accent-soft);
  border: 1px solid #c7d6ff;
  border-radius: 5px;
}
.place__dot {
  position: absolute;
  width: 12px;
  height: 12px;
  padding: 0;
  border-radius: 999px;
  background: #cdd3de;
  border: 2px solid var(--e-bg);
  cursor: pointer;
}
.place__dot:hover { background: var(--e-muted); }
.place__dot--active {
  background: var(--e-accent);
  box-shadow: 0 0 0 3px var(--e-accent-soft);
}

/* ---------- Card preview (Display > Card) ---------- */
.card-preview {
  position: fixed;
  z-index: 2147483105;
  box-sizing: border-box;
  max-width: 280px;
  min-width: 200px;
  padding: 14px 16px;
  font-size: 14px;
  line-height: 1.5;
  color: var(--e-fg);
  background: #fff;
  border: 1px solid var(--e-border);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.22);
  pointer-events: none;
  display: none;
}
.card-preview__content { white-space: pre-wrap; word-break: break-word; }
.card-preview__content--placeholder { color: var(--e-muted); }
.card-preview__footer {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-top: 14px;
}
.card-preview__btn {
  font-size: 12px;
  font-weight: 600;
  padding: 5px 12px;
  border-radius: 7px;
  background: var(--e-surface);
  border: 1px solid var(--e-border);
  color: var(--e-fg);
  /* Re-enable clicks even though the preview container is click-through. */
  pointer-events: auto;
  cursor: pointer;
}
.card-preview__btn:hover { background: #eef0f3; }
.card-preview__btn--primary { background: var(--e-accent); border-color: var(--e-accent); color: #fff; }
.card-preview__btn--primary:hover { background: #1d4ed8; }
.card-preview__btn--disabled { opacity: 0.45; pointer-events: none; cursor: default; }

/* ---------- Display settings ---------- */
.settings { padding: 4px 2px; }
.subtabs {
  display: inline-flex;
  gap: 2px;
  padding: 3px;
  margin-bottom: 14px;
  background: var(--e-surface);
  border-radius: 9px;
}
.subtab {
  font-size: 12px;
  font-weight: 600;
  color: var(--e-muted);
  background: transparent;
  border: none;
  border-radius: 6px;
  padding: 5px 12px;
}
.subtab--active { color: var(--e-fg); background: #fff; box-shadow: 0 1px 2px rgba(15,23,42,0.08); }
.settings__field { margin-bottom: 12px; }
.settings__label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: var(--e-fg);
  margin-bottom: 8px;
}
.settings__row { display: flex; align-items: center; gap: 12px; }
.settings__slider { flex: 1; accent-color: #f59e0b; }
.settings__value {
  min-width: 42px;
  text-align: right;
  font-size: 13px;
  font-weight: 600;
  color: var(--e-muted);
  font-variant-numeric: tabular-nums;
}
.settings__hint {
  font-size: 12px;
  line-height: 1.5;
  color: var(--e-muted);
}
`, ne = {
  cursor: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m4 4 7 17 2.5-7L21 11.5 4 4Z"/></svg>',
  back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></svg>',
  panelSide: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M15 4v16"/></svg>',
  navFlip: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18"/><path d="m7 8 5-5 5 5"/><path d="m7 16 5 5 5-5"/></svg>',
  build: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>',
  preview: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>',
  bolt: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z"/></svg>',
  step: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 2"/></svg>'
};
let xe = 0;
function oe(n) {
  const e = typeof crypto < "u" && "randomUUID" in crypto ? crypto.randomUUID() : `${xe++}`;
  return `${n}-${e}`;
}
function H(n = "step") {
  return {
    id: oe("step"),
    type: n,
    included: !0,
    selectors: [],
    content: "",
    placement: "bottom",
    align: "center",
    backLabel: "Back",
    nextLabel: "Next"
  };
}
function M() {
  return {
    id: oe("tour"),
    name: "Untitled tour",
    status: "draft",
    steps: [H()],
    display: {
      padding: U,
      radius: j,
      cardRadius: V,
      offset: F
    }
  };
}
function ie(n) {
  var t, r, o, i;
  if (!Array.isArray(n)) return [];
  const e = [];
  for (const d of n) {
    if (!d || typeof d != "object") continue;
    const s = d;
    typeof s.id != "string" || !Array.isArray(s.steps) || e.push({
      id: s.id,
      name: typeof s.name == "string" ? s.name : "Untitled tour",
      status: s.status === "published" ? "published" : "draft",
      display: {
        padding: N((t = s.display) == null ? void 0 : t.padding, U),
        radius: N((r = s.display) == null ? void 0 : r.radius, j),
        cardRadius: N((o = s.display) == null ? void 0 : o.cardRadius, V),
        offset: N((i = s.display) == null ? void 0 : i.offset, F)
      },
      steps: s.steps.filter((l) => !!l && typeof l == "object").map((l) => ({
        ...H(l.type === "action" ? "action" : "step"),
        ...l
      }))
    });
  }
  return e;
}
function N(n, e) {
  return typeof n == "number" && n >= 0 ? n : e;
}
function me(n) {
  const e = n.steps.filter((r) => r.included && r.selectors.length > 0).map((r) => ({
    id: r.id,
    selectors: r.selectors,
    content: { default: r.content },
    placement: r.placement,
    align: r.align
  })), t = {
    id: n.id,
    schemaVersion: ue,
    title: { default: n.name },
    steps: e,
    display: {
      padding: n.display.padding,
      radius: n.display.radius,
      cardRadius: n.display.cardRadius,
      offset: n.display.offset
    }
  };
  return fe(t);
}
function ye(n = "tours:drafts") {
  return {
    async load() {
      try {
        const e = localStorage.getItem(n);
        return e ? ie(JSON.parse(e)) : null;
      } catch {
        return null;
      }
    },
    async save(e) {
      try {
        localStorage.setItem(n, JSON.stringify(e));
      } catch {
      }
    }
  };
}
function we(n) {
  const e = { "Content-Type": "application/json" };
  return n.nonce && (e["X-WP-Nonce"] = n.nonce), {
    async load() {
      const t = await fetch(n.url, { headers: e, credentials: "same-origin" });
      if (!t.ok) throw new Error(`WordPress load failed: ${t.status}`);
      return ie(await t.json());
    },
    async save(t) {
      const r = await fetch(n.url, {
        method: "POST",
        headers: e,
        credentials: "same-origin",
        body: JSON.stringify(t)
      });
      if (!r.ok) throw new Error(`WordPress save failed: ${r.status}`);
    }
  };
}
function a(n, e = {}, t = []) {
  const r = document.createElement(n);
  for (const [o, i] of Object.entries(e)) r.setAttribute(o, i);
  for (const o of t) r.append(typeof o == "string" ? document.createTextNode(o) : o);
  return r;
}
function x(n, e, t = "") {
  const r = a("button", { class: `iconbtn ${t}`.trim(), title: e, type: "button" });
  return r.innerHTML = ne[n] ?? "", r;
}
class se {
  constructor(e = {}) {
    var t;
    this.options = e, this.log = O("editor"), this.host = null, this.root = null, this.tours = [M()], this.openTourId = this.tours[0].id, this.view = "edit", this.activeStepId = ((t = this.tours[0].steps[0]) == null ? void 0 : t.id) ?? null, this.tab = "steps", this.displaySub = "tour", this.mode = "build", this.picker = null, this.picking = !1, this.player = null, this.highlight = null, this.cardPreview = null, this.focusStepId = null, this.onViewportChange = () => this.updateOverlays(), this.saveTimer = null, this.navPosition = e.navPosition ?? "bottom", this.panelPosition = e.panelPosition ?? "right", this.local = ye(e.storageKey), this.secondary = e.storage ?? null;
  }
  /**
   * Auto-mount when the page URL carries the flag (default `?tours-edit=1`), so
   * a site owner can enable the builder without touching code. Returns the
   * instance if mounted, otherwise null.
   */
  static fromUrl(e = {}) {
    const t = e.urlFlag ?? "tours-edit", r = new URLSearchParams(window.location.search).get(t);
    if (r === null || r === "0" || r === "false") return null;
    const o = new se(e);
    return o.mount(), o;
  }
  /** Render the UI onto the page. Idempotent. */
  mount() {
    if (this.host || this.options.mode === "off") return;
    this.host = a("div", { "data-tours-editor": "" }), this.root = this.host.attachShadow({ mode: "open" });
    const e = document.createElement("style");
    e.textContent = ve, this.root.appendChild(e), this.highlight = a("div", { class: "highlight" }), this.cardPreview = a("div", { class: "card-preview" }, ["Step tooltip preview"]), this.root.append(this.highlight, this.cardPreview), document.body.appendChild(this.host), window.addEventListener("scroll", this.onViewportChange, !0), window.addEventListener("resize", this.onViewportChange, !0), this.log.log("mounted"), this.render(), this.hydrate();
  }
  /** Load stored drafts (localStorage by default) and show them. */
  async hydrate() {
    var t;
    const e = await this.local.load();
    !e || e.length === 0 || (this.tours = e, this.openTourId = e[0].id, this.activeStepId = ((t = e[0].steps[0]) == null ? void 0 : t.id) ?? null, this.log.log("hydrated", `${e.length} tour(s)`), this.render());
  }
  /** Debounce a save so rapid edits (typing, dragging a slider) coalesce. */
  markDirty() {
    this.saveTimer !== null && clearTimeout(this.saveTimer), this.saveTimer = setTimeout(() => {
      this.saveTimer = null, this.persist();
    }, 400);
  }
  /** Always write localStorage; also try the secondary strategy best-effort. */
  async persist() {
    const e = this.tours;
    if (await this.local.save(e), this.secondary)
      try {
        await this.secondary.save(e);
      } catch (t) {
        this.log.warn("secondary store save failed (localStorage kept the draft)", t);
      }
  }
  /** Remove the UI and any active picker/player. */
  destroy() {
    var e, t;
    this.stopPicking(), (e = this.player) == null || e.stop(), this.player = null, this.saveTimer !== null && (clearTimeout(this.saveTimer), this.saveTimer = null, this.persist()), window.removeEventListener("scroll", this.onViewportChange, !0), window.removeEventListener("resize", this.onViewportChange, !0), (t = this.host) != null && t.parentNode && this.host.parentNode.removeChild(this.host), this.host = null, this.root = null, this.highlight = null, this.cardPreview = null;
  }
  /** The current draft as a validated tour (or validation errors). */
  export() {
    return me(this.tour);
  }
  // ---------- state mutations ----------
  /** The currently open tour (falls back to the first if the id is stale). */
  get tour() {
    return this.tours.find((e) => e.id === this.openTourId) ?? this.tours[0];
  }
  get activeStep() {
    return this.tour.steps.find((e) => e.id === this.activeStepId) ?? null;
  }
  /** Open a tour for editing and reset the active step to its first. */
  openTour(e) {
    var t;
    this.openTourId = e, this.view = "edit", this.tab = "steps", this.activeStepId = ((t = this.tour.steps[0]) == null ? void 0 : t.id) ?? null, this.render();
  }
  createTour() {
    const e = M();
    this.tours.push(e), this.openTour(e.id);
  }
  deleteTour(e) {
    const t = this.tours.findIndex((r) => r.id === e);
    t !== -1 && (this.tours.splice(t, 1), this.tours.length === 0 && this.tours.push(M()), this.openTourId === e && (this.openTourId = this.tours[0].id), this.render());
  }
  setActive(e) {
    this.activeStepId !== e && (this.activeStepId = e, this.render());
  }
  addStepAfter(e, t = "step") {
    const r = H(t);
    this.tour.steps.splice(e + 1, 0, r), this.activeStepId = r.id, this.render();
  }
  removeStep(e) {
    var r;
    const t = this.tour.steps.findIndex((o) => o.id === e);
    t !== -1 && (this.tour.steps.splice(t, 1), this.activeStepId === e && (this.activeStepId = ((r = this.tour.steps[Math.max(0, t - 1)]) == null ? void 0 : r.id) ?? null), this.render());
  }
  // ---------- picker (selector search) ----------
  togglePicking() {
    if (this.picking) {
      this.stopPicking();
      return;
    }
    const e = this.activeStep;
    e && (this.picking = !0, this.picker = pe(
      (t) => {
        e.selectors = t, this.picking = !1, this.picker = null, this.log.log("bound selector to step", e.id, t), this.render();
      },
      { ignore: [this.host] }
    ), this.picker.start(), this.render());
  }
  stopPicking() {
    var e;
    (e = this.picker) == null || e.stop(), this.picker = null, this.picking = !1;
  }
  // ---------- preview ----------
  togglePreview() {
    var t;
    if (this.mode === "preview") {
      (t = this.player) == null || t.stop(), this.player = null, this.mode = "build", this.render();
      return;
    }
    const e = this.export();
    if (!e.ok) {
      this.log.warn("cannot preview — draft is invalid", e.errors), window.alert(`Add a selector and text to at least one step first:

${e.errors.join(`
`)}`);
      return;
    }
    this.mode = "preview", this.render(), this.player = be(e.tour), this.player.start();
  }
  // ---------- rendering ----------
  render() {
    this.root && (this.root.querySelectorAll(".panel, .nav").forEach((e) => e.remove()), this.mode === "build" && this.root.appendChild(this.renderPanel()), this.root.appendChild(this.renderNav()), this.focusStepId && (this.focusContent(this.focusStepId), this.focusStepId = null), this.updateOverlays(), this.markDirty());
  }
  /** Resolve a step's target on the page, trying each candidate selector. */
  resolveTarget(e) {
    for (const t of e.selectors)
      try {
        const r = document.querySelector(t);
        if (r) return r;
      } catch {
      }
    return null;
  }
  /**
   * Draw the dashed outline around the active step's target, and (in the Card
   * sub-tab) a live tooltip-card preview beside it. Both use the same
   * tour-level values the player reads. Shown only in build mode when the
   * active step resolves; hidden while picking or in preview. No backdrop.
   */
  updateOverlays() {
    const e = this.highlight, t = this.cardPreview;
    if (!e || !t) return;
    const r = () => {
      e.style.display = "none", t.style.display = "none";
    };
    if (this.view !== "edit" || this.mode !== "build" || this.picking) return r();
    const o = this.activeStep, i = o && o.selectors.length > 0 ? this.resolveTarget(o) : null;
    if (!o || !i) return r();
    const d = i.getBoundingClientRect(), { padding: s, radius: l, cardRadius: p } = this.tour.display;
    e.className = `highlight ${this.tab === "display" ? "highlight--settings" : ""}`.trim(), e.style.display = "block", e.style.left = `${d.left - s}px`, e.style.top = `${d.top - s}px`, e.style.width = `${d.width + s * 2}px`, e.style.height = `${d.height + s * 2}px`, e.style.borderRadius = `${l}px`, this.drawStepCard(t, o, d, p);
  }
  /**
   * Render the active step's card near its target, as the visitor will see it.
   * Shown when the step has any content; in the Card sub-tab a placeholder is
   * used instead so the radius stays visible before any text is written.
   */
  drawStepCard(e, t, r, o) {
    const i = t.content.trim(), d = this.tab === "display" && this.displaySub === "card";
    if (!i && !d) {
      e.style.display = "none";
      return;
    }
    e.textContent = "", e.style.display = "block", e.style.borderRadius = `${o}px`;
    const s = a("div", { class: "card-preview__content" }, [i || "Step tooltip preview"]);
    i || s.classList.add("card-preview__content--placeholder");
    const l = this.tour.steps.indexOf(t), p = this.tour.steps, v = (m, u, f) => {
      const h = a("button", {
        class: `card-preview__btn ${f ? "card-preview__btn--primary" : ""}`.trim(),
        type: "button"
      }, [m]), C = p[u];
      return C ? h.addEventListener("click", () => this.setActive(C.id)) : h.classList.add("card-preview__btn--disabled"), h;
    }, w = a("div", { class: "card-preview__footer" });
    w.append(v(t.backLabel, l - 1, !1), v(t.nextLabel, l + 1, !0)), e.append(s, w);
    const { top: _, left: k } = re({
      target: r,
      card: { width: e.offsetWidth, height: e.offsetHeight },
      side: t.placement,
      align: t.align,
      offset: this.tour.display.offset,
      viewport: { width: window.innerWidth, height: window.innerHeight }
    });
    e.style.left = `${k}px`, e.style.top = `${_}px`;
  }
  renderNav() {
    const e = a("div", { class: `nav nav--${this.navPosition}` }), t = x("build", "Build", this.mode === "build" ? "iconbtn--active" : "");
    t.addEventListener("click", () => {
      this.mode === "preview" && this.togglePreview();
    });
    const r = x("preview", "Preview", this.mode === "preview" ? "iconbtn--active" : "");
    r.addEventListener("click", () => this.togglePreview());
    const o = x("navFlip", "Move bar (top/bottom)");
    o.addEventListener("click", () => {
      this.navPosition = this.navPosition === "bottom" ? "top" : "bottom", this.render();
    });
    const i = x("close", "Close builder");
    return i.addEventListener("click", () => this.destroy()), e.append(t, r, a("div", { class: "nav__sep" }), o, i), e;
  }
  renderPanel() {
    const e = a("div", { class: `panel panel--${this.panelPosition}` });
    return this.view === "list" ? e.append(this.renderListHeader(), this.renderList()) : e.append(this.renderHeader(), this.renderToolbar(), this.renderTabs(), this.renderBody()), e;
  }
  renderListHeader() {
    const e = a("div", { class: "panel__header" }), t = a("span", { class: "panel__title panel__title--static" }, ["Tours"]), r = a("button", { class: "newtour", type: "button", title: "New tour" }, ["+ New"]);
    return r.addEventListener("click", () => this.createTour()), e.append(t, r), e;
  }
  renderList() {
    const e = a("div", { class: "panel__body" }), t = a("div", { class: "tourlist" });
    return this.tours.forEach((r) => {
      const o = a("div", { class: "tourrow" });
      o.addEventListener("click", () => this.openTour(r.id));
      const i = a("div", { class: "tourrow__main" });
      i.append(
        a("div", { class: "tourrow__name" }, [r.name]),
        a("div", { class: "tourrow__meta" }, [
          `${r.steps.length} step${r.steps.length === 1 ? "" : "s"}`
        ])
      );
      const d = a("span", { class: `status status--${r.status}` }, [r.status]), s = x("trash", "Delete tour");
      s.addEventListener("click", (l) => {
        l.stopPropagation(), this.deleteTour(r.id);
      }), o.append(i, d, s), t.append(o);
    }), e.append(t), e;
  }
  renderHeader() {
    const e = a("div", { class: "panel__header" }), t = a("input", { class: "panel__title", value: this.tour.name });
    t.value = this.tour.name, t.addEventListener("change", () => {
      this.tour.name = t.value.trim() || "Untitled tour", this.markDirty();
    });
    const r = a("span", { class: `status status--${this.tour.status}` }, [this.tour.status]);
    r.addEventListener("click", () => {
      this.tour.status = this.tour.status === "draft" ? "published" : "draft", this.render();
    }), r.setAttribute("title", "Toggle status"), r.style.cursor = "pointer";
    const o = x("menu", "Tour menu");
    return o.addEventListener("click", () => this.openMenu()), e.append(t, r, o), e;
  }
  renderToolbar() {
    const e = a("div", { class: "panel__toolbar" }), t = x("back", "Back to tours");
    t.addEventListener("click", () => {
      this.stopPicking(), this.view = "list", this.render();
    });
    const r = x("panelSide", "Move panel (left/right)");
    r.addEventListener("click", () => {
      this.panelPosition = this.panelPosition === "right" ? "left" : "right", this.render();
    });
    const o = x(
      "cursor",
      this.picking ? "Cancel picking" : "Pick element for active step",
      this.picking ? "iconbtn--active" : ""
    );
    return o.addEventListener("click", () => this.togglePicking()), e.append(t, a("div", { class: "spacer" }), r, o), e;
  }
  renderTabs() {
    const e = a("div", { class: "tabs" });
    for (const [t, r] of [
      ["steps", "Steps"],
      ["display", "Display"],
      ["assets", "Assets"]
    ]) {
      const o = a("button", { class: `tab ${this.tab === t ? "tab--active" : ""}`, type: "button" }, [r]);
      o.addEventListener("click", () => {
        this.tab = t, t === "display" && this.selectFirstResolvableStep(), this.render();
      }), e.append(o);
    }
    return e;
  }
  /** Activate the first step whose selector resolves to an on-page element. */
  selectFirstResolvableStep() {
    const e = this.tour.steps.find((t) => this.resolveTarget(t) !== null);
    e && (this.activeStepId = e.id);
  }
  /**
   * The Display tab: two sub-tabs of tour-level visual settings — Tour (the
   * target outline) and Card (the visitor tooltip) — tuned live.
   */
  renderDisplaySettings() {
    const e = a("div", { class: "settings" }), t = a("div", { class: "subtabs" });
    for (const [o, i] of [["tour", "Tour"], ["card", "Card"]]) {
      const d = a("button", { class: `subtab ${this.displaySub === o ? "subtab--active" : ""}`, type: "button" }, [i]);
      d.addEventListener("click", () => {
        this.displaySub = o, this.render();
      }), t.append(d);
    }
    if (e.append(t), !this.activeStep || !this.resolveTarget(this.activeStep))
      return e.append(
        a("div", { class: "assets-empty" }, [
          "Give a step a selector first — then its target frames here so you can tune the look."
        ])
      ), e;
    const r = this.tour.display;
    return this.displaySub === "tour" ? e.append(
      this.slider("Outline spacing", r.padding, 0, 40, (o) => r.padding = o),
      this.slider("Outline corner radius", r.radius, 0, 40, (o) => r.radius = o),
      a("div", { class: "settings__hint" }, [
        "The outline framing the target — applied in the builder and in the live tour spotlight."
      ])
    ) : e.append(
      this.slider("Card corner radius", r.cardRadius, 0, 32, (o) => r.cardRadius = o),
      this.slider("Distance from target", r.offset, 0, 48, (o) => r.offset = o),
      a("div", { class: "settings__hint" }, [
        "The visitor tooltip card. Preview it beside the highlighted target."
      ])
    ), e;
  }
  /** A labelled range slider that writes through `set` and re-draws overlays live. */
  slider(e, t, r, o, i) {
    const d = a("span", { class: "settings__value" }, [`${t}px`]), s = a("input", {
      class: "settings__slider",
      type: "range",
      min: String(r),
      max: String(o),
      step: "1"
    });
    s.value = String(t), s.addEventListener("input", () => {
      const v = Number(s.value);
      i(v), d.textContent = `${v}px`, this.updateOverlays(), this.markDirty();
    });
    const l = a("div", { class: "settings__row" });
    l.append(s, d);
    const p = a("div", { class: "settings__field" });
    return p.append(a("label", { class: "settings__label" }, [e]), l), p;
  }
  renderBody() {
    const e = a("div", { class: "panel__body" });
    if (this.tab === "assets")
      return e.append(a("div", { class: "assets-empty" }, ["Assets — coming soon"])), e;
    if (this.tab === "display")
      return e.append(this.renderDisplaySettings()), e;
    const t = a("div", { class: "steps" });
    return t.append(this.renderConnector(-1)), this.tour.steps.forEach((r, o) => {
      t.append(this.renderCard(r, o)), t.append(this.renderConnector(o));
    }), e.append(t), e;
  }
  renderConnector(e) {
    const t = a("div", { class: "connector" }), r = a("button", { class: "connector__add", title: "Add step", type: "button" }, ["+"]);
    return r.addEventListener("click", () => this.addStepAfter(e)), t.append(a("div", { class: "connector__line" }), r, a("div", { class: "connector__line" })), t;
  }
  renderCard(e, t) {
    const r = e.id === this.activeStepId, o = a("div", {
      class: `card ${r ? "card--active" : ""} ${e.included ? "" : "card--excluded"}`.trim()
    });
    return o.addEventListener("mousedown", () => this.setActive(e.id)), o.append(this.renderCardControl(e, t), this.renderCardContent(e), this.renderCardFooter(e)), r && o.append(this.renderPlacement(e)), o;
  }
  /**
   * Per-step placement control: a 12-anchor picker (each side × start/center/
   * end) around a mock target, plus a distance slider. Editing re-renders so
   * the on-page card and the active anchor update together.
   */
  renderPlacement(e) {
    const t = a("div", { class: "place" }), r = a("div", { class: "place__head" });
    r.append(a("span", { class: "place__label" }, ["Card position"]));
    const o = a("button", {
      class: `place__auto ${e.placement === "auto" ? "place__auto--active" : ""}`.trim(),
      type: "button",
      title: "Pick the side with the most room automatically"
    }, ["Auto"]);
    o.addEventListener("click", () => {
      e.placement = "auto", this.render();
    }), r.append(o), t.append(r);
    const i = a("div", { class: "place__grid" });
    i.append(a("div", { class: "place__el" }));
    const d = [
      { side: "top", align: "start", x: 40, y: 16 },
      { side: "top", align: "center", x: 66, y: 16 },
      { side: "top", align: "end", x: 92, y: 16 },
      { side: "bottom", align: "start", x: 40, y: 80 },
      { side: "bottom", align: "center", x: 66, y: 80 },
      { side: "bottom", align: "end", x: 92, y: 80 },
      { side: "left", align: "start", x: 24, y: 32 },
      { side: "left", align: "center", x: 24, y: 48 },
      { side: "left", align: "end", x: 24, y: 64 },
      { side: "right", align: "start", x: 108, y: 32 },
      { side: "right", align: "center", x: 108, y: 48 },
      { side: "right", align: "end", x: 108, y: 64 }
    ];
    for (const s of d) {
      const l = e.placement === s.side && e.align === s.align, p = a("button", {
        class: `place__dot ${l ? "place__dot--active" : ""}`.trim(),
        type: "button",
        title: `${s.side} · ${s.align}`
      });
      p.style.left = `${s.x - 6}px`, p.style.top = `${s.y - 6}px`, p.addEventListener("click", () => {
        e.placement = s.side, e.align = s.align, this.render();
      }), i.append(p);
    }
    return t.append(i), t;
  }
  renderCardControl(e, t) {
    const r = a("div", { class: "card__control" }), o = a("input", { class: "card__check", type: "checkbox", title: "Include in tour" });
    o.checked = e.included, o.addEventListener("change", () => {
      e.included = o.checked, this.render();
    });
    const i = a("span", { class: "card__index" }, [String(t + 1)]), d = a("span", { class: "card__type" });
    d.innerHTML = ne[e.type === "action" ? "bolt" : "step"], d.append(document.createTextNode(e.type === "action" ? "Action" : "Step"));
    const s = e.selectors[0], l = a("span", { class: `card__sel ${s ? "" : "card__sel--empty"}`.trim(), title: s ?? "" }, [
      s ?? "no selector"
    ]), p = x("trash", "Delete step");
    return p.addEventListener("click", () => this.removeStep(e.id)), r.append(o, i, d, a("div", { class: "spacer" }), l, p), r;
  }
  renderCardContent(e) {
    const t = a("div", {
      class: "card__content",
      contenteditable: "true",
      "data-placeholder": "Write the step text…",
      "data-step": e.id
    });
    return t.textContent = e.content, t.addEventListener("input", () => {
      e.content = t.textContent ?? "", this.updateOverlays(), this.markDirty();
    }), t.addEventListener("mousedown", () => {
      this.activeStepId !== e.id && (this.focusStepId = e.id);
    }), t;
  }
  renderCardFooter(e) {
    const t = a("div", { class: "card__footer" });
    return t.append(
      this.renderEditableButton(e, "backLabel"),
      this.renderEditableButton(e, "nextLabel")
    ), t;
  }
  /** A footer button that turns into a text input when clicked, to edit its label. */
  renderEditableButton(e, t) {
    const r = a("button", { class: "cardbtn", type: "button" }, [e[t]]);
    return r.addEventListener("click", (o) => {
      o.stopPropagation();
      const i = a("input", { class: "cardbtn cardbtn--edit", value: e[t] });
      i.value = e[t], r.replaceWith(i), i.focus(), i.select();
      const d = () => {
        e[t] = i.value.trim() || (t === "backLabel" ? "Back" : "Next"), i.replaceWith(this.renderEditableButton(e, t)), this.markDirty();
      };
      i.addEventListener("blur", d), i.addEventListener("keydown", (s) => {
        s.key === "Enter" && i.blur(), s.key === "Escape" && (i.value = e[t], i.blur());
      });
    }), r;
  }
  // ---------- misc ----------
  openMenu() {
    const e = this.export(), t = e.ok ? JSON.stringify(e.tour, null, 2) : `INVALID:
${e.errors.join(`
`)}`;
    this.log.log("tour JSON", t), window.prompt("Tour JSON (copy):", e.ok ? JSON.stringify(e.tour) : "");
  }
  /** Focus a card's content area and place the caret at the end. */
  focusContent(e) {
    var i;
    const t = (i = this.root) == null ? void 0 : i.querySelector(`.card__content[data-step="${e}"]`);
    if (!t) return;
    t.focus();
    const r = document.createRange();
    r.selectNodeContents(t), r.collapse(!1);
    const o = window.getSelection();
    o == null || o.removeAllRanges(), o == null || o.addRange(r);
  }
}
export {
  se as TourBuilder,
  H as createDraftStep,
  M as createDraftTour,
  ye as createLocalStore,
  we as createWordPressStore,
  ie as normalizeTours,
  me as toTour
};
//# sourceMappingURL=tours-editor.js.map
