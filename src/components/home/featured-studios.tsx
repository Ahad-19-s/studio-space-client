"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import StudioCard from "@/components/studio/studio-card";
import { StudioGridSkeleton } from "@/components/loaders";
import { SectionHeading, EmptyState } from "@/components/shared";
import { api } from "@/lib/api";
import type { IStudio } from "@/lib/types/studio";

// Fetches the studios and picks the 6 top-rated ones (the server has no
// dedicated featured endpoint, so we sort by rating and limit client-side).
export default function FeaturedStudios() {
  const [studios, setStudios] = useState<IStudio[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    api
      .get<IStudio[]>("/explore-studios")
      .then((data) => {
        if (cancelled) return;
        const list = Array.isArray(data) ? data : [];
        list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        setStudios(list.slice(0, 6));
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
            {studios.slice(0, 6).map((studio) => (
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
