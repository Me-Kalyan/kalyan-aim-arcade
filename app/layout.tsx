import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthShell } from "@/components/AuthShell";

export const viewport: Viewport = {
  themeColor: "#ff4ddb",
};

export const metadata: Metadata = {
  title: "Kalyan Aim Arcade",
  description: "Aim training mini-games with live leaderboards.",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", type: "image/x-icon" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Kalyan Aim Arcade",
    description: "Warm up your aim with KAA mini-games and global ranks.",
    url: "https://kalyan-aim-arcade.vercel.app",
    siteName: "Kalyan Aim Arcade",
    images: [
      {
        url: "/logo-social-1200x630.png",
        width: 1200,
        height: 630,
        alt: "KAA neon aim logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kalyan Aim Arcade",
    description: "Aim trainer arcade with live stats.",
    images: ["/logo-social-1200x630.png"],
  },
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

