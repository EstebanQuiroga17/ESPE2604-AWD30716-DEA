import { prisma } from '../config/database';

export class TraceabilityService {
  public async getAuditEvents() {
    return prisma.auditEvent.findMany({
      orderBy: { timestamp: 'desc' },
      take: 100,
      include: {
        taxpayer: {
          select: { firstName: true, lastName: true, ruc: true },
        },
      },
    });
  }

  public async logEvent(data: any) {
    return prisma.auditEvent.create({
      data: {
        action: data.action,
        module: data.module,
        details: data.details,
        taxpayerId: data.userId,
      },
    });
  }

  public async getProcessSteps(userId: string) {
    return prisma.processStep.findMany({
      where: { taxpayerId: userId },
      orderBy: { createdAt: 'asc' },
    });
  }

  public async updateProcessStep(stepId: string, status: string, completedAt?: Date) {
    return prisma.processStep.update({
      where: { id: stepId },
      data: { status, completedAt },
    });
  }
}
