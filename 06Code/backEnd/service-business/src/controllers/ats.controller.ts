import { Request, Response } from 'express';
import { InvoiceService } from '../services/invoice.service';
import { FieldsCoordinator, AtsFlag } from '../services/ats/fields.coordinator';
import { AtsXlsmBuilder } from '../services/ats/builders/ats-xlsm.builder';
import * as path from 'path';

export class AtsController {
  private invoiceService = new InvoiceService();
  private fieldsCoordinator = new FieldsCoordinator();

  public async buildAtsXlsx(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ success: false, message: 'No zip file provided' });
        return;
      }

      const flag = (req.body.flag as AtsFlag) || 'compras';

      // 1. Extraer XMLs del ZIP
      const xmls = this.invoiceService.unzipXmlFiles(req.file.buffer);

      // 2. Parsear XMLs a JSON crudo
      const jsons = this.invoiceService.parseXmlsToJson(xmls);

      // 3. Coordinar el mapeo
      const mappedData = this.fieldsCoordinator.mapJsons(jsons, flag);

      // 4. Construir Excel
      const templatePath = path.join(__dirname, '../../resources/PlantillaATS.xlsx'); 
      const builder = new AtsXlsmBuilder(templatePath);
      
      switch (flag) {
        case 'compras':
          builder.buildCompras(mappedData);
          break;
        case 'ventas':
          builder.buildVentas(mappedData);
          break;
        case 'exportaciones':
          builder.buildExportaciones(mappedData);
          break;
        case 'anulados':
          builder.buildAnulados(mappedData);
          break;
      }

      const excelBuffer = await builder.getResult();

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename="ATS.xlsx"');
      res.status(200).send(excelBuffer);

    } catch (error) {
      console.error('Error building ATS XLSX:', error);
      res.status(500).json({ success: false, message: 'Internal server error processing ATS build', details: String(error) });
    }
  }
}
