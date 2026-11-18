import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Private routes that require a signed-in user.
const PRIVATE_ROUTES = [
  "/add-studio",
  "/my-listings",
  "/my-bookings",
  "/dashboard",
  "/wishlist",
  "/studios/edit",
];

function hasSessionCookie(request: NextRequest): boolean {
  // BetterAuth session cookies (plain in dev, __Secure- prefixed in prod).
  const names = [
    "better-auth.session_token",
    "__Secure-better-auth.session_token",
    "better-auth.session_data",
    "__Secure-better-auth.session_data",
  ];
  return names.some((name) => Boolean(request.cookies.get(name)?.value));
}

// Optimistic route protection (Next.js recommends keeping Proxy light):
// we only check for the presence of the session cookie. Real session
// validation happens in the pages/components via authClient.getSession().
export function proxy(request: NextRequest) {
  const { pathname, search } = request.url ? new URL(request.url) : { pathname: request.nextUrl.pathname, search: request.nextUrl.search };
  const signedIn = hasSessionCookie(request);

  const isPrivate = PRIVATE_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isPrivate && !signedIn) {
    const login = new URL("/login", request.url);
    // Remember where the user wanted to go so login can send them back.
    login.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(login);
  }

  // Already signed in? Don't show the login/register forms again.
  if ((pathname === "/login" || pathname === "/register") && signedIn) {
    const next = request.nextUrl.searchParams.get("next");
    const destination =
      next && next.startsWith("/") && !next.startsWith("//") ? next : "/";
    return NextResponse.redirect(new URL(destination, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/add-studio",
    "/add-studio/:path*",
    "/my-listings",
    "/my-listings/:path*",
    "/my-bookings",
    "/my-bookings/:path*",
    "/dashboard",
    "/dashboard/:path*",
    "/wishlist",
    "/wishlist/:path*",
    "/studios/edit/:path*",
    "/login",
    "/register",
  ],
};
