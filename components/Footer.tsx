"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";

interface FooterProps {
  locale: string;
}

export default function Footer({ locale }: FooterProps) {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");
  const year = new Date().getFullYear();

  return (
    <footer className="bg-dark text-cream">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Main footer content */}
        <div className="py-16 md:py-20 grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <p className="font-serif text-2xl tracking-widest mb-4">
              <span className="font-light">SOFIE</span>
              <span className="font-medium"> GULLSTRÖM</span>
            </p>
            <p className="text-cream/60 text-sm leading-relaxed max-w-xs">
              {t("tagline")}
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="eyebrow text-cream/40 mb-6">{t("links")}</p>
            <div className="flex flex-col gap-3">
              {[
                { href: `/${locale}`, label: locale === "sv" ? "Start" : "Home" },
                { href: `/${locale}/portfolio`, label: nav("portfolio") },
                { href: `/${locale}/work-with-me`, label: locale === "sv" ? "Jobba med mig" : "Work with me" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-cream/70 text-sm hover:text-cream transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Social */}
          <div>
            <p className="eyebrow text-cream/40 mb-6">{t("social")}</p>
            <div className="flex flex-col gap-3">
              {[
                { href: "https://instagram.com/sofiegullstrom", label: "@sofiegullstrom" },
                { href: "https://tiktok.com/@sofiegullstrom", label: "@sofiegullstrom (TikTok)" },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cream/70 text-sm hover:text-cream transition-colors duration-200 flex items-center gap-2"
                >
                  {link.label}
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-cream/10 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-cream/30 text-xs tracking-wide">
            © {year} Sofie Gullström. {t("rights")}
          </p>
          <div className="flex items-center gap-6">
            <Link
              href={`/sv`}
              className="text-cream/30 hover:text-cream/60 text-xs tracking-widest uppercase transition-colors duration-200"
            >
              SV
            </Link>
            <Link
              href={`/en`}
              className="text-cream/30 hover:text-cream/60 text-xs tracking-widest uppercase transition-colors duration-200"
            >
              EN
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
