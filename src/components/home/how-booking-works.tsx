import { CalendarCheck, Clapperboard, Compass, MousePointerClick } from "lucide-react";
import { SectionHeading } from "@/components/shared";

// Section 1 — the 4-step booking workflow.
const STEPS = [
  {
    step: "01",
    icon: Compass,
    title: "Discover Spaces",
    text: "Filter by category, location, capacity and hourly rate to find the room that fits your shoot.",
  },
  {
    step: "02",
    icon: MousePointerClick,
    title: "Select Shoot Hours",
    text: "Pick the date and the exact start/end hours. Live availability blocks slots another crew already booked.",
  },
  {
    step: "03",
    icon: CalendarCheck,
    title: "Book Instantly",
    text: "Confirm the reservation in one click. Your booking lands with the host as Pending for approval.",
  },
  {
    step: "04",
    icon: Clapperboard,
    title: "Create & Produce",
    text: "Show up, plug in and make the thing. Rate the space afterwards so the next creator knows what to expect.",
  },
];

export default function HowBookingWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
        <SectionHeading
          eyebrow="How booking works"
          title="From Search to Shoot in 4 Steps"
          description="No phone tags, no quote requests. StudioSpace turns studio rental into a checkout flow."
        />

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(({ step, icon: Icon, title, text }) => (
            <div
              key={step}
              className="relative rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/40"
            >
              <span className="font-display text-5xl leading-none text-primary/20">
                {step}
              </span>
              <div className="mt-4 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-5" aria-hidden />
              </div>
              <h3 className="mt-4 font-display text-xl tracking-wide uppercase">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
