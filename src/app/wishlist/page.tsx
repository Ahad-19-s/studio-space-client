"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Heart } from "lucide-react";
import { useRequireAuth } from "@/lib/session";
import { api, ApiError } from "@/lib/api";
import { PageLoader, StudioGridSkeleton } from "@/components/loaders";
import { Container, EmptyState, SectionHeading } from "@/components/shared";
import StudioCard from "@/components/studio-card";
import type { IStudio } from "@/lib/types/studio";

export default function WishlistPage() {
  const { user, loading } = useRequireAuth();

  const [studios, setStudios] = useState<IStudio[]>([]);
  const [fetching, setFetching] = useState(true);

  const loadWishlist = useCallback(async () => {
    if (!user?.email) return;
    try {
      // 1. Saved studio ids for this user…
      const saved = await api.get<{ studioId: string }[]>(
        `/wishlist/${encodeURIComponent(user.email)}`
      );
      const ids = new Set(
        (Array.isArray(saved) ? saved : []).map((item) => item.studioId)
      );

      if (ids.size === 0) {
        setStudios([]);
        return;
      }

      // 2. …joined with the full studio documents.
      const all = await api.get<IStudio[]>("/explore-studios");
      setStudios(
        (Array.isArray(all) ? all : []).filter((studio) =>
          ids.has(studio._id)
        )
      );
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : "Failed to load saved studios.";
      toast.error(message);
    } finally {
      setFetching(false);
    }
  }, [user?.email]);

  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  if (loading) return <PageLoader />;

  return (
    <Container className="py-12 lg:py-16">
      <SectionHeading
        eyebrow="Your shortlist"
        title="Saved Studios"
        description="Spaces you've hearted — your personal shortlist for the next production."
        align="left"
        className="max-w-2xl"
      />

      <div className="mt-10">
        {fetching ? (
          <StudioGridSkeleton count={3} />
        ) : studios.length === 0 ? (
          <EmptyState
            icon={<Heart className="size-6" />}
            title="No saved studios yet"
            description="Tap the heart on any studio details page to keep it on this shortlist."
            action={{ label: "Find studios to save", href: "/studios" }}
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {studios.map((studio) => (
              <StudioCard key={studio._id} studio={studio} />
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}
