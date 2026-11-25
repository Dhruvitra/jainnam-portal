import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Eye, EyeOff, Lock, Mail, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { ForgotPasswordModal } from './ForgotPasswordModal';

export const LoginPage: React.FC = () => {
  const { login } = useApp();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const redirectPath = searchParams.get('redirect') || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMessage('Please enter a valid administrator or consultant email address.');
      return;
    }
    if (!password) {
      setErrorMessage('Password is required.');
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const success = await login(cleanEmail, password);
      if (success) {
        navigate(redirectPath, { replace: true });
      } else {
        setErrorMessage('Invalid credentials. Please verify your email and password.');
      }
    } catch {
      setErrorMessage('An unexpected authentication error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center bg-[#FAF9F6] relative p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-[460px] z-10">
        {/* Main Login Card */}
        <div className="bg-white rounded-2xl border border-[#EAE6DE] shadow-card p-7 sm:p-9">
          {/* Logo Header */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-3">
              <img
                src="/jainam-logo.png"
                alt="JAINAM TOURS AND TRAVELS"
                className="h-28 w-auto object-contain mx-auto"
              />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#292929]">
              Welcome to Jainam Tours & Travels
            </h1>
            <p className="text-xs sm:text-sm text-[#707070] mt-1.5 font-normal">
              Manage your travel agency operations, bookings & clients.
            </p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="font-medium">{errorMessage}</div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-[#333333] uppercase tracking-wider mb-1.5">
                Staff Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A8A8A]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="name@jainamtours.com"
                  autoComplete="email"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#EAE6DE] bg-white text-[#292929] text-sm focus:outline-none focus:ring-2 focus:ring-[#C99532]/25 focus:border-[#C99532] transition placeholder:text-[#B3B3B3]"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-[#333333] uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(true)}
                  className="text-xs text-[#A87922] hover:text-[#875F18] font-medium transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A8A8A]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                  required
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#EAE6DE] bg-white text-[#292929] text-sm focus:outline-none focus:ring-2 focus:ring-[#C99532]/25 focus:border-[#C99532] transition placeholder:text-[#B3B3B3]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#8A8A8A] hover:text-[#333333]"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-[#EAE6DE] text-[#C99532] focus:ring-[#C99532]/30"
                />
                <span className="text-xs text-[#525252]">Remember me on this browser</span>
              </label>
            </div>

            {/* Primary Golden Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-[#C99532] hover:bg-[#A87922] active:scale-[0.99] text-white font-semibold text-sm transition-all shadow-sm hover:shadow flex items-center justify-center gap-2 disabled:opacity-75 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Admin Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Access Note */}
          <div className="mt-6 pt-4 border-t border-[#EAE6DE]">
            <div className="flex items-center justify-center gap-2 text-xs text-[#707070]">
              <ShieldCheck className="w-4 h-4 text-[#C99532]" />
              <span>Authorized staff access only • Invitation-based access</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center mt-5 text-[11px] text-[#8A8A8A]">
          <p>Jainam Tours and Travels • "By Travellers, for Travellers"</p>
          <p className="text-[#B3B3B3] mt-0.5">Authorized Enterprise Management System</p>
        </div>
      </div>

      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
      />
    </div>
  );
};
