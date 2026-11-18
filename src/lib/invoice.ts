import { jsPDF } from "jspdf";
import type { IBooking } from "@/lib/types/booking";

// Generates a branded StudioSpace booking invoice as a PDF and
// triggers a download in the browser. No alerts — the caller toasts.
export function generateBookingInvoice(booking: IBooking, renterName: string) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();

  // ---- Palette (mirrors the Cinematic Dark + Amber theme) ----
  const ink = [24, 24, 27] as const; // near-black
  const amber = [245, 158, 11] as const; // stage-light amber
  const muted = [113, 113, 122] as const;

  // Header band
  doc.setFillColor(...ink);
  doc.rect(0, 0, pageWidth, 96, "F");
  doc.setFillColor(...amber);
  doc.rect(0, 96, pageWidth, 5, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  doc.text("STUDIOSPACE", 48, 52);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(161, 161, 170);
  doc.text("CREATIVE STUDIOS, BOOKED BY THE HOUR", 48, 70);

  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text("BOOKING INVOICE", pageWidth - 48, 52, { align: "right" });
  doc.setFontSize(9);
  doc.setTextColor(161, 161, 170);
  doc.text(`Issued ${new Date().toLocaleDateString()}`, pageWidth - 48, 70, {
    align: "right",
  });

  // ---- Invoice meta ----
  let y = 140;
  doc.setTextColor(...ink);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Invoice details", 48, y);

  y += 26;
  const rows: [string, string][] = [
    ["Invoice no.", `#${booking._id.slice(-8).toUpperCase()}`],
    ["Booked by", renterName],
    ["Studio", booking.studioTitle || "Studio booking"],
    ["Date", booking.bookingDate],
    ["Hours", `${booking.startTime} – ${booking.endTime}`],
    ["Status", booking.status || "Pending"],
    ["Total", `$${(booking.totalPrice ?? 0).toFixed(2)}`],
  ];

  for (const [label, value] of rows) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...muted);
    doc.text(label, 48, y);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(...ink);
    doc.text(value, 220, y);

    doc.setDrawColor(228, 228, 231);
    doc.line(48, y + 10, pageWidth - 48, y + 10);
    y += 30;
  }

  // ---- Total block ----
  doc.setFillColor(250, 250, 250);
  doc.roundedRect(pageWidth - 260, y - 8, 212, 56, 8, 8, "F");
  doc.setTextColor(...muted);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Amount due", pageWidth - 244, y + 14);
  doc.setTextColor(...amber);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.text(`$${(booking.totalPrice ?? 0).toFixed(2)}`, pageWidth - 60, y + 26, {
    align: "right",
  });

  // ---- Footer note ----
  doc.setTextColor(...muted);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  const footerY = doc.internal.pageSize.getHeight() - 60;
  doc.text(
    "Thank you for booking with StudioSpace. Present this invoice to your host on arrival.",
    48,
    footerY
  );
  doc.text(
    "studiospace.app · hello@studiospace.app",
    48,
    footerY + 16
  );

  doc.save(
    `studiospace-invoice-${booking._id.slice(-8)}.pdf`
  );
}
