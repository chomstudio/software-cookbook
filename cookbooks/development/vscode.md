# Visual Studio Code 逆引きマニュアル

最終更新日: 2026-10-11

---

- [Markdown編集](#markdown編集)
  - [Markdown All in Oneの自動目次を特定の見出しレベルだけにするには](#markdown-all-in-oneの自動目次を特定の見出しレベルだけにするには)

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
