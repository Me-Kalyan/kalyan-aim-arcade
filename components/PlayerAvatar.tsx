"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { getAvatarGradient, getAvatarInitial } from "@/lib/avatar";

type PlayerAvatarProps = {
  name: string;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
};

const sizeMap: Record<PlayerAvatarProps["size"], string> = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-16 w-16 text-xl",
};

export function PlayerAvatar({
  name,
  size = "sm",
  className,
}: PlayerAvatarProps) {
  const initial = getAvatarInitial(name);
  const gradient = getAvatarGradient(name);
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-full shadow-[0_0_18px_rgba(255,77,219,0.55)]",
        "border border-white/10 dark:border-white/5",
        "text-white font-semibold select-none",
        sizeMap[size],
        className
      )}
      style={gradient}
      aria-hidden="true"
    >
      {initial}
    </div>
  );
}

