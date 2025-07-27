import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    // サンプルデータ
    const samplePosts = [
      {
        platform: 'twitter',
        content: '今日は素晴らしい天気ですね！みなさん、良い一日を！',
        status: 'published',
        published_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3日前
        likes_count: 150,
        comments_count: 23,
        shares_count: 12,
        views_count: 1500
      },
      {
        platform: 'instagram',
        content: '新商品のご紹介です。詳細はプロフィールのリンクから！',
        status: 'published',
        published_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2日前
        likes_count: 320,
        comments_count: 45,
        shares_count: 28,
        views_count: 2500
      },
      {
        platform: 'twitter',
        content: 'プログラミングの勉強を始めて1年が経ちました。継続は力なり！',
        status: 'published',
        published_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4日前
        likes_count: 280,
        comments_count: 67,
        shares_count: 34,
        views_count: 3200
      },
      {
        platform: 'facebook',
        content: '週末のイベント情報をお届けします。ぜひご参加ください！',
        status: 'published',
        published_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5日前
        likes_count: 89,
        comments_count: 12,
        shares_count: 8,
        views_count: 890
      },
      {
        platform: 'instagram',
        content: '美味しいランチを見つけました！#グルメ #ランチ',
        status: 'published',
        published_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6日前
        likes_count: 567,
        comments_count: 89,
        shares_count: 45,
        views_count: 4500
      }
    ];
    
    // 既存のデータをクリア（注意：本番環境では慎重に）
    const { error: deleteError } = await supabase
      .from('posts')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // 全削除
    
    if (deleteError) {
      console.error('Error clearing posts:', deleteError);
    }
    
    // サンプルデータを挿入
    const { data, error } = await supabase
      .from('posts')
      .insert(samplePosts)
      .select();
    
    if (error) {
      console.error('Error seeding posts:', error);
      return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 });
    }
    
    return NextResponse.json({
      message: 'Database seeded successfully',
      inserted: data?.length || 0,
      posts: data
    });
    
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 });
  }
}