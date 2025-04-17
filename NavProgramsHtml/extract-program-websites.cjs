const fs = require('fs');
const csv = require('csv-parser');

// 文件路径
const csvFilePath = '/Users/evanxu/Downloads/project/NavProgramsHtml/hk_programs_new.csv.bak'; // 使用备份文件，包含失败记录
const failedPagesPath = '/Users/evanxu/Downloads/project/NavProgramsHtml/failed_pages.txt';

// 先读取现有的failed_pages.txt文件
let existingUrls = [];
try {
  if (fs.existsSync(failedPagesPath)) {
    existingUrls = fs.readFileSync(failedPagesPath, 'utf8')
      .split('\n')
      .filter(line => line.trim() !== '');
    console.log(`已从failed_pages.txt加载 ${existingUrls.length} 条URL`);
  }
} catch (error) {
  console.error(`读取failed_pages.txt出错: ${error.message}`);
}

// 用于存储program_website的数组
const programWebsites = [];

// 读取CSV文件并提取program_website字段
fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('data', (row) => {
    // 查找中文名称为"获取失败"的记录
    const cnName = row['中文名称'] || row['cname'] || row['cn_name'] || '';
    const programWebsite = row['program_website'];
    
    if (cnName === '获取失败' && programWebsite) {
      // 提取项目ID并构造爬虫URL格式
      const websiteMatch = programWebsite.match(/majr_(\d+)/);
      if (websiteMatch && websiteMatch[1]) {
        const programId = websiteMatch[1];
        programWebsites.push(`https://www.compassedu.hk/majr_${programId}`);
        console.log(`找到失败记录，ID: ${programId}`);
      } else {
        programWebsites.push(programWebsite);
        console.log(`找到失败记录，无法提取ID: ${programWebsite}`);
      }
    }
  })
  .on('end', () => {
    console.log(`共从CSV中提取了 ${programWebsites.length} 条program_website URL`);
    
    // 合并新旧URL并去重
    const combinedUrls = [...new Set([...existingUrls, ...programWebsites])];
    console.log(`合并后共有 ${combinedUrls.length} 条唯一URL`);
    
    // 写入到failed_pages.txt
    fs.writeFileSync(failedPagesPath, combinedUrls.join('\n') + '\n');
    console.log(`已将 ${combinedUrls.length} 条URL写入到 ${failedPagesPath}`);
  })
  .on('error', (error) => {
    console.error(`读取CSV文件时出错: ${error.message}`);
  }); 