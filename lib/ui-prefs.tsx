"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Theme = "light" | "dark";
export type Density = "comfy" | "compact";

type UiPrefsContextValue = {
  theme: Theme;
  density: Density;
  setTheme: (t: Theme) => void;
  setDensity: (d: Density) => void;
};

const UiPrefsContext = createContext<UiPrefsContextValue | undefined>(
  undefined
);

export function UiPrefsProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [density, setDensity] = useState<Density>("comfy");
  const [mounted, setMounted] = useState(false);

  // Apply theme to HTML element for Tailwind dark mode
  useEffect(() => {
    setMounted(true);
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  // Load theme from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("theme-preference");
      if (stored === "dark" || stored === "light") {
        setTheme(stored);
      } else {
        // Check system preference
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        setTheme(prefersDark ? "dark" : "light");
      }
    }
  }, []);

  // Persist theme changes
  useEffect(() => {
    if (mounted && typeof window !== "undefined") {
      localStorage.setItem("theme-preference", theme);
    }
  }, [theme, mounted]);

  const handleSetTheme = (t: Theme) => {
    setTheme(t);
  };

  const value = useMemo(
    () => ({
      theme,
      density,
      setTheme: handleSetTheme,
      setDensity,
    }),
    [theme, density]
  );

  return (
    <UiPrefsContext.Provider value={value}>
      {children}
    </UiPrefsContext.Provider>
  );
}

export function useUiPrefs() {
  const ctx = useContext(UiPrefsContext);
  if (!ctx) {
    throw new Error("useUiPrefs must be used within <UiPrefsProvider>");
  }
  return ctx;
}

