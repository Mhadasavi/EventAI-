import React, { useState } from 'react';
import { X, Palette, Wine, Music, Flame, Sparkles, Check, Copy, Tag } from 'lucide-react';

interface CreativeVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  onToast: (msg: string) => void;
  onOpenBatchModal: () => void;
}

interface CreativeAsset {
  id: string;
  category: 'Cocktails' | 'Palette' | 'Music' | 'Florals & Decor' | 'Culinary';
  title: string;
  tagline: string;
  description: string;
  specs: string;
  hex?: string;
}

const ALL_CREATIVE_ASSETS: CreativeAsset[] = [
  { id: 'ca-1', category: 'Cocktails', title: 'Fig & Rosemary Champagne Sparkle', tagline: 'Signature Cocktail', description: 'Caramelized Black Mission fig reduction, fresh bruised rosemary, and Sonoma Brut sparkling wine.', specs: 'Est. $8.20 / guest • 98% Aesthetic match' },
  { id: 'ca-2', category: 'Palette', title: 'Terracotta Blush (#C86D56)', tagline: 'Hero Swatch', description: 'Primary warmth tone echoed across invitation foil stamps, ribbon ties, and arbor ceramics.', specs: 'Hex: #C86D56 • CMYK: 0, 45, 57, 22', hex: '#C86D56' },
  { id: 'ca-3', category: 'Palette', title: 'Warm Olive (#8C6B32)', tagline: 'Grounding Botanical', description: 'Earthy undertone reflecting Meadowood century-old olive grove foliage and pressed menu cards.', specs: 'Hex: #8C6B32 • CMYK: 0, 24, 64, 45', hex: '#8C6B32' },
  { id: 'ca-4', category: 'Palette', title: 'Blush Clay (#F2D8CC)', tagline: 'Linen Neutral', description: 'Tender porcelain cream with delicate peach warmth for Belgian table runners and napkins.', specs: 'Hex: #F2D8CC • CMYK: 0, 11, 16, 5', hex: '#F2D8CC' },
  { id: 'ca-5', category: 'Palette', title: 'Forest Evergreen (#1D5249)', tagline: 'Structural Depth', description: 'Deep architectural green used for directional oak signage, escort board, and wax seals.', specs: 'Hex: #1D5249 • CMYK: 65, 0, 11, 68', hex: '#1D5249' },
  { id: 'ca-6', category: 'Music', title: 'Napa Autumn Romance (Acoustic Vinyl Suite)', tagline: 'Ceremony & Cocktail Soundscape', description: 'Bespoke 60-track curation featuring warm solo cello, fingerstyle nylon acoustic guitar, and 1970s vintage Brazilian bossa nova.', specs: 'BPM 85-105 • Continuous 4-hour Spotify setlist' },
  { id: 'ca-7', category: 'Florals & Decor', title: 'Juliet Garden Rose & Smoke Bush Clouds', tagline: 'Floral Architecture', description: 'David Austin peach Juliet roses paired with burgundy cotinus smoke bush, blush ranunculus, and dried vineyard tendrils.', specs: 'Sonoma Bloom partnership • $750 cost savings' },
  { id: 'ca-8', category: 'Florals & Decor', title: 'Belgian Washed Flax & Amber Goblets', tagline: 'Tablescape Textures', description: 'Frayed-edge flax linen runners in sand stone, paired with hand-blown amber water goblets and matte bronze flatware.', specs: '18 tables of 10 • Sourced from Napa Event Rentals' },
  { id: 'ca-9', category: 'Florals & Decor', title: 'Driftwood Pillar & Floating Candle Clusters', tagline: 'Ambient Illumination', description: 'Tiered glass hurricane cylinders with 350 smokeless ivory pillar candles casting 2200K warm candlelight across the lawn.', specs: 'Curfew rated • 8-hour burn guarantee' },
  { id: 'ca-10', category: 'Culinary', title: 'Artisanal Wood-Fired Truffle Flatbreads', tagline: 'Late-Night Comfort Bite', description: 'Crisp hand-tossed dough with wild chanterelles, fontina cheese, fresh thyme, and white truffle oil drizzle.', specs: 'Served at 10:15 PM • Chef Julian Vance' },
  { id: 'ca-11', category: 'Culinary', title: 'Spiced Mission Fig Olive Oil Cake', tagline: 'Confectionery Art', description: 'Three-tiered naked olive oil sponge cake layered with mascarpone buttercream, fresh figs, and edible gold leaf.', specs: 'Gluten-free companion tier included' },
  { id: 'ca-12', category: 'Cocktails', title: 'Smoked Orchard Bourbon Sip', tagline: 'Groom & Companion Libation', description: 'Kentucky small-batch bourbon, smoked rosemary syrup, charred apple bitters, and flamed orange zest.', specs: 'Est. $9.10 / guest' },
  { id: 'ca-13', category: 'Florals & Decor', title: 'Birch & Olive Ceremony Bower Arch', tagline: 'Vow Backdrop', description: 'Sculptural asymmetric archway intertwining foraged birch trunks with living olive branches and spilling terracotta blooms.', specs: 'Meadowood Lower Lawn installation' },
  { id: 'ca-14', category: 'Florals & Decor', title: 'St. Helena Lavender & Olive Leaf Sachets', tagline: 'Departure Keepsake', description: 'French linen drawstring pouches filled with organic Sonoma dried lavender buds and personalized wax seal tags.', specs: '180 custom favors' },
];

export const CreativeVaultModal: React.FC<CreativeVaultModalProps> = ({
  isOpen,
  onClose,
  onToast,
  onOpenBatchModal,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const categories = ['All', 'Cocktails', 'Palette', 'Music', 'Florals & Decor', 'Culinary'];

  const filtered = ALL_CREATIVE_ASSETS.filter((item) => {
    const matchesCat = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200" role="dialog" aria-modal="true" aria-labelledby="vault-modal-title">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-[#1a1b20] rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 flex flex-col space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-amber-500 text-white flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="vault-modal-title" className="font-serif text-xl font-bold text-neutral-900 dark:text-white">
                  Creative Vault & Sensory Deck
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-brand-100 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300">
                  All 14 Curated Elements
                </span>
              </div>
              <p className="text-xs text-neutral-500">
                AI-synthesized sensory mood boards, cocktails, lighting, and soundscape specifications
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  activeCategory === c
                    ? 'bg-brand-500 text-white shadow-xs'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search sensory asset..."
            className="px-3 py-1 text-xs rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white"
          />
        </div>

        {/* Asset Cards Grid */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-3.5 pr-1 max-h-[55vh]">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800 flex flex-col justify-between space-y-2 hover:border-brand-500/40 transition"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {item.hex && (
                      <span
                        className="w-4 h-4 rounded-full border border-black/10 shadow-xs"
                        style={{ backgroundColor: item.hex }}
                      />
                    )}
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300">
                      {item.tagline}
                    </span>
                  </div>
                  <span className="text-[10px] text-neutral-400 uppercase font-semibold">{item.category}</span>
                </div>

                <h4 className="font-serif text-sm font-bold text-neutral-900 dark:text-white mt-1.5">
                  {item.title}
                </h4>

                <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed mt-1">
                  {item.description}
                </p>
              </div>

              <div className="pt-2 border-t border-neutral-200/50 dark:border-neutral-800/80 flex items-center justify-between text-xs">
                <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-mono">{item.specs}</span>
                {item.category === 'Cocktails' ? (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenBatchModal();
                    }}
                    className="text-brand-600 dark:text-brand-400 font-semibold hover:underline text-[11px]"
                  >
                    View Batch Specs →
                  </button>
                ) : item.hex ? (
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(item.hex!);
                      onToast(`Copied ${item.hex} to clipboard!`);
                    }}
                    className="text-brand-600 dark:text-brand-400 font-semibold hover:underline text-[11px]"
                  >
                    Copy Hex →
                  </button>
                ) : (
                  <button
                    onClick={() => onToast(`Pinned "${item.title}" to master vision deck!`)}
                    className="text-brand-600 dark:text-brand-400 font-semibold hover:underline text-[11px]"
                  >
                    Pin to Deck →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800 text-xs text-neutral-500">
          <span>14/14 aesthetic tokens mapped to vendor contracts</span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-brand-500 hover:bg-brand-600 text-white rounded-xl shadow-xs"
          >
            Close Vault
          </button>
        </div>
      </div>
    </div>
  );
};
