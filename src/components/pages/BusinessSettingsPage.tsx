import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Building2, Save, Upload, MapPin, Phone, Mail, Globe } from 'lucide-react';

export const BusinessSettingsPage: React.FC = () => {
  const { currentUser, addToast } = useApp();
  const [agencyName, setAgencyName] = useState('JAINAM TOURS AND TRAVELS');
  const [tagline, setTagline] = useState('By Travellers, for Travellers');
  const [phone, setPhone] = useState('+91 98201 23456');
  const [supportEmail, setSupportEmail] = useState('dhruviktra.rajput.1379@gmail.com');
  const [address, setAddress] = useState('Shop No. 4 & 5, Mahavir Chambers, Opp. Jain Temple, Zaveri Bazar, Kalbadevi, Mumbai - 400002, Maharashtra, India');
  const [currency, setCurrency] = useState('INR (₹)');
  const [timeZone, setTimeZone] = useState('Asia/Kolkata (UTC+5:30)');
  const [gstin, setGstin] = useState('27AABCJ1234F1Z5');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('Settings Saved', 'Jainam Tours and Travels business profile updated.', 'success');
  };

  return (
    <div className="max-w-4xl space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#292929] tracking-tight">
          Business & Agency Settings
        </h1>
        <p className="text-xs sm:text-sm text-[#707070] mt-1">
          Manage agency legal identity, official branding, GST registration, branch address, and currency defaults.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-[#EAE6DE] p-6 shadow-2xs space-y-6">
        {/* Brand Identity & Logo Preview */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#707070] mb-3">
            Official Brand Identity
          </h3>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl bg-[#FAF9F6] border border-[#EAE6DE] mb-4">
            <div className="p-2 bg-white rounded-xl border border-[#EAE6DE]">
              <img
                src="/jainam-logo.png"
                alt="Jainam Tours and Travels"
                className="h-16 w-auto object-contain"
              />
            </div>
            <div>
              <div className="text-sm font-bold text-[#292929]">JAINAM TOURS AND TRAVELS™</div>
              <div className="text-xs text-[#A87922] italic font-serif">"By Travellers, for Travellers"</div>
              <div className="text-[11px] text-[#8A8A8A] mt-1">
                Official high-resolution brand logo applied across invoices, PDF quotations, WhatsApp headers, and portal screens.
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#292929] mb-1">Company / Legal Name</label>
              <input
                type="text"
                value={agencyName}
                onChange={(e) => setAgencyName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#EAE6DE] text-xs text-[#292929] bg-[#FAF9F6] focus:outline-none focus:border-[#C99532]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#292929] mb-1">Brand Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#EAE6DE] text-xs text-[#292929] bg-[#FAF9F6] focus:outline-none focus:border-[#C99532]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#292929] mb-1">Official Support Email</label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#EAE6DE] text-xs text-[#292929] bg-[#FAF9F6] focus:outline-none focus:border-[#C99532]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#292929] mb-1">Head Office Phone / WhatsApp</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#EAE6DE] text-xs text-[#292929] bg-[#FAF9F6] focus:outline-none focus:border-[#C99532]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#292929] mb-1">GSTIN / Business Registration</label>
              <input
                type="text"
                value={gstin}
                onChange={(e) => setGstin(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#EAE6DE] text-xs text-[#292929] font-mono bg-[#FAF9F6] focus:outline-none focus:border-[#C99532]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#292929] mb-1">Head Office Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#EAE6DE] text-xs text-[#292929] bg-[#FAF9F6] focus:outline-none focus:border-[#C99532]"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-[#EAE6DE]">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#707070] mb-3">
            Financials & Regional Preferences
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#292929] mb-1">Default Quotation Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#EAE6DE] text-xs bg-[#FAF9F6] text-[#292929] focus:outline-none focus:border-[#C99532]"
              >
                <option value="INR (₹)">INR (₹) - Indian Rupee (Primary)</option>
                <option value="USD ($)">USD ($) - US Dollar</option>
                <option value="EUR (€)">EUR (€) - Euro</option>
                <option value="AED (د.إ)">AED (د.إ) - UAE Dirham</option>
                <option value="GBP (£)">GBP (£) - British Pound</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#292929] mb-1">Operating Time Zone</label>
              <select
                value={timeZone}
                onChange={(e) => setTimeZone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#EAE6DE] text-xs bg-[#FAF9F6] text-[#292929] focus:outline-none focus:border-[#C99532]"
              >
                <option value="Asia/Kolkata (UTC+5:30)">Asia/Kolkata (IST - UTC+5:30)</option>
                <option value="Asia/Dubai (UTC+4)">Asia/Dubai (GST - UTC+4)</option>
                <option value="Europe/London (UTC+0)">Europe/London (GMT)</option>
                <option value="Asia/Singapore (UTC+8)">Asia/Singapore (SGT)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-[#EAE6DE] flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[#C99532] hover:bg-[#A87922] text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Business Profile</span>
          </button>
        </div>
      </form>
    </div>
  );
};
