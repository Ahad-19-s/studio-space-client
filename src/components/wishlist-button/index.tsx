"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Heart } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { api, ApiError } from "@/lib/api";
import { Spinner } from "@/components/loaders";

// Heart toggle on the studio details page. Saved studios live in
// MongoDB (server's /wishlist endpoints), keyed by the user's email.
export default function WishlistButton({ studioId }: { studioId: string }) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Load the current saved-state once we know who the user is.
  useEffect(() => {
    if (!user?.email) {
      setHydrated(true);
      return;
    }
    let cancelled = false;

    api
      .get<{ studioId: string }[]>(
        `/wishlist/${encodeURIComponent(user.email)}`
      )
      .then((data) => {
        if (!cancelled && Array.isArray(data)) {
          setSaved(data.some((item) => item.studioId === studioId));
        }
      })
      .catch(() => {
        // Wishlist state is non-critical — ignore load failures.
      })
      .finally(() => {
        if (!cancelled) setHydrated(true);
      });

    return () => {
      cancelled = true;
    };
  }, [user?.email, studioId]);

  async function toggle() {
    if (isPending) return;
    if (!user?.email) {
      toast.info("Sign in to save studios to your wishlist.");
      router.push(`/login?next=${encodeURIComponent(`/studios/${studioId}`)}`);
      return;
    }

    setBusy(true);
    const previous = saved;
    setSaved(!previous); // optimistic
    try {
      const result = await api.post<{ saved: boolean }>("/wishlist/toggle", {
        email: user.email,
        studioId,
      });
      setSaved(result?.saved ?? !previous);
      toast.success(
        result?.saved ? "Added to your saved studios." : "Removed from saved studios."
      );
    } catch (error) {
      setSaved(previous); // roll back
      const message =
        error instanceof ApiError ? error.message : "Could not update your wishlist.";
      toast.error(message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy || !hydrated}
      aria-pressed={saved}
      aria-label={saved ? "Remove from saved studios" : "Save studio"}
      className={[
        "inline-flex h-10 items-center gap-2 rounded-lg border px-4 text-sm font-medium transition-colors",
        saved
          ? "border-red-500/40 bg-red-500/10 text-red-600 dark:text-red-400"
          : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground",
        "disabled:opacity-60",
      ].join(" ")}
    >
      {busy ? (
        <Spinner className="size-4" />
      ) : (
        <Heart className={saved ? "size-4 fill-current" : "size-4"} />
      )}
      {saved ? "Saved" : "Save"}
    </button>
  );
}
