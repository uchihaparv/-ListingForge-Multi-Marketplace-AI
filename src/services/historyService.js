import { apiClient, parseApiError } from './api.js';
import { getLocalHistory, deleteLocalListing, normalizeListing } from './listingService.js';

export function getHistoryApiUrl() {
  return import.meta.env.VITE_HISTORY_API_URL || '';
}

export function getListingDetailsApiUrl() {
  return import.meta.env.VITE_LISTING_DETAILS_API_URL || '';
}

export function getDeleteListingApiUrl() {
  return import.meta.env.VITE_DELETE_LISTING_API_URL || '';
}

/**
 * Fetch all listings from n8n Firestore API, with fallback to local session history
 */
export async function fetchListingHistory() {
  const url = getHistoryApiUrl();

  if (!url) {
    // Return local cache along with unconfigured status
    const localBatches = getLocalHistory();
    // Flatten batches into individual listing rows for the table
    const flattened = [];
    localBatches.forEach((batch) => {
      (batch.listings || []).forEach((item) => {
        flattened.push({
          id: item.id || `${batch.id}-${item.marketplace}`,
          batchId: batch.id,
          product_name: batch.product?.name || 'Untitled Product',
          brand: batch.product?.brand || 'N/A',
          category: batch.product?.category || 'General',
          marketplace: item.marketplace,
          seo_score: item.seo_score,
          accuracy_score: item.accuracy_score,
          accuracy_passed: item.accuracy_passed,
          created_at: item.created_at || batch.created_at,
          listing: item.listing,
          accuracy_issues: item.accuracy_issues,
          seo_score_breakdown: item.seo_score_breakdown,
          source: 'local_cache',
        });
      });
    });

    return {
      isApiConfigured: false,
      data: flattened,
      rawBatches: localBatches,
    };
  }

  try {
    const response = await apiClient.get(url);
    const data = response.data;
    let records = [];

    if (Array.isArray(data)) {
      records = data;
    } else if (data && Array.isArray(data.items)) {
      records = data.items;
    } else if (data && Array.isArray(data.listings)) {
      records = data.listings;
    } else if (data && Array.isArray(data.data)) {
      records = data.data;
    }

    const normalized = records.map((rec) => {
      const normalizedListing = normalizeListing(rec);
      return {
        id: rec.id || rec._id || normalizedListing.id,
        product_name: rec.product_name || rec.product?.name || rec.name || 'Untitled Product',
        brand: rec.brand || rec.product?.brand || 'N/A',
        category: rec.category || rec.product?.category || 'General',
        marketplace: normalizedListing.marketplace,
        seo_score: normalizedListing.seo_score,
        accuracy_score: normalizedListing.accuracy_score,
        accuracy_passed: normalizedListing.accuracy_passed,
        created_at: rec.created_at || rec.timestamp || normalizedListing.created_at,
        listing: normalizedListing.listing,
        accuracy_issues: normalizedListing.accuracy_issues,
        seo_score_breakdown: normalizedListing.seo_score_breakdown,
        source: 'firestore_api',
      };
    });

    return {
      isApiConfigured: true,
      data: normalized,
    };
  } catch (error) {
    throw parseApiError(error);
  }
}

/**
 * Fetch a single listing by ID
 */
export async function fetchListingById(id) {
  const detailsUrl = getListingDetailsApiUrl();
  const historyUrl = getHistoryApiUrl();

  const targetUrl = detailsUrl
    ? (detailsUrl.includes(':id') ? detailsUrl.replace(':id', id) : `${detailsUrl}?id=${id}`)
    : (historyUrl ? `${historyUrl}/${id}` : '');

  if (targetUrl) {
    try {
      const response = await apiClient.get(targetUrl);
      const data = response.data?.listing || response.data?.data || response.data;
      return {
        isApiConfigured: true,
        data: normalizeListing(data),
      };
    } catch (error) {
      console.warn('Backend detail fetch failed, falling back to local history:', error);
    }
  }

  // Fallback to local session storage
  const localHistory = getLocalHistory();
  for (const batch of localHistory) {
    for (const item of batch.listings || []) {
      if (item.id === id || `${batch.id}-${item.marketplace}` === id) {
        return {
          isApiConfigured: !!targetUrl,
          data: {
            ...item,
            product: batch.product,
          },
        };
      }
    }
  }

  return {
    isApiConfigured: !!targetUrl,
    data: null,
  };
}

/**
 * Delete a listing by ID
 */
export async function deleteListingById(id) {
  const deleteUrl = getDeleteListingApiUrl();

  // Also remove from local cache
  deleteLocalListing(id);

  if (!deleteUrl) {
    return {
      success: true,
      isApiConfigured: false,
      message: 'Removed from local session history. To persist deletions in Firestore, configure the n8n Delete Webhook.',
    };
  }

  const endpoint = deleteUrl.includes(':id') ? deleteUrl.replace(':id', id) : `${deleteUrl}?id=${id}`;

  try {
    const response = await apiClient.delete(endpoint);
    return {
      success: true,
      isApiConfigured: true,
      message: response.data?.message || 'Listing deleted successfully',
    };
  } catch (error) {
    throw parseApiError(error);
  }
}
