"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Heart,
  MapPin,
  Star,
  Users,
  Wallet,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { StudioDetailsSkeleton, Spinner } from "@/components/loaders";
import { Container, EmptyState } from "@/components/shared";
import BookingModal from "@/components/booking/booking-modal";
import WishlistButton from "@/components/wishlist-button";
import { api } from "@/lib/api";
import type { IStudio } from "@/lib/types/studio";
import { cn } from "cn";

// Swiper bails out of the server render, so the gallery must be
// client-only (see the comment in studio-gallery.tsx).
const StudioGallery = dynamic(
  () => import("@/components/studio/studio-gallery"),
  { ssr: false }
);

function StudioDetails() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [studio, setStudio] = useState<IStudio | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    api
      .get<IStudio>(`/explore-studios/${id}`)
      .then((data) => {
        if (!cancelled) setStudio(data);
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
  }, [id]);

  if (loading) {
    return (
      <Container className="py-12">
        <StudioDetailsSkeleton />
      </Container>
    );
  }

  if (failed || !studio) {
    return (
      <Container className="py-16">
        <EmptyState
          title="Studio not found"
          description="This listing may have been removed by its host, or the link is broken."
          action={{ label: "Browse all studios", href: "/studios" }}
        />
      </Container>
    );
  }

  const reviews = studio.reviews ?? [];
  const gallery =
    studio.gallery && studio.gallery.length > 0
      ? studio.gallery
      : studio.image
        ? [studio.image]
        : [];

  const ratingLabel =
    typeof studio.rating === "number" && studio.rating > 0
      ? studio.rating.toFixed(1)
      : "New";

  return (
    <Container className="py-10 lg:py-14">
      {/* Breadcrumb */}
      <Link
        href="/studios"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="size-4" /> All studios
      </Link>

      {/* ---------- Gallery carousel ---------- */}
      <div className="mt-5">
        <StudioGallery images={gallery} title={studio.title} />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* ---------- Main column ---------- */}
        <div className="lg:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="amber">{studio.category}</Badge>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Star className="size-4 fill-amber-400 text-amber-400" />
                  {ratingLabel}
                  <span className="text-muted-foreground/70">
                    ({reviews.length} review{reviews.length === 1 ? "" : "s"})
                  </span>
                </span>
              </div>
              <h1 className="mt-3 font-display text-4xl leading-tight tracking-wide uppercase sm:text-5xl">
                {studio.title}
              </h1>
              <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="size-4" /> {studio.location}
              </p>
            </div>

            <WishlistButton studioId={studio._id} />
          </div>

          {/* Specs strip */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Spec
              icon={Wallet}
              label="Hourly rate"
              value={`$${studio.hourlyRate}/hr`}
            />
            <Spec
              icon={Calendar}
              label="Deposit"
              value={`$${studio.securityDeposit ?? 0}`}
            />
            <Spec
              icon={Users}
              label="Capacity"
              value={`${studio.maxCapacity} people`}
            />
            <Spec
              icon={MapPin}
              label="Location"
              value={studio.location}
              truncate
            />
          </div>

          {/* Overview */}
          <section className="mt-10">
            <SectionTitle>About this studio</SectionTitle>
            <p className="mt-3 text-sm leading-relaxed whitespace-pre-line text-muted-foreground sm:text-base">
              {studio.overview ||
                "The host hasn't written an overview for this space yet."}
            </p>
          </section>

          {/* Amenities */}
          {studio.amenities?.length > 0 && (
            <section className="mt-10">
              <SectionTitle>Amenities</SectionTitle>
              <div className="mt-4 flex flex-wrap gap-2">
                {studio.amenities.map((amenity) => (
                  <span
                    key={amenity}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-sm"
                  >
                    <span className="size-1.5 rounded-full bg-primary" />
                    {amenity}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Reviews (read-only) */}
          <section className="mt-10">
            <SectionTitle>
              Reviews{" "}
              <span className="text-base text-muted-foreground">
                ({reviews.length})
              </span>
            </SectionTitle>
            {reviews.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">
                No reviews yet — be the first to book and tell others how it went.
              </p>
            ) : (
              <div className="mt-4 space-y-4">
                {reviews.map((review, index) => (
                  <article
                    key={`${review.userEmail}-${index}`}
                    className="rounded-xl border border-border bg-card p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="flex size-9 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                          {(review.userName || "?").charAt(0).toUpperCase()}
                        </span>
                        <div>
                          <p className="text-sm font-medium">
                            {review.userName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(review.createdAt).toLocaleDateString(
                              undefined,
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                      <span className="flex items-center gap-1 text-sm">
                        {Array.from({ length: 5 }).map((_, star) => (
                          <Star
                            key={star}
                            className={cn(
                              "size-3.5",
                              star < review.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-muted-foreground/40"
                            )}
                          />
                        ))}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {review.comment}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* ---------- Booking sidebar ---------- */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-border bg-card p-6">
            <p className="text-sm text-muted-foreground">Hourly rate</p>
            <p className="mt-1 font-display text-5xl leading-none tracking-wide text-primary">
              ${studio.hourlyRate}
              <span className="text-xl text-muted-foreground"> /hr</span>
            </p>

            <dl className="mt-5 space-y-2.5 border-t border-border pt-5 text-sm">
              <Row label="Security deposit" value={`$${studio.securityDeposit ?? 0}`} />
              <Row label="Max capacity" value={`${studio.maxCapacity} people`} />
              <Row label="Category" value={studio.category} />
              <Row label="Listed" value={studio.createdAt ? new Date(studio.createdAt).toLocaleDateString() : "—"} />
            </dl>

            <button
              type="button"
              onClick={() => setBookingOpen(true)}
              className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-bold tracking-wide text-primary-foreground uppercase transition-colors hover:bg-primary/90 active:scale-[0.98]"
            >
              Book This Studio
            </button>

            <p className="mt-3 text-center text-xs text-muted-foreground">
              Free to reserve · Pay the host directly
            </p>

            {/* Host card */}
            <div className="mt-6 rounded-xl border border-border bg-muted/40 p-4">
              <p className="text-xs tracking-wide text-muted-foreground uppercase">
                Hosted by
              </p>
              <div className="mt-2 flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {((studio.ownerName || studio.email || "H").charAt(0)).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {studio.ownerName || "Studio Host"}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {studio.ownerEmail || studio.email || ""}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <BookingModal
        studio={studio}
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
      />
    </Container>
  );
}

function Spec({
  icon: Icon,
  label,
  value,
  truncate,
}: {
  icon: typeof Wallet;
  label: string;
  value: string;
  truncate?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-3.5">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icon className="size-3.5" /> {label}
      </div>
      <p
        className={cn(
          "mt-1.5 text-sm font-semibold",
          truncate && "truncate"
        )}
        title={value}
      >
        {value}
      </p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display text-2xl tracking-wide uppercase">{children}</h2>
  );
}

export default function StudioDetailsPage() {
  return (
    <Suspense
      fallback={
        <Container className="py-12">
          <div className="flex items-center justify-center py-24">
            <Spinner className="h-8 w-8 text-primary" />
          </div>
        </Container>
      }
    >
      <StudioDetails />
    </Suspense>
  );
}
