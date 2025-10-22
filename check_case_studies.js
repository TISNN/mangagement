import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://swyajeiqqewyckzbfkid.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3eWFqZWlxcWV3eWNremJma2lkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc0ODQxNDUsImV4cCI6MjA1MzA2MDE0NX0.Q3ayCcjYwGuWAPMNF_O98XQV7P4Q8rDx4P2mO3LW7Zs';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTable() {
  console.log('检查 case_studies 表结构...\n');
  
  // 尝试获取表数据
  const { data, error } = await supabase
    .from('case_studies')
    .select('*')
    .limit(1);

  if (error) {
    console.error('错误:', error.message);
    console.log('\n表可能不存在，需要创建。');
  } else if (data && data.length > 0) {
    console.log('表已存在，字段列表:');
    const fields = Object.keys(data[0]);
    fields.forEach(field => {
      console.log(`  - ${field}: ${typeof data[0][field]}`);
    });
  } else {
    console.log('表存在但没有数据');
  }
}

checkTable();
