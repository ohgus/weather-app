import type { Page } from "@playwright/test";

const API_BASE = "https://api.openweathermap.org";

function createCurrentWeatherResponse(overrides?: {
  name?: string;
  temp?: number;
  feelsLike?: number;
  tempMin?: number;
  tempMax?: number;
  humidity?: number;
  windSpeed?: number;
  description?: string;
  icon?: string;
}) {
  const {
    name = "Seoul",
    temp = 293.15,
    feelsLike = 291.15,
    tempMin = 290.15,
    tempMax = 296.15,
    humidity = 65,
    windSpeed = 3.5,
    description = "clear sky",
    icon = "01d",
  } = overrides ?? {};

  return {
    coord: { lon: 126.978, lat: 37.5665 },
    weather: [{ id: 800, main: "Clear", description, icon }],
    main: {
      temp,
      feels_like: feelsLike,
      temp_min: tempMin,
      temp_max: tempMax,
      pressure: 1013,
      humidity,
    },
    wind: { speed: windSpeed, deg: 180 },
    clouds: { all: 0 },
    dt: 1700000000,
    sys: { country: "KR", sunrise: 1699990000, sunset: 1700030000 },
    timezone: 32400,
    name,
  };
}

function createForecastResponse(cityName = "Seoul") {
  const baseTime = 1700000000;
  const items = Array.from({ length: 16 }, (_, i) => ({
    dt: baseTime + i * 10800,
    main: {
      temp: 291.15 + i,
      feels_like: 290.15 + i,
      temp_min: 290.15 + i,
      temp_max: 293.15 + i,
      pressure: 1013,
      humidity: 60 + i,
    },
    weather: [
      {
        id: 800,
        main: "Clear",
        description: "clear sky",
        icon: "01d",
      },
    ],
    dt_txt: `2023-11-14 ${String((i * 3) % 24).padStart(2, "0")}:00:00`,
  }));

  return {
    list: items,
    city: {
      name: cityName,
      coord: { lat: 37.5665, lon: 126.978 },
      country: "KR",
      timezone: 32400,
    },
  };
}

function createGeocodingResponse(
  name: string,
  lat: number,
  lon: number,
  state?: string,
) {
  return [{ name, lat, lon, country: "KR", state }];
}

export async function mockWeatherApi(
  page: Page,
  options?: {
    weatherOverrides?: Parameters<typeof createCurrentWeatherResponse>[0];
    forecastCityName?: string;
    geocoding?: { name: string; lat: number; lon: number; state?: string };
    geocodingEmpty?: boolean;
  },
) {
  await page.route(`${API_BASE}/data/2.5/weather*`, (route) => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(
        createCurrentWeatherResponse(options?.weatherOverrides),
      ),
    });
  });

  await page.route(`${API_BASE}/data/2.5/forecast*`, (route) => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(
        createForecastResponse(options?.forecastCityName),
      ),
    });
  });

  await page.route(`${API_BASE}/geo/1.0/direct*`, (route) => {
    if (options?.geocodingEmpty) {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([]),
      });
      return;
    }

    const { name = "Jongno-gu", lat = 37.5735, lon = 126.9788, state } =
      options?.geocoding ?? {};

    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(createGeocodingResponse(name, lat, lon, state)),
    });
  });

  // Mock weather icon images to avoid network requests
  await page.route("https://openweathermap.org/img/wn/*", (route) => {
    route.fulfill({
      status: 200,
      contentType: "image/png",
      body: Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
        "base64",
      ),
    });
  });
}

export async function setFavorites(
  page: Page,
  favorites: Array<{
    name: string;
    lat: number;
    lon: number;
    alias?: string;
  }>,
) {
  const data = favorites.map((f) => ({
    id: `${f.lat},${f.lon}`,
    name: f.name,
    alias: f.alias ?? f.name.replaceAll("-", " "),
    lat: f.lat,
    lon: f.lon,
  }));

  await page.evaluate((stored) => {
    localStorage.setItem("favorites", JSON.stringify(stored));
  }, data);
}

export async function clearFavorites(page: Page) {
  await page.evaluate(() => {
    localStorage.removeItem("favorites");
  });
}
