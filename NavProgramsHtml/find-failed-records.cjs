const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { createObjectCsvWriter } = require('csv-writer');

// 文件路径
const csvFilePath = '/Users/evanxu/Downloads/project/NavProgramsHtml/hk_programs_new.csv';
const failedPagesPath = '/Users/evanxu/Downloads/project/NavProgramsHtml/failed_pages.txt';
const newCsvFilePath = '/Users/evanxu/Downloads/project/NavProgramsHtml/hk_programs_filtered.csv';

// 用于存储所有记录和失败记录
const allRecords = [];
const failedRecords = [];
const failedUrls = [];

// 读取CSV文件并查找失败记录
console.log(`正在读取CSV文件: ${csvFilePath}`);

// 读取现有的failed_pages.txt内容
let existingFailedUrls = [];
try {
  if (fs.existsSync(failedPagesPath)) {
    existingFailedUrls = fs.readFileSync(failedPagesPath, 'utf8')
      .split('\n')
      .filter(line => line.trim() !== '');
    console.log(`已从failed_pages.txt加载 ${existingFailedUrls.length} 条URL`);
  }
} catch (error) {
  console.error(`读取failed_pages.txt出错: ${error.message}`);
}

// 读取CSV并处理数据
fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('data', (row) => {
    // 确保所有可能的字段名称都被考虑
    const cnName = row['中文名称'] || row['cname'] || row['cn_name'] || '';
    const url = row['项目链接'] || row['url'] || '';
    const programWebsite = row['program_website'] || row['官网'] || '';
    
    // 保存所有记录
    allRecords.push(row);
    
    // 检查是否为获取失败的记录
    if (cnName === '获取失败') {
      failedRecords.push(row);
      // 优先使用url字段，如果为空则使用program_website字段
      const effectiveUrl = url || programWebsite;
      if (effectiveUrl) {
        failedUrls.push(effectiveUrl);
        console.log(`找到失败记录: ${effectiveUrl}`);
      } else {
        console.log(`警告: 找到失败记录但URL为空: ${JSON.stringify(row)}`);
      }
    }
  })
  .on('end', async () => {
    // 统计失败记录数量
    console.log(`共找到 ${failedUrls.length} 条获取失败的记录`);
    
    // 处理并写入失败URL
    if (failedUrls.length > 0) {
      // 合并新旧失败URL并去重
      const combinedUrls = [...new Set([...existingFailedUrls, ...failedUrls])];
      console.log(`合并后共有 ${combinedUrls.length} 条唯一失败URL`);
      
      // 将失败记录URL写入到文件
      const failedUrlsText = combinedUrls.join('\n') + '\n';
      fs.writeFileSync(failedPagesPath, failedUrlsText);
      console.log(`已将 ${combinedUrls.length} 条失败记录URL写入到 ${failedPagesPath}`);
    } else {
      console.log('没有新的失败记录URL需要写入');
    }
    
    // 过滤掉失败记录，只保留成功的记录
    const successRecords = allRecords.filter(record => {
      const cnName = record['中文名称'] || record['cname'] || record['cn_name'] || '';
      return cnName !== '获取失败';
    });
    
    console.log(`过滤后保留 ${successRecords.length} 条成功记录`);
    
    // 获取CSV的表头
    const headers = Object.keys(allRecords[0] || {}).map(key => ({
      id: key,
      title: key
    }));
    
    // 创建CSV写入器
    const csvWriter = createObjectCsvWriter({
      path: newCsvFilePath,
      header: headers
    });
    
    // 写入过滤后的数据
    try {
      await csvWriter.writeRecords(successRecords);
      console.log(`已将过滤后的 ${successRecords.length} 条记录写入到 ${newCsvFilePath}`);
      
      // 备份原CSV文件
      const backupPath = csvFilePath + '.bak';
      fs.copyFileSync(csvFilePath, backupPath);
      console.log(`已将原CSV文件备份到 ${backupPath}`);
      
      // 替换原CSV文件
      fs.copyFileSync(newCsvFilePath, csvFilePath);
      console.log(`已用过滤后的数据替换原CSV文件 ${csvFilePath}`);
      
      // 删除临时文件
      fs.unlinkSync(newCsvFilePath);
    } catch (error) {
      console.error(`写入CSV文件时出错: ${error.message}`);
    }
  })
  .on('error', (error) => {
    console.error(`读取CSV文件时出错: ${error.message}`);
  }); 