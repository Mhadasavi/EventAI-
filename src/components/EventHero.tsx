import React from 'react';
import { Clock, MapPin, Calendar, Plus, MessageSquare, ShieldCheck, CheckCircle2, Users, DollarSign, Sparkles } from 'lucide-react';
import { EventData } from '../types';

interface EventHeroProps {
  event: EventData;
  onLogExpense: () => void;
  onAddMilestone: () => void;
  onDraftVendorMessage: () => void;
  onAuditContracts: () => void;
  onToast: (msg: string) => void;
}

export const EventHero: React.FC<EventHeroProps> = ({
  event,
  onLogExpense,
  onAddMilestone,
  onDraftVendorMessage,
  onAuditContracts,
  onToast,
}) => {
  // SVG circular gauge calculation
  const radius = 15.9155;
  const circumference = 2 * Math.PI * radius; // ~100
  const strokeDashoffset = 100 - event.readinessScore;

  const countdownText =
    event.type === 'wedding'
      ? `${event.daysRemaining} Days Until "I Do"`
      : event.type === 'birthday'
      ? `${event.daysRemaining} Days Until 40th Birthday`
      : `${event.daysRemaining} Days Until Grand Opening`;

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-50/70 via-white to-amber-50/40 dark:from-[#1e1c22] dark:via-[#191a20] dark:to-[#161921] border border-neutral-200/80 dark:border-neutral-800 p-6 md:p-8 shadow-sm">
      {/* Subtle decorative glow accents */}
      <div className="absolute -right-20 -top-20 w-80 h-80 bg-brand-500/10 dark:bg-brand-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute right-1/4 -bottom-20 w-60 h-60 bg-amber-500/10 dark:bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        {/* Hero Title, Date & Location */}
        <div className="space-y-3 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500 text-white shadow-sm shadow-brand-500/20">
              <Clock className="w-3.5 h-3.5" />
              {countdownText}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200/60 dark:border-neutral-700">
              <MapPin className="w-3 h-3 text-brand-500" />
              {event.location}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200/60 dark:border-neutral-700">
              <Calendar className="w-3 h-3 text-neutral-400" />
              {event.dateStr}
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white leading-[1.15]">
            {event.name}
          </h1>

          <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-xl leading-relaxed">
            {event.summary}
          </p>
        </div>

        {/* Readiness Progress Gauge & KPI Widget */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 bg-white/80 dark:bg-neutral-800/80 frosted-glass p-4 rounded-2xl border border-neutral-200/70 dark:border-neutral-700/60 shadow-sm">
          {/* Circular Progress Gauge */}
          <div className="flex items-center gap-4 pr-0 sm:pr-4 border-b sm:border-b-0 sm:border-r border-neutral-200 dark:border-neutral-700 pb-3 sm:pb-0">
            <div className="relative w-16 h-16 flex items-center justify-center flex-shrink-0">
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-neutral-200 dark:text-neutral-700"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                />
                <path
                  className="text-brand-500 transition-all duration-700"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeDasharray={`${event.readinessScore}, 100`}
                  strokeLinecap="round"
                  strokeWidth="3.5"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="font-serif text-lg font-bold text-neutral-900 dark:text-white leading-none">
                  {event.readinessScore}%
                </span>
                <span className="text-[9px] uppercase tracking-wider text-neutral-400">Score</span>
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                Celebration Readiness
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                {event.verifiedMilestones} of {event.totalMilestones} Milestones Verified
              </div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                Pacing Smoothly on Schedule
              </div>
            </div>
          </div>

          {/* Quick Mini Stat Pills */}
          <div className="grid grid-cols-2 gap-2 text-left min-w-[170px]">
            <div className="bg-neutral-50 dark:bg-neutral-900/60 p-2 rounded-xl">
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400 block uppercase">Guest RSVPs</span>
              <span className="text-sm font-bold text-neutral-900 dark:text-white">
                {event.guestCount}{' '}
                <span className="text-xs font-normal text-neutral-400">/ {event.guestCapacity}</span>
              </span>
            </div>
            <div className="bg-neutral-50 dark:bg-neutral-900/60 p-2 rounded-xl">
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400 block uppercase">AI Savings</span>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                +${event.aiDetectedGains.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Ribbon */}
      <div className="mt-6 pt-5 border-t border-neutral-200/70 dark:border-neutral-800/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mr-1">
            Quick Actions:
          </span>

          {/* [+ Log Expense] */}
          <button
            onClick={onLogExpense}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold shadow-sm shadow-brand-500/20 transition active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            + Log Expense
          </button>

          {/* [+ Add Milestone] */}
          <button
            onClick={onAddMilestone}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700/80 text-neutral-800 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-700 text-xs font-semibold transition active:scale-95"
          >
            <Calendar className="w-3.5 h-3.5 text-neutral-500" />
            + Add Milestone
          </button>

          {/* [Draft Vendor Message] */}
          <button
            onClick={onDraftVendorMessage}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700/80 text-neutral-800 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-700 text-xs font-semibold transition active:scale-95"
          >
            <MessageSquare className="w-3.5 h-3.5 text-brand-500" />
            Draft Vendor Message
          </button>

          {/* [AI Contract Audit] */}
          <button
            onClick={onAuditContracts}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60 text-xs font-semibold transition active:scale-95"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            AI Contract & Fee Audit
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
          <span>Co-planning with:</span>
          <span className="inline-flex items-center gap-1 font-medium text-neutral-800 dark:text-neutral-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            {event.partnerOrHost}
          </span>
        </div>
      </div>
    </section>
  );
};
