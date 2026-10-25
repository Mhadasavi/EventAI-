import React, { useState } from 'react';
import { X, Download, Filter, Search, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { BudgetItem, BudgetCategory } from '../../types';

interface FullLedgerModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: BudgetItem[];
  totalBudget: number;
  committedBudget: number;
  safeHarborCushion: number;
  categories: BudgetCategory[];
}

export const FullLedgerModal: React.FC<FullLedgerModalProps> = ({
  isOpen,
  onClose,
  items,
  totalBudget,
  committedBudget,
  safeHarborCushion,
  categories,
}) => {
  const [filterCat, setFilterCat] = useState<string>('All');
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filteredItems = items.filter((item) => {
    const matchesCat = filterCat === 'All' || item.category === filterCat;
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      (item.vendorName && item.vendorName.toLowerCase().includes(search.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleExportCSV = () => {
    const headers = ['Category', 'Line Item', 'Vendor', 'Allocated', 'Actual/Paid', 'Status', 'Notes'];
    const rows = filteredItems.map((i) => [
      i.category,
      `"${i.name}"`,
      `"${i.vendorName || 'N/A'}"`,
      i.allocated,
      i.actual,
      i.status,
      `"${i.notes || ''}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CelebrateAI_Event_Ledger_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200" role="dialog" aria-modal="true" aria-labelledby="full-ledger-title">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-[#1a1b20] rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 flex flex-col space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <div>
            <div className="flex items-center gap-2">
              <h3 id="full-ledger-title" className="font-serif text-xl font-bold text-neutral-900 dark:text-white">
                Comprehensive Capital Ledger
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50">
                Reconciliation Active
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              Itemized tranches, vendor commitments, and safe harbor capital allocations.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-700 dark:text-neutral-200 text-xs font-semibold transition"
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Financial KPI bar */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800">
            <span className="text-[10px] uppercase font-bold text-neutral-400">Total Cap</span>
            <span className="text-lg font-serif font-bold text-neutral-900 dark:text-white block">
              ${totalBudget.toLocaleString()}
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800">
            <span className="text-[10px] uppercase font-bold text-brand-500">Committed Capital</span>
            <span className="text-lg font-serif font-bold text-brand-600 dark:text-brand-400 block">
              ${committedBudget.toLocaleString()}
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800">
            <span className="text-[10px] uppercase font-bold text-emerald-600">Safe Harbor Reserve</span>
            <span className="text-lg font-serif font-bold text-emerald-600 dark:text-emerald-400 block">
              ${safeHarborCushion.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Filter & Search */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 max-w-sm">
            <div className="relative w-full">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-neutral-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filter items or vendors..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white"
              />
            </div>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            <button
              onClick={() => setFilterCat('All')}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition ${
                filterCat === 'All'
                  ? 'bg-brand-500 text-white'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
              }`}
            >
              All ({items.length})
            </button>
            {categories.map((c) => (
              <button
                key={c.name}
                onClick={() => setFilterCat(c.name)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  filterCat === c.name
                    ? 'bg-brand-500 text-white'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Table list */}
        <div className="flex-1 overflow-y-auto rounded-2xl border border-neutral-200 dark:border-neutral-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-neutral-900/80 text-neutral-500 dark:text-neutral-400 border-b border-neutral-200 dark:border-neutral-800 uppercase text-[10px] tracking-wider sticky top-0">
              <tr>
                <th className="py-2.5 px-3 font-semibold">Line Item</th>
                <th className="py-2.5 px-3 font-semibold">Category</th>
                <th className="py-2.5 px-3 font-semibold">Vendor / Partner</th>
                <th className="py-2.5 px-3 font-semibold text-right">Committed</th>
                <th className="py-2.5 px-3 font-semibold">Status</th>
                <th className="py-2.5 px-3 font-semibold">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-neutral-700 dark:text-neutral-200">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/40 transition">
                  <td className="py-3 px-3 font-semibold text-neutral-900 dark:text-white">{item.name}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-neutral-500 dark:text-neutral-400">{item.vendorName || '—'}</td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-neutral-900 dark:text-white">
                    ${item.actual.toLocaleString()}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status === 'Paid'
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                          : item.status === 'Committed'
                          ? 'bg-brand-100 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300'
                          : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                      }`}
                    >
                      {item.status === 'Paid' ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <Clock className="w-3 h-3" />
                      )}
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-[11px] text-neutral-400 max-w-xs truncate" title={item.notes}>
                    {item.notes || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between text-xs text-neutral-500 pt-2">
          <span>Displaying {filteredItems.length} line items</span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-brand-500 hover:bg-brand-600 text-white rounded-xl shadow-xs"
          >
            Close Ledger
          </button>
        </div>
      </div>
    </div>
  );
};
