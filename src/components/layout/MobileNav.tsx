import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { PageId } from '../../types';
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  Compass,
  Briefcase,
  Sliders,
  CalendarCheck,
  Menu,
  X,
  FileText,
  Clock,
  Send,
  Smartphone,
  Building2,
  BarChart3,
  UserCheck,
  User,
  LogOut
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { activePage, setActivePage, setIsLogoutModalOpen, conversations } = useApp();
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const unreadCount = conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);

  const primaryItems = [
    { id: 'dashboard' as PageId, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inbox' as PageId, label: 'Inbox', icon: MessageSquare, badge: unreadCount > 0 ? unreadCount : undefined },
    { id: 'customers' as PageId, label: 'Customers', icon: Users },
    { id: 'packages' as PageId, label: 'Packages', icon: Briefcase },
    { id: 'builder' as PageId, label: 'Planner', icon: Sliders }
  ];

  const allDrawerItems: { id: PageId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inbox', label: 'WhatsApp Inbox', icon: MessageSquare },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'leads', label: 'Enquiries & Leads', icon: Compass },
    { id: 'packages', label: 'Tour Packages', icon: Briefcase },
    { id: 'builder', label: 'Custom Tour Planner', icon: Sliders },
    { id: 'quotations', label: 'Quotations', icon: FileText },
    { id: 'bookings', label: 'Bookings', icon: CalendarCheck },
    { id: 'followups', label: 'Follow-ups', icon: Clock },
    { id: 'campaigns', label: 'Campaigns', icon: Send },
    { id: 'whatsapp-numbers', label: 'WhatsApp Numbers', icon: Smartphone },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'team', label: 'Team Management', icon: UserCheck },
    { id: 'business-settings', label: 'Business Settings', icon: Building2 },
    { id: 'profile', label: 'Admin Profile', icon: User },
    { id: 'logout', label: 'Logout', icon: LogOut }
  ];

  const handleSelect = (id: PageId) => {
    setIsDrawerOpen(false);
    if (id === 'logout') {
      setIsLogoutModalOpen(true);
    } else {
      setActivePage(id);
      navigate(`/${id}`);
    }
  };

  return (
    <>
      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#EAE6DE] px-2 py-1.5 flex items-center justify-around shadow-lg">
        {primaryItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActivePage(item.id);
                navigate(`/${item.id}`);
              }}
              className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all relative ${
                isActive ? 'text-[#C99532] font-bold' : 'text-[#707070] hover:text-[#292929]'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {item.badge && (
                  <span className="absolute -top-1 -right-2 px-1 rounded-full text-[9px] font-bold bg-[#C99532] text-white">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </button>
          );
        })}

        <button
          onClick={() => setIsDrawerOpen(true)}
          className="flex flex-col items-center justify-center p-1.5 rounded-xl text-[#707070] hover:text-[#292929]"
        >
          <Menu className="w-5 h-5 stroke-2" />
          <span className="text-[10px] mt-0.5">More</span>
        </button>
      </nav>

      {/* Slide-over Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs md:hidden">
          <div className="absolute inset-y-0 left-0 max-w-xs w-full bg-white shadow-2xl flex flex-col">
            <div className="p-4 border-b border-[#EAE6DE] flex items-center justify-between">
              <img
                src="/jainam-logo.png"
                alt="JAINAM TOURS AND TRAVELS"
                className="h-14 w-auto object-contain"
              />
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-1.5 text-[#8A8A8A] hover:text-[#292929]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              {allDrawerItems.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;
                const isLogout = item.id === 'logout';

                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                      isActive
                        ? 'bg-[#FAF4E8] text-[#A87922]'
                        : isLogout
                        ? 'text-red-600 hover:bg-red-50'
                        : 'text-[#333333] hover:bg-[#FAF9F6]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#C99532]' : isLogout ? 'text-red-500' : 'text-[#8A8A8A]'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
