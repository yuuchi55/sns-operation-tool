import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const platform = searchParams.get('platform');
    const dateRange = searchParams.get('dateRange');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // 常にサンプルデータを返す（デバッグ用）
    let postsData = [
      {
        id: '1',
        content: '新商品リリースのお知らせ！今なら特別価格でご提供中です。詳細はプロフィールのリンクからご確認ください。',
        platform: 'twitter',
        published_at: '2025-07-25T10:00:00.000Z',
        likes_count: 245,
        comments_count: 32,
        shares_count: 89,
        views_count: 3420,
        engagement_rate: 0,
        tags: ['新商品', 'セール']
      },
      {
        id: '2',
        content: '本日のランチメニューをご紹介！季節限定の特別メニューも登場しています。皆様のご来店をお待ちしております。',
        platform: 'instagram',
        published_at: '2025-07-26T11:00:00.000Z',
        likes_count: 512,
        comments_count: 67,
        shares_count: 43,
        views_count: 4250,
        engagement_rate: 0,
        tags: ['ランチ', '季節限定']
      },
      {
        id: '3',
        content: 'お客様の声をご紹介：「いつも丁寧な対応で安心して利用できます」ありがとうございます！',
        platform: 'facebook',
        published_at: '2025-07-24T09:00:00.000Z',
        likes_count: 189,
        comments_count: 23,
        shares_count: 56,
        views_count: 2890,
        engagement_rate: 0,
        tags: ['お客様の声', 'レビュー']
      },
      {
        id: '4',
        content: '週末限定セール開催中！人気商品が最大50%OFF。この機会をお見逃しなく！',
        platform: 'twitter',
        published_at: '2025-07-23T14:00:00.000Z',
        likes_count: 678,
        comments_count: 89,
        shares_count: 234,
        views_count: 5680,
        engagement_rate: 0,
        tags: ['セール', '週末限定']
      },
      {
        id: '5',
        content: 'スタッフブログ更新しました：「お客様に喜んでいただくための5つの工夫」ぜひご覧ください。',
        platform: 'instagram',
        published_at: '2025-07-22T16:00:00.000Z',
        likes_count: 345,
        comments_count: 45,
        shares_count: 78,
        views_count: 3980,
        engagement_rate: 0,
        tags: ['ブログ', 'スタッフ']
      }
    ];


    // エンゲージメント率を計算（Supabaseで自動計算される場合もあるが、念のため）
    postsData.forEach(post => {
      if (post.views_count > 0) {
        post.engagement_rate = ((post.likes_count + post.comments_count + post.shares_count) / post.views_count) * 100;
      } else {
        post.engagement_rate = 0;
      }
    });

    // 集計データの計算
    const summary = {
      totalPosts: postsData.length,
      totalLikes: postsData.reduce((sum, post) => sum + (post.likes_count || 0), 0),
      totalComments: postsData.reduce((sum, post) => sum + (post.comments_count || 0), 0),
      totalShares: postsData.reduce((sum, post) => sum + (post.shares_count || 0), 0),
      totalViews: postsData.reduce((sum, post) => sum + (post.views_count || 0), 0),
      averageEngagementRate: postsData.length > 0
        ? postsData.reduce((sum, post) => sum + (post.engagement_rate || 0), 0) / postsData.length
        : 0,
    };

    // プラットフォーム別の集計（サンプルデータ用）
    let platformStatsData = postsData;

    // プラットフォーム別統計を手動で計算
    const platformStats: any[] = [];
    const platformGroups: { [key: string]: any[] } = {};

    (platformStatsData || []).forEach(post => {
      if (!platformGroups[post.platform]) {
        platformGroups[post.platform] = [];
      }
      platformGroups[post.platform].push(post);
    });

    Object.keys(platformGroups).forEach(platform => {
      const posts = platformGroups[platform];
      const stat = {
        platform,
        post_count: posts.length,
        avg_likes: posts.reduce((sum, p) => sum + (p.likes_count || 0), 0) / posts.length,
        avg_comments: posts.reduce((sum, p) => sum + (p.comments_count || 0), 0) / posts.length,
        avg_shares: posts.reduce((sum, p) => sum + (p.shares_count || 0), 0) / posts.length,
        avg_views: posts.reduce((sum, p) => sum + (p.views_count || 0), 0) / posts.length,
        avg_engagement_rate: posts.reduce((sum, p) => sum + (p.engagement_rate || 0), 0) / posts.length,
      };
      platformStats.push(stat);
    });

    // 時間帯別パフォーマンス（簡易実装）
    let hourlyPerformance: any[] = [];
    const hourGroups: { [key: string]: any[] } = {};

    postsData.forEach(post => {
      if (post.published_at) {
        const hour = new Date(post.published_at).getHours().toString().padStart(2, '0');
        if (!hourGroups[hour]) {
          hourGroups[hour] = [];
        }
        hourGroups[hour].push(post);
      }
    });

    Object.keys(hourGroups).forEach(hour => {
      const posts = hourGroups[hour];
      hourlyPerformance.push({
        hour: parseInt(hour),
        post_count: posts.length,
        avg_engagement_rate: posts.reduce((sum, p) => sum + (p.engagement_rate || 0), 0) / posts.length,
      });
    });

    // データがない場合はサンプルデータを使用
    if (hourlyPerformance.length === 0) {
      hourlyPerformance = [
        { hour: 0, avg_engagement_rate: 2.1 },
        { hour: 1, avg_engagement_rate: 1.8 },
        { hour: 2, avg_engagement_rate: 1.5 },
        { hour: 3, avg_engagement_rate: 1.2 },
        { hour: 4, avg_engagement_rate: 1.0 },
        { hour: 5, avg_engagement_rate: 1.3 },
        { hour: 6, avg_engagement_rate: 2.5 },
        { hour: 7, avg_engagement_rate: 4.2 },
        { hour: 8, avg_engagement_rate: 6.8 },
        { hour: 9, avg_engagement_rate: 7.5 },
        { hour: 10, avg_engagement_rate: 8.2 },
        { hour: 11, avg_engagement_rate: 8.9 },
        { hour: 12, avg_engagement_rate: 9.5 },
        { hour: 13, avg_engagement_rate: 8.7 },
        { hour: 14, avg_engagement_rate: 7.3 },
        { hour: 15, avg_engagement_rate: 6.5 },
        { hour: 16, avg_engagement_rate: 5.8 },
        { hour: 17, avg_engagement_rate: 6.2 },
        { hour: 18, avg_engagement_rate: 7.8 },
        { hour: 19, avg_engagement_rate: 8.5 },
        { hour: 20, avg_engagement_rate: 9.2 },
        { hour: 21, avg_engagement_rate: 7.9 },
        { hour: 22, avg_engagement_rate: 5.4 },
        { hour: 23, avg_engagement_rate: 3.2 }
      ];
    }

    hourlyPerformance.sort((a, b) => a.hour - b.hour);

    return NextResponse.json({
      posts: postsData,
      summary,
      platformStats,
      hourlyPerformance
    });

  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}

// パフォーマンスデータを更新するエンドポイント
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { postId, likes, comments, shares, views } = body;

    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }

    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (likes !== undefined) updateData.likes_count = likes;
    if (comments !== undefined) updateData.comments_count = comments;
    if (shares !== undefined) updateData.shares_count = shares;
    if (views !== undefined) updateData.views_count = views;

    const { data, error } = await supabase
      .from('posts')
      .update(updateData)
      .eq('id', postId)
      .select();

    if (error) {
      console.error('Analytics update error:', error);
      return NextResponse.json({ error: 'Failed to update analytics data' }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Analytics update error:', error);
    return NextResponse.json(
      { error: 'Failed to update analytics data' },
      { status: 500 }
    );
  }
}