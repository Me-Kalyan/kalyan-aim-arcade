"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type DockItem = {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  active?: boolean;
};

type DockProps = {
  items: DockItem[];
  className?: string;
};

export function Dock({ items, className }: DockProps) {
  return (
    <nav
      className={cn(
        // position & centering
        "pointer-events-none fixed inset-x-0 bottom-3 sm:bottom-4 z-40 flex justify-center px-3 sm:hidden",
        className
      )}
    >
      <div
        className="
          pointer-events-auto
          flex h-16 items-center gap-1.5
          rounded-full border border-white/10 bg-black/80
          px-2.5 sm:px-3.5
          shadow-[0_18px_40px_rgba(0,0,0,0.7)]
          backdrop-blur-xl
        "
      >
        {items.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={item.onClick}
            className={cn(
              // big tap target
              "group relative flex flex-col items-center justify-center",
              "h-12 w-14 sm:h-14 sm:w-16",
              "text-[10px] sm:text-xs font-medium",
              "text-gray-300/80 hover:text-white",
              "rounded-full transition-transform duration-150 ease-out active:scale-95"
            )}
          >
            {/* icon circle */}
            <div
              className={cn(
                "flex items-center justify-center rounded-full",
                "h-9 w-9 sm:h-10 sm:w-10",
                "bg-white/5 border border-white/10",
                "group-hover:bg-white/10",
                item.active &&
                  "bg-brand-pink-500/85 border-brand-pink-300 text-white shadow-[0_0_18px_rgba(255,77,219,0.8)]"
              )}
            >
              {item.icon}
            </div>
            {/* label – hide on tiny screens if needed */}
            <span className="mt-0.5 hidden xs:inline leading-none">
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}

export default Dock;
