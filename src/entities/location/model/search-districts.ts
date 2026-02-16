import districts from "@/shared/data/korea_districts.json";

const MAX_RESULTS = 20;

export function searchDistricts(query: string): string[] {
  const trimmed = query.trim();
  if (trimmed === "") {
    return [];
  }

  const results: string[] = [];

  for (const district of districts) {
    if (district.includes(trimmed)) {
      results.push(district);
      if (results.length >= MAX_RESULTS) {
        break;
      }
    }
  }

  return results;
}
