"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CalendarDays, Clock, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/loaders";
import { api, ApiError } from "@/lib/api";
import { useRequireAuth } from "@/lib/session";
import type { IStudio } from "@/lib/types/studio";

// Booking modal opened from the studio details "Book" button.
// The server owns identity + price; we only pick date and hours.
export default function BookingModal({
  studio,
  open,
  onClose,
}: {
  studio: IStudio;
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const { user, loading: authLoading } = useRequireAuth();

  const [bookingDate, setBookingDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("13:00");
  const [submitting, setSubmitting] = useState(false);

  const today = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  }, []);

  // Client-side estimate — the server recalculates authoritatively.
  const estimatedTotal = useMemo(() => {
    if (!bookingDate || !startTime || !endTime) return null;
    const [sh, sm] = startTime.split(":").map(Number);
    const [eh, em] = endTime.split(":").map(Number);
    const minutes = eh * 60 + em - (sh * 60 + sm);
    if (minutes <= 0) return null;
    return Math.round((studio.hourlyRate * (minutes / 60)) * 100) / 100;
  }, [bookingDate, startTime, endTime, studio.hourlyRate]);

  if (!open) return null;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!bookingDate) {
      toast.error("Please pick a booking date.");
      return;
    }
    if (endTime <= startTime) {
      toast.error("End time must be after the start time.");
      return;
    }

    setSubmitting(true);
    try {
      // Total is calculated client-side (the server stores it as-is)
      // and the booking is saved with status "Pending".
      const [sh, sm] = startTime.split(":").map(Number);
      const [eh, em] = endTime.split(":").map(Number);
      const totalHours = (eh * 60 + em - (sh * 60 + sm)) / 60;
      const totalPrice = Math.round(studio.hourlyRate * totalHours * 100) / 100;

      await api.post("/booking", {
        studioId: studio._id,
        studioTitle: studio.title,
        email: user?.email || "",
        userName: user?.name || "",
        bookingDate,
        startTime,
        endTime,
        totalPrice,
      });
      toast.success("Booking requested! It's pending host approval.");
      onClose();
      router.push("/my-bookings");
      router.refresh();
    } catch (error) {
      // 409 = double-booking; server message explains the conflict.
      const message =
        error instanceof ApiError
          ? error.message
          : "Booking failed. Please try again.";
      toast.error(message);
      setSubmitting(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Book ${studio.title}`}
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-border bg-background shadow-2xl sm:rounded-2xl">
        <div className="sticky top-0 flex items-start justify-between gap-4 border-b border-border bg-background px-6 py-4">
          <div>
            <p className="eyebrow">Reserve your hours</p>
            <h2 className="mt-1 font-display text-2xl tracking-wide uppercase">
              Book Studio
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close booking dialog"
            className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="px-6 py-5">
          <p className="text-sm font-medium">{studio.title}</p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            ${studio.hourlyRate}/hr · {studio.location}
          </p>

          {authLoading ? (
            <div className="mt-6 space-y-3">
              <div className="h-10 animate-pulse rounded-lg bg-muted" />
              <div className="h-10 animate-pulse rounded-lg bg-muted" />
              <div className="h-11 animate-pulse rounded-lg bg-muted" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-5 space-y-5" noValidate>
              <div className="space-y-2">
                <Label htmlFor="booking-date">Booking Date</Label>
                <div className="relative">
                  <CalendarDays className="pointer-events-none absolute inset-y-0 left-3 my-auto size-4 text-muted-foreground" />
                  <Input
                    id="booking-date"
                    type="date"
                    min={today}
                    value={bookingDate}
                    onChange={(event) => setBookingDate(event.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-time">Start Time</Label>
                  <Input
                    id="start-time"
                    type="time"
                    value={startTime}
                    onChange={(event) => setStartTime(event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-time">End Time</Label>
                  <Input
                    id="end-time"
                    type="time"
                    value={endTime}
                    onChange={(event) => setEndTime(event.target.value)}
                  />
                </div>
              </div>

              {endTime <= startTime && bookingDate && (
                <p className="text-xs font-medium text-red-600 dark:text-red-400">
                  End time must be after the start time.
                </p>
              )}

              {/* Live price estimate */}
              <div className="flex items-center justify-between rounded-xl border border-border bg-muted/40 px-4 py-3">
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="size-4" /> Estimated total
                </span>
                <span className="font-display text-2xl tracking-wide text-primary">
                  {estimatedTotal !== null ? `$${estimatedTotal}` : "—"}
                </span>
              </div>

              <p className="text-xs leading-relaxed text-muted-foreground">
                Your booking is saved as <strong>Pending</strong> until the host
                confirms it. Cancel any time while it's still pending.
              </p>

              <button
                type="submit"
                disabled={submitting}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-bold tracking-wide text-primary-foreground uppercase transition-colors hover:bg-primary/90 disabled:opacity-60"
              >
                {submitting && <Spinner className="h-4 w-4" />}
                {submitting ? "Reserving…" : "Confirm Booking"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
