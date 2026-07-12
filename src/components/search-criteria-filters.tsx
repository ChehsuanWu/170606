"use client";

import { KeywordBundleInput } from "@/components/keyword-bundle-input";
import { CheckboxGroup } from "@/components/checkbox-group";
import { LANGUAGE_OPTIONS, PLACE_OPTIONS, MEDIA_TYPE_OPTIONS, MATCH_TYPE_OPTIONS } from "@/lib/constants";

export type SearchCriteria = {
  keywords: string[];
  matchType: "ANY" | "ALL";
  places: string[];
  languages: string[];
  mediaTypes: string[];
};

export function SearchCriteriaFilters({
  criteria,
  onChange,
}: {
  criteria: SearchCriteria;
  onChange: (next: SearchCriteria) => void;
}) {
  const placeOptions = PLACE_OPTIONS.map((p) => ({ value: p, label: p }));

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">Keywords</label>
        <KeywordBundleInput
          value={criteria.keywords}
          onChange={(keywords) => onChange({ ...criteria, keywords })}
        />
        {criteria.keywords.length > 1 && (
          <div className="mt-2 flex gap-3">
            {MATCH_TYPE_OPTIONS.map((opt) => (
              <label key={opt.value} className="flex items-center gap-1.5 text-xs text-slate-600">
                <input
                  type="radio"
                  name="matchType"
                  checked={criteria.matchType === opt.value}
                  onChange={() => onChange({ ...criteria, matchType: opt.value })}
                  className="h-3.5 w-3.5"
                />
                {opt.label}
              </label>
            ))}
          </div>
        )}
      </div>

      <CheckboxGroup
        label="Places"
        options={placeOptions}
        selected={criteria.places}
        onChange={(places) => onChange({ ...criteria, places })}
      />

      <CheckboxGroup
        label="Languages"
        options={LANGUAGE_OPTIONS.map((l) => ({ value: l.code, label: l.label }))}
        selected={criteria.languages}
        onChange={(languages) => onChange({ ...criteria, languages })}
      />

      <CheckboxGroup
        label="Media type"
        options={MEDIA_TYPE_OPTIONS}
        selected={criteria.mediaTypes}
        onChange={(mediaTypes) => onChange({ ...criteria, mediaTypes })}
      />
    </div>
  );
}
