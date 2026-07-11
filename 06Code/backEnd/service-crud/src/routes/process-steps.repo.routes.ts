import { Router } from 'express';
import { ProcessStepsRepoController } from '../controllers/process-steps.repo.controller';

const router = Router();
const processStepsController = new ProcessStepsRepoController();

// GET /repo/process-steps/:userId — process steps for a user
router.get('/:userId', (req, res) => processStepsController.getProcessSteps(req, res));

// PUT /repo/process-steps/:id — update step status
router.put('/:id', (req, res) => processStepsController.updateProcessStep(req, res));

export default router;

