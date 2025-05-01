import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBreeds, searchDogs, getDogsByIds, logout, getMatch } from '@/api/fetchApi';
import { Dog } from '@/types';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
import { Heart, Search as SearchIcon, Filter, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MultiSelect } from "@/components/ui/multi-select";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
import { toast } from "sonner"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

const ITEMS_PER_PAGE = 20;

const SearchPage = () => {
  const navigate = useNavigate();
  const [breeds, setBreeds] = useState<string[]>([]);
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [zipCode, setZipCode] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [prevCursor, setPrevCursor] = useState<string | null>(null);
  const [matchedDog, setMatchedDog] = useState<Dog | null>(null);

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

  // Reset search when parameters change
  useEffect(() => {
    setCurrentPage(0);
    handleSearch();
  }, [selectedBreeds, zipCode, sortOrder]);

  const handleSearch = async (fromCursor?: string) => {
    // Only reset pagination state if it's a new search (no cursor)
    if (!fromCursor) {
      setCurrentPage(0);
      setNextCursor(null);
      setPrevCursor(null);
    }

    setLoading(true);
    setError(null);

    try {
      // Extract cursor parameters from the fromCursor string if provided
      let cursorParams = {};
      if (fromCursor) {
        try {
          // The cursor might be a URL-encoded query string
          const params = new URLSearchParams(fromCursor);
          cursorParams = Object.fromEntries(params.entries());
        } catch (e) {
          console.error('Failed to parse cursor:', e);
        }
      }

      const searchParams: any = {
        size: ITEMS_PER_PAGE,
        sort: `breed:${sortOrder}`,
        ...cursorParams, // Include any cursor parameters
      };
      
      if (selectedBreeds.length > 0) searchParams.breeds = selectedBreeds;
      if (zipCode) searchParams.zipCodes = [zipCode];

      const searchResponse = await searchDogs(searchParams);
      const { resultIds, total: totalResults, next, prev } = searchResponse.data;
      
      setTotal(totalResults);
      setNextCursor(next || null);
      setPrevCursor(prev || null);
      
      if (resultIds.length > 0) {
        const dogsResponse = await getDogsByIds(resultIds);
        setDogs(dogsResponse.data);
      } else {
        setDogs([]);
      }
    } catch (err) {
      console.error('Search failed:', err);
      setError('Failed to search for dogs');
      // Only reset pagination on error if it's not a pagination request
      if (!fromCursor) {
        setCurrentPage(0);
        setNextCursor(null);
        setPrevCursor(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (dogId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(dogId)) {
        newFavorites.delete(dogId);
      } else {
        newFavorites.add(dogId);
      }
      return newFavorites;
    });
  };

  const handleGenerateMatch = async () => {
    if (favorites.size === 0) {
      toast.error("Please favorite some dogs first!");
      return;
    }

    try {
      setLoading(true);
      const favoriteIds = Array.from(favorites);
      const matchResponse = await getMatch(favoriteIds);
      const matchId = matchResponse.data.match;
      
      if (matchId) {
        const [matchedDogData] = (await getDogsByIds([matchId])).data;
        setMatchedDog(matchedDogData);
        toast.success("Found your perfect match! 🐾");
      }
    } catch (err) {
      console.error('Match generation failed:', err);
      toast.error("Failed to generate match");
    } finally {
      setLoading(false);
    }
  };

  const handleNextPage = () => {
    if (nextCursor) {
      setCurrentPage(prev => prev + 1);
      handleSearch(nextCursor);
    }
  };

  const handlePrevPage = () => {
    if (prevCursor) {
      setCurrentPage(prev => prev - 1);
      handleSearch(prevCursor);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-50 bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-primary">Lucky Dogs</h1>
            </div>
            
            {/* Search Bar */}
            <Card className="flex-1 mx-4 shadow-sm">
              <CardContent className="p-2">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <MultiSelect
                      selected={selectedBreeds}
                      setSelected={setSelectedBreeds}
                      options={breeds}
                      placeholder="Select breeds..."
                    />
                  </div>
                  <div className="h-8 w-px bg-gray-200" />
                  <Input
                    type="text"
                    placeholder="Enter zip code"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    className="border-0 w-[150px]"
                  />
                  <Button 
                    onClick={() => handleSearch()}
                    className="rounded-full"
                    size="icon"
                    disabled={loading}
                  >
                    <SearchIcon className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="flex-1 flex justify-end gap-2">
              <HoverCard openDelay={200}>
                <HoverCardTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={handleGenerateMatch}
                    disabled={favorites.size === 0}
                  >
                    Generate Match {favorites.size > 0 && (
                      <Heart className="h-4 w-4 text-red-500 fill-current" />
                    )}
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent 
                  className="w-80 p-0" 
                  align="end"
                >
                  <div className="p-4 pb-2">
                    <h4 className="font-medium leading-none mb-2">
                      Favorited Dogs ({favorites.size})
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Click to generate a match from your favorites
                    </p>
                  </div>
                  <div className="max-h-[300px] overflow-auto">
                    {dogs
                      .filter(dog => favorites.has(dog.id))
                      .map(dog => (
                        <div
                          key={dog.id}
                          className="flex items-center gap-3 p-4 hover:bg-muted border-t"
                        >
                          <img
                            src={dog.img}
                            alt={dog.name}
                            className="h-12 w-12 rounded-full object-cover"
                          />
                          <div>
                            <h5 className="font-medium text-sm">{dog.name}</h5>
                            <p className="text-xs text-muted-foreground">
                              {dog.breed}
                            </p>
                          </div>
                        </div>
                    ))}
                  </div>
                </HoverCardContent>
              </HoverCard>
              <Button
                variant="outline"
                onClick={async () => {
                  try {
                    await logout();
                    navigate('/');
                  } catch (err) {
                    console.error('Logout failed:', err);
                  }
                }}
              >
                Log out
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" className="rounded-full">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              {selectedBreeds.map(breed => (
                <Badge key={breed} variant="secondary" className="rounded-full">
                  {breed}
                </Badge>
              ))}
              {zipCode && (
                <Badge variant="secondary" className="rounded-full">
                  ZIP: {zipCode}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Sort by breed:</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
                  handleSearch();
                }}
              >
                <ArrowUpDown className="h-4 w-4 mr-2" />
                {sortOrder === 'asc' ? 'A to Z' : 'Z to A'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-2">
        {error && (
          <div className="text-red-500 mb-4 p-4 bg-red-50 rounded-lg">
            {error}
          </div>
        )}

        {matchedDog && (
          <Card className="mb-8 bg-gradient-to-r from-purple-100 to-pink-100">
            <CardHeader>
              <CardTitle>Your Perfect Match! 🎉</CardTitle>
              <CardDescription>
                Based on your favorites, we think you'll love {matchedDog.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-6">
              <img
                src={matchedDog.img}
                alt={matchedDog.name}
                className="w-48 h-48 object-cover rounded-lg"
              />
              <div>
                <h3 className="text-xl font-semibold mb-2">{matchedDog.name}</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>Breed: {matchedDog.breed}</p>
                  <p>Age: {matchedDog.age} years</p>
                  <p>Location: {matchedDog.zip_code}</p>
                </div>
              </div>
            </CardContent>
          </Card>
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
                      <Skeleton className="h-6 w-32" /> {/* Name */}
                      <Skeleton className="h-4 w-24" /> {/* Breed */}
                    </div>
                  </div>
                  <div className="mt-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-16" /> {/* Age label */}
                      <Skeleton className="h-4 w-20" /> {/* Age value */}
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-24" /> {/* Zip Code label */}
                      <Skeleton className="h-4 w-20" /> {/* Zip Code value */}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : dogs.length > 0 ? (
            // Dog cards
            dogs.map((dog) => (
              <Card 
                key={dog.id} 
                className="overflow-hidden group border-gray-200 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="relative aspect-[4/3]">
                  <img
                    src={dog.img}
                    alt={dog.name}
                    className="absolute inset-0 w-full h-full object-cover rounded-[1.25rem] p-3"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`absolute top-5 right-5 rounded-full bg-white shadow-sm hover:scale-110 transition-transform duration-200 ${
                      favorites.has(dog.id) ? 'text-red-500' : 'text-gray-600'
                    }`}
                    onClick={() => toggleFavorite(dog.id)}
                  >
                    <Heart className={`h-5 w-5 ${favorites.has(dog.id) ? 'fill-current' : ''}`} />
                  </Button>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 text-left">{dog.name}</h3>
                      <p className="text-sm text-gray-500 text-left">{dog.breed}</p>
                    </div>
                  </div>
                  <div className="mt-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Age:</span>
                      <span>{dog.age} years</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Zip Code:</span>
                      <span>{dog.zip_code}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
                onClick={handlePrevPage}
                disabled={!prevCursor}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={!nextCursor}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SearchPage;


