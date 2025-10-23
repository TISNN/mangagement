import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://swyajeiqqewyckzbfkid.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3eWFqZWlxcWV3eWNremJma2lkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc0ODQxNDUsImV4cCI6MjA1MzA2MDE0NX0.Q3ayCcjYwGuWAPMNF_O98XQV7P4Q8rDx4P2mO3LW7Zs';

const supabase = createClient(supabaseUrl, supabaseKey);

// 查询所有表
const { data, error } = await supabase
  .from('information_schema.tables')
  .select('table_name')
  .eq('table_schema', 'public')
  .order('table_name');

if (error) {
  console.log('使用RPC查询...');
  const { data: rpcData, error: rpcError } = await supabase.rpc('get_all_tables');
  if (rpcError) {
    console.error('无法获取表列表:', rpcError);
  } else {
    console.log('数据库表列表:', rpcData);
  }
} else {
  console.log('数据库表列表:');
  data.forEach(table => console.log('-', table.table_name));
}
