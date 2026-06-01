# Portal Digital RT 005 / RW 02 Jatibening Baru

Portal warga terintegrasi untuk pengelolaan administrasi, transparansi keuangan, dan komunikasi pengumuman resmi di lingkungan RT 005 RW 02 Kelurahan Jatibening Baru, Pondok Gede, Kota Bekasi.

---

## Struktur Direktori Proyek

Aplikasi ini sekarang menggunakan arsitektur **Full-Stack (React Frontend + Node.js/Express Backend + SQLite)**. Arsitektur proyek dibagi menjadi dua bagian utama:

```text
RtRwCibatu/
├── backend/                  # 🚀 SERVER BACKEND (Node.js + Express)
│   ├── prisma/               # Konfigurasi Database ORM
│   │   ├── schema.prisma     # Skema tabel database SQLite
│   │   └── dev.db            # File Database SQLite asli
│   ├── src/                  # Logika API dengan pola MVC (Model-View-Controller)
│   │   ├── config/           # Koneksi ke PrismaClient
│   │   ├── controllers/      # Otak utama (Logika pengolahan data)
│   │   └── routes/           # Daftar jalan tol endpoint (misal: /api/announcements)
│   ├── index.ts              # Entry point utama Server Express (berjalan di port 3001)
│   └── package.json          # Dependency backend (express, cors, prisma, dll)
│
├── src/                      # 🖥️ FRONTEND UI (React + TypeScript + Vite)
│   ├── hooks/                # Custom hooks (useAppData.ts sekarang me-fetch dari API Backend)
│   ├── components/           # Komponen-komponen UI modular (Dashboard, Modals, Tabs)
│   │   ├── finances/         # Subfolder modular khusus fitur Keuangan
│   │   └── letters/          # Subfolder modular khusus fitur Pengajuan Surat
│   ├── data.ts               # Data mockup awal (sebelum terkoneksi ke backend)
│   ├── types.ts              # Wadah definisi tipe data TypeScript (Interface)
│   ├── security.ts           # Logika sesi admin
│   └── App.tsx               # Komponen Induk Aplikasi
│
├── .env.example              # Contoh konfigurasi kredensial admin Frontend
├── package.json              # Dependency frontend
└── vite.config.ts            # Bundler Vite
```

---

## Panduan Menjalankan Aplikasi Secara Lokal

**Persyaratan Sistem**
- Node.js (v18+ sangat direkomendasikan)
- npm atau pnpm

### 1. Menjalankan Backend Server (Terminal 1)
Buka terminal, masuk ke folder `backend/`, instal dependensi, lalu jalankan server:
```bash
cd backend
npm install
npx prisma generate
npm run dev
```
Server backend akan menyala di `http://localhost:3001`. Semua data sekarang akan disimpan ke dalam database SQLite secara permanen!

### 2. Menjalankan Frontend React (Terminal 2)
Buka tab terminal baru, tetap di folder utama (root), instal dependensi, lalu jalankan UI:
```bash
npm install
npm run dev
```
Aplikasi warga (UI) akan berjalan di `http://localhost:3000`.

### Konfigurasi Admin
Salin isi file `.env.example` ke dalam file `.env` baru (atau gunakan file `.env` default yang telah disiapkan secara otomatis):
```env
VITE_ADMIN_USERNAME="adminrt005"
VITE_ADMIN_PASSWORD="rahasiart005aman"
```

---

## Fitur Utama

- **Database SQLite Dinamis**: Data warga, kas, dan surat kini tersimpan ke database fisik di backend, bukan lagi di memori peramban sementara (*localStorage*).
- **Pengumuman Resmi**: Feed dinamis dari pengurus RT dengan penandaan pin untuk informasi darurat atau penting.
- **Laporan Kas & Iuran Transparan**:
  - Saldo riil kas yang diperbarui otomatis dari tabel database.
  - Matriks iuran bulanan warga per blok rumah dengan status pembayaran (Belum, Pending, Lunas).
  - Simulasi pembayaran mandiri bagi warga dengan upload bukti transfer bank virtual.
  - Antrean persetujuan bendahara RT untuk memverifikasi bukti setoran warga.
- **Pengajuan Surat Pengantar Domisili**:
  - Tanda tangan digital resmi pengurus RT dan pratinjau surat siap cetak (PDF).
- **Arsitektur MVC yang Rapi**:
  - Backend dipisahkan menjadi *Controllers* dan *Routes* untuk kemudahan *maintenance* oleh developer di masa depan.
