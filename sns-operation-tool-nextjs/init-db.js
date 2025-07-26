const Database = require('better-sqlite3');
const path = require('path');

// データベース接続
const dbPath = path.join(__dirname, 'posts.db');
const db = new Database(dbPath);

// テーブル作成
db.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    platform TEXT NOT NULL DEFAULT 'twitter',
    content TEXT NOT NULL,
    scheduled_time DATETIME,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'failed')),
    tags TEXT,
    media_urls TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    published_at DATETIME,
    error_message TEXT,
    -- Performance metrics
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    engagement_rate REAL DEFAULT 0
  )
`);

console.log('✅ データベースを初期化しました');

db.close();