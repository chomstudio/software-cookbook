# Bluma 逆引きマニュアル

---

- [利用方法](#利用方法)
  - [bulmaを使い始めるには](#bulmaを使い始めるには)
  - [bulmaのドキュメントを見るには](#bulmaのドキュメントを見るには)
- [レイアウト](#レイアウト)
  - [container](#container)
  - [columns/column](#columnscolumn)
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

- 縦割りレイアウトに使う。（横並びに配置される）
- `columns`の下に`column`を配置する。`column`の数だけ分割される。
- どの幅で分割／積み重ねになるかは `container` を参照
- 1/12グリッドを`is-1`～`is-12`で幅指定、無指定でAuto
- `grid`や`fixed-grid`というものもあるがほぼ使わない

```html
<div class="columns">
  <div class="column">First column</div>
  <div class="column">Second column</div>
  <div class="column">Third column</div>
  <div class="column">Fourth column</div>
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
