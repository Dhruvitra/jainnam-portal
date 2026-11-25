import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Bot, Sliders, ShieldCheck, Clock, Globe, Save } from 'lucide-react';

export const AIAssistantSettingsPage: React.FC = () => {
  const { isAiActive, setIsAiActive, addToast } = useApp();
  const [personality, setPersonality] = useState<'luxury' | 'friendly' | 'professional' | 'concierge'>('luxury');
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(85);
  const [responseDelaySeconds, setResponseDelaySeconds] = useState<number>(3);
  const [autoHandoff, setAutoHandoff] = useState(true);
  const [defaultLanguage, setDefaultLanguage] = useState('English & Gujarati / Hindi auto-detection');

  const handleSave = () => {
    addToast('Assistant Configuration Saved', 'WhatsApp auto-response parameters successfully updated.', 'success');
  };

  return (
    <div className="max-w-4xl space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#292929] tracking-tight">
          Smart Assistant & Auto-Response Settings
        </h1>
        <p className="text-xs sm:text-sm text-[#707070] mt-1">
          Configure automated WhatsApp customer responses, tone of conversation, routing rules, and response pacing.
        </p>
      </div>

      {/* Main Settings Card */}
      <div className="bg-white rounded-2xl border border-[#EAE6DE] p-6 shadow-2xs space-y-6">
        {/* Master Auto-Responder Switch */}
        <div className="flex items-center justify-between pb-6 border-b border-[#EAE6DE]">
          <div>
            <h3 className="text-sm font-bold text-[#292929]">WhatsApp Automated Travel Assistant</h3>
            <p className="text-xs text-[#707070] mt-0.5">
              When enabled, instant greeting and itinerary details are provided to travellers using your verified knowledge base.
            </p>
          </div>
          <button
            onClick={() => setIsAiActive(!isAiActive)}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
              isAiActive ? 'bg-[#C99532]' : 'bg-[#D1D1D1]'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                isAiActive ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Tone & Style Picker */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#707070] mb-3">
            Communication Tone & Courtesy
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                id: 'luxury',
                title: 'Luxury Family & Honeymoon Concierge',
                desc: 'Warm, respectful, and attentive. Emphasizes 4/5-star hospitality, pure veg/Jain meal assurances, and curated private tours.'
              },
              {
                id: 'friendly',
                title: 'Warm & Helpful Travel Consultant',
                desc: 'Friendly, clear, and reassuring. Perfect for family holiday packages, domestic scenic tours, and group bookings.'
              },
              {
                id: 'professional',
                title: 'Executive Corporate Travel Desk',
                desc: 'Concise, punctual, and accurate. Focused on flight schedules, visa requirements, hotel vouchers, and quick confirmations.'
              },
              {
                id: 'concierge',
                title: 'Custom Itinerary Specialist',
                desc: 'Detailed guidance on best travel seasons, sightseeing timings, local Indian cuisine options abroad, and hidden gems.'
              }
            ].map((p) => (
              <div
                key={p.id}
                onClick={() => setPersonality(p.id as any)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  personality === p.id
                    ? 'border-[#C99532] bg-[#FAF4E8] shadow-2xs'
                    : 'border-[#EAE6DE] hover:border-[#C99532]/40 bg-white'
                }`}
              >
                <div className="font-bold text-xs text-[#292929] mb-1">{p.title}</div>
                <p className="text-xs text-[#707070] leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sliders: Accuracy & Delay */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          <div>
            <div className="flex justify-between text-xs font-semibold text-[#292929] mb-1.5">
              <span>Matching Confidence ({confidenceThreshold}%)</span>
              <span className="text-[#8A8A8A] font-mono text-[11px]">Min threshold to reply</span>
            </div>
            <input
              type="range"
              min={60}
              max={95}
              value={confidenceThreshold}
              onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
              className="w-full accent-[#C99532]"
            />
            <p className="text-[11px] text-[#8A8A8A] mt-1">
              If traveller query is complex or ambiguous, it is instantly routed to a senior human travel consultant.
            </p>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-[#292929] mb-1.5">
              <span>Natural Consultant Delay ({responseDelaySeconds}s)</span>
              <span className="text-[#8A8A8A] font-mono text-[11px]">Simulate human typing</span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={responseDelaySeconds}
              onChange={(e) => setResponseDelaySeconds(Number(e.target.value))}
              className="w-full accent-[#C99532]"
            />
            <p className="text-[11px] text-[#8A8A8A] mt-1">
              Maintains an authentic, natural travel agency messaging rhythm on WhatsApp.
            </p>
          </div>
        </div>

        {/* Fallback & Multilingual */}
        <div className="pt-2 border-t border-[#EAE6DE] space-y-4 text-xs">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={autoHandoff}
              onChange={(e) => setAutoHandoff(e.target.checked)}
              className="w-4 h-4 rounded border-[#EAE6DE] text-[#C99532] focus:ring-[#C99532]"
            />
            <span className="font-semibold text-[#292929]">
              Immediate consultant handoff when traveller asks for custom quotation or complex group booking
            </span>
          </label>

          <div>
            <label className="block text-xs font-semibold text-[#292929] mb-1">
              Multi-language Auto-detection
            </label>
            <input
              type="text"
              value={defaultLanguage}
              onChange={(e) => setDefaultLanguage(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#EAE6DE] text-xs font-medium bg-[#FAF9F6] text-[#292929] focus:outline-none focus:border-[#C99532]"
            />
          </div>
        </div>

        <div className="pt-3 flex justify-end">
          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-[#C99532] hover:bg-[#A87922] text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </div>
    </div>
  );
};
