import { Request, Response } from 'express';
import { prisma } from '../config/database';

export class WorkspacesRepoController {
  public async getUserWorkspaces(req: Request, res: Response): Promise<void> {
    try {
      const workspaces = await prisma.workspace.findMany({
        where: { taxpayerId: req.params.userId as string },
        orderBy: { createdAt: 'desc' }
      });
      res.json({ success: true, data: workspaces });
    } catch (e) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  public async getWorkspaceDetail(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.query;
      const workspace = await prisma.workspace.findFirst({
        where: { id: req.params.id as string, ...(userId ? { taxpayerId: userId as string } : {}) }
      });
      res.json({ success: true, data: workspace });
    } catch (e) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  public async getWorkspaceInvoices(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.query;
      const invoices = await prisma.invoice.findMany({
        where: { workspaceId: req.params.id as string, ...(userId ? { taxpayerId: userId as string } : {}) }
      });
      res.json({ success: true, data: invoices });
    } catch (e) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  public async getWorkspaceAtsFiles(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.query;
      const atsFiles = await prisma.atsFile.findMany({
        where: { workspaceId: req.params.id as string, ...(userId ? { taxpayerId: userId as string } : {}) }
      });
      res.json({ success: true, data: atsFiles });
    } catch (e) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  public async getWorkspaceProcessSteps(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.query;
      const steps = await prisma.processStep.findMany({
        where: { workspaceId: req.params.id as string, ...(userId ? { taxpayerId: userId as string } : {}) },
        orderBy: { createdAt: 'asc' }
      });
      res.json({ success: true, data: steps });
    } catch (e) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  public async getWorkspaceLogs(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.query;
      const whereClause: any = {
        OR: [{ details: { contains: req.params.id as string } }, { module: { contains: 'Workspace' } }]
      };
      if (userId) whereClause.taxpayerId = userId;
      const events = await prisma.auditEvent.findMany({ where: whereClause, orderBy: { timestamp: 'desc' }, take: 50 });
      res.json({ success: true, data: events });
    } catch (e) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  public async createWorkspace(req: Request, res: Response): Promise<void> {
    try {
      const { name, description, period, workspaceLocation, userId } = req.body;
      
      // Fallbacks in case period is a simple string for legacy tests
      let periodYear = 2025;
      let periodMonth = null;
      let periodSemester = null;
      let periodType = 'monthly';

      if (period && typeof period === 'object') {
        periodYear = period.year;
        periodType = period.type || 'monthly';
        periodMonth = period.month || null;
        periodSemester = period.semester || null;
      } else if (period && typeof period === 'string') {
        periodYear = parseInt(period.split('-')[0]) || 2025;
        periodMonth = parseInt(period.split('-')[1]) || null;
      }

      const workspace = await prisma.workspace.create({
        data: {
          name: name || `Workspace ${periodYear}`,
          description: description || null,
          periodYear,
          periodMonth,
          periodType,
          periodSemester,
          workspaceLocation,
          taxpayerId: userId
        }
      });
      res.status(201).json({ success: true, data: workspace });
    } catch (e) {
      console.error('Error creating workspace:', e);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  public async deleteWorkspace(req: Request, res: Response): Promise<void> {
    try {
      await prisma.workspace.delete({ where: { id: req.params.id as string } });
      res.json({ success: true, message: 'Workspace deleted successfully' });
    } catch (e) {
      console.error('Error deleting workspace:', e);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
}
