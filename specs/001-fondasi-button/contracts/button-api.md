# Button API Contract

**Version**: 1.0.0 (feature `001-fondasi-button`)
**Status**: Normative for implementation and tests
**Consumer docs language**: English and Bahasa Indonesia (API identifiers remain English)

Normative keywords: **MUST**, **MUST NOT**, **SHOULD**, **MAY**.

## 1. Public exports

From `@legionv4/ui` (package) and `@ui/button` (copy item):

```ts
export { Button, buttonVariants } from "./components/ui/button";
export type { ButtonProps, ButtonVariant, ButtonSize } from "./components/ui/button";
```

- `Button` MUST be a function component that forwards its ref to the rendered element.
- `buttonVariants` MUST be the CVA function used by `Button`, exported so consumers can style links and other elements without duplicating class logic.
- `ButtonProps` MUST extend `React.ButtonHTMLAttributes<HTMLButtonElement>` and MUST NOT add props other than those listed in §2.

## 2. Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `variant` | `"default" \| "secondary" \| "destructive" \| "outline" \| "ghost"` | `"default"` | No | Visual style of the button. |
| `size` | `"sm" \| "default" \| "lg"` | `"default"` | No | Control size. |
| `asChild` | `boolean` | `false` | No | Renders the child element instead of `<button>`, keeping styles and accessibility attributes. |
| `loading` | `boolean` | `false` | No | Disables activation and announces a busy state. |
| `loadingLabel` | `string` | `"Loading"` | No | Screen-reader status text used while `loading` is true. Localized usage passes the locale's text, e.g. `loadingLabel="Memuat"`. |
| `className` | `string` | `undefined` | No | Extra classes merged after variant classes with `cn()`. |

All other native button attributes (`type`, `disabled`, `onClick`, `aria-*`, `data-*`, `form`, etc.) MUST pass through unchanged.

Prohibited props (MUST NOT be added): `isLoading`, `leftIcon`, `rightIcon`, `iconClassName`, `containerClassName`, `style` wrappers, or any `xxxClassName`/`xxxStyle` part-specific prop (Constitution Principle V).

`type` is not defaulted: the native HTML default (`"submit"` inside a form) applies unless the consumer passes `type`.

## 3. Rendering contract

### 3.1 Base element

| Condition | Rendered element |
| --- | --- |
| `asChild` falsy | `<button>` |
| `asChild` truthy | The single child element, via Radix `Slot`; `className`, `ref`, `aria-*`, and event handlers are merged |

- The root element MUST always carry `data-slot="button"`, `data-variant="<variant>"`, and `data-size="<size>"`.
- A `ref` MUST point to the rendered element.
- The root MUST be `inline-flex items-center justify-center` with `gap` from the Tailwind scale.
- `className` MUST win over variant classes when both target the same property.
- The component MUST NOT set `overflow-hidden`, fixed `width`, or text truncation; long labels MUST wrap instead of being clipped (spec Edge Cases; WCAG 1.4.4, 1.4.10).
- Height MUST come from `min-height` plus vertical padding, not a fixed `height`, so text at 200% zoom and 320 px viewport does not clip. The minimum interactive target MUST remain at least 24 × 24 CSS px (WCAG 2.5.8).

### 3.2 Sizes

| Size | Minimum height | Padding-x | Text scale | Gap |
| --- | --- | --- | --- | --- |
| `sm` | 32 px | 12 px | `text-sm` | 6 px |
| `default` | 36 px | 16 px | `text-sm` | 8 px |
| `lg` | 40 px | 24 px | `text-base` | 8 px |

Sizes MUST be expressed with Tailwind scale utilities (`min-h-8`, `px-3`, `text-sm`, …), never arbitrary values. Icon-only buttons MUST be at least 24 × 24 px and MUST use an explicit square size (`size-8`, `size-9`, `size-10`) from the Tailwind scale via `className`; the `size` prop only selects the height/padding/text scale.

## 4. Visual tokens per variant

All classes MUST use semantic tokens. No hex, `rgb()`, `hsl()`, `oklch()`, `text-white`, or arbitrary values are permitted.

| Variant | Surface | Text/icon | Hover | Active |
| --- | --- | --- | --- | --- |
| `default` | `bg-primary` | `text-primary-foreground` | `hover:bg-primary/90` | `active:bg-primary/80` |
| `secondary` | `bg-secondary` | `text-secondary-foreground` | `hover:bg-secondary/80` | `active:bg-secondary/70` |
| `destructive` | `bg-destructive` | `text-destructive-foreground` | `hover:shadow-sm` | `active:shadow-none` |
| `outline` | `bg-background` + `border border-input` | `text-foreground` | `hover:bg-accent hover:text-accent-foreground` | `active:bg-accent/80` |
| `ghost` | transparent | `text-foreground` | `hover:bg-accent hover:text-accent-foreground` | `active:bg-accent/80` |

Shared:
- Every surface opacity used by a hover/active state (for example `bg-primary/90`) MUST be listed in `contrast-pairs.json` as a composited state surface and MUST keep the text pair at or above 4.5:1 in both modes. `destructive` MUST NOT dim its surface because its fixed `--destructive-foreground` sits at 4.56:1 in light mode; it changes emphasis with the token shadow scale instead.
- Radius: `rounded-md` (token-derived; `rounded-[…]` forbidden).
- Focus: `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring`. The outline MUST NOT be clipped by the component and MUST remain visible in forced-colors mode.
- Disabled: `disabled:pointer-events-none disabled:opacity-50`; disabled controls are exempt from contrast requirements (WCAG 1.4.3 exception).
- Transitions MUST be limited to color/opacity/shadow and MUST be disabled under `prefers-reduced-motion` (`motion-reduce:transition-none`, `motion-reduce:animate-none`).
- No variant or state may be distinguished by color alone where it conveys status (FR-013); loading uses a spinner and status text, not color.

## 5. States

| State | Behavior |
| --- | --- |
| Default | Idle, keyboard-focusable, activatable. |
| Hover | Pointer over the control; color/opacity or shadow change from tokens, no layout shift. |
| Focus | `:focus-visible` only; outline visible in both modes and never fully obscured (WCAG 2.4.7, 2.4.11). |
| Active | Pointer/key press; color/opacity or shadow change from tokens. |
| Disabled | Native `disabled`; not focusable; no click/keyboard activation; no custom focus outline. |
| Loading | Effectively disabled; busy state announced exactly once (§6). |

## 6. Loading contract

When `loading` is true:

1. The button MUST NOT invoke `onClick` (and MUST NOT navigate when rendered as an anchor).
2. The rendered element MUST have `aria-busy="true"`.
3. For a native `<button>`, the `disabled` attribute MUST be set.
4. For `asChild` with a non-button element (e.g. `<a>`), the component MUST set `aria-disabled="true"`, `tabIndex={-1}`, and prevent the default activation.
5. A spinner MUST be rendered with `aria-hidden="true"`; its animation MUST stop under `prefers-reduced-motion` (the status text remains).
6. Exactly one persistent `role="status"` element MUST expose `loadingLabel` as text (visually hidden). It MUST be mounted for the whole loading period and MUST NOT be re-created on each render, so screen readers announce it once, not repeatedly.
7. When `loading` becomes false, the status element MUST be removed and the button MUST return to its previous focusability without stealing focus.
8. If `disabled` and `loading` are both true, the control remains inert and the status is still exposed once.

The visually hidden status MUST use a standard screen-reader-only utility; it MUST NOT be styled with arbitrary values.

## 7. Accessibility contract

| Requirement | Contract | WCAG |
| --- | --- | --- |
| Accessible name | Text content names the button. Icon-only usage MUST provide `aria-label` (or `aria-labelledby`); in development, the component SHOULD warn when it has no visible text and neither attribute. | 4.1.2, 2.5.3 |
| Role | Native `<button>` role, or the child's native role when `asChild` (e.g. `link`). | 4.1.2 |
| Keyboard | Tab focuses; Enter and Space activate native buttons; links activate with Enter. No focus trap. | 2.1.1, 2.4.3 |
| Focus visible | Outline at least 3:1 against adjacent colors in both modes, never fully obscured. | 2.4.7, 2.4.11 |
| Target size | At least 24 × 24 CSS px; 44 × 44 recommended for touch-heavy surfaces. | 2.5.8 |
| Contrast | Text 4.5:1, control boundary 3:1, focus indicator 3:1 in both modes. | 1.4.3, 1.4.11 |
| Not color only | State/status also conveyed by text/icon where it carries meaning. | 1.4.1 |
| Motion | Respects reduced motion; no drag-only interaction. | 2.5.7 |
| Zoom/reflow | Usable at 200% zoom and 320 px width. | 1.4.4, 1.4.10 |

Manual evidence is recorded in `packages/ui/src/components/ui/button.a11y.md`.

## 8. Examples (normative shape)

The API identifiers below stay English in both documentation locales; prose and accessible status text may be localized.

```tsx
<Button>Save</Button>
<Button variant="secondary" size="sm">Cancel</Button>
<Button variant="destructive" loading loadingLabel="Deleting">Delete</Button>
<Button variant="outline" asChild>
  <a href="/docs">Read docs</a>
</Button>
<Button size="default" className="size-9" aria-label="Search">
  <SearchIcon aria-hidden="true" />
</Button>
```

Indonesian documentation shows an inline localized variant, e.g. `<Button loading loadingLabel="Memuat">Simpan</Button>`. The shared example files remain the single runnable source for both locales; only prose/snippets are localized.

## 9. Compatibility and versioning

- Public surface: the package name `@legionv4/ui`, named exports, prop names/types, `data-slot`, `data-variant`, `data-size`, and the registry item name `button`.
- Removing or renaming any of these, or changing defaults, is a **breaking change**: it MUST be recorded in `CHANGELOG.md` and released as a major version (Constitution Principle IX; FR-014).
- The copy item MUST record its source version in `button.legion.json` (FR-015).
