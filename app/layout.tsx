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
  metadataBase: new URL("https://sofiegullstrom.com"),
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  title: {
    default: "Sofie Gullström – UGC Creator & Digital Konsult",
    template: "%s | Sofie Gullström",
  },
  description:
    "Sofie Gullström är en UGC-skapare och digital konsult med 10+ års erfarenhet. Foto, video, influencer-samarbeten och marknadsstrategi för svenska och internationella varumärken.",
  keywords: [
    "UGC creator Sverige",
    "UGC skapare",
    "influencer Sverige",
    "fotograf Sverige",
    "videoproducent",
    "sociala medier konsult",
    "marknadsstrategi",
    "innehållsstrategi",
    "Sofie Gullström",
    "digital konsult",
    "content creator",
    "produktfoto",
    "reklamfilm",
    "Instagram Sverige",
    "TikTok creator",
  ],
  openGraph: {
    type: "website",
    locale: "sv_SE",
    alternateLocale: ["en_US"],
    siteName: "Sofie Gullström",
    title: "Sofie Gullström – UGC Creator & Digital Konsult",
    description:
      "UGC-skapare och digital konsult med 10+ års erfarenhet. Foto, video, influencer-samarbeten för svenska och internationella varumärken.",
    url: "https://sofiegullstrom.com",
    images: [
      {
        url: "/images/hero.jpg",
        width: 1200,
        height: 630,
        alt: "Sofie Gullström – UGC Creator & Digital Konsult",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sofie Gullström – UGC Creator & Digital Konsult",
    description:
      "UGC-skapare och digital konsult med 10+ års erfarenhet. Foto, video och sociala medier.",
    images: ["/images/hero.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  alternates: {
    canonical: "https://sofiegullstrom.com/sv",
    languages: {
      sv: "https://sofiegullstrom.com/sv",
      en: "https://sofiegullstrom.com/en",
    },
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
