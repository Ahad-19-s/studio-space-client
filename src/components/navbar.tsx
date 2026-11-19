"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { Aperture, ChevronDown, LogOut, Menu, Moon, Plus, Sun, X } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { NAV_LINKS } from "@/lib/constants";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

// Maps a nav href to the pathname it should highlight as active.
// Hash links (`/#how-it-works`) are only active when we are on that page *and*
// the matching section hash is set — otherwise Home, How It Works and About Us
// would all light up together on "/".
function isActive(pathname: string, href: string, hash: string): boolean {
  const [base, fragment] = href.split("#");
  const target = base || "/";
  // Root only matches itself; other links also match nested routes
  // (e.g. "/studios" stays active on "/studios/edit/<id>").
  const matches =
    target === "/"
      ? pathname === "/"
      : pathname === target || pathname.startsWith(`${target}/`);
  if (!matches) return false;
  // A hash link is active only when its section is the current one.
  if (fragment) return hash === `#${fragment}`;
  return true;
}

export default function Navbar() {
  const pathname = usePathname();
  const [hash, setHash] = useState("");
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  useEffect(() => setMounted(true), []);

  // Track the section hash so `/#how-it-works` and `/#about` can show their own
  // active indicator instead of all "/" links highlighting at once.
  useEffect(() => {
    const sync = () => setHash(window.location.hash);
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [pathname]);

  // Close the profile dropdown on outside click / route change.
  useEffect(() => {
    setProfileOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!profileOpen) return;
    const onClick = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [profileOpen]);

  async function handleLogout() {
    try {
      await authClient.signOut();
      toast.success("Signed out successfully.");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Could not sign out. Please try again.");
    }
  }

  const toggleTheme = () => setTheme(resolvedTheme === "dark" ? "light" : "dark");

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
      <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Aperture className="size-5" aria-hidden />
          </span>
          <span className="font-display text-2xl leading-none tracking-wide uppercase">
            Studio<span className="text-primary">Space</span>
          </span>
        </Link>

        {/* Desktop nav links with active-route indicators */}
        <div className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => {
            const active = isActive(pathname, link.href, hash);
            return (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "relative rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.label}
                {active && (
                  <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          {/* Theme toggle (Challenge 3) */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:text-foreground"
          >
            {mounted &&
              (resolvedTheme === "dark" ? (
                <Sun className="size-4" />
              ) : (
                <Moon className="size-4" />
              ))}
          </button>

          {isPending ? (
            <div className="hidden h-9 w-24 animate-pulse rounded-lg bg-muted sm:block" />
          ) : user ? (
            /* ---------- Authenticated: avatar + dropdown ---------- */
            <div ref={profileRef} className="relative hidden sm:block">
              <button
                type="button"
                onClick={() => setProfileOpen((open) => !open)}
                aria-expanded={profileOpen}
                className="flex items-center gap-2 rounded-lg border border-border py-1 pl-1 pr-2 transition-colors hover:bg-muted"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    user.image ||
                    `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(user.name || user.email || "U")}`
                  }
                  alt={user.name || "User"}
                  className="size-8 rounded-md object-cover"
                />
                <span className="max-w-28 truncate text-sm font-medium">
                  {user.name}
                </span>
                <ChevronDown className="size-3.5 text-muted-foreground" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-60 overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-xl">
                  <div className="border-b border-border px-4 py-3">
                    <p className="truncate text-sm font-semibold">{user.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                  <div className="p-1.5">
                    <DropdownItem href="/dashboard">Dashboard</DropdownItem>
                    <DropdownItem href="/add-studio">
                      <Plus className="size-4" /> Add New Studio
                    </DropdownItem>
                    <DropdownItem href="/my-listings">My Studio Listings</DropdownItem>
                    <DropdownItem href="/my-bookings">My Bookings</DropdownItem>
                    <DropdownItem href="/wishlist">Saved Studios</DropdownItem>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-500/10 dark:text-red-400"
                    >
                      <LogOut className="size-4" /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* ---------- Unauthenticated: login + register ---------- */
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                href="/login"
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:bg-primary/90 active:scale-95"
              >
                Register
              </Link>
            </div>
          )}

          {/* Mobile menu trigger */}
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Toggle menu"
            className="flex size-9 items-center justify-center rounded-lg border border-border lg:hidden"
          >
            {menuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-border bg-background px-4 py-3 lg:hidden">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium",
                  isActive(pathname, link.href, hash)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 border-t border-border pt-3">
              {user ? (
                <div className="flex flex-col gap-1">
                  <Link href="/dashboard" className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted">
                    Dashboard
                  </Link>
                  <Link href="/add-studio" className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted">
                    Add New Studio
                  </Link>
                  <Link href="/my-listings" className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted">
                    My Studio Listings
                  </Link>
                  <Link href="/my-bookings" className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted">
                    My Bookings
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-500/10 dark:text-red-400"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link
                    href="/login"
                    className="flex-1 rounded-lg border border-border px-3 py-2 text-center text-sm font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="flex-1 rounded-lg bg-primary px-3 py-2 text-center text-sm font-semibold text-primary-foreground"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function DropdownItem({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted"
    >
      {children}
    </Link>
  );
}
