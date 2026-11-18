# StudioSpace — Peer-to-Peer Creative Studios

**Live site:** *deploying — live URL added after the Vercel/Render rollout*

StudioSpace is a peer-to-peer marketplace where creators book verified
photography studios, sound stages, podcast lounges and music suites by the
hour — and hosts turn idle studio hours into steady income.

## ✨ Features

- **Cinematic home page** — Swiper hero slider (3 slides), dynamically
  featured studios (top-rated, 6 per grid), 5 browse-by-category cards that
  deep-link into a pre-filtered explore page, plus "How Booking Works"
  (4 steps) and "Host Guarantee & Creator Support" sections.
- **Full auth flow** — email/password login & register (inline password
  rules: 6+ chars, one uppercase, one lowercase), Google social sign-in,
  forgot-password affordance, and a session-aware Navbar (avatar dropdown
  with Dashboard / Add New Studio / My Studio Listings / My Bookings /
  Saved Studios / Logout) with active-route indicators.
- **Complete studio CRUD** — add a studio (category select, hourly rate,
  deposit, capacity, amenities tag picker, image URL + optional upload,
  read-only host info), owner-only **My Studio Listings** with
  confirmation-modal delete, and a prefilled **Edit** page. All mutations
  are protected by a BetterAuth **JWT** (Bearer token verified against the
  server's JWKS) — unauthenticated requests get a 401, never silent writes.
- **Booking lifecycle** — bookable modal on studio details (date, start/end
  hours, live price estimate), bookings saved as **Pending** with
  status badges (Pending / Confirmed / Completed / Cancelled), one-click
  cancel while pending, **double-booking prevention** (overlapping slots are
  rejected server-side with a clear 409 message) and a downloadable
  **PDF invoice** per booking (jsPDF).
- **Saved studios wishlist** — heart any studio into a MongoDB-backed
  shortlist, browsable on its own page; plus a **Dashboard** with listing,
  booking and wishlist stats and recent-booking feed.
- **Craft & polish** — Cinematic Dark + Amber theme with full light/dark
  toggle, branded skeleton/spinner loaders, empty states with CTAs, a
  custom 404 with studio illustration, Sonner toasts for every success /
  error (no `alert()`s anywhere), and responsive layouts down to mobile.

## 🛠 Tech Stack

- **Frontend:** Next.js 16 (App Router, TypeScript), Tailwind CSS v4,
  shadcn-style components on base-ui primitives, Swiper, Sonner, next-themes,
  react-icons, lucide-react, jsPDF
- **Auth:** BetterAuth (MongoDB adapter + JWT plugin) — session cookies in
  the browser, Bearer JWTs for API mutations
- **Backend:** Express 5 + MongoDB (`studioSpace` database), `jose` JWKS
  verification for protected routes
- **Hosting:** Vercel (client) + Render (server)

## 💻 Local Setup

### 1. Server (`studiospace-server`)

```bash
npm install
```

Create `.env` in the server folder:

```bash
MONGODB_URI=your-mongodb-connection-string
MONGO_DB_URI=your-mongodb-connection-string   # same value; used by index.js
CLIENT_URL=http://localhost:3000              # where the Next.js app runs
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your-shared-better-auth-secret
JWT_SECRET=your-jwt-secret
```

```bash
npm start        # API on http://localhost:5000
```

### 2. Client (`studiospace-client`)

```bash
npm install
```

Create `.env.local`:

```bash
MONGODB_URI=your-mongodb-connection-string    # same DB as the server
BETTER_AUTH_SECRET=your-shared-better-auth-secret
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_SERVER_URL=http://localhost:5000  # Express API base URL
NEXT_PUBLIC_IMGBB_API_KEY=                    # optional: enables image upload
GOOGLE_CLIENT_ID=                             # optional: enables Google login
GOOGLE_CLIENT_SECRET=
```

```bash
npm run dev      # http://localhost:3000
```

> The client and server must share the **same MongoDB database** and
> **BETTER_AUTH_SECRET** so sessions issued by Next.js validate on the
> Express API (and vice versa).

## 🧪 Examiner Test Accounts

| Role  | Email               | Password         |
| ----- | ------------------- | ---------------- |
| Host  | `alice@example.com` | `StudioSpace123!` |
| Renter| `bob@example.com`   | `StudioSpace123!` |

- **Alice (host)** owns 5 seeded listings → test *Dashboard*, *My Studio
  Listings*, *Update* and *Delete*.
- **Bob (renter)** has 3 bookings (Pending / Confirmed / Cancelled) and 1
  saved studio → test *My Bookings*, *Cancel*, *PDF Invoice* and *Saved
  Studios*.
- Sign up with any email to test the registration rules, or use *Explore
  Studios → Book This Studio* to create a fresh **Pending** booking.
- Double-booking demo: book the same studio/date/hours twice — the second
  attempt is rejected with a clear message.

## 🔐 Challenges Solved

1. **Protected mutations** — every write sends `Authorization: Bearer <jwt>`;
   the token is minted by BetterAuth (`/api/auth/token`, session cookie) and
   verified against `/api/auth/jwks`. Missing/invalid tokens → 401.
2. **Double-booking prevention** — the server takes a per-studio/date lock,
   checks `Pending`/`Confirmed` overlaps (`newStart < existingEnd &&
   newEnd > existingStart`) and answers 409 with a human-readable message.
3. **Theme toggle** — class-based dark mode (next-themes) with a navbar
   switch and Sonner toaster synced to the active theme.
