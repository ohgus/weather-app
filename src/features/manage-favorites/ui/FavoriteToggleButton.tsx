import { StarIcon, StarFilledIcon } from "@/shared/ui";
import { useFavorites } from "../model/use-favorites";

interface FavoriteToggleButtonProps {
  name: string;
  lat: number;
  lon: number;
}

export function FavoriteToggleButton({
  name,
  lat,
  lon,
}: FavoriteToggleButtonProps) {
  const { add, remove, favorites, isFavorited } = useFavorites();
  const favorited = isFavorited(lat, lon);

  function handleToggle() {
    if (favorited) {
      const target = favorites.find((f) => f.lat === lat && f.lon === lon);
      if (target) remove(target.id);
    } else {
      try {
        add({ name, lat, lon });
      } catch (e) {
        alert((e as Error).message);
      }
    }
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-white/50"
      aria-label={favorited ? "즐겨찾기 해제" : "즐겨찾기 추가"}
    >
      {favorited ? (
        <StarFilledIcon className="h-6 w-6 text-yellow-400" />
      ) : (
        <StarIcon className="h-6 w-6 text-gray-400" />
      )}
    </button>
  );
}
