import React, { useState, useEffect, useRef } from 'react';
import { useApp, ToastItem } from '../../context/AppContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

interface ToastProps {
  toast: ToastItem;
  onClose: (id: string) => void;
}

const SingleToast: React.FC<ToastProps> = ({ toast, onClose }) => {
  const [isExiting, setIsExiting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(100);
  const duration = 5000; // 5 seconds display
  const intervalRef = useRef<any>(null);
  const remainingTimeRef = useRef(duration);
  const lastTickRef = useRef(Date.now());

  // Handle smooth closing animation
  const handleDismiss = () => {
    if (isExiting) return;
    setIsExiting(true);
    setTimeout(() => {
      onClose(toast.id);
    }, 280); // matches toast-animate-out duration
  };

  useEffect(() => {
    lastTickRef.current = Date.now();
    intervalRef.current = setInterval(() => {
      if (!isPaused) {
        const now = Date.now();
        const delta = now - lastTickRef.current;
        lastTickRef.current = now;
        remainingTimeRef.current -= delta;

        const newProgress = Math.max(0, (remainingTimeRef.current / duration) * 100);
        setProgress(newProgress);

        if (remainingTimeRef.current <= 0) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          handleDismiss();
        }
      } else {
        lastTickRef.current = Date.now();
      }
    }, 40);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused]);

  let Icon = Info;
  let iconContainerStyle = 'bg-[#FAF4E8] text-[#C99532] border-[#F4E7C8]';
  let barGradient = 'from-[#C99532] to-[#A87922]';

  if (toast.type === 'success') {
    Icon = CheckCircle2;
    iconContainerStyle = 'bg-emerald-50 text-emerald-600 border-emerald-200';
    barGradient = 'from-emerald-500 to-emerald-700';
  } else if (toast.type === 'error') {
    Icon = AlertCircle;
    iconContainerStyle = 'bg-red-50 text-red-600 border-red-200';
    barGradient = 'from-red-500 to-red-600';
  } else if (toast.type === 'warning') {
    Icon = AlertTriangle;
    iconContainerStyle = 'bg-amber-50 text-amber-600 border-amber-200';
    barGradient = 'from-amber-500 to-amber-600';
  } else if (toast.type === 'info') {
    Icon = Info;
    iconContainerStyle = 'bg-[#FAF4E8] text-[#C99532] border-[#F4E7C8]';
    barGradient = 'from-[#C99532] to-[#A87922]';
  }

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={`pointer-events-auto relative w-full max-w-sm rounded-2xl bg-white/95 backdrop-blur-md border border-[#EAE6DE] shadow-xl shadow-black/8 p-4 overflow-hidden transition-all duration-200 hover:shadow-2xl ${
        isExiting ? 'toast-animate-out' : 'toast-animate-in'
      }`}
      style={{
        transformOrigin: 'top center'
      }}
    >
      <div className="flex items-start gap-3">
        {/* Leading Status Icon */}
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 border ${iconContainerStyle} shadow-2xs`}>
          <Icon className="w-4 h-4 stroke-[2.2]" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-2">
          <h5 className="text-xs font-bold text-[#292929] leading-tight">
            {toast.title}
          </h5>
          <p className="text-xs text-[#707070] mt-1 leading-relaxed font-normal">
            {toast.message}
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="p-1 rounded-lg text-[#8A8A8A] hover:text-[#292929] hover:bg-[#FAF9F6] transition-colors -mr-1 -mt-1 flex-shrink-0"
          title="Dismiss notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Animated Subtle Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#FAF9F6]">
        <div
          className={`h-full bg-gradient-to-r ${barGradient} transition-all duration-75 ease-linear`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 sm:top-5 sm:right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <SingleToast
          key={toast.id}
          toast={toast}
          onClose={removeToast}
        />
      ))}
    </div>
  );
};
