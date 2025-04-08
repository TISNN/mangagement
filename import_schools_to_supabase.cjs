// 导入所需的库
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const csv = require('csv-parser');
const dotenv = require('dotenv');

// 加载环境变量
dotenv.config();

// 创建Supabase客户端
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// 读取CSV文件并导入到Supabase
async function importSchools() {
  console.log('开始导入学校数据...');
  
  const results = [];
  
  // 读取CSV文件
  fs.createReadStream('schools.csv')
    .pipe(csv())
    .on('data', (data) => {
      // 将CSV行数据转换为适合数据库的格式
      results.push({
        // 不使用id字段，让数据库自动生成UUID
        cn_name: data.cn_name,
        en_name: data.en_name || null,
        logo_url: data.logo_url || null,
        country: data.country || null,
        city: data.city || null,
        ranking: data.ranking ? parseInt(data.ranking) : null,
        description: data.description || null,
        qs_rank_2025: data.qs_rank_2025 ? parseInt(data.qs_rank_2025) : null,
        qs_rank_2024: data.qs_rank_2024 ? parseInt(data.qs_rank_2024) : null,
        region: data.region || null,
        is_verified: data.is_verified === 'true',
        tags: data.tags ? data.tags.split('|') : []
      });
    })
    .on('end', async () => {
      try {
        // 上传到Supabase
        console.log(`准备导入 ${results.length} 条学校记录到Supabase...`);
        
        // 先清空现有数据（可选）
        // 如果需要清空现有数据，可以取消下面的注释
        // const { error: deleteError } = await supabase.from('schools').delete().not('id', 'is', null);
        // if (deleteError) {
        //   console.error('删除现有数据时出错:', deleteError);
        //   return;
        // }
        
        // 插入新数据 - 直接使用insert而不是upsert
        const { data, error } = await supabase
          .from('schools')
          .insert(results);
        
        if (error) {
          console.error('导入数据时出错:', error);
        } else {
          console.log('成功导入学校数据!');
        }
      } catch (err) {
        console.error('操作过程中出错:', err);
      }
    });
}

// 执行导入
importSchools().catch(console.error); 