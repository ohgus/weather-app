import { describe, expect, it } from "vitest";
import type {
  OpenWeatherCurrentResponse,
  OpenWeatherForecastResponse,
} from "@/shared/api/types";
import {
  transformCurrentWeather,
  transformHourlyForecast,
} from "../model/transform-weather";

const mockCurrentWeatherResponse: OpenWeatherCurrentResponse = {
  coord: { lon: 126.9778, lat: 37.5683 },
  weather: [
    { id: 800, main: "Clear", description: "clear sky", icon: "01d" },
  ],
  main: {
    temp: 295.15,
    feels_like: 294.15,
    temp_min: 293.15,
    temp_max: 297.15,
    pressure: 1013,
    humidity: 60,
  },
  wind: { speed: 3.5, deg: 180 },
  clouds: { all: 0 },
  dt: 1700000000,
  sys: { country: "KR", sunrise: 1699980000, sunset: 1700020000 },
  timezone: 32400,
  name: "Seoul",
};

const mockForecastResponse: OpenWeatherForecastResponse = {
  list: [
    {
      dt: 1700000000,
      main: {
        temp: 295.15,
        feels_like: 294.15,
        temp_min: 293.15,
        temp_max: 297.15,
        pressure: 1013,
        humidity: 60,
      },
      weather: [
        { id: 800, main: "Clear", description: "clear sky", icon: "01d" },
      ],
      dt_txt: "2023-11-14 12:00:00",
    },
    {
      dt: 1700010800,
      main: {
        temp: 293.15,
        feels_like: 292.15,
        temp_min: 291.15,
        temp_max: 294.15,
        pressure: 1012,
        humidity: 65,
      },
      weather: [
        {
          id: 801,
          main: "Clouds",
          description: "few clouds",
          icon: "02d",
        },
      ],
      dt_txt: "2023-11-14 15:00:00",
    },
  ],
  city: {
    name: "Seoul",
    coord: { lat: 37.5683, lon: 126.9778 },
    country: "KR",
    timezone: 32400,
  },
};

describe("transformCurrentWeather", () => {
  it("OpenWeatherMap current weather 응답을 WeatherData로 변환한다", () => {
    const result = transformCurrentWeather(mockCurrentWeatherResponse);

    expect(result).toEqual({
      temperature: 22,
      feelsLike: 21,
      tempMin: 20,
      tempMax: 24,
      humidity: 60,
      pressure: 1013,
      windSpeed: 3.5,
      weatherMain: "Clear",
      weatherDescription: "clear sky",
      weatherIcon: "01d",
      cityName: "Seoul",
      country: "KR",
      dt: 1700000000,
      timezone: 32400,
    });
  });

  it("Kelvin을 Celsius로 올바르게 변환한다", () => {
    const result = transformCurrentWeather(mockCurrentWeatherResponse);

    // 295.15K = 22°C
    expect(result.temperature).toBe(22);
    // 293.15K = 20°C
    expect(result.tempMin).toBe(20);
    // 297.15K = 24°C
    expect(result.tempMax).toBe(24);
  });

  it("0K (절대영도) 근처 값도 올바르게 변환한다", () => {
    const coldResponse: OpenWeatherCurrentResponse = {
      ...mockCurrentWeatherResponse,
      main: {
        ...mockCurrentWeatherResponse.main,
        temp: 273.15,
        temp_min: 263.15,
        temp_max: 283.15,
      },
    };

    const result = transformCurrentWeather(coldResponse);

    expect(result.temperature).toBe(0);
    expect(result.tempMin).toBe(-10);
    expect(result.tempMax).toBe(10);
  });
});

describe("transformHourlyForecast", () => {
  it("forecast 응답을 HourlyForecast 배열로 변환한다", () => {
    const result = transformHourlyForecast(mockForecastResponse);

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      dt: 1700000000,
      temperature: 22,
      weatherMain: "Clear",
      weatherIcon: "01d",
      dtTxt: "2023-11-14 12:00:00",
    });
    expect(result[1]).toEqual({
      dt: 1700010800,
      temperature: 20,
      weatherMain: "Clouds",
      weatherIcon: "02d",
      dtTxt: "2023-11-14 15:00:00",
    });
  });

  it("빈 forecast 리스트는 빈 배열을 반환한다", () => {
    const emptyResponse: OpenWeatherForecastResponse = {
      ...mockForecastResponse,
      list: [],
    };

    const result = transformHourlyForecast(emptyResponse);

    expect(result).toEqual([]);
  });
});
