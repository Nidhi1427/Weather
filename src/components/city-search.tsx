import { useState } from "react";
import { Button } from "./ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./ui/command";
import { Clock, Loader2, Search, Star, XCircle } from "lucide-react";
import { useLocationSearch } from "@/hooks/use-weather";
import { useNavigate } from "react-router-dom";
import { useSearchHistory } from "@/hooks/use-search-history";
import { format } from "date-fns";
import { useFavorites } from "../hooks/use-favorites";

interface FavoriteCity {
  id: string;
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}

const CitySearch = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { data: locations, isLoading } = useLocationSearch(query);
  const { history, clearHistory, addToHistory } = useSearchHistory();
  const { favorites } = useFavorites();

  const handleSelect = (cityData: string) => {
    const [lat, lon, name, country] = cityData.split("|");
    addToHistory.mutate({
      query,
      name,
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      country,
    });
    setOpen(false);
    navigate(`/city/${name}?lat=${lat}&lon=${lon}`);
  };

  return (
    <>
      <Button
        variant="outline"
        className="relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-48"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        Search cities...
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Type city name (e.g. Bengaluru)..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {query.length > 2 && locations?.length === 0 && !isLoading && (
            <CommandEmpty>No cities found for "{query}". Try "Bengaluru", "London", "New York".</CommandEmpty>
          )}
          
          {favorites.length > 0 && (
            <CommandGroup heading="⭐ Favorites">
              {favorites.map((location: FavoriteCity) => ( 
                <CommandItem
                  key={location.id}
                  value={`${location.lat}|${location.lon}|${location.name}|${location.country}`}
                  onSelect={() => handleSelect(`${location.lat}|${location.lon}|${location.name}|${location.country}`)}
                >
                  <Star className="mr-2 h-4 w-4 text-yellow-500" />
                  <span>{location.name}</span>
                  {location.state && <span className="text-sm text-muted-foreground">, {location.state}</span>}
                  <span className="text-sm text-muted-foreground ml-1">{location.country}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {history.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup heading="⏰ Recent">
                <div className="flex items-center justify-between px-2 my-2">
                  <p className="text-xs text-muted-foreground">Recent searches</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => clearHistory.mutate()}
                  >
                    <XCircle className="h-4 w-4" /> Clear
                  </Button>
                </div>
                {history.map((location) => (
                  <CommandItem
                    key={`${location.lat}${location.lon}`}
                    value={`${location.lat}|${location.lon}|${location.name}|${location.country}`}
                    onSelect={() => handleSelect(`${location.lat}|${location.lon}|${location.name}|${location.country}`)}
                  >
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{location.name}</span>
                    {location.state && <span className="text-sm text-muted-foreground">, {location.state}</span>}
                    <span className="text-sm text-muted-foreground ml-1">{location.country}</span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {format(location.searchedAt, "MMM d, h:mm a")}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}

          <CommandSeparator />

          {query.length > 2 && (
            <CommandGroup heading="🌍 Suggestions">
              {isLoading && (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span className="text-sm text-muted-foreground">Searching...</span>
                </div>
              )}
              {locations && locations.length > 0 && locations.map((location) => (
                <CommandItem
                  key={`${location.lat}${location.lon}`}
                  value={`${location.lat}|${location.lon}|${location.name}|${location.country}`}
                  onSelect={() => handleSelect(`${location.lat}|${location.lon}|${location.name}|${location.country}`)}
                >
                  <Search className="mr-2 h-4 w-4" />
                  <span>
                    {location.name}
                    {location.state && <span className="text-sm text-muted-foreground">, {location.state}</span>}
                  </span>
                  <span className="text-sm text-muted-foreground ml-1">{location.country}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default CitySearch;
