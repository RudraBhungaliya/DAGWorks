import { Router } from 'express';
import { login, logout, getMe } from './auth.controller';

const router = Router();

router.post('/login', login);
router.post('/logout', logout);
router.get('/me', getMe);

export default router;
