import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Sofie Gullström – Foto, Video & Innehåll",
    template: "%s | Sofie Gullström",
  },
  description:
    "Kreativ allround-kreatör baserad i Sverige. Foto, video, UGC, sociala medier och marknadsstrategi.",
  keywords: [
    "fotograf",
    "videograf",
    "UGC",
    "sociala medier",
    "innehållsstrategi",
    "Sverige",
    "Sofie Gullström",
  ],
  openGraph: {
    type: "website",
    locale: "sv_SE",
    alternateLocale: "en_US",
    siteName: "Sofie Gullström",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sv" className={`${cormorant.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
