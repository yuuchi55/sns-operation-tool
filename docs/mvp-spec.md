# MVP（最小限の実行可能製品）仕様書

## 1. 最初のリリース目標

**シンプルな投稿管理ツール**として、以下の最小限の機能を実装します。

## 2. MVP機能一覧

### 2.1 ユーザー機能
- **会員登録**
  - メールアドレス、パスワード、ユーザー名
  - メール認証（Phase 2で実装）
  
- **ログイン/ログアウト**
  - JWT認証
  - セッション管理

### 2.2 投稿管理機能
- **投稿作成**
  - テキスト（280文字まで）
  - 画像1枚（オプション）
  - 下書き保存
  
- **投稿一覧**
  - 自分の投稿履歴
  - ページネーション（10件ずつ）
  - 投稿日時表示
  
- **投稿操作**
  - 下書きの編集
  - 投稿の削除
  - Twitter/Xへの投稿

### 2.3 SNS連携（Phase 1ではTwitter/Xのみ）
- OAuth認証
- アカウント連携/解除
- 投稿時の同時投稿オプション

## 3. 画面構成

### 3.1 認証画面
```
/login    - ログイン画面
/signup   - 会員登録画面
/logout   - ログアウト処理
```

### 3.2 メイン画面
```
/         - ダッシュボード（投稿一覧）
/post/new - 新規投稿作成
/post/:id - 投稿詳細・編集
/settings - アカウント設定
```

## 4. データモデル

### Users（ユーザー）
```javascript
{
  id: UUID,
  email: string,
  username: string,
  password_hash: string,
  created_at: timestamp,
  updated_at: timestamp
}
```

### Posts（投稿）
```javascript
{
  id: UUID,
  user_id: UUID,
  content: string,
  image_url: string | null,
  status: 'draft' | 'published',
  published_at: timestamp | null,
  created_at: timestamp,
  updated_at: timestamp
}
```

### SocialAccounts（SNSアカウント）
```javascript
{
  id: UUID,
  user_id: UUID,
  platform: 'twitter' | 'instagram' | 'facebook',
  account_id: string,
  account_name: string,
  access_token: string (encrypted),
  refresh_token: string (encrypted),
  connected_at: timestamp
}
```

## 5. API エンドポイント

### 認証
- `POST /api/auth/signup` - 会員登録
- `POST /api/auth/login` - ログイン
- `POST /api/auth/logout` - ログアウト
- `GET /api/auth/me` - 現在のユーザー情報

### 投稿
- `GET /api/posts` - 投稿一覧取得
- `POST /api/posts` - 新規投稿作成
- `GET /api/posts/:id` - 投稿詳細取得
- `PUT /api/posts/:id` - 投稿更新
- `DELETE /api/posts/:id` - 投稿削除
- `POST /api/posts/:id/publish` - 投稿を公開

### SNS連携
- `GET /api/social/twitter/auth` - Twitter認証開始
- `GET /api/social/twitter/callback` - Twitter認証コールバック
- `DELETE /api/social/twitter` - Twitter連携解除

## 6. 技術的な実装方針

### セキュリティ
- パスワードはbcryptでハッシュ化
- JWTトークンの有効期限は24時間
- CORS設定で適切なオリジンのみ許可

### エラーハンドリング
- 適切なHTTPステータスコード
- エラーメッセージの標準化
- ユーザーフレンドリーなエラー表示

### パフォーマンス
- 画像はリサイズして保存（最大1MB）
- データベースインデックスの適切な設定
- N+1問題の回避

## 7. 制限事項

### MVP段階での制限
- Twitter/X連携のみ（Instagram、Facebookは後日）
- 予約投稿機能なし
- 分析機能なし
- 複数画像投稿なし
- チーム機能なし

### 技術的制限
- 同時接続数：100ユーザーまで
- 画像サイズ：5MBまで
- API呼び出し：1分間に60回まで

## 8. 次のフェーズへの準備

MVPの実装時に、以下の拡張性を考慮：
- プラグイン可能なSNS連携アーキテクチャ
- スケジューリング機能の基盤
- 分析データの収集準備
- 多言語対応の準備