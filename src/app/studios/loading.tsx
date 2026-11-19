import { StudioGridSkeleton } from "@/components/loaders";
import { Container, SectionHeading } from "@/components/shared";

// Route-transition skeleton for /studios — matches the real page's heading +
// 3-column card grid so the layout doesn't jump when data arrives.
export default function Loading() {
  return (
    <Container className="py-12 lg:py-16">
      <SectionHeading
        eyebrow="Explore"
        title="Explore Studios"
        description="Loading available workspaces…"
      />
      <div className="mt-10">
        <StudioGridSkeleton count={6} />
      </div>
    </Container>
  );
}
