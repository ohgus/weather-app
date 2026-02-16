import type { FavoriteLocation } from "@/entities/location/model/types";
import { formatDistrictDisplay } from "@/entities/location/model/format-district-display";

const STORAGE_KEY = "favorites";
const MAX_FAVORITES = 6;

export function getFavorites(): FavoriteLocation[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as FavoriteLocation[];
  } catch {
    return [];
  }
}

export function addFavorite(location: {
  name: string;
  lat: number;
  lon: number;
}): FavoriteLocation {
  const favorites = getFavorites();

  if (favorites.length >= MAX_FAVORITES) {
    throw new Error("즐겨찾기는 최대 6개까지 추가할 수 있습니다");
  }

  const isDuplicate = favorites.some(
    (f) => f.lat === location.lat && f.lon === location.lon,
  );
  if (isDuplicate) {
    throw new Error("이미 즐겨찾기에 추가된 장소입니다");
  }

  const newFavorite: FavoriteLocation = {
    id: `${location.lat},${location.lon}`,
    name: location.name,
    alias: formatDistrictDisplay(location.name),
    lat: location.lat,
    lon: location.lon,
  };

  const updated = [...favorites, newFavorite];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  return newFavorite;
}

export function removeFavorite(id: string): void {
  const favorites = getFavorites();
  const updated = favorites.filter((f) => f.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function updateFavoriteAlias(
  id: string,
  alias: string,
): FavoriteLocation {
  if (!alias.trim()) {
    throw new Error("별칭은 비어있을 수 없습니다");
  }

  const favorites = getFavorites();
  const index = favorites.findIndex((f) => f.id === id);

  if (index === -1) {
    throw new Error("즐겨찾기를 찾을 수 없습니다");
  }

  const updated = { ...favorites[index]!, alias };
  favorites[index] = updated;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));

  return updated;
}
