"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { useRequireAuth } from "@/lib/session";
import { api, ApiError } from "@/lib/api";
import { PageLoader, Spinner } from "@/components/loaders";
import { Container, EmptyState, SectionHeading } from "@/components/shared";
import { Badge } from "@/components/ui/badge";
import type { IStudio } from "@/lib/types/studio";

export default function MyListingsPage() {
  const router = useRouter();
  const { user, loading } = useRequireAuth();

  const [studios, setStudios] = useState<IStudio[]>([]);
  const [fetching, setFetching] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmTarget, setConfirmTarget] = useState<IStudio | null>(null);

  const loadListings = useCallback(async () => {
    if (!user?.email) return;
    try {
      const data = await api.get<IStudio[]>(
        `/my-listing/${encodeURIComponent(user.email)}`
      );
      setStudios(Array.isArray(data) ? data : []);
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : "Failed to load listings.";
      toast.error(message);
    } finally {
      setFetching(false);
    }
  }, [user?.email]);

  useEffect(() => {
    loadListings();
  }, [loadListings]);

  async function handleDelete() {
    if (!confirmTarget || !user?.email) return;
    setDeletingId(confirmTarget._id);
    try {
      await api.delete(
        `/my-listing/${encodeURIComponent(user.email)}?id=${confirmTarget._id}`
      );
      toast.success(`"${confirmTarget.title}" has been removed.`);
      setConfirmTarget(null);
      setStudios((current) =>
        current.filter((studio) => studio._id !== confirmTarget._id)
      );
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : "Failed to delete the studio.";
      toast.error(message);
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) return <PageLoader />;

  return (
    <Container className="py-12 lg:py-16">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <SectionHeading
          eyebrow="Host dashboard"
          title="My Studio Listings"
          description="Update pricing and details, or remove a space you no longer rent out."
          align="left"
          className="max-w-xl"
        />
        <Link
          href="/add-studio"
          className="inline-flex h-10 shrink-0 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus className="size-4" /> Add New Studio
        </Link>
      </div>

      <div className="mt-10">
        {fetching ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-72 animate-pulse rounded-2xl border border-border bg-muted"
              />
            ))}
          </div>
        ) : studios.length === 0 ? (
          <EmptyState
            icon={<Plus className="size-6" />}
            title="You haven't listed a studio yet"
            description="Publish your first space and start earning from the hours you're not shooting."
            action={{ label: "Add your first studio", href: "/add-studio" }}
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {studios.map((studio) => (
              <article
                key={studio._id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card"
              >
                <Link
                  href={`/studios/${studio._id}`}
                  className="relative block aspect-video overflow-hidden bg-muted"
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
                  <span className="absolute bottom-3 left-3 rounded-md bg-black/70 px-2 py-1 text-sm font-semibold text-white backdrop-blur">
                    ${studio.hourlyRate} <span className="text-xs font-normal">/ hr</span>
                  </span>
                </Link>

                <div className="flex flex-1 flex-col p-4">
                  <h3 className="line-clamp-1 font-display text-xl tracking-wide uppercase">
                    {studio.title}
                  </h3>
                  <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                    {studio.location}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    ★ {studio.rating || 0} rating · {studio.reviews?.length ?? 0} reviews
                  </p>

                  <div className="mt-4 flex gap-2 pt-1">
                    <Link
                      href={`/studios/edit/${studio._id}`}
                      className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border border-border text-sm font-medium transition-colors hover:border-primary hover:text-primary"
                    >
                      <Pencil className="size-3.5" /> Update
                    </Link>
                    <button
                      type="button"
                      onClick={() => setConfirmTarget(studio)}
                      className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border border-red-500/30 text-sm font-medium text-red-600 transition-colors hover:bg-red-500/10 dark:text-red-400"
                    >
                      {deletingId === studio._id ? (
                        <Spinner className="size-3.5" />
                      ) : (
                        <Trash2 className="size-3.5" />
                      )}
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* ---------- Delete confirmation modal ---------- */}
      {confirmTarget && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Confirm deletion"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setConfirmTarget(null);
          }}
        >
          <div className="w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div className="flex size-11 items-center justify-center rounded-xl bg-red-500/15 text-red-600 dark:text-red-400">
                <Trash2 className="size-5" />
              </div>
              <button
                type="button"
                onClick={() => setConfirmTarget(null)}
                aria-label="Close dialog"
                className="flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            <h2 className="mt-4 font-display text-2xl tracking-wide uppercase">
              Delete this studio?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              You're about to permanently remove{" "}
              <strong className="text-foreground">{confirmTarget.title}</strong>{" "}
              from StudioSpace. This can't be undone.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setConfirmTarget(null)}
                className="h-10 flex-1 rounded-lg border border-border text-sm font-medium transition-colors hover:bg-muted"
              >
                Keep it
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deletingId === confirmTarget._id}
                className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
              >
                {deletingId === confirmTarget._id && <Spinner className="size-4" />}
                {deletingId === confirmTarget._id ? "Deleting…" : "Yes, delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}
