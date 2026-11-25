import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Smartphone,
  ChevronDown,
  Search,
  Bell,
  Plus,
  Check,
  User,
  Settings,
  LogOut,
  Radio
} from 'lucide-react';

export const Topbar: React.FC = () => {
  const navigate = useNavigate();
  const {
    activePage,
    whatsappNumbers,
    selectedNumber,
    setSelectedNumberId,
    setIsAddNumberModalOpen,
    setIsSearchModalOpen,
    setIsNotificationsDrawerOpen,
    currentUser,
    setActivePage,
    setIsLogoutModalOpen,
    addToast
  } = useApp();

  const [isNumberDropdownOpen, setIsNumberDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const numberDropdownRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (numberDropdownRef.current && !numberDropdownRef.current.contains(event.target as Node)) {
        setIsNumberDropdownOpen(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const pageTitles: Record<string, string> = {
    dashboard: 'Agency Dashboard',
    inbox: 'WhatsApp Customer Desk',
    customers: 'Customer Directory',
    leads: 'Enquiries & Leads Pipeline',
    packages: 'Tour Packages Management',
    builder: 'Custom Tour Planner',
    quotations: 'Travel Quotations',
    bookings: 'Bookings & Reservations',
    followups: 'Customer Follow-ups',
    campaigns: 'Broadcast Campaigns',
    'whatsapp-numbers': 'WhatsApp Business Numbers',
    'whatsapp-status': 'Meta WhatsApp Cloud API Gateway',
    'business-settings': 'Business Profile & Settings',
    reports: 'Business Reports & Analytics',
    team: 'Team Management',
    knowledge: 'Travel FAQs & Policies',
    'ai-settings': 'Smart Assistant Settings',
    integrations: 'Integrations',
    profile: 'Admin Profile'
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-[#EAE6DE] px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left side: Page Title */}
      <div className="flex items-center gap-4">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-[#292929]">
            {pageTitles[activePage] || 'Dashboard'}
          </h2>
          <span className="text-[11px] text-[#707070] hidden sm:inline">
            Jainam Tours and Travels • "By Travellers, for Travellers"
          </span>
        </div>
      </div>

      {/* Right side: WhatsApp Number Switcher + Search + Notifications + Profile */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* WhatsApp Line Switcher */}
        <div className="relative" ref={numberDropdownRef}>
          <button
            onClick={() => setIsNumberDropdownOpen(!isNumberDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#EAE6DE] hover:border-[#C99532] bg-[#FAF9F6] hover:bg-[#FAF4E8] text-[#292929] transition-all text-left shadow-2xs group"
            title="Switch WhatsApp Business Line"
          >
            <div className="relative flex-shrink-0">
              <div className="w-7 h-7 rounded-lg bg-[#FAF4E8] border border-[#F4E7C8] flex items-center justify-center text-[#C99532]">
                <Smartphone className="w-3.5 h-3.5" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-white" />
            </div>

            <div className="hidden sm:block text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-[#292929] truncate max-w-[150px]">
                  {selectedNumber.name}
                </span>
                {selectedNumber.isDefault && (
                  <span className="text-[9px] font-bold bg-[#FAF4E8] text-[#A87922] border border-[#F4E7C8] px-1 rounded">
                    Default
                  </span>
                )}
              </div>
              <div className="text-[10px] text-[#707070] font-mono">
                {selectedNumber.phoneNumber}
              </div>
            </div>

            <ChevronDown className="w-3.5 h-3.5 text-[#8A8A8A] ml-1" />
          </button>

          {isNumberDropdownOpen && (
            <div className="absolute right-0 sm:left-0 mt-2 w-80 bg-white rounded-2xl shadow-modal border border-[#EAE6DE] p-2 z-50 animate-in fade-in duration-150">
              <div className="px-3 py-2 border-b border-[#EAE6DE] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#292929] block">WhatsApp Business Lines</span>
                  <span className="text-[11px] text-[#707070]">Official customer communication channels</span>
                </div>
                <button
                  onClick={() => {
                    setIsNumberDropdownOpen(false);
                    setIsAddNumberModalOpen(true);
                  }}
                  className="p-1 rounded-md text-[#C99532] hover:bg-[#FAF4E8]"
                  title="Add Line"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="max-h-60 overflow-y-auto divide-y divide-[#EAE6DE] py-1">
                {whatsappNumbers.map((num) => (
                  <div
                    key={num.id}
                    onClick={() => {
                      setSelectedNumberId(num.id);
                      setIsNumberDropdownOpen(false);
                      addToast('Active Line Selected', `Managing inquiries for ${num.name}`, 'info');
                    }}
                    className={`p-2.5 rounded-xl flex items-center justify-between cursor-pointer transition-colors ${
                      num.id === selectedNumber.id ? 'bg-[#FAF4E8] border border-[#F4E7C8]' : 'hover:bg-[#FAF9F6]'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-[#292929] truncate">{num.name}</span>
                        {num.isDefault && (
                          <span className="text-[9px] bg-[#FAF4E8] text-[#A87922] px-1 rounded font-bold">
                            DEF
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] font-mono text-[#707070]">{num.phoneNumber}</div>
                    </div>
                    {num.id === selectedNumber.id && <Check className="w-4 h-4 text-[#C99532] flex-shrink-0" />}
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-[#EAE6DE]">
                <button
                  onClick={() => {
                    setIsNumberDropdownOpen(false);
                    setIsAddNumberModalOpen(true);
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-[#FAF9F6] hover:bg-[#FAF4E8] text-[#A87922] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-[#EAE6DE]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Connect Another WhatsApp Line</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Global Search */}
        <button
          onClick={() => setIsSearchModalOpen(true)}
          className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl border border-[#EAE6DE] bg-[#FAF9F6] hover:bg-white text-[#707070] text-xs transition-colors shadow-2xs"
          title="Search packages and customers"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Search...</span>
          <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-white border border-[#EAE6DE] text-[#8A8A8A] font-mono">
            ⌘K
          </kbd>
        </button>

        {/* Notifications */}
        <button
          onClick={() => setIsNotificationsDrawerOpen(true)}
          className="relative p-2 rounded-xl text-[#525252] hover:text-[#292929] hover:bg-[#FAF9F6] transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#C99532] ring-2 ring-white" />
        </button>

        {/* Admin Profile Dropdown */}
        <div className="relative" ref={profileDropdownRef}>
          <button
            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-[#FAF9F6] transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-[#FAF4E8] border border-[#F4E7C8] text-[#A87922] font-bold text-xs flex items-center justify-center">
              JS
            </div>
            <div className="hidden lg:block text-left pr-1">
              <div className="text-xs font-bold text-[#292929] leading-none">{currentUser.name}</div>
              <div className="text-[10px] text-[#707070] mt-1">{currentUser.role}</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#8A8A8A] hidden sm:block" />
          </button>

          {isProfileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-modal border border-[#EAE6DE] p-2 z-50 animate-in fade-in duration-150">
              <div className="p-3 border-b border-[#EAE6DE]">
                <p className="text-xs font-bold text-[#292929]">{currentUser.name}</p>
                <p className="text-[11px] text-[#707070] truncate">{currentUser.email}</p>
                <p className="text-[10px] font-semibold text-[#A87922] mt-1">{currentUser.businessName}</p>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setActivePage('profile');
                    navigate('/profile');
                    setIsProfileDropdownOpen(false);
                  }}
                  className="w-full px-3 py-2 text-xs font-medium text-[#333333] hover:bg-[#FAF9F6] rounded-xl flex items-center gap-2.5 transition-colors"
                >
                  <User className="w-4 h-4 text-[#8A8A8A]" />
                  <span>Admin Profile</span>
                </button>
                <button
                  onClick={() => {
                    setActivePage('business-settings');
                    navigate('/business-settings');
                    setIsProfileDropdownOpen(false);
                  }}
                  className="w-full px-3 py-2 text-xs font-medium text-[#333333] hover:bg-[#FAF9F6] rounded-xl flex items-center gap-2.5 transition-colors"
                >
                  <Settings className="w-4 h-4 text-[#8A8A8A]" />
                  <span>Business Settings</span>
                </button>
              </div>

              <div className="pt-1 border-t border-[#EAE6DE]">
                <button
                  onClick={() => {
                    setIsProfileDropdownOpen(false);
                    setIsLogoutModalOpen(true);
                  }}
                  className="w-full px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-xl flex items-center gap-2.5 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
