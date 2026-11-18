// Studio + review types. Mirrors the documents stored by the
// Express server in the "studios" collection.

export interface IReview {
  userEmail: string;
  userName: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string; // ISO date
}

export interface IStudio {
  _id: string;
  title: string;
  category: string;
  hourlyRate: number;
  securityDeposit: number;
  maxCapacity: number;
  location: string;
  image: string;
  gallery?: string[];
  amenities: string[];
  overview: string;
  /** Owner email — the server's /my-listing/:email lookup key. */
  email?: string;
  ownerName?: string;
  ownerEmail?: string;
  rating: number; // average of review ratings
  reviews?: IReview[];
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
}

// Shape sent to POST /add-studio and PATCH /my-listing-update/:id.
// `email` is the owner lookup key used by /my-listing/:email.
export interface IStudioPayload {
  title: string;
  category: string;
  hourlyRate: number | string;
  securityDeposit: number | string;
  maxCapacity: number | string;
  location: string;
  image: string;
  gallery?: string[];
  amenities: string[];
  overview: string;
  email?: string;
  ownerName?: string;
  ownerEmail?: string;
}
