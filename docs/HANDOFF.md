# Pocket 同期完了記録

現在の作業場所と整理状況は [ENVIRONMENT.md](ENVIRONMENT.md) を参照してください。この文書内のパスは配備当時の記録です。

2026-10-18 23:12 JST時点の配備記録です。以下のGitHubコミットの内容を既存Sitesへ配備しました。

この文書とJSON記録は配備後にGitHubへ追加した資料です。下記のtree一致は配備対象コミット間の比較であり、資料追加後のmain全体との一致を意味しません。アプリ本体の変更はありません。

- 正本: https://github.com/satotka/personal-dashboard
- GitHub commit: eecb79d399c674f6ce6323c9771e362679c82844
- Sites commit: 4691230a2de3ecfdcc1f128c2c52d1946b365b74
- 両方のGit tree: 8f30b3637d41f828db40db5792ff813791f6ee68（管理対象ファイルが一致）
- Sites: Pocket — マイダッシュボード / v27 / succeeded / 本人限定
- URL: https://personal-pocket-dashboard.satotka.chatgpt.site
- 詳細: [sync-record.json](sync-record.json)

## 作業場所

配備時の実行場所はCodex Cloud環境。作業チャットはプロジェクト未所属でした。以下はその環境内の当時のパスであり、別の環境で存在することは保証されません。新しい環境ではGitHubから取得してください。

- /workspace/pocket-sync/github-main: GitHub mainを取得した正本のチェックアウト
- /workspace/pocket-sync/site-source: 既存Sitesの履歴を維持した配備用チェックアウト
- /workspace/pocket-sync/pocket-deploy.tar.gz: v27の配備成果物
- /workspace/personal-dashboard: 古いworkブランチの作業場所。保全済みで、今回の更新先ではない
- Windowsの「個人ダッシュボード」プロジェクト: 今回は変更していない

## 検証

npm test 7件成功、npm run build成功。ビルド結果はGitHubに保存済みの成果物と一致。
ビルドしたWorkerのルート応答200、News件数24時間化・炎アイコン削除・上部案内削除を確認。
Sites APIが配備成功を返し、v27のソースコミットと配備IDを照合。
ブラウザーによる表示・本番外部データ取得の検証は未実施。

## 後続の作業環境整理

正本はGitHub main。Windowsプロジェクトへの所属だけではCloudとファイル同期されない。
今後の標準作業フォルダーとチャット所属を決め、古いコピーは差分を確認してから整理する。
以降もGitHub保存とSites配備を個別に記録する。

この環境では標準Sites補助スクリプトが見つからなかったため、Gitで取得・通常pushし、公式Sites APIで配備した。
Gitネットワーク操作は追加ネットワーク権限を指定して成功した。認証情報はファイルへ保存していない。

## GitHubに保存した資料

- `docs/HANDOFF.md`: この引き継ぎ文書
- `docs/sync-record.json`: v27の配備証跡。`archive`は配備時のCloud内パスで、ダウンロードURLではありません。

配備アーカイブと一時的なGit操作用スクリプトは、GitHubに追加していません。
