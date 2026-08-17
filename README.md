# 5chneo

## 何

5chでお絵かき機能にPaintbbs Neoを使うブックマークレットです。
codex使用。

## 使い方

1. [`dist/bookmarklet-loader.txt`](dist/bookmarklet-loader.txt) の1行をブックマークのURL欄へ登録します。
2. 5chのスレッドをWebブラウザで開き、登録したブックマークを実行します。
3. PaintBBS NEOで描き、ツール内の「投稿」を押します。
4. 画像が5chの投稿フォームへ添付されたことを確認して、通常どおりレスを投稿します。

5ch標準のお絵かき機能と同じく、画像は500×250px、上限は128KB相当です。
PaintBBS NEOの「窓」を押すとiframeもブラウザ表示領域いっぱいに広がり、ページ表示へ戻すと元のサイズへ復帰します。
PaintBBS NEO下部のカラーピッカーで色を選ぶと、現在選択中のパレットと描画色へ取り込まれます。
PaintBBS NEO本体は起動時に公式GitHubリポジトリの最新コミットを確認し、そのコミットの `dist/neo.js` と `dist/neo.css` を読み込みます。GitHub APIへ接続できない場合は `https://oekakibbs.moe/apps/neo/` へフォールバックします。

`bookmarklet-loader.txt` は実行時にGitHub上の最新コミットを確認するため、5chneoの更新後もブックマークのURLを変更する必要はありません。更新した `dist/5chneo.js` をリポジトリへpushしてから実行してください。

[`dist/bookmarklet.txt`](dist/bookmarklet.txt) はネットワークから5chneo本体を取得しない自己完結型です。登録時点のコードが埋め込まれるため、更新を取り込むには再登録が必要です。

5chでクッキーの確認が出た場合投稿に失敗しますが、慌てずに元のスレッドに戻って5chneoを読み込んでください。復元できるはずです。

## 開発

```console
pnpm install
pnpm check
pnpm build
```

TypeScriptのソースは [`src/index.ts`](src/index.ts) です。ビルドすると、配信用スクリプトとブックマークレットが `dist/` に生成されます。
画面に表示するバージョン番号は `package.json` の `version` です。値を変更して `pnpm build` すると、タイトルの末尾へ `vX.Y.Z` の形式で埋め込まれます。

## 更新履歴

### [2026/08/07] v0.3.0

- neoを直接Githubから読み込む形に変更ｓ

### [2026/08/07] v0.2.0

- バージョン番号つけた
- カラーピッカー追加

### [2026/08/17]

- リポジトリ生やした
