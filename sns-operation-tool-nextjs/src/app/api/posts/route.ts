import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Supabaseクライアントの初期化確認
    if (!supabase) {
      console.error('Supabase client is not initialized');
      return NextResponse.json({ 
        error: 'Database connection failed', 
        details: 'Supabase client not initialized'
      }, { status: 500 });
    }

    console.log('Attempting to fetch posts from Supabase...');
    
    const { data: posts, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Supabase error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      return NextResponse.json({ 
        error: 'Failed to fetch posts', 
        details: error.message,
        code: error.code
      }, { status: 500 });
    }
    
    console.log('Successfully fetched posts:', posts?.length || 0);
    return NextResponse.json(posts || []);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch posts', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, platform = 'twitter', scheduled_time, tags = [], media_urls = [] } = body;
    
    if (!content || content.trim() === '') {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }
    
    const { data, error } = await supabase
      .from('posts')
      .insert({
        content: content.trim(),
        platform,
        scheduled_time,
        tags,
        media_urls,
        status: scheduled_time ? 'scheduled' : 'draft'
      })
      .select();
    
    if (error) {
      console.error('Error creating post:', error);
      return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
    }
    
    return NextResponse.json(data[0], { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}