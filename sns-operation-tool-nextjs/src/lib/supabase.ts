import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

console.log('Supabase initialization:', {
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseAnonKey,
  url: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : 'not set'
});

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase環境変数が設定されていません:', {
    NEXT_PUBLIC_SUPABASE_URL: supabaseUrl ? 'set' : 'missing',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseAnonKey ? 'set' : 'missing'
  });
  throw new Error('Supabase environment variables are not configured');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)