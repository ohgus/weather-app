import { SkeletonBox, SkeletonText } from "@/shared/ui";

const SKELETON_COUNT = 8;

export function HourlyForecastSkeleton() {
  return (
    <div className="mt-6">
      <SkeletonText className="mb-3 w-24" />

      <div className="flex gap-3 overflow-x-auto pb-2">
        {Array.from({ length: SKELETON_COUNT }, (_, i) => (
          <div
            key={i}
            className="flex shrink-0 flex-col items-center gap-1 rounded-2xl bg-white/60 px-4 py-3"
          >
            <SkeletonText className="w-8" />
            <SkeletonBox className="h-10 w-10 rounded-full" />
            <SkeletonText className="w-8" />
          </div>
        ))}
      </div>
    </div>
  );
}
