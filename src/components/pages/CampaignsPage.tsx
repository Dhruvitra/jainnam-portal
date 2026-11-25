import React from 'react';
import { useApp } from '../../context/AppContext';
import { Plus } from 'lucide-react';

export const CampaignsPage: React.FC = () => {
  const { campaigns, addToast } = useApp();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#292929] tracking-tight">
            WhatsApp Broadcast Campaigns
          </h1>
          <p className="text-xs sm:text-sm text-[#707070] mt-1">
            Seasonal holiday promotions, festive departure announcements, and group tour broadcasts.
          </p>
        </div>

        <button
          onClick={() => addToast('Campaign Drafted', 'Created new WhatsApp promotional broadcast template.', 'success')}
          className="px-4 py-2.5 rounded-xl bg-[#C99532] hover:bg-[#A87922] text-white text-xs sm:text-sm font-semibold shadow-sm flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Broadcast Campaign</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {campaigns.map((cmp) => (
          <div
            key={cmp.id}
            className="bg-white rounded-2xl border border-[#EAE6DE] p-5 shadow-2xs hover:border-[#C99532] transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    cmp.status === 'Sent'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-[#FAF4E8] text-[#A87922] border border-[#F4E7C8]'
                  }`}
                >
                  {cmp.status}
                </span>
                <span className="text-[11px] text-[#8A8A8A] font-mono">{cmp.scheduledDate}</span>
              </div>
              <h3 className="text-sm font-bold text-[#292929] leading-snug">{cmp.title}</h3>
              <p className="text-xs text-[#707070] mt-1">Target: {cmp.targetAudience}</p>
            </div>

            <div className="p-3 rounded-xl bg-[#FAF9F6] border border-[#EAE6DE] text-xs text-[#525252] font-mono line-clamp-3">
              {cmp.templateSnippet}
            </div>

            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#EAE6DE] text-center text-xs">
              <div>
                <span className="text-[10px] text-[#8A8A8A] block">Recipients</span>
                <strong className="text-[#292929] font-mono">{cmp.recipientsCount}</strong>
              </div>
              <div>
                <span className="text-[10px] text-[#8A8A8A] block">Read Rate</span>
                <strong className="text-emerald-700 font-mono">{cmp.readRate}%</strong>
              </div>
              <div>
                <span className="text-[10px] text-[#8A8A8A] block">Responses</span>
                <strong className="text-[#A87922] font-mono">{cmp.responseRate}%</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
