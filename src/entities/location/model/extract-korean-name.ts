import type { OpenWeatherGeocodingResponse } from "@/shared/api/types";

export function extractKoreanName(
  results: OpenWeatherGeocodingResponse[],
): string {
  if (results.length === 0) return "";
  const first = results[0]!;
  return first.local_names?.ko ?? first.name;
}
