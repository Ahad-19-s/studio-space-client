"use client";

// TODO: control open/close state from the studio details page,
// collect the booking dates and submit the booking request.
export default function BookingModal() {
  return (
    <div className="fixed inset-0 z-50 hidden items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-zinc-900">
        <h2 className="text-lg font-semibold">Book this studio</h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Select your dates and confirm the booking.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            className="rounded-full border border-zinc-300 px-4 py-2 text-sm dark:border-zinc-700"
          >
            Cancel
          </button>
          <button
            type="button"
            className="rounded-full bg-zinc-900 px-4 py-2 text-sm text-white dark:bg-zinc-100 dark:text-zinc-900"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
