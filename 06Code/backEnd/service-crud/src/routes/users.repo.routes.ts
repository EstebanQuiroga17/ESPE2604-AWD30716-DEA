import { Router } from 'express';
import { UsersRepoController } from '../controllers/users.repo.controller';

const router = Router();
const usersController = new UsersRepoController();

// GET /repo/users/:id
router.get('/:id', (req, res) => usersController.getUserById(req, res));

// GET /repo/users/ruc/:ruc
router.get('/ruc/:ruc', (req, res) => usersController.getUserByRuc(req, res));

// GET /repo/users — list all (for admin)
router.get('/', (req, res) => usersController.getAllUsers(req, res));

// POST /repo/users/find — find by email or ruc (login lookup)
router.post('/find', (req, res) => usersController.findUser(req, res));

// POST /repo/users — create user
router.post('/', (req, res) => usersController.createUser(req, res));

// PUT /repo/users/:id — update user profile
router.put('/:id', (req, res) => usersController.updateUserProfile(req, res));

// PUT /repo/users/:id/password — update password
router.put('/:id/password', (req, res) => usersController.updateUserPassword(req, res));

// DELETE /repo/users/:id — delete user + cascade
router.delete('/:id', (req, res) => usersController.deleteUser(req, res));

export default router;

