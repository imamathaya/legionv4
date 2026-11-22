# Feature Specification: Fondasi Legion v4 dan Button

**Feature Branch**: `001-fondasi-button`

**Created**: 2026-11-22

**Status**: Draft

**Input**: User description: "Fondasi Legion v4: token light dan dark, komponen Button referensi, dokumentasi, registry, dan pemeriksaan otomatis."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Memakai Button yang konsisten di kedua mode (Priority: P1)

Developer produk memasang Legion sebagai paket, atau menyalin satu item, lalu memakai Button untuk aksi utama. Button tampil benar di mode terang dan gelap tanpa kode tambahan, termasuk saat hover, fokus keyboard, nonaktif, dan memuat.

**Why this priority**: Button adalah komponen pertama yang membuktikan tiga hal sekaligus: token bekerja di dua mode, distribusi paket dan salin berasal dari sumber yang sama, dan perilaku state terkendali. Tanpa ini tidak ada komponen lain yang bisa mengikuti pola yang terbukti.

**Independent Test**: Dari hasil build, render lima varian dan tiga ukuran di kedua mode, lalu bandingkan dengan halaman referensi; uji Tab, Enter, dan Space dari keyboard, serta state nonaktif dan memuat.

**Acceptance Scenarios**:

1. **Given** mode terang, **When** Button varian utama dirender, **Then** warna permukaan dan teksnya berasal dari token semantic dan memenuhi ambang kontras yang berlaku.
2. **Given** mode gelap, **When** mode diganti di level root, **Then** Button berubah tanpa perubahan kode komponen.
3. **Given** pengguna keyboard, **When** Tab mencapai Button, **Then** indikator fokus terlihat dan tidak tertutup elemen lain.
4. **Given** Button dalam state memuat, **When** pengguna menekannya, **Then** tidak ada aksi yang dijalankan dan statusnya diumumkan ke pembaca layar.
5. **Given** Button yang disalin ke proyek lain, **When** pengguna merendernya, **Then** perilakunya identik dengan versi paket.

### User Story 2 - Menemukan pemakaian yang benar dari dokumentasi (Priority: P2)

Anggota tim membuka halaman dokumentasi Button dan menemukan pratinjau semua varian, cara pemasangan (paket maupun salin), kode contoh, tabel props, dependensi, dan catatan aksesibilitas — tanpa perlu membaca kode sumber.

**Why this priority**: Dokumentasi adalah bagian dari definisi selesai di constitution. Tanpa halaman ini, komponen tidak bisa dipakai tim lain meski kodenya benar.

**Independent Test**: Beri satu orang yang belum pernah membuka repo tugas memasang dan merender Button hanya dari halaman dokumentasi; catat waktu dan pertanyaan yang muncul.

**Acceptance Scenarios**:

1. **Given** halaman dokumentasi Button, **When** dibuka, **Then** ketujuh bagian wajib tersedia dan dapat dibaca tanpa membuka kode.
2. **Given** contoh kode di halaman, **When** disalin apa adanya, **Then** komponen tampil sesuai pratinjau.
3. **Given** mode gelap aktif, **When** halaman dibuka, **Then** seluruh pratinjau mengikuti mode tanpa pengaturan tambahan.

### User Story 3 - Agen AI memakai Legion tanpa menebak (Priority: P3)

Agen AI yang tidak membangun Legion diberi satu tugas antarmuka kecil. Ia menemukan Button lewat indeks teks dan metadata komponen, memakai nama props yang benar, dan tidak perlu membaca seluruh repositori.

**Why this priority**: Tujuan utama Legion v4 adalah menjadi landasan bagi AI. Nilai ini hanya terbukti kalau ada tugas nyata yang selesai tanpa intervensi manusia.

**Independent Test**: Jalankan tiga tugas baku dengan agen yang tidak memiliki konteks repo; hitung yang selesai tanpa pertanyaan dan sesuai dokumentasi.

**Acceptance Scenarios**:

1. **Given** indeks teks dan halaman komponen, **When** agen diminta memakai Button, **Then** ia menemukan nama komponen, props, dan contoh tanpa menebak.
2. **Given** metadata mesin, **When** agen memeriksa dependensi komponen, **Then** daftar dependensi sesuai dengan kode sumber.

### Edge Cases

- Label sangat panjang atau teks diperbesar 200%: Button tidak memotong teks hingga hilang dan tinggi tetap dapat dipakai.
- Button hanya ikon: wajib punya nama aksesibel; area target minimal 24 × 24 piksel.
- State nonaktif dan memuat bersamaan: tetap tidak dapat diaktifkan, dan status diumumkan sekali, bukan berulang.
- Preferensi kurangi gerakan aktif: tidak ada animasi yang wajib untuk memahami state.
- Varian destruktif di mode gelap: teks tetap memenuhi ambang kontras.
- Mode berubah saat halaman terbuka: tidak ada kilatan warna yang salah.
- Item salin dipakai sementara paket diperbarui: salinan tidak berubah diam-diam; versi asal tercatat.
- Lebar layar 320 piksel: Button tetap bisa dipakai tanpa kehilangan fungsi.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Tema MUST menyediakan seluruh token semantic yang tercantum di constitution, masing-masing dengan nilai mode terang dan gelap; token yang tidak lengkap MUST menggagalkan pemeriksaan.
- **FR-002**: Setiap pasangan teks di atas permukaan MUST memenuhi 4,5:1 (teks besar 3:1), dan batas kontrol serta indikator fokus MUST memenuhi 3:1, di kedua mode.
- **FR-003**: Button MUST menyediakan lima varian (utama, sekunder, destruktif, garis, hantu) dan tiga ukuran (kecil, sedang, besar).
- **FR-004**: Button MUST mendukung state default, hover, fokus, ditekan, nonaktif, dan memuat.
- **FR-005**: Button MUST dapat dirender sebagai elemen lain (misalnya tautan) tanpa kehilangan gaya maupun atribut aksesibilitasnya.
- **FR-006**: Button hanya ikon MUST mewajibkan nama aksesibel; state memuat MUST diumumkan ke pembaca layar; area target MUST minimal 24 × 24 piksel.
- **FR-007**: Paket dan item salin MUST dihasilkan dari satu sumber yang sama dan MUST identik; tidak boleh ada salinan kedua yang bisa berbeda.
- **FR-008**: Halaman dokumentasi Button MUST memuat pratinjau dan varian, cara pasang sebagai paket, cara pasang sebagai salinan, kode contoh, tabel props, dependensi, dan catatan aksesibilitas.
- **FR-009**: Setiap komponen MUST punya metadata mesin (daftar berkas, dependensi, props, contoh pemakaian) yang sesuai dengan kode sumber.
- **FR-010**: Repositori MUST menyediakan indeks teks komponen dan panduan agen; kesegarannya MUST diperiksa otomatis.
- **FR-011**: Pemeriksaan otomatis MUST menolak literal warna dan nilai arbitrer pada kode komponen.
- **FR-012**: Mode MUST diubah lewat satu mekanisme di level root; komponen MUST NOT memuat kode khusus untuk salah satu mode.
- **FR-013**: Varian dan state MUST NOT dibedakan hanya lewat warna; teks atau ikon pendukung MUST tersedia bila warna adalah satu-satunya pembeda.
- **FR-014**: Perubahan yang merusak pemakaian lama MUST dicatat di changelog dan MUST mengikuti versi semantik.
- **FR-015**: Item salin MUST mencatat versi asal komponen sehingga pengguna tahu salinannya tertinggal.

### Key Entities

- **Token semantic**: nama, nilai mode terang, nilai mode gelap, pasangan permukaan–teks.
- **Komponen Button**: nama, varian, ukuran, state, props, dependensi, versi.
- **Item registry**: nama item, daftar berkas, isi yang dihasilkan, versi sumber.
- **Halaman dokumentasi**: komponen terkait, tujuh bagian wajib, contoh kode, catatan aksesibilitas.
- **Daftar periksa aksesibilitas**: kriteria, hasil otomatis, hasil manual, bukti.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% pasangan token lolos ambang kontras otomatis di kedua mode; nol kegagalan.
- **SC-002**: Peserta baru dapat memasang atau menyalin Button dan merender semua varian dalam waktu kurang dari 10 menit tanpa bertanya; berhasil pada minimal 4 dari 5 percobaan.
- **SC-003**: Nol literal warna dan nol nilai arbitrer terdeteksi pada sumber komponen.
- **SC-004**: Pemeriksaan identitas antara item salin, paket, dan sumber menghasilkan nol perbedaan.
- **SC-005**: Ketujuh bagian dokumentasi tersedia, dan pemeriksaan kesegaran dokumentasi menghasilkan nol perbedaan setelah dibangkitkan ulang.
- **SC-006**: Pemeriksaan aksesibilitas otomatis Button menghasilkan nol pelanggaran, dan seluruh butir daftar periksa keyboard manual lulus.
- **SC-007**: Minimal 2 dari 3 tugas baku AI selesai tanpa pertanyaan dan sesuai dokumentasi.
- **SC-008**: Button tetap dapat dipakai pada zoom 200% dan lebar layar 320 piksel tanpa kehilangan fungsi.

## Out of Scope

- Sembilan komponen pilot lainnya (direncanakan di fitur 002–004).
- Publikasi paket ke registry publik; pada fitur ini paket tetap privat.
- Desain Figma.
- Tema atau branding khusus produk di luar token Legion.

## Assumptions

- Cakupan pilot adalah 10 komponen; fitur ini hanya fondasi dan Button.
- Nama paket masih sementara dan ditandai privat; nama final dikunci saat publikasi pertama.
- Dokumentasi komponen ditulis dalam bahasa Inggris untuk konsumen library; constitution dan spesifikasi berbahasa Indonesia.
- Situs dokumentasi berada di repositori yang sama dan menyediakan pengalih mode untuk verifikasi.
- Konsumen utama adalah tim produk internal dan agen AI.
