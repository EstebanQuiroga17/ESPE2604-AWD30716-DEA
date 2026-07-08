import { Request, Response } from 'express';
import { prisma } from '../config/database';

export class AuditRepoController {
  public async getAuditEvents(req: Request, res: Response): Promise<void> {
    try {
      const events = await prisma.auditEvent.findMany({
        where: { taxpayerId: req.params.userId as string },
        orderBy: { timestamp: 'desc' },
        take: 100
      });
      res.json({ success: true, data: events });
    } catch (e) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  public async getAllAuditLogs(req: Request, res: Response): Promise<void> {
    try {
      const logs = await prisma.auditEvent.findMany({
        orderBy: { timestamp: 'desc' },
        take: 100,
        include: { taxpayer: { select: { email: true, ruc: true } } }
      });
      res.json({ success: true, data: logs });
    } catch (e) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  public async getEventByAction(req: Request, res: Response): Promise<void> {
    try {
      const event = await prisma.auditEvent.findFirst({
        where: { taxpayerId: req.params.userId as string, action: req.params.action as string },
        orderBy: { timestamp: 'desc' }
      });
      res.json({ success: true, data: event });
    } catch (e) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  public async getEventsByModule(req: Request, res: Response): Promise<void> {
    try {
      const events = await prisma.auditEvent.findMany({
        where: { taxpayerId: req.params.userId as string, module: { contains: req.params.module as string } },
        orderBy: { timestamp: 'desc' }
      });
      res.json({ success: true, data: events });
    } catch (e) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  public async createAuditEvent(req: Request, res: Response): Promise<void> {
    try {
      const { action, module, details, userId } = req.body;
      const event = await prisma.auditEvent.create({
        data: { action, module, details, taxpayerId: userId }
      });
      res.status(201).json({ success: true, data: event });
    } catch (e) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
}
