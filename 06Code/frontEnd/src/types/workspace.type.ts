import type { TaxPeriod } from './tax-period.type';
import type { ProcessTracer } from './process-tracer.type';

export interface Workspace {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  lastActivityAt?: string;
  invoicesCount?: number;
  atsFilesCount?: number;
  workspaceLocation: string;
  atsXml?: any;
  atsXlsm?: any;
  period: TaxPeriod;
  processTracer: ProcessTracer;
}
