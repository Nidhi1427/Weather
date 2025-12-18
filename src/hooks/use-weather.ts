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
    queryFn: async () => {
      if (query.length < 3) return [];
      
      const key = import.meta.env.VITE_API_KEY;
      if (!key) throw new Error('Missing VITE_API_KEY in .env');
      
      const response = await fetch(
        `/api/geo/1.0/direct?q=${query.trim()}&limit=5&appid=${key}`
      );
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      return response.json();
    },
    enabled: query.length >= 3,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
