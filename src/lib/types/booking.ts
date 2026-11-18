// Booking type. Mirrors the documents stored by the Express server
// in the "bookings" collection.

export type BookingStatus =
  | "Pending"
  | "Confirmed"
  | "Completed"
  | "Cancelled";

export interface IBooking {
  _id: string;
  studioId: string;
  studioTitle: string;
  /** Booker email — the server's /booking/:email lookup key. */
  email?: string;
  userEmail?: string;
  userName?: string;
  bookingDate: string; // YYYY-MM-DD
  startTime: string; // HH:MM (24h)
  endTime: string; // HH:MM (24h)
  totalPrice: number;
  status: BookingStatus;
  createdAt: string; // ISO date
}

// Shape sent to POST /booking (the server appends status: "Pending").
export interface IBookingPayload {
  studioId: string;
  studioTitle: string;
  email: string;
  userName: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
}
