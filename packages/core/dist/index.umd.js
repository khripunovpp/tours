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
`,At=`
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
/* Step with overlay: false — outline the target, dim nothing. The huge shadow
   above *is* the dimming, so it is replaced rather than merely hidden. */
.tours-spotlight--plain {
  box-shadow: 0 0 0 2px var(--tours-outline, rgba(37, 99, 235, 0.9));
}
.tours-backdrop {
  position: fixed;
  inset: 0;
  z-index: 2147482999;
  background: transparent;
}
`;function j(t){return JSON.stringify(t)}function Pt(t){return/^[a-zA-Z][\w-]*$/.test(t)&&t.length<=30&&!/\d{2,}/.test(t)&&!/^(css-|sc-|jsx-|emotion-|_|is-|has-)/.test(t)}function at(t){const e=[];let r=t;for(;r&&r!==document.body&&r.nodeType===1;){const n=r.tagName.toLowerCase(),s=r.parentElement;if(!s){e.unshift(n);break}const i=Array.from(s.children).filter(a=>a.tagName===r.tagName);e.unshift(i.length>1?`${n}:nth-of-type(${i.indexOf(r)+1})`:n),r=s}return`body > ${e.join(" > ")}`}function It(t){let e=t.parentElement;for(;e&&e!==document.body&&!e.id;)e=e.parentElement;if(!e||!e.id)return null;const r=[];let n=t;for(;n&&n!==e;){const s=n.tagName.toLowerCase(),i=n.parentElement;if(!i)return null;const a=Array.from(i.children).filter(u=>u.tagName===n.tagName);r.unshift(a.length>1?`${s}:nth-of-type(${a.indexOf(n)+1})`:s),n=i}return`#${CSS.escape(e.id)} > ${r.join(" > ")}`}const Mt=["data-testid","data-test","data-test-id","data-cy","data-qa","data-id","data-name"];function lt(t){const e=[],r=new Set,n=t.tagName.toLowerCase(),s=f=>{if(!(!f||r.has(f)))try{document.querySelector(f)===t&&(r.add(f),e.push(f))}catch{}};t.id&&s(`#${CSS.escape(t.id)}`);for(const f of Mt){const h=t.getAttribute(f);h&&s(`${n}[${f}=${j(h)}]`)}const i=t.getAttribute("name");i&&s(`${n}[name=${j(i)}]`);const a=t.getAttribute("aria-label");a&&s(`[aria-label=${j(a)}]`);const u=Array.from(t.classList).filter(Pt);u.length&&s(`${n}.${u.map(f=>CSS.escape(f)).join(".")}`);for(const f of u)s(`${n}.${CSS.escape(f)}`);s(It(t)),s(at(t));const m=(t.textContent??"").replace(/\s+/g," ").trim();if(m&&m.length<=50&&/^(a|button|summary|label|h[1-6])$/.test(n)){const f=`text=${m}`;r.has(f)||(r.add(f),e.push(f))}return e.length===0&&e.push(at(t)),e}const zt="a, button, summary, label, h1, h2, h3, h4, h5, h6";function ct(t,e){return!(t instanceof Element)||!t.isConnected||e!==document&&e instanceof Node&&!e.contains(t)?null:t}function Dt(t,e){if(typeof t=="function"){let r;try{r=t()}catch{return null}return ct(r,e)}if(typeof t!="string")return ct(t,e);if(t.startsWith("text=")){const r=t.slice(5).trim();for(const n of Array.from(e.querySelectorAll(zt)))if((n.textContent??"").replace(/\s+/g," ").trim()===r)return n;return null}try{return e.querySelector(t)}catch{return null}}function M(t,e=document){for(const r of t){const n=Dt(r,e);if(n)return n}return null}function V(t,e={}){const r=e.root??document,n=M(t,r);return n?Promise.resolve(n):new Promise(s=>{let i=!1,a;const u=h=>{i||(i=!0,m.disconnect(),a&&clearTimeout(a),s(h))},m=new MutationObserver(()=>{const h=M(t,r);h&&u(h)});m.observe(document.documentElement,{childList:!0,subtree:!0,attributes:!0});const f=e.timeout??4e3;f>0&&Number.isFinite(f)&&(a=setTimeout(()=>u(null),f))})}let T=null;function z(){if(T!==null)return T;try{T=new URLSearchParams(window.location.search).has("use_logs")}catch{T=!1}return T}function D(t){const e=`[tours:${t}]`;return{log:(...r)=>{z()&&console.log(e,...r)},warn:(...r)=>{z()&&console.warn(e,...r)},error:(...r)=>{z()&&console.error(e,...r)}}}function Ot(t,e={}){const r=D("picker");let n=null,s=null,i=null,a=!1;function u(c){if(c===n)return!0;for(const b of e.ignore??[])if(b&&b.contains(c))return!0;return!1}function m(){if(n)return;n=document.createElement("div"),n.setAttribute("data-tours-picker",""),s=n.attachShadow({mode:"open"});const c=document.createElement("style");c.textContent=L,s.appendChild(c),i=document.createElement("div"),i.className="tours-picker-overlay",i.style.display="none",s.appendChild(i);const b=document.createElement("div");b.className="tours-picker-hint",b.textContent="Hover and click an element • Esc to cancel",s.appendChild(b),document.body.appendChild(n)}function f(c,b){const E=document.elementFromPoint(c,b);return!E||u(E)?null:E}function h(c){if(!a||!i)return;const b=f(c.clientX,c.clientY);if(!b){i.style.display="none";return}const E=b.getBoundingClientRect();i.style.display="block",i.style.left=`${E.left}px`,i.style.top=`${E.top}px`,i.style.width=`${E.width}px`,i.style.height=`${E.height}px`}function g(c){if(!a)return;const b=f(c.clientX,c.clientY);if(c.preventDefault(),c.stopPropagation(),!b)return;const E=lt(b);r.log("picked",E),v(),t(E)}function l(c){c.key==="Escape"&&(c.preventDefault(),v())}function C(){a||(a=!0,r.log("start"),m(),document.addEventListener("mousemove",h,!0),document.addEventListener("click",g,!0),document.addEventListener("keydown",l,!0))}function v(){a&&(a=!1,document.removeEventListener("mousemove",h,!0),document.removeEventListener("click",g,!0),document.removeEventListener("keydown",l,!0),n&&n.parentNode&&n.parentNode.removeChild(n),n=null,s=null,i=null)}return{start:C,stop:v}}const Ut=6,Ft=6,Yt=10,Ht=12;function ut(t,e,r){const n={top:t.top,bottom:r.height-t.bottom,left:t.left,right:r.width-t.right},s={top:e.height,bottom:e.height,left:e.width,right:e.width},i=["bottom","top","right","left"],a=i.find(u=>n[u]>=s[u]+8);return a||i.reduce((u,m)=>n[m]>n[u]?m:u,i[0])}function dt(t){const{target:e,card:r,offset:n,viewport:s}=t,i=t.side==="auto",a=i?ut(e,r,s):t.side,u=i?"center":t.align,m=t.alignOffset??0,f=u==="start"?m:u==="end"?-m:0;let h=0,g=0;return a==="top"||a==="bottom"?(h=a==="top"?e.top-r.height-n:e.bottom+n,g=u==="start"?e.left:u==="end"?e.right-r.width:e.left+e.width/2-r.width/2,g+=f):(g=a==="left"?e.left-r.width-n:e.right+n,h=u==="start"?e.top:u==="end"?e.bottom-r.height:e.top+e.height/2-r.height/2,h+=f),g=Math.max(8,Math.min(g,s.width-r.width-8)),h=Math.max(8,Math.min(h,s.height-r.height-8)),{top:h,left:g}}function Bt(t){const e=getComputedStyle(t),r=`${e.overflowX} ${e.overflowY}`;return/auto|scroll|overlay|hidden/.test(r)}function X(t){const e=t.getBoundingClientRect();let r=e.top,n=e.left,s=e.right,i=e.bottom;for(let a=t.parentElement;a&&a!==document.body;a=a.parentElement){if(!Bt(a))continue;const u=a.getBoundingClientRect();r=Math.max(r,u.top),n=Math.max(n,u.left),s=Math.min(s,u.right),i=Math.min(i,u.bottom)}return r=Math.max(r,0),n=Math.max(n,0),s=Math.min(s,window.innerWidth),i=Math.min(i,window.innerHeight),s<=n||i<=r?null:{top:r,left:n,right:s,bottom:i,width:s-n,height:i-r}}function ft(t){const e=document.createElement("button");return e.type="button",e.className=`tours-card__btn${t.primary?" tours-card__btn--primary":""}${t.disabled?" tours-card__btn--disabled":""}`,e.textContent=t.label,!t.disabled&&t.onClick&&e.addEventListener("click",t.onClick),e}function pt(t){const e=document.createElement("div");if(e.className=`tours-card${t.ghost?" tours-card--ghost":""}${t.showClose?" tours-card--closable":""}`,t.radius!=null&&(e.style.borderRadius=`${t.radius}px`),t.showClose){const n=document.createElement("button");n.className="tours-card__close",n.type="button",n.textContent="×",n.setAttribute("aria-label","Close"),t.onClose&&n.addEventListener("click",t.onClose),e.appendChild(n)}const r=document.createElement("div");if(r.className="tours-card__content",t.contentHtml!=null?r.innerHTML=t.contentHtml:r.textContent=t.contentText??"",e.appendChild(r),t.back||t.next||t.progress){const n=document.createElement("div");if(n.className="tours-card__footer",t.back&&n.appendChild(ft(t.back)),t.progress){const s=document.createElement("span");s.className="tours-card__progress",s.textContent=t.progress,n.appendChild(s)}t.next&&n.appendChild(ft(t.next)),e.appendChild(n)}return e}const ht=`
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
/* Room for the × — only when there is one, so a card without it keeps the full
   width. 8px offset + 24px button, less the card's own 16px padding. */
.tours-card--closable .tours-card__content { padding-right: 20px; }
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
`;function Wt(t){const e=t.replace(/[.+^${}()|[\]\\]/g,"\\$&").replace(/\*\*/g,"\0").replace(/\*/g,"[^/]*").replace(/ /g,".*").replace(/\?/g,".");return new RegExp(`^${e}$`)}function R(t,e){if(!t)return!0;if(t.regex)try{return new RegExp(t.regex).test(e)}catch{return!1}if(t.glob)try{return Wt(t.glob).test(e)}catch{return!1}return!0}function mt(t){if(!t||!t.glob)return null;const e=t.glob.replace(/\*+/g,"");return/^https?:\/\//i.test(e)||e.startsWith("#")||e.startsWith("/")?e:null}function q(t=window.innerWidth){return t<=640?"mobile":t<=1024?"tablet":"desktop"}function gt(t,e){if(t.url&&!R(t.url,e.url))return!1;if(t.traits){for(const[r,n]of Object.entries(t.traits))if(e.traits?.[r]!==n)return!1}return!(t.firstVisitOnly&&!e.firstVisit||t.device&&t.device!==e.device||t.unlessSeen&&e.seenCount>0||t.maxShows!==void 0&&e.seenCount>=t.maxShows)}function bt(t,e){return!t||gt(t,e)}function wt(t,e){return!t||t.length===0?!0:t.some(r=>gt(r.when,e))}const G="tours:locationchange";let yt=!1;function jt(){if(!yt){yt=!0;for(const t of["pushState","replaceState"]){const e=history[t];history[t]=function(...n){const s=e.apply(this,n);return window.dispatchEvent(new Event(G)),s}}}}function K(t){return jt(),window.addEventListener("popstate",t),window.addEventListener("hashchange",t),window.addEventListener(G,t),()=>{window.removeEventListener("popstate",t),window.removeEventListener("hashchange",t),window.removeEventListener(G,t)}}const O="tours:progress";function Vt(){return{get(t){try{return localStorage.getItem(t)}catch{return null}},set(t,e){try{localStorage.setItem(t,e)}catch{}},remove(t){try{localStorage.removeItem(t)}catch{}}}}function J(t){const e=t.get(O);if(!e)return null;try{const r=JSON.parse(e);if(typeof r?.tourId=="string"&&typeof r?.index=="number")return r}catch{}return null}function N(t,e){t.set(O,JSON.stringify(e))}function U(t){t.remove(O)}const vt="tours:seen:";function F(t,e){const r=t.get(vt+e),n=r?parseInt(r,10):0;return Number.isNaN(n)?0:n}function xt(t,e){t.set(vt+e,String(F(t,e)+1))}const Xt=`
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
`;function Et(t,e){return e?e(t):Ct({text:t.text,button:t.button,corner:t.corner,offset:t.offset,onStart:t.onResume})}function Ct(t){const e=t.corner??"bottom-right",r=t.offset??24,n=document.createElement("div");n.setAttribute("data-tours-cta","");const s=n.attachShadow({mode:"open"}),i=document.createElement("style");i.textContent=Xt,s.appendChild(i);const a=document.createElement("div");a.className="cta";const[u,m]=e.split("-");a.style[u]=`${r}px`,a.style[m]=`${r}px`;const f=()=>{n.parentNode&&n.parentNode.removeChild(n)},h=document.createElement("button");h.className="cta__close",h.type="button",h.textContent="×",h.setAttribute("aria-label","Dismiss"),h.addEventListener("click",f);const g=document.createElement("p");g.className="cta__text",g.textContent=t.text;const l=document.createElement("button");return l.className="cta__btn",l.type="button",l.textContent=t.button,l.addEventListener("click",()=>{f(),t.onStart()}),a.append(h,g,l),s.appendChild(a),document.body.appendChild(n),f}const qt=new Set(["tourStarting","stepChanging"]);function S(t,e,r){const n=qt.has(e);let s=!0;const i=t?.[e];if(i)try{i(r)===!1&&n&&(s=!1)}catch(a){console.error(`[tours] handler for "${e}" threw`,a)}if(typeof document<"u"&&typeof CustomEvent=="function")try{const a=new CustomEvent(`tours:${e}`,{detail:r,cancelable:n});document.dispatchEvent(a),n&&a.defaultPrevented&&(s=!1)}catch(a){console.error(`[tours] could not dispatch "tours:${e}"`,a)}return s}const Gt="[data-tours-editor]";function Z(){return typeof document<"u"&&document.querySelector(Gt)!==null}function A(t,e={}){const r=D("player"),n=e.state;let s=null,i=null,a=null,u=null,m=null,f=null,h=null,g=!1,l=0,C=0,v=null;const c=t.display?.padding??Ut,b=t.display?.radius??Ft,E=t.display?.cardRadius??Yt,Y=t.display?.offset??Ht;function Q(o){return M(o.selectors)}function H(o){return o.action?.type==="click"}function Jt(o){if(!o.condition)return!0;const d=n?F(n,t.id):0;return bt(o.condition,{url:window.location.href,traits:e.viewer?.(),device:q(),firstVisit:d===0,seenCount:d})}function P(o){return R(o.pageUrl,window.location.href)}function $(){n&&N(n,{tourId:t.id,index:l})}function _t(){if(s)return;s=document.createElement("div"),s.setAttribute("data-tours-player",""),i=s.attachShadow({mode:"open"});const o=document.createElement("style");o.textContent=At+ht,i.appendChild(o),m=document.createElement("div"),m.className="tours-backdrop",m.addEventListener("click",d=>{const w=t.steps[l],y=w?Q(w):null;if(y){const x=y.getBoundingClientRect();if(d.clientX>=x.left-c&&d.clientX<=x.right+c&&d.clientY>=x.top-c&&d.clientY<=x.bottom+c)return}_()}),i.appendChild(m),a=document.createElement("div"),a.className="tours-spotlight",a.style.borderRadius=`${b}px`,i.appendChild(a),document.body.appendChild(s)}function tt(o){if(!m)return;if(!o){m.style.clipPath="";return}const d=o.left-c,w=o.top-c,y=o.right+c,x=o.bottom+c;m.style.clipPath=`polygon(0 0, 0 100%, ${d}px 100%, ${d}px ${w}px, ${y}px ${w}px, ${y}px ${x}px, ${d}px ${x}px, ${d}px 100%, 100% 100%, 100% 0)`}function et(o){return o.overlay!==!1}function Zt(o){const d=et(o);m&&(m.style.display=d?"":"none"),a?.classList.toggle("tours-spotlight--plain",!d)}function $t(o,d=!1){a&&(a.style.transitionDuration=d?"0ms":"",a.style.display="block",a.style.left=`${o.left-c}px`,a.style.top=`${o.top-c}px`,a.style.width=`${o.width+c*2}px`,a.style.height=`${o.height+c*2}px`)}function Lt(o,d){if(!u)return;const w={top:o.top-c,left:o.left-c,right:o.right+c,bottom:o.bottom+c,width:o.width+c*2,height:o.height+c*2},{top:y,left:x}=dt({target:w,card:{width:u.offsetWidth,height:u.offsetHeight},side:d.placement??"bottom",align:d.align??"center",offset:Y,alignOffset:t.display?.alignOffset??0,viewport:{width:window.innerWidth,height:window.innerHeight}});u.style.left=`${x}px`,u.style.top=`${y}px`}function Qt(o){const d=Math.max(1,t.steps.length-C),w=Math.max(1,Math.min(l+1-C,d));u&&u.remove();const y=l===t.steps.length-1,x=t.steps[l-1],I=!!x&&P(x),ie=!H(o)||y;u=pt({contentText:o.content.default,progress:`Step ${w} of ${d}`,showClose:!0,onClose:re,radius:E,back:I?{label:o.backLabel??"Back",onClick:st}:void 0,next:ie?{label:o.nextLabel??(y?"Done":"Next"),primary:!0,onClick:it}:void 0}),i?.appendChild(u)}function k(){if(!g)return;const o=t.steps[l];if(!o){_();return}if(r.log("render step",l,o.id),!Jt(o)){r.log(`step "${o.id}" skipped: condition not met`),S(e.on,"stepSkipped",{tour:t,index:l,step:o,reason:"condition"}),C+=1,l<t.steps.length-1?(l+=1,k()):_(C>=t.steps.length?"dismissed":"completed");return}const d=Q(o);if(!d){r.log(`step "${o.id}" target not found yet — waiting`,o.selectors),V(o.selectors,{timeout:4e3}).then(y=>{!g||t.steps[l]!==o||(y?k():(r.warn(`step "${o.id}" skipped: no element for selectors`,o.selectors),S(e.on,"stepSkipped",{tour:t,index:l,step:o,reason:"no-element"}),C+=1,l<t.steps.length-1?(l+=1,k()):_()))});return}_t(),d.scrollIntoView({behavior:"smooth",block:"center",inline:"center"}),Qt(o);const w=X(d)??d.getBoundingClientRect();$t(w),Lt(w,o),Zt(o),tt(et(o)&&H(o)?w:null),te(o),S(e.on,"stepActivated",{tour:t,index:l,step:o,target:d})}function te(o){if(f?.(),f=null,!H(o))return;const d=l+1,w=t.steps[d];!w||P(w)||(f=K(()=>{!g||t.steps[l]!==o||R(w.pageUrl,window.location.href)&&ot(d)&&(f?.(),f=null,r.log("visitor navigated → advancing to",w.id),l=d,$(),k())}))}function Tt(o){g&&(o.key==="Escape"?(o.preventDefault(),_()):o.key==="ArrowRight"?it():o.key==="ArrowLeft"&&st())}function B(){if(!g)return;const o=t.steps[l];if(!o)return;const d=Q(o);if(!d)return;const w=X(d);if(!w){ee();return}$t(w,!0),Lt(w,o),tt(et(o)&&H(o)?w:null),u&&(u.style.visibility="")}function ee(){a&&(a.style.display="none"),u&&(u.style.visibility="hidden"),tt(null)}function Rt(o=0){if(g||t.steps.length===0)return;if(!e.allowWhileEditing&&Z()){r.log(`start suppressed for "${t.id}" — the builder is mounted`);return}const d=Math.max(0,Math.min(o,t.steps.length-1));if(!S(e.on,"tourStarting",{tour:t,index:d})){r.log("start vetoed by handler");return}rt(),g=!0,l=d,C=0,r.log("start",t.id,`at ${l}/${t.steps.length}`),_t(),window.addEventListener("keydown",Tt,!0),window.addEventListener("resize",B,!0),window.addEventListener("scroll",B,!0),$(),S(e.on,"tourStarted",{tour:t,index:l}),k()}function ne(){a&&(a.style.display="none"),u&&(u.remove(),u=null)}function W(){ne(),!v&&(v=K(()=>{if(!g){v?.(),v=null;return}const o=t.steps[l];o&&P(o)&&(v?.(),v=null,k())}))}function nt(){v&&(v(),v=null),f&&(f(),f=null),g&&(g=!1,window.removeEventListener("keydown",Tt,!0),window.removeEventListener("resize",B,!0),window.removeEventListener("scroll",B,!0),s&&s.parentNode&&s.parentNode.removeChild(s),s=null,i=null,a=null,u=null,m=null)}function _(o="dismissed"){r.log("stop",o);const d=g,w=l;rt(),nt(),n&&U(n),d&&(o==="completed"?S(e.on,"tourCompleted",{tour:t}):S(e.on,"tourDismissed",{tour:t,index:w}))}function rt(){h?.(),h=null}function re(){t.dismiss?.mode==="minimize"?Nt():_()}function Nt(){g&&(r.log("minimized",t.id,`at ${l}`),nt(),n&&N(n,{tourId:t.id,index:l,minimized:!0}),S(e.on,"tourMinimized",{tour:t,index:l}),oe())}function oe(){rt();const o=t.dismiss?.resume;h=Et({tourId:t.id,text:o?.text??"Carry on with the tour?",button:o?.button??"Resume",corner:o?.corner,offset:o?.offset,onResume:()=>{h=null,n&&N(n,{tourId:t.id,index:l}),S(e.on,"tourResumed",{tour:t,index:l}),Rt(l)}},e.renderResume)}function ot(o){const d=t.steps[o];return d?S(e.on,"stepChanging",{tour:t,from:l,to:o,step:d}):!0}function it(){if(!g)return;const o=l+1,d=t.steps[o];if(!d){_("completed");return}if(!ot(o)){r.log("step change vetoed by handler");return}if(P(d)){l=o,$(),k();return}l=o,$();const w=I=>{nt(),e.onNavigate?e.onNavigate(I,d.id):window.location.assign(I)},y=t.steps[l-1]?.action;if(y&&y.type==="navigate"&&y.url){y.url.startsWith("#")?(r.log("page transition (hash navigate) → resume at",l),W(),window.location.hash=y.url):(r.log("page transition (navigate) → resume at",l),w(y.url));return}const x=mt(d.pageUrl);if(x){x.startsWith("#")?(r.log("page transition (derived hash) → resume at",l),W(),window.location.hash=x):(r.log("page transition (derived navigate) → resume at",l,x),w(x));return}r.log("page transition (wait) → resume at",l),W()}function st(){if(!g)return;const o=t.steps[l-1];if(o){if(!ot(l-1)){r.log("step change vetoed by handler");return}if(P(o)){l-=1,$(),k();return}l-=1,$(),r.log("page transition back → resume at",l),W(),window.history.back()}}return{start:Rt,stop:_,next:it,prev:st,minimize:Nt,isActive:()=>g}}function St(t,e={}){const r=e.state;if(!r)return null;const n=J(r);if(!n||n.tourId!==t.id)return null;if(!t.steps[n.index])return U(r),null;let s=-1;for(let a=n.index;a<t.steps.length;a++)if(R(t.steps[a].pageUrl,window.location.href)){s=a;break}if(s===-1)return null;const i=A(t,e);return i.start(s),i}function kt(t,e){if(Z())return()=>{};const r=t.trigger??{type:"manual"};let n=!1;const s=()=>{n||(n=!0,e())};switch(r.type){case"load":{const i=setTimeout(s,0);return()=>clearTimeout(i)}case"timer":{const i=setTimeout(s,Math.max(0,r.delay));return()=>clearTimeout(i)}case"selector":{let i=!1;return V([r.selector],{timeout:0}).then(a=>{a&&!i&&s()}),()=>{i=!0}}case"cta":{let i=()=>{};return i=Ct({text:r.text,button:r.button,corner:r.corner,offset:r.offset,onStart:s}),i}case"manual":default:return()=>{}}}function Kt(t,e={}){const r=D("mount"),n=e.state,s=()=>typeof t=="function"?t():t;let i=null,a=[],u=null;function m(){for(const l of a)l();a=[],u?.(),u=null}function f(l){return!e.canRun||e.canRun(l)}function h(){if(i?.isActive())return;i=null,m();const l=n?J(n):null;if(n&&l?.minimized){const c=s().find(b=>b.id===l.tourId&&f(b));if(c){const b=c.dismiss?.resume;u=Et({tourId:c.id,text:b?.text??"Carry on with the tour?",button:b?.button??"Resume",corner:b?.corner,offset:b?.offset,onResume:()=>{u=null,N(n,{tourId:c.id,index:l.index});const E=A(c,e);i=E,E.start(l.index)}},e.renderResume);return}}if(n)for(const c of s()){if(!f(c))continue;const b=St(c,e);if(b){r.log("resumed",c.id),i=b;return}}const C=q(),v=e.viewer?.();for(const c of s()){if(!f(c)||!c.trigger||c.trigger.type==="manual")continue;const b=n?F(n,c.id):0;wt(c.rules,{url:window.location.href,traits:v,device:C,firstVisit:b===0,seenCount:b})&&a.push(kt(c,()=>{n&&xt(n,c.id);const Y=A(c,e);i=Y,Y.start()}))}}h();const g=K(h);return{start(l){const C=s().find(c=>c.id===l);if(!C||!f(C))return!1;i?.stop(),m(),n&&U(n);const v=A(C,e);return i=v,v.start(),!0},stop(){i?.stop(),i=null},unmount(){g(),m(),i?.stop(),i=null}}}p.CARD_STYLES=ht,p.PROGRESS_KEY=O,p.armTrigger=kt,p.autoSide=ut,p.buildSelectors=lt,p.clearProgress=U,p.createLocalState=Vt,p.createLogger=D,p.createPicker=Ot,p.createPlayer=A,p.deriveUrl=mt,p.detectDevice=q,p.isBuilderMounted=Z,p.isLoggingEnabled=z,p.markSeen=xt,p.matchRules=wt,p.matchUrl=R,p.matchesCondition=bt,p.mountTours=Kt,p.placeCard=dt,p.readProgress=J,p.renderCard=pt,p.resolveElement=M,p.resumeTour=St,p.seenCount=F,p.visibleRect=X,p.waitForElement=V,p.writeProgress=N,Object.defineProperty(p,Symbol.toStringTag,{value:"Module"})}));
//# sourceMappingURL=index.umd.js.map
