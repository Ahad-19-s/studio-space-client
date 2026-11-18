export default function LoginPage() {
  return (
    <main className="mx-auto w-full max-w-md flex-1 px-4 py-16">
      <h1 className="text-2xl font-bold tracking-tight">Login</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Sign in to your StudioSpace account.
      </p>
      {/* TODO: email/password form -> authClient.signIn.email(...) */}
    </main>
  );
}
