import * as React from "react";
import { cn } from "@/lib/utils";

export type CardVariant = "default" | "elevated";

export function Card({
  variant = "default",
  className,
  children,
}: {
  variant?: CardVariant;
  className?: string;
  children: React.ReactNode;
}) {
  const base =
    "rounded-card bg-surface-card dark:bg-[#13131A] border border-surface-borderSoft dark:border-[#1F1F2E] px-6 py-5 text-sm text-ink-primary dark:text-[#F5F5F5] transition-all duration-200";

  const variants: Record<CardVariant, string> = {
    default: "shadow-card dark:shadow-[0_4px_16px_rgba(0,0,0,0.3)]",
    elevated: "shadow-elevated dark:shadow-[0_18px_40px_rgba(0,0,0,0.4)]",
  };

  return <div className={cn(base, variants[variant], className)}>{children}</div>;
}

