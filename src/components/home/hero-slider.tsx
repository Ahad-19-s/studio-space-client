"use client";

import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { ArrowRight, Camera } from "lucide-react";

interface ISlide {
  eyebrow: string;
  headline: string;
  subtext: string;
  image: string;
}

// Punchy hero slides — each CTA lands on the explore page.
const SLIDES: ISlide[] = [
  {
    eyebrow: "Book by the hour",
    headline: "Your next shoot deserves a real stage",
    subtext:
      "Photography studios, cyc walls and daylight lofts — inspected, verified and bookable in under a minute.",
    image:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1920&q=85",
  },
  {
    eyebrow: "Sound on",
    headline: "Record in rooms that actually sound good",
    subtext:
      "Broadcast-ready podcast lounges, vocal booths and control suites with the gear already dialed in.",
    image:
      "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1920&q=85",
  },
  {
    eyebrow: "Host your space",
    headline: "Turn idle studio hours into income",
    subtext:
      "List your stage, set your rates and your own availability. We handle bookings, payments and protection.",
    image:
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=1920&q=85",
  },
];

export default function HeroSlider() {
  return (
    <section className="relative isolate overflow-hidden bg-black">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{ delay: 5500, disableOnInteraction: false }}
        loop
        pagination={{ clickable: true }}
        className="h-[560px] w-full sm:h-[620px] lg:h-[680px]"
      >
        {SLIDES.map((slide) => (
          <SwiperSlide key={slide.headline}>
            {/* Background image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={slide.image}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            {/* Cinematic scrim */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/65 to-black/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

            <div className="relative mx-auto flex h-full w-full max-w-7xl flex-col justify-end px-4 pb-20 sm:px-6 lg:justify-center lg:pb-0">
              <div className="max-w-2xl">
                <p className="eyebrow">{slide.eyebrow}</p>
                <h1 className="mt-3 font-display text-5xl leading-[0.95] tracking-wide text-white uppercase sm:text-6xl lg:text-7xl">
                  {slide.headline}
                </h1>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
                  {slide.subtext}
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/studios"
                    className="inline-flex h-12 items-center gap-2 rounded-lg bg-primary px-7 text-sm font-bold tracking-wide text-primary-foreground uppercase transition-transform hover:bg-primary/90 active:scale-95"
                  >
                    Explore Studios <ArrowRight className="size-4" />
                  </Link>
                  <Link
                    href="/add-studio"
                    className="inline-flex h-12 items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-7 text-sm font-bold tracking-wide text-white uppercase backdrop-blur transition-colors hover:bg-white/20"
                  >
                    <Camera className="size-4" /> Host Your Space
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
