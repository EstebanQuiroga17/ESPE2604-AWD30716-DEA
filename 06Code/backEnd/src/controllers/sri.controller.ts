import { Request, Response } from 'express';
import { SriService } from '../services/sri.service';

export class SriController {
  private sriService: SriService;

  constructor() {
    this.sriService = new SriService();
  }

  public async getSriStatus(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).currentUser;
      if (!user) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const connection = await this.sriService.getSriConnectionStatus(user.id);
      res.status(200).json({
        success: true,
        data: {
          connected: connection.connected,
          connectionStatus: connection.connected ? 'connected' : 'disconnected',
          lastChecked: connection.lastChecked,
          ruc: user.ruc
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  public async getSriHistory(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).currentUser;
      if (!user) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const history = await this.sriService.getSriHistory(user.id);
      res.status(200).json({
        success: true,
        data: history
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
}
