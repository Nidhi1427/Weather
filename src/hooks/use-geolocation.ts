import { useEffect, useState } from "react";

interface Coordinates {
  lat: number;
  lon: number;
}

interface LocationState {
  coordinates: Coordinates | null;
  error: string | null;
  isLoading: boolean;
}

export function useGeolocation() {
  const [locationData, setLocationData] = useState<LocationState>({
    coordinates: null,
    error: null,
    isLoading: false,
  });

  const getLocation = () => {
    if (!navigator.geolocation) {
      setLocationData({
        coordinates: null,
        error: "Geolocation is not supported by this browser.",
        isLoading: false,
      });
      return;
    }

    setLocationData((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
    }));

    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => {
        setLocationData({
          coordinates: {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          },
          error: null,
          isLoading: false,
        });
      },
      (error: GeolocationPositionError) => {
        let errorMessage: string;

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              "Location permission denied. Please enable location access.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out.";
            break;
          default:
            errorMessage = "An unknown error occurred.";
        }

        setLocationData({
          coordinates: null,
          error: errorMessage,
          isLoading: false,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  };

  useEffect(() => {
    getLocation();
    // Optional: add [] so it only runs once on mount
  }, []);

  return {
    coordinates: locationData.coordinates,
    error: locationData.error,
    isLoading: locationData.isLoading,
    getLocation,
  };
}
