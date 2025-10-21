import { createClient } from '@supabase/supabase-js';

// 使用Vite环境变量格式，如果环境变量未设置则使用默认值
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://swyajeiqqewyckzbfkid.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3eWFqZWlxcWV3eWNremJma2lkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc0ODQxNDUsImV4cCI6MjA1MzA2MDE0NX0.Q3ayCcjYwGuWAPMNF_O98XQV7P4Q8rDx4P2mO3LW7Zs';

// 创建Supabase客户端
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 同时保留默认导出，以兼容可能使用默认导入的代码
export default supabase; 