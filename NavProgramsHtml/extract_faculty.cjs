const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const { stringify } = require('csv-stringify/sync');

// 输入文件路径
const inputFilePath = path.join(__dirname, 'uk_programs_new.csv');
// 输出文件路径
const outputFilePath = path.join(__dirname, 'uk_programs_new_with_faculty.csv');

// 读取CSV文件
const fileContent = fs.readFileSync(inputFilePath, 'utf8');

// 解析CSV数据
const records = parse(fileContent, {
  columns: true,
  skip_empty_lines: true
});

console.log('CSV文件中的字段:', Object.keys(records[0]).join(', '));

// 提取学院信息并添加到新字段
const enhancedRecords = records.map(record => {
  // 从标签字段中提取学院信息
  // 标签格式通常是 "商科, 管理, 商学院" 或 "社科, 教育, 教育学院"
  let faculty = '';
  
  // 检查标签字段的名称（可能是'标签'或'tags'）
  const tagsField = record.标签 || record.tags;
  
  if (tagsField) {
    const tags = tagsField.split(',');
    if (tags.length >= 3) {
      // 学院通常是第三个元素，去除前后空格
      faculty = tags[2].trim();
    }
  }
  
  // 创建新记录，包含原始数据和新的学院字段
  const result = { ...record, faculty: faculty };
  
  // 确保提取的学院信息显示在控制台，用于调试
  if (faculty) {
    console.log(`从"${tagsField}"提取学院信息: "${faculty}"`);
  }
  
  return result;
});

// 获取原始数据的所有字段名，并添加'faculty'
const originalColumns = Object.keys(records[0]);
const outputColumns = [...originalColumns];

// 确保'faculty'字段在'标签'或'tags'字段之后
const tagsIndex = outputColumns.findIndex(col => col === '标签' || col === 'tags');
if (tagsIndex !== -1 && !outputColumns.includes('faculty')) {
  outputColumns.splice(tagsIndex + 1, 0, 'faculty');
}

console.log('输出字段:', outputColumns.join(', '));

// 将修改后的数据写入新CSV文件
const output = stringify(enhancedRecords, {
  header: true,
  columns: outputColumns
});

fs.writeFileSync(outputFilePath, output);

console.log(`处理完成，共处理 ${enhancedRecords.length} 条记录`);
console.log(`新文件已保存到: ${outputFilePath}`); 