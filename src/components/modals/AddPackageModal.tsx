import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { TourPackage, DayItinerary } from '../../types';
import { X, Plus, Trash2 } from 'lucide-react';

interface AddPackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (pkg: TourPackage) => void;
  initialPackage?: TourPackage | null;
}

export const AddPackageModal: React.FC<AddPackageModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialPackage
}) => {
  const [name, setName] = useState(initialPackage?.name || '');
  const [destination, setDestination] = useState(initialPackage?.destination || '');
  const [country, setCountry] = useState(initialPackage?.country || '');
  const [duration, setDuration] = useState(initialPackage?.duration || '6 Days / 5 Nights');
  const [nights, setNights] = useState<number>(initialPackage?.nights || 5);
  const [pricePerPerson, setPricePerPerson] = useState<number>(initialPackage?.pricePerPerson || 42500);
  const [childPrice, setChildPrice] = useState<number>(initialPackage?.childPrice || 22000);
  const [groupPrice, setGroupPrice] = useState<number>(initialPackage?.groupPrice || 38000);
  const [hotelCategory, setHotelCategory] = useState<number>(initialPackage?.hotelCategory || 5);
  const [hotelDetails, setHotelDetails] = useState(initialPackage?.hotelDetails || 'Heritage Houseboat on Dal Lake & Luxury 5-Star Mountain Resort');
  const [transportation, setTransportation] = useState(initialPackage?.transportation || 'Dedicated Toyota Innova Crysta with private chauffeur');
  const [meals, setMeals] = useState(initialPackage?.meals || 'Daily Breakfast & Dinners with Pure Veg & Jain Food Arrangements');
  const [bestSeason, setBestSeason] = useState(initialPackage?.bestSeason || 'March to October (Summer & Autumn)');
  const [terms] = useState(initialPackage?.terms || 'Full refund up to 14 days before departure. 30% advance deposit to secure bookings.');
  const [isActive, setIsActive] = useState<boolean>(initialPackage !== undefined && initialPackage !== null ? initialPackage.isActive : true);

  const [inclusionsText, setInclusionsText] = useState(
    initialPackage?.inclusions.join('\n') ||
      '5 nights luxury hotel & heritage super-deluxe houseboat on Dal Lake\nPrivate Shikara boat ride with floating flower & saffron market visit\nGulmarg Gondola cable car ride (Phase 1 & Phase 2 included)\nBetaab Valley & Chandanwari excursion in Pahalgam\nDedicated Toyota Innova Crysta with chauffeur'
  );
  const [exclusionsText, setExclusionsText] = useState(
    initialPackage?.exclusions.join('\n') ||
      'Domestic flights to Srinagar\nPony rides / sledge rentals in Gulmarg / Pahalgam\nPersonal shopping and tips'
  );
  const [highlightsText] = useState(
    initialPackage?.highlights.join(', ') || 'Dal Lake Houseboat, Gulmarg Gondola, Betaab Valley, Pure Veg/Jain Food'
  );

  const [dailyItinerary, setDailyItinerary] = useState<DayItinerary[]>(
    initialPackage?.dailyItinerary || [
      {
        day: 1,
        title: 'Arrival in Srinagar & Sunset Shikara Cruise on Dal Lake',
        description: 'Warm reception at airport. Transfer to heritage luxury houseboat. Evening relaxing Shikara boat ride across Dal Lake.',
        activities: ['Airport pickup', 'Houseboat welcome', 'Sunset Shikara cruise'],
        hotel: 'Mascot Luxury Heritage Houseboat'
      },
      {
        day: 2,
        title: 'Mughal Gardens & Historic Shankaracharya Temple',
        description: 'Explore Nishat Bagh, Shalimar Bagh, and Chashme Shahi terraced gardens. Visit historic Shankaracharya Hilltop Temple.',
        activities: ['Mughal garden walk', 'Temple visit', 'Local walnut craft shopping'],
        hotel: 'The Lalit Grand Palace Srinagar'
      }
    ]
  );

  const [imageUrls] = useState<string[]>(
    initialPackage?.images || [
      'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=800&q=80'
    ]
  );

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleAddDay = () => {
    const nextDayNum = dailyItinerary.length + 1;
    setDailyItinerary([
      ...dailyItinerary,
      {
        day: nextDayNum,
        title: `Day ${nextDayNum} - Scenic Excursion & Sightseeing`,
        description: 'Day-long excursion or leisure activities according to itinerary schedule.',
        activities: ['Morning tour', 'Free leisure time'],
        hotel: 'Heritage Resort Hotel'
      }
    ]);
  };

  const handleRemoveDay = (index: number) => {
    setDailyItinerary(dailyItinerary.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !destination) return;

    const pkg: TourPackage = {
      id: initialPackage?.id || 'pkg-' + Date.now(),
      name,
      destination,
      country: country || destination,
      duration,
      nights,
      pricePerPerson: Number(pricePerPerson),
      childPrice: Number(childPrice),
      groupPrice: Number(groupPrice),
      currency: '₹',
      hotelCategory: Number(hotelCategory),
      hotelDetails,
      transportation,
      meals,
      inclusions: inclusionsText.split('\n').filter(Boolean),
      exclusions: exclusionsText.split('\n').filter(Boolean),
      dailyItinerary,
      highlights: highlightsText.split(',').map(s => s.trim()).filter(Boolean),
      bestSeason,
      availableDates: ['2026-06-15', '2026-07-01', '2026-08-15'],
      images: imageUrls,
      pdfBrochureUrl: 'https://example.com/tour-brochure.pdf',
      terms,
      isActive,
      featured: initialPackage?.featured || false
    };

    onSave(pkg);
    onClose();
  };

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-[#EAE6DE] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#EAE6DE] flex items-center justify-between bg-[#FAF9F6]">
          <div>
            <h3 className="text-base font-bold text-[#292929]">
              {initialPackage ? 'Edit Tour Package' : 'Create New Tour Package'}
            </h3>
            <p className="text-xs text-[#707070]">
              Jainam Tours and Travels package management
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#8A8A8A] hover:text-[#292929] rounded-lg hover:bg-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Section: Basic Details */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A8A8A] mb-3">
              1. Basic Package Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-[#333333] mb-1">
                  Tour Package Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Kashmir Paradise & Dal Lake Luxury Houseboat"
                  required
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE6DE] text-xs text-[#292929] focus:ring-1 focus:ring-[#C99532]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#333333] mb-1">
                  Destination
                </label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. Srinagar, Gulmarg, Pahalgam"
                  required
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE6DE] text-xs text-[#292929] focus:ring-1 focus:ring-[#C99532]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#333333] mb-1">Country</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="e.g. India or Switzerland"
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE6DE] text-xs text-[#292929] focus:ring-1 focus:ring-[#C99532]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#333333] mb-1">Duration Label</label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g. 6 Days / 5 Nights"
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE6DE] text-xs text-[#292929] focus:ring-1 focus:ring-[#C99532]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#333333] mb-1">Number of Nights</label>
                <input
                  type="number"
                  value={nights}
                  onChange={(e) => setNights(Number(e.target.value))}
                  min={1}
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE6DE] text-xs text-[#292929] focus:ring-1 focus:ring-[#C99532]"
                />
              </div>
            </div>
          </div>

          {/* Section: Pricing */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A8A8A] mb-3">
              2. Package Rates (INR ₹)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#333333] mb-1">
                  Price Per Person (Adult)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-[#8A8A8A] text-xs font-bold">₹</span>
                  <input
                    type="number"
                    value={pricePerPerson}
                    onChange={(e) => setPricePerPerson(Number(e.target.value))}
                    className="w-full pl-7 pr-3 py-2 rounded-xl border border-[#EAE6DE] text-xs text-[#292929] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#333333] mb-1">Child Rate</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-[#8A8A8A] text-xs font-bold">₹</span>
                  <input
                    type="number"
                    value={childPrice}
                    onChange={(e) => setChildPrice(Number(e.target.value))}
                    className="w-full pl-7 pr-3 py-2 rounded-xl border border-[#EAE6DE] text-xs text-[#292929] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#333333] mb-1">Group Rate (4+ Pax)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-[#8A8A8A] text-xs font-bold">₹</span>
                  <input
                    type="number"
                    value={groupPrice}
                    onChange={(e) => setGroupPrice(Number(e.target.value))}
                    className="w-full pl-7 pr-3 py-2 rounded-xl border border-[#EAE6DE] text-xs text-[#292929] font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section: Accommodation & Inclusions */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A8A8A] mb-3">
              3. Hotels, Vehicles & Meals
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-[#333333] mb-1">Hotel Category</label>
                <select
                  value={hotelCategory}
                  onChange={(e) => setHotelCategory(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE6DE] text-xs text-[#292929]"
                >
                  <option value={3}>3-Star Deluxe</option>
                  <option value={4}>4-Star Premium</option>
                  <option value={5}>5-Star Luxury Resort / Houseboat</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-[#333333] mb-1">Hotel Details</label>
                <input
                  type="text"
                  value={hotelDetails}
                  onChange={(e) => setHotelDetails(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE6DE] text-xs text-[#292929]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#333333] mb-1">Transportation</label>
                <input
                  type="text"
                  value={transportation}
                  onChange={(e) => setTransportation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE6DE] text-xs text-[#292929]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#333333] mb-1">Meals Plan</label>
                <input
                  type="text"
                  value={meals}
                  onChange={(e) => setMeals(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE6DE] text-xs text-[#292929]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#333333] mb-1">Best Season</label>
                <input
                  type="text"
                  value={bestSeason}
                  onChange={(e) => setBestSeason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE6DE] text-xs text-[#292929]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#333333] mb-1">
                  Inclusions (One per line)
                </label>
                <textarea
                  rows={4}
                  value={inclusionsText}
                  onChange={(e) => setInclusionsText(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#EAE6DE] text-xs text-[#292929]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#333333] mb-1">
                  Exclusions (One per line)
                </label>
                <textarea
                  rows={4}
                  value={exclusionsText}
                  onChange={(e) => setExclusionsText(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#EAE6DE] text-xs text-[#292929]"
                />
              </div>
            </div>
          </div>

          {/* Section: Daily Itinerary */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A8A8A]">
                4. Daily Itinerary ({dailyItinerary.length} Days)
              </h4>
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
              {dailyItinerary.map((dayItem, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-[#EAE6DE] bg-[#FAF9F6] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#A87922]">Day {dayItem.day}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveDay(idx)}
                      className="text-[#8A8A8A] hover:text-red-600 p-1"
                      title="Remove Day"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={dayItem.title}
                    onChange={(e) => {
                      const updated = [...dailyItinerary];
                      updated[idx].title = e.target.value;
                      setDailyItinerary(updated);
                    }}
                    placeholder="Day Title"
                    className="w-full px-3 py-1.5 rounded-lg border border-[#EAE6DE] text-xs font-semibold bg-white"
                  />
                  <textarea
                    rows={2}
                    value={dayItem.description}
                    onChange={(e) => {
                      const updated = [...dailyItinerary];
                      updated[idx].description = e.target.value;
                      setDailyItinerary(updated);
                    }}
                    placeholder="Day activity details..."
                    className="w-full p-2 rounded-lg border border-[#EAE6DE] text-xs bg-white"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 rounded text-[#C99532]"
              />
              <span className="text-xs font-semibold text-[#292929]">
                Publish as Active Tour in Jainam Tours Catalog
              </span>
            </label>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#EAE6DE] bg-[#FAF9F6] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-[#EAE6DE] text-xs font-semibold text-[#525252] hover:bg-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2 rounded-xl bg-[#C99532] hover:bg-[#A87922] text-white text-xs font-bold shadow-sm"
          >
            {initialPackage ? 'Save Changes' : 'Publish Package'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
