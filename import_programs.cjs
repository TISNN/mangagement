// import_programs.js
// 导入必要的库
const fs = require('fs');
const csv = require('csv-parser');
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// 设置调试模式
const DEBUG = process.argv.includes('--debug');

// 调试日志函数
function debug(message, data) {
  if (DEBUG) {
    console.log('\x1b[33m[调试]\x1b[0m', message);
    if (data !== undefined) {
      if (typeof data === 'object') {
        console.log(JSON.stringify(data, null, 2));
      } else {
        console.log(data);
      }
    }
  }
}

// 加载环境变量
dotenv.config();
debug('环境变量已加载');

// 创建Supabase客户端
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('错误: 环境变量中缺少Supabase配置。请确保.env文件包含VITE_SUPABASE_URL和VITE_SUPABASE_ANON_KEY。');
  process.exit(1);
}

debug('Supabase连接信息', { url: supabaseUrl, keyLength: supabaseKey?.length });

const supabase = createClient(supabaseUrl, supabaseKey);
debug('Supabase客户端已创建');

// CSV文件路径 - 默认为当前目录下的programs_data.csv
// 可以通过命令行参数指定不同的文件路径
const CSV_FILE_PATH = process.argv.find(arg => arg.endsWith('.csv')) || './uk_programs_new_with_faculty.csv';
debug('CSV文件路径', CSV_FILE_PATH);

// 验证CSV文件是否存在
if (!fs.existsSync(CSV_FILE_PATH)) {
  console.error(`错误: 找不到CSV文件: ${CSV_FILE_PATH}`);
  console.log('请提供有效的CSV文件路径，或将CSV文件放在当前目录下并命名为uk_programs_new_with_faculty.csv');
  
  // 列出当前目录中的所有CSV文件
  const currentDirFiles = fs.readdirSync('.');
  const csvFiles = currentDirFiles.filter(file => file.endsWith('.csv'));
  
  if (csvFiles.length > 0) {
    console.log('\n当前目录下的CSV文件:');
    csvFiles.forEach(file => console.log(`- ${file}`));
    console.log('\n您可以使用以下命令指定CSV文件:');
    console.log(`node import_programs.js ${csvFiles[0]}`);
  }
  
  process.exit(1);
}

// 设置导入模式 - 'insert'(只插入新记录) 或 'upsert'(插入或更新)
const IMPORT_MODE = process.argv.includes('upsert') ? 'upsert' : 'insert';
debug('导入模式', IMPORT_MODE);

// 设置批处理大小
const BATCH_SIZE = process.argv.includes('--batch-size') 
  ? parseInt(process.argv[process.argv.indexOf('--batch-size') + 1], 10) 
  : 50;
debug('批处理大小', BATCH_SIZE);

// 缓存学校名称到ID的映射
let schoolNameToIdMap = {};

// 测试Supabase连接
async function testConnection() {
  try {
    debug('测试Supabase连接...');
    const { data, error } = await supabase.from('schools').select('id').limit(1);
    
    if (error) {
      console.error('Supabase连接测试失败:', error);
      return false;
    }
    
    console.log('✅ Supabase连接测试成功');
    return true;
  } catch (error) {
    console.error('Supabase连接测试异常:', error);
    return false;
  }
}

// 根据学校名称查询schools表获取ID
async function loadAllSchools() {
  try {
    console.log('正在加载学校数据...');
    
    // 查询schools表中的所有学校
    const { data, error } = await supabase
      .from('schools')
      .select('id, en_name, cn_name');

    if (error) {
      console.error('加载学校数据时出错:', error);
      return {};
    }

    debug('schools表查询结果', { count: data?.length, firstItems: data?.slice(0, 3) });

    if (!data || data.length === 0) {
      console.warn('警告: schools表中没有找到任何学校数据');
      return {};
    }

    console.log(`成功加载 ${data.length} 所学校数据`);
    
    // 创建名称到ID的映射对象
    const map = {};
    data.forEach(school => {
      // 使用英文名称和中文名称作为键（都转换为小写以便不区分大小写比较）
      if (school.en_name) map[school.en_name.toLowerCase()] = school.id;
      if (school.cn_name) map[school.cn_name.toLowerCase()] = school.id;
    });
    
    debug('学校名称到ID的映射示例', Object.entries(map).slice(0, 5));
    
    return map;
  } catch (error) {
    console.error('加载学校数据时出错:', error);
    debug('加载学校数据异常详情', error);
    return {};
  }
}

// 根据学校名称查找学校ID
function findSchoolIdByName(schoolName, nameToIdMap) {
  if (!schoolName || typeof schoolName !== 'string') {
    debug('查找学校ID: 无效的学校名称', schoolName);
    return null;
  }
  
  // 转换为小写进行比较
  const schoolNameLower = schoolName.trim().toLowerCase();
  debug('查找学校ID', { 原始名称: schoolName, 处理后名称: schoolNameLower });
  
  // 直接查找完全匹配
  if (nameToIdMap[schoolNameLower]) {
    debug('找到完全匹配的学校ID', { 名称: schoolNameLower, ID: nameToIdMap[schoolNameLower] });
    return nameToIdMap[schoolNameLower];
  }
  
  // 尝试查找部分匹配
  for (const [name, id] of Object.entries(nameToIdMap)) {
    if (schoolNameLower.includes(name) || name.includes(schoolNameLower)) {
      debug('找到部分匹配的学校ID', { 名称1: schoolNameLower, 名称2: name, ID: id });
      return id;
    }
  }
  
  debug('未找到匹配的学校ID', { 名称: schoolNameLower });
  return null;
}

// 验证CSV的列结构
function validateCsvColumns(firstRow) {
  const requiredColumns = ['school', 'en_name'];
  const missingColumns = requiredColumns.filter(col => !(col in firstRow));
  
  if (missingColumns.length > 0) {
    console.warn(`警告: CSV文件缺少以下推荐的列: ${missingColumns.join(', ')}`);
    debug('CSV首行数据', firstRow);
    
    // 检查是否同时缺少school和school_id
    if (!('school' in firstRow) && !('school_id' in firstRow)) {
      console.error('错误: CSV文件必须包含school或school_id列中的至少一个');
      return false;
    }
  }
  
  return true;
}

// 读取并解析CSV文件，然后上传到Supabase
async function importProgramsFromCSV() {
  try {
    console.log(`开始导入程序数据，模式: ${IMPORT_MODE}...`);
    console.log(`CSV文件路径: ${path.resolve(CSV_FILE_PATH)}`);
    
    // 测试Supabase连接
    const connectionValid = await testConnection();
    if (!connectionValid) {
      console.error('无法连接到Supabase，请检查配置。');
      process.exit(1);
    }
    
    // 加载所有学校数据，创建名称到ID的映射
    schoolNameToIdMap = await loadAllSchools();
    
    if (Object.keys(schoolNameToIdMap).length === 0) {
      console.error('错误: 无法加载学校数据，请确保schools表中有数据');
      process.exit(1);
    }
    
    const results = [];
    const invalidRows = [];
    const notFoundSchools = new Set();
    let hasValidatedColumns = false;

    // 读取CSV文件
    await new Promise((resolve, reject) => {
      fs.createReadStream(CSV_FILE_PATH)
        .pipe(csv())
        .on('data', (data) => {
          // 验证CSV列结构（仅对第一行进行）
          if (!hasValidatedColumns) {
            if (!validateCsvColumns(data)) {
              reject(new Error('CSV文件结构无效，缺少必要列'));
              return;
            }
            hasValidatedColumns = true;
            debug('CSV列验证通过');
          }
          
          // 根据学校名称查找school_id
          let schoolId = null;
          
          // 首先检查CSV是否有school_id字段且不为空
          if (data.school_id && data.school_id.trim() !== '') {
            schoolId = data.school_id.trim();
            debug('使用CSV中的school_id', schoolId);
          } 
          // 如果没有school_id或为空，则尝试通过school名称查找
          else if (data.school) {
            schoolId = findSchoolIdByName(data.school, schoolNameToIdMap);
            
            if (!schoolId) {
              notFoundSchools.add(data.school);
              invalidRows.push({ row: data, reason: `找不到匹配的学校ID: ${data.school}` });
              return; // 跳过这条记录
            }
            
            debug('通过学校名称找到ID', { 名称: data.school, ID: schoolId });
          } else {
            invalidRows.push({ row: data, reason: '既没有school_id字段也没有school字段' });
            return; // 跳过这条记录
          }
          
          // 创建新的记录对象，添加找到的school_id
          const record = { ...data, school_id: schoolId };
          results.push(record);
        })
        .on('end', resolve)
        .on('error', (err) => {
          console.error('读取CSV文件时出错:', err);
          debug('CSV读取错误详情', err);
          reject(err);
        });
    });

    console.log(`成功读取 ${results.length} 条数据记录`);
    
    if (notFoundSchools.size > 0) {
      console.warn(`警告: 以下 ${notFoundSchools.size} 所学校在学校数据库中找不到匹配记录:`);
      console.log(Array.from(notFoundSchools).slice(0, 10).join(', ') + (notFoundSchools.size > 10 ? '...' : ''));
    }
    
    if (invalidRows.length > 0) {
      console.warn(`警告: ${invalidRows.length} 条记录因缺少必要字段或学校不匹配而被跳过`);
      console.log('无效记录示例:', invalidRows.slice(0, 3).map(r => ({...r.row, reason: r.reason})));
    }

    if (results.length === 0) {
      console.error('没有有效的记录可导入。请检查您的CSV文件和schools表。');
      process.exit(1);
    }

    // 批量处理，每批BATCH_SIZE条记录
    const batches = Math.ceil(results.length / BATCH_SIZE);
    let totalImported = 0;
    let totalErrors = 0;

    debug('准备批量导入', { 总记录数: results.length, 批次数: batches, 每批大小: BATCH_SIZE });
    
    for (let i = 0; i < batches; i++) {
      const start = i * BATCH_SIZE;
      const end = Math.min(start + BATCH_SIZE, results.length);
      const batch = results.slice(start, end);

      debug(`处理第${i+1}/${batches}批，记录范围: ${start+1}-${end}`);
      
      // 准备数据 - 确保字段名与数据库字段匹配
      const formattedData = batch.map(row => {
        // 尝试将school_id转换为数字类型(如果它是一个有效的数字)
        const schoolId = isNaN(Number(row.school_id)) ? row.school_id : Number(row.school_id);
        
        return {
          school_id: schoolId,
          en_name: row.en_name || '',
          duration: row.duration || '',
          apply_requirements: row.apply_requirements || '',
          cn_name: row.cn_name || '',
          language_requirements: row.language_requirements || '',
          curriculum: row.curriculum || '',
          tags: row.tags || '',
          objectives: row.objectives || '',
          faculty: row.faculty || '',
          category: row.category || '',
          entry_month: row.entry_month || '',
          interview: row.interview || '',
          analysis: row.analysis || '',
          url: row.url || '',
          tuition_fee: row.tuition_fee || '',
          degree: row.degree || ''
          // created_at和updated_at字段会由Supabase自动处理
        };
      });

      debug('第一条格式化记录示例', formattedData[0]);
      
      let response;
      
      // 根据导入模式选择插入或更新数据
      if (IMPORT_MODE === 'upsert') {
        // 使用upsert模式 - 如果记录已存在则更新，否则插入
        debug('使用upsert模式导入', { 记录数: formattedData.length });
        response = await supabase
          .from('programs')
          .upsert(formattedData, { 
            onConflict: 'school_id,en_name', // 指定冲突检测的字段
            ignoreDuplicates: false // 不忽略重复，而是更新
          });
      } else {
        // 默认使用insert模式 - 只插入新记录
        debug('使用insert模式导入', { 记录数: formattedData.length });
        response = await supabase
          .from('programs')
          .insert(formattedData);
      }

      const { data, error } = response;
      debug('Supabase响应', { error: error ? { message: error.message, code: error.code } : null });

      if (error) {
        console.error(`第${i+1}批数据导入失败:`, error);
        debug('导入错误详情', { error, 首条记录: formattedData[0] });
        totalErrors++;
      } else {
        console.log(`成功导入第${i+1}批数据，共${end - start}条记录`);
        totalImported += (end - start);
      }
    }

    console.log('\n导入摘要:');
    console.log(`- 总记录数: ${results.length}`);
    console.log(`- 成功导入: ${totalImported}`);
    console.log(`- 导入失败批次数: ${totalErrors}`);
    
    if (invalidRows.length > 0) {
      console.log(`- 跳过的无效记录: ${invalidRows.length}`);
    }
    
    if (notFoundSchools.size > 0) {
      console.log(`- 找不到匹配学校: ${notFoundSchools.size}所`);
    }
    
    console.log('\n数据导入完成！');

  } catch (error) {
    console.error('导入过程中出错:', error);
    debug('导入异常详情', error);
    process.exit(1);
  }
}

// 显示使用帮助
function showHelp() {
  console.log('\n用法: node import_programs.js [CSV文件路径] [导入模式] [选项]');
  console.log('\n参数:');
  console.log('  CSV文件路径    CSV数据文件的路径，默认为"./programs_data.csv"');
  console.log('  导入模式       "insert"(只插入新记录)或"upsert"(插入或更新)，默认为"insert"');
  console.log('\n选项:');
  console.log('  --debug        启用调试模式，显示详细日志');
  console.log('  --batch-size N 设置批量导入的大小，默认为50');
  console.log('  --help, -h     显示此帮助信息');
  console.log('\n示例:');
  console.log('  node import_programs.js');
  console.log('  node import_programs.js ./my_data.csv');
  console.log('  node import_programs.js ./my_data.csv upsert');
  console.log('  node import_programs.js --debug');
  console.log('  node import_programs.js ./my_data.csv --batch-size 20');
}

// 处理命令行参数
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  showHelp();
  process.exit(0);
}

// 验证导入模式
if (IMPORT_MODE !== 'insert' && IMPORT_MODE !== 'upsert') {
  console.error(`错误: 无效的导入模式: ${IMPORT_MODE}`);
  console.log('有效的导入模式为: "insert" 或 "upsert"');
  showHelp();
  process.exit(1);
}

// 执行导入函数
importProgramsFromCSV(); 