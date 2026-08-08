import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "i am significant",
  description: "Minimal astrology landing page",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
