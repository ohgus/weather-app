export interface GeoLocation {
  lat: number;
  lon: number;
}

const GEOLOCATION_TIMEOUT_MS = 10_000;
const GEOLOCATION_MAX_AGE_MS = 5 * 60 * 1000;

export function getCurrentPosition(): Promise<GeoLocation> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation API를 지원하지 않는 브라우저입니다."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            reject(new Error("위치 권한이 거부되었습니다."));
            break;
          case error.POSITION_UNAVAILABLE:
            reject(new Error("위치 정보를 사용할 수 없습니다."));
            break;
          case error.TIMEOUT:
            reject(new Error("위치 요청 시간이 초과되었습니다."));
            break;
          default:
            reject(new Error("알 수 없는 위치 오류가 발생했습니다."));
        }
      },
      {
        enableHighAccuracy: false,
        timeout: GEOLOCATION_TIMEOUT_MS,
        maximumAge: GEOLOCATION_MAX_AGE_MS,
      },
    );
  });
}
