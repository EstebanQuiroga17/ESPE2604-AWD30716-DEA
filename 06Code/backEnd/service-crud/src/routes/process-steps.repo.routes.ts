import { Router } from 'express';
import { ProcessStepsRepoController } from '../controllers/process-steps.repo.controller';

const router = Router();
const processStepsController = new ProcessStepsRepoController();

// PUT /repo/process-steps/:id — update step status
router.put('/:id', (req, res) => processStepsController.updateProcessStep(req, res));

export default router;
