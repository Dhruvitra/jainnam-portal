/**
 * JAINAM TOURS AND TRAVELS — WHATSAPP AI TRAVEL CRM
 * Customers.gs — Contact Normalization, Deduplication, and Lead Pipeline Management
 */

var Customers = (function() {
  /**
   * Normalizes phone number into E.164 standard format
   */
  function normalizePhone(rawPhone, defaultCountryCode) {
    if (!rawPhone) return '';
    var str = String(rawPhone).trim();
    var clean = str.replace(/[\s\-\(\)\.]/g, '');

    var digits = clean.startsWith('+') ? clean.substring(1) : clean;
    if (digits.startsWith('0')) digits = digits.substring(1);

    if (digits.length === 12 && digits.startsWith('91')) {
      return '+' + digits;
    }

    if (digits.length === 10) {
      var cc = defaultCountryCode || '+91';
      if (!cc.startsWith('+')) cc = '+' + cc;
      return cc + digits;
    }

    if (clean.startsWith('+')) {
      return '+' + digits;
    }

    var ccDefault = defaultCountryCode || '+91';
    if (!ccDefault.startsWith('+')) ccDefault = '+' + ccDefault;
    return ccDefault + digits;
  }

  /**
   * Create new Customer with duplicate prevention
   */
  function createCustomer(user, data) {
    var businessId = user.businessId;
    var name = String(data.name || '').trim();
    var rawPhone = String(data.phone || '').trim();
    var email = String(data.email || '').trim().toLowerCase();

    if (!name || !rawPhone) {
      throw new Error('Customer Name and WhatsApp Phone Number are required.');
    }

    var normalizedPhone = normalizePhone(rawPhone, data.countryCode || '+91');

    // Duplicate Check within the same business
    var existingPhone = Database.findAll(TABLES.CUSTOMERS, businessId, function(c) {
      return normalizePhone(c['Phone']) === normalizedPhone;
    });

    if (existingPhone.length > 0) {
      throw new Error('A customer record with phone number ' + normalizedPhone + ' already exists (' + existingPhone[0]['Name'] + ').');
    }

    if (email) {
      var existingEmail = Database.findAll(TABLES.CUSTOMERS, businessId, function(c) {
        return String(c['Email']).toLowerCase() === email;
      });
      if (existingEmail.length > 0) {
        throw new Error('A customer with email ' + email + ' already exists.');
      }
    }

    var customerId = 'cust_' + Utilities.getUuid().substring(0, 8);
    var now = new Date().toISOString();

    var record = {
      'Customer ID': customerId,
      'Business ID': businessId,
      'Name': name,
      'Phone': normalizedPhone,
      'Email': email,
      'Source': data.source || 'WhatsApp Organic',
      'Destination': data.destination || '',
      'Travel Dates': data.travelDates || '',
      'Return Date': data.returnDate || '',
      'Number Of Travellers': data.travellers || data.numberOfTravellers || 2,
      'Budget': data.budget || 0,
      'Lead Stage': data.leadStage || LEAD_STAGES.NEW,
      'Lead Score': data.leadScore || LEAD_SCORES.WARM,
      'Tags': Array.isArray(data.tags) ? data.tags.join(', ') : (data.tags || ''),
      'Notes': data.notes || '',
      'Assigned Employee': data.assignedEmployee || user.name || 'Jainam Shah',
      'Created At': now,
      'Updated At': now,
      'Opt Out Status': 'false'
    };

    Database.insert(TABLES.CUSTOMERS, record, businessId);

    // Also create corresponding record in LEADS if not yet booked
    if (record['Lead Stage'] !== LEAD_STAGES.BOOKED) {
      var leadId = 'lead_' + Utilities.getUuid().substring(0, 8);
      Database.insert(TABLES.LEADS, {
        'Lead ID': leadId,
        'Business ID': businessId,
        'Customer ID': customerId,
        'Name': name,
        'Phone': normalizedPhone,
        'Email': email,
        'Destination': data.destination || '',
        'Budget': data.budget || 0,
        'Travel Dates': data.travelDates || '',
        'Travellers': data.travellers || 2,
        'Stage': record['Lead Stage'],
        'Score': record['Lead Score'],
        'Source': record['Source'],
        'Assigned To': record['Assigned Employee'],
        'Created At': now,
        'Updated At': now
      }, businessId);
    }

    AuditLogs.log(businessId, user.userId, 'CUSTOMER_CREATED', 'CUSTOMERS', { customerId: customerId, phone: normalizedPhone });

    return record;
  }

  /**
   * Retrieves customers for the business with filtering & pagination
   */
  function getCustomers(user, filters, pagination) {
    var businessId = user.businessId;
    filters = filters || {};
    pagination = pagination || { page: 1, limit: 50 };

    var records = Database.findAll(TABLES.CUSTOMERS, businessId, function(c) {
      if (filters.leadStage && c['Lead Stage'] !== filters.leadStage) return false;
      if (filters.leadScore && c['Lead Score'] !== filters.leadScore) return false;
      if (filters.destination && String(c['Destination']).toLowerCase().indexOf(filters.destination.toLowerCase()) === -1) return false;
      if (filters.query) {
        var q = String(filters.query).toLowerCase();
        var match = String(c['Name']).toLowerCase().indexOf(q) !== -1 ||
                    String(c['Phone']).indexOf(q) !== -1 ||
                    String(c['Destination']).toLowerCase().indexOf(q) !== -1;
        if (!match) return false;
      }
      return true;
    });

    records.sort(function(a, b) {
      return new Date(b['Created At']).getTime() - new Date(a['Created At']).getTime();
    });

    var total = records.length;
    var page = parseInt(pagination.page || 1, 10);
    var limit = parseInt(pagination.limit || 50, 10);
    var start = (page - 1) * limit;
    var pagedRecords = records.slice(start, start + limit);

    return {
      total: total,
      page: page,
      limit: limit,
      customers: pagedRecords
    };
  }

  /**
   * Get Single Customer Details
   */
  function getCustomer(user, customerId) {
    var customer = Database.findById(TABLES.CUSTOMERS, 'Customer ID', customerId, user.businessId);
    if (!customer) throw new Error('Customer not found.');

    var messages = Database.findAll(TABLES.MESSAGES, user.businessId, function(m) {
      return m['Customer ID'] === customerId;
    });
    var bookings = Database.findAll(TABLES.BOOKINGS, user.businessId, function(b) {
      return b['Customer ID'] === customerId;
    });
    var quotations = Database.findAll(TABLES.QUOTATIONS, user.businessId, function(q) {
      return q['Customer ID'] === customerId;
    });

    return {
      customer: customer,
      recentMessages: messages.slice(-20),
      bookings: bookings,
      quotations: quotations
    };
  }

  /**
   * Update Customer Details
   */
  function updateCustomer(user, customerId, updates) {
    var businessId = user.businessId;
    var existing = Database.findById(TABLES.CUSTOMERS, 'Customer ID', customerId, businessId);
    if (!existing) throw new Error('Customer not found.');

    if (updates.phone) {
      updates.phone = normalizePhone(updates.phone);
    }
    if (updates.tags && Array.isArray(updates.tags)) {
      updates.tags = updates.tags.join(', ');
    }
    updates['Updated At'] = new Date().toISOString();

    var updated = Database.update(TABLES.CUSTOMERS, 'Customer ID', customerId, updates, businessId);

    // Sync to LEADS if present
    var lead = Database.findFirst(TABLES.LEADS, businessId, function(l) {
      return l['Customer ID'] === customerId;
    });
    if (lead) {
      var leadUpdates = {};
      if (updates['Lead Stage']) leadUpdates['Stage'] = updates['Lead Stage'];
      if (updates['Lead Score']) leadUpdates['Score'] = updates['Lead Score'];
      if (updates['Destination']) leadUpdates['Destination'] = updates['Destination'];
      if (updates['Assigned Employee']) leadUpdates['Assigned To'] = updates['Assigned Employee'];
      leadUpdates['Updated At'] = updates['Updated At'];
      Database.update(TABLES.LEADS, 'Lead ID', lead['Lead ID'], leadUpdates, businessId);
    }

    AuditLogs.log(businessId, user.userId, 'CUSTOMER_UPDATED', 'CUSTOMERS', { customerId: customerId, updates: Object.keys(updates) });
    return updated;
  }

  /**
   * Delete Customer Record
   */
  function deleteCustomer(user, customerId) {
    var businessId = user.businessId;
    Database.deleteRow(TABLES.CUSTOMERS, 'Customer ID', customerId, businessId);
    Database.deleteRow(TABLES.LEADS, 'Customer ID', customerId, businessId);
    AuditLogs.log(businessId, user.userId, 'CUSTOMER_DELETED', 'CUSTOMERS', { customerId: customerId });
    return { success: true };
  }

  /**
   * Get all Leads pipeline
   */
  function getLeads(user, filters) {
    var businessId = user.businessId;
    filters = filters || {};

    var leads = Database.findAll(TABLES.LEADS, businessId, function(l) {
      if (filters.stage && l['Stage'] !== filters.stage) return false;
      if (filters.score && l['Score'] !== filters.score) return false;
      if (filters.assignedTo && l['Assigned To'] !== filters.assignedTo) return false;
      return true;
    });

    leads.sort(function(a, b) {
      return new Date(b['Created At']).getTime() - new Date(a['Created At']).getTime();
    });

    return leads;
  }

  /**
   * Convert Lead to Confirmed Booking
   */
  function convertLeadToBooking(user, leadId, bookingData) {
    var businessId = user.businessId;
    var lead = Database.findById(TABLES.LEADS, 'Lead ID', leadId, businessId);
    if (!lead) throw new Error('Lead record not found.');

    var customerId = lead['Customer ID'];
    var now = new Date().toISOString();

    // 1. Update Lead Stage to Booked
    Database.update(TABLES.LEADS, 'Lead ID', leadId, {
      'Stage': LEAD_STAGES.BOOKED,
      'Updated At': now
    }, businessId);

    // 2. Update Customer Record
    Database.update(TABLES.CUSTOMERS, 'Customer ID', customerId, {
      'Lead Stage': LEAD_STAGES.BOOKED,
      'Updated At': now
    }, businessId);

    // 3. Create Booking Record
    var bookingId = 'bk_' + Utilities.getUuid().substring(0, 8);
    var totalAmount = Number(bookingData.totalAmount || lead['Budget'] || 0);
    var paidAmount = Number(bookingData.paidAmount || 0);
    var balance = totalAmount - paidAmount;

    var bookingRecord = {
      'Booking ID': bookingId,
      'Business ID': businessId,
      'Customer ID': customerId,
      'Package ID': bookingData.packageId || '',
      'Quotation ID': bookingData.quotationId || '',
      'Travel Date': bookingData.travelDate || lead['Travel Dates'] || '',
      'Return Date': bookingData.returnDate || '',
      'Total Amount': totalAmount,
      'Paid Amount': paidAmount,
      'Balance': balance,
      'Payment Status': balance <= 0 ? 'Paid' : (paidAmount > 0 ? 'Partial' : 'Unpaid'),
      'Booking Status': 'Confirmed',
      'Notes': bookingData.notes || ('Converted from Lead ' + leadId)
    };

    Database.insert(TABLES.BOOKINGS, bookingRecord, businessId);
    AuditLogs.log(businessId, user.userId, 'LEAD_CONVERTED_TO_BOOKING', 'BOOKINGS', { leadId: leadId, bookingId: bookingId });

    return {
      success: true,
      booking: bookingRecord
    };
  }

  return {
    normalizePhone: normalizePhone,
    createCustomer: createCustomer,
    getCustomers: getCustomers,
    getCustomer: getCustomer,
    updateCustomer: updateCustomer,
    deleteCustomer: deleteCustomer,
    getLeads: getLeads,
    convertLeadToBooking: convertLeadToBooking
  };
})();
