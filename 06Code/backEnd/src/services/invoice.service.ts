import { prisma } from '../config/database';

export class InvoiceService {
  public async getInvoicesByUser(userId: string) {
    return prisma.invoice.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });
  }

  public async saveInvoices(userId: string, invoicesData: any[]) {
    const invoices = invoicesData.map(data => {
      let parsedProducts = null;
      if (data.products) {
        try {
          parsedProducts = typeof data.products === 'string' ? JSON.parse(data.products) : data.products;
        } catch (e) {
          console.error('Error parsing products JSON:', e);
        }
      }

      return {
        number: data.number || '',
        issuerName: data.issuerName || '',
        issuerTradeName: data.issuerTradeName || null,
        issuerAddress: data.issuerAddress || null,
        issuerRuc: data.issuerRuc || '',
        date: data.date || '',
        authorizationNumber: data.authorizationNumber || null,
        emissionType: data.emissionType || 'Normal',
        accessKey: data.accessKey || null,
        clientName: data.clientName || null,
        clientIdentification: data.clientIdentification || null,
        clientAddress: data.clientAddress || null,
        clientPhone: data.clientPhone || null,
        clientEmail: data.clientEmail || null,
        products: parsedProducts,
        taxBase: Number(data.taxBase) || 0,
        iva: Number(data.iva) || 0,
        total: Number(data.total) || 0,
        type: data.type || 'COMPRA',
        format: data.format || 'XML',
        userId,
        workspaceId: data.workspaceId || null,
      };
    });

    await prisma.invoice.createMany({
      data: invoices,
      skipDuplicates: true,
    });

    return this.getInvoicesByUser(userId);
  }

  public async getInvoiceSummary(userId: string) {
    const result = await prisma.invoice.aggregate({
      where: { userId },
      _count: { id: true },
      _sum: { total: true },
    });

    return {
      count: result._count.id,
      totalAmount: result._sum.total || 0,
    };
  }
}
