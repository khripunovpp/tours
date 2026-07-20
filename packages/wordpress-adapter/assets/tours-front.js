(function(m,w){typeof exports=="object"&&typeof module<"u"?w(exports):typeof define=="function"&&define.amd?define(["exports"],w):(m=typeof globalThis<"u"?globalThis:m||self,w(m.SiteToursFront={}))})(this,(function(m){"use strict";const w=`
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
`,it="a, button, summary, label, h1, h2, h3, h4, h5, h6";function st(t,e){if(t.startsWith("text=")){const n=t.slice(5).trim();for(const o of Array.from(e.querySelectorAll(it)))if((o.textContent??"").replace(/\s+/g," ").trim()===n)return o;return null}try{return e.querySelector(t)}catch{return null}}function k(t,e=document){for(const n of t){const o=st(n,e);if(o)return o}return null}function at(t,e={}){const n=e.root??document,o=k(t,n);return o?Promise.resolve(o):new Promise(i=>{let d=!1;const l=a=>{d||(d=!0,s.disconnect(),clearTimeout(u),i(a))},s=new MutationObserver(()=>{const a=k(t,n);a&&l(a)});s.observe(document.documentElement,{childList:!0,subtree:!0,attributes:!0});const u=setTimeout(()=>l(null),e.timeout??4e3)})}let x=null;function _(){if(x!==null)return x;try{x=new URLSearchParams(window.location.search).has("use_logs")}catch{x=!1}return x}function lt(t){const e=`[tours:${t}]`;return{log:(...n)=>{_()&&console.log(e,...n)},warn:(...n)=>{_()&&console.warn(e,...n)},error:(...n)=>{_()&&console.error(e,...n)}}}const O=6,U=6,N=10,I=12,dt=1;function h(t){return typeof t=="object"&&t!==null&&!Array.isArray(t)}function D(t){return h(t)&&typeof t.default=="string"}const P=["top","bottom","left","right","auto"],z=["start","center","end"],M=["mobile","tablet","desktop"],F=["click","input","navigate","none"];function V(t,e,n){if(!h(t)){n.push(`${e} must be an object`);return}const o=typeof t.glob=="string"&&t.glob.length>0,i=typeof t.regex=="string"&&t.regex.length>0;if(!o&&!i&&n.push(`${e} must have a non-empty "glob" or "regex"`),i)try{new RegExp(t.regex)}catch{n.push(`${e}.regex is not a valid regular expression`)}}function H(t,e,n){if(!h(t)){n.push(`${e} must be an object`);return}t.url!==void 0&&V(t.url,`${e}.url`,n),t.role!==void 0&&typeof t.role!="string"&&n.push(`${e}.role must be a string`),t.firstVisitOnly!==void 0&&typeof t.firstVisitOnly!="boolean"&&n.push(`${e}.firstVisitOnly must be a boolean`),t.device!==void 0&&!M.includes(t.device)&&n.push(`${e}.device must be one of ${M.join("|")}`),t.unlessSeen!==void 0&&typeof t.unlessSeen!="boolean"&&n.push(`${e}.unlessSeen must be a boolean`),t.maxShows!==void 0&&(typeof t.maxShows!="number"||t.maxShows<0)&&n.push(`${e}.maxShows must be a non-negative number`)}function ut(t,e,n){if(!h(t)){n.push(`${e} must be an object`);return}F.includes(t.type)||n.push(`${e}.type must be one of ${F.join("|")}`),t.url!==void 0&&typeof t.url!="string"&&n.push(`${e}.url must be a string`),t.value!==void 0&&typeof t.value!="string"&&n.push(`${e}.value must be a string`)}function ct(t){const e=[];if(!h(t))return{ok:!1,errors:["tour must be an object"]};if((typeof t.id!="string"||t.id.length===0)&&e.push("tour.id must be a non-empty string"),typeof t.schemaVersion!="number"&&e.push("tour.schemaVersion must be a number"),D(t.title)||e.push('tour.title must be a localized text with a string "default"'),Array.isArray(t.steps)?t.steps.length===0?e.push("tour.steps must contain at least one step"):t.steps.forEach((n,o)=>{if(!h(n)){e.push(`steps[${o}] must be an object`);return}(typeof n.id!="string"||n.id.length===0)&&e.push(`steps[${o}].id must be a non-empty string`),(!Array.isArray(n.selectors)||n.selectors.length===0||!n.selectors.every(i=>typeof i=="string"&&i.length>0))&&e.push(`steps[${o}].selectors must be a non-empty array of non-empty strings`),D(n.content)||e.push(`steps[${o}].content must be a localized text with a string "default"`),n.placement!==void 0&&!P.includes(n.placement)&&e.push(`steps[${o}].placement must be one of ${P.join("|")}`),n.align!==void 0&&!z.includes(n.align)&&e.push(`steps[${o}].align must be one of ${z.join("|")}`),n.backLabel!==void 0&&typeof n.backLabel!="string"&&e.push(`steps[${o}].backLabel must be a string`),n.nextLabel!==void 0&&typeof n.nextLabel!="string"&&e.push(`steps[${o}].nextLabel must be a string`),n.pageUrl!==void 0&&V(n.pageUrl,`steps[${o}].pageUrl`,e),n.condition!==void 0&&H(n.condition,`steps[${o}].condition`,e),n.action!==void 0&&ut(n.action,`steps[${o}].action`,e)}):e.push("tour.steps must be an array"),t.display!==void 0)if(!h(t.display))e.push("tour.display must be an object");else for(const n of["padding","radius","cardRadius","offset","alignOffset"]){const o=t.display[n];o!==void 0&&(typeof o!="number"||o<0)&&e.push(`tour.display.${n} must be a non-negative number`)}return t.rules!==void 0&&(Array.isArray(t.rules)?t.rules.forEach((n,o)=>{if(!h(n)){e.push(`rules[${o}] must be an object`);return}n.tourId!==void 0&&typeof n.tourId!="string"&&e.push(`rules[${o}].tourId must be a string`),n.when===void 0?e.push(`rules[${o}].when is required`):H(n.when,`rules[${o}].when`,e)}):e.push("tour.rules must be an array")),e.length>0?{ok:!1,errors:e}:{ok:!0,tour:t}}function ft(t,e,n){const o={top:t.top,bottom:n.height-t.bottom,left:t.left,right:n.width-t.right},i={top:e.height,bottom:e.height,left:e.width,right:e.width},d=["bottom","top","right","left"],l=d.find(s=>o[s]>=i[s]+8);return l||d.reduce((s,u)=>o[u]>o[s]?u:s,d[0])}function pt(t){const{target:e,card:n,offset:o,viewport:i}=t,d=t.side==="auto",l=d?ft(e,n,i):t.side,s=d?"center":t.align,u=t.alignOffset??0,a=s==="start"?u:s==="end"?-u:0;let p=0,f=0;return l==="top"||l==="bottom"?(p=l==="top"?e.top-n.height-o:e.bottom+o,f=s==="start"?e.left:s==="end"?e.right-n.width:e.left+e.width/2-n.width/2,f+=a):(f=l==="left"?e.left-n.width-o:e.right+o,p=s==="start"?e.top:s==="end"?e.bottom-n.height:e.top+e.height/2-n.height/2,p+=a),f=Math.max(8,Math.min(f,i.width-n.width-8)),p=Math.max(8,Math.min(p,i.height-n.height-8)),{top:p,left:f}}function B(t){const e=document.createElement("button");return e.type="button",e.className=`tours-card__btn${t.primary?" tours-card__btn--primary":""}${t.disabled?" tours-card__btn--disabled":""}`,e.textContent=t.label,!t.disabled&&t.onClick&&e.addEventListener("click",t.onClick),e}function gt(t){const e=document.createElement("div");e.className=`tours-card${t.ghost?" tours-card--ghost":""}`,t.radius!=null&&(e.style.borderRadius=`${t.radius}px`);{const o=document.createElement("button");o.className="tours-card__close",o.type="button",o.textContent="×",o.setAttribute("aria-label","Close"),t.onClose&&o.addEventListener("click",t.onClose),e.appendChild(o)}const n=document.createElement("div");if(n.className="tours-card__content",t.contentHtml!=null?n.innerHTML=t.contentHtml:n.textContent=t.contentText??"",e.appendChild(n),t.back||t.next||t.progress){const o=document.createElement("div");if(o.className="tours-card__footer",t.back&&o.appendChild(B(t.back)),t.progress){const i=document.createElement("span");i.className="tours-card__progress",i.textContent=t.progress,o.appendChild(i)}t.next&&o.appendChild(B(t.next)),e.appendChild(o)}return e}const ht=`
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
`;function mt(t){const e=t.replace(/[.+^${}()|[\]\\]/g,"\\$&").replace(/\*\*/g,"\0").replace(/\*/g,"[^/]*").replace(/ /g,".*").replace(/\?/g,".");return new RegExp(`^${e}$`)}function G(t,e){if(!t)return!0;if(t.regex)try{return new RegExp(t.regex).test(e)}catch{return!1}if(t.glob)try{return mt(t.glob).test(e)}catch{return!1}return!0}const L="tours:locationchange";let Y=!1;function bt(){if(!Y){Y=!0;for(const t of["pushState","replaceState"]){const e=history[t];history[t]=function(...o){const i=e.apply(this,o);return window.dispatchEvent(new Event(L)),i}}}}function yt(t){return bt(),window.addEventListener("popstate",t),window.addEventListener("hashchange",t),window.addEventListener(L,t),()=>{window.removeEventListener("popstate",t),window.removeEventListener("hashchange",t),window.removeEventListener(L,t)}}const S="tours:progress";function wt(){return{get(t){try{return localStorage.getItem(t)}catch{return null}},set(t,e){try{localStorage.setItem(t,e)}catch{}},remove(t){try{localStorage.removeItem(t)}catch{}}}}function xt(t){const e=t.get(S);if(!e)return null;try{const n=JSON.parse(e);if(typeof n?.tourId=="string"&&typeof n?.index=="number")return n}catch{}return null}function vt(t,e){t.set(S,JSON.stringify(e))}function q(t){t.remove(S)}function j(t,e={}){const n=lt("player"),o=e.state;let i=null,d=null,l=null,s=null,u=!1,a=0,p=null;const f=t.display?.padding??O,Ot=t.display?.radius??U,Ut=t.display?.cardRadius??N,Nt=t.display?.offset??I;function Z(r){return k(r.selectors)}function C(r){return G(r.pageUrl,window.location.href)}function E(){o&&vt(o,{tourId:t.id,index:a})}function tt(){if(i)return;i=document.createElement("div"),i.setAttribute("data-tours-player",""),d=i.attachShadow({mode:"open"});const r=document.createElement("style");r.textContent=w+ht,d.appendChild(r);const c=document.createElement("div");c.className="tours-backdrop",d.appendChild(c),l=document.createElement("div"),l.className="tours-spotlight",l.style.borderRadius=`${Ot}px`,d.appendChild(l),document.body.appendChild(i)}function et(r){l&&(l.style.display="block",l.style.left=`${r.left-f}px`,l.style.top=`${r.top-f}px`,l.style.width=`${r.width+f*2}px`,l.style.height=`${r.height+f*2}px`)}function nt(r,c){if(!s)return;const g={top:r.top-f,left:r.left-f,right:r.right+f,bottom:r.bottom+f,width:r.width+f*2,height:r.height+f*2},{top:R,left:Mt}=pt({target:g,card:{width:s.offsetWidth,height:s.offsetHeight},side:c.placement??"bottom",align:c.align??"center",offset:Nt,alignOffset:t.display?.alignOffset??0,viewport:{width:window.innerWidth,height:window.innerHeight}});s.style.left=`${Mt}px`,s.style.top=`${R}px`}function It(r){const c=t.steps.length;s&&s.remove(),s=gt({contentText:r.content.default,progress:`Step ${a+1} of ${c}`,onClose:y,radius:Ut,back:{label:r.backLabel??"Back",disabled:a===0,onClick:T},next:{label:r.nextLabel??(a===c-1?"Done":"Next"),primary:!0,onClick:A}}),d?.appendChild(s)}function b(){if(!u)return;const r=t.steps[a];if(!r){y();return}n.log("render step",a,r.id);const c=Z(r);if(!c){n.log(`step "${r.id}" target not found yet — waiting`,r.selectors),at(r.selectors,{timeout:4e3}).then(R=>{!u||t.steps[a]!==r||(R?b():(n.warn(`step "${r.id}" skipped: no element for selectors`,r.selectors),a<t.steps.length-1?(a+=1,b()):y()))});return}tt(),c.scrollIntoView({behavior:"smooth",block:"center",inline:"center"}),It(r);const g=c.getBoundingClientRect();et(g),nt(g,r)}function ot(r){u&&(r.key==="Escape"?(r.preventDefault(),y()):r.key==="ArrowRight"?A():r.key==="ArrowLeft"&&T())}function $(){if(!u)return;const r=t.steps[a];if(!r)return;const c=Z(r);if(!c)return;const g=c.getBoundingClientRect();et(g),nt(g,r)}function Dt(r=0){u||t.steps.length!==0&&(u=!0,a=Math.max(0,Math.min(r,t.steps.length-1)),n.log("start",t.id,`at ${a}/${t.steps.length}`),tt(),window.addEventListener("keydown",ot,!0),window.addEventListener("resize",$,!0),window.addEventListener("scroll",$,!0),E(),b())}function Pt(){l&&(l.style.display="none"),s&&(s.remove(),s=null)}function zt(){Pt(),!p&&(p=yt(()=>{if(!u){p?.(),p=null;return}const r=t.steps[a];r&&C(r)&&(p?.(),p=null,b())}))}function rt(){p&&(p(),p=null),u&&(u=!1,window.removeEventListener("keydown",ot,!0),window.removeEventListener("resize",$,!0),window.removeEventListener("scroll",$,!0),i&&i.parentNode&&i.parentNode.removeChild(i),i=null,d=null,l=null,s=null)}function y(){n.log("stop"),rt(),o&&q(o)}function A(){if(!u)return;const r=a+1,c=t.steps[r];if(!c){y();return}if(C(c)){a=r,E(),b();return}a=r,E();const g=t.steps[a-1]?.action;if(g&&g.type==="navigate"&&g.url){n.log("page transition (navigate) → resume at",a),rt(),window.location.assign(g.url);return}n.log("page transition (wait) → resume at",a),zt()}function T(){if(!u)return;const r=t.steps[a-1];!r||!C(r)||(a-=1,E(),b())}return{start:Dt,stop:y,next:A,prev:T}}function Et(t,e={}){const n=e.state;if(!n)return null;const o=xt(n);if(!o||o.tourId!==t.id)return null;const i=t.steps[o.index];if(!i)return q(n),null;if(!G(i.pageUrl,window.location.href))return null;const d=j(t,{state:n});return d.start(o.index),d}let $t=0;function kt(t){const e=typeof crypto<"u"&&"randomUUID"in crypto?crypto.randomUUID():`${$t++}`;return`${t}-${e}`}function _t(t="step"){return{id:kt("step"),type:t,included:!0,selectors:[],content:"",page:"",placement:"auto",align:"center",backLabel:"Back",nextLabel:"Next"}}function Lt(t){if(!Array.isArray(t))return[];const e=[];for(const n of t){if(!n||typeof n!="object")continue;const o=n;typeof o.id!="string"||!Array.isArray(o.steps)||e.push({id:o.id,kind:o.kind==="template"?"template":"tour",name:typeof o.name=="string"?o.name:"Untitled tour",status:o.status==="published"?"published":"draft",display:{padding:v(o.display?.padding,O),radius:v(o.display?.radius,U),cardRadius:v(o.display?.cardRadius,N),offset:v(o.display?.offset,I),alignOffset:v(o.display?.alignOffset,0)},steps:o.steps.filter(i=>!!i&&typeof i=="object").map(i=>({..._t(i.type==="action"?"action":"step"),...i}))})}return e}function v(t,e){return typeof t=="number"&&t>=0?t:e}function St(t){const e=t.steps.filter(o=>o.included&&o.selectors.length>0).map(o=>({id:o.id,selectors:o.selectors,content:{default:o.content},placement:o.placement,align:o.align,backLabel:o.backLabel,nextLabel:o.nextLabel,...o.page?{pageUrl:{glob:o.page}}:{}})),n={id:t.id,schemaVersion:dt,title:{default:t.name},steps:e,display:{padding:t.display.padding,radius:t.display.radius,cardRadius:t.display.cardRadius,offset:t.display.offset,alignOffset:t.display.alignOffset}};return ct(n)}const W=wt();function Ct(){return window.SiteToursFront_data??{}}function J(){return Lt(Ct().drafts).filter(t=>t.status==="published"&&t.kind==="tour")}function At(){return J().map(t=>({id:t.id,name:t.name}))}function K(){const t=[];for(const e of J()){const n=St(e);n.ok&&t.push(n.tour)}return t}function X(t){const e=K(),n=t?e.find(o=>o.id===t):e[0];if(!n){console.warn("[tours] no published tour to run",t??"");return}j(n,{state:W}).start()}function Tt(){for(const t of K())if(Et(t,{state:W}))break}function Rt(){for(const t of Array.from(document.querySelectorAll("[data-site-tour]")))t.dataset.siteToursBound||(t.dataset.siteToursBound="1",t.addEventListener("click",()=>X(t.dataset.siteTour||void 0)))}function Q(){Rt(),Tt()}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Q):Q(),m.list=At,m.run=X,Object.defineProperty(m,Symbol.toStringTag,{value:"Module"})}));
