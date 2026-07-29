const jt = `
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
`, Vt = `
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
function K(n) {
  return JSON.stringify(n);
}
function Ht(n) {
  return /^[a-zA-Z][\w-]*$/.test(n) && n.length <= 30 && !/\d{2,}/.test(n) && !/^(css-|sc-|jsx-|emotion-|_|is-|has-)/.test(n);
}
function ut(n) {
  const t = [];
  let e = n;
  for (; e && e !== document.body && e.nodeType === 1; ) {
    const r = e.tagName.toLowerCase(), i = e.parentElement;
    if (!i) {
      t.unshift(r);
      break;
    }
    const o = Array.from(i.children).filter((s) => s.tagName === e.tagName);
    t.unshift(o.length > 1 ? `${r}:nth-of-type(${o.indexOf(e) + 1})` : r), e = i;
  }
  return `body > ${t.join(" > ")}`;
}
function Wt(n) {
  let t = n.parentElement;
  for (; t && t !== document.body && !t.id; )
    t = t.parentElement;
  if (!t || !t.id) return null;
  const e = [];
  let r = n;
  for (; r && r !== t; ) {
    const i = r.tagName.toLowerCase(), o = r.parentElement;
    if (!o) return null;
    const s = Array.from(o.children).filter((l) => l.tagName === r.tagName);
    e.unshift(s.length > 1 ? `${i}:nth-of-type(${s.indexOf(r) + 1})` : i), r = o;
  }
  return `#${CSS.escape(t.id)} > ${e.join(" > ")}`;
}
const Jt = ["data-testid", "data-test", "data-test-id", "data-cy", "data-qa", "data-id", "data-name"];
function qt(n) {
  const t = [], e = /* @__PURE__ */ new Set(), r = n.tagName.toLowerCase(), i = (c) => {
    if (!(!c || e.has(c)))
      try {
        document.querySelector(c) === n && (e.add(c), t.push(c));
      } catch {
      }
  };
  n.id && i(`#${CSS.escape(n.id)}`);
  for (const c of Jt) {
    const g = n.getAttribute(c);
    g && i(`${r}[${c}=${K(g)}]`);
  }
  const o = n.getAttribute("name");
  o && i(`${r}[name=${K(o)}]`);
  const s = n.getAttribute("aria-label");
  s && i(`[aria-label=${K(s)}]`);
  const l = Array.from(n.classList).filter(Ht);
  l.length && i(`${r}.${l.map((c) => CSS.escape(c)).join(".")}`);
  for (const c of l) i(`${r}.${CSS.escape(c)}`);
  i(Wt(n)), i(ut(n));
  const u = (n.textContent ?? "").replace(/\s+/g, " ").trim();
  if (u && u.length <= 50 && /^(a|button|summary|label|h[1-6])$/.test(r)) {
    const c = `text=${u}`;
    e.has(c) || (e.add(c), t.push(c));
  }
  return t.length === 0 && t.push(ut(n)), t;
}
const Yt = "a, button, summary, label, h1, h2, h3, h4, h5, h6";
function ht(n, t) {
  return !(n instanceof Element) || !n.isConnected || t !== document && t instanceof Node && !t.contains(n) ? null : n;
}
function Xt(n, t) {
  if (typeof n == "function") {
    let e;
    try {
      e = n();
    } catch {
      return null;
    }
    return ht(e, t);
  }
  if (typeof n != "string") return ht(n, t);
  if (n.startsWith("text=")) {
    const e = n.slice(5).trim();
    for (const r of Array.from(t.querySelectorAll(Yt)))
      if ((r.textContent ?? "").replace(/\s+/g, " ").trim() === e) return r;
    return null;
  }
  try {
    return t.querySelector(n);
  } catch {
    return null;
  }
}
function D(n, t = document) {
  for (const e of n) {
    const r = Xt(e, t);
    if (r) return r;
  }
  return null;
}
function Gt(n, t = {}) {
  const e = t.root ?? document, r = D(n, e);
  return r ? Promise.resolve(r) : new Promise((i) => {
    let o = !1, s;
    const l = (g) => {
      o || (o = !0, u.disconnect(), s && clearTimeout(s), i(g));
    }, u = new MutationObserver(() => {
      const g = D(n, e);
      g && l(g);
    });
    u.observe(document.documentElement, {
      childList: !0,
      subtree: !0,
      attributes: !0
    });
    const c = t.timeout ?? 4e3;
    c > 0 && Number.isFinite(c) && (s = setTimeout(() => l(null), c));
  });
}
let I = null;
function Z() {
  if (I !== null) return I;
  try {
    I = new URLSearchParams(window.location.search).has("use_logs");
  } catch {
    I = !1;
  }
  return I;
}
function it(n) {
  const t = `[tours:${n}]`;
  return {
    log: (...e) => {
      Z() && console.log(t, ...e);
    },
    warn: (...e) => {
      Z() && console.warn(t, ...e);
    },
    error: (...e) => {
      Z() && console.error(t, ...e);
    }
  };
}
function Kt(n, t = {}) {
  const e = it("picker");
  let r = null, i = null, o = null, s = !1;
  function l(f) {
    if (f === r) return !0;
    for (const v of t.ignore ?? [])
      if (v && v.contains(f)) return !0;
    return !1;
  }
  function u() {
    if (r) return;
    r = document.createElement("div"), r.setAttribute("data-tours-picker", ""), i = r.attachShadow({ mode: "open" });
    const f = document.createElement("style");
    f.textContent = jt, i.appendChild(f), o = document.createElement("div"), o.className = "tours-picker-overlay", o.style.display = "none", i.appendChild(o);
    const v = document.createElement("div");
    v.className = "tours-picker-hint", v.textContent = "Hover and click an element • Esc to cancel", i.appendChild(v), document.body.appendChild(r);
  }
  function c(f, v) {
    const _ = document.elementFromPoint(f, v);
    return !_ || l(_) ? null : _;
  }
  function g(f) {
    if (!s || !o) return;
    const v = c(f.clientX, f.clientY);
    if (!v) {
      o.style.display = "none";
      return;
    }
    const _ = v.getBoundingClientRect();
    o.style.display = "block", o.style.left = `${_.left}px`, o.style.top = `${_.top}px`, o.style.width = `${_.width}px`, o.style.height = `${_.height}px`;
  }
  function b(f) {
    if (!s) return;
    const v = c(f.clientX, f.clientY);
    if (f.preventDefault(), f.stopPropagation(), !v) return;
    const _ = qt(v);
    e.log("picked", _), y(), n(_);
  }
  function p(f) {
    f.key === "Escape" && (f.preventDefault(), y());
  }
  function E() {
    s || (s = !0, e.log("start"), u(), document.addEventListener("mousemove", g, !0), document.addEventListener("click", b, !0), document.addEventListener("keydown", p, !0));
  }
  function y() {
    s && (s = !1, document.removeEventListener("mousemove", g, !0), document.removeEventListener("click", b, !0), document.removeEventListener("keydown", p, !0), r && r.parentNode && r.parentNode.removeChild(r), r = null, i = null, o = null);
  }
  return { start: E, stop: y };
}
const B = 6, F = 6, U = 10, j = 12, Zt = 1;
function $(n) {
  return typeof n == "object" && n !== null && !Array.isArray(n);
}
function ft(n) {
  return $(n) && typeof n.default == "string";
}
const gt = ["top", "bottom", "left", "right", "auto"], bt = ["start", "center", "end"], mt = ["mobile", "tablet", "desktop"], vt = ["click", "input", "navigate", "none"];
function St(n, t, e) {
  if (!$(n)) {
    e.push(`${t} must be an object`);
    return;
  }
  const r = typeof n.glob == "string" && n.glob.length > 0, i = typeof n.regex == "string" && n.regex.length > 0;
  if (!r && !i && e.push(`${t} must have a non-empty "glob" or "regex"`), i)
    try {
      new RegExp(n.regex);
    } catch {
      e.push(`${t}.regex is not a valid regular expression`);
    }
}
function xt(n, t, e) {
  if (!$(n)) {
    e.push(`${t} must be an object`);
    return;
  }
  if (n.url !== void 0 && St(n.url, `${t}.url`, e), n.traits !== void 0)
    if (!$(n.traits))
      e.push(`${t}.traits must be an object`);
    else
      for (const [r, i] of Object.entries(n.traits))
        typeof i != "string" && typeof i != "number" && e.push(`${t}.traits.${r} must be a string or number`);
  n.firstVisitOnly !== void 0 && typeof n.firstVisitOnly != "boolean" && e.push(`${t}.firstVisitOnly must be a boolean`), n.device !== void 0 && !mt.includes(n.device) && e.push(`${t}.device must be one of ${mt.join("|")}`), n.unlessSeen !== void 0 && typeof n.unlessSeen != "boolean" && e.push(`${t}.unlessSeen must be a boolean`), n.maxShows !== void 0 && (typeof n.maxShows != "number" || n.maxShows < 0) && e.push(`${t}.maxShows must be a non-negative number`);
}
function Qt(n, t, e) {
  if (!$(n)) {
    e.push(`${t} must be an object`);
    return;
  }
  vt.includes(n.type) || e.push(`${t}.type must be one of ${vt.join("|")}`), n.url !== void 0 && typeof n.url != "string" && e.push(`${t}.url must be a string`), n.value !== void 0 && typeof n.value != "string" && e.push(`${t}.value must be a string`);
}
function te(n) {
  const t = [];
  if (!$(n))
    return { ok: !1, errors: ["tour must be an object"] };
  if ((typeof n.id != "string" || n.id.length === 0) && t.push("tour.id must be a non-empty string"), typeof n.schemaVersion != "number" && t.push("tour.schemaVersion must be a number"), ft(n.title) || t.push('tour.title must be a localized text with a string "default"'), Array.isArray(n.steps) ? n.steps.length === 0 ? t.push("tour.steps must contain at least one step") : n.steps.forEach((e, r) => {
    if (!$(e)) {
      t.push(`steps[${r}] must be an object`);
      return;
    }
    (typeof e.id != "string" || e.id.length === 0) && t.push(`steps[${r}].id must be a non-empty string`), (!Array.isArray(e.selectors) || e.selectors.length === 0 || !e.selectors.every((i) => typeof i == "string" && i.length > 0)) && t.push(`steps[${r}].selectors must be a non-empty array of non-empty strings`), ft(e.content) || t.push(`steps[${r}].content must be a localized text with a string "default"`), e.placement !== void 0 && !gt.includes(e.placement) && t.push(`steps[${r}].placement must be one of ${gt.join("|")}`), e.align !== void 0 && !bt.includes(e.align) && t.push(`steps[${r}].align must be one of ${bt.join("|")}`), e.backLabel !== void 0 && typeof e.backLabel != "string" && t.push(`steps[${r}].backLabel must be a string`), e.nextLabel !== void 0 && typeof e.nextLabel != "string" && t.push(`steps[${r}].nextLabel must be a string`), e.pageUrl !== void 0 && St(e.pageUrl, `steps[${r}].pageUrl`, t), e.condition !== void 0 && xt(e.condition, `steps[${r}].condition`, t), e.action !== void 0 && Qt(e.action, `steps[${r}].action`, t);
  }) : t.push("tour.steps must be an array"), n.trigger !== void 0) {
    const e = n.trigger, r = ["manual", "load", "selector", "timer", "cta"], i = ["bottom-right", "bottom-left", "top-right", "top-left"];
    !$(e) || typeof e.type != "string" || !r.includes(e.type) ? t.push(`tour.trigger.type must be one of ${r.join("|")}`) : e.type === "selector" && (typeof e.selector != "string" || e.selector.length === 0) ? t.push("tour.trigger.selector must be a non-empty string") : e.type === "timer" && (typeof e.delay != "number" || e.delay < 0) ? t.push("tour.trigger.delay must be a non-negative number") : e.type === "cta" && (typeof e.text != "string" && t.push("tour.trigger.text must be a string"), typeof e.button != "string" && t.push("tour.trigger.button must be a string"), i.includes(e.corner) || t.push(`tour.trigger.corner must be one of ${i.join("|")}`), e.offset !== void 0 && (typeof e.offset != "number" || e.offset < 0) && t.push("tour.trigger.offset must be a non-negative number"));
  }
  if (n.audience !== void 0 && !["all", "auth", "guest"].includes(n.audience) && t.push("tour.audience must be one of all|auth|guest"), n.display !== void 0)
    if (!$(n.display))
      t.push("tour.display must be an object");
    else
      for (const e of ["padding", "radius", "cardRadius", "offset", "alignOffset"]) {
        const r = n.display[e];
        r !== void 0 && (typeof r != "number" || r < 0) && t.push(`tour.display.${e} must be a non-negative number`);
      }
  return n.rules !== void 0 && (Array.isArray(n.rules) ? n.rules.forEach((e, r) => {
    if (!$(e)) {
      t.push(`rules[${r}] must be an object`);
      return;
    }
    e.tourId !== void 0 && typeof e.tourId != "string" && t.push(`rules[${r}].tourId must be a string`), e.when === void 0 ? t.push(`rules[${r}].when is required`) : xt(e.when, `rules[${r}].when`, t);
  }) : t.push("tour.rules must be an array")), t.length > 0 ? { ok: !1, errors: t } : { ok: !0, tour: n };
}
function ee(n, t, e) {
  const r = {
    top: n.top,
    bottom: e.height - n.bottom,
    left: n.left,
    right: e.width - n.right
  }, i = {
    top: t.height,
    bottom: t.height,
    left: t.width,
    right: t.width
  }, o = ["bottom", "top", "right", "left"], s = o.find((l) => r[l] >= i[l] + 8);
  return s || o.reduce((l, u) => r[u] > r[l] ? u : l, o[0]);
}
function Et(n) {
  const { target: t, card: e, offset: r, viewport: i } = n, o = n.side === "auto", s = o ? ee(t, e, i) : n.side, l = o ? "center" : n.align, u = n.alignOffset ?? 0, c = l === "start" ? u : l === "end" ? -u : 0;
  let g = 0, b = 0;
  return s === "top" || s === "bottom" ? (g = s === "top" ? t.top - e.height - r : t.bottom + r, b = l === "start" ? t.left : l === "end" ? t.right - e.width : t.left + t.width / 2 - e.width / 2, b += c) : (b = s === "left" ? t.left - e.width - r : t.right + r, g = l === "start" ? t.top : l === "end" ? t.bottom - e.height : t.top + t.height / 2 - e.height / 2, g += c), b = Math.max(8, Math.min(b, i.width - e.width - 8)), g = Math.max(8, Math.min(g, i.height - e.height - 8)), { top: g, left: b };
}
function yt(n) {
  const t = document.createElement("button");
  return t.type = "button", t.className = `tours-card__btn${n.primary ? " tours-card__btn--primary" : ""}${n.disabled ? " tours-card__btn--disabled" : ""}`, t.textContent = n.label, !n.disabled && n.onClick && t.addEventListener("click", n.onClick), t;
}
function Ct(n) {
  const t = document.createElement("div");
  if (t.className = `tours-card${n.ghost ? " tours-card--ghost" : ""}`, n.radius != null && (t.style.borderRadius = `${n.radius}px`), n.showClose) {
    const r = document.createElement("button");
    r.className = "tours-card__close", r.type = "button", r.textContent = "×", r.setAttribute("aria-label", "Close"), n.onClose && r.addEventListener("click", n.onClose), t.appendChild(r);
  }
  const e = document.createElement("div");
  if (e.className = "tours-card__content", n.contentHtml != null ? e.innerHTML = n.contentHtml : e.textContent = n.contentText ?? "", t.appendChild(e), n.back || n.next || n.progress) {
    const r = document.createElement("div");
    if (r.className = "tours-card__footer", n.back && r.appendChild(yt(n.back)), n.progress) {
      const i = document.createElement("span");
      i.className = "tours-card__progress", i.textContent = n.progress, r.appendChild(i);
    }
    n.next && r.appendChild(yt(n.next)), t.appendChild(r);
  }
  return t;
}
const $t = `
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
function ne(n) {
  const t = n.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*\*/g, "\0").replace(/\*/g, "[^/]*").replace(/ /g, ".*").replace(/\?/g, ".");
  return new RegExp(`^${t}$`);
}
function A(n, t) {
  if (!n) return !0;
  if (n.regex)
    try {
      return new RegExp(n.regex).test(t);
    } catch {
      return !1;
    }
  if (n.glob)
    try {
      return ne(n.glob).test(t);
    } catch {
      return !1;
    }
  return !0;
}
function Lt(n) {
  if (!n || !n.glob) return null;
  const t = n.glob.replace(/\*+/g, "");
  return /^https?:\/\//i.test(t) || t.startsWith("#") || t.startsWith("/") ? t : null;
}
function re(n = window.innerWidth) {
  return n <= 640 ? "mobile" : n <= 1024 ? "tablet" : "desktop";
}
function ie(n, t) {
  if (n.url && !A(n.url, t.url)) return !1;
  if (n.traits) {
    for (const [e, r] of Object.entries(n.traits))
      if (t.traits?.[e] !== r) return !1;
  }
  return !(n.firstVisitOnly && !t.firstVisit || n.device && n.device !== t.device || n.unlessSeen && t.seenCount > 0 || n.maxShows !== void 0 && t.seenCount >= n.maxShows);
}
function oe(n, t) {
  return !n || ie(n, t);
}
const nt = "tours:locationchange";
let wt = !1;
function se() {
  if (!wt) {
    wt = !0;
    for (const n of ["pushState", "replaceState"]) {
      const t = history[n];
      history[n] = function(...r) {
        const i = t.apply(this, r);
        return window.dispatchEvent(new Event(nt)), i;
      };
    }
  }
}
function _t(n) {
  return se(), window.addEventListener("popstate", n), window.addEventListener("hashchange", n), window.addEventListener(nt, n), () => {
    window.removeEventListener("popstate", n), window.removeEventListener("hashchange", n), window.removeEventListener(nt, n);
  };
}
const Tt = "tours:progress";
function Q(n, t) {
  n.set(Tt, JSON.stringify(t));
}
function ae(n) {
  n.remove(Tt);
}
const de = "tours:seen:";
function le(n, t) {
  const e = n.get(de + t), r = e ? parseInt(e, 10) : 0;
  return Number.isNaN(r) ? 0 : r;
}
const ce = `
:host { all: initial; }
/* Host-page custom properties still cascade in, so a site can restyle the
   popover without a custom renderer. */
.cta {
  position: fixed;
  z-index: 2147483200;
  box-sizing: border-box;
  max-width: 300px;
  padding: 16px 18px;
  font: 14px/1.5 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  color: var(--tours-cta-fg, #111827);
  background: var(--tours-cta-bg, #fff);
  border: 1px solid var(--tours-cta-border, #e5e7eb);
  border-radius: var(--tours-cta-radius, 14px);
  box-shadow: var(--tours-cta-shadow, 0 12px 32px rgba(15, 23, 42, 0.18));
}
.cta__text { margin: 0 0 12px; padding-right: 18px; }
.cta__btn {
  font: inherit;
  font-weight: 600;
  color: var(--tours-cta-btn-fg, #fff);
  background: var(--tours-cta-btn-bg, #2563eb);
  border: none;
  border-radius: var(--tours-cta-btn-radius, 9px);
  padding: 9px 16px;
  cursor: pointer;
}
.cta__btn:hover { background: var(--tours-cta-btn-bg-hover, #1d4ed8); }
.cta__close {
  position: absolute;
  top: 8px;
  right: 10px;
  width: 22px;
  height: 22px;
  padding: 0;
  font: 16px/1 system-ui, sans-serif;
  color: #9aa4b8;
  background: transparent;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.cta__close:hover { color: #111827; background: #f3f4f6; }
`;
function pe(n, t) {
  return t ? t(n) : ue({
    text: n.text,
    button: n.button,
    corner: n.corner,
    offset: n.offset,
    onStart: n.onResume
  });
}
function ue(n) {
  const t = n.corner ?? "bottom-right", e = n.offset ?? 24, r = document.createElement("div");
  r.setAttribute("data-tours-cta", "");
  const i = r.attachShadow({ mode: "open" }), o = document.createElement("style");
  o.textContent = ce, i.appendChild(o);
  const s = document.createElement("div");
  s.className = "cta";
  const [l, u] = t.split("-");
  s.style[l] = `${e}px`, s.style[u] = `${e}px`;
  const c = () => {
    r.parentNode && r.parentNode.removeChild(r);
  }, g = document.createElement("button");
  g.className = "cta__close", g.type = "button", g.textContent = "×", g.setAttribute("aria-label", "Dismiss"), g.addEventListener("click", c);
  const b = document.createElement("p");
  b.className = "cta__text", b.textContent = n.text;
  const p = document.createElement("button");
  return p.className = "cta__btn", p.type = "button", p.textContent = n.button, p.addEventListener("click", () => {
    c(), n.onStart();
  }), s.append(g, b, p), i.appendChild(s), document.body.appendChild(r), c;
}
const he = /* @__PURE__ */ new Set([
  "tourStarting",
  "stepChanging"
]);
function C(n, t, e) {
  const r = he.has(t);
  let i = !0;
  const o = n?.[t];
  if (o)
    try {
      o(e) === !1 && r && (i = !1);
    } catch (s) {
      console.error(`[tours] handler for "${t}" threw`, s);
    }
  if (typeof document < "u" && typeof CustomEvent == "function")
    try {
      const s = new CustomEvent(`tours:${t}`, { detail: e, cancelable: r });
      document.dispatchEvent(s), r && s.defaultPrevented && (i = !1);
    } catch (s) {
      console.error(`[tours] could not dispatch "tours:${t}"`, s);
    }
  return i;
}
const fe = "[data-tours-editor]";
function ge() {
  return typeof document < "u" && document.querySelector(fe) !== null;
}
function be(n, t = {}) {
  const e = it("player"), r = t.state;
  let i = null, o = null, s = null, l = null, u = null, c = null, g = null, b = !1, p = 0, E = 0, y = null;
  const f = n.display?.padding ?? B, v = n.display?.radius ?? F, _ = n.display?.cardRadius ?? U, Ot = n.display?.offset ?? j;
  function H(a) {
    return D(a.selectors);
  }
  function W(a) {
    return a.action?.type === "click";
  }
  function Rt(a) {
    if (!a.condition) return !0;
    const h = r ? le(r, n.id) : 0;
    return oe(a.condition, {
      url: window.location.href,
      traits: t.viewer?.(),
      device: re(),
      firstVisit: h === 0,
      seenCount: h
    });
  }
  function O(a) {
    return A(a.pageUrl, window.location.href);
  }
  function N() {
    r && Q(r, { tourId: n.id, index: p });
  }
  function st() {
    if (i) return;
    i = document.createElement("div"), i.setAttribute("data-tours-player", ""), o = i.attachShadow({ mode: "open" });
    const a = document.createElement("style");
    a.textContent = Vt + $t, o.appendChild(a), u = document.createElement("div"), u.className = "tours-backdrop", u.addEventListener("click", (h) => {
      const m = n.steps[p], x = m ? H(m) : null;
      if (x) {
        const w = x.getBoundingClientRect();
        if (h.clientX >= w.left - f && h.clientX <= w.right + f && h.clientY >= w.top - f && h.clientY <= w.bottom + f) return;
      }
      T();
    }), o.appendChild(u), s = document.createElement("div"), s.className = "tours-spotlight", s.style.borderRadius = `${v}px`, o.appendChild(s), document.body.appendChild(i);
  }
  function It(a) {
    if (!u) return;
    if (!a) {
      u.style.clipPath = "";
      return;
    }
    const h = a.left - f, m = a.top - f, x = a.right + f, w = a.bottom + f;
    u.style.clipPath = `polygon(0 0, 0 100%, ${h}px 100%, ${h}px ${m}px, ${x}px ${m}px, ${x}px ${w}px, ${h}px ${w}px, ${h}px 100%, 100% 100%, 100% 0)`;
  }
  function at(a, h = !1) {
    s && (s.style.transitionDuration = h ? "0ms" : "", s.style.display = "block", s.style.left = `${a.left - f}px`, s.style.top = `${a.top - f}px`, s.style.width = `${a.width + f * 2}px`, s.style.height = `${a.height + f * 2}px`);
  }
  function dt(a, h) {
    if (!l) return;
    const m = {
      top: a.top - f,
      left: a.left - f,
      right: a.right + f,
      bottom: a.bottom + f,
      width: a.width + f * 2,
      height: a.height + f * 2
    }, { top: x, left: w } = Et({
      target: m,
      card: { width: l.offsetWidth, height: l.offsetHeight },
      side: h.placement ?? "bottom",
      align: h.align ?? "center",
      offset: Ot,
      alignOffset: n.display?.alignOffset ?? 0,
      viewport: { width: window.innerWidth, height: window.innerHeight }
    });
    l.style.left = `${w}px`, l.style.top = `${x}px`;
  }
  function zt(a) {
    const h = Math.max(1, n.steps.length - E), m = Math.max(1, Math.min(p + 1 - E, h));
    l && l.remove();
    const x = p === n.steps.length - 1, w = n.steps[p - 1], R = !!w && O(w), Ut = !W(a) || x;
    l = Ct({
      contentText: a.content.default,
      progress: `Step ${m} of ${h}`,
      showClose: !0,
      onClose: Bt,
      radius: _,
      back: R ? { label: a.backLabel ?? "Back", onClick: G } : void 0,
      next: Ut ? {
        label: a.nextLabel ?? (x ? "Done" : "Next"),
        primary: !0,
        onClick: X
      } : void 0
    }), o?.appendChild(l);
  }
  function L() {
    if (!b) return;
    const a = n.steps[p];
    if (!a) {
      T();
      return;
    }
    if (e.log("render step", p, a.id), !Rt(a)) {
      e.log(`step "${a.id}" skipped: condition not met`), C(t.on, "stepSkipped", { tour: n, index: p, step: a, reason: "condition" }), E += 1, p < n.steps.length - 1 ? (p += 1, L()) : T(E >= n.steps.length ? "dismissed" : "completed");
      return;
    }
    const h = H(a);
    if (!h) {
      e.log(`step "${a.id}" target not found yet — waiting`, a.selectors), Gt(a.selectors, { timeout: 4e3 }).then((x) => {
        !b || n.steps[p] !== a || (x ? L() : (e.warn(`step "${a.id}" skipped: no element for selectors`, a.selectors), C(t.on, "stepSkipped", { tour: n, index: p, step: a, reason: "no-element" }), E += 1, p < n.steps.length - 1 ? (p += 1, L()) : T()));
      });
      return;
    }
    st(), h.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" }), zt(a);
    const m = h.getBoundingClientRect();
    at(m), dt(m, a), It(W(a) ? m : null), Mt(a), C(t.on, "stepActivated", { tour: n, index: p, step: a, target: h });
  }
  function Mt(a) {
    if (c?.(), c = null, !W(a)) return;
    const h = p + 1, m = n.steps[h];
    !m || O(m) || (c = _t(() => {
      !b || n.steps[p] !== a || A(m.pageUrl, window.location.href) && Y(h) && (c?.(), c = null, e.log("visitor navigated → advancing to", m.id), p = h, N(), L());
    }));
  }
  function lt(a) {
    b && (a.key === "Escape" ? (a.preventDefault(), T()) : a.key === "ArrowRight" ? X() : a.key === "ArrowLeft" && G());
  }
  function z() {
    if (!b) return;
    const a = n.steps[p];
    if (!a) return;
    const h = H(a);
    if (!h) return;
    const m = h.getBoundingClientRect();
    at(m, !0), dt(m, a);
  }
  function ct(a = 0) {
    if (b || n.steps.length === 0) return;
    if (!t.allowWhileEditing && ge()) {
      e.log(`start suppressed for "${n.id}" — the builder is mounted`);
      return;
    }
    const h = Math.max(0, Math.min(a, n.steps.length - 1));
    if (!C(t.on, "tourStarting", { tour: n, index: h })) {
      e.log("start vetoed by handler");
      return;
    }
    q(), b = !0, p = h, E = 0, e.log("start", n.id, `at ${p}/${n.steps.length}`), st(), window.addEventListener("keydown", lt, !0), window.addEventListener("resize", z, !0), window.addEventListener("scroll", z, !0), N(), C(t.on, "tourStarted", { tour: n, index: p }), L();
  }
  function Dt() {
    s && (s.style.display = "none"), l && (l.remove(), l = null);
  }
  function M() {
    Dt(), !y && (y = _t(() => {
      if (!b) {
        y?.(), y = null;
        return;
      }
      const a = n.steps[p];
      a && O(a) && (y?.(), y = null, L());
    }));
  }
  function J() {
    y && (y(), y = null), c && (c(), c = null), b && (b = !1, window.removeEventListener("keydown", lt, !0), window.removeEventListener("resize", z, !0), window.removeEventListener("scroll", z, !0), i && i.parentNode && i.parentNode.removeChild(i), i = null, o = null, s = null, l = null, u = null);
  }
  function T(a = "dismissed") {
    e.log("stop", a);
    const h = b, m = p;
    q(), J(), r && ae(r), h && (a === "completed" ? C(t.on, "tourCompleted", { tour: n }) : C(t.on, "tourDismissed", { tour: n, index: m }));
  }
  function q() {
    g?.(), g = null;
  }
  function Bt() {
    n.dismiss?.mode === "minimize" ? pt() : T();
  }
  function pt() {
    b && (e.log("minimized", n.id, `at ${p}`), J(), r && Q(r, { tourId: n.id, index: p, minimized: !0 }), C(t.on, "tourMinimized", { tour: n, index: p }), Ft());
  }
  function Ft() {
    q();
    const a = n.dismiss?.resume;
    g = pe(
      {
        tourId: n.id,
        text: a?.text ?? "Carry on with the tour?",
        button: a?.button ?? "Resume",
        corner: a?.corner,
        offset: a?.offset,
        onResume: () => {
          g = null, r && Q(r, { tourId: n.id, index: p }), C(t.on, "tourResumed", { tour: n, index: p }), ct(p);
        }
      },
      t.renderResume
    );
  }
  function Y(a) {
    const h = n.steps[a];
    return h ? C(t.on, "stepChanging", { tour: n, from: p, to: a, step: h }) : !0;
  }
  function X() {
    if (!b) return;
    const a = p + 1, h = n.steps[a];
    if (!h) {
      T("completed");
      return;
    }
    if (!Y(a)) {
      e.log("step change vetoed by handler");
      return;
    }
    if (O(h)) {
      p = a, N(), L();
      return;
    }
    p = a, N();
    const m = (R) => {
      J(), t.onNavigate ? t.onNavigate(R, h.id) : window.location.assign(R);
    }, x = n.steps[p - 1]?.action;
    if (x && x.type === "navigate" && x.url) {
      x.url.startsWith("#") ? (e.log("page transition (hash navigate) → resume at", p), M(), window.location.hash = x.url) : (e.log("page transition (navigate) → resume at", p), m(x.url));
      return;
    }
    const w = Lt(h.pageUrl);
    if (w) {
      w.startsWith("#") ? (e.log("page transition (derived hash) → resume at", p), M(), window.location.hash = w) : (e.log("page transition (derived navigate) → resume at", p, w), m(w));
      return;
    }
    e.log("page transition (wait) → resume at", p), M();
  }
  function G() {
    if (!b) return;
    const a = n.steps[p - 1];
    if (a) {
      if (!Y(p - 1)) {
        e.log("step change vetoed by handler");
        return;
      }
      if (O(a)) {
        p -= 1, N(), L();
        return;
      }
      p -= 1, N(), e.log("page transition back → resume at", p), M(), window.history.back();
    }
  }
  return { start: ct, stop: T, next: X, prev: G, minimize: pt, isActive: () => b };
}
const me = `
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
`, rt = {
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
let ve = 0;
function P(n) {
  const t = typeof crypto < "u" && "randomUUID" in crypto ? crypto.randomUUID() : `${ve++}`;
  return `${n}-${t}`;
}
function V(n = "step") {
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
function tt(n = "tour") {
  return {
    id: P(n),
    kind: n,
    name: n === "template" ? "Untitled template" : "Untitled tour",
    status: "draft",
    trigger: { type: "manual" },
    audience: "all",
    conditions: { firstVisitOnly: !0, maxShows: 0, device: "any" },
    steps: [V()],
    display: {
      padding: B,
      radius: F,
      cardRadius: U,
      offset: j,
      alignOffset: 0
    }
  };
}
function kt(n, t, e) {
  return {
    id: P(t),
    kind: t,
    name: e ?? n.name,
    status: "draft",
    trigger: { ...n.trigger },
    audience: n.audience,
    conditions: { ...n.conditions },
    steps: n.steps.map((r) => ({ ...r, id: P("step"), selectors: [...r.selectors] })),
    display: { ...n.display }
  };
}
function Nt(n) {
  if (n && typeof n == "object") {
    const t = n;
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
function ot(n) {
  if (!Array.isArray(n)) return [];
  const t = [];
  for (const e of n) {
    if (!e || typeof e != "object") continue;
    const r = e;
    typeof r.id != "string" || !Array.isArray(r.steps) || t.push({
      id: r.id,
      kind: r.kind === "template" ? "template" : "tour",
      name: typeof r.name == "string" ? r.name : "Untitled tour",
      status: r.status === "published" ? "published" : "draft",
      trigger: Nt(r.trigger),
      audience: r.audience === "auth" || r.audience === "guest" ? r.audience : "all",
      conditions: {
        firstVisitOnly: (r.conditions?.firstVisitOnly ?? !0) === !0,
        maxShows: S(r.conditions?.maxShows, 0),
        device: ["mobile", "tablet", "desktop"].includes(r.conditions?.device) ? r.conditions.device : "any"
      },
      display: {
        padding: S(r.display?.padding, B),
        radius: S(r.display?.radius, F),
        cardRadius: S(r.display?.cardRadius, U),
        offset: S(r.display?.offset, j),
        alignOffset: S(r.display?.alignOffset, 0)
      },
      steps: r.steps.filter((i) => !!i && typeof i == "object").map((i) => ({
        ...V(i.type === "action" ? "action" : "step"),
        ...i
      }))
    });
  }
  return t;
}
function S(n, t) {
  return typeof n == "number" && n >= 0 ? n : t;
}
function At(n) {
  const t = n.steps.filter((i) => i.included && i.selectors.length > 0).map((i) => ({
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
  n.conditions.firstVisitOnly && (e.firstVisitOnly = !0), n.conditions.maxShows > 0 && (e.maxShows = n.conditions.maxShows), n.conditions.device !== "any" && (e.device = n.conditions.device);
  const r = Object.keys(e).length > 0 ? [{ when: e }] : void 0;
  return {
    id: n.id,
    schemaVersion: Zt,
    title: { default: n.name },
    steps: t,
    trigger: n.trigger,
    audience: n.audience,
    ...r ? { rules: r } : {},
    display: {
      padding: n.display.padding,
      radius: n.display.radius,
      cardRadius: n.display.cardRadius,
      offset: n.display.offset,
      alignOffset: n.display.alignOffset
    }
  };
}
function xe(n) {
  return te(At(n));
}
function ye(n) {
  if (!n || typeof n != "object") return !1;
  const t = n;
  return "schemaVersion" in t || typeof t.title == "object" && t.title !== null;
}
function we(n) {
  const t = n.rules && n.rules[0]?.when || {}, e = t.device;
  return {
    id: typeof n.id == "string" && n.id ? n.id : P("tour"),
    kind: "tour",
    name: n.title?.default ?? "Imported tour",
    status: "draft",
    trigger: Nt(n.trigger),
    audience: n.audience === "auth" || n.audience === "guest" ? n.audience : "all",
    conditions: {
      firstVisitOnly: t.firstVisitOnly === !0,
      maxShows: S(t.maxShows, 0),
      device: e === "mobile" || e === "tablet" || e === "desktop" ? e : "any"
    },
    display: {
      padding: S(n.display?.padding, B),
      radius: S(n.display?.radius, F),
      cardRadius: S(n.display?.cardRadius, U),
      offset: S(n.display?.offset, j),
      alignOffset: S(n.display?.alignOffset, 0)
    },
    steps: (Array.isArray(n.steps) ? n.steps : []).map((r) => ({
      ...V("step"),
      id: typeof r.id == "string" && r.id ? r.id : P("step"),
      selectors: Array.isArray(r.selectors) ? r.selectors.filter((i) => typeof i == "string") : [],
      content: typeof r.content?.default == "string" ? r.content.default : "",
      page: r.pageUrl?.glob ?? "",
      placement: r.placement ?? "auto",
      align: r.align ?? "center",
      backLabel: r.backLabel ?? "Back",
      nextLabel: r.nextLabel ?? "Next",
      ...r.action ? { action: r.action } : {}
    }))
  };
}
function _e(n) {
  const t = Array.isArray(n) ? n : [n], e = [];
  for (const r of t)
    if (ye(r))
      e.push(we(r));
    else {
      const [i] = ot([r]);
      i && e.push(i);
    }
  return e;
}
function ke(n = "tours:drafts") {
  return {
    async load() {
      try {
        const t = localStorage.getItem(n);
        return t ? ot(JSON.parse(t)) : null;
      } catch {
        return null;
      }
    },
    async save(t) {
      try {
        localStorage.setItem(n, JSON.stringify(t));
      } catch {
      }
    }
  };
}
function Ce(n) {
  const t = { "Content-Type": "application/json" };
  return n.nonce && (t["X-WP-Nonce"] = n.nonce), {
    async load() {
      const e = await fetch(n.url, { headers: t, credentials: "same-origin" });
      if (!e.ok) throw new Error(`WordPress load failed: ${e.status}`);
      return ot(await e.json());
    },
    async save(e) {
      const r = await fetch(n.url, {
        method: "POST",
        headers: t,
        credentials: "same-origin",
        body: JSON.stringify(e)
      });
      if (!r.ok) throw new Error(`WordPress save failed: ${r.status}`);
    }
  };
}
const et = "tours-resume";
function d(n, t = {}, e = []) {
  const r = document.createElement(n);
  for (const [i, o] of Object.entries(t)) r.setAttribute(i, o);
  for (const i of e) r.append(typeof i == "string" ? document.createTextNode(i) : i);
  return r;
}
function k(n, t, e = "") {
  const r = d("button", { class: `iconbtn ${e}`.trim(), title: t, type: "button" });
  return r.innerHTML = rt[n] ?? "", r;
}
function Se(n) {
  switch (n) {
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
function Ee(n) {
  switch (n) {
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
class Pt {
  constructor(t = {}) {
    this.options = t, this.log = it("editor"), this.host = null, this.root = null, this.tours = [tt()], this.openTourId = this.tours[0].id, this.view = "edit", this.listFilter = "tour", this.menuOpen = !1, this.activeStepId = this.tours[0].steps[0]?.id ?? null, this.tab = "steps", this.displaySub = "tour", this.openSections = /* @__PURE__ */ new Set(), this.mode = "build", this.picker = null, this.picking = !1, this.player = null, this.highlight = null, this.cardPreview = null, this.focusStepId = null, this.onViewportChange = () => this.updateOverlays(!0), this.saveTimer = null, this.navPosition = t.navPosition ?? "bottom", this.panelPosition = t.panelPosition ?? "right", this.topOffset = Math.max(0, t.topOffset ?? 0), this.local = t.store ?? ke(t.storageKey), this.secondary = t.storage ?? null;
  }
  /**
   * Auto-mount when the page URL carries the flag (default `?tours-edit=1`), so
   * a site owner can enable the builder without touching code. Returns the
   * instance if mounted, otherwise null.
   */
  static fromUrl(t = {}) {
    const e = t.urlFlag ?? "tours-edit", r = new URLSearchParams(window.location.search).get(e);
    if (r === null || r === "0" || r === "false") return null;
    const i = new Pt(t);
    return i.mount(), i;
  }
  /** Render the UI onto the page. Idempotent. */
  mount() {
    if (this.host || this.options.mode === "off") return;
    this.host = d("div", { "data-tours-editor": "" }), this.host.style.setProperty("--e-top", `${this.topOffset}px`), this.root = this.host.attachShadow({ mode: "open" });
    const t = document.createElement("style");
    t.textContent = me + $t, this.root.appendChild(t), this.highlight = d("div", { class: "highlight" }), this.root.append(this.highlight), document.body.appendChild(this.host), window.addEventListener("scroll", this.onViewportChange, !0), window.addEventListener("resize", this.onViewportChange, !0), this.log.log("mounted"), this.render(), this.hydrate();
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
    return xe(this.tour);
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
    const t = tt(this.listFilter);
    this.tours.push(t), this.openTour(t.id);
  }
  deleteEntity(t) {
    const e = this.tours.findIndex((r) => r.id === t);
    e !== -1 && (this.tours.splice(e, 1), this.tours.some((r) => r.kind === "tour") || this.tours.push(tt()), this.openTourId === t && (this.openTourId = this.tours[0].id), this.render());
  }
  /** Copy the open tour into a new template and jump to the Templates list. */
  saveAsTemplate() {
    const t = kt(this.tour, "template", `${this.tour.name} (template)`);
    this.tours.push(t), this.listFilter = "template", this.view = "list", this.menuOpen = !1, this.log.log("saved as template", t.id), this.render();
  }
  /** Create a new tour from a template and open it for editing. */
  createFromTemplate(t) {
    const e = this.tours.find((i) => i.id === t);
    if (!e) return;
    const r = kt(e, "tour", e.name.replace(/\s*\(template\)\s*$/, ""));
    this.tours.push(r), this.openTour(r.id);
  }
  setActive(t) {
    this.activeStepId !== t && (this.activeStepId = t, this.render());
  }
  addStepAfter(t, e = "step") {
    const r = V(e);
    r.page = this.currentPage(), this.tour.steps.splice(t + 1, 0, r), this.activeStepId = r.id, e === "step" && !this.picking ? this.togglePicking() : this.render(), this.revealStep(r.id);
  }
  /** Scroll the panel so a step's card is visible. Runs after render(). */
  revealStep(t) {
    const e = this.root?.querySelector(`.card[data-step-id="${CSS.escape(t)}"]`);
    if (!e) return;
    const r = e.closest(".panel__body");
    if (r && this.tour.steps[this.tour.steps.length - 1]?.id === t) {
      r.scrollTo({ top: r.scrollHeight, behavior: "smooth" });
      return;
    }
    e.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }
  /** A URL glob for the current page (matches its query/hash variations). */
  currentPage() {
    return `${window.location.origin}${window.location.pathname}*`;
  }
  removeStep(t) {
    const e = this.tour.steps.findIndex((r) => r.id === t);
    e !== -1 && (this.tour.steps.splice(e, 1), this.activeStepId === t && (this.activeStepId = this.tour.steps[Math.max(0, e - 1)]?.id ?? null), this.render());
  }
  // ---------- picker (selector search) ----------
  togglePicking() {
    if (this.picking) {
      this.stopPicking();
      return;
    }
    const t = this.activeStep;
    t && (this.picking = !0, this.picker = Kt(
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
    this.mode = "preview", this.render(), this.player = be(e.tour, {
      onNavigate: (i, o) => this.navigateForResume(i, o, "preview"),
      // The player refuses to start while the builder is mounted, so that a
      // host app's own tours do not stack under it. This preview *is* the
      // builder, so it opts out.
      allowWhileEditing: !0
    });
    const r = t ? e.tour.steps.findIndex((i) => i.id === t) : 0;
    return this.player.start(Math.max(0, r)), !0;
  }
  /**
   * Flush the draft, then navigate to `url` with a resume token so the builder
   * re-opens on `stepId` (and resumes preview when `mode` is 'preview') after
   * the page reloads. Used for cross-page Next in both build and preview.
   */
  async navigateForResume(t, e, r) {
    this.saveTimer !== null && (clearTimeout(this.saveTimer), this.saveTimer = null), await this.persist();
    const i = new URL(t, window.location.href);
    i.searchParams.set(et, `${r}~${this.openTourId}~${e}`), this.log.log("navigating for resume", i.toString()), window.location.assign(i.toString());
  }
  /**
   * Consume a resume token from the URL (see RESUME_PARAM): reopen the tour on
   * the referenced step and, for preview, restart playback there. Strips the
   * param so a manual refresh will not re-trigger it. Returns true when it
   * handled a resume (and rendered), false to let the caller render normally.
   */
  applyResume() {
    const t = new URLSearchParams(window.location.search), e = t.get(et);
    if (!e) return !1;
    t.delete(et);
    const r = t.toString(), i = window.location.pathname + (r ? `?${r}` : "") + window.location.hash;
    window.history.replaceState(window.history.state, "", i);
    const [o, s, l] = e.split("~"), u = this.tours.find((c) => c.id === s);
    return u ? (this.openTourId = u.id, this.view = "edit", this.activeStepId = l, o === "preview" && this.startPreview(l) || (this.tab = "steps", this.render()), !0) : !1;
  }
  // ---------- rendering ----------
  render() {
    if (!this.root) return;
    const t = this.root.querySelector(".panel__body")?.scrollTop ?? 0;
    this.root.querySelectorAll(".panel, .nav").forEach((r) => r.remove()), this.mode === "build" && this.root.appendChild(this.renderPanel()), this.root.appendChild(this.renderNav());
    const e = this.root.querySelector(".panel__body");
    e && t && (e.scrollTop = t), this.focusStepId && (this.focusContent(this.focusStepId), this.focusStepId = null), this.updateOverlays(), this.markDirty();
  }
  /** Resolve a step's target on the page, trying each candidate selector. */
  resolveTarget(t) {
    return D(t.selectors);
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
    const r = () => {
      e.style.display = "none", this.removeCardPreview();
    };
    if (this.view !== "edit" || this.mode !== "build" || this.picking) return r();
    const i = this.activeStep, o = i && i.selectors.length > 0 ? this.resolveTarget(i) : null;
    if (!i || !o) return r();
    const s = o.getBoundingClientRect(), { padding: l, radius: u, cardRadius: c } = this.tour.display;
    e.className = `highlight ${this.tab === "styles" ? "highlight--settings" : ""}`.trim(), e.style.transitionDuration = t ? "0ms" : "", e.style.display = "block", e.style.left = `${s.left - l}px`, e.style.top = `${s.top - l}px`, e.style.width = `${s.width + l * 2}px`, e.style.height = `${s.height + l * 2}px`, e.style.borderRadius = `${u}px`, this.drawStepCard(i, s, c);
  }
  removeCardPreview() {
    this.cardPreview && (this.cardPreview.remove(), this.cardPreview = null);
  }
  /**
   * Render the active step's card near its target via the shared renderCard —
   * the exact markup the player uses. Shown when the step has content; in the
   * Card sub-tab a muted placeholder shows so the radius stays visible first.
   */
  drawStepCard(t, e, r) {
    const i = t.content.trim(), o = this.tab === "styles" && this.displaySub === "card";
    if (!i && !o) {
      this.removeCardPreview();
      return;
    }
    const s = this.tour.steps, l = s.indexOf(t), u = (y) => () => {
      const f = s[y];
      if (f) {
        if (f.page && !A({ glob: f.page }, window.location.href)) {
          const v = Lt({ glob: f.page });
          if (v) {
            this.navigateForResume(v, f.id, "build");
            return;
          }
        }
        this.setActive(f.id);
      }
    }, c = Ct({
      ghost: !0,
      contentText: i || "Step tooltip preview",
      progress: `Step ${l + 1} of ${s.length}`,
      showClose: !0,
      onClose: () => {
        this.activeStepId = null, this.render();
      },
      radius: r,
      back: { label: t.backLabel, disabled: l <= 0, onClick: u(l - 1) },
      next: { label: t.nextLabel, primary: !0, disabled: l >= s.length - 1, onClick: u(l + 1) }
    });
    if (!i) {
      const y = c.querySelector(".tours-card__content");
      y && (y.style.opacity = "0.55");
    }
    this.removeCardPreview(), this.cardPreview = c, this.root?.appendChild(c);
    const g = this.tour.display.padding, b = {
      top: e.top - g,
      left: e.left - g,
      right: e.right + g,
      bottom: e.bottom + g,
      width: e.width + g * 2,
      height: e.height + g * 2
    }, { top: p, left: E } = Et({
      target: b,
      card: { width: c.offsetWidth, height: c.offsetHeight },
      side: t.placement,
      align: t.align,
      offset: this.tour.display.offset,
      alignOffset: this.tour.display.alignOffset,
      viewport: { width: window.innerWidth, height: window.innerHeight }
    });
    c.style.left = `${E}px`, c.style.top = `${p}px`;
  }
  renderNav() {
    const t = d("div", { class: `nav nav--${this.navPosition}` }), e = k("build", "Build", this.mode === "build" ? "iconbtn--active" : "");
    e.addEventListener("click", () => {
      this.mode === "preview" && this.togglePreview();
    });
    const r = k("preview", "Preview", this.mode === "preview" ? "iconbtn--active" : "");
    r.addEventListener("click", () => this.togglePreview());
    const i = k("navFlip", "Move bar (top/bottom)");
    i.addEventListener("click", () => {
      this.navPosition = this.navPosition === "bottom" ? "top" : "bottom", this.render();
    });
    const o = k("close", "Close builder");
    return o.addEventListener("click", () => this.destroy()), t.append(e, r, d("div", { class: "nav__sep" }), i, o), t;
  }
  renderPanel() {
    const t = d("div", { class: `panel panel--${this.panelPosition}` });
    return this.view === "list" ? t.append(this.renderListHeader(), this.renderList()) : t.append(this.renderHeader(), this.renderToolbar(), this.renderTabs(), this.renderBody()), t;
  }
  renderListHeader() {
    const t = d("div", { class: "panel__header" }), e = d("div", { class: "listtabs" });
    for (const [s, l] of [["tour", "Tours"], ["template", "Templates"]]) {
      const u = d("button", {
        class: `listtab ${this.listFilter === s ? "listtab--active" : ""}`.trim(),
        type: "button"
      }, [l]);
      u.addEventListener("click", () => {
        this.listFilter = s, this.render();
      }), e.append(u);
    }
    const r = k("download", `Download all ${this.listFilter === "template" ? "templates" : "tours"} as JSON`);
    r.addEventListener("click", () => this.downloadAll());
    const i = k("upload", "Import tours from JSON");
    i.addEventListener("click", () => this.importJson());
    const o = d("button", { class: "newtour", type: "button", title: "New" }, ["+ New"]);
    return o.addEventListener("click", () => this.createEntity()), t.append(e, r, i, o), t;
  }
  renderList() {
    const t = d("div", { class: "panel__body" }), e = d("div", { class: "tourlist" }), r = this.tours.filter((i) => i.kind === this.listFilter);
    return r.length === 0 ? (t.append(
      d("div", { class: "assets-empty" }, [
        this.listFilter === "template" ? "No templates yet." : "No tours yet."
      ])
    ), t) : (r.forEach((i) => {
      const o = d("div", { class: "tourrow" });
      o.addEventListener("click", () => this.openTour(i.id));
      const s = d("div", { class: "tourrow__main" });
      if (s.append(
        d("div", { class: "tourrow__name" }, [i.name]),
        d("div", { class: "tourrow__meta" }, [
          `${i.steps.length} step${i.steps.length === 1 ? "" : "s"}`
        ])
      ), o.append(s), i.kind === "template") {
        const u = d("button", { class: "tourrow__use", type: "button", title: "Create a tour from this template" }, ["Use"]);
        u.addEventListener("click", (c) => {
          c.stopPropagation(), this.createFromTemplate(i.id);
        }), o.append(u);
      } else
        o.append(d("span", { class: `status status--${i.status}` }, [i.status]));
      const l = k("trash", "Delete");
      l.addEventListener("click", (u) => {
        u.stopPropagation(), this.deleteEntity(i.id);
      }), o.append(l), e.append(o);
    }), t.append(e), t);
  }
  renderHeader() {
    const t = d("div", { class: "panel__header" }), e = d("input", { class: "panel__title", value: this.tour.name });
    e.value = this.tour.name, e.addEventListener("change", () => {
      this.tour.name = e.value.trim() || "Untitled tour", this.markDirty();
    });
    const r = d("span", { class: `status status--${this.tour.status}` }, [this.tour.status]);
    r.addEventListener("click", () => {
      this.tour.status = this.tour.status === "draft" ? "published" : "draft", this.render();
    }), r.setAttribute("title", "Toggle status"), r.style.cursor = "pointer";
    const i = k("menu", "Menu", this.menuOpen ? "iconbtn--active" : "");
    return i.addEventListener("click", () => {
      this.menuOpen = !this.menuOpen, this.render();
    }), t.append(e, r, i), this.menuOpen && t.append(this.renderMenu()), t;
  }
  /** The ⋯ dropdown: save-as-template (tours only), JSON download and import. */
  renderMenu() {
    const t = d("div", { class: "menu" }), e = (r, i) => {
      const o = d("button", { class: "menu__item", type: "button" }, [r]);
      return o.addEventListener("click", () => {
        this.menuOpen = !1, i();
      }), o;
    };
    return this.tour.kind === "tour" && t.append(e("Save as template", () => this.saveAsTemplate())), t.append(e("Download JSON", () => this.downloadOpenTour())), t.append(e("Import JSON…", () => this.importJson())), t;
  }
  /** Download the given drafts as a schema Tour[] JSON file. */
  downloadJson(t, e) {
    const r = t.map((l) => At(l)), i = new Blob([JSON.stringify(r, null, 2)], { type: "application/json" }), o = URL.createObjectURL(i), s = document.createElement("a");
    s.href = o, s.download = e, s.click(), URL.revokeObjectURL(o), this.log.log("downloaded", e, `${r.length} tour(s)`);
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
      e && e.text().then((r) => {
        let i;
        try {
          i = JSON.parse(r);
        } catch {
          window.alert("Could not read that file — it is not valid JSON.");
          return;
        }
        const o = _e(i);
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
      const r = this.tours.findIndex((i) => i.id === e.id);
      r === -1 ? this.tours.push(e) : this.tours[r] = e;
    }
    this.tours.some((e) => e.id === this.openTourId) || (this.openTourId = this.tours[0].id, this.activeStepId = this.tour.steps[0]?.id ?? null), this.log.log("imported", `${t.length} tour(s)`), this.render(), this.persist();
  }
  renderToolbar() {
    const t = d("div", { class: "panel__toolbar" }), e = k("back", "Back to tours");
    e.addEventListener("click", () => {
      this.stopPicking(), this.view = "list", this.render();
    });
    const r = k("panelSide", "Move panel (left/right)");
    r.addEventListener("click", () => {
      this.panelPosition = this.panelPosition === "right" ? "left" : "right", this.render();
    });
    const i = k(
      "cursor",
      this.picking ? "Cancel picking" : "Pick element for active step",
      this.picking ? "iconbtn--active" : ""
    );
    return i.addEventListener("click", () => this.togglePicking()), t.append(e, d("div", { class: "spacer" }), r, i), t;
  }
  renderTabs() {
    const t = d("div", { class: "tabs" });
    for (const [e, r] of [
      ["steps", "Steps"],
      ["styles", "Styles"],
      ["rules", "Rules"]
    ]) {
      const i = d("button", { class: `tab ${this.tab === e ? "tab--active" : ""}`, type: "button" }, [r]);
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
    const t = d("div", { class: "settings" }), e = d("div", { class: "subtabs" });
    for (const [i, o] of [["tour", "Tour"], ["card", "Card"]]) {
      const s = d("button", { class: `subtab ${this.displaySub === i ? "subtab--active" : ""}`, type: "button" }, [o]);
      s.addEventListener("click", () => {
        this.displaySub = i, this.render();
      }), e.append(s);
    }
    if (t.append(e), !this.activeStep || !this.resolveTarget(this.activeStep))
      return t.append(
        d("div", { class: "assets-empty" }, [
          "Give a step a selector first — then its target frames here so you can tune the look."
        ])
      ), t;
    const r = this.tour.display;
    return this.displaySub === "tour" ? t.append(
      this.slider("Outline spacing", r.padding, 0, 40, (i) => r.padding = i),
      this.slider("Outline corner radius", r.radius, 0, 40, (i) => r.radius = i),
      d("div", { class: "settings__hint" }, [
        "The outline framing the target — applied in the builder and in the live tour spotlight."
      ])
    ) : t.append(
      this.slider("Card corner radius", r.cardRadius, 0, 32, (i) => r.cardRadius = i),
      this.slider("Distance from target", r.offset, 0, 48, (i) => r.offset = i),
      this.slider("Alignment inset", r.alignOffset, 0, 48, (i) => r.alignOffset = i),
      d("div", { class: "settings__hint" }, [
        "Distance is the gap to the element; alignment inset nudges the card in from the aligned edge (start/end placements)."
      ])
    ), t;
  }
  /** A labelled range slider that writes through `set` and re-draws overlays live. */
  slider(t, e, r, i, o) {
    let s = e;
    const l = d("span", { class: "settings__value", title: "Click to type a value" }, [`${s}px`]), u = d("input", {
      class: "settings__slider",
      type: "range",
      min: String(r),
      max: String(i),
      step: "1"
    });
    u.value = String(s);
    const c = (p) => {
      s = Math.max(r, Math.min(i, Math.round(p))), u.value = String(s), l.textContent = `${s}px`, o(s), this.updateOverlays(), this.markDirty();
    };
    u.addEventListener("input", () => c(Number(u.value))), l.addEventListener("click", () => this.editNumber(l, s, c));
    const g = d("div", { class: "settings__row" });
    g.append(u, l);
    const b = d("div", { class: "settings__field" });
    return b.append(d("label", { class: "settings__label" }, [t]), g), b;
  }
  /** Swap a value label for a digits-only input; commit on blur/Enter. */
  editNumber(t, e, r) {
    const i = d("input", {
      class: "settings__num",
      type: "text",
      inputmode: "numeric"
    });
    i.value = String(e), t.replaceWith(i), i.focus(), i.select(), i.addEventListener("input", () => {
      i.value = i.value.replace(/[^0-9]/g, "");
    });
    const o = () => {
      const s = i.value === "" ? e : Number(i.value);
      i.replaceWith(t), r(s);
    };
    i.addEventListener("blur", o), i.addEventListener("keydown", (s) => {
      s.key === "Enter" && i.blur(), s.key === "Escape" && (i.value = String(e), i.blur());
    });
  }
  renderBody() {
    const t = d("div", { class: "panel__body" });
    if (this.tab === "styles")
      return t.append(this.renderDisplaySettings()), t;
    if (this.tab === "rules")
      return t.append(this.renderRulesBody()), t;
    const e = d("div", { class: "steps" });
    return e.append(this.renderConnector(-1)), this.tour.steps.forEach((r, i) => {
      e.append(this.renderCard(r, i)), e.append(this.renderConnector(i));
    }), t.append(e), t;
  }
  /** Rules tab: start trigger, audience, and auto-start conditions. */
  renderRulesBody() {
    const t = d("div", { class: "settings" }), e = this.tour;
    if (t.append(
      this.selectField(
        "Audience",
        e.audience,
        [
          ["all", "Everyone"],
          ["auth", "Logged-in users only"],
          ["guest", "Logged-out visitors only"]
        ],
        (r) => {
          e.audience = r, this.markDirty();
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
        (r) => {
          e.trigger = Ee(r), this.markDirty(), this.render();
        }
      )
    ), e.trigger.type === "selector")
      t.append(
        this.textField("Element selector (CSS)", e.trigger.selector, "#start, .cta", (r) => {
          e.trigger.type === "selector" && (e.trigger.selector = r);
        })
      );
    else if (e.trigger.type === "timer")
      t.append(
        this.textField("Delay (ms)", String(e.trigger.delay), "3000", (r) => {
          e.trigger.type === "timer" && (e.trigger.delay = Math.max(0, Number(r.replace(/[^0-9]/g, "")) || 0));
        })
      );
    else if (e.trigger.type === "cta") {
      const r = e.trigger;
      t.append(
        this.textField("Invitation text", r.text, "Need a hand getting started?", (i) => {
          e.trigger.type === "cta" && (e.trigger.text = i);
        }),
        this.textField("Button label", r.button, "Start tour", (i) => {
          e.trigger.type === "cta" && (e.trigger.button = i);
        }),
        this.selectField(
          "Corner",
          r.corner,
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
        this.textField("Edge offset (px)", String(r.offset ?? 24), "24", (i) => {
          e.trigger.type === "cta" && (e.trigger.offset = Math.max(0, Number(i.replace(/[^0-9]/g, "")) || 0));
        })
      );
    }
    if (t.append(d("div", { class: "settings__hint" }, [Se(e.trigger.type)])), e.trigger.type !== "manual") {
      const r = e.conditions;
      t.append(
        d("div", { class: "settings__divider" }),
        this.checkboxField("Show only on the first visit", r.firstVisitOnly, (i) => {
          r.firstVisitOnly = i;
        }),
        this.textField("Show at most N times (0 = no limit)", String(r.maxShows), "0", (i) => {
          r.maxShows = Math.max(0, Number(i.replace(/[^0-9]/g, "")) || 0);
        }),
        this.selectField(
          "Device",
          r.device,
          [
            ["any", "Any device"],
            ["desktop", "Desktop only"],
            ["tablet", "Tablet only"],
            ["mobile", "Mobile only"]
          ],
          (i) => {
            r.device = i, this.markDirty();
          }
        )
      );
    }
    return t;
  }
  /** A labelled checkbox row. */
  checkboxField(t, e, r) {
    const i = d("input", { type: "checkbox", class: "settings__check" });
    i.checked = e, i.addEventListener("change", () => {
      r(i.checked), this.markDirty(), this.render();
    });
    const o = d("label", { class: "settings__checkrow" });
    return o.append(i, document.createTextNode(t)), o;
  }
  /** A labelled <select>. */
  selectField(t, e, r, i) {
    const o = document.createElement("select");
    o.className = "tsel";
    for (const [l, u] of r) {
      const c = document.createElement("option");
      c.value = l, c.textContent = u, l === e && (c.selected = !0), o.append(c);
    }
    o.addEventListener("change", () => i(o.value));
    const s = d("div", { class: "settings__field" });
    return s.append(d("label", { class: "settings__label" }, [t]), o), s;
  }
  /** A labelled text input that writes through on change. */
  textField(t, e, r, i) {
    const o = d("input", { class: "pagecfg__input", placeholder: r });
    o.value = e, o.addEventListener("change", () => {
      i(o.value.trim()), this.markDirty();
    });
    const s = d("div", { class: "settings__field" });
    return s.append(d("label", { class: "settings__label" }, [t]), o), s;
  }
  renderConnector(t) {
    const e = d("div", { class: "connector" }), r = d("button", { class: "connector__add", title: "Add step", type: "button" }, ["+"]);
    return r.addEventListener("click", () => this.addStepAfter(t)), e.append(d("div", { class: "connector__line" }), r, d("div", { class: "connector__line" })), e;
  }
  renderCard(t, e) {
    const r = t.id === this.activeStepId, i = d("div", {
      class: `card ${r ? "card--active" : ""} ${t.included ? "" : "card--excluded"}`.trim(),
      // Lets revealStep() find this card after a re-render.
      "data-step-id": t.id
    });
    return i.addEventListener("mousedown", () => this.setActive(t.id)), t.page && !A({ glob: t.page }, window.location.href) && i.classList.add("card--offpage"), i.append(this.renderCardControl(t, e), this.renderCardContent(t), this.renderCardFooter(t)), r && (i.append(this.section("placement", "Card position", () => this.renderPlacementBody(t))), i.append(this.section("page", "Page", () => this.renderPageBody(t)))), i;
  }
  /** Page sub-panel: which pages this step shows on (multi-page tours). */
  renderPageBody(t) {
    const e = d("div", { class: "settings" }), r = d("input", { class: "pagecfg__input", placeholder: "Any page" });
    r.value = t.page, r.addEventListener("change", () => {
      t.page = r.value.trim(), this.markDirty(), this.render();
    });
    const i = d("button", { class: "pagecfg__use", type: "button" }, ["Use current page"]);
    return i.addEventListener("click", () => {
      t.page = this.currentPage(), this.render();
    }), e.append(
      d("label", { class: "settings__label" }, ["Show on pages matching (URL glob)"]),
      r,
      i,
      d("div", { class: "settings__hint" }, [
        "Empty = any page. New steps get the current page automatically; navigate your site (with the builder on) to add steps on other pages."
      ])
    ), e;
  }
  /**
   * A collapsible card-settings section: a header with a left caret + title;
   * clicking toggles it. Collapsed by default; open state persists across
   * renders (keyed) so switching steps keeps the same sections expanded.
   */
  section(t, e, r) {
    const i = this.openSections.has(t), o = d("div", { class: `acc ${i ? "acc--open" : ""}`.trim() }), s = d("button", { class: "acc__head", type: "button" }), l = d("span", { class: "acc__caret" });
    return l.innerHTML = rt.chevron, s.append(l, d("span", { class: "acc__title" }, [e])), s.addEventListener("click", () => {
      i ? this.openSections.delete(t) : this.openSections.add(t), this.render();
    }), o.append(s), i && o.append(d("div", { class: "acc__body" }, [r()])), o;
  }
  /**
   * Placement picker body: an Auto toggle plus a 12-anchor grid (each side ×
   * start/center/end) around a mock target. Editing re-renders so the on-page
   * card and the active anchor update together.
   */
  renderPlacementBody(t) {
    const e = d("div", { class: "place" }), r = d("div", { class: "place__grid" });
    r.append(d("div", { class: "place__el" })), r.append(d("div", { class: "place__el" }));
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
      const l = t.placement === s.side && t.align === s.align, u = d("button", {
        class: `place__dot ${l ? "place__dot--active" : ""}`.trim(),
        type: "button",
        title: `${s.side} · ${s.align}`
      });
      u.style.left = `${s.x - 6}px`, u.style.top = `${s.y - 6}px`, u.addEventListener("click", () => {
        t.placement = s.side, t.align = s.align, this.render();
      }), r.append(u);
    }
    e.append(r);
    const o = d("button", {
      class: `place__auto ${t.placement === "auto" ? "place__auto--active" : ""}`.trim(),
      type: "button",
      title: "Pick the side with the most room automatically"
    }, ["Auto"]);
    return o.addEventListener("click", () => {
      t.placement = "auto", this.render();
    }), e.append(o), e;
  }
  renderCardControl(t, e) {
    const r = d("div", { class: "card__control" }), i = d("input", { class: "card__check", type: "checkbox", title: "Include in tour" });
    i.checked = t.included, i.addEventListener("change", () => {
      t.included = i.checked, this.render();
    });
    const o = d("span", { class: "card__index" }, [String(e + 1)]), s = d("span", { class: "card__type" });
    s.innerHTML = rt[t.type === "action" ? "bolt" : "step"], s.append(document.createTextNode(t.type === "action" ? "Action" : "Step"));
    const l = t.selectors[0], u = d("span", { class: `card__sel ${l ? "" : "card__sel--empty"}`.trim(), title: l ?? "" }, [
      l ?? "no selector"
    ]), c = k("trash", "Delete step");
    if (c.addEventListener("click", () => this.removeStep(t.id)), r.append(i, o, s, d("div", { class: "spacer" })), t.page && !A({ glob: t.page }, window.location.href)) {
      const g = t.page.replace(/^https?:\/\/[^/]+/, "").replace(/\*$/, "") || "/";
      r.append(d("span", { class: "card__page", title: t.page }, [`⧉ ${g}`]));
    }
    return r.append(u, c), r;
  }
  renderCardContent(t) {
    const e = d("div", {
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
    const e = d("div", { class: "card__footer" });
    return e.append(
      this.renderEditableButton(t, "backLabel"),
      this.renderEditableButton(t, "nextLabel")
    ), e;
  }
  /** A footer button that turns into a text input when clicked, to edit its label. */
  renderEditableButton(t, e) {
    const r = d("button", { class: "cardbtn", type: "button" }, [t[e]]);
    return r.addEventListener("click", (i) => {
      i.stopPropagation();
      const o = d("input", { class: "cardbtn cardbtn--edit", value: t[e] });
      o.value = t[e], r.replaceWith(o), o.focus(), o.select();
      const s = () => {
        t[e] = o.value.trim() || (e === "backLabel" ? "Back" : "Next"), o.replaceWith(this.renderEditableButton(t, e)), this.markDirty();
      };
      o.addEventListener("blur", s), o.addEventListener("keydown", (l) => {
        l.key === "Enter" && o.blur(), l.key === "Escape" && (o.value = t[e], o.blur());
      });
    }), r;
  }
  // ---------- misc ----------
  /** Focus a card's content area and place the caret at the end. */
  focusContent(t) {
    const e = this.root?.querySelector(`.card__content[data-step="${t}"]`);
    if (!e) return;
    e.focus();
    const r = document.createRange();
    r.selectNodeContents(e), r.collapse(!1);
    const i = window.getSelection();
    i?.removeAllRanges(), i?.addRange(r);
  }
}
export {
  Pt as TourBuilder,
  kt as cloneDraft,
  V as createDraftStep,
  tt as createDraftTour,
  ke as createLocalStore,
  Ce as createWordPressStore,
  ot as normalizeTours,
  xe as toTour
};
