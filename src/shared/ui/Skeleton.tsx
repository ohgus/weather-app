interface SkeletonProps {
  className?: string;
}

export function SkeletonBox({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-gray-200 ${className}`}
      aria-hidden="true"
    />
  );
}

export function SkeletonText({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`h-4 animate-pulse rounded bg-gray-200 ${className}`}
      aria-hidden="true"
    />
  );
}

export function SkeletonCircle({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-full bg-gray-200 ${className}`}
      aria-hidden="true"
    />
  );
}
