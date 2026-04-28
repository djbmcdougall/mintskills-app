import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MintSkills — Verified AI Skills Marketplace",
  description: "Buy and sell verified Claude skills. Stop open sourcing your income.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
