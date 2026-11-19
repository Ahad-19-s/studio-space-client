"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Aperture, Check } from "lucide-react";
import { FaXTwitter, FaInstagram, FaYoutube, FaLinkedinIn } from "react-icons/fa6";
import { toast } from "sonner";
import { CATEGORIES, FOOTER_LINKS } from "@/lib/constants";

const SOCIALS = [
  { label: "X (Twitter)", href: "https://x.com", Icon: FaXTwitter },
  { label: "Instagram", href: "https://instagram.com", Icon: FaInstagram },
  { label: "YouTube", href: "https://youtube.com", Icon: FaYoutube },
  { label: "LinkedIn", href: "https://linkedin.com", Icon: FaLinkedinIn },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  // Year is read after mount so the static prerender doesn't trip
  // on an unstable `new Date()` value.
  const [copyrightYear, setCopyrightYear] = useState<number | null>(null);
  useEffect(() => {
    setCopyrightYear(new Date().getFullYear());
  }, []);

  function handleNewsletter(event: React.FormEvent) {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setSubscribed(true);
    setEmail("");
    toast.success("You're on the list! Studio drops incoming.");
  }

  return (
    <footer className="border-t border-border bg-muted/40">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand + mission */}
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Aperture className="size-5" aria-hidden />
              </span>
              <span className="font-display text-2xl leading-none tracking-wide uppercase">
                Studio<span className="text-primary">Space</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              StudioSpace is a peer-to-peer marketplace where creators book
              verified creative spaces by the hour — from cyc walls to sound
              stages — and hosts turn idle studios into steady income.
            </p>

            {/* Newsletter */}
            <form onSubmit={handleNewsletter} className="mt-5 max-w-sm">
              <label
                htmlFor="newsletter-email"
                className="text-xs font-medium tracking-wide text-muted-foreground uppercase"
              >
                Get new studio drops
              </label>
              <div className="mt-2 flex gap-2">
                <input
                  id="newsletter-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@studio.com"
                  className="h-9 w-full min-w-0 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                />
                <button
                  type="submit"
                  className="flex h-9 shrink-0 items-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  {subscribed ? <Check className="size-4" /> : null}
                  {subscribed ? "Joined" : "Join"}
                </button>
              </div>
            </form>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-display text-lg tracking-wide uppercase">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2.5">
              {FOOTER_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular categories */}
          <div>
            <h3 className="font-display text-lg tracking-wide uppercase">
              Studios
            </h3>
            <ul className="mt-4 space-y-2.5">
              {CATEGORIES.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/studios?category=${encodeURIComponent(category.singular)}`}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {category.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-display text-lg tracking-wide uppercase">Follow</h3>
            <div className="mt-4 flex gap-2">
              {SOCIALS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Host support, 24/7.
              <br />
              <a
                href="mailto:hello@studiospace.app"
                className="transition-colors hover:text-primary"
              >
                hello@studiospace.app
              </a>
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {copyrightYear ?? 2026} StudioSpace. All rights reserved.</p>
          <p className="text-center sm:text-right">
            Built for creators, by creators. · Terms of Service · Privacy Policy
          </p>
        </div>
      </div>
    </footer>
  );
}
