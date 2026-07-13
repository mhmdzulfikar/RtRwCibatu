import { Router } from 'express';
import { getPaymentRequests, createPaymentRequest, updatePaymentRequest } from '../controllers/paymentRequest.controller';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `tf-${Date.now()}${ext}`);
  }
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit

router.get('/', getPaymentRequests);
router.post('/', upload.single('transferProof'), createPaymentRequest);
router.put('/:id', updatePaymentRequest);

export default router;
