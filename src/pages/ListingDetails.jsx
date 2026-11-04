import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  Sparkles,
  Layers,
  Copy,
  Check,
  Calendar,
  Tag,
  Hash,
  FileText,
  ListOrdered,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { fetchListingById } from '../services/historyService';
import ScoreProgress from '../components/listing/ScoreProgress';
import AccuracyStatus from '../components/listing/AccuracyStatus';
import { copyToClipboard, formatDate, capitalize } from '../utils/formatters';

export default function ListingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [listingData, setListingData] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function loadDetail() {
      try {
        setLoading(true);
        const res = await fetchListingById(decodeURIComponent(id));
        if (mounted) {
          setListingData(res.data);
        }
      } catch (err) {
        console.error('Error fetching listing details:', err);
        toast.error('Failed to load listing details');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadDetail();
    return () => {
      mounted = false;
    };
  }, [id]);

  const handleCopy = async (key, content, label) => {
    const ok = await copyToClipboard(content);
    if (ok) {
      setCopiedKey(key);
      toast.success(`${label} copied to clipboard!`, { duration: 2000 });
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  if (loading) {
    return (
      <div className="py-16 text-center text-slate-400 text-xs">
        Loading listing specifications...
      </div>
    );
  }

  if (!listingData) {
    return (
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-12 text-center space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Listing Not Found
        </h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          The requested listing could not be found in active records or Firestore.
        </p>
        <Link
          to="/history"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to History</span>
        </Link>
      </div>
    );
  }

  const {
    marketplace = 'amazon',
    listing = {},
    seo_score = 0,
    seo_score_breakdown = {},
    accuracy_passed = true,
    accuracy_score = 100,
    accuracy_issues = [],
    created_at,
    product,
  } = listingData;

  const fullListingText = `MARKETPLACE: ${marketplace.toUpperCase()}
TITLE:
${listing.title || ''}

BULLET POINTS:
${(listing.bullet_points || []).map((b, i) => `${i + 1}. ${b}`).join('\n')}

DESCRIPTION:
${listing.description || ''}

SEO KEYWORDS:
${(listing.seo_keywords || []).join(', ')}

SEARCH TAGS:
${(listing.search_tags || []).join(', ')}`;

  return (
    <div className="space-y-6">
      {/* Navigation & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            title="Go back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                {product?.name || listing.title || 'Listing Details'}
              </h2>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-md uppercase border ${
                  marketplace === 'amazon'
                    ? 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                    : marketplace === 'flipkart'
                    ? 'bg-blue-500/10 text-blue-500 border-blue-500/30'
                    : 'bg-pink-500/10 text-pink-500 border-pink-500/30'
                }`}
              >
                {marketplace}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
              <Calendar className="h-3 w-3" />
              <span>Created {formatDate(created_at)}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleCopy('full', fullListingText, 'Full listing')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors shadow-xs cursor-pointer"
          >
            {copiedKey === 'full' ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>Copied Full Listing</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy Full Listing</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Product Origin Info if available */}
      {product && (
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-slate-400 font-medium">Brand:</span>{' '}
            <span className="font-semibold text-slate-800 dark:text-slate-200">{product.brand || 'N/A'}</span>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Category:</span>{' '}
            <span className="font-semibold text-slate-800 dark:text-slate-200">{product.category || 'N/A'}</span>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Input Features:</span>{' '}
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {product.features?.length || 0} features analyzed
            </span>
          </div>
        </div>
      )}

      {/* Metrics & Validation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            SEO & Marketplace Algorithm Scores
          </h4>
          <ScoreProgress score={seo_score} label="Total SEO Quality Score" />

          {seo_score_breakdown && Object.keys(seo_score_breakdown).length > 0 && (
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-3">
              {Object.entries(seo_score_breakdown).map(([factor, score]) => (
                <div key={factor} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400 capitalize">{factor.replace(/_/g, ' ')}</span>
                    <span className="font-mono font-bold text-slate-200">{score}/100</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full"
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Factual Accuracy & Integrity
          </h4>
          <AccuracyStatus
            passed={accuracy_passed}
            score={accuracy_score}
            issues={accuracy_issues}
          />
        </div>
      </div>

      {/* Detailed Content Sections */}
      <div className="space-y-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5 sm:p-7 shadow-xs">
        {/* Title */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-indigo-500" />
              Listing Title
            </span>
            <button
              onClick={() => handleCopy('title', listing.title || '', 'Title')}
              className="text-xs text-slate-400 hover:text-indigo-500 flex items-center gap-1 cursor-pointer"
            >
              {copiedKey === 'title' ? (
                <Check className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              <span>{copiedKey === 'title' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-sm font-medium text-slate-900 dark:text-white leading-relaxed">
            {listing.title}
          </div>
        </div>

        {/* Bullet points */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <ListOrdered className="h-3.5 w-3.5 text-indigo-500" />
              Bullet Points
            </span>
            <button
              onClick={() =>
                handleCopy(
                  'bullets',
                  (listing.bullet_points || []).map((b, i) => `• ${b}`).join('\n'),
                  'Bullet points'
                )
              }
              className="text-xs text-slate-400 hover:text-indigo-500 flex items-center gap-1 cursor-pointer"
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
                className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold">
                  {idx + 1}
                </span>
                <span className="flex-1">{bullet}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-indigo-500" />
              Product Description
            </span>
            <button
              onClick={() => handleCopy('desc', listing.description || '', 'Description')}
              className="text-xs text-slate-400 hover:text-indigo-500 flex items-center gap-1 cursor-pointer"
            >
              {copiedKey === 'desc' ? (
                <Check className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              <span>{copiedKey === 'desc' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-xs sm:text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
            {listing.description}
          </div>
        </div>

        {/* Keywords and Tags */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5 text-indigo-500" />
              SEO Keywords
            </span>
            <div className="flex flex-wrap gap-1.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30">
              {(listing.seo_keywords || []).map((kw, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-300 text-xs font-medium"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Hash className="h-3.5 w-3.5 text-indigo-500" />
              Search Tags
            </span>
            <div className="flex flex-wrap gap-1.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30">
              {(listing.search_tags || []).map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-slate-200/60 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-mono"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
