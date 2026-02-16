import { describe, expect, it } from "vitest";
import { formatDistrictDisplay } from "../model/format-district-display";

describe("formatDistrictDisplay", () => {
  it("3단계 행정구역의 '-'를 공백으로 변환한다", () => {
    expect(formatDistrictDisplay("서울특별시-종로구-청운동")).toBe(
      "서울특별시 종로구 청운동",
    );
  });

  it("2단계 행정구역의 '-'를 공백으로 변환한다", () => {
    expect(formatDistrictDisplay("서울특별시-종로구")).toBe(
      "서울특별시 종로구",
    );
  });

  it("1단계 행정구역은 그대로 반환한다", () => {
    expect(formatDistrictDisplay("서울특별시")).toBe("서울특별시");
  });

  it("빈 문자열은 그대로 반환한다", () => {
    expect(formatDistrictDisplay("")).toBe("");
  });
});
