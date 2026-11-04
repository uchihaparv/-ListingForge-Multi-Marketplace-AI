import React from 'react';
import { BarChart3, PieChart, Layers, ShieldCheck } from 'lucide-react';
import { capitalize } from '../../utils/formatters';

export default function ActivityChart({ listings = [] }) {
  if (!listings || listings.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-8 text-center bg-white/50 dark:bg-slate-900/40">
        <Layers className="h-8 w-8 mx-auto text-slate-400 mb-2 opacity-50" />
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          No Distribution Data Yet
        </h4>
        <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
          Generate listings to view channel distribution and SEO performance analytics.
        </p>
      </div>
    );
  }

  // Calculate Marketplace distribution
  const counts = { amazon: 0, flipkart: 0, meesho: 0 };
  let totalListings = 0;

  listings.forEach((item) => {
    const mp = (item.marketplace || '').toLowerCase();
    if (counts[mp] !== undefined) {
      counts[mp] += 1;
      totalListings += 1;
    } else {
      counts[mp] = (counts[mp] || 0) + 1;
      totalListings += 1;
    }
  });

  // Calculate SEO score brackets
  const seoBrackets = {
    high: 0, // 80-100
    mid: 0,  // 50-79
    low: 0,  // 0-49
  };

  listings.forEach((item) => {
    const score = Number(item.seo_score) || 0;
    if (score >= 80) seoBrackets.high += 1;
    else if (score >= 50) seoBrackets.mid += 1;
    else seoBrackets.low += 1;
  });

  const getPercent = (count) => (totalListings > 0 ? Math.round((count / totalListings) * 100) : 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Marketplace Share */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <PieChart className="h-4 w-4 text-indigo-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Marketplace Distribution
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-500">
            {totalListings} total
          </span>
        </div>

        <div className="space-y-4">
          {Object.entries(counts).map(([mp, count]) => {
            const pct = getPercent(count);
            const colorClass =
              mp === 'amazon'
                ? 'bg-amber-500'
                : mp === 'flipkart'
                ? 'bg-blue-500'
                : 'bg-pink-500';

            return (
              <div key={mp} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {capitalize(mp)}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 font-mono">{count} listings</span>
                    <span className="font-bold text-slate-900 dark:text-white font-mono w-10 text-right">
                      {pct}%
                    </span>
                  </div>
                </div>
                <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${colorClass}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SEO Score Performance */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-emerald-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              SEO Quality Distribution
            </h3>
          </div>
          <span className="text-xs text-emerald-500 font-medium">Real-time</span>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                High Optimization (80 - 100)
              </span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                {seoBrackets.high} ({getPercent(seoBrackets.high)}%)
              </span>
            </div>
            <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${getPercent(seoBrackets.high)}%` }}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-amber-600 dark:text-amber-400">
                Needs Improvement (50 - 79)
              </span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                {seoBrackets.mid} ({getPercent(seoBrackets.mid)}%)
              </span>
            </div>
            <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${getPercent(seoBrackets.mid)}%` }}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-rose-600 dark:text-rose-400">
                Low Performance (0 - 49)
              </span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                {seoBrackets.low} ({getPercent(seoBrackets.low)}%)
              </span>
            </div>
            <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-rose-500 rounded-full transition-all duration-500"
                style={{ width: `${getPercent(seoBrackets.low)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
