import React from 'react';
import { CheckCircle2, Clock, Utensils } from 'lucide-react';
import { Guest } from '../../types';

interface GuestRowProps {
  guest: Guest;
}

export const GuestRow: React.FC<GuestRowProps> = ({ guest: g }) => {
  return (
    <tr className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/40">
      <td className="py-3 px-3">
        <div className="font-semibold text-neutral-900 dark:text-white">{g.name}</div>
        <div className="text-[11px] text-neutral-400">
          {g.email} • {g.partySize} guest{g.partySize > 1 ? 's' : ''}
        </div>
      </td>
      <td className="py-3 px-3">
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
            g.status === 'Confirmed'
              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
              : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
          }`}
        >
          {g.status === 'Confirmed' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
          {g.status}
        </span>
      </td>
      <td className="py-3 px-3">
        <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-300">
          <Utensils className="w-3.5 h-3.5 text-brand-500 flex-shrink-0" />
          <span>{g.dietaryRestrictions || 'None reported'}</span>
        </div>
      </td>
      <td className="py-3 px-3 font-medium text-neutral-500 dark:text-neutral-400">
        {g.table || 'Unassigned'}
      </td>
    </tr>
  );
};
