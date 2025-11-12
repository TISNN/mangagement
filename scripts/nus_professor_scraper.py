#!/usr/bin/env python3
"""
NUS Computing Faculty Scraper
爬取NUS Computing学院Department of Information Systems and Analytics的教授信息
分两步：1. 从列表页获取教授链接  2. 访问详情页获取完整信息
过滤Part-Time教授
"""

import json
import time
import re
from concurrent.futures import ThreadPoolExecutor, as_completed
from threading import Lock
from urllib.parse import urljoin
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from bs4 import BeautifulSoup, Tag


class NUSProfessorScraper:
    def __init__(self, headless=True, max_workers=3):
        """初始化爬虫"""
        self.list_url = "https://www.comp.nus.edu.sg/about/faculty/"
        self.base_url = "https://www.comp.nus.edu.sg"
        self.target_department = "Department of Information Systems and Analytics"
        self.professor_links = []
        self.professors = []
        self.headless = headless
        self.max_workers = max_workers
        self.lock = Lock()  # 线程安全锁
        
        # 配置Chrome选项
        chrome_options = Options()
        if headless:
            chrome_options.add_argument('--headless')
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        chrome_options.add_argument('--disable-blink-features=AutomationControlled')
        chrome_options.add_argument('user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36')
        
        self.driver = webdriver.Chrome(options=chrome_options)
        self.wait = WebDriverWait(self.driver, 20)
    
    def _create_driver(self):
        """为每个线程创建独立的driver"""
        chrome_options = Options()
        if self.headless:
            chrome_options.add_argument('--headless')
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        chrome_options.add_argument('--disable-blink-features=AutomationControlled')
        chrome_options.add_argument('user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36')
        return webdriver.Chrome(options=chrome_options)
    
    def get_professor_links(self):
        """从列表页获取教授详情页链接"""
        try:
            print("正在加载教授列表页...")
            self.driver.get(self.list_url)
            
            # 等待页面加载
            self.wait.until(EC.presence_of_element_located((By.TAG_NAME, "body")))
            time.sleep(3)
            
            print(f"正在筛选系别: {self.target_department}")
            
            # 选择Department of Information Systems and Analytics
            self.driver.execute_script("""
                var selects = document.querySelectorAll('select');
                for(var i = 0; i < selects.length; i++) {
                    var options = selects[i].options;
                    for(var j = 0; j < options.length; j++) {
                        if(options[j].text.includes('Information Systems')) {
                            selects[i].selectedIndex = j;
                            selects[i].dispatchEvent(new Event('change'));
                            break;
                        }
                    }
                }
            """)
            
            time.sleep(5)
            
            # 提取教授链接 - 多种方式尝试
            links = self.driver.execute_script("""
                var links = [];
                
                // 方法1: 查找所有包含人员链接的元素
                var allLinks = document.querySelectorAll('a[href*="/disa/people/"], a[href*="/cs/people/"]');
                console.log('找到链接数量:', allLinks.length);
                
                allLinks.forEach(function(linkElement) {
                    var href = linkElement.getAttribute('href');
                    var name = linkElement.textContent.trim();
                    
                    // 检查父元素中是否包含Part-Time
                    var parent = linkElement.closest('tr, div, li');
                    if (parent) {
                        var parentText = parent.textContent || '';
                        if (parentText.toLowerCase().includes('part-time') || 
                            parentText.toLowerCase().includes('part time')) {
                            console.log('跳过Part-Time:', name);
                            return;
                        }
                    }
                    
                    if (href && name && name.length > 2) {
                        links.push({
                            name: name,
                            url: href
                        });
                    }
                });
                
                console.log('最终链接数量:', links.length);
                return links;
            """)
            
            # 补全URL并去重
            seen_urls = set()
            for link in links:
                if not link['url'].startswith('http'):
                    link['url'] = self.base_url + link['url']
                
                # 去重
                if link['url'] not in seen_urls:
                    seen_urls.add(link['url'])
                    self.professor_links.append(link)
            
            print(f"✓ 找到 {len(self.professor_links)} 位教授的详情页链接")
            
            # 如果没找到，尝试保存页面源代码用于调试
            if len(self.professor_links) == 0:
                debug_file = '/Users/evanxu/Downloads/mangagement-d0918fc8ddf240e444778d69a1e8e3a08a6b2dbc/scripts/page_source_debug.html'
                with open(debug_file, 'w', encoding='utf-8') as f:
                    f.write(self.driver.page_source)
                print(f"⚠ 页面源代码已保存到: {debug_file}")
            
        except Exception as e:
            print(f"✗ 获取教授链接时出错: {e}")
            import traceback
            traceback.print_exc()
    
    def scrape_professor_detail(self, link_info, driver=None):
        """爬取单个教授的详情页"""
        # 如果没有提供driver，使用主driver（单线程模式）
        use_main_driver = driver is None
        if use_main_driver:
            driver = self.driver
        
        try:
            name = link_info['name']
            url = link_info['url']
            
            with self.lock:
                print(f"  访问: {name}")
            
            driver.get(url)
            time.sleep(2)
            
            # 获取页面源代码
            soup = BeautifulSoup(driver.page_source, 'html.parser')
            
            prof = {
                'name': name,
                'profile_url': url
            }
            slug = url.rstrip('/').split('/')[-1].lower()
            
            # 提取职位信息 - 从 div.profpic 中提取
            profpic_div = soup.find('div', class_='profpic')
            avatar_url = None
            if profpic_div:
                # 获取h4之后的所有文本节点（直到教育背景部分）
                h4_elem = profpic_div.find('h4')
                img_elem = profpic_div.find('img')
                if img_elem:
                    img_src = img_elem.get('src') or img_elem.get('data-src')
                    if img_src:
                        avatar_url = urljoin(url, img_src.strip())
                if h4_elem:
                    title_lines = []
                    # 遍历h4后的所有兄弟节点
                    for sibling in h4_elem.next_siblings:
                        # 检查是否是标签（Tag对象）
                        if hasattr(sibling, 'name') and sibling.name:
                            # 遇到教育背景的span就停止
                            if sibling.name == 'span' and 'education' in sibling.get('class', []):
                                break
                            # 跳过br标签
                            if sibling.name == 'br':
                                continue
                            # 其他标签，提取文本
                            text = sibling.get_text(strip=True)
                        else:
                            # 文本节点
                            text = str(sibling).strip()
                        
                        # 过滤空文本和教育背景
                        if text and len(text) > 2:
                            # 排除学位信息
                            if not any(degree in text for degree in ['Ph.D.', 'M.Sc.', 'B.Sc.', 'M.A.', 'B.A.', 'M.Phil']):
                                title_lines.append(text)
                    
                    if title_lines:
                        prof['appointment'] = title_lines[0]
                        # 检查是否Part-Time
                        if 'part-time' in prof['appointment'].lower() or 'part time' in prof['appointment'].lower():
                            return None
                        
                        prof['additional_titles'] = title_lines[1:] if len(title_lines) > 1 else []
                    else:
                        prof['appointment'] = 'N/A'
                        prof['additional_titles'] = []
            else:
                prof['appointment'] = 'N/A'
                prof['additional_titles'] = []

            # 处理位置信息（办公室、电话、邮箱、主页）
            location_div = soup.find('div', class_='location')
            if location_div:
                current_label: str | None = None
                for child in location_div.children:
                    if isinstance(child, Tag) and child.name == 'div' and 'loc_icon' in (child.get('class') or []):
                        icon = child.find('i')
                        icon_classes = icon.get('class', []) if icon else []
                        if any('map-marker' in cls for cls in icon_classes):
                            current_label = 'office'
                        elif any('phone' in cls for cls in icon_classes):
                            current_label = 'phone'
                        elif any('envelope' in cls for cls in icon_classes):
                            current_label = 'email'
                        elif any('globe' in cls for cls in icon_classes):
                            current_label = 'website'
                        else:
                            current_label = None
                        continue

                    if isinstance(child, Tag):
                        if child.name == 'br':
                            continue
                        if current_label == 'website' and child.name == 'a':
                            href = child.get('href', '').strip()
                            if href:
                                prof['personal_page'] = href
                            elif child.get_text(strip=True):
                                prof['personal_page'] = child.get_text(strip=True)
                            continue
                        if current_label == 'email' and child.name == 'img':
                            # 无法直接从图片识别邮箱，尝试从personal page或profile slug推断
                            inferred = None
                            if prof.get('personal_page'):
                                personal_page_username = prof['personal_page'].split('~')[-1].strip('/')
                                if personal_page_username:
                                    inferred = f"{personal_page_username}@comp.nus.edu.sg"
                            if not inferred and slug:
                                inferred = f"{slug}@comp.nus.edu.sg"
                            if inferred:
                                prof['email'] = inferred
                            continue
                        text_value = child.get_text(strip=True)
                    else:
                        text_value = str(child).strip()

                    if not text_value:
                        continue

                    if current_label == 'office' and not prof.get('office'):
                        prof['office'] = text_value
                    elif current_label == 'phone' and not prof.get('phone'):
                        prof['phone'] = re.sub(r'\s+', ' ', text_value)
                    elif current_label == 'email' and not prof.get('email'):
                        prof['email'] = text_value
            
            if not avatar_url:
                img_candidate = soup.find('img', src=re.compile(r'stfphotos', re.I))
                if img_candidate:
                    img_src = img_candidate.get('src') or img_candidate.get('data-src')
                    if img_src:
                        avatar_url = urljoin(url, img_src.strip())
            
            if avatar_url:
                prof['avatar_url'] = avatar_url
            
            # 提取联系信息
            contact_ps = soup.find_all('p', limit=20)
            for p in contact_ps:
                text = p.get_text(strip=True)
                if not text:
                    continue
                
                # 办公室
                if 'COM' in text and '-' in text and not prof.get('office'):
                    prof['office'] = text
                # 电话
                elif (text.startswith('651') or text.startswith('+65') or text.startswith('6516')) and not prof.get('phone'):
                    prof['phone'] = text
                # 个人主页
                elif 'www.comp.nus.edu.sg' in text and not prof.get('personal_page'):
                    prof['personal_page'] = text
            
            # 提取个人简介 Profile/Bio
            profile_text = ""
            # 查找h4标题后、第一个h3标题前的所有p标签内容
            h4_elem = soup.find('h4')
            if h4_elem:
                profile_paras = []
                for elem in h4_elem.find_all_next():
                    if elem.name == 'h3':  # 遇到第一个h3就停止
                        break
                    if elem.name == 'p':
                        text = elem.get_text(strip=True)
                        # 过滤掉联系信息和学位信息
                        if text and len(text) > 50 and not text.startswith('COM') and not text.startswith('651') and not text.startswith('+65') and 'www.comp.nus.edu.sg' not in text:
                            # 进一步过滤学位开头的句子
                            if not any(degree in text[:20] for degree in ['Ph.D.', 'M.Sc.', 'B.Sc.', 'M.A.', 'B.A.']):
                                profile_paras.append(text)
                
                if profile_paras:
                    profile_text = ' '.join(profile_paras[:3])  # 最多取前3段
            prof['profile'] = profile_text
            
            # 提取教育背景
            education = []
            for li in soup.find_all('li'):
                text = li.get_text(strip=True)
                if 'Ph.D.' in text or 'M.Sc.' in text or 'B.Sc.' in text or 'M.A.' in text or 'B.A.' in text:
                    education.append(text)
            prof['education'] = education
            
            # 提取研究领域 - 优先从研究区域容器提取
            research_areas: list[str] = []
            areas_container = soup.find('div', id='res_area')
            if areas_container:
                for link in areas_container.find_all('a'):
                    area_text = link.get_text(strip=True)
                    if area_text and area_text not in research_areas:
                        research_areas.append(area_text)
            else:
                areas_section = soup.find('h3', string=re.compile('RESEARCH AREAS', re.I))
                if areas_section:
                    # 查找后续的所有h6标签直到下一个h3
                    current = areas_section.find_next_sibling()
                    while current and current.name != 'h3':
                        if current.name == 'h6':
                            area = current.get_text(strip=True)
                            if area and area not in research_areas:
                                research_areas.append(area)
                        current = current.find_next_sibling()
            prof['research_areas'] = research_areas
            
            # 提取研究兴趣 - RESEARCH INTERESTS
            research_interests = []
            interests_section = soup.find('h3', string=re.compile('RESEARCH INTERESTS', re.I))
            if interests_section:
                ul = interests_section.find_next('ul')
                if ul:
                    for li in ul.find_all('li'):
                        interest = li.get_text(strip=True)
                        if interest:
                            research_interests.append(interest)
            prof['research_interests'] = research_interests
            
            # 提取研究项目（限制前5个）
            research_projects = []
            projects_container = soup.find('div', id='currentprojects')
            if projects_container:
                project_rows = projects_container.find_all('div', class_='row', recursive=False)
                for row in project_rows:
                    # 项目标题
                    title_elem = row.find('p', class_='title_r')
                    description_elem = None
                    tags = []
                    if title_elem:
                        bold = title_elem.find('b')
                        project_title = bold.get_text(strip=True) if bold else title_elem.get_text(strip=True)
                        # 描述在同级 p 标签
                        description_elem = title_elem.find_next_sibling('p')
                    else:
                        # 兼容旧结构
                        strong_elem = row.find('strong')
                        project_title = strong_elem.get_text(strip=True) if strong_elem else ''
                        if strong_elem:
                            description_elem = strong_elem.parent
                    project_desc = ''
                    if description_elem:
                        project_desc = description_elem.get_text(strip=True)
                    # 标签
                    tag_list = row.find('ul', class_='proj_r')
                    if tag_list:
                        for li in tag_list.find_all('li'):
                            tag_text = li.get_text(strip=True)
                            if tag_text:
                                tags.append(tag_text)
                    if project_title:
                        research_projects.append({
                            'title': project_title,
                            'description': project_desc[:500],
                            'tags': tags
                        })
                    if len(research_projects) >= 5:
                        break
            else:
                projects_section = soup.find('h3', string=re.compile('RESEARCH PROJECTS', re.I))
                if projects_section:
                    current = projects_section.find_next_sibling()
                    while current and current.name != 'h3' and len(research_projects) < 5:
                        if current.name == 'p':
                            strong = current.find('strong')
                            if strong:
                                project_title = strong.get_text(strip=True)
                                project_desc = current.get_text(strip=True).replace(project_title, '').strip()
                                if project_desc:
                                    research_projects.append({
                                        'title': project_title,
                                        'description': project_desc[:300]  # 限制长度
                                    })
                        current = current.find_next_sibling()
            prof['research_projects'] = research_projects
            
            # 提取博士校友就职情况 PHD ALUMNI PLACEMENTS
            phd_alumni = []
            alumni_section = soup.find('h3', string=lambda x: x and 'PHD ALUMNI' in x.upper())
            if alumni_section:
                # 查找包含alumni信息的div.row
                alumni_container = alumni_section.find_next_sibling('div', class_='row')
                if alumni_container:
                    # 在row内查找所有alumni card/div
                    for alumni_div in alumni_container.find_all('div', recursive=True):
                        text_content = alumni_div.get_text('\n', strip=True)
                        if not text_content or len(text_content) < 20:
                            continue
                        
                        lines = [l.strip() for l in text_content.split('\n') if l.strip()]
                        
                        # 检查是否包含关键信息
                        has_placement = any('First Job Placement' in line for line in lines)
                        has_class = any('Class of' in line for line in lines)
                        
                        if has_placement or has_class:
                            alumni_info = {}
                            
                            # 第一行通常是名字
                            if lines:
                                # 名字通常在第一行或者在包含职位的行之前
                                for idx, line in enumerate(lines):
                                    if not any(keyword in line for keyword in ['First Job', 'Class of', 'Assistant', 'Associate', 'Professor', 'Lecturer', 'University']):
                                        alumni_info['name'] = line
                                        break
                                
                                # 如果没找到名字，用第一行
                                if 'name' not in alumni_info and lines:
                                    # 尝试从第一行提取名字（可能包含职位信息）
                                    first_line = lines[0]
                                    # 分离名字和职位
                                    if any(title in first_line for title in ['Assistant Professor', 'Associate Professor', 'Professor', 'Lecturer']):
                                        for title in ['Assistant Professor', 'Associate Professor', 'Professor', 'Lecturer']:
                                            if title in first_line:
                                                parts = first_line.split(title)
                                                if parts[0].strip():
                                                    alumni_info['name'] = parts[0].strip()
                                                    alumni_info['current_position'] = title + (parts[1] if len(parts) > 1 else '')
                                                break
                                    else:
                                        alumni_info['name'] = first_line
                            
                            # 提取First Job Placement
                            for line in lines:
                                if 'First Job Placement' in line:
                                    # 下一行是placement信息，或者在同一行
                                    placement = line.replace('First Job Placement', '').strip()
                                    if not placement:
                                        # 查找下一行
                                        idx = lines.index(line)
                                        if idx + 1 < len(lines):
                                            placement = lines[idx + 1]
                                    alumni_info['first_placement'] = placement
                            
                            # 提取Class of
                            for line in lines:
                                if 'Class of' in line:
                                    year_match = re.search(r'(\d{4})', line)
                                    if year_match:
                                        alumni_info['graduation_year'] = int(year_match.group(1))
                            
                            # 提取当前职位（如果还没有）
                            if 'current_position' not in alumni_info:
                                for line in lines:
                                    if any(title in line for title in ['Professor', 'Lecturer', 'Researcher', 'Scientist']):
                                        alumni_info['current_position'] = line
                                        # 提取机构
                                        for next_line in lines[lines.index(line)+1:]:
                                            if any(word in next_line for word in ['University', 'Institute', 'College', 'School']):
                                                if 'institution' not in alumni_info:
                                                    alumni_info['institution'] = next_line
                                                break
                                        break
                            
                            # 只添加有名字的校友
                            if 'name' in alumni_info:
                                phd_alumni.append(alumni_info)
            
            prof['phd_alumni'] = phd_alumni
            
            # 提取代表性论文（全部）
            publications = []
            pubs_section = soup.find('h3', string=re.compile('SELECTED PUBLICATIONS|PUBLICATIONS', re.I))
            if pubs_section:
                ul = pubs_section.find_next('ul')
                if ul:
                    for li in ul.find_all('li', recursive=False):  # 获取所有论文
                        pub_text = li.get_text(strip=True)
                        if not pub_text:
                            continue
                        
                        # 解析论文信息：标题通常在引号中，年份是4位数字
                        title_match = re.search(r'"([^"]+)"', pub_text)
                        year_match = re.search(r'(\d{4})', pub_text)
                        
                        pub_info = {
                            'title': title_match.group(1) if title_match else pub_text[:150],
                            'year': int(year_match.group(1)) if year_match else None,
                            'full_citation': pub_text[:500]  # 增加长度限制
                        }
                        publications.append(pub_info)
            prof['publications'] = publications
            prof['publications_count'] = len(publications)
            
            # 提取获奖信息（全部）
            awards = []
            awards_section = soup.find('h3', string=re.compile('AWARDS|HONOURS', re.I))
            if awards_section:
                ul = awards_section.find_next('ul')
                if ul:
                    for li in ul.find_all('li'):  # 获取所有奖项
                        award = li.get_text(strip=True)
                        if award:
                            awards.append(award)
            prof['awards'] = awards
            prof['awards_count'] = len(awards)
            
            # 提取授课课程
            courses = []
            courses_section = soup.find('h3', string=re.compile('COURSES TAUGHT', re.I))
            if courses_section:
                next_elem = courses_section.find_next_sibling()
                while next_elem and next_elem.name != 'h3':
                    if next_elem.name == 'p':
                        course = next_elem.get_text(strip=True)
                        if course:
                            courses.append(course)
                    next_elem = next_elem.find_next_sibling()
            prof['courses'] = courses
            
            # 提取邮箱（从页面内容推断）
            if not prof.get('email'):
                personal_page = prof.get('personal_page', '')
                if 'www.comp.nus.edu.sg/~' in personal_page:
                    username = personal_page.split('~')[-1].strip('/')
                    if username:
                        prof['email'] = f"{username}@comp.nus.edu.sg"
                elif slug:
                    prof['email'] = f"{slug}@comp.nus.edu.sg"
            
            return prof
            
        except Exception as e:
            with self.lock:
                print(f"  ✗ 爬取 {link_info['name']} 详情时出错: {e}")
            return None
    
    def scrape_single_professor_thread(self, index, link_info):
        """单个线程爬取一位教授的信息"""
        driver = self._create_driver()
        try:
            with self.lock:
                print(f"\n[{index}/{len(self.professor_links)}] {link_info['name']}")
            
            prof = self.scrape_professor_detail(link_info, driver)
            
            if prof:
                with self.lock:
                    self.professors.append(prof)
                    print(f"  ✓ 成功 (论文: {prof.get('publications_count', 0)}, 奖项: {prof.get('awards_count', 0)})")
                return True
            else:
                with self.lock:
                    print(f"  ⊙ 跳过（可能是Part-Time）")
                return False
        except Exception as e:
            with self.lock:
                print(f"  ✗ 线程处理出错: {e}")
            return False
        finally:
            try:
                driver.quit()
            except Exception:
                pass
            # 避免请求过快
            time.sleep(0.5)
    
    def scrape_all_professors(self):
        """使用多线程爬取所有教授的详细信息"""
        print(f"\n开始使用 {self.max_workers} 个线程爬取 {len(self.professor_links)} 位教授的详情...")
        print("="*60)
        
        # 创建线程池
        with ThreadPoolExecutor(max_workers=self.max_workers) as executor:
            # 提交任务
            futures = []
            for i, link_info in enumerate(self.professor_links, 1):
                future = executor.submit(
                    self.scrape_single_professor_thread,
                    i,
                    link_info
                )
                futures.append(future)
            
            # 等待所有任务完成
            for future in as_completed(futures):
                future.result()  # 获取结果，如果有异常会在这里抛出
        
        print(f"\n✓ 成功爬取 {len(self.professors)} 位教授的详细信息")
    
    def _is_part_time(self, professor):
        """检查是否为Part-Time教授"""
        appointment = professor.get('appointment', '').lower()
        return 'part-time' in appointment or 'part time' in appointment
    
    def save_to_json(self, filename='nus_isa_professors.json'):
        """保存为JSON文件"""
        output_path = f"/Users/evanxu/Downloads/mangagement-d0918fc8ddf240e444778d69a1e8e3a08a6b2dbc/scripts/{filename}"
        
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump({
                'department': self.target_department,
                'total_count': len(self.professors),
                'professors': self.professors
            }, f, ensure_ascii=False, indent=2)
        
        print(f"✓ 数据已保存到: {output_path}")
    
    def save_to_csv(self, filename='nus_isa_professors.csv'):
        """保存为CSV文件"""
        import csv
        
        output_path = f"/Users/evanxu/Downloads/mangagement-d0918fc8ddf240e444778d69a1e8e3a08a6b2dbc/scripts/{filename}"
        
        if not self.professors:
            print("没有数据可保存")
            return
        
        # 获取所有字段
        fieldnames = ['name', 'appointment', 'email', 'phone', 'office', 'research_areas']
        
        with open(output_path, 'w', encoding='utf-8-sig', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            
            for prof in self.professors:
                row = {
                    'name': prof.get('name', ''),
                    'appointment': prof.get('appointment', ''),
                    'email': prof.get('email', ''),
                    'phone': prof.get('phone', ''),
                    'office': prof.get('office', ''),
                    'research_areas': ', '.join(prof.get('research_areas', []))
                }
                writer.writerow(row)
        
        print(f"✓ 数据已保存到: {output_path}")
    
    def print_summary(self):
        """打印摘要信息"""
        print("\n" + "="*60)
        print(f"爬取摘要 - {self.target_department}")
        print("="*60)
        print(f"总共找到: {len(self.professors)} 位教授")
        
        # 统计信息
        total_pubs = sum(prof.get('publications_count', 0) for prof in self.professors)
        total_awards = sum(prof.get('awards_count', 0) for prof in self.professors)
        total_alumni = sum(len(prof.get('phd_alumni', [])) for prof in self.professors)
        
        print(f"总论文数: {total_pubs}")
        print(f"总奖项数: {total_awards}")
        print(f"总博士校友数: {total_alumni}")
        
        print("\n教授列表:")
        print("-"*60)
        
        for i, prof in enumerate(self.professors, 1):
            print(f"{i}. {prof.get('name', 'N/A')}")
            print(f"   职位: {prof.get('appointment', 'N/A')}")
            print(f"   邮箱: {prof.get('email', 'N/A')}")
            print(f"   论文: {prof.get('publications_count', 0)} | 奖项: {prof.get('awards_count', 0)} | 博士生: {len(prof.get('phd_alumni', []))}")
            if prof.get('research_areas'):
                print(f"   研究领域: {', '.join(prof.get('research_areas', [])[:3])}")
            print()
    
    def close(self):
        """关闭浏览器"""
        if self.driver:
            self.driver.quit()
            print("✓ 浏览器已关闭")


def main():
    """主函数"""
    print("="*60)
    print("NUS Computing Faculty Scraper")
    print("目标: Department of Information Systems and Analytics")
    print("="*60)
    print()
    
    # 可以设置headless=False来查看浏览器操作
    scraper = NUSProfessorScraper(headless=True)
    
    try:
        # 步骤1: 获取教授列表链接
        scraper.get_professor_links()
        
        if not scraper.professor_links:
            print("\n✗ 未找到任何教授链接")
            return
        
        # 步骤2: 爬取每个教授的详情
        scraper.scrape_all_professors()
        
        # 打印摘要
        scraper.print_summary()
        
        # 保存数据
        scraper.save_to_json()
        scraper.save_to_csv()
        
    except KeyboardInterrupt:
        print("\n✗ 用户中断")
    except Exception as e:
        print(f"✗ 发生错误: {e}")
        import traceback
        traceback.print_exc()
    finally:
        # 关闭浏览器
        scraper.close()


if __name__ == "__main__":
    main()

