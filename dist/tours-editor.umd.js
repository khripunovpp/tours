(function(m,L){typeof exports=="object"&&typeof module<"u"?L(exports):typeof define=="function"&&define.amd?define(["exports"],L):(m=typeof globalThis<"u"?globalThis:m||self,L(m.Tours={}))})(this,(function(m){"use strict";const L=`
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
`,Q=`
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
`;let A=null;function I(){if(A!==null)return A;try{A=new URLSearchParams(window.location.search).has("use_logs")}catch{A=!1}return A}function B(o){const e=`[tours:${o}]`;return{log:(...t)=>{I()&&console.log(e,...t)},warn:(...t)=>{I()&&console.warn(e,...t)},error:(...t)=>{I()&&console.error(e,...t)}}}function ee(o){if(o.id)return`#${CSS.escape(o.id)}`;const e=[];let t=o;for(;t&&t!==document.body&&t.nodeType===1;){const n=t.tagName.toLowerCase(),i=t.parentElement;if(!i){e.unshift(n);break}const r=Array.from(i.children).filter(d=>d.tagName===t.tagName);if(r.length>1){const d=r.indexOf(t)+1;e.unshift(`${n}:nth-of-type(${d})`)}else e.unshift(n);t=i}return`body > ${e.join(" > ")}`}function te(o,e={}){const t=B("picker");let n=null,i=null,r=null,d=!1;function l(c){if(c===n)return!0;for(const u of e.ignore??[])if(u&&u.contains(c))return!0;return!1}function k(){if(n)return;n=document.createElement("div"),n.setAttribute("data-tours-picker",""),i=n.attachShadow({mode:"open"});const c=document.createElement("style");c.textContent=L,i.appendChild(c),r=document.createElement("div"),r.className="tours-picker-overlay",r.style.display="none",i.appendChild(r);const u=document.createElement("div");u.className="tours-picker-hint",u.textContent="Hover and click an element • Esc to cancel",i.appendChild(u),document.body.appendChild(n)}function w(c,u){const b=document.elementFromPoint(c,u);return!b||l(b)?null:b}function T(c){if(!d||!r)return;const u=w(c.clientX,c.clientY);if(!u){r.style.display="none";return}const b=u.getBoundingClientRect();r.style.display="block",r.style.left=`${b.left}px`,r.style.top=`${b.top}px`,r.style.width=`${b.width}px`,r.style.height=`${b.height}px`}function P(c){if(!d)return;const u=w(c.clientX,c.clientY);if(c.preventDefault(),c.stopPropagation(),!u)return;const b=ee(u);t.log("picked",b),_(),o([b])}function z(c){c.key==="Escape"&&(c.preventDefault(),_())}function R(){d||(d=!0,t.log("start"),k(),document.addEventListener("mousemove",T,!0),document.addEventListener("click",P,!0),document.addEventListener("keydown",z,!0))}function _(){d&&(d=!1,document.removeEventListener("mousemove",T,!0),document.removeEventListener("click",P,!0),document.removeEventListener("keydown",z,!0),n&&n.parentNode&&n.parentNode.removeChild(n),n=null,i=null,r=null)}return{start:R,stop:_}}const U=6,ne=1;function y(o){return typeof o=="object"&&o!==null&&!Array.isArray(o)}function j(o){return y(o)&&typeof o.default=="string"}const H=["top","bottom","left","right"],F=["mobile","tablet","desktop"],Y=["click","input","navigate","none"];function q(o,e,t){if(!y(o)){t.push(`${e} must be an object`);return}const n=typeof o.glob=="string"&&o.glob.length>0,i=typeof o.regex=="string"&&o.regex.length>0;if(!n&&!i&&t.push(`${e} must have a non-empty "glob" or "regex"`),i)try{new RegExp(o.regex)}catch{t.push(`${e}.regex is not a valid regular expression`)}}function W(o,e,t){if(!y(o)){t.push(`${e} must be an object`);return}o.url!==void 0&&q(o.url,`${e}.url`,t),o.role!==void 0&&typeof o.role!="string"&&t.push(`${e}.role must be a string`),o.firstVisitOnly!==void 0&&typeof o.firstVisitOnly!="boolean"&&t.push(`${e}.firstVisitOnly must be a boolean`),o.device!==void 0&&!F.includes(o.device)&&t.push(`${e}.device must be one of ${F.join("|")}`),o.unlessSeen!==void 0&&typeof o.unlessSeen!="boolean"&&t.push(`${e}.unlessSeen must be a boolean`),o.maxShows!==void 0&&(typeof o.maxShows!="number"||o.maxShows<0)&&t.push(`${e}.maxShows must be a non-negative number`)}function oe(o,e,t){if(!y(o)){t.push(`${e} must be an object`);return}Y.includes(o.type)||t.push(`${e}.type must be one of ${Y.join("|")}`),o.url!==void 0&&typeof o.url!="string"&&t.push(`${e}.url must be a string`),o.value!==void 0&&typeof o.value!="string"&&t.push(`${e}.value must be a string`)}function ie(o){const e=[];return y(o)?((typeof o.id!="string"||o.id.length===0)&&e.push("tour.id must be a non-empty string"),typeof o.schemaVersion!="number"&&e.push("tour.schemaVersion must be a number"),j(o.title)||e.push('tour.title must be a localized text with a string "default"'),Array.isArray(o.steps)?o.steps.length===0?e.push("tour.steps must contain at least one step"):o.steps.forEach((t,n)=>{if(!y(t)){e.push(`steps[${n}] must be an object`);return}(typeof t.id!="string"||t.id.length===0)&&e.push(`steps[${n}].id must be a non-empty string`),(!Array.isArray(t.selectors)||t.selectors.length===0||!t.selectors.every(i=>typeof i=="string"&&i.length>0))&&e.push(`steps[${n}].selectors must be a non-empty array of non-empty strings`),j(t.content)||e.push(`steps[${n}].content must be a localized text with a string "default"`),t.placement!==void 0&&!H.includes(t.placement)&&e.push(`steps[${n}].placement must be one of ${H.join("|")}`),t.pageUrl!==void 0&&q(t.pageUrl,`steps[${n}].pageUrl`,e),t.condition!==void 0&&W(t.condition,`steps[${n}].condition`,e),t.action!==void 0&&oe(t.action,`steps[${n}].action`,e)}):e.push("tour.steps must be an array"),o.display!==void 0&&(y(o.display)?o.display.padding!==void 0&&(typeof o.display.padding!="number"||o.display.padding<0)&&e.push("tour.display.padding must be a non-negative number"):e.push("tour.display must be an object")),o.rules!==void 0&&(Array.isArray(o.rules)?o.rules.forEach((t,n)=>{if(!y(t)){e.push(`rules[${n}] must be an object`);return}t.tourId!==void 0&&typeof t.tourId!="string"&&e.push(`rules[${n}].tourId must be a string`),t.when===void 0?e.push(`rules[${n}].when is required`):W(t.when,`rules[${n}].when`,e)}):e.push("tour.rules must be an array")),e.length>0?{ok:!1,errors:e}:{ok:!0,tour:o}):{ok:!1,errors:["tour must be an object"]}}const N=12;function re(o){var K;const e=B("player");let t=null,n=null,i=null,r=null,d=!1,l=0;const k=((K=o.display)==null?void 0:K.padding)??U;function w(s){for(const h of s.selectors)try{const p=document.querySelector(h);if(p)return p}catch{}return null}function T(){if(t)return;t=document.createElement("div"),t.setAttribute("data-tours-player",""),n=t.attachShadow({mode:"open"});const s=document.createElement("style");s.textContent=Q,n.appendChild(s);const h=document.createElement("div");h.className="tours-backdrop",n.appendChild(h),i=document.createElement("div"),i.className="tours-spotlight",n.appendChild(i),r=document.createElement("div"),r.className="tours-tooltip",n.appendChild(r),document.body.appendChild(t)}function P(s){i&&(i.style.display="block",i.style.left=`${s.left-k}px`,i.style.top=`${s.top-k}px`,i.style.width=`${s.width+k*2}px`,i.style.height=`${s.height+k*2}px`)}function z(s,h){if(!r)return;const p=r.offsetWidth,v=r.offsetHeight,S=window.innerWidth,$=window.innerHeight;let f,g;const C=h??"bottom";switch(C){case"top":f=s.top-v-N,g=s.left+s.width/2-p/2;break;case"left":f=s.top+s.height/2-v/2,g=s.left-p-N;break;case"right":f=s.top+s.height/2-v/2,g=s.right+N;break;case"bottom":default:f=s.bottom+N,g=s.left+s.width/2-p/2;break}C==="bottom"&&f+v>$&&(f=s.top-v-N),g=Math.max(8,Math.min(g,S-p-8)),f=Math.max(8,Math.min(f,$-v-8)),r.style.left=`${g}px`,r.style.top=`${f}px`}function R(s){if(!r)return;const h=o.steps.length;r.textContent="";const p=document.createElement("button");p.className="tours-close",p.type="button",p.textContent="×",p.setAttribute("aria-label","Close"),p.addEventListener("click",E),r.appendChild(p);const v=document.createElement("p");v.className="tours-tooltip__content",v.textContent=s.content.default,r.appendChild(v);const S=document.createElement("div");S.className="tours-tooltip__footer";const $=document.createElement("span");$.className="tours-tooltip__progress",$.textContent=`Step ${l+1} of ${h}`,S.appendChild($);const f=document.createElement("div");f.className="tours-tooltip__buttons";const g=document.createElement("button");g.className="tours-btn",g.type="button",g.textContent="Back",g.disabled=l===0,g.addEventListener("click",V),f.appendChild(g);const C=document.createElement("button");C.className="tours-btn tours-btn--primary",C.type="button",C.textContent=l===h-1?"Done":"Next",C.addEventListener("click",O),f.appendChild(C),S.appendChild(f),r.appendChild(S)}function _(){if(!d)return;const s=o.steps[l];if(!s){E();return}e.log("render step",l,s.id);const h=w(s);if(!h){e.warn(`step "${s.id}" skipped: no element for selectors`,s.selectors),l<o.steps.length-1?(l+=1,_()):E();return}T(),h.scrollIntoView({behavior:"smooth",block:"center",inline:"center"}),R(s);const p=h.getBoundingClientRect();P(p),z(p,s.placement)}function c(s){d&&(s.key==="Escape"?(s.preventDefault(),E()):s.key==="ArrowRight"?O():s.key==="ArrowLeft"&&V())}function u(){if(!d)return;const s=o.steps[l];if(!s)return;const h=w(s);if(!h)return;const p=h.getBoundingClientRect();P(p),z(p,s.placement)}function b(){d||o.steps.length!==0&&(d=!0,l=0,e.log("start",o.id,`${o.steps.length} steps`),T(),window.addEventListener("keydown",c,!0),window.addEventListener("resize",u,!0),window.addEventListener("scroll",u,!0),_())}function E(){d&&(d=!1,e.log("stop"),window.removeEventListener("keydown",c,!0),window.removeEventListener("resize",u,!0),window.removeEventListener("scroll",u,!0),t&&t.parentNode&&t.parentNode.removeChild(t),t=null,n=null,i=null,r=null)}function O(){if(d){if(l>=o.steps.length-1){E();return}l+=1,_()}}function V(){d&&(l<=0||(l-=1,_()))}return{start:b,stop:E,next:O,prev:V}}const se=`
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

/* ---------- Display settings ---------- */
.settings { padding: 4px 2px; }
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
`,G={cursor:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m4 4 7 17 2.5-7L21 11.5 4 4Z"/></svg>',back:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>',menu:'<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></svg>',panelSide:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M15 4v16"/></svg>',navFlip:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18"/><path d="m7 8 5-5 5 5"/><path d="m7 16 5 5 5-5"/></svg>',build:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>',preview:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',close:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',trash:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>',bolt:'<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z"/></svg>',step:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 2"/></svg>'};let ae=0;function J(o){const e=typeof crypto<"u"&&"randomUUID"in crypto?crypto.randomUUID():`${ae++}`;return`${o}-${e}`}function M(o="step"){return{id:J("step"),type:o,included:!0,selectors:[],content:"",placement:"bottom",backLabel:"Back",nextLabel:"Next"}}function X(){return{id:J("tour"),name:"Untitled tour",status:"draft",steps:[M()],display:{padding:U}}}function Z(o){const e=o.steps.filter(n=>n.included&&n.selectors.length>0).map(n=>({id:n.id,selectors:n.selectors,content:{default:n.content},placement:n.placement})),t={id:o.id,schemaVersion:ne,title:{default:o.name},steps:e,display:{padding:o.display.padding}};return ie(t)}function a(o,e={},t=[]){const n=document.createElement(o);for(const[i,r]of Object.entries(e))n.setAttribute(i,r);for(const i of t)n.append(typeof i=="string"?document.createTextNode(i):i);return n}function x(o,e,t=""){const n=a("button",{class:`iconbtn ${t}`.trim(),title:e,type:"button"});return n.innerHTML=G[o]??"",n}class D{constructor(e={}){var t;this.options=e,this.log=B("editor"),this.host=null,this.root=null,this.tour=X(),this.activeStepId=((t=this.tour.steps[0])==null?void 0:t.id)??null,this.tab="steps",this.mode="build",this.picker=null,this.picking=!1,this.player=null,this.highlight=null,this.focusStepId=null,this.onViewportChange=()=>this.updateHighlight(),this.navPosition=e.navPosition??"bottom",this.panelPosition=e.panelPosition??"right"}static fromUrl(e={}){const t=e.urlFlag??"tours-edit",n=new URLSearchParams(window.location.search).get(t);if(n===null||n==="0"||n==="false")return null;const i=new D(e);return i.mount(),i}mount(){if(this.host||this.options.mode==="off")return;this.host=a("div",{"data-tours-editor":""}),this.root=this.host.attachShadow({mode:"open"});const e=document.createElement("style");e.textContent=se,this.root.appendChild(e),this.highlight=a("div",{class:"highlight"}),this.root.appendChild(this.highlight),document.body.appendChild(this.host),window.addEventListener("scroll",this.onViewportChange,!0),window.addEventListener("resize",this.onViewportChange,!0),this.log.log("mounted"),this.render()}destroy(){var e,t;this.stopPicking(),(e=this.player)==null||e.stop(),this.player=null,window.removeEventListener("scroll",this.onViewportChange,!0),window.removeEventListener("resize",this.onViewportChange,!0),(t=this.host)!=null&&t.parentNode&&this.host.parentNode.removeChild(this.host),this.host=null,this.root=null,this.highlight=null}export(){return Z(this.tour)}get activeStep(){return this.tour.steps.find(e=>e.id===this.activeStepId)??null}setActive(e){this.activeStepId!==e&&(this.activeStepId=e,this.render())}addStepAfter(e,t="step"){const n=M(t);this.tour.steps.splice(e+1,0,n),this.activeStepId=n.id,this.render()}removeStep(e){var n;const t=this.tour.steps.findIndex(i=>i.id===e);t!==-1&&(this.tour.steps.splice(t,1),this.activeStepId===e&&(this.activeStepId=((n=this.tour.steps[Math.max(0,t-1)])==null?void 0:n.id)??null),this.render())}togglePicking(){if(this.picking){this.stopPicking();return}const e=this.activeStep;e&&(this.picking=!0,this.picker=te(t=>{e.selectors=t,this.picking=!1,this.picker=null,this.log.log("bound selector to step",e.id,t),this.render()},{ignore:[this.host]}),this.picker.start(),this.render())}stopPicking(){var e;(e=this.picker)==null||e.stop(),this.picker=null,this.picking=!1}togglePreview(){var t;if(this.mode==="preview"){(t=this.player)==null||t.stop(),this.player=null,this.mode="build",this.render();return}const e=this.export();if(!e.ok){this.log.warn("cannot preview — draft is invalid",e.errors),window.alert(`Add a selector and text to at least one step first:

${e.errors.join(`
`)}`);return}this.mode="preview",this.render(),this.player=re(e.tour),this.player.start()}render(){this.root&&(this.root.querySelectorAll(".panel, .nav").forEach(e=>e.remove()),this.mode==="build"&&this.root.appendChild(this.renderPanel()),this.root.appendChild(this.renderNav()),this.focusStepId&&(this.focusContent(this.focusStepId),this.focusStepId=null),this.updateHighlight())}resolveTarget(e){for(const t of e.selectors)try{const n=document.querySelector(t);if(n)return n}catch{}return null}updateHighlight(){const e=this.highlight;if(!e)return;const t=()=>{e.style.display="none"};if(this.mode!=="build"||this.picking)return t();const n=this.activeStep;if(!n||n.selectors.length===0)return t();const i=this.resolveTarget(n);if(!i)return t();const r=i.getBoundingClientRect(),d=this.tour.display.padding;e.className=`highlight ${this.tab==="display"?"highlight--settings":""}`.trim(),e.style.display="block",e.style.left=`${r.left-d}px`,e.style.top=`${r.top-d}px`,e.style.width=`${r.width+d*2}px`,e.style.height=`${r.height+d*2}px`}renderNav(){const e=a("div",{class:`nav nav--${this.navPosition}`}),t=x("build","Build",this.mode==="build"?"iconbtn--active":"");t.addEventListener("click",()=>{this.mode==="preview"&&this.togglePreview()});const n=x("preview","Preview",this.mode==="preview"?"iconbtn--active":"");n.addEventListener("click",()=>this.togglePreview());const i=x("navFlip","Move bar (top/bottom)");i.addEventListener("click",()=>{this.navPosition=this.navPosition==="bottom"?"top":"bottom",this.render()});const r=x("close","Close builder");return r.addEventListener("click",()=>this.destroy()),e.append(t,n,a("div",{class:"nav__sep"}),i,r),e}renderPanel(){const e=a("div",{class:`panel panel--${this.panelPosition}`});return e.append(this.renderHeader(),this.renderToolbar(),this.renderTabs(),this.renderBody()),e}renderHeader(){const e=a("div",{class:"panel__header"}),t=a("input",{class:"panel__title",value:this.tour.name});t.value=this.tour.name,t.addEventListener("change",()=>{this.tour.name=t.value.trim()||"Untitled tour"});const n=a("span",{class:`status status--${this.tour.status}`},[this.tour.status]);n.addEventListener("click",()=>{this.tour.status=this.tour.status==="draft"?"published":"draft",this.render()}),n.setAttribute("title","Toggle status"),n.style.cursor="pointer";const i=x("menu","Tour menu");return i.addEventListener("click",()=>this.openMenu()),e.append(t,n,i),e}renderToolbar(){const e=a("div",{class:"panel__toolbar"}),t=x("back","Back to tours");t.addEventListener("click",()=>this.log.log("back to tour list (list view TODO)"));const n=x("panelSide","Move panel (left/right)");n.addEventListener("click",()=>{this.panelPosition=this.panelPosition==="right"?"left":"right",this.render()});const i=x("cursor",this.picking?"Cancel picking":"Pick element for active step",this.picking?"iconbtn--active":"");return i.addEventListener("click",()=>this.togglePicking()),e.append(t,a("div",{class:"spacer"}),n,i),e}renderTabs(){const e=a("div",{class:"tabs"});for(const[t,n]of[["steps","Steps"],["display","Display"],["assets","Assets"]]){const i=a("button",{class:`tab ${this.tab===t?"tab--active":""}`,type:"button"},[n]);i.addEventListener("click",()=>{this.tab=t,t==="display"&&this.selectFirstResolvableStep(),this.render()}),e.append(i)}return e}selectFirstResolvableStep(){const e=this.tour.steps.find(t=>this.resolveTarget(t)!==null);e&&(this.activeStepId=e.id)}renderDisplaySettings(){const e=a("div",{class:"settings"});if(!this.activeStep||!this.resolveTarget(this.activeStep))return e.append(a("div",{class:"assets-empty"},["Give a step a selector first — then its target frames here so you can tune the spacing."])),e;const t=a("span",{class:"settings__value"},[`${this.tour.display.padding}px`]),n=a("input",{class:"settings__slider",type:"range",min:"0",max:"40",step:"1"});n.value=String(this.tour.display.padding),n.addEventListener("input",()=>{this.tour.display.padding=Number(n.value),t.textContent=`${this.tour.display.padding}px`,this.updateHighlight()});const i=a("div",{class:"settings__field"});return i.append(a("label",{class:"settings__label"},["Outline spacing"]),(()=>{const r=a("div",{class:"settings__row"});return r.append(n,t),r})()),e.append(i,a("div",{class:"settings__hint"},["Applied everywhere the target is framed — the builder outline and the live tour spotlight."])),e}renderBody(){const e=a("div",{class:"panel__body"});if(this.tab==="assets")return e.append(a("div",{class:"assets-empty"},["Assets — coming soon"])),e;if(this.tab==="display")return e.append(this.renderDisplaySettings()),e;const t=a("div",{class:"steps"});return t.append(this.renderConnector(-1)),this.tour.steps.forEach((n,i)=>{t.append(this.renderCard(n,i)),t.append(this.renderConnector(i))}),e.append(t),e}renderConnector(e){const t=a("div",{class:"connector"}),n=a("button",{class:"connector__add",title:"Add step",type:"button"},["+"]);return n.addEventListener("click",()=>this.addStepAfter(e)),t.append(a("div",{class:"connector__line"}),n,a("div",{class:"connector__line"})),t}renderCard(e,t){const n=e.id===this.activeStepId,i=a("div",{class:`card ${n?"card--active":""} ${e.included?"":"card--excluded"}`.trim()});return i.addEventListener("mousedown",()=>this.setActive(e.id)),i.append(this.renderCardControl(e,t),this.renderCardContent(e),this.renderCardFooter(e)),i}renderCardControl(e,t){const n=a("div",{class:"card__control"}),i=a("input",{class:"card__check",type:"checkbox",title:"Include in tour"});i.checked=e.included,i.addEventListener("change",()=>{e.included=i.checked,this.render()});const r=a("span",{class:"card__index"},[String(t+1)]),d=a("span",{class:"card__type"});d.innerHTML=G[e.type==="action"?"bolt":"step"],d.append(document.createTextNode(e.type==="action"?"Action":"Step"));const l=e.selectors[0],k=a("span",{class:`card__sel ${l?"":"card__sel--empty"}`.trim(),title:l??""},[l??"no selector"]),w=x("trash","Delete step");return w.addEventListener("click",()=>this.removeStep(e.id)),n.append(i,r,d,a("div",{class:"spacer"}),k,w),n}renderCardContent(e){const t=a("div",{class:"card__content",contenteditable:"true","data-placeholder":"Write the step text…","data-step":e.id});return t.textContent=e.content,t.addEventListener("input",()=>{e.content=t.textContent??""}),t.addEventListener("mousedown",()=>{this.activeStepId!==e.id&&(this.focusStepId=e.id)}),t}renderCardFooter(e){const t=a("div",{class:"card__footer"});return t.append(this.renderEditableButton(e,"backLabel"),this.renderEditableButton(e,"nextLabel")),t}renderEditableButton(e,t){const n=a("button",{class:"cardbtn",type:"button"},[e[t]]);return n.addEventListener("click",i=>{i.stopPropagation();const r=a("input",{class:"cardbtn cardbtn--edit",value:e[t]});r.value=e[t],n.replaceWith(r),r.focus(),r.select();const d=()=>{e[t]=r.value.trim()||(t==="backLabel"?"Back":"Next"),r.replaceWith(this.renderEditableButton(e,t))};r.addEventListener("blur",d),r.addEventListener("keydown",l=>{l.key==="Enter"&&r.blur(),l.key==="Escape"&&(r.value=e[t],r.blur())})}),n}openMenu(){const e=this.export(),t=e.ok?JSON.stringify(e.tour,null,2):`INVALID:
${e.errors.join(`
`)}`;this.log.log("tour JSON",t),window.prompt("Tour JSON (copy):",e.ok?JSON.stringify(e.tour):"")}focusContent(e){var r;const t=(r=this.root)==null?void 0:r.querySelector(`.card__content[data-step="${e}"]`);if(!t)return;t.focus();const n=document.createRange();n.selectNodeContents(t),n.collapse(!1);const i=window.getSelection();i==null||i.removeAllRanges(),i==null||i.addRange(n)}}m.TourBuilder=D,m.createDraftStep=M,m.createDraftTour=X,m.toTour=Z,Object.defineProperty(m,Symbol.toStringTag,{value:"Module"})}));
//# sourceMappingURL=tours-editor.umd.js.map
