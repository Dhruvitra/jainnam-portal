import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Search, X, MapPin, Compass, ArrowRight } from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const navigate = useNavigate();
  const { isSearchModalOpen, setIsSearchModalOpen, packages, customers, setActivePage, setSelectedCustomer } = useApp();
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!isSearchModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsSearchModalOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchModalOpen]);

  if (!isSearchModalOpen) return null;

  const filteredPackages = packages.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.destination.toLowerCase().includes(query.toLowerCase())
  );

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.whatsappNumber.includes(query) ||
    c.destination.toLowerCase().includes(query.toLowerCase())
  );

  return createPortal(
    <div
      onClick={() => setIsSearchModalOpen(false)}
      className="fixed inset-0 z-[100] flex items-start justify-center pt-20 p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#EAE6DE] overflow-hidden animate-in zoom-in-95 duration-150"
      >
        {/* Input Bar */}
        <div className="p-4 border-b border-[#EAE6DE] flex items-center gap-3">
          <Search className="w-5 h-5 text-[#8A8A8A] flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search holiday packages, clients, WhatsApp numbers, destinations..."
            autoFocus
            className="w-full text-sm sm:text-base text-[#292929] placeholder:text-[#8A8A8A] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-[#8A8A8A] hover:text-[#292929] rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchModalOpen(false)}
            className="px-2 py-1 rounded-md text-xs font-semibold bg-[#FAF9F6] text-[#707070] border border-[#EAE6DE]"
          >
            ESC
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-5">
          {/* Tour Packages Results */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#707070] px-2 mb-2 flex items-center justify-between">
              <span>Tour Packages</span>
              <span>{filteredPackages.length} found</span>
            </div>
            {filteredPackages.length > 0 ? (
              <div className="space-y-1.5">
                {filteredPackages.slice(0, 3).map(pkg => (
                  <div
                    key={pkg.id}
                    onClick={() => {
                      setActivePage('packages');
                      navigate('/packages');
                      setIsSearchModalOpen(false);
                    }}
                    className="p-2.5 rounded-xl hover:bg-[#FAF4E8]/60 cursor-pointer flex items-center justify-between transition-colors border border-transparent hover:border-[#F4E7C8]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#FAF4E8] text-[#C99532] border border-[#F4E7C8] flex items-center justify-center flex-shrink-0">
                        <Compass className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-[#292929]">{pkg.name}</div>
                        <div className="text-[11px] text-[#707070] flex items-center gap-2">
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{pkg.destination}</span>
                          <span>•</span>
                          <span>{pkg.duration}</span>
                          <span>•</span>
                          <span className="font-semibold text-[#C99532]">₹{pkg.pricePerPerson.toLocaleString('en-IN')}/person</span>
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#8A8A8A]" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-[#8A8A8A] px-2 py-1">No tour packages match query.</div>
            )}
          </div>

          {/* Customers Results */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#707070] px-2 mb-2 flex items-center justify-between">
              <span>Customers & Leads</span>
              <span>{filteredCustomers.length} found</span>
            </div>
            {filteredCustomers.length > 0 ? (
              <div className="space-y-1.5">
                {filteredCustomers.slice(0, 3).map(cust => (
                  <div
                    key={cust.id}
                    onClick={() => {
                      setSelectedCustomer(cust);
                      setActivePage('customers');
                      navigate('/customers');
                      setIsSearchModalOpen(false);
                    }}
                    className="p-2.5 rounded-xl hover:bg-[#FAF4E8]/60 cursor-pointer flex items-center justify-between transition-colors border border-transparent hover:border-[#F4E7C8]"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={cust.avatar}
                        alt={cust.name}
                        className="w-8 h-8 rounded-full object-cover border border-[#EAE6DE]"
                      />
                      <div>
                        <div className="text-xs font-semibold text-[#292929]">{cust.name}</div>
                        <div className="text-[11px] text-[#707070] flex items-center gap-2">
                          <span>{cust.whatsappNumber}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{cust.destination}</span>
                          <span>•</span>
                          <span className="px-1.5 py-0.5 rounded bg-[#FAF4E8] text-[#A87922] border border-[#F4E7C8] font-medium text-[10px]">
                            {cust.leadStatus}
                          </span>
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#8A8A8A]" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-[#8A8A8A] px-2 py-1">No customers match query.</div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#EAE6DE] bg-[#FAF9F6] flex items-center justify-between text-xs text-[#707070] px-4">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span className="px-1.5 py-0.5 rounded bg-white border border-[#EAE6DE] text-[10px] font-bold">↵</span> Select
            </span>
            <span className="flex items-center gap-1">
              <span className="px-1.5 py-0.5 rounded bg-white border border-[#EAE6DE] text-[10px] font-bold">ESC</span> Close
            </span>
          </div>
          <span className="text-[#8A8A8A] text-[11px]">Jainam Tours and Travels Search</span>
        </div>
      </div>
    </div>,
    document.body
  );
};
