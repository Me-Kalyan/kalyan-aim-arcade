import type { Metadata } from "next";
import "./globals.css";
import { AuthShell } from "@/components/AuthShell";

export const metadata: Metadata = {
  title: "Streamero Arcade",
  description: "Mini games and leaderboards using a streaming-style design.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-surface-base text-ink-primary antialiased">
        <AuthShell>{children}</AuthShell>
      </body>
    </html>
  );
}

