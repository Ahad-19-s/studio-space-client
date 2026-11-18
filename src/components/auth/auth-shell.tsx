"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Aperture, ArrowLeft } from "lucide-react";

// Split-panel shell shared by Login + Register: form on the left,
// cinematic studio image with brand copy on the right.
export default function AuthShell({
  title,
  eyebrow,
  subtitle,
  children,
  footer,
}: {
  title: string;
  eyebrow: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <main className="flex flex-1 items-stretch">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 lg:grid-cols-2">
        {/* ---------- Form panel ---------- */}
        <div className="flex flex-col justify-center px-4 py-12 sm:px-8 lg:py-16">
          <Link
            href="/"
            className="mb-8 inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="size-4" /> Back to home
          </Link>

          <Link href="/" className="flex w-fit items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Aperture className="size-5" aria-hidden />
            </span>
            <span className="font-display text-2xl leading-none tracking-wide uppercase">
              Studio<span className="text-primary">Space</span>
            </span>
          </Link>

          <p className="eyebrow mt-8">{eyebrow}</p>
          <h1 className="mt-2 font-display text-4xl tracking-wide uppercase sm:text-5xl">
            {title}
          </h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
            {subtitle}
          </p>

          <div className="mt-8">{children}</div>

          <div className="mt-6 text-sm text-muted-foreground">{footer}</div>
        </div>

        {/* ---------- Visual panel ---------- */}
        <div className="relative hidden overflow-hidden bg-black lg:block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1400&q=85"
            alt="Film crew working under stage lights"
            className="absolute inset-0 h-full w-full object-cover opacity-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20" />
          <div className="spotlight absolute inset-0" />

          <div className="absolute inset-x-0 bottom-0 p-10">
            <p className="eyebrow">Join 4,000+ creators</p>
            <p className="mt-3 max-w-md font-display text-3xl leading-tight tracking-wide text-white uppercase">
              Every great frame starts in the right room
            </p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/70">
              Book verified studios by the hour, manage your reservations and
              list your own space — all in one place.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
