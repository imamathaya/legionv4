## Pratinjau dan varian

[[PREVIEW]]

## Pasang sebagai paket

Pasang paket privat dan impor stylesheet token-nya:

```bash
pnpm add @legionv4/ui
```

```tsx
import { Button } from "@legionv4/ui";
import "@legionv4/ui/styles.css";

export function Contoh() {
  return <Button>Simpan</Button>;
}
```

## Pasang sebagai salinan

Salin komponen beserta dependensinya langsung ke proyek yang sudah memakai shadcn dan Tailwind CSS 4:

```bash
npx shadcn@latest add http://localhost:3000/r/button.json
```

Salinan menyertakan `button.legion.json` yang mencatat versi sumber dan URL dokumentasi, sehingga Anda tahu kapan salinan tertinggal.

## Pemakaian

[[EXAMPLES]]

```tsx
import { Button } from "@legionv4/ui";

<Button>Simpan</Button>
<Button variant="secondary" size="sm">Batal</Button>
<Button variant="destructive" loading loadingLabel="Menghapus">Hapus</Button>
<Button variant="outline" asChild>
  <a href="/id/docs/components/button">Baca dokumentasi</a>
</Button>
```

## Props

[[PROPS]]

## Dependensi

[[DEPENDENCIES]]

## Aksesibilitas

Button menargetkan WCAG 2.2 AA. Setiap varian dan state memakai token semantic; teks memenuhi 4,5:1, batas kontrol dan indikator fokus memenuhi 3:1 di kedua mode, dan target minimal 24 × 24 piksel CSS.

- Keyboard: Tab mencapai tombol; Enter dan Space mengaktifkan tombol native; tautan aktif dengan Enter.
- Fokus: outline dua piksel dengan offset tetap terlihat dan tidak terpotong.
- Loading: `aria-busy` dipasang, aksi diblokir, dan `loadingLabel` yang terlokalisasi diumumkan satu kali.
- Hanya ikon: sediakan `aria-label` atau `aria-labelledby`.
- Gerakan: spinner berhenti saat `prefers-reduced-motion`.
- Zoom dan reflow: label membungkus pada zoom 200% dan lebar 320 piksel, bukan terpotong.

Bukti manual dicatat di `packages/ui/src/components/ui/button.a11y.md`.

## Sumber

Dokumentasi merender file sumber yang sama dengan paket dan item salinan registry.

[[SOURCE]]
