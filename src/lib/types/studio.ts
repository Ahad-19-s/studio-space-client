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
  ownerName: string;
  ownerEmail: string;
  rating: number; // average of review ratings
  reviews?: IReview[];
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
}

// Shape sent to POST /add-studio and PATCH /studio/:id.
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
}
