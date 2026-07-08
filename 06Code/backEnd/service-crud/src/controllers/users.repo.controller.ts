import { Request, Response } from 'express';
import { prisma } from '../config/database';

export class UsersRepoController {
  public async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const user = await prisma.taxpayer.findUnique({ where: { id: req.params.id as string } });
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }
      res.json({ success: true, data: user });
    } catch (e) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  public async getUserByRuc(req: Request, res: Response): Promise<void> {
    try {
      const user = await prisma.taxpayer.findUnique({ where: { ruc: req.params.ruc as string } });
      res.json({ success: true, data: user });
    } catch (e) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  public async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await prisma.taxpayer.findMany({
        select: { id: true, ruc: true, firstName: true, lastName: true, email: true, role: true, createdAt: true }
      });
      res.json({ success: true, data: users });
    } catch (e) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  public async findUser(req: Request, res: Response): Promise<void> {
    try {
      const { identifier } = req.body;
      const user = await prisma.taxpayer.findFirst({
        where: { OR: [{ email: identifier }, { ruc: identifier }] }
      });
      res.json({ success: true, data: user });
    } catch (e) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  public async createUser(req: Request, res: Response): Promise<void> {
    try {
      const user = await prisma.taxpayer.create({ data: req.body });
      res.status(201).json({ success: true, data: user });
    } catch (e) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  public async updateUserProfile(req: Request, res: Response): Promise<void> {
    try {
      const updated = await prisma.taxpayer.update({ where: { id: req.params.id as string }, data: req.body });
      res.json({ success: true, data: updated });
    } catch (e) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  public async updateUserPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email, newPassword } = req.body;
      await prisma.taxpayer.update({ where: { email }, data: { password: newPassword } });
      res.json({ success: true, message: 'Password updated' });
    } catch (e) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  public async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.id as string;
      await prisma.$transaction([
        prisma.invoice.deleteMany({ where: { taxpayerId: userId } }),
        prisma.atsFile.deleteMany({ where: { taxpayerId: userId } }),
        prisma.processStep.deleteMany({ where: { taxpayerId: userId } }),
        prisma.auditEvent.deleteMany({ where: { taxpayerId: userId } }),
        prisma.ticket.deleteMany({ where: { taxpayerId: userId } }),
        prisma.workspace.deleteMany({ where: { taxpayerId: userId } }),
        prisma.taxpayer.delete({ where: { id: userId } })
      ]);
      res.json({ success: true, message: 'User deleted successfully' });
    } catch (e) {
      console.error('Error deleting user:', e);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
}
