"use client";

import * as React from "react";
import { cn } from "cn";

// Native label styled to match the shadcn/base-ui label.
function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none",
        className
      )}
      {...props}
    />
  );
}

export { Label };
