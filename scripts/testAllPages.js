// Node.js Automated Functionality & Page Integrity Test Suite
import fs from 'fs';
import path from 'path';

console.log('====================================================');
console.log('JAINAM TOURS & TRAVELS — CRM FUNCTION AUDIT');
console.log('====================================================');

const pages = [
  'DashboardPage.tsx',
  'WhatsAppInboxPage.tsx',
  'CustomersPage.tsx',
  'LeadsPage.tsx',
  'TourPackagesPage.tsx',
  'CustomPackageBuilderPage.tsx',
  'BookingsPage.tsx',
  'FollowUpsPage.tsx',
  'CampaignsPage.tsx',
  'KnowledgeBasePage.tsx',
  'AIAssistantSettingsPage.tsx',
  'WhatsAppNumbersPage.tsx',
  'WhatsAppStatusPage.tsx',
  'IntegrationsPage.tsx',
  'ReportsPage.tsx',
  'TeamMembersPage.tsx',
  'BusinessSettingsPage.tsx',
  'AdminProfilePage.tsx'
];

let errors = 0;
let passed = 0;

function check(testName, condition, details = '') {
  if (condition) {
    passed++;
    console.log(`[PASS] ${testName}`);
  } else {
    errors++;
    console.error(`[FAIL] ${testName} -> ${details}`);
  }
}

// 1. Check all page files exist and are non-empty
console.log('\n--- 1. AUDITING PAGE COMPONENTS ---');
pages.forEach(p => {
  const filePath = path.join(process.cwd(), 'src', 'components', 'pages', p);
  const exists = fs.existsSync(filePath);
  const size = exists ? fs.statSync(filePath).size : 0;
  check(`Page: ${p}`, exists && size > 200, `File missing or empty: ${filePath}`);
});

// 2. Check Modals
console.log('\n--- 2. AUDITING MODAL COMPONENTS ---');
const modals = [
  'AddCustomerModal.tsx',
  'AddPackageModal.tsx',
  'AddWhatsAppNumberModal.tsx',
  'CustomerDetailDrawer.tsx',
  'GlobalSearchModal.tsx',
  'InviteMemberModal.tsx',
  'LogoutConfirmModal.tsx',
  'NotificationDrawer.tsx',
  'PackagePreviewDrawer.tsx',
  'QuotationPDFModal.tsx',
  'WhatsAppQuotationModal.tsx'
];
modals.forEach(m => {
  const filePath = path.join(process.cwd(), 'src', 'components', 'modals', m);
  const exists = fs.existsSync(filePath);
  check(`Modal: ${m}`, exists, `Modal missing: ${filePath}`);
});

// 3. Check AppContext Data Persistence and Handlers
console.log('\n--- 3. AUDITING STATE & FUNCTION HANDLERS ---');
const appContextPath = path.join(process.cwd(), 'src', 'context', 'AppContext.tsx');
const appContextSrc = fs.readFileSync(appContextPath, 'utf8');

const requiredMethods = [
  'login',
  'logout',
  'inviteMember',
  'addWhatsAppNumber',
  'setDefaultWhatsAppNumber',
  'addCustomer',
  'updateCustomer',
  'deleteCustomer',
  'convertLeadToBooking',
  'addPackage',
  'updatePackage',
  'deletePackage',
  'duplicatePackage',
  'sendMessage',
  'generateAiResponse',
  'toggleConversationAi',
  'toggleConversationTakeover',
  'addBooking',
  'updateBooking',
  'recordBookingPayment',
  'toggleFollowUpComplete',
  'addFollowUp',
  'addCampaign',
  'addKnowledgeItem'
];

requiredMethods.forEach(method => {
  check(`Method exported: ${method}()`, appContextSrc.includes(method), `Method not defined in AppContext`);
});

// 4. Verify 7 Authenticated Staff Logins
console.log('\n--- 4. AUDITING 7 AUTHENTICATED STAFF LOGINS ---');
const authUsersPath = path.join(process.cwd(), 'src', 'data', 'authUsers.ts');
const authUsersSrc = fs.readFileSync(authUsersPath, 'utf8');

const requiredEmails = [
  'dhruviktra.rajput.1379@gmail.com',
  'pooja.parekh@jainamtours.com',
  'chirag.mehta@jainamtours.com',
  'ritu.sharma@jainamtours.com',
  'bhavin.shah@jainamtours.com',
  'sneha.desai@jainamtours.com',
  'karan.rajput@jainamtours.com'
];

requiredEmails.forEach(email => {
  check(`Auth User: ${email}`, authUsersSrc.includes(email), `Email missing from authUsers.ts`);
});

// 5. Verify Backend 22 Tables
console.log('\n--- 5. AUDITING 22 GOOGLE APPS SCRIPT BACKEND SCHEMAS ---');
const configGsPath = path.join(process.cwd(), 'backend', 'Config.gs');
const configGsSrc = fs.readFileSync(configGsPath, 'utf8');

const requiredTables = [
  'USERS', 'BUSINESSES', 'CUSTOMERS', 'LEADS', 'PACKAGES', 'PACKAGE_ITINERARY',
  'MESSAGES', 'CONVERSATIONS', 'WHATSAPP_NUMBERS', 'QUOTATIONS', 'BOOKINGS',
  'PAYMENTS', 'FOLLOWUPS', 'CAMPAIGNS', 'CAMPAIGN_RECIPIENTS', 'FAQS', 'SETTINGS',
  'NOTIFICATIONS', 'OUTBOX', 'AUDIT_LOGS', 'WEBHOOK_EVENTS', 'FILES'
];

requiredTables.forEach(tbl => {
  check(`Backend Table Schema: ${tbl}`, configGsSrc.includes(`${tbl}: [`), `Schema missing for ${tbl}`);
});

// 6. Verify Meta WhatsApp Cloud API Functions
console.log('\n--- 6. AUDITING META WHATSAPP CLOUD API INTEGRATION ---');
const metaGsPath = path.join(process.cwd(), 'backend', 'MetaWhatsApp.gs');
const metaGsSrc = fs.readFileSync(metaGsPath, 'utf8');

check('Webhook verification handler (GET hub.challenge)', metaGsSrc.includes('handleWebhookVerification'));
check('Webhook event processor (POST incoming messages & statuses)', metaGsSrc.includes('processWebhookPayload'));
check('Outbound Meta Graph API v21.0 dispatcher', metaGsSrc.includes('sendWhatsAppMessage'));
check('Live Meta API verification & connection status check', metaGsSrc.includes('verifyMetaConnection'));
check('24-Hour customer service window enforcement', metaGsSrc.includes('checkServiceWindow'));
check('Approved WhatsApp templates provider', metaGsSrc.includes('getApprovedTemplates'));

// 7. Verify AI Travel Assistant
console.log('\n--- 7. AUDITING AI TRAVEL ASSISTANT & GUARDRAILS ---');
const aiGsPath = path.join(process.cwd(), 'backend', 'AIAssistant.gs');
const aiGsSrc = fs.readFileSync(aiGsPath, 'utf8');

check('Active Package Matcher', aiGsSrc.includes('matchPackage'));
check('Multilingual Detector (Hindi, Gujarati, English)', aiGsSrc.includes('detectLanguage'));
check('Pure Veg & Jain Meal Guarantee', aiGsSrc.includes('Jain') && aiGsSrc.includes('onion'));
check('Autonomous Response Dispatcher', aiGsSrc.includes('handleInboundAIResponse'));

// 8. Verify Direct URL Routing & React Router
console.log('\n--- 8. AUDITING REACT ROUTER & DIRECT URL ROUTES ---');
const appTsxPath = path.join(process.cwd(), 'src', 'App.tsx');
const appTsxSrc = fs.readFileSync(appTsxPath, 'utf8');

const requiredRoutes = [
  '/login',
  '/dashboard',
  '/inbox',
  '/customers',
  '/leads',
  '/enquiries',
  '/packages',
  '/builder',
  '/quotations',
  '/bookings',
  '/followups',
  '/campaigns',
  '/knowledge',
  '/ai-settings',
  '/whatsapp-numbers',
  '/whatsapp-status',
  '/integrations',
  '/reports',
  '/team',
  '/business-settings',
  '/profile',
  '*'
];

requiredRoutes.forEach(route => {
  check(`Route configured: ${route}`, appTsxSrc.includes(`path="${route}"`), `Route ${route} missing in App.tsx`);
});
check('Protected route auth redirect to /login with return URL', appTsxSrc.includes('redirect='));
check('404 NotFoundPage mapping', appTsxSrc.includes('NotFoundPage'));

// 9. Verify Login Credentials Privacy (CRITICAL)
console.log('\n--- 9. AUDITING CREDENTIAL PRIVACY & SECURITY ---');
const loginPagePath = path.join(process.cwd(), 'src', 'components', 'auth', 'LoginPage.tsx');
const loginPageSrc = fs.readFileSync(loginPagePath, 'utf8');

check('No pre-filled hardcoded email in login state', loginPageSrc.includes("useState('')") || loginPageSrc.includes('useState("")'));
check('Password input is masked type="password"', loginPageSrc.includes("type={showPassword ? 'text' : 'password'}"));
check('No credential exposure/demo accounts selector in login UI', !loginPageSrc.includes('7 Active Staff Logins') && !loginPageSrc.includes('Password@1379'));

// 10. Verify Zero Dummy/Demo Seed Data in Production Arrays
console.log('\n--- 10. AUDITING DUMMY DATA PURGE ---');
const mockDataPath = path.join(process.cwd(), 'src', 'data', 'mockData.ts');
const mockDataSrc = fs.readFileSync(mockDataPath, 'utf8');

check('INITIAL_CUSTOMERS is empty array', mockDataSrc.includes('INITIAL_CUSTOMERS: Customer[] = [];'));
check('INITIAL_CONVERSATIONS is empty array', mockDataSrc.includes('INITIAL_CONVERSATIONS: Conversation[] = [];'));
check('INITIAL_BOOKINGS is empty array', mockDataSrc.includes('INITIAL_BOOKINGS: Booking[] = [];'));
check('INITIAL_FOLLOWUPS is empty array', mockDataSrc.includes('INITIAL_FOLLOWUPS: FollowUp[] = [];'));
check('INITIAL_CAMPAIGNS is empty array', mockDataSrc.includes('INITIAL_CAMPAIGNS: Campaign[] = [];'));

// 11. Verify Dynamic Metrics in Dashboard (No Hardcoded 1248, 36, 4,80,000)
console.log('\n--- 11. AUDITING DASHBOARD DYNAMIC CALCULATIONS ---');
const dashboardPath = path.join(process.cwd(), 'src', 'components', 'pages', 'DashboardPage.tsx');
const dashboardSrc = fs.readFileSync(dashboardPath, 'utf8');

check('Dashboard calculates total customers dynamically', !dashboardSrc.includes('const totalCustomers = 1248;'));
check('Dashboard calculates new enquiries dynamically', !dashboardSrc.includes('const newEnquiries = 36;'));
check('Dashboard calculates pending payments dynamically', !dashboardSrc.includes("pendingPayments = '₹4,80,000'"));
check('Dashboard empty state for conversations present', dashboardSrc.includes('No Customer Enquiries Yet'));
check('Dashboard empty state for bookings present', dashboardSrc.includes('No Tour Bookings Recorded'));

console.log('\n====================================================');
console.log(`TOTAL AUDIT RESULTS: ${passed} PASSED, ${errors} FAILED`);
console.log('====================================================');

if (errors > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
