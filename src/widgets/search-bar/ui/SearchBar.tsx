import { useEffect, useRef, useState } from "react";
import { searchDistricts, formatDistrictDisplay } from "@/entities/location";
import { useDebouncedValue } from "@/shared/lib/use-debounce";
import { LocationPinIcon, CloseIcon, SearchIcon } from "@/shared/ui";
import { SearchLocationList } from "@/features/search-location";

const DEBOUNCE_DELAY_MS = 300;

interface SearchBarProps {
  selectedLocation: string | null;
  onSelect: (district: string) => void;
  onClear: () => void;
}

export function SearchBar({
  selectedLocation,
  onSelect,
  onClear,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const debouncedQuery = useDebouncedValue(query, DEBOUNCE_DELAY_MS);
  const containerRef = useRef<HTMLDivElement>(null);
  const results = debouncedQuery ? searchDistricts(debouncedQuery) : [];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(district: string) {
    onSelect(district);
    setQuery("");
    setIsOpen(false);
    setHighlightedIndex(-1);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.nativeEvent.isComposing) return;
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < results.length - 1 ? prev + 1 : 0,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : results.length - 1,
        );
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0) {
          handleSelect(results[highlightedIndex]!);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  }

  if (selectedLocation) {
    return (
      <div className="flex items-center gap-2 rounded-2xl bg-white/80 px-4 py-3 shadow-sm backdrop-blur-sm">
        <LocationPinIcon className="h-5 w-5 shrink-0 text-blue-500" />
        <span className="flex-1 truncate text-sm font-medium text-gray-700">
          {formatDistrictDisplay(selectedLocation)}
        </span>
        <button
          type="button"
          onClick={onClear}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          aria-label="검색 초기화"
        >
          <CloseIcon className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="flex items-center gap-2 rounded-2xl bg-white/80 px-4 py-3 shadow-sm backdrop-blur-sm">
        <SearchIcon className="h-5 w-5 shrink-0 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setHighlightedIndex(-1);
          }}
          onFocus={() => {
            if (query) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder="지역을 검색하세요"
          className="w-full bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
        />
      </div>

      {isOpen && debouncedQuery && (
        <div className="absolute top-full z-10 mt-2 max-h-64 w-full overflow-y-auto rounded-2xl bg-white/95 shadow-lg backdrop-blur-sm">
          <SearchLocationList
            results={results}
            onSelect={handleSelect}
            highlightedIndex={highlightedIndex}
          />
        </div>
      )}
    </div>
  );
}
