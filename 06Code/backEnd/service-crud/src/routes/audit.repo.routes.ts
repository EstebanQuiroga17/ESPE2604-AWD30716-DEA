import { Router } from 'express';
import { AuditRepoController } from '../controllers/audit.repo.controller';

const router = Router();
const auditController = new AuditRepoController();

// GET /repo/audit/:userId — audit events for a user
router.get('/:userId', (req, res) => auditController.getAuditEvents(req, res));

// GET /repo/audit/all/logs — all audit events (for admin)
router.get('/all/logs', (req, res) => auditController.getAllAuditLogs(req, res));

// GET /repo/audit/action/:userId/:action — events by action (e.g. SRI_CONNECT)
router.get('/action/:userId/:action', (req, res) => auditController.getEventByAction(req, res));

// GET /repo/audit/module/:userId/:module — events by module (e.g. 'Integración SRI')
router.get('/module/:userId/:module', (req, res) => auditController.getEventsByModule(req, res));

// POST /repo/audit — log an audit event
router.post('/', (req, res) => auditController.createAuditEvent(req, res));

export default router;

