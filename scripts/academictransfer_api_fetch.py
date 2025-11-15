#!/usr/bin/env python3
"""
Fetch AcademicTransfer PhD vacancies via the public data API.

This helper avoids brittle Selenium scraping by:
1. Loading the AcademicTransfer PhD listing page to extract the public API token.
2. Calling the `https://api.academictransfer.com/vacancies/` endpoint with the token.
3. Persisting a structured JSON payload (list + per vacancy detail) to disk.

The output focuses on the fields our product needs right now. Raw API responses
are included for traceability/debugging.
"""

from __future__ import annotations

import argparse
import json
import sys
import time
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional, Tuple

import requests

BASE_DATA_URL = "https://api.academictransfer.com"
LISTING_PAGE_TEMPLATE = (
    "https://www.academictransfer.com/{locale}/jobs?function_types=1"
)

HEADERS = {
    "User-Agent": "Mozilla/5.0",
}


class TokenExtractionError(RuntimeError):
    """Raised when we cannot locate the public API token."""


def parse_nuxt_payload(html: str) -> List[Any]:
    """Extract the serialized __NUXT_DATA__ array from the listing HTML."""
    marker = 'id="__NUXT_DATA__"'
    start_idx = html.find(marker)
    if start_idx == -1:
        raise TokenExtractionError("Unable to locate __NUXT_DATA__ script element")
    start_idx = html.find(">", start_idx)
    if start_idx == -1:
        raise TokenExtractionError("Malformed __NUXT_DATA__ script element")
    start_idx += 1
    end_idx = html.find("</script>", start_idx)
    if end_idx == -1:
        raise TokenExtractionError("Incomplete __NUXT_DATA__ script element")
    payload = html[start_idx:end_idx].strip()
    try:
        data = json.loads(payload)
    except json.JSONDecodeError as exc:
        raise TokenExtractionError("Failed to decode __NUXT_DATA__ JSON") from exc
    if not isinstance(data, list):
        raise TokenExtractionError("Unexpected __NUXT_DATA__ payload shape")
    return data


def extract_public_token(nuxt_data: List[Any]) -> str:
    """
    Nuxt stores state in a pointer array. For the listing page we observed:
      index 10 -> ['Reactive', state_index]
      state dict -> {'$satDataApiPublicAccessToken': token_index}
      nuxt_data[token_index] -> token string
    """
    if len(nuxt_data) <= 10:
        raise TokenExtractionError("Nuxt payload too short for state pointer lookup")
    state_ptr_entry = nuxt_data[10]
    if not isinstance(state_ptr_entry, list) or len(state_ptr_entry) < 2:
        raise TokenExtractionError("Unexpected state pointer entry structure")
    state_index = state_ptr_entry[1]
    if not isinstance(state_index, int) or state_index >= len(nuxt_data):
        raise TokenExtractionError("Invalid state index while resolving token pointer")
    state_block = nuxt_data[state_index]
    if not isinstance(state_block, dict):
        raise TokenExtractionError("State block is not a dictionary")
    token_index = state_block.get("$satDataApiPublicAccessToken")
    if not isinstance(token_index, int) or token_index >= len(nuxt_data):
        raise TokenExtractionError("Token index not found in state block")
    token = nuxt_data[token_index]
    if not isinstance(token, str) or len(token) < 10:
        raise TokenExtractionError("Resolved token is not a valid string")
    return token


def resolve_public_token(locale: str, session: Optional[requests.Session] = None) -> str:
    sess = session or requests.Session()
    listing_url = LISTING_PAGE_TEMPLATE.format(locale=locale)
    response = sess.get(listing_url, headers=HEADERS, timeout=30)
    response.raise_for_status()
    nuxt_data = parse_nuxt_payload(response.text)
    return extract_public_token(nuxt_data)


def build_api_headers(token: str) -> Dict[str, str]:
    headers = dict(HEADERS)
    headers["Authorization"] = f"Bearer {token}"
    headers["Accept"] = "application/json; version=2"
    return headers


def fetch_paginated_results(
    headers: Dict[str, str],
    params: Dict[str, Any],
    session: Optional[requests.Session] = None,
) -> Tuple[List[Dict[str, Any]], Dict[str, Any]]:
    sess = session or requests.Session()
    url = f"{BASE_DATA_URL}/vacancies/"
    all_items: List[Dict[str, Any]] = []
    first_payload: Optional[Dict[str, Any]] = None

    while url:
        response = sess.get(url, headers=headers, params=params, timeout=30)
        # Only include params on first request; `next` already contains query string.
        params = {}
        response.raise_for_status()
        payload = response.json()
        if first_payload is None:
            first_payload = payload
        all_items.extend(payload.get("results", []))
        url = payload.get("next")

    return all_items, first_payload or {}


def infer_supports_international(text_blocks: Iterable[str]) -> bool:
    haystack = " ".join(block or "" for block in text_blocks).lower()
    keywords = ["international", "global", "non-eu", "visa", "relocation"]
    return any(keyword in haystack for keyword in keywords)


def normalise_tags(detail: Dict[str, Any]) -> List[str]:
    tags: List[str] = []
    for key in ("function_types", "scientific_fields", "research_fields", "keywords"):
        values = detail.get(key) or []
        if isinstance(values, list):
            tags.extend(str(item) for item in values if item)
    return sorted(set(tags))


def transform_detail(detail: Dict[str, Any]) -> Dict[str, Any]:
    description = detail.get("description") or ""
    requirements = detail.get("requirements") or ""
    application = (
        detail.get("contract_terms")
        or detail.get("additional_info")
        or detail.get("extra_info")
        or ""
    )

    supports_international = infer_supports_international(
        [description, requirements, application]
    )

    return {
        "source": "academictransfer",
        "source_id": detail.get("external_id") or detail.get("id"),
        "official_link": detail.get("absolute_url"),
        "apply_link": detail.get("application_url") or detail.get("apply_url"),
        "title_en": detail.get("title"),
        "country": detail.get("country_code"),
        "city": detail.get("city"),
        "organisation": detail.get("organisation_name"),
        "department": detail.get("department_name"),
        "deadline": detail.get("end_date"),
        "full_time_salary_min": detail.get("min_salary"),
        "full_time_salary_max": detail.get("max_salary"),
        "weekly_hours_min": detail.get("min_weekly_hours"),
        "weekly_hours_max": detail.get("max_weekly_hours"),
        "employment_type": detail.get("contract_type"),
        "description_html": description,
        "requirements_html": requirements,
        "application_html": application,
        "supports_international": supports_international,
        "tags": normalise_tags(detail),
        "raw": detail,
    }


def fetch_details(
    ids: Iterable[int],
    headers: Dict[str, str],
    delay: float = 0.4,
    session: Optional[requests.Session] = None,
) -> List[Dict[str, Any]]:
    sess = session or requests.Session()
    records: List[Dict[str, Any]] = []
    for vacancy_id in ids:
        response = sess.get(
            f"{BASE_DATA_URL}/vacancies/{vacancy_id}/",
            headers=headers,
            timeout=30,
        )
        response.raise_for_status()
        detail = response.json()
        records.append(transform_detail(detail))
        if delay:
            time.sleep(delay)
    return records


def main(argv: Optional[List[str]] = None) -> int:
    parser = argparse.ArgumentParser(
        description="Fetch AcademicTransfer PhD vacancies via public API"
    )
    parser.add_argument(
        "--locale",
        default="en",
        help="Locale to use when extracting the public token (default: en)",
    )
    parser.add_argument(
        "--page-size",
        type=int,
        default=100,
        help="Number of vacancies per API page (default: 100)",
    )
    parser.add_argument(
        "--education-level",
        type=int,
        default=3,
        help="Filter by education_level (default: 3 i.e. PhD). Use 0 to disable.",
    )
    parser.add_argument(
        "--function-type",
        action="append",
        type=int,
        help="Repeatable. Filter by function_types value(s).",
    )
    parser.add_argument(
        "--include-inactive",
        action="store_true",
        help="Include inactive/expired jobs (default: only active).",
    )
    parser.add_argument(
        "--param",
        action="append",
        default=[],
        help="Extra query param in key=value form (repeatable).",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=Path("tmp/phd_positions_api.json"),
        help="Output JSON file path",
    )
    parser.add_argument(
        "--delay",
        type=float,
        default=0.4,
        help="Delay (seconds) between detail requests to stay polite",
    )
    parser.add_argument(
        "--no-delay",
        action="store_true",
        help="Disable delay between detail requests",
    )

    args = parser.parse_args(argv)
    session = requests.Session()

    token = resolve_public_token(args.locale, session=session)
    headers = build_api_headers(token)

    params: Dict[str, Any] = {"page_size": args.page_size}
    if args.education_level and args.education_level > 0:
        params["education_level"] = args.education_level
    if args.function_type:
        params["function_types"] = args.function_type
    if not args.include_inactive:
        params["is_active"] = "true"

    for entry in args.param:
        if "=" not in entry:
            raise ValueError(f"--param expects key=value, got: {entry}")
        key, value = entry.split("=", 1)
        key = key.strip()
        if not key:
            raise ValueError("Param key cannot be empty")
        value = value.strip()
        existing = params.get(key)
        if existing is None:
            params[key] = value
        elif isinstance(existing, list):
            existing.append(value)
        else:
            params[key] = [existing, value]

    listing, meta = fetch_paginated_results(headers, params, session=session)
    listing_meta = {
        "count": meta.get("count"),
        "next": meta.get("next"),
        "previous": meta.get("previous"),
    }
    vacancy_ids = [item["id"] for item in listing]

    detail_delay = 0.0 if args.no_delay else max(args.delay, 0.0)
    details = fetch_details(vacancy_ids, headers, delay=detail_delay, session=session)

    payload = {
        "generated_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "total": len(details),
        "listing_meta": listing_meta,
        "items": details,
    }

    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(payload, ensure_ascii=False, indent=2), "utf-8")

    print(
        f"Fetched {len(details)} vacancies. Output written to {args.output}",
        file=sys.stderr,
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

