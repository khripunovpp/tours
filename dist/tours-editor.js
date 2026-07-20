const ot = `
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
`, it = `
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
let A = null;
function M() {
  if (A !== null) return A;
  try {
    A = new URLSearchParams(window.location.search).has("use_logs");
  } catch {
    A = !1;
  }
  return A;
}
function O(r) {
  const t = `[tours:${r}]`;
  return {
    log: (...e) => {
      M() && console.log(t, ...e);
    },
    warn: (...e) => {
      M() && console.warn(t, ...e);
    },
    error: (...e) => {
      M() && console.error(t, ...e);
    }
  };
}
function st(r) {
  if (r.id)
    return `#${CSS.escape(r.id)}`;
  const t = [];
  let e = r;
  for (; e && e !== document.body && e.nodeType === 1; ) {
    const n = e.tagName.toLowerCase(), o = e.parentElement;
    if (!o) {
      t.unshift(n);
      break;
    }
    const i = Array.from(o.children).filter(
      (s) => s.tagName === e.tagName
    );
    if (i.length > 1) {
      const s = i.indexOf(e) + 1;
      t.unshift(`${n}:nth-of-type(${s})`);
    } else
      t.unshift(n);
    e = o;
  }
  return `body > ${t.join(" > ")}`;
}
function at(r, t = {}) {
  const e = O("picker");
  let n = null, o = null, i = null, s = !1;
  function d(p) {
    if (p === n) return !0;
    for (const h of t.ignore ?? [])
      if (h && h.contains(p)) return !0;
    return !1;
  }
  function c() {
    if (n) return;
    n = document.createElement("div"), n.setAttribute("data-tours-picker", ""), o = n.attachShadow({ mode: "open" });
    const p = document.createElement("style");
    p.textContent = ot, o.appendChild(p), i = document.createElement("div"), i.className = "tours-picker-overlay", i.style.display = "none", o.appendChild(i);
    const h = document.createElement("div");
    h.className = "tours-picker-hint", h.textContent = "Hover and click an element • Esc to cancel", o.appendChild(h), document.body.appendChild(n);
  }
  function f(p, h) {
    const v = document.elementFromPoint(p, h);
    return !v || d(v) ? null : v;
  }
  function b(p) {
    if (!s || !i) return;
    const h = f(p.clientX, p.clientY);
    if (!h) {
      i.style.display = "none";
      return;
    }
    const v = h.getBoundingClientRect();
    i.style.display = "block", i.style.left = `${v.left}px`, i.style.top = `${v.top}px`, i.style.width = `${v.width}px`, i.style.height = `${v.height}px`;
  }
  function y(p) {
    if (!s) return;
    const h = f(p.clientX, p.clientY);
    if (p.preventDefault(), p.stopPropagation(), !h) return;
    const v = st(h);
    e.log("picked", v), S(), r([v]);
  }
  function T(p) {
    p.key === "Escape" && (p.preventDefault(), S());
  }
  function I() {
    s || (s = !0, e.log("start"), c(), document.addEventListener("mousemove", b, !0), document.addEventListener("click", y, !0), document.addEventListener("keydown", T, !0));
  }
  function S() {
    s && (s = !1, document.removeEventListener("mousemove", b, !0), document.removeEventListener("click", y, !0), document.removeEventListener("keydown", T, !0), n && n.parentNode && n.parentNode.removeChild(n), n = null, o = null, i = null);
  }
  return { start: I, stop: S };
}
const U = 6, j = 6, V = 10, dt = 1;
function C(r) {
  return typeof r == "object" && r !== null && !Array.isArray(r);
}
function Y(r) {
  return C(r) && typeof r.default == "string";
}
const q = ["top", "bottom", "left", "right"], X = ["mobile", "tablet", "desktop"], G = ["click", "input", "navigate", "none"];
function Z(r, t, e) {
  if (!C(r)) {
    e.push(`${t} must be an object`);
    return;
  }
  const n = typeof r.glob == "string" && r.glob.length > 0, o = typeof r.regex == "string" && r.regex.length > 0;
  if (!n && !o && e.push(`${t} must have a non-empty "glob" or "regex"`), o)
    try {
      new RegExp(r.regex);
    } catch {
      e.push(`${t}.regex is not a valid regular expression`);
    }
}
function K(r, t, e) {
  if (!C(r)) {
    e.push(`${t} must be an object`);
    return;
  }
  r.url !== void 0 && Z(r.url, `${t}.url`, e), r.role !== void 0 && typeof r.role != "string" && e.push(`${t}.role must be a string`), r.firstVisitOnly !== void 0 && typeof r.firstVisitOnly != "boolean" && e.push(`${t}.firstVisitOnly must be a boolean`), r.device !== void 0 && !X.includes(r.device) && e.push(`${t}.device must be one of ${X.join("|")}`), r.unlessSeen !== void 0 && typeof r.unlessSeen != "boolean" && e.push(`${t}.unlessSeen must be a boolean`), r.maxShows !== void 0 && (typeof r.maxShows != "number" || r.maxShows < 0) && e.push(`${t}.maxShows must be a non-negative number`);
}
function lt(r, t, e) {
  if (!C(r)) {
    e.push(`${t} must be an object`);
    return;
  }
  G.includes(r.type) || e.push(`${t}.type must be one of ${G.join("|")}`), r.url !== void 0 && typeof r.url != "string" && e.push(`${t}.url must be a string`), r.value !== void 0 && typeof r.value != "string" && e.push(`${t}.value must be a string`);
}
function ct(r) {
  const t = [];
  if (!C(r))
    return { ok: !1, errors: ["tour must be an object"] };
  if ((typeof r.id != "string" || r.id.length === 0) && t.push("tour.id must be a non-empty string"), typeof r.schemaVersion != "number" && t.push("tour.schemaVersion must be a number"), Y(r.title) || t.push('tour.title must be a localized text with a string "default"'), Array.isArray(r.steps) ? r.steps.length === 0 ? t.push("tour.steps must contain at least one step") : r.steps.forEach((e, n) => {
    if (!C(e)) {
      t.push(`steps[${n}] must be an object`);
      return;
    }
    (typeof e.id != "string" || e.id.length === 0) && t.push(`steps[${n}].id must be a non-empty string`), (!Array.isArray(e.selectors) || e.selectors.length === 0 || !e.selectors.every((o) => typeof o == "string" && o.length > 0)) && t.push(`steps[${n}].selectors must be a non-empty array of non-empty strings`), Y(e.content) || t.push(`steps[${n}].content must be a localized text with a string "default"`), e.placement !== void 0 && !q.includes(e.placement) && t.push(`steps[${n}].placement must be one of ${q.join("|")}`), e.pageUrl !== void 0 && Z(e.pageUrl, `steps[${n}].pageUrl`, t), e.condition !== void 0 && K(e.condition, `steps[${n}].condition`, t), e.action !== void 0 && lt(e.action, `steps[${n}].action`, t);
  }) : t.push("tour.steps must be an array"), r.display !== void 0)
    if (!C(r.display))
      t.push("tour.display must be an object");
    else
      for (const e of ["padding", "radius", "cardRadius"]) {
        const n = r.display[e];
        n !== void 0 && (typeof n != "number" || n < 0) && t.push(`tour.display.${e} must be a non-negative number`);
      }
  return r.rules !== void 0 && (Array.isArray(r.rules) ? r.rules.forEach((e, n) => {
    if (!C(e)) {
      t.push(`rules[${n}] must be an object`);
      return;
    }
    e.tourId !== void 0 && typeof e.tourId != "string" && t.push(`rules[${n}].tourId must be a string`), e.when === void 0 ? t.push(`rules[${n}].when is required`) : K(e.when, `rules[${n}].when`, t);
  }) : t.push("tour.rules must be an array")), t.length > 0 ? { ok: !1, errors: t } : { ok: !0, tour: r };
}
const P = 12;
function pt(r) {
  var F, W, J;
  const t = O("player");
  let e = null, n = null, o = null, i = null, s = !1, d = 0;
  const c = ((F = r.display) == null ? void 0 : F.padding) ?? U, f = ((W = r.display) == null ? void 0 : W.radius) ?? j, b = ((J = r.display) == null ? void 0 : J.cardRadius) ?? V;
  function y(l) {
    for (const g of l.selectors)
      try {
        const u = document.querySelector(g);
        if (u) return u;
      } catch {
      }
    return null;
  }
  function T() {
    if (e) return;
    e = document.createElement("div"), e.setAttribute("data-tours-player", ""), n = e.attachShadow({ mode: "open" });
    const l = document.createElement("style");
    l.textContent = it, n.appendChild(l);
    const g = document.createElement("div");
    g.className = "tours-backdrop", n.appendChild(g), o = document.createElement("div"), o.className = "tours-spotlight", o.style.borderRadius = `${f}px`, n.appendChild(o), i = document.createElement("div"), i.className = "tours-tooltip", i.style.borderRadius = `${b}px`, n.appendChild(i), document.body.appendChild(e);
  }
  function I(l) {
    o && (o.style.display = "block", o.style.left = `${l.left - c}px`, o.style.top = `${l.top - c}px`, o.style.width = `${l.width + c * 2}px`, o.style.height = `${l.height + c * 2}px`);
  }
  function S(l, g) {
    if (!i) return;
    const u = i.offsetWidth, w = i.offsetHeight, $ = window.innerWidth, L = window.innerHeight;
    let x, m;
    const _ = g ?? "bottom";
    switch (_) {
      case "top":
        x = l.top - w - P, m = l.left + l.width / 2 - u / 2;
        break;
      case "left":
        x = l.top + l.height / 2 - w / 2, m = l.left - u - P;
        break;
      case "right":
        x = l.top + l.height / 2 - w / 2, m = l.right + P;
        break;
      case "bottom":
      default:
        x = l.bottom + P, m = l.left + l.width / 2 - u / 2;
        break;
    }
    _ === "bottom" && x + w > L && (x = l.top - w - P), m = Math.max(8, Math.min(m, $ - u - 8)), x = Math.max(8, Math.min(x, L - w - 8)), i.style.left = `${m}px`, i.style.top = `${x}px`;
  }
  function p(l) {
    if (!i) return;
    const g = r.steps.length;
    i.textContent = "";
    const u = document.createElement("button");
    u.className = "tours-close", u.type = "button", u.textContent = "×", u.setAttribute("aria-label", "Close"), u.addEventListener("click", E), i.appendChild(u);
    const w = document.createElement("p");
    w.className = "tours-tooltip__content", w.textContent = l.content.default, i.appendChild(w);
    const $ = document.createElement("div");
    $.className = "tours-tooltip__footer";
    const L = document.createElement("span");
    L.className = "tours-tooltip__progress", L.textContent = `Step ${d + 1} of ${g}`, $.appendChild(L);
    const x = document.createElement("div");
    x.className = "tours-tooltip__buttons";
    const m = document.createElement("button");
    m.className = "tours-btn", m.type = "button", m.textContent = "Back", m.disabled = d === 0, m.addEventListener("click", R), x.appendChild(m);
    const _ = document.createElement("button");
    _.className = "tours-btn tours-btn--primary", _.type = "button", _.textContent = d === g - 1 ? "Done" : "Next", _.addEventListener("click", z), x.appendChild(_), $.appendChild(x), i.appendChild($);
  }
  function h() {
    if (!s) return;
    const l = r.steps[d];
    if (!l) {
      E();
      return;
    }
    t.log("render step", d, l.id);
    const g = y(l);
    if (!g) {
      t.warn(`step "${l.id}" skipped: no element for selectors`, l.selectors), d < r.steps.length - 1 ? (d += 1, h()) : E();
      return;
    }
    T(), g.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" }), p(l);
    const u = g.getBoundingClientRect();
    I(u), S(u, l.placement);
  }
  function v(l) {
    s && (l.key === "Escape" ? (l.preventDefault(), E()) : l.key === "ArrowRight" ? z() : l.key === "ArrowLeft" && R());
  }
  function N() {
    if (!s) return;
    const l = r.steps[d];
    if (!l) return;
    const g = y(l);
    if (!g) return;
    const u = g.getBoundingClientRect();
    I(u), S(u, l.placement);
  }
  function rt() {
    s || r.steps.length !== 0 && (s = !0, d = 0, t.log("start", r.id, `${r.steps.length} steps`), T(), window.addEventListener("keydown", v, !0), window.addEventListener("resize", N, !0), window.addEventListener("scroll", N, !0), h());
  }
  function E() {
    s && (s = !1, t.log("stop"), window.removeEventListener("keydown", v, !0), window.removeEventListener("resize", N, !0), window.removeEventListener("scroll", N, !0), e && e.parentNode && e.parentNode.removeChild(e), e = null, n = null, o = null, i = null);
  }
  function z() {
    if (s) {
      if (d >= r.steps.length - 1) {
        E();
        return;
      }
      d += 1, h();
    }
  }
  function R() {
    s && (d <= 0 || (d -= 1, h()));
  }
  return { start: rt, stop: E, next: z, prev: R };
}
const ut = `
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
}
.card-preview__btn--primary { background: var(--e-accent); border-color: var(--e-accent); color: #fff; }

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
`, Q = {
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
let ht = 0;
function tt(r) {
  const t = typeof crypto < "u" && "randomUUID" in crypto ? crypto.randomUUID() : `${ht++}`;
  return `${r}-${t}`;
}
function H(r = "step") {
  return {
    id: tt("step"),
    type: r,
    included: !0,
    selectors: [],
    content: "",
    placement: "bottom",
    backLabel: "Back",
    nextLabel: "Next"
  };
}
function D() {
  return {
    id: tt("tour"),
    name: "Untitled tour",
    status: "draft",
    steps: [H()],
    display: {
      padding: U,
      radius: j,
      cardRadius: V
    }
  };
}
function et(r) {
  var e, n, o;
  if (!Array.isArray(r)) return [];
  const t = [];
  for (const i of r) {
    if (!i || typeof i != "object") continue;
    const s = i;
    typeof s.id != "string" || !Array.isArray(s.steps) || t.push({
      id: s.id,
      name: typeof s.name == "string" ? s.name : "Untitled tour",
      status: s.status === "published" ? "published" : "draft",
      display: {
        padding: B((e = s.display) == null ? void 0 : e.padding, U),
        radius: B((n = s.display) == null ? void 0 : n.radius, j),
        cardRadius: B((o = s.display) == null ? void 0 : o.cardRadius, V)
      },
      steps: s.steps.filter((d) => !!d && typeof d == "object").map((d) => ({
        ...H(d.type === "action" ? "action" : "step"),
        ...d
      }))
    });
  }
  return t;
}
function B(r, t) {
  return typeof r == "number" && r >= 0 ? r : t;
}
function ft(r) {
  const t = r.steps.filter((n) => n.included && n.selectors.length > 0).map((n) => ({
    id: n.id,
    selectors: n.selectors,
    content: { default: n.content },
    placement: n.placement
  })), e = {
    id: r.id,
    schemaVersion: dt,
    title: { default: r.name },
    steps: t,
    display: {
      padding: r.display.padding,
      radius: r.display.radius,
      cardRadius: r.display.cardRadius
    }
  };
  return ct(e);
}
function gt(r = "tours:drafts") {
  return {
    async load() {
      try {
        const t = localStorage.getItem(r);
        return t ? et(JSON.parse(t)) : null;
      } catch {
        return null;
      }
    },
    async save(t) {
      try {
        localStorage.setItem(r, JSON.stringify(t));
      } catch {
      }
    }
  };
}
function bt(r) {
  const t = { "Content-Type": "application/json" };
  return r.nonce && (t["X-WP-Nonce"] = r.nonce), {
    async load() {
      const e = await fetch(r.url, { headers: t, credentials: "same-origin" });
      if (!e.ok) throw new Error(`WordPress load failed: ${e.status}`);
      return et(await e.json());
    },
    async save(e) {
      const n = await fetch(r.url, {
        method: "POST",
        headers: t,
        credentials: "same-origin",
        body: JSON.stringify(e)
      });
      if (!n.ok) throw new Error(`WordPress save failed: ${n.status}`);
    }
  };
}
function a(r, t = {}, e = []) {
  const n = document.createElement(r);
  for (const [o, i] of Object.entries(t)) n.setAttribute(o, i);
  for (const o of e) n.append(typeof o == "string" ? document.createTextNode(o) : o);
  return n;
}
function k(r, t, e = "") {
  const n = a("button", { class: `iconbtn ${e}`.trim(), title: t, type: "button" });
  return n.innerHTML = Q[r] ?? "", n;
}
class nt {
  constructor(t = {}) {
    var e;
    this.options = t, this.log = O("editor"), this.host = null, this.root = null, this.tours = [D()], this.openTourId = this.tours[0].id, this.view = "edit", this.activeStepId = ((e = this.tours[0].steps[0]) == null ? void 0 : e.id) ?? null, this.tab = "steps", this.displaySub = "tour", this.mode = "build", this.picker = null, this.picking = !1, this.player = null, this.highlight = null, this.cardPreview = null, this.focusStepId = null, this.onViewportChange = () => this.updateOverlays(), this.saveTimer = null, this.navPosition = t.navPosition ?? "bottom", this.panelPosition = t.panelPosition ?? "right", this.local = gt(t.storageKey), this.secondary = t.storage ?? null;
  }
  /**
   * Auto-mount when the page URL carries the flag (default `?tours-edit=1`), so
   * a site owner can enable the builder without touching code. Returns the
   * instance if mounted, otherwise null.
   */
  static fromUrl(t = {}) {
    const e = t.urlFlag ?? "tours-edit", n = new URLSearchParams(window.location.search).get(e);
    if (n === null || n === "0" || n === "false") return null;
    const o = new nt(t);
    return o.mount(), o;
  }
  /** Render the UI onto the page. Idempotent. */
  mount() {
    if (this.host || this.options.mode === "off") return;
    this.host = a("div", { "data-tours-editor": "" }), this.root = this.host.attachShadow({ mode: "open" });
    const t = document.createElement("style");
    t.textContent = ut, this.root.appendChild(t), this.highlight = a("div", { class: "highlight" }), this.cardPreview = a("div", { class: "card-preview" }, ["Step tooltip preview"]), this.root.append(this.highlight, this.cardPreview), document.body.appendChild(this.host), window.addEventListener("scroll", this.onViewportChange, !0), window.addEventListener("resize", this.onViewportChange, !0), this.log.log("mounted"), this.render(), this.hydrate();
  }
  /** Load stored drafts (localStorage by default) and show them. */
  async hydrate() {
    var e;
    const t = await this.local.load();
    !t || t.length === 0 || (this.tours = t, this.openTourId = t[0].id, this.activeStepId = ((e = t[0].steps[0]) == null ? void 0 : e.id) ?? null, this.log.log("hydrated", `${t.length} tour(s)`), this.render());
  }
  /** Debounce a save so rapid edits (typing, dragging a slider) coalesce. */
  markDirty() {
    this.saveTimer !== null && clearTimeout(this.saveTimer), this.saveTimer = setTimeout(() => {
      this.saveTimer = null, this.persist();
    }, 400);
  }
  /** Always write localStorage; also try the secondary strategy best-effort. */
  async persist() {
    const t = this.tours;
    if (await this.local.save(t), this.secondary)
      try {
        await this.secondary.save(t);
      } catch (e) {
        this.log.warn("secondary store save failed (localStorage kept the draft)", e);
      }
  }
  /** Remove the UI and any active picker/player. */
  destroy() {
    var t, e;
    this.stopPicking(), (t = this.player) == null || t.stop(), this.player = null, this.saveTimer !== null && (clearTimeout(this.saveTimer), this.saveTimer = null, this.persist()), window.removeEventListener("scroll", this.onViewportChange, !0), window.removeEventListener("resize", this.onViewportChange, !0), (e = this.host) != null && e.parentNode && this.host.parentNode.removeChild(this.host), this.host = null, this.root = null, this.highlight = null, this.cardPreview = null;
  }
  /** The current draft as a validated tour (or validation errors). */
  export() {
    return ft(this.tour);
  }
  // ---------- state mutations ----------
  /** The currently open tour (falls back to the first if the id is stale). */
  get tour() {
    return this.tours.find((t) => t.id === this.openTourId) ?? this.tours[0];
  }
  get activeStep() {
    return this.tour.steps.find((t) => t.id === this.activeStepId) ?? null;
  }
  /** Open a tour for editing and reset the active step to its first. */
  openTour(t) {
    var e;
    this.openTourId = t, this.view = "edit", this.tab = "steps", this.activeStepId = ((e = this.tour.steps[0]) == null ? void 0 : e.id) ?? null, this.render();
  }
  createTour() {
    const t = D();
    this.tours.push(t), this.openTour(t.id);
  }
  deleteTour(t) {
    const e = this.tours.findIndex((n) => n.id === t);
    e !== -1 && (this.tours.splice(e, 1), this.tours.length === 0 && this.tours.push(D()), this.openTourId === t && (this.openTourId = this.tours[0].id), this.render());
  }
  setActive(t) {
    this.activeStepId !== t && (this.activeStepId = t, this.render());
  }
  addStepAfter(t, e = "step") {
    const n = H(e);
    this.tour.steps.splice(t + 1, 0, n), this.activeStepId = n.id, this.render();
  }
  removeStep(t) {
    var n;
    const e = this.tour.steps.findIndex((o) => o.id === t);
    e !== -1 && (this.tour.steps.splice(e, 1), this.activeStepId === t && (this.activeStepId = ((n = this.tour.steps[Math.max(0, e - 1)]) == null ? void 0 : n.id) ?? null), this.render());
  }
  // ---------- picker (selector search) ----------
  togglePicking() {
    if (this.picking) {
      this.stopPicking();
      return;
    }
    const t = this.activeStep;
    t && (this.picking = !0, this.picker = at(
      (e) => {
        t.selectors = e, this.picking = !1, this.picker = null, this.log.log("bound selector to step", t.id, e), this.render();
      },
      { ignore: [this.host] }
    ), this.picker.start(), this.render());
  }
  stopPicking() {
    var t;
    (t = this.picker) == null || t.stop(), this.picker = null, this.picking = !1;
  }
  // ---------- preview ----------
  togglePreview() {
    var e;
    if (this.mode === "preview") {
      (e = this.player) == null || e.stop(), this.player = null, this.mode = "build", this.render();
      return;
    }
    const t = this.export();
    if (!t.ok) {
      this.log.warn("cannot preview — draft is invalid", t.errors), window.alert(`Add a selector and text to at least one step first:

${t.errors.join(`
`)}`);
      return;
    }
    this.mode = "preview", this.render(), this.player = pt(t.tour), this.player.start();
  }
  // ---------- rendering ----------
  render() {
    this.root && (this.root.querySelectorAll(".panel, .nav").forEach((t) => t.remove()), this.mode === "build" && this.root.appendChild(this.renderPanel()), this.root.appendChild(this.renderNav()), this.focusStepId && (this.focusContent(this.focusStepId), this.focusStepId = null), this.updateOverlays(), this.markDirty());
  }
  /** Resolve a step's target on the page, trying each candidate selector. */
  resolveTarget(t) {
    for (const e of t.selectors)
      try {
        const n = document.querySelector(e);
        if (n) return n;
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
    const t = this.highlight, e = this.cardPreview;
    if (!t || !e) return;
    const n = () => {
      t.style.display = "none", e.style.display = "none";
    };
    if (this.view !== "edit" || this.mode !== "build" || this.picking) return n();
    const o = this.activeStep, i = o && o.selectors.length > 0 ? this.resolveTarget(o) : null;
    if (!o || !i) return n();
    const s = i.getBoundingClientRect(), { padding: d, radius: c, cardRadius: f } = this.tour.display;
    t.className = `highlight ${this.tab === "display" ? "highlight--settings" : ""}`.trim(), t.style.display = "block", t.style.left = `${s.left - d}px`, t.style.top = `${s.top - d}px`, t.style.width = `${s.width + d * 2}px`, t.style.height = `${s.height + d * 2}px`, t.style.borderRadius = `${c}px`, this.drawStepCard(e, o, s, d, f);
  }
  /**
   * Render the active step's card near its target, as the visitor will see it.
   * Shown when the step has any content; in the Card sub-tab a placeholder is
   * used instead so the radius stays visible before any text is written.
   */
  drawStepCard(t, e, n, o, i) {
    const s = e.content.trim(), d = this.tab === "display" && this.displaySub === "card";
    if (!s && !d) {
      t.style.display = "none";
      return;
    }
    t.textContent = "", t.style.display = "block", t.style.borderRadius = `${i}px`;
    const c = a("div", { class: "card-preview__content" }, [s || "Step tooltip preview"]);
    s || c.classList.add("card-preview__content--placeholder");
    const f = a("div", { class: "card-preview__footer" });
    f.append(
      a("span", { class: "card-preview__btn" }, [e.backLabel]),
      a("span", { class: "card-preview__btn card-preview__btn--primary" }, [e.nextLabel])
    ), t.append(c, f), this.positionCard(t, n, e.placement, o);
  }
  /** Place the card relative to the target per placement, clamped to the viewport. */
  positionCard(t, e, n, o) {
    const i = o + 10, s = t.offsetWidth, d = t.offsetHeight, c = window.innerWidth, f = window.innerHeight;
    let b, y;
    switch (n) {
      case "top":
        b = e.top - d - i, y = e.left + e.width / 2 - s / 2;
        break;
      case "left":
        b = e.top + e.height / 2 - d / 2, y = e.left - s - i;
        break;
      case "right":
        b = e.top + e.height / 2 - d / 2, y = e.right + i;
        break;
      default:
        b = e.bottom + i, y = e.left + e.width / 2 - s / 2;
    }
    y = Math.max(8, Math.min(y, c - s - 8)), b = Math.max(8, Math.min(b, f - d - 8)), t.style.left = `${y}px`, t.style.top = `${b}px`;
  }
  renderNav() {
    const t = a("div", { class: `nav nav--${this.navPosition}` }), e = k("build", "Build", this.mode === "build" ? "iconbtn--active" : "");
    e.addEventListener("click", () => {
      this.mode === "preview" && this.togglePreview();
    });
    const n = k("preview", "Preview", this.mode === "preview" ? "iconbtn--active" : "");
    n.addEventListener("click", () => this.togglePreview());
    const o = k("navFlip", "Move bar (top/bottom)");
    o.addEventListener("click", () => {
      this.navPosition = this.navPosition === "bottom" ? "top" : "bottom", this.render();
    });
    const i = k("close", "Close builder");
    return i.addEventListener("click", () => this.destroy()), t.append(e, n, a("div", { class: "nav__sep" }), o, i), t;
  }
  renderPanel() {
    const t = a("div", { class: `panel panel--${this.panelPosition}` });
    return this.view === "list" ? t.append(this.renderListHeader(), this.renderList()) : t.append(this.renderHeader(), this.renderToolbar(), this.renderTabs(), this.renderBody()), t;
  }
  renderListHeader() {
    const t = a("div", { class: "panel__header" }), e = a("span", { class: "panel__title panel__title--static" }, ["Tours"]), n = a("button", { class: "newtour", type: "button", title: "New tour" }, ["+ New"]);
    return n.addEventListener("click", () => this.createTour()), t.append(e, n), t;
  }
  renderList() {
    const t = a("div", { class: "panel__body" }), e = a("div", { class: "tourlist" });
    return this.tours.forEach((n) => {
      const o = a("div", { class: "tourrow" });
      o.addEventListener("click", () => this.openTour(n.id));
      const i = a("div", { class: "tourrow__main" });
      i.append(
        a("div", { class: "tourrow__name" }, [n.name]),
        a("div", { class: "tourrow__meta" }, [
          `${n.steps.length} step${n.steps.length === 1 ? "" : "s"}`
        ])
      );
      const s = a("span", { class: `status status--${n.status}` }, [n.status]), d = k("trash", "Delete tour");
      d.addEventListener("click", (c) => {
        c.stopPropagation(), this.deleteTour(n.id);
      }), o.append(i, s, d), e.append(o);
    }), t.append(e), t;
  }
  renderHeader() {
    const t = a("div", { class: "panel__header" }), e = a("input", { class: "panel__title", value: this.tour.name });
    e.value = this.tour.name, e.addEventListener("change", () => {
      this.tour.name = e.value.trim() || "Untitled tour", this.markDirty();
    });
    const n = a("span", { class: `status status--${this.tour.status}` }, [this.tour.status]);
    n.addEventListener("click", () => {
      this.tour.status = this.tour.status === "draft" ? "published" : "draft", this.render();
    }), n.setAttribute("title", "Toggle status"), n.style.cursor = "pointer";
    const o = k("menu", "Tour menu");
    return o.addEventListener("click", () => this.openMenu()), t.append(e, n, o), t;
  }
  renderToolbar() {
    const t = a("div", { class: "panel__toolbar" }), e = k("back", "Back to tours");
    e.addEventListener("click", () => {
      this.stopPicking(), this.view = "list", this.render();
    });
    const n = k("panelSide", "Move panel (left/right)");
    n.addEventListener("click", () => {
      this.panelPosition = this.panelPosition === "right" ? "left" : "right", this.render();
    });
    const o = k(
      "cursor",
      this.picking ? "Cancel picking" : "Pick element for active step",
      this.picking ? "iconbtn--active" : ""
    );
    return o.addEventListener("click", () => this.togglePicking()), t.append(e, a("div", { class: "spacer" }), n, o), t;
  }
  renderTabs() {
    const t = a("div", { class: "tabs" });
    for (const [e, n] of [
      ["steps", "Steps"],
      ["display", "Display"],
      ["assets", "Assets"]
    ]) {
      const o = a("button", { class: `tab ${this.tab === e ? "tab--active" : ""}`, type: "button" }, [n]);
      o.addEventListener("click", () => {
        this.tab = e, e === "display" && this.selectFirstResolvableStep(), this.render();
      }), t.append(o);
    }
    return t;
  }
  /** Activate the first step whose selector resolves to an on-page element. */
  selectFirstResolvableStep() {
    const t = this.tour.steps.find((e) => this.resolveTarget(e) !== null);
    t && (this.activeStepId = t.id);
  }
  /**
   * The Display tab: two sub-tabs of tour-level visual settings — Tour (the
   * target outline) and Card (the visitor tooltip) — tuned live.
   */
  renderDisplaySettings() {
    const t = a("div", { class: "settings" }), e = a("div", { class: "subtabs" });
    for (const [o, i] of [["tour", "Tour"], ["card", "Card"]]) {
      const s = a("button", { class: `subtab ${this.displaySub === o ? "subtab--active" : ""}`, type: "button" }, [i]);
      s.addEventListener("click", () => {
        this.displaySub = o, this.render();
      }), e.append(s);
    }
    if (t.append(e), !this.activeStep || !this.resolveTarget(this.activeStep))
      return t.append(
        a("div", { class: "assets-empty" }, [
          "Give a step a selector first — then its target frames here so you can tune the look."
        ])
      ), t;
    const n = this.tour.display;
    return this.displaySub === "tour" ? t.append(
      this.slider("Outline spacing", n.padding, 0, 40, (o) => n.padding = o),
      this.slider("Outline corner radius", n.radius, 0, 40, (o) => n.radius = o),
      a("div", { class: "settings__hint" }, [
        "The outline framing the target — applied in the builder and in the live tour spotlight."
      ])
    ) : t.append(
      this.slider("Card corner radius", n.cardRadius, 0, 32, (o) => n.cardRadius = o),
      a("div", { class: "settings__hint" }, [
        "The visitor tooltip card. Preview it beside the highlighted target."
      ])
    ), t;
  }
  /** A labelled range slider that writes through `set` and re-draws overlays live. */
  slider(t, e, n, o, i) {
    const s = a("span", { class: "settings__value" }, [`${e}px`]), d = a("input", {
      class: "settings__slider",
      type: "range",
      min: String(n),
      max: String(o),
      step: "1"
    });
    d.value = String(e), d.addEventListener("input", () => {
      const b = Number(d.value);
      i(b), s.textContent = `${b}px`, this.updateOverlays(), this.markDirty();
    });
    const c = a("div", { class: "settings__row" });
    c.append(d, s);
    const f = a("div", { class: "settings__field" });
    return f.append(a("label", { class: "settings__label" }, [t]), c), f;
  }
  renderBody() {
    const t = a("div", { class: "panel__body" });
    if (this.tab === "assets")
      return t.append(a("div", { class: "assets-empty" }, ["Assets — coming soon"])), t;
    if (this.tab === "display")
      return t.append(this.renderDisplaySettings()), t;
    const e = a("div", { class: "steps" });
    return e.append(this.renderConnector(-1)), this.tour.steps.forEach((n, o) => {
      e.append(this.renderCard(n, o)), e.append(this.renderConnector(o));
    }), t.append(e), t;
  }
  renderConnector(t) {
    const e = a("div", { class: "connector" }), n = a("button", { class: "connector__add", title: "Add step", type: "button" }, ["+"]);
    return n.addEventListener("click", () => this.addStepAfter(t)), e.append(a("div", { class: "connector__line" }), n, a("div", { class: "connector__line" })), e;
  }
  renderCard(t, e) {
    const n = t.id === this.activeStepId, o = a("div", {
      class: `card ${n ? "card--active" : ""} ${t.included ? "" : "card--excluded"}`.trim()
    });
    return o.addEventListener("mousedown", () => this.setActive(t.id)), o.append(this.renderCardControl(t, e), this.renderCardContent(t), this.renderCardFooter(t)), o;
  }
  renderCardControl(t, e) {
    const n = a("div", { class: "card__control" }), o = a("input", { class: "card__check", type: "checkbox", title: "Include in tour" });
    o.checked = t.included, o.addEventListener("change", () => {
      t.included = o.checked, this.render();
    });
    const i = a("span", { class: "card__index" }, [String(e + 1)]), s = a("span", { class: "card__type" });
    s.innerHTML = Q[t.type === "action" ? "bolt" : "step"], s.append(document.createTextNode(t.type === "action" ? "Action" : "Step"));
    const d = t.selectors[0], c = a("span", { class: `card__sel ${d ? "" : "card__sel--empty"}`.trim(), title: d ?? "" }, [
      d ?? "no selector"
    ]), f = k("trash", "Delete step");
    return f.addEventListener("click", () => this.removeStep(t.id)), n.append(o, i, s, a("div", { class: "spacer" }), c, f), n;
  }
  renderCardContent(t) {
    const e = a("div", {
      class: "card__content",
      contenteditable: "true",
      "data-placeholder": "Write the step text…",
      "data-step": t.id
    });
    return e.textContent = t.content, e.addEventListener("input", () => {
      t.content = e.textContent ?? "", this.updateOverlays(), this.markDirty();
    }), e.addEventListener("mousedown", () => {
      this.activeStepId !== t.id && (this.focusStepId = t.id);
    }), e;
  }
  renderCardFooter(t) {
    const e = a("div", { class: "card__footer" });
    return e.append(
      this.renderEditableButton(t, "backLabel"),
      this.renderEditableButton(t, "nextLabel")
    ), e;
  }
  /** A footer button that turns into a text input when clicked, to edit its label. */
  renderEditableButton(t, e) {
    const n = a("button", { class: "cardbtn", type: "button" }, [t[e]]);
    return n.addEventListener("click", (o) => {
      o.stopPropagation();
      const i = a("input", { class: "cardbtn cardbtn--edit", value: t[e] });
      i.value = t[e], n.replaceWith(i), i.focus(), i.select();
      const s = () => {
        t[e] = i.value.trim() || (e === "backLabel" ? "Back" : "Next"), i.replaceWith(this.renderEditableButton(t, e)), this.markDirty();
      };
      i.addEventListener("blur", s), i.addEventListener("keydown", (d) => {
        d.key === "Enter" && i.blur(), d.key === "Escape" && (i.value = t[e], i.blur());
      });
    }), n;
  }
  // ---------- misc ----------
  openMenu() {
    const t = this.export(), e = t.ok ? JSON.stringify(t.tour, null, 2) : `INVALID:
${t.errors.join(`
`)}`;
    this.log.log("tour JSON", e), window.prompt("Tour JSON (copy):", t.ok ? JSON.stringify(t.tour) : "");
  }
  /** Focus a card's content area and place the caret at the end. */
  focusContent(t) {
    var i;
    const e = (i = this.root) == null ? void 0 : i.querySelector(`.card__content[data-step="${t}"]`);
    if (!e) return;
    e.focus();
    const n = document.createRange();
    n.selectNodeContents(e), n.collapse(!1);
    const o = window.getSelection();
    o == null || o.removeAllRanges(), o == null || o.addRange(n);
  }
}
export {
  nt as TourBuilder,
  H as createDraftStep,
  D as createDraftTour,
  gt as createLocalStore,
  bt as createWordPressStore,
  et as normalizeTours,
  ft as toTour
};
//# sourceMappingURL=tours-editor.js.map
