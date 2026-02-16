import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  addFavorite,
  getFavorites,
  removeFavorite,
  updateFavoriteAlias,
} from "../model/favorites-store";

describe("favorites-store", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe("getFavorites", () => {
    it("초기 상태에서 빈 배열을 반환한다", () => {
      expect(getFavorites()).toEqual([]);
    });

    it("localStorage에 저장된 즐겨찾기를 반환한다", () => {
      const stored = [
        { id: "1", name: "서울특별시 종로구", alias: "종로", lat: 37.57, lon: 126.98 },
      ];
      localStorage.setItem("favorites", JSON.stringify(stored));

      expect(getFavorites()).toEqual(stored);
    });

    it("localStorage에 유효하지 않은 JSON이 있으면 빈 배열을 반환한다", () => {
      localStorage.setItem("favorites", "invalid-json");

      expect(getFavorites()).toEqual([]);
    });
  });

  describe("addFavorite", () => {
    it("즐겨찾기를 추가하면 목록에 포함된다", () => {
      const added = addFavorite({ name: "서울특별시 강남구", lat: 37.5172, lon: 127.0473 });

      expect(added).toMatchObject({
        name: "서울특별시 강남구",
        alias: "서울특별시 강남구",
        lat: 37.5172,
        lon: 127.0473,
      });
      expect(added.id).toBeDefined();

      const favorites = getFavorites();
      expect(favorites).toHaveLength(1);
      expect(favorites[0]).toEqual(added);
    });

    it("alias는 기본값으로 name과 동일하게 설정된다", () => {
      const added = addFavorite({ name: "부산광역시 해운대구", lat: 35.16, lon: 129.16 });

      expect(added.alias).toBe("부산광역시 해운대구");
    });

    it("여러 개의 즐겨찾기를 추가할 수 있다", () => {
      addFavorite({ name: "서울특별시 강남구", lat: 37.5172, lon: 127.0473 });
      addFavorite({ name: "부산광역시 해운대구", lat: 35.16, lon: 129.16 });
      addFavorite({ name: "제주특별자치도 제주시", lat: 33.5, lon: 126.53 });

      expect(getFavorites()).toHaveLength(3);
    });

    it("최대 6개 초과 추가 시 에러를 발생시킨다", () => {
      for (let i = 0; i < 6; i++) {
        addFavorite({ name: `장소 ${i}`, lat: 37 + i, lon: 127 + i });
      }

      expect(() =>
        addFavorite({ name: "장소 7", lat: 43, lon: 133 }),
      ).toThrow("즐겨찾기는 최대 6개까지 추가할 수 있습니다");
    });

    it("중복 장소(동일 좌표) 추가 시 에러를 발생시킨다", () => {
      addFavorite({ name: "서울특별시 강남구", lat: 37.5172, lon: 127.0473 });

      expect(() =>
        addFavorite({ name: "서울특별시 강남구", lat: 37.5172, lon: 127.0473 }),
      ).toThrow("이미 즐겨찾기에 추가된 장소입니다");
    });

    it("localStorage에 영속적으로 저장된다", () => {
      addFavorite({ name: "서울특별시 강남구", lat: 37.5172, lon: 127.0473 });

      const stored = JSON.parse(localStorage.getItem("favorites")!);
      expect(stored).toHaveLength(1);
      expect(stored[0].name).toBe("서울특별시 강남구");
    });
  });

  describe("removeFavorite", () => {
    it("즐겨찾기를 삭제하면 목록에서 제거된다", () => {
      const added = addFavorite({ name: "서울특별시 강남구", lat: 37.5172, lon: 127.0473 });

      removeFavorite(added.id);

      expect(getFavorites()).toEqual([]);
    });

    it("존재하지 않는 id로 삭제 시 에러 없이 무시한다", () => {
      addFavorite({ name: "서울특별시 강남구", lat: 37.5172, lon: 127.0473 });

      expect(() => removeFavorite("non-existent")).not.toThrow();
      expect(getFavorites()).toHaveLength(1);
    });

    it("삭제 후 localStorage에 반영된다", () => {
      const added = addFavorite({ name: "서울특별시 강남구", lat: 37.5172, lon: 127.0473 });

      removeFavorite(added.id);

      const stored = JSON.parse(localStorage.getItem("favorites")!);
      expect(stored).toEqual([]);
    });
  });

  describe("updateFavoriteAlias", () => {
    it("별칭을 수정하면 변경된 값이 반영된다", () => {
      const added = addFavorite({ name: "서울특별시 강남구", lat: 37.5172, lon: 127.0473 });

      const updated = updateFavoriteAlias(added.id, "우리 집");

      expect(updated.alias).toBe("우리 집");
      expect(updated.name).toBe("서울특별시 강남구");
    });

    it("별칭 수정 후 localStorage에 반영된다", () => {
      const added = addFavorite({ name: "서울특별시 강남구", lat: 37.5172, lon: 127.0473 });

      updateFavoriteAlias(added.id, "회사");

      const stored = JSON.parse(localStorage.getItem("favorites")!);
      expect(stored[0].alias).toBe("회사");
    });

    it("존재하지 않는 id로 수정 시 에러를 발생시킨다", () => {
      expect(() => updateFavoriteAlias("non-existent", "별칭")).toThrow(
        "즐겨찾기를 찾을 수 없습니다",
      );
    });

    it("빈 문자열로 수정 시 에러를 발생시킨다", () => {
      const added = addFavorite({ name: "서울특별시 강남구", lat: 37.5172, lon: 127.0473 });

      expect(() => updateFavoriteAlias(added.id, "")).toThrow(
        "별칭은 비어있을 수 없습니다",
      );
    });

    it("공백만 있는 문자열로 수정 시 에러를 발생시킨다", () => {
      const added = addFavorite({ name: "서울특별시 강남구", lat: 37.5172, lon: 127.0473 });

      expect(() => updateFavoriteAlias(added.id, "   ")).toThrow(
        "별칭은 비어있을 수 없습니다",
      );
    });
  });
});
