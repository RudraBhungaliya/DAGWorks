import { Router } from 'express';
import { getLogs } from './log.controller';

const router = Router();

router.get('/', getLogs);

export default router;
