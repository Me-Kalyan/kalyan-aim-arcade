"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type DockItem = {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  active?: boolean;
};

type DockProps = {
  items: DockItem[];
  panelHeight?: number;   // base height in px
  baseItemSize?: number;  // base item size in px
  magnification?: number; // max size in px on hover
};

function useWindowWidth() {
  const [width, setWidth] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handle = () => setWidth(window.innerWidth);
    handle();
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, []);

  return width;
}

export default function Dock({
  items,
  panelHeight = 68,
  baseItemSize = 50,
  magnification = 70,
}: DockProps) {
  const width = useWindowWidth();

  // Auto-adapt sizes to screen width
  let sizeFactor = 1;
  if (width && width < 480) sizeFactor = 0.85;      // small phones
  else if (width && width > 1280) sizeFactor = 1.1; // big monitors

  const effectivePanelHeight = panelHeight * sizeFactor;
  const effectiveBaseSize = baseItemSize * sizeFactor;
  const effectiveMaxSize = magnification * sizeFactor;
  const hoverScale = effectiveMaxSize / effectiveBaseSize; // magnification factor

  return (
    <motion.nav
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={cn(
        "fixed inset-x-0 bottom-3 z-40 flex justify-center px-4 md:px-0"
      )}
      aria-label="Bottom navigation dock"
    >
      <div
        className="flex w-full max-w-md items-center justify-center rounded-full border border-white/10 dark:border-white/10 bg-black/70 dark:bg-black/80 backdrop-blur-xl shadow-[0_18px_40px_rgba(0,0,0,0.55)] transition-colors duration-200"
        style={{ height: effectivePanelHeight }}
      >
        <div className="flex w-full items-end justify-evenly px-3">
          {items.map((item) => (
            <DockButton
              key={item.label}
              item={item}
              baseSize={effectiveBaseSize}
              hoverScale={hoverScale}
            />
          ))}
        </div>
      </div>
    </motion.nav>
  );
}

function DockButton({
  item,
  baseSize,
  hoverScale,
}: {
  item: DockItem;
  baseSize: number;
  hoverScale: number;
}) {
  return (
    <motion.button
      type="button"
      onClick={item.onClick}
      whileHover={{ scale: hoverScale }}
      whileTap={{ scale: hoverScale * 0.92 }}
      transition={{ type: "spring", stiffness: 300, damping: 20, duration: 0.18 }}
      className={cn(
        "group flex flex-col items-center justify-end gap-1 text-[10px] font-medium focus:outline-none"
      )}
      style={{ width: baseSize, height: baseSize + 18 }}
    >
      <div
        className={cn(
          "flex items-center justify-center rounded-full border bg-surface-card dark:bg-[#13131A] shadow-card dark:shadow-[0_4px_16px_rgba(0,0,0,0.3)] transition-colors duration-150",
          item.active
            ? "border-brand-pink-500 dark:border-brand-pink-400 bg-brand-pink-500/15 dark:bg-brand-pink-500/20 text-brand-pink-500 dark:text-brand-pink-400"
            : "border-surface-border dark:border-[#252530] text-ink-soft dark:text-[#8E8E9E] group-hover:border-brand-pink-500/60 dark:group-hover:border-brand-pink-400/60 group-hover:text-ink-primary dark:group-hover:text-[#F5F5F5]"
        )}
        style={{ width: baseSize, height: baseSize }}
      >
        {item.icon}
      </div>
      <span
        className={cn(
          "truncate text-ink-subtle dark:text-[#5A5A6A] group-hover:text-ink-primary dark:group-hover:text-[#F5F5F5] transition-colors",
          item.active && "text-ink-primary dark:text-[#F5F5F5]"
        )}
      >
        {item.label}
      </span>
    </motion.button>
  );
}

