# Button accessibility checklist

Component: `button`
Standard: WCAG 2.2 Level AA
Environment: Chromium 143 headless, Playwright 1.65, viewport 1280×900 and 320×720, light and dark, `prefers-reduced-motion: reduce`.
Reviewer: Senior Frontend Engineer.

| Criterion | Method | Result | Evidence |
| --- | --- | --- | --- |
| 1.4.3 | Automated contrast check of every token pair in both modes (`pnpm check:contrast`). | pass | 48 checks, 0 failures; destructive text 4.71:1 light and 6.24:1 dark. |
| 1.4.11 | Automated contrast check for `--input` and `--ring` against background and card. | pass | Input 3.36:1 light and 4.18:1 dark against card; ring 5.03:1 light and 6.91:1 dark. |
| 1.4.4 | Set page zoom to 200% and verify every Button remains visible and operable. | pass | Playwright `button.a11y.spec.ts` zoom scenario. |
| 1.4.10 | Render at a 320 px viewport and verify no horizontal page overflow. | pass | Playwright `button.a11y.spec.ts` narrow viewport scenario. |
| 2.1.1 | Tab to the control; Enter and Space activate a native button; Enter activates a link. | pass | Vitest keyboard test and Playwright focus scenario. |
| 2.4.7 | Focus an element with `:focus-visible` and assert a visible outline. | pass | Computed `outline-style` is solid and `outline-width` is at least 2 px in both modes. |
| 2.4.11 | Focus Button and verify no overlapping fixed element covers it. | pass | Preview harness has no overlays; Playwright checks the focus rectangle. |
| 2.5.8 | Measure every size including icon-only at least 24 × 24 CSS px. | pass | `sm` height is 32 px; icon-only example uses a square `size-8` target. |
| 4.1.2 | Icon-only Button has an accessible name; loading sets `aria-busy` and one status message. | pass | `aria-label="Search"`; Vitest asserts one persistent `role="status"`. |
| 1.4.1 | Loading is conveyed by a spinner plus status text, not colour alone. | pass | Spinner is visible and the status region carries the label. |
| 2.5.7 | Spinner and transitions stop under reduced motion. | pass | Playwright `prefers-reduced-motion` scenario reads computed animation and transition. |
| 3.3.2 | Loading label can be localized for Indonesian documentation. | pass | `loadingLabel="Memuat"` example in the Indonesian prose. |
