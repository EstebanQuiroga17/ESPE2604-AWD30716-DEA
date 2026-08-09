import { Request, Response } from 'express';
import { prisma } from '../config/database';

export class ProcessStepsRepoController {

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
