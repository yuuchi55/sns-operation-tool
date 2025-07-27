import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Supabaseの接続チェック
    const { data, error } = await supabase
      .from('posts')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('Database health check failed:', error);
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'Database connection failed',
          timestamp: new Date().toISOString()
        }, 
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      version: process.env.npm_package_version || '1.0.0',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
    
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Health check failed',
        timestamp: new Date().toISOString()
      }, 
      { status: 500 }
    );
  }
}