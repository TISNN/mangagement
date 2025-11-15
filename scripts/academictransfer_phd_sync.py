#!/usr/bin/env python3
"""
AcademicTransfer PhD Positions Sync
-----------------------------------

本脚本用于：
1. 从 AcademicTransfer 抓取全球博士岗位（function_types=1）
2. 解析岗位详情（描述、要求、申请流程、截止时间等）
3. 可选生成中文摘要
4. 将结果写入 Supabase `phd_positions` 表（默认 upsert）
5. 输出 JSON 备份，支持 dry-run / CLI 参数

依赖：
- selenium
- beautifulsoup4
- requests
- （可选）python-dotenv

运行示例：
```
python3 academictransfer_phd_sync.py \
  --max-pages 6 \
  --delay 2.5 \
  --detail-delay 1.0 \
  --output ../data/phd_positions.json \
  --enable-translation \
  --dry-run
```
"""

from __future__ import annotations

import argparse
import json
import logging
import os
import re
import sys
import time
from dataclasses import dataclass, field
from datetime import datetime, timezone
from itertools import islice
from pathlib import Path
from typing import Dict, Iterable, List, Optional, Set, Tuple

import requests
from bs4 import BeautifulSoup, NavigableString, Tag
from selenium import webdriver
from selenium.common.exceptions import (
    ElementClickInterceptedException,
    ElementNotInteractableException,
    TimeoutException,
    WebDriverException,
)
from selenium.webdriver import Chrome
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

# 尝试加载 .env（如未安装 python-dotenv 则忽略）
try:
    from dotenv import load_dotenv  # type: ignore

    load_dotenv()
except Exception:  # pragma: no cover - 非核心逻辑
    pass


LIST_URL = "https://www.academictransfer.com/en/jobs?function_types=1"
JOB_URL_PATTERN = re.compile(r"https://www\.academictransfer\.com/en/jobs/(\d+)/(.*?)/?")
TRANSLATE_ENDPOINT = "https://translate.googleapis.com/translate_a/single"
DEFAULT_SUPABASE_TABLE = "phd_positions"


# ---------------------------
# 数据结构
# ---------------------------


@dataclass
class JobRecord:
    """结构化后的岗位数据，用于写入 Supabase。"""

    source_id: str
    official_link: str
    title_en: str
    title_zh: Optional[str]
    country: Optional[str]
    city: Optional[str]
    university: Optional[str]
    department: Optional[str]
    intake_term: Optional[str]
    deadline: Optional[str]
    deadline_status: str
    employment_type: Optional[str]
    weekly_hours: Optional[str]
    education_level: Optional[str]
    funding_level: str
    supports_international: bool
    description_en: str
    description_zh: Optional[str]
    requirements_en: str
    requirements_zh: Optional[str]
    application_steps_en: str
    application_steps_zh: Optional[str]
    tags: List[str] = field(default_factory=list)
    match_score: int = 50
    status: str = "open"
    last_scraped_at: str = field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat()
    )
    raw_payload: Dict = field(default_factory=dict)

    def to_dict(self) -> Dict:
        """转换为 Supabase 期望的字典格式。"""
        return {
            "source": "academictransfer",
            "source_id": self.source_id,
            "official_link": self.official_link,
            "title_en": self.title_en,
            "title_zh": self.title_zh or None,
            "university": self.university,
            "department": self.department,
            "country": self.country,
            "city": self.city,
            "intake_term": self.intake_term,
            "deadline": self.deadline,
            "deadline_status": self.deadline_status,
            "employment_type": self.employment_type,
            "workload_hours_per_week": self.weekly_hours,
            "education_level": self.education_level,
            "funding_level": self.funding_level,
            "supports_international": self.supports_international,
            "description_en": self.description_en,
            "description_zh": self.description_zh or None,
            "requirements_en": self.requirements_en,
            "requirements_zh": self.requirements_zh or None,
            "application_steps_en": self.application_steps_en,
            "application_steps_zh": self.application_steps_zh or None,
            "tags": self.tags,
            "match_score": self.match_score,
            "status": self.status,
            "last_scraped_at": self.last_scraped_at,
            "raw_payload": self.raw_payload or None,
        }


# ---------------------------
# 同步主类
# ---------------------------


class AcademicTransferPhDSync:
    def __init__(
        self,
        *,
        max_pages: int = 8,
        delay: float = 2.5,
        detail_delay: float = 1.0,
        max_jobs: Optional[int] = None,
        headless: bool = True,
        dry_run: bool = False,
        enable_translation: bool = False,
        output_path: Optional[Path] = None,
        log_file: Optional[Path] = None,
        supabase_url: Optional[str] = None,
        supabase_key: Optional[str] = None,
        supabase_table: str = DEFAULT_SUPABASE_TABLE,
        supabase_batch_size: int = 50,
        http_timeout: int = 30,
    ) -> None:
        self.max_pages = max_pages
        self.delay = delay
        self.detail_delay = detail_delay
        self.max_jobs = max_jobs
        self.headless = headless
        self.dry_run = dry_run
        self.enable_translation = enable_translation
        self.output_path = output_path
        self.supabase_url = (supabase_url or os.getenv("VITE_SUPABASE_URL", "")).rstrip("/")
        self.supabase_key = (
            supabase_key
            or os.getenv("SUPABASE_SERVICE_ROLE_KEY")
            or os.getenv("VITE_SUPABASE_SERVICE_ROLE_KEY")
            or os.getenv("VITE_SUPABASE_ANON_KEY", "")
        )
        self.supabase_table = supabase_table
        self.supabase_batch_size = supabase_batch_size
        self.http_timeout = http_timeout

        self.session = requests.Session()
        self.session.headers.update(
            {
                "User-Agent": (
                    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0 Safari/537.36"
                ),
                "Accept-Language": "en-US,en;q=0.9",
            }
        )

        self._driver: Optional[Chrome] = None

        self._setup_logging(log_file)
        logging.debug(
            "AcademicTransferPhDSync initialized with params: %s",
            {
                "max_pages": max_pages,
                "delay": delay,
                "detail_delay": detail_delay,
                "max_jobs": max_jobs,
                "headless": headless,
                "dry_run": dry_run,
                "enable_translation": enable_translation,
                "output_path": str(output_path) if output_path else None,
                "supabase_url": self.supabase_url,
                "supabase_table": supabase_table,
            },
        )

    # ---------------------------
    # Logging & Driver
    # ---------------------------

    def _setup_logging(self, log_file: Optional[Path]) -> None:
        handlers = [logging.StreamHandler(sys.stdout)]
        if log_file:
            handlers.append(logging.FileHandler(log_file, encoding="utf-8"))

        logging.basicConfig(
            level=logging.INFO,
            format="%(asctime)s [%(levelname)s] %(message)s",
            handlers=handlers,
        )

    def _init_driver(self) -> Chrome:
        options = Options()
        if self.headless:
            options.add_argument("--headless")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        options.add_argument("--disable-blink-features=AutomationControlled")
        options.add_argument(
            "user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/118.0 Safari/537.36"
        )
        try:
            driver = webdriver.Chrome(options=options)
        except WebDriverException as exc:
            logging.error("无法初始化 ChromeDriver，请确认已安装驱动。\n%s", exc)
            raise

        self._driver = driver
        return driver

    def _close_driver(self) -> None:
        if self._driver:
            try:
                self._driver.quit()
            except Exception:
                pass
            finally:
                self._driver = None

    # ---------------------------
    # 爬虫流程
    # ---------------------------

    def collect_job_links(self) -> List[str]:
        driver = self._init_driver()
        all_links: Set[str] = set()
        pages_loaded = 0

        try:
            logging.info("打开列表页: %s", LIST_URL)
            driver.get(LIST_URL)
            WebDriverWait(driver, 30).until(EC.presence_of_element_located((By.TAG_NAME, "body")))
            time.sleep(self.delay)

            while True:
                new_links = self._extract_links_from_dom(driver)
                before = len(all_links)
                all_links.update(new_links)
                after = len(all_links)
                logging.info("当前职位链接数: %s (+%s)", after, after - before)

                pages_loaded += 1
                if self.max_pages and pages_loaded >= self.max_pages:
                    logging.info("达到 max-pages 限制（%s），停止加载更多。", self.max_pages)
                    break

                if not self._click_show_more(driver):
                    logging.info("未找到“Show more results”按钮，结束抓取。")
                    break

                time.sleep(self.delay)

                if self.max_jobs and len(all_links) >= self.max_jobs:
                    logging.info("达到 max-jobs 限制（%s），结束抓取。", self.max_jobs)
                    break

        finally:
            self._close_driver()

        links_sorted = sorted(all_links)
        if self.max_jobs:
            links_sorted = links_sorted[: self.max_jobs]
        logging.info("最终共获取职位链接 %s 条。", len(links_sorted))
        return links_sorted

    def _extract_links_from_dom(self, driver: Chrome) -> Set[str]:
        anchors = driver.find_elements(By.CSS_SELECTOR, "a[href*='/en/jobs/']")
        links: Set[str] = set()
        for anchor in anchors:
            href = anchor.get_attribute("href")
            if not href:
                continue
            match = JOB_URL_PATTERN.match(href)
            if not match:
                continue
            vacancy_id, slug = match.groups()
            slug = (slug or "").strip("/")
            if not slug:
                # 如果链接缺少 slug，则采用原始 href 去除多余斜杠
                normalized = href.split("?")[0].strip()
                normalized = normalized.rstrip("/") + "/"
            else:
                normalized = f"https://www.academictransfer.com/en/jobs/{vacancy_id}/{slug}/"
            links.add(normalized)
        return links

    def _click_show_more(self, driver: Chrome) -> bool:
        """尝试点击 'Show more results' 按钮，成功返回 True。"""
        try:
            buttons = driver.find_elements(By.TAG_NAME, "button")
            for button in buttons:
                text = (button.text or "").strip()
                if "Show more results" in text:
                    logging.info("点击按钮: %s", text)
                    prev_count = len(self._extract_links_from_dom(driver))
                    try:
                        button.click()
                    except (ElementNotInteractableException, ElementClickInterceptedException):
                        driver.execute_script("arguments[0].click();", button)

                    WebDriverWait(driver, 30).until(
                        lambda d: len(self._extract_links_from_dom(d)) > prev_count
                    )
                    return True
        except TimeoutException:
            logging.warning("等待新职位加载超时。")
        except Exception as exc:
            logging.error("点击“Show more results”时出错: %s", exc)
        return False

    # ---------------------------
    # 详情解析
    # ---------------------------

    def fetch_job_detail(self, url: str) -> Optional[JobRecord]:
        logging.info("解析岗位详情: %s", url)
        try:
            resp = self.session.get(url, timeout=self.http_timeout)
            resp.raise_for_status()
        except requests.RequestException as exc:
            logging.error("请求详情页失败: %s | %s", url, exc)
            return None

        soup = BeautifulSoup(resp.text, "html.parser")
        ld_json = soup.find("script", attrs={"type": "application/ld+json"})
        if not ld_json:
            logging.error("未找到 JobPosting JSON: %s", url)
            return None

        try:
            job_json = json.loads(ld_json.string)
        except json.JSONDecodeError as exc:
            logging.error("解析 JobPosting JSON 失败: %s | %s", url, exc)
            return None

        match = JOB_URL_PATTERN.match(url)
        if not match:
            logging.warning("URL 未匹配到 vacancyId: %s", url)
            return None

        vacancy_id, slug = match.groups()
        meta = self._extract_meta_info(soup)
        sections = self._extract_sections(soup, job_json)

        title = job_json.get("title") or sections.get("title") or "PhD Position"
        country, city = self._extract_location(job_json)
        university, department = self._extract_organization(job_json)
        intake_term = self._detect_intake(
            " ".join([sections.get("description_en", ""), sections.get("requirements_en", "")])
        )
        deadline_iso, deadline_status = self._parse_deadline(job_json.get("validThrough"))
        funding_level = self._infer_funding_level(
            sections.get("description_en", ""), sections.get("requirements_en", "")
        )
        supports_international = self._infer_international_support(
            sections.get("description_en", ""), sections.get("requirements_en", "")
        )
        status = self._derive_status(deadline_iso)
        tags = self._collect_tags(meta, job_json, sections)

        record = JobRecord(
            source_id=vacancy_id,
            official_link=url,
            title_en=title.strip(),
            title_zh=None,
            country=country,
            city=city,
            university=university,
            department=department,
            intake_term=intake_term,
            deadline=deadline_iso,
            deadline_status=deadline_status,
            employment_type=job_json.get("employmentType") or meta.get("Job types"),
            weekly_hours=meta.get("Weekly hours"),
            education_level=meta.get("Education level"),
            funding_level=funding_level,
            supports_international=supports_international,
            description_en=sections.get("description_en", ""),
            description_zh=None,
            requirements_en=sections.get("requirements_en", ""),
            requirements_zh=None,
            application_steps_en=sections.get("application_steps_en", ""),
            application_steps_zh=None,
            tags=tags,
            status=status,
            raw_payload=job_json,
        )

        if self.enable_translation:
            self._translate_record(record)

        time.sleep(self.detail_delay)
        return record

    def _extract_meta_info(self, soup: BeautifulSoup) -> Dict[str, str]:
        meta: Dict[str, str] = {}
        for container in soup.select("div"):
            label = container.find(
                "p",
                attrs={"class": re.compile(r"text-sm.*uppercase.*text-gray-500")},
            )
            value = None
            if label:
                value = label.find_next_sibling("p")
            if label and value:
                key = label.get_text(strip=True)
                val_text = value.get_text(" ", strip=True)
                if key and val_text:
                    meta[key] = val_text
        return meta

    def _extract_sections(self, soup: BeautifulSoup, job_json: Dict) -> Dict[str, str]:
        from_json = self._extract_sections_from_jobposting(job_json)
        if any(from_json.values()):
            return from_json
        return self._extract_sections_from_dom(soup)

    def _extract_sections_from_jobposting(self, job_json: Dict) -> Dict[str, str]:
        html = job_json.get("description") or ""
        if not html:
            return {k: "" for k in ["description_en", "requirements_en", "application_steps_en"]}

        soup = BeautifulSoup(html, "html.parser")
        sections: Dict[str, List[str]] = {
            "description_en": [],
            "requirements_en": [],
            "application_steps_en": [],
        }
        current = "description_en"

        for element in soup.descendants:
            if isinstance(element, NavigableString):
                text = element.strip()
                if text:
                    parent = element.parent
                    if isinstance(parent, Tag) and parent.name in {"li", "ul", "ol"}:
                        continue
                    sections[current].append(text)
                continue

            if not isinstance(element, Tag):
                continue

            if element.name == "strong":
                heading = element.get_text(" ", strip=True).lower()
                if "requirement" in heading:
                    current = "requirements_en"
                    continue
                if "application" in heading or "procedure" in heading:
                    current = "application_steps_en"
                    continue
                if "job description" in heading or "about" in heading:
                    current = "description_en"
                    continue
                current = "description_en"
                continue

            if element.name in {"li"}:
                sections[current].append(f"- {element.get_text(' ', strip=True)}")
                continue

            if element.name in {"p", "div"}:
                text = element.get_text(" ", strip=True)
                if text:
                    sections[current].append(text)

        return {key: self._clean_text("\n".join(filter(None, values))) for key, values in sections.items()}

    def _classify_section_heading(self, heading: str) -> Optional[str]:
        if not heading:
            return None
        normalized = heading.lower()
        ignore_keywords = [
            "working at",
            "employer information",
            "interesting for you",
            "recommended jobs",
            "related vacancies",
            "share this job",
            "contact",
        ]
        if any(keyword in normalized for keyword in ignore_keywords):
            return None

        requirements_keywords = [
            "requirement",
            "qualification",
            "who are you",
            "profile",
            "your profile",
            "what you bring",
            "skills",
            "competence",
            "functie-eisen",
            "vereisten",
            "wij vragen",
        ]
        application_keywords = [
            "application",
            "apply",
            "procedure",
            "how to apply",
            "selection",
            "sollicitatie",
            "recruitment process",
        ]
        description_keywords = [
            "job description",
            "about",
            "position",
            "role",
            "introduction",
            "project",
            "what you will do",
            "functiebeschrijving",
            "we offer",
        ]

        if any(keyword in normalized for keyword in requirements_keywords):
            return "requirements_en"
        if any(keyword in normalized for keyword in application_keywords):
            return "application_steps_en"
        if any(keyword in normalized for keyword in description_keywords):
            return "description_en"
        return None

    def _extract_text_from_section(self, section: Tag) -> str:
        pieces: List[str] = []
        for element in section.descendants:
            if isinstance(element, NavigableString):
                parent = element.parent
                if parent and parent.name in {"script", "style", "h1", "h2", "h3", "h4", "h5", "h6"}:
                    continue
                text = element.strip()
                if text:
                    pieces.append(text)
                continue

            if not isinstance(element, Tag):
                continue

            if element.name in {"script", "style"}:
                continue

            if element.name == "li":
                text = element.get_text(" ", strip=True)
                if text:
                    pieces.append(f"- {text}")
                continue

            if element.name == "p":
                text = element.get_text(" ", strip=True)
                if text:
                    pieces.append(text)

        return self._clean_text("\n".join(pieces))

    def _extract_sections_from_structured_dom(self, soup: BeautifulSoup) -> Dict[str, str]:
        sections: Dict[str, List[str]] = {
            "description_en": [],
            "requirements_en": [],
            "application_steps_en": [],
        }

        for block in soup.find_all("section"):
            heading_tag = block.find(["h1", "h2", "h3", "h4"])
            heading_text = heading_tag.get_text(" ", strip=True) if heading_tag else ""
            section_key = self._classify_section_heading(heading_text)
            if not section_key:
                continue
            if heading_tag:
                heading_tag.extract()
            content = self._extract_text_from_section(block)
            if content:
                sections[section_key].append(content)

        return {
            key: self._clean_text("\n".join(filter(None, values)))
            for key, values in sections.items()
        }

    def _extract_sections_from_first_section(self, soup: BeautifulSoup) -> Dict[str, str]:
        sections_dom = soup.find_all("section")
        section = None
        for candidate in sections_dom:
            headings = candidate.find_all("h2")
            if any("job description" in h.get_text(" ", strip=True).lower() for h in headings):
                section = candidate
                break
        if not section and sections_dom:
            section = sections_dom[0]

        if not section:
            return {
                "description_en": "",
                "requirements_en": "",
                "application_steps_en": "",
            }

        sections: Dict[str, List[str]] = {
            "description_en": [],
            "requirements_en": [],
            "application_steps_en": [],
        }
        current = "description_en"

        for element in section.descendants:
            if isinstance(element, NavigableString):
                text = element.strip()
                if text:
                    sections[current].append(text)
                continue

            if not isinstance(element, Tag):
                continue

            if element.name == "strong":
                heading = element.get_text(" ", strip=True).lower()
                if "requirement" in heading:
                    current = "requirements_en"
                    continue
                if "application" in heading:
                    current = "application_steps_en"
                    continue
                if "job description" in heading or "about" in heading:
                    current = "description_en"
                    continue

            if element.name in {"script", "style"}:
                continue

            if element.name in {"br"}:
                sections[current].append("\n")
                continue

            if element.name in {"li"}:
                sections[current].append(f"- {element.get_text(' ', strip=True)}")
                continue

            if element.name in {"p", "div"}:
                text = element.get_text(" ", strip=True)
                if text:
                    sections[current].append(text)

        return {
            key: self._clean_text("\n".join(filter(None, values)))
            for key, values in sections.items()
        }

    def _extract_sections_from_dom(self, soup: BeautifulSoup) -> Dict[str, str]:
        structured = self._extract_sections_from_structured_dom(soup)
        if any(structured.values()):
            fallback = self._extract_sections_from_first_section(soup)
            for key in structured.keys():
                if not structured[key]:
                    structured[key] = fallback.get(key, "")
            return structured
        return self._extract_sections_from_first_section(soup)

    def _extract_location(self, job_json: Dict) -> Tuple[Optional[str], Optional[str]]:
        location = job_json.get("jobLocation")
        if isinstance(location, dict):
            address = location.get("address", {})
            return address.get("addressCountry"), address.get("addressLocality")
        if isinstance(location, list) and location:
            return self._extract_location(location[0])
        return None, None

    def _extract_organization(self, job_json: Dict) -> Tuple[Optional[str], Optional[str]]:
        org = job_json.get("hiringOrganization") or {}
        if isinstance(org, dict):
            name = org.get("name")
            department = org.get("department") or org.get("subOrganization")
            if isinstance(department, dict):
                department = department.get("name")
            return name, department
        return None, None

    def _parse_deadline(self, deadline_str: Optional[str]) -> Tuple[Optional[str], str]:
        if not deadline_str:
            return None, "unknown"
        try:
            deadline_dt = datetime.fromisoformat(deadline_str)
            return deadline_dt.astimezone(timezone.utc).isoformat(), "confirmed"
        except ValueError:
            logging.warning("无法解析截止时间: %s", deadline_str)
            return None, "unknown"

    def _infer_funding_level(self, *texts: str) -> str:
        combined = " ".join(filter(None, texts)).lower()
        if any(keyword in combined for keyword in ["fully funded", "full scholarship", "full funding", "full-time employment"]):
            return "full"
        if any(keyword in combined for keyword in ["partial scholarship", "partial funding", "stipend", "allowance"]):
            return "partial"
        return "unspecified"

    def _infer_international_support(self, *texts: str) -> bool:
        combined = " ".join(filter(None, texts)).lower()
        keywords = ["international", "global", "worldwide", "non-eu", "visa", "relocation"]
        return any(keyword in combined for keyword in keywords)

    def _derive_status(self, deadline_iso: Optional[str]) -> str:
        if not deadline_iso:
            return "open"
        try:
            deadline_dt = datetime.fromisoformat(deadline_iso)
        except ValueError:
            return "open"
        now = datetime.now(timezone.utc)
        if deadline_dt < now:
            return "expired"
        days_remaining = (deadline_dt - now).days
        if days_remaining <= 14:
            return "closing_soon"
        return "open"

    def _collect_tags(self, meta: Dict[str, str], job_json: Dict, sections: Dict[str, str]) -> List[str]:
        tags: Set[str] = set()
        for key in ["Academic fields", "Job types", "Education level"]:
            value = meta.get(key)
            if value:
                tags.update([item.strip() for item in value.split(",")])
        employment_type = job_json.get("employmentType")
        if isinstance(employment_type, list):
            tags.update(employment_type)
        elif employment_type:
            tags.add(employment_type)

        description = sections.get("description_en", "").lower()
        if "phd" in description:
            tags.add("PhD")
        if "engineering" in description:
            tags.add("Engineering")
        return sorted(tag for tag in tags if tag)

    def _detect_intake(self, text: str) -> Optional[str]:
        pattern = re.compile(r"(20\d{2})\s*(Fall|Spring|Summer|Winter)", re.IGNORECASE)
        match = pattern.search(text)
        if match:
            year, season = match.groups()
            return f"{year} {season.capitalize()}"
        reverse_pattern = re.compile(r"(Fall|Spring|Summer|Winter)\s*(20\d{2})", re.IGNORECASE)
        match = reverse_pattern.search(text)
        if match:
            season, year = match.groups()
            return f"{year} {season.capitalize()}"
        return None

    def _clean_text(self, text: str) -> str:
        text = re.sub(r"\n{2,}", "\n", text)
        text = re.sub(r"[ \t]{2,}", " ", text)
        text = text.replace("\u00a0", " ").strip()
        return text

    # ---------------------------
    # 翻译
    # ---------------------------

    def _translate_record(self, record: JobRecord) -> None:
        for field_en, field_zh in [
            ("title_en", "title_zh"),
            ("description_en", "description_zh"),
            ("requirements_en", "requirements_zh"),
            ("application_steps_en", "application_steps_zh"),
        ]:
            text = getattr(record, field_en)
            if not text:
                continue
            translated = self._translate_text(text)
            if translated:
                setattr(record, field_zh, translated)

    def _translate_text(self, text: str, target_lang: str = "zh-CN") -> Optional[str]:
        payload = {
            "client": "gtx",
            "sl": "auto",
            "tl": target_lang,
            "dt": "t",
            "q": text,
        }
        try:
            resp = self.session.get(TRANSLATE_ENDPOINT, params=payload, timeout=15)
            resp.raise_for_status()
            data = resp.json()
            translated = "".join(segment[0] for segment in data[0])
            return translated.strip()
        except Exception as exc:  # pragma: no cover - 外部 API 不稳定
            logging.warning("翻译失败（%s...）：%s", text[:30], exc)
            return None

    # ---------------------------
    # Supabase 写入
    # ---------------------------

    def upsert_supabase(self, records: List[JobRecord]) -> None:
        if not self.supabase_url or not self.supabase_key:
            logging.warning("未配置 Supabase URL 或 Key，跳过写入。")
            return

        endpoint = f"{self.supabase_url}/rest/v1/{self.supabase_table}"
        headers = {
            "apikey": self.supabase_key,
            "Authorization": f"Bearer {self.supabase_key}",
            "Content-Type": "application/json",
            "Prefer": "resolution=merge-duplicates,return=minimal",
        }

        logging.info("开始写入 Supabase（批量大小：%s）", self.supabase_batch_size)

        for chunk in self._chunk(records, self.supabase_batch_size):
            payload = [record.to_dict() for record in chunk]
            try:
                resp = self.session.post(
                    endpoint,
                    headers=headers,
                    data=json.dumps(payload),
                    timeout=self.http_timeout,
                )
                if not resp.ok:
                    logging.error(
                        "Supabase upsert 失败（HTTP %s）：%s",
                        resp.status_code,
                        resp.text[:500],
                    )
                else:
                    logging.info("Supabase upsert 成功，记录数：%s", len(payload))
            except requests.RequestException as exc:
                logging.error("Supabase upsert 请求异常：%s", exc)

    @staticmethod
    def _chunk(iterable: Iterable[JobRecord], size: int) -> Iterable[List[JobRecord]]:
        iterator = iter(iterable)
        for first in iterator:
            chunk = [first] + list(islice(iterator, size - 1))
            yield chunk

    # ---------------------------
    # 主流程
    # ---------------------------

    def run(self) -> None:
        links = self.collect_job_links()
        records: List[JobRecord] = []
        failed_links: List[str] = []

        for idx, link in enumerate(links, start=1):
            logging.info("处理岗位 [%s/%s]", idx, len(links))
            record = self.fetch_job_detail(link)
            if record:
                records.append(record)
            else:
                failed_links.append(link)

        if failed_links:
            logging.warning("共有 %s 个岗位解析失败。", len(failed_links))

        if not records:
            logging.error("没有成功解析的岗位，终止写入。")
            return

        logging.info("解析完成，共 %s 条岗位。", len(records))

        if self.output_path:
            self._write_output(records, failed_links)

        if self.dry_run:
            logging.info("dry-run 模式：仅输出数据，不写入 Supabase。")
            return

        self.upsert_supabase(records)

    def _write_output(self, records: List[JobRecord], failed_links: List[str]) -> None:
        output = {
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "total": len(records),
            "failed": failed_links,
            "items": [record.to_dict() for record in records],
        }
        self.output_path.parent.mkdir(parents=True, exist_ok=True)
        with self.output_path.open("w", encoding="utf-8") as f:
            json.dump(output, f, ensure_ascii=False, indent=2)
        logging.info("结果已写入：%s", self.output_path)


# ---------------------------
# CLI 入口
# ---------------------------


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="同步 AcademicTransfer 博士岗位")
    parser.add_argument("--max-pages", type=int, default=8, help="最多点击“Show more”次数")
    parser.add_argument("--max-jobs", type=int, help="限制抓取的岗位数量（调试用）")
    parser.add_argument("--delay", type=float, default=2.5, help="列表页加载间隔（秒）")
    parser.add_argument("--detail-delay", type=float, default=1.0, help="详情页请求间隔（秒）")
    parser.add_argument("--no-headless", action="store_true", help="禁用 headless（调试用）")
    parser.add_argument("--dry-run", action="store_true", help="仅抓取数据，不写入 Supabase")
    parser.add_argument("--enable-translation", action="store_true", help="启用中文翻译")
    parser.add_argument("--output", type=Path, help="输出 JSON 文件路径")
    parser.add_argument("--log-file", type=Path, help="日志文件路径")
    parser.add_argument("--supabase-url", type=str, help="Supabase URL（可覆盖环境变量）")
    parser.add_argument("--supabase-key", type=str, help="Supabase Key（可覆盖环境变量）")
    parser.add_argument("--supabase-table", type=str, default=DEFAULT_SUPABASE_TABLE, help="Supabase 表名")
    parser.add_argument("--supabase-batch-size", type=int, default=50, help="Supabase upsert 批量大小")
    parser.add_argument("--http-timeout", type=int, default=30, help="HTTP 请求超时时间")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    syncer = AcademicTransferPhDSync(
        max_pages=args.max_pages,
        max_jobs=args.max_jobs,
        delay=args.delay,
        detail_delay=args.detail_delay,
        headless=not args.no_headless,
        dry_run=args.dry_run,
        enable_translation=args.enable_translation,
        output_path=args.output,
        log_file=args.log_file,
        supabase_url=args.supabase_url,
        supabase_key=args.supabase_key,
        supabase_table=args.supabase_table,
        supabase_batch_size=args.supabase_batch_size,
        http_timeout=args.http_timeout,
    )
    syncer.run()


if __name__ == "__main__":
    main()

