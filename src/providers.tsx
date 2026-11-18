"use client";

import { ThemeProvider, useTheme } from "next-themes";
import { Toaster } from "sonner";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

// Keeps Sonner in sync with the next-themes light/dark choice.
function AppToaster() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      theme={mounted ? (resolvedTheme as "light" | "dark") : "system"}
    />
  );
}

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      {children}
      <AppToaster />
    </ThemeProvider>
  );
}
