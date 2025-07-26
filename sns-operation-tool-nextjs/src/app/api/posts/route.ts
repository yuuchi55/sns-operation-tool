import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';

export async function GET() {
  try {
    const db = getDatabase();
    const posts = db.prepare('SELECT * FROM posts ORDER BY created_at DESC').all();
    
    return NextResponse.json(posts || []);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, platform = 'twitter', scheduled_time, tags = [], media_urls = [] } = body;
    
    if (!content || content.trim() === '') {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }
    
    const db = getDatabase();
    const stmt = db.prepare(`
      INSERT INTO posts (
        content, 
        platform, 
        scheduled_time, 
        tags, 
        media_urls, 
        status,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `);
    
    const result = stmt.run(
      content,
      platform,
      scheduled_time,
      JSON.stringify(tags),
      JSON.stringify(media_urls),
      scheduled_time ? 'scheduled' : 'draft'
    );
    
    const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(result.lastInsertRowid);
    
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}