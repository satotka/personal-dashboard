# 作業環境と整理状況

## 正本と公開先

- 正本: https://github.com/satotka/personal-dashboard の `main`
- 公開先: https://personal-pocket-dashboard.satotka.chatgpt.site
- SitesのIDとR2設定: `.openai/hosting.json`
- 配備記録: [sync-record.json](sync-record.json)
- 2026-10-18の配備時の引き継ぎ: [HANDOFF.md](HANDOFF.md)

GitHubへの保存とSitesへの配備は別の操作です。資料のみの更新ではアプリの再配備は不要です。
プロジェクトへのチャット所属はファイル同期を意味しません。

## Cloud側：整理済み

2026-10-18に、この作業で使用したCloud環境を次の構成へ整理しました。
これらは当該環境内のパスです。別のCloud環境を使う場合は、GitHubから取得して確認してください。

| パス | 用途 |
| --- | --- |
| `/workspace/personal-dashboard` | 通常の編集先。GitHub `main` を追跡 |
| `/workspace/pocket-sync/github-main` | 上記へのシンボリックリンク。過去のパス参照用で、別コピーではない |
| `/workspace/pocket-sync/site-source` | Sitesリポジトリの配備用チェックアウト。アプリ編集の正本にしない |
| `/workspace/archive/personal-dashboard-before-sync-20261018` | 旧 `work` ブランチの保全コピー。通常の編集には使わない |
| `/workspace/pocket-sync` | 配備成果物・当時の作業記録・補助ツール |

退避した旧コピーのHEADは `bac4038b2aef2983b4f0f198be38b7ac82ef4d36`。
未コミット・未追跡・無視対象ファイルがないことと、HEADがGitHub mainの祖先であることを確認しました。
元のGit履歴も含めて保全し、削除はしていません。

通常の作業は `/workspace/personal-dashboard` で開始し、`git status` とリモートを確認してから `git fetch origin main` を実行します。
差分や独自コミットがある場合は保全してから統合してください。`reset --hard` や `clean` で整理しないでください。

## Windows側：未実施

登録されたCodexプロジェクトは「個人ダッシュボード」です。
登録先: `C:\Users\takaa\OneDrive\Documents\ChatGPT\個人ダッシュボード`

このCloudチャットにはWindowsファイルを読み書きする実行機能がなく、Windows側の現在の内容や未保存変更は未確認です。
Windowsで作業を完了するには、上記プロジェクトを開き、実行場所をローカルにします。
Cloud環境を選び直しても、Windowsのフォルダーを直接整理することにはなりません。

### Windowsでの作業手順

1. 対象フォルダーと親フォルダーの `AGENTS.md`、適用される作業指示を確認する。
2. プロジェクト直下と配下のGitリポジトリを調査する。過去の履歴には `dashboard-main`、`site-checkout`、`github-main` が登場するが、存在・内容は現地で再確認する。
3. 各コピーのorigin、ブランチ、HEAD、未コミット・未追跡・無視対象ファイル、mainにないコミットを確認する。秘密情報の値は表示しない。
4. プロジェクト直下をGitHub正本の標準作業場所にする。直下が正しいリポジトリで更新可能なら、既存変更を保全したうえでfast-forwardする。
5. 直下が空の親リポジトリや複数コピーの入れ物なら、隣接する一時フォルダーにGitHub mainをcloneし、内容・Site IDを確認する。既存フォルダー全体を上書きしない別名の兄弟フォルダーへ退避してから、確認済みcloneを元のプロジェクトパスへ配置する。Git以外のファイルや各種設定も旧フォルダーに保全する。
6. 進行中の作業や開いているプロセスに影響する場合は、状態を確認してから切り替える。原本・退避コピーを削除せず、OneDrive等による移動失敗があればその状態を記録する。
7. 元の登録パスがGitHub mainの作業コピーになったことを確認する。Sites用コピーが必要なら通常編集用とは用途を分ける。
8. GitHub mainとの一致、未保存変更の保全先、標準作業場所を報告する。この文書のWindows欄は実作業後にのみ完了へ更新する。

### ローカルチャットへの引き継ぎ依頼

> 個人ダッシュボードのWindows側整理を実行してください。GitHub `satotka/personal-dashboard` のmainを正本とし、まず最新の `docs/ENVIRONMENT.md` を読んでください。Cloud側の整理とSites v27への反映は完了済みです。Windows側だけ未実施です。登録済みプロジェクトのパスを維持し、現在のファイル・各Git履歴・未保存変更を調査してから、古いコピーを削除せず退避し、プロジェクト直下をGitHub mainの標準作業場所に揃えてください。退避場所と検証結果を報告し、環境記録を更新してください。
