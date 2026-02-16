import { useParams } from "react-router";

export function DetailPage() {
  const { locationId } = useParams();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">날씨 상세</h1>
      <p className="mt-2 text-gray-600">Location: {locationId}</p>
    </div>
  );
}
