import { Router } from 'express';
import { getTransactions, createTransaction } from '../controllers/transaction.controller';

import { verifyToken } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getTransactions);
router.post('/', verifyToken, createTransaction);

export default router;
