import React, { useState } from 'react';
import toast from 'react-hot-toast';
import {
  Copy,
  Check,
  RotateCw,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Tag,
  Hash,
  ListOrdered,
  FileText,
  BarChart3,
  Shield,
  Sparkles,
} from 'lucide-react';
import ScoreProgress from './ScoreProgress';
import AccuracyStatus from './AccuracyStatus';
import { copyToClipboard, capitalize, getScoreRating } from '../../utils/formatters';

const MARKETPLACE_META = {
  amazon: {
    name: 'Amazon',
    badge: 'Amazon.in A9 SEO',
    themeColor: 'text-amber-500 border-amber-500/30 bg-amber-500/10',
    titleLimit: 'Max 200 chars',
    bulletLimit: '5 Key Feature Bullets',
  },
  flipkart: {
    name: 'Flipkart',
    badge: 'Flipkart Search Ranked',
    themeColor: 'text-blue-500 border-blue-500/30 bg-blue-500/10',
    titleLimit: 'Max 120 chars',
    bulletLimit: 'Feature Highlights',
  },
  meesho: {
    name: 'Meesho',
    badge: 'Meesho Catalog Engine',
    themeColor: 'text-pink-500 border-pink-500/30 bg-pink-500/10',
    titleLimit: 'Max 100 chars',
    bulletLimit: 'Reseller Selling Points',
  },
};

export default function MarketplaceCard({ data, onRegenerate, isRegenerating }) {
  const [copiedKey, setCopiedKey] = useState(null);
  const [showBreakdown, setShowBreakdown] = useState(false);

  if (!data) return null;

  const {
    marketplace = 'amazon',
    listing = {},
    seo_score = 0,
    seo_score_breakdown = {},
    accuracy_passed = true,
    accuracy_score = 100,
    accuracy_issues = [],
  } = data;

  const meta = MARKETPLACE_META[marketplace.toLowerCase()] || {
    name: capitalize(marketplace),
    badge: `${capitalize(marketplace)} Listing`,
    themeColor: 'text-indigo-500 border-indigo-500/30 bg-indigo-500/10',
    titleLimit: 'Standard Format',
    bulletLimit: 'Bullet Points',
  };

  const handleCopy = async (key, content, label) => {
    const ok = await copyToClipboard(content);
    if (ok) {
      setCopiedKey(key);
      toast.success(`${label} copied to clipboard!`, { duration: 2000 });
      setTimeout(() => setCopiedKey(null), 2000);
    } else {
      toast.error('Failed to copy text.');
    }
  };

  const getFullListingText = () => {
    const bullets = (listing.bullet_points || []).map((b, i) => `${i + 1}. ${b}`).join('\n');
    const keywords = (listing.seo_keywords || []).join(', ');
    const tags = (listing.search_tags || []).join(', ');

    return `MARKETPLACE: ${meta.name.toUpperCase()}
TITLE:
${listing.title || ''}

BULLET POINTS:
${bullets}

DESCRIPTION:
${listing.description || ''}

SEO KEYWORDS:
${keywords}

SEARCH TAGS:
${tags}

METRICS:
- SEO Score: ${seo_score}/100
- Accuracy Score: ${accuracy_score}/100 (Status: ${accuracy_passed ? 'PASSED' : 'FLAGGED'})`;
  };

  const hasBreakdown = Object.keys(seo_score_breakdown || {}).length > 0;

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm overflow-hidden flex flex-col transition-all">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-slate-900 dark:text-white">
              {meta.name}
            </span>
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${meta.themeColor}`}
            >
              {meta.badge}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onRegenerate && (
            <button
              onClick={() => onRegenerate(marketplace)}
              disabled={isRegenerating}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
              title="Regenerate listing for this marketplace"
            >
              <RotateCw className={`h-3.5 w-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Regenerate</span>
            </button>
          )}

          <button
            onClick={() => handleCopy('full', getFullListingText(), 'Complete listing')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-xs transition-colors cursor-pointer"
          >
            {copiedKey === 'full' ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy All</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Scores & Validation Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-950/20">
        <div>
          <ScoreProgress score={seo_score} label="Overall SEO Optimization Score" />
          {hasBreakdown && (
            <button
              type="button"
              onClick={() => setShowBreakdown(!showBreakdown)}
              className="mt-2 text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <BarChart3 className="h-3 w-3" />
              <span>{showBreakdown ? 'Hide Breakdown' : 'View SEO Breakdown'}</span>
              {showBreakdown ? (
                <ChevronUp className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
            </button>
          )}
        </div>

        <div>
          <AccuracyStatus
            passed={accuracy_passed}
            score={accuracy_score}
            issues={accuracy_issues}
          />
        </div>
      </div>

      {/* SEO Score Breakdown Drawer */}
      {showBreakdown && hasBreakdown && (
        <div className="p-4 bg-slate-100/50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {Object.entries(seo_score_breakdown).map(([factor, factorScore]) => (
            <div
              key={factor}
              className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
            >
              <ScoreProgress
                score={Number(factorScore) || 0}
                label={factor.replace(/_/g, ' ').toUpperCase()}
                showBar={true}
              />
            </div>
          ))}
        </div>
      )}

      {/* Card Content Body */}
      <div className="p-4 sm:p-6 space-y-6 flex-1">
        {/* Title Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-indigo-500" />
              Product Title ({listing.title?.length || 0} Chars)
            </span>
            <button
              onClick={() => handleCopy('title', listing.title || '', 'Title')}
              className="text-xs text-slate-500 hover:text-indigo-500 dark:hover:text-indigo-400 font-medium inline-flex items-center gap-1 cursor-pointer"
            >
              {copiedKey === 'title' ? (
                <Check className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              <span>{copiedKey === 'title' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 font-medium text-sm text-slate-900 dark:text-slate-100 leading-relaxed select-text">
            {listing.title || <span className="text-slate-400 italic">No title generated</span>}
          </div>
        </div>

        {/* Bullet Points Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase flex items-center gap-1.5">
              <ListOrdered className="h-3.5 w-3.5 text-indigo-500" />
              Bullet Points ({listing.bullet_points?.length || 0})
            </span>
            <button
              onClick={() =>
                handleCopy(
                  'bullets',
                  (listing.bullet_points || []).map((b, i) => `• ${b}`).join('\n'),
                  'Bullet points'
                )
              }
              className="text-xs text-slate-500 hover:text-indigo-500 dark:hover:text-indigo-400 font-medium inline-flex items-center gap-1 cursor-pointer"
            >
              {copiedKey === 'bullets' ? (
                <Check className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              <span>{copiedKey === 'bullets' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="space-y-2">
            {(listing.bullet_points || []).map((bullet, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed select-text"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-semibold">
                  {idx + 1}
                </span>
                <span className="flex-1">{bullet}</span>
              </div>
            ))}
            {(!listing.bullet_points || listing.bullet_points.length === 0) && (
              <div className="p-3 text-xs text-slate-400 italic">No bullet points available</div>
            )}
          </div>
        </div>

        {/* Description Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-indigo-500" />
              Product Description
            </span>
            <button
              onClick={() => handleCopy('desc', listing.description || '', 'Description')}
              className="text-xs text-slate-500 hover:text-indigo-500 dark:hover:text-indigo-400 font-medium inline-flex items-center gap-1 cursor-pointer"
            >
              {copiedKey === 'desc' ? (
                <Check className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              <span>{copiedKey === 'desc' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line select-text">
            {listing.description || (
              <span className="text-slate-400 italic">No description generated</span>
            )}
          </div>
        </div>

        {/* Keywords and Search Tags Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* SEO Keywords */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5 text-indigo-500" />
                SEO Keywords ({listing.seo_keywords?.length || 0})
              </span>
              <button
                onClick={() =>
                  handleCopy(
                    'keywords',
                    (listing.seo_keywords || []).join(', '),
                    'Keywords'
                  )
                }
                className="text-xs text-slate-500 hover:text-indigo-500 dark:hover:text-indigo-400 font-medium inline-flex items-center gap-1 cursor-pointer"
              >
                {copiedKey === 'keywords' ? (
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                <span>{copiedKey === 'keywords' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 min-h-[50px]">
              {(listing.seo_keywords || []).map((kw, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-300 text-xs font-medium"
                >
                  {kw}
                </span>
              ))}
              {(!listing.seo_keywords || listing.seo_keywords.length === 0) && (
                <span className="text-xs text-slate-400 italic">No keywords generated</span>
              )}
            </div>
          </div>

          {/* Search Tags */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase flex items-center gap-1.5">
                <Hash className="h-3.5 w-3.5 text-indigo-500" />
                Search Tags ({listing.search_tags?.length || 0})
              </span>
              <button
                onClick={() =>
                  handleCopy('tags', (listing.search_tags || []).join(', '), 'Tags')
                }
                className="text-xs text-slate-500 hover:text-indigo-500 dark:hover:text-indigo-400 font-medium inline-flex items-center gap-1 cursor-pointer"
              >
                {copiedKey === 'tags' ? (
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                <span>{copiedKey === 'tags' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 min-h-[50px]">
              {(listing.search_tags || []).map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-slate-200/60 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-mono"
                >
                  #{tag}
                </span>
              ))}
              {(!listing.search_tags || listing.search_tags.length === 0) && (
                <span className="text-xs text-slate-400 italic">No tags generated</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
