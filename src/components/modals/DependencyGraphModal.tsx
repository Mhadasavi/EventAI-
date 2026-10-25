import React from 'react';
import { X, GitFork, Lock, CheckCircle2, ArrowDown, Clock, ShieldAlert } from 'lucide-react';

interface DependencyGraphModalProps {
  isOpen: boolean;
  onClose: () => void;
  onToast: (msg: string) => void;
}

export const DependencyGraphModal: React.FC<DependencyGraphModalProps> = ({
  isOpen,
  onClose,
  onToast,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200" role="dialog" aria-modal="true" aria-labelledby="dependency-modal-title">
      <div className="relative w-full max-w-xl bg-white dark:bg-[#1a1b20] rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <GitFork className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="dependency-modal-title" className="font-serif text-lg font-bold text-neutral-900 dark:text-white">
                  Automated Dependency Graph
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
                  Rule DEP-882
                </span>
              </div>
              <p className="text-xs text-neutral-500">Execution prerequisites and upstream milestone locks</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Visual Graph Chain */}
        <div className="space-y-3 py-2">
          {/* Node 1: Completed Upstream */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/50 flex items-start justify-between">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5" />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Step 1 • Completed</span>
                <h4 className="text-xs font-bold text-neutral-900 dark:text-white">Dispatch Digital & Formal Invitations</h4>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">Minted RSVP portal connected • 180 suites mailed</p>
              </div>
            </div>
            <span className="text-[10px] font-semibold text-emerald-600 bg-white dark:bg-neutral-800 px-2 py-0.5 rounded-lg border border-emerald-200">Done June 12</span>
          </div>

          <div className="flex justify-center -my-1">
            <ArrowDown className="w-4 h-4 text-neutral-400" />
          </div>

          {/* Node 2: In-Progress Blocker */}
          <div className="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-300/80 dark:border-amber-800 flex items-start justify-between shadow-xs">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-amber-500 mt-0.5 animate-pulse" />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Step 2 • Active Prerequisite (Closing in 18d)</span>
                <h4 className="text-xs font-bold text-neutral-900 dark:text-white">Finalize RSVP Headcount & Dietary Matrix</h4>
                <p className="text-[11px] text-neutral-600 dark:text-neutral-300 mt-0.5">
                  Currently 168 / 180 confirmed. Escrow headcount locks on July 20 to prevent catering overages.
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-amber-600 bg-white dark:bg-neutral-800 px-2 py-0.5 rounded-lg border border-amber-200">Closes July 20</span>
          </div>

          <div className="flex justify-center -my-1">
            <ArrowDown className="w-4 h-4 text-neutral-400" />
          </div>

          {/* Node 3: Locked Dependent Task */}
          <div className="p-3.5 rounded-2xl bg-neutral-100/60 dark:bg-neutral-900/40 border border-dashed border-neutral-300 dark:border-neutral-700 flex items-start justify-between opacity-85">
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-neutral-400 mt-0.5" />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Step 3 • Locked by DEP-882</span>
                <h4 className="text-xs font-bold text-neutral-700 dark:text-neutral-300">Order Escort Cards & Final Seating Charts</h4>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Auto-unlocks instantly when Step 2 reaches 100% confirmation or July 20 deadline arrives.
                </p>
              </div>
            </div>
            <span className="text-[10px] font-semibold text-neutral-400 bg-neutral-200/60 dark:bg-neutral-800 px-2 py-0.5 rounded-lg">Auto-Unlocks in 18d</span>
          </div>
        </div>

        {/* Explainability Banner */}
        <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/50 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-400 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-brand-500 flex-shrink-0" />
          <span>Rule DEP-882 prevents unrecoverable stationery reprint fees (~$450) due to last-minute guest cancellations.</span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800 text-xs">
          <button
            onClick={() => {
              onToast('Manually bypassed dependency lock for testing purposes.');
              onClose();
            }}
            className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 underline text-[11px]"
          >
            Bypass Rule (Admin Override)
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-brand-500 hover:bg-brand-600 text-white rounded-xl shadow-xs"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
