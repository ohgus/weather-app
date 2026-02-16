import { test, expect } from "@playwright/test";
import { mockWeatherApi } from "./helpers/mock-api";

test.describe("현재 위치 날씨 표시", () => {
  test.beforeEach(async ({ page, context }) => {
    await context.grantPermissions(["geolocation"]);
    await context.setGeolocation({ latitude: 37.5665, longitude: 126.978 });
    await mockWeatherApi(page, {
      weatherOverrides: {
        name: "Seoul",
        temp: 293.15,
        tempMin: 290.15,
        tempMax: 296.15,
        humidity: 65,
        windSpeed: 3.5,
        description: "맑음",
      },
    });
  });

  test("현재 위치의 날씨 정보가 표시된다", async ({ page }) => {
    await page.goto("/");

    // 도시 이름
    await expect(page.getByText("Seoul")).toBeVisible();

    // 현재 기온 (293.15K → 20°C) - text-7xl 클래스로 특정
    await expect(page.locator(".text-7xl")).toContainText("20°");

    // 최고/최저 기온
    await expect(page.getByText("최고 23°")).toBeVisible();
    await expect(page.getByText("최저 17°")).toBeVisible();

    // 상세 정보
    await expect(page.getByText("65%")).toBeVisible();
    await expect(page.getByText("3.5m/s")).toBeVisible();
  });

  test("시간대별 날씨 예보가 표시된다", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByText("시간대별 날씨")).toBeVisible();

    const forecastSection = page.locator('section:has-text("시간대별 날씨")');
    const forecastCards = forecastSection.locator(".flex.gap-3 > div");
    await expect(forecastCards).toHaveCount(8);
  });

  test("Skeleton UI가 로딩 중에 표시된다", async ({ page }) => {
    await page.unrouteAll();
    await page.route("**/data/2.5/weather*", async (route) => {
      await new Promise((r) => setTimeout(r, 2000));
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          coord: { lon: 126.978, lat: 37.5665 },
          weather: [
            { id: 800, main: "Clear", description: "clear", icon: "01d" },
          ],
          main: {
            temp: 293.15,
            feels_like: 291.15,
            temp_min: 290.15,
            temp_max: 296.15,
            pressure: 1013,
            humidity: 65,
          },
          wind: { speed: 3.5, deg: 180 },
          clouds: { all: 0 },
          dt: 1700000000,
          sys: { country: "KR", sunrise: 1699990000, sunset: 1700030000 },
          timezone: 32400,
          name: "Seoul",
        }),
      });
    });
    await page.route("**/data/2.5/forecast*", async (route) => {
      await new Promise((r) => setTimeout(r, 2000));
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          list: [],
          city: {
            name: "Seoul",
            coord: { lat: 37.5665, lon: 126.978 },
            country: "KR",
            timezone: 32400,
          },
        }),
      });
    });
    await page.route("https://openweathermap.org/img/wn/*", (route) =>
      route.fulfill({
        status: 200,
        contentType: "image/png",
        body: Buffer.from(
          "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
          "base64",
        ),
      }),
    );

    await page.goto("/");

    const skeleton = page.locator(".animate-pulse").first();
    await expect(skeleton).toBeVisible();
  });
});
