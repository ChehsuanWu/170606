import { prisma } from "@/lib/prisma";
import { buildArticleWhere } from "@/lib/article-query";
import { sendEmail } from "@/lib/email";
import { mediaTypeLabel } from "@/lib/constants";

const MAX_NEW_ARTICLES_PER_RUN = 50;
// On a subscription's first run there is no lastRunAt yet. Look back this far
// so newly created subscriptions immediately surface relevant matches from
// the existing archive instead of only catching articles published from now on.
const INITIAL_LOOKBACK_DAYS = 60;

export async function runAlertMatching({ userId }: { userId?: string } = {}) {
  const subscriptions = await prisma.savedSearch.findMany({
    where: { isActive: true, ...(userId ? { userId } : {}) },
    include: { user: { select: { email: true, name: true } } },
  });

  let totalNewAlerts = 0;
  let totalEmails = 0;

  for (const subscription of subscriptions) {
    const cutoff =
      subscription.lastRunAt ??
      new Date(Date.now() - INITIAL_LOOKBACK_DAYS * 24 * 60 * 60 * 1000);

    const where = buildArticleWhere({
      keywords: subscription.keywords,
      matchType: subscription.matchType,
      places: subscription.places,
      languages: subscription.languages,
      mediaTypes: subscription.mediaTypes,
      dateFrom: cutoff,
    });

    const matches = await prisma.article.findMany({
      where,
      orderBy: { publishedAt: "asc" },
      take: MAX_NEW_ARTICLES_PER_RUN,
      include: { source: { select: { name: true, mediaType: true } } },
    });

    if (matches.length > 0) {
      const created = await prisma.alert.createMany({
        data: matches.map((article) => ({
          savedSearchId: subscription.id,
          articleId: article.id,
        })),
        skipDuplicates: true,
      });
      totalNewAlerts += created.count;

      if (created.count > 0) {
        const newAlerts = await prisma.alert.findMany({
          where: { savedSearchId: subscription.id, emailedAt: null },
          include: { article: { include: { source: true } } },
          orderBy: { createdAt: "asc" },
        });

        if (newAlerts.length > 0) {
          const listHtml = newAlerts
            .map(
              (alert) =>
                `<li><a href="${alert.article.url}">${alert.article.title}</a> — ${alert.article.source.name} (${mediaTypeLabel(alert.article.source.mediaType)})</li>`
            )
            .join("");

          const result = await sendEmail({
            to: subscription.user.email,
            subject: `${newAlerts.length} new match${newAlerts.length === 1 ? "" : "es"} for "${subscription.name}"`,
            body: `<p>Your subscription <strong>${subscription.name}</strong> found ${newAlerts.length} new article(s):</p><ul>${listHtml}</ul>`,
            savedSearchId: subscription.id,
          });

          if (result.status !== "FAILED") {
            await prisma.alert.updateMany({
              where: { id: { in: newAlerts.map((a) => a.id) } },
              data: { emailedAt: new Date() },
            });
            totalEmails += 1;
          }
        }
      }
    }

    await prisma.savedSearch.update({
      where: { id: subscription.id },
      data: { lastRunAt: new Date() },
    });
  }

  return {
    subscriptionsProcessed: subscriptions.length,
    newAlerts: totalNewAlerts,
    emailsSent: totalEmails,
  };
}
