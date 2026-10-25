import React, { useState } from 'react';
import { ChevronRight, AlertTriangle, ArrowRightLeft, Check, X } from 'lucide-react';
import { EventData } from '../types';

interface FinancialPulseProps {
  event: EventData;
  onOpenLedger: () => void;
  onApplyRebalance: () => void;
  isRebalanced: boolean;
  onDismissAnomaly: () => void;
  isAnomalyDismissed: boolean;
}

export const FinancialPulse: React.FC<FinancialPulseProps> = ({
  event,
  onOpenLedger,
  onApplyRebalance,
  isRebalanced,
  onDismissAnomaly,
  isAnomalyDismissed,
}) => {
  const percentCommitted = Math.round((event.committedBudget / event.totalBudget) * 1000) / 10;
  const percentCushion = Math.round((event.safeHarborCushion / event.totalBudget) * 1000) / 10;

  return (
    <div className="rounded-3xl bg-white dark:bg-[#18191e] border border-neutral-200/80 dark:border-neutral-800 p-6 shadow-sm space-y-5">
      {/* Card Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-xl font-bold text-neutral-900 dark:text-white">
              Financial Pulse & Capital Pacing
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
              Live Sync
            </span>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Automated bank reconciliation and vendor milestone escrow lock.
          </p>
        </div>
        <button
          onClick={onOpenLedger}
          className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 group"
        >
          <span>Full Ledger</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
        </button>
      </div>

      {/* Capital Summary KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/50 dark:border-neutral-800">
          <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 block">Total Budget Cap</span>
          <span className="font-serif text-2xl font-bold text-neutral-900 dark:text-white mt-1 block">
            ${event.totalBudget.toLocaleString()}
          </span>
          <span className="text-[10px] text-neutral-400">Verified {event.partnerOrHost}</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/50 dark:border-neutral-800">
          <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 block">Committed / Settled</span>
          <span className="font-serif text-2xl font-bold text-brand-600 dark:text-brand-400 mt-1 block">
            ${event.committedBudget.toLocaleString()}
          </span>
          <span className="text-[10px] font-medium text-neutral-500">{percentCommitted}% allocated</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/50 dark:border-neutral-800">
          <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 block">Safe Harbor Cushion</span>
          <span className="font-serif text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 block">
            ${event.safeHarborCushion.toLocaleString()}
          </span>
          <span className="text-[10px] text-emerald-600 font-medium">{percentCushion}% free reserve</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/50 dark:border-neutral-800">
          <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 block">AI Detected Gains</span>
          <span className="font-serif text-2xl font-bold text-amber-500 mt-1 block">
            +${event.aiDetectedGains.toLocaleString()}
          </span>
          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">3 active captures</span>
        </div>
      </div>

      {/* Multi-Segment Portfolio Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-neutral-700 dark:text-neutral-300">Portfolio Allocation Pacing</span>
          <span className="text-neutral-500">
            ${event.committedBudget.toLocaleString()} / ${event.totalBudget.toLocaleString()} committed ({event.categories.length} categories)
          </span>
        </div>

        {/* Split progress track */}
        <div className="h-3 w-full bg-neutral-200/70 dark:bg-neutral-800 rounded-full overflow-hidden flex shadow-inner">
          {event.categories.map((cat, idx) => (
            <div
              key={idx}
              className="h-full hover:opacity-90 transition relative group"
              style={{
                width: `${cat.percentage}%`,
                backgroundColor: isRebalanced && cat.name.includes('Decor') ? '#c86d56' : cat.color,
              }}
              title={`${cat.name}: $${cat.allocated.toLocaleString()} (${cat.percentage}%)`}
            />
          ))}
          {/* Buffer track segment */}
          <div
            className="h-full bg-emerald-500/30 dark:bg-emerald-500/20"
            style={{ width: `${percentCushion}%` }}
            title={`Untouched Buffer: $${event.safeHarborCushion.toLocaleString()} (${percentCushion}%)`}
          />
        </div>

        {/* Legend Pills */}
        <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-neutral-500 dark:text-neutral-400">
          {event.categories.slice(0, 4).map((cat, idx) => (
            <span key={idx} className="inline-flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: isRebalanced && cat.name.includes('Decor') ? '#c86d56' : cat.color }}
              />
              <span>
                {cat.name} (${(cat.allocated / 1000).toFixed(1)}k
                {!isRebalanced && cat.name.includes('Decor') && (
                  <span className="text-red-500 font-bold ml-1">▲8%</span>
                )}
                )
              </span>
            </span>
          ))}
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Buffer (${(event.safeHarborCushion / 1000).toFixed(2)}k)</span>
          </span>
        </div>
      </div>

      {/* AI ANOMALY BANNER WITH 1-CLICK REBALANCE */}
      {!isAnomalyDismissed && (
        <div
          className={`relative overflow-hidden rounded-2xl border p-4 transition-all duration-300 ${
            isRebalanced
              ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-200/80 dark:border-emerald-900/50'
              : 'bg-gradient-to-r from-red-50/90 via-amber-50/70 to-brand-50/60 dark:from-red-950/40 dark:via-neutral-900/80 dark:to-brand-950/30 border-red-200/80 dark:border-red-900/60'
          }`}
        >
          {isRebalanced ? (
            <div className="flex items-center justify-between w-full py-1">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-300 flex items-center justify-center font-bold">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                    Surplus Successfully Rebalanced!
                  </span>
                  <p className="text-[11px] text-neutral-600 dark:text-neutral-400">
                    $700 reallocated from Stationery to Floral & Decor. Safe harbor cushion intact (${event.safeHarborCushion.toLocaleString()}).
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-600 px-2.5 py-1 rounded-lg bg-emerald-100/50">
                Complete
              </span>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-100 dark:bg-red-900/60 text-red-600 dark:text-red-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-600 text-white">
                      AI Fiscal Anomaly
                    </span>
                    <span className="text-xs font-bold text-red-700 dark:text-red-300">
                      Decor & Florals Exceeding Target (+8.1% / +$700.00)
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-1 leading-relaxed">
                    Sonoma Bloom's upgraded arbor exceeds the baseline cap. CelebrateAI detects{' '}
                    <span className="font-bold text-neutral-900 dark:text-white">$1,300 uncommitted surplus</span> in
                    the Printed Stationery line. Rebalancing preserves your full{' '}
                    <span className="font-bold text-emerald-600">${event.safeHarborCushion.toLocaleString()} Safe Harbor buffer</span>.
                  </p>
                </div>
              </div>

              {/* 1-Click Rebalance CTA */}
              <div className="flex items-center gap-2 flex-shrink-0 self-end md:self-center">
                <button
                  onClick={onApplyRebalance}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-red-600 hover:from-brand-700 hover:to-red-700 text-white text-xs font-semibold shadow-md shadow-brand-500/20 transition transform active:scale-95 flex items-center gap-1.5 whitespace-nowrap"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                  Rebalance $700 Surplus
                </button>
                <button
                  onClick={onDismissAnomaly}
                  className="px-2.5 py-2 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 text-xs font-medium transition"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
