"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", className, children, ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center rounded-pill px-6 py-3 text-sm font-semibold transition-all duration-150 active:translate-y-[1px]";

    const variants: Record<ButtonVariant, string> = {
      primary:
        "bg-gradient-to-tr from-brand-pink-500 to-brand-pink-400 text-white shadow-card dark:shadow-[0_4px_16px_rgba(230,37,126,0.3)] hover:-translate-y-0.5 hover:shadow-elevated dark:hover:shadow-[0_8px_24px_rgba(230,37,126,0.4)] active:translate-y-0",
      secondary:
        "bg-surface-card dark:bg-[#13131A] text-ink-primary dark:text-[#F5F5F5] border border-surface-border dark:border-[#252530] hover:bg-surface-subtle dark:hover:bg-[#1A1A24] transition-colors",
      ghost:
        "bg-transparent text-ink-muted dark:text-[#B8B8C8] hover:bg-surface-subtle dark:hover:bg-[#1A1A24] hover:text-ink-primary dark:hover:text-[#F5F5F5] transition-colors",
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

