import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../../context/AppContext';
import { Booking } from '../../types';
import {
  CalendarCheck,
  Search,
  Download,
  FileText,
  Printer,
  X,
  CreditCard,
  DollarSign,
  CheckCircle,
  Share2,
  Plus
} from 'lucide-react';

export const BookingsPage: React.FC = () => {
  const { bookings, recordBookingPayment, addToast, setActivePage } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Paid' | 'Partial' | 'Pending'>('all');
  const [selectedVoucher, setSelectedVoucher] = useState<Booking | null>(null);

  // Payment Recording Modal State
  const [paymentModalBooking, setPaymentModalBooking] = useState<Booking | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('Bank Transfer (IMPS/NEFT)');
  const [paymentRef, setPaymentRef] = useState<string>('');

  const filteredBookings = bookings.filter(b => {
    const matchesSearch =
      b.bookingRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.destination.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (statusFilter !== 'all' && b.paymentStatus !== statusFilter) return false;
    return true;
  });

  const handleExportCSV = () => {
    if (filteredBookings.length === 0) {
      addToast('No Data', 'No booking records to export.', 'warning');
      return;
    }

    const headers = ['Booking Ref', 'Customer Name', 'Phone', 'Package', 'Travel Dates', 'Total Amount', 'Paid Amount', 'Balance', 'Payment Status', 'Booking Status'];
    const rows = filteredBookings.map(b => [
      `"${b.bookingRef}"`,
      `"${b.customerName}"`,
      `"${b.customerPhone}"`,
      `"${b.packageName}"`,
      `"${b.travelDates}"`,
      b.totalAmount,
      b.paidAmount,
      b.totalAmount - b.paidAmount,
      `"${b.paymentStatus}"`,
      `"${b.bookingStatus}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `jainam_bookings_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('Export Complete', `Exported ${filteredBookings.length} booking records.`, 'success');
  };

  const handleRecordPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentModalBooking) return;
    const amount = Number(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      addToast('Invalid Amount', 'Please enter a valid positive payment amount.', 'error');
      return;
    }

    recordBookingPayment(paymentModalBooking.id, amount);
    setPaymentModalBooking(null);
    setPaymentAmount('');
    setPaymentRef('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#292929] tracking-tight">
            Confirmed Bookings & Reservations
          </h1>
          <p className="text-xs sm:text-sm text-[#707070] mt-1">
            Confirmed holiday bookings, advance deposits, payment records, and traveler confirmation vouchers.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 rounded-xl border border-[#EAE6DE] bg-white hover:bg-[#FAF9F6] text-[#292929] text-xs sm:text-sm font-semibold shadow-2xs flex items-center gap-2 transition self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-[#707070]" />
          <span>Export Bookings CSV</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#EAE6DE] shadow-2xs overflow-hidden">
        {/* Filter bar */}
        <div className="p-4 border-b border-[#EAE6DE] flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8A8A]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reference, traveler, destination..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-[#EAE6DE] bg-[#FAF9F6] text-xs text-[#292929] placeholder:text-[#8A8A8A] focus:outline-none focus:ring-1 focus:ring-[#C99532]"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs overflow-x-auto">
            {['all', 'Paid', 'Partial', 'Pending'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st as any)}
                className={`px-3 py-1 rounded-xl font-medium transition-colors whitespace-nowrap ${
                  statusFilter === st
                    ? 'bg-[#FAF4E8] text-[#A87922] font-bold border border-[#F4E7C8]'
                    : 'text-[#707070] hover:bg-[#FAF9F6]'
                }`}
              >
                {st === 'all' ? 'All Payments' : st}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#EAE6DE] bg-[#FAF9F6] text-[#8A8A8A] uppercase tracking-wider font-semibold text-[10px]">
                <th className="py-3 px-4">Booking Ref</th>
                <th className="py-3 px-3">Traveler</th>
                <th className="py-3 px-3">Package</th>
                <th className="py-3 px-3">Dates</th>
                <th className="py-3 px-3">Total (₹)</th>
                <th className="py-3 px-3">Paid (₹)</th>
                <th className="py-3 px-3">Balance (₹)</th>
                <th className="py-3 px-3">Payment</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE6DE] font-medium text-[#333333]">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((b) => {
                  const balance = Math.max(0, b.totalAmount - b.paidAmount);
                  return (
                    <tr key={b.id} className="hover:bg-[#FAF9F6] transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#A87922]">{b.bookingRef}</td>
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-[#292929]">{b.customerName}</div>
                        <div className="text-[10px] text-[#8A8A8A] font-mono">{b.customerPhone}</div>
                      </td>
                      <td className="py-3.5 px-3 text-[#525252] truncate max-w-[180px]">{b.packageName}</td>
                      <td className="py-3.5 px-3 whitespace-nowrap">{b.travelDates}</td>
                      <td className="py-3.5 px-3 font-mono font-bold text-[#292929]">₹{b.totalAmount.toLocaleString('en-IN')}</td>
                      <td className="py-3.5 px-3 font-mono text-emerald-700 font-semibold">₹{b.paidAmount.toLocaleString('en-IN')}</td>
                      <td className="py-3.5 px-3 font-mono text-[#707070]">₹{balance.toLocaleString('en-IN')}</td>
                      <td className="py-3.5 px-3">
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
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#FAF9F6] border border-[#EAE6DE] text-[#292929]">
                          {b.bookingStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {balance > 0 && (
                            <button
                              onClick={() => {
                                setPaymentModalBooking(b);
                                setPaymentAmount(String(balance));
                              }}
                              className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center gap-1"
                              title="Record Payment Receipt"
                            >
                              <CreditCard className="w-3.5 h-3.5" />
                              <span>Pay</span>
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedVoucher(b)}
                            className="px-2.5 py-1 rounded-lg bg-[#FAF4E8] hover:bg-[#F4E7C8] text-[#A87922] text-xs font-semibold flex items-center gap-1 transition border border-[#F4E7C8]"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Voucher</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={10} className="py-12 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-[#FAF4E8] text-[#C99532] border border-[#F4E7C8] flex items-center justify-center mx-auto mb-3">
                      <CalendarCheck className="w-6 h-6" />
                    </div>
                    <div className="text-sm font-bold text-[#292929]">No Bookings Found</div>
                    <p className="text-xs text-[#707070] max-w-sm mx-auto mt-1 mb-4">
                      {statusFilter !== 'all' || searchQuery
                        ? 'No bookings match your current filter selection.'
                        : 'No travel bookings have been recorded yet. Convert an active lead or create a custom tour package.'}
                    </p>
                    <button
                      onClick={() => setActivePage('leads')}
                      className="px-4 py-2 rounded-xl bg-[#C99532] hover:bg-[#A87922] text-white text-xs font-semibold shadow-sm inline-flex items-center gap-1.5 transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>View Leads & Enquiries</span>
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      {paymentModalBooking && createPortal(
        <div
          onClick={() => setPaymentModalBooking(null)}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-2xl border border-[#EAE6DE] p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between border-b border-[#EAE6DE] pb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#C99532]" />
                <h3 className="text-sm font-bold text-[#292929]">Record Payment Receipt</h3>
              </div>
              <button onClick={() => setPaymentModalBooking(null)} className="text-[#8A8A8A] hover:text-[#292929]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-[#FAF9F6] border border-[#EAE6DE] text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-[#707070]">Booking Ref:</span>
                <span className="font-mono font-bold text-[#A87922]">{paymentModalBooking.bookingRef}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#707070]">Traveler:</span>
                <strong className="text-[#292929]">{paymentModalBooking.customerName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#707070]">Balance Remaining:</span>
                <span className="font-mono font-bold text-rose-700">
                  ₹{(paymentModalBooking.totalAmount - paymentModalBooking.paidAmount).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <form onSubmit={handleRecordPaymentSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-[#707070] mb-1">Payment Amount (₹)</label>
                <input
                  type="number"
                  required
                  min="1"
                  max={paymentModalBooking.totalAmount - paymentModalBooking.paidAmount}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE6DE] bg-white text-xs font-mono font-bold text-[#292929] focus:outline-none focus:ring-1 focus:ring-[#C99532]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#707070] mb-1">Payment Mode</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE6DE] bg-white text-xs font-semibold text-[#292929] focus:outline-none"
                >
                  <option value="Bank Transfer (IMPS/NEFT)">Bank Transfer (IMPS/NEFT)</option>
                  <option value="UPI / QR Code">UPI / QR Code</option>
                  <option value="Credit / Debit Card">Credit / Debit Card</option>
                  <option value="Cheque">Cheque</option>
                  <option value="Cash Deposit">Cash Deposit</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#707070] mb-1">Transaction Reference / UTR</label>
                <input
                  type="text"
                  placeholder="e.g. UTR-982012345678"
                  value={paymentRef}
                  onChange={(e) => setPaymentRef(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE6DE] bg-white text-xs font-mono text-[#292929] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#EAE6DE]">
                <button
                  type="button"
                  onClick={() => setPaymentModalBooking(null)}
                  className="px-3.5 py-1.5 rounded-xl border border-[#EAE6DE] text-xs font-semibold text-[#292929] hover:bg-[#FAF9F6]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-[#C99532] hover:bg-[#A87922] text-xs font-semibold text-white shadow-xs"
                >
                  Confirm & Update Balance
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Official Voucher Letterhead Modal */}
      {selectedVoucher && createPortal(
        <div
          onClick={() => setSelectedVoucher(null)}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-[#EAE6DE] overflow-hidden p-6 space-y-4 animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between border-b border-[#EAE6DE] pb-3">
              <div className="flex items-center gap-3">
                <img src="/jainam-logo.png" alt="Jainam Tours" className="h-10 w-auto object-contain" />
                <div>
                  <h3 className="text-sm font-bold text-[#292929]">Jainam Tours and Travels</h3>
                  <p className="text-[10px] text-[#A87922] font-semibold italic">"By Travellers, for Travellers"</p>
                </div>
              </div>
              <button onClick={() => setSelectedVoucher(null)} className="p-1 text-[#8A8A8A] hover:text-[#292929]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="border border-[#EAE6DE] rounded-xl p-4 bg-[#FAF9F6] text-xs space-y-3">
              <div className="flex justify-between items-center border-b border-[#EAE6DE] pb-2">
                <div>
                  <span className="text-[10px] text-[#8A8A8A] uppercase font-bold block">CONFIRMATION SLIP</span>
                  <span className="font-mono font-bold text-[#A87922] text-sm">{selectedVoucher.bookingRef}</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {selectedVoucher.bookingStatus}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[#707070] text-[11px] block">Lead Passenger:</span>
                  <strong className="text-[#292929]">{selectedVoucher.customerName}</strong>
                  <div className="text-[10px] font-mono text-[#8A8A8A]">{selectedVoucher.customerPhone}</div>
                </div>
                <div>
                  <span className="text-[#707070] text-[11px] block">Tour Package:</span>
                  <strong className="text-[#292929]">{selectedVoucher.packageName}</strong>
                </div>
                <div>
                  <span className="text-[#707070] text-[11px] block">Travel Dates:</span>
                  <span className="font-semibold text-[#292929]">{selectedVoucher.travelDates}</span>
                </div>
                <div>
                  <span className="text-[#707070] text-[11px] block">Total Travelers:</span>
                  <span className="font-semibold text-[#292929]">{selectedVoucher.travellers} Guests</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#EAE6DE] flex justify-between items-center font-mono">
                <div>
                  <span className="text-[10px] text-[#707070] block">Total Package Cost</span>
                  <strong className="text-sm text-[#292929]">₹{selectedVoucher.totalAmount.toLocaleString('en-IN')}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-[#707070] block">Paid to Date</span>
                  <strong className="text-sm text-emerald-700">₹{selectedVoucher.paidAmount.toLocaleString('en-IN')}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-[#707070] block">Balance</span>
                  <strong className="text-sm text-[#A87922]">
                    ₹{(selectedVoucher.totalAmount - selectedVoucher.paidAmount).toLocaleString('en-IN')}
                  </strong>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-white border border-[#EAE6DE] text-[10px] text-[#525252] space-y-1">
                <span className="font-bold text-[#A87922] block">Special Dining & Assurance Guarantee:</span>
                <p>
                  100% Pure Vegetarian & authentic Jain meals (strictly without onion, garlic, or root vegetables) arranged throughout the holiday duration.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex-1 py-2 px-4 rounded-xl border border-[#EAE6DE] text-xs font-semibold text-[#292929] hover:bg-[#FAF9F6] flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Slip</span>
              </button>
              <button
                onClick={() => {
                  addToast('Dispatched', `Travel voucher dispatched to ${selectedVoucher.customerPhone} on WhatsApp.`, 'success');
                  setSelectedVoucher(null);
                }}
                className="flex-1 py-2 px-4 rounded-xl bg-[#C99532] hover:bg-[#A87922] text-white text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share on WhatsApp</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
