(function(m,L){typeof exports=="object"&&typeof module<"u"?L(exports):typeof define=="function"&&define.amd?define(["exports"],L):(m=typeof globalThis<"u"?globalThis:m||self,L(m.ToursCore={}))})(this,(function(m){"use strict";const L=`
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
`;function Y(t){return JSON.stringify(t)}function $t(t){return/^[a-zA-Z][\w-]*$/.test(t)&&t.length<=30&&!/\d{2,}/.test(t)&&!/^(css-|sc-|jsx-|emotion-|_|is-|has-)/.test(t)}function nt(t){const e=[];let r=t;for(;r&&r!==document.body&&r.nodeType===1;){const n=r.tagName.toLowerCase(),i=r.parentElement;if(!i){e.unshift(n);break}const s=Array.from(i.children).filter(a=>a.tagName===r.tagName);e.unshift(s.length>1?`${n}:nth-of-type(${s.indexOf(r)+1})`:n),r=i}return`body > ${e.join(" > ")}`}function Lt(t){let e=t.parentElement;for(;e&&e!==document.body&&!e.id;)e=e.parentElement;if(!e||!e.id)return null;const r=[];let n=t;for(;n&&n!==e;){const i=n.tagName.toLowerCase(),s=n.parentElement;if(!s)return null;const a=Array.from(s.children).filter(u=>u.tagName===n.tagName);r.unshift(a.length>1?`${i}:nth-of-type(${a.indexOf(n)+1})`:i),n=s}return`#${CSS.escape(e.id)} > ${r.join(" > ")}`}const Tt=["data-testid","data-test","data-test-id","data-cy","data-qa","data-id","data-name"];function rt(t){const e=[],r=new Set,n=t.tagName.toLowerCase(),i=d=>{if(!(!d||r.has(d)))try{document.querySelector(d)===t&&(r.add(d),e.push(d))}catch{}};t.id&&i(`#${CSS.escape(t.id)}`);for(const d of Tt){const p=t.getAttribute(d);p&&i(`${n}[${d}=${Y(p)}]`)}const s=t.getAttribute("name");s&&i(`${n}[name=${Y(s)}]`);const a=t.getAttribute("aria-label");a&&i(`[aria-label=${Y(a)}]`);const u=Array.from(t.classList).filter($t);u.length&&i(`${n}.${u.map(d=>CSS.escape(d)).join(".")}`);for(const d of u)i(`${n}.${CSS.escape(d)}`);i(Lt(t)),i(nt(t));const b=(t.textContent??"").replace(/\s+/g," ").trim();if(b&&b.length<=50&&/^(a|button|summary|label|h[1-6])$/.test(n)){const d=`text=${b}`;r.has(d)||(r.add(d),e.push(d))}return e.length===0&&e.push(nt(t)),e}const Nt="a, button, summary, label, h1, h2, h3, h4, h5, h6";function ot(t,e){return!(t instanceof Element)||!t.isConnected||e!==document&&e instanceof Node&&!e.contains(t)?null:t}function Rt(t,e){if(typeof t=="function"){let r;try{r=t()}catch{return null}return ot(r,e)}if(typeof t!="string")return ot(t,e);if(t.startsWith("text=")){const r=t.slice(5).trim();for(const n of Array.from(e.querySelectorAll(Nt)))if((n.textContent??"").replace(/\s+/g," ").trim()===r)return n;return null}try{return e.querySelector(t)}catch{return null}}function I(t,e=document){for(const r of t){const n=Rt(r,e);if(n)return n}return null}function H(t,e={}){const r=e.root??document,n=I(t,r);return n?Promise.resolve(n):new Promise(i=>{let s=!1,a;const u=p=>{s||(s=!0,b.disconnect(),a&&clearTimeout(a),i(p))},b=new MutationObserver(()=>{const p=I(t,r);p&&u(p)});b.observe(document.documentElement,{childList:!0,subtree:!0,attributes:!0});const d=e.timeout??4e3;d>0&&Number.isFinite(d)&&(a=setTimeout(()=>u(null),d))})}let T=null;function z(){if(T!==null)return T;try{T=new URLSearchParams(window.location.search).has("use_logs")}catch{T=!1}return T}function D(t){const e=`[tours:${t}]`;return{log:(...r)=>{z()&&console.log(e,...r)},warn:(...r)=>{z()&&console.warn(e,...r)},error:(...r)=>{z()&&console.error(e,...r)}}}function At(t,e={}){const r=D("picker");let n=null,i=null,s=null,a=!1;function u(l){if(l===n)return!0;for(const w of e.ignore??[])if(w&&w.contains(l))return!0;return!1}function b(){if(n)return;n=document.createElement("div"),n.setAttribute("data-tours-picker",""),i=n.attachShadow({mode:"open"});const l=document.createElement("style");l.textContent=L,i.appendChild(l),s=document.createElement("div"),s.className="tours-picker-overlay",s.style.display="none",i.appendChild(s);const w=document.createElement("div");w.className="tours-picker-hint",w.textContent="Hover and click an element • Esc to cancel",i.appendChild(w),document.body.appendChild(n)}function d(l,w){const E=document.elementFromPoint(l,w);return!E||u(E)?null:E}function p(l){if(!a||!s)return;const w=d(l.clientX,l.clientY);if(!w){s.style.display="none";return}const E=w.getBoundingClientRect();s.style.display="block",s.style.left=`${E.left}px`,s.style.top=`${E.top}px`,s.style.width=`${E.width}px`,s.style.height=`${E.height}px`}function g(l){if(!a)return;const w=d(l.clientX,l.clientY);if(l.preventDefault(),l.stopPropagation(),!w)return;const E=rt(w);r.log("picked",E),h(),t(E)}function c(l){l.key==="Escape"&&(l.preventDefault(),h())}function S(){a||(a=!0,r.log("start"),b(),document.addEventListener("mousemove",p,!0),document.addEventListener("click",g,!0),document.addEventListener("keydown",c,!0))}function h(){a&&(a=!1,document.removeEventListener("mousemove",p,!0),document.removeEventListener("click",g,!0),document.removeEventListener("keydown",c,!0),n&&n.parentNode&&n.parentNode.removeChild(n),n=null,i=null,s=null)}return{start:S,stop:h}}const Pt=6,It=6,zt=10,Dt=12;function it(t,e,r){const n={top:t.top,bottom:r.height-t.bottom,left:t.left,right:r.width-t.right},i={top:e.height,bottom:e.height,left:e.width,right:e.width},s=["bottom","top","right","left"],a=s.find(u=>n[u]>=i[u]+8);return a||s.reduce((u,b)=>n[b]>n[u]?b:u,s[0])}function st(t){const{target:e,card:r,offset:n,viewport:i}=t,s=t.side==="auto",a=s?it(e,r,i):t.side,u=s?"center":t.align,b=t.alignOffset??0,d=u==="start"?b:u==="end"?-b:0;let p=0,g=0;return a==="top"||a==="bottom"?(p=a==="top"?e.top-r.height-n:e.bottom+n,g=u==="start"?e.left:u==="end"?e.right-r.width:e.left+e.width/2-r.width/2,g+=d):(g=a==="left"?e.left-r.width-n:e.right+n,p=u==="start"?e.top:u==="end"?e.bottom-r.height:e.top+e.height/2-r.height/2,p+=d),g=Math.max(8,Math.min(g,i.width-r.width-8)),p=Math.max(8,Math.min(p,i.height-r.height-8)),{top:p,left:g}}function at(t){const e=document.createElement("button");return e.type="button",e.className=`tours-card__btn${t.primary?" tours-card__btn--primary":""}${t.disabled?" tours-card__btn--disabled":""}`,e.textContent=t.label,!t.disabled&&t.onClick&&e.addEventListener("click",t.onClick),e}function ct(t){const e=document.createElement("div");if(e.className=`tours-card${t.ghost?" tours-card--ghost":""}`,t.radius!=null&&(e.style.borderRadius=`${t.radius}px`),t.showClose){const n=document.createElement("button");n.className="tours-card__close",n.type="button",n.textContent="×",n.setAttribute("aria-label","Close"),t.onClose&&n.addEventListener("click",t.onClose),e.appendChild(n)}const r=document.createElement("div");if(r.className="tours-card__content",t.contentHtml!=null?r.innerHTML=t.contentHtml:r.textContent=t.contentText??"",e.appendChild(r),t.back||t.next||t.progress){const n=document.createElement("div");if(n.className="tours-card__footer",t.back&&n.appendChild(at(t.back)),t.progress){const i=document.createElement("span");i.className="tours-card__progress",i.textContent=t.progress,n.appendChild(i)}t.next&&n.appendChild(at(t.next)),e.appendChild(n)}return e}const lt=`
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
`;function Ut(t){const e=t.replace(/[.+^${}()|[\]\\]/g,"\\$&").replace(/\*\*/g,"\0").replace(/\*/g,"[^/]*").replace(/ /g,".*").replace(/\?/g,".");return new RegExp(`^${e}$`)}function N(t,e){if(!t)return!0;if(t.regex)try{return new RegExp(t.regex).test(e)}catch{return!1}if(t.glob)try{return Ut(t.glob).test(e)}catch{return!1}return!0}function ut(t){if(!t||!t.glob)return null;const e=t.glob.replace(/\*+/g,"");return/^https?:\/\//i.test(e)||e.startsWith("#")||e.startsWith("/")?e:null}const B="tours:locationchange";let dt=!1;function Mt(){if(!dt){dt=!0;for(const t of["pushState","replaceState"]){const e=history[t];history[t]=function(...n){const i=e.apply(this,n);return window.dispatchEvent(new Event(B)),i}}}}function W(t){return Mt(),window.addEventListener("popstate",t),window.addEventListener("hashchange",t),window.addEventListener(B,t),()=>{window.removeEventListener("popstate",t),window.removeEventListener("hashchange",t),window.removeEventListener(B,t)}}const U="tours:progress";function Ot(){return{get(t){try{return localStorage.getItem(t)}catch{return null}},set(t,e){try{localStorage.setItem(t,e)}catch{}},remove(t){try{localStorage.removeItem(t)}catch{}}}}function j(t){const e=t.get(U);if(!e)return null;try{const r=JSON.parse(e);if(typeof r?.tourId=="string"&&typeof r?.index=="number")return r}catch{}return null}function R(t,e){t.set(U,JSON.stringify(e))}function V(t){t.remove(U)}const ft="tours:seen:";function X(t,e){const r=t.get(ft+e),n=r?parseInt(r,10):0;return Number.isNaN(n)?0:n}function pt(t,e){t.set(ft+e,String(X(t,e)+1))}const Ft=`
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
`;function ht(t,e){return e?e(t):mt({text:t.text,button:t.button,corner:t.corner,offset:t.offset,onStart:t.onResume})}function mt(t){const e=t.corner??"bottom-right",r=t.offset??24,n=document.createElement("div");n.setAttribute("data-tours-cta","");const i=n.attachShadow({mode:"open"}),s=document.createElement("style");s.textContent=Ft,i.appendChild(s);const a=document.createElement("div");a.className="cta";const[u,b]=e.split("-");a.style[u]=`${r}px`,a.style[b]=`${r}px`;const d=()=>{n.parentNode&&n.parentNode.removeChild(n)},p=document.createElement("button");p.className="cta__close",p.type="button",p.textContent="×",p.setAttribute("aria-label","Dismiss"),p.addEventListener("click",d);const g=document.createElement("p");g.className="cta__text",g.textContent=t.text;const c=document.createElement("button");return c.className="cta__btn",c.type="button",c.textContent=t.button,c.addEventListener("click",()=>{d(),t.onStart()}),a.append(p,g,c),i.appendChild(a),document.body.appendChild(n),d}const Yt=new Set(["tourStarting","stepChanging"]);function C(t,e,r){const n=Yt.has(e);let i=!0;const s=t?.[e];if(s)try{s(r)===!1&&n&&(i=!1)}catch(a){console.error(`[tours] handler for "${e}" threw`,a)}if(typeof document<"u"&&typeof CustomEvent=="function")try{const a=new CustomEvent(`tours:${e}`,{detail:r,cancelable:n});document.dispatchEvent(a),n&&a.defaultPrevented&&(i=!1)}catch(a){console.error(`[tours] could not dispatch "tours:${e}"`,a)}return i}const Ht="[data-tours-editor]";function q(){return typeof document<"u"&&document.querySelector(Ht)!==null}function M(t,e={}){const r=D("player"),n=e.state;let i=null,s=null,a=null,u=null,b=null,d=null,p=null,g=!1,c=0,S=0,h=null;const l=t.display?.padding??Pt,w=t.display?.radius??It,E=t.display?.cardRadius??zt,jt=t.display?.offset??Dt;function G(o){return I(o.selectors)}function K(o){return o.action?.type==="click"}function A(o){return N(o.pageUrl,window.location.href)}function $(){n&&R(n,{tourId:t.id,index:c})}function vt(){if(i)return;i=document.createElement("div"),i.setAttribute("data-tours-player",""),s=i.attachShadow({mode:"open"});const o=document.createElement("style");o.textContent=_t+lt,s.appendChild(o),b=document.createElement("div"),b.className="tours-backdrop",b.addEventListener("click",f=>{const x=t.steps[c],v=x?G(x):null;if(v){const y=v.getBoundingClientRect();if(f.clientX>=y.left-l&&f.clientX<=y.right+l&&f.clientY>=y.top-l&&f.clientY<=y.bottom+l)return}_()}),s.appendChild(b),a=document.createElement("div"),a.className="tours-spotlight",a.style.borderRadius=`${w}px`,s.appendChild(a),document.body.appendChild(i)}function Vt(o){if(!b)return;if(!o){b.style.clipPath="";return}const f=o.left-l,x=o.top-l,v=o.right+l,y=o.bottom+l;b.style.clipPath=`polygon(0 0, 0 100%, ${f}px 100%, ${f}px ${x}px, ${v}px ${x}px, ${v}px ${y}px, ${f}px ${y}px, ${f}px 100%, 100% 100%, 100% 0)`}function yt(o,f=!1){a&&(a.style.transitionDuration=f?"0ms":"",a.style.display="block",a.style.left=`${o.left-l}px`,a.style.top=`${o.top-l}px`,a.style.width=`${o.width+l*2}px`,a.style.height=`${o.height+l*2}px`)}function Et(o,f){if(!u)return;const x={top:o.top-l,left:o.left-l,right:o.right+l,bottom:o.bottom+l,width:o.width+l*2,height:o.height+l*2},{top:v,left:y}=st({target:x,card:{width:u.offsetWidth,height:u.offsetHeight},side:f.placement??"bottom",align:f.align??"center",offset:jt,alignOffset:t.display?.alignOffset??0,viewport:{width:window.innerWidth,height:window.innerHeight}});u.style.left=`${y}px`,u.style.top=`${v}px`}function Xt(o){const f=Math.max(1,t.steps.length-S),x=Math.max(1,Math.min(c+1-S,f));u&&u.remove();const v=c===t.steps.length-1,y=t.steps[c-1],P=!!y&&A(y),Zt=!K(o)||v;u=ct({contentText:o.content.default,progress:`Step ${x} of ${f}`,showClose:!0,onClose:Kt,radius:E,back:P?{label:o.backLabel??"Back",onClick:et}:void 0,next:Zt?{label:o.nextLabel??(v?"Done":"Next"),primary:!0,onClick:tt}:void 0}),s?.appendChild(u)}function k(){if(!g)return;const o=t.steps[c];if(!o){_();return}r.log("render step",c,o.id);const f=G(o);if(!f){r.log(`step "${o.id}" target not found yet — waiting`,o.selectors),H(o.selectors,{timeout:4e3}).then(v=>{!g||t.steps[c]!==o||(v?k():(r.warn(`step "${o.id}" skipped: no element for selectors`,o.selectors),C(e.on,"stepSkipped",{tour:t,index:c,step:o,reason:"no-element"}),S+=1,c<t.steps.length-1?(c+=1,k()):_()))});return}vt(),f.scrollIntoView({behavior:"smooth",block:"center",inline:"center"}),Xt(o);const x=f.getBoundingClientRect();yt(x),Et(x,o),Vt(K(o)?x:null),qt(o),C(e.on,"stepActivated",{tour:t,index:c,step:o,target:f})}function qt(o){if(d?.(),d=null,!K(o))return;const f=c+1,x=t.steps[f];!x||A(x)||(d=W(()=>{!g||t.steps[c]!==o||N(x.pageUrl,window.location.href)&&Q(f)&&(d?.(),d=null,r.log("visitor navigated → advancing to",x.id),c=f,$(),k())}))}function Ct(o){g&&(o.key==="Escape"?(o.preventDefault(),_()):o.key==="ArrowRight"?tt():o.key==="ArrowLeft"&&et())}function O(){if(!g)return;const o=t.steps[c];if(!o)return;const f=G(o);if(!f)return;const x=f.getBoundingClientRect();yt(x,!0),Et(x,o)}function St(o=0){if(g||t.steps.length===0)return;if(!e.allowWhileEditing&&q()){r.log(`start suppressed for "${t.id}" — the builder is mounted`);return}const f=Math.max(0,Math.min(o,t.steps.length-1));if(!C(e.on,"tourStarting",{tour:t,index:f})){r.log("start vetoed by handler");return}Z(),g=!0,c=f,S=0,r.log("start",t.id,`at ${c}/${t.steps.length}`),vt(),window.addEventListener("keydown",Ct,!0),window.addEventListener("resize",O,!0),window.addEventListener("scroll",O,!0),$(),C(e.on,"tourStarted",{tour:t,index:c}),k()}function Gt(){a&&(a.style.display="none"),u&&(u.remove(),u=null)}function F(){Gt(),!h&&(h=W(()=>{if(!g){h?.(),h=null;return}const o=t.steps[c];o&&A(o)&&(h?.(),h=null,k())}))}function J(){h&&(h(),h=null),d&&(d(),d=null),g&&(g=!1,window.removeEventListener("keydown",Ct,!0),window.removeEventListener("resize",O,!0),window.removeEventListener("scroll",O,!0),i&&i.parentNode&&i.parentNode.removeChild(i),i=null,s=null,a=null,u=null,b=null)}function _(o="dismissed"){r.log("stop",o);const f=g,x=c;Z(),J(),n&&V(n),f&&(o==="completed"?C(e.on,"tourCompleted",{tour:t}):C(e.on,"tourDismissed",{tour:t,index:x}))}function Z(){p?.(),p=null}function Kt(){t.dismiss?.mode==="minimize"?kt():_()}function kt(){g&&(r.log("minimized",t.id,`at ${c}`),J(),n&&R(n,{tourId:t.id,index:c,minimized:!0}),C(e.on,"tourMinimized",{tour:t,index:c}),Jt())}function Jt(){Z();const o=t.dismiss?.resume;p=ht({tourId:t.id,text:o?.text??"Carry on with the tour?",button:o?.button??"Resume",corner:o?.corner,offset:o?.offset,onResume:()=>{p=null,n&&R(n,{tourId:t.id,index:c}),C(e.on,"tourResumed",{tour:t,index:c}),St(c)}},e.renderResume)}function Q(o){const f=t.steps[o];return f?C(e.on,"stepChanging",{tour:t,from:c,to:o,step:f}):!0}function tt(){if(!g)return;const o=c+1,f=t.steps[o];if(!f){_("completed");return}if(!Q(o)){r.log("step change vetoed by handler");return}if(A(f)){c=o,$(),k();return}c=o,$();const x=P=>{J(),e.onNavigate?e.onNavigate(P,f.id):window.location.assign(P)},v=t.steps[c-1]?.action;if(v&&v.type==="navigate"&&v.url){v.url.startsWith("#")?(r.log("page transition (hash navigate) → resume at",c),F(),window.location.hash=v.url):(r.log("page transition (navigate) → resume at",c),x(v.url));return}const y=ut(f.pageUrl);if(y){y.startsWith("#")?(r.log("page transition (derived hash) → resume at",c),F(),window.location.hash=y):(r.log("page transition (derived navigate) → resume at",c,y),x(y));return}r.log("page transition (wait) → resume at",c),F()}function et(){if(!g)return;const o=t.steps[c-1];if(o){if(!Q(c-1)){r.log("step change vetoed by handler");return}if(A(o)){c-=1,$(),k();return}c-=1,$(),r.log("page transition back → resume at",c),F(),window.history.back()}}return{start:St,stop:_,next:tt,prev:et,minimize:kt,isActive:()=>g}}function gt(t,e={}){const r=e.state;if(!r)return null;const n=j(r);if(!n||n.tourId!==t.id)return null;if(!t.steps[n.index])return V(r),null;let i=-1;for(let a=n.index;a<t.steps.length;a++)if(N(t.steps[a].pageUrl,window.location.href)){i=a;break}if(i===-1)return null;const s=M(t,e);return s.start(i),s}function bt(t,e){if(q())return()=>{};const r=t.trigger??{type:"manual"};let n=!1;const i=()=>{n||(n=!0,e())};switch(r.type){case"load":{const s=setTimeout(i,0);return()=>clearTimeout(s)}case"timer":{const s=setTimeout(i,Math.max(0,r.delay));return()=>clearTimeout(s)}case"selector":{let s=!1;return H([r.selector],{timeout:0}).then(a=>{a&&!s&&i()}),()=>{s=!0}}case"cta":{let s=()=>{};return s=mt({text:r.text,button:r.button,corner:r.corner,offset:r.offset,onStart:i}),s}case"manual":default:return()=>{}}}function xt(t=window.innerWidth){return t<=640?"mobile":t<=1024?"tablet":"desktop"}function Bt(t,e){return!(t.url&&!N(t.url,e.url)||t.role!==void 0&&t.role!==e.role||t.firstVisitOnly&&!e.firstVisit||t.device&&t.device!==e.device||t.unlessSeen&&e.seenCount>0||t.maxShows!==void 0&&e.seenCount>=t.maxShows)}function wt(t,e){return!t||t.length===0?!0:t.some(r=>Bt(r.when,e))}function Wt(t,e={}){const r=D("mount"),n=e.state,i=()=>typeof t=="function"?t():t;let s=null,a=[],u=null;function b(){for(const c of a)c();a=[],u?.(),u=null}function d(c){return!e.canRun||e.canRun(c)}function p(){if(s?.isActive())return;s=null,b();const c=n?j(n):null;if(n&&c?.minimized){const h=i().find(l=>l.id===c.tourId&&d(l));if(h){const l=h.dismiss?.resume;u=ht({tourId:h.id,text:l?.text??"Carry on with the tour?",button:l?.button??"Resume",corner:l?.corner,offset:l?.offset,onResume:()=>{u=null,R(n,{tourId:h.id,index:c.index});const w=M(h,e);s=w,w.start(c.index)}},e.renderResume);return}}if(n)for(const h of i()){if(!d(h))continue;const l=gt(h,e);if(l){r.log("resumed",h.id),s=l;return}}const S=xt();for(const h of i()){if(!d(h)||!h.trigger||h.trigger.type==="manual")continue;const l=n?X(n,h.id):0;wt(h.rules,{url:window.location.href,device:S,firstVisit:l===0,seenCount:l})&&a.push(bt(h,()=>{n&&pt(n,h.id);const E=M(h,e);s=E,E.start()}))}}p();const g=W(p);return()=>{g(),b(),s?.stop(),s=null}}m.CARD_STYLES=lt,m.PROGRESS_KEY=U,m.armTrigger=bt,m.autoSide=it,m.buildSelectors=rt,m.clearProgress=V,m.createLocalState=Ot,m.createLogger=D,m.createPicker=At,m.createPlayer=M,m.deriveUrl=ut,m.detectDevice=xt,m.isBuilderMounted=q,m.isLoggingEnabled=z,m.markSeen=pt,m.matchRules=wt,m.matchUrl=N,m.mountTours=Wt,m.placeCard=st,m.readProgress=j,m.renderCard=ct,m.resolveElement=I,m.resumeTour=gt,m.seenCount=X,m.waitForElement=H,m.writeProgress=R,Object.defineProperty(m,Symbol.toStringTag,{value:"Module"})}));
//# sourceMappingURL=index.umd.js.map
