import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserCheck, Plus, Mail, Shield, UserPlus } from 'lucide-react';
import { InviteMemberModal } from '../modals/InviteMemberModal';

export const TeamMembersPage: React.FC = () => {
  const { teamMembers, currentUser } = useApp();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const isSuperAdmin = currentUser.role?.toLowerCase().includes('director') ||
                       currentUser.role?.toLowerCase().includes('owner') ||
                       currentUser.role?.toLowerCase().includes('admin');

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#292929] tracking-tight">
            Team Management & Staff Access
          </h1>
          <p className="text-xs sm:text-sm text-[#707070] mt-1">
            Authorized consultants, managerial roles, branch permissions, and access credentials.
          </p>
        </div>

        {isSuperAdmin && (
          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#C99532] hover:bg-[#A87922] text-white text-xs sm:text-sm font-semibold shadow-sm flex items-center gap-2 self-start sm:self-auto transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span>Invite Team Member</span>
          </button>
        )}
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {teamMembers.map((member) => (
          <div
            key={member.id}
            className="p-5 bg-white rounded-2xl border border-[#EAE6DE] shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 text-center"
          >
            <div>
              <img
                src={member.avatar}
                alt={member.name}
                className="w-16 h-16 rounded-full mx-auto object-cover border-2 border-[#C99532]/30 mb-3 shadow-2xs"
              />
              <h3 className="text-sm font-bold text-[#292929]">{member.name}</h3>
              <p className="text-xs text-[#707070] font-mono mt-0.5">{member.email}</p>
              <span className="mt-2 inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FAF4E8] text-[#A87922] border border-[#F4E7C8]">
                {member.role}
              </span>
            </div>

            <div className="pt-3 border-t border-[#EAE6DE] grid grid-cols-2 gap-2 text-xs text-center">
              <div>
                <span className="text-[10px] text-[#8A8A8A] block">Active Leads</span>
                <strong className="text-[#292929] font-mono">{member.activeLeads || 0}</strong>
              </div>
              <div>
                <span className="text-[10px] text-[#8A8A8A] block">Win Rate</span>
                <strong className="text-[#C99532] font-mono">{member.conversionRate || 0}%</strong>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Super Admin Invite Modal */}
      <InviteMemberModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
      />
    </div>
  );
};
