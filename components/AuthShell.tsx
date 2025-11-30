"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "motion/react";
import { useAuth } from "@/lib/auth";
import { useUiPrefs } from "@/lib/ui-prefs";
import { useToast } from "@/lib/toast";
import { ArcadeClientProvider } from "@/components/ArcadeClientProvider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import Dock from "@/components/Dock";
import {
  VscHome,
  VscGame,
  VscGraphLine,
  VscAccount,
  VscSettingsGear,
} from "react-icons/vsc";

function SettingsDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { theme, density, setTheme, setDensity } = useUiPrefs();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      {/* Backdrop */}
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/30"
        aria-label="Close settings"
      />
      {/* Panel */}
      <div className="relative z-50 flex h-full w-80 max-w-full flex-col border-l border-surface-border dark:border-[#252530] bg-surface-card dark:bg-[#13131A] px-4 py-4 shadow-elevated dark:shadow-[0_18px_40px_rgba(0,0,0,0.4)] transition-colors duration-200">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-ink-primary dark:text-[#F5F5F5]">
              Display settings
            </p>
            <p className="text-[11px] text-ink-soft dark:text-[#8E8E9E]">
              Tweak theme and density just for this browser.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-ink-soft dark:text-[#8E8E9E] hover:text-ink-primary dark:hover:text-[#F5F5F5] transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="space-y-4 text-xs text-ink-muted dark:text-[#B8B8C8]">
          {/* Theme */}
          <div>
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-subtle dark:text-[#5A5A6A]">
              Theme
            </p>
            <div className="flex gap-2">
              <Button
                variant={theme === "light" ? "primary" : "secondary"}
                className="px-3 py-2 text-[11px]"
                onClick={() => setTheme("light")}
              >
                Light
              </Button>
              <Button
                variant={theme === "dark" ? "primary" : "secondary"}
                className="px-3 py-2 text-[11px]"
                onClick={() => setTheme("dark")}
              >
                Dark
              </Button>
            </div>
          </div>
          {/* Density */}
          <div>
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-subtle dark:text-[#5A5A6A]">
              Density
            </p>
            <div className="flex gap-2">
              <Button
                variant={density === "comfy" ? "primary" : "secondary"}
                className="px-3 py-2 text-[11px]"
                onClick={() => setDensity("comfy")}
              >
                Comfy
              </Button>
              <Button
                variant={density === "compact" ? "primary" : "secondary"}
                className="px-3 py-2 text-[11px]"
                onClick={() => setDensity("compact")}
              >
                Compact
              </Button>
            </div>
          </div>
          <div className="mt-2 rounded-card bg-surface-subtle dark:bg-[#1A1A24] px-3 py-2 text-[11px] text-ink-soft dark:text-[#8E8E9E]">
            These settings are only stored in memory now. Later you can persist
            them per-user in your real backend.
          </div>
        </div>
      </div>
    </div>
  );
}

function ShellInner({ children }: { children: ReactNode }) {
  const { user, isAuthenticated, loginMock, logout } = useAuth();
  const { theme, density } = useUiPrefs();
  const { toast } = useToast();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogin = () => {
    loginMock();
    toast({
      title: "Logged in",
      description: "You're now signed in as Sai (mock user).",
      variant: "success",
    });
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You're back in guest mode.",
      variant: "default",
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-surface-base text-ink-primary dark:bg-[#0A0A0F] dark:text-[#F5F5F5] transition-colors duration-200">
      {/* Header */}
      <header className="border-b border-surface-border dark:border-[#252530] backdrop-blur bg-surface-card/90 dark:bg-[#13131A]/90 transition-colors duration-200">
        <div
          className={cn(
            "mx-auto flex max-w-5xl items-center justify-between",
            density === "comfy" ? "px-4 py-3" : "px-3 py-2"
          )}
        >
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-pink-500 to-brand-pink-400 text-xs font-extrabold tracking-tight text-surface-card shadow-brand">
              SA
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight">
                Streamero Arcade
              </span>
              <span className="text-[11px] text-ink-soft">
                Mini games · Leaderboards
              </span>
            </div>
          </div>
          {/* Nav + auth + settings */}
          <div className="flex items-center gap-3">
            <nav className="hidden md:flex gap-1 text-xs font-medium text-ink-muted dark:text-[#B8B8C8]">
              {[
                { href: "/", label: "Home" },
                { href: "/games", label: "Games" },
                { href: "/leaderboard", label: "Leaderboard" },
                { href: "/profile", label: "Profile" },
              ].map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "rounded-pill px-3 py-1 hover:bg-surface-subtle dark:hover:bg-[#1A1A24] hover:text-ink-primary dark:hover:text-[#F5F5F5] transition-colors",
                      isActive &&
                        "bg-surface-subtle dark:bg-[#1A1A24] text-ink-primary dark:text-[#F5F5F5] border border-surface-border dark:border-[#252530]"
                    )}
                  >
                    {item.label}
                  </a>
                );
              })}
            </nav>
            <div className="flex items-center gap-2 text-[11px]">
              {isAuthenticated && user ? (
                <>
                  <span className="hidden sm:inline text-ink-soft dark:text-[#8E8E9E]">
                    Signed in as{" "}
                    <span className="font-medium">
                      {user.name}
                    </span>
                  </span>
                  <Button
                    variant="ghost"
                    className="px-3 py-1.5 text-[11px]"
                    onClick={handleLogout}
                  >
                    Log out
                  </Button>
                </>
              ) : (
                <>
                  <span className="hidden sm:inline text-ink-soft dark:text-[#8E8E9E]">
                    Guest mode
                  </span>
                  <Button
                    variant="secondary"
                    className="px-3 py-1.5 text-[11px]"
                    onClick={handleLogin}
                  >
                    Log in (mock)
                  </Button>
                </>
              )}
              {/* Settings button */}
              <button
                type="button"
                onClick={() => setSettingsOpen(true)}
                className="inline-flex items-center rounded-pill border border-surface-border dark:border-[#252530] bg-surface-card dark:bg-[#13131A] px-2.5 py-1 text-[11px] text-ink-soft dark:text-[#8E8E9E] hover:bg-surface-subtle dark:hover:bg-[#1A1A24] transition-colors"
              >
                ⚙ Settings
              </button>
            </div>
          </div>
        </div>
      </header>
      {/* Content */}
      <main className="flex-1">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className={cn(
            "mx-auto flex max-w-5xl flex-1 flex-col",
            density === "comfy" ? "px-4 py-6" : "px-3 py-4"
          )}
        >
          {children}
        </motion.div>
      </main>
      {/* Footer */}
      <footer className="border-t border-surface-border dark:border-[#252530] bg-surface-card dark:bg-[#13131A] transition-colors duration-200">
        <div
          className={cn(
            "mx-auto flex max-w-5xl items-center justify-between text-[11px]",
            density === "comfy" ? "px-4 py-3" : "px-3 py-2"
          )}
        >
          <span className="text-ink-soft dark:text-[#8E8E9E]">
            © {new Date().getFullYear()} Streamero Arcade
          </span>
          <span className="flex gap-3">
            <a
              href="/games"
              className="hover:text-ink-primary dark:hover:text-[#F5F5F5] text-ink-soft dark:text-[#8E8E9E] transition-colors"
            >
              Browse games
            </a>
            <a
              href="/leaderboard"
              className="hover:text-ink-primary dark:hover:text-[#F5F5F5] text-ink-soft dark:text-[#8E8E9E] transition-colors"
            >
              Global ranking
            </a>
          </span>
        </div>
      </footer>
      <SettingsDrawer
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
      {/* Mobile dock (hidden on md+) */}
      <div className="md:hidden">
        <Dock
          items={[
            {
              label: "Home",
              icon: <VscHome size={18} />,
              active: pathname === "/",
              onClick: () => router.push("/"),
            },
            {
              label: "Games",
              icon: <VscGame size={18} />,
              active: pathname.startsWith("/games"),
              onClick: () => router.push("/games"),
            },
            {
              label: "Ranks",
              icon: <VscGraphLine size={18} />,
              active: pathname.startsWith("/leaderboard"),
              onClick: () => router.push("/leaderboard"),
            },
            {
              label: "Profile",
              icon: <VscAccount size={18} />,
              active: pathname.startsWith("/profile"),
              onClick: () => router.push("/profile"),
            },
            {
              label: "Settings",
              icon: <VscSettingsGear size={18} />,
              active: false,
              onClick: () => setSettingsOpen(true),
            },
          ]}
          panelHeight={68}
          baseItemSize={50}
          magnification={70}
        />
      </div>
      {/* Add bottom padding on mobile to account for dock */}
      <div className="md:hidden h-24" />
    </div>
  );
}

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <ArcadeClientProvider>
      <ShellInner>{children}</ShellInner>
    </ArcadeClientProvider>
  );
}
