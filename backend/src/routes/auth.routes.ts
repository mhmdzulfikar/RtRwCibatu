import { Router } from 'express';
import { login, updateProfile, resetWargaPassword, recoverAdminPassword, createWargaAccount } from '../controllers/auth.controller';
import { verifyToken } from '../middleware/auth.middleware';

const router = Router();

router.post('/login', login);
router.post('/admin/recover', recoverAdminPassword);
router.put('/profile', verifyToken, updateProfile);
router.put('/admin/reset-warga', verifyToken, resetWargaPassword);
router.post('/admin/create-warga', verifyToken, createWargaAccount);

export default router;
