import { Router } from 'express';
import { getPaymentRequests, createPaymentRequest, updatePaymentRequest } from '../controllers/paymentRequest.controller';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../../uploads/bukti');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `tf-${Date.now()}${ext}`);
  }
});
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'application/pdf'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Format file tidak didukung. Hanya menerima JPG, PNG, WEBP, atau PDF.'));
  }
};

const upload = multer({ 
  storage, 
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter 
});

import { verifyToken } from '../middleware/auth.middleware';

router.get('/', getPaymentRequests);
router.post('/', verifyToken, upload.single('transferProof'), createPaymentRequest);
router.put('/:id', verifyToken, updatePaymentRequest);

export default router;
