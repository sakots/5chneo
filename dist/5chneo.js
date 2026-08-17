"use strict";(()=>{var r="fivech-neo-overlay",m="fivech-neo-status",g="fivech-neo-loader";var f="https://oekakibbs.moe/apps/neo/";function p(){return window.Neo}function b(){let e=document.querySelectorAll("form");return Array.from(e).find(t=>t.method.toLowerCase()==="post"&&t.querySelector('[name="MESSAGE"]')&&t.querySelector('[name="bbs"]')&&t.querySelector('[name="key"]'))??null}function x(e){let t=Math.max(0,e.length-22);return(t+(t%3?3-t%3:0))/3*4}function d(e){return`${Math.ceil(e/1e3)}KB`}function s(e,t){e.style.display=t?"flex":"none"}function h(e,t){let o=document.createElement("button");return o.type="button",o.className="fivech-neo-button",o.textContent=e,o.addEventListener("click",t),o}function S(e,t,o){document.getElementById(m)?.remove();let i=document.createElement("span");i.id=m,i.className="fivech-neo-attachment",i.append(`PaintBBS NEO\u306E\u753B\u50CF\u3092\u6DFB\u4ED8\u6E08\u307F\uFF08${d(o)}\uFF09 `),i.append(h("\u518D\u7DE8\u96C6",()=>s(t,!0))," ",h("\u6DFB\u4ED8\u3092\u89E3\u9664",()=>{e.querySelector('input[name="oekaki"]')?.remove(),i.remove()})),(e.querySelector('[name="oekaki_thread1"]')??e).insertAdjacentElement("afterend",i)}function _(e,t,o,i){let n=e.querySelector('input[name="oekaki"]');n||(n=document.createElement("input"),n.type="hidden",n.name="oekaki",e.appendChild(n)),n.value=o,S(e,t,i),s(t,!1)}function y(){let e=document.createElement("div");e.id=r,e.innerHTML=`
    <style>
      #${r} {
        align-items: flex-start;
        background: rgb(0 0 0 / 72%);
        box-sizing: border-box;
        inset: 0;
        justify-content: center;
        overflow: auto;
        padding: 16px;
        position: fixed;
        z-index: 2147483646;
      }
      #${r} .fivech-neo-panel {
        background: #f7f7f7;
        border-radius: 6px;
        box-shadow: 0 8px 32px rgb(0 0 0 / 45%);
        color: #222;
        max-width: max-content;
        min-width: 632px;
        padding: 10px 16px 16px;
      }
      #${r} .fivech-neo-header {
        align-items: center;
        display: flex;
        font: 14px/1.4 sans-serif;
        justify-content: space-between;
        margin-bottom: 8px;
      }
      #${r} .fivech-neo-title { font-weight: 700; }
      #${r} .fivech-neo-close,
      .fivech-neo-button {
        appearance: auto;
        background: #eee;
        border: 1px solid #888;
        border-radius: 3px;
        color: #111;
        cursor: pointer;
        font: 13px/1.4 sans-serif;
        height: auto;
        letter-spacing: normal;
        margin: 0;
        padding: 2px 8px;
        text-transform: none;
      }
      #${r} .fivech-neo-help {
        font: 12px/1.5 sans-serif;
        margin: 8px 0 0;
      }
      #${r} .fivech-neo-mount { min-height: 430px; }
      .fivech-neo-attachment {
        display: inline-block;
        font: 13px/1.5 sans-serif;
        margin: 6px 0;
      }
      @media (max-width: 680px) {
        #${r} { justify-content: flex-start; padding: 8px; }
      }
    </style>
    <div class="fivech-neo-panel" role="dialog" aria-modal="true" aria-label="PaintBBS NEO">
      <div class="fivech-neo-header">
        <span class="fivech-neo-title">PaintBBS NEO \u2014 5ch\u304A\u7D75\u304B\u304D</span>
        <button type="button" class="fivech-neo-close">\u9589\u3058\u308B</button>
      </div>
      <div class="fivech-neo-mount"></div>
      <p class="fivech-neo-help">\u63CF\u304D\u7D42\u3048\u305F\u3089PaintBBS NEO\u5185\u306E\u300C\u6295\u7A3F\u300D\u30DC\u30BF\u30F3\u3092\u62BC\u3057\u3066\u304F\u3060\u3055\u3044\u3002\u753B\u50CF\u30925ch\u306E\u6295\u7A3F\u30D5\u30A9\u30FC\u30E0\u3078\u6DFB\u4ED8\u3057\u307E\u3059\u3002</p>
    </div>`,e.querySelector(".fivech-neo-close")?.addEventListener("click",()=>s(e,!1));let t=e.querySelector(".fivech-neo-mount");if(!t)throw new Error("PaintBBS NEO\u306E\u8868\u793A\u9818\u57DF\u3092\u4F5C\u6210\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002");return document.body.appendChild(e),{overlay:e,mount:t}}function k(e){return new Promise((t,o)=>{if(document.querySelector(`link[href="${e}"]`)){t();return}let n=document.createElement("link");n.rel="stylesheet",n.href=e,n.addEventListener("load",()=>t(),{once:!0}),n.addEventListener("error",()=>o(new Error("NEO\u306ECSS\u3092\u8AAD\u307F\u8FBC\u3081\u307E\u305B\u3093\u3067\u3057\u305F\u3002")),{once:!0}),document.head.appendChild(n)})}function B(e){return new Promise((t,o)=>{let i=document.createElement("script");i.src=e,i.addEventListener("load",()=>t(),{once:!0}),i.addEventListener("error",()=>o(new Error("NEO\u672C\u4F53\u3092\u8AAD\u307F\u8FBC\u3081\u307E\u305B\u3093\u3067\u3057\u305F\u3002")),{once:!0}),document.head.appendChild(i)})}async function w(){let e=document.getElementById(r);if(e){s(e,!0);return}let t=b();if(!t||!t.querySelector('[name="oekaki_thread1"]'))throw new Error("5ch\u306E\u304A\u7D75\u304B\u304D\u5BFE\u5FDC\u6295\u7A3F\u30D5\u30A9\u30FC\u30E0\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093\u3002\u30B9\u30EC\u30C3\u30C9\u306EWeb\u30DA\u30FC\u30B8\u3067\u5B9F\u884C\u3057\u3066\u304F\u3060\u3055\u3044\u3002");if(p())throw new Error("\u3053\u306E\u30DA\u30FC\u30B8\u3067\u306F\u5225\u306EPaintBBS NEO\u304C\u3059\u3067\u306B\u8D77\u52D5\u3057\u3066\u3044\u307E\u3059\u3002\u30DA\u30FC\u30B8\u3092\u518D\u8AAD\u307F\u8FBC\u307F\u3057\u3066\u304B\u3089\u5B9F\u884C\u3057\u3066\u304F\u3060\u3055\u3044\u3002");let{overlay:o,mount:i}=y(),n=document.createElement("div");n.className="neo-applet-paintbbs",n.dataset.width="600",n.dataset.height="430",i.appendChild(n);try{await Promise.all([k(`${f}neo.css`),B(`${f}neo.js`)]);let a=p();if(!a)throw new Error("PaintBBS NEO\u3092\u521D\u671F\u5316\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002");a.params={paintbbs:{image_width:String(500),image_height:String(250),color_bk:"#ffffff",color_bk2:"#ffffff",neo_confirm_unload:!0,neo_disable_grid_touch_move:!0,neo_disable_turn_original_glitch:!0,neo_enable_zoom_out:!0,neo_visibility_change_title_rewrite:!0}};let E=document;if(E.paintBBSCallback=v=>{if(v!=="check")return;let c=a.painter.getImage();if(!c)return alert("PaintBBS NEO\u304B\u3089\u753B\u50CF\u3092\u53D6\u5F97\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002"),!1;let u=c.toDataURL("image/png"),l=x(u);return c.width!==500||c.height!==250?(alert("\u753B\u50CF\u30B5\u30A4\u30BA\u304C500\xD7250px\u3067\u306F\u306A\u3044\u305F\u3081\u6DFB\u4ED8\u3067\u304D\u307E\u305B\u3093\u3002"),!1):l>128e3?(alert(`\u753B\u50CF\u304C5ch\u306E\u304A\u7D75\u304B\u304D\u4E0A\u9650\u3092\u8D85\u3048\u3066\u3044\u307E\u3059\uFF08${d(l)} / ${d(128e3)}\uFF09\u3002
\u63CF\u753B\u3092\u7C21\u7565\u5316\u3057\u3066\u304B\u3089\u3001\u3082\u3046\u4E00\u5EA6\u300C\u6295\u7A3F\u300D\u3092\u62BC\u3057\u3066\u304F\u3060\u3055\u3044\u3002`),!1):(_(t,o,u,l),!1)},!a.init())throw new Error("PaintBBS NEO\u306E\u63CF\u753B\u9818\u57DF\u3092\u521D\u671F\u5316\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002");a.start(),a.setStabilizeLevel(1)}catch(a){throw o.remove(),a}}w().catch(e=>{document.getElementById(g)?.remove();let t=e instanceof Error?e.message:String(e);alert(`5chneo: ${t}`)});})();
