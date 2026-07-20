import { Request, Response } from 'express';
import { crudClient } from '../http-client/crud.client';
import { InvoiceBusinessService } from '../services/invoice-business.service';
import { XmlService } from '../services/xml.service';

export class InvoiceController {
  private invoiceBusinessService = new InvoiceBusinessService();
  private xmlService = new XmlService();

  public async getUserInvoices(req: Request, res: Response): Promise<void> {
    try {
      const result = await crudClient.get(`/repo/invoices/${req.params.userId}`);
      res.status(200).json(result);
    } catch (error) { res.status(500).json({ success: false, message: 'Internal server error' }); }
  }

  public async uploadInvoices(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const { invoices } = req.body;
      if (!invoices || !Array.isArray(invoices)) { res.status(400).json({ success: false, message: 'Invalid data format' }); return; }

      // Business logic: normalize invoice fields before sending to Servicio B
      const normalized = invoices.map((inv: any) => this.invoiceBusinessService.normalizeInvoice(inv, userId as string));
      const result = await crudClient.post('/repo/invoices', { userId, invoices: normalized });
      res.status(201).json(result);
    } catch (error) { res.status(500).json({ success: false, message: 'Internal server error' }); }
  }

  public async getSummary(req: Request, res: Response): Promise<void> {
    try {
      const result = await crudClient.get(`/repo/invoices/${req.params.userId}`);
      // Business logic: calculate summary from raw invoice list
      const summary = this.invoiceBusinessService.calculateSummary(result.data || []);
      res.status(200).json({ success: true, data: summary });
    } catch (error) { res.status(500).json({ success: false, message: 'Internal server error' }); }
  }

  public async downloadInvoices(req: Request, res: Response): Promise<void> {
    try {
      const { ruc } = req.params;
      if (!ruc) { res.status(400).json({ success: false, message: 'RUC is required' }); return; }

      const queryParams = new URLSearchParams();
      queryParams.set('ruc', ruc as string);
      if (req.query.periodType) queryParams.set('periodType', String(req.query.periodType));
      if (req.query.month) queryParams.set('month', String(req.query.month));
      if (req.query.semester) queryParams.set('semester', String(req.query.semester));
      if (req.query.year) queryParams.set('year', String(req.query.year));

      const result = await crudClient.get(`/repo/invoices/filter/by?${queryParams.toString()}`);
      res.status(200).json(result);
    } catch (error) {
      console.error('Download invoices error:', error);
      res.status(500).json({ success: false, message: 'Internal server error fetching invoices' });
    }
  }

  public async compressXmlInvoices(req: Request, res: Response): Promise<void> {
    try {
      let xmlList: any = null;
      if (Array.isArray(req.body)) {
        xmlList = req.body;
      } else if (req.body && typeof req.body === 'object') {
        xmlList = req.body.invoices || req.body.xmls || req.body.data;
      }

      if (!xmlList || !Array.isArray(xmlList)) {
        res.status(400).json({
          success: false,
          message: 'Invalid payload. Expected JSON array of XML strings or an object containing invoices/xmls array.'
        });
        return;
      }

      for (let i = 0; i < xmlList.length; i++) {
        if (typeof xmlList[i] !== 'string') {
          res.status(400).json({
            success: false,
            message: `Element at index ${i} is not a valid string.`
          });
          return;
        }
      }

      const zipBuffer = this.xmlService.compressXmlsToZip(xmlList);

      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', 'attachment; filename="facturas.zip"');
      res.status(200).send(zipBuffer);
    } catch (error) {
      console.error('Error compressing XML invoices:', error);
      res.status(500).json({ success: false, message: 'Internal server error compressing invoices' });
    }
  }
}
