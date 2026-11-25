import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, MessageSquare, Calendar as CalendarIcon, List, CalendarCheck, Plus, X, Clock, AlertCircle } from 'lucide-react';

export const FollowUpsPage: React.FC = () => {
  const { followups, toggleFollowUpComplete, addFollowUp, setActivePage, addToast } = useApp();
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'high'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Follow-Up Form State
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerPhone, setNewCustomerPhone] = useState('');
  const [newDestination, setNewDestination] = useState('Kashmir');
  const [newDueDate, setNewDueDate] = useState(new Date().toISOString().slice(0, 10));
  const [newDueTime, setNewDueTime] = useState('11:00 AM');
  const [newReason, setNewReason] = useState('');
  const [newPriority, setNewPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');

  const filteredFollowups = followups.filter(f => {
    if (filter === 'pending') return !f.isCompleted;
    if (filter === 'completed') return f.isCompleted;
    if (filter === 'high') return f.priority === 'High' && !f.isCompleted;
    return true;
  });

  const handleCreateFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerName.trim() || !newReason.trim()) return;

    addFollowUp({
      customerId: 'cust-' + Date.now(),
      customerName: newCustomerName,
      customerPhone: newCustomerPhone || '+91 98000 00000',
      destination: newDestination,
      dueDate: newDueDate,
      dueTime: newDueTime,
      reason: newReason,
      priority: newPriority,
      assignedTo: 'Jainam Shah'
    });

    setIsAddModalOpen(false);
    setNewCustomerName('');
    setNewCustomerPhone('');
    setNewReason('');
  };

  // Group followups by date for calendar view
  const dateGroups: Record<string, typeof followups> = {};
  followups.forEach(f => {
    if (!dateGroups[f.dueDate]) {
      dateGroups[f.dueDate] = [];
    }
    dateGroups[f.dueDate].push(f);
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#292929] tracking-tight">
            Customer Follow-up Schedule
          </h1>
          <p className="text-xs sm:text-sm text-[#707070] mt-1">
            Reminders for quotation check-ins, visa appointments, advance balance collections, and special requests.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center border border-[#EAE6DE] rounded-xl p-0.5 bg-[#FAF9F6]">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white shadow-2xs text-[#C99532]' : 'text-[#8A8A8A]'}`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'calendar' ? 'bg-white shadow-2xs text-[#C99532]' : 'text-[#8A8A8A]'}`}
              title="Calendar Group View"
            >
              <CalendarIcon className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#C99532] hover:bg-[#A87922] text-white text-xs sm:text-sm font-semibold shadow-xs flex items-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Reminder</span>
          </button>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-1.5 text-xs overflow-x-auto">
        {[
          { id: 'all', label: 'All Tasks' },
          { id: 'pending', label: 'Pending Action' },
          { id: 'high', label: 'High Priority' },
          { id: 'completed', label: 'Completed' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setFilter(t.id as any)}
            className={`px-3 py-1.5 rounded-xl font-medium transition-colors whitespace-nowrap ${
              filter === t.id
                ? 'bg-[#FAF4E8] text-[#A87922] font-bold border border-[#F4E7C8]'
                : 'bg-white text-[#707070] hover:bg-[#FAF9F6] border border-[#EAE6DE]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {viewMode === 'list' ? (
        <div className="space-y-3">
          {filteredFollowups.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                item.isCompleted
                  ? 'bg-[#FAF9F6] border-[#EAE6DE] opacity-60'
                  : 'bg-white border-[#EAE6DE] shadow-2xs hover:border-[#C99532]'
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => toggleFollowUpComplete(item.id)}
                  className={`w-6 h-6 rounded-lg border flex items-center justify-center mt-0.5 transition-colors ${
                    item.isCompleted
                      ? 'bg-[#C99532] border-[#C99532] text-white'
                      : 'border-[#EAE6DE] hover:border-[#C99532]'
                  }`}
                  title="Toggle Complete"
                >
                  {item.isCompleted && <CheckCircle2 className="w-4 h-4" />}
                </button>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className={`text-xs font-bold text-[#292929] ${item.isCompleted ? 'line-through' : ''}`}>
                      {item.customerName}
                    </h4>
                    <span className="text-[10px] font-mono text-[#8A8A8A]">({item.customerPhone})</span>
                    <span
                      className={`px-2 py-0.2 rounded text-[10px] font-bold ${
                        item.priority === 'High'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-[#FAF4E8] text-[#A87922] border border-[#F4E7C8]'
                      }`}
                    >
                      {item.priority} Priority
                    </span>
                  </div>

                  <p className="text-xs text-[#525252] leading-relaxed">{item.reason}</p>

                  <div className="flex items-center gap-3 text-[11px] text-[#8A8A8A]">
                    <span className="flex items-center gap-1">
                      <CalendarIcon className="w-3 h-3 text-[#C99532]" />
                      Due: {item.dueDate} at {item.dueTime}
                    </span>
                    <span>•</span>
                    <span>Trip: {item.destination}</span>
                    <span>•</span>
                    <span>Consultant: {item.assignedTo}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
                <button
                  onClick={() => setActivePage('inbox')}
                  className="px-3 py-1.5 rounded-xl bg-[#FAF4E8] hover:bg-[#F4E7C8] text-[#A87922] text-xs font-semibold flex items-center gap-1.5 transition border border-[#F4E7C8]"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Open Chat</span>
                </button>
              </div>
            </div>
          ))}

          {filteredFollowups.length === 0 && (
            <div className="p-12 text-center bg-white rounded-2xl border border-[#EAE6DE] shadow-2xs">
              <div className="w-12 h-12 rounded-2xl bg-[#FAF4E8] text-[#C99532] border border-[#F4E7C8] flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-[#292929]">No Follow-ups Scheduled</h3>
              <p className="text-xs text-[#707070] max-w-sm mx-auto mt-1 mb-4">
                All client check-ins and itinerary reminders are currently completed or clear.
              </p>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-[#C99532] hover:bg-[#A87922] text-white text-xs font-semibold shadow-sm inline-flex items-center gap-1.5 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Schedule New Follow-up</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Calendar Grouped View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.keys(dateGroups).map(dateStr => (
            <div key={dateStr} className="bg-white rounded-2xl border border-[#EAE6DE] p-4 shadow-2xs space-y-3">
              <div className="flex items-center justify-between border-b border-[#EAE6DE] pb-2">
                <span className="text-xs font-bold text-[#292929] flex items-center gap-1.5">
                  <CalendarIcon className="w-3.5 h-3.5 text-[#C99532]" />
                  {dateStr}
                </span>
                <span className="text-[10px] font-semibold text-[#8A8A8A]">
                  {dateGroups[dateStr].length} tasks
                </span>
              </div>

              <div className="space-y-2">
                {dateGroups[dateStr].map(item => (
                  <div
                    key={item.id}
                    onClick={() => toggleFollowUpComplete(item.id)}
                    className={`p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                      item.isCompleted ? 'bg-[#FAF9F6] border-[#EAE6DE] opacity-60' : 'bg-[#FAF4E8]/40 border-[#F4E7C8]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <strong className={`text-[#292929] ${item.isCompleted ? 'line-through' : ''}`}>
                        {item.customerName}
                      </strong>
                      <span className="text-[10px] text-[#A87922] font-mono">{item.dueTime}</span>
                    </div>
                    <p className="text-[11px] text-[#525252] line-clamp-2">{item.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Reminder Modal */}
      {isAddModalOpen && createPortal(
        <div
          onClick={() => setIsAddModalOpen(false)}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-2xl border border-[#EAE6DE] p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between border-b border-[#EAE6DE] pb-3">
              <h3 className="text-sm font-bold text-[#292929]">Schedule Customer Follow-up</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-[#8A8A8A] hover:text-[#292929]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateFollowUp} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-[#707070] mb-1">Customer Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priyesh Mehta"
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE6DE] text-xs text-[#292929] focus:outline-none focus:ring-1 focus:ring-[#C99532]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#707070] mb-1">WhatsApp Phone</label>
                <input
                  type="text"
                  placeholder="+91 98201 22334"
                  value={newCustomerPhone}
                  onChange={(e) => setNewCustomerPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE6DE] text-xs font-mono text-[#292929] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-[#707070] mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#EAE6DE] text-xs text-[#292929] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#707070] mb-1">Due Time</label>
                  <input
                    type="text"
                    value={newDueTime}
                    onChange={(e) => setNewDueTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#EAE6DE] text-xs text-[#292929] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#707070] mb-1">Priority</label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE6DE] text-xs font-semibold text-[#292929] focus:outline-none"
                >
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#707070] mb-1">Follow-up Reason / Task</label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Call regarding Dal Lake houseboat upgrade and collect passport scans for flight booking..."
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#EAE6DE] text-xs text-[#292929] focus:outline-none focus:ring-1 focus:ring-[#C99532]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#EAE6DE]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl border border-[#EAE6DE] text-xs font-semibold text-[#292929] hover:bg-[#FAF9F6]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-[#C99532] hover:bg-[#A87922] text-xs font-semibold text-white shadow-xs"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
