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
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit

router.get('/', getAnnouncements);
router.post('/', upload.single('image'), createAnnouncement);
router.put('/:id', upload.single('image'), updateAnnouncement);
router.delete('/:id', deleteAnnouncement);

export default router;
