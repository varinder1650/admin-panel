import { wsService } from '@/services/websocket';

interface AuditEntry {
  action: string;
  resource: string;
  timestamp: string;
  userId: string;
  details?: any;
}

export const logAuditEvent = (entry: Omit<AuditEntry, 'timestamp'>) => {
  const auditEntry: AuditEntry = {
    ...entry,
    timestamp: new Date().toISOString(),
  };
  
  wsService.send({
    type: 'audit_log',
    data: auditEntry,
  });
  
  if (process.env.NODE_ENV === 'development') {
    console.log('[AUDIT]', auditEntry);
  }
};