export default function ArchivedPage() {
  return (
    <div className="glass-card rounded-[2rem] p-6 sm:p-8">
      <p className="text-xs uppercase tracking-[0.3em]" style={{ color: "var(--muted)" }}>Archived</p>
      <h1 className="mt-2 font-serif text-3xl" style={{ color: "var(--foreground)" }}>Archived notes.</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6" style={{ color: "var(--muted)" }}>Archived note support is wired into the shell and note API.</p>
    </div>
  );
}