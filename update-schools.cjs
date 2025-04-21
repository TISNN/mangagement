const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const csv = require('csv-parser');

// 获取命令行参数
const args = process.argv.slice(2);
const commandLineKey = args[0]; // 从命令行获取密钥

// Supabase配置
const supabaseUrl = 'https://swyajeiqqewyckzbfkid.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || commandLineKey || ''; // 优先使用环境变量，其次使用命令行参数

// 验证是否有密钥
if (!supabaseKey) {
  console.error('错误: 缺少Supabase密钥！请通过环境变量SUPABASE_KEY或命令行参数提供。');
  console.error('用法: node update-schools.cjs 您的Supabase密钥');
  process.exit(1);
}

// 创建Supabase客户端
const supabase = createClient(supabaseUrl, supabaseKey);

// CSV文件路径
const csvFilePath = path.join(__dirname, './australia_universities.csv');

// 处理CSV数据并更新数据库
async function processData() {
  // 检查CSV文件是否存在
  if (!fs.existsSync(csvFilePath)) {
    console.error(`错误: CSV文件不存在: ${csvFilePath}`);
    return;
  }

  const schools = [];
  
  // 读取CSV文件
  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (row) => {
      // 过滤掉undefined描述的行
      if (row.description && row.description !== 'undefined') {
        // 创建学校对象，不包含id字段，让Supabase自动生成
        schools.push({
          en_name: row.en_name,
          cn_name: row.cn_name,
          ranking: row.ranking ? parseInt(row.ranking) : null,
          tags: row.tags ? row.tags.split('|') : [],
          description: row.description,
          website_url: row.website_url,
          country: 'Australia' // 添加国家标识
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
          // 检查学校是否已存在（通过英文名称）
          const { data: existingSchools } = await supabase
            .from('schools')
            .select('id')
            .eq('en_name', school.en_name)
            .eq('country', 'Australia');
          
          if (existingSchools && existingSchools.length > 0) {
            // 更新现有学校
            const { error: updateError } = await supabase
              .from('schools')
              .update({
                en_name: school.en_name,
                cn_name: school.cn_name,
                ranking: school.ranking,
                tags: school.tags,
                description: school.description,
                website_url: school.website_url,
                country: school.country
              })
              .eq('id', existingSchools[0].id);
            
            if (updateError) {
              console.error(`更新学校 ${school.en_name} 时出错:`, updateError);
              errorCount++;
            } else {
              updatedCount++;
              console.log(`已更新: ${school.en_name}`);
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
              console.log(`已插入: ${school.en_name}`);
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