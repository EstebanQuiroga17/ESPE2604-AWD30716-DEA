import { Router } from 'express';
import { SriRepoController } from '../controllers/sri.repo.controller';

const router = Router();
const sriController = new SriRepoController();

// GET /repo/sri/status/:userId — last SRI_CONNECT event within 24h
router.get('/status/:userId', (req, res) => sriController.getLastSriStatus(req, res));

// GET /repo/sri/history/:userId — SRI connection history
router.get('/history/:userId', (req, res) => sriController.getSriHistory(req, res));

// POST /repo/sri/connect — log SRI connection event
router.post('/connect', (req, res) => sriController.logSriConnection(req, res));

export default router;

