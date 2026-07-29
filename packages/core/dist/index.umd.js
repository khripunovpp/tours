(function(p,$){typeof exports=="object"&&typeof module<"u"?$(exports):typeof define=="function"&&define.amd?define(["exports"],$):(p=typeof globalThis<"u"?globalThis:p||self,$(p.ToursCore={}))})(this,(function(p){"use strict";const $=`
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
`,ht=`
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
`;function I(t){return JSON.stringify(t)}function gt(t){return/^[a-zA-Z][\w-]*$/.test(t)&&t.length<=30&&!/\d{2,}/.test(t)&&!/^(css-|sc-|jsx-|emotion-|_|is-|has-)/.test(t)}function X(t){const e=[];let n=t;for(;n&&n!==document.body&&n.nodeType===1;){const r=n.tagName.toLowerCase(),i=n.parentElement;if(!i){e.unshift(r);break}const s=Array.from(i.children).filter(a=>a.tagName===n.tagName);e.unshift(s.length>1?`${r}:nth-of-type(${s.indexOf(n)+1})`:r),n=i}return`body > ${e.join(" > ")}`}function mt(t){let e=t.parentElement;for(;e&&e!==document.body&&!e.id;)e=e.parentElement;if(!e||!e.id)return null;const n=[];let r=t;for(;r&&r!==e;){const i=r.tagName.toLowerCase(),s=r.parentElement;if(!s)return null;const a=Array.from(s.children).filter(c=>c.tagName===r.tagName);n.unshift(a.length>1?`${i}:nth-of-type(${a.indexOf(r)+1})`:i),r=s}return`#${CSS.escape(e.id)} > ${n.join(" > ")}`}const bt=["data-testid","data-test","data-test-id","data-cy","data-qa","data-id","data-name"];function V(t){const e=[],n=new Set,r=t.tagName.toLowerCase(),i=d=>{if(!(!d||n.has(d)))try{document.querySelector(d)===t&&(n.add(d),e.push(d))}catch{}};t.id&&i(`#${CSS.escape(t.id)}`);for(const d of bt){const u=t.getAttribute(d);u&&i(`${r}[${d}=${I(u)}]`)}const s=t.getAttribute("name");s&&i(`${r}[name=${I(s)}]`);const a=t.getAttribute("aria-label");a&&i(`[aria-label=${I(a)}]`);const c=Array.from(t.classList).filter(gt);c.length&&i(`${r}.${c.map(d=>CSS.escape(d)).join(".")}`);for(const d of c)i(`${r}.${CSS.escape(d)}`);i(mt(t)),i(X(t));const h=(t.textContent??"").replace(/\s+/g," ").trim();if(h&&h.length<=50&&/^(a|button|summary|label|h[1-6])$/.test(r)){const d=`text=${h}`;n.has(d)||(n.add(d),e.push(d))}return e.length===0&&e.push(X(t)),e}const xt="a, button, summary, label, h1, h2, h3, h4, h5, h6";function q(t,e){return!(t instanceof Element)||!t.isConnected||e!==document&&e instanceof Node&&!e.contains(t)?null:t}function wt(t,e){if(typeof t=="function"){let n;try{n=t()}catch{return null}return q(n,e)}if(typeof t!="string")return q(t,e);if(t.startsWith("text=")){const n=t.slice(5).trim();for(const r of Array.from(e.querySelectorAll(xt)))if((r.textContent??"").replace(/\s+/g," ").trim()===n)return r;return null}try{return e.querySelector(t)}catch{return null}}function T(t,e=document){for(const n of t){const r=wt(n,e);if(r)return r}return null}function O(t,e={}){const n=e.root??document,r=T(t,n);return r?Promise.resolve(r):new Promise(i=>{let s=!1,a;const c=u=>{s||(s=!0,h.disconnect(),a&&clearTimeout(a),i(u))},h=new MutationObserver(()=>{const u=T(t,n);u&&c(u)});h.observe(document.documentElement,{childList:!0,subtree:!0,attributes:!0});const d=e.timeout??4e3;d>0&&Number.isFinite(d)&&(a=setTimeout(()=>c(null),d))})}let L=null;function A(){if(L!==null)return L;try{L=new URLSearchParams(window.location.search).has("use_logs")}catch{L=!1}return L}function z(t){const e=`[tours:${t}]`;return{log:(...n)=>{A()&&console.log(e,...n)},warn:(...n)=>{A()&&console.warn(e,...n)},error:(...n)=>{A()&&console.error(e,...n)}}}function yt(t,e={}){const n=z("picker");let r=null,i=null,s=null,a=!1;function c(b){if(b===r)return!0;for(const x of e.ignore??[])if(x&&x.contains(b))return!0;return!1}function h(){if(r)return;r=document.createElement("div"),r.setAttribute("data-tours-picker",""),i=r.attachShadow({mode:"open"});const b=document.createElement("style");b.textContent=$,i.appendChild(b),s=document.createElement("div"),s.className="tours-picker-overlay",s.style.display="none",i.appendChild(s);const x=document.createElement("div");x.className="tours-picker-hint",x.textContent="Hover and click an element • Esc to cancel",i.appendChild(x),document.body.appendChild(r)}function d(b,x){const E=document.elementFromPoint(b,x);return!E||c(E)?null:E}function u(b){if(!a||!s)return;const x=d(b.clientX,b.clientY);if(!x){s.style.display="none";return}const E=x.getBoundingClientRect();s.style.display="block",s.style.left=`${E.left}px`,s.style.top=`${E.top}px`,s.style.width=`${E.width}px`,s.style.height=`${E.height}px`}function l(b){if(!a)return;const x=d(b.clientX,b.clientY);if(b.preventDefault(),b.stopPropagation(),!x)return;const E=V(x);n.log("picked",E),m(),t(E)}function v(b){b.key==="Escape"&&(b.preventDefault(),m())}function C(){a||(a=!0,n.log("start"),h(),document.addEventListener("mousemove",u,!0),document.addEventListener("click",l,!0),document.addEventListener("keydown",v,!0))}function m(){a&&(a=!1,document.removeEventListener("mousemove",u,!0),document.removeEventListener("click",l,!0),document.removeEventListener("keydown",v,!0),r&&r.parentNode&&r.parentNode.removeChild(r),r=null,i=null,s=null)}return{start:C,stop:m}}const vt=6,Et=6,Ct=10,_t=12;function K(t,e,n){const r={top:t.top,bottom:n.height-t.bottom,left:t.left,right:n.width-t.right},i={top:e.height,bottom:e.height,left:e.width,right:e.width},s=["bottom","top","right","left"],a=s.find(c=>r[c]>=i[c]+8);return a||s.reduce((c,h)=>r[h]>r[c]?h:c,s[0])}function G(t){const{target:e,card:n,offset:r,viewport:i}=t,s=t.side==="auto",a=s?K(e,n,i):t.side,c=s?"center":t.align,h=t.alignOffset??0,d=c==="start"?h:c==="end"?-h:0;let u=0,l=0;return a==="top"||a==="bottom"?(u=a==="top"?e.top-n.height-r:e.bottom+r,l=c==="start"?e.left:c==="end"?e.right-n.width:e.left+e.width/2-n.width/2,l+=d):(l=a==="left"?e.left-n.width-r:e.right+r,u=c==="start"?e.top:c==="end"?e.bottom-n.height:e.top+e.height/2-n.height/2,u+=d),l=Math.max(8,Math.min(l,i.width-n.width-8)),u=Math.max(8,Math.min(u,i.height-n.height-8)),{top:u,left:l}}function J(t){const e=document.createElement("button");return e.type="button",e.className=`tours-card__btn${t.primary?" tours-card__btn--primary":""}${t.disabled?" tours-card__btn--disabled":""}`,e.textContent=t.label,!t.disabled&&t.onClick&&e.addEventListener("click",t.onClick),e}function Z(t){const e=document.createElement("div");if(e.className=`tours-card${t.ghost?" tours-card--ghost":""}`,t.radius!=null&&(e.style.borderRadius=`${t.radius}px`),t.showClose){const r=document.createElement("button");r.className="tours-card__close",r.type="button",r.textContent="×",r.setAttribute("aria-label","Close"),t.onClose&&r.addEventListener("click",t.onClose),e.appendChild(r)}const n=document.createElement("div");if(n.className="tours-card__content",t.contentHtml!=null?n.innerHTML=t.contentHtml:n.textContent=t.contentText??"",e.appendChild(n),t.back||t.next||t.progress){const r=document.createElement("div");if(r.className="tours-card__footer",t.back&&r.appendChild(J(t.back)),t.progress){const i=document.createElement("span");i.className="tours-card__progress",i.textContent=t.progress,r.appendChild(i)}t.next&&r.appendChild(J(t.next)),e.appendChild(r)}return e}const Q=`
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
`;function kt(t){const e=t.replace(/[.+^${}()|[\]\\]/g,"\\$&").replace(/\*\*/g,"\0").replace(/\*/g,"[^/]*").replace(/ /g,".*").replace(/\?/g,".");return new RegExp(`^${e}$`)}function N(t,e){if(!t)return!0;if(t.regex)try{return new RegExp(t.regex).test(e)}catch{return!1}if(t.glob)try{return kt(t.glob).test(e)}catch{return!1}return!0}function tt(t){if(!t||!t.glob)return null;const e=t.glob.replace(/\*+/g,"");return/^https?:\/\//i.test(e)||e.startsWith("#")||e.startsWith("/")?e:null}const M="tours:locationchange";let et=!1;function St(){if(!et){et=!0;for(const t of["pushState","replaceState"]){const e=history[t];history[t]=function(...r){const i=e.apply(this,r);return window.dispatchEvent(new Event(M)),i}}}}function nt(t){return St(),window.addEventListener("popstate",t),window.addEventListener("hashchange",t),window.addEventListener(M,t),()=>{window.removeEventListener("popstate",t),window.removeEventListener("hashchange",t),window.removeEventListener(M,t)}}const R="tours:progress";function $t(){return{get(t){try{return localStorage.getItem(t)}catch{return null}},set(t,e){try{localStorage.setItem(t,e)}catch{}},remove(t){try{localStorage.removeItem(t)}catch{}}}}function rt(t){const e=t.get(R);if(!e)return null;try{const n=JSON.parse(e);if(typeof n?.tourId=="string"&&typeof n?.index=="number")return n}catch{}return null}function ot(t,e){t.set(R,JSON.stringify(e))}function F(t){t.remove(R)}const it="tours:seen:";function st(t,e){const n=t.get(it+e),r=n?parseInt(n,10):0;return Number.isNaN(r)?0:r}function Lt(t,e){t.set(it+e,String(st(t,e)+1))}const Nt="[data-tours-editor]";function Y(){return typeof document<"u"&&document.querySelector(Nt)!==null}function at(t,e={}){const n=z("player"),r=e.state;let i=null,s=null,a=null,c=null,h=null,d=null,u=!1,l=0,v=0,C=null;const m=t.display?.padding??vt,b=t.display?.radius??Et,x=t.display?.cardRadius??Ct,E=t.display?.offset??_t;function H(o){return T(o.selectors)}function lt(o){return o.action?.type==="click"}function P(o){return N(o.pageUrl,window.location.href)}function S(){r&&ot(r,{tourId:t.id,index:l})}function ct(){if(i)return;i=document.createElement("div"),i.setAttribute("data-tours-player",""),s=i.attachShadow({mode:"open"});const o=document.createElement("style");o.textContent=ht+Q,s.appendChild(o),h=document.createElement("div"),h.className="tours-backdrop",h.addEventListener("click",f=>{const g=t.steps[l],w=g?H(g):null;if(w){const y=w.getBoundingClientRect();if(f.clientX>=y.left-m&&f.clientX<=y.right+m&&f.clientY>=y.top-m&&f.clientY<=y.bottom+m)return}k()}),s.appendChild(h),a=document.createElement("div"),a.className="tours-spotlight",a.style.borderRadius=`${b}px`,s.appendChild(a),document.body.appendChild(i)}function Ot(o){if(!h)return;if(!o){h.style.clipPath="";return}const f=o.left-m,g=o.top-m,w=o.right+m,y=o.bottom+m;h.style.clipPath=`polygon(0 0, 0 100%, ${f}px 100%, ${f}px ${g}px, ${w}px ${g}px, ${w}px ${y}px, ${f}px ${y}px, ${f}px 100%, 100% 100%, 100% 0)`}function dt(o,f=!1){a&&(a.style.transitionDuration=f?"0ms":"",a.style.display="block",a.style.left=`${o.left-m}px`,a.style.top=`${o.top-m}px`,a.style.width=`${o.width+m*2}px`,a.style.height=`${o.height+m*2}px`)}function ut(o,f){if(!c)return;const g={top:o.top-m,left:o.left-m,right:o.right+m,bottom:o.bottom+m,width:o.width+m*2,height:o.height+m*2},{top:w,left:y}=G({target:g,card:{width:c.offsetWidth,height:c.offsetHeight},side:f.placement??"bottom",align:f.align??"center",offset:E,alignOffset:t.display?.alignOffset??0,viewport:{width:window.innerWidth,height:window.innerHeight}});c.style.left=`${y}px`,c.style.top=`${w}px`}function zt(o){const f=Math.max(1,t.steps.length-v),g=Math.max(1,Math.min(l+1-v,f));c&&c.remove(),c=Z({contentText:o.content.default,progress:`Step ${g} of ${f}`,showClose:!0,onClose:k,radius:x,back:{label:o.backLabel??"Back",disabled:l===0,onClick:B},next:{label:o.nextLabel??(l===f-1?"Done":"Next"),primary:!0,onClick:W}}),s?.appendChild(c)}function _(){if(!u)return;const o=t.steps[l];if(!o){k();return}n.log("render step",l,o.id);const f=H(o);if(!f){n.log(`step "${o.id}" target not found yet — waiting`,o.selectors),O(o.selectors,{timeout:4e3}).then(w=>{!u||t.steps[l]!==o||(w?_():(n.warn(`step "${o.id}" skipped: no element for selectors`,o.selectors),v+=1,l<t.steps.length-1?(l+=1,_()):k()))});return}ct(),f.scrollIntoView({behavior:"smooth",block:"center",inline:"center"}),zt(o);const g=f.getBoundingClientRect();dt(g),ut(g,o),Ot(lt(o)?g:null),Mt(o)}function Mt(o){if(d?.(),d=null,!lt(o))return;const f=l+1,g=t.steps[f];!g||P(g)||(d=nt(()=>{!u||t.steps[l]!==o||N(g.pageUrl,window.location.href)&&(d?.(),d=null,n.log("visitor navigated → advancing to",g.id),l=f,S(),_())}))}function ft(o){u&&(o.key==="Escape"?(o.preventDefault(),k()):o.key==="ArrowRight"?W():o.key==="ArrowLeft"&&B())}function D(){if(!u)return;const o=t.steps[l];if(!o)return;const f=H(o);if(!f)return;const g=f.getBoundingClientRect();dt(g,!0),ut(g,o)}function Ft(o=0){if(!u&&t.steps.length!==0){if(!e.allowWhileEditing&&Y()){n.log(`start suppressed for "${t.id}" — the builder is mounted`);return}u=!0,l=Math.max(0,Math.min(o,t.steps.length-1)),v=0,n.log("start",t.id,`at ${l}/${t.steps.length}`),ct(),window.addEventListener("keydown",ft,!0),window.addEventListener("resize",D,!0),window.addEventListener("scroll",D,!0),S(),_()}}function Yt(){a&&(a.style.display="none"),c&&(c.remove(),c=null)}function U(){Yt(),!C&&(C=nt(()=>{if(!u){C?.(),C=null;return}const o=t.steps[l];o&&P(o)&&(C?.(),C=null,_())}))}function pt(){C&&(C(),C=null),d&&(d(),d=null),u&&(u=!1,window.removeEventListener("keydown",ft,!0),window.removeEventListener("resize",D,!0),window.removeEventListener("scroll",D,!0),i&&i.parentNode&&i.parentNode.removeChild(i),i=null,s=null,a=null,c=null,h=null)}function k(){n.log("stop"),pt(),r&&F(r)}function W(){if(!u)return;const o=l+1,f=t.steps[o];if(!f){k();return}if(P(f)){l=o,S(),_();return}l=o,S();const g=j=>{pt(),e.onNavigate?e.onNavigate(j,f.id):window.location.assign(j)},w=t.steps[l-1]?.action;if(w&&w.type==="navigate"&&w.url){w.url.startsWith("#")?(n.log("page transition (hash navigate) → resume at",l),U(),window.location.hash=w.url):(n.log("page transition (navigate) → resume at",l),g(w.url));return}const y=tt(f.pageUrl);if(y){y.startsWith("#")?(n.log("page transition (derived hash) → resume at",l),U(),window.location.hash=y):(n.log("page transition (derived navigate) → resume at",l,y),g(y));return}n.log("page transition (wait) → resume at",l),U()}function B(){if(!u)return;const o=t.steps[l-1];if(o){if(P(o)){l-=1,S(),_();return}l-=1,S(),n.log("page transition back → resume at",l),U(),window.history.back()}}return{start:Ft,stop:k,next:W,prev:B}}function Tt(t,e={}){const n=e.state;if(!n)return null;const r=rt(n);if(!r||r.tourId!==t.id)return null;if(!t.steps[r.index])return F(n),null;let i=-1;for(let a=r.index;a<t.steps.length;a++)if(N(t.steps[a].pageUrl,window.location.href)){i=a;break}if(i===-1)return null;const s=at(t,e);return s.start(i),s}const At=`
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
`;function Rt(t){const e=t.corner??"bottom-right",n=t.offset??24,r=document.createElement("div");r.setAttribute("data-tours-cta","");const i=r.attachShadow({mode:"open"}),s=document.createElement("style");s.textContent=At,i.appendChild(s);const a=document.createElement("div");a.className="cta";const[c,h]=e.split("-");a.style[c]=`${n}px`,a.style[h]=`${n}px`;const d=()=>{r.parentNode&&r.parentNode.removeChild(r)},u=document.createElement("button");u.className="cta__close",u.type="button",u.textContent="×",u.setAttribute("aria-label","Dismiss"),u.addEventListener("click",d);const l=document.createElement("p");l.className="cta__text",l.textContent=t.text;const v=document.createElement("button");return v.className="cta__btn",v.type="button",v.textContent=t.button,v.addEventListener("click",()=>{d(),t.onStart()}),a.append(u,l,v),i.appendChild(a),document.body.appendChild(r),d}function Pt(t,e){if(Y())return()=>{};const n=t.trigger??{type:"manual"};let r=!1;const i=()=>{r||(r=!0,e())};switch(n.type){case"load":{const s=setTimeout(i,0);return()=>clearTimeout(s)}case"timer":{const s=setTimeout(i,Math.max(0,n.delay));return()=>clearTimeout(s)}case"selector":{let s=!1;return O([n.selector],{timeout:0}).then(a=>{a&&!s&&i()}),()=>{s=!0}}case"cta":{let s=()=>{};return s=Rt({text:n.text,button:n.button,corner:n.corner,offset:n.offset,onStart:i}),s}case"manual":default:return()=>{}}}function Dt(t=window.innerWidth){return t<=640?"mobile":t<=1024?"tablet":"desktop"}function Ut(t,e){return!(t.url&&!N(t.url,e.url)||t.role!==void 0&&t.role!==e.role||t.firstVisitOnly&&!e.firstVisit||t.device&&t.device!==e.device||t.unlessSeen&&e.seenCount>0||t.maxShows!==void 0&&e.seenCount>=t.maxShows)}function It(t,e){return!t||t.length===0?!0:t.some(n=>Ut(n.when,e))}p.CARD_STYLES=Q,p.PROGRESS_KEY=R,p.armTrigger=Pt,p.autoSide=K,p.buildSelectors=V,p.clearProgress=F,p.createLocalState=$t,p.createLogger=z,p.createPicker=yt,p.createPlayer=at,p.deriveUrl=tt,p.detectDevice=Dt,p.isBuilderMounted=Y,p.isLoggingEnabled=A,p.markSeen=Lt,p.matchRules=It,p.matchUrl=N,p.placeCard=G,p.readProgress=rt,p.renderCard=Z,p.resolveElement=T,p.resumeTour=Tt,p.seenCount=st,p.waitForElement=O,p.writeProgress=ot,Object.defineProperty(p,Symbol.toStringTag,{value:"Module"})}));
//# sourceMappingURL=index.umd.js.map
