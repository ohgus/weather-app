import { useSuspenseQuery } from "@tanstack/react-query";
import { getCurrentPosition } from "@/shared/lib/geolocation";

export function useGeolocationQuery() {
  return useSuspenseQuery({
    queryKey: ["geolocation"],
    queryFn: getCurrentPosition,
    staleTime: Infinity,
  });
}
