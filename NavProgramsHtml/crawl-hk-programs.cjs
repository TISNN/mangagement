const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const { createObjectCsvWriter } = require('csv-writer');

// 设置CSV文件保存路径
const outputPath = path.join(__dirname, 'hk_programs_new.csv');

// 配置线程数
const NUM_WORKERS = 3;

// 随机延迟函数
const randomDelay = async (min = 2000, max = 5000) => {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  await new Promise(resolve => setTimeout(resolve, delay));
};

// 重试函数
const retry = async (fn, retries = 3, delay = 3000) => {
  let lastError;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      console.log(`尝试失败 (${i + 1}/${retries}): ${error.message}`);
      lastError = error;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw lastError;
};

// 检查文件是否存在
const fileExists = (filePath) => {
  try {
    return fs.existsSync(filePath);
  } catch (error) {
    return false;
  }
};

// CSV文件的表头
const csvHeader = [
  { id: 'id', title: 'ID' },
  { id: 'cname', title: '中文名称' },
  { id: 'ename', title: '英文名称' },
  { id: 'tags', title: '标签' },
  { id: 'school', title: '所属院校' },
  { id: 'direction', title: '专业方向' },
  { id: 'admission_time', title: '入学时间' },
  { id: 'duration', title: '项目时长' },
  { id: 'tuition', title: '项目学费' },
  { id: 'interview', title: '面试形式' },
  { id: 'objective', title: '培养目标' },
  { id: 'requirements', title: '申请要求' },
  { id: 'language', title: '语言要求' },
  { id: 'consultant_analysis', title: '顾问解析' },
  { id: 'curriculum', title: '课程设置' },
  { id: 'application_date', title: '申请时间' },
  { id: 'url', title: '项目链接' },
  { id: 'official_website', title: '项目官网' }
];

// 工作线程函数
if (!isMainThread) {
  // 工作线程代码
  const { urls, workerId, outputFilePath } = workerData;
  
  // 创建仅用于附加的CSV写入器
  const createAppendCsvWriter = (outputPath, header) => {
    const fileExists = fs.existsSync(outputPath);
    return createObjectCsvWriter({
      path: outputPath,
      header: header,
      append: fileExists // 如果文件存在则追加模式
    });
  };
  
  async function processUrls() {
    console.log(`工作线程 ${workerId} 启动，处理 ${urls.length} 个URL`);
    
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(60000);
    
    let processedCount = 0;
    
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      try {
        console.log(`线程 ${workerId} - 处理第 ${i + 1}/${urls.length} 个项目: ${url}`);
        await randomDelay();
        
        const projectDetails = await getProjectDetails(page, url);
        
        // 创建CSV写入器（追加模式）
        const csvWriter = createAppendCsvWriter(outputFilePath, csvHeader);
        
        // 立即写入一条数据
        await csvWriter.writeRecords([projectDetails]);
        processedCount++;
        
        console.log(`线程 ${workerId} - 已保存项目详情: ${projectDetails.cname}`);
      } catch (error) {
        console.error(`线程 ${workerId} - 处理项目失败 (${url}): ${error.message}`);
      }
    }
    
    await browser.close();
    console.log(`工作线程 ${workerId} 完成，成功处理并保存了 ${processedCount} 个项目`);
    
    // 将完成信息发送回主线程
    parentPort.postMessage({ completed: true, processedCount });
  }
  
  // 获取项目详情
  async function getProjectDetails(page, url) {
    try {
      console.log(`线程 ${workerId} - 正在获取项目详情: ${url}`);
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
      
      // 等待页面主要内容加载完成
      await page.waitForSelector('.new-majr-module', { timeout: 30000 });
      
      // 提取项目ID - 从URL中获取
      const id = url.split('_').pop();
      
      // 提取项目名称和英文名称
      const cname = await page.$eval('.info-level .cname', el => el.childNodes[0].textContent.trim());
      const ename = await page.$eval('.info-level .ename', el => el.textContent.trim());
      
      // 提取标签
      const tags = await page.$$eval('.info-level .tag-list .tag-item', els => els.map(el => el.textContent.trim()).join(', '));
      
      // 获取所属院校
      const school = await page.$eval('.module_content .layout__left .cname .text', el => el.textContent.trim())
        .catch(() => '无');
      
      // 提取项目简介信息
      const direction = await page.$eval('.project-list .project-item:nth-child(1) .value', el => el.textContent.trim())
        .catch(() => '无');
      
      const admission_time = await page.$eval('.project-list .project-item:nth-child(2) .value', el => el.textContent.trim())
        .catch(() => '无');
      
      const duration = await page.$eval('.project-list .project-item:nth-child(3) .value', el => el.textContent.trim())
        .catch(() => '无');
      
      const tuition = await page.$eval('.project-list .project-item:nth-child(4) .value', el => el.textContent.trim())
        .catch(() => '无');
      
      const interview = await page.$eval('.project-interview .value', el => el.textContent.trim())
        .catch(() => '无');
      
      // 提取培养目标（可能需要登录才能查看完整内容）
      const objective = await page.$eval('.detail__module__train_objective .richtext', el => el.textContent.trim())
        .catch(() => '无');
      
      // 提取申请要求
      const requirements = await page.$eval('.detail__module__limits .richtext', el => el.textContent.trim())
        .catch(() => '无');
      
      // 提取语言要求 - 组合雅思和托福的要求
      let language = '';
      try {
        const ielts = await page.$eval('.per-lang-box:nth-child(1) .total.value', el => `雅思: ${el.textContent.trim()}`);
        const toefl = await page.$eval('.per-lang-box:nth-child(2) .total.value', el => `托福: ${el.textContent.trim()}`);
        language = `${ielts}; ${toefl}`;
      } catch (error) {
        language = '无';
      }
      
      // 新增：提取顾问解析 - 修正选择器
      let consultant_analysis = '';
      try {
        // 首先检查页面是否有顾问解析部分
        const hasAnalysisSection = await page.evaluate(() => {
          return !!document.querySelector('.detail__module__viewpoint') || 
                 !!document.querySelector('.detail__module__analysis');
        });
        
        if (hasAnalysisSection) {
          // 尝试从viewpoint部分获取
          consultant_analysis = await page.evaluate(() => {
            // 先尝试直接从viewpoint获取
            const viewpointElement = document.querySelector('.detail__module__viewpoint .part__viewpoint .richtext');
            if (viewpointElement) {
              return viewpointElement.textContent.trim();
            }
            
            // 再尝试从analysis获取
            const analysisElement = document.querySelector('.detail__module__analysis .richtext');
            if (analysisElement) {
              return analysisElement.textContent.trim();
            }
            
            // 最后尝试从任何可能包含"顾问解析"的标题下面的内容获取
            const sections = document.querySelectorAll('.module_head .title');
            for (const section of sections) {
              if (section.textContent.includes('顾问解析') || section.textContent.includes('解析')) {
                const parent = section.closest('.detail__module');
                if (parent) {
                  const content = parent.querySelector('.richtext');
                  if (content) {
                    return content.textContent.trim();
                  }
                }
              }
            }
            
            return '';
          });
        }
      } catch (error) {
        console.error(`获取顾问解析失败: ${error.message}`);
      }
      
      if (!consultant_analysis) {
        consultant_analysis = '无';
      }
      
      // 新增：提取课程设置 - 修正选择器
      let curriculum = '';
      try {
        // 首先检查页面是否有课程设置部分
        const hasCurriculumSection = await page.evaluate(() => {
          return !!document.querySelector('.detail__module__curriculum') || 
                 !!document.querySelector('.curriculum-list');
        });
        
        if (hasCurriculumSection) {
          curriculum = await page.evaluate(() => {
            // 尝试从课程设置部分获取
            const curriculumListElement = document.querySelector('.curriculum-list');
            if (curriculumListElement) {
              const items = Array.from(curriculumListElement.querySelectorAll('.curriculum-item'));
              return items.map(item => {
                const cname = item.querySelector('.col-item-cname')?.textContent.trim() || '';
                const ename = item.querySelector('.col-item-ename')?.textContent.trim() || '';
                const format = item.querySelector('.col-item-format')?.textContent.trim() || '';
                return `${cname} ${ename} ${format}`.trim();
              }).join('; ');
            }
            
            // 尝试从其他可能的元素获取
            const curriculumElement = document.querySelector('.detail__module__curriculum .richtext');
            if (curriculumElement) {
              return curriculumElement.textContent.trim();
            }
            
            // 最后尝试从任何可能包含"课程设置"的标题下面的内容获取
            const sections = document.querySelectorAll('.module_head .title');
            for (const section of sections) {
              if (section.textContent.includes('课程设置') || section.textContent.includes('课程')) {
                const parent = section.closest('.detail__module');
                if (parent) {
                  const content = parent.querySelector('.richtext');
                  if (content) {
                    return content.textContent.trim();
                  }
                }
              }
            }
            
            return '';
          });
        }
      } catch (error) {
        console.error(`获取课程设置失败: ${error.message}`);
      }
      
      if (!curriculum) {
        curriculum = '未找到课程设置';
      }
      
      // 新增：提取申请时间 - 修正选择器
      let application_date = '';
      try {
        // 首先检查页面是否有申请时间部分
        const hasApplicationDateSection = await page.evaluate(() => {
          return !!document.querySelector('.detail__module__application_date') || 
                 !!document.querySelector('.detail__module__application_time');
        });
        
        if (hasApplicationDateSection) {
          application_date = await page.evaluate(() => {
            // 尝试从申请时间部分获取
            const dateElement = document.querySelector('.detail__module__application_date .richtext');
            if (dateElement) {
              return dateElement.textContent.trim();
            }
            
            const timeElement = document.querySelector('.detail__module__application_time .richtext');
            if (timeElement) {
              return timeElement.textContent.trim();
            }
            
            // 最后尝试从任何可能包含"申请时间"的标题下面的内容获取
            const sections = document.querySelectorAll('.module_head .title');
            for (const section of sections) {
              if (section.textContent.includes('申请时间') || section.textContent.includes('申请日期')) {
                const parent = section.closest('.detail__module');
                if (parent) {
                  const content = parent.querySelector('.richtext');
                  if (content) {
                    return content.textContent.trim();
                  }
                }
              }
            }
            
            return '';
          });
        }
      } catch (error) {
        console.error(`获取申请时间失败: ${error.message}`);
      }
      
      if (!application_date) {
        application_date = '未找到申请时间';
      }
      
      // 新增：提取项目官网
      let official_website = '无';
      try {
        // 修改：直接尝试获取学校官网，而不是项目在指南者网站上的链接
        official_website = await page.evaluate(() => {
          // 先尝试从所属院校部分获取学校官网
          const schoolLinks = document.querySelectorAll('.module_content .layout__left .cname a, .module_content .layout__left .ename a');
          for (const link of schoolLinks) {
            // 排除指南者自己的链接，获取指向学校官网的链接
            if (link.href && !link.href.includes('compassedu.hk')) {
              return link.href;
            }
          }
          
          // 如果没找到，尝试查找页面上所有外部链接
          const allLinks = document.querySelectorAll('a[href]');
          for (const link of allLinks) {
            const href = link.href;
            // 排除指南者自己的链接
            if (href && 
                !href.includes('compassedu.hk') && 
                !href.includes('javascript:') && 
                !href.includes('#')) {
              // 检查是否包含学校名称的关键词，提高准确性
              const schoolName = document.querySelector('.module_content .layout__left .cname .text')?.textContent.trim() || '';
              // 尝试分析链接是否有可能是学校网站
              if (isLikelyUniversityWebsite(href, schoolName)) {
                return href;
              }
            }
          }
          
          // 如果仍然没找到，返回无
          return '无';
          
          // 判断链接是否可能是大学官网的辅助函数
          function isLikelyUniversityWebsite(url, schoolName) {
            // 香港大学域名通常包含.edu.hk或.hk
            const eduDomains = ['.edu.hk', '.hk', '.hku.hk', '.ust.hk', '.cuhk.edu.hk', '.polyu.edu.hk', '.cityu.edu.hk', '.ouhk.edu.hk', '.ln.edu.hk', '.hkbu.edu.hk', '.eduhk.hk'];
            const isEduDomain = eduDomains.some(domain => url.includes(domain));
            
            // 如果是教育机构域名，很可能是学校官网
            if (isEduDomain) return true;
            
            // 如果链接包含学校名称关键词，也可能是学校网站
            if (schoolName) {
              // 从学校名称中提取关键词
              const schoolKeywords = schoolName.split(/[\s\(\)（）,，、]/g)
                .filter(word => word.length > 1)
                .map(word => word.toLowerCase());
              
              // 检查URL是否包含学校关键词
              const urlLower = url.toLowerCase();
              for (const keyword of schoolKeywords) {
                if (keyword.length > 2 && urlLower.includes(keyword)) {
                  return true;
                }
              }
            }
            
            return false;
          }
        });
        
        // 如果还是没找到，尝试使用所属院校名称构建可能的官网URL
        if (official_website === '无') {
          const schoolName = await page.$eval('.module_content .layout__left .ename', el => el.textContent.trim())
            .catch(() => '');
          
          if (schoolName) {
            // 香港主要大学的官网映射
            const hkUniversities = {
              'The University of Hong Kong': 'https://www.hku.hk',
              'The Chinese University of Hong Kong': 'https://www.cuhk.edu.hk',
              'The Hong Kong University of Science and Technology': 'https://www.ust.hk',
              'City University of Hong Kong': 'https://www.cityu.edu.hk',
              'The Hong Kong Polytechnic University': 'https://www.polyu.edu.hk',
              'Hong Kong Baptist University': 'https://www.hkbu.edu.hk',
              'Lingnan University': 'https://www.ln.edu.hk',
              'The Education University of Hong Kong': 'https://www.eduhk.hk',
              'The Open University of Hong Kong': 'https://www.ouhk.edu.hk',
              'The Hang Seng University of Hong Kong': 'https://www.hsu.edu.hk'
            };
            
            // 检查学校名称是否在映射表中
            for (const [university, website] of Object.entries(hkUniversities)) {
              if (schoolName.includes(university)) {
                official_website = website;
                break;
              }
            }
          }
        }
      } catch (error) {
        console.error(`获取项目官网失败: ${error.message}`);
        official_website = '无';
      }
      
      return {
        id,
        cname,
        ename,
        tags,
        school,
        direction,
        admission_time,
        duration,
        tuition,
        interview,
        objective,
        requirements,
        language,
        consultant_analysis,
        curriculum,
        application_date,
        url,
        official_website
      };
    } catch (error) {
      console.error(`线程 ${workerId} - 获取项目详情出错 (${url}): ${error.message}`);
      return {
        id: url.split('_').pop(),
        cname: '获取失败',
        ename: '获取失败',
        tags: '',
        school: '',
        direction: '',
        admission_time: '',
        duration: '',
        tuition: '',
        interview: '',
        objective: '',
        requirements: '',
        language: '',
        consultant_analysis: '',
        curriculum: '',
        application_date: '',
        url,
        official_website: '无'
      };
    }
  }
  
  // 执行URL处理
  processUrls().catch(error => {
    console.error(`工作线程 ${workerId} 出错: ${error.message}`);
    parentPort.postMessage({ completed: true, processedCount: 0, error: error.message });
  });
  
} else {
  // 主线程代码
  
  // 初始化CSV文件（如果不存在）
  function initCsvFile() {
    if (!fileExists(outputPath)) {
      const csvWriter = createObjectCsvWriter({
        path: outputPath,
        header: csvHeader
      });
      
      // 写入一个空记录来初始化CSV文件
      return csvWriter.writeRecords([]);
    }
    return Promise.resolve();
  }

  // 获取项目URL列表
  async function getProjectUrls(baseUrl, totalPages = 24) {
    console.log(`准备获取全部 ${totalPages} 页的项目列表`);
    const allProjectUrls = [];
    
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(60000);
    
    try {
      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        // 正确构造URL格式 (baseUrl=https://www.compassedu.hk/class_c11)
        const url = `${baseUrl}p${pageNum}`;
        console.log(`正在获取第 ${pageNum}/${totalPages} 页项目列表: ${url}`);
        
        try {
          await retry(async () => {
            await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
            await randomDelay(1000, 3000);
            
            // 等待项目列表加载完成
            await page.waitForSelector('.result-list', { timeout: 30000 });
          });
          
          // 获取项目URL列表
          const pageUrls = await page.$$eval('.result-list a.majr-item', links => {
            return links.map(link => link.href);
          });
          
          // 检查此页面获取的URL数量
          if (pageUrls.length === 0) {
            console.log(`警告：第 ${pageNum} 页没有找到任何URL，可能页面结构已变化`);
            
            // 保存页面截图以便调试
            await page.screenshot({ path: `page-${pageNum}-error.png` });
            
            // 保存页面HTML以便分析
            const html = await page.content();
            fs.writeFileSync(`page-${pageNum}-error.html`, html);
            
            console.log(`已保存页面截图和HTML，请检查页面结构`);
            continue;
          }
          
          console.log(`第 ${pageNum} 页找到 ${pageUrls.length} 个项目URL`);
          
          // 添加URL前检查是否有重复
          const newUrls = [];
          for (const url of pageUrls) {
            if (!allProjectUrls.includes(url)) {
              newUrls.push(url);
              allProjectUrls.push(url);
            }
          }
          
          console.log(`添加了 ${newUrls.length} 个新URL，当前总共 ${allProjectUrls.length} 个URL`);
          
          // 在页面之间添加延迟，避免请求过于频繁
          if (pageNum < totalPages) {
            const waitTime = Math.floor(Math.random() * 3000) + 3000; // 3-6秒
            console.log(`等待 ${waitTime/1000} 秒后获取下一页...`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
          }
          
        } catch (error) {
          console.error(`处理第 ${pageNum} 页时出错: ${error.message}`);
          
          // 如果连续多页出错，可能是被封IP，增加等待时间
          console.log(`增加等待时间后继续...`);
          await new Promise(resolve => setTimeout(resolve, 10000)); // 等待10秒
        }
      }
      
      console.log(`全部 ${totalPages} 页爬取完成，共找到 ${allProjectUrls.length} 个项目URL`);
      
      // 去重URL
      const uniqueUrls = [...new Set(allProjectUrls)];
      console.log(`URL去重后，共有 ${uniqueUrls.length} 个唯一URL`);
      
      await browser.close();
      return uniqueUrls;
      
    } catch (error) {
      console.error(`获取项目列表出错: ${error.message}`);
      await browser.close();
      return allProjectUrls; // 返回已获取的URL，即使遇到错误
    }
  }

  // 主函数
  async function main() {
    console.log('开始爬取香港硕士项目数据（多线程版 - 即时保存）...');
    console.log(`数据将保存至: ${outputPath}`);
    console.log(`使用 ${NUM_WORKERS} 个工作线程`);
    
    try {
      // 初始化CSV文件
      await initCsvFile();
      
      // 获取项目URL列表，爬取全部24页
      // 正确的基础URL应该是 https://www.compassedu.hk/class_c11
      const projectUrls = await getProjectUrls('https://www.compassedu.hk/class_c11', 24);
      
      if (projectUrls.length === 0) {
        console.log('未找到任何项目URL，程序退出');
        return;
      }
      
      // 创建工作线程并分配URL
      const workers = [];
      let completedWorkers = 0;
      let totalProcessed = 0;
      
      // 计算每个线程处理的URL数量
      const urlsPerWorker = Math.ceil(projectUrls.length / NUM_WORKERS);
      
      // 创建Promise来等待所有工作线程完成
      const workerPromise = new Promise((resolve) => {
        // 为每个工作线程分配URL
        for (let i = 0; i < NUM_WORKERS; i++) {
          const start = i * urlsPerWorker;
          const end = Math.min(start + urlsPerWorker, projectUrls.length);
          const workerUrls = projectUrls.slice(start, end);
          
          if (workerUrls.length === 0) continue;
          
          // 输出分配给该线程的前三个URL（用于调试）
          const previewUrls = workerUrls.slice(0, 3).map(url => url.split('/').pop()).join(', ');
          console.log(`线程 ${i + 1} 分配了 ${workerUrls.length} 个URL，前几个ID: ${previewUrls}...`);
          
          const worker = new Worker(__filename, {
            workerData: {
              urls: workerUrls,
              workerId: i + 1,
              outputFilePath: outputPath
            }
          });
          
          worker.on('message', (result) => {
            console.log(`工作线程 ${i + 1} 已完成，处理了 ${result.processedCount} 个项目`);
            totalProcessed += result.processedCount;
            completedWorkers++;
            
            if (completedWorkers === workers.length) {
              resolve();
            }
          });
          
          worker.on('error', (error) => {
            console.error(`工作线程 ${i + 1} 发生错误: ${error.message}`);
            completedWorkers++;
            
            if (completedWorkers === workers.length) {
              resolve();
            }
          });
          
          worker.on('exit', (code) => {
            if (code !== 0) {
              console.error(`工作线程 ${i + 1} 异常退出，退出码 ${code}`);
            }
          });
          
          workers.push(worker);
          console.log(`已创建工作线程 ${i + 1}，分配了 ${workerUrls.length} 个URL`);
        }
      });
      
      // 等待所有工作线程完成
      await workerPromise;
      
      console.log(`所有工作线程已完成，成功爬取 ${totalProcessed} 个项目数据，保存到 ${outputPath}`);
      
    } catch (error) {
      console.error(`主程序执行出错: ${error.message}`);
    }
  }

  // 执行主函数
  main().catch(console.error);
} 