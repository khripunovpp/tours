(function(v,C){typeof exports=="object"&&typeof module<"u"?C(exports):typeof define=="function"&&define.amd?define(["exports"],C):(v=typeof globalThis<"u"?globalThis:v||self,C(v.SiteToursFront={}))})(this,(function(v){"use strict";const C=`
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
`,Rt="a, button, summary, label, h1, h2, h3, h4, h5, h6";function j(t,e){return!(t instanceof Element)||!t.isConnected||e!==document&&e instanceof Node&&!e.contains(t)?null:t}function At(t,e){if(typeof t=="function"){let n;try{n=t()}catch{return null}return j(n,e)}if(typeof t!="string")return j(t,e);if(t.startsWith("text=")){const n=t.slice(5).trim();for(const o of Array.from(e.querySelectorAll(Rt)))if((o.textContent??"").replace(/\s+/g," ").trim()===n)return o;return null}try{return e.querySelector(t)}catch{return null}}function M(t,e=document){for(const n of t){const o=At(n,e);if(o)return o}return null}function J(t,e={}){const n=e.root??document,o=M(t,n);return o?Promise.resolve(o):new Promise(i=>{let u=!1,a;const c=g=>{u||(u=!0,b.disconnect(),a&&clearTimeout(a),i(g))},b=new MutationObserver(()=>{const g=M(t,n);g&&c(g)});b.observe(document.documentElement,{childList:!0,subtree:!0,attributes:!0});const h=e.timeout??4e3;h>0&&Number.isFinite(h)&&(a=setTimeout(()=>c(null),h))})}let L=null;function V(){if(L!==null)return L;try{L=new URLSearchParams(window.location.search).has("use_logs")}catch{L=!1}return L}function K(t){const e=`[tours:${t}]`;return{log:(...n)=>{V()&&console.log(e,...n)},warn:(...n)=>{V()&&console.warn(e,...n)},error:(...n)=>{V()&&console.error(e,...n)}}}const Q=6,Z=6,tt=10,et=12,Nt=1;function w(t){return typeof t=="object"&&t!==null&&!Array.isArray(t)}function nt(t){return w(t)&&typeof t.default=="string"}const ot=["top","bottom","left","right","auto"],rt=["start","center","end"],it=["mobile","tablet","desktop"],st=["click","input","navigate","none"];function at(t,e,n){if(!w(t)){n.push(`${e} must be an object`);return}const o=typeof t.glob=="string"&&t.glob.length>0,i=typeof t.regex=="string"&&t.regex.length>0;if(!o&&!i&&n.push(`${e} must have a non-empty "glob" or "regex"`),i)try{new RegExp(t.regex)}catch{n.push(`${e}.regex is not a valid regular expression`)}}function ut(t,e,n){if(!w(t)){n.push(`${e} must be an object`);return}t.url!==void 0&&at(t.url,`${e}.url`,n),t.role!==void 0&&typeof t.role!="string"&&n.push(`${e}.role must be a string`),t.firstVisitOnly!==void 0&&typeof t.firstVisitOnly!="boolean"&&n.push(`${e}.firstVisitOnly must be a boolean`),t.device!==void 0&&!it.includes(t.device)&&n.push(`${e}.device must be one of ${it.join("|")}`),t.unlessSeen!==void 0&&typeof t.unlessSeen!="boolean"&&n.push(`${e}.unlessSeen must be a boolean`),t.maxShows!==void 0&&(typeof t.maxShows!="number"||t.maxShows<0)&&n.push(`${e}.maxShows must be a non-negative number`)}function It(t,e,n){if(!w(t)){n.push(`${e} must be an object`);return}st.includes(t.type)||n.push(`${e}.type must be one of ${st.join("|")}`),t.url!==void 0&&typeof t.url!="string"&&n.push(`${e}.url must be a string`),t.value!==void 0&&typeof t.value!="string"&&n.push(`${e}.value must be a string`)}function Ot(t){const e=[];if(!w(t))return{ok:!1,errors:["tour must be an object"]};if((typeof t.id!="string"||t.id.length===0)&&e.push("tour.id must be a non-empty string"),typeof t.schemaVersion!="number"&&e.push("tour.schemaVersion must be a number"),nt(t.title)||e.push('tour.title must be a localized text with a string "default"'),Array.isArray(t.steps)?t.steps.length===0?e.push("tour.steps must contain at least one step"):t.steps.forEach((n,o)=>{if(!w(n)){e.push(`steps[${o}] must be an object`);return}(typeof n.id!="string"||n.id.length===0)&&e.push(`steps[${o}].id must be a non-empty string`),(!Array.isArray(n.selectors)||n.selectors.length===0||!n.selectors.every(i=>typeof i=="string"&&i.length>0))&&e.push(`steps[${o}].selectors must be a non-empty array of non-empty strings`),nt(n.content)||e.push(`steps[${o}].content must be a localized text with a string "default"`),n.placement!==void 0&&!ot.includes(n.placement)&&e.push(`steps[${o}].placement must be one of ${ot.join("|")}`),n.align!==void 0&&!rt.includes(n.align)&&e.push(`steps[${o}].align must be one of ${rt.join("|")}`),n.backLabel!==void 0&&typeof n.backLabel!="string"&&e.push(`steps[${o}].backLabel must be a string`),n.nextLabel!==void 0&&typeof n.nextLabel!="string"&&e.push(`steps[${o}].nextLabel must be a string`),n.pageUrl!==void 0&&at(n.pageUrl,`steps[${o}].pageUrl`,e),n.condition!==void 0&&ut(n.condition,`steps[${o}].condition`,e),n.action!==void 0&&It(n.action,`steps[${o}].action`,e)}):e.push("tour.steps must be an array"),t.trigger!==void 0){const n=t.trigger,o=["manual","load","selector","timer","cta"],i=["bottom-right","bottom-left","top-right","top-left"];!w(n)||typeof n.type!="string"||!o.includes(n.type)?e.push(`tour.trigger.type must be one of ${o.join("|")}`):n.type==="selector"&&(typeof n.selector!="string"||n.selector.length===0)?e.push("tour.trigger.selector must be a non-empty string"):n.type==="timer"&&(typeof n.delay!="number"||n.delay<0)?e.push("tour.trigger.delay must be a non-negative number"):n.type==="cta"&&(typeof n.text!="string"&&e.push("tour.trigger.text must be a string"),typeof n.button!="string"&&e.push("tour.trigger.button must be a string"),i.includes(n.corner)||e.push(`tour.trigger.corner must be one of ${i.join("|")}`),n.offset!==void 0&&(typeof n.offset!="number"||n.offset<0)&&e.push("tour.trigger.offset must be a non-negative number"))}if(t.audience!==void 0&&!["all","auth","guest"].includes(t.audience)&&e.push("tour.audience must be one of all|auth|guest"),t.display!==void 0)if(!w(t.display))e.push("tour.display must be an object");else for(const n of["padding","radius","cardRadius","offset","alignOffset"]){const o=t.display[n];o!==void 0&&(typeof o!="number"||o<0)&&e.push(`tour.display.${n} must be a non-negative number`)}return t.rules!==void 0&&(Array.isArray(t.rules)?t.rules.forEach((n,o)=>{if(!w(n)){e.push(`rules[${o}] must be an object`);return}n.tourId!==void 0&&typeof n.tourId!="string"&&e.push(`rules[${o}].tourId must be a string`),n.when===void 0?e.push(`rules[${o}].when is required`):ut(n.when,`rules[${o}].when`,e)}):e.push("tour.rules must be an array")),e.length>0?{ok:!1,errors:e}:{ok:!0,tour:t}}function Ut(t,e,n){const o={top:t.top,bottom:n.height-t.bottom,left:t.left,right:n.width-t.right},i={top:e.height,bottom:e.height,left:e.width,right:e.width},u=["bottom","top","right","left"],a=u.find(c=>o[c]>=i[c]+8);return a||u.reduce((c,b)=>o[b]>o[c]?b:c,u[0])}function zt(t){const{target:e,card:n,offset:o,viewport:i}=t,u=t.side==="auto",a=u?Ut(e,n,i):t.side,c=u?"center":t.align,b=t.alignOffset??0,h=c==="start"?b:c==="end"?-b:0;let g=0,p=0;return a==="top"||a==="bottom"?(g=a==="top"?e.top-n.height-o:e.bottom+o,p=c==="start"?e.left:c==="end"?e.right-n.width:e.left+e.width/2-n.width/2,p+=h):(p=a==="left"?e.left-n.width-o:e.right+o,g=c==="start"?e.top:c==="end"?e.bottom-n.height:e.top+e.height/2-n.height/2,g+=h),p=Math.max(8,Math.min(p,i.width-n.width-8)),g=Math.max(8,Math.min(g,i.height-n.height-8)),{top:g,left:p}}function ct(t){const e=document.createElement("button");return e.type="button",e.className=`tours-card__btn${t.primary?" tours-card__btn--primary":""}${t.disabled?" tours-card__btn--disabled":""}`,e.textContent=t.label,!t.disabled&&t.onClick&&e.addEventListener("click",t.onClick),e}function Dt(t){const e=document.createElement("div");e.className=`tours-card${t.ghost?" tours-card--ghost":""}`,t.radius!=null&&(e.style.borderRadius=`${t.radius}px`);{const o=document.createElement("button");o.className="tours-card__close",o.type="button",o.textContent="×",o.setAttribute("aria-label","Close"),t.onClose&&o.addEventListener("click",t.onClose),e.appendChild(o)}const n=document.createElement("div");if(n.className="tours-card__content",t.contentHtml!=null?n.innerHTML=t.contentHtml:n.textContent=t.contentText??"",e.appendChild(n),t.back||t.next||t.progress){const o=document.createElement("div");if(o.className="tours-card__footer",t.back&&o.appendChild(ct(t.back)),t.progress){const i=document.createElement("span");i.className="tours-card__progress",i.textContent=t.progress,o.appendChild(i)}t.next&&o.appendChild(ct(t.next)),e.appendChild(o)}return e}const Mt=`
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
`;function Vt(t){const e=t.replace(/[.+^${}()|[\]\\]/g,"\\$&").replace(/\*\*/g,"\0").replace(/\*/g,"[^/]*").replace(/ /g,".*").replace(/\?/g,".");return new RegExp(`^${e}$`)}function N(t,e){if(!t)return!0;if(t.regex)try{return new RegExp(t.regex).test(e)}catch{return!1}if(t.glob)try{return Vt(t.glob).test(e)}catch{return!1}return!0}function Pt(t){if(!t||!t.glob)return null;const e=t.glob.replace(/\*+/g,"");return/^https?:\/\//i.test(e)||e.startsWith("#")||e.startsWith("/")?e:null}const P="tours:locationchange";let lt=!1;function Ft(){if(!lt){lt=!0;for(const t of["pushState","replaceState"]){const e=history[t];history[t]=function(...o){const i=e.apply(this,o);return window.dispatchEvent(new Event(P)),i}}}}function F(t){return Ft(),window.addEventListener("popstate",t),window.addEventListener("hashchange",t),window.addEventListener(P,t),()=>{window.removeEventListener("popstate",t),window.removeEventListener("hashchange",t),window.removeEventListener(P,t)}}const H="tours:progress";function Ht(){return{get(t){try{return localStorage.getItem(t)}catch{return null}},set(t,e){try{localStorage.setItem(t,e)}catch{}},remove(t){try{localStorage.removeItem(t)}catch{}}}}function dt(t){const e=t.get(H);if(!e)return null;try{const n=JSON.parse(e);if(typeof n?.tourId=="string"&&typeof n?.index=="number")return n}catch{}return null}function I(t,e){t.set(H,JSON.stringify(e))}function ft(t){t.remove(H)}const pt="tours:seen:";function gt(t,e){const n=t.get(pt+e),o=n?parseInt(n,10):0;return Number.isNaN(o)?0:o}function Bt(t,e){t.set(pt+e,String(gt(t,e)+1))}const Wt=`
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
`;function mt(t,e){return e?e(t):ht({text:t.text,button:t.button,corner:t.corner,offset:t.offset,onStart:t.onResume})}function ht(t){const e=t.corner??"bottom-right",n=t.offset??24,o=document.createElement("div");o.setAttribute("data-tours-cta","");const i=o.attachShadow({mode:"open"}),u=document.createElement("style");u.textContent=Wt,i.appendChild(u);const a=document.createElement("div");a.className="cta";const[c,b]=e.split("-");a.style[c]=`${n}px`,a.style[b]=`${n}px`;const h=()=>{o.parentNode&&o.parentNode.removeChild(o)},g=document.createElement("button");g.className="cta__close",g.type="button",g.textContent="×",g.setAttribute("aria-label","Dismiss"),g.addEventListener("click",h);const p=document.createElement("p");p.className="cta__text",p.textContent=t.text;const s=document.createElement("button");return s.className="cta__btn",s.type="button",s.textContent=t.button,s.addEventListener("click",()=>{h(),t.onStart()}),a.append(g,p,s),i.appendChild(a),document.body.appendChild(o),h}const Yt="[data-tours-editor]";function bt(){return typeof document<"u"&&document.querySelector(Yt)!==null}function O(t,e={}){const n=K("player"),o=e.state;let i=null,u=null,a=null,c=null,b=null,h=null,g=null,p=!1,s=0,_=0,f=null;const l=t.display?.padding??Q,T=t.display?.radius??Z,U=t.display?.cardRadius??tt,ue=t.display?.offset??et;function B(r){return M(r.selectors)}function W(r){return r.action?.type==="click"}function R(r){return N(r.pageUrl,window.location.href)}function S(){o&&I(o,{tourId:t.id,index:s})}function kt(){if(i)return;i=document.createElement("div"),i.setAttribute("data-tours-player",""),u=i.attachShadow({mode:"open"});const r=document.createElement("style");r.textContent=C+Mt,u.appendChild(r),b=document.createElement("div"),b.className="tours-backdrop",b.addEventListener("click",d=>{const m=t.steps[s],y=m?B(m):null;if(y){const x=y.getBoundingClientRect();if(d.clientX>=x.left-l&&d.clientX<=x.right+l&&d.clientY>=x.top-l&&d.clientY<=x.bottom+l)return}$()}),u.appendChild(b),a=document.createElement("div"),a.className="tours-spotlight",a.style.borderRadius=`${T}px`,u.appendChild(a),document.body.appendChild(i)}function ce(r){if(!b)return;if(!r){b.style.clipPath="";return}const d=r.left-l,m=r.top-l,y=r.right+l,x=r.bottom+l;b.style.clipPath=`polygon(0 0, 0 100%, ${d}px 100%, ${d}px ${m}px, ${y}px ${m}px, ${y}px ${x}px, ${d}px ${x}px, ${d}px 100%, 100% 100%, 100% 0)`}function _t(r,d=!1){a&&(a.style.transitionDuration=d?"0ms":"",a.style.display="block",a.style.left=`${r.left-l}px`,a.style.top=`${r.top-l}px`,a.style.width=`${r.width+l*2}px`,a.style.height=`${r.height+l*2}px`)}function St(r,d){if(!c)return;const m={top:r.top-l,left:r.left-l,right:r.right+l,bottom:r.bottom+l,width:r.width+l*2,height:r.height+l*2},{top:y,left:x}=zt({target:m,card:{width:c.offsetWidth,height:c.offsetHeight},side:d.placement??"bottom",align:d.align??"center",offset:ue,alignOffset:t.display?.alignOffset??0,viewport:{width:window.innerWidth,height:window.innerHeight}});c.style.left=`${x}px`,c.style.top=`${y}px`}function le(r){const d=Math.max(1,t.steps.length-_),m=Math.max(1,Math.min(s+1-_,d));c&&c.remove();const y=s===t.steps.length-1,x=t.steps[s-1],A=!!x&&R(x),me=!W(r)||y;c=Dt({contentText:r.content.default,progress:`Step ${m} of ${d}`,onClose:pe,radius:U,back:A?{label:r.backLabel??"Back",onClick:X}:void 0,next:me?{label:r.nextLabel??(y?"Done":"Next"),primary:!0,onClick:q}:void 0}),u?.appendChild(c)}function E(){if(!p)return;const r=t.steps[s];if(!r){$();return}n.log("render step",s,r.id);const d=B(r);if(!d){n.log(`step "${r.id}" target not found yet — waiting`,r.selectors),J(r.selectors,{timeout:4e3}).then(y=>{!p||t.steps[s]!==r||(y?E():(n.warn(`step "${r.id}" skipped: no element for selectors`,r.selectors),_+=1,s<t.steps.length-1?(s+=1,E()):$()))});return}kt(),d.scrollIntoView({behavior:"smooth",block:"center",inline:"center"}),le(r);const m=d.getBoundingClientRect();_t(m),St(m,r),ce(W(r)?m:null),de(r)}function de(r){if(h?.(),h=null,!W(r))return;const d=s+1,m=t.steps[d];!m||R(m)||(h=F(()=>{!p||t.steps[s]!==r||N(m.pageUrl,window.location.href)&&(h?.(),h=null,n.log("visitor navigated → advancing to",m.id),s=d,S(),E())}))}function Ct(r){p&&(r.key==="Escape"?(r.preventDefault(),$()):r.key==="ArrowRight"?q():r.key==="ArrowLeft"&&X())}function z(){if(!p)return;const r=t.steps[s];if(!r)return;const d=B(r);if(!d)return;const m=d.getBoundingClientRect();_t(m,!0),St(m,r)}function Lt(r=0){if(!p&&t.steps.length!==0){if(!e.allowWhileEditing&&bt()){n.log(`start suppressed for "${t.id}" — the builder is mounted`);return}G(),p=!0,s=Math.max(0,Math.min(r,t.steps.length-1)),_=0,n.log("start",t.id,`at ${s}/${t.steps.length}`),kt(),window.addEventListener("keydown",Ct,!0),window.addEventListener("resize",z,!0),window.addEventListener("scroll",z,!0),S(),E()}}function fe(){a&&(a.style.display="none"),c&&(c.remove(),c=null)}function D(){fe(),!f&&(f=F(()=>{if(!p){f?.(),f=null;return}const r=t.steps[s];r&&R(r)&&(f?.(),f=null,E())}))}function Y(){f&&(f(),f=null),h&&(h(),h=null),p&&(p=!1,window.removeEventListener("keydown",Ct,!0),window.removeEventListener("resize",z,!0),window.removeEventListener("scroll",z,!0),i&&i.parentNode&&i.parentNode.removeChild(i),i=null,u=null,a=null,c=null,b=null)}function $(){n.log("stop"),G(),Y(),o&&ft(o)}function G(){g?.(),g=null}function pe(){t.dismiss?.mode==="minimize"?Tt():$()}function Tt(){p&&(n.log("minimized",t.id,`at ${s}`),Y(),o&&I(o,{tourId:t.id,index:s,minimized:!0}),ge())}function ge(){G();const r=t.dismiss?.resume;g=mt({tourId:t.id,text:r?.text??"Carry on with the tour?",button:r?.button??"Resume",corner:r?.corner,offset:r?.offset,onResume:()=>{g=null,o&&I(o,{tourId:t.id,index:s}),Lt(s)}},e.renderResume)}function q(){if(!p)return;const r=s+1,d=t.steps[r];if(!d){$();return}if(R(d)){s=r,S(),E();return}s=r,S();const m=A=>{Y(),e.onNavigate?e.onNavigate(A,d.id):window.location.assign(A)},y=t.steps[s-1]?.action;if(y&&y.type==="navigate"&&y.url){y.url.startsWith("#")?(n.log("page transition (hash navigate) → resume at",s),D(),window.location.hash=y.url):(n.log("page transition (navigate) → resume at",s),m(y.url));return}const x=Pt(d.pageUrl);if(x){x.startsWith("#")?(n.log("page transition (derived hash) → resume at",s),D(),window.location.hash=x):(n.log("page transition (derived navigate) → resume at",s,x),m(x));return}n.log("page transition (wait) → resume at",s),D()}function X(){if(!p)return;const r=t.steps[s-1];if(r){if(R(r)){s-=1,S(),E();return}s-=1,S(),n.log("page transition back → resume at",s),D(),window.history.back()}}return{start:Lt,stop:$,next:q,prev:X,minimize:Tt,isActive:()=>p}}function Gt(t,e={}){const n=e.state;if(!n)return null;const o=dt(n);if(!o||o.tourId!==t.id)return null;if(!t.steps[o.index])return ft(n),null;let i=-1;for(let a=o.index;a<t.steps.length;a++)if(N(t.steps[a].pageUrl,window.location.href)){i=a;break}if(i===-1)return null;const u=O(t,e);return u.start(i),u}function qt(t,e){if(bt())return()=>{};const n=t.trigger??{type:"manual"};let o=!1;const i=()=>{o||(o=!0,e())};switch(n.type){case"load":{const u=setTimeout(i,0);return()=>clearTimeout(u)}case"timer":{const u=setTimeout(i,Math.max(0,n.delay));return()=>clearTimeout(u)}case"selector":{let u=!1;return J([n.selector],{timeout:0}).then(a=>{a&&!u&&i()}),()=>{u=!0}}case"cta":{let u=()=>{};return u=ht({text:n.text,button:n.button,corner:n.corner,offset:n.offset,onStart:i}),u}case"manual":default:return()=>{}}}function Xt(t=window.innerWidth){return t<=640?"mobile":t<=1024?"tablet":"desktop"}function jt(t,e){return!(t.url&&!N(t.url,e.url)||t.role!==void 0&&t.role!==e.role||t.firstVisitOnly&&!e.firstVisit||t.device&&t.device!==e.device||t.unlessSeen&&e.seenCount>0||t.maxShows!==void 0&&e.seenCount>=t.maxShows)}function Jt(t,e){return!t||t.length===0?!0:t.some(n=>jt(n.when,e))}function Kt(t,e={}){const n=K("mount"),o=e.state,i=()=>typeof t=="function"?t():t;let u=null,a=[],c=null;function b(){for(const s of a)s();a=[],c?.(),c=null}function h(s){return!e.canRun||e.canRun(s)}function g(){if(u?.isActive())return;u=null,b();const s=o?dt(o):null;if(o&&s?.minimized){const f=i().find(l=>l.id===s.tourId&&h(l));if(f){const l=f.dismiss?.resume;c=mt({tourId:f.id,text:l?.text??"Carry on with the tour?",button:l?.button??"Resume",corner:l?.corner,offset:l?.offset,onResume:()=>{c=null,I(o,{tourId:f.id,index:s.index});const T=O(f,e);u=T,T.start(s.index)}},e.renderResume);return}}if(o)for(const f of i()){if(!h(f))continue;const l=Gt(f,e);if(l){n.log("resumed",f.id),u=l;return}}const _=Xt();for(const f of i()){if(!h(f)||!f.trigger||f.trigger.type==="manual")continue;const l=o?gt(o,f.id):0;Jt(f.rules,{url:window.location.href,device:_,firstVisit:l===0,seenCount:l})&&a.push(qt(f,()=>{o&&Bt(o,f.id);const U=O(f,e);u=U,U.start()}))}}g();const p=F(g);return()=>{p(),b(),u?.stop(),u=null}}let Qt=0;function Zt(t){const e=typeof crypto<"u"&&"randomUUID"in crypto?crypto.randomUUID():`${Qt++}`;return`${t}-${e}`}function te(t="step"){return{id:Zt("step"),type:t,included:!0,selectors:[],content:"",page:"",placement:"auto",align:"center",backLabel:"Back",nextLabel:"Next"}}function ee(t){if(t&&typeof t=="object"){const e=t;if(e.type==="load")return{type:"load"};if(e.type==="selector"&&typeof e.selector=="string")return{type:"selector",selector:e.selector};if(e.type==="timer"&&typeof e.delay=="number")return{type:"timer",delay:e.delay};if(e.type==="cta"&&typeof e.text=="string"&&typeof e.button=="string"){const n=["bottom-right","bottom-left","top-right","top-left"];return{type:"cta",text:e.text,button:e.button,corner:n.includes(e.corner)?e.corner:"bottom-right",offset:typeof e.offset=="number"?e.offset:void 0}}}return{type:"manual"}}function ne(t){if(!Array.isArray(t))return[];const e=[];for(const n of t){if(!n||typeof n!="object")continue;const o=n;typeof o.id!="string"||!Array.isArray(o.steps)||e.push({id:o.id,kind:o.kind==="template"?"template":"tour",name:typeof o.name=="string"?o.name:"Untitled tour",status:o.status==="published"?"published":"draft",trigger:ee(o.trigger),audience:o.audience==="auth"||o.audience==="guest"?o.audience:"all",conditions:{firstVisitOnly:(o.conditions?.firstVisitOnly??!0)===!0,maxShows:k(o.conditions?.maxShows,0),device:["mobile","tablet","desktop"].includes(o.conditions?.device)?o.conditions.device:"any"},display:{padding:k(o.display?.padding,Q),radius:k(o.display?.radius,Z),cardRadius:k(o.display?.cardRadius,tt),offset:k(o.display?.offset,et),alignOffset:k(o.display?.alignOffset,0)},steps:o.steps.filter(i=>!!i&&typeof i=="object").map(i=>({...te(i.type==="action"?"action":"step"),...i}))})}return e}function k(t,e){return typeof t=="number"&&t>=0?t:e}function oe(t){const e=t.steps.filter(i=>i.included&&i.selectors.length>0).map(i=>({id:i.id,selectors:i.selectors,content:{default:i.content},placement:i.placement,align:i.align,backLabel:i.backLabel,nextLabel:i.nextLabel,...i.page?{pageUrl:{glob:i.page}}:{},...i.action?{action:i.action}:{}})),n={};t.conditions.firstVisitOnly&&(n.firstVisitOnly=!0),t.conditions.maxShows>0&&(n.maxShows=t.conditions.maxShows),t.conditions.device!=="any"&&(n.device=t.conditions.device);const o=Object.keys(n).length>0?[{when:n}]:void 0;return{id:t.id,schemaVersion:Nt,title:{default:t.name},steps:e,trigger:t.trigger,audience:t.audience,...o?{rules:o}:{},display:{padding:t.display.padding,radius:t.display.radius,cardRadius:t.display.cardRadius,offset:t.display.offset,alignOffset:t.display.alignOffset}}}function re(t){return Ot(oe(t))}const yt=Ht();function xt(){return window.SiteToursFront_data??{}}function ie(t){const e=xt().authenticated===!0;return t==="auth"?e:t==="guest"?!e:!0}function wt(){return ne(xt().drafts).filter(t=>t.status==="published"&&t.kind==="tour"&&ie(t.audience))}function se(){return wt().map(t=>({id:t.id,name:t.name}))}function vt(){const t=[];for(const e of wt()){const n=re(e);n.ok&&t.push(n.tour)}return t}function Et(t){const e=vt(),n=t?e.find(o=>o.id===t):e[0];if(!n){console.warn("[tours] no published tour to run",t??"");return}O(n,{state:yt}).start()}function ae(){for(const t of Array.from(document.querySelectorAll("[data-site-tour]")))t.dataset.siteToursBound||(t.dataset.siteToursBound="1",t.addEventListener("click",()=>Et(t.dataset.siteTour||void 0)))}function $t(){ae(),Kt(vt,{state:yt})}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",$t):$t(),v.list=se,v.run=Et,Object.defineProperty(v,Symbol.toStringTag,{value:"Module"})}));
