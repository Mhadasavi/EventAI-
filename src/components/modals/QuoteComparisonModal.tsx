import React, { useState } from 'react';
import { X, Bus, Check, Star, ShieldCheck, Sparkles } from 'lucide-react';
import { QuoteOption } from '../../types';

interface QuoteComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApproveQuote: (quote: QuoteOption) => void;
}

const SHUTTLE_QUOTES: QuoteOption[] = [
  {
    id: 'q-1',
    vendorName: 'Napa Valley Sprinters & Charters',
    amount: 1850,
    vehicleFleet: '3 Luxury 14-Pax Mercedes Sprinters',
    rating: 4.9,
    inclusions: [
      'Continuous 6-hour loop between Napa River Inn, Archer Hotel, and Meadowood',
      'Chilled sparkling water & custom playlist connection',
      'Late night 11:30 PM safety sweep for remaining guests',
    ],
    isRecommended: true,
  },
  {
    id: 'q-2',
    vendorName: 'St. Helena Wine Country Limousines',
    amount: 2100,
    vehicleFleet: '2 24-Passenger Executive Mini-Coaches',
    rating: 4.8,
    inclusions: [
      'Higher single-trip capacity (48 guests per run)',
      'Luggage assistance and ADA wheelchair lift accessible',
      'Overtime billed at $175/hr after midnight',
    ],
  },
  {
    id: 'q-3',
    vendorName: 'Silverado Transit & Shuttles',
    amount: 1920,
    vehicleFleet: '1 35-Passenger Coach + 1 Sprinter Van',
    rating: 4.7,
    inclusions: [
      'Dedicated on-site coordinator with two-way radio',
      'Direct hotel concierge coordination',
      'Standard bottled water service',
    ],
  },
];

export const QuoteComparisonModal: React.FC<QuoteComparisonModalProps> = ({
  isOpen,
  onClose,
  onApproveQuote,
}) => {
  const [selectedQuoteId, setSelectedQuoteId] = useState<string>('q-1');

  if (!isOpen) return null;

  const handleConfirm = () => {
    const chosen = SHUTTLE_QUOTES.find((q) => q.id === selectedQuoteId) || SHUTTLE_QUOTES[0];
    onApproveQuote(chosen);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200" role="dialog" aria-modal="true" aria-labelledby="quote-modal-title">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#1a1b20] rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <Bus className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="quote-modal-title" className="font-serif text-lg font-bold text-neutral-900 dark:text-white">
                  Guest Shuttle & Transport Quotes
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-brand-100 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300">
                  3 Quotes Compared
                </span>
              </div>
              <p className="text-xs text-neutral-500">Autonomous RFP compilation for St. Helena & Meadowood routing</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quote Comparison Grid */}
        <div className="space-y-3">
          {SHUTTLE_QUOTES.map((q) => {
            const isSelected = selectedQuoteId === q.id;
            return (
              <div
                key={q.id}
                onClick={() => setSelectedQuoteId(q.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition relative ${
                  isSelected
                    ? 'bg-brand-50/60 dark:bg-brand-950/30 border-brand-500 ring-2 ring-brand-500/20'
                    : 'bg-neutral-50/80 dark:bg-neutral-900/60 border-neutral-200/60 dark:border-neutral-800 hover:border-neutral-300'
                }`}
              >
                {q.isRecommended && (
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-600 text-white flex items-center gap-1 shadow-xs">
                    <Sparkles className="w-3 h-3" />
                    AI Recommended
                  </span>
                )}

                <div className="flex items-start justify-between pr-24">
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                      {q.vendorName}
                      <span className="flex items-center text-[10px] text-amber-500 font-semibold">
                        <Star className="w-3 h-3 fill-current mr-0.5" />
                        {q.rating}
                      </span>
                    </h4>
                    <span className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 block">
                      {q.vehicleFleet}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-serif text-lg font-bold text-neutral-900 dark:text-white">
                      ${q.amount.toLocaleString()}
                    </span>
                    <span className="block text-[10px] text-neutral-400">Total Fixed Quote</span>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-neutral-200/50 dark:border-neutral-800/80 space-y-1">
                  {q.inclusions.map((inc, i) => (
                    <div key={i} className="flex items-center gap-2 text-[11px] text-neutral-600 dark:text-neutral-300">
                      <Check className="w-3 h-3 text-brand-500 flex-shrink-0" />
                      <span>{inc}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-800 text-xs">
          <span className="text-neutral-500">Selected quote will be committed to budget ledger</span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-5 py-2 text-xs font-semibold bg-brand-500 hover:bg-brand-600 text-white rounded-xl shadow-md shadow-brand-500/20 transition active:scale-95 flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Approve & Book Quote</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
