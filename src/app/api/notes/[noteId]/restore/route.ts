import { authOptions } from "living_archive/lib/auth";
import { prisma } from "living_archive/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

type Params = {
  params: Promise<{ noteId: string }>;
};

export async function POST(_: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { noteId } = await params;
  const restored = await prisma.note.updateMany({
    where: { id: noteId, userId: session.user.id },
    data: { isTrashed: false, trashedAt: null },
  });

  return NextResponse.json(restored);
}