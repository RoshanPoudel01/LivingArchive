import { authOptions } from "living_archive/lib/auth";
import { prisma } from "living_archive/lib/prisma";
import { countWords, extractPlainText, normalizeEditorContent } from "living_archive/lib/tiptap";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

// GET /api/notes — fetch the logged-in user's notes
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const notebookId = searchParams.get("notebookId");
  const archived = searchParams.get("archived") === "true";
  const trashed = searchParams.get("trashed") === "true";

  const notes = await prisma.note.findMany({
    where: {
      userId: session.user.id,
      ...(notebookId ? { notebookId } : {}),
      isArchived: archived,
      isTrashed: trashed,
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(notes);
}

// POST /api/notes — create a new note
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const title = typeof body.title === "string" && body.title.trim() ? body.title.trim() : "Untitled note";
  const content = normalizeEditorContent(body.content);
  const plainText = extractPlainText(content);

  const note = await prisma.note.create({
    data: {
      title,
      content,
      plainText,
      wordCount: countWords(plainText),
      characterCount: plainText.length,
      emoji: typeof body.emoji === "string" ? body.emoji : null,
      notebookId: typeof body.notebookId === "string" ? body.notebookId : null,
      userId: session.user.id,
    },
  });

  return NextResponse.json(note, { status: 201 });
}