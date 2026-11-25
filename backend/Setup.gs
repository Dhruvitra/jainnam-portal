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
