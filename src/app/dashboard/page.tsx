"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  CalendarCheck,
  Heart,
  MapPin,
  Plus,
  Sparkles,
} from "lucide-react";
import { useRequireAuth } from "@/lib/session";
import { api, ApiError } from "@/lib/api";
import { PageLoader } from "@/components/loaders";
import { Container, SectionHeading } from "@/components/shared";
import { Badge } from "@/components/ui/badge";
import type { IStudio } from "@/lib/types/studio";
import type { IBooking } from "@/lib/types/booking";

interface IDashboardStats {
  listings: number;
  bookings: number;
  pending: number;
  saved: number;
  recentBookings: IBooking[];
}

export default function DashboardPage() {
  const { user, loading } = useRequireAuth();
  const [stats, setStats] = useState<IDashboardStats | null>(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!user?.email) return;
    let cancelled = false;

    const email = encodeURIComponent(user.email);

    Promise.all([
      api.get<IStudio[]>(`/my-listing/${email}`).catch(() => [] as IStudio[]),
      api.get<IBooking[]>(`/booking/${email}`).catch(() => [] as IBooking[]),
      api
        .get<{ studioId: string }[]>(`/wishlist/${email}`)
        .catch(() => [] as { studioId: string }[]),
    ])
      .then(([listings, bookings, saved]) => {
        if (cancelled) return;
        setStats({
          listings: listings.length,
          bookings: bookings.length,
          pending: bookings.filter((b) => b.status === "Pending").length,
          saved: saved.length,
          recentBookings: bookings.slice(0, 4),
        });
      })
      .finally(() => {
        if (!cancelled) setFetching(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user?.email]);

  if (loading) return <PageLoader />;

  const first = (user?.name || "there").split(" ")[0];

  return (
    <Container className="py-12 lg:py-16">
      <SectionHeading
        eyebrow="Control room"
        title={`Welcome back, ${first}`}
        description="Your listings, bookings and saved spaces — all in one shot."
        align="left"
        className="max-w-2xl"
      />

      {/* ---------- Stat cards ---------- */}
      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={MapPin}
          label="My Listings"
          value={stats?.listings}
          href="/my-listings"
          cta="Manage listings"
        />
        <StatCard
          icon={CalendarCheck}
          label="My Bookings"
          value={stats?.bookings}
          hint={
            stats?.pending ? `${stats.pending} awaiting host` : undefined
          }
          href="/my-bookings"
          cta="View bookings"
        />
        <StatCard
          icon={Heart}
          label="Saved Studios"
          value={stats?.saved}
          href="/wishlist"
          cta="Open shortlist"
        />
        <div className="relative overflow-hidden rounded-2xl border border-border bg-primary p-5 text-primary-foreground">
          <Sparkles className="size-5" aria-hidden />
          <p className="mt-3 text-sm font-medium opacity-90">List a new space</p>
          <p className="mt-1 font-display text-3xl leading-none tracking-wide uppercase">
            Earn hourly
          </p>
          <Link
            href="/add-studio"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold underline-offset-4 hover:underline"
          >
            Add New Studio <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>

      {/* ---------- Recent bookings ---------- */}
      <div className="mt-12 rounded-2xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="font-display text-xl tracking-wide uppercase">
            Recent Bookings
          </h2>
          <Link
            href="/my-bookings"
            className="text-sm font-medium text-primary transition-colors hover:underline"
          >
            View all
          </Link>
        </div>

        <div className="p-6">
          {fetching ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-14 animate-pulse rounded-lg bg-muted"
                />
              ))}
            </div>
          ) : !stats || stats.recentBookings.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-muted-foreground">
                No bookings yet — your reservations will appear here.
              </p>
              <Link
                href="/studios"
                className="mt-4 inline-flex h-9 items-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Explore studios
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {stats.recentBookings.map((booking) => (
                <li
                  key={booking._id}
                  className="flex flex-wrap items-center justify-between gap-3 py-3"
                >
                  <div className="min-w-0">
                    <Link
                      href={`/studios/${booking.studioId}`}
                      className="block truncate text-sm font-medium transition-colors hover:text-primary"
                    >
                      {booking.studioTitle || "Studio booking"}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {booking.bookingDate} · {booking.startTime}–
                      {booking.endTime}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold">
                      ${(booking.totalPrice ?? 0).toFixed(2)}
                    </span>
                    <Badge
                      variant={
                        booking.status === "Pending"
                          ? "warning"
                          : booking.status === "Confirmed"
                            ? "info"
                            : booking.status === "Completed"
                              ? "success"
                              : "destructive"
                      }
                    >
                      {booking.status}
                    </Badge>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Container>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  href,
  cta,
}: {
  icon: typeof MapPin;
  label: string;
  value?: number;
  hint?: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="size-5" aria-hidden />
      </div>
      <p className="mt-4 text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-4xl leading-none tracking-wide">
        {value === undefined ? "—" : value}
      </p>
      {hint && <p className="mt-1 text-xs text-primary">{hint}</p>}
      <Link
        href={href}
        className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        {cta} <ArrowRight className="size-3.5" />
      </Link>
    </div>
  );
}
