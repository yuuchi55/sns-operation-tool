# Supabaseセットアップガイド

## 1. Supabaseプロジェクトの作成

1. [Supabase](https://supabase.com)にアクセスしてアカウントを作成
2. 新しいプロジェクトを作成
3. プロジェクトの設定画面から以下を取得：
   - Project URL
   - Anon Key

## 2. 環境変数の設定

`.env.local`ファイルを開いて、取得した情報を設定：

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 3. データベースのセットアップ

Supabaseダッシュボードの「SQL Editor」で、`supabase/schema.sql`の内容を実行してテーブルを作成。

## 4. アプリケーションの起動

```bash
npm run dev
```

これでSupabaseを使ったSNS運用ツールが動作します！