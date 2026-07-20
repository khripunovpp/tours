const se = `
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
`, ae = `
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
function R() {
  if (T !== null) return T;
  try {
    T = new URLSearchParams(window.location.search).has("use_logs");
  } catch {
    T = !1;
  }
  return T;
}
function M(i) {
  const e = `[tours:${i}]`;
  return {
    log: (...t) => {
      R() && console.log(e, ...t);
    },
    warn: (...t) => {
      R() && console.warn(e, ...t);
    },
    error: (...t) => {
      R() && console.error(e, ...t);
    }
  };
}
function de(i) {
  if (i.id)
    return `#${CSS.escape(i.id)}`;
  const e = [];
  let t = i;
  for (; t && t !== document.body && t.nodeType === 1; ) {
    const r = t.tagName.toLowerCase(), n = t.parentElement;
    if (!n) {
      e.unshift(r);
      break;
    }
    const o = Array.from(n.children).filter(
      (a) => a.tagName === t.tagName
    );
    if (o.length > 1) {
      const a = o.indexOf(t) + 1;
      e.unshift(`${r}:nth-of-type(${a})`);
    } else
      e.unshift(r);
    t = n;
  }
  return `body > ${e.join(" > ")}`;
}
function le(i, e = {}) {
  const t = M("picker");
  let r = null, n = null, o = null, a = !1;
  function d(p) {
    if (p === r) return !0;
    for (const u of e.ignore ?? [])
      if (u && u.contains(p)) return !0;
    return !1;
  }
  function c() {
    if (r) return;
    r = document.createElement("div"), r.setAttribute("data-tours-picker", ""), n = r.attachShadow({ mode: "open" });
    const p = document.createElement("style");
    p.textContent = se, n.appendChild(p), o = document.createElement("div"), o.className = "tours-picker-overlay", o.style.display = "none", n.appendChild(o);
    const u = document.createElement("div");
    u.className = "tours-picker-hint", u.textContent = "Hover and click an element • Esc to cancel", n.appendChild(u), document.body.appendChild(r);
  }
  function b(p, u) {
    const h = document.elementFromPoint(p, u);
    return !h || d(h) ? null : h;
  }
  function v(p) {
    if (!a || !o) return;
    const u = b(p.clientX, p.clientY);
    if (!u) {
      o.style.display = "none";
      return;
    }
    const h = u.getBoundingClientRect();
    o.style.display = "block", o.style.left = `${h.left}px`, o.style.top = `${h.top}px`, o.style.width = `${h.width}px`, o.style.height = `${h.height}px`;
  }
  function m(p) {
    if (!a) return;
    const u = b(p.clientX, p.clientY);
    if (p.preventDefault(), p.stopPropagation(), !u) return;
    const h = de(u);
    t.log("picked", h), y(), i([h]);
  }
  function k(p) {
    p.key === "Escape" && (p.preventDefault(), y());
  }
  function E() {
    a || (a = !0, t.log("start"), c(), document.addEventListener("mousemove", v, !0), document.addEventListener("click", m, !0), document.addEventListener("keydown", k, !0));
  }
  function y() {
    a && (a = !1, document.removeEventListener("mousemove", v, !0), document.removeEventListener("click", m, !0), document.removeEventListener("keydown", k, !0), r && r.parentNode && r.parentNode.removeChild(r), r = null, n = null, o = null);
  }
  return { start: E, stop: y };
}
const O = 6, U = 6, j = 10, Z = 12, ce = 1;
function w(i) {
  return typeof i == "object" && i !== null && !Array.isArray(i);
}
function J(i) {
  return w(i) && typeof i.default == "string";
}
const Y = ["top", "bottom", "left", "right"], q = ["start", "center", "end"], X = ["mobile", "tablet", "desktop"], G = ["click", "input", "navigate", "none"];
function Q(i, e, t) {
  if (!w(i)) {
    t.push(`${e} must be an object`);
    return;
  }
  const r = typeof i.glob == "string" && i.glob.length > 0, n = typeof i.regex == "string" && i.regex.length > 0;
  if (!r && !n && t.push(`${e} must have a non-empty "glob" or "regex"`), n)
    try {
      new RegExp(i.regex);
    } catch {
      t.push(`${e}.regex is not a valid regular expression`);
    }
}
function K(i, e, t) {
  if (!w(i)) {
    t.push(`${e} must be an object`);
    return;
  }
  i.url !== void 0 && Q(i.url, `${e}.url`, t), i.role !== void 0 && typeof i.role != "string" && t.push(`${e}.role must be a string`), i.firstVisitOnly !== void 0 && typeof i.firstVisitOnly != "boolean" && t.push(`${e}.firstVisitOnly must be a boolean`), i.device !== void 0 && !X.includes(i.device) && t.push(`${e}.device must be one of ${X.join("|")}`), i.unlessSeen !== void 0 && typeof i.unlessSeen != "boolean" && t.push(`${e}.unlessSeen must be a boolean`), i.maxShows !== void 0 && (typeof i.maxShows != "number" || i.maxShows < 0) && t.push(`${e}.maxShows must be a non-negative number`);
}
function pe(i, e, t) {
  if (!w(i)) {
    t.push(`${e} must be an object`);
    return;
  }
  G.includes(i.type) || t.push(`${e}.type must be one of ${G.join("|")}`), i.url !== void 0 && typeof i.url != "string" && t.push(`${e}.url must be a string`), i.value !== void 0 && typeof i.value != "string" && t.push(`${e}.value must be a string`);
}
function ue(i) {
  const e = [];
  if (!w(i))
    return { ok: !1, errors: ["tour must be an object"] };
  if ((typeof i.id != "string" || i.id.length === 0) && e.push("tour.id must be a non-empty string"), typeof i.schemaVersion != "number" && e.push("tour.schemaVersion must be a number"), J(i.title) || e.push('tour.title must be a localized text with a string "default"'), Array.isArray(i.steps) ? i.steps.length === 0 ? e.push("tour.steps must contain at least one step") : i.steps.forEach((t, r) => {
    if (!w(t)) {
      e.push(`steps[${r}] must be an object`);
      return;
    }
    (typeof t.id != "string" || t.id.length === 0) && e.push(`steps[${r}].id must be a non-empty string`), (!Array.isArray(t.selectors) || t.selectors.length === 0 || !t.selectors.every((n) => typeof n == "string" && n.length > 0)) && e.push(`steps[${r}].selectors must be a non-empty array of non-empty strings`), J(t.content) || e.push(`steps[${r}].content must be a localized text with a string "default"`), t.placement !== void 0 && !Y.includes(t.placement) && e.push(`steps[${r}].placement must be one of ${Y.join("|")}`), t.align !== void 0 && !q.includes(t.align) && e.push(`steps[${r}].align must be one of ${q.join("|")}`), t.offset !== void 0 && (typeof t.offset != "number" || t.offset < 0) && e.push(`steps[${r}].offset must be a non-negative number`), t.pageUrl !== void 0 && Q(t.pageUrl, `steps[${r}].pageUrl`, e), t.condition !== void 0 && K(t.condition, `steps[${r}].condition`, e), t.action !== void 0 && pe(t.action, `steps[${r}].action`, e);
  }) : e.push("tour.steps must be an array"), i.display !== void 0)
    if (!w(i.display))
      e.push("tour.display must be an object");
    else
      for (const t of ["padding", "radius", "cardRadius"]) {
        const r = i.display[t];
        r !== void 0 && (typeof r != "number" || r < 0) && e.push(`tour.display.${t} must be a non-negative number`);
      }
  return i.rules !== void 0 && (Array.isArray(i.rules) ? i.rules.forEach((t, r) => {
    if (!w(t)) {
      e.push(`rules[${r}] must be an object`);
      return;
    }
    t.tourId !== void 0 && typeof t.tourId != "string" && e.push(`rules[${r}].tourId must be a string`), t.when === void 0 ? e.push(`rules[${r}].when is required`) : K(t.when, `rules[${r}].when`, e);
  }) : e.push("tour.rules must be an array")), e.length > 0 ? { ok: !1, errors: e } : { ok: !0, tour: i };
}
function ee(i) {
  const { target: e, card: t, side: r, align: n, offset: o, viewport: a } = i;
  let d = 0, c = 0;
  return r === "top" || r === "bottom" ? (d = r === "top" ? e.top - t.height - o : e.bottom + o, c = n === "start" ? e.left : n === "end" ? e.right - t.width : e.left + e.width / 2 - t.width / 2) : (c = r === "left" ? e.left - t.width - o : e.right + o, d = n === "start" ? e.top : n === "end" ? e.bottom - t.height : e.top + e.height / 2 - t.height / 2), c = Math.max(8, Math.min(c, a.width - t.width - 8)), d = Math.max(8, Math.min(d, a.height - t.height - 8)), { top: d, left: c };
}
function he(i) {
  var F, H, W;
  const e = M("player");
  let t = null, r = null, n = null, o = null, a = !1, d = 0;
  const c = ((F = i.display) == null ? void 0 : F.padding) ?? O, b = ((H = i.display) == null ? void 0 : H.radius) ?? U, v = ((W = i.display) == null ? void 0 : W.cardRadius) ?? j;
  function m(l) {
    for (const f of l.selectors)
      try {
        const g = document.querySelector(f);
        if (g) return g;
      } catch {
      }
    return null;
  }
  function k() {
    if (t) return;
    t = document.createElement("div"), t.setAttribute("data-tours-player", ""), r = t.attachShadow({ mode: "open" });
    const l = document.createElement("style");
    l.textContent = ae, r.appendChild(l);
    const f = document.createElement("div");
    f.className = "tours-backdrop", r.appendChild(f), n = document.createElement("div"), n.className = "tours-spotlight", n.style.borderRadius = `${b}px`, r.appendChild(n), o = document.createElement("div"), o.className = "tours-tooltip", o.style.borderRadius = `${v}px`, r.appendChild(o), document.body.appendChild(t);
  }
  function E(l) {
    n && (n.style.display = "block", n.style.left = `${l.left - c}px`, n.style.top = `${l.top - c}px`, n.style.width = `${l.width + c * 2}px`, n.style.height = `${l.height + c * 2}px`);
  }
  function y(l, f) {
    if (!o) return;
    const { top: g, left: $ } = ee({
      target: l,
      card: { width: o.offsetWidth, height: o.offsetHeight },
      side: f.placement ?? "bottom",
      align: f.align ?? "center",
      offset: f.offset ?? Z,
      viewport: { width: window.innerWidth, height: window.innerHeight }
    });
    o.style.left = `${$}px`, o.style.top = `${g}px`;
  }
  function p(l) {
    if (!o) return;
    const f = i.steps.length;
    o.textContent = "";
    const g = document.createElement("button");
    g.className = "tours-close", g.type = "button", g.textContent = "×", g.setAttribute("aria-label", "Close"), g.addEventListener("click", S), o.appendChild(g);
    const $ = document.createElement("p");
    $.className = "tours-tooltip__content", $.textContent = l.content.default, o.appendChild($);
    const A = document.createElement("div");
    A.className = "tours-tooltip__footer";
    const z = document.createElement("span");
    z.className = "tours-tooltip__progress", z.textContent = `Step ${d + 1} of ${f}`, A.appendChild(z);
    const P = document.createElement("div");
    P.className = "tours-tooltip__buttons";
    const C = document.createElement("button");
    C.className = "tours-btn", C.type = "button", C.textContent = "Back", C.disabled = d === 0, C.addEventListener("click", N), P.appendChild(C);
    const L = document.createElement("button");
    L.className = "tours-btn tours-btn--primary", L.type = "button", L.textContent = d === f - 1 ? "Done" : "Next", L.addEventListener("click", I), P.appendChild(L), A.appendChild(P), o.appendChild(A);
  }
  function u() {
    if (!a) return;
    const l = i.steps[d];
    if (!l) {
      S();
      return;
    }
    e.log("render step", d, l.id);
    const f = m(l);
    if (!f) {
      e.warn(`step "${l.id}" skipped: no element for selectors`, l.selectors), d < i.steps.length - 1 ? (d += 1, u()) : S();
      return;
    }
    k(), f.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" }), p(l);
    const g = f.getBoundingClientRect();
    E(g), y(g, l);
  }
  function h(l) {
    a && (l.key === "Escape" ? (l.preventDefault(), S()) : l.key === "ArrowRight" ? I() : l.key === "ArrowLeft" && N());
  }
  function _() {
    if (!a) return;
    const l = i.steps[d];
    if (!l) return;
    const f = m(l);
    if (!f) return;
    const g = f.getBoundingClientRect();
    E(g), y(g, l);
  }
  function oe() {
    a || i.steps.length !== 0 && (a = !0, d = 0, e.log("start", i.id, `${i.steps.length} steps`), k(), window.addEventListener("keydown", h, !0), window.addEventListener("resize", _, !0), window.addEventListener("scroll", _, !0), u());
  }
  function S() {
    a && (a = !1, e.log("stop"), window.removeEventListener("keydown", h, !0), window.removeEventListener("resize", _, !0), window.removeEventListener("scroll", _, !0), t && t.parentNode && t.parentNode.removeChild(t), t = null, r = null, n = null, o = null);
  }
  function I() {
    if (a) {
      if (d >= i.steps.length - 1) {
        S();
        return;
      }
      d += 1, u();
    }
  }
  function N() {
    a && (d <= 0 || (d -= 1, u()));
  }
  return { start: oe, stop: S, next: I, prev: N };
}
const fe = `
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
.place__label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--e-muted);
  margin-bottom: 8px;
}
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
`, te = {
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
let ge = 0;
function re(i) {
  const e = typeof crypto < "u" && "randomUUID" in crypto ? crypto.randomUUID() : `${ge++}`;
  return `${i}-${e}`;
}
function V(i = "step") {
  return {
    id: re("step"),
    type: i,
    included: !0,
    selectors: [],
    content: "",
    placement: "bottom",
    align: "center",
    offset: Z,
    backLabel: "Back",
    nextLabel: "Next"
  };
}
function D() {
  return {
    id: re("tour"),
    name: "Untitled tour",
    status: "draft",
    steps: [V()],
    display: {
      padding: O,
      radius: U,
      cardRadius: j
    }
  };
}
function ne(i) {
  var t, r, n;
  if (!Array.isArray(i)) return [];
  const e = [];
  for (const o of i) {
    if (!o || typeof o != "object") continue;
    const a = o;
    typeof a.id != "string" || !Array.isArray(a.steps) || e.push({
      id: a.id,
      name: typeof a.name == "string" ? a.name : "Untitled tour",
      status: a.status === "published" ? "published" : "draft",
      display: {
        padding: B((t = a.display) == null ? void 0 : t.padding, O),
        radius: B((r = a.display) == null ? void 0 : r.radius, U),
        cardRadius: B((n = a.display) == null ? void 0 : n.cardRadius, j)
      },
      steps: a.steps.filter((d) => !!d && typeof d == "object").map((d) => ({
        ...V(d.type === "action" ? "action" : "step"),
        ...d
      }))
    });
  }
  return e;
}
function B(i, e) {
  return typeof i == "number" && i >= 0 ? i : e;
}
function be(i) {
  const e = i.steps.filter((r) => r.included && r.selectors.length > 0).map((r) => ({
    id: r.id,
    selectors: r.selectors,
    content: { default: r.content },
    placement: r.placement,
    align: r.align,
    offset: r.offset
  })), t = {
    id: i.id,
    schemaVersion: ce,
    title: { default: i.name },
    steps: e,
    display: {
      padding: i.display.padding,
      radius: i.display.radius,
      cardRadius: i.display.cardRadius
    }
  };
  return ue(t);
}
function ve(i = "tours:drafts") {
  return {
    async load() {
      try {
        const e = localStorage.getItem(i);
        return e ? ne(JSON.parse(e)) : null;
      } catch {
        return null;
      }
    },
    async save(e) {
      try {
        localStorage.setItem(i, JSON.stringify(e));
      } catch {
      }
    }
  };
}
function xe(i) {
  const e = { "Content-Type": "application/json" };
  return i.nonce && (e["X-WP-Nonce"] = i.nonce), {
    async load() {
      const t = await fetch(i.url, { headers: e, credentials: "same-origin" });
      if (!t.ok) throw new Error(`WordPress load failed: ${t.status}`);
      return ne(await t.json());
    },
    async save(t) {
      const r = await fetch(i.url, {
        method: "POST",
        headers: e,
        credentials: "same-origin",
        body: JSON.stringify(t)
      });
      if (!r.ok) throw new Error(`WordPress save failed: ${r.status}`);
    }
  };
}
function s(i, e = {}, t = []) {
  const r = document.createElement(i);
  for (const [n, o] of Object.entries(e)) r.setAttribute(n, o);
  for (const n of t) r.append(typeof n == "string" ? document.createTextNode(n) : n);
  return r;
}
function x(i, e, t = "") {
  const r = s("button", { class: `iconbtn ${t}`.trim(), title: e, type: "button" });
  return r.innerHTML = te[i] ?? "", r;
}
class ie {
  constructor(e = {}) {
    var t;
    this.options = e, this.log = M("editor"), this.host = null, this.root = null, this.tours = [D()], this.openTourId = this.tours[0].id, this.view = "edit", this.activeStepId = ((t = this.tours[0].steps[0]) == null ? void 0 : t.id) ?? null, this.tab = "steps", this.displaySub = "tour", this.mode = "build", this.picker = null, this.picking = !1, this.player = null, this.highlight = null, this.cardPreview = null, this.focusStepId = null, this.onViewportChange = () => this.updateOverlays(), this.saveTimer = null, this.navPosition = e.navPosition ?? "bottom", this.panelPosition = e.panelPosition ?? "right", this.local = ve(e.storageKey), this.secondary = e.storage ?? null;
  }
  /**
   * Auto-mount when the page URL carries the flag (default `?tours-edit=1`), so
   * a site owner can enable the builder without touching code. Returns the
   * instance if mounted, otherwise null.
   */
  static fromUrl(e = {}) {
    const t = e.urlFlag ?? "tours-edit", r = new URLSearchParams(window.location.search).get(t);
    if (r === null || r === "0" || r === "false") return null;
    const n = new ie(e);
    return n.mount(), n;
  }
  /** Render the UI onto the page. Idempotent. */
  mount() {
    if (this.host || this.options.mode === "off") return;
    this.host = s("div", { "data-tours-editor": "" }), this.root = this.host.attachShadow({ mode: "open" });
    const e = document.createElement("style");
    e.textContent = fe, this.root.appendChild(e), this.highlight = s("div", { class: "highlight" }), this.cardPreview = s("div", { class: "card-preview" }, ["Step tooltip preview"]), this.root.append(this.highlight, this.cardPreview), document.body.appendChild(this.host), window.addEventListener("scroll", this.onViewportChange, !0), window.addEventListener("resize", this.onViewportChange, !0), this.log.log("mounted"), this.render(), this.hydrate();
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
    return be(this.tour);
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
    const e = D();
    this.tours.push(e), this.openTour(e.id);
  }
  deleteTour(e) {
    const t = this.tours.findIndex((r) => r.id === e);
    t !== -1 && (this.tours.splice(t, 1), this.tours.length === 0 && this.tours.push(D()), this.openTourId === e && (this.openTourId = this.tours[0].id), this.render());
  }
  setActive(e) {
    this.activeStepId !== e && (this.activeStepId = e, this.render());
  }
  addStepAfter(e, t = "step") {
    const r = V(t);
    this.tour.steps.splice(e + 1, 0, r), this.activeStepId = r.id, this.render();
  }
  removeStep(e) {
    var r;
    const t = this.tour.steps.findIndex((n) => n.id === e);
    t !== -1 && (this.tour.steps.splice(t, 1), this.activeStepId === e && (this.activeStepId = ((r = this.tour.steps[Math.max(0, t - 1)]) == null ? void 0 : r.id) ?? null), this.render());
  }
  // ---------- picker (selector search) ----------
  togglePicking() {
    if (this.picking) {
      this.stopPicking();
      return;
    }
    const e = this.activeStep;
    e && (this.picking = !0, this.picker = le(
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
    this.mode = "preview", this.render(), this.player = he(e.tour), this.player.start();
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
    const n = this.activeStep, o = n && n.selectors.length > 0 ? this.resolveTarget(n) : null;
    if (!n || !o) return r();
    const a = o.getBoundingClientRect(), { padding: d, radius: c, cardRadius: b } = this.tour.display;
    e.className = `highlight ${this.tab === "display" ? "highlight--settings" : ""}`.trim(), e.style.display = "block", e.style.left = `${a.left - d}px`, e.style.top = `${a.top - d}px`, e.style.width = `${a.width + d * 2}px`, e.style.height = `${a.height + d * 2}px`, e.style.borderRadius = `${c}px`, this.drawStepCard(t, n, a, b);
  }
  /**
   * Render the active step's card near its target, as the visitor will see it.
   * Shown when the step has any content; in the Card sub-tab a placeholder is
   * used instead so the radius stays visible before any text is written.
   */
  drawStepCard(e, t, r, n) {
    const o = t.content.trim(), a = this.tab === "display" && this.displaySub === "card";
    if (!o && !a) {
      e.style.display = "none";
      return;
    }
    e.textContent = "", e.style.display = "block", e.style.borderRadius = `${n}px`;
    const d = s("div", { class: "card-preview__content" }, [o || "Step tooltip preview"]);
    o || d.classList.add("card-preview__content--placeholder");
    const c = this.tour.steps.indexOf(t), b = this.tour.steps, v = (y, p, u) => {
      const h = s("button", {
        class: `card-preview__btn ${u ? "card-preview__btn--primary" : ""}`.trim(),
        type: "button"
      }, [y]), _ = b[p];
      return _ ? h.addEventListener("click", () => this.setActive(_.id)) : h.classList.add("card-preview__btn--disabled"), h;
    }, m = s("div", { class: "card-preview__footer" });
    m.append(v(t.backLabel, c - 1, !1), v(t.nextLabel, c + 1, !0)), e.append(d, m);
    const { top: k, left: E } = ee({
      target: r,
      card: { width: e.offsetWidth, height: e.offsetHeight },
      side: t.placement,
      align: t.align,
      offset: t.offset,
      viewport: { width: window.innerWidth, height: window.innerHeight }
    });
    e.style.left = `${E}px`, e.style.top = `${k}px`;
  }
  renderNav() {
    const e = s("div", { class: `nav nav--${this.navPosition}` }), t = x("build", "Build", this.mode === "build" ? "iconbtn--active" : "");
    t.addEventListener("click", () => {
      this.mode === "preview" && this.togglePreview();
    });
    const r = x("preview", "Preview", this.mode === "preview" ? "iconbtn--active" : "");
    r.addEventListener("click", () => this.togglePreview());
    const n = x("navFlip", "Move bar (top/bottom)");
    n.addEventListener("click", () => {
      this.navPosition = this.navPosition === "bottom" ? "top" : "bottom", this.render();
    });
    const o = x("close", "Close builder");
    return o.addEventListener("click", () => this.destroy()), e.append(t, r, s("div", { class: "nav__sep" }), n, o), e;
  }
  renderPanel() {
    const e = s("div", { class: `panel panel--${this.panelPosition}` });
    return this.view === "list" ? e.append(this.renderListHeader(), this.renderList()) : e.append(this.renderHeader(), this.renderToolbar(), this.renderTabs(), this.renderBody()), e;
  }
  renderListHeader() {
    const e = s("div", { class: "panel__header" }), t = s("span", { class: "panel__title panel__title--static" }, ["Tours"]), r = s("button", { class: "newtour", type: "button", title: "New tour" }, ["+ New"]);
    return r.addEventListener("click", () => this.createTour()), e.append(t, r), e;
  }
  renderList() {
    const e = s("div", { class: "panel__body" }), t = s("div", { class: "tourlist" });
    return this.tours.forEach((r) => {
      const n = s("div", { class: "tourrow" });
      n.addEventListener("click", () => this.openTour(r.id));
      const o = s("div", { class: "tourrow__main" });
      o.append(
        s("div", { class: "tourrow__name" }, [r.name]),
        s("div", { class: "tourrow__meta" }, [
          `${r.steps.length} step${r.steps.length === 1 ? "" : "s"}`
        ])
      );
      const a = s("span", { class: `status status--${r.status}` }, [r.status]), d = x("trash", "Delete tour");
      d.addEventListener("click", (c) => {
        c.stopPropagation(), this.deleteTour(r.id);
      }), n.append(o, a, d), t.append(n);
    }), e.append(t), e;
  }
  renderHeader() {
    const e = s("div", { class: "panel__header" }), t = s("input", { class: "panel__title", value: this.tour.name });
    t.value = this.tour.name, t.addEventListener("change", () => {
      this.tour.name = t.value.trim() || "Untitled tour", this.markDirty();
    });
    const r = s("span", { class: `status status--${this.tour.status}` }, [this.tour.status]);
    r.addEventListener("click", () => {
      this.tour.status = this.tour.status === "draft" ? "published" : "draft", this.render();
    }), r.setAttribute("title", "Toggle status"), r.style.cursor = "pointer";
    const n = x("menu", "Tour menu");
    return n.addEventListener("click", () => this.openMenu()), e.append(t, r, n), e;
  }
  renderToolbar() {
    const e = s("div", { class: "panel__toolbar" }), t = x("back", "Back to tours");
    t.addEventListener("click", () => {
      this.stopPicking(), this.view = "list", this.render();
    });
    const r = x("panelSide", "Move panel (left/right)");
    r.addEventListener("click", () => {
      this.panelPosition = this.panelPosition === "right" ? "left" : "right", this.render();
    });
    const n = x(
      "cursor",
      this.picking ? "Cancel picking" : "Pick element for active step",
      this.picking ? "iconbtn--active" : ""
    );
    return n.addEventListener("click", () => this.togglePicking()), e.append(t, s("div", { class: "spacer" }), r, n), e;
  }
  renderTabs() {
    const e = s("div", { class: "tabs" });
    for (const [t, r] of [
      ["steps", "Steps"],
      ["display", "Display"],
      ["assets", "Assets"]
    ]) {
      const n = s("button", { class: `tab ${this.tab === t ? "tab--active" : ""}`, type: "button" }, [r]);
      n.addEventListener("click", () => {
        this.tab = t, t === "display" && this.selectFirstResolvableStep(), this.render();
      }), e.append(n);
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
    const e = s("div", { class: "settings" }), t = s("div", { class: "subtabs" });
    for (const [n, o] of [["tour", "Tour"], ["card", "Card"]]) {
      const a = s("button", { class: `subtab ${this.displaySub === n ? "subtab--active" : ""}`, type: "button" }, [o]);
      a.addEventListener("click", () => {
        this.displaySub = n, this.render();
      }), t.append(a);
    }
    if (e.append(t), !this.activeStep || !this.resolveTarget(this.activeStep))
      return e.append(
        s("div", { class: "assets-empty" }, [
          "Give a step a selector first — then its target frames here so you can tune the look."
        ])
      ), e;
    const r = this.tour.display;
    return this.displaySub === "tour" ? e.append(
      this.slider("Outline spacing", r.padding, 0, 40, (n) => r.padding = n),
      this.slider("Outline corner radius", r.radius, 0, 40, (n) => r.radius = n),
      s("div", { class: "settings__hint" }, [
        "The outline framing the target — applied in the builder and in the live tour spotlight."
      ])
    ) : e.append(
      this.slider("Card corner radius", r.cardRadius, 0, 32, (n) => r.cardRadius = n),
      s("div", { class: "settings__hint" }, [
        "The visitor tooltip card. Preview it beside the highlighted target."
      ])
    ), e;
  }
  /** A labelled range slider that writes through `set` and re-draws overlays live. */
  slider(e, t, r, n, o) {
    const a = s("span", { class: "settings__value" }, [`${t}px`]), d = s("input", {
      class: "settings__slider",
      type: "range",
      min: String(r),
      max: String(n),
      step: "1"
    });
    d.value = String(t), d.addEventListener("input", () => {
      const v = Number(d.value);
      o(v), a.textContent = `${v}px`, this.updateOverlays(), this.markDirty();
    });
    const c = s("div", { class: "settings__row" });
    c.append(d, a);
    const b = s("div", { class: "settings__field" });
    return b.append(s("label", { class: "settings__label" }, [e]), c), b;
  }
  renderBody() {
    const e = s("div", { class: "panel__body" });
    if (this.tab === "assets")
      return e.append(s("div", { class: "assets-empty" }, ["Assets — coming soon"])), e;
    if (this.tab === "display")
      return e.append(this.renderDisplaySettings()), e;
    const t = s("div", { class: "steps" });
    return t.append(this.renderConnector(-1)), this.tour.steps.forEach((r, n) => {
      t.append(this.renderCard(r, n)), t.append(this.renderConnector(n));
    }), e.append(t), e;
  }
  renderConnector(e) {
    const t = s("div", { class: "connector" }), r = s("button", { class: "connector__add", title: "Add step", type: "button" }, ["+"]);
    return r.addEventListener("click", () => this.addStepAfter(e)), t.append(s("div", { class: "connector__line" }), r, s("div", { class: "connector__line" })), t;
  }
  renderCard(e, t) {
    const r = e.id === this.activeStepId, n = s("div", {
      class: `card ${r ? "card--active" : ""} ${e.included ? "" : "card--excluded"}`.trim()
    });
    return n.addEventListener("mousedown", () => this.setActive(e.id)), n.append(this.renderCardControl(e, t), this.renderCardContent(e), this.renderCardFooter(e)), r && n.append(this.renderPlacement(e)), n;
  }
  /**
   * Per-step placement control: a 12-anchor picker (each side × start/center/
   * end) around a mock target, plus a distance slider. Editing re-renders so
   * the on-page card and the active anchor update together.
   */
  renderPlacement(e) {
    const t = s("div", { class: "place" });
    t.append(s("div", { class: "place__label" }, ["Card position"]));
    const r = s("div", { class: "place__grid" });
    r.append(s("div", { class: "place__el" }));
    const n = [
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
    for (const o of n) {
      const a = e.placement === o.side && e.align === o.align, d = s("button", {
        class: `place__dot ${a ? "place__dot--active" : ""}`.trim(),
        type: "button",
        title: `${o.side} · ${o.align}`
      });
      d.style.left = `${o.x - 6}px`, d.style.top = `${o.y - 6}px`, d.addEventListener("click", () => {
        e.placement = o.side, e.align = o.align, this.render();
      }), r.append(d);
    }
    return t.append(r), t.append(this.slider("Distance", e.offset, 0, 48, (o) => e.offset = o)), t;
  }
  renderCardControl(e, t) {
    const r = s("div", { class: "card__control" }), n = s("input", { class: "card__check", type: "checkbox", title: "Include in tour" });
    n.checked = e.included, n.addEventListener("change", () => {
      e.included = n.checked, this.render();
    });
    const o = s("span", { class: "card__index" }, [String(t + 1)]), a = s("span", { class: "card__type" });
    a.innerHTML = te[e.type === "action" ? "bolt" : "step"], a.append(document.createTextNode(e.type === "action" ? "Action" : "Step"));
    const d = e.selectors[0], c = s("span", { class: `card__sel ${d ? "" : "card__sel--empty"}`.trim(), title: d ?? "" }, [
      d ?? "no selector"
    ]), b = x("trash", "Delete step");
    return b.addEventListener("click", () => this.removeStep(e.id)), r.append(n, o, a, s("div", { class: "spacer" }), c, b), r;
  }
  renderCardContent(e) {
    const t = s("div", {
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
    const t = s("div", { class: "card__footer" });
    return t.append(
      this.renderEditableButton(e, "backLabel"),
      this.renderEditableButton(e, "nextLabel")
    ), t;
  }
  /** A footer button that turns into a text input when clicked, to edit its label. */
  renderEditableButton(e, t) {
    const r = s("button", { class: "cardbtn", type: "button" }, [e[t]]);
    return r.addEventListener("click", (n) => {
      n.stopPropagation();
      const o = s("input", { class: "cardbtn cardbtn--edit", value: e[t] });
      o.value = e[t], r.replaceWith(o), o.focus(), o.select();
      const a = () => {
        e[t] = o.value.trim() || (t === "backLabel" ? "Back" : "Next"), o.replaceWith(this.renderEditableButton(e, t)), this.markDirty();
      };
      o.addEventListener("blur", a), o.addEventListener("keydown", (d) => {
        d.key === "Enter" && o.blur(), d.key === "Escape" && (o.value = e[t], o.blur());
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
    var o;
    const t = (o = this.root) == null ? void 0 : o.querySelector(`.card__content[data-step="${e}"]`);
    if (!t) return;
    t.focus();
    const r = document.createRange();
    r.selectNodeContents(t), r.collapse(!1);
    const n = window.getSelection();
    n == null || n.removeAllRanges(), n == null || n.addRange(r);
  }
}
export {
  ie as TourBuilder,
  V as createDraftStep,
  D as createDraftTour,
  ve as createLocalStore,
  xe as createWordPressStore,
  ne as normalizeTours,
  be as toTour
};
//# sourceMappingURL=tours-editor.js.map
