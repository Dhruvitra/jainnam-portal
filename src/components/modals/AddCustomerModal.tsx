import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Customer, LeadStatus } from '../../types';
import { X } from 'lucide-react';

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (cust: Omit<Customer, 'id'>) => void;
}

export const AddCustomerModal: React.FC<AddCustomerModalProps> = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [email, setEmail] = useState('');
  const [destination, setDestination] = useState('');
  const [travelDate, setTravelDate] = useState('2026-08-01');
  const [travellers, setTravellers] = useState<number>(2);
  const [budget, setBudget] = useState<number>(85000);
  const [leadStatus, setLeadStatus] = useState<LeadStatus>('New Enquiry');
  const [assignedEmployee, setAssignedEmployee] = useState('Pooja Parekh');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !whatsappNumber || !destination) return;

    onSave({
      name,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      whatsappNumber,
      email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
      destination,
      travelDate,
      travellers,
      budget,
      currency: '₹',
      leadStatus,
      lastConversation: 'Just now',
      assignedEmployee,
      notes,
      interests: ['Custom Enquiry'],
      totalBookings: 0
    });
    onClose();
  };

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#EAE6DE] overflow-hidden animate-in zoom-in-95 duration-150"
      >
        <div className="px-6 py-4 border-b border-[#EAE6DE] flex items-center justify-between bg-[#FAF9F6]">
          <div>
            <h3 className="text-base font-bold text-[#292929]">Add Travel Customer</h3>
            <p className="text-xs text-[#707070]">Jainam Tours client management</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-[#8A8A8A] hover:text-[#292929] rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-semibold text-[#333333] mb-1">Customer / Family Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rahul & Sneha Mehta"
              required
              className="w-full px-3 py-2 rounded-xl border border-[#EAE6DE] text-xs text-[#292929] focus:ring-1 focus:ring-[#C99532]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#333333] mb-1">WhatsApp Number</label>
              <input
                type="tel"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="+91 98000 00000"
                required
                className="w-full px-3 py-2 rounded-xl border border-[#EAE6DE] text-xs text-[#292929]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#333333] mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@gmail.com"
                className="w-full px-3 py-2 rounded-xl border border-[#EAE6DE] text-xs text-[#292929]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#333333] mb-1">Destination</label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Kashmir Paradise"
                required
                className="w-full px-3 py-2 rounded-xl border border-[#EAE6DE] text-xs text-[#292929]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#333333] mb-1">Travel Date</label>
              <input
                type="date"
                value={travelDate}
                onChange={(e) => setTravelDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#EAE6DE] text-xs text-[#292929] font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#333333] mb-1">Guests</label>
              <input
                type="number"
                value={travellers}
                onChange={(e) => setTravellers(Number(e.target.value))}
                min={1}
                className="w-full px-3 py-2 rounded-xl border border-[#EAE6DE] text-xs text-[#292929]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#333333] mb-1">Budget (₹)</label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-[#EAE6DE] text-xs text-[#292929] font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#333333] mb-1">Status</label>
              <select
                value={leadStatus}
                onChange={(e) => setLeadStatus(e.target.value as LeadStatus)}
                className="w-full px-3 py-2 rounded-xl border border-[#EAE6DE] text-xs text-[#292929]"
              >
                <option value="New Enquiry">New Enquiry</option>
                <option value="Contacted">Contacted</option>
                <option value="Proposal Sent">Proposal Sent</option>
                <option value="Negotiation">Negotiation</option>
                <option value="Confirmed">Confirmed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#333333] mb-1">Assigned Consultant</label>
            <select
              value={assignedEmployee}
              onChange={(e) => setAssignedEmployee(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#EAE6DE] text-xs text-[#292929]"
            >
              <option value="Pooja Parekh">Pooja Parekh (Senior Consultant)</option>
              <option value="Chirag Mehta">Chirag Mehta (Tour Specialist)</option>
              <option value="Ritu Sharma">Ritu Sharma (Customer Support)</option>
              <option value="Jainam Shah">Jainam Shah (Director)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#333333] mb-1">Dietary & Client Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Pure Veg/Jain meals, senior citizens in family..."
              className="w-full p-2.5 rounded-xl border border-[#EAE6DE] text-xs text-[#292929]"
            />
          </div>

          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 rounded-xl border border-[#EAE6DE] text-xs font-semibold text-[#525252] hover:bg-[#FAF9F6]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 px-4 rounded-xl bg-[#C99532] hover:bg-[#A87922] text-white text-xs font-bold shadow-sm"
            >
              Save Customer
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};
