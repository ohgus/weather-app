import { test, expect } from "@playwright/test";
import { mockWeatherApi, setFavorites } from "./helpers/mock-api";

test.describe("상세 페이지", () => {
  test.beforeEach(async ({ page, context }) => {
    await context.grantPermissions(["geolocation"]);
    await context.setGeolocation({ latitude: 37.5665, longitude: 126.978 });
    await mockWeatherApi(page);
  });

  test("즐겨찾기 카드 클릭 시 상세 페이지로 이동한다", async ({ page }) => {
    await page.goto("/");
    await setFavorites(page, [
      { name: "서울특별시-종로구", lat: 37.5735, lon: 126.9788 },
    ]);
    await page.reload();

    // 카드 내 Link 영역 클릭 (날씨 정보가 있는 영역)
    await expect(page.getByText("서울특별시-종로구")).toBeVisible();
    const card = page.locator('a[href*="/detail/"]').first();
    await card.click();

    await page.waitForURL(/\/detail\//);

    await expect(page.getByText("뒤로")).toBeVisible();
    await expect(page.locator(".text-7xl")).toBeVisible();
    await expect(page.getByText("시간대별 날씨")).toBeVisible();
  });

  test("상세 페이지에서 뒤로 버튼 클릭 시 홈으로 돌아간다", async ({
    page,
  }) => {
    await page.goto("/");
    await setFavorites(page, [
      { name: "서울특별시-종로구", lat: 37.5735, lon: 126.9788 },
    ]);
    await page.reload();

    // Link 영역 클릭
    const card = page.locator('a[href*="/detail/"]').first();
    await card.click();
    await page.waitForURL(/\/detail\//);

    // 뒤로 버튼 클릭
    await page.getByText("뒤로").click();

    await page.waitForURL("/");
    await expect(page.getByPlaceholder("지역을 검색하세요")).toBeVisible();
  });

  test("상세 페이지에서 즐겨찾기 토글이 동작한다", async ({ page }) => {
    await page.goto("/");
    await setFavorites(page, [
      { name: "서울특별시-종로구", lat: 37.5735, lon: 126.9788 },
    ]);
    await page.reload();

    const card = page.locator('a[href*="/detail/"]').first();
    await card.click();
    await page.waitForURL(/\/detail\//);

    // 즐겨찾기 해제 버튼 확인 (이미 등록된 상태)
    await expect(
      page.getByRole("button", { name: "즐겨찾기 해제" }),
    ).toBeVisible();

    // 즐겨찾기 해제
    await page.getByRole("button", { name: "즐겨찾기 해제" }).click();

    // 추가 버튼으로 변경
    await expect(
      page.getByRole("button", { name: "즐겨찾기 추가" }),
    ).toBeVisible();
  });

  test("잘못된 URL로 접근하면 에러 UI를 표시한다", async ({ page }) => {
    await page.goto("/detail/invalid");

    await expect(page.getByText("잘못된 접근입니다.")).toBeVisible();
    await expect(page.getByText("홈으로 돌아가기")).toBeVisible();

    await page.getByText("홈으로 돌아가기").click();
    await page.waitForURL("/");
  });

  test("상세 페이지에 전체 날씨 정보가 표시된다", async ({ page }) => {
    await page.goto("/detail/37.5735,126.9788?name=서울특별시-종로구");

    // 현재 기온 - text-7xl 클래스로 특정
    await expect(page.locator(".text-7xl")).toContainText("20°");

    // 최고/최저
    await expect(page.getByText("최고 23°")).toBeVisible();
    await expect(page.getByText("최저 17°")).toBeVisible();

    // 상세 정보
    await expect(page.getByText("체감")).toBeVisible();
    await expect(page.getByText("습도")).toBeVisible();
    await expect(page.getByText("바람")).toBeVisible();

    // 시간대별 예보
    await expect(page.getByText("시간대별 날씨")).toBeVisible();
  });
});
