# Software Cookbook

ソフトウェアの操作・設定・トラブル解決を蓄積する、個人用の逆引きマニュアルです。GitHub Pages版ではジャンル、アプリ名、項目名、本文を検索し、Markdown文書をブラウザで閲覧できます。

内容は個人の調査記録であり、正確性を保証するものではありません。

## GitHub Pagesで公開する

1. GitHubのリポジトリで `Settings`＞`Pages`＞`Build and deployment`＞`Source` を `GitHub Actions` に設定します。
2. `Actions` が利用可能であることを確認します。組織のポリシーを利用している場合は、ワークフローで使用するGitHub公式Actionsを許可します。
3. 追加ファイルを含めてコミットし、`master` へpushします。
4. `Actions` の `Publish cookbook` が成功したら、`Settings`＞`Pages` またはワークフローの `github-pages` 環境に表示されるURLを開きます。

一般公開のサイトになります。リポジトリの公開状態と契約がGitHub Pagesの利用条件を満たす必要があります。環境の承認ルールが設定されている場合は、そのルールに従って公開を承認します。

公開先ブランチを変更する場合は、[pages.yml](.github/workflows/pages.yml) のpush対象とジョブのブランチ条件、GitHub側の環境ルールを合わせて変更してください。

参考: [GitHub公式: カスタムワークフローでGitHub Pagesを利用する](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)

## 文書を追加・更新する

- 文書は `cookbooks/<ジャンル>/<アプリ名>.md` に置きます。ファイル名・フォルダ名は kebab-case を使用します。
- 最初のレベル1見出しを `# アプリ名 逆引きマニュアル` とします。以降の記述は既存の逆引き文書のルールに従います。
- 新しいジャンルやアプリも同じ配置で追加できます。検索用の登録作業はありません。
- 変更をコミットして `master` へpushすると、Actionsが検索データを作り直して公開します。反映はワークフロー成功後です。
- 文書の削除・移動も次の公開に反映されます。移動・見出し変更後は以前のURLが無効になる場合があります。
- ローカル画像は `cookbooks/` 内に置き、文書から相対パスで参照してください。

通常の更新ではNode.jsの実行やHTML変換は不要です。生成物の `_site/` と依存関係の `node_modules/` はコミットしません。

## 検索・閲覧する

- 検索欄に語を入力し、`検索` または `Enter` で実行します。入力確定後にも自動検索します。
- 空白で語を区切るとAND検索になります。例: `FL Studio ステップ`。
- 英字の大文字小文字、英数字の全角半角を区別しません。日本語は部分一致で検索します。
- ジャンルとアプリで絞り込めます。検索語を空にすると文書一覧になります。
- 結果を選ぶと文書全文が表示され、該当見出しへ移動します。
- 見出しのリンクをコピーすれば、その項目のURLを共有できます。

検索と文書表示にはJavaScriptが必要です。

## ローカルで確認する

Node.js 24 LTSを推奨します。Node.js 22でも実行できます。依存関係はプロジェクト内へインストールします。

```powershell
npm ci
npm test
npm run build
npm run preview
```

表示された `http://127.0.0.1:4173/software-cookbook/` をブラウザで開きます。終了は `Ctrl + C` です。原稿やコードを変更した場合は、`npm run build` を再実行してブラウザを再読み込みしてください。

ポートを変更する場合は、PowerShellで次のように指定します。

```powershell
$env:PORT = "4174"
npm run preview
```

## 公開できない場合

- Actionsログで失敗したステップを確認します。
- `build` が失敗した場合は、ログにある文書名・参照先を確認します。参照画像の欠落や公開対象文書がゼロ件の場合は生成を中止します。
- `deploy` が失敗した場合は、Pagesの公開方式、Actionsの許可、`github-pages` 環境のブランチ制限や承認待ちを確認します。
- 修正をpushするか、`Actions` からワークフローを再実行してください。

## 利用ライブラリ

Markdown表示にMarked、見出しID生成にgithub-slugger、HTMLの安全な表示にDOMPurify、文字参照の解決にentitiesを使用します。生成にesbuild、テストにjsdomを使用します。

公開成果物の `THIRD-PARTY-LICENSES.txt` に、ブラウザへ配信するライブラリのライセンス文書を同梱します。サイトのフッターから閲覧できます。

## 著作権表示

```text
(C) Chom Studio 2026
著作者: ちょむ (Chom P.)
https://x.com/chom
https://chomstudio.com
https://github.com/chomstudio
```

## バージョン履歴

- 2026-10-12: GitHub Pages向けの検索・閲覧ページと、push時に生成・公開するワークフローを追加。
