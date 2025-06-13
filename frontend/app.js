// グローバル変数
let posts = [];
let editingPostId = null;

// ページ読み込み時
document.addEventListener('DOMContentLoaded', () => {
    loadPosts();
    
    // フォームのイベントリスナー
    document.getElementById('postForm').addEventListener('submit', handleSubmit);
    
    // 文字数カウンター
    document.getElementById('content').addEventListener('input', updateCharCount);
    document.getElementById('editContent').addEventListener('input', updateEditCharCount);
});

// 文字数カウント更新
function updateCharCount() {
    const content = document.getElementById('content').value;
    document.getElementById('charCount').textContent = content.length;
}

function updateEditCharCount() {
    const content = document.getElementById('editContent').value;
    document.getElementById('editCharCount').textContent = content.length;
}

// 投稿一覧を読み込み
async function loadPosts() {
    try {
        const response = await fetch('/api/posts');
        if (!response.ok) throw new Error('投稿の読み込みに失敗しました');
        
        posts = await response.json();
        displayPosts();
    } catch (error) {
        console.error('Error:', error);
        showMessage('投稿の読み込みに失敗しました', 'error');
    }
}

// 投稿を表示
function displayPosts() {
    const postsContainer = document.getElementById('posts');
    
    if (posts.length === 0) {
        postsContainer.innerHTML = `
            <div class="empty-state">
                <p>📝 まだ投稿がありません</p>
                <p>上のフォームから最初の投稿を作成しましょう！</p>
            </div>
        `;
        return;
    }
    
    postsContainer.innerHTML = posts.map(post => `
        <div class="post-item" data-id="${post.id}">
            <div class="post-content">${escapeHtml(post.content)}</div>
            <div class="post-meta">
                投稿日時: ${formatDate(post.created_at)}
                ${post.updated_at !== post.created_at ? `(更新: ${formatDate(post.updated_at)})` : ''}
            </div>
            <div class="post-actions">
                <button class="btn btn-primary" onclick="editPost(${post.id})">
                    ✏️ 編集
                </button>
                <button class="btn btn-danger" onclick="deletePost(${post.id})">
                    🗑️ 削除
                </button>
            </div>
        </div>
    `).join('');
}

// フォーム送信処理
async function handleSubmit(e) {
    e.preventDefault();
    
    const content = document.getElementById('content').value.trim();
    if (!content) {
        showMessage('投稿内容を入力してください', 'error');
        return;
    }
    
    try {
        const response = await fetch('/api/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || '投稿の作成に失敗しました');
        }
        
        const result = await response.json();
        showMessage(result.message, 'success');
        
        // フォームをクリア
        clearForm();
        
        // 投稿一覧を再読み込み
        loadPosts();
    } catch (error) {
        console.error('Error:', error);
        showMessage(error.message, 'error');
    }
}

// 投稿を編集
function editPost(id) {
    const post = posts.find(p => p.id === id);
    if (!post) return;
    
    editingPostId = id;
    document.getElementById('editContent').value = post.content;
    updateEditCharCount();
    document.getElementById('editModal').style.display = 'block';
}

// 投稿を更新
async function updatePost() {
    const content = document.getElementById('editContent').value.trim();
    if (!content) {
        showMessage('投稿内容を入力してください', 'error');
        return;
    }
    
    try {
        const response = await fetch(`/api/posts/${editingPostId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || '投稿の更新に失敗しました');
        }
        
        const result = await response.json();
        showMessage(result.message, 'success');
        
        closeModal();
        loadPosts();
    } catch (error) {
        console.error('Error:', error);
        showMessage(error.message, 'error');
    }
}

// 投稿を削除
async function deletePost(id) {
    if (!confirm('この投稿を削除してもよろしいですか？')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/posts/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || '投稿の削除に失敗しました');
        }
        
        const result = await response.json();
        showMessage(result.message, 'success');
        
        loadPosts();
    } catch (error) {
        console.error('Error:', error);
        showMessage(error.message, 'error');
    }
}

// モーダルを閉じる
function closeModal() {
    document.getElementById('editModal').style.display = 'none';
    editingPostId = null;
}

// フォームをクリア
function clearForm() {
    document.getElementById('content').value = '';
    updateCharCount();
}

// メッセージを表示
function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    // ヘッダーの後に挿入
    const header = document.querySelector('header');
    header.parentNode.insertBefore(messageDiv, header.nextSibling);
    
    // 3秒後に自動で削除
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// 日付をフォーマット
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    // 1分未満
    if (diff < 60000) {
        return 'たった今';
    }
    
    // 1時間未満
    if (diff < 3600000) {
        const minutes = Math.floor(diff / 60000);
        return `${minutes}分前`;
    }
    
    // 24時間未満
    if (diff < 86400000) {
        const hours = Math.floor(diff / 3600000);
        return `${hours}時間前`;
    }
    
    // 日付表示
    return date.toLocaleString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// HTMLエスケープ
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// モーダルの外側クリックで閉じる
window.onclick = function(event) {
    const modal = document.getElementById('editModal');
    if (event.target === modal) {
        closeModal();
    }
}