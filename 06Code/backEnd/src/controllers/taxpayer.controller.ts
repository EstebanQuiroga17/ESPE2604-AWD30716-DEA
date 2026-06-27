import { Request, Response } from 'express';
import { prisma } from '../config/database';

export class TaxpayerController {
  public async getAllTaxpayers(req: Request, res: Response): Promise<void> {
    try {
      const taxpayers = await prisma.taxpayer.findMany({
        select: { id: true, ruc: true, firstName: true, lastName: true, email: true, role: true, createdAt: true }
      });
      res.status(200).json({ success: true, data: taxpayers });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  public async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId as string;
      const user = await prisma.taxpayer.findUnique({
        where: { id: userId }
      });
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }
      res.status(200).json({
        success: true,
        data: {
          id: user.id,
          ruc: user.ruc,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  public async getStats(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId as string;
      const user = await prisma.taxpayer.findUnique({
        where: { id: userId }
      });
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }

      const workspacesCount = await prisma.workspace.count({
        where: { taxpayerId: user.id }
      });

      const totalInvoices = await prisma.invoice.count({
        where: { taxpayerId: user.id }
      });

      const lastSyncEvent = await prisma.auditEvent.findFirst({
        where: { taxpayerId: user.id, action: 'INVOICES_DOWNLOAD' },
        orderBy: { timestamp: 'desc' }
      });

      res.status(200).json({
        success: true,
        data: {
          workspacesCount,
          totalInvoices,
          lastSriSync: lastSyncEvent ? lastSyncEvent.timestamp : null
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  public async validateRuc(req: Request, res: Response): Promise<void> {
    try {
      const ruc = req.params.ruc as string;
      if (!ruc || ruc.length !== 13) {
        res.status(200).json({ success: true, valid: false, exists: false });
        return;
      }

      const user = await prisma.taxpayer.findUnique({
        where: { ruc }
      });

      res.status(200).json({
        success: true,
        valid: true,
        exists: !!user
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  public async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId as string;
      const { firstName, lastName } = req.body;
      const updatedUser = await prisma.taxpayer.update({
        where: { id: userId },
        data: { firstName, lastName }
      });
      res.status(200).json({
        success: true,
        data: {
          id: updatedUser.id,
          ruc: updatedUser.ruc,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
}
