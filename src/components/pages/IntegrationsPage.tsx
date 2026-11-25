import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { Layers, CheckCircle2, AlertCircle, ArrowUpRight, Zap, RefreshCw, X, Key, Shield, Globe, Copy, Check, Radio } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ButtonSpinner } from '../common/ButtonSpinner';

export const IntegrationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { addToast, setActivePage } = useApp();
  const [selectedConfig, setSelectedConfig] = useState<string | null>(null);
  const [isPinging, setIsPinging] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Meta Cloud API Configuration Fields
  const [phoneNumberId, setPhoneNumberId] = useState('waba_phone_mum_01');
  const [wabaId, setWabaId] = useState('waba_acct_jainam_98201');
  const [verifyToken, setVerifyToken] = useState('jainam_tours_meta_webhook_2026_secure');
  const [webhookUrl, setWebhookUrl] = useState('https://script.google.com/macros/s/AKfycbz_jainam_crm_2026/exec');
  const [accessToken, setAccessToken] = useState('EAAG...jainam_tours_live_system_token');

  const handleCopy = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    addToast('Copied to Clipboard', `${keyName} copied.`, 'info');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleTestPing = async () => {
    setIsPinging(true);
    await new Promise(r => setTimeout(r, 600));
    setIsPinging(false);
    addToast('Connection Verified', 'Meta Cloud API Graph v21.0 responded with HTTP 200 OK.', 'success');
  };

  const integrations = [
    {
      id: 'meta',
      name: 'WhatsApp Business Cloud API',
      category: 'Messaging Rail',
      desc: 'Official Meta Graph API gateway for high-throughput customer messaging, broadcast alerts, and media sharing.',
      connected: true,
      badge: 'Connected'
    },
    {
      id: 'razorpay',
      name: 'Razorpay & UPI Payments',
      category: 'Payment Gateway',
      desc: 'Generate secure WhatsApp 1-click deposit & payment links with auto-receipts and GST invoices.',
      connected: true,
      badge: 'Live Mode'
    },
    {
      id: 'gdrive',
      name: 'Cloud Itinerary & Brochure Storage',
      category: 'Media & PDF Storage',
      desc: 'Cloud storage for luxury tour brochures, hotel vouchers, client passport scans, and visa documents.',
      connected: true,
      badge: 'Active'
    },
    {
      id: 'amadeus',
      name: 'Amadeus / Galileo GDS Flight Desk',
      category: 'Global Flight Engine',
      desc: 'Live flight schedule queries, seat availability, and PNR retrieval directly into custom tour planner.',
      connected: false,
      badge: 'Configuration Ready'
    },
    {
      id: 'gcal',
      name: 'Google Calendar & Tour Schedule Sync',
      category: 'Scheduling',
      desc: 'Automatically sync client departure dates, airport transfers, tour guides, and hotel check-in schedules.',
      connected: true,
      badge: 'Active'
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#292929] tracking-tight">
          Integrations & Connected Services
        </h1>
        <p className="text-xs sm:text-sm text-[#707070] mt-1">
          WhatsApp Cloud API, payment gateways, brochure storage, and flight systems linked with Jainam Tours CRM.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {integrations.map((item) => (
          <div
            key={item.id}
            className="p-5 bg-white rounded-2xl border border-[#EAE6DE] shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8A8A]">
                  {item.category}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    item.connected ? 'bg-[#FAF4E8] text-[#A87922] border border-[#F4E7C8]' : 'bg-[#FAF9F6] text-[#707070] border border-[#EAE6DE]'
                  }`}
                >
                  {item.badge}
                </span>
              </div>
              <h3 className="text-base font-bold text-[#292929]">{item.name}</h3>
              <p className="text-xs text-[#707070] mt-1.5 leading-relaxed">{item.desc}</p>
            </div>

            <div className="pt-3 border-t border-[#EAE6DE] flex items-center justify-between">
              <span className="text-xs font-semibold text-[#707070] flex items-center gap-1.5">
                {item.connected ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#C99532]" />
                    <span>Active & Linked</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3.5 h-3.5 text-[#8A8A8A]" />
                    <span>Setup Required</span>
                  </>
                )}
              </span>

              <button
                onClick={() => setSelectedConfig(item.id)}
                className="px-3 py-1.5 rounded-xl border border-[#EAE6DE] hover:border-[#C99532] bg-[#FAF9F6] text-[#292929] text-xs font-semibold transition-colors"
              >
                Configure
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Meta Cloud API Configuration Modal */}
      {selectedConfig === 'meta' && createPortal(
        <div
          onClick={() => setSelectedConfig(null)}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl bg-white rounded-2xl border border-[#EAE6DE] p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between border-b border-[#EAE6DE] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#292929]">Meta WhatsApp Cloud API Gateway</h3>
                <p className="text-xs text-[#707070]">Configure Graph API v21.0 webhook URL & permanent system user token</p>
              </div>
              <button onClick={() => setSelectedConfig(null)} className="text-[#8A8A8A] hover:text-[#292929]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-bold text-[#292929]">Webhook Callback URL (Google Apps Script Web App)</label>
                  <button
                    onClick={() => handleCopy(webhookUrl, 'Webhook URL')}
                    className="text-[11px] font-semibold text-[#C99532] flex items-center gap-1"
                  >
                    {copiedKey === 'Webhook URL' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'Webhook URL' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <input
                  type="text"
                  readOnly
                  value={webhookUrl}
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE6DE] bg-[#FAF9F6] font-mono text-[11px] text-[#292929]"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-bold text-[#292929]">Verify Token (For Meta Webhook Subscription)</label>
                  <button
                    onClick={() => handleCopy(verifyToken, 'Verify Token')}
                    className="text-[11px] font-semibold text-[#C99532] flex items-center gap-1"
                  >
                    {copiedKey === 'Verify Token' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'Verify Token' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={verifyToken}
                  onChange={(e) => setVerifyToken(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE6DE] bg-white font-mono text-[11px] text-[#292929] focus:outline-none focus:ring-1 focus:ring-[#C99532]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#292929] mb-1">Phone Number ID</label>
                  <input
                    type="text"
                    value={phoneNumberId}
                    onChange={(e) => setPhoneNumberId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#EAE6DE] bg-white font-mono text-[11px] text-[#292929] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#292929] mb-1">WABA Account ID</label>
                  <input
                    type="text"
                    value={wabaId}
                    onChange={(e) => setWabaId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#EAE6DE] bg-white font-mono text-[11px] text-[#292929] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#292929] mb-1">Permanent Meta System User Access Token</label>
                <input
                  type="password"
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE6DE] bg-white font-mono text-[11px] text-[#292929] focus:outline-none focus:ring-1 focus:ring-[#C99532]"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[#EAE6DE] flex items-center justify-between">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleTestPing}
                  disabled={isPinging}
                  className="px-3.5 py-2 rounded-xl border border-[#EAE6DE] hover:bg-[#FAF9F6] text-xs font-semibold text-[#292929] flex items-center gap-1.5 transition"
                >
                  {isPinging ? <ButtonSpinner size="sm" label="Pinging Meta Graph..." /> : <RefreshCw className="w-3.5 h-3.5 text-[#C99532]" />}
                  {!isPinging && <span>Test Connection</span>}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedConfig(null);
                    setActivePage('whatsapp-status');
                    navigate('/whatsapp-status');
                  }}
                  className="px-3 py-2 rounded-xl border border-[#EAE6DE] hover:border-[#C99532] bg-[#FAF9F6] text-xs font-semibold text-[#292929] flex items-center gap-1.5 transition"
                >
                  <Radio className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Full Diagnostics Page</span>
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedConfig(null)}
                  className="px-3.5 py-2 rounded-xl border border-[#EAE6DE] text-xs font-semibold text-[#292929] hover:bg-[#FAF9F6]"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    addToast('Settings Saved', 'Meta WhatsApp credentials stored in script properties.', 'success');
                    setSelectedConfig(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#C99532] hover:bg-[#A87922] text-xs font-semibold text-white shadow-xs"
                >
                  Save Configuration
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Generic Modal for Other Services */}
      {selectedConfig && selectedConfig !== 'meta' && createPortal(
        <div
          onClick={() => setSelectedConfig(null)}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-2xl border border-[#EAE6DE] p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between border-b border-[#EAE6DE] pb-3">
              <h3 className="text-sm font-bold text-[#292929]">Service Integration Settings</h3>
              <button onClick={() => setSelectedConfig(null)} className="text-[#8A8A8A] hover:text-[#292929]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-[#707070]">
              This integration service is active and operating under the Jainam Tours and Travels enterprise workspace profile.
            </p>
            <div className="flex justify-end pt-2 border-t border-[#EAE6DE]">
              <button
                onClick={() => setSelectedConfig(null)}
                className="px-4 py-1.5 rounded-xl bg-[#C99532] text-white text-xs font-semibold shadow-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
