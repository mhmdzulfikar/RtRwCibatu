# Portal Digital RT 005 / RW 02 Jatibening Baru

Portal warga terintegrasi untuk pengelolaan administrasi, transparansi keuangan, dan komunikasi pengumuman resmi di lingkungan RT 005 RW 02 Kelurahan Jatibening Baru, Pondok Gede, Kota Bekasi.

---

## 🎯 Fitur Utama

- **Sistem Autentikasi**: Login aman dengan peran **Admin** (Pengurus RT) dan **Warga**, didukung oleh JWT dan bcrypt.
- **Pengumuman Resmi**: Feed informasi dinamis dari pengurus RT, dilengkapi dukungan penyematan (pinning) untuk pengumuman darurat.
- **Transparansi Keuangan (Kas & Iuran)**:
  - Pencatatan riwayat transaksi kas (pemasukan & pengeluaran).
  - Matriks iuran bulanan warga per blok rumah dengan status pembayaran (Belum, Pending, Lunas).
  - Pengajuan pembayaran iuran mandiri oleh warga beserta bukti transfer (upload gambar).
  - Antrean persetujuan pembayaran oleh bendahara/admin.
- **Administrasi & Pengajuan Surat**:
  - Fasilitas bagi warga untuk mengajukan surat pengantar (domisili, dll).
  - Tinjauan status persetujuan, penolakan dengan alasan, dan referensi surat.
  - Tanda tangan digital dari pengurus RT dan pratinjau surat siap cetak (PDF).

---

## 🛠️ Teknologi yang Digunakan

Aplikasi ini menggunakan arsitektur **Full-Stack** yang dipisahkan antara client (frontend) dan server (backend).

### Frontend
- **Framework**: [React 19](https://react.dev/) dengan [TypeScript](https://www.typescriptlang.org/)
- **Bundler**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Ikon & Animasi**: Lucide React & Framer Motion (via `motion`)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) dengan [Express.js](https://expressjs.com/)
- **Database & ORM**: [SQLite](https://www.sqlite.org/index.html) dan [Prisma ORM](https://www.prisma.io/)
- **Keamanan**: JWT (JSON Web Tokens), bcrypt, Helmet, XSS-Clean, dan Express Rate Limit
- **Upload File**: Multer

---

## 📂 Struktur Direktori Proyek

```text
RtRwCibatu/
├── backend/                  # 🚀 SERVER BACKEND
│   ├── prisma/               # Konfigurasi ORM dan Database
│   │   ├── schema.prisma     # Skema tabel SQLite (User, Announcement, dll)
│   │   ├── seed.ts           # Skrip inisialisasi data awal (Admin & Warga)
│   │   └── dev.db            # Database SQLite fisik
│   ├── src/                  # Kode Sumber Backend (MVC Pattern)
│   │   ├── config/           # Konfigurasi sistem dan database
│   │   ├── controllers/      # Logika pemrosesan permintaan API
│   │   ├── routes/           # Definisi endpoint (Auth, Keuangan, Surat, dll)
│   │   └── middleware/       # Autentikasi dan pengecekan otorisasi
│   ├── index.ts              # Entry point server backend
│   └── package.json          # Dependensi backend
│
├── src/                      # 🖥️ FRONTEND UI
│   ├── components/           # Komponen UI modular
│   │   ├── finances/         # Modul Keuangan (Kas, Iuran)
│   │   └── letters/          # Modul Pengajuan Surat
│   ├── hooks/                # Custom React Hooks untuk integrasi API
│   ├── App.tsx               # Komponen Induk (Routing dan Layout)
│   ├── data.ts               # Data default/mockup
│   └── types.ts              # Definisi tipe (TypeScript Interfaces)
│
├── .env.example              # Template variabel lingkungan Frontend
├── package.json              # Dependensi frontend
└── vite.config.ts            # Konfigurasi Vite
```

---

## 🚀 Panduan Instalasi dan Menjalankan Proyek Lokal

**Persyaratan Sistem:**
- [Node.js](https://nodejs.org/) (Versi 18 atau lebih baru direkomendasikan)
- `npm`, `yarn`, atau `pnpm`

### 1. Persiapan Backend (Server API)

Buka terminal dan navigasi ke direktori `backend`:

```bash
cd backend
```

Instal dependensi:
```bash
npm install
```

Siapkan variabel lingkungan. Buat file `.env` di dalam folder `backend/` berdasarkan nilai default yang dibutuhkan (seperti `DATABASE_URL="file:./dev.db"`, `JWT_SECRET`, dll).

Inisialisasi database dan Prisma ORM:
```bash
npx prisma generate
npx prisma db push
```

Isi database dengan data awal (Akun Admin dan Warga default):
```bash
npx prisma db seed
# Periksa file prisma/seed.ts untuk melihat default Username dan Password.
```

Jalankan server backend:
```bash
npm run dev
```
> **Backend API** sekarang berjalan di `http://localhost:3001`

### 2. Persiapan Frontend (Aplikasi Web)

Buka jendela terminal baru dan pastikan Anda berada di direktori **root (utama)** proyek.

Instal dependensi UI:
```bash
npm install
```

Konfigurasi variabel lingkungan untuk frontend. Salin `.env.example` menjadi `.env` jika belum ada:
```bash
cp .env.example .env
```

Jalankan server pengembangan UI:
```bash
npm run dev
```
> **Aplikasi Frontend** sekarang berjalan di `http://localhost:3000`

---

## 🔐 Kredensial Default (Dari Seeding)

Jika Anda telah menjalankan `npx prisma db seed`, Anda dapat menggunakan akun berikut untuk masuk ke aplikasi (bisa diubah di `backend/prisma/seed.ts`):

- **Admin (Pengurus RT)**
  - Username: Mengikuti `.env` backend atau default `4DM1NR7R3`
  - Password: Mengikuti `.env` backend atau default `c1B4T6C1K4R4Ng`

- **Warga**
  - Username: `warga`
  - Password: `warga123`

*(Sangat disarankan untuk mengubah password ini saat aplikasi digunakan di lingkungan produksi!)*

---

## 🛡️ Arsitektur Keamanan

Sistem telah dilengkapi beberapa perlindungan:
- **Rate Limiting**: Mencegah serangan brute-force dengan membatasi jumlah permintaan API.
- **Helmet**: Menambahkan berbagai HTTP headers untuk keamanan peramban.
- **XSS Protection**: Memfilter input pengguna untuk mencegah Cross-Site Scripting.
- **Bcrypt Hashing**: Kata sandi tidak pernah disimpan dalam bentuk plain-text di database.
- **JWT Authentication**: Akses token sementara untuk rute API yang dilindungi, dengan verifikasi peran (Role-based access).
