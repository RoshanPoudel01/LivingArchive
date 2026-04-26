import { SignOutButton } from "living_archive/components/auth/SignOutButton";
import { MobileNav } from "living_archive/components/MobileNav";
import { ThemeToggle } from "living_archive/components/ThemeToggle";
import { authOptions } from "living_archive/lib/auth";
import { prisma } from "living_archive/lib/prisma";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

const navItems = [
  {
    href: "/notes",
    label: "Notes",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  // {
  //   href: "/notebooks",
  //   label: "Notebooks",
  //   icon: (
  //     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
  //       <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
  //       <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  //     </svg>
  //   ),
  // },
  // {
  //   href: "/archived",
  //   label: "Archived",
  //   icon: (
  //     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
  //       <polyline points="21 8 21 21 3 21 3 8" />
  //       <rect x="1" y="3" width="22" height="5" />
  //       <line x1="10" y1="12" x2="14" y2="12" />
  //     </svg>
  //   ),
  // },
  {
    href: "/trash",
    label: "Trash",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      </svg>
    ),
  },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  const [noteCount, notebookCount, tagCount, trashCount] = await Promise.all([
    prisma.note.count({ where: { userId: session.user.id, isTrashed: false } }),
    prisma.notebook.count({ where: { userId: session.user.id } }),
    prisma.tag.count({ where: { userId: session.user.id } }),
    prisma.note.count({ where: { userId: session.user.id, isTrashed: true } }),
  ]);

  return (
    <div className="app-shell min-h-screen">
      <div className="mx-auto grid min-h-screen w-full max-w-[1600px] gap-4 p-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:p-6">
        {/* ─── Sidebar ────────────────────────────── */}
        <aside className="glass-card hidden rounded-[2rem] p-5 lg:flex lg:flex-col">
          <div className="mb-8">
            <p
              className="text-xs uppercase tracking-[0.35em]"
              style={{ color: "var(--muted)" }}
            >
              Living Archive
            </p>
            <h1
              className="mt-2 font-serif text-3xl"
              style={{ color: "var(--foreground)" }}
            >
              Notes with depth.
            </h1>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="nav-link group">
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="mt-8 grid grid-cols-2 gap-3">
            <div className="stat-card">
              <p className="stat-label">Notes</p>
              <p className="stat-value">{noteCount}</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Notebooks</p>
              <p className="stat-value">{notebookCount}</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Tags</p>
              <p className="stat-value">{tagCount}</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Trash</p>
              <p className="stat-value">{trashCount}</p>
            </div>
          </div>
        </aside>

        {/* ─── Main content ───────────────────────── */}
        <div className="flex min-h-screen flex-col gap-4">
          <header className="glass-card rounded-[2rem] px-4 py-4 sm:px-6 lg:px-7">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p
                  className="text-xs uppercase tracking-[0.3em]"
                  style={{ color: "var(--muted)" }}
                >
                  Workspace
                </p>
                <h2
                  className="mt-1 text-xl font-semibold sm:text-2xl"
                  style={{ color: "var(--foreground)" }}
                >
                  Hello, {session.user.name ?? session.user.email ?? "friend"}
                </h2>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <div
                  className="hidden rounded-full border px-4 py-2 text-sm md:block"
                  style={{
                    borderColor: "var(--border)",
                    background: "var(--surface)",
                    color: "var(--muted)",
                  }}
                >
                  Auto-saving rich text notes
                </div>

                <ThemeToggle />

                <SignOutButton />

                <MobileNav items={navItems} />
              </div>
            </div>
          </header>

          <main className="flex-1 pb-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
