import { Router } from 'express';
import { getCitizensDues, updateCitizenDues, createCitizenDues } from '../controllers/citizenDues.controller';
import { verifyToken } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getCitizensDues);
router.post('/', verifyToken, createCitizenDues);
router.put('/:id', verifyToken, updateCitizenDues);

export default router;
