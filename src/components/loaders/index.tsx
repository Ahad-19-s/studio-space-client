import { Skeleton } from "@/components/ui/skeleton";

// Spinner used during async actions.
export function Spinner({ className = "" }: { className?: string }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={`inline-block animate-spin rounded-full border-2 border-current border-t-transparent ${className || "h-6 w-6"}`}
    />
  );
}

// Full-page loader for route transitions.
export function PageLoader() {
  return (
    <div className="flex flex-1 items-center justify-center py-32">
      <div className="flex flex-col items-center gap-4">
        <Spinner className="h-9 w-9 text-primary" />
        <p className="font-display text-lg tracking-wide text-muted-foreground uppercase">
          Rolling camera…
        </p>
      </div>
    </div>
  );
}

// Card-shaped skeleton used while studio lists fetch.
export function StudioCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <Skeleton className="aspect-video w-full rounded-none" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-9 w-full" />
      </div>
    </div>
  );
}

// Grid of studio card skeletons (matches the explore grid columns).
export function StudioGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <StudioCardSkeleton key={index} />
      ))}
    </div>
  );
}

// Skeleton for the studio details hero.
export function StudioDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="aspect-[16/7] w-full rounded-2xl" />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          <Skeleton className="h-9 w-2/3" />
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-32 w-full" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  );
}

export default Spinner;
