"use client";

import { useRef, useState, useEffect } from "react";

interface FollowSectionProps {
  locale: string;
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

export default function FollowSection({ locale }: FollowSectionProps) {
  const [offset, setOffset] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { ref: textRef, visible } = useReveal(0.15);

  useEffect(() => {
    if (reduced) return;
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const viewH = window.innerHeight;
      if (rect.bottom > 0 && rect.top < viewH) {
        const progress = (viewH - rect.top) / (viewH + rect.height);
        setOffset((progress - 0.5) * 160);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      aria-label={locale === "sv" ? "Följ mig på sociala medier" : "Follow me on social media"}
      className="relative overflow-hidden w-full"
      style={{ height: "85vh", minHeight: 520, maxHeight: 800 }}
    >
      {/* Parallax image — full-width, no side gaps */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          transform: reduced ? "none" : `translateY(${offset}px)`,
          transition: reduced ? "none" : "transform 0.05s linear",
          willChange: reduced ? "auto" : "transform",
          top: "-12%",
          bottom: "-12%",
          left: 0,
          right: 0,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/sociala-medier.jpg"
          alt=""
          role="presentation"
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center center" }}
        />
      </div>

      {/* Dark gradient overlays — left/right edges and top/bottom */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: "linear-gradient(to right, rgba(26,10,13,0.72) 0%, rgba(26,10,13,0.18) 40%, rgba(26,10,13,0.18) 60%, rgba(26,10,13,0.72) 100%)" }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: "linear-gradient(to bottom, rgba(26,10,13,0.25) 0%, transparent 30%, transparent 60%, rgba(26,10,13,0.55) 100%)" }}
      />

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div
          ref={textRef}
          className="px-6 sm:px-8 md:px-20 w-full max-w-lg"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 1s ease, transform 1s ease",
          }}
        >
          <p className="eyebrow text-sand/60 mb-5 tracking-ultra-wide">
            {locale === "sv" ? "Följ resan" : "Follow the journey"}
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-6xl font-light text-cream tracking-wide leading-tight mb-6">
            {locale === "sv" ? "Häng med\nbakoms kulisserna" : "Come behind\nthe scenes"}
          </h2>
          <p className="text-cream/70 text-sm font-sans leading-relaxed tracking-wide mb-8 max-w-xs">
            {locale === "sv"
              ? "Content, samarbeten, resor och äkta vardagsliv. Finns på Instagram och TikTok."
              : "Content, collaborations, travel and real everyday life. On Instagram and TikTok."}
          </p>
          <div className="flex flex-col gap-3 w-full max-w-[280px]">
            <a
              href="https://instagram.com/sofiegullstrom"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={locale === "sv" ? "Följ Sofie på Instagram (öppnas i ny flik)" : "Follow Sofie on Instagram (opens in new tab)"}
              className="inline-flex items-center gap-2.5 min-h-[44px] px-5 py-3 text-[11px] tracking-widest uppercase font-sans transition-all duration-300 hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-sand focus-visible:outline-offset-2"
              style={{ background: "rgba(250,247,242,0.12)", backdropFilter: "blur(12px)", border: "1px solid rgba(250,247,242,0.25)", color: "#FAF7F2" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="flex-shrink-0">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
              </svg>
              <span>{locale === "sv" ? "Följ på Instagram" : "Follow on Instagram"}</span>
            </a>
            <a
              href="https://tiktok.com/@sofiegullstrom"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={locale === "sv" ? "Följ Sofie på TikTok (öppnas i ny flik)" : "Follow Sofie on TikTok (opens in new tab)"}
              className="inline-flex items-center gap-2.5 min-h-[44px] px-5 py-3 text-[11px] tracking-widest uppercase font-sans transition-all duration-300 hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-sand focus-visible:outline-offset-2"
              style={{ background: "rgba(250,247,242,0.10)", backdropFilter: "blur(12px)", border: "1px solid rgba(250,247,242,0.20)", color: "#FAF7F2" }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="flex-shrink-0">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.27 8.27 0 004.83 1.55V6.79a4.85 4.85 0 01-1.06-.1z"/>
              </svg>
              <span>{locale === "sv" ? "Följ på TikTok" : "Follow on TikTok"}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
