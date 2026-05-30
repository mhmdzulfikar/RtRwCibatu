# Portal Digital RT 005 / RW 02 Jatibening Baru

Portal warga terintegrasi untuk pengelolaan administrasi, transparansi keuangan, dan komunikasi pengumuman resmi di lingkungan RT 005 RW 02 Kelurahan Jatibening Baru, Pondok Gede, Kota Bekasi.

---

## Struktur Direktori Proyek

Agar kode tetap modular, efisien, dan mudah dipahami, arsitektur proyek ini dipecah dari monolit menjadi struktur komponen sebagai berikut:

```text
RtRwCibatu/
├── .env                  # File kredensial default admin (lokal & aman)
├── .env.example          # Contoh berkas konfigurasi env
├── index.html            # Entry point HTML utama aplikasi
├── package.json          # Pengelola dependency npm & script (Vite, React, TS)
├── tsconfig.json         # Aturan kompilasi TypeScript
├── vite.config.ts        # Konfigurasi bundler Vite (plugin React & Tailwind)
└── src/                  # Folder kode sumber utama (Source Code)
    ├── main.tsx          # Entry point React untuk memasang komponen ke DOM HTML
    ├── App.tsx           # Komponen induk utama (navigasi & state database)
    ├── types.ts          # Wadah definisi tipe data TypeScript (Interface)
    ├── security.ts       # Utilitas sesi login admin & sensor data sensitif
    ├── data.ts           # Database awal (Mockup data warga, keuangan, & pengumuman)
    ├── index.css         # Styling visual utama aplikasi
    ├── react-shims.d.ts  # File konfigurasi tipe data tambahan untuk React
    └── components/       # Folder wadah komponen-komponen UI
        ├── Dashboard.tsx          # Tampilan Beranda (statistik warga, jalan pintas navigasi)
        ├── AnnouncementsView.tsx  # Tampilan Pengumuman (kegiatan RT, darurat, dll)
        ├── AdminLoginModal.tsx    # Modal khusus form masuk pengurus/admin RT
        ├── FinancesView.tsx       # Koordinator halaman Keuangan & Iuran
        ├── LetterRequestsView.tsx # Koordinator halaman Pengajuan Surat
        ├── finances/              # Subfolder modular khusus fitur Keuangan
        │   ├── LaporanKasTab.tsx  # Pembukuan kas masuk/keluar & grafik rasio anggaran
        │   ├── StatusIuranTab.tsx # Matriks status iuran per blok rumah (Semester 1)
        │   ├── PersetujuanTab.tsx # Antrean verifikasi admin terhadap setoran warga
        │   └── PayDuesModal.tsx   # Formulir bayar & simulasi bukti upload bagi warga
        └── letters/               # Subfolder modular khusus fitur Pengajuan Surat
            ├── ApplyLetterForm.tsx  # Formulir input permohonan surat pengantar baru
            └── LetterPreviewModal.tsx # Pratinjau surat resmi digital siap cetak ke kertas/PDF
```

---

## Panduan Menjalankan Aplikasi Secara Lokal

**Persyaratan Sistem**
- Node.js (v18+ sangat direkomendasikan)
- npm atau pnpm

**Instalasi & Pengaturan**
1. Instal dependensi:
   ```bash
   npm install
   ```

2. Konfigurasi kredensial admin:
   Salin isi file `.env.example` ke dalam file `.env` baru (atau gunakan file `.env` default yang telah disiapkan secara otomatis):
   ```env
   VITE_ADMIN_USERNAME="adminrt005"
   VITE_ADMIN_PASSWORD="rahasiart005aman"
   ```

3. Jalankan server lokal (development):
   ```bash
   npm run dev
   ```
   Server development default akan berjalan di `http://localhost:3000`.

4. Uji tipe data TypeScript (linting):
   ```bash
   npm run lint
   ```

5. Bangun bundle siap produksi (production):
   ```bash
   npm run build
   npm run preview
   ```

---

## Fitur Utama

- **Dashboard Statistik Warga**: Menyajikan data informatif mengenai Kepala Keluarga, total warga aktif, dan shortcut fitur cepat.
- **Pengumuman Resmi**: Feed dinamis dari pengurus RT dengan penandaan pin untuk informasi darurat atau penting.
- **Laporan Kas & Iuran Transparan**:
  - Saldo riil kas yang diperbarui otomatis saat transaksi disetujui.
  - Matriks iuran bulanan warga per blok rumah dengan status pembayaran (Belum, Pending, Lunas).
  - Simulasi pembayaran mandiri bagi warga dengan upload bukti transfer bank virtual.
  - Antrean persetujuan bendahara RT untuk memverifikasi bukti setoran warga.
- **Pengajuan Surat Pengantar Domisili**:
  - Formulir pendaftaran terstruktur dengan validasi angka NIK & KK.
  - Tanda tangan digital resmi pengurus RT.
  - Tampilan pratinjau surat dinas resmi standar nasional Indonesia yang siap dicetak ke kertas atau disimpan sebagai PDF.
- **Otentikasi Aman Pengurus**:
  - Mode admin dilindungi oleh kredensial variabel lingkungan (env) yang aman.
  - Sistem sesi admin otomatis kedaluwarsa jika tidak ada aktivitas dalam 30 menit demi keamanan data warga.
