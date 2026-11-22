# Legion v4 repository guide

Legion v4 is a token-driven React design system. This repository is also the Spec-Driven Development workspace for the project.

## Commands

| Command | Purpose |
| --- | --- |
| `pnpm install` | Install the workspace |
| `pnpm build` | Build `@legionv4/ui`, regenerate docs/registry, build the docs site |
| `pnpm docs:dev` | Regenerate artifacts and run the docs site on port 3000 |
| `pnpm check` | Token, literal, contrast, docs-parity, freshness, registry, and size gates |
| `pnpm test` | Vitest unit and registry-copy parity tests |
| `pnpm test:e2e` | Playwright accessibility, locale, mode, zoom, and registry tests |
| `pnpm --filter @legionv4/ui build` | Emit `packages/ui/dist` with declarations |

CI runs `pnpm build && pnpm check && pnpm test && pnpm test:e2e`.

## Rules

- Read `.specify/memory/constitution.md` before changing component or token code. Principles I, II, and VI are non-negotiable.
- Components live only in `packages/ui/src/components/ui/`. Never add a second copy for docs or fixtures; generated copy fixtures are gitignored.
- Tokens are defined once in `packages/ui/src/styles/theme.css`; every semantic color and the base radius need light and dark values.
- Use semantic Tailwind utilities (`bg-primary`, `text-primary-foreground`, `border-input`, `outline-ring`). Do not add hex/rgb/hsl/oklch literals or arbitrary visual values to component code.
- Every public prop needs a one-sentence JSDoc description and an Indonesian translation in the component's `.props.id.json`.
- Documentation has English and Indonesian prose, generated metadata, generated `.md` pages, and a single bilingual `llms.txt`. Run `pnpm check:freshness` after changing source or prose.
- Add a Changeset for changes to the package exports or registry item names.

## Adding a component

1. Add the implementation under `packages/ui/src/components/ui/`.
2. Add the English and Indonesian prose files and the props translation overlay under `apps/docs/content/components/`.
3. Add examples under `apps/docs/examples/<component>/`.
4. Extend `scripts/generate-docs.ts`, `registry.json`, and the docs route.
5. Add unit, axe, locale, and registry-parity coverage; run the full command set above.

Design documents live in `specs/001-fondasi-button/`.
