"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import StudioCard from "@/components/studio/studio-card";
import { StudioGridSkeleton } from "@/components/loaders";
import { Container, EmptyState, SectionHeading } from "@/components/shared";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { CATEGORIES } from "@/lib/constants";
import type { IStudio } from "@/lib/types/studio";
import { cn } from "cn";

type SortKey = "featured" | "price-asc" | "price-desc" | "rating";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "featured", label: "Featured" },
  { key: "rating", label: "Top rated" },
  { key: "price-asc", label: "Price: low → high" },
  { key: "price-desc", label: "Price: high → low" },
];

function ExploreStudios() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "";

  const [studios, setStudios] = useState<IStudio[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const [category, setCategory] = useState(initialCategory);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("featured");

  // Keep the filter in sync when the URL query changes (category cards
  // on the home page navigate here with ?category=...).
  useEffect(() => {
    setCategory(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    let cancelled = false;

    api
      .get<IStudio[]>("/explore-studios")
      .then((data) => {
        if (!cancelled) setStudios(Array.isArray(data) ? data : []);
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

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();

    let result = studios.filter((studio) => {
      const matchesCategory = !category || studio.category === category;
      const matchesQuery =
        !needle ||
        studio.title.toLowerCase().includes(needle) ||
        studio.location.toLowerCase().includes(needle) ||
        studio.category.toLowerCase().includes(needle) ||
        (studio.overview || "").toLowerCase().includes(needle);
      return matchesCategory && matchesQuery;
    });

    if (sort === "price-asc") {
      result = [...result].sort((a, b) => a.hourlyRate - b.hourlyRate);
    } else if (sort === "price-desc") {
      result = [...result].sort((a, b) => b.hourlyRate - a.hourlyRate);
    } else if (sort === "rating") {
      result = [...result].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return result;
  }, [studios, category, query, sort]);

  const hasFilters = Boolean(category || query.trim());

  function clearFilters() {
    setCategory("");
    setQuery("");
    setSort("featured");
  }

  return (
    <Container className="py-12 lg:py-16">
      <SectionHeading
        eyebrow="Explore"
        title="All Studios"
        description="Every verified creative space on StudioSpace — filter by craft, search by city, sort by price."
      />

      {/* ---------- Filter bar ---------- */}
      <div className="mt-8 rounded-2xl border border-border bg-card p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute inset-y-0 left-3 my-auto size-4 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by title, city or craft…"
              aria-label="Search studios"
              className="h-10 w-full rounded-lg border border-input bg-background pr-3 pl-9 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="size-4 shrink-0 text-muted-foreground" />
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as SortKey)}
              aria-label="Sort studios"
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 lg:w-auto"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category chips — click to toggle the pre-selected category */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setCategory("")}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              !category
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
            )}
          >
            All
          </button>
          {CATEGORIES.map((item) => {
            const active = category === item.singular;
            return (
              <button
                key={item.slug}
                type="button"
                onClick={() => setCategory(active ? "" : item.singular)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                )}
              >
                {item.label}
              </button>
            );
          })}
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              <X className="size-3.5" /> Clear filters
            </button>
          )}
        </div>
      </div>

      {/* ---------- Results ---------- */}
      <div className="mt-6 flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {loading
            ? "Loading studios…"
            : `${filtered.length} studio${filtered.length === 1 ? "" : "s"} found`}
        </span>
        {category && <Badge variant="amber">{category}</Badge>}
      </div>

      <div className="mt-4">
        {loading ? (
          <StudioGridSkeleton count={6} />
        ) : failed ? (
          <EmptyState
            title="Couldn't reach the studio directory"
            description="The API server may be offline. Start it and refresh this page."
            action={{ label: "Return to home", href: "/" }}
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No studios match your filters"
            description="Try a different category or clear the search to see everything we've got."
            action={{ label: "Clear filters", onClick: clearFilters }}
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((studio) => (
              <StudioCard key={studio._id} studio={studio} />
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}

export default function StudiosPage() {
  return (
    <Suspense
      fallback={
        <Container className="py-12">
          <div className="mx-auto h-16 w-2/3 animate-pulse rounded-xl bg-muted" />
        </Container>
      }
    >
      <ExploreStudios />
    </Suspense>
  );
}
