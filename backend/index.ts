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
dotenv.config();

const app = express();
const PORT = 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// ==========================================
// DAFTAR ROUTES (ENDPOINTS)
// ==========================================
app.use('/api/auth', authRoutes);

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

app.use('/api/announcements', announcementRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/citizens-dues', citizenDuesRoutes);
app.use('/api/payment-requests', paymentRequestRoutes);
app.use('/api/letters', letterRoutes);

// ==========================================
// JALANKAN SERVER
// ==========================================
app.listen(PORT, () => {
  console.log(` Backend server berjalan di http://localhost:${PORT}`);
});
