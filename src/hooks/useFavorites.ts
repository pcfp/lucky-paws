import { useState } from 'react';
import { Dog } from '@/types';
import { getMatch, getDogsByIds } from '@/api/fetchApi';
import { toast } from 'sonner';

/**
 * Hook for managing favorite dogs and match generation
 * Handles favorites list and match API integration
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState<Dog[]>([]);
  const [matchedDog, setMatchedDog] = useState<Dog | null>(null);
  const [isMatchDialogOpen, setIsMatchDialogOpen] = useState(false);

  /**
   * Toggle dog's favorite status in the list
   */
  const toggleFavorite = (dog: Dog) => {
    setFavorites(prev => {
      const isFavorite = prev.some(fav => fav.id === dog.id);
      if (isFavorite) {
        return prev.filter(fav => fav.id !== dog.id);
      } else {
        return [...prev, dog];
      }
    });
  };

  /**
   * Generate a match from favorites using the match API
   * Shows success/error toasts and opens match dialog
   */
  const handleGenerateMatch = async () => {
    if (favorites.length === 0) {
      toast.error("Please favorite some dogs first!");
      return;
    }

    try {
      const favoriteIds = favorites.map(dog => dog.id);
      const matchResponse = await getMatch(favoriteIds);
      const matchId = matchResponse.data.match;
      
      if (matchId) {
        const [matchedDogData] = (await getDogsByIds([matchId])).data;
        setMatchedDog(matchedDogData);
        setIsMatchDialogOpen(true);
        toast.success("Found your perfect match! 🐾");
      }
    } catch (err) {
      console.error('Match generation failed:', err);
      toast.error("Failed to generate match");
    }
  };

  return {
    favorites,
    matchedDog,
    isMatchDialogOpen,
    setIsMatchDialogOpen,
    toggleFavorite,
    handleGenerateMatch,
  };
} 