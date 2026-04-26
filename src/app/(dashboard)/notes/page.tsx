import { MoveToTrashButton } from "living_archive/components/notes/MoveToTrashButton";
import { NewNoteButton } from "living_archive/components/notes/NewNoteButton";
import { authOptions } from "living_archive/lib/auth";
import { prisma } from "living_archive/lib/prisma";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function NotesPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  const notes = await prisma.note.findMany({
    where: { userId: session.user.id, isTrashed: false },
    orderBy: [{ isPinned: "desc" }, { updatedAt: "desc" }],
  });

  return (
    <div className="space-y-5">
      <section className="glass-card rounded-[2rem] p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2 min-w-0 flex-1">
            <p
              className="text-xs uppercase tracking-[0.3em]"
              style={{ color: "var(--muted)" }}
            >
              All notes
            </p>
            <h1
              className="font-serif text-3xl sm:text-4xl break-words"
              style={{ color: "var(--foreground)" }}
            >
              Your working memory, organized.
            </h1>
            <p
              className="max-w-2xl text-sm leading-6 break-words"
              style={{ color: "var(--muted)" }}
            >
              Jump into a draft, create a new note, or review recent edits on a
              responsive layout built for phones first.
            </p>
          </div>

          <NewNoteButton />
        </div>
      </section>

      {notes.length === 0 ? (
        <section className="glass-card rounded-[2rem] p-8 text-center">
          <p
            className="text-lg font-medium"
            style={{ color: "var(--foreground)" }}
          >
            No notes yet
          </p>
          <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
            Create your first note and start drafting ideas with rich text.
          </p>
          <div className="mt-6 flex justify-center">
            <NewNoteButton />
          </div>
        </section>
      ) : (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {notes.map((note) => (
            <div
              key={note.id}
              className="note-card glass-card group relative rounded-[1.8rem] p-5 transition hover:-translate-y-0.5 hover:shadow-xl flex flex-col"
            >
              <Link
                href={`/notes/${note.id}`}
                className="absolute inset-0 z-0 rounded-[1.8rem]"
                aria-label={`View ${note.title}`}
              />

              <div className="flex items-start justify-between gap-3 relative z-10 pointer-events-none ">
                <div className="min-w-0 flex-1">
                  <h2
                    className="mt-3 text-xl font-semibold [word-break:break-all] "
                    style={{ color: "var(--foreground)" }}
                  >
                    {note.title}
                  </h2>
                </div>
                {note.isPinned ? (
                  <span
                    className="rounded-full px-3 py-1 text-xs font-medium text-white"
                    style={{ background: "var(--accent)" }}
                  >
                    Pinned
                  </span>
                ) : null}
              </div>
              <p
                className="mt-4 mb-4 line-clamp-4 text-sm leading-6 flex-1 relative z-10 pointer-events-none [word-break:break-all]"
                style={{ color: "var(--muted)" }}
              >
                {note.plainText ?? "Start writing..."}
              </p>

              <div
                className="mt-auto pt-2 flex items-center justify-between text-xs uppercase tracking-[0.25em] relative z-20"
                style={{ color: "var(--muted)" }}
              >
                <div className="pointer-events-none flex gap-4">
                  <span>{note.wordCount} words</span>
                  <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                </div>
                <MoveToTrashButton noteId={note.id} />
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
