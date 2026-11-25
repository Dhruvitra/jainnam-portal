/**
 * JAINAM TOURS AND TRAVELS — WHATSAPP AI TRAVEL CRM
 * Settings.gs — Business Level Key-Value Settings Management
 */

var SettingsManager = (function() {
  /**
   * Retrieves all settings as a key-value object
   */
  function getSettings(user) {
    var businessId = user.businessId;
    var rows = Database.findAll(TABLES.SETTINGS, businessId);
    var dict = {};
    for (var i = 0; i < rows.length; i++) {
      dict[rows[i]['Setting Key']] = rows[i]['Setting Value'];
    }
    return dict;
  }

  /**
   * Updates multiple setting keys
   */
  function updateSettings(user, newSettings) {
    var businessId = user.businessId;
    var now = new Date().toISOString();
    var existingRows = Database.findAll(TABLES.SETTINGS, businessId);
    var existingMap = {};
    for (var i = 0; i < existingRows.length; i++) {
      existingMap[existingRows[i]['Setting Key']] = existingRows[i];
    }

    for (var key in newSettings) {
      var val = String(newSettings[key]);
      if (existingMap[key]) {
        Database.update(TABLES.SETTINGS, 'Setting Key', key, {
          'Setting Value': val,
          'Updated At': now
        }, businessId);
      } else {
        Database.insert(TABLES.SETTINGS, {
          'Business ID': businessId,
          'Setting Key': key,
          'Setting Value': val,
          'Updated At': now
        }, businessId);
      }
    }

    AuditLogs.log(businessId, user.userId, 'SETTINGS_UPDATED', 'SETTINGS', { updatedKeys: Object.keys(newSettings) });
    return getSettings(user);
  }

  return {
    getSettings: getSettings,
    updateSettings: updateSettings
  };
})();
