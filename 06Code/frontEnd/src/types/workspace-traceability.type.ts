import type { ProcessStep } from './process-step.type';
import type { AuditEvent } from './audit-event.type';

export interface WorkspaceTraceability {
  workspaceId: string;
  processSteps: ProcessStep[];
  auditEvents: AuditEvent[];
  completionPercentage: number;
}
