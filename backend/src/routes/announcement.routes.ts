import { Router } from 'express';
import { getAnnouncements, createAnnouncement, deleteAnnouncement, updateAnnouncement } from '../controllers/announcement.controller';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();

// Configure multer storage for announcements
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../../uploads/kegiatan');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `ann-${Date.now()}${ext}`);
  }
});
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Format file tidak didukung. Hanya menerima JPG, PNG, atau WEBP.'));
  }
};

const upload = multer({ 
  storage, 
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter 
}); 

import { verifyToken } from '../middleware/auth.middleware';

router.get('/', getAnnouncements);
router.post('/', verifyToken, upload.single('image'), createAnnouncement);
router.put('/:id', verifyToken, upload.single('image'), updateAnnouncement);
router.delete('/:id', verifyToken, deleteAnnouncement);

export default router;
