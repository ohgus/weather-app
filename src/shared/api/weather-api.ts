import type {
  OpenWeatherCurrentResponse,
  OpenWeatherForecastResponse,
  OpenWeatherGeocodingResponse,
} from "./types";

const BASE_URL = "https://api.openweathermap.org";
const ICON_BASE_URL = "https://openweathermap.org/img/wn";
const API_KEY = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;

export function getWeatherIconUrl(icon: string): string {
  return `${ICON_BASE_URL}/${icon}@2x.png`;
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API 요청 실패: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export function fetchCurrentWeather(
  lat: number,
  lon: number,
): Promise<OpenWeatherCurrentResponse> {
  return fetchJson(
    `${BASE_URL}/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`,
  );
}

export function fetchForecast(
  lat: number,
  lon: number,
): Promise<OpenWeatherForecastResponse> {
  return fetchJson(
    `${BASE_URL}/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`,
  );
}

export function fetchGeocodingByName(
  name: string,
): Promise<OpenWeatherGeocodingResponse[]> {
  return fetchJson(
    `${BASE_URL}/geo/1.0/direct?q=${encodeURIComponent(name)},KR&limit=5&appid=${API_KEY}`,
  );
}

export function fetchReverseGeocoding(
  lat: number,
  lon: number,
): Promise<OpenWeatherGeocodingResponse[]> {
  return fetchJson(
    `${BASE_URL}/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`,
  );
}
