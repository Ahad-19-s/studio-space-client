import Link from "next/link";

// TODO: accept a studio object as prop and render its real data
export default function StudioCard() {
  return (
    <article className="overflow-hidden rounded-xl border border-zinc-200 transition-shadow hover:shadow-md dark:border-zinc-800">
      <div className="aspect-video w-full bg-zinc-100 dark:bg-zinc-900" />
      <div className="p-4">
        <h3 className="font-semibold">Studio name</h3>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Location · Price
        </p>
        <Link
          href="/studios/1"
          className="mt-3 inline-block text-sm font-medium underline-offset-4 hover:underline"
        >
          View details
        </Link>
      </div>
    </article>
  );
}
