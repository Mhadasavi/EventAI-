import React, { useState, useEffect } from 'react';
import { X, DollarSign, Tag, User, FileText } from 'lucide-react';
import { BudgetItem } from '../../types';

interface LogExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: { name: string }[];
  onAddExpense: (item: BudgetItem) => void;
}

export const LogExpenseModal: React.FC<LogExpenseModalProps> = ({
  isOpen,
  onClose,
  categories,
  onAddExpense,
}) => {
  const [form, setForm] = useState({
    name: '',
    category: categories[0]?.name || 'Catering',
    vendorName: '',
    amount: '',
    status: 'Committed' as BudgetItem['status'],
    notes: '',
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(form.amount);
    if (!form.name.trim() || isNaN(val) || val <= 0) return;

    const newItem: BudgetItem = {
      id: `exp-${Date.now()}`,
      name: form.name.trim(),
      category: form.category,
      vendorName: form.vendorName.trim() || undefined,
      allocated: val,
      actual: val,
      status: form.status,
      notes: form.notes.trim() || undefined,
    };

    onAddExpense(newItem);
    setForm({
      name: '',
      category: categories[0]?.name || 'Catering',
      vendorName: '',
      amount: '',
      status: 'Committed',
      notes: '',
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="log-expense-title"
      tabIndex={-1}
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose();
      }}
    >
      <div className="relative w-full max-w-lg bg-white dark:bg-[#1a1b20] rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 id="log-expense-title" className="font-serif text-lg font-bold text-neutral-900 dark:text-white">Log Event Expense</h3>
              <p className="text-xs text-neutral-500">Autonomous budget reconciliation & ledger sync</p>
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Expense / Line Item Description *
            </label>
            <div className="relative">
              <Tag className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Vintage Champagne Toast & Extra Glassware"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-brand-500/30 text-neutral-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Amount ($ USD) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-neutral-400 font-bold">$</span>
                <input
                  type="number"
                  step="any"
                  min="1"
                  required
                  value={form.amount}
                  onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))}
                  placeholder="3400"
                  className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-brand-500/30 text-neutral-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Budget Category *
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-brand-500/30 text-neutral-900 dark:text-white"
              >
                {categories.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Vendor / Payee
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
                <input
                  type="text"
                  value={form.vendorName}
                  onChange={(e) => setForm((p) => ({ ...p, vendorName: e.target.value }))}
                  placeholder="e.g. Domaine Chandon"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-brand-500/30 text-neutral-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as BudgetItem['status'] }))}
                className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-brand-500/30 text-neutral-900 dark:text-white"
              >
                <option value="Committed">Committed (Invoice Pending)</option>
                <option value="Paid">Paid in Full</option>
                <option value="Planned">Planned (Estimate)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Audit Notes & Metadata
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
              <textarea
                rows={2}
                value={form.notes}
                onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                placeholder="Reallocated from floral surplus; verified with sommelier."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-brand-500/30 text-neutral-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100 dark:border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold bg-brand-500 hover:bg-brand-600 text-white rounded-xl shadow-xs transition"
            >
              Commit to Ledger
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
