# Copy consumer fixture

This fixture proves that the registry copy works outside the monorepo package:

```bash
# From the repository root, with the docs server running:
pnpm --filter copy-consumer dev            # starts on port 3001
node scripts/prepare-copy-fixture.ts       # regenerates the copied component from the built registry
```

Generated files (`components/`, `lib/`, `app/globals.css`) are gitignored. They are recreated from the registry item so the fixture never carries a second editable copy of the component.
