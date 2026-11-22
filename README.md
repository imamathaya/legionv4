# legionv4

Repositori ini memakai **[GitHub Spec Kit](https://github.com/github/spec-kit)** untuk
mengembangkan fitur dengan metode **Spec-Driven Development (SDD)**: tentukan *apa* dan
*mengapa* lewat spesifikasi, baru turunkan menjadi rencana, daftar tugas, dan implementasi.

Spesifikasi, rencana, dan tugas disimpan sebagai Markdown di dalam repo (`specs/`), sehingga
setiap perubahan bisa ditinjau seperti kode dan tetap terbaca oleh manusia maupun agent.

## Prasyarat

- Python 3.11+
- [`uv`](https://docs.astral.sh/uv/) (`curl -LsSf https://astral.sh/uv/install.sh | sh`)
- Git
- Agent coding yang mendukung skills, misalnya GitHub Copilot (VS Code / Copilot coding agent)

## Instalasi CLI

Repo ini diinisialisasi dengan Specify CLI **1.4.3**. Pasang versi yang sama agar template dan
script cocok:

```bash
uv tool install specify-cli==1.4.3
specify version
```

Verifikasi project:

```bash
specify integration status   # default: copilot, 0 modified/missing file
specify check                # cek tool yang tersedia
```

## Struktur

```text
.specify/
├── memory/constitution.md      # prinsip proyek (diisi lewat /speckit-constitution)
├── templates/                  # spec, plan, tasks, checklist
├── scripts/bash/               # create-new-feature, setup-plan, setup-tasks, ...
├── workflows/speckit/          # definisi alur SDD lengkap
└── integration.json            # integrasi agent aktif + versi
.github/skills/speckit-*/       # skill yang dipanggil agent (Copilot)
specs/NNN-nama-fitur/           # hasil kerja per fitur
```

`.specify/` dan `.github/skills/` **di-commit**. Jangan mengedit file hasil generate secara
manual; kustomisasi dilakukan lewat *preset* atau *project-local override*
([dokumentasi](https://github.github.io/spec-kit/how-to/customization.html)).

## Alur SDD

Jalankan perintah berikut di dalam chat agent, **satu per satu**, dan tinjau hasilnya sebelum
lanjut. Buka folder project ini di VS Code dengan Copilot Chat, lalu panggil skill-nya:

| Urutan | Perintah | Hasil |
| --- | --- | --- |
| 1 | `/speckit-constitution` | Prinsip proyek di `.specify/memory/constitution.md` (sekali per proyek) |
| 2 | `/speckit-specify <deskripsi fitur>` | `specs/NNN-fitur/spec.md` |
| 3 | `/speckit-clarify` *(opsional)* | Pertanyaan untuk menutup area yang masih ambigu |
| 4 | `/speckit-plan <stack & constraint>` | `specs/NNN-fitur/plan.md`, `research.md`, `data-model.md`, `contracts/` |
| 5 | `/speckit-checklist` *(opsional)* | Checklist kualitas persyaratan |
| 6 | `/speckit-tasks` | `specs/NNN-fitur/tasks.md` |
| 7 | `/speckit-analyze` *(opsional)* | Laporan konsistensi spec ↔ plan ↔ tasks |
| 8 | `/speckit-implement` | Implementasi kode sesuai `tasks.md` |
| 9 | `/speckit-converge` | Menilai kondisi kode dan menambah tugas yang belum selesai |

Catatan:

- **Mulai dari constitution.** Isi prinsip yang benar-benar dipakai proyek (kualitas kode,
  testing, keamanan). Semua perintah berikutnya mengacu ke file ini.
- Spesifikasi tidak menyebut teknologi; keputusan stack masuk di tahap `plan`.
- Ulangi langkah 2–9 untuk setiap fitur. Nomor fitur berurutan otomatis (`001`, `002`, ...).
- Bila agent meminta `export SPECIFY_FEATURE=...`, ikuti perintah yang dicetaknya agar perintah
  berikutnya menunjuk fitur yang sama.

## Contoh sesi

```text
/speckit-constitution Prinsip: TypeScript strict, test untuk setiap perilaku publik,
                      tidak ada dependensi baru tanpa alasan tertulis.

/speckit-specify Aplikasi pencatat pengeluaran: pengguna bisa mencatat pengeluaran,
                 melihat total per kategori, dan mengekspor CSV. Tanpa login.

/speckit-plan Gunakan Next.js + TypeScript, data lokal di SQLite, tanpa layanan eksternal.

/speckit-tasks
/speckit-implement
```

## Menambah agent lain

Default repo ini adalah **copilot**. Untuk memakai agent lain (mis. Claude Code, Cursor,
Gemini), ganti integrasinya:

```bash
specify integration switch claude          # Claude Code
specify integration switch cursor-agent    # Cursor
specify integration switch gemini          # Gemini CLI
specify integration status
```

`switch` mengganti integrasi default (skill agent lama dihapus). Menambah integrasi kedua
sekaligus hanya otomatis bila semua integrasi *multi-install safe* — `copilot` tidak, sehingga
`specify integration install <key>` perlu `--force`.

Untuk tim dengan agent berbeda-beda, kembalikan ke keadaan netral sebelum commit:

```bash
specify integration switch none
```

## Upgrade

```bash
uv tool install --force specify-cli==<versi-baru>
specify self check                     # cek rilis terbaru
specify integration upgrade            # sinkronkan template/script/skill
```

Tinjau diff hasil upgrade sebelum commit; file yang sudah dimodifikasi tidak ditimpa tanpa
`--force`.

## Referensi

- [Spec Kit](https://github.com/github/spec-kit)
- [Dokumentasi & quickstart](https://github.github.io/spec-kit/)
- [Filosofi SDD](https://github.github.io/spec-kit/how-to/sdd.html)
- [Referensi perintah](https://github.github.io/spec-kit/reference/agentic-sdd.html)
