import { Router } from 'express';
import { getCitizensDues, updateCitizenDues } from '../controllers/citizenDues.controller';

const router = Router();

router.get('/', getCitizensDues);
router.put('/:id', updateCitizenDues);

export default router;
