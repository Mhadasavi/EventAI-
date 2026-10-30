import React, { useState, useEffect } from 'react';
import { X, Users, Plus, Search, Send } from 'lucide-react';
import { Guest } from '../../types';
import { INITIAL_GUESTS } from '../../data/mockGuests';
import { GuestRow } from '../rsvp/GuestRow';

interface RsvpManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  guestCount: number;
  guestCapacity: number;
  onUpdateGuests: (count: number) => void;
  onToast: (msg: string) => void;
}

export const RsvpManagerModal: React.FC<RsvpManagerModalProps> = ({
  isOpen,
  onClose,
  guestCount,
  guestCapacity,
  onUpdateGuests,
  onToast,
}) => {
  const [guests, setGuests] = useState<Guest[]>(INITIAL_GUESTS);
  const [uiState, setUiState] = useState({
    filter: 'All' as 'All' | 'Confirmed' | 'Awaiting',
    search: '',
    isAdding: false,
    name: '',
    email: '',
    partySize: 1,
    dietary: '',
  });

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

  const filteredGuests = guests.filter((g) => {
    const matchesFilter = uiState.filter === 'All' || g.status === uiState.filter;
    const q = uiState.search.toLowerCase();
    const matchesSearch =
      g.name.toLowerCase().includes(q) ||
      g.email.toLowerCase().includes(q) ||
      (g.dietaryRestrictions && g.dietaryRestrictions.toLowerCase().includes(q));
    return matchesFilter && matchesSearch;
  });

  const handleAddGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uiState.name.trim()) return;

    const newG: Guest = {
      id: `g-${Date.now()}`,
      name: uiState.name.trim(),
      email: uiState.email.trim() || 'guest@example.com',
      status: 'Confirmed',
      partySize: uiState.partySize,
      dietaryRestrictions: uiState.dietary.trim() || 'Standard Menu',
      table: 'Pending Table Assignment',
    };

    setGuests((prev) => [newG, ...prev]);
    const updatedCount = guestCount + uiState.partySize;
    onUpdateGuests(updatedCount);
    onToast(`Added ${uiState.name} (${uiState.partySize} guest${uiState.partySize > 1 ? 's' : ''}) to RSVP list!`);
    setUiState((prev) => ({
      ...prev,
      name: '',
      email: '',
      partySize: 1,
      dietary: '',
      isAdding: false,
    }));
  };

  const handleSendReminders = () => {
    onToast('Autonomous email reminders dispatched to 12 awaiting parties via SendGrid!');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="rsvp-modal-title"
      tabIndex={-1}
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose();
      }}
    >
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-white dark:bg-[#1a1b20] rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 flex flex-col space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="rsvp-modal-title" className="font-serif text-lg font-bold text-neutral-900 dark:text-white">
                  Guest RSVP & Dietary Matrix
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                  {guestCount} Confirmed
                </span>
              </div>
              <p className="text-xs text-neutral-500">Live headcounts, seating allocations, and kitchen allergy alerts</p>
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

        {/* Headcount Stat Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800">
            <span className="text-[10px] uppercase font-bold text-neutral-400">Total Confirmed</span>
            <span className="font-serif text-xl font-bold text-neutral-900 dark:text-white block mt-0.5">
              {guestCount} <span className="text-xs font-normal text-neutral-400">/ {guestCapacity}</span>
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800">
            <span className="text-[10px] uppercase font-bold text-amber-500">Awaiting Response</span>
            <span className="font-serif text-xl font-bold text-amber-500 block mt-0.5">
              {Math.max(0, guestCapacity - guestCount)} Parties
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800">
            <span className="text-[10px] uppercase font-bold text-brand-600 dark:text-brand-400">Special Diets</span>
            <span className="font-serif text-xl font-bold text-brand-600 dark:text-brand-400 block mt-0.5">
              14 Flagged
            </span>
          </div>
        </div>

        {/* Filter and Add Guest Trigger */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 max-w-xs">
            <div className="relative w-full">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-neutral-400" />
              <input
                type="text"
                value={uiState.search}
                onChange={(e) => setUiState((p) => ({ ...p, search: e.target.value }))}
                placeholder="Search guest name or dietary note..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl text-xs">
              {(['All', 'Confirmed', 'Awaiting'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setUiState((p) => ({ ...p, filter: tab }))}
                  className={`px-3 py-1 rounded-lg font-medium transition ${
                    uiState.filter === tab
                      ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white font-semibold shadow-xs'
                      : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <button
              onClick={() => setUiState((p) => ({ ...p, isAdding: !p.isAdding }))}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold shadow-xs transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Guest</span>
            </button>

            <button
              onClick={handleSendReminders}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-700 dark:text-neutral-200 text-xs font-semibold transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Remind Pending</span>
            </button>
          </div>
        </div>

        {/* Add guest form drawer */}
        {uiState.isAdding && (
          <form onSubmit={handleAddGuest} className="p-3.5 rounded-2xl bg-brand-50/50 dark:bg-neutral-900 border border-brand-200/60 dark:border-neutral-800 space-y-3 animate-in fade-in">
            <div className="font-semibold text-xs text-neutral-900 dark:text-white">Quick Add Confirmed Guest</div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
              <input
                type="text"
                required
                value={uiState.name}
                onChange={(e) => setUiState((p) => ({ ...p, name: e.target.value }))}
                placeholder="Full Name (e.g. David Sterling)"
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white"
              />
              <input
                type="email"
                value={uiState.email}
                onChange={(e) => setUiState((p) => ({ ...p, email: e.target.value }))}
                placeholder="Email address"
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white"
              />
              <input
                type="number"
                min={1}
                max={10}
                value={uiState.partySize}
                onChange={(e) => setUiState((p) => ({ ...p, partySize: parseInt(e.target.value) || 1 }))}
                placeholder="Party Size"
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white"
              />
              <input
                type="text"
                value={uiState.dietary}
                onChange={(e) => setUiState((p) => ({ ...p, dietary: e.target.value }))}
                placeholder="Dietary requirements..."
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setUiState((p) => ({ ...p, isAdding: false }))}
                className="px-3 py-1 text-xs text-neutral-500 hover:text-neutral-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1 text-xs font-semibold bg-brand-500 hover:bg-brand-600 text-white rounded-xl shadow-xs"
              >
                Save & Update Pacing
              </button>
            </div>
          </form>
        )}

        {/* Guest Table */}
        <div className="flex-1 overflow-y-auto rounded-2xl border border-neutral-200 dark:border-neutral-800 max-h-[45vh]">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-neutral-900/80 text-neutral-500 dark:text-neutral-400 border-b border-neutral-200 dark:border-neutral-800 uppercase text-[10px] sticky top-0">
              <tr>
                <th className="py-2.5 px-3 font-semibold">Guest / Party</th>
                <th className="py-2.5 px-3 font-semibold">Status</th>
                <th className="py-2.5 px-3 font-semibold">Dietary & Allergies</th>
                <th className="py-2.5 px-3 font-semibold">Seating Table</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-neutral-700 dark:text-neutral-200">
              {filteredGuests.map((g) => (
                <GuestRow key={g.id} guest={g} />
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-neutral-500 pt-2 border-t border-neutral-100 dark:border-neutral-800">
          <span>Synced with Minted Digital RSVP & Napa Catering Portal</span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-xl"
          >
            Close Roster
          </button>
        </div>
      </div>
    </div>
  );
};
