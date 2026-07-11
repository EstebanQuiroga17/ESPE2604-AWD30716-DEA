import { Router } from 'express';
import { InvoicesRepoController } from '../controllers/invoices.repo.controller';

const router = Router();
const invoicesController = new InvoicesRepoController();

// GET /repo/invoices/:userId — list invoices for a user
router.get('/:userId', (req, res) => invoicesController.getUserInvoices(req, res));

// GET /repo/invoices/filter/by — filter invoices by RUC and period
router.get('/filter/by', (req, res) => invoicesController.filterInvoices(req, res));

// GET /repo/invoices/count/:userId — count invoices for dashboard
router.get('/count/:userId', (req, res) => invoicesController.countUserInvoices(req, res));

// POST /repo/invoices — bulk save invoices
router.post('/', (req, res) => invoicesController.saveBulkInvoices(req, res));

export default router;

