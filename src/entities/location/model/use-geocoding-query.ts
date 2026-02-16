import { useSuspenseQuery } from "@tanstack/react-query";
import { fetchGeocodingByName } from "@/shared/api/weather-api";

export function useGeocodingQuery(locationName: string) {
  return useSuspenseQuery({
    queryKey: ["geocoding", locationName],
    queryFn: () => fetchGeocodingByName(locationName),
  });
}
