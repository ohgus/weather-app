import { AsyncBoundary } from "@/shared/ui";
import { useGeolocationQuery } from "@/entities/location";
import {
  WeatherDisplay,
  WeatherDisplaySkeleton,
  HourlyForecast,
  HourlyForecastSkeleton,
} from "@/widgets/weather-display";

function WeatherPageSkeleton() {
  return (
    <>
      <WeatherDisplaySkeleton />
      <HourlyForecastSkeleton />
    </>
  );
}

function GeolocatedWeather() {
  const { data: location } = useGeolocationQuery();

  return (
    <AsyncBoundary fallback={<WeatherPageSkeleton />}>
      <WeatherDisplay lat={location.lat} lon={location.lon} />
      <HourlyForecast lat={location.lat} lon={location.lon} />
    </AsyncBoundary>
  );
}

export function HomePage() {
  return (
    <div>
      <AsyncBoundary fallback={<WeatherPageSkeleton />}>
        <GeolocatedWeather />
      </AsyncBoundary>
    </div>
  );
}
