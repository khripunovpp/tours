(function(y,$){typeof exports=="object"&&typeof module<"u"?$(exports):typeof define=="function"&&define.amd?define(["exports"],$):(y=typeof globalThis<"u"?globalThis:y||self,$(y.Tours={}))})(this,(function(y){"use strict";const $=`
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
`,ye=`
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
`;function I(r){return JSON.stringify(r)}function we(r){return/^[a-zA-Z][\w-]*$/.test(r)&&r.length<=30&&!/\d{2,}/.test(r)&&!/^(css-|sc-|jsx-|emotion-|_|is-|has-)/.test(r)}function Q(r){const e=[];let t=r;for(;t&&t!==document.body&&t.nodeType===1;){const n=t.tagName.toLowerCase(),i=t.parentElement;if(!i){e.unshift(n);break}const o=Array.from(i.children).filter(s=>s.tagName===t.tagName);e.unshift(o.length>1?`${n}:nth-of-type(${o.indexOf(t)+1})`:n),t=i}return`body > ${e.join(" > ")}`}function _e(r){let e=r.parentElement;for(;e&&e!==document.body&&!e.id;)e=e.parentElement;if(!e||!e.id)return null;const t=[];let n=r;for(;n&&n!==e;){const i=n.tagName.toLowerCase(),o=n.parentElement;if(!o)return null;const s=Array.from(o.children).filter(l=>l.tagName===n.tagName);t.unshift(s.length>1?`${i}:nth-of-type(${s.indexOf(n)+1})`:i),n=o}return`#${CSS.escape(e.id)} > ${t.join(" > ")}`}const ke=["data-testid","data-test","data-test-id","data-cy","data-qa","data-id","data-name"];function Se(r){const e=[],t=new Set,n=r.tagName.toLowerCase(),i=d=>{if(!(!d||t.has(d)))try{document.querySelector(d)===r&&(t.add(d),e.push(d))}catch{}};r.id&&i(`#${CSS.escape(r.id)}`);for(const d of ke){const u=r.getAttribute(d);u&&i(`${n}[${d}=${I(u)}]`)}const o=r.getAttribute("name");o&&i(`${n}[name=${I(o)}]`);const s=r.getAttribute("aria-label");s&&i(`[aria-label=${I(s)}]`);const l=Array.from(r.classList).filter(we);l.length&&i(`${n}.${l.map(d=>CSS.escape(d)).join(".")}`);for(const d of l)i(`${n}.${CSS.escape(d)}`);i(_e(r)),i(Q(r));const p=(r.textContent??"").replace(/\s+/g," ").trim();if(p&&p.length<=50&&/^(a|button|summary|label|h[1-6])$/.test(n)){const d=`text=${p}`;t.has(d)||(t.add(d),e.push(d))}return e.length===0&&e.push(Q(r)),e}const Ee="a, button, summary, label, h1, h2, h3, h4, h5, h6";function Ce(r,e){if(r.startsWith("text=")){const t=r.slice(5).trim();for(const n of Array.from(e.querySelectorAll(Ee)))if((n.textContent??"").replace(/\s+/g," ").trim()===t)return n;return null}try{return e.querySelector(r)}catch{return null}}function A(r,e=document){for(const t of r){const n=Ce(t,e);if(n)return n}return null}function $e(r,e={}){const t=e.root??document,n=A(r,t);return n?Promise.resolve(n):new Promise(i=>{let o=!1,s;const l=u=>{o||(o=!0,p.disconnect(),s&&clearTimeout(s),i(u))},p=new MutationObserver(()=>{const u=A(r,t);u&&l(u)});p.observe(document.documentElement,{childList:!0,subtree:!0,attributes:!0});const d=e.timeout??4e3;d>0&&Number.isFinite(d)&&(s=setTimeout(()=>l(null),d))})}let L=null;function M(){if(L!==null)return L;try{L=new URLSearchParams(window.location.search).has("use_logs")}catch{L=!1}return L}function D(r){const e=`[tours:${r}]`;return{log:(...t)=>{M()&&console.log(e,...t)},warn:(...t)=>{M()&&console.warn(e,...t)},error:(...t)=>{M()&&console.error(e,...t)}}}function Le(r,e={}){const t=D("picker");let n=null,i=null,o=null,s=!1;function l(f){if(f===n)return!0;for(const m of e.ignore??[])if(m&&m.contains(f))return!0;return!1}function p(){if(n)return;n=document.createElement("div"),n.setAttribute("data-tours-picker",""),i=n.attachShadow({mode:"open"});const f=document.createElement("style");f.textContent=$,i.appendChild(f),o=document.createElement("div"),o.className="tours-picker-overlay",o.style.display="none",i.appendChild(o);const m=document.createElement("div");m.className="tours-picker-hint",m.textContent="Hover and click an element • Esc to cancel",i.appendChild(m),document.body.appendChild(n)}function d(f,m){const x=document.elementFromPoint(f,m);return!x||l(x)?null:x}function u(f){if(!s||!o)return;const m=d(f.clientX,f.clientY);if(!m){o.style.display="none";return}const x=m.getBoundingClientRect();o.style.display="block",o.style.left=`${x.left}px`,o.style.top=`${x.top}px`,o.style.width=`${x.width}px`,o.style.height=`${x.height}px`}function h(f){if(!s)return;const m=d(f.clientX,f.clientY);if(f.preventDefault(),f.stopPropagation(),!m)return;const x=Se(m);t.log("picked",x),_(),r(x)}function b(f){f.key==="Escape"&&(f.preventDefault(),_())}function T(){s||(s=!0,t.log("start"),p(),document.addEventListener("mousemove",u,!0),document.addEventListener("click",h,!0),document.addEventListener("keydown",b,!0))}function _(){s&&(s=!1,document.removeEventListener("mousemove",u,!0),document.removeEventListener("click",h,!0),document.removeEventListener("keydown",b,!0),n&&n.parentNode&&n.parentNode.removeChild(n),n=null,i=null,o=null)}return{start:T,stop:_}}const B=6,F=6,U=10,V=12,Te=1;function k(r){return typeof r=="object"&&r!==null&&!Array.isArray(r)}function ee(r){return k(r)&&typeof r.default=="string"}const te=["top","bottom","left","right","auto"],ne=["start","center","end"],re=["mobile","tablet","desktop"],ie=["click","input","navigate","none"];function oe(r,e,t){if(!k(r)){t.push(`${e} must be an object`);return}const n=typeof r.glob=="string"&&r.glob.length>0,i=typeof r.regex=="string"&&r.regex.length>0;if(!n&&!i&&t.push(`${e} must have a non-empty "glob" or "regex"`),i)try{new RegExp(r.regex)}catch{t.push(`${e}.regex is not a valid regular expression`)}}function se(r,e,t){if(!k(r)){t.push(`${e} must be an object`);return}r.url!==void 0&&oe(r.url,`${e}.url`,t),r.role!==void 0&&typeof r.role!="string"&&t.push(`${e}.role must be a string`),r.firstVisitOnly!==void 0&&typeof r.firstVisitOnly!="boolean"&&t.push(`${e}.firstVisitOnly must be a boolean`),r.device!==void 0&&!re.includes(r.device)&&t.push(`${e}.device must be one of ${re.join("|")}`),r.unlessSeen!==void 0&&typeof r.unlessSeen!="boolean"&&t.push(`${e}.unlessSeen must be a boolean`),r.maxShows!==void 0&&(typeof r.maxShows!="number"||r.maxShows<0)&&t.push(`${e}.maxShows must be a non-negative number`)}function Pe(r,e,t){if(!k(r)){t.push(`${e} must be an object`);return}ie.includes(r.type)||t.push(`${e}.type must be one of ${ie.join("|")}`),r.url!==void 0&&typeof r.url!="string"&&t.push(`${e}.url must be a string`),r.value!==void 0&&typeof r.value!="string"&&t.push(`${e}.value must be a string`)}function Ae(r){const e=[];if(!k(r))return{ok:!1,errors:["tour must be an object"]};if((typeof r.id!="string"||r.id.length===0)&&e.push("tour.id must be a non-empty string"),typeof r.schemaVersion!="number"&&e.push("tour.schemaVersion must be a number"),ee(r.title)||e.push('tour.title must be a localized text with a string "default"'),Array.isArray(r.steps)?r.steps.length===0?e.push("tour.steps must contain at least one step"):r.steps.forEach((t,n)=>{if(!k(t)){e.push(`steps[${n}] must be an object`);return}(typeof t.id!="string"||t.id.length===0)&&e.push(`steps[${n}].id must be a non-empty string`),(!Array.isArray(t.selectors)||t.selectors.length===0||!t.selectors.every(i=>typeof i=="string"&&i.length>0))&&e.push(`steps[${n}].selectors must be a non-empty array of non-empty strings`),ee(t.content)||e.push(`steps[${n}].content must be a localized text with a string "default"`),t.placement!==void 0&&!te.includes(t.placement)&&e.push(`steps[${n}].placement must be one of ${te.join("|")}`),t.align!==void 0&&!ne.includes(t.align)&&e.push(`steps[${n}].align must be one of ${ne.join("|")}`),t.backLabel!==void 0&&typeof t.backLabel!="string"&&e.push(`steps[${n}].backLabel must be a string`),t.nextLabel!==void 0&&typeof t.nextLabel!="string"&&e.push(`steps[${n}].nextLabel must be a string`),t.pageUrl!==void 0&&oe(t.pageUrl,`steps[${n}].pageUrl`,e),t.condition!==void 0&&se(t.condition,`steps[${n}].condition`,e),t.action!==void 0&&Pe(t.action,`steps[${n}].action`,e)}):e.push("tour.steps must be an array"),r.trigger!==void 0){const t=r.trigger,n=["manual","load","selector","timer"];!k(t)||typeof t.type!="string"||!n.includes(t.type)?e.push(`tour.trigger.type must be one of ${n.join("|")}`):t.type==="selector"&&(typeof t.selector!="string"||t.selector.length===0)?e.push("tour.trigger.selector must be a non-empty string"):t.type==="timer"&&(typeof t.delay!="number"||t.delay<0)&&e.push("tour.trigger.delay must be a non-negative number")}if(r.audience!==void 0&&!["all","auth","guest"].includes(r.audience)&&e.push("tour.audience must be one of all|auth|guest"),r.display!==void 0)if(!k(r.display))e.push("tour.display must be an object");else for(const t of["padding","radius","cardRadius","offset","alignOffset"]){const n=r.display[t];n!==void 0&&(typeof n!="number"||n<0)&&e.push(`tour.display.${t} must be a non-negative number`)}return r.rules!==void 0&&(Array.isArray(r.rules)?r.rules.forEach((t,n)=>{if(!k(t)){e.push(`rules[${n}] must be an object`);return}t.tourId!==void 0&&typeof t.tourId!="string"&&e.push(`rules[${n}].tourId must be a string`),t.when===void 0?e.push(`rules[${n}].when is required`):se(t.when,`rules[${n}].when`,e)}):e.push("tour.rules must be an array")),e.length>0?{ok:!1,errors:e}:{ok:!0,tour:r}}function Oe(r,e,t){const n={top:r.top,bottom:t.height-r.bottom,left:r.left,right:t.width-r.right},i={top:e.height,bottom:e.height,left:e.width,right:e.width},o=["bottom","top","right","left"],s=o.find(l=>n[l]>=i[l]+8);return s||o.reduce((l,p)=>n[p]>n[l]?p:l,o[0])}function ae(r){const{target:e,card:t,offset:n,viewport:i}=r,o=r.side==="auto",s=o?Oe(e,t,i):r.side,l=o?"center":r.align,p=r.alignOffset??0,d=l==="start"?p:l==="end"?-p:0;let u=0,h=0;return s==="top"||s==="bottom"?(u=s==="top"?e.top-t.height-n:e.bottom+n,h=l==="start"?e.left:l==="end"?e.right-t.width:e.left+e.width/2-t.width/2,h+=d):(h=s==="left"?e.left-t.width-n:e.right+n,u=l==="start"?e.top:l==="end"?e.bottom-t.height:e.top+e.height/2-t.height/2,u+=d),h=Math.max(8,Math.min(h,i.width-t.width-8)),u=Math.max(8,Math.min(u,i.height-t.height-8)),{top:u,left:h}}function de(r){const e=document.createElement("button");return e.type="button",e.className=`tours-card__btn${r.primary?" tours-card__btn--primary":""}${r.disabled?" tours-card__btn--disabled":""}`,e.textContent=r.label,!r.disabled&&r.onClick&&e.addEventListener("click",r.onClick),e}function le(r){const e=document.createElement("div");if(e.className=`tours-card${r.ghost?" tours-card--ghost":""}`,r.radius!=null&&(e.style.borderRadius=`${r.radius}px`),r.showClose){const n=document.createElement("button");n.className="tours-card__close",n.type="button",n.textContent="×",n.setAttribute("aria-label","Close"),r.onClose&&n.addEventListener("click",r.onClose),e.appendChild(n)}const t=document.createElement("div");if(t.className="tours-card__content",r.contentHtml!=null?t.innerHTML=r.contentHtml:t.textContent=r.contentText??"",e.appendChild(t),r.back||r.next||r.progress){const n=document.createElement("div");if(n.className="tours-card__footer",r.back&&n.appendChild(de(r.back)),r.progress){const i=document.createElement("span");i.className="tours-card__progress",i.textContent=r.progress,n.appendChild(i)}r.next&&n.appendChild(de(r.next)),e.appendChild(n)}return e}const ce=`
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
`;function Ne(r){const e=r.replace(/[.+^${}()|[\]\\]/g,"\\$&").replace(/\*\*/g,"\0").replace(/\*/g,"[^/]*").replace(/ /g,".*").replace(/\?/g,".");return new RegExp(`^${e}$`)}function j(r,e){if(!r)return!0;if(r.regex)try{return new RegExp(r.regex).test(e)}catch{return!1}if(r.glob)try{return Ne(r.glob).test(e)}catch{return!1}return!0}const H="tours:locationchange";let pe=!1;function ze(){if(!pe){pe=!0;for(const r of["pushState","replaceState"]){const e=history[r];history[r]=function(...n){const i=e.apply(this,n);return window.dispatchEvent(new Event(H)),i}}}}function Re(r){return ze(),window.addEventListener("popstate",r),window.addEventListener("hashchange",r),window.addEventListener(H,r),()=>{window.removeEventListener("popstate",r),window.removeEventListener("hashchange",r),window.removeEventListener(H,r)}}const ue="tours:progress";function Ie(r,e){r.set(ue,JSON.stringify(e))}function Me(r){r.remove(ue)}function De(r,e={}){const t=D("player"),n=e.state;let i=null,o=null,s=null,l=null,p=!1,d=0,u=0,h=null;const b=r.display?.padding??B,T=r.display?.radius??F,_=r.display?.cardRadius??U,f=r.display?.offset??V;function m(c){return A(c.selectors)}function x(c){return j(c.pageUrl,window.location.href)}function P(){n&&Ie(n,{tourId:r.id,index:d})}function ge(){if(i)return;i=document.createElement("div"),i.setAttribute("data-tours-player",""),o=i.attachShadow({mode:"open"});const c=document.createElement("style");c.textContent=ye+ce,o.appendChild(c);const g=document.createElement("div");g.className="tours-backdrop",o.appendChild(g),s=document.createElement("div"),s.className="tours-spotlight",s.style.borderRadius=`${T}px`,o.appendChild(s),document.body.appendChild(i)}function be(c,g=!1){s&&(s.style.transitionDuration=g?"0ms":"",s.style.display="block",s.style.left=`${c.left-b}px`,s.style.top=`${c.top-b}px`,s.style.width=`${c.width+b*2}px`,s.style.height=`${c.height+b*2}px`)}function me(c,g){if(!l)return;const v={top:c.top-b,left:c.left-b,right:c.right+b,bottom:c.bottom+b,width:c.width+b*2,height:c.height+b*2},{top:Z,left:qe}=ae({target:v,card:{width:l.offsetWidth,height:l.offsetHeight},side:g.placement??"bottom",align:g.align??"center",offset:f,alignOffset:r.display?.alignOffset??0,viewport:{width:window.innerWidth,height:window.innerHeight}});l.style.left=`${qe}px`,l.style.top=`${Z}px`}function We(c){const g=Math.max(1,r.steps.length-u),v=Math.max(1,Math.min(d+1-u,g));l&&l.remove(),l=le({contentText:c.content.default,progress:`Step ${v} of ${g}`,showClose:!0,onClose:C,radius:_,back:{label:c.backLabel??"Back",disabled:d===0,onClick:X},next:{label:c.nextLabel??(d===g-1?"Done":"Next"),primary:!0,onClick:K}}),o?.appendChild(l)}function E(){if(!p)return;const c=r.steps[d];if(!c){C();return}t.log("render step",d,c.id);const g=m(c);if(!g){t.log(`step "${c.id}" target not found yet — waiting`,c.selectors),$e(c.selectors,{timeout:4e3}).then(Z=>{!p||r.steps[d]!==c||(Z?E():(t.warn(`step "${c.id}" skipped: no element for selectors`,c.selectors),u+=1,d<r.steps.length-1?(d+=1,E()):C()))});return}ge(),g.scrollIntoView({behavior:"smooth",block:"center",inline:"center"}),We(c);const v=g.getBoundingClientRect();be(v),me(v,c)}function ve(c){p&&(c.key==="Escape"?(c.preventDefault(),C()):c.key==="ArrowRight"?K():c.key==="ArrowLeft"&&X())}function R(){if(!p)return;const c=r.steps[d];if(!c)return;const g=m(c);if(!g)return;const v=g.getBoundingClientRect();be(v,!0),me(v,c)}function Je(c=0){p||r.steps.length!==0&&(p=!0,d=Math.max(0,Math.min(c,r.steps.length-1)),u=0,t.log("start",r.id,`at ${d}/${r.steps.length}`),ge(),window.addEventListener("keydown",ve,!0),window.addEventListener("resize",R,!0),window.addEventListener("scroll",R,!0),P(),E())}function Ye(){s&&(s.style.display="none"),l&&(l.remove(),l=null)}function G(){Ye(),!h&&(h=Re(()=>{if(!p){h?.(),h=null;return}const c=r.steps[d];c&&x(c)&&(h?.(),h=null,E())}))}function xe(){h&&(h(),h=null),p&&(p=!1,window.removeEventListener("keydown",ve,!0),window.removeEventListener("resize",R,!0),window.removeEventListener("scroll",R,!0),i&&i.parentNode&&i.parentNode.removeChild(i),i=null,o=null,s=null,l=null)}function C(){t.log("stop"),xe(),n&&Me(n)}function K(){if(!p)return;const c=d+1,g=r.steps[c];if(!g){C();return}if(x(g)){d=c,P(),E();return}d=c,P();const v=r.steps[d-1]?.action;if(v&&v.type==="navigate"&&v.url){v.url.startsWith("#")?(t.log("page transition (hash navigate) → resume at",d),G(),window.location.hash=v.url):(t.log("page transition (navigate) → resume at",d),xe(),window.location.assign(v.url));return}t.log("page transition (wait) → resume at",d),G()}function X(){if(!p)return;const c=r.steps[d-1];if(c){if(x(c)){d-=1,P(),E();return}d-=1,P(),t.log("page transition back → resume at",d),G(),window.history.back()}}return{start:Je,stop:C,next:K,prev:X}}const Be=`
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
`,W={cursor:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m4 4 7 17 2.5-7L21 11.5 4 4Z"/></svg>',back:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>',chevron:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>',menu:'<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></svg>',panelSide:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M15 4v16"/></svg>',navFlip:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18"/><path d="m7 8 5-5 5 5"/><path d="m7 16 5 5 5-5"/></svg>',build:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>',preview:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',close:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',trash:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>',bolt:'<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z"/></svg>',step:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 2"/></svg>'};let Fe=0;function O(r){const e=typeof crypto<"u"&&"randomUUID"in crypto?crypto.randomUUID():`${Fe++}`;return`${r}-${e}`}function N(r="step"){return{id:O("step"),type:r,included:!0,selectors:[],content:"",page:"",placement:"auto",align:"center",backLabel:"Back",nextLabel:"Next"}}function z(r="tour"){return{id:O(r),kind:r,name:r==="template"?"Untitled template":"Untitled tour",status:"draft",trigger:{type:"manual"},audience:"all",conditions:{firstVisitOnly:!0,maxShows:0,device:"any"},steps:[N()],display:{padding:B,radius:F,cardRadius:U,offset:V,alignOffset:0}}}function J(r,e,t){return{id:O(e),kind:e,name:t??r.name,status:"draft",trigger:{...r.trigger},audience:r.audience,conditions:{...r.conditions},steps:r.steps.map(n=>({...n,id:O("step"),selectors:[...n.selectors]})),display:{...r.display}}}function Ue(r){if(r&&typeof r=="object"){const e=r;if(e.type==="load")return{type:"load"};if(e.type==="selector"&&typeof e.selector=="string")return{type:"selector",selector:e.selector};if(e.type==="timer"&&typeof e.delay=="number")return{type:"timer",delay:e.delay}}return{type:"manual"}}function Y(r){if(!Array.isArray(r))return[];const e=[];for(const t of r){if(!t||typeof t!="object")continue;const n=t;typeof n.id!="string"||!Array.isArray(n.steps)||e.push({id:n.id,kind:n.kind==="template"?"template":"tour",name:typeof n.name=="string"?n.name:"Untitled tour",status:n.status==="published"?"published":"draft",trigger:Ue(n.trigger),audience:n.audience==="auth"||n.audience==="guest"?n.audience:"all",conditions:{firstVisitOnly:(n.conditions?.firstVisitOnly??!0)===!0,maxShows:S(n.conditions?.maxShows,0),device:["mobile","tablet","desktop"].includes(n.conditions?.device)?n.conditions.device:"any"},display:{padding:S(n.display?.padding,B),radius:S(n.display?.radius,F),cardRadius:S(n.display?.cardRadius,U),offset:S(n.display?.offset,V),alignOffset:S(n.display?.alignOffset,0)},steps:n.steps.filter(i=>!!i&&typeof i=="object").map(i=>({...N(i.type==="action"?"action":"step"),...i}))})}return e}function S(r,e){return typeof r=="number"&&r>=0?r:e}function he(r){const e=r.steps.filter(o=>o.included&&o.selectors.length>0).map(o=>({id:o.id,selectors:o.selectors,content:{default:o.content},placement:o.placement,align:o.align,backLabel:o.backLabel,nextLabel:o.nextLabel,...o.page?{pageUrl:{glob:o.page}}:{}})),t={};r.conditions.firstVisitOnly&&(t.firstVisitOnly=!0),r.conditions.maxShows>0&&(t.maxShows=r.conditions.maxShows),r.conditions.device!=="any"&&(t.device=r.conditions.device);const n=Object.keys(t).length>0?[{when:t}]:void 0,i={id:r.id,schemaVersion:Te,title:{default:r.name},steps:e,trigger:r.trigger,audience:r.audience,...n?{rules:n}:{},display:{padding:r.display.padding,radius:r.display.radius,cardRadius:r.display.cardRadius,offset:r.display.offset,alignOffset:r.display.alignOffset}};return Ae(i)}function fe(r="tours:drafts"){return{async load(){try{const e=localStorage.getItem(r);return e?Y(JSON.parse(e)):null}catch{return null}},async save(e){try{localStorage.setItem(r,JSON.stringify(e))}catch{}}}}function Ve(r){const e={"Content-Type":"application/json"};return r.nonce&&(e["X-WP-Nonce"]=r.nonce),{async load(){const t=await fetch(r.url,{headers:e,credentials:"same-origin"});if(!t.ok)throw new Error(`WordPress load failed: ${t.status}`);return Y(await t.json())},async save(t){const n=await fetch(r.url,{method:"POST",headers:e,credentials:"same-origin",body:JSON.stringify(t)});if(!n.ok)throw new Error(`WordPress save failed: ${n.status}`)}}}function a(r,e={},t=[]){const n=document.createElement(r);for(const[i,o]of Object.entries(e))n.setAttribute(i,o);for(const i of t)n.append(typeof i=="string"?document.createTextNode(i):i);return n}function w(r,e,t=""){const n=a("button",{class:`iconbtn ${t}`.trim(),title:e,type:"button"});return n.innerHTML=W[r]??"",n}function je(r){switch(r){case"load":return"Starts automatically as soon as a matching page loads.";case"selector":return"Starts when an element matching the selector appears in the page (waits for it).";case"timer":return"Starts after the delay elapses on a matching page.";case"manual":default:return'Starts from the [site_tour] shortcode or any element with a data-site-tour="<id>" attribute.'}}function He(r){switch(r){case"load":return{type:"load"};case"selector":return{type:"selector",selector:""};case"timer":return{type:"timer",delay:3e3};default:return{type:"manual"}}}class q{constructor(e={}){this.options=e,this.log=D("editor"),this.host=null,this.root=null,this.tours=[z()],this.openTourId=this.tours[0].id,this.view="edit",this.listFilter="tour",this.menuOpen=!1,this.activeStepId=this.tours[0].steps[0]?.id??null,this.tab="steps",this.displaySub="tour",this.openSections=new Set,this.mode="build",this.picker=null,this.picking=!1,this.player=null,this.highlight=null,this.cardPreview=null,this.focusStepId=null,this.onViewportChange=()=>this.updateOverlays(!0),this.saveTimer=null,this.navPosition=e.navPosition??"bottom",this.panelPosition=e.panelPosition??"right",this.topOffset=Math.max(0,e.topOffset??0),this.local=fe(e.storageKey),this.secondary=e.storage??null}static fromUrl(e={}){const t=e.urlFlag??"tours-edit",n=new URLSearchParams(window.location.search).get(t);if(n===null||n==="0"||n==="false")return null;const i=new q(e);return i.mount(),i}mount(){if(this.host||this.options.mode==="off")return;this.host=a("div",{"data-tours-editor":""}),this.host.style.setProperty("--e-top",`${this.topOffset}px`),this.root=this.host.attachShadow({mode:"open"});const e=document.createElement("style");e.textContent=Be+ce,this.root.appendChild(e),this.highlight=a("div",{class:"highlight"}),this.root.append(this.highlight),document.body.appendChild(this.host),window.addEventListener("scroll",this.onViewportChange,!0),window.addEventListener("resize",this.onViewportChange,!0),this.log.log("mounted"),this.render(),this.hydrate()}async hydrate(){const e=await this.local.load();!e||e.length===0||(this.tours=e,this.openTourId=e[0].id,this.activeStepId=e[0].steps[0]?.id??null,this.log.log("hydrated",`${e.length} tour(s)`),this.render())}markDirty(){this.saveTimer!==null&&clearTimeout(this.saveTimer),this.saveTimer=setTimeout(()=>{this.saveTimer=null,this.persist()},400)}async persist(){const e=this.tours;if(await this.local.save(e),this.secondary)try{await this.secondary.save(e)}catch(t){this.log.warn("secondary store save failed (localStorage kept the draft)",t)}}destroy(){this.stopPicking(),this.player?.stop(),this.player=null,this.saveTimer!==null&&(clearTimeout(this.saveTimer),this.saveTimer=null,this.persist()),window.removeEventListener("scroll",this.onViewportChange,!0),window.removeEventListener("resize",this.onViewportChange,!0),this.host?.parentNode&&this.host.parentNode.removeChild(this.host),this.host=null,this.root=null,this.highlight=null,this.cardPreview=null}export(){return he(this.tour)}get tour(){return this.tours.find(e=>e.id===this.openTourId)??this.tours[0]}get activeStep(){return this.tour.steps.find(e=>e.id===this.activeStepId)??null}openTour(e){this.openTourId=e,this.view="edit",this.tab="steps",this.activeStepId=this.tour.steps[0]?.id??null,this.render()}createEntity(){const e=z(this.listFilter);this.tours.push(e),this.openTour(e.id)}deleteEntity(e){const t=this.tours.findIndex(n=>n.id===e);t!==-1&&(this.tours.splice(t,1),this.tours.some(n=>n.kind==="tour")||this.tours.push(z()),this.openTourId===e&&(this.openTourId=this.tours[0].id),this.render())}saveAsTemplate(){const e=J(this.tour,"template",`${this.tour.name} (template)`);this.tours.push(e),this.listFilter="template",this.view="list",this.menuOpen=!1,this.log.log("saved as template",e.id),this.render()}createFromTemplate(e){const t=this.tours.find(i=>i.id===e);if(!t)return;const n=J(t,"tour",t.name.replace(/\s*\(template\)\s*$/,""));this.tours.push(n),this.openTour(n.id)}setActive(e){this.activeStepId!==e&&(this.activeStepId=e,this.render())}addStepAfter(e,t="step"){const n=N(t);n.page=this.currentPage(),this.tour.steps.splice(e+1,0,n),this.activeStepId=n.id,this.render()}currentPage(){return`${window.location.origin}${window.location.pathname}*`}removeStep(e){const t=this.tour.steps.findIndex(n=>n.id===e);t!==-1&&(this.tour.steps.splice(t,1),this.activeStepId===e&&(this.activeStepId=this.tour.steps[Math.max(0,t-1)]?.id??null),this.render())}togglePicking(){if(this.picking){this.stopPicking();return}const e=this.activeStep;e&&(this.picking=!0,this.picker=Le(t=>{e.selectors=t,e.page||(e.page=this.currentPage()),this.picking=!1,this.picker=null,this.log.log("bound selector to step",e.id,t),this.render()},{ignore:[this.host]}),this.picker.start(),this.render())}stopPicking(){this.picker?.stop(),this.picker=null,this.picking=!1}togglePreview(){if(this.mode==="preview"){this.player?.stop(),this.player=null,this.mode="build",this.render();return}const e=this.export();if(!e.ok){this.log.warn("cannot preview — draft is invalid",e.errors),window.alert(`Add a selector and text to at least one step first:

${e.errors.join(`
`)}`);return}this.mode="preview",this.render(),this.player=De(e.tour),this.player.start()}render(){this.root&&(this.root.querySelectorAll(".panel, .nav").forEach(e=>e.remove()),this.mode==="build"&&this.root.appendChild(this.renderPanel()),this.root.appendChild(this.renderNav()),this.focusStepId&&(this.focusContent(this.focusStepId),this.focusStepId=null),this.updateOverlays(),this.markDirty())}resolveTarget(e){return A(e.selectors)}updateOverlays(e=!1){const t=this.highlight;if(!t)return;const n=()=>{t.style.display="none",this.removeCardPreview()};if(this.view!=="edit"||this.mode!=="build"||this.picking)return n();const i=this.activeStep,o=i&&i.selectors.length>0?this.resolveTarget(i):null;if(!i||!o)return n();const s=o.getBoundingClientRect(),{padding:l,radius:p,cardRadius:d}=this.tour.display;t.className=`highlight ${this.tab==="styles"?"highlight--settings":""}`.trim(),t.style.transitionDuration=e?"0ms":"",t.style.display="block",t.style.left=`${s.left-l}px`,t.style.top=`${s.top-l}px`,t.style.width=`${s.width+l*2}px`,t.style.height=`${s.height+l*2}px`,t.style.borderRadius=`${p}px`,this.drawStepCard(i,s,d)}removeCardPreview(){this.cardPreview&&(this.cardPreview.remove(),this.cardPreview=null)}drawStepCard(e,t,n){const i=e.content.trim(),o=this.tab==="styles"&&this.displaySub==="card";if(!i&&!o){this.removeCardPreview();return}const s=this.tour.steps,l=s.indexOf(e),p=_=>()=>{const f=s[_];f&&this.setActive(f.id)},d=le({ghost:!0,contentText:i||"Step tooltip preview",progress:`Step ${l+1} of ${s.length}`,showClose:!0,onClose:()=>{this.activeStepId=null,this.render()},radius:n,back:{label:e.backLabel,disabled:l<=0,onClick:p(l-1)},next:{label:e.nextLabel,primary:!0,disabled:l>=s.length-1,onClick:p(l+1)}});if(!i){const _=d.querySelector(".tours-card__content");_&&(_.style.opacity="0.55")}this.removeCardPreview(),this.cardPreview=d,this.root?.appendChild(d);const u=this.tour.display.padding,h={top:t.top-u,left:t.left-u,right:t.right+u,bottom:t.bottom+u,width:t.width+u*2,height:t.height+u*2},{top:b,left:T}=ae({target:h,card:{width:d.offsetWidth,height:d.offsetHeight},side:e.placement,align:e.align,offset:this.tour.display.offset,alignOffset:this.tour.display.alignOffset,viewport:{width:window.innerWidth,height:window.innerHeight}});d.style.left=`${T}px`,d.style.top=`${b}px`}renderNav(){const e=a("div",{class:`nav nav--${this.navPosition}`}),t=w("build","Build",this.mode==="build"?"iconbtn--active":"");t.addEventListener("click",()=>{this.mode==="preview"&&this.togglePreview()});const n=w("preview","Preview",this.mode==="preview"?"iconbtn--active":"");n.addEventListener("click",()=>this.togglePreview());const i=w("navFlip","Move bar (top/bottom)");i.addEventListener("click",()=>{this.navPosition=this.navPosition==="bottom"?"top":"bottom",this.render()});const o=w("close","Close builder");return o.addEventListener("click",()=>this.destroy()),e.append(t,n,a("div",{class:"nav__sep"}),i,o),e}renderPanel(){const e=a("div",{class:`panel panel--${this.panelPosition}`});return this.view==="list"?e.append(this.renderListHeader(),this.renderList()):e.append(this.renderHeader(),this.renderToolbar(),this.renderTabs(),this.renderBody()),e}renderListHeader(){const e=a("div",{class:"panel__header"}),t=a("div",{class:"listtabs"});for(const[i,o]of[["tour","Tours"],["template","Templates"]]){const s=a("button",{class:`listtab ${this.listFilter===i?"listtab--active":""}`.trim(),type:"button"},[o]);s.addEventListener("click",()=>{this.listFilter=i,this.render()}),t.append(s)}const n=a("button",{class:"newtour",type:"button",title:"New"},["+ New"]);return n.addEventListener("click",()=>this.createEntity()),e.append(t,n),e}renderList(){const e=a("div",{class:"panel__body"}),t=a("div",{class:"tourlist"}),n=this.tours.filter(i=>i.kind===this.listFilter);return n.length===0?(e.append(a("div",{class:"assets-empty"},[this.listFilter==="template"?"No templates yet.":"No tours yet."])),e):(n.forEach(i=>{const o=a("div",{class:"tourrow"});o.addEventListener("click",()=>this.openTour(i.id));const s=a("div",{class:"tourrow__main"});if(s.append(a("div",{class:"tourrow__name"},[i.name]),a("div",{class:"tourrow__meta"},[`${i.steps.length} step${i.steps.length===1?"":"s"}`])),o.append(s),i.kind==="template"){const p=a("button",{class:"tourrow__use",type:"button",title:"Create a tour from this template"},["Use"]);p.addEventListener("click",d=>{d.stopPropagation(),this.createFromTemplate(i.id)}),o.append(p)}else o.append(a("span",{class:`status status--${i.status}`},[i.status]));const l=w("trash","Delete");l.addEventListener("click",p=>{p.stopPropagation(),this.deleteEntity(i.id)}),o.append(l),t.append(o)}),e.append(t),e)}renderHeader(){const e=a("div",{class:"panel__header"}),t=a("input",{class:"panel__title",value:this.tour.name});t.value=this.tour.name,t.addEventListener("change",()=>{this.tour.name=t.value.trim()||"Untitled tour",this.markDirty()});const n=a("span",{class:`status status--${this.tour.status}`},[this.tour.status]);n.addEventListener("click",()=>{this.tour.status=this.tour.status==="draft"?"published":"draft",this.render()}),n.setAttribute("title","Toggle status"),n.style.cursor="pointer";const i=w("menu","Menu",this.menuOpen?"iconbtn--active":"");return i.addEventListener("click",()=>{this.menuOpen=!this.menuOpen,this.render()}),e.append(t,n,i),this.menuOpen&&e.append(this.renderMenu()),e}renderMenu(){const e=a("div",{class:"menu"}),t=(n,i)=>{const o=a("button",{class:"menu__item",type:"button"},[n]);return o.addEventListener("click",()=>{this.menuOpen=!1,i()}),o};return this.tour.kind==="tour"&&e.append(t("Save as template",()=>this.saveAsTemplate())),e.append(t("Export JSON",()=>this.exportJson())),e}exportJson(){const e=this.export();this.log.log("tour JSON",e),window.prompt("Tour JSON (copy):",e.ok?JSON.stringify(e.tour):e.errors.join("; ")),this.render()}renderToolbar(){const e=a("div",{class:"panel__toolbar"}),t=w("back","Back to tours");t.addEventListener("click",()=>{this.stopPicking(),this.view="list",this.render()});const n=w("panelSide","Move panel (left/right)");n.addEventListener("click",()=>{this.panelPosition=this.panelPosition==="right"?"left":"right",this.render()});const i=w("cursor",this.picking?"Cancel picking":"Pick element for active step",this.picking?"iconbtn--active":"");return i.addEventListener("click",()=>this.togglePicking()),e.append(t,a("div",{class:"spacer"}),n,i),e}renderTabs(){const e=a("div",{class:"tabs"});for(const[t,n]of[["steps","Steps"],["styles","Styles"],["rules","Rules"],["assets","Assets"]]){const i=a("button",{class:`tab ${this.tab===t?"tab--active":""}`,type:"button"},[n]);i.addEventListener("click",()=>{this.tab=t,t==="styles"&&this.selectFirstResolvableStep(),this.render()}),e.append(i)}return e}selectFirstResolvableStep(){const e=this.tour.steps.find(t=>this.resolveTarget(t)!==null);e&&(this.activeStepId=e.id)}renderDisplaySettings(){const e=a("div",{class:"settings"}),t=a("div",{class:"subtabs"});for(const[i,o]of[["tour","Tour"],["card","Card"]]){const s=a("button",{class:`subtab ${this.displaySub===i?"subtab--active":""}`,type:"button"},[o]);s.addEventListener("click",()=>{this.displaySub=i,this.render()}),t.append(s)}if(e.append(t),!this.activeStep||!this.resolveTarget(this.activeStep))return e.append(a("div",{class:"assets-empty"},["Give a step a selector first — then its target frames here so you can tune the look."])),e;const n=this.tour.display;return this.displaySub==="tour"?e.append(this.slider("Outline spacing",n.padding,0,40,i=>n.padding=i),this.slider("Outline corner radius",n.radius,0,40,i=>n.radius=i),a("div",{class:"settings__hint"},["The outline framing the target — applied in the builder and in the live tour spotlight."])):e.append(this.slider("Card corner radius",n.cardRadius,0,32,i=>n.cardRadius=i),this.slider("Distance from target",n.offset,0,48,i=>n.offset=i),this.slider("Alignment inset",n.alignOffset,0,48,i=>n.alignOffset=i),a("div",{class:"settings__hint"},["Distance is the gap to the element; alignment inset nudges the card in from the aligned edge (start/end placements)."])),e}slider(e,t,n,i,o){let s=t;const l=a("span",{class:"settings__value",title:"Click to type a value"},[`${s}px`]),p=a("input",{class:"settings__slider",type:"range",min:String(n),max:String(i),step:"1"});p.value=String(s);const d=b=>{s=Math.max(n,Math.min(i,Math.round(b))),p.value=String(s),l.textContent=`${s}px`,o(s),this.updateOverlays(),this.markDirty()};p.addEventListener("input",()=>d(Number(p.value))),l.addEventListener("click",()=>this.editNumber(l,s,d));const u=a("div",{class:"settings__row"});u.append(p,l);const h=a("div",{class:"settings__field"});return h.append(a("label",{class:"settings__label"},[e]),u),h}editNumber(e,t,n){const i=a("input",{class:"settings__num",type:"text",inputmode:"numeric"});i.value=String(t),e.replaceWith(i),i.focus(),i.select(),i.addEventListener("input",()=>{i.value=i.value.replace(/[^0-9]/g,"")});const o=()=>{const s=i.value===""?t:Number(i.value);i.replaceWith(e),n(s)};i.addEventListener("blur",o),i.addEventListener("keydown",s=>{s.key==="Enter"&&i.blur(),s.key==="Escape"&&(i.value=String(t),i.blur())})}renderBody(){const e=a("div",{class:"panel__body"});if(this.tab==="assets")return e.append(a("div",{class:"assets-empty"},["Assets — coming soon"])),e;if(this.tab==="styles")return e.append(this.renderDisplaySettings()),e;if(this.tab==="rules")return e.append(this.renderRulesBody()),e;const t=a("div",{class:"steps"});return t.append(this.renderConnector(-1)),this.tour.steps.forEach((n,i)=>{t.append(this.renderCard(n,i)),t.append(this.renderConnector(i))}),e.append(t),e}renderRulesBody(){const e=a("div",{class:"settings"}),t=this.tour;if(e.append(this.selectField("Audience",t.audience,[["all","Everyone"],["auth","Logged-in users only"],["guest","Logged-out visitors only"]],n=>{t.audience=n,this.markDirty()}),this.selectField("Start trigger",t.trigger.type,[["manual","Manual (shortcode / attribute)"],["load","On page load"],["selector","When an element appears"],["timer","After a delay"]],n=>{t.trigger=He(n),this.markDirty(),this.render()})),t.trigger.type==="selector"?e.append(this.textField("Element selector (CSS)",t.trigger.selector,"#start, .cta",n=>{t.trigger.type==="selector"&&(t.trigger.selector=n)})):t.trigger.type==="timer"&&e.append(this.textField("Delay (ms)",String(t.trigger.delay),"3000",n=>{t.trigger.type==="timer"&&(t.trigger.delay=Math.max(0,Number(n.replace(/[^0-9]/g,""))||0))})),e.append(a("div",{class:"settings__hint"},[je(t.trigger.type)])),t.trigger.type!=="manual"){const n=t.conditions;e.append(a("div",{class:"settings__divider"}),this.checkboxField("Show only on the first visit",n.firstVisitOnly,i=>{n.firstVisitOnly=i}),this.textField("Show at most N times (0 = no limit)",String(n.maxShows),"0",i=>{n.maxShows=Math.max(0,Number(i.replace(/[^0-9]/g,""))||0)}),this.selectField("Device",n.device,[["any","Any device"],["desktop","Desktop only"],["tablet","Tablet only"],["mobile","Mobile only"]],i=>{n.device=i,this.markDirty()}))}return e}checkboxField(e,t,n){const i=a("input",{type:"checkbox",class:"settings__check"});i.checked=t,i.addEventListener("change",()=>{n(i.checked),this.markDirty(),this.render()});const o=a("label",{class:"settings__checkrow"});return o.append(i,document.createTextNode(e)),o}selectField(e,t,n,i){const o=document.createElement("select");o.className="tsel";for(const[l,p]of n){const d=document.createElement("option");d.value=l,d.textContent=p,l===t&&(d.selected=!0),o.append(d)}o.addEventListener("change",()=>i(o.value));const s=a("div",{class:"settings__field"});return s.append(a("label",{class:"settings__label"},[e]),o),s}textField(e,t,n,i){const o=a("input",{class:"pagecfg__input",placeholder:n});o.value=t,o.addEventListener("change",()=>{i(o.value.trim()),this.markDirty()});const s=a("div",{class:"settings__field"});return s.append(a("label",{class:"settings__label"},[e]),o),s}renderConnector(e){const t=a("div",{class:"connector"}),n=a("button",{class:"connector__add",title:"Add step",type:"button"},["+"]);return n.addEventListener("click",()=>this.addStepAfter(e)),t.append(a("div",{class:"connector__line"}),n,a("div",{class:"connector__line"})),t}renderCard(e,t){const n=e.id===this.activeStepId,i=a("div",{class:`card ${n?"card--active":""} ${e.included?"":"card--excluded"}`.trim()});return i.addEventListener("mousedown",()=>this.setActive(e.id)),e.page&&!j({glob:e.page},window.location.href)&&i.classList.add("card--offpage"),i.append(this.renderCardControl(e,t),this.renderCardContent(e),this.renderCardFooter(e)),n&&(i.append(this.section("placement","Card position",()=>this.renderPlacementBody(e))),i.append(this.section("page","Page",()=>this.renderPageBody(e)))),i}renderPageBody(e){const t=a("div",{class:"settings"}),n=a("input",{class:"pagecfg__input",placeholder:"Any page"});n.value=e.page,n.addEventListener("change",()=>{e.page=n.value.trim(),this.markDirty(),this.render()});const i=a("button",{class:"pagecfg__use",type:"button"},["Use current page"]);return i.addEventListener("click",()=>{e.page=this.currentPage(),this.render()}),t.append(a("label",{class:"settings__label"},["Show on pages matching (URL glob)"]),n,i,a("div",{class:"settings__hint"},["Empty = any page. New steps get the current page automatically; navigate your site (with the builder on) to add steps on other pages."])),t}section(e,t,n){const i=this.openSections.has(e),o=a("div",{class:`acc ${i?"acc--open":""}`.trim()}),s=a("button",{class:"acc__head",type:"button"}),l=a("span",{class:"acc__caret"});return l.innerHTML=W.chevron,s.append(l,a("span",{class:"acc__title"},[t])),s.addEventListener("click",()=>{i?this.openSections.delete(e):this.openSections.add(e),this.render()}),o.append(s),i&&o.append(a("div",{class:"acc__body"},[n()])),o}renderPlacementBody(e){const t=a("div",{class:"place"}),n=a("div",{class:"place__grid"});n.append(a("div",{class:"place__el"})),n.append(a("div",{class:"place__el"}));const i=[{side:"top",align:"start",x:40,y:16},{side:"top",align:"center",x:66,y:16},{side:"top",align:"end",x:92,y:16},{side:"bottom",align:"start",x:40,y:80},{side:"bottom",align:"center",x:66,y:80},{side:"bottom",align:"end",x:92,y:80},{side:"left",align:"start",x:24,y:32},{side:"left",align:"center",x:24,y:48},{side:"left",align:"end",x:24,y:64},{side:"right",align:"start",x:108,y:32},{side:"right",align:"center",x:108,y:48},{side:"right",align:"end",x:108,y:64}];for(const s of i){const l=e.placement===s.side&&e.align===s.align,p=a("button",{class:`place__dot ${l?"place__dot--active":""}`.trim(),type:"button",title:`${s.side} · ${s.align}`});p.style.left=`${s.x-6}px`,p.style.top=`${s.y-6}px`,p.addEventListener("click",()=>{e.placement=s.side,e.align=s.align,this.render()}),n.append(p)}t.append(n);const o=a("button",{class:`place__auto ${e.placement==="auto"?"place__auto--active":""}`.trim(),type:"button",title:"Pick the side with the most room automatically"},["Auto"]);return o.addEventListener("click",()=>{e.placement="auto",this.render()}),t.append(o),t}renderCardControl(e,t){const n=a("div",{class:"card__control"}),i=a("input",{class:"card__check",type:"checkbox",title:"Include in tour"});i.checked=e.included,i.addEventListener("change",()=>{e.included=i.checked,this.render()});const o=a("span",{class:"card__index"},[String(t+1)]),s=a("span",{class:"card__type"});s.innerHTML=W[e.type==="action"?"bolt":"step"],s.append(document.createTextNode(e.type==="action"?"Action":"Step"));const l=e.selectors[0],p=a("span",{class:`card__sel ${l?"":"card__sel--empty"}`.trim(),title:l??""},[l??"no selector"]),d=w("trash","Delete step");if(d.addEventListener("click",()=>this.removeStep(e.id)),n.append(i,o,s,a("div",{class:"spacer"})),e.page&&!j({glob:e.page},window.location.href)){const u=e.page.replace(/^https?:\/\/[^/]+/,"").replace(/\*$/,"")||"/";n.append(a("span",{class:"card__page",title:e.page},[`⧉ ${u}`]))}return n.append(p,d),n}renderCardContent(e){const t=a("div",{class:"card__content",contenteditable:"true","data-placeholder":"Write the step text…","data-step":e.id});return t.textContent=e.content,t.addEventListener("input",()=>{e.content=t.textContent??"",this.updateOverlays(),this.markDirty()}),t.addEventListener("mousedown",()=>{this.activeStepId!==e.id&&(this.focusStepId=e.id)}),t}renderCardFooter(e){const t=a("div",{class:"card__footer"});return t.append(this.renderEditableButton(e,"backLabel"),this.renderEditableButton(e,"nextLabel")),t}renderEditableButton(e,t){const n=a("button",{class:"cardbtn",type:"button"},[e[t]]);return n.addEventListener("click",i=>{i.stopPropagation();const o=a("input",{class:"cardbtn cardbtn--edit",value:e[t]});o.value=e[t],n.replaceWith(o),o.focus(),o.select();const s=()=>{e[t]=o.value.trim()||(t==="backLabel"?"Back":"Next"),o.replaceWith(this.renderEditableButton(e,t)),this.markDirty()};o.addEventListener("blur",s),o.addEventListener("keydown",l=>{l.key==="Enter"&&o.blur(),l.key==="Escape"&&(o.value=e[t],o.blur())})}),n}focusContent(e){const t=this.root?.querySelector(`.card__content[data-step="${e}"]`);if(!t)return;t.focus();const n=document.createRange();n.selectNodeContents(t),n.collapse(!1);const i=window.getSelection();i?.removeAllRanges(),i?.addRange(n)}}y.TourBuilder=q,y.cloneDraft=J,y.createDraftStep=N,y.createDraftTour=z,y.createLocalStore=fe,y.createWordPressStore=Ve,y.normalizeTours=Y,y.toTour=he,Object.defineProperty(y,Symbol.toStringTag,{value:"Module"})}));
