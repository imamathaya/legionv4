# Button

> Token-driven action control with five variants, three sizes, and six states.

## Pratinjau dan varian

Button adalah komponen referensi Legion v4. Tersedia lima varian (`default`, `secondary`, `destructive`, `outline`, `ghost`) dan tiga ukuran (`sm`, `default`, `lg`). Seluruh nilai visual berasal dari token semantik, sehingga kode yang sama tampil benar di mode terang dan gelap.

Pratinjau di atas merender sumber paket yang sebenarnya. Ubah tema lewat sakelar di header: tidak ada kode komponen yang berubah.

## Pasang sebagai paket

Pasang paket privat lalu impor stylesheet-nya satu kali di root aplikasi.

```bash
pnpm add @legionv4/ui
```

```tsx
import "@legionv4/ui/styles.css";
import { Button } from "@legionv4/ui";
```

Paket membutuhkan React 19 dan konsumen Tailwind CSS 4. Stylesheet mendefinisikan token semantik beserta pemetaan Tailwind-nya.

## Pasang sebagai salinan

Gunakan registry yang kompatibel dengan shadcn bila Anda ingin sumber komponen berada di repositori, bukan sebagai dependensi.

```bash
pnpm dlx shadcn@4.23.0 add http://localhost:3000/r/button.json
```

Item ini bergantung pada item `theme` dan `utils`, jadi keduanya ikut terpasang. Berkas sidecar `components/ui/button.legion.json` mencatat versi sumber dan URL dokumentasi, sehingga Anda tahu kapan salinan tertinggal.

## Pemakaian

```tsx
import { Button } from "@legionv4/ui";

<Button>Simpan perubahan</Button>

<Button variant="secondary" size="sm">
  Batal
</Button>

<Button variant="destructive" loading loadingLabel="Menghapus">
  Hapus
</Button>

<Button variant="outline" asChild>
  <a href="/id/docs">Baca dokumentasi</a>
</Button>
```

`asChild` merender elemen anak dengan gaya dan atribut aksesibilitas yang sama, sehingga tautan tetap memiliki semantik tautan. `loading` menonaktifkan aktivasi, memasang `aria-busy`, dan mengumumkan `loadingLabel` satu kali melalui area status.

## Props

Tabel props di bawah dibangkitkan dari sumber TypeScript dan JSDoc. Atribut native tombol seperti `type`, `form`, `onClick`, dan `aria-*` diteruskan tanpa perubahan.

## Dependensi

Daftar dependensi di bawah dibangkitkan dari item registry. Komponen hanya mengimpor paket runtime yang benar-benar dipakai; token datang melalui item theme.

## Aksesibilitas

Button menargetkan WCAG 2.2 Level AA. Kontraknya mencakup:

- Keyboard: Tab memfokuskan; Enter dan Space mengaktifkan tombol native; tautan aktif dengan Enter.
- Fokus: outline berwarna token terlihat di kedua mode dan tidak terpotong.
- Nama: teks terlihat menamai tombol; pemakaian hanya ikon wajib memberi `aria-label` atau `aria-labelledby`.
- Memuat: `aria-busy="true"`, spinner tersembunyi, dan satu pesan `role="status"`.
- Ukuran target: minimal 24 × 24 piksel CSS; ukuran `sm` tetap memenuhi tinggi minimum.
- Kontras: teks memenuhi 4,5:1 dan batas kontrol serta cincin fokus memenuhi 3:1 di kedua mode.
- Gerakan: spinner dan transisi berhenti saat `prefers-reduced-motion` aktif.
- Reflow: label panjang membungkus, dan kontrol tetap dapat dipakai pada zoom 200% dan lebar 320 px.

## Props (dibangkitkan)

| Prop | Type | Default | Wajib | Description |
| --- | --- | --- | --- | --- |
| `variant` | `"default" \| "secondary" \| "destructive" \| "outline" \| "ghost"` | default | Tidak | Gaya visual tombol. |
| `size` | `"default" \| "sm" \| "lg"` | default | Tidak | Ukuran kontrol. |
| `asChild` | `boolean` | false | Tidak | Merender satu elemen anak sebagai ganti tombol native. |
| `loading` | `boolean` | false | Tidak | Memblokir aktivasi dan menampilkan status sibuk selama bernilai benar. |
| `loadingLabel` | `string` | "Loading" | Tidak | Teks untuk pembaca layar yang diumumkan sekali selama status memuat. |
| `className` | `string` | — | Tidak | Kelas tambahan yang digabungkan setelah kelas varian. |

## Dependensi (dibangkitkan)

- `@radix-ui/react-slot`
- `class-variance-authority`
- `lucide-react`
- [http://localhost:3000/r/theme.json](http://localhost:3000/r/theme.json)
- [http://localhost:3000/r/utils.json](http://localhost:3000/r/utils.json)

## Daftar periksa aksesibilitas (dibangkitkan)

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
