import React from 'react';
import { X, Mail, Phone, Calendar, CheckCircle2, FileText, Send, Sparkles } from 'lucide-react';
import { VendorPartner } from '../../types';

interface VendorDetailModalProps {
  vendor: VendorPartner | null;
  isOpen: boolean;
  onClose: () => void;
  onDraftMessage: (vendorName: string, prompt: string) => void;
}

export const VendorDetailModal: React.FC<VendorDetailModalProps> = ({
  vendor,
  isOpen,
  onClose,
  onDraftMessage,
}) => {
  if (!isOpen || !vendor) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200" role="dialog" aria-modal="true" aria-labelledby="vendor-detail-title">
      <div className="relative w-full max-w-xl bg-white dark:bg-[#1a1b20] rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <div>
            <div className="flex items-center gap-2">
              <h3 id="vendor-detail-title" className="font-serif text-xl font-bold text-neutral-900 dark:text-white">
                {vendor.name}
              </h3>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  vendor.status === 'Signed'
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                    : vendor.status === 'Review'
                    ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                    : 'bg-brand-100 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300'
                }`}
              >
                {vendor.status}
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">{vendor.role}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Financial contract status card */}
        <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800">
          <div>
            <span className="text-[10px] uppercase font-bold text-neutral-400">Total Contract</span>
            <span className="font-serif text-lg font-bold text-neutral-900 dark:text-white block mt-0.5">
              ${vendor.totalContract.toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-600">Paid to Date</span>
            <span className="font-serif text-lg font-bold text-emerald-600 dark:text-emerald-400 block mt-0.5">
              ${vendor.paidAmount.toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-neutral-400">Payment Status</span>
            <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mt-1">
              {vendor.statusNote}
            </span>
          </div>
        </div>

        {/* Key Deliverables */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Contracted Deliverables</h4>
          <div className="space-y-1.5">
            {vendor.keyDeliverables.map((del, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-neutral-700 dark:text-neutral-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-500 flex-shrink-0" />
                <span>{del}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Next Milestone */}
        <div className="p-3 rounded-2xl bg-brand-50/60 dark:bg-brand-950/20 border border-brand-200/60 dark:border-brand-900/40 text-xs">
          <div className="flex items-center gap-1.5 text-brand-700 dark:text-brand-300 font-bold mb-0.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>Next Target Action</span>
          </div>
          <p className="text-neutral-700 dark:text-neutral-300">{vendor.nextMilestone}</p>
        </div>

        {/* Contact info & Action CTA */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-neutral-100 dark:border-neutral-800 text-xs">
          <div className="space-y-1">
            <div className="font-semibold text-neutral-900 dark:text-white flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-neutral-400" />
              <span>{vendor.contactEmail}</span>
            </div>
            {vendor.phone && (
              <div className="text-neutral-500 flex items-center gap-1.5 text-[11px]">
                <Phone className="w-3.5 h-3.5 text-neutral-400" />
                <span>{vendor.phone} • {vendor.contactName}</span>
              </div>
            )}
          </div>
          <button
            onClick={() => {
              onClose();
              onDraftMessage(
                vendor.name,
                `Draft a professional outreach message to ${vendor.name} (${vendor.contactName}) regarding ${vendor.nextMilestone}.`
              );
            }}
            className="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-brand-500/20 transition active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Draft Message in Copilot</span>
          </button>
        </div>
      </div>
    </div>
  );
};
