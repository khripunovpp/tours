(function(d,k){typeof exports=="object"&&typeof module<"u"?k(exports):typeof define=="function"&&define.amd?define(["exports"],k):(d=typeof globalThis<"u"?globalThis:d||self,k(d.ToursCore={}))})(this,(function(d){"use strict";const k=`
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
`,le=`
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
`;function U(e){return JSON.stringify(e)}function ce(e){return/^[a-zA-Z][\w-]*$/.test(e)&&e.length<=30&&!/\d{2,}/.test(e)&&!/^(css-|sc-|jsx-|emotion-|_|is-|has-)/.test(e)}function W(e){const t=[];let n=e;for(;n&&n!==document.body&&n.nodeType===1;){const r=n.tagName.toLowerCase(),i=n.parentElement;if(!i){t.unshift(r);break}const s=Array.from(i.children).filter(l=>l.tagName===n.tagName);t.unshift(s.length>1?`${r}:nth-of-type(${s.indexOf(n)+1})`:r),n=i}return`body > ${t.join(" > ")}`}function de(e){let t=e.parentElement;for(;t&&t!==document.body&&!t.id;)t=t.parentElement;if(!t||!t.id)return null;const n=[];let r=e;for(;r&&r!==t;){const i=r.tagName.toLowerCase(),s=r.parentElement;if(!s)return null;const l=Array.from(s.children).filter(c=>c.tagName===r.tagName);n.unshift(l.length>1?`${i}:nth-of-type(${l.indexOf(r)+1})`:i),r=s}return`#${CSS.escape(t.id)} > ${n.join(" > ")}`}const ue=["data-testid","data-test","data-test-id","data-cy","data-qa","data-id","data-name"];function j(e){const t=[],n=new Set,r=e.tagName.toLowerCase(),i=o=>{if(!(!o||n.has(o)))try{document.querySelector(o)===e&&(n.add(o),t.push(o))}catch{}};e.id&&i(`#${CSS.escape(e.id)}`);for(const o of ue){const u=e.getAttribute(o);u&&i(`${r}[${o}=${U(u)}]`)}const s=e.getAttribute("name");s&&i(`${r}[name=${U(s)}]`);const l=e.getAttribute("aria-label");l&&i(`[aria-label=${U(l)}]`);const c=Array.from(e.classList).filter(ce);c.length&&i(`${r}.${c.map(o=>CSS.escape(o)).join(".")}`);for(const o of c)i(`${r}.${CSS.escape(o)}`);i(de(e)),i(W(e));const f=(e.textContent??"").replace(/\s+/g," ").trim();if(f&&f.length<=50&&/^(a|button|summary|label|h[1-6])$/.test(r)){const o=`text=${f}`;n.has(o)||(n.add(o),t.push(o))}return t.length===0&&t.push(W(e)),t}const fe="a, button, summary, label, h1, h2, h3, h4, h5, h6";function pe(e,t){if(e.startsWith("text=")){const n=e.slice(5).trim();for(const r of Array.from(t.querySelectorAll(fe)))if((r.textContent??"").replace(/\s+/g," ").trim()===n)return r;return null}try{return t.querySelector(e)}catch{return null}}function T(e,t=document){for(const n of e){const r=pe(n,t);if(r)return r}return null}function z(e,t={}){const n=t.root??document,r=T(e,n);return r?Promise.resolve(r):new Promise(i=>{let s=!1,l;const c=u=>{s||(s=!0,f.disconnect(),l&&clearTimeout(l),i(u))},f=new MutationObserver(()=>{const u=T(e,n);u&&c(u)});f.observe(document.documentElement,{childList:!0,subtree:!0,attributes:!0});const o=t.timeout??4e3;o>0&&Number.isFinite(o)&&(l=setTimeout(()=>c(null),o))})}let S=null;function N(){if(S!==null)return S;try{S=new URLSearchParams(window.location.search).has("use_logs")}catch{S=!1}return S}function O(e){const t=`[tours:${e}]`;return{log:(...n)=>{N()&&console.log(t,...n)},warn:(...n)=>{N()&&console.warn(t,...n)},error:(...n)=>{N()&&console.error(t,...n)}}}function he(e,t={}){const n=O("picker");let r=null,i=null,s=null,l=!1;function c(m){if(m===r)return!0;for(const b of t.ignore??[])if(b&&b.contains(m))return!0;return!1}function f(){if(r)return;r=document.createElement("div"),r.setAttribute("data-tours-picker",""),i=r.attachShadow({mode:"open"});const m=document.createElement("style");m.textContent=k,i.appendChild(m),s=document.createElement("div"),s.className="tours-picker-overlay",s.style.display="none",i.appendChild(s);const b=document.createElement("div");b.className="tours-picker-hint",b.textContent="Hover and click an element • Esc to cancel",i.appendChild(b),document.body.appendChild(r)}function o(m,b){const x=document.elementFromPoint(m,b);return!x||c(x)?null:x}function u(m){if(!l||!s)return;const b=o(m.clientX,m.clientY);if(!b){s.style.display="none";return}const x=b.getBoundingClientRect();s.style.display="block",s.style.left=`${x.left}px`,s.style.top=`${x.top}px`,s.style.width=`${x.width}px`,s.style.height=`${x.height}px`}function h(m){if(!l)return;const b=o(m.clientX,m.clientY);if(m.preventDefault(),m.stopPropagation(),!b)return;const x=j(b);n.log("picked",x),L(),e(x)}function g(m){m.key==="Escape"&&(m.preventDefault(),L())}function F(){l||(l=!0,n.log("start"),f(),document.addEventListener("mousemove",u,!0),document.addEventListener("click",h,!0),document.addEventListener("keydown",g,!0))}function L(){l&&(l=!1,document.removeEventListener("mousemove",u,!0),document.removeEventListener("click",h,!0),document.removeEventListener("keydown",g,!0),r&&r.parentNode&&r.parentNode.removeChild(r),r=null,i=null,s=null)}return{start:F,stop:L}}const ge=6,me=6,be=10,we=12;function X(e,t,n){const r={top:e.top,bottom:n.height-e.bottom,left:e.left,right:n.width-e.right},i={top:t.height,bottom:t.height,left:t.width,right:t.width},s=["bottom","top","right","left"],l=s.find(c=>r[c]>=i[c]+8);return l||s.reduce((c,f)=>r[f]>r[c]?f:c,s[0])}function B(e){const{target:t,card:n,offset:r,viewport:i}=e,s=e.side==="auto",l=s?X(t,n,i):e.side,c=s?"center":e.align,f=e.alignOffset??0,o=c==="start"?f:c==="end"?-f:0;let u=0,h=0;return l==="top"||l==="bottom"?(u=l==="top"?t.top-n.height-r:t.bottom+r,h=c==="start"?t.left:c==="end"?t.right-n.width:t.left+t.width/2-n.width/2,h+=o):(h=l==="left"?t.left-n.width-r:t.right+r,u=c==="start"?t.top:c==="end"?t.bottom-n.height:t.top+t.height/2-n.height/2,u+=o),h=Math.max(8,Math.min(h,i.width-n.width-8)),u=Math.max(8,Math.min(u,i.height-n.height-8)),{top:u,left:h}}function K(e){const t=document.createElement("button");return t.type="button",t.className=`tours-card__btn${e.primary?" tours-card__btn--primary":""}${e.disabled?" tours-card__btn--disabled":""}`,t.textContent=e.label,!e.disabled&&e.onClick&&t.addEventListener("click",e.onClick),t}function V(e){const t=document.createElement("div");if(t.className=`tours-card${e.ghost?" tours-card--ghost":""}`,e.radius!=null&&(t.style.borderRadius=`${e.radius}px`),e.showClose){const r=document.createElement("button");r.className="tours-card__close",r.type="button",r.textContent="×",r.setAttribute("aria-label","Close"),e.onClose&&r.addEventListener("click",e.onClose),t.appendChild(r)}const n=document.createElement("div");if(n.className="tours-card__content",e.contentHtml!=null?n.innerHTML=e.contentHtml:n.textContent=e.contentText??"",t.appendChild(n),e.back||e.next||e.progress){const r=document.createElement("div");if(r.className="tours-card__footer",e.back&&r.appendChild(K(e.back)),e.progress){const i=document.createElement("span");i.className="tours-card__progress",i.textContent=e.progress,r.appendChild(i)}e.next&&r.appendChild(K(e.next)),t.appendChild(r)}return t}const q=`
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
`;function xe(e){const t=e.replace(/[.+^${}()|[\]\\]/g,"\\$&").replace(/\*\*/g,"\0").replace(/\*/g,"[^/]*").replace(/ /g,".*").replace(/\?/g,".");return new RegExp(`^${t}$`)}function A(e,t){if(!e)return!0;if(e.regex)try{return new RegExp(e.regex).test(t)}catch{return!1}if(e.glob)try{return xe(e.glob).test(t)}catch{return!1}return!0}function G(e){if(!e||!e.glob)return null;const t=e.glob.replace(/\*+/g,"");return/^https?:\/\//i.test(t)||t.startsWith("#")||t.startsWith("/")?t:null}const I="tours:locationchange";let J=!1;function ye(){if(!J){J=!0;for(const e of["pushState","replaceState"]){const t=history[e];history[e]=function(...r){const i=t.apply(this,r);return window.dispatchEvent(new Event(I)),i}}}}function ve(e){return ye(),window.addEventListener("popstate",e),window.addEventListener("hashchange",e),window.addEventListener(I,e),()=>{window.removeEventListener("popstate",e),window.removeEventListener("hashchange",e),window.removeEventListener(I,e)}}const R="tours:progress";function Ee(){return{get(e){try{return localStorage.getItem(e)}catch{return null}},set(e,t){try{localStorage.setItem(e,t)}catch{}},remove(e){try{localStorage.removeItem(e)}catch{}}}}function Z(e){const t=e.get(R);if(!t)return null;try{const n=JSON.parse(t);if(typeof n?.tourId=="string"&&typeof n?.index=="number")return n}catch{}return null}function Q(e,t){e.set(R,JSON.stringify(t))}function M(e){e.remove(R)}const ee="tours:seen:";function te(e,t){const n=e.get(ee+t),r=n?parseInt(n,10):0;return Number.isNaN(r)?0:r}function Ce(e,t){e.set(ee+t,String(te(e,t)+1))}function ne(e,t={}){const n=O("player"),r=t.state;let i=null,s=null,l=null,c=null,f=!1,o=0,u=0,h=null;const g=e.display?.padding??ge,F=e.display?.radius??me,L=e.display?.cardRadius??be,m=e.display?.offset??we;function b(a){return T(a.selectors)}function x(a){return A(a.pageUrl,window.location.href)}function $(){r&&Q(r,{tourId:e.id,index:o})}function re(){if(i)return;i=document.createElement("div"),i.setAttribute("data-tours-player",""),s=i.attachShadow({mode:"open"});const a=document.createElement("style");a.textContent=le+q,s.appendChild(a);const p=document.createElement("div");p.className="tours-backdrop",p.addEventListener("click",w=>{const y=e.steps[o],v=y?b(y):null;if(v){const C=v.getBoundingClientRect();if(w.clientX>=C.left-g&&w.clientX<=C.right+g&&w.clientY>=C.top-g&&w.clientY<=C.bottom+g)return}E()}),s.appendChild(p),l=document.createElement("div"),l.className="tours-spotlight",l.style.borderRadius=`${F}px`,s.appendChild(l),document.body.appendChild(i)}function oe(a,p=!1){l&&(l.style.transitionDuration=p?"0ms":"",l.style.display="block",l.style.left=`${a.left-g}px`,l.style.top=`${a.top-g}px`,l.style.width=`${a.width+g*2}px`,l.style.height=`${a.height+g*2}px`)}function ie(a,p){if(!c)return;const w={top:a.top-g,left:a.left-g,right:a.right+g,bottom:a.bottom+g,width:a.width+g*2,height:a.height+g*2},{top:y,left:v}=B({target:w,card:{width:c.offsetWidth,height:c.offsetHeight},side:p.placement??"bottom",align:p.align??"center",offset:m,alignOffset:e.display?.alignOffset??0,viewport:{width:window.innerWidth,height:window.innerHeight}});c.style.left=`${v}px`,c.style.top=`${y}px`}function Ae(a){const p=Math.max(1,e.steps.length-u),w=Math.max(1,Math.min(o+1-u,p));c&&c.remove(),c=V({contentText:a.content.default,progress:`Step ${w} of ${p}`,showClose:!0,onClose:E,radius:L,back:{label:a.backLabel??"Back",disabled:o===0,onClick:H},next:{label:a.nextLabel??(o===p-1?"Done":"Next"),primary:!0,onClick:Y}}),s?.appendChild(c)}function _(){if(!f)return;const a=e.steps[o];if(!a){E();return}n.log("render step",o,a.id);const p=b(a);if(!p){n.log(`step "${a.id}" target not found yet — waiting`,a.selectors),z(a.selectors,{timeout:4e3}).then(y=>{!f||e.steps[o]!==a||(y?_():(n.warn(`step "${a.id}" skipped: no element for selectors`,a.selectors),u+=1,o<e.steps.length-1?(o+=1,_()):E()))});return}re(),p.scrollIntoView({behavior:"smooth",block:"center",inline:"center"}),Ae(a);const w=p.getBoundingClientRect();oe(w),ie(w,a)}function se(a){f&&(a.key==="Escape"?(a.preventDefault(),E()):a.key==="ArrowRight"?Y():a.key==="ArrowLeft"&&H())}function P(){if(!f)return;const a=e.steps[o];if(!a)return;const p=b(a);if(!p)return;const w=p.getBoundingClientRect();oe(w,!0),ie(w,a)}function Re(a=0){f||e.steps.length!==0&&(f=!0,o=Math.max(0,Math.min(a,e.steps.length-1)),u=0,n.log("start",e.id,`at ${o}/${e.steps.length}`),re(),window.addEventListener("keydown",se,!0),window.addEventListener("resize",P,!0),window.addEventListener("scroll",P,!0),$(),_())}function Pe(){l&&(l.style.display="none"),c&&(c.remove(),c=null)}function D(){Pe(),!h&&(h=ve(()=>{if(!f){h?.(),h=null;return}const a=e.steps[o];a&&x(a)&&(h?.(),h=null,_())}))}function ae(){h&&(h(),h=null),f&&(f=!1,window.removeEventListener("keydown",se,!0),window.removeEventListener("resize",P,!0),window.removeEventListener("scroll",P,!0),i&&i.parentNode&&i.parentNode.removeChild(i),i=null,s=null,l=null,c=null)}function E(){n.log("stop"),ae(),r&&M(r)}function Y(){if(!f)return;const a=o+1,p=e.steps[a];if(!p){E();return}if(x(p)){o=a,$(),_();return}o=a,$();const w=C=>{ae(),t.onNavigate?t.onNavigate(C,p.id):window.location.assign(C)},y=e.steps[o-1]?.action;if(y&&y.type==="navigate"&&y.url){y.url.startsWith("#")?(n.log("page transition (hash navigate) → resume at",o),D(),window.location.hash=y.url):(n.log("page transition (navigate) → resume at",o),w(y.url));return}const v=G(p.pageUrl);if(v){v.startsWith("#")?(n.log("page transition (derived hash) → resume at",o),D(),window.location.hash=v):(n.log("page transition (derived navigate) → resume at",o,v),w(v));return}n.log("page transition (wait) → resume at",o),D()}function H(){if(!f)return;const a=e.steps[o-1];if(a){if(x(a)){o-=1,$(),_();return}o-=1,$(),n.log("page transition back → resume at",o),D(),window.history.back()}}return{start:Re,stop:E,next:Y,prev:H}}function _e(e,t={}){const n=t.state;if(!n)return null;const r=Z(n);if(!r||r.tourId!==e.id)return null;const i=e.steps[r.index];if(!i)return M(n),null;if(!A(i.pageUrl,window.location.href))return null;const s=ne(e,{state:n});return s.start(r.index),s}const ke=`
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
`;function Se(e){const t=e.corner??"bottom-right",n=e.offset??24,r=document.createElement("div");r.setAttribute("data-tours-cta","");const i=r.attachShadow({mode:"open"}),s=document.createElement("style");s.textContent=ke,i.appendChild(s);const l=document.createElement("div");l.className="cta";const[c,f]=t.split("-");l.style[c]=`${n}px`,l.style[f]=`${n}px`;const o=()=>{r.parentNode&&r.parentNode.removeChild(r)},u=document.createElement("button");u.className="cta__close",u.type="button",u.textContent="×",u.setAttribute("aria-label","Dismiss"),u.addEventListener("click",o);const h=document.createElement("p");h.className="cta__text",h.textContent=e.text;const g=document.createElement("button");return g.className="cta__btn",g.type="button",g.textContent=e.button,g.addEventListener("click",()=>{o(),e.onStart()}),l.append(u,h,g),i.appendChild(l),document.body.appendChild(r),o}function Le(e,t){const n=e.trigger??{type:"manual"};let r=!1;const i=()=>{r||(r=!0,t())};switch(n.type){case"load":{const s=setTimeout(i,0);return()=>clearTimeout(s)}case"timer":{const s=setTimeout(i,Math.max(0,n.delay));return()=>clearTimeout(s)}case"selector":{let s=!1;return z([n.selector],{timeout:0}).then(l=>{l&&!s&&i()}),()=>{s=!0}}case"cta":{let s=()=>{};return s=Se({text:n.text,button:n.button,corner:n.corner,offset:n.offset,onStart:i}),s}case"manual":default:return()=>{}}}function $e(e=window.innerWidth){return e<=640?"mobile":e<=1024?"tablet":"desktop"}function Te(e,t){return!(e.url&&!A(e.url,t.url)||e.role!==void 0&&e.role!==t.role||e.firstVisitOnly&&!t.firstVisit||e.device&&e.device!==t.device||e.unlessSeen&&t.seenCount>0||e.maxShows!==void 0&&t.seenCount>=e.maxShows)}function Ne(e,t){return!e||e.length===0?!0:e.some(n=>Te(n.when,t))}d.CARD_STYLES=q,d.PROGRESS_KEY=R,d.armTrigger=Le,d.autoSide=X,d.buildSelectors=j,d.clearProgress=M,d.createLocalState=Ee,d.createLogger=O,d.createPicker=he,d.createPlayer=ne,d.deriveUrl=G,d.detectDevice=$e,d.isLoggingEnabled=N,d.markSeen=Ce,d.matchRules=Ne,d.matchUrl=A,d.placeCard=B,d.readProgress=Z,d.renderCard=V,d.resolveElement=T,d.resumeTour=_e,d.seenCount=te,d.waitForElement=z,d.writeProgress=Q,Object.defineProperty(d,Symbol.toStringTag,{value:"Module"})}));
//# sourceMappingURL=index.umd.js.map
