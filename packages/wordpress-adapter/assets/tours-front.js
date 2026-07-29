(function(v,S){typeof exports=="object"&&typeof module<"u"?S(exports):typeof define=="function"&&define.amd?define(["exports"],S):(v=typeof globalThis<"u"?globalThis:v||self,S(v.SiteToursFront={}))})(this,(function(v){"use strict";const S=`
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
`,xt="a, button, summary, label, h1, h2, h3, h4, h5, h6";function B(t,e){return!(t instanceof Element)||!t.isConnected||e!==document&&e instanceof Node&&!e.contains(t)?null:t}function wt(t,e){if(typeof t=="function"){let n;try{n=t()}catch{return null}return B(n,e)}if(typeof t!="string")return B(t,e);if(t.startsWith("text=")){const n=t.slice(5).trim();for(const o of Array.from(e.querySelectorAll(xt)))if((o.textContent??"").replace(/\s+/g," ").trim()===n)return o;return null}try{return e.querySelector(t)}catch{return null}}function O(t,e=document){for(const n of t){const o=wt(n,e);if(o)return o}return null}function W(t,e={}){const n=e.root??document,o=O(t,n);return o?Promise.resolve(o):new Promise(i=>{let l=!1,a;const c=d=>{l||(l=!0,p.disconnect(),a&&clearTimeout(a),i(d))},p=new MutationObserver(()=>{const d=O(t,n);d&&c(d)});p.observe(document.documentElement,{childList:!0,subtree:!0,attributes:!0});const g=e.timeout??4e3;g>0&&Number.isFinite(g)&&(a=setTimeout(()=>c(null),g))})}let C=null;function U(){if(C!==null)return C;try{C=new URLSearchParams(window.location.search).has("use_logs")}catch{C=!1}return C}function vt(t){const e=`[tours:${t}]`;return{log:(...n)=>{U()&&console.log(e,...n)},warn:(...n)=>{U()&&console.warn(e,...n)},error:(...n)=>{U()&&console.error(e,...n)}}}const Y=6,q=6,G=10,X=12,Et=1;function x(t){return typeof t=="object"&&t!==null&&!Array.isArray(t)}function j(t){return x(t)&&typeof t.default=="string"}const J=["top","bottom","left","right","auto"],K=["start","center","end"],Q=["mobile","tablet","desktop"],Z=["click","input","navigate","none"];function tt(t,e,n){if(!x(t)){n.push(`${e} must be an object`);return}const o=typeof t.glob=="string"&&t.glob.length>0,i=typeof t.regex=="string"&&t.regex.length>0;if(!o&&!i&&n.push(`${e} must have a non-empty "glob" or "regex"`),i)try{new RegExp(t.regex)}catch{n.push(`${e}.regex is not a valid regular expression`)}}function et(t,e,n){if(!x(t)){n.push(`${e} must be an object`);return}t.url!==void 0&&tt(t.url,`${e}.url`,n),t.role!==void 0&&typeof t.role!="string"&&n.push(`${e}.role must be a string`),t.firstVisitOnly!==void 0&&typeof t.firstVisitOnly!="boolean"&&n.push(`${e}.firstVisitOnly must be a boolean`),t.device!==void 0&&!Q.includes(t.device)&&n.push(`${e}.device must be one of ${Q.join("|")}`),t.unlessSeen!==void 0&&typeof t.unlessSeen!="boolean"&&n.push(`${e}.unlessSeen must be a boolean`),t.maxShows!==void 0&&(typeof t.maxShows!="number"||t.maxShows<0)&&n.push(`${e}.maxShows must be a non-negative number`)}function $t(t,e,n){if(!x(t)){n.push(`${e} must be an object`);return}Z.includes(t.type)||n.push(`${e}.type must be one of ${Z.join("|")}`),t.url!==void 0&&typeof t.url!="string"&&n.push(`${e}.url must be a string`),t.value!==void 0&&typeof t.value!="string"&&n.push(`${e}.value must be a string`)}function _t(t){const e=[];if(!x(t))return{ok:!1,errors:["tour must be an object"]};if((typeof t.id!="string"||t.id.length===0)&&e.push("tour.id must be a non-empty string"),typeof t.schemaVersion!="number"&&e.push("tour.schemaVersion must be a number"),j(t.title)||e.push('tour.title must be a localized text with a string "default"'),Array.isArray(t.steps)?t.steps.length===0?e.push("tour.steps must contain at least one step"):t.steps.forEach((n,o)=>{if(!x(n)){e.push(`steps[${o}] must be an object`);return}(typeof n.id!="string"||n.id.length===0)&&e.push(`steps[${o}].id must be a non-empty string`),(!Array.isArray(n.selectors)||n.selectors.length===0||!n.selectors.every(i=>typeof i=="string"&&i.length>0))&&e.push(`steps[${o}].selectors must be a non-empty array of non-empty strings`),j(n.content)||e.push(`steps[${o}].content must be a localized text with a string "default"`),n.placement!==void 0&&!J.includes(n.placement)&&e.push(`steps[${o}].placement must be one of ${J.join("|")}`),n.align!==void 0&&!K.includes(n.align)&&e.push(`steps[${o}].align must be one of ${K.join("|")}`),n.backLabel!==void 0&&typeof n.backLabel!="string"&&e.push(`steps[${o}].backLabel must be a string`),n.nextLabel!==void 0&&typeof n.nextLabel!="string"&&e.push(`steps[${o}].nextLabel must be a string`),n.pageUrl!==void 0&&tt(n.pageUrl,`steps[${o}].pageUrl`,e),n.condition!==void 0&&et(n.condition,`steps[${o}].condition`,e),n.action!==void 0&&$t(n.action,`steps[${o}].action`,e)}):e.push("tour.steps must be an array"),t.trigger!==void 0){const n=t.trigger,o=["manual","load","selector","timer","cta"],i=["bottom-right","bottom-left","top-right","top-left"];!x(n)||typeof n.type!="string"||!o.includes(n.type)?e.push(`tour.trigger.type must be one of ${o.join("|")}`):n.type==="selector"&&(typeof n.selector!="string"||n.selector.length===0)?e.push("tour.trigger.selector must be a non-empty string"):n.type==="timer"&&(typeof n.delay!="number"||n.delay<0)?e.push("tour.trigger.delay must be a non-negative number"):n.type==="cta"&&(typeof n.text!="string"&&e.push("tour.trigger.text must be a string"),typeof n.button!="string"&&e.push("tour.trigger.button must be a string"),i.includes(n.corner)||e.push(`tour.trigger.corner must be one of ${i.join("|")}`),n.offset!==void 0&&(typeof n.offset!="number"||n.offset<0)&&e.push("tour.trigger.offset must be a non-negative number"))}if(t.audience!==void 0&&!["all","auth","guest"].includes(t.audience)&&e.push("tour.audience must be one of all|auth|guest"),t.display!==void 0)if(!x(t.display))e.push("tour.display must be an object");else for(const n of["padding","radius","cardRadius","offset","alignOffset"]){const o=t.display[n];o!==void 0&&(typeof o!="number"||o<0)&&e.push(`tour.display.${n} must be a non-negative number`)}return t.rules!==void 0&&(Array.isArray(t.rules)?t.rules.forEach((n,o)=>{if(!x(n)){e.push(`rules[${o}] must be an object`);return}n.tourId!==void 0&&typeof n.tourId!="string"&&e.push(`rules[${o}].tourId must be a string`),n.when===void 0?e.push(`rules[${o}].when is required`):et(n.when,`rules[${o}].when`,e)}):e.push("tour.rules must be an array")),e.length>0?{ok:!1,errors:e}:{ok:!0,tour:t}}function kt(t,e,n){const o={top:t.top,bottom:n.height-t.bottom,left:t.left,right:n.width-t.right},i={top:e.height,bottom:e.height,left:e.width,right:e.width},l=["bottom","top","right","left"],a=l.find(c=>o[c]>=i[c]+8);return a||l.reduce((c,p)=>o[p]>o[c]?p:c,l[0])}function St(t){const{target:e,card:n,offset:o,viewport:i}=t,l=t.side==="auto",a=l?kt(e,n,i):t.side,c=l?"center":t.align,p=t.alignOffset??0,g=c==="start"?p:c==="end"?-p:0;let d=0,s=0;return a==="top"||a==="bottom"?(d=a==="top"?e.top-n.height-o:e.bottom+o,s=c==="start"?e.left:c==="end"?e.right-n.width:e.left+e.width/2-n.width/2,s+=g):(s=a==="left"?e.left-n.width-o:e.right+o,d=c==="start"?e.top:c==="end"?e.bottom-n.height:e.top+e.height/2-n.height/2,d+=g),s=Math.max(8,Math.min(s,i.width-n.width-8)),d=Math.max(8,Math.min(d,i.height-n.height-8)),{top:d,left:s}}function nt(t){const e=document.createElement("button");return e.type="button",e.className=`tours-card__btn${t.primary?" tours-card__btn--primary":""}${t.disabled?" tours-card__btn--disabled":""}`,e.textContent=t.label,!t.disabled&&t.onClick&&e.addEventListener("click",t.onClick),e}function Ct(t){const e=document.createElement("div");e.className=`tours-card${t.ghost?" tours-card--ghost":""}`,t.radius!=null&&(e.style.borderRadius=`${t.radius}px`);{const o=document.createElement("button");o.className="tours-card__close",o.type="button",o.textContent="×",o.setAttribute("aria-label","Close"),t.onClose&&o.addEventListener("click",t.onClose),e.appendChild(o)}const n=document.createElement("div");if(n.className="tours-card__content",t.contentHtml!=null?n.innerHTML=t.contentHtml:n.textContent=t.contentText??"",e.appendChild(n),t.back||t.next||t.progress){const o=document.createElement("div");if(o.className="tours-card__footer",t.back&&o.appendChild(nt(t.back)),t.progress){const i=document.createElement("span");i.className="tours-card__progress",i.textContent=t.progress,o.appendChild(i)}t.next&&o.appendChild(nt(t.next)),e.appendChild(o)}return e}const Lt=`
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
`;function Tt(t){const e=t.replace(/[.+^${}()|[\]\\]/g,"\\$&").replace(/\*\*/g,"\0").replace(/\*/g,"[^/]*").replace(/ /g,".*").replace(/\?/g,".");return new RegExp(`^${e}$`)}function L(t,e){if(!t)return!0;if(t.regex)try{return new RegExp(t.regex).test(e)}catch{return!1}if(t.glob)try{return Tt(t.glob).test(e)}catch{return!1}return!0}function At(t){if(!t||!t.glob)return null;const e=t.glob.replace(/\*+/g,"");return/^https?:\/\//i.test(e)||e.startsWith("#")||e.startsWith("/")?e:null}const I="tours:locationchange";let ot=!1;function Nt(){if(!ot){ot=!0;for(const t of["pushState","replaceState"]){const e=history[t];history[t]=function(...o){const i=e.apply(this,o);return window.dispatchEvent(new Event(I)),i}}}}function rt(t){return Nt(),window.addEventListener("popstate",t),window.addEventListener("hashchange",t),window.addEventListener(I,t),()=>{window.removeEventListener("popstate",t),window.removeEventListener("hashchange",t),window.removeEventListener(I,t)}}const D="tours:progress";function Rt(){return{get(t){try{return localStorage.getItem(t)}catch{return null}},set(t,e){try{localStorage.setItem(t,e)}catch{}},remove(t){try{localStorage.removeItem(t)}catch{}}}}function Ot(t){const e=t.get(D);if(!e)return null;try{const n=JSON.parse(e);if(typeof n?.tourId=="string"&&typeof n?.index=="number")return n}catch{}return null}function Ut(t,e){t.set(D,JSON.stringify(e))}function it(t){t.remove(D)}const st="tours:seen:";function at(t,e){const n=t.get(st+e),o=n?parseInt(n,10):0;return Number.isNaN(o)?0:o}function It(t,e){t.set(st+e,String(at(t,e)+1))}const Dt="[data-tours-editor]";function ut(){return typeof document<"u"&&document.querySelector(Dt)!==null}function lt(t,e={}){const n=vt("player"),o=e.state;let i=null,l=null,a=null,c=null,p=null,g=null,d=!1,s=0,y=0,w=null;const h=t.display?.padding??Y,ne=t.display?.radius??q,oe=t.display?.cardRadius??G,re=t.display?.offset??X;function z(r){return O(r.selectors)}function pt(r){return r.action?.type==="click"}function A(r){return L(r.pageUrl,window.location.href)}function k(){o&&Ut(o,{tourId:t.id,index:s})}function gt(){if(i)return;i=document.createElement("div"),i.setAttribute("data-tours-player",""),l=i.attachShadow({mode:"open"});const r=document.createElement("style");r.textContent=S+Lt,l.appendChild(r),p=document.createElement("div"),p.className="tours-backdrop",p.addEventListener("click",u=>{const f=t.steps[s],m=f?z(f):null;if(m){const b=m.getBoundingClientRect();if(u.clientX>=b.left-h&&u.clientX<=b.right+h&&u.clientY>=b.top-h&&u.clientY<=b.bottom+h)return}$()}),l.appendChild(p),a=document.createElement("div"),a.className="tours-spotlight",a.style.borderRadius=`${ne}px`,l.appendChild(a),document.body.appendChild(i)}function ie(r){if(!p)return;if(!r){p.style.clipPath="";return}const u=r.left-h,f=r.top-h,m=r.right+h,b=r.bottom+h;p.style.clipPath=`polygon(0 0, 0 100%, ${u}px 100%, ${u}px ${f}px, ${m}px ${f}px, ${m}px ${b}px, ${u}px ${b}px, ${u}px 100%, 100% 100%, 100% 0)`}function ht(r,u=!1){a&&(a.style.transitionDuration=u?"0ms":"",a.style.display="block",a.style.left=`${r.left-h}px`,a.style.top=`${r.top-h}px`,a.style.width=`${r.width+h*2}px`,a.style.height=`${r.height+h*2}px`)}function mt(r,u){if(!c)return;const f={top:r.top-h,left:r.left-h,right:r.right+h,bottom:r.bottom+h,width:r.width+h*2,height:r.height+h*2},{top:m,left:b}=St({target:f,card:{width:c.offsetWidth,height:c.offsetHeight},side:u.placement??"bottom",align:u.align??"center",offset:re,alignOffset:t.display?.alignOffset??0,viewport:{width:window.innerWidth,height:window.innerHeight}});c.style.left=`${b}px`,c.style.top=`${m}px`}function se(r){const u=Math.max(1,t.steps.length-y),f=Math.max(1,Math.min(s+1-y,u));c&&c.remove(),c=Ct({contentText:r.content.default,progress:`Step ${f} of ${u}`,onClose:$,radius:oe,back:{label:r.backLabel??"Back",disabled:s===0,onClick:F},next:{label:r.nextLabel??(s===u-1?"Done":"Next"),primary:!0,onClick:P}}),l?.appendChild(c)}function E(){if(!d)return;const r=t.steps[s];if(!r){$();return}n.log("render step",s,r.id);const u=z(r);if(!u){n.log(`step "${r.id}" target not found yet — waiting`,r.selectors),W(r.selectors,{timeout:4e3}).then(m=>{!d||t.steps[s]!==r||(m?E():(n.warn(`step "${r.id}" skipped: no element for selectors`,r.selectors),y+=1,s<t.steps.length-1?(s+=1,E()):$()))});return}gt(),u.scrollIntoView({behavior:"smooth",block:"center",inline:"center"}),se(r);const f=u.getBoundingClientRect();ht(f),mt(f,r),ie(pt(r)?f:null),ae(r)}function ae(r){if(g?.(),g=null,!pt(r))return;const u=s+1,f=t.steps[u];!f||A(f)||(g=rt(()=>{!d||t.steps[s]!==r||L(f.pageUrl,window.location.href)&&(g?.(),g=null,n.log("visitor navigated → advancing to",f.id),s=u,k(),E())}))}function bt(r){d&&(r.key==="Escape"?(r.preventDefault(),$()):r.key==="ArrowRight"?P():r.key==="ArrowLeft"&&F())}function N(){if(!d)return;const r=t.steps[s];if(!r)return;const u=z(r);if(!u)return;const f=u.getBoundingClientRect();ht(f,!0),mt(f,r)}function ue(r=0){if(!d&&t.steps.length!==0){if(!e.allowWhileEditing&&ut()){n.log(`start suppressed for "${t.id}" — the builder is mounted`);return}d=!0,s=Math.max(0,Math.min(r,t.steps.length-1)),y=0,n.log("start",t.id,`at ${s}/${t.steps.length}`),gt(),window.addEventListener("keydown",bt,!0),window.addEventListener("resize",N,!0),window.addEventListener("scroll",N,!0),k(),E()}}function le(){a&&(a.style.display="none"),c&&(c.remove(),c=null)}function R(){le(),!w&&(w=rt(()=>{if(!d){w?.(),w=null;return}const r=t.steps[s];r&&A(r)&&(w?.(),w=null,E())}))}function yt(){w&&(w(),w=null),g&&(g(),g=null),d&&(d=!1,window.removeEventListener("keydown",bt,!0),window.removeEventListener("resize",N,!0),window.removeEventListener("scroll",N,!0),i&&i.parentNode&&i.parentNode.removeChild(i),i=null,l=null,a=null,c=null,p=null)}function $(){n.log("stop"),yt(),o&&it(o)}function P(){if(!d)return;const r=s+1,u=t.steps[r];if(!u){$();return}if(A(u)){s=r,k(),E();return}s=r,k();const f=H=>{yt(),e.onNavigate?e.onNavigate(H,u.id):window.location.assign(H)},m=t.steps[s-1]?.action;if(m&&m.type==="navigate"&&m.url){m.url.startsWith("#")?(n.log("page transition (hash navigate) → resume at",s),R(),window.location.hash=m.url):(n.log("page transition (navigate) → resume at",s),f(m.url));return}const b=At(u.pageUrl);if(b){b.startsWith("#")?(n.log("page transition (derived hash) → resume at",s),R(),window.location.hash=b):(n.log("page transition (derived navigate) → resume at",s,b),f(b));return}n.log("page transition (wait) → resume at",s),R()}function F(){if(!d)return;const r=t.steps[s-1];if(r){if(A(r)){s-=1,k(),E();return}s-=1,k(),n.log("page transition back → resume at",s),R(),window.history.back()}}return{start:ue,stop:$,next:P,prev:F}}function Mt(t,e={}){const n=e.state;if(!n)return null;const o=Ot(n);if(!o||o.tourId!==t.id)return null;if(!t.steps[o.index])return it(n),null;let i=-1;for(let a=o.index;a<t.steps.length;a++)if(L(t.steps[a].pageUrl,window.location.href)){i=a;break}if(i===-1)return null;const l=lt(t,e);return l.start(i),l}const Vt=`
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
`;function zt(t){const e=t.corner??"bottom-right",n=t.offset??24,o=document.createElement("div");o.setAttribute("data-tours-cta","");const i=o.attachShadow({mode:"open"}),l=document.createElement("style");l.textContent=Vt,i.appendChild(l);const a=document.createElement("div");a.className="cta";const[c,p]=e.split("-");a.style[c]=`${n}px`,a.style[p]=`${n}px`;const g=()=>{o.parentNode&&o.parentNode.removeChild(o)},d=document.createElement("button");d.className="cta__close",d.type="button",d.textContent="×",d.setAttribute("aria-label","Dismiss"),d.addEventListener("click",g);const s=document.createElement("p");s.className="cta__text",s.textContent=t.text;const y=document.createElement("button");return y.className="cta__btn",y.type="button",y.textContent=t.button,y.addEventListener("click",()=>{g(),t.onStart()}),a.append(d,s,y),i.appendChild(a),document.body.appendChild(o),g}function Pt(t,e){if(ut())return()=>{};const n=t.trigger??{type:"manual"};let o=!1;const i=()=>{o||(o=!0,e())};switch(n.type){case"load":{const l=setTimeout(i,0);return()=>clearTimeout(l)}case"timer":{const l=setTimeout(i,Math.max(0,n.delay));return()=>clearTimeout(l)}case"selector":{let l=!1;return W([n.selector],{timeout:0}).then(a=>{a&&!l&&i()}),()=>{l=!0}}case"cta":{let l=()=>{};return l=zt({text:n.text,button:n.button,corner:n.corner,offset:n.offset,onStart:i}),l}case"manual":default:return()=>{}}}function Ft(t=window.innerWidth){return t<=640?"mobile":t<=1024?"tablet":"desktop"}function Ht(t,e){return!(t.url&&!L(t.url,e.url)||t.role!==void 0&&t.role!==e.role||t.firstVisitOnly&&!e.firstVisit||t.device&&t.device!==e.device||t.unlessSeen&&e.seenCount>0||t.maxShows!==void 0&&e.seenCount>=t.maxShows)}function Bt(t,e){return!t||t.length===0?!0:t.some(n=>Ht(n.when,e))}let Wt=0;function Yt(t){const e=typeof crypto<"u"&&"randomUUID"in crypto?crypto.randomUUID():`${Wt++}`;return`${t}-${e}`}function qt(t="step"){return{id:Yt("step"),type:t,included:!0,selectors:[],content:"",page:"",placement:"auto",align:"center",backLabel:"Back",nextLabel:"Next"}}function Gt(t){if(t&&typeof t=="object"){const e=t;if(e.type==="load")return{type:"load"};if(e.type==="selector"&&typeof e.selector=="string")return{type:"selector",selector:e.selector};if(e.type==="timer"&&typeof e.delay=="number")return{type:"timer",delay:e.delay};if(e.type==="cta"&&typeof e.text=="string"&&typeof e.button=="string"){const n=["bottom-right","bottom-left","top-right","top-left"];return{type:"cta",text:e.text,button:e.button,corner:n.includes(e.corner)?e.corner:"bottom-right",offset:typeof e.offset=="number"?e.offset:void 0}}}return{type:"manual"}}function Xt(t){if(!Array.isArray(t))return[];const e=[];for(const n of t){if(!n||typeof n!="object")continue;const o=n;typeof o.id!="string"||!Array.isArray(o.steps)||e.push({id:o.id,kind:o.kind==="template"?"template":"tour",name:typeof o.name=="string"?o.name:"Untitled tour",status:o.status==="published"?"published":"draft",trigger:Gt(o.trigger),audience:o.audience==="auth"||o.audience==="guest"?o.audience:"all",conditions:{firstVisitOnly:(o.conditions?.firstVisitOnly??!0)===!0,maxShows:_(o.conditions?.maxShows,0),device:["mobile","tablet","desktop"].includes(o.conditions?.device)?o.conditions.device:"any"},display:{padding:_(o.display?.padding,Y),radius:_(o.display?.radius,q),cardRadius:_(o.display?.cardRadius,G),offset:_(o.display?.offset,X),alignOffset:_(o.display?.alignOffset,0)},steps:o.steps.filter(i=>!!i&&typeof i=="object").map(i=>({...qt(i.type==="action"?"action":"step"),...i}))})}return e}function _(t,e){return typeof t=="number"&&t>=0?t:e}function jt(t){const e=t.steps.filter(i=>i.included&&i.selectors.length>0).map(i=>({id:i.id,selectors:i.selectors,content:{default:i.content},placement:i.placement,align:i.align,backLabel:i.backLabel,nextLabel:i.nextLabel,...i.page?{pageUrl:{glob:i.page}}:{},...i.action?{action:i.action}:{}})),n={};t.conditions.firstVisitOnly&&(n.firstVisitOnly=!0),t.conditions.maxShows>0&&(n.maxShows=t.conditions.maxShows),t.conditions.device!=="any"&&(n.device=t.conditions.device);const o=Object.keys(n).length>0?[{when:n}]:void 0;return{id:t.id,schemaVersion:Et,title:{default:t.name},steps:e,trigger:t.trigger,audience:t.audience,...o?{rules:o}:{},display:{padding:t.display.padding,radius:t.display.radius,cardRadius:t.display.cardRadius,offset:t.display.offset,alignOffset:t.display.alignOffset}}}function Jt(t){return _t(jt(t))}const T=Rt();function ct(){return window.SiteToursFront_data??{}}function Kt(t){const e=ct().authenticated===!0;return t==="auth"?e:t==="guest"?!e:!0}function dt(){return Xt(ct().drafts).filter(t=>t.status==="published"&&t.kind==="tour"&&Kt(t.audience))}function Qt(){return dt().map(t=>({id:t.id,name:t.name}))}function M(){const t=[];for(const e of dt()){const n=Jt(e);n.ok&&t.push(n.tour)}return t}function V(t){const e=M(),n=t?e.find(o=>o.id===t):e[0];if(!n){console.warn("[tours] no published tour to run",t??"");return}lt(n,{state:T}).start()}function Zt(){for(const t of M())if(Mt(t,{state:T}))return!0;return!1}function te(){const t=Ft();for(const e of M()){if(!e.trigger||e.trigger.type==="manual")continue;const n=at(T,e.id),o={url:window.location.href,device:t,firstVisit:n===0,seenCount:n};Bt(e.rules,o)&&Pt(e,()=>{It(T,e.id),V(e.id)})}}function ee(){for(const t of Array.from(document.querySelectorAll("[data-site-tour]")))t.dataset.siteToursBound||(t.dataset.siteToursBound="1",t.addEventListener("click",()=>V(t.dataset.siteTour||void 0)))}function ft(){ee(),Zt()||te()}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",ft):ft(),v.list=Qt,v.run=V,Object.defineProperty(v,Symbol.toStringTag,{value:"Module"})}));
