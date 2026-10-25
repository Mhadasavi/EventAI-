import React from 'react';
import { VendorPartner } from '../types';

interface VendorRadarProps {
  vendors: VendorPartner[];
  onSelectVendor: (vendor: VendorPartner) => void;
}

export const VendorRadar: React.FC<VendorRadarProps> = ({ vendors, onSelectVendor }) => {
  return (
    <div className="rounded-3xl bg-white dark:bg-[#18191e] border border-neutral-200/80 dark:border-neutral-800 p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-xl font-bold text-neutral-900 dark:text-white">
            Vendor Radar & Contract Health
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Real-time status of {vendors.length} tier-one event partners.
          </p>
        </div>
        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-300">
          {vendors.length} Active
        </span>
      </div>

      {/* Vendor Partner Status Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {vendors.map((vendor) => (
          <div
            key={vendor.id}
            onClick={() => onSelectVendor(vendor)}
            className="p-3.5 rounded-2xl bg-neutral-50/80 dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800 hover:border-brand-500/40 cursor-pointer flex flex-col justify-between transition group"
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-xs font-bold text-neutral-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition">
                  {vendor.name}
                </h4>
                <span className="text-[10px] text-neutral-400 block mt-0.5">{vendor.role}</span>
              </div>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  vendor.status === 'Signed'
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                    : vendor.status === 'Review'
                    ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                    : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                }`}
              >
                {vendor.status}
              </span>
            </div>

            <div className="mt-3 pt-2 border-t border-neutral-200/50 dark:border-neutral-800/80 flex items-center justify-between text-xs">
              <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                ${vendor.totalContract.toLocaleString()}
              </span>
              <span
                className={`text-[10px] font-medium ${
                  vendor.status === 'Review'
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-emerald-600 dark:text-emerald-400'
                }`}
              >
                {vendor.statusNote}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
