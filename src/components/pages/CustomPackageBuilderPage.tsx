import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CustomPackageQuotation, DayItinerary } from '../../types';
import {
  Sliders,
  MapPin,
  Calendar,
  Plus,
  Trash2,
  FileText,
  MessageSquare,
  CheckCircle2,
  Save
} from 'lucide-react';
import { QuotationPDFModal } from '../modals/QuotationPDFModal';
import { WhatsAppQuotationModal } from '../modals/WhatsAppQuotationModal';

export const CustomPackageBuilderPage: React.FC = () => {
  const { addToast } = useApp();

  const [destination, setDestination] = useState('Kashmir Paradise & Dal Lake Houseboat');
  const [departureCity, setDepartureCity] = useState('Mumbai (BOM)');
  const [startDate, setStartDate] = useState('2026-07-15');
  const [endDate, setEndDate] = useState('2026-07-20');
  const [adults, setAdults] = useState<number>(2);
  const [children, setChildren] = useState<number>(0);
  const [hotelCategory, setHotelCategory] = useState<number>(5);
  const [transportType, setTransportType] = useState('Dedicated Toyota Innova Crysta AC with Chauffeur');
  const [mealPlan, setMealPlan] = useState('Daily Breakfast & Traditional Dinners (Special Pure Veg & Jain food)');
  const [specialRequests, setSpecialRequests] = useState('Super-deluxe Dal Lake heritage houseboat, Shikara ride at sunset, Jain food strictly without onion/garlic');

  const [days, setDays] = useState<DayItinerary[]>([
    {
      day: 1,
      title: 'Arrival in Srinagar & Dal Lake Heritage Houseboat',
      description: 'Chauffeured pickup from Srinagar airport. Transfer to heritage luxury houseboat. Evening Shikara boat ride across Dal Lake.',
      activities: ['Airport pickup', 'Houseboat check-in', 'Shikara cruise'],
      hotel: 'Mascot Heritage Houseboat Dal Lake'
    },
    {
      day: 2,
      title: 'Mughal Terraced Gardens & Shankaracharya Temple',
      description: 'Visit Nishat Bagh and Shalimar Bagh terraced Mughal gardens. Afternoon visit to historic Shankaracharya hilltop temple.',
      activities: ['Mughal gardens', 'Temple visit', 'Craft market'],
      hotel: 'The Lalit Grand Palace Srinagar'
    },
    {
      day: 3,
      title: 'Gulmarg Meadow of Flowers & Gondola Cable Car Peak',
      description: 'Scenic journey to Gulmarg. Cable car Gondola Phase 1 & 2 tickets to snow-covered peaks.',
      activities: ['Gondola ride', 'Snow view', 'Pine forest stroll'],
      hotel: 'Kolahoi Green Heights Gulmarg'
    }
  ]);

  // Pricing inputs in INR (₹)
  const [hotelCost, setHotelCost] = useState<number>(38000);
  const [transportCost, setTransportCost] = useState<number>(18000);
  const [activityCost, setActivityCost] = useState<number>(14000);
  const [serviceTaxRate] = useState<number>(5); // 5% GST
  const [marginPercent] = useState<number>(15); // 15% agency margin

  const subtotal = hotelCost + transportCost + activityCost;
  const serviceTax = Math.round((subtotal * serviceTaxRate) / 100);
  const marginAmount = Math.round((subtotal * marginPercent) / 100);
  const totalEstimatedPrice = subtotal + serviceTax + marginAmount;
  const totalPax = adults + children || 1;
  const pricePerPerson = Math.round(totalEstimatedPrice / totalPax);

  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);

  const quotationData: CustomPackageQuotation = {
    destination,
    departureCity,
    startDate,
    endDate,
    adults,
    children,
    hotelCategory,
    transportType,
    mealPlan,
    sightseeing: ['Dal Lake Shikara', 'Gulmarg Gondola', 'Betaab Valley', 'Mughal Gardens'],
    specialRequests,
    days,
    hotelCost,
    transportCost,
    activityCost,
    serviceTax,
    marginPercent,
    totalEstimatedPrice,
    pricePerPerson
  };

  const handleAddDay = () => {
    const nextDay = days.length + 1;
    setDays([
      ...days,
      {
        day: nextDay,
        title: `Day ${nextDay} - Excursion & Sightseeing`,
        description: 'Scheduled sightseeing and local cultural exploration with chauffeur.',
        activities: ['Sightseeing', 'Leisure'],
        hotel: 'Deluxe Hotel'
      }
    ]);
  };

  const handleRemoveDay = (index: number) => {
    setDays(days.filter((_, i) => i !== index));
  };

  const handleSaveQuotation = () => {
    addToast(
      'Quotation Saved',
      `Proposal for ${destination} (₹${totalEstimatedPrice.toLocaleString()}) saved to client quotations.`,
      'success'
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#292929] tracking-tight">
            Custom Tour Planner & Quotation Builder
          </h1>
          <p className="text-xs sm:text-sm text-[#707070] mt-1">
            Build tailored travel proposals, calculate live package pricing, and generate Jainam Tours branded quotations.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleSaveQuotation}
            className="px-3.5 py-2 rounded-xl border border-[#EAE6DE] bg-white hover:bg-[#FAF9F6] text-[#292929] text-xs font-semibold shadow-2xs flex items-center gap-1.5 transition"
          >
            <Save className="w-4 h-4 text-[#707070]" />
            <span>Save Proposal</span>
          </button>
          <button
            onClick={() => setIsPdfModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-[#292929] hover:bg-[#1C1C1C] text-white text-xs font-semibold shadow-2xs flex items-center gap-1.5 transition"
          >
            <FileText className="w-4 h-4 text-[#F4E7C8]" />
            <span>Generate PDF</span>
          </button>
          <button
            onClick={() => setIsWhatsAppModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-[#C99532] hover:bg-[#A87922] text-white text-xs font-semibold shadow-sm flex items-center gap-1.5 transition"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Format for WhatsApp</span>
          </button>
        </div>
      </div>

      {/* Main Form & Live Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-[#EAE6DE] p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#A87922] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#C99532]" />
              1. Tour Specifications
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#333333] mb-1">Destination</label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE6DE] text-xs text-[#292929] focus:ring-1 focus:ring-[#C99532]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#333333] mb-1">Departure City</label>
                <input
                  type="text"
                  value={departureCity}
                  onChange={(e) => setDepartureCity(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE6DE] text-xs text-[#292929] focus:ring-1 focus:ring-[#C99532]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#333333] mb-1">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE6DE] text-xs text-[#292929] font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#333333] mb-1">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE6DE] text-xs text-[#292929] font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#333333] mb-1">Adults (12+ yrs)</label>
                <input
                  type="number"
                  value={adults}
                  onChange={(e) => setAdults(Number(e.target.value))}
                  min={1}
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE6DE] text-xs text-[#292929]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#333333] mb-1">Children (0-11 yrs)</label>
                <input
                  type="number"
                  value={children}
                  onChange={(e) => setChildren(Number(e.target.value))}
                  min={0}
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE6DE] text-xs text-[#292929]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#333333] mb-1">Hotel Category</label>
                <select
                  value={hotelCategory}
                  onChange={(e) => setHotelCategory(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE6DE] text-xs text-[#292929]"
                >
                  <option value={3}>3-Star Deluxe</option>
                  <option value={4}>4-Star Premium</option>
                  <option value={5}>5-Star Luxury Resort</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#333333] mb-1">Vehicle / Transport</label>
                <input
                  type="text"
                  value={transportType}
                  onChange={(e) => setTransportType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE6DE] text-xs text-[#292929]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#333333] mb-1">Meal Arrangements</label>
              <input
                type="text"
                value={mealPlan}
                onChange={(e) => setMealPlan(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#EAE6DE] text-xs text-[#292929]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#333333] mb-1">Customer Special Requests</label>
              <textarea
                rows={2}
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="e.g. Pure Veg / Jain food, senior citizen assistance..."
                className="w-full p-2.5 rounded-xl border border-[#EAE6DE] text-xs text-[#292929]"
              />
            </div>
          </div>

          {/* Daily Itinerary */}
          <div className="bg-white rounded-2xl border border-[#EAE6DE] p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#A87922] flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#C99532]" />
                2. Day-by-Day Itinerary ({days.length} Days)
              </h3>
              <button
                type="button"
                onClick={handleAddDay}
                className="px-2.5 py-1 rounded-lg bg-[#FAF4E8] hover:bg-[#F4E7C8] text-[#A87922] text-xs font-bold flex items-center gap-1 border border-[#F4E7C8]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Day</span>
              </button>
            </div>

            <div className="space-y-3">
              {days.map((d, index) => (
                <div key={index} className="p-3.5 rounded-xl border border-[#EAE6DE] bg-[#FAF9F6] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#A87922]">Day {d.day}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveDay(index)}
                      className="text-[#8A8A8A] hover:text-red-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={d.title}
                    onChange={(e) => {
                      const updated = [...days];
                      updated[index].title = e.target.value;
                      setDays(updated);
                    }}
                    placeholder="Day title"
                    className="w-full px-3 py-1.5 rounded-lg border border-[#EAE6DE] text-xs font-semibold bg-white"
                  />
                  <textarea
                    rows={2}
                    value={d.description}
                    onChange={(e) => {
                      const updated = [...days];
                      updated[index].description = e.target.value;
                      setDays(updated);
                    }}
                    placeholder="Day excursion details..."
                    className="w-full p-2 rounded-lg border border-[#EAE6DE] text-xs bg-white"
                  />
                  <input
                    type="text"
                    value={d.hotel || ''}
                    onChange={(e) => {
                      const updated = [...days];
                      updated[index].hotel = e.target.value;
                      setDays(updated);
                    }}
                    placeholder="Overnight hotel (optional)"
                    className="w-full px-3 py-1 rounded-lg border border-[#EAE6DE] text-[11px] bg-white text-[#707070]"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Live Pricing Calculator (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-2xl border border-[#EAE6DE] p-5 shadow-2xs space-y-4 sticky top-20">
            <div className="flex items-center justify-between border-b border-[#EAE6DE] pb-3">
              <div>
                <h3 className="text-sm font-bold text-[#292929]">Live Package Pricing</h3>
                <p className="text-xs text-[#707070]">Calculated in Indian Rupees (₹)</p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FAF4E8] text-[#A87922] border border-[#F4E7C8]">
                ESTIMATOR
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#525252] mb-1">Hotel Accommodations (₹)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-[#8A8A8A] font-bold">₹</span>
                  <input
                    type="number"
                    value={hotelCost}
                    onChange={(e) => setHotelCost(Number(e.target.value))}
                    className="w-full pl-7 pr-3 py-1.5 rounded-xl border border-[#EAE6DE] font-mono text-[#292929]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#525252] mb-1">Dedicated Vehicle & Chauffeur (₹)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-[#8A8A8A] font-bold">₹</span>
                  <input
                    type="number"
                    value={transportCost}
                    onChange={(e) => setTransportCost(Number(e.target.value))}
                    className="w-full pl-7 pr-3 py-1.5 rounded-xl border border-[#EAE6DE] font-mono text-[#292929]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#525252] mb-1">Sightseeing, Permits & Tickets (₹)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-[#8A8A8A] font-bold">₹</span>
                  <input
                    type="number"
                    value={activityCost}
                    onChange={(e) => setActivityCost(Number(e.target.value))}
                    className="w-full pl-7 pr-3 py-1.5 rounded-xl border border-[#EAE6DE] font-mono text-[#292929]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#525252] mb-1">Taxes / GST ({serviceTaxRate}%)</label>
                  <div className="p-2 rounded-xl bg-[#FAF9F6] border border-[#EAE6DE] font-mono text-[#525252]">
                    ₹{serviceTax.toLocaleString()}
                  </div>
                </div>
                <div>
                  <label className="block text-[#525252] mb-1">Agency Margin ({marginPercent}%)</label>
                  <div className="p-2 rounded-xl bg-[#FAF4E8] border border-[#F4E7C8] font-mono font-bold text-[#A87922]">
                    ₹{marginAmount.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Total Display Card */}
            <div className="p-4 rounded-2xl bg-[#292929] text-white space-y-2">
              <div className="flex items-center justify-between text-xs text-[#D9D9D9]">
                <span>Total Quotation Cost:</span>
                <span className="text-[11px] font-mono">{totalPax} Guests</span>
              </div>
              <div className="text-3xl font-extrabold font-mono text-[#F4E7C8] tracking-tight">
                ₹{totalEstimatedPrice.toLocaleString()}
                <span className="text-xs font-normal text-[#8A8A8A] ml-1.5">INR</span>
              </div>

              <div className="pt-2 border-t border-[#424242] flex items-center justify-between text-xs">
                <span className="text-[#D9D9D9]">Rate Per Person:</span>
                <span className="text-lg font-bold font-mono text-white">₹{pricePerPerson.toLocaleString()}</span>
              </div>
            </div>

            {/* Inclusions checklist preview */}
            <div className="p-3 rounded-xl bg-[#FAF9F6] border border-[#EAE6DE] text-xs space-y-1.5 text-[#525252]">
              <div className="font-bold text-[#292929] text-[11px]">Included in Quote:</div>
              <div className="flex items-center gap-1.5 text-[#292929]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C99532] flex-shrink-0" />
                <span>{days.length} Nights in {hotelCategory}-Star Properties</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#292929]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C99532] flex-shrink-0" />
                <span>{transportType}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#292929]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C99532] flex-shrink-0" />
                <span>{mealPlan}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-1">
              <button
                onClick={() => setIsWhatsAppModalOpen(true)}
                className="w-full py-2.5 px-4 rounded-xl bg-[#C99532] hover:bg-[#A87922] text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Format for WhatsApp</span>
              </button>
              <button
                onClick={() => setIsPdfModalOpen(true)}
                className="w-full py-2.5 px-4 rounded-xl border border-[#EAE6DE] hover:bg-[#FAF9F6] text-[#292929] text-xs font-semibold transition flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4 text-[#707070]" />
                <span>Print Official PDF Quotation</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <QuotationPDFModal
        quotation={quotationData}
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
      />

      <WhatsAppQuotationModal
        quotation={quotationData}
        isOpen={isWhatsAppModalOpen}
        onClose={() => setIsWhatsAppModalOpen(false)}
      />
    </div>
  );
};
