import { Router } from 'express';
import multer from 'multer';
import { AtsController } from '../controllers/ats.controller';

const router = Router();
const atsController = new AtsController();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/build-ats-xlsx', upload.single('zipFile'), (req, res) => atsController.buildAtsXlsx(req, res));

export default router;
