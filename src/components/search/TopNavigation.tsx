import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Dog } from "@/types";
import { logout } from "@/api/fetchApi";

interface TopNavigationProps {
  favorites: Dog[];
  onGenerateMatch: () => void;
}

export function TopNavigation({ favorites, onGenerateMatch }: TopNavigationProps) {
  const navigate = useNavigate();

  return (
    <div className="top-0 bg-white border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-primary">
            Lucky Paws
          </div>
          
          <div className="flex-1 flex justify-end gap-2">
            <HoverCard openDelay={200}>
              <HoverCardTrigger asChild>
                <Button
                  variant="outline"
                  onClick={onGenerateMatch}
                  disabled={favorites.length === 0}
                >
                  Generate Match {favorites.length > 0 && (
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
                    Favorited Dogs ({favorites.length})
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Click to generate a match from your favorites
                  </p>
                </div>
                <div className="max-h-[300px] overflow-auto">
                  {favorites.map(dog => (
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
                  navigate('/lucky-paws/');
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
  );
} 