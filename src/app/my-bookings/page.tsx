export default function MyBookingsPage() {
  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10">
      <h1 className="text-2xl font-bold tracking-tight">My Bookings</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Studios you have booked.
      </p>
      {/* TODO: fetch the logged-in user&apos;s bookings */}
    </main>
  );
}
