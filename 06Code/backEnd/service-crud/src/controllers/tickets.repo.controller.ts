import { Request, Response } from 'express';
import { prisma } from '../config/database';

export class TicketsRepoController {
  public async getAllTickets(req: Request, res: Response): Promise<void> {
    try {
      const tickets = await prisma.ticket.findMany({
        orderBy: { createdAt: 'desc' },
        include: { taxpayer: { select: { firstName: true, lastName: true, email: true } } }
      });
      res.json({ success: true, data: tickets });
    } catch (e) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  public async getUserTickets(req: Request, res: Response): Promise<void> {
    try {
      const tickets = await prisma.ticket.findMany({
        where: { taxpayerId: req.params.userId as string },
        orderBy: { createdAt: 'desc' }
      });
      res.json({ success: true, data: tickets });
    } catch (e) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  public async createTicket(req: Request, res: Response): Promise<void> {
    try {
      const { subject, category, priority, description, userId } = req.body;
      const ticket = await prisma.ticket.create({
        data: { subject, category, priority, description, taxpayerId: userId }
      });
      res.status(201).json({ success: true, data: ticket });
    } catch (e) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  public async updateTicketStatus(req: Request, res: Response): Promise<void> {
    try {
      const { status } = req.body;
      const updated = await prisma.ticket.update({ where: { id: req.params.id as string }, data: { status } });
      res.json({ success: true, data: updated });
    } catch (e) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
}
