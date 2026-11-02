# Visual Studio Code 逆引きマニュアル

最終更新日: 2026-10-30

---

- [画面表示](#画面表示)
  - [タイトルバーのコマンドセンターを狭くするには](#タイトルバーのコマンドセンターを狭くするには)
  - [全角スペースの強調表示を解除するには](#全角スペースの強調表示を解除するには)
- [編集一般](#編集一般)
  - [入力候補を出さないようにするには](#入力候補を出さないようにするには)
  - [正規表現で検索するとき、 `__` (アンダースコアx2)にヒットさせず `_` (アンダースコア単体)のみを探す場合は](#正規表現で検索するとき-__-アンダースコアx2にヒットさせず-_-アンダースコア単体のみを探す場合は)
- [Markdown編集](#markdown編集)
  - [Markdown All in Oneの自動目次を特定の見出しレベルだけにするには](#markdown-all-in-oneの自動目次を特定の見出しレベルだけにするには)
- [HTMLの動作確認](#htmlの動作確認)
  - [ローカルサーバーでHTMLを手早く確認するには](#ローカルサーバーでhtmlを手早く確認するには)

---

## 画面表示

### タイトルバーのコマンドセンターを狭くするには

タイトルバー中央の検索欄（コマンドセンター）の幅を直接指定する標準設定はない。非表示にする場合は、`Ctrl + ,` で設定を開き、`window.commandCenter` を検索してオフにする。タイトルバーの右クリックメニューからも切り替えられる。

非表示でも `Ctrl + Shift + P` でコマンドパレット、`Ctrl + P` でファイル検索を開ける。

参考: [VS Code公式の幅変更の要望](https://github.com/microsoft/vscode/issues/154967)、[ユーザーインターフェース](https://code.visualstudio.com/docs/editing/getting-started/userinterface)

### 全角スペースの強調表示を解除するには

VS Code標準のUnicode強調表示で囲まれている場合は、`Ctrl + Shift + P` から `Preferences: Open User Settings (JSON)` を開き、次の設定を追加する。全角スペースだけを強調表示の対象から除外できる。

```json
"editor.unicodeHighlight.allowedCharacters": {
  "\u3000": true
}
```

すでに同じ設定がある場合は、その中に `"\u3000": true` を追加する。解除されない場合は、拡張機能による表示も確認する。

参考: [VS Code公式のUnicode強調表示](https://code.visualstudio.com/updates/v1_63#_unicode-highlighting)

## 編集一般

### 入力候補を出さないようにするには

自動表示だけを止めたいのであれば、まずは次の2項目だけで十分です。
この設定でも、Ctrl + Space による 手動での補完候補表示は引き続き利用できます。

```json
{
  "editor.quickSuggestions": false,
  "editor.suggestOnTriggerCharacters": false
}
```

また、GitHub Copilotなどの拡張機能が独自に表示する候補は、別途その拡張機能の設定が必要な場合があります。

### 正規表現で検索するとき、 `__` (アンダースコアx2)にヒットさせず `_` (アンダースコア単体)のみを探す場合は

```regex
(?<!_)_(?!_)
```

- `(?<!_)`：直前の文字が `_` ではない（否定後読み）
- `_`：検索対象のアンダースコア
- `(?!_)`：直後の文字が `_` ではない（否定先読み）

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

| 比較     | Live Server                                  | Live Preview                                       |
| -------- | -------------------------------------------- | -------------------------------------------------- |
| 提供元   | Ritwick Dey                                  | Microsoft                                          |
| 表示先   | 外部ブラウザーが基本                         | VS Code内、外部ブラウザーの両方                    |
| 自動更新 | ファイル保存時                               | 既定では編集中。保存時のみ、または無効にも設定可能 |
| 起動操作 | HTMLを右クリックして `Open with Live Server` | HTMLを開き、エディター右上のプレビューボタン       |

`Live Preview` はHTMLを含むフォルダーを開いてから使うと、相対パスを正しく扱いやすい。停止はコマンドパレットの `Live Preview: Stop Server`。自動更新のタイミングは `livePreview.autoRefreshPreview` で変更する。

参考: [Live Preview公式配布ページ](https://marketplace.visualstudio.com/items?itemName=ms-vscode.live-server)
