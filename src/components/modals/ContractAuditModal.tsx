import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, AlertTriangle, CheckCircle, Sparkles, ArrowRight } from 'lucide-react';
import { VendorPartner } from '../../types';

interface ContractAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendors: VendorPartner[];
  onDraftNegotiation: (vendorName: string, prompt: string) => void;
}

export const ContractAuditModal: React.FC<ContractAuditModalProps> = ({
  isOpen,
  onClose,
  vendors,
  onDraftNegotiation,
}) => {
  const [isAuditing, setIsAuditing] = useState(false);


  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleReAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      setIsAuditing(false);

    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="contract-audit-title"
      tabIndex={-1}
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose();
      }}
    >
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#1a1b20] rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="contract-audit-title" className="font-serif text-lg font-bold text-neutral-900 dark:text-white">
                  Autonomous Contract & Fee Audit
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                  GenAI Guardrail
                </span>
              </div>
              <p className="text-xs text-neutral-500">Cross-referencing vendor clauses, hidden corkage, and overtime surcharges across {vendors.length} active partners</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Audit status summary */}
        <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/50 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                4 Vendor Contracts Scanned & Certified
              </h4>
              <p className="text-xs text-emerald-800 dark:text-emerald-300/90 mt-0.5">
                Zero hidden corkage fees, predatory cancellation clauses, or unscheduled attrition penalties detected. 1 optimization opportunity uncovered (~$750 potential savings).
              </p>
            </div>
          </div>
          <button
            onClick={handleReAudit}
            disabled={isAuditing}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-neutral-800 text-xs font-semibold text-emerald-700 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-700 hover:bg-emerald-50 transition flex items-center gap-1.5 whitespace-nowrap"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
            {isAuditing ? 'Auditing...' : 'Run Live Re-Scan'}
          </button>
        </div>

        {/* Audit findings by vendor */}
        <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
          {/* Finding 1: Sonoma Bloom */}
          <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-neutral-900/60 border border-amber-200/70 dark:border-neutral-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-bold text-neutral-900 dark:text-white">Sonoma Bloom — Botanical Scenography</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
                Actionable Opportunity (~$750)
              </span>
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
              Clause 4.2 incorporates a seasonal import freight fee for Dutch peonies. Substituting locally cultivated Juliet garden roses will maintain the identical aesthetic while trimming $750 from the total invoice.
            </p>
            <div className="pt-2 flex items-center justify-between border-t border-amber-200/50 dark:border-neutral-800 text-xs">
              <span className="text-[11px] text-neutral-400">Section: Line Item Variance • Clause 4.2</span>
              <button
                onClick={() => {
                  onClose();
                  onDraftNegotiation(
                    'Sonoma Bloom',
                    'Draft a polite email to Sonoma Bloom asking to swap imported peonies for seasonal garden roses to stay within budget.'
                  );
                }}
                className="inline-flex items-center gap-1 font-semibold text-brand-600 dark:text-brand-400 hover:underline"
              >
                Draft Substitution Request in Copilot
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Finding 2: Meadowood Estate */}
          <div className="p-4 rounded-2xl bg-neutral-50/80 dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-bold text-neutral-900 dark:text-white">Meadowood Estate — Venue & Grounds</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                Verified Clean
              </span>
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
              Corkage waiver verified (Section 6.1: estate sommelier fee waived with Meadowood signature wine commitment). Sound curfew strictly noted at 10:30 PM for outdoor amplification.
            </p>
          </div>

          {/* Finding 3: Wild Thyme Culinary */}
          <div className="p-4 rounded-2xl bg-neutral-50/80 dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-bold text-neutral-900 dark:text-white">Wild Thyme Culinary — Plated Dinner</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                Verified Clean
              </span>
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
              Gratuity and service charges fixed at standard 20% transparent pool. Dietary substitutes guaranteed with 10 days notice without surcharges.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800 text-xs">
          <span className="text-neutral-400">Next scheduled autonomous audit: in 7 days</span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-xl transition"
          >
            Close Audit
          </button>
        </div>
      </div>
    </div>
  );
};
