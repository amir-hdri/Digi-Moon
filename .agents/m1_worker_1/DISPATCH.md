## 2026-09-17T23:13:45Z
You are m1_worker_1, a teamwork_preview_worker implementing Milestone 1 (Core Setup & Foundation) for the Dijimoon Next.js 15 e-commerce storefront.
Your working directory is: /Users/amirheidari/GitHub/Digi-Moon/.agents/m1_worker_1

Read the authoritative user request at: /Users/amirheidari/GitHub/Digi-Moon/.agents/ORIGINAL_REQUEST.md
Read the master project specification at: /Users/amirheidari/GitHub/Digi-Moon/PROJECT.md
Read the domain skill instructions at: /Users/amirheidari/.gemini/config/skills/vercel-nextjs-expert/SKILL.md

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

EXCLUSIVE WRITE OWNERSHIP:
You own and must create/modify exclusively the following files in the project root:
- package.json
- tsconfig.json
- next.config.ts
- postcss.config.mjs
- eslint.config.mjs
- src/app/layout.tsx
- src/app/globals.css
- src/app/page.tsx
- src/types/index.ts
- src/lib/persian.ts
- src/lib/utils.ts
- src/lib/api.ts
- src/data/mock-data.ts
- public/logo.png (or placeholder)
- public/favicon.ico

INPUTS & BLUEPRINTS:
Examine the ready drop-in blueprints authored by the M1 exploration team:
1. Package & Configs:
   - /Users/amirheidari/GitHub/Digi-Moon/.agents/m1_explorer_1/proposed_package.json
   - /Users/amirheidari/GitHub/Digi-Moon/.agents/m1_explorer_1/proposed_tsconfig.json
   - /Users/amirheidari/GitHub/Digi-Moon/.agents/m1_explorer_1/proposed_next.config.ts
   - /Users/amirheidari/GitHub/Digi-Moon/.agents/m1_explorer_1/proposed_postcss.config.mjs
   - /Users/amirheidari/GitHub/Digi-Moon/.agents/m1_explorer_1/proposed_eslint.config.mjs
   - /Users/amirheidari/GitHub/Digi-Moon/.agents/m1_explorer_1/handoff.md
2. Layout, Theme & Typography:
   - /Users/amirheidari/GitHub/Digi-Moon/.agents/m1_explorer_2/proposed_layout.tsx
   - /Users/amirheidari/GitHub/Digi-Moon/.agents/m1_explorer_2/proposed_globals.css
   - /Users/amirheidari/GitHub/Digi-Moon/.agents/m1_explorer_2/proposed_page.tsx
   - /Users/amirheidari/GitHub/Digi-Moon/.agents/m1_explorer_2/handoff.md
3. Domain Types, Persian Utilities & Mock Dataset:
   - /Users/amirheidari/GitHub/Digi-Moon/.agents/m1_spec_miner_1/handoff.md

EXECUTION STEPS:
1. Write the root configuration files (package.json, tsconfig.json, next.config.ts, postcss.config.mjs, eslint.config.mjs).
2. Run `npm install` to install all dependencies cleanly.
3. Write `src/types/index.ts`, `src/lib/persian.ts`, `src/lib/utils.ts`, `src/lib/api.ts`, and `src/data/mock-data.ts`.
4. Write `src/app/globals.css` (Tailwind v4 `@theme`, `@custom-variant dark`, `@custom-variant rtl`, brand tokens, glassmorphism, floating animation), `src/app/layout.tsx` (Vazirmatn local fonts, dir="rtl", lang="fa", anti-FOUC script), and `src/app/page.tsx` (smoke test).
5. Ensure `public/` directory exists with a placeholder `logo.png` and `favicon.ico`.
6. VERIFICATION (MANDATORY):
   - Run `npm run type-check` (must pass with 0 errors).
   - Run `npm run lint` (must pass with 0 errors).
   - Run `npm run build` (must pass cleanly with exit code 0).
7. Document all commands, file changes, and verification output in `/Users/amirheidari/GitHub/Digi-Moon/.agents/m1_worker_1/handoff.md`.
When finished, send a brief notification message to your parent.
