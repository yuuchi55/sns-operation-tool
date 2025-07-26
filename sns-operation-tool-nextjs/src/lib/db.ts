import Database from 'better-sqlite3';
import path from 'path';

// グローバル変数でデータベースインスタンスを保持
let db: Database.Database | null = null;

export function getDatabase(): Database.Database {
  if (!db) {
    try {
      // Vercel環境では一時的なメモリ内データベースを使用
      if (process.env.VERCEL) {
        console.log('Using in-memory database for Vercel environment');
        db = new Database(':memory:');
      } else {
        // ローカル開発環境では通常のファイルベースのデータベース
        const dbPath = path.join(process.cwd(), 'posts.db');
        db = new Database(dbPath);
      }
      
      // テーブルの初期化
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
      
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Failed to initialize database:', error);
      // フォールバック: メモリ内データベースを使用
      db = new Database(':memory:');
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
    }
  }
  
  return db;
}