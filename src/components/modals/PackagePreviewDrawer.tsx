import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { TourPackage } from '../../types';
import { X, MapPin, Star, CheckCircle2, Share2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface PackagePreviewDrawerProps {
  pkg: TourPackage | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PackagePreviewDrawer: React.FC<PackagePreviewDrawerProps> = ({ pkg, isOpen, onClose }) => {
  const { addToast } = useApp();

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !pkg) return null;

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] overflow-hidden bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute inset-y-0 right-0 max-w-full flex pl-10"
      >
        <div className="w-screen max-w-xl bg-white shadow-2xl border-l border-[#EAE6DE] flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-[#EAE6DE] flex items-center justify-between bg-[#FAF9F6]">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FAF4E8] text-[#A87922] border border-[#F4E7C8]">
                JAINAM TOURS CATALOG
              </span>
              <span className="text-xs text-[#707070]">Client Tour Preview</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-[#8A8A8A] hover:text-[#292929] rounded-lg hover:bg-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {/* Main photo */}
            <div className="relative rounded-2xl overflow-hidden h-56 shadow-2xs">
              <img
                src={pkg.images[0]}
                alt={pkg.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 bg-[#292929]/80 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-lg font-medium">
                {pkg.duration} • {pkg.country}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-[#C99532] mb-1">
                {Array.from({ length: pkg.hotelCategory }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#C99532]" />
                ))}
                <span className="text-xs font-bold text-[#707070] ml-1">
                  {pkg.hotelCategory}-Star Luxury
                </span>
              </div>
              <h2 className="text-xl font-bold text-[#292929] leading-snug">{pkg.name}</h2>
              <div className="flex items-center gap-2 text-xs text-[#707070] mt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#C99532]" />
                  {pkg.destination}
                </span>
                <span>•</span>
                <span>Best Season: <strong>{pkg.bestSeason}</strong></span>
              </div>
            </div>

            {/* Pricing Box */}
            <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#EAE6DE] flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-[#A87922] block">Package Rate</span>
                <div className="text-2xl font-extrabold text-[#292929] font-mono">
                  ₹{pkg.pricePerPerson.toLocaleString()}
                  <span className="text-xs text-[#707070] font-normal"> / person</span>
                </div>
              </div>
              <div className="text-right text-xs text-[#525252] space-y-0.5">
                <div>Child Rate: <strong>₹{pkg.childPrice.toLocaleString()}</strong></div>
                <div>Group Rate (4+): <strong>₹{pkg.groupPrice.toLocaleString()}</strong></div>
              </div>
            </div>

            {/* Inclusions & Highlights */}
            <div className="p-3.5 rounded-xl bg-white border border-[#EAE6DE] text-xs space-y-2">
              <span className="font-bold text-[#292929] text-[11px] uppercase tracking-wider block">
                Package Inclusions
              </span>
              <ul className="space-y-1.5 text-[#525252]">
                {pkg.inclusions.map((inc, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#C99532] mt-0.5 flex-shrink-0" />
                    <span>{inc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Daily Itinerary */}
            <div>
              <h4 className="font-bold text-[#292929] uppercase tracking-wider text-[11px] mb-3">
                Daily Itinerary
              </h4>
              <div className="space-y-2.5">
                {pkg.dailyItinerary.map((d) => (
                  <div key={d.day} className="p-3 rounded-xl border border-[#EAE6DE] bg-white text-xs space-y-1">
                    <div className="flex items-center justify-between font-bold text-[#292929]">
                      <span className="text-[#A87922]">Day {d.day}</span>
                      <span>{d.title}</span>
                    </div>
                    <p className="text-[#525252]">{d.description}</p>
                    {d.hotel && (
                      <div className="text-[11px] text-[#8A8A8A]">Overnight: {d.hotel}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Terms */}
            <div className="p-3 rounded-xl bg-[#FAF9F6] border border-[#EAE6DE] text-xs text-[#707070]">
              <strong>Booking Policy:</strong> {pkg.terms}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-[#EAE6DE] bg-[#FAF9F6] flex items-center justify-between">
            <button
              onClick={() => {
                addToast('Copied', `Itinerary brochure link for ${pkg.name} copied.`, 'success');
              }}
              className="px-4 py-2 rounded-xl bg-[#C99532] hover:bg-[#A87922] text-white text-xs font-bold shadow-sm flex items-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Itinerary</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#EAE6DE] text-xs font-semibold text-[#525252] hover:bg-white"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
