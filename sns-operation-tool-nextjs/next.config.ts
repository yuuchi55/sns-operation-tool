import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // パフォーマンス最適化
  experimental: {
    optimizePackageImports: ['recharts', '@supabase/supabase-js']
  },
  
  // 画像最適化
  images: {
    domains: [],
    formats: ['image/webp', 'image/avif']
  },
  
  // セキュリティヘッダー
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ]
      }
    ];
  },
  
  // プロダクションビルド最適化
  compress: true,
  
  // 環境変数の検証
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  }
};

export default nextConfig;
