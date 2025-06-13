#!/bin/bash

# SNS運用ツールをGitリポジトリ化するスクリプト

echo "🚀 SNS運用ツールのGitリポジトリをセットアップします..."

# ディレクトリに移動
cd "/mnt/c/Users/ad-su/01プログラミング/02保存先/sns-operation-tool"

# Gitリポジトリを初期化
git init

# .gitignoreファイルを作成（ルートディレクトリ用）
cat > .gitignore << EOF
# Dependencies
node_modules/
*/node_modules/

# Database
*.db
*.db-journal
*.sqlite

# Logs
*.log
logs/
npm-debug.log*

# Environment variables
.env
.env.local
.env.*.local

# IDE files
.vscode/
.idea/
*.swp
*.swo
*~

# OS files
.DS_Store
Thumbs.db

# Temporary files
*.tmp
*.temp
.cache/

# Build files
dist/
build/
EOF

# 初回コミット
git add .
git commit -m "初回コミット: SNS運用ツール（シンプル版）

- バックエンド: Express + SQLite
- フロントエンド: HTML/CSS/JavaScript
- 基本的な投稿管理機能（作成・編集・削除）
- レスポンシブデザイン対応

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"

echo "✅ Gitリポジトリの初期化が完了しました！"
echo ""
echo "📝 次のステップ:"
echo "1. GitHubでリポジトリを作成"
echo "2. 以下のコマンドでリモートリポジトリを追加:"
echo "   git remote add origin [your-github-repo-url]"
echo "3. git push -u origin main"