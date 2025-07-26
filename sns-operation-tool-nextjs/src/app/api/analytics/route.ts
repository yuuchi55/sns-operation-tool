import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';

// 型定義
interface Post {
  id: string;
  platform: string;
  content: string;
  published_at: string;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  views_count: number;
  engagement_rate?: number;
  tags?: string;
  status?: string;
}

interface PlatformStat {
  platform: string;
  post_count: number;
  avg_likes: number;
  avg_comments: number;
  avg_shares: number;
  avg_views: number;
  avg_engagement_rate: number;
}

interface HourlyPerformance {
  hour: string;
  post_count: number;
  avg_engagement_rate: number;
}

interface UpdateAnalyticsBody {
  postId: string;
  likes?: number;
  comments?: number;
  shares?: number;
  views?: number;
}

export async function GET(request: NextRequest) {
  try {
    const db = getDatabase();
    const { searchParams } = new URL(request.url);
    const platform = searchParams.get('platform');
    const dateRange = searchParams.get('dateRange');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // 基本的な分析データを取得
    let query = `
      SELECT
        id,
        platform,
        content,
        published_at,
        likes_count,
        comments_count,
        shares_count,
        views_count,
        engagement_rate,
        tags
      FROM posts
      WHERE status = 'published'
    `;

    const params: (string | number)[] = [];

    // プラットフォームフィルター（'all'以外の場合のみ適用）
    if (platform && platform !== 'all') {
      query += ' AND platform = ?';
      params.push(platform);
    }

    // 日付範囲フィルター
    if (dateRange) {
      const now = new Date();
      let daysAgo: number;
      
      switch (dateRange) {
        case '7d':
          daysAgo = 7;
          break;
        case '30d':
          daysAgo = 30;
          break;
        case '90d':
          daysAgo = 90;
          break;
        default:
          daysAgo = 7;
      }
      
      const startDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
      query += ' AND published_at >= ?';
      params.push(startDate.toISOString());
    }

    // カスタム日付範囲（優先）
    if (startDate) {
      query += ' AND published_at >= ?';
      params.push(startDate);
    }

    if (endDate) {
      query += ' AND published_at <= ?';
      params.push(endDate);
    }

    query += ' ORDER BY published_at DESC';

    const posts = db.prepare(query).all(...params) as Post[];

    // エンゲージメント率を計算
    posts.forEach(post => {
      if (post.views_count > 0) {
        post.engagement_rate = ((post.likes_count + post.comments_count + post.shares_count) / post.views_count) * 100;
      } else {
        post.engagement_rate = 0;
      }
    });

    // 集計データの計算
    const summary = {
      totalPosts: posts.length,
      totalLikes: posts.reduce((sum, post) => sum + (post.likes_count || 0), 0),
      totalComments: posts.reduce((sum, post) => sum + (post.comments_count || 0), 0),
      totalShares: posts.reduce((sum, post) => sum + (post.shares_count || 0), 0),
      totalViews: posts.reduce((sum, post) => sum + (post.views_count || 0), 0),
      averageEngagementRate: posts.length > 0
        ? posts.reduce((sum, post) => sum + (post.engagement_rate || 0), 0) / posts.length
        : 0,
    };

    // プラットフォーム別の集計
    const platformStats = db.prepare(`
      SELECT
        platform,
        COUNT(*) as post_count,
        AVG(likes_count) as avg_likes,
        AVG(comments_count) as avg_comments,
        AVG(shares_count) as avg_shares,
        AVG(views_count) as avg_views,
        AVG(engagement_rate) as avg_engagement_rate
      FROM posts
      WHERE status = 'published'
      GROUP BY platform
    `).all() as PlatformStat[];

    // 時間帯別パフォーマンス（投稿時間を時間帯でグループ化）
    const hourlyPerformance = db.prepare(`
      SELECT
        strftime('%H', published_at) as hour,
        COUNT(*) as post_count,
        AVG(engagement_rate) as avg_engagement_rate
      FROM posts
      WHERE status = 'published' AND published_at IS NOT NULL
      GROUP BY hour
      ORDER BY hour
    `).all() as HourlyPerformance[];

    return NextResponse.json({
      posts,
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
    const db = getDatabase();
    const body: UpdateAnalyticsBody = await request.json();
    const { postId, likes, comments, shares, views } = body;

    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }

    const updateStmt = db.prepare(`
      UPDATE posts
      SET
        likes_count = COALESCE(?, likes_count),
        comments_count = COALESCE(?, comments_count),
        shares_count = COALESCE(?, shares_count),
        views_count = COALESCE(?, views_count),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    const result = updateStmt.run(likes, comments, shares, views, postId);

    if (result.changes === 0) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
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