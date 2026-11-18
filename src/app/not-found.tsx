import Link from "next/link";
import { Aperture, Home, SearchX } from "lucide-react";

// Custom 404 — cinematic "clapperboard" treatment with an aperture
// illustration and a clear way back home.
export default function NotFound() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-20">
      <div className="w-full max-w-lg text-center">
        {/* Aperture / spotlight illustration */}
        <div className="relative mx-auto flex size-32 items-center justify-center">
          <span className="spotlight absolute inset-0 -z-10" />
          <span className="absolute inset-0 rounded-full border-2 border-dashed border-primary/40" />
          <span className="absolute inset-3 rounded-full border border-border bg-card" />
          <Aperture className="size-14 text-primary" aria-hidden />
        </div>

        <p className="eyebrow mt-8">Scene missing</p>
        <h1 className="mt-3 font-display text-7xl leading-none tracking-wide text-primary uppercase sm:text-8xl">
          404
        </h1>
        <h2 className="mt-4 font-display text-2xl tracking-wide uppercase sm:text-3xl">
          This set doesn't exist
        </h2>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
          The page you're looking for was never built, was moved, or the
          listing has been taken off the lot.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-6 text-sm font-bold tracking-wide text-primary-foreground uppercase transition-colors hover:bg-primary/90"
          >
            <Home className="size-4" /> Return to Home
          </Link>
          <Link
            href="/studios"
            className="inline-flex h-11 items-center gap-2 rounded-lg border border-border px-6 text-sm font-bold tracking-wide uppercase transition-colors hover:border-primary hover:text-primary"
          >
            <SearchX className="size-4" /> Browse Studios
          </Link>
        </div>
      </div>
    </main>
  );
}
