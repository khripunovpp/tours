(function(b,E){typeof exports=="object"&&typeof module<"u"?E(exports):typeof define=="function"&&define.amd?define(["exports"],E):(b=typeof globalThis<"u"?globalThis:b||self,E(b.SiteToursFront={}))})(this,(function(b){"use strict";const E=`
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
`,pt="a, button, summary, label, h1, h2, h3, h4, h5, h6";function gt(t,e){if(t.startsWith("text=")){const n=t.slice(5).trim();for(const o of Array.from(e.querySelectorAll(pt)))if((o.textContent??"").replace(/\s+/g," ").trim()===n)return o;return null}try{return e.querySelector(t)}catch{return null}}function T(t,e=document){for(const n of t){const o=gt(n,e);if(o)return o}return null}function F(t,e={}){const n=e.root??document,o=T(t,n);return o?Promise.resolve(o):new Promise(i=>{let s=!1,u;const c=l=>{s||(s=!0,d.disconnect(),u&&clearTimeout(u),i(l))},d=new MutationObserver(()=>{const l=T(t,n);l&&c(l)});d.observe(document.documentElement,{childList:!0,subtree:!0,attributes:!0});const a=e.timeout??4e3;a>0&&Number.isFinite(a)&&(u=setTimeout(()=>c(null),a))})}let _=null;function A(){if(_!==null)return _;try{_=new URLSearchParams(window.location.search).has("use_logs")}catch{_=!1}return _}function ht(t){const e=`[tours:${t}]`;return{log:(...n)=>{A()&&console.log(e,...n)},warn:(...n)=>{A()&&console.warn(e,...n)},error:(...n)=>{A()&&console.error(e,...n)}}}const B=6,H=6,Y=10,G=12,mt=1;function m(t){return typeof t=="object"&&t!==null&&!Array.isArray(t)}function W(t){return m(t)&&typeof t.default=="string"}const q=["top","bottom","left","right","auto"],X=["start","center","end"],j=["mobile","tablet","desktop"],J=["click","input","navigate","none"];function K(t,e,n){if(!m(t)){n.push(`${e} must be an object`);return}const o=typeof t.glob=="string"&&t.glob.length>0,i=typeof t.regex=="string"&&t.regex.length>0;if(!o&&!i&&n.push(`${e} must have a non-empty "glob" or "regex"`),i)try{new RegExp(t.regex)}catch{n.push(`${e}.regex is not a valid regular expression`)}}function Q(t,e,n){if(!m(t)){n.push(`${e} must be an object`);return}t.url!==void 0&&K(t.url,`${e}.url`,n),t.role!==void 0&&typeof t.role!="string"&&n.push(`${e}.role must be a string`),t.firstVisitOnly!==void 0&&typeof t.firstVisitOnly!="boolean"&&n.push(`${e}.firstVisitOnly must be a boolean`),t.device!==void 0&&!j.includes(t.device)&&n.push(`${e}.device must be one of ${j.join("|")}`),t.unlessSeen!==void 0&&typeof t.unlessSeen!="boolean"&&n.push(`${e}.unlessSeen must be a boolean`),t.maxShows!==void 0&&(typeof t.maxShows!="number"||t.maxShows<0)&&n.push(`${e}.maxShows must be a non-negative number`)}function bt(t,e,n){if(!m(t)){n.push(`${e} must be an object`);return}J.includes(t.type)||n.push(`${e}.type must be one of ${J.join("|")}`),t.url!==void 0&&typeof t.url!="string"&&n.push(`${e}.url must be a string`),t.value!==void 0&&typeof t.value!="string"&&n.push(`${e}.value must be a string`)}function yt(t){const e=[];if(!m(t))return{ok:!1,errors:["tour must be an object"]};if((typeof t.id!="string"||t.id.length===0)&&e.push("tour.id must be a non-empty string"),typeof t.schemaVersion!="number"&&e.push("tour.schemaVersion must be a number"),W(t.title)||e.push('tour.title must be a localized text with a string "default"'),Array.isArray(t.steps)?t.steps.length===0?e.push("tour.steps must contain at least one step"):t.steps.forEach((n,o)=>{if(!m(n)){e.push(`steps[${o}] must be an object`);return}(typeof n.id!="string"||n.id.length===0)&&e.push(`steps[${o}].id must be a non-empty string`),(!Array.isArray(n.selectors)||n.selectors.length===0||!n.selectors.every(i=>typeof i=="string"&&i.length>0))&&e.push(`steps[${o}].selectors must be a non-empty array of non-empty strings`),W(n.content)||e.push(`steps[${o}].content must be a localized text with a string "default"`),n.placement!==void 0&&!q.includes(n.placement)&&e.push(`steps[${o}].placement must be one of ${q.join("|")}`),n.align!==void 0&&!X.includes(n.align)&&e.push(`steps[${o}].align must be one of ${X.join("|")}`),n.backLabel!==void 0&&typeof n.backLabel!="string"&&e.push(`steps[${o}].backLabel must be a string`),n.nextLabel!==void 0&&typeof n.nextLabel!="string"&&e.push(`steps[${o}].nextLabel must be a string`),n.pageUrl!==void 0&&K(n.pageUrl,`steps[${o}].pageUrl`,e),n.condition!==void 0&&Q(n.condition,`steps[${o}].condition`,e),n.action!==void 0&&bt(n.action,`steps[${o}].action`,e)}):e.push("tour.steps must be an array"),t.trigger!==void 0){const n=t.trigger,o=["manual","load","selector","timer","cta"],i=["bottom-right","bottom-left","top-right","top-left"];!m(n)||typeof n.type!="string"||!o.includes(n.type)?e.push(`tour.trigger.type must be one of ${o.join("|")}`):n.type==="selector"&&(typeof n.selector!="string"||n.selector.length===0)?e.push("tour.trigger.selector must be a non-empty string"):n.type==="timer"&&(typeof n.delay!="number"||n.delay<0)?e.push("tour.trigger.delay must be a non-negative number"):n.type==="cta"&&(typeof n.text!="string"&&e.push("tour.trigger.text must be a string"),typeof n.button!="string"&&e.push("tour.trigger.button must be a string"),i.includes(n.corner)||e.push(`tour.trigger.corner must be one of ${i.join("|")}`),n.offset!==void 0&&(typeof n.offset!="number"||n.offset<0)&&e.push("tour.trigger.offset must be a non-negative number"))}if(t.audience!==void 0&&!["all","auth","guest"].includes(t.audience)&&e.push("tour.audience must be one of all|auth|guest"),t.display!==void 0)if(!m(t.display))e.push("tour.display must be an object");else for(const n of["padding","radius","cardRadius","offset","alignOffset"]){const o=t.display[n];o!==void 0&&(typeof o!="number"||o<0)&&e.push(`tour.display.${n} must be a non-negative number`)}return t.rules!==void 0&&(Array.isArray(t.rules)?t.rules.forEach((n,o)=>{if(!m(n)){e.push(`rules[${o}] must be an object`);return}n.tourId!==void 0&&typeof n.tourId!="string"&&e.push(`rules[${o}].tourId must be a string`),n.when===void 0?e.push(`rules[${o}].when is required`):Q(n.when,`rules[${o}].when`,e)}):e.push("tour.rules must be an array")),e.length>0?{ok:!1,errors:e}:{ok:!0,tour:t}}function xt(t,e,n){const o={top:t.top,bottom:n.height-t.bottom,left:t.left,right:n.width-t.right},i={top:e.height,bottom:e.height,left:e.width,right:e.width},s=["bottom","top","right","left"],u=s.find(c=>o[c]>=i[c]+8);return u||s.reduce((c,d)=>o[d]>o[c]?d:c,s[0])}function wt(t){const{target:e,card:n,offset:o,viewport:i}=t,s=t.side==="auto",u=s?xt(e,n,i):t.side,c=s?"center":t.align,d=t.alignOffset??0,a=c==="start"?d:c==="end"?-d:0;let l=0,g=0;return u==="top"||u==="bottom"?(l=u==="top"?e.top-n.height-o:e.bottom+o,g=c==="start"?e.left:c==="end"?e.right-n.width:e.left+e.width/2-n.width/2,g+=a):(g=u==="left"?e.left-n.width-o:e.right+o,l=c==="start"?e.top:c==="end"?e.bottom-n.height:e.top+e.height/2-n.height/2,l+=a),g=Math.max(8,Math.min(g,i.width-n.width-8)),l=Math.max(8,Math.min(l,i.height-n.height-8)),{top:l,left:g}}function Z(t){const e=document.createElement("button");return e.type="button",e.className=`tours-card__btn${t.primary?" tours-card__btn--primary":""}${t.disabled?" tours-card__btn--disabled":""}`,e.textContent=t.label,!t.disabled&&t.onClick&&e.addEventListener("click",t.onClick),e}function vt(t){const e=document.createElement("div");e.className=`tours-card${t.ghost?" tours-card--ghost":""}`,t.radius!=null&&(e.style.borderRadius=`${t.radius}px`);{const o=document.createElement("button");o.className="tours-card__close",o.type="button",o.textContent="×",o.setAttribute("aria-label","Close"),t.onClose&&o.addEventListener("click",t.onClose),e.appendChild(o)}const n=document.createElement("div");if(n.className="tours-card__content",t.contentHtml!=null?n.innerHTML=t.contentHtml:n.textContent=t.contentText??"",e.appendChild(n),t.back||t.next||t.progress){const o=document.createElement("div");if(o.className="tours-card__footer",t.back&&o.appendChild(Z(t.back)),t.progress){const i=document.createElement("span");i.className="tours-card__progress",i.textContent=t.progress,o.appendChild(i)}t.next&&o.appendChild(Z(t.next)),e.appendChild(o)}return e}const Et=`
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
`;function _t(t){const e=t.replace(/[.+^${}()|[\]\\]/g,"\\$&").replace(/\*\*/g,"\0").replace(/\*/g,"[^/]*").replace(/ /g,".*").replace(/\?/g,".");return new RegExp(`^${e}$`)}function N(t,e){if(!t)return!0;if(t.regex)try{return new RegExp(t.regex).test(e)}catch{return!1}if(t.glob)try{return _t(t.glob).test(e)}catch{return!1}return!0}const R="tours:locationchange";let tt=!1;function kt(){if(!tt){tt=!0;for(const t of["pushState","replaceState"]){const e=history[t];history[t]=function(...o){const i=e.apply(this,o);return window.dispatchEvent(new Event(R)),i}}}}function St(t){return kt(),window.addEventListener("popstate",t),window.addEventListener("hashchange",t),window.addEventListener(R,t),()=>{window.removeEventListener("popstate",t),window.removeEventListener("hashchange",t),window.removeEventListener(R,t)}}const O="tours:progress";function $t(){return{get(t){try{return localStorage.getItem(t)}catch{return null}},set(t,e){try{localStorage.setItem(t,e)}catch{}},remove(t){try{localStorage.removeItem(t)}catch{}}}}function Ct(t){const e=t.get(O);if(!e)return null;try{const n=JSON.parse(e);if(typeof n?.tourId=="string"&&typeof n?.index=="number")return n}catch{}return null}function Lt(t,e){t.set(O,JSON.stringify(e))}function et(t){t.remove(O)}const nt="tours:seen:";function ot(t,e){const n=t.get(nt+e),o=n?parseInt(n,10):0;return Number.isNaN(o)?0:o}function Tt(t,e){t.set(nt+e,String(ot(t,e)+1))}function rt(t,e={}){const n=ht("player"),o=e.state;let i=null,s=null,u=null,c=null,d=!1,a=0,l=0,g=null;const h=t.display?.padding??B,Xt=t.display?.radius??H,jt=t.display?.cardRadius??Y,Jt=t.display?.offset??G;function D(r){return T(r.selectors)}function z(r){return N(r.pageUrl,window.location.href)}function k(){o&&Lt(o,{tourId:t.id,index:a})}function ut(){if(i)return;i=document.createElement("div"),i.setAttribute("data-tours-player",""),s=i.attachShadow({mode:"open"});const r=document.createElement("style");r.textContent=E+Et,s.appendChild(r);const f=document.createElement("div");f.className="tours-backdrop",f.addEventListener("click",p=>{const v=t.steps[a],C=v?D(v):null;if(C){const L=C.getBoundingClientRect();if(p.clientX>=L.left-h&&p.clientX<=L.right+h&&p.clientY>=L.top-h&&p.clientY<=L.bottom+h)return}y()}),s.appendChild(f),u=document.createElement("div"),u.className="tours-spotlight",u.style.borderRadius=`${Xt}px`,s.appendChild(u),document.body.appendChild(i)}function ct(r,f=!1){u&&(u.style.transitionDuration=f?"0ms":"",u.style.display="block",u.style.left=`${r.left-h}px`,u.style.top=`${r.top-h}px`,u.style.width=`${r.width+h*2}px`,u.style.height=`${r.height+h*2}px`)}function lt(r,f){if(!c)return;const p={top:r.top-h,left:r.left-h,right:r.right+h,bottom:r.bottom+h,width:r.width+h*2,height:r.height+h*2},{top:v,left:C}=wt({target:p,card:{width:c.offsetWidth,height:c.offsetHeight},side:f.placement??"bottom",align:f.align??"center",offset:Jt,alignOffset:t.display?.alignOffset??0,viewport:{width:window.innerWidth,height:window.innerHeight}});c.style.left=`${C}px`,c.style.top=`${v}px`}function Kt(r){const f=Math.max(1,t.steps.length-l),p=Math.max(1,Math.min(a+1-l,f));c&&c.remove(),c=vt({contentText:r.content.default,progress:`Step ${p} of ${f}`,onClose:y,radius:jt,back:{label:r.backLabel??"Back",disabled:a===0,onClick:P},next:{label:r.nextLabel??(a===f-1?"Done":"Next"),primary:!0,onClick:V}}),s?.appendChild(c)}function w(){if(!d)return;const r=t.steps[a];if(!r){y();return}n.log("render step",a,r.id);const f=D(r);if(!f){n.log(`step "${r.id}" target not found yet — waiting`,r.selectors),F(r.selectors,{timeout:4e3}).then(v=>{!d||t.steps[a]!==r||(v?w():(n.warn(`step "${r.id}" skipped: no element for selectors`,r.selectors),l+=1,a<t.steps.length-1?(a+=1,w()):y()))});return}ut(),f.scrollIntoView({behavior:"smooth",block:"center",inline:"center"}),Kt(r);const p=f.getBoundingClientRect();ct(p),lt(p,r)}function dt(r){d&&(r.key==="Escape"?(r.preventDefault(),y()):r.key==="ArrowRight"?V():r.key==="ArrowLeft"&&P())}function $(){if(!d)return;const r=t.steps[a];if(!r)return;const f=D(r);if(!f)return;const p=f.getBoundingClientRect();ct(p,!0),lt(p,r)}function Qt(r=0){d||t.steps.length!==0&&(d=!0,a=Math.max(0,Math.min(r,t.steps.length-1)),l=0,n.log("start",t.id,`at ${a}/${t.steps.length}`),ut(),window.addEventListener("keydown",dt,!0),window.addEventListener("resize",$,!0),window.addEventListener("scroll",$,!0),k(),w())}function Zt(){u&&(u.style.display="none"),c&&(c.remove(),c=null)}function M(){Zt(),!g&&(g=St(()=>{if(!d){g?.(),g=null;return}const r=t.steps[a];r&&z(r)&&(g?.(),g=null,w())}))}function ft(){g&&(g(),g=null),d&&(d=!1,window.removeEventListener("keydown",dt,!0),window.removeEventListener("resize",$,!0),window.removeEventListener("scroll",$,!0),i&&i.parentNode&&i.parentNode.removeChild(i),i=null,s=null,u=null,c=null)}function y(){n.log("stop"),ft(),o&&et(o)}function V(){if(!d)return;const r=a+1,f=t.steps[r];if(!f){y();return}if(z(f)){a=r,k(),w();return}a=r,k();const p=t.steps[a-1]?.action;if(p&&p.type==="navigate"&&p.url){p.url.startsWith("#")?(n.log("page transition (hash navigate) → resume at",a),M(),window.location.hash=p.url):(n.log("page transition (navigate) → resume at",a),ft(),window.location.assign(p.url));return}n.log("page transition (wait) → resume at",a),M()}function P(){if(!d)return;const r=t.steps[a-1];if(r){if(z(r)){a-=1,k(),w();return}a-=1,k(),n.log("page transition back → resume at",a),M(),window.history.back()}}return{start:Qt,stop:y,next:V,prev:P}}function At(t,e={}){const n=e.state;if(!n)return null;const o=Ct(n);if(!o||o.tourId!==t.id)return null;const i=t.steps[o.index];if(!i)return et(n),null;if(!N(i.pageUrl,window.location.href))return null;const s=rt(t,{state:n});return s.start(o.index),s}const Nt=`
:host { all: initial; }
.cta {
  position: fixed;
  z-index: 2147483200;
  box-sizing: border-box;
  max-width: 300px;
  padding: 16px 18px;
  font: 14px/1.5 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  color: #111827;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.18);
}
.cta__text { margin: 0 0 12px; padding-right: 18px; }
.cta__btn {
  font: inherit;
  font-weight: 600;
  color: #fff;
  background: #2563eb;
  border: none;
  border-radius: 9px;
  padding: 9px 16px;
  cursor: pointer;
}
.cta__btn:hover { background: #1d4ed8; }
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
`;function Rt(t){const e=t.corner??"bottom-right",n=t.offset??24,o=document.createElement("div");o.setAttribute("data-tours-cta","");const i=o.attachShadow({mode:"open"}),s=document.createElement("style");s.textContent=Nt,i.appendChild(s);const u=document.createElement("div");u.className="cta";const[c,d]=e.split("-");u.style[c]=`${n}px`,u.style[d]=`${n}px`;const a=()=>{o.parentNode&&o.parentNode.removeChild(o)},l=document.createElement("button");l.className="cta__close",l.type="button",l.textContent="×",l.setAttribute("aria-label","Dismiss"),l.addEventListener("click",a);const g=document.createElement("p");g.className="cta__text",g.textContent=t.text;const h=document.createElement("button");return h.className="cta__btn",h.type="button",h.textContent=t.button,h.addEventListener("click",()=>{a(),t.onStart()}),u.append(l,g,h),i.appendChild(u),document.body.appendChild(o),a}function Ot(t,e){const n=t.trigger??{type:"manual"};let o=!1;const i=()=>{o||(o=!0,e())};switch(n.type){case"load":{const s=setTimeout(i,0);return()=>clearTimeout(s)}case"timer":{const s=setTimeout(i,Math.max(0,n.delay));return()=>clearTimeout(s)}case"selector":{let s=!1;return F([n.selector],{timeout:0}).then(u=>{u&&!s&&i()}),()=>{s=!0}}case"cta":{let s=()=>{};return s=Rt({text:n.text,button:n.button,corner:n.corner,offset:n.offset,onStart:i}),s}case"manual":default:return()=>{}}}function Ut(t=window.innerWidth){return t<=640?"mobile":t<=1024?"tablet":"desktop"}function It(t,e){return!(t.url&&!N(t.url,e.url)||t.role!==void 0&&t.role!==e.role||t.firstVisitOnly&&!e.firstVisit||t.device&&t.device!==e.device||t.unlessSeen&&e.seenCount>0||t.maxShows!==void 0&&e.seenCount>=t.maxShows)}function Dt(t,e){return!t||t.length===0?!0:t.some(n=>It(n.when,e))}let zt=0;function Mt(t){const e=typeof crypto<"u"&&"randomUUID"in crypto?crypto.randomUUID():`${zt++}`;return`${t}-${e}`}function Vt(t="step"){return{id:Mt("step"),type:t,included:!0,selectors:[],content:"",page:"",placement:"auto",align:"center",backLabel:"Back",nextLabel:"Next"}}function Pt(t){if(t&&typeof t=="object"){const e=t;if(e.type==="load")return{type:"load"};if(e.type==="selector"&&typeof e.selector=="string")return{type:"selector",selector:e.selector};if(e.type==="timer"&&typeof e.delay=="number")return{type:"timer",delay:e.delay};if(e.type==="cta"&&typeof e.text=="string"&&typeof e.button=="string"){const n=["bottom-right","bottom-left","top-right","top-left"];return{type:"cta",text:e.text,button:e.button,corner:n.includes(e.corner)?e.corner:"bottom-right",offset:typeof e.offset=="number"?e.offset:void 0}}}return{type:"manual"}}function Ft(t){if(!Array.isArray(t))return[];const e=[];for(const n of t){if(!n||typeof n!="object")continue;const o=n;typeof o.id!="string"||!Array.isArray(o.steps)||e.push({id:o.id,kind:o.kind==="template"?"template":"tour",name:typeof o.name=="string"?o.name:"Untitled tour",status:o.status==="published"?"published":"draft",trigger:Pt(o.trigger),audience:o.audience==="auth"||o.audience==="guest"?o.audience:"all",conditions:{firstVisitOnly:(o.conditions?.firstVisitOnly??!0)===!0,maxShows:x(o.conditions?.maxShows,0),device:["mobile","tablet","desktop"].includes(o.conditions?.device)?o.conditions.device:"any"},display:{padding:x(o.display?.padding,B),radius:x(o.display?.radius,H),cardRadius:x(o.display?.cardRadius,Y),offset:x(o.display?.offset,G),alignOffset:x(o.display?.alignOffset,0)},steps:o.steps.filter(i=>!!i&&typeof i=="object").map(i=>({...Vt(i.type==="action"?"action":"step"),...i}))})}return e}function x(t,e){return typeof t=="number"&&t>=0?t:e}function Bt(t){const e=t.steps.filter(s=>s.included&&s.selectors.length>0).map(s=>({id:s.id,selectors:s.selectors,content:{default:s.content},placement:s.placement,align:s.align,backLabel:s.backLabel,nextLabel:s.nextLabel,...s.page?{pageUrl:{glob:s.page}}:{},...s.action?{action:s.action}:{}})),n={};t.conditions.firstVisitOnly&&(n.firstVisitOnly=!0),t.conditions.maxShows>0&&(n.maxShows=t.conditions.maxShows),t.conditions.device!=="any"&&(n.device=t.conditions.device);const o=Object.keys(n).length>0?[{when:n}]:void 0,i={id:t.id,schemaVersion:mt,title:{default:t.name},steps:e,trigger:t.trigger,audience:t.audience,...o?{rules:o}:{},display:{padding:t.display.padding,radius:t.display.radius,cardRadius:t.display.cardRadius,offset:t.display.offset,alignOffset:t.display.alignOffset}};return yt(i)}const S=$t();function it(){return window.SiteToursFront_data??{}}function Ht(t){const e=it().authenticated===!0;return t==="auth"?e:t==="guest"?!e:!0}function st(){return Ft(it().drafts).filter(t=>t.status==="published"&&t.kind==="tour"&&Ht(t.audience))}function Yt(){return st().map(t=>({id:t.id,name:t.name}))}function U(){const t=[];for(const e of st()){const n=Bt(e);n.ok&&t.push(n.tour)}return t}function I(t){const e=U(),n=t?e.find(o=>o.id===t):e[0];if(!n){console.warn("[tours] no published tour to run",t??"");return}rt(n,{state:S}).start()}function Gt(){for(const t of U())if(At(t,{state:S}))return!0;return!1}function Wt(){const t=Ut();for(const e of U()){if(!e.trigger||e.trigger.type==="manual")continue;const n=ot(S,e.id),o={url:window.location.href,device:t,firstVisit:n===0,seenCount:n};Dt(e.rules,o)&&Ot(e,()=>{Tt(S,e.id),I(e.id)})}}function qt(){for(const t of Array.from(document.querySelectorAll("[data-site-tour]")))t.dataset.siteToursBound||(t.dataset.siteToursBound="1",t.addEventListener("click",()=>I(t.dataset.siteTour||void 0)))}function at(){qt(),Gt()||Wt()}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",at):at(),b.list=Yt,b.run=I,Object.defineProperty(b,Symbol.toStringTag,{value:"Module"})}));
