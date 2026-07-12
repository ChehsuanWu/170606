import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildArticleWhere } from "@/lib/article-query";

const PAGE_SIZE = 10;

function splitParam(value: string | null): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const q = searchParams.get("q") ?? undefined;
  const keywords = splitParam(searchParams.get("keywords"));
  const matchType = searchParams.get("matchType") === "ALL" ? "ALL" : "ANY";
  const places = splitParam(searchParams.get("places"));
  const languages = splitParam(searchParams.get("languages"));
  const mediaTypes = splitParam(searchParams.get("mediaTypes"));
  const dateFromRaw = searchParams.get("dateFrom");
  const dateToRaw = searchParams.get("dateTo");
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);

  const dateFrom = dateFromRaw ? new Date(dateFromRaw) : undefined;
  const dateTo = dateToRaw ? new Date(dateToRaw) : undefined;

  const where = buildArticleWhere({
    q,
    keywords,
    matchType,
    places,
    languages,
    mediaTypes,
    dateFrom: dateFrom && !isNaN(dateFrom.getTime()) ? dateFrom : undefined,
    dateTo: dateTo && !isNaN(dateTo.getTime()) ? dateTo : undefined,
  });

  const [total, articles] = await Promise.all([
    prisma.article.count({ where }),
    prisma.article.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        source: {
          select: { name: true, mediaType: true, country: true, language: true },
        },
      },
    }),
  ]);

  return NextResponse.json({
    total,
    page,
    pageSize: PAGE_SIZE,
    totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
    articles,
  });
}
