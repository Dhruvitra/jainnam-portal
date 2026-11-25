import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../../context/AppContext';
import { X, Smartphone, Check, ShieldCheck, QrCode } from 'lucide-react';

export const AddWhatsAppNumberModal: React.FC = () => {
  const { isAddNumberModalOpen, setIsAddNumberModalOpen, addWhatsAppNumber } = useApp();
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('IN (+91)');
  const [isDefault, setIsDefault] = useState(false);
  const [step, setStep] = useState<'form' | 'qr'>('form');

  const handleClose = () => {
    setStep('form');
    setIsAddNumberModalOpen(false);
  };

  useEffect(() => {
    if (!isAddNumberModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAddNumberModalOpen]);

  if (!isAddNumberModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phoneNumber) return;
    setStep('qr');
  };

  const handleFinishConnection = () => {
    addWhatsAppNumber({
      name,
      phoneNumber,
      countryCode,
      status: 'connected',
      isDefault
    });
    setStep('form');
    setName('');
    setPhoneNumber('');
    setIsAddNumberModalOpen(false);
  };

  return createPortal(
    <div
      onClick={handleClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#EAE6DE] overflow-hidden animate-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#EAE6DE] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FAF4E8] text-[#C99532] border border-[#F4E7C8] flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#292929]">Connect WhatsApp Number</h3>
              <p className="text-xs text-[#707070]">Multi-branch WhatsApp Business line configuration</p>
            </div>
          </div>
          <button
            onClick={() => {
              setStep('form');
              setIsAddNumberModalOpen(false);
            }}
            className="p-1.5 text-[#8A8A8A] hover:text-[#292929] rounded-lg hover:bg-[#FAF9F6] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'form' ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#292929] uppercase tracking-wider mb-1.5">
                  Line Label / Branch Desk
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ahmedabad Branch Desk or Europe Custom Desk"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE6DE] bg-[#FAF9F6] text-[#292929] text-sm focus:outline-none focus:border-[#C99532] placeholder:text-[#8A8A8A]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="block text-xs font-semibold text-[#292929] uppercase tracking-wider mb-1.5">
                    Country Code
                  </label>
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE6DE] bg-[#FAF9F6] text-[#292929] text-sm focus:outline-none focus:border-[#C99532]"
                  >
                    <option value="IN (+91)">IN (+91)</option>
                    <option value="UAE (+971)">UAE (+971)</option>
                    <option value="UK (+44)">UK (+44)</option>
                    <option value="US (+1)">US (+1)</option>
                    <option value="SG (+65)">SG (+65)</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-[#292929] uppercase tracking-wider mb-1.5">
                    WhatsApp Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+91 98201 00000"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE6DE] bg-[#FAF9F6] text-[#292929] text-sm focus:outline-none focus:border-[#C99532] placeholder:text-[#8A8A8A]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isDefault}
                    onChange={(e) => setIsDefault(e.target.checked)}
                    className="w-4 h-4 rounded border-[#EAE6DE] text-[#C99532] focus:ring-[#C99532]"
                  />
                  <div>
                    <span className="text-xs font-semibold text-[#292929] block">Set as Primary Default Line</span>
                    <span className="text-[11px] text-[#707070]">New holiday inquiries will default to this number</span>
                  </div>
                </label>
              </div>

              <div className="p-3 rounded-xl bg-[#FAF9F6] border border-[#EAE6DE] text-xs text-[#707070] flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C99532] flex-shrink-0 mt-0.5" />
                <span>Cloud API Gateway: Pair this business line to enable WhatsApp customer conversation routing.</span>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddNumberModalOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-[#EAE6DE] text-sm font-medium text-[#707070] hover:bg-[#FAF9F6]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#C99532] hover:bg-[#A87922] text-white text-sm font-semibold shadow-sm transition-colors"
                >
                  Proceed to QR Pairing
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-2 space-y-4">
              <div className="w-12 h-12 mx-auto rounded-xl bg-[#FAF4E8] text-[#C99532] border border-[#F4E7C8] flex items-center justify-center">
                <QrCode className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-[#292929]">Scan QR Code with WhatsApp</h4>
                <p className="text-xs text-[#707070] mt-1 max-w-sm mx-auto">
                  Open WhatsApp on your mobile phone &gt; Settings &gt; Linked Devices &gt; Link a Device.
                </p>
              </div>

              {/* Mock QR Code Pattern */}
              <div className="inline-block p-4 bg-white rounded-2xl border-2 border-dashed border-[#F4E7C8] shadow-inner">
                <div className="w-48 h-48 bg-[#292929] rounded-xl p-3 flex flex-col justify-between relative overflow-hidden">
                  <div className="grid grid-cols-4 gap-2 h-full w-full opacity-80">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div
                        key={i}
                        className={`rounded-sm ${i % 2 === 0 ? 'bg-white' : i % 3 === 0 ? 'bg-[#C99532]' : 'bg-transparent'}`}
                      />
                    ))}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="p-2 rounded-lg bg-[#C99532] text-white shadow-lg font-bold text-xs">
                      PAIRING
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-xs text-[#707070]">
                Pairing line: <span className="font-semibold text-[#292929]">{phoneNumber || '+91 98201 00000'}</span>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('form')}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-[#EAE6DE] text-sm font-medium text-[#707070] hover:bg-[#FAF9F6]"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleFinishConnection}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#C99532] hover:bg-[#A87922] text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors"
                >
                  <Check className="w-4 h-4" />
                  <span>Confirm Pairing</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
