# BRIEFING — 2026-09-17T23:05:00Z

## Mission
Investigate and formulate the concrete implementation strategy for typography, RTL layout, anti-FOUC theme styling, Tailwind CSS v4 setup, and smoke test for Milestone 1 of Dijimoon.

## 🔒 My Identity
- Archetype: explorer
- Roles: teamwork_preview_explorer
- Working directory: /Users/amirheidari/GitHub/Digi-Moon/.agents/m1_explorer_2
- Original parent: 875495e2-e902-4678-a7f8-8c203de96906
- Milestone: Milestone 1

## 🔒 Key Constraints
- Read-only investigation — do NOT implement directly in src/
- Follow Tailwind CSS v4 standards (@import "tailwindcss", @theme, @custom-variant)
- Next.js 15+ App Router, React 19, Motion
- Persian fonts (Vazirmatn / IRANSans), RTL layout (dir="rtl", lang="fa")
- Slate (light) vs Zinc (dark) theme strategy with anti-FOUC script
- Write output to handoff.md in own directory and notify parent

## Current Parent
- Conversation ID: 875495e2-e902-4678-a7f8-8c203de96906
- Updated: 2026-09-17T22:55:00Z

## Investigation State
- **Explored paths**:
  - `PROJECT.md` & `ORIGINAL_REQUEST.md` (authoritative directives)
  - `design-system/tailwind-theme.css` & `tokens.json` (design tokens baseline)
  - `survey_explorer_2/handoff.md` & `survey_spec_miner_1/handoff.md` (prior research)
  - Next.js 15 & React 19 App Router standards (Viewport/Metadata, anti-FOUC script, font loading)
  - Tailwind CSS v4 CSS-first architecture (`@import "tailwindcss"`, `@theme`, `@custom-variant`)
- **Key findings**:
  - Tailwind v4 uses CSS-first configuration via `@theme` and `@custom-variant dark (&:where(.dark, .dark *))` without `tailwind.config.js`.
  - `@fontsource/vazirmatn` provides 100% offline, VPN-immune Persian typography without relying on build-time Google Fonts downloads.
  - An inline `<script>` in `<head>` inspecting `localStorage.getItem('dijimoon_theme')` combined with `suppressHydrationWarning` on `<html>` eliminates light/dark FOUC.
  - Light mode surfaces cleanly map to Slate (`slate-50` to `slate-900`) and dark mode surfaces cleanly map to Zinc (`zinc-100` to `zinc-950`).
  - Next.js 15 requires `viewport` to be exported separately from `metadata`.
- **Unexplored areas**: None for Milestone 1 foundation; ready for handoff.

## Key Decisions Made
- Chose `@fontsource/vazirmatn` as primary font dependency with CSS variables and fallback to IRANSans and system fonts for complete network resilience.
- Formulated exact `proposed_layout.tsx`, `proposed_globals.css`, `proposed_page.tsx`, `proposed_postcss.config.mjs`, and `proposed_layout_localfont.tsx`.
- Designed interactive smoke-test page testing all Milestone 1 criteria (RTL, typography ligatures, brand swatches, Slate vs Zinc theme toggle, 12px blur glassmorphism, floating badge animation).

## Artifact Index
- DISPATCH.md — Initial dispatch message
- BRIEFING.md — Persistent working memory
- progress.md — Liveness heartbeat
- proposed_layout.tsx — Drop-in implementation of src/app/layout.tsx
- proposed_globals.css — Drop-in implementation of src/app/globals.css
- proposed_page.tsx — Interactive smoke test page for src/app/page.tsx
- proposed_postcss.config.mjs — Tailwind v4 PostCSS configuration
- proposed_layout_localfont.tsx — Documented alternative using next/font/local
- handoff.md — Complete 5-component handoff report for the worker
