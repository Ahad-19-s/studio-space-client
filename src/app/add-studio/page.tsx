export default function AddStudioPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
      <h1 className="text-2xl font-bold tracking-tight">Add Studio</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        List a new studio on StudioSpace.
      </p>
      {/* TODO: studio form -> POST /api/studios (protected route) */}
    </main>
  );
}
