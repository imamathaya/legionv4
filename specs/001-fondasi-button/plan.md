# Implementation Plan: Fondasi Legion v4 dan Button

**Branch**: `001-fondasi-button` | **Date**: 2026-11-22 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-fondasi-button/spec.md`

## Summary

Membangun fondasi Legion v4 sebagai monorepo pnpm: paket komponen React 19 + TypeScript ketat dengan token semantic tiga lapis (primitive → semantic → Tailwind `@theme inline`), satu komponen referensi Button (5 varian × 3 ukuran × 6 state), situs dokumentasi Next.js yang menyajikan tujuh bagian wajib, registry kompatibel shadcn yang menghasilkan paket dan item salin dari sumber yang sama, serta pemeriksaan otomatis (literal warna, kelengkapan token, kontras, kesegaran dokumen, aksesibilitas) yang menjadi gate CI.

Pendekatan teknis: token ditulis sekali di `packages/ui/src/styles/theme.css`; Button memakai CVA sebagai satu-satunya pola varian; dokumentasi dan metadata dibangkitkan dari kode + dokumen Markdown; registry dibangun dengan `shadcn build` lalu distempel versi; seluruh pemeriksaan dijalankan lewat skrip Node di root repo.

## Technical Context

**Language/Version**: TypeScript 5.9.x (`strict: true`, `noUncheckedIndexedAccess`), React 19.3.1, Node.js 24.15+ (tooling), pnpm 10

**Primary Dependencies**:
- Runtime paket: `react` 19.3.1 (peer), `react-dom` 19.3.1 (peer), `class-variance-authority` 0.7.1, `@radix-ui/react-slot` 1.5.0, `lucide-react` 1.77.0, `clsx` 2.1.1, `tailwind-merge` 3.7.1
- Styling: `tailwindcss` 4.3.5 + `@tailwindcss/postcss`
- Dokumentasi: `next` 16.4.6 (App Router), `@next/mdx` 16.4.6, `next-themes` 0.4.6, `shiki` (versi dikunci saat implementasi)
- Registry: `shadcn` 4.23.0 (`shadcn build`, `shadcn/schema`)
- Pemeriksaan: `colorjs.io` 0.7.1 (kontras WCAG + parsing OKLCH), `postcss` 8.5.33 (parsing CSS), `react-docgen-typescript` 2.4.0 (props dari tipe + JSDoc), `ajv` 8.20.0 (validasi JSON Schema)

**Storage**: Tidak ada basis data. Artefak statis: JSON registry, metadata komponen, `llms.txt`, halaman `.md` per komponen.

**Testing**: `vitest` 5.1.1 + `@testing-library/react` 16.3.3 + `@testing-library/user-event` + `jsdom` 31.0.1 untuk unit/komponen; `@playwright/test` 1.65.1 + `@axe-core/playwright` 4.14.0 untuk aksesibilitas, mode, keyboard, zoom, dan paritas salin vs paket.

**Target Platform**: Web evergreen — Safari 16.4+, Chrome 111+, Firefox 128+ (batas Tailwind CSS 4). Tidak ada dukungan IE/legacy. Alat build dan CI di Linux dengan Node 24.

**Project Type**: Monorepo library + situs dokumentasi (`apps/docs`, `packages/ui`, skrip di root).

**Performance Goals**:
- Modul Button hasil build ≤ 4 kB min+gzip, di luar React, Radix, dan CVA (diukur dengan `zlib.gzipSync` pada `dist/components/ui/button.js`).
- First-load JS halaman `/docs/components/button` ≤ 150 kB gzip (dibaca dari keluaran `next build`).
- Tidak ada perhitungan warna atau CSS saat runtime; seluruh token adalah CSS statis.
- Tidak ada request jaringan saat halaman dokumentasi dirender (semua data dibangkitkan saat build).

**Constraints**:
- WCAG 2.2 Level AA adalah batas bawah dan gate merge (kontras 4,5:1 teks; 3:1 batas kontrol dan fokus; target 24 × 24 px).
- Nol literal warna dan nol nilai arbitrer di kode komponen (Prinsip I).
- Setiap token semantic wajib punya nilai light dan dark (Prinsip II).
- Paket tetap privat; nama final ditunda. Placeholder: `@legion/ui` dengan `"private": true`.
- Dokumentasi komponen berbahasa Inggris; constitution, spec, plan, dan komentar proses berbahasa Indonesia.
- Tidak ada runtime CSS-in-JS, tidak ada dependensi baru tanpa alasan tertulis.
- Mode gelap hanya diubah lewat satu mekanisme di level root (`next-themes` → kelas `.dark` pada `<html>`).

**Scale/Scope**:
- 19 token warna semantic (8 pasangan permukaan–teks + `border`, `input`, `ring`) + 1 radius dasar dengan 7 turunan.
- 1 komponen (Button): 5 varian, 3 ukuran, 6 state, 1 halaman dokumentasi, 3 item registry (`theme`, `utils`, `button`).
- Pilot 10 komponen; 9 komponen lain di fitur 002–004, di luar cakupan ini.

## Constitution Check

*GATE: wajib lulus sebelum Phase 0 research; diperiksa ulang setelah Phase 1 design.*

### Gerbang I–IX

| Prinsip | Status | Bukti di plan |
| --- | --- | --- |
| **I. Semantic Tokens First (NON-NEGOTIABLE)** | LULUS | Token tiga lapis di `packages/ui/src/styles/theme.css`: primitive `--color-*` bergaya palet Tailwind, semantic 19 warna + radius, pemetaan `@theme inline`. Tidak ada token komponen. Larangan literal/arbitrer ditegakkan `check:token-literals` (AST TypeScript + parser CSS) dan `check:tokens` (kelengkapan, format `oklch()`/`rem`/`calc`). |
| **II. Light dan Dark Setara** | LULUS | Setiap token warna dan radius dasar (`--radius`) punya nilai di `:root` dan `.dark`; `check:tokens` menggagalkan build bila salah satu mode tidak lengkap. Turunan `--radius-*` adalah formula mode-invariant di `@theme inline` yang mengikuti `--radius` tiap mode. Satu mekanisme: `@custom-variant dark (&:is(.dark *))`, kelas `.dark` di `<html>` lewat `next-themes`. Dokumentasi menyediakan pengalih mode. |
| **III. Mudah Dibaca dan Dipakai AI** | LULUS | `AGENTS.md` di root; `llms.txt` dan halaman `.md` per komponen dibangkitkan; metadata mesin dari `react-docgen-typescript`; JSDoc wajib per prop; `check:freshness` (`generate && git diff --exit-code`) menjaga kesegaran. Uji tugas AI (SC-007) dijalankan pada tahap Converge dengan bahan `evals/ai-baseline/tasks.md`. |
| **IV. Satu Sumber Kode, Dua Cara Pakai** | LULUS | Komponen hidup hanya di `packages/ui/src/components/ui/button.tsx`; paket dibangun dari file itu, item registry menyematkan isi byte-identik dari file yang sama. `check:registry` membandingkan isi item registry dengan sumber; tidak ada salinan komponen kedua. |
| **V. Komposisi, Bukan Konfigurasi** | LULUS | API: `variant`, `size`, `asChild`, `loading`, `loadingLabel`, `className`, atribut native. Tidak ada prop `xxxClassName`/`xxxStyle`. Kustomisasi lewat `className`, `asChild`, dan `data-slot="button"`. `loadingLabel` adalah prop konten aksesibilitas (bukan prop per bagian) dan dijustifikasi di kontrak. |
| **VI. Aksesibel Secara Default, WCAG 2.2 AA (NON-NEGOTIABLE)** | LULUS | Fokus `focus-visible` dengan `outline-ring` + offset; target minimal 24 × 24 px; `aria-busy` + status teks untuk loading; nama aksesibel wajib untuk button ikon; gerakan menghormati `motion-reduce`; bukti otomatis (axe + `check:contrast`) dan manual (`button.a11y.md`). |
| **VII. Dokumentasi Adalah Bagian dari Selesai** | LULUS | Halaman `/docs/components/button` memuat tujuh bagian wajib plus penampil kode sumber; pratinjau memakai komponen asli. |
| **VIII. Diuji Berdampingan** | LULUS | Test ditulis bersama komponen: Vitest untuk varian/ukuran/state/asChild/keyboard, Playwright untuk aksesibilitas, mode, zoom, dan paritas salin vs paket. |
| **IX. Sederhana dan Berversi** | LULUS | Satu pola varian (CVA), tanpa bundler tambahan (build paket dengan `tsc`), tanpa state global. Changesets mengelola `CHANGELOG.md` dan semver; versi disematkan ke item registry. |

### Gerbang Standar Teknis

| Standar | Status | Bukti |
| --- | --- | --- |
| React 19 + TypeScript ketat | LULUS | `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`; tipe props diekspor. |
| Tailwind CSS dengan token CSS | LULUS | Tailwind 4.3.5; tidak ada SCSS Modules; token via `@theme inline`. |
| Satu pola varian di semua komponen | LULUS | CVA ditetapkan di fitur ini dan menjadi pola wajib fitur 002–004. |
| Primitive aksesibel untuk perilaku kompleks | LULUS | Button tidak butuh primitive perilaku kompleks; `asChild` memakai Radix Slot. |
| WCAG 2.2 AA batas bawah | LULUS | Lihat Prinsip VI. |
| Pilot 10 komponen | LULUS | Fitur ini fondasi + Button; 9 komponen lain di 002–004. |
| Figma di luar cakupan | LULUS | Tidak ada artefak Figma. |

### Gerbang Pasca-Desain (Phase 1)

Setelah `research.md`, `data-model.md`, `contracts/`, dan `quickstart.md` ditulis, pemeriksaan diulang: tidak ada keputusan desain yang memperkenalkan token komponen, kode mode khusus, prop konfigurasi per bagian, atau salinan kode kedua. Hasil: **lulus tanpa penyimpangan**.

### Complexity Tracking

Tidak ada pelanggaran constitution. Tidak ada token komponen, tidak ada abstraksi tambahan yang membutuhkan justifikasi. Tiga keputusan yang menambah permukaan (sidecar versi item salin, halaman `.md` terpisah, dan skrip pemeriksaan sendiri) bukan penyimpangan prinsip; alasannya ada di `research.md` dan `data-model.md`.

## Project Structure

### Documentation (this feature)

```text
specs/001-fondasi-button/
├── plan.md              # File ini
├── research.md          # Keputusan teknis (Phase 0)
├── data-model.md        # Bentuk token, komponen, registry, dokumentasi (Phase 1)
├── quickstart.md        # Langkah validasi (Phase 1)
├── contracts/
│   ├── button-api.md                 # Kontrak API Button
│   └── component-metadata.schema.json # Skema metadata komponen
├── checklists/requirements.md        # Sudah ada, tidak diubah
└── tasks.md             # Belum dibuat; menunggu review manusia
```

### Source Code (repository root)

```text
apps/
└── docs/                            # Situs dokumentasi Next.js 16 (App Router)
    ├── app/
    │   ├── docs/components/[slug]/page.tsx   # Halaman komponen
    │   ├── llms.txt/route.ts                 # Menyajikan llms.txt hasil generate
    │   └── layout.tsx                        # ThemeProvider + .dark di <html>
    ├── components/                  # Kerangka docs: preview, props table, mode toggle
    ├── content/components/button.md # Prosa dokumentasi (Inggris), satu sumber
    ├── examples/button/*.tsx        # Contoh yang dirender dan ditampilkan
    ├── generated/                   # Metadata hasil generate (di-commit)
    ├── public/r/*.json              # Registry hasil generate (di-commit)
    └── next.config.ts               # transpilePackages, MDX
packages/
└── ui/
    ├── src/
    │   ├── components/ui/button.tsx       # Satu-satunya sumber komponen
    │   ├── components/ui/button.a11y.md   # Daftar periksa manual
    │   ├── lib/utils.ts                   # cn()
    │   ├── styles/theme.css               # Token light/dark + @theme inline
    │   └── index.ts                       # Export publik
    ├── test/                             # Vitest + setup jsdom
    ├── package.json                      # @legion/ui (private)
    └── tsconfig.build.json               # Emit ESM + .d.ts ke dist/
registry.json                          # Manifest item (theme, utils, button)
scripts/
├── build-registry.ts                  # shadcn build + stempel versi + sidecar
├── generate-docs.ts                   # llms.txt, metadata, halaman .md
├── check-tokens.ts                    # Kelengkapan token + format nilai
├── check-token-literals.ts            # AST scan literal/arbitrer
├── check-contrast.ts                  # colorjs.io + pasangan kontras
├── check-registry.ts                  # Identitas, versi, paritas
└── check-size.ts                      # Budget gzip
e2e/                                   # Playwright: a11y, mode, zoom, paritas
evals/ai-baseline/tasks.md             # Tiga tugas baku AI (SC-007)
registry.config.json                   # Base URL registry + konfigurasi generate
AGENTS.md                              # Panduan agen di repo
llms.txt                               # Indeks teks hasil generate
```

**Structure Decision**: Monorepo pnpm dua workspace (`apps/docs`, `packages/ui`) tanpa orchestrator tambahan; skrip pemeriksaan di root memakai `node --experimental-strip-types`. Paket `@legion/ui` mengekspor sumber untuk workspace dan `dist/` untuk distribusi (`publishConfig.exports`). Situs dokumentasi mengimpor sumber yang sama lewat `transpilePackages`, sehingga pratinjau tidak pernah memakai salinan kode. Registry berada di root karena `shadcn build` membaca `registry.json` dan path file relatif terhadapnya.

## Phase 0: Research — Keputusan

Ringkasan; rincian dan alternatif di [research.md](./research.md).

| Keputusan | Pilihan |
| --- | --- |
| Kerangka dokumentasi | Next.js 16 App Router + MDX + Tailwind 4, `next-themes`, Shiki server-side |
| Pola varian | CVA sebagai satu-satunya pola |
| Test runner | Vitest + Testing Library (unit), Playwright + axe (browser) |
| Pemeriksaan kontras | `colorjs.io` + manifest pasangan kontras; alpha dikompositkan ke latar |
| Pemeriksaan aksesibilitas | `@axe-core/playwright` di light/dark + daftar periksa manual per komponen |
| Build/distribusi registry | `shadcn build` + post-stempel (`meta.legion`, sidecar versi), validasi `shadcn/schema` |
| Build paket | `tsc` (ESM + `.d.ts`), tanpa bundler |
| Sumber metadata | `react-docgen-typescript` + JSDoc; prosa Markdown per komponen |
| Versi | Changesets; versi paket disuntik ke registry dan sidecar |
| CI | GitHub Actions: seluruh check + unit + e2e sebagai gate merge |

## Phase 1: Design

### Token dan theme

- `theme.css` memuat: `@import "tailwindcss"`, `@custom-variant dark`, blok `:root`, blok `.dark`, dan `@theme inline` untuk pemetaan `--color-*` serta turunan radius shadcn v4 (`calc(var(--radius) * n)`). Paket mengekspornya sebagai `@legion/ui/styles.css` (`exports: { "./styles.css": "./src/styles/theme.css" }`), dan build menyalinnya ke `dist/styles.css` untuk distribusi.
- 19 token warna semantic dari daftar baku constitution; nilai `oklch()`, alpha diizinkan; primitive dinamai menurut warna.
- Radius dasar `--radius` dideklarasikan di kedua mode (nilai sama); turunan `--radius-sm` sampai `--radius-4xl` didefinisikan sekali di `@theme inline` dan mengikuti nilai dasar tiap mode.
- `--destructive-foreground` memakai nilai constitution: light `oklch(0.985 0 0)`, dark `oklch(0.205 0 0)`.
- Pasangan kontras didefinisikan di `packages/ui/src/styles/contrast-pairs.json`; checker mengompositkan alpha ke latar pasangan sebelum menghitung rasio.
- Baseline light/dark: token permukaan mengikuti palet netral; nilai final ditetapkan saat implementasi dan wajib lolos checker. Nilai awal yang dipakai sebagai target: `--background` light `oklch(1 0 0)`, dark `oklch(0.145 0 0)`; `--foreground` light `oklch(0.145 0 0)`, dark `oklch(0.985 0 0)`.

### Button

- Satu file: `packages/ui/src/components/ui/button.tsx`, memakai CVA untuk `variant` dan `size`, `cn()` untuk merge `className`, `Slot` untuk `asChild`.
- Import antar-file paket memakai path relatif (mis. `../../lib/utils`), bukan alias `@/`, agar sumber yang sama resolve baik di paket hasil `tsc` maupun di proyek konsumen setelah item salin dipasang pada pasangan direktori `components/ui` + `lib`.
- `variant`: `default`, `secondary`, `destructive`, `outline`, `ghost`; `size`: `sm`, `default` (sedang), `lg`.
- State visual: default, hover, focus-visible, active, disabled, loading. `loading` menonaktifkan interaksi, memasang `aria-busy="true"`, spinner `aria-hidden`, dan satu status teks (`loadingLabel`, default `"Loading"`) yang diumumkan sekali.
- `data-slot="button"`, `data-variant`, `data-size` untuk pengujian dan styling turunan.
- Semua kelas visual memakai token (`bg-primary`, `text-primary-foreground`, `border-input`, `outline-ring`, `rounded-md`, `motion-reduce:animate-none`); tidak ada bracket dan tidak ada `text-white`.
- Perubahan permukaan saat hover/active memakai alpha dari token (mis. `bg-primary/90`); pasangan kontras state tersebut ikut diperiksa sebagai komposit terhadap latar, sehingga rasio tetap ≥ 4,5:1 di kedua mode. Varian `destructive` memakai penekanan bayangan, bukan peredupan permukaan, karena `--destructive-foreground` constitution tepat 4,56:1 di light.
- Kontrak lengkap: [contracts/button-api.md](./contracts/button-api.md).

### Dokumentasi

- Halaman `/docs/components/button`: pratinjau semua varian/ukuran/state di light dan dark, cara pasang paket, cara pasang salin, contoh kode, tabel props, dependensi, catatan aksesibilitas, dan penampil kode sumber.
- Prosa berbahasa Inggris di `apps/docs/content/components/button.md`; contoh di `apps/docs/examples/button/*.tsx` dirender dan teksnya dibaca dari file yang sama.
- `generate-docs.ts` menghasilkan: `apps/docs/generated/metadata/button.json`, `apps/docs/public/docs/components/button.md`, dan `llms.txt` di root. Situs menyajikan `llms.txt` yang sama lewat `app/llms.txt/route.ts`. Metadata memakai skema [contracts/component-metadata.schema.json](./contracts/component-metadata.schema.json).
- Pipeline build tunggal: `pnpm build` menjalankan build paket (`tsc`) → `generate-docs` → `build-registry` → `next build`; `pnpm docs:build` adalah alias untuk urutan yang sama.
- `check:freshness` menjalankan generate lalu `git diff --exit-code` pada artefak tersebut.

### Registry dan distribusi

- `registry.json` berisi tiga item: `theme` (`registry:theme`, cssVars light/dark/theme), `utils` (`registry:lib`, `cn`), `button` (`registry:ui`, file komponen + sidecar).
- Item `button` memakai `registryDependencies` ke `theme` dan `utils` dengan base URL dari `registry.config.json` (default `http://localhost:3000`).
- `build-registry.ts`: jalankan `shadcn build --output apps/docs/public/r`, lalu stempel `meta.legion = { version, source, docs }` dan tambahkan sidecar `@ui/button.legion.json` (versi + URL sumber) agar salinan mencatat asal versi (FR-015). Hasil validasi memakai `shadcn/schema`.
- File komponen pada item registry disalin byte-identik dari sumber; sidecar adalah metadata hasil generate, bukan kode komponen.
- Paket `@legion/ui` dibangun dengan `tsc` dari sumber yang sama; `check:registry` memastikan file item = sumber, versi item = versi paket, dan test Playwright membandingkan hasil render paket vs salinan.

### Pemeriksaan otomatis

| Pemeriksaan | Perintah | Gagal bila | Rujukan |
| --- | --- | --- | --- |
| Kelengkapan token | `pnpm check:tokens` | Token semantic hilang di salah satu mode, nama di luar daftar baku, format bukan `oklch()`/`rem`/`calc`, pemetaan `@theme inline` hilang | FR-001, FR-012, Prinsip I–II |
| Literal dan arbitrer | `pnpm check:token-literals` | Ada `#hex`, `rgb(`, `hsl(`, `oklch(` di sumber komponen (kecuali definisi token `styles/theme.css`); arbitrary value visual `bg-[…]`, `text-[13px]`, `shadow-[…]`, `rounded-[…]`, `ring-[3px]` | FR-011, SC-003, Prinsip I |
| Kontras | `pnpm check:contrast` | Rasio di bawah ambang per pasangan di salah satu mode | FR-002, SC-001 |
| Kesegaran dokumen/metadata | `pnpm check:freshness` | Generate ulang menghasilkan diff | FR-009, FR-010, SC-005 |
| Identitas registry | `pnpm check:registry` | Item ≠ sumber, versi item ≠ versi paket, dependensi metadata ≠ kode | FR-007, FR-009, SC-004 |
| Aksesibilitas | `pnpm test:e2e` | axe menemukan pelanggaran; keyboard/fokus/zoom/reduced-motion gagal | FR-006, FR-013, SC-006, SC-008 |
| Ukuran | `pnpm check:size` | Melebihi budget performa | Performance Goals |
| Unit | `pnpm test` | Varian, state, asChild, keyboard gagal | FR-003–FR-006, Prinsip VIII |

`pnpm check` menjalankan semua pemeriksaan statis; CI menjalankan `pnpm build && pnpm check && pnpm test && pnpm test:e2e`.

### Verifikasi kriteria keberhasilan

| SC | Metode | Bukti |
| --- | --- | --- |
| SC-001 | `pnpm check:contrast` | Log nol kegagalan untuk semua pasangan di light/dark |
| SC-002 | Uji pemakaian: 5 peserta baru memasang/menyalin Button dari dokumentasi | Catatan waktu dan pertanyaan; lulus bila ≥ 4/5 berhasil < 10 menit |
| SC-003 | `pnpm check:token-literals` | Log nol temuan |
| SC-004 | `pnpm check:registry` + e2e paritas salin vs paket | Nol perbedaan isi; nol perbedaan markup/perilaku |
| SC-005 | `pnpm check:freshness` | `git diff --exit-code` bersih; tujuh bagian ada |
| SC-006 | `pnpm test:e2e` (axe light/dark) + `button.a11y.md` | Nol pelanggaran axe; semua butir manual `pass` |
| SC-007 | `evals/ai-baseline/tasks.md` dijalankan pada agen tanpa konteks repo | ≥ 2/3 tugas selesai tanpa pertanyaan, sesuai dokumentasi |
| SC-008 | e2e zoom 200% dan viewport 320 px | Semua fungsi Button tercapai; tidak ada teks terpotong |

## Phased Delivery (bahan untuk tasks.md, belum dibuat)

1. **Fondasi repo dan token** — workspace pnpm, `theme.css`, `check:tokens`, `check:token-literals`, `check:contrast`.
2. **Button dan test** — komponen, JSDoc, `button.a11y.md`, unit test, build paket, budget ukuran.
3. **Dokumentasi** — situs Next.js, tujuh bagian, contoh, mode, generate metadata/`llms.txt`/`.md`, `check:freshness`.
4. **Registry dan distribusi** — `registry.json`, stempel versi, sidecar, `check:registry`, uji paritas salin vs paket.
5. **Gate CI dan bukti Converge** — workflow, axe, manual checklist, uji tugas AI, changelog.

## Risks and Mitigations

| Risiko | Dampak | Mitigasi |
| --- | --- | --- |
| Nilai token awal gagal kontras 3:1 untuk batas kontrol/fokus | Gate kontras merah | Nilai `--input`/`--ring` disetel sebelum komponen ditulis; checker dijalankan lokal pada commit pertama |
| `shadcn build` menolak field tambahan atau sidecar | Registry tidak terbangun | Stempel dilakukan pasca-build dan divalidasi `shadcn/schema`; bila schema menolak, sidecar dipindah ke item `registry:file` terpisah dengan target sama |
| `react-docgen-typescript` tertinggal dari TypeScript 7 | Metadata props tidak terbentuk | TypeScript dipin ke 5.9.x sampai docgen mendukung 7; upgrade dicatat terpisah |
| Salinan tidak membawa token | Button salinan tidak tampil benar | Item `theme` menjadi `registryDependencies`; uji paritas merender salinan di proyek fixture tanpa token lain |
| `oklch` tidak didukung browser lama | Warna gagal | Baseline browser Tailwind 4 sudah mensyaratkan dukungan `oklch`; tidak ada fallback hex (dilarang Prinsip I) |
| Dokumentasi basi | Agen AI memakai info salah | `check:freshness` sebagai gate; artefak di-commit dan di-diff |
| Uji AI subjektif | SC-007 tidak terukur | Tiga tugas baku + rubrik biner (selesai tanpa pertanyaan, sesuai dokumentasi) dijalankan dua penilai |

## Complexity Tracking

Tidak ada penyimpangan dari constitution. Kolom berikut sengaja kosong.

| Violation | Why Needed | Simpler Alternative Rejected Because |
| --- | --- | --- |
| — | — | — |

## Gate

Plan selesai dan Constitution Check terisi. `tasks.md` belum dibuat; menunggu review manusia atas `plan.md`, `research.md`, `data-model.md`, `contracts/`, dan `quickstart.md`.
