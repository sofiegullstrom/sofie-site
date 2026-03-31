"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect, useCallback } from "react";

interface SeeAllClientProps {
  locale: string;
}

// ─── Types ────────────────────────────────────────────────────────────────────
type Item = {
  kind: "image" | "video";
  src: string;
  category: string;
  category_sv: string;
};

const ITEMS: Item[] = [
  { kind: "image", src: "/images/see-all/sa1.jpg",  category: "Fashion",   category_sv: "Mode"      },
  { kind: "video", src: "/images/see-all/sv1.mp4",  category: "Fashion",   category_sv: "Mode"      },
  { kind: "video", src: "/images/see-all/sv2.mp4",  category: "Fashion",   category_sv: "Mode"      },
  { kind: "image", src: "/images/see-all/sa2.jpg",  category: "Beauty",    category_sv: "Beauty"    },
  { kind: "video", src: "/images/see-all/sv3.mp4",  category: "Beauty",    category_sv: "Beauty"    },
  { kind: "video", src: "/images/see-all/sv4.mp4",  category: "Beauty",    category_sv: "Beauty"    },
  { kind: "image", src: "/images/see-all/sa3.jpg",  category: "Home",      category_sv: "Hem"       },
  { kind: "video", src: "/images/see-all/sv5.mp4",  category: "Wellness",  category_sv: "Träning"   },
  { kind: "video", src: "/images/see-all/sv6.mp4",  category: "Wellness",  category_sv: "Träning"   },
  { kind: "image", src: "/images/see-all/sa4.jpg",  category: "Tech",      category_sv: "Elektronik"},
  { kind: "video", src: "/images/see-all/sv7.mp4",  category: "Tech",      category_sv: "Elektronik"},
  { kind: "image", src: "/images/see-all/sa5.jpg",  category: "Family",    category_sv: "Familj"    },
  { kind: "image", src: "/images/see-all/sa6.jpg",  category: "Family",    category_sv: "Familj"    },
  { kind: "video", src: "/images/see-all/sv8.mp4",  category: "Family",    category_sv: "Familj"    },
  { kind: "video", src: "/images/see-all/sv9.mp4",  category: "Family",    category_sv: "Familj"    },
  { kind: "image", src: "/images/see-all/sa7.jpg",  category: "Food",      category_sv: "Mat"       },
  { kind: "video", src: "/images/see-all/sv10.mp4", category: "Food",      category_sv: "Mat"       },
];

// ─── Hooks ────────────────────────────────────────────────────────────────────
function useReveal(direction: "up" | "left" | "right" | "scale" = "up", threshold = 0.06) {
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

  const from: Record<string, string> = {
    up:    "translateY(40px)",
    left:  "translateX(-40px)",
    right: "translateX(40px)",
    scale: "scale(0.94)",
  };

  return { ref, visible, fromTransform: from[direction] };
}

function useMarqueeScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    let x = 0;
    const tick = () => {
      x -= 0.5;
      const el = ref.current;
      if (el) {
        const half = el.scrollWidth / 2;
        if (Math.abs(x) >= half) x = 0;
      }
      setOffset(x);
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, []);

  return { ref, offset };
}

// ─── Media card ───────────────────────────────────────────────────────────────
interface CardProps {
  item: Item;
  locale: string;
  delay?: number;
  direction?: "up" | "left" | "right" | "scale";
  sizes?: string;
  style?: React.CSSProperties;
}

function MediaCard({ item, locale, delay = 0, direction = "up", sizes, style }: CardProps) {
  const { ref, visible, fromTransform } = useReveal(direction);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hovered, setHovered] = useState(false);

  const onEnter = useCallback(() => {
    setHovered(true);
    if (item.kind === "video") videoRef.current?.play().catch(() => {});
  }, [item.kind]);

  const onLeave = useCallback(() => {
    setHovered(false);
    if (item.kind === "video" && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [item.kind]);

  const catLabel = locale === "sv" ? item.category_sv : item.category;

  return (
    <div
      ref={ref}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        position: "relative",
        overflow: "hidden",
        background: "#E8E3DC",
        cursor: "pointer",
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : fromTransform,
        transition: `opacity 0.85s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.85s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        ...style,
      }}
    >
      {/* Media */}
      {item.kind === "image" ? (
        <Image
          src={item.src}
          alt={catLabel}
          fill
          className="object-cover"
          style={{
            transform: hovered ? "scale(1.05)" : "scale(1)",
            transition: "transform 0.9s cubic-bezier(0.16,1,0.3,1)",
          }}
          sizes={sizes ?? "(max-width: 768px) 100vw, 50vw"}
        />
      ) : (
        <video
          ref={videoRef}
          src={item.src}
          className="w-full h-full object-cover"
          muted playsInline loop preload="metadata"
          style={{
            transform: hovered ? "scale(1.03)" : "scale(1)",
            transition: "transform 0.9s cubic-bezier(0.16,1,0.3,1)",
          }}
        />
      )}

      {/* Dark overlay */}
      <div
        style={{
          position: "absolute", inset: 0,
          background: hovered ? "rgba(20,10,5,0.3)" : "rgba(20,10,5,0.06)",
          transition: "background 0.5s ease",
          pointerEvents: "none",
        }}
      />

      {/* Video play icon (not hovered) */}
      {item.kind === "video" && !hovered && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "rgba(250,247,242,0.72)",
            backdropFilter: "blur(6px)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M3.5 2L9.5 6L3.5 10V2Z" fill="#2C1A0E"/>
            </svg>
          </div>
        </div>
      )}

      {/* Category label slides up on hover */}
      <div
        style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          padding: "28px 16px 14px",
          background: "linear-gradient(to top, rgba(20,10,5,0.55) 0%, transparent 100%)",
          transform: hovered ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1)",
          pointerEvents: "none",
        }}
      >
        <span style={{
          fontFamily: "sans-serif",
          fontSize: 10,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "rgba(250,247,242,0.85)",
          fontWeight: 400,
        }}>
          {catLabel}
        </span>
      </div>
    </div>
  );
}

// ─── Marquee strip ────────────────────────────────────────────────────────────
function Marquee({ locale }: { locale: string }) {
  const { ref, offset } = useMarqueeScroll();
  const isSv = locale === "sv";
  const tags = isSv
    ? ["Mode", "Beauty", "Hem & Inredning", "Hälsa & Träning", "Elektronik", "Familj", "Mat & Dryck"]
    : ["Fashion", "Beauty", "Home & Décor", "Health & Wellness", "Tech", "Family", "Food & Drink"];

  const repeated = [...tags, ...tags, ...tags, ...tags];

  return (
    <div style={{ overflow: "hidden", borderTop: "1px solid rgba(44,26,14,0.1)", borderBottom: "1px solid rgba(44,26,14,0.1)", padding: "14px 0", margin: "0" }}>
      <div ref={ref} style={{ display: "flex", whiteSpace: "nowrap", transform: `translateX(${offset}px)`, willChange: "transform" }}>
        {repeated.map((tag, i) => (
          <span key={i} style={{ fontFamily: "var(--font-serif, serif)", fontSize: "clamp(12px,1.1vw,15px)", fontWeight: 300, color: "var(--color-mocha, #5C4A3A)", letterSpacing: "0.15em", padding: "0 32px", opacity: 0.6 }}>
            {tag}
            <span style={{ marginLeft: 32, color: "var(--color-merlot, #722F37)", fontSize: "0.6em", verticalAlign: "middle" }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Pull quote ───────────────────────────────────────────────────────────────
function PullQuote({ locale }: { locale: string }) {
  const { ref, visible } = useReveal("scale", 0.2);
  const isSv = locale === "sv";
  return (
    <div ref={ref} style={{
      padding: "72px 40px",
      textAlign: "center",
      opacity: visible ? 1 : 0,
      transform: visible ? "none" : "scale(0.96)",
      transition: "opacity 1s cubic-bezier(0.16,1,0.3,1), transform 1s cubic-bezier(0.16,1,0.3,1)",
    }}>
      <p style={{
        fontFamily: "var(--font-serif, serif)",
        fontSize: "clamp(22px, 3.5vw, 46px)",
        fontWeight: 300,
        lineHeight: 1.25,
        color: "var(--color-dark, #2C1A0E)",
        letterSpacing: "0.02em",
        maxWidth: 820,
        margin: "0 auto",
      }}>
        {isSv
          ? <>Content som <em style={{ color: "var(--color-merlot,#722F37)", fontStyle: "italic" }}>berör</em>, kampanjer som skapar<br/>verkliga <em style={{ color: "var(--color-merlot,#722F37)", fontStyle: "italic" }}>avtryck</em>.</>
          : <>Content that <em style={{ color: "var(--color-merlot,#722F37)", fontStyle: "italic" }}>connects</em>, campaigns that leave<br/>a lasting <em style={{ color: "var(--color-merlot,#722F37)", fontStyle: "italic" }}>mark</em>.</>
        }
      </p>
      <div style={{ width: 32, height: 1.5, background: "var(--color-merlot,#722F37)", margin: "28px auto 0" }} />
    </div>
  );
}

// ─── Section counter ──────────────────────────────────────────────────────────
function SectionMark({ n, label }: { n: string; label: string }) {
  const { ref, visible } = useReveal("left");
  return (
    <div ref={ref} style={{
      display: "flex", alignItems: "baseline", gap: 12,
      padding: "40px 0 24px",
      opacity: visible ? 1 : 0,
      transform: visible ? "none" : "translateX(-40px)",
      transition: "opacity 0.7s ease, transform 0.7s ease",
    }}>
      <span style={{ fontFamily: "var(--font-serif,serif)", fontSize: "clamp(36px,4vw,52px)", fontWeight: 300, color: "var(--color-merlot,#722F37)", lineHeight: 1, opacity: 0.25 }}>{n}</span>
      <span style={{ fontFamily: "sans-serif", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--color-mocha,#5C4A3A)", opacity: 0.5 }}>{label}</span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function SeeAllClient({ locale }: SeeAllClientProps) {
  const isSv = locale === "sv";
  const G = 8; // gap in px

  const [
    sa1, sv1, sv2,   // 0-2  fashion
    sa2, sv3, sv4,   // 3-5  beauty
    sa3, sv5, sv6,   // 6-8  wellness + home
    sa4, sv7,        // 9-10 tech
    sa5, sa6, sv8, sv9, // 11-14 family
    sa7, sv10,       // 15-16 food
  ] = ITEMS;

  return (
    <div style={{ background: "#FAF8F4", minHeight: "100vh" }}>

      {/* ── HERO HEADER ──────────────────────────────────────────────────── */}
      <div style={{ padding: "120px 40px 0", maxWidth: 1400, margin: "0 auto" }}>
        <Link href={`/${locale}`} style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          fontFamily: "sans-serif", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase",
          color: "rgba(92,74,58,0.5)", textDecoration: "none",
          marginBottom: 56,
        }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-merlot,#722F37)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(92,74,58,0.5)")}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M10 7H4M4 7L7 4M4 7L7 10" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/></svg>
          {isSv ? "Tillbaka" : "Back"}
        </Link>

        {/* Split editorial heading */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, flexWrap: "wrap", marginBottom: 48 }}>
          <div>
            <p style={{ fontFamily: "sans-serif", fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--color-merlot,#722F37)", marginBottom: 12 }}>
              {isSv ? "Allt arbete" : "All work"}
            </p>
            <h1 style={{
              fontFamily: "var(--font-serif,serif)",
              fontSize: "clamp(52px, 9vw, 120px)",
              fontWeight: 300,
              lineHeight: 0.9,
              color: "var(--color-dark,#2C1A0E)",
              letterSpacing: "-0.01em",
              margin: 0,
            }}>
              {isSv ? <>Se<br/><em style={{ fontStyle: "italic", color: "var(--color-merlot,#722F37)" }}>alla</em></> : <>See<br/><em style={{ fontStyle: "italic", color: "var(--color-merlot,#722F37)" }}>all</em></>}
            </h1>
          </div>

          {/* Right side: count + tagline */}
          <div style={{ textAlign: "right", paddingBottom: 8 }}>
            <p style={{ fontFamily: "var(--font-serif,serif)", fontSize: "clamp(48px,5vw,72px)", fontWeight: 300, color: "rgba(44,26,14,0.08)", lineHeight: 1, margin: 0 }}>
              17
            </p>
            <p style={{ fontFamily: "sans-serif", fontSize: 12, color: "rgba(92,74,58,0.5)", letterSpacing: "0.1em", marginTop: 4 }}>
              {isSv ? "arbeten" : "works"}
            </p>
          </div>
        </div>
      </div>

      <Marquee locale={locale} />

      {/* ── BLOCK 1: Fashion — big + stacked ─────────────────────────────── */}
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: `${G * 4}px 40px 0` }}>
        <SectionMark n="01" label={isSv ? "Mode" : "Fashion"} />
        <div style={{ display: "flex", gap: G, alignItems: "stretch" }}>
          {/* Large left */}
          <MediaCard item={sa1} locale={locale} direction="left" delay={0} sizes="60vw"
            style={{ flex: "0 0 62%", aspectRatio: "4/5" }} />
          {/* Two stacked right */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: G }}>
            <MediaCard item={sv1} locale={locale} direction="right" delay={80} sizes="35vw"
              style={{ flex: 1 }} />
            <MediaCard item={sv2} locale={locale} direction="right" delay={160} sizes="35vw"
              style={{ flex: 1 }} />
          </div>
        </div>
      </div>

      {/* ── BLOCK 2: Beauty — three equal ────────────────────────────────── */}
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: `${G * 4}px 40px 0` }}>
        <SectionMark n="02" label="Beauty" />
        <div style={{ display: "flex", gap: G }}>
          <MediaCard item={sa2} locale={locale} direction="left"  delay={0}   sizes="33vw"
            style={{ flex: 1, aspectRatio: "3/4" }} />
          <MediaCard item={sv3} locale={locale} direction="up"    delay={100} sizes="33vw"
            style={{ flex: 1, aspectRatio: "3/4", marginTop: "5%" }} />
          <MediaCard item={sv4} locale={locale} direction="right" delay={200} sizes="33vw"
            style={{ flex: 1, aspectRatio: "3/4" }} />
        </div>
      </div>

      <PullQuote locale={locale} />

      {/* ── BLOCK 3: Home + Wellness — offset pair ────────────────────────── */}
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: `0 40px` }}>
        <SectionMark n="03" label={isSv ? "Hem & Träning" : "Home & Wellness"} />
        <div style={{ display: "flex", gap: G, alignItems: "flex-start" }}>
          {/* Narrow left */}
          <div style={{ flex: "0 0 36%", display: "flex", flexDirection: "column", gap: G }}>
            <MediaCard item={sa3} locale={locale} direction="left" delay={0} sizes="36vw"
              style={{ aspectRatio: "1/1" }} />
            <MediaCard item={sv6} locale={locale} direction="left" delay={120} sizes="36vw"
              style={{ aspectRatio: "4/5" }} />
          </div>
          {/* Wide right — tall */}
          <MediaCard item={sv5} locale={locale} direction="right" delay={80} sizes="60vw"
            style={{ flex: 1, aspectRatio: "2/3", alignSelf: "stretch" }} />
        </div>
      </div>

      {/* ── BLOCK 4: Tech — asymmetric ───────────────────────────────────── */}
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: `${G * 4}px 40px 0` }}>
        <SectionMark n="04" label={isSv ? "Elektronik" : "Tech"} />
        <div style={{ display: "flex", gap: G, alignItems: "stretch" }}>
          <MediaCard item={sv7} locale={locale} direction="left" delay={0} sizes="60vw"
            style={{ flex: "0 0 60%", aspectRatio: "16/9" }} />
          <MediaCard item={sa4} locale={locale} direction="right" delay={120} sizes="38vw"
            style={{ flex: 1, aspectRatio: "4/5" }} />
        </div>
      </div>

      <Marquee locale={locale} />

      {/* ── BLOCK 5: Family — four-grid ──────────────────────────────────── */}
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: `${G * 4}px 40px 0` }}>
        <SectionMark n="05" label={isSv ? "Familj" : "Family"} />

        {/* Top row: 2 items */}
        <div style={{ display: "flex", gap: G, marginBottom: G }}>
          <MediaCard item={sa5} locale={locale} direction="left"  delay={0}   sizes="50vw"
            style={{ flex: 1, aspectRatio: "4/5" }} />
          <MediaCard item={sv8} locale={locale} direction="right" delay={100} sizes="50vw"
            style={{ flex: 1, aspectRatio: "4/5", marginTop: "8%" }} />
        </div>
        {/* Bottom row: wide + narrow */}
        <div style={{ display: "flex", gap: G }}>
          <MediaCard item={sv9} locale={locale} direction="left"  delay={60}  sizes="65vw"
            style={{ flex: "0 0 64%", aspectRatio: "16/9" }} />
          <MediaCard item={sa6} locale={locale} direction="right" delay={160} sizes="34vw"
            style={{ flex: 1, aspectRatio: "4/5" }} />
        </div>
      </div>

      {/* ── BLOCK 6: Food — editorial finale ─────────────────────────────── */}
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: `${G * 4}px 40px ${G * 8}px` }}>
        <SectionMark n="06" label={isSv ? "Mat & Dryck" : "Food & Drink"} />

        {/* Full-width video */}
        <MediaCard item={sv10} locale={locale} direction="scale" delay={0} sizes="100vw"
          style={{ width: "100%", aspectRatio: "21/9", marginBottom: G }} />

        {/* Single centered image */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <MediaCard item={sa7} locale={locale} direction="up" delay={120} sizes="40vw"
            style={{ width: "40%", aspectRatio: "4/5" }} />
        </div>
      </div>

      {/* ── FOOTER STRIP ─────────────────────────────────────────────────── */}
      <div style={{
        borderTop: "1px solid rgba(44,26,14,0.1)",
        padding: "32px 40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        maxWidth: 1400,
        margin: "0 auto",
      }}>
        <Link href={`/${locale}`} style={{
          fontFamily: "sans-serif", fontSize: 10, letterSpacing: "0.18em",
          textTransform: "uppercase", color: "rgba(92,74,58,0.45)", textDecoration: "none",
          display: "flex", alignItems: "center", gap: 8,
        }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-merlot,#722F37)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(92,74,58,0.45)")}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M10 7H4M4 7L7 4M4 7L7 10" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/></svg>
          {isSv ? "Tillbaka till start" : "Back to home"}
        </Link>
        <p style={{ fontFamily: "var(--font-serif,serif)", fontSize: 13, fontWeight: 300, color: "rgba(44,26,14,0.3)", fontStyle: "italic" }}>
          Sofie Gullström
        </p>
      </div>

    </div>
  );
}
