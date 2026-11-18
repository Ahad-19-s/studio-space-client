import HeroSlider from "@/components/home/hero-slider";
import FeaturedStudios from "@/components/home/featured-studios";
import BrowseCategories from "@/components/home/browse-categories";
import HowBookingWorks from "@/components/home/how-booking-works";
import HostGuarantee from "@/components/home/host-guarantee";
import AboutCta from "@/components/home/about-cta";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <HeroSlider />
      <FeaturedStudios />
      <BrowseCategories />
      <HowBookingWorks />
      <HostGuarantee />
      <AboutCta />
    </div>
  );
}
