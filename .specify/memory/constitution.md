# Based Asset Legion Constitution

Konstitusi proyek **Based Asset Legion**. Design system yang dibangun di repo ini disebut **Legion v4**.

## Core Principles

### I. Semantic Tokens First (NON-NEGOTIABLE)

Komponen tidak boleh memakai nilai mentah di kodenya: tidak ada literal warna (`#…`, `rgb()`, `hsl()`, `oklch()`), tidak ada nilai arbitrer (`bg-[#…]`, `text-[13px]`, `shadow-[…]`, `rounded-[…]`), dan tidak ada px untuk warna, radius, atau bayangan. Semua nilai visual datang dari token.

**Apa yang dihitung sebagai token** — tiga lapis:

1. variabel CSS di `:root` dan `.dark` (`--background`, `--radius`, dan seterusnya);
2. skala bawaan Tailwind yang tersedia sebagai variabel tema (`--text-*`, `--shadow-*`, spacing), dipakai lewat kelas seperti `text-sm`, `shadow-sm`, `p-4`;
3. pemetaan token ke Tailwind lewat `@theme inline`, misalnya `--color-background: var(--background)`, sehingga tersedia `bg-background`, `text-foreground`, `border-border`, `ring-ring`.

Yang dilarang adalah literal dan nilai arbitrer, bukan pemakaian skala Tailwind. Larangan px berlaku untuk nilai visual di kode komponen dan definisi token; angka pada kriteria penerimaan (mis. target 24 × 24 px di Prinsip VI) bukan nilai visual.

Token punya tiga tingkat:

1. **Primitive**: skala mentah yang dinamai menurut warnanya, bukan menurut perannya, mengikuti gaya palet Tailwind — `--color-violet-500`, `--color-neutral-100`, `--color-red-600`. Nama peran seperti "primary" **hanya** dipakai di tingkat semantic.

   Seluruh kelengkungan (radius) komponen bersumber tunggal pada `--radius`, dan skalanya diturunkan dengan rumus shadcn v4 (multiplikatif; `--radius-lg` adalah nilai dasar):

   ```css
   @theme inline {
     --radius-sm: calc(var(--radius) * 0.6);
     --radius-md: calc(var(--radius) * 0.8);
     --radius-lg: var(--radius);
     --radius-xl: calc(var(--radius) * 1.4);
     --radius-2xl: calc(var(--radius) * 1.8);
     --radius-3xl: calc(var(--radius) * 2.2);
     --radius-4xl: calc(var(--radius) * 2.6);
   }
   ```

   Komponen memakai `rounded-sm` sampai `rounded-4xl`; `rounded-[…]` dilarang.

2. **Semantic**: makna pemakaian. **Penamaan mengikuti standar shadcn/ui sepenuhnya, bukan penamaan Legion v3.** Aturannya:

   - **Konvensi pasangan**: token dasar adalah warna permukaan, dan token `-foreground` adalah warna teks dan ikon di atas permukaan itu. Contoh: `primary` berpasangan dengan `primary-foreground`.
   - **Daftar baku** (satu-satunya nama semantic yang boleh dipakai komponen):

     | Kelompok | Token |
     | --- | --- |
     | Halaman | `--background`, `--foreground` |
     | Permukaan | `--card` + `--card-foreground`, `--popover` + `--popover-foreground` |
     | Aksi dan penekanan | `--primary` + `--primary-foreground`, `--secondary` + `--secondary-foreground`, `--muted` + `--muted-foreground`, `--accent` + `--accent-foreground`, `--destructive` + `--destructive-foreground` |
     | Garis dan kontrol | `--border`, `--input`, `--ring` |
     | Bentuk | `--radius`, diturunkan menjadi `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-xl`, `--radius-2xl`, `--radius-3xl`, `--radius-4xl` |
     | Grafik (hanya jika ada komponen grafik; di luar pilot) | `--chart-1` sampai `--chart-5` |
     | Sidebar (hanya jika ada komponen Sidebar; di luar pilot) | `--sidebar`, `--sidebar-foreground`, `--sidebar-primary`, `--sidebar-primary-foreground`, `--sidebar-accent`, `--sidebar-accent-foreground`, `--sidebar-border`, `--sidebar-ring` |

   - **Satu tambahan di luar shadcn**: `--destructive-foreground`. Upstream memakai `text-white` mentah, yang dilarang Prinsip I, dan nilai itu gagal kontras 4,5:1 di mode gelap (2,89:1). Nilainya ditetapkan per mode: light `oklch(0.985 0 0)` (4,56:1 di atas `--destructive`), dark `oklch(0.205 0 0)` (6,19:1).
   - **Pemetaan ke Tailwind**: tiap token didaftarkan sebagai `--color-<nama>` lewat `@theme inline`, sehingga bisa dipakai sebagai kelas seperti `bg-background`, `text-foreground`, `border-border`, `ring-ring`.
   - **Mode gelap**: nilai tiap token di-override di bawah kelas `.dark`. Mekanismenya satu, di level root (mis. `@custom-variant dark (&:is(.dark *))`); tidak ada mekanisme kedua.
   - **Nama Legion v3 tidak dibawa**: `tertiary`, `success`, `warning`, `error`, `information`, serta nama berbentuk `<komponen>-color-<warna>-<varian>-<state>` tidak dipakai di tingkat semantic. Status selain `destructive` **tidak ada** di daftar baku. Bila produk membutuhkannya (misalnya `success`, `warning`, `info`), ia ditambahkan sebagai ekstensi lewat amandemen constitution, dengan pola pasangan yang sama (`--success` + `--success-foreground`), dan tidak masuk pilot.
   - **Format nilai**: `oklch()` untuk semua warna, termasuk alpha bila perlu (mis. `oklch(1 0 0 / 10%)` untuk `--border` dan `--input` di mode gelap). Radius memakai `rem`/`calc`. Hex, `rgb()`, dan `hsl()` tidak dipakai.

3. **Component**: hanya bila token semantik tidak cukup, wajib dengan alasan tertulis di `plan.md` bagian Complexity Tracking. Default-nya: tidak ada token per komponen.

Komponen hanya boleh membaca token semantik dari daftar baku di atas dan token komponen yang disetujui lewat Complexity Tracking. Primitive hanya dibaca oleh definisi token semantik. Menambah, mengganti nama, atau menghapus nama semantic di luar daftar baku membutuhkan amandemen constitution. Kepatuhan token diperiksa otomatis (lint terhadap literal warna dan nilai arbitrer), bukan hanya lewat tinjauan.

### II. Light dan Dark Setara

Setiap token semantik wajib punya nilai light dan dark. Komponen tidak boleh punya kode khusus untuk salah satu mode. Mode diganti dengan satu mekanisme di level root. Kelengkapan ini diperiksa otomatis: token tanpa nilai di salah satu mode adalah kegagalan build, bukan temuan tinjauan. Komponen baru tidak dianggap selesai sebelum terlihat benar di kedua mode.

### III. Mudah Dibaca dan Dipakai AI

Tujuan utama Legion v4 adalah menjadi landasan bagi AI untuk membangun fitur dan tugas di atas Legion. Konsekuensinya:

- Penamaan konsisten di semua komponen (nama prop, nama varian, nama ukuran yang sama untuk konsep yang sama).
- Setiap prop punya komentar penjelasan (JSDoc) satu kalimat.
- Satu komponen = satu tempat kode yang jelas; tanpa abstraksi tersembunyi.
- Setiap komponen punya metadata terbaca mesin (daftar file, dependensi, props, contoh pemakaian) dan halaman dokumentasi dalam bentuk teks biasa.
- Repositori punya satu berkas panduan untuk agen AI (`AGENTS.md`) dan satu indeks teks komponen (`llms.txt`).
- **Dua pembaca AI yang berbeda**: (a) agen yang *membangun* Legion (membaca constitution, spec, plan, tasks, dan `AGENTS.md` di repo), dan (b) agen yang *memakai* Legion untuk membuat fitur di produk (membaca registry, halaman `.md` per komponen, `llms.txt`, dan tipe/JSDoc). Keduanya dipenuhi, dengan sumber yang berbeda.
- **Dibangkitkan, bukan ditulis tangan**: `llms.txt`, halaman `.md`, dan metadata registry dihasilkan otomatis dari kode sumber dan dokumentasi. Pemeriksaannya: hasil generate ulang tidak boleh menghasilkan diff (`generate && git diff --exit-code`). Berkas AI yang basi lebih berbahaya daripada tidak ada.
- **Diukur, bukan diasumsikan**: kemudahan dibaca AI dinilai lewat uji tugas baku; daftar tugas dan ambang lulusnya ditetapkan di spec pilot. Keberadaan berkas bukan bukti.

### IV. Satu Sumber Kode, Dua Cara Pakai

Komponen bisa diambil satuan (disalin ke proyek pengguna) atau sebagai satu package. Keduanya dibangun dari **kode sumber yang sama**. Dilarang menyimpan dua salinan kode yang bisa berbeda. Pemeriksaannya: setiap item registry identik dengan sumbernya, dan tidak ada berkas komponen kedua di repo.

### V. Komposisi, Bukan Konfigurasi

API komponen dibuat kecil. Kustomisasi lewat `className`, sub-komponen yang bisa disusun, dan atribut `data-slot`. Dilarang menambah prop khusus per bagian (pola `xxxClassName` / `xxxStyle` di v3) kecuali ada alasan tertulis di `plan.md` bagian Complexity Tracking.

### VI. Aksesibel Secara Default, Berdasar WCAG 2.2 Level AA (NON-NEGOTIABLE)

Standar dasar semua komponen adalah **WCAG 2.2 Level AA** (versi resmi W3C saat ini; WCAG 3.0 masih draf dan belum menjadi standar kepatuhan). Aksesibilitas dirancang sejak komponen dibuat, bukan diperiksa di akhir.

Aturan minimal untuk setiap komponen:

1. **Primitive teruji**: perilaku kompleks (Dialog, Select, Tabs, Checkbox, Radio, Switch) memakai primitive aksesibel, bukan tulisan sendiri.
2. **Keyboard**: semua fungsi bisa dipakai lewat keyboard tanpa jebakan fokus; urutan fokus masuk akal.
3. **Fokus terlihat dan tidak tertutup**: indikator fokus jelas di light dan dark, dan elemen yang sedang fokus tidak tertutup sepenuhnya oleh elemen lain (WCAG 2.4.7, 2.4.11).
4. **Kontras**: teks minimal 4,5:1 (teks besar 3:1). Batas yang diperlukan untuk mengenali kontrol (mis. border Input, checkbox, tombol outline) dan indikator fokus minimal 3:1 terhadap warna bersebelahan, di **kedua mode** (WCAG 1.4.3, 1.4.11). Garis dekoratif (Card, Table, Divider) tidak tunduk pada batas 3:1.
5. **Ukuran target**: area sentuh/klik minimal 24 × 24 piksel CSS (WCAG 2.5.8). Target 44 × 44 menjadi sasaran untuk komponen yang sering dipakai di layar sentuh.
6. **Bukan hanya warna**: status (error, sukses, terpilih) tidak boleh dibedakan hanya lewat warna (WCAG 1.4.1). Status yang belum punya token khusus ditampilkan dengan teks dan ikon di atas token netral, bukan dengan warna baru di luar daftar baku.
7. **Nama, peran, nilai**: setiap kontrol punya nama yang bisa dibaca pembaca layar, peran yang benar, dan state yang diumumkan (WCAG 4.1.2).
8. **Label dan pesan error**: input punya label yang terhubung; error dijelaskan dengan teks dan dikaitkan ke input (WCAG 3.3.1, 3.3.2).
9. **Gerakan**: animasi menghormati preferensi "kurangi gerakan"; tidak ada fungsi yang hanya bisa dipakai dengan gerakan menyeret (WCAG 2.5.7).
10. **Zoom dan reflow**: komponen tetap bisa dipakai pada zoom 200% dan lebar layar sempit tanpa kehilangan fungsi (WCAG 1.4.4, 1.4.10).
11. **Konten tambahan**: konten yang muncul saat hover atau fokus (Tooltip, Popover, Dropdown) bisa dijangkau keyboard, tidak menutupi konten lain secara permanen, dan bisa ditutup tanpa memindahkan fokus (WCAG 1.4.13).

Bukti kepatuhan: pemeriksaan otomatis (axe, kontras) **dan** daftar periksa manual per komponen (keyboard dan pembaca layar). Pemeriksaan otomatis dijalankan di CI sebagai gate merge; daftar periksa manual disimpan bersama komponen. Pemeriksaan otomatis saja tidak cukup, karena sebagian kriteria hanya bisa dinilai manusia. Halaman dokumentasi setiap komponen mencantumkan kriteria WCAG yang relevan dan cara pemakaian yang benar.

### VII. Dokumentasi Adalah Bagian dari Selesai

Komponen belum selesai sebelum halaman dokumentasinya memuat: preview dan varian, cara install, lihat kode, cara pakai, tabel props, dependensi, catatan aksesibilitas. Halaman dibuat dari kode sumber yang sama dengan komponen (lihat Prinsip IV).

### VIII. Diuji Berdampingan

Setiap komponen punya test untuk varian, state (disabled, loading, error bila relevan), dan perilaku keyboard. Test ditulis bersamaan dengan komponen, bukan sesudahnya.

### IX. Sederhana dan Berversi

Mulai dari yang paling sederhana yang memenuhi spec. Permukaan publik adalah export package dan item registry; perubahan yang merusak salah satunya wajib dicatat di changelog dan mengikuti aturan versi semantik (MAJOR.MINOR.PATCH).

## Standar Teknis

- React 19 dan TypeScript mode ketat.
- Styling memakai Tailwind CSS dengan token dari variabel CSS (menggantikan SCSS Modules di v3).
- Varian komponen memakai satu pola yang sama di semua komponen; pola yang dipakai ditetapkan di plan fitur pertama.
- Perilaku kompleks memakai primitive aksesibel.
- Standar aksesibilitas: WCAG 2.2 Level AA sebagai batas bawah. Kriteria Level AAA diambil bila murah (contoh: indikator fokus yang lebih jelas).
- Cakupan awal: **pilot 10 komponen**, kode dan dokumentasi. Daftar komponennya ditetapkan di spec pilot. Desain Figma di luar cakupan pilot ini.

## Alur Kerja Tim

| Tahap SDD | Penanggung jawab utama | Peninjau |
| --- | --- | --- |
| Constitution | PM | Designer dan Developer ikut meratifikasi |
| Specify | PM | Designer (kebutuhan visual dan pengalaman), Developer (kelayakan) |
| Plan | Developer | PM, Designer (token dan tampilan) |
| Tasks | Developer | PM |
| Implement | Developer (dengan agen AI) | Designer meninjau hasil visual di situs dokumentasi |
| Converge | Developer dan QA menjalankan, PM menyetujui hasil akhir | Designer |

Pembagian dalam Converge: Developer menilai kode, token, build, dan distribusi. QA menjalankan uji manual dan uji ulang, terutama daftar periksa aksesibilitas (keyboard, pembaca layar, zoom, kurangi gerakan) dan uji tugas baku AI, lalu mencatat temuannya. Keduanya harus sepakat sebelum status `Converged` diberikan.

Aturan gerbang:

- Plan tidak boleh melanggar prinsip dan Standar Teknis di atas tanpa entri di Complexity Tracking pada `plan.md`.
- Setiap tahap ditinjau manusia sebelum lanjut ke tahap berikutnya.
- Hasil Implement baru dinyatakan selesai bila Converge melaporkan `Converged`.

`Converged` berarti tidak ada gap terbuka antara spec dan kode pada hasil Converge terakhir. Status ini tidak diberikan bila masih ada daftar periksa aksesibilitas yang belum dijalankan.

## Governance

Constitution ini mengalahkan praktik lain. Perubahan butuh usulan tertulis, persetujuan PM, minimal satu Designer, dan minimal satu Developer, serta catatan dampak pada spec dan plan yang sudah ada. Setiap perubahan menaikkan versi constitution: MAJOR untuk menghapus atau mendefinisikan ulang prinsip, MINOR untuk prinsip atau bagian baru, PATCH untuk klarifikasi. Setiap tinjauan kode dan hasil Converge memeriksa kepatuhan terhadap prinsip I sampai IX. Kompleksitas tambahan harus dibenarkan di `plan.md`.

Bila dua prinsip bertentangan, prinsip bertanda NON-NEGOTIABLE menang. Pertentangan yang tidak selesai dengan aturan itu diselesaikan lewat amandemen, bukan pengecualian per fitur.

**Version**: 1.0.0 | **Ratified**: 2026-11-22 | **Last Amended**: 2026-11-22
