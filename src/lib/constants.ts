// Shared static data: studio categories, amenity options, nav links.

export interface ICategory {
  slug: string;
  label: string;
  singular: string;
  description: string;
  image: string;
}

// Browse-by-category cards on the home page. Clicking one goes to
// /studios?category=<singular label> with the filter pre-selected.
export const CATEGORIES: ICategory[] = [
  {
    slug: "photo-studio",
    label: "Photo Studios",
    singular: "Photo Studio",
    description: "Cyc walls, daylight lofts and strobe-ready spaces.",
    image:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "sound-stage",
    label: "Sound Stages",
    singular: "Sound Stage",
    description: "Film stages with grid lighting and drive-in access.",
    image:
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "podcast-lounge",
    label: "Podcast Rooms",
    singular: "Podcast Lounge",
    description: "Treated lounges with broadcast mics and mixers.",
    image:
      "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "music-suite",
    label: "Music Suites",
    singular: "Music Suite",
    description: "Tracking rooms, vocal booths and control suites.",
    image:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "art-workshop",
    label: "Art Workshops",
    singular: "Art Workshop",
    description: "Pottery, painting and maker studios by the hour.",
    image:
      "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=900&q=80",
  },
];

// Every category accepted by the Add/Edit studio form.
export const CATEGORY_OPTIONS = [
  "Photo Studio",
  "Sound Stage",
  "Podcast Lounge",
  "Music Suite",
  "Art Workshop",
  "Film Stage",
  "Rehearsal Room",
  "Podcast Studio",
];

// Amenity tags offered as checkboxes on the studio form.
export const AMENITY_OPTIONS = [
  "Free Wi-Fi",
  "4K Camera Kit",
  "LED Lighting",
  "Green Screen",
  "Cyc Wall",
  "Soundproofing",
  "Studio Monitors",
  "Audio Interface",
  "Mixing Console",
  "Upholstered Lounge",
  "Makeup Station",
  "Costume Rack",
  "Props Library",
  "Coffee Bar",
  "Parking",
  "Natural Light",
  "Blackout Curtains",
  "Air Conditioning",
  "Private Restroom",
  "Equipment Insurance",
];

// Navbar links. "How It Works" and "About Us" scroll to home sections.
export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Explore Studios", href: "/studios" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "About Us", href: "/#about" },
];

// Footer quick links.
export const FOOTER_LINKS = [
  { label: "Explore Studios", href: "/studios" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Host Guarantee", href: "/#guarantee" },
  { label: "About Us", href: "/#about" },
  { label: "Add New Studio", href: "/add-studio" },
  { label: "My Bookings", href: "/my-bookings" },
];
