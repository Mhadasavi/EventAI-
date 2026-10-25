import React from 'react';
import { X, Wine, Copy, Check, Sparkles, Scale } from 'lucide-react';
import { CocktailRecipe } from '../../types';

interface CocktailBatchModalProps {
  cocktail: CocktailRecipe;
  guestCount: number;
  isOpen: boolean;
  onClose: () => void;
  onToast: (msg: string) => void;
}

export const CocktailBatchModal: React.FC<CocktailBatchModalProps> = ({
  cocktail,
  guestCount,
  isOpen,
  onClose,
  onToast,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    const text = `${cocktail.name} - Bar Specs (${guestCount} Guests)
Ingredients:
${cocktail.ingredients.map((i) => `- ${i.name}: ${i.perDrink} per drink (${i.forBatch168})`).join('\n')}

Preparation:
${cocktail.instructions}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    onToast('Bar specs & scaled batch ratios copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200" role="dialog" aria-modal="true" aria-labelledby="cocktail-batch-title">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#1a1b20] rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <Wine className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="cocktail-batch-title" className="font-serif text-lg font-bold text-neutral-900 dark:text-white">
                  {cocktail.name}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-brand-100 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300">
                  {cocktail.matchScore}% Match
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">Automated batch scale for {guestCount} confirmed guests</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Narrative & Cost */}
        <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800 flex items-center justify-between text-xs">
          <div>
            <span className="text-neutral-500 block text-[11px]">Cost Estimate</span>
            <span className="font-bold text-neutral-900 dark:text-white text-sm">
              ${cocktail.costPerGuest.toFixed(2)} <span className="font-normal text-neutral-400 text-xs">/ guest</span>
            </span>
          </div>
          <div className="text-right">
            <span className="text-neutral-500 block text-[11px]">Total Bar Allocation</span>
            <span className="font-bold text-brand-600 dark:text-brand-400 text-sm">
              ${(cocktail.costPerGuest * guestCount).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Ingredients & Scaled Ratios */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <h4 className="font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1">
              <Scale className="w-3.5 h-3.5" />
              Ingredient Proportions & Batch Quantities
            </h4>
          </div>
          <div className="rounded-2xl border border-neutral-200/80 dark:border-neutral-800 overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-neutral-50 dark:bg-neutral-900 text-neutral-500 text-[10px] uppercase border-b border-neutral-200 dark:border-neutral-800">
                <tr>
                  <th className="py-2 px-3">Ingredient</th>
                  <th className="py-2 px-3">Single Pour</th>
                  <th className="py-2 px-3 text-right">Batch ({guestCount} Guests)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-neutral-700 dark:text-neutral-300">
                {cocktail.ingredients.map((ing, idx) => (
                  <tr key={idx} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/40">
                    <td className="py-2.5 px-3 font-semibold text-neutral-900 dark:text-white">{ing.name}</td>
                    <td className="py-2.5 px-3 text-neutral-500">{ing.perDrink}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-medium text-brand-600 dark:text-brand-400">
                      {ing.forBatch168}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Method */}
        <div className="space-y-1.5 text-xs">
          <h4 className="font-bold uppercase tracking-wider text-neutral-400">Preparation & Service Ritual</h4>
          <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200/50 dark:border-neutral-800">
            {cocktail.instructions}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-800">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-800 dark:text-neutral-200 text-xs font-semibold transition"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy Bar Spec Sheet'}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-brand-500 hover:bg-brand-600 text-white rounded-xl shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
