import { useSuspenseQuery } from "@tanstack/react-query";
import { fetchCurrentWeather } from "@/shared/api/weather-api";
import { transformCurrentWeather } from "./transform-weather";

export function useWeatherQuery(lat: number, lon: number) {
  return useSuspenseQuery({
    queryKey: ["weather", lat, lon],
    queryFn: () => fetchCurrentWeather(lat, lon).then(transformCurrentWeather),
  });
}
