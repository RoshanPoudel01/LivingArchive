import { authOptions } from "living_archive/lib/auth";
import { prisma } from "living_archive/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

type Params = {
  params: Promise<{ noteId: string }>;
};

export async function GET(_: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { noteId } = await params;
  const versions = await prisma.noteVersion.findMany({
    where: {
      noteId,
      note: { userId: session.user.id },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(versions);
}