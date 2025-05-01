import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select";
import { Filter } from "lucide-react";

interface FilterDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onFilterConfirm: () => void;
  breeds: string[];
  selectedBreeds: string[];
  onBreedsChange: (breeds: string[]) => void;
  zipCode: string;
  onZipCodeChange: (zipCode: string) => void;
}

export function FilterDialog({
  isOpen,
  onOpenChange,
  onFilterConfirm,
  breeds,
  selectedBreeds,
  onBreedsChange,
  zipCode,
  onZipCodeChange,
}: FilterDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button 
          size="sm" 
          className="rounded-full"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Filters</DialogTitle>
          </div>
          <DialogDescription>
            Customize your search preferences
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Dog Breeds</label>
            <MultiSelect
              selected={selectedBreeds}
              setSelected={onBreedsChange}
              options={breeds}
              placeholder="Select breeds..."
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">ZIP Code</label>
            <Input
              placeholder="Enter ZIP code"
              value={zipCode}
              onChange={(e) => onZipCodeChange(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="submit" onClick={onFilterConfirm}>
            Apply Filters
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 