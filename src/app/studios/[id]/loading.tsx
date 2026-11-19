import { StudioDetailsSkeleton } from "@/components/loaders";
import { Container } from "@/components/shared";

// Automatic Suspense boundary for the details route: `useParams`
// suspends during prerender because the id isn't known at build time.
export default function Loading() {
  return (
    <Container className="py-12">
      <StudioDetailsSkeleton />
    </Container>
  );
}
