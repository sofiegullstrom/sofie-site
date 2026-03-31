"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface NavigationProps {
  locale: string;
}

export default function Navigation({ locale }: NavigationProps) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [btnUp, setBtnUp] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const otherLocale = locale === "sv" ? "en" : "sv";
  const otherLocalePath = pathname.replace(`/${locale}`, `/${otherLocale}`);

  useEffect(() => {
    const handleScroll = () => {
      const sy = window.scrollY;
      setScrolled(sy > 40);
      // Rise the button once hero has scrolled enough
      setBtnUp(sy > window.innerHeight * 0.55);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: `/${locale}/portfolio`, label: t("portfolio") },
    { href: `/${locale}/work-with-me`, label: t("contact") },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-cream/15 backdrop-blur-xl border-b border-cream/20 shadow-sm py-4"
          : "bg-transparent py-6"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between">

        {/* Left group: SG logo + rising button */}
        <div className="flex items-center gap-5">
          {/* SG logo */}
          <Link
            href={`/${locale}`}
            className="flex-shrink-0 flex items-center"
            aria-label="Sofie Gullström — home"
          >
            <span
              className="font-serif text-2xl font-light tracking-[0.12em] select-none"
              style={{ color: scrolled ? "#2C1A0E" : "#FAF7F2", transition: "color 0.5s ease" }}
            >
              SG
            </span>
          </Link>

          {/* Rising button — clips overflow so it slides up from below */}
          <div
            className="overflow-hidden"
            style={{ height: "34px", display: "flex", alignItems: "center" }}
          >
            <Link
              href={`/${locale}/work-with-me`}
              className="inline-flex items-center bg-merlot text-cream text-[10px] tracking-[0.18em] uppercase font-sans hover:opacity-80 transition-opacity duration-200 whitespace-nowrap"
              style={{
                padding: "7px 16px",
                transform: btnUp ? "translateY(0)" : "translateY(42px)",
                transition: "transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              {locale === "sv" ? "Jobba med mig" : "Let's work together"}
            </Link>
          </div>
        </div>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="nav-link">
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side: social + lang */}
        <div className="hidden md:flex items-center gap-6">
          <a
            href="https://instagram.com/sofiigullstrom"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-50 transition-opacity duration-200"
            style={{ color: scrolled ? "#2C1A0E" : "#FAF7F2", transition: "color 0.5s ease" }}
            aria-label="Instagram"
          >
            <InstagramIcon />
          </a>
          <a
            href="https://tiktok.com/@sofiigullstrom"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-50 transition-opacity duration-200"
            style={{ color: scrolled ? "#2C1A0E" : "#FAF7F2", transition: "color 0.5s ease" }}
            aria-label="TikTok"
          >
            <TikTokIcon />
          </a>
          <Link
            href={otherLocalePath}
            className="border-l border-sand pl-6 opacity-80 hover:opacity-100 transition-opacity duration-200"
            aria-label={otherLocale === "sv" ? "Byt till svenska" : "Switch to English"}
          >
            {otherLocale === "sv" ? <FlagSE /> : <FlagGB />}
          </Link>
        </div>

        {/* Mobile: lang + burger */}
        <div className="flex md:hidden items-center gap-4">
          <Link
            href={otherLocalePath}
            className="opacity-80 hover:opacity-100 transition-opacity duration-200"
            aria-label={otherLocale === "sv" ? "Byt till svenska" : "Switch to English"}
          >
            {otherLocale === "sv" ? <FlagSE /> : <FlagGB />}
          </Link>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex flex-col gap-1.5 p-1"
            aria-label="Meny"
          >
            <span
              className={`block w-6 h-px transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
              style={{ background: scrolled ? "#2C1A0E" : "#FAF7F2" }}
            />
            <span
              className={`block w-6 h-px transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}
              style={{ background: scrolled ? "#2C1A0E" : "#FAF7F2" }}
            />
            <span
              className={`block w-6 h-px transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
              style={{ background: scrolled ? "#2C1A0E" : "#FAF7F2" }}
            />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`md:hidden transition-all duration-500 overflow-hidden ${menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="bg-cream/98 backdrop-blur-sm border-t border-sand/30 px-6 py-8 flex flex-col gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="nav-link text-base"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={`/${locale}/work-with-me`}
            className="btn-primary w-fit text-xs"
            onClick={() => setMenuOpen(false)}
          >
            {locale === "sv" ? "Jobba med mig" : "Let's work together"}
          </Link>
          <div className="flex items-center gap-6 pt-4 border-t border-sand/30">
            <a href="https://instagram.com/sofiigullstrom" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <InstagramIcon />
            </a>
            <a href="https://tiktok.com/@sofiigullstrom" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
              <TikTokIcon />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.27 8.27 0 004.83 1.55V6.79a4.85 4.85 0 01-1.06-.1z" />
    </svg>
  );
}

function FlagSE() {
  return (
    <svg width="22" height="16" viewBox="0 0 22 16" xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: 2 }}>
      <rect width="22" height="16" fill="#006AA7" />
      <rect x="6" width="3" height="16" fill="#FECC02" />
      <rect y="6.5" width="22" height="3" fill="#FECC02" />
    </svg>
  );
}

function FlagGB() {
  return (
    <svg width="22" height="16" viewBox="0 0 22 16" xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: 2 }}>
      <rect width="22" height="16" fill="#012169" />
      <path d="M0,0 L22,16 M22,0 L0,16" stroke="#fff" strokeWidth="3.2" />
      <path d="M0,0 L22,16 M22,0 L0,16" stroke="#C8102E" strokeWidth="2" />
      <path d="M11,0 V16 M0,8 H22" stroke="#fff" strokeWidth="5.5" />
      <path d="M11,0 V16 M0,8 H22" stroke="#C8102E" strokeWidth="3.5" />
    </svg>
  );
}
