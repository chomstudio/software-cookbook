# YAML 逆引きマニュアル

---

- [YAML](#yaml)
  - [概要](#概要)
  - [チートシート](#チートシート)
- [言語別利用法](#言語別利用法)
  - [Python](#python)
  - [node.js](#nodejs)

---

## YAML

### 概要

- YAML Ain't Mark\-up Language <https://yaml.org/>
- 読みやすくて編集しやすいイケてるデータ記述テキストフォーマット

### チートシート

```yaml
# コメント行は # を先頭に入れる。文末でもOK
# ラベル -------------------------------
# 英数字、ハイフン、アンダーバー、ドット
label: value
label2: value
kebab-case: kebab-case
camelCase: camelCase
PascalCase: PascalCase
snake_case: snake_case
UPPER_SNAKE_CASE: CONST_VALUE
dot.case: file.name.example

# 数字のみ
1: 1

# スペースを含んだラベル
label can contains space: spaced value

# 日本語ラベル
日本語のラベル名: 日本語テキスト

# ラベル名なし
# yamlの仕様としては可能だが、
# 言語の実装によってはエラーになる
# : null

# 文字列(一行) --------------------------
# 文字列中にスペースも入れられる。
# 前後のスペースはカットされる。
string: this is yaml

# スペースを含みたい場合はクォートで挟む
# ラベル名に空白を入れられる
string-with-space: " space contained value   "

# 空文字
empty_string: ""

# エスケープ
escaped_char: \"

# クオート内の # はコメントとして無効
in_quote: "You are #1"

# シングルクオートで囲めば " も入れられる
single_quote: '"Hello"'

# 数値 ---------------------------------
number_int: 1
number_float: 3.1415926
canonical: 1.23015e+3
hexadecimal: 0xC # 12
negative infinity: -.inf # null扱い
not a number: .nan # null扱い

# Bool値  ------------------------------
bool_true: true
bool_true1: TRUE #上と同値
bool_false: false
bool_false2: FALSE #上と同値

# null  --------------------------------
null_item: null
empty_item: # これもnull扱い

# リスト --------------------------------
# 先頭に `-` とスペース
# `-` の前のインデントは自由
# ただし深さを揃えること
number_list: # 数値のリスト
  - 101
  - 102.25
  - 103.5

# 文字列のリスト
string_list:
  - first
  - "second"
  - "third"

# 数値と文字の混在
# 少なくともyaml上では可能。
# 読み取れるかどうかは言語側の実装による
list:
  - 1
  - a

# []でリストの横書きもできる
inline_list: [a, b, c]

# リストのリスト
table:
  - [name, hr, avg]
  - [Mark McGwire, 65, 0.278]
  - [Sammy Sosa, 63, 0.288]

# 文字列(複数行) ------------------------
# インデントでひとつの塊と認識される。
# 内容にはインデントは入らない。
#
# 行末コメントも内容に入ってしまうため
# 次の項目まではコメントを入れられない。
#
# 改行の扱いはオプションで変わる
# なし: 行末にスペース（英文向き）
#      ＋文末に改行コードなし
# ">": 行末にスペース（英文向き）
#      ＋文末に改行コード
# "|": 行末に改行コード
#      ＋文末に改行コード
# "|+": 行末に改行コード
#      ＋文末に空行の数だけ改行コード
# "|-": 行末に改行コード
#      ＋文末に改行コードなし
# どのオプションを指定しても、
# 文中の空行は改行コードになる

# "1行目\n2行目 3行目"
multi-line-string1: 1行目

  2行目
  3行目

# "1行目\n2行目3行目"
multi-line-string2: |-
  1行目

  2行目
  3行目

# "1行目\n\n2行目\n3行目\n\n"
multi-line-string3: |+
  1行目

  2行目
  3行目

# 改行を含まない複数行（和文向き）
# 普通の文字列の分かち書き。
multi-line-strings-no-line: "\
  1行目\
  2行目\
  3行目"

# リストでもオプションは使える
multi-line-strings-list:
  # "1-1\n1-2\n1-3\n\n"
  - |+
    1-1
    1-2
    1-3
  # "2-1 2-2 2-3"
  - 2-1
    2-2
    2-3

# オブジェクト（構造体） ------------------
object: # オブジェクト（構造体）の例
  name: item
  value: 300
  list:
    - first
    - second
    - third

# {} を使ってもOK
object2: { name: item, value: 300, list: [first, second, third] }

# ドキュメント区切り
# --- で区切ると別ドキュメントとして認識
# 1ファイルに複数オブジェクトを格納可能
# 下記の場合でも二重定義にならない
a: 1
---
a: 2

# 変数 -----------------------------------
# &<変数名> <値>: 変数を定義
# *<変数名>: 変数を呼び出す
# 値が「使われている」ときにしか定義できない
# （文頭で&から書き出してもエラーになる）
label1: &V value
label2: *V
list1: &L
  - a
  - b
  - c
list2: *L

# 型宣言 ---------------------------------
# !!<型> で型を宣言できる
# 型はオリジナルの型名を設定でき、
# プログラム上で利用できる
num_to_str: !!str 1 # 文字列の"1"

# 集合のように「順番が無い」ことが特別な意味を持つ場合
# ? を使って明示的に「順番がない」状態を作ることができる
set: !!set
  ? red
  ? green
  ? yellow

# 他に % = ディレクティブ記号、 ! = タグ記号 などがあるが
# 殆ど使われない
```

## 言語別利用法

### Python

yaml ライブラリを使う。

```python
import sys
from pprint import pp

import yaml

try:
    # yamlはUnicodeでのみ動く。この場合utf-8を明示
    with open("test.yaml", encoding="utf-8") as f:
        docs = list(yaml.safe_load_all(f))
except yaml.YAMLError as error:
    print(f"Error parsing YAML file: {error}")
    sys.exit(1)

for doc in docs:
    pp(doc, indent=2, width=40)
```

### node.js

js-yaml ライブラリを使う。

```Javascript
import fs from "fs";
import yaml from "js-yaml";

const text = fs.readFileSync("data.yaml", "utf8");
const documents = yaml.loadAll(text);

for (const doc of documents) {
  console.log(doc);
}
```
