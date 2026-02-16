import { useSyncExternalStore } from "react";
import type { FavoriteLocation } from "@/entities/location/model/types";
import {
  addFavorite,
  getFavorites,
  removeFavorite,
  updateFavoriteAlias,
} from "./favorites-store";

const listeners = new Set<() => void>();
let cache = getFavorites();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): FavoriteLocation[] {
  return cache;
}

function notify() {
  cache = getFavorites();
  listeners.forEach((l) => l());
}

export function useFavorites() {
  const favorites = useSyncExternalStore(subscribe, getSnapshot);

  return {
    favorites,
    add(location: { name: string; lat: number; lon: number }) {
      const result = addFavorite(location);
      notify();
      return result;
    },
    remove(id: string) {
      removeFavorite(id);
      notify();
    },
    updateAlias(id: string, alias: string) {
      const result = updateFavoriteAlias(id, alias);
      notify();
      return result;
    },
    isFavorited(lat: number, lon: number) {
      return favorites.some((f) => f.lat === lat && f.lon === lon);
    },
  };
}
