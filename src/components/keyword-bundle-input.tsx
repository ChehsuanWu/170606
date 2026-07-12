"use client";

import { useState } from "react";

export function KeywordBundleInput({
  value,
  onChange,
  placeholder = "Type a keyword and press Enter…",
}: {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");

  function addKeyword(raw: string) {
    const keyword = raw.trim();
    if (!keyword) return;
    if (value.some((k) => k.toLowerCase() === keyword.toLowerCase())) {
      setDraft("");
      return;
    }
    onChange([...value, keyword]);
    setDraft("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addKeyword(draft);
    } else if (e.key === "Backspace" && draft === "" && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 rounded-md border border-slate-300 bg-white px-2 py-1.5 focus-within:border-slate-500">
        {value.map((keyword) => (
          <span
            key={keyword}
            className="flex items-center gap-1 rounded-full bg-slate-900 px-2.5 py-1 text-xs font-medium text-white"
          >
            {keyword}
            <button
              type="button"
              onClick={() => onChange(value.filter((k) => k !== keyword))}
              className="text-slate-300 hover:text-white"
              aria-label={`Remove ${keyword}`}
            >
              ×
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => addKeyword(draft)}
          placeholder={value.length === 0 ? placeholder : "Add another…"}
          className="min-w-[10ch] flex-1 border-none px-1 py-1 text-sm outline-none"
        />
      </div>
      <p className="mt-1 text-xs text-slate-400">
        Add one keyword to track it alone, or several to build a bundle.
      </p>
    </div>
  );
}
