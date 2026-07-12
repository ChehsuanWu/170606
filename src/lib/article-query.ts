import { Prisma } from "@/generated/prisma/client";

export type ArticleFilters = {
  /** Free-text search across title, summary and content. */
  q?: string;
  /** Keyword bundle to match against the article's keyword tags. */
  keywords?: string[];
  matchType?: "ANY" | "ALL";
  places?: string[];
  languages?: string[];
  mediaTypes?: string[];
  dateFrom?: Date;
  dateTo?: Date;
};

export function buildArticleWhere(filters: ArticleFilters): Prisma.ArticleWhereInput {
  const where: Prisma.ArticleWhereInput = {};
  const and: Prisma.ArticleWhereInput[] = [];

  if (filters.q && filters.q.trim().length > 0) {
    const q = filters.q.trim();
    and.push({
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { summary: { contains: q, mode: "insensitive" } },
        { content: { contains: q, mode: "insensitive" } },
        { keywords: { has: q.toLowerCase() } },
      ],
    });
  }

  const keywords = (filters.keywords ?? []).map((k) => k.trim().toLowerCase()).filter(Boolean);
  if (keywords.length > 0) {
    if (filters.matchType === "ALL") {
      and.push({ AND: keywords.map((k) => ({ keywords: { has: k } })) });
    } else {
      and.push({ keywords: { hasSome: keywords } });
    }
  }

  if (filters.places && filters.places.length > 0) {
    and.push({ places: { hasSome: filters.places } });
  }

  if (filters.languages && filters.languages.length > 0) {
    and.push({ language: { in: filters.languages } });
  }

  if (filters.mediaTypes && filters.mediaTypes.length > 0) {
    and.push({
      source: {
        is: { mediaType: { in: filters.mediaTypes as Prisma.EnumMediaTypeFilter["in"] } },
      },
    });
  }

  if (filters.dateFrom || filters.dateTo) {
    and.push({
      publishedAt: {
        ...(filters.dateFrom ? { gte: filters.dateFrom } : {}),
        ...(filters.dateTo ? { lte: filters.dateTo } : {}),
      },
    });
  }

  if (and.length > 0) {
    where.AND = and;
  }

  return where;
}
