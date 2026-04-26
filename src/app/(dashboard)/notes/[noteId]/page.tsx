import { Editor } from "living_archive/components/editor/Editor";
import { authOptions } from "living_archive/lib/auth";
import { prisma } from "living_archive/lib/prisma";
import { normalizeEditorContent } from "living_archive/lib/tiptap";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";

type PageProps = {
  params: Promise<{ noteId: string }>;
};

export default async function NoteDetailPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  const { noteId } = await params;
  const note = await prisma.note.findFirst({
    where: { id: noteId, userId: session.user.id },
  });

  if (!note) {
    notFound();
  }

  return (
    <div className="space-y-4">
      <section className="glass-card rounded-[2rem] p-5 sm:p-6">
        <p
          className="text-xs uppercase tracking-[0.3em]"
          style={{ color: "var(--muted)" }}
        >
          Note editor
        </p>
        <h1
          className="mt-2 font-serif text-3xl sm:text-4xl break-words"
          style={{ color: "var(--foreground)" }}
        >
          Edit in place, save automatically.
        </h1>
        <p
          className="mt-2 max-w-2xl text-sm leading-6 break-words"
          style={{ color: "var(--muted)" }}
        >
          Rich text content is stored in Prisma as Tiptap JSON, with version
          history captured whenever the note updates.
        </p>
      </section>

      <Editor
        note={{
          id: note.id,
          title: note.title,
          emoji: note.emoji,
          content: normalizeEditorContent(note.content),
          updatedAt: note.updatedAt.toISOString(),
          wordCount: note.wordCount,
          characterCount: note.characterCount,
        }}
      />
    </div>
  );
}
