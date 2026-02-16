import { useEffect, useRef } from "react";
import { formatDistrictDisplay } from "@/entities/location";

interface SearchLocationListProps {
  results: string[];
  onSelect: (district: string) => void;
  highlightedIndex?: number;
}

export function SearchLocationList({
  results,
  onSelect,
  highlightedIndex = -1,
}: SearchLocationListProps) {
  const highlightedRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    highlightedRef.current?.scrollIntoView({ block: "nearest" });
  }, [highlightedIndex]);

  if (results.length === 0) {
    return (
      <div className="px-4 py-3 text-sm text-gray-500">
        검색 결과가 없습니다
      </div>
    );
  }

  return (
    <ul role="listbox">
      {results.map((district, index) => (
        <li
          key={district}
          ref={index === highlightedIndex ? highlightedRef : null}
          role="option"
          aria-selected={index === highlightedIndex}
        >
          <button
            type="button"
            className={`w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-blue-50 ${
              index === highlightedIndex ? "bg-blue-50" : ""
            }`}
            onClick={() => onSelect(district)}
          >
            {formatDistrictDisplay(district)}
          </button>
        </li>
      ))}
    </ul>
  );
}
