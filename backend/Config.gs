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
