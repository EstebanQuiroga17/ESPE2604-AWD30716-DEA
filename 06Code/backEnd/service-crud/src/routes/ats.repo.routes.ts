import { Router } from 'express';
import { AtsRepoController } from '../controllers/ats.repo.controller';

const router = Router();
const atsController = new AtsRepoController();

// GET /repo/ats/:userId — list ATS files for a user
router.get('/:userId', (req, res) => atsController.getUserAtsFiles(req, res));

// GET /repo/ats/errors/count/:userId — count ATS files with errors (for dashboard)
router.get('/errors/count/:userId', (req, res) => atsController.getAtsErrorsCount(req, res));

// POST /repo/ats — save an ATS file record
router.post('/', (req, res) => atsController.createAtsFile(req, res));

export default router;

