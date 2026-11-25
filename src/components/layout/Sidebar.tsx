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
  FileText,
  CalendarCheck,
  Clock,
  Send,
  Smartphone,
  Building2,
  BarChart3,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Bot,
  Layers,
  User,
  Radio
} from 'lucide-react';

interface NavItem {
  id: PageId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
}

export const Sidebar: React.FC = () => {
  const {
    activePage,
    setActivePage,
    conversations,
    customers,
    followups,
    whatsappNumbers
  } = useApp();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Dynamic badges computed from actual real state
  const unreadInboxCount = conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
  const activeLeadsCount = customers.filter(c => c.leadStatus === 'New Enquiry' || c.leadStatus === 'Contacted').length;
  const pendingFollowupsCount = followups.filter(f => !f.isCompleted).length;
  const totalWhatsAppLines = `${whatsappNumbers.length} lines`;

  // Grouped logically following Jainam Tours & Travels management specifications
  const sections: { title: string; items: NavItem[] }[] = [
    {
      title: 'Travel Operations',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'inbox', label: 'WhatsApp Inbox', icon: MessageSquare, badge: unreadInboxCount > 0 ? unreadInboxCount : undefined },
        { id: 'customers', label: 'Customers', icon: Users },
        { id: 'leads', label: 'Enquiries & Leads', icon: Compass, badge: activeLeadsCount > 0 ? activeLeadsCount : undefined },
        { id: 'packages', label: 'Tour Packages', icon: Briefcase },
        { id: 'builder', label: 'Custom Tour Planner', icon: Sliders },
        { id: 'quotations', label: 'Quotations', icon: FileText },
        { id: 'bookings', label: 'Bookings', icon: CalendarCheck }
      ]
    },
    {
      title: 'Client Follow-ups & Growth',
      items: [
        { id: 'followups', label: 'Follow-ups', icon: Clock, badge: pendingFollowupsCount > 0 ? pendingFollowupsCount : undefined },
        { id: 'campaigns', label: 'Campaigns', icon: Send },
        { id: 'reports', label: 'Reports', icon: BarChart3 }
      ]
    },
    {
      title: 'WhatsApp & Communication',
      items: [
        { id: 'whatsapp-numbers', label: 'WhatsApp Numbers', icon: Smartphone, badge: totalWhatsAppLines },
        { id: 'whatsapp-status', label: 'Meta Gateway Status', icon: Radio, badge: 'Live' },
        { id: 'knowledge', label: 'FAQs & Policies', icon: BookOpen },
        { id: 'ai-settings', label: 'Smart Assistant', icon: Bot },
        { id: 'integrations', label: 'Integrations', icon: Layers }
      ]
    },
    {
      title: 'Agency Administration',
      items: [
        { id: 'team', label: 'Team Management', icon: UserCheck },
        { id: 'business-settings', label: 'Business Settings', icon: Building2 },
        { id: 'profile', label: 'Admin Profile', icon: User }
      ]
    }
  ];

  const handleItemClick = (id: PageId) => {
    setActivePage(id);
    navigate(`/${id}`);
  };

  return (
    <aside
      className={`hidden md:flex flex-col border-r border-[#EAE6DE] bg-white transition-all duration-300 select-none z-20 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header with Prominent, Crisp Logo */}
      <div className={`px-4 py-3 border-b border-[#EAE6DE] flex items-center min-h-[82px] ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        {!isCollapsed ? (
          <div className="flex items-center py-0.5">
            <img
              src="/jainam-logo.png"
              alt="JAINAM TOURS AND TRAVELS"
              className="h-16 w-auto max-w-[185px] object-contain drop-shadow-2xs"
            />
          </div>
        ) : (
          <img
            src="/jainam-logo.png"
            alt="Jainam"
            className="h-10 w-auto object-contain"
          />
        )}

        {!isCollapsed && (
          <button
            onClick={() => setIsCollapsed(true)}
            className="p-1.5 rounded-lg text-[#8A8A8A] hover:text-[#292929] hover:bg-[#FAF9F6] transition-colors flex-shrink-0"
            title="Collapse Sidebar"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {isCollapsed && (
        <div className="py-2 flex justify-center border-b border-[#EAE6DE]">
          <button
            onClick={() => setIsCollapsed(false)}
            className="p-1.5 rounded-lg text-[#8A8A8A] hover:text-[#292929] hover:bg-[#FAF9F6] transition-colors"
            title="Expand Sidebar"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto py-3 px-3 space-y-5">
        {sections.map((section, idx) => (
          <div key={idx}>
            {!isCollapsed && (
              <h4 className="px-2.5 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-[#8A8A8A]">
                {section.title}
              </h4>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    title={isCollapsed ? item.label : undefined}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all ${
                      isActive
                        ? 'bg-[#FAF4E8] text-[#A87922] font-bold border border-[#F4E7C8]'
                        : 'text-[#333333] hover:text-[#292929] hover:bg-[#FAF9F6] font-medium'
                    } ${isCollapsed ? 'justify-center px-0' : ''}`}
                  >
                    <Icon
                      className={`w-4 h-4 flex-shrink-0 ${
                        isActive
                          ? 'text-[#C99532]'
                          : 'text-[#8A8A8A]'
                      }`}
                    />

                    {!isCollapsed && (
                      <>
                        <span className="truncate flex-1 text-left">{item.label}</span>
                        {item.badge !== undefined && (
                          <span
                            className={`px-1.5 py-0.2 rounded-md text-[10px] font-bold ${
                              isActive
                                ? 'bg-[#C99532] text-white'
                                : 'bg-[#FAF9F6] border border-[#EAE6DE] text-[#707070]'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};
