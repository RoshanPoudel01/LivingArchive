type PageProps = {
  params: Promise<{ tagId: string }>;
};

export default async function TagPage({ params }: PageProps) {
  const { tagId } = await params;

  return (
    <div className="glass-card rounded-[2rem] p-6 sm:p-8">
      <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Tag</p>
      <h1 className="mt-2 font-serif text-3xl text-stone-950">Notes tagged {tagId}.</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">Tag filtering can be expanded here without changing the route shape.</p>
    </div>
  );
}