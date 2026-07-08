import { Request, Response } from 'express';
import { prisma } from '../config/database';

export class SriRepoController {
  public async getLastSriStatus(req: Request, res: Response): Promise<void> {
    try {
      const lastConnect = await prisma.auditEvent.findFirst({
        where: { taxpayerId: req.params.userId as string, action: 'SRI_CONNECT' },
        orderBy: { timestamp: 'desc' }
      });
      res.json({ success: true, data: lastConnect });
    } catch (e) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  public async getSriHistory(req: Request, res: Response): Promise<void> {
    try {
      const history = await prisma.auditEvent.findMany({
        where: { taxpayerId: req.params.userId as string, module: { contains: 'SRI' } },
        orderBy: { timestamp: 'desc' }
      });
      res.json({ success: true, data: history });
    } catch (e) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  public async logSriConnection(req: Request, res: Response): Promise<void> {
    try {
      const { userId, connected } = req.body;
      const event = await prisma.auditEvent.create({
        data: {
          action: connected ? 'SRI_CONNECT' : 'SRI_DISCONNECT',
          module: 'Integración SRI',
          details: connected ? 'Vinculación exitosa con portal SRI en línea' : 'Sesión con SRI finalizada',
          taxpayerId: userId
        }
      });
      res.status(201).json({ success: true, data: event });
    } catch (e) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
}
