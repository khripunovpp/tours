(function(p,L){typeof exports=="object"&&typeof module<"u"?L(exports):typeof define=="function"&&define.amd?define(["exports"],L):(p=typeof globalThis<"u"?globalThis:p||self,L(p.ToursCore={}))})(this,(function(p){"use strict";const L=`
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
`,Tt=`
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
`;function B(t){return JSON.stringify(t)}function Nt(t){return/^[a-zA-Z][\w-]*$/.test(t)&&t.length<=30&&!/\d{2,}/.test(t)&&!/^(css-|sc-|jsx-|emotion-|_|is-|has-)/.test(t)}function ot(t){const e=[];let r=t;for(;r&&r!==document.body&&r.nodeType===1;){const n=r.tagName.toLowerCase(),i=r.parentElement;if(!i){e.unshift(n);break}const s=Array.from(i.children).filter(a=>a.tagName===r.tagName);e.unshift(s.length>1?`${n}:nth-of-type(${s.indexOf(r)+1})`:n),r=i}return`body > ${e.join(" > ")}`}function Rt(t){let e=t.parentElement;for(;e&&e!==document.body&&!e.id;)e=e.parentElement;if(!e||!e.id)return null;const r=[];let n=t;for(;n&&n!==e;){const i=n.tagName.toLowerCase(),s=n.parentElement;if(!s)return null;const a=Array.from(s.children).filter(d=>d.tagName===n.tagName);r.unshift(a.length>1?`${i}:nth-of-type(${a.indexOf(n)+1})`:i),n=s}return`#${CSS.escape(e.id)} > ${r.join(" > ")}`}const At=["data-testid","data-test","data-test-id","data-cy","data-qa","data-id","data-name"];function it(t){const e=[],r=new Set,n=t.tagName.toLowerCase(),i=f=>{if(!(!f||r.has(f)))try{document.querySelector(f)===t&&(r.add(f),e.push(f))}catch{}};t.id&&i(`#${CSS.escape(t.id)}`);for(const f of At){const h=t.getAttribute(f);h&&i(`${n}[${f}=${B(h)}]`)}const s=t.getAttribute("name");s&&i(`${n}[name=${B(s)}]`);const a=t.getAttribute("aria-label");a&&i(`[aria-label=${B(a)}]`);const d=Array.from(t.classList).filter(Nt);d.length&&i(`${n}.${d.map(f=>CSS.escape(f)).join(".")}`);for(const f of d)i(`${n}.${CSS.escape(f)}`);i(Rt(t)),i(ot(t));const b=(t.textContent??"").replace(/\s+/g," ").trim();if(b&&b.length<=50&&/^(a|button|summary|label|h[1-6])$/.test(n)){const f=`text=${b}`;r.has(f)||(r.add(f),e.push(f))}return e.length===0&&e.push(ot(t)),e}const Pt="a, button, summary, label, h1, h2, h3, h4, h5, h6";function st(t,e){return!(t instanceof Element)||!t.isConnected||e!==document&&e instanceof Node&&!e.contains(t)?null:t}function It(t,e){if(typeof t=="function"){let r;try{r=t()}catch{return null}return st(r,e)}if(typeof t!="string")return st(t,e);if(t.startsWith("text=")){const r=t.slice(5).trim();for(const n of Array.from(e.querySelectorAll(Pt)))if((n.textContent??"").replace(/\s+/g," ").trim()===r)return n;return null}try{return e.querySelector(t)}catch{return null}}function I(t,e=document){for(const r of t){const n=It(r,e);if(n)return n}return null}function W(t,e={}){const r=e.root??document,n=I(t,r);return n?Promise.resolve(n):new Promise(i=>{let s=!1,a;const d=h=>{s||(s=!0,b.disconnect(),a&&clearTimeout(a),i(h))},b=new MutationObserver(()=>{const h=I(t,r);h&&d(h)});b.observe(document.documentElement,{childList:!0,subtree:!0,attributes:!0});const f=e.timeout??4e3;f>0&&Number.isFinite(f)&&(a=setTimeout(()=>d(null),f))})}let T=null;function z(){if(T!==null)return T;try{T=new URLSearchParams(window.location.search).has("use_logs")}catch{T=!1}return T}function D(t){const e=`[tours:${t}]`;return{log:(...r)=>{z()&&console.log(e,...r)},warn:(...r)=>{z()&&console.warn(e,...r)},error:(...r)=>{z()&&console.error(e,...r)}}}function zt(t,e={}){const r=D("picker");let n=null,i=null,s=null,a=!1;function d(l){if(l===n)return!0;for(const g of e.ignore??[])if(g&&g.contains(l))return!0;return!1}function b(){if(n)return;n=document.createElement("div"),n.setAttribute("data-tours-picker",""),i=n.attachShadow({mode:"open"});const l=document.createElement("style");l.textContent=L,i.appendChild(l),s=document.createElement("div"),s.className="tours-picker-overlay",s.style.display="none",i.appendChild(s);const g=document.createElement("div");g.className="tours-picker-hint",g.textContent="Hover and click an element • Esc to cancel",i.appendChild(g),document.body.appendChild(n)}function f(l,g){const y=document.elementFromPoint(l,g);return!y||d(y)?null:y}function h(l){if(!a||!s)return;const g=f(l.clientX,l.clientY);if(!g){s.style.display="none";return}const y=g.getBoundingClientRect();s.style.display="block",s.style.left=`${y.left}px`,s.style.top=`${y.top}px`,s.style.width=`${y.width}px`,s.style.height=`${y.height}px`}function m(l){if(!a)return;const g=f(l.clientX,l.clientY);if(l.preventDefault(),l.stopPropagation(),!g)return;const y=it(g);r.log("picked",y),E(),t(y)}function c(l){l.key==="Escape"&&(l.preventDefault(),E())}function S(){a||(a=!0,r.log("start"),b(),document.addEventListener("mousemove",h,!0),document.addEventListener("click",m,!0),document.addEventListener("keydown",c,!0))}function E(){a&&(a=!1,document.removeEventListener("mousemove",h,!0),document.removeEventListener("click",m,!0),document.removeEventListener("keydown",c,!0),n&&n.parentNode&&n.parentNode.removeChild(n),n=null,i=null,s=null)}return{start:S,stop:E}}const Dt=6,Ut=6,Ot=10,Mt=12;function at(t,e,r){const n={top:t.top,bottom:r.height-t.bottom,left:t.left,right:r.width-t.right},i={top:e.height,bottom:e.height,left:e.width,right:e.width},s=["bottom","top","right","left"],a=s.find(d=>n[d]>=i[d]+8);return a||s.reduce((d,b)=>n[b]>n[d]?b:d,s[0])}function ct(t){const{target:e,card:r,offset:n,viewport:i}=t,s=t.side==="auto",a=s?at(e,r,i):t.side,d=s?"center":t.align,b=t.alignOffset??0,f=d==="start"?b:d==="end"?-b:0;let h=0,m=0;return a==="top"||a==="bottom"?(h=a==="top"?e.top-r.height-n:e.bottom+n,m=d==="start"?e.left:d==="end"?e.right-r.width:e.left+e.width/2-r.width/2,m+=f):(m=a==="left"?e.left-r.width-n:e.right+n,h=d==="start"?e.top:d==="end"?e.bottom-r.height:e.top+e.height/2-r.height/2,h+=f),m=Math.max(8,Math.min(m,i.width-r.width-8)),h=Math.max(8,Math.min(h,i.height-r.height-8)),{top:h,left:m}}function lt(t){const e=document.createElement("button");return e.type="button",e.className=`tours-card__btn${t.primary?" tours-card__btn--primary":""}${t.disabled?" tours-card__btn--disabled":""}`,e.textContent=t.label,!t.disabled&&t.onClick&&e.addEventListener("click",t.onClick),e}function ut(t){const e=document.createElement("div");if(e.className=`tours-card${t.ghost?" tours-card--ghost":""}`,t.radius!=null&&(e.style.borderRadius=`${t.radius}px`),t.showClose){const n=document.createElement("button");n.className="tours-card__close",n.type="button",n.textContent="×",n.setAttribute("aria-label","Close"),t.onClose&&n.addEventListener("click",t.onClose),e.appendChild(n)}const r=document.createElement("div");if(r.className="tours-card__content",t.contentHtml!=null?r.innerHTML=t.contentHtml:r.textContent=t.contentText??"",e.appendChild(r),t.back||t.next||t.progress){const n=document.createElement("div");if(n.className="tours-card__footer",t.back&&n.appendChild(lt(t.back)),t.progress){const i=document.createElement("span");i.className="tours-card__progress",i.textContent=t.progress,n.appendChild(i)}t.next&&n.appendChild(lt(t.next)),e.appendChild(n)}return e}const dt=`
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
`;function Ft(t){const e=t.replace(/[.+^${}()|[\]\\]/g,"\\$&").replace(/\*\*/g,"\0").replace(/\*/g,"[^/]*").replace(/ /g,".*").replace(/\?/g,".");return new RegExp(`^${e}$`)}function N(t,e){if(!t)return!0;if(t.regex)try{return new RegExp(t.regex).test(e)}catch{return!1}if(t.glob)try{return Ft(t.glob).test(e)}catch{return!1}return!0}function ft(t){if(!t||!t.glob)return null;const e=t.glob.replace(/\*+/g,"");return/^https?:\/\//i.test(e)||e.startsWith("#")||e.startsWith("/")?e:null}function j(t=window.innerWidth){return t<=640?"mobile":t<=1024?"tablet":"desktop"}function pt(t,e){if(t.url&&!N(t.url,e.url))return!1;if(t.traits){for(const[r,n]of Object.entries(t.traits))if(e.traits?.[r]!==n)return!1}return!(t.firstVisitOnly&&!e.firstVisit||t.device&&t.device!==e.device||t.unlessSeen&&e.seenCount>0||t.maxShows!==void 0&&e.seenCount>=t.maxShows)}function ht(t,e){return!t||pt(t,e)}function mt(t,e){return!t||t.length===0?!0:t.some(r=>pt(r.when,e))}const V="tours:locationchange";let gt=!1;function Yt(){if(!gt){gt=!0;for(const t of["pushState","replaceState"]){const e=history[t];history[t]=function(...n){const i=e.apply(this,n);return window.dispatchEvent(new Event(V)),i}}}}function X(t){return Yt(),window.addEventListener("popstate",t),window.addEventListener("hashchange",t),window.addEventListener(V,t),()=>{window.removeEventListener("popstate",t),window.removeEventListener("hashchange",t),window.removeEventListener(V,t)}}const U="tours:progress";function Ht(){return{get(t){try{return localStorage.getItem(t)}catch{return null}},set(t,e){try{localStorage.setItem(t,e)}catch{}},remove(t){try{localStorage.removeItem(t)}catch{}}}}function q(t){const e=t.get(U);if(!e)return null;try{const r=JSON.parse(e);if(typeof r?.tourId=="string"&&typeof r?.index=="number")return r}catch{}return null}function R(t,e){t.set(U,JSON.stringify(e))}function G(t){t.remove(U)}const bt="tours:seen:";function O(t,e){const r=t.get(bt+e),n=r?parseInt(r,10):0;return Number.isNaN(n)?0:n}function wt(t,e){t.set(bt+e,String(O(t,e)+1))}const Bt=`
:host { all: initial; }
/* Host-page custom properties still cascade in, so a site can restyle the
   popover without a custom renderer. */
.cta {
  position: fixed;
  z-index: 2147483200;
  box-sizing: border-box;
  max-width: 300px;
  padding: 16px 18px;
  font: 14px/1.5 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  color: var(--tours-cta-fg, #111827);
  background: var(--tours-cta-bg, #fff);
  border: 1px solid var(--tours-cta-border, #e5e7eb);
  border-radius: var(--tours-cta-radius, 14px);
  box-shadow: var(--tours-cta-shadow, 0 12px 32px rgba(15, 23, 42, 0.18));
}
.cta__text { margin: 0 0 12px; padding-right: 18px; }
.cta__btn {
  font: inherit;
  font-weight: 600;
  color: var(--tours-cta-btn-fg, #fff);
  background: var(--tours-cta-btn-bg, #2563eb);
  border: none;
  border-radius: var(--tours-cta-btn-radius, 9px);
  padding: 9px 16px;
  cursor: pointer;
}
.cta__btn:hover { background: var(--tours-cta-btn-bg-hover, #1d4ed8); }
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
`;function xt(t,e){return e?e(t):vt({text:t.text,button:t.button,corner:t.corner,offset:t.offset,onStart:t.onResume})}function vt(t){const e=t.corner??"bottom-right",r=t.offset??24,n=document.createElement("div");n.setAttribute("data-tours-cta","");const i=n.attachShadow({mode:"open"}),s=document.createElement("style");s.textContent=Bt,i.appendChild(s);const a=document.createElement("div");a.className="cta";const[d,b]=e.split("-");a.style[d]=`${r}px`,a.style[b]=`${r}px`;const f=()=>{n.parentNode&&n.parentNode.removeChild(n)},h=document.createElement("button");h.className="cta__close",h.type="button",h.textContent="×",h.setAttribute("aria-label","Dismiss"),h.addEventListener("click",f);const m=document.createElement("p");m.className="cta__text",m.textContent=t.text;const c=document.createElement("button");return c.className="cta__btn",c.type="button",c.textContent=t.button,c.addEventListener("click",()=>{f(),t.onStart()}),a.append(h,m,c),i.appendChild(a),document.body.appendChild(n),f}const Wt=new Set(["tourStarting","stepChanging"]);function C(t,e,r){const n=Wt.has(e);let i=!0;const s=t?.[e];if(s)try{s(r)===!1&&n&&(i=!1)}catch(a){console.error(`[tours] handler for "${e}" threw`,a)}if(typeof document<"u"&&typeof CustomEvent=="function")try{const a=new CustomEvent(`tours:${e}`,{detail:r,cancelable:n});document.dispatchEvent(a),n&&a.defaultPrevented&&(i=!1)}catch(a){console.error(`[tours] could not dispatch "tours:${e}"`,a)}return i}const jt="[data-tours-editor]";function K(){return typeof document<"u"&&document.querySelector(jt)!==null}function M(t,e={}){const r=D("player"),n=e.state;let i=null,s=null,a=null,d=null,b=null,f=null,h=null,m=!1,c=0,S=0,E=null;const l=t.display?.padding??Dt,g=t.display?.radius??Ut,y=t.display?.cardRadius??Ot,F=t.display?.offset??Mt;function J(o){return I(o.selectors)}function Z(o){return o.action?.type==="click"}function Xt(o){if(!o.condition)return!0;const u=n?O(n,t.id):0;return ht(o.condition,{url:window.location.href,traits:e.viewer?.(),device:j(),firstVisit:u===0,seenCount:u})}function A(o){return N(o.pageUrl,window.location.href)}function $(){n&&R(n,{tourId:t.id,index:c})}function Ct(){if(i)return;i=document.createElement("div"),i.setAttribute("data-tours-player",""),s=i.attachShadow({mode:"open"});const o=document.createElement("style");o.textContent=Tt+dt,s.appendChild(o),b=document.createElement("div"),b.className="tours-backdrop",b.addEventListener("click",u=>{const w=t.steps[c],x=w?J(w):null;if(x){const v=x.getBoundingClientRect();if(u.clientX>=v.left-l&&u.clientX<=v.right+l&&u.clientY>=v.top-l&&u.clientY<=v.bottom+l)return}_()}),s.appendChild(b),a=document.createElement("div"),a.className="tours-spotlight",a.style.borderRadius=`${g}px`,s.appendChild(a),document.body.appendChild(i)}function qt(o){if(!b)return;if(!o){b.style.clipPath="";return}const u=o.left-l,w=o.top-l,x=o.right+l,v=o.bottom+l;b.style.clipPath=`polygon(0 0, 0 100%, ${u}px 100%, ${u}px ${w}px, ${x}px ${w}px, ${x}px ${v}px, ${u}px ${v}px, ${u}px 100%, 100% 100%, 100% 0)`}function St(o,u=!1){a&&(a.style.transitionDuration=u?"0ms":"",a.style.display="block",a.style.left=`${o.left-l}px`,a.style.top=`${o.top-l}px`,a.style.width=`${o.width+l*2}px`,a.style.height=`${o.height+l*2}px`)}function kt(o,u){if(!d)return;const w={top:o.top-l,left:o.left-l,right:o.right+l,bottom:o.bottom+l,width:o.width+l*2,height:o.height+l*2},{top:x,left:v}=ct({target:w,card:{width:d.offsetWidth,height:d.offsetHeight},side:u.placement??"bottom",align:u.align??"center",offset:F,alignOffset:t.display?.alignOffset??0,viewport:{width:window.innerWidth,height:window.innerHeight}});d.style.left=`${v}px`,d.style.top=`${x}px`}function Gt(o){const u=Math.max(1,t.steps.length-S),w=Math.max(1,Math.min(c+1-S,u));d&&d.remove();const x=c===t.steps.length-1,v=t.steps[c-1],P=!!v&&A(v),te=!Z(o)||x;d=ut({contentText:o.content.default,progress:`Step ${w} of ${u}`,showClose:!0,onClose:Zt,radius:y,back:P?{label:o.backLabel??"Back",onClick:rt}:void 0,next:te?{label:o.nextLabel??(x?"Done":"Next"),primary:!0,onClick:nt}:void 0}),s?.appendChild(d)}function k(){if(!m)return;const o=t.steps[c];if(!o){_();return}if(r.log("render step",c,o.id),!Xt(o)){r.log(`step "${o.id}" skipped: condition not met`),C(e.on,"stepSkipped",{tour:t,index:c,step:o,reason:"condition"}),S+=1,c<t.steps.length-1?(c+=1,k()):_(S>=t.steps.length?"dismissed":"completed");return}const u=J(o);if(!u){r.log(`step "${o.id}" target not found yet — waiting`,o.selectors),W(o.selectors,{timeout:4e3}).then(x=>{!m||t.steps[c]!==o||(x?k():(r.warn(`step "${o.id}" skipped: no element for selectors`,o.selectors),C(e.on,"stepSkipped",{tour:t,index:c,step:o,reason:"no-element"}),S+=1,c<t.steps.length-1?(c+=1,k()):_()))});return}Ct(),u.scrollIntoView({behavior:"smooth",block:"center",inline:"center"}),Gt(o);const w=u.getBoundingClientRect();St(w),kt(w,o),qt(Z(o)?w:null),Kt(o),C(e.on,"stepActivated",{tour:t,index:c,step:o,target:u})}function Kt(o){if(f?.(),f=null,!Z(o))return;const u=c+1,w=t.steps[u];!w||A(w)||(f=X(()=>{!m||t.steps[c]!==o||N(w.pageUrl,window.location.href)&&et(u)&&(f?.(),f=null,r.log("visitor navigated → advancing to",w.id),c=u,$(),k())}))}function _t(o){m&&(o.key==="Escape"?(o.preventDefault(),_()):o.key==="ArrowRight"?nt():o.key==="ArrowLeft"&&rt())}function Y(){if(!m)return;const o=t.steps[c];if(!o)return;const u=J(o);if(!u)return;const w=u.getBoundingClientRect();St(w,!0),kt(w,o)}function $t(o=0){if(m||t.steps.length===0)return;if(!e.allowWhileEditing&&K()){r.log(`start suppressed for "${t.id}" — the builder is mounted`);return}const u=Math.max(0,Math.min(o,t.steps.length-1));if(!C(e.on,"tourStarting",{tour:t,index:u})){r.log("start vetoed by handler");return}tt(),m=!0,c=u,S=0,r.log("start",t.id,`at ${c}/${t.steps.length}`),Ct(),window.addEventListener("keydown",_t,!0),window.addEventListener("resize",Y,!0),window.addEventListener("scroll",Y,!0),$(),C(e.on,"tourStarted",{tour:t,index:c}),k()}function Jt(){a&&(a.style.display="none"),d&&(d.remove(),d=null)}function H(){Jt(),!E&&(E=X(()=>{if(!m){E?.(),E=null;return}const o=t.steps[c];o&&A(o)&&(E?.(),E=null,k())}))}function Q(){E&&(E(),E=null),f&&(f(),f=null),m&&(m=!1,window.removeEventListener("keydown",_t,!0),window.removeEventListener("resize",Y,!0),window.removeEventListener("scroll",Y,!0),i&&i.parentNode&&i.parentNode.removeChild(i),i=null,s=null,a=null,d=null,b=null)}function _(o="dismissed"){r.log("stop",o);const u=m,w=c;tt(),Q(),n&&G(n),u&&(o==="completed"?C(e.on,"tourCompleted",{tour:t}):C(e.on,"tourDismissed",{tour:t,index:w}))}function tt(){h?.(),h=null}function Zt(){t.dismiss?.mode==="minimize"?Lt():_()}function Lt(){m&&(r.log("minimized",t.id,`at ${c}`),Q(),n&&R(n,{tourId:t.id,index:c,minimized:!0}),C(e.on,"tourMinimized",{tour:t,index:c}),Qt())}function Qt(){tt();const o=t.dismiss?.resume;h=xt({tourId:t.id,text:o?.text??"Carry on with the tour?",button:o?.button??"Resume",corner:o?.corner,offset:o?.offset,onResume:()=>{h=null,n&&R(n,{tourId:t.id,index:c}),C(e.on,"tourResumed",{tour:t,index:c}),$t(c)}},e.renderResume)}function et(o){const u=t.steps[o];return u?C(e.on,"stepChanging",{tour:t,from:c,to:o,step:u}):!0}function nt(){if(!m)return;const o=c+1,u=t.steps[o];if(!u){_("completed");return}if(!et(o)){r.log("step change vetoed by handler");return}if(A(u)){c=o,$(),k();return}c=o,$();const w=P=>{Q(),e.onNavigate?e.onNavigate(P,u.id):window.location.assign(P)},x=t.steps[c-1]?.action;if(x&&x.type==="navigate"&&x.url){x.url.startsWith("#")?(r.log("page transition (hash navigate) → resume at",c),H(),window.location.hash=x.url):(r.log("page transition (navigate) → resume at",c),w(x.url));return}const v=ft(u.pageUrl);if(v){v.startsWith("#")?(r.log("page transition (derived hash) → resume at",c),H(),window.location.hash=v):(r.log("page transition (derived navigate) → resume at",c,v),w(v));return}r.log("page transition (wait) → resume at",c),H()}function rt(){if(!m)return;const o=t.steps[c-1];if(o){if(!et(c-1)){r.log("step change vetoed by handler");return}if(A(o)){c-=1,$(),k();return}c-=1,$(),r.log("page transition back → resume at",c),H(),window.history.back()}}return{start:$t,stop:_,next:nt,prev:rt,minimize:Lt,isActive:()=>m}}function yt(t,e={}){const r=e.state;if(!r)return null;const n=q(r);if(!n||n.tourId!==t.id)return null;if(!t.steps[n.index])return G(r),null;let i=-1;for(let a=n.index;a<t.steps.length;a++)if(N(t.steps[a].pageUrl,window.location.href)){i=a;break}if(i===-1)return null;const s=M(t,e);return s.start(i),s}function Et(t,e){if(K())return()=>{};const r=t.trigger??{type:"manual"};let n=!1;const i=()=>{n||(n=!0,e())};switch(r.type){case"load":{const s=setTimeout(i,0);return()=>clearTimeout(s)}case"timer":{const s=setTimeout(i,Math.max(0,r.delay));return()=>clearTimeout(s)}case"selector":{let s=!1;return W([r.selector],{timeout:0}).then(a=>{a&&!s&&i()}),()=>{s=!0}}case"cta":{let s=()=>{};return s=vt({text:r.text,button:r.button,corner:r.corner,offset:r.offset,onStart:i}),s}case"manual":default:return()=>{}}}function Vt(t,e={}){const r=D("mount"),n=e.state,i=()=>typeof t=="function"?t():t;let s=null,a=[],d=null;function b(){for(const c of a)c();a=[],d?.(),d=null}function f(c){return!e.canRun||e.canRun(c)}function h(){if(s?.isActive())return;s=null,b();const c=n?q(n):null;if(n&&c?.minimized){const l=i().find(g=>g.id===c.tourId&&f(g));if(l){const g=l.dismiss?.resume;d=xt({tourId:l.id,text:g?.text??"Carry on with the tour?",button:g?.button??"Resume",corner:g?.corner,offset:g?.offset,onResume:()=>{d=null,R(n,{tourId:l.id,index:c.index});const y=M(l,e);s=y,y.start(c.index)}},e.renderResume);return}}if(n)for(const l of i()){if(!f(l))continue;const g=yt(l,e);if(g){r.log("resumed",l.id),s=g;return}}const S=j(),E=e.viewer?.();for(const l of i()){if(!f(l)||!l.trigger||l.trigger.type==="manual")continue;const g=n?O(n,l.id):0;mt(l.rules,{url:window.location.href,traits:E,device:S,firstVisit:g===0,seenCount:g})&&a.push(Et(l,()=>{n&&wt(n,l.id);const F=M(l,e);s=F,F.start()}))}}h();const m=X(h);return()=>{m(),b(),s?.stop(),s=null}}p.CARD_STYLES=dt,p.PROGRESS_KEY=U,p.armTrigger=Et,p.autoSide=at,p.buildSelectors=it,p.clearProgress=G,p.createLocalState=Ht,p.createLogger=D,p.createPicker=zt,p.createPlayer=M,p.deriveUrl=ft,p.detectDevice=j,p.isBuilderMounted=K,p.isLoggingEnabled=z,p.markSeen=wt,p.matchRules=mt,p.matchUrl=N,p.matchesCondition=ht,p.mountTours=Vt,p.placeCard=ct,p.readProgress=q,p.renderCard=ut,p.resolveElement=I,p.resumeTour=yt,p.seenCount=O,p.waitForElement=W,p.writeProgress=R,Object.defineProperty(p,Symbol.toStringTag,{value:"Module"})}));
//# sourceMappingURL=index.umd.js.map
