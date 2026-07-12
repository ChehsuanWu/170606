"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function RunMonitoringButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [lastResult, setLastResult] = useState<string | null>(null);

  async function handleRun() {
    setPending(true);
    setLastResult(null);
    const res = await fetch("/api/subscriptions/run", { method: "POST" });
    const data = await res.json();
    setPending(false);

    if (res.ok) {
      setLastResult(`Checked ${data.subscriptionsProcessed} subscription(s), found ${data.newAlerts} new match(es), sent ${data.emailsSent} email(s).`);
      router.refresh();
    } else {
      setLastResult(data.error ?? "Something went wrong.");
    }
  }

  return (
    <div className="flex flex-col items-end gap-1.5">
      <button
        onClick={handleRun}
        disabled={pending}
        className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
      >
        {pending ? "Checking…" : "Check for new matches now"}
      </button>
      {lastResult && <p className="max-w-xs text-right text-xs text-slate-500">{lastResult}</p>}
    </div>
  );
}
