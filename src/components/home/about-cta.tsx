import Link from "next/link";
import { ArrowRight, Aperture } from "lucide-react";

// Closing call-to-action band + short About Us anchor.
export default function AboutCta() {
  return (
    <section id="about" className="scroll-mt-20">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="spotlight overflow-hidden rounded-3xl border border-border bg-card px-6 py-14 text-center sm:px-12">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <Aperture className="size-7" aria-hidden />
          </div>

          <p className="eyebrow mt-6">About StudioSpace</p>
          <h2 className="mx-auto mt-3 max-w-3xl font-display text-4xl leading-[1.05] tracking-wide uppercase sm:text-5xl">
            The marketplace built for people who make things
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            StudioSpace connects photographers, filmmakers, podcasters and
            musicians with the rooms their work needs — and gives studio owners
            a fair, transparent way to rent their space by the hour. No agents,
            no opaque quotes, no surprise fees.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/studios"
              className="inline-flex h-12 items-center gap-2 rounded-lg bg-primary px-7 text-sm font-bold tracking-wide text-primary-foreground uppercase transition-transform hover:bg-primary/90 active:scale-95"
            >
              Explore Studios <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/add-studio"
              className="inline-flex h-12 items-center rounded-lg border border-border px-7 text-sm font-bold tracking-wide uppercase transition-colors hover:border-primary hover:text-primary"
            >
              List Your Studio
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
