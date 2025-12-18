import type { GeocodingResponse, WeatherData } from "@/api/types";
import { ArrowDown, ArrowUp, Droplets, Wind } from "lucide-react";

interface CurrentWeatherProps {
  data: WeatherData;
  locationName?: GeocodingResponse; 
}

const CurrentWeather = ({ data, locationName }: CurrentWeatherProps) => {
  const {
    weather: [currentWeather],
    main: { temp, feels_like, temp_min, temp_max, humidity },
    wind: { speed },
  } = data;

  // ✅ FIX: Convert Kelvin to Celsius
  const formatTemp = (kelvin: number) => {
    const celsius = Math.round(kelvin - 273.15);
    return `${celsius}°`;
  };

  return (
    <div className="overflow-hidden rounded-xl border border-white/20 bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-2xl max-w-md backdrop-blur-xl">
      <div style={{ padding: '32px' }}>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-end gap-1">
                <h2 className="text-3xl font-bold tracking-tight drop-shadow-lg">
                  {locationName?.name}
                </h2>
                {locationName?.state && (
                  <span className="text-blue-200 drop-shadow-md">, {locationName.state}</span>
                )}
              </div>
              <p className="text-base text-blue-100 drop-shadow-md">
                {locationName?.country}
              </p>
            </div>

            {/* ✅ FIXED TEMPERATURES */}
            <div className="flex items-center gap-3">
              <p className="text-7xl font-black tracking-tighter drop-shadow-2xl text-white">
                {formatTemp(temp)}
              </p>
              <div className="space-y-2">
                <p className="text-base font-semibold text-blue-200 drop-shadow-lg">
                  Feels like {formatTemp(feels_like)}
                </p>
                <div className="flex gap-3 text-sm font-semibold">
                  <span className="flex items-center gap-1 text-blue-300 drop-shadow-md">
                    <ArrowDown className="h-4 w-4" />
                    {formatTemp(temp_min)}
                  </span>
                  <span className="flex items-center gap-1 text-orange-300 drop-shadow-md">
                    <ArrowUp className="h-4 w-4" />
                    {formatTemp(temp_max)}
                  </span>
                </div>
              </div>
            </div>

            {/* ✅ DARKER BLUE ICONS */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/10">
                <Droplets className="h-5 w-5 text-blue-300 drop-shadow-md" />
                <div>
                  <p className="text-sm font-semibold text-white">Humidity</p>
                  <p className="text-lg font-bold text-blue-200 drop-shadow-md">{humidity}%</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/10">
                <Wind className="h-5 w-5 text-blue-300 drop-shadow-md" />
                <div>
                  <p className="text-sm font-semibold text-white">Wind</p>
                  <p className="text-lg font-bold text-blue-200 drop-shadow-md">{speed.toFixed(1)} m/s</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="relative flex aspect-square w-full max-w-[200px] items-center justify-center">
              <img
                src={`https://openweathermap.org/img/wn/${currentWeather.icon}@4x.png`}
                alt={currentWeather.description}
                className="h-full w-full object-contain drop-shadow-2xl filter brightness-110"
              />
              <div className="absolute bottom-2 w-full text-center">
                <p className="text-base font-semibold bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full text-white">
                  {currentWeather.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;
