const express = require('express');
const router = express.Router();
const db = require('./database');

// 投稿一覧を取得
router.get('/posts', (req, res) => {
  const query = 'SELECT * FROM posts ORDER BY created_at DESC';
  
  db.all(query, [], (err, posts) => {
    if (err) {
      console.error('投稿取得エラー:', err);
      res.status(500).json({ error: '投稿の取得に失敗しました' });
    } else {
      res.json(posts);
    }
  });
});

// 新規投稿を作成
router.post('/posts', (req, res) => {
  const { content } = req.body;
  
  if (!content || content.trim() === '') {
    return res.status(400).json({ error: '投稿内容を入力してください' });
  }
  
  if (content.length > 280) {
    return res.status(400).json({ error: '投稿は280文字以内にしてください' });
  }
  
  const query = 'INSERT INTO posts (content) VALUES (?)';
  
  db.run(query, [content], function(err) {
    if (err) {
      console.error('投稿作成エラー:', err);
      res.status(500).json({ error: '投稿の作成に失敗しました' });
    } else {
      res.json({ 
        id: this.lastID, 
        content: content,
        created_at: new Date().toISOString(),
        message: '投稿を保存しました！' 
      });
    }
  });
});

// 投稿を削除
router.delete('/posts/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM posts WHERE id = ?';
  
  db.run(query, [id], function(err) {
    if (err) {
      console.error('投稿削除エラー:', err);
      res.status(500).json({ error: '投稿の削除に失敗しました' });
    } else if (this.changes === 0) {
      res.status(404).json({ error: '投稿が見つかりません' });
    } else {
      res.json({ message: '投稿を削除しました' });
    }
  });
});

// 投稿を更新
router.put('/posts/:id', (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  
  if (!content || content.trim() === '') {
    return res.status(400).json({ error: '投稿内容を入力してください' });
  }
  
  if (content.length > 280) {
    return res.status(400).json({ error: '投稿は280文字以内にしてください' });
  }
  
  const query = 'UPDATE posts SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
  
  db.run(query, [content, id], function(err) {
    if (err) {
      console.error('投稿更新エラー:', err);
      res.status(500).json({ error: '投稿の更新に失敗しました' });
    } else if (this.changes === 0) {
      res.status(404).json({ error: '投稿が見つかりません' });
    } else {
      res.json({ message: '投稿を更新しました' });
    }
  });
});

module.exports = router;