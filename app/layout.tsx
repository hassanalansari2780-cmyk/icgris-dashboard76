export const metadata = {
  title: "ICGRIS Dashboard",
  description: "Integrated Contract Governance & Risk Intelligence System",
};

import "./globals.css";
import React from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900">{children}</body>
    </html>
  );
}
