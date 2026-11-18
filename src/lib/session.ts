"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Convenience wrapper around BetterAuth's session hook.
export function useSession() {
  const { data, isPending, error, refetch } = authClient.useSession();
  return {
    session: data,
    user: data?.user ?? null,
    isPending,
    error,
    refetch,
  };
}

// Client-side guard for private pages: while the session resolves we keep
// rendering (no flash-redirect), and only send the user to /login once we
// *know* they are signed out. This is what keeps a logged-in user from
// bouncing to Login when reloading a private route.
export function useRequireAuth() {
  const { user, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !user) {
      router.replace(`/login?next=${encodeURIComponent(window.location.pathname)}`);
    }
  }, [isPending, user, router]);

  return { user, isPending, loading: isPending || !user };
}
