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

// 主函数
async function importUkProgrammes() {
  console.log('开始导入香港项目数据...');
  
  try {
    // 步骤1: 读取CSV文件，提取所有不同的学校名称
    const schoolsSet = new Set();
    const programsData = [];
    
    await new Promise((resolve, reject) => {
      fs.createReadStream('macau_programmes.csv')
        .pipe(csv())
        .on('data', (data) => {
          // 收集所有不同的学校名称
          if (data.school_id && !schoolsSet.has(data.school_id)) {
            schoolsSet.add(data.school_id);
          }
          
          // 保存完整的课程数据以便后续处理
          programsData.push(data);
        })
        .on('end', resolve)
        .on('error', reject);
    });
    
    console.log(`发现 ${schoolsSet.size} 所不同的学校`);
    
    // 步骤2: 首先获取已存在的学校
    const schoolNameToId = {};
    const schoolNames = Array.from(schoolsSet);
    
    const { data: existingSchools, error: selectError } = await supabase
      .from('schools')
      .select('id, cn_name')
      .in('cn_name', schoolNames);
    
    if (selectError) {
      console.error('查询现有学校数据时出错:', selectError);
      return;
    }
    
    // 构建现有学校的名称到ID的映射
    if (existingSchools && existingSchools.length > 0) {
      existingSchools.forEach(school => {
        schoolNameToId[school.cn_name] = school.id;
      });
      console.log(`找到 ${existingSchools.length} 所已存在的学校`);
    }
    
    // 找出需要新插入的学校
    const newSchools = schoolNames.filter(name => !schoolNameToId[name]);
    console.log(`需要新插入 ${newSchools.length} 所学校`);
    
    if (newSchools.length > 0) {
      const schoolsToInsert = newSchools.map(schoolName => ({
        cn_name: schoolName,
        country: '澳门',  // 根据文件名假设都是英国的学校
      }));
      
      // 插入新学校
      const { data: insertedSchools, error: insertError } = await supabase
        .from('schools')
        .insert(schoolsToInsert)
        .select();
      
      if (insertError) {
        console.error('插入新学校数据时出错:', insertError);
        return;
      }
      
      // 更新映射
      if (insertedSchools && insertedSchools.length > 0) {
        insertedSchools.forEach(school => {
          schoolNameToId[school.cn_name] = school.id;
        });
        console.log(`成功插入 ${insertedSchools.length} 所新学校`);
      }
    }
    
    // 确认所有学校都有对应的ID
    const missingSchools = schoolNames.filter(name => !schoolNameToId[name]);
    if (missingSchools.length > 0) {
      console.warn(`警告: 有 ${missingSchools.length} 所学校无法获取ID:`, missingSchools);
    }
    
    // 步骤3: 准备课程数据，更新school_id为实际UUID
    const programsToInsert = programsData.map(program => {
      const schoolId = schoolNameToId[program.school_id];
      
      if (!schoolId) {
        console.warn(`警告: 找不到学校 "${program.school_id}" 的ID`);
        return null; // 跳过没有找到学校ID的课程
      }
      
      return {
        school_id: schoolId,
        cn_name: program.cn_name,
        en_name: program.en_name,
        tags: program.tags ? program.tags.split(',').map(tag => tag.trim()) : [],
        introduction: program.introduction,
        apply_requirements: program.apply_requirements,
        objectives: program.objectives,
        language_requirements: program.language_requirements,
        curriculum: program.curriculum,
        success_cases: program.success_cases,
        degree: '硕士', // 根据示例数据假设，实际应从数据中提取
      };
    }).filter(program => program !== null); // 过滤掉没有学校ID的课程
    
    // 步骤4: 批量插入课程数据
    console.log(`准备导入 ${programsToInsert.length} 个课程`);
    
    // 由于可能数据量较大，我们分批处理
    const batchSize = 50;
    for (let i = 0; i < programsToInsert.length; i += batchSize) {
      const batch = programsToInsert.slice(i, i + batchSize);
      
      // 使用insert而不是upsert，因为programs表的字段组合可能也没有唯一约束
      const { error: programsError } = await supabase
        .from('programs')
        .insert(batch);
      
      if (programsError) {
        console.error(`导入第 ${i+1} 到 ${i+batch.length} 条课程数据时出错:`, programsError);
        console.error(programsError);
        
        // 如果出现错误，打印第一条记录的结构以便调试
        if (i === 0) {
          console.log('第一条记录结构:', JSON.stringify(batch[0], null, 2));
        }
      } else {
        console.log(`成功导入第 ${i+1} 到 ${i+batch.length} 条课程数据`);
      }
    }
    
    console.log('数据导入完成!');
    
  } catch (err) {
    console.error('导入过程中出错:', err);
  }
}

// 执行导入（删除重复的调用）
importUkProgrammes().catch(console.error); 