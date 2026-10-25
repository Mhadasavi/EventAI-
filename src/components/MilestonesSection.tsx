import React, { useState } from 'react';
import { Lock, CheckCircle2, Clock, AlertCircle, ChevronRight, ExternalLink } from 'lucide-react';
import { Milestone } from '../types';

interface MilestonesSectionProps {
  milestones: Milestone[];
  onToggleMilestone: (id: string) => void;
  onViewDependency: () => void;
  onViewQuotes: () => void;
  onApproveQuotes: () => void;
  onToast: (msg: string) => void;
  onOpenCopilot: (prompt: string) => void;
}

export const MilestonesSection: React.FC<MilestonesSectionProps> = ({
  milestones,
  onToggleMilestone,
  onViewDependency,
  onViewQuotes,
  onApproveQuotes,
  onToast,
  onOpenCopilot,
}) => {
  const [filter, setFilter] = useState<'all' | 'high' | 'blocked' | 'completed'>('all');

  const filtered = milestones.filter((m) => {
    if (filter === 'high') return m.priority === 'High';
    if (filter === 'blocked') return m.status === 'Blocked' || !!m.blockedBy;
    if (filter === 'completed') return m.status === 'Completed';
    return true;
  });

  return (
    <div className="rounded-3xl bg-white dark:bg-[#18191e] border border-neutral-200/80 dark:border-neutral-800 p-6 shadow-sm space-y-4">
      {/* Card Header & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="font-serif text-xl font-bold text-neutral-900 dark:text-white">
            Critical Milestones & Dependencies
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Chronological execution path with automated prerequisite blockers.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-neutral-100 dark:bg-neutral-800/80 p-1 rounded-xl text-[11px] font-medium self-start sm:self-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 rounded-lg transition ${
              filter === 'all'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white font-semibold shadow-xs'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            All ({milestones.length})
          </button>
          <button
            onClick={() => setFilter('high')}
            className={`px-2.5 py-1 rounded-lg transition ${
              filter === 'high'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white font-semibold shadow-xs'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            High Priority
          </button>
          <button
            onClick={() => setFilter('blocked')}
            className={`px-2.5 py-1 rounded-lg transition ${
              filter === 'blocked'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white font-semibold shadow-xs'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Blocked
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-2.5 py-1 rounded-lg transition ${
              filter === 'completed'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white font-semibold shadow-xs'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Automated Dependency Lock Alert Bar */}
      <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900/40 text-xs">
        <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
          <Lock className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <span className="font-bold text-amber-900 dark:text-amber-200">Rule DEP-882:</span>
          <span className="text-amber-800 dark:text-amber-300">
            {' '}
            Task <strong className="font-semibold">"Order Escort Cards & Seating Charts"</strong> is locked until final
            RSVP headcount closes in 18 days.
          </span>
        </div>
        <button
          onClick={onViewDependency}
          className="text-[11px] font-semibold text-amber-700 dark:text-amber-300 underline hover:no-underline whitespace-nowrap cursor-pointer"
        >
          View Dependency Graph
        </button>
      </div>

      {/* Chronological Milestone Checklist Items */}
      <div className="space-y-2.5 pt-1">
        {filtered.map((ms) => {
          const isBlocked = ms.status === 'Blocked' || !!ms.blockedBy;
          const isCompleted = ms.status === 'Completed';

          if (isBlocked) {
            return (
              <div
                key={ms.id}
                className="group flex items-start gap-3.5 p-3.5 rounded-2xl bg-neutral-100/40 dark:bg-neutral-900/20 border border-dashed border-neutral-300 dark:border-neutral-800 opacity-80"
              >
                <div className="mt-0.5 text-neutral-400">
                  <Lock className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <h4 className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 line-through">
                      {ms.title}
                    </h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                      Locked By Rule DEP-882
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {ms.description || 'Will auto-unlock when prerequisite milestone completes.'}
                  </p>
                </div>
              </div>
            );
          }

          if (isCompleted) {
            return (
              <div
                key={ms.id}
                className="group flex items-start gap-3.5 p-3.5 rounded-2xl bg-neutral-50/40 dark:bg-neutral-900/30 border border-neutral-200/40 dark:border-neutral-800/50"
              >
                <input
                  type="checkbox"
                  checked
                  onChange={() => onToggleMilestone(ms.id)}
                  className="mt-1 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-neutral-300 dark:border-neutral-700 cursor-pointer"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <h4 className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 line-through">
                      {ms.title}
                    </h4>
                    <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                      {ms.relativeDays}
                    </span>
                  </div>
                </div>
              </div>
            );
          }

          // Active / Pending Milestone
          return (
            <div
              key={ms.id}
              className="group flex items-start gap-3.5 p-3.5 rounded-2xl bg-neutral-50/80 dark:bg-neutral-900/50 hover:bg-neutral-100/80 dark:hover:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/80 transition"
            >
              <input
                type="checkbox"
                checked={false}
                onChange={() => onToggleMilestone(ms.id)}
                className="mt-1 w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-neutral-300 dark:border-neutral-700 cursor-pointer"
              />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <h4 className="text-xs font-bold text-neutral-900 dark:text-white">{ms.title}</h4>
                  <div className="flex items-center gap-1.5">
                    {ms.priority === 'High' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-300 border border-red-200 dark:border-red-900/50">
                        High Priority
                      </span>
                    )}
                    {ms.category === 'Catering' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                        Chef Confirmed
                      </span>
                    )}
                    <span className="text-[11px] font-medium text-neutral-500">{ms.relativeDays}</span>
                  </div>
                </div>

                {ms.description && (
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">{ms.description}</p>
                )}

                {/* Specific actions if quotes available */}
                {ms.quoteDetails && (
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={onViewQuotes}
                      className="px-2.5 py-1 rounded-lg bg-white dark:bg-neutral-800 text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 cursor-pointer transition shadow-xs"
                    >
                      View {ms.quoteDetails.count} Quotes (${ms.quoteDetails.amount.toLocaleString()})
                    </button>
                    <button
                      onClick={onApproveQuotes}
                      className="px-2.5 py-1 rounded-lg bg-brand-500 text-[11px] font-semibold text-white hover:bg-brand-600 cursor-pointer transition shadow-xs"
                    >
                      Send Approval
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
