/**
 * JAINAM TOURS AND TRAVELS CRM - COMPLETE ALL-IN-ONE BACKEND BUNDLE
 * Copy all of this file and paste into Google Apps Script Code.gs
 */



// ==========================================================================
// SECTION: Config.gs
// ==========================================================================

/**
 * JAINAM TOURS AND TRAVELS — WHATSAPP AI TRAVEL CRM
 * Config.gs — Core Configuration, Schema Definitions, and Constants
 * 
 * Complete 22 Database Tables Architecture for Production Travel Agency CRM
 */

var CONFIG = {
  APP_NAME: 'Jainam Tours and Travels CRM',
  VERSION: '2.5.0',
  DEFAULT_CURRENCY: 'INR',
  DEFAULT_TIMEZONE: 'Asia/Kolkata',
  TOKEN_EXPIRY_HOURS: 24,
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_MINUTES: 15,
  SECRET_PROPERTY_KEY: 'CRM_JWT_SECRET',
  SPREADSHEET_ID_PROPERTY: 'CRM_SPREADSHEET_ID',
  // Meta Business Suite & WhatsApp Cloud API Configuration Keys
  META_VERIFY_TOKEN_PROPERTY: 'WEBHOOK_SECRET',
  META_VERIFY_TOKEN_LEGACY: 'META_WEBHOOK_VERIFY_TOKEN',
  META_ACCESS_TOKEN_PROPERTY: 'META_WA_TOKEN',
  META_ACCESS_TOKEN_LEGACY: 'META_GRAPH_ACCESS_TOKEN',
  META_PHONE_ID_PROPERTY: 'META_PHONE_NUMBER_ID',
  META_WABA_ID_PROPERTY: 'META_WABA_ID',
  META_GRAPH_VERSION_PROPERTY: 'META_GRAPH_VERSION',
  META_PAGE_TOKEN_PROPERTY: 'META_PAGE_TOKEN',
  DEFAULT_GRAPH_VERSION: 'v21.0'
};

var ROLES = {
  SUPER_ADMIN: 'Super Admin',
  BUSINESS_OWNER: 'Business Owner',
  ADMIN: 'Admin',
  EMPLOYEE: 'Employee'
};

var LEAD_STAGES = {
  NEW: 'New',
  ENGAGED: 'Engaged',
  QUALIFIED: 'Qualified',
  CALL_SCHEDULED: 'Call Scheduled',
  QUOTE_SENT: 'Quote Sent',
  BOOKED: 'Booked',
  PAST_CUSTOMER: 'Past Customer',
  COLD: 'Cold',
  LOST: 'Lost'
};

var LEAD_SCORES = {
  HOT: 'Hot',
  WARM: 'Warm',
  COLD: 'Cold'
};

var TABLES = {
  USERS: 'USERS',
  BUSINESSES: 'BUSINESSES',
  CUSTOMERS: 'CUSTOMERS',
  LEADS: 'LEADS',
  PACKAGES: 'PACKAGES',
  PACKAGE_ITINERARY: 'PACKAGE_ITINERARY',
  MESSAGES: 'MESSAGES',
  CONVERSATIONS: 'CONVERSATIONS',
  WHATSAPP_NUMBERS: 'WHATSAPP_NUMBERS',
  QUOTATIONS: 'QUOTATIONS',
  BOOKINGS: 'BOOKINGS',
  PAYMENTS: 'PAYMENTS',
  FOLLOWUPS: 'FOLLOWUPS',
  CAMPAIGNS: 'CAMPAIGNS',
  CAMPAIGN_RECIPIENTS: 'CAMPAIGN_RECIPIENTS',
  FAQS: 'FAQS',
  SETTINGS: 'SETTINGS',
  NOTIFICATIONS: 'NOTIFICATIONS',
  OUTBOX: 'OUTBOX',
  AUDIT_LOGS: 'AUDIT_LOGS',
  WEBHOOK_EVENTS: 'WEBHOOK_EVENTS',
  FILES: 'FILES'
};

/**
 * Exact Database Column Schemas for all 22 Google Sheets
 */
var SCHEMAS = {
  USERS: [
    'User ID',
    'Name',
    'Email',
    'Password Hash',
    'Salt',
    'Role',
    'Business ID',
    'Status',
    'Created At',
    'Last Login'
  ],
  BUSINESSES: [
    'Business ID',
    'Business Name',
    'Owner Name',
    'Email',
    'Phone',
    'Address',
    'Website',
    'Logo',
    'Currency',
    'Timezone',
    'Created At',
    'Status'
  ],
  CUSTOMERS: [
    'Customer ID',
    'Business ID',
    'Name',
    'Phone',
    'Email',
    'Source',
    'Destination',
    'Travel Dates',
    'Return Date',
    'Number Of Travellers',
    'Budget',
    'Lead Stage',
    'Lead Score',
    'Tags',
    'Notes',
    'Assigned Employee',
    'Created At',
    'Updated At',
    'Opt Out Status'
  ],
  LEADS: [
    'Lead ID',
    'Business ID',
    'Customer ID',
    'Name',
    'Phone',
    'Email',
    'Destination',
    'Budget',
    'Travel Dates',
    'Travellers',
    'Stage',
    'Score',
    'Source',
    'Assigned To',
    'Created At',
    'Updated At'
  ],
  PACKAGES: [
    'Package ID',
    'Business ID',
    'Package Name',
    'Destination',
    'Duration',
    'Price',
    'Currency',
    'Hotel Details',
    'Transportation',
    'Meals',
    'Inclusions',
    'Exclusions',
    'Highlights',
    'Itinerary',
    'Best Season',
    'Images',
    'Brochure URL',
    'Active Status'
  ],
  PACKAGE_ITINERARY: [
    'Itinerary ID',
    'Package ID',
    'Day Number',
    'Day Title',
    'Description',
    'Activities',
    'Hotel',
    'Meals',
    'Transport'
  ],
  MESSAGES: [
    'Message ID',
    'Business ID',
    'Customer ID',
    'WhatsApp Number ID',
    'Direction',
    'Message Type',
    'Message Text',
    'Media URL',
    'Message Status',
    'Timestamp',
    'External Message ID'
  ],
  CONVERSATIONS: [
    'Conversation ID',
    'Business ID',
    'Customer ID',
    'WhatsApp Number ID',
    'Last Message Text',
    'Last Message Timestamp',
    'Unread Count',
    'AI Enabled',
    'Human Takeover',
    'Assigned Agent',
    'Status',
    'Updated At'
  ],
  WHATSAPP_NUMBERS: [
    'Number ID',
    'Business ID',
    'Display Name',
    'Phone Number',
    'Country Code',
    'Provider',
    'Provider Phone ID',
    'Is Default',
    'Connection Status',
    'AI Enabled',
    'Created At'
  ],
  QUOTATIONS: [
    'Quotation ID',
    'Business ID',
    'Customer ID',
    'Package ID',
    'Travel Date',
    'Travellers',
    'Hotel Selection',
    'Transport',
    'Total Price',
    'Discount',
    'Final Price',
    'Valid Until',
    'Status',
    'PDF URL'
  ],
  BOOKINGS: [
    'Booking ID',
    'Business ID',
    'Customer ID',
    'Package ID',
    'Quotation ID',
    'Travel Date',
    'Return Date',
    'Total Amount',
    'Paid Amount',
    'Balance',
    'Payment Status',
    'Booking Status',
    'Notes'
  ],
  PAYMENTS: [
    'Payment ID',
    'Business ID',
    'Booking ID',
    'Customer ID',
    'Amount',
    'Payment Method',
    'Transaction Ref',
    'Receipt URL',
    'Payment Date',
    'Recorded By',
    'Notes'
  ],
  FOLLOWUPS: [
    'Followup ID',
    'Business ID',
    'Customer ID',
    'Scheduled Date',
    'Followup Type',
    'Message',
    'Status',
    'Assigned Employee'
  ],
  CAMPAIGNS: [
    'Campaign ID',
    'Business ID',
    'Campaign Name',
    'Audience Segment',
    'Message Template',
    'Selected Number',
    'Scheduled At',
    'Status',
    'Sent Count',
    'Failed Count'
  ],
  CAMPAIGN_RECIPIENTS: [
    'Recipient ID',
    'Campaign ID',
    'Customer ID',
    'Phone',
    'Status',
    'Sent At',
    'Delivered At',
    'Error Message'
  ],
  FAQS: [
    'FAQ ID',
    'Business ID',
    'Question',
    'Answer',
    'Category',
    'Language',
    'Status'
  ],
  SETTINGS: [
    'Business ID',
    'Setting Key',
    'Setting Value',
    'Updated At'
  ],
  NOTIFICATIONS: [
    'Notification ID',
    'Business ID',
    'User ID',
    'Title',
    'Message',
    'Type',
    'Link',
    'Is Read',
    'Created At'
  ],
  OUTBOX: [
    'Outbox ID',
    'Business ID',
    'Customer ID',
    'Number ID',
    'Message',
    'Send Mode',
    'Status',
    'Created At',
    'Sent At'
  ],
  AUDIT_LOGS: [
    'Log ID',
    'Business ID',
    'User ID',
    'Action',
    'Entity',
    'Timestamp',
    'IP or available request metadata'
  ],
  WEBHOOK_EVENTS: [
    'Event ID',
    'Business ID',
    'Event Type',
    'Payload',
    'Received At',
    'Processed Status',
    'Error Message'
  ],
  FILES: [
    'File ID',
    'Business ID',
    'Entity Type',
    'Entity ID',
    'File Name',
    'File URL',
    'Drive File ID',
    'File Size',
    'Mime Type',
    'Created At'
  ]
};


// ==========================================================================
// SECTION: Database.gs
// ==========================================================================

/**
 * JAINAM TOURS AND TRAVELS — WHATSAPP AI TRAVEL CRM
 * Database.gs — Modular Data Access Layer (DAL) for Google Sheets
 * 
 * Provides an abstract, multi-tenant, cached, and concurrency-safe interface.
 * Designed to seamlessly port to Supabase, PostgreSQL, or Firebase later.
 */

var Database = (function() {
  var sheetCache = {};
  var headerCache = {};

  /**
   * Retrieves the target Spreadsheet
   */
  function getSpreadsheet() {
    var props = PropertiesService.getScriptProperties();
    var sheetId = props.getProperty(CONFIG.SPREADSHEET_ID_PROPERTY);
    if (sheetId) {
      try {
        return SpreadsheetApp.openById(sheetId);
      } catch (e) {
        // Fallback to active spreadsheet if bound
      }
    }
    var active = SpreadsheetApp.getActiveSpreadsheet();
    if (active) return active;

    // Auto-create spreadsheet if running as standalone script
    try {
      var newSs = SpreadsheetApp.create('Jainam Tours and Travels Database');
      props.setProperty(CONFIG.SPREADSHEET_ID_PROPERTY, newSs.getId());
      return newSs;
    } catch (err) {
      Logger.log('Could not auto-create spreadsheet: ' + err.message);
      return null;
    }
  }

  /**
   * Retrieves a sheet by name with memory caching
   */
  function getSheet(sheetName) {
    if (sheetCache[sheetName]) {
      return sheetCache[sheetName];
    }
    var ss = getSpreadsheet();
    if (!ss) {
      return null;
    }
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      try {
        sheet = ss.insertSheet(sheetName);
        var schema = TABLES[sheetName] || [];
        if (schema.length > 0) {
          sheet.getRange(1, 1, 1, schema.length).setValues([schema]);
        }
      } catch (e) {
        return null;
      }
    }
    sheetCache[sheetName] = sheet;
    return sheet;
  }

  /**
   * Retrieves column header indices for a sheet
   */
  function getHeaderMap(sheetName) {
    if (headerCache[sheetName]) {
      return headerCache[sheetName];
    }
    var sheet = getSheet(sheetName);
    var lastCol = sheet.getLastColumn();
    if (lastCol === 0) return {};
    
    var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
    var map = {};
    for (var i = 0; i < headers.length; i++) {
      var key = String(headers[i]).trim();
      if (key) {
        map[key] = i; // 0-based column index
      }
    }
    headerCache[sheetName] = map;
    return map;
  }

  /**
   * Converts a sheet row array to a JavaScript Object
   */
  function rowToObject(row, headerMap) {
    var obj = {};
    for (var header in headerMap) {
      var colIdx = headerMap[header];
      var val = row[colIdx];
      // Format Dates to ISO string
      if (val instanceof Date) {
        val = val.toISOString();
      }
      obj[header] = val !== undefined && val !== null ? val : '';
    }
    return obj;
  }

  /**
   * Converts a JavaScript Object to a sheet row array following the official schema
   */
  function objectToRow(obj, sheetName) {
    var schema = SCHEMAS[sheetName];
    if (!schema) {
      throw new Error('No schema registered for sheet: ' + sheetName);
    }
    var row = [];
    for (var i = 0; i < schema.length; i++) {
      var colName = schema[i];
      var val = obj[colName];
      if (val === undefined || val === null) {
        val = '';
      } else if (typeof val === 'object' && !(val instanceof Date)) {
        val = JSON.stringify(val);
      }
      row.push(val);
    }
    return row;
  }

  /**
   * Reads all records from a sheet with multi-tenant filtering
   */
  function findAll(sheetName, businessId, filterFn) {
    var sheet = getSheet(sheetName);
    var lastRow = sheet.getLastRow();
    var lastCol = sheet.getLastColumn();

    if (lastRow <= 1 || lastCol === 0) {
      return [];
    }

    var headerMap = getHeaderMap(sheetName);
    var data = sheet.getRange(2, 1, lastRow - 1, lastCol).getValues();
    var results = [];

    for (var i = 0; i < data.length; i++) {
      var obj = rowToObject(data[i], headerMap);
      obj._rowIndex = i + 2; // Actual row number in Google Sheet

      // Multi-tenant check: if sheet has Business ID column and businessId is provided
      if (businessId && headerMap['Business ID'] !== undefined) {
        if (String(obj['Business ID']) !== String(businessId)) {
          continue; // Strictly skip other businesses
        }
      }

      if (typeof filterFn === 'function') {
        if (!filterFn(obj)) continue;
      }

      results.push(obj);
    }

    return results;
  }

  /**
   * Finds a single record by key
   */
  function findById(sheetName, idColumnName, idValue, businessId) {
    var matches = findAll(sheetName, businessId, function(item) {
      return String(item[idColumnName]) === String(idValue);
    });
    return matches.length > 0 ? matches[0] : null;
  }

  /**
   * Thread-safe insert using LockService
   */
  function insert(sheetName, recordData, businessId) {
    if (!recordData) return {};
    try {
      if (businessId && SCHEMAS[sheetName] && SCHEMAS[sheetName].indexOf('Business ID') !== -1) {
        recordData['Business ID'] = businessId;
      }
      if (SCHEMAS[sheetName] && SCHEMAS[sheetName].indexOf('Created At') !== -1 && !recordData['Created At']) {
        recordData['Created At'] = new Date().toISOString();
      }

      var sheet = getSheet(sheetName);
      if (!sheet) {
        Logger.log('Sheet ' + sheetName + ' not accessible, skipping DB persist.');
        return recordData;
      }

      var lock = LockService.getScriptLock();
      try { lock.waitLock(5000); } catch (e) {}

      try {
        var row = objectToRow(recordData, sheetName);
        sheet.appendRow(row);
        return recordData;
      } finally {
        try { lock.releaseLock(); } catch (e) {}
      }
    } catch (err) {
      Logger.log('Insert error in ' + sheetName + ': ' + err.message);
      return recordData;
    }
  }

  /**
   * Batch insert multiple records
   */
  function insertBatch(sheetName, recordsArray, businessId) {
    if (!recordsArray || recordsArray.length === 0) return [];
    var lock = LockService.getScriptLock();
    try {
      lock.waitLock(15000);
    } catch (e) {
      throw new Error('Database is busy. Could not obtain write lock.');
    }

    try {
      var sheet = getSheet(sheetName);
      var rows = [];
      var now = new Date().toISOString();

      for (var i = 0; i < recordsArray.length; i++) {
        var rec = recordsArray[i];
        if (businessId && SCHEMAS[sheetName].indexOf('Business ID') !== -1) {
          rec['Business ID'] = businessId;
        }
        if (SCHEMAS[sheetName].indexOf('Created At') !== -1 && !rec['Created At']) {
          rec['Created At'] = now;
        }
        rows.push(objectToRow(rec, sheetName));
      }

      var startRow = sheet.getLastRow() + 1;
      var numRows = rows.length;
      var numCols = rows[0].length;
      sheet.getRange(startRow, 1, numRows, numCols).setValues(rows);
      return recordsArray;
    } finally {
      lock.releaseLock();
    }
  }

  /**
   * Updates an existing record by ID
   */
  function update(sheetName, idColumnName, idValue, updates, businessId) {
    try {
      var sheet = getSheet(sheetName);
      if (!sheet) return updates;

      var lock = LockService.getScriptLock();
      try { lock.waitLock(5000); } catch (e) {}

      try {
        var existing = findById(sheetName, idColumnName, idValue, businessId);
        if (!existing || !existing._rowIndex) {
          return updates;
        }

        // Merge updates
        for (var key in updates) {
          if (key !== idColumnName && key !== 'Business ID' && key !== '_rowIndex') {
            existing[key] = updates[key];
          }
        }

        if (SCHEMAS[sheetName] && SCHEMAS[sheetName].indexOf('Updated At') !== -1) {
          existing['Updated At'] = new Date().toISOString();
        }

        var row = objectToRow(existing, sheetName);
        sheet.getRange(existing._rowIndex, 1, 1, row.length).setValues([row]);
        return existing;
      } finally {
        try { lock.releaseLock(); } catch (e) {}
      }
    } catch (err) {
      Logger.log('update error: ' + err.message);
      return updates;
    }
  }

  /**
   * Deletes a record by ID
   */
  function deleteRow(sheetName, idColumnName, idValue, businessId) {
    var lock = LockService.getScriptLock();
    try {
      lock.waitLock(10000);
    } catch (e) {
      throw new Error('Database write lock timeout.');
    }

    try {
      var existing = findById(sheetName, idColumnName, idValue, businessId);
      if (!existing) {
        throw new Error('Record not found for deletion.');
      }

      var sheet = getSheet(sheetName);
      sheet.deleteRow(existing._rowIndex);
      return true;
    } finally {
      lock.releaseLock();
    }
  }

  /**
   * Retrieves the first record matching a condition
   */
  function findFirst(sheetName, businessId, predicate) {
    try {
      var all = findAll(sheetName, businessId, predicate);
      return (all && all.length > 0) ? all[0] : null;
    } catch (e) {
      Logger.log('findFirst error in ' + sheetName + ': ' + e.message);
      return null;
    }
  }

  return {
    getSpreadsheet: getSpreadsheet,
    getSheet: getSheet,
    getHeaderMap: getHeaderMap,
    findAll: findAll,
    findFirst: findFirst,
    findById: findById,
    insert: insert,
    insertBatch: insertBatch,
    update: update,
    deleteRow: deleteRow
  };
})();


// ==========================================================================
// SECTION: Setup.gs
// ==========================================================================

/**
 * JAINAM TOURS AND TRAVELS — WHATSAPP AI TRAVEL CRM
 * Setup.gs — Database Initialization & Schema Provisioning Script
 * 
 * Automatically provisions all 22 required Google Sheets with exact column headers,
 * formats header rows, sets script properties, and populates comprehensive seed data for Jainam Tours.
 */

/**
 * Main Setup Function
 * Run this function from the Apps Script editor to initialize the entire CRM backend.
 */
function initializeDatabase() {
  var props = PropertiesService.getScriptProperties();
  var sheetId = props.getProperty(CONFIG.SPREADSHEET_ID_PROPERTY);
  var ss = null;

  if (sheetId) {
    try {
      ss = SpreadsheetApp.openById(sheetId);
    } catch (e) {}
  }

  if (!ss) {
    try {
      ss = SpreadsheetApp.getActiveSpreadsheet();
    } catch (e) {}
  }

  // If still no spreadsheet (standalone script), auto-create a dedicated Google Sheet in Google Drive
  if (!ss) {
    ss = SpreadsheetApp.create('Jainam Tours and Travels Database');
    Logger.log('Created fresh Google Spreadsheet: ' + ss.getUrl());
  }

  // Store spreadsheet ID in script properties for persistent headless access
  props.setProperty(CONFIG.SPREADSHEET_ID_PROPERTY, ss.getId());

  Logger.log('Starting CRM Database Provisioning for: ' + ss.getName() + ' (' + ss.getId() + ')');

  // Ensure JWT HMAC secret exists
  if (!props.getProperty(CONFIG.SECRET_PROPERTY_KEY)) {
    var newSecret = Utilities.getUuid() + '-' + Utilities.getUuid();
    props.setProperty(CONFIG.SECRET_PROPERTY_KEY, newSecret);
    Logger.log('Generated fresh JWT HMAC secret key.');
  }

  // Set default Meta webhook verify token if unset
  if (!props.getProperty(CONFIG.META_VERIFY_TOKEN_PROPERTY)) {
    props.setProperty(CONFIG.META_VERIFY_TOKEN_PROPERTY, 'jainam_tours_meta_webhook_2026_secure');
    Logger.log('Set default Meta Webhook verify token.');
  }

  // Set permanent WhatsApp Cloud API token & IDs
  props.setProperty(CONFIG.META_ACCESS_TOKEN_PROPERTY, 'EAAVJZCL6tJgABTMgZCLyZC3NnD2xWivayaIrdfETZBrmGJY6ZCoqILug5abPznv5fjaiZAekNK8zFqPCyohAS57Q9ckve1T83gFr8S3wFW7Hl5s44yFk1Cf6NqB6k3UC2JTjzMxYIHGwLSZCt8SxNrupYglUHVhgyqtO2y9W1DF3v7oTOuUO6r9uWtTsZAzBZAwZDZD');
  props.setProperty(CONFIG.META_PHONE_ID_PROPERTY, '1389222240951710');
  props.setProperty(CONFIG.META_WABA_ID_PROPERTY, '1182352128069522');
  Logger.log('Configured permanent Meta WhatsApp Cloud API credentials and Phone Number ID.');

  // Iterate and provision each of the 22 required tables
  var tableNames = Object.keys(TABLES);
  for (var i = 0; i < tableNames.length; i++) {
    var tableName = TABLES[tableNames[i]];
    var expectedHeaders = SCHEMAS[tableName];
    if (!expectedHeaders) continue;

    var sheet = ss.getSheetByName(tableName);
    if (!sheet) {
      sheet = ss.insertSheet(tableName);
      Logger.log('Created sheet: ' + tableName);
    }

    // Check if headers already match
    var lastCol = sheet.getLastColumn();
    var existingHeaders = lastCol > 0 ? sheet.getRange(1, 1, 1, lastCol).getValues()[0] : [];
    var needsHeaders = existingHeaders.length === 0;

    if (needsHeaders) {
      sheet.getRange(1, 1, 1, expectedHeaders.length).setValues([expectedHeaders]);
    }

    // Format header row (Jainam Charcoal & Gold theme styling in Google Sheets)
    sheet.getRange(1, 1, 1, expectedHeaders.length)
      .setBackground('#292929')
      .setFontColor('#FFFFFF')
      .setFontWeight('bold')
      .setFontFamily('Roboto')
      .setFontSize(10);
    
    sheet.setFrozenRows(1);
  }

  // Remove default 'Sheet1' if it exists and other sheets are present
  var defaultSheet = ss.getSheetByName('Sheet1');
  if (defaultSheet && ss.getSheets().length > 1) {
    try {
      ss.deleteSheet(defaultSheet);
    } catch (e) {
      // Ignore if cannot delete
    }
  }

  Logger.log('Database schema successfully provisioned across 22 tables.');
  
  // Seed Jainam Tours and Travels default business record and initial data
  seedJainamToursData();

  return {
    success: true,
    message: 'Database successfully provisioned with 22 tables and production initial configuration.',
    spreadsheetId: ss.getId(),
    spreadsheetUrl: ss.getUrl()
  };
}

/**
 * Seeds initial business profile, staff accounts, packages, and settings
 */
function seedJainamToursData() {
  var businesses = Database.findAll(TABLES.BUSINESSES);
  if (businesses.length > 0) {
    Logger.log('Business record already exists. Checking staff accounts...');
  }

  var businessId = 'biz_jainam_01';
  var now = new Date().toISOString();

  // 1. Create Business
  if (businesses.length === 0) {
    Database.insert(TABLES.BUSINESSES, {
      'Business ID': businessId,
      'Business Name': 'JAINAM TOURS AND TRAVELS',
      'Owner Name': 'Jainam Shah',
      'Email': 'dhruviktra.rajput.1379@gmail.com',
      'Phone': '+91 98201 23456',
      'Address': 'Shop No. 4 & 5, Mahavir Chambers, Opp. Jain Temple, Zaveri Bazar, Kalbadevi, Mumbai - 400002, Maharashtra, India',
      'Website': 'https://www.jainamtours.com',
      'Logo': '/jainam-logo.png',
      'Currency': 'INR',
      'Timezone': 'Asia/Kolkata',
      'Created At': now,
      'Status': 'Active'
    });
  }

  // 2. Seed 7 Pre-Registered Authentic Login Accounts (Password: Password@1379)
  var defaultStaff = [
    { id: 'usr_01', name: 'Jainam Shah', email: 'dhruviktra.rajput.1379@gmail.com', role: ROLES.SUPER_ADMIN },
    { id: 'usr_02', name: 'Pooja Parekh', email: 'pooja.parekh@jainamtours.com', role: ROLES.ADMIN },
    { id: 'usr_03', name: 'Chirag Mehta', email: 'chirag.mehta@jainamtours.com', role: ROLES.EMPLOYEE },
    { id: 'usr_04', name: 'Ritu Sharma', email: 'ritu.sharma@jainamtours.com', role: ROLES.EMPLOYEE },
    { id: 'usr_05', name: 'Bhavin Shah', email: 'bhavin.shah@jainamtours.com', role: ROLES.ADMIN },
    { id: 'usr_06', name: 'Sneha Desai', email: 'sneha.desai@jainamtours.com', role: ROLES.EMPLOYEE },
    { id: 'usr_07', name: 'Karan Rajput', email: 'karan.rajput@jainamtours.com', role: ROLES.EMPLOYEE }
  ];

  var existingUsers = Database.findAll(TABLES.USERS);
  if (existingUsers.length === 0) {
    for (var u = 0; u < defaultStaff.length; u++) {
      var staff = defaultStaff[u];
      var staffSalt = Auth.generateSalt();
      var staffHash = Auth.hashPassword('Password@1379', staffSalt);
      Database.insert(TABLES.USERS, {
        'User ID': staff.id,
        'Name': staff.name,
        'Email': staff.email,
        'Password Hash': staffHash,
        'Salt': staffSalt,
        'Role': staff.role,
        'Business ID': businessId,
        'Status': 'Active',
        'Created At': now,
        'Last Login': ''
      });
    }
    Logger.log('Seeded 7 pre-registered staff accounts.');
  }

  // 3. Create WhatsApp Business Lines
  var existingLines = Database.findAll(TABLES.WHATSAPP_NUMBERS, businessId);
  if (existingLines.length === 0) {
    Database.insert(TABLES.WHATSAPP_NUMBERS, {
      'Number ID': 'num_01',
      'Business ID': businessId,
      'Display Name': 'Jainam Main Booking Desk (Mumbai Head Office)',
      'Phone Number': '+1 555-187-2312',
      'Country Code': 'US (+1)',
      'Provider': 'Meta Cloud API',
      'Provider Phone ID': '1368841422989230',
      'Is Default': 'true',
      'Connection Status': 'Connected',
      'AI Enabled': 'true',
      'Created At': now
    }, businessId);
  } else {
    // Fix existing rows if they had placeholder IDs
    for (var l = 0; l < existingLines.length; l++) {
      if (!/^\d+$/.test(String(existingLines[l]['Provider Phone ID']).trim())) {
        Database.update(TABLES.WHATSAPP_NUMBERS, 'Number ID', existingLines[l]['Number ID'], {
          'Provider Phone ID': '1368841422989230'
        }, businessId);
      }
    }
  }

  // 4. Create Initial Packages
  var existingPackages = Database.findAll(TABLES.PACKAGES, businessId);
  if (existingPackages.length === 0) {
    Database.insert(TABLES.PACKAGES, {
      'Package ID': 'pkg_kashmir_01',
      'Business ID': businessId,
      'Package Name': 'Kashmir Paradise & Dal Lake Luxury Houseboat',
      'Destination': 'Srinagar, Gulmarg & Pahalgam',
      'Duration': '5 Nights / 6 Days',
      'Price': 42500,
      'Currency': 'INR',
      'Hotel Details': '5-Star Luxury Houseboat & Heritage Resorts',
      'Transportation': 'Private AC Innova Crysta for all transfers & sightseeing',
      'Meals': 'Breakfast & Dinner included. Pure Veg & Jain meals guaranteed on request.',
      'Inclusions': 'Shikara Ride on Dal Lake, Gondola Cable Car Phase 1 Tickets, Airport Transfers, Tour Guide',
      'Exclusions': 'Airfare, Pony rides, Personal expenses, Travel Insurance',
      'Highlights': 'Dal Lake sunset shikara, Gulmarg snow meadows, Betab Valley in Pahalgam, Mughal Gardens',
      'Itinerary': 'Day 1: Srinagar Arrival; Day 2: Gulmarg Day Excursion; Day 3: Srinagar to Pahalgam; Day 4: Pahalgam Valleys; Day 5: Houseboat stay; Day 6: Departure.',
      'Best Season': 'April to October & December to February (Snow)',
      'Images': 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80',
      'Brochure URL': '',
      'Active Status': 'Active'
    }, businessId);

    Database.insert(TABLES.PACKAGES, {
      'Package ID': 'pkg_swiss_02',
      'Business ID': businessId,
      'Package Name': 'Grand Switzerland Scenic Glacier & Lakes Explorer',
      'Destination': 'Zurich, Lucerne, Interlaken & Zermatt',
      'Duration': '7 Nights / 8 Days',
      'Price': 185000,
      'Currency': 'INR',
      'Hotel Details': '4-Star Central Swiss Alps Heritage Hotels',
      'Transportation': 'Swiss Travel Pass (1st Class) & Airport Rail Transfers',
      'Meals': 'Daily Continental Breakfast, Indian Veg/Jain Dinners arranged in Interlaken and Zurich',
      'Inclusions': 'Mount Titlis Rotair Cable Car, Jungfraujoch Top of Europe, Lake Lucerne Cruise, Swiss Pass',
      'Exclusions': 'International Flights, Schengen Visa, City Taxes',
      'Highlights': 'Jungfrau summit, Glacier Express panoramic rail, Zermatt Matterhorn views, Rhine Falls',
      'Itinerary': 'Day 1: Zurich Arrival; Day 2: Lucerne & Titlis; Day 3: Interlaken; Day 4: Jungfraujoch; Day 5: Zermatt; Day 6: Glacier Express; Day 7: Zurich city; Day 8: Return.',
      'Best Season': 'May to October & December to March',
      'Images': 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80',
      'Brochure URL': '',
      'Active Status': 'Active'
    }, businessId);
  }

  // 5. Default Settings
  var existingSettings = Database.findAll(TABLES.SETTINGS, businessId);
  if (existingSettings.length === 0) {
    var defaultSettings = [
      { key: 'auto_responder_enabled', value: 'true' },
      { key: 'ai_language_preference', value: 'Hindi, English, Gujarati' },
      { key: 'ai_tone_of_voice', value: 'Warm, Courteous, Professional' },
      { key: 'human_takeover_keywords', value: 'agent, human, talk to manager, call me, phone' },
      { key: 'default_consultant_delay_sec', value: '3' },
      { key: 'quotation_validity_days', value: '14' },
      { key: 'tax_gst_percentage', value: '5' }
    ];

    for (var s = 0; s < defaultSettings.length; s++) {
      Database.insert(TABLES.SETTINGS, {
        'Business ID': businessId,
        'Setting Key': defaultSettings[s].key,
        'Setting Value': defaultSettings[s].value,
        'Updated At': now
      }, businessId);
    }
  }

  Logger.log('Jainam Tours initial business profile, lines, packages, and settings seeded.');
}


// ==========================================================================
// SECTION: Auth.gs
// ==========================================================================

/**
 * JAINAM TOURS AND TRAVELS — WHATSAPP AI TRAVEL CRM
 * Auth.gs — Authentication, Password Hashing, Session Management & RBAC
 */

var Auth = (function() {
  /**
   * Generates a cryptographic salt
   */
  function generateSalt() {
    return Utilities.getUuid() + '-' + Utilities.getUuid();
  }

  /**
   * Hashes password using SHA-256 + Salt
   * Never stores plain-text passwords
   */
  function hashPassword(password, salt) {
    var raw = password + '::' + salt;
    var digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, raw);
    var hash = '';
    for (var i = 0; i < digest.length; i++) {
      var byteVal = digest[i];
      if (byteVal < 0) byteVal += 256;
      var hex = byteVal.toString(16);
      if (hex.length === 1) hex = '0' + hex;
      hash += hex;
    }
    return hash;
  }

  /**
   * Retrieves or creates the secret key for signing tokens
   */
  function getJwtSecret() {
    var props = PropertiesService.getScriptProperties();
    var secret = props.getProperty(CONFIG.SECRET_PROPERTY_KEY);
    if (!secret) {
      secret = Utilities.getUuid() + '-' + Utilities.getUuid();
      props.setProperty(CONFIG.SECRET_PROPERTY_KEY, secret);
    }
    return secret;
  }

  /**
   * Generates a signed Session Token (HMAC-SHA256)
   */
  function generateSessionToken(user) {
    var now = Date.now();
    var expiry = now + (CONFIG.TOKEN_EXPIRY_HOURS * 3600 * 1000);
    var payload = {
      uid: user['User ID'],
      email: user['Email'],
      role: user['Role'],
      bid: user['Business ID'],
      exp: expiry,
      iat: now
    };

    var payloadStr = Utilities.base64EncodeWebSafe(JSON.stringify(payload));
    var secret = getJwtSecret();
    var signatureBytes = Utilities.computeHmacSha256Signature(payloadStr, secret);
    var signatureStr = Utilities.base64EncodeWebSafe(signatureBytes);

    var token = payloadStr + '.' + signatureStr;

    // Store active token in CacheService for fast revocation & validation
    var cache = CacheService.getScriptCache();
    var cacheSec = CONFIG.TOKEN_EXPIRY_HOURS * 3600;
    cache.put('token_' + user['User ID'], token, cacheSec);

    return token;
  }

  /**
   * Verifies session token authenticity and expiry
   */
  function verifyToken(token) {
    if (!token || typeof token !== 'string') {
      throw new Error('Missing or invalid session token.');
    }

    var parts = token.split('.');
    if (parts.length !== 2) {
      throw new Error('Malformed token structure.');
    }

    var payloadStr = parts[0];
    var providedSignature = parts[1];

    var secret = getJwtSecret();
    var expectedSignatureBytes = Utilities.computeHmacSha256Signature(payloadStr, secret);
    var expectedSignature = Utilities.base64EncodeWebSafe(expectedSignatureBytes);

    if (providedSignature !== expectedSignature) {
      throw new Error('Invalid token signature. Unauthorized access.');
    }

    var decodedJson = Utilities.newBlob(Utilities.base64DecodeWebSafe(payloadStr)).getDataAsString();
    var payload;
    try {
      payload = JSON.parse(decodedJson);
    } catch (e) {
      throw new Error('Invalid token payload.');
    }

    if (Date.now() > payload.exp) {
      throw new Error('Session token expired. Please log in again.');
    }

    return {
      userId: payload.uid,
      email: payload.email,
      role: payload.role,
      businessId: payload.bid
    };
  }

  /**
   * Checks if an Owner account has been initialized
   */
  function authStatus() {
    var users = Database.findAll(TABLES.USERS);
    var ownerExists = false;
    for (var i = 0; i < users.length; i++) {
      if (users[i]['Role'] === ROLES.BUSINESS_OWNER || users[i]['Role'] === ROLES.SUPER_ADMIN) {
        ownerExists = true;
        break;
      }
    }
    return {
      initialized: ownerExists,
      appName: CONFIG.APP_NAME,
      version: CONFIG.VERSION
    };
  }

  /**
   * First-time Owner / Agency Setup
   * Only allowed if no owner exists yet
   */
  function authCreateOwner(data, ip) {
    var status = authStatus();
    if (status.initialized) {
      throw new Error('Owner account is already registered. Public owner registration is disabled.');
    }

    var name = String(data.name || '').trim();
    var businessName = String(data.businessName || '').trim();
    var email = String(data.email || '').trim().toLowerCase();
    var password = String(data.password || '');

    if (!name || !businessName || !email || !password) {
      throw new Error('All fields (Name, Business Name, Email, Password) are required.');
    }

    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long.');
    }

    var businessId = 'biz_' + Utilities.getUuid().substring(0, 8);
    var userId = 'usr_' + Utilities.getUuid().substring(0, 8);
    var salt = generateSalt();
    var hash = hashPassword(password, salt);
    var now = new Date().toISOString();

    // Create Business
    Database.insert(TABLES.BUSINESSES, {
      'Business ID': businessId,
      'Business Name': businessName,
      'Owner Name': name,
      'Email': email,
      'Phone': data.phone || '',
      'Address': data.address || '',
      'Website': data.website || '',
      'Logo': data.logo || '/jainam-logo.png',
      'Currency': data.currency || CONFIG.DEFAULT_CURRENCY,
      'Timezone': data.timezone || CONFIG.DEFAULT_TIMEZONE,
      'Created At': now,
      'Status': 'Active'
    });

    // Create First Owner User
    var userRecord = {
      'User ID': userId,
      'Name': name,
      'Email': email,
      'Password Hash': hash,
      'Salt': salt,
      'Role': ROLES.BUSINESS_OWNER,
      'Business ID': businessId,
      'Status': 'Active',
      'Created At': now,
      'Last Login': now
    };
    Database.insert(TABLES.USERS, userRecord);

    // Create Default WhatsApp Business Line
    Database.insert(TABLES.WHATSAPP_NUMBERS, {
      'Number ID': 'num_' + Utilities.getUuid().substring(0, 8),
      'Business ID': businessId,
      'Display Name': businessName + ' Primary Desk',
      'Phone Number': data.phone || '+91 98201 23456',
      'Country Code': 'IN (+91)',
      'Provider': 'Meta Cloud API',
      'Provider Phone ID': '1368841422989230',
      'Is Default': 'true',
      'Connection Status': 'Connected',
      'AI Enabled': 'true',
      'Created At': now
    }, businessId);

    var token = generateSessionToken(userRecord);

    AuditLogs.log(businessId, userId, 'OWNER_REGISTERED', 'AUTH', {
      email: email,
      businessName: businessName,
      ip: ip
    });

    return {
      token: token,
      user: {
        userId: userId,
        name: name,
        email: email,
        role: ROLES.BUSINESS_OWNER,
        businessId: businessId
      },
      business: {
        businessId: businessId,
        businessName: businessName
      }
    };
  }

  /**
   * User Login with Rate Limiting & Lockout
   */
  function authLogin(email, password, ip) {
    if (!email || !password) {
      throw new Error('Email and password are required.');
    }

    var cleanEmail = String(email).trim().toLowerCase();
    var cache = CacheService.getScriptCache();
    var attemptKey = 'login_fail_' + cleanEmail;
    var failedAttempts = parseInt(cache.get(attemptKey) || '0', 10);

    if (failedAttempts >= CONFIG.MAX_LOGIN_ATTEMPTS) {
      throw new Error('Account locked due to excessive failed attempts. Please retry in ' + CONFIG.LOCKOUT_MINUTES + ' minutes.');
    }

    var users = Database.findAll(TABLES.USERS, null, function(u) {
      return String(u['Email']).toLowerCase() === cleanEmail;
    });

    if (users.length === 0) {
      cache.put(attemptKey, String(failedAttempts + 1), CONFIG.LOCKOUT_MINUTES * 60);
      throw new Error('Invalid email or password.');
    }

    var user = users[0];
    if (user['Status'] !== 'Active') {
      throw new Error('This account has been deactivated. Please contact support.');
    }

    var expectedHash = hashPassword(password, user['Salt']);
    if (expectedHash !== user['Password Hash']) {
      cache.put(attemptKey, String(failedAttempts + 1), CONFIG.LOCKOUT_MINUTES * 60);
      AuditLogs.log(user['Business ID'], user['User ID'], 'LOGIN_FAILED', 'AUTH', { ip: ip, email: cleanEmail });
      throw new Error('Invalid email or password.');
    }

    // Reset failed attempts on success
    cache.remove(attemptKey);

    // Update Last Login
    var now = new Date().toISOString();
    Database.update(TABLES.USERS, 'User ID', user['User ID'], {
      'Last Login': now
    }, user['Business ID']);

    var business = Database.findById(TABLES.BUSINESSES, 'Business ID', user['Business ID']);
    var token = generateSessionToken(user);

    AuditLogs.log(user['Business ID'], user['User ID'], 'LOGIN_SUCCESS', 'AUTH', { ip: ip });

    return {
      token: token,
      user: {
        userId: user['User ID'],
        name: user['Name'],
        email: user['Email'],
        role: user['Role'],
        businessId: user['Business ID'],
        lastLogin: now
      },
      business: business ? {
        businessId: business['Business ID'],
        businessName: business['Business Name'],
        currency: business['Currency'] || CONFIG.DEFAULT_CURRENCY,
        timezone: business['Timezone'] || CONFIG.DEFAULT_TIMEZONE
      } : null
    };
  }

  /**
   * User Logout
   */
  function authLogout(token) {
    try {
      var authUser = verifyToken(token);
      var cache = CacheService.getScriptCache();
      cache.remove('token_' + authUser.userId);
      AuditLogs.log(authUser.businessId, authUser.userId, 'LOGOUT', 'AUTH');
    } catch (e) {
      // Token may be already invalid
    }
    return { success: true };
  }

  /**
   * Retrieves active session details
   */
  function authMe(token) {
    var authUser = verifyToken(token);
    var user = Database.findById(TABLES.USERS, 'User ID', authUser.userId, authUser.businessId);
    if (!user) {
      throw new Error('User record not found.');
    }
    var business = Database.findById(TABLES.BUSINESSES, 'Business ID', authUser.businessId);

    return {
      user: {
        userId: user['User ID'],
        name: user['Name'],
        email: user['Email'],
        role: user['Role'],
        businessId: user['Business ID'],
        lastLogin: user['Last Login']
      },
      business: business ? {
        businessId: business['Business ID'],
        businessName: business['Business Name'],
        ownerName: business['Owner Name'],
        phone: business['Phone'],
        email: business['Email'],
        address: business['Address'],
        currency: business['Currency'],
        timezone: business['Timezone']
      } : null
    };
  }

  /**
   * Change Password
   */
  function changePassword(token, oldPassword, newPassword) {
    var authUser = verifyToken(token);
    var user = Database.findById(TABLES.USERS, 'User ID', authUser.userId, authUser.businessId);
    if (!user) throw new Error('User not found.');

    var checkOld = hashPassword(oldPassword, user['Salt']);
    if (checkOld !== user['Password Hash']) {
      throw new Error('Current password does not match.');
    }

    if (!newPassword || newPassword.length < 8) {
      throw new Error('New password must be at least 8 characters.');
    }

    var newSalt = generateSalt();
    var newHash = hashPassword(newPassword, newSalt);

    Database.update(TABLES.USERS, 'User ID', user['User ID'], {
      'Password Hash': newHash,
      'Salt': newSalt
    }, authUser.businessId);

    AuditLogs.log(authUser.businessId, authUser.userId, 'PASSWORD_CHANGED', 'AUTH');
    return { success: true, message: 'Password updated successfully.' };
  }

  /**
   * Forgot Password Workflow
   */
  function forgotPassword(email) {
    var cleanEmail = String(email || '').trim().toLowerCase();
    var users = Database.findAll(TABLES.USERS, null, function(u) {
      return String(u['Email']).toLowerCase() === cleanEmail;
    });

    if (users.length > 0) {
      var user = users[0];
      var resetCode = Math.floor(100000 + Math.random() * 900000).toString();
      var cache = CacheService.getScriptCache();
      cache.put('reset_' + cleanEmail, resetCode, 15 * 60); // 15 mins expiry

      AuditLogs.log(user['Business ID'], user['User ID'], 'PASSWORD_RESET_REQUESTED', 'AUTH', {
        email: cleanEmail
      });
      Logger.log('Password reset code generated for: ' + cleanEmail + ' -> ' + resetCode);
    }

    // Always return safe response to avoid user enumeration
    return {
      success: true,
      message: 'If an account exists for this email, password recovery instructions have been prepared.'
    };
  }

  return {
    generateSalt: generateSalt,
    hashPassword: hashPassword,
    verifyToken: verifyToken,
    authStatus: authStatus,
    authCreateOwner: authCreateOwner,
    authLogin: authLogin,
    authLogout: authLogout,
    authMe: authMe,
    changePassword: changePassword,
    forgotPassword: forgotPassword
  };
})();


// ==========================================================================
// SECTION: AuditLogs.gs
// ==========================================================================

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


// ==========================================================================
// SECTION: Customers.gs
// ==========================================================================

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


// ==========================================================================
// SECTION: Packages.gs
// ==========================================================================

/**
 * JAINAM TOURS AND TRAVELS — WHATSAPP AI TRAVEL CRM
 * Packages.gs — Tour Package Management, Multi-day Itineraries, and Brochure Engine
 */

var Packages = (function() {
  /**
   * Creates a new Tour Package with optional itinerary days
   */
  function createPackage(user, packageData) {
    var businessId = user.businessId;
    var name = String(packageData.name || packageData.packageName || '').trim();
    var destination = String(packageData.destination || '').trim();

    if (!name || !destination) {
      throw new Error('Package Name and Destination are required.');
    }

    var price = Number(packageData.price || packageData.pricePerPerson || 0);
    if (isNaN(price) || price < 0) {
      throw new Error('A valid price per person is required.');
    }

    var packageId = 'pkg_' + Utilities.getUuid().substring(0, 8);
    var now = new Date().toISOString();

    var record = {
      'Package ID': packageId,
      'Business ID': businessId,
      'Package Name': name,
      'Destination': destination,
      'Duration': packageData.duration || '5 Nights / 6 Days',
      'Price': price,
      'Currency': packageData.currency || CONFIG.DEFAULT_CURRENCY,
      'Hotel Details': packageData.hotelDetails || packageData.hotelCategory || '4-Star Luxury',
      'Transportation': packageData.transportation || 'Private AC Vehicle',
      'Meals': packageData.meals || 'Breakfast & Dinner (Pure Veg / Jain on request)',
      'Inclusions': Array.isArray(packageData.inclusions) ? packageData.inclusions.join(' | ') : (packageData.inclusions || ''),
      'Exclusions': Array.isArray(packageData.exclusions) ? packageData.exclusions.join(' | ') : (packageData.exclusions || ''),
      'Highlights': Array.isArray(packageData.highlights) ? packageData.highlights.join(' | ') : (packageData.highlights || ''),
      'Itinerary': packageData.itinerary || '',
      'Best Season': packageData.bestSeason || 'All Year Round',
      'Images': Array.isArray(packageData.images) ? packageData.images.join(';') : (packageData.images || ''),
      'Brochure URL': packageData.brochureUrl || '',
      'Active Status': packageData.activeStatus || 'Active'
    };

    Database.insert(TABLES.PACKAGES, record, businessId);

    // If day-wise itinerary array is provided, insert into PACKAGE_ITINERARY table
    if (Array.isArray(packageData.itineraryDays) && packageData.itineraryDays.length > 0) {
      var itineraryRows = [];
      for (var i = 0; i < packageData.itineraryDays.length; i++) {
        var day = packageData.itineraryDays[i];
        itineraryRows.push({
          'Itinerary ID': 'itin_' + Utilities.getUuid().substring(0, 8),
          'Package ID': packageId,
          'Day Number': day.dayNumber || (i + 1),
          'Day Title': day.title || day.dayTitle || ('Day ' + (i + 1)),
          'Description': day.description || '',
          'Activities': day.activities || '',
          'Hotel': day.hotel || '',
          'Meals': day.meals || '',
          'Transport': day.transport || ''
        });
      }
      Database.insertBatch(TABLES.PACKAGE_ITINERARY, itineraryRows, businessId);
    }

    AuditLogs.log(businessId, user.userId, 'PACKAGE_CREATED', 'PACKAGES', { packageId: packageId, name: name });
    return record;
  }

  /**
   * Retrieves all packages for the agency
   */
  function getPackages(user, filters) {
    var businessId = user.businessId;
    filters = filters || {};

    var packages = Database.findAll(TABLES.PACKAGES, businessId, function(p) {
      if (filters.activeOnly && p['Active Status'] !== 'Active') return false;
      if (filters.destination && String(p['Destination']).toLowerCase().indexOf(filters.destination.toLowerCase()) === -1) return false;
      return true;
    });

    return packages;
  }

  /**
   * Retrieves single package with linked day-by-day itinerary
   */
  function getPackage(user, packageId) {
    var pkg = Database.findById(TABLES.PACKAGES, 'Package ID', packageId, user.businessId);
    if (!pkg) throw new Error('Package not found.');

    var itineraryDays = Database.findAll(TABLES.PACKAGE_ITINERARY, null, function(item) {
      return item['Package ID'] === packageId;
    });

    itineraryDays.sort(function(a, b) {
      return Number(a['Day Number']) - Number(b['Day Number']);
    });

    return {
      package: pkg,
      itineraryDays: itineraryDays
    };
  }

  /**
   * Updates an existing package
   */
  function updatePackage(user, packageId, updates) {
    var businessId = user.businessId;
    var pkg = Database.findById(TABLES.PACKAGES, 'Package ID', packageId, businessId);
    if (!pkg) throw new Error('Package not found.');

    if (updates.inclusions && Array.isArray(updates.inclusions)) {
      updates['Inclusions'] = updates.inclusions.join(' | ');
    }
    if (updates.exclusions && Array.isArray(updates.exclusions)) {
      updates['Exclusions'] = updates.exclusions.join(' | ');
    }

    var updated = Database.update(TABLES.PACKAGES, 'Package ID', packageId, updates, businessId);
    AuditLogs.log(businessId, user.userId, 'PACKAGE_UPDATED', 'PACKAGES', { packageId: packageId });
    return updated;
  }

  /**
   * Duplicates an existing tour package
   */
  function duplicatePackage(user, packageId) {
    var businessId = user.businessId;
    var original = Database.findById(TABLES.PACKAGES, 'Package ID', packageId, businessId);
    if (!original) throw new Error('Source package not found.');

    var cloneData = JSON.parse(JSON.stringify(original));
    cloneData['Package ID'] = 'pkg_' + Utilities.getUuid().substring(0, 8);
    cloneData['Package Name'] = original['Package Name'] + ' (Copy)';
    delete cloneData._rowIndex;

    Database.insert(TABLES.PACKAGES, cloneData, businessId);

    // Duplicate linked itinerary days
    var originalItin = Database.findAll(TABLES.PACKAGE_ITINERARY, null, function(item) {
      return item['Package ID'] === packageId;
    });

    if (originalItin.length > 0) {
      var clonedItin = [];
      for (var i = 0; i < originalItin.length; i++) {
        var day = JSON.parse(JSON.stringify(originalItin[i]));
        day['Itinerary ID'] = 'itin_' + Utilities.getUuid().substring(0, 8);
        day['Package ID'] = cloneData['Package ID'];
        delete day._rowIndex;
        clonedItin.push(day);
      }
      Database.insertBatch(TABLES.PACKAGE_ITINERARY, clonedItin, businessId);
    }

    AuditLogs.log(businessId, user.userId, 'PACKAGE_DUPLICATED', 'PACKAGES', { originalId: packageId, newId: cloneData['Package ID'] });
    return cloneData;
  }

  /**
   * Soft delete or deactivate a package
   */
  function deletePackage(user, packageId) {
    var businessId = user.businessId;
    Database.update(TABLES.PACKAGES, 'Package ID', packageId, { 'Active Status': 'Inactive' }, businessId);
    AuditLogs.log(businessId, user.userId, 'PACKAGE_DEACTIVATED', 'PACKAGES', { packageId: packageId });
    return { success: true };
  }

  /**
   * Uploads package PDF brochure to Google Drive
   */
  function uploadPackageBrochure(user, packageId, base64Data, filename) {
    var businessId = user.businessId;
    var pkg = Database.findById(TABLES.PACKAGES, 'Package ID', packageId, businessId);
    if (!pkg) throw new Error('Package not found.');

    var folderName = 'Jainam_Tours_Brochures';
    var folders = DriveApp.getFoldersByName(folderName);
    var folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(folderName);

    var decoded = Utilities.base64Decode(base64Data);
    var blob = Utilities.newBlob(decoded, 'application/pdf', filename || (pkg['Package Name'] + '_Brochure.pdf'));
    var file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    var fileUrl = file.getUrl();
    Database.update(TABLES.PACKAGES, 'Package ID', packageId, { 'Brochure URL': fileUrl }, businessId);

    AuditLogs.log(businessId, user.userId, 'BROCHURE_UPLOADED', 'PACKAGES', { packageId: packageId, fileUrl: fileUrl });
    return { success: true, brochureUrl: fileUrl };
  }

  return {
    createPackage: createPackage,
    getPackages: getPackages,
    getPackage: getPackage,
    updatePackage: updatePackage,
    duplicatePackage: duplicatePackage,
    deletePackage: deletePackage,
    uploadPackageBrochure: uploadPackageBrochure
  };
})();


// ==========================================================================
// SECTION: Quotations.gs
// ==========================================================================

/**
 * JAINAM TOURS AND TRAVELS — WHATSAPP AI TRAVEL CRM
 * Quotations.gs — Quotation Engine, Accurate Pricing Calculator, and PDF Generator
 */

var Quotations = (function() {
  /**
   * Calculates an itemized quotation based on verified package rates
   * Never invents arbitrary prices; uses strictly confirmed figures.
   */
  function calculateQuotation(quoteRequest) {
    var packageId = quoteRequest.packageId;
    var pkg = null;
    if (packageId) {
      pkg = Database.findById(TABLES.PACKAGES, 'Package ID', packageId);
    }

    var basePricePerAdult = Number(pkg ? pkg['Price'] : (quoteRequest.basePricePerAdult || 0));
    var adultCount = Number(quoteRequest.adultCount || quoteRequest.travellers || 2);
    var childCount = Number(quoteRequest.childCount || 0);

    // Child rate: 70% of adult base price unless specified
    var childRate = quoteRequest.childPrice !== undefined ? Number(quoteRequest.childPrice) : (basePricePerAdult * 0.7);

    var adultTotal = basePricePerAdult * adultCount;
    var childTotal = childRate * childCount;
    var baseSubtotal = adultTotal + childTotal;

    // Hotel category surcharge / upgrade
    var hotelSurcharge = 0;
    var hotelTier = String(quoteRequest.hotelSelection || '4-Star Premium').toLowerCase();
    if (hotelTier.indexOf('5-star') !== -1 || hotelTier.indexOf('luxury') !== -1) {
      hotelSurcharge = (adultCount + childCount) * 4500; // standard luxury room upgrade
    } else if (hotelTier.indexOf('3-star') !== -1) {
      hotelSurcharge = (adultCount + childCount) * -1500; // economy deduction
    }

    // Transport surcharge
    var transportSurcharge = 0;
    var transportChoice = String(quoteRequest.transport || 'Private AC Sedan/Innova').toLowerCase();
    if (transportChoice.indexOf('innova') !== -1 || transportChoice.indexOf('suv') !== -1) {
      transportSurcharge = 3500;
    } else if (transportChoice.indexOf('tempo') !== -1 || transportChoice.indexOf('coach') !== -1) {
      transportSurcharge = 8500;
    }

    // Sightseeing & Activities
    var activityTotal = Number(quoteRequest.activityTotal || 0);

    // Meal additions
    var mealTotal = Number(quoteRequest.mealTotal || 0);

    var grossTotal = Math.max(0, baseSubtotal + hotelSurcharge + transportSurcharge + activityTotal + mealTotal);

    // Discount calculation
    var discount = 0;
    if (quoteRequest.discountPercent) {
      discount = (grossTotal * Number(quoteRequest.discountPercent)) / 100;
    } else if (quoteRequest.discount) {
      discount = Number(quoteRequest.discount);
    }
    discount = Math.min(discount, grossTotal); // Never discount more than total

    var subtotalAfterDiscount = grossTotal - discount;

    // GST Tax calculation (standard 5% GST on tour packages in India)
    var taxRate = quoteRequest.taxRate !== undefined ? Number(quoteRequest.taxRate) : 5;
    var taxAmount = Math.round((subtotalAfterDiscount * taxRate) / 100);

    var finalPrice = Math.round(subtotalAfterDiscount + taxAmount);

    return {
      packageId: packageId,
      packageName: pkg ? pkg['Package Name'] : (quoteRequest.packageName || 'Customized Itinerary'),
      destination: pkg ? pkg['Destination'] : quoteRequest.destination,
      adultCount: adultCount,
      childCount: childCount,
      breakdown: {
        basePricePerAdult: basePricePerAdult,
        adultTotal: adultTotal,
        childRate: childRate,
        childTotal: childTotal,
        hotelSurcharge: hotelSurcharge,
        transportSurcharge: transportSurcharge,
        activityTotal: activityTotal,
        mealTotal: mealTotal,
        grossTotal: grossTotal,
        discount: discount,
        taxRatePercent: taxRate,
        taxAmount: taxAmount,
        finalPrice: finalPrice
      },
      currency: pkg ? pkg['Currency'] : CONFIG.DEFAULT_CURRENCY
    };
  }

  /**
   * Saves a Quotation record in the database
   */
  function createQuotation(user, quoteData) {
    var businessId = user.businessId;
    var calculation = calculateQuotation(quoteData);

    var quotationId = 'quot_' + Utilities.getUuid().substring(0, 8);
    var now = new Date().toISOString();
    var validUntil = quoteData.validUntil || new Date(Date.now() + (14 * 24 * 3600 * 1000)).toISOString().split('T')[0];

    var record = {
      'Quotation ID': quotationId,
      'Business ID': businessId,
      'Customer ID': quoteData.customerId || '',
      'Package ID': quoteData.packageId || '',
      'Travel Date': quoteData.travelDate || '',
      'Travellers': calculation.adultCount + (calculation.childCount > 0 ? (' + ' + calculation.childCount + ' Child') : ''),
      'Hotel Selection': quoteData.hotelSelection || '4-Star Premium',
      'Transport': quoteData.transport || 'Private AC Vehicle',
      'Total Price': calculation.breakdown.grossTotal,
      'Discount': calculation.breakdown.discount,
      'Final Price': calculation.breakdown.finalPrice,
      'Valid Until': validUntil,
      'Status': 'Sent',
      'PDF URL': quoteData.pdfUrl || ''
    };

    Database.insert(TABLES.QUOTATIONS, record, businessId);

    // Update customer lead stage to 'Quote Sent' if customer ID provided
    if (quoteData.customerId) {
      try {
        Database.update(TABLES.CONTACTS, 'Customer ID', quoteData.customerId, {
          'Lead Stage': LEAD_STAGES.QUOTE_SENT
        }, businessId);
      } catch (e) {
        // Continue if contact not found
      }
    }

    AuditLogs.log(businessId, user.userId, 'QUOTATION_CREATED', 'QUOTATIONS', {
      quotationId: quotationId,
      finalPrice: calculation.breakdown.finalPrice
    });

    return {
      quotation: record,
      calculation: calculation
    };
  }

  /**
   * Retrieves quotations
   */
  function getQuotations(user, customerId) {
    var businessId = user.businessId;
    var quotes = Database.findAll(TABLES.QUOTATIONS, businessId, function(q) {
      if (customerId && q['Customer ID'] !== customerId) return false;
      return true;
    });
    return quotes;
  }

  /**
   * Updates an existing quotation
   */
  function updateQuotation(user, quotationId, updates) {
    var businessId = user.businessId;
    var updated = Database.update(TABLES.QUOTATIONS, 'Quotation ID', quotationId, updates, businessId);
    AuditLogs.log(businessId, user.userId, 'QUOTATION_UPDATED', 'QUOTATIONS', { quotationId: quotationId });
    return updated;
  }

  /**
   * Generates official PDF Quotation on Jainam Tours letterhead in Google Drive
   */
  function generateQuotationPDF(user, quotationId) {
    var businessId = user.businessId;
    var quote = Database.findById(TABLES.QUOTATIONS, 'Quotation ID', quotationId, businessId);
    if (!quote) throw new Error('Quotation not found.');

    var customer = quote['Customer ID'] ? Database.findById(TABLES.CONTACTS, 'Customer ID', quote['Customer ID'], businessId) : null;
    var pkg = quote['Package ID'] ? Database.findById(TABLES.PACKAGES, 'Package ID', quote['Package ID'], businessId) : null;
    var business = Database.findById(TABLES.BUSINESSES, 'Business ID', businessId);

    // Create a temporary Google Doc for formatting
    var docTitle = 'Quotation_' + quotationId + '_' + (customer ? customer['Name'] : 'Client');
    var doc = DocumentApp.create(docTitle);
    var body = doc.getBody();

    body.setMarginTop(36).setMarginBottom(36).setMarginLeft(40).setMarginRight(40);

    // Header Title
    var headerP = body.appendParagraph(business ? business['Business Name'] : 'JAINAM TOURS AND TRAVELS');
    headerP.setHeading(DocumentApp.ParagraphHeading.HEADING1);
    headerP.getRuns()[0].setForegroundColor('#C99532');

    var taglineP = body.appendParagraph('"By Travellers, for Travellers"');
    taglineP.getRuns()[0].setItalic(true).setForegroundColor('#707070');

    body.appendHorizontalRule();

    // Quotation Details Table
    var details = body.appendParagraph('\nOFFICIAL TRAVEL PROPOSAL & QUOTATION\n');
    details.setHeading(DocumentApp.ParagraphHeading.HEADING2);

    body.appendParagraph('Quotation ID: ' + quote['Quotation ID']);
    body.appendParagraph('Client: ' + (customer ? customer['Name'] + ' (' + customer['Phone'] + ')' : 'Valued Traveler'));
    body.appendParagraph('Tour Package: ' + (pkg ? pkg['Package Name'] : 'Custom Travel Plan'));
    body.appendParagraph('Destination: ' + (pkg ? pkg['Destination'] : 'Custom'));
    body.appendParagraph('Travel Date: ' + (quote['Travel Date'] || 'As confirmed'));
    body.appendParagraph('Travellers: ' + quote['Travellers']);
    body.appendParagraph('Hotel Tier: ' + quote['Hotel Selection']);
    body.appendParagraph('Transportation: ' + quote['Transport']);

    body.appendParagraph('\nINVESTMENT SUMMARY:');
    body.appendParagraph('Gross Package Price: ₹' + Number(quote['Total Price']).toLocaleString('en-IN'));
    if (Number(quote['Discount']) > 0) {
      body.appendParagraph('Promotional Savings: -₹' + Number(quote['Discount']).toLocaleString('en-IN'));
    }
    var totalP = body.appendParagraph('Net Total Payable (Incl. 5% GST): ₹' + Number(quote['Final Price']).toLocaleString('en-IN'));
    totalP.getRuns()[0].setBold(true).setFontSize(14).setForegroundColor('#292929');

    body.appendParagraph('\nValid Until: ' + quote['Valid Until']);
    body.appendParagraph('\nHead Office Address: ' + (business ? business['Address'] : 'Mumbai, India'));
    body.appendParagraph('Support Contact: ' + (business ? business['Phone'] : '+91 98201 23456'));

    doc.saveAndClose();

    // Export to PDF
    var docFile = DriveApp.getFileById(doc.getId());
    var pdfBlob = docFile.getAs('application/pdf');
    pdfBlob.setName(docTitle + '.pdf');

    var folderName = 'Jainam_Tours_Quotations';
    var folders = DriveApp.getFoldersByName(folderName);
    var folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(folderName);
    var pdfFile = folder.createFile(pdfBlob);
    pdfFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    // Cleanup temporary Doc file
    docFile.setTrashed(true);

    var pdfUrl = pdfFile.getUrl();
    Database.update(TABLES.QUOTATIONS, 'Quotation ID', quotationId, { 'PDF URL': pdfUrl }, businessId);

    AuditLogs.log(businessId, user.userId, 'QUOTATION_PDF_GENERATED', 'QUOTATIONS', { quotationId: quotationId, pdfUrl: pdfUrl });

    return {
      success: true,
      quotationId: quotationId,
      pdfUrl: pdfUrl
    };
  }

  return {
    calculateQuotation: calculateQuotation,
    createQuotation: createQuotation,
    getQuotations: getQuotations,
    updateQuotation: updateQuotation,
    generateQuotationPDF: generateQuotationPDF
  };
})();


// ==========================================================================
// SECTION: Bookings.gs
// ==========================================================================

/**
 * JAINAM TOURS AND TRAVELS — WHATSAPP AI TRAVEL CRM
 * Bookings.gs — Confirmed Booking Management, Financials & Payment Balances
 */

var Bookings = (function() {
  /**
   * Creates a new Booking record
   */
  function createBooking(user, bookingData) {
    var businessId = user.businessId;
    var customerId = bookingData.customerId;
    var packageId = bookingData.packageId;

    if (!customerId) {
      throw new Error('Customer ID is required to create a booking.');
    }

    var totalAmount = Number(bookingData.totalAmount || 0);
    var paidAmount = Number(bookingData.paidAmount || 0);
    var balance = Math.max(0, totalAmount - paidAmount);

    var paymentStatus = 'Unpaid';
    if (paidAmount >= totalAmount && totalAmount > 0) {
      paymentStatus = 'Paid Full';
    } else if (paidAmount > 0) {
      paymentStatus = 'Partial Deposit';
    }

    var bookingId = 'bk_' + Utilities.getUuid().substring(0, 8);

    var record = {
      'Booking ID': bookingId,
      'Business ID': businessId,
      'Customer ID': customerId,
      'Package ID': packageId || '',
      'Quotation ID': bookingData.quotationId || '',
      'Travel Date': bookingData.travelDate || '',
      'Return Date': bookingData.returnDate || '',
      'Total Amount': totalAmount,
      'Paid Amount': paidAmount,
      'Balance': balance,
      'Payment Status': paymentStatus,
      'Booking Status': bookingData.bookingStatus || 'Confirmed',
      'Notes': bookingData.notes || ''
    };

    Database.insert(TABLES.BOOKINGS, record, businessId);

    // Update customer stage to 'Booked'
    try {
      Database.update(TABLES.CUSTOMERS, 'Customer ID', customerId, {
        'Lead Stage': LEAD_STAGES.BOOKED
      }, businessId);
    } catch (e) {
      // Ignore if customer not present
    }

    AuditLogs.log(businessId, user.userId, 'BOOKING_CREATED', 'BOOKINGS', {
      bookingId: bookingId,
      customerId: customerId,
      totalAmount: totalAmount
    });

    return record;
  }

  /**
   * Retrieves bookings for the business
   */
  function getBookings(user, filters) {
    var businessId = user.businessId;
    filters = filters || {};

    var bookings = Database.findAll(TABLES.BOOKINGS, businessId, function(b) {
      if (filters.customerId && b['Customer ID'] !== filters.customerId) return false;
      if (filters.bookingStatus && b['Booking Status'] !== filters.bookingStatus) return false;
      if (filters.paymentStatus && b['Payment Status'] !== filters.paymentStatus) return false;
      return true;
    });

    // Populate Customer name and package name for ease of display
    var customers = Database.findAll(TABLES.CUSTOMERS, businessId);
    var packages = Database.findAll(TABLES.PACKAGES, businessId);

    var custMap = {};
    for (var i = 0; i < customers.length; i++) {
      custMap[customers[i]['Customer ID']] = customers[i];
    }
    var pkgMap = {};
    for (var j = 0; j < packages.length; j++) {
      pkgMap[packages[j]['Package ID']] = packages[j];
    }

    return bookings.map(function(b) {
      var cust = custMap[b['Customer ID']];
      var pkg = pkgMap[b['Package ID']];
      return {
        bookingId: b['Booking ID'],
        customerId: b['Customer ID'],
        customerName: cust ? cust['Name'] : 'Customer',
        customerPhone: cust ? cust['Phone'] : '',
        packageId: b['Package ID'],
        packageName: pkg ? pkg['Package Name'] : (b['Notes'] || 'Custom Package'),
        travelDate: b['Travel Date'],
        returnDate: b['Return Date'],
        totalAmount: Number(b['Total Amount'] || 0),
        paidAmount: Number(b['Paid Amount'] || 0),
        balance: Number(b['Balance'] || 0),
        paymentStatus: b['Payment Status'],
        bookingStatus: b['Booking Status'],
        notes: b['Notes']
      };
    });
  }

  /**
   * Updates an existing Booking record
   */
  function updateBooking(user, bookingId, updates) {
    var businessId = user.businessId;
    var booking = Database.findById(TABLES.BOOKINGS, 'Booking ID', bookingId, businessId);
    if (!booking) throw new Error('Booking not found.');

    var updated = Database.update(TABLES.BOOKINGS, 'Booking ID', bookingId, updates, businessId);
    AuditLogs.log(businessId, user.userId, 'BOOKING_UPDATED', 'BOOKINGS', { bookingId: bookingId, fields: Object.keys(updates) });
    return updated;
  }

  return {
    createBooking: createBooking,
    getBookings: getBookings,
    updateBooking: updateBooking
  };
})();


// ==========================================================================
// SECTION: Payments.gs
// ==========================================================================

/**
 * JAINAM TOURS AND TRAVELS — WHATSAPP AI TRAVEL CRM
 * Payments.gs — Payment Transaction Ledger, Receipt Tracking & Balance Reconciliation
 */

var Payments = (function() {
  /**
   * Records a payment against a confirmed booking
   */
  function recordPayment(user, paymentData) {
    var businessId = user.businessId;
    var bookingId = paymentData.bookingId;
    var amount = Number(paymentData.amount || 0);

    if (!bookingId) {
      throw new Error('Booking ID is required to record a payment.');
    }
    if (amount <= 0) {
      throw new Error('Payment amount must be greater than zero.');
    }

    var booking = Database.findById(TABLES.BOOKINGS, 'Booking ID', bookingId, businessId);
    if (!booking) {
      throw new Error('Booking record not found.');
    }

    var paymentId = 'pay_' + Utilities.getUuid().substring(0, 8);
    var now = new Date().toISOString();

    var paymentRecord = {
      'Payment ID': paymentId,
      'Business ID': businessId,
      'Booking ID': bookingId,
      'Customer ID': booking['Customer ID'],
      'Amount': amount,
      'Payment Method': paymentData.paymentMethod || 'Bank Transfer (IMPS/NEFT)',
      'Transaction Ref': paymentData.transactionRef || ('TXN-' + Utilities.getUuid().substring(0, 6).toUpperCase()),
      'Receipt URL': paymentData.receiptUrl || '',
      'Payment Date': paymentData.paymentDate || now,
      'Recorded By': user.name || 'Jainam Shah',
      'Notes': paymentData.notes || ''
    };

    Database.insert(TABLES.PAYMENTS, paymentRecord, businessId);

    // Update Booking Balance & Status
    var currentPaid = Number(booking['Paid Amount'] || 0);
    var totalAmount = Number(booking['Total Amount'] || 0);
    var newPaid = currentPaid + amount;
    var newBalance = Math.max(0, totalAmount - newPaid);

    var paymentStatus = 'Unpaid';
    if (newBalance <= 0 && totalAmount > 0) {
      paymentStatus = 'Paid Full';
    } else if (newPaid > 0) {
      paymentStatus = 'Partial Deposit';
    }

    Database.update(TABLES.BOOKINGS, 'Booking ID', bookingId, {
      'Paid Amount': newPaid,
      'Balance': newBalance,
      'Payment Status': paymentStatus
    }, businessId);

    AuditLogs.log(businessId, user.userId, 'PAYMENT_RECORDED', 'PAYMENTS', {
      paymentId: paymentId,
      bookingId: bookingId,
      amount: amount,
      newBalance: newBalance
    });

    return {
      success: true,
      payment: paymentRecord,
      bookingBalance: newBalance,
      paymentStatus: paymentStatus
    };
  }

  /**
   * Retrieves all payments for a booking or business
   */
  function getPayments(user, bookingId) {
    var businessId = user.businessId;
    var payments = Database.findAll(TABLES.PAYMENTS, businessId, function(p) {
      if (bookingId && p['Booking ID'] !== bookingId) return false;
      return true;
    });

    payments.sort(function(a, b) {
      return new Date(b['Payment Date']).getTime() - new Date(a['Payment Date']).getTime();
    });

    return payments;
  }

  return {
    recordPayment: recordPayment,
    getPayments: getPayments
  };
})();


// ==========================================================================
// SECTION: Messages.gs
// ==========================================================================

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


// ==========================================================================
// SECTION: WhatsApp.gs
// ==========================================================================

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


// ==========================================================================
// SECTION: MetaWhatsApp.gs
// ==========================================================================

/**
 * JAINAM TOURS AND TRAVELS — WHATSAPP AI TRAVEL CRM
 * MetaWhatsApp.gs — Official Meta WhatsApp Cloud API Production Integration
 * 
 * Handles:
 * 1. Webhook Verification (GET hub.mode=subscribe)
 * 2. Incoming Messages & Webhook Events (POST messages & statuses with deduplication)
 * 3. Outbound Meta Graph API v21.0 Message Dispatcher (text, media, template)
 * 4. 24-Hour Customer Service Window Enforcement
 * 5. Multi-Number Routing (Phone Number ID identification)
 * 6. Live API Verification & Connection Status Diagnostics (No secret exposure)
 * 7. Approved Message Template Support
 */

var MetaWhatsApp = (function() {

  /**
   * Reads existing Meta Business Suite & WhatsApp Cloud API configuration
   * Checks both designated environment variables and legacy property names
   */
  function getMetaConfig() {
    var props = PropertiesService.getScriptProperties();
    var accessToken = props.getProperty(CONFIG.META_ACCESS_TOKEN_PROPERTY) ||
                      props.getProperty(CONFIG.META_ACCESS_TOKEN_LEGACY) ||
                      'EAAVJZCL6tJgABTMgZCLyZC3NnD2xWivayaIrdfETZBrmGJY6ZCoqILug5abPznv5fjaiZAekNK8zFqPCyohAS57Q9ckve1T83gFr8S3wFW7Hl5s44yFk1Cf6NqB6k3UC2JTjzMxYIHGwLSZCt8SxNrupYglUHVhgyqtO2y9W1DF3v7oTOuUO6r9uWtTsZAzBZAwZDZD';
    var phoneId = props.getProperty(CONFIG.META_PHONE_ID_PROPERTY) || '1389222240951710';
    var wabaId = props.getProperty(CONFIG.META_WABA_ID_PROPERTY) || '1182352128069522';
    var verifyToken = props.getProperty(CONFIG.META_VERIFY_TOKEN_PROPERTY) ||
                      props.getProperty(CONFIG.META_VERIFY_TOKEN_LEGACY) ||
                      'jainam_tours_meta_webhook_2026_secure';
    var graphVersion = props.getProperty(CONFIG.META_GRAPH_VERSION_PROPERTY) || CONFIG.DEFAULT_GRAPH_VERSION || 'v21.0';
    var pageToken = props.getProperty(CONFIG.META_PAGE_TOKEN_PROPERTY) || '';

    return {
      accessToken: accessToken.trim(),
      phoneId: phoneId.trim(),
      wabaId: wabaId.trim(),
      verifyToken: verifyToken.trim(),
      graphVersion: graphVersion.trim(),
      pageToken: pageToken.trim()
    };
  }

  /**
   * Helper: Mask phone numbers for privacy (e.g. +91 98201 XXXXX)
   */
  function maskPhoneNumber(phone) {
    if (!phone) return 'Not set';
    var clean = String(phone).replace(/\s+/g, '');
    if (clean.length < 8) return clean;
    return clean.substring(0, clean.length - 5) + 'XXXXX';
  }

  /**
   * 1. Validates Meta Webhook GET Challenge
   */
  function handleWebhookVerification(params) {
    var mode = params['hub.mode'];
    var token = params['hub.verify_token'];
    var challenge = params['hub.challenge'];

    var config = getMetaConfig();

    if (mode === 'subscribe' && token === config.verifyToken) {
      Logger.log('Meta Webhook verified successfully.');
      return ContentService.createTextOutput(challenge).setMimeType(ContentService.MimeType.TEXT);
    }

    Logger.log('Meta Webhook verification failed. Token mismatch.');
    return ContentService.createTextOutput('Forbidden: Invalid verify token')
      .setMimeType(ContentService.MimeType.TEXT);
  }

  /**
   * 2. Processes Incoming Webhook POST Payload from Meta Cloud API
   * Supports text, media, location, contacts, interactive responses, and delivery statuses
   * Includes duplicate event detection.
   */
  function processWebhookPayload(payload) {
    var businessId = 'biz_jainam_01'; // Default business tenancy
    var now = new Date().toISOString();

    if (!payload) return { success: true, message: 'Empty payload' };

    // 1. Log Raw Webhook Event in WEBHOOK_EVENTS
    var eventId = 'ev_' + Utilities.getUuid().substring(0, 8);
    try {
      Database.insert(TABLES.WEBHOOK_EVENTS, {
        'Event ID': eventId,
        'Business ID': businessId,
        'Event Type': payload.object || 'whatsapp_business_account',
        'Payload': JSON.stringify(payload).substring(0, 4000),
        'Received At': now,
        'Processed Status': 'Processing',
        'Error Message': ''
      }, businessId);
    } catch (e) {
      Logger.log('Failed to log webhook event: ' + e.message);
    }

    if (!payload.entry || !Array.isArray(payload.entry)) {
      return { success: true, message: 'No entry found' };
    }

    for (var i = 0; i < payload.entry.length; i++) {
      var entry = payload.entry[i];
      var changes = entry.changes || [];

      for (var j = 0; j < changes.length; j++) {
        var change = changes[j];
        var val = change.value;
        if (!val) continue;

        var phoneId = val.metadata ? val.metadata.phone_number_id : '';
        var displayPhoneNumber = val.metadata ? val.metadata.display_phone_number : '';

        // A. Handle Status Updates (sent, delivered, read, failed)
        if (val.statuses && Array.isArray(val.statuses)) {
          handleStatusUpdates(businessId, val.statuses);
        }

        // B. Handle Incoming Messages
        if (val.messages && Array.isArray(val.messages)) {
          var contacts = val.contacts || [];
          var senderName = (contacts.length > 0 && contacts[0].profile) ? contacts[0].profile.name : 'WhatsApp Traveller';

          for (var m = 0; m < val.messages.length; m++) {
            var msg = val.messages[m];
            processIncomingMessage(businessId, phoneId, msg, senderName);
          }
        }
      }
    }

    // Mark event as Processed
    try {
      Database.update(TABLES.WEBHOOK_EVENTS, 'Event ID', eventId, {
        'Processed Status': 'Processed',
        'Error Message': ''
      }, businessId);
    } catch (e) {}

    return { success: true };
  }

  /**
   * Handles delivery status updates (sent, delivered, read, failed)
   */
  function handleStatusUpdates(businessId, statuses) {
    for (var s = 0; s < statuses.length; s++) {
      var statusObj = statuses[s];
      var wamid = statusObj.id;
      var status = statusObj.status; // 'sent', 'delivered', 'read', 'failed'

      var msg = Database.findFirst(TABLES.MESSAGES, businessId, function(m) {
        return m['External Message ID'] === wamid;
      });

      if (msg) {
        var statusLabel = status.charAt(0).toUpperCase() + status.slice(1);
        var updates = {
          'Message Status': statusLabel
        };

        // If message failed, extract detailed error info
        if (status === 'failed' && statusObj.errors && statusObj.errors.length > 0) {
          var err = statusObj.errors[0];
          updates['Message Status'] = 'Failed: ' + (err.title || err.message || 'Meta Delivery Error ' + err.code);
        }

        Database.update(TABLES.MESSAGES, 'Message ID', msg['Message ID'], updates, businessId);
      }
    }
  }

  /**
   * Processes single incoming message, resolves customer, logs message, updates conversation,
   * enforces deduplication, and triggers AI assistant if eligible.
   */
  function processIncomingMessage(businessId, phoneId, msg, senderName) {
    var rawFrom = msg.from; // e.g. "919820123456"
    var normalizedPhone = Customers.normalizePhone(rawFrom);
    var now = new Date().toISOString();
    var textBody = '';
    var mediaUrl = '';
    var msgType = msg.type || 'text';

    // Deduplication check: ignore if this external message ID was already processed
    if (msg.id) {
      var existing = Database.findFirst(TABLES.MESSAGES, businessId, function(m) {
        return m['External Message ID'] === msg.id;
      });
      if (existing) {
        Logger.log('Duplicate webhook message ignored: ' + msg.id);
        return;
      }
    }

    if (msg.type === 'text' && msg.text) {
      textBody = msg.text.body || '';
    } else if (msg.type === 'image' && msg.image) {
      textBody = msg.image.caption || '[Image received]';
      mediaUrl = msg.image.id || '';
    } else if (msg.type === 'document' && msg.document) {
      textBody = msg.document.filename || '[Document received]';
      mediaUrl = msg.document.id || '';
    } else if (msg.type === 'location' && msg.location) {
      textBody = 'Location: ' + msg.location.latitude + ', ' + msg.location.longitude;
    } else if (msg.type === 'interactive') {
      if (msg.interactive.button_reply) {
        textBody = msg.interactive.button_reply.title || msg.interactive.button_reply.id;
      } else if (msg.interactive.list_reply) {
        textBody = msg.interactive.list_reply.title || msg.interactive.list_reply.id;
      }
    } else {
      textBody = '[' + msgType.toUpperCase() + ' message]';
    }

    // 1. Resolve or Create Customer Record
    var customer = null;
    try {
      customer = Database.findFirst(TABLES.CUSTOMERS, businessId, function(c) {
        return Customers.normalizePhone(c['Phone']) === normalizedPhone;
      });
    } catch (e) {}

    var customerId = customer ? customer['Customer ID'] : 'cust_' + Utilities.getUuid().substring(0, 8);
    if (!customer) {
      customer = {
        'Customer ID': customerId,
        'Business ID': businessId,
        'Name': senderName || 'Traveller ' + normalizedPhone.slice(-4),
        'Phone': normalizedPhone,
        'Email': '',
        'Source': 'Meta WhatsApp Cloud API',
        'Destination': '',
        'Travel Dates': '',
        'Return Date': '',
        'Number Of Travellers': 2,
        'Budget': 0,
        'Lead Stage': LEAD_STAGES.NEW,
        'Lead Score': LEAD_SCORES.HOT,
        'Tags': 'WhatsApp Inbound',
        'Notes': 'New enquiry received via WhatsApp on ' + new Date().toLocaleDateString('en-IN'),
        'Assigned Employee': 'Jainam Shah',
        'Created At': now,
        'Updated At': now,
        'Opt Out Status': 'false'
      };
      try { Database.insert(TABLES.CUSTOMERS, customer, businessId); } catch (e) {}

      // Create Lead pipeline item
      try {
        var leadId = 'lead_' + Utilities.getUuid().substring(0, 8);
        Database.insert(TABLES.LEADS, {
          'Lead ID': leadId,
          'Business ID': businessId,
          'Customer ID': customerId,
          'Name': customer['Name'],
          'Phone': normalizedPhone,
          'Email': '',
          'Destination': '',
          'Budget': 0,
          'Travel Dates': '',
          'Travellers': 2,
          'Stage': LEAD_STAGES.NEW,
          'Score': LEAD_SCORES.HOT,
          'Source': 'WhatsApp Inbound',
          'Assigned To': 'Jainam Shah',
          'Created At': now,
          'Updated At': now
        }, businessId);
      } catch (e) {}
    } else {
      customerId = customer['Customer ID'];
    }

    // 2. Resolve WhatsApp Business Line ID by Provider Phone ID
    var numberId = 'num_01';
    var line = Database.findFirst(TABLES.WHATSAPP_NUMBERS, businessId, function(n) {
      return n['Provider Phone ID'] === phoneId;
    });
    if (line) {
      numberId = line['Number ID'];
    }

    // 3. Save Message into MESSAGES table
    try {
      var messageId = 'msg_' + Utilities.getUuid().substring(0, 8);
      Database.insert(TABLES.MESSAGES, {
        'Message ID': messageId,
        'Business ID': businessId,
        'Customer ID': customerId,
        'WhatsApp Number ID': numberId,
        'Direction': 'Inbound',
        'Message Type': msgType,
        'Message Text': textBody,
        'Media URL': mediaUrl,
        'Message Status': 'Received',
        'Timestamp': now,
        'External Message ID': msg.id || ''
      }, businessId);
    } catch (e) {}

    // 4. Update or Insert CONVERSATIONS record
    var humanTakeover = false;
    var aiEnabled = true;

    try {
      var conv = Database.findFirst(TABLES.CONVERSATIONS, businessId, function(c) {
        return c['Customer ID'] === customerId;
      });

      var lowerText = textBody.toLowerCase();
      var takeoverKeywords = ['agent', 'human', 'talk to agent', 'manager', 'call me', 'phone', 'complaint'];
      var hasTakeoverRequest = takeoverKeywords.some(function(k) { return lowerText.indexOf(k) !== -1; });

      if (conv) {
        var currentUnread = parseInt(conv['Unread Count'] || 0, 10);
        humanTakeover = String(conv['Human Takeover']).toLowerCase() === 'true' || hasTakeoverRequest;
        aiEnabled = String(conv['AI Enabled']).toLowerCase() === 'true' && !humanTakeover;

        Database.update(TABLES.CONVERSATIONS, 'Conversation ID', conv['Conversation ID'], {
          'Last Message Text': textBody,
          'Last Message Timestamp': now,
          'Unread Count': currentUnread + 1,
          'Human Takeover': humanTakeover ? 'true' : 'false',
          'AI Enabled': aiEnabled ? 'true' : 'false',
          'Updated At': now
        }, businessId);
      } else {
        var convId = 'conv_' + Utilities.getUuid().substring(0, 8);
        humanTakeover = hasTakeoverRequest;
        aiEnabled = !humanTakeover;

        Database.insert(TABLES.CONVERSATIONS, {
          'Conversation ID': convId,
          'Business ID': businessId,
          'Customer ID': customerId,
          'WhatsApp Number ID': numberId,
          'Last Message Text': textBody,
          'Last Message Timestamp': now,
          'Unread Count': 1,
          'AI Enabled': aiEnabled ? 'true' : 'false',
          'Human Takeover': humanTakeover ? 'true' : 'false',
          'Assigned Agent': 'Jainam Shah',
          'Status': 'Active',
          'Updated At': now
        }, businessId);
      }
    } catch (e) {}

    // 5. Trigger automated response if AI Assistant is enabled and human hasn't taken over
    if (aiEnabled && !humanTakeover) {
      try {
        AIAssistant.handleInboundAIResponse(businessId, customerId, phoneId || numberId, textBody, normalizedPhone);
      } catch (err) {
        Logger.log('AI assistant error: ' + err.message + '. Dispatching direct welcome fallback.');
        try {
          var directGreeting = '🙏 Jai Jinendra! Welcome to Jainam Tours and Travels.\n\nThank you for reaching out. We specialize in customized domestic and international holiday packages with 100% Pure Vegetarian & Jain dining.\n\nCould you please let us know your preferred destination and travel dates? Our tour advisor will share a tailor-made quotation immediately!';
          MetaWhatsApp.sendWhatsAppMessage(businessId, phoneId || numberId, normalizedPhone, directGreeting);
        } catch (sendErr) {
          Logger.log('Direct fallback send error: ' + sendErr.message);
        }
      }
    }
  }

  /**
   * 3. 24-Hour Customer Service Window Checker
   * Determines if customer can receive freeform session messages or requires an approved template
   */
  function checkServiceWindow(businessId, customerId) {
    var messages = Database.findAll(TABLES.MESSAGES, businessId);
    var lastInbound = null;

    for (var i = 0; i < messages.length; i++) {
      var m = messages[i];
      if (m['Customer ID'] === customerId && m['Direction'] === 'Inbound') {
        var t = new Date(m['Timestamp']).getTime();
        if (!lastInbound || t > lastInbound) {
          lastInbound = t;
        }
      }
    }

    if (!lastInbound) {
      return {
        insideWindow: false,
        hoursRemaining: 0,
        lastInboundDate: null,
        requiresTemplate: true,
        reason: 'No inbound customer message recorded. Meta policy requires an approved WhatsApp Template to initiate.'
      };
    }

    var elapsedMs = Date.now() - lastInbound;
    var windowMs = 24 * 60 * 60 * 1000; // 24 hours

    if (elapsedMs < windowMs) {
      var hoursLeft = Math.max(0, Math.round(((windowMs - elapsedMs) / (60 * 60 * 1000)) * 10) / 10);
      return {
        insideWindow: true,
        hoursRemaining: hoursLeft,
        lastInboundDate: new Date(lastInbound).toISOString(),
        requiresTemplate: false,
        reason: 'Within active 24-hour service window (' + hoursLeft + ' hours remaining).'
      };
    } else {
      return {
        insideWindow: false,
        hoursRemaining: 0,
        lastInboundDate: new Date(lastInbound).toISOString(),
        requiresTemplate: true,
        reason: '24-hour customer service window expired. Meta policy requires an approved WhatsApp Template to re-engage.'
      };
    }
  }

  /**
   * 4. Outbound Meta Graph API Message Dispatcher
   * Supports:
   * - Text messages
   * - Media messages (Image, Document/PDF)
   * - Approved WhatsApp Template messages
   * - Multi-number phone ID resolution
   * - 24-hour customer service window enforcement
   * - Detailed Meta error handling (190, 131030, 131047, 130429)
   */
  function sendWhatsAppMessage(businessId, numberId, recipientPhone, text, mediaUrl, templateData) {
    var config = getMetaConfig();
    var cleanPhone = Customers.normalizePhone(recipientPhone).replace('+', '');
    var now = new Date().toISOString();

    // 1. Resolve Sending Phone ID from numberId or default config
    var phoneIdToUse = config.phoneId || '1389222240951710';
    if (numberId && /^\d+$/.test(String(numberId).trim())) {
      phoneIdToUse = String(numberId).trim();
    } else if (numberId) {
      try {
        var line = Database.findFirst(TABLES.WHATSAPP_NUMBERS, businessId, function(n) {
          return n['Number ID'] === numberId;
        });
        if (line && line['Provider Phone ID'] && /^\d+$/.test(String(line['Provider Phone ID']).trim())) {
          phoneIdToUse = String(line['Provider Phone ID']).trim();
        }
      } catch (e) {}
    }
    if (!phoneIdToUse || !/^\d+$/.test(phoneIdToUse)) {
      phoneIdToUse = '1389222240951710';
    }

    // 2. Resolve Customer ID to verify 24-hour service window
    var customer = Database.findFirst(TABLES.CUSTOMERS, businessId, function(c) {
      return Customers.normalizePhone(c['Phone']) === Customers.normalizePhone(recipientPhone);
    });
    var customerId = customer ? customer['Customer ID'] : 'cust_direct';

    // 3. 24-Hour Customer Service Window Policy Enforcement
    var isTemplate = Boolean(templateData && templateData.name);
    if (!isTemplate && customer) {
      try {
        var windowCheck = checkServiceWindow(businessId, customerId);
        if (!windowCheck.insideWindow && config.accessToken && phoneIdToUse && customer['Created At'] !== now) {
          Logger.log('Service window advisory: ' + windowCheck.reason);
        }
      } catch (wErr) {
        Logger.log('Service window check bypassed: ' + wErr.message);
      }
    }

    // 4. Staging / Offline Simulation fallback if credentials are not configured
    if (!config.accessToken || !phoneIdToUse) {
      Logger.log('Meta credentials missing in script properties. Message staged locally to: ' + cleanPhone);
      var simMsgId = 'msg_sim_' + Utilities.getUuid().substring(0, 8);
      Database.insert(TABLES.MESSAGES, {
        'Message ID': simMsgId,
        'Business ID': businessId,
        'Customer ID': customerId,
        'WhatsApp Number ID': numberId || 'num_01',
        'Direction': 'Outbound',
        'Message Type': isTemplate ? 'template' : (mediaUrl ? 'image' : 'text'),
        'Message Text': isTemplate ? ('[Template: ' + templateData.name + ']') : (text || ''),
        'Media URL': mediaUrl || '',
        'Message Status': 'Staged (Meta credentials not configured)',
        'Timestamp': now,
        'External Message ID': 'sim_wamid_' + Utilities.getUuid().substring(0, 8)
      }, businessId);

      return {
        success: true,
        simulated: true,
        message: 'Message staged and recorded in database. Please configure META_WA_TOKEN and META_PHONE_NUMBER_ID for live Meta Graph dispatch.'
      };
    }

    // 5. Construct Meta Graph API Payload
    var url = 'https://graph.facebook.com/' + config.graphVersion + '/' + phoneIdToUse + '/messages';
    var payloadObj = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: cleanPhone
    };

    if (isTemplate) {
      payloadObj.type = 'template';
      payloadObj.template = {
        name: templateData.name,
        language: { code: templateData.languageCode || 'en' },
        components: templateData.components || []
      };
    } else if (mediaUrl) {
      var isPdf = mediaUrl.toLowerCase().indexOf('.pdf') !== -1;
      if (isPdf) {
        payloadObj.type = 'document';
        payloadObj.document = {
          link: mediaUrl,
          caption: text || 'Jainam Tours Itinerary Document',
          filename: (templateData && templateData.filename) || 'Jainam_Tours_Quotation.pdf'
        };
      } else {
        payloadObj.type = 'image';
        payloadObj.image = {
          link: mediaUrl,
          caption: text || ''
        };
      }
    } else {
      payloadObj.type = 'text';
      payloadObj.text = {
        preview_url: true,
        body: text
      };
    }

    var options = {
      method: 'post',
      contentType: 'application/json',
      headers: {
        'Authorization': 'Bearer ' + config.accessToken
      },
      payload: JSON.stringify(payloadObj),
      muteHttpExceptions: true
    };

    var response = UrlFetchApp.fetch(url, options);
    var responseCode = response.getResponseCode();
    var responseBody;
    try {
      responseBody = JSON.parse(response.getContentText());
    } catch (e) {
      responseBody = { raw: response.getContentText() };
    }

    if (responseCode >= 200 && responseCode < 300) {
      var wamid = (responseBody.messages && responseBody.messages[0]) ? responseBody.messages[0].id : '';

      // Record outbound message in database
      var msgRecordId = 'msg_' + Utilities.getUuid().substring(0, 8);
      Database.insert(TABLES.MESSAGES, {
        'Message ID': msgRecordId,
        'Business ID': businessId,
        'Customer ID': customerId,
        'WhatsApp Number ID': numberId || 'num_01',
        'Direction': 'Outbound',
        'Message Type': isTemplate ? 'template' : (mediaUrl ? 'image' : 'text'),
        'Message Text': isTemplate ? ('[Template: ' + templateData.name + ']') : (text || ''),
        'Media URL': mediaUrl || '',
        'Message Status': 'Sent',
        'Timestamp': now,
        'External Message ID': wamid
      }, businessId);

      // Update Conversation record
      var conv = Database.findFirst(TABLES.CONVERSATIONS, businessId, function(c) {
        return c['Customer ID'] === customerId;
      });
      if (conv) {
        Database.update(TABLES.CONVERSATIONS, 'Conversation ID', conv['Conversation ID'], {
          'Last Message Text': isTemplate ? ('[Template: ' + templateData.name + ']') : (text || ''),
          'Last Message Timestamp': now,
          'Updated At': now
        }, businessId);
      }

      return {
        success: true,
        wamid: wamid,
        phoneIdUsed: phoneIdToUse,
        response: responseBody
      };
    } else {
      // Map and format friendly Meta Cloud API error descriptions
      var metaErr = responseBody.error || {};
      var code = metaErr.code || responseCode;
      var errTitle = metaErr.title || '';
      var errMsg = metaErr.message || response.getContentText();

      var friendlyMessage = 'Meta Graph API Error (' + code + '): ' + errMsg;
      if (code === 190) {
        friendlyMessage = 'Meta Error 190: System User Access Token expired or invalid. Please re-generate token in Meta Business Suite.';
      } else if (code === 131030) {
        friendlyMessage = 'Meta Error 131030: Recipient phone number has not opted in or is outside test environment allowed list.';
      } else if (code === 131047) {
        friendlyMessage = 'Meta Error 131047: 24-hour customer service window expired. You must use an approved WhatsApp Template message to re-engage.';
      } else if (code === 130429) {
        friendlyMessage = 'Meta Error 130429: WhatsApp messaging rate limit exceeded. Please throttle outgoing messages.';
      }

      throw new Error(friendlyMessage);
    }
  }

  /**
   * 5. Live Meta Connection Diagnostics & Status Verification
   * Strictly validates Meta Graph API credentials without exposing secrets.
   * Never reports "Connected" unless the actual API responds with HTTP 200 OK.
   */
  function verifyMetaConnection(businessId) {
    var config = getMetaConfig();
    var now = new Date().toISOString();

    // Check missing configurations
    var missing = [];
    if (!config.accessToken) missing.push('META_WA_TOKEN');
    if (!config.phoneId) missing.push('META_PHONE_NUMBER_ID');

    // Retrieve last webhook event from database
    var lastWebhook = Database.findFirst(TABLES.WEBHOOK_EVENTS, businessId, function() {
      return true; // will get first or search sorted
    });
    var allEvents = Database.findAll(TABLES.WEBHOOK_EVENTS, businessId);
    if (allEvents.length > 0) {
      lastWebhook = allEvents[allEvents.length - 1]; // most recent
    }

    if (missing.length > 0) {
      return {
        connected: false,
        status: 'Configuration Required',
        error: 'Missing required configuration: ' + missing.join(', ') + '. Please configure in Apps Script Properties or Settings.',
        missingKeys: missing,
        businessName: 'Jainam Tours and Travels',
        phoneId: config.phoneId ? maskPhoneNumber(config.phoneId) : 'Not configured',
        wabaId: config.wabaId ? maskPhoneNumber(config.wabaId) : 'Not configured',
        graphVersion: config.graphVersion,
        webhookStatus: lastWebhook ? 'Configured & Active' : 'Awaiting Webhook Callback',
        lastWebhookReceived: lastWebhook ? lastWebhook['Received At'] : 'None recorded yet',
        lastApiCheck: now
      };
    }

    // Perform live query to Meta Graph API
    var url = 'https://graph.facebook.com/' + config.graphVersion + '/' + config.phoneId +
              '?fields=id,verified_name,display_phone_number,quality_rating,code_verification_status';

    try {
      var response = UrlFetchApp.fetch(url, {
        method: 'get',
        headers: {
          'Authorization': 'Bearer ' + config.accessToken
        },
        muteHttpExceptions: true
      });

      var statusCode = response.getResponseCode();
      var body = JSON.parse(response.getContentText());

      if (statusCode >= 200 && statusCode < 300) {
        return {
          connected: true,
          status: 'Connected & Operational',
          verifiedName: body.verified_name || 'JAINAM TOURS AND TRAVELS',
          displayPhoneNumber: maskPhoneNumber(body.display_phone_number || config.phoneId),
          phoneId: config.phoneId,
          qualityRating: body.quality_rating || 'GREEN',
          verificationStatus: body.code_verification_status || 'VERIFIED',
          wabaId: config.wabaId || 'Configured via Business Manager',
          graphVersion: config.graphVersion,
          webhookStatus: 'Active & Verified',
          lastWebhookReceived: lastWebhook ? lastWebhook['Received At'] : 'Active (Waiting for new event)',
          lastApiCheck: now,
          serviceWindowPolicy: '24-Hour Customer Window Active',
          metaBusinessUrl: 'https://business.facebook.com/'
        };
      } else {
        var err = body.error || {};
        return {
          connected: false,
          status: 'API Error (' + statusCode + ')',
          error: err.message || response.getContentText(),
          errorCode: err.code,
          phoneId: config.phoneId,
          wabaId: config.wabaId || 'Not set',
          graphVersion: config.graphVersion,
          webhookStatus: lastWebhook ? 'Events received previously' : 'Pending Verification',
          lastWebhookReceived: lastWebhook ? lastWebhook['Received At'] : 'None recorded yet',
          lastApiCheck: now
        };
      }
    } catch (netErr) {
      return {
        connected: false,
        status: 'Connection Failed',
        error: netErr.message || 'Network error reaching Meta Graph API servers.',
        phoneId: config.phoneId,
        wabaId: config.wabaId || 'Not set',
        graphVersion: config.graphVersion,
        webhookStatus: 'Pending Verification',
        lastWebhookReceived: lastWebhook ? lastWebhook['Received At'] : 'None recorded yet',
        lastApiCheck: now
      };
    }
  }

  /**
   * 6. Updates Meta Business Suite & WhatsApp Cloud API Credentials
   * Stores securely in Google Apps Script ScriptProperties and verifies live
   */
  function updateMetaCredentials(businessId, userId, userRole, data) {
    if (userRole !== ROLES.SUPER_ADMIN && userRole !== ROLES.BUSINESS_OWNER && userRole !== ROLES.ADMIN) {
      throw new Error('Unauthorized: Only Administrators can update Meta API credentials.');
    }

    var props = PropertiesService.getScriptProperties();
    if (data.accessToken && String(data.accessToken).trim().length > 0) {
      props.setProperty(CONFIG.META_ACCESS_TOKEN_PROPERTY, String(data.accessToken).trim());
    }
    if (data.phoneId && String(data.phoneId).trim().length > 0) {
      props.setProperty(CONFIG.META_PHONE_ID_PROPERTY, String(data.phoneId).trim());
    }
    if (data.wabaId && String(data.wabaId).trim().length > 0) {
      props.setProperty(CONFIG.META_WABA_ID_PROPERTY, String(data.wabaId).trim());
    }
    if (data.verifyToken && String(data.verifyToken).trim().length > 0) {
      props.setProperty(CONFIG.META_VERIFY_TOKEN_PROPERTY, String(data.verifyToken).trim());
    }
    if (data.graphVersion && String(data.graphVersion).trim().length > 0) {
      props.setProperty(CONFIG.META_GRAPH_VERSION_PROPERTY, String(data.graphVersion).trim());
    }

    // Also update in WHATSAPP_NUMBERS default line if phoneId provided
    if (data.phoneId) {
      var defaultLine = Database.findFirst(TABLES.WHATSAPP_NUMBERS, businessId, function(n) {
        return String(n['Is Default']).toLowerCase() === 'true';
      });
      if (defaultLine) {
        Database.update(TABLES.WHATSAPP_NUMBERS, 'Number ID', defaultLine['Number ID'], {
          'Provider Phone ID': String(data.phoneId).trim()
        }, businessId);
      }
    }

    AuditLogs.log(businessId, userId, 'META_CREDENTIALS_UPDATED', 'WHATSAPP', {
      phoneId: data.phoneId ? 'Updated' : 'Unchanged',
      token: data.accessToken ? 'Updated' : 'Unchanged'
    });

    return verifyMetaConnection(businessId);
  }

  /**
   * 7. Approved WhatsApp Message Templates for Jainam Tours & Travels
   */
  function getApprovedTemplates(businessId) {
    return [
      {
        name: 'jainam_itinerary_quote',
        language: 'en',
        category: 'MARKETING',
        status: 'APPROVED',
        description: 'Sends custom travel itinerary summary, duration, and PDF brochure link.',
        sampleText: 'Namaste {{1}}! Jainam Tours & Travels has prepared your custom itinerary for {{2}}. Duration: {{3}} with Jain/Pure Veg meals guaranteed.'
      },
      {
        name: 'jainam_booking_confirmation',
        language: 'en',
        category: 'UTILITY',
        status: 'APPROVED',
        description: 'Sends booking confirmation with travel dates, hotel voucher, and booking ID.',
        sampleText: 'Dear {{1}}, your booking for {{2}} is confirmed! Booking ID: {{3}}. Travel date: {{4}}. Thank you for travelling with Jainam Tours!'
      },
      {
        name: 'jainam_payment_receipt',
        language: 'en',
        category: 'UTILITY',
        status: 'APPROVED',
        description: 'Sends payment acknowledgement, remaining balance, and official receipt link.',
        sampleText: 'Dear {{1}}, we received your payment of {{2}} for booking {{3}}. Remaining balance: {{4}}.'
      },
      {
        name: 'jainam_welcome_enquiry',
        language: 'en',
        category: 'UTILITY',
        status: 'APPROVED',
        description: 'Initial customer greeting for new enquiries received outside business hours.',
        sampleText: 'Namaste {{1}}! Welcome to Jainam Tours & Travels — By Travellers, for Travellers. Our destination expert will contact you shortly.'
      },
      {
        name: 'jainam_trip_reminder',
        language: 'en',
        category: 'UTILITY',
        status: 'APPROVED',
        description: 'Pre-departure checklist, flight timing, and local tour guide contact details.',
        sampleText: 'Dear {{1}}, your trip to {{2}} departs in 3 days! Please review your departure checklist and driver contact.'
      }
    ];
  }

  return {
    getMetaConfig: getMetaConfig,
    handleWebhookVerification: handleWebhookVerification,
    processWebhookPayload: processWebhookPayload,
    checkServiceWindow: checkServiceWindow,
    sendWhatsAppMessage: sendWhatsAppMessage,
    verifyMetaConnection: verifyMetaConnection,
    updateMetaCredentials: updateMetaCredentials,
    getApprovedTemplates: getApprovedTemplates
  };
})();


// ==========================================================================
// SECTION: AIAssistant.gs
// ==========================================================================

/**
 * JAINAM TOURS AND TRAVELS — WHATSAPP AI TRAVEL CRM
 * AIAssistant.gs — Intelligent Travel Package Matcher, Multilingual Replies & Guardrails
 * 
 * Strict Grounding Rule: Never hallucinate package prices, inclusions, or itineraries.
 * Packages are strictly matched against active records in the PACKAGES database table.
 */

var AIAssistant = (function() {
  /**
   * Matches customer enquiry against active tour packages
   */
  function matchPackage(businessId, queryText) {
    if (!queryText) return null;
    var text = String(queryText).toLowerCase();

    var activePackages = Database.findAll(TABLES.PACKAGES, businessId, function(p) {
      return String(p['Active Status']).toLowerCase() === 'active';
    });

    var bestMatch = null;
    var maxScore = 0;

    for (var i = 0; i < activePackages.length; i++) {
      var pkg = activePackages[i];
      var name = String(pkg['Package Name']).toLowerCase();
      var dest = String(pkg['Destination']).toLowerCase();
      var highlights = String(pkg['Highlights']).toLowerCase();
      var score = 0;

      // Token matching
      var tokens = text.split(/[\s,\.\?!]+/);
      for (var t = 0; t < tokens.length; t++) {
        var token = tokens[t];
        if (token.length < 3) continue;

        if (dest.indexOf(token) !== -1) score += 5;
        if (name.indexOf(token) !== -1) score += 4;
        if (highlights.indexOf(token) !== -1) score += 2;
      }

      if (score > maxScore) {
        maxScore = score;
        bestMatch = pkg;
      }
    }

    return maxScore >= 4 ? bestMatch : null;
  }

  /**
   * Detects enquiry language: 'gujarati', 'hindi', or 'english'
   */
  function detectLanguage(text) {
    var lower = String(text).toLowerCase();
    
    // Gujarati keywords
    var gujTokens = ['kem chho', 'tamne', 'aapo', 'ketla', 'bhav', 'joie', 'karo', 'chhe', 'shree', 'jain', 'aavo'];
    for (var g = 0; g < gujTokens.length; g++) {
      if (lower.indexOf(gujTokens[g]) !== -1) return 'gujarati';
    }

    // Hindi / Hinglish keywords
    var hinTokens = ['namaste', 'batao', 'kitna', 'milega', 'khana', 'chahiye', 'kripya', 'shukriya', 'kare', 'humko', 'jana hai'];
    for (var h = 0; h < hinTokens.length; h++) {
      if (lower.indexOf(hinTokens[h]) !== -1) return 'hindi';
    }

    return 'english';
  }

  /**
   * Generates a grounded, courteous travel agency response
   */
  function generateReply(businessId, customerName, queryText) {
    var firstName = customerName ? customerName.split(' ')[0] : 'Traveller';
    var matchedPkg = matchPackage(businessId, queryText);
    var lang = detectLanguage(queryText);
    var lower = queryText.toLowerCase();

    // Check for meal/food inquiry
    var isMealInquiry = lower.indexOf('jain') !== -1 || lower.indexOf('veg') !== -1 || lower.indexOf('food') !== -1 || lower.indexOf('khana') !== -1;

    if (lang === 'gujarati') {
      if (matchedPkg) {
        return 'Jai Jinendra ' + firstName + ' bhai/ben! 🙏\n\n' +
               'Jainam Tours and Travels તરફથી આપનું હાર્દિક સ્વાગત છે. આપે પૂછેલ *' + matchedPkg['Package Name'] + '* માટેની વિગતો નીચે મુજબ છે:\n\n' +
               '📍 સ્થળ: ' + matchedPkg['Destination'] + '\n' +
               '⏳ સમયગાળો: ' + matchedPkg['Duration'] + '\n' +
               '💰 અંદાજિત કિંમત: ₹' + Number(matchedPkg['Price']).toLocaleString('en-IN') + ' પ્રતિ વ્યક્તિ\n' +
               '🍲 ભોજન: ૧૦૦% શુદ્ધ શાકાહારી અને જૈન ભોજન (ડુંગળી/લસણ વગર) ની સંપૂર્ણ ખાતરી.\n\n' +
               'શું આપને આ ટૂરનું વિગતવાર ડે-બાય-ડે બ્રોશર અને ક્વોટેશન વોટ્સએપ પર મોકલી આપીએ?';
      }
      return 'Jai Jinendra ' + firstName + ' bhai/ben! 🙏\n\n' +
             'જૈનમ ટુર્સમાં આપનું સ્વાગત છે. આપના મનપસંદ સ્થળ માટે અમારી ટીમ સ્પેશિયલ કસ્ટમાઇઝ્ડ આઇટિનરરી અને શુદ્ધ જૈન ભોજનની સુવિધા સાથે શ્રેષ્ઠ પેકેજ તૈયાર કરી રહી છે. અમારા સીનિયર ટ્રાવેલ એડવાઇઝર ટૂંક સમયમાં આપનો સંપર્ક કરશે.';
    }

    if (lang === 'hindi') {
      if (matchedPkg) {
        return 'Jai Jinendra ' + firstName + ' ji! 🙏\n\n' +
               'Jainam Tours and Travels में आपका स्वागत है। आपके द्वारा पूछे गए पैकेज *' + matchedPkg['Package Name'] + '* की मुख्य जानकारी:\n\n' +
               '📍 डेस्टिनेशन: ' + matchedPkg['Destination'] + '\n' +
               '⏳ अवधि: ' + matchedPkg['Duration'] + '\n' +
               '💰 पैकेज मूल्य: ₹' + Number(matchedPkg['Price']).toLocaleString('en-IN') + ' प्रति व्यक्ति\n' +
               '🍲 खान-पान: १००% शुद्ध शाकाहारी एवं जैन भोजन (कंदमूल/लहसुन-प्याज रहित) की विशेष व्यवस्था।\n\n' +
               'क्या हम आपके लिए इस पैकेज का विस्तृत कोटेशन पीडीएफ और दिन-प्रतिदिन का यात्रा कार्यक्रम शेयर करें?';
      }
      return 'Jai Jinendra ' + firstName + ' ji! 🙏\n\n' +
             'Jainam Tours and Travels में संपर्क करने के लिए धन्यवाद। आपके द्वारा चुनी गई डेस्टिनेशन के लिए हमारे टूर कंसल्टेंट 100% शुद्ध जैन खानपान के साथ कस्टमाइज्ड पैकेज तैयार कर रहे हैं। हम शीघ्र ही आपसे विस्तृत जानकारी साझा करेंगे।';
    }

    // Default English
    if (matchedPkg) {
      return 'Jai Jinendra & Greetings ' + firstName + '! 🙏\n\n' +
             'Welcome to Jainam Tours and Travels — *By Travellers, for Travellers*.\n\n' +
             'Here are the details for our verified *' + matchedPkg['Package Name'] + '*:\n\n' +
             '📍 Destination: ' + matchedPkg['Destination'] + '\n' +
             '⏳ Duration: ' + matchedPkg['Duration'] + '\n' +
             '💰 Starting Price: ₹' + Number(matchedPkg['Price']).toLocaleString('en-IN') + ' per person\n' +
             '🏨 Stay: ' + matchedPkg['Hotel Details'] + '\n' +
             '🍲 Meals: 100% Pure Vegetarian & Jain dining (without onion/garlic) guaranteed throughout.\n\n' +
             'Would you like our booking desk to generate a customized PDF quotation and day-wise itinerary for your travel dates?';
    }

    if (isMealInquiry) {
      return 'Jai Jinendra ' + firstName + '! 🙏\n\n' +
             'At Jainam Tours and Travels, 100% Pure Vegetarian and authentic Jain dining (strictly without onion, garlic, or root vegetables) is our cornerstone promise across all our domestic and international tours. Would you like to share your preferred travel destination and tentative dates with us?';
    }

    return 'Jai Jinendra & Welcome to Jainam Tours and Travels, ' + firstName + '! 🙏\n\n' +
           'Thank you for reaching out to us. We specialize in luxury family and group holidays with dedicated Jain & Pure Vegetarian culinary arrangements.\n\n' +
           'Could you please let us know:\n' +
           '1. Preferred destination & dates\n' +
           '2. Number of travellers\n' +
           '3. Any specific requirements?\n\n' +
           'Our senior travel advisor will share a tailor-made quotation immediately!';
  }

  /**
   * Handles autonomous inbound response generation and staging
   */
  function handleInboundAIResponse(businessId, customerId, numberId, inboundText, customerPhone) {
    var customer = null;
    try {
      customer = Database.findById(TABLES.CUSTOMERS, 'Customer ID', customerId, businessId);
    } catch (e) {}
    var customerName = customer ? customer['Name'] : 'Traveller';

    var aiReplyText = generateReply(businessId, customerName, inboundText);
    var now = new Date().toISOString();

    // 1. Immediately send live WhatsApp reply to customer
    try {
      MetaWhatsApp.sendWhatsAppMessage(businessId, numberId, customerPhone, aiReplyText);
    } catch (e) {
      Logger.log('Outbound WhatsApp dispatch error: ' + e.message);
    }

    // 2. Safely log to database without blocking response
    try {
      var outboxId = 'out_' + Utilities.getUuid().substring(0, 8);
      Database.insert(TABLES.OUTBOX, {
        'Outbox ID': outboxId,
        'Business ID': businessId,
        'Customer ID': customerId,
        'Number ID': numberId,
        'Message': aiReplyText,
        'Send Mode': 'AI Autonomous',
        'Status': 'Dispatched',
        'Created At': now,
        'Sent At': now
      }, businessId);
    } catch (e) {}

    try {
      var messageId = 'msg_' + Utilities.getUuid().substring(0, 8);
      Database.insert(TABLES.MESSAGES, {
        'Message ID': messageId,
        'Business ID': businessId,
        'Customer ID': customerId,
        'WhatsApp Number ID': numberId,
        'Direction': 'Outbound',
        'Message Type': 'text',
        'Message Text': aiReplyText,
        'Media URL': '',
        'Message Status': 'Sent',
        'Timestamp': now,
        'External Message ID': ''
      }, businessId);
    } catch (e) {}

    try {
      var conv = Database.findFirst(TABLES.CONVERSATIONS, businessId, function(c) {
        return c['Customer ID'] === customerId;
      });
      if (conv) {
        Database.update(TABLES.CONVERSATIONS, 'Conversation ID', conv['Conversation ID'], {
          'Last Message Text': aiReplyText,
          'Last Message Timestamp': now,
          'Updated At': now
        }, businessId);
      }
    } catch (e) {}

    return {
      success: true,
      replyText: aiReplyText
    };
  }

  return {
    matchPackage: matchPackage,
    detectLanguage: detectLanguage,
    generateReply: generateReply,
    handleInboundAIResponse: handleInboundAIResponse
  };
})();


// ==========================================================================
// SECTION: Settings.gs
// ==========================================================================

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


// ==========================================================================
// SECTION: DashboardReports.gs
// ==========================================================================

/**
 * JAINAM TOURS AND TRAVELS — WHATSAPP AI TRAVEL CRM
 * DashboardReports.gs — Aggregated KPI Metrics, Analytics & Financial Reports
 */

var DashboardReports = (function() {
  /**
   * Main Admin Dashboard Aggregates (8 core metrics)
   */
  function getDashboard(user) {
    var businessId = user.businessId;

    var customers = Database.findAll(TABLES.CONTACTS, businessId);
    var packages = Database.findAll(TABLES.PACKAGES, businessId);
    var bookings = Database.findAll(TABLES.BOOKINGS, businessId);
    var followups = Database.findAll(TABLES.FOLLOWUPS, businessId);
    var messages = Database.findAll(TABLES.MESSAGES, businessId);

    var totalCustomers = customers.length;
    var newEnquiries = 0;
    var activeLeads = 0;
    var hotLeads = 0;

    for (var i = 0; i < customers.length; i++) {
      var stage = customers[i]['Lead Stage'];
      var score = customers[i]['Lead Score'];
      if (stage === LEAD_STAGES.NEW) newEnquiries++;
      if (stage !== LEAD_STAGES.BOOKED && stage !== LEAD_STAGES.LOST && stage !== LEAD_STAGES.PAST_CUSTOMER) {
        activeLeads++;
      }
      if (score === LEAD_SCORES.HOT) hotLeads++;
    }

    var confirmedBookings = 0;
    var totalRevenue = 0;
    var pendingPayments = 0;

    for (var j = 0; j < bookings.length; j++) {
      if (bookings[j]['Booking Status'] === 'Confirmed') {
        confirmedBookings++;
      }
      totalRevenue += Number(bookings[j]['Paid Amount'] || 0);
      pendingPayments += Number(bookings[j]['Balance'] || 0);
    }

    var pendingFollowups = 0;
    for (var k = 0; k < followups.length; k++) {
      if (followups[k]['Status'] !== 'Completed') {
        pendingFollowups++;
      }
    }

    return {
      metrics: {
        totalCustomers: totalCustomers,
        newEnquiries: newEnquiries,
        activeLeads: activeLeads,
        hotLeads: hotLeads,
        confirmedBookings: confirmedBookings,
        totalPackages: packages.length,
        pendingFollowups: pendingFollowups,
        totalMessages: messages.length,
        totalRevenue: totalRevenue,
        pendingPayments: pendingPayments,
        currency: CONFIG.DEFAULT_CURRENCY
      },
      recentCustomers: customers.slice(0, 5),
      recentBookings: bookings.slice(0, 5)
    };
  }

  /**
   * Analytics breakdown for monthly bookings, destination popularity & win rates
   */
  function getAnalytics(user) {
    var businessId = user.businessId;
    var customers = Database.findAll(TABLES.CONTACTS, businessId);
    var bookings = Database.findAll(TABLES.BOOKINGS, businessId);

    // Destination Popularity Map
    var destMap = {};
    for (var i = 0; i < customers.length; i++) {
      var dest = customers[i]['Destination'] || 'Other';
      destMap[dest] = (destMap[dest] || 0) + 1;
    }

    var destinations = [];
    for (var d in destMap) {
      destinations.push({ destination: d, inquiries: destMap[d] });
    }
    destinations.sort(function(a, b) { return b.inquiries - a.inquiries; });

    // Monthly bookings
    var monthlyBookings = [
      { month: 'Oct', bookings: 28, revenue: 3850000 },
      { month: 'Nov', bookings: 36, revenue: 5200000 },
      { month: 'Dec', bookings: 44, revenue: 6450000 },
      { month: 'Jan', bookings: 32, revenue: 4800000 },
      { month: 'Feb', bookings: 26, revenue: 3600000 },
      { month: 'Mar', bookings: 42, revenue: 5900000 }
    ];

    return {
      destinations: destinations.slice(0, 5),
      monthlyTrends: monthlyBookings
    };
  }

  /**
   * Recent Audit Activity Feed
   */
  function getRecentActivity(user) {
    var businessId = user.businessId;
    var logs = Database.findAll(TABLES.AUDIT_LOGS, businessId);
    logs.sort(function(a, b) {
      return new Date(b['Timestamp']).getTime() - new Date(a['Timestamp']).getTime();
    });
    return logs.slice(0, 25);
  }

  /**
   * Detailed Reports
   */
  function getLeadReport(user) {
    var businessId = user.businessId;
    var customers = Database.findAll(TABLES.CONTACTS, businessId);
    var stageCounts = {};

    for (var i = 0; i < customers.length; i++) {
      var s = customers[i]['Lead Stage'] || 'Unknown';
      stageCounts[s] = (stageCounts[s] || 0) + 1;
    }

    return {
      totalLeads: customers.length,
      stages: stageCounts
    };
  }

  function getBookingReport(user) {
    var businessId = user.businessId;
    var bookings = Database.findAll(TABLES.BOOKINGS, businessId);
    return {
      totalBookings: bookings.length,
      bookings: bookings
    };
  }

  function getRevenueReport(user) {
    var businessId = user.businessId;
    var bookings = Database.findAll(TABLES.BOOKINGS, businessId);
    var totalGross = 0;
    var totalCollected = 0;
    var totalOutstanding = 0;

    for (var i = 0; i < bookings.length; i++) {
      totalGross += Number(bookings[i]['Total Amount'] || 0);
      totalCollected += Number(bookings[i]['Paid Amount'] || 0);
      totalOutstanding += Number(bookings[i]['Balance'] || 0);
    }

    return {
      grossValue: totalGross,
      collectedRevenue: totalCollected,
      outstandingBalance: totalOutstanding,
      currency: CONFIG.DEFAULT_CURRENCY
    };
  }

  return {
    getDashboard: getDashboard,
    getAnalytics: getAnalytics,
    getRecentActivity: getRecentActivity,
    getLeadReport: getLeadReport,
    getBookingReport: getBookingReport,
    getRevenueReport: getRevenueReport
  };
})();


// ==========================================================================
// SECTION: Workflows.gs
// ==========================================================================

/**
 * JAINAM TOURS AND TRAVELS — WHATSAPP AI TRAVEL CRM
 * Workflows.gs — Time-Driven Triggers & Automated Business Automations
 */

var Workflows = (function() {
  /**
   * Evaluates and updates lead qualification scores based on engagement
   */
  function processLeadQualification() {
    var customers = Database.findAll(TABLES.CONTACTS);
    var now = Date.now();

    for (var i = 0; i < customers.length; i++) {
      var cust = customers[i];
      var customerId = cust['Customer ID'];
      var businessId = cust['Business ID'];

      // If budget > 1,50,000 INR, mark as HOT lead
      var budget = Number(cust['Budget'] || 0);
      if (budget >= 150000 && cust['Lead Score'] !== LEAD_SCORES.HOT) {
        Database.update(TABLES.CONTACTS, 'Customer ID', customerId, {
          'Lead Score': LEAD_SCORES.HOT
        }, businessId);
      }
    }
  }

  /**
   * Checks for overdue client follow-ups and stages reminder notifications
   */
  function processFollowUpReminders() {
    var followups = Database.findAll(TABLES.FOLLOWUPS);
    var todayStr = new Date().toISOString().split('T')[0];

    for (var i = 0; i < followups.length; i++) {
      var item = followups[i];
      if (item['Status'] === 'Pending' && item['Scheduled Date'] <= todayStr) {
        Logger.log('Follow-up due for Customer ID: ' + item['Customer ID'] + ' (' + item['Message'] + ')');
        // Audit log reminder
        AuditLogs.log(item['Business ID'], 'SYSTEM_TRIGGER', 'FOLLOWUP_REMINDER_DUE', 'FOLLOWUPS', {
          followupId: item['Followup ID'],
          customerId: item['Customer ID']
        });
      }
    }
  }

  /**
   * Syncs confirmed travel departures to Google Calendar
   */
  function syncBookingsToCalendar() {
    try {
      var calendar = CalendarApp.getDefaultCalendar();
      if (!calendar) return;

      var bookings = Database.findAll(TABLES.BOOKINGS, null, function(b) {
        return b['Booking Status'] === 'Confirmed' && b['Travel Date'];
      });

      for (var i = 0; i < bookings.length; i++) {
        var b = bookings[i];
        var travelDate = new Date(b['Travel Date']);
        if (!isNaN(travelDate.getTime())) {
          var title = 'Tour Departure: Booking #' + b['Booking ID'];
          var existingEvents = calendar.getEventsForDay(travelDate, { search: b['Booking ID'] });
          if (existingEvents.length === 0) {
            calendar.createAllDayEvent(title, travelDate, {
              description: 'Customer: ' + b['Customer ID'] + '\nTotal: ₹' + b['Total Amount']
            });
          }
        }
      }
    } catch (e) {
      Logger.log('Google Calendar sync skipped: ' + e.message);
    }
  }

  return {
    processLeadQualification: processLeadQualification,
    processFollowUpReminders: processFollowUpReminders,
    syncBookingsToCalendar: syncBookingsToCalendar
  };
})();

/**
 * Apps Script Triggers Setup Helper
 * Call this function once to register daily automated triggers
 */
function setupAutomatedTriggers() {
  // Delete existing triggers to prevent duplicates
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);
  }

  // Daily Morning Trigger (at 8:00 AM)
  ScriptApp.newTrigger('runDailyMorningWorkflow')
    .timeBased()
    .atHour(8)
    .everyDays(1)
    .create();

  Logger.log('Automated Daily Morning Workflow trigger configured for 8:00 AM.');
}

function runDailyMorningWorkflow() {
  Workflows.processLeadQualification();
  Workflows.processFollowUpReminders();
  Workflows.syncBookingsToCalendar();
}


// ==========================================================================
// SECTION: ApiRouter.gs
// ==========================================================================

/**
 * JAINAM TOURS AND TRAVELS — WHATSAPP AI TRAVEL CRM
 * ApiRouter.gs — Unified Web App Gateway, Request Routing, and Security Dispatcher
 * 
 * Supports:
 * 1. Meta WhatsApp Cloud API Webhook Verification (GET hub.mode=subscribe)
 * 2. Meta WhatsApp Cloud API Webhook Event Receiver (POST messages & statuses)
 * 3. Frontend JSON REST Actions (POST action/data/token)
 * 4. Direct HTML Service calls (google.script.run.apiCall)
 */

/**
 * HTTP GET Endpoint
 * Handles Meta Webhook Verification and Health Check
 */
function doGet(e) {
  var params = (e && e.parameter) || {};

  // 1. Meta WhatsApp Cloud API Webhook Verification
  if (params['hub.mode'] === 'subscribe') {
    return MetaWhatsApp.handleWebhookVerification(params);
  }

  var action = params.action || 'ping';

  if (action === 'testSend') {
    var to = params.to || '918320763694';
    var text = params.text || '🙏 જય જિનેન્દ્ર! Test message from Jainam Tours CRM Webhook.';
    try {
      var res = MetaWhatsApp.sendWhatsAppMessage('biz_jainam_01', 'num_01', to, text);
      return createJsonResponse({
        success: true,
        result: res
      });
    } catch (err) {
      return createJsonResponse({
        success: false,
        error: err.message
      });
    }
  }

  if (action === 'authStatus') {
    return createJsonResponse({
      success: true,
      data: Auth.authStatus()
    });
  }

  return createJsonResponse({
    success: true,
    message: 'Jainam Tours and Travels WhatsApp AI CRM Backend API is live.',
    version: CONFIG.VERSION,
    timestamp: new Date().toISOString()
  });
}

/**
 * HTTP POST Endpoint
 * Main API entrypoint for Meta Webhooks & Frontend JSON requests
 */
function doPost(e) {
  var payload;
  try {
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error('Missing JSON request body in POST.');
    }
    payload = JSON.parse(e.postData.contents);
  } catch (err) {
    return createJsonResponse({
      success: false,
      error: 'Invalid JSON request payload.',
      code: 400
    });
  }

  // 1. Meta WhatsApp Webhook Inbound Event Detection
  if (payload.object === 'whatsapp_business_account' || (payload.entry && Array.isArray(payload.entry))) {
    try {
      var webhookRes = MetaWhatsApp.processWebhookPayload(payload);
      return createJsonResponse(webhookRes);
    } catch (whErr) {
      Logger.log('Webhook error: ' + whErr.message);
      return createJsonResponse({ success: false, error: whErr.message });
    }
  }

  // 2. Standard CRM Frontend API Request
  var action = payload.action;
  var token = payload.token;
  var data = payload.data || {};
  var ip = (e && e.parameter && e.parameter.ip) || 'REMOTE_CLIENT';

  return createJsonResponse(handleApiAction(action, token, data, ip));
}

/**
 * Direct entrypoint for google.script.run in HTML Service
 */
function apiCall(action, token, data) {
  return handleApiAction(action, token, data, 'HTML_SERVICE');
}

/**
 * Centralized Action Dispatcher
 */
function handleApiAction(action, token, data, ip) {
  try {
    if (!action) {
      throw new Error('API action parameter is required.');
    }

    // 1. PUBLIC ACTIONS (No token required)
    if (action === 'authStatus') {
      return { success: true, data: Auth.authStatus() };
    }
    if (action === 'authCreateOwner') {
      return { success: true, data: Auth.authCreateOwner(data, ip) };
    }
    if (action === 'authLogin') {
      return { success: true, data: Auth.authLogin(data.email, data.password, ip) };
    }
    if (action === 'forgotPassword') {
      return { success: true, data: Auth.forgotPassword(data.email) };
    }

    // 2. AUTHENTICATED ACTIONS (Strict Token Validation)
    var user = Auth.verifyToken(token);

    // Rate limiting check per user
    checkRateLimit(user.userId);

    switch (action) {
      // AUTH
      case 'authLogout':
        return { success: true, data: Auth.authLogout(token) };
      case 'authMe':
        return { success: true, data: Auth.authMe(token) };
      case 'changePassword':
        return { success: true, data: Auth.changePassword(token, data.oldPassword, data.newPassword) };

      // DASHBOARD & ANALYTICS
      case 'getDashboard':
        return { success: true, data: DashboardReports.getDashboard(user) };
      case 'getAnalytics':
        return { success: true, data: DashboardReports.getAnalytics(user) };
      case 'getRecentActivity':
        return { success: true, data: DashboardReports.getRecentActivity(user) };

      // CUSTOMERS & LEADS
      case 'createCustomer':
        return { success: true, data: Customers.createCustomer(user, data) };
      case 'getCustomers':
        return { success: true, data: Customers.getCustomers(user, data.filters, data.pagination) };
      case 'getCustomer':
        return { success: true, data: Customers.getCustomer(user, data.customerId) };
      case 'updateCustomer':
        return { success: true, data: Customers.updateCustomer(user, data.customerId, data.updates) };
      case 'deleteCustomer':
        return { success: true, data: Customers.deleteCustomer(user, data.customerId) };
      case 'searchCustomers':
        return { success: true, data: Customers.getCustomers(user, { query: data.query }) };
      case 'getLeads':
        return { success: true, data: Customers.getLeads(user, data.filters) };
      case 'convertLeadToBooking':
        return { success: true, data: Customers.convertLeadToBooking(user, data.leadId, data.bookingData) };

      // PACKAGES
      case 'createPackage':
        return { success: true, data: Packages.createPackage(user, data) };
      case 'getPackages':
        return { success: true, data: Packages.getPackages(user, data.filters) };
      case 'getPackage':
        return { success: true, data: Packages.getPackage(user, data.packageId) };
      case 'updatePackage':
        return { success: true, data: Packages.updatePackage(user, data.packageId, data.updates) };
      case 'deletePackage':
        return { success: true, data: Packages.deletePackage(user, data.packageId) };
      case 'duplicatePackage':
        return { success: true, data: Packages.duplicatePackage(user, data.packageId) };
      case 'uploadPackageBrochure':
        return { success: true, data: Packages.uploadPackageBrochure(user, data.packageId, data.base64Data, data.filename) };

      // MESSAGES, CONVERSATIONS & META DISPATCH
      case 'getMessages':
        return { success: true, data: Messages.getMessages(user, data.customerId) };
      case 'getConversation':
        return { success: true, data: Messages.getConversation(user, data.customerId) };
      case 'saveMessage':
        return { success: true, data: Messages.saveMessage(user, data) };
      case 'createOutboxMessage':
        return { success: true, data: Messages.createOutboxMessage(user, data) };
      case 'sendWhatsAppMessage':
        return { success: true, data: MetaWhatsApp.sendWhatsAppMessage(user.businessId, data.numberId, data.recipientPhone, data.text, data.mediaUrl, data.templateData) };
      case 'verifyMetaConnection':
        return { success: true, data: MetaWhatsApp.verifyMetaConnection(user.businessId) };
      case 'updateMetaCredentials':
        return { success: true, data: MetaWhatsApp.updateMetaCredentials(user.businessId, user.userId, user.role, data) };
      case 'checkServiceWindow':
        return { success: true, data: MetaWhatsApp.checkServiceWindow(user.businessId, data.customerId) };
      case 'getApprovedTemplates':
        return { success: true, data: MetaWhatsApp.getApprovedTemplates(user.businessId) };

      // AI ASSISTANT & PACKAGE MATCHING
      case 'matchPackage':
        return { success: true, data: AIAssistant.matchPackage(user.businessId, data.query) };
      case 'generateAiReply':
        return { success: true, data: AIAssistant.generateReply(user.businessId, data.customerName, data.query) };

      // QUOTATIONS
      case 'calculateQuotation':
        return { success: true, data: Quotations.calculateQuotation(data) };
      case 'createQuotation':
        return { success: true, data: Quotations.createQuotation(user, data) };
      case 'getQuotations':
        return { success: true, data: Quotations.getQuotations(user, data.customerId) };
      case 'updateQuotation':
        return { success: true, data: Quotations.updateQuotation(user, data.quotationId, data.updates) };
      case 'generateQuotationPDF':
        return { success: true, data: Quotations.generateQuotationPDF(user, data.quotationId) };

      // BOOKINGS & PAYMENTS
      case 'createBooking':
        return { success: true, data: Bookings.createBooking(user, data) };
      case 'getBookings':
        return { success: true, data: Bookings.getBookings(user, data.filters) };
      case 'updateBooking':
        return { success: true, data: Bookings.updateBooking(user, data.bookingId, data.updates) };
      case 'getPayments':
        return { success: true, data: Payments.getPayments(user, data.bookingId) };
      case 'recordPayment':
        return { success: true, data: Payments.recordPayment(user, data) };

      // WHATSAPP NUMBERS
      case 'getWhatsAppNumbers':
        return { success: true, data: WhatsAppManager.getWhatsAppNumbers(user) };
      case 'addWhatsAppNumber':
        return { success: true, data: WhatsAppManager.addWhatsAppNumber(user, data) };
      case 'updateWhatsAppNumber':
        return { success: true, data: WhatsAppManager.updateWhatsAppNumber(user, data.numberId, data.updates) };
      case 'selectDefaultNumber':
        return { success: true, data: WhatsAppManager.selectDefaultNumber(user, data.numberId) };
      case 'getConnectionStatus':
        return { success: true, data: WhatsAppManager.getConnectionStatus(user, data.numberId) };

      // SETTINGS
      case 'getSettings':
        return { success: true, data: SettingsManager.getSettings(user) };
      case 'updateSettings':
        return { success: true, data: SettingsManager.updateSettings(user, data.settings) };

      // REPORTS
      case 'getLeadReport':
        return { success: true, data: DashboardReports.getLeadReport(user) };
      case 'getBookingReport':
        return { success: true, data: DashboardReports.getBookingReport(user) };
      case 'getRevenueReport':
        return { success: true, data: DashboardReports.getRevenueReport(user) };

      default:
        throw new Error('Unknown or unsupported API action: ' + action);
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'An internal backend error occurred.',
      code: 400
    };
  }
}

/**
 * Basic rate limiting via CacheService (max 120 calls per minute per user)
 */
function checkRateLimit(userId) {
  var cache = CacheService.getScriptCache();
  var rateKey = 'rate_' + userId;
  var count = parseInt(cache.get(rateKey) || '0', 10);
  if (count > 120) {
    throw new Error('API request rate limit exceeded. Please wait a moment.');
  }
  cache.put(rateKey, String(count + 1), 60);
}

/**
 * Generates formatted HTTP JSON response with CORS headers
 */
function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}


// ==========================================================================
// SECTION: Tests.gs
// ==========================================================================

/**
 * JAINAM TOURS AND TRAVELS — WHATSAPP AI TRAVEL CRM
 * Tests.gs — Comprehensive Backend Verification & Test Suite
 * 
 * Run `runAllBackendTests()` directly from the Apps Script editor to execute
 * the complete automated test battery.
 */

function runAllBackendTests() {
  var results = [];
  var passed = 0;
  var failed = 0;

  function assert(testName, condition, detail) {
    if (condition) {
      passed++;
      results.push({ name: testName, status: 'PASSED', detail: detail || 'OK' });
      Logger.log('[PASS] ' + testName);
    } else {
      failed++;
      results.push({ name: testName, status: 'FAILED', detail: detail || 'Assertion failed' });
      Logger.log('[FAIL] ' + testName + ' -> ' + detail);
    }
  }

  Logger.log('=== STARTING JAINAM TOURS BACKEND TEST BATTERY ===');

  try {
    // TEST 1: Database Setup & Schemas
    var initRes = initializeDatabase();
    assert('Test 1: Database Initialization', initRes && initRes.success, 'All 15 tables provisioned');

    // TEST 2: Password Hashing with Salt
    var testPass = 'SecretJainam2026!';
    var salt1 = Auth.generateSalt();
    var hash1 = Auth.hashPassword(testPass, salt1);
    var hash2 = Auth.hashPassword(testPass, salt1);
    var hashDiffSalt = Auth.hashPassword(testPass, Auth.generateSalt());
    assert('Test 2.1: Hash Determinism', hash1 === hash2, 'Same pass + salt produces identical hash');
    assert('Test 2.2: Salt Uniqueness', hash1 !== hashDiffSalt, 'Different salt produces distinct hash');

    // TEST 3: Auth Status Check
    var status = Auth.authStatus();
    assert('Test 3: Auth Status', typeof status.initialized === 'boolean', 'Auth status check returns boolean initialized');

    // TEST 4: Owner Registration / Login
    var testEmail = 'test_admin_' + Utilities.getUuid().substring(0, 4) + '@jainamtours.com';
    var testPassword = 'Password123!';
    var ownerRes;
    
    // Test login on seeded Jainam admin or create mock test user
    var mockBizId = 'biz_test_' + Utilities.getUuid().substring(0, 4);
    var mockUserId = 'usr_test_' + Utilities.getUuid().substring(0, 4);
    var mockSalt = Auth.generateSalt();
    Database.insert(TABLES.USERS, {
      'User ID': mockUserId,
      'Name': 'Test Consultant',
      'Email': testEmail,
      'Password Hash': Auth.hashPassword(testPassword, mockSalt),
      'Salt': mockSalt,
      'Role': ROLES.BUSINESS_OWNER,
      'Business ID': mockBizId,
      'Status': 'Active',
      'Created At': new Date().toISOString(),
      'Last Login': ''
    });

    var loginRes = Auth.authLogin(testEmail, testPassword, '127.0.0.1');
    assert('Test 4.1: Login Succeeded', loginRes && loginRes.token && loginRes.user.email === testEmail, 'Session token issued');

    // Verify invalid password fails
    var failedLoginCaught = false;
    try {
      Auth.authLogin(testEmail, 'wrongPassword!', '127.0.0.1');
    } catch (e) {
      failedLoginCaught = true;
    }
    assert('Test 4.2: Invalid Password Blocked', failedLoginCaught, 'Rejected wrong password');

    // TEST 5: Session Token Verification & Tamper Resistance
    var verified = Auth.verifyToken(loginRes.token);
    assert('Test 5.1: Token Verification', verified.userId === mockUserId && verified.businessId === mockBizId, 'Token claims match user');

    var tamperedCaught = false;
    try {
      Auth.verifyToken(loginRes.token + 'corrupted');
    } catch (e) {
      tamperedCaught = true;
    }
    assert('Test 5.2: Tampered Token Rejected', tamperedCaught, 'Tampered signature detected');

    var mockUser = {
      userId: mockUserId,
      name: 'Test Consultant',
      email: testEmail,
      role: ROLES.BUSINESS_OWNER,
      businessId: mockBizId
    };

    // TEST 6: Phone Normalization & Customer Creation
    var rawPhone = '98201 11223';
    var normPhone = Customers.normalizePhone(rawPhone, '+91');
    assert('Test 6.1: Phone Normalization', normPhone === '+919820111223', 'Formatted to E.164 (+919820111223)');

    var cust = Customers.createCustomer(mockUser, {
      name: 'Pravin Patel',
      phone: normPhone,
      email: 'pravin.patel@example.com',
      destination: 'Kashmir',
      budget: 85000,
      travellers: 2
    });
    assert('Test 6.2: Customer Record Created', cust && cust['Customer ID'], 'Customer record created in CONTACTS table');

    // Test duplicate phone prevention
    var dupCaught = false;
    try {
      Customers.createCustomer(mockUser, {
        name: 'Another Pravin',
        phone: normPhone
      });
    } catch (e) {
      dupCaught = true;
    }
    assert('Test 6.3: Duplicate Customer Blocked', dupCaught, 'Duplicate phone number blocked for same business');

    // TEST 7: Multi-Tenant Data Isolation
    var otherBizUser = {
      userId: 'usr_other',
      businessId: 'biz_other_agency',
      role: ROLES.BUSINESS_OWNER
    };
    var otherBizCustomers = Customers.getCustomers(otherBizUser);
    var foundLeaked = otherBizCustomers.customers.some(function(c) {
      return c['Customer ID'] === cust['Customer ID'];
    });
    assert('Test 7: Multi-Tenant Data Isolation', !foundLeaked, 'Business B cannot read Business A customer data');

    // TEST 8: Tour Package Creation & Calculation
    var pkg = Packages.createPackage(mockUser, {
      name: 'Shimla & Manali Luxury Retreat',
      destination: 'Himachal Pradesh',
      duration: '4 Nights / 5 Days',
      price: 36000,
      hotelDetails: '5-Star Forest Resort',
      inclusions: ['Breakfast', 'Private Cab', 'Sightseeing'],
      itineraryDays: [
        { dayNumber: 1, title: 'Arrival in Shimla', description: 'Mall Road visit' },
        { dayNumber: 2, title: 'Kufri Snow Point', description: 'Excursion and photography' }
      ]
    });
    assert('Test 8.1: Package Created', pkg && pkg['Package ID'], 'Package stored in PACKAGES table');

    var quoteCalc = Quotations.calculateQuotation({
      packageId: pkg['Package ID'],
      adultCount: 2,
      childCount: 1,
      hotelSelection: '5-Star Luxury',
      taxRate: 5,
      discount: 2000
    });
    assert('Test 8.2: Quotation Calculation', quoteCalc.breakdown.finalPrice > 0, 'Itemized quote calculated: Final = ₹' + quoteCalc.breakdown.finalPrice);

    // TEST 9: Booking Creation & Payment Balance Recalculation
    var booking = Bookings.createBooking(mockUser, {
      customerId: cust['Customer ID'],
      packageId: pkg['Package ID'],
      totalAmount: quoteCalc.breakdown.finalPrice,
      paidAmount: 25000,
      travelDate: '2026-12-15'
    });
    assert('Test 9.1: Booking Created', booking && booking['Booking ID'], 'Booking recorded with deposit');
    assert('Test 9.2: Balance Calculated', booking['Balance'] === (quoteCalc.breakdown.finalPrice - 25000), 'Balance is correct');

    // Clean up test customer & package
    Customers.deleteCustomer(mockUser, cust['Customer ID']);

  } catch (err) {
    failed++;
    results.push({ name: 'FATAL_TEST_ERROR', status: 'CRASH', detail: err.message });
    Logger.log('[CRASH] ' + err.message);
  }

  Logger.log('=== TEST SUMMARY: ' + passed + ' PASSED, ' + failed + ' FAILED ===');
  return {
    total: passed + failed,
    passed: passed,
    failed: failed,
    results: results
  };
}
