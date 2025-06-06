import "./globals.css";
import type { Metadata, Viewport } from "next";
import { geistVF } from "@/app/fonts";
import ThemeProvider from "./theme-provider";

export const metadata: Metadata = {
  title: "HEOSL Production Portal",
  description: "HEOSL production view portal for reports and analytics",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "HEOSL Production Portal",
  },
  themeColor: "#000000",
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      {
        url: "/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#0A0A0A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
      </head>
      <body
        className={`${geistVF.variable} antialiased font-geistVF scroll-smooth`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
