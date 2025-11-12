import { createClient } from '@supabase/supabase-js';

// 使用Vite环境变量格式，如果环境变量未设置则使用默认值
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://swyajeiqqewyckzbfkid.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3eWFqZWlxcWV3eWNremJma2lkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc0ODQxNDUsImV4cCI6MjA1MzA2MDE0NX0.Q3ayCcjYwGuWAPMNF_O98XQV7P4Q8rDx4P2mO3LW7Zs';

// 创建Supabase客户端，使用最简配置
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});

if (import.meta.env.DEV) {
  console.info('[Supabase] 客户端已初始化', {
    url: supabaseUrl,
    hasAnonKey: Boolean(supabaseAnonKey),
  });
  if (typeof window !== 'undefined') {
    (window as typeof window & { __supabaseClient?: typeof supabase }).__supabaseClient = supabase;
    console.info('[Supabase] 调试客户端已挂载到 window.__supabaseClient');
  }
}

// 同时保留默认导出，以兼容可能使用默认导入的代码
export default supabase; 