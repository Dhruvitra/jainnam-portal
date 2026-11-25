import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { X, Bell, CheckCircle2, MessageSquare, AlertTriangle, Clock, Trash2 } from 'lucide-react';

interface DynamicNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'payment' | 'alert' | 'lead' | 'inquiry';
  actionPage: string;
  convId?: string;
  unread: boolean;
}

export const NotificationDrawer: React.FC = () => {
  const {
    isNotificationsDrawerOpen,
    setIsNotificationsDrawerOpen,
    setActivePage,
    setActiveConversationId,
    followups,
    bookings,
    customers,
    conversations
  } = useApp();
  const navigate = useNavigate();

  const [dismissedIds, setDismissedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('jainam_crm_dismissed_notifications');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('jainam_crm_dismissed_notifications', JSON.stringify(dismissedIds));
  }, [dismissedIds]);

  useEffect(() => {
    if (!isNotificationsDrawerOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsNotificationsDrawerOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isNotificationsDrawerOpen]);

  if (!isNotificationsDrawerOpen) return null;

  // Build actionable alerts strictly from actual system data
  const realNotifications: DynamicNotification[] = [];

  // 1. Pending follow-ups
  followups
    .filter(f => !f.isCompleted && !dismissedIds.includes(f.id))
    .slice(0, 5)
    .forEach(f => {
      realNotifications.push({
        id: f.id,
        title: `Follow-up Due: ${f.customerName}`,
        message: `${f.reason} • Scheduled for ${f.dueDate} at ${f.dueTime}`,
        time: 'Pending',
        type: 'alert',
        actionPage: 'followups',
        unread: true
      });
    });

  // 2. Pending balances on confirmed bookings
  bookings
    .filter(b => b.totalAmount > b.paidAmount && !dismissedIds.includes(b.id))
    .slice(0, 5)
    .forEach(b => {
      const balance = (b.totalAmount || 0) - (b.paidAmount || 0);
      realNotifications.push({
        id: b.id,
        title: `Pending Balance: ₹${balance.toLocaleString('en-IN')}`,
        message: `${b.customerName} has pending balance for ${b.packageName} (${b.bookingRef})`,
        time: b.bookingDate || 'Recent',
        type: 'payment',
        actionPage: 'bookings',
        unread: true
      });
    });

  // 3. New customer inquiries
  customers
    .filter(c => c.leadStatus === 'New Enquiry' && !dismissedIds.includes(c.id))
    .slice(0, 5)
    .forEach(c => {
      realNotifications.push({
        id: c.id,
        title: `New Enquiry: ${c.name}`,
        message: `Interested in ${c.destination} • Budget ₹${c.budget.toLocaleString('en-IN')} (${c.travellers} Pax)`,
        time: 'New',
        type: 'lead',
        actionPage: 'leads',
        unread: true
      });
    });

  // 4. Unread messages in conversations
  conversations
    .filter(c => (c.unreadCount || 0) > 0 && !dismissedIds.includes(c.id))
    .slice(0, 5)
    .forEach(c => {
      realNotifications.push({
        id: c.id,
        title: `WhatsApp Message from ${c.customerName}`,
        message: c.lastMessage || 'New inbound message received',
        time: c.time || 'Recent',
        type: 'inquiry',
        actionPage: 'inbox',
        convId: c.id,
        unread: true
      });
    });

  const handleDismiss = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDismissedIds(prev => [...prev, id]);
  };

  const handleClearAll = () => {
    const allIds = realNotifications.map(n => n.id);
    setDismissedIds(prev => [...new Set([...prev, ...allIds])]);
  };

  const handleItemClick = (n: DynamicNotification) => {
    if (n.convId) setActiveConversationId(n.convId);
    setActivePage(n.actionPage as any);
    navigate(`/${n.actionPage}`);
    setIsNotificationsDrawerOpen(false);
  };

  return createPortal(
    <div
      onClick={() => setIsNotificationsDrawerOpen(false)}
      className="fixed inset-0 z-[100] overflow-hidden bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute inset-y-0 right-0 max-w-full flex pl-10"
      >
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-[#EAE6DE] flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#EAE6DE] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#FAF4E8] text-[#C99532] border border-[#F4E7C8] flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#292929]">Notifications & Reminders</h3>
                <p className="text-xs text-[#707070]">
                  {realNotifications.length > 0
                    ? `${realNotifications.length} actionable alert${realNotifications.length > 1 ? 's' : ''}`
                    : 'All clear'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {realNotifications.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="text-xs text-[#8A8A8A] hover:text-[#292929] flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-[#FAF9F6] transition-colors"
                  title="Dismiss all current notifications"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Dismiss All</span>
                </button>
              )}
              <button
                onClick={() => setIsNotificationsDrawerOpen(false)}
                className="p-1.5 text-[#8A8A8A] hover:text-[#292929] rounded-lg hover:bg-[#FAF9F6] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Notification List */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#EAE6DE] p-2">
            {realNotifications.length > 0 ? (
              realNotifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleItemClick(n)}
                  className="p-3.5 rounded-xl cursor-pointer transition-all hover:bg-[#FAF9F6] group relative"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex-shrink-0">
                      {n.type === 'payment' ? (
                        <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      ) : n.type === 'alert' ? (
                        <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center">
                          <AlertTriangle className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-lg bg-[#FAF4E8] text-[#C99532] border border-[#F4E7C8] flex items-center justify-center">
                          <MessageSquare className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 pr-6">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <h4 className="text-xs font-bold text-[#292929] truncate">{n.title}</h4>
                        <span className="text-[10px] text-[#8A8A8A] whitespace-nowrap flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          {n.time}
                        </span>
                      </div>
                      <p className="text-xs text-[#707070] line-clamp-2 leading-relaxed">{n.message}</p>
                    </div>

                    {/* Quick Dismiss button */}
                    <button
                      onClick={(e) => handleDismiss(n.id, e)}
                      className="absolute right-3 top-3 p-1 rounded text-[#8A8A8A] hover:text-[#292929] hover:bg-white transition-opacity opacity-0 group-hover:opacity-100"
                      title="Dismiss reminder"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#707070]">
                <div className="w-12 h-12 rounded-2xl bg-[#FAF4E8] text-[#C99532] border border-[#F4E7C8] flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-[#292929]">All Caught Up!</h4>
                <p className="text-xs text-[#707070] max-w-xs mt-1 leading-relaxed">
                  No overdue follow-ups, pending payment balances, or unattended enquiries at this moment.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-[#EAE6DE] bg-[#FAF9F6] flex items-center justify-between text-xs text-[#707070]">
            <span>Real-time operations monitor</span>
            <button
              onClick={() => setIsNotificationsDrawerOpen(false)}
              className="text-[#C99532] font-semibold hover:underline"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
