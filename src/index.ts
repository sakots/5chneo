declare const __FIVECH_NEO_VERSION__: string;

const APP_ID = "fivech-neo-overlay";
const DEBUG_DIALOG_ID = "fivech-neo-debug-dialog";
const STATUS_ID = "fivech-neo-status";
const LOADER_ID = "fivech-neo-loader";
const APP_VERSION = __FIVECH_NEO_VERSION__;
const MAX_OEKAKI_SIZE = 128_000;
const IMAGE_WIDTH = 500;
const IMAGE_HEIGHT = 250;
const NEO_MESSAGE_CHANNEL = "5chneo";
const TOOL_SIDE_STORAGE_KEY = "5chneo:tool-side";
const DEBUG_STORAGE_TEST_KEY = "5chneo:debug-storage-test";
const MAX_DIAGNOSTIC_EVENTS = 200;

const DEFAULT_NEO_BASE = "https://oekakibbs.moe/apps/neo/";
const NEO_REPOSITORY = "funige/neo";
const NEO_BRANCH = "master";
const NEO_LATEST_COMMIT_API =
  `https://api.github.com/repos/${NEO_REPOSITORY}/commits/${NEO_BRANCH}`;
const NEO_CDN_BASE = `https://cdn.jsdelivr.net/gh/${NEO_REPOSITORY}`;

interface NeoFrameMessage {
  channel: typeof NEO_MESSAGE_CHANNEL;
  type: "ready" | "error" | "image" | "fullscreen" | "debug";
  message?: string;
  dataUrl?: string;
  width?: number;
  height?: number;
  fullscreen?: boolean;
  event?: string;
  detail?: string;
  neoVersion?: string;
  toolSide?: "left" | "right";
}

interface DiagnosticEvent {
  elapsedMs: number;
  event: string;
  detail?: string;
}

const diagnosticStartedAt = Date.now();
const diagnosticEvents: DiagnosticEvent[] = [];
let diagnosticStage = "script-loaded";
let diagnosticNeoBase: string | null = null;

function formatError(error: unknown): string {
  if (error instanceof Error) return `${error.name}: ${error.message}`;
  return String(error);
}

function recordDiagnostic(event: string, detail?: string): void {
  if (diagnosticEvents.length >= MAX_DIAGNOSTIC_EVENTS) diagnosticEvents.shift();
  diagnosticEvents.push({
    elapsedMs: Date.now() - diagnosticStartedAt,
    event,
    ...(detail ? { detail } : {}),
  });
}

function setDiagnosticStage(stage: string, detail?: string): void {
  diagnosticStage = stage;
  recordDiagnostic(stage, detail);
}

function isNeoFrameMessage(value: unknown): value is NeoFrameMessage {
  if (!value || typeof value !== "object") return false;
  const message = value as Partial<NeoFrameMessage>;
  return message.channel === NEO_MESSAGE_CHANNEL && typeof message.type === "string";
}

async function resolveLatestNeoBase(): Promise<string> {
  setDiagnosticStage("resolving-neo-source");
  try {
    const response = await fetch(NEO_LATEST_COMMIT_API, {
      cache: "no-store",
      credentials: "omit",
      headers: { Accept: "application/vnd.github+json" },
      referrerPolicy: "no-referrer",
    });
    if (!response.ok) throw new Error(`GitHub API: ${response.status}`);

    const result = (await response.json()) as { sha?: unknown };
    if (typeof result.sha !== "string" || !/^[0-9a-f]{40}$/.test(result.sha)) {
      throw new Error("GitHub APIからコミットSHAを取得できませんでした。");
    }

    diagnosticNeoBase = `${NEO_CDN_BASE}@${result.sha}/dist/`;
    recordDiagnostic("neo-source-resolved", result.sha);
    return diagnosticNeoBase;
  } catch (error) {
    console.warn("5chneo: PaintBBS NEOの最新版を取得できないため既定の配信URLを使います。", error);
    diagnosticNeoBase = DEFAULT_NEO_BASE;
    recordDiagnostic("neo-source-fallback", formatError(error));
    return diagnosticNeoBase;
  }
}

function findPostForm(): HTMLFormElement | null {
  const forms = document.querySelectorAll<HTMLFormElement>("form");

  return (
    Array.from(forms).find(
      (form) =>
        form.method.toLowerCase() === "post" &&
        form.querySelector('[name="MESSAGE"]') &&
        form.querySelector('[name="bbs"]') &&
        form.querySelector('[name="key"]'),
    ) ?? null
  );
}

function safeUrl(value: string): string {
  try {
    const url = new URL(value, location.href);
    return `${url.origin}${url.pathname}`;
  } catch {
    return "(invalid URL)";
  }
}

function testWebStorage(kind: "localStorage" | "sessionStorage"): string {
  let storage: Storage | undefined;
  try {
    storage = kind === "localStorage" ? window.localStorage : window.sessionStorage;
    storage.setItem(DEBUG_STORAGE_TEST_KEY, "ok");
    return storage.getItem(DEBUG_STORAGE_TEST_KEY) === "ok" ? "available" : "read-back failed";
  } catch (error) {
    return `unavailable (${formatError(error)})`;
  } finally {
    try {
      storage?.removeItem(DEBUG_STORAGE_TEST_KEY);
    } catch {}
  }
}

function buildDebugReport(): string {
  const form = findPostForm();
  const oekakiInput = form?.querySelector<HTMLInputElement>('input[name="oekaki"]');
  const oekakiValue = oekakiInput?.value ?? "";
  const frame = document.querySelector<HTMLIFrameElement>(`#${APP_ID} .fivech-neo-frame`);
  const frameWindow = frame?.contentWindow as
    | (Window & {
        Neo?: { version?: unknown; toolSide?: unknown; painter?: unknown };
      })
    | null
    | undefined;
  const neo = frameWindow?.Neo;
  const visualViewport = window.visualViewport;
  const eventLines = diagnosticEvents.length
    ? diagnosticEvents.map(({ elapsedMs, event, detail }) =>
        `+${elapsedMs}ms ${event}${detail ? ` | ${detail.replace(/\s+/g, " ")}` : ""}`,
      )
    : ["(none)"];

  return [
    "5chneo debug report",
    `generatedAt: ${new Date().toISOString()}`,
    `appVersion: ${APP_VERSION}`,
    `stage: ${diagnosticStage}`,
    `elapsedMs: ${Date.now() - diagnosticStartedAt}`,
    "",
    "[page]",
    `url: ${safeUrl(location.href)}`,
    `documentReadyState: ${document.readyState}`,
    `visibilityState: ${document.visibilityState}`,
    `secureContext: ${window.isSecureContext}`,
    `online: ${navigator.onLine}`,
    "",
    "[browser]",
    `userAgent: ${navigator.userAgent}`,
    `platform: ${navigator.platform || "(empty)"}`,
    `languages: ${navigator.languages.join(", ") || "(empty)"}`,
    `timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone || "(unknown)"}`,
    `cookieEnabled: ${navigator.cookieEnabled}`,
    `maxTouchPoints: ${navigator.maxTouchPoints}`,
    `screen: ${screen.width}x${screen.height}`,
    `viewport: ${window.innerWidth}x${window.innerHeight}`,
    `visualViewport: ${visualViewport ? `${visualViewport.width}x${visualViewport.height} scale=${visualViewport.scale}` : "unavailable"}`,
    `devicePixelRatio: ${window.devicePixelRatio}`,
    "",
    "[capabilities]",
    `localStorage: ${testWebStorage("localStorage")}`,
    `sessionStorage: ${testWebStorage("sessionStorage")}`,
    `clipboardWrite: ${Boolean(navigator.clipboard?.writeText)}`,
    `legacyCopy: ${document.queryCommandSupported?.("copy") ?? false}`,
    `canvas2d: ${Boolean(document.createElement("canvas").getContext("2d"))}`,
    `iframeSrcdoc: ${"srcdoc" in document.createElement("iframe")}`,
    "",
    "[5ch form]",
    `formFound: ${Boolean(form)}`,
    `formCount: ${document.forms.length}`,
    `formAction: ${form ? safeUrl(form.action) : "(none)"}`,
    `formMethod: ${form?.method.toUpperCase() || "(none)"}`,
    `formEncoding: ${form?.enctype || "(none)"}`,
    `messageField: ${Boolean(form?.querySelector('[name="MESSAGE"]'))}`,
    `bbsField: ${Boolean(form?.querySelector('[name="bbs"]'))}`,
    `keyField: ${Boolean(form?.querySelector('[name="key"]'))}`,
    `standardOekakiField: ${Boolean(form?.querySelector('[name="oekaki_thread1"]'))}`,
    `neoOekakiField: ${Boolean(oekakiInput)}`,
    `neoImageDataFormat: ${oekakiValue ? (oekakiValue.startsWith("data:image/png;base64,") ? "png data URL" : "unexpected") : "(none)"}`,
    `neoImageEstimatedBytes: ${oekakiValue ? estimatedFiveChSize(oekakiValue) : 0}`,
    "",
    "[PaintBBS NEO]",
    `sourceBase: ${diagnosticNeoBase ?? "(not resolved)"}`,
    `iframeFound: ${Boolean(frame)}`,
    `iframeReadyState: ${frame?.contentDocument?.readyState ?? "(unavailable)"}`,
    `neoGlobal: ${Boolean(neo)}`,
    `neoVersion: ${typeof neo?.version === "string" ? neo.version : "(unknown)"}`,
    `neoPainter: ${Boolean(neo?.painter)}`,
    `toolSide: ${neo ? (neo.toolSide ? "left" : "right") : "(unknown)"}`,
    "",
    "[events]",
    ...eventLines,
    "",
  ].join("\n");
}

function showDebugDialog(reason?: string): void {
  document.getElementById(DEBUG_DIALOG_ID)?.remove();

  const dialog = document.createElement("div");
  dialog.id = DEBUG_DIALOG_ID;
  dialog.innerHTML = `
    <style>
      #${DEBUG_DIALOG_ID} {
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
      #${DEBUG_DIALOG_ID} .fivech-neo-debug-panel {
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
      #${DEBUG_DIALOG_ID} h2 { font: 700 16px/1.4 sans-serif; margin: 0 0 6px; }
      #${DEBUG_DIALOG_ID} p { margin: 4px 0 8px; }
      #${DEBUG_DIALOG_ID} textarea {
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
      #${DEBUG_DIALOG_ID} .fivech-neo-debug-actions { display: flex; flex-wrap: wrap; gap: 6px; }
      #${DEBUG_DIALOG_ID} button {
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
      #${DEBUG_DIALOG_ID} .fivech-neo-debug-status { min-height: 1.5em; }
    </style>
    <div class="fivech-neo-debug-panel" role="dialog" aria-modal="true" aria-labelledby="fivech-neo-debug-title">
      <h2 id="fivech-neo-debug-title">5chneo デバッグ情報</h2>
      <p class="fivech-neo-debug-reason"></p>
      <p>投稿本文・Cookieの内容・描画画像は含まれません。内容を確認してから共有してください。</p>
      <textarea readonly spellcheck="false" aria-label="デバッグ情報"></textarea>
      <p class="fivech-neo-debug-status" role="status"></p>
      <div class="fivech-neo-debug-actions">
        <button type="button" data-action="refresh">更新</button>
        <button type="button" data-action="copy">コピー</button>
        <button type="button" data-action="download">ファイル保存</button>
        <button type="button" data-action="close">閉じる</button>
      </div>
    </div>`;

  const textarea = dialog.querySelector<HTMLTextAreaElement>("textarea");
  const status = dialog.querySelector<HTMLElement>(".fivech-neo-debug-status");
  const reasonElement = dialog.querySelector<HTMLElement>(".fivech-neo-debug-reason");
  if (!textarea || !status || !reasonElement) return;

  reasonElement.textContent = reason ? `エラー: ${reason}` : "現在の診断情報です。";
  const refresh = (): void => {
    textarea.value = buildDebugReport();
    status.textContent = "情報を更新しました。";
  };

  dialog.querySelector<HTMLButtonElement>('[data-action="refresh"]')?.addEventListener("click", refresh);
  dialog.querySelector<HTMLButtonElement>('[data-action="copy"]')?.addEventListener("click", async () => {
    textarea.value = buildDebugReport();
    try {
      await navigator.clipboard.writeText(textarea.value);
      status.textContent = "クリップボードへコピーしました。";
    } catch {
      textarea.focus();
      textarea.select();
      try {
        status.textContent = document.execCommand("copy")
          ? "クリップボードへコピーしました。"
          : "自動コピーできませんでした。選択中の内容を手動でコピーしてください。";
      } catch {
        status.textContent = "自動コピーできませんでした。選択中の内容を手動でコピーしてください。";
      }
    }
  });
  dialog.querySelector<HTMLButtonElement>('[data-action="download"]')?.addEventListener("click", () => {
    textarea.value = buildDebugReport();
    const blob = new Blob([textarea.value], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const timestamp = new Date().toISOString().replace(/\D/g, "").slice(0, 14);
    link.href = url;
    link.download = `5chneo-debug-${timestamp}.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
    status.textContent = "デバッグ情報をファイルへ書き出しました。";
  });
  dialog.querySelector<HTMLButtonElement>('[data-action="close"]')?.addEventListener("click", () => dialog.remove());

  textarea.value = buildDebugReport();
  document.body.appendChild(dialog);
}

function estimatedFiveChSize(dataUrl: string): number {
  // 5ch標準oekaki.jsのbase64size()と同じ計算にする。
  const length = Math.max(0, dataUrl.length - 22);
  return ((length + (length % 3 ? 3 - (length % 3) : 0)) / 3) * 4;
}

function formatKilobytes(bytes: number): string {
  return `${Math.ceil(bytes / 1000)}KB`;
}

function setOverlayVisible(overlay: HTMLElement, visible: boolean): void {
  overlay.style.display = visible ? "flex" : "none";
}

function createButton(label: string, onClick: () => void): HTMLButtonElement {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "fivech-neo-button";
  button.textContent = label;
  button.addEventListener("click", onClick);
  return button;
}

function updateAttachmentStatus(
  form: HTMLFormElement,
  overlay: HTMLElement,
  size: number,
): void {
  document.getElementById(STATUS_ID)?.remove();

  const status = document.createElement("span");
  status.id = STATUS_ID;
  status.className = "fivech-neo-attachment";
  status.append(`PaintBBS NEOの画像を添付済み（${formatKilobytes(size)}） `);
  status.append(
    createButton("再編集", () => setOverlayVisible(overlay, true)),
    " ",
    createButton("添付を解除", () => {
      form.querySelector('input[name="oekaki"]')?.remove();
      status.remove();
    }),
  );

  const standardOekakiField = form.querySelector('[name="oekaki_thread1"]');
  (standardOekakiField ?? form).insertAdjacentElement("afterend", status);
}

function attachImage(
  form: HTMLFormElement,
  overlay: HTMLElement,
  dataUrl: string,
  size: number,
): void {
  let input = form.querySelector<HTMLInputElement>('input[name="oekaki"]');
  if (!input) {
    input = document.createElement("input");
    input.type = "hidden";
    input.name = "oekaki";
    form.appendChild(input);
  }

  input.value = dataUrl;
  recordDiagnostic("image-attached", `${size} bytes`);
  updateAttachmentStatus(form, overlay, size);
  setOverlayVisible(overlay, false);
}

function createOverlay(): { overlay: HTMLDivElement; mount: HTMLDivElement } {
  const overlay = document.createElement("div");
  overlay.id = APP_ID;
  overlay.innerHTML = `
    <style>
      #${APP_ID} {
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
      #${APP_ID} .fivech-neo-panel {
        background: #f7f7f7;
        border-radius: 6px;
        box-shadow: 0 8px 32px rgb(0 0 0 / 45%);
        color: #222;
        max-width: max-content;
        min-width: 632px;
        padding: 10px 16px 16px;
      }
      #${APP_ID} .fivech-neo-header {
        align-items: center;
        display: flex;
        font: 14px/1.4 sans-serif;
        justify-content: space-between;
        margin-bottom: 8px;
      }
      #${APP_ID} .fivech-neo-title { font-weight: 700; }
      #${APP_ID} .fivech-neo-header-actions { display: flex; gap: 6px; }
      #${APP_ID} .fivech-neo-debug,
      #${APP_ID} .fivech-neo-close,
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
      #${APP_ID} .fivech-neo-help {
        font: 12px/1.5 sans-serif;
        margin: 8px 0 0;
      }
      #${APP_ID} .fivech-neo-frame {
        border: 0;
        display: block;
        height: 470px;
        width: 620px;
      }
      #${APP_ID} .fivech-neo-mount { min-height: 470px; }
      .fivech-neo-attachment {
        display: inline-block;
        font: 13px/1.5 sans-serif;
        margin: 6px 0;
      }
      #${APP_ID}.fivech-neo-fullscreen { padding: 0; }
      #${APP_ID}.fivech-neo-fullscreen .fivech-neo-panel {
        border-radius: 0;
        height: 100vh;
        max-width: none;
        min-width: 0;
        padding: 0;
        width: 100vw;
      }
      #${APP_ID}.fivech-neo-fullscreen .fivech-neo-header,
      #${APP_ID}.fivech-neo-fullscreen .fivech-neo-help { display: none; }
      #${APP_ID}.fivech-neo-fullscreen .fivech-neo-frame {
        height: 100vh;
        width: 100vw;
      }
      @media (max-width: 680px) {
        #${APP_ID} { justify-content: flex-start; padding: 8px; }
        #${APP_ID}.fivech-neo-fullscreen { padding: 0; }
      }
    </style>
    <div class="fivech-neo-panel" role="dialog" aria-modal="true" aria-label="PaintBBS NEO">
      <div class="fivech-neo-header">
        <span class="fivech-neo-title">PaintBBS NEO — 5chお絵かき v${APP_VERSION}</span>
        <div class="fivech-neo-header-actions">
          <button type="button" class="fivech-neo-debug">デバッグ情報</button>
          <button type="button" class="fivech-neo-close">閉じる</button>
        </div>
      </div>
      <div class="fivech-neo-mount"></div>
      <p class="fivech-neo-help">描き終えたらPaintBBS NEO内の「投稿」ボタンを押してください。画像を5chの投稿フォームへ添付します。</p>
    </div>`;

  overlay
    .querySelector<HTMLButtonElement>(".fivech-neo-close")
    ?.addEventListener("click", () => setOverlayVisible(overlay, false));
  overlay
    .querySelector<HTMLButtonElement>(".fivech-neo-debug")
    ?.addEventListener("click", () => showDebugDialog());

  const mount = overlay.querySelector<HTMLDivElement>(".fivech-neo-mount");
  if (!mount) throw new Error("PaintBBS NEOの表示領域を作成できませんでした。");

  document.body.appendChild(overlay);
  return { overlay, mount };
}

function createFrameDocument(neoBase: string): string {
  const params = JSON.stringify({
    paintbbs: {
      image_width: String(IMAGE_WIDTH),
      image_height: String(IMAGE_HEIGHT),
      color_bk: "#ffffff",
      color_bk2: "#ffffff",
      neo_confirm_unload: true,
      neo_disable_grid_touch_move: true,
      neo_disable_turn_original_glitch: true,
      neo_enable_zoom_out: true,
      neo_visibility_change_title_rewrite: true,
    },
  });

  return `<!doctype html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="${neoBase}neo.css">
  <style>
    html,body{margin:0;padding:0;background:#f7f7f7;overflow:auto}
    #fivech-neo-color-picker{align-items:center;display:inline-flex;gap:4px;margin-left:8px}
    #fivech-neo-color-picker input[type="color"]{appearance:auto;background:transparent;border:0;cursor:pointer;height:22px;padding:0;width:30px}
    #fivech-neo-tool-side{appearance:auto;background:#eee;border:1px solid #888;border-radius:3px;color:#111;cursor:pointer;font:12px/1.4 sans-serif;margin-left:8px;padding:1px 6px;vertical-align:middle}
  </style>
</head>
<body>
  <div class="neo-applet-paintbbs" data-width="600" data-height="430"></div>
  <script data-cfasync="false" src="${neoBase}neo.js"><\/script>
  <script>
    (() => {
      const send = (type, payload = {}) => {
        parent.postMessage({ channel: "${NEO_MESSAGE_CHANNEL}", type, ...payload }, "*");
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
        send("error", { message: "NEO本体を読み込めませんでした。" });
        return;
      }

      Neo.params = ${params};
      document.paintBBSCallback = (event) => {
        if (event !== "check") return;
        const canvas = Neo.painter && Neo.painter.getImage();
        if (!canvas) {
          send("error", { message: "PaintBBS NEOから画像を取得できませんでした。" });
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
        label.append("パレット");

        const input = document.createElement("input");
        input.type = "color";
        input.title = "選択中のパレットへ色を取り込む";
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

        const setToolSide = (useLeftSide) => {
          Neo.setToolSide(useLeftSide);
          const headerButtons = document.getElementById("neo-headerButtons");
          if (headerButtons) headerButtons.style.left = useLeftSide ? "60px" : "5px";
          const footerButtons = document.getElementById("neo-footerButtons");
          if (footerButtons) footerButtons.style.left = useLeftSide ? "60px" : "5px";
        };

        const updateButton = () => {
          const destination = Neo.toolSide ? "右" : "左";
          button.textContent = "ツールを" + destination + "へ";
          button.title = "ツールバーをキャンバスの" + destination + "側へ移動する";
          button.setAttribute("aria-label", button.title);
        };

        let initialToolSide = Boolean(Neo.toolSide);
        try {
          const storedSide = localStorage.getItem("${TOOL_SIDE_STORAGE_KEY}");
          if (storedSide === "left" || storedSide === "right") {
            initialToolSide = storedSide === "left";
          }
        } catch (error) {
          send("debug", { event: "tool-side-storage-read-failed", detail: describeError(error) });
        }
        setToolSide(initialToolSide);

        button.addEventListener("click", () => {
          const useLeftSide = !Neo.toolSide;
          setToolSide(useLeftSide);
          try {
            localStorage.setItem("${TOOL_SIDE_STORAGE_KEY}", useLeftSide ? "left" : "right");
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
            send("error", { message: "PaintBBS NEOの描画領域を初期化できませんでした。" });
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
</html>`;
}

function startNeoFrame(
  form: HTMLFormElement,
  overlay: HTMLElement,
  mount: HTMLElement,
  neoBase: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    setDiagnosticStage("starting-neo-frame", neoBase);
    const frame = document.createElement("iframe");
    frame.className = "fivech-neo-frame";
    frame.title = "PaintBBS NEO";

    let ready = false;
    let fullscreenObserver: MutationObserver | null = null;

    const observeFullscreenState = (): void => {
      const frameDocument = frame.contentDocument;
      const frameWindow = frame.contentWindow;
      const windowView = frameDocument?.getElementById("neo-windowView");
      if (!frameWindow || !windowView) return;

      const sync = (): void => {
        const fullscreen = frameWindow.getComputedStyle(windowView).display !== "none";
        overlay.classList.toggle("fivech-neo-fullscreen", fullscreen);
      };

      fullscreenObserver?.disconnect();
      fullscreenObserver = new MutationObserver(sync);
      fullscreenObserver.observe(windowView, {
        attributes: true,
        attributeFilter: ["class", "style"],
      });
      sync();
    };

    const timeout = window.setTimeout(() => {
      if (ready) return;
      window.removeEventListener("message", onMessage);
      recordDiagnostic("neo-frame-timeout");
      reject(new Error("PaintBBS NEOの起動がタイムアウトしました。"));
    }, 20_000);

    const fail = (message: string): void => {
      recordDiagnostic("neo-frame-error", message);
      if (ready) {
        alert(`5chneo: ${message}`);
        showDebugDialog(message);
        return;
      }
      window.clearTimeout(timeout);
      window.removeEventListener("message", onMessage);
      reject(new Error(message));
    };

    const onMessage = (event: MessageEvent<unknown>): void => {
      if (event.source !== frame.contentWindow || !isNeoFrameMessage(event.data)) return;
      const message = event.data;

      if (message.type === "debug") {
        recordDiagnostic(message.event ?? "neo-frame-debug", message.detail);
        return;
      }
      if (message.type === "error") {
        fail(message.message ?? "PaintBBS NEOでエラーが発生しました。");
        return;
      }
      if (message.type === "ready") {
        ready = true;
        window.clearTimeout(timeout);
        observeFullscreenState();
        setDiagnosticStage(
          "ready",
          `NEO ${message.neoVersion ?? "unknown"}, tools ${message.toolSide ?? "unknown"}`,
        );
        resolve();
        return;
      }
      if (message.type === "fullscreen") {
        recordDiagnostic("fullscreen-change", String(message.fullscreen === true));
        overlay.classList.toggle("fivech-neo-fullscreen", message.fullscreen === true);
        return;
      }
      if (message.type !== "image" || !message.dataUrl) return;

      const size = estimatedFiveChSize(message.dataUrl);
      recordDiagnostic(
        "image-received",
        `${message.width ?? "unknown"}x${message.height ?? "unknown"}, ${size} bytes`,
      );
      if (message.width !== IMAGE_WIDTH || message.height !== IMAGE_HEIGHT) {
        recordDiagnostic("image-rejected", "unexpected dimensions");
        alert(`画像サイズが${IMAGE_WIDTH}×${IMAGE_HEIGHT}pxではないため添付できません。`);
        return;
      }
      if (size > MAX_OEKAKI_SIZE) {
        recordDiagnostic("image-rejected", "size limit exceeded");
        alert(
          `画像が5chのお絵かき上限を超えています（${formatKilobytes(size)} / ${formatKilobytes(MAX_OEKAKI_SIZE)}）。\n描画を簡略化してから、もう一度「投稿」を押してください。`,
        );
        return;
      }
      attachImage(form, overlay, message.dataUrl, size);
    };

    window.addEventListener("message", onMessage);
    frame.srcdoc = createFrameDocument(neoBase);
    mount.appendChild(frame);
  });
}

async function start(): Promise<void> {
  setDiagnosticStage("checking-page");
  const existingOverlay = document.getElementById(APP_ID);
  if (existingOverlay) {
    setDiagnosticStage("existing-overlay-shown");
    setOverlayVisible(existingOverlay, true);
    return;
  }

  const form = findPostForm();
  if (!form || !form.querySelector('[name="oekaki_thread1"]')) {
    throw new Error("5chのお絵かき対応投稿フォームが見つかりません。スレッドのWebページで実行してください。");
  }
  recordDiagnostic("post-form-found", safeUrl(form.action));
  form.addEventListener(
    "submit",
    () => {
      const input = form.querySelector<HTMLInputElement>('input[name="oekaki"]');
      recordDiagnostic("post-form-submit", input?.value ? "NEO image attached" : "NEO image not attached");
    },
    { capture: true },
  );

  const { overlay, mount } = createOverlay();
  setDiagnosticStage("overlay-created");

  try {
    const neoBase = await resolveLatestNeoBase();
    await startNeoFrame(form, overlay, mount, neoBase);
  } catch (error) {
    recordDiagnostic("startup-error", formatError(error));
    overlay.remove();
    throw error;
  }
}

recordDiagnostic("script-start");
void start().catch((error: unknown) => {
  document.getElementById(LOADER_ID)?.remove();
  const message = error instanceof Error ? error.message : String(error);
  setDiagnosticStage("failed", formatError(error));
  alert(`5chneo: ${message}`);
  showDebugDialog(message);
});

export {};
