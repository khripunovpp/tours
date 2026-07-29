(function(E,O){typeof exports=="object"&&typeof module<"u"?O(exports):typeof define=="function"&&define.amd?define(["exports"],O):(E=typeof globalThis<"u"?globalThis:E||self,O(E.ToursEditor={}))})(this,(function(E){"use strict";const O=`
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
`,Ve=`
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
`;function X(n){return JSON.stringify(n)}function He(n){return/^[a-zA-Z][\w-]*$/.test(n)&&n.length<=30&&!/\d{2,}/.test(n)&&!/^(css-|sc-|jsx-|emotion-|_|is-|has-)/.test(n)}function pe(n){const e=[];let t=n;for(;t&&t!==document.body&&t.nodeType===1;){const r=t.tagName.toLowerCase(),i=t.parentElement;if(!i){e.unshift(r);break}const o=Array.from(i.children).filter(s=>s.tagName===t.tagName);e.unshift(o.length>1?`${r}:nth-of-type(${o.indexOf(t)+1})`:r),t=i}return`body > ${e.join(" > ")}`}function We(n){let e=n.parentElement;for(;e&&e!==document.body&&!e.id;)e=e.parentElement;if(!e||!e.id)return null;const t=[];let r=n;for(;r&&r!==e;){const i=r.tagName.toLowerCase(),o=r.parentElement;if(!o)return null;const s=Array.from(o.children).filter(l=>l.tagName===r.tagName);t.unshift(s.length>1?`${i}:nth-of-type(${s.indexOf(r)+1})`:i),r=o}return`#${CSS.escape(e.id)} > ${t.join(" > ")}`}const Je=["data-testid","data-test","data-test-id","data-cy","data-qa","data-id","data-name"];function qe(n){const e=[],t=new Set,r=n.tagName.toLowerCase(),i=c=>{if(!(!c||t.has(c)))try{document.querySelector(c)===n&&(t.add(c),e.push(c))}catch{}};n.id&&i(`#${CSS.escape(n.id)}`);for(const c of Je){const h=n.getAttribute(c);h&&i(`${r}[${c}=${X(h)}]`)}const o=n.getAttribute("name");o&&i(`${r}[name=${X(o)}]`);const s=n.getAttribute("aria-label");s&&i(`[aria-label=${X(s)}]`);const l=Array.from(n.classList).filter(He);l.length&&i(`${r}.${l.map(c=>CSS.escape(c)).join(".")}`);for(const c of l)i(`${r}.${CSS.escape(c)}`);i(We(n)),i(pe(n));const p=(n.textContent??"").replace(/\s+/g," ").trim();if(p&&p.length<=50&&/^(a|button|summary|label|h[1-6])$/.test(r)){const c=`text=${p}`;t.has(c)||(t.add(c),e.push(c))}return e.length===0&&e.push(pe(n)),e}const Xe="a, button, summary, label, h1, h2, h3, h4, h5, h6";function ue(n,e){return!(n instanceof Element)||!n.isConnected||e!==document&&e instanceof Node&&!e.contains(n)?null:n}function Ye(n,e){if(typeof n=="function"){let t;try{t=n()}catch{return null}return ue(t,e)}if(typeof n!="string")return ue(n,e);if(n.startsWith("text=")){const t=n.slice(5).trim();for(const r of Array.from(e.querySelectorAll(Xe)))if((r.textContent??"").replace(/\s+/g," ").trim()===t)return r;return null}try{return e.querySelector(n)}catch{return null}}function D(n,e=document){for(const t of n){const r=Ye(t,e);if(r)return r}return null}function Ge(n,e={}){const t=e.root??document,r=D(n,t);return r?Promise.resolve(r):new Promise(i=>{let o=!1,s;const l=h=>{o||(o=!0,p.disconnect(),s&&clearTimeout(s),i(h))},p=new MutationObserver(()=>{const h=D(n,t);h&&l(h)});p.observe(document.documentElement,{childList:!0,subtree:!0,attributes:!0});const c=e.timeout??4e3;c>0&&Number.isFinite(c)&&(s=setTimeout(()=>l(null),c))})}let z=null;function Y(){if(z!==null)return z;try{z=new URLSearchParams(window.location.search).has("use_logs")}catch{z=!1}return z}function G(n){const e=`[tours:${n}]`;return{log:(...t)=>{Y()&&console.log(e,...t)},warn:(...t)=>{Y()&&console.warn(e,...t)},error:(...t)=>{Y()&&console.error(e,...t)}}}function Ke(n,e={}){const t=G("picker");let r=null,i=null,o=null,s=!1;function l(m){if(m===r)return!0;for(const v of e.ignore??[])if(v&&v.contains(m))return!0;return!1}function p(){if(r)return;r=document.createElement("div"),r.setAttribute("data-tours-picker",""),i=r.attachShadow({mode:"open"});const m=document.createElement("style");m.textContent=O,i.appendChild(m),o=document.createElement("div"),o.className="tours-picker-overlay",o.style.display="none",i.appendChild(o);const v=document.createElement("div");v.className="tours-picker-hint",v.textContent="Hover and click an element • Esc to cancel",i.appendChild(v),document.body.appendChild(r)}function c(m,v){const S=document.elementFromPoint(m,v);return!S||l(S)?null:S}function h(m){if(!s||!o)return;const v=c(m.clientX,m.clientY);if(!v){o.style.display="none";return}const S=v.getBoundingClientRect();o.style.display="block",o.style.left=`${S.left}px`,o.style.top=`${S.top}px`,o.style.width=`${S.width}px`,o.style.height=`${S.height}px`}function g(m){if(!s)return;const v=c(m.clientX,m.clientY);if(m.preventDefault(),m.stopPropagation(),!v)return;const S=qe(v);t.log("picked",S),y(),n(S)}function u(m){m.key==="Escape"&&(m.preventDefault(),y())}function k(){s||(s=!0,t.log("start"),p(),document.addEventListener("mousemove",h,!0),document.addEventListener("click",g,!0),document.addEventListener("keydown",u,!0))}function y(){s&&(s=!1,document.removeEventListener("mousemove",h,!0),document.removeEventListener("click",g,!0),document.removeEventListener("keydown",u,!0),r&&r.parentNode&&r.parentNode.removeChild(r),r=null,i=null,o=null)}return{start:k,stop:y}}const B=6,j=6,U=10,V=12,Qe=1;function L(n){return typeof n=="object"&&n!==null&&!Array.isArray(n)}function he(n){return L(n)&&typeof n.default=="string"}const fe=["top","bottom","left","right","auto"],ge=["start","center","end"],me=["mobile","tablet","desktop"],be=["click","input","navigate","none"];function ve(n,e,t){if(!L(n)){t.push(`${e} must be an object`);return}const r=typeof n.glob=="string"&&n.glob.length>0,i=typeof n.regex=="string"&&n.regex.length>0;if(!r&&!i&&t.push(`${e} must have a non-empty "glob" or "regex"`),i)try{new RegExp(n.regex)}catch{t.push(`${e}.regex is not a valid regular expression`)}}function xe(n,e,t){if(!L(n)){t.push(`${e} must be an object`);return}if(n.url!==void 0&&ve(n.url,`${e}.url`,t),n.traits!==void 0)if(!L(n.traits))t.push(`${e}.traits must be an object`);else for(const[r,i]of Object.entries(n.traits))typeof i!="string"&&typeof i!="number"&&t.push(`${e}.traits.${r} must be a string or number`);n.firstVisitOnly!==void 0&&typeof n.firstVisitOnly!="boolean"&&t.push(`${e}.firstVisitOnly must be a boolean`),n.device!==void 0&&!me.includes(n.device)&&t.push(`${e}.device must be one of ${me.join("|")}`),n.unlessSeen!==void 0&&typeof n.unlessSeen!="boolean"&&t.push(`${e}.unlessSeen must be a boolean`),n.maxShows!==void 0&&(typeof n.maxShows!="number"||n.maxShows<0)&&t.push(`${e}.maxShows must be a non-negative number`)}function Ze(n,e,t){if(!L(n)){t.push(`${e} must be an object`);return}be.includes(n.type)||t.push(`${e}.type must be one of ${be.join("|")}`),n.url!==void 0&&typeof n.url!="string"&&t.push(`${e}.url must be a string`),n.value!==void 0&&typeof n.value!="string"&&t.push(`${e}.value must be a string`)}function et(n){const e=[];if(!L(n))return{ok:!1,errors:["tour must be an object"]};if((typeof n.id!="string"||n.id.length===0)&&e.push("tour.id must be a non-empty string"),typeof n.schemaVersion!="number"&&e.push("tour.schemaVersion must be a number"),he(n.title)||e.push('tour.title must be a localized text with a string "default"'),Array.isArray(n.steps)?n.steps.length===0?e.push("tour.steps must contain at least one step"):n.steps.forEach((t,r)=>{if(!L(t)){e.push(`steps[${r}] must be an object`);return}(typeof t.id!="string"||t.id.length===0)&&e.push(`steps[${r}].id must be a non-empty string`),(!Array.isArray(t.selectors)||t.selectors.length===0||!t.selectors.every(i=>typeof i=="string"&&i.length>0))&&e.push(`steps[${r}].selectors must be a non-empty array of non-empty strings`),he(t.content)||e.push(`steps[${r}].content must be a localized text with a string "default"`),t.placement!==void 0&&!fe.includes(t.placement)&&e.push(`steps[${r}].placement must be one of ${fe.join("|")}`),t.align!==void 0&&!ge.includes(t.align)&&e.push(`steps[${r}].align must be one of ${ge.join("|")}`),t.backLabel!==void 0&&typeof t.backLabel!="string"&&e.push(`steps[${r}].backLabel must be a string`),t.nextLabel!==void 0&&typeof t.nextLabel!="string"&&e.push(`steps[${r}].nextLabel must be a string`),t.pageUrl!==void 0&&ve(t.pageUrl,`steps[${r}].pageUrl`,e),t.condition!==void 0&&xe(t.condition,`steps[${r}].condition`,e),t.action!==void 0&&Ze(t.action,`steps[${r}].action`,e),t.overlay!==void 0&&typeof t.overlay!="boolean"&&e.push(`steps[${r}].overlay must be a boolean`)}):e.push("tour.steps must be an array"),n.trigger!==void 0){const t=n.trigger,r=["manual","load","selector","timer","cta"],i=["bottom-right","bottom-left","top-right","top-left"];!L(t)||typeof t.type!="string"||!r.includes(t.type)?e.push(`tour.trigger.type must be one of ${r.join("|")}`):t.type==="selector"&&(typeof t.selector!="string"||t.selector.length===0)?e.push("tour.trigger.selector must be a non-empty string"):t.type==="timer"&&(typeof t.delay!="number"||t.delay<0)?e.push("tour.trigger.delay must be a non-negative number"):t.type==="cta"&&(typeof t.text!="string"&&e.push("tour.trigger.text must be a string"),typeof t.button!="string"&&e.push("tour.trigger.button must be a string"),i.includes(t.corner)||e.push(`tour.trigger.corner must be one of ${i.join("|")}`),t.offset!==void 0&&(typeof t.offset!="number"||t.offset<0)&&e.push("tour.trigger.offset must be a non-negative number"))}if(n.audience!==void 0&&!["all","auth","guest"].includes(n.audience)&&e.push("tour.audience must be one of all|auth|guest"),n.display!==void 0)if(!L(n.display))e.push("tour.display must be an object");else for(const t of["padding","radius","cardRadius","offset","alignOffset"]){const r=n.display[t];r!==void 0&&(typeof r!="number"||r<0)&&e.push(`tour.display.${t} must be a non-negative number`)}return n.rules!==void 0&&(Array.isArray(n.rules)?n.rules.forEach((t,r)=>{if(!L(t)){e.push(`rules[${r}] must be an object`);return}t.tourId!==void 0&&typeof t.tourId!="string"&&e.push(`rules[${r}].tourId must be a string`),t.when===void 0?e.push(`rules[${r}].when is required`):xe(t.when,`rules[${r}].when`,e)}):e.push("tour.rules must be an array")),e.length>0?{ok:!1,errors:e}:{ok:!0,tour:n}}function tt(n,e,t){const r={top:n.top,bottom:t.height-n.bottom,left:n.left,right:t.width-n.right},i={top:e.height,bottom:e.height,left:e.width,right:e.width},o=["bottom","top","right","left"],s=o.find(l=>r[l]>=i[l]+8);return s||o.reduce((l,p)=>r[p]>r[l]?p:l,o[0])}function ye(n){const{target:e,card:t,offset:r,viewport:i}=n,o=n.side==="auto",s=o?tt(e,t,i):n.side,l=o?"center":n.align,p=n.alignOffset??0,c=l==="start"?p:l==="end"?-p:0;let h=0,g=0;return s==="top"||s==="bottom"?(h=s==="top"?e.top-t.height-r:e.bottom+r,g=l==="start"?e.left:l==="end"?e.right-t.width:e.left+e.width/2-t.width/2,g+=c):(g=s==="left"?e.left-t.width-r:e.right+r,h=l==="start"?e.top:l==="end"?e.bottom-t.height:e.top+e.height/2-t.height/2,h+=c),g=Math.max(8,Math.min(g,i.width-t.width-8)),h=Math.max(8,Math.min(h,i.height-t.height-8)),{top:h,left:g}}function we(n){const e=document.createElement("button");return e.type="button",e.className=`tours-card__btn${n.primary?" tours-card__btn--primary":""}${n.disabled?" tours-card__btn--disabled":""}`,e.textContent=n.label,!n.disabled&&n.onClick&&e.addEventListener("click",n.onClick),e}function _e(n){const e=document.createElement("div");if(e.className=`tours-card${n.ghost?" tours-card--ghost":""}${n.showClose?" tours-card--closable":""}`,n.radius!=null&&(e.style.borderRadius=`${n.radius}px`),n.showClose){const r=document.createElement("button");r.className="tours-card__close",r.type="button",r.textContent="×",r.setAttribute("aria-label","Close"),n.onClose&&r.addEventListener("click",n.onClose),e.appendChild(r)}const t=document.createElement("div");if(t.className="tours-card__content",n.contentHtml!=null?t.innerHTML=n.contentHtml:t.textContent=n.contentText??"",e.appendChild(t),n.back||n.next||n.progress){const r=document.createElement("div");if(r.className="tours-card__footer",n.back&&r.appendChild(we(n.back)),n.progress){const i=document.createElement("span");i.className="tours-card__progress",i.textContent=n.progress,r.appendChild(i)}n.next&&r.appendChild(we(n.next)),e.appendChild(r)}return e}const ke=`
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
`;function rt(n){const e=n.replace(/[.+^${}()|[\]\\]/g,"\\$&").replace(/\*\*/g,"\0").replace(/\*/g,"[^/]*").replace(/ /g,".*").replace(/\?/g,".");return new RegExp(`^${e}$`)}function P(n,e){if(!n)return!0;if(n.regex)try{return new RegExp(n.regex).test(e)}catch{return!1}if(n.glob)try{return rt(n.glob).test(e)}catch{return!1}return!0}function Ee(n){if(!n||!n.glob)return null;const e=n.glob.replace(/\*+/g,"");return/^https?:\/\//i.test(e)||e.startsWith("#")||e.startsWith("/")?e:null}function nt(n=window.innerWidth){return n<=640?"mobile":n<=1024?"tablet":"desktop"}function it(n,e){if(n.url&&!P(n.url,e.url))return!1;if(n.traits){for(const[t,r]of Object.entries(n.traits))if(e.traits?.[t]!==r)return!1}return!(n.firstVisitOnly&&!e.firstVisit||n.device&&n.device!==e.device||n.unlessSeen&&e.seenCount>0||n.maxShows!==void 0&&e.seenCount>=n.maxShows)}function ot(n,e){return!n||it(n,e)}const K="tours:locationchange";let Se=!1;function st(){if(!Se){Se=!0;for(const n of["pushState","replaceState"]){const e=history[n];history[n]=function(...r){const i=e.apply(this,r);return window.dispatchEvent(new Event(K)),i}}}}function Ce(n){return st(),window.addEventListener("popstate",n),window.addEventListener("hashchange",n),window.addEventListener(K,n),()=>{window.removeEventListener("popstate",n),window.removeEventListener("hashchange",n),window.removeEventListener(K,n)}}const Le="tours:progress";function Q(n,e){n.set(Le,JSON.stringify(e))}function at(n){n.remove(Le)}const dt="tours:seen:";function lt(n,e){const t=n.get(dt+e),r=t?parseInt(t,10):0;return Number.isNaN(r)?0:r}const ct=`
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
`;function pt(n,e){return e?e(n):ut({text:n.text,button:n.button,corner:n.corner,offset:n.offset,onStart:n.onResume})}function ut(n){const e=n.corner??"bottom-right",t=n.offset??24,r=document.createElement("div");r.setAttribute("data-tours-cta","");const i=r.attachShadow({mode:"open"}),o=document.createElement("style");o.textContent=ct,i.appendChild(o);const s=document.createElement("div");s.className="cta";const[l,p]=e.split("-");s.style[l]=`${t}px`,s.style[p]=`${t}px`;const c=()=>{r.parentNode&&r.parentNode.removeChild(r)},h=document.createElement("button");h.className="cta__close",h.type="button",h.textContent="×",h.setAttribute("aria-label","Dismiss"),h.addEventListener("click",c);const g=document.createElement("p");g.className="cta__text",g.textContent=n.text;const u=document.createElement("button");return u.className="cta__btn",u.type="button",u.textContent=n.button,u.addEventListener("click",()=>{c(),n.onStart()}),s.append(h,g,u),i.appendChild(s),document.body.appendChild(r),c}const ht=new Set(["tourStarting","stepChanging"]);function $(n,e,t){const r=ht.has(e);let i=!0;const o=n?.[e];if(o)try{o(t)===!1&&r&&(i=!1)}catch(s){console.error(`[tours] handler for "${e}" threw`,s)}if(typeof document<"u"&&typeof CustomEvent=="function")try{const s=new CustomEvent(`tours:${e}`,{detail:t,cancelable:r});document.dispatchEvent(s),r&&s.defaultPrevented&&(i=!1)}catch(s){console.error(`[tours] could not dispatch "tours:${e}"`,s)}return i}const ft="[data-tours-editor]";function gt(){return typeof document<"u"&&document.querySelector(ft)!==null}function mt(n,e={}){const t=G("player"),r=e.state;let i=null,o=null,s=null,l=null,p=null,c=null,h=null,g=!1,u=0,k=0,y=null;const m=n.display?.padding??B,v=n.display?.radius??j,S=n.display?.cardRadius??U,At=n.display?.offset??V;function ie(d){return D(d.selectors)}function oe(d){return d.action?.type==="click"}function Pt(d){if(!d.condition)return!0;const f=r?lt(r,n.id):0;return ot(d.condition,{url:window.location.href,traits:e.viewer?.(),device:nt(),firstVisit:f===0,seenCount:f})}function M(d){return P(d.pageUrl,window.location.href)}function R(){r&&Q(r,{tourId:n.id,index:u})}function Fe(){if(i)return;i=document.createElement("div"),i.setAttribute("data-tours-player",""),o=i.attachShadow({mode:"open"});const d=document.createElement("style");d.textContent=Ve+ke,o.appendChild(d),p=document.createElement("div"),p.className="tours-backdrop",p.addEventListener("click",f=>{const b=n.steps[u],x=b?ie(b):null;if(x){const w=x.getBoundingClientRect();if(f.clientX>=w.left-m&&f.clientX<=w.right+m&&f.clientY>=w.top-m&&f.clientY<=w.bottom+m)return}A()}),o.appendChild(p),s=document.createElement("div"),s.className="tours-spotlight",s.style.borderRadius=`${v}px`,o.appendChild(s),document.body.appendChild(i)}function Nt(d){if(!p)return;if(!d){p.style.clipPath="";return}const f=d.left-m,b=d.top-m,x=d.right+m,w=d.bottom+m;p.style.clipPath=`polygon(0 0, 0 100%, ${f}px 100%, ${f}px ${b}px, ${x}px ${b}px, ${x}px ${w}px, ${f}px ${w}px, ${f}px 100%, 100% 100%, 100% 0)`}function Me(d){return d.overlay!==!1}function Rt(d){const f=Me(d);p&&(p.style.display=f?"":"none"),s?.classList.toggle("tours-spotlight--plain",!f)}function Ie(d,f=!1){s&&(s.style.transitionDuration=f?"0ms":"",s.style.display="block",s.style.left=`${d.left-m}px`,s.style.top=`${d.top-m}px`,s.style.width=`${d.width+m*2}px`,s.style.height=`${d.height+m*2}px`)}function De(d,f){if(!l)return;const b={top:d.top-m,left:d.left-m,right:d.right+m,bottom:d.bottom+m,width:d.width+m*2,height:d.height+m*2},{top:x,left:w}=ye({target:b,card:{width:l.offsetWidth,height:l.offsetHeight},side:f.placement??"bottom",align:f.align??"center",offset:At,alignOffset:n.display?.alignOffset??0,viewport:{width:window.innerWidth,height:window.innerHeight}});l.style.left=`${w}px`,l.style.top=`${x}px`}function Ot(d){const f=Math.max(1,n.steps.length-k),b=Math.max(1,Math.min(u+1-k,f));l&&l.remove();const x=u===n.steps.length-1,w=n.steps[u-1],I=!!w&&M(w),Dt=!oe(d)||x;l=_e({contentText:d.content.default,progress:`Step ${b} of ${f}`,showClose:!0,onClose:Mt,radius:S,back:I?{label:d.backLabel??"Back",onClick:ce}:void 0,next:Dt?{label:d.nextLabel??(x?"Done":"Next"),primary:!0,onClick:le}:void 0}),o?.appendChild(l)}function T(){if(!g)return;const d=n.steps[u];if(!d){A();return}if(t.log("render step",u,d.id),!Pt(d)){t.log(`step "${d.id}" skipped: condition not met`),$(e.on,"stepSkipped",{tour:n,index:u,step:d,reason:"condition"}),k+=1,u<n.steps.length-1?(u+=1,T()):A(k>=n.steps.length?"dismissed":"completed");return}const f=ie(d);if(!f){t.log(`step "${d.id}" target not found yet — waiting`,d.selectors),Ge(d.selectors,{timeout:4e3}).then(x=>{!g||n.steps[u]!==d||(x?T():(t.warn(`step "${d.id}" skipped: no element for selectors`,d.selectors),$(e.on,"stepSkipped",{tour:n,index:u,step:d,reason:"no-element"}),k+=1,u<n.steps.length-1?(u+=1,T()):A()))});return}Fe(),f.scrollIntoView({behavior:"smooth",block:"center",inline:"center"}),Ot(d);const b=f.getBoundingClientRect();Ie(b),De(b,d),Rt(d),Nt(Me(d)&&oe(d)?b:null),zt(d),$(e.on,"stepActivated",{tour:n,index:u,step:d,target:f})}function zt(d){if(c?.(),c=null,!oe(d))return;const f=u+1,b=n.steps[f];!b||M(b)||(c=Ce(()=>{!g||n.steps[u]!==d||P(b.pageUrl,window.location.href)&&de(f)&&(c?.(),c=null,t.log("visitor navigated → advancing to",b.id),u=f,R(),T())}))}function Be(d){g&&(d.key==="Escape"?(d.preventDefault(),A()):d.key==="ArrowRight"?le():d.key==="ArrowLeft"&&ce())}function J(){if(!g)return;const d=n.steps[u];if(!d)return;const f=ie(d);if(!f)return;const b=f.getBoundingClientRect();Ie(b,!0),De(b,d)}function je(d=0){if(g||n.steps.length===0)return;if(!e.allowWhileEditing&&gt()){t.log(`start suppressed for "${n.id}" — the builder is mounted`);return}const f=Math.max(0,Math.min(d,n.steps.length-1));if(!$(e.on,"tourStarting",{tour:n,index:f})){t.log("start vetoed by handler");return}ae(),g=!0,u=f,k=0,t.log("start",n.id,`at ${u}/${n.steps.length}`),Fe(),window.addEventListener("keydown",Be,!0),window.addEventListener("resize",J,!0),window.addEventListener("scroll",J,!0),R(),$(e.on,"tourStarted",{tour:n,index:u}),T()}function Ft(){s&&(s.style.display="none"),l&&(l.remove(),l=null)}function q(){Ft(),!y&&(y=Ce(()=>{if(!g){y?.(),y=null;return}const d=n.steps[u];d&&M(d)&&(y?.(),y=null,T())}))}function se(){y&&(y(),y=null),c&&(c(),c=null),g&&(g=!1,window.removeEventListener("keydown",Be,!0),window.removeEventListener("resize",J,!0),window.removeEventListener("scroll",J,!0),i&&i.parentNode&&i.parentNode.removeChild(i),i=null,o=null,s=null,l=null,p=null)}function A(d="dismissed"){t.log("stop",d);const f=g,b=u;ae(),se(),r&&at(r),f&&(d==="completed"?$(e.on,"tourCompleted",{tour:n}):$(e.on,"tourDismissed",{tour:n,index:b}))}function ae(){h?.(),h=null}function Mt(){n.dismiss?.mode==="minimize"?Ue():A()}function Ue(){g&&(t.log("minimized",n.id,`at ${u}`),se(),r&&Q(r,{tourId:n.id,index:u,minimized:!0}),$(e.on,"tourMinimized",{tour:n,index:u}),It())}function It(){ae();const d=n.dismiss?.resume;h=pt({tourId:n.id,text:d?.text??"Carry on with the tour?",button:d?.button??"Resume",corner:d?.corner,offset:d?.offset,onResume:()=>{h=null,r&&Q(r,{tourId:n.id,index:u}),$(e.on,"tourResumed",{tour:n,index:u}),je(u)}},e.renderResume)}function de(d){const f=n.steps[d];return f?$(e.on,"stepChanging",{tour:n,from:u,to:d,step:f}):!0}function le(){if(!g)return;const d=u+1,f=n.steps[d];if(!f){A("completed");return}if(!de(d)){t.log("step change vetoed by handler");return}if(M(f)){u=d,R(),T();return}u=d,R();const b=I=>{se(),e.onNavigate?e.onNavigate(I,f.id):window.location.assign(I)},x=n.steps[u-1]?.action;if(x&&x.type==="navigate"&&x.url){x.url.startsWith("#")?(t.log("page transition (hash navigate) → resume at",u),q(),window.location.hash=x.url):(t.log("page transition (navigate) → resume at",u),b(x.url));return}const w=Ee(f.pageUrl);if(w){w.startsWith("#")?(t.log("page transition (derived hash) → resume at",u),q(),window.location.hash=w):(t.log("page transition (derived navigate) → resume at",u,w),b(w));return}t.log("page transition (wait) → resume at",u),q()}function ce(){if(!g)return;const d=n.steps[u-1];if(d){if(!de(u-1)){t.log("step change vetoed by handler");return}if(M(d)){u-=1,R(),T();return}u-=1,R(),t.log("page transition back → resume at",u),q(),window.history.back()}}return{start:je,stop:A,next:le,prev:ce,minimize:Ue,isActive:()=>g}}const bt=`
:host {
  all: initial;
  --e-bg: #ffffff;
  --e-fg: #1f2733;
  --e-muted: #6b7280;
  --e-border: #e5e7eb;
  --e-surface: #f7f8fa;
  --e-accent: #2563eb;
  --e-accent-soft: #eff3ff;
  --e-radius: 12px;
  --e-shadow: 0 12px 32px rgba(15, 23, 42, 0.16);
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
}

button { font: inherit; cursor: pointer; }

/* ---------- Builder panel ---------- */
.panel {
  position: fixed;
  top: calc(16px + var(--e-top, 0px));
  bottom: 76px;
  width: 380px;
  z-index: 2147483200;
  display: flex;
  flex-direction: column;
  background: var(--e-bg);
  color: var(--e-fg);
  border: 1px solid var(--e-border);
  border-radius: var(--e-radius);
  box-shadow: var(--e-shadow);
  overflow: hidden;
}
.panel--right { right: 16px; }
.panel--left { left: 16px; }

.panel__header {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 14px 10px;
}
.panel__title {
  font-size: 15px;
  font-weight: 700;
  border: 1px solid transparent;
  border-radius: 6px;
  padding: 2px 6px;
  margin: 0 -6px;
  background: transparent;
  color: inherit;
  min-width: 0;
  flex: 1;
}
.panel__title:hover { background: var(--e-surface); }
.panel__title:focus { outline: none; border-color: var(--e-accent); background: #fff; }

.panel__title--static { pointer-events: none; }
.panel__title--static:hover { background: transparent; }

/* Tours / Templates switch in the list header */
.listtabs { display: flex; gap: 12px; flex: 1; }
.listtab {
  font-size: 15px;
  font-weight: 700;
  color: var(--e-muted);
  background: transparent;
  border: none;
  padding: 2px 0;
  cursor: pointer;
}
.listtab:hover { color: var(--e-fg); }
.listtab--active { color: var(--e-accent); }

.tourrow__use {
  font-size: 12px;
  font-weight: 600;
  color: #fff;
  background: var(--e-accent);
  border: none;
  border-radius: 7px;
  padding: 5px 12px;
  cursor: pointer;
}
.tourrow__use:hover { background: #1d4ed8; }

/* ⋯ dropdown menu */
.menu {
  position: absolute;
  top: 46px;
  right: 12px;
  z-index: 5;
  min-width: 160px;
  padding: 6px;
  background: var(--e-bg);
  border: 1px solid var(--e-border);
  border-radius: 10px;
  box-shadow: var(--e-shadow);
  display: flex;
  flex-direction: column;
}
.menu__item {
  text-align: left;
  font-size: 13px;
  color: var(--e-fg);
  background: transparent;
  border: none;
  border-radius: 6px;
  padding: 8px 10px;
  cursor: pointer;
}
.menu__item:hover { background: var(--e-surface); }

.newtour {
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  background: var(--e-accent);
  border: none;
  border-radius: 8px;
  padding: 6px 12px;
  white-space: nowrap;
}
.newtour:hover { background: #1d4ed8; }

/* ---------- Tour list ---------- */
.tourlist { display: flex; flex-direction: column; gap: 8px; }
.tourrow {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: var(--e-bg);
  border: 1px solid var(--e-border);
  border-radius: 10px;
  cursor: pointer;
}
.tourrow:hover { border-color: var(--e-accent); box-shadow: 0 0 0 3px var(--e-accent-soft); }
.tourrow__main { flex: 1; min-width: 0; }
.tourrow__name {
  font-size: 14px;
  font-weight: 600;
  color: var(--e-fg);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.tourrow__meta { font-size: 12px; color: var(--e-muted); margin-top: 2px; }

.status {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 3px 8px;
  border-radius: 999px;
  background: var(--e-surface);
  color: var(--e-muted);
  border: 1px solid var(--e-border);
}
.status--published { background: #ecfdf5; color: #047857; border-color: #a7f3d0; }

.iconbtn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  padding: 0;
  color: var(--e-muted);
  background: transparent;
  border: 1px solid transparent;
  border-radius: 8px;
}
.iconbtn:hover { background: var(--e-surface); color: var(--e-fg); }
.iconbtn--active { background: var(--e-accent); color: #fff; }
.iconbtn--active:hover { background: var(--e-accent); color: #fff; }
.iconbtn svg { width: 18px; height: 18px; display: block; }

.panel__toolbar {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0 12px 10px;
  border-bottom: 1px solid var(--e-border);
}
.panel__toolbar .spacer { flex: 1; }

.tabs {
  display: flex;
  gap: 4px;
  padding: 10px 12px 0;
}
.tab {
  font-size: 13px;
  font-weight: 600;
  color: var(--e-muted);
  background: transparent;
  border: none;
  border-radius: 8px;
  padding: 6px 10px;
}
.tab--active { color: var(--e-fg); background: var(--e-surface); }

.panel__body {
  flex: 1;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 14px 16px 20px;
  /* Reserve the scrollbar gutter always, so content width never shifts. */
  scrollbar-gutter: stable;
  /* Modern thin, auto-hiding scrollbar (Firefox). */
  scrollbar-width: thin;
  scrollbar-color: rgba(100, 116, 139, 0.35) transparent;
}
/* WebKit/Blink: slim, rounded, only-thumb, fades in on hover. */
.panel__body::-webkit-scrollbar { width: 10px; }
.panel__body::-webkit-scrollbar-track { background: transparent; }
.panel__body::-webkit-scrollbar-thumb {
  background-color: transparent;
  border: 3px solid transparent;
  border-radius: 999px;
  background-clip: padding-box;
}
.panel__body:hover::-webkit-scrollbar-thumb {
  background-color: rgba(100, 116, 139, 0.35);
}
.panel__body::-webkit-scrollbar-thumb:hover {
  background-color: rgba(100, 116, 139, 0.6);
}

/* ---------- Step list ---------- */
.steps { display: flex; flex-direction: column; align-items: stretch; }

.connector {
  align-self: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--e-border);
}
.connector__line { width: 1px; height: 12px; background: var(--e-border); }
.connector__add {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  color: var(--e-muted);
  background: var(--e-bg);
  border: 1px solid var(--e-border);
  border-radius: 999px;
  font-size: 15px;
  line-height: 1;
}
.connector__add:hover { color: var(--e-accent); border-color: var(--e-accent); }

/* ---------- Card ---------- */
.card {
  border: 1px solid var(--e-border);
  border-radius: 10px;
  background: var(--e-bg);
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
  overflow: hidden;
}
.card--active { border-color: var(--e-accent); box-shadow: 0 0 0 3px var(--e-accent-soft); }
.card--excluded { opacity: 0.55; }
.card--offpage .card__content { opacity: 0.6; }
.card__page {
  font-size: 11px;
  font-weight: 600;
  color: var(--e-muted);
  background: var(--e-surface);
  border: 1px solid var(--e-border);
  border-radius: 5px;
  padding: 1px 6px;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.pagecfg__input {
  width: 100%;
  box-sizing: border-box;
  font: inherit;
  font-size: 13px;
  padding: 7px 9px;
  border: 1px solid var(--e-border);
  border-radius: 8px;
  background: #fff;
  margin-bottom: 8px;
}
.pagecfg__input:focus { outline: none; border-color: var(--e-accent); }
.tsel {
  width: 100%;
  box-sizing: border-box;
  font: inherit;
  font-size: 13px;
  padding: 7px 9px;
  border: 1px solid var(--e-border);
  border-radius: 8px;
  background: #fff;
  color: var(--e-fg);
  cursor: pointer;
}
.tsel:focus { outline: none; border-color: var(--e-accent); }
.pagecfg__use {
  font-size: 12px;
  font-weight: 600;
  color: var(--e-accent);
  background: var(--e-accent-soft);
  border: 1px solid #c7d6ff;
  border-radius: 7px;
  padding: 5px 12px;
  cursor: pointer;
  margin-bottom: 10px;
}
.pagecfg__use:hover { background: #e3ebff; }

.card__control {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-bottom: 1px solid var(--e-border);
}
.card__check { width: 16px; height: 16px; accent-color: var(--e-accent); cursor: pointer; }
.card__type {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: var(--e-muted);
}
.card__index {
  width: 18px; height: 18px;
  display: inline-flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 700;
  color: var(--e-muted);
  background: var(--e-surface);
  border-radius: 5px;
}
.card__control .spacer { flex: 1; }
.card__sel {
  font-size: 11px;
  color: var(--e-muted);
  max-width: 130px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
}
.card__sel--empty { color: #d97706; }
.card__sel {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 5px;
  padding: 1px 5px;
  cursor: pointer;
}
.card__sel:hover { background: var(--e-surface); border-color: var(--e-border); }
.card__selcount {
  font-family: system-ui, sans-serif;
  font-size: 10px;
  font-weight: 700;
  color: var(--e-accent);
}
.card__page { cursor: pointer; }
.card__page:hover { border-color: var(--e-accent); color: var(--e-fg); }

/* Selector list editor, floated over the panel body. */
.selpop {
  position: sticky;
  top: 0;
  z-index: 4;
  margin: 0 0 12px;
  padding: 10px;
  background: var(--e-bg);
  border: 1px solid var(--e-accent);
  border-radius: 10px;
  box-shadow: var(--e-shadow);
}
.selpop__head { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.selpop__head .spacer { flex: 1; }
.selpop__title { font-size: 12px; font-weight: 700; color: var(--e-fg); }
.selpop__empty { margin: 0 0 8px; font-size: 12px; color: var(--e-muted); }
.selpop__list { display: flex; flex-direction: column; gap: 4px; margin-bottom: 8px; }
.selpop__row {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 3px 4px;
  border-radius: 6px;
}
.selpop__row:hover { background: var(--e-surface); }
.selpop__rank {
  flex: none;
  width: 16px; height: 16px;
  display: inline-flex; align-items: center; justify-content: center;
  font-size: 10px; font-weight: 700;
  color: var(--e-muted);
  background: var(--e-surface);
  border-radius: 4px;
}
.selpop__code {
  flex: 1;
  min-width: 0;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 11px;
  color: var(--e-fg);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.selpop__add {
  width: 100%;
  font: inherit;
  font-size: 12px;
  padding: 7px 10px;
  color: var(--e-fg);
  background: var(--e-surface);
  border: 1px dashed var(--e-border);
  border-radius: 8px;
  cursor: pointer;
}
.selpop__add:hover { border-color: var(--e-accent); }
.selpop__add + .selpop__add { margin-top: 6px; }
.selpop__page {
  display: block;
  width: 100%;
  text-align: left;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 11px;
  color: var(--e-fg);
  background: transparent;
  border: none;
  border-radius: 6px;
  padding: 5px 6px;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.selpop__page:hover { background: var(--e-surface); }

/* Visitor-trait key/value rows. */
.traits { display: flex; flex-direction: column; gap: 6px; margin-bottom: 6px; }
.traits__row { display: flex; align-items: center; gap: 6px; }
.traits__key, .traits__val {
  min-width: 0;
  font: inherit;
  font-size: 12px;
  color: var(--e-fg);
  background: var(--e-surface);
  border: 1px solid var(--e-border);
  border-radius: 6px;
  padding: 5px 7px;
}
.traits__key { flex: 0 1 40%; }
.traits__val { flex: 1 1 60%; }
.traits__key:focus, .traits__val:focus { outline: none; border-color: var(--e-accent); }
.traits__add {
  align-self: flex-start;
  font: inherit;
  font-size: 12px;
  color: var(--e-muted);
  background: transparent;
  border: 1px dashed var(--e-border);
  border-radius: 6px;
  padding: 5px 9px;
  cursor: pointer;
}
.traits__add:hover { color: var(--e-fg); border-color: var(--e-accent); }
.selpop__add--on { color: #fff; background: var(--e-accent); border-style: solid; border-color: var(--e-accent); }

.card__content {
  padding: 12px;
  font-size: 14px;
  line-height: 1.5;
  color: var(--e-fg);
  min-height: 22px;
  outline: none;
  white-space: pre-wrap;
  word-break: break-word;
}
.card__content:empty::before {
  content: attr(data-placeholder);
  color: var(--e-muted);
}
.card__content:focus { background: #fffef8; }

.card__footer {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 10px 10px;
}
.cardbtn {
  font-size: 12px;
  font-weight: 600;
  color: var(--e-fg);
  background: var(--e-surface);
  border: 1px solid var(--e-border);
  border-radius: 7px;
  padding: 5px 12px;
  min-width: 56px;
}
.cardbtn:hover { background: #eef0f3; }
.cardbtn--edit {
  background: #fff;
  border-color: var(--e-accent);
  text-align: center;
}

/* ---------- Bottom/top navigation ---------- */
.nav {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2147483210;
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 6px;
  background: var(--e-bg);
  border: 1px solid var(--e-border);
  border-radius: 999px;
  box-shadow: var(--e-shadow);
}
.nav--bottom { bottom: 18px; }
.nav--top { top: calc(18px + var(--e-top, 0px)); }
.nav__sep { width: 1px; height: 22px; background: var(--e-border); margin: 0 4px; }

/* ---------- Active-step target highlight (dashed, no backdrop) ---------- */
.highlight {
  position: fixed;
  z-index: 2147483100;
  box-sizing: border-box;
  border: 2px dashed var(--e-accent);
  border-radius: 6px;
  background: rgba(37, 99, 235, 0.06);
  pointer-events: none;
  transition: all 120ms ease-out;
  display: none;
}

.highlight--settings {
  border-color: #f59e0b;
  background: rgba(245, 158, 11, 0.10);
}

.assets-empty {
  color: var(--e-muted);
  font-size: 13px;
  text-align: center;
  padding: 32px 12px;
}

/* ---------- Card-settings accordion ---------- */
.acc { border-top: 1px solid var(--e-border); }
.acc__head {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 10px 12px;
  font-size: 13px;
  font-weight: 600;
  color: var(--e-fg);
  text-align: left;
  background: transparent;
  border: none;
  cursor: pointer;
}
.acc__head:hover { background: var(--e-surface); }
.acc__caret {
  display: inline-flex;
  color: var(--e-muted);
  transition: transform 120ms ease;
}
.acc__caret svg { width: 16px; height: 16px; }
.acc--open .acc__caret { transform: rotate(90deg); }
.acc__body { padding: 4px 14px 14px; }

/* ---------- Per-step placement picker ---------- */
.place {
  padding: 0;
}
.place__auto {
  display: block;
  margin: 10px auto 0;
  font-size: 12px;
  font-weight: 600;
  color: var(--e-muted);
  background: var(--e-bg);
  border: 1px solid var(--e-border);
  border-radius: 999px;
  padding: 3px 12px;
  cursor: pointer;
}
.place__auto:hover { color: var(--e-fg); }
.place__auto--active { color: #fff; background: var(--e-accent); border-color: var(--e-accent); }
.place__grid {
  position: relative;
  width: 132px;
  height: 96px;
  margin: 0 auto 6px;
  background: var(--e-bg);
  border: 1px solid var(--e-border);
  border-radius: 8px;
}
.place__el {
  position: absolute;
  left: 40px;
  top: 32px;
  width: 52px;
  height: 32px;
  background: var(--e-accent-soft);
  border: 1px solid #c7d6ff;
  border-radius: 5px;
}
.place__dot {
  position: absolute;
  width: 12px;
  height: 12px;
  padding: 0;
  border-radius: 999px;
  background: #cdd3de;
  border: 2px solid var(--e-bg);
  cursor: pointer;
}
.place__dot:hover { background: var(--e-muted); }
.place__dot--active {
  background: var(--e-accent);
  box-shadow: 0 0 0 3px var(--e-accent-soft);
}

/* ---------- Settings blocks (Styles / Rules / Page) ---------- */
.settings { padding: 0; }
.settings__divider { height: 1px; background: var(--e-border); margin: 14px 0; }
.settings__checkrow {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--e-fg);
  margin-bottom: 12px;
  cursor: pointer;
}
.settings__check { width: 16px; height: 16px; accent-color: var(--e-accent); cursor: pointer; }
.subtabs {
  display: inline-flex;
  gap: 2px;
  padding: 3px;
  margin-bottom: 14px;
  background: var(--e-surface);
  border-radius: 9px;
}
.subtab {
  font-size: 12px;
  font-weight: 600;
  color: var(--e-muted);
  background: transparent;
  border: none;
  border-radius: 6px;
  padding: 5px 12px;
}
.subtab--active { color: var(--e-fg); background: #fff; box-shadow: 0 1px 2px rgba(15,23,42,0.08); }
.settings__field { margin-bottom: 12px; }
.settings__label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: var(--e-fg);
  margin-bottom: 8px;
}
.settings__row { display: flex; align-items: center; gap: 12px; }
.settings__slider { flex: 1; accent-color: #f59e0b; }
.settings__value {
  min-width: 42px;
  text-align: right;
  font-size: 13px;
  font-weight: 600;
  color: var(--e-muted);
  font-variant-numeric: tabular-nums;
  cursor: text;
  border-radius: 4px;
  padding: 1px 3px;
}
.settings__value:hover { background: var(--e-surface); color: var(--e-fg); }
.settings__num {
  width: 48px;
  text-align: right;
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  color: var(--e-fg);
  background: #fff;
  border: 1px solid var(--e-accent);
  border-radius: 4px;
  padding: 1px 3px;
  font-variant-numeric: tabular-nums;
  outline: none;
}
.settings__hint {
  font-size: 12px;
  line-height: 1.5;
  color: var(--e-muted);
}
`,Z={cursor:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m4 4 7 17 2.5-7L21 11.5 4 4Z"/></svg>',back:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>',chevron:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>',menu:'<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></svg>',panelSide:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M15 4v16"/></svg>',navFlip:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18"/><path d="m7 8 5-5 5 5"/><path d="m7 16 5 5 5-5"/></svg>',build:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>',preview:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',close:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',trash:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>',bolt:'<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z"/></svg>',step:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 2"/></svg>',download:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/></svg>',upload:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M17 8l-5-5-5 5"/><path d="M12 3v12"/></svg>'};let vt=0;function N(n){const e=typeof crypto<"u"&&"randomUUID"in crypto?crypto.randomUUID():`${vt++}`;return`${n}-${e}`}function F(n="step"){return{id:N("step"),type:n,included:!0,selectors:[],content:"",page:"",placement:"auto",align:"center",backLabel:"Back",nextLabel:"Next",overlay:!0}}function H(n="tour"){return{id:N(n),kind:n,name:n==="template"?"Untitled template":"Untitled tour",status:"draft",trigger:{type:"manual"},audience:"all",conditions:{firstVisitOnly:!0,maxShows:0,device:"any",traits:{}},dismissMode:"end",resumeText:"",resumeButton:"",steps:[F()],display:{padding:B,radius:j,cardRadius:U,offset:V,alignOffset:0}}}function ee(n,e,t){return{id:N(e),kind:e,name:t??n.name,status:"draft",trigger:{...n.trigger},audience:n.audience,conditions:{...n.conditions,traits:{...n.conditions.traits}},dismissMode:n.dismissMode??"end",resumeText:n.resumeText??"",resumeButton:n.resumeButton??"",steps:n.steps.map(r=>({...r,id:N("step"),selectors:[...r.selectors]})),display:{...n.display}}}function $e(n){if(n&&typeof n=="object"){const e=n;if(e.type==="load")return{type:"load"};if(e.type==="selector"&&typeof e.selector=="string")return{type:"selector",selector:e.selector};if(e.type==="timer"&&typeof e.delay=="number")return{type:"timer",delay:e.delay};if(e.type==="cta"&&typeof e.text=="string"&&typeof e.button=="string"){const t=["bottom-right","bottom-left","top-right","top-left"];return{type:"cta",text:e.text,button:e.button,corner:t.includes(e.corner)?e.corner:"bottom-right",offset:typeof e.offset=="number"?e.offset:void 0}}}return{type:"manual"}}function W(n){if(!Array.isArray(n))return[];const e=[];for(const t of n){if(!t||typeof t!="object")continue;const r=t;typeof r.id!="string"||!Array.isArray(r.steps)||e.push({id:r.id,kind:r.kind==="template"?"template":"tour",name:typeof r.name=="string"?r.name:"Untitled tour",status:r.status==="published"?"published":"draft",trigger:$e(r.trigger),audience:r.audience==="auth"||r.audience==="guest"?r.audience:"all",dismissMode:r.dismissMode==="minimize"?"minimize":"end",resumeText:typeof r.resumeText=="string"?r.resumeText:"",resumeButton:typeof r.resumeButton=="string"?r.resumeButton:"",conditions:{firstVisitOnly:(r.conditions?.firstVisitOnly??!0)===!0,maxShows:C(r.conditions?.maxShows,0),device:["mobile","tablet","desktop"].includes(r.conditions?.device)?r.conditions.device:"any",traits:Pe(r.conditions?.traits)},display:{padding:C(r.display?.padding,B),radius:C(r.display?.radius,j),cardRadius:C(r.display?.cardRadius,U),offset:C(r.display?.offset,V),alignOffset:C(r.display?.alignOffset,0)},steps:r.steps.filter(i=>!!i&&typeof i=="object").map(i=>({...F(i.type==="action"?"action":"step"),...i}))})}return e}function C(n,e){return typeof n=="number"&&n>=0?n:e}function Te(n){const e=n.steps.filter(i=>i.included&&i.selectors.length>0).map(i=>({id:i.id,selectors:i.selectors,content:{default:i.content},placement:i.placement,align:i.align,backLabel:i.backLabel,nextLabel:i.nextLabel,...i.page?{pageUrl:{glob:i.page}}:{},...i.action?{action:i.action}:{},...i.overlay===!1?{overlay:!1}:{},...i.condition&&Object.keys(i.condition).length>0?{condition:i.condition}:{}})),t={};n.conditions.firstVisitOnly&&(t.firstVisitOnly=!0),n.conditions.maxShows>0&&(t.maxShows=n.conditions.maxShows),n.conditions.device!=="any"&&(t.device=n.conditions.device),Object.keys(n.conditions.traits).length>0&&(t.traits={...n.conditions.traits});const r=Object.keys(t).length>0?[{when:t}]:void 0;return{id:n.id,schemaVersion:Qe,title:{default:n.name},steps:e,trigger:n.trigger,audience:n.audience,...r?{rules:r}:{},...n.dismissMode==="minimize"?{dismiss:{mode:"minimize",...n.resumeText||n.resumeButton?{resume:{text:n.resumeText||"Carry on with the tour?",button:n.resumeButton||"Resume"}}:{}}}:{},display:{padding:n.display.padding,radius:n.display.radius,cardRadius:n.display.cardRadius,offset:n.display.offset,alignOffset:n.display.alignOffset}}}function Ae(n){return et(Te(n))}function Pe(n){if(!n||typeof n!="object")return{};const e={};for(const[t,r]of Object.entries(n))(typeof r=="string"||typeof r=="number")&&(e[t]=String(r));return e}function xt(n){if(!n||typeof n!="object")return!1;const e=n;return"schemaVersion"in e||typeof e.title=="object"&&e.title!==null}function yt(n){const e=n.rules&&n.rules[0]?.when||{},t=e.device;return{id:typeof n.id=="string"&&n.id?n.id:N("tour"),kind:"tour",name:n.title?.default??"Imported tour",status:"draft",trigger:$e(n.trigger),audience:n.audience==="auth"||n.audience==="guest"?n.audience:"all",dismissMode:n.dismiss?.mode==="minimize"?"minimize":"end",resumeText:n.dismiss?.resume?.text??"",resumeButton:n.dismiss?.resume?.button??"",conditions:{firstVisitOnly:e.firstVisitOnly===!0,maxShows:C(e.maxShows,0),device:t==="mobile"||t==="tablet"||t==="desktop"?t:"any",traits:Pe(e.traits)},display:{padding:C(n.display?.padding,B),radius:C(n.display?.radius,j),cardRadius:C(n.display?.cardRadius,U),offset:C(n.display?.offset,V),alignOffset:C(n.display?.alignOffset,0)},steps:(Array.isArray(n.steps)?n.steps:[]).map(r=>({...F("step"),id:typeof r.id=="string"&&r.id?r.id:N("step"),selectors:Array.isArray(r.selectors)?r.selectors.filter(i=>typeof i=="string"):[],content:typeof r.content?.default=="string"?r.content.default:"",page:r.pageUrl?.glob??"",placement:r.placement??"auto",align:r.align??"center",overlay:r.overlay!==!1,...r.condition?{condition:r.condition}:{},backLabel:r.backLabel??"Back",nextLabel:r.nextLabel??"Next",...r.action?{action:r.action}:{},...r.overlay===!1?{overlay:!1}:{},...r.condition&&Object.keys(r.condition).length>0?{condition:r.condition}:{}}))}}function wt(n){const e=Array.isArray(n)?n:[n],t=[];for(const r of e)if(xt(r))t.push(yt(r));else{const[i]=W([r]);i&&t.push(i)}return t}function Ne(n="tours:drafts"){return{async load(){try{const e=localStorage.getItem(n);return e?W(JSON.parse(e)):null}catch{return null}},async save(e){try{localStorage.setItem(n,JSON.stringify(e))}catch{}}}}function _t(n){const e={"Content-Type":"application/json"};return n.nonce&&(e["X-WP-Nonce"]=n.nonce),{async load(){const t=await fetch(n.url,{headers:e,credentials:"same-origin"});if(!t.ok)throw new Error(`WordPress load failed: ${t.status}`);return W(await t.json())},async save(t){const r=await fetch(n.url,{method:"POST",headers:e,credentials:"same-origin",body:JSON.stringify(t)});if(!r.ok)throw new Error(`WordPress save failed: ${r.status}`)}}}const kt=["/sitemap.xml","/sitemap_index.xml","/wp-sitemap.xml","/sitemap-index.xml"],Et=5,te=2e3;let Re=null;function Oe(n){const e=[],t=/<loc>\s*([^<\s]+)\s*<\/loc>/gi;let r;for(;(r=t.exec(n))!==null;)e.push(r[1]);return e}async function ze(n){try{const e=await fetch(n,{credentials:"same-origin"});if(!e.ok)return null;const t=await e.text();return t.includes("<loc>")?t:null}catch{return null}}function St(){return Re??(Re=(async()=>{for(const n of kt){const e=await ze(new URL(n,window.location.origin).href);if(!e)continue;const t=Oe(e);if(!/<sitemapindex/i.test(e))return t.slice(0,te);const i=[];for(const o of t.slice(0,Et)){const s=await ze(o);if(s&&i.push(...Oe(s)),i.length>=te)break}return i.slice(0,te)}return[]})()),Re}function Ct(n,e,t=8){const r=e.trim().toLowerCase();return r?n.filter(i=>i.toLowerCase().includes(r)).sort((i,o)=>i.length-o.length).slice(0,t):[...n].sort((i,o)=>i.length-o.length).slice(0,t)}function Lt(n){const e=n.trim().replace(/[*\s]+$/,"");return e?`${e}*`:""}const re="tours-resume";function a(n,e={},t=[]){const r=document.createElement(n);for(const[i,o]of Object.entries(e))r.setAttribute(i,o);for(const i of t)r.append(typeof i=="string"?document.createTextNode(i):i);return r}function _(n,e,t=""){const r=a("button",{class:`iconbtn ${t}`.trim(),title:e,type:"button"});return r.innerHTML=Z[n]??"",r}function $t(n){switch(n){case"load":return"Starts automatically as soon as a matching page loads.";case"selector":return"Starts when an element matching the selector appears in the page (waits for it).";case"timer":return"Starts after the delay elapses on a matching page.";case"cta":return"Shows a small invitation in a corner; its button starts the tour.";case"manual":default:return'Starts from the [site_tour] shortcode or any element with a data-site-tour="<id>" attribute.'}}function Tt(n){switch(n){case"load":return{type:"load"};case"selector":return{type:"selector",selector:""};case"timer":return{type:"timer",delay:3e3};case"cta":return{type:"cta",text:"Need a hand getting started?",button:"Start tour",corner:"bottom-right",offset:24};default:return{type:"manual"}}}class ne{constructor(e={}){this.options=e,this.log=G("editor"),this.host=null,this.root=null,this.tours=[H()],this.openTourId=this.tours[0].id,this.view="edit",this.listFilter="tour",this.menuOpen=!1,this.activeStepId=this.tours[0].steps[0]?.id??null,this.tab="steps",this.displaySub="tour",this.openSections=new Set,this.mode="build",this.picker=null,this.picking=!1,this.pickAppend=!1,this.selectorEditorFor=null,this.pageEditorFor=null,this.pages=null,this.pageQuery="",this.dragFrom=null,this.player=null,this.highlight=null,this.cardPreview=null,this.focusStepId=null,this.onViewportChange=()=>this.updateOverlays(!0),this.saveTimer=null,this.navPosition=e.navPosition??"bottom",this.panelPosition=e.panelPosition??"right",this.topOffset=Math.max(0,e.topOffset??0),this.local=e.store??Ne(e.storageKey),this.secondary=e.storage??null}static fromUrl(e={}){const t=e.urlFlag??"tours-edit",r=new URLSearchParams(window.location.search).get(t);if(r===null||r==="0"||r==="false")return null;const i=new ne(e);return i.mount(),i}mount(){if(this.host||this.options.mode==="off")return;this.host=a("div",{"data-tours-editor":""}),this.host.style.setProperty("--e-top",`${this.topOffset}px`),this.root=this.host.attachShadow({mode:"open"});const e=document.createElement("style");e.textContent=bt+ke,this.root.appendChild(e),this.highlight=a("div",{class:"highlight"}),this.root.append(this.highlight),document.body.appendChild(this.host),window.addEventListener("scroll",this.onViewportChange,!0),window.addEventListener("resize",this.onViewportChange,!0),this.log.log("mounted"),this.render(),this.hydrate()}async hydrate(){const e=await this.local.load();e&&e.length>0&&(this.tours=e,this.openTourId=e[0].id,this.activeStepId=e[0].steps[0]?.id??null,this.log.log("hydrated",`${e.length} tour(s)`)),this.applyResume()||this.render()}markDirty(){this.saveTimer!==null&&clearTimeout(this.saveTimer),this.saveTimer=setTimeout(()=>{this.saveTimer=null,this.persist()},400)}async persist(){const e=this.tours;if(await this.local.save(e),this.secondary)try{await this.secondary.save(e)}catch(t){this.log.warn("secondary store save failed (localStorage kept the draft)",t)}}destroy(){this.stopPicking(),this.player?.stop(),this.player=null,this.saveTimer!==null&&(clearTimeout(this.saveTimer),this.saveTimer=null,this.persist()),window.removeEventListener("scroll",this.onViewportChange,!0),window.removeEventListener("resize",this.onViewportChange,!0),this.host?.parentNode&&this.host.parentNode.removeChild(this.host),this.host=null,this.root=null,this.highlight=null,this.cardPreview=null}export(){return Ae(this.tour)}get tour(){return this.tours.find(e=>e.id===this.openTourId)??this.tours[0]}get activeStep(){return this.tour.steps.find(e=>e.id===this.activeStepId)??null}openTour(e){this.openTourId=e,this.view="edit",this.tab="steps",this.activeStepId=this.tour.steps[0]?.id??null,this.render()}createEntity(){const e=H(this.listFilter);this.tours.push(e),this.openTour(e.id)}deleteEntity(e){const t=this.tours.findIndex(r=>r.id===e);t!==-1&&(this.tours.splice(t,1),this.tours.some(r=>r.kind==="tour")||this.tours.push(H()),this.openTourId===e&&(this.openTourId=this.tours[0].id),this.render())}saveAsTemplate(){const e=ee(this.tour,"template",`${this.tour.name} (template)`);this.tours.push(e),this.listFilter="template",this.view="list",this.menuOpen=!1,this.log.log("saved as template",e.id),this.render()}createFromTemplate(e){const t=this.tours.find(i=>i.id===e);if(!t)return;const r=ee(t,"tour",t.name.replace(/\s*\(template\)\s*$/,""));this.tours.push(r),this.openTour(r.id)}setActive(e){this.activeStepId!==e&&(this.activeStepId=e,this.render())}addStepAfter(e,t="step"){const r=F(t);r.page=this.currentPage(),this.tour.steps.splice(e+1,0,r),this.activeStepId=r.id,t==="step"&&!this.picking?this.togglePicking():this.render(),this.revealStep(r.id)}revealStep(e){const t=this.root?.querySelector(`.card[data-step-id="${CSS.escape(e)}"]`);if(!t)return;const r=t.closest(".panel__body");if(r&&this.tour.steps[this.tour.steps.length-1]?.id===e){r.scrollTo({top:r.scrollHeight,behavior:"smooth"});return}t.scrollIntoView({block:"nearest",behavior:"smooth"})}currentPage(){return`${window.location.origin}${window.location.pathname}*`}removeStep(e){const t=this.tour.steps.findIndex(r=>r.id===e);t!==-1&&(this.tour.steps.splice(t,1),this.activeStepId===e&&(this.activeStepId=this.tour.steps[Math.max(0,t-1)]?.id??null),this.render())}togglePicking(e=!1){if(this.picking){this.stopPicking();return}const t=this.activeStep;t&&(this.picking=!0,this.pickAppend=e,this.picker=Ke(r=>{if(this.pickAppend)for(const i of r)t.selectors.includes(i)||t.selectors.push(i);else t.selectors=r;t.page||(t.page=this.currentPage()),this.picking=!1,this.pickAppend=!1,this.picker=null,this.log.log("bound selector to step",t.id,r),this.render()},{ignore:[this.host]}),this.picker.start(),this.render())}stopPicking(){this.picker?.stop(),this.picker=null,this.picking=!1,this.pickAppend=!1}togglePreview(){if(this.mode==="preview"){this.player?.stop(),this.player=null,this.mode="build",this.render();return}this.startPreview()}startPreview(e){const t=this.export();if(!t.ok)return this.log.warn("cannot preview — draft is invalid",t.errors),e||window.alert(`Add a selector and text to at least one step first:

${t.errors.join(`
`)}`),!1;this.mode="preview",this.render(),this.player=mt(t.tour,{onNavigate:(i,o)=>this.navigateForResume(i,o,"preview"),allowWhileEditing:!0});const r=e?t.tour.steps.findIndex(i=>i.id===e):0;return this.player.start(Math.max(0,r)),!0}async navigateForResume(e,t,r){this.saveTimer!==null&&(clearTimeout(this.saveTimer),this.saveTimer=null),await this.persist();const i=new URL(e,window.location.href);i.searchParams.set(re,`${r}~${this.openTourId}~${t}`),this.log.log("navigating for resume",i.toString()),window.location.assign(i.toString())}applyResume(){const e=new URLSearchParams(window.location.search),t=e.get(re);if(!t)return!1;e.delete(re);const r=e.toString(),i=window.location.pathname+(r?`?${r}`:"")+window.location.hash;window.history.replaceState(window.history.state,"",i);const[o,s,l]=t.split("~"),p=this.tours.find(c=>c.id===s);return p?(this.openTourId=p.id,this.view="edit",this.activeStepId=l,o==="preview"&&this.startPreview(l)||(this.tab="steps",this.render()),!0):!1}render(){if(!this.root)return;const e=this.root.querySelector(".panel__body")?.scrollTop??0;this.root.querySelectorAll(".panel, .nav").forEach(r=>r.remove()),this.mode==="build"&&this.root.appendChild(this.renderPanel()),this.root.appendChild(this.renderNav());const t=this.root.querySelector(".panel__body");t&&e&&(t.scrollTop=e),this.focusStepId&&(this.focusContent(this.focusStepId),this.focusStepId=null),this.updateOverlays(),this.markDirty()}resolveTarget(e){return D(e.selectors)}updateOverlays(e=!1){const t=this.highlight;if(!t)return;const r=()=>{t.style.display="none",this.removeCardPreview()};if(this.view!=="edit"||this.mode!=="build"||this.picking)return r();const i=this.activeStep,o=i&&i.selectors.length>0?this.resolveTarget(i):null;if(!i||!o)return r();const s=o.getBoundingClientRect(),{padding:l,radius:p,cardRadius:c}=this.tour.display;t.className=`highlight ${this.tab==="styles"?"highlight--settings":""}`.trim(),t.style.transitionDuration=e?"0ms":"",t.style.display="block",t.style.left=`${s.left-l}px`,t.style.top=`${s.top-l}px`,t.style.width=`${s.width+l*2}px`,t.style.height=`${s.height+l*2}px`,t.style.borderRadius=`${p}px`,this.drawStepCard(i,s,c)}removeCardPreview(){this.cardPreview&&(this.cardPreview.remove(),this.cardPreview=null)}drawStepCard(e,t,r){const i=e.content.trim(),o=this.tab==="styles"&&this.displaySub==="card";if(!i&&!o){this.removeCardPreview();return}const s=this.tour.steps,l=s.indexOf(e),p=y=>()=>{const m=s[y];if(m){if(m.page&&!P({glob:m.page},window.location.href)){const v=Ee({glob:m.page});if(v){this.navigateForResume(v,m.id,"build");return}}this.setActive(m.id)}},c=_e({ghost:!0,contentText:i||"Step tooltip preview",progress:`Step ${l+1} of ${s.length}`,showClose:!0,onClose:()=>{this.activeStepId=null,this.render()},radius:r,back:{label:e.backLabel,disabled:l<=0,onClick:p(l-1)},next:{label:e.nextLabel,primary:!0,disabled:l>=s.length-1,onClick:p(l+1)}});if(!i){const y=c.querySelector(".tours-card__content");y&&(y.style.opacity="0.55")}this.removeCardPreview(),this.cardPreview=c,this.root?.appendChild(c);const h=this.tour.display.padding,g={top:t.top-h,left:t.left-h,right:t.right+h,bottom:t.bottom+h,width:t.width+h*2,height:t.height+h*2},{top:u,left:k}=ye({target:g,card:{width:c.offsetWidth,height:c.offsetHeight},side:e.placement,align:e.align,offset:this.tour.display.offset,alignOffset:this.tour.display.alignOffset,viewport:{width:window.innerWidth,height:window.innerHeight}});c.style.left=`${k}px`,c.style.top=`${u}px`}renderNav(){const e=a("div",{class:`nav nav--${this.navPosition}`}),t=_("build","Build",this.mode==="build"?"iconbtn--active":"");t.addEventListener("click",()=>{this.mode==="preview"&&this.togglePreview()});const r=_("preview","Preview",this.mode==="preview"?"iconbtn--active":"");r.addEventListener("click",()=>this.togglePreview());const i=_("navFlip","Move bar (top/bottom)");i.addEventListener("click",()=>{this.navPosition=this.navPosition==="bottom"?"top":"bottom",this.render()});const o=_("close","Close builder");return o.addEventListener("click",()=>this.destroy()),e.append(t,r,a("div",{class:"nav__sep"}),i,o),e}renderPanel(){const e=a("div",{class:`panel panel--${this.panelPosition}`});return this.view==="list"?e.append(this.renderListHeader(),this.renderList()):e.append(this.renderHeader(),this.renderToolbar(),this.renderTabs(),this.renderBody()),e}renderListHeader(){const e=a("div",{class:"panel__header"}),t=a("div",{class:"listtabs"});for(const[s,l]of[["tour","Tours"],["template","Templates"]]){const p=a("button",{class:`listtab ${this.listFilter===s?"listtab--active":""}`.trim(),type:"button"},[l]);p.addEventListener("click",()=>{this.listFilter=s,this.render()}),t.append(p)}const r=_("download",`Download all ${this.listFilter==="template"?"templates":"tours"} as JSON`);r.addEventListener("click",()=>this.downloadAll());const i=_("upload","Import tours from JSON");i.addEventListener("click",()=>this.importJson());const o=a("button",{class:"newtour",type:"button",title:"New"},["+ New"]);return o.addEventListener("click",()=>this.createEntity()),e.append(t,r,i,o),e}renderList(){const e=a("div",{class:"panel__body"}),t=a("div",{class:"tourlist"}),r=this.tours.filter(i=>i.kind===this.listFilter);return r.length===0?(e.append(a("div",{class:"assets-empty"},[this.listFilter==="template"?"No templates yet.":"No tours yet."])),e):(r.forEach(i=>{const o=a("div",{class:"tourrow"});o.addEventListener("click",()=>this.openTour(i.id));const s=a("div",{class:"tourrow__main"});if(s.append(a("div",{class:"tourrow__name"},[i.name]),a("div",{class:"tourrow__meta"},[`${i.steps.length} step${i.steps.length===1?"":"s"}`])),o.append(s),i.kind==="template"){const p=a("button",{class:"tourrow__use",type:"button",title:"Create a tour from this template"},["Use"]);p.addEventListener("click",c=>{c.stopPropagation(),this.createFromTemplate(i.id)}),o.append(p)}else o.append(a("span",{class:`status status--${i.status}`},[i.status]));const l=_("trash","Delete");l.addEventListener("click",p=>{p.stopPropagation(),this.deleteEntity(i.id)}),o.append(l),t.append(o)}),e.append(t),e)}renderHeader(){const e=a("div",{class:"panel__header"}),t=a("input",{class:"panel__title",value:this.tour.name});t.value=this.tour.name,t.addEventListener("change",()=>{this.tour.name=t.value.trim()||"Untitled tour",this.markDirty()});const r=a("span",{class:`status status--${this.tour.status}`},[this.tour.status]);r.addEventListener("click",()=>{this.tour.status=this.tour.status==="draft"?"published":"draft",this.render()}),r.setAttribute("title","Toggle status"),r.style.cursor="pointer";const i=_("menu","Menu",this.menuOpen?"iconbtn--active":"");return i.addEventListener("click",()=>{this.menuOpen=!this.menuOpen,this.render()}),e.append(t,r,i),this.menuOpen&&e.append(this.renderMenu()),e}renderMenu(){const e=a("div",{class:"menu"}),t=(r,i)=>{const o=a("button",{class:"menu__item",type:"button"},[r]);return o.addEventListener("click",()=>{this.menuOpen=!1,i()}),o};return this.tour.kind==="tour"&&e.append(t("Save as template",()=>this.saveAsTemplate())),e.append(t("Download JSON",()=>this.downloadOpenTour())),e.append(t("Import JSON…",()=>this.importJson())),e}downloadJson(e,t){const r=e.map(l=>Te(l)),i=new Blob([JSON.stringify(r,null,2)],{type:"application/json"}),o=URL.createObjectURL(i),s=document.createElement("a");s.href=o,s.download=t,s.click(),URL.revokeObjectURL(o),this.log.log("downloaded",t,`${r.length} tour(s)`)}fileBase(e){return e.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")||"tours"}downloadOpenTour(){this.downloadJson([this.tour],`${this.fileBase(this.tour.name)}.json`)}downloadAll(){const e=this.tours.filter(t=>t.kind===this.listFilter);e.length!==0&&this.downloadJson(e,`${this.listFilter==="template"?"templates":"tours"}.json`)}importJson(){const e=document.createElement("input");e.type="file",e.accept="application/json,.json",e.addEventListener("change",()=>{const t=e.files?.[0];t&&t.text().then(r=>{let i;try{i=JSON.parse(r)}catch{window.alert("Could not read that file — it is not valid JSON.");return}const o=wt(i);if(o.length===0){window.alert("No tours found in that file.");return}this.mergeDrafts(o)})}),e.click()}mergeDrafts(e){for(const t of e){const r=this.tours.findIndex(i=>i.id===t.id);r===-1?this.tours.push(t):this.tours[r]=t}this.tours.some(t=>t.id===this.openTourId)||(this.openTourId=this.tours[0].id,this.activeStepId=this.tour.steps[0]?.id??null),this.log.log("imported",`${e.length} tour(s)`),this.render(),this.persist()}renderToolbar(){const e=a("div",{class:"panel__toolbar"}),t=_("back","Back to tours");t.addEventListener("click",()=>{this.stopPicking(),this.view="list",this.render()});const r=_("panelSide","Move panel (left/right)");r.addEventListener("click",()=>{this.panelPosition=this.panelPosition==="right"?"left":"right",this.render()});const i=_("cursor",this.picking?"Cancel picking":"Pick element for active step",this.picking?"iconbtn--active":"");return i.addEventListener("click",()=>this.togglePicking()),e.append(t,a("div",{class:"spacer"}),r,i),e}renderTabs(){const e=a("div",{class:"tabs"});for(const[t,r]of[["steps","Steps"],["styles","Styles"],["rules","Rules"]]){const i=a("button",{class:`tab ${this.tab===t?"tab--active":""}`,type:"button"},[r]);i.addEventListener("click",()=>{this.tab=t,t==="styles"&&this.selectFirstResolvableStep(),this.render()}),e.append(i)}return e}selectFirstResolvableStep(){const e=this.tour.steps.find(t=>this.resolveTarget(t)!==null);e&&(this.activeStepId=e.id)}renderDisplaySettings(){const e=a("div",{class:"settings"}),t=a("div",{class:"subtabs"});for(const[i,o]of[["tour","Tour"],["card","Card"]]){const s=a("button",{class:`subtab ${this.displaySub===i?"subtab--active":""}`,type:"button"},[o]);s.addEventListener("click",()=>{this.displaySub=i,this.render()}),t.append(s)}if(e.append(t),!this.activeStep||!this.resolveTarget(this.activeStep))return e.append(a("div",{class:"assets-empty"},["Give a step a selector first — then its target frames here so you can tune the look."])),e;const r=this.tour.display;return this.displaySub==="tour"?e.append(this.slider("Outline spacing",r.padding,0,40,i=>r.padding=i),this.slider("Outline corner radius",r.radius,0,40,i=>r.radius=i),a("div",{class:"settings__hint"},["The outline framing the target — applied in the builder and in the live tour spotlight."])):e.append(this.slider("Card corner radius",r.cardRadius,0,32,i=>r.cardRadius=i),this.slider("Distance from target",r.offset,0,48,i=>r.offset=i),this.slider("Alignment inset",r.alignOffset,0,48,i=>r.alignOffset=i),a("div",{class:"settings__hint"},["Distance is the gap to the element; alignment inset nudges the card in from the aligned edge (start/end placements)."])),e}slider(e,t,r,i,o){let s=t;const l=a("span",{class:"settings__value",title:"Click to type a value"},[`${s}px`]),p=a("input",{class:"settings__slider",type:"range",min:String(r),max:String(i),step:"1"});p.value=String(s);const c=u=>{s=Math.max(r,Math.min(i,Math.round(u))),p.value=String(s),l.textContent=`${s}px`,o(s),this.updateOverlays(),this.markDirty()};p.addEventListener("input",()=>c(Number(p.value))),l.addEventListener("click",()=>this.editNumber(l,s,c));const h=a("div",{class:"settings__row"});h.append(p,l);const g=a("div",{class:"settings__field"});return g.append(a("label",{class:"settings__label"},[e]),h),g}editNumber(e,t,r){const i=a("input",{class:"settings__num",type:"text",inputmode:"numeric"});i.value=String(t),e.replaceWith(i),i.focus(),i.select(),i.addEventListener("input",()=>{i.value=i.value.replace(/[^0-9]/g,"")});const o=()=>{const s=i.value===""?t:Number(i.value);i.replaceWith(e),r(s)};i.addEventListener("blur",o),i.addEventListener("keydown",s=>{s.key==="Enter"&&i.blur(),s.key==="Escape"&&(i.value=String(t),i.blur())})}renderBody(){const e=a("div",{class:"panel__body"});if(this.tab==="styles")return e.append(this.renderDisplaySettings()),e;if(this.tab==="rules")return e.append(this.renderRulesBody()),e;const t=this.selectorEditorFor?this.tour.steps.find(o=>o.id===this.selectorEditorFor):void 0;t?e.append(this.renderSelectorEditor(t)):this.selectorEditorFor&&(this.selectorEditorFor=null);const r=this.pageEditorFor?this.tour.steps.find(o=>o.id===this.pageEditorFor):void 0;r?e.append(this.renderPageEditor(r)):this.pageEditorFor&&(this.pageEditorFor=null);const i=a("div",{class:"steps"});return i.append(this.renderConnector(-1)),this.tour.steps.forEach((o,s)=>{i.append(this.renderCard(o,s)),i.append(this.renderConnector(s))}),e.append(i),e}renderRulesBody(){const e=a("div",{class:"settings"}),t=this.tour;if(e.append(this.selectField("Audience",t.audience,[["all","Everyone"],["auth","Logged-in users only"],["guest","Logged-out visitors only"]],r=>{t.audience=r,this.markDirty()}),this.selectField("Start trigger",t.trigger.type,[["manual","Manual (shortcode / attribute)"],["load","On page load"],["selector","When an element appears"],["timer","After a delay"],["cta","Corner invitation (popover)"]],r=>{t.trigger=Tt(r),this.markDirty(),this.render()})),e.append(this.selectField("Closing the tour",t.dismissMode,[["end","Ends it — progress is cleared"],["minimize","Sets it aside — offer to carry on"]],r=>{t.dismissMode=r==="minimize"?"minimize":"end",this.markDirty(),this.render()})),t.dismissMode==="minimize"&&e.append(this.textField("Invitation text",t.resumeText,"Carry on with the tour?",r=>{t.resumeText=r}),this.textField("Button label",t.resumeButton,"Resume",r=>{t.resumeButton=r}),a("div",{class:"settings__hint"},["A set-aside tour never restarts on its own — the visitor has to accept the invitation."])),t.trigger.type==="selector")e.append(this.textField("Element selector (CSS)",t.trigger.selector,"#start, .cta",r=>{t.trigger.type==="selector"&&(t.trigger.selector=r)}));else if(t.trigger.type==="timer")e.append(this.textField("Delay (ms)",String(t.trigger.delay),"3000",r=>{t.trigger.type==="timer"&&(t.trigger.delay=Math.max(0,Number(r.replace(/[^0-9]/g,""))||0))}));else if(t.trigger.type==="cta"){const r=t.trigger;e.append(this.textField("Invitation text",r.text,"Need a hand getting started?",i=>{t.trigger.type==="cta"&&(t.trigger.text=i)}),this.textField("Button label",r.button,"Start tour",i=>{t.trigger.type==="cta"&&(t.trigger.button=i)}),this.selectField("Corner",r.corner,[["bottom-right","Bottom right"],["bottom-left","Bottom left"],["top-right","Top right"],["top-left","Top left"]],i=>{t.trigger.type==="cta"&&(t.trigger.corner=i),this.markDirty()}),this.textField("Edge offset (px)",String(r.offset??24),"24",i=>{t.trigger.type==="cta"&&(t.trigger.offset=Math.max(0,Number(i.replace(/[^0-9]/g,""))||0))}))}if(e.append(a("div",{class:"settings__hint"},[$t(t.trigger.type)])),t.trigger.type!=="manual"){const r=t.conditions;e.append(a("div",{class:"settings__divider"}),a("label",{class:"settings__label"},["Visitor traits"]),this.traitRows(r.traits,()=>this.markDirty()),a("div",{class:"settings__hint"},["Role, plan, group — whatever the host reports. Every listed trait must match."]),this.checkboxField("Show only on the first visit",r.firstVisitOnly,i=>{r.firstVisitOnly=i}),this.textField("Show at most N times (0 = no limit)",String(r.maxShows),"0",i=>{r.maxShows=Math.max(0,Number(i.replace(/[^0-9]/g,""))||0)}),this.selectField("Device",r.device,[["any","Any device"],["desktop","Desktop only"],["tablet","Tablet only"],["mobile","Mobile only"]],i=>{r.device=i,this.markDirty()}))}return e}traitRows(e,t){const r=a("div",{class:"traits"});for(const[o,s]of Object.entries(e)){const l=a("div",{class:"traits__row"}),p=a("input",{class:"traits__key",placeholder:"key"});p.value=o;const c=a("input",{class:"traits__val",placeholder:"value"});c.value=s,p.addEventListener("change",()=>{const g=p.value.trim();delete e[o],g&&(e[g]=c.value),t(),this.render()}),c.addEventListener("change",()=>{e[o]=c.value,t()});const h=_("trash","Remove this condition");h.addEventListener("click",()=>{delete e[o],t(),this.render()}),l.append(p,c,h),r.append(l)}const i=a("button",{class:"traits__add",type:"button"},["+ Add a trait"]);return i.addEventListener("click",()=>{let o=1;for(;`trait${o}`in e;)o+=1;e[`trait${o}`]="",t(),this.render()}),r.append(i),r}checkboxField(e,t,r){const i=a("input",{type:"checkbox",class:"settings__check"});i.checked=t,i.addEventListener("change",()=>{r(i.checked),this.markDirty(),this.render()});const o=a("label",{class:"settings__checkrow"});return o.append(i,document.createTextNode(e)),o}selectField(e,t,r,i){const o=document.createElement("select");o.className="tsel";for(const[l,p]of r){const c=document.createElement("option");c.value=l,c.textContent=p,l===t&&(c.selected=!0),o.append(c)}o.addEventListener("change",()=>i(o.value));const s=a("div",{class:"settings__field"});return s.append(a("label",{class:"settings__label"},[e]),o),s}textField(e,t,r,i){const o=a("input",{class:"pagecfg__input",placeholder:r});o.value=t,o.addEventListener("change",()=>{i(o.value.trim()),this.markDirty()});const s=a("div",{class:"settings__field"});return s.append(a("label",{class:"settings__label"},[e]),o),s}renderConnector(e){const t=a("div",{class:"connector"}),r=a("button",{class:"connector__add",title:"Add step",type:"button"},["+"]);return r.addEventListener("click",()=>this.addStepAfter(e)),t.append(a("div",{class:"connector__line"}),r,a("div",{class:"connector__line"})),t}openPageEditor(e){this.setActive(e.id),this.pageEditorFor=this.pageEditorFor===e.id?null:e.id,this.pageQuery="",this.pageEditorFor&&this.pages===null&&St().then(t=>{this.pages=t,this.pageEditorFor&&this.render()}),this.render()}renderPageEditor(e){const t=a("div",{class:"selpop"}),r=a("div",{class:"selpop__head"});r.append(a("span",{class:"selpop__title"},["Page"]));const i=_("close","Close");i.addEventListener("click",()=>{this.pageEditorFor=null,this.render()}),r.append(a("div",{class:"spacer"}),i);const o=a("input",{class:"pagecfg__input",placeholder:"Any page — or type to search, or paste a URL"});o.value=this.pageQuery||e.page;const s=h=>{e.page=h.trim(),this.markDirty(),this.pageEditorFor=null,this.render()};o.addEventListener("input",()=>{this.pageQuery=o.value,this.renderPageSuggestions(e,l)}),o.addEventListener("keydown",h=>{h.key==="Enter"&&s(o.value)});const l=a("div",{class:"selpop__list"});t.append(r,o,l),this.renderPageSuggestions(e,l);const p=a("button",{class:"selpop__add",type:"button"},["⌖ Use the current page"]);p.addEventListener("click",()=>s(this.currentPage()));const c=a("button",{class:"selpop__add",type:"button"},["✳ Any page"]);return c.addEventListener("click",()=>s("")),t.append(p,c),t}renderPageSuggestions(e,t){if(t.textContent="",this.pages===null){t.append(a("p",{class:"selpop__empty"},["Reading the site map…"]));return}if(this.pages.length===0){t.append(a("p",{class:"selpop__empty"},["No sitemap found — type a URL or glob directly, and press Enter."]));return}const r=Ct(this.pages,this.pageQuery);if(r.length===0){t.append(a("p",{class:"selpop__empty"},["Nothing matches — press Enter to use it as typed."]));return}for(const i of r){const o=a("button",{class:"selpop__page",type:"button",title:i},[i.replace(/^https?:\/\//,"")]);o.addEventListener("click",()=>{e.page=Lt(i),this.markDirty(),this.pageEditorFor=null,this.render()}),t.append(o)}}renderSelectorEditor(e){const t=a("div",{class:"selpop"}),r=a("div",{class:"selpop__head"});r.append(a("span",{class:"selpop__title"},["Selectors"]));const i=_("close","Close");i.addEventListener("click",()=>{this.selectorEditorFor=null,this.render()}),r.append(a("div",{class:"spacer"}),i);const o=a("div",{class:"selpop__list"});e.selectors.length===0&&o.append(a("p",{class:"selpop__empty"},["No selectors yet. Add one with the crosshair below."])),e.selectors.forEach((l,p)=>{const c=a("div",{class:"selpop__row",draggable:"true"});c.addEventListener("dragstart",g=>{this.dragFrom=p,c.classList.add("selpop__row--dragging"),g.dataTransfer?.setData("text/plain",String(p))}),c.addEventListener("dragend",()=>{this.dragFrom=null,c.classList.remove("selpop__row--dragging")}),c.addEventListener("dragover",g=>{g.preventDefault(),c.classList.add("selpop__row--over")}),c.addEventListener("dragleave",()=>c.classList.remove("selpop__row--over")),c.addEventListener("drop",g=>{g.preventDefault();const u=this.dragFrom;if(this.dragFrom=null,u===null||u===p)return;const[k]=e.selectors.splice(u,1);e.selectors.splice(p,0,k),this.markDirty(),this.render()}),c.append(a("span",{class:"selpop__grip",title:"Drag to reorder"},["⠿"])),c.append(a("span",{class:"selpop__rank"},[String(p+1)])),c.append(a("code",{class:"selpop__code",title:l},[l]));const h=_("trash","Remove this selector");h.addEventListener("click",()=>{e.selectors.splice(p,1),this.markDirty(),this.render()}),c.append(h),o.append(c)});const s=a("button",{class:`selpop__add ${this.picking?"selpop__add--on":""}`.trim(),type:"button"},[this.picking?"◎ Picking — click an element, or press Esc":"⌖ Add by picking an element"]);return s.addEventListener("click",()=>this.togglePicking(!0)),t.append(r,o,s),t}renderCard(e,t){const r=e.id===this.activeStepId,i=a("div",{class:`card ${r?"card--active":""} ${e.included?"":"card--excluded"}`.trim(),"data-step-id":e.id});return i.addEventListener("mousedown",()=>this.setActive(e.id)),e.page&&!P({glob:e.page},window.location.href)&&i.classList.add("card--offpage"),i.append(this.renderCardControl(e,t),this.renderCardContent(e),this.renderCardFooter(e)),r&&(i.append(this.section("placement","Card position",()=>this.renderPlacementBody(e))),i.append(this.section("behaviour","Behaviour",()=>this.renderBehaviourBody(e))),i.append(this.section("condition","Show this step when…",()=>this.renderConditionBody(e))),i.append(this.section("page","Page",()=>this.renderPageBody(e)))),i}renderBehaviourBody(e){const t=a("div",{class:"settings"});return t.append(this.checkboxField("Dim the rest of the page",e.overlay!==!1,r=>{e.overlay=r,this.render()}),a("div",{class:"settings__hint"},["Off leaves the page fully usable and only outlines the target — for a step the visitor should be free to poke at."])),t}renderConditionBody(e){const t=a("div",{class:"settings"}),r=e.condition??(e.condition={}),i=()=>{(Object.keys(r).length===0||r.traits&&Object.keys(r.traits).length===0&&!r.device)&&!r.device&&(!r.traits||Object.keys(r.traits).length===0)&&delete e.condition,this.markDirty()};return t.append(this.selectField("Device",r.device??"any",[["any","Any device"],["mobile","Mobile only"],["tablet","Tablet only"],["desktop","Desktop only"]],o=>{o==="any"?delete r.device:r.device=o,i(),this.render()}),a("label",{class:"settings__label"},["Visitor traits"]),this.traitRows(r.traits??(r.traits={}),i),a("div",{class:"settings__hint"},["Every trait listed must match what the host reports for this visitor. A trait the host does not report never matches."])),t}renderPageBody(e){const t=a("div",{class:"settings"}),r=a("input",{class:"pagecfg__input",placeholder:"Any page"});r.value=e.page,r.addEventListener("change",()=>{e.page=r.value.trim(),this.markDirty(),this.render()});const i=a("button",{class:"pagecfg__use",type:"button"},["Use current page"]);return i.addEventListener("click",()=>{e.page=this.currentPage(),this.render()}),t.append(a("label",{class:"settings__label"},["Show on pages matching (URL glob)"]),r,i,a("div",{class:"settings__hint"},["Empty = any page. New steps get the current page automatically; navigate your site (with the builder on) to add steps on other pages."])),t}section(e,t,r){const i=this.openSections.has(e),o=a("div",{class:`acc ${i?"acc--open":""}`.trim()}),s=a("button",{class:"acc__head",type:"button"}),l=a("span",{class:"acc__caret"});return l.innerHTML=Z.chevron,s.append(l,a("span",{class:"acc__title"},[t])),s.addEventListener("click",()=>{i?this.openSections.delete(e):this.openSections.add(e),this.render()}),o.append(s),i&&o.append(a("div",{class:"acc__body"},[r()])),o}renderPlacementBody(e){const t=a("div",{class:"place"}),r=a("div",{class:"place__grid"});r.append(a("div",{class:"place__el"})),r.append(a("div",{class:"place__el"}));const i=[{side:"top",align:"start",x:40,y:16},{side:"top",align:"center",x:66,y:16},{side:"top",align:"end",x:92,y:16},{side:"bottom",align:"start",x:40,y:80},{side:"bottom",align:"center",x:66,y:80},{side:"bottom",align:"end",x:92,y:80},{side:"left",align:"start",x:24,y:32},{side:"left",align:"center",x:24,y:48},{side:"left",align:"end",x:24,y:64},{side:"right",align:"start",x:108,y:32},{side:"right",align:"center",x:108,y:48},{side:"right",align:"end",x:108,y:64}];for(const s of i){const l=e.placement===s.side&&e.align===s.align,p=a("button",{class:`place__dot ${l?"place__dot--active":""}`.trim(),type:"button",title:`${s.side} · ${s.align}`});p.style.left=`${s.x-6}px`,p.style.top=`${s.y-6}px`,p.addEventListener("click",()=>{e.placement=s.side,e.align=s.align,this.render()}),r.append(p)}t.append(r);const o=a("button",{class:`place__auto ${e.placement==="auto"?"place__auto--active":""}`.trim(),type:"button",title:"Pick the side with the most room automatically"},["Auto"]);return o.addEventListener("click",()=>{e.placement="auto",this.render()}),t.append(o),t}renderCardControl(e,t){const r=a("div",{class:"card__control"}),i=a("input",{class:"card__check",type:"checkbox",title:"Include in tour"});i.checked=e.included,i.addEventListener("change",()=>{e.included=i.checked,this.render()});const o=a("span",{class:"card__index"},[String(t+1)]),s=a("span",{class:"card__type"});s.innerHTML=Z[e.type==="action"?"bolt":"step"],s.append(document.createTextNode(e.type==="action"?"Action":"Step"));const l=e.selectors[0],p=e.selectors.length,c=a("button",{class:`card__sel ${l?"":"card__sel--empty"}`.trim(),type:"button",title:e.selectors.join(`
`)||"No selector yet — click to add one"},[l??"no selector"]);p>1&&c.append(a("span",{class:"card__selcount"},[`+${p-1}`])),c.addEventListener("click",g=>{g.stopPropagation(),this.setActive(e.id),this.selectorEditorFor=this.selectorEditorFor===e.id?null:e.id,this.render()});const h=_("trash","Delete step");if(h.addEventListener("click",()=>this.removeStep(e.id)),r.append(i,o,s,a("div",{class:"spacer"})),e.page&&!P({glob:e.page},window.location.href)){const g=e.page.replace(/^https?:\/\/[^/]+/,"").replace(/\*$/,"")||"/",u=a("button",{class:"card__page",type:"button",title:e.page},[`⧉ ${g}`]);u.addEventListener("click",k=>{k.stopPropagation(),this.openPageEditor(e)}),r.append(u)}return r.append(c,h),r}renderCardContent(e){const t=a("div",{class:"card__content",contenteditable:"true","data-placeholder":"Write the step text…","data-step":e.id});return t.textContent=e.content,t.addEventListener("input",()=>{e.content=t.textContent??"",this.updateOverlays(),this.markDirty()}),t.addEventListener("mousedown",()=>{this.activeStepId!==e.id&&(this.focusStepId=e.id)}),t}renderCardFooter(e){const t=a("div",{class:"card__footer"});return t.append(this.renderEditableButton(e,"backLabel"),this.renderEditableButton(e,"nextLabel")),t}renderEditableButton(e,t){const r=a("button",{class:"cardbtn",type:"button"},[e[t]]);return r.addEventListener("click",i=>{i.stopPropagation();const o=a("input",{class:"cardbtn cardbtn--edit",value:e[t]});o.value=e[t],r.replaceWith(o),o.focus(),o.select();const s=()=>{e[t]=o.value.trim()||(t==="backLabel"?"Back":"Next"),o.replaceWith(this.renderEditableButton(e,t)),this.markDirty()};o.addEventListener("blur",s),o.addEventListener("keydown",l=>{l.key==="Enter"&&o.blur(),l.key==="Escape"&&(o.value=e[t],o.blur())})}),r}focusContent(e){const t=this.root?.querySelector(`.card__content[data-step="${e}"]`);if(!t)return;t.focus();const r=document.createRange();r.selectNodeContents(t),r.collapse(!1);const i=window.getSelection();i?.removeAllRanges(),i?.addRange(r)}}E.TourBuilder=ne,E.cloneDraft=ee,E.createDraftStep=F,E.createDraftTour=H,E.createLocalStore=Ne,E.createWordPressStore=_t,E.normalizeTours=W,E.toTour=Ae,Object.defineProperty(E,Symbol.toStringTag,{value:"Module"})}));
//# sourceMappingURL=index.umd.js.map
