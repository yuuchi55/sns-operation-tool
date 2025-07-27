# 📝 SNS運用管理ツール

Next.jsとSupabaseを使用したシンプルなSNS投稿管理・分析ツールです。

## ✨ 機能

- 📝 **投稿管理**: Twitter/Instagram/Facebook向けの投稿作成・編集・削除
- 📊 **分析ダッシュボード**: エンゲージメント指標の可視化
- 🎯 **プラットフォーム別分析**: 各SNSの投稿パフォーマンス比較
- ⏰ **時間帯別分析**: 最適な投稿時間の特定

## 🚀 デプロイ方法

### 1. Supabaseプロジェクトの作成

1. [Supabase](https://app.supabase.com) でアカウント作成
2. 新しいプロジェクトを作成
3. `supabase/schema.sql` のSQLを実行してテーブル作成

### 2. 環境変数の設定

`.env.example` をコピーして `.env.local` を作成:

```bash
cp .env.example .env.local
```

Supabaseの設定値を入力:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Vercelでのデプロイ

#### GitHubから自動デプロイ
1. [Vercel](https://vercel.com) でGitHubリポジトリを連携
2. 環境変数を設定（上記と同じ値）
3. 自動デプロイ完了

#### 手動デプロイ
```bash
npm install -g vercel
vercel --prod
```

## 🛠️ 開発環境のセットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev
```

http://localhost:3000 でアプリケーションが起動します。

## 📁 プロジェクト構造

```
├── src/
│   ├── app/
│   │   ├── page.tsx          # メイン投稿管理ページ
│   │   ├── analytics/        # 分析ダッシュボード
│   │   └── api/              # API エンドポイント
│   └── lib/
│       ├── supabase.ts       # Supabaseクライアント
│       └── db.ts             # データベース操作
├── supabase/
│   └── schema.sql            # データベーススキーマ
└── vercel.json               # Vercel設定
```

## 🔧 技術スタック

- **フロントエンド**: Next.js 15, React 19, TypeScript
- **スタイリング**: Tailwind CSS
- **データベース**: Supabase (PostgreSQL)
- **チャート**: Recharts
- **デプロイ**: Vercel

## 📊 データベーススキーマ

主要テーブル: `posts`
- 投稿内容、プラットフォーム、スケジュール
- エンゲージメント指標（いいね、コメント、シェア、ビュー）
- 自動計算されるエンゲージメント率

## 🤝 コントリビューション

1. フォークして feature ブランチ作成
2. 変更をコミット
3. プルリクエスト作成

## 📄 ライセンス

MIT License
