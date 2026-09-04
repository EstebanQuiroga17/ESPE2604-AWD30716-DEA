import { Request, Response } from 'express';
import { XmlService } from '../services/xml.service';

export class InvoiceController {
  private xmlService = new XmlService();





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
