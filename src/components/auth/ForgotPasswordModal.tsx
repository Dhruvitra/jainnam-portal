import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Mail, CheckCircle2, ArrowRight } from 'lucide-react';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 600);
  };

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#EAE6DE] overflow-hidden animate-in zoom-in-95 duration-150"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-[#8A8A8A] hover:text-[#292929] rounded-lg hover:bg-[#FAF9F6]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6">
          {!isSubmitted ? (
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#FAF4E8] text-[#C99532] flex items-center justify-center mb-4">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#292929]">Reset Admin Password</h3>
              <p className="text-xs text-[#525252] mt-1.5 mb-5">
                Enter your registered administrator email address and we'll send password recovery instructions.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#333333] uppercase tracking-wider mb-1.5">
                    Admin Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@jainamtours.com"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE6DE] text-sm text-[#292929] focus:outline-none focus:ring-2 focus:ring-[#C99532]/20 focus:border-[#C99532]"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-[#EAE6DE] text-xs font-semibold text-[#525252] hover:bg-[#FAF9F6]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-[#C99532] hover:bg-[#A87922] text-white text-xs font-bold transition flex items-center justify-center gap-1.5"
                  >
                    {isLoading ? 'Sending...' : 'Send Recovery Link'}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#FAF4E8] text-[#C99532] flex items-center justify-center mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#292929]">Check Your Inbox</h3>
              <p className="text-xs text-[#525252] mt-1.5 mb-5">
                Recovery instructions have been sent to <strong>{email}</strong>.
              </p>
              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-[#FAF9F6] border border-[#EAE6DE] text-xs font-semibold text-[#292929] hover:bg-[#EAE6DE]"
              >
                Return to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
