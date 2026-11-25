import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../../context/AppContext';
import { Customer, LeadStatus } from '../../types';
import {
  Users,
  Search,
  Plus,
  Eye,
  MessageSquare,
  MapPin,
  Download,
  Upload,
  Trash2,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { AddCustomerModal } from '../modals/AddCustomerModal';
import { CustomerDetailDrawer } from '../modals/CustomerDetailDrawer';

export const CustomersPage: React.FC = () => {
  const {
    customers,
    addCustomer,
    deleteCustomer,
    convertLeadToBooking,
    selectedCustomer,
    setSelectedCustomer,
    setActivePage,
    addToast
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | LeadStatus>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importText, setImportText] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleOpenDetail = (cust: Customer) => {
    setSelectedCustomer(cust);
    setIsDetailDrawerOpen(true);
  };

  const filteredCustomers = customers.filter(c => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.whatsappNumber.includes(searchQuery) ||
      c.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.assignedEmployee.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (statusFilter !== 'all' && c.leadStatus !== statusFilter) return false;
    return true;
  });

  const totalPages = Math.ceil(filteredCustomers.length / pageSize) || 1;
  const paginatedCustomers = filteredCustomers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleExportCSV = () => {
    if (filteredCustomers.length === 0) {
      addToast('No Data', 'No customer records to export.', 'warning');
      return;
    }

    const headers = ['Customer ID', 'Name', 'Phone', 'Email', 'Destination', 'Travel Dates', 'Guests', 'Budget', 'Lead Status', 'Assigned Consultant'];
    const rows = filteredCustomers.map(c => [
      `"${c.id}"`,
      `"${c.name}"`,
      `"${c.whatsappNumber}"`,
      `"${c.email}"`,
      `"${c.destination}"`,
      `"${c.travelDate}"`,
      c.travellers,
      c.budget,
      `"${c.leadStatus}"`,
      `"${c.assignedEmployee}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `jainam_tours_customers_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('Export Complete', `Exported ${filteredCustomers.length} customer records to CSV.`, 'success');
  };

  const handleImportCSV = () => {
    if (!importText.trim()) return;
    const lines = importText.trim().split('\n');
    let importedCount = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line || (i === 0 && line.toLowerCase().includes('name'))) continue; // skip header

      const parts = line.split(',').map(p => p.replace(/^"|"$/g, '').trim());
      if (parts.length >= 2) {
        const [name, phone, email, dest, travelDate, travellers, budget] = parts;
        addCustomer({
          name: name || 'New Client',
          whatsappNumber: phone || '+91 98000 00000',
          email: email || '',
          destination: dest || 'Kashmir',
          travelDate: travelDate || 'May 2026',
          travellers: parseInt(travellers || '2', 10) || 2,
          budget: parseInt(budget || '50000', 10) || 50000,
          leadStatus: 'New Enquiry',
          assignedEmployee: 'Jainam Shah',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          lastConversation: 'Imported via CSV'
        });
        importedCount++;
      }
    }

    setIsImportModalOpen(false);
    setImportText('');
    addToast('Import Successful', `Successfully imported ${importedCount} client records.`, 'success');
  };

  const handleDelete = (id: string) => {
    deleteCustomer(id);
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#292929] tracking-tight">
            Customer Directory & CRM
          </h1>
          <p className="text-xs sm:text-sm text-[#707070] mt-1">
            Registered travelers, WhatsApp communication history, holiday preferences, and assigned consultants.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportCSV}
            className="px-3 py-2 rounded-xl border border-[#EAE6DE] bg-white hover:bg-[#FAF9F6] text-[#292929] text-xs font-semibold flex items-center gap-1.5 transition"
            title="Download CSV"
          >
            <Download className="w-3.5 h-3.5 text-[#707070]" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setIsImportModalOpen(true)}
            className="px-3 py-2 rounded-xl border border-[#EAE6DE] bg-white hover:bg-[#FAF9F6] text-[#292929] text-xs font-semibold flex items-center gap-1.5 transition"
            title="Import Customers from CSV"
          >
            <Upload className="w-3.5 h-3.5 text-[#707070]" />
            <span>Import CSV</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#C99532] hover:bg-[#A87922] text-white text-xs sm:text-sm font-semibold shadow-sm flex items-center justify-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-[#EAE6DE] shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8A8A]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by customer name, phone, destination..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#EAE6DE] bg-[#FAF9F6] text-xs text-[#292929] placeholder:text-[#8A8A8A] focus:outline-none focus:ring-1 focus:ring-[#C99532]"
          />
        </div>

        <div className="flex items-center gap-1 text-xs overflow-x-auto pb-1 md:pb-0">
          {['all', 'New Enquiry', 'Proposal Sent', 'Negotiation', 'Confirmed'].map((st) => (
            <button
              key={st}
              onClick={() => {
                setStatusFilter(st as any);
                setCurrentPage(1);
              }}
              className={`px-2.5 py-1.5 rounded-xl font-medium transition-colors whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-[#FAF4E8] text-[#A87922] font-bold border border-[#F4E7C8]'
                  : 'text-[#707070] hover:bg-[#FAF9F6]'
              }`}
            >
              {st === 'all' ? 'All Customers' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Customer Data Table */}
      <div className="bg-white rounded-2xl border border-[#EAE6DE] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#EAE6DE] bg-[#FAF9F6] text-[#8A8A8A] uppercase tracking-wider font-semibold text-[10px]">
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-3">WhatsApp Number</th>
                <th className="py-3 px-3">Destination</th>
                <th className="py-3 px-3">Travel Date</th>
                <th className="py-3 px-3">Pax</th>
                <th className="py-3 px-3">Budget</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Last Active</th>
                <th className="py-3 px-3">Consultant</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE6DE] font-medium text-[#333333]">
              {paginatedCustomers.length > 0 ? (
                paginatedCustomers.map((cust) => (
                  <tr
                    key={cust.id}
                    onClick={() => handleOpenDetail(cust)}
                    className="hover:bg-[#FAF9F6] cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={cust.avatar}
                          alt={cust.name}
                          className="w-9 h-9 rounded-full object-cover border border-[#EAE6DE]"
                        />
                        <div>
                          <div className="font-bold text-[#292929]">{cust.name}</div>
                          <div className="text-[10px] text-[#8A8A8A]">{cust.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono font-semibold text-[#525252]">
                      {cust.whatsappNumber}
                    </td>
                    <td className="py-3 px-3 text-[#292929]">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#C99532]" />
                        {cust.destination}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[#525252] whitespace-nowrap">{cust.travelDate}</td>
                    <td className="py-3 px-3">{cust.travellers} Guests</td>
                    <td className="py-3 px-3 font-mono font-bold text-[#292929]">₹{cust.budget.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          cust.leadStatus === 'Confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-[#FAF4E8] text-[#A87922] border border-[#F4E7C8]'
                        }`}
                      >
                        {cust.leadStatus}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[#8A8A8A] text-[11px]">{cust.lastConversation}</td>
                    <td className="py-3 px-3 text-[#525252]">{cust.assignedEmployee}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleOpenDetail(cust)}
                          className="p-1.5 text-[#8A8A8A] hover:text-[#C99532] rounded-lg hover:bg-white"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setActivePage('inbox')}
                          className="p-1.5 text-[#8A8A8A] hover:text-[#292929] rounded-lg hover:bg-white"
                          title="Open WhatsApp Chat"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                        {cust.leadStatus !== 'Confirmed' && (
                          <button
                            onClick={() => convertLeadToBooking(cust.id)}
                            className="p-1.5 text-[#8A8A8A] hover:text-emerald-700 rounded-lg hover:bg-white"
                            title="Convert to Confirmed Booking"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => setDeleteConfirmId(cust.id)}
                          className="p-1.5 text-[#8A8A8A] hover:text-rose-600 rounded-lg hover:bg-white"
                          title="Delete Customer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="py-12 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-[#FAF4E8] text-[#C99532] border border-[#F4E7C8] flex items-center justify-center mx-auto mb-3">
                      <Users className="w-6 h-6" />
                    </div>
                    <div className="text-sm font-bold text-[#292929]">No Customers Found</div>
                    <p className="text-xs text-[#707070] max-w-sm mx-auto mt-1 mb-4">
                      {searchQuery || statusFilter !== 'all'
                        ? 'No clients match your filter criteria. Try clearing search filters.'
                        : 'Your customer registry is currently empty. Add your first travel client or import a CSV list.'}
                    </p>
                    <button
                      onClick={() => setIsAddModalOpen(true)}
                      className="px-4 py-2 rounded-xl bg-[#C99532] hover:bg-[#A87922] text-white text-xs font-semibold shadow-sm inline-flex items-center gap-1.5 transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add First Customer</span>
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-3.5 border-t border-[#EAE6DE] bg-[#FAF9F6] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#707070]">
          <div className="flex items-center gap-2">
            <span>Showing</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 py-1 rounded-lg border border-[#EAE6DE] bg-white text-xs font-semibold text-[#292929] focus:outline-none"
            >
              <option value={10}>10 records</option>
              <option value={25}>25 records</option>
              <option value={50}>50 records</option>
            </select>
            <span>of {filteredCustomers.length} total customers</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="p-1.5 rounded-lg border border-[#EAE6DE] bg-white text-[#292929] hover:bg-[#FAF9F6] disabled:opacity-40 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 font-semibold text-[#292929]">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="p-1.5 rounded-lg border border-[#EAE6DE] bg-white text-[#292929] hover:bg-[#FAF9F6] disabled:opacity-40 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && createPortal(
        <div
          onClick={() => setDeleteConfirmId(null)}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-white rounded-2xl border border-[#EAE6DE] p-5 shadow-2xl text-center space-y-4 animate-in zoom-in-95 duration-150"
          >
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#292929]">Delete Customer Record?</h3>
              <p className="text-xs text-[#707070] mt-1">
                This will delete the customer and lead pipeline entry from Jainam Tours records.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2 rounded-xl border border-[#EAE6DE] text-xs font-semibold text-[#292929] hover:bg-[#FAF9F6]"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-semibold text-white shadow-xs"
              >
                Delete
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* CSV Import Modal */}
      {isImportModalOpen && createPortal(
        <div
          onClick={() => setIsImportModalOpen(false)}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white rounded-2xl border border-[#EAE6DE] p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between border-b border-[#EAE6DE] pb-3">
              <h3 className="text-sm font-bold text-[#292929]">Import Customers via CSV</h3>
              <button onClick={() => setIsImportModalOpen(false)} className="text-[#8A8A8A] hover:text-[#292929] text-xs">
                ✕
              </button>
            </div>

            <p className="text-xs text-[#707070]">
              Paste comma-separated rows. Expected format:
              <br />
              <code className="text-[10px] bg-[#FAF9F6] p-1 rounded font-mono text-[#292929] block mt-1">
                Name, Phone, Email, Destination, Travel Dates, Guests, Budget
              </code>
            </p>

            <textarea
              rows={6}
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder={`Bhavin Doshi, +91 98205 11223, bhavin@doshi.com, Kashmir, June 2026, 4, 180000\nMeera Shah, +91 98210 99887, meera@shah.com, Swiss Alps, July 2026, 2, 350000`}
              className="w-full p-3 rounded-xl border border-[#EAE6DE] bg-[#FAF9F6] text-xs font-mono text-[#292929] focus:outline-none focus:ring-1 focus:ring-[#C99532]"
            />

            <div className="flex justify-end gap-2 pt-2 border-t border-[#EAE6DE]">
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="px-3.5 py-1.5 rounded-xl border border-[#EAE6DE] text-xs font-semibold text-[#292929] hover:bg-[#FAF9F6]"
              >
                Cancel
              </button>
              <button
                onClick={handleImportCSV}
                disabled={!importText.trim()}
                className="px-4 py-1.5 rounded-xl bg-[#C99532] hover:bg-[#A87922] disabled:opacity-50 text-xs font-semibold text-white shadow-xs"
              >
                Import Records
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      <AddCustomerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={addCustomer}
      />

      <CustomerDetailDrawer
        customer={selectedCustomer}
        isOpen={isDetailDrawerOpen}
        onClose={() => setIsDetailDrawerOpen(false)}
      />
    </div>
  );
};
