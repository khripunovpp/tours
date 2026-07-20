(function(b,y){typeof exports=="object"&&typeof module<"u"?y(exports):typeof define=="function"&&define.amd?define(["exports"],y):(b=typeof globalThis<"u"?globalThis:b||self,y(b.SiteToursFront={}))})(this,(function(b){"use strict";const y=`
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
`,W="a, button, summary, label, h1, h2, h3, h4, h5, h6";function K(t,e){if(t.startsWith("text=")){const n=t.slice(5).trim();for(const o of Array.from(e.querySelectorAll(W)))if((o.textContent??"").replace(/\s+/g," ").trim()===n)return o;return null}try{return e.querySelector(t)}catch{return null}}function k(t,e=document){for(const n of t){const o=K(n,e);if(o)return o}return null}function X(t,e={}){const n=e.root??document,o=k(t,n);return o?Promise.resolve(o):new Promise(r=>{let d=!1;const a=c=>{d||(d=!0,s.disconnect(),clearTimeout(l),r(c))},s=new MutationObserver(()=>{const c=k(t,n);c&&a(c)});s.observe(document.documentElement,{childList:!0,subtree:!0,attributes:!0});const l=setTimeout(()=>a(null),e.timeout??4e3)})}let x=null;function _(){if(x!==null)return x;try{x=new URLSearchParams(window.location.search).has("use_logs")}catch{x=!1}return x}function J(t){const e=`[tours:${t}]`;return{log:(...n)=>{_()&&console.log(e,...n)},warn:(...n)=>{_()&&console.warn(e,...n)},error:(...n)=>{_()&&console.error(e,...n)}}}const A=6,S=6,T=10,R=12,Q=1;function f(t){return typeof t=="object"&&t!==null&&!Array.isArray(t)}function O(t){return f(t)&&typeof t.default=="string"}const D=["top","bottom","left","right","auto"],N=["start","center","end"],U=["mobile","tablet","desktop"],z=["click","input","navigate","none"];function I(t,e,n){if(!f(t)){n.push(`${e} must be an object`);return}const o=typeof t.glob=="string"&&t.glob.length>0,r=typeof t.regex=="string"&&t.regex.length>0;if(!o&&!r&&n.push(`${e} must have a non-empty "glob" or "regex"`),r)try{new RegExp(t.regex)}catch{n.push(`${e}.regex is not a valid regular expression`)}}function M(t,e,n){if(!f(t)){n.push(`${e} must be an object`);return}t.url!==void 0&&I(t.url,`${e}.url`,n),t.role!==void 0&&typeof t.role!="string"&&n.push(`${e}.role must be a string`),t.firstVisitOnly!==void 0&&typeof t.firstVisitOnly!="boolean"&&n.push(`${e}.firstVisitOnly must be a boolean`),t.device!==void 0&&!U.includes(t.device)&&n.push(`${e}.device must be one of ${U.join("|")}`),t.unlessSeen!==void 0&&typeof t.unlessSeen!="boolean"&&n.push(`${e}.unlessSeen must be a boolean`),t.maxShows!==void 0&&(typeof t.maxShows!="number"||t.maxShows<0)&&n.push(`${e}.maxShows must be a non-negative number`)}function Z(t,e,n){if(!f(t)){n.push(`${e} must be an object`);return}z.includes(t.type)||n.push(`${e}.type must be one of ${z.join("|")}`),t.url!==void 0&&typeof t.url!="string"&&n.push(`${e}.url must be a string`),t.value!==void 0&&typeof t.value!="string"&&n.push(`${e}.value must be a string`)}function tt(t){const e=[];if(!f(t))return{ok:!1,errors:["tour must be an object"]};if((typeof t.id!="string"||t.id.length===0)&&e.push("tour.id must be a non-empty string"),typeof t.schemaVersion!="number"&&e.push("tour.schemaVersion must be a number"),O(t.title)||e.push('tour.title must be a localized text with a string "default"'),Array.isArray(t.steps)?t.steps.length===0?e.push("tour.steps must contain at least one step"):t.steps.forEach((n,o)=>{if(!f(n)){e.push(`steps[${o}] must be an object`);return}(typeof n.id!="string"||n.id.length===0)&&e.push(`steps[${o}].id must be a non-empty string`),(!Array.isArray(n.selectors)||n.selectors.length===0||!n.selectors.every(r=>typeof r=="string"&&r.length>0))&&e.push(`steps[${o}].selectors must be a non-empty array of non-empty strings`),O(n.content)||e.push(`steps[${o}].content must be a localized text with a string "default"`),n.placement!==void 0&&!D.includes(n.placement)&&e.push(`steps[${o}].placement must be one of ${D.join("|")}`),n.align!==void 0&&!N.includes(n.align)&&e.push(`steps[${o}].align must be one of ${N.join("|")}`),n.backLabel!==void 0&&typeof n.backLabel!="string"&&e.push(`steps[${o}].backLabel must be a string`),n.nextLabel!==void 0&&typeof n.nextLabel!="string"&&e.push(`steps[${o}].nextLabel must be a string`),n.pageUrl!==void 0&&I(n.pageUrl,`steps[${o}].pageUrl`,e),n.condition!==void 0&&M(n.condition,`steps[${o}].condition`,e),n.action!==void 0&&Z(n.action,`steps[${o}].action`,e)}):e.push("tour.steps must be an array"),t.display!==void 0)if(!f(t.display))e.push("tour.display must be an object");else for(const n of["padding","radius","cardRadius","offset","alignOffset"]){const o=t.display[n];o!==void 0&&(typeof o!="number"||o<0)&&e.push(`tour.display.${n} must be a non-negative number`)}return t.rules!==void 0&&(Array.isArray(t.rules)?t.rules.forEach((n,o)=>{if(!f(n)){e.push(`rules[${o}] must be an object`);return}n.tourId!==void 0&&typeof n.tourId!="string"&&e.push(`rules[${o}].tourId must be a string`),n.when===void 0?e.push(`rules[${o}].when is required`):M(n.when,`rules[${o}].when`,e)}):e.push("tour.rules must be an array")),e.length>0?{ok:!1,errors:e}:{ok:!0,tour:t}}function et(t,e,n){const o={top:t.top,bottom:n.height-t.bottom,left:t.left,right:n.width-t.right},r={top:e.height,bottom:e.height,left:e.width,right:e.width},d=["bottom","top","right","left"],a=d.find(s=>o[s]>=r[s]+8);return a||d.reduce((s,l)=>o[l]>o[s]?l:s,d[0])}function nt(t){const{target:e,card:n,offset:o,viewport:r}=t,d=t.side==="auto",a=d?et(e,n,r):t.side,s=d?"center":t.align,l=t.alignOffset??0,c=s==="start"?l:s==="end"?-l:0;let p=0,h=0;return a==="top"||a==="bottom"?(p=a==="top"?e.top-n.height-o:e.bottom+o,h=s==="start"?e.left:s==="end"?e.right-n.width:e.left+e.width/2-n.width/2,h+=c):(h=a==="left"?e.left-n.width-o:e.right+o,p=s==="start"?e.top:s==="end"?e.bottom-n.height:e.top+e.height/2-n.height/2,p+=c),h=Math.max(8,Math.min(h,r.width-n.width-8)),p=Math.max(8,Math.min(p,r.height-n.height-8)),{top:p,left:h}}function F(t){const e=document.createElement("button");return e.type="button",e.className=`tours-card__btn${t.primary?" tours-card__btn--primary":""}${t.disabled?" tours-card__btn--disabled":""}`,e.textContent=t.label,!t.disabled&&t.onClick&&e.addEventListener("click",t.onClick),e}function ot(t){const e=document.createElement("div");e.className=`tours-card${t.ghost?" tours-card--ghost":""}`,t.radius!=null&&(e.style.borderRadius=`${t.radius}px`);{const o=document.createElement("button");o.className="tours-card__close",o.type="button",o.textContent="×",o.setAttribute("aria-label","Close"),t.onClose&&o.addEventListener("click",t.onClose),e.appendChild(o)}const n=document.createElement("div");if(n.className="tours-card__content",t.contentHtml!=null?n.innerHTML=t.contentHtml:n.textContent=t.contentText??"",e.appendChild(n),t.back||t.next||t.progress){const o=document.createElement("div");if(o.className="tours-card__footer",t.back&&o.appendChild(F(t.back)),t.progress){const r=document.createElement("span");r.className="tours-card__progress",r.textContent=t.progress,o.appendChild(r)}t.next&&o.appendChild(F(t.next)),e.appendChild(o)}return e}const it=`
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
`;function rt(t){const e=J("player");let n=null,o=null,r=null,d=null,a=!1,s=0;const l=t.display?.padding??A,c=t.display?.radius??S,p=t.display?.cardRadius??T,h=t.display?.offset??R;function H(i){return k(i.selectors)}function q(){if(n)return;n=document.createElement("div"),n.setAttribute("data-tours-player",""),o=n.attachShadow({mode:"open"});const i=document.createElement("style");i.textContent=y+it,o.appendChild(i);const u=document.createElement("div");u.className="tours-backdrop",o.appendChild(u),r=document.createElement("div"),r.className="tours-spotlight",r.style.borderRadius=`${c}px`,o.appendChild(r),document.body.appendChild(n)}function Y(i){r&&(r.style.display="block",r.style.left=`${i.left-l}px`,r.style.top=`${i.top-l}px`,r.style.width=`${i.width+l*2}px`,r.style.height=`${i.height+l*2}px`)}function j(i,u){if(!d)return;const g={top:i.top-l,left:i.left-l,right:i.right+l,bottom:i.bottom+l,width:i.width+l*2,height:i.height+l*2},{top:C,left:bt}=nt({target:g,card:{width:d.offsetWidth,height:d.offsetHeight},side:u.placement??"bottom",align:u.align??"center",offset:h,alignOffset:t.display?.alignOffset??0,viewport:{width:window.innerWidth,height:window.innerHeight}});d.style.left=`${bt}px`,d.style.top=`${C}px`}function pt(i){const u=t.steps.length;d&&d.remove(),d=ot({contentText:i.content.default,progress:`Step ${s+1} of ${u}`,onClose:m,radius:p,back:{label:i.backLabel??"Back",disabled:s===0,onClick:L},next:{label:i.nextLabel??(s===u-1?"Done":"Next"),primary:!0,onClick:E}}),o?.appendChild(d)}function $(){if(!a)return;const i=t.steps[s];if(!i){m();return}e.log("render step",s,i.id);const u=H(i);if(!u){e.log(`step "${i.id}" target not found yet — waiting`,i.selectors),X(i.selectors,{timeout:4e3}).then(C=>{!a||t.steps[s]!==i||(C?$():(e.warn(`step "${i.id}" skipped: no element for selectors`,i.selectors),s<t.steps.length-1?(s+=1,$()):m()))});return}q(),u.scrollIntoView({behavior:"smooth",block:"center",inline:"center"}),pt(i);const g=u.getBoundingClientRect();Y(g),j(g,i)}function G(i){a&&(i.key==="Escape"?(i.preventDefault(),m()):i.key==="ArrowRight"?E():i.key==="ArrowLeft"&&L())}function v(){if(!a)return;const i=t.steps[s];if(!i)return;const u=H(i);if(!u)return;const g=u.getBoundingClientRect();Y(g),j(g,i)}function ht(){a||t.steps.length!==0&&(a=!0,s=0,e.log("start",t.id,`${t.steps.length} steps`),q(),window.addEventListener("keydown",G,!0),window.addEventListener("resize",v,!0),window.addEventListener("scroll",v,!0),$())}function m(){a&&(a=!1,e.log("stop"),window.removeEventListener("keydown",G,!0),window.removeEventListener("resize",v,!0),window.removeEventListener("scroll",v,!0),n&&n.parentNode&&n.parentNode.removeChild(n),n=null,o=null,r=null,d=null)}function E(){if(a){if(s>=t.steps.length-1){m();return}s+=1,$()}}function L(){a&&(s<=0||(s-=1,$()))}return{start:ht,stop:m,next:E,prev:L}}let st=0;function at(t){const e=typeof crypto<"u"&&"randomUUID"in crypto?crypto.randomUUID():`${st++}`;return`${t}-${e}`}function dt(t="step"){return{id:at("step"),type:t,included:!0,selectors:[],content:"",placement:"auto",align:"center",backLabel:"Back",nextLabel:"Next"}}function lt(t){if(!Array.isArray(t))return[];const e=[];for(const n of t){if(!n||typeof n!="object")continue;const o=n;typeof o.id!="string"||!Array.isArray(o.steps)||e.push({id:o.id,kind:o.kind==="template"?"template":"tour",name:typeof o.name=="string"?o.name:"Untitled tour",status:o.status==="published"?"published":"draft",display:{padding:w(o.display?.padding,A),radius:w(o.display?.radius,S),cardRadius:w(o.display?.cardRadius,T),offset:w(o.display?.offset,R),alignOffset:w(o.display?.alignOffset,0)},steps:o.steps.filter(r=>!!r&&typeof r=="object").map(r=>({...dt(r.type==="action"?"action":"step"),...r}))})}return e}function w(t,e){return typeof t=="number"&&t>=0?t:e}function ut(t){const e=t.steps.filter(o=>o.included&&o.selectors.length>0).map(o=>({id:o.id,selectors:o.selectors,content:{default:o.content},placement:o.placement,align:o.align,backLabel:o.backLabel,nextLabel:o.nextLabel})),n={id:t.id,schemaVersion:Q,title:{default:t.name},steps:e,display:{padding:t.display.padding,radius:t.display.radius,cardRadius:t.display.cardRadius,offset:t.display.offset,alignOffset:t.display.alignOffset}};return tt(n)}function ct(){return window.SiteToursFront_data??{}}function P(){return lt(ct().drafts).filter(t=>t.status==="published"&&t.kind==="tour")}function ft(){return P().map(t=>({id:t.id,name:t.name}))}function V(t){const e=P(),n=t?e.find(r=>r.id===t):e[0];if(!n){console.warn("[tours] no published tour to run",t??"");return}const o=ut(n);if(!o.ok){console.warn("[tours] tour is invalid",o.errors);return}rt(o.tour).start()}function B(){for(const t of Array.from(document.querySelectorAll("[data-site-tour]")))t.dataset.siteToursBound||(t.dataset.siteToursBound="1",t.addEventListener("click",()=>V(t.dataset.siteTour||void 0)))}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",B):B(),b.list=ft,b.run=V,Object.defineProperty(b,Symbol.toStringTag,{value:"Module"})}));
