import { build } from "esbuild";
import { mkdir, readFile, writeFile } from "node:fs/promises";

const outputDirectory = "dist";
const publishedScript =
  "https://cdn.jsdelivr.net/gh/sakots/5chneo@main/dist/5chneo.js";

await mkdir(outputDirectory, { recursive: true });

await build({
  entryPoints: ["src/index.ts"],
  outfile: `${outputDirectory}/5chneo.js`,
  bundle: true,
  format: "iife",
  minify: true,
  target: ["chrome109", "firefox115", "safari16"],
  legalComments: "none",
});

const bundle = (await readFile(`${outputDirectory}/5chneo.js`, "utf8")).trim();
const bookmarklet = `javascript:${encodeURIComponent(bundle)}`;
const loader = `javascript:(()=>{const o=document.getElementById('fivech-neo-overlay');if(o){o.style.display='flex';return}if(document.getElementById('fivech-neo-loader'))return;const s=document.createElement('script');s.id='fivech-neo-loader';s.src='${publishedScript}?v=4';s.onerror=()=>{s.remove();alert('5chneoの読み込みに失敗しました。')};document.head.appendChild(s)})()`;

await writeFile(`${outputDirectory}/bookmarklet.txt`, `${bookmarklet}\n`);
await writeFile(`${outputDirectory}/bookmarklet-loader.txt`, `${loader}\n`);
