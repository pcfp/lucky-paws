import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown } from "lucide-react";
import { FilterDialog } from "@/components/ui/filter-dialog";

interface FilterBarProps {
  breeds: string[];
  selectedBreeds: string[];
  zipCode: string;
  ageMin: number | null;
  ageMax: number | null;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: () => void;
  onFilterConfirm: () => void;
  isFilterOpen: boolean;
  onFilterOpenChange: (open: boolean) => void;
  tempBreeds: string[];
  onTempBreedsChange: (breeds: string[]) => void;
  tempZipCode: string;
  onTempZipCodeChange: (zipCode: string) => void;
  tempAgeMin: number | null;
  onTempAgeMinChange: (age: number | null) => void;
  tempAgeMax: number | null;
  onTempAgeMaxChange: (age: number | null) => void;
}

export function FilterBar({
  breeds,
  selectedBreeds,
  zipCode,
  ageMin,
  ageMax,
  sortOrder,
  onSortOrderChange,
  onFilterConfirm,
  isFilterOpen,
  onFilterOpenChange,
  tempBreeds,
  onTempBreedsChange,
  tempZipCode,
  onTempZipCodeChange,
  tempAgeMin,
  onTempAgeMinChange,
  tempAgeMax,
  onTempAgeMaxChange,
}: FilterBarProps) {
  return (
    <div className="border-b bg-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide">
            <FilterDialog
              isOpen={isFilterOpen}
              onOpenChange={onFilterOpenChange}
              onFilterConfirm={onFilterConfirm}
              breeds={breeds}
              selectedBreeds={tempBreeds}
              onBreedsChange={onTempBreedsChange}
              zipCode={tempZipCode}
              onZipCodeChange={onTempZipCodeChange}
              ageMin={tempAgeMin}
              onAgeMinChange={onTempAgeMinChange}
              ageMax={tempAgeMax}
              onAgeMaxChange={onTempAgeMaxChange}
            />
            {selectedBreeds.map(breed => (
              <Badge key={breed} variant="secondary" className="rounded-full">
                Breed: {breed}
              </Badge>
            ))}
            {zipCode && (
              <Badge variant="secondary" className="rounded-full">
                Zip Code: {zipCode}
              </Badge>
            )}
            {(ageMin !== null || ageMax !== null) && (
              <Badge variant="secondary" className="rounded-full">
                Age: {ageMin ?? '0'} - {ageMax ?? '∞'}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Sort by breed:</span>
            <Button
              variant="outline"
              size="sm"
              onClick={onSortOrderChange}
            >
              <ArrowUpDown className="h-4 w-4 mr-2" />
              {sortOrder === 'asc' ? 'A to Z' : 'Z to A'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 