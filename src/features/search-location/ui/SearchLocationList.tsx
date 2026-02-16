import { searchDistricts } from "@/entities/location";

interface SearchLocationListProps {
  query: string;
  onSelect: (district: string) => void;
}

export function SearchLocationList({
  query,
  onSelect,
}: SearchLocationListProps) {
  const results = searchDistricts(query);

  if (results.length === 0) {
    return (
      <div className="px-4 py-3 text-sm text-gray-500">
        검색 결과가 없습니다
      </div>
    );
  }

  return (
    <ul>
      {results.map((district) => (
        <li key={district}>
          <button
            type="button"
            className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-blue-50"
            onClick={() => onSelect(district)}
          >
            {district}
          </button>
        </li>
      ))}
    </ul>
  );
}
