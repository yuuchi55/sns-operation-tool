# SNS運用ツール

個人事業主向けのシンプルなSNS運用管理ツール

## 🚀 機能

### 現在実装済み（MVP）
- ユーザー認証（登録・ログイン）
- SNSアカウント連携
- 投稿の作成・管理
- 投稿履歴の確認

### 今後の実装予定
- 予約投稿機能
- 分析ダッシュボード
- AI投稿アシスタント

## 📋 必要な環境

- Node.js 16.x以上
- npm または yarn
- PostgreSQL（本番環境）/ SQLite（開発環境）

## 🛠️ セットアップ

### 1. リポジトリのクローン
```bash
git clone [repository-url]
cd sns-operation-tool
```

### 2. バックエンドのセットアップ
```bash
cd backend
npm install
cp .env.example .env
# .envファイルを編集して必要な環境変数を設定
npm run dev
```

### 3. フロントエンドのセットアップ
```bash
cd frontend
npm install
npm start
```

### 4. アクセス
- フロントエンド: http://localhost:3000
- バックエンドAPI: http://localhost:5000

## 📁 プロジェクト構造

```
sns-operation-tool/
├── backend/               # バックエンドAPI
│   ├── src/
│   │   ├── controllers/   # APIコントローラー
│   │   ├── models/        # データモデル
│   │   ├── routes/        # APIルート
│   │   ├── middlewares/   # ミドルウェア
│   │   └── utils/         # ユーティリティ
│   ├── config/            # 設定ファイル
│   └── tests/             # テスト
├── frontend/              # フロントエンド
│   ├── public/            # 静的ファイル
│   └── src/
│       ├── components/    # Reactコンポーネント
│       ├── pages/         # ページコンポーネント
│       ├── hooks/         # カスタムフック
│       ├── utils/         # ユーティリティ
│       └── styles/        # スタイルファイル
├── docs/                  # ドキュメント
├── scripts/               # 各種スクリプト
└── requirements.md        # 要件定義書
```

## 🧪 テスト実行

```bash
# バックエンドのテスト
cd backend
npm test

# フロントエンドのテスト
cd frontend
npm test
```

## 📝 API仕様

詳細なAPI仕様は `/docs/api.md` を参照してください。

## 🤝 コントリビューション

1. このリポジトリをフォーク
2. 新しいブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。