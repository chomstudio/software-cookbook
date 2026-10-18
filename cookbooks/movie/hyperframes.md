# HyperFrames 勉強メモ

---

- [概要](#概要)
  - [Remotionとの違い](#remotionとの違い)
- [なにができるか](#なにができるか)
  - [/product-launch-video スキル](#product-launch-video-スキル)
  - [/faceless-explainer スキル](#faceless-explainer-スキル)
  - [/embedded-captions スキル](#embedded-captions-スキル)
  - [/talking-head-recut スキル](#talking-head-recut-スキル)
  - [/pr-to-video スキル](#pr-to-video-スキル)
  - [/motion-graphics スキル](#motion-graphics-スキル)
  - [/music-to-video スキル](#music-to-video-スキル)
  - [/slideshow スキル](#slideshow-スキル)
  - [/general-video スキル](#general-video-スキル)
- [生成手順](#生成手順)
- [音声について](#音声について)
- [生成される可能性のある文書とその役割](#生成される可能性のある文書とその役割)
  - [BRIEF.md](#briefmd)
  - [frame.md](#framemd)
  - [SCRIPT.md](#scriptmd)
  - [STORYBOARD.md](#storyboardmd)
- [index.htmlの構成](#indexhtmlの構成)

---

## 概要

- [HyperFrams](https://github.com/heygen-com/hyperframes)はスクリプトベースのモーショングラフィックス動画作成ソフトである。
- HTML+CSS+Javascript(TypeScript)をベースとして画面デザインを構築し、それを毎フレームキャプチャすることで動画化する。
- オープンソースであり、無料で利用できる。
- AIエージェントとの連携が強く、自分の言語で指示するだけで動画を作成できる。

### Remotionとの違い

- RemotionはReactを採用している。HyperFramesは採用していない。よって追加のモジュールのインストールの手間やバージョン競合の心配が少ない。
- HyperFramesはAIエージェントの共同作業をより積極的に押し出しており、Remotionよりも対応は一歩進んでいる。
- どちらも無料で使え、商用利用目的の動画生成も問題なく、動画内や概要欄に著作権表記も必要ないが、Remotionは4人以上の営利企業の利用ではCompany Licenseが必要としている。（ただしHyperFramesでもソースそのものを再配布するときは Apache-2.0 に従いライセンスファイルの添付が必要になる）

## なにができるか

### /product-launch-video スキル

Webサイト のURL、制作概要、台本から、製品発表動画、SaaS紹介動画、プロモーション動画を制作します。また、サイト自体をキャプチャした映像を使うサイトツアーや紹介動画にも対応します。

### /faceless-explainer スキル

任意のテキスト（テーマ、記事、メモ）から、人物の顔を出さない60〜90秒の解説動画を制作します。URLやWebサイトのキャプチャは使用しません。

### /embedded-captions スキル

既存の人物が話す動画（MP4）に、キャプションや字幕を追加します。字幕用の帯と映像内字幕を併用する形式、または映像内に字幕だけを配置する映画風の形式に対応します。映像素材自体は変更しません。

### /talking-head-recut スキル

既存の人物が話す動画、インタビュー、ポッドキャスト動画（MP4）に、文字起こしと同期した デザイン済みのグラフィックオーバーレイ を加えます。動きのあるタイトル、画面下部の名前・肩書き表示、データの強調表示、引用の抜き出し、サイドパネル、ピクチャーインピクチャーなどが対象です。下にある元の動画は変更せず、そのまま再生します。通常のキャプションや字幕だけを追加する場合は /embedded-captions を使用します。

### /pr-to-video スキル

GitHubのPR（URL、owner/repo#N、「このPR」など）から、30〜90秒のコード変更解説動画を制作します。変更履歴、機能紹介、不具合修正、リファクタリングなどが対象です。

### /motion-graphics スキル

デザインを中心とする短いモーショングラフィックス（通常10秒未満）を制作します。動きそのものがメッセージを伝え、ナレーションは付けません。動く文字、統計値や数値のカウントアップ、グラフ、短いロゴアニメーション、画面下部のテロップやオーバーレイ、動きを付けた投稿・見出し・キャプチャ済みページの強調表示などが対象です。MP4または透過オーバーレイとしてレンダリングします。長尺、ナレーション付き、独自構成の場合は /general-video を使用します。

### /music-to-video スキル

楽曲 から、ビートに同期した動画（歌詞動画、スライドショー、動きのあるプロモーション動画）を制作します。楽曲には、音声ファイル、音声を取り出すための動画、雰囲気の指定から生成した音楽を使用できます。音楽が進行のテンポを決め、ユーザーが提供した画像や動画も同じビートの時間軸に沿って編集します。

### /slideshow スキル

プレゼンテーション、ピッチ資料、インタラクティブなスライド資料 を制作します。独立したスライド、要素の段階的な表示、分岐、クリック領域による移動、発表者モードに対応します。出力は操作して移動できるスライド資料であり、レンダリング済みの動画ではありません。

### /general-video スキル

ほかのワークフローに当てはまらない動画に対応します。タイトルカード、長めのブランド動画やハイライト動画、複数場面のモンタージュ、静的なループ、独自コンポジションなどが対象です。また、HyperFramesの全ツールを使って共同制作する コンパニオンモード の入口でもあります。これは従来のHyperFrames制作フローであり、長さの制限はありません。

## 生成手順

以下の流れを把握しておくと、AIエージェントとのやりとりもスムーズだ。例えば「◯◯な動画を作って」と大雑把な指示を投げると、AIのみの判断で最後まで（動画生成まで）一気に進めてしまいがちだが、「BRIEFの段階で一旦見せて」「STORYBOARDまで進めて」のような指示を出して逐一確認しながら進めると、より高クオリティな動画に仕上がるだろう。

- チャット、あるいはユーザー作成の文書にてユーザーが作りたい動画内容を受け取る。
- 動画全体の方向性を固め `BRIEF.md` にまとめる。
- シーン割り、長さなどのコンテにあたる部分を `STORYBOARD.md` にまとめる。
- ナレーションが必要であれば、ナレーション台本を `SCRIPT.md` に作成。
- 画面デザインの方向性（画面サイズ・フレーム数・カラーパレットなど）を決めて `frame.md` に記述。追加で `DESIGN.md` などを用意することもある。
- 必要に応じて以下の個別の文書を作ることがある。
  - 複数シーンに分かれる動画であれば、`frame-packets/<frame_id>.md` を作成し、複数のエージェントに並行で指示を与える。このとき用意される `frame-packets/_role.md` は全シーン共通の指示。
- 各エージェントが作業して `compositions/frames` に各シーンの内容をHTMLで記述する。
  - 内蔵ライブラリから `compositions/components` にテンプレートとしてコピーし、動きの参考にすることがある（このテンプレートファイルは直接参照はされないらしい）
- すべてのシーンを接続し `index.html` から読めるようにする。これが最終的な動画のレンダリング対象の画面になる。
- 音声が必要であれば `SCRIPT.md` から音声を生成する。
- 全体をチェックする。音声のはみ出しなどがあれば再調整される。
- レンダリングと合成を行い `/renders` フォルダに動画ファイルを出力する。

## 音声について

ユーザーがあらかじめ音声ファイルを用意してそれを使わせることも可能だが、TTSの環境があればHyperframes側から合成音声を生成させることも可能だ。

日本人的には [VOICEVOX](https://voicevox.hiroshiba.jp/) が一番なじみがあり使いやすいTTSの選択肢だろう。

また、HyperFramesには音楽解析機能が内蔵されており、音楽のリズムに合わせたモーショングラフィックスも生成可能だ。

## 生成される可能性のある文書とその役割

### BRIEF.md

**依頼条件の記録**。目的、対象者、伝えたいこと、動画の種類、尺、縦横比、言語、提供素材、禁止事項、確認の進め方などをまとめます。

原則として新規制作時。既存プロジェクトの修正・再出力では新規作成を省けます。

### frame.md

**映像全体の見た目の仕様**。配色、フォント、文字サイズ、余白、カードなどの部品、共通の表現規則を定めます。作成せずに既存の仕様やプリセットを利用することもあります。

`DESIGN.md` を作成することがありますが書類が意味するところ同じです。参照優先順位は `frame.md` → `design.md` → `DESIGN.md`

### SCRIPT.md

**確定したナレーション台本**。音声合成で実際に読み上げる文章を保持します。

ナレーションのない動画では不要です。提供済みの `.txt` を使う場合もあります。

### STORYBOARD.md

**動画全体の場面設計書**。場面の順序、各場面の内容・尺・素材・ナレーション対応・動き・場面転換・出力HTMLのパス・制作状態をまとめます。

目で確認するための絵コンテとして `storyboard.html` を作ることもあります。各場面のワイヤーフレームや構図を一覧表示します。スケッチ確認を省く進め方では作らないことがあります。

場面ごとにワーカーへ分担する場合、STORYBOARD.md をもとに `frame-packets/<frame_id>.md` を生成し、その場面の設計、尺、出力先、必要な素材、選定したショットテンプレートや動きの規則を渡します。標準の保存先は `.hyperframes/frame-packets/` です。同時に用意される `frame-packets/_role.md` は場面担当ワーカーの役割・制約。担当範囲、HTMLの形式、触ってはいけないもの、自己確認項目、動画種類固有の規則をまとめます。

## index.htmlの構成

各シーンは `<div>` 、音声は `<audio>` で記述される。

```html
<div
  data-hf-id="hf-zopc"
  id="root"
  data-composition-id="main"
  data-start="0"
  data-duration="15"
  data-width="1920"
  data-height="1080"
  data-fps="30"
>
  <div
    data-hf-id="hf-1s38"
    id="scene-01-hook"
    class="clip scene"
    data-composition-id="scene-01-hook"
    data-composition-src="compositions/frames/01-hook.html"
    data-start="0"
    data-duration="2.75"
    data-track-index="0"
    data-width="1920"
    data-height="1080"
  ></div>
  ...
  <div
    id="wipe-one"
    class="clip wipe-band"
    data-start="2.59"
    data-duration="0.32"
    data-track-index="1"
    data-layout-allow-overflow
  ></div>
  ...
  <audio
    data-hf-id="hf-tu7n"
    id="narration"
    src="assets/software-cookbook-narration.wav"
    data-start="0.2"
    data-duration="13.941333"
    data-track-index="2"
    data-volume="1"
  ></audio>
</div>
```

共通属性

- `data-hf-id`: HyperFraemesが管理するID。ランダムな文字列。
- `data-start`: 有効になる再生時刻
- `data-duration`: 有効な再生時間※終了時刻ではない
- `data-width`: 横幅(px)
- `data-height`: 縦幅(px)
- `data-track-index`: おそらく重なりを示す。通常は0。ワイプなど上に重なるものは 1。

メインのみ

- `id`: "root"固定。
- `data-composition-id`: "main"固定。
- `data-fps`: FPS。

シーンのみ

- `id`: シーンID
- `class`: "clip scene"固定。
- `data-composition-id`: シーンID。
- `data-composition-src`: シーンが定義されたHTMLファイルのパス。

ワイプのみ

- `id`: ワイプID
- `class`: "clip wipe-band"固定。
- `data-layout-allow-overflow`: おそらく画面はみ出しを許可する属性。

音声のみ

- `id`: "narration"固定。
- `src`: オーディオファイルパスを指定。
- `data-volume`: おそらくボリューム。
