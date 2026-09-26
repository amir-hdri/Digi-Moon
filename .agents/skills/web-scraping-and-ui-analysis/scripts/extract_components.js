/**
 * UI Component Pattern Extractor v1.0
 * 
 * Identifies and catalogs reusable UI components on a live page:
 * Navigation bars, Hero sections, Card grids, Modals/Drawers, Forms,
 * Tables, Footers, Sidebars, and Floating action elements.
 * 
 * Run via Chrome DevTools MCP `evaluate_script` or Playwright `page.evaluate()`.
 */
(() => {
  "use strict";

  function getStyle(el, prop) {
    return window.getComputedStyle(el)[prop];
  }

  function getBounds(el) {
    const r = el.getBoundingClientRect();
    return { top: r.top, left: r.left, width: r.width, height: r.height };
  }

  function extractBaseStyles(el) {
    const s = window.getComputedStyle(el);
    return {
      backgroundColor: s.backgroundColor,
      color: s.color,
      fontSize: s.fontSize,
      fontFamily: s.fontFamily.split(",")[0].trim().replace(/['"]/g, ""),
      fontWeight: s.fontWeight,
      padding: s.padding,
      borderRadius: s.borderRadius,
      boxShadow: s.boxShadow !== "none" ? s.boxShadow : null,
      position: s.position,
      zIndex: s.zIndex !== "auto" ? parseInt(s.zIndex) : null,
    };
  }

  // ─── Navigation Bars ──────────────────────────────────────────────
  const navs = Array.from(document.querySelectorAll("nav, header, [role='banner'], [role='navigation']"))
    .slice(0, 5)
    .map(nav => {
      const s = window.getComputedStyle(nav);
      const links = Array.from(nav.querySelectorAll("a")).map(a => ({
        text: a.textContent.trim().substring(0, 40),
        href: a.href.substring(0, 100),
      })).slice(0, 15);

      return {
        tag: nav.tagName.toLowerCase(),
        role: nav.getAttribute("role"),
        isSticky: s.position === "sticky" || s.position === "fixed",
        bounds: getBounds(nav),
        styles: extractBaseStyles(nav),
        linkCount: links.length,
        links: links.slice(0, 8),
        hasSearch: !!nav.querySelector("input[type='search'], [role='search'], input[placeholder*='search' i], input[placeholder*='جستجو']"),
        hasLogo: !!nav.querySelector("img, svg, [class*='logo' i]"),
        hasHamburger: !!nav.querySelector("[class*='hamburger' i], [class*='menu-toggle' i], [aria-label*='menu' i]"),
      };
    });

  // ─── Hero / Banner Sections ───────────────────────────────────────
  const heroSelectors = [
    "[class*='hero' i]", "[class*='banner' i]", "[class*='jumbotron' i]",
    "[class*='splash' i]", "[class*='landing' i]", "section:first-of-type",
  ];
  const heroElements = [];
  heroSelectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      if (!heroElements.includes(el) && el.getBoundingClientRect().height > 200) {
        heroElements.push(el);
      }
    });
  });

  const heroes = heroElements.slice(0, 3).map(el => {
    const s = window.getComputedStyle(el);
    return {
      tag: el.tagName.toLowerCase(),
      className: el.className.toString().substring(0, 80),
      bounds: getBounds(el),
      styles: extractBaseStyles(el),
      backgroundImage: s.backgroundImage !== "none" ? s.backgroundImage.substring(0, 120) : null,
      hasHeading: !!el.querySelector("h1, h2"),
      headingText: (el.querySelector("h1, h2")?.textContent || "").trim().substring(0, 80),
      hasCTA: !!el.querySelector("a[class*='btn' i], button[class*='btn' i], a[class*='cta' i], button"),
      ctaText: (el.querySelector("a[class*='btn' i], button[class*='btn' i], a[class*='cta' i], button")?.textContent || "").trim().substring(0, 40),
    };
  });

  // ─── Card Patterns ────────────────────────────────────────────────
  const cardSelectors = [
    "[class*='card' i]", "[class*='tile' i]", "[class*='item' i]",
    "article", "[class*='product' i]",
  ];
  const cardCandidates = [];
  cardSelectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.width > 100 && r.height > 100 && r.width < 800) {
        cardCandidates.push(el);
      }
    });
  });

  // Group cards by similar dimensions (likely same component)
  const cardGroups = {};
  cardCandidates.forEach(el => {
    const r = el.getBoundingClientRect();
    const key = `${Math.round(r.width / 20) * 20}x${Math.round(r.height / 20) * 20}`;
    if (!cardGroups[key]) cardGroups[key] = [];
    cardGroups[key].push(el);
  });

  const cards = Object.entries(cardGroups)
    .filter(([, els]) => els.length >= 2) // Only patterns with 2+ instances
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 5)
    .map(([dims, els]) => {
      const sample = els[0];
      return {
        approximateDimensions: dims,
        instanceCount: els.length,
        sampleTag: sample.tagName.toLowerCase(),
        sampleClassName: sample.className.toString().substring(0, 60),
        styles: extractBaseStyles(sample),
        hasImage: !!sample.querySelector("img, picture, [class*='image' i]"),
        hasTitle: !!sample.querySelector("h2, h3, h4, [class*='title' i]"),
        hasPrice: !!sample.querySelector("[class*='price' i], [class*='cost' i]"),
        hasBadge: !!sample.querySelector("[class*='badge' i], [class*='tag' i], [class*='label' i]"),
        hasButton: !!sample.querySelector("button, a[class*='btn' i]"),
      };
    });

  // ─── Forms ────────────────────────────────────────────────────────
  const forms = Array.from(document.querySelectorAll("form")).slice(0, 5).map(form => {
    const inputs = Array.from(form.querySelectorAll("input, textarea, select")).map(inp => ({
      tag: inp.tagName.toLowerCase(),
      type: inp.type || null,
      name: inp.name || null,
      placeholder: (inp.placeholder || "").substring(0, 40),
      required: inp.required,
    })).slice(0, 15);

    return {
      id: form.id || null,
      action: (form.action || "").substring(0, 80),
      method: form.method,
      inputCount: inputs.length,
      inputs,
      hasSubmit: !!form.querySelector("button[type='submit'], input[type='submit']"),
      styles: extractBaseStyles(form),
    };
  });

  // ─── Tables ───────────────────────────────────────────────────────
  const tables = Array.from(document.querySelectorAll("table")).slice(0, 3).map(table => {
    const headers = Array.from(table.querySelectorAll("th")).map(th =>
      th.textContent.trim().substring(0, 30)
    );
    return {
      headerCount: headers.length,
      headers: headers.slice(0, 10),
      rowCount: table.querySelectorAll("tbody tr, tr").length,
      styles: extractBaseStyles(table),
      isResponsive: getStyle(table.parentElement, "overflowX") === "auto" || getStyle(table.parentElement, "overflowX") === "scroll",
    };
  });

  // ─── Modals / Dialogs / Drawers ───────────────────────────────────
  const modalSelectors = [
    "dialog", "[role='dialog']", "[role='alertdialog']",
    "[class*='modal' i]", "[class*='drawer' i]", "[class*='overlay' i]",
    "[class*='popup' i]", "[class*='sheet' i]",
  ];
  const modals = [];
  modalSelectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      if (!modals.find(m => m.element === el)) {
        const s = window.getComputedStyle(el);
        modals.push({
          element: el,
          tag: el.tagName.toLowerCase(),
          role: el.getAttribute("role"),
          className: el.className.toString().substring(0, 60),
          isVisible: s.display !== "none" && s.visibility !== "hidden",
          styles: extractBaseStyles(el),
          hasBackdrop: s.backdropFilter !== "none" || !!el.parentElement?.querySelector("[class*='backdrop' i], [class*='overlay' i]"),
        });
      }
    });
  });

  // ─── Footer ───────────────────────────────────────────────────────
  const footer = document.querySelector("footer, [role='contentinfo']");
  const footerInfo = footer ? {
    bounds: getBounds(footer),
    styles: extractBaseStyles(footer),
    linkCount: footer.querySelectorAll("a").length,
    hasSocialLinks: !!footer.querySelector("[class*='social' i], [href*='twitter'], [href*='facebook'], [href*='instagram'], [href*='linkedin'], [href*='telegram'], [href*='whatsapp']"),
    hasNewsletter: !!footer.querySelector("input[type='email'], [class*='newsletter' i], [class*='subscribe' i]"),
    columnCount: Array.from(footer.children).filter(c => {
      const s = window.getComputedStyle(c);
      return s.display === "flex" || s.display === "inline-block" || s.display === "grid";
    }).length || footer.querySelectorAll("[class*='col' i]").length,
  } : null;

  // ─── Floating / Fixed Elements ────────────────────────────────────
  const floatingElements = allElements
    .filter(el => {
      const s = window.getComputedStyle(el);
      return (s.position === "fixed" || s.position === "sticky") && s.display !== "none";
    })
    .slice(0, 8)
    .map(el => ({
      tag: el.tagName.toLowerCase(),
      className: el.className.toString().substring(0, 60),
      position: getStyle(el, "position"),
      bounds: getBounds(el),
      zIndex: parseInt(getStyle(el, "zIndex")) || null,
      role: el.getAttribute("role"),
    }));

  // ─── Assemble ─────────────────────────────────────────────────────
  // Clean up element references from modals
  const cleanModals = modals.map(({ element, ...rest }) => rest).slice(0, 5);

  var allElements = Array.from(document.querySelectorAll("body *"));

  return {
    summary: {
      totalComponents: navs.length + heroes.length + cards.length + forms.length + tables.length + cleanModals.length,
      direction: document.documentElement.dir || document.body.dir || "ltr",
    },
    navigation: navs,
    heroes,
    cardPatterns: cards,
    forms,
    tables,
    modals: cleanModals,
    footer: footerInfo,
    floatingElements,
  };
})();
