const APP_ID = "fivech-neo-overlay";
const STATUS_ID = "fivech-neo-status";
const LOADER_ID = "fivech-neo-loader";
const MAX_OEKAKI_SIZE = 128_000;
const IMAGE_WIDTH = 500;
const IMAGE_HEIGHT = 250;
const NEO_MESSAGE_CHANNEL = "5chneo";

const DEFAULT_NEO_BASE = "https://oekakibbs.moe/apps/neo/";

interface NeoFrameMessage {
  channel: typeof NEO_MESSAGE_CHANNEL;
  type: "ready" | "error" | "image";
  message?: string;
  dataUrl?: string;
  width?: number;
  height?: number;
}

function isNeoFrameMessage(value: unknown): value is NeoFrameMessage {
  if (!value || typeof value !== "object") return false;
  const message = value as Partial<NeoFrameMessage>;
  return message.channel === NEO_MESSAGE_CHANNEL && typeof message.type === "string";
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
        height: 460px;
        width: 620px;
      }
      #${APP_ID} .fivech-neo-mount { min-height: 460px; }
      .fivech-neo-attachment {
        display: inline-block;
        font: 13px/1.5 sans-serif;
        margin: 6px 0;
      }
      @media (max-width: 680px) {
        #${APP_ID} { justify-content: flex-start; padding: 8px; }
      }
    </style>
    <div class="fivech-neo-panel" role="dialog" aria-modal="true" aria-label="PaintBBS NEO">
      <div class="fivech-neo-header">
        <span class="fivech-neo-title">PaintBBS NEO — 5chお絵かき</span>
        <button type="button" class="fivech-neo-close">閉じる</button>
      </div>
      <div class="fivech-neo-mount"></div>
      <p class="fivech-neo-help">描き終えたらPaintBBS NEO内の「投稿」ボタンを押してください。画像を5chの投稿フォームへ添付します。</p>
    </div>`;

  overlay
    .querySelector<HTMLButtonElement>(".fivech-neo-close")
    ?.addEventListener("click", () => setOverlayVisible(overlay, false));

  const mount = overlay.querySelector<HTMLDivElement>(".fivech-neo-mount");
  if (!mount) throw new Error("PaintBBS NEOの表示領域を作成できませんでした。");

  document.body.appendChild(overlay);
  return { overlay, mount };
}

function createFrameDocument(): string {
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
  <link rel="stylesheet" href="${DEFAULT_NEO_BASE}neo.css">
  <style>html,body{margin:0;padding:0;background:#f7f7f7;overflow:auto}</style>
</head>
<body>
  <div class="neo-applet-paintbbs" data-width="600" data-height="430"></div>
  <script data-cfasync="false" src="${DEFAULT_NEO_BASE}neo.js"><\/script>
  <script>
    (() => {
      const send = (type, payload = {}) => {
        parent.postMessage({ channel: "${NEO_MESSAGE_CHANNEL}", type, ...payload }, "*");
      };

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

      document.addEventListener("DOMContentLoaded", () => {
        setTimeout(() => {
          if (!Neo.painter) {
            send("error", { message: "PaintBBS NEOの描画領域を初期化できませんでした。" });
            return;
          }
          Neo.setStabilizeLevel(1);
          send("ready");
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
): Promise<void> {
  return new Promise((resolve, reject) => {
    const frame = document.createElement("iframe");
    frame.className = "fivech-neo-frame";
    frame.title = "PaintBBS NEO";

    let ready = false;
    const timeout = window.setTimeout(() => {
      if (ready) return;
      window.removeEventListener("message", onMessage);
      reject(new Error("PaintBBS NEOの起動がタイムアウトしました。"));
    }, 20_000);

    const fail = (message: string): void => {
      if (ready) {
        alert(`5chneo: ${message}`);
        return;
      }
      window.clearTimeout(timeout);
      window.removeEventListener("message", onMessage);
      reject(new Error(message));
    };

    const onMessage = (event: MessageEvent<unknown>): void => {
      if (event.source !== frame.contentWindow || !isNeoFrameMessage(event.data)) return;
      const message = event.data;

      if (message.type === "error") {
        fail(message.message ?? "PaintBBS NEOでエラーが発生しました。");
        return;
      }
      if (message.type === "ready") {
        ready = true;
        window.clearTimeout(timeout);
        resolve();
        return;
      }
      if (message.type !== "image" || !message.dataUrl) return;

      const size = estimatedFiveChSize(message.dataUrl);
      if (message.width !== IMAGE_WIDTH || message.height !== IMAGE_HEIGHT) {
        alert(`画像サイズが${IMAGE_WIDTH}×${IMAGE_HEIGHT}pxではないため添付できません。`);
        return;
      }
      if (size > MAX_OEKAKI_SIZE) {
        alert(
          `画像が5chのお絵かき上限を超えています（${formatKilobytes(size)} / ${formatKilobytes(MAX_OEKAKI_SIZE)}）。\n描画を簡略化してから、もう一度「投稿」を押してください。`,
        );
        return;
      }
      attachImage(form, overlay, message.dataUrl, size);
    };

    window.addEventListener("message", onMessage);
    frame.srcdoc = createFrameDocument();
    mount.appendChild(frame);
  });
}

async function start(): Promise<void> {
  const existingOverlay = document.getElementById(APP_ID);
  if (existingOverlay) {
    setOverlayVisible(existingOverlay, true);
    return;
  }

  const form = findPostForm();
  if (!form || !form.querySelector('[name="oekaki_thread1"]')) {
    throw new Error("5chのお絵かき対応投稿フォームが見つかりません。スレッドのWebページで実行してください。");
  }

  const { overlay, mount } = createOverlay();

  try {
    await startNeoFrame(form, overlay, mount);
  } catch (error) {
    overlay.remove();
    throw error;
  }
}

void start().catch((error: unknown) => {
  document.getElementById(LOADER_ID)?.remove();
  const message = error instanceof Error ? error.message : String(error);
  alert(`5chneo: ${message}`);
});

export {};
