export default function NotebooksPage() {
  return (
    <div className="glass-card rounded-[2rem] p-6 sm:p-8">
      <p className="text-xs uppercase tracking-[0.3em]" style={{ color: "var(--muted)" }}>Notebooks</p>
      <h1 className="mt-2 font-serif text-3xl" style={{ color: "var(--foreground)" }}>Notebook grouping is ready for expansion.</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6" style={{ color: "var(--muted)" }}>
        This route is wired and mobile-friendly, so notebook CRUD can be layered in without changing the app shell.
      </p>
    </div>
  );
}