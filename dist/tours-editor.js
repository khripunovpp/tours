const xe = `
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
`, ye = `
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
function z(n) {
  return JSON.stringify(n);
}
function we(n) {
  return /^[a-zA-Z][\w-]*$/.test(n) && n.length <= 30 && !/\d{2,}/.test(n) && !/^(css-|sc-|jsx-|emotion-|_|is-|has-)/.test(n);
}
function Z(n) {
  const e = [];
  let t = n;
  for (; t && t !== document.body && t.nodeType === 1; ) {
    const r = t.tagName.toLowerCase(), i = t.parentElement;
    if (!i) {
      e.unshift(r);
      break;
    }
    const o = Array.from(i.children).filter((s) => s.tagName === t.tagName);
    e.unshift(o.length > 1 ? `${r}:nth-of-type(${o.indexOf(t) + 1})` : r), t = i;
  }
  return `body > ${e.join(" > ")}`;
}
function _e(n) {
  let e = n.parentElement;
  for (; e && e !== document.body && !e.id; )
    e = e.parentElement;
  if (!e || !e.id) return null;
  const t = [];
  let r = n;
  for (; r && r !== e; ) {
    const i = r.tagName.toLowerCase(), o = r.parentElement;
    if (!o) return null;
    const s = Array.from(o.children).filter((l) => l.tagName === r.tagName);
    t.unshift(s.length > 1 ? `${i}:nth-of-type(${s.indexOf(r) + 1})` : i), r = o;
  }
  return `#${CSS.escape(e.id)} > ${t.join(" > ")}`;
}
const ke = ["data-testid", "data-test", "data-test-id", "data-cy", "data-qa", "data-id", "data-name"];
function Ee(n) {
  const e = [], t = /* @__PURE__ */ new Set(), r = n.tagName.toLowerCase(), i = (d) => {
    if (!(!d || t.has(d)))
      try {
        document.querySelector(d) === n && (t.add(d), e.push(d));
      } catch {
      }
  };
  n.id && i(`#${CSS.escape(n.id)}`);
  for (const d of ke) {
    const u = n.getAttribute(d);
    u && i(`${r}[${d}=${z(u)}]`);
  }
  const o = n.getAttribute("name");
  o && i(`${r}[name=${z(o)}]`);
  const s = n.getAttribute("aria-label");
  s && i(`[aria-label=${z(s)}]`);
  const l = Array.from(n.classList).filter(we);
  l.length && i(`${r}.${l.map((d) => CSS.escape(d)).join(".")}`);
  for (const d of l) i(`${r}.${CSS.escape(d)}`);
  i(_e(n)), i(Z(n));
  const p = (n.textContent ?? "").replace(/\s+/g, " ").trim();
  if (p && p.length <= 50 && /^(a|button|summary|label|h[1-6])$/.test(r)) {
    const d = `text=${p}`;
    t.has(d) || (t.add(d), e.push(d));
  }
  return e.length === 0 && e.push(Z(n)), e;
}
const Se = "a, button, summary, label, h1, h2, h3, h4, h5, h6";
function Ce(n, e) {
  if (n.startsWith("text=")) {
    const t = n.slice(5).trim();
    for (const r of Array.from(e.querySelectorAll(Se)))
      if ((r.textContent ?? "").replace(/\s+/g, " ").trim() === t) return r;
    return null;
  }
  try {
    return e.querySelector(n);
  } catch {
    return null;
  }
}
function T(n, e = document) {
  for (const t of n) {
    const r = Ce(t, e);
    if (r) return r;
  }
  return null;
}
function $e(n, e = {}) {
  const t = e.root ?? document, r = T(n, t);
  return r ? Promise.resolve(r) : new Promise((i) => {
    let o = !1, s;
    const l = (u) => {
      o || (o = !0, p.disconnect(), s && clearTimeout(s), i(u));
    }, p = new MutationObserver(() => {
      const u = T(n, t);
      u && l(u);
    });
    p.observe(document.documentElement, {
      childList: !0,
      subtree: !0,
      attributes: !0
    });
    const d = e.timeout ?? 4e3;
    d > 0 && Number.isFinite(d) && (s = setTimeout(() => l(null), d));
  });
}
let C = null;
function I() {
  if (C !== null) return C;
  try {
    C = new URLSearchParams(window.location.search).has("use_logs");
  } catch {
    C = !1;
  }
  return C;
}
function F(n) {
  const e = `[tours:${n}]`;
  return {
    log: (...t) => {
      I() && console.log(e, ...t);
    },
    warn: (...t) => {
      I() && console.warn(e, ...t);
    },
    error: (...t) => {
      I() && console.error(e, ...t);
    }
  };
}
function Le(n, e = {}) {
  const t = F("picker");
  let r = null, i = null, o = null, s = !1;
  function l(f) {
    if (f === r) return !0;
    for (const g of e.ignore ?? [])
      if (g && g.contains(f)) return !0;
    return !1;
  }
  function p() {
    if (r) return;
    r = document.createElement("div"), r.setAttribute("data-tours-picker", ""), i = r.attachShadow({ mode: "open" });
    const f = document.createElement("style");
    f.textContent = xe, i.appendChild(f), o = document.createElement("div"), o.className = "tours-picker-overlay", o.style.display = "none", i.appendChild(o);
    const g = document.createElement("div");
    g.className = "tours-picker-hint", g.textContent = "Hover and click an element • Esc to cancel", i.appendChild(g), document.body.appendChild(r);
  }
  function d(f, g) {
    const m = document.elementFromPoint(f, g);
    return !m || l(m) ? null : m;
  }
  function u(f) {
    if (!s || !o) return;
    const g = d(f.clientX, f.clientY);
    if (!g) {
      o.style.display = "none";
      return;
    }
    const m = g.getBoundingClientRect();
    o.style.display = "block", o.style.left = `${m.left}px`, o.style.top = `${m.top}px`, o.style.width = `${m.width}px`, o.style.height = `${m.height}px`;
  }
  function h(f) {
    if (!s) return;
    const g = d(f.clientX, f.clientY);
    if (f.preventDefault(), f.stopPropagation(), !g) return;
    const m = Ee(g);
    t.log("picked", m), x(), n(m);
  }
  function _(f) {
    f.key === "Escape" && (f.preventDefault(), x());
  }
  function S() {
    s || (s = !0, t.log("start"), p(), document.addEventListener("mousemove", u, !0), document.addEventListener("click", h, !0), document.addEventListener("keydown", _, !0));
  }
  function x() {
    s && (s = !1, document.removeEventListener("mousemove", u, !0), document.removeEventListener("click", h, !0), document.removeEventListener("keydown", _, !0), r && r.parentNode && r.parentNode.removeChild(r), r = null, i = null, o = null);
  }
  return { start: S, stop: x };
}
const U = 6, j = 6, V = 10, H = 12, Te = 1;
function w(n) {
  return typeof n == "object" && n !== null && !Array.isArray(n);
}
function Q(n) {
  return w(n) && typeof n.default == "string";
}
const ee = ["top", "bottom", "left", "right", "auto"], te = ["start", "center", "end"], re = ["mobile", "tablet", "desktop"], ne = ["click", "input", "navigate", "none"];
function de(n, e, t) {
  if (!w(n)) {
    t.push(`${e} must be an object`);
    return;
  }
  const r = typeof n.glob == "string" && n.glob.length > 0, i = typeof n.regex == "string" && n.regex.length > 0;
  if (!r && !i && t.push(`${e} must have a non-empty "glob" or "regex"`), i)
    try {
      new RegExp(n.regex);
    } catch {
      t.push(`${e}.regex is not a valid regular expression`);
    }
}
function ie(n, e, t) {
  if (!w(n)) {
    t.push(`${e} must be an object`);
    return;
  }
  n.url !== void 0 && de(n.url, `${e}.url`, t), n.role !== void 0 && typeof n.role != "string" && t.push(`${e}.role must be a string`), n.firstVisitOnly !== void 0 && typeof n.firstVisitOnly != "boolean" && t.push(`${e}.firstVisitOnly must be a boolean`), n.device !== void 0 && !re.includes(n.device) && t.push(`${e}.device must be one of ${re.join("|")}`), n.unlessSeen !== void 0 && typeof n.unlessSeen != "boolean" && t.push(`${e}.unlessSeen must be a boolean`), n.maxShows !== void 0 && (typeof n.maxShows != "number" || n.maxShows < 0) && t.push(`${e}.maxShows must be a non-negative number`);
}
function Pe(n, e, t) {
  if (!w(n)) {
    t.push(`${e} must be an object`);
    return;
  }
  ne.includes(n.type) || t.push(`${e}.type must be one of ${ne.join("|")}`), n.url !== void 0 && typeof n.url != "string" && t.push(`${e}.url must be a string`), n.value !== void 0 && typeof n.value != "string" && t.push(`${e}.value must be a string`);
}
function Ae(n) {
  const e = [];
  if (!w(n))
    return { ok: !1, errors: ["tour must be an object"] };
  if ((typeof n.id != "string" || n.id.length === 0) && e.push("tour.id must be a non-empty string"), typeof n.schemaVersion != "number" && e.push("tour.schemaVersion must be a number"), Q(n.title) || e.push('tour.title must be a localized text with a string "default"'), Array.isArray(n.steps) ? n.steps.length === 0 ? e.push("tour.steps must contain at least one step") : n.steps.forEach((t, r) => {
    if (!w(t)) {
      e.push(`steps[${r}] must be an object`);
      return;
    }
    (typeof t.id != "string" || t.id.length === 0) && e.push(`steps[${r}].id must be a non-empty string`), (!Array.isArray(t.selectors) || t.selectors.length === 0 || !t.selectors.every((i) => typeof i == "string" && i.length > 0)) && e.push(`steps[${r}].selectors must be a non-empty array of non-empty strings`), Q(t.content) || e.push(`steps[${r}].content must be a localized text with a string "default"`), t.placement !== void 0 && !ee.includes(t.placement) && e.push(`steps[${r}].placement must be one of ${ee.join("|")}`), t.align !== void 0 && !te.includes(t.align) && e.push(`steps[${r}].align must be one of ${te.join("|")}`), t.backLabel !== void 0 && typeof t.backLabel != "string" && e.push(`steps[${r}].backLabel must be a string`), t.nextLabel !== void 0 && typeof t.nextLabel != "string" && e.push(`steps[${r}].nextLabel must be a string`), t.pageUrl !== void 0 && de(t.pageUrl, `steps[${r}].pageUrl`, e), t.condition !== void 0 && ie(t.condition, `steps[${r}].condition`, e), t.action !== void 0 && Pe(t.action, `steps[${r}].action`, e);
  }) : e.push("tour.steps must be an array"), n.trigger !== void 0) {
    const t = n.trigger, r = ["manual", "load", "selector", "timer"];
    !w(t) || typeof t.type != "string" || !r.includes(t.type) ? e.push(`tour.trigger.type must be one of ${r.join("|")}`) : t.type === "selector" && (typeof t.selector != "string" || t.selector.length === 0) ? e.push("tour.trigger.selector must be a non-empty string") : t.type === "timer" && (typeof t.delay != "number" || t.delay < 0) && e.push("tour.trigger.delay must be a non-negative number");
  }
  if (n.audience !== void 0 && !["all", "auth", "guest"].includes(n.audience) && e.push("tour.audience must be one of all|auth|guest"), n.display !== void 0)
    if (!w(n.display))
      e.push("tour.display must be an object");
    else
      for (const t of ["padding", "radius", "cardRadius", "offset", "alignOffset"]) {
        const r = n.display[t];
        r !== void 0 && (typeof r != "number" || r < 0) && e.push(`tour.display.${t} must be a non-negative number`);
      }
  return n.rules !== void 0 && (Array.isArray(n.rules) ? n.rules.forEach((t, r) => {
    if (!w(t)) {
      e.push(`rules[${r}] must be an object`);
      return;
    }
    t.tourId !== void 0 && typeof t.tourId != "string" && e.push(`rules[${r}].tourId must be a string`), t.when === void 0 ? e.push(`rules[${r}].when is required`) : ie(t.when, `rules[${r}].when`, e);
  }) : e.push("tour.rules must be an array")), e.length > 0 ? { ok: !1, errors: e } : { ok: !0, tour: n };
}
function Ne(n, e, t) {
  const r = {
    top: n.top,
    bottom: t.height - n.bottom,
    left: n.left,
    right: t.width - n.right
  }, i = {
    top: e.height,
    bottom: e.height,
    left: e.width,
    right: e.width
  }, o = ["bottom", "top", "right", "left"], s = o.find((l) => r[l] >= i[l] + 8);
  return s || o.reduce((l, p) => r[p] > r[l] ? p : l, o[0]);
}
function le(n) {
  const { target: e, card: t, offset: r, viewport: i } = n, o = n.side === "auto", s = o ? Ne(e, t, i) : n.side, l = o ? "center" : n.align, p = n.alignOffset ?? 0, d = l === "start" ? p : l === "end" ? -p : 0;
  let u = 0, h = 0;
  return s === "top" || s === "bottom" ? (u = s === "top" ? e.top - t.height - r : e.bottom + r, h = l === "start" ? e.left : l === "end" ? e.right - t.width : e.left + e.width / 2 - t.width / 2, h += d) : (h = s === "left" ? e.left - t.width - r : e.right + r, u = l === "start" ? e.top : l === "end" ? e.bottom - t.height : e.top + e.height / 2 - t.height / 2, u += d), h = Math.max(8, Math.min(h, i.width - t.width - 8)), u = Math.max(8, Math.min(u, i.height - t.height - 8)), { top: u, left: h };
}
function oe(n) {
  const e = document.createElement("button");
  return e.type = "button", e.className = `tours-card__btn${n.primary ? " tours-card__btn--primary" : ""}${n.disabled ? " tours-card__btn--disabled" : ""}`, e.textContent = n.label, !n.disabled && n.onClick && e.addEventListener("click", n.onClick), e;
}
function ce(n) {
  const e = document.createElement("div");
  if (e.className = `tours-card${n.ghost ? " tours-card--ghost" : ""}`, n.radius != null && (e.style.borderRadius = `${n.radius}px`), n.showClose) {
    const r = document.createElement("button");
    r.className = "tours-card__close", r.type = "button", r.textContent = "×", r.setAttribute("aria-label", "Close"), n.onClose && r.addEventListener("click", n.onClose), e.appendChild(r);
  }
  const t = document.createElement("div");
  if (t.className = "tours-card__content", n.contentHtml != null ? t.innerHTML = n.contentHtml : t.textContent = n.contentText ?? "", e.appendChild(t), n.back || n.next || n.progress) {
    const r = document.createElement("div");
    if (r.className = "tours-card__footer", n.back && r.appendChild(oe(n.back)), n.progress) {
      const i = document.createElement("span");
      i.className = "tours-card__progress", i.textContent = n.progress, r.appendChild(i);
    }
    n.next && r.appendChild(oe(n.next)), e.appendChild(r);
  }
  return e;
}
const pe = `
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
function Oe(n) {
  const e = n.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*\*/g, "\0").replace(/\*/g, "[^/]*").replace(/ /g, ".*").replace(/\?/g, ".");
  return new RegExp(`^${e}$`);
}
function M(n, e) {
  if (!n) return !0;
  if (n.regex)
    try {
      return new RegExp(n.regex).test(e);
    } catch {
      return !1;
    }
  if (n.glob)
    try {
      return Oe(n.glob).test(e);
    } catch {
      return !1;
    }
  return !0;
}
const D = "tours:locationchange";
let se = !1;
function ze() {
  if (!se) {
    se = !0;
    for (const n of ["pushState", "replaceState"]) {
      const e = history[n];
      history[n] = function(...r) {
        const i = e.apply(this, r);
        return window.dispatchEvent(new Event(D)), i;
      };
    }
  }
}
function Ie(n) {
  return ze(), window.addEventListener("popstate", n), window.addEventListener("hashchange", n), window.addEventListener(D, n), () => {
    window.removeEventListener("popstate", n), window.removeEventListener("hashchange", n), window.removeEventListener(D, n);
  };
}
const ue = "tours:progress";
function Re(n, e) {
  n.set(ue, JSON.stringify(e));
}
function Me(n) {
  n.remove(ue);
}
function De(n, e = {}) {
  const t = F("player"), r = e.state;
  let i = null, o = null, s = null, l = null, p = !1, d = 0, u = null;
  const h = n.display?.padding ?? U, _ = n.display?.radius ?? j, S = n.display?.cardRadius ?? V, x = n.display?.offset ?? H;
  function f(c) {
    return T(c.selectors);
  }
  function g(c) {
    return M(c.pageUrl, window.location.href);
  }
  function m() {
    r && Re(r, { tourId: n.id, index: d });
  }
  function J() {
    if (i) return;
    i = document.createElement("div"), i.setAttribute("data-tours-player", ""), o = i.attachShadow({ mode: "open" });
    const c = document.createElement("style");
    c.textContent = ye + pe, o.appendChild(c);
    const b = document.createElement("div");
    b.className = "tours-backdrop", o.appendChild(b), s = document.createElement("div"), s.className = "tours-spotlight", s.style.borderRadius = `${_}px`, o.appendChild(s), document.body.appendChild(i);
  }
  function Y(c) {
    s && (s.style.display = "block", s.style.left = `${c.left - h}px`, s.style.top = `${c.top - h}px`, s.style.width = `${c.width + h * 2}px`, s.style.height = `${c.height + h * 2}px`);
  }
  function q(c, b) {
    if (!l) return;
    const v = {
      top: c.top - h,
      left: c.left - h,
      right: c.right + h,
      bottom: c.bottom + h,
      width: c.width + h * 2,
      height: c.height + h * 2
    }, { top: O, left: ve } = le({
      target: v,
      card: { width: l.offsetWidth, height: l.offsetHeight },
      side: b.placement ?? "bottom",
      align: b.align ?? "center",
      offset: x,
      alignOffset: n.display?.alignOffset ?? 0,
      viewport: { width: window.innerWidth, height: window.innerHeight }
    });
    l.style.left = `${ve}px`, l.style.top = `${O}px`;
  }
  function ge(c) {
    const b = n.steps.length;
    l && l.remove(), l = ce({
      contentText: c.content.default,
      progress: `Step ${d + 1} of ${b}`,
      showClose: !0,
      onClose: E,
      radius: S,
      back: { label: c.backLabel ?? "Back", disabled: d === 0, onClick: N },
      next: {
        label: c.nextLabel ?? (d === b - 1 ? "Done" : "Next"),
        primary: !0,
        onClick: A
      }
    }), o?.appendChild(l);
  }
  function k() {
    if (!p) return;
    const c = n.steps[d];
    if (!c) {
      E();
      return;
    }
    t.log("render step", d, c.id);
    const b = f(c);
    if (!b) {
      t.log(`step "${c.id}" target not found yet — waiting`, c.selectors), $e(c.selectors, { timeout: 4e3 }).then((O) => {
        !p || n.steps[d] !== c || (O ? k() : (t.warn(`step "${c.id}" skipped: no element for selectors`, c.selectors), d < n.steps.length - 1 ? (d += 1, k()) : E()));
      });
      return;
    }
    J(), b.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" }), ge(c);
    const v = b.getBoundingClientRect();
    Y(v), q(v, c);
  }
  function G(c) {
    p && (c.key === "Escape" ? (c.preventDefault(), E()) : c.key === "ArrowRight" ? A() : c.key === "ArrowLeft" && N());
  }
  function L() {
    if (!p) return;
    const c = n.steps[d];
    if (!c) return;
    const b = f(c);
    if (!b) return;
    const v = b.getBoundingClientRect();
    Y(v), q(v, c);
  }
  function be(c = 0) {
    p || n.steps.length !== 0 && (p = !0, d = Math.max(0, Math.min(c, n.steps.length - 1)), t.log("start", n.id, `at ${d}/${n.steps.length}`), J(), window.addEventListener("keydown", G, !0), window.addEventListener("resize", L, !0), window.addEventListener("scroll", L, !0), m(), k());
  }
  function me() {
    s && (s.style.display = "none"), l && (l.remove(), l = null);
  }
  function K() {
    me(), !u && (u = Ie(() => {
      if (!p) {
        u?.(), u = null;
        return;
      }
      const c = n.steps[d];
      c && g(c) && (u?.(), u = null, k());
    }));
  }
  function X() {
    u && (u(), u = null), p && (p = !1, window.removeEventListener("keydown", G, !0), window.removeEventListener("resize", L, !0), window.removeEventListener("scroll", L, !0), i && i.parentNode && i.parentNode.removeChild(i), i = null, o = null, s = null, l = null);
  }
  function E() {
    t.log("stop"), X(), r && Me(r);
  }
  function A() {
    if (!p) return;
    const c = d + 1, b = n.steps[c];
    if (!b) {
      E();
      return;
    }
    if (g(b)) {
      d = c, m(), k();
      return;
    }
    d = c, m();
    const v = n.steps[d - 1]?.action;
    if (v && v.type === "navigate" && v.url) {
      t.log("page transition (navigate) → resume at", d), X(), window.location.assign(v.url);
      return;
    }
    t.log("page transition (wait) → resume at", d), K();
  }
  function N() {
    if (!p) return;
    const c = n.steps[d - 1];
    if (c) {
      if (g(c)) {
        d -= 1, m(), k();
        return;
      }
      d -= 1, m(), t.log("page transition back → resume at", d), K(), window.history.back();
    }
  }
  return { start: be, stop: E, next: A, prev: N };
}
const Be = `
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
  top: calc(16px + var(--e-top, 0px));
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
  overscroll-behavior: contain;
  padding: 14px 16px 20px;
  /* Reserve the scrollbar gutter always, so content width never shifts. */
  scrollbar-gutter: stable;
  /* Modern thin, auto-hiding scrollbar (Firefox). */
  scrollbar-width: thin;
  scrollbar-color: rgba(100, 116, 139, 0.35) transparent;
}
/* WebKit/Blink: slim, rounded, only-thumb, fades in on hover. */
.panel__body::-webkit-scrollbar { width: 10px; }
.panel__body::-webkit-scrollbar-track { background: transparent; }
.panel__body::-webkit-scrollbar-thumb {
  background-color: transparent;
  border: 3px solid transparent;
  border-radius: 999px;
  background-clip: padding-box;
}
.panel__body:hover::-webkit-scrollbar-thumb {
  background-color: rgba(100, 116, 139, 0.35);
}
.panel__body::-webkit-scrollbar-thumb:hover {
  background-color: rgba(100, 116, 139, 0.6);
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
.card--offpage .card__content { opacity: 0.6; }
.card__page {
  font-size: 11px;
  font-weight: 600;
  color: var(--e-muted);
  background: var(--e-surface);
  border: 1px solid var(--e-border);
  border-radius: 5px;
  padding: 1px 6px;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.pagecfg__input {
  width: 100%;
  box-sizing: border-box;
  font: inherit;
  font-size: 13px;
  padding: 7px 9px;
  border: 1px solid var(--e-border);
  border-radius: 8px;
  background: #fff;
  margin-bottom: 8px;
}
.pagecfg__input:focus { outline: none; border-color: var(--e-accent); }
.tsel {
  width: 100%;
  box-sizing: border-box;
  font: inherit;
  font-size: 13px;
  padding: 7px 9px;
  border: 1px solid var(--e-border);
  border-radius: 8px;
  background: #fff;
  color: var(--e-fg);
  cursor: pointer;
}
.tsel:focus { outline: none; border-color: var(--e-accent); }
.pagecfg__use {
  font-size: 12px;
  font-weight: 600;
  color: var(--e-accent);
  background: var(--e-accent-soft);
  border: 1px solid #c7d6ff;
  border-radius: 7px;
  padding: 5px 12px;
  cursor: pointer;
  margin-bottom: 10px;
}
.pagecfg__use:hover { background: #e3ebff; }

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
.nav--top { top: calc(18px + var(--e-top, 0px)); }
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
`, B = {
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
let Fe = 0;
function P(n) {
  const e = typeof crypto < "u" && "randomUUID" in crypto ? crypto.randomUUID() : `${Fe++}`;
  return `${n}-${e}`;
}
function W(n = "step") {
  return {
    id: P("step"),
    type: n,
    included: !0,
    selectors: [],
    content: "",
    page: "",
    placement: "auto",
    align: "center",
    backLabel: "Back",
    nextLabel: "Next"
  };
}
function R(n = "tour") {
  return {
    id: P(n),
    kind: n,
    name: n === "template" ? "Untitled template" : "Untitled tour",
    status: "draft",
    trigger: { type: "manual" },
    audience: "all",
    steps: [W()],
    display: {
      padding: U,
      radius: j,
      cardRadius: V,
      offset: H,
      alignOffset: 0
    }
  };
}
function ae(n, e, t) {
  return {
    id: P(e),
    kind: e,
    name: t ?? n.name,
    status: "draft",
    trigger: { ...n.trigger },
    audience: n.audience,
    steps: n.steps.map((r) => ({ ...r, id: P("step"), selectors: [...r.selectors] })),
    display: { ...n.display }
  };
}
function Ue(n) {
  if (n && typeof n == "object") {
    const e = n;
    if (e.type === "load") return { type: "load" };
    if (e.type === "selector" && typeof e.selector == "string") return { type: "selector", selector: e.selector };
    if (e.type === "timer" && typeof e.delay == "number") return { type: "timer", delay: e.delay };
  }
  return { type: "manual" };
}
function he(n) {
  if (!Array.isArray(n)) return [];
  const e = [];
  for (const t of n) {
    if (!t || typeof t != "object") continue;
    const r = t;
    typeof r.id != "string" || !Array.isArray(r.steps) || e.push({
      id: r.id,
      kind: r.kind === "template" ? "template" : "tour",
      name: typeof r.name == "string" ? r.name : "Untitled tour",
      status: r.status === "published" ? "published" : "draft",
      trigger: Ue(r.trigger),
      audience: r.audience === "auth" || r.audience === "guest" ? r.audience : "all",
      display: {
        padding: $(r.display?.padding, U),
        radius: $(r.display?.radius, j),
        cardRadius: $(r.display?.cardRadius, V),
        offset: $(r.display?.offset, H),
        alignOffset: $(r.display?.alignOffset, 0)
      },
      steps: r.steps.filter((i) => !!i && typeof i == "object").map((i) => ({
        ...W(i.type === "action" ? "action" : "step"),
        ...i
      }))
    });
  }
  return e;
}
function $(n, e) {
  return typeof n == "number" && n >= 0 ? n : e;
}
function je(n) {
  const e = n.steps.filter((r) => r.included && r.selectors.length > 0).map((r) => ({
    id: r.id,
    selectors: r.selectors,
    content: { default: r.content },
    placement: r.placement,
    align: r.align,
    backLabel: r.backLabel,
    nextLabel: r.nextLabel,
    ...r.page ? { pageUrl: { glob: r.page } } : {}
  })), t = {
    id: n.id,
    schemaVersion: Te,
    title: { default: n.name },
    steps: e,
    trigger: n.trigger,
    audience: n.audience,
    display: {
      padding: n.display.padding,
      radius: n.display.radius,
      cardRadius: n.display.cardRadius,
      offset: n.display.offset,
      alignOffset: n.display.alignOffset
    }
  };
  return Ae(t);
}
function Ve(n = "tours:drafts") {
  return {
    async load() {
      try {
        const e = localStorage.getItem(n);
        return e ? he(JSON.parse(e)) : null;
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
function We(n) {
  const e = { "Content-Type": "application/json" };
  return n.nonce && (e["X-WP-Nonce"] = n.nonce), {
    async load() {
      const t = await fetch(n.url, { headers: e, credentials: "same-origin" });
      if (!t.ok) throw new Error(`WordPress load failed: ${t.status}`);
      return he(await t.json());
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
  for (const [i, o] of Object.entries(e)) r.setAttribute(i, o);
  for (const i of t) r.append(typeof i == "string" ? document.createTextNode(i) : i);
  return r;
}
function y(n, e, t = "") {
  const r = a("button", { class: `iconbtn ${t}`.trim(), title: e, type: "button" });
  return r.innerHTML = B[n] ?? "", r;
}
function He(n) {
  switch (n) {
    case "load":
      return { type: "load" };
    case "selector":
      return { type: "selector", selector: "" };
    case "timer":
      return { type: "timer", delay: 3e3 };
    default:
      return { type: "manual" };
  }
}
class fe {
  constructor(e = {}) {
    this.options = e, this.log = F("editor"), this.host = null, this.root = null, this.tours = [R()], this.openTourId = this.tours[0].id, this.view = "edit", this.listFilter = "tour", this.menuOpen = !1, this.activeStepId = this.tours[0].steps[0]?.id ?? null, this.tab = "steps", this.displaySub = "tour", this.openSections = /* @__PURE__ */ new Set(), this.mode = "build", this.picker = null, this.picking = !1, this.player = null, this.highlight = null, this.cardPreview = null, this.focusStepId = null, this.onViewportChange = () => this.updateOverlays(), this.saveTimer = null, this.navPosition = e.navPosition ?? "bottom", this.panelPosition = e.panelPosition ?? "right", this.topOffset = Math.max(0, e.topOffset ?? 0), this.local = Ve(e.storageKey), this.secondary = e.storage ?? null;
  }
  /**
   * Auto-mount when the page URL carries the flag (default `?tours-edit=1`), so
   * a site owner can enable the builder without touching code. Returns the
   * instance if mounted, otherwise null.
   */
  static fromUrl(e = {}) {
    const t = e.urlFlag ?? "tours-edit", r = new URLSearchParams(window.location.search).get(t);
    if (r === null || r === "0" || r === "false") return null;
    const i = new fe(e);
    return i.mount(), i;
  }
  /** Render the UI onto the page. Idempotent. */
  mount() {
    if (this.host || this.options.mode === "off") return;
    this.host = a("div", { "data-tours-editor": "" }), this.host.style.setProperty("--e-top", `${this.topOffset}px`), this.root = this.host.attachShadow({ mode: "open" });
    const e = document.createElement("style");
    e.textContent = Be + pe, this.root.appendChild(e), this.highlight = a("div", { class: "highlight" }), this.root.append(this.highlight), document.body.appendChild(this.host), window.addEventListener("scroll", this.onViewportChange, !0), window.addEventListener("resize", this.onViewportChange, !0), this.log.log("mounted"), this.render(), this.hydrate();
  }
  /** Load stored drafts (localStorage by default) and show them. */
  async hydrate() {
    const e = await this.local.load();
    !e || e.length === 0 || (this.tours = e, this.openTourId = e[0].id, this.activeStepId = e[0].steps[0]?.id ?? null, this.log.log("hydrated", `${e.length} tour(s)`), this.render());
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
    this.stopPicking(), this.player?.stop(), this.player = null, this.saveTimer !== null && (clearTimeout(this.saveTimer), this.saveTimer = null, this.persist()), window.removeEventListener("scroll", this.onViewportChange, !0), window.removeEventListener("resize", this.onViewportChange, !0), this.host?.parentNode && this.host.parentNode.removeChild(this.host), this.host = null, this.root = null, this.highlight = null, this.cardPreview = null;
  }
  /** The current draft as a validated tour (or validation errors). */
  export() {
    return je(this.tour);
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
    this.openTourId = e, this.view = "edit", this.tab = "steps", this.activeStepId = this.tour.steps[0]?.id ?? null, this.render();
  }
  /** Create a fresh entity of the currently listed kind (tour or template). */
  createEntity() {
    const e = R(this.listFilter);
    this.tours.push(e), this.openTour(e.id);
  }
  deleteEntity(e) {
    const t = this.tours.findIndex((r) => r.id === e);
    t !== -1 && (this.tours.splice(t, 1), this.tours.some((r) => r.kind === "tour") || this.tours.push(R()), this.openTourId === e && (this.openTourId = this.tours[0].id), this.render());
  }
  /** Copy the open tour into a new template and jump to the Templates list. */
  saveAsTemplate() {
    const e = ae(this.tour, "template", `${this.tour.name} (template)`);
    this.tours.push(e), this.listFilter = "template", this.view = "list", this.menuOpen = !1, this.log.log("saved as template", e.id), this.render();
  }
  /** Create a new tour from a template and open it for editing. */
  createFromTemplate(e) {
    const t = this.tours.find((i) => i.id === e);
    if (!t) return;
    const r = ae(t, "tour", t.name.replace(/\s*\(template\)\s*$/, ""));
    this.tours.push(r), this.openTour(r.id);
  }
  setActive(e) {
    this.activeStepId !== e && (this.activeStepId = e, this.render());
  }
  addStepAfter(e, t = "step") {
    const r = W(t);
    r.page = this.currentPage(), this.tour.steps.splice(e + 1, 0, r), this.activeStepId = r.id, this.render();
  }
  /** A URL glob for the current page (matches its query/hash variations). */
  currentPage() {
    return `${window.location.origin}${window.location.pathname}*`;
  }
  removeStep(e) {
    const t = this.tour.steps.findIndex((r) => r.id === e);
    t !== -1 && (this.tour.steps.splice(t, 1), this.activeStepId === e && (this.activeStepId = this.tour.steps[Math.max(0, t - 1)]?.id ?? null), this.render());
  }
  // ---------- picker (selector search) ----------
  togglePicking() {
    if (this.picking) {
      this.stopPicking();
      return;
    }
    const e = this.activeStep;
    e && (this.picking = !0, this.picker = Le(
      (t) => {
        e.selectors = t, e.page || (e.page = this.currentPage()), this.picking = !1, this.picker = null, this.log.log("bound selector to step", e.id, t), this.render();
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
    const e = this.export();
    if (!e.ok) {
      this.log.warn("cannot preview — draft is invalid", e.errors), window.alert(`Add a selector and text to at least one step first:

${e.errors.join(`
`)}`);
      return;
    }
    this.mode = "preview", this.render(), this.player = De(e.tour), this.player.start();
  }
  // ---------- rendering ----------
  render() {
    this.root && (this.root.querySelectorAll(".panel, .nav").forEach((e) => e.remove()), this.mode === "build" && this.root.appendChild(this.renderPanel()), this.root.appendChild(this.renderNav()), this.focusStepId && (this.focusContent(this.focusStepId), this.focusStepId = null), this.updateOverlays(), this.markDirty());
  }
  /** Resolve a step's target on the page, trying each candidate selector. */
  resolveTarget(e) {
    return T(e.selectors);
  }
  /**
   * Draw the dashed outline around the active step's target, and (in the Card
   * sub-tab) a live tooltip-card preview beside it. Both use the same
   * tour-level values the player reads. Shown only in build mode when the
   * active step resolves; hidden while picking or in preview. No backdrop.
   */
  updateOverlays() {
    const e = this.highlight;
    if (!e) return;
    const t = () => {
      e.style.display = "none", this.removeCardPreview();
    };
    if (this.view !== "edit" || this.mode !== "build" || this.picking) return t();
    const r = this.activeStep, i = r && r.selectors.length > 0 ? this.resolveTarget(r) : null;
    if (!r || !i) return t();
    const o = i.getBoundingClientRect(), { padding: s, radius: l, cardRadius: p } = this.tour.display;
    e.className = `highlight ${this.tab === "display" ? "highlight--settings" : ""}`.trim(), e.style.display = "block", e.style.left = `${o.left - s}px`, e.style.top = `${o.top - s}px`, e.style.width = `${o.width + s * 2}px`, e.style.height = `${o.height + s * 2}px`, e.style.borderRadius = `${l}px`, this.drawStepCard(r, o, p);
  }
  removeCardPreview() {
    this.cardPreview && (this.cardPreview.remove(), this.cardPreview = null);
  }
  /**
   * Render the active step's card near its target via the shared renderCard —
   * the exact markup the player uses. Shown when the step has content; in the
   * Card sub-tab a muted placeholder shows so the radius stays visible first.
   */
  drawStepCard(e, t, r) {
    const i = e.content.trim(), o = this.tab === "display" && this.displaySub === "card";
    if (!i && !o) {
      this.removeCardPreview();
      return;
    }
    const s = this.tour.steps, l = s.indexOf(e), p = (x) => () => {
      const f = s[x];
      f && this.setActive(f.id);
    }, d = ce({
      ghost: !0,
      contentText: i || "Step tooltip preview",
      progress: `Step ${l + 1} of ${s.length}`,
      showClose: !0,
      onClose: () => {
        this.activeStepId = null, this.render();
      },
      radius: r,
      back: { label: e.backLabel, disabled: l <= 0, onClick: p(l - 1) },
      next: { label: e.nextLabel, primary: !0, disabled: l >= s.length - 1, onClick: p(l + 1) }
    });
    if (!i) {
      const x = d.querySelector(".tours-card__content");
      x && (x.style.opacity = "0.55");
    }
    this.removeCardPreview(), this.cardPreview = d, this.root?.appendChild(d);
    const u = this.tour.display.padding, h = {
      top: t.top - u,
      left: t.left - u,
      right: t.right + u,
      bottom: t.bottom + u,
      width: t.width + u * 2,
      height: t.height + u * 2
    }, { top: _, left: S } = le({
      target: h,
      card: { width: d.offsetWidth, height: d.offsetHeight },
      side: e.placement,
      align: e.align,
      offset: this.tour.display.offset,
      alignOffset: this.tour.display.alignOffset,
      viewport: { width: window.innerWidth, height: window.innerHeight }
    });
    d.style.left = `${S}px`, d.style.top = `${_}px`;
  }
  renderNav() {
    const e = a("div", { class: `nav nav--${this.navPosition}` }), t = y("build", "Build", this.mode === "build" ? "iconbtn--active" : "");
    t.addEventListener("click", () => {
      this.mode === "preview" && this.togglePreview();
    });
    const r = y("preview", "Preview", this.mode === "preview" ? "iconbtn--active" : "");
    r.addEventListener("click", () => this.togglePreview());
    const i = y("navFlip", "Move bar (top/bottom)");
    i.addEventListener("click", () => {
      this.navPosition = this.navPosition === "bottom" ? "top" : "bottom", this.render();
    });
    const o = y("close", "Close builder");
    return o.addEventListener("click", () => this.destroy()), e.append(t, r, a("div", { class: "nav__sep" }), i, o), e;
  }
  renderPanel() {
    const e = a("div", { class: `panel panel--${this.panelPosition}` });
    return this.view === "list" ? e.append(this.renderListHeader(), this.renderList()) : e.append(this.renderHeader(), this.renderToolbar(), this.renderTabs(), this.renderBody()), e;
  }
  renderListHeader() {
    const e = a("div", { class: "panel__header" }), t = a("div", { class: "listtabs" });
    for (const [i, o] of [["tour", "Tours"], ["template", "Templates"]]) {
      const s = a("button", {
        class: `listtab ${this.listFilter === i ? "listtab--active" : ""}`.trim(),
        type: "button"
      }, [o]);
      s.addEventListener("click", () => {
        this.listFilter = i, this.render();
      }), t.append(s);
    }
    const r = a("button", { class: "newtour", type: "button", title: "New" }, ["+ New"]);
    return r.addEventListener("click", () => this.createEntity()), e.append(t, r), e;
  }
  renderList() {
    const e = a("div", { class: "panel__body" }), t = a("div", { class: "tourlist" }), r = this.tours.filter((i) => i.kind === this.listFilter);
    return r.length === 0 ? (e.append(
      a("div", { class: "assets-empty" }, [
        this.listFilter === "template" ? "No templates yet." : "No tours yet."
      ])
    ), e) : (r.forEach((i) => {
      const o = a("div", { class: "tourrow" });
      o.addEventListener("click", () => this.openTour(i.id));
      const s = a("div", { class: "tourrow__main" });
      if (s.append(
        a("div", { class: "tourrow__name" }, [i.name]),
        a("div", { class: "tourrow__meta" }, [
          `${i.steps.length} step${i.steps.length === 1 ? "" : "s"}`
        ])
      ), o.append(s), i.kind === "template") {
        const p = a("button", { class: "tourrow__use", type: "button", title: "Create a tour from this template" }, ["Use"]);
        p.addEventListener("click", (d) => {
          d.stopPropagation(), this.createFromTemplate(i.id);
        }), o.append(p);
      } else
        o.append(a("span", { class: `status status--${i.status}` }, [i.status]));
      const l = y("trash", "Delete");
      l.addEventListener("click", (p) => {
        p.stopPropagation(), this.deleteEntity(i.id);
      }), o.append(l), t.append(o);
    }), e.append(t), e);
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
    const i = y("menu", "Menu", this.menuOpen ? "iconbtn--active" : "");
    return i.addEventListener("click", () => {
      this.menuOpen = !this.menuOpen, this.render();
    }), e.append(t, r, i), this.menuOpen && e.append(this.renderMenu()), e;
  }
  /** The ⋯ dropdown: save-as-template (tours only) and JSON export. */
  renderMenu() {
    const e = a("div", { class: "menu" }), t = (r, i) => {
      const o = a("button", { class: "menu__item", type: "button" }, [r]);
      return o.addEventListener("click", () => {
        this.menuOpen = !1, i();
      }), o;
    };
    return this.tour.kind === "tour" && e.append(t("Save as template", () => this.saveAsTemplate())), e.append(t("Export JSON", () => this.exportJson())), e;
  }
  exportJson() {
    const e = this.export();
    this.log.log("tour JSON", e), window.prompt("Tour JSON (copy):", e.ok ? JSON.stringify(e.tour) : e.errors.join("; ")), this.render();
  }
  renderToolbar() {
    const e = a("div", { class: "panel__toolbar" }), t = y("back", "Back to tours");
    t.addEventListener("click", () => {
      this.stopPicking(), this.view = "list", this.render();
    });
    const r = y("panelSide", "Move panel (left/right)");
    r.addEventListener("click", () => {
      this.panelPosition = this.panelPosition === "right" ? "left" : "right", this.render();
    });
    const i = y(
      "cursor",
      this.picking ? "Cancel picking" : "Pick element for active step",
      this.picking ? "iconbtn--active" : ""
    );
    return i.addEventListener("click", () => this.togglePicking()), e.append(t, a("div", { class: "spacer" }), r, i), e;
  }
  renderTabs() {
    const e = a("div", { class: "tabs" });
    for (const [t, r] of [
      ["steps", "Steps"],
      ["display", "Display"],
      ["assets", "Assets"]
    ]) {
      const i = a("button", { class: `tab ${this.tab === t ? "tab--active" : ""}`, type: "button" }, [r]);
      i.addEventListener("click", () => {
        this.tab = t, t === "display" && this.selectFirstResolvableStep(), this.render();
      }), e.append(i);
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
    for (const [i, o] of [["tour", "Tour"], ["card", "Card"]]) {
      const s = a("button", { class: `subtab ${this.displaySub === i ? "subtab--active" : ""}`, type: "button" }, [o]);
      s.addEventListener("click", () => {
        this.displaySub = i, this.render();
      }), t.append(s);
    }
    if (e.append(t), !this.activeStep || !this.resolveTarget(this.activeStep))
      return e.append(
        a("div", { class: "assets-empty" }, [
          "Give a step a selector first — then its target frames here so you can tune the look."
        ])
      ), e;
    const r = this.tour.display;
    return this.displaySub === "tour" ? e.append(
      this.slider("Outline spacing", r.padding, 0, 40, (i) => r.padding = i),
      this.slider("Outline corner radius", r.radius, 0, 40, (i) => r.radius = i),
      a("div", { class: "settings__hint" }, [
        "The outline framing the target — applied in the builder and in the live tour spotlight."
      ])
    ) : e.append(
      this.slider("Card corner radius", r.cardRadius, 0, 32, (i) => r.cardRadius = i),
      this.slider("Distance from target", r.offset, 0, 48, (i) => r.offset = i),
      this.slider("Alignment inset", r.alignOffset, 0, 48, (i) => r.alignOffset = i),
      a("div", { class: "settings__hint" }, [
        "Distance is the gap to the element; alignment inset nudges the card in from the aligned edge (start/end placements)."
      ])
    ), e;
  }
  /** A labelled range slider that writes through `set` and re-draws overlays live. */
  slider(e, t, r, i, o) {
    let s = t;
    const l = a("span", { class: "settings__value", title: "Click to type a value" }, [`${s}px`]), p = a("input", {
      class: "settings__slider",
      type: "range",
      min: String(r),
      max: String(i),
      step: "1"
    });
    p.value = String(s);
    const d = (_) => {
      s = Math.max(r, Math.min(i, Math.round(_))), p.value = String(s), l.textContent = `${s}px`, o(s), this.updateOverlays(), this.markDirty();
    };
    p.addEventListener("input", () => d(Number(p.value))), l.addEventListener("click", () => this.editNumber(l, s, d));
    const u = a("div", { class: "settings__row" });
    u.append(p, l);
    const h = a("div", { class: "settings__field" });
    return h.append(a("label", { class: "settings__label" }, [e]), u), h;
  }
  /** Swap a value label for a digits-only input; commit on blur/Enter. */
  editNumber(e, t, r) {
    const i = a("input", {
      class: "settings__num",
      type: "text",
      inputmode: "numeric"
    });
    i.value = String(t), e.replaceWith(i), i.focus(), i.select(), i.addEventListener("input", () => {
      i.value = i.value.replace(/[^0-9]/g, "");
    });
    const o = () => {
      const s = i.value === "" ? t : Number(i.value);
      i.replaceWith(e), r(s);
    };
    i.addEventListener("blur", o), i.addEventListener("keydown", (s) => {
      s.key === "Enter" && i.blur(), s.key === "Escape" && (i.value = String(t), i.blur());
    });
  }
  renderBody() {
    const e = a("div", { class: "panel__body" });
    if (this.tab === "assets")
      return e.append(a("div", { class: "assets-empty" }, ["Assets — coming soon"])), e;
    if (this.tab === "display")
      return e.append(this.renderDisplaySettings()), e;
    e.append(this.section("trigger", "Trigger & audience", () => this.renderTriggerBody()));
    const t = a("div", { class: "steps" });
    return t.append(this.renderConnector(-1)), this.tour.steps.forEach((r, i) => {
      t.append(this.renderCard(r, i)), t.append(this.renderConnector(i));
    }), e.append(t), e;
  }
  /** Tour-level start trigger and audience. */
  renderTriggerBody() {
    const e = a("div", { class: "settings" }), t = this.tour;
    return e.append(
      this.selectField(
        "Audience",
        t.audience,
        [
          ["all", "Everyone"],
          ["auth", "Logged-in users only"],
          ["guest", "Logged-out visitors only"]
        ],
        (r) => {
          t.audience = r, this.markDirty();
        }
      ),
      this.selectField(
        "Start trigger",
        t.trigger.type,
        [
          ["manual", "Manual (shortcode / attribute)"],
          ["load", "On page load"],
          ["selector", "When an element appears"],
          ["timer", "After a delay"]
        ],
        (r) => {
          t.trigger = He(r), this.markDirty(), this.render();
        }
      )
    ), t.trigger.type === "selector" ? e.append(
      this.textField("Element selector (CSS)", t.trigger.selector, "#start, .cta", (r) => {
        t.trigger.type === "selector" && (t.trigger.selector = r);
      })
    ) : t.trigger.type === "timer" && e.append(
      this.textField("Delay (ms)", String(t.trigger.delay), "3000", (r) => {
        t.trigger.type === "timer" && (t.trigger.delay = Math.max(0, Number(r.replace(/[^0-9]/g, "")) || 0));
      })
    ), e.append(
      a("div", { class: "settings__hint" }, [
        'Manual tours start from the [site_tour] shortcode or any element with a data-site-tour="<id>" attribute.'
      ])
    ), e;
  }
  /** A labelled <select>. */
  selectField(e, t, r, i) {
    const o = document.createElement("select");
    o.className = "tsel";
    for (const [l, p] of r) {
      const d = document.createElement("option");
      d.value = l, d.textContent = p, l === t && (d.selected = !0), o.append(d);
    }
    o.addEventListener("change", () => i(o.value));
    const s = a("div", { class: "settings__field" });
    return s.append(a("label", { class: "settings__label" }, [e]), o), s;
  }
  /** A labelled text input that writes through on change. */
  textField(e, t, r, i) {
    const o = a("input", { class: "pagecfg__input", placeholder: r });
    o.value = t, o.addEventListener("change", () => {
      i(o.value.trim()), this.markDirty();
    });
    const s = a("div", { class: "settings__field" });
    return s.append(a("label", { class: "settings__label" }, [e]), o), s;
  }
  renderConnector(e) {
    const t = a("div", { class: "connector" }), r = a("button", { class: "connector__add", title: "Add step", type: "button" }, ["+"]);
    return r.addEventListener("click", () => this.addStepAfter(e)), t.append(a("div", { class: "connector__line" }), r, a("div", { class: "connector__line" })), t;
  }
  renderCard(e, t) {
    const r = e.id === this.activeStepId, i = a("div", {
      class: `card ${r ? "card--active" : ""} ${e.included ? "" : "card--excluded"}`.trim()
    });
    return i.addEventListener("mousedown", () => this.setActive(e.id)), e.page && !M({ glob: e.page }, window.location.href) && i.classList.add("card--offpage"), i.append(this.renderCardControl(e, t), this.renderCardContent(e), this.renderCardFooter(e)), r && (i.append(this.section("placement", "Card position", () => this.renderPlacementBody(e))), i.append(this.section("page", "Page", () => this.renderPageBody(e)))), i;
  }
  /** Page sub-panel: which pages this step shows on (multi-page tours). */
  renderPageBody(e) {
    const t = a("div", { class: "settings" }), r = a("input", { class: "pagecfg__input", placeholder: "Any page" });
    r.value = e.page, r.addEventListener("change", () => {
      e.page = r.value.trim(), this.markDirty(), this.render();
    });
    const i = a("button", { class: "pagecfg__use", type: "button" }, ["Use current page"]);
    return i.addEventListener("click", () => {
      e.page = this.currentPage(), this.render();
    }), t.append(
      a("label", { class: "settings__label" }, ["Show on pages matching (URL glob)"]),
      r,
      i,
      a("div", { class: "settings__hint" }, [
        "Empty = any page. New steps get the current page automatically; navigate your site (with the builder on) to add steps on other pages."
      ])
    ), t;
  }
  /**
   * A collapsible card-settings section: a header with a left caret + title;
   * clicking toggles it. Collapsed by default; open state persists across
   * renders (keyed) so switching steps keeps the same sections expanded.
   */
  section(e, t, r) {
    const i = this.openSections.has(e), o = a("div", { class: `acc ${i ? "acc--open" : ""}`.trim() }), s = a("button", { class: "acc__head", type: "button" }), l = a("span", { class: "acc__caret" });
    return l.innerHTML = B.chevron, s.append(l, a("span", { class: "acc__title" }, [t])), s.addEventListener("click", () => {
      i ? this.openSections.delete(e) : this.openSections.add(e), this.render();
    }), o.append(s), i && o.append(r()), o;
  }
  /**
   * Placement picker body: an Auto toggle plus a 12-anchor grid (each side ×
   * start/center/end) around a mock target. Editing re-renders so the on-page
   * card and the active anchor update together.
   */
  renderPlacementBody(e) {
    const t = a("div", { class: "place" }), r = a("div", { class: "place__grid" });
    r.append(a("div", { class: "place__el" })), r.append(a("div", { class: "place__el" }));
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
      const l = e.placement === s.side && e.align === s.align, p = a("button", {
        class: `place__dot ${l ? "place__dot--active" : ""}`.trim(),
        type: "button",
        title: `${s.side} · ${s.align}`
      });
      p.style.left = `${s.x - 6}px`, p.style.top = `${s.y - 6}px`, p.addEventListener("click", () => {
        e.placement = s.side, e.align = s.align, this.render();
      }), r.append(p);
    }
    t.append(r);
    const o = a("button", {
      class: `place__auto ${e.placement === "auto" ? "place__auto--active" : ""}`.trim(),
      type: "button",
      title: "Pick the side with the most room automatically"
    }, ["Auto"]);
    return o.addEventListener("click", () => {
      e.placement = "auto", this.render();
    }), t.append(o), t;
  }
  renderCardControl(e, t) {
    const r = a("div", { class: "card__control" }), i = a("input", { class: "card__check", type: "checkbox", title: "Include in tour" });
    i.checked = e.included, i.addEventListener("change", () => {
      e.included = i.checked, this.render();
    });
    const o = a("span", { class: "card__index" }, [String(t + 1)]), s = a("span", { class: "card__type" });
    s.innerHTML = B[e.type === "action" ? "bolt" : "step"], s.append(document.createTextNode(e.type === "action" ? "Action" : "Step"));
    const l = e.selectors[0], p = a("span", { class: `card__sel ${l ? "" : "card__sel--empty"}`.trim(), title: l ?? "" }, [
      l ?? "no selector"
    ]), d = y("trash", "Delete step");
    if (d.addEventListener("click", () => this.removeStep(e.id)), r.append(i, o, s, a("div", { class: "spacer" })), e.page && !M({ glob: e.page }, window.location.href)) {
      const u = e.page.replace(/^https?:\/\/[^/]+/, "").replace(/\*$/, "") || "/";
      r.append(a("span", { class: "card__page", title: e.page }, [`⧉ ${u}`]));
    }
    return r.append(p, d), r;
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
    return r.addEventListener("click", (i) => {
      i.stopPropagation();
      const o = a("input", { class: "cardbtn cardbtn--edit", value: e[t] });
      o.value = e[t], r.replaceWith(o), o.focus(), o.select();
      const s = () => {
        e[t] = o.value.trim() || (t === "backLabel" ? "Back" : "Next"), o.replaceWith(this.renderEditableButton(e, t)), this.markDirty();
      };
      o.addEventListener("blur", s), o.addEventListener("keydown", (l) => {
        l.key === "Enter" && o.blur(), l.key === "Escape" && (o.value = e[t], o.blur());
      });
    }), r;
  }
  // ---------- misc ----------
  /** Focus a card's content area and place the caret at the end. */
  focusContent(e) {
    const t = this.root?.querySelector(`.card__content[data-step="${e}"]`);
    if (!t) return;
    t.focus();
    const r = document.createRange();
    r.selectNodeContents(t), r.collapse(!1);
    const i = window.getSelection();
    i?.removeAllRanges(), i?.addRange(r);
  }
}
export {
  fe as TourBuilder,
  ae as cloneDraft,
  W as createDraftStep,
  R as createDraftTour,
  Ve as createLocalStore,
  We as createWordPressStore,
  he as normalizeTours,
  je as toTour
};
