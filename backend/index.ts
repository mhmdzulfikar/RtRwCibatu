import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';

// Import Routes
import announcementRoutes from './src/routes/announcement.routes';
import transactionRoutes from './src/routes/transaction.routes';
import citizenDuesRoutes from './src/routes/citizenDues.routes';
import paymentRequestRoutes from './src/routes/paymentRequest.routes';
import letterRoutes from './src/routes/letter.routes';
import authRoutes from './src/routes/auth.routes';
import { verifyToken } from './src/middleware/auth.middleware';
import helmet from 'helmet';
import { sanitizeInput } from './src/middleware/sanitize.middleware';
dotenv.config();
import { honeypotTrap } from 'indo-data-faker';

const app = express();
const PORT = 3001;

// Middlewares
app.use(cors());
app.use(helmet({
  crossOriginResourcePolicy: false,
  crossOriginEmbedderPolicy: false
})); // Melindungi aplikasi tapi mengizinkan frontend membaca gambar
app.use(express.json());
app.use(sanitizeInput); // Membersihkan input (body, query, params) dari ancaman XSS

// ==========================================
// DAFTAR ROUTES (ENDPOINTS)
// ==========================================
import { rateLimit } from 'express-rate-limit';

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 10, // Maksimal 10 request per IP (mencegah brute force)
  message: { error: 'Terlalu banyak percobaan login. Sistem terkunci, silakan coba lagi setelah 15 menit.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/auth', authLimiter, authRoutes);

// ==========================================
// 🚨 HONEYPOT TRAPS (TARPIT) 🚨
// ==========================================
app.get('/api/admin/dump', honeypotTrap({ amount: 5000 }));
app.get('/backup.sql', honeypotTrap({ amount: 10000 }));
app.get('/api/v1/users/export', honeypotTrap({ amount: 5000 }));
app.get('/wp-admin', honeypotTrap({ amount: 8000 }));
app.get('/phpmyadmin', honeypotTrap({ amount: 8000 }));
app.get('/.env', honeypotTrap({ amount: 15000 }));

// Protect all mutating routes except specific resident endpoints
app.use('/api', (req, res, next) => {
  if (req.method === 'GET') return next();
  if (req.path.startsWith('/auth')) return next();

  // Izinkan warga submit data tanpa login
  if (req.method === 'POST') {
    if (req.path.startsWith('/payment-requests')) return next();
    if (req.path.startsWith('/letters')) return next();
  }

  verifyToken(req, res, next);
});

//  Traps for Insider Threat 
app.get('/api/superadmin/database-dump', honeypotTrap({ amount: 20000 }));

app.use('/api/announcements', announcementRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/citizens-dues', citizenDuesRoutes);
app.use('/api/payment-requests', paymentRequestRoutes);
app.use('/api/letters', letterRoutes);

import path from 'path';
import fs from 'fs';

// ==========================================
// RUNNING SERVER & CLEANUP CRON
// ==========================================
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const UPLOADS_BUKTI_DIR = path.join(UPLOADS_DIR, 'bukti');
const UPLOADS_KEGIATAN_DIR = path.join(UPLOADS_DIR, 'kegiatan');

if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
if (!fs.existsSync(UPLOADS_BUKTI_DIR)) fs.mkdirSync(UPLOADS_BUKTI_DIR, { recursive: true });
if (!fs.existsSync(UPLOADS_KEGIATAN_DIR)) fs.mkdirSync(UPLOADS_KEGIATAN_DIR, { recursive: true });

// Serve static uploads
app.use('/uploads', express.static(UPLOADS_DIR));

app.listen(PORT, () => {
  console.log(` Backend server berjalan di http://localhost:${PORT}`);

  // Clean up files older than 7 days HANYA di folder BUKTI
  setInterval(() => {
    fs.readdir(UPLOADS_BUKTI_DIR, (err, files) => {
      if (err) return;
      const now = Date.now();
      const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
      files.forEach(file => {
        const filePath = path.join(UPLOADS_BUKTI_DIR, file);
        fs.stat(filePath, (err, stats) => {
          if (err) return;
          if (now - stats.mtimeMs > SEVEN_DAYS) {
            fs.unlink(filePath, () => { });
          }
        });
      });
    });
  }, 1000 * 60 * 60 * 12); // Cek setiap 12 jam
});
