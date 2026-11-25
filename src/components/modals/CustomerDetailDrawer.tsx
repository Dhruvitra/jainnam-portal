import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Customer } from '../../types';
import { X, MapPin, Calendar, Users, DollarSign, MessageSquare, Edit3 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface CustomerDetailDrawerProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CustomerDetailDrawer: React.FC<CustomerDetailDrawerProps> = ({
  customer,
  isOpen,
  onClose
}) => {
  const { setActivePage } = useApp();

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !customer) return null;

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] overflow-hidden bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute inset-y-0 right-0 max-w-full flex pl-10"
      >
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-[#EAE6DE] flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-[#EAE6DE] flex items-center justify-between bg-[#FAF9F6]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#A87922]">
              Jainam Tours • Client Record
            </span>
            <button
              onClick={onClose}
              className="p-1.5 text-[#8A8A8A] hover:text-[#292929] rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Details */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            <div className="text-center pb-4 border-b border-[#EAE6DE]">
              <img
                src={customer.avatar}
                alt={customer.name}
                className="w-20 h-20 rounded-full mx-auto object-cover border-4 border-white shadow-md mb-2"
              />
              <h2 className="text-lg font-bold text-[#292929]">{customer.name}</h2>
              <p className="text-xs text-[#707070] font-mono mt-0.5">{customer.whatsappNumber}</p>
              <span className="mt-2 inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FAF4E8] text-[#A87922] border border-[#F4E7C8]">
                {customer.leadStatus}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  onClose();
                  setActivePage('inbox');
                }}
                className="py-2 px-3 rounded-xl bg-[#C99532] hover:bg-[#A87922] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-sm"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp Desk</span>
              </button>
              <button
                onClick={() => {
                  onClose();
                  setActivePage('builder');
                }}
                className="py-2 px-3 rounded-xl border border-[#EAE6DE] hover:bg-[#FAF9F6] text-[#292929] text-xs font-semibold flex items-center justify-center gap-1.5 transition"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#707070]" />
                <span>Custom Tour Plan</span>
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <span className="font-bold text-[#8A8A8A] uppercase tracking-wider text-[11px] block">
                Travel Requirements
              </span>
              <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#EAE6DE] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[#707070] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#C99532]" /> Destination:
                  </span>
                  <strong className="text-[#292929]">{customer.destination}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#707070] flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-[#A87922]" /> Budget:
                  </span>
                  <strong className="text-[#292929] font-mono">₹{customer.budget.toLocaleString()}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#707070] flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#525252]" /> Travel Date:
                  </span>
                  <strong className="text-[#292929]">{customer.travelDate}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#707070] flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#525252]" /> Guests:
                  </span>
                  <strong className="text-[#292929]">{customer.travellers} Guests</strong>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <span className="font-bold text-[#8A8A8A] uppercase tracking-wider text-[11px] block">
                Consultant Notes
              </span>
              <div className="p-3 rounded-xl bg-[#FAF9F6] border border-[#EAE6DE] text-[#525252] leading-relaxed">
                {customer.notes || 'No special dietary or accommodation notes recorded.'}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#FAF9F6] border border-[#EAE6DE] text-xs space-y-1.5 text-[#707070]">
              <div className="flex justify-between">
                <span>Assigned Consultant:</span>
                <strong className="text-[#292929]">{customer.assignedEmployee}</strong>
              </div>
              <div className="flex justify-between">
                <span>Last WhatsApp Activity:</span>
                <span className="font-mono">{customer.lastConversation}</span>
              </div>
              <div className="flex justify-between">
                <span>Completed Trips:</span>
                <span className="font-mono">{customer.totalBookings || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
