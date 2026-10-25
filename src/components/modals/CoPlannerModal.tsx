import React, { useState } from 'react';
import { X, Users, UserPlus, Shield, Check, Mail, Share2, Bell } from 'lucide-react';

interface CoPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  partnerOrHost: string;
  onToast: (msg: string) => void;
}

export const CoPlannerModal: React.FC<CoPlannerModalProps> = ({
  isOpen,
  onClose,
  partnerOrHost,
  onToast,
}) => {
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Co-Planner (Full Admin)');

  if (!isOpen) return null;

  const collaborators = [
    {
      name: 'Elena Vasquez',
      role: 'Host & Bride (Primary Owner)',
      email: 'uchaudhary57@gmail.com',
      status: 'Active Now',
      avatar: 'EV',
      isPrimary: true,
    },
    {
      name: partnerOrHost.replace(' (Groom)', ''),
      role: 'Co-Host & Partner (Full Admin)',
      email: 'marcus.v@example.com',
      status: 'Active Today',
      avatar: 'MV',
      isPrimary: false,
    },
    {
      name: 'Camille Dubois',
      role: 'Floral Vendor Collaborator',
      email: 'camille@sonomabloom.com',
      status: 'Contract Review Mode',
      avatar: 'CD',
      isPrimary: false,
    },
  ];

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    onToast(`Co-planning invitation sent to ${inviteEmail} with ${inviteRole} permissions!`);
    setInviteEmail('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#1a1b20] rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-neutral-900 dark:text-white">
                Co-Planning & Shared Workspace
              </h3>
              <p className="text-xs text-neutral-500">Real-time collaborative editing, ledger sign-offs, and approvals</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Active Collaborators */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Active Collaborators</h4>
          <div className="space-y-2">
            {collaborators.map((c, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/50 dark:border-neutral-800"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-500 to-amber-500 text-white flex items-center justify-center text-xs font-bold">
                    {c.avatar}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                      {c.name}
                      {c.isPrimary && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] bg-brand-100 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 font-semibold">
                          Owner
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-neutral-400">{c.email}</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 justify-end">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    {c.status}
                  </span>
                  <span className="text-[10px] text-neutral-400 block mt-0.5">{c.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Invite Co-Planner Form */}
        <form onSubmit={handleSendInvite} className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800 space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-900 dark:text-white">
            <UserPlus className="w-4 h-4 text-brand-500" />
            <span>Invite Co-Planner or Family Member</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <input
              type="email"
              required
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="Enter partner email..."
              className="sm:col-span-2 px-3 py-2 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white"
            />
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="px-2 py-2 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white text-[11px]"
            >
              <option value="Co-Planner (Full Admin)">Full Admin</option>
              <option value="Budget Viewer">Budget Viewer</option>
              <option value="Vendor Liaison">Vendor Liaison</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold bg-brand-500 hover:bg-brand-600 text-white rounded-xl shadow-xs"
            >
              Send Invite Link
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800 text-xs">
          <span className="text-neutral-400">Real-time sync enabled</span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-xl"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
