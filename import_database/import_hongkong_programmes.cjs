// 导入所需的库
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

// 加载环境变量
dotenv.config();

// 创建Supabase客户端
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// 主函数
async function importHongkongProgrammes() {
  console.log('开始导入香港项目数据...');
  
  // 指定JSON数据所在的目录
  const dataDir = '/Users/evanxu/Downloads/project/src/programme/hongkong';
  
  try {
    // 检查目录是否存在
    if (!fs.existsSync(dataDir)) {
      console.error(`错误: 目录不存在 - ${dataDir}`);
      return;
    }
    
    console.log(`从目录读取数据: ${dataDir}`);
    
    // 读取目录中的所有文件
    const files = fs.readdirSync(dataDir);
    const jsonFiles = files.filter(file => file.endsWith('.json'));
    
    if (jsonFiles.length === 0) {
      console.error('错误: 目录中没有找到JSON文件');
      return;
    }
    
    console.log(`找到 ${jsonFiles.length} 个JSON文件`);
    
    // 步骤1: 读取所有JSON文件，提取学校和课程数据
    const schoolsSet = new Set();
    const programsData = [];
    
    for (const file of jsonFiles) {
      const filePath = path.join(dataDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      let jsonData;
      
      try {
        jsonData = JSON.parse(fileContent);
      } catch (error) {
        console.error(`解析JSON文件时出错 ${file}:`, error);
        continue;
      }
      
      // 从文件名或内容提取学校名称
      const schoolName = path.basename(file, '.json');
      
      if (schoolName && !schoolsSet.has(schoolName)) {
        schoolsSet.add(schoolName);
      }
      
      // 处理课程数据 - 假设JSON是一个课程数组或单个对象
      if (Array.isArray(jsonData)) {
        jsonData.forEach(program => {
          programsData.push({
            ...program,
            school_id: schoolName // 关联到学校名
          });
        });
      } else if (jsonData && typeof jsonData === 'object') {
        // 如果是单个对象，当作单个课程处理
        programsData.push({
          ...jsonData,
          school_id: schoolName
        });
      }
    }
    
    console.log(`发现 ${schoolsSet.size} 所不同的学校`);
    console.log(`读取了 ${programsData.length} 条课程记录`);
    
    // 步骤2: 分批获取已存在的学校
    const schoolNameToId = {};
    const schoolNames = Array.from(schoolsSet);
    let existingSchoolsCount = 0;
    
    // 每批处理的学校数量，避免请求URL过长
    const batchSize = 30;
    
    console.log(`将分 ${Math.ceil(schoolNames.length / batchSize)} 批查询学校数据`);
    
    // 分批查询学校
    for (let i = 0; i < schoolNames.length; i += batchSize) {
      const batchSchoolNames = schoolNames.slice(i, i + batchSize);
      console.log(`查询第 ${Math.floor(i/batchSize) + 1} 批学校数据，包含 ${batchSchoolNames.length} 所学校`);
      
      try {
        const { data: batchExistingSchools, error: selectError } = await supabase
          .from('schools')
          .select('id, cn_name')
          .in('cn_name', batchSchoolNames);
        
        if (selectError) {
          console.error(`查询第 ${Math.floor(i/batchSize) + 1} 批学校数据时出错:`, selectError);
          continue; // 继续处理下一批
        }
        
        // 构建现有学校的名称到ID的映射
        if (batchExistingSchools && batchExistingSchools.length > 0) {
          batchExistingSchools.forEach(school => {
            schoolNameToId[school.cn_name] = school.id;
          });
          existingSchoolsCount += batchExistingSchools.length;
        }
      } catch (error) {
        console.error(`处理第 ${Math.floor(i/batchSize) + 1} 批学校数据时发生异常:`, error);
      }
    }
    
    console.log(`找到 ${existingSchoolsCount} 所已存在的学校`);
    
    // 找出需要新插入的学校
    const newSchools = schoolNames.filter(name => !schoolNameToId[name]);
    console.log(`需要新插入 ${newSchools.length} 所学校`);
    
    // 分批插入新学校
    if (newSchools.length > 0) {
      console.log(`将分 ${Math.ceil(newSchools.length / batchSize)} 批插入新学校`);
      
      for (let i = 0; i < newSchools.length; i += batchSize) {
        const batchNewSchools = newSchools.slice(i, i + batchSize);
        console.log(`插入第 ${Math.floor(i/batchSize) + 1} 批新学校，包含 ${batchNewSchools.length} 所学校`);
        
        const schoolsToInsert = batchNewSchools.map(schoolName => ({
          cn_name: schoolName,
          country: '香港',  // 设置为香港
          region: '亚洲',   // 添加区域信息
        }));
        
        try {
          // 插入新学校
          const { data: insertedSchools, error: insertError } = await supabase
            .from('schools')
            .insert(schoolsToInsert)
            .select();
          
          if (insertError) {
            console.error(`插入第 ${Math.floor(i/batchSize) + 1} 批新学校时出错:`, insertError);
            continue; // 继续处理下一批
          }
          
          // 更新映射
          if (insertedSchools && insertedSchools.length > 0) {
            insertedSchools.forEach(school => {
              schoolNameToId[school.cn_name] = school.id;
            });
            console.log(`成功插入 ${insertedSchools.length} 所新学校`);
          }
        } catch (error) {
          console.error(`处理第 ${Math.floor(i/batchSize) + 1} 批新学校时发生异常:`, error);
        }
      }
    }
    
    // 确认所有学校都有对应的ID
    const missingSchools = schoolNames.filter(name => !schoolNameToId[name]);
    if (missingSchools.length > 0) {
      console.warn(`警告: 有 ${missingSchools.length} 所学校无法获取ID:`, missingSchools.slice(0, 5).join(', ') + (missingSchools.length > 5 ? '...' : ''));
    }
    
    // 步骤3: 准备课程数据，更新school_id为实际UUID
    const programsToInsert = programsData.map(program => {
      const schoolId = schoolNameToId[program.school_id];
      
      if (!schoolId) {
        // console.warn(`警告: 找不到学校 "${program.school_id}" 的ID`); // 避免打印太多警告
        return null; // 跳过没有找到学校ID的课程
      }
      
      // 从JSON数据中提取需要的字段
      return {
        school_id: schoolId,
        cn_name: program.name || program.cn_name || '',
        en_name: program.en_name || program.english_name || '',
        tags: program.tags ? (Array.isArray(program.tags) ? program.tags : program.tags.split(',').map(tag => tag.trim())) : [],
        introduction: program.introduction || program.desc || program.description || '',
        apply_requirements: program.apply_requirements || program.requirements || '',
        objectives: program.objectives || '',
        language_requirements: program.language_requirements || program.language || '',
        curriculum: program.curriculum || program.courses || '',
        success_cases: program.success_cases || '',
        degree: program.degree || '硕士',
        duration: program.duration || '',
        tuition_fee: program.tuition_fee || program.tuition || null,
      };
    }).filter(program => program !== null); // 过滤掉没有学校ID的课程
    
    // 步骤4: 批量插入课程数据
    console.log(`准备导入 ${programsToInsert.length} 个课程`);
    
    // 分批处理课程数据
    const programBatchSize = 50;
    console.log(`将分 ${Math.ceil(programsToInsert.length / programBatchSize)} 批导入课程数据`);
    
    for (let i = 0; i < programsToInsert.length; i += programBatchSize) {
      const batch = programsToInsert.slice(i, i + programBatchSize);
      console.log(`导入第 ${Math.floor(i/programBatchSize) + 1} 批课程，包含 ${batch.length} 条记录`);
      
      try {
        // 使用insert而不是upsert，因为programs表的字段组合可能也没有唯一约束
        const { error: programsError } = await supabase
          .from('programs')
          .insert(batch);
        
        if (programsError) {
          console.error(`导入第 ${Math.floor(i/programBatchSize) + 1} 批课程数据时出错:`, programsError);
          
          // 如果出错，尝试一条一条地插入
          console.log(`尝试单条插入第 ${Math.floor(i/programBatchSize) + 1} 批课程...`);
          for (let j = 0; j < batch.length; j++) {
            try {
              const { error: singleError } = await supabase
                .from('programs')
                .insert([batch[j]]);
              
              if (singleError) {
                console.error(`导入第 ${i+j+1} 条课程数据时出错:`, singleError);
              } else {
                console.log(`成功导入第 ${i+j+1} 条课程数据`);
              }
            } catch (singleInsertError) {
              console.error(`插入第 ${i+j+1} 条课程时发生异常:`, singleInsertError);
            }
          }
        } else {
          console.log(`成功导入第 ${Math.floor(i/programBatchSize) + 1} 批课程数据，共 ${batch.length} 条记录`);
        }
      } catch (batchError) {
        console.error(`处理第 ${Math.floor(i/programBatchSize) + 1} 批课程时发生异常:`, batchError);
      }
    }
    
    console.log('数据导入完成!');
    
  } catch (err) {
    console.error('导入过程中出错:', err);
  }
}

// 执行导入
importHongkongProgrammes().catch(err => {
  console.error('程序执行出错:', err);
  process.exit(1);
}); 