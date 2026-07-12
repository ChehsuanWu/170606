import { redirect, notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { SubscriptionForm, type SubscriptionFormValue } from "@/components/subscription-form";

export default async function EditSubscriptionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const { id } = await params;
  if (!session?.user) {
    redirect(`/login?callbackUrl=/subscriptions/${id}/edit`);
  }

  const subscription = await prisma.savedSearch.findUnique({ where: { id } });
  if (!subscription || subscription.userId !== session.user.id) {
    notFound();
  }

  const initial: SubscriptionFormValue = {
    name: subscription.name,
    keywords: subscription.keywords,
    matchType: subscription.matchType,
    places: subscription.places,
    languages: subscription.languages,
    mediaTypes: subscription.mediaTypes,
    frequency: subscription.frequency,
    isActive: subscription.isActive,
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-semibold text-slate-900">Edit subscription</h1>
      <div className="mt-6">
        <SubscriptionForm mode="edit" subscriptionId={subscription.id} initial={initial} />
      </div>
    </div>
  );
}
