# 5chneo

## 何

5chでお絵かき機能にPaintbbs Neoを使うブックマークレットです。
codex使用。

## 使い方

1. [`dist/bookmarklet.txt`](dist/bookmarklet.txt) の1行をブックマークのURL欄へ登録します。
2. 5chのスレッドをWebブラウザで開き、登録したブックマークを実行します。
3. PaintBBS NEOで描き、ツール内の「投稿」を押します。
4. 画像が5chの投稿フォームへ添付されたことを確認して、通常どおりレスを投稿します。

5ch標準のお絵かき機能と同じく、画像は500×250px、上限は128KB相当です。

`bookmarklet.txt` はそのまま使える自己完結型です。リポジトリをGitHubへpushした後は、短い [`dist/bookmarklet-loader.txt`](dist/bookmarklet-loader.txt) も使えます。

## 開発

```console
npm install
npm run check
npm run build
```

TypeScriptのソースは [`src/index.ts`](src/index.ts) です。ビルドすると、配信用スクリプトとブックマークレットが `dist/` に生成されます。

## 更新履歴

### [2026/08/17]

- リポジトリ生やした
