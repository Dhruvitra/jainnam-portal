import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, Shield, Lock, Bell, CheckCircle2 } from 'lucide-react';

export const AdminProfilePage: React.FC = () => {
  const { currentUser, addToast } = useApp();
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [newPassword, setNewPassword] = useState('');

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('Profile Updated', 'Administrator profile credentials updated.', 'success');
  };

  return (
    <div className="max-w-2xl space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#292929] tracking-tight">
          Administrator Profile
        </h1>
        <p className="text-xs sm:text-sm text-[#707070] mt-1">
          Manage your personal agency administrator credentials and security settings.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[#EAE6DE] p-6 shadow-2xs space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-[#EAE6DE]">
          <div className="w-16 h-16 rounded-2xl bg-[#FAF4E8] border border-[#F4E7C8] flex items-center justify-center text-[#C99532] text-xl font-bold shadow-2xs">
            JS
          </div>
          <div>
            <h2 className="text-base font-bold text-[#292929]">{currentUser.name}</h2>
            <p className="text-xs text-[#707070]">{currentUser.role} • {currentUser.businessName}</p>
            <span className="mt-1 inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-[#FAF4E8] text-[#A87922] border border-[#F4E7C8]">
              Managing Director & Owner
            </span>
          </div>
        </div>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#292929] mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#EAE6DE] text-xs text-[#292929] bg-[#FAF9F6] focus:outline-none focus:border-[#C99532]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#292929] mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#EAE6DE] text-xs text-[#292929] bg-[#FAF9F6] focus:outline-none focus:border-[#C99532]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#292929] mb-1">Change Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Leave blank to keep current password"
              className="w-full px-3 py-2 rounded-xl border border-[#EAE6DE] text-xs text-[#292929] bg-[#FAF9F6] focus:outline-none focus:border-[#C99532]"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#C99532] hover:bg-[#A87922] text-white text-xs font-bold shadow-sm transition-colors"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
