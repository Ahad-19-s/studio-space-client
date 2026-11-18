import { BadgeCheck, Headset, ShieldCheck, Wrench } from "lucide-react";
import { SectionHeading } from "@/components/shared";

// Section 2 — host guarantee & creator support assurances.
const GUARANTEES = [
  {
    icon: ShieldCheck,
    title: "Liability Protection",
    text: "Every booking includes coverage for accidental equipment damage up to $10,000, for hosts and creators alike.",
  },
  {
    icon: BadgeCheck,
    title: "Verified Profiles",
    text: "Hosts verify their identity and studio ownership before listing, so you always know who's handing over the keys.",
  },
  {
    icon: Wrench,
    title: "Equipment Safety",
    text: "Listings are reviewed for gear condition, insurance and secure storage. Report an issue and we mediate fast.",
  },
  {
    icon: Headset,
    title: "24/7 Host Support",
    text: "Real humans on call around the clock — from first inquiry to wrap party, wherever you're shooting.",
  },
];

export default function HostGuarantee() {
  return (
    <section id="guarantee" className="scroll-mt-20 border-t border-border bg-muted/30">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
        <SectionHeading
          eyebrow="Host guarantee & creator support"
          title="Booked With Confidence"
          description="The protections and support that keep productions on schedule and studios in business."
        />

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {GUARANTEES.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl border border-border bg-background p-6">
              <div className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Icon className="size-6" aria-hidden />
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
