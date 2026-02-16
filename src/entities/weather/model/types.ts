export interface WeatherData {
  temperature: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  weatherMain: string;
  weatherDescription: string;
  weatherIcon: string;
  cityName: string;
  country: string;
  dt: number;
  timezone: number;
}

export interface HourlyForecast {
  dt: number;
  temperature: number;
  weatherMain: string;
  weatherIcon: string;
  dtTxt: string;
}
