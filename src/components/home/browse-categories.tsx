"use client";

import Link from "next/link";
import { CATEGORIES } from "@/lib/constants";
import { SectionHeading } from "@/components/shared";
import { ArrowUpRight } from "lucide-react";

// Category cards — clicking one opens /studios with that category
// pre-selected via the ?category= query param.
export default function BrowseCategories() {
  return (
    <section className="border-y border-border bg-muted/30">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
        <SectionHeading
          eyebrow="Browse by craft"
          title="Studio Categories"
          description="Five kinds of creative space, one marketplace. Pick your discipline and see what's free."
        />

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {CATEGORIES.map((category) => (
            <Link
              key={category.slug}
              href={`/studios?category=${encodeURIComponent(category.singular)}`}
              className="group relative isolate flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-2xl border border-border bg-black p-4 transition-transform hover:-translate-y-1"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={category.image}
                alt={category.label}
                className="absolute inset-0 -z-10 h-full w-full object-cover opacity-70 transition-all duration-500 group-hover:scale-105 group-hover:opacity-90"
                loading="lazy"
              />
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black via-black/40 to-transparent" />

              <span className="absolute top-3 right-3 flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground opacity-0 transition-opacity group-hover:opacity-100">
                <ArrowUpRight className="size-4" />
              </span>

              <h3 className="font-display text-2xl leading-none tracking-wide text-white uppercase">
                {category.label}
              </h3>
              <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-white/70">
                {category.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
