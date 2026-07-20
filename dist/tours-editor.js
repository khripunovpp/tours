const at = `
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
`, dt = `
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
function O(r) {
  return JSON.stringify(r);
}
function lt(r) {
  return /^[a-zA-Z][\w-]*$/.test(r) && r.length <= 30 && !/\d{2,}/.test(r) && !/^(css-|sc-|jsx-|emotion-|_|is-|has-)/.test(r);
}
function H(r) {
  const t = [];
  let e = r;
  for (; e && e !== document.body && e.nodeType === 1; ) {
    const n = e.tagName.toLowerCase(), i = e.parentElement;
    if (!i) {
      t.unshift(n);
      break;
    }
    const o = Array.from(i.children).filter((s) => s.tagName === e.tagName);
    t.unshift(o.length > 1 ? `${n}:nth-of-type(${o.indexOf(e) + 1})` : n), e = i;
  }
  return `body > ${t.join(" > ")}`;
}
function ct(r) {
  let t = r.parentElement;
  for (; t && t !== document.body && !t.id; )
    t = t.parentElement;
  if (!t || !t.id) return null;
  const e = [];
  let n = r;
  for (; n && n !== t; ) {
    const i = n.tagName.toLowerCase(), o = n.parentElement;
    if (!o) return null;
    const s = Array.from(o.children).filter((d) => d.tagName === n.tagName);
    e.unshift(s.length > 1 ? `${i}:nth-of-type(${s.indexOf(n) + 1})` : i), n = o;
  }
  return `#${CSS.escape(t.id)} > ${e.join(" > ")}`;
}
const pt = ["data-testid", "data-test", "data-test-id", "data-cy", "data-qa", "data-id", "data-name"];
function ut(r) {
  const t = [], e = /* @__PURE__ */ new Set(), n = r.tagName.toLowerCase(), i = (c) => {
    if (!(!c || e.has(c)))
      try {
        document.querySelector(c) === r && (e.add(c), t.push(c));
      } catch {
      }
  };
  r.id && i(`#${CSS.escape(r.id)}`);
  for (const c of pt) {
    const u = r.getAttribute(c);
    u && i(`${n}[${c}=${O(u)}]`);
  }
  const o = r.getAttribute("name");
  o && i(`${n}[name=${O(o)}]`);
  const s = r.getAttribute("aria-label");
  s && i(`[aria-label=${O(s)}]`);
  const d = Array.from(r.classList).filter(lt);
  d.length && i(`${n}.${d.map((c) => CSS.escape(c)).join(".")}`);
  for (const c of d) i(`${n}.${CSS.escape(c)}`);
  i(ct(r)), i(H(r));
  const l = (r.textContent ?? "").replace(/\s+/g, " ").trim();
  if (l && l.length <= 50 && /^(a|button|summary|label|h[1-6])$/.test(n)) {
    const c = `text=${l}`;
    e.has(c) || (e.add(c), t.push(c));
  }
  return t.length === 0 && t.push(H(r)), t;
}
const ht = "a, button, summary, label, h1, h2, h3, h4, h5, h6";
function ft(r, t) {
  if (r.startsWith("text=")) {
    const e = r.slice(5).trim();
    for (const n of Array.from(t.querySelectorAll(ht)))
      if ((n.textContent ?? "").replace(/\s+/g, " ").trim() === e) return n;
    return null;
  }
  try {
    return t.querySelector(r);
  } catch {
    return null;
  }
}
function L(r, t = document) {
  for (const e of r) {
    const n = ft(e, t);
    if (n) return n;
  }
  return null;
}
function gt(r, t = {}) {
  const e = t.root ?? document, n = L(r, e);
  return n ? Promise.resolve(n) : new Promise((i) => {
    let o = !1;
    const s = (c) => {
      o || (o = !0, d.disconnect(), clearTimeout(l), i(c));
    }, d = new MutationObserver(() => {
      const c = L(r, e);
      c && s(c);
    });
    d.observe(document.documentElement, {
      childList: !0,
      subtree: !0,
      attributes: !0
    });
    const l = setTimeout(() => s(null), t.timeout ?? 4e3);
  });
}
let C = null;
function z() {
  if (C !== null) return C;
  try {
    C = new URLSearchParams(window.location.search).has("use_logs");
  } catch {
    C = !1;
  }
  return C;
}
function D(r) {
  const t = `[tours:${r}]`;
  return {
    log: (...e) => {
      z() && console.log(t, ...e);
    },
    warn: (...e) => {
      z() && console.warn(t, ...e);
    },
    error: (...e) => {
      z() && console.error(t, ...e);
    }
  };
}
function bt(r, t = {}) {
  const e = D("picker");
  let n = null, i = null, o = null, s = !1;
  function d(h) {
    if (h === n) return !0;
    for (const b of t.ignore ?? [])
      if (b && b.contains(h)) return !0;
    return !1;
  }
  function l() {
    if (n) return;
    n = document.createElement("div"), n.setAttribute("data-tours-picker", ""), i = n.attachShadow({ mode: "open" });
    const h = document.createElement("style");
    h.textContent = at, i.appendChild(h), o = document.createElement("div"), o.className = "tours-picker-overlay", o.style.display = "none", i.appendChild(o);
    const b = document.createElement("div");
    b.className = "tours-picker-hint", b.textContent = "Hover and click an element • Esc to cancel", i.appendChild(b), document.body.appendChild(n);
  }
  function c(h, b) {
    const f = document.elementFromPoint(h, b);
    return !f || d(f) ? null : f;
  }
  function u(h) {
    if (!s || !o) return;
    const b = c(h.clientX, h.clientY);
    if (!b) {
      o.style.display = "none";
      return;
    }
    const f = b.getBoundingClientRect();
    o.style.display = "block", o.style.left = `${f.left}px`, o.style.top = `${f.top}px`, o.style.width = `${f.width}px`, o.style.height = `${f.height}px`;
  }
  function g(h) {
    if (!s) return;
    const b = c(h.clientX, h.clientY);
    if (h.preventDefault(), h.stopPropagation(), !b) return;
    const f = ut(b);
    e.log("picked", f), v(), r(f);
  }
  function y(h) {
    h.key === "Escape" && (h.preventDefault(), v());
  }
  function _() {
    s || (s = !0, e.log("start"), l(), document.addEventListener("mousemove", u, !0), document.addEventListener("click", g, !0), document.addEventListener("keydown", y, !0));
  }
  function v() {
    s && (s = !1, document.removeEventListener("mousemove", u, !0), document.removeEventListener("click", g, !0), document.removeEventListener("keydown", y, !0), n && n.parentNode && n.parentNode.removeChild(n), n = null, i = null, o = null);
  }
  return { start: _, stop: v };
}
const M = 6, B = 6, F = 10, U = 12, mt = 1;
function w(r) {
  return typeof r == "object" && r !== null && !Array.isArray(r);
}
function W(r) {
  return w(r) && typeof r.default == "string";
}
const J = ["top", "bottom", "left", "right", "auto"], q = ["start", "center", "end"], Y = ["mobile", "tablet", "desktop"], X = ["click", "input", "navigate", "none"];
function Q(r, t, e) {
  if (!w(r)) {
    e.push(`${t} must be an object`);
    return;
  }
  const n = typeof r.glob == "string" && r.glob.length > 0, i = typeof r.regex == "string" && r.regex.length > 0;
  if (!n && !i && e.push(`${t} must have a non-empty "glob" or "regex"`), i)
    try {
      new RegExp(r.regex);
    } catch {
      e.push(`${t}.regex is not a valid regular expression`);
    }
}
function Z(r, t, e) {
  if (!w(r)) {
    e.push(`${t} must be an object`);
    return;
  }
  r.url !== void 0 && Q(r.url, `${t}.url`, e), r.role !== void 0 && typeof r.role != "string" && e.push(`${t}.role must be a string`), r.firstVisitOnly !== void 0 && typeof r.firstVisitOnly != "boolean" && e.push(`${t}.firstVisitOnly must be a boolean`), r.device !== void 0 && !Y.includes(r.device) && e.push(`${t}.device must be one of ${Y.join("|")}`), r.unlessSeen !== void 0 && typeof r.unlessSeen != "boolean" && e.push(`${t}.unlessSeen must be a boolean`), r.maxShows !== void 0 && (typeof r.maxShows != "number" || r.maxShows < 0) && e.push(`${t}.maxShows must be a non-negative number`);
}
function vt(r, t, e) {
  if (!w(r)) {
    e.push(`${t} must be an object`);
    return;
  }
  X.includes(r.type) || e.push(`${t}.type must be one of ${X.join("|")}`), r.url !== void 0 && typeof r.url != "string" && e.push(`${t}.url must be a string`), r.value !== void 0 && typeof r.value != "string" && e.push(`${t}.value must be a string`);
}
function xt(r) {
  const t = [];
  if (!w(r))
    return { ok: !1, errors: ["tour must be an object"] };
  if ((typeof r.id != "string" || r.id.length === 0) && t.push("tour.id must be a non-empty string"), typeof r.schemaVersion != "number" && t.push("tour.schemaVersion must be a number"), W(r.title) || t.push('tour.title must be a localized text with a string "default"'), Array.isArray(r.steps) ? r.steps.length === 0 ? t.push("tour.steps must contain at least one step") : r.steps.forEach((e, n) => {
    if (!w(e)) {
      t.push(`steps[${n}] must be an object`);
      return;
    }
    (typeof e.id != "string" || e.id.length === 0) && t.push(`steps[${n}].id must be a non-empty string`), (!Array.isArray(e.selectors) || e.selectors.length === 0 || !e.selectors.every((i) => typeof i == "string" && i.length > 0)) && t.push(`steps[${n}].selectors must be a non-empty array of non-empty strings`), W(e.content) || t.push(`steps[${n}].content must be a localized text with a string "default"`), e.placement !== void 0 && !J.includes(e.placement) && t.push(`steps[${n}].placement must be one of ${J.join("|")}`), e.align !== void 0 && !q.includes(e.align) && t.push(`steps[${n}].align must be one of ${q.join("|")}`), e.backLabel !== void 0 && typeof e.backLabel != "string" && t.push(`steps[${n}].backLabel must be a string`), e.nextLabel !== void 0 && typeof e.nextLabel != "string" && t.push(`steps[${n}].nextLabel must be a string`), e.pageUrl !== void 0 && Q(e.pageUrl, `steps[${n}].pageUrl`, t), e.condition !== void 0 && Z(e.condition, `steps[${n}].condition`, t), e.action !== void 0 && vt(e.action, `steps[${n}].action`, t);
  }) : t.push("tour.steps must be an array"), r.display !== void 0)
    if (!w(r.display))
      t.push("tour.display must be an object");
    else
      for (const e of ["padding", "radius", "cardRadius", "offset", "alignOffset"]) {
        const n = r.display[e];
        n !== void 0 && (typeof n != "number" || n < 0) && t.push(`tour.display.${e} must be a non-negative number`);
      }
  return r.rules !== void 0 && (Array.isArray(r.rules) ? r.rules.forEach((e, n) => {
    if (!w(e)) {
      t.push(`rules[${n}] must be an object`);
      return;
    }
    e.tourId !== void 0 && typeof e.tourId != "string" && t.push(`rules[${n}].tourId must be a string`), e.when === void 0 ? t.push(`rules[${n}].when is required`) : Z(e.when, `rules[${n}].when`, t);
  }) : t.push("tour.rules must be an array")), t.length > 0 ? { ok: !1, errors: t } : { ok: !0, tour: r };
}
function yt(r, t, e) {
  const n = {
    top: r.top,
    bottom: e.height - r.bottom,
    left: r.left,
    right: e.width - r.right
  }, i = {
    top: t.height,
    bottom: t.height,
    left: t.width,
    right: t.width
  }, o = ["bottom", "top", "right", "left"], s = o.find((d) => n[d] >= i[d] + 8);
  return s || o.reduce((d, l) => n[l] > n[d] ? l : d, o[0]);
}
function tt(r) {
  const { target: t, card: e, offset: n, viewport: i } = r, o = r.side === "auto", s = o ? yt(t, e, i) : r.side, d = o ? "center" : r.align, l = r.alignOffset ?? 0, c = d === "start" ? l : d === "end" ? -l : 0;
  let u = 0, g = 0;
  return s === "top" || s === "bottom" ? (u = s === "top" ? t.top - e.height - n : t.bottom + n, g = d === "start" ? t.left : d === "end" ? t.right - e.width : t.left + t.width / 2 - e.width / 2, g += c) : (g = s === "left" ? t.left - e.width - n : t.right + n, u = d === "start" ? t.top : d === "end" ? t.bottom - e.height : t.top + t.height / 2 - e.height / 2, u += c), g = Math.max(8, Math.min(g, i.width - e.width - 8)), u = Math.max(8, Math.min(u, i.height - e.height - 8)), { top: u, left: g };
}
function G(r) {
  const t = document.createElement("button");
  return t.type = "button", t.className = `tours-card__btn${r.primary ? " tours-card__btn--primary" : ""}${r.disabled ? " tours-card__btn--disabled" : ""}`, t.textContent = r.label, !r.disabled && r.onClick && t.addEventListener("click", r.onClick), t;
}
function et(r) {
  const t = document.createElement("div");
  if (t.className = `tours-card${r.ghost ? " tours-card--ghost" : ""}`, r.radius != null && (t.style.borderRadius = `${r.radius}px`), r.showClose) {
    const n = document.createElement("button");
    n.className = "tours-card__close", n.type = "button", n.textContent = "×", n.setAttribute("aria-label", "Close"), r.onClose && n.addEventListener("click", r.onClose), t.appendChild(n);
  }
  const e = document.createElement("div");
  if (e.className = "tours-card__content", r.contentHtml != null ? e.innerHTML = r.contentHtml : e.textContent = r.contentText ?? "", t.appendChild(e), r.back || r.next || r.progress) {
    const n = document.createElement("div");
    if (n.className = "tours-card__footer", r.back && n.appendChild(G(r.back)), r.progress) {
      const i = document.createElement("span");
      i.className = "tours-card__progress", i.textContent = r.progress, n.appendChild(i);
    }
    r.next && n.appendChild(G(r.next)), t.appendChild(n);
  }
  return t;
}
const nt = `
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
.tours-card--ghost .tours-card__btn,
.tours-card--ghost .tours-card__close { pointer-events: auto; }
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
function wt(r) {
  const t = D("player");
  let e = null, n = null, i = null, o = null, s = !1, d = 0;
  const l = r.display?.padding ?? M, c = r.display?.radius ?? B, u = r.display?.cardRadius ?? F, g = r.display?.offset ?? U;
  function y(p) {
    return L(p.selectors);
  }
  function _() {
    if (e) return;
    e = document.createElement("div"), e.setAttribute("data-tours-player", ""), n = e.attachShadow({ mode: "open" });
    const p = document.createElement("style");
    p.textContent = dt + nt, n.appendChild(p);
    const m = document.createElement("div");
    m.className = "tours-backdrop", n.appendChild(m), i = document.createElement("div"), i.className = "tours-spotlight", i.style.borderRadius = `${c}px`, n.appendChild(i), document.body.appendChild(e);
  }
  function v(p) {
    i && (i.style.display = "block", i.style.left = `${p.left - l}px`, i.style.top = `${p.top - l}px`, i.style.width = `${p.width + l * 2}px`, i.style.height = `${p.height + l * 2}px`);
  }
  function h(p, m) {
    if (!o) return;
    const k = {
      top: p.top - l,
      left: p.left - l,
      right: p.right + l,
      bottom: p.bottom + l,
      width: p.width + l * 2,
      height: p.height + l * 2
    }, { top: N, left: st } = tt({
      target: k,
      card: { width: o.offsetWidth, height: o.offsetHeight },
      side: m.placement ?? "bottom",
      align: m.align ?? "center",
      offset: g,
      alignOffset: r.display?.alignOffset ?? 0,
      viewport: { width: window.innerWidth, height: window.innerHeight }
    });
    o.style.left = `${st}px`, o.style.top = `${N}px`;
  }
  function b(p) {
    const m = r.steps.length;
    o && o.remove(), o = et({
      contentText: p.content.default,
      progress: `Step ${d + 1} of ${m}`,
      showClose: !0,
      onClose: S,
      radius: u,
      back: { label: p.backLabel ?? "Back", disabled: d === 0, onClick: P },
      next: {
        label: p.nextLabel ?? (d === m - 1 ? "Done" : "Next"),
        primary: !0,
        onClick: A
      }
    }), n?.appendChild(o);
  }
  function f() {
    if (!s) return;
    const p = r.steps[d];
    if (!p) {
      S();
      return;
    }
    t.log("render step", d, p.id);
    const m = y(p);
    if (!m) {
      t.log(`step "${p.id}" target not found yet — waiting`, p.selectors), gt(p.selectors, { timeout: 4e3 }).then((N) => {
        !s || r.steps[d] !== p || (N ? f() : (t.warn(`step "${p.id}" skipped: no element for selectors`, p.selectors), d < r.steps.length - 1 ? (d += 1, f()) : S()));
      });
      return;
    }
    _(), m.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" }), b(p);
    const k = m.getBoundingClientRect();
    v(k), h(k, p);
  }
  function V(p) {
    s && (p.key === "Escape" ? (p.preventDefault(), S()) : p.key === "ArrowRight" ? A() : p.key === "ArrowLeft" && P());
  }
  function $() {
    if (!s) return;
    const p = r.steps[d];
    if (!p) return;
    const m = y(p);
    if (!m) return;
    const k = m.getBoundingClientRect();
    v(k), h(k, p);
  }
  function ot() {
    s || r.steps.length !== 0 && (s = !0, d = 0, t.log("start", r.id, `${r.steps.length} steps`), _(), window.addEventListener("keydown", V, !0), window.addEventListener("resize", $, !0), window.addEventListener("scroll", $, !0), f());
  }
  function S() {
    s && (s = !1, t.log("stop"), window.removeEventListener("keydown", V, !0), window.removeEventListener("resize", $, !0), window.removeEventListener("scroll", $, !0), e && e.parentNode && e.parentNode.removeChild(e), e = null, n = null, i = null, o = null);
  }
  function A() {
    if (s) {
      if (d >= r.steps.length - 1) {
        S();
        return;
      }
      d += 1, f();
    }
  }
  function P() {
    s && (d <= 0 || (d -= 1, f()));
  }
  return { start: ot, stop: S, next: A, prev: P };
}
const kt = `
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
  position: relative;
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

/* Tours / Templates switch in the list header */
.listtabs { display: flex; gap: 12px; flex: 1; }
.listtab {
  font-size: 15px;
  font-weight: 700;
  color: var(--e-muted);
  background: transparent;
  border: none;
  padding: 2px 0;
  cursor: pointer;
}
.listtab:hover { color: var(--e-fg); }
.listtab--active { color: var(--e-accent); }

.tourrow__use {
  font-size: 12px;
  font-weight: 600;
  color: #fff;
  background: var(--e-accent);
  border: none;
  border-radius: 7px;
  padding: 5px 12px;
  cursor: pointer;
}
.tourrow__use:hover { background: #1d4ed8; }

/* ⋯ dropdown menu */
.menu {
  position: absolute;
  top: 46px;
  right: 12px;
  z-index: 5;
  min-width: 160px;
  padding: 6px;
  background: var(--e-bg);
  border: 1px solid var(--e-border);
  border-radius: 10px;
  box-shadow: var(--e-shadow);
  display: flex;
  flex-direction: column;
}
.menu__item {
  text-align: left;
  font-size: 13px;
  color: var(--e-fg);
  background: transparent;
  border: none;
  border-radius: 6px;
  padding: 8px 10px;
  cursor: pointer;
}
.menu__item:hover { background: var(--e-surface); }

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

/* ---------- Card-settings accordion ---------- */
.acc { border-top: 1px solid var(--e-border); }
.acc__head {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 10px 12px;
  font-size: 13px;
  font-weight: 600;
  color: var(--e-fg);
  text-align: left;
  background: transparent;
  border: none;
  cursor: pointer;
}
.acc__head:hover { background: var(--e-surface); }
.acc__caret {
  display: inline-flex;
  color: var(--e-muted);
  transition: transform 120ms ease;
}
.acc__caret svg { width: 16px; height: 16px; }
.acc--open .acc__caret { transform: rotate(90deg); }

/* ---------- Per-step placement picker ---------- */
.place {
  padding: 2px 12px 12px;
}
.place__auto {
  display: block;
  margin: 10px auto 0;
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
  cursor: text;
  border-radius: 4px;
  padding: 1px 3px;
}
.settings__value:hover { background: var(--e-surface); color: var(--e-fg); }
.settings__num {
  width: 48px;
  text-align: right;
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  color: var(--e-fg);
  background: #fff;
  border: 1px solid var(--e-accent);
  border-radius: 4px;
  padding: 1px 3px;
  font-variant-numeric: tabular-nums;
  outline: none;
}
.settings__hint {
  font-size: 12px;
  line-height: 1.5;
  color: var(--e-muted);
}
`, R = {
  cursor: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m4 4 7 17 2.5-7L21 11.5 4 4Z"/></svg>',
  back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>',
  chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>',
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
let _t = 0;
function T(r) {
  const t = typeof crypto < "u" && "randomUUID" in crypto ? crypto.randomUUID() : `${_t++}`;
  return `${r}-${t}`;
}
function j(r = "step") {
  return {
    id: T("step"),
    type: r,
    included: !0,
    selectors: [],
    content: "",
    placement: "auto",
    align: "center",
    backLabel: "Back",
    nextLabel: "Next"
  };
}
function I(r = "tour") {
  return {
    id: T(r),
    kind: r,
    name: r === "template" ? "Untitled template" : "Untitled tour",
    status: "draft",
    steps: [j()],
    display: {
      padding: M,
      radius: B,
      cardRadius: F,
      offset: U,
      alignOffset: 0
    }
  };
}
function K(r, t, e) {
  return {
    id: T(t),
    kind: t,
    name: e ?? r.name,
    status: "draft",
    steps: r.steps.map((n) => ({ ...n, id: T("step"), selectors: [...n.selectors] })),
    display: { ...r.display }
  };
}
function rt(r) {
  if (!Array.isArray(r)) return [];
  const t = [];
  for (const e of r) {
    if (!e || typeof e != "object") continue;
    const n = e;
    typeof n.id != "string" || !Array.isArray(n.steps) || t.push({
      id: n.id,
      kind: n.kind === "template" ? "template" : "tour",
      name: typeof n.name == "string" ? n.name : "Untitled tour",
      status: n.status === "published" ? "published" : "draft",
      display: {
        padding: E(n.display?.padding, M),
        radius: E(n.display?.radius, B),
        cardRadius: E(n.display?.cardRadius, F),
        offset: E(n.display?.offset, U),
        alignOffset: E(n.display?.alignOffset, 0)
      },
      steps: n.steps.filter((i) => !!i && typeof i == "object").map((i) => ({
        ...j(i.type === "action" ? "action" : "step"),
        ...i
      }))
    });
  }
  return t;
}
function E(r, t) {
  return typeof r == "number" && r >= 0 ? r : t;
}
function St(r) {
  const t = r.steps.filter((n) => n.included && n.selectors.length > 0).map((n) => ({
    id: n.id,
    selectors: n.selectors,
    content: { default: n.content },
    placement: n.placement,
    align: n.align,
    backLabel: n.backLabel,
    nextLabel: n.nextLabel
  })), e = {
    id: r.id,
    schemaVersion: mt,
    title: { default: r.name },
    steps: t,
    display: {
      padding: r.display.padding,
      radius: r.display.radius,
      cardRadius: r.display.cardRadius,
      offset: r.display.offset,
      alignOffset: r.display.alignOffset
    }
  };
  return xt(e);
}
function Ct(r = "tours:drafts") {
  return {
    async load() {
      try {
        const t = localStorage.getItem(r);
        return t ? rt(JSON.parse(t)) : null;
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
function Et(r) {
  const t = { "Content-Type": "application/json" };
  return r.nonce && (t["X-WP-Nonce"] = r.nonce), {
    async load() {
      const e = await fetch(r.url, { headers: t, credentials: "same-origin" });
      if (!e.ok) throw new Error(`WordPress load failed: ${e.status}`);
      return rt(await e.json());
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
  for (const [i, o] of Object.entries(t)) n.setAttribute(i, o);
  for (const i of e) n.append(typeof i == "string" ? document.createTextNode(i) : i);
  return n;
}
function x(r, t, e = "") {
  const n = a("button", { class: `iconbtn ${e}`.trim(), title: t, type: "button" });
  return n.innerHTML = R[r] ?? "", n;
}
class it {
  constructor(t = {}) {
    this.options = t, this.log = D("editor"), this.host = null, this.root = null, this.tours = [I()], this.openTourId = this.tours[0].id, this.view = "edit", this.listFilter = "tour", this.menuOpen = !1, this.activeStepId = this.tours[0].steps[0]?.id ?? null, this.tab = "steps", this.displaySub = "tour", this.openSections = /* @__PURE__ */ new Set(), this.mode = "build", this.picker = null, this.picking = !1, this.player = null, this.highlight = null, this.cardPreview = null, this.focusStepId = null, this.onViewportChange = () => this.updateOverlays(), this.saveTimer = null, this.navPosition = t.navPosition ?? "bottom", this.panelPosition = t.panelPosition ?? "right", this.local = Ct(t.storageKey), this.secondary = t.storage ?? null;
  }
  /**
   * Auto-mount when the page URL carries the flag (default `?tours-edit=1`), so
   * a site owner can enable the builder without touching code. Returns the
   * instance if mounted, otherwise null.
   */
  static fromUrl(t = {}) {
    const e = t.urlFlag ?? "tours-edit", n = new URLSearchParams(window.location.search).get(e);
    if (n === null || n === "0" || n === "false") return null;
    const i = new it(t);
    return i.mount(), i;
  }
  /** Render the UI onto the page. Idempotent. */
  mount() {
    if (this.host || this.options.mode === "off") return;
    this.host = a("div", { "data-tours-editor": "" }), this.root = this.host.attachShadow({ mode: "open" });
    const t = document.createElement("style");
    t.textContent = kt + nt, this.root.appendChild(t), this.highlight = a("div", { class: "highlight" }), this.root.append(this.highlight), document.body.appendChild(this.host), window.addEventListener("scroll", this.onViewportChange, !0), window.addEventListener("resize", this.onViewportChange, !0), this.log.log("mounted"), this.render(), this.hydrate();
  }
  /** Load stored drafts (localStorage by default) and show them. */
  async hydrate() {
    const t = await this.local.load();
    !t || t.length === 0 || (this.tours = t, this.openTourId = t[0].id, this.activeStepId = t[0].steps[0]?.id ?? null, this.log.log("hydrated", `${t.length} tour(s)`), this.render());
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
    this.stopPicking(), this.player?.stop(), this.player = null, this.saveTimer !== null && (clearTimeout(this.saveTimer), this.saveTimer = null, this.persist()), window.removeEventListener("scroll", this.onViewportChange, !0), window.removeEventListener("resize", this.onViewportChange, !0), this.host?.parentNode && this.host.parentNode.removeChild(this.host), this.host = null, this.root = null, this.highlight = null, this.cardPreview = null;
  }
  /** The current draft as a validated tour (or validation errors). */
  export() {
    return St(this.tour);
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
    this.openTourId = t, this.view = "edit", this.tab = "steps", this.activeStepId = this.tour.steps[0]?.id ?? null, this.render();
  }
  /** Create a fresh entity of the currently listed kind (tour or template). */
  createEntity() {
    const t = I(this.listFilter);
    this.tours.push(t), this.openTour(t.id);
  }
  deleteEntity(t) {
    const e = this.tours.findIndex((n) => n.id === t);
    e !== -1 && (this.tours.splice(e, 1), this.tours.some((n) => n.kind === "tour") || this.tours.push(I()), this.openTourId === t && (this.openTourId = this.tours[0].id), this.render());
  }
  /** Copy the open tour into a new template and jump to the Templates list. */
  saveAsTemplate() {
    const t = K(this.tour, "template", `${this.tour.name} (template)`);
    this.tours.push(t), this.listFilter = "template", this.view = "list", this.menuOpen = !1, this.log.log("saved as template", t.id), this.render();
  }
  /** Create a new tour from a template and open it for editing. */
  createFromTemplate(t) {
    const e = this.tours.find((i) => i.id === t);
    if (!e) return;
    const n = K(e, "tour", e.name.replace(/\s*\(template\)\s*$/, ""));
    this.tours.push(n), this.openTour(n.id);
  }
  setActive(t) {
    this.activeStepId !== t && (this.activeStepId = t, this.render());
  }
  addStepAfter(t, e = "step") {
    const n = j(e);
    this.tour.steps.splice(t + 1, 0, n), this.activeStepId = n.id, this.render();
  }
  removeStep(t) {
    const e = this.tour.steps.findIndex((n) => n.id === t);
    e !== -1 && (this.tour.steps.splice(e, 1), this.activeStepId === t && (this.activeStepId = this.tour.steps[Math.max(0, e - 1)]?.id ?? null), this.render());
  }
  // ---------- picker (selector search) ----------
  togglePicking() {
    if (this.picking) {
      this.stopPicking();
      return;
    }
    const t = this.activeStep;
    t && (this.picking = !0, this.picker = bt(
      (e) => {
        t.selectors = e, this.picking = !1, this.picker = null, this.log.log("bound selector to step", t.id, e), this.render();
      },
      { ignore: [this.host] }
    ), this.picker.start(), this.render());
  }
  stopPicking() {
    this.picker?.stop(), this.picker = null, this.picking = !1;
  }
  // ---------- preview ----------
  togglePreview() {
    if (this.mode === "preview") {
      this.player?.stop(), this.player = null, this.mode = "build", this.render();
      return;
    }
    const t = this.export();
    if (!t.ok) {
      this.log.warn("cannot preview — draft is invalid", t.errors), window.alert(`Add a selector and text to at least one step first:

${t.errors.join(`
`)}`);
      return;
    }
    this.mode = "preview", this.render(), this.player = wt(t.tour), this.player.start();
  }
  // ---------- rendering ----------
  render() {
    this.root && (this.root.querySelectorAll(".panel, .nav").forEach((t) => t.remove()), this.mode === "build" && this.root.appendChild(this.renderPanel()), this.root.appendChild(this.renderNav()), this.focusStepId && (this.focusContent(this.focusStepId), this.focusStepId = null), this.updateOverlays(), this.markDirty());
  }
  /** Resolve a step's target on the page, trying each candidate selector. */
  resolveTarget(t) {
    return L(t.selectors);
  }
  /**
   * Draw the dashed outline around the active step's target, and (in the Card
   * sub-tab) a live tooltip-card preview beside it. Both use the same
   * tour-level values the player reads. Shown only in build mode when the
   * active step resolves; hidden while picking or in preview. No backdrop.
   */
  updateOverlays() {
    const t = this.highlight;
    if (!t) return;
    const e = () => {
      t.style.display = "none", this.removeCardPreview();
    };
    if (this.view !== "edit" || this.mode !== "build" || this.picking) return e();
    const n = this.activeStep, i = n && n.selectors.length > 0 ? this.resolveTarget(n) : null;
    if (!n || !i) return e();
    const o = i.getBoundingClientRect(), { padding: s, radius: d, cardRadius: l } = this.tour.display;
    t.className = `highlight ${this.tab === "display" ? "highlight--settings" : ""}`.trim(), t.style.display = "block", t.style.left = `${o.left - s}px`, t.style.top = `${o.top - s}px`, t.style.width = `${o.width + s * 2}px`, t.style.height = `${o.height + s * 2}px`, t.style.borderRadius = `${d}px`, this.drawStepCard(n, o, l);
  }
  removeCardPreview() {
    this.cardPreview && (this.cardPreview.remove(), this.cardPreview = null);
  }
  /**
   * Render the active step's card near its target via the shared renderCard —
   * the exact markup the player uses. Shown when the step has content; in the
   * Card sub-tab a muted placeholder shows so the radius stays visible first.
   */
  drawStepCard(t, e, n) {
    const i = t.content.trim(), o = this.tab === "display" && this.displaySub === "card";
    if (!i && !o) {
      this.removeCardPreview();
      return;
    }
    const s = this.tour.steps, d = s.indexOf(t), l = (v) => () => {
      const h = s[v];
      h && this.setActive(h.id);
    }, c = et({
      ghost: !0,
      contentText: i || "Step tooltip preview",
      progress: `Step ${d + 1} of ${s.length}`,
      showClose: !0,
      onClose: () => {
        this.activeStepId = null, this.render();
      },
      radius: n,
      back: { label: t.backLabel, disabled: d <= 0, onClick: l(d - 1) },
      next: { label: t.nextLabel, primary: !0, disabled: d >= s.length - 1, onClick: l(d + 1) }
    });
    if (!i) {
      const v = c.querySelector(".tours-card__content");
      v && (v.style.opacity = "0.55");
    }
    this.removeCardPreview(), this.cardPreview = c, this.root?.appendChild(c);
    const u = this.tour.display.padding, g = {
      top: e.top - u,
      left: e.left - u,
      right: e.right + u,
      bottom: e.bottom + u,
      width: e.width + u * 2,
      height: e.height + u * 2
    }, { top: y, left: _ } = tt({
      target: g,
      card: { width: c.offsetWidth, height: c.offsetHeight },
      side: t.placement,
      align: t.align,
      offset: this.tour.display.offset,
      alignOffset: this.tour.display.alignOffset,
      viewport: { width: window.innerWidth, height: window.innerHeight }
    });
    c.style.left = `${_}px`, c.style.top = `${y}px`;
  }
  renderNav() {
    const t = a("div", { class: `nav nav--${this.navPosition}` }), e = x("build", "Build", this.mode === "build" ? "iconbtn--active" : "");
    e.addEventListener("click", () => {
      this.mode === "preview" && this.togglePreview();
    });
    const n = x("preview", "Preview", this.mode === "preview" ? "iconbtn--active" : "");
    n.addEventListener("click", () => this.togglePreview());
    const i = x("navFlip", "Move bar (top/bottom)");
    i.addEventListener("click", () => {
      this.navPosition = this.navPosition === "bottom" ? "top" : "bottom", this.render();
    });
    const o = x("close", "Close builder");
    return o.addEventListener("click", () => this.destroy()), t.append(e, n, a("div", { class: "nav__sep" }), i, o), t;
  }
  renderPanel() {
    const t = a("div", { class: `panel panel--${this.panelPosition}` });
    return this.view === "list" ? t.append(this.renderListHeader(), this.renderList()) : t.append(this.renderHeader(), this.renderToolbar(), this.renderTabs(), this.renderBody()), t;
  }
  renderListHeader() {
    const t = a("div", { class: "panel__header" }), e = a("div", { class: "listtabs" });
    for (const [i, o] of [["tour", "Tours"], ["template", "Templates"]]) {
      const s = a("button", {
        class: `listtab ${this.listFilter === i ? "listtab--active" : ""}`.trim(),
        type: "button"
      }, [o]);
      s.addEventListener("click", () => {
        this.listFilter = i, this.render();
      }), e.append(s);
    }
    const n = a("button", { class: "newtour", type: "button", title: "New" }, ["+ New"]);
    return n.addEventListener("click", () => this.createEntity()), t.append(e, n), t;
  }
  renderList() {
    const t = a("div", { class: "panel__body" }), e = a("div", { class: "tourlist" }), n = this.tours.filter((i) => i.kind === this.listFilter);
    return n.length === 0 ? (t.append(
      a("div", { class: "assets-empty" }, [
        this.listFilter === "template" ? "No templates yet." : "No tours yet."
      ])
    ), t) : (n.forEach((i) => {
      const o = a("div", { class: "tourrow" });
      o.addEventListener("click", () => this.openTour(i.id));
      const s = a("div", { class: "tourrow__main" });
      if (s.append(
        a("div", { class: "tourrow__name" }, [i.name]),
        a("div", { class: "tourrow__meta" }, [
          `${i.steps.length} step${i.steps.length === 1 ? "" : "s"}`
        ])
      ), o.append(s), i.kind === "template") {
        const l = a("button", { class: "tourrow__use", type: "button", title: "Create a tour from this template" }, ["Use"]);
        l.addEventListener("click", (c) => {
          c.stopPropagation(), this.createFromTemplate(i.id);
        }), o.append(l);
      } else
        o.append(a("span", { class: `status status--${i.status}` }, [i.status]));
      const d = x("trash", "Delete");
      d.addEventListener("click", (l) => {
        l.stopPropagation(), this.deleteEntity(i.id);
      }), o.append(d), e.append(o);
    }), t.append(e), t);
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
    const i = x("menu", "Menu", this.menuOpen ? "iconbtn--active" : "");
    return i.addEventListener("click", () => {
      this.menuOpen = !this.menuOpen, this.render();
    }), t.append(e, n, i), this.menuOpen && t.append(this.renderMenu()), t;
  }
  /** The ⋯ dropdown: save-as-template (tours only) and JSON export. */
  renderMenu() {
    const t = a("div", { class: "menu" }), e = (n, i) => {
      const o = a("button", { class: "menu__item", type: "button" }, [n]);
      return o.addEventListener("click", () => {
        this.menuOpen = !1, i();
      }), o;
    };
    return this.tour.kind === "tour" && t.append(e("Save as template", () => this.saveAsTemplate())), t.append(e("Export JSON", () => this.exportJson())), t;
  }
  exportJson() {
    const t = this.export();
    this.log.log("tour JSON", t), window.prompt("Tour JSON (copy):", t.ok ? JSON.stringify(t.tour) : t.errors.join("; ")), this.render();
  }
  renderToolbar() {
    const t = a("div", { class: "panel__toolbar" }), e = x("back", "Back to tours");
    e.addEventListener("click", () => {
      this.stopPicking(), this.view = "list", this.render();
    });
    const n = x("panelSide", "Move panel (left/right)");
    n.addEventListener("click", () => {
      this.panelPosition = this.panelPosition === "right" ? "left" : "right", this.render();
    });
    const i = x(
      "cursor",
      this.picking ? "Cancel picking" : "Pick element for active step",
      this.picking ? "iconbtn--active" : ""
    );
    return i.addEventListener("click", () => this.togglePicking()), t.append(e, a("div", { class: "spacer" }), n, i), t;
  }
  renderTabs() {
    const t = a("div", { class: "tabs" });
    for (const [e, n] of [
      ["steps", "Steps"],
      ["display", "Display"],
      ["assets", "Assets"]
    ]) {
      const i = a("button", { class: `tab ${this.tab === e ? "tab--active" : ""}`, type: "button" }, [n]);
      i.addEventListener("click", () => {
        this.tab = e, e === "display" && this.selectFirstResolvableStep(), this.render();
      }), t.append(i);
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
    for (const [i, o] of [["tour", "Tour"], ["card", "Card"]]) {
      const s = a("button", { class: `subtab ${this.displaySub === i ? "subtab--active" : ""}`, type: "button" }, [o]);
      s.addEventListener("click", () => {
        this.displaySub = i, this.render();
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
      this.slider("Outline spacing", n.padding, 0, 40, (i) => n.padding = i),
      this.slider("Outline corner radius", n.radius, 0, 40, (i) => n.radius = i),
      a("div", { class: "settings__hint" }, [
        "The outline framing the target — applied in the builder and in the live tour spotlight."
      ])
    ) : t.append(
      this.slider("Card corner radius", n.cardRadius, 0, 32, (i) => n.cardRadius = i),
      this.slider("Distance from target", n.offset, 0, 48, (i) => n.offset = i),
      this.slider("Alignment inset", n.alignOffset, 0, 48, (i) => n.alignOffset = i),
      a("div", { class: "settings__hint" }, [
        "Distance is the gap to the element; alignment inset nudges the card in from the aligned edge (start/end placements)."
      ])
    ), t;
  }
  /** A labelled range slider that writes through `set` and re-draws overlays live. */
  slider(t, e, n, i, o) {
    let s = e;
    const d = a("span", { class: "settings__value", title: "Click to type a value" }, [`${s}px`]), l = a("input", {
      class: "settings__slider",
      type: "range",
      min: String(n),
      max: String(i),
      step: "1"
    });
    l.value = String(s);
    const c = (y) => {
      s = Math.max(n, Math.min(i, Math.round(y))), l.value = String(s), d.textContent = `${s}px`, o(s), this.updateOverlays(), this.markDirty();
    };
    l.addEventListener("input", () => c(Number(l.value))), d.addEventListener("click", () => this.editNumber(d, s, c));
    const u = a("div", { class: "settings__row" });
    u.append(l, d);
    const g = a("div", { class: "settings__field" });
    return g.append(a("label", { class: "settings__label" }, [t]), u), g;
  }
  /** Swap a value label for a digits-only input; commit on blur/Enter. */
  editNumber(t, e, n) {
    const i = a("input", {
      class: "settings__num",
      type: "text",
      inputmode: "numeric"
    });
    i.value = String(e), t.replaceWith(i), i.focus(), i.select(), i.addEventListener("input", () => {
      i.value = i.value.replace(/[^0-9]/g, "");
    });
    const o = () => {
      const s = i.value === "" ? e : Number(i.value);
      i.replaceWith(t), n(s);
    };
    i.addEventListener("blur", o), i.addEventListener("keydown", (s) => {
      s.key === "Enter" && i.blur(), s.key === "Escape" && (i.value = String(e), i.blur());
    });
  }
  renderBody() {
    const t = a("div", { class: "panel__body" });
    if (this.tab === "assets")
      return t.append(a("div", { class: "assets-empty" }, ["Assets — coming soon"])), t;
    if (this.tab === "display")
      return t.append(this.renderDisplaySettings()), t;
    const e = a("div", { class: "steps" });
    return e.append(this.renderConnector(-1)), this.tour.steps.forEach((n, i) => {
      e.append(this.renderCard(n, i)), e.append(this.renderConnector(i));
    }), t.append(e), t;
  }
  renderConnector(t) {
    const e = a("div", { class: "connector" }), n = a("button", { class: "connector__add", title: "Add step", type: "button" }, ["+"]);
    return n.addEventListener("click", () => this.addStepAfter(t)), e.append(a("div", { class: "connector__line" }), n, a("div", { class: "connector__line" })), e;
  }
  renderCard(t, e) {
    const n = t.id === this.activeStepId, i = a("div", {
      class: `card ${n ? "card--active" : ""} ${t.included ? "" : "card--excluded"}`.trim()
    });
    return i.addEventListener("mousedown", () => this.setActive(t.id)), i.append(this.renderCardControl(t, e), this.renderCardContent(t), this.renderCardFooter(t)), n && i.append(this.section("placement", "Card position", () => this.renderPlacementBody(t))), i;
  }
  /**
   * A collapsible card-settings section: a header with a left caret + title;
   * clicking toggles it. Collapsed by default; open state persists across
   * renders (keyed) so switching steps keeps the same sections expanded.
   */
  section(t, e, n) {
    const i = this.openSections.has(t), o = a("div", { class: `acc ${i ? "acc--open" : ""}`.trim() }), s = a("button", { class: "acc__head", type: "button" }), d = a("span", { class: "acc__caret" });
    return d.innerHTML = R.chevron, s.append(d, a("span", { class: "acc__title" }, [e])), s.addEventListener("click", () => {
      i ? this.openSections.delete(t) : this.openSections.add(t), this.render();
    }), o.append(s), i && o.append(n()), o;
  }
  /**
   * Placement picker body: an Auto toggle plus a 12-anchor grid (each side ×
   * start/center/end) around a mock target. Editing re-renders so the on-page
   * card and the active anchor update together.
   */
  renderPlacementBody(t) {
    const e = a("div", { class: "place" }), n = a("div", { class: "place__grid" });
    n.append(a("div", { class: "place__el" })), n.append(a("div", { class: "place__el" }));
    const i = [
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
    for (const s of i) {
      const d = t.placement === s.side && t.align === s.align, l = a("button", {
        class: `place__dot ${d ? "place__dot--active" : ""}`.trim(),
        type: "button",
        title: `${s.side} · ${s.align}`
      });
      l.style.left = `${s.x - 6}px`, l.style.top = `${s.y - 6}px`, l.addEventListener("click", () => {
        t.placement = s.side, t.align = s.align, this.render();
      }), n.append(l);
    }
    e.append(n);
    const o = a("button", {
      class: `place__auto ${t.placement === "auto" ? "place__auto--active" : ""}`.trim(),
      type: "button",
      title: "Pick the side with the most room automatically"
    }, ["Auto"]);
    return o.addEventListener("click", () => {
      t.placement = "auto", this.render();
    }), e.append(o), e;
  }
  renderCardControl(t, e) {
    const n = a("div", { class: "card__control" }), i = a("input", { class: "card__check", type: "checkbox", title: "Include in tour" });
    i.checked = t.included, i.addEventListener("change", () => {
      t.included = i.checked, this.render();
    });
    const o = a("span", { class: "card__index" }, [String(e + 1)]), s = a("span", { class: "card__type" });
    s.innerHTML = R[t.type === "action" ? "bolt" : "step"], s.append(document.createTextNode(t.type === "action" ? "Action" : "Step"));
    const d = t.selectors[0], l = a("span", { class: `card__sel ${d ? "" : "card__sel--empty"}`.trim(), title: d ?? "" }, [
      d ?? "no selector"
    ]), c = x("trash", "Delete step");
    return c.addEventListener("click", () => this.removeStep(t.id)), n.append(i, o, s, a("div", { class: "spacer" }), l, c), n;
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
    return n.addEventListener("click", (i) => {
      i.stopPropagation();
      const o = a("input", { class: "cardbtn cardbtn--edit", value: t[e] });
      o.value = t[e], n.replaceWith(o), o.focus(), o.select();
      const s = () => {
        t[e] = o.value.trim() || (e === "backLabel" ? "Back" : "Next"), o.replaceWith(this.renderEditableButton(t, e)), this.markDirty();
      };
      o.addEventListener("blur", s), o.addEventListener("keydown", (d) => {
        d.key === "Enter" && o.blur(), d.key === "Escape" && (o.value = t[e], o.blur());
      });
    }), n;
  }
  // ---------- misc ----------
  /** Focus a card's content area and place the caret at the end. */
  focusContent(t) {
    const e = this.root?.querySelector(`.card__content[data-step="${t}"]`);
    if (!e) return;
    e.focus();
    const n = document.createRange();
    n.selectNodeContents(e), n.collapse(!1);
    const i = window.getSelection();
    i?.removeAllRanges(), i?.addRange(n);
  }
}
export {
  it as TourBuilder,
  K as cloneDraft,
  j as createDraftStep,
  I as createDraftTour,
  Ct as createLocalStore,
  Et as createWordPressStore,
  rt as normalizeTours,
  St as toTour
};
