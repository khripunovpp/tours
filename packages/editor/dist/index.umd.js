(function(y,A){typeof exports=="object"&&typeof module<"u"?A(exports):typeof define=="function"&&define.amd?define(["exports"],A):(y=typeof globalThis<"u"?globalThis:y||self,A(y.ToursEditor={}))})(this,(function(y){"use strict";const A=`
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
`,$e=`
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
`;function J(r){return JSON.stringify(r)}function Ce(r){return/^[a-zA-Z][\w-]*$/.test(r)&&r.length<=30&&!/\d{2,}/.test(r)&&!/^(css-|sc-|jsx-|emotion-|_|is-|has-)/.test(r)}function ne(r){const e=[];let t=r;for(;t&&t!==document.body&&t.nodeType===1;){const n=t.tagName.toLowerCase(),i=t.parentElement;if(!i){e.unshift(n);break}const o=Array.from(i.children).filter(s=>s.tagName===t.tagName);e.unshift(o.length>1?`${n}:nth-of-type(${o.indexOf(t)+1})`:n),t=i}return`body > ${e.join(" > ")}`}function Le(r){let e=r.parentElement;for(;e&&e!==document.body&&!e.id;)e=e.parentElement;if(!e||!e.id)return null;const t=[];let n=r;for(;n&&n!==e;){const i=n.tagName.toLowerCase(),o=n.parentElement;if(!o)return null;const s=Array.from(o.children).filter(l=>l.tagName===n.tagName);t.unshift(s.length>1?`${i}:nth-of-type(${s.indexOf(n)+1})`:i),n=o}return`#${CSS.escape(e.id)} > ${t.join(" > ")}`}const Te=["data-testid","data-test","data-test-id","data-cy","data-qa","data-id","data-name"];function Pe(r){const e=[],t=new Set,n=r.tagName.toLowerCase(),i=d=>{if(!(!d||t.has(d)))try{document.querySelector(d)===r&&(t.add(d),e.push(d))}catch{}};r.id&&i(`#${CSS.escape(r.id)}`);for(const d of Te){const u=r.getAttribute(d);u&&i(`${n}[${d}=${J(u)}]`)}const o=r.getAttribute("name");o&&i(`${n}[name=${J(o)}]`);const s=r.getAttribute("aria-label");s&&i(`[aria-label=${J(s)}]`);const l=Array.from(r.classList).filter(Ce);l.length&&i(`${n}.${l.map(d=>CSS.escape(d)).join(".")}`);for(const d of l)i(`${n}.${CSS.escape(d)}`);i(Le(r)),i(ne(r));const c=(r.textContent??"").replace(/\s+/g," ").trim();if(c&&c.length<=50&&/^(a|button|summary|label|h[1-6])$/.test(n)){const d=`text=${c}`;t.has(d)||(t.add(d),e.push(d))}return e.length===0&&e.push(ne(r)),e}const Ae="a, button, summary, label, h1, h2, h3, h4, h5, h6";function Oe(r,e){if(r.startsWith("text=")){const t=r.slice(5).trim();for(const n of Array.from(e.querySelectorAll(Ae)))if((n.textContent??"").replace(/\s+/g," ").trim()===t)return n;return null}try{return e.querySelector(r)}catch{return null}}function M(r,e=document){for(const t of r){const n=Oe(t,e);if(n)return n}return null}function Ne(r,e={}){const t=e.root??document,n=M(r,t);return n?Promise.resolve(n):new Promise(i=>{let o=!1,s;const l=u=>{o||(o=!0,c.disconnect(),s&&clearTimeout(s),i(u))},c=new MutationObserver(()=>{const u=M(r,t);u&&l(u)});c.observe(document.documentElement,{childList:!0,subtree:!0,attributes:!0});const d=e.timeout??4e3;d>0&&Number.isFinite(d)&&(s=setTimeout(()=>l(null),d))})}let O=null;function Y(){if(O!==null)return O;try{O=new URLSearchParams(window.location.search).has("use_logs")}catch{O=!1}return O}function q(r){const e=`[tours:${r}]`;return{log:(...t)=>{Y()&&console.log(e,...t)},warn:(...t)=>{Y()&&console.warn(e,...t)},error:(...t)=>{Y()&&console.error(e,...t)}}}function Re(r,e={}){const t=q("picker");let n=null,i=null,o=null,s=!1;function l(h){if(h===n)return!0;for(const m of e.ignore??[])if(m&&m.contains(h))return!0;return!1}function c(){if(n)return;n=document.createElement("div"),n.setAttribute("data-tours-picker",""),i=n.attachShadow({mode:"open"});const h=document.createElement("style");h.textContent=A,i.appendChild(h),o=document.createElement("div"),o.className="tours-picker-overlay",o.style.display="none",i.appendChild(o);const m=document.createElement("div");m.className="tours-picker-hint",m.textContent="Hover and click an element • Esc to cancel",i.appendChild(m),document.body.appendChild(n)}function d(h,m){const x=document.elementFromPoint(h,m);return!x||l(x)?null:x}function u(h){if(!s||!o)return;const m=d(h.clientX,h.clientY);if(!m){o.style.display="none";return}const x=m.getBoundingClientRect();o.style.display="block",o.style.left=`${x.left}px`,o.style.top=`${x.top}px`,o.style.width=`${x.width}px`,o.style.height=`${x.height}px`}function f(h){if(!s)return;const m=d(h.clientX,h.clientY);if(h.preventDefault(),h.stopPropagation(),!m)return;const x=Pe(m);t.log("picked",x),S(),r(x)}function b(h){h.key==="Escape"&&(h.preventDefault(),S())}function R(){s||(s=!0,t.log("start"),c(),document.addEventListener("mousemove",u,!0),document.addEventListener("click",f,!0),document.addEventListener("keydown",b,!0))}function S(){s&&(s=!1,document.removeEventListener("mousemove",u,!0),document.removeEventListener("click",f,!0),document.removeEventListener("keydown",b,!0),n&&n.parentNode&&n.parentNode.removeChild(n),n=null,i=null,o=null)}return{start:R,stop:S}}const z=6,D=6,B=10,F=12,Ie=1;function $(r){return typeof r=="object"&&r!==null&&!Array.isArray(r)}function re(r){return $(r)&&typeof r.default=="string"}const ie=["top","bottom","left","right","auto"],oe=["start","center","end"],se=["mobile","tablet","desktop"],ae=["click","input","navigate","none"];function de(r,e,t){if(!$(r)){t.push(`${e} must be an object`);return}const n=typeof r.glob=="string"&&r.glob.length>0,i=typeof r.regex=="string"&&r.regex.length>0;if(!n&&!i&&t.push(`${e} must have a non-empty "glob" or "regex"`),i)try{new RegExp(r.regex)}catch{t.push(`${e}.regex is not a valid regular expression`)}}function le(r,e,t){if(!$(r)){t.push(`${e} must be an object`);return}r.url!==void 0&&de(r.url,`${e}.url`,t),r.role!==void 0&&typeof r.role!="string"&&t.push(`${e}.role must be a string`),r.firstVisitOnly!==void 0&&typeof r.firstVisitOnly!="boolean"&&t.push(`${e}.firstVisitOnly must be a boolean`),r.device!==void 0&&!se.includes(r.device)&&t.push(`${e}.device must be one of ${se.join("|")}`),r.unlessSeen!==void 0&&typeof r.unlessSeen!="boolean"&&t.push(`${e}.unlessSeen must be a boolean`),r.maxShows!==void 0&&(typeof r.maxShows!="number"||r.maxShows<0)&&t.push(`${e}.maxShows must be a non-negative number`)}function Me(r,e,t){if(!$(r)){t.push(`${e} must be an object`);return}ae.includes(r.type)||t.push(`${e}.type must be one of ${ae.join("|")}`),r.url!==void 0&&typeof r.url!="string"&&t.push(`${e}.url must be a string`),r.value!==void 0&&typeof r.value!="string"&&t.push(`${e}.value must be a string`)}function ze(r){const e=[];if(!$(r))return{ok:!1,errors:["tour must be an object"]};if((typeof r.id!="string"||r.id.length===0)&&e.push("tour.id must be a non-empty string"),typeof r.schemaVersion!="number"&&e.push("tour.schemaVersion must be a number"),re(r.title)||e.push('tour.title must be a localized text with a string "default"'),Array.isArray(r.steps)?r.steps.length===0?e.push("tour.steps must contain at least one step"):r.steps.forEach((t,n)=>{if(!$(t)){e.push(`steps[${n}] must be an object`);return}(typeof t.id!="string"||t.id.length===0)&&e.push(`steps[${n}].id must be a non-empty string`),(!Array.isArray(t.selectors)||t.selectors.length===0||!t.selectors.every(i=>typeof i=="string"&&i.length>0))&&e.push(`steps[${n}].selectors must be a non-empty array of non-empty strings`),re(t.content)||e.push(`steps[${n}].content must be a localized text with a string "default"`),t.placement!==void 0&&!ie.includes(t.placement)&&e.push(`steps[${n}].placement must be one of ${ie.join("|")}`),t.align!==void 0&&!oe.includes(t.align)&&e.push(`steps[${n}].align must be one of ${oe.join("|")}`),t.backLabel!==void 0&&typeof t.backLabel!="string"&&e.push(`steps[${n}].backLabel must be a string`),t.nextLabel!==void 0&&typeof t.nextLabel!="string"&&e.push(`steps[${n}].nextLabel must be a string`),t.pageUrl!==void 0&&de(t.pageUrl,`steps[${n}].pageUrl`,e),t.condition!==void 0&&le(t.condition,`steps[${n}].condition`,e),t.action!==void 0&&Me(t.action,`steps[${n}].action`,e)}):e.push("tour.steps must be an array"),r.trigger!==void 0){const t=r.trigger,n=["manual","load","selector","timer","cta"],i=["bottom-right","bottom-left","top-right","top-left"];!$(t)||typeof t.type!="string"||!n.includes(t.type)?e.push(`tour.trigger.type must be one of ${n.join("|")}`):t.type==="selector"&&(typeof t.selector!="string"||t.selector.length===0)?e.push("tour.trigger.selector must be a non-empty string"):t.type==="timer"&&(typeof t.delay!="number"||t.delay<0)?e.push("tour.trigger.delay must be a non-negative number"):t.type==="cta"&&(typeof t.text!="string"&&e.push("tour.trigger.text must be a string"),typeof t.button!="string"&&e.push("tour.trigger.button must be a string"),i.includes(t.corner)||e.push(`tour.trigger.corner must be one of ${i.join("|")}`),t.offset!==void 0&&(typeof t.offset!="number"||t.offset<0)&&e.push("tour.trigger.offset must be a non-negative number"))}if(r.audience!==void 0&&!["all","auth","guest"].includes(r.audience)&&e.push("tour.audience must be one of all|auth|guest"),r.display!==void 0)if(!$(r.display))e.push("tour.display must be an object");else for(const t of["padding","radius","cardRadius","offset","alignOffset"]){const n=r.display[t];n!==void 0&&(typeof n!="number"||n<0)&&e.push(`tour.display.${t} must be a non-negative number`)}return r.rules!==void 0&&(Array.isArray(r.rules)?r.rules.forEach((t,n)=>{if(!$(t)){e.push(`rules[${n}] must be an object`);return}t.tourId!==void 0&&typeof t.tourId!="string"&&e.push(`rules[${n}].tourId must be a string`),t.when===void 0?e.push(`rules[${n}].when is required`):le(t.when,`rules[${n}].when`,e)}):e.push("tour.rules must be an array")),e.length>0?{ok:!1,errors:e}:{ok:!0,tour:r}}function De(r,e,t){const n={top:r.top,bottom:t.height-r.bottom,left:r.left,right:t.width-r.right},i={top:e.height,bottom:e.height,left:e.width,right:e.width},o=["bottom","top","right","left"],s=o.find(l=>n[l]>=i[l]+8);return s||o.reduce((l,c)=>n[c]>n[l]?c:l,o[0])}function ce(r){const{target:e,card:t,offset:n,viewport:i}=r,o=r.side==="auto",s=o?De(e,t,i):r.side,l=o?"center":r.align,c=r.alignOffset??0,d=l==="start"?c:l==="end"?-c:0;let u=0,f=0;return s==="top"||s==="bottom"?(u=s==="top"?e.top-t.height-n:e.bottom+n,f=l==="start"?e.left:l==="end"?e.right-t.width:e.left+e.width/2-t.width/2,f+=d):(f=s==="left"?e.left-t.width-n:e.right+n,u=l==="start"?e.top:l==="end"?e.bottom-t.height:e.top+e.height/2-t.height/2,u+=d),f=Math.max(8,Math.min(f,i.width-t.width-8)),u=Math.max(8,Math.min(u,i.height-t.height-8)),{top:u,left:f}}function pe(r){const e=document.createElement("button");return e.type="button",e.className=`tours-card__btn${r.primary?" tours-card__btn--primary":""}${r.disabled?" tours-card__btn--disabled":""}`,e.textContent=r.label,!r.disabled&&r.onClick&&e.addEventListener("click",r.onClick),e}function ue(r){const e=document.createElement("div");if(e.className=`tours-card${r.ghost?" tours-card--ghost":""}`,r.radius!=null&&(e.style.borderRadius=`${r.radius}px`),r.showClose){const n=document.createElement("button");n.className="tours-card__close",n.type="button",n.textContent="×",n.setAttribute("aria-label","Close"),r.onClose&&n.addEventListener("click",r.onClose),e.appendChild(n)}const t=document.createElement("div");if(t.className="tours-card__content",r.contentHtml!=null?t.innerHTML=r.contentHtml:t.textContent=r.contentText??"",e.appendChild(t),r.back||r.next||r.progress){const n=document.createElement("div");if(n.className="tours-card__footer",r.back&&n.appendChild(pe(r.back)),r.progress){const i=document.createElement("span");i.className="tours-card__progress",i.textContent=r.progress,n.appendChild(i)}r.next&&n.appendChild(pe(r.next)),e.appendChild(n)}return e}const he=`
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
`;function Be(r){const e=r.replace(/[.+^${}()|[\]\\]/g,"\\$&").replace(/\*\*/g,"\0").replace(/\*/g,"[^/]*").replace(/ /g,".*").replace(/\?/g,".");return new RegExp(`^${e}$`)}function U(r,e){if(!r)return!0;if(r.regex)try{return new RegExp(r.regex).test(e)}catch{return!1}if(r.glob)try{return Be(r.glob).test(e)}catch{return!1}return!0}function fe(r){if(!r||!r.glob)return null;const e=r.glob.replace(/\*+/g,"");return/^https?:\/\//i.test(e)||e.startsWith("#")||e.startsWith("/")?e:null}const X="tours:locationchange";let ge=!1;function Fe(){if(!ge){ge=!0;for(const r of["pushState","replaceState"]){const e=history[r];history[r]=function(...n){const i=e.apply(this,n);return window.dispatchEvent(new Event(X)),i}}}}function Ue(r){return Fe(),window.addEventListener("popstate",r),window.addEventListener("hashchange",r),window.addEventListener(X,r),()=>{window.removeEventListener("popstate",r),window.removeEventListener("hashchange",r),window.removeEventListener(X,r)}}const be="tours:progress";function je(r,e){r.set(be,JSON.stringify(e))}function Ve(r){r.remove(be)}function He(r,e={}){const t=q("player"),n=e.state;let i=null,o=null,s=null,l=null,c=!1,d=0,u=0,f=null;const b=r.display?.padding??z,R=r.display?.radius??D,S=r.display?.cardRadius??B,h=r.display?.offset??F;function m(p){return M(p.selectors)}function x(p){return U(p.pageUrl,window.location.href)}function I(){n&&je(n,{tourId:r.id,index:d})}function we(){if(i)return;i=document.createElement("div"),i.setAttribute("data-tours-player",""),o=i.attachShadow({mode:"open"});const p=document.createElement("style");p.textContent=$e+he,o.appendChild(p);const g=document.createElement("div");g.className="tours-backdrop",g.addEventListener("click",v=>{const w=r.steps[d],E=w?m(w):null;if(E){const L=E.getBoundingClientRect();if(v.clientX>=L.left-b&&v.clientX<=L.right+b&&v.clientY>=L.top-b&&v.clientY<=L.bottom+b)return}C()}),o.appendChild(g),s=document.createElement("div"),s.className="tours-spotlight",s.style.borderRadius=`${R}px`,o.appendChild(s),document.body.appendChild(i)}function ke(p,g=!1){s&&(s.style.transitionDuration=g?"0ms":"",s.style.display="block",s.style.left=`${p.left-b}px`,s.style.top=`${p.top-b}px`,s.style.width=`${p.width+b*2}px`,s.style.height=`${p.height+b*2}px`)}function _e(p,g){if(!l)return;const v={top:p.top-b,left:p.left-b,right:p.right+b,bottom:p.bottom+b,width:p.width+b*2,height:p.height+b*2},{top:w,left:E}=ce({target:v,card:{width:l.offsetWidth,height:l.offsetHeight},side:g.placement??"bottom",align:g.align??"center",offset:h,alignOffset:r.display?.alignOffset??0,viewport:{width:window.innerWidth,height:window.innerHeight}});l.style.left=`${E}px`,l.style.top=`${w}px`}function Qe(p){const g=Math.max(1,r.steps.length-u),v=Math.max(1,Math.min(d+1-u,g));l&&l.remove(),l=ue({contentText:p.content.default,progress:`Step ${v} of ${g}`,showClose:!0,onClose:C,radius:S,back:{label:p.backLabel??"Back",disabled:d===0,onClick:te},next:{label:p.nextLabel??(d===g-1?"Done":"Next"),primary:!0,onClick:ee}}),o?.appendChild(l)}function P(){if(!c)return;const p=r.steps[d];if(!p){C();return}t.log("render step",d,p.id);const g=m(p);if(!g){t.log(`step "${p.id}" target not found yet — waiting`,p.selectors),Ne(p.selectors,{timeout:4e3}).then(w=>{!c||r.steps[d]!==p||(w?P():(t.warn(`step "${p.id}" skipped: no element for selectors`,p.selectors),u+=1,d<r.steps.length-1?(d+=1,P()):C()))});return}we(),g.scrollIntoView({behavior:"smooth",block:"center",inline:"center"}),Qe(p);const v=g.getBoundingClientRect();ke(v),_e(v,p)}function Se(p){c&&(p.key==="Escape"?(p.preventDefault(),C()):p.key==="ArrowRight"?ee():p.key==="ArrowLeft"&&te())}function H(){if(!c)return;const p=r.steps[d];if(!p)return;const g=m(p);if(!g)return;const v=g.getBoundingClientRect();ke(v,!0),_e(v,p)}function et(p=0){c||r.steps.length!==0&&(c=!0,d=Math.max(0,Math.min(p,r.steps.length-1)),u=0,t.log("start",r.id,`at ${d}/${r.steps.length}`),we(),window.addEventListener("keydown",Se,!0),window.addEventListener("resize",H,!0),window.addEventListener("scroll",H,!0),I(),P())}function tt(){s&&(s.style.display="none"),l&&(l.remove(),l=null)}function W(){tt(),!f&&(f=Ue(()=>{if(!c){f?.(),f=null;return}const p=r.steps[d];p&&x(p)&&(f?.(),f=null,P())}))}function Ee(){f&&(f(),f=null),c&&(c=!1,window.removeEventListener("keydown",Se,!0),window.removeEventListener("resize",H,!0),window.removeEventListener("scroll",H,!0),i&&i.parentNode&&i.parentNode.removeChild(i),i=null,o=null,s=null,l=null)}function C(){t.log("stop"),Ee(),n&&Ve(n)}function ee(){if(!c)return;const p=d+1,g=r.steps[p];if(!g){C();return}if(x(g)){d=p,I(),P();return}d=p,I();const v=L=>{Ee(),e.onNavigate?e.onNavigate(L,g.id):window.location.assign(L)},w=r.steps[d-1]?.action;if(w&&w.type==="navigate"&&w.url){w.url.startsWith("#")?(t.log("page transition (hash navigate) → resume at",d),W(),window.location.hash=w.url):(t.log("page transition (navigate) → resume at",d),v(w.url));return}const E=fe(g.pageUrl);if(E){E.startsWith("#")?(t.log("page transition (derived hash) → resume at",d),W(),window.location.hash=E):(t.log("page transition (derived navigate) → resume at",d,E),v(E));return}t.log("page transition (wait) → resume at",d),W()}function te(){if(!c)return;const p=r.steps[d-1];if(p){if(x(p)){d-=1,I(),P();return}d-=1,I(),t.log("page transition back → resume at",d),W(),window.history.back()}}return{start:et,stop:C,next:ee,prev:te}}const We=`
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
`,G={cursor:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m4 4 7 17 2.5-7L21 11.5 4 4Z"/></svg>',back:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>',chevron:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>',menu:'<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></svg>',panelSide:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M15 4v16"/></svg>',navFlip:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18"/><path d="m7 8 5-5 5 5"/><path d="m7 16 5 5 5-5"/></svg>',build:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>',preview:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',close:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',trash:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>',bolt:'<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z"/></svg>',step:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 2"/></svg>',download:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/></svg>',upload:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M17 8l-5-5-5 5"/><path d="M12 3v12"/></svg>'};let Je=0;function T(r){const e=typeof crypto<"u"&&"randomUUID"in crypto?crypto.randomUUID():`${Je++}`;return`${r}-${e}`}function N(r="step"){return{id:T("step"),type:r,included:!0,selectors:[],content:"",page:"",placement:"auto",align:"center",backLabel:"Back",nextLabel:"Next"}}function j(r="tour"){return{id:T(r),kind:r,name:r==="template"?"Untitled template":"Untitled tour",status:"draft",trigger:{type:"manual"},audience:"all",conditions:{firstVisitOnly:!0,maxShows:0,device:"any"},steps:[N()],display:{padding:z,radius:D,cardRadius:B,offset:F,alignOffset:0}}}function K(r,e,t){return{id:T(e),kind:e,name:t??r.name,status:"draft",trigger:{...r.trigger},audience:r.audience,conditions:{...r.conditions},steps:r.steps.map(n=>({...n,id:T("step"),selectors:[...n.selectors]})),display:{...r.display}}}function me(r){if(r&&typeof r=="object"){const e=r;if(e.type==="load")return{type:"load"};if(e.type==="selector"&&typeof e.selector=="string")return{type:"selector",selector:e.selector};if(e.type==="timer"&&typeof e.delay=="number")return{type:"timer",delay:e.delay};if(e.type==="cta"&&typeof e.text=="string"&&typeof e.button=="string"){const t=["bottom-right","bottom-left","top-right","top-left"];return{type:"cta",text:e.text,button:e.button,corner:t.includes(e.corner)?e.corner:"bottom-right",offset:typeof e.offset=="number"?e.offset:void 0}}}return{type:"manual"}}function V(r){if(!Array.isArray(r))return[];const e=[];for(const t of r){if(!t||typeof t!="object")continue;const n=t;typeof n.id!="string"||!Array.isArray(n.steps)||e.push({id:n.id,kind:n.kind==="template"?"template":"tour",name:typeof n.name=="string"?n.name:"Untitled tour",status:n.status==="published"?"published":"draft",trigger:me(n.trigger),audience:n.audience==="auth"||n.audience==="guest"?n.audience:"all",conditions:{firstVisitOnly:(n.conditions?.firstVisitOnly??!0)===!0,maxShows:k(n.conditions?.maxShows,0),device:["mobile","tablet","desktop"].includes(n.conditions?.device)?n.conditions.device:"any"},display:{padding:k(n.display?.padding,z),radius:k(n.display?.radius,D),cardRadius:k(n.display?.cardRadius,B),offset:k(n.display?.offset,F),alignOffset:k(n.display?.alignOffset,0)},steps:n.steps.filter(i=>!!i&&typeof i=="object").map(i=>({...N(i.type==="action"?"action":"step"),...i}))})}return e}function k(r,e){return typeof r=="number"&&r>=0?r:e}function ve(r){const e=r.steps.filter(i=>i.included&&i.selectors.length>0).map(i=>({id:i.id,selectors:i.selectors,content:{default:i.content},placement:i.placement,align:i.align,backLabel:i.backLabel,nextLabel:i.nextLabel,...i.page?{pageUrl:{glob:i.page}}:{},...i.action?{action:i.action}:{}})),t={};r.conditions.firstVisitOnly&&(t.firstVisitOnly=!0),r.conditions.maxShows>0&&(t.maxShows=r.conditions.maxShows),r.conditions.device!=="any"&&(t.device=r.conditions.device);const n=Object.keys(t).length>0?[{when:t}]:void 0;return{id:r.id,schemaVersion:Ie,title:{default:r.name},steps:e,trigger:r.trigger,audience:r.audience,...n?{rules:n}:{},display:{padding:r.display.padding,radius:r.display.radius,cardRadius:r.display.cardRadius,offset:r.display.offset,alignOffset:r.display.alignOffset}}}function xe(r){return ze(ve(r))}function Ye(r){if(!r||typeof r!="object")return!1;const e=r;return"schemaVersion"in e||typeof e.title=="object"&&e.title!==null}function qe(r){const e=r.rules&&r.rules[0]?.when||{},t=e.device;return{id:typeof r.id=="string"&&r.id?r.id:T("tour"),kind:"tour",name:r.title?.default??"Imported tour",status:"draft",trigger:me(r.trigger),audience:r.audience==="auth"||r.audience==="guest"?r.audience:"all",conditions:{firstVisitOnly:e.firstVisitOnly===!0,maxShows:k(e.maxShows,0),device:t==="mobile"||t==="tablet"||t==="desktop"?t:"any"},display:{padding:k(r.display?.padding,z),radius:k(r.display?.radius,D),cardRadius:k(r.display?.cardRadius,B),offset:k(r.display?.offset,F),alignOffset:k(r.display?.alignOffset,0)},steps:(Array.isArray(r.steps)?r.steps:[]).map(n=>({...N("step"),id:typeof n.id=="string"&&n.id?n.id:T("step"),selectors:Array.isArray(n.selectors)?n.selectors.filter(i=>typeof i=="string"):[],content:typeof n.content?.default=="string"?n.content.default:"",page:n.pageUrl?.glob??"",placement:n.placement??"auto",align:n.align??"center",backLabel:n.backLabel??"Back",nextLabel:n.nextLabel??"Next",...n.action?{action:n.action}:{}}))}}function Xe(r){const e=Array.isArray(r)?r:[r],t=[];for(const n of e)if(Ye(n))t.push(qe(n));else{const[i]=V([n]);i&&t.push(i)}return t}function ye(r="tours:drafts"){return{async load(){try{const e=localStorage.getItem(r);return e?V(JSON.parse(e)):null}catch{return null}},async save(e){try{localStorage.setItem(r,JSON.stringify(e))}catch{}}}}function Ge(r){const e={"Content-Type":"application/json"};return r.nonce&&(e["X-WP-Nonce"]=r.nonce),{async load(){const t=await fetch(r.url,{headers:e,credentials:"same-origin"});if(!t.ok)throw new Error(`WordPress load failed: ${t.status}`);return V(await t.json())},async save(t){const n=await fetch(r.url,{method:"POST",headers:e,credentials:"same-origin",body:JSON.stringify(t)});if(!n.ok)throw new Error(`WordPress save failed: ${n.status}`)}}}const Z="tours-resume";function a(r,e={},t=[]){const n=document.createElement(r);for(const[i,o]of Object.entries(e))n.setAttribute(i,o);for(const i of t)n.append(typeof i=="string"?document.createTextNode(i):i);return n}function _(r,e,t=""){const n=a("button",{class:`iconbtn ${t}`.trim(),title:e,type:"button"});return n.innerHTML=G[r]??"",n}function Ke(r){switch(r){case"load":return"Starts automatically as soon as a matching page loads.";case"selector":return"Starts when an element matching the selector appears in the page (waits for it).";case"timer":return"Starts after the delay elapses on a matching page.";case"cta":return"Shows a small invitation in a corner; its button starts the tour.";case"manual":default:return'Starts from the [site_tour] shortcode or any element with a data-site-tour="<id>" attribute.'}}function Ze(r){switch(r){case"load":return{type:"load"};case"selector":return{type:"selector",selector:""};case"timer":return{type:"timer",delay:3e3};case"cta":return{type:"cta",text:"Need a hand getting started?",button:"Start tour",corner:"bottom-right",offset:24};default:return{type:"manual"}}}class Q{constructor(e={}){this.options=e,this.log=q("editor"),this.host=null,this.root=null,this.tours=[j()],this.openTourId=this.tours[0].id,this.view="edit",this.listFilter="tour",this.menuOpen=!1,this.activeStepId=this.tours[0].steps[0]?.id??null,this.tab="steps",this.displaySub="tour",this.openSections=new Set,this.mode="build",this.picker=null,this.picking=!1,this.player=null,this.highlight=null,this.cardPreview=null,this.focusStepId=null,this.onViewportChange=()=>this.updateOverlays(!0),this.saveTimer=null,this.navPosition=e.navPosition??"bottom",this.panelPosition=e.panelPosition??"right",this.topOffset=Math.max(0,e.topOffset??0),this.local=e.store??ye(e.storageKey),this.secondary=e.storage??null}static fromUrl(e={}){const t=e.urlFlag??"tours-edit",n=new URLSearchParams(window.location.search).get(t);if(n===null||n==="0"||n==="false")return null;const i=new Q(e);return i.mount(),i}mount(){if(this.host||this.options.mode==="off")return;this.host=a("div",{"data-tours-editor":""}),this.host.style.setProperty("--e-top",`${this.topOffset}px`),this.root=this.host.attachShadow({mode:"open"});const e=document.createElement("style");e.textContent=We+he,this.root.appendChild(e),this.highlight=a("div",{class:"highlight"}),this.root.append(this.highlight),document.body.appendChild(this.host),window.addEventListener("scroll",this.onViewportChange,!0),window.addEventListener("resize",this.onViewportChange,!0),this.log.log("mounted"),this.render(),this.hydrate()}async hydrate(){const e=await this.local.load();e&&e.length>0&&(this.tours=e,this.openTourId=e[0].id,this.activeStepId=e[0].steps[0]?.id??null,this.log.log("hydrated",`${e.length} tour(s)`)),this.applyResume()||this.render()}markDirty(){this.saveTimer!==null&&clearTimeout(this.saveTimer),this.saveTimer=setTimeout(()=>{this.saveTimer=null,this.persist()},400)}async persist(){const e=this.tours;if(await this.local.save(e),this.secondary)try{await this.secondary.save(e)}catch(t){this.log.warn("secondary store save failed (localStorage kept the draft)",t)}}destroy(){this.stopPicking(),this.player?.stop(),this.player=null,this.saveTimer!==null&&(clearTimeout(this.saveTimer),this.saveTimer=null,this.persist()),window.removeEventListener("scroll",this.onViewportChange,!0),window.removeEventListener("resize",this.onViewportChange,!0),this.host?.parentNode&&this.host.parentNode.removeChild(this.host),this.host=null,this.root=null,this.highlight=null,this.cardPreview=null}export(){return xe(this.tour)}get tour(){return this.tours.find(e=>e.id===this.openTourId)??this.tours[0]}get activeStep(){return this.tour.steps.find(e=>e.id===this.activeStepId)??null}openTour(e){this.openTourId=e,this.view="edit",this.tab="steps",this.activeStepId=this.tour.steps[0]?.id??null,this.render()}createEntity(){const e=j(this.listFilter);this.tours.push(e),this.openTour(e.id)}deleteEntity(e){const t=this.tours.findIndex(n=>n.id===e);t!==-1&&(this.tours.splice(t,1),this.tours.some(n=>n.kind==="tour")||this.tours.push(j()),this.openTourId===e&&(this.openTourId=this.tours[0].id),this.render())}saveAsTemplate(){const e=K(this.tour,"template",`${this.tour.name} (template)`);this.tours.push(e),this.listFilter="template",this.view="list",this.menuOpen=!1,this.log.log("saved as template",e.id),this.render()}createFromTemplate(e){const t=this.tours.find(i=>i.id===e);if(!t)return;const n=K(t,"tour",t.name.replace(/\s*\(template\)\s*$/,""));this.tours.push(n),this.openTour(n.id)}setActive(e){this.activeStepId!==e&&(this.activeStepId=e,this.render())}addStepAfter(e,t="step"){const n=N(t);n.page=this.currentPage(),this.tour.steps.splice(e+1,0,n),this.activeStepId=n.id,this.render()}currentPage(){return`${window.location.origin}${window.location.pathname}*`}removeStep(e){const t=this.tour.steps.findIndex(n=>n.id===e);t!==-1&&(this.tour.steps.splice(t,1),this.activeStepId===e&&(this.activeStepId=this.tour.steps[Math.max(0,t-1)]?.id??null),this.render())}togglePicking(){if(this.picking){this.stopPicking();return}const e=this.activeStep;e&&(this.picking=!0,this.picker=Re(t=>{e.selectors=t,e.page||(e.page=this.currentPage()),this.picking=!1,this.picker=null,this.log.log("bound selector to step",e.id,t),this.render()},{ignore:[this.host]}),this.picker.start(),this.render())}stopPicking(){this.picker?.stop(),this.picker=null,this.picking=!1}togglePreview(){if(this.mode==="preview"){this.player?.stop(),this.player=null,this.mode="build",this.render();return}this.startPreview()}startPreview(e){const t=this.export();if(!t.ok)return this.log.warn("cannot preview — draft is invalid",t.errors),e||window.alert(`Add a selector and text to at least one step first:

${t.errors.join(`
`)}`),!1;this.mode="preview",this.render(),this.player=He(t.tour,{onNavigate:(i,o)=>this.navigateForResume(i,o,"preview")});const n=e?t.tour.steps.findIndex(i=>i.id===e):0;return this.player.start(Math.max(0,n)),!0}async navigateForResume(e,t,n){this.saveTimer!==null&&(clearTimeout(this.saveTimer),this.saveTimer=null),await this.persist();const i=new URL(e,window.location.href);i.searchParams.set(Z,`${n}~${this.openTourId}~${t}`),this.log.log("navigating for resume",i.toString()),window.location.assign(i.toString())}applyResume(){const e=new URLSearchParams(window.location.search),t=e.get(Z);if(!t)return!1;e.delete(Z);const n=e.toString(),i=window.location.pathname+(n?`?${n}`:"")+window.location.hash;window.history.replaceState(window.history.state,"",i);const[o,s,l]=t.split("~"),c=this.tours.find(d=>d.id===s);return c?(this.openTourId=c.id,this.view="edit",this.activeStepId=l,o==="preview"&&this.startPreview(l)||(this.tab="steps",this.render()),!0):!1}render(){this.root&&(this.root.querySelectorAll(".panel, .nav").forEach(e=>e.remove()),this.mode==="build"&&this.root.appendChild(this.renderPanel()),this.root.appendChild(this.renderNav()),this.focusStepId&&(this.focusContent(this.focusStepId),this.focusStepId=null),this.updateOverlays(),this.markDirty())}resolveTarget(e){return M(e.selectors)}updateOverlays(e=!1){const t=this.highlight;if(!t)return;const n=()=>{t.style.display="none",this.removeCardPreview()};if(this.view!=="edit"||this.mode!=="build"||this.picking)return n();const i=this.activeStep,o=i&&i.selectors.length>0?this.resolveTarget(i):null;if(!i||!o)return n();const s=o.getBoundingClientRect(),{padding:l,radius:c,cardRadius:d}=this.tour.display;t.className=`highlight ${this.tab==="styles"?"highlight--settings":""}`.trim(),t.style.transitionDuration=e?"0ms":"",t.style.display="block",t.style.left=`${s.left-l}px`,t.style.top=`${s.top-l}px`,t.style.width=`${s.width+l*2}px`,t.style.height=`${s.height+l*2}px`,t.style.borderRadius=`${c}px`,this.drawStepCard(i,s,d)}removeCardPreview(){this.cardPreview&&(this.cardPreview.remove(),this.cardPreview=null)}drawStepCard(e,t,n){const i=e.content.trim(),o=this.tab==="styles"&&this.displaySub==="card";if(!i&&!o){this.removeCardPreview();return}const s=this.tour.steps,l=s.indexOf(e),c=S=>()=>{const h=s[S];if(h){if(h.page&&!U({glob:h.page},window.location.href)){const m=fe({glob:h.page});if(m){this.navigateForResume(m,h.id,"build");return}}this.setActive(h.id)}},d=ue({ghost:!0,contentText:i||"Step tooltip preview",progress:`Step ${l+1} of ${s.length}`,showClose:!0,onClose:()=>{this.activeStepId=null,this.render()},radius:n,back:{label:e.backLabel,disabled:l<=0,onClick:c(l-1)},next:{label:e.nextLabel,primary:!0,disabled:l>=s.length-1,onClick:c(l+1)}});if(!i){const S=d.querySelector(".tours-card__content");S&&(S.style.opacity="0.55")}this.removeCardPreview(),this.cardPreview=d,this.root?.appendChild(d);const u=this.tour.display.padding,f={top:t.top-u,left:t.left-u,right:t.right+u,bottom:t.bottom+u,width:t.width+u*2,height:t.height+u*2},{top:b,left:R}=ce({target:f,card:{width:d.offsetWidth,height:d.offsetHeight},side:e.placement,align:e.align,offset:this.tour.display.offset,alignOffset:this.tour.display.alignOffset,viewport:{width:window.innerWidth,height:window.innerHeight}});d.style.left=`${R}px`,d.style.top=`${b}px`}renderNav(){const e=a("div",{class:`nav nav--${this.navPosition}`}),t=_("build","Build",this.mode==="build"?"iconbtn--active":"");t.addEventListener("click",()=>{this.mode==="preview"&&this.togglePreview()});const n=_("preview","Preview",this.mode==="preview"?"iconbtn--active":"");n.addEventListener("click",()=>this.togglePreview());const i=_("navFlip","Move bar (top/bottom)");i.addEventListener("click",()=>{this.navPosition=this.navPosition==="bottom"?"top":"bottom",this.render()});const o=_("close","Close builder");return o.addEventListener("click",()=>this.destroy()),e.append(t,n,a("div",{class:"nav__sep"}),i,o),e}renderPanel(){const e=a("div",{class:`panel panel--${this.panelPosition}`});return this.view==="list"?e.append(this.renderListHeader(),this.renderList()):e.append(this.renderHeader(),this.renderToolbar(),this.renderTabs(),this.renderBody()),e}renderListHeader(){const e=a("div",{class:"panel__header"}),t=a("div",{class:"listtabs"});for(const[s,l]of[["tour","Tours"],["template","Templates"]]){const c=a("button",{class:`listtab ${this.listFilter===s?"listtab--active":""}`.trim(),type:"button"},[l]);c.addEventListener("click",()=>{this.listFilter=s,this.render()}),t.append(c)}const n=_("download",`Download all ${this.listFilter==="template"?"templates":"tours"} as JSON`);n.addEventListener("click",()=>this.downloadAll());const i=_("upload","Import tours from JSON");i.addEventListener("click",()=>this.importJson());const o=a("button",{class:"newtour",type:"button",title:"New"},["+ New"]);return o.addEventListener("click",()=>this.createEntity()),e.append(t,n,i,o),e}renderList(){const e=a("div",{class:"panel__body"}),t=a("div",{class:"tourlist"}),n=this.tours.filter(i=>i.kind===this.listFilter);return n.length===0?(e.append(a("div",{class:"assets-empty"},[this.listFilter==="template"?"No templates yet.":"No tours yet."])),e):(n.forEach(i=>{const o=a("div",{class:"tourrow"});o.addEventListener("click",()=>this.openTour(i.id));const s=a("div",{class:"tourrow__main"});if(s.append(a("div",{class:"tourrow__name"},[i.name]),a("div",{class:"tourrow__meta"},[`${i.steps.length} step${i.steps.length===1?"":"s"}`])),o.append(s),i.kind==="template"){const c=a("button",{class:"tourrow__use",type:"button",title:"Create a tour from this template"},["Use"]);c.addEventListener("click",d=>{d.stopPropagation(),this.createFromTemplate(i.id)}),o.append(c)}else o.append(a("span",{class:`status status--${i.status}`},[i.status]));const l=_("trash","Delete");l.addEventListener("click",c=>{c.stopPropagation(),this.deleteEntity(i.id)}),o.append(l),t.append(o)}),e.append(t),e)}renderHeader(){const e=a("div",{class:"panel__header"}),t=a("input",{class:"panel__title",value:this.tour.name});t.value=this.tour.name,t.addEventListener("change",()=>{this.tour.name=t.value.trim()||"Untitled tour",this.markDirty()});const n=a("span",{class:`status status--${this.tour.status}`},[this.tour.status]);n.addEventListener("click",()=>{this.tour.status=this.tour.status==="draft"?"published":"draft",this.render()}),n.setAttribute("title","Toggle status"),n.style.cursor="pointer";const i=_("menu","Menu",this.menuOpen?"iconbtn--active":"");return i.addEventListener("click",()=>{this.menuOpen=!this.menuOpen,this.render()}),e.append(t,n,i),this.menuOpen&&e.append(this.renderMenu()),e}renderMenu(){const e=a("div",{class:"menu"}),t=(n,i)=>{const o=a("button",{class:"menu__item",type:"button"},[n]);return o.addEventListener("click",()=>{this.menuOpen=!1,i()}),o};return this.tour.kind==="tour"&&e.append(t("Save as template",()=>this.saveAsTemplate())),e.append(t("Download JSON",()=>this.downloadOpenTour())),e.append(t("Import JSON…",()=>this.importJson())),e}downloadJson(e,t){const n=e.map(l=>ve(l)),i=new Blob([JSON.stringify(n,null,2)],{type:"application/json"}),o=URL.createObjectURL(i),s=document.createElement("a");s.href=o,s.download=t,s.click(),URL.revokeObjectURL(o),this.log.log("downloaded",t,`${n.length} tour(s)`)}fileBase(e){return e.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")||"tours"}downloadOpenTour(){this.downloadJson([this.tour],`${this.fileBase(this.tour.name)}.json`)}downloadAll(){const e=this.tours.filter(t=>t.kind===this.listFilter);e.length!==0&&this.downloadJson(e,`${this.listFilter==="template"?"templates":"tours"}.json`)}importJson(){const e=document.createElement("input");e.type="file",e.accept="application/json,.json",e.addEventListener("change",()=>{const t=e.files?.[0];t&&t.text().then(n=>{let i;try{i=JSON.parse(n)}catch{window.alert("Could not read that file — it is not valid JSON.");return}const o=Xe(i);if(o.length===0){window.alert("No tours found in that file.");return}this.mergeDrafts(o)})}),e.click()}mergeDrafts(e){for(const t of e){const n=this.tours.findIndex(i=>i.id===t.id);n===-1?this.tours.push(t):this.tours[n]=t}this.tours.some(t=>t.id===this.openTourId)||(this.openTourId=this.tours[0].id,this.activeStepId=this.tour.steps[0]?.id??null),this.log.log("imported",`${e.length} tour(s)`),this.render(),this.persist()}renderToolbar(){const e=a("div",{class:"panel__toolbar"}),t=_("back","Back to tours");t.addEventListener("click",()=>{this.stopPicking(),this.view="list",this.render()});const n=_("panelSide","Move panel (left/right)");n.addEventListener("click",()=>{this.panelPosition=this.panelPosition==="right"?"left":"right",this.render()});const i=_("cursor",this.picking?"Cancel picking":"Pick element for active step",this.picking?"iconbtn--active":"");return i.addEventListener("click",()=>this.togglePicking()),e.append(t,a("div",{class:"spacer"}),n,i),e}renderTabs(){const e=a("div",{class:"tabs"});for(const[t,n]of[["steps","Steps"],["styles","Styles"],["rules","Rules"]]){const i=a("button",{class:`tab ${this.tab===t?"tab--active":""}`,type:"button"},[n]);i.addEventListener("click",()=>{this.tab=t,t==="styles"&&this.selectFirstResolvableStep(),this.render()}),e.append(i)}return e}selectFirstResolvableStep(){const e=this.tour.steps.find(t=>this.resolveTarget(t)!==null);e&&(this.activeStepId=e.id)}renderDisplaySettings(){const e=a("div",{class:"settings"}),t=a("div",{class:"subtabs"});for(const[i,o]of[["tour","Tour"],["card","Card"]]){const s=a("button",{class:`subtab ${this.displaySub===i?"subtab--active":""}`,type:"button"},[o]);s.addEventListener("click",()=>{this.displaySub=i,this.render()}),t.append(s)}if(e.append(t),!this.activeStep||!this.resolveTarget(this.activeStep))return e.append(a("div",{class:"assets-empty"},["Give a step a selector first — then its target frames here so you can tune the look."])),e;const n=this.tour.display;return this.displaySub==="tour"?e.append(this.slider("Outline spacing",n.padding,0,40,i=>n.padding=i),this.slider("Outline corner radius",n.radius,0,40,i=>n.radius=i),a("div",{class:"settings__hint"},["The outline framing the target — applied in the builder and in the live tour spotlight."])):e.append(this.slider("Card corner radius",n.cardRadius,0,32,i=>n.cardRadius=i),this.slider("Distance from target",n.offset,0,48,i=>n.offset=i),this.slider("Alignment inset",n.alignOffset,0,48,i=>n.alignOffset=i),a("div",{class:"settings__hint"},["Distance is the gap to the element; alignment inset nudges the card in from the aligned edge (start/end placements)."])),e}slider(e,t,n,i,o){let s=t;const l=a("span",{class:"settings__value",title:"Click to type a value"},[`${s}px`]),c=a("input",{class:"settings__slider",type:"range",min:String(n),max:String(i),step:"1"});c.value=String(s);const d=b=>{s=Math.max(n,Math.min(i,Math.round(b))),c.value=String(s),l.textContent=`${s}px`,o(s),this.updateOverlays(),this.markDirty()};c.addEventListener("input",()=>d(Number(c.value))),l.addEventListener("click",()=>this.editNumber(l,s,d));const u=a("div",{class:"settings__row"});u.append(c,l);const f=a("div",{class:"settings__field"});return f.append(a("label",{class:"settings__label"},[e]),u),f}editNumber(e,t,n){const i=a("input",{class:"settings__num",type:"text",inputmode:"numeric"});i.value=String(t),e.replaceWith(i),i.focus(),i.select(),i.addEventListener("input",()=>{i.value=i.value.replace(/[^0-9]/g,"")});const o=()=>{const s=i.value===""?t:Number(i.value);i.replaceWith(e),n(s)};i.addEventListener("blur",o),i.addEventListener("keydown",s=>{s.key==="Enter"&&i.blur(),s.key==="Escape"&&(i.value=String(t),i.blur())})}renderBody(){const e=a("div",{class:"panel__body"});if(this.tab==="styles")return e.append(this.renderDisplaySettings()),e;if(this.tab==="rules")return e.append(this.renderRulesBody()),e;const t=a("div",{class:"steps"});return t.append(this.renderConnector(-1)),this.tour.steps.forEach((n,i)=>{t.append(this.renderCard(n,i)),t.append(this.renderConnector(i))}),e.append(t),e}renderRulesBody(){const e=a("div",{class:"settings"}),t=this.tour;if(e.append(this.selectField("Audience",t.audience,[["all","Everyone"],["auth","Logged-in users only"],["guest","Logged-out visitors only"]],n=>{t.audience=n,this.markDirty()}),this.selectField("Start trigger",t.trigger.type,[["manual","Manual (shortcode / attribute)"],["load","On page load"],["selector","When an element appears"],["timer","After a delay"],["cta","Corner invitation (popover)"]],n=>{t.trigger=Ze(n),this.markDirty(),this.render()})),t.trigger.type==="selector")e.append(this.textField("Element selector (CSS)",t.trigger.selector,"#start, .cta",n=>{t.trigger.type==="selector"&&(t.trigger.selector=n)}));else if(t.trigger.type==="timer")e.append(this.textField("Delay (ms)",String(t.trigger.delay),"3000",n=>{t.trigger.type==="timer"&&(t.trigger.delay=Math.max(0,Number(n.replace(/[^0-9]/g,""))||0))}));else if(t.trigger.type==="cta"){const n=t.trigger;e.append(this.textField("Invitation text",n.text,"Need a hand getting started?",i=>{t.trigger.type==="cta"&&(t.trigger.text=i)}),this.textField("Button label",n.button,"Start tour",i=>{t.trigger.type==="cta"&&(t.trigger.button=i)}),this.selectField("Corner",n.corner,[["bottom-right","Bottom right"],["bottom-left","Bottom left"],["top-right","Top right"],["top-left","Top left"]],i=>{t.trigger.type==="cta"&&(t.trigger.corner=i),this.markDirty()}),this.textField("Edge offset (px)",String(n.offset??24),"24",i=>{t.trigger.type==="cta"&&(t.trigger.offset=Math.max(0,Number(i.replace(/[^0-9]/g,""))||0))}))}if(e.append(a("div",{class:"settings__hint"},[Ke(t.trigger.type)])),t.trigger.type!=="manual"){const n=t.conditions;e.append(a("div",{class:"settings__divider"}),this.checkboxField("Show only on the first visit",n.firstVisitOnly,i=>{n.firstVisitOnly=i}),this.textField("Show at most N times (0 = no limit)",String(n.maxShows),"0",i=>{n.maxShows=Math.max(0,Number(i.replace(/[^0-9]/g,""))||0)}),this.selectField("Device",n.device,[["any","Any device"],["desktop","Desktop only"],["tablet","Tablet only"],["mobile","Mobile only"]],i=>{n.device=i,this.markDirty()}))}return e}checkboxField(e,t,n){const i=a("input",{type:"checkbox",class:"settings__check"});i.checked=t,i.addEventListener("change",()=>{n(i.checked),this.markDirty(),this.render()});const o=a("label",{class:"settings__checkrow"});return o.append(i,document.createTextNode(e)),o}selectField(e,t,n,i){const o=document.createElement("select");o.className="tsel";for(const[l,c]of n){const d=document.createElement("option");d.value=l,d.textContent=c,l===t&&(d.selected=!0),o.append(d)}o.addEventListener("change",()=>i(o.value));const s=a("div",{class:"settings__field"});return s.append(a("label",{class:"settings__label"},[e]),o),s}textField(e,t,n,i){const o=a("input",{class:"pagecfg__input",placeholder:n});o.value=t,o.addEventListener("change",()=>{i(o.value.trim()),this.markDirty()});const s=a("div",{class:"settings__field"});return s.append(a("label",{class:"settings__label"},[e]),o),s}renderConnector(e){const t=a("div",{class:"connector"}),n=a("button",{class:"connector__add",title:"Add step",type:"button"},["+"]);return n.addEventListener("click",()=>this.addStepAfter(e)),t.append(a("div",{class:"connector__line"}),n,a("div",{class:"connector__line"})),t}renderCard(e,t){const n=e.id===this.activeStepId,i=a("div",{class:`card ${n?"card--active":""} ${e.included?"":"card--excluded"}`.trim()});return i.addEventListener("mousedown",()=>this.setActive(e.id)),e.page&&!U({glob:e.page},window.location.href)&&i.classList.add("card--offpage"),i.append(this.renderCardControl(e,t),this.renderCardContent(e),this.renderCardFooter(e)),n&&(i.append(this.section("placement","Card position",()=>this.renderPlacementBody(e))),i.append(this.section("page","Page",()=>this.renderPageBody(e)))),i}renderPageBody(e){const t=a("div",{class:"settings"}),n=a("input",{class:"pagecfg__input",placeholder:"Any page"});n.value=e.page,n.addEventListener("change",()=>{e.page=n.value.trim(),this.markDirty(),this.render()});const i=a("button",{class:"pagecfg__use",type:"button"},["Use current page"]);return i.addEventListener("click",()=>{e.page=this.currentPage(),this.render()}),t.append(a("label",{class:"settings__label"},["Show on pages matching (URL glob)"]),n,i,a("div",{class:"settings__hint"},["Empty = any page. New steps get the current page automatically; navigate your site (with the builder on) to add steps on other pages."])),t}section(e,t,n){const i=this.openSections.has(e),o=a("div",{class:`acc ${i?"acc--open":""}`.trim()}),s=a("button",{class:"acc__head",type:"button"}),l=a("span",{class:"acc__caret"});return l.innerHTML=G.chevron,s.append(l,a("span",{class:"acc__title"},[t])),s.addEventListener("click",()=>{i?this.openSections.delete(e):this.openSections.add(e),this.render()}),o.append(s),i&&o.append(a("div",{class:"acc__body"},[n()])),o}renderPlacementBody(e){const t=a("div",{class:"place"}),n=a("div",{class:"place__grid"});n.append(a("div",{class:"place__el"})),n.append(a("div",{class:"place__el"}));const i=[{side:"top",align:"start",x:40,y:16},{side:"top",align:"center",x:66,y:16},{side:"top",align:"end",x:92,y:16},{side:"bottom",align:"start",x:40,y:80},{side:"bottom",align:"center",x:66,y:80},{side:"bottom",align:"end",x:92,y:80},{side:"left",align:"start",x:24,y:32},{side:"left",align:"center",x:24,y:48},{side:"left",align:"end",x:24,y:64},{side:"right",align:"start",x:108,y:32},{side:"right",align:"center",x:108,y:48},{side:"right",align:"end",x:108,y:64}];for(const s of i){const l=e.placement===s.side&&e.align===s.align,c=a("button",{class:`place__dot ${l?"place__dot--active":""}`.trim(),type:"button",title:`${s.side} · ${s.align}`});c.style.left=`${s.x-6}px`,c.style.top=`${s.y-6}px`,c.addEventListener("click",()=>{e.placement=s.side,e.align=s.align,this.render()}),n.append(c)}t.append(n);const o=a("button",{class:`place__auto ${e.placement==="auto"?"place__auto--active":""}`.trim(),type:"button",title:"Pick the side with the most room automatically"},["Auto"]);return o.addEventListener("click",()=>{e.placement="auto",this.render()}),t.append(o),t}renderCardControl(e,t){const n=a("div",{class:"card__control"}),i=a("input",{class:"card__check",type:"checkbox",title:"Include in tour"});i.checked=e.included,i.addEventListener("change",()=>{e.included=i.checked,this.render()});const o=a("span",{class:"card__index"},[String(t+1)]),s=a("span",{class:"card__type"});s.innerHTML=G[e.type==="action"?"bolt":"step"],s.append(document.createTextNode(e.type==="action"?"Action":"Step"));const l=e.selectors[0],c=a("span",{class:`card__sel ${l?"":"card__sel--empty"}`.trim(),title:l??""},[l??"no selector"]),d=_("trash","Delete step");if(d.addEventListener("click",()=>this.removeStep(e.id)),n.append(i,o,s,a("div",{class:"spacer"})),e.page&&!U({glob:e.page},window.location.href)){const u=e.page.replace(/^https?:\/\/[^/]+/,"").replace(/\*$/,"")||"/";n.append(a("span",{class:"card__page",title:e.page},[`⧉ ${u}`]))}return n.append(c,d),n}renderCardContent(e){const t=a("div",{class:"card__content",contenteditable:"true","data-placeholder":"Write the step text…","data-step":e.id});return t.textContent=e.content,t.addEventListener("input",()=>{e.content=t.textContent??"",this.updateOverlays(),this.markDirty()}),t.addEventListener("mousedown",()=>{this.activeStepId!==e.id&&(this.focusStepId=e.id)}),t}renderCardFooter(e){const t=a("div",{class:"card__footer"});return t.append(this.renderEditableButton(e,"backLabel"),this.renderEditableButton(e,"nextLabel")),t}renderEditableButton(e,t){const n=a("button",{class:"cardbtn",type:"button"},[e[t]]);return n.addEventListener("click",i=>{i.stopPropagation();const o=a("input",{class:"cardbtn cardbtn--edit",value:e[t]});o.value=e[t],n.replaceWith(o),o.focus(),o.select();const s=()=>{e[t]=o.value.trim()||(t==="backLabel"?"Back":"Next"),o.replaceWith(this.renderEditableButton(e,t)),this.markDirty()};o.addEventListener("blur",s),o.addEventListener("keydown",l=>{l.key==="Enter"&&o.blur(),l.key==="Escape"&&(o.value=e[t],o.blur())})}),n}focusContent(e){const t=this.root?.querySelector(`.card__content[data-step="${e}"]`);if(!t)return;t.focus();const n=document.createRange();n.selectNodeContents(t),n.collapse(!1);const i=window.getSelection();i?.removeAllRanges(),i?.addRange(n)}}y.TourBuilder=Q,y.cloneDraft=K,y.createDraftStep=N,y.createDraftTour=j,y.createLocalStore=ye,y.createWordPressStore=Ge,y.normalizeTours=V,y.toTour=xe,Object.defineProperty(y,Symbol.toStringTag,{value:"Module"})}));
//# sourceMappingURL=index.umd.js.map
