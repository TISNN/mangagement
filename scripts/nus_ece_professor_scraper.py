#!/usr/bin/env python3
"""
Scraper for NUS College of Design and Engineering (Electrical and Computer Engineering) academic staff.

This script crawls the academic staff listing page and visits each professor's detail page to extract:
  - avatar_url
  - name
  - titles (primary title + additional designations)
  - biography / personal introduction
  - contact information (phone, email, location)
  - website URL
  - Google Scholar URL

Usage:
  python nus_ece_professor_scraper.py --output-json nus_ece_professors.json --output-csv nus_ece_professors.csv

By default the script uses three threads to parallelise detail page downloads.
"""

from __future__ import annotations

import argparse
import csv
import json
import logging
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Iterable, List, Optional, Set
from urllib.parse import urljoin, urlparse

from bs4 import BeautifulSoup, Tag
from selenium import webdriver
from selenium.common.exceptions import TimeoutException, WebDriverException
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

BASE_URL = "https://cde.nus.edu.sg"
LISTING_URL = "https://cde.nus.edu.sg/ece/about-us/people/academic-staff/"
REQUEST_DELAY = 1.0  # seconds, be polite to the server


@dataclass
class ProfessorRecord:
    url: str
    name: str
    titles: List[str]
    avatar_url: Optional[str]
    biography: Optional[str]
    contact_number: Optional[str]
    email: Optional[str]
    location: Optional[str]
    website_url: Optional[str]
    google_scholar_url: Optional[str]


class ProfessorScraper:
    def __init__(self, max_workers: int = 3, headless: bool = False) -> None:
        self.max_workers = max_workers
        self.headless = headless
        self.driver = self._create_driver()
        self.wait = WebDriverWait(self.driver, 25)

    def _create_driver(self) -> webdriver.Chrome:
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
        except WebDriverException as exc:  # noqa: N818
            logging.error("无法初始化 Chrome WebDriver，请确认已安装驱动: %s", exc)
            raise

    def _create_worker_driver(self) -> webdriver.Chrome:
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

    def extract_staff_links(self, html: str) -> List[str]:
        soup = BeautifulSoup(html, "html.parser")
        links: Set[str] = set()

        for anchor in soup.find_all("a", href=True):
            href = anchor["href"]
            if "/ece/staff/" not in href:
                continue
            full_url = urljoin(BASE_URL, href.split("#")[0])
            if full_url.startswith(LISTING_URL.rstrip("/")):
                continue
            links.add(full_url.rstrip("/"))

        logging.info("Discovered %d staff links", len(links))
        return sorted(links)

    @staticmethod
    def _clean_text(text: Optional[str]) -> Optional[str]:
        if text is None:
            return None
        stripped = " ".join(text.split())
        return stripped or None

    @staticmethod
    def _join_text(nodes: Iterable[Tag]) -> Optional[str]:
        parts: List[str] = []
        for node in nodes:
            text = node.get_text(separator=" ", strip=True)
            if text:
                parts.append(text)
        joined = " ".join(parts).strip()
        return joined or None

    def _parse_detail_html(self, url: str, html: str) -> Optional[ProfessorRecord]:
        soup = BeautifulSoup(html, "html.parser")

        # Avatar
        avatar_url: Optional[str] = None
        avatar_node = soup.select_one(".post-thumb img, .entry-header img")
        if isinstance(avatar_node, Tag) and avatar_node.has_attr("src"):
            avatar_url = urljoin(url, avatar_node["src"])

        # Name
        name_node = soup.select_one("h1.entry-title")
        name = (name_node.get_text(strip=True) if isinstance(name_node, Tag) else None) or ""

        # Titles (primary + designations)
        titles: List[str] = []
        for selector in (".people-meta h4", ".staff-title h4", ".staff-designation h4"):
            for node in soup.select(selector):
                text = self._clean_text(node.get_text())
                if text and text not in titles:
                    titles.append(text)

        # Biography
        content_wrapper = soup.select_one("#websparks-people-content-wrapper")
        if isinstance(content_wrapper, Tag):
            biography = self._join_text(content_wrapper.find_all(["p", "li"])) or None
        else:
            entry_content = soup.select_one(".entry-content")
            biography = (
                self._join_text(entry_content.find_all(["p", "li"]))
                if isinstance(entry_content, Tag)
                else None
            )

        # Sidebar contact info
        def extract_sidebar_value(wrapper_class: str) -> Optional[str]:
            wrapper = soup.select_one(f".{wrapper_class}")
            if isinstance(wrapper, Tag):
                value_node = wrapper.find(class_=lambda x: x and x.startswith("sidebar-"))
                if isinstance(value_node, Tag):
                    text = value_node.get_text(strip=True)
                    return text or None
            return None

        contact_number = extract_sidebar_value("sidebar-contact-number-wrapper")
        email = extract_sidebar_value("sidebar-email-address-wrapper")
        location = extract_sidebar_value("sidebar-location-wrapper")

        def extract_sidebar_link(wrapper_class: str) -> Optional[str]:
            wrapper = soup.select_one(f".{wrapper_class}")
            if isinstance(wrapper, Tag):
                link = wrapper.find("a", href=True)
                if isinstance(link, Tag):
                    href = link["href"].strip()
                    if href:
                        return href
            return None

        website_url = extract_sidebar_link("sidebar-website-wrapper")
        google_scholar_url = extract_sidebar_link("sidebar-google-scholar-wrapper")

        record = ProfessorRecord(
            url=url,
            name=name,
            titles=titles,
            avatar_url=avatar_url,
            biography=biography,
            contact_number=contact_number,
            email=email,
            location=location,
            website_url=website_url,
            google_scholar_url=google_scholar_url,
        )
        logging.info("Parsed %s", name or url)
        return record

    def parse_detail_page(self, url: str) -> Optional[ProfessorRecord]:
        driver = self._create_worker_driver()
        try:
            logging.debug("Loading detail page: %s", url)
            driver.get(url)
            WebDriverWait(driver, 25).until(EC.presence_of_element_located((By.TAG_NAME, "body")))
            time.sleep(1.5)
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

    def scrape(self) -> List[ProfessorRecord]:
        try:
            logging.info("加载教授列表页：%s", LISTING_URL)
            self.driver.get(LISTING_URL)
            self.wait.until(EC.presence_of_element_located((By.TAG_NAME, "body")))
            time.sleep(3)
            listing_html = self.driver.page_source

            if "h-captcha" in listing_html or "Additional security check" in listing_html:
                logging.warning("检测到 hCaptcha 安全校验，请在浏览器中完成验证后按 Enter 继续。")
                try:
                    input("完成验证码后按 Enter 继续...")
                except EOFError:
                    logging.error("无法等待用户输入，建议在本地非 headless 模式运行并手动完成验证码。")
                    return []
                time.sleep(2)
                listing_html = self.driver.page_source
                if "h-captcha" in listing_html or "Additional security check" in listing_html:
                    logging.error("仍检测到安全校验，无法继续抓取。")
                    return []

            detail_urls = self.extract_staff_links(listing_html)
            if not detail_urls:
                logging.warning("No staff detail URLs discovered.")
                return []

            results: List[ProfessorRecord] = []
            with ThreadPoolExecutor(max_workers=self.max_workers) as executor:
                future_map = {executor.submit(self.parse_detail_page, url): url for url in detail_urls}
                for future in as_completed(future_map):
                    url = future_map[future]
                    try:
                        record = future.result()
                        if record:
                            results.append(record)
                    except Exception as exc:  # noqa: BLE001
                        logging.exception("Unhandled error parsing %s: %s", url, exc)
                    finally:
                        time.sleep(REQUEST_DELAY)

            logging.info("Successfully scraped %d professor profiles.", len(results))
            return results
        except TimeoutException:
            logging.error("教授列表页加载超时，终止任务。")
            return []
        except WebDriverException as exc:
            logging.error("教授列表页加载失败：%s", exc)
            return []
        finally:
            try:
                self.driver.quit()
            except Exception:
                pass


def write_json(records: Iterable[ProfessorRecord], output_path: Path) -> None:
    payload = [asdict(record) for record in records]
    with output_path.open("w", encoding="utf-8") as fp:
        json.dump(payload, fp, ensure_ascii=False, indent=2)
    logging.info("Saved JSON -> %s", output_path)


def write_csv(records: Iterable[ProfessorRecord], output_path: Path) -> None:
    fieldnames = [
        "url",
        "name",
        "titles",
        "avatar_url",
        "biography",
        "contact_number",
        "email",
        "location",
        "website_url",
        "google_scholar_url",
    ]
    with output_path.open("w", encoding="utf-8", newline="") as fp:
        writer = csv.DictWriter(fp, fieldnames=fieldnames)
        writer.writeheader()
        for record in records:
            row = asdict(record)
            row["titles"] = "; ".join(record.titles)
            writer.writerow(row)
    logging.info("Saved CSV -> %s", output_path)


def parse_args(argv: Optional[List[str]] = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Scrape NUS ECE academic staff profiles.")
    parser.add_argument("--output-json", type=Path, help="Path to write JSON output.")
    parser.add_argument("--output-csv", type=Path, help="Path to write CSV output.")
    parser.add_argument("--max-workers", type=int, default=3, help="Number of parallel threads (default: 3).")
    parser.add_argument("--headless", action="store_true", help="Run Chrome in headless mode (captcha may block).")
    parser.add_argument(
        "--list-url",
        type=str,
        default=LISTING_URL,
        help="Override the staff listing URL (for debugging).",
    )
    return parser.parse_args(argv)


def validate_url(url: Optional[str]) -> Optional[str]:
    if not url:
        return None
    parsed = urlparse(url)
    if not parsed.scheme:
        return urljoin(BASE_URL, url)
    return url


def main(argv: Optional[List[str]] = None) -> int:
    args = parse_args(argv)
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s | %(levelname)s | %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )

    scraper = ProfessorScraper(max_workers=args.max_workers, headless=args.headless)
    global LISTING_URL  # allow runtime override for debugging
    LISTING_URL = args.list_url

    records = scraper.scrape()
    if not records:
        logging.warning("No records scraped; exiting with non-zero status.")
        return 1

    # Normalise URLs before output
    for record in records:
        record.avatar_url = validate_url(record.avatar_url)
        record.website_url = validate_url(record.website_url)
        record.google_scholar_url = validate_url(record.google_scholar_url)

    if args.output_json:
        write_json(records, args.output_json)
    if args.output_csv:
        write_csv(records, args.output_csv)

    if not args.output_json and not args.output_csv:
        json.dump([asdict(record) for record in records], sys.stdout, ensure_ascii=False, indent=2)
        sys.stdout.write("\n")

    return 0


if __name__ == "__main__":
    sys.exit(main())


