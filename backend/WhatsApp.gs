/**
 * JAINAM TOURS AND TRAVELS — WHATSAPP AI TRAVEL CRM
 * WhatsApp.gs — Multi-Branch WhatsApp Business Lines & Provider Connection Status
 */

var WhatsAppManager = (function() {
  /**
   * Retrieves all WhatsApp numbers for the active business
   */
  function getWhatsAppNumbers(user) {
    var businessId = user.businessId;
    var numbers = Database.findAll(TABLES.WHATSAPP_NUMBERS, businessId);

    // Count linked conversations per line
    var messages = Database.findAll(TABLES.MESSAGES, businessId);
    var lineCounts = {};
    for (var i = 0; i < messages.length; i++) {
      var numId = messages[i]['WhatsApp Number ID'];
      if (numId) {
        lineCounts[numId] = (lineCounts[numId] || 0) + 1;
      }
    }

    return numbers.map(function(num) {
      return {
        id: num['Number ID'],
        businessId: num['Business ID'],
        name: num['Display Name'],
        phoneNumber: num['Phone Number'],
        countryCode: num['Country Code'],
        provider: num['Provider'],
        providerPhoneId: num['Provider Phone ID'],
        isDefault: String(num['Is Default']).toLowerCase() === 'true',
        status: num['Connection Status'],
        aiEnabled: String(num['AI Enabled']).toLowerCase() === 'true',
        conversationsCount: lineCounts[num['Number ID']] || 0,
        createdAt: num['Created At']
      };
    });
  }

  /**
   * Adds a new WhatsApp Business Number line
   */
  function addWhatsAppNumber(user, data) {
    var businessId = user.businessId;
    var name = String(data.name || data.displayName || '').trim();
    var rawPhone = String(data.phoneNumber || data.phone || '').trim();

    if (!name || !rawPhone) {
      throw new Error('Line Name and Phone Number are required.');
    }

    var numberId = 'num_' + Utilities.getUuid().substring(0, 8);
    var now = new Date().toISOString();
    var isDefault = String(data.isDefault).toLowerCase() === 'true';

    // If set as default, reset previous defaults
    if (isDefault) {
      var existing = Database.findAll(TABLES.WHATSAPP_NUMBERS, businessId);
      for (var i = 0; i < existing.length; i++) {
        if (String(existing[i]['Is Default']).toLowerCase() === 'true') {
          Database.update(TABLES.WHATSAPP_NUMBERS, 'Number ID', existing[i]['Number ID'], { 'Is Default': 'false' }, businessId);
        }
      }
    }

    var record = {
      'Number ID': numberId,
      'Business ID': businessId,
      'Display Name': name,
      'Phone Number': rawPhone,
      'Country Code': data.countryCode || 'IN (+91)',
      'Provider': data.provider || 'Meta Cloud API',
      'Provider Phone ID': data.providerPhoneId || ('waba_' + Utilities.getUuid().substring(0, 6)),
      'Is Default': isDefault ? 'true' : 'false',
      'Connection Status': data.status || 'Connected',
      'AI Enabled': data.aiEnabled !== undefined ? String(data.aiEnabled) : 'true',
      'Created At': now
    };

    Database.insert(TABLES.WHATSAPP_NUMBERS, record, businessId);
    AuditLogs.log(businessId, user.userId, 'WHATSAPP_LINE_ADDED', 'WHATSAPP', { numberId: numberId, phone: rawPhone });

    return record;
  }

  /**
   * Updates WhatsApp number details
   */
  function updateWhatsAppNumber(user, numberId, updates) {
    var businessId = user.businessId;
    var updated = Database.update(TABLES.WHATSAPP_NUMBERS, 'Number ID', numberId, updates, businessId);
    AuditLogs.log(businessId, user.userId, 'WHATSAPP_LINE_UPDATED', 'WHATSAPP', { numberId: numberId });
    return updated;
  }

  /**
   * Selects a line as default
   */
  function selectDefaultNumber(user, numberId) {
    var businessId = user.businessId;
    var existing = Database.findAll(TABLES.WHATSAPP_NUMBERS, businessId);

    for (var i = 0; i < existing.length; i++) {
      var isTarget = existing[i]['Number ID'] === numberId;
      Database.update(TABLES.WHATSAPP_NUMBERS, 'Number ID', existing[i]['Number ID'], {
        'Is Default': isTarget ? 'true' : 'false'
      }, businessId);
    }

    AuditLogs.log(businessId, user.userId, 'DEFAULT_LINE_CHANGED', 'WHATSAPP', { newDefaultId: numberId });
    return { success: true, defaultNumberId: numberId };
  }

  /**
   * Checks status of a line
   */
  function getConnectionStatus(user, numberId) {
    var businessId = user.businessId;
    var num = Database.findById(TABLES.WHATSAPP_NUMBERS, 'Number ID', numberId, businessId);
    if (!num) throw new Error('WhatsApp number not found.');

    return {
      numberId: num['Number ID'],
      displayName: num['Display Name'],
      phoneNumber: num['Phone Number'],
      status: num['Connection Status'],
      provider: num['Provider'],
      aiEnabled: num['AI Enabled']
    };
  }

  return {
    getWhatsAppNumbers: getWhatsAppNumbers,
    addWhatsAppNumber: addWhatsAppNumber,
    updateWhatsAppNumber: updateWhatsAppNumber,
    selectDefaultNumber: selectDefaultNumber,
    getConnectionStatus: getConnectionStatus
  };
})();
