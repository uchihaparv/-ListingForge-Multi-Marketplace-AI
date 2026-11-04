import React from 'react';
import { getScoreRating } from '../../utils/formatters';

export default function ScoreProgress({ score, label, size = 'md', showBar = true }) {
  const rating = getScoreRating(score);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-slate-500 dark:text-slate-400">{label}</span>
        <div className="flex items-center gap-1.5">
          <span className={`font-mono font-bold ${rating.textClass}`}>
            {score}
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">/100</span>
          </span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold border ${rating.bgClass} ${rating.textClass} ${rating.borderClass}`}
          >
            {rating.label}
          </span>
        </div>
      </div>

      {showBar && (
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800/80">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${rating.fillClass}`}
            style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
          />
        </div>
      )}
    </div>
  );
}
