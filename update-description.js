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

// 存储所有CSV学校数据的映射表
const csvSchoolsMap = new Map();

// 从CSV文件读取学校描述
async function loadCsvData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (row) => {
        // 只处理有描述的记录
        if (row.description && row.description !== 'undefined') {
          // 使用英文名称和中文名称作为键
          csvSchoolsMap.set(row.en_name, {
            id: row.id,
            en_name: row.en_name,
            cn_name: row.cn_name,
            description: row.description
          });
          
          csvSchoolsMap.set(row.cn_name, {
            id: row.id,
            en_name: row.en_name,
            cn_name: row.cn_name,
            description: row.description
          });
        }
      })
      .on('end', () => {
        console.log(`CSV文件中加载了 ${csvSchoolsMap.size / 2} 所学校的描述`);
        resolve();
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

// 获取所有description为空的学校
async function getEmptyDescriptionSchools() {
  const { data, error } = await supabase
    .from('schools')
    .select('id, en_name, cn_name')
    .or('description.is.null,description.eq.""');
  
  if (error) {
    console.error('获取空描述学校失败:', error);
    return [];
  }
  
  return data;
}

// 更新学校描述
async function updateSchoolDescription(school, description) {
  const { error } = await supabase
    .from('schools')
    .update({ description })
    .eq('id', school.id);
  
  if (error) {
    console.error(`更新学校 ${school.en_name} 描述失败:`, error);
    return false;
  }
  
  return true;
}

// 主函数
async function updateEmptyDescriptions() {
  try {
    // 加载CSV数据
    await loadCsvData();
    
    // 获取描述为空的学校
    const emptySchools = await getEmptyDescriptionSchools();
    console.log(`数据库中有 ${emptySchools.length} 所学校缺少描述`);
    
    let updatedCount = 0;
    let notFoundCount = 0;
    
    // 更新每个空描述的学校
    for (const school of emptySchools) {
      // 尝试使用英文名称和中文名称匹配
      const csvSchool = csvSchoolsMap.get(school.en_name) || csvSchoolsMap.get(school.cn_name);
      
      if (csvSchool && csvSchool.description) {
        const success = await updateSchoolDescription(school, csvSchool.description);
        if (success) {
          updatedCount++;
          console.log(`已更新 [${school.cn_name}] (${school.en_name}) 的描述`);
        }
      } else {
        notFoundCount++;
        console.log(`未找到 [${school.cn_name}] (${school.en_name}) 的描述`);
      }
    }
    
    // 输出统计信息
    console.log('\n更新统计:');
    console.log(`总需更新: ${emptySchools.length} 所学校`);
    console.log(`已更新: ${updatedCount} 所学校`);
    console.log(`未找到描述: ${notFoundCount} 所学校`);
    
  } catch (error) {
    console.error('程序执行出错:', error);
  }
}

// 执行主函数
updateEmptyDescriptions(); 