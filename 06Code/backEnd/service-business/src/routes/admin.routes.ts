import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const adminController = new AdminController();

router.use(authMiddleware);

router.get('/users', (req, res) => adminController.getUsers(req, res));
router.patch('/users/:userId/status', (req, res) => adminController.updateUserStatus(req, res));
router.delete('/users/:userId', (req, res) => adminController.deleteUser(req, res));



export default router;
