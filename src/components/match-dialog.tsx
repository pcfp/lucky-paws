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
        <div className="mt-4">
          <Card className="bg-gradient-to-r from-yellow-100 to-yellow-300">
            <CardContent className="flex gap-6 p-6">
              <img
                src={matchedDog.img}
                alt={matchedDog.name}
                className="w-48 h-48 object-cover rounded-lg shadow-lg"
              />
              <div className="flex-1">
                <h3 className="text-2xl font-semibold mb-2">{matchedDog.name}</h3>
                <div className="space-y-1 text-base text-gray-600">
                  <p className="flex items-center gap-2">
                    <span className="font-medium">Breed:</span>
                    <span>{matchedDog.breed}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-medium">Age:</span>
                    <span>{matchedDog.age} years</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-medium">Location:</span>
                    <span>{matchedDog.zip_code}</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
} 