import React, { useState, useEffect } from 'react';
import { X, Calendar, MapPin, DollarSign, Wand2, Compass } from 'lucide-react';
import { EventData } from '../../types';
import { buildEventFromBlueprint } from '../../utils/blueprintBuilder';

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
  const [form, setForm] = useState({
    eventType: 'wedding' as EventData['type'],
    title: '',
    dateStr: '',
    location: '',
    guestCount: 120,
    budget: 35000,
    vibe: 'Modern Romantic & Warm Terracotta',
  });
  const [isGenerating, setIsGenerating] = useState(false);

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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      onClose();
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.location.trim() || !form.dateStr) return;

    setIsGenerating(true);
    try {
      const response = await fetch('/api/gemini/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: form.eventType,
          title: form.title,
          guestCount: form.guestCount,
          location: form.location,
          totalBudget: form.budget,
          vibe: form.vibe,
        }),
      });

      const plan = await response.json();
      const newEvent = buildEventFromBlueprint(form, plan);

      onCreateEvent(newEvent);
      onToast(`Master Blueprint generated for ${form.title}!`);
      onClose();
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown generation error';
      onToast('Error generating blueprint: ' + errorMsg);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-event-title"
      tabIndex={-1}
      onKeyDown={handleKeyDown}
    >
      <div className="relative w-full max-w-xl bg-white dark:bg-[#1a1b20] rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-amber-500 text-white flex items-center justify-center shadow-md shadow-brand-500/20">
              <Wand2 className="w-5 h-5" />
            </div>
            <div>
              <h3 id="new-event-title" className="font-serif text-xl font-bold text-neutral-900 dark:text-white">
                GenAI Master Event Architect
              </h3>
              <p className="text-xs text-neutral-500">
                Autonomous blueprinting with reverse timelines & budget distribution
              </p>
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

        <form onSubmit={handleGenerate} className="space-y-4">
          {/* Event Vertical Selector */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
              Select Event Vertical *
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
                  onClick={() => setForm((prev) => ({ ...prev, eventType: t.id as EventData['type'] }))}
                  className={`p-2.5 rounded-xl border text-center font-semibold transition ${
                    form.eventType === t.id
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
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="e.g. Maya & Liam Summer Solstice Nuptials"
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Target Date *
              </label>
              <div className="relative">
                <Calendar className="w-3.5 h-3.5 absolute left-3 top-2.5 text-neutral-400" />
                <input
                  type="date"
                  required
                  value={form.dateStr}
                  onChange={(e) => setForm((prev) => ({ ...prev, dateStr: e.target.value }))}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Location / City *
              </label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 absolute left-3 top-2.5 text-neutral-400" />
                <input
                  type="text"
                  required
                  value={form.location}
                  onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
                  placeholder="e.g. Carmel Valley, CA"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Guest Count: <span className="text-brand-600 dark:text-brand-400 font-bold">{form.guestCount}</span>
              </label>
              <input
                type="range"
                min="20"
                max="500"
                step="5"
                value={form.guestCount}
                onChange={(e) => setForm((prev) => ({ ...prev, guestCount: parseInt(e.target.value, 10) }))}
                className="w-full accent-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Total Budget: <span className="text-brand-600 dark:text-brand-400 font-bold">${form.budget.toLocaleString()}</span>
              </label>
              <div className="relative">
                <DollarSign className="w-3.5 h-3.5 absolute left-3 top-2.5 text-neutral-400" />
                <input
                  type="number"
                  min="5000"
                  step="1000"
                  value={form.budget}
                  onChange={(e) => setForm((prev) => ({ ...prev, budget: parseInt(e.target.value, 10) || 0 }))}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Aesthetic Vibe & Design Direction
            </label>
            <div className="relative">
              <Compass className="w-3.5 h-3.5 absolute left-3 top-2.5 text-neutral-400" />
              <input
                type="text"
                value={form.vibe}
                onChange={(e) => setForm((prev) => ({ ...prev, vibe: e.target.value }))}
                placeholder="e.g. Modern Coastal Elegance, Crisp Linens, Citrus Accents"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/30"
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
              className="px-5 py-2 text-xs font-semibold bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white rounded-xl shadow-md shadow-brand-500/25 transition active:scale-95 flex items-center gap-1.5"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>{isGenerating ? 'Synthesizing Blueprint...' : 'Generate AI Master Blueprint'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
