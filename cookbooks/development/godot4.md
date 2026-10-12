# Godot4 逆引きマニュアル

最終更新日: 2026-10-11

---

- [エクスポート](#エクスポート)
  - [Webエクスポートするには](#webエクスポートするには)
  - [画面サイズを固定するには](#画面サイズを固定するには)
  - [日本語の文字化けを直すには](#日本語の文字化けを直すには)
  - [Releaseでビルドするには](#releaseでビルドするには)
  - [ページタイトルが勝手に変更されるのをやめさせるには](#ページタイトルが勝手に変更されるのをやめさせるには)
  - [独自に用意したファイルがエクスポート時に読み込まれない](#独自に用意したファイルがエクスポート時に読み込まれない)
- [UI](#ui)
  - [UIに画像を配置する](#uiに画像を配置する)
  - [UIの色を変更したい](#uiの色を変更したい)

---

## エクスポート

### Webエクスポートするには

- `プロジェクト＞エクスポート`
- 左のプリセットリストで`追加＞Web`
- `エクスポート先のパス`を指定。拡張子は`.html`。
  - 出力先フォルダをCodexプロジェクト内に収める場合は、ルートの`.gitignore`に出力フォルダ名を記述しておくこと。
- `Canvas Resize Policy`を`Project`にする（後述）。あとは基本的に触らなくてOK。
- `プロジェクトのエクスポート`を押す。
- しばらくして出力先フォルダにいろいろ
- **ゲームを確認するには、VSCodeの Live Preview を使おう。**
  - <https://marketplace.visualstudio.com/items?itemName=ms-vscode.live-server>
  - 上記拡張をインストールしたあと、VScodeのファイルリストからhtmlファイルを右クリックして`Show Preview`を選択して起動。
  - ただローカルのhtmlをブラウザで開くだけではセキュリティ的な制約がかかって起動しないため。

### 画面サイズを固定するには

- エクスポート時の設定で、デフォルトだと`Canvas Resize Policy`は`Adaptive`である。この状態だとブラウザのサイズいっぱいに引き伸ばされ、アスペクト比も不定になってしまう。
- なので`Canvas Resize Policy`は`Project`にしておくと良い。こうしておくと`プロジェクト設定`の内容に従うようになる。
- 以下プロジェクト設定のおすすめ
  - `プロジェクト設定＞表示＞ウィンドウ＞サイズ`で画面サイズを指定
  - `サイズを変更可能`をオフ
  - `ストレッチ＞モード`を`canvas_item`

### 日本語の文字化けを直すには

- 日本語フォントを入れる必要がある。
- たとえば Noto Sans JP <https://fonts.google.com/noto/specimen/Noto+Sans+JP> あたりをダウンロードして、適当な太さのフォントファイル（例えば`NotoSansJP-Medium.ttf`）を`/assets/`に放り込む。
- `プロジェクト設定＞GUI＞テーマ＞カスタムフォント`でフォントを指定。（例: `res://assets/NotoSansJP-Medium.ttf`）
- あとは普通にエクスポートして確認する。

### Releaseでビルドするには

`プロジェクトのエクスポート`ボタンを押した後、出力先フォルダを決めるダイアログに`デバッグ付きエクスポート`のチェックボックスがあるので外す。（プロジェクトの設定や、エクスポートダイアログの中にはない）

### ページタイトルが勝手に変更されるのをやめさせるには

**生成されたページになにかを仕込むより、IFRAMEで公開ページ中に生成ページを埋め込むことを推奨する。**

タイトルの変更を検知して強制的に戻すスクリプトを仕込む。

```html
<script>
  //タイトルを強制する
  const fixedTitle = "固定したいページタイトル";
  document.title = fixedTitle;
  const titleElement = document.querySelector("title");
  if (titleElement) {
    new MutationObserver(() => {
      if (document.title !== fixedTitle) {
        document.title = fixedTitle;
      }
    }).observe(titleElement, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  }
</script>
```

`<プロジェクト名>.js`の中にページタイトルを変更するロジックがあるが、そこを無理に修正するのはおすすめしない。

またプロジェクト設定の`一般`＞`アプリ`＞`構成`＞`名前`でプロジェクトの名前を変更できるしそのプロジェクト名がページタイトルに使われるが、ページタイトルってサイト名とかも含めたいはずなので、ここで設定するのはよろしくない。

### 独自に用意したファイルがエクスポート時に読み込まれない

ゲーム設定ファイルにyamlなどを採用した場合でも、yamlがエクスポート対象になっていないとリソールファイルに取り込まれない。

Godotの「プロジェクト」→「エクスポート」→「Web」プリセット内の「リソース」

- エクスポートモード：すべてのリソース  
  `export_filter="all_resources"`
- 非リソースファイルのInclude Filter  
  `include_filter="config/items.yaml,config/prototype_settings.yaml"`

重要なのは「Include Filter」です。YAMLは通常のGodotリソースではないため、ここに対象ファイルを指定してPCKへ含めます。現在の設定ファイルでは次の行です。

```ini
include_filter="config/items.yaml,config/prototype_settings.yaml"
```

Godot公式ドキュメント上では、非リソースファイル用の「Include Filter」に相当する項目です。[Exporting projects](https://docs.godotengine.org/en/stable/tutorials/export/exporting_projects.html)

## UI

### UIに画像を配置する

#### 単純な画像

Godot 4 で **CanvasLayer に画像を置く** 場合、基本は次の構成にします。

```text
CanvasLayer
└─ TextureRect
```

画面全体に背景のように置きたい場合、`TextureRect` を選択して、上部ツールバーの **アンカー設定** から **Full Rect** を選び **Stretch Mode** を `Keep Aspect Covered` または `Scale` にすると、画面全体に画像を敷けます。

#### ボタンの上

ボタンにはアイコンが設定できるのでそれでも良い。

### UIの色を変更したい

- 文字色: Font Color
- 背景色: **StyleBoxFlat** の `BG Color` で設定します。

1. Buttonを選択
2. インスペクターで`Theme Overrides`→`Styles`
3. `Normal` の右側の ▼ を押し、`New StyleBoxFlat`
4. 作成された `StyleBoxFlat` をクリック
5. `BG Color` を好きな色に変更
6. ただし、`Normal` だけ変更すると、マウスホバー時やdisabled時はデフォルトに戻ってしまう。必要に応じて`StyleBoxFlat` を設定すると見た目が統一される。

#### スクリプトで変更

実行中に色を変えたい場合は、StyleBoxを取得して `bg_color` を変更します。
ただし **StyleBox は共有リソース** なので、そのまま変更すると他のボタンまで変わることがあります。そのため、通常は `duplicate()` してから `add_theme_stylebox_override()` で設定するのが推奨されています。
