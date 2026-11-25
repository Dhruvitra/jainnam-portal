import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate, useSearchParams, Outlet } from 'react-router-dom';
import { useApp } from './context/AppContext';
import { LoginPage } from './components/auth/LoginPage';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { MobileNav } from './components/layout/MobileNav';

// Pages
import { DashboardPage } from './components/pages/DashboardPage';
import { WhatsAppInboxPage } from './components/pages/WhatsAppInboxPage';
import { CustomersPage } from './components/pages/CustomersPage';
import { LeadsPage } from './components/pages/LeadsPage';
import { TourPackagesPage } from './components/pages/TourPackagesPage';
import { CustomPackageBuilderPage } from './components/pages/CustomPackageBuilderPage';
import { BookingsPage } from './components/pages/BookingsPage';
import { FollowUpsPage } from './components/pages/FollowUpsPage';
import { CampaignsPage } from './components/pages/CampaignsPage';
import { KnowledgeBasePage } from './components/pages/KnowledgeBasePage';
import { AIAssistantSettingsPage } from './components/pages/AIAssistantSettingsPage';
import { WhatsAppNumbersPage } from './components/pages/WhatsAppNumbersPage';
import { WhatsAppStatusPage } from './components/pages/WhatsAppStatusPage';
import { IntegrationsPage } from './components/pages/IntegrationsPage';
import { ReportsPage } from './components/pages/ReportsPage';
import { TeamMembersPage } from './components/pages/TeamMembersPage';
import { BusinessSettingsPage } from './components/pages/BusinessSettingsPage';
import { AdminProfilePage } from './components/pages/AdminProfilePage';
import { NotFoundPage } from './components/pages/NotFoundPage';

// Modals & Notifications
import { GlobalSearchModal } from './components/modals/GlobalSearchModal';
import { AddWhatsAppNumberModal } from './components/modals/AddWhatsAppNumberModal';
import { NotificationDrawer } from './components/modals/NotificationDrawer';
import { LogoutConfirmModal } from './components/modals/LogoutConfirmModal';
import { ToastContainer } from './components/common/Toast';

/**
 * Shared authenticated layout frame
 */
const AppLayout: React.FC = () => {
  const { activePage, setActivePage } = useApp();
  const location = useLocation();

  // Keep activePage state in sync with URL on page load, reload, or navigation
  useEffect(() => {
    const rawPath = location.pathname.replace(/^\//, '').toLowerCase();
    const primarySegment = rawPath.split('/')[0] || 'dashboard';

    const aliasMap: Record<string, any> = {
      '': 'dashboard',
      dashboard: 'dashboard',
      inbox: 'inbox',
      whatsapp: 'inbox',
      customers: 'customers',
      leads: 'leads',
      enquiries: 'leads',
      packages: 'packages',
      builder: 'builder',
      planner: 'builder',
      quotations: 'quotations',
      bookings: 'bookings',
      followups: 'followups',
      campaigns: 'campaigns',
      knowledge: 'knowledge',
      faqs: 'knowledge',
      'ai-settings': 'ai-settings',
      'whatsapp-numbers': 'whatsapp-numbers',
      'whatsapp-status': 'whatsapp-status',
      'meta-status': 'whatsapp-status',
      integrations: 'integrations',
      reports: 'reports',
      team: 'team',
      'business-settings': 'business-settings',
      settings: 'business-settings',
      profile: 'profile'
    };

    const targetPage = aliasMap[primarySegment];
    if (targetPage && targetPage !== activePage) {
      setActivePage(targetPage);
    }
  }, [location.pathname]);

  const isInbox = location.pathname.startsWith('/inbox');

  return (
    <div className="flex h-screen w-full bg-[#FAF9F6] overflow-hidden font-sans text-[#333333]">
      {/* Fixed Left Sidebar */}
      <Sidebar />

      {/* Main App Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Topbar with number switcher, search, notification drawer, profile */}
        <Topbar />

        {/* Scrollable View Area */}
        <main
          className={`flex-1 ${
            isInbox
              ? 'p-2 sm:p-3 md:p-4 pb-16 md:pb-4 overflow-hidden flex flex-col'
              : 'overflow-y-auto p-4 sm:p-6 lg:p-8 pb-20 md:pb-8'
          }`}
        >
          <div className={`w-full ${isInbox ? 'h-full flex flex-col' : 'max-w-7xl mx-auto'}`}>
            <Outlet />
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <MobileNav />
      </div>

      {/* Global Modals & Notifications */}
      <GlobalSearchModal />
      <AddWhatsAppNumberModal />
      <NotificationDrawer />
      <LogoutConfirmModal />
      <ToastContainer />
    </div>
  );
};

/**
 * Route protection wrapper: unauthenticated users are redirected to /login with redirect query param
 */
const ProtectedRoute: React.FC = () => {
  const { isAuthenticated } = useApp();
  const location = useLocation();

  if (!isAuthenticated) {
    const redirectUrl = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirectUrl}`} replace />;
  }

  return <AppLayout />;
};

/**
 * Login Route: if already authenticated, restore target redirected page
 */
const LoginRoute: React.FC = () => {
  const { isAuthenticated } = useApp();
  const [searchParams] = useSearchParams();
  const target = searchParams.get('redirect') || '/dashboard';

  if (isAuthenticated) {
    return <Navigate to={target} replace />;
  }

  return <LoginPage />;
};

/**
 * Root Application Routes
 */
export const AppContent: React.FC = () => {
  return (
    <Routes>
      {/* Login Screen */}
      <Route path="/login" element={<LoginRoute />} />

      {/* Protected Workspace Layout */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/inbox" element={<WhatsAppInboxPage />} />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/leads" element={<LeadsPage />} />
        <Route path="/enquiries" element={<Navigate to="/leads" replace />} />
        <Route path="/packages" element={<TourPackagesPage />} />
        <Route path="/builder" element={<CustomPackageBuilderPage />} />
        <Route path="/planner" element={<Navigate to="/builder" replace />} />
        <Route path="/quotations" element={<CustomPackageBuilderPage />} />
        <Route path="/bookings" element={<BookingsPage />} />
        <Route path="/followups" element={<FollowUpsPage />} />
        <Route path="/campaigns" element={<CampaignsPage />} />
        <Route path="/knowledge" element={<KnowledgeBasePage />} />
        <Route path="/faqs" element={<Navigate to="/knowledge" replace />} />
        <Route path="/ai-settings" element={<AIAssistantSettingsPage />} />
        <Route path="/whatsapp-numbers" element={<WhatsAppNumbersPage />} />
        <Route path="/whatsapp-status" element={<WhatsAppStatusPage />} />
        <Route path="/integrations" element={<IntegrationsPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/team" element={<TeamMembersPage />} />
        <Route path="/business-settings" element={<BusinessSettingsPage />} />
        <Route path="/settings" element={<Navigate to="/business-settings" replace />} />
        <Route path="/profile" element={<AdminProfilePage />} />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppContent;
