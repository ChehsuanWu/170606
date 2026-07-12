import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const alert = await prisma.alert.findUnique({
    where: { id },
    include: { savedSearch: { select: { userId: true } } },
  });

  if (!alert || alert.savedSearch.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updated = await prisma.alert.update({
    where: { id },
    data: { readAt: new Date() },
  });

  return NextResponse.json({ alert: updated });
}
