// This page reads per-request data (params), so it blocks instead of
// being prerendered into a static shell.
export const instant = false;

export default async function EditStudioPage({
  params,
}: PageProps<"/studios/edit/[id]">) {
  const { id } = await params;

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
      <h1 className="text-2xl font-bold tracking-tight">Edit Studio</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">Studio ID: {id}</p>
      {/* TODO: load studio data and render the edit form */}
    </main>
  );
}
