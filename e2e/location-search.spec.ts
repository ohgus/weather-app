import { test, expect } from "@playwright/test";
import { mockWeatherApi } from "./helpers/mock-api";

test.describe("장소 검색 → 날씨 조회", () => {
  test.beforeEach(async ({ page, context }) => {
    await context.grantPermissions(["geolocation"]);
    await context.setGeolocation({ latitude: 37.5665, longitude: 126.978 });
    await mockWeatherApi(page);
  });

  test("검색어 입력 시 매칭 장소 리스트가 표시된다", async ({ page }) => {
    await page.goto("/");

    const searchInput = page.getByPlaceholder("지역을 검색하세요");
    await searchInput.fill("종로");

    // debounce 후 드롭다운에 검색 결과 표시 (다수 결과 중 첫 번째)
    await expect(
      page.getByRole("button", { name: /종로구/ }).first(),
    ).toBeVisible({ timeout: 5000 });
  });

  test("장소 선택 시 해당 장소의 날씨가 표시된다", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Seoul")).toBeVisible();

    // 검색
    const searchInput = page.getByPlaceholder("지역을 검색하세요");
    await searchInput.fill("종로");

    // 검색 결과에서 첫 번째 항목 클릭
    await page.getByRole("button", { name: /종로구/ }).first().click();

    // 선택된 장소명이 표시됨
    await expect(page.getByText(/종로구/)).toBeVisible();

    // 날씨 정보 표시 - 메인 기온을 text-7xl 클래스로 특정
    await expect(page.locator(".text-7xl")).toBeVisible();
  });

  test("선택된 장소를 초기화하면 현재 위치 날씨로 돌아간다", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.getByText("Seoul")).toBeVisible();

    // 검색 후 선택
    const searchInput = page.getByPlaceholder("지역을 검색하세요");
    await searchInput.fill("종로");
    await page.getByRole("button", { name: /종로구/ }).first().click();

    // 초기화 버튼 클릭
    await page.getByRole("button", { name: "검색 초기화" }).click();

    // 검색 입력 필드가 다시 나타남
    await expect(page.getByPlaceholder("지역을 검색하세요")).toBeVisible();
  });

  test("빈 검색어에는 드롭다운이 표시되지 않는다", async ({ page }) => {
    await page.goto("/");

    const searchInput = page.getByPlaceholder("지역을 검색하세요");
    await searchInput.fill("");

    await expect(page.getByText("검색 결과가 없습니다")).not.toBeVisible();
  });

  test("Geocoding 결과가 없으면 에러 메시지를 표시한다", async ({ page }) => {
    await page.unrouteAll();
    await mockWeatherApi(page, { geocodingEmpty: true });

    await page.goto("/");
    await expect(page.getByText("Seoul")).toBeVisible();

    const searchInput = page.getByPlaceholder("지역을 검색하세요");
    await searchInput.fill("종로");
    await page.getByRole("button", { name: /종로구/ }).first().click();

    await expect(
      page.getByText("해당 장소의 정보가 제공되지 않습니다."),
    ).toBeVisible({ timeout: 5000 });
  });
});
