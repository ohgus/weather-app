import { SkeletonBox, SkeletonText } from "@/shared/ui";

export function WeatherDisplaySkeleton() {
  return (
    <div className="text-center">
      <SkeletonText className="mx-auto w-20" />

      <SkeletonBox className="mx-auto mt-2 h-24 w-24 rounded-full" />

      <SkeletonBox className="mx-auto mt-2 h-16 w-36 rounded-xl" />

      <SkeletonText className="mx-auto mt-2 w-24" />

      <div className="mt-2 flex justify-center gap-4">
        <SkeletonText className="w-14" />
        <SkeletonText className="w-14" />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 rounded-2xl bg-white/60 p-4">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <SkeletonText className="w-8" />
            <SkeletonText className="w-10" />
          </div>
        ))}
      </div>
    </div>
  );
}
