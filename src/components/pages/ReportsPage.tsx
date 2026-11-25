import React, { useState } from 'react';
import { BarChart3, TrendingUp, Users, DollarSign, MessageSquare, Clock, Download, FileSpreadsheet, Calendar } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ReportsPage: React.FC = () => {
  const { bookings, customers, addToast } = useApp();
  const [timeFilter, setTimeFilter] = useState<'month' | 'quarter' | 'year'>('quarter');

  const totalBookingRevenue = bookings.reduce((sum, b) => sum + b.totalAmount, 0) || 48290000;
  const totalPaidRevenue = bookings.reduce((sum, b) => sum + b.paidAmount, 0) || 39500000;

  const downloadCSV = (filename: string, headers: string[], rows: (string | number)[][]) => {
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Report Exported', `Downloaded ${filename}.`, 'success');
  };

  const exportRevenueReport = () => {
    const headers = ['Ref', 'Customer', 'Destination', 'Travel Dates', 'Total Cost', 'Paid', 'Payment Status'];
    const rows = bookings.map(b => [
      `"${b.bookingRef}"`,
      `"${b.customerName}"`,
      `"${b.destination}"`,
      `"${b.travelDates}"`,
      b.totalAmount,
      b.paidAmount,
      `"${b.paymentStatus}"`
    ]);
    downloadCSV(`jainam_tours_revenue_report_${new Date().toISOString().slice(0, 10)}.csv`, headers, rows);
  };

  const exportLeadReport = () => {
    const headers = ['Customer Name', 'Phone', 'Destination', 'Estimated Budget', 'Stage', 'Assigned Consultant'];
    const rows = customers.map(c => [
      `"${c.name}"`,
      `"${c.whatsappNumber}"`,
      `"${c.destination}"`,
      c.budget,
      `"${c.leadStatus}"`,
      `"${c.assignedEmployee}"`
    ]);
    downloadCSV(`jainam_tours_leads_report_${new Date().toISOString().slice(0, 10)}.csv`, headers, rows);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#292929] tracking-tight">
            Business Reports & Analytics
          </h1>
          <p className="text-xs sm:text-sm text-[#707070] mt-1">
            Booking revenue (₹), popular holiday destinations, consultant performance, and customer response metrics.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Time Filter */}
          <div className="flex items-center border border-[#EAE6DE] rounded-xl p-0.5 bg-white text-xs font-semibold">
            {(['month', 'quarter', 'year'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTimeFilter(t)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-colors ${
                  timeFilter === t ? 'bg-[#FAF4E8] text-[#A87922] font-bold border border-[#F4E7C8]' : 'text-[#707070]'
                }`}
              >
                This {t}
              </button>
            ))}
          </div>

          <button
            onClick={exportRevenueReport}
            className="px-3.5 py-2 rounded-xl bg-[#C99532] hover:bg-[#A87922] text-white text-xs sm:text-sm font-semibold shadow-xs flex items-center gap-1.5 transition"
          >
            <Download className="w-4 h-4" />
            <span>Export Revenue CSV</span>
          </button>
        </div>
      </div>

      {/* Top Metric Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-[#EAE6DE] shadow-2xs">
          <span className="text-xs text-[#707070] font-semibold">Gross Booking Value</span>
          <div className="text-2xl font-extrabold text-[#292929] font-mono mt-1">
            ₹{totalBookingRevenue.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-[#A87922] font-bold">+24.5% vs Last Period</span>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-[#EAE6DE] shadow-2xs">
          <span className="text-xs text-[#707070] font-semibold">Collected Advance Revenue</span>
          <div className="text-2xl font-extrabold text-emerald-800 font-mono mt-1">
            ₹{totalPaidRevenue.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-emerald-700 font-bold">Verified Bank Deposits</span>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-[#EAE6DE] shadow-2xs">
          <span className="text-xs text-[#707070] font-semibold">Instant Response Rate</span>
          <div className="text-2xl font-extrabold text-[#292929] font-mono mt-1">94.2%</div>
          <span className="text-[11px] text-[#707070] font-medium">Under 2 minutes</span>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-[#EAE6DE] shadow-2xs">
          <span className="text-xs text-[#707070] font-semibold">Average Response Time</span>
          <div className="text-2xl font-extrabold text-[#C99532] font-mono mt-1">1.8s</div>
          <span className="text-[11px] text-[#A87922] font-bold">Automated Greeting</span>
        </div>
      </div>

      {/* Visual Analytics Chart Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-[#EAE6DE] p-5 shadow-2xs space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-[#292929]">Destination Demand Breakdown</h3>
            <button
              onClick={exportLeadReport}
              className="text-xs font-semibold text-[#C99532] hover:text-[#A87922] flex items-center gap-1"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Export Leads CSV</span>
            </button>
          </div>

          <div className="space-y-3 pt-2">
            {[
              { name: 'Kashmir & Dal Lake Luxury Houseboat', percent: 36, count: '142 inquiries', color: 'bg-[#C99532]' },
              { name: 'Swiss Alps & Scenic Rail Express', percent: 28, count: '110 inquiries', color: 'bg-[#A87922]' },
              { name: 'Bali Romantic Private Pool Villas', percent: 22, count: '86 inquiries', color: 'bg-[#C99532]/70' },
              { name: 'Dubai Luxury Desert & Skyline', percent: 14, count: '55 inquiries', color: 'bg-[#EAE6DE]' }
            ].map((d, i) => (
              <div key={i} className="text-xs">
                <div className="flex justify-between mb-1 font-semibold">
                  <span className="text-[#292929]">{d.name}</span>
                  <span className="text-[#707070] font-mono">{d.count} ({d.percent}%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#FAF9F6] border border-[#EAE6DE] overflow-hidden">
                  <div className={`h-full ${d.color} rounded-full`} style={{ width: `${d.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#EAE6DE] p-5 shadow-2xs space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-[#292929]">Consultant Booking Rates</h3>
            <span className="text-xs text-[#707070]">Lead to confirmation conversion</span>
          </div>

          <div className="space-y-3 pt-2">
            {[
              { agent: 'Pooja Parekh', rate: 58.4, bookings: '34 bookings' },
              { agent: 'Chirag Mehta', rate: 49.2, bookings: '27 bookings' },
              { agent: 'Ritu Sharma', rate: 44.0, bookings: '21 bookings' },
              { agent: 'Jainam Shah', rate: 64.5, bookings: '42 bookings (VIP)' }
            ].map((a, i) => (
              <div key={i} className="text-xs">
                <div className="flex justify-between mb-1 font-semibold">
                  <span className="text-[#292929]">{a.agent}</span>
                  <span className="text-[#A87922] font-mono">{a.rate}% ({a.bookings})</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#FAF9F6] border border-[#EAE6DE] overflow-hidden">
                  <div className="h-full bg-[#C99532] rounded-full" style={{ width: `${a.rate}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
