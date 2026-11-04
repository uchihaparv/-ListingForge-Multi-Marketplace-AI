import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { generateProductListings } from '../services/listingService';

export function useListings() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastGenerated, setLastGenerated] = useState(null);

  const generate = useCallback(async (formData) => {
    // Prevent duplicate submissions
    if (isLoading) return null;

    setIsLoading(true);
    setError(null);

    const toastId = toast.loading('Generating AI listings for selected marketplaces...');

    try {
      const result = await generateProductListings(formData);
      setLastGenerated(result);
      toast.success(
        `Generated ${result.listings.length} marketplace listing${
          result.listings.length === 1 ? '' : 's'
        }!`,
        { id: toastId }
      );
      return result;
    } catch (err) {
      console.error('Generation failed:', err);
      const message = err.message || 'Failed to generate listings. Please check your backend connection.';
      setError(err);
      toast.error(message, { id: toastId, duration: 6000 });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  const clearCurrent = useCallback(() => {
    setLastGenerated(null);
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    lastGenerated,
    generate,
    clearCurrent,
  };
}
