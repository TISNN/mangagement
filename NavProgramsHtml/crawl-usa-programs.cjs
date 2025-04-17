const puppeteer = require('puppeteer');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs').promises;
const path = require('path');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

// 配置参数
const CONFIG = {
    baseUrl: 'https://www.compassedu.hk/class_c12',  // 修改基础URL
    totalPages: 67,
    workerCount: 5, // 单线程执行
    outputPath: path.join(__dirname, 'usa_programs.csv'),
    urlsJsonPath: path.join(__dirname, 'usa_program_urls.json'),
    progressJsonPath: path.join(__dirname, 'usa_program_urls_progress.json'),
    retryLimit: 5,
    retryDelay: 8000,
    pageTimeout: 90000,
    navigationTimeout: 90000,
    minDelay: 5000,
    maxDelay: 12000,
    proxyList: [
        'http://127.0.0.1:7890',  // 如果用户有代理，可以在这里配置
        'direct://'  // 直连
    ]
};

// 更完整的请求头
function getRandomHeaders() {
    const userAgents = [
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2.1 Safari/605.1.15'
    ];
    
    return {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Cache-Control': 'max-age=0',
        'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"macOS"',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1',
        'User-Agent': userAgents[Math.floor(Math.random() * userAgents.length)]
    };
}

// CSV表头定义
const csvWriter = createCsvWriter({
    path: CONFIG.outputPath,
    header: [
        {id: 'id', title: 'ID'},
        {id: 'cnName', title: '中文名称'},
        {id: 'enName', title: '英文名称'},
        {id: 'tags', title: '标签'},
        {id: 'school', title: '所属院校'},
        {id: 'direction', title: '专业方向'},
        {id: 'entryTime', title: '入学时间'},
        {id: 'duration', title: '项目时长'},
        {id: 'tuition', title: '项目学费'},
        {id: 'projectSize', title: '项目规模'},
        {id: 'employmentRate', title: '就业比例'},
        {id: 'interview', title: '面试形式'},
        {id: 'objectives', title: '培养目标'},
        {id: 'requirements', title: '申请要求'},
        {id: 'languageReq', title: '语言要求'},
        {id: 'analysis', title: '顾问解析'},
        {id: 'curriculum', title: '课程设置'},
        {id: 'applyTime', title: '申请时间'},
        {id: 'projectUrl', title: '项目链接'},
        {id: 'officialUrl', title: '项目官网'},
        {id: 'ranking', title: '排名'},
        {id: 'schoolType', title: '学校类型'},
        {id: 'isSTEM', title: '是否STEM'}
    ]
});

// 随机延迟函数
const randomDelay = async (min = CONFIG.minDelay, max = CONFIG.maxDelay) => {
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    const jitter = Math.floor(Math.random() * 200) - 100; // 添加随机抖动
    await new Promise(resolve => setTimeout(resolve, delay + jitter));
};

// 检查页面结构
async function checkPageStructure(page) {
    return await page.evaluate(() => {
        const selectors = {
            'result-list': !!document.querySelector('.result-list'),
            'majr-item': !!document.querySelector('.majr-item'),
            'majr-item-link': !!document.querySelector('.majr-item a'),
            'program-list': !!document.querySelector('.program-list'),
            'list-wrap': !!document.querySelector('.list-wrap')
        };
        
        const html = document.documentElement.innerHTML;
        return {
            selectors,
            title: document.title,
            url: window.location.href,
            hasContent: html.length > 0,
            possibleSelectors: Array.from(document.querySelectorAll('*'))
                .slice(0, 10)
                .map(el => ({
                    tag: el.tagName.toLowerCase(),
                    id: el.id,
                    classes: Array.from(el.classList)
                }))
        };
    });
}

// 初始化浏览器页面
async function initPage(browser) {
    const page = await browser.newPage();
    
    // 设置视口
    await page.setViewport({
        width: 1920,
        height: 1080,
        deviceScaleFactor: 1,
    });
    
    // 设置更多的浏览器特性
    await page.evaluateOnNewDocument(() => {
        // 添加更多浏览器特性
        Object.defineProperty(navigator, 'plugins', {
            get: () => [
                {
                    0: {type: "application/x-google-chrome-pdf", suffixes: "pdf", description: "Portable Document Format"},
                    description: "Portable Document Format",
                    filename: "internal-pdf-viewer",
                    length: 1,
                    name: "Chrome PDF Plugin"
                }
            ]
        });

        // 添加Canvas指纹
        const originalGetContext = HTMLCanvasElement.prototype.getContext;
        HTMLCanvasElement.prototype.getContext = function(type) {
            const context = originalGetContext.apply(this, arguments);
            if (type === '2d') {
                context.fillText = function() {
                    return undefined;
                };
            }
            return context;
        };

        // 添加WebGL
        Object.defineProperty(navigator, 'webgl', {
            get: () => true
        });

        // 添加更多的浏览器功能
        window.chrome = {
            app: {
                isInstalled: false,
                InstallState: {
                    DISABLED: 'disabled',
                    INSTALLED: 'installed',
                    NOT_INSTALLED: 'not_installed'
                },
                RunningState: {
                    CANNOT_RUN: 'cannot_run',
                    READY_TO_RUN: 'ready_to_run',
                    RUNNING: 'running'
                }
            },
            runtime: {
                OnInstalledReason: {
                    CHROME_UPDATE: 'chrome_update',
                    INSTALL: 'install',
                    SHARED_MODULE_UPDATE: 'shared_module_update',
                    UPDATE: 'update'
                },
                OnRestartRequiredReason: {
                    APP_UPDATE: 'app_update',
                    OS_UPDATE: 'os_update',
                    PERIODIC: 'periodic'
                },
                PlatformArch: {
                    ARM: 'arm',
                    ARM64: 'arm64',
                    MIPS: 'mips',
                    MIPS64: 'mips64',
                    X86_32: 'x86-32',
                    X86_64: 'x86-64'
                },
                PlatformNaclArch: {
                    ARM: 'arm',
                    MIPS: 'mips',
                    MIPS64: 'mips64',
                    X86_32: 'x86-32',
                    X86_64: 'x86-64'
                },
                PlatformOs: {
                    ANDROID: 'android',
                    CROS: 'cros',
                    LINUX: 'linux',
                    MAC: 'mac',
                    OPENBSD: 'openbsd',
                    WIN: 'win'
                },
                RequestUpdateCheckStatus: {
                    NO_UPDATE: 'no_update',
                    THROTTLED: 'throttled',
                    UPDATE_AVAILABLE: 'update_available'
                }
            }
        };
    });
    
    // 设置请求拦截
    await page.setRequestInterception(true);
    page.on('request', (request) => {
        const resourceType = request.resourceType();
        const url = request.url();
        
        // 只允许主要内容和API请求
        if (resourceType === 'document' || 
            resourceType === 'xhr' || 
            resourceType === 'fetch' ||
            url.includes('api') ||
            url.includes('majr_')) {
            request.continue();
        } 
        // 阻止其他资源
        else {
            request.abort();
        }
    });

    // 设置响应拦截
    page.on('response', async (response) => {
        const status = response.status();
        if (status === 503) {
            console.log(`收到503响应，URL: ${response.url()}`);
            await randomDelay(15000, 30000);
        }
    });

    return page;
}

// 获取项目列表
async function getProjectUrls(page, pageUrl) {
    await page.setExtraHTTPHeaders(getRandomHeaders());
    
    // 导航到页面
    await page.goto(pageUrl, {
        waitUntil: ['domcontentloaded', 'networkidle2'],
        timeout: CONFIG.navigationTimeout
    });
    
    // 检查页面结构
    console.log('检查页面结构...');
    const structure = await checkPageStructure(page);
    console.log('页面结构:', JSON.stringify(structure, null, 2));
    
    // 等待页面加载
    await page.waitForFunction(() => {
        return document.readyState === 'complete';
    }, {timeout: CONFIG.pageTimeout});
    
    // 尝试不同的选择器
    const selectors = [
        '.majr-item a',
        '.result-list a',
        '.program-list a',
        'a[href*="majr_"]'
    ];
    
    let urls = [];
    for (const selector of selectors) {
        try {
            console.log(`尝试选择器: ${selector}`);
            await page.waitForSelector(selector, {
                timeout: 5000,
                visible: true
            });
            
            urls = await page.evaluate((sel) => {
                return Array.from(document.querySelectorAll(sel))
                    .map(a => a.href)
                    .filter(url => url.includes('majr_'));
            }, selector);
            
            if (urls.length > 0) {
                console.log(`使用选择器 ${selector} 成功找到 ${urls.length} 个URL`);
                break;
            }
        } catch (error) {
            console.log(`选择器 ${selector} 未找到元素:`, error.message);
        }
    }
    
    if (urls.length === 0) {
        // 如果所有选择器都失败，尝试直接搜索链接
        console.log('尝试直接搜索链接...');
        urls = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('a'))
                .map(a => a.href)
                .filter(url => url.includes('majr_'));
        });
    }
    
    return urls;
}

// 获取项目详情
async function getProjectDetails(page, url) {
    return await retryWithBackoff(async () => {
        try {
            console.log(`正在获取项目详情: ${url}`);
            await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
            
            // 等待页面主要内容加载完成
            await page.waitForSelector('.new-majr-module', { timeout: 30000 });
            
            // 提取项目ID - 从URL中获取
            const id = url.split('_').pop();
            
            // 提取项目名称和英文名称
            const cnName = await page.$eval('.info-level .cname', el => el.childNodes[0].textContent.trim())
                .catch(() => '无');
            const enName = await page.$eval('.info-level .ename', el => el.textContent.trim())
                .catch(() => '无');
            
            // 提取标签
            const tags = await page.$$eval('.info-level .tag-list .tag-item', els => 
                els.map(el => el.textContent.trim()).join(', '))
                .catch(() => '');
            
            // 获取所属院校
            const school = await page.$eval('.module_content .layout__left .cname .text', el => el.textContent.trim())
                .catch(() => '无');
            
            // 提取项目简介信息
            const direction = await page.$eval('.project-list .project-item:nth-child(1) .value', el => el.textContent.trim())
                .catch(() => '无');
            
            const entryTime = await page.$eval('.project-list .project-item:nth-child(2) .value', el => el.textContent.trim())
                .catch(() => '无');
            
            const duration = await page.$eval('.project-list .project-item:nth-child(3) .value', el => el.textContent.trim())
                .catch(() => '无');
            
            const tuition = await page.$eval('.project-list .project-item:nth-child(4) .value', el => el.textContent.trim())
                .catch(() => '无');
            
            const interview = await page.$eval('.project-interview .value', el => el.textContent.trim())
                .catch(() => '无');
            
            // 提取培养目标
            const objectives = await page.$eval('.detail__module__train_objective .richtext', el => el.textContent.trim())
                .catch(() => '无');
            
            // 提取申请要求
            const requirements = await page.$eval('.detail__module__limits .richtext', el => el.textContent.trim())
                .catch(() => '无');
            
            // 提取语言要求
            let languageReq = '';
            try {
                const ielts = await page.$eval('.per-lang-box:nth-child(1) .total.value', el => `雅思: ${el.textContent.trim()}`);
                const toefl = await page.$eval('.per-lang-box:nth-child(2) .total.value', el => `托福: ${el.textContent.trim()}`);
                languageReq = `${ielts}; ${toefl}`;
            } catch (error) {
                languageReq = '无';
            }
            
            // 提取顾问解析
            let analysis = await page.evaluate(() => {
                const viewpointElement = document.querySelector('.detail__module__viewpoint .part__viewpoint .richtext');
                if (viewpointElement) return viewpointElement.textContent.trim();
                
                const analysisElement = document.querySelector('.detail__module__analysis .richtext');
                if (analysisElement) return analysisElement.textContent.trim();
                
                const sections = document.querySelectorAll('.module_head .title');
                for (const section of sections) {
                    if (section.textContent.includes('顾问解析') || section.textContent.includes('解析')) {
                        const parent = section.closest('.detail__module');
                        if (parent) {
                            const content = parent.querySelector('.richtext');
                            if (content) return content.textContent.trim();
                        }
                    }
                }
                return '无';
            });
            
            // 提取课程设置
            let curriculum = await page.evaluate(() => {
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
                
                const curriculumElement = document.querySelector('.detail__module__curriculum .richtext');
                if (curriculumElement) return curriculumElement.textContent.trim();
                
                return '无';
            });
            
            // 提取申请时间
            let applyTime = await page.evaluate(() => {
                const dateElement = document.querySelector('.detail__module__application_date .richtext');
                if (dateElement) return dateElement.textContent.trim();
                
                const timeElement = document.querySelector('.detail__module__application_time .richtext');
                if (timeElement) return timeElement.textContent.trim();
                
                return '无';
            });
            
            // 提取项目官网
            let officialUrl = await page.evaluate(() => {
                const schoolLinks = document.querySelectorAll('.module_content .layout__left .cname a, .module_content .layout__left .ename a');
                for (const link of schoolLinks) {
                    if (link.href && !link.href.includes('compassedu.hk')) {
                        return link.href;
                    }
                }
                return '无';
            });

            // 获取排名信息
            const ranking = await page.$$eval('.rank-item', els => 
                els.map(el => el.textContent.trim()).join(' | '))
                .catch(() => '无');

            // 获取学校类型
            const schoolType = await page.$$eval('.tag-item', els => 
                els.map(el => el.textContent.trim()).join(', '))
                .catch(() => '无');

            // 判断是否为STEM专业
            const isSTEM = await page.evaluate(() => {
                const pageText = document.body.textContent.toLowerCase();
                const stemKeywords = ['stem', 'engineering', 'computer science', 'data science', 'mathematics'];
                return stemKeywords.some(keyword => pageText.includes(keyword)) ? '是' : '否';
            });

            return {
                id,
                cnName,
                enName,
                tags,
                school,
                direction,
                entryTime,
                duration,
                tuition,
                projectSize: await page.$eval('.project-size', el => el.textContent.trim()).catch(() => '无'),
                employmentRate: await page.$eval('.employment-rate', el => el.textContent.trim()).catch(() => '无'),
                interview,
                objectives,
                requirements,
                languageReq,
                analysis,
                curriculum,
                applyTime,
                projectUrl: url,
                officialUrl,
                ranking,
                schoolType,
                isSTEM
            };
        } catch (error) {
            console.error(`获取项目详情出错 (${url}): ${error.message}`);
            return {
                id: url.split('_').pop(),
                cnName: '获取失败',
                enName: '获取失败',
                tags: '',
                school: '',
                direction: '',
                entryTime: '',
                duration: '',
                tuition: '',
                projectSize: '',
                employmentRate: '',
                interview: '',
                objectives: '',
                requirements: '',
                languageReq: '',
                analysis: '',
                curriculum: '',
                applyTime: '',
                projectUrl: url,
                officialUrl: '无',
                ranking: '',
                schoolType: '',
                isSTEM: '否'
            };
        }
    });
}

// 智能重试函数
async function retryWithBackoff(fn, retries = CONFIG.retryLimit) {
    let lastError;
    let proxyIndex = 0;
    let currentDelay = CONFIG.retryDelay;

    for (let i = 0; i < retries; i++) {
        try {
            // 在每次重试前切换代理
            if (i > 0) {
                proxyIndex = (proxyIndex + 1) % CONFIG.proxyList.length;
                const currentProxy = CONFIG.proxyList[proxyIndex];
                console.log(`[重试${i + 1}/${retries}] 使用代理: ${currentProxy}`);
            }

            return await fn();
        } catch (error) {
            lastError = error;
            console.log(`[重试${i + 1}/${retries}] 错误: ${error.message}`);

            if (i === retries - 1) break;
            
            // 根据错误类型调整策略
            if (error.message.includes('net::ERR_PROXY_CONNECTION_FAILED')) {
                // 代理失败，立即切换到下一个代理
                proxyIndex = (proxyIndex + 1) % CONFIG.proxyList.length;
                currentDelay = CONFIG.retryDelay;
            } else if (error.message.includes('net::ERR_CONNECTION_CLOSED') ||
                      error.message.includes('net::ERR_CONNECTION_RESET') ||
                      error.message.includes('net::ERR_CONNECTION_REFUSED')) {
                // 连接问题，增加等待时间
                currentDelay = Math.min(currentDelay * 2, 300000);
            } else if (error.message.includes('net::ERR_FAILED') ||
                      error.message.includes('net::ERR_TIMED_OUT')) {
                // 超时问题，适度增加等待时间
                currentDelay = Math.min(currentDelay * 1.5, 120000);
            } else if (error.message.includes('ERR_EMPTY_RESPONSE') ||
                      error.message.includes('net::ERR_ABORTED')) {
                // 响应问题，短暂等待后重试
                currentDelay = Math.min(currentDelay * 1.2, 60000);
            } else if (error.message.includes('未能找到任何有效的页面元素')) {
                // 页面结构问题，可能需要更新选择器
                console.log('警告: 页面结构可能已更改，建议检查选择器');
                currentDelay = Math.min(currentDelay * 1.5, 90000);
            }
            
            console.log(`等待 ${currentDelay/1000} 秒后重试...`);
            await randomDelay(currentDelay, currentDelay + 5000);
        }
    }

    // 记录失败的URL和错误信息
    const errorLog = `${new Date().toISOString()} - 重试${retries}次后失败: ${lastError.message}\n`;
    await fs.appendFile('error_log.txt', errorLog).catch(console.error);
    
    throw new Error(`最终失败: ${lastError.message}`);
}

// 模拟人类行为
async function simulateHumanBehavior(page) {
    // 随机鼠标移动
    const moveCount = Math.floor(Math.random() * 3) + 2;
    for (let i = 0; i < moveCount; i++) {
        await page.mouse.move(
            Math.floor(Math.random() * 800),
            Math.floor(Math.random() * 600),
            { steps: Math.floor(Math.random() * 10) + 5 }
        );
        await randomDelay(100, 500);
    }
    
    // 随机滚动
    await page.evaluate(() => {
        return new Promise((resolve) => {
            const scrollSteps = Math.floor(Math.random() * 5) + 3;
            let currentStep = 0;
            let currentScroll = 0;
            const maxScroll = Math.max(document.body.scrollHeight - 1000, 0);
            
            const smoothScroll = () => {
                if (currentStep >= scrollSteps) {
                    resolve();
                    return;
                }
                
                currentStep++;
                currentScroll += Math.floor(Math.random() * 300);
                if (currentScroll > maxScroll) currentScroll = maxScroll;
                
                window.scrollTo({
                    top: currentScroll,
                    behavior: 'smooth'
                });
                
                setTimeout(smoothScroll, Math.random() * 1000 + 500);
            };
            
            smoothScroll();
        });
    });
    
    // 随机暂停
    await randomDelay(1000, 3000);
    
    // 模拟查看页面内容
    const textElements = await page.$$('p, h1, h2, h3, h4, h5, h6');
    if (textElements.length > 0) {
        const randomElement = textElements[Math.floor(Math.random() * textElements.length)];
        await randomElement.hover();
        await randomDelay(500, 1500);
    }
    
    // 随机鼠标移动到链接或按钮上
    const clickableElements = await page.$$('a, button');
    if (clickableElements.length > 0) {
        const randomClickable = clickableElements[Math.floor(Math.random() * clickableElements.length)];
        await randomClickable.hover();
        await randomDelay(300, 800);
    }
}

// 工作线程函数
async function worker(threadId, urls) {
    const browser = await puppeteer.launch({
        headless: 'new',
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--disable-gpu',
            '--window-size=1920x1080',
            '--disable-web-security',
            '--disable-features=IsolateOrigins,site-per-process',
            '--disable-blink-features=AutomationControlled'
        ],
        ignoreHTTPSErrors: true
    });

    try {
        const page = await initPage(browser);
        console.log(`工作线程 ${threadId} 启动，处理 ${urls.length} 个URL`);

        for (let i = 0; i < urls.length; i++) {
            const url = urls[i];
            console.log(`线程 ${threadId} - 处理第 ${i + 1}/${urls.length} 个项目: ${url}`);
            
            try {
                const details = await getProjectDetails(page, url);
                await csvWriter.writeRecords([details]);
                console.log(`线程 ${threadId} - 已保存项目详情: ${details.cnName}`);
                await randomDelay();
            } catch (error) {
                console.error(`线程 ${threadId} - 处理项目失败 (${url}): ${error.message}`);
                await fs.appendFile('failed_urls.txt', `${url}\n`);
            }
        }
    } catch (error) {
        console.error(`工作线程 ${threadId} 发生错误:`, error);
    } finally {
        await browser.close();
    }
}

// 主函数
async function main() {
    console.log('开始爬取美国硕士项目数据...');
    console.log(`数据将保存至: ${CONFIG.outputPath}`);

    const browser = await puppeteer.launch({
        headless: 'new',
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-web-security',
            '--disable-features=IsolateOrigins,site-per-process',
            '--disable-blink-features=AutomationControlled',
            '--window-size=1920,1080'
        ],
        ignoreHTTPSErrors: true
    });

    try {
        const page = await initPage(browser);
        const allUrls = new Set();

        // 爬取所有页面的URL
        for (let pageNum = 1; pageNum <= CONFIG.totalPages; pageNum++) {
            const pageUrl = `${CONFIG.baseUrl}p${pageNum}`; // 修正URL拼接
            console.log(`正在获取第 ${pageNum}/${CONFIG.totalPages} 页: ${pageUrl}`);
            
            try {
                const urls = await getProjectUrls(page, pageUrl);
                console.log(`第 ${pageNum} 页找到 ${urls.length} 个项目URL`);
                urls.forEach(url => allUrls.add(url));

                // 保存进度
                await fs.writeFile(CONFIG.progressJsonPath, JSON.stringify({
                    currentPage: pageNum,
                    totalPages: CONFIG.totalPages,
                    collectedUrls: Array.from(allUrls)
                }));

                // 随机延迟
                if (pageNum < CONFIG.totalPages) {
                    await randomDelay(8000, 15000);
                }
            } catch (error) {
                console.error(`获取第 ${pageNum} 页失败: ${error.message}`);
                // 保存失败的页面记录
                await fs.appendFile('failed_pages.txt', `${pageUrl}\n`);
                await randomDelay(30000, 60000); // 失败后较长延迟
                
                // 重试当前页
                pageNum--; // 重试当前页
                continue;
            }
        }

        console.log(`URL收集完成，共找到 ${allUrls.size} 个项目`);
        
        // 保存所有URL
        await fs.writeFile(CONFIG.urlsJsonPath, JSON.stringify(Array.from(allUrls)));

        // 创建工作线程处理URL
        const urls = Array.from(allUrls);
        const urlsPerWorker = Math.ceil(urls.length / CONFIG.workerCount);
        const workers = [];
        let completedWorkers = 0;
        let totalProcessed = 0;

        // 创建Promise等待所有工作线程完成
        const workerPromise = new Promise((resolve) => {
            for (let i = 0; i < CONFIG.workerCount; i++) {
                const start = i * urlsPerWorker;
                const end = Math.min(start + urlsPerWorker, urls.length);
                const workerUrls = urls.slice(start, end);

                if (workerUrls.length === 0) continue;

                const worker = new Worker(__filename, {
                    workerData: {
                        urls: workerUrls,
                        workerId: i + 1,
                        outputPath: CONFIG.outputPath
                    }
                });

                worker.on('message', (result) => {
                    if (result.completed) {
                        console.log(`工作线程 ${i + 1} 完成，处理了 ${result.processedCount} 个项目`);
                        totalProcessed += result.processedCount;
                        completedWorkers++;

                        if (completedWorkers === workers.length) {
                            resolve();
                        }
                    }
                });

                worker.on('error', (error) => {
                    console.error(`工作线程 ${i + 1} 错误: ${error.message}`);
                    completedWorkers++;

                    if (completedWorkers === workers.length) {
                        resolve();
                    }
                });

                workers.push(worker);
                console.log(`已启动工作线程 ${i + 1}，分配了 ${workerUrls.length} 个URL`);
            }
        });

        // 等待所有工作线程完成
        await workerPromise;
        console.log(`爬虫任务完成，共成功处理 ${totalProcessed} 个项目`);

    } catch (error) {
        console.error('主程序发生错误:', error);
    } finally {
        await browser.close();
    }
}

// 如果是工作线程
if (!isMainThread) {
    const { urls, workerId, outputPath } = workerData;
    
    async function processUrls() {
        console.log(`工作线程 ${workerId} 启动，处理 ${urls.length} 个URL`);
        
        const browser = await puppeteer.launch({
            headless: 'new',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-web-security'
            ]
        });
        
        const page = await initPage(browser);
        let processedCount = 0;
        
        for (let i = 0; i < urls.length; i++) {
            const url = urls[i];
            try {
                console.log(`线程 ${workerId} - 处理第 ${i + 1}/${urls.length} 个项目: ${url}`);
                
                const details = await getProjectDetails(page, url);
                await csvWriter.writeRecords([details]);
                
                processedCount++;
                console.log(`线程 ${workerId} - 已保存项目详情: ${details.cnName}`);
                
                // 随机延迟
                await randomDelay();
            } catch (error) {
                console.error(`线程 ${workerId} - 处理项目失败 (${url}): ${error.message}`);
                await fs.appendFile('failed_urls.txt', `${url}\n`);
            }
        }
        
        await browser.close();
        return processedCount;
    }
    
    processUrls()
        .then(count => {
            parentPort.postMessage({ completed: true, processedCount: count });
        })
        .catch(error => {
            console.error(`工作线程 ${workerId} 发生错误:`, error);
            parentPort.postMessage({ completed: true, processedCount: 0, error: error.message });
        });
}

// 主线程执行
if (isMainThread) {
    main().catch(console.error);
} 