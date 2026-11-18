export function Spinner({ className = "" }: { className?: string }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={`inline-block animate-spin rounded-full border-2 border-current border-t-transparent ${className || "h-6 w-6"}`}
    />
  );
}

export function PageLoader() {
  return (
    <div className="flex flex-1 items-center justify-center py-24">
      <Spinner className="h-8 w-8 text-zinc-500" />
    </div>
  );
}

export default Spinner;
