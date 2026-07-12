import { languageLabel, mediaTypeLabel } from "@/lib/constants";

export type ArticleResult = {
  id: string;
  title: string;
  summary: string;
  url: string;
  language: string;
  places: string[];
  keywords: string[];
  publishedAt: string;
  source: { name: string; mediaType: string; country: string; language: string };
};

function formatDate(iso: string) {
  const date = new Date(iso);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function ArticleCard({ article }: { article: ArticleResult }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <span className="rounded bg-slate-100 px-2 py-0.5 font-medium text-slate-700">
          {mediaTypeLabel(article.source.mediaType)}
        </span>
        <span>{article.source.name}</span>
        <span aria-hidden>·</span>
        <span>{formatDate(article.publishedAt)}</span>
        <span aria-hidden>·</span>
        <span>{languageLabel(article.language)}</span>
      </div>

      <h3 className="mt-2 text-base font-semibold text-slate-900">
        <a href={article.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
          {article.title}
        </a>
      </h3>
      <p className="mt-1 text-sm text-slate-600">{article.summary}</p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {article.places.map((place) => (
          <span key={place} className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700">
            {place}
          </span>
        ))}
        {article.keywords.map((keyword) => (
          <span key={keyword} className="rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-700">
            {keyword}
          </span>
        ))}
      </div>
    </article>
  );
}
