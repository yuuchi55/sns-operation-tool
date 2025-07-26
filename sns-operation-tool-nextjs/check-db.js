const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'posts.db');
const db = new Database(dbPath);

try {
  // テーブルの存在確認
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  console.log('テーブル一覧:', tables);

  // postsテーブルの内容確認
  const posts = db.prepare('SELECT * FROM posts LIMIT 5').all();
  console.log('\n投稿データ:', posts);

  // publishedステータスの投稿確認
  const publishedPosts = db.prepare("SELECT * FROM posts WHERE status = 'published'").all();
  console.log('\n公開済み投稿数:', publishedPosts.length);

} catch (error) {
  console.error('エラー:', error);
} finally {
  db.close();
}