'use client';

import { useState, useEffect } from 'react';

interface Post {
  id: number;
  content: string;
  created_at: string;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setError(null);
      const response = await fetch('/api/posts');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('投稿の読み込みに失敗しました:', error);
      setError('投稿の読み込みに失敗しました。しばらく経ってから再度お試しください。');
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      if (response.ok) {
        setContent('');
        loadPosts();
      }
    } catch (error) {
      console.error('投稿の保存に失敗しました:', error);
    }
  };

  const deletePost = async (id: number) => {
    if (!confirm('この投稿を削除しますか？')) return;

    try {
      const response = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
      if (response.ok) {
        loadPosts();
      }
    } catch (error) {
      console.error('投稿の削除に失敗しました:', error);
    }
  };

  const openEditModal = (post: Post) => {
    setEditingId(post.id);
    setEditContent(post.content);
    setIsModalOpen(true);
  };

  const updatePost = async () => {
    if (!editingId || !editContent.trim()) return;

    try {
      const response = await fetch(`/api/posts/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editContent }),
      });

      if (response.ok) {
        setIsModalOpen(false);
        setEditingId(null);
        setEditContent('');
        loadPosts();
      }
    } catch (error) {
      console.error('投稿の更新に失敗しました:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ja-JP');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-4xl p-4">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">📝 SNS投稿管理ツール</h1>
          <p className="text-gray-600">シンプルな投稿下書き管理</p>
          <nav className="mt-4">
            <a 
              href="/analytics" 
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              📊 分析ダッシュボード
            </a>
          </nav>
        </header>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
            <p>{error}</p>
          </div>
        )}

        <main>
          <section className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">新規投稿</h2>
            <form onSubmit={handleSubmit}>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="投稿内容を入力（最大280文字）"
                maxLength={280}
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:border-blue-500 text-black font-semibold placeholder:text-gray-500 placeholder:opacity-100"
                style={{ color: '#000', fontWeight: 600, opacity: 1, WebkitTextFillColor: '#000' } as React.CSSProperties}
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-600">
                  {content.length} / 280文字
                </span>
                <div className="space-x-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    💾 保存
                  </button>
                  <button
                    type="button"
                    onClick={() => setContent('')}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    🗑️ クリア
                  </button>
                </div>
              </div>
            </form>
          </section>

          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">投稿履歴</h2>
            <div className="space-y-4">
              {posts.length === 0 ? (
                <p className="text-gray-500 text-center py-8">投稿がありません</p>
              ) : (
                posts.map((post) => (
                  <div
                    key={post.id}
                    className="border border-gray-200 rounded-md p-4 hover:bg-gray-50"
                  >
                    <p className="whitespace-pre-wrap mb-2">{post.content}</p>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500" suppressHydrationWarning>
                        {formatDate(post.created_at)}
                      </span>
                      <div className="space-x-2">
                        <button
                          onClick={() => openEditModal(post)}
                          className="text-blue-500 hover:text-blue-600"
                        >
                          ✏️ 編集
                        </button>
                        <button
                          onClick={() => deletePost(post.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          🗑️ 削除
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </main>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">投稿を編集</h3>
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={4}
              maxLength={280}
              className="w-full p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:border-blue-500 text-gray-900 font-medium"
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-600">
                {editContent.length} / 280文字
              </span>
              <div className="space-x-2">
                <button
                  onClick={updatePost}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  更新
                </button>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingId(null);
                    setEditContent('');
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  キャンセル
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}