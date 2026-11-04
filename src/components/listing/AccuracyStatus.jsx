import React from 'react';
import { ShieldCheck, AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';
import { normalizeScore } from '../../utils/formatters';

export default function AccuracyStatus({ passed, score, issues = [] }) {
  const normScore = normalizeScore(score);
  const isPassing = passed && normScore >= 50 && (!issues || issues.length === 0);

  return (
    <div className="space-y-2">
      <div
        className={`flex items-center justify-between rounded-lg p-2.5 border transition-colors ${
          isPassing
            ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-300'
            : 'border-rose-500/30 bg-rose-500/5 text-rose-300'
        }`}
      >
        <div className="flex items-center gap-2">
          {isPassing ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
          )}
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            {isPassing ? 'Factual Accuracy Verified' : 'Accuracy Validation Alert'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
            {normScore}%
          </span>
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
              isPassing
                ? 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border-emerald-500/30'
                : 'bg-rose-500/10 text-rose-500 dark:text-rose-400 border-rose-500/30'
            }`}
          >
            {isPassing ? 'PASSED' : 'FLAGGED'}
          </span>
        </div>
      </div>

      {/* Unsupported claims / Accuracy issues section */}
      {issues && issues.length > 0 && (
        <div className="rounded-lg border border-rose-500/40 bg-rose-950/20 p-3 space-y-1.5 text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-rose-400">
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>Unsupported Product Claims Detected:</span>
          </div>
          <ul className="space-y-1 pl-4 list-disc text-rose-300/90 text-[11px] leading-relaxed">
            {issues.map((issue, idx) => (
              <li key={idx}>
                {typeof issue === 'object' ? JSON.stringify(issue) : String(issue)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
