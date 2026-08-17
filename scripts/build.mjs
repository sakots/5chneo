import { build } from "esbuild";
import { mkdir, readFile, writeFile } from "node:fs/promises";

const outputDirectory = "dist";
const repository = "sakots/5chneo";
const latestCommitApi = `https://api.github.com/repos/${repository}/commits/main`;
const publishedScriptBase = `https://cdn.jsdelivr.net/gh/${repository}`;
const packageJson = JSON.parse(await readFile("package.json", "utf8"));

await mkdir(outputDirectory, { recursive: true });

await build({
  entryPoints: ["src/index.ts"],
  outfile: `${outputDirectory}/5chneo.js`,
  bundle: true,
  format: "iife",
  minify: true,
  target: ["chrome109", "firefox115", "safari16"],
  legalComments: "none",
  define: {
    __FIVECH_NEO_VERSION__: JSON.stringify(packageJson.version),
  },
});

const bundle = (await readFile(`${outputDirectory}/5chneo.js`, "utf8")).trim();
const bookmarklet = `javascript:${encodeURIComponent(bundle)}`;
const loader = `javascript:(async()=>{const o=document.getElementById('fivech-neo-overlay');if(o){o.style.display='flex';return}if(document.getElementById('fivech-neo-loader'))return;let v='main';try{const r=await fetch('${latestCommitApi}',{cache:'no-store',headers:{Accept:'application/vnd.github+json'}});if(r.ok){const j=await r.json();if(/^[0-9a-f]{40}$/.test(j.sha))v=j.sha}}catch{}const s=document.createElement('script');s.id='fivech-neo-loader';s.src='${publishedScriptBase}@'+v+'/dist/5chneo.js'+(v==='main'?'?t='+Date.now():'');s.onerror=()=>{s.remove();alert('5chneoの読み込みに失敗しました。')};document.head.appendChild(s)})()`;

await writeFile(`${outputDirectory}/bookmarklet.txt`, `${bookmarklet}\n`);
await writeFile(`${outputDirectory}/bookmarklet-loader.txt`, `${loader}\n`);
