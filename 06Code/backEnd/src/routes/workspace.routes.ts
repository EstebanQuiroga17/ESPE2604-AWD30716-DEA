import { Router } from 'express';
import { WorkspaceController } from '../controllers/workspace.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const workspaceController = new WorkspaceController();

// Basic workspaces routing
router.get('/', authMiddleware, (req, res) => workspaceController.getWorkspaces(req, res));
router.get('/:workspaceId', authMiddleware, (req, res) => workspaceController.getWorkspaceDetail(req, res));

// Sub-resources of workspace
router.get('/:workspaceId/invoices', authMiddleware, (req, res) => workspaceController.getInvoices(req, res));
router.get('/:workspaceId/ats', authMiddleware, (req, res) => workspaceController.getAtsFiles(req, res));
router.get('/:workspaceId/summary', authMiddleware, (req, res) => workspaceController.getSummary(req, res));

// ProcessTracer routing
router.get('/:workspaceId/process-status', authMiddleware, (req, res) => workspaceController.getProcessStatus(req, res));
router.get('/:workspaceId/process-steps', authMiddleware, (req, res) => workspaceController.getProcessSteps(req, res));
router.get('/:workspaceId/invoices/export', authMiddleware, (req, res) => workspaceController.exportInvoices(req, res));
router.get('/:workspaceId/ats/download-xml', authMiddleware, (req, res) => workspaceController.downloadAtsXml(req, res));
router.get('/:workspaceId/ats/download-xlsm', authMiddleware, (req, res) => workspaceController.downloadAtsXlsm(req, res));
router.get('/:workspaceId/logs', authMiddleware, (req, res) => workspaceController.getLogs(req, res));

export default router;
