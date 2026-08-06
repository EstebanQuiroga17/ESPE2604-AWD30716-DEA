import { Router } from 'express';
import { WorkspacesRepoController } from '../controllers/workspaces.repo.controller';

const router = Router();
const workspacesController = new WorkspacesRepoController();

// GET /repo/workspaces/:userId — list workspaces for a user
router.get('/:userId', (req, res) => workspacesController.getUserWorkspaces(req, res));

// GET /repo/workspaces/detail/:id — get single workspace (with ownership check)
router.get('/detail/:id', (req, res) => workspacesController.getWorkspaceDetail(req, res));





// GET /repo/workspaces/process-steps/:id — process steps for a workspace
router.get('/process-steps/:id', (req, res) => workspacesController.getWorkspaceProcessSteps(req, res));

// GET /repo/workspaces/logs/:id — audit logs for a workspace
router.get('/logs/:id', (req, res) => workspacesController.getWorkspaceLogs(req, res));

// POST /repo/workspaces — create workspace
router.post('/', (req, res) => workspacesController.createWorkspace(req, res));

// DELETE /repo/workspaces/:id — delete workspace
router.delete('/:id', (req, res) => workspacesController.deleteWorkspace(req, res));

export default router;

