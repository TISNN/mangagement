#!/usr/bin/env python3
"""
Add Chinese summaries to existing AcademicTransfer scrape results.

Usage example:
    python3 scripts/add_chinese_summaries.py \
        --input tmp/phd_positions_scrape.json \
        --output tmp/phd_positions_scrape_zh.json

The script reads an existing JSON file (same structure as produced by
`academictransfer_phd_sync.py`), translates selected English fields to
Chinese via the public Google Translate endpoint, and writes a new JSON
file with the `*_zh` fields populated.
"""

from __future__ import annotations

import argparse
import json
import logging
import math
import sys
from pathlib import Path
from typing import Dict, Iterable, List, Tuple

import requests

TRANSLATE_ENDPOINT = "https://translate.googleapis.com/translate_a/single"
DEFAULT_FIELDS = [
    ("description_en", "description_zh"),
    ("requirements_en", "requirements_zh"),
    ("application_steps_en", "application_steps_zh"),
]


def chunk_text(text: str, max_chars: int) -> Iterable[str]:
    """Split long text into manageable chunks without breaking sentences."""
    if len(text) <= max_chars:
        yield text
        return

    sentences = text.split("\n")
    current = []
    current_len = 0

    for sentence in sentences:
        segment = sentence.strip()
        if not segment:
            continue
        segment_len = len(segment)
        if current and current_len + segment_len + 1 > max_chars:
            yield "\n".join(current)
            current = [segment]
            current_len = segment_len
        else:
            current.append(segment)
            current_len += segment_len + (1 if current_len else 0)

    if current:
        yield "\n".join(current)


def translate_text(text: str, target_lang: str = "zh-CN", max_chars: int = 4000) -> str:
    """Translate a possibly long text using Google Translate HTTP endpoint."""
    if not text:
        return ""

    translated_chunks: List[str] = []
    session = requests.Session()

    for chunk in chunk_text(text, max_chars):
        payload = {
            "client": "gtx",
            "sl": "auto",
            "tl": target_lang,
            "dt": "t",
            "q": chunk,
        }
        try:
            resp = session.get(TRANSLATE_ENDPOINT, params=payload, timeout=30)
            resp.raise_for_status()
            data = resp.json()
            translated = "".join(segment[0] for segment in data[0])
            translated_chunks.append(translated.strip())
        except Exception as exc:
            logging.warning("Translation failed (chunk starts with %r): %s", chunk[:40], exc)
            translated_chunks.append("")

    return "\n".join(filter(None, translated_chunks)).strip()


def process_file(
    input_path: Path,
    output_path: Path,
    fields: List[Tuple[str, str]],
    force: bool,
    max_chars: int,
) -> None:
    logging.info("Loading JSON: %s", input_path)
    data = json.loads(input_path.read_text(encoding="utf-8"))
    items = data.get("items", [])
    total = len(items)
    logging.info("Found %s items", total)

    for idx, item in enumerate(items, start=1):
        for src_field, dst_field in fields:
            src_value = item.get(src_field, "")
            dst_value = item.get(dst_field)
            if not src_value:
                continue
            if dst_value and not force:
                continue
            translated = translate_text(src_value, target_lang="zh-CN", max_chars=max_chars)
            if translated:
                item[dst_field] = translated
        if idx % 20 == 0 or idx == total:
            logging.info("Processed %s/%s items", idx, total)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    logging.info("Written output: %s", output_path)


def parse_fields(field_args: List[str]) -> List[Tuple[str, str]]:
    if not field_args:
        return DEFAULT_FIELDS
    mapping: List[Tuple[str, str]] = []
    for entry in field_args:
        if ":" not in entry:
            raise ValueError(f"--field expects src:dst, got {entry}")
        src, dst = entry.split(":", 1)
        mapping.append((src.strip(), dst.strip()))
    return mapping


def main() -> int:
    parser = argparse.ArgumentParser(description="Add Chinese summaries to scraped data")
    parser.add_argument("--input", required=True, type=Path, help="Input JSON file path")
    parser.add_argument("--output", required=True, type=Path, help="Output JSON file path")
    parser.add_argument(
        "--field",
        action="append",
        default=[],
        help="Field mapping in src_field:dst_field format (repeatable)",
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Re-translate even if destination field already has content",
    )
    parser.add_argument(
        "--max-chars",
        type=int,
        default=4000,
        help="Maximum characters per translation chunk (default: 4000)",
    )
    parser.add_argument("--log-level", default="INFO", help="Logging level (default: INFO)")

    args = parser.parse_args()
    logging.basicConfig(level=getattr(logging, args.log_level.upper(), logging.INFO))

    try:
        fields = parse_fields(args.field)
        process_file(args.input, args.output, fields, args.force, args.max_chars)
    except Exception as exc:
        logging.error("Failed to add Chinese summaries: %s", exc)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())

