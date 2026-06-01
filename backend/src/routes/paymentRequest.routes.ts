import { Router } from 'express';
import { getPaymentRequests, createPaymentRequest, updatePaymentRequest } from '../controllers/paymentRequest.controller';

const router = Router();

router.get('/', getPaymentRequests);
router.post('/', createPaymentRequest);
router.put('/:id', updatePaymentRequest);

export default router;
