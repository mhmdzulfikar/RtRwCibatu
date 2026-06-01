import { Router } from 'express';
import { getTransactions, createTransaction } from '../controllers/transaction.controller';

const router = Router();

router.get('/', getTransactions);
router.post('/', createTransaction);

export default router;
