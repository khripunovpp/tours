(function(y,A){typeof exports=="object"&&typeof module<"u"?A(exports):typeof define=="function"&&define.amd?define(["exports"],A):(y=typeof globalThis<"u"?globalThis:y||self,A(y.Tours={}))})(this,(function(y){"use strict";const A=`
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
`,re=`
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
`;let T=null;function B(){if(T!==null)return T;try{T=new URLSearchParams(window.location.search).has("use_logs")}catch{T=!1}return T}function M(o){const e=`[tours:${o}]`;return{log:(...t)=>{B()&&console.log(e,...t)},warn:(...t)=>{B()&&console.warn(e,...t)},error:(...t)=>{B()&&console.error(e,...t)}}}function ie(o){if(o.id)return`#${CSS.escape(o.id)}`;const e=[];let t=o;for(;t&&t!==document.body&&t.nodeType===1;){const n=t.tagName.toLowerCase(),r=t.parentElement;if(!r){e.unshift(n);break}const i=Array.from(r.children).filter(d=>d.tagName===t.tagName);if(i.length>1){const d=i.indexOf(t)+1;e.unshift(`${n}:nth-of-type(${d})`)}else e.unshift(n);t=r}return`body > ${e.join(" > ")}`}function se(o,e={}){const t=M("picker");let n=null,r=null,i=null,d=!1;function l(c){if(c===n)return!0;for(const u of e.ignore??[])if(u&&u.contains(c))return!0;return!1}function v(){if(n)return;n=document.createElement("div"),n.setAttribute("data-tours-picker",""),r=n.attachShadow({mode:"open"});const c=document.createElement("style");c.textContent=A,r.appendChild(c),i=document.createElement("div"),i.className="tours-picker-overlay",i.style.display="none",r.appendChild(i);const u=document.createElement("div");u.className="tours-picker-hint",u.textContent="Hover and click an element • Esc to cancel",r.appendChild(u),document.body.appendChild(n)}function x(c,u){const f=document.elementFromPoint(c,u);return!f||l(f)?null:f}function C(c){if(!d||!i)return;const u=x(c.clientX,c.clientY);if(!u){i.style.display="none";return}const f=u.getBoundingClientRect();i.style.display="block",i.style.left=`${f.left}px`,i.style.top=`${f.top}px`,i.style.width=`${f.width}px`,i.style.height=`${f.height}px`}function N(c){if(!d)return;const u=x(c.clientX,c.clientY);if(c.preventDefault(),c.stopPropagation(),!u)return;const f=ie(u);t.log("picked",f),E(),o([f])}function z(c){c.key==="Escape"&&(c.preventDefault(),E())}function I(){d||(d=!0,t.log("start"),v(),document.addEventListener("mousemove",C,!0),document.addEventListener("click",N,!0),document.addEventListener("keydown",z,!0))}function E(){d&&(d=!1,document.removeEventListener("mousemove",C,!0),document.removeEventListener("click",N,!0),document.removeEventListener("keydown",z,!0),n&&n.parentNode&&n.parentNode.removeChild(n),n=null,r=null,i=null)}return{start:I,stop:E}}const j=6,F=6,H=10,ae=1;function k(o){return typeof o=="object"&&o!==null&&!Array.isArray(o)}function Y(o){return k(o)&&typeof o.default=="string"}const q=["top","bottom","left","right"],W=["mobile","tablet","desktop"],G=["click","input","navigate","none"];function J(o,e,t){if(!k(o)){t.push(`${e} must be an object`);return}const n=typeof o.glob=="string"&&o.glob.length>0,r=typeof o.regex=="string"&&o.regex.length>0;if(!n&&!r&&t.push(`${e} must have a non-empty "glob" or "regex"`),r)try{new RegExp(o.regex)}catch{t.push(`${e}.regex is not a valid regular expression`)}}function X(o,e,t){if(!k(o)){t.push(`${e} must be an object`);return}o.url!==void 0&&J(o.url,`${e}.url`,t),o.role!==void 0&&typeof o.role!="string"&&t.push(`${e}.role must be a string`),o.firstVisitOnly!==void 0&&typeof o.firstVisitOnly!="boolean"&&t.push(`${e}.firstVisitOnly must be a boolean`),o.device!==void 0&&!W.includes(o.device)&&t.push(`${e}.device must be one of ${W.join("|")}`),o.unlessSeen!==void 0&&typeof o.unlessSeen!="boolean"&&t.push(`${e}.unlessSeen must be a boolean`),o.maxShows!==void 0&&(typeof o.maxShows!="number"||o.maxShows<0)&&t.push(`${e}.maxShows must be a non-negative number`)}function de(o,e,t){if(!k(o)){t.push(`${e} must be an object`);return}G.includes(o.type)||t.push(`${e}.type must be one of ${G.join("|")}`),o.url!==void 0&&typeof o.url!="string"&&t.push(`${e}.url must be a string`),o.value!==void 0&&typeof o.value!="string"&&t.push(`${e}.value must be a string`)}function le(o){const e=[];if(!k(o))return{ok:!1,errors:["tour must be an object"]};if((typeof o.id!="string"||o.id.length===0)&&e.push("tour.id must be a non-empty string"),typeof o.schemaVersion!="number"&&e.push("tour.schemaVersion must be a number"),Y(o.title)||e.push('tour.title must be a localized text with a string "default"'),Array.isArray(o.steps)?o.steps.length===0?e.push("tour.steps must contain at least one step"):o.steps.forEach((t,n)=>{if(!k(t)){e.push(`steps[${n}] must be an object`);return}(typeof t.id!="string"||t.id.length===0)&&e.push(`steps[${n}].id must be a non-empty string`),(!Array.isArray(t.selectors)||t.selectors.length===0||!t.selectors.every(r=>typeof r=="string"&&r.length>0))&&e.push(`steps[${n}].selectors must be a non-empty array of non-empty strings`),Y(t.content)||e.push(`steps[${n}].content must be a localized text with a string "default"`),t.placement!==void 0&&!q.includes(t.placement)&&e.push(`steps[${n}].placement must be one of ${q.join("|")}`),t.pageUrl!==void 0&&J(t.pageUrl,`steps[${n}].pageUrl`,e),t.condition!==void 0&&X(t.condition,`steps[${n}].condition`,e),t.action!==void 0&&de(t.action,`steps[${n}].action`,e)}):e.push("tour.steps must be an array"),o.display!==void 0)if(!k(o.display))e.push("tour.display must be an object");else for(const t of["padding","radius","cardRadius"]){const n=o.display[t];n!==void 0&&(typeof n!="number"||n<0)&&e.push(`tour.display.${t} must be a non-negative number`)}return o.rules!==void 0&&(Array.isArray(o.rules)?o.rules.forEach((t,n)=>{if(!k(t)){e.push(`rules[${n}] must be an object`);return}t.tourId!==void 0&&typeof t.tourId!="string"&&e.push(`rules[${n}].tourId must be a string`),t.when===void 0?e.push(`rules[${n}].when is required`):X(t.when,`rules[${n}].when`,e)}):e.push("tour.rules must be an array")),e.length>0?{ok:!1,errors:e}:{ok:!0,tour:o}}const P=12;function ce(o){var te,ne,oe;const e=M("player");let t=null,n=null,r=null,i=null,d=!1,l=0;const v=((te=o.display)==null?void 0:te.padding)??j,x=((ne=o.display)==null?void 0:ne.radius)??F,C=((oe=o.display)==null?void 0:oe.cardRadius)??H;function N(a){for(const h of a.selectors)try{const p=document.querySelector(h);if(p)return p}catch{}return null}function z(){if(t)return;t=document.createElement("div"),t.setAttribute("data-tours-player",""),n=t.attachShadow({mode:"open"});const a=document.createElement("style");a.textContent=re,n.appendChild(a);const h=document.createElement("div");h.className="tours-backdrop",n.appendChild(h),r=document.createElement("div"),r.className="tours-spotlight",r.style.borderRadius=`${x}px`,n.appendChild(r),i=document.createElement("div"),i.className="tours-tooltip",i.style.borderRadius=`${C}px`,n.appendChild(i),document.body.appendChild(t)}function I(a){r&&(r.style.display="block",r.style.left=`${a.left-v}px`,r.style.top=`${a.top-v}px`,r.style.width=`${a.width+v*2}px`,r.style.height=`${a.height+v*2}px`)}function E(a,h){if(!i)return;const p=i.offsetWidth,m=i.offsetHeight,$=window.innerWidth,L=window.innerHeight;let g,b;const _=h??"bottom";switch(_){case"top":g=a.top-m-P,b=a.left+a.width/2-p/2;break;case"left":g=a.top+a.height/2-m/2,b=a.left-p-P;break;case"right":g=a.top+a.height/2-m/2,b=a.right+P;break;case"bottom":default:g=a.bottom+P,b=a.left+a.width/2-p/2;break}_==="bottom"&&g+m>L&&(g=a.top-m-P),b=Math.max(8,Math.min(b,$-p-8)),g=Math.max(8,Math.min(g,L-m-8)),i.style.left=`${b}px`,i.style.top=`${g}px`}function c(a){if(!i)return;const h=o.steps.length;i.textContent="";const p=document.createElement("button");p.className="tours-close",p.type="button",p.textContent="×",p.setAttribute("aria-label","Close"),p.addEventListener("click",S),i.appendChild(p);const m=document.createElement("p");m.className="tours-tooltip__content",m.textContent=a.content.default,i.appendChild(m);const $=document.createElement("div");$.className="tours-tooltip__footer";const L=document.createElement("span");L.className="tours-tooltip__progress",L.textContent=`Step ${l+1} of ${h}`,$.appendChild(L);const g=document.createElement("div");g.className="tours-tooltip__buttons";const b=document.createElement("button");b.className="tours-btn",b.type="button",b.textContent="Back",b.disabled=l===0,b.addEventListener("click",V),g.appendChild(b);const _=document.createElement("button");_.className="tours-btn tours-btn--primary",_.type="button",_.textContent=l===h-1?"Done":"Next",_.addEventListener("click",U),g.appendChild(_),$.appendChild(g),i.appendChild($)}function u(){if(!d)return;const a=o.steps[l];if(!a){S();return}e.log("render step",l,a.id);const h=N(a);if(!h){e.warn(`step "${a.id}" skipped: no element for selectors`,a.selectors),l<o.steps.length-1?(l+=1,u()):S();return}z(),h.scrollIntoView({behavior:"smooth",block:"center",inline:"center"}),c(a);const p=h.getBoundingClientRect();I(p),E(p,a.placement)}function f(a){d&&(a.key==="Escape"?(a.preventDefault(),S()):a.key==="ArrowRight"?U():a.key==="ArrowLeft"&&V())}function R(){if(!d)return;const a=o.steps[l];if(!a)return;const h=N(a);if(!h)return;const p=h.getBoundingClientRect();I(p),E(p,a.placement)}function he(){d||o.steps.length!==0&&(d=!0,l=0,e.log("start",o.id,`${o.steps.length} steps`),z(),window.addEventListener("keydown",f,!0),window.addEventListener("resize",R,!0),window.addEventListener("scroll",R,!0),u())}function S(){d&&(d=!1,e.log("stop"),window.removeEventListener("keydown",f,!0),window.removeEventListener("resize",R,!0),window.removeEventListener("scroll",R,!0),t&&t.parentNode&&t.parentNode.removeChild(t),t=null,n=null,r=null,i=null)}function U(){if(d){if(l>=o.steps.length-1){S();return}l+=1,u()}}function V(){d&&(l<=0||(l-=1,u()))}return{start:he,stop:S,next:U,prev:V}}const pe=`
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

/* ---------- Card preview (Display > Card) ---------- */
.card-preview {
  position: fixed;
  z-index: 2147483105;
  box-sizing: border-box;
  max-width: 260px;
  padding: 12px 14px;
  font-size: 13px;
  line-height: 1.5;
  color: var(--e-fg);
  background: #fff;
  border: 1px solid var(--e-border);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.22);
  pointer-events: none;
  display: none;
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
}
.settings__hint {
  font-size: 12px;
  line-height: 1.5;
  color: var(--e-muted);
}
`,Z={cursor:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m4 4 7 17 2.5-7L21 11.5 4 4Z"/></svg>',back:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>',menu:'<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></svg>',panelSide:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M15 4v16"/></svg>',navFlip:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18"/><path d="m7 8 5-5 5 5"/><path d="m7 16 5 5 5-5"/></svg>',build:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>',preview:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',close:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',trash:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>',bolt:'<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z"/></svg>',step:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 2"/></svg>'};let ue=0;function K(o){const e=typeof crypto<"u"&&"randomUUID"in crypto?crypto.randomUUID():`${ue++}`;return`${o}-${e}`}function D(o="step"){return{id:K("step"),type:o,included:!0,selectors:[],content:"",placement:"bottom",backLabel:"Back",nextLabel:"Next"}}function Q(){return{id:K("tour"),name:"Untitled tour",status:"draft",steps:[D()],display:{padding:j,radius:F,cardRadius:H}}}function ee(o){const e=o.steps.filter(n=>n.included&&n.selectors.length>0).map(n=>({id:n.id,selectors:n.selectors,content:{default:n.content},placement:n.placement})),t={id:o.id,schemaVersion:ae,title:{default:o.name},steps:e,display:{padding:o.display.padding,radius:o.display.radius,cardRadius:o.display.cardRadius}};return le(t)}function s(o,e={},t=[]){const n=document.createElement(o);for(const[r,i]of Object.entries(e))n.setAttribute(r,i);for(const r of t)n.append(typeof r=="string"?document.createTextNode(r):r);return n}function w(o,e,t=""){const n=s("button",{class:`iconbtn ${t}`.trim(),title:e,type:"button"});return n.innerHTML=Z[o]??"",n}class O{constructor(e={}){var t;this.options=e,this.log=M("editor"),this.host=null,this.root=null,this.tour=Q(),this.activeStepId=((t=this.tour.steps[0])==null?void 0:t.id)??null,this.tab="steps",this.displaySub="tour",this.mode="build",this.picker=null,this.picking=!1,this.player=null,this.highlight=null,this.cardPreview=null,this.focusStepId=null,this.onViewportChange=()=>this.updateOverlays(),this.navPosition=e.navPosition??"bottom",this.panelPosition=e.panelPosition??"right"}static fromUrl(e={}){const t=e.urlFlag??"tours-edit",n=new URLSearchParams(window.location.search).get(t);if(n===null||n==="0"||n==="false")return null;const r=new O(e);return r.mount(),r}mount(){if(this.host||this.options.mode==="off")return;this.host=s("div",{"data-tours-editor":""}),this.root=this.host.attachShadow({mode:"open"});const e=document.createElement("style");e.textContent=pe,this.root.appendChild(e),this.highlight=s("div",{class:"highlight"}),this.cardPreview=s("div",{class:"card-preview"},["Step tooltip preview"]),this.root.append(this.highlight,this.cardPreview),document.body.appendChild(this.host),window.addEventListener("scroll",this.onViewportChange,!0),window.addEventListener("resize",this.onViewportChange,!0),this.log.log("mounted"),this.render()}destroy(){var e,t;this.stopPicking(),(e=this.player)==null||e.stop(),this.player=null,window.removeEventListener("scroll",this.onViewportChange,!0),window.removeEventListener("resize",this.onViewportChange,!0),(t=this.host)!=null&&t.parentNode&&this.host.parentNode.removeChild(this.host),this.host=null,this.root=null,this.highlight=null,this.cardPreview=null}export(){return ee(this.tour)}get activeStep(){return this.tour.steps.find(e=>e.id===this.activeStepId)??null}setActive(e){this.activeStepId!==e&&(this.activeStepId=e,this.render())}addStepAfter(e,t="step"){const n=D(t);this.tour.steps.splice(e+1,0,n),this.activeStepId=n.id,this.render()}removeStep(e){var n;const t=this.tour.steps.findIndex(r=>r.id===e);t!==-1&&(this.tour.steps.splice(t,1),this.activeStepId===e&&(this.activeStepId=((n=this.tour.steps[Math.max(0,t-1)])==null?void 0:n.id)??null),this.render())}togglePicking(){if(this.picking){this.stopPicking();return}const e=this.activeStep;e&&(this.picking=!0,this.picker=se(t=>{e.selectors=t,this.picking=!1,this.picker=null,this.log.log("bound selector to step",e.id,t),this.render()},{ignore:[this.host]}),this.picker.start(),this.render())}stopPicking(){var e;(e=this.picker)==null||e.stop(),this.picker=null,this.picking=!1}togglePreview(){var t;if(this.mode==="preview"){(t=this.player)==null||t.stop(),this.player=null,this.mode="build",this.render();return}const e=this.export();if(!e.ok){this.log.warn("cannot preview — draft is invalid",e.errors),window.alert(`Add a selector and text to at least one step first:

${e.errors.join(`
`)}`);return}this.mode="preview",this.render(),this.player=ce(e.tour),this.player.start()}render(){this.root&&(this.root.querySelectorAll(".panel, .nav").forEach(e=>e.remove()),this.mode==="build"&&this.root.appendChild(this.renderPanel()),this.root.appendChild(this.renderNav()),this.focusStepId&&(this.focusContent(this.focusStepId),this.focusStepId=null),this.updateOverlays())}resolveTarget(e){for(const t of e.selectors)try{const n=document.querySelector(t);if(n)return n}catch{}return null}updateOverlays(){const e=this.highlight,t=this.cardPreview;if(!e||!t)return;const n=()=>{e.style.display="none",t.style.display="none"};if(this.mode!=="build"||this.picking)return n();const r=this.activeStep,i=r&&r.selectors.length>0?this.resolveTarget(r):null;if(!i)return n();const d=i.getBoundingClientRect(),{padding:l,radius:v,cardRadius:x}=this.tour.display;e.className=`highlight ${this.tab==="display"?"highlight--settings":""}`.trim(),e.style.display="block",e.style.left=`${d.left-l}px`,e.style.top=`${d.top-l}px`,e.style.width=`${d.width+l*2}px`,e.style.height=`${d.height+l*2}px`,e.style.borderRadius=`${v}px`,this.tab==="display"&&this.displaySub==="card"?(t.style.display="block",t.style.borderRadius=`${x}px`,t.style.left=`${Math.max(8,d.left-l)}px`,t.style.top=`${d.bottom+l+10}px`):t.style.display="none"}renderNav(){const e=s("div",{class:`nav nav--${this.navPosition}`}),t=w("build","Build",this.mode==="build"?"iconbtn--active":"");t.addEventListener("click",()=>{this.mode==="preview"&&this.togglePreview()});const n=w("preview","Preview",this.mode==="preview"?"iconbtn--active":"");n.addEventListener("click",()=>this.togglePreview());const r=w("navFlip","Move bar (top/bottom)");r.addEventListener("click",()=>{this.navPosition=this.navPosition==="bottom"?"top":"bottom",this.render()});const i=w("close","Close builder");return i.addEventListener("click",()=>this.destroy()),e.append(t,n,s("div",{class:"nav__sep"}),r,i),e}renderPanel(){const e=s("div",{class:`panel panel--${this.panelPosition}`});return e.append(this.renderHeader(),this.renderToolbar(),this.renderTabs(),this.renderBody()),e}renderHeader(){const e=s("div",{class:"panel__header"}),t=s("input",{class:"panel__title",value:this.tour.name});t.value=this.tour.name,t.addEventListener("change",()=>{this.tour.name=t.value.trim()||"Untitled tour"});const n=s("span",{class:`status status--${this.tour.status}`},[this.tour.status]);n.addEventListener("click",()=>{this.tour.status=this.tour.status==="draft"?"published":"draft",this.render()}),n.setAttribute("title","Toggle status"),n.style.cursor="pointer";const r=w("menu","Tour menu");return r.addEventListener("click",()=>this.openMenu()),e.append(t,n,r),e}renderToolbar(){const e=s("div",{class:"panel__toolbar"}),t=w("back","Back to tours");t.addEventListener("click",()=>this.log.log("back to tour list (list view TODO)"));const n=w("panelSide","Move panel (left/right)");n.addEventListener("click",()=>{this.panelPosition=this.panelPosition==="right"?"left":"right",this.render()});const r=w("cursor",this.picking?"Cancel picking":"Pick element for active step",this.picking?"iconbtn--active":"");return r.addEventListener("click",()=>this.togglePicking()),e.append(t,s("div",{class:"spacer"}),n,r),e}renderTabs(){const e=s("div",{class:"tabs"});for(const[t,n]of[["steps","Steps"],["display","Display"],["assets","Assets"]]){const r=s("button",{class:`tab ${this.tab===t?"tab--active":""}`,type:"button"},[n]);r.addEventListener("click",()=>{this.tab=t,t==="display"&&this.selectFirstResolvableStep(),this.render()}),e.append(r)}return e}selectFirstResolvableStep(){const e=this.tour.steps.find(t=>this.resolveTarget(t)!==null);e&&(this.activeStepId=e.id)}renderDisplaySettings(){const e=s("div",{class:"settings"}),t=s("div",{class:"subtabs"});for(const[r,i]of[["tour","Tour"],["card","Card"]]){const d=s("button",{class:`subtab ${this.displaySub===r?"subtab--active":""}`,type:"button"},[i]);d.addEventListener("click",()=>{this.displaySub=r,this.render()}),t.append(d)}if(e.append(t),!this.activeStep||!this.resolveTarget(this.activeStep))return e.append(s("div",{class:"assets-empty"},["Give a step a selector first — then its target frames here so you can tune the look."])),e;const n=this.tour.display;return this.displaySub==="tour"?e.append(this.slider("Outline spacing",n.padding,0,40,r=>n.padding=r),this.slider("Outline corner radius",n.radius,0,40,r=>n.radius=r),s("div",{class:"settings__hint"},["The outline framing the target — applied in the builder and in the live tour spotlight."])):e.append(this.slider("Card corner radius",n.cardRadius,0,32,r=>n.cardRadius=r),s("div",{class:"settings__hint"},["The visitor tooltip card. Preview it beside the highlighted target."])),e}slider(e,t,n,r,i){const d=s("span",{class:"settings__value"},[`${t}px`]),l=s("input",{class:"settings__slider",type:"range",min:String(n),max:String(r),step:"1"});l.value=String(t),l.addEventListener("input",()=>{const C=Number(l.value);i(C),d.textContent=`${C}px`,this.updateOverlays()});const v=s("div",{class:"settings__row"});v.append(l,d);const x=s("div",{class:"settings__field"});return x.append(s("label",{class:"settings__label"},[e]),v),x}renderBody(){const e=s("div",{class:"panel__body"});if(this.tab==="assets")return e.append(s("div",{class:"assets-empty"},["Assets — coming soon"])),e;if(this.tab==="display")return e.append(this.renderDisplaySettings()),e;const t=s("div",{class:"steps"});return t.append(this.renderConnector(-1)),this.tour.steps.forEach((n,r)=>{t.append(this.renderCard(n,r)),t.append(this.renderConnector(r))}),e.append(t),e}renderConnector(e){const t=s("div",{class:"connector"}),n=s("button",{class:"connector__add",title:"Add step",type:"button"},["+"]);return n.addEventListener("click",()=>this.addStepAfter(e)),t.append(s("div",{class:"connector__line"}),n,s("div",{class:"connector__line"})),t}renderCard(e,t){const n=e.id===this.activeStepId,r=s("div",{class:`card ${n?"card--active":""} ${e.included?"":"card--excluded"}`.trim()});return r.addEventListener("mousedown",()=>this.setActive(e.id)),r.append(this.renderCardControl(e,t),this.renderCardContent(e),this.renderCardFooter(e)),r}renderCardControl(e,t){const n=s("div",{class:"card__control"}),r=s("input",{class:"card__check",type:"checkbox",title:"Include in tour"});r.checked=e.included,r.addEventListener("change",()=>{e.included=r.checked,this.render()});const i=s("span",{class:"card__index"},[String(t+1)]),d=s("span",{class:"card__type"});d.innerHTML=Z[e.type==="action"?"bolt":"step"],d.append(document.createTextNode(e.type==="action"?"Action":"Step"));const l=e.selectors[0],v=s("span",{class:`card__sel ${l?"":"card__sel--empty"}`.trim(),title:l??""},[l??"no selector"]),x=w("trash","Delete step");return x.addEventListener("click",()=>this.removeStep(e.id)),n.append(r,i,d,s("div",{class:"spacer"}),v,x),n}renderCardContent(e){const t=s("div",{class:"card__content",contenteditable:"true","data-placeholder":"Write the step text…","data-step":e.id});return t.textContent=e.content,t.addEventListener("input",()=>{e.content=t.textContent??""}),t.addEventListener("mousedown",()=>{this.activeStepId!==e.id&&(this.focusStepId=e.id)}),t}renderCardFooter(e){const t=s("div",{class:"card__footer"});return t.append(this.renderEditableButton(e,"backLabel"),this.renderEditableButton(e,"nextLabel")),t}renderEditableButton(e,t){const n=s("button",{class:"cardbtn",type:"button"},[e[t]]);return n.addEventListener("click",r=>{r.stopPropagation();const i=s("input",{class:"cardbtn cardbtn--edit",value:e[t]});i.value=e[t],n.replaceWith(i),i.focus(),i.select();const d=()=>{e[t]=i.value.trim()||(t==="backLabel"?"Back":"Next"),i.replaceWith(this.renderEditableButton(e,t))};i.addEventListener("blur",d),i.addEventListener("keydown",l=>{l.key==="Enter"&&i.blur(),l.key==="Escape"&&(i.value=e[t],i.blur())})}),n}openMenu(){const e=this.export(),t=e.ok?JSON.stringify(e.tour,null,2):`INVALID:
${e.errors.join(`
`)}`;this.log.log("tour JSON",t),window.prompt("Tour JSON (copy):",e.ok?JSON.stringify(e.tour):"")}focusContent(e){var i;const t=(i=this.root)==null?void 0:i.querySelector(`.card__content[data-step="${e}"]`);if(!t)return;t.focus();const n=document.createRange();n.selectNodeContents(t),n.collapse(!1);const r=window.getSelection();r==null||r.removeAllRanges(),r==null||r.addRange(n)}}y.TourBuilder=O,y.createDraftStep=D,y.createDraftTour=Q,y.toTour=ee,Object.defineProperty(y,Symbol.toStringTag,{value:"Module"})}));
//# sourceMappingURL=tours-editor.umd.js.map
