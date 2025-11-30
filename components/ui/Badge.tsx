import * as React from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant = "default" | "success" | "gaming";

export function Badge({
  variant = "default",
  className,
  children,
}: {
  variant?: BadgeVariant;
  className?: string;
  children: React.ReactNode;
}) {
  const base =
    "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-medium";

  const variants: Record<BadgeVariant, string> = {
    default: "bg-surface-borderSoft dark:bg-[#1F1F2E] text-ink-muted dark:text-[#B8B8C8]",
    success: "bg-success/10 dark:bg-success/20 text-success",
    gaming: "bg-gradient-to-tr from-brand-pink-500 to-brand-pink-400 text-white",
  };

  return <span className={cn(base, variants[variant], className)}>{children}</span>;
}

