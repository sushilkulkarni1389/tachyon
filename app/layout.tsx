import type { Metadata } from "next";
import "@/styles/terminal.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "TACHYON — Transmissions from 2050",
  description: "A signal from your future self, traveling backwards through time. Earth Day 2026.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
