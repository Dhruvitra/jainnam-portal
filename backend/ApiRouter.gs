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
