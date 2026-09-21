import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Application Form",
  description: "Secure application form",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}