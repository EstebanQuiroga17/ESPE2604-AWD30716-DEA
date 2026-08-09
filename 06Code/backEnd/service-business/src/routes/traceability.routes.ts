import { Router } from 'express';
import { TraceabilityController } from '../controllers/traceability.controller';

const router = Router();
const traceabilityController = new TraceabilityController();


router.put('/process/:stepId', (req, res) => traceabilityController.updateStep(req, res));

export default router;
