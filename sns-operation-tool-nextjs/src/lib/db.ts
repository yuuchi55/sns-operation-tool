import { supabase } from './supabase';

// Supabaseクライアントを直接エクスポート
export { supabase } from './supabase';

// データベース操作用のヘルパー関数
export function getDatabase() {
  return supabase;
}