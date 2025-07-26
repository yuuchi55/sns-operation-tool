import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { id: postId } = await params;
    const { content, platform, scheduled_time, tags, media_urls, status } = body;
    
    if (!content || content.trim() === '') {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }
    
    const db = getDatabase();
    const setClause: string[] = ['content = ?', 'updated_at = datetime("now")'];
    const values: any[] = [content];
    
    if (platform !== undefined) {
      setClause.push('platform = ?');
      values.push(platform);
    }
    if (scheduled_time !== undefined) {
      setClause.push('scheduled_time = ?');
      values.push(scheduled_time);
    }
    if (tags !== undefined) {
      setClause.push('tags = ?');
      values.push(JSON.stringify(tags));
    }
    if (media_urls !== undefined) {
      setClause.push('media_urls = ?');
      values.push(JSON.stringify(media_urls));
    }
    if (status !== undefined) {
      setClause.push('status = ?');
      values.push(status);
    }
    
    values.push(postId);
    
    const updateStmt = db.prepare(`
      UPDATE posts 
      SET ${setClause.join(', ')}
      WHERE id = ?
    `);
    
    const result = updateStmt.run(...values);
    
    if (result.changes === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(postId);
    
    return NextResponse.json(post);
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params;
    const db = getDatabase();
    
    const existingPost = db.prepare('SELECT id FROM posts WHERE id = ?').get(postId);
    
    if (!existingPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    const deleteStmt = db.prepare('DELETE FROM posts WHERE id = ?');
    deleteStmt.run(postId);
    
    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}