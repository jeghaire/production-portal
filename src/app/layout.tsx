import type { Metadata } from "next";
import { geistVF } from "@/app/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "HEOSL Production Portal",
  description: "HEOSL production view portal for reports and analytics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistVF.variable} antialiased font-geistVF scroll-smooth`}
      >
        {children}
      </body>
    </html>
  );
}
