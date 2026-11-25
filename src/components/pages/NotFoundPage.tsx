import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#FAF9F6] p-6 text-center select-none">
      <div className="w-full max-w-md bg-white border border-[#EAE6DE] rounded-2xl p-8 shadow-card space-y-5 animate-in fade-in duration-200">
        <div className="flex justify-center">
          <img
            src="/jainam-logo.png"
            alt="JAINAM TOURS AND TRAVELS"
            className="h-20 w-auto object-contain"
          />
        </div>

        <div className="w-16 h-16 rounded-2xl bg-[#FAF4E8] text-[#C99532] border border-[#F4E7C8] flex items-center justify-center mx-auto">
          <Compass className="w-8 h-8 animate-pulse" />
        </div>

        <div>
          <h1 className="text-2xl font-extrabold text-[#292929] tracking-tight">
            404 — Page Not Found
          </h1>
          <p className="text-xs text-[#707070] mt-2 leading-relaxed">
            The travel module or destination page you are looking for doesn't exist or has been moved.
          </p>
        </div>

        <button
          onClick={() => navigate('/dashboard')}
          className="w-full py-2.5 px-4 rounded-xl bg-[#C99532] hover:bg-[#A87922] text-white text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </button>

        <p className="text-[11px] text-[#8A8A8A]">
          Jainam Tours and Travels • "By Travellers, for Travellers"
        </p>
      </div>
    </div>
  );
};
