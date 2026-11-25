import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CustomPackageQuotation } from '../../types';
import { X, Printer } from 'lucide-react';

interface QuotationPDFModalProps {
  quotation: CustomPackageQuotation;
  isOpen: boolean;
  onClose: () => void;
}

export const QuotationPDFModal: React.FC<QuotationPDFModalProps> = ({ quotation, isOpen, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl max-h-[92vh] bg-white rounded-2xl shadow-2xl border border-[#EAE6DE] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
      >
        {/* Top Control Bar */}
        <div className="px-6 py-3 border-b border-[#EAE6DE] bg-[#292929] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F4E7C8]">
              OFFICIAL TOUR PROPOSAL
            </span>
            <span className="text-xs text-[#8A8A8A]">| Printable Quotation</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-lg bg-[#C99532] hover:bg-[#A87922] text-xs font-semibold flex items-center gap-1.5 text-white transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-[#8A8A8A] hover:text-white rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Proposal Document Body */}
        <div className="flex-1 overflow-y-auto p-8 font-sans bg-white text-[#333333] space-y-6">
          {/* Official Letterhead with Jainam Logo */}
          <div className="flex items-start justify-between border-b-2 border-[#C99532] pb-5">
            <div className="flex items-center gap-4">
              <img
                src="/jainam-logo.png"
                alt="JAINAM TOURS AND TRAVELS"
                className="h-16 w-auto object-contain"
              />
              <div>
                <h2 className="text-lg font-bold text-[#292929]">JAINAM TOURS AND TRAVELS</h2>
                <p className="text-xs italic text-[#A87922] font-medium">"By Travellers, for Travellers"</p>
                <p className="text-[11px] text-[#707070] mt-0.5">Mumbai • Ahmedabad • International Holidays</p>
              </div>
            </div>
            <div className="text-right text-xs text-[#707070]">
              <div className="font-bold text-[#292929]">Quotation Reference</div>
              <div className="font-mono text-[#A87922] font-semibold">#JT-QT-{Date.now().toString().slice(-6)}</div>
              <div>Date: {new Date().toLocaleDateString('en-IN')}</div>
              <div>Validity: 7 Days</div>
            </div>
          </div>

          {/* Trip Summary Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-[#FAF9F6] border border-[#EAE6DE] text-xs">
            <div>
              <span className="text-[#8A8A8A] font-bold uppercase text-[10px] block">Destination</span>
              <strong className="text-[#292929] text-sm">{quotation.destination}</strong>
            </div>
            <div>
              <span className="text-[#8A8A8A] font-bold uppercase text-[10px] block">Travel Dates</span>
              <strong className="text-[#292929]">{quotation.startDate} to {quotation.endDate}</strong>
            </div>
            <div>
              <span className="text-[#8A8A8A] font-bold uppercase text-[10px] block">Travellers</span>
              <strong className="text-[#292929]">{quotation.adults} Adults{quotation.children ? `, ${quotation.children} Children` : ''}</strong>
            </div>
            <div>
              <span className="text-[#8A8A8A] font-bold uppercase text-[10px] block">Hotel Class</span>
              <strong className="text-[#292929]">{quotation.hotelCategory}-Star Luxury</strong>
            </div>
          </div>

          {/* Day by Day */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#A87922] mb-3 border-b border-[#EAE6DE] pb-1">
              Customized Itinerary Highlights
            </h4>
            <div className="space-y-3">
              {quotation.days.map((d) => (
                <div key={d.day} className="p-3 rounded-xl border border-[#EAE6DE] text-xs space-y-1">
                  <div className="font-bold text-[#292929]">
                    <span className="text-[#A87922] mr-2">Day {d.day}:</span>
                    {d.title}
                  </div>
                  <p className="text-[#525252] leading-relaxed">{d.description}</p>
                  {d.hotel && <div className="text-[11px] text-[#8A8A8A]">Accommodations: {d.hotel}</div>}
                </div>
              ))}
            </div>
          </div>

          {/* Price Table */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#A87922] mb-2 border-b border-[#EAE6DE] pb-1">
              Quotation Breakdown
            </h4>
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-[#EAE6DE] text-[#8A8A8A] uppercase text-[10px]">
                  <th className="py-2">Component</th>
                  <th className="py-2 text-right">Cost (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE6DE] font-mono">
                <tr>
                  <td className="py-2 font-sans font-medium text-[#333333]">
                    Accommodations ({quotation.days.length} Nights in {quotation.hotelCategory}★ Properties)
                  </td>
                  <td className="py-2 text-right">₹{quotation.hotelCost.toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="py-2 font-sans font-medium text-[#333333]">
                    Private Vehicle & Chauffeur ({quotation.transportType})
                  </td>
                  <td className="py-2 text-right">₹{quotation.transportCost.toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="py-2 font-sans font-medium text-[#333333]">
                    Sightseeing, Permits & Excursions
                  </td>
                  <td className="py-2 text-right">₹{quotation.activityCost.toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="py-2 font-sans font-medium text-[#333333]">
                    Applicable GST & Management Taxes
                  </td>
                  <td className="py-2 text-right">₹{quotation.serviceTax.toLocaleString()}</td>
                </tr>
                <tr className="border-t-2 border-[#292929] font-bold text-sm bg-[#FAF9F6]">
                  <td className="py-2.5 px-2 font-sans text-[#292929]">Total Net Package Cost</td>
                  <td className="py-2.5 px-2 text-right text-[#A87922]">
                    ₹{quotation.totalEstimatedPrice.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="text-right text-xs text-[#707070] mt-1.5 font-semibold">
              Per Person Rate: <strong className="text-[#292929] font-mono">₹{quotation.pricePerPerson.toLocaleString()}</strong>
            </div>
          </div>

          {/* Inclusions & Special Requests */}
          <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#EAE6DE] text-xs text-[#525252] space-y-1">
            <div><strong className="text-[#292929]">Meal Inclusions:</strong> {quotation.mealPlan} (Special Pure Veg & Jain catering arranged)</div>
            {quotation.specialRequests && (
              <div><strong className="text-[#292929]">Client Special Requests:</strong> {quotation.specialRequests}</div>
            )}
          </div>

          {/* Footer Note */}
          <div className="text-[10px] text-[#8A8A8A] pt-4 border-t border-[#EAE6DE] flex justify-between">
            <span>JAINAM TOURS AND TRAVELS • "By Travellers, for Travellers"</span>
            <span>Registered Travel & Tour Operator</span>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
