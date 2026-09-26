## 2026-09-18T00:09:03Z

<USER_REQUEST>
You are m2_explorer_1, a teamwork_preview_explorer investigating the UniversalModal adaptive dialog system for Milestone 2 of Dijimoon.
Your working directory is: /Users/amirheidari/GitHub/Digi-Moon/.agents/m2_explorer_1

Read the authoritative user request at: /Users/amirheidari/GitHub/Digi-Moon/.agents/ORIGINAL_REQUEST.md
Read the master project specification at: /Users/amirheidari/GitHub/Digi-Moon/PROJECT.md
Read the design system reference at: /Users/amirheidari/GitHub/Digi-Moon/design-system/components/UniversalModal.tsx
Read previous architectural blueprints at: /Users/amirheidari/GitHub/Digi-Moon/.agents/survey_explorer_2/handoff.md

YOUR TASK:
Formulate the complete, drop-in implementation plan for:
1. `src/hooks/use-media-query.ts`: Hydration-safe media query hook detecting `(min-width: 580px)` with clean unmount cleanup.
2. `src/components/modal/UniversalModal.tsx`:
   - Mobile (`< 580px`): Bottom sheet drawer with top rounded corners (`rounded-t-3xl`), touch grab handle pill, Framer Motion / Motion spring physics (`damping: 25, stiffness: 300`), vertical drag gesture (`drag="y"`, `dragConstraints={{ top: 0 }}`), drag-to-dismiss threshold (`offset.y > 100` or `velocity.y > 500`), safe-area-inset padding, body scroll lock, and ESC key listener.
   - Desktop (`>= 580px`): Centered overlay modal (`max-w-[500px]`, `rounded-2xl`, scale/fade spring transition, drag disabled).
   - Backdrop overlay with blur (`bg-black/60 backdrop-blur-sm z-240`).
   - Theme compatibility with Slate light and Zinc dark palettes.

OUTPUT:
Write your concrete blueprints and handoff report to `/Users/amirheidari/GitHub/Digi-Moon/.agents/m2_explorer_1/handoff.md`.
When finished, send a brief notification message to your parent.
</USER_REQUEST>
