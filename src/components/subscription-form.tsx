"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SearchCriteriaFilters, type SearchCriteria } from "@/components/search-criteria-filters";
import { FREQUENCY_OPTIONS } from "@/lib/constants";

export type SubscriptionFormValue = SearchCriteria & {
  name: string;
  frequency: "INSTANT" | "DAILY" | "WEEKLY";
  isActive: boolean;
};

export function SubscriptionForm({
  mode,
  subscriptionId,
  initial,
}: {
  mode: "create" | "edit";
  subscriptionId?: string;
  initial: SubscriptionFormValue;
}) {
  const router = useRouter();
  const [value, setValue] = useState<SubscriptionFormValue>(initial);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const criteria: SearchCriteria = {
    keywords: value.keywords,
    matchType: value.matchType,
    places: value.places,
    languages: value.languages,
    mediaTypes: value.mediaTypes,
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (value.keywords.length === 0) {
      setError("Add at least one keyword.");
      return;
    }

    setSubmitting(true);
    const url = mode === "create" ? "/api/subscriptions" : `/api/subscriptions/${subscriptionId}`;
    const method = mode === "create" ? "POST" : "PATCH";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(value),
    });

    setSubmitting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Something went wrong.");
      return;
    }

    router.push("/subscriptions");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Subscription name
        </label>
        <input
          required
          value={value.name}
          onChange={(e) => setValue({ ...value, name: e.target.value })}
          placeholder="e.g. AI Regulation Watch"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
        />
      </div>

      <SearchCriteriaFilters
        criteria={criteria}
        onChange={(next) => setValue({ ...value, ...next })}
      />

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Notification frequency
        </label>
        <select
          value={value.frequency}
          onChange={(e) =>
            setValue({ ...value, frequency: e.target.value as SubscriptionFormValue["frequency"] })
          }
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        >
          {FREQUENCY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={value.isActive}
          onChange={(e) => setValue({ ...value, isActive: e.target.checked })}
          className="h-4 w-4 rounded border-slate-300"
        />
        Active
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-fit rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
      >
        {submitting ? "Saving…" : mode === "create" ? "Create subscription" : "Save changes"}
      </button>
    </form>
  );
}
