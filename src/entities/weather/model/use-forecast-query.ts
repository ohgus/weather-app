import { useSuspenseQuery } from "@tanstack/react-query";
import { fetchForecast } from "@/shared/api/weather-api";
import { transformHourlyForecast } from "./transform-weather";

export function useForecastQuery(lat: number, lon: number) {
  return useSuspenseQuery({
    queryKey: ["forecast", lat, lon],
    queryFn: () => fetchForecast(lat, lon).then(transformHourlyForecast),
  });
}
