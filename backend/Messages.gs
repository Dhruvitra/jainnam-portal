/**
 * JAINAM TOURS AND TRAVELS — WHATSAPP AI TRAVEL CRM
 * Messages.gs — WhatsApp Conversation History & Staged Outbox Queue
 */

var Messages = (function() {
  /**
   * Retrieves messages for a customer conversation
   */
  function getMessages(user, customerId) {
    var businessId = user.businessId;
    if (!customerId) return [];

    var messages = Database.findAll(TABLES.MESSAGES, businessId, function(m) {
      return m['Customer ID'] === customerId;
    });

    messages.sort(function(a, b) {
      return new Date(a['Timestamp']).getTime() - new Date(b['Timestamp']).getTime();
    });

    return messages;
  }

  /**
   * Retrieves conversation metadata and thread
   */
  function getConversation(user, customerId) {
    var businessId = user.businessId;
    var customer = Database.findById(TABLES.CONTACTS, 'Customer ID', customerId, businessId);
    if (!customer) throw new Error('Customer not found.');

    var thread = getMessages(user, customerId);
    return {
      customer: customer,
      messages: thread
    };
  }

  /**
   * Saves incoming or outgoing WhatsApp message record
   */
  function saveMessage(user, messageData) {
    var businessId = user.businessId;
    var messageId = 'msg_' + Utilities.getUuid().substring(0, 8);
    var now = new Date().toISOString();

    var record = {
      'Message ID': messageId,
      'Business ID': businessId,
      'Customer ID': messageData.customerId,
      'WhatsApp Number ID': messageData.whatsappNumberId || '',
      'Direction': messageData.direction || 'Outbound', // 'Inbound' or 'Outbound'
      'Message Type': messageData.messageType || 'Text',
      'Message Text': messageData.messageText || messageData.text || '',
      'Media URL': messageData.mediaUrl || '',
      'Message Status': messageData.status || 'Sent',
      'Timestamp': now,
      'External Message ID': messageData.externalMessageId || ''
    };

    Database.insert(TABLES.MESSAGES, record, businessId);
    return record;
  }

  /**
   * Queues an outbound WhatsApp message in OUTBOX table
   * Ready for future production WhatsApp Cloud API webhook worker dispatch.
   */
  function createOutboxMessage(user, outboxData) {
    var businessId = user.businessId;
    var outboxId = 'out_' + Utilities.getUuid().substring(0, 8);
    var now = new Date().toISOString();

    var record = {
      'Outbox ID': outboxId,
      'Business ID': businessId,
      'Customer ID': outboxData.customerId,
      'Number ID': outboxData.numberId || '',
      'Message': outboxData.message || '',
      'Send Mode': outboxData.sendMode || 'Immediate',
      'Status': 'Pending Dispatch',
      'Created At': now,
      'Sent At': ''
    };

    Database.insert(TABLES.OUTBOX, record, businessId);

    // Also mirror to active conversation history
    saveMessage(user, {
      customerId: outboxData.customerId,
      whatsappNumberId: outboxData.numberId,
      direction: 'Outbound',
      messageText: outboxData.message,
      status: 'Queued'
    });

    return record;
  }

  return {
    getMessages: getMessages,
    getConversation: getConversation,
    saveMessage: saveMessage,
    createOutboxMessage: createOutboxMessage
  };
})();
