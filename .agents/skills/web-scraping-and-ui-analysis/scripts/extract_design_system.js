/**
 * Comprehensive Design System Token Extractor v2.0
 * 
 * Run via Chrome DevTools MCP `evaluate_script` or Playwright `page.evaluate()`.
 * Returns a structured JSON object containing design tokens, CSS variables,
 * component architecture, and page metadata.
 * 
 * Usage in Chrome DevTools MCP:
 *   evaluate_script({ pageId: 1, function: "<paste this entire IIFE>" })
 * 
 * Usage in Playwright:
 *   const tokens = await page.evaluate(() => { <paste IIFE body> });
 */
(() => {
  "use strict";

  // ─── Helpers ───────────────────────────────────────────────────────
  const allElements = Array.from(document.querySelectorAll("body *"));
  const visibleElements = allElements.filter(el => {
    const s = window.getComputedStyle(el);
    return s.display !== "none" && s.visibility !== "hidden" && s.opacity !== "0";
  });

  function tally(map, val) {
    if (!val || val === "none" || val === "rgba(0, 0, 0, 0)" || val === "transparent" || val === "0px") return;
    map[val] = (map[val] || 0) + 1;
  }

  function topN(map, n = 15) {
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, n)
      .map(([value, count]) => ({ value, count }));
  }

  // ─── 1. CSS Custom Properties (--*) from :root / html ─────────────
  const cssVariables = {};
  try {
    Array.from(document.styleSheets).forEach(sheet => {
      try {
        Array.from(sheet.cssRules || []).forEach(rule => {
          if (rule.selectorText && /^(:root|html)$/i.test(rule.selectorText.trim())) {
            Array.from(rule.style).forEach(prop => {
              if (prop.startsWith("--")) {
                cssVariables[prop] = rule.style.getPropertyValue(prop).trim();
              }
            });
          }
        });
      } catch (_) { /* CORS stylesheet — skip */ }
    });
  } catch (_) {}

  // ─── 2. Computed Style Aggregation ─────────────────────────────────
  const colorMap = {};
  const bgColorMap = {};
  const borderColorMap = {};
  const fontMap = {};
  const fontSizeMap = {};
  const fontWeightMap = {};
  const lineHeightMap = {};
  const letterSpacingMap = {};
  const radiusMap = {};
  const shadowMap = {};
  const marginMap = {};
  const paddingMap = {};
  const gapMap = {};
  const transitionMap = {};

  visibleElements.forEach(el => {
    const s = window.getComputedStyle(el);

    // Colors
    tally(colorMap, s.color);
    tally(bgColorMap, s.backgroundColor);
    if (s.borderTopColor && s.borderTopWidth !== "0px") tally(borderColorMap, s.borderTopColor);

    // Typography
    const fontFamily = s.fontFamily ? s.fontFamily.split(",")[0].trim().replace(/['"]/g, "") : null;
    if (fontFamily) tally(fontMap, fontFamily);
    tally(fontSizeMap, s.fontSize);
    tally(fontWeightMap, s.fontWeight);
    if (s.lineHeight !== "normal") tally(lineHeightMap, s.lineHeight);
    if (s.letterSpacing !== "normal") tally(letterSpacingMap, s.letterSpacing);

    // Spacing
    tally(radiusMap, s.borderRadius);
    tally(shadowMap, s.boxShadow);
    tally(marginMap, s.marginTop);
    tally(marginMap, s.marginBottom);
    tally(paddingMap, s.paddingTop);
    tally(paddingMap, s.paddingBottom);
    tally(paddingMap, s.paddingLeft);
    tally(paddingMap, s.paddingRight);
    if (s.gap && s.gap !== "normal") tally(gapMap, s.gap);

    // Transitions & Animations
    if (s.transition && s.transition !== "all 0s ease 0s" && s.transition !== "none") {
      tally(transitionMap, s.transition);
    }
  });

  // ─── 3. Media Query Breakpoints ────────────────────────────────────
  const breakpoints = new Set();
  try {
    Array.from(document.styleSheets).forEach(sheet => {
      try {
        Array.from(sheet.cssRules || []).forEach(rule => {
          if (rule instanceof CSSMediaRule) {
            const match = rule.conditionText.match(/(?:min|max)-width\s*:\s*([\d.]+(?:px|em|rem))/gi);
            if (match) match.forEach(m => {
              const val = m.replace(/(?:min|max)-width\s*:\s*/i, "").trim();
              breakpoints.add(val);
            });
          }
        });
      } catch (_) {}
    });
  } catch (_) {}

  // ─── 4. Semantic Landmark Architecture ─────────────────────────────
  const landmarks = {
    hasHeader: !!document.querySelector("header, [role='banner']"),
    navCount: document.querySelectorAll("nav, [role='navigation']").length,
    hasMain: !!document.querySelector("main, [role='main']"),
    hasAside: !!document.querySelector("aside, [role='complementary']"),
    hasFooter: !!document.querySelector("footer, [role='contentinfo']"),
    hasSearch: !!document.querySelector("[role='search'], form[role='search']"),
    formCount: document.querySelectorAll("form").length,
    dialogCount: document.querySelectorAll("dialog, [role='dialog']").length,
  };

  // ─── 5. Heading Hierarchy ──────────────────────────────────────────
  const headings = Array.from(document.querySelectorAll("h1, h2, h3, h4, h5, h6")).map(h => ({
    level: parseInt(h.tagName[1]),
    text: h.textContent.trim().substring(0, 80),
    fontSize: window.getComputedStyle(h).fontSize,
    fontWeight: window.getComputedStyle(h).fontWeight,
  }));

  // ─── 6. External Resources (fonts, scripts, frameworks) ───────────
  const externalFonts = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
    .map(l => l.href)
    .filter(h => /fonts\.googleapis|fonts\.gstatic|use\.typekit|fontcdn/i.test(h));

  const metaGenerator = document.querySelector('meta[name="generator"]')?.content || null;
  const nextData = !!document.querySelector("#__NEXT_DATA__");
  const nuxtApp = !!document.querySelector("#__nuxt") || !!document.querySelector("#__NUXT__");
  const reactRoot = !!document.querySelector("#root, #__next, [data-reactroot]");
  const vueApp = !!document.querySelector("#app[data-v-app], [data-v-]");
  const svelteApp = !!document.querySelector("[class*='svelte-']");
  const angularApp = !!document.querySelector("[ng-version], [_ngcontent], [_nghost]");

  const detectedFramework =
    nextData ? "Next.js" :
    nuxtApp ? "Nuxt.js" :
    angularApp ? "Angular" :
    svelteApp ? "Svelte" :
    vueApp ? "Vue.js" :
    reactRoot ? "React" :
    metaGenerator ? `CMS: ${metaGenerator}` :
    "Unknown";

  // ─── 7. Image Analysis ─────────────────────────────────────────────
  const images = Array.from(document.querySelectorAll("img")).map(img => ({
    src: (img.src || img.dataset.src || "").substring(0, 120),
    alt: img.alt || null,
    loading: img.loading || null,
    fetchPriority: img.fetchPriority || null,
    width: img.naturalWidth,
    height: img.naturalHeight,
  })).slice(0, 20);

  // ─── 8. Structured Data / JSON-LD ──────────────────────────────────
  const jsonLd = Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
    .map(s => {
      try { return JSON.parse(s.textContent); } catch (_) { return null; }
    })
    .filter(Boolean)
    .slice(0, 5);

  // ─── Assemble Result ──────────────────────────────────────────────
  return {
    meta: {
      title: document.title,
      description: document.querySelector('meta[name="description"]')?.content || null,
      canonical: document.querySelector('link[rel="canonical"]')?.href || null,
      ogImage: document.querySelector('meta[property="og:image"]')?.content || null,
      lang: document.documentElement.lang || "unknown",
      direction: document.documentElement.dir || document.body.dir || "ltr",
      charset: document.characterSet,
      viewport: document.querySelector('meta[name="viewport"]')?.content || null,
      detectedFramework,
    },
    designTokens: {
      cssVariables: {
        total: Object.keys(cssVariables).length,
        colorVars: Object.entries(cssVariables).filter(([k]) => /color|bg|background|surface|primary|secondary|accent|brand|text|border/i.test(k)).slice(0, 15),
        spacingVars: Object.entries(cssVariables).filter(([k]) => /space|spacing|gap|margin|padding|size/i.test(k)).slice(0, 10),
        fontVars: Object.entries(cssVariables).filter(([k]) => /font|type|heading|body|display/i.test(k)).slice(0, 10),
        radiusVars: Object.entries(cssVariables).filter(([k]) => /radius|round|corner/i.test(k)).slice(0, 8),
        otherVars: Object.entries(cssVariables).filter(([k]) => !/color|bg|background|surface|primary|secondary|accent|brand|text|border|space|spacing|gap|margin|padding|size|font|type|heading|body|display|radius|round|corner/i.test(k)).slice(0, 10),
      },
      colors: {
        text: topN(colorMap, 10),
        background: topN(bgColorMap, 12),
        border: topN(borderColorMap, 8),
      },
      typography: {
        families: topN(fontMap, 8),
        sizes: topN(fontSizeMap, 12),
        weights: topN(fontWeightMap, 6),
        lineHeights: topN(lineHeightMap, 6),
        letterSpacings: topN(letterSpacingMap, 6),
        externalFonts,
      },
      spacing: {
        margins: topN(marginMap, 10),
        paddings: topN(paddingMap, 12),
        gaps: topN(gapMap, 8),
      },
      elevation: {
        borderRadii: topN(radiusMap, 8),
        boxShadows: topN(shadowMap, 6),
      },
      motion: {
        transitions: topN(transitionMap, 6),
      },
      breakpoints: Array.from(breakpoints).sort((a, b) => parseFloat(a) - parseFloat(b)),
    },
    architecture: {
      landmarks,
      headingHierarchy: headings.slice(0, 20),
      totalDomElements: allElements.length,
      visibleElements: visibleElements.length,
    },
    assets: {
      images: images,
      jsonLd: jsonLd,
    },
  };
})();
