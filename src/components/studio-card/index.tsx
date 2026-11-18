"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { IStudio } from "@/lib/types/studio";
import { MapPin, Star, Users } from "lucide-react";

// Card used on Home (featured), Explore Studios and Saved Studios.
export default function StudioCard({ studio }: { studio: IStudio }) {
  const rating =
    typeof studio.rating === "number" && studio.rating > 0
      ? studio.rating.toFixed(1)
      : "New";

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
      <Link
        href={`/studios/${studio._id}`}
        className="relative block aspect-video w-full overflow-hidden bg-muted"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={
            studio.image ||
            "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=900&q=80"
          }
          alt={studio.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <span className="absolute top-3 left-3">
          <Badge variant="amber">{studio.category}</Badge>
        </span>
        <span className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 text-xs font-medium text-white backdrop-blur">
          <Star className="size-3 fill-amber-400 text-amber-400" />
          {rating}
        </span>
        <span className="absolute bottom-3 left-3 rounded-md bg-black/70 px-2 py-1 text-sm font-semibold text-white backdrop-blur">
          ${studio.hourlyRate} <span className="text-xs font-normal">/ hr</span>
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-1 font-display text-xl tracking-wide uppercase">
          <Link href={`/studios/${studio._id}`} className="transition-colors hover:text-primary">
            {studio.title}
          </Link>
        </h3>

        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="size-3.5 shrink-0" />
          <span className="line-clamp-1">{studio.location}</span>
        </p>

        <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users className="size-3.5" /> {studio.maxCapacity} capacity
          </span>
          <span className="flex items-center gap-1">
            <Star className="size-3.5" /> {studio.reviews?.length ?? 0} reviews
          </span>
        </div>

        <Link
          href={`/studios/${studio._id}`}
          className="mt-4 inline-flex h-9 items-center justify-center rounded-lg border border-border px-4 text-sm font-medium transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
        >
          View Details
        </Link>
      </div>
    </article>
  );
}
