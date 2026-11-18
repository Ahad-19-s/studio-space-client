import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-zinc-600 dark:text-zinc-400 sm:flex-row">
        <p>© StudioSpace</p>
        <div className="flex items-center gap-5">
          <Link href="/studios" className="hover:text-zinc-900 dark:hover:text-zinc-100">
            Studios
          </Link>
          <Link href="/add-studio" className="hover:text-zinc-900 dark:hover:text-zinc-100">
            Add Studio
          </Link>
          <Link href="/my-bookings" className="hover:text-zinc-900 dark:hover:text-zinc-100">
            My Bookings
          </Link>
        </div>
      </div>
    </footer>
  );
}
