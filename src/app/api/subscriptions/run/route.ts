import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { runAlertMatching } from "@/lib/alert-matching";

// Lets a signed-in user manually trigger matching for their own
// subscriptions, so the alert pipeline can be demoed without waiting for
// the scheduled cron job.
export async function POST() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await runAlertMatching({ userId: session.user.id });
  return NextResponse.json(result);
}
