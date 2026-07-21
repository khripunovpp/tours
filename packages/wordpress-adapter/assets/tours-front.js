(function(x,k){typeof exports=="object"&&typeof module<"u"?k(exports):typeof define=="function"&&define.amd?define(["exports"],k):(x=typeof globalThis<"u"?globalThis:x||self,k(x.SiteToursFront={}))})(this,(function(x){"use strict";const k=`
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
`,pt="a, button, summary, label, h1, h2, h3, h4, h5, h6";function gt(t,e){if(t.startsWith("text=")){const n=t.slice(5).trim();for(const o of Array.from(e.querySelectorAll(pt)))if((o.textContent??"").replace(/\s+/g," ").trim()===n)return o;return null}try{return e.querySelector(t)}catch{return null}}function A(t,e=document){for(const n of t){const o=gt(n,e);if(o)return o}return null}function F(t,e={}){const n=e.root??document,o=A(t,n);return o?Promise.resolve(o):new Promise(r=>{let u=!1,a;const c=d=>{u||(u=!0,f.disconnect(),a&&clearTimeout(a),r(d))},f=new MutationObserver(()=>{const d=A(t,n);d&&c(d)});f.observe(document.documentElement,{childList:!0,subtree:!0,attributes:!0});const s=e.timeout??4e3;s>0&&Number.isFinite(s)&&(a=setTimeout(()=>c(null),s))})}let S=null;function N(){if(S!==null)return S;try{S=new URLSearchParams(window.location.search).has("use_logs")}catch{S=!1}return S}function ht(t){const e=`[tours:${t}]`;return{log:(...n)=>{N()&&console.log(e,...n)},warn:(...n)=>{N()&&console.warn(e,...n)},error:(...n)=>{N()&&console.error(e,...n)}}}const B=6,H=6,W=10,Y=12,mt=1;function y(t){return typeof t=="object"&&t!==null&&!Array.isArray(t)}function G(t){return y(t)&&typeof t.default=="string"}const q=["top","bottom","left","right","auto"],X=["start","center","end"],j=["mobile","tablet","desktop"],J=["click","input","navigate","none"];function K(t,e,n){if(!y(t)){n.push(`${e} must be an object`);return}const o=typeof t.glob=="string"&&t.glob.length>0,r=typeof t.regex=="string"&&t.regex.length>0;if(!o&&!r&&n.push(`${e} must have a non-empty "glob" or "regex"`),r)try{new RegExp(t.regex)}catch{n.push(`${e}.regex is not a valid regular expression`)}}function Q(t,e,n){if(!y(t)){n.push(`${e} must be an object`);return}t.url!==void 0&&K(t.url,`${e}.url`,n),t.role!==void 0&&typeof t.role!="string"&&n.push(`${e}.role must be a string`),t.firstVisitOnly!==void 0&&typeof t.firstVisitOnly!="boolean"&&n.push(`${e}.firstVisitOnly must be a boolean`),t.device!==void 0&&!j.includes(t.device)&&n.push(`${e}.device must be one of ${j.join("|")}`),t.unlessSeen!==void 0&&typeof t.unlessSeen!="boolean"&&n.push(`${e}.unlessSeen must be a boolean`),t.maxShows!==void 0&&(typeof t.maxShows!="number"||t.maxShows<0)&&n.push(`${e}.maxShows must be a non-negative number`)}function bt(t,e,n){if(!y(t)){n.push(`${e} must be an object`);return}J.includes(t.type)||n.push(`${e}.type must be one of ${J.join("|")}`),t.url!==void 0&&typeof t.url!="string"&&n.push(`${e}.url must be a string`),t.value!==void 0&&typeof t.value!="string"&&n.push(`${e}.value must be a string`)}function yt(t){const e=[];if(!y(t))return{ok:!1,errors:["tour must be an object"]};if((typeof t.id!="string"||t.id.length===0)&&e.push("tour.id must be a non-empty string"),typeof t.schemaVersion!="number"&&e.push("tour.schemaVersion must be a number"),G(t.title)||e.push('tour.title must be a localized text with a string "default"'),Array.isArray(t.steps)?t.steps.length===0?e.push("tour.steps must contain at least one step"):t.steps.forEach((n,o)=>{if(!y(n)){e.push(`steps[${o}] must be an object`);return}(typeof n.id!="string"||n.id.length===0)&&e.push(`steps[${o}].id must be a non-empty string`),(!Array.isArray(n.selectors)||n.selectors.length===0||!n.selectors.every(r=>typeof r=="string"&&r.length>0))&&e.push(`steps[${o}].selectors must be a non-empty array of non-empty strings`),G(n.content)||e.push(`steps[${o}].content must be a localized text with a string "default"`),n.placement!==void 0&&!q.includes(n.placement)&&e.push(`steps[${o}].placement must be one of ${q.join("|")}`),n.align!==void 0&&!X.includes(n.align)&&e.push(`steps[${o}].align must be one of ${X.join("|")}`),n.backLabel!==void 0&&typeof n.backLabel!="string"&&e.push(`steps[${o}].backLabel must be a string`),n.nextLabel!==void 0&&typeof n.nextLabel!="string"&&e.push(`steps[${o}].nextLabel must be a string`),n.pageUrl!==void 0&&K(n.pageUrl,`steps[${o}].pageUrl`,e),n.condition!==void 0&&Q(n.condition,`steps[${o}].condition`,e),n.action!==void 0&&bt(n.action,`steps[${o}].action`,e)}):e.push("tour.steps must be an array"),t.trigger!==void 0){const n=t.trigger,o=["manual","load","selector","timer","cta"],r=["bottom-right","bottom-left","top-right","top-left"];!y(n)||typeof n.type!="string"||!o.includes(n.type)?e.push(`tour.trigger.type must be one of ${o.join("|")}`):n.type==="selector"&&(typeof n.selector!="string"||n.selector.length===0)?e.push("tour.trigger.selector must be a non-empty string"):n.type==="timer"&&(typeof n.delay!="number"||n.delay<0)?e.push("tour.trigger.delay must be a non-negative number"):n.type==="cta"&&(typeof n.text!="string"&&e.push("tour.trigger.text must be a string"),typeof n.button!="string"&&e.push("tour.trigger.button must be a string"),r.includes(n.corner)||e.push(`tour.trigger.corner must be one of ${r.join("|")}`),n.offset!==void 0&&(typeof n.offset!="number"||n.offset<0)&&e.push("tour.trigger.offset must be a non-negative number"))}if(t.audience!==void 0&&!["all","auth","guest"].includes(t.audience)&&e.push("tour.audience must be one of all|auth|guest"),t.display!==void 0)if(!y(t.display))e.push("tour.display must be an object");else for(const n of["padding","radius","cardRadius","offset","alignOffset"]){const o=t.display[n];o!==void 0&&(typeof o!="number"||o<0)&&e.push(`tour.display.${n} must be a non-negative number`)}return t.rules!==void 0&&(Array.isArray(t.rules)?t.rules.forEach((n,o)=>{if(!y(n)){e.push(`rules[${o}] must be an object`);return}n.tourId!==void 0&&typeof n.tourId!="string"&&e.push(`rules[${o}].tourId must be a string`),n.when===void 0?e.push(`rules[${o}].when is required`):Q(n.when,`rules[${o}].when`,e)}):e.push("tour.rules must be an array")),e.length>0?{ok:!1,errors:e}:{ok:!0,tour:t}}function xt(t,e,n){const o={top:t.top,bottom:n.height-t.bottom,left:t.left,right:n.width-t.right},r={top:e.height,bottom:e.height,left:e.width,right:e.width},u=["bottom","top","right","left"],a=u.find(c=>o[c]>=r[c]+8);return a||u.reduce((c,f)=>o[f]>o[c]?f:c,u[0])}function wt(t){const{target:e,card:n,offset:o,viewport:r}=t,u=t.side==="auto",a=u?xt(e,n,r):t.side,c=u?"center":t.align,f=t.alignOffset??0,s=c==="start"?f:c==="end"?-f:0;let d=0,p=0;return a==="top"||a==="bottom"?(d=a==="top"?e.top-n.height-o:e.bottom+o,p=c==="start"?e.left:c==="end"?e.right-n.width:e.left+e.width/2-n.width/2,p+=s):(p=a==="left"?e.left-n.width-o:e.right+o,d=c==="start"?e.top:c==="end"?e.bottom-n.height:e.top+e.height/2-n.height/2,d+=s),p=Math.max(8,Math.min(p,r.width-n.width-8)),d=Math.max(8,Math.min(d,r.height-n.height-8)),{top:d,left:p}}function Z(t){const e=document.createElement("button");return e.type="button",e.className=`tours-card__btn${t.primary?" tours-card__btn--primary":""}${t.disabled?" tours-card__btn--disabled":""}`,e.textContent=t.label,!t.disabled&&t.onClick&&e.addEventListener("click",t.onClick),e}function vt(t){const e=document.createElement("div");e.className=`tours-card${t.ghost?" tours-card--ghost":""}`,t.radius!=null&&(e.style.borderRadius=`${t.radius}px`);{const o=document.createElement("button");o.className="tours-card__close",o.type="button",o.textContent="×",o.setAttribute("aria-label","Close"),t.onClose&&o.addEventListener("click",t.onClose),e.appendChild(o)}const n=document.createElement("div");if(n.className="tours-card__content",t.contentHtml!=null?n.innerHTML=t.contentHtml:n.textContent=t.contentText??"",e.appendChild(n),t.back||t.next||t.progress){const o=document.createElement("div");if(o.className="tours-card__footer",t.back&&o.appendChild(Z(t.back)),t.progress){const r=document.createElement("span");r.className="tours-card__progress",r.textContent=t.progress,o.appendChild(r)}t.next&&o.appendChild(Z(t.next)),e.appendChild(o)}return e}const Et=`
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
`;function _t(t){const e=t.replace(/[.+^${}()|[\]\\]/g,"\\$&").replace(/\*\*/g,"\0").replace(/\*/g,"[^/]*").replace(/ /g,".*").replace(/\?/g,".");return new RegExp(`^${e}$`)}function R(t,e){if(!t)return!0;if(t.regex)try{return new RegExp(t.regex).test(e)}catch{return!1}if(t.glob)try{return _t(t.glob).test(e)}catch{return!1}return!0}function kt(t){if(!t||!t.glob)return null;const e=t.glob.replace(/\*+/g,"");return/^https?:\/\//i.test(e)||e.startsWith("#")||e.startsWith("/")?e:null}const O="tours:locationchange";let tt=!1;function St(){if(!tt){tt=!0;for(const t of["pushState","replaceState"]){const e=history[t];history[t]=function(...o){const r=e.apply(this,o);return window.dispatchEvent(new Event(O)),r}}}}function $t(t){return St(),window.addEventListener("popstate",t),window.addEventListener("hashchange",t),window.addEventListener(O,t),()=>{window.removeEventListener("popstate",t),window.removeEventListener("hashchange",t),window.removeEventListener(O,t)}}const U="tours:progress";function Ct(){return{get(t){try{return localStorage.getItem(t)}catch{return null}},set(t,e){try{localStorage.setItem(t,e)}catch{}},remove(t){try{localStorage.removeItem(t)}catch{}}}}function Lt(t){const e=t.get(U);if(!e)return null;try{const n=JSON.parse(e);if(typeof n?.tourId=="string"&&typeof n?.index=="number")return n}catch{}return null}function Tt(t,e){t.set(U,JSON.stringify(e))}function et(t){t.remove(U)}const nt="tours:seen:";function ot(t,e){const n=t.get(nt+e),o=n?parseInt(n,10):0;return Number.isNaN(o)?0:o}function At(t,e){t.set(nt+e,String(ot(t,e)+1))}function rt(t,e={}){const n=ht("player"),o=e.state;let r=null,u=null,a=null,c=null,f=!1,s=0,d=0,p=null;const g=t.display?.padding??B,Jt=t.display?.radius??H,Kt=t.display?.cardRadius??W,Qt=t.display?.offset??Y;function z(i){return A(i.selectors)}function M(i){return R(i.pageUrl,window.location.href)}function $(){o&&Tt(o,{tourId:t.id,index:s})}function ut(){if(r)return;r=document.createElement("div"),r.setAttribute("data-tours-player",""),u=r.attachShadow({mode:"open"});const i=document.createElement("style");i.textContent=k+Et,u.appendChild(i);const l=document.createElement("div");l.className="tours-backdrop",l.addEventListener("click",h=>{const m=t.steps[s],b=m?z(m):null;if(b){const v=b.getBoundingClientRect();if(h.clientX>=v.left-g&&h.clientX<=v.right+g&&h.clientY>=v.top-g&&h.clientY<=v.bottom+g)return}w()}),u.appendChild(l),a=document.createElement("div"),a.className="tours-spotlight",a.style.borderRadius=`${Jt}px`,u.appendChild(a),document.body.appendChild(r)}function ct(i,l=!1){a&&(a.style.transitionDuration=l?"0ms":"",a.style.display="block",a.style.left=`${i.left-g}px`,a.style.top=`${i.top-g}px`,a.style.width=`${i.width+g*2}px`,a.style.height=`${i.height+g*2}px`)}function lt(i,l){if(!c)return;const h={top:i.top-g,left:i.left-g,right:i.right+g,bottom:i.bottom+g,width:i.width+g*2,height:i.height+g*2},{top:m,left:b}=wt({target:h,card:{width:c.offsetWidth,height:c.offsetHeight},side:l.placement??"bottom",align:l.align??"center",offset:Qt,alignOffset:t.display?.alignOffset??0,viewport:{width:window.innerWidth,height:window.innerHeight}});c.style.left=`${b}px`,c.style.top=`${m}px`}function Zt(i){const l=Math.max(1,t.steps.length-d),h=Math.max(1,Math.min(s+1-d,l));c&&c.remove(),c=vt({contentText:i.content.default,progress:`Step ${h} of ${l}`,onClose:w,radius:Kt,back:{label:i.backLabel??"Back",disabled:s===0,onClick:P},next:{label:i.nextLabel??(s===l-1?"Done":"Next"),primary:!0,onClick:V}}),u?.appendChild(c)}function _(){if(!f)return;const i=t.steps[s];if(!i){w();return}n.log("render step",s,i.id);const l=z(i);if(!l){n.log(`step "${i.id}" target not found yet — waiting`,i.selectors),F(i.selectors,{timeout:4e3}).then(m=>{!f||t.steps[s]!==i||(m?_():(n.warn(`step "${i.id}" skipped: no element for selectors`,i.selectors),d+=1,s<t.steps.length-1?(s+=1,_()):w()))});return}ut(),l.scrollIntoView({behavior:"smooth",block:"center",inline:"center"}),Zt(i);const h=l.getBoundingClientRect();ct(h),lt(h,i)}function dt(i){f&&(i.key==="Escape"?(i.preventDefault(),w()):i.key==="ArrowRight"?V():i.key==="ArrowLeft"&&P())}function L(){if(!f)return;const i=t.steps[s];if(!i)return;const l=z(i);if(!l)return;const h=l.getBoundingClientRect();ct(h,!0),lt(h,i)}function te(i=0){f||t.steps.length!==0&&(f=!0,s=Math.max(0,Math.min(i,t.steps.length-1)),d=0,n.log("start",t.id,`at ${s}/${t.steps.length}`),ut(),window.addEventListener("keydown",dt,!0),window.addEventListener("resize",L,!0),window.addEventListener("scroll",L,!0),$(),_())}function ee(){a&&(a.style.display="none"),c&&(c.remove(),c=null)}function T(){ee(),!p&&(p=$t(()=>{if(!f){p?.(),p=null;return}const i=t.steps[s];i&&M(i)&&(p?.(),p=null,_())}))}function ft(){p&&(p(),p=null),f&&(f=!1,window.removeEventListener("keydown",dt,!0),window.removeEventListener("resize",L,!0),window.removeEventListener("scroll",L,!0),r&&r.parentNode&&r.parentNode.removeChild(r),r=null,u=null,a=null,c=null)}function w(){n.log("stop"),ft(),o&&et(o)}function V(){if(!f)return;const i=s+1,l=t.steps[i];if(!l){w();return}if(M(l)){s=i,$(),_();return}s=i,$();const h=v=>{ft(),e.onNavigate?e.onNavigate(v,l.id):window.location.assign(v)},m=t.steps[s-1]?.action;if(m&&m.type==="navigate"&&m.url){m.url.startsWith("#")?(n.log("page transition (hash navigate) → resume at",s),T(),window.location.hash=m.url):(n.log("page transition (navigate) → resume at",s),h(m.url));return}const b=kt(l.pageUrl);if(b){b.startsWith("#")?(n.log("page transition (derived hash) → resume at",s),T(),window.location.hash=b):(n.log("page transition (derived navigate) → resume at",s,b),h(b));return}n.log("page transition (wait) → resume at",s),T()}function P(){if(!f)return;const i=t.steps[s-1];if(i){if(M(i)){s-=1,$(),_();return}s-=1,$(),n.log("page transition back → resume at",s),T(),window.history.back()}}return{start:te,stop:w,next:V,prev:P}}function Nt(t,e={}){const n=e.state;if(!n)return null;const o=Lt(n);if(!o||o.tourId!==t.id)return null;const r=t.steps[o.index];if(!r)return et(n),null;if(!R(r.pageUrl,window.location.href))return null;const u=rt(t,{state:n});return u.start(o.index),u}const Rt=`
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
`;function Ot(t){const e=t.corner??"bottom-right",n=t.offset??24,o=document.createElement("div");o.setAttribute("data-tours-cta","");const r=o.attachShadow({mode:"open"}),u=document.createElement("style");u.textContent=Rt,r.appendChild(u);const a=document.createElement("div");a.className="cta";const[c,f]=e.split("-");a.style[c]=`${n}px`,a.style[f]=`${n}px`;const s=()=>{o.parentNode&&o.parentNode.removeChild(o)},d=document.createElement("button");d.className="cta__close",d.type="button",d.textContent="×",d.setAttribute("aria-label","Dismiss"),d.addEventListener("click",s);const p=document.createElement("p");p.className="cta__text",p.textContent=t.text;const g=document.createElement("button");return g.className="cta__btn",g.type="button",g.textContent=t.button,g.addEventListener("click",()=>{s(),t.onStart()}),a.append(d,p,g),r.appendChild(a),document.body.appendChild(o),s}function Ut(t,e){const n=t.trigger??{type:"manual"};let o=!1;const r=()=>{o||(o=!0,e())};switch(n.type){case"load":{const u=setTimeout(r,0);return()=>clearTimeout(u)}case"timer":{const u=setTimeout(r,Math.max(0,n.delay));return()=>clearTimeout(u)}case"selector":{let u=!1;return F([n.selector],{timeout:0}).then(a=>{a&&!u&&r()}),()=>{u=!0}}case"cta":{let u=()=>{};return u=Ot({text:n.text,button:n.button,corner:n.corner,offset:n.offset,onStart:r}),u}case"manual":default:return()=>{}}}function It(t=window.innerWidth){return t<=640?"mobile":t<=1024?"tablet":"desktop"}function Dt(t,e){return!(t.url&&!R(t.url,e.url)||t.role!==void 0&&t.role!==e.role||t.firstVisitOnly&&!e.firstVisit||t.device&&t.device!==e.device||t.unlessSeen&&e.seenCount>0||t.maxShows!==void 0&&e.seenCount>=t.maxShows)}function zt(t,e){return!t||t.length===0?!0:t.some(n=>Dt(n.when,e))}let Mt=0;function Vt(t){const e=typeof crypto<"u"&&"randomUUID"in crypto?crypto.randomUUID():`${Mt++}`;return`${t}-${e}`}function Pt(t="step"){return{id:Vt("step"),type:t,included:!0,selectors:[],content:"",page:"",placement:"auto",align:"center",backLabel:"Back",nextLabel:"Next"}}function Ft(t){if(t&&typeof t=="object"){const e=t;if(e.type==="load")return{type:"load"};if(e.type==="selector"&&typeof e.selector=="string")return{type:"selector",selector:e.selector};if(e.type==="timer"&&typeof e.delay=="number")return{type:"timer",delay:e.delay};if(e.type==="cta"&&typeof e.text=="string"&&typeof e.button=="string"){const n=["bottom-right","bottom-left","top-right","top-left"];return{type:"cta",text:e.text,button:e.button,corner:n.includes(e.corner)?e.corner:"bottom-right",offset:typeof e.offset=="number"?e.offset:void 0}}}return{type:"manual"}}function Bt(t){if(!Array.isArray(t))return[];const e=[];for(const n of t){if(!n||typeof n!="object")continue;const o=n;typeof o.id!="string"||!Array.isArray(o.steps)||e.push({id:o.id,kind:o.kind==="template"?"template":"tour",name:typeof o.name=="string"?o.name:"Untitled tour",status:o.status==="published"?"published":"draft",trigger:Ft(o.trigger),audience:o.audience==="auth"||o.audience==="guest"?o.audience:"all",conditions:{firstVisitOnly:(o.conditions?.firstVisitOnly??!0)===!0,maxShows:E(o.conditions?.maxShows,0),device:["mobile","tablet","desktop"].includes(o.conditions?.device)?o.conditions.device:"any"},display:{padding:E(o.display?.padding,B),radius:E(o.display?.radius,H),cardRadius:E(o.display?.cardRadius,W),offset:E(o.display?.offset,Y),alignOffset:E(o.display?.alignOffset,0)},steps:o.steps.filter(r=>!!r&&typeof r=="object").map(r=>({...Pt(r.type==="action"?"action":"step"),...r}))})}return e}function E(t,e){return typeof t=="number"&&t>=0?t:e}function Ht(t){const e=t.steps.filter(r=>r.included&&r.selectors.length>0).map(r=>({id:r.id,selectors:r.selectors,content:{default:r.content},placement:r.placement,align:r.align,backLabel:r.backLabel,nextLabel:r.nextLabel,...r.page?{pageUrl:{glob:r.page}}:{},...r.action?{action:r.action}:{}})),n={};t.conditions.firstVisitOnly&&(n.firstVisitOnly=!0),t.conditions.maxShows>0&&(n.maxShows=t.conditions.maxShows),t.conditions.device!=="any"&&(n.device=t.conditions.device);const o=Object.keys(n).length>0?[{when:n}]:void 0;return{id:t.id,schemaVersion:mt,title:{default:t.name},steps:e,trigger:t.trigger,audience:t.audience,...o?{rules:o}:{},display:{padding:t.display.padding,radius:t.display.radius,cardRadius:t.display.cardRadius,offset:t.display.offset,alignOffset:t.display.alignOffset}}}function Wt(t){return yt(Ht(t))}const C=Ct();function it(){return window.SiteToursFront_data??{}}function Yt(t){const e=it().authenticated===!0;return t==="auth"?e:t==="guest"?!e:!0}function st(){return Bt(it().drafts).filter(t=>t.status==="published"&&t.kind==="tour"&&Yt(t.audience))}function Gt(){return st().map(t=>({id:t.id,name:t.name}))}function I(){const t=[];for(const e of st()){const n=Wt(e);n.ok&&t.push(n.tour)}return t}function D(t){const e=I(),n=t?e.find(o=>o.id===t):e[0];if(!n){console.warn("[tours] no published tour to run",t??"");return}rt(n,{state:C}).start()}function qt(){for(const t of I())if(Nt(t,{state:C}))return!0;return!1}function Xt(){const t=It();for(const e of I()){if(!e.trigger||e.trigger.type==="manual")continue;const n=ot(C,e.id),o={url:window.location.href,device:t,firstVisit:n===0,seenCount:n};zt(e.rules,o)&&Ut(e,()=>{At(C,e.id),D(e.id)})}}function jt(){for(const t of Array.from(document.querySelectorAll("[data-site-tour]")))t.dataset.siteToursBound||(t.dataset.siteToursBound="1",t.addEventListener("click",()=>D(t.dataset.siteTour||void 0)))}function at(){jt(),qt()||Xt()}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",at):at(),x.list=Gt,x.run=D,Object.defineProperty(x,Symbol.toStringTag,{value:"Module"})}));
