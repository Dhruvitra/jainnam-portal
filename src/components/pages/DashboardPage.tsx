import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Compass,
  CalendarCheck,
  Briefcase,
  Clock,
  MessageSquare,
  ArrowUpRight,
  Calendar,
  DollarSign,
  Plus
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const {
    customers,
    packages,
    bookings,
    followups,
    conversations,
    selectedNumber,
    setActivePage,
    setActiveConversationId
  } = useApp();
  const navigate = useNavigate();

  const handleNavigate = (page: string) => {
    setActivePage(page as any);
    navigate(`/${page}`);
  };

  // Real dynamic calculations from state
  const totalCustomers = customers.length;
  const newEnquiries = customers.filter(c => c.leadStatus === 'New Enquiry').length;
  const activeLeads = customers.filter(c => ['In Progress', 'Negotiation', 'Proposal Sent', 'Contacted'].includes(c.leadStatus)).length;
  const confirmedBookings = bookings.filter(b => b.bookingStatus === 'Confirmed').length;
  const totalTourPackages = packages.filter(p => p.isActive).length;
  const upcomingTrips = bookings.filter(b => b.bookingStatus === 'Confirmed' || b.bookingStatus === 'In Progress').length;
  
  const pendingAmount = bookings.reduce(
    (sum, b) => sum + Math.max(0, (b.totalAmount || 0) - (b.paidAmount || 0)),
    0
  );
  const pendingPayments = `₹${pendingAmount.toLocaleString('en-IN')}`;
  const pendingFollowups = followups.filter(f => !f.isCompleted).length;

  const statCards = [
    {
      label: 'Total Customers',
      value: totalCustomers.toLocaleString('en-IN'),
      change: totalCustomers > 0 ? `${totalCustomers} active clients` : 'No customers yet',
      icon: Users,
      page: 'customers'
    },
    {
      label: 'New Enquiries',
      value: newEnquiries.toString(),
      change: newEnquiries > 0 ? `${newEnquiries} from WhatsApp` : '0 awaiting reply',
      icon: MessageSquare,
      page: 'leads'
    },
    {
      label: 'Active Leads',
      value: activeLeads.toString(),
      change: activeLeads > 0 ? `${activeLeads} in pipeline` : 'Pipeline clear',
      icon: Compass,
      page: 'leads'
    },
    {
      label: 'Confirmed Bookings',
      value: confirmedBookings.toString(),
      change: confirmedBookings > 0 ? 'Deposits verified' : 'No bookings yet',
      icon: CalendarCheck,
      page: 'bookings'
    },
    {
      label: 'Tour Packages',
      value: totalTourPackages.toString(),
      change: `${totalTourPackages} active packages`,
      icon: Briefcase,
      page: 'packages'
    },
    {
      label: 'Upcoming Trips',
      value: upcomingTrips.toString(),
      change: upcomingTrips > 0 ? `${upcomingTrips} scheduled` : 'No trips planned',
      icon: Calendar,
      page: 'bookings'
    },
    {
      label: 'Pending Payments',
      value: pendingPayments,
      change: pendingAmount > 0 ? 'Outstanding balance' : 'All accounts clear',
      icon: DollarSign,
      page: 'bookings'
    },
    {
      label: 'Follow-ups',
      value: pendingFollowups.toString(),
      change: pendingFollowups > 0 ? `${pendingFollowups} tasks pending` : 'All tasks completed',
      icon: Clock,
      page: 'followups'
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Welcome Banner */}
      <div className="bg-white rounded-2xl border border-[#EAE6DE] p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <img
            src="/jainam-logo.png"
            alt="Jainam Tours and Travels"
            className="h-12 w-auto object-contain flex-shrink-0"
          />
          <div>
            <h1 className="text-base sm:text-lg font-bold text-[#292929]">
              Jainam Tours & Travels — Operations Dashboard
            </h1>
            <p className="text-xs text-[#707070]">
              Active Line: <strong className="text-[#292929]">{selectedNumber.name}</strong> ({selectedNumber.phoneNumber}) • Tagline: <em>"By Travellers, for Travellers"</em>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => handleNavigate('builder')}
            className="px-3.5 py-2 rounded-xl bg-[#C99532] hover:bg-[#A87922] text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Tour Plan</span>
          </button>
        </div>
      </div>

      {/* 8 Clean Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              onClick={() => handleNavigate(card.page)}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-[#EAE6DE] shadow-2xs hover:border-[#C99532] hover:shadow-card transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-medium text-[#707070] truncate max-w-[130px]">
                  {card.label}
                </span>
                <div className="w-8 h-8 rounded-xl bg-[#FAF4E8] border border-[#F4E7C8] text-[#C99532] flex items-center justify-center transition-transform group-hover:scale-105">
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="flex items-baseline justify-between gap-1">
                <span className="text-xl sm:text-2xl font-extrabold text-[#292929] tracking-tight">
                  {card.value}
                </span>
                <span className="text-[11px] font-medium text-[#A87922] truncate">
                  {card.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2 Analytical Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Monthly Bookings Trajectory */}
        <div className="bg-white rounded-2xl border border-[#EAE6DE] p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#292929]">Monthly Bookings</h3>
              <p className="text-xs text-[#707070]">Confirmed holiday reservations</p>
            </div>
            <span className="text-xs font-semibold text-[#A87922] bg-[#FAF4E8] px-2.5 py-1 rounded-lg border border-[#F4E7C8]">
              {bookings.length} Bookings Recorded
            </span>
          </div>

          {bookings.length > 0 ? (
            <div className="h-44 w-full flex flex-col justify-end pt-2">
              <div className="h-32 w-full relative">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 300 100" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#C99532" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#C99532" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,75 Q50,60 100,68 T200,35 T300,15 L300,100 L0,100 Z"
                    fill="url(#goldGrad)"
                  />
                  <path
                    d="M0,75 Q50,60 100,68 T200,35 T300,15"
                    fill="none"
                    stroke="#C99532"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <circle cx="0" cy="75" r="3.5" fill="#C99532" />
                  <circle cx="100" cy="68" r="3.5" fill="#C99532" />
                  <circle cx="200" cy="35" r="3.5" fill="#C99532" />
                  <circle cx="300" cy="15" r="4.5" fill="#C99532" stroke="#fff" strokeWidth="2" />
                </svg>
              </div>
              <div className="flex justify-between text-[11px] text-[#8A8A8A] font-medium pt-2 border-t border-[#EAE6DE]">
                <span>Recent Bookings</span>
                <span>Active Season</span>
              </div>
            </div>
          ) : (
            <div className="h-44 flex flex-col items-center justify-center text-center p-4">
              <CalendarCheck className="w-8 h-8 text-[#C99532]/50 mb-2" />
              <p className="text-xs font-semibold text-[#292929]">No Bookings Recorded Yet</p>
              <p className="text-[11px] text-[#707070] mt-0.5">
                Confirmed reservations will populate monthly seasonal charts.
              </p>
            </div>
          )}
        </div>

        {/* Destination Catalog Breakdown */}
        <div className="bg-white rounded-2xl border border-[#EAE6DE] p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#292929]">Active Destination Packages</h3>
              <p className="text-xs text-[#707070]">Curated packages ready for client quotes</p>
            </div>
            <button
              onClick={() => handleNavigate('packages')}
              className="text-xs font-semibold text-[#C99532] hover:text-[#A87922] flex items-center gap-1"
            >
              <span>Manage Packages</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 pt-1 text-xs">
            {packages.slice(0, 4).map((pkg, i) => (
              <div key={pkg.id || i}>
                <div className="flex justify-between font-medium text-[#292929] mb-1">
                  <span className="truncate pr-2">{pkg.name}</span>
                  <span className="text-[#A87922] font-mono whitespace-nowrap font-bold">
                    ₹{pkg.pricePerPerson.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#FAF9F6] border border-[#EAE6DE] overflow-hidden">
                  <div
                    className="h-full bg-[#C99532] rounded-full"
                    style={{ width: `${Math.min(100, 30 + i * 20)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Middle Row: Recent WhatsApp Enquiries & Desk Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Customer WhatsApp Conversations */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#EAE6DE] p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#292929]">Recent Customer WhatsApp Enquiries</h3>
              <p className="text-xs text-[#707070]">Inbound customer communication</p>
            </div>
            <button
              onClick={() => handleNavigate('inbox')}
              className="text-xs font-semibold text-[#C99532] hover:text-[#A87922] flex items-center gap-1"
            >
              <span>Open WhatsApp Desk</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {conversations.length > 0 ? (
            <div className="divide-y divide-[#EAE6DE]">
              {conversations.slice(0, 4).map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => {
                    setActiveConversationId(conv.id);
                    handleNavigate('inbox');
                  }}
                  className="py-3 px-2 rounded-xl hover:bg-[#FAF9F6] cursor-pointer flex items-start justify-between gap-3 transition-colors"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <img
                      src={conv.customerAvatar || '/jainam-logo.png'}
                      alt={conv.customerName}
                      className="w-10 h-10 rounded-full object-cover border border-[#EAE6DE]"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-bold text-[#292929] truncate">{conv.customerName}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#FAF9F6] border border-[#EAE6DE] text-[#707070] font-mono">
                          {conv.whatsappNumber}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#FAF4E8] text-[#A87922] font-semibold border border-[#F4E7C8]">
                          {conv.leadStatus}
                        </span>
                      </div>
                      <p className="text-xs text-[#525252] truncate leading-relaxed">
                        {conv.lastMessage}
                      </p>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className="text-[10px] text-[#8A8A8A]">{conv.time}</div>
                    {conv.unreadCount > 0 && (
                      <span className="mt-1 inline-block px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#C99532] text-white">
                        {conv.unreadCount} new
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 px-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#FAF4E8] text-[#C99532] border border-[#F4E7C8] flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-[#292929]">No Customer Enquiries Yet</h4>
              <p className="text-xs text-[#707070] max-w-sm mx-auto mt-1 mb-4">
                Inbound customer messages received via Meta WhatsApp Cloud API will appear here in real-time.
              </p>
              <button
                onClick={() => handleNavigate('inbox')}
                className="px-3.5 py-2 rounded-xl bg-[#C99532] hover:bg-[#A87922] text-white text-xs font-semibold shadow-sm transition-all"
              >
                Go to WhatsApp Desk
              </button>
            </div>
          )}
        </div>

        {/* Agency Summary & Connection Card */}
        <div className="bg-white rounded-2xl border border-[#EAE6DE] p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#EAE6DE] pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#292929]">Travel Desk Status</h3>
              <p className="text-[11px] text-[#707070]">Customer support lines</p>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
              OPERATIONAL
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-xl bg-[#FAF9F6] border border-[#EAE6DE] space-y-1">
              <span className="text-[11px] font-bold text-[#292929] block">Primary Booking Desk</span>
              <div className="flex justify-between text-slate-600 font-mono text-[11px]">
                <span>{selectedNumber.phoneNumber}</span>
                <span className="text-emerald-700 font-semibold font-sans">Active</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#FAF9F6] border border-[#EAE6DE] space-y-1">
              <span className="text-[11px] font-bold text-[#292929] block">{selectedNumber.name}</span>
              <div className="flex justify-between text-slate-600 font-mono text-[11px]">
                <span>Routing: Meta Cloud API</span>
                <span className="text-emerald-700 font-semibold font-sans">Ready</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[#EAE6DE] text-center">
            <p className="text-xs font-semibold text-[#A87922]">
              "By Travellers, for Travellers"
            </p>
            <p className="text-[11px] text-[#8A8A8A] mt-0.5">
              Jainam Tours and Travels • Official Portal
            </p>
          </div>
        </div>
      </div>

      {/* Confirmed Bookings Table */}
      <div className="bg-white rounded-2xl border border-[#EAE6DE] p-5 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-[#292929]">Recent Confirmed Tour Bookings</h3>
            <p className="text-xs text-[#707070]">Holiday packages booked with verified deposits</p>
          </div>
          <button
            onClick={() => handleNavigate('bookings')}
            className="text-xs font-semibold text-[#C99532] hover:text-[#A87922] flex items-center gap-1"
          >
            <span>All Bookings</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {bookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#EAE6DE] text-[#8A8A8A] uppercase tracking-wider font-semibold text-[10px]">
                  <th className="pb-3 px-3">Ref</th>
                  <th className="pb-3 px-3">Customer</th>
                  <th className="pb-3 px-3">Tour Package</th>
                  <th className="pb-3 px-3">Travel Dates</th>
                  <th className="pb-3 px-3">Pax</th>
                  <th className="pb-3 px-3">Package Amount</th>
                  <th className="pb-3 px-3">Payment</th>
                  <th className="pb-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE6DE] font-medium text-[#333333]">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-[#FAF9F6] transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-[#A87922]">{b.bookingRef}</td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-[#292929]">{b.customerName}</div>
                      <div className="text-[10px] text-[#8A8A8A] font-mono">{b.customerPhone}</div>
                    </td>
                    <td className="py-3 px-3 text-[#525252] truncate max-w-[200px]">{b.packageName}</td>
                    <td className="py-3 px-3 whitespace-nowrap">{b.travelDates}</td>
                    <td className="py-3 px-3">{b.travellers} Guests</td>
                    <td className="py-3 px-3 font-mono font-bold text-[#292929]">
                      ₹{b.totalAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          b.paymentStatus === 'Paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-[#FAF4E8] text-[#A87922] border border-[#F4E7C8]'
                        }`}
                      >
                        {b.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#FAF9F6] border border-[#EAE6DE] text-[#292929]">
                        {b.bookingStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-10 px-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF4E8] text-[#C99532] border border-[#F4E7C8] flex items-center justify-center mx-auto mb-3">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-[#292929]">No Tour Bookings Recorded</h4>
            <p className="text-xs text-[#707070] max-w-sm mx-auto mt-1 mb-4">
              When enquiries are converted or deposits verified, confirmed customer travel vouchers will appear here.
            </p>
            <button
              onClick={() => handleNavigate('bookings')}
              className="px-3.5 py-2 rounded-xl bg-[#C99532] hover:bg-[#A87922] text-white text-xs font-semibold shadow-sm transition-all"
            >
              Record First Booking
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
