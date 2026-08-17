"use strict";(()=>{var r="fivech-neo-overlay",h="fivech-neo-status",b="fivech-neo-loader";var v="5chneo",g="https://oekakibbs.moe/apps/neo/";function _(e){if(!e||typeof e!="object")return!1;let t=e;return t.channel===v&&typeof t.type=="string"}function w(){let e=document.querySelectorAll("form");return Array.from(e).find(t=>t.method.toLowerCase()==="post"&&t.querySelector('[name="MESSAGE"]')&&t.querySelector('[name="bbs"]')&&t.querySelector('[name="key"]'))??null}function x(e){let t=Math.max(0,e.length-22);return(t+(t%3?3-t%3:0))/3*4}function f(e){return`${Math.ceil(e/1e3)}KB`}function l(e,t){e.style.display=t?"flex":"none"}function E(e,t){let n=document.createElement("button");return n.type="button",n.className="fivech-neo-button",n.textContent=e,n.addEventListener("click",t),n}function M(e,t,n){document.getElementById(h)?.remove();let a=document.createElement("span");a.id=h,a.className="fivech-neo-attachment",a.append(`PaintBBS NEO\u306E\u753B\u50CF\u3092\u6DFB\u4ED8\u6E08\u307F\uFF08${f(n)}\uFF09 `),a.append(E("\u518D\u7DE8\u96C6",()=>l(t,!0))," ",E("\u6DFB\u4ED8\u3092\u89E3\u9664",()=>{e.querySelector('input[name="oekaki"]')?.remove(),a.remove()})),(e.querySelector('[name="oekaki_thread1"]')??e).insertAdjacentElement("afterend",a)}function S(e,t,n,a){let o=e.querySelector('input[name="oekaki"]');o||(o=document.createElement("input"),o.type="hidden",o.name="oekaki",e.appendChild(o)),o.value=n,M(e,t,a),l(t,!1)}function k(){let e=document.createElement("div");e.id=r,e.innerHTML=`
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
      #${r} .fivech-neo-frame {
        border: 0;
        display: block;
        height: 460px;
        width: 620px;
      }
      #${r} .fivech-neo-mount { min-height: 460px; }
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
    </div>`,e.querySelector(".fivech-neo-close")?.addEventListener("click",()=>l(e,!1));let t=e.querySelector(".fivech-neo-mount");if(!t)throw new Error("PaintBBS NEO\u306E\u8868\u793A\u9818\u57DF\u3092\u4F5C\u6210\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002");return document.body.appendChild(e),{overlay:e,mount:t}}function N(){let e=JSON.stringify({paintbbs:{image_width:String(500),image_height:String(250),color_bk:"#ffffff",color_bk2:"#ffffff",neo_confirm_unload:!0,neo_disable_grid_touch_move:!0,neo_disable_turn_original_glitch:!0,neo_enable_zoom_out:!0,neo_visibility_change_title_rewrite:!0}});return`<!doctype html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="${g}neo.css">
  <style>html,body{margin:0;padding:0;background:#f7f7f7;overflow:auto}</style>
</head>
<body>
  <div class="neo-applet-paintbbs" data-width="600" data-height="430"></div>
  <script data-cfasync="false" src="${g}neo.js"><\/script>
  <script>
    (() => {
      const send = (type, payload = {}) => {
        parent.postMessage({ channel: "${v}", type, ...payload }, "*");
      };

      if (typeof Neo === "undefined") {
        send("error", { message: "NEO\u672C\u4F53\u3092\u8AAD\u307F\u8FBC\u3081\u307E\u305B\u3093\u3067\u3057\u305F\u3002" });
        return;
      }

      Neo.params = ${e};
      document.paintBBSCallback = (event) => {
        if (event !== "check") return;
        const canvas = Neo.painter && Neo.painter.getImage();
        if (!canvas) {
          send("error", { message: "PaintBBS NEO\u304B\u3089\u753B\u50CF\u3092\u53D6\u5F97\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002" });
          return false;
        }
        send("image", {
          dataUrl: canvas.toDataURL("image/png"),
          width: canvas.width,
          height: canvas.height,
        });
        return false;
      };

      document.addEventListener("DOMContentLoaded", () => {
        setTimeout(() => {
          if (!Neo.painter) {
            send("error", { message: "PaintBBS NEO\u306E\u63CF\u753B\u9818\u57DF\u3092\u521D\u671F\u5316\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002" });
            return;
          }
          Neo.setStabilizeLevel(1);
          send("ready");
        }, 0);
      });
    })();
  <\/script>
</body>
</html>`}function T(e,t,n){return new Promise((a,o)=>{let c=document.createElement("iframe");c.className="fivech-neo-frame",c.title="PaintBBS NEO";let d=!1,p=window.setTimeout(()=>{d||(window.removeEventListener("message",m),o(new Error("PaintBBS NEO\u306E\u8D77\u52D5\u304C\u30BF\u30A4\u30E0\u30A2\u30A6\u30C8\u3057\u307E\u3057\u305F\u3002")))},2e4),y=s=>{if(d){alert(`5chneo: ${s}`);return}window.clearTimeout(p),window.removeEventListener("message",m),o(new Error(s))},m=s=>{if(s.source!==c.contentWindow||!_(s.data))return;let i=s.data;if(i.type==="error"){y(i.message??"PaintBBS NEO\u3067\u30A8\u30E9\u30FC\u304C\u767A\u751F\u3057\u307E\u3057\u305F\u3002");return}if(i.type==="ready"){d=!0,window.clearTimeout(p),a();return}if(i.type!=="image"||!i.dataUrl)return;let u=x(i.dataUrl);if(i.width!==500||i.height!==250){alert("\u753B\u50CF\u30B5\u30A4\u30BA\u304C500\xD7250px\u3067\u306F\u306A\u3044\u305F\u3081\u6DFB\u4ED8\u3067\u304D\u307E\u305B\u3093\u3002");return}if(u>128e3){alert(`\u753B\u50CF\u304C5ch\u306E\u304A\u7D75\u304B\u304D\u4E0A\u9650\u3092\u8D85\u3048\u3066\u3044\u307E\u3059\uFF08${f(u)} / ${f(128e3)}\uFF09\u3002
\u63CF\u753B\u3092\u7C21\u7565\u5316\u3057\u3066\u304B\u3089\u3001\u3082\u3046\u4E00\u5EA6\u300C\u6295\u7A3F\u300D\u3092\u62BC\u3057\u3066\u304F\u3060\u3055\u3044\u3002`);return}S(e,t,i.dataUrl,u)};window.addEventListener("message",m),c.srcdoc=N(),n.appendChild(c)})}async function H(){let e=document.getElementById(r);if(e){l(e,!0);return}let t=w();if(!t||!t.querySelector('[name="oekaki_thread1"]'))throw new Error("5ch\u306E\u304A\u7D75\u304B\u304D\u5BFE\u5FDC\u6295\u7A3F\u30D5\u30A9\u30FC\u30E0\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093\u3002\u30B9\u30EC\u30C3\u30C9\u306EWeb\u30DA\u30FC\u30B8\u3067\u5B9F\u884C\u3057\u3066\u304F\u3060\u3055\u3044\u3002");let{overlay:n,mount:a}=k();try{await T(t,n,a)}catch(o){throw n.remove(),o}}H().catch(e=>{document.getElementById(b)?.remove();let t=e instanceof Error?e.message:String(e);alert(`5chneo: ${t}`)});})();
