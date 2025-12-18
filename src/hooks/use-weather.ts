import type { Coordinates } from "@/api/types";
import { weatherAPI } from "@/api/weather";
import { useQuery } from "@tanstack/react-query";

export const WEATHER_KEYS = {
  weather: (coords: Coordinates | null) =>
    ["weather", coords ?? { lat: 0, lon: 0 }] as const,
  forecast: (coords: Coordinates | null) =>
    ["forecast", coords ?? { lat: 0, lon: 0 }] as const,
  location: (coords: Coordinates | null) =>
    ["location", coords ?? { lat: 0, lon: 0 }] as const,
  search: (query: string) => ["location_search", query] as const,
} as const;

export function useWeatherQuery(coordinates: Coordinates | null) {
  return useQuery({
    queryKey: WEATHER_KEYS.weather(coordinates),
    queryFn: () =>
      coordinates ? weatherAPI.getCurrentWeather(coordinates) : null,
    enabled: !!coordinates,
  });
}

export function useForecastQuery(coordinates: Coordinates | null) {
  return useQuery({
    queryKey: WEATHER_KEYS.forecast(coordinates),
    queryFn: () =>
      coordinates ? weatherAPI.getForecast(coordinates) : null,
    enabled: !!coordinates,
  });
}

export function useReverseGeocodeQuery(coordinates: Coordinates | null) {
  return useQuery({
    queryKey: WEATHER_KEYS.location(coordinates),
    queryFn: () =>
      coordinates ? weatherAPI.reverseGeocode(coordinates) : null,
    enabled: !!coordinates,
  });
}

export function useLocationSearch(query: string) {
  return useQuery({
    queryKey: WEATHER_KEYS.search(query),
    queryFn: () => weatherAPI.searchLocations(query),
    enabled: query.length >= 3,
  });
}
