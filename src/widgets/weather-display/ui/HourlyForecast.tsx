import { useForecastQuery } from "@/entities/weather";
import { getWeatherIconUrl } from "@/shared/api/weather-api";

const DISPLAY_COUNT = 16;

interface HourlyForecastProps {
  lat: number;
  lon: number;
}

function formatHour(dt: number): string {
  return `${new Date(dt * 1000).getHours()}시`;
}

export function HourlyForecast({ lat, lon }: HourlyForecastProps) {
  const { data: forecasts } = useForecastQuery(lat, lon);

  const displayForecasts = forecasts.slice(0, DISPLAY_COUNT);

  return (
    <section className="mt-6">
      <h3 className="mb-3 text-sm font-medium text-gray-600">시간대별 날씨</h3>

      <div className="flex gap-3 overflow-x-auto pb-2">
        {displayForecasts.map((forecast) => (
          <div
            key={forecast.dt}
            className="flex shrink-0 flex-col items-center gap-1 rounded-2xl bg-white/60 px-4 py-3 backdrop-blur-sm"
          >
            <span className="text-xs text-gray-500">
              {formatHour(forecast.dt)}
            </span>
            <img
              src={getWeatherIconUrl(forecast.weatherIcon)}
              alt={forecast.weatherMain}
              className="h-10 w-10"
            />
            <span className="text-sm font-semibold text-gray-800">
              {forecast.temperature}°
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
