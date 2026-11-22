# Quickstart: Fondasi Legion v4 dan Button

**Feature**: `001-fondasi-button` | **Date**: 2026-11-22

Panduan ini membuktikan fitur bekerja dari dua sisi: konsumen yang memakai paket/salinan, dan kontributor yang menjalankan pemeriksaan. Semua perintah dijalankan dari root repo.

## Prasyarat

- Node.js 24.15+ dan pnpm 10 (`corepack enable`)
- Browser Chromium untuk Playwright (`pnpm exec playwright install chromium`)
- Tidak ada layanan eksternal, basis data, atau kredensial

```bash
pnpm install
pnpm build                # paket (tsc) → generate docs → registry → next build
```

Hasil yang diharapkan: `packages/ui/dist/`, `apps/docs/public/r/{theme,utils,button}.json`, `apps/docs/generated/metadata/button.json`, `apps/docs/public/docs/components/button.md`, dan `llms.txt` di root (disajikan situs di `/llms.txt`).

## 1. Pakai sebagai paket

1. Jalankan situs dokumentasi: `pnpm docs:dev`, buka `http://localhost:3000/docs/components/button`.
2. Di sebuah aplikasi Next.js/Vite dengan Tailwind 4, tambahkan dependensi workspace `@legion/ui` dan impor CSS-nya:
   - `@import "@legion/ui/styles.css";` di global CSS (berisi token + `@theme inline`).
   - Untuk Tailwind 4, tambahkan `@source "../node_modules/@legion/ui/dist";` agar kelas komponen ikut discan.
3. Render:

```tsx
import { Button } from "@legion/ui";

<Button>Save</Button>
<Button variant="destructive" loading loadingLabel="Deleting">Delete</Button>
```

4. Ubah mode dengan menambahkan kelas `dark` pada `<html>` (atau gunakan `next-themes`); tidak ada perubahan kode komponen.
5. Verifikasi: kelima varian berubah warna, fokus keyboard terlihat, tombol `loading` tidak menjalankan aksi, dan `aria-busy` bernilai `true` di DevTools.

## 2. Pakai sebagai salinan (registry)

1. Dengan `pnpm docs:dev` berjalan, di aplikasi percobaan yang sudah punya `components.json` (shadcn) dan Tailwind 4:

```bash
npx shadcn@latest add http://localhost:3000/r/button.json
```

2. Hasil yang diharapkan: `components/ui/button.tsx`, `lib/utils.ts`, token Legion masuk ke CSS global, dan **`components/ui/button.legion.json`** berisi `version` serta `source`.
3. Verifikasi: salinan merender varian yang sama seperti paket; `pnpm --filter @legion/ui test:e2e` membandingkan keduanya pada fixture.
4. Ubah `registry.config.json` hanya bila base URL dokumentasi berubah; jalankan ulang `pnpm registry:build` dan `pnpm check:freshness`.

## 3. Pemeriksaan kontributor

| Perintah | Harapan |
| --- | --- |
| `pnpm check:tokens` | Nol token hilang/berlebih; setiap token ada di light dan dark; format `oklch()`/`rem`/`calc`; pemetaan `@theme inline` lengkap |
| `pnpm check:token-literals` | Nol literal warna dan nol arbitrary value visual di `packages/ui/src` |
| `pnpm check:contrast` | Semua pasangan manifest lolos (teks 4,5:1; kontrol/fokus 3:1) di kedua mode |
| `pnpm check:freshness` | Generate ulang menghasilkan `git diff --exit-code` bersih |
| `pnpm check:registry` | Item registry = sumber (byte-identik); versi item = `package.json`; sidecar ada |
| `pnpm check:size` | `dist/components/ui/button.js` ≤ 4 kB gzip |
| `pnpm test` | Unit test varian, ukuran, state, asChild, keyboard lulus |
| `pnpm test:e2e` | axe nol pelanggaran; fokus, mode, zoom, reduced motion, paritas salin lulus |
| `pnpm check` | Gabungan pemeriksaan statis di atas |

Pemeriksaan negatif (wajib dicoba sekali sebelum review):

- Tambahkan `className="bg-[#ff0000]"` pada Button → `check:token-literals` gagal.
- Hapus `--ring` dari `.dark` → `check:tokens` gagal.
- Ubah `--muted-foreground` menjadi terlalu terang → `check:contrast` gagal.
- Ubah `button.tsx` tanpa memperbarui artefak hasil generate di commit → `check:freshness` gagal.

## 4. Bukti aksesibilitas manual

1. Buka halaman dokumentasi, matikan mouse.
2. Tab sampai Button: cincin fokus terlihat di light dan dark, tidak terpotong.
3. Aktifkan dengan Enter dan Space; coba varian `outline` dan `ghost`.
4. Aktifkan `loading`: aksi tidak berjalan, pembaca layar (NVDA/VoiceOver) mengumumkan status satu kali.
5. Zoom 200% dan lebar 320 px: label panjang tidak terpotong, semua fungsi tercapai.
6. Aktifkan `prefers-reduced-motion: reduce`: tidak ada animasi yang wajib untuk memahami state.
7. Catat hasil di `packages/ui/src/components/ui/button.a11y.md`; semua butir harus `pass` sebelum Converge.

## 5. Uji pemakaian dan tugas AI

Uji pemakaian (SC-002): minta 5 orang yang belum membuka repo memasang atau menyalin Button hanya dari halaman dokumentasi. Catat waktu dan pertanyaan; lulus bila minimal 4 dari 5 berhasil dalam < 10 menit.

Uji tugas AI: gunakan `evals/ai-baseline/tasks.md` pada agen tanpa konteks repo. Kriteria lulus: minimal 2 dari 3 tugas selesai tanpa pertanyaan dan sesuai dokumentasi (SC-007). Simpan transkrip dan skor di `evals/ai-baseline/results/`.

## 6. Kriteria selesai

Fitur dinyatakan siap review bila:

- `pnpm check && pnpm test && pnpm build && pnpm test:e2e` hijau.
- Halaman dokumentasi memuat tujuh bagian wajib dan mengikuti mode.
- Salinan mencatat versi dan berperilaku sama dengan paket.
- Daftar periksa manual aksesibilitas selesai dengan bukti.
- `llms.txt`, halaman `.md`, metadata, dan registry bersih setelah generate ulang.

`tasks.md` tidak dibuat pada tahap ini; plan berhenti di sini menunggu review manusia.
