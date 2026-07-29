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
`,lt=`
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
`;function U(t){return JSON.stringify(t)}function dt(t){return/^[a-zA-Z][\w-]*$/.test(t)&&t.length<=30&&!/\d{2,}/.test(t)&&!/^(css-|sc-|jsx-|emotion-|_|is-|has-)/.test(t)}function W(t){const e=[];let n=t;for(;n&&n!==document.body&&n.nodeType===1;){const r=n.tagName.toLowerCase(),i=n.parentElement;if(!i){e.unshift(r);break}const s=Array.from(i.children).filter(c=>c.tagName===n.tagName);e.unshift(s.length>1?`${r}:nth-of-type(${s.indexOf(n)+1})`:r),n=i}return`body > ${e.join(" > ")}`}function ut(t){let e=t.parentElement;for(;e&&e!==document.body&&!e.id;)e=e.parentElement;if(!e||!e.id)return null;const n=[];let r=t;for(;r&&r!==e;){const i=r.tagName.toLowerCase(),s=r.parentElement;if(!s)return null;const c=Array.from(s.children).filter(l=>l.tagName===r.tagName);n.unshift(c.length>1?`${i}:nth-of-type(${c.indexOf(r)+1})`:i),r=s}return`#${CSS.escape(e.id)} > ${n.join(" > ")}`}const ft=["data-testid","data-test","data-test-id","data-cy","data-qa","data-id","data-name"];function j(t){const e=[],n=new Set,r=t.tagName.toLowerCase(),i=o=>{if(!(!o||n.has(o)))try{document.querySelector(o)===t&&(n.add(o),e.push(o))}catch{}};t.id&&i(`#${CSS.escape(t.id)}`);for(const o of ft){const u=t.getAttribute(o);u&&i(`${r}[${o}=${U(u)}]`)}const s=t.getAttribute("name");s&&i(`${r}[name=${U(s)}]`);const c=t.getAttribute("aria-label");c&&i(`[aria-label=${U(c)}]`);const l=Array.from(t.classList).filter(dt);l.length&&i(`${r}.${l.map(o=>CSS.escape(o)).join(".")}`);for(const o of l)i(`${r}.${CSS.escape(o)}`);i(ut(t)),i(W(t));const f=(t.textContent??"").replace(/\s+/g," ").trim();if(f&&f.length<=50&&/^(a|button|summary|label|h[1-6])$/.test(r)){const o=`text=${f}`;n.has(o)||(n.add(o),e.push(o))}return e.length===0&&e.push(W(t)),e}const pt="a, button, summary, label, h1, h2, h3, h4, h5, h6";function X(t,e){return!(t instanceof Element)||!t.isConnected||e!==document&&e instanceof Node&&!e.contains(t)?null:t}function ht(t,e){if(typeof t=="function"){let n;try{n=t()}catch{return null}return X(n,e)}if(typeof t!="string")return X(t,e);if(t.startsWith("text=")){const n=t.slice(5).trim();for(const r of Array.from(e.querySelectorAll(pt)))if((r.textContent??"").replace(/\s+/g," ").trim()===n)return r;return null}try{return e.querySelector(t)}catch{return null}}function N(t,e=document){for(const n of t){const r=ht(n,e);if(r)return r}return null}function z(t,e={}){const n=e.root??document,r=N(t,n);return r?Promise.resolve(r):new Promise(i=>{let s=!1,c;const l=u=>{s||(s=!0,f.disconnect(),c&&clearTimeout(c),i(u))},f=new MutationObserver(()=>{const u=N(t,n);u&&l(u)});f.observe(document.documentElement,{childList:!0,subtree:!0,attributes:!0});const o=e.timeout??4e3;o>0&&Number.isFinite(o)&&(c=setTimeout(()=>l(null),o))})}let S=null;function T(){if(S!==null)return S;try{S=new URLSearchParams(window.location.search).has("use_logs")}catch{S=!1}return S}function O(t){const e=`[tours:${t}]`;return{log:(...n)=>{T()&&console.log(e,...n)},warn:(...n)=>{T()&&console.warn(e,...n)},error:(...n)=>{T()&&console.error(e,...n)}}}function gt(t,e={}){const n=O("picker");let r=null,i=null,s=null,c=!1;function l(m){if(m===r)return!0;for(const b of e.ignore??[])if(b&&b.contains(m))return!0;return!1}function f(){if(r)return;r=document.createElement("div"),r.setAttribute("data-tours-picker",""),i=r.attachShadow({mode:"open"});const m=document.createElement("style");m.textContent=k,i.appendChild(m),s=document.createElement("div"),s.className="tours-picker-overlay",s.style.display="none",i.appendChild(s);const b=document.createElement("div");b.className="tours-picker-hint",b.textContent="Hover and click an element • Esc to cancel",i.appendChild(b),document.body.appendChild(r)}function o(m,b){const x=document.elementFromPoint(m,b);return!x||l(x)?null:x}function u(m){if(!c||!s)return;const b=o(m.clientX,m.clientY);if(!b){s.style.display="none";return}const x=b.getBoundingClientRect();s.style.display="block",s.style.left=`${x.left}px`,s.style.top=`${x.top}px`,s.style.width=`${x.width}px`,s.style.height=`${x.height}px`}function h(m){if(!c)return;const b=o(m.clientX,m.clientY);if(m.preventDefault(),m.stopPropagation(),!b)return;const x=j(b);n.log("picked",x),L(),t(x)}function g(m){m.key==="Escape"&&(m.preventDefault(),L())}function F(){c||(c=!0,n.log("start"),f(),document.addEventListener("mousemove",u,!0),document.addEventListener("click",h,!0),document.addEventListener("keydown",g,!0))}function L(){c&&(c=!1,document.removeEventListener("mousemove",u,!0),document.removeEventListener("click",h,!0),document.removeEventListener("keydown",g,!0),r&&r.parentNode&&r.parentNode.removeChild(r),r=null,i=null,s=null)}return{start:F,stop:L}}const mt=6,bt=6,wt=10,xt=12;function B(t,e,n){const r={top:t.top,bottom:n.height-t.bottom,left:t.left,right:n.width-t.right},i={top:e.height,bottom:e.height,left:e.width,right:e.width},s=["bottom","top","right","left"],c=s.find(l=>r[l]>=i[l]+8);return c||s.reduce((l,f)=>r[f]>r[l]?f:l,s[0])}function K(t){const{target:e,card:n,offset:r,viewport:i}=t,s=t.side==="auto",c=s?B(e,n,i):t.side,l=s?"center":t.align,f=t.alignOffset??0,o=l==="start"?f:l==="end"?-f:0;let u=0,h=0;return c==="top"||c==="bottom"?(u=c==="top"?e.top-n.height-r:e.bottom+r,h=l==="start"?e.left:l==="end"?e.right-n.width:e.left+e.width/2-n.width/2,h+=o):(h=c==="left"?e.left-n.width-r:e.right+r,u=l==="start"?e.top:l==="end"?e.bottom-n.height:e.top+e.height/2-n.height/2,u+=o),h=Math.max(8,Math.min(h,i.width-n.width-8)),u=Math.max(8,Math.min(u,i.height-n.height-8)),{top:u,left:h}}function V(t){const e=document.createElement("button");return e.type="button",e.className=`tours-card__btn${t.primary?" tours-card__btn--primary":""}${t.disabled?" tours-card__btn--disabled":""}`,e.textContent=t.label,!t.disabled&&t.onClick&&e.addEventListener("click",t.onClick),e}function q(t){const e=document.createElement("div");if(e.className=`tours-card${t.ghost?" tours-card--ghost":""}`,t.radius!=null&&(e.style.borderRadius=`${t.radius}px`),t.showClose){const r=document.createElement("button");r.className="tours-card__close",r.type="button",r.textContent="×",r.setAttribute("aria-label","Close"),t.onClose&&r.addEventListener("click",t.onClose),e.appendChild(r)}const n=document.createElement("div");if(n.className="tours-card__content",t.contentHtml!=null?n.innerHTML=t.contentHtml:n.textContent=t.contentText??"",e.appendChild(n),t.back||t.next||t.progress){const r=document.createElement("div");if(r.className="tours-card__footer",t.back&&r.appendChild(V(t.back)),t.progress){const i=document.createElement("span");i.className="tours-card__progress",i.textContent=t.progress,r.appendChild(i)}t.next&&r.appendChild(V(t.next)),e.appendChild(r)}return e}const G=`
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
`;function yt(t){const e=t.replace(/[.+^${}()|[\]\\]/g,"\\$&").replace(/\*\*/g,"\0").replace(/\*/g,"[^/]*").replace(/ /g,".*").replace(/\?/g,".");return new RegExp(`^${e}$`)}function A(t,e){if(!t)return!0;if(t.regex)try{return new RegExp(t.regex).test(e)}catch{return!1}if(t.glob)try{return yt(t.glob).test(e)}catch{return!1}return!0}function J(t){if(!t||!t.glob)return null;const e=t.glob.replace(/\*+/g,"");return/^https?:\/\//i.test(e)||e.startsWith("#")||e.startsWith("/")?e:null}const I="tours:locationchange";let Z=!1;function vt(){if(!Z){Z=!0;for(const t of["pushState","replaceState"]){const e=history[t];history[t]=function(...r){const i=e.apply(this,r);return window.dispatchEvent(new Event(I)),i}}}}function Et(t){return vt(),window.addEventListener("popstate",t),window.addEventListener("hashchange",t),window.addEventListener(I,t),()=>{window.removeEventListener("popstate",t),window.removeEventListener("hashchange",t),window.removeEventListener(I,t)}}const R="tours:progress";function Ct(){return{get(t){try{return localStorage.getItem(t)}catch{return null}},set(t,e){try{localStorage.setItem(t,e)}catch{}},remove(t){try{localStorage.removeItem(t)}catch{}}}}function Q(t){const e=t.get(R);if(!e)return null;try{const n=JSON.parse(e);if(typeof n?.tourId=="string"&&typeof n?.index=="number")return n}catch{}return null}function tt(t,e){t.set(R,JSON.stringify(e))}function M(t){t.remove(R)}const et="tours:seen:";function nt(t,e){const n=t.get(et+e),r=n?parseInt(n,10):0;return Number.isNaN(r)?0:r}function _t(t,e){t.set(et+e,String(nt(t,e)+1))}function rt(t,e={}){const n=O("player"),r=e.state;let i=null,s=null,c=null,l=null,f=!1,o=0,u=0,h=null;const g=t.display?.padding??mt,F=t.display?.radius??bt,L=t.display?.cardRadius??wt,m=t.display?.offset??xt;function b(a){return N(a.selectors)}function x(a){return A(a.pageUrl,window.location.href)}function $(){r&&tt(r,{tourId:t.id,index:o})}function ot(){if(i)return;i=document.createElement("div"),i.setAttribute("data-tours-player",""),s=i.attachShadow({mode:"open"});const a=document.createElement("style");a.textContent=lt+G,s.appendChild(a);const p=document.createElement("div");p.className="tours-backdrop",p.addEventListener("click",w=>{const y=t.steps[o],v=y?b(y):null;if(v){const C=v.getBoundingClientRect();if(w.clientX>=C.left-g&&w.clientX<=C.right+g&&w.clientY>=C.top-g&&w.clientY<=C.bottom+g)return}E()}),s.appendChild(p),c=document.createElement("div"),c.className="tours-spotlight",c.style.borderRadius=`${F}px`,s.appendChild(c),document.body.appendChild(i)}function it(a,p=!1){c&&(c.style.transitionDuration=p?"0ms":"",c.style.display="block",c.style.left=`${a.left-g}px`,c.style.top=`${a.top-g}px`,c.style.width=`${a.width+g*2}px`,c.style.height=`${a.height+g*2}px`)}function st(a,p){if(!l)return;const w={top:a.top-g,left:a.left-g,right:a.right+g,bottom:a.bottom+g,width:a.width+g*2,height:a.height+g*2},{top:y,left:v}=K({target:w,card:{width:l.offsetWidth,height:l.offsetHeight},side:p.placement??"bottom",align:p.align??"center",offset:m,alignOffset:t.display?.alignOffset??0,viewport:{width:window.innerWidth,height:window.innerHeight}});l.style.left=`${v}px`,l.style.top=`${y}px`}function Rt(a){const p=Math.max(1,t.steps.length-u),w=Math.max(1,Math.min(o+1-u,p));l&&l.remove(),l=q({contentText:a.content.default,progress:`Step ${w} of ${p}`,showClose:!0,onClose:E,radius:L,back:{label:a.backLabel??"Back",disabled:o===0,onClick:H},next:{label:a.nextLabel??(o===p-1?"Done":"Next"),primary:!0,onClick:Y}}),s?.appendChild(l)}function _(){if(!f)return;const a=t.steps[o];if(!a){E();return}n.log("render step",o,a.id);const p=b(a);if(!p){n.log(`step "${a.id}" target not found yet — waiting`,a.selectors),z(a.selectors,{timeout:4e3}).then(y=>{!f||t.steps[o]!==a||(y?_():(n.warn(`step "${a.id}" skipped: no element for selectors`,a.selectors),u+=1,o<t.steps.length-1?(o+=1,_()):E()))});return}ot(),p.scrollIntoView({behavior:"smooth",block:"center",inline:"center"}),Rt(a);const w=p.getBoundingClientRect();it(w),st(w,a)}function at(a){f&&(a.key==="Escape"?(a.preventDefault(),E()):a.key==="ArrowRight"?Y():a.key==="ArrowLeft"&&H())}function P(){if(!f)return;const a=t.steps[o];if(!a)return;const p=b(a);if(!p)return;const w=p.getBoundingClientRect();it(w,!0),st(w,a)}function Pt(a=0){f||t.steps.length!==0&&(f=!0,o=Math.max(0,Math.min(a,t.steps.length-1)),u=0,n.log("start",t.id,`at ${o}/${t.steps.length}`),ot(),window.addEventListener("keydown",at,!0),window.addEventListener("resize",P,!0),window.addEventListener("scroll",P,!0),$(),_())}function Dt(){c&&(c.style.display="none"),l&&(l.remove(),l=null)}function D(){Dt(),!h&&(h=Et(()=>{if(!f){h?.(),h=null;return}const a=t.steps[o];a&&x(a)&&(h?.(),h=null,_())}))}function ct(){h&&(h(),h=null),f&&(f=!1,window.removeEventListener("keydown",at,!0),window.removeEventListener("resize",P,!0),window.removeEventListener("scroll",P,!0),i&&i.parentNode&&i.parentNode.removeChild(i),i=null,s=null,c=null,l=null)}function E(){n.log("stop"),ct(),r&&M(r)}function Y(){if(!f)return;const a=o+1,p=t.steps[a];if(!p){E();return}if(x(p)){o=a,$(),_();return}o=a,$();const w=C=>{ct(),e.onNavigate?e.onNavigate(C,p.id):window.location.assign(C)},y=t.steps[o-1]?.action;if(y&&y.type==="navigate"&&y.url){y.url.startsWith("#")?(n.log("page transition (hash navigate) → resume at",o),D(),window.location.hash=y.url):(n.log("page transition (navigate) → resume at",o),w(y.url));return}const v=J(p.pageUrl);if(v){v.startsWith("#")?(n.log("page transition (derived hash) → resume at",o),D(),window.location.hash=v):(n.log("page transition (derived navigate) → resume at",o,v),w(v));return}n.log("page transition (wait) → resume at",o),D()}function H(){if(!f)return;const a=t.steps[o-1];if(a){if(x(a)){o-=1,$(),_();return}o-=1,$(),n.log("page transition back → resume at",o),D(),window.history.back()}}return{start:Pt,stop:E,next:Y,prev:H}}function kt(t,e={}){const n=e.state;if(!n)return null;const r=Q(n);if(!r||r.tourId!==t.id)return null;const i=t.steps[r.index];if(!i)return M(n),null;if(!A(i.pageUrl,window.location.href))return null;const s=rt(t,{state:n});return s.start(r.index),s}const St=`
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
`;function Lt(t){const e=t.corner??"bottom-right",n=t.offset??24,r=document.createElement("div");r.setAttribute("data-tours-cta","");const i=r.attachShadow({mode:"open"}),s=document.createElement("style");s.textContent=St,i.appendChild(s);const c=document.createElement("div");c.className="cta";const[l,f]=e.split("-");c.style[l]=`${n}px`,c.style[f]=`${n}px`;const o=()=>{r.parentNode&&r.parentNode.removeChild(r)},u=document.createElement("button");u.className="cta__close",u.type="button",u.textContent="×",u.setAttribute("aria-label","Dismiss"),u.addEventListener("click",o);const h=document.createElement("p");h.className="cta__text",h.textContent=t.text;const g=document.createElement("button");return g.className="cta__btn",g.type="button",g.textContent=t.button,g.addEventListener("click",()=>{o(),t.onStart()}),c.append(u,h,g),i.appendChild(c),document.body.appendChild(r),o}function $t(t,e){const n=t.trigger??{type:"manual"};let r=!1;const i=()=>{r||(r=!0,e())};switch(n.type){case"load":{const s=setTimeout(i,0);return()=>clearTimeout(s)}case"timer":{const s=setTimeout(i,Math.max(0,n.delay));return()=>clearTimeout(s)}case"selector":{let s=!1;return z([n.selector],{timeout:0}).then(c=>{c&&!s&&i()}),()=>{s=!0}}case"cta":{let s=()=>{};return s=Lt({text:n.text,button:n.button,corner:n.corner,offset:n.offset,onStart:i}),s}case"manual":default:return()=>{}}}function Nt(t=window.innerWidth){return t<=640?"mobile":t<=1024?"tablet":"desktop"}function Tt(t,e){return!(t.url&&!A(t.url,e.url)||t.role!==void 0&&t.role!==e.role||t.firstVisitOnly&&!e.firstVisit||t.device&&t.device!==e.device||t.unlessSeen&&e.seenCount>0||t.maxShows!==void 0&&e.seenCount>=t.maxShows)}function At(t,e){return!t||t.length===0?!0:t.some(n=>Tt(n.when,e))}d.CARD_STYLES=G,d.PROGRESS_KEY=R,d.armTrigger=$t,d.autoSide=B,d.buildSelectors=j,d.clearProgress=M,d.createLocalState=Ct,d.createLogger=O,d.createPicker=gt,d.createPlayer=rt,d.deriveUrl=J,d.detectDevice=Nt,d.isLoggingEnabled=T,d.markSeen=_t,d.matchRules=At,d.matchUrl=A,d.placeCard=K,d.readProgress=Q,d.renderCard=q,d.resolveElement=N,d.resumeTour=kt,d.seenCount=nt,d.waitForElement=z,d.writeProgress=tt,Object.defineProperty(d,Symbol.toStringTag,{value:"Module"})}));
//# sourceMappingURL=index.umd.js.map
