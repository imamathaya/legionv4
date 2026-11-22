# Button accessibility checklist

Manual checks for the Button component. Automated checks live in `e2e/button.a11y.spec.ts`; this file records the human evidence required by Constitution Principle VI.

| Criterion | Method | Result | Evidence | Reviewer |
| --- | --- | --- | --- | --- |
| 1.4.3, 1.4.11 | Verify text, border, and focus contrast in light and dark using the docs pages. | not-run | — | — |
| 2.1.1, 2.4.3 | Tab to every variant; activate with Enter and Space; confirm focus order. | not-run | — | — |
| 2.4.7, 2.4.11 | Confirm the focus outline is visible and not clipped in both modes. | not-run | — | — |
| 2.5.3, 4.1.2 | Check the icon-only example has a name and the button exposes role/state. | not-run | — | — |
| 2.5.8 | Measure the smallest target; it must be at least 24 × 24 CSS px. | not-run | — | — |
| 1.4.1 | Verify loading is conveyed by spinner and status text, not color alone. | not-run | — | — |
| 2.5.7 | Enable reduced motion; confirm no required animation remains. | not-run | — | — |
| 1.4.4, 1.4.10 | Zoom to 200% and set viewport to 320 px; confirm no clipping or lost function. | not-run | — | — |
| 3.3.2 | Confirm the status text is announced once and loading blocks activation. | not-run | — | — |
| 4.1.3 | Confirm `aria-busy` is true while loading and absent afterwards. | not-run | — | — |
