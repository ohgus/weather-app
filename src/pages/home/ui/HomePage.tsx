import { useState } from "react";
import { AsyncBoundary } from "@/shared/ui";
import {
  useGeolocationQuery,
  useGeocodingQuery,
  toGeocodingQuery,
} from "@/entities/location";
import {
  WeatherDisplay,
  WeatherDisplaySkeleton,
  HourlyForecast,
  HourlyForecastSkeleton,
} from "@/widgets/weather-display";
import { SearchBar } from "@/widgets/search-bar";
import { FavoriteToggleButton } from "@/features/manage-favorites";
import { FavoritesList } from "@/widgets/favorites-list";

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

function SearchedLocationWeather({ locationName }: { locationName: string }) {
  const { data: results } = useGeocodingQuery(toGeocodingQuery(locationName));

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-2xl bg-white/60 py-10 text-center backdrop-blur-sm">
        <p className="text-gray-500">
          해당 장소의 정보가 제공되지 않습니다.
        </p>
      </div>
    );
  }

  const { lat, lon } = results[0]!;

  return (
    <>
      <div className="flex justify-end">
        <FavoriteToggleButton name={locationName} lat={lat} lon={lon} />
      </div>
      <AsyncBoundary fallback={<WeatherPageSkeleton />}>
        <WeatherDisplay lat={lat} lon={lon} />
        <HourlyForecast lat={lat} lon={lon} />
      </AsyncBoundary>
    </>
  );
}

export function HomePage() {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-4">
      <SearchBar
        selectedLocation={selectedLocation}
        onSelect={setSelectedLocation}
        onClear={() => setSelectedLocation(null)}
      />

      <AsyncBoundary
        key={selectedLocation ?? "geolocation"}
        fallback={<WeatherPageSkeleton />}
      >
        {selectedLocation ? (
          <SearchedLocationWeather locationName={selectedLocation} />
        ) : (
          <GeolocatedWeather />
        )}
      </AsyncBoundary>

      <FavoritesList />
    </div>
  );
}
