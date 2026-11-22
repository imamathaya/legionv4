# Button

> Token-driven action control with five variants, three sizes, and six states.

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

## Props (generated)

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `variant` | `"default" \| "secondary" \| "destructive" \| "outline" \| "ghost"` | default | No | Visual style of the button. |
| `size` | `"default" \| "sm" \| "lg"` | default | No | Control size. |
| `asChild` | `boolean` | false | No | Renders the single child element instead of a native button. |
| `loading` | `boolean` | false | No | Blocks activation and exposes a busy state while true. |
| `loadingLabel` | `string` | "Loading" | No | Screen-reader text announced once while loading is true. |
| `className` | `string` | — | No | Extra classes merged after variant classes. |

## Dependencies (generated)

- `@radix-ui/react-slot`
- `class-variance-authority`
- `lucide-react`
- [http://localhost:3000/r/theme.json](http://localhost:3000/r/theme.json)
- [http://localhost:3000/r/utils.json](http://localhost:3000/r/utils.json)

## Accessibility checklist (generated)

Standard: WCAG 2.2 AA · manual status: **pass**

- [x] 1.4.3: Automated contrast check of every token pair in both modes (`pnpm check:contrast`).
- [x] 1.4.11: Automated contrast check for `--input` and `--ring` against background and card.
- [x] 1.4.4: Set page zoom to 200% and verify every Button remains visible and operable.
- [x] 1.4.10: Render at a 320 px viewport and verify no horizontal page overflow.
- [x] 2.1.1: Tab to the control; Enter and Space activate a native button; Enter activates a link.
- [x] 2.4.7: Focus an element with `:focus-visible` and assert a visible outline.
- [x] 2.4.11: Focus Button and verify no overlapping fixed element covers it.
- [x] 2.5.8: Measure every size including icon-only at least 24 × 24 CSS px.
- [x] 4.1.2: Icon-only Button has an accessible name; loading sets `aria-busy` and one status message.
- [x] 1.4.1: Loading is conveyed by a spinner plus status text, not colour alone.
- [x] 2.5.7: Spinner and transitions stop under reduced motion.
- [x] 3.3.2: Loading label can be localized for Indonesian documentation.

See `packages/ui/src/components/ui/button.a11y.md` for evidence.
