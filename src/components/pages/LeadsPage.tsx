import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LeadStatus, Customer } from '../../types';
import {
  Compass,
  MapPin,
  ArrowRight,
  Kanban,
  List,
  CheckCircle,
  FileText,
  Filter,
  Plus
} from 'lucide-react';

export const LeadsPage: React.FC = () => {
  const { customers, updateCustomer, convertLeadToBooking, setActivePage, setSelectedCustomer, addToast } = useApp();
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [filterDestination, setFilterDestination] = useState<string>('all');

  const stages: LeadStatus[] = [
    'New Enquiry',
    'Contacted',
    'Proposal Sent',
    'Negotiation',
    'Confirmed',
    'Lost'
  ];

  const handleAdvanceStage = (cust: Customer) => {
    const currentIndex = stages.indexOf(cust.leadStatus);
    if (currentIndex < stages.length - 2) {
      const nextStage = stages[currentIndex + 1];
      updateCustomer(cust.id, { leadStatus: nextStage });
      addToast('Stage Advanced', `${cust.name} moved to ${nextStage}.`, 'info');
    }
  };

  const handleSetStage = (cust: Customer, nextStage: LeadStatus) => {
    updateCustomer(cust.id, { leadStatus: nextStage });
    addToast('Stage Updated', `${cust.name} set to ${nextStage}.`, 'info');
  };

  const filteredCustomers = customers.filter(c => {
    if (filterDestination !== 'all' && !c.destination.toLowerCase().includes(filterDestination.toLowerCase())) {
      return false;
    }
    return true;
  });

  const totalPipelineValue = filteredCustomers.reduce((sum, c) => sum + c.budget, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#292929] tracking-tight">
            Enquiries & Leads Pipeline
          </h1>
          <p className="text-xs sm:text-sm text-[#707070] mt-1">
            Track customer enquiries from initial WhatsApp contact through custom quotation and booking confirmation.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="px-3 py-1.5 rounded-xl bg-white border border-[#EAE6DE] text-xs shadow-2xs font-semibold">
            Pipeline Value: <strong className="text-[#A87922] font-mono">₹{totalPipelineValue.toLocaleString('en-IN')}</strong>
          </div>

          {/* Destination Filter */}
          <select
            value={filterDestination}
            onChange={(e) => setFilterDestination(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl border border-[#EAE6DE] bg-white text-xs font-semibold text-[#292929] focus:outline-none"
          >
            <option value="all">All Destinations</option>
            <option value="Kashmir">Kashmir</option>
            <option value="Swiss">Switzerland</option>
            <option value="Dubai">Dubai</option>
            <option value="Bali">Bali</option>
          </select>

          <div className="flex items-center border border-[#EAE6DE] rounded-xl p-0.5 bg-[#FAF9F6]">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'kanban' ? 'bg-white shadow-2xs text-[#C99532]' : 'text-[#8A8A8A]'}`}
              title="Kanban Board"
            >
              <Kanban className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-white shadow-2xs text-[#C99532]' : 'text-[#8A8A8A]'}`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 overflow-x-auto pb-4">
          {stages.map((stage) => {
            const stageLeads = filteredCustomers.filter(c => c.leadStatus === stage);
            const stageTotal = stageLeads.reduce((sum, c) => sum + c.budget, 0);

            return (
              <div key={stage} className="bg-[#FAF9F6] rounded-2xl p-3 border border-[#EAE6DE] flex flex-col min-w-[210px]">
                <div className="flex items-center justify-between mb-1 px-1">
                  <span className="text-xs font-bold text-[#292929]">{stage}</span>
                  <span className="w-5 h-5 rounded-full bg-white text-[#525252] text-[10px] font-bold flex items-center justify-center border border-[#EAE6DE]">
                    {stageLeads.length}
                  </span>
                </div>
                <div className="text-[10px] text-[#A87922] font-mono font-semibold px-1 mb-2">
                  ₹{stageTotal.toLocaleString('en-IN')}
                </div>

                <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[calc(100vh-18rem)]">
                  {stageLeads.map((lead) => (
                    <div
                      key={lead.id}
                      onClick={() => {
                        setSelectedCustomer(lead);
                        setActivePage('customers');
                      }}
                      className="p-3 bg-white rounded-xl border border-[#EAE6DE] shadow-2xs hover:shadow-card hover:border-[#C99532] cursor-pointer transition-all space-y-2"
                    >
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-xs font-bold text-[#292929] leading-tight">{lead.name}</h4>
                        <select
                          value={lead.leadStatus}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => handleSetStage(lead, e.target.value as LeadStatus)}
                          className="text-[9px] font-semibold text-[#A87922] bg-[#FAF4E8] rounded px-1 py-0.5 border border-[#F4E7C8] focus:outline-none"
                        >
                          {stages.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>

                      <div className="text-[11px] text-[#707070] space-y-1">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#C99532]" />
                          <span className="truncate">{lead.destination}</span>
                        </div>
                        <div className="flex items-center justify-between font-mono">
                          <span className="font-bold text-[#292929]">₹{lead.budget.toLocaleString('en-IN')}</span>
                          <span className="text-[10px] text-[#8A8A8A] font-sans">{lead.travellers} Pax</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#EAE6DE] flex items-center justify-between text-[10px]">
                        <span className="text-[#8A8A8A]">{lead.assignedEmployee.split(' ')[0]}</span>
                        <div className="flex items-center gap-1">
                          {lead.leadStatus !== 'Confirmed' && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                convertLeadToBooking(lead.id);
                              }}
                              className="p-1 text-emerald-700 hover:text-emerald-900 rounded bg-emerald-50 border border-emerald-200"
                              title="Convert to Confirmed Booking"
                            >
                              <CheckCircle className="w-3 h-3" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAdvanceStage(lead);
                            }}
                            className="p-1 text-[#8A8A8A] hover:text-[#C99532] rounded"
                            title="Advance Stage"
                          >
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {stageLeads.length === 0 && (
                    <div className="p-4 text-center text-[#8A8A8A] text-xs border border-dashed border-[#EAE6DE] rounded-xl bg-white/50">
                      No enquiries
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#EAE6DE] shadow-2xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#EAE6DE] bg-[#FAF9F6] text-[#8A8A8A] uppercase tracking-wider font-semibold text-[10px]">
                <th className="py-3 px-4">Lead Name</th>
                <th className="py-3 px-3">WhatsApp</th>
                <th className="py-3 px-3">Destination</th>
                <th className="py-3 px-3">Estimated Budget</th>
                <th className="py-3 px-3">Stage</th>
                <th className="py-3 px-3">Consultant</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE6DE] font-medium text-[#333333]">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-[#FAF9F6] transition-colors">
                    <td className="py-3 px-4 font-bold text-[#292929]">{c.name}</td>
                    <td className="py-3 px-3 font-mono text-[#525252]">{c.whatsappNumber}</td>
                    <td className="py-3 px-3">{c.destination}</td>
                    <td className="py-3 px-3 font-mono font-bold text-[#292929]">₹{c.budget.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FAF4E8] text-[#A87922] border border-[#F4E7C8]">
                        {c.leadStatus}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[#525252]">{c.assignedEmployee}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {c.leadStatus !== 'Confirmed' && (
                          <button
                            onClick={() => convertLeadToBooking(c.id)}
                            className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-[11px] font-semibold flex items-center gap-1"
                          >
                            <CheckCircle className="w-3 h-3" />
                            <span>Convert</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleAdvanceStage(c)}
                          className="px-2.5 py-1 rounded-lg border border-[#EAE6DE] bg-white text-[#292929] hover:bg-[#FAF9F6] text-[11px] font-semibold"
                        >
                          Advance
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-[#FAF4E8] text-[#C99532] border border-[#F4E7C8] flex items-center justify-center mx-auto mb-3">
                      <Compass className="w-6 h-6" />
                    </div>
                    <div className="text-sm font-bold text-[#292929]">No Leads in Pipeline</div>
                    <p className="text-xs text-[#707070] max-w-sm mx-auto mt-1 mb-4">
                      When new enquiries arrive from WhatsApp or are created manually, they appear here.
                    </p>
                    <button
                      onClick={() => setActivePage('customers')}
                      className="px-4 py-2 rounded-xl bg-[#C99532] hover:bg-[#A87922] text-white text-xs font-semibold shadow-sm inline-flex items-center gap-1.5 transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Create New Lead</span>
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
