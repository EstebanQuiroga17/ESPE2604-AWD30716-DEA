export interface AuditEvent {
  id: string;
  userId: string;
  action: string;
  module: string;
  timestamp: string;
  details: string;
}
