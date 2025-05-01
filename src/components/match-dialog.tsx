import { Dog } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

interface MatchDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  matchedDog: Dog | null;
}

export function MatchDialog({
  isOpen,
  onOpenChange,
  matchedDog,
}: MatchDialogProps) {
  if (!matchedDog) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Your Perfect Match! 🎉</DialogTitle>
          <DialogDescription>
            Based on your favorites, we think you'll love {matchedDog.name}
          </DialogDescription>
        </DialogHeader>
        
          <Card className="bg-gradient-to-r from-yellow-100 to-yellow-300">
            <CardContent className="flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 sm:p-6">
              <div className="flex justify-center sm:block">
                <img
                  src={matchedDog.img}
                  alt={matchedDog.name}
                  className="w-40 h-40 sm:w-48 sm:h-48 object-cover rounded-lg shadow-lg"
                />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">{matchedDog.name}</h3>
                <div className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-600">
                  <p className="flex items-center gap-2 justify-center sm:justify-start">
                    <span className="font-medium">Breed:</span>
                    <span>{matchedDog.breed}</span>
                  </p>
                  <p className="flex items-center gap-2 justify-center sm:justify-start">
                    <span className="font-medium">Age:</span>
                    <span>{matchedDog.age} years</span>
                  </p>
                  <p className="flex items-center gap-2 justify-center sm:justify-start">
                    <span className="font-medium">Location:</span>
                    <span>{matchedDog.zip_code}</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
      </DialogContent>
    </Dialog>
  );
} 