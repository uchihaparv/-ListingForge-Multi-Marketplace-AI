import React, { useState } from 'react';
import { Plus, Trash2, Sparkles, Loader2, Wand2, Info } from 'lucide-react';
import MarketplaceSelector from './MarketplaceSelector';
import { validateProductForm } from '../../utils/validators';

const SAMPLE_PRODUCTS = [
  {
    name: 'AeroPulse Wireless Noise-Cancelling Headphones',
    brand: 'AeroTech',
    category: 'Consumer Electronics & Audio',
    description: 'High-fidelity over-ear Bluetooth headphones engineered for audiophiles and travelers with active hybrid noise cancellation and 40-hour battery life.',
    features: [
      'Hybrid Active Noise Cancellation (up to 35dB reduction)',
      '40mm custom bio-cellulose high-resolution drivers',
      '40-hour playtime with USB-C quick charge (10 min = 4 hours)',
      'Multipoint Bluetooth 5.3 connectivity with low-latency gaming mode',
      'Plush memory foam earcups with aircraft-grade aluminum headband',
    ],
    marketplaces: ['amazon', 'flipkart', 'meesho'],
  },
  {
    name: 'PrecisionPro Ergonomic RGB Wireless Gaming Mouse',
    brand: 'Logitech',
    category: 'Gaming Accessories',
    description: 'Ultra-lightweight wireless gaming mouse with 26,000 DPI optical sensor, optical switches, and 85 hours battery life.',
    features: [
      '26,000 DPI Hero optical sensor with 650 IPS tracking',
      'Optical-mechanical switches rated for 90 million clicks',
      '63g lightweight ergonomic right-handed chassis',
      'Hyper-fast 1ms wireless response time with zero latency',
      'Onboard memory profiles and customizable RGB lighting zones',
    ],
    marketplaces: ['amazon', 'flipkart'],
  },
];

export default function ProductForm({ onSubmit, isLoading, initialValues }) {
  const [name, setName] = useState(initialValues?.product?.name || '');
  const [brand, setBrand] = useState(initialValues?.product?.brand || '');
  const [category, setCategory] = useState(initialValues?.product?.category || '');
  const [description, setDescription] = useState(initialValues?.product?.description || '');
  const [features, setFeatures] = useState(
    initialValues?.product?.features && initialValues.product.features.length > 0
      ? initialValues.product.features
      : ['']
  );
  const [selectedMarketplaces, setSelectedMarketplaces] = useState(
    initialValues?.marketplaces || ['amazon', 'flipkart', 'meesho']
  );
  const [errors, setErrors] = useState({});

  const handleFeatureChange = (index, value) => {
    const updated = [...features];
    updated[index] = value;
    setFeatures(updated);
    if (errors.features && value.trim() !== '') {
      setErrors((prev) => ({ ...prev, features: null }));
    }
  };

  const addFeature = () => {
    setFeatures([...features, '']);
  };

  const removeFeature = (idx) => {
    if (features.length <= 1) {
      setFeatures(['']);
      return;
    }
    setFeatures(features.filter((_, i) => i !== idx));
  };

  const loadSample = (index = 0) => {
    const sample = SAMPLE_PRODUCTS[index];
    setName(sample.name);
    setBrand(sample.brand);
    setCategory(sample.category);
    setDescription(sample.description);
    setFeatures(sample.features);
    setSelectedMarketplaces(sample.marketplaces);
    setErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoading) return;

    const payload = {
      product: {
        name: name.trim(),
        brand: brand.trim(),
        category: category.trim(),
        description: description.trim(),
        features: features.map((f) => f.trim()).filter(Boolean),
      },
      marketplaces: selectedMarketplaces,
    };

    const validation = validateProductForm(payload);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header & Quick Sample Filler */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Product Specifications
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Provide comprehensive product details for Groq AI to optimize across marketplaces.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => loadSample(0)}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors shadow-xs"
          >
            <Wand2 className="h-3.5 w-3.5 text-indigo-500" />
            <span>Fill Sample Product</span>
          </button>
        </div>
      </div>

      {/* Main product attributes */}
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Product Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors((prev) => ({ ...prev, name: null }));
            }}
            disabled={isLoading}
            placeholder="e.g. Sony WH-1000XM5 Wireless Active Noise Canceling Headphones"
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-colors bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
              errors.name
                ? 'border-rose-500 ring-1 ring-rose-500'
                : 'border-slate-200 dark:border-slate-800 focus:border-indigo-500'
            }`}
          />
          {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Brand <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={brand}
              onChange={(e) => {
                setBrand(e.target.value);
                if (errors.brand) setErrors((prev) => ({ ...prev, brand: null }));
              }}
              disabled={isLoading}
              placeholder="e.g. Sony, boAt, Apple"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-colors bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                errors.brand
                  ? 'border-rose-500 ring-1 ring-rose-500'
                  : 'border-slate-200 dark:border-slate-800 focus:border-indigo-500'
              }`}
            />
            {errors.brand && <p className="text-xs text-rose-500 mt-1">{errors.brand}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Category <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                if (errors.category) setErrors((prev) => ({ ...prev, category: null }));
              }}
              disabled={isLoading}
              placeholder="e.g. Electronics & Headphones"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-colors bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                errors.category
                  ? 'border-rose-500 ring-1 ring-rose-500'
                  : 'border-slate-200 dark:border-slate-800 focus:border-indigo-500'
              }`}
            />
            {errors.category && <p className="text-xs text-rose-500 mt-1">{errors.category}</p>}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Product Description <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (errors.description) setErrors((prev) => ({ ...prev, description: null }));
            }}
            disabled={isLoading}
            placeholder="Provide a comprehensive summary of what makes this product unique, target audience, usage scenarios, and core materials..."
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-colors bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
              errors.description
                ? 'border-rose-500 ring-1 ring-rose-500'
                : 'border-slate-200 dark:border-slate-800 focus:border-indigo-500'
            }`}
          />
          {errors.description && <p className="text-xs text-rose-500 mt-1">{errors.description}</p>}
        </div>

        {/* Dynamic Features List */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Key Features & Specifications <span className="text-rose-500">*</span>
            </label>
            <span className="text-[11px] text-slate-400 dark:text-slate-500">
              At least 1 feature required for factual accuracy check
            </span>
          </div>

          <div className="space-y-2">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => handleFeatureChange(idx, e.target.value)}
                  disabled={isLoading}
                  placeholder={`Feature ${idx + 1} (e.g. 30-hour battery life, IPX4 waterproof, Bluetooth 5.3)`}
                  className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => removeFeature(idx)}
                  disabled={isLoading || features.length <= 1}
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-400"
                  title="Remove feature"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          {errors.features && <p className="text-xs text-rose-500 mt-1.5">{errors.features}</p>}

          <button
            type="button"
            onClick={addFeature}
            disabled={isLoading}
            className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 hover:underline transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add another feature</span>
          </button>
        </div>
      </div>

      {/* Target Marketplaces */}
      <div className="pt-2">
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
          Target Marketplaces <span className="text-rose-500">*</span>
        </label>
        <MarketplaceSelector
          selected={selectedMarketplaces}
          onChange={(val) => {
            setSelectedMarketplaces(val);
            if (errors.marketplaces) setErrors((prev) => ({ ...prev, marketplaces: null }));
          }}
          disabled={isLoading}
        />
        {errors.marketplaces && (
          <p className="text-xs text-rose-500 mt-1.5">{errors.marketplaces}</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm shadow-md shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Generating Listings via n8n & Groq AI...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              <span>Generate Multi-Marketplace Listings</span>
            </>
          )}
        </button>
        <p className="text-[11px] text-center text-slate-400 dark:text-slate-500 mt-2">
          Executes Groq AI reasoning, marketplace character limits, SEO scoring, and Firestore persistence.
        </p>
      </div>
    </form>
  );
}
