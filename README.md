<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>
## Menjalankan Aplikasi (Panduan singkat)

Panduan ini menjelaskan langkah cepat untuk menjalankan proyek ini secara lokal.

View your app in AI Studio: https://ai.studio/apps/74b5e248-45bf-4671-aab4-05a02d76fa21

- Node.js (v18+ direkomendasikan)
- npm atau pnpm

## Menjalankan Aplikasi (Panduan singkat)

Panduan ini menjelaskan langkah cepat untuk menjalankan proyek ini secara lokal.

**Persyaratan**
- Node.js (v18+ direkomendasikan)
- npm atau pnpm

**Instalasi**
1. Instal dependensi:

   ```bash
   npm install
   ```

2. Buat file environment dengan menyalin contoh (jika tersedia):

   ```bash
   cp .env.example .env.local
   ```

   Jika tidak menggunakan `cp` di Windows PowerShell, salin manual isi `.env.example` ke `.env.local`.

3. Set variabel kunci API di `.env.local` (contoh):

   ```text
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

**Menjalankan (development)**

```bash
npm run dev
```

Server dev default berjalan di `http://localhost:3000` (lihat `package.json` untuk konfigurasi port).

**Build & Preview (production)**

```bash
npm run build
npm run preview
```

**Skrip yang tersedia**
- `npm run dev` — jalankan server development (Vite)
- `npm run build` — bangun bundle untuk produksi
- `npm run preview` — preview hasil build
- `npm run lint` — cek TypeScript tanpa emit

**Catatan**
- Pastikan `GEMINI_API_KEY` terisi jika aplikasi membutuhkan akses ke Gemini/GenAI.
- Gunakan `.env.local` untuk konfigurasi lokal yang tidak perlu di-commit.

Jika mau, saya bisa bantu membuat README versi Inggris/lebih panjang, atau menambahkan bagian Contributing dan License.
