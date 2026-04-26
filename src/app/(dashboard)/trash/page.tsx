import { authOptions } from "living_archive/lib/auth";
import { prisma } from "living_archive/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { TrashActions } from "living_archive/components/notes/TrashActions";

export default async function TrashPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  const notes = await prisma.note.findMany({
    where: { userId: session.user.id, isTrashed: true },
    orderBy: { trashedAt: "desc" },
  });

  return (
    <div className="space-y-5">
      <section className="glass-card rounded-[2rem] p-5 sm:p-6">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em]" style={{ color: "var(--muted)" }}>Trash</p>
          <h1 className="font-serif text-3xl sm:text-4xl" style={{ color: "var(--foreground)" }}>Deleted notes live here.</h1>
          <p className="max-w-2xl text-sm leading-6" style={{ color: "var(--muted)" }}>Notes in trash can be restored or permanently deleted.</p>
        </div>
      </section>

      {notes.length === 0 ? (
        <section className="glass-card rounded-[2rem] p-8 text-center">
          <p className="text-lg font-medium" style={{ color: "var(--foreground)" }}>Trash is empty</p>
          <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>No notes have been deleted yet.</p>
        </section>
      ) : (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {notes.map((note) => (
            <div
              key={note.id}
              className="note-card glass-card rounded-[1.8rem] p-5 transition hover:shadow-xl flex flex-col"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-2xl">{note.emoji ?? "📝"}</p>
                  <h2 className="mt-3 text-xl font-semibold" style={{ color: "var(--foreground)" }}>
                    {note.title}
                  </h2>
                </div>
              </div>

              <p className="mt-4 mb-4 line-clamp-3 text-sm leading-6 flex-1" style={{ color: "var(--muted)" }}>
                {note.plainText ?? "No preview available."}
              </p>

              <TrashActions noteId={note.id} />
            </div>
          ))}
        </section>
      )}
    </div>
  );
}