const Ot = `
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
`, Rt = `
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
function q(r) {
  return JSON.stringify(r);
}
function It(r) {
  return /^[a-zA-Z][\w-]*$/.test(r) && r.length <= 30 && !/\d{2,}/.test(r) && !/^(css-|sc-|jsx-|emotion-|_|is-|has-)/.test(r);
}
function st(r) {
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
function Mt(r) {
  let t = r.parentElement;
  for (; t && t !== document.body && !t.id; )
    t = t.parentElement;
  if (!t || !t.id) return null;
  const e = [];
  let n = r;
  for (; n && n !== t; ) {
    const i = n.tagName.toLowerCase(), o = n.parentElement;
    if (!o) return null;
    const s = Array.from(o.children).filter((l) => l.tagName === n.tagName);
    e.unshift(s.length > 1 ? `${i}:nth-of-type(${s.indexOf(n) + 1})` : i), n = o;
  }
  return `#${CSS.escape(t.id)} > ${e.join(" > ")}`;
}
const zt = ["data-testid", "data-test", "data-test-id", "data-cy", "data-qa", "data-id", "data-name"];
function Dt(r) {
  const t = [], e = /* @__PURE__ */ new Set(), n = r.tagName.toLowerCase(), i = (c) => {
    if (!(!c || e.has(c)))
      try {
        document.querySelector(c) === r && (e.add(c), t.push(c));
      } catch {
      }
  };
  r.id && i(`#${CSS.escape(r.id)}`);
  for (const c of zt) {
    const h = r.getAttribute(c);
    h && i(`${n}[${c}=${q(h)}]`);
  }
  const o = r.getAttribute("name");
  o && i(`${n}[name=${q(o)}]`);
  const s = r.getAttribute("aria-label");
  s && i(`[aria-label=${q(s)}]`);
  const l = Array.from(r.classList).filter(It);
  l.length && i(`${n}.${l.map((c) => CSS.escape(c)).join(".")}`);
  for (const c of l) i(`${n}.${CSS.escape(c)}`);
  i(Mt(r)), i(st(r));
  const p = (r.textContent ?? "").replace(/\s+/g, " ").trim();
  if (p && p.length <= 50 && /^(a|button|summary|label|h[1-6])$/.test(n)) {
    const c = `text=${p}`;
    e.has(c) || (e.add(c), t.push(c));
  }
  return t.length === 0 && t.push(st(r)), t;
}
const Bt = "a, button, summary, label, h1, h2, h3, h4, h5, h6";
function at(r, t) {
  return !(r instanceof Element) || !r.isConnected || t !== document && t instanceof Node && !t.contains(r) ? null : r;
}
function Ft(r, t) {
  if (typeof r == "function") {
    let e;
    try {
      e = r();
    } catch {
      return null;
    }
    return at(e, t);
  }
  if (typeof r != "string") return at(r, t);
  if (r.startsWith("text=")) {
    const e = r.slice(5).trim();
    for (const n of Array.from(t.querySelectorAll(Bt)))
      if ((n.textContent ?? "").replace(/\s+/g, " ").trim() === e) return n;
    return null;
  }
  try {
    return t.querySelector(r);
  } catch {
    return null;
  }
}
function z(r, t = document) {
  for (const e of r) {
    const n = Ft(e, t);
    if (n) return n;
  }
  return null;
}
function Ut(r, t = {}) {
  const e = t.root ?? document, n = z(r, e);
  return n ? Promise.resolve(n) : new Promise((i) => {
    let o = !1, s;
    const l = (h) => {
      o || (o = !0, p.disconnect(), s && clearTimeout(s), i(h));
    }, p = new MutationObserver(() => {
      const h = z(r, e);
      h && l(h);
    });
    p.observe(document.documentElement, {
      childList: !0,
      subtree: !0,
      attributes: !0
    });
    const c = t.timeout ?? 4e3;
    c > 0 && Number.isFinite(c) && (s = setTimeout(() => l(null), c));
  });
}
let O = null;
function Y() {
  if (O !== null) return O;
  try {
    O = new URLSearchParams(window.location.search).has("use_logs");
  } catch {
    O = !1;
  }
  return O;
}
function Q(r) {
  const t = `[tours:${r}]`;
  return {
    log: (...e) => {
      Y() && console.log(t, ...e);
    },
    warn: (...e) => {
      Y() && console.warn(t, ...e);
    },
    error: (...e) => {
      Y() && console.error(t, ...e);
    }
  };
}
function jt(r, t = {}) {
  const e = Q("picker");
  let n = null, i = null, o = null, s = !1;
  function l(b) {
    if (b === n) return !0;
    for (const v of t.ignore ?? [])
      if (v && v.contains(b)) return !0;
    return !1;
  }
  function p() {
    if (n) return;
    n = document.createElement("div"), n.setAttribute("data-tours-picker", ""), i = n.attachShadow({ mode: "open" });
    const b = document.createElement("style");
    b.textContent = Ot, i.appendChild(b), o = document.createElement("div"), o.className = "tours-picker-overlay", o.style.display = "none", i.appendChild(o);
    const v = document.createElement("div");
    v.className = "tours-picker-hint", v.textContent = "Hover and click an element • Esc to cancel", i.appendChild(v), document.body.appendChild(n);
  }
  function c(b, v) {
    const k = document.elementFromPoint(b, v);
    return !k || l(k) ? null : k;
  }
  function h(b) {
    if (!s || !o) return;
    const v = c(b.clientX, b.clientY);
    if (!v) {
      o.style.display = "none";
      return;
    }
    const k = v.getBoundingClientRect();
    o.style.display = "block", o.style.left = `${k.left}px`, o.style.top = `${k.top}px`, o.style.width = `${k.width}px`, o.style.height = `${k.height}px`;
  }
  function u(b) {
    if (!s) return;
    const v = c(b.clientX, b.clientY);
    if (b.preventDefault(), b.stopPropagation(), !v) return;
    const k = Dt(v);
    e.log("picked", k), g(), r(k);
  }
  function E(b) {
    b.key === "Escape" && (b.preventDefault(), g());
  }
  function w() {
    s || (s = !0, e.log("start"), p(), document.addEventListener("mousemove", h, !0), document.addEventListener("click", u, !0), document.addEventListener("keydown", E, !0));
  }
  function g() {
    s && (s = !1, document.removeEventListener("mousemove", h, !0), document.removeEventListener("click", u, !0), document.removeEventListener("keydown", E, !0), n && n.parentNode && n.parentNode.removeChild(n), n = null, i = null, o = null);
  }
  return { start: w, stop: g };
}
const D = 6, B = 6, F = 10, U = 12, Vt = 1;
function $(r) {
  return typeof r == "object" && r !== null && !Array.isArray(r);
}
function lt(r) {
  return $(r) && typeof r.default == "string";
}
const dt = ["top", "bottom", "left", "right", "auto"], ct = ["start", "center", "end"], pt = ["mobile", "tablet", "desktop"], ut = ["click", "input", "navigate", "none"];
function vt(r, t, e) {
  if (!$(r)) {
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
function ht(r, t, e) {
  if (!$(r)) {
    e.push(`${t} must be an object`);
    return;
  }
  r.url !== void 0 && vt(r.url, `${t}.url`, e), r.role !== void 0 && typeof r.role != "string" && e.push(`${t}.role must be a string`), r.firstVisitOnly !== void 0 && typeof r.firstVisitOnly != "boolean" && e.push(`${t}.firstVisitOnly must be a boolean`), r.device !== void 0 && !pt.includes(r.device) && e.push(`${t}.device must be one of ${pt.join("|")}`), r.unlessSeen !== void 0 && typeof r.unlessSeen != "boolean" && e.push(`${t}.unlessSeen must be a boolean`), r.maxShows !== void 0 && (typeof r.maxShows != "number" || r.maxShows < 0) && e.push(`${t}.maxShows must be a non-negative number`);
}
function Ht(r, t, e) {
  if (!$(r)) {
    e.push(`${t} must be an object`);
    return;
  }
  ut.includes(r.type) || e.push(`${t}.type must be one of ${ut.join("|")}`), r.url !== void 0 && typeof r.url != "string" && e.push(`${t}.url must be a string`), r.value !== void 0 && typeof r.value != "string" && e.push(`${t}.value must be a string`);
}
function Wt(r) {
  const t = [];
  if (!$(r))
    return { ok: !1, errors: ["tour must be an object"] };
  if ((typeof r.id != "string" || r.id.length === 0) && t.push("tour.id must be a non-empty string"), typeof r.schemaVersion != "number" && t.push("tour.schemaVersion must be a number"), lt(r.title) || t.push('tour.title must be a localized text with a string "default"'), Array.isArray(r.steps) ? r.steps.length === 0 ? t.push("tour.steps must contain at least one step") : r.steps.forEach((e, n) => {
    if (!$(e)) {
      t.push(`steps[${n}] must be an object`);
      return;
    }
    (typeof e.id != "string" || e.id.length === 0) && t.push(`steps[${n}].id must be a non-empty string`), (!Array.isArray(e.selectors) || e.selectors.length === 0 || !e.selectors.every((i) => typeof i == "string" && i.length > 0)) && t.push(`steps[${n}].selectors must be a non-empty array of non-empty strings`), lt(e.content) || t.push(`steps[${n}].content must be a localized text with a string "default"`), e.placement !== void 0 && !dt.includes(e.placement) && t.push(`steps[${n}].placement must be one of ${dt.join("|")}`), e.align !== void 0 && !ct.includes(e.align) && t.push(`steps[${n}].align must be one of ${ct.join("|")}`), e.backLabel !== void 0 && typeof e.backLabel != "string" && t.push(`steps[${n}].backLabel must be a string`), e.nextLabel !== void 0 && typeof e.nextLabel != "string" && t.push(`steps[${n}].nextLabel must be a string`), e.pageUrl !== void 0 && vt(e.pageUrl, `steps[${n}].pageUrl`, t), e.condition !== void 0 && ht(e.condition, `steps[${n}].condition`, t), e.action !== void 0 && Ht(e.action, `steps[${n}].action`, t);
  }) : t.push("tour.steps must be an array"), r.trigger !== void 0) {
    const e = r.trigger, n = ["manual", "load", "selector", "timer", "cta"], i = ["bottom-right", "bottom-left", "top-right", "top-left"];
    !$(e) || typeof e.type != "string" || !n.includes(e.type) ? t.push(`tour.trigger.type must be one of ${n.join("|")}`) : e.type === "selector" && (typeof e.selector != "string" || e.selector.length === 0) ? t.push("tour.trigger.selector must be a non-empty string") : e.type === "timer" && (typeof e.delay != "number" || e.delay < 0) ? t.push("tour.trigger.delay must be a non-negative number") : e.type === "cta" && (typeof e.text != "string" && t.push("tour.trigger.text must be a string"), typeof e.button != "string" && t.push("tour.trigger.button must be a string"), i.includes(e.corner) || t.push(`tour.trigger.corner must be one of ${i.join("|")}`), e.offset !== void 0 && (typeof e.offset != "number" || e.offset < 0) && t.push("tour.trigger.offset must be a non-negative number"));
  }
  if (r.audience !== void 0 && !["all", "auth", "guest"].includes(r.audience) && t.push("tour.audience must be one of all|auth|guest"), r.display !== void 0)
    if (!$(r.display))
      t.push("tour.display must be an object");
    else
      for (const e of ["padding", "radius", "cardRadius", "offset", "alignOffset"]) {
        const n = r.display[e];
        n !== void 0 && (typeof n != "number" || n < 0) && t.push(`tour.display.${e} must be a non-negative number`);
      }
  return r.rules !== void 0 && (Array.isArray(r.rules) ? r.rules.forEach((e, n) => {
    if (!$(e)) {
      t.push(`rules[${n}] must be an object`);
      return;
    }
    e.tourId !== void 0 && typeof e.tourId != "string" && t.push(`rules[${n}].tourId must be a string`), e.when === void 0 ? t.push(`rules[${n}].when is required`) : ht(e.when, `rules[${n}].when`, t);
  }) : t.push("tour.rules must be an array")), t.length > 0 ? { ok: !1, errors: t } : { ok: !0, tour: r };
}
function Jt(r, t, e) {
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
  }, o = ["bottom", "top", "right", "left"], s = o.find((l) => n[l] >= i[l] + 8);
  return s || o.reduce((l, p) => n[p] > n[l] ? p : l, o[0]);
}
function xt(r) {
  const { target: t, card: e, offset: n, viewport: i } = r, o = r.side === "auto", s = o ? Jt(t, e, i) : r.side, l = o ? "center" : r.align, p = r.alignOffset ?? 0, c = l === "start" ? p : l === "end" ? -p : 0;
  let h = 0, u = 0;
  return s === "top" || s === "bottom" ? (h = s === "top" ? t.top - e.height - n : t.bottom + n, u = l === "start" ? t.left : l === "end" ? t.right - e.width : t.left + t.width / 2 - e.width / 2, u += c) : (u = s === "left" ? t.left - e.width - n : t.right + n, h = l === "start" ? t.top : l === "end" ? t.bottom - e.height : t.top + t.height / 2 - e.height / 2, h += c), u = Math.max(8, Math.min(u, i.width - e.width - 8)), h = Math.max(8, Math.min(h, i.height - e.height - 8)), { top: h, left: u };
}
function ft(r) {
  const t = document.createElement("button");
  return t.type = "button", t.className = `tours-card__btn${r.primary ? " tours-card__btn--primary" : ""}${r.disabled ? " tours-card__btn--disabled" : ""}`, t.textContent = r.label, !r.disabled && r.onClick && t.addEventListener("click", r.onClick), t;
}
function yt(r) {
  const t = document.createElement("div");
  if (t.className = `tours-card${r.ghost ? " tours-card--ghost" : ""}`, r.radius != null && (t.style.borderRadius = `${r.radius}px`), r.showClose) {
    const n = document.createElement("button");
    n.className = "tours-card__close", n.type = "button", n.textContent = "×", n.setAttribute("aria-label", "Close"), r.onClose && n.addEventListener("click", r.onClose), t.appendChild(n);
  }
  const e = document.createElement("div");
  if (e.className = "tours-card__content", r.contentHtml != null ? e.innerHTML = r.contentHtml : e.textContent = r.contentText ?? "", t.appendChild(e), r.back || r.next || r.progress) {
    const n = document.createElement("div");
    if (n.className = "tours-card__footer", r.back && n.appendChild(ft(r.back)), r.progress) {
      const i = document.createElement("span");
      i.className = "tours-card__progress", i.textContent = r.progress, n.appendChild(i);
    }
    r.next && n.appendChild(ft(r.next)), t.appendChild(n);
  }
  return t;
}
const wt = `
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
function qt(r) {
  const t = r.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*\*/g, "\0").replace(/\*/g, "[^/]*").replace(/ /g, ".*").replace(/\?/g, ".");
  return new RegExp(`^${t}$`);
}
function R(r, t) {
  if (!r) return !0;
  if (r.regex)
    try {
      return new RegExp(r.regex).test(t);
    } catch {
      return !1;
    }
  if (r.glob)
    try {
      return qt(r.glob).test(t);
    } catch {
      return !1;
    }
  return !0;
}
function kt(r) {
  if (!r || !r.glob) return null;
  const t = r.glob.replace(/\*+/g, "");
  return /^https?:\/\//i.test(t) || t.startsWith("#") || t.startsWith("/") ? t : null;
}
const K = "tours:locationchange";
let gt = !1;
function Yt() {
  if (!gt) {
    gt = !0;
    for (const r of ["pushState", "replaceState"]) {
      const t = history[r];
      history[r] = function(...n) {
        const i = t.apply(this, n);
        return window.dispatchEvent(new Event(K)), i;
      };
    }
  }
}
function bt(r) {
  return Yt(), window.addEventListener("popstate", r), window.addEventListener("hashchange", r), window.addEventListener(K, r), () => {
    window.removeEventListener("popstate", r), window.removeEventListener("hashchange", r), window.removeEventListener(K, r);
  };
}
const _t = "tours:progress";
function Xt(r, t) {
  r.set(_t, JSON.stringify(t));
}
function Gt(r) {
  r.remove(_t);
}
const Kt = "[data-tours-editor]";
function Zt() {
  return typeof document < "u" && document.querySelector(Kt) !== null;
}
function Qt(r, t = {}) {
  const e = Q("player"), n = t.state;
  let i = null, o = null, s = null, l = null, p = null, c = null, h = !1, u = 0, E = 0, w = null;
  const g = r.display?.padding ?? D, b = r.display?.radius ?? B, v = r.display?.cardRadius ?? F, k = r.display?.offset ?? U;
  function V(d) {
    return z(d.selectors);
  }
  function H(d) {
    return d.action?.type === "click";
  }
  function A(d) {
    return R(d.pageUrl, window.location.href);
  }
  function T() {
    n && Xt(n, { tourId: r.id, index: u });
  }
  function et() {
    if (i) return;
    i = document.createElement("div"), i.setAttribute("data-tours-player", ""), o = i.attachShadow({ mode: "open" });
    const d = document.createElement("style");
    d.textContent = Rt + wt, o.appendChild(d), p = document.createElement("div"), p.className = "tours-backdrop", p.addEventListener("click", (f) => {
      const m = r.steps[u], x = m ? V(m) : null;
      if (x) {
        const y = x.getBoundingClientRect();
        if (f.clientX >= y.left - g && f.clientX <= y.right + g && f.clientY >= y.top - g && f.clientY <= y.bottom + g) return;
      }
      L();
    }), o.appendChild(p), s = document.createElement("div"), s.className = "tours-spotlight", s.style.borderRadius = `${b}px`, o.appendChild(s), document.body.appendChild(i);
  }
  function Ct(d) {
    if (!p) return;
    if (!d) {
      p.style.clipPath = "";
      return;
    }
    const f = d.left - g, m = d.top - g, x = d.right + g, y = d.bottom + g;
    p.style.clipPath = `polygon(0 0, 0 100%, ${f}px 100%, ${f}px ${m}px, ${x}px ${m}px, ${x}px ${y}px, ${f}px ${y}px, ${f}px 100%, 100% 100%, 100% 0)`;
  }
  function nt(d, f = !1) {
    s && (s.style.transitionDuration = f ? "0ms" : "", s.style.display = "block", s.style.left = `${d.left - g}px`, s.style.top = `${d.top - g}px`, s.style.width = `${d.width + g * 2}px`, s.style.height = `${d.height + g * 2}px`);
  }
  function rt(d, f) {
    if (!l) return;
    const m = {
      top: d.top - g,
      left: d.left - g,
      right: d.right + g,
      bottom: d.bottom + g,
      width: d.width + g * 2,
      height: d.height + g * 2
    }, { top: x, left: y } = xt({
      target: m,
      card: { width: l.offsetWidth, height: l.offsetHeight },
      side: f.placement ?? "bottom",
      align: f.align ?? "center",
      offset: k,
      alignOffset: r.display?.alignOffset ?? 0,
      viewport: { width: window.innerWidth, height: window.innerHeight }
    });
    l.style.left = `${y}px`, l.style.top = `${x}px`;
  }
  function Lt(d) {
    const f = Math.max(1, r.steps.length - E), m = Math.max(1, Math.min(u + 1 - E, f));
    l && l.remove();
    const x = u === r.steps.length - 1, y = r.steps[u - 1], N = !!y && A(y), Nt = !H(d) || x;
    l = yt({
      contentText: d.content.default,
      progress: `Step ${m} of ${f}`,
      showClose: !0,
      onClose: L,
      radius: v,
      back: N ? { label: d.backLabel ?? "Back", onClick: J } : void 0,
      next: Nt ? {
        label: d.nextLabel ?? (x ? "Done" : "Next"),
        primary: !0,
        onClick: W
      } : void 0
    }), o?.appendChild(l);
  }
  function C() {
    if (!h) return;
    const d = r.steps[u];
    if (!d) {
      L();
      return;
    }
    e.log("render step", u, d.id);
    const f = V(d);
    if (!f) {
      e.log(`step "${d.id}" target not found yet — waiting`, d.selectors), Ut(d.selectors, { timeout: 4e3 }).then((x) => {
        !h || r.steps[u] !== d || (x ? C() : (e.warn(`step "${d.id}" skipped: no element for selectors`, d.selectors), E += 1, u < r.steps.length - 1 ? (u += 1, C()) : L()));
      });
      return;
    }
    et(), f.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" }), Lt(d);
    const m = f.getBoundingClientRect();
    nt(m), rt(m, d), Ct(H(d) ? m : null), Tt(d);
  }
  function Tt(d) {
    if (c?.(), c = null, !H(d)) return;
    const f = u + 1, m = r.steps[f];
    !m || A(m) || (c = bt(() => {
      !h || r.steps[u] !== d || R(m.pageUrl, window.location.href) && (c?.(), c = null, e.log("visitor navigated → advancing to", m.id), u = f, T(), C());
    }));
  }
  function it(d) {
    h && (d.key === "Escape" ? (d.preventDefault(), L()) : d.key === "ArrowRight" ? W() : d.key === "ArrowLeft" && J());
  }
  function I() {
    if (!h) return;
    const d = r.steps[u];
    if (!d) return;
    const f = V(d);
    if (!f) return;
    const m = f.getBoundingClientRect();
    nt(m, !0), rt(m, d);
  }
  function Pt(d = 0) {
    if (!h && r.steps.length !== 0) {
      if (!t.allowWhileEditing && Zt()) {
        e.log(`start suppressed for "${r.id}" — the builder is mounted`);
        return;
      }
      h = !0, u = Math.max(0, Math.min(d, r.steps.length - 1)), E = 0, e.log("start", r.id, `at ${u}/${r.steps.length}`), et(), window.addEventListener("keydown", it, !0), window.addEventListener("resize", I, !0), window.addEventListener("scroll", I, !0), T(), C();
    }
  }
  function At() {
    s && (s.style.display = "none"), l && (l.remove(), l = null);
  }
  function M() {
    At(), !w && (w = bt(() => {
      if (!h) {
        w?.(), w = null;
        return;
      }
      const d = r.steps[u];
      d && A(d) && (w?.(), w = null, C());
    }));
  }
  function ot() {
    w && (w(), w = null), c && (c(), c = null), h && (h = !1, window.removeEventListener("keydown", it, !0), window.removeEventListener("resize", I, !0), window.removeEventListener("scroll", I, !0), i && i.parentNode && i.parentNode.removeChild(i), i = null, o = null, s = null, l = null, p = null);
  }
  function L() {
    e.log("stop"), ot(), n && Gt(n);
  }
  function W() {
    if (!h) return;
    const d = u + 1, f = r.steps[d];
    if (!f) {
      L();
      return;
    }
    if (A(f)) {
      u = d, T(), C();
      return;
    }
    u = d, T();
    const m = (N) => {
      ot(), t.onNavigate ? t.onNavigate(N, f.id) : window.location.assign(N);
    }, x = r.steps[u - 1]?.action;
    if (x && x.type === "navigate" && x.url) {
      x.url.startsWith("#") ? (e.log("page transition (hash navigate) → resume at", u), M(), window.location.hash = x.url) : (e.log("page transition (navigate) → resume at", u), m(x.url));
      return;
    }
    const y = kt(f.pageUrl);
    if (y) {
      y.startsWith("#") ? (e.log("page transition (derived hash) → resume at", u), M(), window.location.hash = y) : (e.log("page transition (derived navigate) → resume at", u, y), m(y));
      return;
    }
    e.log("page transition (wait) → resume at", u), M();
  }
  function J() {
    if (!h) return;
    const d = r.steps[u - 1];
    if (d) {
      if (A(d)) {
        u -= 1, T(), C();
        return;
      }
      u -= 1, T(), e.log("page transition back → resume at", u), M(), window.history.back();
    }
  }
  return { start: Pt, stop: L, next: W, prev: J, isActive: () => h };
}
const te = `
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
.acc__body { padding: 4px 14px 14px; }

/* ---------- Per-step placement picker ---------- */
.place {
  padding: 0;
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

/* ---------- Settings blocks (Styles / Rules / Page) ---------- */
.settings { padding: 0; }
.settings__divider { height: 1px; background: var(--e-border); margin: 14px 0; }
.settings__checkrow {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--e-fg);
  margin-bottom: 12px;
  cursor: pointer;
}
.settings__check { width: 16px; height: 16px; accent-color: var(--e-accent); cursor: pointer; }
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
`, Z = {
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
  step: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 2"/></svg>',
  download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/></svg>',
  upload: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M17 8l-5-5-5 5"/><path d="M12 3v12"/></svg>'
};
let ee = 0;
function P(r) {
  const t = typeof crypto < "u" && "randomUUID" in crypto ? crypto.randomUUID() : `${ee++}`;
  return `${r}-${t}`;
}
function j(r = "step") {
  return {
    id: P("step"),
    type: r,
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
function X(r = "tour") {
  return {
    id: P(r),
    kind: r,
    name: r === "template" ? "Untitled template" : "Untitled tour",
    status: "draft",
    trigger: { type: "manual" },
    audience: "all",
    conditions: { firstVisitOnly: !0, maxShows: 0, device: "any" },
    steps: [j()],
    display: {
      padding: D,
      radius: B,
      cardRadius: F,
      offset: U,
      alignOffset: 0
    }
  };
}
function mt(r, t, e) {
  return {
    id: P(t),
    kind: t,
    name: e ?? r.name,
    status: "draft",
    trigger: { ...r.trigger },
    audience: r.audience,
    conditions: { ...r.conditions },
    steps: r.steps.map((n) => ({ ...n, id: P("step"), selectors: [...n.selectors] })),
    display: { ...r.display }
  };
}
function St(r) {
  if (r && typeof r == "object") {
    const t = r;
    if (t.type === "load") return { type: "load" };
    if (t.type === "selector" && typeof t.selector == "string") return { type: "selector", selector: t.selector };
    if (t.type === "timer" && typeof t.delay == "number") return { type: "timer", delay: t.delay };
    if (t.type === "cta" && typeof t.text == "string" && typeof t.button == "string") {
      const e = ["bottom-right", "bottom-left", "top-right", "top-left"];
      return {
        type: "cta",
        text: t.text,
        button: t.button,
        corner: e.includes(t.corner) ? t.corner : "bottom-right",
        offset: typeof t.offset == "number" ? t.offset : void 0
      };
    }
  }
  return { type: "manual" };
}
function tt(r) {
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
      trigger: St(n.trigger),
      audience: n.audience === "auth" || n.audience === "guest" ? n.audience : "all",
      conditions: {
        firstVisitOnly: (n.conditions?.firstVisitOnly ?? !0) === !0,
        maxShows: S(n.conditions?.maxShows, 0),
        device: ["mobile", "tablet", "desktop"].includes(n.conditions?.device) ? n.conditions.device : "any"
      },
      display: {
        padding: S(n.display?.padding, D),
        radius: S(n.display?.radius, B),
        cardRadius: S(n.display?.cardRadius, F),
        offset: S(n.display?.offset, U),
        alignOffset: S(n.display?.alignOffset, 0)
      },
      steps: n.steps.filter((i) => !!i && typeof i == "object").map((i) => ({
        ...j(i.type === "action" ? "action" : "step"),
        ...i
      }))
    });
  }
  return t;
}
function S(r, t) {
  return typeof r == "number" && r >= 0 ? r : t;
}
function Et(r) {
  const t = r.steps.filter((i) => i.included && i.selectors.length > 0).map((i) => ({
    id: i.id,
    selectors: i.selectors,
    content: { default: i.content },
    placement: i.placement,
    align: i.align,
    backLabel: i.backLabel,
    nextLabel: i.nextLabel,
    ...i.page ? { pageUrl: { glob: i.page } } : {},
    ...i.action ? { action: i.action } : {}
  })), e = {};
  r.conditions.firstVisitOnly && (e.firstVisitOnly = !0), r.conditions.maxShows > 0 && (e.maxShows = r.conditions.maxShows), r.conditions.device !== "any" && (e.device = r.conditions.device);
  const n = Object.keys(e).length > 0 ? [{ when: e }] : void 0;
  return {
    id: r.id,
    schemaVersion: Vt,
    title: { default: r.name },
    steps: t,
    trigger: r.trigger,
    audience: r.audience,
    ...n ? { rules: n } : {},
    display: {
      padding: r.display.padding,
      radius: r.display.radius,
      cardRadius: r.display.cardRadius,
      offset: r.display.offset,
      alignOffset: r.display.alignOffset
    }
  };
}
function ne(r) {
  return Wt(Et(r));
}
function re(r) {
  if (!r || typeof r != "object") return !1;
  const t = r;
  return "schemaVersion" in t || typeof t.title == "object" && t.title !== null;
}
function ie(r) {
  const t = r.rules && r.rules[0]?.when || {}, e = t.device;
  return {
    id: typeof r.id == "string" && r.id ? r.id : P("tour"),
    kind: "tour",
    name: r.title?.default ?? "Imported tour",
    status: "draft",
    trigger: St(r.trigger),
    audience: r.audience === "auth" || r.audience === "guest" ? r.audience : "all",
    conditions: {
      firstVisitOnly: t.firstVisitOnly === !0,
      maxShows: S(t.maxShows, 0),
      device: e === "mobile" || e === "tablet" || e === "desktop" ? e : "any"
    },
    display: {
      padding: S(r.display?.padding, D),
      radius: S(r.display?.radius, B),
      cardRadius: S(r.display?.cardRadius, F),
      offset: S(r.display?.offset, U),
      alignOffset: S(r.display?.alignOffset, 0)
    },
    steps: (Array.isArray(r.steps) ? r.steps : []).map((n) => ({
      ...j("step"),
      id: typeof n.id == "string" && n.id ? n.id : P("step"),
      selectors: Array.isArray(n.selectors) ? n.selectors.filter((i) => typeof i == "string") : [],
      content: typeof n.content?.default == "string" ? n.content.default : "",
      page: n.pageUrl?.glob ?? "",
      placement: n.placement ?? "auto",
      align: n.align ?? "center",
      backLabel: n.backLabel ?? "Back",
      nextLabel: n.nextLabel ?? "Next",
      ...n.action ? { action: n.action } : {}
    }))
  };
}
function oe(r) {
  const t = Array.isArray(r) ? r : [r], e = [];
  for (const n of t)
    if (re(n))
      e.push(ie(n));
    else {
      const [i] = tt([n]);
      i && e.push(i);
    }
  return e;
}
function se(r = "tours:drafts") {
  return {
    async load() {
      try {
        const t = localStorage.getItem(r);
        return t ? tt(JSON.parse(t)) : null;
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
function de(r) {
  const t = { "Content-Type": "application/json" };
  return r.nonce && (t["X-WP-Nonce"] = r.nonce), {
    async load() {
      const e = await fetch(r.url, { headers: t, credentials: "same-origin" });
      if (!e.ok) throw new Error(`WordPress load failed: ${e.status}`);
      return tt(await e.json());
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
const G = "tours-resume";
function a(r, t = {}, e = []) {
  const n = document.createElement(r);
  for (const [i, o] of Object.entries(t)) n.setAttribute(i, o);
  for (const i of e) n.append(typeof i == "string" ? document.createTextNode(i) : i);
  return n;
}
function _(r, t, e = "") {
  const n = a("button", { class: `iconbtn ${e}`.trim(), title: t, type: "button" });
  return n.innerHTML = Z[r] ?? "", n;
}
function ae(r) {
  switch (r) {
    case "load":
      return "Starts automatically as soon as a matching page loads.";
    case "selector":
      return "Starts when an element matching the selector appears in the page (waits for it).";
    case "timer":
      return "Starts after the delay elapses on a matching page.";
    case "cta":
      return "Shows a small invitation in a corner; its button starts the tour.";
    case "manual":
    default:
      return 'Starts from the [site_tour] shortcode or any element with a data-site-tour="<id>" attribute.';
  }
}
function le(r) {
  switch (r) {
    case "load":
      return { type: "load" };
    case "selector":
      return { type: "selector", selector: "" };
    case "timer":
      return { type: "timer", delay: 3e3 };
    case "cta":
      return { type: "cta", text: "Need a hand getting started?", button: "Start tour", corner: "bottom-right", offset: 24 };
    default:
      return { type: "manual" };
  }
}
class $t {
  constructor(t = {}) {
    this.options = t, this.log = Q("editor"), this.host = null, this.root = null, this.tours = [X()], this.openTourId = this.tours[0].id, this.view = "edit", this.listFilter = "tour", this.menuOpen = !1, this.activeStepId = this.tours[0].steps[0]?.id ?? null, this.tab = "steps", this.displaySub = "tour", this.openSections = /* @__PURE__ */ new Set(), this.mode = "build", this.picker = null, this.picking = !1, this.player = null, this.highlight = null, this.cardPreview = null, this.focusStepId = null, this.onViewportChange = () => this.updateOverlays(!0), this.saveTimer = null, this.navPosition = t.navPosition ?? "bottom", this.panelPosition = t.panelPosition ?? "right", this.topOffset = Math.max(0, t.topOffset ?? 0), this.local = t.store ?? se(t.storageKey), this.secondary = t.storage ?? null;
  }
  /**
   * Auto-mount when the page URL carries the flag (default `?tours-edit=1`), so
   * a site owner can enable the builder without touching code. Returns the
   * instance if mounted, otherwise null.
   */
  static fromUrl(t = {}) {
    const e = t.urlFlag ?? "tours-edit", n = new URLSearchParams(window.location.search).get(e);
    if (n === null || n === "0" || n === "false") return null;
    const i = new $t(t);
    return i.mount(), i;
  }
  /** Render the UI onto the page. Idempotent. */
  mount() {
    if (this.host || this.options.mode === "off") return;
    this.host = a("div", { "data-tours-editor": "" }), this.host.style.setProperty("--e-top", `${this.topOffset}px`), this.root = this.host.attachShadow({ mode: "open" });
    const t = document.createElement("style");
    t.textContent = te + wt, this.root.appendChild(t), this.highlight = a("div", { class: "highlight" }), this.root.append(this.highlight), document.body.appendChild(this.host), window.addEventListener("scroll", this.onViewportChange, !0), window.addEventListener("resize", this.onViewportChange, !0), this.log.log("mounted"), this.render(), this.hydrate();
  }
  /** Load stored drafts (localStorage by default) and show them. */
  async hydrate() {
    const t = await this.local.load();
    t && t.length > 0 && (this.tours = t, this.openTourId = t[0].id, this.activeStepId = t[0].steps[0]?.id ?? null, this.log.log("hydrated", `${t.length} tour(s)`)), this.applyResume() || this.render();
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
    return ne(this.tour);
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
    const t = X(this.listFilter);
    this.tours.push(t), this.openTour(t.id);
  }
  deleteEntity(t) {
    const e = this.tours.findIndex((n) => n.id === t);
    e !== -1 && (this.tours.splice(e, 1), this.tours.some((n) => n.kind === "tour") || this.tours.push(X()), this.openTourId === t && (this.openTourId = this.tours[0].id), this.render());
  }
  /** Copy the open tour into a new template and jump to the Templates list. */
  saveAsTemplate() {
    const t = mt(this.tour, "template", `${this.tour.name} (template)`);
    this.tours.push(t), this.listFilter = "template", this.view = "list", this.menuOpen = !1, this.log.log("saved as template", t.id), this.render();
  }
  /** Create a new tour from a template and open it for editing. */
  createFromTemplate(t) {
    const e = this.tours.find((i) => i.id === t);
    if (!e) return;
    const n = mt(e, "tour", e.name.replace(/\s*\(template\)\s*$/, ""));
    this.tours.push(n), this.openTour(n.id);
  }
  setActive(t) {
    this.activeStepId !== t && (this.activeStepId = t, this.render());
  }
  addStepAfter(t, e = "step") {
    const n = j(e);
    n.page = this.currentPage(), this.tour.steps.splice(t + 1, 0, n), this.activeStepId = n.id, e === "step" && !this.picking ? this.togglePicking() : this.render(), this.revealStep(n.id);
  }
  /** Scroll the panel so a step's card is visible. Runs after render(). */
  revealStep(t) {
    const e = this.root?.querySelector(`.card[data-step-id="${CSS.escape(t)}"]`);
    if (!e) return;
    const n = e.closest(".panel__body");
    if (n && this.tour.steps[this.tour.steps.length - 1]?.id === t) {
      n.scrollTo({ top: n.scrollHeight, behavior: "smooth" });
      return;
    }
    e.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }
  /** A URL glob for the current page (matches its query/hash variations). */
  currentPage() {
    return `${window.location.origin}${window.location.pathname}*`;
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
    t && (this.picking = !0, this.picker = jt(
      (e) => {
        t.selectors = e, t.page || (t.page = this.currentPage()), this.picking = !1, this.picker = null, this.log.log("bound selector to step", t.id, e), this.render();
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
    this.startPreview();
  }
  /**
   * Enter preview mode, optionally starting at a given step id (used when
   * resuming after a cross-page navigation). The id is resolved against the
   * compiled tour, whose step set can differ from the draft. Returns false if
   * the draft is invalid.
   */
  startPreview(t) {
    const e = this.export();
    if (!e.ok)
      return this.log.warn("cannot preview — draft is invalid", e.errors), t || window.alert(`Add a selector and text to at least one step first:

${e.errors.join(`
`)}`), !1;
    this.mode = "preview", this.render(), this.player = Qt(e.tour, {
      onNavigate: (i, o) => this.navigateForResume(i, o, "preview"),
      // The player refuses to start while the builder is mounted, so that a
      // host app's own tours do not stack under it. This preview *is* the
      // builder, so it opts out.
      allowWhileEditing: !0
    });
    const n = t ? e.tour.steps.findIndex((i) => i.id === t) : 0;
    return this.player.start(Math.max(0, n)), !0;
  }
  /**
   * Flush the draft, then navigate to `url` with a resume token so the builder
   * re-opens on `stepId` (and resumes preview when `mode` is 'preview') after
   * the page reloads. Used for cross-page Next in both build and preview.
   */
  async navigateForResume(t, e, n) {
    this.saveTimer !== null && (clearTimeout(this.saveTimer), this.saveTimer = null), await this.persist();
    const i = new URL(t, window.location.href);
    i.searchParams.set(G, `${n}~${this.openTourId}~${e}`), this.log.log("navigating for resume", i.toString()), window.location.assign(i.toString());
  }
  /**
   * Consume a resume token from the URL (see RESUME_PARAM): reopen the tour on
   * the referenced step and, for preview, restart playback there. Strips the
   * param so a manual refresh will not re-trigger it. Returns true when it
   * handled a resume (and rendered), false to let the caller render normally.
   */
  applyResume() {
    const t = new URLSearchParams(window.location.search), e = t.get(G);
    if (!e) return !1;
    t.delete(G);
    const n = t.toString(), i = window.location.pathname + (n ? `?${n}` : "") + window.location.hash;
    window.history.replaceState(window.history.state, "", i);
    const [o, s, l] = e.split("~"), p = this.tours.find((c) => c.id === s);
    return p ? (this.openTourId = p.id, this.view = "edit", this.activeStepId = l, o === "preview" && this.startPreview(l) || (this.tab = "steps", this.render()), !0) : !1;
  }
  // ---------- rendering ----------
  render() {
    if (!this.root) return;
    const t = this.root.querySelector(".panel__body")?.scrollTop ?? 0;
    this.root.querySelectorAll(".panel, .nav").forEach((n) => n.remove()), this.mode === "build" && this.root.appendChild(this.renderPanel()), this.root.appendChild(this.renderNav());
    const e = this.root.querySelector(".panel__body");
    e && t && (e.scrollTop = t), this.focusStepId && (this.focusContent(this.focusStepId), this.focusStepId = null), this.updateOverlays(), this.markDirty();
  }
  /** Resolve a step's target on the page, trying each candidate selector. */
  resolveTarget(t) {
    return z(t.selectors);
  }
  /**
   * Draw the dashed outline around the active step's target, and (in the Card
   * sub-tab) a live tooltip-card preview beside it. Both use the same
   * tour-level values the player reads. Shown only in build mode when the
   * active step resolves; hidden while picking or in preview. No backdrop.
   */
  updateOverlays(t = !1) {
    const e = this.highlight;
    if (!e) return;
    const n = () => {
      e.style.display = "none", this.removeCardPreview();
    };
    if (this.view !== "edit" || this.mode !== "build" || this.picking) return n();
    const i = this.activeStep, o = i && i.selectors.length > 0 ? this.resolveTarget(i) : null;
    if (!i || !o) return n();
    const s = o.getBoundingClientRect(), { padding: l, radius: p, cardRadius: c } = this.tour.display;
    e.className = `highlight ${this.tab === "styles" ? "highlight--settings" : ""}`.trim(), e.style.transitionDuration = t ? "0ms" : "", e.style.display = "block", e.style.left = `${s.left - l}px`, e.style.top = `${s.top - l}px`, e.style.width = `${s.width + l * 2}px`, e.style.height = `${s.height + l * 2}px`, e.style.borderRadius = `${p}px`, this.drawStepCard(i, s, c);
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
    const i = t.content.trim(), o = this.tab === "styles" && this.displaySub === "card";
    if (!i && !o) {
      this.removeCardPreview();
      return;
    }
    const s = this.tour.steps, l = s.indexOf(t), p = (g) => () => {
      const b = s[g];
      if (b) {
        if (b.page && !R({ glob: b.page }, window.location.href)) {
          const v = kt({ glob: b.page });
          if (v) {
            this.navigateForResume(v, b.id, "build");
            return;
          }
        }
        this.setActive(b.id);
      }
    }, c = yt({
      ghost: !0,
      contentText: i || "Step tooltip preview",
      progress: `Step ${l + 1} of ${s.length}`,
      showClose: !0,
      onClose: () => {
        this.activeStepId = null, this.render();
      },
      radius: n,
      back: { label: t.backLabel, disabled: l <= 0, onClick: p(l - 1) },
      next: { label: t.nextLabel, primary: !0, disabled: l >= s.length - 1, onClick: p(l + 1) }
    });
    if (!i) {
      const g = c.querySelector(".tours-card__content");
      g && (g.style.opacity = "0.55");
    }
    this.removeCardPreview(), this.cardPreview = c, this.root?.appendChild(c);
    const h = this.tour.display.padding, u = {
      top: e.top - h,
      left: e.left - h,
      right: e.right + h,
      bottom: e.bottom + h,
      width: e.width + h * 2,
      height: e.height + h * 2
    }, { top: E, left: w } = xt({
      target: u,
      card: { width: c.offsetWidth, height: c.offsetHeight },
      side: t.placement,
      align: t.align,
      offset: this.tour.display.offset,
      alignOffset: this.tour.display.alignOffset,
      viewport: { width: window.innerWidth, height: window.innerHeight }
    });
    c.style.left = `${w}px`, c.style.top = `${E}px`;
  }
  renderNav() {
    const t = a("div", { class: `nav nav--${this.navPosition}` }), e = _("build", "Build", this.mode === "build" ? "iconbtn--active" : "");
    e.addEventListener("click", () => {
      this.mode === "preview" && this.togglePreview();
    });
    const n = _("preview", "Preview", this.mode === "preview" ? "iconbtn--active" : "");
    n.addEventListener("click", () => this.togglePreview());
    const i = _("navFlip", "Move bar (top/bottom)");
    i.addEventListener("click", () => {
      this.navPosition = this.navPosition === "bottom" ? "top" : "bottom", this.render();
    });
    const o = _("close", "Close builder");
    return o.addEventListener("click", () => this.destroy()), t.append(e, n, a("div", { class: "nav__sep" }), i, o), t;
  }
  renderPanel() {
    const t = a("div", { class: `panel panel--${this.panelPosition}` });
    return this.view === "list" ? t.append(this.renderListHeader(), this.renderList()) : t.append(this.renderHeader(), this.renderToolbar(), this.renderTabs(), this.renderBody()), t;
  }
  renderListHeader() {
    const t = a("div", { class: "panel__header" }), e = a("div", { class: "listtabs" });
    for (const [s, l] of [["tour", "Tours"], ["template", "Templates"]]) {
      const p = a("button", {
        class: `listtab ${this.listFilter === s ? "listtab--active" : ""}`.trim(),
        type: "button"
      }, [l]);
      p.addEventListener("click", () => {
        this.listFilter = s, this.render();
      }), e.append(p);
    }
    const n = _("download", `Download all ${this.listFilter === "template" ? "templates" : "tours"} as JSON`);
    n.addEventListener("click", () => this.downloadAll());
    const i = _("upload", "Import tours from JSON");
    i.addEventListener("click", () => this.importJson());
    const o = a("button", { class: "newtour", type: "button", title: "New" }, ["+ New"]);
    return o.addEventListener("click", () => this.createEntity()), t.append(e, n, i, o), t;
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
        const p = a("button", { class: "tourrow__use", type: "button", title: "Create a tour from this template" }, ["Use"]);
        p.addEventListener("click", (c) => {
          c.stopPropagation(), this.createFromTemplate(i.id);
        }), o.append(p);
      } else
        o.append(a("span", { class: `status status--${i.status}` }, [i.status]));
      const l = _("trash", "Delete");
      l.addEventListener("click", (p) => {
        p.stopPropagation(), this.deleteEntity(i.id);
      }), o.append(l), e.append(o);
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
    const i = _("menu", "Menu", this.menuOpen ? "iconbtn--active" : "");
    return i.addEventListener("click", () => {
      this.menuOpen = !this.menuOpen, this.render();
    }), t.append(e, n, i), this.menuOpen && t.append(this.renderMenu()), t;
  }
  /** The ⋯ dropdown: save-as-template (tours only), JSON download and import. */
  renderMenu() {
    const t = a("div", { class: "menu" }), e = (n, i) => {
      const o = a("button", { class: "menu__item", type: "button" }, [n]);
      return o.addEventListener("click", () => {
        this.menuOpen = !1, i();
      }), o;
    };
    return this.tour.kind === "tour" && t.append(e("Save as template", () => this.saveAsTemplate())), t.append(e("Download JSON", () => this.downloadOpenTour())), t.append(e("Import JSON…", () => this.importJson())), t;
  }
  /** Download the given drafts as a schema Tour[] JSON file. */
  downloadJson(t, e) {
    const n = t.map((l) => Et(l)), i = new Blob([JSON.stringify(n, null, 2)], { type: "application/json" }), o = URL.createObjectURL(i), s = document.createElement("a");
    s.href = o, s.download = e, s.click(), URL.revokeObjectURL(o), this.log.log("downloaded", e, `${n.length} tour(s)`);
  }
  /** Slugify a name into a safe file base (fallback to a generic name). */
  fileBase(t) {
    return t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "tours";
  }
  /** Download just the currently open tour (as an array of one). */
  downloadOpenTour() {
    this.downloadJson([this.tour], `${this.fileBase(this.tour.name)}.json`);
  }
  /** Download every tour of the kind currently listed (Tours or Templates). */
  downloadAll() {
    const t = this.tours.filter((e) => e.kind === this.listFilter);
    t.length !== 0 && this.downloadJson(t, `${this.listFilter === "template" ? "templates" : "tours"}.json`);
  }
  /**
   * Prompt for a JSON file and merge its tours into the builder. A tour with an
   * id that already exists is replaced; new ids are appended. When an open tour
   * is being edited it stays open (if it survived the import).
   */
  importJson() {
    const t = document.createElement("input");
    t.type = "file", t.accept = "application/json,.json", t.addEventListener("change", () => {
      const e = t.files?.[0];
      e && e.text().then((n) => {
        let i;
        try {
          i = JSON.parse(n);
        } catch {
          window.alert("Could not read that file — it is not valid JSON.");
          return;
        }
        const o = oe(i);
        if (o.length === 0) {
          window.alert("No tours found in that file.");
          return;
        }
        this.mergeDrafts(o);
      });
    }), t.click();
  }
  /** Merge imported drafts by id (replace existing, append new) and re-render. */
  mergeDrafts(t) {
    for (const e of t) {
      const n = this.tours.findIndex((i) => i.id === e.id);
      n === -1 ? this.tours.push(e) : this.tours[n] = e;
    }
    this.tours.some((e) => e.id === this.openTourId) || (this.openTourId = this.tours[0].id, this.activeStepId = this.tour.steps[0]?.id ?? null), this.log.log("imported", `${t.length} tour(s)`), this.render(), this.persist();
  }
  renderToolbar() {
    const t = a("div", { class: "panel__toolbar" }), e = _("back", "Back to tours");
    e.addEventListener("click", () => {
      this.stopPicking(), this.view = "list", this.render();
    });
    const n = _("panelSide", "Move panel (left/right)");
    n.addEventListener("click", () => {
      this.panelPosition = this.panelPosition === "right" ? "left" : "right", this.render();
    });
    const i = _(
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
      ["styles", "Styles"],
      ["rules", "Rules"]
    ]) {
      const i = a("button", { class: `tab ${this.tab === e ? "tab--active" : ""}`, type: "button" }, [n]);
      i.addEventListener("click", () => {
        this.tab = e, e === "styles" && this.selectFirstResolvableStep(), this.render();
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
    const l = a("span", { class: "settings__value", title: "Click to type a value" }, [`${s}px`]), p = a("input", {
      class: "settings__slider",
      type: "range",
      min: String(n),
      max: String(i),
      step: "1"
    });
    p.value = String(s);
    const c = (E) => {
      s = Math.max(n, Math.min(i, Math.round(E))), p.value = String(s), l.textContent = `${s}px`, o(s), this.updateOverlays(), this.markDirty();
    };
    p.addEventListener("input", () => c(Number(p.value))), l.addEventListener("click", () => this.editNumber(l, s, c));
    const h = a("div", { class: "settings__row" });
    h.append(p, l);
    const u = a("div", { class: "settings__field" });
    return u.append(a("label", { class: "settings__label" }, [t]), h), u;
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
    if (this.tab === "styles")
      return t.append(this.renderDisplaySettings()), t;
    if (this.tab === "rules")
      return t.append(this.renderRulesBody()), t;
    const e = a("div", { class: "steps" });
    return e.append(this.renderConnector(-1)), this.tour.steps.forEach((n, i) => {
      e.append(this.renderCard(n, i)), e.append(this.renderConnector(i));
    }), t.append(e), t;
  }
  /** Rules tab: start trigger, audience, and auto-start conditions. */
  renderRulesBody() {
    const t = a("div", { class: "settings" }), e = this.tour;
    if (t.append(
      this.selectField(
        "Audience",
        e.audience,
        [
          ["all", "Everyone"],
          ["auth", "Logged-in users only"],
          ["guest", "Logged-out visitors only"]
        ],
        (n) => {
          e.audience = n, this.markDirty();
        }
      ),
      this.selectField(
        "Start trigger",
        e.trigger.type,
        [
          ["manual", "Manual (shortcode / attribute)"],
          ["load", "On page load"],
          ["selector", "When an element appears"],
          ["timer", "After a delay"],
          ["cta", "Corner invitation (popover)"]
        ],
        (n) => {
          e.trigger = le(n), this.markDirty(), this.render();
        }
      )
    ), e.trigger.type === "selector")
      t.append(
        this.textField("Element selector (CSS)", e.trigger.selector, "#start, .cta", (n) => {
          e.trigger.type === "selector" && (e.trigger.selector = n);
        })
      );
    else if (e.trigger.type === "timer")
      t.append(
        this.textField("Delay (ms)", String(e.trigger.delay), "3000", (n) => {
          e.trigger.type === "timer" && (e.trigger.delay = Math.max(0, Number(n.replace(/[^0-9]/g, "")) || 0));
        })
      );
    else if (e.trigger.type === "cta") {
      const n = e.trigger;
      t.append(
        this.textField("Invitation text", n.text, "Need a hand getting started?", (i) => {
          e.trigger.type === "cta" && (e.trigger.text = i);
        }),
        this.textField("Button label", n.button, "Start tour", (i) => {
          e.trigger.type === "cta" && (e.trigger.button = i);
        }),
        this.selectField(
          "Corner",
          n.corner,
          [
            ["bottom-right", "Bottom right"],
            ["bottom-left", "Bottom left"],
            ["top-right", "Top right"],
            ["top-left", "Top left"]
          ],
          (i) => {
            e.trigger.type === "cta" && (e.trigger.corner = i), this.markDirty();
          }
        ),
        this.textField("Edge offset (px)", String(n.offset ?? 24), "24", (i) => {
          e.trigger.type === "cta" && (e.trigger.offset = Math.max(0, Number(i.replace(/[^0-9]/g, "")) || 0));
        })
      );
    }
    if (t.append(a("div", { class: "settings__hint" }, [ae(e.trigger.type)])), e.trigger.type !== "manual") {
      const n = e.conditions;
      t.append(
        a("div", { class: "settings__divider" }),
        this.checkboxField("Show only on the first visit", n.firstVisitOnly, (i) => {
          n.firstVisitOnly = i;
        }),
        this.textField("Show at most N times (0 = no limit)", String(n.maxShows), "0", (i) => {
          n.maxShows = Math.max(0, Number(i.replace(/[^0-9]/g, "")) || 0);
        }),
        this.selectField(
          "Device",
          n.device,
          [
            ["any", "Any device"],
            ["desktop", "Desktop only"],
            ["tablet", "Tablet only"],
            ["mobile", "Mobile only"]
          ],
          (i) => {
            n.device = i, this.markDirty();
          }
        )
      );
    }
    return t;
  }
  /** A labelled checkbox row. */
  checkboxField(t, e, n) {
    const i = a("input", { type: "checkbox", class: "settings__check" });
    i.checked = e, i.addEventListener("change", () => {
      n(i.checked), this.markDirty(), this.render();
    });
    const o = a("label", { class: "settings__checkrow" });
    return o.append(i, document.createTextNode(t)), o;
  }
  /** A labelled <select>. */
  selectField(t, e, n, i) {
    const o = document.createElement("select");
    o.className = "tsel";
    for (const [l, p] of n) {
      const c = document.createElement("option");
      c.value = l, c.textContent = p, l === e && (c.selected = !0), o.append(c);
    }
    o.addEventListener("change", () => i(o.value));
    const s = a("div", { class: "settings__field" });
    return s.append(a("label", { class: "settings__label" }, [t]), o), s;
  }
  /** A labelled text input that writes through on change. */
  textField(t, e, n, i) {
    const o = a("input", { class: "pagecfg__input", placeholder: n });
    o.value = e, o.addEventListener("change", () => {
      i(o.value.trim()), this.markDirty();
    });
    const s = a("div", { class: "settings__field" });
    return s.append(a("label", { class: "settings__label" }, [t]), o), s;
  }
  renderConnector(t) {
    const e = a("div", { class: "connector" }), n = a("button", { class: "connector__add", title: "Add step", type: "button" }, ["+"]);
    return n.addEventListener("click", () => this.addStepAfter(t)), e.append(a("div", { class: "connector__line" }), n, a("div", { class: "connector__line" })), e;
  }
  renderCard(t, e) {
    const n = t.id === this.activeStepId, i = a("div", {
      class: `card ${n ? "card--active" : ""} ${t.included ? "" : "card--excluded"}`.trim(),
      // Lets revealStep() find this card after a re-render.
      "data-step-id": t.id
    });
    return i.addEventListener("mousedown", () => this.setActive(t.id)), t.page && !R({ glob: t.page }, window.location.href) && i.classList.add("card--offpage"), i.append(this.renderCardControl(t, e), this.renderCardContent(t), this.renderCardFooter(t)), n && (i.append(this.section("placement", "Card position", () => this.renderPlacementBody(t))), i.append(this.section("page", "Page", () => this.renderPageBody(t)))), i;
  }
  /** Page sub-panel: which pages this step shows on (multi-page tours). */
  renderPageBody(t) {
    const e = a("div", { class: "settings" }), n = a("input", { class: "pagecfg__input", placeholder: "Any page" });
    n.value = t.page, n.addEventListener("change", () => {
      t.page = n.value.trim(), this.markDirty(), this.render();
    });
    const i = a("button", { class: "pagecfg__use", type: "button" }, ["Use current page"]);
    return i.addEventListener("click", () => {
      t.page = this.currentPage(), this.render();
    }), e.append(
      a("label", { class: "settings__label" }, ["Show on pages matching (URL glob)"]),
      n,
      i,
      a("div", { class: "settings__hint" }, [
        "Empty = any page. New steps get the current page automatically; navigate your site (with the builder on) to add steps on other pages."
      ])
    ), e;
  }
  /**
   * A collapsible card-settings section: a header with a left caret + title;
   * clicking toggles it. Collapsed by default; open state persists across
   * renders (keyed) so switching steps keeps the same sections expanded.
   */
  section(t, e, n) {
    const i = this.openSections.has(t), o = a("div", { class: `acc ${i ? "acc--open" : ""}`.trim() }), s = a("button", { class: "acc__head", type: "button" }), l = a("span", { class: "acc__caret" });
    return l.innerHTML = Z.chevron, s.append(l, a("span", { class: "acc__title" }, [e])), s.addEventListener("click", () => {
      i ? this.openSections.delete(t) : this.openSections.add(t), this.render();
    }), o.append(s), i && o.append(a("div", { class: "acc__body" }, [n()])), o;
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
      const l = t.placement === s.side && t.align === s.align, p = a("button", {
        class: `place__dot ${l ? "place__dot--active" : ""}`.trim(),
        type: "button",
        title: `${s.side} · ${s.align}`
      });
      p.style.left = `${s.x - 6}px`, p.style.top = `${s.y - 6}px`, p.addEventListener("click", () => {
        t.placement = s.side, t.align = s.align, this.render();
      }), n.append(p);
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
    s.innerHTML = Z[t.type === "action" ? "bolt" : "step"], s.append(document.createTextNode(t.type === "action" ? "Action" : "Step"));
    const l = t.selectors[0], p = a("span", { class: `card__sel ${l ? "" : "card__sel--empty"}`.trim(), title: l ?? "" }, [
      l ?? "no selector"
    ]), c = _("trash", "Delete step");
    if (c.addEventListener("click", () => this.removeStep(t.id)), n.append(i, o, s, a("div", { class: "spacer" })), t.page && !R({ glob: t.page }, window.location.href)) {
      const h = t.page.replace(/^https?:\/\/[^/]+/, "").replace(/\*$/, "") || "/";
      n.append(a("span", { class: "card__page", title: t.page }, [`⧉ ${h}`]));
    }
    return n.append(p, c), n;
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
      o.addEventListener("blur", s), o.addEventListener("keydown", (l) => {
        l.key === "Enter" && o.blur(), l.key === "Escape" && (o.value = t[e], o.blur());
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
  $t as TourBuilder,
  mt as cloneDraft,
  j as createDraftStep,
  X as createDraftTour,
  se as createLocalStore,
  de as createWordPressStore,
  tt as normalizeTours,
  ne as toTour
};
