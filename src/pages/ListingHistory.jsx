import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Search,
  Filter,
  Trash2,
  ExternalLink,
  Calendar,
  Layers,
  ArrowUpDown,
  AlertCircle,
  Database,
  RefreshCw,
} from 'lucide-react';
import { fetchListingHistory, deleteListingById, getHistoryApiUrl } from '../services/historyService';
import { formatDate, capitalize } from '../utils/formatters';

export default function ListingHistory() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [isApiConfigured, setIsApiConfigured] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [marketplaceFilter, setMarketplaceFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date_desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const historyUrl = getHistoryApiUrl();

  const loadHistory = async () => {
    try {
      setLoading(true);
      const res = await fetchListingHistory();
      setItems(res.data || []);
      setIsApiConfigured(res.isApiConfigured);
    } catch (err) {
      console.error('Failed to load history:', err);
      toast.error(err.message || 'Failed to load listing history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete listing for "${name}"?`)) {
      return;
    }

    try {
      const res = await deleteListingById(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
      toast.success(res.message || 'Listing removed successfully');
    } catch (err) {
      console.error('Failed to delete listing:', err);
      toast.error(err.message || 'Failed to delete listing');
    }
  };

  // Filter and Sort items
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        // Marketplace filter
        if (marketplaceFilter !== 'all') {
          if (item.marketplace?.toLowerCase() !== marketplaceFilter.toLowerCase()) {
            return false;
          }
        }
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = item.product_name?.toLowerCase().includes(q);
          const matchBrand = item.brand?.toLowerCase().includes(q);
          const matchCategory = item.category?.toLowerCase().includes(q);
          const matchTitle = item.listing?.title?.toLowerCase().includes(q);
          return matchName || matchBrand || matchCategory || matchTitle;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'date_desc') {
          return new Date(b.created_at || 0) - new Date(a.created_at || 0);
        }
        if (sortBy === 'date_asc') {
          return new Date(a.created_at || 0) - new Date(b.created_at || 0);
        }
        if (sortBy === 'seo_desc') {
          return (Number(b.seo_score) || 0) - (Number(a.seo_score) || 0);
        }
        if (sortBy === 'accuracy_desc') {
          return (Number(b.accuracy_score) || 0) - (Number(a.accuracy_score) || 0);
        }
        return 0;
      });
  }, [items, searchQuery, marketplaceFilter, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredItems.length / pageSize) || 1;
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, currentPage, pageSize]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Listing History & Archives
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Search, filter, inspect, and manage all previously generated multi-marketplace listings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadHistory}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Backend API Configuration Warning / Info */}
      {!isApiConfigured && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-amber-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Database className="h-5 w-5 text-amber-400 shrink-0" />
            <div>
              <span className="font-semibold text-amber-300">
                Firestore History API is not yet configured:
              </span>{' '}
              ListingForge is showing items saved in your active browser session. To fetch directly from Firebase Firestore via n8n, configure <code>VITE_HISTORY_API_URL</code>.
            </div>
          </div>
          <Link
            to="/settings"
            className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 underline hover:text-white shrink-0"
          >
            <span>Setup Instructions</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      )}

      {/* Search & Filters Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-xs">
        {/* Search Input */}
        <div className="sm:col-span-5 relative">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by product name, brand, title..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Marketplace Filter */}
        <div className="sm:col-span-4 flex items-center gap-1 bg-slate-50 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
          {['all', 'amazon', 'flipkart', 'meesho'].map((mp) => (
            <button
              key={mp}
              onClick={() => {
                setMarketplaceFilter(mp);
                setCurrentPage(1);
              }}
              className={`flex-1 py-1.5 rounded-lg font-medium transition-colors cursor-pointer text-center capitalize ${
                marketplaceFilter === mp
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {mp}
            </button>
          ))}
        </div>

        {/* Sort Select */}
        <div className="sm:col-span-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="date_desc">Newest First</option>
            <option value="date_asc">Oldest First</option>
            <option value="seo_desc">Highest SEO Score</option>
            <option value="accuracy_desc">Highest Accuracy</option>
          </select>
        </div>
      </div>

      {/* History Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            Loading listing history...
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Layers className="h-8 w-8 text-slate-400 mx-auto opacity-60" />
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              No Listings Found
            </h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {searchQuery || marketplaceFilter !== 'all'
                ? 'No items matched your current filters. Try resetting search parameters.'
                : 'Your history archive is empty. Generate a listing to view it here.'}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50/50 dark:bg-slate-950/40 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-5 py-3">Product Name</th>
                    <th className="px-5 py-3">Marketplace</th>
                    <th className="px-5 py-3">SEO Score</th>
                    <th className="px-5 py-3">Accuracy</th>
                    <th className="px-5 py-3">Generated Date</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {paginatedItems.map((item) => (
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
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/listing/${encodeURIComponent(item.id)}`}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors"
                            title="View Listing Details"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(item.id, item.product_name)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                            title="Delete Listing"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-slate-200 dark:border-slate-800 text-xs">
                <span className="text-slate-500">
                  Showing {(currentPage - 1) * pageSize + 1} to{' '}
                  {Math.min(currentPage * pageSize, filteredItems.length)} of{' '}
                  {filteredItems.length} listings
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Previous
                  </button>
                  <span className="px-2 font-mono text-slate-600 dark:text-slate-300">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
