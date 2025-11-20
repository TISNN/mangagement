#!/usr/bin/env python3
"""
爬取指南者留学offer案例库的爬虫脚本

功能：
1. 从一级页面 (https://www.compassedu.hk/offer) 获取所有offer链接
2. 访问每个offer详情页提取以下信息：
   - 学生姓名
   - 录取学校
   - 录取专业
   - 毕业学校
   - 本科专业
   - 基本背景
   - 主要经历

使用方法：
  python compass_offer_scraper.py --output-json offers.json --output-csv offers.csv
  python compass_offer_scraper.py --max-offers 10 --headless  # 测试模式，只爬取10条
"""

from __future__ import annotations

import argparse
import csv
import json
import logging
import re
import sys
import tempfile
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from dataclasses import asdict, dataclass
from pathlib import Path
from threading import Lock
from typing import List, Optional, Set
from urllib.parse import urljoin, urlparse

from bs4 import BeautifulSoup, Tag
from selenium import webdriver
from selenium.common.exceptions import TimeoutException, WebDriverException
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

BASE_URL = "https://www.compassedu.hk"
LISTING_URL = "https://www.compassedu.hk/offer"
REQUEST_DELAY = 1.5  # 请求间隔，礼貌对待服务器


@dataclass
class OfferRecord:
    """Offer记录数据结构"""
    url: str
    student_name: Optional[str]  # 学生姓名
    admission_school: Optional[str]  # 录取学校
    admission_major: Optional[str]  # 录取专业
    graduation_school: Optional[str]  # 毕业学校
    undergraduate_major: Optional[str]  # 本科专业
    basic_background: Optional[str]  # 基本背景
    main_experiences: Optional[str]  # 主要经历


class CompassOfferScraper:
    """指南者留学Offer爬虫类"""
    
    def __init__(self, max_workers: int = 3, headless: bool = False) -> None:
        """
        初始化爬虫
        
        Args:
            max_workers: 并发线程数
            headless: 是否使用无头模式
        """
        self.max_workers = max_workers
        self.headless = headless
        self.driver = self._create_driver()
        self.wait = WebDriverWait(self.driver, 30)
        self.results_lock = Lock()  # 线程锁，保护结果列表

    def _create_driver(self) -> webdriver.Chrome:
        """创建Chrome WebDriver"""
        chrome_options = Options()
        if self.headless:
            chrome_options.add_argument("--headless=new")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--disable-blink-features=AutomationControlled")
        chrome_options.add_argument(
            "user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/119.0.0.0 Safari/537.36"
        )
        chrome_options.add_argument("--window-size=1280,720")
        try:
            return webdriver.Chrome(options=chrome_options)
        except WebDriverException as exc:
            logging.error("无法初始化 Chrome WebDriver，请确认已安装驱动: %s", exc)
            raise

    def _create_worker_driver(self) -> webdriver.Chrome:
        """为工作线程创建独立的WebDriver"""
        chrome_options = Options()
        if self.headless:
            chrome_options.add_argument("--headless=new")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--disable-blink-features=AutomationControlled")
        chrome_options.add_argument(
            "user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/119.0.0.0 Safari/537.36"
        )
        chrome_options.add_argument("--window-size=1280,720")
        return webdriver.Chrome(options=chrome_options)

    def extract_offer_links(self, html: str) -> Set[str]:
        """
        从列表页HTML中提取所有offer详情页链接
        
        Args:
            html: 列表页HTML内容
            
        Returns:
            offer详情页URL集合
        """
        soup = BeautifulSoup(html, "html.parser")
        links: Set[str] = set()
        
        # 查找所有指向offer详情页的链接
        # 链接格式通常是: https://www.compassedu.hk/newst_xxxxx
        for link in soup.find_all("a", href=True):
            href = link["href"]
            # 匹配 offer 详情页链接
            if "/newst_" in href or "/offer/" in href:
                # 转换为绝对URL
                full_url = urljoin(BASE_URL, href)
                # 确保是offer详情页
                if "newst_" in full_url or "/offer/" in full_url:
                    links.add(full_url)
        
        logging.info("从列表页提取到 %d 个offer链接", len(links))
        return links

    def _clean_text(self, text: Optional[str]) -> Optional[str]:
        """清理文本内容"""
        if not text:
            return None
        # 移除HTML标签
        text = re.sub(r'<[^>]+>', '', text)
        # 移除多余的空白字符
        text = re.sub(r'\s+', ' ', text)
        # 移除首尾空白
        text = text.strip()
        # 如果文本太长（超过500字符），可能是抓取了错误的内容
        if len(text) > 500:
            return None
        return text if text else None

    def _extract_field_value(self, soup: BeautifulSoup, html: str, label: str) -> Optional[str]:
        """
        提取特定标签对应的值
        
        Args:
            soup: BeautifulSoup对象
            html: 原始HTML文本
            label: 标签文本（如"学生姓名"、"录取学校"等）
            
        Returns:
            提取到的值，如果未找到则返回None
        """
        try:
            # 方法1: 从HTML中精确匹配（最可靠）
            # 根据实际页面结构，这些字段通常在"录取详情"区域内
            # 先尝试定位到"录取详情"区域，再在该区域内提取
            detail_section_match = re.search(r'录取详情.*?(?=服务导师|背景提升|项目简介|$)', html, re.DOTALL | re.IGNORECASE)
            search_html = detail_section_match.group(0) if detail_section_match else html
            
            # 匹配模式：更精确的模式
            patterns = [
                # 模式1: <tag>标签</tag><tag>值</tag> (最常见)
                rf'{re.escape(label)}</[^>]+>\s*<[^>]*>([^<]+)</[^>]+>',
                # 模式2: 标签值在同一文本节点，用空格或换行分隔
                # 例如：学生姓名L同学 或 学生姓名\nL同学
                rf'{re.escape(label)}(?:</[^>]+>)?\s*([A-Z]?[^\s<]+?同学|[^<]+?大学|[^<]+?硕士|[^<]+?专业|[^\n<]{2,30}?)(?:\s*!\[|<|$|\n|\\n)',
                # 模式3: <tag>标签</tag>直接跟文本值（非标签）
                rf'{re.escape(label)}</[^>]+>\s*([^<\n]{1,50}?)(?:\s*!\[|<[^>]*>|$|\n|\\n)',
            ]
            
            for pattern in patterns:
                match = re.search(pattern, search_html, re.IGNORECASE | re.DOTALL)
                if match:
                    value = match.group(1).strip()
                    # 清理HTML标签和markdown
                    value = re.sub(r'<[^>]+>', '', value)
                    value = re.sub(r'!\[.*?\]\(.*?\)', '', value)  # 移除markdown图片
                    value = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', value)  # 移除markdown链接，保留文本
                    value = value.strip()
                    
                    # 验证提取的值
                    if value and label not in value:
                        # 移除常见的不相关文本
                        invalid_keywords = ['申请手册', '类别分布', '成功案例', '预约咨询', '下载', '关注', '公司地址']
                        if not any(keyword in value for keyword in invalid_keywords):
                            value = self._clean_text(value)
                            # 限制长度，避免提取到整段内容
                            if value and 0 < len(value) <= 200:
                                return value
            
            # 方法2: 使用BeautifulSoup查找
            label_elem = soup.find(string=re.compile(rf'^{re.escape(label)}'))
            if not label_elem:
                label_elem = soup.find(string=re.compile(re.escape(label)))
            
            if label_elem:
                parent = label_elem.find_parent()
                if parent:
                    # 获取父元素的文本，但只取标签后的部分
                    full_text = parent.get_text(separator=' ')
                    match = re.search(rf'{re.escape(label)}\s+([^\n]+)', full_text)
                    if match:
                        value = match.group(1).strip()
                        value = self._clean_text(value)
                        if value and label not in value and 0 < len(value) <= 200:
                            invalid_keywords = ['申请手册', '类别分布', '成功案例', '预约咨询']
                            if not any(keyword in value for keyword in invalid_keywords):
                                return value
                    
                    # 查找下一个兄弟元素
                    next_sibling = parent.find_next_sibling()
                    if next_sibling:
                        value = next_sibling.get_text(strip=True)
                        value = self._clean_text(value)
                        if value and 0 < len(value) <= 200:
                            invalid_keywords = ['申请手册', '类别分布', '成功案例', '预约咨询']
                            if not any(keyword in value for keyword in invalid_keywords):
                                return value
                    
                    # 查找父元素的下一个兄弟元素
                    parent_next = parent.find_next()
                    if parent_next and parent_next != next_sibling:
                        value = parent_next.get_text(strip=True)
                        value = self._clean_text(value)
                        if value and 0 < len(value) <= 200:
                            invalid_keywords = ['申请手册', '类别分布', '成功案例', '预约咨询']
                            if not any(keyword in value for keyword in invalid_keywords):
                                return value
            
            return None
        except Exception as exc:
            logging.debug("提取字段 %s 时出错: %s", label, exc)
            return None

    def _parse_detail_html(self, url: str, html: str) -> Optional[OfferRecord]:
        """
        解析offer详情页HTML，提取所需信息
        
        Args:
            url: offer详情页URL
            html: 详情页HTML内容
            
        Returns:
            OfferRecord对象，如果解析失败则返回None
        """
        soup = BeautifulSoup(html, "html.parser")
        
        # 移除script和style标签，减少干扰
        for script in soup(["script", "style", "noscript"]):
            script.decompose()
        
        try:
            # 使用改进的方法提取各字段
            student_name = self._extract_field_value(soup, html, "学生姓名")
            admission_school = self._extract_field_value(soup, html, "录取学校")
            admission_major = self._extract_field_value(soup, html, "录取专业")
            graduation_school = self._extract_field_value(soup, html, "毕业学校")
            undergraduate_major = self._extract_field_value(soup, html, "本科专业")
            basic_background = self._extract_field_value(soup, html, "基本背景")
            
            # 提取主要经历（特殊处理，因为可能包含多行）
            main_experiences = None
            experiences_label = soup.find(string=re.compile(r'主要经历'))
            if experiences_label:
                parent = experiences_label.find_parent()
                if parent:
                    # 方法1: 查找下一个兄弟元素
                    next_elem = parent.find_next_sibling()
                    if next_elem:
                        exp_text = next_elem.get_text(separator='\n', strip=True)
                        if exp_text and len(exp_text) > 10:
                            # 清理文本
                            exp_text = re.sub(r'!\[.*?\]\(.*?\)', '', exp_text)
                            exp_text = re.sub(r'<[^>]+>', '', exp_text)
                            exp_text = re.sub(r'\n{3,}', '\n\n', exp_text)
                            main_experiences = exp_text.strip()
                    
                    # 方法2: 从父元素的后续内容中提取
                    if not main_experiences:
                        full_text = parent.get_text(separator='\n')
                        exp_match = re.search(r'主要经历\s*\n\s*(.+?)(?:\n\n+|\n背景提升|\n项目简介|$)', full_text, re.DOTALL)
                        if exp_match:
                            exp_text = exp_match.group(1).strip()
                            exp_text = re.sub(r'\n{3,}', '\n\n', exp_text)
                            if len(exp_text) > 10 and len(exp_text) < 5000:
                                main_experiences = exp_text
            
            # 方法3: 从HTML中直接匹配主要经历
            if not main_experiences:
                exp_match = re.search(
                    r'主要经历\s*</[^>]+>\s*(.+?)(?:<h[^>]*>背景提升|<h[^>]*>项目简介|背景提升|项目简介)',
                    html,
                    re.DOTALL | re.IGNORECASE
                )
                if exp_match:
                    exp_html = exp_match.group(1)
                    exp_soup = BeautifulSoup(exp_html, "html.parser")
                    # 移除script和style标签
                    for script in exp_soup(["script", "style"]):
                        script.decompose()
                    main_experiences = exp_soup.get_text(separator='\n').strip()
                    # 清理多余的空白行
                    main_experiences = re.sub(r'\n{3,}', '\n\n', main_experiences)
                    if len(main_experiences) > 5000:
                        main_experiences = None
            
            record = OfferRecord(
                url=url,
                student_name=student_name,
                admission_school=admission_school,
                admission_major=admission_major,
                graduation_school=graduation_school,
                undergraduate_major=undergraduate_major,
                basic_background=basic_background,
                main_experiences=main_experiences,
            )
            
            logging.info("解析成功: %s - %s", student_name or "未知", admission_school or "未知")
            return record
            
        except Exception as exc:
            logging.error("解析详情页失败 %s: %s", url, exc)
            return None

    def parse_detail_page(self, url: str) -> Optional[OfferRecord]:
        """
        访问并解析单个offer详情页
        
        Args:
            url: offer详情页URL
            
        Returns:
            OfferRecord对象，如果失败则返回None
        """
        driver = self._create_worker_driver()
        try:
            logging.debug("加载详情页: %s", url)
            driver.get(url)
            WebDriverWait(driver, 30).until(EC.presence_of_element_located((By.TAG_NAME, "body")))
            time.sleep(2)  # 等待页面完全加载
            html = driver.page_source
            return self._parse_detail_html(url, html)
        except TimeoutException:
            logging.error("加载详情页超时: %s", url)
            return None
        except WebDriverException as exc:
            logging.error("加载详情页失败 %s: %s", url, exc)
            return None
        finally:
            driver.quit()

    def _go_to_next_page(self, current_page: int, max_pages: int, previous_url: str) -> bool:
        """
        导航到下一页
        
        Args:
            current_page: 当前页码
            max_pages: 最大页数
            previous_url: 前一页的URL（用于验证是否真正翻页）
            
        Returns:
            是否成功导航到下一页
        """
        try:
            if current_page >= max_pages:
                return False
            
            # 保存当前页面的第一个offer链接用于验证
            current_links = self.extract_offer_links(self.driver.page_source)
            first_link_on_current_page = list(current_links)[0] if current_links else None
            
            next_page = current_page + 1
            
            # 方法1: 查找并点击页码数字链接（最可靠）
            try:
                # 先滚动到页面底部，确保分页器可见
                self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
                time.sleep(1)
                
                # 查找包含下一个页码数字的链接（多种方式）
                # 注意：实际URL格式是 /offer_p1, /offer_p2 等
                page_number_xpaths = [
                    f"//a[normalize-space(text())='{next_page}']",  # 精确匹配数字
                    f"//a[text()='{next_page}']",
                    f"//a[contains(@href, 'offer_p{next_page}')]",  # 匹配 /offer_p2 格式
                    f"//a[contains(@href, '_p{next_page}')]",  # 匹配 _p2 格式
                    f"//a[contains(@href, 'page={next_page}')]",
                    f"//a[contains(@href, '/{next_page}')]",
                    f"//a[contains(@href, 'p={next_page}')]",
                    f"//div[contains(@class, 'pagination')]//a[text()='{next_page}']",
                    f"//div[contains(@class, 'pagination')]//a[contains(@href, 'offer_p{next_page}')]",
                    f"//div[contains(@class, 'pagination')]//a[contains(@href, '{next_page}')]",
                ]
                
                page_links = []
                for xpath in page_number_xpaths:
                    try:
                        links = self.driver.find_elements(By.XPATH, xpath)
                        if links:
                            page_links.extend(links)
                            logging.info("通过XPath找到 %d 个页码链接: %s", len(links), xpath)
                            break
                    except Exception:
                        continue
                
                if not page_links:
                    # 如果没找到，尝试查找所有分页链接，然后筛选
                    try:
                        all_pagination_links = self.driver.find_elements(By.XPATH, 
                            "//div[contains(@class, 'pagination')]//a | //ul[contains(@class, 'pagination')]//a | //a[contains(@href, 'offer_p')] | //a[contains(@href, 'page=')] | //a[contains(@href, '/offer/')]")
                        for link in all_pagination_links:
                            link_text = link.text.strip()
                            href = link.get_attribute('href') or ''
                            # 匹配 /offer_p2 格式或页码数字
                            if (link_text == str(next_page) or 
                                f'offer_p{next_page}' in href or 
                                f'_p{next_page}' in href or
                                f'page={next_page}' in href or 
                                f'/{next_page}' in href):
                                page_links.append(link)
                                logging.info("通过通用查找找到页码链接: text=%s, href=%s", link_text, href)
                    except Exception as exc:
                        logging.debug("通用查找页码链接失败: %s", exc)
                
                for page_link in page_links:
                    try:
                        if page_link.is_enabled() and page_link.is_displayed():
                            href = page_link.get_attribute('href')
                            if href:
                                logging.info("找到页码链接: %s (页码: %d)", href, next_page)
                                # 滚动到可见位置
                                self.driver.execute_script("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", page_link)
                                time.sleep(0.5)
                                
                                # 使用JavaScript点击（更可靠）
                                self.driver.execute_script("arguments[0].click();", page_link)
                                self.wait.until(EC.presence_of_element_located((By.TAG_NAME, "body")))
                                time.sleep(3)  # 等待页面加载
                                
                                # 滚动页面确保内容加载
                                self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
                                time.sleep(1)
                                self.driver.execute_script("window.scrollTo(0, 0);")
                                time.sleep(1)
                                
                                # 验证页面是否真的变化了
                                new_links = self.extract_offer_links(self.driver.page_source)
                                new_first_link = list(new_links)[0] if new_links else None
                                
                                logging.info("验证翻页: 当前页第一个链接=%s, 新页第一个链接=%s", 
                                            first_link_on_current_page, new_first_link)
                                
                                if new_links:
                                    # 检查链接集合是否不同
                                    if current_links:
                                        new_unique_links = new_links - current_links
                                        if new_unique_links:
                                            logging.info("检测到 %d 个新链接，翻页成功！", len(new_unique_links))
                                            logging.info("成功翻页到第 %d 页（通过页码链接）", next_page)
                                            return True
                                        elif new_first_link != first_link_on_current_page:
                                            # 如果第一个链接不同，也认为成功
                                            logging.info("第一个链接不同，翻页成功！")
                                            logging.info("成功翻页到第 %d 页（通过页码链接）", next_page)
                                            return True
                                    else:
                                        logging.info("成功翻页到第 %d 页（通过页码链接，无对比链接）", next_page)
                                        return True
                    except Exception as link_exc:
                        logging.debug("处理页码链接失败: %s", link_exc)
                        continue
                        
            except Exception as exc:
                logging.warning("方法1（页码链接）失败: %s", exc)
            
            # 方法2: 尝试通过URL跳转（构造分页URL）
            # 根据实际网站格式：/offer_p1, /offer_p2, /offer_p3...
            url_patterns = []
            
            # 格式1: /offer_p{页码} (最可能的格式)
            url_patterns.append(f"{BASE_URL}/offer_p{next_page}")
            
            # 格式2: 如果当前URL已有_p参数，替换它
            current_url = self.driver.current_url
            if '_p' in current_url:
                new_url = re.sub(r'_p\d+', f'_p{next_page}', current_url)
                url_patterns.append(new_url)
            
            # 格式3: 备用格式（如果上面的不行）
            url_patterns.append(f"{LISTING_URL}?page={next_page}")
            url_patterns.append(f"{LISTING_URL}?p={next_page}")
            if '?' in current_url:
                url_patterns.append(f"{current_url.rstrip('/')}&page={next_page}")
            else:
                url_patterns.append(f"{current_url.rstrip('/')}?page={next_page}")
            
            for new_url in url_patterns:
                try:
                    logging.info("尝试URL跳转: %s", new_url)
                    self.driver.get(new_url)
                    self.wait.until(EC.presence_of_element_located((By.TAG_NAME, "body")))
                    
                    # 等待页面完全加载（包括JavaScript渲染）
                    time.sleep(3)
                    
                    # 滚动页面确保内容加载
                    self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
                    time.sleep(1)
                    self.driver.execute_script("window.scrollTo(0, 0);")
                    time.sleep(1)
                    
                    # 验证页面是否真的变化了
                    new_links = self.extract_offer_links(self.driver.page_source)
                    new_first_link = list(new_links)[0] if new_links else None
                    
                    # 使用INFO级别记录详细信息用于调试
                    logging.info("验证翻页: 当前页第一个链接=%s, 新页第一个链接=%s, 新页链接数=%d", 
                                first_link_on_current_page, new_first_link, len(new_links))
                    
                    if new_links:
                        # 比较链接集合是否不同（更可靠的验证方法）
                        if current_links:
                            # 检查是否有新的链接（集合差集）
                            new_unique_links = new_links - current_links
                            if new_unique_links:
                                logging.info("检测到 %d 个新链接，翻页成功！", len(new_unique_links))
                                logging.info("成功翻页到第 %d 页（通过URL跳转）", next_page)
                                return True
                            else:
                                # 如果链接集合完全相同，说明翻页失败
                                logging.warning("URL %s 访问后，链接集合完全相同，翻页失败", new_url)
                        else:
                            # 如果没有当前页链接用于比较，但有新链接，也认为成功
                            logging.info("成功翻页到第 %d 页（通过URL跳转，无对比链接）", next_page)
                            return True
                        
                        # 备用验证：如果第一个链接不同，也认为成功
                        if first_link_on_current_page and new_first_link != first_link_on_current_page:
                            # 进一步验证：检查链接集合是否真的不同
                            if current_links and new_links != current_links:
                                logging.info("成功翻页到第 %d 页（通过URL跳转）", next_page)
                                return True
                            elif not current_links:
                                # 如果没有当前页链接用于比较，但有新链接，也认为成功
                                logging.info("成功翻页到第 %d 页（通过URL跳转，无对比链接）", next_page)
                                return True
                            else:
                                logging.warning("URL %s 访问后，第一个链接变化但整体链接集相同，可能翻页失败", new_url)
                        else:
                            logging.warning("URL %s 访问后，第一个链接未变化，翻页可能失败", new_url)
                    else:
                        logging.warning("URL %s 访问后，未提取到任何链接", new_url)
                except Exception as exc:
                    logging.warning("URL %s 访问失败: %s", new_url, exc)
                    continue
            
            # 方法2: 尝试点击"下一页"按钮
            # 使用XPath查找包含"下一页"或">"的链接
            xpath_selectors = [
                "//a[contains(text(), '下一页')]",
                "//a[contains(text(), 'Next')]",
                "//a[@aria-label='下一页']",
                "//a[@aria-label='Next']",
                "//button[contains(text(), '下一页')]",
                "//a[contains(@class, 'next')]",
                "//a[contains(@class, 'pagination-next')]",
            ]
            
            for xpath in xpath_selectors:
                try:
                    next_buttons = self.driver.find_elements(By.XPATH, xpath)
                    for next_button in next_buttons:
                        if next_button.is_enabled() and next_button.is_displayed():
                            # 检查按钮是否可点击（不是disabled）
                            button_class = next_button.get_attribute('class') or ''
                            if 'disabled' not in button_class.lower():
                                self.driver.execute_script("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", next_button)
                                time.sleep(0.5)
                                
                                # 保存点击前的URL
                                url_before = self.driver.current_url
                                
                                # 点击按钮
                                self.driver.execute_script("arguments[0].click();", next_button)
                                time.sleep(3)  # 等待页面加载
                                
                                # 验证页面是否真的变化了
                                url_after = self.driver.current_url
                                new_links = self.extract_offer_links(self.driver.page_source)
                                
                                if new_links and (url_before != url_after or (first_link_on_current_page and list(new_links)[0] != first_link_on_current_page)):
                                    logging.info("成功翻页到第 %d 页（通过下一页按钮）", next_page)
                                    return True
                except Exception as exc:
                    logging.debug("XPath选择器 %s 查找失败: %s", xpath, exc)
                    continue
                
        except Exception as exc:
            logging.debug("导航到下一页失败: %s", exc)
            
        logging.warning("无法翻页到第 %d 页，可能已到最后一页", current_page + 1)
        return False

    def scrape(self, max_offers: Optional[int] = None, max_pages: Optional[int] = None) -> List[OfferRecord]:
        """
        执行爬取任务
        
        Args:
            max_offers: 最大爬取数量，None表示爬取全部
            max_pages: 最大页数，None表示爬取全部（共1002页）
            
        Returns:
            OfferRecord列表
        """
        all_detail_urls: Set[str] = set()
        current_page = 1
        max_pages = max_pages or 1002  # 默认1002页
        
        try:
            logging.info("加载offer列表页：%s (共%d页)", LISTING_URL, max_pages)
            self.driver.get(LISTING_URL)
            self.wait.until(EC.presence_of_element_located((By.TAG_NAME, "body")))
            time.sleep(3)  # 等待页面加载

            # 检查是否有安全校验（如验证码）
            listing_html = self.driver.page_source
            if "h-captcha" in listing_html or "验证码" in listing_html:
                logging.warning("检测到安全校验，请在浏览器中完成验证后按 Enter 继续。")
                try:
                    input("完成验证码后按 Enter 继续...")
                except EOFError:
                    logging.error("无法等待用户输入，建议在本地非 headless 模式运行。")
                    return []
                time.sleep(2)
                listing_html = self.driver.page_source

            # 循环遍历所有页面
            previous_url = self.driver.current_url
            
            while current_page <= max_pages:
                logging.info("正在爬取第 %d/%d 页...", current_page, max_pages)
                
                # 滚动页面确保内容加载
                self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
                time.sleep(1)
                self.driver.execute_script("window.scrollTo(0, 0);")
                time.sleep(1)
                
                listing_html = self.driver.page_source
                
                # 提取当前页的offer链接
                page_urls = self.extract_offer_links(listing_html)
                before_count = len(all_detail_urls)
                all_detail_urls.update(page_urls)
                after_count = len(all_detail_urls)
                new_count = after_count - before_count
                
                logging.info("第 %d 页提取到 %d 个新链接 (累计: %d)", current_page, new_count, after_count)
                
                # 如果限制offer数量且已达到，则停止
                if max_offers and len(all_detail_urls) >= max_offers:
                    logging.info("已达到限制数量 %d，停止爬取", max_offers)
                    break
                
                # 保存当前URL
                current_url_before = self.driver.current_url
                
                # 尝试翻到下一页
                if not self._go_to_next_page(current_page, max_pages, previous_url):
                    logging.info("无法翻到下一页，可能已到最后一页（当前在第 %d 页）", current_page)
                    break
                
                # 验证是否真的翻页了
                current_url_after = self.driver.current_url
                if current_url_before == current_url_after:
                    # 如果URL没变，再验证一下链接是否变化
                    new_page_urls = self.extract_offer_links(self.driver.page_source)
                    if new_page_urls == page_urls:
                        logging.warning("翻页后页面内容未变化，可能已到最后一页")
                        break
                
                previous_url = current_url_before
                current_page += 1
                
                # 每10页输出一次进度
                if current_page % 10 == 0:
                    logging.info("已处理 %d 页，累计提取 %d 个链接", current_page - 1, len(all_detail_urls))
            
            # 转换为列表并限制数量
            detail_urls = list(all_detail_urls)
            if max_offers:
                detail_urls = detail_urls[:max_offers]
                logging.info("限制爬取数量为 %d 条", max_offers)

            logging.info("共从 %d 页提取到 %d 个offer链接，开始爬取详情页", current_page - 1, len(detail_urls))

            # 并发爬取详情页
            results: List[OfferRecord] = []
            with ThreadPoolExecutor(max_workers=self.max_workers) as executor:
                future_map = {executor.submit(self.parse_detail_page, url): url for url in detail_urls}
                for future in as_completed(future_map):
                    url = future_map[future]
                    try:
                        record = future.result()
                        if record:
                            # 使用锁保护结果列表的写入
                            with self.results_lock:
                                results.append(record)
                                current_count = len(results)
                            logging.info("进度: %d/%d", current_count, len(detail_urls))
                    except Exception as exc:
                        logging.exception("解析 %s 时发生错误: %s", url, exc)
                    finally:
                        time.sleep(REQUEST_DELAY)

            logging.info("成功爬取 %d 个offer记录", len(results))
            return results
            
        except TimeoutException:
            logging.error("列表页加载超时，终止任务")
            return []
        except WebDriverException as exc:
            logging.error("列表页加载失败：%s", exc)
            return []
        finally:
            try:
                self.driver.quit()
            except Exception:
                pass


def save_to_json(records: List[OfferRecord], output_path: Path) -> None:
    """
    保存数据到JSON文件（使用临时文件+原子性重命名，确保写入安全）
    """
    data = [asdict(record) for record in records]
    # 使用临时文件，写入完成后再重命名，确保原子性
    temp_path = output_path.with_suffix(output_path.suffix + '.tmp')
    try:
        with open(temp_path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        # 原子性重命名
        temp_path.replace(output_path)
        logging.info("已保存 %d 条记录到 JSON 文件: %s", len(records), output_path)
    except Exception as exc:
        logging.error("保存JSON文件失败: %s", exc)
        # 清理临时文件
        if temp_path.exists():
            temp_path.unlink()
        raise


def save_to_csv(records: List[OfferRecord], output_path: Path) -> None:
    """
    保存数据到CSV文件（使用临时文件+原子性重命名，确保写入安全）
    """
    if not records:
        logging.warning("没有数据可保存")
        return

    fieldnames = [
        "url",
        "student_name",
        "admission_school",
        "admission_major",
        "graduation_school",
        "undergraduate_major",
        "basic_background",
        "main_experiences",
    ]

    # 使用临时文件，写入完成后再重命名，确保原子性
    temp_path = output_path.with_suffix(output_path.suffix + '.tmp')
    try:
        with open(temp_path, "w", newline="", encoding="utf-8-sig") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            for record in records:
                writer.writerow(asdict(record))
        # 原子性重命名
        temp_path.replace(output_path)
        logging.info("已保存 %d 条记录到 CSV 文件: %s", len(records), output_path)
    except Exception as exc:
        logging.error("保存CSV文件失败: %s", exc)
        # 清理临时文件
        if temp_path.exists():
            temp_path.unlink()
        raise


def main() -> int:
    """主函数"""
    parser = argparse.ArgumentParser(
        description="爬取指南者留学offer案例库",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument(
        "--output-json",
        type=Path,
        help="JSON输出文件路径",
        default=Path("compass_offers.json"),
    )
    parser.add_argument(
        "--output-csv",
        type=Path,
        help="CSV输出文件路径",
        default=Path("compass_offers.csv"),
    )
    parser.add_argument(
        "--max-workers",
        type=int,
        default=3,
        help="并发线程数（默认: 3）",
    )
    parser.add_argument(
        "--max-offers",
        type=int,
        help="最大爬取数量（测试用）",
    )
    parser.add_argument(
        "--max-pages",
        type=int,
        default=1002,
        help="最大爬取页数（默认: 1002）",
    )
    parser.add_argument(
        "--headless",
        action="store_true",
        help="使用无头模式（不显示浏览器窗口）",
    )
    parser.add_argument(
        "--log-level",
        choices=["DEBUG", "INFO", "WARNING", "ERROR"],
        default="INFO",
        help="日志级别（默认: INFO）",
    )

    args = parser.parse_args()

    # 配置日志
    logging.basicConfig(
        level=getattr(logging, args.log_level),
        format="%(asctime)s - %(levelname)s - %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )

    try:
        scraper = CompassOfferScraper(max_workers=args.max_workers, headless=args.headless)
        records = scraper.scrape(max_offers=args.max_offers, max_pages=args.max_pages)

        if not records:
            logging.warning("未爬取到任何数据")
            return 1

        # 保存数据
        if args.output_json:
            save_to_json(records, args.output_json)
        if args.output_csv:
            save_to_csv(records, args.output_csv)

        logging.info("爬取任务完成！共获取 %d 条offer记录", len(records))
        return 0

    except KeyboardInterrupt:
        logging.info("用户中断任务")
        return 130
    except Exception as exc:
        logging.exception("发生未预期的错误: %s", exc)
        return 1


if __name__ == "__main__":
    sys.exit(main())

