# Git 逆引きマニュアル

最終更新日: 2026-10-17

---

- [リポジトリ](#リポジトリ)
  - [GitHub上のリポジトリ名を変更するには](#github上のリポジトリ名を変更するには)

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
