import { Request, Response } from 'express';
import { crudClient } from '../http-client/crud.client';
import { UserReportService } from '../services/userReport.service';

export class TaxpayerController {
  public async getAllTaxpayers(req: Request, res: Response): Promise<void> {
    try {
      const result = await crudClient.get('/repo/users');
      res.status(200).json(result);
    } catch (error) { res.status(500).json({ success: false, message: 'Internal server error' }); }
  }

  public async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const result = await crudClient.get(`/repo/users/${req.params.userId}`);
      if (!result.data) { res.status(404).json({ success: false, message: 'User not found' }); return; }
      const u = result.data;
      res.status(200).json({ success: true, data: { id: u.id, ruc: u.ruc, businessName: u.businessName, email: u.email, role: u.role, createdAt: u.createdAt } });
    } catch (error) { res.status(500).json({ success: false, message: 'Internal server error' }); }
  }

  public async validateRuc(req: Request, res: Response): Promise<void> {
    try {
      const ruc = req.params.ruc;
      if (!ruc || ruc.length !== 13) { res.status(200).json({ success: true, valid: false, exists: false }); return; }
      const result = await crudClient.get(`/repo/users/ruc/${ruc}`);
      res.status(200).json({ success: true, valid: true, exists: !!result.data });
    } catch (error) { res.status(500).json({ success: false, message: 'Internal server error' }); }
  }

  public async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const { businessName } = req.body;
      const result = await crudClient.put(`/repo/users/${req.params.userId}`, { businessName });
      const u = result.data;
      res.status(200).json({ success: true, data: { id: u.id, ruc: u.ruc, businessName: u.businessName, email: u.email } });
    } catch (error) { res.status(500).json({ success: false, message: 'Internal server error' }); }
  }

  public async getUsersReport(req: Request, res: Response): Promise<void> {
    try {
      const result = await crudClient.get('/repo/users');
      const users = result.data || [];
      
      const pdfService = new UserReportService();
      const pdfBuffer = await pdfService.generateUsersReportPdf(users);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="usuarios_registrados.pdf"');
      res.send(pdfBuffer);
    } catch (error) { 
      console.error('Error generating users report:', error);
      res.status(500).json({ success: false, message: 'Internal server error generating report' }); 
    }
  }
}
