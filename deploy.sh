#!/bin/bash

# エラーが発生したら停止
set -e

echo "🚀 デプロイプロセスを開始します..."

# 1. ソースコードをmainブランチにプッシュ
echo "📦 ソースコードをGitHubにプッシュしています..."
# 初回プッシュ用（認証が必要な場合があります）
git push -u origin main || echo "⚠️ プッシュに失敗しました。認証情報が必要な可能性があります。後ほど手動で 'git push -u origin main' を実行してください。"

# 2. フロントエンドのビルド
echo "🏗️ フロントエンドをビルドしています (Static Export)..."
cd frontend
# 依存関係インストール（念の為）
npm install
# ビルド実行 (output: export)
npm run build

# 3. GitHub Pages用設定
echo "⚙️ GitHub Pages用の設定ファイルを作成中..."
# .nojekyll ファイルを作成（_next フォルダなどが無視されないようにする）
touch out/.nojekyll

# 4. gh-pagesブランチへデプロイ
echo "🚀 GitHub Pagesへデプロイしています..."
# npxを使ってgh-pagesパッケージを一時利用してデプロイ
# -d out: outディレクトリをデプロイ
# -b gh-pages: gh-pagesブランチにプッシュ
# --dotfiles: dotfiles (.nojekyll) を含める
npx --yes gh-pages -d out -b gh-pages --dotfiles

echo "✅ デプロイ完了！"
echo "🌐 URL: https://aoyama-eiya.github.io/med-crm/"
echo "※ 反映まで数分かかる場合があります。"
echo "※ GitHubリポジトリのSettings > Pages で Source が 'gh-pages' ブランチになっていることを確認してください。"
