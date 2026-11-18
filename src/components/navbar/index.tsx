import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-black/80">
      <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-bold tracking-tight">
          StudioSpace
        </Link>

        <div className="flex items-center gap-5 text-sm font-medium">
          <Link href="/studios" className="hover:text-zinc-600 dark:hover:text-zinc-300">
            Studios
          </Link>
          <Link href="/add-studio" className="hover:text-zinc-600 dark:hover:text-zinc-300">
            Add Studio
          </Link>
          <Link href="/my-listings" className="hover:text-zinc-600 dark:hover:text-zinc-300">
            My Listings
          </Link>
          <Link href="/my-bookings" className="hover:text-zinc-600 dark:hover:text-zinc-300">
            My Bookings
          </Link>
          <Link
            href="/login"
            className="rounded-full bg-zinc-900 px-4 py-1.5 text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            Login
          </Link>
        </div>
      </nav>
    </header>
  );
}
