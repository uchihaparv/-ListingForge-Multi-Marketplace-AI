import React, { useState } from 'react';
import { Sparkles, AlertCircle, ArrowUpRight, RotateCcw, ExternalLink } from 'lucide-react';
import ProductForm from '../components/listing/ProductForm';
import MarketplaceCard from '../components/listing/MarketplaceCard';
import { useListings } from '../hooks/useListings';
import { getGenerateApiUrl } from '../services/listingService';

export default function GenerateListing() {
  const { isLoading, error, lastGenerated, generate, clearCurrent } = useListings();
  const [currentPayload, setCurrentPayload] = useState(null);

  const handleFormSubmit = async (formData) => {
    setCurrentPayload(formData);
    await generate(formData);
  };

  const handleRegenerate = async (targetMarketplace) => {
    if (!currentPayload || isLoading) return;
    // Re-run for the specific marketplace
    const payload = {
      ...currentPayload,
      marketplaces: [targetMarketplace],
    };
    await generate(payload);
  };

  const generateUrl = getGenerateApiUrl();

  return (
    <div className="space-y-8">
      {/* Top Description */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Generate Multi-Marketplace AI Listings
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Target Amazon, Flipkart, and Meesho with SEO-optimized copy, character limit compliance, and factual accuracy checks.
        </p>
      </div>

      {/* Error / CORS Guidance Banner if error occurred */}
      {error && (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-5 text-rose-300 space-y-3">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-rose-200">
                {error.title || 'Listing Generation Failed'}
              </h4>
              <p className="text-xs text-rose-300 leading-relaxed">
                {error.message}
              </p>
            </div>
          </div>

          {error.type === 'network_error' && (
            <div className="pt-2 pl-8 border-t border-rose-500/20 text-xs space-y-2">
              <p className="font-semibold text-rose-200">
                How to resolve CORS in n8n Cloud:
              </p>
              <ol className="list-decimal pl-4 space-y-1 text-rose-300/90 text-[11px]">
                <li>Open your n8n workflow at <code>parvmahajan123.app.n8n.cloud</code></li>
                <li>Double click the <strong>Webhook</strong> trigger node</li>
                <li>Under <strong>Options</strong>, click <strong>Add Option</strong> → select <strong>Allowed Origins (CORS)</strong></li>
                <li>Set the value to <code>*</code> (or your localhost port: <code>http://localhost:5173</code>)</li>
                <li>Under <strong>Response Headers</strong>, add: <code>Access-Control-Allow-Origin: *</code></li>
                <li>Save and activate the workflow.</li>
              </ol>
            </div>
          )}
        </div>
      )}

      {/* Main Grid: Form and Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs">
          <ProductForm
            onSubmit={handleFormSubmit}
            isLoading={isLoading}
            initialValues={currentPayload}
          />
        </div>

        {/* Right Column: Generated Results */}
        <div className="lg:col-span-7 space-y-6">
          {/* Header of results area */}
          <div className="flex items-center justify-between pb-1 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-indigo-500" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Generated Listings Output
              </h3>
            </div>
            {lastGenerated?.listings?.length > 0 && (
              <button
                onClick={clearCurrent}
                className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset View</span>
              </button>
            )}
          </div>

          {/* Loading State Skeleton / Card */}
          {isLoading && (
            <div className="rounded-2xl border border-indigo-500/30 bg-indigo-500/5 p-8 text-center space-y-4">
              <div className="relative flex items-center justify-center">
                <div className="h-14 w-14 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
                <Sparkles className="h-6 w-6 text-indigo-400 absolute" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  Synthesizing High-Converting Listings...
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  Groq AI is optimizing marketplace constraints, extracting high-intent keywords, validating factual claims, and computing SEO scores.
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 text-[11px] text-indigo-400 font-mono">
                <span>Webhook: {generateUrl}</span>
              </div>
            </div>
          )}

          {/* Empty State before any generation */}
          {!isLoading && (!lastGenerated || !lastGenerated.listings || lastGenerated.listings.length === 0) && (
            <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-12 text-center bg-white/50 dark:bg-slate-900/30 space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mx-auto">
                <Sparkles className="h-6 w-6" />
              </div>
              <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Awaiting Product Submission
              </h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Fill in the product specifications on the left, select target marketplaces, and click Generate to see live AI listings.
              </p>
            </div>
          )}

          {/* Listing Results Cards */}
          {!isLoading && lastGenerated?.listings && lastGenerated.listings.length > 0 && (
            <div className="space-y-6">
              {lastGenerated.listings.map((item, idx) => (
                <MarketplaceCard
                  key={item.id || item.marketplace || idx}
                  data={item}
                  onRegenerate={handleRegenerate}
                  isRegenerating={isLoading}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
