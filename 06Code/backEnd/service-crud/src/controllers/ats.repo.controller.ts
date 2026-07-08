import { Request, Response } from 'express';
import { prisma } from '../config/database';

export class AtsRepoController {
  public async getUserAtsFiles(req: Request, res: Response): Promise<void> {
    try {
      const files = await prisma.atsFile.findMany({
        where: { taxpayerId: req.params.userId as string },
        orderBy: { createdAt: 'desc' }
      });
      res.json({ success: true, data: files });
    } catch (e) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  public async getAtsErrorsCount(req: Request, res: Response): Promise<void> {
    try {
      const count = await prisma.atsFile.count({
        where: { taxpayerId: req.params.userId as string, validationErrors: { gt: 0 } }
      });
      res.json({ success: true, data: { count } });
    } catch (e) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  public async createAtsFile(req: Request, res: Response): Promise<void> {
    try {
      const { name, format, periodMonth, periodYear, invoiceCount, validationErrors, userId } = req.body;
      const atsFile = await prisma.atsFile.create({
        data: { name, format, periodMonth, periodYear, invoiceCount, validationErrors, taxpayerId: userId }
      });
      res.status(201).json({ success: true, data: atsFile });
    } catch (e) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
}
