# FL Studio 逆引きマニュアル

最終更新日: 2026-10-12

- [ノート入力・録音](#ノート入力録音)
  - [ステップ録音をするには](#ステップ録音をするには)
  - [ピアノロールを複数同時に開くには](#ピアノロールを複数同時に開くには)
- [再生・メトロノーム](#再生メトロノーム)
  - [メトロノームのショートカットでMIDI読み込みが開く場合](#メトロノームのショートカットでmidi読み込みが開く場合)
- [パターン・マーカー](#パターンマーカー)
  - [パターン内の複数のマーカーを別パターンへコピーするには](#パターン内の複数のマーカーを別パターンへコピーするには)

## ノート入力・録音

### ステップ録音をするには

再生を止めた状態で、鍵盤を押すごとにノートを順番に入力するには、ステップ編集モードを使います。

1. 入力先のパターンと、Channel Rackの楽器チャンネルを選び、ピアノロールを開きます。
2. `Ctrl + E`、またはツールバーの足跡アイコンでステップ編集モードをオンにします。録音ボタンをオンにする必要はありません。
3. メインツールバーのスナップ設定で入力する音符の長さを指定します。`Line`ではピアノロールのズームに応じたグリッド間隔が音符の長さになります。
4. MIDIキーボードで鍵盤を押します。ノートが入力され、入力位置が自動で次のステップへ進みます。パソコンのキーボードを使う場合は、`Ctrl + T`で「Typing keyboard to piano keyboard」をオンにします。
5. 入力が終わったら、ステップ編集モードをオフにします。

入力中の操作は次のとおりです。`/`と`*`はテンキー側のキーを使います。

- 休符を入れる: テンキーの`*`で、ノートを入れずに次のステップへ進みます。サステインペダルでもステップを飛ばせます。
- 前のステップへ戻る: テンキーの`/`を押します。
- 長い音符を入れる: 鍵盤を押したままテンキーの`*`を押して長さを伸ばし、最後に鍵盤を離します。

参考: [公式マニュアル: Step Input Mode](https://www.image-line.com/fl-studio-learning/fl-studio-online-manual/html/recording_step.htm)

### ピアノロールを複数同時に開くには

同じFL Studio内で、ピアノロールを複数の独立したウィンドウとして同時に開くことはできない。複数パートを見ながら編集するには、ゴーストノートを使う。

- 同じパターンの他チャンネルを表示: ピアノロールで`Alt + V`（`Ghost channels`）。
- 表示中の他チャンネルを直接編集: `View`＞`Editable ghosts`（`Ctrl + Alt + V`）をオン。
- 同じパターンのゴーストノートを右ダブルクリックすると、そのチャンネルへ切り替わる。
- 別パターンのノートを参照: `Playlist`でパターンクリップの時間範囲を重ねてからピアノロールを開く。ピアノロールのゴーストノート設定で対象トラック・クリップの表示を有効にする。別パターンのゴーストノートは枠だけで表示され、右ダブルクリックによる編集先の切り替えはできない。

参考: [公式マニュアル: Piano roll（Ghost Notes）](https://www.image-line.com/fl-studio-learning/fl-studio-online-manual/html/pianoroll.htm)、[公式マニュアル: Piano roll Menu](https://www.image-line.com/fl-studio-learning/fl-studio-online-manual/html/pianoroll_menu.htm)

## 再生・メトロノーム

### メトロノームのショートカットでMIDI読み込みが開く場合

メトロノームのオン・オフは`Ctrl + M`です。ただし、ピアノロールがアクティブな場合、同じキーが「MIDIファイルのインポート」として動作します。

- Channel Rackのタイトルバーなどをクリックしてアクティブにしてから、`Ctrl + M`を押します。
- ピアノロールでの作業中は、メインツールバーのメトロノームボタンを直接クリックして切り替えることもできます。

ヒントパネルの表示と実際の動作が違うのは、アクティブなウィンドウによってショートカットの用途が変わるためです。

参考: [公式マニュアル: Keyboard & Mouse Shortcuts](https://www.image-line.com/fl-studio-learning/fl-studio-online-manual/html/basics_shortcuts.htm)、[公式マニュアル: Piano roll Menu](https://www.image-line.com/fl-studio-learning/fl-studio-online-manual/html/pianoroll_menu.htm)

## パターン・マーカー

### パターン内の複数のマーカーを別パターンへコピーするには

ピアノロールのタイムマーカーが対象。`Ctrl + C`／`Ctrl + V`はノートのコピー・貼り付けであり、マーカーの転送には使えない。

- 新規パターンを作る場合は、コピー元をパターンセレクターのメニューから`Clone`で複製する方法を試す。ノートも複製されるため、複製先で不要なノートを`Ctrl + A`＞`Delete`で消し、各チャンネルの内容を入れ替える。
- 既存パターンへマーカーだけを一括転送する標準操作は、公式マニュアルでは確認できなかった。少数ならコピー先でマーカーを作り直す。

参考: [公式マニュアル: Toolbar（パターンのClone）](https://www.image-line.com/fl-studio-learning/fl-studio-online-manual/html/toolbar_panels.htm)、[公式マニュアル: Piano roll Menu](https://www.image-line.com/fl-studio-learning/fl-studio-online-manual/html/pianoroll_menu.htm)
