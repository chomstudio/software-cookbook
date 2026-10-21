# Javascript 逆引きマニュアル

---

- [計算](#計算)
  - [整数割り算の商と余りの計算方法](#整数割り算の商と余りの計算方法)
  - [最大値と最小値の間に収めるシンプルな方法](#最大値と最小値の間に収めるシンプルな方法)
- [変数](#変数)
  - [複数の変数に一度に代入するには](#複数の変数に一度に代入するには)
  - [2つの変数を入れ替える(Swapする)には](#2つの変数を入れ替えるswapするには)
- [文字列](#文字列)
  - [日付を文字列フォーマット "YYYY-MM-DD" で取得する最短の方法は](#日付を文字列フォーマット-yyyy-mm-dd-で取得する最短の方法は)
  - [URLパラメータを簡単に解析する方法](#urlパラメータを簡単に解析する方法)
  - [数値の小数点以下の桁数を揃えて文字列化するには](#数値の小数点以下の桁数を揃えて文字列化するには)
  - [文字列を指定の文字数になるまで文字で埋めるには](#文字列を指定の文字数になるまで文字で埋めるには)
- [配列](#配列)
  - [そいつが配列がどうかを調べる](#そいつが配列がどうかを調べる)
  - [配列の長さ（要素数）を調べる](#配列の長さ要素数を調べる)
  - [配列に要素が含まれているか調べる](#配列に要素が含まれているか調べる)
  - [要素の位置(添字・インデックス番号）を調べる](#要素の位置添字インデックス番号を調べる)
  - [配列の最後尾にひとつ（以上）の要素を追加する](#配列の最後尾にひとつ以上の要素を追加する)
  - [配列の先頭にひとつ（以上）の要素を追加する](#配列の先頭にひとつ以上の要素を追加する)
  - [ふたつの配列を合体する](#ふたつの配列を合体する)
  - [要素の削除：添字（インデックス番号）がわかっている場合](#要素の削除添字インデックス番号がわかっている場合)
  - [要素の削除：添字がわからない／要素の内容から削除したい場合](#要素の削除添字がわからない要素の内容から削除したい場合)
  - [要素の削除：最後尾からひとつだけ削除したい場合](#要素の削除最後尾からひとつだけ削除したい場合)
  - [要素の削除：先頭からひとつだけ削除したい場合](#要素の削除先頭からひとつだけ削除したい場合)
  - [要素の削除：先頭からn個が必要で、それ以降を消したい／個数上限を設けたい場合](#要素の削除先頭からn個が必要でそれ以降を消したい個数上限を設けたい場合)
  - [配列に関する余談](#配列に関する余談)
  - [配列をループで回す方法(for + カウンタ)](#配列をループで回す方法for--カウンタ)
  - [配列をループで回す方法(for ... of)](#配列をループで回す方法for--of)
  - [ループ中にインデックス値と内容を同時に取る方法(entries)](#ループ中にインデックス値と内容を同時に取る方法entries)
  - [すべての要素を計算してひとつの結果（例えば合計）を出す方法](#すべての要素を計算してひとつの結果例えば合計を出す方法)
  - [配列をもとに新しい配列を作り出す方法](#配列をもとに新しい配列を作り出す方法)
  - [配列からいらない要素を消すには](#配列からいらない要素を消すには)
  - [配列の内容を全てつなげてひとつの文字列にするには](#配列の内容を全てつなげてひとつの文字列にするには)
  - [文字列から区切り文字で区切って配列にするには](#文字列から区切り文字で区切って配列にするには)
  - [配列をソート（並べ替え）するには](#配列をソート並べ替えするには)
- [連想配列(オブジェクト)](#連想配列オブジェクト)
  - [そいつが連想配列がどうかを調べるには](#そいつが連想配列がどうかを調べるには)
  - [連想配列(オブジェクト)の長さ（要素数）を調べる](#連想配列オブジェクトの長さ要素数を調べる)
  - [連想配列(オブジェクト)に指定のキーが含まれているか調べる](#連想配列オブジェクトに指定のキーが含まれているか調べる)
  - [連想配列(オブジェクト)に指定の内容(value)が含まれているか調べる](#連想配列オブジェクトに指定の内容valueが含まれているか調べる)
  - [オブジェクトに要素を追加する](#オブジェクトに要素を追加する)
  - [要素の削除：キーがわかっている場合](#要素の削除キーがわかっている場合)
  - [要素の削除：キーがわからない／要素の内容から削除したい場合](#要素の削除キーがわからない要素の内容から削除したい場合)
  - [連想配列をループで回す](#連想配列をループで回す)
  - [間違えやすいやつ](#間違えやすいやつ)
  - [オブジェクトの深いネストのプロパティの存在を確認する／値を取得する](#オブジェクトの深いネストのプロパティの存在を確認する値を取得する)

---

## 計算

### 整数割り算の商と余りの計算方法

```js
console.log(Math.floor(20 / 7)); // 2
console.log(5 % 2); // 1
```

### 最大値と最小値の間に収めるシンプルな方法

```js
function limit(v, min, max) {
  // minとmaxが反転している場合修正する
  if (min > max) [max, min] = [min, max];
  // 最大値と現在値を比較して小さいほうをとり、
  // 最小値と現在値を比較して大きいほうをとる
  return Math.min(max, Math.max(min, value));
}

value = limit(valuve, min, max);
```

## 変数

### 複数の変数に一度に代入するには

[分割代入](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)

```js
let [a, b] = [10, 20]; //<-もちろんletは前もって宣言しておいてOK
console.log(a); //<- 10
console.log(b); //<- 20

let [a, b, ...rest] = [10, 20, 30, 40, 50];
console.log(a); //<- 10
console.log(b); //<- 20
console.log(rest); //<- Array [30, 40, 50]

function fn() {
  return [1, 2];
}
let [a, b] = fn();
console.log(a); //<- 1
console.log(b); //<- 2
```

### 2つの変数を入れ替える(Swapする)には

分割代入（Destructuring Assignment） を使うのが最も簡潔で一般的です。

```js
let a = 10;
let b = 20;

[a, b] = [b, a];

console.log(a); // 20
console.log(b); // 10
```

## 文字列

### 日付を文字列フォーマット "YYYY-MM-DD" で取得する最短の方法は

スウェーデン(`sv-SE`)がYYYY\-MM\-DDらしい

```js
const today = new Date();
console.log(today.toLocaleDateString("en-US"));
console.log(today.toLocaleDateString("ja-JP"));
console.log(today.toLocaleDateString("sv-SE"));
```

> "10/13/2023"
> "2023/10/13"
> "2023-10-13"

### URLパラメータを簡単に解析する方法

```js
const url =
  "https://pbs.twimg.com/media/GvQsIn2bsAAjuZh?format=jpg&name=medium";
console.log(URL.canParse(n)); // true. 文字列がURLとして解析可能かをチェックする
const n = new URL(url); //URLオブジェクトに変換
console.log(n.href); //https://pbs.twimg.com/media/GvQsIn2bsAAjuZh?format=jpg&name=medium
console.log(n.hostname); // "pbs.twimg.com"
console.log(n.origin); // "https://pbs.twimg.com"
console.log(n.pathname); // "/media/GvQsIn2bsAAjuZh"
console.log(n.searchParams); // format=jpg&name=medium
console.log(n.searchParams.get("format")); //"jpg"
console.log(n.searchParams.get("name")); //"medium"
n.searchParams.set("name", "large"); //パラメータの書き換え
console.log(n.href); // "https://pbs.twimg.com/media/GvQsIn2bsAAjuZh?format=jpg&name=large"
```

### 数値の小数点以下の桁数を揃えて文字列化するには

[Number.prototype.toFixed()](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Number/toFixed)

`<数値変数>.toFixed(<少数点以下桁数>)`

戻り値は文字列型。

```js
console.log((1.23456789).toFixed(4));
//> "1.2346"
console.log((1.00000009).toFixed(4));
//> "1.0000"
```

### 文字列を指定の文字数になるまで文字で埋めるには

[String.prototype.padStart()](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/String/padStart)

`<文字列>.padStart(<全体の文字数>,<埋める文字列>)`

```js
console.log("5".padStart(2, "0"));
//> "05"
console.log("abcd".padStart(8, "*"));
//> "****abcd"
console.log("abcd".padStart(2, "*"));
//> "abcd"
```

- 「1」を「001」にするとかに使う。
- 文字列がすでに指定の文字数をオーバーしていた時はなにもしない。

<!-- markdownlint-disable MD001 MD024 MD026 MD036 MD038 -->

## 配列

### そいつが配列がどうかを調べる

[Array.isArray()](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray)

- 配列ならtrue、そうじゃないならfalseが返る。
- 関数の戻り値が配列だったりそうじゃなかったりする事がままあるので意外によく使う
- たとえばファイル選択ダイアログを呼び出した時、戻り値が単一の文字列か、文字列の配列（複数ファイル選択した場合）かを調べるときなど。

```js
//フォルダ選択ダイアログを表示して取得
const options: dialog.OpenDialogOptions = {
  defaultPath: defaultPath,
  directory: true,
  filters: [{ name: 'Images', extensions: ['jpeg', 'jpg', "png", "gif"] }],
  multiple: false, //複数指定を禁止してはいるけどね
  recursive: false,
  title: 'Set Move Folder',
}
//フォルダパスを取得
//dialog.openは Promise<string | string[] | null> を戻す
const result = await dialog.open(options)
const resultstr = (Array.isArray(result)) ? result[0] : result;
//nullか空文字だった場合初期値をそのまま返す
return resultstr ? resultstr : defaultPath;
```

### 配列の長さ（要素数）を調べる

[Array.prototype.length](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/length)

- `<結果：要素数> = <配列>.length`

### 配列に要素が含まれているか調べる

[Array.prototype.includes()](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/includes)

- `<結果：true/false> = <配列>.includes(<調べたい要素>)`
- `<結果：true/false> = <配列>.includes(<調べたい要素>,<調べ始めるインデックス番号>)`
- 要素が見つかった場合はtrue、見つからなかった場合はfalseが返る。昔は存在確認にも `indexOf` が使われていたが今は使われない。

```js
const pets = ["cat", "dog", "bat"];
console.log(pets.includes("cat")); //-> true
```

### 要素の位置(添字・インデックス番号）を調べる

[Array.prototype.indexOf()](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf)

- `<結果：インデックス番号> = <配列>.indexOf(<調べたい要素>)`
- `<結果：インデックス番号> = <配列>.indexOf(<調べたい要素>,<調べ始めるインデックス番号>)`
- 要素が見つからなかった場合は\-1が返る。 **存在するか調べる目的ではincludesをつかうこと**

```js
const beasts = ["ant", "bison", "camel", "duck", "bison"];
console.log(beasts.indexOf("bison")); //-> 1
console.log(beasts.indexOf("bison", 2)); //-> 4
console.log(beasts.indexOf("giraffe")); //-> -1
```

### 配列の最後尾にひとつ（以上）の要素を追加する

[Array.prototype.push()](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/push)

- `<新しい配列の長さ> = <配列>.push(<新しい要素>)`
- `<新しい配列の長さ> = <配列>.push(<新しい要素>,<新しい要素>,<新しい要素>...)`
  - **配列は追加したぶんだけ増えた状態に更新される(破壊的メソッド)**
  - 返す値は「長さ」であることに注意

### 配列の先頭にひとつ（以上）の要素を追加する

[Array.prototype.unshift()](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/unshift)

- `<新しい配列の長さ> = <配列>.unshift(<新しい要素>)`
- `<新しい配列の長さ> = <配列>.unshift(<新しい要素>,<新しい要素>,<新しい要素>...)`
- **配列は追加したぶんだけ増えた状態に更新される(破壊的メソッド)**
- 返す値は「長さ」であることに注意
- unshift()は **push()より遅い** ことに注意
- **一度に複数個追加する場合と、複数回unshiftを行う場合では同じ結果にならない**ことに注意
  - 「並べた順番で追加する」のと「毎回全体をずらす」の違い。

```js
let arr = [4, 5, 6];
arr.unshift(1, 2, 3);
console.log(arr); // [1, 2, 3, 4, 5, 6]

arr = [4, 5, 6]; // 配列をリセット
arr.unshift(1);
arr.unshift(2);
arr.unshift(3);
console.log(arr); // [3, 2, 1, 4, 5, 6]
```

### ふたつの配列を合体する

[Array.prototype.concat()](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/concat)

- `<合体後の新しい配列> = <配列A>.concat(<配列B>)`
- 配列Aの後ろに配列Bが追加された新しい配列を作る。
- 配列は新しく作られるため、配列A/Bに影響を与えない。

```js
const array1 = ["a", "b", "c"];
const array2 = ["d", "e", "f"];
const array3 = array1.concat(array2);
console.log(array3); //-> Array ["a", "b", "c", "d", "e", "f"]
```

### 要素の削除：添字（インデックス番号）がわかっている場合

[Array.prototype.splice()](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/splice)

- `<配列>.splice(<削除範囲開始インデックス番号>, <削除する個数>)`
- `<配列>.splice(<削除する要素のインデックス番号>)` ※１個のみ削除する場合

### 要素の削除：添字がわからない／要素の内容から削除したい場合

[Array.prototype.filter()](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)

- `<配列>.filter(<コールバック関数>)`
  - コールバック関数は各要素を引数とする。 **trueが返ったらその要素は残る。**
- 本来は「配列の全要素から条件を満たした内容の要素のみ残した配列を作る」メソッド。つまり「指定した内容と一致しない要素」のみで配列を作れば、その要素を削除したことになる
- **指定した内容と同じ内容の要素は全て削除される**

```js
const words = ["a", "b", "c", "d", "e", "d", "c", "b", "a"];
const result = words.filter((w) => w != "e"); // w != "e" はwがeじゃないときにtrueが返る式
console.log(result);
//> Array ["a", "b", "c", "d", "d", "c", "b", "a"]　// eが二箇所抜けている
```

### 要素の削除：最後尾からひとつだけ削除したい場合

[Array.prototype.pop()](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/pop)

- `<最後尾の要素> = <配列>.pop()`
- 最後尾の要素を取り出す。 **配列はひとつ減った状態に更新される**。
- 配列が空だった場合`undefined`が返る

```js
const arr = ["a", "b", "c", "d"];
console.log(arr.pop()); //-> "d"
console.log(arr); //-> Array ["a", "b", "c"]
```

### 要素の削除：先頭からひとつだけ削除したい場合

[Array.prototype.shift()](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/shift)

- `<先頭の要素> = <配列>.shift()`
- 先頭の要素を取り出す。 **配列はひとつ減った状態に更新される。**
- 配列が空だった場合`undefined`が返る
- shift()は **pop()より遅い** ことに注意

### 要素の削除：先頭からn個が必要で、それ以降を消したい／個数上限を設けたい場合

[Array.prototype.length](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/length)

- `<配列>.length = <個数>`
- lengthに値を代入すると配列はその個数に制限され、以降はカットされる
- すなわち`arr.length = 0`でarrは空になる

```js
const arr = ["a", "b", "c", "d"];
arr.length = 3;
console.log(arr); //-> Array ["a", "b", "c"]
```

### 配列に関する余談

#### 配列のlengthを書き換えるとどうなる？

lengthの数を増やすと増えた要素はundefinedになる

#### 使ってはいけない方法

`delete`演算子

指定した要素がundefinedになるだけで、配列の個数は減らない

### 配列をループで回す方法(for + カウンタ)

```js
const arr = ["a", "b", "c"]; //以降この行は省略
for (let i = 0; i < arr.length; i++) {
  console.log(arr[i]);
}
```

- Cから受け継ぐ「いにしえ」のスタイル。タイプ数が多くなるので敬遠されがち

### 配列をループで回す方法(for ... of)

[for ... of](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/for...of)

```js
for (const item of arr) {
  console.log(item);
}
```

- ofで各要素が取れる。シンプルでわかりやすい
- 取得される要素はインデックス順である（が、インデックス値が重要ならentriesを使ったほうがよかろう）
- 内容がundefinedでもスキップされたりはしない
- **for ... in ではないことに注意。**
  - inは要素の「インデックス値」を取る。inで書きたい場合は以下のようになる

```js
for (const i in arr) {
  console.log(arr[i]);
}
```

**取得される要素の順番は必ずしもインデックス順ではない**。詳しくは [for...in](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/for...in)

なにかと不便が多いので配列に対してfor...inを使うことはめったにない

### ループ中にインデックス値と内容を同時に取る方法(entries)

```js
for (const [index, element] of arr.entries()) {
  console.log(index, element);
}
```

通常の配列だとあまりありがたみを感じないかも。連想配列で活躍する。

### すべての要素を計算してひとつの結果（例えば合計）を出す方法

[Array.prototype.reduce()](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)

```js
const array1 = [1, 2, 3, 4];
// 0 + 1 + 2 + 3 + 4
const initialValue = 0;
const sumWithInitial = array1.reduce(
  (accumulator, currentValue) => accumulator + currentValue,
  initialValue,
);
console.log(sumWithInitial); // Expected output: 10
```

- `<配列>.reduce((<カウンタ>, <要素>)=><計算内容>, <初期値（省略可）>)`
- カウンタは通常触らない。名前も何でも良い。
- 要素は配列から取り出したもの。`total = reduce((a, item)=>a+item.value,0)`のように要素のキーを参照できる。

### 配列をもとに新しい配列を作り出す方法

[Array.prototype.map()](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/map)

```js
const array1 = [1, 4, 9, 16];
// Pass a function to map
const map1 = array1.map((x) => x * 2);
console.log(map1);
// Expected output: Array [2, 8, 18, 32]
```

### 配列からいらない要素を消すには

[Array.prototype.filter()](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)

```js
const words = ["spray", "elite", "exuberant", "destruction", "present"];
const result = words.filter((word) => word.length > 6);
console.log(result);
// Expected output: Array ["exuberant", "destruction", "present"]
```

- `Array.filter((要素)=><必要な条件>)`。条件に合う要素のみが残る。
- `ForEach`というものもあるがべつのもので代用できることがほとんどなのでほぼ使わない。

### 配列の内容を全てつなげてひとつの文字列にするには

[Array.prototype.join()](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/join)

`<結果：文字列> = <配列>.join(<区切り文字。省略した場合はカンマ「,」>)`

```js
const elements = ["Fire", "Air", "Water"];
console.log(elements.join()); //-> "Fire,Air,Water"
console.log(elements.join("")); //-> "FireAirWater"
console.log(elements.join("-")); //->"Fire-Air-Water"
```

- タグクラウドを作ったりするのによく使う
- ちなみに`Array.prototype.toString()`でもカンマ区切りの文字列になる模様…だが見通しが悪くなるのでおすすめしない

### 文字列から区切り文字で区切って配列にするには

[String.prototype.split()](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/String/split)

- `<新しい配列> = <文字列>.split([<区切り文字>[, <要素数上限>]])`
- 区切り文字に空文字を指定した場合、全ての文字が１文字(utf\-8単位)ごとに刻まれ配列に入る
- 区切り文字を指定しなかった場合、文字列がそのまま入った要素数１の配列ができる

```js
const str = "The quick brown fox jumps over the lazy dog.";
console.log(str.split(" "));
//> Array ["The", "quick", "brown", "fox", "jumps", "over", "the", "lazy", "dog."]
```

### 配列をソート（並べ替え）するには

[Array.prototype.sort()](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)

- `<ソートされた配列> = <配列>.sort()`
- `<ソートされた配列> = <配列>.sort((a, b) => { <aとbを比較する式> })`
- 返り値をどう使うか関係なく **配列はソートされた状態に更新される。(破壊的メソッド)**
- なにも指定しない場合、 **要素の内容を文字列に変換してから** ソートを行う。これは桁の違う数値をソートするときに問題になる

```js
const ar = [1, 30, 4, 21, 100000];
ar.sort();
console.log(ar); //> Array [1, 100000, 21, 30, 4]
```

数値ソートしたい場合は式を定義する必要がある。

- `> 0` a を b の後に並べる
- `< 0` a を b の前に並べる
- `=== 0` a と b の元の順序を維持する
- つまり `a-b`を返せば昇順になる。

```js
const ar = [1, 30, 4, 21, 100000];
ar.sort((a, b) => a - b);
console.log(ar); //> Array [1, 4, 21, 30, 100000]
```

## 連想配列(オブジェクト)

### そいつが連想配列がどうかを調べるには

おそらく…方法は無いのかも？　調査中

- typeofでは配列と連想配列の区別はつかない(両方object)、のうえでisArrayで配列の可能性を落とす、くらいしか。
- でも配列・文字列・連想配列の区別で困った事はいまのところない。あったら調べて追記する
- 明確に連想配列である型に`Map`がある。Mapとして宣言しておけば型チェックの問題はクリアする
  - が、Mapは発展途上なのか、まだ使いにくい…

### 連想配列(オブジェクト)の長さ（要素数）を調べる

`Object.keys(<連想配列>).length`

```js
const obj = { a: 1, b: 2, c: 3 };
console.log(Object.keys(obj).length); //-> 3
```

- `values()`の数を数えてもいいと思う

### 連想配列(オブジェクト)に指定のキーが含まれているか調べる

`Object.keys(<連想配列>).includes(<調べたい要素>)`

```js
const car = { make: "Honda", model: "Accord", year: 1998 };
console.log(Object.keys(car).includes("make")); //-> true
```

`<調べたい要素> in <連想配列>`

```js
const car = { make: "Honda", model: "Accord", year: 1998 };
console.log("make" in car); //-> true
```

`Object.hasOwn(<連想配列>, <調べたい要素>)`

```js
const car = { make: "Honda", model: "Accord", year: 1998 };
console.log(Object.hasOwn(car, "make")); //-> true
```

in演算子やhasOwn()の場合、連想配列のキーの存在の判定というよりは「オブジェクトがそのプロパティを持っているか」の判定という意味合いが強くなる。よりキーをキーとして扱いたい場合はkeys().includes()のほうが自然な気がする

### 連想配列(オブジェクト)に指定の内容(value)が含まれているか調べる

`Object.values(<連想配列>).includes(<調べたい要素>)`

```js
const obj = { a: 1, b: 2, c: 3 };
console.log(Object.values(obj).includes(2)); //-> true
```

### オブジェクトに要素を追加する

- `obj["<キー>"] = <値>`
- `obj.<キー> = <値>`
- キーが存在しなければ新しいキーが追加される。存在すれば値で更新される。

### 要素の削除：キーがわかっている場合

[delete 演算子](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/delete)

- `delete obj["<キー>"]`
- `delete obj.<キー>`

```js
const Employee = { firstname: "John", lastname: "Doe" };
console.log(Employee.firstname); //->"John"
delete Employee.firstname;
console.log(Employee.firstname); //->undefined
delete Employee["lastname"];
console.log(Employee); //->{}
```

### 要素の削除：キーがわからない／要素の内容から削除したい場合

キーに対してfor ... ofで内容をサーチする

```js
const obj = { a: 1, b: 2, c: 3 };
for (const key of Object.keys(obj)) {
  if (obj[key] == 2) {
    delete obj[key];
  }
}
console.log(obj); //-> Object { a: 1, c: 3 }
```

もっと短く

```js
const obj = { a: 1, b: 2, c: 3 };
Object.keys(obj).forEach((k) => {
  if (obj[k] == 2) delete obj[k];
});
console.log(obj); //-> Object { a: 1, c: 3 }
```

内容をサーチするだけならObject.values()で取れるが、その後deleteするにはキーを知らないといけない。

### 連想配列をループで回す

#### キーのリストを取得してfor ... ofで回す

```js
const obj = { a: 1, b: 2, c: 3 };
for (const key of Object.keys(obj)) {
  console.log(`${key}: ${obj[key]}`);
}
/*
> "a: 1"
> "b: 2"
> "c: 3"
*/
```

[for ... in](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/for...in) はおすすめしない。

- &gt; for...in 文は、キーが文字列であるオブジェクトの列挙可能プロパティすべてに対して、継承された列挙可能プロパティも含めて反復処理を行います
- 「列挙可能」プロパティってなんだ？って人は for ... inを使わないほうがいいと思う
- 連想配列というよりもオブジェクトのプロパティを調べる目的で使うときがくるかもしれない

#### キーと内容を同時に取る(entries)

```js
const obj = { a: 1, b: 2, c: 3 };
for (const [key, value] of Object.entries(obj)) {
  console.log(`${key}: ${value}`);
}
```

便利。

### 間違えやすいやつ

- 基本的にオブジェクト自身が規定のメソッドを持つことはない、と考える。つまり
  - ❌️`someObj.keys()` →　⭕ `Object.keys(someObj)`
  - ❌️`someObj.entries()` →　⭕ `Object.entries(someObj)`
  - ❌️`someObj.hasown(key)` →　⭕️ `Object.hasown(someObj, key)`
- 配列が`someArray.length()`など規定のメソッドを持つ点とは対照的。

### オブジェクトの深いネストのプロパティの存在を確認する／値を取得する

最も簡単な方法：**オプショナルチェイニング**

```js
if (jsonObj?.data?.user?.result?.timeline?.timeline?.instructions) {
  console.log("存在する！");
}
```

```js
const exists = !!jsonObj?.data?.user?.result?.timeline?.timeline?.instructions;

途中で `undefined` や `null` があってもエラーにならない
存在しなければ `undefined` が返るため判定が安全
```

値を取得したい場合も同じ

```js
const instructions =
  jsonObj?.data?.user?.result?.timeline?.timeline?.instructions;
```
