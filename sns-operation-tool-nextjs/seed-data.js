const Database = require('better-sqlite3');
const path = require('path');

// データベース接続
const dbPath = path.join(__dirname, 'posts.db');
const db = new Database(dbPath);

// サンプル投稿データ
const samplePosts = [
  {
    content: '今日は素晴らしい天気ですね！みなさん、良い一日を！',
    platform: 'twitter',
    status: 'published',
    published_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    likes_count: 150,
    comments_count: 23,
    shares_count: 12,
    views_count: 1500
  },
  {
    content: '新商品のご紹介です。詳細はプロフィールのリンクから！',
    platform: 'instagram',
    status: 'published',
    published_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    likes_count: 320,
    comments_count: 45,
    shares_count: 28,
    views_count: 2500
  },
  {
    content: 'プログラミングの勉強を始めて1年が経ちました。継続は力なり！',
    platform: 'twitter',
    status: 'published',
    published_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    likes_count: 280,
    comments_count: 67,
    shares_count: 34,
    views_count: 3200
  },
  {
    content: '週末のイベント情報をお届けします。ぜひご参加ください！',
    platform: 'facebook',
    status: 'published',
    published_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    likes_count: 89,
    comments_count: 12,
    shares_count: 8,
    views_count: 890
  },
  {
    content: '美味しいランチを見つけました！#グルメ #ランチ',
    platform: 'instagram',
    status: 'published',
    published_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    likes_count: 567,
    comments_count: 89,
    shares_count: 45,
    views_count: 4500
  }
];

try {
  // 既存のデータをクリア
  db.prepare('DELETE FROM posts').run();
  
  // サンプルデータを挿入
  const insertStmt = db.prepare(`
    INSERT INTO posts (
      content, 
      platform, 
      status,
      published_at,
      likes_count,
      comments_count,
      shares_count,
      views_count,
      created_at,
      updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `);
  
  for (const post of samplePosts) {
    insertStmt.run(
      post.content,
      post.platform,
      post.status,
      post.published_at,
      post.likes_count,
      post.comments_count,
      post.shares_count,
      post.views_count
    );
  }
  
  console.log(`✅ サンプルデータを${samplePosts.length}件投入しました`);
  
  // 投入されたデータを確認
  const posts = db.prepare('SELECT * FROM posts').all();
  console.log('\n投入されたデータ:');
  posts.forEach(post => {
    console.log(`- ${post.platform}: ${post.content.substring(0, 30)}... (いいね: ${post.likes_count})`);
  });
  
} catch (error) {
  console.error('❌ エラーが発生しました:', error);
} finally {
  db.close();
}