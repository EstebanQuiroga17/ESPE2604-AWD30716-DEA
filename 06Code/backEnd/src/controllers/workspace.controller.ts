import { Request, Response } from 'express';
import { WorkspaceService } from '../services/workspace.service';

export class WorkspaceController {
  private workspaceService: WorkspaceService;

  constructor() {
    this.workspaceService = new WorkspaceService();
  }

  public async getWorkspaces(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).currentUser;
      if (!user) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const workspaces = await this.workspaceService.getUserWorkspaces(user.id);
      res.status(200).json({ success: true, data: workspaces });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  public async getWorkspaceDetail(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).currentUser;
      const workspaceId = req.params.workspaceId as string;
      
      if (!user) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const workspace = await this.workspaceService.getWorkspaceById(workspaceId, user.id);
      if (!workspace) {
        res.status(404).json({ success: false, message: 'Workspace not found' });
        return;
      }

      res.status(200).json({ success: true, data: workspace });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  public async getInvoices(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).currentUser;
      const workspaceId = req.params.workspaceId as string;

      if (!user) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const invoices = await this.workspaceService.getWorkspaceInvoices(workspaceId, user.id);
      res.status(200).json({ success: true, data: invoices });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  public async getAtsFiles(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).currentUser;
      const workspaceId = req.params.workspaceId as string;

      if (!user) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const atsFiles = await this.workspaceService.getWorkspaceAtsFiles(workspaceId, user.id);
      res.status(200).json({ success: true, data: atsFiles });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  public async getSummary(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).currentUser;
      const workspaceId = req.params.workspaceId as string;

      if (!user) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const summary = await this.workspaceService.getWorkspaceSummary(workspaceId, user.id);
      res.status(200).json({ success: true, data: summary });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  public async getProcessStatus(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).currentUser;
      const workspaceId = req.params.workspaceId as string;

      if (!user) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const status = await this.workspaceService.getWorkspaceProcessStatus(workspaceId, user.id);
      res.status(200).json({ success: true, data: status });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  public async getProcessSteps(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).currentUser;
      const workspaceId = req.params.workspaceId as string;

      if (!user) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const steps = await this.workspaceService.getWorkspaceProcessSteps(workspaceId, user.id);
      res.status(200).json({ success: true, data: steps });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  public async getLogs(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).currentUser;
      const workspaceId = req.params.workspaceId as string;

      if (!user) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const logs = await this.workspaceService.getWorkspaceLogs(workspaceId, user.id);
      res.status(200).json({ success: true, data: logs });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  public async exportInvoices(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).currentUser;
      const workspaceId = req.params.workspaceId as string;

      if (!user) {
        res.status(401).send('Unauthorized');
        return;
      }

      // Mock empty zip file buffer (Minimal valid zip file)
      const mockZip = Buffer.from([
        0x50, 0x4b, 0x05, 0x06, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
      ]);

      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', `attachment; filename=invoices_${workspaceId}.zip`);
      res.status(200).send(mockZip);
    } catch (error) {
      res.status(500).send('Internal server error');
    }
  }

  public async downloadAtsXml(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).currentUser;
      const workspaceId = req.params.workspaceId as string;

      if (!user) {
        res.status(401).send('Unauthorized');
        return;
      }

      const mockXml = `<?xml version="1.0" encoding="UTF-8"?>
<ats>
  <idInformante>${user.ruc}</idInformante>
  <workspaceId>${workspaceId}</workspaceId>
  <info>Reporte ATS generado para fines academicos</info>
</ats>`;

      res.setHeader('Content-Type', 'application/xml');
      res.setHeader('Content-Disposition', `attachment; filename=ats_${workspaceId}.xml`);
      res.status(200).send(mockXml);
    } catch (error) {
      res.status(500).send('Internal server error');
    }
  }

  public async downloadAtsXlsm(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).currentUser;
      const workspaceId = req.params.workspaceId as string;

      if (!user) {
        res.status(401).send('Unauthorized');
        return;
      }

      // Mock Excel XLSM binary header structure or empty Excel file
      const mockExcel = Buffer.from([
        0x50, 0x4b, 0x03, 0x04, 0x14, 0x00, 0x08, 0x00, 0x08, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
      ]);

      res.setHeader('Content-Type', 'application/vnd.ms-excel.sheet.macroEnabled.12');
      res.setHeader('Content-Disposition', `attachment; filename=ats_${workspaceId}.xlsm`);
      res.status(200).send(mockExcel);
    } catch (error) {
      res.status(500).send('Internal server error');
    }
  }
}
