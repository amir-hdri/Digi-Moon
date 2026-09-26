"""
Professional Web Scraper, API Sniffer & Data Extractor v2.0

Capabilities:
  - Playwright headless automation with stealth patches
  - Network XHR/Fetch interception → discover pure JSON endpoints
  - Dynamic SPA rendering (React, Vue, Next.js, Angular, Svelte)
  - Infinite scroll & lazy-load content handling
  - Proxy routing (Iranian SOCKS5/HTTP proxy for geo-restricted sites)
  - Full-page screenshots for visual UI review
  - Design system token extraction via in-page JS evaluation
  - Clean structured output: JSON, Markdown, screenshots

Requirements:
  pip install playwright playwright-stealth jdatetime
  playwright install chromium

Usage:
  # Basic scrape
  python scrape_and_sniff.py https://example.com

  # With Iranian proxy (when VPN is active)
  SCRAPER_PROXY="socks5://127.0.0.1:10808" python scrape_and_sniff.py https://target.ir

  # With full design system extraction
  python scrape_and_sniff.py https://example.com --extract-design-system

  # Headed mode for debugging
  python scrape_and_sniff.py https://example.com --headed
"""

import asyncio
import json
import os
import re
import sys
import argparse
from datetime import datetime
from pathlib import Path
from typing import Optional, Dict, Any, List

from playwright.async_api import async_playwright, Response, Page, BrowserContext


# ─── Persian / RTL Data Normalization ─────────────────────────────────

PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹"
ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩"


def normalize_persian_digits(text: str) -> str:
    """Convert Persian/Arabic numeral characters to ASCII digits."""
    for i in range(10):
        text = text.replace(PERSIAN_DIGITS[i], str(i))
        text = text.replace(ARABIC_DIGITS[i], str(i))
    return text


def parse_price_toman(raw: str) -> int:
    """Parse a Persian currency string (Toman/Rial) to integer."""
    cleaned = normalize_persian_digits(raw)
    cleaned = re.sub(r"[^\d]", "", cleaned)
    return int(cleaned) if cleaned else 0


def normalize_jalali_date(year: int, month: int, day: int) -> str:
    """Convert Solar Hijri (Jalali) date to ISO-8601 Gregorian string."""
    try:
        import jdatetime
        jd = jdatetime.date(year, month, day)
        gd = jd.togregorian()
        return gd.isoformat()
    except ImportError:
        return f"jalali:{year}-{month:02d}-{day:02d}"


# ─── Core Scraper ─────────────────────────────────────────────────────

class WebScraper:
    """Professional async web scraper with API interception and design system extraction."""

    def __init__(
        self,
        output_dir: str = "./scraped_data",
        proxy_server: Optional[str] = None,
        headless: bool = True,
        stealth: bool = True,
        block_resources: bool = False,
    ):
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)
        self.proxy_server = proxy_server
        self.headless = headless
        self.stealth = stealth
        self.block_resources = block_resources
        self.captured_apis: List[Dict[str, Any]] = []

    async def _setup_browser(self, playwright) -> tuple:
        """Launch browser with stealth and proxy configuration."""
        launch_kwargs: Dict[str, Any] = {
            "headless": self.headless,
            "args": [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-blink-features=AutomationControlled",
                "--disable-infobars",
            ],
        }

        if self.proxy_server:
            launch_kwargs["proxy"] = {"server": self.proxy_server}

        browser = await playwright.chromium.launch(**launch_kwargs)

        context = await browser.new_context(
            user_agent=(
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/130.0.0.0 Safari/537.36"
            ),
            viewport={"width": 1440, "height": 900},
            locale="fa-IR",
            timezone_id="Asia/Tehran",
        )

        # Apply stealth patches
        if self.stealth:
            try:
                from playwright_stealth import Stealth
                stealth_obj = Stealth()
                await stealth_obj.apply_stealth_async(context)
            except ImportError:
                # Fallback: manual stealth injection
                await context.add_init_script("""
                    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
                    Object.defineProperty(navigator, 'languages', { get: () => ['fa-IR', 'fa', 'en-US', 'en'] });
                    Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
                """)

        return browser, context

    async def _intercept_responses(self, response: Response) -> None:
        """Capture JSON API responses from Fetch/XHR requests."""
        try:
            content_type = response.headers.get("content-type", "")
            resource_type = response.request.resource_type

            if "application/json" in content_type and resource_type in ("fetch", "xhr"):
                data = await response.json()

                entry = {
                    "url": response.url,
                    "method": response.request.method,
                    "status": response.status,
                    "content_type": content_type,
                    "request_headers": dict(response.request.headers),
                    "response_headers": dict(response.headers),
                }

                # Store payload sample without bloating memory
                if isinstance(data, dict):
                    entry["payload_keys"] = list(data.keys())
                    entry["payload_sample"] = {
                        k: (str(v)[:100] if not isinstance(v, (list, dict)) else f"[{type(v).__name__}]")
                        for k, v in list(data.items())[:10]
                    }
                elif isinstance(data, list):
                    entry["payload_length"] = len(data)
                    entry["payload_sample"] = data[0] if data else None
                else:
                    entry["payload_sample"] = str(data)[:200]

                self.captured_apis.append(entry)
        except Exception:
            pass

    async def _block_unnecessary_resources(self, page: Page) -> None:
        """Block images, fonts, media, and tracking scripts to speed up scraping."""
        blocked_types = {"image", "media", "font", "stylesheet"}
        blocked_domains = [
            "google-analytics.com", "googletagmanager.com",
            "facebook.net", "doubleclick.net", "hotjar.com",
        ]

        async def handle_route(route):
            if route.request.resource_type in blocked_types:
                await route.abort()
            elif any(d in route.request.url for d in blocked_domains):
                await route.abort()
            else:
                await route.continue_()

        await page.route("**/*", handle_route)

    async def scrape(
        self,
        url: str,
        wait_selector: Optional[str] = None,
        wait_time_sec: float = 3.0,
        scroll_to_bottom: bool = True,
        extract_design_system: bool = False,
    ) -> Dict[str, Any]:
        """
        Execute a full scrape of the target URL.

        Returns a dict with keys: meta, apis, design_system (optional), files.
        """
        self.captured_apis = []
        result: Dict[str, Any] = {"url": url, "timestamp": datetime.now().isoformat()}

        async with async_playwright() as p:
            browser, context = await self._setup_browser(p)
            page = await context.new_page()

            # Set up API interception
            page.on("response", self._intercept_responses)

            # Optionally block unnecessary resources
            if self.block_resources:
                await self._block_unnecessary_resources(page)

            print(f"[*] Navigating to: {url}")
            try:
                await page.goto(url, wait_until="networkidle", timeout=60_000)
            except Exception as e:
                print(f"[!] Navigation timeout/error (continuing): {e}")
                # Still try to work with what loaded
                pass

            # Wait for specific content if requested
            if wait_selector:
                try:
                    await page.wait_for_selector(wait_selector, timeout=10_000)
                    print(f"[+] Selector '{wait_selector}' found")
                except Exception:
                    print(f"[!] Selector '{wait_selector}' not found within timeout")

            # Auto-scroll to trigger lazy loading
            if scroll_to_bottom:
                print("[*] Scrolling to load dynamic content...")
                prev_height = 0
                for i in range(15):  # Max 15 scroll attempts
                    curr_height = await page.evaluate("document.body.scrollHeight")
                    if curr_height == prev_height:
                        break
                    await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
                    await asyncio.sleep(0.5)
                    prev_height = curr_height
                # Scroll back to top for screenshot
                await page.evaluate("window.scrollTo(0, 0)")

            await asyncio.sleep(wait_time_sec)

            # ── Capture page metadata ────────────────────────────────
            title = await page.title()
            result["meta"] = {
                "title": title,
                "url": page.url,
            }
            print(f"[+] Page title: {title}")

            # ── Full-page screenshot ─────────────────────────────────
            screenshot_path = self.output_dir / "screenshot.png"
            await page.screenshot(path=str(screenshot_path), full_page=True)
            result.setdefault("files", {})["screenshot"] = str(screenshot_path)
            print(f"[+] Screenshot saved: {screenshot_path}")

            # ── Viewport screenshot ──────────────────────────────────
            viewport_path = self.output_dir / "viewport.png"
            await page.screenshot(path=str(viewport_path), full_page=False)
            result["files"]["viewport"] = str(viewport_path)

            # ── Design System Extraction ─────────────────────────────
            if extract_design_system:
                print("[*] Extracting design system tokens...")
                script_path = Path(__file__).parent / "extract_design_system.js"
                if script_path.exists():
                    script_content = script_path.read_text(encoding="utf-8")
                    try:
                        tokens = await page.evaluate(script_content)
                        tokens_path = self.output_dir / "design_tokens.json"
                        with open(tokens_path, "w", encoding="utf-8") as f:
                            json.dump(tokens, f, ensure_ascii=False, indent=2)
                        result["design_system"] = tokens
                        result["files"]["design_tokens"] = str(tokens_path)
                        print(f"[+] Design tokens extracted: {tokens_path}")
                    except Exception as e:
                        print(f"[!] Design system extraction failed: {e}")
                else:
                    print(f"[!] Script not found: {script_path}")

                # Component extraction
                comp_script_path = Path(__file__).parent / "extract_components.js"
                if comp_script_path.exists():
                    comp_script = comp_script_path.read_text(encoding="utf-8")
                    try:
                        components = await page.evaluate(comp_script)
                        comp_path = self.output_dir / "components.json"
                        with open(comp_path, "w", encoding="utf-8") as f:
                            json.dump(components, f, ensure_ascii=False, indent=2)
                        result["components"] = components
                        result["files"]["components"] = str(comp_path)
                        print(f"[+] Components extracted: {comp_path}")
                    except Exception as e:
                        print(f"[!] Component extraction failed: {e}")

            # ── Save intercepted APIs ────────────────────────────────
            api_path = self.output_dir / "intercepted_apis.json"
            with open(api_path, "w", encoding="utf-8") as f:
                json.dump(self.captured_apis, f, ensure_ascii=False, indent=2)
            result["apis"] = {
                "count": len(self.captured_apis),
                "endpoints": [a["url"] for a in self.captured_apis],
            }
            result["files"]["apis"] = str(api_path)
            print(f"[+] Intercepted {len(self.captured_apis)} JSON API endpoints → {api_path}")

            # ── Extract page content as markdown ─────────────────────
            text_content = await page.evaluate("""
                () => {
                    const main = document.querySelector('main, article, [role="main"]') || document.body;
                    return main.innerText.substring(0, 10000);
                }
            """)
            content_path = self.output_dir / "content.txt"
            with open(content_path, "w", encoding="utf-8") as f:
                f.write(text_content)
            result["files"]["content"] = str(content_path)

            await browser.close()

        # ── Summary report ───────────────────────────────────────────
        report_path = self.output_dir / "report.json"
        with open(report_path, "w", encoding="utf-8") as f:
            # Don't dump full design_system/components into report to keep it small
            report = {k: v for k, v in result.items() if k not in ("design_system", "components")}
            json.dump(report, f, ensure_ascii=False, indent=2)
        print(f"\n[✓] Scraping complete. Report: {report_path}")
        print(f"    Output directory: {self.output_dir}")

        return result


# ─── CLI Entry Point ──────────────────────────────────────────────────

def parse_args():
    parser = argparse.ArgumentParser(
        description="Professional Web Scraper & API Sniffer",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python scrape_and_sniff.py https://example.com
  python scrape_and_sniff.py https://target.ir --proxy socks5://127.0.0.1:10808
  python scrape_and_sniff.py https://example.com --extract-design-system --headed
  python scrape_and_sniff.py https://example.com --wait-for ".main-content" --no-scroll
        """
    )
    parser.add_argument("url", help="Target URL to scrape")
    parser.add_argument("-o", "--output", default="./scraped_data", help="Output directory (default: ./scraped_data)")
    parser.add_argument("--proxy", default=None, help="Proxy server URL (e.g., socks5://127.0.0.1:10808)")
    parser.add_argument("--headed", action="store_true", help="Run browser in headed (visible) mode")
    parser.add_argument("--no-stealth", action="store_true", help="Disable stealth patches")
    parser.add_argument("--block-resources", action="store_true", help="Block images/fonts/tracking for speed")
    parser.add_argument("--extract-design-system", action="store_true", help="Extract UI/UX design tokens and components")
    parser.add_argument("--wait-for", default=None, help="CSS selector to wait for after navigation")
    parser.add_argument("--wait-time", type=float, default=3.0, help="Extra wait time in seconds (default: 3.0)")
    parser.add_argument("--no-scroll", action="store_true", help="Disable auto-scrolling")
    return parser.parse_args()


async def main():
    args = parse_args()

    proxy = args.proxy or os.environ.get("SCRAPER_PROXY")

    scraper = WebScraper(
        output_dir=args.output,
        proxy_server=proxy,
        headless=not args.headed,
        stealth=not args.no_stealth,
        block_resources=args.block_resources,
    )

    result = await scraper.scrape(
        url=args.url,
        wait_selector=args.wait_for,
        wait_time_sec=args.wait_time,
        scroll_to_bottom=not args.no_scroll,
        extract_design_system=args.extract_design_system,
    )

    return result


if __name__ == "__main__":
    asyncio.run(main())
