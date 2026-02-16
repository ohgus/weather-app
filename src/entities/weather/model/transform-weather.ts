import type {
  OpenWeatherCurrentResponse,
  OpenWeatherForecastResponse,
} from "@/shared/api/types";
import type { HourlyForecast, WeatherData } from "./types";

function kelvinToCelsius(kelvin: number): number {
  return Math.round(kelvin - 273.15);
}

export function transformCurrentWeather(
  response: OpenWeatherCurrentResponse,
): WeatherData {
  const weather = response.weather[0]!;
  return {
    temperature: kelvinToCelsius(response.main.temp),
    feelsLike: kelvinToCelsius(response.main.feels_like),
    tempMin: kelvinToCelsius(response.main.temp_min),
    tempMax: kelvinToCelsius(response.main.temp_max),
    humidity: response.main.humidity,
    pressure: response.main.pressure,
    windSpeed: response.wind.speed,
    weatherMain: weather.main,
    weatherDescription: weather.description,
    weatherIcon: weather.icon,
    cityName: response.name,
    country: response.sys.country,
    dt: response.dt,
    timezone: response.timezone,
  };
}

export function transformHourlyForecast(
  response: OpenWeatherForecastResponse,
): HourlyForecast[] {
  return response.list.map((item) => {
    const weather = item.weather[0]!;
    return {
      dt: item.dt,
      temperature: kelvinToCelsius(item.main.temp),
      weatherMain: weather.main,
      weatherIcon: weather.icon,
      dtTxt: item.dt_txt,
    };
  });
}
