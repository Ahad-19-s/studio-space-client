import { Container } from "@/components/shared";

// Automatic Suspense boundary for the edit route: `useParams`
// suspends during prerender because the id isn't known at build time.
export default function Loading() {
  return (
    <Container className="py-12">
      <div className="h-[480px] animate-pulse rounded-2xl border border-border bg-muted" />
    </Container>
  );
}
