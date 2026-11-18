import { cn } from "cn";
import type { HTMLAttributes } from "react";

type Variant =
  | "default"
  | "secondary"
  | "outline"
  | "amber"
  | "success"
  | "warning"
  | "destructive"
  | "info";

const variantClasses: Record<Variant, string> = {
  default:
    "border-transparent bg-primary text-primary-foreground hover:bg-primary/90",
  secondary:
    "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
  outline: "border-border text-foreground bg-transparent hover:bg-muted",
  amber:
    "border-amber-500/30 bg-amber-500/15 text-amber-600 dark:text-amber-400 hover:bg-amber-500/25",
  success:
    "border-emerald-500/30 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/25",
  warning:
    "border-yellow-500/30 bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-500/25",
  destructive:
    "border-red-500/30 bg-red-500/15 text-red-700 dark:text-red-400 hover:bg-red-500/25",
  info:
    "border-sky-500/30 bg-sky-500/15 text-sky-700 dark:text-sky-400 hover:bg-sky-500/25",
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      className={cn(
        "inline-flex w-fit shrink-0 items-center justify-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-colors [&>svg]:pointer-events-none [&>svg]:size-3",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
