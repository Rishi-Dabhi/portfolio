import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Bundle the fonts to avoid Google's build-time URL parsing and fetch failures.
const inter = localFont({
  src: "./fonts/inter-latin-variable.woff2",
  variable: "--font-inter",
  weight: "400 700",
  style: "normal",
  display: "swap",
  adjustFontFallback: "Arial",
});

const editorial = localFont({
  src: [
    { path: "./fonts/cormorant-garamond-latin-variable.woff2", weight: "400 600", style: "normal" },
    { path: "./fonts/cormorant-garamond-latin-italic-variable.woff2", weight: "400 600", style: "italic" },
  ],
  variable: "--font-editorial",
  display: "swap",
  adjustFontFallback: "Times New Roman",
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
