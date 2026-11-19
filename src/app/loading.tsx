import { PageLoader } from "@/components/loaders";

// Suspense boundary for the home route during a route transition.
export default function Loading() {
  return <PageLoader />;
}
