import { useWeatherQuery } from "@/entities/weather";
import { getWeatherIconUrl } from "@/shared/api/weather-api";

interface WeatherDisplayProps {
  lat: number;
  lon: number;
  displayName?: string;
}

export function WeatherDisplay({ lat, lon, displayName }: WeatherDisplayProps) {
  const { data: weather } = useWeatherQuery(lat, lon);

  return (
    <section className="text-center">
      <h2 className="text-lg font-medium text-gray-600">
        {displayName || weather.cityName}
      </h2>

      <img
        src={getWeatherIconUrl(weather.weatherIcon)}
        alt={weather.weatherDescription}
        className="mx-auto h-24 w-24"
      />

      <p className="text-7xl font-bold text-gray-900">{weather.temperature}°</p>

      <p className="mt-1 text-base capitalize text-gray-500">
        {weather.weatherDescription}
      </p>

      <div className="mt-2 flex justify-center gap-4 text-sm text-gray-600">
        <span>최고 {weather.tempMax}°</span>
        <span>최저 {weather.tempMin}°</span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 rounded-2xl bg-white/60 p-4 text-sm backdrop-blur-sm">
        <div>
          <p className="text-gray-500">체감</p>
          <p className="font-semibold text-gray-800">{weather.feelsLike}°</p>
        </div>
        <div>
          <p className="text-gray-500">습도</p>
          <p className="font-semibold text-gray-800">{weather.humidity}%</p>
        </div>
        <div>
          <p className="text-gray-500">바람</p>
          <p className="font-semibold text-gray-800">{weather.windSpeed}m/s</p>
        </div>
      </div>
    </section>
  );
}
