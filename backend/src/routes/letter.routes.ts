import { Router } from 'express';
import { getLetters, createLetter, updateLetter, getLetterForPrint } from '../controllers/letter.controller';
import { verifyToken } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getLetters);
router.post('/', createLetter);
router.put('/:id', updateLetter);
router.post('/:id/print', verifyToken, getLetterForPrint);

export default router;
