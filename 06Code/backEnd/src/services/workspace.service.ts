import { prisma } from '../config/database';

export class WorkspaceService {
  public async getUserWorkspaces(userId: string) {
    return prisma.workspace.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  public async getWorkspaceById(id: string, userId: string) {
    return prisma.workspace.findFirst({
      where: { id, userId }
    });
  }

  public async getWorkspaceInvoices(workspaceId: string, userId: string) {
    return prisma.invoice.findMany({
      where: { workspaceId, userId },
      orderBy: { date: 'desc' }
    });
  }

  public async getWorkspaceAtsFiles(workspaceId: string, userId: string) {
    return prisma.atsFile.findMany({
      where: { workspaceId, userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  public async getWorkspaceSummary(workspaceId: string, userId: string) {
    const aggregate = await prisma.invoice.aggregate({
      where: { workspaceId, userId },
      _count: { id: true },
      _sum: { total: true, taxBase: true, iva: true }
    });

    const errorAtsCount = await prisma.atsFile.aggregate({
      where: { workspaceId, userId },
      _sum: { validationErrors: true }
    });

    return {
      invoiceCount: aggregate._count.id,
      taxBaseSum: aggregate._sum.taxBase || 0,
      ivaSum: aggregate._sum.iva || 0,
      totalSum: aggregate._sum.total || 0,
      errorCount: errorAtsCount._sum.validationErrors || 0
    };
  }

  public async getWorkspaceProcessStatus(workspaceId: string, userId: string) {
    const steps = await prisma.processStep.findMany({
      where: { workspaceId, userId }
    });

    // Mapea a estados booleanos requeridos por la vista del frontend
    const invoiceDownloadStep = steps.find(s => s.title.toLowerCase().includes('descarg') || s.description.toLowerCase().includes('descarg'));
    const atsXlsmStep = steps.find(s => s.title.toLowerCase().includes('xlsm') || s.description.toLowerCase().includes('xlsm'));
    const atsXmlStep = steps.find(s => s.title.toLowerCase().includes('xml') || s.description.toLowerCase().includes('xml'));

    return {
      invoiceDownloadStatus: invoiceDownloadStep ? invoiceDownloadStep.status === 'completed' : false,
      atsXlsmGenerationStatus: atsXlsmStep ? atsXlsmStep.status === 'completed' : false,
      atsXmlGenerationStatus: atsXmlStep ? atsXmlStep.status === 'completed' : false
    };
  }

  public async getWorkspaceProcessSteps(workspaceId: string, userId: string) {
    return prisma.processStep.findMany({
      where: { workspaceId, userId },
      orderBy: { createdAt: 'asc' }
    });
  }

  public async getWorkspaceLogs(workspaceId: string, userId: string) {
    // Audit logs for user that reference the workspace ID in the details or context
    const events = await prisma.auditEvent.findMany({
      where: {
        userId,
        OR: [
          { details: { contains: workspaceId } },
          { module: { contains: 'Workspace' } }
        ]
      },
      orderBy: { timestamp: 'desc' },
      take: 50
    });
    return events;
  }
}
