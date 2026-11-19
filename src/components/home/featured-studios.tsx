"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import StudioCard from "@/components/studio/studio-card";
import { StudioGridSkeleton } from "@/components/loaders";
import { SectionHeading, EmptyState } from "@/components/shared";
import { api } from "@/lib/api";
import type { IStudio } from "@/lib/types/studio";

// Featured Studios: the server applies MongoDB's `.limit(6)` for us, so only
// the top-rated spaces travel over the wire instead of the whole directory.
export default function FeaturedStudios() {
  const [studios, setStudios] = useState<IStudio[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    api
      .get<IStudio[]>("/explore-studios?sort=rating&limit=6")
      .then((data) => {
        if (cancelled) return;
        setStudios(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
      <SectionHeading
        eyebrow="Handpicked"
        title="Featured Studios"
        description="The highest-rated spaces on the platform right now — bookable by the hour, ready for production."
      />

      <div className="mt-10">
        {loading ? (
          <StudioGridSkeleton count={6} />
        ) : failed ? (
          <EmptyState
            title="Couldn't load studios"
            description="We couldn't reach the studio directory. Check that the API server is running and refresh the page."
            action={{ label: "Explore all studios", href: "/studios" }}
          />
        ) : studios.length === 0 ? (
          <EmptyState
            title="No studios yet"
            description="Be the first to list a creative space on StudioSpace."
            action={{ label: "Add a studio", href: "/add-studio" }}
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {studios.map((studio) => (
              <StudioCard key={studio._id} studio={studio} />
            ))}
          </div>
        )}
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/studios"
          className="inline-flex h-11 items-center gap-2 rounded-lg border border-border px-6 text-sm font-semibold transition-colors hover:border-primary hover:text-primary"
        >
          Browse all studios <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}
