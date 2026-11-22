## Preview and variants

Button is the reference component for Legion v4. It ships five variants (`default`, `secondary`, `destructive`, `outline`, `ghost`) and three sizes (`sm`, `default`, `lg`). Every visual value comes from a semantic token, so the same code renders correctly in light and dark mode.

The preview above renders the real package source. Change the theme with the switch in the header: no component code changes.

## Install as a package

Install the private package and import its stylesheet once in your application root.

```bash
pnpm add @legionv4/ui
```

```tsx
import "@legionv4/ui/styles.css";
import { Button } from "@legionv4/ui";
```

The package expects React 19 and a Tailwind CSS 4 consumer. The stylesheet defines the semantic tokens and their Tailwind mappings.

## Install as a copy

Use the shadcn-compatible registry when you want the source in your repository instead of a dependency.

```bash
pnpm dlx shadcn@4.23.0 add http://localhost:3000/r/button.json
```

The item depends on the `theme` and `utils` items, so both are installed with it. The generated `components/ui/button.legion.json` sidecar records the source version and documentation URLs, which tells you when your copy falls behind.

## Usage

```tsx
import { Button } from "@legionv4/ui";

<Button>Save changes</Button>

<Button variant="secondary" size="sm">
  Cancel
</Button>

<Button variant="destructive" loading loadingLabel="Deleting">
  Delete
</Button>

<Button variant="outline" asChild>
  <a href="/docs">Read docs</a>
</Button>
```

`asChild` renders the child element with the same styles and accessibility attributes, so links keep link semantics. `loading` disables activation, sets `aria-busy`, and announces `loadingLabel` once through a status region.

## Props

The props table below is generated from the TypeScript source and JSDoc. Native button attributes such as `type`, `form`, `onClick`, and `aria-*` are forwarded unchanged.

## Dependencies

The dependency list below is generated from the registry item. The component only imports runtime packages that it actually uses; tokens arrive through the theme item.

## Accessibility

Button targets WCAG 2.2 Level AA. The contract covers:

- Keyboard: Tab focuses; Enter and Space activate native buttons; links activate with Enter.
- Focus: a token-coloured outline is visible in both modes and is never clipped.
- Name: visible text names the button; icon-only usage must pass `aria-label` or `aria-labelledby`.
- Loading: `aria-busy="true"`, a hidden spinner, and one `role="status"` message.
- Target size: at least 24 × 24 CSS pixels; the `sm` size still meets the minimum height.
- Contrast: text meets 4.5:1 and control boundaries and focus rings meet 3:1 in both modes.
- Motion: spinner and transitions stop under `prefers-reduced-motion`.
- Reflow: long labels wrap, and the control remains usable at 200% zoom and 320 px width.
