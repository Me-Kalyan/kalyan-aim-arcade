"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

type DockItem = {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  active?: boolean;
};

type DockProps = {
  items: DockItem[];
};

export default function Dock({
  items,
}: DockProps) {
  return (
    <motion.nav
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="pointer-events-none fixed inset-x-0 bottom-3 z-40 flex justify-center"
      aria-label="Bottom navigation dock"
    >
      <div className="pointer-events-auto flex h-16 items-center gap-3 rounded-full bg-black/85 dark:bg-black/90 backdrop-blur-xl px-4 shadow-[0_18px_40px_rgba(0,0,0,0.7)]">
        {items.map((item) => (
          <motion.button
            key={item.label}
            type="button"
            onClick={item.onClick}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-full text-gray-300 dark:text-gray-200 transition-colors",
              item.active && "text-white dark:text-white bg-white/10 dark:bg-white/10"
            )}
          >
            {item.icon}
          </motion.button>
        ))}
      </div>
    </motion.nav>
  );
}
