"use strict";(()=>{var n="fivech-neo-overlay",E="fivech-neo-status",I="fivech-neo-loader",B="0.4.0";var _="5chneo",b="5chneo:tool-side",M="https://oekakibbs.moe/apps/neo/",w="funige/neo",k="master",O=`https://api.github.com/repos/${w}/commits/${k}`,L=`https://cdn.jsdelivr.net/gh/${w}`;function T(e){if(!e||typeof e!="object")return!1;let t=e;return t.channel===_&&typeof t.type=="string"}async function A(){try{let e=await fetch(O,{cache:"no-store",credentials:"omit",headers:{Accept:"application/vnd.github+json"},referrerPolicy:"no-referrer"});if(!e.ok)throw new Error(`GitHub API: ${e.status}`);let t=await e.json();if(typeof t.sha!="string"||!/^[0-9a-f]{40}$/.test(t.sha))throw new Error("GitHub API\u304B\u3089\u30B3\u30DF\u30C3\u30C8SHA\u3092\u53D6\u5F97\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002");return`${L}@${t.sha}/dist/`}catch(e){return console.warn("5chneo: PaintBBS NEO\u306E\u6700\u65B0\u7248\u3092\u53D6\u5F97\u3067\u304D\u306A\u3044\u305F\u3081\u65E2\u5B9A\u306E\u914D\u4FE1URL\u3092\u4F7F\u3044\u307E\u3059\u3002",e),M}}function $(){let e=document.querySelectorAll("form");return Array.from(e).find(t=>t.method.toLowerCase()==="post"&&t.querySelector('[name="MESSAGE"]')&&t.querySelector('[name="bbs"]')&&t.querySelector('[name="key"]'))??null}function H(e){let t=Math.max(0,e.length-22);return(t+(t%3?3-t%3:0))/3*4}function p(e){return`${Math.ceil(e/1e3)}KB`}function d(e,t){e.style.display=t?"flex":"none"}function y(e,t){let o=document.createElement("button");return o.type="button",o.className="fivech-neo-button",o.textContent=e,o.addEventListener("click",t),o}function C(e,t,o){document.getElementById(E)?.remove();let a=document.createElement("span");a.id=E,a.className="fivech-neo-attachment",a.append(`PaintBBS NEO\u306E\u753B\u50CF\u3092\u6DFB\u4ED8\u6E08\u307F\uFF08${p(o)}\uFF09 `),a.append(y("\u518D\u7DE8\u96C6",()=>d(t,!0))," ",y("\u6DFB\u4ED8\u3092\u89E3\u9664",()=>{e.querySelector('input[name="oekaki"]')?.remove(),a.remove()})),(e.querySelector('[name="oekaki_thread1"]')??e).insertAdjacentElement("afterend",a)}function P(e,t,o,a){let i=e.querySelector('input[name="oekaki"]');i||(i=document.createElement("input"),i.type="hidden",i.name="oekaki",e.appendChild(i)),i.value=o,C(e,t,a),d(t,!1)}function F(){let e=document.createElement("div");e.id=n,e.innerHTML=`
    <style>
      #${n} {
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
      #${n} .fivech-neo-panel {
        background: #f7f7f7;
        border-radius: 6px;
        box-shadow: 0 8px 32px rgb(0 0 0 / 45%);
        color: #222;
        max-width: max-content;
        min-width: 632px;
        padding: 10px 16px 16px;
      }
      #${n} .fivech-neo-header {
        align-items: center;
        display: flex;
        font: 14px/1.4 sans-serif;
        justify-content: space-between;
        margin-bottom: 8px;
      }
      #${n} .fivech-neo-title { font-weight: 700; }
      #${n} .fivech-neo-close,
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
      #${n} .fivech-neo-help {
        font: 12px/1.5 sans-serif;
        margin: 8px 0 0;
      }
      #${n} .fivech-neo-frame {
        border: 0;
        display: block;
        height: 460px;
        width: 620px;
      }
      #${n} .fivech-neo-mount { min-height: 460px; }
      .fivech-neo-attachment {
        display: inline-block;
        font: 13px/1.5 sans-serif;
        margin: 6px 0;
      }
      #${n}.fivech-neo-fullscreen { padding: 0; }
      #${n}.fivech-neo-fullscreen .fivech-neo-panel {
        border-radius: 0;
        height: 100vh;
        max-width: none;
        min-width: 0;
        padding: 0;
        width: 100vw;
      }
      #${n}.fivech-neo-fullscreen .fivech-neo-header,
      #${n}.fivech-neo-fullscreen .fivech-neo-help { display: none; }
      #${n}.fivech-neo-fullscreen .fivech-neo-frame {
        height: 100vh;
        width: 100vw;
      }
      @media (max-width: 680px) {
        #${n} { justify-content: flex-start; padding: 8px; }
        #${n}.fivech-neo-fullscreen { padding: 0; }
      }
    </style>
    <div class="fivech-neo-panel" role="dialog" aria-modal="true" aria-label="PaintBBS NEO">
      <div class="fivech-neo-header">
        <span class="fivech-neo-title">PaintBBS NEO \u2014 5ch\u304A\u7D75\u304B\u304D v${B}</span>
        <button type="button" class="fivech-neo-close">\u9589\u3058\u308B</button>
      </div>
      <div class="fivech-neo-mount"></div>
      <p class="fivech-neo-help">\u63CF\u304D\u7D42\u3048\u305F\u3089PaintBBS NEO\u5185\u306E\u300C\u6295\u7A3F\u300D\u30DC\u30BF\u30F3\u3092\u62BC\u3057\u3066\u304F\u3060\u3055\u3044\u3002\u753B\u50CF\u30925ch\u306E\u6295\u7A3F\u30D5\u30A9\u30FC\u30E0\u3078\u6DFB\u4ED8\u3057\u307E\u3059\u3002</p>
    </div>`,e.querySelector(".fivech-neo-close")?.addEventListener("click",()=>d(e,!1));let t=e.querySelector(".fivech-neo-mount");if(!t)throw new Error("PaintBBS NEO\u306E\u8868\u793A\u9818\u57DF\u3092\u4F5C\u6210\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002");return document.body.appendChild(e),{overlay:e,mount:t}}function D(e){let t=JSON.stringify({paintbbs:{image_width:String(500),image_height:String(250),color_bk:"#ffffff",color_bk2:"#ffffff",neo_confirm_unload:!0,neo_disable_grid_touch_move:!0,neo_disable_turn_original_glitch:!0,neo_enable_zoom_out:!0,neo_visibility_change_title_rewrite:!0}});return`<!doctype html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="${e}neo.css">
  <style>
    html,body{margin:0;padding:0;background:#f7f7f7;overflow:auto}
    #fivech-neo-color-picker{align-items:center;display:inline-flex;gap:4px;margin-left:8px}
    #fivech-neo-color-picker input[type="color"]{appearance:auto;background:transparent;border:0;cursor:pointer;height:22px;padding:0;width:30px}
    #fivech-neo-tool-side{appearance:auto;background:#eee;border:1px solid #888;border-radius:3px;color:#111;cursor:pointer;font:12px/1.4 sans-serif;margin-left:8px;padding:1px 6px;vertical-align:middle}
  </style>
</head>
<body>
  <div class="neo-applet-paintbbs" data-width="600" data-height="430"></div>
  <script data-cfasync="false" src="${e}neo.js"><\/script>
  <script>
    (() => {
      const send = (type, payload = {}) => {
        parent.postMessage({ channel: "${_}", type, ...payload }, "*");
      };

      if (typeof Neo === "undefined") {
        send("error", { message: "NEO\u672C\u4F53\u3092\u8AAD\u307F\u8FBC\u3081\u307E\u305B\u3093\u3067\u3057\u305F\u3002" });
        return;
      }

      Neo.params = ${t};
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

      document.addEventListener("neo:fullscreenchange", (event) => {
        send("fullscreen", { fullscreen: Boolean(event.detail && event.detail.fullscreen) });
      });

      const addColorPicker = () => {
        const footer = document.getElementById("neo-footerButtons");
        if (!footer || document.getElementById("fivech-neo-color-picker")) return;

        const label = document.createElement("label");
        label.id = "fivech-neo-color-picker";
        label.append("\u30D1\u30EC\u30C3\u30C8");

        const input = document.createElement("input");
        input.type = "color";
        input.title = "\u9078\u629E\u4E2D\u306E\u30D1\u30EC\u30C3\u30C8\u3078\u8272\u3092\u53D6\u308A\u8FBC\u3080";
        input.setAttribute("aria-label", input.title);
        const currentColor = Neo.painter && Neo.painter.foregroundColor;
        if (typeof currentColor === "string" && /^#[0-9a-f]{6}$/i.test(currentColor)) {
          input.value = currentColor;
        }
        input.addEventListener("input", () => Neo.setColor(input.value));

        label.appendChild(input);
        footer.appendChild(label);
      };

      const addToolSideButton = () => {
        const footer = document.getElementById("neo-footerButtons");
        if (!footer || document.getElementById("fivech-neo-tool-side")) return;

        const button = document.createElement("button");
        button.id = "fivech-neo-tool-side";
        button.type = "button";

        const updateButton = () => {
          const destination = Neo.toolSide ? "\u53F3" : "\u5DE6";
          button.textContent = "\u30C4\u30FC\u30EB\u3092" + destination + "\u3078";
          button.title = "\u30C4\u30FC\u30EB\u30D0\u30FC\u3092\u30AD\u30E3\u30F3\u30D0\u30B9\u306E" + destination + "\u5074\u3078\u79FB\u52D5\u3059\u308B";
          button.setAttribute("aria-label", button.title);
        };

        try {
          const storedSide = localStorage.getItem("${b}");
          if (storedSide === "left" || storedSide === "right") {
            Neo.setToolSide(storedSide === "left");
          }
        } catch {}

        button.addEventListener("click", () => {
          const useLeftSide = !Neo.toolSide;
          Neo.setToolSide(useLeftSide);
          try {
            localStorage.setItem("${b}", useLeftSide ? "left" : "right");
          } catch {}
          updateButton();
        });

        updateButton();
        footer.appendChild(button);
      };

      document.addEventListener("DOMContentLoaded", () => {
        setTimeout(() => {
          if (!Neo.painter) {
            send("error", { message: "PaintBBS NEO\u306E\u63CF\u753B\u9818\u57DF\u3092\u521D\u671F\u5316\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002" });
            return;
          }
          Neo.setStabilizeLevel(1);
          addColorPicker();
          addToolSideButton();
          send("ready");
        }, 0);
      });
    })();
  <\/script>
</body>
</html>`}function G(e,t,o,a){return new Promise((i,h)=>{let c=document.createElement("iframe");c.className="fivech-neo-frame",c.title="PaintBBS NEO";let u=!1,f=null,S=()=>{let s=c.contentDocument,r=c.contentWindow,l=s?.getElementById("neo-windowView");if(!r||!l)return;let v=()=>{let N=r.getComputedStyle(l).display!=="none";t.classList.toggle("fivech-neo-fullscreen",N)};f?.disconnect(),f=new MutationObserver(v),f.observe(l,{attributes:!0,attributeFilter:["class","style"]}),v()},g=window.setTimeout(()=>{u||(window.removeEventListener("message",m),h(new Error("PaintBBS NEO\u306E\u8D77\u52D5\u304C\u30BF\u30A4\u30E0\u30A2\u30A6\u30C8\u3057\u307E\u3057\u305F\u3002")))},2e4),x=s=>{if(u){alert(`5chneo: ${s}`);return}window.clearTimeout(g),window.removeEventListener("message",m),h(new Error(s))},m=s=>{if(s.source!==c.contentWindow||!T(s.data))return;let r=s.data;if(r.type==="error"){x(r.message??"PaintBBS NEO\u3067\u30A8\u30E9\u30FC\u304C\u767A\u751F\u3057\u307E\u3057\u305F\u3002");return}if(r.type==="ready"){u=!0,window.clearTimeout(g),S(),i();return}if(r.type==="fullscreen"){t.classList.toggle("fivech-neo-fullscreen",r.fullscreen===!0);return}if(r.type!=="image"||!r.dataUrl)return;let l=H(r.dataUrl);if(r.width!==500||r.height!==250){alert("\u753B\u50CF\u30B5\u30A4\u30BA\u304C500\xD7250px\u3067\u306F\u306A\u3044\u305F\u3081\u6DFB\u4ED8\u3067\u304D\u307E\u305B\u3093\u3002");return}if(l>128e3){alert(`\u753B\u50CF\u304C5ch\u306E\u304A\u7D75\u304B\u304D\u4E0A\u9650\u3092\u8D85\u3048\u3066\u3044\u307E\u3059\uFF08${p(l)} / ${p(128e3)}\uFF09\u3002
\u63CF\u753B\u3092\u7C21\u7565\u5316\u3057\u3066\u304B\u3089\u3001\u3082\u3046\u4E00\u5EA6\u300C\u6295\u7A3F\u300D\u3092\u62BC\u3057\u3066\u304F\u3060\u3055\u3044\u3002`);return}P(e,t,r.dataUrl,l)};window.addEventListener("message",m),c.srcdoc=D(a),o.appendChild(c)})}async function q(){let e=document.getElementById(n);if(e){d(e,!0);return}let t=$();if(!t||!t.querySelector('[name="oekaki_thread1"]'))throw new Error("5ch\u306E\u304A\u7D75\u304B\u304D\u5BFE\u5FDC\u6295\u7A3F\u30D5\u30A9\u30FC\u30E0\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093\u3002\u30B9\u30EC\u30C3\u30C9\u306EWeb\u30DA\u30FC\u30B8\u3067\u5B9F\u884C\u3057\u3066\u304F\u3060\u3055\u3044\u3002");let{overlay:o,mount:a}=F();try{let i=await A();await G(t,o,a,i)}catch(i){throw o.remove(),i}}q().catch(e=>{document.getElementById(I)?.remove();let t=e instanceof Error?e.message:String(e);alert(`5chneo: ${t}`)});})();
