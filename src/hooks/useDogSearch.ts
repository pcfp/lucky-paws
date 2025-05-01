import { useState, useEffect } from 'react';
import { getBreeds, searchDogs, getDogsByIds } from '@/api/fetchApi';
import { Dog } from '@/types';

// Number of dogs to display per page
const ITEMS_PER_PAGE = 20;

// Search parameters for the dog search API
interface SearchParams {
  selectedBreeds: string[];  
  zipCode: string;       
  sortOrder: 'asc' | 'desc'; 
  ageMin: number | null;   
  ageMax: number | null;    
}

/**
 * Hook for dog search functionality with pagination
 * Manages search state, results, and cursor-based pagination
 */
export const useDogSearch = () => {
  const [breeds, setBreeds] = useState<string[]>([]);
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [prevCursor, setPrevCursor] = useState<string | null>(null);

  // Load available breeds on mount
  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const response = await getBreeds();
        setBreeds(response.data);
      } catch (err) {
        console.error('Failed to fetch breeds:', err);
        setError('Failed to load dog breeds');
      }
    };
    fetchBreeds();
  }, []);

  /**
   * Search dogs with filters and pagination
   */
  const handleSearch = async (params: SearchParams, fromCursor?: string) => {
    // Reset pagination state for new searches
    if (!fromCursor) {
      setCurrentPage(0);
      setNextCursor(null);
      setPrevCursor(null);
    }

    setLoading(true);
    setError(null);

    try {
      // Parse cursor parameters if provided
      let cursorParams = {};
      if (fromCursor) {
        try {
          const params = new URLSearchParams(fromCursor);
          cursorParams = Object.fromEntries(params.entries());
        } catch (e) {
          console.error('Failed to parse cursor:', e);
        }
      }

      // Prepare search parameters
      const searchParams: any = {
        size: ITEMS_PER_PAGE,
        sort: `breed:${params.sortOrder}`,
        ...cursorParams,
      };
      
      // Add optional filters
      if (params.selectedBreeds.length > 0) searchParams.breeds = params.selectedBreeds;
      if (params.zipCode) searchParams.zipCodes = [params.zipCode];
      if (params.ageMin !== null) searchParams.ageMin = params.ageMin;
      if (params.ageMax !== null) searchParams.ageMax = params.ageMax;

      // Fetch search results
      const searchResponse = await searchDogs(searchParams);
      const { resultIds, total: totalResults, next, prev } = searchResponse.data;
      
      // Update pagination state
      setTotal(totalResults);
      setNextCursor(next || null);
      setPrevCursor(prev || null);
      
      // Fetch detailed dog information
      if (resultIds.length > 0) {
        const dogsResponse = await getDogsByIds(resultIds);
        setDogs(dogsResponse.data);
      } else {
        setDogs([]);
      }
    } catch (err) {
      console.error('Search failed:', err);
      setError('Failed to search for dogs');
      // Reset pagination on error for new searches
      if (!fromCursor) {
        setCurrentPage(0);
        setNextCursor(null);
        setPrevCursor(null);
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle navigation to next page
   */
  const handleNextPage = (params: SearchParams) => {
    if (nextCursor) {
      setCurrentPage(prev => prev + 1);
      handleSearch(params, nextCursor);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  /**
   * Handle navigation to previous page
   */
  const handlePrevPage = (params: SearchParams) => {
    if (prevCursor) {
      setCurrentPage(prev => prev - 1);
      handleSearch(params, prevCursor);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return {
    breeds,
    dogs,
    loading,
    error,
    currentPage,
    setCurrentPage,
    total,
    nextCursor,
    prevCursor,
    handleSearch,
    handleNextPage,
    handlePrevPage,
  };
}; 