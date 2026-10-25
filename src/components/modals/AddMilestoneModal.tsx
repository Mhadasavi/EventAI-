import React, { useState } from 'react';
import { X, Calendar, Flag, AlertCircle, Link } from 'lucide-react';
import { Milestone } from '../../types';

interface AddMilestoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMilestone: (milestone: Milestone) => void;
}

export const AddMilestoneModal: React.FC<AddMilestoneModalProps> = ({
  isOpen,
  onClose,
  onAddMilestone,
}) => {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<Milestone['priority']>('High');
  const [category, setCategory] = useState('Logistics');
  const [description, setDescription] = useState('');
  const [hasDependency, setHasDependency] = useState(false);
  const [dependencyRule, setDependencyRule] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) return;

    const formattedDate = new Date(dueDate).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    const newMs: Milestone = {
      id: `ms-${Date.now()}`,
      title: title.trim(),
      description: description.trim() || undefined,
      dueDate: formattedDate,
      relativeDays: `Due ${formattedDate}`,
      priority,
      status: hasDependency ? 'Blocked' : 'Pending',
      category,
      blockedBy: hasDependency && dependencyRule.trim() ? dependencyRule.trim() : undefined,
    };

    onAddMilestone(newMs);
    setTitle('');
    setDueDate('');
    setDescription('');
    setHasDependency(false);
    setDependencyRule('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#1a1b20] rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-neutral-900 dark:text-white">Add Milestone & Dependency</h3>
              <p className="text-xs text-neutral-500">Reverse-engineered execution checkpoint</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Milestone Name *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Finalize Acoustic Sound Curfew Permit"
              className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-brand-500/30 text-neutral-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Target Deadline *
              </label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-brand-500/30 text-neutral-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Priority Tier
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-brand-500/30 text-neutral-900 dark:text-white"
              >
                <option value="High">High Priority (Critical Path)</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low / Optional</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Operational Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-brand-500/30 text-neutral-900 dark:text-white"
            >
              <option value="Logistics">Logistics & Transportation</option>
              <option value="Catering">Culinary & Sommelier</option>
              <option value="Stationery">Stationery & Print</option>
              <option value="Vendor">Vendor Contracting</option>
              <option value="Decor">Decor & Styling</option>
              <option value="Legal & Permits">Legal & Permits</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Execution Notes & Instructions
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Outline specific deliverables, contact persons, or verification standards..."
              className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-brand-500/30 text-neutral-900 dark:text-white"
            />
          </div>

          <div className="p-3 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hasDependency}
                onChange={(e) => setHasDependency(e.target.checked)}
                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-neutral-300 dark:border-neutral-700"
              />
              <span className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1">
                <Link className="w-3.5 h-3.5" />
                Add Prerequisite Dependency Lock
              </span>
            </label>
            {hasDependency && (
              <input
                type="text"
                value={dependencyRule}
                onChange={(e) => setDependencyRule(e.target.value)}
                placeholder="e.g. Locked until final guest dietary matrix is compiled"
                className="w-full px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-neutral-900 border border-amber-300/60 dark:border-amber-800 text-neutral-900 dark:text-white"
              />
            )}
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
              className="px-5 py-2 text-xs font-semibold bg-brand-500 hover:bg-brand-600 text-white rounded-xl shadow-md shadow-brand-500/20 transition active:scale-95"
            >
              Create Milestone
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
