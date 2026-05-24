// src/utils/audit-storage.ts
export const hasCompletedFirstAudit = (): boolean => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('dapc_completed_first_audit') === 'true';
};

export const markFirstAuditCompleted = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('dapc_completed_first_audit', 'true');
};