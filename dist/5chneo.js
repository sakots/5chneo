"use strict";(()=>{var i="fivech-neo-overlay",m="fivech-neo-debug-dialog",T="fivech-neo-status",R="fivech-neo-loader",O="0.5.0";var A="5chneo",I="5chneo:tool-side",$="5chneo:debug-storage-test";var U="https://oekakibbs.moe/apps/neo/",H="funige/neo",V="master",j=`https://api.github.com/repos/${H}/commits/${V}`,W=`https://cdn.jsdelivr.net/gh/${H}`,C=Date.now(),E=[],D="script-loaded",b=null;function w(e){return e instanceof Error?`${e.name}: ${e.message}`:String(e)}function s(e,t){E.length>=200&&E.shift(),E.push({elapsedMs:Date.now()-C,event:e,...t?{detail:t}:{}})}function g(e,t){D=e,s(e,t)}function z(e){if(!e||typeof e!="object")return!1;let t=e;return t.channel===A&&typeof t.type=="string"}async function K(){g("resolving-neo-source");try{let e=await fetch(j,{cache:"no-store",credentials:"omit",headers:{Accept:"application/vnd.github+json"},referrerPolicy:"no-referrer"});if(!e.ok)throw new Error(`GitHub API: ${e.status}`);let t=await e.json();if(typeof t.sha!="string"||!/^[0-9a-f]{40}$/.test(t.sha))throw new Error("GitHub API\u304B\u3089\u30B3\u30DF\u30C3\u30C8SHA\u3092\u53D6\u5F97\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002");return b=`${W}@${t.sha}/dist/`,s("neo-source-resolved",t.sha),b}catch(e){return console.warn("5chneo: PaintBBS NEO\u306E\u6700\u65B0\u7248\u3092\u53D6\u5F97\u3067\u304D\u306A\u3044\u305F\u3081\u65E2\u5B9A\u306E\u914D\u4FE1URL\u3092\u4F7F\u3044\u307E\u3059\u3002",e),b=U,s("neo-source-fallback",w(e)),b}}function P(){let e=document.querySelectorAll("form");return Array.from(e).find(t=>t.method.toLowerCase()==="post"&&t.querySelector('[name="MESSAGE"]')&&t.querySelector('[name="bbs"]')&&t.querySelector('[name="key"]'))??null}function k(e){try{let t=new URL(e,location.href);return`${t.origin}${t.pathname}`}catch{return"(invalid URL)"}}function N(e){let t;try{return t=e==="localStorage"?window.localStorage:window.sessionStorage,t.setItem($,"ok"),t.getItem($)==="ok"?"available":"read-back failed"}catch(n){return`unavailable (${w(n)})`}finally{try{t?.removeItem($)}catch{}}}function y(){let e=P(),t=e?.querySelector('input[name="oekaki"]'),n=t?.value??"",o=document.querySelector(`#${i} .fivech-neo-frame`),l=o?.contentWindow?.Neo,c=window.visualViewport,f=E.length?E.map(({elapsedMs:d,event:h,detail:v})=>`+${d}ms ${h}${v?` | ${v.replace(/\s+/g," ")}`:""}`):["(none)"];return["5chneo debug report",`generatedAt: ${new Date().toISOString()}`,`appVersion: ${O}`,`stage: ${D}`,`elapsedMs: ${Date.now()-C}`,"","[page]",`url: ${k(location.href)}`,`documentReadyState: ${document.readyState}`,`visibilityState: ${document.visibilityState}`,`secureContext: ${window.isSecureContext}`,`online: ${navigator.onLine}`,"","[browser]",`userAgent: ${navigator.userAgent}`,`platform: ${navigator.platform||"(empty)"}`,`languages: ${navigator.languages.join(", ")||"(empty)"}`,`timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone||"(unknown)"}`,`cookieEnabled: ${navigator.cookieEnabled}`,`maxTouchPoints: ${navigator.maxTouchPoints}`,`screen: ${screen.width}x${screen.height}`,`viewport: ${window.innerWidth}x${window.innerHeight}`,`visualViewport: ${c?`${c.width}x${c.height} scale=${c.scale}`:"unavailable"}`,`devicePixelRatio: ${window.devicePixelRatio}`,"","[capabilities]",`localStorage: ${N("localStorage")}`,`sessionStorage: ${N("sessionStorage")}`,`clipboardWrite: ${!!navigator.clipboard?.writeText}`,`legacyCopy: ${document.queryCommandSupported?.("copy")??!1}`,`canvas2d: ${!!document.createElement("canvas").getContext("2d")}`,`iframeSrcdoc: ${"srcdoc"in document.createElement("iframe")}`,"","[5ch form]",`formFound: ${!!e}`,`formCount: ${document.forms.length}`,`formAction: ${e?k(e.action):"(none)"}`,`formMethod: ${e?.method.toUpperCase()||"(none)"}`,`formEncoding: ${e?.enctype||"(none)"}`,`messageField: ${!!e?.querySelector('[name="MESSAGE"]')}`,`bbsField: ${!!e?.querySelector('[name="bbs"]')}`,`keyField: ${!!e?.querySelector('[name="key"]')}`,`standardOekakiField: ${!!e?.querySelector('[name="oekaki_thread1"]')}`,`neoOekakiField: ${!!t}`,`neoImageDataFormat: ${n?n.startsWith("data:image/png;base64,")?"png data URL":"unexpected":"(none)"}`,`neoImageEstimatedBytes: ${n?F(n):0}`,"","[PaintBBS NEO]",`sourceBase: ${b??"(not resolved)"}`,`iframeFound: ${!!o}`,`iframeReadyState: ${o?.contentDocument?.readyState??"(unavailable)"}`,`neoGlobal: ${!!l}`,`neoVersion: ${typeof l?.version=="string"?l.version:"(unknown)"}`,`neoPainter: ${!!l?.painter}`,`toolSide: ${l?l.toolSide?"left":"right":"(unknown)"}`,"","[events]",...f,""].join(`
`)}function L(e){document.getElementById(m)?.remove();let t=document.createElement("div");t.id=m,t.innerHTML=`
    <style>
      #${m} {
        align-items: center;
        background: rgb(0 0 0 / 72%);
        box-sizing: border-box;
        display: flex;
        inset: 0;
        justify-content: center;
        padding: 16px;
        position: fixed;
        z-index: 2147483647;
      }
      #${m} .fivech-neo-debug-panel {
        background: #f7f7f7;
        border-radius: 6px;
        box-shadow: 0 8px 32px rgb(0 0 0 / 45%);
        box-sizing: border-box;
        color: #222;
        font: 13px/1.5 sans-serif;
        max-height: calc(100vh - 32px);
        max-width: 760px;
        overflow: auto;
        padding: 14px;
        width: 100%;
      }
      #${m} h2 { font: 700 16px/1.4 sans-serif; margin: 0 0 6px; }
      #${m} p { margin: 4px 0 8px; }
      #${m} textarea {
        background: #fff;
        border: 1px solid #888;
        box-sizing: border-box;
        color: #111;
        display: block;
        font: 12px/1.4 monospace;
        height: min(55vh, 460px);
        margin: 8px 0;
        padding: 8px;
        resize: vertical;
        width: 100%;
      }
      #${m} .fivech-neo-debug-actions { display: flex; flex-wrap: wrap; gap: 6px; }
      #${m} button {
        appearance: auto;
        background: #eee;
        border: 1px solid #888;
        border-radius: 3px;
        color: #111;
        cursor: pointer;
        font: 13px/1.4 sans-serif;
        margin: 0;
        padding: 3px 9px;
        text-transform: none;
      }
      #${m} .fivech-neo-debug-status { min-height: 1.5em; }
    </style>
    <div class="fivech-neo-debug-panel" role="dialog" aria-modal="true" aria-labelledby="fivech-neo-debug-title">
      <h2 id="fivech-neo-debug-title">5chneo \u30C7\u30D0\u30C3\u30B0\u60C5\u5831</h2>
      <p class="fivech-neo-debug-reason"></p>
      <p>\u6295\u7A3F\u672C\u6587\u30FBCookie\u306E\u5185\u5BB9\u30FB\u63CF\u753B\u753B\u50CF\u306F\u542B\u307E\u308C\u307E\u305B\u3093\u3002\u5185\u5BB9\u3092\u78BA\u8A8D\u3057\u3066\u304B\u3089\u5171\u6709\u3057\u3066\u304F\u3060\u3055\u3044\u3002</p>
      <textarea readonly spellcheck="false" aria-label="\u30C7\u30D0\u30C3\u30B0\u60C5\u5831"></textarea>
      <p class="fivech-neo-debug-status" role="status"></p>
      <div class="fivech-neo-debug-actions">
        <button type="button" data-action="refresh">\u66F4\u65B0</button>
        <button type="button" data-action="copy">\u30B3\u30D4\u30FC</button>
        <button type="button" data-action="download">\u30D5\u30A1\u30A4\u30EB\u4FDD\u5B58</button>
        <button type="button" data-action="close">\u9589\u3058\u308B</button>
      </div>
    </div>`;let n=t.querySelector("textarea"),o=t.querySelector(".fivech-neo-debug-status"),a=t.querySelector(".fivech-neo-debug-reason");if(!n||!o||!a)return;a.textContent=e?`\u30A8\u30E9\u30FC: ${e}`:"\u73FE\u5728\u306E\u8A3A\u65AD\u60C5\u5831\u3067\u3059\u3002";let l=()=>{n.value=y(),o.textContent="\u60C5\u5831\u3092\u66F4\u65B0\u3057\u307E\u3057\u305F\u3002"};t.querySelector('[data-action="refresh"]')?.addEventListener("click",l),t.querySelector('[data-action="copy"]')?.addEventListener("click",async()=>{n.value=y();try{await navigator.clipboard.writeText(n.value),o.textContent="\u30AF\u30EA\u30C3\u30D7\u30DC\u30FC\u30C9\u3078\u30B3\u30D4\u30FC\u3057\u307E\u3057\u305F\u3002"}catch{n.focus(),n.select();try{o.textContent=document.execCommand("copy")?"\u30AF\u30EA\u30C3\u30D7\u30DC\u30FC\u30C9\u3078\u30B3\u30D4\u30FC\u3057\u307E\u3057\u305F\u3002":"\u81EA\u52D5\u30B3\u30D4\u30FC\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u9078\u629E\u4E2D\u306E\u5185\u5BB9\u3092\u624B\u52D5\u3067\u30B3\u30D4\u30FC\u3057\u3066\u304F\u3060\u3055\u3044\u3002"}catch{o.textContent="\u81EA\u52D5\u30B3\u30D4\u30FC\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u9078\u629E\u4E2D\u306E\u5185\u5BB9\u3092\u624B\u52D5\u3067\u30B3\u30D4\u30FC\u3057\u3066\u304F\u3060\u3055\u3044\u3002"}}}),t.querySelector('[data-action="download"]')?.addEventListener("click",()=>{n.value=y();let c=new Blob([n.value],{type:"text/plain;charset=utf-8"}),f=URL.createObjectURL(c),d=document.createElement("a"),h=new Date().toISOString().replace(/\D/g,"").slice(0,14);d.href=f,d.download=`5chneo-debug-${h}.txt`,document.body.appendChild(d),d.click(),d.remove(),window.setTimeout(()=>URL.revokeObjectURL(f),0),o.textContent="\u30C7\u30D0\u30C3\u30B0\u60C5\u5831\u3092\u30D5\u30A1\u30A4\u30EB\u3078\u66F8\u304D\u51FA\u3057\u307E\u3057\u305F\u3002"}),t.querySelector('[data-action="close"]')?.addEventListener("click",()=>t.remove()),n.value=y(),document.body.appendChild(t)}function F(e){let t=Math.max(0,e.length-22);return(t+(t%3?3-t%3:0))/3*4}function _(e){return`${Math.ceil(e/1e3)}KB`}function S(e,t){e.style.display=t?"flex":"none"}function M(e,t){let n=document.createElement("button");return n.type="button",n.className="fivech-neo-button",n.textContent=e,n.addEventListener("click",t),n}function X(e,t,n){document.getElementById(T)?.remove();let o=document.createElement("span");o.id=T,o.className="fivech-neo-attachment",o.append(`PaintBBS NEO\u306E\u753B\u50CF\u3092\u6DFB\u4ED8\u6E08\u307F\uFF08${_(n)}\uFF09 `),o.append(M("\u518D\u7DE8\u96C6",()=>S(t,!0))," ",M("\u6DFB\u4ED8\u3092\u89E3\u9664",()=>{e.querySelector('input[name="oekaki"]')?.remove(),o.remove()})),(e.querySelector('[name="oekaki_thread1"]')??e).insertAdjacentElement("afterend",o)}function Z(e,t,n,o){let a=e.querySelector('input[name="oekaki"]');a||(a=document.createElement("input"),a.type="hidden",a.name="oekaki",e.appendChild(a)),a.value=n,s("image-attached",`${o} bytes`),X(e,t,o),S(t,!1)}function Y(){let e=document.createElement("div");e.id=i,e.innerHTML=`
    <style>
      #${i} {
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
      #${i} .fivech-neo-panel {
        background: #f7f7f7;
        border-radius: 6px;
        box-shadow: 0 8px 32px rgb(0 0 0 / 45%);
        color: #222;
        max-width: max-content;
        min-width: 632px;
        padding: 10px 16px 16px;
      }
      #${i} .fivech-neo-header {
        align-items: center;
        display: flex;
        font: 14px/1.4 sans-serif;
        justify-content: space-between;
        margin-bottom: 8px;
      }
      #${i} .fivech-neo-title { font-weight: 700; }
      #${i} .fivech-neo-header-actions { display: flex; gap: 6px; }
      #${i} .fivech-neo-debug,
      #${i} .fivech-neo-close,
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
      #${i} .fivech-neo-help {
        font: 12px/1.5 sans-serif;
        margin: 8px 0 0;
      }
      #${i} .fivech-neo-frame {
        border: 0;
        display: block;
        height: 460px;
        width: 620px;
      }
      #${i} .fivech-neo-mount { min-height: 460px; }
      .fivech-neo-attachment {
        display: inline-block;
        font: 13px/1.5 sans-serif;
        margin: 6px 0;
      }
      #${i}.fivech-neo-fullscreen { padding: 0; }
      #${i}.fivech-neo-fullscreen .fivech-neo-panel {
        border-radius: 0;
        height: 100vh;
        max-width: none;
        min-width: 0;
        padding: 0;
        width: 100vw;
      }
      #${i}.fivech-neo-fullscreen .fivech-neo-header,
      #${i}.fivech-neo-fullscreen .fivech-neo-help { display: none; }
      #${i}.fivech-neo-fullscreen .fivech-neo-frame {
        height: 100vh;
        width: 100vw;
      }
      @media (max-width: 680px) {
        #${i} { justify-content: flex-start; padding: 8px; }
        #${i}.fivech-neo-fullscreen { padding: 0; }
      }
    </style>
    <div class="fivech-neo-panel" role="dialog" aria-modal="true" aria-label="PaintBBS NEO">
      <div class="fivech-neo-header">
        <span class="fivech-neo-title">PaintBBS NEO \u2014 5ch\u304A\u7D75\u304B\u304D v${O}</span>
        <div class="fivech-neo-header-actions">
          <button type="button" class="fivech-neo-debug">\u30C7\u30D0\u30C3\u30B0\u60C5\u5831</button>
          <button type="button" class="fivech-neo-close">\u9589\u3058\u308B</button>
        </div>
      </div>
      <div class="fivech-neo-mount"></div>
      <p class="fivech-neo-help">\u63CF\u304D\u7D42\u3048\u305F\u3089PaintBBS NEO\u5185\u306E\u300C\u6295\u7A3F\u300D\u30DC\u30BF\u30F3\u3092\u62BC\u3057\u3066\u304F\u3060\u3055\u3044\u3002\u753B\u50CF\u30925ch\u306E\u6295\u7A3F\u30D5\u30A9\u30FC\u30E0\u3078\u6DFB\u4ED8\u3057\u307E\u3059\u3002</p>
    </div>`,e.querySelector(".fivech-neo-close")?.addEventListener("click",()=>S(e,!1)),e.querySelector(".fivech-neo-debug")?.addEventListener("click",()=>L());let t=e.querySelector(".fivech-neo-mount");if(!t)throw new Error("PaintBBS NEO\u306E\u8868\u793A\u9818\u57DF\u3092\u4F5C\u6210\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002");return document.body.appendChild(e),{overlay:e,mount:t}}function J(e){let t=JSON.stringify({paintbbs:{image_width:String(500),image_height:String(250),color_bk:"#ffffff",color_bk2:"#ffffff",neo_confirm_unload:!0,neo_disable_grid_touch_move:!0,neo_disable_turn_original_glitch:!0,neo_enable_zoom_out:!0,neo_visibility_change_title_rewrite:!0}});return`<!doctype html>
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
        parent.postMessage({ channel: "${A}", type, ...payload }, "*");
      };

      const describeError = (value) => {
        const message = value && typeof value.message === "string"
          ? (typeof value.name === "string" ? value.name + ": " : "") + value.message
          : String(value);
        return message.slice(0, 500);
      };
      window.addEventListener("error", (event) => {
        send("debug", { event: "frame-error", detail: describeError(event.error || event.message) });
      });
      window.addEventListener("unhandledrejection", (event) => {
        send("debug", { event: "frame-unhandled-rejection", detail: describeError(event.reason) });
      });

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
          const storedSide = localStorage.getItem("${I}");
          if (storedSide === "left" || storedSide === "right") {
            Neo.setToolSide(storedSide === "left");
          }
        } catch (error) {
          send("debug", { event: "tool-side-storage-read-failed", detail: describeError(error) });
        }

        button.addEventListener("click", () => {
          const useLeftSide = !Neo.toolSide;
          Neo.setToolSide(useLeftSide);
          try {
            localStorage.setItem("${I}", useLeftSide ? "left" : "right");
          } catch (error) {
            send("debug", { event: "tool-side-storage-write-failed", detail: describeError(error) });
          }
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
          send("ready", {
            neoVersion: String(Neo.version || "unknown"),
            toolSide: Neo.toolSide ? "left" : "right",
          });
        }, 0);
      });
    })();
  <\/script>
</body>
</html>`}function Q(e,t,n,o){return new Promise((a,l)=>{g("starting-neo-frame",o);let c=document.createElement("iframe");c.className="fivech-neo-frame",c.title="PaintBBS NEO";let f=!1,d=null,h=()=>{let u=c.contentDocument,r=c.contentWindow,p=u?.getElementById("neo-windowView");if(!r||!p)return;let B=()=>{let G=r.getComputedStyle(p).display!=="none";t.classList.toggle("fivech-neo-fullscreen",G)};d?.disconnect(),d=new MutationObserver(B),d.observe(p,{attributes:!0,attributeFilter:["class","style"]}),B()},v=window.setTimeout(()=>{f||(window.removeEventListener("message",x),s("neo-frame-timeout"),l(new Error("PaintBBS NEO\u306E\u8D77\u52D5\u304C\u30BF\u30A4\u30E0\u30A2\u30A6\u30C8\u3057\u307E\u3057\u305F\u3002")))},2e4),q=u=>{if(s("neo-frame-error",u),f){alert(`5chneo: ${u}`),L(u);return}window.clearTimeout(v),window.removeEventListener("message",x),l(new Error(u))},x=u=>{if(u.source!==c.contentWindow||!z(u.data))return;let r=u.data;if(r.type==="debug"){s(r.event??"neo-frame-debug",r.detail);return}if(r.type==="error"){q(r.message??"PaintBBS NEO\u3067\u30A8\u30E9\u30FC\u304C\u767A\u751F\u3057\u307E\u3057\u305F\u3002");return}if(r.type==="ready"){f=!0,window.clearTimeout(v),h(),g("ready",`NEO ${r.neoVersion??"unknown"}, tools ${r.toolSide??"unknown"}`),a();return}if(r.type==="fullscreen"){s("fullscreen-change",String(r.fullscreen===!0)),t.classList.toggle("fivech-neo-fullscreen",r.fullscreen===!0);return}if(r.type!=="image"||!r.dataUrl)return;let p=F(r.dataUrl);if(s("image-received",`${r.width??"unknown"}x${r.height??"unknown"}, ${p} bytes`),r.width!==500||r.height!==250){s("image-rejected","unexpected dimensions"),alert("\u753B\u50CF\u30B5\u30A4\u30BA\u304C500\xD7250px\u3067\u306F\u306A\u3044\u305F\u3081\u6DFB\u4ED8\u3067\u304D\u307E\u305B\u3093\u3002");return}if(p>128e3){s("image-rejected","size limit exceeded"),alert(`\u753B\u50CF\u304C5ch\u306E\u304A\u7D75\u304B\u304D\u4E0A\u9650\u3092\u8D85\u3048\u3066\u3044\u307E\u3059\uFF08${_(p)} / ${_(128e3)}\uFF09\u3002
\u63CF\u753B\u3092\u7C21\u7565\u5316\u3057\u3066\u304B\u3089\u3001\u3082\u3046\u4E00\u5EA6\u300C\u6295\u7A3F\u300D\u3092\u62BC\u3057\u3066\u304F\u3060\u3055\u3044\u3002`);return}Z(e,t,r.dataUrl,p)};window.addEventListener("message",x),c.srcdoc=J(o),n.appendChild(c)})}async function ee(){g("checking-page");let e=document.getElementById(i);if(e){g("existing-overlay-shown"),S(e,!0);return}let t=P();if(!t||!t.querySelector('[name="oekaki_thread1"]'))throw new Error("5ch\u306E\u304A\u7D75\u304B\u304D\u5BFE\u5FDC\u6295\u7A3F\u30D5\u30A9\u30FC\u30E0\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093\u3002\u30B9\u30EC\u30C3\u30C9\u306EWeb\u30DA\u30FC\u30B8\u3067\u5B9F\u884C\u3057\u3066\u304F\u3060\u3055\u3044\u3002");s("post-form-found",k(t.action)),t.addEventListener("submit",()=>{let a=t.querySelector('input[name="oekaki"]');s("post-form-submit",a?.value?"NEO image attached":"NEO image not attached")},{capture:!0});let{overlay:n,mount:o}=Y();g("overlay-created");try{let a=await K();await Q(t,n,o,a)}catch(a){throw s("startup-error",w(a)),n.remove(),a}}s("script-start");ee().catch(e=>{document.getElementById(R)?.remove();let t=e instanceof Error?e.message:String(e);g("failed",w(e)),alert(`5chneo: ${t}`),L(t)});})();
