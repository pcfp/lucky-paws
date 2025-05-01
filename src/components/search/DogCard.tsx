import { Dog } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";

interface DogCardProps {
  dog: Dog;
  isFavorite: boolean;
  onToggleFavorite: (dog: Dog) => void;
}

export function DogCard({ dog, isFavorite, onToggleFavorite }: DogCardProps) {
  return (
    <Card className="overflow-hidden group border-gray-200 hover:shadow-lg transition-shadow duration-200">
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
            isFavorite ? 'text-red-500' : 'text-gray-600'
          }`}
          onClick={() => onToggleFavorite(dog)}
        >
          <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
        </Button>
      </div>
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-start justify-between">
          <div className="w-full">
            <h3 className="text-base sm:text-lg font-medium text-gray-900 text-left truncate">{dog.name}</h3>
            <p className="text-xs sm:text-sm text-gray-500 text-left truncate">{dog.breed}</p>
          </div>
        </div>
        <div className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-600 space-y-1 sm:space-y-2">
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
  );
} 