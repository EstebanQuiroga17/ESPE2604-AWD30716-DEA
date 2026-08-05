import { Router } from 'express';
import { InvoiceController } from '../controllers/invoice.controller';

const router = Router();
const invoiceController = new InvoiceController();

router.post('/compress-xml', (req, res) => invoiceController.compressXmlInvoices(req, res));
export default router;
