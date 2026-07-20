(function(b,y){typeof exports=="object"&&typeof module<"u"?y(exports):typeof define=="function"&&define.amd?define(["exports"],y):(b=typeof globalThis<"u"?globalThis:b||self,y(b.SiteToursFront={}))})(this,(function(b){"use strict";const y=`
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
`,ot="a, button, summary, label, h1, h2, h3, h4, h5, h6";function rt(t,e){if(t.startsWith("text=")){const n=t.slice(5).trim();for(const o of Array.from(e.querySelectorAll(ot)))if((o.textContent??"").replace(/\s+/g," ").trim()===n)return o;return null}try{return e.querySelector(t)}catch{return null}}function E(t,e=document){for(const n of t){const o=rt(n,e);if(o)return o}return null}function it(t,e={}){const n=e.root??document,o=E(t,n);return o?Promise.resolve(o):new Promise(i=>{let d=!1;const l=s=>{d||(d=!0,a.disconnect(),clearTimeout(u),i(s))},a=new MutationObserver(()=>{const s=E(t,n);s&&l(s)});a.observe(document.documentElement,{childList:!0,subtree:!0,attributes:!0});const u=setTimeout(()=>l(null),e.timeout??4e3)})}let x=null;function _(){if(x!==null)return x;try{x=new URLSearchParams(window.location.search).has("use_logs")}catch{x=!1}return x}function st(t){const e=`[tours:${t}]`;return{log:(...n)=>{_()&&console.log(e,...n)},warn:(...n)=>{_()&&console.warn(e,...n)},error:(...n)=>{_()&&console.error(e,...n)}}}const T=6,R=6,O=10,U=12,at=1;function g(t){return typeof t=="object"&&t!==null&&!Array.isArray(t)}function I(t){return g(t)&&typeof t.default=="string"}const N=["top","bottom","left","right","auto"],D=["start","center","end"],z=["mobile","tablet","desktop"],P=["click","input","navigate","none"];function M(t,e,n){if(!g(t)){n.push(`${e} must be an object`);return}const o=typeof t.glob=="string"&&t.glob.length>0,i=typeof t.regex=="string"&&t.regex.length>0;if(!o&&!i&&n.push(`${e} must have a non-empty "glob" or "regex"`),i)try{new RegExp(t.regex)}catch{n.push(`${e}.regex is not a valid regular expression`)}}function F(t,e,n){if(!g(t)){n.push(`${e} must be an object`);return}t.url!==void 0&&M(t.url,`${e}.url`,n),t.role!==void 0&&typeof t.role!="string"&&n.push(`${e}.role must be a string`),t.firstVisitOnly!==void 0&&typeof t.firstVisitOnly!="boolean"&&n.push(`${e}.firstVisitOnly must be a boolean`),t.device!==void 0&&!z.includes(t.device)&&n.push(`${e}.device must be one of ${z.join("|")}`),t.unlessSeen!==void 0&&typeof t.unlessSeen!="boolean"&&n.push(`${e}.unlessSeen must be a boolean`),t.maxShows!==void 0&&(typeof t.maxShows!="number"||t.maxShows<0)&&n.push(`${e}.maxShows must be a non-negative number`)}function lt(t,e,n){if(!g(t)){n.push(`${e} must be an object`);return}P.includes(t.type)||n.push(`${e}.type must be one of ${P.join("|")}`),t.url!==void 0&&typeof t.url!="string"&&n.push(`${e}.url must be a string`),t.value!==void 0&&typeof t.value!="string"&&n.push(`${e}.value must be a string`)}function dt(t){const e=[];if(!g(t))return{ok:!1,errors:["tour must be an object"]};if((typeof t.id!="string"||t.id.length===0)&&e.push("tour.id must be a non-empty string"),typeof t.schemaVersion!="number"&&e.push("tour.schemaVersion must be a number"),I(t.title)||e.push('tour.title must be a localized text with a string "default"'),Array.isArray(t.steps)?t.steps.length===0?e.push("tour.steps must contain at least one step"):t.steps.forEach((n,o)=>{if(!g(n)){e.push(`steps[${o}] must be an object`);return}(typeof n.id!="string"||n.id.length===0)&&e.push(`steps[${o}].id must be a non-empty string`),(!Array.isArray(n.selectors)||n.selectors.length===0||!n.selectors.every(i=>typeof i=="string"&&i.length>0))&&e.push(`steps[${o}].selectors must be a non-empty array of non-empty strings`),I(n.content)||e.push(`steps[${o}].content must be a localized text with a string "default"`),n.placement!==void 0&&!N.includes(n.placement)&&e.push(`steps[${o}].placement must be one of ${N.join("|")}`),n.align!==void 0&&!D.includes(n.align)&&e.push(`steps[${o}].align must be one of ${D.join("|")}`),n.backLabel!==void 0&&typeof n.backLabel!="string"&&e.push(`steps[${o}].backLabel must be a string`),n.nextLabel!==void 0&&typeof n.nextLabel!="string"&&e.push(`steps[${o}].nextLabel must be a string`),n.pageUrl!==void 0&&M(n.pageUrl,`steps[${o}].pageUrl`,e),n.condition!==void 0&&F(n.condition,`steps[${o}].condition`,e),n.action!==void 0&&lt(n.action,`steps[${o}].action`,e)}):e.push("tour.steps must be an array"),t.display!==void 0)if(!g(t.display))e.push("tour.display must be an object");else for(const n of["padding","radius","cardRadius","offset","alignOffset"]){const o=t.display[n];o!==void 0&&(typeof o!="number"||o<0)&&e.push(`tour.display.${n} must be a non-negative number`)}return t.rules!==void 0&&(Array.isArray(t.rules)?t.rules.forEach((n,o)=>{if(!g(n)){e.push(`rules[${o}] must be an object`);return}n.tourId!==void 0&&typeof n.tourId!="string"&&e.push(`rules[${o}].tourId must be a string`),n.when===void 0?e.push(`rules[${o}].when is required`):F(n.when,`rules[${o}].when`,e)}):e.push("tour.rules must be an array")),e.length>0?{ok:!1,errors:e}:{ok:!0,tour:t}}function ut(t,e,n){const o={top:t.top,bottom:n.height-t.bottom,left:t.left,right:n.width-t.right},i={top:e.height,bottom:e.height,left:e.width,right:e.width},d=["bottom","top","right","left"],l=d.find(a=>o[a]>=i[a]+8);return l||d.reduce((a,u)=>o[u]>o[a]?u:a,d[0])}function ct(t){const{target:e,card:n,offset:o,viewport:i}=t,d=t.side==="auto",l=d?ut(e,n,i):t.side,a=d?"center":t.align,u=t.alignOffset??0,s=a==="start"?u:a==="end"?-u:0;let f=0,h=0;return l==="top"||l==="bottom"?(f=l==="top"?e.top-n.height-o:e.bottom+o,h=a==="start"?e.left:a==="end"?e.right-n.width:e.left+e.width/2-n.width/2,h+=s):(h=l==="left"?e.left-n.width-o:e.right+o,f=a==="start"?e.top:a==="end"?e.bottom-n.height:e.top+e.height/2-n.height/2,f+=s),h=Math.max(8,Math.min(h,i.width-n.width-8)),f=Math.max(8,Math.min(f,i.height-n.height-8)),{top:f,left:h}}function V(t){const e=document.createElement("button");return e.type="button",e.className=`tours-card__btn${t.primary?" tours-card__btn--primary":""}${t.disabled?" tours-card__btn--disabled":""}`,e.textContent=t.label,!t.disabled&&t.onClick&&e.addEventListener("click",t.onClick),e}function ft(t){const e=document.createElement("div");e.className=`tours-card${t.ghost?" tours-card--ghost":""}`,t.radius!=null&&(e.style.borderRadius=`${t.radius}px`);{const o=document.createElement("button");o.className="tours-card__close",o.type="button",o.textContent="×",o.setAttribute("aria-label","Close"),t.onClose&&o.addEventListener("click",t.onClose),e.appendChild(o)}const n=document.createElement("div");if(n.className="tours-card__content",t.contentHtml!=null?n.innerHTML=t.contentHtml:n.textContent=t.contentText??"",e.appendChild(n),t.back||t.next||t.progress){const o=document.createElement("div");if(o.className="tours-card__footer",t.back&&o.appendChild(V(t.back)),t.progress){const i=document.createElement("span");i.className="tours-card__progress",i.textContent=t.progress,o.appendChild(i)}t.next&&o.appendChild(V(t.next)),e.appendChild(o)}return e}const pt=`
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
`;function gt(t){const e=t.replace(/[.+^${}()|[\]\\]/g,"\\$&").replace(/\*\*/g,"\0").replace(/\*/g,"[^/]*").replace(/ /g,".*").replace(/\?/g,".");return new RegExp(`^${e}$`)}function B(t,e){if(!t)return!0;if(t.regex)try{return new RegExp(t.regex).test(e)}catch{return!1}if(t.glob)try{return gt(t.glob).test(e)}catch{return!1}return!0}const S="tours:progress";function ht(){return{get(t){try{return localStorage.getItem(t)}catch{return null}},set(t,e){try{localStorage.setItem(t,e)}catch{}},remove(t){try{localStorage.removeItem(t)}catch{}}}}function bt(t){const e=t.get(S);if(!e)return null;try{const n=JSON.parse(e);if(typeof n?.tourId=="string"&&typeof n?.index=="number")return n}catch{}return null}function mt(t,e){t.set(S,JSON.stringify(e))}function H(t){t.remove(S)}function Y(t,e={}){const n=st("player"),o=e.state;let i=null,d=null,l=null,a=null,u=!1,s=0;const f=t.display?.padding??T,h=t.display?.radius??R,Ct=t.display?.cardRadius??O,At=t.display?.offset??U;function K(r){return E(r.selectors)}function X(r){return B(r.pageUrl,window.location.href)}function v(){o&&mt(o,{tourId:t.id,index:s})}function Q(){if(i)return;i=document.createElement("div"),i.setAttribute("data-tours-player",""),d=i.attachShadow({mode:"open"});const r=document.createElement("style");r.textContent=y+pt,d.appendChild(r);const c=document.createElement("div");c.className="tours-backdrop",d.appendChild(c),l=document.createElement("div"),l.className="tours-spotlight",l.style.borderRadius=`${h}px`,d.appendChild(l),document.body.appendChild(i)}function Z(r){l&&(l.style.display="block",l.style.left=`${r.left-f}px`,l.style.top=`${r.top-f}px`,l.style.width=`${r.width+f*2}px`,l.style.height=`${r.height+f*2}px`)}function tt(r,c){if(!a)return;const p={top:r.top-f,left:r.left-f,right:r.right+f,bottom:r.bottom+f,width:r.width+f*2,height:r.height+f*2},{top:A,left:Ot}=ct({target:p,card:{width:a.offsetWidth,height:a.offsetHeight},side:c.placement??"bottom",align:c.align??"center",offset:At,alignOffset:t.display?.alignOffset??0,viewport:{width:window.innerWidth,height:window.innerHeight}});a.style.left=`${Ot}px`,a.style.top=`${A}px`}function Tt(r){const c=t.steps.length;a&&a.remove(),a=ft({contentText:r.content.default,progress:`Step ${s+1} of ${c}`,onClose:m,radius:Ct,back:{label:r.backLabel??"Back",disabled:s===0,onClick:C},next:{label:r.nextLabel??(s===c-1?"Done":"Next"),primary:!0,onClick:L}}),d?.appendChild(a)}function $(){if(!u)return;const r=t.steps[s];if(!r){m();return}n.log("render step",s,r.id);const c=K(r);if(!c){n.log(`step "${r.id}" target not found yet — waiting`,r.selectors),it(r.selectors,{timeout:4e3}).then(A=>{!u||t.steps[s]!==r||(A?$():(n.warn(`step "${r.id}" skipped: no element for selectors`,r.selectors),s<t.steps.length-1?(s+=1,$()):m()))});return}Q(),c.scrollIntoView({behavior:"smooth",block:"center",inline:"center"}),Tt(r);const p=c.getBoundingClientRect();Z(p),tt(p,r)}function et(r){u&&(r.key==="Escape"?(r.preventDefault(),m()):r.key==="ArrowRight"?L():r.key==="ArrowLeft"&&C())}function k(){if(!u)return;const r=t.steps[s];if(!r)return;const c=K(r);if(!c)return;const p=c.getBoundingClientRect();Z(p),tt(p,r)}function Rt(r=0){u||t.steps.length!==0&&(u=!0,s=Math.max(0,Math.min(r,t.steps.length-1)),n.log("start",t.id,`at ${s}/${t.steps.length}`),Q(),window.addEventListener("keydown",et,!0),window.addEventListener("resize",k,!0),window.addEventListener("scroll",k,!0),v(),$())}function nt(){u&&(u=!1,window.removeEventListener("keydown",et,!0),window.removeEventListener("resize",k,!0),window.removeEventListener("scroll",k,!0),i&&i.parentNode&&i.parentNode.removeChild(i),i=null,d=null,l=null,a=null)}function m(){n.log("stop"),nt(),o&&H(o)}function L(){if(!u)return;const r=s+1,c=t.steps[r];if(!c){m();return}if(X(c)){s=r,v(),$();return}s=r,v();const p=t.steps[s-1]?.action;n.log("page transition → resume at",s),nt(),p&&p.type==="navigate"&&p.url&&window.location.assign(p.url)}function C(){if(!u)return;const r=t.steps[s-1];!r||!X(r)||(s-=1,v(),$())}return{start:Rt,stop:m,next:L,prev:C}}function yt(t,e={}){const n=e.state;if(!n)return null;const o=bt(n);if(!o||o.tourId!==t.id)return null;const i=t.steps[o.index];if(!i)return H(n),null;if(!B(i.pageUrl,window.location.href))return null;const d=Y(t,{state:n});return d.start(o.index),d}let xt=0;function wt(t){const e=typeof crypto<"u"&&"randomUUID"in crypto?crypto.randomUUID():`${xt++}`;return`${t}-${e}`}function $t(t="step"){return{id:wt("step"),type:t,included:!0,selectors:[],content:"",page:"",placement:"auto",align:"center",backLabel:"Back",nextLabel:"Next"}}function vt(t){if(!Array.isArray(t))return[];const e=[];for(const n of t){if(!n||typeof n!="object")continue;const o=n;typeof o.id!="string"||!Array.isArray(o.steps)||e.push({id:o.id,kind:o.kind==="template"?"template":"tour",name:typeof o.name=="string"?o.name:"Untitled tour",status:o.status==="published"?"published":"draft",display:{padding:w(o.display?.padding,T),radius:w(o.display?.radius,R),cardRadius:w(o.display?.cardRadius,O),offset:w(o.display?.offset,U),alignOffset:w(o.display?.alignOffset,0)},steps:o.steps.filter(i=>!!i&&typeof i=="object").map(i=>({...$t(i.type==="action"?"action":"step"),...i}))})}return e}function w(t,e){return typeof t=="number"&&t>=0?t:e}function kt(t){const e=t.steps.filter(o=>o.included&&o.selectors.length>0).map(o=>({id:o.id,selectors:o.selectors,content:{default:o.content},placement:o.placement,align:o.align,backLabel:o.backLabel,nextLabel:o.nextLabel,...o.page?{pageUrl:{glob:o.page}}:{}})),n={id:t.id,schemaVersion:at,title:{default:t.name},steps:e,display:{padding:t.display.padding,radius:t.display.radius,cardRadius:t.display.cardRadius,offset:t.display.offset,alignOffset:t.display.alignOffset}};return dt(n)}const q=ht();function Et(){return window.SiteToursFront_data??{}}function G(){return vt(Et().drafts).filter(t=>t.status==="published"&&t.kind==="tour")}function _t(){return G().map(t=>({id:t.id,name:t.name}))}function j(){const t=[];for(const e of G()){const n=kt(e);n.ok&&t.push(n.tour)}return t}function W(t){const e=j(),n=t?e.find(o=>o.id===t):e[0];if(!n){console.warn("[tours] no published tour to run",t??"");return}Y(n,{state:q}).start()}function St(){for(const t of j())if(yt(t,{state:q}))break}function Lt(){for(const t of Array.from(document.querySelectorAll("[data-site-tour]")))t.dataset.siteToursBound||(t.dataset.siteToursBound="1",t.addEventListener("click",()=>W(t.dataset.siteTour||void 0)))}function J(){Lt(),St()}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",J):J(),b.list=_t,b.run=W,Object.defineProperty(b,Symbol.toStringTag,{value:"Module"})}));
