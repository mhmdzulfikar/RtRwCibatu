import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';

// Import Routes
import announcementRoutes from './src/routes/announcement.routes';
import transactionRoutes from './src/routes/transaction.routes';
import citizenDuesRoutes from './src/routes/citizenDues.routes';
import paymentRequestRoutes from './src/routes/paymentRequest.routes';
import letterRoutes from './src/routes/letter.routes';

dotenv.config();

const app = express();
const PORT = 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// ==========================================
// DAFTAR ROUTES (ENDPOINTS)
// ==========================================
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
