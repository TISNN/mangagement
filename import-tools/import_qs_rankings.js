// 导入QS排名数据到Supabase的schools表
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Supabase连接配置
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://swyajeiqqewyckzbfkid.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3eWFqZWlxcWV3eWNremJma2lkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc0ODQxNDUsImV4cCI6MjA1MzA2MDE0NX0.Q3ayCcjYwGuWAPMNF_O98XQV7P4Q8rDx4P2mO3LW7Zs';
const supabase = createClient(supabaseUrl, supabaseKey);

// CSV文件路径
const filePath = '2025 QS World University Rankings 2.2 (For qs.com).csv';

// 处理CSV行，考虑引号内的逗号问题
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  // 添加最后一个字段
  result.push(current);
  
  return result;
}

// 手动读取CSV文件，因为文件格式特殊
const readQSRankings = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      
      const lines = data.split('\n').filter(line => line.trim());
      
      // 跳过前6行，这些是标题和表头
      const dataLines = lines.slice(6);
      
      // 解析数据
      const results = dataLines.map(line => {
        const columns = parseCSVLine(line);
        if (columns.length >= 6) {
          return {
            index: columns[0].trim(),
            rank_2025: columns[1].trim(),
            rank_2024: columns[2].trim(),
            university: columns[3].trim().replace(/^"|"$/g, ''),
            location: columns[4].trim().replace(/^"|"$/g, ''),
            region: columns[5].trim().replace(/^"|"$/g, '')
          };
        }
        return null;
      }).filter(item => item !== null);
      
      resolve(results);
    });
  });
};

async function processUniversities(universities) {
  console.log('开始处理大学数据...');
  
  // 用于跟踪成功和失败的计数
  let success = 0;
  let notFound = 0;
  let updated = 0;
  let created = 0;
  let skip = 0;
  
  // 处理每一所大学
  for (const uni of universities) {
    try {
      if (!uni.university || uni.university === 'University' || uni.university === 'institution') {
        skip++;
        continue;
      }
      
      const universityData = {
        name: uni.university,
        country: uni.location,
        region: uni.region,
        qs_rank_2025: parseInt(uni.rank_2025) || null,
        qs_rank_2024: parseInt(uni.rank_2024) || null,
        is_verified: true
      };
      
      // 首先检查数据库中是否已有该学校
      const { data: existingSchools, error: searchError } = await supabase
        .from('schools')
        .select()
        .ilike('name', `%${uni.university}%`)
        .limit(1);
      
      if (searchError) {
        console.error('搜索学校时出错:', searchError);
        continue;
      }
      
      if (existingSchools && existingSchools.length > 0) {
        // 更新现有学校记录
        const { error: updateError } = await supabase
          .from('schools')
          .update(universityData)
          .eq('id', existingSchools[0].id);
        
        if (updateError) {
          console.error(`更新学校 ${uni.university} 时出错:`, updateError);
        } else {
          updated++;
          success++;
          console.log(`✅ 已更新: ${uni.university}`);
        }
      } else {
        // 创建新学校记录
        const { error: insertError } = await supabase
          .from('schools')
          .insert([universityData]);
        
        if (insertError) {
          console.error(`插入学校 ${uni.university} 时出错:`, insertError);
        } else {
          created++;
          success++;
          console.log(`🆕 已创建: ${uni.university}`);
        }
      }
    } catch (error) {
      console.error(`处理学校 ${uni.university || '未知'} 时发生错误:`, error);
      notFound++;
    }
  }
  
  console.log('\n导入统计:');
  console.log(`✅ 成功处理: ${success}所大学`);
  console.log(`🔄 更新: ${updated}所大学`);
  console.log(`🆕 新增: ${created}所大学`);
  console.log(`⏭️ 跳过: ${skip}所记录`);
  console.log(`❌ 未找到/失败: ${notFound}所大学`);
}

// 主程序
async function main() {
  console.log('开始导入QS世界大学排名数据...');
  try {
    const universities = await readQSRankings();
    console.log(`读取了${universities.length}条大学记录`);
    
    // 显示前5条记录，用于调试
    console.log('前5条记录示例:');
    universities.slice(0, 5).forEach(uni => console.log(uni));
    
    await processUniversities(universities);
  } catch (error) {
    console.error('导入过程出错:', error);
  }
}

main(); 