# Git 逆引きマニュアル

最終更新日: 2026-10-17

---

- [リポジトリ](#リポジトリ)
  - [GitHub上のリポジトリ名を変更するには](#github上のリポジトリ名を変更するには)
  - [CodexによるGit所有者の不一致エラー](#codexによるgit所有者の不一致エラー)
- [.gitignore](#gitignore)
  - [.gitignore_globalについて](#gitignore_globalについて)
  - [よく使われる gitignore 設定](#よく使われる-gitignore-設定)
  - [Globalむけ](#globalむけ)
  - [プロジェクトむけ](#プロジェクトむけ)

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

## .gitignore

### .gitignore_globalについて

`.gitignore` はそれ自体がリポジトリに内包される。
つまりリポジトリ公開時は `.gitignore` も公開される。

公開時のことも考えると、プロジェクトの内容に直接関係ない、個人的な動作環境・開発環境に関連する設定は `.gitignore` に書かないほうが良さそうだ。

そのためには `.gitignore_global` を利用する。
これはそのPC内におけるすべてのgitに共通の `.gitignore` である。

まず `<ユーザーフォルダ>/.gitconfig` を編集する。

```ini
[core]
  excludesfile = .gitignore_global
```

その後 `<ユーザーフォルダ>/.gitignore_global` を作成する。

あとは通常の `.gitignore` と同じように除外対象を書き込む。

`.gitignore_global` に書いておくとよいもの

- OSの都合によるもの(`.DS_Store`, `Thumbs.db`, `Desktop.ini` etc)
- エディタの設定フォルダ(`.vscode` etc)
- lintの設定フォルダ(`.ruff_cache/`)
- AIエージェントへの指示書(`AGENTS.md`, `prompt.md` etc)
  - ただしそのプロジェクト自体がAIエージェントの利用を前提としている場合を除く

### よく使われる gitignore 設定

### Globalむけ

```text
# OS
.DS_Store
Thumbs.db
Desktop.ini

# Editors / IDE
.vscode/
.idea/

# Environment / secrets
.env
.env.*
!.env.example
```

### プロジェクトむけ

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
