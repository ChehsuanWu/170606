export const LANGUAGE_OPTIONS: { code: string; label: string }[] = [
  { code: "en", label: "English" },
  { code: "fr", label: "French" },
  { code: "de", label: "German" },
  { code: "es", label: "Spanish" },
  { code: "pt", label: "Portuguese" },
  { code: "ja", label: "Japanese" },
  { code: "ko", label: "Korean" },
  { code: "ar", label: "Arabic" },
  { code: "hi", label: "Hindi" },
  { code: "it", label: "Italian" },
];

export const PLACE_OPTIONS: string[] = [
  "United States",
  "United Kingdom",
  "Germany",
  "France",
  "Japan",
  "Brazil",
  "India",
  "Nigeria",
  "Australia",
  "United Arab Emirates",
  "Canada",
  "South Korea",
  "Mexico",
  "Spain",
  "Italy",
];

export const MEDIA_TYPE_OPTIONS: { value: string; label: string }[] = [
  { value: "NEWSPAPER", label: "Newspaper" },
  { value: "MAGAZINE", label: "Magazine" },
  { value: "TV", label: "TV" },
  { value: "RADIO", label: "Radio" },
  { value: "ONLINE_NEWS", label: "Online News" },
  { value: "BLOG", label: "Blog" },
  { value: "SOCIAL_MEDIA", label: "Social Media" },
];

export const MATCH_TYPE_OPTIONS: { value: "ANY" | "ALL"; label: string; helpText: string }[] = [
  { value: "ANY", label: "Any keyword (OR)", helpText: "Match articles containing at least one keyword in the bundle." },
  { value: "ALL", label: "All keywords (AND)", helpText: "Match articles that contain every keyword in the bundle." },
];

export const FREQUENCY_OPTIONS: { value: "INSTANT" | "DAILY" | "WEEKLY"; label: string }[] = [
  { value: "INSTANT", label: "Instant" },
  { value: "DAILY", label: "Daily digest" },
  { value: "WEEKLY", label: "Weekly digest" },
];

export function languageLabel(code: string): string {
  return LANGUAGE_OPTIONS.find((l) => l.code === code)?.label ?? code;
}

export function mediaTypeLabel(value: string): string {
  return MEDIA_TYPE_OPTIONS.find((m) => m.value === value)?.label ?? value;
}
