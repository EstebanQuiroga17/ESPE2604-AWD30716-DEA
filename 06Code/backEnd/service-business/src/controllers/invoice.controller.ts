import { Request, Response } from 'express';
import AdmZip from 'adm-zip';
import { crudClient } from '../http-client/crud.client';
import { InvoiceBusinessService } from '../services/invoice-business.service';

export class InvoiceController {
  private invoiceBusinessService = new InvoiceBusinessService();

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

  private getXmlFileName(xmlContent: string, index: number): string {
    const authMatch = xmlContent.match(/<numeroAutorizacion>([^<]+)<\/numeroAutorizacion>/i);
    if (authMatch && authMatch[1]) {
      const cleaned = authMatch[1].replace(/<!\[CDATA\[|\]\]>/g, '').trim();
      if (cleaned) return `${cleaned}.xml`;
    }

    const accessMatch = xmlContent.match(/<claveAcceso>([^<]+)<\/claveAcceso>/i);
    if (accessMatch && accessMatch[1]) {
      const cleaned = accessMatch[1].replace(/<!\[CDATA\[|\]\]>/g, '').trim();
      if (cleaned) return `${cleaned}.xml`;
    }

    return `factura_${index + 1}.xml`;
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

      const zip = new AdmZip();

      for (let i = 0; i < xmlList.length; i++) {
        const item = xmlList[i];
        if (typeof item !== 'string') {
          res.status(400).json({
            success: false,
            message: `Element at index ${i} is not a valid string.`
          });
          return;
        }

        const fileName = this.getXmlFileName(item, i);
        zip.addFile(fileName, Buffer.from(item, 'utf-8'));
      }

      const zipBuffer = zip.toBuffer();

      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', 'attachment; filename="facturas.zip"');
      res.status(200).send(zipBuffer);
    } catch (error) {
      console.error('Error compressing XML invoices:', error);
      res.status(500).json({ success: false, message: 'Internal server error compressing invoices' });
    }
  }
}
