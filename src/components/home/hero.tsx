"use client";

import dynamic from "next/dynamic";

// Swiper's autoplay reads the clock during render, which breaks the
// static prerender — mount the hero client-side only.
const HeroSlider = dynamic(() => import("./hero-slider"), {
  ssr: false,
  loading: () => (
    <div className="h-[560px] w-full bg-black sm:h-[620px] lg:h-[680px]" />
  ),
});

export default function Hero() {
  return <HeroSlider />;
}
