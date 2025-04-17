const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const csv = require('csv-parser');

// Supabase配置
const supabaseUrl = 'https://swyajeiqqewyckzbfkid.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || ''; // 请在运行时提供SUPABASE_KEY环境变量

// 创建Supabase客户端
const supabase = createClient(supabaseUrl, supabaseKey);

// CSV文件路径
const csvFilePath = path.join(__dirname, 'us_universities.csv');

// 处理CSV数据并更新数据库
async function processData() {
  const schools = [];
  
  // 读取CSV文件
  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (row) => {
      // 过滤掉undefined描述的行
      if (row.description && row.description !== 'undefined') {
        schools.push({
          id: row.id,
          en_name: row.en_name,
          cn_name: row.cn_name,
          ranking: row.ranking ? parseInt(row.ranking) : null,
          tags: row.tags ? row.tags.split('|') : [],
          description: row.description,
          url: row.url,
          country: 'US' // 添加国家标识
        });
      }
    })
    .on('end', async () => {
      console.log(`读取了 ${schools.length} 所学校数据`);
      
      // 开始更新数据库
      let updatedCount = 0;
      let insertedCount = 0;
      let errorCount = 0;
      
      for (const school of schools) {
        try {
          // 检查学校是否已存在
          const { data: existingSchool } = await supabase
            .from('schools')
            .select('id')
            .eq('id', school.id)
            .single();
          
          if (existingSchool) {
            // 更新现有学校
            const { error: updateError } = await supabase
              .from('schools')
              .update({
                en_name: school.en_name,
                cn_name: school.cn_name,
                ranking: school.ranking,
                tags: school.tags,
                description: school.description,
                url: school.url,
                country: school.country
              })
              .eq('id', school.id);
            
            if (updateError) {
              console.error(`更新学校 ${school.en_name} 时出错:`, updateError);
              errorCount++;
            } else {
              updatedCount++;
              console.log(`已更新: ${school.en_name} (ID: ${school.id})`);
            }
          } else {
            // 插入新学校
            const { error: insertError } = await supabase
              .from('schools')
              .insert([school]);
            
            if (insertError) {
              console.error(`插入学校 ${school.en_name} 时出错:`, insertError);
              errorCount++;
            } else {
              insertedCount++;
              console.log(`已插入: ${school.en_name} (ID: ${school.id})`);
            }
          }
        } catch (error) {
          console.error(`处理学校 ${school.en_name} 时发生异常:`, error);
          errorCount++;
        }
      }
      
      console.log('\n更新统计:');
      console.log(`总计处理: ${schools.length} 所学校`);
      console.log(`已更新: ${updatedCount} 所学校`);
      console.log(`已插入: ${insertedCount} 所学校`);
      console.log(`错误: ${errorCount} 所学校`);
    });
}

// 执行主函数
processData().catch(error => {
  console.error('程序执行时发生错误:', error);
}); 