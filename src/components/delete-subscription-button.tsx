"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function DeleteSubscriptionButton({ id }: { id: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleDelete() {
    if (!confirm("Delete this subscription? This cannot be undone.")) return;
    setPending(true);
    await fetch(`/api/subscriptions/${id}`, { method: "DELETE" });
    setPending(false);
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      disabled={pending}
      className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
    >
      {pending ? "Deleting…" : "Delete"}
    </button>
  );
}
