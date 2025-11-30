"use client";

import { cn } from "@/lib/utils";

function stringToHue(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 360;
}

export function Avatar({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const safeName = name || "Guest";
  const initials =
    safeName
      .trim()
      .split(/\s+/)
      .map((p) => p[0]?.toUpperCase())
      .join("")
      .slice(0, 2) || "?";

  const hue = stringToHue(safeName);
  const bg = `hsl(${hue}, 80%, 55%)`;
  const bg2 = `hsl(${(hue + 40) % 360}, 80%, 40%)`;

  return (
    <div
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-white shadow-md",
        className
      )}
      style={{
        backgroundImage: `linear-gradient(135deg, ${bg}, ${bg2})`,
      }}
    >
      {initials}
    </div>
  );
}

