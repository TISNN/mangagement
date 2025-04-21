// 爬取美国大学数据并保存为CSV
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// 创建CSV文件并写入表头
const csvFilePath = path.join(__dirname, 'australia_universities.csv');
fs.writeFileSync(csvFilePath, 'id,cname,ename,ranking,tag_list,introduction,url\n', 'utf8');

// 获取一级页面的大学列表
async function parseFirstPage(browser, pageNum) {
  try {
    console.log(`正在爬取第${pageNum}页的数据...`);
    const page = await browser.newPage();
    
    // 设置超时
    page.setDefaultNavigationTimeout(60000);
    
    // 访问列表页
    await page.goto(`https://www.compassedu.hk/university_9_${pageNum}`, {
      waitUntil: 'networkidle2'
    });
    
    // 提取大学信息
    const universities = await page.evaluate(() => {
      const results = [];
      const univItems = document.querySelectorAll('.univ-item');
      
      univItems.forEach(item => {
        const linkElement = item.querySelector('.slot_mid > a');
        if (!linkElement) return;
        
        const link = linkElement.getAttribute('href');
        const id = link.split('_')[1];
        const cname = item.querySelector('.cname').textContent.trim();
        const ename = item.querySelector('.ename').textContent.trim();
        
        // 获取排名信息
        let ranking = '';
        const rankElement = item.querySelector('.sort');
        if (rankElement) {
          const rankText = rankElement.textContent;
          const match = rankText.match(/U\.S\. qs排名：(\d+)/);
          if (match) {
            ranking = match[1];
          }
        }
        
        // 获取标签
        const tags = [];
        const tagElements = item.querySelectorAll('.tag-item');
        tagElements.forEach(tag => {
          tags.push(tag.textContent.trim());
        });
        
        results.push({
          id,
          cname,
          ename,
          ranking,
          tags: tags.join('|'),
          url: `https://www.compassedu.hk${link}`
        });
      });
      
      return results;
    });
    
    await page.close();
    return universities;
  } catch (error) {
    console.error(`爬取第${pageNum}页失败:`, error.message);
    return [];
  }
}

// 获取二级页面的大学详情
async function parseSecondPage(browser, university) {
  try {
    console.log(`正在爬取 ${university.cname} 的详细信息...`);
    const page = await browser.newPage();
    
    // 设置超时
    page.setDefaultNavigationTimeout(60000);
    
    // 访问详情页
    await page.goto(university.url, {
      waitUntil: 'networkidle2'
    });
    
    // 提取学校简介
    const introduction = await page.evaluate(() => {
      const contentElement = document.querySelector('.detail__module__univdesc .module_content');
      if (!contentElement) return '';
      
      let text = contentElement.textContent.trim();
      // 清理HTML实体和多余空白
      text = text.replace(/&lt;p&gt;|&lt;\/p&gt;/g, '').trim();
      text = text.replace(/\s+/g, ' ');
      
      return text;
    });
    
    await page.close();
    
    // 准备CSV数据，处理引号和逗号
    let cleanIntroduction = introduction.replace(/"/g, '""');
    if (cleanIntroduction.includes(',')) {
      cleanIntroduction = `"${cleanIntroduction}"`;
    }
    
    return {
      ...university,
      introduction: cleanIntroduction
    };
  } catch (error) {
    console.error(`爬取 ${university.cname} 详细信息失败:`, error.message);
    return university;
  }
}

// 将大学信息写入CSV文件
function appendToCSV(university) {
  const csvLine = `${university.id},${university.cname},${university.ename},${university.ranking},${university.tags},${university.introduction},${university.url}\n`;
  fs.appendFileSync(csvFilePath, csvLine, 'utf8');
}

// 主函数
async function main() {
  // 启动浏览器
  const browser = await puppeteer.launch({
    headless: 'new', // 使用新版无头模式
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu'
    ]
  });
  
  try {
    // 美国大学数据有7页
    const totalPages = 7;
    
    for (let page = 1; page <= totalPages; page++) {
      const universities = await parseFirstPage(browser, page);
      console.log(`第${page}页找到 ${universities.length} 所大学`);
      
      // 处理每所大学的详细信息
      for (const university of universities) {
        const detailedUniversity = await parseSecondPage(browser, university);
        appendToCSV(detailedUniversity);
        
        // 随机延迟，避免请求过快
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      }
      
      // 页面之间添加延迟
      if (page < totalPages) {
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }
    
    console.log('爬取完成！数据已保存到', csvFilePath);
  } catch (error) {
    console.error('程序运行出错:', error);
  } finally {
    // 关闭浏览器
    await browser.close();
  }
}

main();