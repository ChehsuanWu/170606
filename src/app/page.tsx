"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { SearchCriteriaFilters, type SearchCriteria } from "@/components/search-criteria-filters";
import { ArticleCard, type ArticleResult } from "@/components/article-card";

const EMPTY_CRITERIA: SearchCriteria = {
  keywords: [],
  matchType: "ANY",
  places: [],
  languages: [],
  mediaTypes: [],
};

type SearchResponse = {
  total: number;
  totalPages: number;
  articles: ArticleResult[];
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function SearchPage() {
  const { data: session } = useSession();

  const [q, setQ] = useState("");
  const [criteria, setCriteria] = useState<SearchCriteria>(EMPTY_CRITERIA);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);

  function updateQ(next: string) {
    setQ(next);
    setPage(1);
  }
  function updateCriteria(next: SearchCriteria) {
    setCriteria(next);
    setPage(1);
  }
  function updateDateFrom(next: string) {
    setDateFrom(next);
    setPage(1);
  }
  function updateDateTo(next: string) {
    setDateTo(next);
    setPage(1);
  }

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (criteria.keywords.length) params.set("keywords", criteria.keywords.join(","));
    params.set("matchType", criteria.matchType);
    if (criteria.places.length) params.set("places", criteria.places.join(","));
    if (criteria.languages.length) params.set("languages", criteria.languages.join(","));
    if (criteria.mediaTypes.length) params.set("mediaTypes", criteria.mediaTypes.join(","));
    if (dateFrom) params.set("dateFrom", dateFrom);
    if (dateTo) params.set("dateTo", dateTo);
    params.set("page", String(page));
    return params.toString();
  }, [q, criteria, dateFrom, dateTo, page]);

  const { data, isLoading } = useSWR<SearchResponse>(`/api/search?${queryString}`, fetcher, {
    keepPreviousData: true,
  });

  const results = data?.articles ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const saveSearchHref = `/subscriptions/new?${queryString}`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Search global media coverage</h1>
        <p className="mt-1 text-sm text-slate-500">
          Search across newspapers, magazines, TV, radio, online news, blogs, and social media by
          keyword, place, language, media type, and time.
        </p>
      </div>

      <div className="mb-6">
        <input
          value={q}
          onChange={(e) => updateQ(e.target.value)}
          placeholder="Search article titles, summaries, and content…"
          className="w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-sm shadow-sm focus:border-slate-500 focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="flex flex-col gap-5 rounded-lg border border-slate-200 bg-white p-4 h-fit">
          <SearchCriteriaFilters criteria={criteria} onChange={updateCriteria} />

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Time range</label>
            <div className="flex flex-col gap-2">
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => updateDateFrom(e.target.value)}
                className="rounded-md border border-slate-300 px-2 py-1.5 text-sm"
              />
              <input
                type="date"
                value={dateTo}
                onChange={(e) => updateDateTo(e.target.value)}
                className="rounded-md border border-slate-300 px-2 py-1.5 text-sm"
              />
            </div>
          </div>

          {session?.user ? (
            <Link
              href={saveSearchHref}
              className="rounded-md bg-slate-900 px-3 py-2 text-center text-sm font-medium text-white hover:bg-slate-700"
            >
              Save as subscription
            </Link>
          ) : (
            <Link
              href={`/login?callbackUrl=${encodeURIComponent(saveSearchHref)}`}
              className="rounded-md border border-slate-300 px-3 py-2 text-center text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Sign in to subscribe
            </Link>
          )}
        </aside>

        <div>
          <div className="mb-3 flex items-center justify-between text-sm text-slate-500">
            <span>{isLoading ? "Searching…" : `${total} result${total === 1 ? "" : "s"}`}</span>
          </div>

          <div className="flex flex-col gap-3">
            {results.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
            {!isLoading && results.length === 0 && (
              <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
                No articles match these criteria. Try widening your filters.
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="rounded-md border border-slate-300 px-3 py-1.5 text-sm disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-sm text-slate-500">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="rounded-md border border-slate-300 px-3 py-1.5 text-sm disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
