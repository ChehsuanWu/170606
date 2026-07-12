import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { languageLabel, mediaTypeLabel } from "@/lib/constants";
import { DeleteSubscriptionButton } from "@/components/delete-subscription-button";

export default async function SubscriptionsPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/subscriptions");
  }

  const subscriptions = await prisma.savedSearch.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { alerts: true } } },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Your subscriptions</h1>
          <p className="mt-1 text-sm text-slate-500">
            Keyword alerts, alone or bundled, matched against incoming coverage.
          </p>
        </div>
        <Link
          href="/subscriptions/new"
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          New subscription
        </Link>
      </div>

      {subscriptions.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
          You don&apos;t have any subscriptions yet.{" "}
          <Link href="/subscriptions/new" className="font-medium text-slate-900 underline">
            Create one
          </Link>{" "}
          or save a search from the search page.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {subscriptions.map((sub) => (
            <div key={sub.id} className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold text-slate-900">{sub.name}</h2>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        sub.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {sub.isActive ? "Active" : "Paused"}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-400">
                    {sub._count.alerts} matched article{sub._count.alerts === 1 ? "" : "s"} ·{" "}
                    {sub.frequency.charAt(0) + sub.frequency.slice(1).toLowerCase()} notifications
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Link
                    href={`/subscriptions/${sub.id}/edit`}
                    className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Edit
                  </Link>
                  <DeleteSubscriptionButton id={sub.id} />
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {sub.keywords.map((k) => (
                  <span key={k} className="rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-700">
                    {k}
                  </span>
                ))}
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                  Match: {sub.matchType === "ANY" ? "Any keyword" : "All keywords"}
                </span>
              </div>

              {(sub.places.length > 0 || sub.languages.length > 0 || sub.mediaTypes.length > 0) && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {sub.places.map((p) => (
                    <span key={p} className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700">
                      {p}
                    </span>
                  ))}
                  {sub.languages.map((l) => (
                    <span key={l} className="rounded-full bg-purple-50 px-2 py-0.5 text-xs text-purple-700">
                      {languageLabel(l)}
                    </span>
                  ))}
                  {sub.mediaTypes.map((m) => (
                    <span key={m} className="rounded-full bg-slate-50 px-2 py-0.5 text-xs text-slate-600 border border-slate-200">
                      {mediaTypeLabel(m)}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
