# Research: Fondasi Legion v4 dan Button

**Feature**: `001-fondasi-button` | **Date**: 2026-11-22

Keputusan di bawah dipilih agar memenuhi constitution tanpa penyimpangan. Setiap keputusan mencatat rasional dan alternatif yang ditolak.

## R1. Kerangka dokumentasi

**Decision**: Next.js 16.4.6 (App Router, React Server Components) + MDX (`@next/mdx`) + Tailwind CSS 4.3.5, `next-themes` 0.4.6 untuk mode, dan Shiki untuk penyorotan kode di server. Dua locale (`en`, `id`) memakai route group dengan root layout masing-masing agar `<html lang>` benar tanpa middleware; label UI berasal dari kamus bertipe lokal, bukan library i18n.

**Rationale**:
- Komponen adalah React; pratinjau harus merender komponen asli tanpa jembatan island atau wrapper framework lain.
- Satu proses build menghasilkan halaman dokumentasi sekaligus registry statis di `public/r`, sehingga pemeriksaan kesegaran cukup satu pipeline.
- App Router memungkinkan halaman komponen membaca file sumber dan metadata hasil generate saat build (tanpa fetch runtime), memenuhi Performance Goals.
- `next-themes` menulis kelas `.dark` di `<html>` sebelum paint, menutup edge case kilatan warna salah tanpa mekanisme mode kedua.
- Shiki berjalan di server component; tidak ada JavaScript klien tambahan untuk penyorotan.
- Route group per locale memberi `/docs/...` dan `/id/docs/...` dengan atribut bahasa yang benar (WCAG 3.1.1) dan tanpa dependensi i18n tambahan.

**Alternatives considered**:
- **Astro + Starlight**: kualitas dokumentasi baik dan JS awal kecil, tetapi pratinjau React memerlukan island + integrasi tambahan, dan registry static output tetap perlu pipeline terpisah. Dua model build untuk satu komponen dianggap lebih rumit.
- **Fumadocs**: memberi search, TOC, dan konversi LLM siap pakai, tetapi menambah lapisan abstraksi besar untuk satu komponen dua bahasa dan menduplikasi generator `llms.txt`/`.md` yang menjadi kebutuhan constitution.
- **VitePress**: tidak mendukung pratinjau komponen React secara native.
- **Docusaurus**: berat, konfigurasi MDX/React lebih berlapis daripada kebutuhan.

## R2. Pola varian komponen

**Decision**: `class-variance-authority` (CVA) 0.7.1 untuk seluruh komponen, dipadukan `cn()` (`clsx` 2.1.1 + `tailwind-merge` 3.7.1).

**Rationale**:
- Pola yang sama sudah dipakai shadcn/ui, sehingga agen AI dan developer mengenali bentuk API `cva(base, { variants, defaultVariants })`.
- Menghasilkan tipe props dari definisi varian; tabel props dan metadata dapat dibangkitkan dari tipe yang sama.
- `tailwind-merge` 3.x mendukung Tailwind 4, sehingga `className` pengguna menimpa kelas varian tanpa konflik.

**Alternatives considered**:
- **tailwind-variants (`tv`)**: fitur lebih kaya (slots) tetapi bukan pola yang dikenal mayoritas konsumen shadcn; tidak diperlukan untuk Button.
- **Objek kelas manual**: tidak menghasilkan tipe varian dan mudah menyimpang antar komponen.
- **`clsx` saja**: tidak menyelesaikan konflik kelas saat `className` pengguna menimpa varian.

## R3. Test runner

**Decision**: Vitest 5.1.1 + `@testing-library/react` 16.3.3 + `@testing-library/user-event` + jsdom 31.0.1 untuk unit/komponen; Playwright 1.65.1 untuk browser.

**Rationale**:
- Vitest berbagi konfigurasi Vite/TS dengan cepat dan mendukung ESM serta TS tanpa transpiler tambahan.
- Testing Library menguji perilaku yang terlihat pengguna (peran, nama, state), bukan implementasi kelas.
- `user-event` menyimulasikan Tab/Enter/Space lebih dekat ke browser daripada `fireEvent`, penting untuk Prinsip VI dan VIII.
- Playwright adalah satu-satunya cara realistis menguji `focus-visible`, zoom 200%, lebar 320 px, `prefers-reduced-motion`, dan mode gelap sungguhan; sekaligus menjalankan axe di browser nyata.

**Alternatives considered**:
- **Jest**: konfigurasi ESM/TS lebih berat dan tidak menyatu dengan Vite.
- **Vitest browser mode saja**: menghapus jsdom tetapi membuat test unit lebih lambat dan menambah ketergantungan browser untuk setiap perubahan kecil.
- **Cypress**: mampu, tetapi Playwright lebih ringan untuk kebutuhan aksesibilitas dan multi-viewport di CI.

## R4. Alat pemeriksaan kontras

**Decision**: `colorjs.io` 0.7.1 + manifest pasangan kontras (`packages/ui/src/styles/contrast-pairs.json`) + parser `postcss` 8.5.33. Alpha dikompositkan ke warna latar pasangan sebelum rasio dihitung.

**Rationale**:
- `colorjs.io` mem-parse `oklch()` dan menghitung rasio kontras WCAG tanpa konversi manual; rumus luminans relatif sama untuk WCAG 2.1/2.2.
- Pemeriksaan berbasis CSS sumber (bukan hasil render) menangkap kegagalan sebelum build, deterministik di CI, dan tidak bergantung pada screenshot.
- Manifest pasangan membuat ambang eksplisit: teks 4,5:1, batas kontrol/fokus 3:1, per mode.
- Token `--border`/`--input` memakai alpha di mode gelap; komposit ke latar mencegah rasio palsu.

**Alternatives considered**:
- **axe/Chrome DevTools contrast audit saja**: hanya memeriksa elemen yang dirender, tidak semua pasangan token, dan tidak bisa menjadi gate untuk kombinasi yang belum dipakai.
- **`wcag-contrast`**: hanya menerima hex; token `oklch()` harus dikonversi manual.
- **APCA**: belum menjadi standar kepatuhan constitution (WCAG 2.2 AA).

## R5. Alat pemeriksaan aksesibilitas

**Decision**: `@axe-core/playwright` 4.14.0 pada halaman dokumentasi (light dan dark, locale `en` dan `id`) + daftar periksa manual per komponen di `packages/ui/src/components/ui/button.a11y.md`.

**Rationale**:
- axe di browser nyata menangkap pelanggaran struktur (nama, peran, kontras elemen nyata) yang tidak terlihat di jsdom.
- Sebagian kriteria WCAG 2.2 (urutan fokus, pembaca layar, zoom, gerakan, konten tambahan) tidak dapat dinilai otomatis; constitution mewajibkan daftar periksa manual beserta bukti.
- Checklist disimpan bersama komponen agar bergerak bersama kode dan ditinjau pada Converge.

**Alternatives considered**:
- **`vitest-axe`/`jest-axe`**: berjalan di jsdom tanpa layout, sehingga kontras dan fokus tidak bermakna.
- **Pa11y/Lighthouse**: menambah dua mesin berbeda; axe sudah menjadi standar de facto dan dipakai Playwright.
- **Hanya manual**: tidak dapat menjadi gate merge otomatis.

## R6. Mekanisme build dan distribusi registry

**Decision**: `registry.json` di root + `shadcn build` (shadcn 4.23.0) ke `apps/docs/public/r`, dilanjutkan post-stempel Node (`build-registry.ts`) yang menambahkan `meta.legion` dan sidecar `button.legion.json`, lalu validasi memakai `shadcn/schema`.

**Rationale**:
- Registry mengikuti spesifikasi shadcn: `shadcn add <url>` adalah jalur salin yang sudah dikenal dan tidak memerlukan CLI sendiri.
- `meta` adalah field resmi item registry, sehingga versi dapat disematkan tanpa field di luar skema ([registry-item.json](https://ui.shadcn.com/docs/registry/registry-item-json)).
- Sidecar `registry:file` dengan target `@ui/button.legion.json` membuat salinan mencatat versi asal dan URL dokumentasi `en`/`id` secara persisten (FR-015) tanpa menyisipkan komentar versi ke kode komponen (yang akan merusak identitas sumber).
- `shadcn build` melakukan embedding isi file dan validasi awal; post-stempel hanya menambah metadata dan satu entri file, lalu divalidasi ulang dengan schema resmi.
- Item `theme` dan `utils` menjadi `registryDependencies` agar salinan Button tetap berfungsi tanpa tema yang sudah ada.
- Base URL berada di `registry.config.json` supaya build deterministik (tidak bergantung env CI) dan mudah diganti saat deployment.

**Alternatives considered**:
- **Menulis registry builder sendiri sepenuhnya**: kontrol penuh tetapi menduplikasi perilaku CLI dan berisiko menyimpang dari skema.
- **Tanpa sidecar, hanya `meta`**: versi terlihat di JSON registry tetapi tidak tersimpan di proyek pengguna, sehingga FR-015 tidak terpenuhi secara operasional.
- **Menyisipkan komentar versi ke file komponen saat build**: membuat item salin tidak identik dengan sumber (Prinsip IV, FR-007).
- **Menerbitkan paket ke registry publik**: di luar cakupan fitur.

## R7. Build paket

**Decision**: `tsc` (ESM + deklarasi) ke `packages/ui/dist`; workspace mengimpor sumber (`publishConfig.exports` menunjuk `dist` untuk distribusi). Tidak ada bundler.

**Rationale**:
- Komponen adalah sumber TypeScript murni; `tsc` sudah menjadi dependensi dan menghasilkan output yang dapat diaudit.
- Menghindari bundler berarti tidak ada transformasi kelas Tailwind atau import yang dapat membuat paket dan item salin berbeda perilaku.
- Dokumentasi mengimpor sumber yang sama; tidak ada salinan kode untuk pratinjau.
- Budget ukuran diukur dari `dist/components/ui/button.js` dengan `zlib`.

**Alternatives considered**:
- **tsup/Vite library mode**: nyaman untuk CJS+ESM, tetapi menambah alat dan konfigurasi untuk kebutuhan yang tidak ada (konsumen internal memakai ESM).
- **Menerbitkan sumber TS saja**: menghilangkan build dan deklarasi, tetapi memaksa setiap konsumen men-transpile paket dan menyulitkan pemeriksaan distribusi.
- **Rolldown/esbuild**: belum perlu untuk satu komponen.

## R8. Sumber tunggal token dan dokumentasi

**Decision**: `theme.css` adalah satu-satunya sumber token. Prosa komponen berupa Markdown per bahasa (`apps/docs/content/components/button.en.md`, `button.id.md`), deskripsi props diterjemahkan lewat overlay `button.props.id.json`, contoh berupa file TSX yang dirender dan dibaca ulang sebagai teks, dan metadata dibangkitkan oleh `react-docgen-typescript` + manifest registry.

**Rationale**:
- Token tidak diduplikasi ke TypeScript atau JSON; checker membaca CSS.
- Prosa Markdown bebas JSX sehingga dapat dipublikasikan apa adanya sebagai halaman `.md` untuk agen AI, sementara halaman HTML menyisipkan pratinjau dan tabel hasil generate.
- Satu file prosa per bahasa menjaga kualitas terjemahan; overlay props memisahkan teks API (Inggris) dari terjemahan tanpa menduplikasi kode.
- Contoh kode yang ditampilkan berasal dari file yang benar-benar dirender, menutup risiko contoh basi.
- `react-docgen-typescript` mengekstrak props dan JSDoc dari tipe, sesuai Prinsip III dan FR-009.

**Alternatives considered**:
- **Token di TypeScript + generate CSS**: menambah langkah dan memungkinkan dua representasi berbeda.
- **Contoh ditulis ulang di Markdown**: rawan tidak sinkron dengan komponen.
- **Metadata ditulis tangan**: melanggar Prinsip III (“dibangkitkan, bukan ditulis tangan”).

## R9. Versi dan changelog

**Decision**: Changesets; versi `package.json` menjadi sumber versi registry dan sidecar. Setiap perubahan yang merusak export paket atau nama item registry wajib PR dengan changeset `major`/`minor`.

**Rationale**:
- FR-014 dan Prinsip IX membutuhkan semver dan changelog; Changesets menghasilkan keduanya dari PR.
- Versi yang disuntikkan ke registry berasal dari satu field, sehingga tidak ada versi ganda.
- `check:registry` menolak item dengan `meta.legion.version` berbeda dari `package.json`.

**Alternatives considered**:
- **Changelog manual**: mudah terlupa; tidak ada gate.
- **`release-please`**: lebih terikat konvensi commit dan kurang cocok dengan monorepo privat kecil.
- **Tanpa versioning**: melanggar Prinsip IX.

## R10. Runtime, TypeScript, dan baseline browser

**Decision**: Node 24.15+ (Vitest 5 dan jsdom 31 mensyaratkan Node 22.12+/22.22+), pnpm 10, TypeScript 5.9.x, browser evergreen (Safari 16.4+, Chrome 111+, Firefox 128+).

**Rationale**:
- Node 24 LTS memenuhi seluruh alat dan tersedia di CI.
- TypeScript 5.9.x dipilih karena `react-docgen-typescript` 2.4.0 dibangun di atas compiler API lama; TypeScript 7 (API native) belum dijamin. Pin ini dicatat sebagai utang upgrade, bukan penyimpangan constitution (constitution hanya mewajibkan mode ketat).
- Tailwind CSS 4 mensyaratkan browser yang mendukung `oklch` dan fitur CSS modern; baseline ini juga menghapus kebutuhan fallback warna.

**Alternatives considered**:
- **TypeScript 7.0**: lebih baru, tetapi berisiko memutus ekstraksi props; tidak sepadan untuk fitur fondasi.
- **Node 22**: memenuhi sebagian alat, tetapi jsdom 31 mensyaratkan 22.22.2+ dan CI belum tentu menyediakannya.

## R11. CI dan gate merge

**Decision**: Satu workflow GitHub Actions: `pnpm build` → `pnpm check` (token, literal, kontras, freshness, registry, size) → `pnpm test` → `pnpm test:e2e`. Semua wajib hijau untuk merge.

**Rationale**:
- Constitution menjadikan pemeriksaan otomatis sebagai gate (Prinsip I, II, VI; SC-001, SC-003, SC-004, SC-005, SC-006).
- Build dijalankan lebih dulu karena `check:size` membaca `dist/` dan e2e membutuhkan situs serta registry hasil build; urutan murah → mahal diterapkan setelah artefak tersedia.

**Alternatives considered**:
- **Memisahkan setiap check ke job paralel**: lebih cepat tetapi overhead setup pnpm/browser lebih besar untuk repo kecil.
- **Menjalankan e2e hanya nightly**: melanggar gate merge Prinsip VI.

## R12. Dokumentasi dua bahasa

**Decision**: Inggris (`en`, default) dan Indonesia (`id`) sebagai dua locale statis. Inggris di `/docs/components/button`, Indonesia di `/id/docs/components/button`. Setiap locale punya root layout sendiri lewat route group `(en)` dan `(id)`, sehingga `<html lang="en|id">` benar tanpa middleware. Label UI berasal dari kamus bertipe di `apps/docs/i18n.ts`; prosa dari file Markdown per bahasa; deskripsi props dari JSDoc Inggris + overlay terjemahan Indonesia. `llms.txt` tunggal memuat entri kedua bahasa, dan setiap halaman `.md` dibangkitkan per locale.

**Rationale**:
- Memenuhi permintaan produk (dua bahasa) sekaligus WCAG 3.1.1 Language of Page.
- Route group + root layout menghindari middleware, redirect, dan penentuan bahasa berbasis cookie yang menyulitkan pratinjau statis.
- Kamus bertipe kecil (tujuh judul bagian, tombol pasang, pengalih mode/bahasa) jauh lebih sederhana daripada runtime i18n untuk satu halaman komponen; tidak ada dependensi baru.
- Prosa panjang tetap ditulis manusia per bahasa, bukan dihasilkan mesin saat build, sehingga kualitas dan determinisme terjaga.
- Overlay props memisahkan identifier API (Inggris) dari terjemahan dan membuat penerjemahan terukur: generate gagal bila ada prop tanpa deskripsi `id`.
- Satu `llms.txt` menjaga Prinsip III (satu indeks) sambil menautkan kedua bahasa; agen memilih bahasa yang tersedia.

**Alternatives considered**:
- **next-intl/i18next**: memberi pluralisasi, format, dan routing otomatis, tetapi menambah runtime, konfigurasi middleware, dan bundle untuk kebutuhan statis dua locale.
- **Satu file prosa dengan blok `<!-- en -->`/`<!-- id -->`**: sulit ditinjau dan rawan tercampur.
- **Terjemahan otomatis saat build**: non-deterministik, kualitas tidak terkontrol, dan melanggar prinsip “dibangkitkan dari sumber yang ditinjau”.
- **Dua aplikasi dokumentasi terpisah**: menduplikasi shell, tema, dan pemeriksaan kesegaran; melanggar Prinsip IV secara praktis.
- **Menerjemahkan identifier API/kode**: menyulitkan agen dan pengguna library; identifier tetap Inggris.

## Catatan keputusan

Ditetapkan pada review plan:

- **Nama paket final**: `@legionv4/ui`, privat sampai publikasi pertama.
- **Bahasa dokumentasi**: Inggris dan Indonesia.

Masih terbuka (tidak memblokir plan):

- **Threshold uji tugas AI** (2 dari 3) adalah usulan spec; dievaluasi setelah percobaan pertama.
- **Hosting dokumentasi/registry**: belum ditentukan; base URL registry dikonfigurasi di `registry.config.json`.
