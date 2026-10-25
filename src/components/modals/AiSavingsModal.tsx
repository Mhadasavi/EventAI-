import React from 'react';
import { X, Sparkles, TrendingUp, CheckCircle, ArrowRight, DollarSign } from 'lucide-react';

interface AiSavingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalSavings: number;
  onOpenCopilot: (prompt: string) => void;
}

export const AiSavingsModal: React.FC<AiSavingsModalProps> = ({
  isOpen,
  onClose,
  totalSavings,
  onOpenCopilot,
}) => {
  if (!isOpen) return null;

  const captures = [
    {
      id: 'cap-1',
      title: 'Sonoma Bloom Peony-to-Rose Substitution',
      category: 'Florals & Decor',
      savings: 750,
      status: 'Active Negotiation',
      details: 'Swapping imported Dutch peonies for locally cultivated Juliet garden roses while preserving 100% of the terracotta floral volume.',
      actionPrompt: 'Check status of Sonoma Bloom peony substitution email draft',
    },
    {
      id: 'cap-2',
      title: 'Meadowood Rain Pavilion Soft-Hold Fee Waiver',
      category: 'Venue & Facilities',
      savings: 850,
      status: 'Captured & Verified',
      details: 'Secured 72-hour marquee tent hold without non-refundable upfront deposit by bundling sommelier dinner room guarantee.',
      actionPrompt: 'Summarize Meadowood weather contingency agreement',
    },
    {
      id: 'cap-3',
      title: 'Artisan Bar Package Self-Sourced Spirits Optimization',
      category: 'Beverage & Bar',
      savings: 540,
      status: 'Captured & Verified',
      details: 'Restructured bar allocation to feature 2 signature batch cocktails instead of open premium liquor tier.',
      actionPrompt: 'Calculate alcohol purchase orders for 168 guests',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200" role="dialog" aria-modal="true" aria-labelledby="ai-savings-title">
      <div className="relative w-full max-w-xl bg-white dark:bg-[#1a1b20] rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="ai-savings-title" className="font-serif text-lg font-bold text-neutral-900 dark:text-white">
                  Autonomous AI Fiscal Captures
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
                  +${totalSavings.toLocaleString()} Total
                </span>
              </div>
              <p className="text-xs text-neutral-500">Intelligent contract optimization, vendor swaps, and waste elimination</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Captures List */}
        <div className="space-y-3">
          {captures.map((cap) => (
            <div
              key={cap.id}
              className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800 space-y-2"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-xs font-bold text-neutral-900 dark:text-white">{cap.title}</h4>
                  <span className="text-[10px] text-neutral-400">{cap.category}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-serif font-bold text-emerald-600 dark:text-emerald-400">
                    +${cap.savings.toLocaleString()}
                  </span>
                  <span className="block text-[9px] uppercase font-bold text-neutral-400">{cap.status}</span>
                </div>
              </div>

              <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                {cap.details}
              </p>

              <div className="pt-2 border-t border-neutral-200/50 dark:border-neutral-800 flex justify-end">
                <button
                  onClick={() => {
                    onClose();
                    onOpenCopilot(cap.actionPrompt);
                  }}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-600 dark:text-brand-400 hover:underline"
                >
                  <span>Review in Copilot</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-neutral-500 pt-2 border-t border-neutral-100 dark:border-neutral-800">
          <span>All unlocked savings automatically preserve your Safe Harbor buffer.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-xl"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
