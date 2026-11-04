import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  Sparkles,
  ShoppingBag,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  Clock,
  ExternalLink,
  PlusCircle,
  Database,
} from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import ActivityChart from '../components/dashboard/ActivityChart';
import { fetchListingHistory } from '../services/historyService';
import { formatDate, capitalize } from '../utils/formatters';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState([]);
  const [isApiConfigured, setIsApiConfigured] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function loadData() {
      try {
        setLoading(true);
        const res = await fetchListingHistory();
        if (mounted) {
          setListings(res.data || []);
          setIsApiConfigured(res.isApiConfigured);
        }
      } catch (err) {
        console.error('Failed to load dashboard listings:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      mounted = false;
    };
  }, []);

  // Compute real statistics from actual data
  const totalListings = listings.length;

  // Distinct products processed (by product name or batchId)
  const uniqueProducts = new Set(
    listings.map((l) => l.product_name || l.batchId).filter(Boolean)
  ).size;

  const avgSeoScore =
    totalListings > 0
      ? Math.round(
          listings.reduce((acc, curr) => acc + (Number(curr.seo_score) || 0), 0) / totalListings
        )
      : 0;

  const avgAccuracyScore =
    totalListings > 0
      ? Math.round(
          listings.reduce((acc, curr) => acc + (Number(curr.accuracy_score) || 0), 0) /
            totalListings
        )
      : 0;

  // Recent 5 listings
  const recentListings = [...listings].slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Top Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 text-white shadow-lg">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[11px] font-semibold border border-indigo-500/30">
            <Sparkles className="h-3 w-3" />
            <span>AI E-Commerce Suite</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            Multi-Marketplace Command Center
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Generate, optimize, and fact-check product listings for Amazon, Flipkart, and Meesho in seconds.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/generate"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold text-xs sm:text-sm text-white shadow-md shadow-indigo-600/40 transition-all hover:scale-102"
          >
            <Sparkles className="h-4 w-4" />
            <span>Generate New Listing</span>
          </Link>
        </div>
      </div>

      {/* Backend Integration Banner if using local cache */}
      {!isApiConfigured && totalListings > 0 && (
        <div className="flex items-center justify-between p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-200 text-xs">
          <div className="flex items-center gap-2.5">
            <Database className="h-4 w-4 text-amber-400 shrink-0" />
            <span>
              Currently displaying listings from your active session cache. To persist across devices, set up the Firestore GET /history webhook.
            </span>
          </div>
          <Link
            to="/settings"
            className="text-[11px] font-semibold text-amber-300 underline hover:text-white shrink-0 ml-2"
          >
            View Setup Guide
          </Link>
        </div>
      )}

      {/* Real Statistics Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Listings Generated"
          value={totalListings}
          subtitle={totalListings === 0 ? 'No listings generated yet' : 'Total marketplace outputs'}
          icon={Layers}
          color="indigo"
        />
        <StatCard
          title="Products Processed"
          value={uniqueProducts}
          subtitle={uniqueProducts === 0 ? 'Ready for input' : 'Distinct SKUs analyzed'}
          icon={ShoppingBag}
          color="blue"
        />
        <StatCard
          title="Average SEO Score"
          value={totalListings > 0 ? `${avgSeoScore}/100` : '--'}
          subtitle={totalListings > 0 ? 'A9 & Search Algorithm Quality' : 'Awaiting listing batch'}
          icon={TrendingUp}
          color="emerald"
        />
        <StatCard
          title="Avg Factual Accuracy"
          value={totalListings > 0 ? `${avgAccuracyScore}%` : '--'}
          subtitle={totalListings > 0 ? 'Verified against specifications' : 'Validation engine ready'}
          icon={ShieldCheck}
          color="violet"
        />
      </div>

      {/* Charts: Marketplace Distribution & SEO Quality */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Performance & Channel Analytics
          </h3>
        </div>
        <ActivityChart listings={listings} />
      </div>

      {/* Recent Listing Activity */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-xs overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Recent Listing Activity
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Latest AI-generated listings across channels
            </p>
          </div>
          {totalListings > 0 && (
            <Link
              to="/history"
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>View All ({totalListings})</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          )}
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            Loading recent listings...
          </div>
        ) : recentListings.length === 0 ? (
          /* Empty State */
          <div className="p-12 text-center space-y-3">
            <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mx-auto">
              <Sparkles className="h-6 w-6" />
            </div>
            <h4 className="text-base font-semibold text-slate-800 dark:text-slate-200">
              No Listings Created Yet
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Ready to generate your first multi-marketplace listing? Fill in your product specifications and launch the AI generator.
            </p>
            <div className="pt-2">
              <Link
                to="/generate"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Create First Listing</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/50 dark:bg-slate-950/40 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-5 py-3">Product Name</th>
                  <th className="px-5 py-3">Marketplace</th>
                  <th className="px-5 py-3">SEO Score</th>
                  <th className="px-5 py-3">Accuracy</th>
                  <th className="px-5 py-3">Generated</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {recentListings.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-slate-900 dark:text-white max-w-xs truncate">
                        {item.product_name}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {item.brand} • {item.category}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-md text-xs font-semibold uppercase ${
                          item.marketplace === 'amazon'
                            ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                            : item.marketplace === 'flipkart'
                            ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                            : 'bg-pink-500/10 text-pink-500 border border-pink-500/20'
                        }`}
                      >
                        {item.marketplace}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                        {item.seo_score}/100
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-semibold ${
                          item.accuracy_passed ? 'text-emerald-500' : 'text-rose-500'
                        }`}
                      >
                        {item.accuracy_passed ? 'Passed' : 'Flagged'} ({item.accuracy_score}%)
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-400">
                      {formatDate(item.created_at)}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Link
                        to={`/listing/${encodeURIComponent(item.id)}`}
                        className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        <span>View</span>
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
