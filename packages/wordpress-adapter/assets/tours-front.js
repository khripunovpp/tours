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
`,vt="a, button, summary, label, h1, h2, h3, h4, h5, h6";function W(t,e){return!(t instanceof Element)||!t.isConnected||e!==document&&e instanceof Node&&!e.contains(t)?null:t}function Et(t,e){if(typeof t=="function"){let n;try{n=t()}catch{return null}return W(n,e)}if(typeof t!="string")return W(t,e);if(t.startsWith("text=")){const n=t.slice(5).trim();for(const o of Array.from(e.querySelectorAll(vt)))if((o.textContent??"").replace(/\s+/g," ").trim()===n)return o;return null}try{return e.querySelector(t)}catch{return null}}function U(t,e=document){for(const n of t){const o=Et(n,e);if(o)return o}return null}function Y(t,e={}){const n=e.root??document,o=U(t,n);return o?Promise.resolve(o):new Promise(r=>{let u=!1,a;const c=l=>{u||(u=!0,g.disconnect(),a&&clearTimeout(a),r(l))},g=new MutationObserver(()=>{const l=U(t,n);l&&c(l)});g.observe(document.documentElement,{childList:!0,subtree:!0,attributes:!0});const h=e.timeout??4e3;h>0&&Number.isFinite(h)&&(a=setTimeout(()=>c(null),h))})}let C=null;function I(){if(C!==null)return C;try{C=new URLSearchParams(window.location.search).has("use_logs")}catch{C=!1}return C}function G(t){const e=`[tours:${t}]`;return{log:(...n)=>{I()&&console.log(e,...n)},warn:(...n)=>{I()&&console.warn(e,...n)},error:(...n)=>{I()&&console.error(e,...n)}}}const q=6,X=6,j=10,J=12,$t=1;function w(t){return typeof t=="object"&&t!==null&&!Array.isArray(t)}function K(t){return w(t)&&typeof t.default=="string"}const Q=["top","bottom","left","right","auto"],Z=["start","center","end"],tt=["mobile","tablet","desktop"],et=["click","input","navigate","none"];function nt(t,e,n){if(!w(t)){n.push(`${e} must be an object`);return}const o=typeof t.glob=="string"&&t.glob.length>0,r=typeof t.regex=="string"&&t.regex.length>0;if(!o&&!r&&n.push(`${e} must have a non-empty "glob" or "regex"`),r)try{new RegExp(t.regex)}catch{n.push(`${e}.regex is not a valid regular expression`)}}function ot(t,e,n){if(!w(t)){n.push(`${e} must be an object`);return}t.url!==void 0&&nt(t.url,`${e}.url`,n),t.role!==void 0&&typeof t.role!="string"&&n.push(`${e}.role must be a string`),t.firstVisitOnly!==void 0&&typeof t.firstVisitOnly!="boolean"&&n.push(`${e}.firstVisitOnly must be a boolean`),t.device!==void 0&&!tt.includes(t.device)&&n.push(`${e}.device must be one of ${tt.join("|")}`),t.unlessSeen!==void 0&&typeof t.unlessSeen!="boolean"&&n.push(`${e}.unlessSeen must be a boolean`),t.maxShows!==void 0&&(typeof t.maxShows!="number"||t.maxShows<0)&&n.push(`${e}.maxShows must be a non-negative number`)}function kt(t,e,n){if(!w(t)){n.push(`${e} must be an object`);return}et.includes(t.type)||n.push(`${e}.type must be one of ${et.join("|")}`),t.url!==void 0&&typeof t.url!="string"&&n.push(`${e}.url must be a string`),t.value!==void 0&&typeof t.value!="string"&&n.push(`${e}.value must be a string`)}function _t(t){const e=[];if(!w(t))return{ok:!1,errors:["tour must be an object"]};if((typeof t.id!="string"||t.id.length===0)&&e.push("tour.id must be a non-empty string"),typeof t.schemaVersion!="number"&&e.push("tour.schemaVersion must be a number"),K(t.title)||e.push('tour.title must be a localized text with a string "default"'),Array.isArray(t.steps)?t.steps.length===0?e.push("tour.steps must contain at least one step"):t.steps.forEach((n,o)=>{if(!w(n)){e.push(`steps[${o}] must be an object`);return}(typeof n.id!="string"||n.id.length===0)&&e.push(`steps[${o}].id must be a non-empty string`),(!Array.isArray(n.selectors)||n.selectors.length===0||!n.selectors.every(r=>typeof r=="string"&&r.length>0))&&e.push(`steps[${o}].selectors must be a non-empty array of non-empty strings`),K(n.content)||e.push(`steps[${o}].content must be a localized text with a string "default"`),n.placement!==void 0&&!Q.includes(n.placement)&&e.push(`steps[${o}].placement must be one of ${Q.join("|")}`),n.align!==void 0&&!Z.includes(n.align)&&e.push(`steps[${o}].align must be one of ${Z.join("|")}`),n.backLabel!==void 0&&typeof n.backLabel!="string"&&e.push(`steps[${o}].backLabel must be a string`),n.nextLabel!==void 0&&typeof n.nextLabel!="string"&&e.push(`steps[${o}].nextLabel must be a string`),n.pageUrl!==void 0&&nt(n.pageUrl,`steps[${o}].pageUrl`,e),n.condition!==void 0&&ot(n.condition,`steps[${o}].condition`,e),n.action!==void 0&&kt(n.action,`steps[${o}].action`,e)}):e.push("tour.steps must be an array"),t.trigger!==void 0){const n=t.trigger,o=["manual","load","selector","timer","cta"],r=["bottom-right","bottom-left","top-right","top-left"];!w(n)||typeof n.type!="string"||!o.includes(n.type)?e.push(`tour.trigger.type must be one of ${o.join("|")}`):n.type==="selector"&&(typeof n.selector!="string"||n.selector.length===0)?e.push("tour.trigger.selector must be a non-empty string"):n.type==="timer"&&(typeof n.delay!="number"||n.delay<0)?e.push("tour.trigger.delay must be a non-negative number"):n.type==="cta"&&(typeof n.text!="string"&&e.push("tour.trigger.text must be a string"),typeof n.button!="string"&&e.push("tour.trigger.button must be a string"),r.includes(n.corner)||e.push(`tour.trigger.corner must be one of ${r.join("|")}`),n.offset!==void 0&&(typeof n.offset!="number"||n.offset<0)&&e.push("tour.trigger.offset must be a non-negative number"))}if(t.audience!==void 0&&!["all","auth","guest"].includes(t.audience)&&e.push("tour.audience must be one of all|auth|guest"),t.display!==void 0)if(!w(t.display))e.push("tour.display must be an object");else for(const n of["padding","radius","cardRadius","offset","alignOffset"]){const o=t.display[n];o!==void 0&&(typeof o!="number"||o<0)&&e.push(`tour.display.${n} must be a non-negative number`)}return t.rules!==void 0&&(Array.isArray(t.rules)?t.rules.forEach((n,o)=>{if(!w(n)){e.push(`rules[${o}] must be an object`);return}n.tourId!==void 0&&typeof n.tourId!="string"&&e.push(`rules[${o}].tourId must be a string`),n.when===void 0?e.push(`rules[${o}].when is required`):ot(n.when,`rules[${o}].when`,e)}):e.push("tour.rules must be an array")),e.length>0?{ok:!1,errors:e}:{ok:!0,tour:t}}function St(t,e,n){const o={top:t.top,bottom:n.height-t.bottom,left:t.left,right:n.width-t.right},r={top:e.height,bottom:e.height,left:e.width,right:e.width},u=["bottom","top","right","left"],a=u.find(c=>o[c]>=r[c]+8);return a||u.reduce((c,g)=>o[g]>o[c]?g:c,u[0])}function Ct(t){const{target:e,card:n,offset:o,viewport:r}=t,u=t.side==="auto",a=u?St(e,n,r):t.side,c=u?"center":t.align,g=t.alignOffset??0,h=c==="start"?g:c==="end"?-g:0;let l=0,s=0;return a==="top"||a==="bottom"?(l=a==="top"?e.top-n.height-o:e.bottom+o,s=c==="start"?e.left:c==="end"?e.right-n.width:e.left+e.width/2-n.width/2,s+=h):(s=a==="left"?e.left-n.width-o:e.right+o,l=c==="start"?e.top:c==="end"?e.bottom-n.height:e.top+e.height/2-n.height/2,l+=h),s=Math.max(8,Math.min(s,r.width-n.width-8)),l=Math.max(8,Math.min(l,r.height-n.height-8)),{top:l,left:s}}function rt(t){const e=document.createElement("button");return e.type="button",e.className=`tours-card__btn${t.primary?" tours-card__btn--primary":""}${t.disabled?" tours-card__btn--disabled":""}`,e.textContent=t.label,!t.disabled&&t.onClick&&e.addEventListener("click",t.onClick),e}function Lt(t){const e=document.createElement("div");e.className=`tours-card${t.ghost?" tours-card--ghost":""}`,t.radius!=null&&(e.style.borderRadius=`${t.radius}px`);{const o=document.createElement("button");o.className="tours-card__close",o.type="button",o.textContent="×",o.setAttribute("aria-label","Close"),t.onClose&&o.addEventListener("click",t.onClose),e.appendChild(o)}const n=document.createElement("div");if(n.className="tours-card__content",t.contentHtml!=null?n.innerHTML=t.contentHtml:n.textContent=t.contentText??"",e.appendChild(n),t.back||t.next||t.progress){const o=document.createElement("div");if(o.className="tours-card__footer",t.back&&o.appendChild(rt(t.back)),t.progress){const r=document.createElement("span");r.className="tours-card__progress",r.textContent=t.progress,o.appendChild(r)}t.next&&o.appendChild(rt(t.next)),e.appendChild(o)}return e}const Tt=`
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
`;function At(t){const e=t.replace(/[.+^${}()|[\]\\]/g,"\\$&").replace(/\*\*/g,"\0").replace(/\*/g,"[^/]*").replace(/ /g,".*").replace(/\?/g,".");return new RegExp(`^${e}$`)}function A(t,e){if(!t)return!0;if(t.regex)try{return new RegExp(t.regex).test(e)}catch{return!1}if(t.glob)try{return At(t.glob).test(e)}catch{return!1}return!0}function Nt(t){if(!t||!t.glob)return null;const e=t.glob.replace(/\*+/g,"");return/^https?:\/\//i.test(e)||e.startsWith("#")||e.startsWith("/")?e:null}const D="tours:locationchange";let it=!1;function Rt(){if(!it){it=!0;for(const t of["pushState","replaceState"]){const e=history[t];history[t]=function(...o){const r=e.apply(this,o);return window.dispatchEvent(new Event(D)),r}}}}function M(t){return Rt(),window.addEventListener("popstate",t),window.addEventListener("hashchange",t),window.addEventListener(D,t),()=>{window.removeEventListener("popstate",t),window.removeEventListener("hashchange",t),window.removeEventListener(D,t)}}const V="tours:progress";function Ot(){return{get(t){try{return localStorage.getItem(t)}catch{return null}},set(t,e){try{localStorage.setItem(t,e)}catch{}},remove(t){try{localStorage.removeItem(t)}catch{}}}}function Ut(t){const e=t.get(V);if(!e)return null;try{const n=JSON.parse(e);if(typeof n?.tourId=="string"&&typeof n?.index=="number")return n}catch{}return null}function It(t,e){t.set(V,JSON.stringify(e))}function st(t){t.remove(V)}const at="tours:seen:";function ut(t,e){const n=t.get(at+e),o=n?parseInt(n,10):0;return Number.isNaN(o)?0:o}function Dt(t,e){t.set(at+e,String(ut(t,e)+1))}const Mt="[data-tours-editor]";function ct(){return typeof document<"u"&&document.querySelector(Mt)!==null}function z(t,e={}){const n=G("player"),o=e.state;let r=null,u=null,a=null,c=null,g=null,h=null,l=!1,s=0,p=0,x=null;const m=t.display?.padding??q,N=t.display?.radius??X,ne=t.display?.cardRadius??j,oe=t.display?.offset??J;function P(i){return U(i.selectors)}function F(i){return i.action?.type==="click"}function L(i){return A(i.pageUrl,window.location.href)}function _(){o&&It(o,{tourId:t.id,index:s})}function mt(){if(r)return;r=document.createElement("div"),r.setAttribute("data-tours-player",""),u=r.attachShadow({mode:"open"});const i=document.createElement("style");i.textContent=S+Tt,u.appendChild(i),g=document.createElement("div"),g.className="tours-backdrop",g.addEventListener("click",d=>{const f=t.steps[s],b=f?P(f):null;if(b){const y=b.getBoundingClientRect();if(d.clientX>=y.left-m&&d.clientX<=y.right+m&&d.clientY>=y.top-m&&d.clientY<=y.bottom+m)return}$()}),u.appendChild(g),a=document.createElement("div"),a.className="tours-spotlight",a.style.borderRadius=`${N}px`,u.appendChild(a),document.body.appendChild(r)}function re(i){if(!g)return;if(!i){g.style.clipPath="";return}const d=i.left-m,f=i.top-m,b=i.right+m,y=i.bottom+m;g.style.clipPath=`polygon(0 0, 0 100%, ${d}px 100%, ${d}px ${f}px, ${b}px ${f}px, ${b}px ${y}px, ${d}px ${y}px, ${d}px 100%, 100% 100%, 100% 0)`}function bt(i,d=!1){a&&(a.style.transitionDuration=d?"0ms":"",a.style.display="block",a.style.left=`${i.left-m}px`,a.style.top=`${i.top-m}px`,a.style.width=`${i.width+m*2}px`,a.style.height=`${i.height+m*2}px`)}function yt(i,d){if(!c)return;const f={top:i.top-m,left:i.left-m,right:i.right+m,bottom:i.bottom+m,width:i.width+m*2,height:i.height+m*2},{top:b,left:y}=Ct({target:f,card:{width:c.offsetWidth,height:c.offsetHeight},side:d.placement??"bottom",align:d.align??"center",offset:oe,alignOffset:t.display?.alignOffset??0,viewport:{width:window.innerWidth,height:window.innerHeight}});c.style.left=`${y}px`,c.style.top=`${b}px`}function ie(i){const d=Math.max(1,t.steps.length-p),f=Math.max(1,Math.min(s+1-p,d));c&&c.remove();const b=s===t.steps.length-1,y=t.steps[s-1],T=!!y&&L(y),ce=!F(i)||b;c=Lt({contentText:i.content.default,progress:`Step ${f} of ${d}`,onClose:$,radius:ne,back:T?{label:i.backLabel??"Back",onClick:H}:void 0,next:ce?{label:i.nextLabel??(b?"Done":"Next"),primary:!0,onClick:B}:void 0}),u?.appendChild(c)}function E(){if(!l)return;const i=t.steps[s];if(!i){$();return}n.log("render step",s,i.id);const d=P(i);if(!d){n.log(`step "${i.id}" target not found yet — waiting`,i.selectors),Y(i.selectors,{timeout:4e3}).then(b=>{!l||t.steps[s]!==i||(b?E():(n.warn(`step "${i.id}" skipped: no element for selectors`,i.selectors),p+=1,s<t.steps.length-1?(s+=1,E()):$()))});return}mt(),d.scrollIntoView({behavior:"smooth",block:"center",inline:"center"}),ie(i);const f=d.getBoundingClientRect();bt(f),yt(f,i),re(F(i)?f:null),se(i)}function se(i){if(h?.(),h=null,!F(i))return;const d=s+1,f=t.steps[d];!f||L(f)||(h=M(()=>{!l||t.steps[s]!==i||A(f.pageUrl,window.location.href)&&(h?.(),h=null,n.log("visitor navigated → advancing to",f.id),s=d,_(),E())}))}function xt(i){l&&(i.key==="Escape"?(i.preventDefault(),$()):i.key==="ArrowRight"?B():i.key==="ArrowLeft"&&H())}function R(){if(!l)return;const i=t.steps[s];if(!i)return;const d=P(i);if(!d)return;const f=d.getBoundingClientRect();bt(f,!0),yt(f,i)}function ae(i=0){if(!l&&t.steps.length!==0){if(!e.allowWhileEditing&&ct()){n.log(`start suppressed for "${t.id}" — the builder is mounted`);return}l=!0,s=Math.max(0,Math.min(i,t.steps.length-1)),p=0,n.log("start",t.id,`at ${s}/${t.steps.length}`),mt(),window.addEventListener("keydown",xt,!0),window.addEventListener("resize",R,!0),window.addEventListener("scroll",R,!0),_(),E()}}function ue(){a&&(a.style.display="none"),c&&(c.remove(),c=null)}function O(){ue(),!x&&(x=M(()=>{if(!l){x?.(),x=null;return}const i=t.steps[s];i&&L(i)&&(x?.(),x=null,E())}))}function wt(){x&&(x(),x=null),h&&(h(),h=null),l&&(l=!1,window.removeEventListener("keydown",xt,!0),window.removeEventListener("resize",R,!0),window.removeEventListener("scroll",R,!0),r&&r.parentNode&&r.parentNode.removeChild(r),r=null,u=null,a=null,c=null,g=null)}function $(){n.log("stop"),wt(),o&&st(o)}function B(){if(!l)return;const i=s+1,d=t.steps[i];if(!d){$();return}if(L(d)){s=i,_(),E();return}s=i,_();const f=T=>{wt(),e.onNavigate?e.onNavigate(T,d.id):window.location.assign(T)},b=t.steps[s-1]?.action;if(b&&b.type==="navigate"&&b.url){b.url.startsWith("#")?(n.log("page transition (hash navigate) → resume at",s),O(),window.location.hash=b.url):(n.log("page transition (navigate) → resume at",s),f(b.url));return}const y=Nt(d.pageUrl);if(y){y.startsWith("#")?(n.log("page transition (derived hash) → resume at",s),O(),window.location.hash=y):(n.log("page transition (derived navigate) → resume at",s,y),f(y));return}n.log("page transition (wait) → resume at",s),O()}function H(){if(!l)return;const i=t.steps[s-1];if(i){if(L(i)){s-=1,_(),E();return}s-=1,_(),n.log("page transition back → resume at",s),O(),window.history.back()}}return{start:ae,stop:$,next:B,prev:H,isActive:()=>l}}function Vt(t,e={}){const n=e.state;if(!n)return null;const o=Ut(n);if(!o||o.tourId!==t.id)return null;if(!t.steps[o.index])return st(n),null;let r=-1;for(let a=o.index;a<t.steps.length;a++)if(A(t.steps[a].pageUrl,window.location.href)){r=a;break}if(r===-1)return null;const u=z(t,e);return u.start(r),u}const zt=`
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
`;function Pt(t){const e=t.corner??"bottom-right",n=t.offset??24,o=document.createElement("div");o.setAttribute("data-tours-cta","");const r=o.attachShadow({mode:"open"}),u=document.createElement("style");u.textContent=zt,r.appendChild(u);const a=document.createElement("div");a.className="cta";const[c,g]=e.split("-");a.style[c]=`${n}px`,a.style[g]=`${n}px`;const h=()=>{o.parentNode&&o.parentNode.removeChild(o)},l=document.createElement("button");l.className="cta__close",l.type="button",l.textContent="×",l.setAttribute("aria-label","Dismiss"),l.addEventListener("click",h);const s=document.createElement("p");s.className="cta__text",s.textContent=t.text;const p=document.createElement("button");return p.className="cta__btn",p.type="button",p.textContent=t.button,p.addEventListener("click",()=>{h(),t.onStart()}),a.append(l,s,p),r.appendChild(a),document.body.appendChild(o),h}function Ft(t,e){if(ct())return()=>{};const n=t.trigger??{type:"manual"};let o=!1;const r=()=>{o||(o=!0,e())};switch(n.type){case"load":{const u=setTimeout(r,0);return()=>clearTimeout(u)}case"timer":{const u=setTimeout(r,Math.max(0,n.delay));return()=>clearTimeout(u)}case"selector":{let u=!1;return Y([n.selector],{timeout:0}).then(a=>{a&&!u&&r()}),()=>{u=!0}}case"cta":{let u=()=>{};return u=Pt({text:n.text,button:n.button,corner:n.corner,offset:n.offset,onStart:r}),u}case"manual":default:return()=>{}}}function Bt(t=window.innerWidth){return t<=640?"mobile":t<=1024?"tablet":"desktop"}function Ht(t,e){return!(t.url&&!A(t.url,e.url)||t.role!==void 0&&t.role!==e.role||t.firstVisitOnly&&!e.firstVisit||t.device&&t.device!==e.device||t.unlessSeen&&e.seenCount>0||t.maxShows!==void 0&&e.seenCount>=t.maxShows)}function Wt(t,e){return!t||t.length===0?!0:t.some(n=>Ht(n.when,e))}function Yt(t,e={}){const n=G("mount"),o=e.state,r=()=>typeof t=="function"?t():t;let u=null,a=[];function c(){for(const s of a)s();a=[]}function g(s){return!e.canRun||e.canRun(s)}function h(){if(u?.isActive())return;if(u=null,c(),o)for(const p of r()){if(!g(p))continue;const x=Vt(p,e);if(x){n.log("resumed",p.id),u=x;return}}const s=Bt();for(const p of r()){if(!g(p)||!p.trigger||p.trigger.type==="manual")continue;const x=o?ut(o,p.id):0;Wt(p.rules,{url:window.location.href,device:s,firstVisit:x===0,seenCount:x})&&a.push(Ft(p,()=>{o&&Dt(o,p.id);const N=z(p,e);u=N,N.start()}))}}h();const l=M(h);return()=>{l(),c(),u?.stop(),u=null}}let Gt=0;function qt(t){const e=typeof crypto<"u"&&"randomUUID"in crypto?crypto.randomUUID():`${Gt++}`;return`${t}-${e}`}function Xt(t="step"){return{id:qt("step"),type:t,included:!0,selectors:[],content:"",page:"",placement:"auto",align:"center",backLabel:"Back",nextLabel:"Next"}}function jt(t){if(t&&typeof t=="object"){const e=t;if(e.type==="load")return{type:"load"};if(e.type==="selector"&&typeof e.selector=="string")return{type:"selector",selector:e.selector};if(e.type==="timer"&&typeof e.delay=="number")return{type:"timer",delay:e.delay};if(e.type==="cta"&&typeof e.text=="string"&&typeof e.button=="string"){const n=["bottom-right","bottom-left","top-right","top-left"];return{type:"cta",text:e.text,button:e.button,corner:n.includes(e.corner)?e.corner:"bottom-right",offset:typeof e.offset=="number"?e.offset:void 0}}}return{type:"manual"}}function Jt(t){if(!Array.isArray(t))return[];const e=[];for(const n of t){if(!n||typeof n!="object")continue;const o=n;typeof o.id!="string"||!Array.isArray(o.steps)||e.push({id:o.id,kind:o.kind==="template"?"template":"tour",name:typeof o.name=="string"?o.name:"Untitled tour",status:o.status==="published"?"published":"draft",trigger:jt(o.trigger),audience:o.audience==="auth"||o.audience==="guest"?o.audience:"all",conditions:{firstVisitOnly:(o.conditions?.firstVisitOnly??!0)===!0,maxShows:k(o.conditions?.maxShows,0),device:["mobile","tablet","desktop"].includes(o.conditions?.device)?o.conditions.device:"any"},display:{padding:k(o.display?.padding,q),radius:k(o.display?.radius,X),cardRadius:k(o.display?.cardRadius,j),offset:k(o.display?.offset,J),alignOffset:k(o.display?.alignOffset,0)},steps:o.steps.filter(r=>!!r&&typeof r=="object").map(r=>({...Xt(r.type==="action"?"action":"step"),...r}))})}return e}function k(t,e){return typeof t=="number"&&t>=0?t:e}function Kt(t){const e=t.steps.filter(r=>r.included&&r.selectors.length>0).map(r=>({id:r.id,selectors:r.selectors,content:{default:r.content},placement:r.placement,align:r.align,backLabel:r.backLabel,nextLabel:r.nextLabel,...r.page?{pageUrl:{glob:r.page}}:{},...r.action?{action:r.action}:{}})),n={};t.conditions.firstVisitOnly&&(n.firstVisitOnly=!0),t.conditions.maxShows>0&&(n.maxShows=t.conditions.maxShows),t.conditions.device!=="any"&&(n.device=t.conditions.device);const o=Object.keys(n).length>0?[{when:n}]:void 0;return{id:t.id,schemaVersion:$t,title:{default:t.name},steps:e,trigger:t.trigger,audience:t.audience,...o?{rules:o}:{},display:{padding:t.display.padding,radius:t.display.radius,cardRadius:t.display.cardRadius,offset:t.display.offset,alignOffset:t.display.alignOffset}}}function Qt(t){return _t(Kt(t))}const lt=Ot();function dt(){return window.SiteToursFront_data??{}}function Zt(t){const e=dt().authenticated===!0;return t==="auth"?e:t==="guest"?!e:!0}function ft(){return Jt(dt().drafts).filter(t=>t.status==="published"&&t.kind==="tour"&&Zt(t.audience))}function te(){return ft().map(t=>({id:t.id,name:t.name}))}function pt(){const t=[];for(const e of ft()){const n=Qt(e);n.ok&&t.push(n.tour)}return t}function gt(t){const e=pt(),n=t?e.find(o=>o.id===t):e[0];if(!n){console.warn("[tours] no published tour to run",t??"");return}z(n,{state:lt}).start()}function ee(){for(const t of Array.from(document.querySelectorAll("[data-site-tour]")))t.dataset.siteToursBound||(t.dataset.siteToursBound="1",t.addEventListener("click",()=>gt(t.dataset.siteTour||void 0)))}function ht(){ee(),Yt(pt,{state:lt})}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",ht):ht(),v.list=te,v.run=gt,Object.defineProperty(v,Symbol.toStringTag,{value:"Module"})}));
