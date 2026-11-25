# JAINAM TOURS AND TRAVELS — WHATSAPP AI TRAVEL CRM
## Backend & Database Architecture Documentation (Phase 2)

This directory contains the production-grade, secure, multi-tenant backend built for Google Apps Script and Google Sheets, ready to scale and migrate seamlessly to PostgreSQL / Supabase / Firebase.

---

## 1. Directory Structure

```text
backend/
├── Config.gs              # Global configuration, constants, roles, and schema definitions
├── Database.gs            # Abstract Data Access Layer (DAL) with caching, LockService, and multi-tenancy
├── Setup.gs               # One-click provisioning script for all 15 sheets & seed data
├── Auth.gs                # SHA-256 + Salt hashing, HMAC session tokens, lockout & RBAC
├── AuditLogs.gs           # Security & audit trail logger
├── Customers.gs           # Phone normalization, deduplication & lead pipeline management
├── Packages.gs            # Unlimited tour package CRUD, itineraries, and Drive brochure storage
├── Quotations.gs          # Itemized quotation calculator & A4 PDF letterhead generator
├── Bookings.gs            # Confirmed reservations, deposits, and live balance calculations
├── Messages.gs            # WhatsApp conversation history & staged outbox queue
├── WhatsApp.gs            # Multi-branch WhatsApp Business line switcher & status checker
├── Settings.gs            # Business-level configuration key-value storage
├── DashboardReports.gs    # 8 KPI summary metrics, monthly trends & destination analytics
├── Workflows.gs           # Automated time-driven triggers, lead scoring & Google Calendar sync
├── ApiRouter.gs           # Web App JSON API gateway (doGet/doPost) with rate limiting & error shielding
├── Tests.gs               # Automated 12-stage unit and integration test battery
└── README.md              # Complete deployment and API reference documentation
```

---

## 2. Database Schema (15 Google Sheets)

The setup script (`Setup.gs -> initializeDatabase()`) provisions the following 15 sheets:

| Sheet Name | Key Columns |
|---|---|
| **USERS** | `User ID`, `Name`, `Email`, `Password Hash`, `Salt`, `Role`, `Business ID`, `Status`, `Created At`, `Last Login` |
| **BUSINESSES** | `Business ID`, `Business Name`, `Owner Name`, `Email`, `Phone`, `Address`, `Website`, `Logo`, `Currency`, `Timezone`, `Created At`, `Status` |
| **CONTACTS** | `Customer ID`, `Business ID`, `Name`, `Phone`, `Email`, `Source`, `Destination`, `Travel Dates`, `Return Date`, `Number Of Travellers`, `Budget`, `Lead Stage`, `Lead Score`, `Tags`, `Notes`, `Assigned Employee`, `Created At`, `Updated At`, `Opt Out Status` |
| **MESSAGES** | `Message ID`, `Business ID`, `Customer ID`, `WhatsApp Number ID`, `Direction`, `Message Type`, `Message Text`, `Media URL`, `Message Status`, `Timestamp`, `External Message ID` |
| **PACKAGES** | `Package ID`, `Business ID`, `Package Name`, `Destination`, `Duration`, `Price`, `Currency`, `Hotel Details`, `Transportation`, `Meals`, `Inclusions`, `Exclusions`, `Highlights`, `Itinerary`, `Best Season`, `Images`, `Brochure URL`, `Active Status` |
| **PACKAGE_ITINERARY** | `Itinerary ID`, `Package ID`, `Day Number`, `Day Title`, `Description`, `Activities`, `Hotel`, `Meals`, `Transport` |
| **FAQS** | `FAQ ID`, `Business ID`, `Question`, `Answer`, `Category`, `Language`, `Status` |
| **QUOTATIONS** | `Quotation ID`, `Business ID`, `Customer ID`, `Package ID`, `Travel Date`, `Travellers`, `Hotel Selection`, `Transport`, `Total Price`, `Discount`, `Final Price`, `Valid Until`, `Status`, `PDF URL` |
| **BOOKINGS** | `Booking ID`, `Business ID`, `Customer ID`, `Package ID`, `Quotation ID`, `Travel Date`, `Return Date`, `Total Amount`, `Paid Amount`, `Balance`, `Payment Status`, `Booking Status`, `Notes` |
| **WHATSAPP_NUMBERS** | `Number ID`, `Business ID`, `Display Name`, `Phone Number`, `Country Code`, `Provider`, `Provider Phone ID`, `Is Default`, `Connection Status`, `AI Enabled`, `Created At` |
| **FOLLOWUPS** | `Followup ID`, `Business ID`, `Customer ID`, `Scheduled Date`, `Followup Type`, `Message`, `Status`, `Assigned Employee` |
| **CAMPAIGNS** | `Campaign ID`, `Business ID`, `Campaign Name`, `Audience Segment`, `Message Template`, `Selected Number`, `Scheduled At`, `Status`, `Sent Count`, `Failed Count` |
| **OUTBOX** | `Outbox ID`, `Business ID`, `Customer ID`, `Number ID`, `Message`, `Send Mode`, `Status`, `Created At`, `Sent At` |
| **SETTINGS** | `Business ID`, `Setting Key`, `Setting Value`, `Updated At` |
| **AUDIT_LOGS** | `Log ID`, `Business ID`, `User ID`, `Action`, `Entity`, `Timestamp`, `IP or available request metadata` |

---

## 3. Step-by-Step Deployment Instructions

### Option A: Using Google Sheets Web Editor (Quickest)
1. Open Google Sheets ([sheets.new](https://sheets.new)) and create a new blank spreadsheet.
2. Rename the spreadsheet to **"Jainam Tours and Travels Database"**.
3. Go to **Extensions > Apps Script**.
4. In the Apps Script project editor, copy the contents of each `.gs` file into matching script files (`Config.gs`, `Database.gs`, `Setup.gs`, etc.).
5. In the toolbar, select the function **`initializeDatabase`** from the function dropdown and click **Run**.
   - Review and accept Google account authorization permissions.
   - The script will automatically create and style all 15 tables with frozen headers and seed sample data.
6. Click **Deploy > New Deployment**:
   - Select type: **Web app**
   - Description: `Jainam Tours CRM Production API v2`
   - Execute as: **Me** (`your-email@gmail.com`)
   - Who has access: **Anyone** (allows frontend web client to communicate)
   - Click **Deploy** and copy the **Web app URL** (`https://script.google.com/macros/s/.../exec`).
7. Paste this URL into your frontend `.env` file:
   ```env
   VITE_BACKEND_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
   ```

### Option B: Using `@google/clasp` CLI
```bash
npm install -g @google/clasp
clasp login
clasp create --title "Jainam Tours CRM Backend" --type sheets
clasp push
clasp deploy --description "Jainam Tours CRM API v2"
```

---

## 4. API Reference

All requests are dispatched to the Web App URL via HTTP POST with `Content-Type: text/plain` (or `application/json`):

```json
{
  "action": "<API_ACTION_NAME>",
  "token": "<SESSION_TOKEN_IF_AUTHENTICATED>",
  "data": { ... }
}
```

### Standard Response Envelope
```json
{
  "success": true,
  "data": { ... },
  "error": null,
  "code": 200
}
```

### Authentication Endpoints
- **`authStatus`**: Returns whether the owner account has been initialized.
- **`authCreateOwner`**: First-time owner setup. Payload: `{ name, businessName, email, password, phone }`.
- **`authLogin`**: Login with rate limiting. Payload: `{ email, password }`. Returns `{ token, user, business }`.
- **`authLogout`**: Invalidates session token.
- **`authMe`**: Validates session and returns current profile.
- **`changePassword`**: Payload: `{ oldPassword, newPassword }`.
- **`forgotPassword`**: Payload: `{ email }`.

### Travel Operations Endpoints
- **`getDashboard`**: 8 core KPI summary metrics and recent activity.
- **`getCustomers`**: Customer list with lead filters & pagination. Payload: `{ filters: { leadStage, leadScore, query }, pagination: { page, limit } }`.
- **`createCustomer`**: Normalizes phone to E.164, blocks duplicates. Payload: `{ name, phone, email, destination, budget, travellers }`.
- **`getPackages`**: Tour packages listing.
- **`createPackage`**: Creates package + day-wise itinerary records.
- **`calculateQuotation`**: Itemized price calculation (adults, children, hotels, transport, GST, discounts).
- **`createQuotation`**: Stores quotation and advances customer to `Quote Sent`.
- **`generateQuotationPDF`**: Renders branded PDF quotation on Jainam Tours letterhead into Google Drive.
- **`createBooking`**: Records confirmed reservation and calculates remaining balance.
- **`updatePaymentStatus`**: Records customer deposit/payment and updates balance status.

---

## 5. Security & Multi-Tenant Data Isolation

1. **Multi-Tenancy Guard**: Every read, insert, update, and delete operation is scoped to the user's `Business ID`. An agency owner or consultant cannot view or modify another agency's records.
2. **Password Protection**: Passwords are salted with unique cryptographic tokens (`Utilities.getUuid()`) and hashed using SHA-256 before storage.
3. **Session Tokens**: Signed using HMAC-SHA256 with a unique server secret stored in `ScriptProperties`. Tampered tokens are rejected immediately.
4. **Rate Limiting & Lockout**: Brute-force protection limits failed login attempts to 5 before triggering a 15-minute lockout.
5. **Concurrency Safety**: Write operations utilize Google Apps Script `LockService.getScriptLock()` to prevent race conditions during simultaneous bookings.
6. **Error Shielding**: Stack traces, script properties, and internal system details are never returned in client API error responses.

---

## 6. Running Backend Automated Tests

To verify the backend:
1. Open the Apps Script editor.
2. Select **`runAllBackendTests`** in the function dropdown.
3. Click **Run**.
4. Check the Execution Log:
   ```text
   === STARTING JAINAM TOURS BACKEND TEST BATTERY ===
   [PASS] Test 1: Database Initialization
   [PASS] Test 2.1: Hash Determinism
   [PASS] Test 2.2: Salt Uniqueness
   [PASS] Test 3: Auth Status
   [PASS] Test 4.1: Login Succeeded
   [PASS] Test 4.2: Invalid Password Blocked
   [PASS] Test 5.1: Token Verification
   [PASS] Test 5.2: Tampered Token Rejected
   [PASS] Test 6.1: Phone Normalization
   [PASS] Test 6.2: Customer Record Created
   [PASS] Test 6.3: Duplicate Customer Blocked
   [PASS] Test 7: Multi-Tenant Data Isolation
   [PASS] Test 8.1: Package Created
   [PASS] Test 8.2: Quotation Calculation
   [PASS] Test 9.1: Booking Created
   [PASS] Test 9.2: Balance Calculated
   === TEST SUMMARY: 16 PASSED, 0 FAILED ===
   ```
