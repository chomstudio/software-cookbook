# Git 逆引きマニュアル

最終更新日: 2026-10-17

---

- [リポジトリ](#リポジトリ)
  - [GitHub上のリポジトリ名を変更するには](#github上のリポジトリ名を変更するには)
  - [CodexによるGit所有者の不一致エラー](#codexによるgit所有者の不一致エラー)
  - [キャッシュの削除](#キャッシュの削除)
- [gitの設定](#gitの設定)
  - [共通設定ファイルの場所](#共通設定ファイルの場所)
  - [.gitignoreの環境共通設定](#gitignoreの環境共通設定)
  - [よく使われる gitignore 設定](#よく使われる-gitignore-設定)

---

## リポジトリ

### GitHub上のリポジトリ名を変更するには

1. GitHubで対象リポジトリを開く。
2. `Settings`＞`General` の `Repository name` に新しい名前を入力する。
3. `Rename` を選ぶ。
4. ローカルリポジトリでリモートURLを新しい名前へ変更する。

```console
git remote set-url origin https://github.com/OWNER/NEW-REPOSITORY.git
git remote -v
```

SSH接続の場合は、次の形式にする。

```console
git remote set-url origin git@github.com:OWNER/NEW-REPOSITORY.git
git remote -v
```

- GitHubでは古いURLから新しいURLへ転送されるが、混乱を避けるためローカルのURLも更新する。
- ローカルのフォルダー名は自動では変わらない。必要なら、Gitを使用するアプリやターミナルでフォルダーを開いていない状態で、通常のフォルダー名変更を行う。Gitの履歴には影響しない。
- `git remote rename origin 新しい名前` は `origin` というリモートの呼び名を変更するコマンドであり、GitHub上のリポジトリ名は変更しない。
- GitHub Pagesを使用している場合は、リポジトリ名を含むURLや公開設定への影響も確認する。
- 変更前の名前で新しいリポジトリを作ると、古いURLからの転送は機能しなくなる。

参考: [GitHub Docs「Renaming a repository」](https://docs.github.com/en/repositories/creating-and-managing-repositories/renaming-a-repository)

参考: [GitHub Docs「Managing remote repositories」](https://docs.github.com/en/get-started/git-basics/managing-remote-repositories?platform=windows)

### CodexによるGit所有者の不一致エラー

このリポジトリは通常ユーザー `<PC名>\<ログインユーザー名>` が所有していますが、Codex内のコマンドは隔離ユーザー `<PC名>\codexsandboxoffline` として実行されます。Gitのセキュリティ機能が、別ユーザー所有のリポジトリを安全ではない可能性があると判定しています。

このリポジトリを信頼する場合は、次の設定で解消できます。

```cmd
git config --global --add safe.directory <プロジェクトフォルダパス>
```

### キャッシュの削除

pushされてほしくないファイルがステージングされてしまった場合、以下のコマンドで解消できる。

```cmd
git rm <ファイル名> --cached
```

フォルダの場合は `-r` オプションが必要。

```cmd
git rm -r <フォルダ名> --cached
```

すでにコミットしてしまったファイルは上記コマンドでも取り消せない。たとえキャッシュから消えた状態のコミットで上書きしても、その気になれば消されたファイルを履歴から復活させることは可能だからだ。
APIアクセストークンやユーザー名・パスワードが直接書かれたような重大なファイルをコミットしてしまった場合は、別の方法で削除する。→[リポジトリからの機微なデータの削除](https://docs.github.com/ja/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)

## gitの設定

### 共通設定ファイルの場所

gitの共通設定ファイルは、[gitのマニュアル](https://git-scm.com/docs/gitignore/2.22.1#_description)によると、`~/.config/git/config` である。
Windows11であれば `C:\Users\<ユーザー名>\.config\git\config` となる。
ここにファイルがないと、 `C:\Users\<ユーザー名>\.gitconfig` が読まれるようだ。

直接ファイルを書き換えることもできるが、コマンドでひとつずつ設定することもできる。

例：

```cmd
git config --global core.excludesfile ~/.gitignore_global
```

現在の設定（設定が正しく読まれているか）を確認するには以下。

```cmd
git config -l
```

### .gitignoreの環境共通設定

`.gitignore` はそれ自体がリポジトリに内包される。
つまりリポジトリ公開時は `.gitignore` も公開される。

公開時のことも考えると、プロジェクトの内容に直接関係ない、個人的な動作環境・開発環境に関連する設定は `.gitignore` に書かないほうが良さそうだ。

そのPC内におけるすべてのgitに共通の `.gitignore` を書く方法がある。
デフォルトでは、`~/.config/git/ignore` に記述する。→[gitのマニュアル](https://git-scm.com/docs/gitignore/2.22.1#_description)
Windows11であれば `C:\Users\<ユーザー名>\.config\git\ignore` となる。

`.config\git\ignore` に書いておくとよいもの

- OSの都合によるもの(`.DS_Store`, `Thumbs.db`, `Desktop.ini` etc)
- エディタの設定フォルダ(`.vscode` etc)
- lintの設定フォルダ(`.ruff_cache/`)
- AIエージェントへの指示書(`AGENTS.md`, `prompt.md` etc)
  - ただしそのプロジェクト自体がAIエージェントの利用を前提としている場合を除く

なお、別のパスを指定することもできる。その場合、慣例的によく使われるのは `.gitignore_global` である。

```cmd
git config --global core.excludesfile ~/.gitignore_global
```

### よく使われる gitignore 設定

#### Globalむけ

```text
# OS
.DS_Store
Thumbs.db
Desktop.ini

# Editors / IDE / Lint
.vscode/
.idea/
.ruff_cache/

# Environment / secrets
.env
.env.*
!.env.example
```

#### プロジェクトむけ

```text
# Logs
*.log
logs/

# Temporary files
*.tmp
*.temp
*.swp
*.swo

# Python
__pycache__/
*.py[cod]
*$py.class
.venv/
venv/
env/
.pytest_cache/
.mypy_cache/
.pyright/
.coverage
.coverage.*
htmlcov/
dist/
build/
*.egg-info/
.eggs/

# Node.js
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
.npm/
.yarn/cache/
.pnpm-store/
coverage/

# Common build outputs
dist/
build/
out/

# Framework caches
.next/
.nuxt/
.svelte-kit/
.vite/
.cache/
```
