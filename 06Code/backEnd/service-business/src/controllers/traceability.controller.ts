import { Request, Response } from 'express';
import { crudClient } from '../http-client/crud.client';

export class TraceabilityController {

  public async updateStep(req: Request, res: Response): Promise<void> {
    try {
      const { stepId } = req.params;
      const { status } = req.body;
      const result = await crudClient.put(`/repo/process-steps/${stepId}`, { status });
      res.status(200).json(result);
    } catch (error) { res.status(500).json({ success: false, message: 'Internal server error' }); }
  }
}
