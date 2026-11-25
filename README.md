# WhatsApp AI Travel CRM — Premium SaaS Admin Panel (Phase 1 Frontend)

A modern, responsive, Linear/Stripe-inspired SaaS Admin Panel built for a **WhatsApp AI Travel Agency Management System**.

## 🚀 Key Features Built in Phase 1

### 1. Authentication & Onboarding
- **Admin Login Experience**:
  - Email & password inputs with show/hide toggle
  - "Remember me" session option & Forgot Password recovery flow
  - Interactive loading spinner state & validation error messages
  - 1-Click **"Autofill Demo"** button (`alexandra@wanderlustai.com` / `luxurytravel2026`) for rapid evaluation
  - Single-click **"Test Error"** trigger to preview validation states
- **First-Time Owner Registration**:
  - Full Name, Travel Agency / Business Name, Admin Email, Password & Confirm Password
  - Security guardrail: Single-owner provisioning only; public customer signups disabled

### 2. Layout & Global Navigation
- **Fixed & Collapsible Sidebar** with all 18 specified modules organized into Core Workspace, Operations, AI Engine, and Administration:
  1. **Dashboard**
  2. **WhatsApp Inbox** (with live unread badge)
  3. **Customers CRM**
  4. **Leads Pipeline** (with Hot Lead indicators)
  5. **Tour Packages** (Grid & Table catalog)
  6. **Custom Package Builder** (Interactive custom itinerary generator)
  7. **Bookings & Orders** (Vouchers & deposit tracking)
  8. **Follow-ups** (Overdue alerts & completion toggles)
  9. **Campaigns** (WhatsApp Broadcast blast manager)
  10. **FAQs & Knowledge Base** (AI Copilot training repository)
  11. **AI Assistant Settings** (Personality, tone, confidence threshold)
  12. **WhatsApp Numbers** (Multi-line management & QR pairing)
  13. **Integrations** (Stripe, Cloudinary, Sabre/Amadeus, Google Calendar)
  14. **Reports & Analytics** (Visual performance charts & conversion funnel)
  15. **Team Members** (Travel consultants & role permissions)
  16. **Business Settings** (Company profile, currency, time zone, language)
  17. **Admin Profile** (Credentials & personal security)
  18. **Logout** (Confirmation modal returning safely to login screen)
- **Top Navigation Bar**:
  - **Prominent WhatsApp Number Switcher**: Dropdown featuring multiple lines, connection health badges, default line marker, and "+ Connect Number" flow
  - **AI Copilot Master Switch**: Instant toggle between autonomous AI mode and human agent mode
  - **Global Search (`⌘K` / `Ctrl+K`)**: Rapid search across packages, customers, and bookings
  - **Notifications Bell**: Live unread alerts drawer for high-budget leads and payments
  - **Admin Profile Menu**: Quick access to business settings and sign-out
- **Mobile Responsive Design**:
  - Mobile bottom navigation bar for high-frequency actions
  - Full slide-over drawer for all 18 navigation pages

### 3. Core Operational Pages
- **WhatsApp Inbox (3-Panel Design)**:
  - Left panel: Search, multi-line filter, and tab filters (All, Unread, AI Handled, Needs Agent)
  - Center panel: Authentic WhatsApp wallpaper chat interface, incoming/outgoing bubbles, AI Copilot badges vs. Human Agent badges, media cards, quick reply chips, and "✨ Generate AI Reply" action
  - Right panel: Customer intelligence drawer (Destination, Budget, Travel dates, Travellers count, Recommended packages, Lead stage updater, and Private internal notes)
- **Tour Packages Management**:
  - Grid & Table views with 5-star hotel badges, pricing per person, child/group rates, season, and active status
  - Comprehensive **Add/Edit Package Modal** with daily itinerary builder, tiered pricing, inclusions, and exclusions
  - **Client Preview Drawer** simulating the traveler's view
- **Custom Package Builder**:
  - Tailored itinerary builder (Destination, departure city, travel dates, guests, hotel class, transport, meals, and special requests)
  - Interactive Day-by-Day itinerary editor
  - **Live Quotation Calculator**: Real-time breakdown of accommodation, transport, sightseeing, taxes, and agency profit margin
  - **"Generate PDF Quotation"**: Printable A4 proposal preview
  - **"Prepare WhatsApp Message"**: Pre-formatted WhatsApp markdown text with 1-click copy
- **Customers CRM & Leads Pipeline**:
  - Customer directory with destination, budget, pax count, assigned consultant, and quick WhatsApp launcher
  - Kanban Board & Table views with 6 pipeline stages: New Inquiry, Contacted, Proposal Sent, Negotiation, Won, Lost

---

## 🛠️ Tech Stack
- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom emerald (`#059669`) and dark navy typography (`#0f172a`)
- **Icons**: Lucide React
- **Design Tokens**: Linear, Stripe, and Intercom-inspired SaaS aesthetic

---

## 💻 Running the Project Locally

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Build for production
npm run build
```
