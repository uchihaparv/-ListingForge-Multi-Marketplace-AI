import React from 'react';
import { Check } from 'lucide-react';

const MARKETPLACES = [
  {
    id: 'amazon',
    name: 'Amazon',
    description: 'A9 Algorithm: 200 char titles, 5 benefit-driven bullets, backend keywords.',
    color: 'from-amber-500/20 to-orange-500/20 border-amber-500/40 text-amber-500',
    accent: 'bg-amber-500',
  },
  {
    id: 'flipkart',
    name: 'Flipkart',
    description: 'Flipkart Search: High-density feature tags, warranty specs, clear value hook.',
    color: 'from-blue-500/20 to-sky-500/20 border-blue-500/40 text-blue-500',
    accent: 'bg-blue-500',
  },
  {
    id: 'meesho',
    name: 'Meesho',
    description: 'Reseller Catalog: Direct, budget-conscious highlights, trending discovery tags.',
    color: 'from-pink-500/20 to-rose-500/20 border-pink-500/40 text-pink-500',
    accent: 'bg-pink-500',
  },
];

export default function MarketplaceSelector({ selected = [], onChange, disabled }) {
  const toggle = (id) => {
    if (disabled) return;
    if (selected.includes(id)) {
      onChange(selected.filter((item) => item !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {MARKETPLACES.map((m) => {
        const isSelected = selected.includes(m.id);
        return (
          <button
            type="button"
            key={m.id}
            onClick={() => toggle(m.id)}
            disabled={disabled}
            className={`relative flex flex-col text-left p-3.5 rounded-xl border transition-all duration-200 cursor-pointer ${
              isSelected
                ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 ring-1 ring-indigo-500 shadow-sm'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700'
            } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            <div className="flex items-center justify-between w-full mb-1.5">
              <span className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${m.accent}`} />
                {m.name}
              </span>
              <div
                className={`h-5 w-5 rounded-md flex items-center justify-center border transition-colors ${
                  isSelected
                    ? 'bg-indigo-600 border-indigo-600 text-white'
                    : 'border-slate-300 dark:border-slate-700 bg-transparent'
                }`}
              >
                {isSelected && <Check className="h-3.5 w-3.5" />}
              </div>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
              {m.description}
            </p>
          </button>
        );
      })}
    </div>
  );
}
