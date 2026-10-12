# Visual Studio Code 逆引きマニュアル

最終更新日: 2026-10-12

---

- [Markdown編集](#markdown編集)
  - [Markdown All in Oneの自動目次を特定の見出しレベルだけにするには](#markdown-all-in-oneの自動目次を特定の見出しレベルだけにするには)
- [HTMLの動作確認](#htmlの動作確認)
  - [ローカルサーバーでHTMLを手早く確認するには](#ローカルサーバーでhtmlを手早く確認するには)

---

## Markdown編集

### Markdown All in Oneの自動目次を特定の見出しレベルだけにするには

`Ctrl + ,` で設定を開き、`markdown.extension.toc.levels` を検索して `2..2` にする。これで目次の対象が `##` の見出しだけになる。

`settings.json` で指定する場合は、次の設定を追加する。

```json
{
  "markdown.extension.toc.levels": "2..2"
}
```

- `2..3`: `##` と `###` を対象にする。
- `1..6`: すべての見出しレベルを対象にする（既定値）。
- プロジェクト内だけに適用する場合は、ワークスペースの設定に指定する。
- 既存の目次は、コマンドパレットから `Markdown All in One: Update Table of Contents` を実行して更新する。既定では保存時にも自動更新される。

参考: [Markdown All in One公式ドキュメント](https://github.com/yzhang-gh/vscode-markdown#table-of-contents)

## HTMLの動作確認

### ローカルサーバーでHTMLを手早く確認するには

拡張機能 `Live Server`（作者: Ritwick Dey、拡張機能ID: `ritwickdey.LiveServer`）を使う。

1. `Ctrl + Shift + X` で拡張機能を開き、`Live Server` を検索してインストールする。
2. `ファイル`＞`フォルダーを開く` で、HTMLが入っているフォルダーを開く。
3. エクスプローラーで対象のHTMLを右クリックし、`Open with Live Server` を選ぶ。

ブラウザーが開き、ローカルサーバー経由で表示される。HTMLやCSSなどを編集して保存すると、ブラウザーも自動更新される。

- ステータスバーの `Go Live` からも起動できる。
- 停止するには、コマンドパレットで `Live Server: Stop Live Server` を実行する。
- 静的なHTML・CSS・JavaScriptの確認向け。PHPなどのサーバー側処理には別途実行環境が必要。

参考: [Live Server公式配布ページ](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)

Microsoft製の `Live Preview`（拡張機能ID: `ms-vscode.live-server`）でもローカルサーバーを起動できる。VS Code内で編集と確認を並べたい場合はこちらも便利。

| 比較 | Live Server | Live Preview |
| --- | --- | --- |
| 提供元 | Ritwick Dey | Microsoft |
| 表示先 | 外部ブラウザーが基本 | VS Code内、外部ブラウザーの両方 |
| 自動更新 | ファイル保存時 | 既定では編集中。保存時のみ、または無効にも設定可能 |
| 起動操作 | HTMLを右クリックして `Open with Live Server` | HTMLを開き、エディター右上のプレビューボタン |

`Live Preview` はHTMLを含むフォルダーを開いてから使うと、相対パスを正しく扱いやすい。停止はコマンドパレットの `Live Preview: Stop Server`。自動更新のタイミングは `livePreview.autoRefreshPreview` で変更する。

参考: [Live Preview公式配布ページ](https://marketplace.visualstudio.com/items?itemName=ms-vscode.live-server)
