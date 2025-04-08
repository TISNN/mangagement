// 导入所需的库
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const csv = require('csv-parser');
const dotenv = require('dotenv');
const path = require('path');

// 加载环境变量
dotenv.config();

// 创建Supabase客户端
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// 国家和区域映射
const countryToRegion = {
  'uk': '欧洲',
  'hongkong': '亚洲',
  'australia': '大洋洲',
  'singapore': '亚洲',
  'macau': '亚洲',
  'us': '北美洲',
  'canada': '北美洲'
};

// 解析命令行参数
function parseArgs() {
  const args = process.argv.slice(2);
  
  // 默认值
  const params = {
    country: 'uk', // 默认为英国
    verbose: false,
    file: null // CSV文件路径，默认为null
  };
  
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--country' && i + 1 < args.length) {
      params.country = args[i + 1].toLowerCase();
      i++;
    } else if (args[i] === '--file' && i + 1 < args.length) {
      params.file = args[i + 1];
      i++;
    } else if (args[i] === '--verbose') {
      params.verbose = true;
    } else if (args[i] === '--help') {
      console.log(`
用法: node import_programmes.cjs [选项]

选项:
  --country 国家名    指定要导入的国家数据 (uk, hongkong, australia, singapore, macau, us, canada)
  --file CSV文件路径  指定CSV文件的绝对路径，例如 --file /Users/username/data/hongkong_programmes.csv
  --verbose          显示详细日志信息
  --help             显示此帮助信息
      `);
      process.exit(0);
    }
  }
  
  if (!countryToRegion[params.country]) {
    console.error(`错误: 不支持的国家 '${params.country}'`);
    console.error('支持的国家有: ' + Object.keys(countryToRegion).join(', '));
    process.exit(1);
  }
  
  return params;
}

// 主函数
async function importProgrammes() {
  const params = parseArgs();
  const country = params.country;
  const region = countryToRegion[country];
  
  // 确定CSV文件路径
  let csvFilePath;
  if (params.file) {
    // 如果提供了文件参数，使用它
    csvFilePath = params.file;
  } else {
    // 否则，在几个可能的位置尝试查找文件
    const possiblePaths = [
      `${country}_programmes.csv`, // 当前目录
      path.join(process.cwd(), `${country}_programmes.csv`), // 使用绝对路径到当前目录
      `/Users/evanxu/Downloads/project/${country}_programmes.csv` // 用户指定的项目根目录
    ];
    
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        csvFilePath = p;
        break;
      }
    }
    
    if (!csvFilePath) {
      console.error(`错误: 无法找到 ${country} 的CSV文件`);
      console.error('请使用 --file 参数指定CSV文件的完整路径');
      console.error('例如: node import_programmes.cjs --country hongkong --file /Users/evanxu/Downloads/project/hongkong_programmes.csv');
      process.exit(1);
    }
  }
  
  console.log(`开始导入${getCountryName(country)}项目数据...`);
  console.log(`使用CSV文件: ${csvFilePath}`);
  
  try {
    // 检查CSV文件是否存在
    if (!fs.existsSync(csvFilePath)) {
      console.error(`错误: 找不到文件 ${csvFilePath}`);
      process.exit(1);
    }
    
    // 步骤1: 读取CSV文件，提取所有不同的学校名称
    const schoolsSet = new Set();
    const programsData = [];
    
    await new Promise((resolve, reject) => {
      fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (data) => {
          // 收集所有不同的学校名称
          if (data.school_name && !schoolsSet.has(data.school_name)) {
            schoolsSet.add(data.school_name);
          }
          
          // 保存完整的课程数据以便后续处理
          programsData.push(data);
        })
        .on('end', resolve)
        .on('error', (err) => {
          console.error(`读取CSV文件出错: ${err.message}`);
          reject(err);
        });
    });
    
    console.log(`发现 ${schoolsSet.size} 所不同的学校`);
    if (params.verbose) {
      console.log(`读取了 ${programsData.length} 条课程记录`);
    }
    
    // 步骤2: 分批获取已存在的学校
    const schoolNameToId = {};
    const schoolNames = Array.from(schoolsSet);
    let existingSchoolsCount = 0;
    
    // 每批处理的学校数量，避免请求URL过长
    const batchSize = 30;
    
    if (params.verbose) {
      console.log(`将分 ${Math.ceil(schoolNames.length / batchSize)} 批查询学校数据`);
    }
    
    // 分批查询学校
    for (let i = 0; i < schoolNames.length; i += batchSize) {
      const batchSchoolNames = schoolNames.slice(i, i + batchSize);
      if (params.verbose) {
        console.log(`查询第 ${Math.floor(i/batchSize) + 1} 批学校数据，包含 ${batchSchoolNames.length} 所学校`);
      }
      
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
      if (params.verbose) {
        console.log(`将分 ${Math.ceil(newSchools.length / batchSize)} 批插入新学校`);
      }
      
      for (let i = 0; i < newSchools.length; i += batchSize) {
        const batchNewSchools = newSchools.slice(i, i + batchSize);
        if (params.verbose) {
          console.log(`插入第 ${Math.floor(i/batchSize) + 1} 批新学校，包含 ${batchNewSchools.length} 所学校`);
        }
        
        const schoolsToInsert = batchNewSchools.map(schoolName => ({
          cn_name: schoolName,
          country: getCountryName(country),
          region: region
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
      console.warn(`警告: 有 ${missingSchools.length} 所学校无法获取ID:`, 
        missingSchools.slice(0, 5).join(', ') + (missingSchools.length > 5 ? '...' : ''));
    }
    
    // 步骤3: 准备课程数据，更新school_id为实际UUID
    const programsToInsert = programsData.map(program => {
      const schoolId = schoolNameToId[program.school_name];
      
      if (!schoolId) {
        // 避免过多日志
        if (params.verbose) {
          console.warn(`警告: 找不到学校 "${program.school_name}" 的ID`);
        }
        return null; // 跳过没有找到学校ID的课程
      }
      
      return {
        school_id: schoolId,
        cn_name: program.major_name || '',
        en_name: program.ename || '',
        tags: program.tags ? program.tags.split(',').map(tag => tag.trim()) : [],
        introduction: program.introduction || '',
        apply_requirements: program.requirements || '',
        objectives: program.objectives || '',
        language_requirements: program.language_requirements || '',
        curriculum: program.curriculum || '',
        success_cases: program.success_cases || '',
        degree: '硕士', // 默认学位
      };
    }).filter(program => program !== null); // 过滤掉没有学校ID的课程
    
    // 步骤4: 批量插入课程数据
    console.log(`准备导入 ${programsToInsert.length} 个课程`);
    
    // 分批处理课程数据
    const programBatchSize = 50;
    if (params.verbose) {
      console.log(`将分 ${Math.ceil(programsToInsert.length / programBatchSize)} 批导入课程数据`);
    }
    
    for (let i = 0; i < programsToInsert.length; i += programBatchSize) {
      const batch = programsToInsert.slice(i, i + programBatchSize);
      if (params.verbose) {
        console.log(`导入第 ${Math.floor(i/programBatchSize) + 1} 批课程，包含 ${batch.length} 条记录`);
      }
      
      try {
        // 使用insert而不是upsert，因为programs表的字段组合可能也没有唯一约束
        const { error: programsError } = await supabase
          .from('programs')
          .insert(batch);
        
        if (programsError) {
          console.error(`导入第 ${Math.floor(i/programBatchSize) + 1} 批课程数据时出错:`, programsError);
          
          if (params.verbose) {
            // 尝试一条一条地插入
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
          }
        } else {
          console.log(`成功导入第 ${Math.floor(i/programBatchSize) + 1} 批课程数据，共 ${batch.length} 条记录`);
        }
      } catch (batchError) {
        console.error(`处理第 ${Math.floor(i/programBatchSize) + 1} 批课程时发生异常:`, batchError);
      }
    }
    
    console.log(`${getCountryName(country)}数据导入完成!`);
    
  } catch (err) {
    console.error('导入过程中出错:', err);
  }
}

// 获取国家中文名称
function getCountryName(country) {
  const countryNames = {
    'uk': '英国',
    'hongkong': '香港',
    'australia': '澳大利亚',
    'singapore': '新加坡',
    'macau': '澳门',
    'us': '美国',
    'canada': '加拿大'
  };
  
  return countryNames[country] || country;
}

// 执行导入
importProgrammes().catch(err => {
  console.error('程序执行出错:', err);
  process.exit(1);
}); 