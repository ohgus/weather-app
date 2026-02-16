import { SkeletonBox, SkeletonText } from "@/shared/ui";

export function FavoriteCardSkeleton() {
  return (
    <div className="rounded-2xl bg-white/60 p-4 backdrop-blur-sm">
      <div className="mb-2">
        <SkeletonText className="w-20" />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SkeletonBox className="h-10 w-10 rounded-full" />
          <SkeletonBox className="h-8 w-12 rounded-lg" />
        </div>
        <div className="flex flex-col items-end gap-1">
          <SkeletonText className="w-14" />
          <SkeletonText className="w-14" />
        </div>
      </div>
    </div>
  );
}
