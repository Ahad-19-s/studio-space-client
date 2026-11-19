"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Full-width gallery carousel used on the studio details page.
// Swiper renders browser-only (it bails out of the server render),
// so this component is loaded via next/dynamic with ssr: false.
export default function StudioGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-black">
      <Swiper
        modules={[Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        spaceBetween={0}
        slidesPerView={1}
        className="aspect-[16/8] w-full"
      >
        {images.map((image, index) => (
          <SwiperSlide key={`${image}-${index}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt={`${title} — photo ${index + 1}`}
              className="h-full w-full object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
