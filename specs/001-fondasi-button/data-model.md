# Data Model: Fondasi Legion v4 dan Button

**Feature**: `001-fondasi-button` | **Date**: 2026-11-22 | **Spec**: [spec.md](./spec.md)

Model di bawah mendefinisikan bentuk data yang dibangkitkan, divalidasi, dan didistribusikan. Sumber kebenaran tetap kode dan CSS; dokumen ini menjelaskan bentuk, relasi, dan aturan validasinya.

## 1. Token

### 1.1 Tingkat token

| Tingkat | Contoh nama | Dibaca oleh | Aturan |
| --- | --- | --- | --- |
| Primitive | `--color-neutral-100`, `--color-violet-500`, `--color-red-600` | Definisi token semantic saja | Dinamai menurut warna, bukan peran; nilai `oklch()`. |
| Semantic | `--background`, `--primary`, `--destructive-foreground`, `--radius` | Komponen dan `@theme inline` | Hanya nama dari daftar baku constitution; wajib punya nilai light dan dark. |
| Component | — | — | Tidak ada di fitur ini. Penambahan hanya lewat Complexity Tracking. |

### 1.2 Field token semantic

| Field | Tipe | Validasi |
| --- | --- | --- |
| `name` | string | Ada di daftar baku; diawali `--`; tidak ada nama Legion v3 (`tertiary`, `success`, `warning`, `error`, `information`). |
| `kind` | `color` \| `radius` | Radius hanya untuk `--radius` dan turunannya. |
| `valueLight` | string | Warna: `oklch(...)`, alpha opsional. Radius: `rem` atau `calc()`. Tidak boleh hex/`rgb()`/`hsl()`. |
| `valueDark` | string | Sama seperti `valueLight`; wajib ada, termasuk untuk radius (nilai sama). |
| `pair` | string \| null | Untuk token permukaan, menunjuk token `-foreground` pasangannya. |
| `tailwindName` | string | `--color-<name>` atau `--radius-<step>` di `@theme inline`. |

### 1.3 Daftar baku warna semantic (19)

| Kelompok | Token | Pasangan | Ambang teks |
| --- | --- | --- | --- |
| Halaman | `--background` | `--foreground` | 4,5:1 |
| Halaman | `--foreground` | `--background` | 4,5:1 |
| Permukaan | `--card` | `--card-foreground` | 4,5:1 |
| Permukaan | `--card-foreground` | `--card` | 4,5:1 |
| Permukaan | `--popover` | `--popover-foreground` | 4,5:1 |
| Permukaan | `--popover-foreground` | `--popover` | 4,5:1 |
| Aksi | `--primary` | `--primary-foreground` | 4,5:1 |
| Aksi | `--primary-foreground` | `--primary` | 4,5:1 |
| Aksi | `--secondary` | `--secondary-foreground` | 4,5:1 |
| Aksi | `--secondary-foreground` | `--secondary` | 4,5:1 |
| Aksi | `--muted` | `--muted-foreground` | 4,5:1 |
| Aksi | `--muted-foreground` | `--muted` | 4,5:1 |
| Aksi | `--accent` | `--accent-foreground` | 4,5:1 |
| Aksi | `--accent-foreground` | `--accent` | 4,5:1 |
| Aksi | `--destructive` | `--destructive-foreground` | 4,5:1 |
| Aksi | `--destructive-foreground` | `--destructive` | 4,5:1 |
| Kontrol | `--border` | — | Dekoratif; tidak diperiksa 3:1 (lihat 1.5) |
| Kontrol | `--input` | — | 3:1 terhadap `--background` dan `--card` |
| Kontrol | `--ring` | — | 3:1 terhadap `--background` dan `--card` |

`--chart-1..5` dan token `--sidebar-*` tidak dibuat karena komponen grafik/Sidebar di luar pilot.

### 1.4 Radius

| Token | Nilai | Mode |
| --- | --- | --- |
| `--radius` | `rem` (nilai dasar, ditetapkan saat implementasi) | light dan dark (nilai sama) |
| `--radius-sm` | `calc(var(--radius) * 0.6)` | mode-invariant di `@theme inline`; mengikuti `--radius` tiap mode |
| `--radius-md` | `calc(var(--radius) * 0.8)` | mode-invariant di `@theme inline`; mengikuti `--radius` tiap mode |
| `--radius-lg` | `var(--radius)` | mode-invariant di `@theme inline`; mengikuti `--radius` tiap mode |
| `--radius-xl` | `calc(var(--radius) * 1.4)` | mode-invariant di `@theme inline`; mengikuti `--radius` tiap mode |
| `--radius-2xl` | `calc(var(--radius) * 1.8)` | mode-invariant di `@theme inline`; mengikuti `--radius` tiap mode |
| `--radius-3xl` | `calc(var(--radius) * 2.2)` | mode-invariant di `@theme inline`; mengikuti `--radius` tiap mode |
| `--radius-4xl` | `calc(var(--radius) * 2.6)` | mode-invariant di `@theme inline`; mengikuti `--radius` tiap mode |

### 1.5 Pasangan kontras (manifest)

`packages/ui/src/styles/contrast-pairs.json`:

```json
{
  "version": 1,
  "pairs": [
    { "foreground": "--foreground", "background": "--background", "min": 4.5, "kind": "text" },
    { "foreground": "--card-foreground", "background": "--card", "min": 4.5, "kind": "text" },
    { "foreground": "--popover-foreground", "background": "--popover", "min": 4.5, "kind": "text" },
    { "foreground": "--primary-foreground", "background": "--primary", "min": 4.5, "kind": "text", "stateSurfaceOpacities": [0.9, 0.8] },
    { "foreground": "--secondary-foreground", "background": "--secondary", "min": 4.5, "kind": "text", "stateSurfaceOpacities": [0.8, 0.7] },
    { "foreground": "--muted-foreground", "background": "--muted", "min": 4.5, "kind": "text" },
    { "foreground": "--accent-foreground", "background": "--accent", "min": 4.5, "kind": "text", "stateSurfaceOpacities": [0.9, 0.8] },
    { "foreground": "--destructive-foreground", "background": "--destructive", "min": 4.5, "kind": "text" },
    { "foreground": "--input", "background": "--background", "min": 3, "kind": "non-text" },
    { "foreground": "--input", "background": "--card", "min": 3, "kind": "non-text" },
    { "foreground": "--ring", "background": "--background", "min": 3, "kind": "non-text" },
    { "foreground": "--ring", "background": "--card", "min": 3, "kind": "non-text" }
  ]
}
```

Aturan:
- Setiap pasangan diperiksa di light dan dark.
- Nilai ber-alpha dikompositkan ke `background` pasangan sebelum rasio dihitung.
- `stateSurfaceOpacities` mencantumkan opasitas permukaan yang dipakai state hover/active (mis. `bg-primary/90`). Checker mengompositkan token permukaan pada opasitas itu di atas `--background` dan `--card` mode terkait, lalu menghitung ulang rasio terhadap `foreground`; semua opasitas dan kedua latar wajib tetap memenuhi `min`. `--destructive` sengaja tidak punya opasitas state karena `--destructive-foreground` constitution hanya 4,56:1 di light; varian destruktif memakai bayangan untuk hover/active.
- `--border` sengaja tidak masuk manifest karena constitution mengecualikan garis dekoratif (Card, Table, Divider); Button `outline` memakai `--input`, bukan `--border`, untuk batas kontrol.
- Token baru tanpa entri manifest adalah kegagalan `check:tokens`.

## 2. Komponen Button

### 2.1 Identitas

| Field | Nilai |
| --- | --- |
| `name` | `button` |
| `title` | `Button` |
| `version` | Versi paket `@legionv4/ui` saat build |
| `sourcePath` | `packages/ui/src/components/ui/button.tsx` |
| `docsPathEn` | `apps/docs/content/components/button.en.md` |
| `docsPathId` | `apps/docs/content/components/button.id.md` |
| `markdownPathEn` | `/docs/components/button.md` (hasil generate) |
| `markdownPathId` | `/id/docs/components/button.md` (hasil generate) |
| `propsTranslationPath` | `apps/docs/content/components/button.props.id.json` |
| `dataSlot` | `button` |

### 2.2 Varian, ukuran, state

| Dimensi | Nilai | Aturan |
| --- | --- | --- |
| `variant` | `default`, `secondary`, `destructive`, `outline`, `ghost` | Default `default`; tiap varian memakai token semantic. `outline` memakai `border-input`; `ghost` tanpa latar. |
| `size` | `sm`, `default`, `lg` | Default `default`; tinggi minimal 24 px; `sm` tetap memenuhi target sentuh minimum. |
| State visual | `default`, `hover`, `focus-visible`, `active`, `disabled`, `loading` | Didefinisikan sebagai transisi kelas, bukan state React (kecuali `loading`). |

### 2.3 Transisi state

| Dari | Ke | Pemicu | Perilaku |
| --- | --- | --- | --- |
| default | hover | pointer di atas elemen | Perubahan warna/opasitas atau bayangan dari token; tidak ada perubahan layout. |
| default | focus-visible | Tab/`:focus-visible` | Outline fokus `outline-ring` 3:1 terhadap latar; tidak tertutup (WCAG 2.4.11). |
| default/hover | active | tombol ditekan | Perubahan warna/opasitas atau bayangan dari token; transform tidak wajib. |
| apa pun | disabled | atribut `disabled` | Tidak menerima fokus/klik; opasitas dari token/utility standar; tidak ada token baru. |
| apa pun kecuali disabled | loading | prop `loading` | `disabled` efektif, `aria-busy="true"`, spinner `aria-hidden`, status teks diumumkan satu kali. |
| loading | default | `loading` menjadi `false` | Status teks tidak diulang; fokus kembali ke tombol bila sebelumnya fokus. |
| loading + disabled | — | keduanya | Tetap tidak aktif; pengumuman status hanya sekali. |

### 2.4 Props (ringkas; kontrak lengkap di [contracts/button-api.md](./contracts/button-api.md))

| Prop | Tipe | Default | Wajib | Keterangan |
| --- | --- | --- | --- | --- |
| `variant` | `ButtonVariant` | `"default"` | tidak | Gaya visual. |
| `size` | `ButtonSize` | `"default"` | tidak | Ukuran. |
| `asChild` | `boolean` | `false` | tidak | Merender elemen anak (mis. `a`) dengan gaya dan atribut yang sama. |
| `loading` | `boolean` | `false` | tidak | Menonaktifkan aksi dan mengumumkan status memuat. |
| `loadingLabel` | `string` | `"Loading"` | tidak | Teks status untuk pembaca layar; hanya dipakai saat `loading`. Untuk halaman Indonesia, dokumentasi mencontohkan `loadingLabel="Memuat"`. |
| `className` | `string` | — | tidak | Kelas tambahan, digabung dengan `cn()`. |
| lainnya | `ButtonHTMLAttributes<HTMLButtonElement>` | — | tidak | Diteruskan ke elemen. |

### 2.5 Aturan validasi komponen

- Button ikon tanpa teks wajib punya `aria-label`; peringatan dev jika tidak ada teks yang terlihat dan tidak ada `aria-label`/`aria-labelledby`.
- Setiap prop publik punya deskripsi `en` dari JSDoc dan `id` dari overlay terjemahan; generate gagal bila salah satu kosong.
- `loading` + `asChild`: `aria-busy` dan `disabled` diteruskan ke elemen anak; jika anak adalah `a`, `aria-disabled="true"` dan `tabIndex={-1}`.
- Tidak ada prop `xxxClassName`/`xxxStyle`.
- Semua nama kelas berasal dari token; `check:token-literals` wajib nol temuan.

## 3. Item Registry

### 3.1 Item

| Field | Tipe | Validasi |
| --- | --- | --- |
| `name` | string | Unik; `theme`, `utils`, atau `button`. |
| `type` | string | `registry:theme`, `registry:lib`, `registry:ui`. |
| `title`, `description` | string | Tidak kosong. |
| `dependencies` | string[] | Hanya paket yang benar-benar diimpor item. |
| `registryDependencies` | string[] | URL absolut dari `registry.config.json` untuk `theme`/`utils`; tidak ada nama bare (menghindari tabrakan dengan registry shadcn). |
| `files` | File[] | Lihat 3.2. |
| `cssVars` | object | Hanya pada item `theme`: `light`, `dark`, `theme`. |
| `meta.legion` | object | `{ version, source, docs: { en, id } }`; ditambahkan saat build. |

### 3.2 File item

| Field | Tipe | Validasi |
| --- | --- | --- |
| `path` | string | Relatif terhadap root repo; file harus ada (kecuali sidecar hasil generate). |
| `type` | string | `registry:ui`, `registry:lib`, `registry:file`. |
| `target` | string | Placeholder `@ui/`, `@lib/`; wajib untuk `registry:file`. |
| `content` | string | Hasil embedding build; untuk file kode harus byte-identik dengan sumber. |

### 3.3 Sidecar versi

`button.legion.json` (dipasang di `@ui/button.legion.json`):

```json
{
  "item": "button",
  "version": "0.1.0",
  "source": "http://localhost:3000/r/button.json",
  "documentation": {
    "en": "http://localhost:3000/docs/components/button",
    "id": "http://localhost:3000/id/docs/components/button"
  }
}
```

Aturan:
- Dibangkitkan; tidak ditulis tangan; tanpa timestamp agar build deterministik.
- `version` harus sama dengan `packages/ui/package.json` dan `meta.legion.version`.
- `documentation` wajib memuat URL `en` dan `id` dari `registry.config.json`; salah satu hilang adalah kegagalan `check:registry`.
- Sidecar bukan kode komponen dan tidak ikut pemeriksaan identitas kode; keberadaannya dijustifikasi FR-015.

### 3.4 Item `theme`

- `cssVars.light` dan `cssVars.dark` memuat seluruh 19 warna semantic + `--radius`.
- `cssVars.theme` memuat pemetaan `--color-*` dan turunan `--radius-*` yang setara dengan `@theme inline`.
- Nilainya dibangkitkan dari `theme.css` saat build agar tidak ada nilai ganda manual.
- `check:registry` memastikan setiap token di `theme.css` muncul di kedua blok item.

### 3.5 Item `utils`

- Berisi `packages/ui/src/lib/utils.ts` (`cn`), `type: registry:lib`, `target: @lib/utils.ts`.
- Dependensi: `clsx`, `tailwind-merge`.

## 4. Metadata Komponen

File hasil generate: `apps/docs/generated/metadata/<name>.json`. Skema: [contracts/component-metadata.schema.json](./contracts/component-metadata.schema.json).

| Field | Tipe | Sumber | Validasi |
| --- | --- | --- | --- |
| `schemaVersion` | integer | konstanta | `1`. |
| `name`, `title`, `description` | string | registry + JSDoc komponen | Tidak kosong. |
| `version` | string semver | `package.json` | Sama dengan `meta.legion.version`. |
| `files` | string[] | manifest registry | Semua ada; minimal satu file komponen. |
| `dependencies` | string[] | registry | Sama dengan impor runtime di file komponen. |
| `props` | Prop[] | `react-docgen-typescript` + overlay `id` | Setiap prop punya `descriptions.en` dan `descriptions.id`, masing-masing satu kalimat. |
| `variants` | string[] | tipe CVA | Cocok dengan kontrak. |
| `sizes` | string[] | tipe CVA | Cocok dengan kontrak. |
| `examples` | Example[] | `apps/docs/examples/<name>/*.tsx` | Path ada; minimal satu contoh; dipakai kedua locale. |
| `a11y` | object | `button.a11y.md` + konfigurasi | `criteria` tidak kosong; path checklist ada. |
| `docs` | object | konfigurasi | `defaultLocale: "en"`, `sourcePath`, dan `locales.en`/`locales.id` berisi route, URL `.md`, path prosa, `htmlLang`. |

`Prop`:

| Field | Tipe | Validasi |
| --- | --- | --- |
| `name` | string | Unik. |
| `type` | string | Representasi tipe TypeScript. |
| `required` | boolean | Dari tanda `?`/default. |
| `defaultValue` | string \| null | Dari `defaultProps`/CVA. |
| `descriptions` | `{ en: string; id: string }` | `en` dari JSDoc; `id` dari overlay; keduanya tidak kosong dan satu kalimat. |

## 5. Halaman Dokumentasi

| Field | Nilai/Aturan |
| --- | --- |
| `defaultLocale` | `en` |
| `locales.en` | `route: /docs/components/button`; `markdownUrl: /docs/components/button.md`; `prosePath: apps/docs/content/components/button.en.md`; `htmlLang: en` |
| `locales.id` | `route: /id/docs/components/button`; `markdownUrl: /id/docs/components/button.md`; `prosePath: apps/docs/content/components/button.id.md`; `htmlLang: id` |
| `title` | `Button` (identifier API tidak diterjemahkan) |
| `sections` | 7 wajib di setiap locale: (1) Preview & variants, (2) Install as package, (3) Install as copy, (4) Usage code, (5) Props table, (6) Dependencies, (7) Accessibility notes. Ditambah penampil source code. Label bagian berasal dari kamus locale. |
| `examples` | Minimal satu contoh per varian; semua ukuran; state disabled dan loading; mode light dan dark. File contoh dipakai kedua locale (label contoh tetap Inggris); prosa Indonesia boleh menampilkan varian label lokal. |
| `propsTable` | Dibangkitkan dari metadata; deskripsi dipilih dari `descriptions[locale]`; tidak ditulis tangan. |
| `dependencies` | Dibangkitkan dari registry; tidak ditulis tangan. |
| `a11yNotes` | Kriteria WCAG yang relevan + tautan checklist manual; prosa per locale. |
| `languageSwitch` | Menukar `/docs/...` ↔ `/id/docs/...` untuk komponen yang sama, mempertahankan mode; `<link rel="alternate" hreflang="en|id">` diisi. |
| `modeCoverage` | Halaman menyediakan pengalih light/dark; pratinjau mengikuti tanpa pengaturan tambahan. |

## 6. Daftar Periksa Aksesibilitas

File: `packages/ui/src/components/ui/button.a11y.md` (Inggris).

| Field | Tipe | Validasi |
| --- | --- | --- |
| `criterion` | string | ID WCAG 2.2 (mis. `2.4.7`, `1.4.11`, `2.5.8`). |
| `method` | string | Langkah manual yang dapat diulang. |
| `result` | `pass` \| `fail` \| `not-run` | Wajib `pass` sebelum Converge. |
| `evidence` | string | Tanggal + lingkungan + catatan; screenshot bila relevan. |
| `reviewer` | string | Nama/QA. |

Butir minimum: keyboard Tab/Enter/Space, urutan fokus, fokus tidak tertutup, nama aksesibel button ikon, pengumuman loading, zoom 200%, lebar 320 px, `prefers-reduced-motion`, mode gelap, kontras destruktif, target 24 px.

## 7. Artefak AI

| Artefak | Lokasi | Isi | Kesegaran |
| --- | --- | --- | --- |
| `AGENTS.md` | root repo | Panduan membangun Legion: perintah, struktur, aturan token, cara menambah komponen | Ditulis tangan; ditinjau saat review (bukan hasil generate) |
| `llms.txt` | root + `/llms.txt` | H1, ringkasan, bagian Components (English) dan Komponen (Bahasa Indonesia) berisi tautan + deskripsi; bagian Tokens/Registry netral bahasa | Generate ulang tanpa diff |
| Halaman `.md` Inggris | `/docs/components/button.md` | Prosa Inggris + props (`en`) + dependensi + a11y, Markdown polos | Generate ulang tanpa diff |
| Halaman `.md` Indonesia | `/id/docs/components/button.md` | Prosa Indonesia + props (`id`) + dependensi + a11y, Markdown polos | Generate ulang tanpa diff |
| Metadata | `apps/docs/generated/metadata/button.json` | Lihat bagian 4 | Generate ulang tanpa diff |
| Registry | `apps/docs/public/r/*.json` | Item + `content` + `meta.legion` + sidecar | Generate ulang tanpa diff |

Aturan `llms.txt`: setiap entri berupa `- [Judul](URL): deskripsi satu kalimat`; tautan relatif terhadap situs; entri Inggris di bawah `## Components (English)` dan entri Indonesia di bawah `## Komponen (Bahasa Indonesia)`; tidak memuat rahasia atau URL lokal di luar base URL konfigurasi.

## 8. Invarian

1. Tidak ada file komponen kedua di repo; satu-satunya sumber adalah `packages/ui/src/components/ui/button.tsx`.
2. Setiap token warna dan radius dasar (`--radius`) punya nilai light dan dark; turunan `--radius-*` mode-invariant dan mengikuti `--radius`; tidak ada token di luar daftar baku.
3. Item registry untuk file kode byte-identik dengan sumber; versi item, sidecar, metadata, dan `package.json` sama. Paket dibangun deterministik dari sumber yang sama; karena JS hasil kompilasi tidak byte-identik dengan TS, paritas paket diuji lewat render (markup/atribut/perilaku) pada fixture, bukan perbandingan teks.
4. Setiap props publik punya JSDoc satu kalimat dan deskripsi `en`/`id`; keduanya muncul di metadata dan tabel props sesuai locale.
5. Setiap artefak hasil generate lolos `generate && git diff --exit-code`.
6. Tidak ada literal warna atau nilai arbitrer visual di sumber komponen.
7. Setiap pasangan kontras di manifest lolos ambangnya di kedua mode.
8. Button salinan dan Button paket merender markup dan perilaku yang sama untuk props yang sama.
9. Kedua locale memuat tujuh bagian dokumentasi, memakai `<html lang>` yang benar, dan tidak ada prop tanpa terjemahan `id`.
