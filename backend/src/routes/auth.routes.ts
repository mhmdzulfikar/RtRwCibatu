import { Router } from 'express';
import { login, updateProfile, resetWargaPassword, recoverAdminPassword } from '../controllers/auth.controller';
import { verifyToken } from '../middleware/auth.middleware';

const router = Router();

router.post('/login', login);
router.post('/admin/recover', recoverAdminPassword);
router.put('/profile', verifyToken, updateProfile);
router.put('/admin/reset-warga', verifyToken, resetWargaPassword);

export default router;
