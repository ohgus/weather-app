import { useSuspenseQuery } from "@tanstack/react-query";
import { fetchReverseGeocoding } from "@/shared/api/weather-api";
import { extractKoreanName } from "./extract-korean-name";

export function useReverseGeocodingQuery(lat: number, lon: number) {
  return useSuspenseQuery({
    queryKey: ["reverseGeocoding", lat, lon],
    queryFn: () => fetchReverseGeocoding(lat, lon),
    select: extractKoreanName,
  });
}
