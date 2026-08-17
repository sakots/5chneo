const APP_ID = "fivech-neo-overlay";
const STATUS_ID = "fivech-neo-status";
const LOADER_ID = "fivech-neo-loader";
const MAX_OEKAKI_SIZE = 128_000;
const IMAGE_WIDTH = 500;
const IMAGE_HEIGHT = 250;

const DEFAULT_NEO_BASE = "https://oekakibbs.moe/apps/neo/";

type PaintBBSCallback = (event: string) => boolean | string | undefined;

interface NeoPainter {
  getImage(): HTMLCanvasElement | null;
}

interface NeoApi {
  init(): boolean;
  start(): void;
  setStabilizeLevel(level: number): void;
  params: Record<string, Record<string, string | boolean>>;
  painter: NeoPainter;
}

interface NeoDocument extends Document {
  paintBBSCallback?: PaintBBSCallback;
}

declare global {
  interface Window {
    Neo?: NeoApi;
  }
}

function getNeo(): NeoApi | undefined {
  // 外部スクリプトの読み込み前後で値が変わるため、関数越しに参照する。
  return window.Neo;
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
      #${APP_ID} .fivech-neo-mount { min-height: 430px; }
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

function loadStyle(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLLinkElement>(`link[href="${url}"]`);
    if (existing) {
      resolve();
      return;
    }

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = url;
    link.addEventListener("load", () => resolve(), { once: true });
    link.addEventListener("error", () => reject(new Error("NEOのCSSを読み込めませんでした。")), {
      once: true,
    });
    document.head.appendChild(link);
  });
}

function loadScript(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = url;
    script.addEventListener("load", () => resolve(), { once: true });
    script.addEventListener("error", () => reject(new Error("NEO本体を読み込めませんでした。")), {
      once: true,
    });
    document.head.appendChild(script);
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

  if (getNeo()) {
    throw new Error("このページでは別のPaintBBS NEOがすでに起動しています。ページを再読み込みしてから実行してください。");
  }

  const { overlay, mount } = createOverlay();
  const applet = document.createElement("div");
  applet.className = "neo-applet-paintbbs";
  applet.dataset.width = "600";
  applet.dataset.height = "430";
  mount.appendChild(applet);

  try {
    await Promise.all([
      loadStyle(`${DEFAULT_NEO_BASE}neo.css`),
      loadScript(`${DEFAULT_NEO_BASE}neo.js`),
    ]);

    const neo = getNeo();
    if (!neo) throw new Error("PaintBBS NEOを初期化できませんでした。");

    neo.params = {
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
    };

    const neoDocument = document as NeoDocument;
    neoDocument.paintBBSCallback = (event) => {
      if (event !== "check") return undefined;

      const canvas = neo.painter.getImage();
      if (!canvas) {
        alert("PaintBBS NEOから画像を取得できませんでした。");
        return false;
      }
      const dataUrl = canvas.toDataURL("image/png");
      const size = estimatedFiveChSize(dataUrl);

      if (canvas.width !== IMAGE_WIDTH || canvas.height !== IMAGE_HEIGHT) {
        alert(`画像サイズが${IMAGE_WIDTH}×${IMAGE_HEIGHT}pxではないため添付できません。`);
        return false;
      }
      if (size > MAX_OEKAKI_SIZE) {
        alert(
          `画像が5chのお絵かき上限を超えています（${formatKilobytes(size)} / ${formatKilobytes(MAX_OEKAKI_SIZE)}）。\n描画を簡略化してから、もう一度「投稿」を押してください。`,
        );
        return false;
      }

      attachImage(form, overlay, dataUrl, size);
      return false;
    };

    if (!neo.init()) throw new Error("PaintBBS NEOの描画領域を初期化できませんでした。");
    neo.start();
    neo.setStabilizeLevel(1);
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
