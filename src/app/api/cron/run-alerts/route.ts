import { NextResponse } from "next/server";
import { runAlertMatching } from "@/lib/alert-matching";

// Intended to be hit by a scheduler (e.g. Vercel Cron) on a fixed interval,
// e.g. every few minutes for INSTANT subscriptions, with DAILY/WEEKLY
// digests reserved for a slower schedule in a production deployment.
// Vercel Cron automatically sends `Authorization: Bearer $CRON_SECRET`
// when a CRON_SECRET env var is configured on the project.
export async function GET(request: Request) {
  const auth = request.headers.get("authorization");
  const expected = process.env.CRON_SECRET ? `Bearer ${process.env.CRON_SECRET}` : null;

  if (!expected || auth !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await runAlertMatching();
  return NextResponse.json(result);
}
