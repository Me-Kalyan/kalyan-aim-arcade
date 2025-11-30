"use client";

import type { ReactNode } from "react";
import { AuthProvider } from "@/lib/auth";
import { UiPrefsProvider } from "@/lib/ui-prefs";
import { ToastProvider } from "@/lib/toast";
import { SessionSummaryProvider } from "@/lib/session-summary";
import { PlaylistProvider } from "@/lib/playlist";

export function ArcadeClientProvider({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <UiPrefsProvider>
        <ToastProvider>
          <SessionSummaryProvider>
            <PlaylistProvider>{children}</PlaylistProvider>
          </SessionSummaryProvider>
        </ToastProvider>
      </UiPrefsProvider>
    </AuthProvider>
  );
}

