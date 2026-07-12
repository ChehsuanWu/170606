import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { mediaTypeLabel } from "@/lib/constants";
import { RunMonitoringButton } from "@/components/run-monitoring-button";
import { MarkReadButton } from "@/components/mark-read-button";

function formatDateTime(date: Date) {
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function AlertsPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/alerts");
  }

  const alerts = await prisma.alert.findMany({
    where: { savedSearch: { userId: session.user.id } },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      savedSearch: { select: { id: true, name: true } },
      article: { include: { source: { select: { name: true, mediaType: true } } } },
    },
  });

  const emailLogs = await prisma.emailLog.findMany({
    where: { savedSearch: { userId: session.user.id } },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  const unreadCount = alerts.filter((a) => !a.readAt).length;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Alerts</h1>
          <p className="mt-1 text-sm text-slate-500">
            {unreadCount > 0
              ? `${unreadCount} unread match${unreadCount === 1 ? "" : "es"} across your subscriptions.`
              : "You're all caught up."}
          </p>
        </div>
        <RunMonitoringButton />
      </div>

      {alerts.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
          No alerts yet. Create a{" "}
          <Link href="/subscriptions/new" className="font-medium text-slate-900 underline">
            subscription
          </Link>{" "}
          and click &quot;Check for new matches now&quot;.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`rounded-lg border p-4 ${
                alert.readAt ? "border-slate-200 bg-white" : "border-slate-900/20 bg-amber-50/40"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-medium text-slate-500">
                    Matched: {alert.savedSearch.name}
                  </p>
                  <h3 className="mt-1 text-sm font-semibold text-slate-900">
                    <a href={alert.article.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {alert.article.title}
                    </a>
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    {alert.article.source.name} · {mediaTypeLabel(alert.article.source.mediaType)} ·{" "}
                    {formatDateTime(alert.createdAt)}
                  </p>
                </div>
                {!alert.readAt && <MarkReadButton id={alert.id} />}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-10">
        <h2 className="text-lg font-semibold text-slate-900">Email log</h2>
        <p className="mt-1 text-sm text-slate-500">
          Alert emails are logged here. Configure SMTP_HOST in the environment to send them for real.
        </p>
        {emailLogs.length === 0 ? (
          <p className="mt-3 text-sm text-slate-400">No emails yet.</p>
        ) : (
          <div className="mt-3 flex flex-col gap-2">
            {emailLogs.map((log) => (
              <div key={log.id} className="rounded-md border border-slate-200 bg-white p-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-900">{log.subject}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      log.status === "SENT"
                        ? "bg-green-100 text-green-700"
                        : log.status === "FAILED"
                          ? "bg-red-100 text-red-700"
                          : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {log.status}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-slate-400">
                  To {log.to} · {formatDateTime(log.createdAt)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
