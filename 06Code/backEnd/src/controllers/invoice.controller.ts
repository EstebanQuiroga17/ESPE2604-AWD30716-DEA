import { Request, Response } from 'express';
import { InvoiceService } from '../services/invoice.service';

export class InvoiceController {
  private invoiceService: InvoiceService;

  constructor() {
    this.invoiceService = new InvoiceService();
  }

  public async getUserInvoices(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const invoices = await this.invoiceService.getInvoicesByUser(userId as string);
      res.status(200).json({ success: true, data: invoices });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  public async uploadInvoices(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const { invoices } = req.body;

      if (!invoices || !Array.isArray(invoices)) {
        res.status(400).json({ success: false, message: 'Invalid data format' });
        return;
      }

      const savedInvoices = await this.invoiceService.saveInvoices(userId as string, invoices);
      res.status(201).json({ success: true, data: savedInvoices });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  public async getSummary(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const summary = await this.invoiceService.getInvoiceSummary(userId as string);
      res.status(200).json({ success: true, data: summary });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  public async downloadInvoices(req: Request, res: Response): Promise<void> {
    try {
      const { ruc } = req.params;
      const { periodType, month, semester, year } = req.query;

      if (!ruc) {
        res.status(400).json({ success: false, message: 'RUC is required' });
        return;
      }

      const { prisma } = require('../config/database');
      
      const filters: any = {
        customerId: ruc
      };

      // Si no hay facturas en BD para este cliente, vamos a crear mocks
      let invoices = await prisma.invoice.findMany({ where: filters });
      
      if (invoices.length === 0) {
        const mockInvoices = [
          {
            number: '001-001-000000001',
            authorizationNumber: '1234567890123456789012345678901234567890123456789',
            emissionType: 'Normal',
            accessKey: '1234567890123456789012345678901234567890123456789',
            issuerName: 'EMPRESA DEMO S.A.',
            issuerCommercialName: 'DEMO COMERCIAL',
            issuerAddress: 'AV. PRINCIPAL 123',
            issuerRuc: '1790000000001',
            customerName: 'CLIENTE PRUEBA',
            customerId: ruc,
            customerDate: '2026-02-15',
            products: [],
            subtotal: 100.00,
            iva: 15.00,
            total: 115.00,
            userId: (req as any).user?.id || '07787dd8-aafa-4c6d-a49c-07595438199d'
          },
          {
            number: '001-001-000000002',
            authorizationNumber: '9876543210987654321098765432109876543210987654321',
            emissionType: 'Normal',
            accessKey: '9876543210987654321098765432109876543210987654321',
            issuerName: 'PROVEEDOR SERVICIOS CIA. LTDA.',
            issuerRuc: '1790000000003',
            customerName: 'CLIENTE PRUEBA',
            customerId: ruc,
            customerDate: '2026-08-20',
            products: [],
            subtotal: 250.00,
            iva: 37.50,
            total: 287.50,
            userId: (req as any).user?.id || '07787dd8-aafa-4c6d-a49c-07595438199d'
          }
        ];
        await prisma.invoice.createMany({ data: mockInvoices });
        invoices = await prisma.invoice.findMany({ where: filters });
      }

      // Filter locally to avoid complex Prisma string manipulation
      let filteredInvoices = invoices;
      
      if (year) {
        if (periodType === 'monthly' && month) {
          const m = String(month).padStart(2, '0');
          const prefix = `${year}-${m}-`;
          filteredInvoices = filteredInvoices.filter((inv: any) => inv.customerDate.startsWith(prefix));
        } else if (periodType === 'semi-annual' && semester) {
          const isFirstSem = String(semester) === '1';
          filteredInvoices = filteredInvoices.filter((inv: any) => {
            const dateYear = inv.customerDate.substring(0, 4);
            const dateMonth = parseInt(inv.customerDate.substring(5, 7));
            if (dateYear !== String(year)) return false;
            return isFirstSem ? (dateMonth >= 1 && dateMonth <= 6) : (dateMonth >= 7 && dateMonth <= 12);
          });
        }
      }

      res.status(200).json({ success: true, data: filteredInvoices });
    } catch (error) {
      console.error('Download invoices error:', error);
      res.status(500).json({ success: false, message: 'Internal server error fetching invoices' });
    }
  }
}
