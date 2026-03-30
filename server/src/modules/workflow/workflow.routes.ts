import { Router } from 'express';
import { generateWorkflow, getWorkflows, getWorkflow, saveWorkflow, executeWorkflow } from './workflow.controller';

const router = Router();

router.post('/generate', generateWorkflow);
router.get('/', getWorkflows);
router.get('/:id', getWorkflow);
router.put('/:id', saveWorkflow);
router.post('/:id/execute', executeWorkflow);

export default router;
