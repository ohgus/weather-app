const ADMIN_SUFFIX =
  /특별자치시$|특별자치도$|특별시$|광역시$|[시도]$/;

/**
 * korea_districts.json 의 행정구역 문자열을 OpenWeatherMap Geocoding API 쿼리로 변환.
 *
 * "서울특별시-종로구-청운동" → "종로구, 서울"
 * "서울특별시-종로구"       → "종로구, 서울"
 * "서울특별시"              → "서울"
 */
export function toGeocodingQuery(districtName: string): string {
  const parts = districtName.split("-");
  const province = parts[0]!.replace(ADMIN_SUFFIX, "");

  if (parts.length >= 2) {
    return `${parts[1]}, ${province}`;
  }

  return province;
}
