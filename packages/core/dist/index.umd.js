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
`,Nt=`
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
`;function W(t){return JSON.stringify(t)}function Rt(t){return/^[a-zA-Z][\w-]*$/.test(t)&&t.length<=30&&!/\d{2,}/.test(t)&&!/^(css-|sc-|jsx-|emotion-|_|is-|has-)/.test(t)}function ot(t){const e=[];let r=t;for(;r&&r!==document.body&&r.nodeType===1;){const n=r.tagName.toLowerCase(),s=r.parentElement;if(!s){e.unshift(n);break}const i=Array.from(s.children).filter(a=>a.tagName===r.tagName);e.unshift(i.length>1?`${n}:nth-of-type(${i.indexOf(r)+1})`:n),r=s}return`body > ${e.join(" > ")}`}function At(t){let e=t.parentElement;for(;e&&e!==document.body&&!e.id;)e=e.parentElement;if(!e||!e.id)return null;const r=[];let n=t;for(;n&&n!==e;){const s=n.tagName.toLowerCase(),i=n.parentElement;if(!i)return null;const a=Array.from(i.children).filter(d=>d.tagName===n.tagName);r.unshift(a.length>1?`${s}:nth-of-type(${a.indexOf(n)+1})`:s),n=i}return`#${CSS.escape(e.id)} > ${r.join(" > ")}`}const Pt=["data-testid","data-test","data-test-id","data-cy","data-qa","data-id","data-name"];function it(t){const e=[],r=new Set,n=t.tagName.toLowerCase(),s=f=>{if(!(!f||r.has(f)))try{document.querySelector(f)===t&&(r.add(f),e.push(f))}catch{}};t.id&&s(`#${CSS.escape(t.id)}`);for(const f of Pt){const h=t.getAttribute(f);h&&s(`${n}[${f}=${W(h)}]`)}const i=t.getAttribute("name");i&&s(`${n}[name=${W(i)}]`);const a=t.getAttribute("aria-label");a&&s(`[aria-label=${W(a)}]`);const d=Array.from(t.classList).filter(Rt);d.length&&s(`${n}.${d.map(f=>CSS.escape(f)).join(".")}`);for(const f of d)s(`${n}.${CSS.escape(f)}`);s(At(t)),s(ot(t));const g=(t.textContent??"").replace(/\s+/g," ").trim();if(g&&g.length<=50&&/^(a|button|summary|label|h[1-6])$/.test(n)){const f=`text=${g}`;r.has(f)||(r.add(f),e.push(f))}return e.length===0&&e.push(ot(t)),e}const It="a, button, summary, label, h1, h2, h3, h4, h5, h6";function st(t,e){return!(t instanceof Element)||!t.isConnected||e!==document&&e instanceof Node&&!e.contains(t)?null:t}function zt(t,e){if(typeof t=="function"){let r;try{r=t()}catch{return null}return st(r,e)}if(typeof t!="string")return st(t,e);if(t.startsWith("text=")){const r=t.slice(5).trim();for(const n of Array.from(e.querySelectorAll(It)))if((n.textContent??"").replace(/\s+/g," ").trim()===r)return n;return null}try{return e.querySelector(t)}catch{return null}}function z(t,e=document){for(const r of t){const n=zt(r,e);if(n)return n}return null}function j(t,e={}){const r=e.root??document,n=z(t,r);return n?Promise.resolve(n):new Promise(s=>{let i=!1,a;const d=h=>{i||(i=!0,g.disconnect(),a&&clearTimeout(a),s(h))},g=new MutationObserver(()=>{const h=z(t,r);h&&d(h)});g.observe(document.documentElement,{childList:!0,subtree:!0,attributes:!0});const f=e.timeout??4e3;f>0&&Number.isFinite(f)&&(a=setTimeout(()=>d(null),f))})}let T=null;function D(){if(T!==null)return T;try{T=new URLSearchParams(window.location.search).has("use_logs")}catch{T=!1}return T}function O(t){const e=`[tours:${t}]`;return{log:(...r)=>{D()&&console.log(e,...r)},warn:(...r)=>{D()&&console.warn(e,...r)},error:(...r)=>{D()&&console.error(e,...r)}}}function Dt(t,e={}){const r=O("picker");let n=null,s=null,i=null,a=!1;function d(l){if(l===n)return!0;for(const b of e.ignore??[])if(b&&b.contains(l))return!0;return!1}function g(){if(n)return;n=document.createElement("div"),n.setAttribute("data-tours-picker",""),s=n.attachShadow({mode:"open"});const l=document.createElement("style");l.textContent=L,s.appendChild(l),i=document.createElement("div"),i.className="tours-picker-overlay",i.style.display="none",s.appendChild(i);const b=document.createElement("div");b.className="tours-picker-hint",b.textContent="Hover and click an element • Esc to cancel",s.appendChild(b),document.body.appendChild(n)}function f(l,b){const E=document.elementFromPoint(l,b);return!E||d(E)?null:E}function h(l){if(!a||!i)return;const b=f(l.clientX,l.clientY);if(!b){i.style.display="none";return}const E=b.getBoundingClientRect();i.style.display="block",i.style.left=`${E.left}px`,i.style.top=`${E.top}px`,i.style.width=`${E.width}px`,i.style.height=`${E.height}px`}function m(l){if(!a)return;const b=f(l.clientX,l.clientY);if(l.preventDefault(),l.stopPropagation(),!b)return;const E=it(b);r.log("picked",E),y(),t(E)}function c(l){l.key==="Escape"&&(l.preventDefault(),y())}function C(){a||(a=!0,r.log("start"),g(),document.addEventListener("mousemove",h,!0),document.addEventListener("click",m,!0),document.addEventListener("keydown",c,!0))}function y(){a&&(a=!1,document.removeEventListener("mousemove",h,!0),document.removeEventListener("click",m,!0),document.removeEventListener("keydown",c,!0),n&&n.parentNode&&n.parentNode.removeChild(n),n=null,s=null,i=null)}return{start:C,stop:y}}const Ot=6,Ut=6,Mt=10,Ft=12;function at(t,e,r){const n={top:t.top,bottom:r.height-t.bottom,left:t.left,right:r.width-t.right},s={top:e.height,bottom:e.height,left:e.width,right:e.width},i=["bottom","top","right","left"],a=i.find(d=>n[d]>=s[d]+8);return a||i.reduce((d,g)=>n[g]>n[d]?g:d,i[0])}function ct(t){const{target:e,card:r,offset:n,viewport:s}=t,i=t.side==="auto",a=i?at(e,r,s):t.side,d=i?"center":t.align,g=t.alignOffset??0,f=d==="start"?g:d==="end"?-g:0;let h=0,m=0;return a==="top"||a==="bottom"?(h=a==="top"?e.top-r.height-n:e.bottom+n,m=d==="start"?e.left:d==="end"?e.right-r.width:e.left+e.width/2-r.width/2,m+=f):(m=a==="left"?e.left-r.width-n:e.right+n,h=d==="start"?e.top:d==="end"?e.bottom-r.height:e.top+e.height/2-r.height/2,h+=f),m=Math.max(8,Math.min(m,s.width-r.width-8)),h=Math.max(8,Math.min(h,s.height-r.height-8)),{top:h,left:m}}function lt(t){const e=document.createElement("button");return e.type="button",e.className=`tours-card__btn${t.primary?" tours-card__btn--primary":""}${t.disabled?" tours-card__btn--disabled":""}`,e.textContent=t.label,!t.disabled&&t.onClick&&e.addEventListener("click",t.onClick),e}function ut(t){const e=document.createElement("div");if(e.className=`tours-card${t.ghost?" tours-card--ghost":""}${t.showClose?" tours-card--closable":""}`,t.radius!=null&&(e.style.borderRadius=`${t.radius}px`),t.showClose){const n=document.createElement("button");n.className="tours-card__close",n.type="button",n.textContent="×",n.setAttribute("aria-label","Close"),t.onClose&&n.addEventListener("click",t.onClose),e.appendChild(n)}const r=document.createElement("div");if(r.className="tours-card__content",t.contentHtml!=null?r.innerHTML=t.contentHtml:r.textContent=t.contentText??"",e.appendChild(r),t.back||t.next||t.progress){const n=document.createElement("div");if(n.className="tours-card__footer",t.back&&n.appendChild(lt(t.back)),t.progress){const s=document.createElement("span");s.className="tours-card__progress",s.textContent=t.progress,n.appendChild(s)}t.next&&n.appendChild(lt(t.next)),e.appendChild(n)}return e}const dt=`
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
`;function Yt(t){const e=t.replace(/[.+^${}()|[\]\\]/g,"\\$&").replace(/\*\*/g,"\0").replace(/\*/g,"[^/]*").replace(/ /g,".*").replace(/\?/g,".");return new RegExp(`^${e}$`)}function N(t,e){if(!t)return!0;if(t.regex)try{return new RegExp(t.regex).test(e)}catch{return!1}if(t.glob)try{return Yt(t.glob).test(e)}catch{return!1}return!0}function ft(t){if(!t||!t.glob)return null;const e=t.glob.replace(/\*+/g,"");return/^https?:\/\//i.test(e)||e.startsWith("#")||e.startsWith("/")?e:null}function V(t=window.innerWidth){return t<=640?"mobile":t<=1024?"tablet":"desktop"}function pt(t,e){if(t.url&&!N(t.url,e.url))return!1;if(t.traits){for(const[r,n]of Object.entries(t.traits))if(e.traits?.[r]!==n)return!1}return!(t.firstVisitOnly&&!e.firstVisit||t.device&&t.device!==e.device||t.unlessSeen&&e.seenCount>0||t.maxShows!==void 0&&e.seenCount>=t.maxShows)}function ht(t,e){return!t||pt(t,e)}function gt(t,e){return!t||t.length===0?!0:t.some(r=>pt(r.when,e))}const X="tours:locationchange";let mt=!1;function Ht(){if(!mt){mt=!0;for(const t of["pushState","replaceState"]){const e=history[t];history[t]=function(...n){const s=e.apply(this,n);return window.dispatchEvent(new Event(X)),s}}}}function q(t){return Ht(),window.addEventListener("popstate",t),window.addEventListener("hashchange",t),window.addEventListener(X,t),()=>{window.removeEventListener("popstate",t),window.removeEventListener("hashchange",t),window.removeEventListener(X,t)}}const U="tours:progress";function Bt(){return{get(t){try{return localStorage.getItem(t)}catch{return null}},set(t,e){try{localStorage.setItem(t,e)}catch{}},remove(t){try{localStorage.removeItem(t)}catch{}}}}function G(t){const e=t.get(U);if(!e)return null;try{const r=JSON.parse(e);if(typeof r?.tourId=="string"&&typeof r?.index=="number")return r}catch{}return null}function R(t,e){t.set(U,JSON.stringify(e))}function M(t){t.remove(U)}const bt="tours:seen:";function F(t,e){const r=t.get(bt+e),n=r?parseInt(r,10):0;return Number.isNaN(n)?0:n}function wt(t,e){t.set(bt+e,String(F(t,e)+1))}const Wt=`
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
`;function xt(t,e){return e?e(t):yt({text:t.text,button:t.button,corner:t.corner,offset:t.offset,onStart:t.onResume})}function yt(t){const e=t.corner??"bottom-right",r=t.offset??24,n=document.createElement("div");n.setAttribute("data-tours-cta","");const s=n.attachShadow({mode:"open"}),i=document.createElement("style");i.textContent=Wt,s.appendChild(i);const a=document.createElement("div");a.className="cta";const[d,g]=e.split("-");a.style[d]=`${r}px`,a.style[g]=`${r}px`;const f=()=>{n.parentNode&&n.parentNode.removeChild(n)},h=document.createElement("button");h.className="cta__close",h.type="button",h.textContent="×",h.setAttribute("aria-label","Dismiss"),h.addEventListener("click",f);const m=document.createElement("p");m.className="cta__text",m.textContent=t.text;const c=document.createElement("button");return c.className="cta__btn",c.type="button",c.textContent=t.button,c.addEventListener("click",()=>{f(),t.onStart()}),a.append(h,m,c),s.appendChild(a),document.body.appendChild(n),f}const jt=new Set(["tourStarting","stepChanging"]);function S(t,e,r){const n=jt.has(e);let s=!0;const i=t?.[e];if(i)try{i(r)===!1&&n&&(s=!1)}catch(a){console.error(`[tours] handler for "${e}" threw`,a)}if(typeof document<"u"&&typeof CustomEvent=="function")try{const a=new CustomEvent(`tours:${e}`,{detail:r,cancelable:n});document.dispatchEvent(a),n&&a.defaultPrevented&&(s=!1)}catch(a){console.error(`[tours] could not dispatch "tours:${e}"`,a)}return s}const Vt="[data-tours-editor]";function K(){return typeof document<"u"&&document.querySelector(Vt)!==null}function A(t,e={}){const r=O("player"),n=e.state;let s=null,i=null,a=null,d=null,g=null,f=null,h=null,m=!1,c=0,C=0,y=null;const l=t.display?.padding??Ot,b=t.display?.radius??Ut,E=t.display?.cardRadius??Mt,Y=t.display?.offset??Ft;function J(o){return z(o.selectors)}function Z(o){return o.action?.type==="click"}function qt(o){if(!o.condition)return!0;const u=n?F(n,t.id):0;return ht(o.condition,{url:window.location.href,traits:e.viewer?.(),device:V(),firstVisit:u===0,seenCount:u})}function P(o){return N(o.pageUrl,window.location.href)}function $(){n&&R(n,{tourId:t.id,index:c})}function Ct(){if(s)return;s=document.createElement("div"),s.setAttribute("data-tours-player",""),i=s.attachShadow({mode:"open"});const o=document.createElement("style");o.textContent=Nt+dt,i.appendChild(o),g=document.createElement("div"),g.className="tours-backdrop",g.addEventListener("click",u=>{const w=t.steps[c],x=w?J(w):null;if(x){const v=x.getBoundingClientRect();if(u.clientX>=v.left-l&&u.clientX<=v.right+l&&u.clientY>=v.top-l&&u.clientY<=v.bottom+l)return}_()}),i.appendChild(g),a=document.createElement("div"),a.className="tours-spotlight",a.style.borderRadius=`${b}px`,i.appendChild(a),document.body.appendChild(s)}function Gt(o){if(!g)return;if(!o){g.style.clipPath="";return}const u=o.left-l,w=o.top-l,x=o.right+l,v=o.bottom+l;g.style.clipPath=`polygon(0 0, 0 100%, ${u}px 100%, ${u}px ${w}px, ${x}px ${w}px, ${x}px ${v}px, ${u}px ${v}px, ${u}px 100%, 100% 100%, 100% 0)`}function St(o){return o.overlay!==!1}function Kt(o){const u=St(o);g&&(g.style.display=u?"":"none"),a?.classList.toggle("tours-spotlight--plain",!u)}function kt(o,u=!1){a&&(a.style.transitionDuration=u?"0ms":"",a.style.display="block",a.style.left=`${o.left-l}px`,a.style.top=`${o.top-l}px`,a.style.width=`${o.width+l*2}px`,a.style.height=`${o.height+l*2}px`)}function _t(o,u){if(!d)return;const w={top:o.top-l,left:o.left-l,right:o.right+l,bottom:o.bottom+l,width:o.width+l*2,height:o.height+l*2},{top:x,left:v}=ct({target:w,card:{width:d.offsetWidth,height:d.offsetHeight},side:u.placement??"bottom",align:u.align??"center",offset:Y,alignOffset:t.display?.alignOffset??0,viewport:{width:window.innerWidth,height:window.innerHeight}});d.style.left=`${v}px`,d.style.top=`${x}px`}function Jt(o){const u=Math.max(1,t.steps.length-C),w=Math.max(1,Math.min(c+1-C,u));d&&d.remove();const x=c===t.steps.length-1,v=t.steps[c-1],I=!!v&&P(v),ne=!Z(o)||x;d=ut({contentText:o.content.default,progress:`Step ${w} of ${u}`,showClose:!0,onClose:te,radius:E,back:I?{label:o.backLabel??"Back",onClick:rt}:void 0,next:ne?{label:o.nextLabel??(x?"Done":"Next"),primary:!0,onClick:nt}:void 0}),i?.appendChild(d)}function k(){if(!m)return;const o=t.steps[c];if(!o){_();return}if(r.log("render step",c,o.id),!qt(o)){r.log(`step "${o.id}" skipped: condition not met`),S(e.on,"stepSkipped",{tour:t,index:c,step:o,reason:"condition"}),C+=1,c<t.steps.length-1?(c+=1,k()):_(C>=t.steps.length?"dismissed":"completed");return}const u=J(o);if(!u){r.log(`step "${o.id}" target not found yet — waiting`,o.selectors),j(o.selectors,{timeout:4e3}).then(x=>{!m||t.steps[c]!==o||(x?k():(r.warn(`step "${o.id}" skipped: no element for selectors`,o.selectors),S(e.on,"stepSkipped",{tour:t,index:c,step:o,reason:"no-element"}),C+=1,c<t.steps.length-1?(c+=1,k()):_()))});return}Ct(),u.scrollIntoView({behavior:"smooth",block:"center",inline:"center"}),Jt(o);const w=u.getBoundingClientRect();kt(w),_t(w,o),Kt(o),Gt(St(o)&&Z(o)?w:null),Zt(o),S(e.on,"stepActivated",{tour:t,index:c,step:o,target:u})}function Zt(o){if(f?.(),f=null,!Z(o))return;const u=c+1,w=t.steps[u];!w||P(w)||(f=q(()=>{!m||t.steps[c]!==o||N(w.pageUrl,window.location.href)&&et(u)&&(f?.(),f=null,r.log("visitor navigated → advancing to",w.id),c=u,$(),k())}))}function $t(o){m&&(o.key==="Escape"?(o.preventDefault(),_()):o.key==="ArrowRight"?nt():o.key==="ArrowLeft"&&rt())}function H(){if(!m)return;const o=t.steps[c];if(!o)return;const u=J(o);if(!u)return;const w=u.getBoundingClientRect();kt(w,!0),_t(w,o)}function Lt(o=0){if(m||t.steps.length===0)return;if(!e.allowWhileEditing&&K()){r.log(`start suppressed for "${t.id}" — the builder is mounted`);return}const u=Math.max(0,Math.min(o,t.steps.length-1));if(!S(e.on,"tourStarting",{tour:t,index:u})){r.log("start vetoed by handler");return}tt(),m=!0,c=u,C=0,r.log("start",t.id,`at ${c}/${t.steps.length}`),Ct(),window.addEventListener("keydown",$t,!0),window.addEventListener("resize",H,!0),window.addEventListener("scroll",H,!0),$(),S(e.on,"tourStarted",{tour:t,index:c}),k()}function Qt(){a&&(a.style.display="none"),d&&(d.remove(),d=null)}function B(){Qt(),!y&&(y=q(()=>{if(!m){y?.(),y=null;return}const o=t.steps[c];o&&P(o)&&(y?.(),y=null,k())}))}function Q(){y&&(y(),y=null),f&&(f(),f=null),m&&(m=!1,window.removeEventListener("keydown",$t,!0),window.removeEventListener("resize",H,!0),window.removeEventListener("scroll",H,!0),s&&s.parentNode&&s.parentNode.removeChild(s),s=null,i=null,a=null,d=null,g=null)}function _(o="dismissed"){r.log("stop",o);const u=m,w=c;tt(),Q(),n&&M(n),u&&(o==="completed"?S(e.on,"tourCompleted",{tour:t}):S(e.on,"tourDismissed",{tour:t,index:w}))}function tt(){h?.(),h=null}function te(){t.dismiss?.mode==="minimize"?Tt():_()}function Tt(){m&&(r.log("minimized",t.id,`at ${c}`),Q(),n&&R(n,{tourId:t.id,index:c,minimized:!0}),S(e.on,"tourMinimized",{tour:t,index:c}),ee())}function ee(){tt();const o=t.dismiss?.resume;h=xt({tourId:t.id,text:o?.text??"Carry on with the tour?",button:o?.button??"Resume",corner:o?.corner,offset:o?.offset,onResume:()=>{h=null,n&&R(n,{tourId:t.id,index:c}),S(e.on,"tourResumed",{tour:t,index:c}),Lt(c)}},e.renderResume)}function et(o){const u=t.steps[o];return u?S(e.on,"stepChanging",{tour:t,from:c,to:o,step:u}):!0}function nt(){if(!m)return;const o=c+1,u=t.steps[o];if(!u){_("completed");return}if(!et(o)){r.log("step change vetoed by handler");return}if(P(u)){c=o,$(),k();return}c=o,$();const w=I=>{Q(),e.onNavigate?e.onNavigate(I,u.id):window.location.assign(I)},x=t.steps[c-1]?.action;if(x&&x.type==="navigate"&&x.url){x.url.startsWith("#")?(r.log("page transition (hash navigate) → resume at",c),B(),window.location.hash=x.url):(r.log("page transition (navigate) → resume at",c),w(x.url));return}const v=ft(u.pageUrl);if(v){v.startsWith("#")?(r.log("page transition (derived hash) → resume at",c),B(),window.location.hash=v):(r.log("page transition (derived navigate) → resume at",c,v),w(v));return}r.log("page transition (wait) → resume at",c),B()}function rt(){if(!m)return;const o=t.steps[c-1];if(o){if(!et(c-1)){r.log("step change vetoed by handler");return}if(P(o)){c-=1,$(),k();return}c-=1,$(),r.log("page transition back → resume at",c),B(),window.history.back()}}return{start:Lt,stop:_,next:nt,prev:rt,minimize:Tt,isActive:()=>m}}function vt(t,e={}){const r=e.state;if(!r)return null;const n=G(r);if(!n||n.tourId!==t.id)return null;if(!t.steps[n.index])return M(r),null;let s=-1;for(let a=n.index;a<t.steps.length;a++)if(N(t.steps[a].pageUrl,window.location.href)){s=a;break}if(s===-1)return null;const i=A(t,e);return i.start(s),i}function Et(t,e){if(K())return()=>{};const r=t.trigger??{type:"manual"};let n=!1;const s=()=>{n||(n=!0,e())};switch(r.type){case"load":{const i=setTimeout(s,0);return()=>clearTimeout(i)}case"timer":{const i=setTimeout(s,Math.max(0,r.delay));return()=>clearTimeout(i)}case"selector":{let i=!1;return j([r.selector],{timeout:0}).then(a=>{a&&!i&&s()}),()=>{i=!0}}case"cta":{let i=()=>{};return i=yt({text:r.text,button:r.button,corner:r.corner,offset:r.offset,onStart:s}),i}case"manual":default:return()=>{}}}function Xt(t,e={}){const r=O("mount"),n=e.state,s=()=>typeof t=="function"?t():t;let i=null,a=[],d=null;function g(){for(const c of a)c();a=[],d?.(),d=null}function f(c){return!e.canRun||e.canRun(c)}function h(){if(i?.isActive())return;i=null,g();const c=n?G(n):null;if(n&&c?.minimized){const l=s().find(b=>b.id===c.tourId&&f(b));if(l){const b=l.dismiss?.resume;d=xt({tourId:l.id,text:b?.text??"Carry on with the tour?",button:b?.button??"Resume",corner:b?.corner,offset:b?.offset,onResume:()=>{d=null,R(n,{tourId:l.id,index:c.index});const E=A(l,e);i=E,E.start(c.index)}},e.renderResume);return}}if(n)for(const l of s()){if(!f(l))continue;const b=vt(l,e);if(b){r.log("resumed",l.id),i=b;return}}const C=V(),y=e.viewer?.();for(const l of s()){if(!f(l)||!l.trigger||l.trigger.type==="manual")continue;const b=n?F(n,l.id):0;gt(l.rules,{url:window.location.href,traits:y,device:C,firstVisit:b===0,seenCount:b})&&a.push(Et(l,()=>{n&&wt(n,l.id);const Y=A(l,e);i=Y,Y.start()}))}}h();const m=q(h);return{start(c){const C=s().find(l=>l.id===c);if(!C||!f(C))return!1;i?.stop(),g(),n&&M(n);const y=A(C,e);return i=y,y.start(),!0},stop(){i?.stop(),i=null},unmount(){m(),g(),i?.stop(),i=null}}}p.CARD_STYLES=dt,p.PROGRESS_KEY=U,p.armTrigger=Et,p.autoSide=at,p.buildSelectors=it,p.clearProgress=M,p.createLocalState=Bt,p.createLogger=O,p.createPicker=Dt,p.createPlayer=A,p.deriveUrl=ft,p.detectDevice=V,p.isBuilderMounted=K,p.isLoggingEnabled=D,p.markSeen=wt,p.matchRules=gt,p.matchUrl=N,p.matchesCondition=ht,p.mountTours=Xt,p.placeCard=ct,p.readProgress=G,p.renderCard=ut,p.resolveElement=z,p.resumeTour=vt,p.seenCount=F,p.waitForElement=j,p.writeProgress=R,Object.defineProperty(p,Symbol.toStringTag,{value:"Module"})}));
//# sourceMappingURL=index.umd.js.map
