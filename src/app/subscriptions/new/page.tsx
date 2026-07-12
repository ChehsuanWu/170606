import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { NewSubscriptionForm } from "@/components/new-subscription-form";

export default async function NewSubscriptionPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/subscriptions/new");
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-semibold text-slate-900">New subscription</h1>
      <p className="mt-1 text-sm text-slate-500">
        Track a keyword alone, or bundle several together, with optional place, language, and
        media type filters.
      </p>
      <div className="mt-6">
        <NewSubscriptionForm />
      </div>
    </div>
  );
}
