import React, { useState } from 'react';
import { X, Sparkles, Calendar, Users, MapPin, DollarSign, Wand2, Compass } from 'lucide-react';
import { EventData } from '../../types';

interface NewEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateEvent: (newEvent: EventData) => void;
  onToast: (msg: string) => void;
}

export const NewEventModal: React.FC<NewEventModalProps> = ({
  isOpen,
  onClose,
  onCreateEvent,
  onToast,
}) => {
  const [eventType, setEventType] = useState<'wedding' | 'birthday' | 'community' | 'gala'>('wedding');
  const [title, setTitle] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [location, setLocation] = useState('');
  const [guestCount, setGuestCount] = useState(120);
  const [budget, setBudget] = useState(35000);
  const [vibe, setVibe] = useState('Modern Romantic & Warm Terracotta');
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !location.trim() || !dateStr) return;

    setIsGenerating(true);
    try {
      const response = await fetch('/api/gemini/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType,
          title,
          guestCount,
          location,
          totalBudget: budget,
          vibe,
        }),
      });

      const plan = await response.json();

      const newEvent: EventData = {
        id: `event-${Date.now()}`,
        type: eventType,
        name: title.trim(),
        shortName: title.trim().split(' ').slice(0, 4).join(' '),
        dateStr: new Date(dateStr).toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        daysRemaining: Math.max(
          1,
          Math.ceil((new Date(dateStr).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
        ),
        location: location.trim(),
        venueName: location.split('•')[0]?.trim() || location,
        partnerOrHost: 'Host & Planning Committee',
        guestCount,
        guestCapacity: Math.round(guestCount * 1.15),
        summary: plan.summary || `GenAI autonomous master plan tailored for ${guestCount} guests in ${location}.`,
        readinessScore: 65,
        verifiedMilestones: 8,
        totalMilestones: 20,
        totalBudget: budget,
        committedBudget: Math.round(budget * 0.4),
        safeHarborCushion: Math.round(budget * 0.15),
        aiDetectedGains: 1200,
        categories: (plan.budgetBreakdown || []).map((b: any, idx: number) => ({
          name: b.category,
          allocated: b.amount,
          color: ['#964330', '#c86d56', '#f59e0b', '#10b981', '#8c6b32', '#6366f1'][idx % 6],
          percentage: b.percentage,
        })),
        items: (plan.budgetBreakdown || []).map((b: any, idx: number) => ({
          id: `item-gen-${idx}`,
          category: b.category,
          name: `${b.category} Core Allocation`,
          allocated: b.amount,
          actual: b.amount,
          status: 'Estimated' as const,
          notes: b.tip,
        })),
        milestones: (plan.milestones || []).map((m: any, idx: number) => ({
          id: `ms-gen-${idx}`,
          title: m.title,
          dueDate: 'Milestone Date',
          relativeDays: `T-minus ${m.daysBefore} days`,
          priority: m.priority || 'High',
          status: 'Pending' as const,
          category: 'Execution',
          blockedBy: m.dependency !== 'None' ? m.dependency : undefined,
        })),
        vendors: (plan.vendors || []).map((v: any, idx: number) => ({
          id: `v-gen-${idx}`,
          name: v.name,
          category: v.category,
          role: v.category,
          status: v.status || 'Proposed',
          totalContract: v.estimatedCost,
          paidAmount: 0,
          statusNote: v.action || 'Review quote',
          contactName: 'Partner Representative',
          contactEmail: 'contact@partner.com',
          keyDeliverables: ['Contracted deliverables package'],
          nextMilestone: 'Initial vendor qualification call',
        })),
        creativeVault: {
          cocktail: plan.creativeVault?.cocktail || {
            name: 'Sunset Spritz',
            tagline: 'Signature Toast',
            costPerGuest: 7.5,
            matchScore: 97,
            description: 'Botanical aperitif, sparkling prosecco, blood orange and thyme sprig.',
            ingredients: [
              { name: 'Sparkling Prosecco', perDrink: '4.0 oz', forBatch168: '24 bottles' },
              { name: 'Blood Orange Syrup', perDrink: '0.75 oz', forBatch168: '1 gallon' },
            ],
            instructions: 'Stir over ice and serve chilled with orange wheel.',
          },
          paletteName: `${vibe.split(' ')[0]} Palette`,
          paletteId: '#GEN-902',
          swatches: plan.creativeVault?.palette || [
            { name: 'Primary Terracotta', hex: '#C86D56', role: 'Hero' },
            { name: 'Olive Leaf', hex: '#8C6B32', role: 'Secondary' },
            { name: 'Blush Sand', hex: '#F2D8CC', role: 'Linen' },
            { name: 'Deep Spruce', hex: '#1D5249', role: 'Accent' },
          ],
          paletteUsageNotes: 'Optimized for high emotional impact and tactile stationery.',
          soundtrackVibe: 'Curated ambient acoustic melodies with upbeat evening transitions.',
        },
      };

      onCreateEvent(newEvent);
      onToast(`Master Blueprint generated for ${title}!`);
      onClose();
    } catch (err: any) {
      onToast('Error generating blueprint: ' + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white dark:bg-[#1a1b20] rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-amber-500 text-white flex items-center justify-center shadow-md shadow-brand-500/20">
              <Wand2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-neutral-900 dark:text-white">
                GenAI Master Event Architect
              </h3>
              <p className="text-xs text-neutral-500">
                Autonomous blueprinting with reverse timelines & budget distribution
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

        <form onSubmit={handleGenerate} className="space-y-4">
          {/* Event Vertical Selector */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
              Select Celebration Vertical *
            </label>
            <div className="grid grid-cols-4 gap-2 text-xs">
              {[
                { id: 'wedding', label: '💍 Wedding' },
                { id: 'birthday', label: '🎂 Milestone B-day' },
                { id: 'community', label: '🎪 Community Gala' },
                { id: 'gala', label: '🥂 Fundraiser' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setEventType(t.id as any)}
                  className={`p-2.5 rounded-xl border text-center font-semibold transition ${
                    eventType === t.id
                      ? 'bg-brand-500 text-white border-brand-500 shadow-sm'
                      : 'bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Event Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Maya & Kieran Coastal Cliffside Wedding"
              className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-brand-500/30 text-neutral-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Event Date *
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
                <input
                  type="date"
                  required
                  value={dateStr}
                  onChange={(e) => setDateStr(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-brand-500/30 text-neutral-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Location & Venue *
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Big Sur Lodge • Monterey, CA"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-brand-500/30 text-neutral-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Guest Target Count
                </label>
                <span className="text-xs font-bold text-brand-600 dark:text-brand-400">{guestCount} Guests</span>
              </div>
              <input
                type="range"
                min={20}
                max={500}
                step={5}
                value={guestCount}
                onChange={(e) => setGuestCount(Number(e.target.value))}
                className="w-full accent-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Total Budget Cap ($)
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  step={500}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-brand-500/30 text-neutral-900 dark:text-white font-mono"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Aesthetic Vibe & Sensory Mood
            </label>
            <div className="relative">
              <Compass className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
              <input
                type="text"
                value={vibe}
                onChange={(e) => setVibe(e.target.value)}
                placeholder="e.g. Ethereal Coastal, Candlelit Minimalist, Vintage Havana 70s"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-brand-500/30 text-neutral-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100 dark:border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isGenerating}
              className="px-5 py-2.5 text-xs font-semibold bg-gradient-to-r from-brand-600 to-amber-600 hover:from-brand-700 hover:to-amber-700 text-white rounded-xl shadow-md shadow-brand-500/25 transition flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'Synthesizing Master Blueprint...' : 'Generate Live Blueprint with AI'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
