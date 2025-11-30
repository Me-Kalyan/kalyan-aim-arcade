"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useMemo,
} from "react";

export type AuthUser = {
  name: string;
  handle: string;
  tier: string;
  joined: string;
  totalGames: number;
  bestRank: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loginMock: () => void;
  logout: () => void;
};

const defaultUser: AuthUser = {
  name: "Sai",
  handle: "@sai_arcade",
  tier: "Diamond",
  joined: "Nov 2024",
  totalGames: 127,
  bestRank: "#12 global",
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // start logged in by default
  const [user, setUser] = useState<AuthUser | null>(defaultUser);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      loginMock: () => setUser(defaultUser),
      logout: () => setUser(null),
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within <AuthProvider>");
  }
  return ctx;
}

