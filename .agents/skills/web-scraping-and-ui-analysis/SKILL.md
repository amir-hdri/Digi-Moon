---
name: web-scraping-and-ui-analysis
description: >-
  Use when scraping websites or SPAs, extracting UI/UX design tokens and
  component hierarchies, reverse-engineering internal REST/GraphQL APIs via
  network interception, auditing web apps for tech stack and performance,
  converting extracted design systems into Tailwind/StitchMCP/Figma tokens,
  or handling geo-restricted Iranian sites behind a VPN. Trigger on mentions
  of: scraping, crawling, design token extraction, API sniffing, competitive
  UI analysis, web app review, accessibility audit, or data extraction.
---

# Web Scraping, Deep Site Analysis & UI/UX Extraction

## Overview

Comprehensive runbook for extracting structured data, deconstructing design
systems, reverse-engineering web application APIs, and conducting deep
technical reviews of websites and SPAs. Covers the full pipeline from
reconnaissance through delivery of clean artifacts.

**Core principle:** Always prefer consuming backend JSON APIs over parsing
rendered DOM. The network tab is your best friend.

---

## Decision: Choose Your Tool

Before writing any code, pick the right tool for the job:

```
Is target a known, stable site with predictable structure?
├── YES → Do you need the internal JSON API?
│   ├── YES → Chrome DevTools MCP (list_network_requests) or Playwright intercept
│   └── NO  → Is it a single page or full site crawl?
│       ├── Single page → Firecrawl scrape_url or read_url_content
│       └── Full site   → Crawl4AI arun_many or Firecrawl crawl_url
└── NO → Is it an unpredictable multi-step flow (booking, wizard, auth)?
    ├── YES → Browser-Use (AI agent with autonomous navigation)
    └── NO  → Crawl4AI with LLMExtractionStrategy
```

| Scenario | Best Tool | Why |
|---|---|---|
| Quick single-page content grab | `read_url_content` (built-in) | Zero setup, fast HTTP fetch |
| Live interactive inspection | Chrome DevTools MCP | Direct browser control, screenshots, DOM eval |
| Intercept hidden JSON APIs | DevTools `list_network_requests` or Playwright `page.on("response")` | Captures pure data, no parsing needed |
| Batch site crawl → LLM-ready markdown | Crawl4AI `AsyncWebCrawler` | Stealth, infinite scroll, fit_markdown |
| Structured extraction with schema | Crawl4AI `JsonCssExtractionStrategy` or Firecrawl `jsonOptions` | Deterministic, zero LLM cost |
| Messy unstructured → typed JSON | Crawl4AI `LLMExtractionStrategy` | Pydantic schema validation |
| Autonomous multi-step browsing | Browser-Use `Agent` | Self-healing, adapts to layout changes |
| Design system extraction | DevTools `evaluate_script` + extraction scripts | Computed styles from live DOM |
| Performance & a11y audit | DevTools `lighthouse_audit` + `performance_start_trace` | Real Lighthouse scores |

---

## Pillar 1: Chrome DevTools MCP (Live Browser)

The Chrome DevTools MCP server provides 29 tools for direct browser control.
Key tools for scraping and analysis:

### Navigation & Rendering
```
navigate_page  → Load a URL (waits for load event)
wait_for       → Wait for CSS selector or JS predicate
new_page       → Open a fresh tab
list_pages     → List open tabs with IDs
select_page    → Switch active tab
```

### Extraction & Inspection
```
evaluate_script     → Execute JS in-page, return JSON-serializable result
take_screenshot     → Capture viewport or full-page PNG
take_snapshot       → Accessibility tree dump (landmarks, ARIA, headings)
lighthouse_audit    → Lighthouse scores for a11y, SEO, best practices
```

### Network Intelligence
```
list_network_requests  → All requests since last navigation (filterable by resourceTypes)
get_network_request    → Full request/response details (headers, body, timing)
```

### Interaction
```
click / hover / fill / type_text / press_key / fill_form
drag / upload_file / handle_dialog
emulate / resize_page
```

### Performance
```
performance_start_trace    → Begin a Chrome performance trace
performance_stop_trace     → End trace and get profile
performance_analyze_insight → Analyze captured trace data
```

### Standard Workflow
1. **Navigate:** `navigate_page` with target URL
2. **Wait for hydration:** `wait_for` with `css:.main-content` or JS predicate
3. **Screenshot:** `take_screenshot` for visual state
4. **Sniff APIs:** `list_network_requests` filtered by `resourceTypes: ["fetch", "xhr"]`
5. **Extract tokens:** `evaluate_script` with design system extraction script
6. **Audit:** `lighthouse_audit` for a11y/SEO/best-practices scores

---

## Pillar 2: Network & API Reverse-Engineering

Modern SPAs fetch data from internal APIs. **Always check the network tab
before writing a scraper.** If a JSON API exists, consume it directly.

### Via Chrome DevTools MCP
```
1. navigate_page → target URL
2. list_network_requests with resourceTypes: ["fetch", "xhr"]
3. For each interesting endpoint:
   get_network_request → inspect headers, cookies, payload
4. Reproduce via curl/fetch with same headers
```

### Via Playwright (Programmatic)
```python
# Passive: capture all JSON responses
captured = []
async def on_response(response):
    ct = response.headers.get("content-type", "")
    if "application/json" in ct and response.request.resource_type in ("fetch", "xhr"):
        captured.append({
            "url": response.url,
            "method": response.request.method,
            "status": response.status,
            "data": await response.json()
        })
page.on("response", on_response)

# Deterministic: wait for specific API call triggered by action
async with page.expect_response(lambda r: "/api/search" in r.url) as resp_info:
    await page.click("button#search")
result = await (await resp_info.value).json()

# Optimize: block unnecessary resources
await page.route("**/*", lambda route:
    route.abort() if route.request.resource_type in ("image", "media", "font", "stylesheet")
    else route.continue_()
)
```

---

## Pillar 3: UI/UX Feature & Design System Extraction

### What to Extract
| Category | Tokens | Method |
|---|---|---|
| **Colors** | Background, text, border, accent, surface, error/success | `getComputedStyle` frequency analysis |
| **Typography** | Font families (incl. RTL: Vazirmatn, IRANSans, Dana), sizes, weights, line-heights | Paired font metric extraction |
| **Spacing** | Margins, paddings quantized to 4pt/8pt grid | DOM traversal + frequency clustering |
| **Elevation** | box-shadow values → elevation levels (1-4) | Shadow value grouping |
| **Radii** | Border-radius values mapped to sm/md/lg/full | Frequency + quantization |
| **Breakpoints** | @media query thresholds | Stylesheet rule parsing |
| **Components** | Nav, cards, modals, forms, heroes, footers | Semantic landmark + visual pattern ID |
| **Interactions** | Hover, focus, active, transitions, animations | Pseudo-class inspection |
| **CSS Variables** | All `--custom-property` values from `:root` | Stylesheet `cssRules` traversal |

### Extraction Scripts
Two ready-to-use scripts in `scripts/`:

1. **[extract_design_system.js](./scripts/extract_design_system.js)** — Comprehensive in-page
   extractor. Run via `evaluate_script` in Chrome DevTools MCP or `page.evaluate()` in
   Playwright. Returns `{ meta, designTokens, components, interactions, architecture }`.

2. **[extract_components.js](./scripts/extract_components.js)** — Component-level extractor
   that identifies navigation bars, card grids, modals, forms, heroes, and footer patterns
   with their computed styles.

### Token Normalization
Raw extracted values need normalization before use:
- **Color clustering:** Group similar values (ΔE < 3 in CIELAB) into semantic roles
- **Spacing quantization:** Snap to nearest 4px grid: `round(value / 4) * 4`
- **Font deduplication:** Normalize font family strings, remove fallback chains
- **Shadow leveling:** Map unique shadows to `elevation-{1..4}` tiers by blur radius

---

## Pillar 4: Headless Scraping Engines

### Crawl4AI (Open-Source, Python 3.10+)

```bash
pip install crawl4ai && crawl4ai-setup && crawl4ai-doctor
```

**Architecture:** Two config objects — `BrowserConfig` (global browser) and
`CrawlerRunConfig` (per-request execution).

```python
from crawl4ai import AsyncWebCrawler, BrowserConfig, CrawlerRunConfig, CacheMode
from crawl4ai.extraction_strategy import JsonCssExtractionStrategy

browser_cfg = BrowserConfig(
    headless=True,
    enable_stealth=True,       # Patches navigator.webdriver
    extra_args=["--disable-blink-features=AutomationControlled"]
)

# CSS-based structured extraction (zero LLM cost)
schema = {
    "name": "Products",
    "baseSelector": "div.product-card",
    "fields": [
        {"name": "title", "selector": "h2", "type": "text"},
        {"name": "price", "selector": ".price", "type": "text"},
        {"name": "url", "selector": "a", "type": "attribute", "attribute": "href"},
        {"name": "image", "selector": "img", "type": "attribute", "attribute": "src"}
    ]
}

run_cfg = CrawlerRunConfig(
    cache_mode=CacheMode.BYPASS,
    extraction_strategy=JsonCssExtractionStrategy(schema=schema),
    scan_full_page=True,       # Auto-scroll for lazy content
    scroll_delay=0.5,
    screenshot=True
)

async with AsyncWebCrawler(config=browser_cfg) as crawler:
    result = await crawler.arun("https://example.com/shop", config=run_cfg)
    # result.extracted_content → JSON string
    # result.markdown.fit_markdown → Cleaned markdown for RAG
    # result.screenshot → Base64 PNG
```

**Anti-bot escalation ladder:**
1. `enable_stealth=True` (default, patches common fingerprints)
2. `UndetectedAdapter` (deeper CDP patching for Cloudflare/DataDome)
3. Proxy rotation via `CrawlerRunConfig(proxy_config=[...])`

### Firecrawl (API-First, Managed Service)

```bash
pip install firecrawl-py  # or: npm install @mendable/firecrawl-js
```

```python
from firecrawl import FirecrawlApp
from pydantic import BaseModel

app = FirecrawlApp(api_key="fc-...")

# Single page → clean markdown
doc = app.scrape_url("https://example.com", params={
    "formats": ["markdown"],
    "onlyMainContent": True
})

# Structured extraction with Pydantic schema
class Product(BaseModel):
    title: str
    price: float

result = app.scrape_url("https://example.com/product", params={
    "formats": ["json"],
    "jsonOptions": {"schema": Product.model_json_schema()}
})

# Site-wide crawl
crawl = app.crawl_url("https://example.com", params={
    "limit": 100, "maxDepth": 3,
    "scrapeOptions": {"formats": ["markdown"]}
}, poll_interval=5)

# Fast URL discovery (no rendering)
urls = app.map_url("https://example.com", params={"search": "pricing"})
```

### Browser-Use (AI Agent for Unpredictable Flows)

```python
from browser_use import Agent
from langchain_openai import ChatOpenAI

agent = Agent(
    task="Search for 'wireless keyboard' on example-store.com, "
         "sort by price, extract top 3 product names and prices.",
    llm=ChatOpenAI(model="gpt-4o")
)
history = await agent.run()
print(history.final_result())
```

**Use Browser-Use ONLY for:** multi-step wizards, unpredictable layouts,
flows requiring visual judgment. It costs 10-100x more tokens than
Playwright/Crawl4AI.

---

## Pillar 5: Design System Export Pipelines

### → Tailwind CSS v4 (@theme)
```css
@import "tailwindcss";

@theme {
  --color-primary: #0066cc;
  --color-secondary: #00a884;
  --color-surface: #f8fafc;
  --font-heading: "Plus Jakarta Sans", sans-serif;
  --font-body: "Inter", sans-serif;
  --radius-card: 12px;
  --spacing-section: 64px;
}
```

### → Tailwind CSS v3 (config)
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary, #0066cc)',
        surface: { DEFAULT: '#f8fafc', card: '#ffffff' }
      },
      fontFamily: {
        heading: ['Plus Jakarta Sans', 'sans-serif'],
        body: ['Inter', 'sans-serif']
      },
      borderRadius: { sm: '4px', md: '8px', lg: '12px', full: '9999px' }
    }
  }
};
```

### → W3C Design Tokens (DTCG Standard)
```json
{
  "color": {
    "brand": {
      "primary": {
        "$value": "#0066cc",
        "$type": "color",
        "$description": "Primary brand color"
      }
    }
  },
  "spacing": {
    "md": { "$value": "16px", "$type": "dimension" }
  }
}
```

### → StitchMCP Design System
Map extracted tokens to StitchMCP's `create_design_system` API:
1. Primary seed color → `customColor` (hex)
2. Color mode → `colorMode` (LIGHT/DARK)
3. Closest Google Font → `headlineFont` / `bodyFont` (from 68 supported fonts)
4. Corner radius → `roundness` (ROUND_FOUR / ROUND_EIGHT / ROUND_TWELVE / ROUND_FULL)
5. Custom spacing/typography → `spacing` and `typography` token maps
6. Brand guidelines → `designMd` markdown string

Then call `update_design_system` immediately after to finalize.

### → Figma Tokens (Tokens Studio)
```json
{
  "global": {
    "color": {
      "brand": {
        "primary": { "value": "#0066cc", "type": "color" }
      }
    },
    "borderRadius": {
      "md": { "value": "8px", "type": "borderRadius" }
    }
  }
}
```

Use **Style Dictionary v4** to transform a single DTCG JSON source into all
output formats simultaneously (CSS vars, Tailwind, Android, iOS, Figma).

---

## Pillar 6: Geo-Routing & Iranian IP Handling

The user runs a VPN. Target sites may require Iranian IP addresses.

### Strategy Selection
```
Does the target require Iranian IP?
├── YES → Is it domestic (.ir) or Iranian-hosted?
│   ├── YES → Split VPN tunneling (bypass VPN for *.ir)
│   └── NO  → Unlikely to need Iranian IP; test first
└── NO → Standard connection, no proxy needed
```

### Split VPN Tunneling
Configure VPN client to exclude domestic routes so `.ir` domains hit ISP directly.

### Proxy Integration
```python
# Playwright
context = await browser.new_context(
    proxy={"server": "socks5://127.0.0.1:10808"}
)

# Crawl4AI
from crawl4ai.async_configs import ProxyConfig
run_cfg = CrawlerRunConfig(
    proxy_config=[ProxyConfig(server="http://iran-proxy:8080")]
)

# curl test
# curl --proxy socks5://127.0.0.1:10808 https://target.ir
```

### Persian / RTL Data Normalization
```python
import re

# Persian digits → ASCII
def normalize_persian_digits(text: str) -> str:
    persian = "۰۱۲۳۴۵۶۷۸۹"
    arabic  = "٠١٢٣٤٥٦٧٨٩"
    for i in range(10):
        text = text.replace(persian[i], str(i)).replace(arabic[i], str(i))
    return text

# Toman/Rial parsing
def parse_price_toman(raw: str) -> int:
    cleaned = normalize_persian_digits(raw)
    cleaned = re.sub(r"[^\d]", "", cleaned)
    return int(cleaned) if cleaned else 0

# Jalali → Gregorian
import jdatetime
jalali = jdatetime.date(1404, 6, 26)
gregorian = jalali.togregorian()  # datetime.date(2025, 9, 17)
```

---

## Pillar 7: Complete Site Audit Workflow

For a deep review of any website or web app:

### Phase 1: Reconnaissance
1. `navigate_page` → load target
2. `take_screenshot` → full-page visual capture
3. `take_snapshot` → accessibility tree & landmarks
4. `list_network_requests` filtered by `["fetch", "xhr"]` → API endpoints
5. `evaluate_script` → tech stack detection (React, Vue, Next.js, etc.)

### Phase 2: Design System Extraction
1. `evaluate_script` with `extract_design_system.js` → tokens
2. `evaluate_script` with `extract_components.js` → component catalog
3. Normalize and cluster token values

### Phase 3: Performance & Quality Audit
1. `lighthouse_audit` → a11y, SEO, best practices scores
2. `performance_start_trace` → begin profiling
3. Interact with page (scroll, click)
4. `performance_stop_trace` → capture trace
5. `performance_analyze_insight` → identify bottlenecks

### Phase 4: API Documentation
1. Catalog all intercepted endpoints
2. Document request/response schemas
3. Note authentication patterns (Bearer, cookies, CSRF)

### Phase 5: Deliverables
- Design tokens JSON (DTCG format)
- Tailwind CSS theme configuration
- StitchMCP design system (via `create_design_system`)
- API documentation (endpoints, methods, schemas)
- Performance audit report
- Component catalog with screenshots
- Accessibility findings

---

## Common Mistakes

| Mistake | Impact | Fix |
|---|---|---|
| Scraping SPAs without waiting for hydration | Empty `<div id="root"></div>` | `wait_for` CSS/JS predicate after navigation |
| Parsing DOM when JSON API exists | Brittle, breaks on redesigns | Inspect network tab first; consume API directly |
| Ignoring geo/IP restrictions | 403 / Cloudflare block | Route through Iranian proxy or split VPN |
| Extracting colors without clustering | Hundreds of near-duplicate RGBA values | Group by ΔE < 3, assign semantic roles |
| Hardcoding CSS-in-JS hash selectors | Selectors break every build | Use `data-testid`, ARIA labels, text content |
| Using `result.markdown` instead of `fit_markdown` | 2x token waste in LLM pipelines | Always prefer `result.markdown.fit_markdown` |
| Skipping `crawl4ai-doctor` | Mysterious Playwright failures | Run diagnostic before first crawl |
| Using Browser-Use for simple extraction | 100x token cost vs Playwright | Reserve for unpredictable multi-step flows only |
