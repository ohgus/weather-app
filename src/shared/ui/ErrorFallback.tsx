import type { FallbackProps } from "react-error-boundary";

export function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div role="alert" className="flex flex-col items-center gap-4 rounded-xl bg-white/80 p-6 text-center">
      <p className="text-sm text-gray-500">문제가 발생했습니다</p>
      <p className="text-sm text-red-500">{error.message}</p>
      <button
        type="button"
        onClick={resetErrorBoundary}
        className="rounded-lg bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
      >
        다시 시도
      </button>
    </div>
  );
}
