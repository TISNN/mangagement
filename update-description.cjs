const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const csv = require('csv-parser');

// Supabase配置
const supabaseUrl = 'https://swyajeiqqewyckzbfkid.supabase.co';
// 使用正确的服务角色API密钥（service_role key）而不是匿名密钥
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || ''; // 请在运行时提供SUPABASE_SERVICE_KEY环境变量

// 创建Supabase客户端
const supabase = createClient(supabaseUrl, supabaseKey);

// CSV文件路径
const csvFilePath = path.join(__dirname, 'us_universities.csv');

// 存储所有CSV学校数据的映射表（主要使用中文名）
const csvSchoolsMap = new Map();

// 从CSV文件读取学校数据
async function loadCsvData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (row) => {
        // 处理所有包含必要信息的记录
        if (row.cn_name) {
          // 处理tags，将其转换为数组
          const tags = row.tags ? row.tags.split('|') : [];
          // 处理ranking，将其转换为数字
          const ranking = row.ranking ? parseInt(row.ranking) : null;
          
          const schoolData = {
            id: row.id,
            en_name: row.en_name,
            cn_name: row.cn_name,
            description: row.description && row.description !== 'undefined' ? row.description : null,
            ranking: ranking,
            tags: tags,
            url: row.url
          };
          
          // 主要使用中文名称作为键
          csvSchoolsMap.set(row.cn_name, schoolData);
          
          // 额外使用英文名称作为备用
          csvSchoolsMap.set(row.en_name, schoolData);
        }
      })
      .on('end', () => {
        console.log(`CSV文件中加载了 ${csvSchoolsMap.size / 2} 所学校的数据`);
        resolve();
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

// 获取需要更新字段的学校
async function getSchoolsToUpdate() {
  const { data, error } = await supabase
    .from('schools')
    .select('id, en_name, cn_name, description, ranking, tags');
  
  if (error) {
    console.error('获取学校数据失败:', error);
    return [];
  }
  
  // 筛选出需要更新的学校（description为空或ranking为空）
  return data.filter(school => {
    return !school.description || !school.ranking || !school.tags || school.tags.length === 0;
  });
}

// 更新学校信息
async function updateSchoolInfo(school, newData) {
  // 准备更新数据
  const updateData = {};
  
  // 只更新需要更新的字段
  if (!school.description && newData.description) {
    updateData.description = newData.description;
  }
  
  if (!school.ranking && newData.ranking) {
    updateData.ranking = newData.ranking;
  }
  
  if ((!school.tags || school.tags.length === 0) && newData.tags && newData.tags.length > 0) {
    updateData.tags = newData.tags;
  }
  
  // 如果没有需要更新的字段，直接返回
  if (Object.keys(updateData).length === 0) {
    return { success: false, message: '没有需要更新的字段' };
  }
  
  // 执行更新
  const { error } = await supabase
    .from('schools')
    .update(updateData)
    .eq('id', school.id);
  
  if (error) {
    console.error(`更新学校 ${school.cn_name} 数据失败:`, error);
    return { success: false, message: error.message };
  }
  
  return { 
    success: true,
    updatedFields: Object.keys(updateData)
  };
}

// 打印Supabase连接状态
async function checkSupabaseConnection() {
  try {
    // 尝试获取一条记录来测试连接
    const { data, error } = await supabase
      .from('schools')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error('Supabase连接检查失败:', error);
      return false;
    }
    
    console.log('Supabase连接成功!');
    return true;
  } catch (error) {
    console.error('Supabase连接检查异常:', error);
    return false;
  }
}

// 主函数
async function updateSchoolsInfo() {
  try {
    // 首先检查数据库连接
    const connected = await checkSupabaseConnection();
    if (!connected) {
      console.error('无法连接到Supabase数据库，请检查API密钥和URL是否正确');
      return;
    }
    
    // 加载CSV数据
    await loadCsvData();
    
    // 获取需要更新的学校
    const schoolsToUpdate = await getSchoolsToUpdate();
    console.log(`数据库中有 ${schoolsToUpdate.length} 所学校需要更新信息`);
    
    let updatedCount = 0;
    let descriptionUpdated = 0;
    let rankingUpdated = 0;
    let tagsUpdated = 0;
    let notFoundCount = 0;
    
    // 更新每个学校的信息，优先使用中文名匹配
    for (const school of schoolsToUpdate) {
      // 优先尝试使用中文名称匹配，其次尝试英文名称
      const csvSchool = csvSchoolsMap.get(school.cn_name) || csvSchoolsMap.get(school.en_name);
      
      if (csvSchool) {
        const result = await updateSchoolInfo(school, csvSchool);
        
        if (result.success) {
          updatedCount++;
          console.log(`已更新 [${school.cn_name}] 的字段: ${result.updatedFields.join(', ')}`);
          
          // 统计更新的字段类型
          if (result.updatedFields.includes('description')) descriptionUpdated++;
          if (result.updatedFields.includes('ranking')) rankingUpdated++;
          if (result.updatedFields.includes('tags')) tagsUpdated++;
        }
      } else {
        notFoundCount++;
        console.log(`未找到 [${school.cn_name}] (${school.en_name}) 的数据`);
      }
    }
    
    // 输出统计信息
    console.log('\n更新统计:');
    console.log(`总需更新: ${schoolsToUpdate.length} 所学校`);
    console.log(`已更新: ${updatedCount} 所学校`);
    console.log(`更新了description的学校: ${descriptionUpdated} 所`);
    console.log(`更新了ranking的学校: ${rankingUpdated} 所`);
    console.log(`更新了tags的学校: ${tagsUpdated} 所`);
    console.log(`未找到: ${notFoundCount} 所学校`);
    
  } catch (error) {
    console.error('程序执行出错:', error);
  }
}

// 执行主函数
updateSchoolsInfo(); 