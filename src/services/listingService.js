import { apiClient, parseApiError } from './api.js';
import { normalizeScore } from '../utils/formatters.js';

const DEFAULT_GENERATE_URL = 'https://parvmahajan123.app.n8n.cloud/webhook/listingforge/generate';

/**
 * Get configured generate webhook URL
 */
export function getGenerateApiUrl() {
  return import.meta.env.VITE_GENERATE_API_URL || DEFAULT_GENERATE_URL;
}

/**
 * Normalize an individual marketplace listing object returned by the backend
 */
export function normalizeListing(rawListing) {
  if (!rawListing) return null;

  const marketplace = (rawListing.marketplace || 'unknown').toLowerCase();
  const listingData = rawListing.listing || {};

  // Normalize bullet points
  let bulletPoints = [];
  if (Array.isArray(listingData.bullet_points)) {
    bulletPoints = listingData.bullet_points.filter(Boolean);
  } else if (typeof listingData.bullet_points === 'string') {
    bulletPoints = listingData.bullet_points
      .split('\n')
      .map((s) => s.replace(/^[-*•\d.]+\s*/, '').trim())
      .filter(Boolean);
  }

  // Normalize keywords
  let keywords = [];
  if (Array.isArray(listingData.seo_keywords)) {
    keywords = listingData.seo_keywords.filter(Boolean);
  } else if (typeof listingData.seo_keywords === 'string') {
    keywords = listingData.seo_keywords.split(',').map((s) => s.trim()).filter(Boolean);
  }

  // Normalize search tags
  let tags = [];
  if (Array.isArray(listingData.search_tags)) {
    tags = listingData.search_tags.filter(Boolean);
  } else if (typeof listingData.search_tags === 'string') {
    tags = listingData.search_tags.split(',').map((s) => s.trim()).filter(Boolean);
  }

  // Normalize SEO breakdown
  const rawBreakdown = rawListing.seo_score_breakdown || {};
  const normalizedBreakdown = {};
  if (typeof rawBreakdown === 'object' && rawBreakdown !== null) {
    for (const [k, v] of Object.entries(rawBreakdown)) {
      normalizedBreakdown[k] = normalizeScore(v);
    }
  }

  // Accuracy issues
  const accuracyIssues = Array.isArray(rawListing.accuracy_issues)
    ? rawListing.accuracy_issues
    : rawListing.accuracy_issues
    ? [String(rawListing.accuracy_issues)]
    : [];

  return {
    id: rawListing.id || `${marketplace}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    marketplace,
    listing: {
      title: listingData.title || 'Untitled Listing',
      bullet_points: bulletPoints,
      description: listingData.description || '',
      seo_keywords: keywords,
      search_tags: tags,
    },
    seo_score: normalizeScore(rawListing.seo_score),
    seo_score_breakdown: normalizedBreakdown,
    accuracy_passed: rawListing.accuracy_passed !== false && rawListing.accuracy_passed !== 'false',
    accuracy_score: normalizeScore(rawListing.accuracy_score),
    accuracy_issues: accuracyIssues,
    created_at: rawListing.created_at || new Date().toISOString(),
  };
}

/**
 * Generate product listings using the n8n Cloud webhook
 */
export async function generateProductListings(payload) {
  const url = getGenerateApiUrl();

  if (!url) {
    throw {
      title: 'Missing API URL',
      message: 'VITE_GENERATE_API_URL is not configured in your environment variables.',
      type: 'config_error',
    };
  }

  try {
    const response = await apiClient.post(url, payload);
    const data = response.data;

    // Expected format: { success: true, message: "...", listings: [...] }
    // Or sometimes n8n returns an array or raw object directly
    let rawListings = [];

    if (data && data.success && Array.isArray(data.listings)) {
      rawListings = data.listings;
    } else if (Array.isArray(data)) {
      rawListings = data;
    } else if (data && Array.isArray(data.listings)) {
      rawListings = data.listings;
    } else if (data && data.listing) {
      rawListings = [data];
    } else {
      throw {
        title: 'Unexpected API Structure',
        message: data?.message || 'API responded without a valid listings array.',
        type: 'validation_error',
      };
    }

    const normalizedListings = rawListings.map(normalizeListing).filter(Boolean);

    // Save generated batch to local storage history as local cache
    saveLocalBatch({
      id: `batch-${Date.now()}`,
      product: payload.product,
      marketplaces: payload.marketplaces,
      listings: normalizedListings,
      created_at: new Date().toISOString(),
    });

    return {
      success: true,
      message: data.message || 'Listings generated successfully',
      listings: normalizedListings,
      product: payload.product,
    };
  } catch (error) {
    if (error.title) throw error;
    throw parseApiError(error);
  }
}

/**
 * Local cache helper to ensure recent listings are never lost
 */
const STORAGE_KEY = 'listingforge_local_history';

export function getLocalHistory() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveLocalBatch(batch) {
  try {
    const history = getLocalHistory();
    const updated = [batch, ...history.slice(0, 49)]; // keep latest 50
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save to local cache:', e);
  }
}

export function deleteLocalListing(id) {
  try {
    const history = getLocalHistory();
    const filtered = history.filter((b) => b.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return filtered;
  } catch {
    return [];
  }
}
