# Bulma 逆引きマニュアル

---

- [利用方法](#利用方法)
  - [bulmaを使い始めるには](#bulmaを使い始めるには)
  - [bulmaのドキュメントを見るには](#bulmaのドキュメントを見るには)
  - [ライト／ダークテーマを固定するには](#ライトダークテーマを固定するには)
- [レイアウト](#レイアウト)
  - [container](#container)
  - [columns/column](#columnscolumn)
  - [grid/cell](#gridcell)
  - [fixed-grid](#fixed-grid)
  - [block/box](#blockbox)
- [ページ構成](#ページ構成)
  - [header](#header)
  - [navbar](#navbar)
  - [footer](#footer)
- [ページ本文](#ページ本文)
  - [content](#content)
- [見出し系](#見出し系)
  - [hero](#hero)
  - [title/subtitle](#titlesubtitle)
- [パーツ](#パーツ)
  - [button](#button)
  - [card](#card)
  - [message](#message)
  - [tab](#tab)
  - [form](#form)
  - [menu](#menu)
- [色・スタイル](#色スタイル)
  - [color](#color)

---

## 利用方法

### bulmaを使い始めるには

単一のCSSのみでできているので、linkタグで読み込むだけで良い

#### CDNを利用する場合

試す方法としては最も簡単だが、本番環境ではサーバー内で用意したほうが良い。

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/bulma@1.0.4/css/bulma.min.css"
/>
```

#### ローカルやサーバー上に置き場所を用意する場合

```html
<link rel="stylesheet" href="/css/vendor/bulma.min.css" />
```

どちらの場合でも `bumla.min.css` が最もファイルサイズが小さいので利用者の負荷が少ない。

### bulmaのドキュメントを見るには

<https://bulma.io/documentation/>

### ライト／ダークテーマを固定するには

```html
<html lang="ja" data-theme="light">
  ...
</html>
```

```html
<html lang="ja" data-theme="dark">
  ...
</html>
```

## レイアウト

### container

- `container`を使うと左右に隙間があいてセンタリングされる
- 画面解像度によって段階的にサイズが変更される
  - 横幅1400px以上→1344px
  - 横幅が1400px以下になると→1152px
  - 横幅が1240px以下になると→960px
  - 横幅が1035px以下になると→分割を保って可変
  - 横幅が780px以下になると→縦に重なって可変
- いろいろオプションがあるが、結論としては何も指定せずに使うのがよさそう
- `body`の直下に`div`を置くか、カラムを使わないなら `main` に指定しても良い

```html
...
<body>
  <div class="container">
    <main class="content">...</main>
  </div>
</body>
```

### columns/column

- ページやブロックを縦割りレイアウトにするときに使う。（横並びに配置される）
- `columns`の下に`column`を配置する。`column`の数だけ分割される。
- どの幅で分割／積み重ねになるかは `container` を参照
- 1/12グリッドを`is-1`～`is-12`で幅指定、無指定でAuto

```html
<div class="columns">
  <div class="column">First column</div>
  <div class="column">Second column</div>
  <div class="column">Third column</div>
  <div class="column">Fourth column</div>
</div>
```

### grid/cell

- tableに近いレイアウト方法。
- 決められた幅のcellを確保しようとする。`is-col-min-N` で `N x 1.5em` 分の幅のセルを作る。が、幅が狭くなるとやっぱり縮小されていくのであまりにあてにならない。デフォルトでは `is-col-min-6`のようだ
- columnsと違い、デフォルトで隙間(gap)が用意される
- `is-col-span`/`is-row-span` で複数個分のグリッド幅を決められる。
- `is-gap-0～8` でギャップ（隙間）を決める。
- `is-column-gap-N` で横方向の隙間。
- `is-row-gap-N` で縦方向の隙間。

```html
<div class="grid">
  <div class="cell">Cell 1</div>
  <div class="cell">Cell 2</div>
  <div class="cell">Cell 3</div>
  <div class="cell">Cell 4</div>
  <div class="cell">Cell 5</div>
  <div class="cell">Cell 6</div>
  <div class="cell">Cell 7</div>
  <div class="cell">Cell 8</div>
  <div class="cell">Cell 9</div>
  <div class="cell">Cell 10</div>
  <div class="cell">Cell 11</div>
  <div class="cell">Cell 12</div>
</div>
```

### fixed-grid

どんな横幅でもN分割される。`has-N-cols` 指定で分割数を指定。省略時 `N=2`

```html
<div class="fixed-grid has-2-cols">
  <div class="grid">
    <div class="cell">Cell 1</div>
    <div class="cell">Cell 2</div>
    <div class="cell">Cell 3</div>
    <div class="cell">Cell 4</div>
  </div>
</div>
```

### block/box

- どちらもブロックに隙間ができる
- blockは枠なし、boxは枠あり

```html
<section class="block">
  <p>.block は下に隙間が開く。</p>
</section>

<section class="box">
  <p>.box はほんのり枠で囲まれる。</p>
</section>
```

## ページ構成

### header

- headerというクラスはない
- でもサイトヘッダーにはnavbarが、ページヘッダーにはheroがあるもんだ

### navbar

ページの先頭によくあるトップメニューを作成できる

注意：横幅が足りないと自動的にボタンメニューになるが、そこからドロップダウンメニューを表示するにはJavascriptが必要になる。BulmaにはJavascriptが内蔵されていないため**メニュー開閉のJavascriptは自分で用意しなければならない**。これを忘れるとスマホでほかのページに飛べなくなる恐れがある。

```html
<header>
  <nav
    class="navbar has-background-grey-lighter"
    role="navigation"
    aria-label="main navigation"
  >
    <div class="navbar-brand">
      <button
        type="button"
        class="navbar-burger"
        id="global-menu"
        aria-label="メインメニューを開閉"
        aria-controls="navMenu"
        aria-expanded="false"
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </button>
    </div>

    <div class="navbar-menu" id="navMenu">
      <div class="navbar-start">
        <a class="navbar-item" href="/works/">Works</a>
        ...
      </div>
    </div>
  </nav>
</header>
...
<script>
  const btnMenuPopup = document.getElementById("global-menu");
  const navMenu = document.getElementById("navMenu");
  if (btnMenuPopup && navMenu) {
    const setMenuOpen = (isOpen: boolean) => {
      btnMenuPopup.classList.toggle("is-active", isOpen);
      navMenu.classList.toggle("is-active", isOpen);
      btnMenuPopup.setAttribute("aria-expanded", String(isOpen));
    };
    btnMenuPopup.addEventListener("click", () => {
      setMenuOpen(!navMenu.classList.contains("is-active"));
    });
    navMenu.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        btnMenuPopup.focus();
      }
    });
    // PC表示へ切り替えた際に、スマートフォン用の開閉状態をリセットします。
    window
      .matchMedia("(min-width: 1024px)")
      .addEventListener("change", () => {
        setMenuOpen(false);
      });
  }
</script>
```

### footer

```html
<footer class="footer has-background-grey-lighter">
  <div class="columns is-mobile is-vcentered">
    <div class="column">
      © <span id="copyright-year"></span> Chom Studio. All Rights Reserved.
    </div>
    <div class="column has-text-right">
      <button
        class="button is-primary is-outlined"
        onclick="window.scrollTo(0,0)"
      >
        ▲Page Top
      </button>
    </div>
  </div>
</footer>
```

## ページ本文

### content

`content` の外では、`h1`も`ul`も`p`も`blockquote`も、すべて「リセット」されており、スタイルが適用されない。
`content`で囲むことで、それらが初めてそれらしいスタイルを持つ。

`main`,`article`,`section`と組み合わせて使うのが吉。

```html
<h1>ただのテキストで、見出しっぽくない</h1>
...
<div class="content">
  <h1>見出しっぽい</h1>
  <p>本文っぽい</p>
  <ul>
    <li>リストっぽい</li>
  <ul>
  <blockquote>引用っぽい</blockquote>
</div>

```

## 見出し系

### hero

でっかい見出し。背景画像をつけたりもする。

### title/subtitle

- タイトル、というよりは「太字＋フォントサイズ指定」のためにある感じ。
- h1～h6じゃなくて普通のpとかでもタイトルみたいなフォントサイズになる。
- `content` 内で使う場合は`h1` と `title is-3` がほぼ同じ効果を持つ。
- `is-1`～`is-6` でフォントの大きさ指定。
- デフォルトで `h3` と同じサイズ。
- `title` と一緒に使わず `is-3` 等単体のみで使うことはできない。
- `is-spaced` をつけるとタイトルの下に隙間ができる。

```html
<!-- 同じフォントサイズ -->
<h1>H1</h1>
<p class="title is-3">is-3</p>

<h2>H2</h2>
<p class="title is-4">is-4</p>

<h3>H3</h3>
<p class="title is-5">is-5</p>

<h4>H4</h4>
<p class="title is-5">is-6</p>

<!-- +2のsubtitleと組み合わせるといい感じ -->
<p class="title is-1">Title 1</p>
<p class="subtitle is-3">Subtitle 3</p>
```

## パーツ

### button

```html
<button class="button is-primary">ボタン</button>
```

#### 大きさ

- 複数個並べるときは buttons を使うと、位置がいい感じに合う
- 縦位置が中央揃えになる、ボタン間に隙間ができる、など

```html
<div class="buttons">
  <button class="button is-small">Small</button>
  <button class="button">Default</button>
  <button class="button is-normal">Normal</button>
  <button class="button is-medium">Medium</button>
  <button class="button is-large">Large</button>
</div>
```

横幅いっぱい（縦幅が変化する）

```html
<div class="buttons">
  <button class="button is-small is-fullwidth">Small</button>
  <button class="button is-fullwidth">Normal</button>
  <button class="button is-medium is-fullwidth">Medium</button>
  <button class="button is-large is-fullwidth">Large</button>
</div>
```

buttons 側でサイズ指定もできる

```html
<div class="buttons are-medium">
  <button class="button">All</button>
  <button class="button">Medium</button>
  <button class="button">Size</button>
</div>
```

#### アウトライン／角丸／テキストのみ／隠し（※textとghostは色指定無効）

```html
<div class="buttons">
  <button class="button is-primary is-outlined">is-outlined</button>
  <button class="button is-primary is-inverted">is-inverted</button>
  <button class="button is-primary is-rounded">is-rounded</button>
  <button class="button is-text">is-text</button>
  <button class="button is-ghost">is-ghost</button>
</div>
```

#### 状態変化（通常／マウスオーバー／フォーカス／アクティブ／ロード中／無効

- マウスホバー／フォーカス／アクティブ時は特に自分でつけなくても勝手にスタイルが適用される。（スクリプトで制御したりする必要はない）。
- 無効は disabled をつけるだけで、クラス指定は不要。
- ロード中と無効は、ホバーアイコンも変化する

```html
<div class="buttons">
  <button class="button is-primary">Normal</button>
  <button class="button is-primary is-hovered">Hover</button>
  <button class="button is-primary is-focused">Focus</button>
  <button class="button is-primary is-active">Active</button>
  <button class="button is-primary is-loading">Loading</button>
  <button class="button is-primary" title="Disabled button" disabled>
    Disabled
  </button>
</div>
```

#### 合体(has-addons)

```html
<div class="buttons has-addons">
  <button class="button">Left</button>
  <button class="button">Center</button>
  <button class="button">Right</button>
  </p>
</div>
```

#### 中央寄せ、右寄せ

```html
<div class="buttons has-addons is-centered">
  <button class="button">Yes</button>
  <button class="button">Maybe</button>
  <button class="button">No</button>
</div>

<div class="buttons has-addons is-right">
  <button class="button">Yes</button>
  <button class="button">Maybe</button>
  <button class="button">No</button>
</div>
```

#### 選択状態(疑似コンボボックス)

```html
<div class="buttons has-addons">
  <button class="button is-success is-selected">Yes</button>
  <button class="button">Maybe</button>
  <button class="button">No</button>
</div>
```

### card

- カード。

```html
<div class="card">
  <div class="card-content">
    <div class="content">画像もヘッダもなしの最もシンプルなカード</div>
  </div>
</div>
```

```html
<div class="card">
  <header class="card-header has-background-info">
    <p class="card-header-title">カードヘッダ</p>
  </header>
  <div class="card-content">
    <div class="content">ヘッダとフッタつきのカード</div>
  </div>
  <footer class="card-footer">
    <a href="#" class="card-footer-item">Save</a>
    <a href="#" class="card-footer-item">Edit</a>
    <a href="#" class="card-footer-item">Delete</a>
  </footer>
</div>
```

```html
<div class="card">
  <div class="card-image">
    <!-- is-4by3 は 4:3の画像比率を確保してくれる -->
    <figure class="image is-4by3">
      <img src="" alt="画像" />
    </figure>
  </div>
  <div class="card-content">
    <div class="content">サムネ画像つきのカード。</div>
  </div>
</div>
```

```html
<div class="card">
  <div class="card-content">
    <div class="media">
      <div class="media-left">
        <figure class="image is-48x48">
          <img src="" alt="ユーザーアイコンなど" />
        </figure>
      </div>
      <div class="media-content">
        <p class="title is-4">ユーザー名</p>
        <p class="subtitle is-6">@アカウント名など</p>
      </div>
    </div>
    <div class="content">SNS風のカード。</div>
  </div>
</div>
```

### message

- ポップアップダイアログ。
- Bulma単体ではウィンドウを閉じる機能はない。閉じるボタンにClickイベントを仕込む。

```html
<button class="button js-modal-open" data-target="modal-dialog1">
  ダイアログを開くボタン
</button>

<!-- modal に is-active を追加すると表示される。それまでは非表示 -->
<div class="modal" id="modal-dialog1">
  <div class="modal-background"></div>
  <div class="modal-content">
    <!-- ここから暗転表示内容  -->

    <article class="message">
      <div class="message-header">
        <p>メッセージタイトル</p>
        <!-- ダイアログの閉じるボタンにも閉じる先を書いておく -->
        <button
          class="delete js-modal-close"
          data-target="modal-dialog1"
        ></button>
      </div>
      <div class="message-body">メッセージ本文</div>
    </article>

    <!-- 画面右上の閉じるボタン -->
    <button
      class="modal-close js-modal-close"
      data-target="modal-dialog1"
    ></button>

    <!-- ここまで暗転表示内容 -->
  </div>
</div>
```

```javascript
document.addEventListener("DOMContentLoaded", () => {
  //開く関数
  const openModal = (e) => e && e.classList.add("is-active");
  //閉じる関数
  const closeModal = (e) => e && e.classList.remove("is-active");
  //すべて閉じる関数
  const closeAllModals = () => {
    for (const modal of document.querySelectorAll(".modal")) {
      closeModal(modal);
    }
  };
  // js-modal-trigger がついているボタンやリンクすべてに「開く」イベントを仕込む
  for (const openner of document.querySelectorAll(".js-modal-trigger")) {
    const modal = openner.dataset.target;
    const target = document.getElementById(modal);
    openner.addEventListener("click", () => openModal(target));
  }
  // js-modal-close がついているボタンやリンクすべてに「閉じる」イベントを仕込む
  for (const closer of document.querySelectorAll(".js-modal-close")) {
    const modal = closer.dataset.target;
    const target = document.getElementById(modal);
    closer.addEventListener("click", () => closeModal(target));
  }
  // ESCキーでも閉じられるようにする。対象はすべてのモーダル
  document.addEventListener(
    "keydown",
    (event) => event.key === "Escape" && closeAllModals(),
  );
});
```

### tab

調査中

### form

調査中

### menu

調査中

## 色・スタイル

### color

`has-background-*`/`has-text-*`と組み合わせて以下が使える

- white
- black
- light
- dark
- primary
- link
- info
- success
- warning
- danger

以下はさらに `has-text-*-light` `has-text-*-dark` も使える

- primary
- link
- info
- success
- warning
- danger

ボタンなどに色を付けた場合、文字色も見やすい色に変更される。
