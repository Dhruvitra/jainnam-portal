import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Smartphone, Plus, Radio, ArrowUpRight } from 'lucide-react';

export const WhatsAppNumbersPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    whatsappNumbers,
    selectedNumberId,
    setSelectedNumberId,
    setDefaultWhatsAppNumber,
    setIsAddNumberModalOpen,
    setActivePage,
    addToast
  } = useApp();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#292929] tracking-tight">
            WhatsApp Business Communication Lines
          </h1>
          <p className="text-xs sm:text-sm text-[#707070] mt-1">
            Manage multi-office WhatsApp Business phone numbers, desk routing, and customer communication channels.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={() => {
              setActivePage('whatsapp-status');
              navigate('/whatsapp-status');
            }}
            className="px-3.5 py-2.5 rounded-xl border border-[#EAE6DE] hover:border-[#C99532] bg-white text-[#292929] text-xs sm:text-sm font-semibold shadow-2xs flex items-center gap-2 transition"
          >
            <Radio className="w-4 h-4 text-emerald-600" />
            <span>Meta Gateway Status</span>
          </button>

          <button
            onClick={() => setIsAddNumberModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#C99532] hover:bg-[#A87922] text-white text-xs sm:text-sm font-semibold shadow-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Connect New Number</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {whatsappNumbers.map((num) => {
          const isSelected = num.id === selectedNumberId;
          return (
            <div
              key={num.id}
              className={`p-5 rounded-2xl border transition-all bg-white flex flex-col justify-between space-y-4 ${
                isSelected
                  ? 'border-[#C99532] ring-2 ring-[#C99532]/10 shadow-card'
                  : 'border-[#EAE6DE] shadow-2xs hover:border-[#C99532]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-[#FAF4E8] text-[#C99532] border border-[#F4E7C8] flex items-center justify-center">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#292929]">{num.name}</h3>
                      <p className="text-xs text-[#707070] font-mono">{num.phoneNumber}</p>
                    </div>
                  </div>
                  {num.isDefault && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FAF4E8] text-[#A87922] border border-[#F4E7C8]">
                      PRIMARY DESK
                    </span>
                  )}
                </div>

                <div className="p-3 rounded-xl bg-[#FAF9F6] border border-[#EAE6DE] text-xs space-y-1.5">
                  <div className="flex justify-between text-[#707070]">
                    <span>Country / Region:</span>
                    <strong className="text-[#292929]">{num.countryCode}</strong>
                  </div>
                  <div className="flex justify-between text-[#707070]">
                    <span>Total Conversations:</span>
                    <strong className="text-[#292929] font-mono">{num.conversationsCount} enquiries</strong>
                  </div>
                  <div className="flex justify-between text-[#707070]">
                    <span>Status:</span>
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Connected (Active Line)
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#EAE6DE] flex items-center justify-between gap-2">
                {!num.isDefault && (
                  <button
                    onClick={() => setDefaultWhatsAppNumber(num.id)}
                    className="text-xs text-[#707070] hover:text-[#292929] font-medium"
                  >
                    Set as Default
                  </button>
                )}
                {num.isDefault && <span className="text-xs text-[#A87922] font-medium">Default Number</span>}

                <button
                  onClick={() => {
                    setSelectedNumberId(num.id);
                    addToast('Selected Line', `Switched active desk line to ${num.name}`, 'info');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    isSelected
                      ? 'bg-[#FAF4E8] text-[#A87922] border border-[#F4E7C8]'
                      : 'bg-[#FAF9F6] hover:bg-white text-[#292929] border border-[#EAE6DE]'
                  }`}
                >
                  {isSelected ? 'Currently Selected' : 'Select Line'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
