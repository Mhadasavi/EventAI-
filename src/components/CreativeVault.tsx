import React, { useState } from 'react';
import { Wine, Copy, Check, Sparkles, Music, Palette } from 'lucide-react';
import { CreativeDeck } from '../types';

interface CreativeVaultProps {
  creativeVault: CreativeDeck;
  onOpenBatchModal: () => void;
  onToast: (msg: string) => void;
}

export const CreativeVault: React.FC<CreativeVaultProps> = ({
  creativeVault,
  onOpenBatchModal,
  onToast,
}) => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const handleCopyHex = (hex: string, name: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    onToast(`Copied color swatch ${name} (${hex}) to clipboard!`);
    setTimeout(() => setCopiedHex(null), 1800);
  };

  const cocktail = creativeVault.cocktail;

  return (
    <div className="rounded-3xl bg-white dark:bg-[#18191e] border border-neutral-200/80 dark:border-neutral-800 p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-xl font-bold text-neutral-900 dark:text-white">
            Creative Vault & Sensory Deck
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            AI-synthesized sensory mood boards and cocktail recipes.
          </p>
        </div>
        <button
          onClick={() => onToast('Opened Creative Vault: 14 curated styling assets & playlist specs!')}
          className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
        >
          Browse All 14
        </button>
      </div>

      {/* Curated Signature Cocktail Card */}
      <div className="relative overflow-hidden rounded-2xl bg-neutral-50 dark:bg-neutral-900/70 border border-neutral-200/70 dark:border-neutral-800 p-4">
        <div className="flex gap-4">
          <div className="w-20 h-20 rounded-xl bg-gradient-to-tr from-brand-600/20 to-amber-500/20 border border-brand-200/50 dark:border-brand-900/40 flex items-center justify-center flex-shrink-0">
            <Wine className="w-8 h-8 text-brand-600 dark:text-brand-400" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-brand-50 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300">
                {cocktail.tagline}
              </span>
              <span className="text-xs font-bold text-neutral-900 dark:text-white">
                Est. ${cocktail.costPerGuest.toFixed(2)} / guest
              </span>
            </div>

            <h4 className="font-serif text-sm font-bold text-neutral-900 dark:text-white mt-1">
              {cocktail.name}
            </h4>

            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2">
              {cocktail.description}
            </p>

            <div className="flex items-center gap-2 mt-2">
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                {cocktail.matchScore}% Aesthetic Match
              </span>
              <span className="text-neutral-300 dark:text-neutral-700">•</span>
              <button
                onClick={onOpenBatchModal}
                className="text-[11px] text-brand-600 dark:text-brand-400 font-medium hover:underline cursor-pointer"
              >
                Copy Bar Specs
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Seasonal Color Swatch Token Strip */}
      <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/70 border border-neutral-200/70 dark:border-neutral-800 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-neutral-900 dark:text-white">{creativeVault.paletteName}</span>
          <span className="text-[10px] text-neutral-400">Palette ID: {creativeVault.paletteId}</span>
        </div>

        <div className="flex items-center gap-2.5 pt-1">
          {creativeVault.swatches.map((swatch) => (
            <button
              key={swatch.hex}
              onClick={() => handleCopyHex(swatch.hex, swatch.name)}
              className="flex-1 h-9 rounded-xl shadow-xs flex items-center justify-center text-[10px] font-mono font-semibold transition transform hover:scale-105 cursor-pointer relative group"
              style={{
                backgroundColor: swatch.hex,
                color: swatch.hex === '#F2D8CC' || swatch.hex === '#EFE7DA' || swatch.hex === '#E3DFD5' ? '#333' : '#fff',
              }}
              title={`${swatch.name}: ${swatch.hex} (Click to copy)`}
            >
              <span>{copiedHex === swatch.hex ? '✓' : swatch.hex}</span>
            </button>
          ))}
        </div>

        <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
          {creativeVault.paletteUsageNotes}
        </p>
      </div>
    </div>
  );
};
