## Preview and variants

[[PREVIEW]]

## Install as package

Install the private package and import its token stylesheet:

```bash
pnpm add @legionv4/ui
```

```tsx
import { Button } from "@legionv4/ui";
import "@legionv4/ui/styles.css";

export function Example() {
  return <Button>Save</Button>;
}
```

## Install as copy

Copy the component and its dependencies directly into a project that already uses shadcn and Tailwind CSS 4:

```bash
npx shadcn@latest add http://localhost:3000/r/button.json
```

The copy includes `button.legion.json`, which records the source version and the documentation URLs, so you can tell when the copy falls behind.

## Usage

[[EXAMPLES]]

```tsx
import { Button } from "@legionv4/ui";

<Button>Save</Button>
<Button variant="secondary" size="sm">Cancel</Button>
<Button variant="destructive" loading loadingLabel="Deleting">Delete</Button>
<Button variant="outline" asChild>
  <a href="/docs/components/button">Read the docs</a>
</Button>
```

## Props

[[PROPS]]

## Dependencies

[[DEPENDENCIES]]

## Accessibility

Button targets WCAG 2.2 AA. Every variant and state uses semantic tokens; text meets 4.5:1, control boundaries and focus indicators meet 3:1 in both modes, and targets are at least 24 × 24 CSS px.

- Keyboard: Tab reaches the button; Enter and Space activate native buttons; links activate with Enter.
- Focus: a two-pixel outline with offset remains visible and is never clipped.
- Loading: `aria-busy` is set, the action is blocked, and the localized `loadingLabel` is announced once.
- Icon-only: provide `aria-label` or `aria-labelledby`.
- Motion: the spinner stops under `prefers-reduced-motion`.
- Zoom and reflow: labels wrap at 200% zoom and 320 px width instead of clipping.

The manual evidence is recorded in `packages/ui/src/components/ui/button.a11y.md`.

## Source

The documentation renders the same source file that the package and registry copy use.

[[SOURCE]]
