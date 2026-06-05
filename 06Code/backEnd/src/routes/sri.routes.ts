import { Router } from 'express';
import { SriController } from '../controllers/sri.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const sriController = new SriController();

router.get('/status', authMiddleware, (req, res) => sriController.getSriStatus(req, res));
router.get('/history', authMiddleware, (req, res) => sriController.getSriHistory(req, res));

export default router;
