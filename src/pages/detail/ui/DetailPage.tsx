import { useParams, useSearchParams, useNavigate } from "react-router";
import { AsyncBoundary, ArrowLeftIcon } from "@/shared/ui";
import {
  WeatherDisplay,
  WeatherDisplaySkeleton,
  HourlyForecast,
  HourlyForecastSkeleton,
} from "@/widgets/weather-display";
import { FavoriteToggleButton } from "@/features/manage-favorites";

function WeatherPageSkeleton() {
  return (
    <>
      <WeatherDisplaySkeleton />
      <HourlyForecastSkeleton />
    </>
  );
}

export function DetailPage() {
  const { locationId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const name = searchParams.get("name") ?? "";
  const [latStr, lonStr] = (locationId ?? "").split(",");
  const lat = Number(latStr);
  const lon = Number(lonStr);

  if (!locationId || isNaN(lat) || isNaN(lon)) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <p className="text-gray-500">잘못된 접근입니다.</p>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="rounded-lg bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
        >
          홈으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex items-center gap-1 rounded-lg px-2 py-1 text-sm text-gray-600 hover:bg-white/50"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <span>뒤로</span>
        </button>

        <FavoriteToggleButton name={name} lat={lat} lon={lon} />
      </div>

      <AsyncBoundary fallback={<WeatherPageSkeleton />}>
        <WeatherDisplay lat={lat} lon={lon} />
        <HourlyForecast lat={lat} lon={lon} />
      </AsyncBoundary>
    </div>
  );
}
