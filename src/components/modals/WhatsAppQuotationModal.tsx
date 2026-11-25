import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CustomPackageQuotation } from '../../types';
import { X, Copy, Check, MessageSquare, Send } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface WhatsAppQuotationModalProps {
  quotation: CustomPackageQuotation;
  isOpen: boolean;
  onClose: () => void;
}

export const WhatsAppQuotationModal: React.FC<WhatsAppQuotationModalProps> = ({
  quotation,
  isOpen,
  onClose
}) => {
  const { addToast, selectedNumber } = useApp();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const formattedWhatsAppText = `🌟 *JAINAM TOURS AND TRAVELS* 🌟
_"By Travellers, for Travellers"_

Namaste! Here is your personalized tour quotation for *${quotation.destination.toUpperCase()}*:

✈️ *Trip Summary:*
• *Destination:* ${quotation.destination}
• *Travel Dates:* ${quotation.startDate} to ${quotation.endDate}
• *Guests:* ${quotation.adults} Adults${quotation.children ? `, ${quotation.children} Children` : ''}
• *Hotel Category:* ${quotation.hotelCategory}★ Luxury Hotel / Resort
• *Vehicle:* ${quotation.transportType}
• *Meals:* ${quotation.mealPlan} (Pure Veg & Jain food available)

🗺️ *Itinerary Highlights:*
${quotation.days.map(d => `*Day ${d.day}:* ${d.title}\n_${d.description}_`).join('\n\n')}

💰 *Package Investment:*
• *Total Tour Package Cost:* ₹${quotation.totalEstimatedPrice.toLocaleString()} INR
• *Price Per Person:* ₹${quotation.pricePerPerson.toLocaleString()} INR
• *Includes:* Accommodations, private dedicated vehicle with chauffeur, sightseeing permits, and meals as specified.

${quotation.specialRequests ? `✨ *Special Request Catered:* ${quotation.specialRequests}\n` : ''}
📌 _To confirm your reservation or adjust this itinerary, please reply directly to this WhatsApp message._`;

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedWhatsAppText);
    setCopied(true);
    addToast('Copied', 'WhatsApp quotation text copied to clipboard.', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-[#EAE6DE] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#EAE6DE] flex items-center justify-between bg-[#FAF9F6]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FAF4E8] text-[#C99532] border border-[#F4E7C8] flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#292929]">WhatsApp Message Quotation</h3>
              <p className="text-xs text-[#707070]">Ready to send via line: {selectedNumber.phoneNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#8A8A8A] hover:text-[#292929] rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="text-xs text-[#707070]">
            WhatsApp markdown preview with Jainam Tours & Travels branding:
          </div>

          <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#EAE6DE] font-mono text-xs whitespace-pre-wrap max-h-80 overflow-y-auto leading-relaxed text-[#292929]">
            {formattedWhatsAppText}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleCopy}
              className="flex-1 py-2.5 px-4 rounded-xl border border-[#EAE6DE] bg-white hover:bg-[#FAF9F6] text-[#292929] text-xs font-bold transition flex items-center justify-center gap-2"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy WhatsApp Message'}</span>
            </button>
            <button
              onClick={() => {
                handleCopy();
                onClose();
              }}
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#C99532] hover:bg-[#A87922] text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
            >
              <Send className="w-4 h-4" />
              <span>Copy & Return</span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
