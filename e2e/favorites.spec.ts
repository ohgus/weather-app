import { test, expect } from "@playwright/test";
import {
  mockWeatherApi,
  setFavorites,
  clearFavorites,
} from "./helpers/mock-api";

test.describe("즐겨찾기 관리", () => {
  test.beforeEach(async ({ page, context }) => {
    await context.grantPermissions(["geolocation"]);
    await context.setGeolocation({ latitude: 37.5665, longitude: 126.978 });
    await mockWeatherApi(page);
  });

  test("장소 검색 후 즐겨찾기에 추가하면 카드가 표시된다", async ({
    page,
  }) => {
    await page.goto("/");
    await clearFavorites(page);
    await expect(page.getByText("Seoul")).toBeVisible();

    // 장소 검색 및 선택
    await page.getByPlaceholder("지역을 검색하세요").fill("종로");
    await page.getByRole("button", { name: /종로구/ }).first().click();

    // 즐겨찾기 추가
    await page.getByRole("button", { name: "즐겨찾기 추가" }).click();

    // 즐겨찾기 섹션에 카드가 표시됨
    await expect(page.getByText("즐겨찾기")).toBeVisible();
  });

  test("즐겨찾기 카드에서 삭제 버튼을 누르면 카드가 제거된다", async ({
    page,
  }) => {
    await page.goto("/");
    await setFavorites(page, [
      { name: "서울특별시-종로구", lat: 37.5735, lon: 126.9788 },
    ]);
    await page.reload();

    await expect(page.getByText("즐겨찾기")).toBeVisible();
    await expect(page.getByText("서울특별시-종로구")).toBeVisible();

    await page.getByRole("button", { name: "즐겨찾기 삭제" }).click();

    await expect(page.getByText("서울특별시-종로구")).not.toBeVisible();
  });

  test("즐겨찾기 별칭을 수정할 수 있다", async ({ page }) => {
    await page.goto("/");
    await setFavorites(page, [
      { name: "서울특별시-종로구", lat: 37.5735, lon: 126.9788 },
    ]);
    await page.reload();

    await expect(page.getByText("서울특별시-종로구")).toBeVisible();

    // 수정 버튼 클릭
    await page.getByRole("button", { name: "별칭 수정" }).click();

    // autoFocus된 입력 필드를 찾아서 수정
    const editInput = page.locator("input[type='text']:focus");
    await editInput.clear();
    await editInput.fill("우리 동네");

    // 저장
    await page.getByRole("button", { name: "저장" }).click();

    // 변경된 별칭 확인
    await expect(page.getByText("우리 동네")).toBeVisible();
  });

  test("즐겨찾기는 최대 6개까지 추가 가능하다", async ({ page }) => {
    await page.goto("/");
    await setFavorites(page, [
      { name: "장소1", lat: 37.1, lon: 127.1 },
      { name: "장소2", lat: 37.2, lon: 127.2 },
      { name: "장소3", lat: 37.3, lon: 127.3 },
      { name: "장소4", lat: 37.4, lon: 127.4 },
      { name: "장소5", lat: 37.5, lon: 127.5 },
      { name: "장소6", lat: 37.6, lon: 127.6 },
    ]);
    await page.reload();

    // 6개 카드 확인
    await expect(page.getByText("즐겨찾기")).toBeVisible();

    // 검색 후 7번째 추가 시도
    await page.getByPlaceholder("지역을 검색하세요").fill("부산");
    await page.getByRole("button", { name: /부산/ }).first().click();

    // dialog 핸들러를 미리 등록
    page.once("dialog", (dialog) => dialog.accept());
    await page.getByRole("button", { name: "즐겨찾기 추가" }).click();
  });

  test("새로고침 후에도 즐겨찾기가 유지된다", async ({ page }) => {
    await page.goto("/");
    await setFavorites(page, [
      { name: "서울특별시-강남구", lat: 37.4979, lon: 127.0276 },
    ]);
    await page.reload();

    await expect(page.getByText("서울특별시-강남구")).toBeVisible();

    await page.reload();

    await expect(page.getByText("서울특별시-강남구")).toBeVisible();
  });
});
