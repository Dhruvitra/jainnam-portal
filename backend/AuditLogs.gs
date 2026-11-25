/**
 * JAINAM TOURS AND TRAVELS — WHATSAPP AI TRAVEL CRM
 * AuditLogs.gs — Security & Operational Audit Trail Logging
 */

var AuditLogs = (function() {
  function log(businessId, userId, action, entity, metadata) {
    try {
      var metaStr = typeof metadata === 'object' ? JSON.stringify(metadata) : String(metadata || '');
      Database.insert(TABLES.AUDIT_LOGS, {
        'Log ID': 'log_' + Utilities.getUuid().substring(0, 8),
        'Business ID': businessId || 'SYSTEM',
        'User ID': userId || 'ANONYMOUS',
        'Action': action,
        'Entity': entity || 'GENERAL',
        'Timestamp': new Date().toISOString(),
        'IP or available request metadata': metaStr
      }, businessId);
    } catch (e) {
      Logger.log('Failed to write audit log: ' + e.message);
    }
  }

  return {
    log: log
  };
})();
