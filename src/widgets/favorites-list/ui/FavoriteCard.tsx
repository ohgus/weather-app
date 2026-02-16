import { useState } from "react";
import { Link } from "react-router";
import type { FavoriteLocation } from "@/entities/location/model/types";
import { useWeatherQuery } from "@/entities/weather";
import { getWeatherIconUrl } from "@/shared/api/weather-api";
import { TrashIcon, EditIcon, CloseIcon } from "@/shared/ui";
import { useFavorites } from "@/features/manage-favorites";

interface FavoriteCardProps {
  favorite: FavoriteLocation;
}

export function FavoriteCard({ favorite }: FavoriteCardProps) {
  const { data: weather } = useWeatherQuery(favorite.lat, favorite.lon);
  const { remove, updateAlias } = useFavorites();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(favorite.alias);

  function handleCancelEdit() {
    setEditValue(favorite.alias);
    setIsEditing(false);
  }

  function handleSaveAlias() {
    const trimmed = editValue.trim();
    if (!trimmed) return handleCancelEdit();
    try {
      updateAlias(favorite.id, trimmed);
      setIsEditing(false);
    } catch {
      handleCancelEdit();
    }
  }

  return (
    <div className="relative rounded-2xl bg-white/60 p-4 backdrop-blur-sm transition-shadow hover:shadow-md">
      <div className="mb-2 flex items-start justify-between gap-1">
        {isEditing ? (
          <div className="flex flex-1 items-center gap-1">
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveAlias();
                if (e.key === "Escape") handleCancelEdit();
              }}
              className="w-full rounded-lg border border-gray-300 bg-white px-2 py-1 text-sm outline-none focus:border-blue-400"
              autoFocus
            />
            <button
              type="button"
              onClick={handleSaveAlias}
              className="shrink-0 text-xs text-blue-500 hover:text-blue-700"
            >
              저장
            </button>
            <button
              type="button"
              onClick={handleCancelEdit}
              className="shrink-0"
            >
              <CloseIcon className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        ) : (
          <h3 className="truncate text-sm font-semibold text-gray-800">
            {favorite.alias}
          </h3>
        )}

        {!isEditing && (
          <div className="flex shrink-0 gap-1">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              aria-label="별칭 수정"
            >
              <EditIcon className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => remove(favorite.id)}
              className="rounded-full p-1 text-gray-400 hover:bg-red-50 hover:text-red-500"
              aria-label="즐겨찾기 삭제"
            >
              <TrashIcon className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      <Link
        to={`/detail/${favorite.id}?name=${encodeURIComponent(favorite.name)}`}
        className="block"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={getWeatherIconUrl(weather.weatherIcon)}
              alt={weather.weatherDescription}
              className="h-10 w-10"
            />
            <span className="text-2xl font-bold text-gray-900">
              {weather.temperature}°
            </span>
          </div>
          <div className="text-right text-xs text-gray-500">
            <p>최고 {weather.tempMax}°</p>
            <p>최저 {weather.tempMin}°</p>
          </div>
        </div>
      </Link>
    </div>
  );
}
