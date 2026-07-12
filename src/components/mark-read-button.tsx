"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function MarkReadButton({ id }: { id: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleClick() {
    setPending(true);
    await fetch(`/api/alerts/${id}`, { method: "PATCH" });
    setPending(false);
    router.refresh();
  }

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      className="rounded-md border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
    >
      Mark read
    </button>
  );
}
