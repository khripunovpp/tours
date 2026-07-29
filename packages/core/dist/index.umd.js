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
`,wt=`
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
`;function z(t){return JSON.stringify(t)}function yt(t){return/^[a-zA-Z][\w-]*$/.test(t)&&t.length<=30&&!/\d{2,}/.test(t)&&!/^(css-|sc-|jsx-|emotion-|_|is-|has-)/.test(t)}function K(t){const e=[];let n=t;for(;n&&n!==document.body&&n.nodeType===1;){const r=n.tagName.toLowerCase(),s=n.parentElement;if(!s){e.unshift(r);break}const i=Array.from(s.children).filter(a=>a.tagName===n.tagName);e.unshift(i.length>1?`${r}:nth-of-type(${i.indexOf(n)+1})`:r),n=s}return`body > ${e.join(" > ")}`}function vt(t){let e=t.parentElement;for(;e&&e!==document.body&&!e.id;)e=e.parentElement;if(!e||!e.id)return null;const n=[];let r=t;for(;r&&r!==e;){const s=r.tagName.toLowerCase(),i=r.parentElement;if(!i)return null;const a=Array.from(i.children).filter(l=>l.tagName===r.tagName);n.unshift(a.length>1?`${s}:nth-of-type(${a.indexOf(r)+1})`:s),r=i}return`#${CSS.escape(e.id)} > ${n.join(" > ")}`}const Et=["data-testid","data-test","data-test-id","data-cy","data-qa","data-id","data-name"];function J(t){const e=[],n=new Set,r=t.tagName.toLowerCase(),s=u=>{if(!(!u||n.has(u)))try{document.querySelector(u)===t&&(n.add(u),e.push(u))}catch{}};t.id&&s(`#${CSS.escape(t.id)}`);for(const u of Et){const d=t.getAttribute(u);d&&s(`${r}[${u}=${z(d)}]`)}const i=t.getAttribute("name");i&&s(`${r}[name=${z(i)}]`);const a=t.getAttribute("aria-label");a&&s(`[aria-label=${z(a)}]`);const l=Array.from(t.classList).filter(yt);l.length&&s(`${r}.${l.map(u=>CSS.escape(u)).join(".")}`);for(const u of l)s(`${r}.${CSS.escape(u)}`);s(vt(t)),s(K(t));const h=(t.textContent??"").replace(/\s+/g," ").trim();if(h&&h.length<=50&&/^(a|button|summary|label|h[1-6])$/.test(r)){const u=`text=${h}`;n.has(u)||(n.add(u),e.push(u))}return e.length===0&&e.push(K(t)),e}const Ct="a, button, summary, label, h1, h2, h3, h4, h5, h6";function Z(t,e){return!(t instanceof Element)||!t.isConnected||e!==document&&e instanceof Node&&!e.contains(t)?null:t}function _t(t,e){if(typeof t=="function"){let n;try{n=t()}catch{return null}return Z(n,e)}if(typeof t!="string")return Z(t,e);if(t.startsWith("text=")){const n=t.slice(5).trim();for(const r of Array.from(e.querySelectorAll(Ct)))if((r.textContent??"").replace(/\s+/g," ").trim()===n)return r;return null}try{return e.querySelector(t)}catch{return null}}function R(t,e=document){for(const n of t){const r=_t(n,e);if(r)return r}return null}function M(t,e={}){const n=e.root??document,r=R(t,n);return r?Promise.resolve(r):new Promise(s=>{let i=!1,a;const l=d=>{i||(i=!0,h.disconnect(),a&&clearTimeout(a),s(d))},h=new MutationObserver(()=>{const d=R(t,n);d&&l(d)});h.observe(document.documentElement,{childList:!0,subtree:!0,attributes:!0});const u=e.timeout??4e3;u>0&&Number.isFinite(u)&&(a=setTimeout(()=>l(null),u))})}let L=null;function P(){if(L!==null)return L;try{L=new URLSearchParams(window.location.search).has("use_logs")}catch{L=!1}return L}function D(t){const e=`[tours:${t}]`;return{log:(...n)=>{P()&&console.log(e,...n)},warn:(...n)=>{P()&&console.warn(e,...n)},error:(...n)=>{P()&&console.error(e,...n)}}}function kt(t,e={}){const n=D("picker");let r=null,s=null,i=null,a=!1;function l(x){if(x===r)return!0;for(const E of e.ignore??[])if(E&&E.contains(x))return!0;return!1}function h(){if(r)return;r=document.createElement("div"),r.setAttribute("data-tours-picker",""),s=r.attachShadow({mode:"open"});const x=document.createElement("style");x.textContent=$,s.appendChild(x),i=document.createElement("div"),i.className="tours-picker-overlay",i.style.display="none",s.appendChild(i);const E=document.createElement("div");E.className="tours-picker-hint",E.textContent="Hover and click an element • Esc to cancel",s.appendChild(E),document.body.appendChild(r)}function u(x,E){const C=document.elementFromPoint(x,E);return!C||l(C)?null:C}function d(x){if(!a||!i)return;const E=u(x.clientX,x.clientY);if(!E){i.style.display="none";return}const C=E.getBoundingClientRect();i.style.display="block",i.style.left=`${C.left}px`,i.style.top=`${C.top}px`,i.style.width=`${C.width}px`,i.style.height=`${C.height}px`}function c(x){if(!a)return;const E=u(x.clientX,x.clientY);if(x.preventDefault(),x.stopPropagation(),!E)return;const C=J(E);n.log("picked",C),b(),t(C)}function g(x){x.key==="Escape"&&(x.preventDefault(),b())}function v(){a||(a=!0,n.log("start"),h(),document.addEventListener("mousemove",d,!0),document.addEventListener("click",c,!0),document.addEventListener("keydown",g,!0))}function b(){a&&(a=!1,document.removeEventListener("mousemove",d,!0),document.removeEventListener("click",c,!0),document.removeEventListener("keydown",g,!0),r&&r.parentNode&&r.parentNode.removeChild(r),r=null,s=null,i=null)}return{start:v,stop:b}}const St=6,$t=6,Lt=10,Tt=12;function Q(t,e,n){const r={top:t.top,bottom:n.height-t.bottom,left:t.left,right:n.width-t.right},s={top:e.height,bottom:e.height,left:e.width,right:e.width},i=["bottom","top","right","left"],a=i.find(l=>r[l]>=s[l]+8);return a||i.reduce((l,h)=>r[h]>r[l]?h:l,i[0])}function tt(t){const{target:e,card:n,offset:r,viewport:s}=t,i=t.side==="auto",a=i?Q(e,n,s):t.side,l=i?"center":t.align,h=t.alignOffset??0,u=l==="start"?h:l==="end"?-h:0;let d=0,c=0;return a==="top"||a==="bottom"?(d=a==="top"?e.top-n.height-r:e.bottom+r,c=l==="start"?e.left:l==="end"?e.right-n.width:e.left+e.width/2-n.width/2,c+=u):(c=a==="left"?e.left-n.width-r:e.right+r,d=l==="start"?e.top:l==="end"?e.bottom-n.height:e.top+e.height/2-n.height/2,d+=u),c=Math.max(8,Math.min(c,s.width-n.width-8)),d=Math.max(8,Math.min(d,s.height-n.height-8)),{top:d,left:c}}function et(t){const e=document.createElement("button");return e.type="button",e.className=`tours-card__btn${t.primary?" tours-card__btn--primary":""}${t.disabled?" tours-card__btn--disabled":""}`,e.textContent=t.label,!t.disabled&&t.onClick&&e.addEventListener("click",t.onClick),e}function nt(t){const e=document.createElement("div");if(e.className=`tours-card${t.ghost?" tours-card--ghost":""}`,t.radius!=null&&(e.style.borderRadius=`${t.radius}px`),t.showClose){const r=document.createElement("button");r.className="tours-card__close",r.type="button",r.textContent="×",r.setAttribute("aria-label","Close"),t.onClose&&r.addEventListener("click",t.onClose),e.appendChild(r)}const n=document.createElement("div");if(n.className="tours-card__content",t.contentHtml!=null?n.innerHTML=t.contentHtml:n.textContent=t.contentText??"",e.appendChild(n),t.back||t.next||t.progress){const r=document.createElement("div");if(r.className="tours-card__footer",t.back&&r.appendChild(et(t.back)),t.progress){const s=document.createElement("span");s.className="tours-card__progress",s.textContent=t.progress,r.appendChild(s)}t.next&&r.appendChild(et(t.next)),e.appendChild(r)}return e}const rt=`
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
`;function Nt(t){const e=t.replace(/[.+^${}()|[\]\\]/g,"\\$&").replace(/\*\*/g,"\0").replace(/\*/g,"[^/]*").replace(/ /g,".*").replace(/\?/g,".");return new RegExp(`^${e}$`)}function T(t,e){if(!t)return!0;if(t.regex)try{return new RegExp(t.regex).test(e)}catch{return!1}if(t.glob)try{return Nt(t.glob).test(e)}catch{return!1}return!0}function ot(t){if(!t||!t.glob)return null;const e=t.glob.replace(/\*+/g,"");return/^https?:\/\//i.test(e)||e.startsWith("#")||e.startsWith("/")?e:null}const F="tours:locationchange";let it=!1;function At(){if(!it){it=!0;for(const t of["pushState","replaceState"]){const e=history[t];history[t]=function(...r){const s=e.apply(this,r);return window.dispatchEvent(new Event(F)),s}}}}function Y(t){return At(),window.addEventListener("popstate",t),window.addEventListener("hashchange",t),window.addEventListener(F,t),()=>{window.removeEventListener("popstate",t),window.removeEventListener("hashchange",t),window.removeEventListener(F,t)}}const U="tours:progress";function Rt(){return{get(t){try{return localStorage.getItem(t)}catch{return null}},set(t,e){try{localStorage.setItem(t,e)}catch{}},remove(t){try{localStorage.removeItem(t)}catch{}}}}function st(t){const e=t.get(U);if(!e)return null;try{const n=JSON.parse(e);if(typeof n?.tourId=="string"&&typeof n?.index=="number")return n}catch{}return null}function at(t,e){t.set(U,JSON.stringify(e))}function H(t){t.remove(U)}const ct="tours:seen:";function B(t,e){const n=t.get(ct+e),r=n?parseInt(n,10):0;return Number.isNaN(r)?0:r}function lt(t,e){t.set(ct+e,String(B(t,e)+1))}const Pt="[data-tours-editor]";function W(){return typeof document<"u"&&document.querySelector(Pt)!==null}function j(t,e={}){const n=D("player"),r=e.state;let s=null,i=null,a=null,l=null,h=null,u=null,d=!1,c=0,g=0,v=null;const b=t.display?.padding??St,x=t.display?.radius??$t,E=t.display?.cardRadius??Lt,C=t.display?.offset??Tt;function V(o){return R(o.selectors)}function X(o){return o.action?.type==="click"}function N(o){return T(o.pageUrl,window.location.href)}function S(){r&&at(r,{tourId:t.id,index:c})}function ht(){if(s)return;s=document.createElement("div"),s.setAttribute("data-tours-player",""),i=s.attachShadow({mode:"open"});const o=document.createElement("style");o.textContent=wt+rt,i.appendChild(o),h=document.createElement("div"),h.className="tours-backdrop",h.addEventListener("click",f=>{const m=t.steps[c],w=m?V(m):null;if(w){const y=w.getBoundingClientRect();if(f.clientX>=y.left-b&&f.clientX<=y.right+b&&f.clientY>=y.top-b&&f.clientY<=y.bottom+b)return}k()}),i.appendChild(h),a=document.createElement("div"),a.className="tours-spotlight",a.style.borderRadius=`${x}px`,i.appendChild(a),document.body.appendChild(s)}function zt(o){if(!h)return;if(!o){h.style.clipPath="";return}const f=o.left-b,m=o.top-b,w=o.right+b,y=o.bottom+b;h.style.clipPath=`polygon(0 0, 0 100%, ${f}px 100%, ${f}px ${m}px, ${w}px ${m}px, ${w}px ${y}px, ${f}px ${y}px, ${f}px 100%, 100% 100%, 100% 0)`}function gt(o,f=!1){a&&(a.style.transitionDuration=f?"0ms":"",a.style.display="block",a.style.left=`${o.left-b}px`,a.style.top=`${o.top-b}px`,a.style.width=`${o.width+b*2}px`,a.style.height=`${o.height+b*2}px`)}function mt(o,f){if(!l)return;const m={top:o.top-b,left:o.left-b,right:o.right+b,bottom:o.bottom+b,width:o.width+b*2,height:o.height+b*2},{top:w,left:y}=tt({target:m,card:{width:l.offsetWidth,height:l.offsetHeight},side:f.placement??"bottom",align:f.align??"center",offset:C,alignOffset:t.display?.alignOffset??0,viewport:{width:window.innerWidth,height:window.innerHeight}});l.style.left=`${y}px`,l.style.top=`${w}px`}function Mt(o){const f=Math.max(1,t.steps.length-g),m=Math.max(1,Math.min(c+1-g,f));l&&l.remove();const w=c===t.steps.length-1,y=t.steps[c-1],A=!!y&&N(y),Bt=!X(o)||w;l=nt({contentText:o.content.default,progress:`Step ${m} of ${f}`,showClose:!0,onClose:k,radius:E,back:A?{label:o.backLabel??"Back",onClick:G}:void 0,next:Bt?{label:o.nextLabel??(w?"Done":"Next"),primary:!0,onClick:q}:void 0}),i?.appendChild(l)}function _(){if(!d)return;const o=t.steps[c];if(!o){k();return}n.log("render step",c,o.id);const f=V(o);if(!f){n.log(`step "${o.id}" target not found yet — waiting`,o.selectors),M(o.selectors,{timeout:4e3}).then(w=>{!d||t.steps[c]!==o||(w?_():(n.warn(`step "${o.id}" skipped: no element for selectors`,o.selectors),g+=1,c<t.steps.length-1?(c+=1,_()):k()))});return}ht(),f.scrollIntoView({behavior:"smooth",block:"center",inline:"center"}),Mt(o);const m=f.getBoundingClientRect();gt(m),mt(m,o),zt(X(o)?m:null),Ft(o)}function Ft(o){if(u?.(),u=null,!X(o))return;const f=c+1,m=t.steps[f];!m||N(m)||(u=Y(()=>{!d||t.steps[c]!==o||T(m.pageUrl,window.location.href)&&(u?.(),u=null,n.log("visitor navigated → advancing to",m.id),c=f,S(),_())}))}function bt(o){d&&(o.key==="Escape"?(o.preventDefault(),k()):o.key==="ArrowRight"?q():o.key==="ArrowLeft"&&G())}function I(){if(!d)return;const o=t.steps[c];if(!o)return;const f=V(o);if(!f)return;const m=f.getBoundingClientRect();gt(m,!0),mt(m,o)}function Yt(o=0){if(!d&&t.steps.length!==0){if(!e.allowWhileEditing&&W()){n.log(`start suppressed for "${t.id}" — the builder is mounted`);return}d=!0,c=Math.max(0,Math.min(o,t.steps.length-1)),g=0,n.log("start",t.id,`at ${c}/${t.steps.length}`),ht(),window.addEventListener("keydown",bt,!0),window.addEventListener("resize",I,!0),window.addEventListener("scroll",I,!0),S(),_()}}function Ht(){a&&(a.style.display="none"),l&&(l.remove(),l=null)}function O(){Ht(),!v&&(v=Y(()=>{if(!d){v?.(),v=null;return}const o=t.steps[c];o&&N(o)&&(v?.(),v=null,_())}))}function xt(){v&&(v(),v=null),u&&(u(),u=null),d&&(d=!1,window.removeEventListener("keydown",bt,!0),window.removeEventListener("resize",I,!0),window.removeEventListener("scroll",I,!0),s&&s.parentNode&&s.parentNode.removeChild(s),s=null,i=null,a=null,l=null,h=null)}function k(){n.log("stop"),xt(),r&&H(r)}function q(){if(!d)return;const o=c+1,f=t.steps[o];if(!f){k();return}if(N(f)){c=o,S(),_();return}c=o,S();const m=A=>{xt(),e.onNavigate?e.onNavigate(A,f.id):window.location.assign(A)},w=t.steps[c-1]?.action;if(w&&w.type==="navigate"&&w.url){w.url.startsWith("#")?(n.log("page transition (hash navigate) → resume at",c),O(),window.location.hash=w.url):(n.log("page transition (navigate) → resume at",c),m(w.url));return}const y=ot(f.pageUrl);if(y){y.startsWith("#")?(n.log("page transition (derived hash) → resume at",c),O(),window.location.hash=y):(n.log("page transition (derived navigate) → resume at",c,y),m(y));return}n.log("page transition (wait) → resume at",c),O()}function G(){if(!d)return;const o=t.steps[c-1];if(o){if(N(o)){c-=1,S(),_();return}c-=1,S(),n.log("page transition back → resume at",c),O(),window.history.back()}}return{start:Yt,stop:k,next:q,prev:G,isActive:()=>d}}function ut(t,e={}){const n=e.state;if(!n)return null;const r=st(n);if(!r||r.tourId!==t.id)return null;if(!t.steps[r.index])return H(n),null;let s=-1;for(let a=r.index;a<t.steps.length;a++)if(T(t.steps[a].pageUrl,window.location.href)){s=a;break}if(s===-1)return null;const i=j(t,e);return i.start(s),i}const Dt=`
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
`;function Ut(t){const e=t.corner??"bottom-right",n=t.offset??24,r=document.createElement("div");r.setAttribute("data-tours-cta","");const s=r.attachShadow({mode:"open"}),i=document.createElement("style");i.textContent=Dt,s.appendChild(i);const a=document.createElement("div");a.className="cta";const[l,h]=e.split("-");a.style[l]=`${n}px`,a.style[h]=`${n}px`;const u=()=>{r.parentNode&&r.parentNode.removeChild(r)},d=document.createElement("button");d.className="cta__close",d.type="button",d.textContent="×",d.setAttribute("aria-label","Dismiss"),d.addEventListener("click",u);const c=document.createElement("p");c.className="cta__text",c.textContent=t.text;const g=document.createElement("button");return g.className="cta__btn",g.type="button",g.textContent=t.button,g.addEventListener("click",()=>{u(),t.onStart()}),a.append(d,c,g),s.appendChild(a),document.body.appendChild(r),u}function dt(t,e){if(W())return()=>{};const n=t.trigger??{type:"manual"};let r=!1;const s=()=>{r||(r=!0,e())};switch(n.type){case"load":{const i=setTimeout(s,0);return()=>clearTimeout(i)}case"timer":{const i=setTimeout(s,Math.max(0,n.delay));return()=>clearTimeout(i)}case"selector":{let i=!1;return M([n.selector],{timeout:0}).then(a=>{a&&!i&&s()}),()=>{i=!0}}case"cta":{let i=()=>{};return i=Ut({text:n.text,button:n.button,corner:n.corner,offset:n.offset,onStart:s}),i}case"manual":default:return()=>{}}}function ft(t=window.innerWidth){return t<=640?"mobile":t<=1024?"tablet":"desktop"}function It(t,e){return!(t.url&&!T(t.url,e.url)||t.role!==void 0&&t.role!==e.role||t.firstVisitOnly&&!e.firstVisit||t.device&&t.device!==e.device||t.unlessSeen&&e.seenCount>0||t.maxShows!==void 0&&e.seenCount>=t.maxShows)}function pt(t,e){return!t||t.length===0?!0:t.some(n=>It(n.when,e))}function Ot(t,e={}){const n=D("mount"),r=e.state,s=()=>typeof t=="function"?t():t;let i=null,a=[];function l(){for(const c of a)c();a=[]}function h(c){return!e.canRun||e.canRun(c)}function u(){if(i?.isActive())return;if(i=null,l(),r)for(const g of s()){if(!h(g))continue;const v=ut(g,e);if(v){n.log("resumed",g.id),i=v;return}}const c=ft();for(const g of s()){if(!h(g)||!g.trigger||g.trigger.type==="manual")continue;const v=r?B(r,g.id):0;pt(g.rules,{url:window.location.href,device:c,firstVisit:v===0,seenCount:v})&&a.push(dt(g,()=>{r&&lt(r,g.id);const x=j(g,e);i=x,x.start()}))}}u();const d=Y(u);return()=>{d(),l(),i?.stop(),i=null}}p.CARD_STYLES=rt,p.PROGRESS_KEY=U,p.armTrigger=dt,p.autoSide=Q,p.buildSelectors=J,p.clearProgress=H,p.createLocalState=Rt,p.createLogger=D,p.createPicker=kt,p.createPlayer=j,p.deriveUrl=ot,p.detectDevice=ft,p.isBuilderMounted=W,p.isLoggingEnabled=P,p.markSeen=lt,p.matchRules=pt,p.matchUrl=T,p.mountTours=Ot,p.placeCard=tt,p.readProgress=st,p.renderCard=nt,p.resolveElement=R,p.resumeTour=ut,p.seenCount=B,p.waitForElement=M,p.writeProgress=at,Object.defineProperty(p,Symbol.toStringTag,{value:"Module"})}));
//# sourceMappingURL=index.umd.js.map
