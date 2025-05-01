import { useState, useEffect } from 'react';
import { TopNavigation } from '@/components/search/TopNavigation';
import { FilterBar } from '@/components/search/FilterBar';
import { DogCard } from '@/components/search/DogCard';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { MatchDialog } from "@/components/ui/match-dialog";
import { useDogSearch } from '@/hooks/useDogSearch';
import { useFavorites } from '@/hooks/useFavorites';

const ITEMS_PER_PAGE = 20;

const SearchPage = () => {
  const {
    breeds,
    dogs,
    loading,
    error,
    currentPage,
    total,
    nextCursor,
    prevCursor,
    handleSearch,
    handleNextPage,
    handlePrevPage,
  } = useDogSearch();

  const {
    favorites,
    matchedDog,
    isMatchDialogOpen,
    setIsMatchDialogOpen,
    toggleFavorite,
    handleGenerateMatch,
  } = useFavorites();

  const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
  const [zipCode, setZipCode] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [tempBreeds, setTempBreeds] = useState<string[]>([]);
  const [tempZipCode, setTempZipCode] = useState('');
  const [ageMin, setAgeMin] = useState<number | null>(null);
  const [ageMax, setAgeMax] = useState<number | null>(null);
  const [tempAgeMin, setTempAgeMin] = useState<number | null>(null);
  const [tempAgeMax, setTempAgeMax] = useState<number | null>(null);

  // Reset search when parameters change
  useEffect(() => {
    handleSearch({
      selectedBreeds,
      zipCode,
      sortOrder,
      ageMin,
      ageMax,
    });
  }, [selectedBreeds, zipCode, sortOrder, ageMin, ageMax]);

  const handleFilterConfirm = () => {
    setSelectedBreeds(tempBreeds);
    setZipCode(tempZipCode);
    setAgeMin(tempAgeMin);
    setAgeMax(tempAgeMax);
    setIsFilterOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-50">
        <TopNavigation
          favorites={favorites}
          onGenerateMatch={handleGenerateMatch}
        />

        <FilterBar
          breeds={breeds}
          selectedBreeds={selectedBreeds}
          zipCode={zipCode}
          ageMin={ageMin}
          ageMax={ageMax}
          sortOrder={sortOrder}
          onSortOrderChange={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
          onFilterConfirm={handleFilterConfirm}
          isFilterOpen={isFilterOpen}
          onFilterOpenChange={setIsFilterOpen}
          tempBreeds={tempBreeds}
          onTempBreedsChange={setTempBreeds}
          tempZipCode={tempZipCode}
          onTempZipCodeChange={setTempZipCode}
          tempAgeMin={tempAgeMin}
          onTempAgeMinChange={setTempAgeMin}
          tempAgeMax={tempAgeMax}
          onTempAgeMaxChange={setTempAgeMax}
        />
      </div>

      <main className="container mx-auto px-4 py-4">
        {error && (
          <div className="text-red-500 mb-4 p-4 bg-red-50 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            // Loading skeletons
            Array.from({ length: 8 }).map((_, i) => (
              <Card 
                key={i} 
                className="overflow-hidden group border-gray-200 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="relative aspect-[4/3]">
                  <div className="absolute inset-0 p-3">
                    <Skeleton className="w-full h-full rounded-[1.25rem]" />
                  </div>
                  <div className="absolute top-5 right-5">
                    <Skeleton className="w-8 h-8 rounded-full" />
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                  <div className="mt-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : dogs.length > 0 ? (
            dogs.map((dog) => (
              <DogCard
                key={dog.id}
                dog={dog}
                isFavorite={favorites.some(fav => fav.id === dog.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-500">
              No dogs found. Try adjusting your search criteria.
            </div>
          )}
        </div>

        {/* Pagination */}
        {dogs.length > 0 && (
          <div className="flex items-center justify-between mt-8">
            <div className="text-sm text-gray-500">
              Showing {ITEMS_PER_PAGE * currentPage + 1} to{" "}
              {Math.min(ITEMS_PER_PAGE * (currentPage + 1), total)} of {total} results
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePrevPage({
                  selectedBreeds,
                  zipCode,
                  sortOrder,
                  ageMin,
                  ageMax,
                })}
                disabled={!prevCursor}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleNextPage({
                  selectedBreeds,
                  zipCode,
                  sortOrder,
                  ageMin,
                  ageMax,
                })}
                disabled={!nextCursor}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* Match Dialog */}
        <MatchDialog
          isOpen={isMatchDialogOpen}
          onOpenChange={setIsMatchDialogOpen}
          matchedDog={matchedDog}
        />
      </main>
    </div>
  );
};

export default SearchPage;


