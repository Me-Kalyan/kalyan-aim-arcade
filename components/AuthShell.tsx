"use client";

import type { ReactNode } from "react";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUiPrefs } from "@/lib/ui-prefs";
import { useToast } from "@/lib/toast";
import { ArcadeClientProvider } from "@/components/ArcadeClientProvider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import Dock from "@/components/Dock";
import { PageTransition } from "@/components/layout/PageTransition";
import { getPlayerName, hasProfile } from "@/lib/player";
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
            className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-subtle dark:bg-[#1A1A24] hover:bg-surface-subtle/80 dark:hover:bg-[#1A1A24]/80 text-ink-soft dark:text-[#8E8E9E] hover:text-ink-primary dark:hover:text-[#F5F5F5] transition"
            aria-label="Close settings"
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
  const { density } = useUiPrefs();
  const { toast } = useToast();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [playerName, setPlayerName] = useState<string | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const name = getPlayerName();
    setPlayerName(name);
    setLoggedIn(hasProfile() && !!name);
  }, []);

  // Listen for name updates
  useEffect(() => {
    if (typeof window === "undefined") return;
    const updateName = () => {
      const name = getPlayerName();
      setPlayerName(name);
      setLoggedIn(hasProfile() && !!name);
    };
    const handleStorageChange = () => updateName();
    const handleNameUpdate = () => updateName();
    
    // Check on mount and pathname change
    updateName();
    
    // Listen for storage events (from other tabs)
    window.addEventListener("storage", handleStorageChange);
    // Listen for custom event (from same tab)
    window.addEventListener("playerNameUpdated", handleNameUpdate);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("playerNameUpdated", handleNameUpdate);
    };
  }, [pathname]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("kaa-player-id");
      window.localStorage.removeItem("kaa-player-name");
      setPlayerName(null);
      setLoggedIn(false);
      toast({
        title: "Logged out",
        description: "Your profile has been cleared.",
        variant: "default",
      });
      window.location.href = "/";
    }
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
              {loggedIn && playerName ? (
                <>
                  <span className="hidden sm:inline text-xs sm:text-sm text-ink-soft dark:text-[#8E8E9E]">
                    Signed in as{" "}
                    <span className="font-semibold">
                      {playerName}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="rounded-full border border-white/30 dark:border-white/15 px-4 py-1.5 text-sm font-semibold hover:bg-white/10 dark:hover:bg-white/10 transition"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => router.push("/profile")}
                  className="rounded-full border border-white/30 dark:border-white/15 px-4 py-1.5 text-sm font-semibold hover:bg-white/10 dark:hover:bg-white/10 transition"
                >
                  Log in
                </button>
              )}
              {/* Settings button */}
              <button
                type="button"
                onClick={() => setSettingsOpen(true)}
                className="inline-flex items-center justify-center rounded-full border border-white/15 dark:border-white/15 px-3.5 py-1.5 text-xs sm:text-sm text-ink-soft dark:text-[#8E8E9E] hover:text-white dark:hover:text-white hover:bg-white/10 dark:hover:bg-white/10 transition"
              >
                <span className="mr-1.5 text-[13px]">⚙</span>
                <span>Settings</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      {/* Content */}
      <main className="flex-1">
        <PageTransition>
          <div
            className={cn(
              "mx-auto flex max-w-5xl flex-1 flex-col",
              density === "comfy" ? "px-4 py-6" : "px-3 py-4"
            )}
          >
            {children}
          </div>
        </PageTransition>
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
