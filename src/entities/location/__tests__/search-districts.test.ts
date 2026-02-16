import { describe, expect, it } from "vitest";
import { searchDistricts } from "../model/search-districts";

describe("searchDistricts", () => {
  it("빈 문자열 입력 시 빈 배열을 반환한다", () => {
    expect(searchDistricts("")).toEqual([]);
  });

  it("공백만 입력 시 빈 배열을 반환한다", () => {
    expect(searchDistricts("   ")).toEqual([]);
  });

  it("'서울' 입력 시 서울특별시 관련 결과를 반환한다", () => {
    const results = searchDistricts("서울");

    expect(results.length).toBeGreaterThan(0);
    results.forEach((result) => {
      expect(result).toContain("서울");
    });
  });

  it("'종로' 입력 시 종로구 관련 결과를 반환한다", () => {
    const results = searchDistricts("종로");

    expect(results.length).toBeGreaterThan(0);
    results.forEach((result) => {
      expect(result).toContain("종로");
    });
  });

  it("'청운동' 입력 시 청운동 포함 결과를 반환한다", () => {
    const results = searchDistricts("청운동");

    expect(results.length).toBeGreaterThan(0);
    expect(results.some((r) => r.includes("청운동"))).toBe(true);
  });

  it("존재하지 않는 지역명 입력 시 빈 배열을 반환한다", () => {
    expect(searchDistricts("아틀란티스")).toEqual([]);
  });

  it("결과 개수는 최대 20개로 제한된다", () => {
    const results = searchDistricts("동");

    expect(results.length).toBeLessThanOrEqual(20);
  });

  it("시/구/동 모든 레벨에서 검색할 수 있다", () => {
    const cityResults = searchDistricts("부산");
    const districtResults = searchDistricts("강남구");
    const dongResults = searchDistricts("역삼동");

    expect(cityResults.length).toBeGreaterThan(0);
    expect(districtResults.length).toBeGreaterThan(0);
    expect(dongResults.length).toBeGreaterThan(0);
  });
});
