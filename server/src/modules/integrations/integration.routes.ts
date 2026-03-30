import { Router } from 'express';
import { getIntegrations, connectIntegration, disconnectIntegration } from './integration.controller';

const router = Router();

router.get('/', getIntegrations);
router.post('/:id/connect', connectIntegration);
router.post('/:id/disconnect', disconnectIntegration);

export default router;
