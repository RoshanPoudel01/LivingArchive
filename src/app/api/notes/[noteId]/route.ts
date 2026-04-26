import { authOptions } from "living_archive/lib/auth";
import { prisma } from "living_archive/lib/prisma";
import { countWords, extractPlainText, normalizeEditorContent } from "living_archive/lib/tiptap";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

type Params = {
  params: Promise<{ noteId: string }>;
};

async function getOwnedNote(noteId: string, userId: string) {
  return prisma.note.findFirst({ where: { id: noteId, userId } });
}

export async function GET(_: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { noteId } = await params;
  const note = await getOwnedNote(noteId, session.user.id);

  if (!note) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(note);
}

export async function PATCH(request: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { noteId } = await params;
  const existing = await getOwnedNote(noteId, session.user.id);

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await request.json();
  const title = typeof body.title === "string" && body.title.trim() ? body.title.trim() : existing.title;
  const content = body.content ? normalizeEditorContent(body.content) : normalizeEditorContent(existing.content);
  const plainText = extractPlainText(content);

  const updated = await prisma.$transaction(async (transaction) => {
    await transaction.noteVersion.create({
      data: {
        noteId: existing.id,
        title: existing.title,
        content: normalizeEditorContent(existing.content),
        plainText: existing.plainText,
      },
    });

    return transaction.note.update({
      where: { id: existing.id },
      data: {
        title,
        content,
        plainText,
        wordCount: countWords(plainText),
        characterCount: plainText.length,
        emoji: body.emoji === null ? null : typeof body.emoji === "string" ? body.emoji : existing.emoji,
        coverImage: body.coverImage === null ? null : typeof body.coverImage === "string" ? body.coverImage : existing.coverImage,
        notebookId: body.notebookId === null ? null : typeof body.notebookId === "string" ? body.notebookId : existing.notebookId,
        isPinned: typeof body.isPinned === "boolean" ? body.isPinned : existing.isPinned,
        isArchived: typeof body.isArchived === "boolean" ? body.isArchived : existing.isArchived,
        isTrashed: typeof body.isTrashed === "boolean" ? body.isTrashed : existing.isTrashed,
        trashedAt: typeof body.isTrashed === "boolean" && body.isTrashed ? new Date() : body.isTrashed === false ? null : existing.trashedAt,
      },
    });
  });

  return NextResponse.json(updated);
}

export async function DELETE(request: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { noteId } = await params;
  const note = await getOwnedNote(noteId, session.user.id);

  if (!note) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const url = new URL(request.url);
  const permanent = url.searchParams.get("permanent") === "true";

  if (permanent) {
    await prisma.note.delete({ where: { id: note.id } });
    return NextResponse.json({ success: true });
  }

  const trashed = await prisma.note.update({
    where: { id: note.id },
    data: {
      isTrashed: true,
      trashedAt: new Date(),
    },
  });

  return NextResponse.json(trashed);
}