# Tasks: Fondasi Legion v4 dan Button

**Input**: Design documents from `/specs/001-fondasi-button/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/](./contracts/), [quickstart.md](./quickstart.md)

**Tests**: Wajib. Constitution Prinsip VIII dan Prinsip VI mensyaratkan test varian, state, keyboard, aksesibilitas otomatis, dan checklist manual; test ditulis bersamaan dengan implementasi.

**Organization**: Task dikelompokkan per user story. US1 (P1) adalah MVP; US2 dan US3 bergantung pada Button dan artefak dokumentasi dari US1/US2 seperti dicatat di bagian Dependencies.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: boleh paralel (file berbeda, tidak bergantung pada task lain yang belum selesai)
- **[Story]**: US1, US2, US3; tidak dipakai di Setup, Foundational, dan Polish
- Setiap task menyebut path file konkret

## Path Conventions

Monorepo pnpm: `packages/ui/`, `apps/docs/`, `scripts/`, `e2e/`, `fixtures/` di root repo.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Inisialisasi workspace, paket, situs dokumentasi, dan perkakas pemeriksaan.

- [ ] T001 Buat fondasi monorepo di `package.json`, `pnpm-workspace.yaml`, `.npmrc`, `.nvmrc`, dan `.gitignore`: workspace `apps/*`, `packages/*`, `fixtures/*`, Node 24, pnpm 10.
- [ ] T002 [P] Buat `tsconfig.base.json` (strict, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`) serta `packages/ui/tsconfig.json` dan `packages/ui/tsconfig.build.json` untuk emit ESM + deklarasi ke `dist/`.
- [ ] T003 [P] Buat `packages/ui/package.json` untuk `@legionv4/ui` (`private: true`, peer React 19, `exports` `.` dan `./styles.css`, `publishConfig.exports` ke `dist/`).
- [ ] T004 [P] Scaffold `apps/docs` (Next 16 App Router, TypeScript, Tailwind 4, MDX) di `apps/docs/package.json`, `apps/docs/next.config.ts`, `apps/docs/postcss.config.mjs`, `apps/docs/tsconfig.json`, layout root kedua locale, dan `apps/docs/app/globals.css` yang mengimpor `@legionv4/ui/styles.css` serta `@source` ke sumber paket.
- [ ] T005 Tambahkan devDependencies dan skrip root di `package.json`: `build`, `docs:dev`, `check`, `check:tokens`, `check:token-literals`, `check:contrast`, `check:freshness`, `check:docs-parity`, `check:registry`, `check:size`, `test`, `test:e2e`.
- [ ] T006 [P] Konfigurasi Vitest di `vitest.config.ts` (jsdom) dan `packages/ui/test/setup.ts` (Testing Library cleanup, jest-dom matchers).
- [ ] T007 [P] Konfigurasi Playwright di `playwright.config.ts`: webServer `pnpm docs:dev`, proyek light/dark, viewport 320 px dan zoom 200% lewat halaman uji, locale `en`/`id`.
- [ ] T008 [P] Buat `registry.config.json` (base URL `http://localhost:3000`, docs `en`/`id`) dan skeleton `registry.json` berisi item `theme`, `utils`, `button`.
- [ ] T009 [P] Buat skeleton CI di `.github/workflows/ci.yml`: install, build, check, unit, e2e, artifact log.

**Checkpoint**: Workspace dan toolchain siap; belum ada komponen.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Token, manifest kontras, dan checker yang menjadi dasar semua user story. Tidak ada user story yang boleh mulai sebelum phase ini selesai.

- [ ] T010 Implementasikan token di `packages/ui/src/styles/theme.css`: primitive, 19 warna semantic light/dark, `--radius` dua mode, turunan `--radius-*` di `@theme inline`, `@custom-variant dark`, dan pemetaan `--color-*`. Rujukan field: `data-model.md` `Token.name`, `Token.kind`, `Token.valueLight`, `Token.valueDark`, `Token.pair`, `Token.tailwindName`.
- [ ] T011 [P] Buat `packages/ui/src/styles/contrast-pairs.json` sesuai `data-model.md` `ContrastPair.foreground`, `ContrastPair.background`, `ContrastPair.min`, `ContrastPair.kind`, `ContrastPair.stateSurfaceOpacities`.
- [ ] T012 Implementasikan `scripts/check-tokens.ts`: kelengkapan nama baku, nilai light/dark, format `oklch()`/`rem`/`calc`, pemetaan `@theme inline`, dan larangan token di luar daftar. Rujuk `data-model.md` `Token.name` dan `Token.valueLight`/`Token.valueDark`.
- [ ] T013 [P] Implementasikan `scripts/check-token-literals.ts`: AST TypeScript untuk string literal kelas dan parser CSS `postcss`; izinkan `oklch()` hanya di definisi token `styles/theme.css`. Rujuk `data-model.md` §1.2.
- [ ] T014 [P] Implementasikan `scripts/check-contrast.ts` dengan `colorjs.io`: alpha dikompositkan, opasitas state diuji di atas `--background` dan `--card`, ambang per `ContrastPair.min`.
- [ ] T015 [P] Implementasikan `packages/ui/src/lib/utils.ts` berisi `cn()` dari `clsx` + `tailwind-merge`.

**Checkpoint**: Token lolos `check:tokens`, literal bersih, kontras lolos; user story dapat dimulai.

---

## Phase 3: User Story 1 - Button konsisten di kedua mode (Priority: P1) 🎯 MVP

**Goal**: Button lima varian, tiga ukuran, enam state; tampil benar di light/dark; paket dan salinan berasal dari sumber yang sama.

**Independent Test**: Render 5 varian × 3 ukuran di light/dark, uji Tab/Enter/Space, disabled, loading, lalu bandingkan salinan registry dengan paket pada fixture.

### Tests for User Story 1

- [ ] T016 [P] [US1] Tulis test matriks varian dan ukuran di `packages/ui/test/button.test.tsx`; assert kelas token, `data-variant`, `data-size`, dan tidak ada literal. Rujuk `contracts/button-api.md` §3–§4 dan `data-model.md` `Button.variant`/`Button.size`.
- [ ] T017 [P] [US1] Tulis test state, `asChild`, keyboard, dan loading di `packages/ui/test/button.states.test.tsx`; assert `aria-busy`, status diumumkan sekali, dan tidak ada aksi saat loading. Rujuk `contracts/button-api.md` §5–§7 dan `data-model.md` `Button.state`.
- [ ] T018 [US1] Tulis `e2e/button.a11y.spec.ts`: axe di light/dark, fokus tidak tertutup, target ≥24 px, zoom 200%, lebar 320 px, `prefers-reduced-motion`. Bergantung pada T019.
- [ ] T019 [P] [US1] Buat harness `apps/docs/app/(en)/preview/button/page.tsx` yang merender semua varian, ukuran, state, mode, dan contoh ikon untuk e2e.
- [ ] T020 [US1] Tulis `e2e/button.parity.spec.ts` yang merender Button paket dan Button salinan di fixture, lalu membandingkan markup, atribut, dan perilaku. Bergantung pada T028 dan T030.

### Implementation for User Story 1

- [ ] T021 [US1] Implementasikan `packages/ui/src/components/ui/button.tsx`: CVA lima varian/tiga ukuran, token-only classes, `asChild` via Radix Slot, state loading, `data-slot`, `data-variant`, `data-size`. Rujuk `data-model.md` `Button.variant`, `Button.size`, `Button.state`.
- [ ] T022 [US1] Lengkapi JSDoc satu kalimat untuk setiap props dan ekspor `Button`, `buttonVariants`, `ButtonProps`, `ButtonVariant`, `ButtonSize` dari `packages/ui/src/index.ts`. Rujuk `data-model.md` `Prop.name`, `Prop.type`, `Prop.required`, `Prop.defaultValue`.
- [ ] T023 [P] [US1] Buat `packages/ui/src/components/ui/button.a11y.md` (Inggris) dengan butir WCAG dan field `A11yChecklist.criterion`, `A11yChecklist.method`, `A11yChecklist.result`, `A11yChecklist.evidence`, `A11yChecklist.reviewer`.
- [ ] T024 [US1] Selesaikan build paket: `tsc` menghasilkan `packages/ui/dist/components/ui/button.js` + `.d.ts`, salin `styles.css` ke `dist/`, dan verifikasi import relatif `../../lib/utils` tanpa alias `@/`.
- [ ] T025 [P] [US1] Implementasikan `scripts/check-size.ts` dengan `zlib.gzipSync` untuk budget 4 kB pada `dist/components/ui/button.js`.
- [ ] T026 [US1] Implementasikan item `theme` di `scripts/build-registry.ts` dan `registry.json`: bangkitkan `cssVars.light`, `cssVars.dark`, `cssVars.theme` dari `theme.css`; rujuk `data-model.md` `ThemeItem.cssVars`.
- [ ] T027 [P] [US1] Implementasikan item `utils` (`registry:lib`, `@lib/utils.ts`) di `registry.json` dari `packages/ui/src/lib/utils.ts`.
- [ ] T028 [US1] Implementasikan item `button` + stempel versi: jalankan `shadcn build`, tambah `meta.legion`, sidecar `@ui/button.legion.json`, dan `registryDependencies` theme/utils. Rujuk `data-model.md` `RegistryItem.name`, `RegistryItem.type`, `RegistryItem.files`, `RegistryItem.meta.legion`, `RegistryFile.path`, `RegistryFile.type`, `RegistryFile.target`, `RegistryFile.content`, `Sidecar.item`, `Sidecar.version`, `Sidecar.source`, `Sidecar.documentation`.
- [ ] T029 [US1] Implementasikan `scripts/check-registry.ts`: identitas byte file kode = sumber, versi item = `packages/ui/package.json`, sidecar punya `version` dan URL `documentation` en/id, dependensi metadata = impor. Rujuk `data-model.md` `Sidecar.version`.
- [ ] T030 [US1] Buat fixture `fixtures/copy-consumer/` (Next/Vite + Tailwind 4 + `components.json`) yang memasang `http://localhost:3000/r/button.json`; pastikan `button.legion.json` tertulis.
- [ ] T031 [US1] Jalankan `pnpm build`, `pnpm test`, `pnpm test:e2e` untuk US1 dan perbaiki sampai `packages/ui/dist/`, `apps/docs/public/r/button.json`, serta `e2e/button.parity.spec.ts` hijau.

**Checkpoint**: US1 selesai dan dapat didemokan sebagai MVP; US2 dapat mulai.

---

## Phase 4: User Story 2 - Dokumentasi tujuh bagian dua bahasa (Priority: P2)

**Goal**: Halaman Inggris dan Indonesia dengan tujuh bagian wajib, mode, contoh, props terlokalisasi, dan penampil source.

**Independent Test**: Buka kedua rute; verifikasi tujuh bagian, pengalih bahasa/mode, `<html lang>`, dan deskripsi props sesuai bahasa.

### Tests for User Story 2

- [ ] T032 [P] [US2] Tulis `e2e/docs.locales.spec.ts`: tujuh bagian di `/docs/components/button` dan `/id/docs/components/button`, `lang`, `hreflang`, pengalih bahasa yang mempertahankan mode.
- [ ] T033 [P] [US2] Tulis `e2e/docs.a11y.spec.ts`: axe di kedua locale × light/dark untuk halaman dokumentasi dan pratinjau.

### Implementation for User Story 2

- [ ] T034 [US2] Implementasikan `apps/docs/i18n.ts`: locale `en`/`id`, label tujuh bagian, tombol pasang, pengalih mode/bahasa, dan helper route.
- [ ] T035 [US2] Implementasikan `apps/docs/components/component-docs-page.tsx` beserta preview, props table, dependencies, a11y notes, language/mode switches, dan source viewer yang membaca `packages/ui/src/components/ui/button.tsx`. Rujuk `data-model.md` `DocsPage.sections`, `DocsPage.propsTable`, `DocsPage.dependencies`, `DocsPage.a11yNotes`.
- [ ] T036 [US2] Implementasikan route group `apps/docs/app/(en)/layout.tsx`, `apps/docs/app/(id)/layout.tsx`, `apps/docs/app/(en)/docs/components/[slug]/page.tsx`, dan `apps/docs/app/(id)/id/docs/components/[slug]/page.tsx` dengan `<html lang>` per locale. Rujuk `data-model.md` `DocsPage.locales`.
- [ ] T037 [P] [US2] Tulis prosa Inggris `apps/docs/content/components/button.en.md` (tujuh bagian).
- [ ] T038 [P] [US2] Tulis prosa Indonesia `apps/docs/content/components/button.id.md` (tujuh bagian).
- [ ] T039 [P] [US2] Buat overlay terjemahan `apps/docs/content/components/button.props.id.json` untuk semua props publik.
- [ ] T040 [P] [US2] Buat contoh `apps/docs/examples/button/*.tsx` (varian, ukuran, disabled, loading, ikon, asChild) yang dipakai kedua locale.
- [ ] T041 [US2] Implementasikan `scripts/generate-docs.ts`: metadata `apps/docs/generated/metadata/button.json` (`ComponentMetadata.*`, `Prop.descriptions.en/id`, `DocsPage.locales`) dan halaman `.md` Inggris/Indonesia di `apps/docs/public/docs/components/button.md` dan `apps/docs/public/id/docs/components/button.md`.
- [ ] T042 [US2] Implementasikan `scripts/check-docs-parity.ts`: tujuh bagian di kedua locale, deskripsi props en/id lengkap, route/URL `.md` konsisten, dan schema metadata valid.
- [ ] T043 [US2] Hubungkan `DocsPage.languageSwitch`, `DocsPage.modeCoverage`, dan `<link rel="alternate" hreflang>` di `apps/docs/components/component-docs-page.tsx` serta layout `apps/docs/app/(en)/layout.tsx` dan `apps/docs/app/(id)/layout.tsx`, termasuk mempertahankan mode saat berpindah bahasa.
- [ ] T044 [US2] Jalankan `pnpm check:docs-parity`, `pnpm check:freshness`, dan docs e2e; perbaiki `apps/docs/public/docs/components/button.md`, `apps/docs/public/id/docs/components/button.md`, dan `apps/docs/generated/metadata/button.json` sampai kedua halaman lolos.

**Checkpoint**: US2 selesai; dokumentasi dua bahasa lengkap dan dapat dipakai konsumen.

---

## Phase 5: User Story 3 - Agen AI memakai Legion tanpa menebak (Priority: P3)

**Goal**: Indeks teks dan metadata yang membuat agen menemukan Button, props, dependensi, dan contoh tanpa membaca repo.

**Independent Test**: Jalankan tiga tugas baku pada agen tanpa konteks repo; minimal 2/3 selesai tanpa pertanyaan.

### Tests for User Story 3

- [ ] T045 [P] [US3] Tulis `evals/ai-baseline/tasks.md` berisi tiga tugas baku, rubrik biner (selesai tanpa pertanyaan + sesuai dokumentasi), dan format hasil di `evals/ai-baseline/results/`.
- [ ] T046 [P] [US3] Tulis `e2e/docs.llms.spec.ts`: semua tautan `/llms.txt` dapat diakses, mencakup kedua bahasa, dan metadata props/dependensi cocok dengan ekspor komponen.

### Implementation for User Story 3

- [ ] T047 [US3] Tulis `AGENTS.md` di root: perintah build/check/test, struktur repo, aturan token, cara menambah komponen, dan tautan ke plan/spec.
- [ ] T048 [US3] Implementasikan generator `llms.txt` di `scripts/generate-docs.ts` dan route `apps/docs/app/(en)/llms.txt/route.ts` dengan bagian `## Components (English)` dan `## Komponen (Bahasa Indonesia)`; rujuk `data-model.md` §7.
- [ ] T049 [US3] Jalankan tiga tugas AI baseline dengan agen tanpa konteks repo, simpan transkrip/skor di `evals/ai-baseline/results/`, dan perbaiki `llms.txt`/`apps/docs/content/components/button.en.md`/`button.id.md` bila lulus < 2/3.

**Checkpoint**: US3 selesai; agen dapat memakai Button dari indeks dan metadata.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T050 [P] Tambahkan Changesets (`.changeset/config.json`), `CHANGELOG.md` awal, dan catatan breaking-change untuk permukaan publik (FR-014).
- [ ] T051 [P] Finalisasi `.github/workflows/ci.yml`: cache pnpm, jalankan `pnpm build && pnpm check && pnpm test && pnpm test:e2e`, unggah log/artifact kegagalan.
- [ ] T052 Jalankan validasi `quickstart.md` dari nol (paket dan salinan) termasuk uji pemakaian 5 peserta, lalu catat bukti di `specs/001-fondasi-button/validation.md`.
- [ ] T053 Verifikasi performance goals: budget gzip `packages/ui/dist/components/ui/button.js` (T025) dan first-load JS kedua halaman dokumentasi dari keluaran `apps/docs/.next/`.
- [ ] T054 Lakukan sweep akhir di `packages/ui/`, `apps/docs/`, dan `scripts/`: `pnpm build`, `pnpm check`, `pnpm test`, `pnpm test:e2e`, jalankan checklist manual `packages/ui/src/components/ui/button.a11y.md` untuk kedua locale, validasi `contracts/component-metadata.schema.json`, nol tautan rusak, dan tidak ada artefak generate yang kotor.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: T001 dulu; T002–T004 dan T006–T009 setelah T001; T005 setelah T001.
- **Foundational (Phase 2)**: setelah Setup; T010 dulu, lalu T011/T012/T014; T013 dan T015 paralel.
- **US1 (Phase 3)**: setelah Foundational. T016–T020 (test) sebelum T021; T026/T027 setelah T010/T015; T028 setelah T021/T026/T027; T029 setelah T028; T030 setelah T028; T031 terakhir.
- **US2 (Phase 4)**: setelah US1 (butuh Button, registry, docs shell). T034–T036 sebelum T043; T037–T040 paralel; T041 setelah T037–T040; T042 setelah T041; T044 terakhir.
- **US3 (Phase 5)**: setelah US2 (butuh metadata, docs, `llms.txt`). T045/T046 bisa ditulis lebih awal; T048 setelah T041; T049 setelah T048.
- **Polish (Phase 6)**: setelah US1–US3.

### User Story Dependencies

- **US1 (P1)**: independen setelah Foundational; MVP.
- **US2 (P2)**: bergantung pada Button dan registry US1; tidak bisa diuji tanpa komponen.
- **US3 (P3)**: bergantung pada metadata dan halaman dokumentasi US2.

### Within Each User Story

- Test ditulis lebih dulu dan harus gagal sebelum implementasi.
- Implementasi komponen/token sebelum integrasi registry/docs.
- Jalankan check lokal setelah setiap grup logis; jangan menunda sampai akhir.

### Parallel Opportunities

- Setup: T002, T003, T004, T006, T007, T008, T009.
- Foundational: T011, T013, T014, T015.
- US1: T016/T017; T019/T023/T025/T027.
- US2: T032/T033; T037/T038/T039/T040.
- US3: T045/T046.
- Polish: T050/T051.

---

## Parallel Example: User Story 1

```text
Task: "T016 [P] [US1] Tulis test matriks varian dan ukuran di packages/ui/test/button.test.tsx"
Task: "T017 [P] [US1] Tulis test state, asChild, keyboard, loading di packages/ui/test/button.states.test.tsx"
Task: "T019 [P] [US1] Buat harness apps/docs/app/(en)/preview/button/page.tsx"
Task: "T023 [P] [US1] Buat packages/ui/src/components/ui/button.a11y.md"
```

---

## Parallel Example: User Story 2

```text
Task: "T037 [P] [US2] Tulis prosa Inggris apps/docs/content/components/button.en.md"
Task: "T038 [P] [US2] Tulis prosa Indonesia apps/docs/content/components/button.id.md"
Task: "T039 [P] [US2] Buat overlay apps/docs/content/components/button.props.id.json"
Task: "T040 [P] [US2] Buat contoh apps/docs/examples/button/*.tsx"
```

---

## Data-Model Coverage

Setiap field terbatas di `data-model.md` dipetakan ke task yang mengimplementasikan atau memvalidasinya.

| Field | Task |
| --- | --- |
| `Token.name`, `Token.kind`, `Token.valueLight`, `Token.valueDark`, `Token.pair`, `Token.tailwindName` | T010, T012 |
| `ContrastPair.foreground`, `ContrastPair.background`, `ContrastPair.min`, `ContrastPair.kind`, `ContrastPair.stateSurfaceOpacities` | T011, T014 |
| `Button.variant`, `Button.size`, `Button.state` | T016, T017, T021 |
| `Prop.name`, `Prop.type`, `Prop.required`, `Prop.defaultValue` | T022 |
| `Prop.descriptions` | T022, T039, T041 |
| `ThemeItem.cssVars` | T026 |
| `RegistryItem.name`, `RegistryItem.type`, `RegistryItem.title`, `RegistryItem.description`, `RegistryItem.dependencies`, `RegistryItem.registryDependencies`, `RegistryItem.files`, `RegistryItem.cssVars`, `RegistryItem.meta.legion` | T028 |
| `RegistryFile.path`, `RegistryFile.type`, `RegistryFile.target`, `RegistryFile.content` | T028 |
| `Sidecar.item`, `Sidecar.version`, `Sidecar.source`, `Sidecar.documentation` | T028, T029 |
| `ComponentMetadata.schemaVersion`, `.name`, `.title`, `.description`, `.version`, `.type`, `.files`, `.dependencies`, `.registryDependencies`, `.variants`, `.sizes`, `.props`, `.examples`, `.a11y`, `.docs` | T041, T042 |
| `ComponentMetadata.a11y` (standard, criteria, checklistPath, manualStatus) | T023, T041 |
| `DocsPage.defaultLocale`, `DocsPage.locales` | T036, T041 |
| `DocsPage.title` | T035 |
| `DocsPage.sections`, `DocsPage.propsTable`, `DocsPage.dependencies`, `DocsPage.a11yNotes` | T035, T042 |
| `DocsPage.examples` | T040 |
| `DocsPage.languageSwitch`, `DocsPage.modeCoverage` | T043 |
| `A11yChecklist.criterion`, `.method`, `.result`, `.evidence`, `.reviewer` | T023 |
| Artefak AI (`llms.txt`, halaman `.md`) | T041, T048 |

---

## Implementation Strategy

### MVP First (User Story 1)

1. Selesaikan Phase 1 dan Phase 2.
2. Selesaikan US1 (T016–T031) dan hentikan untuk validasi: 5 varian × 3 ukuran × 6 state, token, kontras, keyboard, axe, salinan = paket.
3. Demo/gunakan Button sebagai fondasi.

### Incremental Delivery

1. US1 → validasi mandiri → MVP.
2. US2 → dokumentasi dua bahasa → validasi dengan quickstart.
3. US3 → indeks AI → jalankan baseline 2/3.
4. Polish → CI, changelog, performance, bukti Converge.

---

## Notes

- `[P]` berarti file berbeda dan tidak menunggu task lain yang belum selesai.
- Test wajib mengikuti kontrak `contracts/button-api.md` dan skema `contracts/component-metadata.schema.json`.
- Jangan menambah token semantic/komponen di luar daftar baku; pelanggaran hanya lewat Complexity Tracking di plan.
- Jangan menyalin kode komponen ke docs/registry; semua memakai `packages/ui/src/components/ui/button.tsx`.
- `tasks.md` ini siap dieksekusi; setiap task punya path dan kriteria yang dapat diverifikasi.
