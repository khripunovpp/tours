(function(m,$){typeof exports=="object"&&typeof module<"u"?$(exports):typeof define=="function"&&define.amd?define(["exports"],$):(m=typeof globalThis<"u"?globalThis:m||self,$(m.ToursCore={}))})(this,(function(m){"use strict";const $=`
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
`,_t=`
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
`;function F(t){return JSON.stringify(t)}function kt(t){return/^[a-zA-Z][\w-]*$/.test(t)&&t.length<=30&&!/\d{2,}/.test(t)&&!/^(css-|sc-|jsx-|emotion-|_|is-|has-)/.test(t)}function tt(t){const e=[];let r=t;for(;r&&r!==document.body&&r.nodeType===1;){const n=r.tagName.toLowerCase(),s=r.parentElement;if(!s){e.unshift(n);break}const i=Array.from(s.children).filter(a=>a.tagName===r.tagName);e.unshift(i.length>1?`${n}:nth-of-type(${i.indexOf(r)+1})`:n),r=s}return`body > ${e.join(" > ")}`}function St(t){let e=t.parentElement;for(;e&&e!==document.body&&!e.id;)e=e.parentElement;if(!e||!e.id)return null;const r=[];let n=t;for(;n&&n!==e;){const s=n.tagName.toLowerCase(),i=n.parentElement;if(!i)return null;const a=Array.from(i.children).filter(u=>u.tagName===n.tagName);r.unshift(a.length>1?`${s}:nth-of-type(${a.indexOf(n)+1})`:s),n=i}return`#${CSS.escape(e.id)} > ${r.join(" > ")}`}const $t=["data-testid","data-test","data-test-id","data-cy","data-qa","data-id","data-name"];function et(t){const e=[],r=new Set,n=t.tagName.toLowerCase(),s=d=>{if(!(!d||r.has(d)))try{document.querySelector(d)===t&&(r.add(d),e.push(d))}catch{}};t.id&&s(`#${CSS.escape(t.id)}`);for(const d of $t){const f=t.getAttribute(d);f&&s(`${n}[${d}=${F(f)}]`)}const i=t.getAttribute("name");i&&s(`${n}[name=${F(i)}]`);const a=t.getAttribute("aria-label");a&&s(`[aria-label=${F(a)}]`);const u=Array.from(t.classList).filter(kt);u.length&&s(`${n}.${u.map(d=>CSS.escape(d)).join(".")}`);for(const d of u)s(`${n}.${CSS.escape(d)}`);s(St(t)),s(tt(t));const b=(t.textContent??"").replace(/\s+/g," ").trim();if(b&&b.length<=50&&/^(a|button|summary|label|h[1-6])$/.test(n)){const d=`text=${b}`;r.has(d)||(r.add(d),e.push(d))}return e.length===0&&e.push(tt(t)),e}const Lt="a, button, summary, label, h1, h2, h3, h4, h5, h6";function nt(t,e){return!(t instanceof Element)||!t.isConnected||e!==document&&e instanceof Node&&!e.contains(t)?null:t}function Tt(t,e){if(typeof t=="function"){let r;try{r=t()}catch{return null}return nt(r,e)}if(typeof t!="string")return nt(t,e);if(t.startsWith("text=")){const r=t.slice(5).trim();for(const n of Array.from(e.querySelectorAll(Lt)))if((n.textContent??"").replace(/\s+/g," ").trim()===r)return n;return null}try{return e.querySelector(t)}catch{return null}}function I(t,e=document){for(const r of t){const n=Tt(r,e);if(n)return n}return null}function Y(t,e={}){const r=e.root??document,n=I(t,r);return n?Promise.resolve(n):new Promise(s=>{let i=!1,a;const u=f=>{i||(i=!0,b.disconnect(),a&&clearTimeout(a),s(f))},b=new MutationObserver(()=>{const f=I(t,r);f&&u(f)});b.observe(document.documentElement,{childList:!0,subtree:!0,attributes:!0});const d=e.timeout??4e3;d>0&&Number.isFinite(d)&&(a=setTimeout(()=>u(null),d))})}let L=null;function P(){if(L!==null)return L;try{L=new URLSearchParams(window.location.search).has("use_logs")}catch{L=!1}return L}function z(t){const e=`[tours:${t}]`;return{log:(...r)=>{P()&&console.log(e,...r)},warn:(...r)=>{P()&&console.warn(e,...r)},error:(...r)=>{P()&&console.error(e,...r)}}}function Nt(t,e={}){const r=z("picker");let n=null,s=null,i=null,a=!1;function u(l){if(l===n)return!0;for(const w of e.ignore??[])if(w&&w.contains(l))return!0;return!1}function b(){if(n)return;n=document.createElement("div"),n.setAttribute("data-tours-picker",""),s=n.attachShadow({mode:"open"});const l=document.createElement("style");l.textContent=$,s.appendChild(l),i=document.createElement("div"),i.className="tours-picker-overlay",i.style.display="none",s.appendChild(i);const w=document.createElement("div");w.className="tours-picker-hint",w.textContent="Hover and click an element • Esc to cancel",s.appendChild(w),document.body.appendChild(n)}function d(l,w){const E=document.elementFromPoint(l,w);return!E||u(E)?null:E}function f(l){if(!a||!i)return;const w=d(l.clientX,l.clientY);if(!w){i.style.display="none";return}const E=w.getBoundingClientRect();i.style.display="block",i.style.left=`${E.left}px`,i.style.top=`${E.top}px`,i.style.width=`${E.width}px`,i.style.height=`${E.height}px`}function g(l){if(!a)return;const w=d(l.clientX,l.clientY);if(l.preventDefault(),l.stopPropagation(),!w)return;const E=et(w);r.log("picked",E),p(),t(E)}function c(l){l.key==="Escape"&&(l.preventDefault(),p())}function C(){a||(a=!0,r.log("start"),b(),document.addEventListener("mousemove",f,!0),document.addEventListener("click",g,!0),document.addEventListener("keydown",c,!0))}function p(){a&&(a=!1,document.removeEventListener("mousemove",f,!0),document.removeEventListener("click",g,!0),document.removeEventListener("keydown",c,!0),n&&n.parentNode&&n.parentNode.removeChild(n),n=null,s=null,i=null)}return{start:C,stop:p}}const Rt=6,At=6,It=10,Pt=12;function rt(t,e,r){const n={top:t.top,bottom:r.height-t.bottom,left:t.left,right:r.width-t.right},s={top:e.height,bottom:e.height,left:e.width,right:e.width},i=["bottom","top","right","left"],a=i.find(u=>n[u]>=s[u]+8);return a||i.reduce((u,b)=>n[b]>n[u]?b:u,i[0])}function ot(t){const{target:e,card:r,offset:n,viewport:s}=t,i=t.side==="auto",a=i?rt(e,r,s):t.side,u=i?"center":t.align,b=t.alignOffset??0,d=u==="start"?b:u==="end"?-b:0;let f=0,g=0;return a==="top"||a==="bottom"?(f=a==="top"?e.top-r.height-n:e.bottom+n,g=u==="start"?e.left:u==="end"?e.right-r.width:e.left+e.width/2-r.width/2,g+=d):(g=a==="left"?e.left-r.width-n:e.right+n,f=u==="start"?e.top:u==="end"?e.bottom-r.height:e.top+e.height/2-r.height/2,f+=d),g=Math.max(8,Math.min(g,s.width-r.width-8)),f=Math.max(8,Math.min(f,s.height-r.height-8)),{top:f,left:g}}function it(t){const e=document.createElement("button");return e.type="button",e.className=`tours-card__btn${t.primary?" tours-card__btn--primary":""}${t.disabled?" tours-card__btn--disabled":""}`,e.textContent=t.label,!t.disabled&&t.onClick&&e.addEventListener("click",t.onClick),e}function st(t){const e=document.createElement("div");if(e.className=`tours-card${t.ghost?" tours-card--ghost":""}`,t.radius!=null&&(e.style.borderRadius=`${t.radius}px`),t.showClose){const n=document.createElement("button");n.className="tours-card__close",n.type="button",n.textContent="×",n.setAttribute("aria-label","Close"),t.onClose&&n.addEventListener("click",t.onClose),e.appendChild(n)}const r=document.createElement("div");if(r.className="tours-card__content",t.contentHtml!=null?r.innerHTML=t.contentHtml:r.textContent=t.contentText??"",e.appendChild(r),t.back||t.next||t.progress){const n=document.createElement("div");if(n.className="tours-card__footer",t.back&&n.appendChild(it(t.back)),t.progress){const s=document.createElement("span");s.className="tours-card__progress",s.textContent=t.progress,n.appendChild(s)}t.next&&n.appendChild(it(t.next)),e.appendChild(n)}return e}const at=`
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
`;function zt(t){const e=t.replace(/[.+^${}()|[\]\\]/g,"\\$&").replace(/\*\*/g,"\0").replace(/\*/g,"[^/]*").replace(/ /g,".*").replace(/\?/g,".");return new RegExp(`^${e}$`)}function T(t,e){if(!t)return!0;if(t.regex)try{return new RegExp(t.regex).test(e)}catch{return!1}if(t.glob)try{return zt(t.glob).test(e)}catch{return!1}return!0}function ct(t){if(!t||!t.glob)return null;const e=t.glob.replace(/\*+/g,"");return/^https?:\/\//i.test(e)||e.startsWith("#")||e.startsWith("/")?e:null}const H="tours:locationchange";let lt=!1;function Dt(){if(!lt){lt=!0;for(const t of["pushState","replaceState"]){const e=history[t];history[t]=function(...n){const s=e.apply(this,n);return window.dispatchEvent(new Event(H)),s}}}}function B(t){return Dt(),window.addEventListener("popstate",t),window.addEventListener("hashchange",t),window.addEventListener(H,t),()=>{window.removeEventListener("popstate",t),window.removeEventListener("hashchange",t),window.removeEventListener(H,t)}}const D="tours:progress";function Ut(){return{get(t){try{return localStorage.getItem(t)}catch{return null}},set(t,e){try{localStorage.setItem(t,e)}catch{}},remove(t){try{localStorage.removeItem(t)}catch{}}}}function W(t){const e=t.get(D);if(!e)return null;try{const r=JSON.parse(e);if(typeof r?.tourId=="string"&&typeof r?.index=="number")return r}catch{}return null}function N(t,e){t.set(D,JSON.stringify(e))}function j(t){t.remove(D)}const ut="tours:seen:";function V(t,e){const r=t.get(ut+e),n=r?parseInt(r,10):0;return Number.isNaN(n)?0:n}function dt(t,e){t.set(ut+e,String(V(t,e)+1))}const Ot=`
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
`;function ft(t,e){return e?e(t):pt({text:t.text,button:t.button,corner:t.corner,offset:t.offset,onStart:t.onResume})}function pt(t){const e=t.corner??"bottom-right",r=t.offset??24,n=document.createElement("div");n.setAttribute("data-tours-cta","");const s=n.attachShadow({mode:"open"}),i=document.createElement("style");i.textContent=Ot,s.appendChild(i);const a=document.createElement("div");a.className="cta";const[u,b]=e.split("-");a.style[u]=`${r}px`,a.style[b]=`${r}px`;const d=()=>{n.parentNode&&n.parentNode.removeChild(n)},f=document.createElement("button");f.className="cta__close",f.type="button",f.textContent="×",f.setAttribute("aria-label","Dismiss"),f.addEventListener("click",d);const g=document.createElement("p");g.className="cta__text",g.textContent=t.text;const c=document.createElement("button");return c.className="cta__btn",c.type="button",c.textContent=t.button,c.addEventListener("click",()=>{d(),t.onStart()}),a.append(f,g,c),s.appendChild(a),document.body.appendChild(n),d}const Mt="[data-tours-editor]";function X(){return typeof document<"u"&&document.querySelector(Mt)!==null}function U(t,e={}){const r=z("player"),n=e.state;let s=null,i=null,a=null,u=null,b=null,d=null,f=null,g=!1,c=0,C=0,p=null;const l=t.display?.padding??Rt,w=t.display?.radius??At,E=t.display?.cardRadius??It,Ht=t.display?.offset??Pt;function q(o){return I(o.selectors)}function G(o){return o.action?.type==="click"}function R(o){return T(o.pageUrl,window.location.href)}function S(){n&&N(n,{tourId:t.id,index:c})}function xt(){if(s)return;s=document.createElement("div"),s.setAttribute("data-tours-player",""),i=s.attachShadow({mode:"open"});const o=document.createElement("style");o.textContent=_t+at,i.appendChild(o),b=document.createElement("div"),b.className="tours-backdrop",b.addEventListener("click",h=>{const x=t.steps[c],y=x?q(x):null;if(y){const v=y.getBoundingClientRect();if(h.clientX>=v.left-l&&h.clientX<=v.right+l&&h.clientY>=v.top-l&&h.clientY<=v.bottom+l)return}k()}),i.appendChild(b),a=document.createElement("div"),a.className="tours-spotlight",a.style.borderRadius=`${w}px`,i.appendChild(a),document.body.appendChild(s)}function Bt(o){if(!b)return;if(!o){b.style.clipPath="";return}const h=o.left-l,x=o.top-l,y=o.right+l,v=o.bottom+l;b.style.clipPath=`polygon(0 0, 0 100%, ${h}px 100%, ${h}px ${x}px, ${y}px ${x}px, ${y}px ${v}px, ${h}px ${v}px, ${h}px 100%, 100% 100%, 100% 0)`}function wt(o,h=!1){a&&(a.style.transitionDuration=h?"0ms":"",a.style.display="block",a.style.left=`${o.left-l}px`,a.style.top=`${o.top-l}px`,a.style.width=`${o.width+l*2}px`,a.style.height=`${o.height+l*2}px`)}function yt(o,h){if(!u)return;const x={top:o.top-l,left:o.left-l,right:o.right+l,bottom:o.bottom+l,width:o.width+l*2,height:o.height+l*2},{top:y,left:v}=ot({target:x,card:{width:u.offsetWidth,height:u.offsetHeight},side:h.placement??"bottom",align:h.align??"center",offset:Ht,alignOffset:t.display?.alignOffset??0,viewport:{width:window.innerWidth,height:window.innerHeight}});u.style.left=`${v}px`,u.style.top=`${y}px`}function Wt(o){const h=Math.max(1,t.steps.length-C),x=Math.max(1,Math.min(c+1-C,h));u&&u.remove();const y=c===t.steps.length-1,v=t.steps[c-1],A=!!v&&R(v),Gt=!G(o)||y;u=st({contentText:o.content.default,progress:`Step ${x} of ${h}`,showClose:!0,onClose:Xt,radius:E,back:A?{label:o.backLabel??"Back",onClick:Q}:void 0,next:Gt?{label:o.nextLabel??(y?"Done":"Next"),primary:!0,onClick:Z}:void 0}),i?.appendChild(u)}function _(){if(!g)return;const o=t.steps[c];if(!o){k();return}r.log("render step",c,o.id);const h=q(o);if(!h){r.log(`step "${o.id}" target not found yet — waiting`,o.selectors),Y(o.selectors,{timeout:4e3}).then(y=>{!g||t.steps[c]!==o||(y?_():(r.warn(`step "${o.id}" skipped: no element for selectors`,o.selectors),C+=1,c<t.steps.length-1?(c+=1,_()):k()))});return}xt(),h.scrollIntoView({behavior:"smooth",block:"center",inline:"center"}),Wt(o);const x=h.getBoundingClientRect();wt(x),yt(x,o),Bt(G(o)?x:null),jt(o)}function jt(o){if(d?.(),d=null,!G(o))return;const h=c+1,x=t.steps[h];!x||R(x)||(d=B(()=>{!g||t.steps[c]!==o||T(x.pageUrl,window.location.href)&&(d?.(),d=null,r.log("visitor navigated → advancing to",x.id),c=h,S(),_())}))}function vt(o){g&&(o.key==="Escape"?(o.preventDefault(),k()):o.key==="ArrowRight"?Z():o.key==="ArrowLeft"&&Q())}function O(){if(!g)return;const o=t.steps[c];if(!o)return;const h=q(o);if(!h)return;const x=h.getBoundingClientRect();wt(x,!0),yt(x,o)}function Et(o=0){if(!g&&t.steps.length!==0){if(!e.allowWhileEditing&&X()){r.log(`start suppressed for "${t.id}" — the builder is mounted`);return}J(),g=!0,c=Math.max(0,Math.min(o,t.steps.length-1)),C=0,r.log("start",t.id,`at ${c}/${t.steps.length}`),xt(),window.addEventListener("keydown",vt,!0),window.addEventListener("resize",O,!0),window.addEventListener("scroll",O,!0),S(),_()}}function Vt(){a&&(a.style.display="none"),u&&(u.remove(),u=null)}function M(){Vt(),!p&&(p=B(()=>{if(!g){p?.(),p=null;return}const o=t.steps[c];o&&R(o)&&(p?.(),p=null,_())}))}function K(){p&&(p(),p=null),d&&(d(),d=null),g&&(g=!1,window.removeEventListener("keydown",vt,!0),window.removeEventListener("resize",O,!0),window.removeEventListener("scroll",O,!0),s&&s.parentNode&&s.parentNode.removeChild(s),s=null,i=null,a=null,u=null,b=null)}function k(){r.log("stop"),J(),K(),n&&j(n)}function J(){f?.(),f=null}function Xt(){t.dismiss?.mode==="minimize"?Ct():k()}function Ct(){g&&(r.log("minimized",t.id,`at ${c}`),K(),n&&N(n,{tourId:t.id,index:c,minimized:!0}),qt())}function qt(){J();const o=t.dismiss?.resume;f=ft({tourId:t.id,text:o?.text??"Carry on with the tour?",button:o?.button??"Resume",corner:o?.corner,offset:o?.offset,onResume:()=>{f=null,n&&N(n,{tourId:t.id,index:c}),Et(c)}},e.renderResume)}function Z(){if(!g)return;const o=c+1,h=t.steps[o];if(!h){k();return}if(R(h)){c=o,S(),_();return}c=o,S();const x=A=>{K(),e.onNavigate?e.onNavigate(A,h.id):window.location.assign(A)},y=t.steps[c-1]?.action;if(y&&y.type==="navigate"&&y.url){y.url.startsWith("#")?(r.log("page transition (hash navigate) → resume at",c),M(),window.location.hash=y.url):(r.log("page transition (navigate) → resume at",c),x(y.url));return}const v=ct(h.pageUrl);if(v){v.startsWith("#")?(r.log("page transition (derived hash) → resume at",c),M(),window.location.hash=v):(r.log("page transition (derived navigate) → resume at",c,v),x(v));return}r.log("page transition (wait) → resume at",c),M()}function Q(){if(!g)return;const o=t.steps[c-1];if(o){if(R(o)){c-=1,S(),_();return}c-=1,S(),r.log("page transition back → resume at",c),M(),window.history.back()}}return{start:Et,stop:k,next:Z,prev:Q,minimize:Ct,isActive:()=>g}}function ht(t,e={}){const r=e.state;if(!r)return null;const n=W(r);if(!n||n.tourId!==t.id)return null;if(!t.steps[n.index])return j(r),null;let s=-1;for(let a=n.index;a<t.steps.length;a++)if(T(t.steps[a].pageUrl,window.location.href)){s=a;break}if(s===-1)return null;const i=U(t,e);return i.start(s),i}function mt(t,e){if(X())return()=>{};const r=t.trigger??{type:"manual"};let n=!1;const s=()=>{n||(n=!0,e())};switch(r.type){case"load":{const i=setTimeout(s,0);return()=>clearTimeout(i)}case"timer":{const i=setTimeout(s,Math.max(0,r.delay));return()=>clearTimeout(i)}case"selector":{let i=!1;return Y([r.selector],{timeout:0}).then(a=>{a&&!i&&s()}),()=>{i=!0}}case"cta":{let i=()=>{};return i=pt({text:r.text,button:r.button,corner:r.corner,offset:r.offset,onStart:s}),i}case"manual":default:return()=>{}}}function gt(t=window.innerWidth){return t<=640?"mobile":t<=1024?"tablet":"desktop"}function Ft(t,e){return!(t.url&&!T(t.url,e.url)||t.role!==void 0&&t.role!==e.role||t.firstVisitOnly&&!e.firstVisit||t.device&&t.device!==e.device||t.unlessSeen&&e.seenCount>0||t.maxShows!==void 0&&e.seenCount>=t.maxShows)}function bt(t,e){return!t||t.length===0?!0:t.some(r=>Ft(r.when,e))}function Yt(t,e={}){const r=z("mount"),n=e.state,s=()=>typeof t=="function"?t():t;let i=null,a=[],u=null;function b(){for(const c of a)c();a=[],u?.(),u=null}function d(c){return!e.canRun||e.canRun(c)}function f(){if(i?.isActive())return;i=null,b();const c=n?W(n):null;if(n&&c?.minimized){const p=s().find(l=>l.id===c.tourId&&d(l));if(p){const l=p.dismiss?.resume;u=ft({tourId:p.id,text:l?.text??"Carry on with the tour?",button:l?.button??"Resume",corner:l?.corner,offset:l?.offset,onResume:()=>{u=null,N(n,{tourId:p.id,index:c.index});const w=U(p,e);i=w,w.start(c.index)}},e.renderResume);return}}if(n)for(const p of s()){if(!d(p))continue;const l=ht(p,e);if(l){r.log("resumed",p.id),i=l;return}}const C=gt();for(const p of s()){if(!d(p)||!p.trigger||p.trigger.type==="manual")continue;const l=n?V(n,p.id):0;bt(p.rules,{url:window.location.href,device:C,firstVisit:l===0,seenCount:l})&&a.push(mt(p,()=>{n&&dt(n,p.id);const E=U(p,e);i=E,E.start()}))}}f();const g=B(f);return()=>{g(),b(),i?.stop(),i=null}}m.CARD_STYLES=at,m.PROGRESS_KEY=D,m.armTrigger=mt,m.autoSide=rt,m.buildSelectors=et,m.clearProgress=j,m.createLocalState=Ut,m.createLogger=z,m.createPicker=Nt,m.createPlayer=U,m.deriveUrl=ct,m.detectDevice=gt,m.isBuilderMounted=X,m.isLoggingEnabled=P,m.markSeen=dt,m.matchRules=bt,m.matchUrl=T,m.mountTours=Yt,m.placeCard=ot,m.readProgress=W,m.renderCard=st,m.resolveElement=I,m.resumeTour=ht,m.seenCount=V,m.waitForElement=Y,m.writeProgress=N,Object.defineProperty(m,Symbol.toStringTag,{value:"Module"})}));
//# sourceMappingURL=index.umd.js.map
