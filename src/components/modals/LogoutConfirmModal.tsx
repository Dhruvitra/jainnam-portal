import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../../context/AppContext';
import { LogOut } from 'lucide-react';

export const LogoutConfirmModal: React.FC = () => {
  const { isLogoutModalOpen, setIsLogoutModalOpen, logout } = useApp();

  useEffect(() => {
    if (!isLogoutModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsLogoutModalOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLogoutModalOpen]);

  if (!isLogoutModalOpen) return null;

  return createPortal(
    <div
      onClick={() => setIsLogoutModalOpen(false)}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-[#EAE6DE] overflow-hidden p-6 text-center animate-in zoom-in-95 duration-150"
      >
        <div className="w-12 h-12 mx-auto rounded-xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center mb-3">
          <LogOut className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-[#292929]">Sign Out of Jainam Tours Admin?</h3>
        <p className="text-xs text-[#707070] mt-1.5 mb-6">
          Your active session will be securely closed. You can log back in at any time with your administrator credentials.
        </p>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsLogoutModalOpen(false)}
            className="flex-1 py-2.5 px-4 rounded-xl border border-[#EAE6DE] text-xs font-semibold text-[#707070] hover:bg-[#FAF9F6] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={logout}
            className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors shadow-sm"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
