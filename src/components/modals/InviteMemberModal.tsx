import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../../context/AppContext';
import { X, UserPlus, Mail, Lock, Shield, User, Smartphone } from 'lucide-react';

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InviteMemberModal: React.FC<InviteMemberModalProps> = ({ isOpen, onClose }) => {
  const { inviteMember, addToast, currentUser } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'Admin' | 'Employee'>('Employee');
  const [title, setTitle] = useState('Travel Consultant');
  const [password, setPassword] = useState('Password@1379');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
    setErrorMessage(null);

    if (!name || !email || !password) {
      setErrorMessage('Full name, email address, and initial password are required.');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Initial password must be at least 8 characters long.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = inviteMember({
        name,
        email: email.trim().toLowerCase(),
        role,
        title,
        password
      });

      if (!res.success) {
        setErrorMessage(res.error || 'Failed to add member.');
        setIsSubmitting(false);
        return;
      }

      addToast('Member Invited', `${name} has been granted ${role} access to Jainam Tours CRM.`, 'success');
      onClose();
      // Reset form
      setName('');
      setEmail('');
      setTitle('Travel Consultant');
      setPassword('Password@1379');
    } catch (err: any) {
      setErrorMessage(err.message || 'Error creating member.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#EAE6DE] overflow-hidden animate-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#EAE6DE] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAF4E8] text-[#C99532] border border-[#F4E7C8] flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#292929]">Invite Team Member</h3>
              <p className="text-xs text-[#707070]">Only Super Admin can provision new CRM staff accounts</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#8A8A8A] hover:text-[#292929] rounded-lg hover:bg-[#FAF9F6] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              {errorMessage}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#292929] uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8A8A8A]">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Anand Vora"
                  required
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#EAE6DE] bg-[#FAF9F6] text-xs text-[#292929] focus:outline-none focus:border-[#C99532]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#292929] uppercase tracking-wider mb-1.5">
                Staff Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8A8A8A]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@jainamtours.com"
                  required
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#EAE6DE] bg-[#FAF9F6] text-xs text-[#292929] focus:outline-none focus:border-[#C99532]"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#292929] uppercase tracking-wider mb-1.5">
                System Role & Permissions
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8A8A8A]">
                  <Shield className="w-4 h-4" />
                </div>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#EAE6DE] bg-[#FAF9F6] text-xs text-[#292929] focus:outline-none focus:border-[#C99532]"
                >
                  <option value="Employee">Employee (Consultant)</option>
                  <option value="Admin">Admin (Manager)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#292929] uppercase tracking-wider mb-1.5">
                Job Designation / Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Kashmir Tour Specialist"
                required
                className="w-full px-3 py-2 rounded-xl border border-[#EAE6DE] bg-[#FAF9F6] text-xs text-[#292929] focus:outline-none focus:border-[#C99532]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#292929] uppercase tracking-wider mb-1.5">
              Initial Password / Security Passcode
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8A8A8A]">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#EAE6DE] bg-[#FAF9F6] text-xs text-[#292929] font-mono focus:outline-none focus:border-[#C99532]"
              />
            </div>
            <p className="text-[11px] text-[#8A8A8A] mt-1">
              Member can use this email and password to log in immediately.
            </p>
          </div>

          <div className="pt-3 border-t border-[#EAE6DE] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#EAE6DE] text-xs font-semibold text-[#707070] hover:bg-[#FAF9F6]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-[#C99532] hover:bg-[#A87922] text-white text-xs font-bold shadow-sm transition-colors"
            >
              {isSubmitting ? 'Provisioning...' : 'Provision Member Account'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};
