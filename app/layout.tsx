import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const editorial = Cormorant_Garamond({
  variable: "--font-editorial",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rishi Dabhi | Graduate Software Engineer at Sage",
  description:
    "Rishi Dabhi, Graduate Software Engineer at Sage. Previously at CERN and Johnson Controls. Exploring full-stack development, AI, and intelligent systems.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${editorial.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
