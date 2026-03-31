"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useRef, useState, useEffect } from "react";

interface PortfolioSectionProps {
  locale: string;
}

type CategoryId =
  | "beauty"
  | "mat"
  | "mode"
  | "hem"
  | "familj"
  | "elektronik"
  | "halsa"
  | "lets-work";

interface Category {
  id: CategoryId;
  sv: string;
  en: string;
  cover: string | null;
  count_sv: string;
  count_en: string;
}

const CATEGORIES: Category[] = [
  {
    id: "beauty",
    sv: "Beauty & Skincare",
    en: "Beauty & Skincare",
    cover: "/images/beauty/IMG_9017.jpg",
    count_sv: "5 projekt",
    count_en: "5 projects",
  },
  {
    id: "mat",
    sv: "Mat & Dryck",
    en: "Food & Drink",
    cover: "/images/portfolio/p16.jpg",
    count_sv: "4 projekt",
    count_en: "4 projects",
  },
  {
    id: "mode",
    sv: "Mode & Stil",
    en: "Fashion & Style",
    cover: "/images/mode/IMG_2660.jpg",
    count_sv: "4 projekt",
    count_en: "4 projects",
  },
  {
    id: "hem",
    sv: "Hem & Inredning",
    en: "Home & Décor",
    cover: "/images/hem/IMG_0852.jpg",
    count_sv: "3 projekt",
    count_en: "3 projects",
  },
  {
    id: "familj",
    sv: "Familj & Föräldraskap",
    en: "Family & Parenting",
    cover: "/images/familj/IMG_6150.JPG",
    count_sv: "4 projekt",
    count_en: "4 projects",
  },
  {
    id: "elektronik",
    sv: "Elektronik & Tech",
    en: "Tech & Electronics",
    cover: "/images/elektronik/0B645D3D-2462-4861-983B-E7349F588CA4.JPG",
    count_sv: "3 projekt",
    count_en: "3 projects",
  },
  {
    id: "halsa",
    sv: "Hälsa & Träning",
    en: "Health & Wellness",
    cover: "/images/halsa/CE1FED39-8F36-48F9-AFFF-B2AEF2B0DBA7.JPG",
    count_sv: "3 projekt",
    count_en: "3 projects",
  },
  {
    id: "lets-work",
    sv: "Jobba med mig",
    en: "Let's work together",
    cover: "/images/see-all-collage.jpg",
    count_sv: "",
    count_en: "",
  },
];

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function CategoryCard({ cat, locale, index }: { cat: Category; locale: string; index: number }) {
  const [hovered, setHovered] = useState(false);
  const { ref, visible } = useReveal();
  const isLetsWork = cat.id === "lets-work";
  const label = locale === "sv" ? cat.sv : cat.en;

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.7s ease ${index * 60}ms, transform 0.7s ease ${index * 60}ms`,
      }}
    >
      <Link
        href={isLetsWork ? `/${locale}/work-with-me` : `/${locale}/portfolio/${cat.id}`}
        className="group block focus:outline-none focus-visible:outline-2 focus-visible:outline-merlot"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Image */}
        <div
          className="relative overflow-hidden"
          style={{ aspectRatio: "4/5" }}
        >
          {/* Cover image */}
          <Image
            src={cat.cover!}
            alt={label}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-[1.07]"
            sizes="(max-width: 768px) 50vw, 25vw"
          />

          {isLetsWork ? (
            <>
              {/* Let's work — always dark overlay */}
              <div
                className="absolute inset-0 transition-all duration-500"
                style={{ background: hovered ? "rgba(20,10,6,0.72)" : "rgba(20,10,6,0.52)" }}
              />
              {/* Centred label with merlot accent lines */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <div
                  className="transition-all duration-500"
                  style={{ width: hovered ? "32px" : "20px", height: "1px", background: "rgba(180,80,80,0.8)" }}
                />
                <div
                  style={{
                    border: "1px solid rgba(250,247,242,0.55)",
                    padding: "10px 22px",
                    transform: hovered ? "scale(1.04)" : "scale(1)",
                    transition: "transform 0.4s ease",
                  }}
                >
                  <span
                    className="font-serif font-light uppercase"
                    style={{ color: "rgba(250,247,242,0.92)", fontSize: "clamp(10px, 1vw, 13px)", letterSpacing: "0.22em" }}
                  >
                    {locale === "sv" ? "Jobba med mig" : "Let's work together"}
                  </span>
                </div>
                <div
                  className="transition-all duration-500"
                  style={{ width: hovered ? "32px" : "20px", height: "1px", background: "rgba(180,80,80,0.8)" }}
                />
              </div>
            </>
          ) : (
            <>
              {/* Permanent gradient overlay — always visible, deeper on hover */}
              <div
                className="absolute inset-x-0 bottom-0 transition-all duration-500"
                style={{
                  height: hovered ? "70%" : "55%",
                  background: "linear-gradient(to top, rgba(20,10,6,0.82) 0%, rgba(20,10,6,0.45) 50%, transparent 100%)",
                }}
              />

              {/* Category name — always visible at bottom */}
              <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
                <p
                  className="font-serif font-light text-cream leading-tight"
                  style={{ fontSize: "clamp(13px, 1.6vw, 18px)", letterSpacing: "0.03em" }}
                >
                  {label}
                </p>
              </div>

              {/* Arrow icon — top-right on hover */}
              <div
                className="absolute top-3 right-3 transition-all duration-400"
                style={{ opacity: hovered ? 1 : 0, transform: hovered ? "translate(0,0)" : "translate(4px,-4px)" }}
              >
                <div className="w-7 h-7 rounded-full bg-cream/90 flex items-center justify-center">
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                    <path d="M2 10L10 2M10 2H4M10 2V8" stroke="#2C1A0E" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>

              {/* Merlot bottom accent on hover */}
              <div
                className="absolute bottom-0 left-0 right-0 bg-merlot transition-all duration-400"
                style={{ height: hovered ? "3px" : "0px" }}
              />
            </>
          )}
        </div>
      </Link>
    </div>
  );
}

const PORTFOLIO_BG: React.CSSProperties = {
  background: "#1A0D07",
  backgroundImage: `
    linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)
  `,
  backgroundSize: "80px 80px",
};

export default function PortfolioSection({ locale }: PortfolioSectionProps) {
  return (
    <section id="portfolio" className="py-20 md:py-28" style={PORTFOLIO_BG}>
      <div className="max-w-7xl mx-auto px-6 md:px-10">

        {/* Heading */}
        <div className="mb-14 md:mb-18">
          <h2 className="font-serif text-4xl md:text-5xl font-light tracking-wide" style={{ color: "rgba(250,247,242,0.88)" }}>
            Portfolio
          </h2>
        </div>

        {/* 4×2 grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
          {CATEGORIES.map((cat, i) => (
            <CategoryCard key={cat.id} cat={cat} locale={locale} index={i} />
          ))}
        </div>

      </div>
    </section>
  );
}
