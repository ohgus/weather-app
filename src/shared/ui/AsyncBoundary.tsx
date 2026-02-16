import { Suspense, type ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "./ErrorFallback";

interface AsyncBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
  onReset?: () => void;
}

export function AsyncBoundary({
  children,
  fallback,
  onReset,
}: AsyncBoundaryProps) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={onReset}>
      <Suspense fallback={fallback}>{children}</Suspense>
    </ErrorBoundary>
  );
}
