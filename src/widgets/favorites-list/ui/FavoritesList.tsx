import { AsyncBoundary } from "@/shared/ui";
import { useFavorites } from "@/features/manage-favorites";
import { FavoriteCard } from "./FavoriteCard";
import { FavoriteCardSkeleton } from "./FavoriteCardSkeleton";

export function FavoritesList() {
  const { favorites } = useFavorites();

  if (favorites.length === 0) return null;

  return (
    <section className="mt-6">
      <h3 className="mb-3 text-sm font-medium text-gray-600">즐겨찾기</h3>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {favorites.map((favorite) => (
          <AsyncBoundary
            key={favorite.id}
            fallback={<FavoriteCardSkeleton />}
          >
            <FavoriteCard favorite={favorite} />
          </AsyncBoundary>
        ))}
      </div>
    </section>
  );
}
