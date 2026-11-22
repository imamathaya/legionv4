# Validation: Feature 001

**Date**: 2026-11-22
**Scope**: Implementation verification for `specs/001-fondasi-button/`.

## Automated evidence

| Command | Result |
| --- | --- |
| `pnpm build` | Passed: UI `tsc` emit, docs generation, registry build, Next.js production build |
| `pnpm check` | Passed: tokens (19 colors + 8 radius), literals, contrast including state surfaces, docs parity, freshness, registry identity, size (1335 bytes gzip ≤ 4096) |
| `pnpm test` | Passed: 3 files, 17 tests (variants, sizes, states, asChild, keyboard, loading, registry-copy parity, sidecar version) |
| `pnpm test:e2e` | Passed: 14 Playwright tests — axe light/dark (preview and both docs pages), target size/320 px, focus outline, reduced motion, theme token change, copy-vs-package computed parity, locale switcher, theme toggle, `llms.txt`, registry item |
| Copy installation | `shadcn add http://localhost:3000/r/button.json` created `components/ui/button.tsx`, `lib/utils.ts`, `components/ui/button.legion.json`, and merged theme variables into `app/globals.css` |
| Copy consumer | `fixtures/copy-consumer` rendered the copied component on port 3001; parity test passed against the package preview |

Playwright was run with a locally patched headless Chromium because this sandbox lacks the system libraries/fonts Playwright expects. CI uses the standard `playwright install --with-deps chromium` path.

## Not yet run (Converge/QA)

- Manual screen-reader, forced-colors, and assistive-technology pass in `packages/ui/src/components/ui/button.a11y.md` (remaining items are `not-run`).
- Five-participant usability test for SC-002.
- Three AI baseline tasks for SC-007; task and result format exist in `evals/ai-baseline/`.
- First-load JS measurement for the docs pages (bundle size budget is verified; Next route payload measurement is still pending).

`Converged` is therefore not claimed yet. Implementation and automated gates are green; human/QA checks remain.
