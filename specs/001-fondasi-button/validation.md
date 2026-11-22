# Validation: Feature 001

**Date**: 2026-11-22
**Scope**: Independent implementation verification for `specs/001-fondasi-button/`.
**Implementation**: `agent/senior-frontend-engineer/e29c3e9ffd0e` (based on `main`, replacing the reference implementation with an independent one).

## Automated evidence

| Command | Result |
| --- | --- |
| `pnpm build` | Passed: UI `tsc` emit, docs generation, registry build, Next.js production build for both locales |
| `pnpm check` | Passed: 19 semantic colours + radius, token literals, 48 contrast checks, docs parity, freshness, registry identity, size (1550 B gzip ≤ 4096 B) |
| `pnpm test` | Passed: 3 files, 46 tests (matrix, states, keyboard, loading, asChild, refs, copy-vs-package markup parity, sidecar version) |
| `pnpm test:e2e` | Passed: 20 Playwright tests — axe light/dark (preview and both docs pages), 320 px target size, 200% zoom, focus outline, reduced motion, loading status, theme token change, copy-vs-package markup/computed parity, locale switching with theme preservation, `llms.txt`, registry metadata |
| Copy consumer | `fixtures/copy-consumer` renders the registry contents on port 3001; package and copy markup and computed styles match |

E2E was executed against production builds in the official Playwright 1.65.1 Linux container because this sandbox is Alpine/musl and the downloaded Chromium build requires glibc. CI uses the standard `playwright install --with-deps chromium` path on Ubuntu.

## Deviations and open items

- The implementation was built independently from `main`; `main` already contained the Tech Lead implementation, so this branch replaces those implementation files while keeping the shared spec, plan, data model, contracts, and tasks. No Tech Lead component, script, or documentation implementation was copied.
- The AI baseline tasks (SC-007) were not run against an agent without repository context; `evals/ai-baseline/` remains ready for the Converge step.
- The five-participant usability test (SC-002) was not run; this is a human QA activity.
- First-load JS per docs route was not measured from `.next`; the Button gzip budget is measured.
- Screen-reader output was not exercised with a real assistive technology. Loading announcement is verified through the single persistent `role="status"` node; manual AT evidence remains a Converge item.

`Converged` is not claimed. Automated build, static checks, unit tests, and browser tests are green.
