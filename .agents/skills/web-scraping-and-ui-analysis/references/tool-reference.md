# Web Scraping & UI/UX Extraction — Tool Reference

## Quick Tool Selection Matrix

| Need | Tool | Cost | Speed |
|------|------|------|-------|
| Fetch static page content | `read_url_content` (built-in) | Free | <1s |
| Live browser with screenshots | Chrome DevTools MCP | Free | 2-5s |
| Intercept hidden JSON APIs | DevTools `list_network_requests` | Free | 2-5s |
| Full site crawl → markdown | Crawl4AI `AsyncWebCrawler` | Free (self-host) | 1-3s/page |
| Structured CSS extraction | Crawl4AI `JsonCssExtractionStrategy` | Free | Fast |
| Semantic LLM extraction | Crawl4AI `LLMExtractionStrategy` | LLM tokens | Moderate |
| Managed API scraping | Firecrawl `scrape_url` | Credits | 2-5s |
| Fast URL discovery | Firecrawl `map_url` | Credits | <1s |
| Autonomous multi-step browsing | Browser-Use `Agent` | LLM tokens (high) | 15-60s |
| Design system extraction | `evaluate_script` + extraction JS | Free | 1-2s |
| Performance audit | DevTools `lighthouse_audit` | Free | 10-30s |
| Accessibility audit | DevTools `take_snapshot` + Lighthouse | Free | 5-15s |

---

## Chrome DevTools MCP — Tool Quick Reference

### Navigation
| Tool | Purpose | Key Args |
|------|---------|----------|
| `navigate_page` | Load URL or back/forward/reload | `pageId`, `url`, `type` |
| `new_page` | Open new tab | `url`, `background`, `isolatedContext` |
| `wait_for` | Wait for text to appear | `pageId`, `text[]`, `timeout` |
| `list_pages` | List open tabs | *(none)* |
| `select_page` | Switch active tab | `pageId` |
| `close_page` | Close a tab | `pageId` |

### Extraction
| Tool | Purpose | Key Args |
|------|---------|----------|
| `evaluate_script` | Execute JS in-page, return JSON | `pageId`, `function`, `args`, `waitForStableDom` |
| `take_screenshot` | Capture PNG | `pageId`, `fullPage`, `uid`, `filePath` |
| `take_snapshot` | Accessibility tree dump | `pageId`, `verbose`, `filePath` |
| `lighthouse_audit` | A11y, SEO, best practices scores | `pageId`, `mode`, `device`, `outputDirPath` |

### Network
| Tool | Purpose | Key Args |
|------|---------|----------|
| `list_network_requests` | List recent requests | `pageId`, `resourceTypes[]`, `pageSize` |
| `get_network_request` | Full request/response details | `pageId`, `reqid`, `responseFilePath` |

### Performance
| Tool | Purpose | Key Args |
|------|---------|----------|
| `performance_start_trace` | Begin Chrome trace | `pageId`, `reload`, `autoStop` |
| `performance_stop_trace` | End trace | `pageId`, `filePath` |
| `performance_analyze_insight` | Analyze trace insights | `pageId`, `insightSetId`, `insightName` |

### Interaction
| Tool | Purpose | Key Args |
|------|---------|----------|
| `click` | Click element | `pageId`, `uid` |
| `fill` | Fill input/select | `pageId`, `uid`, `value` |
| `fill_form` | Fill multiple fields at once | `pageId`, `elements[{uid, value}]` |
| `type_text` | Type into focused input | `pageId`, `text`, `submitKey` |
| `hover` | Hover element | `pageId`, `uid` |
| `press_key` | Keyboard shortcut | `pageId`, `key` |
| `drag` | Drag and drop | `pageId`, `from_uid`, `to_uid` |
| `upload_file` | Upload file | `pageId`, `uid`, `filePaths[]` |
| `handle_dialog` | Accept/dismiss dialog | `pageId`, `action` |
| `emulate` | Device/network emulation | `pageId`, `viewport`, `networkConditions`, `colorScheme` |
| `resize_page` | Resize viewport | `pageId`, `width`, `height` |

### Diagnostics
| Tool | Purpose | Key Args |
|------|---------|----------|
| `list_console_messages` | Console log/errors | `pageId`, `types[]` |
| `get_console_message` | Specific console entry | `pageId`, `msgid` |
| `take_heapsnapshot` | Memory heap dump | `pageId`, `filePath` |

---

## StitchMCP — Design System Tools

| Tool | Purpose | Key Args |
|------|---------|----------|
| `create_design_system` | Create design system with tokens | `projectId`, `designSystem{displayName, theme{colorMode, customColor, headlineFont, bodyFont, roundness}}` |
| `update_design_system` | Update existing design system | `name`, `projectId`, `designSystem` |
| `upload_design_md` | Upload DESIGN.md file | `projectId`, `designMdBase64` |
| `create_design_system_from_design_md` | Convert uploaded MD to design system | `projectId`, `selectedScreenInstance` |
| `apply_design_system` | Apply design system to screens | `projectId`, `assetId`, `selectedScreenInstances[]` |
| `list_design_systems` | List available design systems | `projectId` (optional) |

### StitchMCP Supported Fonts (subset)
`INTER`, `ROBOTO_FLEX`, `GEIST`, `DM_SANS`, `GOOGLE_SANS`, `PLUS_JAKARTA_SANS`,
`SPACE_GROTESK`, `POPPINS`, `LATO`, `OPEN_SANS`, `MONTSERRAT`, `NUNITO`,
`RALEWAY`, `WORK_SANS`, `SOURCE_SANS_3`, `IBM_PLEX_SANS`, `FIRA_SANS`
*(68 total fonts available)*

### Roundness Presets
| Preset | Radius |
|--------|--------|
| `ROUND_FOUR` | 4px |
| `ROUND_EIGHT` | 8px |
| `ROUND_TWELVE` | 12px |
| `ROUND_FULL` | Full/pill |

### Color Variants
`MONOCHROME`, `NEUTRAL`, `TONAL_SPOT`, `VIBRANT`, `EXPRESSIVE`,
`FIDELITY`, `CONTENT`, `RAINBOW`, `FRUIT_SALAD`

---

## Crawl4AI Quick Reference

```python
from crawl4ai import AsyncWebCrawler, BrowserConfig, CrawlerRunConfig, CacheMode
from crawl4ai.extraction_strategy import JsonCssExtractionStrategy, LLMExtractionStrategy

# BrowserConfig (global, set once)
browser_cfg = BrowserConfig(
    headless=True,
    enable_stealth=True,
    browser_type="chromium",
    extra_args=["--disable-blink-features=AutomationControlled"],
    # proxy_config={"server": "socks5://127.0.0.1:10808"}  # Iranian proxy
)

# CrawlerRunConfig (per-request)
run_cfg = CrawlerRunConfig(
    cache_mode=CacheMode.BYPASS,
    scan_full_page=True,          # Auto-scroll
    scroll_delay=0.5,
    screenshot=True,
    wait_for="css:.main-content",  # Or: "js:() => document.querySelectorAll('.item').length > 5"
    extraction_strategy=JsonCssExtractionStrategy(schema={...}),
)

async with AsyncWebCrawler(config=browser_cfg) as crawler:
    result = await crawler.arun("https://example.com", config=run_cfg)
    result.markdown.fit_markdown   # Clean LLM-ready markdown
    result.extracted_content       # JSON string from extraction strategy
    result.screenshot              # Base64 PNG
    result.success                 # bool
```

## Firecrawl Quick Reference

```python
from firecrawl import FirecrawlApp

app = FirecrawlApp(api_key="fc-...")

# Single page
doc = app.scrape_url("https://example.com", params={"formats": ["markdown"], "onlyMainContent": True})

# Site crawl
crawl = app.crawl_url("https://example.com", params={"limit": 100, "maxDepth": 3}, poll_interval=5)

# URL discovery
urls = app.map_url("https://example.com", params={"search": "pricing"})

# Structured extraction
from pydantic import BaseModel
class Item(BaseModel):
    title: str
    price: float

data = app.scrape_url("https://example.com", params={
    "formats": ["json"],
    "jsonOptions": {"schema": Item.model_json_schema()}
})
```
