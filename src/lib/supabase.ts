import { createClient } from '@supabase/supabase-js';

// 使用Vite环境变量格式
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 创建Supabase客户端
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 同时保留默认导出，以兼容可能使用默认导入的代码
export default supabase; 