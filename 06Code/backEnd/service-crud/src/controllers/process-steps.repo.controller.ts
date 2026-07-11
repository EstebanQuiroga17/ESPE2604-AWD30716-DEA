import { Request, Response } from 'express';
import { prisma } from '../config/database';

export class ProcessStepsRepoController {
  public async getProcessSteps(req: Request, res: Response): Promise<void> {
    try {
      const steps = await prisma.processStep.findMany({
        where: { taxpayerId: req.params.userId as string },
        orderBy: { createdAt: 'asc' }
      });
      res.json({ success: true, data: steps });
    } catch (e) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  public async updateProcessStep(req: Request, res: Response): Promise<void> {
    try {
      const { status } = req.body;
      const completedAt = status === 'completed' ? new Date() : undefined;
      const step = await prisma.processStep.update({
        where: { id: req.params.id as string },
        data: { status, completedAt }
      });
      res.json({ success: true, data: step });
    } catch (e) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
}
