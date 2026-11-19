import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono, Bebas_Neue } from "next/font/google";
import "./globals.css";
import Providers from "@/providers";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Cinematic display face used for the logo and every section heading.
const bebas = Bebas_Neue({
  weight: "400",
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

// The Navbar (usePathname/useTheme/useSession) and every client page
// block on runtime-only hook values during prerender — allow blocking
// routes app-wide instead of forcing a static shell.
export const instant = false;

export const metadata: Metadata = {
  title: {
    default: "StudioSpace — Peer-to-Peer Creative Studios",
    template: "%s | StudioSpace",
  },
  description:
    "Discover and book photography studios, sound stages, podcast lounges and music suites by the hour. Host your creative space on StudioSpace.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${bebas.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          {/* Navbar reads usePathname — on dynamic routes (no
              generateStaticParams) that can't resolve during prerender,
              so it needs its own boundary above the page. */}
          <Suspense
            fallback={
              <div className="h-16 w-full animate-pulse border-b border-border bg-background" />
            }
          >
            <Navbar />
          </Suspense>
          <div className="flex flex-1 flex-col">{children}</div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
