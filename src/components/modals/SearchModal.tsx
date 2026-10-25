import React, { useState, useEffect } from 'react';
import { Search, X, Calendar, DollarSign, Users, Wine, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { EventData, VendorPartner } from '../../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventData;
  onSelectAction: (actionType: string, payload?: string | number | Record<string, unknown> | VendorPartner) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  event,
  onSelectAction,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Handled by parent toggle
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase();

  const matchingMilestones = event.milestones.filter(
    (m) => m.title.toLowerCase().includes(q) || (m.description && m.description.toLowerCase().includes(q))
  );

  const matchingVendors = event.vendors.filter(
    (v) => v.name.toLowerCase().includes(q) || v.role.toLowerCase().includes(q)
  );

  const matchingItems = event.items.filter(
    (i) => i.name.toLowerCase().includes(q) || i.category.toLowerCase().includes(q)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150" role="dialog" aria-modal="true" aria-label="Global Search">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#1a1b20] rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden flex flex-col">
        {/* Search Input bar */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-neutral-200 dark:border-neutral-800">
          <Search className="w-5 h-5 text-neutral-400 mr-3" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search budget tranches, vendor contracts, or ask AI..."
            className="w-full bg-transparent text-sm focus:outline-none text-neutral-900 dark:text-white placeholder-neutral-400"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 ml-2"
          >
            <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">ESC</kbd>
          </button>
        </div>

        {/* Results Stream */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4 text-xs">
          {/* Quick AI Suggestions */}
          {!query && (
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
                Quick Action Shortcuts
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    onClose();
                    onSelectAction('log-expense');
                  }}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800 text-left hover:border-brand-500/50 transition group"
                >
                  <span className="flex items-center gap-2 font-medium text-neutral-800 dark:text-neutral-200">
                    <DollarSign className="w-4 h-4 text-brand-500" />
                    + Log New Expense
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-0.5 transition" />
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onSelectAction('add-milestone');
                  }}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800 text-left hover:border-brand-500/50 transition group"
                >
                  <span className="flex items-center gap-2 font-medium text-neutral-800 dark:text-neutral-200">
                    <Calendar className="w-4 h-4 text-brand-500" />
                    + Add Milestone
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-0.5 transition" />
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onSelectAction('audit-contracts');
                  }}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800 text-left hover:border-brand-500/50 transition group"
                >
                  <span className="flex items-center gap-2 font-medium text-neutral-800 dark:text-neutral-200">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    Run Contract Audit
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-0.5 transition" />
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onSelectAction('ask-copilot', 'Draft polite inquiry to florist');
                  }}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800 text-left hover:border-brand-500/50 transition group"
                >
                  <span className="flex items-center gap-2 font-medium text-neutral-800 dark:text-neutral-200">
                    <Sparkles className="w-4 h-4 text-brand-500" />
                    Draft Florist Message
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-0.5 transition" />
                </button>
              </div>
            </div>
          )}

          {/* Vendors */}
          {matchingVendors.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
                Vendor Partners ({matchingVendors.length})
              </span>
              {matchingVendors.map((v) => (
                <div
                  key={v.id}
                  onClick={() => {
                    onClose();
                    onSelectAction('vendor-detail', v);
                  }}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-900 cursor-pointer transition"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-brand-50 dark:bg-brand-950/60 text-brand-600 flex items-center justify-center font-bold">
                      {v.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-neutral-900 dark:text-white">{v.name}</h4>
                      <p className="text-[11px] text-neutral-500">{v.role}</p>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-neutral-800 dark:text-neutral-200">
                    ${v.totalContract.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Milestones */}
          {matchingMilestones.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
                Milestones & Critical Path ({matchingMilestones.length})
              </span>
              {matchingMilestones.map((m) => (
                <div
                  key={m.id}
                  onClick={() => {
                    onClose();
                    onSelectAction('filter-milestones', m.priority);
                  }}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-900 cursor-pointer transition"
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-brand-500 flex-shrink-0" />
                    <span className="font-medium text-neutral-800 dark:text-neutral-200">{m.title}</span>
                  </div>
                  <span className="text-[10px] font-semibold text-neutral-400">{m.relativeDays}</span>
                </div>
              ))}
            </div>
          )}

          {/* Budget Items */}
          {matchingItems.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
                Budget Line Items ({matchingItems.length})
              </span>
              {matchingItems.map((i) => (
                <div
                  key={i.id}
                  onClick={() => {
                    onClose();
                    onSelectAction('full-ledger');
                  }}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-900 cursor-pointer transition"
                >
                  <div>
                    <span className="font-medium text-neutral-800 dark:text-neutral-200">{i.name}</span>
                    <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500">
                      {i.category}
                    </span>
                  </div>
                  <span className="font-mono font-semibold text-neutral-900 dark:text-white">
                    ${i.actual.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}

          {query && matchingVendors.length === 0 && matchingMilestones.length === 0 && matchingItems.length === 0 && (
            <div className="text-center py-8 text-neutral-400">
              <p>No direct matches found for "{query}".</p>
              <button
                onClick={() => {
                  onClose();
                  onSelectAction('ask-copilot', query);
                }}
                className="mt-2 text-brand-600 dark:text-brand-400 font-semibold hover:underline"
              >
                Ask Copilot: "{query}" →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
