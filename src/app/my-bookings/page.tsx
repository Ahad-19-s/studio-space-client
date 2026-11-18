"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  CalendarDays,
  Clock,
  FileText,
  Receipt,
  XCircle,
} from "lucide-react";
import { useRequireAuth } from "@/lib/session";
import { api, ApiError } from "@/lib/api";
import { PageLoader, Spinner } from "@/components/loaders";
import { Container, EmptyState, SectionHeading } from "@/components/shared";
import { Badge } from "@/components/ui/badge";
import type { BookingStatus, IBooking } from "@/lib/types/booking";

const STATUS_VARIANT: Record<
  BookingStatus,
  "warning" | "info" | "success" | "destructive"
> = {
  Pending: "warning",
  Confirmed: "info",
  Completed: "success",
  Cancelled: "destructive",
};

export default function MyBookingsPage() {
  const { user, loading } = useRequireAuth();

  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [fetching, setFetching] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [invoiceId, setInvoiceId] = useState<string | null>(null);

  const loadBookings = useCallback(async () => {
    if (!user?.email) return;
    try {
      const data = await api.get<IBooking[]>(
        `/booking/${encodeURIComponent(user.email)}`
      );
      setBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : "Failed to load bookings.";
      toast.error(message);
    } finally {
      setFetching(false);
    }
  }, [user?.email]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  async function handleCancel(booking: IBooking) {
    setCancellingId(booking._id);
    try {
      await api.patch(`/bookings/cancel/${booking._id}`);
      toast.success("Booking cancelled.");
      setBookings((current) =>
        current.map((item) =>
          item._id === booking._id ? { ...item, status: "Cancelled" } : item
        )
      );
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : "Failed to cancel the booking.";
      toast.error(message);
    } finally {
      setCancellingId(null);
    }
  }

  async function handleInvoice(booking: IBooking) {
    setInvoiceId(booking._id);
    try {
      const { generateBookingInvoice } = await import(
        "@/lib/invoice"
      );
      generateBookingInvoice(booking, user?.name || booking.userName || "Guest");
      toast.success("Invoice downloaded.");
    } catch {
      toast.error("Could not generate the invoice. Please try again.");
    } finally {
      setInvoiceId(null);
    }
  }

  if (loading) return <PageLoader />;

  return (
    <Container className="py-12 lg:py-16">
      <SectionHeading
        eyebrow="Your reservations"
        title="My Bookings"
        description="Every space you've reserved — cancel while a booking is still pending, or download its invoice."
        align="left"
        className="max-w-2xl"
      />

      <div className="mt-10">
        {fetching ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-32 animate-pulse rounded-2xl border border-border bg-muted"
              />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <EmptyState
            icon={<CalendarDays className="size-6" />}
            title="No bookings yet"
            description="When you reserve a studio, it shows up here with its live status."
            action={{ label: "Explore studios", href: "/studios" }}
          />
        ) : (
          <ul className="space-y-4">
            {bookings.map((booking) => {
              const status = (booking.status || "Pending") as BookingStatus;
              const isPending = status === "Pending";
              const total =
                typeof booking.totalPrice === "number"
                  ? booking.totalPrice
                  : 0;

              return (
                <li
                  key={booking._id}
                  className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={STATUS_VARIANT[status] || "secondary"}>
                        {status}
                      </Badge>
                      <span className="font-mono text-xs text-muted-foreground">
                        #{booking._id.slice(-8).toUpperCase()}
                      </span>
                    </div>

                    <h3 className="mt-2 truncate font-display text-xl tracking-wide uppercase">
                      <Link
                        href={`/studios/${booking.studioId}`}
                        className="transition-colors hover:text-primary"
                      >
                        {booking.studioTitle || "Studio booking"}
                      </Link>
                    </h3>

                    <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <CalendarDays className="size-3.5" />
                        {booking.bookingDate}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="size-3.5" />
                        {booking.startTime} – {booking.endTime}
                      </span>
                      <span className="flex items-center gap-1.5 font-medium text-foreground">
                        <Receipt className="size-3.5" /> ${total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => handleInvoice(booking)}
                      disabled={invoiceId === booking._id}
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border px-3.5 text-sm font-medium transition-colors hover:border-primary hover:text-primary disabled:opacity-60"
                    >
                      {invoiceId === booking._id ? (
                        <Spinner className="size-3.5" />
                      ) : (
                        <FileText className="size-3.5" />
                      )}
                      Invoice
                    </button>

                    {isPending && (
                      <button
                        type="button"
                        onClick={() => handleCancel(booking)}
                        disabled={cancellingId === booking._id}
                        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-red-500/30 px-3.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-500/10 dark:text-red-400 disabled:opacity-60"
                      >
                        {cancellingId === booking._id ? (
                          <Spinner className="size-3.5" />
                        ) : (
                          <XCircle className="size-3.5" />
                        )}
                        Cancel
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Container>
  );
}
