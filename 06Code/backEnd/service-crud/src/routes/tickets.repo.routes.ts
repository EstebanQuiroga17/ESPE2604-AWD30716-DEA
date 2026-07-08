import { Router } from 'express';
import { TicketsRepoController } from '../controllers/tickets.repo.controller';

const router = Router();
const ticketsController = new TicketsRepoController();

// GET /repo/tickets — all tickets (for admin)
router.get('/', (req, res) => ticketsController.getAllTickets(req, res));

// GET /repo/tickets/:userId — tickets for a specific user
router.get('/:userId', (req, res) => ticketsController.getUserTickets(req, res));

// POST /repo/tickets — create a support ticket
router.post('/', (req, res) => ticketsController.createTicket(req, res));

// PUT /repo/tickets/:id/status — update ticket status
router.put('/:id/status', (req, res) => ticketsController.updateTicketStatus(req, res));

export default router;

