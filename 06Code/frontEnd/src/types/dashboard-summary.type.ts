import type { SriConnectionStatus } from './sri-session.type';
import type { Notification } from './notification.type';

export interface DashboardSummary {
  invoicesDownloaded: number;
  invoicesDownloadedChange: number;
  errorsDetected: number;
  atsReadyToGenerate: boolean;
  sriStatus: SriConnectionStatus;
  lastSync: string;
  notifications: Notification[];
}
