# Portal Digital RT 002 / RW 16 Perumahan Taman Cibiru

Selamat datang di Portal Digital RT 002! Aplikasi web ini dibuat dengan tujuan mulia: **mempermudah Warga dan Pengurus RT** dalam mengelola administrasi, transparansi keuangan, dan penyebaran informasi di lingkungan Perumahan Taman Cibiru.

---

## 👥 Panduan Singkat (Untuk Orang Awam)

Aplikasi ini membagi pengguna menjadi dua kelompok: **Warga** dan **Admin (Pengurus RT)**. Berikut adalah cara mudah untuk mulai menggunakannya:

### 1. Cara Masuk (Login) ke Aplikasi
- Buka aplikasi ini di peramban (browser) laptop atau HP Anda.
- Klik tombol **"Login"** (ikon gembok/orang) yang berada di sudut kanan atas layar.
- Masukkan **Username** dan **Password** yang telah diberikan oleh pengurus RT.

### 2. Fitur Untuk Warga 👨‍👩‍👧‍👦
Jika Anda masuk sebagai warga, Anda bisa melakukan hal-hal berikut dari rumah:
- **Pusat Informasi:** Membaca pengumuman terbaru (jadwal kerja bakti, posyandu, peringatan keamanan).
- **Laporan Kas & Iuran Transparan:** Mengecek uang kas RT yang masuk dan keluar, serta melihat apakah rumah Anda sudah bayar iuran bulan ini atau belum.
- **Bayar Iuran Online:** Tidak perlu repot menemui bendahara. Cukup transfer, klik tombol "Bayar Iuran" di aplikasi, lalu unggah foto bukti transfernya.
- **Bikin Surat Pengantar RT:** Mau urus KTP/Domisili? Isi formulirnya secara online. Jika sudah disetujui RT, surat bisa langsung di-*print* (cetak)!

> **Akun Coba-Coba (Demo) Warga:**
> - Username: `warga`
> - Password: `warga123`

### 3. Fitur Untuk Admin (Pengurus RT) 👮‍♂️
Pengurus RT memiliki akses spesial layaknya kapten kapal. Selain fitur warga di atas, Admin bisa:
- **Sebar Pengumuman:** Membuat pengumuman baru atau menyematkan (pin) info darurat agar selalu tampil paling atas.
- **Verifikasi Iuran:** Mengecek foto bukti transfer warga. Jika tekan tombol "Setujui", maka kas RT otomatis bertambah dan status rumah warga tersebut langsung berubah jadi "Lunas".
- **Tanda Tangan Surat:** Menyetujui atau menolak pengajuan surat warga.
- **Kelola Warga:** Membuatkan akun baru untuk warga baru, atau me-reset password warga jika ada yang lupa sandinya.

> **Akun Coba-Coba (Demo) Pengurus RT:**
> - Username: `4DM1NR7R3`
> - Password: `c1B4T6C1K4R4Ng`
*(Pastikan mengganti password ini jika aplikasi sudah digunakan sungguhan ya!)*

---
---

*(Batas Panduan Pengguna. Bagian di bawah ini khusus untuk Tim IT / Developer yang bertugas memasang aplikasi)*

## 🛠️ Panduan Pemasangan (Untuk Developer)

Aplikasi ini menggunakan teknologi **Full-Stack**: React (Frontend) dan Node.js + SQLite (Backend).

### Persyaratan Sistem
- Pastikan komputer server/hosting sudah ter-install [Node.js](https://nodejs.org/).

### Langkah 1: Menyalakan Mesin Server (Backend)
Buka terminal/Command Prompt, lalu arahkan ke folder `backend`:
```bash
cd backend
npm install

# (Opsional) Buat file .env berdasarkan .env.example jika diperlukan

# Menyiapkan database
npx prisma generate
npx prisma db push

# Mengisi database dengan akun Admin dan Warga bawaan
npx prisma db seed

# Menjalankan server backend
npm run dev
```
Backend sekarang menyala di `http://localhost:3001`.

### Langkah 2: Menyalakan Tampilan (Frontend)
Buka terminal baru di folder utama proyek (bukan di dalam folder backend):
```bash
npm install
npm run dev
```
Aplikasi sudah siap digunakan oleh warga di `http://localhost:3000`!

### Teknologi di Balik Layar
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Framer Motion.
- **Backend**: Express.js, Prisma ORM, Database SQLite (tanpa perlu install server SQL terpisah).
- **Keamanan**: Dilengkapi dengan JWT (Token), Bcrypt (Enkripsi Sandi), Anti-XSS, dan pembatasan login (Rate Limiting) untuk mencegah hacker.
